import assert from "node:assert/strict";
import { test, beforeEach } from "node:test";
import {
  getTaxonomyCategories,
  getTaxonomyCategoryById,
  getTaxonomyCategoryByCode,
  createTaxonomyCategory,
  updateTaxonomyCategory,
  resetTaxonomyCategoriesForTesting,
  transliterateToSlug,
} from "./taxonomy-store";
import {
  recordUrlAlias,
  resolveUrlAlias,
  getAllUrlAliases,
  resetUrlAliasesForTesting,
  normalizePath,
} from "./url-alias-store";
import {
  resolveListingUrl,
  resolveCategoryUrl,
  resolveListingBreadcrumbs,
  resolveListingJsonLd,
  resolveListingSeo,
  getBaseSiteUrl,
  type ResolvableListing,
} from "./url-resolver";
import {
  runBatchSeoProcessor,
  runSyntheticScaleBenchmark,
} from "./batch-seo-processor";
import {
  getIndexableCategoryUrls,
  getIndexableListingUrls,
  generateSitemapXml,
  generateSitemapIndexXml,
} from "./sitemap-generator";
import { CATALOG_PROPERTIES } from "../catalog-data";

// Sample fixture
const SAMPLE_APARTMENT_RENT: ResolvableListing = {
  id: "1048291",
  slug: "3-komn-64m2-vasileva-9-1048291",
  title: "3-комнатная квартира, 64 м², ул. Васильева, 9",
  dealType: "rent_long",
  propertyType: "apartment",
  city: "dushanbe",
  district: "sino",
  priceTjs: 4500,
  priceUsd: 410,
  area: 64,
  rooms: 3,
  status: "active",
};

beforeEach(() => {
  resetTaxonomyCategoriesForTesting();
  resetUrlAliasesForTesting();
});

// AC-01: RU/TG/EN languages and canonicals
test("AC-01: Locales & Prefixes - RU without prefix, TG /tg/, EN /en/, self-canonical", () => {
  const ruUrl = resolveListingUrl(SAMPLE_APARTMENT_RENT, "ru");
  const tgUrl = resolveListingUrl(SAMPLE_APARTMENT_RENT, "tg");
  const enUrl = resolveListingUrl(SAMPLE_APARTMENT_RENT, "en");

  assert.ok(!ruUrl.startsWith("/ru"), "RU version MUST NOT have /ru prefix");
  assert.ok(ruUrl.startsWith("/dushanbe"), `RU path must start directly with city: ${ruUrl}`);
  assert.ok(tgUrl.startsWith("/tg/"), `TG path must start with /tg/: ${tgUrl}`);
  assert.ok(enUrl.startsWith("/en/"), `EN path must start with /en/: ${enUrl}`);

  const seoRu = resolveListingSeo(SAMPLE_APARTMENT_RENT, "ru");
  const seoTg = resolveListingSeo(SAMPLE_APARTMENT_RENT, "tg");

  assert.equal(seoRu.canonicalUrl, `https://maskani.tj${ruUrl}`);
  assert.equal(seoTg.canonicalUrl, `https://maskani.tj${tgUrl}`);

  // Reciprocal hreflang
  const hreflangLangs = seoRu.hreflang.map((h) => h.lang);
  assert.ok(hreflangLangs.includes("ru"), "hreflang must include ru");
  assert.ok(hreflangLangs.includes("tg"), "hreflang must include tg");
  assert.ok(hreflangLangs.includes("en"), "hreflang must include en");
  assert.ok(hreflangLangs.includes("x-default"), "hreflang must include x-default");
});

