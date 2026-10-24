import type { Language } from "@/lib/i18n/translations";

/**
 * Date formatting utilities for real estate listings
 * Implements strict format matching specification 4.4:
 * «Публикация 15.окт, 11:54» (RU) / «Нашр 15.окт, 11:54» (TG) / «Published 15.Oct, 11:54» (EN)
 */

const MONTHS_SHORT_RU = [
  "янв",
  "фев",
  "мар",
  "апр",
  "май",
  "июн",
  "июл",
  "авг",
  "сен",
  "окт",
  "ноя",
  "дек",
];

const MONTHS_SHORT_TG = [
  "янв",
  "фев",
  "мар",
  "апр",
  "май",
  "июн",
  "июл",
  "авг",
  "сен",
  "окт",
  "ноя",
  "дек",
];

const MONTHS_SHORT_EN = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function formatPublicationDate(
  dateInput?: Date | string | number | null,
  lang: Language = "ru",
  seedFallbackId?: string
): string {
  let date: Date;

  if (dateInput) {
    date = new Date(dateInput);
    if (isNaN(date.getTime())) {
      date = getFallbackDateForId(seedFallbackId);
    }
  } else {
    date = getFallbackDateForId(seedFallbackId);
  }

  const day = date.getDate();
  const monthIdx = date.getMonth();
  const monthName =
    lang === "tg"
      ? MONTHS_SHORT_TG[monthIdx]
      : lang === "en"
      ? MONTHS_SHORT_EN[monthIdx]
      : MONTHS_SHORT_RU[monthIdx];
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  const prefix = lang === "tg" ? "Нашр" : lang === "en" ? "Published" : "Публикация";

  return `${prefix} ${day}.${monthName}, ${hours}:${minutes}`;
}

/**
 * Returns a stable, deterministic date for items without explicit createdAt timestamp
 */
function getFallbackDateForId(id?: string): Date {
  if (!id) {
    // Current date fallback
    return new Date();
  }
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  const abs = Math.abs(hash);
  // Pick day 1 to 28 of current month (or October)
  const day = (abs % 25) + 1;
  const hours = (abs % 12) + 9; // 09:00 to 21:00
  const minutes = (abs % 60);

  const d = new Date();
  d.setDate(day);
  d.setHours(hours, minutes, 0, 0);
  return d;
}

/**
 * Formats price per square meter with space separator (Section 4.2 of specification)
 * Format: «Цена за метр: 977 636 сомони/м²» (RU) / «Нарх барои метр: 977 636 сомонӣ/м²» (TG)
 */
export function formatPricePerSquareMeter(
  totalPriceTjs: number,
  areaSqm: number,
  lang: Language = "ru"
): string {
  if (!areaSqm || areaSqm <= 0 || !totalPriceTjs || totalPriceTjs <= 0) {
    return "";
  }

  const pricePerMeter = Math.round(totalPriceTjs / areaSqm);
  // Format with space as thousands separator: 977 636
  const formattedNumber = pricePerMeter.toLocaleString("ru-RU").replace(/\u00A0/g, " ");

  if (lang === "tg") {
    return `Нарх барои метр: ${formattedNumber} сомонӣ/м²`;
  }
  if (lang === "en") {
    return `Price per sq.m: ${formattedNumber} TJS/sq.m`;
  }
  return `Цена за метр: ${formattedNumber} сомони/м²`;
}
