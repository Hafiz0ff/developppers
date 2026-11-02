"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { useLanguage } from "@/context/language-context";
import { TrendingUp } from "lucide-react";
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
  ).length || 35;
  const housesCount = ALL_PROPERTIES.filter(
    (p) => p.dealType === "Продажа" && p.propertyType === "Дом / Ҳавлӣ"
  ).length || 6;
  const commercialCount = COMMERCIAL_PROPERTIES.length || 4;
  const developersCount = INITIAL_DEVELOPERS.length || 5;

  // 2. Resolve URLs strictly via central URL resolver
  const catNewBuilds = getTaxonomyCategoryById("cat_sale_new_builds");
  const catResale = getTaxonomyCategoryById("cat_sale_resale");
  const catHouses = getTaxonomyCategoryById("cat_sale_houses");

  const urlNewBuilds = catNewBuilds
    ? resolveCategoryUrl({ category: catNewBuilds, citySlug: activeCity, locale: language })
    : `/${activeCity}/kupit/novostroyki`;

  const urlResale = catResale
    ? resolveCategoryUrl({ category: catResale, citySlug: activeCity, locale: language })
    : `/${activeCity}/kupit/vtorichka`;

  const urlHouses = catHouses
    ? resolveCategoryUrl({ category: catHouses, citySlug: activeCity, locale: language })
    : `/${activeCity}/kupit/doma-dachi`;

  const urlCommercial = resolveCatalogUrl("catalog_commercial_hub", activeCity, language);
  const urlServices = resolveCatalogUrl("catalog_services", activeCity, language);
  const urlDevelopers = resolveCatalogUrl("catalog_developers", activeCity, language);
  const urlAgencies = resolveCatalogUrl("catalog_agencies", activeCity, language);

  // 3. Define the 7 Showcase Items strictly per User Specs (Variant 2: Title Below)
  const showcaseItems = [
    {
      id: "showcase_new_builds",
      icon: "/images/categories/novostroyki.png",
      title: {
        ru: "Новостройки",
        tg: "Биноҳои навсохт",
        en: "New Buildings",
      },
      href: urlNewBuilds,
      badge: {
        ru: `${newProjectsCount} ЖК`,
        tg: `${newProjectsCount} МИ`,
        en: `${newProjectsCount} Complexes`,
      },
      accentGlow: "from-emerald-500/25 via-teal-500/15 to-transparent",
    },
    {
      id: "showcase_resale",
      icon: "/images/categories/vtorichka.png",
      title: {
        ru: "Вторичка",
        tg: "Бозори дуюмдараҷа",
        en: "Secondary Market",
      },
      href: urlResale,
      badge: {
        ru: `${resaleCount}+ объявл.`,
        tg: `${resaleCount}+ эълон`,
        en: `${resaleCount}+ listings`,
      },
      accentGlow: "from-blue-500/25 via-sky-500/15 to-transparent",
    },
    {
      id: "showcase_houses",
      icon: "/images/categories/doma-dachi.png",
      title: {
        ru: "Дома и дачи",
        tg: "Ҳавлиҳо ва дачаҳо",
        en: "Houses & Villas",
      },
      href: urlHouses,
      badge: {
        ru: `${housesCount}+ домов`,
        tg: `${housesCount}+ ҳавлӣ`,
        en: `${housesCount}+ houses`,
      },
      accentGlow: "from-amber-500/25 via-orange-500/15 to-transparent",
    },
    {
      id: "showcase_commercial",
      icon: "/images/categories/commerce.png",
      title: {
        ru: "Коммерция",
        tg: "Амволи тиҷоратӣ",
        en: "Commercial Hub",
      },
      href: urlCommercial,
      badge: {
        ru: `${commercialCount}+ объекта`,
        tg: `${commercialCount}+ иншоот`,
        en: `${commercialCount}+ objects`,
      },
      accentGlow: "from-indigo-500/25 via-blue-500/15 to-transparent",
    },
    {
      id: "showcase_services",
      icon: "/images/categories/services.png",
      title: {
        ru: "Услуги",
        tg: "Хизматрасониҳо",
        en: "Services & Home",
      },
      href: urlServices,
      badge: {
        ru: "10+ услуг",
        tg: "10+ хизмат",
        en: "10+ services",
      },
      accentGlow: "from-cyan-500/25 via-teal-500/15 to-transparent",
    },
    {
      id: "showcase_realtors",
      icon: "/images/categories/realtors.png",
      title: {
        ru: "Риелторы",
        tg: "Риелторон",
        en: "Certified Realtors",
      },
      href: urlAgencies,
      badge: {
        ru: "15+ риелторов",
        tg: "15+ риелтор",
        en: "15+ realtors",
      },
      accentGlow: "from-violet-500/25 via-purple-500/15 to-transparent",
    },
    {
      id: "showcase_developers",
      icon: "/images/categories/developers.png",
      title: {
        ru: "Застройщики",
        tg: "Сохтмончиён",
        en: "Developers",
      },
      href: urlDevelopers,
      badge: {
        ru: `${developersCount} компаний`,
        tg: `${developersCount} ширкат`,
        en: `${developersCount} builders`,
      },
      accentGlow: "from-emerald-500/25 via-amber-500/15 to-transparent",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-4 sm:pt-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5 sm:mb-6">
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

      {/* 7-Card Showcase Row (Variant 2: Apple Tahoe Live Tiles with Title Below) */}
      <div className="overflow-x-auto pb-4 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none snap-x snap-mandatory">
        <div className="flex items-start justify-start lg:justify-between gap-3 sm:gap-4 min-w-max lg:min-w-0">
          {showcaseItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="group flex flex-col items-center select-none snap-start focus:outline-none"
            >
              {/* Tahoe Live Tile Card: Exactly W: 156px, H: 213px, Radius: 33px, Padding: 12px */}
              <motion.div
                whileHover={{ y: -6, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className="relative w-[156px] h-[213px] rounded-[33px] p-[12px] glass-card flex flex-col items-center justify-between overflow-hidden cursor-pointer transition-colors duration-300 group-hover:border-emerald-500/40 group-hover:shadow-[0_20px_40px_-10px_rgba(16,185,129,0.18)]"
              >
                {/* Ambient Soft Color Light on Hover */}
                <div
                  className={`absolute -top-12 -right-12 w-28 h-28 rounded-full bg-gradient-to-br ${item.accentGlow} blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-500`}
                />

                {/* 3D Illustration: Centered, Exactly 76 × 76 px */}
                <div className="w-[76px] h-[76px] relative z-10 my-auto flex items-center justify-center">
                  <Image
                    src={item.icon}
                    alt={item.title[language]}
                    width={76}
                    height={76}
                    className="w-[76px] h-[76px] object-contain drop-shadow-[0_6px_16px_rgba(0,0,0,0.12)] group-hover:scale-110 transition-transform duration-300"
                    priority
                  />
                </div>

                {/* Count Badge Inside Card (Variant 2 spec) */}
                <div className="w-full relative z-10 flex justify-center pb-1">
                  <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold tracking-tight text-slate-700 dark:text-slate-200 bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-white/10 group-hover:border-emerald-400/50 group-hover:bg-emerald-50/90 dark:group-hover:bg-emerald-950/50 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-all select-none truncate">
                    {item.badge[language]}
                  </span>
                </div>
              </motion.div>

              {/* Title Outside & Below Card (Variant 2 spec, Clickable) */}
              <span className="mt-2.5 text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors text-center tracking-tight max-w-[156px] truncate">
                {item.title[language]}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
