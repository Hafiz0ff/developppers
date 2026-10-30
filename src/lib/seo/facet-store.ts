/**
 * Facet Store & Commercial / Room Facet Configuration Engine
 * Single Source of Truth for Facets, Multi-language Slugs, and Indexing Rules
 * Conforms to MASKANI.TJ Specification v1.1 (Sections 4 & 5)
 */

import { type Locale, type LocalizedString, type SeoTemplates } from "./taxonomy-store";

export interface FacetConfig {
  id: string; // Stable immutable ID (e.g., "facet_sale_comm_office")
  categoryId: string; // Target category (e.g., "cat_sale_commercial", "cat_rent_commercial")
  facetKey: string; // Property key (e.g., "commercial_type", "rooms")
  valueKey: string; // Internal value key (e.g., "office", "retail_warehouse", "1")
  displayName: LocalizedString; // Localized label
  valueSlug: LocalizedString; // Localized SEO URL slug
  hasOwnPage: boolean; // TRUE: dedicated SEO landing page; FALSE: URL filter param only
  indexable: boolean; // Search engine allowlist flag (robots: index, follow vs noindex, follow)
  sortOrder: number;
  active: boolean;
  seoTemplates: SeoTemplates;
}

const INITIAL_FACETS: FacetConfig[] = [
  // =========================================================================
  // Commercial Real Estate (Sale) - Section 4 of TZ v1.1
  // =========================================================================
  {
    id: "facet_sale_comm_office",
    categoryId: "cat_sale_commercial",
    facetKey: "commercial_type",
    valueKey: "office",
    displayName: {
      ru: "Офисы",
      tg: "Дафтарҳо",
      en: "Offices",
    },
    valueSlug: {
      ru: "ofisy",
      tg: "daftarho",
      en: "offices",
    },
    hasOwnPage: true,
    indexable: true,
    sortOrder: 1,
    active: true,
    seoTemplates: {
      h1: {
        ru: "Купить офис в {city}",
        tg: "Хариди дафтар дар {city}",
        en: "Offices for Sale in {city}",
      },
      title: {
        ru: "Купить офис в {city} — продажа офисных помещений | Maskani",
        tg: "Хариди дафтар дар {city} — фурӯши ҷойҳои корӣ | Maskani",
        en: "Buy Office in {city} — Commercial Office Spaces | Maskani",
      },
      description: {
        ru: "Продажа офисов и бизнес-помещений в {city} без посредников. Каталог предложений на Maskani.tj.",
        tg: "Фурӯши офисҳо ва ҷойҳои корӣ дар {city} бе миёнаравҳо дар Maskani.tj.",
        en: "Offices and business premises for sale in {city} without intermediaries.",
      },
    },
  },
  {
    id: "facet_sale_comm_retail_warehouse",
    categoryId: "cat_sale_commercial",
    facetKey: "commercial_type",
    valueKey: "retail_warehouse",
    displayName: {
      ru: "Торговые и склады",
      tg: "Тиҷорат ва анборҳо",
      en: "Retail & Warehouses",
    },
    valueSlug: {
      ru: "torgovye-sklady",
      tg: "tijorat-anbor",
      en: "retail-warehouse",
    },
    hasOwnPage: true,
    indexable: true,
    sortOrder: 2,
    active: true,
    seoTemplates: {
      h1: {
        ru: "Купить торговые помещения и склады в {city}",
        tg: "Хариди ҷойҳои тиҷоратӣ ва анборҳо дар {city}",
        en: "Retail & Warehouses for Sale in {city}",
      },
      title: {
        ru: "Купить склад или торговую площадь в {city} | Maskani",
        tg: "Хариди анбор ва мағоза дар {city} | Maskani",
        en: "Buy Warehouse or Retail Space in {city} | Maskani",
      },
      description: {
        ru: "Продажа торговых площадей, магазинов, павильонов и складских баз в {city}.",
        tg: "Фурӯши майдонҳои савдо, мағозаҳо ва анборҳои замонавӣ дар {city}.",
        en: "Retail spaces, shops, and warehouse properties for sale in {city}.",
      },
    },
  },

  // =========================================================================
  // Commercial Real Estate (Rent) - Section 4 of TZ v1.1
  // =========================================================================
  {
    id: "facet_rent_comm_office",
    categoryId: "cat_rent_commercial",
    facetKey: "commercial_type",
    valueKey: "office",
    displayName: {
      ru: "Офисы",
      tg: "Дафтарҳо",
      en: "Offices",
    },
    valueSlug: {
      ru: "ofisy",
      tg: "daftarho",
      en: "offices",
    },
    hasOwnPage: true,
    indexable: true,
    sortOrder: 1,
    active: true,
    seoTemplates: {
      h1: {
        ru: "Аренда офисов в {city}",
        tg: "Иҷораи дафтарҳо дар {city}",
        en: "Offices for Rent in {city}",
      },
      title: {
        ru: "Снять офис в {city} — аренда офисных помещений | Maskani",
        tg: "Иҷораи дафтар дар {city} — ҷойҳои кории замонавӣ | Maskani",
        en: "Rent an Office in {city} — Commercial Office Spaces | Maskani",
      },
      description: {
        ru: "Аренда офисов в бизнес-центрах и жилых комплексах {city}. Прямые договоры с собственниками.",
        tg: "Иҷораи дафтарҳо дар марказҳои тиҷоратии {city}.",
        en: "Office rentals in modern business centers of {city}.",
      },
    },
  },
  {
    id: "facet_rent_comm_retail_warehouse",
    categoryId: "cat_rent_commercial",
    facetKey: "commercial_type",
    valueKey: "retail_warehouse",
    displayName: {
      ru: "Торговые и склады",
      tg: "Тиҷорат ва анборҳо",
      en: "Retail & Warehouses",
    },
    valueSlug: {
      ru: "torgovye-sklady",
      tg: "tijorat-anbor",
      en: "retail-warehouse",
    },
    hasOwnPage: true,
    indexable: true,
    sortOrder: 2,
    active: true,
    seoTemplates: {
      h1: {
        ru: "Аренда торговых помещений и складов в {city}",
        tg: "Иҷораи ҷойҳои тиҷоратӣ ва анборҳо дар {city}",
        en: "Retail Spaces & Warehouses for Rent in {city}",
      },
      title: {
        ru: "Снять склад или магазин в {city} — аренда коммерции | Maskani",
        tg: "Иҷораи мағоза ва анбор дар {city} | Maskani",
        en: "Rent a Warehouse or Retail Store in {city} | Maskani",
      },
      description: {
        ru: "Снять торговую площадь, магазин или складское помещение в {city}. Удобный поиск по локациям.",
        tg: "Иҷораи майдонҳои савдо, мағозаҳо ва анборҳо дар {city}.",
        en: "Retail units and warehouse facilities for rent in {city}.",
      },
    },
  },

  // =========================================================================
  // Residential Rooms (Sale Resale) - Section 5 of TZ v1.1
  // =========================================================================
  {
    id: "facet_sale_resale_rooms_1",
    categoryId: "cat_sale_resale",
    facetKey: "rooms",
    valueKey: "1",
    displayName: { ru: "1-комнатные", tg: "1-ҳуҷрагӣ", en: "1-room" },
    valueSlug: { ru: "1-komnatnye", tg: "1-hujragi", en: "1-room" },
    hasOwnPage: true,
    indexable: true,
    sortOrder: 1,
    active: true,
    seoTemplates: {
      h1: {
        ru: "Купить 1-комнатную квартиру во вторичке в {city}",
        tg: "Хариди хонаи 1-ҳуҷрагӣ дар {city}",
        en: "1-Room Apartments for Sale in {city}",
      },
      title: {
        ru: "Купить 1-комнатную квартиру в {city} (вторичка) | Maskani",
        tg: "Хариди хонаи 1-ҳуҷрагӣ дар {city} | Maskani",
        en: "Buy 1-Bedroom Apartment in {city} | Maskani",
      },
      description: {
        ru: "Продажа однокомнатных квартир на вторичном рынке в {city}. Актуальные цены и фото.",
        tg: "Фурӯши хонаҳои 1-ҳуҷрагӣ дар бозори дуюмдараҷаи {city}.",
        en: "1-bedroom resale apartments for sale in {city}.",
      },
    },
  },
  {
    id: "facet_sale_resale_rooms_2",
    categoryId: "cat_sale_resale",
    facetKey: "rooms",
    valueKey: "2",
    displayName: { ru: "2-комнатные", tg: "2-ҳуҷрагӣ", en: "2-room" },
    valueSlug: { ru: "2-komnatnye", tg: "2-hujragi", en: "2-room" },
    hasOwnPage: true,
    indexable: true,
    sortOrder: 2,
    active: true,
    seoTemplates: {
      h1: {
        ru: "Купить 2-комнатную квартиру во вторичке в {city}",
        tg: "Хариди хонаи 2-ҳуҷрагӣ дар {city}",
        en: "2-Room Apartments for Sale in {city}",
      },
      title: {
        ru: "Купить 2-комнатную квартиру в {city} (вторичка) | Maskani",
        tg: "Хариди хонаи 2-ҳуҷрагӣ дар {city} | Maskani",
        en: "Buy 2-Bedroom Apartment in {city} | Maskani",
      },
      description: {
        ru: "Продажа двухкомнатных квартир в {city}. Подробные планировки, состояние, цены.",
        tg: "Фурӯши хонаҳои 2-ҳуҷрагӣ дар {city}.",
        en: "2-bedroom resale apartments for sale in {city}.",
      },
    },
  },
  {
    id: "facet_sale_resale_rooms_3",
    categoryId: "cat_sale_resale",
    facetKey: "rooms",
    valueKey: "3",
    displayName: { ru: "3-комнатные", tg: "3-ҳуҷрагӣ", en: "3-room" },
    valueSlug: { ru: "3-komnatnye", tg: "3-hujragi", en: "3-room" },
    hasOwnPage: true,
    indexable: true,
    sortOrder: 3,
    active: true,
    seoTemplates: {
      h1: {
        ru: "Купить 3-комнатную квартиру во вторичке в {city}",
        tg: "Хариди хонаи 3-ҳуҷрагӣ дар {city}",
        en: "3-Room Apartments for Sale in {city}",
      },
      title: {
        ru: "Купить 3-комнатную квартиру в {city} (вторичка) | Maskani",
        tg: "Хариди хонаи 3-ҳуҷрагӣ дар {city} | Maskani",
        en: "Buy 3-Bedroom Apartment in {city} | Maskani",
      },
      description: {
        ru: "Продажа трехкомнатных квартир во вторичном фонде {city}. Семейные квартиры.",
        tg: "Фурӯши хонаҳои 3-ҳуҷрагӣ барои оилаҳо дар {city}.",
        en: "3-bedroom resale apartments for sale in {city}.",
      },
    },
  },
  {
    id: "facet_sale_resale_rooms_4_plus",
    categoryId: "cat_sale_resale",
    facetKey: "rooms",
    valueKey: "4_plus",
    displayName: { ru: "4+ комнатные", tg: "4+ ҳуҷрагӣ", en: "4+ rooms" },
    valueSlug: { ru: "4-komnatnye-i-bolee", tg: "4-hujragi-va-beshtar", en: "4-rooms-and-more" },
    hasOwnPage: true,
    indexable: true,
    sortOrder: 4,
    active: true,
    seoTemplates: {
      h1: {
        ru: "Купить 4-комнатную и большую квартиру в {city}",
        tg: "Хариди хонаи 4-ҳуҷрагӣ ва бештар дар {city}",
        en: "4+ Room Apartments for Sale in {city}",
      },
      title: {
        ru: "Купить 4-комнатную квартиру в {city} | Maskani",
        tg: "Хариди хонаи калон дар {city} | Maskani",
        en: "Buy Large 4+ Bedroom Apartment in {city} | Maskani",
      },
      description: {
        ru: "Большие просторные квартиры от 4 комнат и пентхаусы в {city}.",
        tg: "Хонаҳои калонҳаҷм ва барҳаво аз 4 ҳуҷра дар {city}.",
        en: "Spacious 4+ bedroom apartments for sale in {city}.",
      },
    },
  },

  // =========================================================================
  // Residential Rooms (Rent) - Section 5 of TZ v1.1
  // =========================================================================
  {
    id: "facet_rent_rooms_1",
    categoryId: "cat_rent_apartments",
    facetKey: "rooms",
    valueKey: "1",
    displayName: { ru: "1-комнатные", tg: "1-ҳуҷрагӣ", en: "1-room" },
    valueSlug: { ru: "1-komnatnye", tg: "1-hujragi", en: "1-room" },
    hasOwnPage: true,
    indexable: true,
    sortOrder: 1,
    active: true,
    seoTemplates: {
      h1: {
        ru: "Снять 1-комнатную квартиру в {city}",
        tg: "Иҷораи хонаи 1-ҳуҷрагӣ дар {city}",
        en: "1-Room Apartments for Rent in {city}",
      },
      title: {
        ru: "Снять 1-комнатную квартиру в {city} длительно | Maskani",
        tg: "Иҷораи хонаи 1-ҳуҷрагӣ дар {city} | Maskani",
        en: "Rent 1-Room Apartment in {city} | Maskani",
      },
      description: {
        ru: "Длительная аренда 1-комнатных квартир в {city}. Свежие варианты с мебелью и техникой.",
        tg: "Иҷораи дарозмуддати хонаҳои 1-ҳуҷрагӣ бо шароит дар {city}.",
        en: "1-room apartments for long term rent in {city}.",
      },
    },
  },
  {
    id: "facet_rent_rooms_2",
    categoryId: "cat_rent_apartments",
    facetKey: "rooms",
    valueKey: "2",
    displayName: { ru: "2-комнатные", tg: "2-ҳуҷрагӣ", en: "2-room" },
    valueSlug: { ru: "2-komnatnye", tg: "2-hujragi", en: "2-room" },
    hasOwnPage: true,
    indexable: true,
    sortOrder: 2,
    active: true,
    seoTemplates: {
      h1: {
        ru: "Снять 2-комнатную квартиру в {city}",
        tg: "Иҷораи хонаи 2-ҳуҷрагӣ дар {city}",
        en: "2-Room Apartments for Rent in {city}",
      },
      title: {
        ru: "Снять 2-комнатную квартиру в {city} длительно | Maskani",
        tg: "Иҷораи хонаи 2-ҳуҷрагӣ дар {city} | Maskani",
        en: "Rent 2-Room Apartment in {city} | Maskani",
      },
      description: {
        ru: "Двухкомнатные квартиры в аренду в {city}. Уютные квартиры для семьи.",
        tg: "Иҷораи хонаҳои 2-ҳуҷрагӣ дар {city}.",
        en: "2-room apartments for long term rent in {city}.",
      },
    },
  },
  {
    id: "facet_rent_rooms_3",
    categoryId: "cat_rent_apartments",
    facetKey: "rooms",
    valueKey: "3",
    displayName: { ru: "3-комнатные", tg: "3-ҳуҷрагӣ", en: "3-room" },
    valueSlug: { ru: "3-komnatnye", tg: "3-hujragi", en: "3-room" },
    hasOwnPage: true,
    indexable: true,
    sortOrder: 3,
    active: true,
    seoTemplates: {
      h1: {
        ru: "Снять 3-комнатную квартиру в {city}",
        tg: "Иҷораи хонаи 3-ҳуҷрагӣ дар {city}",
        en: "3-Room Apartments for Rent in {city}",
      },
      title: {
        ru: "Снять 3-комнатную квартиру в {city} длительно | Maskani",
        tg: "Иҷораи хонаи 3-ҳуҷрагӣ дар {city} | Maskani",
        en: "Rent 3-Room Apartment in {city} | Maskani",
      },
      description: {
        ru: "Аренда просторных 3-комнатных квартир в {city}. Укомплектованное жилье.",
        tg: "Иҷораи хонаҳои калони 3-ҳуҷрагӣ дар {city}.",
        en: "3-room apartments for long term rent in {city}.",
      },
    },
  },
];

