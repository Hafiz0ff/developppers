import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  resolveCitySlug,
  resolveCityDisplayName,
  getBaseSiteUrl,
} from "@/lib/seo/url-resolver";
import type { Locale } from "@/lib/seo/taxonomy-store";
import { CATALOG_PROPERTIES } from "@/lib/catalog-data";
import {
  Building2,
  Home,
  KeyRound,
  ArrowRight,
  MapPin,
  CheckCircle2,
  Sparkles,
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

interface PageProps {
  params: Promise<{ city: string }>;
  searchParams?: Promise<{ locale?: string; lang?: string }>;
}

function resolveLocale(sp?: { locale?: string; lang?: string }): Locale {
  const l = sp?.locale || sp?.lang;
  if (l === "tg") return "tg";
  if (l === "en") return "en";
  return "ru";
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { city } = await params;
  const sp = searchParams ? await searchParams : undefined;
  const citySlug = resolveCitySlug(city);

  if (!VALID_CITY_SLUGS.has(citySlug)) {
    return { title: "Город не найден — Maskani.tj" };
  }

  const locale = resolveLocale(sp);
  const cityName = resolveCityDisplayName(citySlug, locale);
  const baseUrl = getBaseSiteUrl();

  const title =
    locale === "tg"
      ? `Амволи ғайриманқул дар ${cityName} — Хариду фурӯш ва иҷора | Maskani.tj`
      : locale === "en"
      ? `Real Estate in ${cityName} — Buy, Sell & Rent | Maskani.tj`
      : `Недвижимость в ${cityName} — Купить, снять или продать жильё | Maskani.tj`;

  const description =
    locale === "tg"
      ? `Каталоги расмии амволи ғайриманқул дар ${cityName}: хонадонҳои навсохт, хонаҳои такрорӣ, ҳавлиҳо ва иҷора бе миёнарав дар Maskani.tj.`
      : locale === "en"
      ? `Verified real estate catalog in ${cityName}: new buildings, resale apartments, houses and rentals directly on Maskani.tj.`
      : `Каталог проверенной недвижимости в ${cityName}: новостройки от застройщиков, вторичное жильё, дома и аренда квартир на Maskani.tj.`;

  const canonicalPath = locale === "ru" ? `/${citySlug}` : `/${locale}/${citySlug}`;

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}${canonicalPath}`,
      languages: {
        ru: `${baseUrl}/${citySlug}`,
        tg: `${baseUrl}/tg/${citySlug}`,
        en: `${baseUrl}/en/${citySlug}`,
        "x-default": `${baseUrl}/${citySlug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}${canonicalPath}`,
      siteName: "Maskani.tj",
      locale: locale === "tg" ? "tg_TJ" : locale === "en" ? "en_US" : "ru_RU",
      type: "website",
    },
  };
}

export default async function CityHubPage({ params, searchParams }: PageProps) {
  const { city } = await params;
  const sp = searchParams ? await searchParams : undefined;
  const citySlug = resolveCitySlug(city);

  if (!VALID_CITY_SLUGS.has(citySlug)) {
    notFound();
  }

  const locale = resolveLocale(sp);
  const cityName = resolveCityDisplayName(citySlug, locale);
  const baseUrl = getBaseSiteUrl();
  const prefix = locale === "ru" ? "" : `/${locale}`;

  // Filter listings for this city
  const cityListings = CATALOG_PROPERTIES.filter(
    (p) => resolveCitySlug(p.city) === citySlug
  );

  // Schema.org BreadcrumbList
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: locale === "tg" ? "Асосӣ" : locale === "en" ? "Home" : "Главная",
        item: `${baseUrl}${prefix || "/"}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: cityName,
        item: `${baseUrl}${prefix}/${citySlug}`,
      },
    ],
  };

  // Localized slugs for hub cards
  const saleSlug = locale === "tg" ? "furosh" : locale === "en" ? "sale" : "kupit";
  const rentSlug = locale === "tg" ? "ijora" : locale === "en" ? "rent" : "arenda";
  const aptSlug = locale === "tg" ? "khonadon" : locale === "en" ? "apartments" : "kvartiry";
  const houseSlug = locale === "tg" ? "havliho" : locale === "en" ? "houses" : "doma";
  const newBuildSlug = locale === "tg" ? "binohoi-nav" : locale === "en" ? "new-builds" : "novostroyki";
  const resaleSlug = locale === "tg" ? "bozori-duyumdaraja" : locale === "en" ? "resale" : "vtorichka";

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
            <Link
              href={prefix || "/"}
              className="hover:text-emerald-700 font-medium transition-colors"
            >
              {locale === "tg" ? "Асосӣ" : locale === "en" ? "Home" : "Главная"}
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-800 font-semibold truncate">{cityName}</span>
          </div>

          <Badge variant="outline" className="border-emerald-200 text-emerald-800 bg-emerald-50 text-xs">
            {cityName}
          </Badge>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Hero City Header */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-12 translate-y-12">
            <Building2 className="w-96 h-96" />
          </div>

          <div className="max-w-2xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5" />
              <span>
                {locale === "tg"
                  ? `Портали расмии амвол • ${cityName}`
                  : locale === "en"
                  ? `Official Real Estate Portal • ${cityName}`
                  : `Официальный портал жилья • ${cityName}`}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
              {locale === "tg"
                ? `Амволи ғайриманқул дар ${cityName}`
                : locale === "en"
                ? `Real Estate in ${cityName}`
                : `Недвижимость в ${cityName}`}
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              {locale === "tg"
                ? `Беҳтарин пешниҳодҳои хариду фурӯш ва иҷораи хонадонҳо, ҳавлиҳо ва биноҳои навсохти шаҳри ${cityName} мустақим аз соҳибмулкон ва ширкатҳо.`
                : locale === "en"
                ? `Discover verified apartments, houses, new buildings, and rentals in ${cityName} directly from owners and verified developers.`
                : `Проверенные объявления о продаже и аренде квартир, домов и новостроек в городе ${cityName} напрямую от собственников и застройщиков.`}
            </p>

            {/* Quick Deal Switchers */}
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href={`${prefix}/${citySlug}/${saleSlug}`}>
                <Button className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs h-10 px-5 rounded-xl gap-2 cursor-pointer shadow-md">
                  <Home className="h-4 w-4" />
                  <span>{locale === "tg" ? "Харид (Фурӯш)" : locale === "en" ? "Buy Property" : "Купить недвижимость"}</span>
                </Button>
              </Link>
              <Link href={`${prefix}/${citySlug}/${rentSlug}`}>
                <Button variant="outline" className="border-white/20 bg-white/10 hover:bg-white/20 text-white font-bold text-xs h-10 px-5 rounded-xl gap-2 cursor-pointer backdrop-blur-sm">
                  <KeyRound className="h-4 w-4" />
                  <span>{locale === "tg" ? "Иҷора" : locale === "en" ? "Rent Property" : "Аренда"}</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Popular Categories Grid */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Building2 className="h-5 w-5 text-emerald-600" />
            <span>
              {locale === "tg"
                ? `Бахшҳои маъмули ${cityName}`
                : locale === "en"
                ? `Popular Categories in ${cityName}`
                : `Популярные категории в ${cityName}`}
            </span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* 1. Квартиры */}
            <Link
              href={`${prefix}/${citySlug}/${saleSlug}/${aptSlug}`}
              className="group bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-400 block">
                  {locale === "tg" ? "Хариду фурӯш" : locale === "en" ? "For Sale" : "Продажа"}
                </span>
                <span className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-emerald-700 transition-colors">
                  {locale === "tg" ? "Хонадонҳо" : locale === "en" ? "Apartments" : "Квартиры"}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-emerald-600 font-semibold mt-4">
                <span>{locale === "tg" ? "Дидан" : locale === "en" ? "Browse" : "Смотреть"}</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* 2. Новостройки */}
            <Link
              href={`${prefix}/${citySlug}/${saleSlug}/${newBuildSlug}`}
              className="group bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-400 block">
                  {locale === "tg" ? "Ширкатҳои сохтмонӣ" : locale === "en" ? "Developers" : "От застройщика"}
                </span>
                <span className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-emerald-700 transition-colors">
                  {locale === "tg" ? "Биноҳои навсохт" : locale === "en" ? "New Buildings" : "Новостройки"}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-emerald-600 font-semibold mt-4">
                <span>{locale === "tg" ? "Дидан" : locale === "en" ? "Browse" : "Смотреть"}</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* 3. Вторичный рынок */}
            <Link
              href={`${prefix}/${citySlug}/${saleSlug}/${resaleSlug}`}
              className="group bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-400 block">
                  {locale === "tg" ? "Аз соҳибмулк" : locale === "en" ? "Resale" : "Готовое жильё"}
                </span>
                <span className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-emerald-700 transition-colors">
                  {locale === "tg" ? "Бозори дуюмдараҷа" : locale === "en" ? "Secondary Market" : "Вторичный рынок"}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-emerald-600 font-semibold mt-4">
                <span>{locale === "tg" ? "Дидан" : locale === "en" ? "Browse" : "Смотреть"}</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* 4. Дома и Ҳавлиҳо */}
            <Link
              href={`${prefix}/${citySlug}/${saleSlug}/${houseSlug}`}
              className="group bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-400 block">
                  {locale === "tg" ? "Ҳавлиҳои анъанавӣ" : locale === "en" ? "Private Houses" : "Земельные участки"}
                </span>
                <span className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-emerald-700 transition-colors">
                  {locale === "tg" ? "Ҳавлиҳо" : locale === "en" ? "Houses" : "Дома и коттеджи"}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-emerald-600 font-semibold mt-4">
                <span>{locale === "tg" ? "Дидан" : locale === "en" ? "Browse" : "Смотреть"}</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>

        {/* City Listings Catalog */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              {locale === "tg"
                ? `Эълонҳои фаъол дар ${cityName} (${cityListings.length})`
                : locale === "en"
                ? `Active Listings in ${cityName} (${cityListings.length})`
                : `Актуальные объявления в ${cityName} (${cityListings.length})`}
            </h2>

            <Link
              href={`${prefix}/classifieds`}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors flex items-center gap-1"
            >
              <span>{locale === "tg" ? "Ҳамаи эълонҳо" : locale === "en" ? "All listings" : "Все объявления"}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {cityListings.length === 0 ? (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-10 text-center space-y-3">
              <MapPin className="h-10 w-10 text-slate-300 mx-auto" />
              <p className="text-slate-600 font-semibold text-sm">
                {locale === "tg"
                  ? `Дар шаҳри ${cityName} то ҳол эълонҳо гузошта нашудаанд.`
                  : locale === "en"
                  ? `No active listings in ${cityName} yet.`
                  : `В городе ${cityName} пока нет опубликованных объявлений.`}
              </p>
              <Link href={`${prefix}/classifieds/new`}>
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl">
                  {locale === "tg" ? "Аввалин шуда эълон гузоред" : locale === "en" ? "Post the first listing" : "Подать первое объявление"}
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {cityListings.map((item) => (
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
                      <Badge className="bg-emerald-600 text-white text-[11px] font-semibold border-none">
                        {locale === "tg"
                          ? item.propertyType === "Квартира" ? "Хонадон" : item.propertyType
                          : item.propertyType}
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
    </div>
  );
}
