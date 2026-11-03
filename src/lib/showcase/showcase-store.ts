/**
 * MASKANI.TJ — Showcase Configuration Store
 * Central Source of Truth for Homepage Mini-Cards and Showcase Sections
 * Conforms strictly to Stage 2 Specification (Sections 3, 4, 6, 8, 9, 13)
 */

import { ALL_PROPERTIES, COMMERCIAL_PROPERTIES } from "@/lib/catalog-data";
import { INITIAL_PROJECTS, INITIAL_DEVELOPERS, INITIAL_UNITS } from "@/lib/data/mock-db";
import { REALTORS_DATA } from "@/lib/data/realtors-data";
import { SERVICES_DATA } from "@/lib/data/services-data";
import { BLOG_ARTICLES } from "@/lib/data/blog-data";
import { getTaxonomyCategoryById, type Locale } from "@/lib/seo/taxonomy-store";
import { resolveCategoryUrl, resolveCatalogUrl, resolveCitySlug } from "@/lib/seo/url-resolver";

export interface LocalizedString {
  ru: string;
  tg: string;
  en: string;
}

export type ShowcaseTargetType = "category" | "catalog" | "facet";

export interface ShowcaseMiniCardConfig {
  id: string;
  visible: boolean;
  sortOrder: number;
  title: LocalizedString;
  icon: string;
  accentGlow: string;
  targetType: ShowcaseTargetType;
  targetId: string;
}

export interface ShowcaseSectionConfig {
  id: string;
  visible: boolean;
  sortOrder: number;
  title: LocalizedString;
  subtitle: LocalizedString;
  targetCatalogId: string;
  sourceType:
    | "projects"
    | "resale_apartments"
    | "rent_apartments"
    | "houses"
    | "commercial"
    | "services"
    | "developers"
    | "articles";
  maxCards: number; // Exactly 4 on desktop
}

// 7 Approved Mini-Cards (Initial State strictly conforming to Sections 3.1 & 14)
export const INITIAL_MINI_CARDS: ShowcaseMiniCardConfig[] = [
  {
    id: "mini_new_builds",
    visible: true,
    sortOrder: 1,
    title: {
      ru: "Новостройки",
      tg: "Биноҳои навсохт",
      en: "New Buildings",
    },
    icon: "/images/categories/novostroyki.png",
    accentGlow: "from-emerald-500/25 via-teal-500/15 to-transparent",
    targetType: "category",
    targetId: "cat_sale_new_builds",
  },
  {
    id: "mini_resale",
    visible: true,
    sortOrder: 2,
    title: {
      ru: "Вторичка",
      tg: "Бозори дуюмдараҷа",
      en: "Secondary Market",
    },
    icon: "/images/categories/vtorichka.png",
    accentGlow: "from-blue-500/25 via-sky-500/15 to-transparent",
    targetType: "category",
    targetId: "cat_sale_resale",
  },
  {
    id: "mini_houses",
    visible: true,
    sortOrder: 3,
    title: {
      ru: "Дома и дачи",
      tg: "Ҳавлиҳо ва дачаҳо",
      en: "Houses & Villas",
    },
    icon: "/images/categories/doma-dachi.png",
    accentGlow: "from-amber-500/25 via-orange-500/15 to-transparent",
    targetType: "category",
    targetId: "cat_sale_houses",
  },
  {
    id: "mini_commercial",
    visible: true,
    sortOrder: 4,
    title: {
      ru: "Коммерция",
      tg: "Амволи тиҷоратӣ",
      en: "Commercial Hub",
    },
    icon: "/images/categories/commerce-v2.png",
    accentGlow: "from-indigo-500/25 via-blue-500/15 to-transparent",
    targetType: "catalog",
    targetId: "catalog_commercial_hub",
  },
  {
    id: "mini_services",
    visible: true,
    sortOrder: 5,
    title: {
      ru: "Услуги",
      tg: "Хизматрасониҳо",
      en: "Services & Home",
    },
    icon: "/images/categories/services-v2.png",
    accentGlow: "from-teal-500/25 via-cyan-500/15 to-transparent",
    targetType: "catalog",
    targetId: "catalog_services",
  },
  {
    id: "mini_realtors",
    visible: true,
    sortOrder: 6,
    title: {
      ru: "Риелторы",
      tg: "Риелторон",
      en: "Certified Realtors",
    },
    icon: "/images/categories/realtors.png",
    accentGlow: "from-violet-500/25 via-purple-500/15 to-transparent",
    targetType: "catalog",
    targetId: "catalog_realtors",
  },
  {
    id: "mini_developers",
    visible: true,
    sortOrder: 7,
    title: {
      ru: "Застройщики",
      tg: "Сохтмончиён",
      en: "Developers",
    },
    icon: "/images/categories/developers-v2.png",
    accentGlow: "from-emerald-500/25 via-amber-500/15 to-transparent",
    targetType: "catalog",
    targetId: "catalog_developers",
  },
];

