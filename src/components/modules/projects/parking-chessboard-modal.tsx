"use client";

import React, { useState, useEffect } from "react";
import { ParkingSpot, ParkingSpotStatus, ParkingType } from "@/types/parking-storage";
import { useLanguage } from "@/context/language-context";
import { useCurrency } from "@/context/currency-context";
import {
  Car,
  X,
  CheckCircle2,
  Clock,
  Ban,
  MessageCircle,
  Phone,
  Zap,
  Users,
  Bike,
  Layers,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ParkingChessboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectName: string;
  spots: ParkingSpot[];
  developerContact: {
    phone: string;
    whatsapp: string;
  };
}

export function ParkingChessboardModal({
  isOpen,
  onClose,
  projectName,
  spots,
  developerContact,
}: ParkingChessboardModalProps) {
  const { language, tDual } = useLanguage();
  const { formatPrice } = useCurrency();

  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [activeSpot, setActiveSpot] = useState<ParkingSpot | null>(null);

  // Extract unique levels
  const levels = Array.from(new Set(spots.map((s) => s.level)));

  // Escape key handler & body scroll lock
  useEffect(() => {
    if (!isOpen) return;
    const origOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = origOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Filter spots
  const filteredSpots = spots.filter((spot) => {
    if (selectedLevel !== "all" && spot.level !== selectedLevel) return false;
    if (selectedStatus !== "all" && spot.status !== selectedStatus) return false;
    if (selectedType !== "all" && spot.type !== selectedType) return false;
    return true;
  });

  const availableCount = spots.filter((s) => s.status === "available").length;
  const reservedCount = spots.filter((s) => s.status === "reserved").length;
  const soldCount = spots.filter((s) => s.status === "sold").length;

  const getTypeLabel = (type: ParkingType) => {
    switch (type) {
      case "family_double":
        return {
          ru: "Семейное (2 авто)",
          tg: "Оилавӣ (2 мошин)",
          icon: Users,
          badgeColor: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300",
        };
      case "large":
        return {
          ru: "Увеличенное (EV)",
          tg: "Васеъ (EV)",
          icon: Zap,
          badgeColor: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300",
        };
      case "moto":
        return {
          ru: "Мотоместо",
          tg: "Мототсикл",
          icon: Bike,
          badgeColor: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300",
        };
      default:
        return {
          ru: "Стандарт",
          tg: "Стандартӣ",
          icon: Car,
          badgeColor: "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300",
        };
    }
  };

  const getStatusBadge = (status: ParkingSpotStatus) => {
    switch (status) {
      case "available":
        return (
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 text-[11px] font-semibold">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            {tDual("Свободно", "Дастрас")}
          </Badge>
        );
      case "reserved":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 text-[11px] font-semibold">
            <Clock className="h-3 w-3 mr-1" />
            {tDual("Бронь", "Бандшуда")}
          </Badge>
        );
      case "sold":
        return (
          <Badge variant="outline" className="bg-slate-100 text-slate-500 border-slate-300 dark:bg-slate-800 dark:text-slate-400 text-[11px] font-semibold">
            <Ban className="h-3 w-3 mr-1" />
            {tDual("Продано", "Фурӯхташуда")}
          </Badge>
        );
    }
  };

  const cleanWhatsappNumber = developerContact.whatsapp.replace(/\D/g, "");

  const buildWhatsappBookingUrl = (spot: ParkingSpot) => {
    const text =
      language === "tg"
        ? `Салом! Ман мехоҳам ҷойи мошини ${spot.number} дар ${spot.level} дар МИ «${projectName}»-ро харидорӣ / банд намоям. Масоҳат: ${spot.area} м², нарх: ${formatPrice(spot.priceTjs, spot.priceUsd)}. Лутфан шартҳои шартномаро фиристед.`
        : `Здравствуйте! Я хочу забронировать / приобрести машино-место ${spot.number} на уровне ${spot.level} в ЖК «${projectName}». Площадь: ${spot.area} м², стоимость: ${formatPrice(spot.priceTjs, spot.priceUsd)}. Подскажите, пожалуйста, процедуру оформления.`;

    return `https://wa.me/${cleanWhatsappNumber}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-6xl max-h-[92vh] flex flex-col rounded-3xl bg-background border border-border shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-border bg-muted/20 flex items-start justify-between gap-4 shrink-0">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600">
              <Car className="h-4 w-4" />
              <span>{tDual("Интерактивная шахматка паркинга", "Ҷадвали интерактивии таваққуфгоҳ")}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
              {tDual(`Паркинг ЖК «${projectName}»`, `Таваққуфгоҳи МИ «${projectName}»`)}
            </h2>
            <p className="text-xs text-muted-foreground">
              {tDual(
                "Выберите машино-место на схеме для просмотра параметров и бронирования",
                "Ҷойи мошинро барои дидани мушаххасот ва банд намудан интихоб кунед"
              )}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть"
            className="p-2 sm:p-2.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="p-4 sm:px-6 border-b border-border bg-card/60 flex flex-wrap items-center justify-between gap-3 shrink-0 text-xs">
          {/* Level Switcher */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-muted-foreground font-medium mr-1 flex items-center gap-1">
              <Layers className="h-3.5 w-3.5" />
              {tDual("Уровень:", "Ошёна:")}
            </span>
            <button
              type="button"
              onClick={() => setSelectedLevel("all")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                selectedLevel === "all"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-muted hover:bg-muted/80 text-foreground"
              }`}
            >
              {tDual("Все уровни", "Ҳамаи сатҳҳо")} ({spots.length})
            </button>
            {levels.map((lvl) => {
              const count = spots.filter((s) => s.level === lvl).length;
              return (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setSelectedLevel(lvl)}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                    selectedLevel === lvl
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-muted hover:bg-muted/80 text-foreground"
                  }`}
                >
                  {lvl} ({count})
                </button>
              );
            })}
          </div>

          {/* Status Filters */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => setSelectedStatus("all")}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold cursor-pointer ${
                selectedStatus === "all" ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {tDual("Все", "Ҳама")} ({spots.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedStatus("available")}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold cursor-pointer ${
                selectedStatus === "available" ? "bg-emerald-600 text-white" : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
              }`}
            >
              {tDual("Свободно", "Дастрас")} ({availableCount})
            </button>
            <button
              type="button"
              onClick={() => setSelectedStatus("reserved")}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold cursor-pointer ${
                selectedStatus === "reserved" ? "bg-amber-600 text-white" : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
              }`}
            >
              {tDual("Бронь", "Банд")} ({reservedCount})
            </button>
            <button
              type="button"
              onClick={() => setSelectedStatus("sold")}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold cursor-pointer ${
                selectedStatus === "sold" ? "bg-slate-600 text-white" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
              }`}
            >
              {tDual("Продано", "Фурӯхта")} ({soldCount})
            </button>
          </div>
        </div>

        {/* Modal Main Body: Chessboard Grid & Details Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 min-h-0 overflow-hidden">
          {/* Spots Grid (Scrollable) */}
          <div className="lg:col-span-8 p-4 sm:p-6 overflow-y-auto space-y-4">
            {filteredSpots.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground text-sm">
                {tDual("Нет мест, соответствующих выбранным фильтрам.", "Ҳеҷ ҷое бо филтрҳои интихобшуда ёфт нашуд.")}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {filteredSpots.map((spot) => {
                  const typeInfo = getTypeLabel(spot.type);
                  const TypeIcon = typeInfo.icon;
                  const isAvailable = spot.status === "available";
                  const isSelected = activeSpot?.id === spot.id;

                  return (
                    <div
                      key={spot.id}
                      onClick={() => {
                        if (isAvailable) {
                          setActiveSpot(spot);
                        }
                      }}
                      className={`relative p-3.5 rounded-2xl border transition-all select-none flex flex-col justify-between gap-2.5 text-xs ${
                        isAvailable
                          ? isSelected
                            ? "border-emerald-600 ring-2 ring-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/40 shadow-md cursor-pointer scale-102"
                            : "border-slate-200 dark:border-slate-800 bg-card hover:border-emerald-400 hover:shadow-md cursor-pointer hover:scale-101"
                          : spot.status === "reserved"
                          ? "border-amber-200 dark:border-amber-900/40 bg-amber-50/30 dark:bg-amber-950/20 opacity-80 cursor-not-allowed"
                          : "border-slate-200 dark:border-slate-800/60 bg-muted/40 opacity-50 cursor-not-allowed"
                      }`}
                    >
                      {/* Top Header of Card */}
                      <div className="flex items-center justify-between gap-1.5">
                        <span className="font-extrabold text-sm text-foreground">
                          {spot.number}
                        </span>
                        <Badge variant="outline" className={`text-[10px] py-0 px-1.5 font-medium border ${typeInfo.badgeColor}`}>
                          <TypeIcon className="h-2.5 w-2.5 mr-1" />
                          {tDual(typeInfo.ru, typeInfo.tg)}
                        </Badge>
                      </div>

                      {/* Area & Level */}
                      <div className="space-y-0.5 text-[11px] text-muted-foreground">
                        <div className="flex items-center justify-between">
                          <span>{tDual("Площадь:", "Масоҳат:")}</span>
                          <strong className="text-foreground">{spot.area} м²</strong>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>{tDual("Уровень:", "Ошёна:")}</span>
                          <span>{spot.level}</span>
                        </div>
                      </div>

                      {/* Bottom: Price or Status */}
                      <div className="pt-1.5 border-t border-border/60 flex items-center justify-between">
                        {isAvailable ? (
                          <div>
                            <div className="font-extrabold text-emerald-600 text-xs">
                              {formatPrice(spot.priceTjs, spot.priceUsd)}
                            </div>
                          </div>
                        ) : (
                          <div>{getStatusBadge(spot.status)}</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Details & Booking Sidebar */}
          <div className="lg:col-span-4 p-5 sm:p-6 border-t lg:border-t-0 lg:border-l border-border bg-muted/15 flex flex-col justify-between space-y-4 overflow-y-auto">
            {activeSpot ? (
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>{tDual("Выбранное машино-место", "Ҷойи мошини интихобшуда")}</span>
                  </div>
                  <h3 className="text-2xl font-black text-foreground">
                    {activeSpot.number} ({activeSpot.level})
                  </h3>
                </div>

                <div className="p-4 rounded-2xl bg-card border border-border space-y-2.5 text-xs">
                  <div className="flex justify-between items-center py-1 border-b border-border/50">
                    <span className="text-muted-foreground">{tDual("Тип места:", "Намуди ҷой:")}</span>
                    <strong className="text-foreground">{tDual(getTypeLabel(activeSpot.type).ru, getTypeLabel(activeSpot.type).tg)}</strong>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-border/50">
                    <span className="text-muted-foreground">{tDual("Площадь:", "Масоҳат:")}</span>
                    <strong className="text-foreground font-bold">{activeSpot.area} м²</strong>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-border/50">
                    <span className="text-muted-foreground">{tDual("Уровень:", "Ошёнаи ҷойгиршавӣ:")}</span>
                    <strong className="text-foreground">{activeSpot.level}</strong>
                  </div>
                  {activeSpot.note && (
                    <div className="py-1 text-[11px] text-muted-foreground">
                      <span className="font-semibold text-foreground">{tDual("Особенность:", "Хусусият:")}</span>{" "}
                      {language === "tg" && activeSpot.noteTg ? activeSpot.noteTg : activeSpot.note}
                    </div>
                  )}
                  <div className="pt-2 flex justify-between items-baseline">
                    <span className="text-xs text-muted-foreground">{tDual("Стоимость:", "Нарх:")}</span>
                    <span className="text-xl font-extrabold text-emerald-600">
                      {formatPrice(activeSpot.priceTjs, activeSpot.priceUsd)}
                    </span>
                  </div>
                </div>

                {/* Booking Action Buttons */}
                <div className="space-y-2 pt-2">
                  <a
                    href={buildWhatsappBookingUrl(activeSpot)}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 h-11 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md transition-all cursor-pointer"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>{tDual("Забронировать в WhatsApp", "Банд кардан дар WhatsApp")}</span>
                  </a>

                  <a
                    href={`tel:${developerContact.phone}`}
                    className="w-full inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl border border-border hover:bg-muted font-semibold text-xs transition-colors"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    <span>{developerContact.phone}</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground space-y-3 my-auto">
                <div className="p-3 rounded-full bg-muted w-fit mx-auto text-muted-foreground">
                  <Car className="h-6 w-6" />
                </div>
                <div className="font-bold text-sm text-foreground">
                  {tDual("Место не выбрано", "Ҷой интихоб нашудааст")}
                </div>
                <p className="text-xs leading-relaxed">
                  {tDual(
                    "Нажмите на любое свободное зелёное машино-место в шахматке для просмотра деталей и моментального бронирования.",
                    "Барои дидани тафсилот ва банд намудан ягон ҷойи сабзи дастрасро дар ҷадвал зер кунед."
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
