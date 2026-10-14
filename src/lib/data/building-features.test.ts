import assert from "node:assert/strict";
import { test } from "node:test";
import { INITIAL_PROJECTS } from "./mock-db";

test("building specs and mock projects have valid building and finishing features", () => {
  const sirdaryo = INITIAL_PROJECTS.find((p) => p.slug === "sirdaryo-plaza");
  assert.ok(sirdaryo, "sirdaryo-plaza project must exist");

  // Standard fields
  assert.equal(sirdaryo.landArea, "0.85 га");
  assert.equal(sirdaryo.wallMaterial, "Газоблок 300 мм + жженый кирпич");
  assert.equal(sirdaryo.facade, "Клинкерная плитка и вентилируемый керамогранит");
  assert.equal(sirdaryo.cadastralNumber, "73:01:0014002:114");

  // Custom building features limit <= 3 and <= 40 chars
  assert.ok(sirdaryo.customBuildingFeatures, "customBuildingFeatures should be defined");
  assert.ok(sirdaryo.customBuildingFeatures.length <= 3, "custom features must not exceed 3");
  for (const feat of sirdaryo.customBuildingFeatures) {
    assert.ok(feat.title.length <= 40, `Title "${feat.title}" exceeds 40 chars`);
    assert.ok(feat.value.length <= 40, `Value "${feat.value}" exceeds 40 chars`);
  }

  // Finishing features limit <= 3, title <= 40 chars, description <= 400 chars
  assert.ok(sirdaryo.finishingFeatures, "finishingFeatures should be defined");
  assert.ok(sirdaryo.finishingFeatures.length <= 3, "finishing features must not exceed 3");
  for (const feat of sirdaryo.finishingFeatures) {
    assert.ok(feat.title.length <= 40, `Title "${feat.title}" exceeds 40 chars`);
    assert.ok(feat.description.length <= 400, `Description "${feat.description}" exceeds 400 chars`);
  }
});

test("empty or undefined specifications are cleanly filtered out", () => {
  const testSpecs: Array<{ label: string; value: string | null | undefined }> = [
    { label: "Площадь участка", value: "0.5 га" },
    { label: "Материал стен", value: "" },
    { label: "Фасад", value: undefined },
    { label: "Кадастровый номер", value: null },
    { label: "Сейсмостойкость", value: "До 9 баллов" },
    { label: "Пустое поле", value: "   " },
  ];

  const filtered = testSpecs.filter(
    (item) =>
      item.value !== null &&
      item.value !== undefined &&
      String(item.value).trim() !== ""
  );

  assert.equal(filtered.length, 2, "Only non-empty fields must remain");
  assert.deepEqual(
    filtered.map((s) => s.label),
    ["Площадь участка", "Сейсмостойкость"]
  );
});
