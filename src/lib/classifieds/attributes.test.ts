import assert from "node:assert/strict";
import { test } from "node:test";
import {
  getAllSections,
  getApplicableSections,
  getAllAttributes,
  getApplicableAttributes,
  validateAttributeValues,
  formatAttributesForDisplay,
  archiveAttributeDefinition,
  restoreAttributeDefinition,
  sanitizeIconKey,
  mergeLegacyClassifiedAttributes,
  ALLOWED_ICON_KEYS,
  ENUM_BUILDING_TYPES,
  ENUM_BATHROOM_TYPES,
  ENUM_RENOVATION_TYPES,
  ENUM_REDEVELOPMENT_STATUS,
  ENUM_BUILDING_CLASSES,
} from "./attributes";

test("Listing Attributes Registry: All sections from TZ are registered with valid order", () => {
  const sections = getAllSections();
  assert.ok(sections.length >= 7, `Expected at least 7 sections, got ${sections.length}`);

  const sectionCodes = sections.map((s) => s.code);
  assert.ok(sectionCodes.includes("amenities"));
  assert.ok(sectionCodes.includes("building_info"));
  assert.ok(sectionCodes.includes("unit_info"));
  assert.ok(sectionCodes.includes("legal_info"));
  assert.ok(sectionCodes.includes("commercial_building"));
  assert.ok(sectionCodes.includes("commercial_engineering"));
  assert.ok(sectionCodes.includes("commercial_infrastructure"));

  // Check trilingual labels
  for (const section of sections) {
    assert.ok(section.labels.ru, `Section ${section.code} missing RU label`);
    assert.ok(section.labels.tg, `Section ${section.code} missing TG label`);
    assert.ok(section.labels.en, `Section ${section.code} missing EN label`);
  }
});

test("Listing Attributes Registry: All attributes have valid allowlisted iconKey and metadata", () => {
  const attrs = getAllAttributes();
  assert.ok(attrs.length >= 45, `Expected at least 45 attributes, got ${attrs.length}`);

  for (const attr of attrs) {
    assert.ok(attr.code, "Attribute must have a code");
    assert.ok(attr.sectionCode, `Attribute ${attr.code} must have a sectionCode`);
    assert.ok(attr.labels.ru, `Attribute ${attr.code} missing RU label`);
    assert.ok(attr.labels.tg, `Attribute ${attr.code} missing TG label`);
    assert.ok(attr.labels.en, `Attribute ${attr.code} missing EN label`);

    // Icon key must be from the allowlist
    const isAllowed = (ALLOWED_ICON_KEYS as readonly string[]).includes(attr.iconKey);
    assert.ok(
      isAllowed,
      `Attribute ${attr.code} has unlisted iconKey '${attr.iconKey}'. Must be in ALLOWED_ICON_KEYS.`
    );
  }
});

test("Applicability: legal_info is available ONLY for sale and excluded from rentals", () => {
  // 1. For sale apartment: legal_info must be present
  const saleSections = getApplicableSections("sale", "apartment");
  const saleSectionCodes = saleSections.map((s) => s.code);
  assert.ok(saleSectionCodes.includes("legal_info"), "Sale must include legal_info section");

  const saleAttrs = getApplicableAttributes("sale", "apartment");
  assert.ok(
    saleAttrs.some((a) => a.code === "minor_owners"),
    "Sale apartment must include minor_owners attribute"
  );

  // 2. For rent_long apartment: legal_info must be strictly absent
  const rentLongSections = getApplicableSections("rent_long", "apartment");
  const rentLongSectionCodes = rentLongSections.map((s) => s.code);
  assert.ok(!rentLongSectionCodes.includes("legal_info"), "Rent long must NEVER include legal_info");

  const rentLongAttrs = getApplicableAttributes("rent_long", "apartment");
  assert.ok(
    !rentLongAttrs.some((a) => a.code === "minor_owners"),
    "Rent long must NEVER include minor_owners attribute"
  );

  // 3. For rent_daily apartment: legal_info must also be strictly absent
  const rentDailySections = getApplicableSections("rent_daily", "apartment");
  assert.ok(
    !rentDailySections.some((s) => s.code === "legal_info"),
    "Rent daily must NEVER include legal_info"
  );
});

