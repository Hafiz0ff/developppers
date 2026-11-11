"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { useLanguage } from "@/context/language-context";
import { TrendingUp } from "lucide-react";
import {
  getShowcaseMiniCards,
  computeMiniCardBadge,
  resolveMiniCardHref,
} from "@/lib/showcase/showcase-store";

interface ShowcaseSectionProps {
  activeCity?: string;
}

export function HomepageShowcaseMatrix({ activeCity = "khujand" }: ShowcaseSectionProps) {
  const { language, tDual } = useLanguage();

  const miniCards = useMemo(() => {
    return getShowcaseMiniCards()
      .filter((card) => card.visible)
      .map((card) => ({
        ...card,
        href: resolveMiniCardHref(card, activeCity, language),
        badge: computeMiniCardBadge(card, activeCity),
      }));
  }, [activeCity, language]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-4 sm:pt-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5 sm:mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
            <TrendingUp className="h-3.5 w-3.5" />
            {tDual("Навигация по недвижимости", "Роҳнамои амвол", "Real Estate Navigation")}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {tDual(
              "Главные направления рынка Таджикистана",
              "Самтҳои асосии бозори Тоҷикистон",
              "Key Directions in Tajikistan Real Estate"
            )}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {tDual(
              "Прямой доступ к проверенным каталогам новостроек, вторичного жилья, аренды и компаний",
              "Дастрасии мустақим ба феҳристи санҷидашудаи навсохтҳо, манзили дуюмдараҷа ва ширкатҳо",
              "Direct access to verified catalogs of new buildings, resale, rentals, and companies"
            )}
          </p>
        </div>
      </div>

      {/* 7-Card Showcase Row (Apple Tahoe Live Tiles with Title Below, strictly 156 × 213 px) */}
      <div className="overflow-x-auto pb-4 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none snap-x snap-mandatory">
        <div className="flex items-start justify-start lg:justify-between gap-3 sm:gap-4 min-w-max lg:min-w-0">
          {miniCards.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="group flex flex-col items-center select-none snap-start focus:outline-none"
            >
              {/* Tahoe Live Tile Card: Exactly W: 156px, H: 213px, Radius: 24px, Padding: 12px (AC-02) */}
              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className="relative w-[156px] h-[213px] rounded-2xl p-3 bg-card border border-border/80 shadow-xs flex flex-col items-center justify-between overflow-hidden cursor-pointer transition-all duration-200 hover:border-border hover:shadow-md"
              >

                {/* 3D Illustration: Centered, Exactly 76 × 76 px (AC-02, AC-03) */}
                <div className="w-[76px] h-[76px] relative z-10 my-auto flex items-center justify-center">
                  <Image
                    src={item.icon}
                    alt={item.title[language] || item.title.ru}
                    width={76}
                    height={76}
                    className="w-[76px] h-[76px] object-contain drop-shadow-[0_6px_16px_rgba(0,0,0,0.12)] group-hover:scale-110 transition-transform duration-300"
                    priority
                  />
                </div>

                {/* Count Badge Inside Card (Purely numerical with +, larger & bolder, AC-12..15) */}
                <div className="w-full relative z-10 flex justify-center pb-1.5">
                  <span className="inline-flex items-center justify-center min-w-[70px] px-3.5 py-1 rounded-full text-sm font-bold tracking-wide text-foreground bg-muted border border-border/80 shadow-2xs group-hover:border-foreground/30 group-hover:bg-accent transition-all select-none">
                    {item.badge}
                  </span>
                </div>
              </motion.div>

              {/* Title Outside & Below Card (Clickable, AC-02, AC-04) */}
              <span className="mt-2.5 text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors text-center tracking-tight max-w-[156px] truncate">
                {item.title[language] || item.title.ru}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
