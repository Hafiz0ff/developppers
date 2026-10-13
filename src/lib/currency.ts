export const DEFAULT_USD_TO_TJS = 10.95;

export function formatTJS(amount: number | string | null | undefined): string {
  if (amount == null) return "0 сом.";
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num)) return "0 сом.";
  return new Intl.NumberFormat("ru-RU", {
    maximumFractionDigits: 0,
  }).format(num) + " сом.";
}

export function formatUSD(amount: number | string | null | undefined): string {
  if (amount == null) return "$0";
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num)) return "$0";
  return "$" + new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(num);
}

export function convertUsdToTjs(usdAmount: number, rate = DEFAULT_USD_TO_TJS): number {
  return Math.round(usdAmount * rate);
}

export function convertTjsToUsd(tjsAmount: number, rate = DEFAULT_USD_TO_TJS): number {
  return Math.round(tjsAmount / rate);
}
