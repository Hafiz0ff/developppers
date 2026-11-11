/**
 * MASKANI.TJ — Core Listing Attributes Registry & Domain Service
 * Conforms to SPEC_CLASSIFIEDS_AD_PLACEMENT.md (v1.0, 10 Nov 2026)
 *
 * Implements Stage 1:
 * - Central Server Single Source of Truth for Listing Attributes
 * - Granular applicability by Deal Type (sale, rent_long, rent_daily) and Category (residential vs commercial)
 * - Strict type-safe schema definitions, ranges, units, and enums
 * - Trilingual labels (ru, tg, en) with zero foreign-language fallbacks
 * - Safe allowlisted iconKey mapping with fallback to 'info'
 * - Clean domain validators preventing IDOR, injection and unauthorized attribute pollution
 */

import { Language } from "@/lib/i18n/translations";

export type AttributeValueType = "boolean" | "integer" | "number" | "enum" | "text";

export interface LocalizedString {
  ru: string;
  tg: string;
  en: string;
}

export interface EnumOption {
  code: string;
  labels: LocalizedString;
  iconKey?: string;
}

export interface ListingSectionDefinition {
  code: string;
  labels: LocalizedString;
  sortOrder: number;
  targetGroup: "residential" | "commercial";
  appliesToDeals?: readonly string[]; // e.g. ["sale"] for legal section
}

export interface ListingAttributeDefinition {
  code: string;
  sectionCode: string;
  valueType: AttributeValueType;
  labels: LocalizedString;
  hint?: LocalizedString;
  iconKey: string;
  appliesTo: {
    deals: readonly string[];
    categories: readonly string[];
  };
  required: boolean;
  sortOrder: number;
  active: boolean;
  enumValues?: readonly EnumOption[];
  min?: number;
  max?: number;
  step?: number;
  unit?: LocalizedString;
}

export interface FormattedAttributeItem {
  code: string;
  label: string;
  value: unknown;
  displayValue: string;
  iconKey: string;
  unit?: string;
  valueType: AttributeValueType;
}

export interface FormattedSection {
  code: string;
  title: string;
  sortOrder: number;
  items: FormattedAttributeItem[];
}

export interface AttributeValidationResult {
  valid: boolean;
  errors: Record<string, string>;
  sanitizedValues: Record<string, unknown>;
}

// ============================================================================
// 1. ALLOWED ICON KEYS (Allowlist per TZ Section 4 & 8)
// ============================================================================

export const ALLOWED_ICON_KEYS = [
  "wifi",
  "heating",
  "washing-machine",
  "refrigerator",
  "cold-storage",
  "dishwasher",
  "stove",
  "air-conditioner",
  "pets",
  "child-friendly",
  "sofa",
  "tv",
  "smart-home",
  "elevator",
  "waste-chute",
  "concierge-bell",
  "barrier",
  "cctv",
  "construction-crane",
  "ceiling-height",
  "building-material",
  "parking-open",
  "parking-covered",
  "parking-underground",
  "parking",
  "stairs",
  "building-floors",
  "apartment-doors",
  "balcony",
  "bathroom",
  "paint-roller",
  "floor-plan",
  "children",
  "business-center",
  "building-class",
  "sprinkler",
  "fire-alarm",
  "ventilation",
  "plug",
  "water-tap",
  "security",
  "water-drop",
  "coffee",
  "cutlery",
  "serving-dish",
  "round-mirror",
  "pharmacy",
  "dumbbell",
  "bank",
  "presentation",
  "atm",
  "info",
] as const;

export type AllowedIconKey = (typeof ALLOWED_ICON_KEYS)[number];

export function sanitizeIconKey(key: string): AllowedIconKey {
  return (ALLOWED_ICON_KEYS as readonly string[]).includes(key)
    ? (key as AllowedIconKey)
    : "info";
}

// ============================================================================
// 2. CATEGORIES AND DEAL TYPES
// ============================================================================

export const RESIDENTIAL_CATEGORIES = [
  "apartment",
  "new_building_flat",
  "house",
  "land",
  "garage",
] as const;

export const COMMERCIAL_CATEGORIES = [
  "commercial",
  "office",
  "retail",
  "warehouse",
] as const;

export const ALL_DEAL_TYPES = ["sale", "rent_long", "rent_daily"] as const;

export function isResidentialCategory(cat: string): boolean {
  return (RESIDENTIAL_CATEGORIES as readonly string[]).includes(cat);
}

export function isCommercialCategory(cat: string): boolean {
  return (COMMERCIAL_CATEGORIES as readonly string[]).includes(cat);
}

// ============================================================================
// 3. SECTIONS REGISTRY
// ============================================================================

export const LISTING_SECTIONS: ListingSectionDefinition[] = [
  // Residential Sections
  {
    code: "amenities",
    labels: {
      ru: "Удобства и подробности",
      tg: "Мусоидатҳо ва тафсилот",
      en: "Amenities & Details",
    },
    sortOrder: 10,
    targetGroup: "residential",
  },
  {
    code: "building_info",
    labels: {
      ru: "О доме",
      tg: "Дар бораи бино",
      en: "About the Building",
    },
    sortOrder: 20,
    targetGroup: "residential",
  },
  {
    code: "unit_info",
    labels: {
      ru: "О квартире / помещении",
      tg: "Дар бораи манзил",
      en: "About the Property",
    },
    sortOrder: 30,
    targetGroup: "residential",
  },
  {
    code: "legal_info",
    labels: {
      ru: "Юридические особенности",
      tg: "Хусусиятҳои ҳуқуқӣ",
      en: "Legal Particulars",
    },
    sortOrder: 40,
    targetGroup: "residential",
    appliesToDeals: ["sale"], // Strictly for SALE only
  },

  // Commercial Sections
  {
    code: "commercial_building",
    labels: {
      ru: "О здании",
      tg: "Дар бораи бино",
      en: "About the Building",
    },
    sortOrder: 100,
    targetGroup: "commercial",
  },
  {
    code: "commercial_engineering",
    labels: {
      ru: "Инженерные системы и безопасность",
      tg: "Системаҳои муҳандисӣ ва амният",
      en: "Engineering & Security",
    },
    sortOrder: 110,
    targetGroup: "commercial",
  },
  {
    code: "commercial_infrastructure",
    labels: {
      ru: "Инфраструктура и удобства",
      tg: "Инфрасохтор ва мусоидатҳо",
      en: "Infrastructure & Amenities",
    },
    sortOrder: 120,
    targetGroup: "commercial",
  },
];

// ============================================================================
// 4. SHARED ENUM DEFINITIONS
// ============================================================================