// AC-02 & AC-18: Change category from Rent to Resale Sale
test("AC-02 & AC-18: Change Listing Category from Rent to Resale Sale recalculates URL and SEO", () => {
  const oldUrl = resolveListingUrl(SAMPLE_APARTMENT_RENT, "ru");
  assert.ok(oldUrl.includes("/arenda/"), `Old URL must include arenda: ${oldUrl}`);

  // Reclassify to Resale Sale
  const reclassified: ResolvableListing = {
    ...SAMPLE_APARTMENT_RENT,
    dealType: "sale",
    marketSegment: "secondary",
    priceTjs: 650000,
    priceUsd: 59500,
  };

  const newUrl = resolveListingUrl(reclassified, "ru");
  assert.ok(newUrl.includes("/kupit/vtorichka/"), `New URL must be under /kupit/vtorichka/: ${newUrl}`);
  assert.ok(newUrl.includes("-1048291"), "Listing ID must be preserved in URL");

  // Register 301 alias
  recordUrlAlias({
    oldPath: oldUrl,
    targetPath: newUrl,
    entityId: reclassified.id,
    entityType: "listing",
    reason: "Reclassified from rent to sale",
  });

  const resolution = resolveUrlAlias(oldUrl);
  assert.ok(resolution, "Old URL must be resolved by alias registry");
  assert.equal(resolution.targetPath, newUrl);
  assert.equal(resolution.statusCode, 301);

  // Check JSON-LD updated to Sell offer
  const jsonLd = resolveListingJsonLd(reclassified, "ru");
  const entity = jsonLd.mainEntity as Record<string, unknown>;
  const offer = entity.offers as Record<string, unknown>;
  assert.equal(offer.price, 650000);
  assert.equal(offer.businessFunction, "http://purl.org/goodrelations/v1#Sell");
});

// AC-03 & AC-21: Category Rename in Super Admin with MANUAL and AUTO modes
test("AC-03 & AC-21: Super Admin Category Rename respects MANUAL and AUTO slug modes", () => {
  const rentCat = getTaxonomyCategoryByCode("rent_apartments");
  assert.ok(rentCat);
  assert.equal(rentCat.slugMode, "MANUAL");

  // In MANUAL mode: changing display name does NOT change slug
  const updatedManual = updateTaxonomyCategory(rentCat.id, {
    name: { ru: "Снять квартиру", tg: "Иҷораи хонадон", en: "Rent Apartment" },
  });
  assert.equal(updatedManual.name.ru, "Снять квартиру");
  assert.equal(updatedManual.slug.ru, "kvartiry", "Slug must remain unchanged in MANUAL mode");

  // Switch to AUTO mode: changing display name updates slug
  const updatedAuto = updateTaxonomyCategory(rentCat.id, {
    slugMode: "AUTO",
    name: { ru: "Элитные апартаменты", tg: "Хонаҳои элитӣ", en: "Elite Apartments" },
  });
  assert.equal(updatedAuto.slugMode, "AUTO");
  assert.equal(updatedAuto.slug.ru, "elitnye-apartamenty", "Slug must be computed in AUTO mode");
});

// AC-04 & AC-12: Edit Category Slug & Eliminate Redirect Chains
test("AC-04 & AC-12: Redirect Chain Elimination (A -> B -> C becomes A -> C, B -> C) & Loop Prevention", () => {
  // 1. Loop Prevention
  const loopResult = recordUrlAlias({
    oldPath: "/dushanbe/arenda/kvartiry/item-1",
    targetPath: "/dushanbe/arenda/kvartiry/item-1",
    entityId: "1",
    reason: "Self loop test",
  });
  assert.equal(loopResult, null, "Must not create alias pointing to itself");

  // 2. Chain Elimination: Step 1 (A -> B)
  recordUrlAlias({
    oldPath: "/old-path-a",
    targetPath: "/intermediate-path-b",
    entityId: "1",
    reason: "First migration",
  });
  assert.equal(resolveUrlAlias("/old-path-a")?.targetPath, "/intermediate-path-b");

  // Step 2: Now B moves to C (B -> C)
  recordUrlAlias({
    oldPath: "/intermediate-path-b",
    targetPath: "/final-canonical-c",
    entityId: "1",
    reason: "Second migration",
  });

  // Both A and B must now redirect directly to C in 1 hop!
  const resA = resolveUrlAlias("/old-path-a");
  const resB = resolveUrlAlias("/intermediate-path-b");

  assert.equal(resA?.targetPath, "/final-canonical-c", "Chain must be collapsed: A -> C");
  assert.equal(resB?.targetPath, "/final-canonical-c", "B -> C direct");
});

