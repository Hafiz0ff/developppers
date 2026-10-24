import test from "node:test";
import assert from "node:assert/strict";
import { getLocalizedPath } from "@/context/language-context";
import { translations } from "@/lib/i18n/translations";
import { formatPublicationDate, formatPricePerSquareMeter } from "@/lib/classifieds/format-utils";
import { formatNewBuildingPricePerMeter, getPricePerMeterLabel } from "@/lib/pricing/new-building-price";
import {
  resolveListingUrl,
  resolveListingSeo,
  resolveCategoryUrl,
  resolveCityDisplayName,
  type ResolvableListing,
} from "./url-resolver";
import { getTaxonomyCategoryById } from "./taxonomy-store";

test("Multilingual Routes: getLocalizedPath maps URLs correctly without /ru/ prefix", () => {
  // From root
  assert.equal(getLocalizedPath("/", "ru"), "/");
  assert.equal(getLocalizedPath("/", "tg"), "/tg");
  assert.equal(getLocalizedPath("/", "en"), "/en");

  // From localized root
  assert.equal(getLocalizedPath("/tg", "ru"), "/");
  assert.equal(getLocalizedPath("/tg", "en"), "/en");
  assert.equal(getLocalizedPath("/en", "ru"), "/");
  assert.equal(getLocalizedPath("/en", "tg"), "/tg");

  // From catalog / interior paths
  assert.equal(getLocalizedPath("/classifieds", "ru"), "/classifieds");
  assert.equal(getLocalizedPath("/classifieds", "tg"), "/tg/classifieds");
  assert.equal(getLocalizedPath("/classifieds", "en"), "/en/classifieds");

  // From localized paths back to RU (strictly prefixless)
  assert.equal(getLocalizedPath("/tg/classifieds", "ru"), "/classifieds");
  assert.equal(getLocalizedPath("/en/classifieds", "ru"), "/classifieds");
  assert.equal(getLocalizedPath("/tg/projects/kayrakkum-avenue", "ru"), "/projects/kayrakkum-avenue");

  // Switching between secondary languages
  assert.equal(getLocalizedPath("/tg/classifieds", "en"), "/en/classifieds");
  assert.equal(getLocalizedPath("/en/projects", "tg"), "/tg/projects");

  // Strip accidental /ru/ prefix if encountered
  assert.equal(getLocalizedPath("/ru/classifieds", "ru"), "/classifieds");
  assert.equal(getLocalizedPath("/ru", "ru"), "/");
});

test("Multilingual Translations: all required keys exist in RU, TG, and EN", () => {
  const languages = ["ru", "tg", "en"] as const;

  for (const lang of languages) {
    const t = translations[lang];
    assert.ok(t, `Translations for ${lang} must exist`);
    assert.ok(t.common.save, `${lang}.common.save must exist`);
    assert.ok(t.common.cancel, `${lang}.common.cancel must exist`);
    assert.ok(t.nav.home, `${lang}.nav.home must exist`);
    assert.ok(t.nav.newBuildings, `${lang}.nav.newBuildings must exist`);
    assert.ok(t.nav.resale, `${lang}.nav.resale must exist`);
    assert.ok(t.catalog.title, `${lang}.catalog.title must exist`);
    assert.ok(t.realty.complex, `${lang}.realty.complex must exist`);
    assert.ok(t.showcase.bookApartment, `${lang}.showcase.bookApartment must exist`);
  }
});

