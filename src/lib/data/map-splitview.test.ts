import { test } from "node:test";
import assert from "node:assert/strict";
import { getAllMapProperties, MapPropertyItem } from "../geo-utils";

test("Stage 4: Properties sorting by price ascending and descending", () => {
  const all = getAllMapProperties();
  assert.ok(all.length >= 15);

  // Price Ascending
  const asc = [...all].sort((a, b) => a.priceUsd - b.priceUsd);
  for (let i = 0; i < asc.length - 1; i++) {
    assert.ok(asc[i].priceUsd <= asc[i + 1].priceUsd, "Must be sorted ascending");
  }

  // Price Descending
  const desc = [...all].sort((a, b) => b.priceUsd - a.priceUsd);
  for (let i = 0; i < desc.length - 1; i++) {
    assert.ok(desc[i].priceUsd >= desc[i + 1].priceUsd, "Must be sorted descending");
  }
});

test("Stage 4: Properties sorting by area descending", () => {
  const all = getAllMapProperties();
  const byArea = [...all].sort((a, b) => b.areaM2 - a.areaM2);
  for (let i = 0; i < byArea.length - 1; i++) {
    assert.ok(byArea[i].areaM2 >= byArea[i + 1].areaM2, "Must be sorted by area descending");
  }
});

test("Stage 4: Combined filtering by city and category", () => {
  const all = getAllMapProperties();

  // Khujand houses
  const khujandHouses = all.filter(
    (p) =>
      p.category === "house" &&
      (p.city.toLowerCase().includes("худжанд") || p.city.toLowerCase().includes("хуҷанд"))
  );
  assert.ok(khujandHouses.length > 0, "Should find houses in Khujand");

  // Guliston complexes
  const gulistonComplexes = all.filter(
    (p) =>
      p.category === "complex" &&
      (p.city.toLowerCase().includes("гулистон") || p.district.toLowerCase().includes("моря") || p.district.toLowerCase().includes("тоҷик"))
  );
  assert.ok(gulistonComplexes.length > 0, "Should find Qayroqum Avenue in Guliston");
});
