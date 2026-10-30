"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { useLanguage } from "@/context/language-context";
import {
  Building2,
  Home,
  Trees,
  KeyRound,
  Store,
  Sparkles,
  Briefcase,
  Users,
  FileText,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import {
  INITIAL_PROJECTS,
  INITIAL_DEVELOPERS,
} from "@/lib/data/mock-db";
import {
  ALL_PROPERTIES,
  COMMERCIAL_PROPERTIES,
} from "@/lib/catalog-data";
import { getTaxonomyCategoryById } from "@/lib/seo/taxonomy-store";
import { resolveCategoryUrl, resolveCatalogUrl } from "@/lib/seo/url-resolver";

interface ShowcaseSectionProps {
  activeCity?: string;
}

export function HomepageShowcaseMatrix({ activeCity = "khujand" }: ShowcaseSectionProps) {
  const { language, tDual } = useLanguage();

  // 1. Calculate live counts
  const newProjectsCount = INITIAL_PROJECTS.length; // 26
  const resaleCount = ALL_PROPERTIES.filter(
    (p) => p.dealType === "Продажа" && (p.propertyType === "Квартира" || p.propertyType === "Новостройка")
  ).length;
  const housesCount = ALL_PROPERTIES.filter(
    (p) => p.dealType === "Продажа" && p.propertyType === "Дом / Ҳавлӣ"
  ).length || 6;
  const rentCount = ALL_PROPERTIES.filter((p) => p.dealType === "Аренда").length || 8;
  const commercialCount = COMMERCIAL_PROPERTIES.length; // 4
  const developersCount = INITIAL_DEVELOPERS.length; // 5

  // 2. Resolve URLs strictly via central URL resolver (TZ Section 9)
  const catNewBuilds = getTaxonomyCategoryById("cat_sale_new_builds");
  const catResale = getTaxonomyCategoryById("cat_sale_resale");
  const catHouses = getTaxonomyCategoryById("cat_sale_houses");
  const catRentApartments = getTaxonomyCategoryById("cat_rent_apartments");

  const urlNewBuilds = catNewBuilds
    ? resolveCategoryUrl({ category: catNewBuilds, citySlug: activeCity, locale: language })
    : `/${activeCity}/kupit/novostroyki`;

  const urlResale = catResale
    ? resolveCategoryUrl({ category: catResale, citySlug: activeCity, locale: language })
    : `/${activeCity}/kupit/vtorichka`;

  const urlHouses = catHouses
    ? resolveCategoryUrl({ category: catHouses, citySlug: activeCity, locale: language })
    : `/${activeCity}/kupit/doma-dachi`;

  const urlRent = catRentApartments
    ? resolveCategoryUrl({ category: catRentApartments, citySlug: activeCity, locale: language })
    : `/${activeCity}/snyat/kvartiry`;

  const urlCommercial = resolveCatalogUrl("catalog_commercial_hub", activeCity, language);
  const urlServices = resolveCatalogUrl("catalog_services", activeCity, language);
  const urlDevelopers = resolveCatalogUrl("catalog_developers", activeCity, language);
  const urlAgencies = resolveCatalogUrl("catalog_agencies", activeCity, language);
  const urlBlog = language === "ru" ? "/blog" : `/${language}/blog`;

  // 3. Define the 9 Showcase Tiles strictly per TZ Section 9
  const showcaseItems = [
    {
      id: "showcase_new_builds",
      icon: Building2,
      title: {
        ru: "Новостройки",
        tg: "Биноҳои навсохт",
        en: "New Buildings",
      },
      subtitle: {
        ru: "ЖК от застройщиков без комиссии",
        tg: "Маҷмааҳо бе комиссия аз сохтмончиён",
        en: "Verified residential complexes",
      },
      href: urlNewBuilds,
      badge: {
        ru: `${newProjectsCount} ЖК`,
        tg: `${newProjectsCount} МИ`,
        en: `${newProjectsCount} Complexes`,
      },
      accentGradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
      iconColor: "text-emerald-500",
      badgeColor: "bg-emerald-500/10 text-emerald-700 border-emerald-500/25",
    },
    {
      id: "showcase_resale",
      icon: Home,
      title: {
        ru: "Вторичный рынок",
        tg: "Бозори дуюмдараҷа",
        en: "Secondary Market",
      },
      subtitle: {
        ru: "Квартиры с ремонтом от собственников",
        tg: "Хонадонҳо бо таъмир аз соҳибмулкон",
        en: "Apartments from verified owners",
      },
      href: urlResale,
      badge: {
        ru: `${resaleCount} объявлений`,
        tg: `${resaleCount} эълон`,
        en: `${resaleCount} listings`,
      },
      accentGradient: "from-blue-500/20 via-sky-500/10 to-transparent",
      iconColor: "text-blue-500",
      badgeColor: "bg-blue-500/10 text-blue-700 border-blue-500/25",
    },
    {
      id: "showcase_houses",
      icon: Trees,
      title: {
        ru: "Дома и участки",
        tg: "Ҳавлиҳо ва қитъаҳо",
        en: "Houses & Land",
      },
      subtitle: {
        ru: "Коттеджи, дачи и земельные участки",
        tg: "Ҳавлиҳо, бӯстонсароҳо ва қитъаҳо",
        en: "Houses, villas and land plots",
      },
      href: urlHouses,
      badge: {
        ru: `${housesCount}+ объектов`,
        tg: `${housesCount}+ иншоот`,
        en: `${housesCount}+ properties`,
      },
      accentGradient: "from-amber-500/20 via-orange-500/10 to-transparent",
      iconColor: "text-amber-500",
      badgeColor: "bg-amber-500/10 text-amber-700 border-amber-500/25",
    },
    {
      id: "showcase_rent",
      icon: KeyRound,
      title: {
        ru: "Аренда жилья",
        tg: "Иҷораи манзил",
        en: "Rent Property",
      },
      subtitle: {
        ru: "Квартиры и комнаты на долгий срок",
        tg: "Хонадонҳо ва ҳуҷраҳо барои муддати дароз",
        en: "Long-term apartments and rooms",
      },
      href: urlRent,
      badge: {
        ru: `${rentCount}+ предложений`,
        tg: `${rentCount}+ пешниҳод`,
        en: `${rentCount}+ rentals`,
      },
      accentGradient: "from-purple-500/20 via-indigo-500/10 to-transparent",
      iconColor: "text-purple-500",
      badgeColor: "bg-purple-500/10 text-purple-700 border-purple-500/25",
    },
    {
      id: "showcase_commercial",
      icon: Store,
      title: {
        ru: "Коммерческая",
        tg: "Амволи тиҷоратӣ",
        en: "Commercial Hub",
      },
      subtitle: {
        ru: "Офисы, склады, торговля (Купить/Снять)",
        tg: "Дафтарҳо, анборҳо ва мағозаҳо",
        en: "Offices, warehouses, retail spaces",
      },
      href: urlCommercial,
      badge: {
        ru: `${commercialCount}+ объекта`,
        tg: `${commercialCount}+ иншоот`,
        en: `${commercialCount}+ objects`,
      },
      accentGradient: "from-teal-500/20 via-emerald-500/10 to-transparent",
      iconColor: "text-teal-500",
      badgeColor: "bg-teal-500/10 text-teal-700 border-teal-500/25",
    },
    {
      id: "showcase_services",
      icon: Sparkles,
      title: {
        ru: "Услуги и сервис",
        tg: "Хизматрасониҳо",
        en: "Services & Home",
      },
      subtitle: {
        ru: "Ремонт, дизайн, оценка и юристы",
        tg: "Таъмир, лоиҳакашӣ ва ёрии ҳуқуқӣ",
        en: "Renovation, design, valuation & legal",
      },
      href: urlServices,
      badge: {
        ru: "Каталог услуг",
        tg: "Феҳристи хизмат",
        en: "Services",
      },
      accentGradient: "from-rose-500/20 via-pink-500/10 to-transparent",
      iconColor: "text-rose-500",
      badgeColor: "bg-rose-500/10 text-rose-700 border-rose-500/25",
    },
    {
      id: "showcase_developers",
      icon: Briefcase,
      title: {
        ru: "Застройщики",
        tg: "Сохтмончиён",
        en: "Developers",
      },
      subtitle: {
        ru: "Надёжные строительные компании",
        tg: "Ширкатҳои сохтмонии боэътимод",
        en: "Verified construction companies",
      },
      href: urlDevelopers,
      badge: {
        ru: `${developersCount} застройщиков`,
        tg: `${developersCount} ширкат`,
        en: `${developersCount} companies`,
      },
      accentGradient: "from-cyan-500/20 via-sky-500/10 to-transparent",
      iconColor: "text-cyan-500",
      badgeColor: "bg-cyan-500/10 text-cyan-700 border-cyan-500/25",
    },
    {
      id: "showcase_agencies",
      icon: Users,
      title: {
        ru: "Агентства",
        tg: "Агентиҳо",
        en: "Agencies",
      },
      subtitle: {
        ru: "Сертифицированные риелторы города",
        tg: "Миёнаравон ва агентиҳои санҷидашуда",
        en: "Certified real estate agencies",
      },
      href: urlAgencies,
      badge: {
        ru: "Партнёры",
        tg: "Шарикон",
        en: "Partners",
      },
      accentGradient: "from-violet-500/20 via-indigo-500/10 to-transparent",
      iconColor: "text-violet-500",
      badgeColor: "bg-violet-500/10 text-violet-700 border-violet-500/25",
    },
    {
      id: "showcase_blog",
      icon: FileText,
      title: {
        ru: "Журнал и аналитика",
        tg: "Маҷалла ва таҳлил",
        en: "Journal & Insights",
      },
      subtitle: {
        ru: "Цены на недвижимость и законы",
        tg: "Нархи амвол, қонунҳо ва таҳлил",
        en: "Real estate trends and legislation",
      },
      href: urlBlog,
      badge: {
        ru: "12+ статей",
        tg: "12+ мақола",
        en: "12+ articles",
      },
      accentGradient: "from-emerald-500/20 via-green-500/10 to-transparent",
      iconColor: "text-emerald-500",
      badgeColor: "bg-emerald-500/10 text-emerald-700 border-emerald-500/25",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-4 sm:pt-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs uppercase font-bold tracking-wider text-emerald-600 mb-1">
            <TrendingUp className="h-3.5 w-3.5" />
            {tDual("Навигация по недвижимости", "Роҳнамои амвол", "Real Estate Navigation")}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {tDual(
              "Главные направления рынка Таджикистана",
              "Самтҳои асосии бозори Тоҷикистон",
              "Key Directions in Tajikistan Real Estate"
            )}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {tDual(
              "Прямой доступ к проверенным каталогам новостроек, вторичного жилья, аренды и компаний",
              "Дастрасии мустақим ба феҳристи санҷидашудаи навсохтҳо, манзили дуюмдараҷа ва ширкатҳо",
              "Direct access to verified catalogs of new buildings, resale, rentals, and companies"
            )}
          </p>
        </div>
      </div>

      {/* 9-Block Showcase Grid (3x3 on Desktop, 2 cols on Mobile/Tablet) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
        {showcaseItems.map((item) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.id}
              whileHover={{ y: -4, scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <Link
                href={item.href}
                className="group relative flex flex-col justify-between h-full p-4 sm:p-4.5 rounded-2xl bg-white/90 hover:bg-white border border-slate-200/90 hover:border-emerald-500/40 shadow-xs hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300 overflow-hidden cursor-pointer"
              >
                {/* Subtle Ambient Color Glow */}
                <div
                  className={`absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gradient-to-br ${item.accentGradient} blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500`}
                />

                {/* Top Row: Icon + Badge */}
                <div className="flex items-center justify-between gap-3 relative z-10 mb-3">
                  <div className="h-10 w-10 rounded-xl bg-slate-50 group-hover:bg-emerald-50 border border-slate-200/70 group-hover:border-emerald-300/60 flex items-center justify-center transition-colors shadow-2xs">
                    <Icon className={`h-5 w-5 ${item.iconColor} group-hover:scale-110 transition-transform duration-300`} />
                  </div>

                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-lg border text-[11px] font-bold tracking-tight transition-colors ${item.badgeColor}`}
                  >
                    {item.badge[language]}
                  </span>
                </div>

                {/* Bottom Row: Title + Subtitle + Action Arrow */}
                <div className="relative z-10 flex items-end justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors tracking-tight line-clamp-1">
                      {item.title[language]}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                      {item.subtitle[language]}
                    </p>
                  </div>

                  <div className="h-7 w-7 rounded-lg bg-slate-100 group-hover:bg-emerald-600 text-slate-400 group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
