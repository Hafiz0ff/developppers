"use client";

import React, { useState, useMemo, useRef } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  MapPin,
  MessageCircle,
  Phone,
  Zap,
  ArrowLeftRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/language-context";
import type { ClassifiedCard as ClassifiedCardData } from "@/lib/classifieds/map-card";
import { PropertyMetricsBadge } from "@/components/modules/common/property-metrics-badge";
import { useCompare } from "@/context/compare-context";
import { classifiedToCompareProperty } from "@/lib/compare/compare-store";

type Props = {
  item: ClassifiedCardData;
  formatPrice: (tjs: number, usd: number) => string;
  onPromote?: (item: ClassifiedCardData) => void;
};

function postLead(item: ClassifiedCardData, source: "phone_click" | "whatsapp_click") {
  fetch("/api/crm/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      clientName: source === "phone_click" ? "Посетитель сайта (Звонок)" : "Посетитель сайта (WhatsApp)",
      clientPhone: source === "phone_click" ? "+992 (просмотр номера)" : "+992 (переход в WA)",
      classifiedId: item.id,
      classifiedTitle: item.title,
      budget: item.priceUsd,
      commissionPercent: 2,
      source,
      notes: `Объявление: ${item.title} (${item.city}, ${item.district}).`,
    }),
  }).catch(() => {});
}

const FALLBACK_APARTMENT_IMAGES = [
  "/images/properties/apt-1.jpg",
  "/images/properties/apt-2.jpg",
  "/images/properties/apt-3.jpg",
  "/images/properties/apt-4.jpg",
  "/images/projects/qayroqum.jpg",
];

const FALLBACK_HOUSE_IMAGES = [
  "/images/properties/house-1.jpg",
  "/images/properties/house-2.jpg",
  "/images/properties/house-3.jpg",
  "/images/properties/house-4.jpg",
];

const FALLBACK_COMMERCIAL_IMAGES = [
  "/images/properties/comm-1.jpg",
  "/images/properties/comm-2.jpg",
  "/images/properties/apt-1.jpg",
];

