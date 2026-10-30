/**
 * Unified URL & SEO Metadata Resolver
 * Single Source of Truth for Routes, Canonicals, Hreflang, Breadcrumbs, JSON-LD
 * Conforms to MASKANI.TJ SEO Specification v1.7 (Sections 1.1, 2, 3, 4, 10, 11, 12)
 */

import {
  type Locale,
  type TaxonomyCategory,
  findCategoryForListing,
  getTaxonomyCategoryById,
  transliterateToSlug,
} from "./taxonomy-store";
import { normalizePath } from "./url-alias-store";
import { getFacetById, type FacetConfig } from "./facet-store";
import { type MenuItem } from "../navigation/menu-store";

export interface ResolvableListing {
  id: string; // Stable numeric or uuid string ID
  slug?: string;
  title: string;
  titleTg?: string;
  dealType: string; // "Продажа" | "Аренда" | "sale" | "rent_long" | "rent_daily"
  propertyType: string; // "Квартира" | "Дом / Ҳавлӣ" | "apartment" | "house" etc.
  marketSegment?: "secondary" | "new_building";
  categoryId?: string;
  city: string; // "Худжанд" | "khujand" | "Душанбе" | "dushanbe"
  cityTg?: string;
  district?: string | null;
  districtTg?: string | null;
  complexSlug?: string;
  priceTjs: number;
  priceUsd: number;
  area?: number;
  rooms?: number | null;
  address?: string;
  photos?: string[];
  image?: string;
  status?: string;
  description?: string;
  updatedAt?: string;
}

export interface BreadcrumbItem {
  name: string;
  url?: string;
  position: number;
}

export interface ListingSeoResult {
  urlPath: string; // Relative path with locale
  canonicalUrl: string; // Absolute HTTPS URL
  locale: Locale;
  h1: string;
  title: string;
  description: string;
  hreflang: Array<{ lang: string; url: string }>;
  breadcrumbs: BreadcrumbItem[];
  breadcrumbJsonLd: Record<string, unknown>;
  realEstateJsonLd: Record<string, unknown>;
  openGraph: {
    title: string;
    description: string;
    url: string;
    image: string;
    locale: string;
    type: string;
  };
}

/**
 * Returns the base canonical domain without trailing slash.
 * Production defaults to https://maskani.tj
 */
export function getBaseSiteUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL;
  if (envUrl && !envUrl.includes("localhost")) {
    return envUrl.replace(/\/+$/, "");
  }
  return "https://maskani.tj";
}

/**
 * Translates city name into canonical URL-slug
 */
export function resolveCitySlug(cityName: string): string {
  const norm = (cityName || "khujand").toLowerCase().trim();
  if (norm.includes("хуҷ") || norm.includes("худж") || norm === "khujand") return "khujand";
  if (norm.includes("душанбе") || norm === "dushanbe") return "dushanbe";
  if (norm.includes("ғафур") || norm.includes("гафур") || norm === "gafurov") return "gafurov";
  if (norm.includes("гулистон") || norm.includes("кайрак") || norm === "guliston") return "guliston";
  if (norm.includes("бӯстон") || norm.includes("бустон") || norm.includes("чкалов") || norm === "buston") return "buston";
  if (norm.includes("исфара") || norm === "isfara") return "isfara";
  if (norm.includes("истаравшан") || norm === "istaravshan") return "istaravshan";
  if (norm.includes("конибодом") || norm.includes("канибадам") || norm === "konibodom") return "konibodom";
  if (norm.includes("панҷакент") || norm.includes("пенджикент") || norm === "panjakent") return "panjakent";
  return transliterateToSlug(norm) || "khujand";
}

/**
 * Returns localized city display name
 */
