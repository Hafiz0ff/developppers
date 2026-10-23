"use client";

import React from "react";
import { SelectedDealBundle } from "@/types/crm-booking";
import { calculateBundleTotal, formatSeparatedNumber } from "@/lib/crm-booking-store";
import { useLanguage } from "@/context/language-context";
import { useCurrency } from "@/context/currency-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  Car,
  Warehouse,
  Plus,
  X,
  Sparkles,
  Layers,
  ArrowDown,
  CheckCircle2,
} from "lucide-react";

interface ProjectDealBuilderBlockProps {
  bundle: SelectedDealBundle;
  onRemoveParking: () => void;
  onRemoveStorage: () => void;
  onOpenParkingModal: () => void;
  onOpenStorageModal: () => void;
  onScrollToChessboard: () => void;
  hasParkingConfigured: boolean;
  hasStorageConfigured: boolean;
}

export function ProjectDealBuilderBlock({
  bundle,
  onRemoveParking,
  onRemoveStorage,
  onOpenParkingModal,
  onOpenStorageModal,
  onScrollToChessboard,
  hasParkingConfigured,
  hasStorageConfigured,
}: ProjectDealBuilderBlockProps) {
  const { tDual } = useLanguage();
  const { currency } = useCurrency();

  const isUsd = currency === "USD";
  const { total, itemsCount, hasItems } = calculateBundleTotal(bundle, currency);

  // Section 5.2: Dynamic title for additional objects block
  const getAddonsTitle = () => {
    if (hasParkingConfigured && hasStorageConfigured) {
      return tDual(
        "С паркингом и кладовой покупка выгоднее",
        "Бо таваққуфгоҳ ва анборхона харид фоидаовартар аст"
      );
    }
    if (hasParkingConfigured) {
      return tDual(
        "С паркингом покупка выгоднее",
        "Бо таваққуфгоҳ харид фоидаовартар аст"
      );
    }
    if (hasStorageConfigured) {
      return tDual(
        "С кладовой покупка выгоднее",
        "Бо анборхона харид фоидаовартар аст"
      );
    }
    return "";
  };

  const showAddonsBlock = hasParkingConfigured || hasStorageConfigured;
  const unit =
    bundle.unit && bundle.unit.priceTjs > 0 && bundle.unit.totalArea > 0
      ? bundle.unit
      : null;
  const parking =
    bundle.parking && bundle.parking.priceTjs > 0 ? bundle.parking : null;
  const storage =
    bundle.storage && bundle.storage.priceTjs > 0 ? bundle.storage : null;

  const formatItemPrice = (priceTjs: number, priceUsd: number) => {
    return isUsd
      ? `$${formatSeparatedNumber(priceUsd)}`
      : `${formatSeparatedNumber(priceTjs)} ${tDual("сомони", "сомонӣ")}`;
  };

  return (
    <div className="space-y-4">
      {/* 1. БЛОК «СТОИМОСТЬ ВЫБРАННОЙ КВАРТИРЫ» (Section 4: Priority 2, under Installment) */}
      <Card className="p-4 rounded-2xl bg-card border border-emerald-500/20 shadow-xs space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 shrink-0">
              <Home className="h-4 w-4" />
            </div>
            <span className="text-xs font-bold text-foreground">
              {tDual("Стоимость выбранной квартиры", "Арзиши хонадони интихобшуда")}
            </span>
          </div>

          {unit ? (
            <Badge className="bg-emerald-600 text-white font-semibold text-[11px] px-2 py-0.5 shrink-0">
              {tDual(`Квартира № ${unit.number}`, `Хонадон № ${unit.number}`)}
            </Badge>
          ) : (
            <Badge variant="outline" className="text-[10px] text-muted-foreground border-border shrink-0">
              {tDual("Не выбрана", "Интихоб нашудааст")}
            </Badge>
          )}
        </div>

        {unit ? (
          <div className="pt-1 border-t border-border/60 flex items-baseline justify-between gap-2">
            <div className="space-y-0.5">
              <span className="text-[11px] text-muted-foreground block">
                {tDual("Стоимость квартиры", "Арзиши хонадон")}
              </span>
              <span className="text-[11px] text-muted-foreground block">
                {unit.roomsCount}
                {tDual("-комн.", "-ҳуҷр.")} · {unit.totalArea} м² · {unit.floor}{" "}
                {tDual("этаж", "ошёна")}
              </span>
            </div>
            <div className="text-lg sm:text-xl font-extrabold text-emerald-600 tabular-nums text-right">
              {formatItemPrice(unit.priceTjs, unit.priceUsd)}
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-muted/40 border border-dashed border-border flex items-center justify-between gap-2 text-xs">
            <span className="text-muted-foreground text-[11px]">
              {tDual(
                "Выберите квартиру в «План секции» или в блоке «Интерактивная шахматка»",
                "Хонадонро дар «Нақшаи бахш» ё «Ҷадвали интерактивӣ» интихоб кунед"
              )}
            </span>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={onScrollToChessboard}
              className="h-7 text-[11px] px-2.5 rounded-lg border-emerald-500/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 gap-1 cursor-pointer shrink-0"
            >
              <span>{tDual("К шахматке", "Ба ҷадвал")}</span>
              <ArrowDown className="h-3 w-3" />
            </Button>
          </div>
        )}
      </Card>

      {/* 2. БЛОК «С ПАРКИНГОМ И КЛАДОВОЙ ПОКУПКА ВЫГОДНЕЕ» (Section 5: under Selected Apartment Price) */}
      {showAddonsBlock && (
        <Card className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/5 via-card to-card border border-border/80 shadow-xs space-y-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              <span>{getAddonsTitle()}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-[11px] text-muted-foreground font-semibold">
              {tDual("Добавить", "Илова кардан")}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {hasStorageConfigured && (
                <Button
                  type="button"
                  size="sm"
                  variant={storage ? "secondary" : "outline"}
                  onClick={onOpenStorageModal}
                  className={`h-8 text-xs font-semibold rounded-xl gap-1.5 cursor-pointer ${
                    storage
                      ? "bg-emerald-500/15 text-emerald-800 dark:text-emerald-200 border border-emerald-500/30"
                      : "border-emerald-500/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/10"
                  }`}
                >
                  {storage ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  ) : (
                    <Plus className="h-3.5 w-3.5" />
                  )}
                  <Warehouse className="h-3.5 w-3.5" />
                  <span>{tDual("Кладовая", "Анборхона")}</span>
                </Button>
              )}

              {hasParkingConfigured && (
                <Button
                  type="button"
                  size="sm"
                  variant={parking ? "secondary" : "outline"}
                  onClick={onOpenParkingModal}
                  className={`h-8 text-xs font-semibold rounded-xl gap-1.5 cursor-pointer ${
                    parking
                      ? "bg-emerald-500/15 text-emerald-800 dark:text-emerald-200 border border-emerald-500/30"
                      : "border-emerald-500/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/10"
                  }`}
                >
                  {parking ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  ) : (
                    <Plus className="h-3.5 w-3.5" />
                  )}
                  <Car className="h-3.5 w-3.5" />
                  <span>{tDual("Машино-место", "Ҷойи мошин")}</span>
                </Button>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* 3. БЛОК «ОБЩАЯ СТОИМОСТЬ» (Section 6: Variant 1 under Selected Apartment Price, Variant 2 under Addons Block) */}
      <Card className="p-4 rounded-2xl bg-card border border-border/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b pb-2">
          <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            <span>{tDual("Общая стоимость", "Арзиши умумӣ")}</span>
          </span>
          {hasItems && (
            <Badge variant="secondary" className="text-[10px] font-semibold">
              {tDual(`Позиций: ${itemsCount}`, `Мавқеъҳо: ${itemsCount}`)}
            </Badge>
          )}
        </div>

        {hasItems ? (
          <div className="space-y-2 text-xs">
            {/* Apartment item */}
            {unit ? (
              <div className="flex items-center justify-between gap-2 py-1">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span className="text-foreground truncate">
                    {tDual("Квартира", "Хонадон")} № {unit.number}
                  </span>
                </div>
                <span className="font-semibold text-foreground shrink-0 tabular-nums">
                  — {formatItemPrice(unit.priceTjs, unit.priceUsd)}
                </span>
              </div>
            ) : (
              <div className="text-[11px] text-amber-700 dark:text-amber-300 bg-amber-500/10 px-2.5 py-1.5 rounded-lg">
                {tDual(
                  "Квартира ещё не выбрана. Выберите квартиру на шахматке для полного расчёта.",
                  "Хонадон ҳанӯз интихоб нашудааст. Хонадонро дар ҷадвал интихоб кунед."
                )}
              </div>
            )}

            {/* Parking item */}
            {parking && (
              <div className="flex items-center justify-between gap-2 py-1 bg-muted/30 px-2 rounded-lg">
                <div className="flex items-center gap-1.5 truncate">
                  <Car className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span className="text-foreground truncate">
                    {tDual("Машино-место", "Ҷойи мошин")} № {parking.number}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="font-semibold text-foreground tabular-nums">
                    — {formatItemPrice(parking.priceTjs, parking.priceUsd)}
                  </span>
                  <button
                    type="button"
                    onClick={onRemoveParking}
                    className="p-0.5 text-muted-foreground hover:text-rose-600 transition-colors cursor-pointer rounded"
                    title={tDual("Удалить машино-место", "Нест кардани ҷойи мошин")}
                    aria-label={tDual("Удалить машино-место", "Нест кардани ҷойи мошин")}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Storage item */}
            {storage && (
              <div className="flex items-center justify-between gap-2 py-1 bg-muted/30 px-2 rounded-lg">
                <div className="flex items-center gap-1.5 truncate">
                  <Warehouse className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span className="text-foreground truncate">
                    {tDual("Кладовая", "Анборхона")} № {storage.number}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="font-semibold text-foreground tabular-nums">
                    — {formatItemPrice(storage.priceTjs, storage.priceUsd)}
                  </span>
                  <button
                    type="button"
                    onClick={onRemoveStorage}
                    className="p-0.5 text-muted-foreground hover:text-rose-600 transition-colors cursor-pointer rounded"
                    title={tDual("Удалить кладовую", "Нест кардани анборхона")}
                    aria-label={tDual("Удалить кладовую", "Нест кардани анборхона")}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Total line */}
            <div className="pt-2 border-t flex items-baseline justify-between">
              <span className="text-xs font-bold text-foreground">
                {tDual("Итого:", "Ҷамъ:")}
              </span>
              <span className="text-lg sm:text-xl font-black text-emerald-600 tabular-nums">
                {isUsd
                  ? `$${formatSeparatedNumber(total)}`
                  : `${formatSeparatedNumber(total)} ${tDual("сомони", "сомонӣ")}`}
              </span>
            </div>
          </div>
        ) : (
          <div className="py-2 text-xs text-muted-foreground leading-relaxed">
            {tDual(
              "Выберите квартиру на плане секции или в интерактивной шахматке, чтобы увидеть состав комплекта и общую стоимость.",
              "Хонадонро дар нақшаи бахш ё ҷадвали интерактивӣ интихоб кунед, то таркиби маҷмӯъ ва арзиши умумиро бинед."
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
