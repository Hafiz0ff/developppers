/**
 * Property Comparison Store & Utilities for Maskani.tj
 *
 * Implements:
 * 1. Side-by-side comparison of up to 4 real estate properties
 * 2. Cross-tab real-time synchronization via localStorage and window CustomEvents
 * 3. Dual currency support (TJS / USD) and price-per-meter calculations
 * 4. Sughd-specific parameters: constant city water vs. water hauz, 3-phase electricity, heating, renovation
 * 5. Best-value metrics detection (lowest price, lowest price/m², largest area)
 * 6. "Only differences" filtering calculation
 */

export interface CompareProperty {
  id: string;
  slug: string;
  title: string;
  titleTg?: string;
  dealType: string;
  dealTypeTg?: string;
  propertyType: string;
  propertyTypeTg?: string;
  city: string;
  district: string;
  landmark?: string;
  priceTjs: number;
  priceUsd: number;
  pricePerMeterTjs: number;
  pricePerMeterUsd: number;
  area: number;
  rooms: number;
  floor?: string;
  image: string;
  hasCityWater?: boolean;
  hasWaterHauz?: boolean;
  hasElectricity?: boolean;
  hasHeating?: boolean;
  hasSewerage?: boolean;
  isFurnished?: boolean;
  renovation?: string;
  buildingType?: string;
  sellerType: string;
  phone: string;
  whatsapp: string;
  isNegotiable?: boolean;
}

export const COMPARE_STORAGE_KEY = "maskani_compare_items_v1";
export const COMPARE_CHANGED_EVENT = "maskani_compare_changed";
export const MAX_COMPARE_ITEMS = 4;

/**
 * Reads compared properties from localStorage
 */
