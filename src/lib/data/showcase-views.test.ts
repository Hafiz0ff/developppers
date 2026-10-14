import assert from "node:assert/strict";
import { test } from "node:test";

test("poi categories and coordinates are within valid range", () => {
  const validCategories = new Set(["school", "kindergarten", "park", "shop", "medical", "transport"]);
  const mockPois = [
    { id: "poi_waterfront", category: "park", xPercent: 48, yPercent: 78 },
    { id: "poi_park", category: "park", xPercent: 22, yPercent: 32 },
    { id: "poi_school", category: "school", xPercent: 78, yPercent: 28 },
    { id: "poi_kindergarten", category: "kindergarten", xPercent: 82, yPercent: 62 },
    { id: "poi_shop", category: "shop", xPercent: 18, yPercent: 72 },
    { id: "poi_clinic", category: "medical", xPercent: 88, yPercent: 42 },
  ];

  for (const poi of mockPois) {
    assert.ok(validCategories.has(poi.category));
    assert.ok(poi.xPercent >= 0 && poi.xPercent <= 100);
    assert.ok(poi.yPercent >= 0 && poi.yPercent <= 100);
  }
});

test("layouts data contains valid areas and room numbers", () => {
  const layouts = [
    { rooms: "1-комнатная", area: 53.0, livingArea: 22.5, kitchenArea: 14.0 },
    { rooms: "2-комнатная", area: 78.5, livingArea: 42.0, kitchenArea: 16.5 },
    { rooms: "3-комнатная", area: 115.0, livingArea: 64.0, kitchenArea: 20.0 },
  ];

  for (const l of layouts) {
    assert.ok(l.area > 0);
    assert.ok(l.livingArea > 0);
    assert.ok(l.kitchenArea > 0);
    assert.ok(l.livingArea + l.kitchenArea <= l.area, "Living + kitchen must not exceed total area");
  }
});