// In-memory runtime state for facet mutations
let facetsState: FacetConfig[] = JSON.parse(JSON.stringify(INITIAL_FACETS));

/**
 * Returns all registered facets
 */
export function getFacets(): FacetConfig[] {
  return [...facetsState];
}

/**
 * Returns active facets for a specific category ID
 */
export function getFacetsByCategory(categoryId: string): FacetConfig[] {
  return facetsState
    .filter((f) => f.categoryId === categoryId && f.active)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

/**
 * Finds a facet by category ID and value slug in a specific or any locale
 */
export function findFacetBySlug(
  categoryId: string,
  slugCandidate: string,
  locale?: Locale
): FacetConfig | undefined {
  const norm = slugCandidate.toLowerCase().trim();
  return facetsState.find((f) => {
    if (f.categoryId !== categoryId) return false;
    if (locale) {
      return f.valueSlug[locale].toLowerCase() === norm;
    }
    return (
      f.valueSlug.ru.toLowerCase() === norm ||
      f.valueSlug.tg.toLowerCase() === norm ||
      f.valueSlug.en.toLowerCase() === norm
    );
  });
}

/**
 * Retrieves a facet by its unique ID
 */
export function getFacetById(id: string): FacetConfig | undefined {
  return facetsState.find((f) => f.id === id);
}

/**
 * Upserts a facet into the store (Super Admin CRUD)
 */
export function upsertFacet(facet: FacetConfig): FacetConfig {
  const existingIdx = facetsState.findIndex((f) => f.id === facet.id);
  if (existingIdx >= 0) {
    facetsState[existingIdx] = { ...facet };
  } else {
    facetsState.push({ ...facet });
  }
  return facet;
}

/**
 * Deletes a facet by ID
 */
export function deleteFacet(id: string): boolean {
  const beforeLen = facetsState.length;
  facetsState = facetsState.filter((f) => f.id !== id);
  return facetsState.length < beforeLen;
}

/**
 * Resets facet store to defaults (useful in test suites)
 */
export function resetFacetsToDefault(): void {
  facetsState = JSON.parse(JSON.stringify(INITIAL_FACETS));
}
