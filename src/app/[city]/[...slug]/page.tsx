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
  resolveFacetUrl,
  resolveCatalogUrl,
  type ResolvableListing,
} from "@/lib/seo/url-resolver";
import {
  getTaxonomyCategories,
  getTaxonomyCategoryById,
  type Locale,
  type TaxonomyCategory,
} from "@/lib/seo/taxonomy-store";
import {
  findFacetBySlug,
  getFacetsByCategory,
  type FacetConfig,
} from "@/lib/seo/facet-store";
import {
  findDistrictBySlug,
  isDistrictIndexable,
  getDistricts,
  type DistrictConfig,
} from "@/lib/seo/district-store";
import { resolveUrlAlias, normalizePath } from "@/lib/seo/url-alias-store";
import { ALL_PROPERTIES, type CatalogProperty } from "@/lib/catalog-data";
import { INITIAL_DEVELOPERS } from "@/lib/data/mock-db";
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
  Briefcase,
  Store,
  Warehouse,
  Check,
  ChevronRight,
  SlidersHorizontal,
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
  const exact = ALL_PROPERTIES.find(
    (p) => p.id === lastSegment || p.slug === lastSegment
  );
  if (exact) return exact;

  const match = lastSegment.match(/(?:-|^)(\d+|c\d+)$/i);
  if (match) {
    const id = match[1];
    const byId = ALL_PROPERTIES.find((p) => p.id === id || p.id === `c${id}`);
    if (byId) return byId;
  }

  return ALL_PROPERTIES.find((p) => lastSegment.endsWith(`-${p.id}`));
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

/**
 * Checks if single-segment slug is a special city catalog
 */
