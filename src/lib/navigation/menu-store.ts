/**
 * Navigation Menu Store & Mega-Menu Configuration Engine
 * Single Source of Truth for Header Mega-Menus, Top-Level Links, and Actions
 * Conforms to MASKANI.TJ Specification v1.1 (Sections 10.1 - 10.4)
 */

import { type LocalizedString } from "../seo/taxonomy-store";

export type MenuLocation = "header_main" | "header_action" | "footer" | "mobile";

export type MenuItemType =
  | "group-header" // Pure UI label/group separator: NEVER generates a link, canonical, or sitemap entry
  | "link-to-category" // Resolves dynamically to category URL
  | "link-to-facet" // Resolves dynamically to facet URL
  | "link-to-catalog" // Resolves to city catalogs (commercial hub, developers, agencies, services)
  | "link-to-static-page" // Resolves to static or custom URLs
  | "action-button"; // CTA trigger (e.g., Post Ad modal)

export interface MenuItem {
  id: string; // Stable ID
  menuLocation: MenuLocation;
  type: MenuItemType;
  label: LocalizedString;
  targetType?: "category" | "facet" | "catalog" | "url";
  targetId?: string; // Reference to Category ID, Facet ID, or Catalog Key
  customUrl?: LocalizedString;
  parentId?: string | null;
  column?: number; // 1 or 2 for 2-column mega-menu
  sortOrder: number;
  isActive: boolean;
  badge?: LocalizedString;
}

export interface MenuItemTree extends MenuItem {
  children?: MenuItemTree[];
}