export function ClassifiedCard({ item, formatPrice, onPromote }: Props) {
  const { language } = useLanguage();
  const isTg = language === "tg";
  const { toggleCompare, isInCompare } = useCompare();
  const isCompared = isInCompare(item.id) || isInCompare(item.slug || "");
  const [revealed, setRevealed] = useState(false);
  const href = `/classifieds/${item.slug}`;

  const dealTypeDisplay = isTg
    ? item.dealType === "Аренда"
      ? "Иҷора"
      : "Фурӯш"
    : item.dealType;

  const propertyTypeDisplay = isTg
    ? item.propertyType === "Квартира"
      ? "Хонадон"
      : item.propertyType.includes("Ҳавлӣ") || item.propertyType.includes("Дом")
      ? "Ҳавлӣ"
      : item.propertyType === "Коммерция"
      ? "Амволи тиҷоратӣ"
      : item.propertyType
    : item.propertyType;

  const sellerTypeDisplay = isTg
    ? item.sellerType === "Собственник"
      ? "Соҳибмулк"
      : item.sellerType === "Агентство"
      ? "Агентии амвол"
      : item.sellerType.includes("Риелтор")
      ? "Мутахассис (Риелтор)"
      : item.sellerType
    : item.sellerType;

  const isHighlighted = Boolean(item.isHighlighted);
  const isTop = Boolean(item.isTop);
  const isUrgent = Boolean(item.isUrgent);

  // Photos array for switcher (AC-28: actual available count)
  const photos: string[] = useMemo(() => {
    const rawPhotos = (item as unknown as { photos?: string[] }).photos;
    const list = [
      ...(item.images || []),
      ...(rawPhotos || []),
      item.image,
    ].filter((p): p is string => Boolean(p && typeof p === "string"));
    return Array.from(new Set(list));
  }, [item.images, item.image, item]);

  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const isSwipingRef = useRef(false);

  // Desktop click handlers strictly isolated (AC-20, AC-23)
  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActivePhotoIdx((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
  };

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActivePhotoIdx((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
  };

  // Mobile touch handlers for swipe without triggering card link (AC-21, AC-22)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (photos.length <= 1) return;
    const touch = e.touches[0];
    setTouchStartX(touch.clientX);
    setTouchStartY(touch.clientY);
    isSwipingRef.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null || touchStartY === null || photos.length <= 1) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;
    if (Math.abs(deltaX) > 25 && Math.abs(deltaX) > Math.abs(deltaY)) {
      isSwipingRef.current = true;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null || photos.length <= 1) return;
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touchStartY !== null ? touch.clientY - touchStartY : 0;

    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
      e.stopPropagation();
      if (deltaX > 0) {
        // Swipe right -> previous photo
        setActivePhotoIdx((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
      } else {
        // Swipe left -> next photo
        setActivePhotoIdx((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
      }
    }
    setTouchStartX(null);
    setTouchStartY(null);
    setTimeout(() => {
      isSwipingRef.current = false;
    }, 120);
  };

  const getFallbackImage = (idx = 0) => {
    const isHouse = item.propertyType?.includes("Дом") || item.propertyType?.includes("Ҳавлӣ");
    const isComm = item.propertyType?.includes("Коммерция");
    if (isHouse) {
      return FALLBACK_HOUSE_IMAGES[idx % FALLBACK_HOUSE_IMAGES.length];
    }
    if (isComm) {
      return FALLBACK_COMMERCIAL_IMAGES[idx % FALLBACK_COMMERCIAL_IMAGES.length];
    }
    return FALLBACK_APARTMENT_IMAGES[idx % FALLBACK_APARTMENT_IMAGES.length];
  };

  const handleCardLinkClick = (e: React.MouseEvent) => {
    if (isSwipingRef.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <Card
      className={`rounded-2xl flex flex-col justify-between overflow-hidden bg-card border border-border/80 shadow-xs hover:border-border hover:shadow-md transition-all duration-200 group relative ${
        isHighlighted
          ? "ring-2 ring-primary/40 border-primary/60"
          : ""
      }`}
    >
      <div>
        <div
          className="relative h-48 sm:h-52 w-full overflow-hidden bg-muted block rounded-t-2xl group/photo select-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <Link
            href={href}
            onClick={handleCardLinkClick}
            className="block w-full h-full"
          >
            <img
              src={photos[activePhotoIdx] || item.image || getFallbackImage(activePhotoIdx)}
              alt={item.title}
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.currentTarget;
                const fallback = getFallbackImage(activePhotoIdx);
                if (target.src !== fallback) {
                  target.src = fallback;
                }
              }}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </Link>

          {/* Desktop Hover Arrows (strictly on click, isolated, AC-23, AC-26, AC-27) */}
          {photos.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrevPhoto}
                aria-label={isTg ? "Акси пешина" : "Предыдущее фото"}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 h-7 w-7 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover/photo:opacity-100 transition-opacity duration-200 shadow-md cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleNextPhoto}
                aria-label={isTg ? "Акси навбатӣ" : "Следующее фото"}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 h-7 w-7 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover/photo:opacity-100 transition-opacity duration-200 shadow-md cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>

            </>
          )}

          {/* Top Overlay: Left Status Badges & Right Action Cluster (Collision-Free) */}
          <div className="absolute top-2.5 inset-x-2.5 z-20 flex items-center justify-between gap-1.5 pointer-events-none">
            {/* Left: Status Badges (Max 1 Badge: Top > Urgent > Deal Type) */}
            <div className="flex items-center gap-1 min-w-0 shrink pointer-events-auto">
              {isTop ? (
                <Badge variant="secondary" className="rounded-lg px-2 py-0.5 text-xs font-semibold shrink-0 shadow-xs">
                  👑 {isTg ? "ТОП" : "ТОП"}
                </Badge>
              ) : isUrgent ? (
                <Badge variant="destructive" className="rounded-lg px-2 py-0.5 text-xs font-semibold shrink-0 shadow-xs">
                  🔥 {isTg ? "Таъҷилӣ" : "Срочно"}
                </Badge>
              ) : (
                <Badge variant="secondary" className="rounded-lg px-2 py-0.5 text-xs font-semibold shrink-0 shadow-xs">
                  {dealTypeDisplay}
                </Badge>
              )}
            </div>

            {/* Right: Compare Toggle & Metrics Cluster (Matching Height h-7) */}
            <div className="flex items-center gap-1.5 shrink-0 pointer-events-auto">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleCompare(classifiedToCompareProperty(item));
                }}
                title={
                  isCompared
                    ? isTg
                      ? "Аз муқоиса тоза кардан"
                      : "Удалить из сравнения"
                    : isTg
                    ? "Ба муқоиса илова кардан"
                    : "Добавить в сравнение"
                }
                aria-label={
                  isCompared
                    ? isTg
                      ? "Аз муқоиса тоза кардан"
                      : "Удалить из сравнения"
                    : isTg
                    ? "Ба муқоиса илова кардан"
                    : "Добавить в сравнение"
                }
                className={`h-7 w-7 rounded-lg flex items-center justify-center backdrop-blur-md transition-all shadow-xs cursor-pointer border ${
                  isCompared
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background/80 hover:bg-background text-foreground hover:text-primary border-border/80"
                }`}
              >
                <ArrowLeftRight className="h-3.5 w-3.5" />
              </button>
              <PropertyMetricsBadge idOrSlug={item.slug || item.id} />
            </div>
          </div>

          {/* Bottom Overlay: Photo Pagination Dots (Left-aligned, Collision-Free) */}
          {photos.length > 1 && (
            <div className="absolute bottom-2.5 left-2.5 z-20 pointer-events-none">
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 pointer-events-auto shadow-xs">
                {photos.slice(0, 5).map((_, idx) => (
                  <span
                    key={idx}
                    className={`block rounded-full transition-all duration-300 ${
                      idx === activePhotoIdx
                        ? "w-2.5 h-1.5 bg-white shadow-xs"
                        : "w-1 h-1 bg-white/40"
                    }`}
                  />
                ))}
                {photos.length > 5 && (
                  <span className="text-xs font-bold text-white/95 ml-1 font-mono">
                    {activePhotoIdx + 1}/{photos.length}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        <CardContent className="p-4 sm:p-5 space-y-3">
          <div>
            <div className="flex items-baseline justify-between gap-2">
              <div className="text-xl font-bold text-foreground tracking-tight">
                {formatPrice(item.priceTjs, item.priceUsd)}
              </div>
              {item.isNegotiable && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground bg-muted border border-border/80 px-2 py-0.5 rounded-full select-none shrink-0 shadow-xs">
                  <span>🤝</span>
                  <span>{isTg ? "Савдо" : "Торг уместен"}</span>
                </span>
              )}
            </div>
            <Link href={href}>
              <h4 className="font-semibold text-base text-foreground line-clamp-1 mt-1 group-hover:text-primary transition-colors">
                {item.title}
              </h4>
            </Link>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1 font-medium">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              {item.city}, {item.district}
              {item.landmark ? ` (${item.landmark})` : ""}
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground border-y border-border/60 py-2.5 font-medium">
            <span className="font-semibold text-foreground">
              {isTg ? `${item.rooms} ҳуҷр.` : `${item.rooms} комн.`}
            </span>
            <span>•</span>
            <span className="font-semibold text-foreground">{item.area} м²</span>
            {item.floor || item.landArea ? (
              <>
                <span>•</span>
                <span>{item.floor || item.landArea}</span>
              </>
            ) : null}
          </div>
        </CardContent>
      </div>

      <div className="p-4 sm:p-5 pt-0 border-t border-border/60 mt-2 flex items-center justify-between text-xs">
        <div>
          <span className="text-xs text-muted-foreground block font-medium uppercase tracking-wider">{sellerTypeDisplay}</span>
          <span className="font-semibold text-foreground font-mono text-xs">
            {revealed ? item.phone : `${item.phone.slice(0, 8)} •• ••`}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {onPromote && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onPromote(item)}
              className="h-8 px-2 text-xs font-semibold gap-1 rounded-xl cursor-pointer shadow-xs transition-all"
              title={isTg ? "Пешбарӣ дар ТОП" : "Продвинуть в ТОП"}
            >
              <Zap className="h-3 w-3 text-amber-500 fill-amber-500" />
              <span>{isTg ? "ТОП" : "ТОП"}</span>
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              const next = !revealed;
              setRevealed(next);
              if (next) postLead(item, "phone_click");
            }}
            className="h-8 px-2.5 text-xs font-semibold gap-1 rounded-xl border-border/80 hover:border-primary/50 hover:text-primary cursor-pointer transition-all shadow-xs"
          >
            <Phone className="h-3.5 w-3.5 text-muted-foreground" />
            {revealed
              ? isTg
                ? "Пӯшидан"
                : "Скрыть"
              : isTg
              ? "Нишон додан"
              : "Показать"}
          </Button>
          <a
            href={`https://wa.me/${item.whatsapp.replace(/\D/g, "")}`}
            target="_blank"
            rel="noreferrer"
            onClick={() => postLead(item, "whatsapp_click")}
            className="h-8 w-8 rounded-xl bg-muted text-foreground hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all border border-border/80 shadow-xs cursor-pointer"
          >
            <MessageCircle className="h-4 w-4" />
          </a>
        </div>
      </div>
    </Card>
  );
}
