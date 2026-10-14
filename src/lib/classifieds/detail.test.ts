import test from "node:test";
import assert from "node:assert/strict";
import { CATALOG_PROPERTIES, getPropertyById } from "@/lib/catalog-data";
import {
  mapClassifiedToCard,
  cityLabel,
  dealTypeLabel,
  propertyTypeLabel,
} from "./map-card";

test("Classifieds Detail - CATALOG_PROPERTIES contains rich specifications and images", () => {
  assert.ok(CATALOG_PROPERTIES.length >= 4, "Should have at least 4 catalog properties");

  for (const prop of CATALOG_PROPERTIES) {
    assert.ok(prop.id, "Property must have id");
    assert.ok(prop.title, "Property must have title");
    assert.ok(prop.priceUsd > 0, "Price in USD must be positive");
    assert.ok(prop.priceTjs > 0, "Price in TJS must be positive");
    assert.ok(prop.image, "Property must have a cover image");
    assert.ok(prop.phone, "Property must have a contact phone");
    assert.ok(prop.whatsapp, "Property must have a whatsapp number");
    assert.ok(prop.area > 0, "Area must be positive");
  }
});

test("Classifieds Detail - getPropertyById resolves correctly", () => {
  const prop1 = getPropertyById("17034738") || getPropertyById("c1");
  assert.ok(prop1, "Property 17034738 must be found");
  assert.equal(prop1.id, "17034738");
  assert.equal(prop1.dealType, "Продажа");
  assert.equal(prop1.propertyType, "Квартира");

  const prop2 = getPropertyById("16419531") || getPropertyById("c2");
  assert.ok(prop2, "Property 16419531 (House) must be found");
  assert.equal(prop2.rooms, 5);
  assert.equal(prop2.propertyType, "Дом / Ҳавлӣ");

  const notFound = getPropertyById("non_existent_id");
  assert.equal(notFound, undefined);
});

test("Classifieds Detail - Tajik labels are culturally accurate and pure", () => {
  // Deal type labels
  const dealRu = dealTypeLabel("sale");
  assert.equal(dealRu, "Продажа");

  const rentRu = dealTypeLabel("rent_long");
  assert.equal(rentRu, "Аренда");

  // Property type labels
  assert.equal(propertyTypeLabel("apartment"), "Квартира");
  assert.equal(propertyTypeLabel("house"), "Дом / Ҳавлӣ");
  assert.equal(propertyTypeLabel("commercial"), "Коммерция");

  // City labels
  assert.equal(cityLabel("khujand"), "Худжанд");
  assert.equal(cityLabel("gafurov"), "Б. Гафуров");
  assert.equal(cityLabel("guliston"), "Гулистон (Кайраккум)");
});

test("Classifieds Detail - Price per square meter calculation", () => {
  const prop = CATALOG_PROPERTIES[0];
  const pricePerSqmUsd = Math.round(prop.priceUsd / prop.area);
  const pricePerSqmTjs = Math.round(prop.priceTjs / prop.area);

  assert.ok(pricePerSqmUsd > 0, "USD price per sqm must be positive");
  assert.ok(pricePerSqmTjs > 0, "TJS price per sqm must be positive");
  assert.ok(pricePerSqmTjs > pricePerSqmUsd, "TJS value must be higher than USD given exchange rate");
});
