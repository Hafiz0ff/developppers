import { test } from "node:test";
import assert from "node:assert/strict";
import {
  calculateDistanceKm,
  isPointInBounds,
  formatDistance,
  getCityMapPreset,
  generateYandexMapsRouteUrl,
  generateGoogleMapsUrl,
  getAllMapProperties,
  SOGD_MAP_PRESETS,
} from "./geo-utils";

test("Geo Utils: Haversine distance calculation", () => {
  // Distance between central Khujand (40.2825, 69.6250) and Guliston (40.2925, 69.7950)
  const khujand = { lat: 40.2825, lng: 69.625 };
  const guliston = { lat: 40.2925, lng: 69.795 };

  const distance = calculateDistanceKm(khujand, guliston);
  assert.ok(distance > 13 && distance < 16, `Distance should be ~14-15 km, got ${distance}`);

  // Distance to self is 0
  assert.equal(calculateDistanceKm(khujand, khujand), 0);
});

test("Geo Utils: isPointInBounds correctly checks boundaries", () => {
  const bounds = {
    north: 40.35,
    south: 40.2,
    east: 69.75,
    west: 69.55,
  };

  const insidePoint = { lat: 40.28, lng: 69.62 };
  const outsidePoint = { lat: 40.5, lng: 69.62 };

  assert.equal(isPointInBounds(insidePoint, bounds), true);
  assert.equal(isPointInBounds(outsidePoint, bounds), false);
});

test("Geo Utils: formatDistance formats meters and kilometers cleanly", () => {
  assert.equal(formatDistance(0.45, "ru"), "450 м");
  assert.equal(formatDistance(2.5, "ru"), "2.5 км");
  assert.equal(formatDistance(0.8, "tg"), "800 м");
  assert.equal(formatDistance(14.2, "tg"), "14.2 км");
});

test("Geo Utils: getCityMapPreset returns valid city presets", () => {
  const khujand = getCityMapPreset("khujand");
  assert.equal(khujand.id, "khujand");
  assert.equal(khujand.nameRu, "Худжанд");

  const guliston = getCityMapPreset("guliston");
  assert.equal(guliston.id, "guliston");
  assert.equal(guliston.nameRu, "Гулистон (Кайраккум)");

  // Fallback to Khujand on unknown ID
  const fallback = getCityMapPreset("unknown-city");
  assert.equal(fallback.id, "khujand");
});

test("Geo Utils: Navigation URLs for Yandex and Google Maps", () => {
  const lat = 40.2825;
  const lng = 69.625;

  const yandexUrl = generateYandexMapsRouteUrl(lat, lng);
  assert.ok(yandexUrl.includes("yandex.ru/maps"));
  assert.ok(yandexUrl.includes(`rtext=~${lat},${lng}`));

  const googleUrl = generateGoogleMapsUrl(lat, lng);
  assert.ok(googleUrl.includes("google.com/maps"));
  assert.ok(googleUrl.includes(`query=${lat},${lng}`));
});

test("Geo Utils: getAllMapProperties returns normalized properties with valid coordinates", () => {
  const items = getAllMapProperties();
  assert.ok(items.length >= 17, `Should contain at least 17 items (3 complexes + 14+ classifieds), got ${items.length}`);

  for (const item of items) {
    assert.ok(item.id, "Item must have id");
    assert.ok(item.title, "Item must have title");
    assert.ok(item.priceTjs > 0, "Item must have positive price in TJS");
    assert.ok(item.priceUsd > 0, "Item must have positive price in USD");
    assert.ok(item.lat >= 38 && item.lat <= 41.5, `Lat must be in Tajikistan range, got ${item.lat}`);
    assert.ok(item.lng >= 68 && item.lng <= 71.5, `Lng must be in Tajikistan range, got ${item.lng}`);
    assert.ok(
      ["complex", "apartment", "house", "commercial"].includes(item.category),
      `Category must be valid, got ${item.category}`
    );
  }

  const complexes = items.filter((i) => i.category === "complex");
  const apartments = items.filter((i) => i.category === "apartment");
  const houses = items.filter((i) => i.category === "house");

  assert.ok(complexes.length >= 2, `Should contain complexes, got ${complexes.length}`);
  assert.ok(apartments.length >= 7, `Should contain apartments, got ${apartments.length}`);
  assert.ok(houses.length >= 6, `Should contain traditional houses (ҳавлӣ), got ${houses.length}`);
});