export function resolveCityDisplayName(citySlug: string, locale: Locale): string {
  const dict: Record<string, { ru: string; tg: string; en: string }> = {
    khujand: { ru: "Худжанд", tg: "Хуҷанд", en: "Khujand" },
    dushanbe: { ru: "Душанбе", tg: "Душанбе", en: "Dushanbe" },
    gafurov: { ru: "Б. Гафуров", tg: "Б. Ғафуров", en: "Gafurov" },
    guliston: { ru: "Гулистон", tg: "Гулистон", en: "Guliston" },
    buston: { ru: "Бустон", tg: "Бӯстон", en: "Buston" },
    isfara: { ru: "Исфара", tg: "Исфара", en: "Isfara" },
    istaravshan: { ru: "Истаравшан", tg: "Истаравшан", en: "Istaravshan" },
    konibodom: { ru: "Канибадам", tg: "Конибодом", en: "Konibodom" },
    panjakent: { ru: "Пенджикент", tg: "Панҷакент", en: "Panjakent" },
  };
  return dict[citySlug]?.[locale] || (locale === "tg" ? "Хуҷанд" : locale === "en" ? "Khujand" : "Худжанд");
}

/**
 * Formats a clean listing slug part from title
 */
export function formatListingTitleSlug(title: string): string {
  const translit = transliterateToSlug(title);
  return translit.slice(0, 50).replace(/-+$/, "");
}

/**
 * Resolves the Canonical URL Path for a listing.
 * Strict adherence to Section 3 (Locales) & Section 4 (URL Patterns):
 * - RU: no prefix -> /{city}/{deal}/{category}/[{district}/]{titleSlug}-{listing_id}/
 * - TG: /tg/ prefix -> /tg/{city}/{deal}/{category}/[{district}/]{titleSlug}-{listing_id}/
 * - EN: /en/ prefix -> /en/{city}/{deal}/{category}/[{district}/]{titleSlug}-{listing_id}/
 */
export function resolveListingUrl(listing: ResolvableListing, locale: Locale = "ru"): string {
  const category =
    (listing.categoryId && getTaxonomyCategoryById(listing.categoryId)) ||
    findCategoryForListing({
      dealType: listing.dealType,
      propertyType: listing.propertyType,
      marketSegment: listing.marketSegment,
    });

  const citySlug = resolveCitySlug(listing.city);
  const localePrefix = locale === "ru" ? "" : `/${locale}`;

  // If inside a new building complex
  if (listing.complexSlug) {
    const complexSlug = listing.complexSlug;
    const itemSlug = `${formatListingTitleSlug(listing.title)}-${listing.id}`;
    const newBuildSlug = category?.slug[locale] || (locale === "tg" ? "binohoi-nav" : locale === "en" ? "new-builds" : "novostroyki");
    const dealSlug = locale === "tg" ? "furosh" : locale === "en" ? "sale" : "kupit";
    return normalizePath(`${localePrefix}/${citySlug}/${dealSlug}/${newBuildSlug}/${complexSlug}/${itemSlug}`);
  }

  // Standard category URL path
  const dealSlug =
    category?.dealType === "rent_daily"
      ? category.slug[locale]
      : category?.parentId === "cat_deal_rent" || listing.dealType?.toLowerCase().includes("rent") || listing.dealType?.toLowerCase().includes("аренда")
      ? locale === "tg" ? "ijora" : locale === "en" ? "rent" : "arenda"
      : locale === "tg" ? "furosh" : locale === "en" ? "sale" : "kupit";

  const catSlug = category?.slug[locale] || (locale === "tg" ? "khonadon" : locale === "en" ? "apartments" : "kvartiry");
  const districtSlug = listing.district ? transliterateToSlug(listing.district) : null;
  const itemSlug = `${formatListingTitleSlug(listing.title)}-${listing.id}`;

  const districtPart = districtSlug ? `/${districtSlug}` : "";
  return normalizePath(`${localePrefix}/${citySlug}/${dealSlug}/${catSlug}${districtPart}/${itemSlug}`);
}

/**
 * Resolves the Canonical URL Path for a category.
 */
