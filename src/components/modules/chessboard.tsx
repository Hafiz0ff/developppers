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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
} from "lucide-react";

interface ChessboardProps {
  units: UnitData[];
  onUpdateUnitStatus?: (unitId: string, newStatus: "available" | "reserved" | "sold") => void;
  isEditable?: boolean;
  developerContact?: {
    phone: string;
    whatsapp: string;
  };
}

export function Chessboard({
  units: initialUnits,
  onUpdateUnitStatus,
  isEditable = false,
  developerContact = {
    phone: "+992 92 700 5555",
    whatsapp: "+992927005555",
  },
}: ChessboardProps) {
  const { formatPrice, currency } = useCurrency();
  const [units, setUnits] = useState<UnitData[]>(initialUnits);
  const [selectedUnit, setSelectedUnit] = useState<UnitData | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

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

  // Filtered units for list mode and stats
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
          <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
            Свободно
          </Badge>
        );
      case "reserved":
        return (
          <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
            Забронировано
          </Badge>
        );
      case "sold":
        return (
          <Badge className="bg-slate-500/15 text-slate-600 dark:text-slate-400 border border-slate-400/30">
            Продано
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER & CONTROLS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-card border rounded-xl p-4 shadow-xs">
        {/* Statistics Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted font-medium">
            <Home className="h-3.5 w-3.5 text-muted-foreground" />
            Всего: <span className="font-bold">{stats.total}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-semibold border border-emerald-500/20">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            Свободно: <span>{stats.available}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 font-semibold border border-amber-500/20">
            <Clock className="h-3.5 w-3.5 text-amber-600" />
            Бронь: <span>{stats.reserved}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted text-muted-foreground font-medium">
            <XCircle className="h-3.5 w-3.5" />
            Продано: <span>{stats.sold}</span>
          </div>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-2">
          <div className="flex border rounded-lg p-0.5 bg-muted/60 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                viewMode === "grid"
                  ? "bg-background text-foreground shadow-xs font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Grid3X3 className="h-3.5 w-3.5" />
              Шахматка (Сетка)
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                viewMode === "list"
                  ? "bg-background text-foreground shadow-xs font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <ListFilter className="h-3.5 w-3.5" />
              Список и фильтры ({filteredUnits.length})
            </button>
          </div>
        </div>
      </div>

      {/* FILTER BAR (Active in both modes) */}
      <div className="bg-card border rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div>
          <label className="text-[11px] font-semibold text-muted-foreground mb-1 block">
            Количество комнат
          </label>
          <Select
            value={roomsFilter}
            onValueChange={(val) => {
              if (val) setRoomsFilter(val);
            }}
          >
            <SelectTrigger className="w-full h-8 text-xs">
              <SelectValue placeholder="Любая комнатность" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все комнаты</SelectItem>
              <SelectItem value="1">1-комнатные</SelectItem>
              <SelectItem value="2">2-комнатные</SelectItem>
              <SelectItem value="3">3-комнатные</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-[11px] font-semibold text-muted-foreground mb-1 block">
            Статус квартиры
          </label>
          <Select
            value={statusFilter}
            onValueChange={(val) => {
              if (val) setStatusFilter(val);
            }}
          >
            <SelectTrigger className="w-full h-8 text-xs">
              <SelectValue placeholder="Все статусы" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все статусы</SelectItem>
              <SelectItem value="available">🟢 Свободно</SelectItem>
              <SelectItem value="reserved">🟡 Забронировано</SelectItem>
              <SelectItem value="sold">⚪ Продано</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-[11px] font-semibold text-muted-foreground mb-1 block">
            Секция / Подъезд
          </label>
          <Select
            value={sectionFilter}
            onValueChange={(val) => {
              if (val) setSectionFilter(val);
            }}
          >
            <SelectTrigger className="w-full h-8 text-xs">
              <SelectValue placeholder="Все секции" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все секции</SelectItem>
              {sections.map((sec) => (
                <SelectItem key={sec} value={sec}>
                  {sec}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-[11px] font-semibold text-muted-foreground mb-1 block">
            Бюджет до ({currency === "USD" ? "$" : "сом."})
          </label>
          <Input
            type="number"
            placeholder={currency === "USD" ? "напр. 50000" : "напр. 550000"}
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="h-8 text-xs"
          />
        </div>
      </div>

      {/* VIEW MODE 1: VISUAL GRID CHESSBOARD */}
      {viewMode === "grid" ? (
        <div className="bg-card border rounded-2xl p-4 sm:p-6 overflow-x-auto shadow-sm">
          <div className="min-w-[760px] space-y-4">
            {/* Sections Header */}
            <div className="grid grid-cols-[80px_1fr] items-center gap-3 pb-3 border-b">
              <div className="text-xs font-bold text-muted-foreground text-center">
                ЭТАЖ
              </div>
              <div className="grid grid-cols-3 gap-4 text-center font-bold text-xs uppercase tracking-wider text-foreground">
                {sections.map((sec) => (
                  <div key={sec} className="bg-muted/70 py-1.5 rounded-lg border">
                    {sec}
                  </div>
                ))}
              </div>
            </div>

            {/* Floor Rows */}
            <div className="space-y-2">
              {floors.map((floor) => (
                <div
                  key={floor}
                  className="grid grid-cols-[80px_1fr] items-center gap-3 group"
                >
                  {/* Floor Label */}
                  <div className="h-full min-h-[58px] flex flex-col items-center justify-center bg-muted/40 rounded-lg border text-xs font-bold text-muted-foreground group-hover:text-foreground group-hover:bg-muted transition-colors">
                    <span>{floor}</span>
                    <span className="text-[10px] font-normal text-muted-foreground">
                      этаж
                    </span>
                  </div>

                  {/* Units in Sections */}
                  <div className="grid grid-cols-3 gap-4">
                    {sections.map((sec) => {
                      const sectionUnits = units.filter(
                        (u) => u.floor === floor && u.section === sec
                      );

                      return (
                        <div
                          key={sec}
                          className="grid grid-cols-3 gap-1.5 bg-muted/20 p-1 rounded-xl border border-dashed border-border/60"
                        >
                          {sectionUnits.map((unit) => {
                            const isMatch = filteredUnits.some((fu) => fu.id === unit.id);
                            const isSold = unit.status === "sold";
                            const isReserved = unit.status === "reserved";
                            const isAvailable = unit.status === "available";

                            // Color styling based on DESIGN.md
                            let style =
                              "bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20 hover:border-emerald-500";
                            if (isReserved) {
                              style =
                                "bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/40 hover:bg-amber-500/25 hover:border-amber-500";
                            } else if (isSold) {
                              style =
                                "bg-muted/60 text-muted-foreground/60 border-transparent opacity-60 hover:opacity-90";
                            }

                            if (!isMatch) {
                              style += " opacity-20 hover:opacity-60";
                            }

                            return (
                              <button
                                key={unit.id}
                                type="button"
                                onClick={() => setSelectedUnit(unit)}
                                className={`h-14 p-1 rounded-lg border text-left flex flex-col justify-between transition-all cursor-pointer shadow-2xs ${style}`}
                              >
                                <div className="flex items-center justify-between w-full">
                                  <span className="font-extrabold text-[11px] leading-tight">
                                    {unit.roomsCount}к
                                  </span>
                                  <span className="text-[10px] opacity-80">
                                    {unit.totalArea}м²
                                  </span>
                                </div>
                                <div className="text-[10px] font-semibold truncate leading-tight">
                                  {isSold
                                    ? "Продано"
                                    : isReserved
                                    ? "Бронь"
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
        /* VIEW MODE 2: FILTERABLE TABLE LIST */
        <div className="bg-card border rounded-2xl overflow-hidden shadow-xs">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[100px]">Квартира</TableHead>
                <TableHead>Секция</TableHead>
                <TableHead>Этаж</TableHead>
                <TableHead>Комнаты</TableHead>
                <TableHead>Площадь</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Цена за м²</TableHead>
                <TableHead className="text-right">Общая стоимость</TableHead>
                <TableHead className="w-[100px] text-center">Действие</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUnits.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-32 text-center text-muted-foreground">
                    По выбранным параметрам квартир не найдено. Попробуйте изменить фильтры.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUnits.map((unit) => (
                  <TableRow
                    key={unit.id}
                    className="cursor-pointer hover:bg-muted/40 transition-colors"
                    onClick={() => setSelectedUnit(unit)}
                  >
                    <TableCell className="font-bold text-foreground">
                      {unit.unitNumber}
                    </TableCell>
                    <TableCell>{unit.section}</TableCell>
                    <TableCell>{unit.floor} этаж</TableCell>
                    <TableCell className="font-medium">{unit.roomsCount}-комн.</TableCell>
                    <TableCell>{unit.totalArea} м²</TableCell>
                    <TableCell>{getStatusBadge(unit.status)}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatPrice(unit.pricePerMeterTjs, unit.pricePerMeterUsd)}/м²
                    </TableCell>
                    <TableCell className="text-right font-extrabold text-emerald-600">
                      {formatPrice(unit.priceTjs, unit.priceUsd)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button size="sm" variant="outline" className="h-7 text-xs">
                        Детали
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* UNIT DETAILS & BOOKING / STATUS CHANGE MODAL */}
      <Dialog open={!!selectedUnit} onOpenChange={(open) => !open && setSelectedUnit(null)}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          {selectedUnit && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between pr-4">
                  <div>
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                      {selectedUnit.unitNumber} — {selectedUnit.roomsCount}-комнатная
                      {getStatusBadge(selectedUnit.status)}
                    </DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                      {selectedUnit.section}, {selectedUnit.floor} этаж • ЖК «Сирдарё Плаза»
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4 pt-2">
                {/* Layout plan preview */}
                {selectedUnit.layoutPlanUrl && (
                  <div className="relative h-48 w-full rounded-xl overflow-hidden border bg-muted/40">
                    <img
                      src={selectedUnit.layoutPlanUrl}
                      alt="План планировки квартиры"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 bg-background/90 backdrop-blur-md px-2 py-0.5 rounded text-[11px] font-semibold">
                      {selectedUnit.totalArea} м² • {selectedUnit.windowView || "Панорамный вид"}
                    </div>
                  </div>
                )}

                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs bg-muted/40 p-3 rounded-xl border">
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Общая площадь:</span>
                    <span className="font-bold text-foreground">{selectedUnit.totalArea} м²</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Жилая площадь:</span>
                    <span className="font-bold text-foreground">
                      {selectedUnit.livingArea || Math.round(selectedUnit.totalArea * 0.65)} м²
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Кухня:</span>
                    <span className="font-bold text-foreground">
                      {selectedUnit.kitchenArea || Math.round(selectedUnit.totalArea * 0.18)} м²
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Отделка:</span>
                    <span className="font-bold text-foreground">Черновая (коробка)</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Балкон / Лоджия:</span>
                    <span className="font-bold text-foreground">
                      {selectedUnit.hasTerrace ? "Терраса + Балкон" : "Утепленная лоджия"}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Окна:</span>
                    <span className="font-bold text-foreground">
                      {selectedUnit.windowView || "Вид на Сырдарью"}
                    </span>
                  </div>
                </div>

                {/* Price block */}
                <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-emerald-700 dark:text-emerald-400 block font-semibold">
                      Стоимость квартиры:
                    </span>
                    <div className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-300">
                      {formatPrice(selectedUnit.priceTjs, selectedUnit.priceUsd)}
                    </div>
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    <div>{formatPrice(selectedUnit.pricePerMeterTjs, selectedUnit.pricePerMeterUsd)} / м²</div>
                    <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                      Рассрочка от 0% до 24 мес
                    </div>
                  </div>
                </div>

                {/* DEVELOPER BACKOFFICE CONTROLS: QUICK STATUS CHANGE */}
                {isEditable ? (
                  <div className="pt-2 border-t space-y-2">
                    <span className="text-xs font-bold text-foreground block">
                      Управление статусом (Кабинет застройщика):
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
                        Свободно
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
                        Бронь
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
                        Продано
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* PUBLIC BUYER ACTIONS: BOOKING & CONTACT */
                  <div className="pt-2 border-t flex flex-col sm:flex-row gap-2">
                    {selectedUnit.status === "sold" ? (
                      <div className="w-full text-center py-2 text-xs text-muted-foreground bg-muted rounded-lg font-medium">
                        Данная квартира уже продана. Выберите другую свободную планировку на шахматке.
                      </div>
                    ) : (
                      <>
                        <a
                          href={`https://wa.me/${developerContact.whatsapp.replace(
                            /\D/g,
                            ""
                          )}?text=${encodeURIComponent(
                            `Здравствуйте! Интересует квартира ${selectedUnit.unitNumber} (${selectedUnit.roomsCount}-комн., ${selectedUnit.totalArea} м², этаж ${selectedUnit.floor}) в ЖК «Сирдарё Плаза». Подскажите условия бронирования?`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-colors"
                        >
                          <MessageCircle className="h-4 w-4" />
                          Забронировать через WhatsApp
                        </a>
                        <a
                          href={`tel:${developerContact.phone}`}
                          className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg border font-semibold text-xs hover:bg-muted transition-colors"
                        >
                          <Phone className="h-4 w-4" />
                          Позвонить в офис
                        </a>
                      </>
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
