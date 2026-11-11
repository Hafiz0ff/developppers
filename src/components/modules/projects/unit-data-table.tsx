"use client";

import React, { useState, useMemo } from "react";
import { UnitData } from "@/lib/data/mock-db";
import { useCurrency } from "@/context/currency-context";
import { useLanguage } from "@/context/language-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  Maximize2,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  ChevronLeft,
  ChevronRight,
  Filter,
  Sparkles,
  Layers,
  Building,
} from "lucide-react";
import { formatNewBuildingPricePerMeter } from "@/lib/pricing/new-building-price";

export interface UnitDataTableProps {
  units: UnitData[];
  projectName?: string;
  onSelectUnit: (unit: UnitData) => void;
  onSelectUnitForDeal?: (unit: UnitData) => void;
  isEditable?: boolean;
}

type SortField = "unitNumber" | "floor" | "roomsCount" | "totalArea" | "pricePerMeter" | "totalPrice";

export function UnitDataTable({
  units,
  projectName = "Жилой комплекс",
  onSelectUnit,
  onSelectUnitForDeal,
  isEditable = false,
}: UnitDataTableProps) {
  const { formatPrice, currency } = useCurrency();
  const { language, tDual } = useLanguage();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [roomFilter, setRoomFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField | null>("floor");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Quick room chip filter options
  const roomChips = [
    { id: "all", label: tDual("Все", "Ҳама") },
    { id: "1", label: `1-${tDual("комн.", "ҳуҷр.")}` },
    { id: "2", label: `2-${tDual("комн.", "ҳуҷр.")}` },
    { id: "3", label: `3-${tDual("комн.", "ҳуҷр.")}` },
    { id: "4", label: `4+ ${tDual("комн.", "ҳуҷр.")}` },
  ];

  // Quick status chip filter options
  const statusChips = [
    { id: "all", label: tDual("Все статусы", "Ҳамаи ҳолатҳо") },
    { id: "available", label: tDual("Свободные", "Озод") },
    { id: "reserved", label: tDual("Бронь", "Брон") },
    { id: "sold", label: tDual("Продано", "Фурӯхта шуда") },
  ];

  // Filtering
  const filteredUnits = useMemo(() => {
    return units.filter((u) => {
      // Room filter
      if (roomFilter !== "all") {
        const count = parseInt(roomFilter, 10);
        if (count === 4) {
          if (u.roomsCount < 4) return false;
        } else {
          if (u.roomsCount !== count) return false;
        }
      }

      // Status filter
      if (statusFilter !== "all" && u.status !== statusFilter) {
        return false;
      }

      // Search term (unit number, section, floor, window view)
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase().trim();
        const matchesUnit = u.unitNumber.toLowerCase().includes(term);
        const matchesSection = u.section.toLowerCase().includes(term);
        const matchesFloor = `${u.floor}`.includes(term);
        const matchesView = u.windowView?.toLowerCase().includes(term);
        if (!matchesUnit && !matchesSection && !matchesFloor && !matchesView) {
          return false;
        }
      }

      return true;
    });
  }, [units, roomFilter, statusFilter, searchTerm]);

  // Sorting
  const sortedUnits = useMemo(() => {
    if (!sortField) return filteredUnits;

    return [...filteredUnits].sort((a, b) => {
      let aVal: number | string = 0;
      let bVal: number | string = 0;

      switch (sortField) {
        case "unitNumber":
          aVal = parseInt(a.unitNumber.replace(/\D/g, ""), 10) || 0;
          bVal = parseInt(b.unitNumber.replace(/\D/g, ""), 10) || 0;
          break;
        case "floor":
          aVal = a.floor;
          bVal = b.floor;
          break;
        case "roomsCount":
          aVal = a.roomsCount;
          bVal = b.roomsCount;
          break;
        case "totalArea":
          aVal = a.totalArea;
          bVal = b.totalArea;
          break;
        case "pricePerMeter":
          aVal = currency === "USD" ? a.pricePerMeterUsd : a.pricePerMeterTjs;
          bVal = currency === "USD" ? b.pricePerMeterUsd : b.pricePerMeterTjs;
          break;
        case "totalPrice":
          aVal = currency === "USD" ? a.priceUsd : a.priceTjs;
          bVal = currency === "USD" ? b.priceUsd : b.priceTjs;
          break;
      }

      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredUnits, sortField, sortDirection, currency]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(sortedUnits.length / pageSize));
  const currentPageSafe = Math.min(currentPage, totalPages);
  const startIndex = (currentPageSafe - 1) * pageSize;
  const paginatedUnits = sortedUnits.slice(startIndex, startIndex + pageSize);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else {
        setSortField(null);
      }
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-3.5 w-3.5 opacity-40 hover:opacity-100 transition-opacity" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 font-bold" />
    ) : (
      <ArrowDown className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 font-bold" />
    );
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
            <span>{tDual("Бронь", "Брон")}</span>
          </Badge>
        );
      case "sold":
        return (
          <Badge variant="frostedLight" className="inline-flex items-center gap-1.5 opacity-70">
            <XCircle className="w-3 h-3 text-slate-400" />
            <span>{tDual("Продано", "Фурӯхта шуд")}</span>
          </Badge>
        );
    }
  };

  return (
    <div className="w-full glass-card rounded-2xl md:rounded-3xl border border-white/60 dark:border-white/10 shadow-xl overflow-hidden backdrop-blur-2xl">
      {/* TOOLBAR CONTROLS (TAHOE CHIPS & SEARCH) */}
      <div className="p-4 sm:p-5 border-b border-border/60 bg-muted/20 space-y-4">
        {/* Top line: Search and counts */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={tDual(
                "Поиск по номеру кв., секции, этажу...",
                "Ҷустуҷӯ аз рӯи рақами хона, бахш, ошёна..."
              )}
              className="w-full h-10 pl-10 pr-4 text-xs font-medium rounded-xl border border-border/80 bg-background/60 backdrop-blur-md placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all shadow-2xs"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground self-end sm:self-auto">
            <span>
              {tDual("Найдено квартир:", "Хонадонҳои ёфтшуда:")}{" "}
              <strong className="text-foreground font-bold">{sortedUnits.length}</strong>
            </span>
          </div>
        </div>

        {/* Filter Chips Bar (Room count & Status) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {/* Room count chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-muted-foreground mr-1 flex items-center gap-1">
              <Building className="h-3.5 w-3.5" />
              {tDual("Комнаты:", "Ҳуҷраҳо:")}
            </span>
            {roomChips.map((chip) => {
              const isActive = roomFilter === chip.id;
              return (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => {
                    setRoomFilter(chip.id);
                    setCurrentPage(1);
                  }}
                  className={`h-7 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-muted/70 hover:bg-muted text-foreground/80 hover:text-foreground border border-border/50"
                  }`}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>

          {/* Status chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-muted-foreground mr-1 flex items-center gap-1">
              <Filter className="h-3.5 w-3.5" />
              {tDual("Статус:", "Ҳолат:")}
            </span>
            {statusChips.map((chip) => {
              const isActive = statusFilter === chip.id;
              return (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => {
                    setStatusFilter(chip.id);
                    setCurrentPage(1);
                  }}
                  className={`h-7 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-muted/70 hover:bg-muted text-foreground/80 hover:text-foreground border border-border/50"
                  }`}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* TABLE VIEW WITH INTERACTIVE SORTABLE HEADERS */}
      <div className="overflow-x-auto [scrollbar-width:thin]">
        <table className="w-full text-left text-xs min-w-[840px]">
          <thead className="bg-muted/40 backdrop-blur-md text-muted-foreground font-bold uppercase tracking-wider text-xs border-b border-border/70 select-none">
            <tr>
              <th className="px-4 py-3.5 w-24 text-center">
                {tDual("Схема", "Нақша")}
              </th>

              <th
                onClick={() => handleSort("unitNumber")}
                className="px-4 py-3.5 cursor-pointer hover:text-foreground transition-colors group"
              >
                <div className="flex items-center gap-1.5">
                  <span>{tDual("№ Кв. / Секция", "№ Хона / Бахш")}</span>
                  {getSortIcon("unitNumber")}
                </div>
              </th>

              <th
                onClick={() => handleSort("floor")}
                className="px-4 py-3.5 cursor-pointer hover:text-foreground transition-colors group"
              >
                <div className="flex items-center gap-1.5">
                  <span>{tDual("Этаж", "Ошёна")}</span>
                  {getSortIcon("floor")}
                </div>
              </th>

              <th
                onClick={() => handleSort("roomsCount")}
                className="px-4 py-3.5 cursor-pointer hover:text-foreground transition-colors group"
              >
                <div className="flex items-center gap-1.5">
                  <span>{tDual("Комнатность", "Шумораи ҳуҷраҳо")}</span>
                  {getSortIcon("roomsCount")}
                </div>
              </th>

              <th
                onClick={() => handleSort("totalArea")}
                className="px-4 py-3.5 cursor-pointer hover:text-foreground transition-colors group"
              >
                <div className="flex items-center gap-1.5">
                  <span>{tDual("Площадь", "Масоҳат")}</span>
                  {getSortIcon("totalArea")}
                </div>
              </th>

              <th className="px-4 py-3.5">
                <span>{tDual("Статус", "Ҳолат")}</span>
              </th>

              <th
                onClick={() => handleSort("pricePerMeter")}
                className="px-4 py-3.5 cursor-pointer hover:text-foreground transition-colors group"
              >
                <div className="flex items-center gap-1.5">
                  <span>{tDual("Цена за м²", "Нарх барои м²")}</span>
                  {getSortIcon("pricePerMeter")}
                </div>
              </th>

              <th
                onClick={() => handleSort("totalPrice")}
                className="px-4 py-3.5 cursor-pointer hover:text-foreground transition-colors text-right group"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>{tDual("Общая стоимость", "Арзиши умумӣ")}</span>
                  {getSortIcon("totalPrice")}
                </div>
              </th>

              <th className="px-4 py-3.5 w-32 text-center">
                {tDual("Действие", "Амал")}
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border/50 font-medium">
            {paginatedUnits.length === 0 ? (
              <tr>
                <td colSpan={9} className="h-44 text-center text-muted-foreground p-6">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Filter className="h-8 w-8 text-muted-foreground/40 stroke-1" />
                    <p className="font-semibold text-sm text-foreground">
                      {tDual("Квартиры не найдены", "Хонадонҳо ёфт нашуданд")}
                    </p>
                    <p className="text-xs text-muted-foreground max-w-sm">
                      {tDual(
                        "По заданным критериям ничего не найдено. Попробуйте сбросить фильтры комнатности или строку поиска.",
                        "Бо меъёрҳои додашуда чизе ёфт нашуд. Лутфан филтрҳои ҳуҷраҳо ё ҷустуҷӯро тоза кунед."
                      )}
                    </p>
                    {(searchTerm || roomFilter !== "all" || statusFilter !== "all") && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSearchTerm("");
                          setRoomFilter("all");
                          setStatusFilter("all");
                        }}
                        className="mt-2 text-xs"
                      >
                        {tDual("Сбросить фильтры", "Тоза кардани филтрҳо")}
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              paginatedUnits.map((unit) => {
                const isAvailable = unit.status === "available";
                const isReserved = unit.status === "reserved";
                const isSold = unit.status === "sold";

                return (
                  <tr
                    key={unit.id}
                    onClick={() => onSelectUnit(unit)}
                    className="hover:bg-emerald-500/5 dark:hover:bg-emerald-500/10 transition-colors cursor-pointer group"
                  >
                    {/* Thumbnail / Plan column */}
                    <td className="px-4 py-3 text-center">
                      <div className="relative w-12 h-12 mx-auto rounded-lg overflow-hidden border border-border/80 bg-muted/40 flex items-center justify-center group-hover:border-emerald-500/50 transition-colors">
                        {unit.layoutPlanUrl ? (
                          <img
                            src={unit.layoutPlanUrl}
                            alt={`План кв. ${unit.unitNumber}`}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <Layers className="h-5 w-5 text-muted-foreground/60" />
                        )}
                        <span className="absolute bottom-0 right-0 bg-background/85 backdrop-blur-xs text-xs font-extrabold px-1 rounded-tl">
                          {unit.roomsCount}к
                        </span>
                      </div>
                    </td>

                    {/* Unit Number & Section */}
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="font-extrabold text-foreground text-sm group-hover:text-emerald-600 transition-colors">
                          № {unit.unitNumber.replace(/^(?:№|Кв\.\s*)/i, "").trim()}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          {unit.section.replace(/Секция/gi, tDual("Секция", "Бахши"))}
                        </span>
                      </div>
                    </td>

                    {/* Floor */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 font-semibold text-foreground">
                        <span>{unit.floor}</span>
                        <span className="text-xs text-muted-foreground font-normal">
                          {language === "tg" ? "ошёна" : "эт."}
                        </span>
                      </div>
                    </td>

                    {/* Room count badge */}
                    <td className="px-4 py-3">
                      <Badge variant="frostedLight" className="font-bold text-xs">
                        {unit.roomsCount}-{tDual("комнатная", "ҳуҷрагӣ")}
                      </Badge>
                    </td>

                    {/* Total Area */}
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="font-extrabold text-foreground text-xs">
                          {unit.totalArea} м²
                        </span>
                        {unit.livingArea && (
                          <span className="text-xs text-muted-foreground">
                            {tDual("жил.", "истиқ.")} {unit.livingArea} м²
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      {getStatusBadge(unit.status)}
                    </td>

                    {/* Price per meter */}
                    <td className="px-4 py-3">
                      <div className="font-semibold text-muted-foreground text-xs">
                        {formatPrice(unit.pricePerMeterTjs, unit.pricePerMeterUsd)}/м²
                      </div>
                    </td>

                    {/* Total Price */}
                    <td className="px-4 py-3 text-right">
                      <div className="flex flex-col items-end">
                        <span className="font-extrabold text-sm text-emerald-600 dark:text-emerald-400 tabular-nums">
                          {formatPrice(unit.priceTjs, unit.priceUsd)}
                        </span>
                        {isAvailable && (
                          <span className="text-xs text-emerald-700/70 dark:text-emerald-300/70 font-semibold">
                            {tDual("0% рассрочка", "0% қисм-қисм")}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Action button */}
                    <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                      {isAvailable && onSelectUnitForDeal ? (
                        <Button
                          size="sm"
                          onClick={() => onSelectUnitForDeal(unit)}
                          className="h-8 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                        >
                          {tDual("Выбрать", "Интихоб")}
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onSelectUnit(unit)}
                          className="h-8 px-3 rounded-lg border-border/80 hover:bg-muted text-xs font-semibold cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5 mr-1" />
                          {tDual("Детали", "Тафсилот")}
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* TAHOE GLASS PAGINATION FOOTER */}
      <div className="p-4 border-t border-border/60 bg-muted/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-3">
          <span>
            {tDual("Показано", "Нишон дода шуд")}{" "}
            <strong className="text-foreground">
              {sortedUnits.length === 0 ? 0 : startIndex + 1}–{Math.min(startIndex + pageSize, sortedUnits.length)}
            </strong>{" "}
            {tDual("из", "аз")} <strong className="text-foreground">{sortedUnits.length}</strong>
          </span>

          <div className="flex items-center gap-1.5 ml-2">
            <span className="text-xs">{tDual("Показывать по:", "Дар саҳифа:")}</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="h-7 px-2 rounded-md border border-border/80 bg-background text-foreground text-xs font-semibold cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        {/* Page selector pills */}
        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            variant="outline"
            disabled={currentPageSafe <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="h-8 px-2.5 rounded-lg border-border/80 text-xs font-medium cursor-pointer disabled:opacity-30"
          >
            <ChevronLeft className="h-3.5 w-3.5 mr-1" />
            {tDual("Назад", "Қаблӣ")}
          </Button>

          <span className="px-2 font-bold text-foreground">
            {currentPageSafe} / {totalPages}
          </span>

          <Button
            size="sm"
            variant="outline"
            disabled={currentPageSafe >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="h-8 px-2.5 rounded-lg border-border/80 text-xs font-medium cursor-pointer disabled:opacity-30"
          >
            {tDual("Вперед", "Баъдӣ")}
            <ChevronRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
