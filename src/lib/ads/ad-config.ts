/**
 * Advertising Platform Configuration & Distribution Engine for Maskani.tj
 *
 * Designed for programmatic ad placement and future integration with
 * Super-Admin and Advertiser Self-Service Portal (auction / direct sponsorship).
 */

export type AdBlock1Variant = "self_promo" | "eskhata_mortgage" | "eskhata_insurance";
export type AdBlock2Variant = "artel_standard" | "artel_mortgage_bundle";

/**
 * Deterministically computes a percentile bucket (0..99) for any given seed.
 * Guarantees that a property card consistently renders the same ad banner.
 */
export function getAdBucket(seed: string | number | null | undefined): number {
  if (seed == null) return 0;
  const str = String(seed);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) % 1000000;
  }
  return Math.abs(hash) % 100;
}

/**
 * Ad Block 1 Distribution:
 * - 40% (0..39): "Ваша реклама здесь" (Maskani self-promo banner)
 * - 30% (40..69): "Банк Эсхата" — Ипотека 16% годовых
 * - 30% (70..99): "Эсхата Страхование" — Защита недвижимости
 */
export function getAdBlock1Variant(seed: string | number | null | undefined): AdBlock1Variant {
  const bucket = getAdBucket(seed);
  if (bucket < 40) {
    return "self_promo";
  }
  if (bucket < 70) {
    return "eskhata_mortgage";
  }
  return "eskhata_insurance";
}

/**
 * Ad Block 2 Distribution:
 * - 40% (0..39): "Артель" — Бытовая техника для каждого
 * - 60% (40..99): "Артель" — Бытовая техника + Ипотека на обустройство
 */
export function getAdBlock2Variant(seed: string | number | null | undefined): AdBlock2Variant {
  // Use a salted seed so block 2 variation is independent of block 1
  const bucket = getAdBucket(`${seed}_block2_salt`);
  if (bucket < 40) {
    return "artel_standard";
  }
  return "artel_mortgage_bundle";
}

export interface AdContactInfo {
  phone: string;
  whatsapp: string;
  email: string;
}

export const MASKANI_AD_CONTACTS: AdContactInfo = {
  phone: "+992 92 888 1234",
  whatsapp: "992928881234",
  email: "adv@maskani.tj",
};
