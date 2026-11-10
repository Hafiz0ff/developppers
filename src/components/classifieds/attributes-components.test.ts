import assert from "node:assert/strict";
import { test } from "node:test";
import { sanitizeIconKey, ALLOWED_ICON_KEYS, formatAttributesForDisplay } from "@/lib/classifieds/attributes";
import { sanitizeIncompatibleAttributes } from "./attributes-manager";

test("ListingIcon & Allowlist: all 48 approved icon keys map safely without errors", () => {
  for (const key of ALLOWED_ICON_KEYS) {
    const sanitized = sanitizeIconKey(key);
    assert.equal(sanitized, key, `Expected ${key} to be recognized`);
  }

  // Unknown key must gracefully fall back to 'info'
  assert.equal(sanitizeIconKey("completely_unknown_icon"), "info");
  assert.equal(sanitizeIconKey(""), "info");
  assert.equal(sanitizeIconKey(null as any), "info");
});

test("Attributes Manager: sanitizeIncompatibleAttributes clears forbidden fields on category/deal switch", () => {
  const mixedValues = {
    wifi: true,
    heating: true,
    minor_owners: true, // Only for sale!
    fire_extinguishing: true, // Only for commercial!
    cafe: true, // Only for commercial!
    floor: 4,
    floors_count: 9,
  };

  // 1. Switched to Residential Sale
  const resSale = sanitizeIncompatibleAttributes("sale", "apartment", mixedValues);
  assert.equal(resSale.wifi, true);
  assert.equal(resSale.minor_owners, true); // Allowed in sale
  assert.equal(resSale.fire_extinguishing, undefined); // Blocked in residential
  assert.equal(resSale.cafe, undefined); // Blocked in residential

  // 2. Switched to Residential Rental (rent_long)
  const resRent = sanitizeIncompatibleAttributes("rent_long", "apartment", mixedValues);
  assert.equal(resRent.wifi, true);
  assert.equal(resRent.minor_owners, undefined); // Stripped! (Legal only in sale)
  assert.equal(resRent.fire_extinguishing, undefined);

  // 3. Switched to Commercial Rental (rent_long office)
  const commRent = sanitizeIncompatibleAttributes("rent_long", "office", mixedValues);
  assert.equal(commRent.fire_extinguishing, true); // Allowed in commercial
  assert.equal(commRent.cafe, true); // Allowed in commercial
  assert.equal(commRent.minor_owners, undefined); // Stripped!
  assert.equal(commRent.floor, undefined); // Residential unit_info stripped!
});

test("ListingAttributesView formatting: displays only active filled values and localized labels", () => {
  const sampleAttrs = {
    wifi: true,
    dishwasher: true,
    heating: false, // Must be omitted
    built_year: 2021,
    ceiling_height: 3.2,
    renovation_type: "design",
    minor_owners: true,
  };

  // 1. Russian View
  const ruSections = formatAttributesForDisplay(sampleAttrs, "ru", "sale", "apartment");
  const ruAmenities = ruSections.find((s) => s.code === "amenities");
  assert.ok(ruAmenities);
  assert.ok(ruAmenities.items.some((i) => i.code === "wifi" && i.label === "Интернет (Wi-Fi)"));
  assert.ok(ruAmenities.items.some((i) => i.code === "dishwasher" && i.label === "Посудомоечная машина"));
  assert.ok(!ruAmenities.items.some((i) => i.code === "heating")); // False omitted

  const ruUnit = ruSections.find((s) => s.code === "unit_info");
  assert.ok(ruUnit);
  const renoItem = ruUnit.items.find((i) => i.code === "renovation_type");
  assert.equal(renoItem?.displayValue, "Дизайнерский ремонт");

  // 2. Tajik View
  const tgSections = formatAttributesForDisplay(sampleAttrs, "tg", "sale", "apartment");
  const tgUnit = tgSections.find((s) => s.code === "unit_info");
  assert.ok(tgUnit);
  const renoItemTg = tgUnit.items.find((i) => i.code === "renovation_type");
  assert.equal(renoItemTg?.displayValue, "Таъмири дизайнӣ");

  // 3. English View
  const enSections = formatAttributesForDisplay(sampleAttrs, "en", "sale", "apartment");
  const enUnit = enSections.find((s) => s.code === "unit_info");
  assert.ok(enUnit);
  const renoItemEn = enUnit.items.find((i) => i.code === "renovation_type");
  assert.equal(renoItemEn?.displayValue, "Designer");
});