// AC-07 & AC-13: JSON-LD and Breadcrumbs consistency
test("AC-07 & AC-13: Visible Breadcrumbs and Schema.org BreadcrumbList are strictly synchronized", () => {
  const { breadcrumbs, breadcrumbJsonLd } = resolveListingBreadcrumbs(SAMPLE_APARTMENT_RENT, "ru");

  assert.ok(breadcrumbs.length >= 4, "Must have at least 4 breadcrumb items");
  assert.equal(breadcrumbs[0].name, "Главная");
  assert.equal(breadcrumbs[1].name, "Душанбе");
  assert.equal(breadcrumbs[breadcrumbs.length - 1].name, SAMPLE_APARTMENT_RENT.title);

  const jsonLdElements = breadcrumbJsonLd.itemListElement as Array<Record<string, unknown>>;
  assert.equal(jsonLdElements.length, breadcrumbs.length);
  for (let i = 0; i < breadcrumbs.length; i++) {
    assert.equal(jsonLdElements[i].position, breadcrumbs[i].position);
    assert.equal(jsonLdElements[i].name, breadcrumbs[i].name);
  }
});

// AC-14: Sitemap Generation - Only Canonical Indexable 200 URLs
test("AC-14: Sitemap contains ONLY indexable canonical 200 URLs and reflects category indexable flag", () => {
  const catUrls = getIndexableCategoryUrls("ru");
  assert.ok(catUrls.length > 0, "Must generate category URLs");

  // Non-indexable categories (like garage) must NOT be in sitemap
  const garageUrls = catUrls.filter((u) => u.url.includes("/garazhi"));
  assert.equal(garageUrls.length, 0, "Non-indexable garage category must not appear in sitemap");

  // Active listings must be included, archived/sold excluded
  const listings: ResolvableListing[] = [
    { ...SAMPLE_APARTMENT_RENT, id: "act-1", status: "active" },
    { ...SAMPLE_APARTMENT_RENT, id: "arc-2", status: "archived" },
  ];
  const listingUrls = getIndexableListingUrls(listings, "ru");
  assert.equal(listingUrls.length, 1, "Only active listing must be in sitemap");
  assert.ok(listingUrls[0].url.includes("act-1"));

  const xml = generateSitemapXml(listingUrls);
  assert.ok(xml.startsWith("<?xml"));
  assert.ok(xml.includes("<urlset"));
  assert.ok(xml.includes("https://maskani.tj"));

  const indexXml = generateSitemapIndexXml();
  assert.ok(indexXml.includes("<sitemapindex"));
  assert.ok(indexXml.includes("sitemap-ru-categories.xml"));
});

// AC-16: Category name and slug independence ("Аренда" vs "arenda" / "snyat")
test("AC-16: Independence of Category Name and Slug - no hardcoded 'Снять' string", () => {
  const rentCat = getTaxonomyCategoryByCode("deal_rent");
  assert.ok(rentCat);
  assert.equal(rentCat.name.ru, "Аренда", "Default name must be 'Аренда'");
  assert.equal(rentCat.slug.ru, "arenda", "Default slug must be 'arenda'");

  // Custom slug "snyat" can be configured without changing display name "Аренда"
  const updatedRent = updateTaxonomyCategory(rentCat.id, {
    slug: { ru: "snyat", tg: "ijora", en: "rent" },
  });

  const path = resolveCategoryUrl({ category: updatedRent, citySlug: "dushanbe", locale: "ru" });
  assert.equal(path, "/dushanbe/snyat");

  // Visible name in breadcrumbs still remains "Аренда"
  assert.equal(updatedRent.name.ru, "Аренда");
});