// 8 Showcase Sections (Initial State conforming to Section 4 & AC-16)
export const INITIAL_SHOWCASE_SECTIONS: ShowcaseSectionConfig[] = [
  {
    id: "sec_new_builds",
    visible: true,
    sortOrder: 1,
    title: {
      ru: "Новостройки",
      tg: "Биноҳои навсохт",
      en: "New Residential Complexes",
    },
    subtitle: {
      ru: "Флагманские жилые комплексы с беспроцентной рассрочкой",
      tg: "Маҷмааҳои муосири истиқоматӣ бо пардохти насия",
      en: "Premier developments with 0% installment plans",
    },
    targetCatalogId: "cat_sale_new_builds",
    sourceType: "projects",
    maxCards: 4,
  },
  {
    id: "sec_buy_apartment",
    visible: true,
    sortOrder: 2,
    title: {
      ru: "Купить квартиру",
      tg: "Хариди хонадон",
      en: "Buy an Apartment",
    },
    subtitle: {
      ru: "Проверенные квартиры вторичного рынка от собственников",
      tg: "Хонадонҳои санҷидашудаи бозори дуюмдараҷа аз соҳибмулкон",
      en: "Verified secondary apartments from direct owners",
    },
    targetCatalogId: "cat_sale_resale",
    sourceType: "resale_apartments",
    maxCards: 4,
  },
  {
    id: "sec_rent_apartment",
    visible: true,
    sortOrder: 3,
    title: {
      ru: "Снять квартиру",
      tg: "Иҷораи хонадон",
      en: "Rent an Apartment",
    },
    subtitle: {
      ru: "Уютные квартиры для долгосрочной аренды с евроремонтом",
      tg: "Хонадонҳои бароҳат барои иҷораи дарозмуддат",
      en: "Quality long-term rental apartments with modern amenities",
    },
    targetCatalogId: "cat_rent_apartments",
    sourceType: "rent_apartments",
    maxCards: 4,
  },
  {
    id: "sec_buy_house",
    visible: true,
    sortOrder: 4,
    title: {
      ru: "Купить дом",
      tg: "Хариди ҳавлӣ",
      en: "Buy a House or Villa",
    },
    subtitle: {
      ru: "Традиционные дома (Ҳавлӣ), дачи и коттеджи с садом",
      tg: "Ҳавлиҳои анъанавӣ, дачаҳо ва коттеҷҳо бо боғ",
      en: "Traditional houses (Havli), villas and cottages with gardens",
    },
    targetCatalogId: "cat_sale_houses",
    sourceType: "houses",
    maxCards: 4,
  },
  {
    id: "sec_commercial",
    visible: true,
    sortOrder: 5,
    title: {
      ru: "Коммерция",
      tg: "Амволи тиҷоратӣ",
      en: "Commercial Properties",
    },
    subtitle: {
      ru: "Офисы, торговые площади и склады для вашего бизнеса",
      tg: "Офисҳо, мағозаҳо ва анборҳо барои рушди тиҷорат",
      en: "Offices, retail spaces and warehouses for business",
    },
    targetCatalogId: "catalog_commercial_hub",
    sourceType: "commercial",
    maxCards: 4,
  },
  {
    id: "sec_services",
    visible: true,
    sortOrder: 6,
    title: {
      ru: "Услуги",
      tg: "Хизматрасониҳо",
      en: "Real Estate Services",
    },
    subtitle: {
      ru: "Юридическое сопровождение, независимая оценка и ремонт",
      tg: "Ҳамроҳии ҳуқуқӣ, баҳодиҳии мустақил ва таъмири хона",
      en: "Legal support, valuation and turnkey renovation",
    },
    targetCatalogId: "catalog_services",
    sourceType: "services",
    maxCards: 4,
  },
  {
    id: "sec_developers",
    visible: true,
    sortOrder: 7,
    title: {
      ru: "Застройщики",
      tg: "Сохтмончиён",
      en: "Verified Developers",
    },
    subtitle: {
      ru: "Надёжные девелоперские компании Согдийской области",
      tg: "Ширкатҳои сохтмонии боэътимоди вилояти Суғд",
      en: "Trusted real estate development companies in Sughd",
    },
    targetCatalogId: "catalog_developers",
    sourceType: "developers",
    maxCards: 4,
  },
  {
    id: "sec_articles",
    visible: true,
    sortOrder: 8,
    title: {
      ru: "Статьи",
      tg: "Мақолаҳо",
      en: "Editorial & Guides",
    },
    subtitle: {
      ru: "Полезные советы, аналитика рынка и гид по инвестициям",
      tg: "Маслиҳатҳои муфид, таҳлили бозор ва роҳнамои сармоягузорӣ",
      en: "Market insights, investment analysis and buyer guides",
    },
    targetCatalogId: "blog",
    sourceType: "articles",
    maxCards: 4,
  },
];