const INITIAL_MENU_ITEMS: MenuItem[] = [
  // =========================================================================
  // 1. TOP-LEVEL MEGA-MENU: "Купить"
  // =========================================================================
  {
    id: "nav_buy",
    menuLocation: "header_main",
    type: "link-to-category",
    label: { ru: "Купить", tg: "Харидан", en: "Buy" },
    targetType: "catalog",
    targetId: "catalog_buy_hub",
    parentId: null,
    sortOrder: 1,
    isActive: true,
  },
  // Column 1: Квартиры & Дополнительные объекты
  {
    id: "grp_buy_apartments",
    menuLocation: "header_main",
    type: "group-header",
    label: { ru: "Квартиры", tg: "Хонаҳо", en: "Apartments" },
    parentId: "nav_buy",
    column: 1,
    sortOrder: 1,
    isActive: true,
  },
  {
    id: "link_buy_new_builds",
    menuLocation: "header_main",
    type: "link-to-category",
    label: { ru: "Новостройки", tg: "Биноҳои нав", en: "New Buildings" },
    targetType: "category",
    targetId: "cat_sale_new_builds",
    parentId: "nav_buy",
    column: 1,
    sortOrder: 2,
    isActive: true,
  },
  {
    id: "link_buy_resale",
    menuLocation: "header_main",
    type: "link-to-category",
    label: { ru: "Вторичка", tg: "Бозори дуюмдараҷа", en: "Resale" },
    targetType: "category",
    targetId: "cat_sale_resale",
    parentId: "nav_buy",
    column: 1,
    sortOrder: 3,
    isActive: true,
  },
  {
    id: "grp_buy_additional",
    menuLocation: "header_main",
    type: "group-header",
    label: { ru: "Дополнительные объекты", tg: "Объектҳои иловагӣ", en: "Additional Properties" },
    parentId: "nav_buy",
    column: 1,
    sortOrder: 4,
    isActive: true,
  },
  {
    id: "link_buy_garage",
    menuLocation: "header_main",
    type: "link-to-category",
    label: { ru: "Машино-места", tg: "Ҷойҳои таваққуфгоҳ", en: "Parking Spaces" },
    targetType: "category",
    targetId: "cat_sale_garage",
    parentId: "nav_buy",
    column: 1,
    sortOrder: 5,
    isActive: true,
  },
  {
    id: "link_buy_storage",
    menuLocation: "header_main",
    type: "link-to-category",
    label: { ru: "Кладовые", tg: "Анборҳо", en: "Storage Units" },
    targetType: "category",
    targetId: "cat_sale_storage",
    parentId: "nav_buy",
    column: 1,
    sortOrder: 6,
    isActive: true,
  },
  // Column 2: Дома и участки & Коммерческая недвижимость
  {
    id: "grp_buy_houses_land",
    menuLocation: "header_main",
    type: "group-header",
    label: { ru: "Дома и участки", tg: "Ҳавлиҳо ва қитъаҳо", en: "Houses & Land" },
    parentId: "nav_buy",
    column: 2,
    sortOrder: 1,
    isActive: true,
  },
  {
    id: "link_buy_houses",
    menuLocation: "header_main",
    type: "link-to-category",
    label: { ru: "Дома и дачи", tg: "Ҳавлиҳо ва бӯстонсаро", en: "Houses & Villas" },
    targetType: "category",
    targetId: "cat_sale_houses",
    parentId: "nav_buy",
    column: 2,
    sortOrder: 2,
    isActive: true,
  },
  {
    id: "link_buy_land",
    menuLocation: "header_main",
    type: "link-to-category",
    label: { ru: "Земельные участки", tg: "Қитъаҳои замин", en: "Land Plots" },
    targetType: "category",
    targetId: "cat_sale_land",
    parentId: "nav_buy",
    column: 2,
    sortOrder: 3,
    isActive: true,
  },
  {
    id: "grp_buy_commercial",
    menuLocation: "header_main",
    type: "group-header",
    label: { ru: "Коммерческая недвижимость", tg: "Амволи тиҷоратӣ", en: "Commercial Property" },
    parentId: "nav_buy",
    column: 2,
    sortOrder: 4,
    isActive: true,
  },
  {
    id: "link_buy_comm_all",
    menuLocation: "header_main",
    type: "link-to-category",
    label: { ru: "Все коммерческие объекты", tg: "Ҳамаи амволи тиҷоратӣ", en: "All Commercial" },
    targetType: "category",
    targetId: "cat_sale_commercial",
    parentId: "nav_buy",
    column: 2,
    sortOrder: 5,
    isActive: true,
  },
  {
    id: "link_buy_comm_office",
    menuLocation: "header_main",
    type: "link-to-facet",
    label: { ru: "Офисы", tg: "Дафтарҳо", en: "Offices" },
    targetType: "facet",
    targetId: "facet_sale_comm_office",
    parentId: "nav_buy",
    column: 2,
    sortOrder: 6,
    isActive: true,
  },
  {
    id: "link_buy_comm_retail",
    menuLocation: "header_main",
    type: "link-to-facet",
    label: { ru: "Торговые и склады", tg: "Тиҷорат ва анборҳо", en: "Retail & Warehouses" },
    targetType: "facet",
    targetId: "facet_sale_comm_retail_warehouse",
    parentId: "nav_buy",
    column: 2,
    sortOrder: 7,
    isActive: true,
  },

  // =========================================================================
  // 2. TOP-LEVEL MEGA-MENU: "Арендовать"
  // =========================================================================
  {
    id: "nav_rent",
    menuLocation: "header_main",
    type: "link-to-category",
    label: { ru: "Арендовать", tg: "Иҷора", en: "Rent" },
    targetType: "catalog",
    targetId: "catalog_rent_hub",
    parentId: null,
    sortOrder: 2,
    isActive: true,
  },
  // Column 1: Жилье
  {
    id: "grp_rent_living",
    menuLocation: "header_main",
    type: "group-header",
    label: { ru: "Жилье", tg: "Манзил", en: "Living" },
    parentId: "nav_rent",
    column: 1,
    sortOrder: 1,
    isActive: true,
  },
  {
    id: "link_rent_apartments",
    menuLocation: "header_main",
    type: "link-to-category",
    label: { ru: "Квартиры", tg: "Хонаҳо", en: "Apartments" },
    targetType: "category",
    targetId: "cat_rent_apartments",
    parentId: "nav_rent",
    column: 1,
    sortOrder: 2,
    isActive: true,
  },
  {
    id: "link_rent_rooms",
    menuLocation: "header_main",
    type: "link-to-category",
    label: { ru: "Комнаты", tg: "Ҳуҷраҳо", en: "Rooms" },
    targetType: "category",
    targetId: "cat_rent_rooms",
    parentId: "nav_rent",
    column: 1,
    sortOrder: 3,
    isActive: true,
  },
  {
    id: "link_rent_houses",
    menuLocation: "header_main",
    type: "link-to-category",
    label: { ru: "Дома и дачи", tg: "Ҳавлиҳо ва бӯстонсаро", en: "Houses & Villas" },
    targetType: "category",
    targetId: "cat_rent_houses",
    parentId: "nav_rent",
    column: 1,
    sortOrder: 4,
    isActive: true,
  },
  // Column 2: Дополнительные объекты & Коммерческая недвижимость
  {
    id: "grp_rent_additional",
    menuLocation: "header_main",
    type: "group-header",
    label: { ru: "Дополнительные объекты", tg: "Объектҳои иловагӣ", en: "Additional Properties" },
    parentId: "nav_rent",
    column: 2,
    sortOrder: 1,
    isActive: true,
  },
  {
    id: "link_rent_garage",
    menuLocation: "header_main",
    type: "link-to-category",
    label: { ru: "Машино-места", tg: "Ҷойҳои таваққуфгоҳ", en: "Parking Spaces" },
    targetType: "category",
    targetId: "cat_rent_garage",
    parentId: "nav_rent",
    column: 2,
    sortOrder: 2,
    isActive: true,
  },
  {
    id: "link_rent_storage",
    menuLocation: "header_main",
    type: "link-to-category",
    label: { ru: "Кладовые", tg: "Анборҳо", en: "Storage Units" },
    targetType: "category",
    targetId: "cat_rent_storage",
    parentId: "nav_rent",
    column: 2,
    sortOrder: 3,
    isActive: true,
  },
  {
    id: "grp_rent_commercial",
    menuLocation: "header_main",
    type: "group-header",
    label: { ru: "Коммерческая недвижимость", tg: "Амволи тиҷоратӣ", en: "Commercial Property" },
    parentId: "nav_rent",
    column: 2,
    sortOrder: 4,
    isActive: true,
  },
  {
    id: "link_rent_comm_all",
    menuLocation: "header_main",
    type: "link-to-category",
    label: { ru: "Все коммерческие объекты", tg: "Ҳамаи амволи тиҷоратӣ", en: "All Commercial" },
    targetType: "category",
    targetId: "cat_rent_commercial",
    parentId: "nav_rent",
    column: 2,
    sortOrder: 5,
    isActive: true,
  },
  {
    id: "link_rent_comm_office",
    menuLocation: "header_main",
    type: "link-to-facet",
    label: { ru: "Офисы", tg: "Дафтарҳо", en: "Offices" },
    targetType: "facet",
    targetId: "facet_rent_comm_office",
    parentId: "nav_rent",
    column: 2,
    sortOrder: 6,
    isActive: true,
  },
  {
    id: "link_rent_comm_retail",
    menuLocation: "header_main",
    type: "link-to-facet",
    label: { ru: "Торговые и склады", tg: "Тиҷорат ва анборҳо", en: "Retail & Warehouses" },
    targetType: "facet",
    targetId: "facet_rent_comm_retail_warehouse",
    parentId: "nav_rent",
    column: 2,
    sortOrder: 7,
    isActive: true,
  },

  // =========================================================================
  // 3. TOP-LEVEL DIRECT LINK: "Новостройки"
  // =========================================================================
  {
    id: "nav_new_buildings",
    menuLocation: "header_main",
    type: "link-to-category",
    label: { ru: "Новостройки", tg: "Биноҳои нав", en: "New Buildings" },
    targetType: "category",
    targetId: "cat_sale_new_builds",
    parentId: null,
    sortOrder: 3,
    isActive: true,
  },

  // =========================================================================
  // 4. TOP-LEVEL DIRECT LINK: "Коммерция" (Commercial Hub)
  // =========================================================================
  {
    id: "nav_commercial_hub",
    menuLocation: "header_main",
    type: "link-to-catalog",
    label: { ru: "Коммерция", tg: "Тиҷоратӣ", en: "Commercial" },
    targetType: "catalog",
    targetId: "catalog_commercial_hub",
    parentId: null,
    sortOrder: 4,
    isActive: true,
  },

  // =========================================================================
  // 5. TOP-LEVEL DIRECT LINK: "Услуги"
  // =========================================================================
  {
    id: "nav_services",
    menuLocation: "header_main",
    type: "link-to-catalog",
    label: { ru: "Услуги", tg: "Хизматрасониҳо", en: "Services" },
    targetType: "catalog",
    targetId: "catalog_services",
    parentId: null,
    sortOrder: 5,
    isActive: true,
  },

  // =========================================================================
  // 6. TOP-LEVEL DROPDOWN: "Компании" (Застройщики & Агентства)
  // =========================================================================
  {
    id: "nav_companies",
    menuLocation: "header_main",
    type: "link-to-catalog",
    label: { ru: "Компании", tg: "Ширкатҳо", en: "Companies" },
    targetType: "catalog",
    targetId: "catalog_companies",
    parentId: null,
    sortOrder: 6,
    isActive: true,
  },
  {
    id: "link_companies_devs",
    menuLocation: "header_main",
    type: "link-to-catalog",
    label: { ru: "Застройщики", tg: "Ширкатҳои сохтмонӣ", en: "Developers" },
    targetType: "catalog",
    targetId: "catalog_developers",
    parentId: "nav_companies",
    sortOrder: 1,
    isActive: true,
  },
  {
    id: "link_companies_agencies",
    menuLocation: "header_main",
    type: "link-to-catalog",
    label: { ru: "Агентства недвижимости", tg: "Агентиҳои амвол", en: "Real Estate Agencies" },
    targetType: "catalog",
    targetId: "catalog_agencies",
    parentId: "nav_companies",
    sortOrder: 2,
    isActive: true,
  },

  // =========================================================================
  // 7. HEADER ACTION: "Подать объявление"
  // =========================================================================
  {
    id: "nav_action_post",
    menuLocation: "header_action",
    type: "action-button",
    label: { ru: "Подать объявление", tg: "Эълон додан", en: "Post Listing" },
    targetType: "url",
    targetId: "action_post_ad",
    parentId: null,
    sortOrder: 1,
    isActive: true,
  },
];