export function resolveCategoryUrl(params: {
  category: TaxonomyCategory;
  citySlug?: string;
  districtSlug?: string;
  locale?: Locale;
}): string {
  const locale = params.locale || "ru";
  const city = params.citySlug ? resolveCitySlug(params.citySlug) : "khujand";
  const localePrefix = locale === "ru" ? "" : `/${locale}`;
  const catSlug = params.category.slug[locale];

  if (params.category.routeKind === "deal") {
    return normalizePath(`${localePrefix}/${city}/${catSlug}`);
  }

  const dealSlug =
    params.category.parentId === "cat_deal_rent"
      ? locale === "tg" ? "ijora" : locale === "en" ? "rent" : "arenda"
      : locale === "tg" ? "furosh" : locale === "en" ? "sale" : "kupit";

  const districtPart = params.districtSlug ? `/${params.districtSlug}` : "";
  return normalizePath(`${localePrefix}/${city}/${dealSlug}/${catSlug}${districtPart}`);
}

/**
 * Builds visible Breadcrumbs and Schema.org BreadcrumbList for a listing
 */
export function resolveListingBreadcrumbs(
  listing: ResolvableListing,
  locale: Locale = "ru"
): { breadcrumbs: BreadcrumbItem[]; breadcrumbJsonLd: Record<string, unknown> } {
  const category =
    (listing.categoryId && getTaxonomyCategoryById(listing.categoryId)) ||
    findCategoryForListing({
      dealType: listing.dealType,
      propertyType: listing.propertyType,
      marketSegment: listing.marketSegment,
    });

  const citySlug = resolveCitySlug(listing.city);
  const cityName = resolveCityDisplayName(citySlug, locale);
  const baseUrl = getBaseSiteUrl();
  const localePrefix = locale === "ru" ? "" : `/${locale}`;

  const crumbs: BreadcrumbItem[] = [
    {
      position: 1,
      name: locale === "tg" ? "Асосӣ" : locale === "en" ? "Home" : "Главная",
      url: `${baseUrl}${localePrefix || "/"}`,
    },
    {
      position: 2,
      name: cityName,
      url: `${baseUrl}${localePrefix}/${citySlug}`,
    },
  ];

  if (category) {
    const catUrl = resolveCategoryUrl({ category, citySlug, locale });
    crumbs.push({
      position: 3,
      name: category.name[locale],
      url: `${baseUrl}${catUrl}`,
    });
  }

  if (listing.district) {
    const districtName = locale === "tg" && listing.districtTg ? listing.districtTg : listing.district;
    crumbs.push({
      position: crumbs.length + 1,
      name: districtName,
      url: category
        ? `${baseUrl}${resolveCategoryUrl({ category, citySlug, districtSlug: transliterateToSlug(listing.district), locale })}`
        : undefined,
    });
  }

  // Final crumb is the current listing title (no item URL per Schema.org best practice)
  const displayTitle = locale === "tg" && listing.titleTg ? listing.titleTg : listing.title;
  crumbs.push({
    position: crumbs.length + 1,
    name: displayTitle,
  });

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c) => ({
      "@type": "ListItem",
      position: c.position,
      name: c.name,
      ...(c.url ? { item: c.url } : {}),
    })),
  };

  return { breadcrumbs: crumbs, breadcrumbJsonLd };
}

/**
 * Builds Schema.org RealEstateListing / Apartment / House JSON-LD
 * Strict adherence to Section 11 (data consistency & no hallucinated fields)
 */
