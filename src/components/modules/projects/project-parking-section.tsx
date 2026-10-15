"use client";

import React, { useState } from "react";
import { ProjectParkingConfig, ParkingSpot } from "@/types/parking-storage";
import { useLanguage } from "@/context/language-context";
import { useCurrency } from "@/context/currency-context";
import { ApplePhotoLightbox } from "./apple-photo-lightbox";
import { Car, ChevronRight, ZoomIn, CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProjectParkingSectionProps {
  config?: ProjectParkingConfig;
  spots?: ParkingSpot[];
  onSelectSpotClick?: () => void;
}

export function ProjectParkingSection({
  config,
  spots = [],
  onSelectSpotClick,
}: ProjectParkingSectionProps) {
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

  const title = language === "tg" && config.titleTg ? config.titleTg : config.title || "Паркинг";
  const subtitle =
    language === "tg" && config.subtitleTg
      ? config.subtitleTg
      : config.subtitle || "Подземные паркинги";
  const description =
    language === "tg" && config.descriptionTg ? config.descriptionTg : config.description;

  // Safe truncation up to 400 characters
  const trimmedDescription =
    description && description.length > 400
      ? description.slice(0, 397) + "..."
      : description;

  const images = config.images || [];

  // Calculate available spots & min price if spots are provided
  const availableSpotsCount =
    spots.length > 0
      ? spots.filter((s) => s.status === "available").length
      : config.availableSpots ?? 0;

  const totalSpotsCount = spots.length > 0 ? spots.length : config.totalSpots ?? 0;

  const minPriceTjs =
    spots.length > 0
      ? spots.filter((s) => s.status === "available").reduce((min, s) => Math.min(min, s.priceTjs), Infinity)
      : config.minPriceTjs;

  const minPriceUsd =
    spots.length > 0
      ? spots.filter((s) => s.status === "available").reduce((min, s) => Math.min(min, s.priceUsd), Infinity)
      : config.minPriceUsd;

  const hasPrice = minPriceTjs && minPriceTjs !== Infinity && minPriceTjs > 0;

  const openLightboxAt = (index: number) => {
    setSelectedPhotoIndex(index);
    setLightboxOpen(true);
  };

  const showSelectButton =
    config.isChessboardPublished && (spots.length > 0 || (config.totalSpots && config.totalSpots > 0));

  return (
    <section id="parking-section" className="container mx-auto px-4 py-4 space-y-6">
      <div className="rounded-3xl border border-slate-200/80 bg-linear-to-b from-slate-50/70 via-white to-slate-50/40 dark:from-slate-900/40 dark:via-background dark:to-slate-900/20 p-6 sm:p-8 shadow-sm">
        {/* Header with Title, Badges and Action */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200/60 dark:border-slate-800">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600">
              <div className="p-1 rounded-md bg-emerald-500/10 text-emerald-600">
                <Car className="h-4 w-4" />
              </div>
              <span>{title}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              {subtitle}
            </h2>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              {availableSpotsCount > 0 && (
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 text-xs py-0.5">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  {tDual(
                    `В наличии: ${availableSpotsCount} из ${totalSpotsCount} мест`,
                    `Дастрас: ${availableSpotsCount} аз ${totalSpotsCount} ҷой`
                  )}
                </Badge>
              )}

              {hasPrice && (
                <Badge variant="secondary" className="font-semibold text-xs py-0.5">
                  {tDual("от", "аз")} {formatPrice(minPriceTjs, minPriceUsd)}
                </Badge>
              )}

              <Badge variant="outline" className="text-xs py-0.5 text-muted-foreground hidden sm:inline-flex">
                <ShieldCheck className="h-3 w-3 mr-1 text-slate-500" />
                {tDual("Охрана 24/7", "Муҳофизати 24/7")}
              </Badge>

              <Badge variant="outline" className="text-xs py-0.5 text-muted-foreground hidden sm:inline-flex">
                <Zap className="h-3 w-3 mr-1 text-amber-500" />
                {tDual("Зарядки EV", "Пуркунии барқӣ")}
              </Badge>
            </div>
          </div>

          {/* Button: "Выбрать машино-место" (Only if chessboard published) */}
          {showSelectButton && (
            <div className="shrink-0">
              <Button
                type="button"
                onClick={onSelectSpotClick}
                className="w-full sm:w-auto h-11 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-xs sm:text-sm shadow-md transition-all gap-2 cursor-pointer group"
              >
                <Car className="h-4 w-4 transition-transform group-hover:scale-110" />
                <span>{tDual("Выбрать машино-место", "Интихоби ҷойи мошин")}</span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </div>
          )}
        </div>

        {/* Content: Description & 3-Photo Collage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6 items-center">
          {/* Description Column */}
          <div className={`${images.length > 0 ? "lg:col-span-5" : "lg:col-span-12"} space-y-4`}>
            {trimmedDescription && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {trimmedDescription}
              </p>
            )}

            <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                <div className="text-[11px] text-muted-foreground">{tDual("Доступ", "Дастрасӣ")}</div>
                <div className="font-bold text-foreground mt-0.5">{tDual("Лифт на -1 и -2 этажи", "Лифт ба ошёнаҳои -1 ва -2")}</div>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                <div className="text-[11px] text-muted-foreground">{tDual("Безопасность", "Бехатарӣ")}</div>
                <div className="font-bold text-foreground mt-0.5">{tDual("Спринклеры и датчики", "Системаи зиддисӯхторӣ")}</div>
              </div>
            </div>
          </div>

          {/* Photos Grid Unified with Storage Section Style (Section 3.2) */}
          {images.length > 0 && (
            <div className="lg:col-span-7">
              <div
                className={`grid gap-3 ${
                  images.length === 1
                    ? "grid-cols-1 h-64"
                    : images.length === 2
                    ? "grid-cols-2 h-64"
                    : "grid-cols-3 h-52 sm:h-64"
                }`}
              >
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
                    {idx === 2 && images.length > 3 && (
                      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center text-white font-bold text-sm">
                        +{images.length - 3} {tDual("фото", "акс")}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
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
