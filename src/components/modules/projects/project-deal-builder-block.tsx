"use client";

import React, { useState, useRef, useEffect } from "react";
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
  onRemoveUnit?: () => void;
  onRemoveParking: () => void;
  onRemoveStorage: () => void;
  onOpenParkingModal: () => void;
  onOpenStorageModal: () => void;
  onScrollToChessboard: () => void;
  hasParkingConfigured: boolean;
  hasStorageConfigured: boolean;
}

interface DealItemRowProps {
  itemKey: string;
  icon: React.ReactNode;
  title: string;
  priceTjs: number;
  priceUsd: number;
  isUsd: boolean;
  isRemoving: boolean;
  onRemove?: () => void;
  removeTitle: string;
  tDual: (ru: string, tg: string, en?: string) => string;
}

function DealItemRow({
  icon,
  title,
  priceTjs,
  priceUsd,
  isUsd,
  isRemoving,
  onRemove,
  removeTitle,
  tDual,
}: DealItemRowProps) {
  const formattedPrice = isUsd
    ? `${formatSeparatedNumber(priceUsd)} $`
    : `${formatSeparatedNumber(priceTjs)} ${tDual("сомони", "сомонӣ", "TJS")}`;

  return (
    <div
      className={`deal-builder-item-wrapper ${isRemoving ? "is-removing" : ""}`}
      style={{
        display: "grid",
        gridTemplateRows: isRemoving ? "0fr" : "1fr",
        marginBottom: isRemoving ? 0 : "0.5rem",
        transitionProperty: "grid-template-rows, margin-bottom, opacity",
        transitionDuration: "600ms",
        transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      <div className="deal-builder-item-inner overflow-hidden min-h-0">
        <div
          className="deal-builder-item-row flex items-center justify-between gap-3 py-1.5 px-2.5 rounded-xl bg-muted/40 border border-border/40 hover:bg-muted/60 transition-colors"
          style={{
            transform: isRemoving ? "translateX(-40px)" : "translateX(0)",
            opacity: isRemoving ? 0 : 1,
            transitionProperty: "transform, opacity",
            transitionDuration: "600ms",
            transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
            pointerEvents: isRemoving ? "none" : "auto",
          }}
        >
          {/* Товар выровнен по левому краю */}
          <div className="flex items-center gap-2 min-w-0 flex-1 text-left">
            {icon}
            <span className="text-foreground truncate font-medium">
              {title}
            </span>
          </div>

          {/* Валюта выровнена по правому краю + иконка Х после кода валют */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="font-semibold text-foreground tabular-nums text-right">
              {formattedPrice}
            </span>
            {onRemove && (
              <button
                type="button"
                onClick={onRemove}
                className="p-1 rounded-md text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer shrink-0"
                title={removeTitle}
                aria-label={removeTitle}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProjectDealBuilderBlock({
  bundle,
  onRemoveUnit,
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

  // Состояние активных анимированных удалений (slide-out-left 600ms cubic-bezier(0.22, 1, 0.36, 1))
  const [removingKeys, setRemovingKeys] = useState<Set<string>>(new Set());
  const timersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  useEffect(() => {
    return () => {
      timersRef.current.forEach((timer) => clearTimeout(timer));
      timersRef.current.clear();
    };
  }, []);

  const handleRemoveItem = (key: string, onRemoveCallback: () => void) => {
    if (removingKeys.has(key)) return;
    setRemovingKeys((prev) => new Set(prev).add(key));

    const timer = setTimeout(() => {
      onRemoveCallback();
      setRemovingKeys((prev) => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
      timersRef.current.delete(key);
    }, 600);

    timersRef.current.set(key, timer);
  };

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
      ? `${formatSeparatedNumber(priceUsd)} $`
      : `${formatSeparatedNumber(priceTjs)} ${tDual("сомони", "сомонӣ", "TJS")}`;
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
          <div className="text-xs">
            {/* Apartment item */}
            {unit ? (
              <DealItemRow
                itemKey="unit"
                icon={<Home className="h-3.5 w-3.5 text-emerald-600 shrink-0" />}
                title={`${tDual("Квартира", "Хонадон")} № ${unit.number} · ${unit.roomsCount}${tDual("-комн.", "-ҳуҷр.")} (${unit.totalArea} м²)`}
                priceTjs={unit.priceTjs}
                priceUsd={unit.priceUsd}
                isUsd={isUsd}
                isRemoving={removingKeys.has("unit")}
                onRemove={onRemoveUnit ? () => handleRemoveItem("unit", onRemoveUnit) : undefined}
                removeTitle={tDual("Удалить квартиру", "Нест кардани хонадон")}
                tDual={tDual}
              />
            ) : (
              <div className="text-[11px] text-amber-700 dark:text-amber-300 bg-amber-500/10 px-2.5 py-1.5 rounded-lg mb-2">
                {tDual(
                  "Квартира ещё не выбрана. Выберите квартиру на шахматке для полного расчёта.",
                  "Хонадон ҳанӯз интихоб нашудааст. Хонадонро дар ҷадвал интихоб кунед."
                )}
              </div>
            )}

            {/* Parking item */}
            {parking && (
              <DealItemRow
                itemKey="parking"
                icon={<Car className="h-3.5 w-3.5 text-emerald-600 shrink-0" />}
                title={`${tDual("Машино-место", "Ҷойи мошин")} № ${parking.number} (${parking.level})`}
                priceTjs={parking.priceTjs}
                priceUsd={parking.priceUsd}
                isUsd={isUsd}
                isRemoving={removingKeys.has("parking")}
                onRemove={() => handleRemoveItem("parking", onRemoveParking)}
                removeTitle={tDual("Удалить машино-место", "Нест кардани ҷойи мошин")}
                tDual={tDual}
              />
            )}

            {/* Storage item */}
            {storage && (
              <DealItemRow
                itemKey="storage"
                icon={<Warehouse className="h-3.5 w-3.5 text-emerald-600 shrink-0" />}
                title={`${tDual("Кладовая", "Анборхона")} № ${storage.number} (${storage.area} м²)`}
                priceTjs={storage.priceTjs}
                priceUsd={storage.priceUsd}
                isUsd={isUsd}
                isRemoving={removingKeys.has("storage")}
                onRemove={() => handleRemoveItem("storage", onRemoveStorage)}
                removeTitle={tDual("Удалить кладовую", "Нест кардани анборхона")}
                tDual={tDual}
              />
            )}

            {/* Total line */}
            <div className="pt-2 border-t flex items-baseline justify-between">
              <span className="text-xs font-bold text-foreground">
                {tDual("Итого:", "Ҷамъ:")}
              </span>
              <span className="text-lg sm:text-xl font-black text-emerald-600 tabular-nums">
                {isUsd
                  ? `${formatSeparatedNumber(total)} $`
                  : `${formatSeparatedNumber(total)} ${tDual("сомони", "сомонӣ", "TJS")}`}
              </span>
            </div>
          </div>
        ) : (
          <div className="py-2 text-xs text-muted-foreground leading-relaxed animate-in fade-in duration-300">
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
