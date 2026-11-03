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

  const handleCardLinkClick = (e: React.MouseEvent) => {
    if (isSwipingRef.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <Card
      className={`rounded-2xl flex flex-col justify-between overflow-hidden transition-all duration-300 group relative ${
        isHighlighted
          ? "glass-card border-2 border-amber-400/80 shadow-[0_16px_36px_-10px_rgba(245,158,11,0.22)] ring-2 ring-amber-400/30"
          : "glass-card hover:border-emerald-500/40 hover:shadow-[0_20px_45px_-12px_rgba(16,185,129,0.18)] hover:-translate-y-1"
      }`}
    >
      <div>
        <div
          className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-900 block rounded-t-2xl group/photo select-none"
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
              src={photos[activePhotoIdx] || item.image}
              alt={item.title}
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

              {/* Frosted Glass Dots / Counter Indicator (AC-24, AC-27) */}
              <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/45 backdrop-blur-md border border-white/15 pointer-events-none">
                {photos.slice(0, 6).map((_, idx) => (
                  <span
                    key={idx}
                    className={`block rounded-full transition-all duration-300 ${
                      idx === activePhotoIdx
                        ? "w-3 h-1.5 bg-white shadow-xs"
                        : "w-1.5 h-1.5 bg-white/40"
                    }`}
                  />
                ))}
                {photos.length > 6 && (
                  <span className="text-[9px] font-bold text-white/90 ml-0.5 font-mono">
                    {activePhotoIdx + 1}/{photos.length}
                  </span>
                )}
              </div>
            </>
          )}

          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10 pointer-events-none">
            {isTop && (
              <Badge variant="gold" className="rounded-xl px-2.5 py-1 text-[11px] font-black tracking-wide pointer-events-auto">
                👑 {isTg ? "ТОП" : "ТОП"}
              </Badge>
            )}
            <Badge variant="emerald" className="rounded-xl px-2.5 py-1 text-[11px] font-bold pointer-events-auto">
              {dealTypeDisplay}
            </Badge>
            <Badge variant="frostedLight" className="rounded-xl px-2.5 py-1 text-[11px] font-bold pointer-events-auto">
              {propertyTypeDisplay}
            </Badge>
          </div>
          <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
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
              className={`h-7 w-7 rounded-xl flex items-center justify-center backdrop-blur-xl transition-all shadow-xs cursor-pointer border ${
                isCompared
                  ? "bg-blue-600 text-white border-blue-400 ring-2 ring-blue-300"
                  : "bg-white/85 text-slate-700 hover:bg-white hover:text-emerald-600 border-white/60 dark:bg-slate-900/80 dark:text-slate-200 dark:border-white/20"
              }`}
            >
              <ArrowLeftRight className="h-3.5 w-3.5" />
            </button>
            <PropertyMetricsBadge idOrSlug={item.slug || item.id} />
          </div>

          {/* Urgent Sale Fire Badge */}
          {isUrgent && (
            <div className="absolute bottom-3 left-3 glass-badge-red text-white text-[10px] font-black px-2.5 py-1 rounded-xl shadow-md flex items-center gap-1 z-10 animate-pulse pointer-events-none">
              <span>🔥</span>
              <span>{isTg ? "Таъҷилӣ" : "Срочно"}</span>
            </div>
          )}

          {item.isNegotiable && (
            <div className="absolute bottom-3 right-3 glass-pill text-[10px] font-bold text-slate-800 dark:text-slate-100 px-2.5 py-1 rounded-xl shadow-xs pointer-events-none">
              🤝 {isTg ? "Савдо мешавад" : "Торг уместен"}
            </div>
          )}
        </div>

        <CardContent className="p-4 sm:p-5 space-y-3">
          <div>
            <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
              {formatPrice(item.priceTjs, item.priceUsd)}
            </div>
            <Link href={href}>
              <h4 className="font-bold text-base text-slate-900 dark:text-slate-100 line-clamp-1 mt-0.5 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {item.title}
              </h4>
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1 font-medium">
              <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              {item.city}, {item.district}
              {item.landmark ? ` (${item.landmark})` : ""}
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300 border-y border-slate-200/60 dark:border-white/10 py-2.5 font-medium">
            <span className="font-bold text-slate-900 dark:text-white">
              {isTg ? `${item.rooms} ҳуҷр.` : `${item.rooms} комн.`}
            </span>
            <span>•</span>
            <span className="font-bold text-slate-900 dark:text-white">{item.area} м²</span>
            {item.floor || item.landArea ? (
              <>
                <span>•</span>
                <span>{item.floor || item.landArea}</span>
              </>
            ) : null}
          </div>
        </CardContent>
      </div>

      <div className="p-4 sm:p-5 pt-0 border-t border-slate-100/80 dark:border-white/10 mt-2 flex items-center justify-between text-xs">
        <div>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-medium uppercase tracking-wider">{sellerTypeDisplay}</span>
          <span className="font-bold text-slate-900 dark:text-white font-mono text-xs">
            {revealed ? item.phone : `${item.phone.slice(0, 8)} •• ••`}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {onPromote && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onPromote(item)}
              className="h-8 px-2 text-[11px] font-bold border-amber-300 bg-amber-50/70 hover:bg-amber-100/80 text-amber-900 gap-1 rounded-xl cursor-pointer shadow-2xs transition-all tactile-press btn-shimmer"
              title={isTg ? "Пешбарӣ дар ТОП" : "Продвинуть в ТОП"}
            >
              <Zap className="h-3 w-3 text-amber-600 fill-amber-500" />
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
            className="h-8 px-2.5 text-xs font-semibold gap-1 rounded-xl glass-pill border-slate-200/80 hover:border-emerald-500/50 hover:text-emerald-700 cursor-pointer transition-all tactile-press btn-shimmer"
          >
            <Phone className="h-3.5 w-3.5 text-emerald-600" />
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
            className="h-8 w-8 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-all border border-emerald-200/80 shadow-2xs hover:scale-105 tactile-press btn-glow-whatsapp cursor-pointer"
          >
            <MessageCircle className="h-4 w-4" />
          </a>
        </div>
      </div>
    </Card>
  );
}