let menuState: MenuItem[] = JSON.parse(JSON.stringify(INITIAL_MENU_ITEMS));

/**
 * Returns flat list of menu items for a given location (or all)
 */
export function getMenuItems(menuLocation?: MenuLocation): MenuItem[] {
  if (menuLocation) {
    return menuState
      .filter((m) => m.menuLocation === menuLocation && m.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }
  return [...menuState];
}

/**
 * Returns hierarchical tree structure for mega-menus and dropdowns
 */
export function getMenuItemsTree(menuLocation: MenuLocation = "header_main"): MenuItemTree[] {
  const items = menuState
    .filter((m) => m.menuLocation === menuLocation && m.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const topLevel: MenuItemTree[] = items
    .filter((m) => !m.parentId)
    .map((m) => ({ ...m, children: [] }));

  for (const parent of topLevel) {
    parent.children = items
      .filter((m) => m.parentId === parent.id)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }

  return topLevel;
}

/**
 * Returns a menu item by ID
 */
export function getMenuItemById(id: string): MenuItem | undefined {
  return menuState.find((m) => m.id === id);
}

/**
 * Upserts a menu item into the store (Super Admin CRUD)
 */
export function upsertMenuItem(item: MenuItem): MenuItem {
  const existingIdx = menuState.findIndex((m) => m.id === item.id);
  if (existingIdx >= 0) {
    menuState[existingIdx] = { ...item };
  } else {
    menuState.push({ ...item });
  }
  return item;
}

/**
 * Deletes a menu item by ID
 */
export function deleteMenuItem(id: string): boolean {
  const beforeLen = menuState.length;
  menuState = menuState.filter((m) => m.id !== id && m.parentId !== id);
  return menuState.length < beforeLen;
}

/**
 * Reorders menu items given an ordered array of IDs
 */
export function reorderMenuItems(orderedIds: string[]): void {
  orderedIds.forEach((id, index) => {
    const item = menuState.find((m) => m.id === id);
    if (item) {
      item.sortOrder = index + 1;
    }
  });
}

/**
 * Resets menu items to initial default state
 */
export function resetMenuToDefault(): void {
  menuState = JSON.parse(JSON.stringify(INITIAL_MENU_ITEMS));
}