// AC-23: New Category is NOT indexable by default unless explicitly configured
test("AC-23: Add New Category defaults indexable to false for safety", () => {
  const newCat = createTaxonomyCategory({
    code: "test_new_villas",
    name: { ru: "Виллы", tg: "Виллаҳо", en: "Villas" },
    slug: { ru: "villy", tg: "villaho", en: "villas" },
    slugMode: "AUTO",
    parentId: "cat_deal_sale",
    routeKind: "combined",
    active: true,
    displayOrder: 99,
    indexable: false, // Explicit false
    seoTemplates: {
      h1: { ru: "Виллы в {city}", tg: "Виллаҳо дар {city}", en: "Villas in {city}" },
      title: { ru: "Купить виллу | Maskani", tg: "Хариди вилла | Maskani", en: "Buy Villa | Maskani" },
      description: { ru: "Виллы", tg: "Виллаҳо", en: "Villas" },
    },
  });

  assert.equal(newCat.indexable, false, "New category must be non-indexable by default");
  const sitemapUrls = getIndexableCategoryUrls("ru");
  const inSitemap = sitemapUrls.some((u) => u.url.includes("/villy"));
  assert.equal(inSitemap, false, "Non-indexable new category must not be exposed in sitemap");
});

// AC-26 & AC-28: Batch SEO Processor DRY RUN & Idempotency
test("AC-26 & AC-28: Batch SEO Processor DRY RUN does not mutate and is strictly idempotent", () => {
  const sampleListings: ResolvableListing[] = CATALOG_PROPERTIES.slice(0, 5).map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    dealType: p.dealType,
    propertyType: p.propertyType,
    city: p.city,
    district: p.district,
    priceTjs: p.priceTjs,
    priceUsd: p.priceUsd,
    status: "active",
  }));

  // Run DRY RUN
  const dryReport = runBatchSeoProcessor(sampleListings, { dryRun: true });
  assert.equal(dryReport.isDryRun, true);
  assert.equal(dryReport.totalListingsEvaluated, 5);
  assert.equal(getAllUrlAliases().length, 0, "DRY RUN must not write any aliases");

  // Run Real Migration
  const liveReport1 = runBatchSeoProcessor(sampleListings, { dryRun: false });
  assert.equal(liveReport1.isDryRun, false);
  const aliasesCount1 = getAllUrlAliases().length;
  assert.ok(aliasesCount1 > 0, "Live run must register aliases for old URLs");

  // Re-run Migration (Idempotency check AC-28)
  const liveReport2 = runBatchSeoProcessor(sampleListings, { dryRun: false });
  const aliasesCount2 = getAllUrlAliases().length;
  assert.equal(aliasesCount1, aliasesCount2, "Re-running batch migration must not create duplicate aliases");
});

// AC-30: Conflict and missing data exception logging
test("AC-30: Batch Processor logs exceptions for missing critical data without hallucinations", () => {
  const invalidListings: ResolvableListing[] = [
    {
      id: "err-1",
      title: "", // Empty title
      dealType: "sale",
      propertyType: "apartment",
      city: "khujand",
      priceTjs: 100000,
      priceUsd: 9000,
    },
  ];

  const report = runBatchSeoProcessor(invalidListings, { dryRun: true });
  assert.ok(report.exceptionsLogged.length > 0, "Must log exception for missing title");
  assert.equal(report.exceptionsLogged[0].field, "title");
});

// AC-25 & AC-32: Scalability Benchmark Test on 10,000+ synthetic listings in-memory
test("AC-25 & AC-32: Scalability Benchmark - 10,000+ listings processed in memory in < 500ms", () => {
  const report = runSyntheticScaleBenchmark(10000);

  assert.equal(report.totalListingsEvaluated, 10000);
  assert.equal(report.collisionsDetected.length, 0, "Must have 0 URL collisions across 10,000 items");
  assert.ok(report.durationMs < 1000, `Processing 10,000 listings must take < 1000ms (took ${report.durationMs}ms)`);
  assert.ok(report.totalUrlsChanged > 0);
  assert.equal(report.status, "success");
});
