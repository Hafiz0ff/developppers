import assert from "node:assert/strict";
import { test, describe } from "node:test";
import {
  getAllGeoEntities,
  getGeoEntityById,
  getGeoEntityBySlug,
  resolveGeoEntity,
  getSelectorGeoEntities,
  getRouteEnabledCities,
  getIndexableGeoCities,
  resolveH1GeoName,
} from "./geo-store";
import { resolveCitySlug, resolveCityDisplayName, resolveCityH1Name } from "../seo/url-resolver";

describe("MASKANI.TJ Specification v1.8 FINAL — Unified Geographic Store & SEO Engine", () => {
  // AC-45: All 67 entities from Appendix A are accounted for
  test("AC-45: Exactly 67 verified geographic entities exist in store", () => {
    const all = getAllGeoEntities();
    assert.equal(all.length, 67, "Must contain exactly 67 entities from Appendix A");

    const numbers = new Set(all.map((e) => e.number));
    assert.equal(numbers.size, 67, "Every number from 1 to 67 must be uniquely present");
    for (let i = 1; i <= 67; i++) {
      assert.ok(numbers.has(i), `Number ${i} from Appendix A must be present`);
    }
  });

  // AC-46: Proper classification of types and hierarchy
  test("AC-46: Classification of territory types and hierarchy", () => {
    const all = getAllGeoEntities();
    const cities = all.filter((e) => e.type === "city");
    const districts = all.filter((e) => e.type === "district");
    const towns = all.filter((e) => e.type === "town");
    const aliases = all.filter((e) => e.type === "alias");

    assert.equal(cities.length, 18, "Must contain exactly 18 confirmed cities");
    assert.equal(districts.length, 47, "Must contain exactly 47 districts");
    assert.equal(towns.length, 1, "Must contain exactly 1 town (Mehnatobod)");
    assert.equal(aliases.length, 1, "Must contain exactly 1 alias (Jomi)");

    // Mehnatobod must be town in Zafarobod
    const mehnatobod = all.find((e) => e.name.ru === "Мехнатобод");
    assert.ok(mehnatobod);
    assert.equal(mehnatobod?.type, "town");
    assert.equal(mehnatobod?.parentGeoId, "Зафарабадский район");

    // Bokhtar city vs Kushoniyon district
    const bokhtar = all.find((e) => e.number === 8);
    const kushoniyon = all.find((e) => e.number === 34);
    assert.equal(bokhtar?.type, "city");
    assert.equal(kushoniyon?.type, "district");
    assert.notEqual(bokhtar?.slug.ru, kushoniyon?.slug.ru);
  });

  // AC-47 & AC-49: Slugs format and collision-free uniqueness
  test("AC-47 & AC-49: Slugs are unique, normalized, lowercase with hyphens", () => {
    const all = getAllGeoEntities().filter((e) => e.type !== "alias");
    const slugsRu = new Set<string>();

    for (const entity of all) {
      const slug = entity.slug.ru;
      assert.ok(slug, `Entity ${entity.name.ru} must have a slug`);
      assert.match(slug, /^[a-z0-9-]+$/, `Slug ${slug} must be lowercase alphanumeric with hyphens`);
      assert.ok(!slugsRu.has(slug), `Duplicate slug detected: ${slug}`);
      slugsRu.add(slug);
    }
  });

  // AC-50: Aliases resolution and historical names
  test("AC-50: Historical aliases resolve properly without duplicate canonicals", () => {
    // Chkalovsk -> Buston
    const bustonByChkalovsk = getGeoEntityBySlug("chkalovsk");
    assert.ok(bustonByChkalovsk);
    assert.equal(bustonByChkalovsk?.name.ru, "Бустон");

    // Kayrakkum -> Guliston
    const gulistonByKayrakkum = getGeoEntityBySlug("kayrakkum");
    assert.ok(gulistonByKayrakkum);
    assert.equal(gulistonByKayrakkum?.name.ru, "Гулистон");

    // Kurgan-Tyube -> Bokhtar
    const bokhtarByKurgan = getGeoEntityBySlug("курган-тюбе");
    assert.ok(bokhtarByKurgan);
    assert.equal(bokhtarByKurgan?.name.ru, "Бохтар");
  });

  // AC-51: Independent control of selector, route, and indexability
  test("AC-51: Independent control of selectorEnabled, routeEnabled, indexable", () => {
    const selectorCities = getSelectorGeoEntities();
    const routeCities = getRouteEnabledCities();
    const indexableCities = getIndexableGeoCities();

    assert.ok(selectorCities.length > routeCities.length, "Selector includes districts, route only includes hubs");
    assert.ok(routeCities.length >= 18, "All 18 cities must have routes enabled");
    assert.ok(indexableCities.length >= 18, "All 18 cities must be indexable");

    // A remote district has selectorEnabled: true, but routeEnabled: false & indexable: false
    const baljuvon = getGeoEntityById("geo_baljuvon");
    assert.ok(baljuvon);
    assert.equal(baljuvon?.selectorEnabled, true);
    assert.equal(baljuvon?.routeEnabled, false);
    assert.equal(baljuvon?.indexable, false);
  });

  // AC-52: Backward compatibility with legacy city IDs
  test("AC-52: Legacy city IDs seamlessly resolve to GeoEntities", () => {
    const khujand = resolveGeoEntity("khujand");
    assert.ok(khujand);
    assert.equal(khujand?.name.ru, "Худжанд");

    const dushanbe = resolveGeoEntity("dushanbe");
    assert.ok(dushanbe);
    assert.equal(dushanbe?.name.ru, "Душанбе");

    const gafurov = resolveGeoEntity("gafurov");
    assert.ok(gafurov);
    assert.equal(gafurov?.name.ru, "Бободжон Гафуров");
  });

  // AC-57 & AC-58: Grammatically correct locative H1 forms
  test("AC-57 & AC-58: Locative grammatical forms for H1 across languages", () => {
    // RU locative
    assert.equal(resolveH1GeoName("khujand", "ru"), "Худжанде");
    assert.equal(resolveH1GeoName("dushanbe", "ru"), "Душанбе");
    assert.equal(resolveH1GeoName("bokhtar", "ru"), "Бохтаре");
    assert.equal(resolveH1GeoName("kulob", "ru"), "Кулябе");
    assert.equal(resolveH1GeoName("istaravshan", "ru"), "Истаравшане");
    assert.equal(resolveH1GeoName("konibodom", "ru"), "Канибадаме");

    // Full H1 construction
    const h1Ru = `Недвижимость в ${resolveCityH1Name("khujand", "ru")}`;
    assert.equal(h1Ru, "Недвижимость в Худжанде");

    // TG locative
    assert.equal(resolveH1GeoName("khujand", "tg"), "Хуҷанд");
    const h1Tg = `Амволи ғайриманқул дар ${resolveCityH1Name("khujand", "tg")}`;
    assert.equal(h1Tg, "Амволи ғайриманқул дар Хуҷанд");

    // EN locative
    assert.equal(resolveH1GeoName("khujand", "en"), "Khujand");
    const h1En = `Real Estate in ${resolveCityH1Name("khujand", "en")}`;
    assert.equal(h1En, "Real Estate in Khujand");
  });
});