test("Applicability: Residential vs Commercial isolation", () => {
  // 1. Apartment (residential) must not include commercial sections
  const resSections = getApplicableSections("sale", "apartment").map((s) => s.code);
  assert.ok(!resSections.includes("commercial_building"));
  assert.ok(!resSections.includes("commercial_engineering"));
  assert.ok(!resSections.includes("commercial_infrastructure"));

  // 2. Office (commercial) must not include residential sections
  const commSections = getApplicableSections("rent_long", "office").map((s) => s.code);
  assert.ok(!commSections.includes("amenities"));
  assert.ok(!commSections.includes("building_info"));
  assert.ok(!commSections.includes("unit_info"));
  assert.ok(!commSections.includes("legal_info"));

  // 3. Office must include all commercial sections
  assert.ok(commSections.includes("commercial_building"));
  assert.ok(commSections.includes("commercial_engineering"));
  assert.ok(commSections.includes("commercial_infrastructure"));
});

test("Validation: rejects unknown, inactive or inapplicable attributes", () => {
  // 1. Inapplicable legal field in rental must be rejected
  const resRentalWithLegal = validateAttributeValues("rent_long", "apartment", {
    minor_owners: true,
    wifi: true,
  });
  assert.equal(resRentalWithLegal.valid, false);
  assert.ok(resRentalWithLegal.errors.minor_owners, "Must reject minor_owners on rental");

  // 2. Commercial field sent in residential ad must be rejected
  const resWithCommField = validateAttributeValues("sale", "apartment", {
    fire_extinguishing: true,
    wifi: true,
  });
  assert.equal(resWithCommField.valid, false);
  assert.ok(resWithCommField.errors.fire_extinguishing);

  // 3. Unknown field must be rejected
  const unknownRes = validateAttributeValues("sale", "apartment", {
    hacker_injection: "<script>alert(1)</script>",
  });
  assert.equal(unknownRes.valid, false);
  assert.ok(unknownRes.errors.hacker_injection);
});

test("Validation: enforces strict types, enum options and numerical bounds", () => {
  // 1. Invalid boolean
  const boolCheck = validateAttributeValues("sale", "apartment", {
    wifi: "yes_sure",
  });
  assert.equal(boolCheck.valid, false);
  assert.ok(boolCheck.errors.wifi);

  // 2. Built year out of bounds (< 1800 or > 2036)
  const yearTooOld = validateAttributeValues("sale", "apartment", {
    built_year: 1600,
  });
  assert.equal(yearTooOld.valid, false);
  assert.ok(yearTooOld.errors.built_year);

  // 3. Invalid enum value
  const badEnum = validateAttributeValues("sale", "apartment", {
    renovation_type: "super_gold_diamond",
  });
  assert.equal(badEnum.valid, false);
  assert.ok(badEnum.errors.renovation_type);

  // 4. Valid payload must pass cleanly with sanitized output
  const validPayload = {
    wifi: true,
    heating: true,
    built_year: 2022,
    ceiling_height: 3.1,
    floor: 7,
    floors_count: 16,
    renovation_type: "euro",
    bathroom_type: "separated",
    minor_owners: false,
  };

  const validCheck = validateAttributeValues("sale", "apartment", validPayload);
  assert.equal(validCheck.valid, true);
  assert.equal(Object.keys(validCheck.errors).length, 0);
  assert.equal(validCheck.sanitizedValues.built_year, 2022);
  assert.equal(validCheck.sanitizedValues.renovation_type, "euro");
});

