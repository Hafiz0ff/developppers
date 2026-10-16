"use client";

import React from "react";
import { useCurrency } from "@/context/currency-context";
import { useLanguage } from "@/context/language-context";
import {
  formatNewBuildingPricePerMeter,
  getPricePerMeterLabel,
} from "@/lib/pricing/new-building-price";

export interface NewBuildingPriceBlockProps {
  minTotalPriceTjs?: number | string | null;
  minTotalPriceUsd?: number | string | null;
  minPricePerMeterTjs?: number | string | null;
  minPricePerMeterUsd?: number | string | null;
  minArea?: number | string | null;
  variant?: "card" | "detail" | "compact";
  className?: string;
}

/**
 * Standardized price block for new residential complexes (Новостройки).
 *
 * Requirements:
 * 1. Block "Стоимость квартир:"
 * 2. Displays total cost: e.g. "от 450 000 сомони"
 * 3. Under the total cost, displays:
 *    - Left side: "Цена за метр" (RU) / "Нарх барои метр" (TG)
 *    - Right side: calculation with space-separated thousands e.g. "11 250 сомони/м²" (or "1 025 $/м²")
 * 4. Does NOT display invalid or missing values (returns null / hides row).
 * 5. Unified style across all new building cards.
 */
export function NewBuildingPriceBlock({
  minTotalPriceTjs,
  minTotalPriceUsd,
  minPricePerMeterTjs,
  minPricePerMeterUsd,
  minArea,
  variant = "card",
  className = "",
}: NewBuildingPriceBlockProps) {
  const { formatPrice, currency } = useCurrency();
  const { tDual, language } = useLanguage();

  const pricePerMeterFormatted = formatNewBuildingPricePerMeter({
    pricePerMeterTjs: minPricePerMeterTjs,
    pricePerMeterUsd: minPricePerMeterUsd,
    totalPriceTjs: minTotalPriceTjs,
    totalPriceUsd: minTotalPriceUsd,
    areaSqm: minArea,
    currency,
    language,
  });

  if (variant === "detail") {
    return (
      <div
        className={`bg-card border rounded-2xl p-4 sm:p-5 shadow-sm text-left shrink-0 flex flex-col justify-center min-w-[240px] ${className}`}
      >
        <div className="text-xs text-muted-foreground font-medium">
          {tDual("Стоимость квартир:", "Нархи хонадонҳо:")}
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 sm:text-right">
          {tDual("от ", "аз ")}
          {formatPrice(minTotalPriceTjs, minTotalPriceUsd)}
        </div>
        {pricePerMeterFormatted && (
          <div className="flex items-center justify-between gap-4 pt-2 mt-2 border-t border-border/60 text-xs">
            <span className="text-muted-foreground font-normal">
              {getPricePerMeterLabel(language)}
            </span>
            <span className="font-bold text-foreground tabular-nums text-right">
              {pricePerMeterFormatted}
            </span>
          </div>
        )}
      </div>
    );
  }

  // Standard "card" variant for catalog cards (page.tsx, developers/[slug], developer-admin)
  return (
    <div className={`pt-3 border-t border-slate-100 space-y-1.5 ${className}`}>
      {/* 1. Стоимость объекта */}
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-[11px] font-medium text-slate-500">
          {tDual("Стоимость квартир:", "Нархи хонадонҳо:")}
        </span>
        <span className="text-lg font-bold text-emerald-600 tracking-tight">
          {tDual("от ", "аз ")}
          {formatPrice(minTotalPriceTjs, minTotalPriceUsd)}
        </span>
      </div>

      {/* 2. Под стоимостью объекта: слева "Цена за метр", справа расчёт */}
      {pricePerMeterFormatted && (
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100/80 text-xs text-slate-600">
          <span className="text-slate-500 font-normal">
            {getPricePerMeterLabel(language)}
          </span>
          <span className="font-semibold text-slate-900 tabular-nums text-right">
            {pricePerMeterFormatted}
          </span>
        </div>
      )}
    </div>
  );
}
