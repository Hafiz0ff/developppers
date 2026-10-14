"use client";

import React, { useState, useEffect } from "react";
import { StorageUnit, StorageUnitStatus } from "@/types/parking-storage";
import { useLanguage } from "@/context/language-context";
import { useCurrency } from "@/context/currency-context";
import {
  Archive,
  X,
  CheckCircle2,
  Clock,
  Ban,
  MessageCircle,
  Phone,
  Sparkles,
  Lock,
  ThermometerSun,
  Layers,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface StorageChessboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectName: string;
  units: StorageUnit[];
  developerContact: {
    phone: string;
    whatsapp: string;
  };
}

export function StorageChessboardModal({
  isOpen,
  onClose,
  projectName,
  units,
  developerContact,
}: StorageChessboardModalProps) {
  const { language, tDual } = useLanguage();
  const { formatPrice } = useCurrency();

  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [activeUnit, setActiveUnit] = useState<StorageUnit | null>(null);

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

  // Filter units
  const filteredUnits = units.filter((unit) => {
    if (selectedStatus !== "all" && unit.status !== selectedStatus) return false;
    return true;
  });

  const availableCount = units.filter((u) => u.status === "available").length;
  const reservedCount = units.filter((u) => u.status === "reserved").length;
  const soldCount = units.filter((u) => u.status === "sold").length;

  const getStatusBadge = (status: StorageUnitStatus) => {
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

  const buildWhatsappBookingUrl = (unit: StorageUnit) => {
    const text =
      language === "tg"
        ? `Салом! Ман мехоҳам анборхонаи ${unit.number} дар ${unit.level} дар МИ «${projectName}»-ро харидорӣ / банд намоям. Масоҳат: ${unit.area} м², нарх: ${formatPrice(unit.priceTjs, unit.priceUsd)}. Лутфан шартҳои харидро фиристед.`
        : `Здравствуйте! Я хочу забронировать / приобрести кладовую ${unit.number} на уровне ${unit.level} в ЖК «${projectName}». Площадь: ${unit.area} м², стоимость: ${formatPrice(unit.priceTjs, unit.priceUsd)}. Подскажите, пожалуйста, процедуру оформления.`;

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
              <Archive className="h-4 w-4" />
              <span>{tDual("Интерактивная шахматка кладовых", "Ҷадвали интерактивии анборхонаҳо")}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
              {tDual(`Кладовые помещения ЖК «${projectName}»`, `Анборхонаҳои МИ «${projectName}»`)}
            </h2>
            <p className="text-xs text-muted-foreground">
              {tDual(
                "Индивидуальные кладовые для сезонного хранения шин, велосипедов и вещей",
                "Анборхонаҳои инфиродӣ барои нигоҳдории чархҳо, дучарха ва ашёи рӯзғор"
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
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs py-0.5 text-muted-foreground">
              <Layers className="h-3.5 w-3.5 mr-1" />
              {tDual("Цокольный этаж / Подвал", "Ошёнаи таҳхона")}
            </Badge>
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
              {tDual("Все", "Ҳама")} ({units.length})
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
          {/* Units Grid (Scrollable) */}
          <div className="lg:col-span-8 p-4 sm:p-6 overflow-y-auto space-y-4">
            {filteredUnits.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground text-sm">
                {tDual("Нет кладовых, соответствующих выбранным фильтрам.", "Ҳеҷ анборхонае бо ин филтрҳо ёфт нашуд.")}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {filteredUnits.map((unit) => {
                  const isAvailable = unit.status === "available";
                  const isSelected = activeUnit?.id === unit.id;

                  return (
                    <div
                      key={unit.id}
                      onClick={() => {
                        if (isAvailable) {
                          setActiveUnit(unit);
                        }
                      }}
                      className={`relative p-3.5 rounded-2xl border transition-all select-none flex flex-col justify-between gap-2.5 text-xs ${
                        isAvailable
                          ? isSelected
                            ? "border-emerald-600 ring-2 ring-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/40 shadow-md cursor-pointer scale-102"
                            : "border-slate-200 dark:border-slate-800 bg-card hover:border-emerald-400 hover:shadow-md cursor-pointer hover:scale-101"
                          : unit.status === "reserved"
                          ? "border-amber-200 dark:border-amber-900/40 bg-amber-50/30 dark:bg-amber-950/20 opacity-80 cursor-not-allowed"
                          : "border-slate-200 dark:border-slate-800/60 bg-muted/40 opacity-50 cursor-not-allowed"
                      }`}
                    >
                      {/* Top Header of Card */}
                      <div className="flex items-center justify-between gap-1.5">
                        <span className="font-extrabold text-sm text-foreground flex items-center gap-1.5">
                          <Archive className="h-3.5 w-3.5 text-emerald-600" />
                          {unit.number}
                        </span>
                        <Badge variant="secondary" className="text-[10px] py-0 px-1.5 font-medium">
                          {unit.area} м²
                        </Badge>
                      </div>

                      {/* Area & Level */}
                      <div className="space-y-0.5 text-[11px] text-muted-foreground">
                        <div className="flex items-center justify-between">
                          <span>{tDual("Площадь:", "Масоҳат:")}</span>
                          <strong className="text-foreground">{unit.area} м²</strong>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>{tDual("Уровень:", "Ошёна:")}</span>
                          <span>{unit.level}</span>
                        </div>
                      </div>

                      {/* Bottom: Price or Status */}
                      <div className="pt-1.5 border-t border-border/60 flex items-center justify-between">
                        {isAvailable ? (
                          <div>
                            <div className="font-extrabold text-emerald-600 text-xs">
                              {formatPrice(unit.priceTjs, unit.priceUsd)}
                            </div>
                          </div>
                        ) : (
                          <div>{getStatusBadge(unit.status)}</div>
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
            {activeUnit ? (
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>{tDual("Выбранная кладовая", "Анборхонаи интихобшуда")}</span>
                  </div>
                  <h3 className="text-2xl font-black text-foreground">
                    {activeUnit.number} ({activeUnit.level})
                  </h3>
                </div>

                <div className="p-4 rounded-2xl bg-card border border-border space-y-2.5 text-xs">
                  <div className="flex justify-between items-center py-1 border-b border-border/50">
                    <span className="text-muted-foreground">{tDual("Площадь помещения:", "Масоҳати бино:")}</span>
                    <strong className="text-foreground font-bold">{activeUnit.area} м²</strong>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-border/50">
                    <span className="text-muted-foreground">{tDual("Уровень расположения:", "Ошёна:")}</span>
                    <strong className="text-foreground">{activeUnit.level}</strong>
                  </div>
                  <div className="py-1 text-[11px] text-muted-foreground space-y-1">
                    <span className="font-semibold text-foreground block">{tDual("Комплектация:", "Таҷҳизот:")}</span>
                    <div className="flex flex-wrap gap-1">
                      {(language === "tg" && activeUnit.featuresTg ? activeUnit.featuresTg : activeUnit.features || []).map((feat, i) => (
                        <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted text-[10px] text-foreground">
                          <CheckCircle2 className="h-2.5 w-2.5 text-emerald-600" />
                          {feat}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="pt-2 flex justify-between items-baseline">
                    <span className="text-xs text-muted-foreground">{tDual("Стоимость:", "Нарх:")}</span>
                    <span className="text-xl font-extrabold text-emerald-600">
                      {formatPrice(activeUnit.priceTjs, activeUnit.priceUsd)}
                    </span>
                  </div>
                </div>

                {/* Booking Action Buttons */}
                <div className="space-y-2 pt-2">
                  <a
                    href={buildWhatsappBookingUrl(activeUnit)}
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
                  <Archive className="h-6 w-6" />
                </div>
                <div className="font-bold text-sm text-foreground">
                  {tDual("Кладовая не выбрана", "Анборхона интихоб нашудааст")}
                </div>
                <p className="text-xs leading-relaxed">
                  {tDual(
                    "Нажмите на любую свободную зелёную кладовую в шахматке для просмотра параметров и бронирования.",
                    "Барои дидани тафсилот ва банд намудан ягон анборхонаи сабзи дастрасро дар ҷадвал зер кунед."
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
