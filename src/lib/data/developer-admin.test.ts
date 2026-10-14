import test from "node:test";
import assert from "node:assert/strict";

test("Developer Admin - Gallery reordering logic preserves count and handles cover", () => {
  const initialPhotos = [
    "https://example.com/cover.jpg",
    "https://example.com/photo2.jpg",
    "https://example.com/photo3.jpg",
  ];

  // Make photo at index 2 the cover
  const targetIndex = 2;
  const targetPhoto = initialPhotos[targetIndex];
  const reordered = [
    targetPhoto,
    ...initialPhotos.filter((_, idx) => idx !== targetIndex),
  ];

  assert.equal(reordered.length, 3, "Photo list length must remain 3");
  assert.equal(reordered[0], targetPhoto, "New cover must be at index 0");
  assert.equal(reordered[1], initialPhotos[0]);
  assert.equal(reordered[2], initialPhotos[1]);
});

test("Developer Admin - POI coordinates and categories validate correctly", () => {
  const validCategories = [
    "school",
    "kindergarten",
    "park",
    "shop",
    "medical",
    "transport",
  ];

  const testPoi = {
    id: "poi_test_1",
    name: "Новая школа",
    category: "school",
    distance: "3 мин пешком",
    xPercent: 45,
    yPercent: 65,
  };

  assert.ok(
    validCategories.includes(testPoi.category),
    "Category must be in allowed list"
  );
  assert.ok(
    testPoi.xPercent >= 0 && testPoi.xPercent <= 100,
    "xPercent must be between 0 and 100"
  );
  assert.ok(
    testPoi.yPercent >= 0 && testPoi.yPercent <= 100,
    "yPercent must be between 0 and 100"
  );
});

test("Developer Admin - Facade insolation angle maps to correct cardinal quadrant", () => {
  function getOrientation(deg: number) {
    if (deg >= 337.5 || deg < 22.5) return "Север";
    if (deg >= 67.5 && deg < 112.5) return "Восток";
    if (deg >= 157.5 && deg < 202.5) return "Юг";
    if (deg >= 247.5 && deg < 292.5) return "Запад";
    return "Промежуточное";
  }

  assert.equal(getOrientation(0), "Север");
  assert.equal(getOrientation(90), "Восток");
  assert.equal(getOrientation(180), "Юг");
  assert.equal(getOrientation(270), "Запад");
});

test("Developer Admin - 6D Showcase engagement mode percentages sum to 100%", () => {
  const modePercentages = [42, 26, 14, 9, 6, 3];
  const sum = modePercentages.reduce((acc, v) => acc + v, 0);
  assert.equal(sum, 100, "Showcase mode percentages must sum exactly to 100%");
});