function resolveCityCatalogKind(
  segment: string
): "commercial_hub" | "developers" | "agencies" | "services" | null {
  const s = segment.toLowerCase();
  if (s === "kommercheskaya" || s === "tijorati" || s === "commercial") return "commercial_hub";
  if (s === "zastroyshchiki" || s === "sohtmonchiyon" || s === "developers") return "developers";
  if (s === "agentstva" || s === "agenticho" || s === "agencies") return "agencies";
  if (s === "uslugi" || s === "khizmatrasoniho" || s === "services") return "services";
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
  const cityName = resolveCityDisplayName(citySlug, locale);
  const baseUrl = getBaseSiteUrl();

  // 1. Listing Detail Page Metadata
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

  // 2. City Catalogs (e.g. /khujand/kommercheskaya, /khujand/zastroyshchiki, etc.)
  if (slug.length === 1) {
    const catalogKind = resolveCityCatalogKind(slug[0]);
    if (catalogKind) {
      if (catalogKind === "commercial_hub") {
        const title =
          locale === "tg"
            ? `Амволи тиҷоратӣ дар ${cityName} — Харид ва иҷора | Maskani.tj`
            : locale === "en"
            ? `Commercial Real Estate in ${cityName} — Sale & Rent | Maskani.tj`
            : `Коммерческая недвижимость в ${cityName} — продажа и аренда | Maskani.tj`;
        const description =
          locale === "tg"
            ? `Ҳамаи пешниҳодҳои амволи тиҷоратӣ дар ${cityName}: офисҳо, анборҳо ва мағозаҳо дар Maskani.tj.`
            : locale === "en"
            ? `All commercial properties in ${cityName}: offices, retail spaces and warehouses on Maskani.tj.`
            : `Каталог коммерческой недвижимости в ${cityName}: продажа и аренда офисов, магазинов и складов на Maskani.tj.`;
        const canonicalPath = resolveCatalogUrl("catalog_commercial_hub", citySlug, locale);
        return {
          title,
          description,
          alternates: {
            canonical: `${baseUrl}${canonicalPath}`,
            languages: {
              ru: `${baseUrl}${resolveCatalogUrl("catalog_commercial_hub", citySlug, "ru")}`,
              tg: `${baseUrl}${resolveCatalogUrl("catalog_commercial_hub", citySlug, "tg")}`,
              en: `${baseUrl}${resolveCatalogUrl("catalog_commercial_hub", citySlug, "en")}`,
              "x-default": `${baseUrl}${resolveCatalogUrl("catalog_commercial_hub", citySlug, "ru")}`,
            },
          },
        };
      }
      if (catalogKind === "developers") {
        const title =
          locale === "tg"
            ? `Ширкатҳои сохтмонӣ ва застройшикони ${cityName} | Maskani.tj`
            : locale === "en"
            ? `Real Estate Developers in ${cityName} | Maskani.tj`
            : `Застройщики и строительные компании в ${cityName} | Maskani.tj`;
        const description = `Каталог строительных компаний и надежных застройщиков в ${cityName}.`;
        const canonicalPath = resolveCatalogUrl("catalog_developers", citySlug, locale);
        return { title, description, alternates: { canonical: `${baseUrl}${canonicalPath}` } };
      }
      if (catalogKind === "agencies") {
        const title =
          locale === "tg"
            ? `Агентиҳои амволи ғайриманқул дар ${cityName} | Maskani.tj`
            : locale === "en"
            ? `Real Estate Agencies in ${cityName} | Maskani.tj`
            : `Агентства недвижимости в ${cityName} | Maskani.tj`;
        const description = `Проверенные агентства недвижимости и риелторы в ${cityName}.`;
        const canonicalPath = resolveCatalogUrl("catalog_agencies", citySlug, locale);
        return { title, description, alternates: { canonical: `${baseUrl}${canonicalPath}` } };
      }
      if (catalogKind === "services") {
        const title =
          locale === "tg"
            ? `Хизматрасониҳои амвол дар ${cityName} | Maskani.tj`
            : locale === "en"
            ? `Real Estate Services in ${cityName} | Maskani.tj`
            : `Услуги в сфере недвижимости в ${cityName} | Maskani.tj`;
        const description = `Юридическое сопровождение, оценка и ремонт недвижимости в ${cityName}.`;
        const canonicalPath = resolveCatalogUrl("catalog_services", citySlug, locale);
        return { title, description, alternates: { canonical: `${baseUrl}${canonicalPath}` } };
      }
    }
  }

  // 3. Facets and Districts (slug.length === 3: /{city}/{deal}/{category}/{facetOrDistrict}/)
  if (slug.length === 3) {
    const catCandidate = findCategoryBySlug(slug[1]);
    if (catCandidate) {
      // Check Facet
      const facet = findFacetBySlug(catCandidate.id, slug[2]);
      if (facet) {
        if (!facet.hasOwnPage) {
          return { title: "Не найдено — Maskani.tj" };
        }
        const title = facet.seoTemplates.title[locale].replace("{city}", cityName);
        const description = facet.seoTemplates.description[locale].replace("{city}", cityName);
        const canonicalPath = resolveFacetUrl({ facet, citySlug, locale });
        return {
          title,
          description,
          robots: facet.indexable ? { index: true, follow: true } : { index: false, follow: true },
          alternates: {
            canonical: `${baseUrl}${canonicalPath}`,
            languages: {
              ru: `${baseUrl}${resolveFacetUrl({ facet, citySlug, locale: "ru" })}`,
              tg: `${baseUrl}${resolveFacetUrl({ facet, citySlug, locale: "tg" })}`,
              en: `${baseUrl}${resolveFacetUrl({ facet, citySlug, locale: "en" })}`,
              "x-default": `${baseUrl}${resolveFacetUrl({ facet, citySlug, locale: "ru" })}`,
            },
          },
        };
      }

      // Check District
      const district = findDistrictBySlug(citySlug, slug[2]);
      if (district) {
        const districtName = district.name[locale];
        const count = ALL_PROPERTIES.filter((p) => {
          if (resolveCitySlug(p.city) !== citySlug) return false;
          if (!p.district) return false;
          return (
            p.district.toLowerCase().includes(district.name.ru.toLowerCase()) ||
            p.district.toLowerCase().includes(district.slug.ru.toLowerCase())
          );
        }).length;

        const isIndexable = isDistrictIndexable(district, count);
        const title = `${catCandidate.name[locale]} в районе ${districtName}, ${cityName} | Maskani.tj`;
        const description = `${catCandidate.name[locale]} в районе ${districtName} (${cityName}). Каталог предложений на Maskani.tj.`;
        const catCanonical = resolveCategoryUrl({ category: catCandidate, citySlug, locale });
        const canonicalPath = `${catCanonical}/${district.slug[locale]}`;

        return {
          title,
          description,
          robots: isIndexable ? { index: true, follow: true } : { index: false, follow: true },
          alternates: {
            canonical: `${baseUrl}${canonicalPath}`,
          },
        };
      }
    }
  }

  // 4. Category metadata
  const catSlugCandidate = slug.length >= 2 ? slug[1] : slug[0];
  const category = findCategoryBySlug(catSlugCandidate);

  if (category) {
    const h1 = category.seoTemplates.h1[locale].replace("{city}", cityName);
    const title = category.seoTemplates.title[locale].replace("{city}", cityName);
    const description = category.seoTemplates.description[locale].replace("{city}", cityName);
    const canonicalPath = resolveCategoryUrl({ category, citySlug, locale });

    return {
      title,
      description,
      robots: category.indexable ? { index: true, follow: true } : { index: false, follow: true },
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

  // 5. Deal hub metadata (e.g. /khujand/kupit)
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
  const cityName = resolveCityDisplayName(citySlug, locale);
  const isTg = locale === "tg";
  const isEn = locale === "en";

  // Check registered 301 alias redirect
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

    return (
      <div className="min-h-screen bg-[#F8FAFC] pb-24">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(seo.breadcrumbJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(seo.realEstateJsonLd) }}
        />

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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-8">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-emerald-600 text-white font-semibold">
                {isTg ? (listing.dealType === "Аренда" ? "Иҷора" : "Фурӯш") : listing.dealType}
              </Badge>
              <Badge variant="outline" className="border-slate-300 text-slate-700">
                {isTg && listing.propertyTypeTg ? listing.propertyTypeTg : listing.propertyType}
              </Badge>
              <span className="text-xs text-slate-500">ID: {listing.id}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              {isTg && listing.titleTg ? listing.titleTg : listing.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>
                {cityName}, {isTg && listing.districtTg ? listing.districtTg : listing.district}
                {listing.landmark ? ` • ${isTg && listing.landmarkTg ? listing.landmarkTg : listing.landmark}` : ""}
              </span>
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="relative aspect-16/10 rounded-2xl overflow-hidden bg-slate-900 shadow-md">
                <img
                  src={listing.image}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {listing.images && listing.images.length > 1 && (
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {listing.images.slice(0, 6).map((img, idx) => (
                    <div
                      key={idx}
                      className="aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200"
                    >
                      <img src={img} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}

              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4 shadow-xs">
                <h2 className="text-lg font-bold text-slate-900">
                  {isTg ? "Тавсифи объект" : isEn ? "Property Description" : "Описание объекта"}
                </h2>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {isTg && listing.descriptionTg ? listing.descriptionTg : listing.description}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-5 shadow-xs sticky top-20">
                <div>
                  <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    {listing.priceTjs?.toLocaleString()} TJS
                  </div>
                  <div className="text-sm font-semibold text-slate-500 mt-0.5">
                    ≈ ${listing.priceUsd?.toLocaleString()} USD
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 block">{isTg ? "Майдон" : "Площадь"}</span>
                    <span className="font-bold text-slate-800 text-sm">{listing.area} м²</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">{isTg ? "Ҳуҷраҳо" : "Комнаты"}</span>
                    <span className="font-bold text-slate-800 text-sm">{listing.rooms || "—"}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <a href={`tel:${listing.phone}`} className="w-full block">
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11 rounded-xl gap-2">
                      <Phone className="h-4 w-4" />
                      <span>{listing.phone}</span>
                    </Button>
                  </a>
                  {listing.whatsapp && (
                    <a
                      href={`https://wa.me/${listing.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full block"
                    >
                      <Button variant="outline" className="w-full border-emerald-500 text-emerald-700 font-bold h-11 rounded-xl gap-2">
                        <MessageCircle className="h-4 w-4" />
                        <span>WhatsApp</span>
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // CASE B: CITY-LEVEL CATALOGS (slug.length === 1)
  // ==========================================
  if (slug.length === 1) {
    const catalogKind = resolveCityCatalogKind(slug[0]);

    if (catalogKind === "commercial_hub") {
      const commercialListings = ALL_PROPERTIES.filter((p) => {
        if (resolveCitySlug(p.city) !== citySlug) return false;
        return (
          p.propertyType === "Коммерция" ||
          p.title.toLowerCase().includes("офис") ||
          p.title.toLowerCase().includes("склад") ||
          p.title.toLowerCase().includes("торгов")
        );
      });

      const breadcrumbs: Array<{ name: string; url?: string }> = [
        { name: isTg ? "Асосӣ" : isEn ? "Home" : "Главная", url: `${baseUrl}${prefix || "/"}` },
        { name: cityName, url: `${baseUrl}${prefix}/${citySlug}` },
        { name: isTg ? "Амволи тиҷоратӣ" : isEn ? "Commercial" : "Коммерческая недвижимость" },
      ];

      return (
        <div className="min-h-screen bg-[#F8FAFC] pb-24">
          <div className="bg-white border-b border-slate-200/80 sticky top-0 z-20 backdrop-blur-md bg-white/95">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-500 truncate">
                {breadcrumbs.map((crumb, idx) => (
                  <React.Fragment key={idx}>
                    {idx > 0 && <span className="text-slate-300">/</span>}
                    {crumb.url ? (
                      <Link href={crumb.url.replace(/^https?:\/\/[^/]+/, "") || "/"} className="hover:text-emerald-700 font-medium shrink-0">
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
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {isTg
                  ? `Амволи тиҷоратӣ дар ${cityName}`
                  : isEn
                  ? `Commercial Real Estate in ${cityName}`
                  : `Коммерческая недвижимость в ${cityName}`}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                {isTg
                  ? `Фурӯш ва иҷораи офисҳо, мағозаҳо ва анборҳо дар ${cityName}. ${commercialListings.length} пешниҳод.`
                  : isEn
                  ? `Offices, retail space, and warehouses for sale and rent in ${cityName}. ${commercialListings.length} listings.`
                  : `Продажа и аренда офисов, магазинов, торговых площадей и складов в ${cityName}. Найдено ${commercialListings.length} предложений.`}
              </p>
            </div>

            {/* Deal Tabs & Quick Facets */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <Link href={`${prefix}/${citySlug}/kommercheskaya`}>
                <Button size="sm" className="bg-emerald-600 text-white rounded-xl text-xs font-semibold">
                  {isTg ? "Ҳама" : isEn ? "All Commercial" : "Все объекты"}
                </Button>
              </Link>
              <Link href={`${prefix}/${citySlug}/kupit/kommercheskaya`}>
                <Button size="sm" variant="outline" className="rounded-xl text-xs font-semibold">
                  {isTg ? "Харидан" : isEn ? "Buy" : "Купить"}
                </Button>
              </Link>
              <Link href={`${prefix}/${citySlug}/arenda/kommercheskaya`}>
                <Button size="sm" variant="outline" className="rounded-xl text-xs font-semibold">
                  {isTg ? "Ба иҷора гирифтан" : isEn ? "Rent" : "Снять"}
                </Button>
              </Link>

              <div className="h-4 w-px bg-slate-300 mx-1 hidden sm:block" />

              <Link href={`${prefix}/${citySlug}/kupit/kommercheskaya/ofisy`}>
                <Button size="sm" variant="ghost" className="rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200">
                  <Building2 className="h-3.5 w-3.5 mr-1 text-emerald-600" />
                  {isTg ? "Дафтарҳо" : isEn ? "Offices" : "Офисы"}
                </Button>
              </Link>
              <Link href={`${prefix}/${citySlug}/kupit/kommercheskaya/torgovye-sklady`}>
                <Button size="sm" variant="ghost" className="rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200">
                  <Store className="h-3.5 w-3.5 mr-1 text-emerald-600" />
                  {isTg ? "Тиҷорат ва анборҳо" : isEn ? "Retail & Warehouses" : "Торговые и склады"}
                </Button>
              </Link>
            </div>

            {/* Commercial Listings Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
              {commercialListings.map((item) => (
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
                        {isTg ? (item.dealType === "Аренда" ? "Иҷора" : "Фурӯш") : item.dealType}
                      </Badge>
                      <Badge className="bg-emerald-600/90 backdrop-blur-md text-white text-[11px] font-semibold border-none">
                        {isTg ? "Тиҷоратӣ" : "Коммерция"}
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
                        {isTg && item.titleTg ? item.titleTg : item.title}
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
                      <span>{item.floor || "1 этаж"}</span>
                      <span>•</span>
                      <span className="text-emerald-700 font-bold group-hover:underline">
                        {isTg ? "Тафсилот" : isEn ? "Details" : "Подробнее"}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (catalogKind === "developers") {
      const cityDevelopers = INITIAL_DEVELOPERS.filter(
        (dev) => resolveCitySlug(dev.city) === citySlug || citySlug === "khujand"
      );

      return (
        <div className="min-h-screen bg-[#F8FAFC] pb-24">
          <div className="bg-white border-b border-slate-200/80 sticky top-0 z-20 backdrop-blur-md bg-white/95">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-500 truncate">
                <Link href={`${prefix || "/"}`} className="hover:text-emerald-700">
                  {isTg ? "Асосӣ" : "Главная"}
                </Link>
                <span>/</span>
                <Link href={`${prefix}/${citySlug}`} className="hover:text-emerald-700">
                  {cityName}
                </Link>
                <span>/</span>
                <span className="text-slate-800 font-semibold">{isTg ? "Ширкатҳои сохтмонӣ" : "Застройщики"}</span>
              </div>
              <Badge variant="outline" className="border-emerald-200 text-emerald-800 bg-emerald-50 text-xs">
                {cityName}
              </Badge>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {isTg ? `Ширкатҳои сохтмонӣ ва застройшикони ${cityName}` : `Застройщики и строительные компании в ${cityName}`}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                {isTg
                  ? `Каталоги расмии ширкатҳои сохтмонии санҷидашудаи шаҳри ${cityName}.`
                  : `Официальный реестр надежных строительных компаний и жилых комплексов в ${cityName}.`}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cityDevelopers.map((dev) => (
                <div key={dev.id} className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4 shadow-xs hover:border-emerald-500 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg">
                      {dev.name.slice(0, 2)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{dev.name}</h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-emerald-600" />
                        <span>{cityName}</span>
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-3">
                    {isTg && dev.descriptionTg ? dev.descriptionTg : dev.description}
                  </p>
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-semibold text-emerald-700">{dev.phone}</span>
                    <Link href={`/developers/${dev.slug}`}>
                      <Button variant="outline" size="sm" className="rounded-xl text-xs font-semibold">
                        {isTg ? "Маҷмааҳо" : "Проекты"}
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }
  }

  // ==========================================
  // CASE C: FACETS & DISTRICTS (slug.length === 3)
  // ==========================================
  let facetConfig: FacetConfig | undefined = undefined;
  let districtConfig: DistrictConfig | undefined = undefined;
  let isDistrictUnderThreshold = false;

  if (slug.length === 3) {
    const catCandidate = findCategoryBySlug(slug[1]);
    if (catCandidate) {
      facetConfig = findFacetBySlug(catCandidate.id, slug[2]);
      if (facetConfig && !facetConfig.hasOwnPage) {
        notFound();
      }

      if (!facetConfig) {
        districtConfig = findDistrictBySlug(citySlug, slug[2]);
        if (districtConfig && !districtConfig.hasOwnPage) {
          notFound();
        }
      }
    }
  }

  // ==========================================
  // CASE D: CATEGORY OR DEAL HUB PAGE
  // ==========================================
  const catSlugCandidate = slug.length >= 2 ? slug[1] : slug[0];
  const category = findCategoryBySlug(catSlugCandidate);
  const dealKind = resolveDealKind(slug[0]);

  if (!category && !dealKind) {
    notFound();
  }

  // Filter listings
  const filteredListings = ALL_PROPERTIES.filter((p) => {
    if (resolveCitySlug(p.city) !== citySlug) return false;

    // Filter Deal Kind
    if (dealKind) {
      const isRent = p.dealType.toLowerCase().includes("аренда") || p.dealType.toLowerCase().includes("rent");
      if (dealKind === "rent" && !isRent) return false;
      if (dealKind === "sale" && isRent) return false;
    }

    // Filter Property Type
    if (category?.propertyType) {
      if (category.propertyType === "apartment" && !p.propertyType.toLowerCase().includes("квартир")) {
        return false;
      }
      if (
        category.propertyType === "house" &&
        !p.propertyType.toLowerCase().includes("дом") &&
        !p.propertyType.toLowerCase().includes("ҳавлӣ")
      ) {
        return false;
      }
      if (
        category.propertyType === "commercial" &&
        p.propertyType !== "Коммерция" &&
        !p.title.toLowerCase().includes("офис") &&
        !p.title.toLowerCase().includes("склад")
      ) {
        return false;
      }
    }

    // Filter Facet Properties
    if (facetConfig) {
      if (facetConfig.facetKey === "commercial_type") {
        if (facetConfig.valueKey === "office") {
          const match = p.title.toLowerCase().includes("офис") || p.description?.toLowerCase().includes("офис");
          if (!match) return false;
        } else if (facetConfig.valueKey === "retail_warehouse") {
          const match =
            p.title.toLowerCase().includes("склад") ||
            p.title.toLowerCase().includes("торгов") ||
            p.title.toLowerCase().includes("мазин");
          if (!match) return false;
        }
      } else if (facetConfig.facetKey === "rooms") {
        if (facetConfig.valueKey === "1" && p.rooms !== 1) return false;
        if (facetConfig.valueKey === "2" && p.rooms !== 2) return false;
        if (facetConfig.valueKey === "3" && p.rooms !== 3) return false;
        if (facetConfig.valueKey === "4_plus" && (p.rooms || 0) < 4) return false;
      }
    }

    // Filter District Properties
    if (districtConfig) {
      if (!p.district) return false;
      const match =
        p.district.toLowerCase().includes(districtConfig.name.ru.toLowerCase()) ||
        p.district.toLowerCase().includes(districtConfig.slug.ru.toLowerCase());
      if (!match) return false;
    }

    return true;
  });

  if (districtConfig) {
    isDistrictUnderThreshold = !isDistrictIndexable(districtConfig, filteredListings.length);
  }

  // Page Title Calculation
  let pageTitle = category
    ? category.seoTemplates.h1[locale].replace("{city}", cityName)
    : `${dealKind === "sale" ? (locale === "tg" ? "Хариду фурӯш" : locale === "en" ? "Properties for Sale" : "Купить недвижимость") : (locale === "tg" ? "Иҷора" : locale === "en" ? "Rentals" : "Аренда")} в ${cityName}`;

  if (facetConfig) {
    pageTitle = facetConfig.seoTemplates.h1[locale].replace("{city}", cityName);
  } else if (districtConfig && category) {
    pageTitle = `${category.name[locale]} в районе ${districtConfig.name[locale]}, ${cityName}`;
  }

  const breadcrumbs: Array<{ name: string; url?: string }> = [
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

  if (facetConfig) {
    breadcrumbs.push({
      name: facetConfig.displayName[locale],
    });
  } else if (districtConfig) {
    breadcrumbs.push({
      name: districtConfig.name[locale],
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
      {/* Explicit Search Engine Robots Meta for Under-threshold Districts or Non-indexable Facets */}
      {((facetConfig && !facetConfig.indexable) || isDistrictUnderThreshold) && (
        <meta name="robots" content="noindex, follow" />
      )}

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
                {crumb.url && idx < breadcrumbs.length - 1 ? (
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
