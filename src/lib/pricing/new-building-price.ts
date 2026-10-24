/**
 * Utility functions for formatting and validating price per square meter
 * in new development cards (новостройки) according to technical specifications.
 *
 * Requirements:
 * 1. Label "Цена за метр" (RU) / "Нарх барои метр" (TG) on the left side.
 * 2. Calculation on the right side formatted with space digit group separators and unit,
 *    e.g. "11 250 сомони/м²" (RU) / "11 250 сомонӣ/м²" (TG) or "1 025 $/м²" (USD).
 * 3. Validation: returns null if price, area, or calculation is missing, <= 0, or invalid.
 * 4. Unified across all residential complex / new development cards.
 */

import type { Language } from "@/lib/i18n/translations";

export interface PricePerMeterParams {
  pricePerMeterTjs?: number | string | null;
  pricePerMeterUsd?: number | string | null;
  totalPriceTjs?: number | string | null;
  totalPriceUsd?: number | string | null;
  areaSqm?: number | string | null;
  currency?: "TJS" | "USD";
  language?: Language;
}

/**
 * Calculates and formats price per square meter for new development cards.
 * Returns null if calculation is not possible or values are invalid.
 */
export function formatNewBuildingPricePerMeter(params: PricePerMeterParams): string | null {
  const currency = params.currency === "USD" ? "USD" : "TJS";
  const language: Language = params.language || "ru";

  let numericPrice: number | null = null;

  if (currency === "USD") {
    if (params.pricePerMeterUsd != null) {
      const parsed = typeof params.pricePerMeterUsd === "string" ? parseFloat(params.pricePerMeterUsd) : params.pricePerMeterUsd;
      if (!isNaN(parsed) && parsed > 0 && isFinite(parsed)) {
        numericPrice = parsed;
      }
    }

    if (numericPrice == null && params.totalPriceUsd != null && params.areaSqm != null) {
      const total = typeof params.totalPriceUsd === "string" ? parseFloat(params.totalPriceUsd) : params.totalPriceUsd;
      const area = typeof params.areaSqm === "string" ? parseFloat(params.areaSqm) : params.areaSqm;
      if (!isNaN(total) && !isNaN(area) && total > 0 && area > 0 && isFinite(total) && isFinite(area)) {
        numericPrice = total / area;
      }
    }

    // Fallback: convert from TJS if USD price per meter is not directly set
    if (numericPrice == null && params.pricePerMeterTjs != null) {
      const parsedTjs = typeof params.pricePerMeterTjs === "string" ? parseFloat(params.pricePerMeterTjs) : params.pricePerMeterTjs;
      if (!isNaN(parsedTjs) && parsedTjs > 0 && isFinite(parsedTjs)) {
        numericPrice = parsedTjs / 10.95;
      }
    }
  } else {
    // TJS
    if (params.pricePerMeterTjs != null) {
      const parsed = typeof params.pricePerMeterTjs === "string" ? parseFloat(params.pricePerMeterTjs) : params.pricePerMeterTjs;
      if (!isNaN(parsed) && parsed > 0 && isFinite(parsed)) {
        numericPrice = parsed;
      }
    }

    if (numericPrice == null && params.totalPriceTjs != null && params.areaSqm != null) {
      const total = typeof params.totalPriceTjs === "string" ? parseFloat(params.totalPriceTjs) : params.totalPriceTjs;
      const area = typeof params.areaSqm === "string" ? parseFloat(params.areaSqm) : params.areaSqm;
      if (!isNaN(total) && !isNaN(area) && total > 0 && area > 0 && isFinite(total) && isFinite(area)) {
        numericPrice = total / area;
      }
    }

    // Fallback: convert from USD if TJS price per meter is not directly set
    if (numericPrice == null && params.pricePerMeterUsd != null) {
      const parsedUsd = typeof params.pricePerMeterUsd === "string" ? parseFloat(params.pricePerMeterUsd) : params.pricePerMeterUsd;
      if (!isNaN(parsedUsd) && parsedUsd > 0 && isFinite(parsedUsd)) {
        numericPrice = parsedUsd * 10.95;
      }
    }
  }

  if (numericPrice == null || isNaN(numericPrice) || numericPrice <= 0 || !isFinite(numericPrice)) {
    return null;
  }

  // Format with space as thousands separator: 11 250
  const rounded = Math.round(numericPrice);
  const formattedDigits = rounded.toLocaleString("ru-RU").replace(/\u00A0/g, " ");

  if (currency === "USD") {
    return `${formattedDigits} $/м²`;
  }

  if (language === "tg") {
    return `${formattedDigits} сомонӣ/м²`;
  }

  if (language === "en") {
    return `${formattedDigits} TJS/sq.m`;
  }

  return `${formattedDigits} сомони/м²`;
}

/**
 * Returns localized label for price per meter.
 */
export function getPricePerMeterLabel(language?: Language): string {
  if (language === "tg") return "Нарх барои метр";
  if (language === "en") return "Price per sq.m";
  return "Цена за метр";
}
