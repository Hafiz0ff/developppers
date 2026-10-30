/**
 * Taxonomy Store & Category Management Engine
 * Single Source of Truth for Categories, Slugs, Locales, and SEO Templates
 * Conforms to MASKANI.TJ SEO Specification v1.7 (Sections 2.1-2.3)
 */

export type Locale = "ru" | "tg" | "en";
export type SlugMode = "AUTO" | "MANUAL";

export interface LocalizedString {
  ru: string;
  tg: string;
  en: string;
}

export interface SeoTemplates {
  h1: LocalizedString;
  title: LocalizedString;
  description: LocalizedString;
}

export interface TaxonomyCategory {
  id: string; // Stable immutable ID
  code: string; // Stable immutable code (e.g. "rent_apartments", "sale_resale_apartments")
  name: LocalizedString; // Display name per locale
  slug: LocalizedString; // SEO URL-slug per locale
  slugMode: SlugMode; // AUTO: slug suggested from name; MANUAL: slug locked
  parentId: string | null; // Hierarchy parent
  routeKind: "deal" | "property_type" | "segment" | "combined";
  dealType?: "sale" | "rent_long" | "rent_daily";
  propertyType?: "apartment" | "house" | "commercial" | "land" | "garage";
  marketSegment?: "secondary" | "new_building";
  active: boolean; // Available for agent selection
  indexable: boolean; // Allowlist for search indexing
  seoTemplates: SeoTemplates;
  displayOrder: number;
}

export interface CategorySlugPreview {
  categoryId: string;
  categoryCode: string;
  currentSlug: LocalizedString;
  proposedSlug: LocalizedString;
  affectedListingsCount: number;
  sampleOldUrls: string[];
  sampleNewUrls: string[];
  redirectPlan: Array<{ from: string; to: string }>;
  requiresConfirmation: boolean;
}

// Transliteration table for Russian and Tajik Cyrillic
const CYRILLIC_TO_LATIN: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", ғ: "gh", д: "d", е: "e", ё: "yo",
  ж: "zh", з: "z", и: "i", ӣ: "i", й: "y", к: "k", қ: "q", л: "l",
  м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u",
  ӯ: "u", ф: "f", х: "kh", ҳ: "h", ц: "ts", ч: "ch", ҷ: "j", ш: "sh",
  щ: "sch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
};

/**
 * Transliterates localized string into a clean, URL-safe slug
 */
export function transliterateToSlug(text: string): string {
  const normalized = text.toLowerCase().trim();
  let result = "";
  for (const char of normalized) {
    if (CYRILLIC_TO_LATIN[char] !== undefined) {
      result += CYRILLIC_TO_LATIN[char];
    } else if (/[a-z0-9]/.test(char)) {
      result += char;
    } else if (/\s|[-_/]/.test(char)) {
      result += "-";
    }
  }
  return result.replace(/-+/g, "-").replace(/^-|-$/g, "");
}