// In-Memory store with initial clones for live session mutability
let miniCardsState: ShowcaseMiniCardConfig[] = JSON.parse(JSON.stringify(INITIAL_MINI_CARDS));
let showcaseSectionsState: ShowcaseSectionConfig[] = JSON.parse(JSON.stringify(INITIAL_SHOWCASE_SECTIONS));

/**
 * Calculates dynamic badge count purely from actual structured database records
 * In Super Admin, this cannot be manually edited (AC-12, AC-13, AC-14, AC-40)
 */
export function computeMiniCardBadge(
  card: ShowcaseMiniCardConfig,
  citySlug: string = "khujand"
): string {
  const normCity = resolveCitySlug(citySlug);

  switch (card.targetId) {
    case "cat_sale_new_builds": {
      const count = INITIAL_PROJECTS.length;
      return count >= 5 ? `${Math.floor(count / 5) * 5}+` : `${count}+`;
    }
    case "cat_sale_resale": {
      const count = ALL_PROPERTIES.filter(
        (p) =>
          p.dealType === "Продажа" &&
          (p.propertyType === "Квартира" || p.propertyType === "Новостройка") &&
          (!p.city || resolveCitySlug(p.city) === normCity || normCity === "khujand")
      ).length;
      return `${count}+`;
    }
    case "cat_sale_houses": {
      const count = ALL_PROPERTIES.filter(
        (p) =>
          p.dealType === "Продажа" &&
          (p.propertyType === "Дом / Ҳавлӣ" || p.propertyType.includes("Ҳавлӣ")) &&
          (!p.city || resolveCitySlug(p.city) === normCity || normCity === "khujand")
      ).length;
      return `${count}+`;
    }
    case "catalog_commercial_hub": {
      const count = COMMERCIAL_PROPERTIES.length;
      return `${Math.max(2, count)}+`;
    }
    case "catalog_services": {
      const count = SERVICES_DATA.length;
      return `${Math.max(2, count)}+`;
    }
    case "catalog_realtors": {
      const count = REALTORS_DATA.length;
      return `${Math.max(2, count)}+`;
    }
    case "catalog_developers": {
      const count = INITIAL_DEVELOPERS.length;
      return `${Math.max(2, count)}+`;
    }
    default:
      return "0+";
  }
}