test("Card Presentation Formatter: groups by section, localizes and excludes false booleans", () => {
  const rawAttrs = {
    wifi: true,
    heating: false, // Must be omitted from card to avoid clutter
    built_year: 2023,
    ceiling_height: 3.0,
    renovation_type: "euro",
    bathroom_type: "separated",
    minor_owners: true,
  };

  // 1. Russian formatting
  const formattedRu = formatAttributesForDisplay(rawAttrs, "ru", "sale", "apartment");
  assert.ok(formattedRu.length >= 3, "Must produce multiple formatted sections");

  const amenitiesSecRu = formattedRu.find((s) => s.code === "amenities");
  assert.ok(amenitiesSecRu);
  assert.equal(amenitiesSecRu.title, "Удобства и подробности");
  // wifi is included, heating is false so omitted
  assert.ok(amenitiesSecRu.items.some((i) => i.code === "wifi"));
  assert.ok(!amenitiesSecRu.items.some((i) => i.code === "heating"));

  const unitSecRu = formattedRu.find((s) => s.code === "unit_info");
  assert.ok(unitSecRu);
  const renoItem = unitSecRu.items.find((i) => i.code === "renovation_type");
  assert.ok(renoItem);
  assert.equal(renoItem.displayValue, "Евроремонт");

  // 2. Tajik formatting
  const formattedTg = formatAttributesForDisplay(rawAttrs, "tg", "sale", "apartment");
  const unitSecTg = formattedTg.find((s) => s.code === "unit_info");
  assert.ok(unitSecTg);
  assert.equal(unitSecTg.title, "Дар бораи манзил");
  const renoItemTg = unitSecTg.items.find((i) => i.code === "renovation_type");
  assert.ok(renoItemTg);
  assert.equal(renoItemTg.displayValue, "Таъмири аврупоӣ");

  // 3. English formatting
  const formattedEn = formatAttributesForDisplay(rawAttrs, "en", "sale", "apartment");
  const legalSecEn = formattedEn.find((s) => s.code === "legal_info");
  assert.ok(legalSecEn);
  assert.equal(legalSecEn.title, "Legal Particulars");
});

test("Archival: deactivating an attribute hides it from new forms without deleting data", () => {
  // Archive 'smart_home'
  const ok = archiveAttributeDefinition("smart_home");
  assert.equal(ok, true);

  const activeAttrs = getApplicableAttributes("sale", "apartment");
  assert.ok(!activeAttrs.some((a) => a.code === "smart_home"), "Archived attribute must not be applicable");

  // Attempting to submit archived attribute must be rejected
  const res = validateAttributeValues("sale", "apartment", { smart_home: true });
  assert.equal(res.valid, false);
  assert.ok(res.errors.smart_home);

  // Restore for subsequent tests
  restoreAttributeDefinition("smart_home");
  const restoredAttrs = getApplicableAttributes("sale", "apartment");
  assert.ok(restoredAttrs.some((a) => a.code === "smart_home"), "Restored attribute must be applicable again");
});

test("Backward Compatibility: merges legacy columns into attributes dictionary", () => {
  const legacyItem = {
    hasHeating: true,
    isFurnished: true,
    floor: 4,
    floorsCount: 9,
    renovation: "Евроремонт",
    buildingType: "Монолитный",
    attributes: {
      wifi: true,
    },
  };

  const merged = mergeLegacyClassifiedAttributes(legacyItem);
  assert.equal(merged.wifi, true);
  assert.equal(merged.heating, true);
  assert.equal(merged.furnished, true);
  assert.equal(merged.floor, 4);
  assert.equal(merged.floors_count, 9);
  assert.equal(merged.renovation_type, "euro");
  assert.equal(merged.building_type, "monolith");
});

test("Icon Key Sanitization: unlisted keys fall back to 'info'", () => {
  assert.equal(sanitizeIconKey("wifi"), "wifi");
  assert.equal(sanitizeIconKey("elevator"), "elevator");
  assert.equal(sanitizeIconKey("random_non_existent_key_123"), "info");
});
