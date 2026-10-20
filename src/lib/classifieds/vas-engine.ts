/**
 * Classifieds VAS (Value-Added Services) Promotion Engine
 *
 * Implements Freemium monetization for private sellers and realtors:
 * 1. «Поднять в ТОП на 7 дней» — 10 сомони (приоритетное ранжирование вверху каталога)
 * 2. «Выделение цветом» — 8 сомони (золотистая рамка, мягкий теплый фон, значок VIP)
 * 3. «Срочная продажа» со значком огня — 7 сомони (бейдж 🔥 Срочно / 🔥 Таъҷилӣ)
 * 4. «Турбо-пакет: Все включено» (ТОП + Рамка + Огонь) — 20 сомони (скидка 20%)
 */

import type { ClassifiedCard } from "@/lib/classifieds/map-card";

export type VasPlan = "top" | "highlight" | "urgent" | "turbo";

export interface VasPromotionRecord {
  classifiedId: string;
  plan: VasPlan;
  isTop: boolean;
  isHighlighted: boolean;
  isUrgent: boolean;
  activatedAt: string;
  expiresAt: string;
  amountPaidTjs: number;
}

// In-memory store initialized with realistic active promotions for demo catalog
const vasPromotionsStore: Map<string, VasPromotionRecord> = new Map([
  [
    "17034738", // 1-комн. квартира Шёлкокомбинат
    {
      classifiedId: "17034738",
      plan: "top",
      isTop: true,
      isHighlighted: false,
      isUrgent: false,
      activatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      expiresAt: new Date(Date.now() + 5 * 86400000).toISOString(),
      amountPaidTjs: 10,
    },
  ],
  [
    "17042551", // Квартира с ремонтом
    {
      classifiedId: "17042551",
      plan: "urgent",
      isTop: false,
      isHighlighted: false,
      isUrgent: true,
      activatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      expiresAt: new Date(Date.now() + 9 * 86400000).toISOString(),
      amountPaidTjs: 7,
    },
  ],
  [
    "17038924", // Дом / Ҳавлӣ
    {
      classifiedId: "17038924",
      plan: "turbo",
      isTop: true,
      isHighlighted: true,
      isUrgent: true,
      activatedAt: new Date(Date.now() - 12 * 3600000).toISOString(),
      expiresAt: new Date(Date.now() + 13 * 86400000).toISOString(),
      amountPaidTjs: 20,
    },
  ],
]);

/**
 * Promotes a classified property with the given plan
 */
export function promoteClassified(
  classifiedId: string,
  plan: VasPlan,
  durationDays?: number,
  amountPaidTjs?: number
): VasPromotionRecord {
  const days = durationDays ?? (plan === "top" ? 7 : plan === "highlight" ? 14 : plan === "urgent" ? 10 : 14);
  const now = new Date();
  const expires = new Date(now.getTime() + days * 86400000);

  const isTop = plan === "top" || plan === "turbo";
  const isHighlighted = plan === "highlight" || plan === "turbo";
  const isUrgent = plan === "urgent" || plan === "turbo";

  const record: VasPromotionRecord = {
    classifiedId,
    plan,
    isTop,
    isHighlighted,
    isUrgent,
    activatedAt: now.toISOString(),
    expiresAt: expires.toISOString(),
    amountPaidTjs:
      amountPaidTjs ??
      (plan === "top" ? 10 : plan === "highlight" ? 8 : plan === "urgent" ? 7 : 20),
  };

  vasPromotionsStore.set(classifiedId, record);
  return record;
}

/**
 * Gets active VAS promotion for a classified
 */
export function getClassifiedVas(classifiedId: string): VasPromotionRecord | null {
  const record = vasPromotionsStore.get(classifiedId);
  if (!record) return null;

  // Check expiration
  if (new Date(record.expiresAt).getTime() < Date.now()) {
    vasPromotionsStore.delete(classifiedId);
    return null;
  }

  return record;
}

/**
 * Enriches a classified card with active promotion flags
 */
export function applyVasToCard(card: ClassifiedCard): ClassifiedCard {
  const promo = getClassifiedVas(card.id) || getClassifiedVas(card.slug);
  if (!promo) return card;

  return {
    ...card,
    isTop: promo.isTop,
    topExpiresAt: promo.expiresAt,
    isHighlighted: promo.isHighlighted,
    highlightExpiresAt: promo.expiresAt,
    isUrgent: promo.isUrgent,
    urgentExpiresAt: promo.expiresAt,
    vasPlan: promo.plan,
  };
}

/**
 * Sorts classifieds so that promoted items (isTop) appear at the very beginning
 */
export function sortClassifiedsWithVas(cards: ClassifiedCard[]): ClassifiedCard[] {
  const enriched = cards.map(applyVasToCard);

  return [...enriched].sort((a, b) => {
    // 1. isTop gets absolute priority
    if (a.isTop && !b.isTop) return -1;
    if (!a.isTop && b.isTop) return 1;

    // 2. isHighlighted / isUrgent secondary priority
    const aPriority = (a.isHighlighted ? 2 : 0) + (a.isUrgent ? 1 : 0);
    const bPriority = (b.isHighlighted ? 2 : 0) + (b.isUrgent ? 1 : 0);
    if (aPriority !== bPriority) return bPriority - aPriority;

    return 0;
  });
}

/**
 * Returns all active promotions count and revenue
 */
export function getVasPromotionSummary() {
  const list = Array.from(vasPromotionsStore.values());
  const totalRevenueTjs = list.reduce((acc, p) => acc + p.amountPaidTjs, 0);

  return {
    activePromotionsCount: list.length,
    totalRevenueTjs,
    totalRevenueUsd: Math.round(totalRevenueTjs / 10.9),
    promotions: list,
  };
}