export const ENUM_BUILDING_TYPES: readonly EnumOption[] = [
  {
    code: "brick",
    labels: { ru: "Кирпичный", tg: "Хиштӣ", en: "Brick" },
  },
  {
    code: "monolith",
    labels: { ru: "Монолитный", tg: "Монолитӣ", en: "Monolithic" },
  },
  {
    code: "panel",
    labels: { ru: "Панельный", tg: "Панелӣ", en: "Panel" },
  },
  {
    code: "brick_monolith",
    labels: { ru: "Кирпично-монолитный", tg: "Хиштию монолитӣ", en: "Brick-monolithic" },
  },
  {
    code: "pakhsa",
    labels: { ru: "Пахса (саман)", tg: "Похсагӣ", en: "Adobe" },
  },
  {
    code: "block",
    labels: { ru: "Блочный", tg: "Блокӣ", en: "Block" },
  },
  {
    code: "other",
    labels: { ru: "Другой", tg: "Дигар", en: "Other" },
  },
];

export const ENUM_BATHROOM_TYPES: readonly EnumOption[] = [
  {
    code: "combined",
    labels: { ru: "Совмещенный", tg: "Якҷоя", en: "Combined" },
  },
  {
    code: "separated",
    labels: { ru: "Раздельный", tg: "Ҷудогона", en: "Separated" },
  },
  {
    code: "multiple",
    labels: { ru: "Два и более", tg: "2 ва зиёда", en: "2+ bathrooms" },
  },
  {
    code: "outdoors",
    labels: { ru: "Во дворе (на улице)", tg: "Дар саҳни ҳавлӣ", en: "Outdoor" },
  },
];

export const ENUM_RENOVATION_TYPES: readonly EnumOption[] = [
  {
    code: "no_renovation",
    labels: { ru: "Без ремонта (черновая)", tg: "Бе таъмир (қуттӣ)", en: "No renovation (shell)" },
  },
  {
    code: "cosmetic",
    labels: { ru: "Косметический ремонт", tg: "Таъмири косметикӣ", en: "Cosmetic" },
  },
  {
    code: "euro",
    labels: { ru: "Евроремонт", tg: "Таъмири аврупоӣ", en: "Euro renovation" },
  },
  {
    code: "design",
    labels: { ru: "Дизайнерский ремонт", tg: "Таъмири дизайнӣ", en: "Designer" },
  },
  {
    code: "needs_renovation",
    labels: { ru: "Требует ремонта", tg: "Таъмирталаб", en: "Needs renovation" },
  },
];

export const ENUM_REDEVELOPMENT_STATUS: readonly EnumOption[] = [
  {
    code: "none",
    labels: { ru: "Нет перепланировки", tg: "Бе азнавбанақшагирӣ", en: "None" },
  },
  {
    code: "legalized",
    labels: { ru: "Узаконена", tg: "Қонунӣ гардонидашуда", en: "Legalized" },
  },
  {
    code: "not_legalized",
    labels: { ru: "Не узаконена", tg: "Ба расмият дароварда нашудааст", en: "Not legalized" },
  },
  {
    code: "unknown",
    labels: { ru: "Неизвестно", tg: "Номаълум", en: "Unknown" },
  },
];

export const ENUM_BUILDING_CLASSES: readonly EnumOption[] = [
  { code: "a_plus", labels: { ru: "Класс A+", tg: "Синфи A+", en: "Class A+" } },
  { code: "a", labels: { ru: "Класс A", tg: "Синфи A", en: "Class A" } },
  { code: "b_plus", labels: { ru: "Класс B+", tg: "Синфи B+", en: "Class B+" } },
  { code: "b", labels: { ru: "Класс B", tg: "Синфи B", en: "Class B" } },
  { code: "b_minus", labels: { ru: "Класс B-", tg: "Синфи B-", en: "Class B-" } },
  { code: "c", labels: { ru: "Класс C", tg: "Синфи C", en: "Class C" } },
];

export const ENUM_VENTILATION_TYPES: readonly EnumOption[] = [
  { code: "natural", labels: { ru: "Естественная", tg: "Табиӣ", en: "Natural" } },
  { code: "supply_exhaust", labels: { ru: "Приточно-вытяжная", tg: "Шамолдиҳии кашишӣ", en: "Supply & exhaust" } },
  { code: "central", labels: { ru: "Центральное кондиционирование", tg: "Шамолдиҳии марказӣ", en: "Central" } },
  { code: "none", labels: { ru: "Отсутствует", tg: "Мавҷуд нест", en: "None" } },
];

// ============================================================================
// 5. ATTRIBUTES DEFINITIONS REGISTRY (Sections 4.1 - 4.7)
// ============================================================================

