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
  const { tDual, language } = useLanguage();
  const { currency, formatPrice } = useCurrency();

  const isUsd = currency === "USD";
  const { total, itemsCount } = calculateBundleTotal(bundle, currency);

  // Determine dynamic title for additional objects block
  const getAddonsTitle = () => {
    if (hasParkingConfigured && hasStorageConfigured) {
      return tDual("С паркингом и кладовой покупка выгоднее", "Бо таваққуфгоҳ ва анборхона харид фоидаовартар аст");
    }
    if (hasParkingConfigured) {
      return tDual("С паркингом покупка выгоднее", "Бо таваққуфгоҳ харид фоидаовартар аст");
    }
    if (hasStorageConfigured) {
      return tDual("С кладовой покупка выгоднее", "Бо анборхона харид фоидаовартар аст");
    }
    return "";
  };

  const showAddonsBlock = hasParkingConfigured || hasStorageConfigured;
  const unit = bundle.unit;
  const parking = bundle.parking;
  const storage = bundle.storage;

  return (
    <div className="space-y-4">
      {/* 1. БЛОК «СТОИМОСТЬ ВЫБРАННОЙ КВАРТИРЫ» (Priority 2, placed under Installment) */}
      <Card className="p-4 rounded-2xl bg-card border border-emerald-500/20 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600">
              <Home className="h-4 w-4" />
            </div>
            <span className="text-xs font-bold text-foreground">
              {tDual("Стоимость выбранной квартиры:", "Арзиши хонадони интихобшуда:")}
            </span>
          </div>

          {unit ? (
            <Badge className="bg-emerald-600 text-white font-semibold text-[11px] px-2 py-0.5">
              {tDual(`Кв. №${unit.number}`, `Хон. №${unit.number}`)}
            </Badge>
          ) : (
            <Badge variant="outline" className="text-[10px] text-muted-foreground border-border">
              {tDual("Не выбрана", "Интихоб нашудааст")}
            </Badge>
          )}
        </div>

        {unit ? (
          <div className="space-y-2">
            <div className="flex items-baseline justify-between pt-1">
              <span className="text-xs text-muted-foreground">
                {unit.roomsCount}
                {tDual("-комн.", "-ҳуҷр.")} · {unit.totalArea} м² · {unit.floor}{" "}
                {tDual("этаж", "ошёна")}
              </span>
              <div className="text-xl font-extrabold text-emerald-600 tabular-nums">
                {isUsd
                  ? `$${formatSeparatedNumber(unit.priceUsd)}`
                  : `${formatSeparatedNumber(unit.priceTjs)} ${tDual("сомони", "сомонӣ")}`}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-muted/40 border border-dashed border-border flex items-center justify-between gap-2 text-xs">
            <span className="text-muted-foreground text-[11px]">
              {tDual("Выберите квартиру на шахматке ниже", "Хонадонро дар ҷадвали шоҳмотии зер интихоб кунед")}
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={onScrollToChessboard}
              className="h-7 text-[11px] px-2.5 rounded-lg border-emerald-500/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 gap-1 cursor-pointer"
            >
              <span>{tDual("К шахматке", "Ба ҷадвал")}</span>
              <ArrowDown className="h-3 w-3" />
            </Button>
          </div>
        )}
      </Card>

      {/* 2. БЛОК «С ПАРКИНГОМ И КЛАДОВОЙ ПОКУПКА ВЫГОДНЕЕ» */}
      {showAddonsBlock && (
        <Card className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/5 via-card to-card border border-border/80 shadow-xs space-y-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
              <span>{getAddonsTitle()}</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              {tDual(
                "Добавьте машино-место и кладовую для пакетного оформления заявки",
                "Ҷойи мошин ва анборхонаро барои таҳияи маҷмӯии дархост ҳамроҳ кунед"
              )}
            </p>
          </div>

          <div className="pt-1 flex flex-wrap items-center gap-2">
            <span className="text-[11px] text-muted-foreground font-semibold mr-1">
              {tDual("Добавить:", "Илова кардан:")}
            </span>

            {hasParkingConfigured && !parking && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={onOpenParkingModal}
                className="h-8 text-xs font-semibold rounded-xl border-emerald-500/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/10 gap-1.5 cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <Car className="h-3.5 w-3.5" />
                <span>{tDual("Машино-место", "Ҷойи мошин")}</span>
              </Button>
            )}

            {hasStorageConfigured && !storage && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={onOpenStorageModal}
                className="h-8 text-xs font-semibold rounded-xl border-emerald-500/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/10 gap-1.5 cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <Warehouse className="h-3.5 w-3.5" />
                <span>{tDual("Кладовая", "Анборхона")}</span>
              </Button>
            )}

            {((hasParkingConfigured && parking) || (hasStorageConfigured && storage)) && (
              <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {tDual("Объекты в заказе", "Объектҳо дар фармоиш")}
              </span>
            )}
          </div>
        </Card>
      )}

      {/* 3. БЛОК «ОБЩАЯ СТОИМОСТЬ» (Корзина сделки) */}
      {(unit || parking || storage) && (
        <Card className="p-4 rounded-2xl bg-card border border-border/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b pb-2">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-emerald-600" />
              <span>{tDual("Общая стоимость (комплект):", "Арзиши умумӣ (маҷмӯъ):")}</span>
            </span>
            <Badge variant="secondary" className="text-[10px] font-semibold">
              {tDual(`${itemsCount} объекта`, `${itemsCount} объект`)}
            </Badge>
          </div>

          <div className="space-y-2 text-xs">
            {/* Apartment item */}
            {unit && (
              <div className="flex items-center justify-between gap-2 py-1">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span className="text-foreground truncate">
                    {tDual("Квартира", "Хонадон")} №{unit.number} ({unit.totalArea} м²)
                  </span>
                </div>
                <span className="font-semibold text-foreground shrink-0 tabular-nums">
                  {isUsd
                    ? `$${formatSeparatedNumber(unit.priceUsd)}`
                    : `${formatSeparatedNumber(unit.priceTjs)} ${tDual("сом.", "сом.")}`}
                </span>
              </div>
            )}

            {/* Parking item */}
            {parking && (
              <div className="flex items-center justify-between gap-2 py-1 bg-muted/30 px-2 rounded-lg">
                <div className="flex items-center gap-1.5 truncate">
                  <Car className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span className="text-foreground truncate">
                    {tDual("Машино-место", "Ҷойи мошин")} №{parking.number} ({parking.level})
                  </span>
                  <button
                    type="button"
                    onClick={onRemoveParking}
                    className="p-0.5 text-muted-foreground hover:text-rose-600 transition-colors cursor-pointer rounded"
                    title={tDual("Удалить машино-место", "Нест кардани ҷойи мошин")}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
                <span className="font-semibold text-foreground shrink-0 tabular-nums">
                  {isUsd
                    ? `$${formatSeparatedNumber(parking.priceUsd)}`
                    : `${formatSeparatedNumber(parking.priceTjs)} ${tDual("сом.", "сом.")}`}
                </span>
              </div>
            )}

            {/* Storage item */}
            {storage && (
              <div className="flex items-center justify-between gap-2 py-1 bg-muted/30 px-2 rounded-lg">
                <div className="flex items-center gap-1.5 truncate">
                  <Warehouse className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span className="text-foreground truncate">
                    {tDual("Кладовая", "Анборхона")} №{storage.number} ({storage.level})
                  </span>
                  <button
                    type="button"
                    onClick={onRemoveStorage}
                    className="p-0.5 text-muted-foreground hover:text-rose-600 transition-colors cursor-pointer rounded"
                    title={tDual("Удалить кладовую", "Нест кардани анборхона")}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
                <span className="font-semibold text-foreground shrink-0 tabular-nums">
                  {isUsd
                    ? `$${formatSeparatedNumber(storage.priceUsd)}`
                    : `${formatSeparatedNumber(storage.priceTjs)} ${tDual("сом.", "сом.")}`}
                </span>
              </div>
            )}

            {/* Total line */}
            <div className="pt-2 border-t flex items-baseline justify-between">
              <span className="text-xs font-bold text-foreground">
                {tDual("Итого:", "Ҷамъ:")}
              </span>
              <span className="text-xl font-black text-emerald-600 tabular-nums">
                {isUsd
                  ? `$${formatSeparatedNumber(total)}`
                  : `${formatSeparatedNumber(total)} ${tDual("сомони", "сомонӣ")}`}
              </span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