export function getStoredCompareItems(): CompareProperty[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(COMPARE_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Saves compared properties and dispatches sync event
 */
export function saveStoredCompareItems(items: CompareProperty[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(
      new CustomEvent(COMPARE_CHANGED_EVENT, {
        detail: { items, count: items.length },
      })
    );
  } catch {
    // quota exceeded or private mode
  }
}

/**
 * Adds an item to comparison
 */
export function addToCompareStore(
  item: CompareProperty
): { success: boolean; error?: string; items: CompareProperty[] } {
  const current = getStoredCompareItems();
  const exists = current.some((c) => c.id === item.id || c.slug === item.slug);

  if (exists) {
    return { success: true, items: current };
  }

  if (current.length >= MAX_COMPARE_ITEMS) {
    return {
      success: false,
      error: `Можно сравнивать не более ${MAX_COMPARE_ITEMS} объектов одновременно`,
      items: current,
    };
  }

  const updated = [...current, item];
  saveStoredCompareItems(updated);
  return { success: true, items: updated };
}

/**
 * Removes an item from comparison
 */
export function removeFromCompareStore(idOrSlug: string): CompareProperty[] {
  const current = getStoredCompareItems();
  const updated = current.filter((c) => c.id !== idOrSlug && c.slug !== idOrSlug);
  saveStoredCompareItems(updated);
  return updated;
}

/**
 * Clears comparison store
 */
export function clearCompareStore(): void {
  saveStoredCompareItems([]);
}

/**
 * Checks if an item is currently compared
 */
export function isItemInCompareStore(idOrSlug: string): boolean {
  const current = getStoredCompareItems();
  return current.some((c) => c.id === idOrSlug || c.slug === idOrSlug);
}

/**
 * Detects the best metrics among compared properties (lowest price, highest area, etc.)
 */
export function detectBestMetrics(items: CompareProperty[]): {
  lowestPriceId?: string;
  lowestPricePerMeterId?: string;
  largestAreaId?: string;
} {
  if (items.length < 2) return {};

  let lowestPrice = Infinity;
  let lowestPriceId: string | undefined;

  let lowestPpm = Infinity;
  let lowestPpmId: string | undefined;

  let largestArea = -1;
  let largestAreaId: string | undefined;

  for (const item of items) {
    if (item.priceTjs > 0 && item.priceTjs < lowestPrice) {
      lowestPrice = item.priceTjs;
      lowestPriceId = item.id;
    }
    if (item.pricePerMeterTjs > 0 && item.pricePerMeterTjs < lowestPpm) {
      lowestPpm = item.pricePerMeterTjs;
      lowestPpmId = item.id;
    }
    if (item.area > largestArea) {
      largestArea = item.area;
      largestAreaId = item.id;
    }
  }

  return {
    lowestPriceId,
    lowestPricePerMeterId: lowestPpmId,
    largestAreaId,
  };
}

export type CompareRowKey =
  | "price"
  | "pricePerMeter"
  | "area"
  | "rooms"
  | "floor"
  | "city"
  | "district"
  | "propertyType"
  | "renovation"
  | "buildingType"
  | "hasCityWater"
  | "hasWaterHauz"
  | "hasElectricity"
  | "hasHeating"
  | "hasSewerage"
  | "isFurnished"
  | "isNegotiable"
  | "sellerType";

/**
 * Determines which rows have differing values between items
 */
export function getDifferingRowKeys(items: CompareProperty[]): Set<CompareRowKey> {
  const differing = new Set<CompareRowKey>();
  if (items.length < 2) return differing;

  const keys: CompareRowKey[] = [
    "price",
    "pricePerMeter",
    "area",
    "rooms",
    "floor",
    "city",
    "district",
    "propertyType",
    "renovation",
    "buildingType",
    "hasCityWater",
    "hasWaterHauz",
    "hasElectricity",
    "hasHeating",
    "hasSewerage",
    "isFurnished",
    "isNegotiable",
    "sellerType",
  ];

  for (const key of keys) {
    const firstVal = getRowValue(items[0], key);
    const hasDiff = items.some((item) => getRowValue(item, key) !== firstVal);
    if (hasDiff) {
      differing.add(key);
    }
  }

  return differing;
}

function getRowValue(item: CompareProperty, key: CompareRowKey): string | number | boolean {
  switch (key) {
    case "price":
      return item.priceTjs;
    case "pricePerMeter":
      return item.pricePerMeterTjs;
    case "area":
      return item.area;
    case "rooms":
      return item.rooms;
    case "floor":
      return item.floor || "-";
    case "city":
      return item.city;
    case "district":
      return item.district;
    case "propertyType":
      return item.propertyType;
    case "renovation":
      return item.renovation || "Без ремонта";
    case "buildingType":
      return item.buildingType || "Не указан";
    case "hasCityWater":
      return Boolean(item.hasCityWater);
    case "hasWaterHauz":
      return Boolean(item.hasWaterHauz);
    case "hasElectricity":
      return Boolean(item.hasElectricity);
    case "hasHeating":
      return Boolean(item.hasHeating);
    case "hasSewerage":
      return Boolean(item.hasSewerage);
    case "isFurnished":
      return Boolean(item.isFurnished);
    case "isNegotiable":
      return Boolean(item.isNegotiable);
    case "sellerType":
      return item.sellerType;
  }
}

/**
 * Adapter helper to transform any catalog/classified property into CompareProperty
 */
export function classifiedToCompareProperty(item: {
  id: string | number;
  slug?: string;
  title: string;
  titleTg?: string;
  dealType?: string;
  dealTypeTg?: string;
  propertyType?: string;
  propertyTypeTg?: string;
  city?: string;
  district?: string;
  landmark?: string;
  priceTjs: number;
  priceUsd: number;
  area: number;
  rooms?: number;
  floor?: string;
  image?: string;
  images?: string[];
  features?: string[];
  sellerType?: string;
  phone?: string;
  whatsapp?: string;
  isNegotiable?: boolean;
  buildingType?: string;
  renovation?: string;
}): CompareProperty {
  const safeArea = item.area > 0 ? item.area : 1;
  const features = Array.isArray(item.features) ? item.features : [];
  const featuresText = features.join(" ");

  const hasCityWater =
    /городская вода|постоянная вода|шабакаи шаҳрӣ|водопровод/i.test(featuresText);
  const hasWaterHauz = /хауз|ҳавз|резервуар/i.test(featuresText);
  const hasElectricity = /3-фазн|электричеств|барқ|трансформатор/i.test(featuresText);
  const hasHeating = /отопление|гармидиҳӣ|тёплый пол|котел/i.test(featuresText);
  const hasSewerage = /канализаци|корез|септик/i.test(featuresText);
  const isFurnished = /мебел|ҷиҳозонида/i.test(featuresText);

  const matchedRenovation =
    item.renovation ||
    features.find((f) => /ремонт|таъмир|евро|коробка|черновая/i.test(f)) ||
    "С ремонтом";

  return {
    id: String(item.id),
    slug: item.slug || String(item.id),
    title: item.title,
    titleTg: item.titleTg,
    dealType: item.dealType || "Продажа",
    dealTypeTg: item.dealTypeTg,
    propertyType: item.propertyType || "Квартира",
    propertyTypeTg: item.propertyTypeTg,
    city: item.city || "г. Худжанд",
    district: item.district || "Центр",
    landmark: item.landmark,
    priceTjs: item.priceTjs,
    priceUsd: item.priceUsd,
    pricePerMeterTjs: Math.round(item.priceTjs / safeArea),
    pricePerMeterUsd: Math.round(item.priceUsd / safeArea),
    area: item.area,
    rooms: item.rooms ?? 1,
    floor: item.floor,
    image: item.image || item.images?.[0] || "/images/hero-bg.png",
    hasCityWater,
    hasWaterHauz,
    hasElectricity,
    hasHeating,
    hasSewerage,
    isFurnished,
    renovation: matchedRenovation,
    buildingType: item.buildingType || (item.propertyType === "Квартира" ? "Монолит / Кирпич" : "Кирпичный"),
    sellerType: item.sellerType || "Собственник",
    phone: item.phone || "+992 92 771 2233",
    whatsapp: item.whatsapp || "+992927712233",
    isNegotiable: Boolean(item.isNegotiable),
  };
}
