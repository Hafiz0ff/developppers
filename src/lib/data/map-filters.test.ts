import { test } from "node:test";
import assert from "node:assert/strict";
import { getAllMapProperties, calculateDistanceKm } from "../geo-utils";

test("Stage 5: Budget filtering by min and max price in USD and TJS", () => {
  const all = getAllMapProperties();
  assert.ok(all.length >= 15);

  // Filter properties under $50,000 USD
  const under50k = all.filter((p) => p.priceUsd <= 50000);
  assert.ok(under50k.length > 0, "Should have properties under 50k");
  for (const p of under50k) {
    assert.ok(p.priceUsd <= 50000, `Price must be <= 50000, got ${p.priceUsd}`);
  }

  // Filter properties between 500,000 and 1,000,000 TJS
  const midRangeTjs = all.filter((p) => p.priceTjs >= 500000 && p.priceTjs <= 1000000);
  assert.ok(midRangeTjs.length > 0, "Should have mid-range properties in TJS");
  for (const p of midRangeTjs) {
    assert.ok(p.priceTjs >= 500000 && p.priceTjs <= 1000000);
  }
});

test("Stage 5: Area filtering by min and max m²", () => {
  const all = getAllMapProperties();

  // Filter apartments between 50 and 80 m²
  const midArea = all.filter((p) => p.areaM2 >= 50 && p.areaM2 <= 80);
  assert.ok(midArea.length > 0, "Should have properties with area between 50 and 80 m²");
  for (const p of midArea) {
    assert.ok(p.areaM2 >= 50 && p.areaM2 <= 80);
  }
});

test("Stage 5: Radius filtering around user coordinates", () => {
  const all = getAllMapProperties();

  // Reference point: Center of Khujand (Silkombinat ~40.2825, 69.625)
  const userLoc = { lat: 40.2825, lng: 69.625 };
  const radiusKm = 4;

  const nearby = all.filter((p) => {
    const dist = calculateDistanceKm(userLoc, { lat: p.lat, lng: p.lng });
    return dist <= radiusKm;
  });

  assert.ok(nearby.length > 0, "Should find properties within 4 km of Khujand center");
  for (const p of nearby) {
    const dist = calculateDistanceKm(userLoc, { lat: p.lat, lng: p.lng });
    assert.ok(dist <= radiusKm, `Distance ${dist} must be <= ${radiusKm}`);
  }

  // Guliston should NOT be within 4km of Khujand center (it's ~17km away)
  const gulistonItem = nearby.find((p) => p.city.toLowerCase().includes("гулистон"));
  assert.equal(gulistonItem, undefined, "Guliston property should not be within 4km of Khujand");
});