// Master Taxonomy Categories Registry
// Preserves existing names and slugs (e.g. name_ru="Аренда", slug_ru="arenda")
const INITIAL_CATEGORIES: TaxonomyCategory[] = [
  // --- Deals (Top-level hubs) ---
  {
    id: "cat_deal_sale",
    code: "deal_sale",
    name: { ru: "Продажа", tg: "Фурӯш", en: "Sale" },
    slug: { ru: "kupit", tg: "furosh", en: "sale" },
    slugMode: "MANUAL",
    parentId: null,
    routeKind: "deal",
    dealType: "sale",
    active: true,
    indexable: true,
    displayOrder: 1,
    seoTemplates: {
      h1: {
        ru: "Купить недвижимость в {city}",
        tg: "Хариди амвол дар {city}",
        en: "Real Estate for Sale in {city}",
      },
      title: {
        ru: "Купить недвижимость в {city} — цены, объявления без посредников | Maskani",
        tg: "Хариди амвол дар {city} — нархҳо ва эълонҳо | Maskani",
        en: "Property for Sale in {city} — Prices & Direct Listings | Maskani",
      },
      description: {
        ru: "Актуальные объявления о продаже недвижимости в {city}. Проверенные квартиры, дома и новостройки на Maskani.tj.",
        tg: "Эълонҳои фурӯши амвол дар {city}. Хонадонҳо ва ҳавлиҳои тасдиқшуда дар Maskani.tj.",
        en: "Verified real estate listings for sale in {city}. Apartments, houses, and new developments on Maskani.tj.",
      },
    },
  },
  {
    id: "cat_deal_rent",
    code: "deal_rent",
    name: { ru: "Аренда", tg: "Иҷора", en: "Rent" },
    slug: { ru: "arenda", tg: "ijora", en: "rent" }, // Supports "arenda" by default; customizable in Super Admin
    slugMode: "MANUAL",
    parentId: null,
    routeKind: "deal",
    dealType: "rent_long",
    active: true,
    indexable: true,
    displayOrder: 2,
    seoTemplates: {
      h1: {
        ru: "Аренда недвижимости в {city}",
        tg: "Иҷораи амвол дар {city}",
        en: "Property for Rent in {city}",
      },
      title: {
        ru: "Снять недвижимость в {city} — длительная аренда без посредников | Maskani",
        tg: "Ба иҷора гирифтани амвол дар {city} | Maskani",
        en: "Property for Rent in {city} — Long-term Direct Listings | Maskani",
      },
      description: {
        ru: "Каталог аренды жилой и коммерческой недвижимости в {city}. Прямые контакты собственников на Maskani.tj.",
        tg: "Каталоги иҷораи амволи манзилӣ ва тиҷоратӣ дар {city}. Тамос бо соҳибмулкон дар Maskani.tj.",
        en: "Find residential and commercial property for rent in {city}. Direct contacts on Maskani.tj.",
      },
    },
  },
  {
    id: "cat_deal_daily",
    code: "deal_daily",
    name: { ru: "Посуточная аренда", tg: "Иҷораи шабонарӯзӣ", en: "Daily Rent" },
    slug: { ru: "posutochno", tg: "shabonaruzi", en: "daily-rent" },
    slugMode: "MANUAL",
    parentId: null,
    routeKind: "deal",
    dealType: "rent_daily",
    active: true,
    indexable: true,
    displayOrder: 3,
    seoTemplates: {
      h1: {
        ru: "Посуточная аренда в {city}",
        tg: "Иҷораи шабонарӯзӣ дар {city}",
        en: "Short-term Rentals in {city}",
      },
      title: {
        ru: "Квартиры посуточно в {city} — аренда на сутки | Maskani",
        tg: "Хонадонҳо бо иҷораи шабонарӯзӣ дар {city} | Maskani",
        en: "Daily Apartments for Rent in {city} | Maskani",
      },
      description: {
        ru: "Уютные квартиры и дома посуточно в {city}. Чистота, все удобства, бронирование на Maskani.tj.",
        tg: "Хонадонҳо барои иҷораи шабонарӯзӣ дар {city}. Ҳамаи шароитҳо дар Maskani.tj.",
        en: "Comfortable short-term rentals and daily apartments in {city} on Maskani.tj.",
      },
    },
  },

  // --- Specific Categories for Rent ---
  {
    id: "cat_rent_apartments",
    code: "rent_apartments",
    name: { ru: "Квартиры в аренду", tg: "Иҷораи хонадонҳо", en: "Apartments for Rent" },
    slug: { ru: "kvartiry", tg: "khonadon", en: "apartments" },
    slugMode: "MANUAL",
    parentId: "cat_deal_rent",
    routeKind: "combined",
    dealType: "rent_long",
    propertyType: "apartment",
    active: true,
    indexable: true,
    displayOrder: 10,
    seoTemplates: {
      h1: {
        ru: "Снять квартиру в {city}",
        tg: "Иҷораи хонадон дар {city}",
        en: "Apartments for Rent in {city}",
      },
      title: {
        ru: "Аренда квартир в {city} — снять квартиру долгосрочно | Maskani",
        tg: "Иҷораи дарозмуддати хонадонҳо дар {city} | Maskani",
        en: "Apartments for Rent in {city} — Long Term Rentals | Maskani",
      },
      description: {
        ru: "Свежие объявления по аренде квартир в {city}. 1, 2, 3-комнатные квартиры от хозяев и агентств.",
        tg: "Эълонҳои тозаи иҷораи хонадонҳо дар {city}. 1, 2, 3-ҳуҷрагӣ аз соҳибмулкон.",
        en: "Fresh apartment rental listings in {city}. 1, 2, 3-room apartments directly from owners.",
      },
    },
  },

  // --- Specific Categories for Sale ---
  {
    id: "cat_sale_resale",
    code: "sale_resale",
    name: { ru: "Вторичный рынок", tg: "Бозори дуюм", en: "Secondary Market" },
    slug: { ru: "vtorichka", tg: "bozori-duyum", en: "resale" },
    slugMode: "MANUAL",
    parentId: "cat_deal_sale",
    routeKind: "combined",
    dealType: "sale",
    propertyType: "apartment",
    marketSegment: "secondary",
    active: true,
    indexable: true,
    displayOrder: 20,
    seoTemplates: {
      h1: {
        ru: "Купить квартиру на вторичном рынке в {city}",
        tg: "Хариди хонадон аз бозори дуюм дар {city}",
        en: "Secondary Market Apartments for Sale in {city}",
      },
      title: {
        ru: "Купить вторичную квартиру в {city} — вторичка без посредников | Maskani",
        tg: "Хариди хонадони бозори дуюм дар {city} | Maskani",
        en: "Secondary Flats for Sale in {city} — Direct Listings | Maskani",
      },
      description: {
        ru: "Продажа квартир вторичного фонда в {city}. Цены в сомони и долларах, планировки, фото и адреса.",
        tg: "Фурӯши хонадонҳои бозори дуюм дар {city}. Нархҳо бо сомонӣ ва доллар дар Maskani.tj.",
        en: "Resale apartments for sale in {city}. Real prices in TJS & USD with photos and floor plans.",
      },
    },
  },
  {
    id: "cat_sale_new_builds",
    code: "sale_new_builds",
    name: { ru: "Новостройки", tg: "Биноҳои нав", en: "New Developments" },
    slug: { ru: "novostroyki", tg: "binohoi-nav", en: "new-builds" },
    slugMode: "MANUAL",
    parentId: "cat_deal_sale",
    routeKind: "combined",
    dealType: "sale",
    propertyType: "apartment",
    marketSegment: "new_building",
    active: true,
    indexable: true,
    displayOrder: 21,
    seoTemplates: {
      h1: {
        ru: "Новостройки в {city}",
        tg: "Биноҳои нав дар {city}",
        en: "New Developments in {city}",
      },
      title: {
        ru: "Купить квартиру в новостройке в {city} — ЖК от застройщиков, рассрочка 0% | Maskani",
        tg: "Хариди хонадон дар бинои нав дар {city} — насияи 0% | Maskani",
        en: "New Buildings for Sale in {city} — 0% Installment Developers | Maskani",
      },
      description: {
        ru: "Каталог жилых комплексов и новостроек в {city}. Шахматки квартир, рассрочка 0%, цены от надежных застройщиков.",
        tg: "Каталоги биноҳои нав ва маҷмааҳои истиқоматӣ дар {city}. Насияи 0% аз бинокорони боэътимод.",
        en: "Catalog of residential complexes and new builds in {city}. 0% installment plans directly from developers.",
      },
    },
  },
  {
    id: "cat_sale_houses",
    code: "sale_houses",
    name: { ru: "Дома и Ҳавлӣ", tg: "Ҳавлиҳо ва хонаҳои заминӣ", en: "Houses & Villas" },
    slug: { ru: "doma", tg: "havli", en: "houses" },
    slugMode: "MANUAL",
    parentId: "cat_deal_sale",
    routeKind: "combined",
    dealType: "sale",
    propertyType: "house",
    active: true,
    indexable: true,
    displayOrder: 22,
    seoTemplates: {
      h1: {
        ru: "Купить дом или ҳавлӣ в {city}",
        tg: "Хариди ҳавлӣ ва хонаи заминӣ дар {city}",
        en: "Houses & Havli for Sale in {city}",
      },
      title: {
        ru: "Купить дом, хавли в {city} — частные дома с участком | Maskani",
        tg: "Хариди ҳавлӣ дар {city} — хонаҳои заминӣ бо қитъа | Maskani",
        en: "Buy a House or Havli in {city} — Private Homes with Land | Maskani",
      },
      description: {
        ru: "Продажа частных домов и традиционных ҳавлӣ с участком в {city}. Водопровод, хауз, 3-фазы, все коммуникации.",
        tg: "Фурӯши ҳавлиҳои хусусӣ дар {city}. Оби доимӣ, ҳавз, барқи 3-фаза ва шароитҳо дар Maskani.tj.",
        en: "Houses and traditional Havli estates with gardens for sale in {city}. Water supply, electricity, and amenities.",
      },
    },
  },
  {
    id: "cat_sale_commercial",
    code: "sale_commercial",
    name: { ru: "Коммерческая недвижимость", tg: "Амволи тиҷоратӣ", en: "Commercial Real Estate" },
    slug: { ru: "kommercheskaya", tg: "tijorati", en: "commercial" },
    slugMode: "MANUAL",
    parentId: "cat_deal_sale",
    routeKind: "combined",
    dealType: "sale",
    propertyType: "commercial",
    active: true,
    indexable: true,
    displayOrder: 23,
    seoTemplates: {
      h1: {
        ru: "Коммерческая недвижимость в {city}",
        tg: "Амволи тиҷоратӣ дар {city}",
        en: "Commercial Real Estate in {city}",
      },
      title: {
        ru: "Купить коммерческую недвижимость в {city} — офисы, магазины, склады | Maskani",
        tg: "Хариди амволи тиҷоратӣ дар {city} | Maskani",
        en: "Commercial Real Estate for Sale in {city} | Maskani",
      },
      description: {
        ru: "Продажа коммерческих помещений под офис, магазин или ресторан в {city}. Выгодные инвестиции.",
        tg: "Фурӯши ҷойҳои тиҷоратӣ барои офис, мағоза ва қаҳвахона дар {city}.",
        en: "Commercial real estate for sale in {city}: offices, retail stores, and warehouses.",
      },
    },
  },
  {
    id: "cat_sale_land",
    code: "sale_land",
    name: { ru: "Земельные участки", tg: "Қитъаҳои замин", en: "Land Plots" },
    slug: { ru: "uchastki", tg: "zamin", en: "land" },
    slugMode: "MANUAL",
    parentId: "cat_deal_sale",
    routeKind: "combined",
    dealType: "sale",
    propertyType: "land",
    active: true,
    indexable: true,
    displayOrder: 24,
    seoTemplates: {
      h1: {
        ru: "Земельные участки в {city}",
        tg: "Қитъаҳои замин дар {city}",
        en: "Land Plots in {city}",
      },
      title: {
        ru: "Купить земельный участок в {city} — участки под строительство | Maskani",
        tg: "Хариди қитъаи замин дар {city} | Maskani",
        en: "Land Plots for Sale in {city} | Maskani",
      },
      description: {
        ru: "Купить землю под строительство дома или коммерческого объекта в {city}. Участки в сотках с документами.",
        tg: "Хариди замин барои сохтмони манзил ё иншооти тиҷоратӣ дар {city}.",
        en: "Land plots for residential and commercial development in {city}.",
      },
    },
  },
  {
    id: "cat_sale_garage",
    code: "sale_garage",
    name: { ru: "Машино-места", tg: "Ҷойҳои таваққуфгоҳ", en: "Parking Spaces" },
    slug: { ru: "garazhi", tg: "garazhho", en: "garages" },
    slugMode: "MANUAL",
    parentId: "cat_deal_sale",
    routeKind: "combined",
    dealType: "sale",
    propertyType: "garage",
    active: true,
    indexable: false, // In accordance with Section 7: only indexed if approved demand
    displayOrder: 25,
    seoTemplates: {
      h1: {
        ru: "Машино-места и паркинг в {city}",
        tg: "Ҷойҳои таваққуфгоҳ ва гаражҳо дар {city}",
        en: "Parking Spaces in {city}",
      },
      title: {
        ru: "Купить машино-место или гараж в {city} | Maskani",
        tg: "Хариди ҷойи таваққуфгоҳ дар {city} | Maskani",
        en: "Buy Parking Space or Garage in {city} | Maskani",
      },
      description: {
        ru: "Машино-места и подземный паркинг в жилых комплексах {city}.",
        tg: "Ҷойҳои таваққуфгоҳи зеризаминӣ дар маҷмааҳои {city}.",
        en: "Parking spaces and underground parking in {city}.",
      },
    },
  },
  {
    id: "cat_sale_storage",
    code: "sale_storage",
    name: { ru: "Кладовые", tg: "Анборҳо", en: "Storage Units" },
    slug: { ru: "kladovye", tg: "anborho", en: "storage" },
    slugMode: "MANUAL",
    parentId: "cat_deal_sale",
    routeKind: "combined",
    dealType: "sale",
    propertyType: "garage",
    active: true,
    indexable: false,
    displayOrder: 26,
    seoTemplates: {
      h1: {
        ru: "Кладовые помещения в {city}",
        tg: "Анборҳо ва ҷойҳои нигоҳдорӣ дар {city}",
        en: "Storage Units in {city}",
      },
      title: {
        ru: "Купить кладовую в {city} — кладовые помещения в ЖК | Maskani",
        tg: "Хариди анбор дар {city} | Maskani",
        en: "Buy Storage Unit in {city} | Maskani",
      },
      description: {
        ru: "Продажа кладовых помещений и келлеров в новостройках и домах {city}.",
        tg: "Фурӯши анборҳои инфиродӣ дар {city}.",
        en: "Storage units and basement storage for sale in {city}.",
      },
    },
  },

  // --- Specific Categories for Rent (ТЗ v1.1 Matrix) ---
  {
    id: "cat_rent_rooms",
    code: "rent_rooms",
    name: { ru: "Комнаты", tg: "Ҳуҷраҳо", en: "Rooms" },
    slug: { ru: "komnaty", tg: "hujraho", en: "rooms" },
    slugMode: "MANUAL",
    parentId: "cat_deal_rent",
    routeKind: "combined",
    dealType: "rent_long",
    propertyType: "apartment",
    active: true,
    indexable: true,
    displayOrder: 11,
    seoTemplates: {
      h1: {
        ru: "Аренда комнат в {city}",
        tg: "Иҷораи ҳуҷраҳо дар {city}",
        en: "Rooms for Rent in {city}",
      },
      title: {
        ru: "Снять комнату в {city} — аренда комнат на длительный срок | Maskani",
        tg: "Иҷораи ҳуҷраҳо дар {city} | Maskani",
        en: "Rooms for Rent in {city} — Long Term | Maskani",
      },
      description: {
        ru: "Свежие объявления по аренде комнат в квартирах и домах {city} без посредников.",
        tg: "Эълонҳои тозаи иҷораи ҳуҷраҳо дар {city} бе миёнаравҳо дар Maskani.tj.",
        en: "Rooms for rent in apartments and houses in {city} directly from owners.",
      },
    },
  },
  {
    id: "cat_rent_houses",
    code: "rent_houses",
    name: { ru: "Дома и дачи", tg: "Ҳавлиҳо ва бӯстонсароҳо", en: "Houses & Villas" },
    slug: { ru: "doma", tg: "havli", en: "houses" },
    slugMode: "MANUAL",
    parentId: "cat_deal_rent",
    routeKind: "combined",
    dealType: "rent_long",
    propertyType: "house",
    active: true,
    indexable: true,
    displayOrder: 12,
    seoTemplates: {
      h1: {
        ru: "Аренда домов и дач в {city}",
        tg: "Иҷораи ҳавлиҳо дар {city}",
        en: "Houses for Rent in {city}",
      },
      title: {
        ru: "Снять дом или ҳавлӣ в {city} — частные дома и коттеджи в аренду | Maskani",
        tg: "Иҷораи ҳавлӣ дар {city} | Maskani",
        en: "Houses and Villas for Rent in {city} | Maskani",
      },
      description: {
        ru: "Длительная аренда домов, коттеджей и традиционных ҳавлӣ в {city}. Участок, сад, коммуникации.",
        tg: "Иҷораи дарозмуддати ҳавлиҳои заминӣ ва бӯстонсароҳо дар {city}.",
        en: "Long term houses and Havli rentals with gardens in {city}.",
      },
    },
  },
  {
    id: "cat_rent_commercial",
    code: "rent_commercial",
    name: { ru: "Коммерческая недвижимость в аренду", tg: "Иҷораи амволи тиҷоратӣ", en: "Commercial Property for Rent" },
    slug: { ru: "kommercheskaya", tg: "tijorati", en: "commercial" },
    slugMode: "MANUAL",
    parentId: "cat_deal_rent",
    routeKind: "combined",
    dealType: "rent_long",
    propertyType: "commercial",
    active: true,
    indexable: true,
    displayOrder: 13,
    seoTemplates: {
      h1: {
        ru: "Аренда коммерческой недвижимости в {city}",
        tg: "Иҷораи амволи тиҷоратӣ дар {city}",
        en: "Commercial Real Estate for Rent in {city}",
      },
      title: {
        ru: "Снять коммерческую недвижимость в {city} — офисы, склады, магазины | Maskani",
        tg: "Иҷораи амволи тиҷоратӣ дар {city} | Maskani",
        en: "Commercial Property for Rent in {city} | Maskani",
      },
      description: {
        ru: "Аренда помещений под офис, торговлю, склад или общепит в {city}. Прямые договоры с собственниками.",
        tg: "Иҷораи ҷойҳои тиҷоратӣ барои офис, мағоза ва анбор дар {city}.",
        en: "Offices, retail space and warehouses for rent in {city}.",
      },
    },
  },
  {
    id: "cat_rent_garage",
    code: "rent_garage",
    name: { ru: "Машино-места в аренду", tg: "Иҷораи ҷойҳои таваққуфгоҳ", en: "Parking Spaces for Rent" },
    slug: { ru: "garazhi", tg: "garazhho", en: "garages" },
    slugMode: "MANUAL",
    parentId: "cat_deal_rent",
    routeKind: "combined",
    dealType: "rent_long",
    propertyType: "garage",
    active: true,
    indexable: false,
    displayOrder: 14,
    seoTemplates: {
      h1: {
        ru: "Аренда машино-мест и гаражей в {city}",
        tg: "Иҷораи гаражҳо ва ҷойҳои таваққуфгоҳ дар {city}",
        en: "Parking Spaces for Rent in {city}",
      },
      title: {
        ru: "Снять машино-место или гараж в {city} | Maskani",
        tg: "Иҷораи гараж дар {city} | Maskani",
        en: "Rent a Parking Space in {city} | Maskani",
      },
      description: {
        ru: "Аренда парковочных мест и гаражей в {city}. Охраняемый паркинг в жилых домах.",
        tg: "Иҷораи ҷойҳои таваққуфгоҳи нақлиёт дар {city}.",
        en: "Secure parking spots and garage spaces for rent in {city}.",
      },
    },
  },
  {
    id: "cat_rent_storage",
    code: "rent_storage",
    name: { ru: "Кладовые в аренду", tg: "Иҷораи анборҳо", en: "Storage Units for Rent" },
    slug: { ru: "kladovye", tg: "anborho", en: "storage" },
    slugMode: "MANUAL",
    parentId: "cat_deal_rent",
    routeKind: "combined",
    dealType: "rent_long",
    propertyType: "garage",
    active: true,
    indexable: false,
    displayOrder: 15,
    seoTemplates: {
      h1: {
        ru: "Аренда кладовых в {city}",
        tg: "Иҷораи анборҳои инфиродӣ дар {city}",
        en: "Storage Units for Rent in {city}",
      },
      title: {
        ru: "Снять кладовую в {city} — аренда ячеек и складов | Maskani",
        tg: "Иҷораи анбор дар {city} | Maskani",
        en: "Storage Units for Rent in {city} | Maskani",
      },
      description: {
        ru: "Аренда индивидуальных кладовых и складских ячеек в {city}.",
        tg: "Иҷораи анборҳои шахсӣ дар биноҳои {city}.",
        en: "Self-storage units and basement storage for rent in {city}.",
      },
    },
  },
];

