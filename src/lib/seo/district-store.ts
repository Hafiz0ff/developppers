/**
 * District Store & SEO Allowlist Engine
 * Handles City District Configuration, Slugs, and Search Engine Indexing Thresholds
 * Conforms to MASKANI.TJ Specification v1.1 (Section 4 & 5)
 */

import { type Locale, type LocalizedString } from "./taxonomy-store";

export interface DistrictConfig {
  id: string; // e.g. "dist_khujand_18_19"
  citySlug: string; // e.g. "khujand"
  name: LocalizedString;
  slug: LocalizedString;
  hasOwnPage: boolean;
  minListingsForIndex: number; // Default 3
  active: boolean;
  sortOrder: number;
}

const INITIAL_DISTRICTS: DistrictConfig[] = [
  {
    id: "dist_khujand_18_19",
    citySlug: "khujand",
    name: { ru: "18-19 мкр", tg: "маҳаллаи 18-19", en: "18-19 microdistrict" },
    slug: { ru: "18-19-mkr", tg: "18-19-mkr", en: "18-19-mkr" },
    hasOwnPage: true,
    minListingsForIndex: 3,
    active: true,
    sortOrder: 1,
  },
  {
    id: "dist_khujand_20_34",
    citySlug: "khujand",
    name: { ru: "20-34 мкр", tg: "маҳаллаи 20-34", en: "20-34 microdistrict" },
    slug: { ru: "20-34-mkr", tg: "20-34-mkr", en: "20-34-mkr" },
    hasOwnPage: true,
    minListingsForIndex: 3,
    active: true,
    sortOrder: 2,
  },
  {
    id: "dist_khujand_tsentr",
    citySlug: "khujand",
    name: { ru: "Центр", tg: "Марказ", en: "City Center" },
    slug: { ru: "tsentr", tg: "markaz", en: "center" },
    hasOwnPage: true,
    minListingsForIndex: 3,
    active: true,
    sortOrder: 3,
  },
  {
    id: "dist_khujand_panjshanbe",
    citySlug: "khujand",
    name: { ru: "Панчшанбе", tg: "Панҷшанбе", en: "Panjshanbe" },
    slug: { ru: "panjshanbe", tg: "panjshanbe", en: "panjshanbe" },
    hasOwnPage: true,
    minListingsForIndex: 3,
    active: true,
    sortOrder: 4,
  },
  {
    id: "dist_khujand_sogd_pravda",
    citySlug: "khujand",
    name: { ru: "Согдийская правда", tg: "Ҳақиқати Суғд", en: "Sogdian Pravda" },
    slug: { ru: "sogdiyskaya-pravda", tg: "haqiqati-sugd", en: "sogdian-pravda" },
    hasOwnPage: true,
    minListingsForIndex: 3,
    active: true,
    sortOrder: 5,
  },
  {
    id: "dist_khujand_shelkokombinat",
    citySlug: "khujand",
    name: { ru: "Шёлкокомбинат", tg: "Истеҳсолоти Абрешим", en: "Silk Factory" },
    slug: { ru: "shelkokombinat", tg: "abreshim", en: "silk-factory" },
    hasOwnPage: true,
    minListingsForIndex: 3,
    active: true,
    sortOrder: 6,
  },
  {
    id: "dist_khujand_3_mkr",
    citySlug: "khujand",
    name: { ru: "3-й мкр", tg: "маҳаллаи 3", en: "3rd microdistrict" },
    slug: { ru: "3-mkr", tg: "3-mkr", en: "3-mkr" },
    hasOwnPage: true,
    minListingsForIndex: 3,
    active: true,
    sortOrder: 7,
  },
  {
    id: "dist_khujand_syrdarya",
    citySlug: "khujand",
    name: { ru: "Набережная Сырдарьи", tg: "Соҳили Сирдарё", en: "Syr Darya Waterfront" },
    slug: { ru: "syrdarya", tg: "sirdaryo", en: "syrdarya" },
    hasOwnPage: true,
    minListingsForIndex: 3,
    active: true,
    sortOrder: 8,
  },
];

let districtsState: DistrictConfig[] = JSON.parse(JSON.stringify(INITIAL_DISTRICTS));

/**
 * Returns all registered districts
 */
export function getDistricts(citySlug?: string): DistrictConfig[] {
  if (citySlug) {
    return districtsState.filter((d) => d.citySlug === citySlug && d.active);
  }
  return [...districtsState];
}

/**
 * Finds a district by its slug in a specific city
 */
export function findDistrictBySlug(
  citySlug: string,
  slugCandidate: string,
  locale?: Locale
): DistrictConfig | undefined {
  const norm = slugCandidate.toLowerCase().trim();
  return districtsState.find((d) => {
    if (d.citySlug !== citySlug) return false;
    if (locale) {
      return d.slug[locale].toLowerCase() === norm;
    }
    return (
      d.slug.ru.toLowerCase() === norm ||
      d.slug.tg.toLowerCase() === norm ||
      d.slug.en.toLowerCase() === norm
    );
  });
}

/**
 * Evaluates whether a district page is indexable based on listing threshold
 * Strict rule: listingsCount >= minListingsForIndex (default 3) -> true; else false
 */
export function isDistrictIndexable(district: DistrictConfig, listingsCount: number): boolean {
  if (!district.hasOwnPage) return false;
  return listingsCount >= district.minListingsForIndex;
}

/**
 * Upserts a district configuration (Super Admin CRUD)
 */
export function upsertDistrict(district: DistrictConfig): DistrictConfig {
  const idx = districtsState.findIndex((d) => d.id === district.id);
  if (idx >= 0) {
    districtsState[idx] = { ...district };
  } else {
    districtsState.push({ ...district });
  }
  return district;
}

/**
 * Resets districts to defaults
 */
export function resetDistrictsToDefault(): void {
  districtsState = JSON.parse(JSON.stringify(INITIAL_DISTRICTS));
}