export const LISTING_ATTRIBUTES: ListingAttributeDefinition[] = [
  // --------------------------------------------------------------------------
  // 4.1. Жилой объект: блок «Удобства и подробности» (amenities)
  // --------------------------------------------------------------------------
  {
    code: "wifi",
    sectionCode: "amenities",
    valueType: "boolean",
    labels: { ru: "Интернет (Wi-Fi)", tg: "Интернет (Wi-Fi)", en: "Internet (Wi-Fi)" },
    iconKey: "wifi",
    appliesTo: { deals: ALL_DEAL_TYPES, categories: RESIDENTIAL_CATEGORIES },
    required: false,
    sortOrder: 10,
    active: true,
  },
  {
    code: "heating",
    sectionCode: "amenities",
    valueType: "boolean",
    labels: { ru: "Отопление", tg: "Гармидиҳӣ", en: "Heating" },
    iconKey: "heating",
    appliesTo: { deals: ALL_DEAL_TYPES, categories: RESIDENTIAL_CATEGORIES },
    required: false,
    sortOrder: 20,
    active: true,
  },
  {
    code: "washing_machine",
    sectionCode: "amenities",
    valueType: "boolean",
    labels: { ru: "Стиральная машина", tg: "Мошини либосшӯйӣ", en: "Washing machine" },
    iconKey: "washing-machine",
    appliesTo: { deals: ALL_DEAL_TYPES, categories: RESIDENTIAL_CATEGORIES },
    required: false,
    sortOrder: 30,
    active: true,
  },
  {
    code: "refrigerator",
    sectionCode: "amenities",
    valueType: "boolean",
    labels: { ru: "Холодильник", tg: "Яхдон", en: "Refrigerator" },
    iconKey: "refrigerator",
    appliesTo: { deals: ALL_DEAL_TYPES, categories: RESIDENTIAL_CATEGORIES },
    required: false,
    sortOrder: 40,
    active: true,
  },
  {
    code: "dishwasher",
    sectionCode: "amenities",
    valueType: "boolean",
    labels: { ru: "Посудомоечная машина", tg: "Мошини зарфшӯйӣ", en: "Dishwasher" },
    iconKey: "dishwasher",
    appliesTo: { deals: ALL_DEAL_TYPES, categories: RESIDENTIAL_CATEGORIES },
    required: false,
    sortOrder: 50,
    active: true,
  },
  {
    code: "kitchen_furniture",
    sectionCode: "amenities",
    valueType: "boolean",
    labels: { ru: "Мебель на кухне", tg: "Мебели ошхона", en: "Kitchen furniture" },
    iconKey: "stove",
    appliesTo: { deals: ALL_DEAL_TYPES, categories: RESIDENTIAL_CATEGORIES },
    required: false,
    sortOrder: 60,
    active: true,
  },
  {
    code: "air_conditioner",
    sectionCode: "amenities",
    valueType: "boolean",
    labels: { ru: "Кондиционер", tg: "Кондитсионер", en: "Air conditioner" },
    iconKey: "air-conditioner",
    appliesTo: { deals: ALL_DEAL_TYPES, categories: RESIDENTIAL_CATEGORIES },
    required: false,
    sortOrder: 70,
    active: true,
  },
  {
    code: "pets_allowed",
    sectionCode: "amenities",
    valueType: "boolean",
    labels: { ru: "Можно с животными", tg: "Бо ҳайвоноти хонагӣ мумкин аст", en: "Pets allowed" },
    iconKey: "pets",
    appliesTo: { deals: ALL_DEAL_TYPES, categories: RESIDENTIAL_CATEGORIES },
    required: false,
    sortOrder: 80,
    active: true,
  },
  {
    code: "children_allowed",
    sectionCode: "amenities",
    valueType: "boolean",
    labels: { ru: "Можно с детьми", tg: "Бо кӯдакон мумкин аст", en: "Children friendly" },
    iconKey: "child-friendly",
    appliesTo: { deals: ALL_DEAL_TYPES, categories: RESIDENTIAL_CATEGORIES },
    required: false,
    sortOrder: 90,
    active: true,
  },
  {
    code: "furnished",
    sectionCode: "amenities",
    valueType: "boolean",
    labels: { ru: "Мебель в комнатах", tg: "Мебел дар ҳуҷраҳо", en: "Furnished rooms" },
    iconKey: "sofa",
    appliesTo: { deals: ALL_DEAL_TYPES, categories: RESIDENTIAL_CATEGORIES },
    required: false,
    sortOrder: 100,
    active: true,
  },
  {
    code: "tv",
    sectionCode: "amenities",
    valueType: "boolean",
    labels: { ru: "Телевизор", tg: "Телевизор", en: "TV" },
    iconKey: "tv",
    appliesTo: { deals: ALL_DEAL_TYPES, categories: RESIDENTIAL_CATEGORIES },
    required: false,
    sortOrder: 110,
    active: true,
  },
  {
    code: "smart_home",
    sectionCode: "amenities",
    valueType: "boolean",
    labels: { ru: "Умный дом", tg: "Хонаи ҳушманд", en: "Smart home" },
    iconKey: "smart-home",
    appliesTo: { deals: ALL_DEAL_TYPES, categories: RESIDENTIAL_CATEGORIES },
    required: false,
    sortOrder: 120,
    active: true,
  },
  {
    code: "elevators_count",
    sectionCode: "amenities",
    valueType: "integer",
    labels: { ru: "Количество лифтов", tg: "Шумораи лифтҳо", en: "Elevators count" },
    iconKey: "elevator",
    appliesTo: { deals: ALL_DEAL_TYPES, categories: ["apartment", "new_building_flat"] },
    required: false,
    min: 0,
    max: 10,
    sortOrder: 130,
    active: true,
  },
  {
    code: "waste_chute",
    sectionCode: "amenities",
    valueType: "boolean",
    labels: { ru: "Мусоропровод", tg: "Партовгоҳи дохилӣ", en: "Waste chute" },
    iconKey: "waste-chute",
    appliesTo: { deals: ALL_DEAL_TYPES, categories: ["apartment", "new_building_flat"] },
    required: false,
    sortOrder: 140,
    active: true,
  },
  {
    code: "concierge",
    sectionCode: "amenities",
    valueType: "boolean",
    labels: { ru: "Консьерж", tg: "Консерж (посбон)", en: "Concierge" },
    iconKey: "concierge-bell",
    appliesTo: { deals: ALL_DEAL_TYPES, categories: ["apartment", "new_building_flat"] },
    required: false,
    sortOrder: 150,
    active: true,
  },
  {
    code: "gated_area",
    sectionCode: "amenities",
    valueType: "boolean",
    labels: { ru: "Закрытая территория", tg: "Ҳудуди пӯшида", en: "Gated territory" },
    iconKey: "barrier",
    appliesTo: { deals: ALL_DEAL_TYPES, categories: RESIDENTIAL_CATEGORIES },
    required: false,
    sortOrder: 160,
    active: true,
  },
  {
    code: "cctv",
    sectionCode: "amenities",
    valueType: "boolean",
    labels: { ru: "Видеонаблюдение", tg: "Назорати видеоӣ", en: "CCTV" },
    iconKey: "cctv",
    appliesTo: { deals: ALL_DEAL_TYPES, categories: RESIDENTIAL_CATEGORIES },
    required: false,
    sortOrder: 170,
    active: true,
  },

  // --------------------------------------------------------------------------
  // 4.2. Жилой объект: блок «О доме» (building_info)
  // --------------------------------------------------------------------------
  {
    code: "built_year",
    sectionCode: "building_info",
    valueType: "integer",
    labels: { ru: "Год постройки", tg: "Соли сохтмон", en: "Built year" },
    iconKey: "construction-crane",
    appliesTo: { deals: ALL_DEAL_TYPES, categories: RESIDENTIAL_CATEGORIES },
    required: false,
    min: 1800,
    max: 2036,
    sortOrder: 10,
    active: true,
  },
  {
    code: "ceiling_height",
    sectionCode: "building_info",
    valueType: "number",
    labels: { ru: "Высота потолков", tg: "Баландии шифт", en: "Ceiling height" },
    iconKey: "ceiling-height",
    appliesTo: { deals: ALL_DEAL_TYPES, categories: RESIDENTIAL_CATEGORIES },
    required: false,
    min: 1.5,
    max: 10.0,
    step: 0.01,
    unit: { ru: "м", tg: "м", en: "m" },
    sortOrder: 20,
    active: true,
  },
  {
    code: "building_type",
    sectionCode: "building_info",
    valueType: "enum",
    labels: { ru: "Тип дома", tg: "Намуди бино", en: "Building type" },
    iconKey: "building-material",
    appliesTo: { deals: ALL_DEAL_TYPES, categories: RESIDENTIAL_CATEGORIES },
    required: false,
    enumValues: ENUM_BUILDING_TYPES,
    sortOrder: 30,
    active: true,
  },
  {
    code: "parking_open",
    sectionCode: "building_info",
    valueType: "boolean",
    labels: { ru: "Открытая парковка", tg: "Таваққуфгоҳи кушода", en: "Open parking" },
    iconKey: "parking-open",
    appliesTo: { deals: ALL_DEAL_TYPES, categories: RESIDENTIAL_CATEGORIES },
    required: false,
    sortOrder: 40,
    active: true,
  },
  {
    code: "parking_covered",
    sectionCode: "building_info",
    valueType: "boolean",
    labels: { ru: "Крытая парковка", tg: "Таваққуфгоҳи пӯшида", en: "Covered parking" },
    iconKey: "parking-covered",
    appliesTo: { deals: ALL_DEAL_TYPES, categories: RESIDENTIAL_CATEGORIES },
    required: false,
    sortOrder: 50,
    active: true,
  },
  {
    code: "parking_underground",
    sectionCode: "building_info",
    valueType: "boolean",
    labels: { ru: "Подземная парковка", tg: "Таваққуфгоҳи зеризаминӣ", en: "Underground parking" },
    iconKey: "parking-underground",
    appliesTo: { deals: ALL_DEAL_TYPES, categories: RESIDENTIAL_CATEGORIES },
    required: false,
    sortOrder: 60,
    active: true,
  },

  // --------------------------------------------------------------------------
  // 4.3. Жилой объект: блок «О квартире / помещении» (unit_info)
  // --------------------------------------------------------------------------
  {
    code: "floor",
    sectionCode: "unit_info",
    valueType: "integer",
    labels: { ru: "Этаж", tg: "Ошёна", en: "Floor" },
    iconKey: "stairs",
    appliesTo: { deals: ALL_DEAL_TYPES, categories: ["apartment", "new_building_flat"] },
    required: false,
    min: 0,
    max: 100,
    sortOrder: 10,
    active: true,
  },
  {
    code: "floors_count",
    sectionCode: "unit_info",
    valueType: "integer",
    labels: { ru: "Этажность дома", tg: "Ошёнагии бино", en: "Total floors" },
    iconKey: "building-floors",
    appliesTo: { deals: ALL_DEAL_TYPES, categories: RESIDENTIAL_CATEGORIES },
    required: false,
    min: 1,
    max: 100,
    sortOrder: 20,
    active: true,
  },
  {
    code: "apartments_count",
    sectionCode: "unit_info",
    valueType: "integer",
    labels: { ru: "Квартир на этаже / в доме", tg: "Шумораи хонаҳо дар ошёна", en: "Apartments count" },
    iconKey: "apartment-doors",
    appliesTo: { deals: ALL_DEAL_TYPES, categories: ["apartment", "new_building_flat"] },
    required: false,
    min: 1,
    max: 1000,
    sortOrder: 30,
    active: true,
  },
  {
    code: "balconies_count",
    sectionCode: "unit_info",
    valueType: "integer",
    labels: { ru: "Балконы / лоджии", tg: "Балконҳо / айвонҳо", en: "Balconies" },
    iconKey: "balcony",
    appliesTo: { deals: ALL_DEAL_TYPES, categories: ["apartment", "new_building_flat", "house"] },
    required: false,
    min: 0,
    max: 10,
    sortOrder: 40,
    active: true,
  },
  {
    code: "bathroom_type",
    sectionCode: "unit_info",
    valueType: "enum",
    labels: { ru: "Санузел", tg: "Ҳаммом ва ҳоҷатхона", en: "Bathroom" },
    iconKey: "bathroom",
    appliesTo: { deals: ALL_DEAL_TYPES, categories: RESIDENTIAL_CATEGORIES },
    required: false,
    enumValues: ENUM_BATHROOM_TYPES,
    sortOrder: 50,
    active: true,
  },
  {
    code: "renovation_type",
    sectionCode: "unit_info",
    valueType: "enum",
    labels: { ru: "Ремонт", tg: "Таъмир", en: "Renovation" },
    iconKey: "paint-roller",
    appliesTo: { deals: ALL_DEAL_TYPES, categories: RESIDENTIAL_CATEGORIES },
    required: false,
    enumValues: ENUM_RENOVATION_TYPES,
    sortOrder: 60,
    active: true,
  },
  {
    code: "redevelopment_status",
    sectionCode: "unit_info",
    valueType: "enum",
    labels: { ru: "Перепланировка", tg: "Азнавбанақшагирӣ", en: "Redevelopment" },
    iconKey: "floor-plan",
    appliesTo: { deals: ALL_DEAL_TYPES, categories: RESIDENTIAL_CATEGORIES },
    required: false,
    enumValues: ENUM_REDEVELOPMENT_STATUS,
    sortOrder: 70,
    active: true,
  },

  // --------------------------------------------------------------------------
  // 4.4. Жилой объект: блок «Юридические особенности» (legal_info)
  // Применимость: строго SALE, только жилая недвижимость
  // --------------------------------------------------------------------------
  {
    code: "minor_owners",
    sectionCode: "legal_info",
    valueType: "boolean",
    labels: {
      ru: "Несовершеннолетние собственники",
      tg: "Моликони ба балоғат нарасида",
      en: "Minor co-owners",
    },
    hint: {
      ru: "Информация заявлена продавцом и подлежит проверке при оформлении сделки",
      tg: "Маълумот аз ҷониби фурӯшанда пешниҳод шудааст ва ҳангоми бастани шартнома бояд тафтиш шавад",
      en: "Self-declared by seller; requires verification prior to transaction",
    },
    iconKey: "children",
    appliesTo: {
      deals: ["sale"], // Strictly SALE only!
      categories: RESIDENTIAL_CATEGORIES,
    },
    required: false,
    sortOrder: 10,
    active: true,
  },

  // --------------------------------------------------------------------------
  // 4.5. Коммерческий объект: блок «О здании» (commercial_building)
  // --------------------------------------------------------------------------
  {
    code: "comm_built_year",
    sectionCode: "commercial_building",
    valueType: "integer",
    labels: { ru: "Год постройки", tg: "Соли сохтмон", en: "Built year" },
    iconKey: "construction-crane",
    appliesTo: { deals: ALL_DEAL_TYPES, categories: COMMERCIAL_CATEGORIES },
    required: false,
    min: 1800,
    max: 2036,
    sortOrder: 10,
    active: true,
  },
  {
    code: "is_in_business_center",
    sectionCode: "commercial_building",
    valueType: "boolean",
    labels: { ru: "В бизнес-центре / ТЦ", tg: "Дар маркази тиҷоратӣ", en: "In business center" },
    iconKey: "business-center",
    appliesTo: { deals: ALL_DEAL_TYPES, categories: COMMERCIAL_CATEGORIES },
    required: false,
    sortOrder: 20,
    active: true,
  },
  {
    code: "business_center_name",
    sectionCode: "commercial_building",
    valueType: "text",
    labels: { ru: "Название БЦ / ТЦ", tg: "Номи маркази тиҷоратӣ", en: "Business center name" },
    iconKey: "business-center",
    appliesTo: { deals: ALL_DEAL_TYPES, categories: COMMERCIAL_CATEGORIES },
    required: false,
    sortOrder: 25,
    active: true,
  },
  {
    code: "building_class",
    sectionCode: "commercial_building",
    valueType: "enum",
    labels: { ru: "Класс здания", tg: "Синфи бино", en: "Building class" },
    iconKey: "building-class",
    appliesTo: { deals: ALL_DEAL_TYPES, categories: COMMERCIAL_CATEGORIES },
    required: false,
    enumValues: ENUM_BUILDING_CLASSES,
    sortOrder: 30,
    active: true,
  },
  {
    code: "comm_floors_count",
    sectionCode: "commercial_building",
    valueType: "integer",
    labels: { ru: "Этажность здания", tg: "Ошёнагии бино", en: "Total floors" },
    iconKey: "stairs",
    appliesTo: { deals: ALL_DEAL_TYPES, categories: COMMERCIAL_CATEGORIES },
    required: false,
    min: 1,
    max: 100,
    sortOrder: 40,
    active: true,
  },
  {
    code: "comm_ceiling_height",
    sectionCode: "commercial_building",
    valueType: "number",
    labels: { ru: "Высота потолков", tg: "Баландии шифт", en: "Ceiling height" },
    iconKey: "ceiling-height",
    appliesTo: { deals: ALL_DEAL_TYPES, categories: COMMERCIAL_CATEGORIES },
    required: false,
    min: 1.5,
    max: 15.0,
    step: 0.01,
    unit: { ru: "м", tg: "м", en: "m" },
    sortOrder: 50,
    active: true,
  },
  {
    code: "comm_building_type",
    sectionCode: "commercial_building",
    valueType: "enum",
    labels: { ru: "Тип здания", tg: "Намуди бино", en: "Building type" },
    iconKey: "building-material",
    appliesTo: { deals: ALL_DEAL_TYPES, categories: COMMERCIAL_CATEGORIES },
    required: false,
    enumValues: ENUM_BUILDING_TYPES,
    sortOrder: 60,
    active: true,
  },

  // --------------------------------------------------------------------------
  // 4.6. Коммерческий объект: блок «Инженерные системы и безопасность»
  // --------------------------------------------------------------------------
  {
    code: "fire_extinguishing",
    sectionCode: "commercial_engineering",
    valueType: "boolean",
    labels: { ru: "Система пожаротушения", tg: "Системаи сӯхторхомушкунӣ", en: "Fire extinguishing" },
    iconKey: "sprinkler",
    appliesTo: { deals: ALL_DEAL_TYPES, categories: COMMERCIAL_CATEGORIES },
    required: false,
    sortOrder: 10,
    active: true,
  },
  {
    code: "fire_alarm",
    sectionCode: "commercial_engineering",
    valueType: "boolean",
    labels: { ru: "Пожарная сигнализация", tg: "Огоҳии сӯхтор", en: "Fire alarm" },
    iconKey: "fire-alarm",
    appliesTo: { deals: ALL_DEAL_TYPES, categories: COMMERCIAL_CATEGORIES },
    required: false,
    sortOrder: 20,
    active: true,
  },
  {
    code: "ventilation_type",
    sectionCode: "commercial_engineering",
    valueType: "enum",
    labels: { ru: "Вентиляция", tg: "Вентилятсия", en: "Ventilation" },
    iconKey: "ventilation",
    appliesTo: { deals: ALL_DEAL_TYPES, categories: COMMERCIAL_CATEGORIES },
    required: false,
    enumValues: ENUM_VENTILATION_TYPES,
    sortOrder: 30,
    active: true,
  },
  {
    code: "comm_air_conditioner",
    sectionCode: "commercial_engineering",
    valueType: "boolean",
    labels: { ru: "Кондиционирование", tg: "Кондитсионеркунӣ", en: "Air conditioning" },
    iconKey: "air-conditioner",
    appliesTo: { deals: ALL_DEAL_TYPES, categories: COMMERCIAL_CATEGORIES },
    required: false,
    sortOrder: 40,
    active: true,
  },
  {
    code: "cold_storage",
    sectionCode: "commercial_engineering",
    valueType: "boolean",
    labels: {
      ru: "Холодильные камеры",
      tg: "Камераҳои хунуккунӣ",
      en: "Cold storage",
    },
    iconKey: "cold-storage",
    appliesTo: { deals: ALL_DEAL_TYPES, categories: COMMERCIAL_CATEGORIES },
    required: false,
    sortOrder: 45,
    active: true,
  },
  {
    code: "comm_elevators_count",
    sectionCode: "commercial_engineering",
    valueType: "integer",
    labels: { ru: "Лифты и подъемники", tg: "Лифтҳо ва борбардорҳо", en: "Elevators & lifts" },
    iconKey: "elevator",
    appliesTo: { deals: ALL_DEAL_TYPES, categories: COMMERCIAL_CATEGORIES },
    required: false,
    min: 0,
    max: 20,
    sortOrder: 50,
    active: true,
  },
  {
    code: "electricity_power_kwt",
    sectionCode: "commercial_engineering",
    valueType: "number",
    labels: { ru: "Электрическая мощность", tg: "Иқтидори барқ", en: "Power capacity" },
    iconKey: "plug",
    appliesTo: { deals: ALL_DEAL_TYPES, categories: COMMERCIAL_CATEGORIES },
    required: false,
    min: 1,
    max: 5000,
    unit: { ru: "кВт", tg: "кВт", en: "kW" },
    sortOrder: 60,
    active: true,
  },
  {
    code: "comm_internet",
    sectionCode: "commercial_engineering",
    valueType: "boolean",
    labels: { ru: "Оптоволоконный интернет", tg: "Интернети оптикӣ", en: "Fiber optic internet" },
    iconKey: "wifi",
    appliesTo: { deals: ALL_DEAL_TYPES, categories: COMMERCIAL_CATEGORIES },
    required: false,
    sortOrder: 70,
    active: true,
  },
  {
    code: "comm_water_supply",
    sectionCode: "commercial_engineering",
    valueType: "boolean",
    labels: { ru: "Водоснабжение", tg: "Обтаъминкунӣ", en: "Water supply" },
    iconKey: "water-tap",
    appliesTo: { deals: ALL_DEAL_TYPES, categories: COMMERCIAL_CATEGORIES },
    required: false,
    sortOrder: 80,
    active: true,
  },
  {
    code: "comm_gated_area",
    sectionCode: "commercial_engineering",
    valueType: "boolean",
    labels: { ru: "Охраняемая территория", tg: "Ҳудуди муҳофизатшаванда", en: "Secured territory" },
    iconKey: "barrier",
    appliesTo: { deals: ALL_DEAL_TYPES, categories: COMMERCIAL_CATEGORIES },
    required: false,
    sortOrder: 90,
    active: true,
  },
  {
    code: "comm_cctv",
    sectionCode: "commercial_engineering",
    valueType: "boolean",
    labels: { ru: "Видеонаблюдение", tg: "Назорати видеоӣ", en: "CCTV" },
    iconKey: "cctv",
    appliesTo: { deals: ALL_DEAL_TYPES, categories: COMMERCIAL_CATEGORIES },
    required: false,
    sortOrder: 100,
    active: true,
  },
  {
    code: "security_guard",
    sectionCode: "commercial_engineering",
    valueType: "boolean",
    labels: { ru: "Круглосуточная охрана", tg: "Посбони шабонарӯзӣ", en: "24/7 Security" },
    iconKey: "security",
    appliesTo: { deals: ALL_DEAL_TYPES, categories: COMMERCIAL_CATEGORIES },
    required: false,
    sortOrder: 110,
    active: true,
  },
  {
    code: "water_softener",
    sectionCode: "commercial_engineering",
    valueType: "boolean",
    labels: { ru: "Фильтрация / умягчение воды", tg: "Тозакунии об", en: "Water filtration/softener" },
    iconKey: "water-drop",
    appliesTo: { deals: ALL_DEAL_TYPES, categories: COMMERCIAL_CATEGORIES },
    required: false,
    sortOrder: 120,
    active: true,
  },
  {
    code: "reception",
    sectionCode: "commercial_engineering",
    valueType: "boolean",
    labels: { ru: "Зона ресепшн", tg: "Минтақаи ресепшн", en: "Reception desk" },
    iconKey: "concierge-bell",
    appliesTo: { deals: ALL_DEAL_TYPES, categories: COMMERCIAL_CATEGORIES },
    required: false,
    sortOrder: 130,
    active: true,
  },

  // --------------------------------------------------------------------------
  // 4.7. Коммерческий объект: блок «Инфраструктура и удобства»
  // --------------------------------------------------------------------------
  {
    code: "cafe",
    sectionCode: "commercial_infrastructure",
    valueType: "boolean",
    labels: { ru: "Кафе", tg: "Қаҳвахона", en: "Cafe" },
    iconKey: "coffee",
    appliesTo: { deals: ALL_DEAL_TYPES, categories: COMMERCIAL_CATEGORIES },
    required: false,
    sortOrder: 10,
    active: true,
  },
  {
    code: "canteen",
    sectionCode: "commercial_infrastructure",
    valueType: "boolean",
    labels: { ru: "Столовая", tg: "Ошхона", en: "Canteen" },
    iconKey: "cutlery",
    appliesTo: { deals: ALL_DEAL_TYPES, categories: COMMERCIAL_CATEGORIES },
    required: false,
    sortOrder: 20,
    active: true,
  },
  {
    code: "restaurant",
    sectionCode: "commercial_infrastructure",
    valueType: "boolean",
    labels: { ru: "Ресторан", tg: "Тарабхона", en: "Restaurant" },
    iconKey: "serving-dish",
    appliesTo: { deals: ALL_DEAL_TYPES, categories: COMMERCIAL_CATEGORIES },
    required: false,
    sortOrder: 30,
    active: true,
  },
  {
    code: "beauty_salon",
    sectionCode: "commercial_infrastructure",
    valueType: "boolean",
    labels: { ru: "Салон красоты", tg: "Салони ҳусн", en: "Beauty salon" },
    iconKey: "round-mirror",
    appliesTo: { deals: ALL_DEAL_TYPES, categories: COMMERCIAL_CATEGORIES },
    required: false,
    sortOrder: 40,
    active: true,
  },
  {
    code: "pharmacy",
    sectionCode: "commercial_infrastructure",
    valueType: "boolean",
    labels: { ru: "Аптека", tg: "Дорухона", en: "Pharmacy" },
    iconKey: "pharmacy",
    appliesTo: { deals: ALL_DEAL_TYPES, categories: COMMERCIAL_CATEGORIES },
    required: false,
    sortOrder: 50,
    active: true,
  },
  {
    code: "fitness",
    sectionCode: "commercial_infrastructure",
    valueType: "boolean",
    labels: { ru: "Фитнес-клуб / спортзал", tg: "Клуби фитнес", en: "Fitness gym" },
    iconKey: "dumbbell",
    appliesTo: { deals: ALL_DEAL_TYPES, categories: COMMERCIAL_CATEGORIES },
    required: false,
    sortOrder: 60,
    active: true,
  },
  {
    code: "bank_branch",
    sectionCode: "commercial_infrastructure",
    valueType: "boolean",
    labels: { ru: "Отделение банка", tg: "Шӯъбаи бонк", en: "Bank branch" },
    iconKey: "bank",
    appliesTo: { deals: ALL_DEAL_TYPES, categories: COMMERCIAL_CATEGORIES },
    required: false,
    sortOrder: 70,
    active: true,
  },
  {
    code: "conference_hall",
    sectionCode: "commercial_infrastructure",
    valueType: "boolean",
    labels: { ru: "Конференц-залы", tg: "Толорҳои конфронс", en: "Conference halls" },
    iconKey: "presentation",
    appliesTo: { deals: ALL_DEAL_TYPES, categories: COMMERCIAL_CATEGORIES },
    required: false,
    sortOrder: 80,
    active: true,
  },
  {
    code: "atm",
    sectionCode: "commercial_infrastructure",
    valueType: "boolean",
    labels: { ru: "Банкомат", tg: "Банкомат", en: "ATM" },
    iconKey: "atm",
    appliesTo: { deals: ALL_DEAL_TYPES, categories: COMMERCIAL_CATEGORIES },
    required: false,
    sortOrder: 90,
    active: true,
  },
  {
    code: "comm_parking_open",
    sectionCode: "commercial_infrastructure",
    valueType: "boolean",
    labels: { ru: "Открытая гостевая парковка", tg: "Таваққуфгоҳи кушодаи меҳмонон", en: "Open guest parking" },
    iconKey: "parking-open",
    appliesTo: { deals: ALL_DEAL_TYPES, categories: COMMERCIAL_CATEGORIES },
    required: false,
    sortOrder: 100,
    active: true,
  },
  {
    code: "comm_parking_covered",
    sectionCode: "commercial_infrastructure",
    valueType: "boolean",
    labels: { ru: "Крытая парковка", tg: "Таваққуфгоҳи пӯшида", en: "Covered parking" },
    iconKey: "parking-covered",
    appliesTo: { deals: ALL_DEAL_TYPES, categories: COMMERCIAL_CATEGORIES },
    required: false,
    sortOrder: 110,
    active: true,
  },
  {
    code: "comm_parking_underground",
    sectionCode: "commercial_infrastructure",
    valueType: "boolean",
    labels: { ru: "Подземная парковка", tg: "Таваққуфгоҳи зеризаминӣ", en: "Underground parking" },
    iconKey: "parking-underground",
    appliesTo: { deals: ALL_DEAL_TYPES, categories: COMMERCIAL_CATEGORIES },
    required: false,
    sortOrder: 120,
    active: true,
  },
];