// In-memory runtime categories store (hydrated from initial, mutable via Super Admin)
let categoriesStore: TaxonomyCategory[] = JSON.parse(JSON.stringify(INITIAL_CATEGORIES));

export function getTaxonomyCategories(): TaxonomyCategory[] {
  return [...categoriesStore];
}

export function getTaxonomyCategoryById(id: string): TaxonomyCategory | undefined {
  return categoriesStore.find((c) => c.id === id);
}

export function getTaxonomyCategoryByCode(code: string): TaxonomyCategory | undefined {
  return categoriesStore.find((c) => c.code === code);
}

/**
 * Resolves appropriate category for a listing based on its business parameters
 */
export function findCategoryForListing(params: {
  dealType?: string;
  propertyType?: string;
  marketSegment?: string;
}): TaxonomyCategory | undefined {
  const normDeal = (params.dealType || "sale").toLowerCase();
  const normProp = (params.propertyType || "apartment").toLowerCase();
  const isNewBuild =
    params.marketSegment === "new_building" ||
    normProp === "новостройка" ||
    normProp === "new_building";

  // Check new building
  if (isNewBuild && (normDeal === "sale" || normDeal === "продажа")) {
    return getTaxonomyCategoryByCode("sale_new_builds");
  }

  // Check rent
  if (normDeal.includes("rent") || normDeal === "аренда" || normDeal === "иҷора") {
    if (normDeal === "rent_daily" || normDeal.includes("посуточ")) {
      return getTaxonomyCategoryByCode("deal_daily");
    }
    return getTaxonomyCategoryByCode("rent_apartments") || getTaxonomyCategoryByCode("deal_rent");
  }

  // Check sale
  if (normProp.includes("house") || normProp.includes("дом") || normProp.includes("ҳавлӣ")) {
    return getTaxonomyCategoryByCode("sale_houses");
  }
  if (normProp.includes("commercial") || normProp.includes("коммерц") || normProp.includes("тиҷорат")) {
    return getTaxonomyCategoryByCode("sale_commercial");
  }
  if (normProp.includes("land") || normProp.includes("участ") || normProp.includes("замин")) {
    return getTaxonomyCategoryByCode("sale_land");
  }
  if (normProp.includes("garage") || normProp.includes("гараж")) {
    return getTaxonomyCategoryByCode("sale_garage");
  }

  // Default resale apartment
  return getTaxonomyCategoryByCode("sale_resale") || getTaxonomyCategoryByCode("deal_sale");
}

