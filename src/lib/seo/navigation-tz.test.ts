import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  getTaxonomyCategories,
  getTaxonomyCategoryById,
} from "./taxonomy-store";
import {
  getFacets,
  getFacetsByCategory,
  findFacetBySlug,
  getFacetById,
  upsertFacet,
  deleteFacet,
  resetFacetsToDefault,
} from "./facet-store";
import {
  getMenuItems,
  getMenuItemsTree,
  getMenuItemById,
  resetMenuToDefault,
} from "../navigation/menu-store";
import {
  getDistricts,
  findDistrictBySlug,
  isDistrictIndexable,
  resetDistrictsToDefault,
} from "./district-store";
import {
  resolveFacetUrl,
  resolveCatalogUrl,
  resolveMenuItemUrl,
  resolveCategoryUrl,
} from "./url-resolver";

describe("MASKANI.TJ Specification v1.1 — Navigation, Categories & Facet Store", () => {
  test("Taxonomy Store: New categories from TZ Matrix exist with correct indexable flags", () => {
    const cats = getTaxonomyCategories();

    // 1. Storage sale
    const storageSale = getTaxonomyCategoryById("cat_sale_storage");
    assert.ok(storageSale, "cat_sale_storage must exist");
    assert.equal(storageSale?.slug.ru, "kladovye");
    assert.equal(storageSale?.indexable, false, "cat_sale_storage must NOT be indexable by default");

    // 2. Parking renamed to Машино-места
    const garageSale = getTaxonomyCategoryById("cat_sale_garage");
    assert.ok(garageSale, "cat_sale_garage must exist");
    assert.equal(garageSale?.name.ru, "Машино-места");
    assert.equal(garageSale?.slug.ru, "garazhi", "Canonical slug must be preserved without breaks");

    // 3. Rent categories
    const rentRooms = getTaxonomyCategoryById("cat_rent_rooms");
    assert.ok(rentRooms, "cat_rent_rooms must exist");
    assert.equal(rentRooms?.slug.ru, "komnaty");
    assert.equal(rentRooms?.indexable, true);

    const rentHouses = getTaxonomyCategoryById("cat_rent_houses");
    assert.ok(rentHouses, "cat_rent_houses must exist");
    assert.equal(rentHouses?.slug.ru, "doma");

    const rentCommercial = getTaxonomyCategoryById("cat_rent_commercial");
    assert.ok(rentCommercial, "cat_rent_commercial must exist");
    assert.equal(rentCommercial?.slug.ru, "kommercheskaya");

    const rentGarage = getTaxonomyCategoryById("cat_rent_garage");
    assert.ok(rentGarage, "cat_rent_garage must exist");
    assert.equal(rentGarage?.indexable, false);

    const rentStorage = getTaxonomyCategoryById("cat_rent_storage");
    assert.ok(rentStorage, "cat_rent_storage must exist");
    assert.equal(rentStorage?.indexable, false);
  });

  test("Facet Store: Commercial and Room facets resolve and support CRUD", () => {
    resetFacetsToDefault();

    // Commercial sale facets
    const saleFacets = getFacetsByCategory("cat_sale_commercial");
    assert.equal(saleFacets.length, 2);

    const officeFacet = findFacetBySlug("cat_sale_commercial", "ofisy", "ru");
    assert.ok(officeFacet, "Office facet must resolve in RU");
    assert.equal(officeFacet?.displayName.ru, "Офисы");
    assert.equal(officeFacet?.hasOwnPage, true);
    assert.equal(officeFacet?.indexable, true);

    // Multilingual slug check
    const officeTg = findFacetBySlug("cat_sale_commercial", "daftarho", "tg");
    assert.equal(officeTg?.id, officeFacet?.id);

    const officeEn = findFacetBySlug("cat_sale_commercial", "offices", "en");
    assert.equal(officeEn?.id, officeFacet?.id);

    // URL resolution
    const urlRu = resolveFacetUrl({ facet: officeFacet!, citySlug: "khujand", locale: "ru" });
    assert.equal(urlRu, "/khujand/kupit/kommercheskaya/ofisy");

    const urlTg = resolveFacetUrl({ facet: officeFacet!, citySlug: "khujand", locale: "tg" });
    assert.equal(urlTg, "/tg/khujand/furosh/tijorati/daftarho");

    const urlEn = resolveFacetUrl({ facet: officeFacet!, citySlug: "khujand", locale: "en" });
    assert.equal(urlEn, "/en/khujand/sale/commercial/offices");
  });

  test("District Store: District registry and allowlist indexability rules", () => {
    resetDistrictsToDefault();

    const districts = getDistricts("khujand");
    assert.ok(districts.length >= 8, "Khujand should have at least 8 key districts");

    const dist1819 = findDistrictBySlug("khujand", "18-19-mkr");
    assert.ok(dist1819, "18-19 mkr must be found");
    assert.equal(dist1819?.name.ru, "18-19 мкр");

    // Under threshold rule (< 3 listings) -> noindex
    assert.equal(isDistrictIndexable(dist1819!, 0), false);
    assert.equal(isDistrictIndexable(dist1819!, 2), false);

    // Meet or exceed threshold (>= 3 listings) -> indexable
    assert.equal(isDistrictIndexable(dist1819!, 3), true);
    assert.equal(isDistrictIndexable(dist1819!, 10), true);
  });

  test("Menu Store: Hierarchical Mega-Menu conforms to TZ Section 10", () => {
    resetMenuToDefault();

    const tree = getMenuItemsTree("header_main");
    assert.ok(tree.length >= 6, "Must have all required top-level menu items");

    // 1. Buy Mega-Menu
    const buyMenu = tree.find((m) => m.id === "nav_buy");
    assert.ok(buyMenu, "nav_buy must exist");
    assert.ok(buyMenu?.children && buyMenu.children.length >= 8);

    // Check Columns
    const col1 = buyMenu?.children?.filter((c) => c.column === 1);
    const col2 = buyMenu?.children?.filter((c) => c.column === 2);
    assert.ok(col1 && col1.length > 0, "Col 1 must have items");
    assert.ok(col2 && col2.length > 0, "Col 2 must have items");

    // Group headers must never resolve to links
    const groupHeader = col1?.find((c) => c.type === "group-header");
    assert.ok(groupHeader, "Group header must exist");
    const groupUrl = resolveMenuItemUrl(groupHeader!);
    assert.equal(groupUrl, "", "Group headers must never have a clickable URL");

    // Dynamic resolution of category and facet menu items
    const resaleLink = col1?.find((c) => c.id === "link_buy_resale");
    assert.ok(resaleLink);
    const resaleUrl = resolveMenuItemUrl(resaleLink!, "khujand", "ru");
    assert.equal(resaleUrl, "/khujand/kupit/vtorichka");

    const officeLink = col2?.find((c) => c.id === "link_buy_comm_office");
    assert.ok(officeLink);
    const commOfficeUrl = resolveMenuItemUrl(officeLink!, "khujand", "ru");
    assert.equal(commOfficeUrl, "/khujand/kupit/kommercheskaya/ofisy");

    // 2. City Catalog URLs
    const commHubUrl = resolveCatalogUrl("catalog_commercial_hub", "khujand", "ru");
    assert.equal(commHubUrl, "/khujand/kommercheskaya");

    const devUrl = resolveCatalogUrl("catalog_developers", "khujand", "ru");
    assert.equal(devUrl, "/khujand/zastroyshchiki");

    const agencyUrl = resolveCatalogUrl("catalog_agencies", "khujand", "ru");
    assert.equal(agencyUrl, "/khujand/agentstva");

    const serviceUrl = resolveCatalogUrl("catalog_services", "khujand", "ru");
    assert.equal(serviceUrl, "/khujand/uslugi");
  });

  test("Super Admin Facet Store CRUD: supports upsert, delete, and indexing toggle", () => {
    resetFacetsToDefault();

    const initialCount = getFacets().length;

    // Create custom facet
    const customFacet = upsertFacet({
      id: "facet_test_warehouse",
      categoryId: "cat_sale_commercial",
      facetKey: "commercial_type",
      valueKey: "warehouse_only",
      displayName: { ru: "Только склады", tg: "Танҳо анборҳо", en: "Warehouses Only" },
      valueSlug: { ru: "tolko-sklady", tg: "tanho-anborho", en: "warehouses-only" },
      hasOwnPage: true,
      indexable: false,
      sortOrder: 99,
      active: true,
      seoTemplates: {
        h1: { ru: "{title}", tg: "{title}", en: "{title}" },
        title: { ru: "{title}", tg: "{title}", en: "{title}" },
        description: { ru: "{description}", tg: "{description}", en: "{description}" },
      },
    });

    assert.equal(getFacets().length, initialCount + 1);
    assert.equal(getFacetById("facet_test_warehouse")?.displayName.ru, "Только склады");

    // Toggle indexable
    upsertFacet({ ...customFacet, indexable: true });
    assert.equal(getFacetById("facet_test_warehouse")?.indexable, true);

    // Delete
    deleteFacet("facet_test_warehouse");
    assert.equal(getFacets().length, initialCount);
    assert.equal(getFacetById("facet_test_warehouse"), undefined);
  });
});
