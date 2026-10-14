import { test } from "node:test";
import assert from "node:assert/strict";
import {
  getAllMapProperties,
  calculateDistanceKm,
  isPointInBounds,
  formatDistance,
  getCityMapPreset,
  generateYandexMapsRouteUrl,
  generateGoogleMapsUrl,
  SOGD_MAP_PRESETS,
} from "../geo-utils";
import { CATALOG_PROPERTIES } from "../catalog-data";
import { INITIAL_PROJECTS } from "./mock-db";

test("Phase 9 DoD 1: All 15 real catalog listings have exact GPS coordinates in Sughd", () => {
  assert.equal(CATALOG_PROPERTIES.length, 15, "Should have 15 real listings");
  for (const prop of CATALOG_PROPERTIES) {
    assert.ok(prop.lat, `Property ${prop.id} must have lat`);
    assert.ok(prop.lng, `Property ${prop.id} must have lng`);
    assert.ok(prop.lat >= 40.0 && prop.lat <= 40.5, `Lat for ${prop.title} should be in Khujand/Sughd area (~40.2), got ${prop.lat}`);
    assert.ok(prop.lng >= 69.5 && prop.lng <= 70.0, `Lng for ${prop.title} should be in Khujand/Sughd area (~69.6-69.8), got ${prop.lng}`);
  }
});

test("Phase 9 DoD 2: All residential complexes have valid GPS coordinates", () => {
  for (const project of INITIAL_PROJECTS) {
    const lat = project.coordinates?.lat ?? project.latitude;
    const lng = project.coordinates?.lng ?? project.longitude;
    assert.ok(lat, `Project ${project.slug} must have lat`);
    assert.ok(lng, `Project ${project.slug} must have lng`);
    assert.ok(lat >= 39.5 && lat <= 40.5, `Project ${project.name} lat should be in Sughd`);
    assert.ok(lng >= 69.0 && lng <= 70.5, `Project ${project.name} lng should be in Sughd`);
  }
});

test("Phase 9 DoD 3: getAllMapProperties returns normalized map items with dual currency", () => {
  const items = getAllMapProperties();
  assert.ok(items.length >= 17, `Expected at least 17 map items, got ${items.length}`);

  for (const item of items) {
    assert.ok(item.id.startsWith("project-") || item.id.startsWith("classified-"), "Item id must have prefix");
    assert.ok(item.priceTjs > 0, "Price in TJS must be positive");
    assert.ok(item.priceUsd > 0, "Price in USD must be positive");
    assert.ok(item.url.startsWith("/projects/") || item.url.startsWith("/classifieds/"), "URL must be valid");
    assert.ok(item.coverImage, "Cover image must be specified");
    assert.ok(item.phone, "Phone must be specified");
  }
});

test("Phase 9 DoD 4: Category distribution covers complexes, apartments, and houses (ҳавлӣ)", () => {
  const items = getAllMapProperties();
  const complexes = items.filter((i) => i.category === "complex");
  const apartments = items.filter((i) => i.category === "apartment");
  const houses = items.filter((i) => i.category === "house");

  assert.ok(complexes.length >= 2, `Expected at least 2 complexes, got ${complexes.length}`);
  assert.ok(apartments.length >= 7, `Expected at least 7 apartments, got ${apartments.length}`);
  assert.ok(houses.length >= 6, `Expected at least 6 traditional houses, got ${houses.length}`);
});

test("Phase 9 DoD 5: City presets cover key Sughd urban areas with accurate centers and zoom", () => {
  const presetIds = SOGD_MAP_PRESETS.map((p) => p.id);
  assert.ok(presetIds.includes("khujand"), "Must have Khujand preset");
  assert.ok(presetIds.includes("guliston"), "Must have Guliston/Qayroqum preset");
  assert.ok(presetIds.includes("gafurov"), "Must have B. Gafurov preset");
  assert.ok(presetIds.includes("istaravshan"), "Must have Istaravshan preset");
  assert.ok(presetIds.includes("all-sughd"), "Must have All Sughd preset");

  for (const preset of SOGD_MAP_PRESETS) {
    assert.ok(preset.zoom >= 10 && preset.zoom <= 16, `Zoom for ${preset.id} must be in normal range`);
    assert.equal(preset.center.length, 2, "Center must have [lat, lng]");
  }
});

test("Phase 9 DoD 6: Distance calculation accurately estimates distances in Sughd", () => {
  // Silkombinat (Khujand center) to 18 mkr
  const silkombinat = { lat: 40.2825, lng: 69.625 };
  const mkr18 = { lat: 40.3088, lng: 69.6702 };

  const dist = calculateDistanceKm(silkombinat, mkr18);
  assert.ok(dist >= 4.5 && dist <= 5.5, `Distance across Khujand should be ~5 km, got ${dist}`);
});

test("Phase 9 DoD 7: Yandex Route URL matches official format with coordinates", () => {
  const url = generateYandexMapsRouteUrl(40.2925, 69.795);
  assert.equal(url, "https://yandex.ru/maps/?rtext=~40.2925,69.795&rtt=auto");
});

test("Phase 9 DoD 8: Distance formatting supports both meters and kilometers in RU and TG", () => {
  assert.equal(formatDistance(0.3, "ru"), "300 м");
  assert.equal(formatDistance(0.3, "tg"), "300 м");
  assert.equal(formatDistance(12.5, "ru"), "12.5 км");
  assert.equal(formatDistance(12.5, "tg"), "12.5 км");
});

test("Phase 9 DoD 9: Bounding box filtering works reliably", () => {
  const khujandBox = {
    north: 40.32,
    south: 40.25,
    east: 69.7,
    west: 69.6,
  };

  const inside = { lat: 40.2825, lng: 69.625 };
  const outsideDushanbe = { lat: 38.56, lng: 68.78 };

  assert.equal(isPointInBounds(inside, khujandBox), true);
  assert.equal(isPointInBounds(outsideDushanbe, khujandBox), false);
});

test("Phase 9 DoD 10: Fallback logic for city preset defaults to Khujand", () => {
  const defaultPreset = getCityMapPreset("non_existent_city");
  assert.equal(defaultPreset.id, "khujand");
  assert.equal(defaultPreset.nameRu, "Худжанд");
});