/**
 * Creates a new category in Super Admin
 * Rule AC-23: Newly added category is NOT indexable by default unless explicitly configured.
 */
export function createTaxonomyCategory(
  input: Omit<TaxonomyCategory, "id"> & { id?: string }
): TaxonomyCategory {
  const newId = input.id || `cat_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  
  // Verify code uniqueness
  if (categoriesStore.some((c) => c.code === input.code)) {
    throw new Error(`Category with code "${input.code}" already exists.`);
  }

  // Auto-generate slugs if in AUTO mode and slug is empty
  const slugRu =
    input.slugMode === "AUTO" && !input.slug.ru
      ? transliterateToSlug(input.name.ru)
      : input.slug.ru;
  const slugTg =
    input.slugMode === "AUTO" && !input.slug.tg
      ? transliterateToSlug(input.name.tg)
      : input.slug.tg;
  const slugEn =
    input.slugMode === "AUTO" && !input.slug.en
      ? transliterateToSlug(input.name.en)
      : input.slug.en;

  const category: TaxonomyCategory = {
    ...input,
    id: newId,
    slug: { ru: slugRu, tg: slugTg, en: slugEn },
    // Default indexable to false for safety if not explicitly provided
    indexable: Boolean(input.indexable),
  };

  categoriesStore.push(category);
  return category;
}

/**
 * Updates a category in Super Admin.
 * Enforces AC-03 / AC-21:
 * - MANUAL mode: Name change does NOT affect slug.
 * - AUTO mode: Name change prompts slug recalculation.
 */
export function updateTaxonomyCategory(
  id: string,
  updates: Partial<Omit<TaxonomyCategory, "id" | "code">>
): TaxonomyCategory {
  const index = categoriesStore.findIndex((c) => c.id === id);
  if (index === -1) {
    throw new Error(`Category not found with id: ${id}`);
  }

  const existing = categoriesStore[index];
  const updated: TaxonomyCategory = {
    ...existing,
    ...updates,
    name: updates.name ? { ...existing.name, ...updates.name } : existing.name,
    slug: updates.slug ? { ...existing.slug, ...updates.slug } : existing.slug,
    seoTemplates: updates.seoTemplates
      ? {
          h1: { ...existing.seoTemplates.h1, ...(updates.seoTemplates.h1 || {}) },
          title: { ...existing.seoTemplates.title, ...(updates.seoTemplates.title || {}) },
          description: { ...existing.seoTemplates.description, ...(updates.seoTemplates.description || {}) },
        }
      : existing.seoTemplates,
  };

  // If slugMode is AUTO and name changed without explicit slug, compute new slug
  if (updated.slugMode === "AUTO" && updates.name && !updates.slug) {
    if (updates.name.ru && updates.name.ru !== existing.name.ru) {
      updated.slug.ru = transliterateToSlug(updates.name.ru);
    }
    if (updates.name.tg && updates.name.tg !== existing.name.tg) {
      updated.slug.tg = transliterateToSlug(updates.name.tg);
    }
    if (updates.name.en && updates.name.en !== existing.name.en) {
      updated.slug.en = transliterateToSlug(updates.name.en);
    }
  }

  categoriesStore[index] = updated;
  return updated;
}

/**
 * Resets the categories store to initial seed state (used in testing)
 */
export function resetTaxonomyCategoriesForTesting(): void {
  categoriesStore = JSON.parse(JSON.stringify(INITIAL_CATEGORIES));
}