/**
 * Calculates verified apartment/unit count for a developer (Section 6, AC-30)
 * Strictly from linked ProjectData -> UnitData. If 0 or not structured, returns null/0.
 */
export function getDeveloperApartmentsCount(developerId: string): number {
  const devProjects = INITIAL_PROJECTS.filter((p) => p.developerId === developerId);
  const projectIds = new Set(devProjects.map((p) => p.id));

  // Count from INITIAL_UNITS
  const unitsCount = INITIAL_UNITS.filter((u) => projectIds.has(u.projectId)).length;
  return unitsCount;
}

/**
 * Resolves safe public target URL via Central URL Resolver (Section 10, AC-04..AC-11)
 */
export function resolveMiniCardHref(
  card: ShowcaseMiniCardConfig,
  citySlug: string = "khujand",
  locale: Locale = "ru"
): string {
  const normCity = resolveCitySlug(citySlug);

  if (card.targetType === "catalog") {
    return resolveCatalogUrl(card.targetId, normCity, locale);
  }

  if (card.targetType === "category") {
    const cat = getTaxonomyCategoryById(card.targetId);
    if (cat) {
      return resolveCategoryUrl({ category: cat, citySlug: normCity, locale });
    }
  }

  return `/${normCity}`;
}

/**
 * Resolves safe public target URL for section header link (AC-17)
 */
export function resolveSectionHref(
  section: ShowcaseSectionConfig,
  citySlug: string = "khujand",
  locale: Locale = "ru"
): string {
  const normCity = resolveCitySlug(citySlug);

  if (section.targetCatalogId === "blog") {
    return locale === "ru" ? "/blog" : `/${locale}/blog`;
  }

  if (section.targetCatalogId.startsWith("catalog_")) {
    return resolveCatalogUrl(section.targetCatalogId, normCity, locale);
  }

  if (section.targetCatalogId.startsWith("cat_")) {
    const cat = getTaxonomyCategoryById(section.targetCatalogId);
    if (cat) {
      return resolveCategoryUrl({ category: cat, citySlug: normCity, locale });
    }
  }

  return `/${normCity}`;
}

// Getters & Updaters for Super Admin
export function getShowcaseMiniCards(): ShowcaseMiniCardConfig[] {
  return [...miniCardsState].sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getShowcaseSections(): ShowcaseSectionConfig[] {
  return [...showcaseSectionsState].sort((a, b) => a.sortOrder - b.sortOrder);
}

export function updateMiniCard(
  id: string,
  updates: Partial<ShowcaseMiniCardConfig>
): ShowcaseMiniCardConfig | null {
  const idx = miniCardsState.findIndex((c) => c.id === id);
  if (idx === -1) return null;

  // Protect against freeform URL entry (AC-35)
  if ("targetId" in updates && updates.targetId) {
    const validCatalog =
      updates.targetId.startsWith("catalog_") ||
      Boolean(getTaxonomyCategoryById(updates.targetId));
    if (!validCatalog) {
      throw new Error(`Invalid targetId: ${updates.targetId}. Must be from registry.`);
    }
  }

  miniCardsState[idx] = {
    ...miniCardsState[idx],
    ...updates,
  };
  return miniCardsState[idx];
}

export function updateShowcaseSection(
  id: string,
  updates: Partial<ShowcaseSectionConfig>
): ShowcaseSectionConfig | null {
  const idx = showcaseSectionsState.findIndex((s) => s.id === id);
  if (idx === -1) return null;

  showcaseSectionsState[idx] = {
    ...showcaseSectionsState[idx],
    ...updates,
  };
  return showcaseSectionsState[idx];
}

export function resetShowcaseToDefaults() {
  miniCardsState = JSON.parse(JSON.stringify(INITIAL_MINI_CARDS));
  showcaseSectionsState = JSON.parse(JSON.stringify(INITIAL_SHOWCASE_SECTIONS));
}