export function resolveListingJsonLd(
  listing: ResolvableListing,
  locale: Locale = "ru"
): Record<string, unknown> {
  const baseUrl = getBaseSiteUrl();
  const path = resolveListingUrl(listing, locale);
  const canonicalUrl = `${baseUrl}${path}`;
  const displayTitle = locale === "tg" && listing.titleTg ? listing.titleTg : listing.title;
  const citySlug = resolveCitySlug(listing.city);
  const cityName = resolveCityDisplayName(citySlug, locale);

  const isRent =
    listing.dealType?.toLowerCase().includes("rent") ||
    listing.dealType?.toLowerCase().includes("аренда") ||
    listing.dealType?.toLowerCase().includes("иҷора");

  const schemaType =
    listing.propertyType?.toLowerCase().includes("house") ||
    listing.propertyType?.toLowerCase().includes("дом") ||
    listing.propertyType?.toLowerCase().includes("ҳавлӣ")
      ? "House"
      : "Apartment";

  const mainImage = listing.image || (listing.photos && listing.photos[0]) || `${baseUrl}/images/og-default.jpg`;

  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "@id": `${canonicalUrl}#listing`,
    url: canonicalUrl,
    name: displayTitle,
    inLanguage: locale,
    datePosted: listing.updatedAt || new Date().toISOString().split("T")[0],
    mainEntity: {
      "@type": schemaType,
      "@id": `${canonicalUrl}#property`,
      name: displayTitle,
      description: listing.description || displayTitle,
      image: mainImage,
      address: {
        "@type": "PostalAddress",
        addressLocality: cityName,
        addressRegion: "Согдийская область",
        streetAddress: listing.address || cityName,
        addressCountry: "TJ",
      },
      ...(listing.area ? { floorSize: { "@type": "QuantitativeValue", value: listing.area, unitCode: "MTK" } } : {}),
      ...(listing.rooms ? { numberOfRooms: listing.rooms } : {}),
      offers: {
        "@type": "Offer",
        price: listing.priceTjs,
        priceCurrency: "TJS",
        businessFunction: isRent ? "http://purl.org/goodrelations/v1#LeaseOut" : "http://purl.org/goodrelations/v1#Sell",
        availability: listing.status === "sold" ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
        url: canonicalUrl,
      },
    },
  };
}

/**
 * Resolves complete SEO Bundle for a Listing
 */
export function resolveListingSeo(
  listing: ResolvableListing,
  locale: Locale = "ru"
): ListingSeoResult {
  const baseUrl = getBaseSiteUrl();
  const path = resolveListingUrl(listing, locale);
  const canonicalUrl = `${baseUrl}${path}`;
  const displayTitle = locale === "tg" && listing.titleTg ? listing.titleTg : listing.title;
  const citySlug = resolveCitySlug(listing.city);
  const cityName = resolveCityDisplayName(citySlug, locale);

  const ruPath = resolveListingUrl(listing, "ru");
  const tgPath = resolveListingUrl(listing, "tg");
  const enPath = resolveListingUrl(listing, "en");

  // Reciprocal hreflang
  const hreflang = [
    { lang: "ru", url: `${baseUrl}${ruPath}` },
    { lang: "tg", url: `${baseUrl}${tgPath}` },
    { lang: "en", url: `${baseUrl}${enPath}` },
    { lang: "x-default", url: `${baseUrl}${ruPath}` }, // RU is default fallback
  ];

  const { breadcrumbs, breadcrumbJsonLd } = resolveListingBreadcrumbs(listing, locale);
  const realEstateJsonLd = resolveListingJsonLd(listing, locale);

  const priceStr = listing.priceTjs ? `${listing.priceTjs.toLocaleString()} сомони` : "";
  const h1 = displayTitle;
  const title = `${displayTitle} — ${priceStr} | ${cityName} | Maskani`;
  const description = `${displayTitle} в ${cityName}. ${listing.area ? `${listing.area} м², ` : ""}${priceStr}. Проверенные объявления недвижимости на Maskani.tj.`;
  const mainImage = listing.image || (listing.photos && listing.photos[0]) || `${baseUrl}/images/og-default.jpg`;

  return {
    urlPath: path,
    canonicalUrl,
    locale,
    h1,
    title,
    description,
    hreflang,
    breadcrumbs,
    breadcrumbJsonLd,
    realEstateJsonLd,
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      image: mainImage,
      locale: locale === "tg" ? "tg_TJ" : locale === "en" ? "en_US" : "ru_RU",
      type: "article",
    },
  };
}

/**
 * Resolves the Canonical URL Path for a facet (e.g. offices, retail, rooms).
 * URL pattern: /{localePrefix}/{city}/{dealSlug}/{categorySlug}/{facetSlug}/
 */
