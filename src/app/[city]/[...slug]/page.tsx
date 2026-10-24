import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  resolveCitySlug,
  resolveCityDisplayName,
  getBaseSiteUrl,
  resolveListingSeo,
  resolveListingUrl,
  resolveCategoryUrl,
  type ResolvableListing,
} from "@/lib/seo/url-resolver";
import {
  getTaxonomyCategories,
  getTaxonomyCategoryById,
  type Locale,
  type TaxonomyCategory,
} from "@/lib/seo/taxonomy-store";
import { resolveUrlAlias, normalizePath } from "@/lib/seo/url-alias-store";
import { CATALOG_PROPERTIES, type CatalogProperty } from "@/lib/catalog-data";
import {
  Building2,
  Home,
  MapPin,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Phone,
  MessageCircle,
  Share2,
  Heart,
  Calendar,
  Eye,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const VALID_CITY_SLUGS = new Set([
  "khujand",
  "dushanbe",
  "gafurov",
  "guliston",
  "buston",
  "isfara",
  "istaravshan",
  "konibodom",
  "panjakent",
]);

interface DynamicSeoPageProps {
  params: Promise<{ city: string; slug: string[] }>;
  searchParams?: Promise<{ locale?: string; lang?: string }>;
}

function resolveLocale(sp?: { locale?: string; lang?: string }): Locale {
  const l = sp?.locale || sp?.lang;
  if (l === "tg") return "tg";
  if (l === "en") return "en";
  return "ru";
}

/**
 * Finds a matching listing by ID candidate or slug segment
 */
function findListingBySlug(lastSegment: string): CatalogProperty | undefined {
  // Check exact ID or slug match
  const exact = CATALOG_PROPERTIES.find(
    (p) => p.id === lastSegment || p.slug === lastSegment
  );
  if (exact) return exact;

  // Extract trailing ID e.g. "1-komn-kvartira-4-etazh-44-m2-sholkombinat-17034738" -> "17034738"
  const match = lastSegment.match(/(?:-|^)(\d+|c\d+)$/i);
  if (match) {
    const id = match[1];
    const byId = CATALOG_PROPERTIES.find((p) => p.id === id || p.id === `c${id}`);
    if (byId) return byId;
  }

  // Fallback slug suffix match
  return CATALOG_PROPERTIES.find((p) => lastSegment.endsWith(`-${p.id}`));
}

/**
 * Finds a matching taxonomy category by slug across locales
 */
function findCategoryBySlug(catSlug: string): TaxonomyCategory | undefined {
  const categories = getTaxonomyCategories();
  return categories.find(
    (c) =>
      c.slug.ru === catSlug ||
      c.slug.tg === catSlug ||
      c.slug.en === catSlug ||
      c.code === catSlug
  );
}

/**
 * Checks if a slug represents a deal type (buy or rent)
 */
function resolveDealKind(dealSlug: string): "sale" | "rent" | null {
  const s = dealSlug.toLowerCase();
  if (s === "kupit" || s === "furosh" || s === "sale") return "sale";
  if (s === "arenda" || s === "ijora" || s === "rent") return "rent";
  return null;
}

export async function generateMetadata({
  params,
  searchParams,
}: DynamicSeoPageProps): Promise<Metadata> {
  const { city, slug } = await params;
  const sp = searchParams ? await searchParams : undefined;
  const citySlug = resolveCitySlug(city);

  if (!VALID_CITY_SLUGS.has(citySlug) || !slug || slug.length === 0) {
    return { title: "Не найдено — Maskani.tj" };
  }

  const locale = resolveLocale(sp);
  const lastSegment = slug[slug.length - 1];
  const listing = findListingBySlug(lastSegment);

  if (listing) {
    const seo = resolveListingSeo(
      {
        id: listing.id,
        slug: listing.slug,
        title: listing.title,
        titleTg: listing.titleTg,
        dealType: listing.dealType,
        propertyType: listing.propertyType,
        city: listing.city,
        cityTg: listing.cityTg,
        district: listing.district,
        priceTjs: listing.priceTjs,
        priceUsd: listing.priceUsd,
        area: listing.area,
        rooms: listing.rooms,
        address: `${listing.city}, ${listing.district || ""}`,
        image: listing.image,
        photos: listing.images,
        status: "active",
      },
      locale
    );

    return {
      title: seo.title,
      description: seo.description,
      alternates: {
        canonical: seo.canonicalUrl,
        languages: Object.fromEntries(seo.hreflang.map((h) => [h.lang, h.url])),
      },
      openGraph: {
        title: seo.openGraph.title,
        description: seo.openGraph.description,
        url: seo.openGraph.url,
        siteName: "Maskani.tj",
        images: [{ url: seo.openGraph.image }],
        type: "article",
      },
    };
  }

  // Category or deal metadata
  const catSlugCandidate = slug.length >= 2 ? slug[1] : slug[0];
  const category = findCategoryBySlug(catSlugCandidate);
  const cityName = resolveCityDisplayName(citySlug, locale);
  const baseUrl = getBaseSiteUrl();

  if (category) {
    const h1 = category.seoTemplates.h1[locale].replace("{city}", cityName);
    const title = category.seoTemplates.title[locale].replace("{city}", cityName);
    const description = category.seoTemplates.description[locale].replace("{city}", cityName);

    const canonicalPath = resolveCategoryUrl({ category, citySlug, locale });

    return {
      title,
      description,
      alternates: {
        canonical: `${baseUrl}${canonicalPath}`,
        languages: {
          ru: `${baseUrl}${resolveCategoryUrl({ category, citySlug, locale: "ru" })}`,
          tg: `${baseUrl}${resolveCategoryUrl({ category, citySlug, locale: "tg" })}`,
          en: `${baseUrl}${resolveCategoryUrl({ category, citySlug, locale: "en" })}`,
          "x-default": `${baseUrl}${resolveCategoryUrl({ category, citySlug, locale: "ru" })}`,
        },
      },
      openGraph: {
        title,
        description,
        url: `${baseUrl}${canonicalPath}`,
        siteName: "Maskani.tj",
        type: "website",
      },
    };
  }

  // Deal hub metadata (e.g. /khujand/kupit)
  const dealKind = resolveDealKind(slug[0]);
  if (dealKind) {
    const dealName =
      dealKind === "sale"
        ? locale === "tg" ? "Хариду фурӯш" : locale === "en" ? "Properties for Sale" : "Купить недвижимость"
        : locale === "tg" ? "Иҷораи амвол" : locale === "en" ? "Properties for Rent" : "Аренда недвижимости";

    const title = `${dealName} в ${cityName} — Каталог объектов | Maskani.tj`;
    const description = `Все объекты в категории «${dealName}» в городе ${cityName}. Проверенные предложения на Maskani.tj.`;
    const prefix = locale === "ru" ? "" : `/${locale}`;
    const canonicalPath = `${prefix}/${citySlug}/${slug[0]}`;

    return {
      title,
      description,
      alternates: {
        canonical: `${baseUrl}${canonicalPath}`,
      },
    };
  }

  return { title: "Не найдено — Maskani.tj" };
}

export default async function DynamicSeoPage({ params, searchParams }: DynamicSeoPageProps) {
  const { city, slug } = await params;
  const sp = searchParams ? await searchParams : undefined;
  const citySlug = resolveCitySlug(city);

  if (!VALID_CITY_SLUGS.has(citySlug) || !slug || slug.length === 0) {
    notFound();
  }

  const locale = resolveLocale(sp);
  const baseUrl = getBaseSiteUrl();
  const prefix = locale === "ru" ? "" : `/${locale}`;
  const requestPath = normalizePath(`${prefix}/${citySlug}/${slug.join("/")}`);

  // 1. Check for registered 301 alias redirect
  const aliasMatch = resolveUrlAlias(requestPath);
  if (aliasMatch && aliasMatch.targetPath !== requestPath) {
    redirect(aliasMatch.targetPath);
  }

  const lastSegment = slug[slug.length - 1];
  const listing = findListingBySlug(lastSegment);

  // ==========================================
  // CASE A: LISTING DETAIL PAGE
  // ==========================================
  if (listing) {
    const seo = resolveListingSeo(
      {
        id: listing.id,
        slug: listing.slug,
        title: listing.title,
        titleTg: listing.titleTg,
        dealType: listing.dealType,
        propertyType: listing.propertyType,
        city: listing.city,
        cityTg: listing.cityTg,
        district: listing.district,
        priceTjs: listing.priceTjs,
        priceUsd: listing.priceUsd,
        area: listing.area,
        rooms: listing.rooms,
        address: `${listing.city}, ${listing.district || ""}`,
        image: listing.image,
        photos: listing.images,
        status: "active",
      },
      locale
    );

    const isTg = locale === "tg";
    const isEn = locale === "en";

    return (
      <div className="min-h-screen bg-[#F8FAFC] pb-24">
        {/* Schema.org Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(seo.breadcrumbJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(seo.realEstateJsonLd) }}
        />

        {/* Top Breadcrumb Bar */}
        <div className="bg-white border-b border-slate-200/80 sticky top-0 z-20 backdrop-blur-md bg-white/95">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 truncate">
              {seo.breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={idx}>
                  {idx > 0 && <span className="text-slate-300">/</span>}
                  {crumb.url && idx < seo.breadcrumbs.length - 1 ? (
                    <Link
                      href={crumb.url.replace(/^https?:\/\/[^/]+/, "") || "/"}
                      className="hover:text-emerald-700 font-medium shrink-0"
                    >
                      {crumb.name}
                    </Link>
                  ) : (
                    <span className="truncate text-slate-800 font-semibold">{crumb.name}</span>
                  )}
                </React.Fragment>
              ))}
            </div>

            <Link href={`${prefix}/classifieds`}>
              <Button variant="ghost" size="sm" className="text-xs text-slate-600 gap-1">
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>{isTg ? "Ба каталог" : isEn ? "To Catalog" : "В каталог"}</span>
              </Button>
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
          {/* Header: Badges & H1 Title */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-emerald-600 text-white font-medium text-xs">
                {isTg ? (listing.dealType === "Аренда" ? "Иҷора" : "Фурӯш") : listing.dealType}
              </Badge>
              <Badge variant="secondary" className="bg-white text-slate-800 border border-slate-200 font-medium text-xs">
                {isTg && listing.propertyType === "Квартира" ? "Хонадон" : listing.propertyType}
              </Badge>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {seo.h1}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 flex items-center gap-1.5 font-medium">
              <MapPin className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>
                {listing.city}, {listing.district || ""}
              </span>
            </p>
          </div>

          {/* Grid Layout: Main Content (Left) + Sticky Actions (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Left 2 Cols: Photo & Specifications */}
            <div className="lg:col-span-2 space-y-6">
              <div className="relative w-full h-80 sm:h-96 md:h-[480px] rounded-2xl overflow-hidden bg-slate-900 shadow-sm">
                <img
                  src={listing.image}
                  alt={seo.h1}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Specs Card */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                  {isTg ? "Мушаххасоти асосӣ" : isEn ? "Key Specifications" : "Характеристики объекта"}
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block mb-0.5">{isTg ? "Масоҳат" : isEn ? "Area" : "Общая площадь"}</span>
                    <span className="font-bold text-slate-900 text-sm">{listing.area} м²</span>
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block mb-0.5">{isTg ? "Ҳуҷраҳо" : isEn ? "Rooms" : "Количество комнат"}</span>
                    <span className="font-bold text-slate-900 text-sm">{listing.rooms}</span>
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block mb-0.5">{isTg ? "Ошёна" : isEn ? "Floor" : "Этаж"}</span>
                    <span className="font-bold text-slate-900 text-sm">{listing.floor || "—"}</span>
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block mb-0.5">{isTg ? "Навъи муомила" : isEn ? "Deal Type" : "Тип сделки"}</span>
                    <span className="font-bold text-slate-900 text-sm">{listing.dealType}</span>
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block mb-0.5">{isTg ? "Намуди амвол" : isEn ? "Property Type" : "Тип недвижимости"}</span>
                    <span className="font-bold text-slate-900 text-sm">{listing.propertyType}</span>
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block mb-0.5">{isTg ? "Фурӯшанда" : isEn ? "Seller" : "Продавец"}</span>
                    <span className="font-bold text-slate-900 text-sm">{listing.sellerType || "Собственник"}</span>
                  </div>
                </div>
              </div>

              {/* Description Card */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-3">
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                  {isTg ? "Тавсифи амвол" : isEn ? "Description" : "Описание"}
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {listing.description || seo.description}
                </p>
              </div>
            </div>

            {/* Right 1 Col: Sticky Pricing & Action Cards */}
            <div className="space-y-4 lg:sticky lg:top-20 self-start">
              {/* Publication Date Card */}
              <div className="bg-white border border-slate-200/80 rounded-2xl px-5 py-4 shadow-xs flex items-center justify-between text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Calendar className="h-3.5 w-3.5" />
                  </div>
                  <span className="font-semibold text-slate-800">
                    {isTg ? "Фаъол дар пойгоҳ" : isEn ? "Active listing" : "Актуально в базе"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 font-bold text-slate-900 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                  <Eye className="h-3.5 w-3.5 text-slate-400" />
                  <span>48</span>
                </div>
              </div>

              {/* Price Block */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
                <div>
                  <div className="text-xs text-slate-400 font-medium mb-1">
                    {isTg ? "Арзиши амвол" : isEn ? "Property Price" : "Стоимость объекта"}
                  </div>
                  <div className="text-3xl font-extrabold text-emerald-600 tracking-tight">
                    {listing.priceTjs?.toLocaleString()} сомони
                  </div>
                  <div className="text-xs font-semibold text-slate-500 mt-1">
                    ≈ ${listing.priceUsd?.toLocaleString()} USD
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <a
                    href={`tel:${listing.phone || "+992927005555"}`}
                    className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    <Phone className="h-4 w-4" />
                    <span>{listing.phone || "+992 92 700 5555"}</span>
                  </a>

                  <a
                    href={`https://wa.me/${(listing.whatsapp || listing.phone || "+992927005555").replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full h-10 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <MessageCircle className="h-4 w-4 text-emerald-600" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Safety notice */}
              <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 text-xs text-amber-900 flex items-start gap-2.5">
                <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="leading-snug">
                  {isTg
                    ? "Пеш аз бастани аҳд, ҳақиқияти ҳуҷҷатҳоро шахсан санҷед. Ҳаргиз пешпардохт нагузаронед."
                    : isEn
                    ? "Verify all property documentation before entering into an agreement. Never send advance deposits to strangers."
                    : "Перед сделкой обязательно проверьте оригиналы документов на недвижимость. Не отправляйте предоплату."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // CASE B: CATEGORY OR DEAL HUB PAGE
  // ==========================================
  const catSlugCandidate = slug.length >= 2 ? slug[1] : slug[0];
  const category = findCategoryBySlug(catSlugCandidate);
  const dealKind = resolveDealKind(slug[0]);
  const cityName = resolveCityDisplayName(citySlug, locale);

  if (!category && !dealKind) {
    notFound();
  }

  // Filter listings
  const filteredListings = CATALOG_PROPERTIES.filter((p) => {
    if (resolveCitySlug(p.city) !== citySlug) return false;
    if (dealKind) {
      const isRent = p.dealType.toLowerCase().includes("аренда") || p.dealType.toLowerCase().includes("rent");
      if (dealKind === "rent" && !isRent) return false;
      if (dealKind === "sale" && isRent) return false;
    }
    if (category?.propertyType) {
      if (category.propertyType === "apartment" && !p.propertyType.toLowerCase().includes("квартир")) {
        return false;
      }
      if (category.propertyType === "house" && !p.propertyType.toLowerCase().includes("дом") && !p.propertyType.toLowerCase().includes("ҳавлӣ")) {
        return false;
      }
    }
    return true;
  });

  const pageTitle = category
    ? category.seoTemplates.h1[locale].replace("{city}", cityName)
    : `${dealKind === "sale" ? (locale === "tg" ? "Хариду фурӯш" : locale === "en" ? "Properties for Sale" : "Купить недвижимость") : (locale === "tg" ? "Иҷора" : locale === "en" ? "Rentals" : "Аренда")} в ${cityName}`;

  const breadcrumbs = [
    {
      name: locale === "tg" ? "Асосӣ" : locale === "en" ? "Home" : "Главная",
      url: `${baseUrl}${prefix || "/"}`,
    },
    {
      name: cityName,
      url: `${baseUrl}${prefix}/${citySlug}`,
    },
  ];

  if (category) {
    breadcrumbs.push({
      name: category.name[locale],
      url: `${baseUrl}${resolveCategoryUrl({ category, citySlug, locale })}`,
    });
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((b, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: b.name,
      item: b.url,
    })),
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* Schema.org Breadcrumbs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Top Breadcrumb Bar */}
      <div className="bg-white border-b border-slate-200/80 sticky top-0 z-20 backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500 truncate">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span className="text-slate-300">/</span>}
                {idx < breadcrumbs.length - 1 ? (
                  <Link
                    href={crumb.url.replace(/^https?:\/\/[^/]+/, "") || "/"}
                    className="hover:text-emerald-700 font-medium shrink-0"
                  >
                    {crumb.name}
                  </Link>
                ) : (
                  <span className="text-slate-800 font-semibold truncate">{crumb.name}</span>
                )}
              </React.Fragment>
            ))}
          </div>

          <Badge variant="outline" className="border-emerald-200 text-emerald-800 bg-emerald-50 text-xs">
            {cityName}
          </Badge>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* Category Header */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {pageTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {locale === "tg"
              ? `Дар база ${filteredListings.length} пешниҳод дар шаҳри ${cityName} ёфт шуд.`
              : locale === "en"
              ? `Found ${filteredListings.length} verified listings in ${cityName}.`
              : `Найдено ${filteredListings.length} проверенных объявлений в городе ${cityName}.`}
          </p>
        </div>

        {/* Listings Grid */}
        {filteredListings.length === 0 ? (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center space-y-3">
            <Building2 className="h-12 w-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">
              {locale === "tg"
                ? "Дар ин бахш ҳоло эълон нест"
                : locale === "en"
                ? "No listings in this category yet"
                : "В этой категории пока нет предложений"}
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {locale === "tg"
                ? "Шумо метавонед ба саҳифаи асосии шаҳр гузаред ё аввалин шуда эълон гузоред."
                : locale === "en"
                ? "You can browse other categories or post the first listing here."
                : "Попробуйте выбрать другой раздел или станьте первым, кто подаст объявление."}
            </p>
            <Link href={`${prefix}/${citySlug}`}>
              <Button variant="outline" className="text-xs rounded-xl mt-2">
                {locale === "tg" ? `Ба саҳифаи ${cityName}` : locale === "en" ? `Back to ${cityName}` : `К разделу ${cityName}`}
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredListings.map((item) => (
              <Link
                key={item.id}
                href={`${prefix}/classifieds/${item.slug || item.id}`}
                className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:border-emerald-500 hover:shadow-lg transition-all flex flex-col"
              >
                <div className="relative aspect-4/3 bg-slate-900 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <Badge className="bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-semibold border-none">
                      {locale === "tg"
                        ? item.dealType === "Аренда" ? "Иҷора" : "Фурӯш"
                        : item.dealType}
                    </Badge>
                  </div>
                </div>

                <div className="p-4 sm:p-5 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-xl font-extrabold text-slate-900 tracking-tight">
                      {item.priceTjs?.toLocaleString()} TJS
                      <span className="text-xs font-semibold text-slate-400 ml-2">
                        (${item.priceUsd?.toLocaleString()})
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-800 text-sm line-clamp-2 mt-1 group-hover:text-emerald-700 transition-colors">
                      {locale === "tg" && item.titleTg ? item.titleTg : item.title}
                    </h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 truncate">
                      <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span>
                        {cityName}, {item.district || ""}
                      </span>
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>{item.area} м²</span>
                    <span>•</span>
                    <span>{item.rooms} {locale === "tg" ? "ҳуҷр." : locale === "en" ? "rooms" : "комн."}</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-bold group-hover:underline">
                      {locale === "tg" ? "Тафсилот" : locale === "en" ? "Details" : "Подробнее"}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
