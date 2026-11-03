"use client";

import React, { useState, useMemo } from "react";
import { UnitData } from "@/lib/data/mock-db";
import { useCurrency } from "@/context/currency-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Grid3X3,
  ListFilter,
  CheckCircle2,
  Clock,
  XCircle,
  Phone,
  MessageCircle,
  Maximize2,
  SlidersHorizontal,
  Home,
  Layers,
  Building,
  Calculator,
  Calendar,
  Sparkles,
  Info,
  Compass,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

import { useLanguage } from "@/context/language-context";
import { formatNewBuildingPricePerMeter, getPricePerMeterLabel } from "@/lib/pricing/new-building-price";
import { UnitDataTable } from "@/components/modules/projects/unit-data-table";

interface ChessboardProps {
  units: UnitData[];
  projectName?: string;
  onUpdateUnitStatus?: (unitId: string, newStatus: "available" | "reserved" | "sold") => void;
  isEditable?: boolean;
  developerContact?: {
    phone: string;
    whatsapp: string;
  };
  onSelectUnitForDeal?: (unit: UnitData) => void;
}

export function Chessboard({
  units: initialUnits,
  projectName = "Жилой комплекс",
  onUpdateUnitStatus,
  isEditable = false,
  developerContact = {
    phone: "+992 92 700 5555",
    whatsapp: "+992927005555",
  },
  onSelectUnitForDeal,
}: ChessboardProps) {
  const { formatPrice, currency } = useCurrency();
  const { language, tDual } = useLanguage();
  const [units, setUnits] = useState<UnitData[]>(initialUnits);
  const [selectedUnit, setSelectedUnit] = useState<UnitData | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isPlanZoomed, setIsPlanZoomed] = useState(false);

  // Installment Calculator state in modal
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(30);
  const [installmentMonths, setInstallmentMonths] = useState<number>(24);

  // Filters state
  const [roomsFilter, setRoomsFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sectionFilter, setSectionFilter] = useState<string>("all");
  const [maxPrice, setMaxPrice] = useState<string>("");

  // Sync state if initialUnits changes
  React.useEffect(() => {
    setUnits(initialUnits);
  }, [initialUnits]);

  // Unique sections & floors
  const sections = useMemo(() => {
    const set = new Set(units.map((u) => u.section));
    return Array.from(set).sort();
  }, [units]);

  const floors = useMemo(() => {
    const set = new Set(units.map((u) => u.floor));
    return Array.from(set).sort((a, b) => b - a); // Highest floor first
  }, [units]);

  // Filtered units for grid and stats
  const filteredUnits = useMemo(() => {
    return units.filter((u) => {
      if (roomsFilter !== "all" && u.roomsCount !== parseInt(roomsFilter, 10)) {
        return false;
      }
      if (statusFilter !== "all" && u.status !== statusFilter) {
        return false;
      }
      if (sectionFilter !== "all" && u.section !== sectionFilter) {
        return false;
      }
      if (maxPrice) {
        const limit = parseFloat(maxPrice);
        if (!isNaN(limit)) {
          const compPrice = currency === "USD" ? u.priceUsd : u.priceTjs;
          if (compPrice > limit) return false;
        }
      }
      return true;
    });
  }, [units, roomsFilter, statusFilter, sectionFilter, maxPrice, currency]);

  // Statistics
  const stats = useMemo(() => {
    const total = units.length;
    const available = units.filter((u) => u.status === "available").length;
    const reserved = units.filter((u) => u.status === "reserved").length;
    const sold = units.filter((u) => u.status === "sold").length;
    return { total, available, reserved, sold };
  }, [units]);

  // Status handler in developer admin mode
  const handleStatusChange = (newStatus: "available" | "reserved" | "sold") => {
    if (!selectedUnit) return;
    const updated = units.map((u) =>
      u.id === selectedUnit.id ? { ...u, status: newStatus } : u
    );
    setUnits(updated);
    setSelectedUnit({ ...selectedUnit, status: newStatus });
    if (onUpdateUnitStatus) {
      onUpdateUnitStatus(selectedUnit.id, newStatus);
    }
  };

  const getStatusBadge = (status: "available" | "reserved" | "sold") => {
    switch (status) {
      case "available":
        return (
          <Badge variant="emerald" className="inline-flex items-center gap-1.5 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>{tDual("Свободно", "Барои фурӯш")}</span>
          </Badge>
        );
      case "reserved":
        return (
          <Badge variant="gold" className="inline-flex items-center gap-1.5 shadow-xs">
            <Clock className="w-3 h-3 text-amber-500" />
            <span>{tDual("Забронировано", "Брон")}</span>
          </Badge>
        );
      case "sold":
        return (
          <Badge variant="frostedLight" className="inline-flex items-center gap-1.5 opacity-70">
            <XCircle className="w-3 h-3 text-slate-400" />
            <span>{tDual("Продано", "Фурӯхта шудааст")}</span>
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. TAHOE GLASS HEADER & STATS TOOLBAR */}
      <div className="glass-card rounded-2xl md:rounded-3xl border border-white/60 dark:border-white/10 p-4 sm:p-5 shadow-xl backdrop-blur-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Statistics Pills with Active Filter Triggers */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* All Units */}
          <button
            type="button"
            onClick={() => setStatusFilter("all")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-semibold transition-all cursor-pointer ${
              statusFilter === "all"
                ? "bg-foreground text-background shadow-sm"
                : "bg-muted/70 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/50"
            }`}
          >
            <Home className="h-3.5 w-3.5" />
            <span>{tDual("Всего:", "Ҳамагӣ:")}</span>
            <span className="font-extrabold">{stats.total}</span>
          </button>

          {/* Available */}
          <button
            type="button"
            onClick={() => setStatusFilter(statusFilter === "available" ? "all" : "available")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-semibold transition-all cursor-pointer border ${
              statusFilter === "available"
                ? "bg-emerald-600 text-white border-emerald-500 shadow-md ring-2 ring-emerald-500/30"
                : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/25"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{tDual("Свободно:", "Озод:")}</span>
            <span className="font-extrabold">{stats.available}</span>
          </button>

          {/* Reserved */}
          <button
            type="button"
            onClick={() => setStatusFilter(statusFilter === "reserved" ? "all" : "reserved")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-semibold transition-all cursor-pointer border ${
              statusFilter === "reserved"
                ? "bg-amber-600 text-white border-amber-500 shadow-md ring-2 ring-amber-500/30"
                : "bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/25"
            }`}
          >
            <Clock className="h-3.5 w-3.5 text-amber-500" />
            <span>{tDual("Бронь:", "Брон:")}</span>
            <span className="font-extrabold">{stats.reserved}</span>
          </button>

          {/* Sold */}
          <button
            type="button"
            onClick={() => setStatusFilter(statusFilter === "sold" ? "all" : "sold")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-medium transition-all cursor-pointer border ${
              statusFilter === "sold"
                ? "bg-slate-700 text-white border-slate-600 shadow-md ring-2 ring-slate-500/30"
                : "bg-muted/60 hover:bg-muted text-muted-foreground border-border/50"
            }`}
          >
            <XCircle className="h-3.5 w-3.5 opacity-60" />
            <span>{tDual("Продано:", "Фурӯхта шуд:")}</span>
            <span className="font-extrabold">{stats.sold}</span>
          </button>
        </div>

        {/* Apple Tahoe Segmented View Mode Toggle */}
        <div className="flex items-center gap-2 self-start lg:self-auto">
          <div className="flex p-1 rounded-2xl bg-muted/60 dark:bg-black/30 backdrop-blur-md border border-border/60 shadow-inner">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === "grid"
                  ? "bg-background text-foreground shadow-sm ring-1 ring-border/50"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Grid3X3 className="h-3.5 w-3.5 text-emerald-600" />
              <span>{tDual("Шахматка (Сетка)", "Ҷадвал (Сетка)")}</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === "list"
                  ? "bg-background text-foreground shadow-sm ring-1 ring-border/50"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <ListFilter className="h-3.5 w-3.5 text-emerald-600" />
              <span>{tDual("Таблица планировок", "Рӯйхати тарҳҳо")}</span>
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-[10px]">
                {filteredUnits.length}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. TAHOE FILTER BAR (Active in both modes) */}
      <div className="glass-card rounded-2xl md:rounded-3xl border border-white/60 dark:border-white/10 p-4 sm:p-5 shadow-lg backdrop-blur-xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div>
          <label className="text-[11px] font-bold text-muted-foreground mb-1.5 block">
            {tDual("Количество комнат", "Шумораи ҳуҷраҳо")}
          </label>
          <select
            value={roomsFilter}
            onChange={(e) => setRoomsFilter(e.target.value)}
            className="w-full h-9 px-3 rounded-xl border border-border/80 bg-background/70 backdrop-blur-md text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/40 cursor-pointer shadow-2xs"
          >
            <option value="all">{tDual("Все комнаты", "Ҳамаи ҳуҷраҳо")}</option>
            <option value="1">1-{tDual("комнатные", "ҳуҷрагӣ")}</option>
            <option value="2">2-{tDual("комнатные", "ҳуҷрагӣ")}</option>
            <option value="3">3-{tDual("комнатные", "ҳуҷрагӣ")}</option>
            <option value="4">4+ {tDual("комнатные", "ҳуҷрагӣ")}</option>
          </select>
        </div>

        <div>
          <label className="text-[11px] font-bold text-muted-foreground mb-1.5 block">
            {tDual("Статус квартиры", "Ҳолати хонадон")}
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full h-9 px-3 rounded-xl border border-border/80 bg-background/70 backdrop-blur-md text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/40 cursor-pointer shadow-2xs"
          >
            <option value="all">{tDual("Все статусы", "Ҳамаи ҳолатҳо")}</option>
            <option value="available">🟢 {tDual("Свободно", "Барои фурӯш")}</option>
            <option value="reserved">🟡 {tDual("Забронировано", "Брон")}</option>
            <option value="sold">⚪ {tDual("Продано", "Фурӯхта шудааст")}</option>
          </select>
        </div>

        <div>
          <label className="text-[11px] font-bold text-muted-foreground mb-1.5 block">
            {tDual("Секция / Подъезд", "Бахш / Даромадгоҳ")}
          </label>
          <select
            value={sectionFilter}
            onChange={(e) => setSectionFilter(e.target.value)}
            className="w-full h-9 px-3 rounded-xl border border-border/80 bg-background/70 backdrop-blur-md text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/40 cursor-pointer shadow-2xs"
          >
            <option value="all">{tDual("Все секции", "Ҳамаи бахшҳо")}</option>
            {sections.map((sec) => (
              <option key={sec} value={sec}>
                {sec.replace(/Секция/gi, tDual("Секция", "Бахши"))}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[11px] font-bold text-muted-foreground mb-1.5 block">
            {tDual("Бюджет до", "Буҷет то")} ({currency === "USD" ? "$" : "сом."})
          </label>
          <Input
            type="number"
            placeholder={currency === "USD" ? "50000" : "550000"}
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="h-9 text-xs rounded-xl border-border/80 bg-background/70 backdrop-blur-md font-semibold"
          />
        </div>
      </div>

      {/* 3. VIEW MODE 1: TAHOE VISUAL CHESSBOARD GRID */}
      {viewMode === "grid" ? (
        <div className="glass-card rounded-2xl md:rounded-3xl border border-white/60 dark:border-white/10 p-4 sm:p-6 overflow-x-auto shadow-xl backdrop-blur-2xl">
          <div
            className="space-y-4"
            style={{ minWidth: `${Math.max(780, sections.length * 210 + 90)}px` }}
          >
            {/* Sections Header Bar */}
            <div className="grid grid-cols-[90px_1fr] items-center gap-3 pb-3 border-b border-border/70">
              <div className="text-[11px] font-black uppercase tracking-wider text-muted-foreground text-center">
                {tDual("ЭТАЖ", "ОШЁНА")}
              </div>
              <div
                className="grid gap-4 text-center font-bold text-xs uppercase tracking-wider text-foreground"
                style={{ gridTemplateColumns: `repeat(${Math.max(sections.length, 1)}, minmax(180px, 1fr))` }}
              >
                {sections.map((sec) => (
                  <div
                    key={sec}
                    className="glass-card py-2 px-3 rounded-xl border border-white/50 dark:border-white/10 bg-muted/40 shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <Layers className="h-3.5 w-3.5 text-emerald-600" />
                    <span>{sec.replace(/Секция/gi, tDual("Секция", "Бахши"))}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Floor Rows */}
            <div className="space-y-2.5">
              {floors.map((floor) => (
                <div
                  key={floor}
                  className="grid grid-cols-[90px_1fr] items-center gap-3 group"
                >
                  {/* Floor Label (Elevator indicator style) */}
                  <div className="h-full min-h-[62px] flex flex-col items-center justify-center rounded-xl border border-border/60 bg-muted/30 group-hover:bg-muted/70 group-hover:border-emerald-500/40 transition-all text-xs font-extrabold text-foreground shadow-2xs">
                    <span className="text-sm font-black">{floor}</span>
                    <span className="text-[10px] font-normal text-muted-foreground">
                      {tDual("этаж", "ошёна")}
                    </span>
                  </div>

                  {/* Units in Sections */}
                  <div
                    className="grid gap-4"
                    style={{ gridTemplateColumns: `repeat(${Math.max(sections.length, 1)}, minmax(180px, 1fr))` }}
                  >
                    {sections.map((sec) => {
                      const sectionUnits = units.filter(
                        (u) => u.floor === floor && u.section === sec
                      );

                      return (
                        <div
                          key={sec}
                          className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-muted/15 dark:bg-black/20 border border-border/40"
                        >
                          {sectionUnits.map((unit) => {
                            const isMatch = filteredUnits.some((fu) => fu.id === unit.id);
                            const isSold = unit.status === "sold";
                            const isReserved = unit.status === "reserved";
                            const isAvailable = unit.status === "available";

                            // Tahoe Glass dynamic styling per status
                            let cellStyle =
                              "bg-gradient-to-br from-white/95 via-emerald-500/10 to-white/80 dark:from-slate-900/90 dark:via-emerald-950/25 dark:to-slate-900/70 border-emerald-500/30 text-emerald-900 dark:text-emerald-300 hover:border-emerald-500 hover:shadow-[0_0_16px_rgba(16,185,129,0.35)] hover:-translate-y-0.5 hover:scale-[1.03]";
                            if (isReserved) {
                              cellStyle =
                                "bg-gradient-to-br from-white/95 via-amber-500/10 to-white/80 dark:from-slate-900/90 dark:via-amber-950/25 dark:to-slate-900/70 border-amber-500/35 text-amber-900 dark:text-amber-300 hover:border-amber-500 hover:shadow-[0_0_16px_rgba(245,158,11,0.3)] hover:-translate-y-0.5 hover:scale-[1.03]";
                            } else if (isSold) {
                              cellStyle =
                                "bg-muted/40 text-muted-foreground/50 border-transparent opacity-45 hover:opacity-75 grayscale-[0.5] hover:grayscale-0";
                            }

                            if (!isMatch) {
                              cellStyle += " opacity-20 hover:opacity-60";
                            }

                            return (
                              <button
                                key={unit.id}
                                type="button"
                                onClick={() => {
                                  setSelectedUnit(unit);
                                  if (onSelectUnitForDeal && unit.status === "available") {
                                    onSelectUnitForDeal(unit);
                                  }
                                }}
                                className={`h-15 p-2 rounded-xl border text-left flex flex-col justify-between transition-all duration-200 cursor-pointer shadow-xs ${cellStyle}`}
                              >
                                <div className="flex items-center justify-between w-full">
                                  <span className="font-black text-xs leading-none">
                                    {unit.roomsCount}{language === "tg" ? "ҳ" : "к"}
                                  </span>
                                  <span className="text-[10px] font-semibold opacity-85">
                                    {unit.totalArea}м²
                                  </span>
                                </div>
                                <div className="text-[10.5px] font-bold truncate leading-tight mt-1">
                                  {isSold
                                    ? tDual("Продано", "Фурӯхта шуд")
                                    : isReserved
                                    ? tDual("Бронь", "Брон")
                                    : formatPrice(unit.priceTjs, unit.priceUsd)}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* 4. VIEW MODE 2: TAHOE UNIT DATA TABLE (PrimeReact Architecture) */
        <UnitDataTable
          units={filteredUnits}
          projectName={projectName}
          onSelectUnit={(unit) => setSelectedUnit(unit)}
          onSelectUnitForDeal={onSelectUnitForDeal}
          isEditable={isEditable}
        />
      )}

      {/* 5. TAHOE UNIT DETAILS & BOOKING / INSTALLMENT CALCULATOR MODAL */}
      <Dialog
        open={!!selectedUnit}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedUnit(null);
            setIsPlanZoomed(false);
          }
        }}
      >
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/60 dark:border-white/10 backdrop-blur-2xl shadow-2xl p-6">
          {selectedUnit && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between pr-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <DialogTitle className="text-xl font-black">
                        {tDual("Квартира", "Хонадони")} №{selectedUnit.unitNumber.replace(/^(?:№|Кв\.\s*)/i, "").trim()}
                      </DialogTitle>
                      <Badge variant="frosted" className="font-bold">
                        {selectedUnit.roomsCount}-{tDual("комнатная", "ҳуҷрагӣ")}
                      </Badge>
                      {getStatusBadge(selectedUnit.status)}
                    </div>
                    <DialogDescription className="text-xs text-muted-foreground">
                      {selectedUnit.section.replace(/Секция/gi, tDual("Секция", "Бахши"))}, {selectedUnit.floor} {language === "tg" ? "ошёна" : "этаж"} • {projectName}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4 pt-2">
                {/* Layout Plan Preview with Zoom Lightbox Toggle */}
                {selectedUnit.layoutPlanUrl && (
                  <div className="relative rounded-2xl overflow-hidden border border-border/80 bg-muted/40 group">
                    <img
                      src={selectedUnit.layoutPlanUrl}
                      alt={tDual("План планировки квартиры", "Нақшаи тарҳи хонадон")}
                      className={`w-full object-cover transition-all duration-300 ${
                        isPlanZoomed ? "h-96 object-contain bg-background" : "h-52"
                      }`}
                    />
                    <div className="absolute top-2.5 right-2.5">
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={() => setIsPlanZoomed(!isPlanZoomed)}
                        className="h-8 px-2.5 rounded-xl bg-background/80 hover:bg-background backdrop-blur-md text-xs font-semibold shadow-xs cursor-pointer"
                      >
                        <Maximize2 className="h-3.5 w-3.5 mr-1" />
                        {isPlanZoomed ? tDual("Свернуть", "Хурд кардан") : tDual("Увеличить", "Калон кардан")}
                      </Button>
                    </div>

                    <div className="absolute bottom-2.5 left-2.5 bg-background/90 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-bold border border-border/60 shadow-xs flex items-center gap-1.5">
                      <Compass className="h-3.5 w-3.5 text-emerald-600" />
                      <span>{selectedUnit.totalArea} м²</span>
                      <span>•</span>
                      <span>{selectedUnit.windowView || tDual("Панорамный вид", "Манзараи панорамӣ")}</span>
                    </div>
                  </div>
                )}

                {/* Specs Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs bg-muted/30 p-3.5 rounded-2xl border border-border/60">
                  <div className="p-2 rounded-xl bg-background/60">
                    <span className="text-muted-foreground block text-[11px] font-medium">{tDual("Общая площадь:", "Масоҳати умумӣ:")}</span>
                    <span className="font-extrabold text-foreground text-sm">{selectedUnit.totalArea} м²</span>
                  </div>
                  <div className="p-2 rounded-xl bg-background/60">
                    <span className="text-muted-foreground block text-[11px] font-medium">{tDual("Жилая площадь:", "Масоҳати истиқоматӣ:")}</span>
                    <span className="font-extrabold text-foreground text-sm">
                      {selectedUnit.livingArea || Math.round(selectedUnit.totalArea * 0.65)} м²
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-background/60">
                    <span className="text-muted-foreground block text-[11px] font-medium">{tDual("Кухня:", "Ошхона:")}</span>
                    <span className="font-extrabold text-foreground text-sm">
                      {selectedUnit.kitchenArea || Math.round(selectedUnit.totalArea * 0.18)} м²
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-background/60">
                    <span className="text-muted-foreground block text-[11px] font-medium">{tDual("Отделка:", "Пардоз:")}</span>
                    <span className="font-bold text-foreground">{tDual("Черновая (коробка)", "Аввалия (қуттӣ)")}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-background/60">
                    <span className="text-muted-foreground block text-[11px] font-medium">{tDual("Балкон / Лоджия:", "Балкон / Айвон:")}</span>
                    <span className="font-bold text-foreground">
                      {selectedUnit.hasTerrace
                        ? tDual("Терраса + Балкон", "Айвони кушод + Балкон")
                        : tDual("Утепленная лоджия", "Айвони гармкардашуда")}
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-background/60">
                    <span className="text-muted-foreground block text-[11px] font-medium">{tDual("Потолки:", "Баландии шифт:")}</span>
                    <span className="font-bold text-foreground">3.20 м</span>
                  </div>
                </div>

                {/* Price block */}
                {(() => {
                  const unitPricePerMeter = formatNewBuildingPricePerMeter({
                    pricePerMeterTjs: selectedUnit.pricePerMeterTjs,
                    pricePerMeterUsd: selectedUnit.pricePerMeterUsd,
                    totalPriceTjs: selectedUnit.priceTjs,
                    totalPriceUsd: selectedUnit.priceUsd,
                    areaSqm: selectedUnit.totalArea,
                    currency,
                    language,
                  });

                  return (
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[11px] text-emerald-800 dark:text-emerald-300 block font-bold">
                            {tDual("Стоимость квартиры:", "Арзиши хонадон:")}
                          </span>
                          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
                            {formatPrice(selectedUnit.priceTjs, selectedUnit.priceUsd)}
                          </div>
                        </div>
                        <Badge variant="emerald" className="self-start">
                          {tDual("Рассрочка 0% до 60 мес", "Пардохти қисм-қисм то 60 моҳ")}
                        </Badge>
                      </div>
                      {unitPricePerMeter && (
                        <div className="flex items-center justify-between gap-3 pt-2 border-t border-emerald-500/20 text-xs">
                          <span className="text-emerald-900/80 dark:text-emerald-200 font-medium">
                            {getPricePerMeterLabel(language)}
                          </span>
                          <span className="font-bold text-emerald-950 dark:text-emerald-100 tabular-nums">
                            {unitPricePerMeter}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* INTERACTIVE DEVELOPER INSTALLMENT CALCULATOR */}
                {selectedUnit.status !== "sold" && (
                  <div className="glass-card rounded-2xl p-4 border border-white/60 dark:border-white/10 bg-muted/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        <Calculator className="h-4 w-4 text-emerald-600" />
                        {tDual("Калькулятор рассрочки от застройщика:", "Ҳисобкунаки пардохти қисм-қисм:")}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        {tDual("0% переплат", "0% фоиз")}
                      </span>
                    </div>

                    {/* Down payment selector pills */}
                    <div>
                      <label className="text-[11px] text-muted-foreground block mb-1">
                        {tDual("Первоначальный взнос:", "Пардохти аввалия:")}
                      </label>
                      <div className="flex gap-2">
                        {[30, 40, 50].map((pct) => (
                          <button
                            key={pct}
                            type="button"
                            onClick={() => setDownPaymentPercent(pct)}
                            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              downPaymentPercent === pct
                                ? "bg-emerald-600 text-white shadow-xs"
                                : "bg-muted hover:bg-muted/80 text-foreground/80 border border-border/50"
                            }`}
                          >
                            {pct}%
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Months selector pills */}
                    <div>
                      <label className="text-[11px] text-muted-foreground block mb-1">
                        {tDual("Срок рассрочки:", "Муҳлати пардохт:")}
                      </label>
                      <div className="grid grid-cols-5 gap-1.5">
                        {[12, 24, 36, 48, 60].map((m) => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => setInstallmentMonths(m)}
                            className={`py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                              installmentMonths === m
                                ? "bg-emerald-600 text-white shadow-xs"
                                : "bg-muted hover:bg-muted/80 text-foreground/80 border border-border/50"
                            }`}
                          >
                            {m} {language === "tg" ? "м." : "мес"}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Live installment calculation numbers */}
                    {(() => {
                      const total = currency === "USD" ? selectedUnit.priceUsd : selectedUnit.priceTjs;
                      const initialPayment = Math.round(total * (downPaymentPercent / 100));
                      const remaining = total - initialPayment;
                      const monthlyPayment = Math.round(remaining / installmentMonths);

                      return (
                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/60 text-xs">
                          <div className="p-2 rounded-xl bg-background/70 border border-border/40">
                            <span className="text-[10px] text-muted-foreground block">
                              {tDual("Первый взнос", "Пардохти аввал")} ({downPaymentPercent}%):
                            </span>
                            <span className="font-extrabold text-foreground">
                              {currency === "USD"
                                ? `$${initialPayment.toLocaleString()}`
                                : `${initialPayment.toLocaleString()} сом.`}
                            </span>
                          </div>
                          <div className="p-2 rounded-xl bg-background/70 border border-emerald-500/30">
                            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 block font-semibold">
                              {tDual("Ежемесячно", "Ҳар моҳ")} ({installmentMonths} {language === "tg" ? "моҳ" : "мес"}):
                            </span>
                            <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                              {currency === "USD"
                                ? `$${monthlyPayment.toLocaleString()}`
                                : `${monthlyPayment.toLocaleString()} сом.`}
                            </span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* DEVELOPER BACKOFFICE CONTROLS: QUICK STATUS CHANGE */}
                {isEditable ? (
                  <div className="pt-2 border-t border-border/60 space-y-2">
                    <span className="text-xs font-bold text-foreground block">
                      {tDual("Управление статусом (Кабинет застройщика):", "Идоракунии ҳолат (Кабинети сохтмончӣ):")}
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        size="sm"
                        variant={selectedUnit.status === "available" ? "default" : "outline"}
                        className={
                          selectedUnit.status === "available"
                            ? "bg-emerald-600 text-white hover:bg-emerald-700"
                            : "border-emerald-500/30 text-emerald-700"
                        }
                        onClick={() => handleStatusChange("available")}
                      >
                        <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                        {tDual("Свободно", "Озод")}
                      </Button>
                      <Button
                        size="sm"
                        variant={selectedUnit.status === "reserved" ? "default" : "outline"}
                        className={
                          selectedUnit.status === "reserved"
                            ? "bg-amber-600 text-white hover:bg-amber-700"
                            : "border-amber-500/30 text-amber-700"
                        }
                        onClick={() => handleStatusChange("reserved")}
                      >
                        <Clock className="mr-1.5 h-3.5 w-3.5" />
                        {tDual("Бронь", "Брон")}
                      </Button>
                      <Button
                        size="sm"
                        variant={selectedUnit.status === "sold" ? "default" : "outline"}
                        className={
                          selectedUnit.status === "sold"
                            ? "bg-slate-700 text-white hover:bg-slate-800"
                            : "border-slate-400/30 text-slate-600"
                        }
                        onClick={() => handleStatusChange("sold")}
                      >
                        <XCircle className="mr-1.5 h-3.5 w-3.5" />
                        {tDual("Продано", "Фурӯхта шуд")}
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* PUBLIC BUYER ACTIONS: DIRECT BOOKING & CONTACT */
                  <div className="pt-2 border-t border-border/60 flex flex-col gap-2">
                    {selectedUnit.status === "sold" ? (
                      <div className="w-full text-center py-3 text-xs text-muted-foreground bg-muted/60 rounded-xl font-medium">
                        {tDual(
                          "Данная квартира уже продана. Выберите другую свободную планировку на шахматке.",
                          "Ин хонадон аллакай фурӯхта шудааст. Нақшаи дигари озодро дар ҷадвал интихоб намоед."
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2 w-full">
                        {onSelectUnitForDeal && selectedUnit.status === "available" && (
                          <Button
                            type="button"
                            onClick={() => {
                              onSelectUnitForDeal(selectedUnit);
                              setSelectedUnit(null);
                            }}
                            className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md gap-2 cursor-pointer transition-all"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            <span>{tDual("Выбрать эту квартиру для заявки", "Интихоби ин хонадон барои дархост")}</span>
                          </Button>
                        )}
                        <div className="flex flex-col sm:flex-row gap-2">
                          <a
                            href={`https://wa.me/${developerContact.whatsapp.replace(
                              /\D/g,
                              ""
                            )}?text=${encodeURIComponent(
                              language === "tg"
                                ? `Салом! Ба ман хонадони ${selectedUnit.unitNumber} (${selectedUnit.roomsCount}-ҳуҷрагӣ, ${selectedUnit.totalArea} м², ошёнаи ${selectedUnit.floor}-ум) дар МИ «${projectName}» писанд омад. Шартҳои харидро бигӯед?`
                                : `Здравствуйте! Интересует квартира ${selectedUnit.unitNumber} (${selectedUnit.roomsCount}-комн., ${selectedUnit.totalArea} м², этаж ${selectedUnit.floor}) в ЖК «${projectName}». Подскажите условия бронирования?`
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1 inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
                          >
                            <MessageCircle className="h-4 w-4" />
                            {tDual("Забронировать через WhatsApp", "Брон кардан бо WhatsApp")}
                          </a>
                          <a
                            href={`tel:${developerContact.phone}`}
                            className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl border border-border/80 font-semibold text-xs hover:bg-muted transition-colors cursor-pointer"
                          >
                            <Phone className="h-4 w-4" />
                            {tDual("Позвонить в офис", "Занг ба дафтар")}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