// In-memory active attributes map (can be modified by super-admin archival operations)
const attributesRegistry = new Map<string, ListingAttributeDefinition>(
  LISTING_ATTRIBUTES.map((attr) => [attr.code, { ...attr }])
);

// ============================================================================
// 6. DOMAIN QUERY FUNCTIONS
// ============================================================================

export function getAllSections(): readonly ListingSectionDefinition[] {
  return [...LISTING_SECTIONS].sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getSectionByCode(sectionCode: string): ListingSectionDefinition | undefined {
  return LISTING_SECTIONS.find((s) => s.code === sectionCode);
}

/**
 * Returns sections that apply to the specified dealType and category.
 * Strictly enforces:
 * - legal_info is only returned for sale
 * - residential sections only for residential categories
 * - commercial sections only for commercial categories
 */
export function getApplicableSections(
  dealType: string,
  category: string
): ListingSectionDefinition[] {
  const isRes = isResidentialCategory(category);
  const isComm = isCommercialCategory(category);

  return getAllSections().filter((section) => {
    // Target group match
    if (isRes && section.targetGroup !== "residential") return false;
    if (isComm && section.targetGroup !== "commercial") return false;
    if (!isRes && !isComm && section.targetGroup !== "residential") return false;

    // Deal applicability (e.g. legal_info is only for sale)
    if (section.appliesToDeals && !section.appliesToDeals.includes(dealType)) {
      return false;
    }

    return true;
  });
}

export function getAllAttributes(): ListingAttributeDefinition[] {
  return Array.from(attributesRegistry.values()).sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getAttributeByCode(code: string): ListingAttributeDefinition | undefined {
  return attributesRegistry.get(code);
}

/**
 * Returns all active attributes applicable to a given dealType and category.
 */
export function getApplicableAttributes(
  dealType: string,
  category: string
): ListingAttributeDefinition[] {
  const applicableSections = new Set(
    getApplicableSections(dealType, category).map((s) => s.code)
  );

  return getAllAttributes().filter((attr) => {
    if (!attr.active) return false;
    if (!applicableSections.has(attr.sectionCode)) return false;
    if (!attr.appliesTo.deals.includes(dealType)) return false;
    if (!attr.appliesTo.categories.includes(category)) return false;
    return true;
  });
}

/**
 * Super-Admin operation: archives (deactivates) an attribute definition.
 * Per TZ Section 5.5, historical data is never erased; the attribute merely
 * ceases to be shown in new creation forms and active displays.
 */
export function archiveAttributeDefinition(code: string): boolean {
  const attr = attributesRegistry.get(code);
  if (!attr) return false;
  attr.active = false;
  return true;
}

export function restoreAttributeDefinition(code: string): boolean {
  const attr = attributesRegistry.get(code);
  if (!attr) return false;
  attr.active = true;
  return true;
}

// ============================================================================
// 7. STRICT SERVER-SIDE VALIDATOR (TZ Section 7.2)
// ============================================================================

/**
 * Validates raw user input values against the applicable attributes matrix.
 * Enforces:
 * - Rejection of unknown / unlisted attributes
 * - Rejection of inactive attributes
 * - Rejection of inapplicable attributes (e.g. legal fields on rental)
 * - Strict type checking (boolean, integer, number, enum, text)
 * - Numerical ranges (min, max) and integer bounds
 * - Sanitization and stripping of unauthorized keys
 */
export function validateAttributeValues(
  dealType: string,
  category: string,
  rawValues: Record<string, unknown> | null | undefined
): AttributeValidationResult {
  const errors: Record<string, string> = {};
  const sanitizedValues: Record<string, unknown> = {};

  if (!rawValues || typeof rawValues !== "object") {
    return { valid: true, errors: {}, sanitizedValues: {} };
  }

  const applicableAttrs = getApplicableAttributes(dealType, category);
  const applicableMap = new Map<string, ListingAttributeDefinition>(
    applicableAttrs.map((a) => [a.code, a])
  );

  // Check for unauthorized / unapplicable keys passed in payload
  for (const [key, value] of Object.entries(rawValues)) {
    // Ignore nullish or undefined values
    if (value === null || value === undefined || value === "") {
      continue;
    }

    const definition = applicableMap.get(key);
    if (!definition) {
      // Key is either completely unknown, inactive, or not applicable to this deal/category
      const globalDef = attributesRegistry.get(key);
      if (globalDef) {
        if (!globalDef.active) {
          errors[key] = `Атрибут '${key}' деактивирован`;
        } else if (!globalDef.appliesTo.deals.includes(dealType)) {
          errors[key] = `Атрибут '${key}' неприменим к сделке '${dealType}'`;
        } else if (!globalDef.appliesTo.categories.includes(category)) {
          errors[key] = `Атрибут '${key}' неприменим к категории '${category}'`;
        } else {
          errors[key] = `Атрибут '${key}' недоступен в данной секции`;
        }
      } else {
        errors[key] = `Неизвестный код атрибута '${key}'`;
      }
      continue;
    }

    // Validate type and bounds
    switch (definition.valueType) {
      case "boolean": {
        if (typeof value !== "boolean") {
          errors[key] = `Значение должно быть логическим (true/false)`;
        } else {
          sanitizedValues[key] = value;
        }
        break;
      }

      case "integer": {
        const num = typeof value === "number" ? value : Number(value);
        if (isNaN(num) || !Number.isInteger(num)) {
          errors[key] = `Значение должно быть целым числом`;
        } else if (definition.min !== undefined && num < definition.min) {
          errors[key] = `Значение не может быть меньше ${definition.min}`;
        } else if (definition.max !== undefined && num > definition.max) {
          errors[key] = `Значение не может превышать ${definition.max}`;
        } else {
          sanitizedValues[key] = num;
        }
        break;
      }

      case "number": {
        const num = typeof value === "number" ? value : Number(value);
        if (isNaN(num)) {
          errors[key] = `Значение должно быть числом`;
        } else if (definition.min !== undefined && num < definition.min) {
          errors[key] = `Значение не может быть меньше ${definition.min}`;
        } else if (definition.max !== undefined && num > definition.max) {
          errors[key] = `Значение не может превышать ${definition.max}`;
        } else {
          sanitizedValues[key] = num;
        }
        break;
      }

      case "enum": {
        const strVal = String(value);
        const validCodes = (definition.enumValues || []).map((e) => e.code);
        if (!validCodes.includes(strVal)) {
          errors[key] = `Недопустимое значение. Разрешены: ${validCodes.join(", ")}`;
        } else {
          sanitizedValues[key] = strVal;
        }
        break;
      }

      case "text": {
        const textVal = String(value).trim();
        if (textVal.length > 200) {
          errors[key] = `Длина текста не может превышать 200 символов`;
        } else {
          sanitizedValues[key] = textVal;
        }
        break;
      }
    }
  }

  // Check required fields
  for (const attr of applicableAttrs) {
    if (attr.required && (sanitizedValues[attr.code] === undefined || sanitizedValues[attr.code] === null)) {
      errors[attr.code] = `Поле '${attr.labels.ru}' обязательно для заполнения`;
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    sanitizedValues,
  };
}

// ============================================================================
// 8. CARD PRESENTATION FORMATTER (TZ Section 5.4)
// ============================================================================

/**
 * Formats structured attributes for display on the public listing card or detail view.
 * Rules:
 * - Groups by applicable section in designated sortOrder
 * - Excludes null, undefined, and empty string
 * - By default, excludes false boolean values to avoid UI clutter (unless explicitly useful)
 * - Resolves localized labels in the requested language
 * - Always assigns a safe allowlisted iconKey (falls back to 'info')
 */
export function formatAttributesForDisplay(
  attributes: Record<string, unknown> | null | undefined,
  locale: Language,
  dealType: string,
  category: string
): FormattedSection[] {
  if (!attributes || typeof attributes !== "object") {
    return [];
  }

  const sections = getApplicableSections(dealType, category);
  const applicableAttrs = getApplicableAttributes(dealType, category);
  const attrByCode = new Map(applicableAttrs.map((a) => [a.code, a]));

  const result: FormattedSection[] = [];

  for (const section of sections) {
    const items: FormattedAttributeItem[] = [];

    // Find attributes belonging to this section
    const sectionAttrs = applicableAttrs
      .filter((a) => a.sectionCode === section.code)
      .sort((a, b) => a.sortOrder - b.sortOrder);

    for (const attr of sectionAttrs) {
      const val = attributes[attr.code];

      // Omit empty, null or undefined
      if (val === null || val === undefined || val === "") {
        continue;
      }

      // Boolean formatting: skip false to keep cards clean
      if (attr.valueType === "boolean") {
        if (val !== true) continue;

        items.push({
          code: attr.code,
          label: attr.labels[locale] || attr.labels.ru,
          value: true,
          displayValue: locale === "tg" ? "Ҳа" : locale === "en" ? "Yes" : "Да",
          iconKey: sanitizeIconKey(attr.iconKey),
          valueType: "boolean",
        });
        continue;
      }

      // Enum formatting: translate option label
      if (attr.valueType === "enum") {
        const option = (attr.enumValues || []).find((opt) => opt.code === String(val));
        const displayLabel = option
          ? option.labels[locale] || option.labels.ru
          : String(val);

        items.push({
          code: attr.code,
          label: attr.labels[locale] || attr.labels.ru,
          value: val,
          displayValue: displayLabel,
          iconKey: sanitizeIconKey(attr.iconKey),
          valueType: "enum",
        });
        continue;
      }

      // Numeric formatting with localized unit
      if (attr.valueType === "integer" || attr.valueType === "number") {
        const unitStr = attr.unit ? ` ${attr.unit[locale] || attr.unit.ru}` : "";
        items.push({
          code: attr.code,
          label: attr.labels[locale] || attr.labels.ru,
          value: val,
          displayValue: `${val}${unitStr}`,
          iconKey: sanitizeIconKey(attr.iconKey),
          unit: attr.unit ? attr.unit[locale] || attr.unit.ru : undefined,
          valueType: attr.valueType,
        });
        continue;
      }

      // Text formatting
      items.push({
        code: attr.code,
        label: attr.labels[locale] || attr.labels.ru,
        value: val,
        displayValue: String(val),
        iconKey: sanitizeIconKey(attr.iconKey),
        valueType: "text",
      });
    }

    if (items.length > 0) {
      result.push({
        code: section.code,
        title: section.labels[locale] || section.labels.ru,
        sortOrder: section.sortOrder,
        items,
      });
    }
  }

  return result.sort((a, b) => a.sortOrder - b.sortOrder);
}

// ============================================================================
// 9. BACKWARD COMPATIBILITY ADAPTER
// ============================================================================

/**
 * Merges legacy top-level classified columns (hasHeating, renovation, floor, etc.)
 * into the modern unified attributes dictionary if not already populated.
 * Guarantees zero data loss for existing listings (Stage 1 Requirement 6).
 */
export function mergeLegacyClassifiedAttributes(
  legacy: {
    hasHeating?: boolean | null;
    isFurnished?: boolean | null;
    floor?: number | null;
    floorsCount?: number | null;
    buildingType?: string | null;
    renovation?: string | null;
    attributes?: Record<string, unknown> | null;
  }
): Record<string, unknown> {
  const merged: Record<string, unknown> = { ...(legacy.attributes || {}) };

  if (merged.heating === undefined && legacy.hasHeating !== undefined && legacy.hasHeating !== null) {
    merged.heating = legacy.hasHeating;
  }
  if (merged.furnished === undefined && legacy.isFurnished !== undefined && legacy.isFurnished !== null) {
    merged.furnished = legacy.isFurnished;
  }
  if (merged.floor === undefined && legacy.floor !== undefined && legacy.floor !== null) {
    merged.floor = legacy.floor;
  }
  if (merged.floors_count === undefined && legacy.floorsCount !== undefined && legacy.floorsCount !== null) {
    merged.floors_count = legacy.floorsCount;
  }
  if (merged.building_type === undefined && legacy.buildingType) {
    // Map common string to enum code if matched
    const match = ENUM_BUILDING_TYPES.find(
      (e) => e.code === legacy.buildingType || e.labels.ru.toLowerCase() === legacy.buildingType?.toLowerCase()
    );
    merged.building_type = match ? match.code : "other";
  }
  if (merged.renovation_type === undefined && legacy.renovation) {
    const match = ENUM_RENOVATION_TYPES.find(
      (e) => e.code === legacy.renovation || e.labels.ru.toLowerCase() === legacy.renovation?.toLowerCase()
    );
    if (match) merged.renovation_type = match.code;
  }

  return merged;
}