export function resolveFacetUrl(params: {
  facet: FacetConfig;
  citySlug?: string;
  locale?: Locale;
}): string {
  const locale = params.locale || "ru";
  const city = params.citySlug ? resolveCitySlug(params.citySlug) : "khujand";
  const localePrefix = locale === "ru" ? "" : `/${locale}`;

  const category = getTaxonomyCategoryById(params.facet.categoryId);
  if (!category) {
    return normalizePath(`${localePrefix}/${city}`);
  }

  const dealSlug =
    category.parentId === "cat_deal_rent"
      ? locale === "tg" ? "ijora" : locale === "en" ? "rent" : "arenda"
      : locale === "tg" ? "furosh" : locale === "en" ? "sale" : "kupit";

  const catSlug = category.slug[locale];
  const facetSlug = params.facet.valueSlug[locale];

  return normalizePath(`${localePrefix}/${city}/${dealSlug}/${catSlug}/${facetSlug}`);
}

/**
 * Resolves URLs for City-level Catalogs (Commercial Hub, Developers, Agencies, Services).
 * Commercial Hub: /{localePrefix}/{city}/kommercheskaya/
 * Developers: /{localePrefix}/{city}/zastroyshchiki/
 * Agencies: /{localePrefix}/{city}/agentstva/
 * Services: /{localePrefix}/{city}/uslugi/
 */
export function resolveCatalogUrl(
  catalogId: string,
  citySlug?: string,
  locale: Locale = "ru"
): string {
  const city = citySlug ? resolveCitySlug(citySlug) : "khujand";
  const localePrefix = locale === "ru" ? "" : `/${locale}`;

  switch (catalogId) {
    case "catalog_commercial_hub": {
      const slug = locale === "tg" ? "tijorati" : locale === "en" ? "commercial" : "kommercheskaya";
      return normalizePath(`${localePrefix}/${city}/${slug}`);
    }
    case "catalog_developers": {
      const slug = locale === "tg" ? "sohtmonchiyon" : locale === "en" ? "developers" : "zastroyshchiki";
      return normalizePath(`${localePrefix}/${city}/${slug}`);
    }
    case "catalog_agencies": {
      const slug = locale === "tg" ? "agenticho" : locale === "en" ? "agencies" : "agentstva";
      return normalizePath(`${localePrefix}/${city}/${slug}`);
    }
    case "catalog_services": {
      const slug = locale === "tg" ? "khizmatrasoniho" : locale === "en" ? "services" : "uslugi";
      return normalizePath(`${localePrefix}/${city}/${slug}`);
    }
    case "catalog_buy_hub": {
      const slug = locale === "tg" ? "furosh" : locale === "en" ? "sale" : "kupit";
      return normalizePath(`${localePrefix}/${city}/${slug}`);
    }
    case "catalog_rent_hub": {
      const slug = locale === "tg" ? "ijora" : locale === "en" ? "rent" : "arenda";
      return normalizePath(`${localePrefix}/${city}/${slug}`);
    }
    default:
      return normalizePath(`${localePrefix}/${city}`);
  }
}

/**
 * Resolves URL for any MenuItem dynamically
 */
export function resolveMenuItemUrl(
  item: MenuItem,
  citySlug?: string,
  locale: Locale = "ru"
): string {
  if (item.type === "group-header") {
    return "";
  }

  if (item.type === "action-button") {
    return "/classifieds/new";
  }

  if (item.type === "link-to-static-page" && item.customUrl) {
    return item.customUrl[locale] || "/";
  }

  if (item.type === "link-to-catalog" && item.targetId) {
    return resolveCatalogUrl(item.targetId, citySlug, locale);
  }

  if (item.type === "link-to-facet" && item.targetId) {
    const facet = getFacetById(item.targetId);
    if (facet) {
      return resolveFacetUrl({ facet, citySlug, locale });
    }
  }

  if (item.type === "link-to-category" && item.targetId) {
    const category = getTaxonomyCategoryById(item.targetId);
    if (category) {
      return resolveCategoryUrl({ category, citySlug, locale });
    }
  }

  return normalizePath(locale === "ru" ? `/${citySlug || "khujand"}` : `/${locale}/${citySlug || "khujand"}`);
}