test("Multilingual Formatting: dates and price per meter in RU, TG, EN", () => {
  const fixedDate = new Date("2026-10-15T11:54:00Z");

  const dateRu = formatPublicationDate(fixedDate, "ru");
  const dateTg = formatPublicationDate(fixedDate, "tg");
  const dateEn = formatPublicationDate(fixedDate, "en");

  assert.ok(dateRu.includes("Публикация"), `RU date should have 'Публикация', got: ${dateRu}`);
  assert.ok(dateTg.includes("Нашр"), `TG date should have 'Нашр', got: ${dateTg}`);
  assert.ok(dateEn.includes("Published"), `EN date should have 'Published', got: ${dateEn}`);

  const ppmRu = formatPricePerSquareMeter(450000, 50, "ru");
  const ppmTg = formatPricePerSquareMeter(450000, 50, "tg");
  const ppmEn = formatPricePerSquareMeter(450000, 50, "en");

  assert.ok(ppmRu.includes("Цена за метр"), "RU price per meter");
  assert.ok(ppmTg.includes("Нарх барои метр"), "TG price per meter");
  assert.ok(ppmEn.includes("Price per sq.m"), "EN price per meter");

  assert.equal(getPricePerMeterLabel("ru"), "Цена за метр");
  assert.equal(getPricePerMeterLabel("tg"), "Нарх барои метр");
  assert.equal(getPricePerMeterLabel("en"), "Price per sq.m");
});

test("Multilingual SEO: Category & Listing URLs and Reciprocal Hreflang", () => {
  const cat = getTaxonomyCategoryById("cat_sale_resale")!;
  assert.ok(cat, "Category cat_sale_resale must exist");

  const catUrlRu = resolveCategoryUrl({ category: cat, citySlug: "khujand", locale: "ru" });
  const catUrlTg = resolveCategoryUrl({ category: cat, citySlug: "khujand", locale: "tg" });
  const catUrlEn = resolveCategoryUrl({ category: cat, citySlug: "khujand", locale: "en" });

  // RU must not have language prefix
  assert.equal(catUrlRu, "/khujand/kupit/vtorichka");
  // TG must have /tg/ prefix
  assert.equal(catUrlTg, "/tg/khujand/furosh/bozori-duyum");
  // EN must have /en/ prefix
  assert.equal(catUrlEn, "/en/khujand/sale/resale");

  const sampleListing: ResolvableListing = {
    id: "17034738",
    title: "1-комн. квартира, 4 этаж, 44 м²",
    titleTg: "Хонадони 1-ҳуҷрагӣ, 44 м²",
    dealType: "Продажа",
    propertyType: "Квартира",
    city: "Худжанд",
    priceTjs: 360000,
    priceUsd: 38000,
    area: 44,
    rooms: 1,
  };

  const seoRu = resolveListingSeo(sampleListing, "ru");
  const seoTg = resolveListingSeo(sampleListing, "tg");
  const seoEn = resolveListingSeo(sampleListing, "en");

  assert.ok(seoRu.canonicalUrl.includes("/khujand/kupit/"));
  assert.ok(!seoRu.canonicalUrl.includes("/ru/"));
  assert.ok(seoTg.canonicalUrl.includes("/tg/khujand/furosh/"));
  assert.ok(seoEn.canonicalUrl.includes("/en/khujand/sale/"));

  // Reciprocal hreflang checks
  for (const seo of [seoRu, seoTg, seoEn]) {
    const langs = seo.hreflang.map((h) => h.lang);
    assert.ok(langs.includes("ru"), "hreflang must include ru");
    assert.ok(langs.includes("tg"), "hreflang must include tg");
    assert.ok(langs.includes("en"), "hreflang must include en");
    assert.ok(langs.includes("x-default"), "hreflang must include x-default");

    const xDef = seo.hreflang.find((h) => h.lang === "x-default");
    const ruEntry = seo.hreflang.find((h) => h.lang === "ru");
    assert.equal(xDef?.url, ruEntry?.url, "x-default must match RU URL");
  }
});

test("Multilingual City Names: resolves properly across locales", () => {
  assert.equal(resolveCityDisplayName("khujand", "ru"), "Худжанд");
  assert.equal(resolveCityDisplayName("khujand", "tg"), "Хуҷанд");
  assert.equal(resolveCityDisplayName("khujand", "en"), "Khujand");

  assert.equal(resolveCityDisplayName("dushanbe", "ru"), "Душанбе");
  assert.equal(resolveCityDisplayName("dushanbe", "tg"), "Душанбе");
  assert.equal(resolveCityDisplayName("dushanbe", "en"), "Dushanbe");
});
