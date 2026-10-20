"use client";

import React, { useState } from "react";
import { ProjectStorageConfig, StorageUnit } from "@/types/parking-storage";
import { useLanguage } from "@/context/language-context";
import { useCurrency } from "@/context/currency-context";
import { ApplePhotoLightbox } from "./apple-photo-lightbox";
import { Archive, ChevronRight, ZoomIn, CheckCircle2, Lock, ThermometerSun, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProjectStorageSectionProps {
  config?: ProjectStorageConfig;
  units?: StorageUnit[];
  onSelectUnitClick?: () => void;
}

export function ProjectStorageSection({
  config,
  units = [],
  onSelectUnitClick,
}: ProjectStorageSectionProps) {
  const { language, tDual } = useLanguage();
  const { formatPrice } = useCurrency();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  // Strict visibility rule: if not enabled or empty -> DO NOT render
  if (!config || !config.isEnabled) {
    return null;
  }

  const hasDescription = Boolean(config.description?.trim() || config.descriptionTg?.trim());
  const hasImages = Boolean(config.images && config.images.length > 0);

  if (!hasDescription && !hasImages) {
    return null;
  }

  const title = language === "tg" && config.titleTg ? config.titleTg : config.title || "Кладовые";
  const subtitle =
    language === "tg" && config.subtitleTg
      ? config.subtitleTg
      : config.subtitle || "Кладовые для хранения вещей";
  const description =
    language === "tg" && config.descriptionTg ? config.descriptionTg : config.description;

  // Safe truncation up to 400 characters
  const trimmedDescription =
    description && description.length > 400
      ? description.slice(0, 397) + "..."
      : description;

  const images = config.images || [];

  // Calculate available units & min price if units are provided
  const availableUnitsCount =
    units.length > 0
      ? units.filter((u) => u.status === "available").length
      : config.availableUnits ?? 0;

  const totalUnitsCount = units.length > 0 ? units.length : config.totalUnits ?? 0;

  const minPriceTjs =
    units.length > 0
      ? units.filter((u) => u.status === "available").reduce((min, u) => Math.min(min, u.priceTjs), Infinity)
      : config.minPriceTjs;

  const minPriceUsd =
    units.length > 0
      ? units.filter((u) => u.status === "available").reduce((min, u) => Math.min(min, u.priceUsd), Infinity)
      : config.minPriceUsd;

  const hasPrice = minPriceTjs && minPriceTjs !== Infinity && minPriceTjs > 0;

  const openLightboxAt = (index: number) => {
    setSelectedPhotoIndex(index);
    setLightboxOpen(true);
  };

  const showSelectButton =
    config.isChessboardPublished && (units.length > 0 || (config.totalUnits && config.totalUnits > 0));

  const advantages = [
    {
      ru: "Сезонные шины и диски",
      tg: "Чархҳои мавсимӣ",
    },
    {
      ru: "Велосипеды и спортинвентарь",
      tg: "Дучарха ва ашёи варзишӣ",
    },
    {
      ru: "Освобождает балкон в квартире",
      tg: "Озод намудани айвони хона",
    },
    {
      ru: "Сухое отапливаемое помещение",
      tg: "Ҷойи гарму хушки нигоҳдорӣ",
    },
  ];

  return (
    <section id="storage-section" className="container mx-auto px-4 py-4 space-y-6">
      <div className="rounded-3xl border border-slate-200/80 bg-linear-to-b from-slate-50/70 via-white to-slate-50/40 dark:from-slate-900/40 dark:via-background dark:to-slate-900/20 p-6 sm:p-8 shadow-sm">
        {/* Header with Title, Badges and Action */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200/60 dark:border-slate-800">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600">
              <div className="p-1 rounded-md bg-emerald-500/10 text-emerald-600">
                <Archive className="h-4 w-4" />
              </div>
              <span>{title}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              {subtitle}
            </h2>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              {availableUnitsCount > 0 && (
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 text-xs py-0.5">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  {tDual(
                    `В наличии: ${availableUnitsCount} из ${totalUnitsCount} помещений`,
                    `Дастрас: ${availableUnitsCount} аз ${totalUnitsCount} анборхона`
                  )}
                </Badge>
              )}

              {hasPrice && (
                <Badge variant="secondary" className="font-semibold text-xs py-0.5">
                  {tDual("от", "аз")} {formatPrice(minPriceTjs, minPriceUsd)}
                </Badge>
              )}

              <Badge variant="outline" className="text-xs py-0.5 text-muted-foreground hidden sm:inline-flex">
                <Lock className="h-3 w-3 mr-1 text-slate-500" />
                {tDual("Индивидуальный доступ", "Дастрасии инфиродӣ")}
              </Badge>

              <Badge variant="outline" className="text-xs py-0.5 text-muted-foreground hidden sm:inline-flex">
                <ThermometerSun className="h-3 w-3 mr-1 text-amber-500" />
                {tDual("Отопление и вентиляция", "Гармидиҳӣ ва ҳавокашӣ")}
              </Badge>
            </div>
          </div>
        </div>

        {/* Content: Description, Advantages & Photos */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6 items-end">
          {/* Description & Advantages Column */}
          <div className={`${images.length > 0 ? "lg:col-span-6" : "lg:col-span-12"} space-y-4`}>
            {trimmedDescription && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {trimmedDescription}
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              {advantages.map((adv, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs shadow-2xs"
                >
                  <Sparkles className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span className="font-medium text-foreground">{tDual(adv.ru, adv.tg)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Photos Grid */}
          {images.length > 0 && (
            <div className="lg:col-span-6">
              <div className={`grid gap-3 ${images.length === 1 ? "grid-cols-1 h-64" : images.length === 2 ? "grid-cols-2 h-64" : "grid-cols-3 h-52 sm:h-56"}`}>
                {images.slice(0, 3).map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => openLightboxAt(idx)}
                    className="relative rounded-2xl overflow-hidden group cursor-pointer border border-slate-200/70 shadow-sm bg-slate-100 dark:bg-slate-800 h-full"
                  >
                    <img
                      src={img}
                      alt={`${title} — фото ${idx + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity p-2.5 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/20 shadow-md">
                        <ZoomIn className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Button: placed in right part under the 3rd (last) photo */}
        {showSelectButton && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-3">
            <div className="hidden lg:block lg:col-span-6" />
            <div className="lg:col-span-6 flex justify-end">
              <Button
                type="button"
                onClick={onSelectUnitClick}
                className="w-full sm:w-auto h-11 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-xs sm:text-sm shadow-md transition-all gap-2 cursor-pointer group"
              >
                <Archive className="h-4 w-4 transition-transform group-hover:scale-110" />
                <span>{tDual("Выбрать кладовую", "Интихоби анборхона")}</span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Apple-Style Lightbox */}
      <ApplePhotoLightbox
        images={images}
        initialIndex={selectedPhotoIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        title={title}
      />
    </section>
  );
}
