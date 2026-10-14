"use client";

import React, { useState, useMemo } from "react";
import { UnitData } from "@/lib/data/mock-db";
import { useCurrency } from "@/context/currency-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Layers,
  Building,
  CheckCircle2,
  Clock,
  XCircle,
  Phone,
  MessageCircle,
  Maximize2,
  Home,
  SlidersHorizontal,
} from "lucide-react";

interface BuildingCrossSectionProps {
  units: UnitData[];
  projectName: string;
  developerContact?: {
    phone: string;
    whatsapp: string;
  };
  onSelectUnit?: (unit: UnitData) => void;
  maxFloorsVisible?: number;
}

export function BuildingCrossSection({
  units,
  projectName,
  developerContact = {
    phone: "+992 92 700 5555",
    whatsapp: "+992927005555",
  },
  onSelectUnit,
  maxFloorsVisible = 16,
}: BuildingCrossSectionProps) {
  const { formatPrice } = useCurrency();

  // Unique sections
  const sections = useMemo(() => {
    const list = Array.from(new Set(units.map((u) => u.section))).sort();
    return list.length > 0 ? list : ["Секция 1"];
  }, [units]);

  const [activeSection, setActiveSection] = useState<string>(sections[0] || "Секция 1");
  const [selectedRooms, setSelectedRooms] = useState<string>("all");
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);
  const [activeUnit, setActiveUnit] = useState<UnitData | null>(null);

  // Units in the active section
  const sectionUnits = useMemo(() => {
    return units.filter((u) => u.section === activeSection);
  }, [units, activeSection]);

  // Unique floors in this section (ordered top to bottom)
  const floors = useMemo(() => {
    const set = new Set(sectionUnits.map((u) => u.floor));
    return Array.from(set).sort((a, b) => b - a);
  }, [sectionUnits]);

  // Group units by floor
  const unitsByFloor = useMemo(() => {
    const map = new Map<number, UnitData[]>();
    for (const f of floors) {
      map.set(
        f,
        sectionUnits
          .filter((u) => u.floor === f)
          .sort((a, b) => parseInt(a.unitNumber, 10) - parseInt(b.unitNumber, 10))
      );
    }
    return map;
  }, [floors, sectionUnits]);

  // Counts by status
  const statusStats = useMemo(() => {
    const available = sectionUnits.filter((u) => u.status === "available").length;
    const reserved = sectionUnits.filter((u) => u.status === "reserved").length;
    const sold = sectionUnits.filter((u) => u.status === "sold").length;
    return { available, reserved, sold, total: sectionUnits.length };
  }, [sectionUnits]);

  const handleUnitClick = (unit: UnitData) => {
    setActiveUnit(unit);
    if (onSelectUnit) {
      onSelectUnit(unit);
    }
  };

  const getStatusBg = (status: UnitData["status"], isDimmed: boolean) => {
    if (isDimmed) {
      return "opacity-30 border-dashed border-slate-300 dark:border-slate-700 bg-slate-100/50 dark:bg-slate-900/50 text-slate-400";
    }

    switch (status) {
      case "available":
        return "bg-emerald-500/15 border-emerald-500/40 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-500/30 hover:border-emerald-500 shadow-xs";
      case "reserved":
        return "bg-amber-500/15 border-amber-500/40 text-amber-800 dark:text-amber-300 hover:bg-amber-500/30 hover:border-amber-500 shadow-xs";
      case "sold":
        return "bg-slate-200/50 dark:bg-slate-800/50 border-slate-300/40 dark:border-slate-700/50 text-slate-400 dark:text-slate-500 hover:bg-slate-200";
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. TOP CONTROLS: SECTION SWITCHER & ROOM FILTER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card border rounded-2xl p-3.5 shadow-xs">
        {/* Sections Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none]">
          <span className="text-xs font-semibold text-muted-foreground mr-1 hidden sm:inline">
            Подъезд:
          </span>
          {sections.map((sec) => (
            <button
              key={sec}
              type="button"
              onClick={() => {
                setActiveSection(sec);
                setSelectedFloor(null);
              }}
              className={`h-8 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeSection === sec
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-muted/60 hover:bg-muted text-muted-foreground"
              }`}
            >
              {sec}
            </button>
          ))}
        </div>

        {/* Room Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto [scrollbar-width:none]">
          <span className="text-xs font-semibold text-muted-foreground mr-1 hidden sm:inline">
            Комнат:
          </span>
          {[
            { id: "all", label: "Все" },
            { id: "1", label: "1" },
            { id: "2", label: "2" },
            { id: "3", label: "3" },
            { id: "4", label: "4+" },
          ].map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setSelectedRooms(r.id)}
              className={`h-7 px-2.5 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                selectedRooms === r.id
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                  : "bg-muted/40 hover:bg-muted text-muted-foreground"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. STATUS LEGEND STRIP (Section 8.2 of Spec) */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs px-1">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-emerald-500 shadow-xs" />
            <span className="font-semibold text-foreground">Продаётся</span>
            <span className="text-muted-foreground text-[11px]">({statusStats.available})</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-amber-500 shadow-xs" />
            <span className="font-semibold text-foreground">Бронь</span>
            <span className="text-muted-foreground text-[11px]">({statusStats.reserved})</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-slate-400 dark:bg-slate-600 shadow-xs" />
            <span className="font-semibold text-foreground">Продано</span>
            <span className="text-muted-foreground text-[11px]">({statusStats.sold})</span>
          </div>
        </div>

        {selectedFloor && (
          <button
            type="button"
            onClick={() => setSelectedFloor(null)}
            className="text-xs text-emerald-600 hover:underline font-medium cursor-pointer"
          >
            Сбросить фильтр этажа (выбран {selectedFloor} этаж)
          </button>
        )}
      </div>

      {/* 3. VISUAL CROSS-SECTION ELEVATION GRID */}
      <div className="bg-slate-950/90 dark:bg-slate-900 border rounded-2xl p-4 sm:p-6 overflow-x-auto shadow-inner">
        <div className="min-w-[640px] space-y-2">
          {floors.map((floorNum) => {
            const floorUnits = unitsByFloor.get(floorNum) || [];
            const isSelectedFloor = selectedFloor === floorNum;
            const isFloorDimmed = selectedFloor !== null && !isSelectedFloor;

            return (
              <div
                key={floorNum}
                className={`flex items-center gap-3 transition-opacity ${
                  isFloorDimmed ? "opacity-35" : "opacity-100"
                }`}
              >
                {/* Floor Selector Button on Left (Section 7.1) */}
                <button
                  type="button"
                  onClick={() => setSelectedFloor(isSelectedFloor ? null : floorNum)}
                  className={`w-16 h-10 rounded-xl text-xs font-bold shrink-0 flex items-center justify-center transition-all cursor-pointer border ${
                    isSelectedFloor
                      ? "bg-emerald-600 text-white border-emerald-500 shadow-sm"
                      : "bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800"
                  }`}
                  title={`Выбрать ${floorNum} этаж`}
                >
                  {floorNum} эт.
                </button>

                {/* Units Row in Section Cut */}
                <div className="flex-1 grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {floorUnits.map((unit) => {
                    const isRoomMatch =
                      selectedRooms === "all" ||
                      (selectedRooms === "4" ? unit.roomsCount >= 4 : unit.roomsCount === parseInt(selectedRooms, 10));
                    const isUnitDimmed = !isRoomMatch || isFloorDimmed;

                    return (
                      <button
                        key={unit.id}
                        type="button"
                        onClick={() => handleUnitClick(unit)}
                        disabled={isUnitDimmed && !isRoomMatch}
                        className={`h-10 px-2 rounded-xl border text-center transition-all duration-200 cursor-pointer flex flex-col justify-center items-center ${getStatusBg(
                          unit.status,
                          isUnitDimmed
                        )}`}
                        title={`Кв. №${unit.unitNumber} (${unit.roomsCount}-комн., ${unit.totalArea} м²)`}
                      >
                        <div className="text-[11px] font-bold leading-tight truncate">
                          №{unit.unitNumber} • {unit.roomsCount}к
                        </div>
                        <div className="text-[10px] font-medium opacity-85 leading-none">
                          {unit.totalArea} м²
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. MODAL DIALOG WITH UNIT DETAILS ON CLICK (Section 8.3) */}
      <Dialog open={!!activeUnit} onOpenChange={(open) => !open && setActiveUnit(null)}>
        <DialogContent className="max-w-md p-6">
          {activeUnit && (
            <div className="space-y-5">
              <DialogHeader>
                <div className="flex items-center justify-between gap-2">
                  <Badge
                    className={
                      activeUnit.status === "available"
                        ? "bg-emerald-600 text-white"
                        : activeUnit.status === "reserved"
                        ? "bg-amber-600 text-white"
                        : "bg-slate-500 text-white"
                    }
                  >
                    {activeUnit.status === "available"
                      ? "Свободна для покупки"
                      : activeUnit.status === "reserved"
                      ? "Забронирована"
                      : "Продана"}
                  </Badge>
                  <span className="text-xs font-semibold text-muted-foreground">
                    {activeUnit.section} • {activeUnit.floor} этаж
                  </span>
                </div>
                <DialogTitle className="text-xl font-bold pt-2">
                  Квартира №{activeUnit.unitNumber} ({activeUnit.roomsCount}-комнатная)
                </DialogTitle>
                <DialogDescription className="text-xs">
                  {projectName} — {activeUnit.section}, {activeUnit.floor} этаж из 16
                </DialogDescription>
              </DialogHeader>

              {/* Price & Area Highlights */}
              <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-muted/40 border">
                <div>
                  <div className="text-[11px] text-muted-foreground">Общая стоимость:</div>
                  <div className="text-lg font-extrabold text-emerald-600">
                    {formatPrice(activeUnit.priceTjs, activeUnit.priceUsd)}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-muted-foreground">Площадь и цена м²:</div>
                  <div className="text-sm font-bold text-foreground">
                    {activeUnit.totalArea} м² (
                    {formatPrice(activeUnit.pricePerMeterTjs, activeUnit.pricePerMeterUsd)}/м²)
                  </div>
                </div>
              </div>

              {/* Additional specs */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-card border">
                  <span className="text-muted-foreground text-[10px] block">Тип жилья:</span>
                  <span className="font-semibold text-foreground">
                    {activeUnit.type === "studio" ? "Студия" : "Квартира"}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-card border">
                  <span className="text-muted-foreground text-[10px] block">Балкон / Лоджия:</span>
                  <span className="font-semibold text-foreground">
                    {activeUnit.hasBalcony ? "Есть балкон" : "Без балкона"}
                  </span>
                </div>
              </div>

              {/* CTAs */}
              <div className="space-y-2 pt-1">
                {activeUnit.status === "available" ? (
                  <>
                    <a
                      href={`https://wa.me/${developerContact.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
                        `Здравствуйте! Интересует квартира №${activeUnit.unitNumber} (${activeUnit.roomsCount}-комн., ${activeUnit.totalArea} м²) на ${activeUnit.floor} этаже в ЖК «${projectName}». Расскажите об условиях бронирования.`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 h-11 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-colors"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Забронировать в WhatsApp
                    </a>

                    <a
                      href={`tel:${developerContact.phone}`}
                      className="w-full inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl border hover:bg-muted font-semibold text-xs transition-colors"
                    >
                      <Phone className="h-4 w-4" />
                      Позвонить в отдел продаж
                    </a>
                  </>
                ) : (
                  <div className="p-3 rounded-xl bg-muted text-center text-xs text-muted-foreground">
                    Данная квартира {activeUnit.status === "reserved" ? "забронирована" : "продана"}. Вы можете выбрать
                    другие свободные варианты на этом или соседних этажах.
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
