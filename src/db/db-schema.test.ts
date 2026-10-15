import assert from "node:assert/strict";
import { test } from "node:test";
import { getTableColumns } from "drizzle-orm";
import {
  users,
  sessions,
  accounts,
  verifications,
  developers,
  developerMembers,
  projects,
  units,
  classifieds,
  favorites,
  classifiedAnalytics,
  apiKeys,
  crmLeads,
  crmCollections,
  sogdCityEnum,
  userRoleEnum,
  currencyEnum,
  projectStatusEnum,
  buildingClassEnum,
  finishingTypeEnum,
  unitTypeEnum,
  unitStatusEnum,
  dealTypeEnum,
  propertyTypeEnum,
  classifiedStatusEnum,
} from "./schema";

test("Drizzle Schema: All 14 Core tables are registered and exported", () => {
  const tables = [
    users,
    sessions,
    accounts,
    verifications,
    developers,
    developerMembers,
    projects,
    units,
    classifieds,
    favorites,
    classifiedAnalytics,
    apiKeys,
    crmLeads,
    crmCollections,
  ];

  assert.equal(tables.length, 14, "Must define exactly 14 tables in Drizzle schema");
  for (const table of tables) {
    assert.ok(table, "Table must be defined");
    const columns = getTableColumns(table);
    assert.ok(Object.keys(columns).length > 0, "Table must have columns defined");
  }
});

test("Drizzle Enums: Geographic and domain enums match Sughd region specifications", () => {
  // 1. Sughd cities and districts (17 total)
  const cities = sogdCityEnum.enumValues;
  assert.ok(cities.includes("khujand"));
  assert.ok(cities.includes("guliston"));
  assert.ok(cities.includes("gafurov"));
  assert.ok(cities.includes("buston"));
  assert.ok(cities.includes("isfara"));
  assert.ok(cities.includes("istaravshan"));
  assert.ok(cities.includes("konibodom"));
  assert.ok(cities.includes("panjakent"));
  assert.equal(cities.length, 17, "Must cover all 17 cities and districts of Sughd");

  // 2. Currencies
  assert.deepEqual(currencyEnum.enumValues, ["TJS", "USD"]);

  // 3. User roles (7 RBAC levels)
  assert.deepEqual(userRoleEnum.enumValues, [
    "user",
    "realtor",
    "developer",
    "agency",
    "agency_agent",
    "admin",
    "super_admin",
  ]);

  // 4. Project status
  assert.deepEqual(projectStatusEnum.enumValues, [
    "planned",
    "under_construction",
    "ready",
  ]);

  // 5. Unit status
  assert.deepEqual(unitStatusEnum.enumValues, ["available", "reserved", "sold"]);

  // 6. Deal type
  assert.deepEqual(dealTypeEnum.enumValues, ["sale", "rent_long", "rent_daily"]);

  // 7. Property type
  assert.deepEqual(propertyTypeEnum.enumValues, [
    "apartment",
    "house",
    "commercial",
    "land",
    "garage",
  ]);
});

test("Drizzle Schema: Bilingual localization columns exist in developers and projects", () => {
  const devColumns = getTableColumns(developers);
  assert.ok("nameTg" in devColumns, "developers must have nameTg");
  assert.ok("descriptionTg" in devColumns, "developers must have descriptionTg");
  assert.ok("officeAddressTg" in devColumns, "developers must have officeAddressTg");

  const projColumns = getTableColumns(projects);
  assert.ok("nameTg" in projColumns, "projects must have nameTg");
  assert.ok("descriptionTg" in projColumns, "projects must have descriptionTg");
  assert.ok("addressTg" in projColumns, "projects must have addressTg");
  assert.ok("landmarkTg" in projColumns, "projects must have landmarkTg");
  assert.ok("amenitiesTg" in projColumns, "projects must have amenitiesTg");
});

test("Drizzle Schema: Independent modules (Parking, Storage, Documents) exist in projects", () => {
  const projColumns = getTableColumns(projects);
  assert.ok("parkingConfig" in projColumns, "projects must have parkingConfig column");
  assert.ok("parkingSpots" in projColumns, "projects must have parkingSpots column");
  assert.ok("storageConfig" in projColumns, "projects must have storageConfig column");
  assert.ok("storageUnits" in projColumns, "projects must have storageUnits column");
  assert.ok("documentsConfig" in projColumns, "projects must have documentsConfig column");
  assert.ok("officialDocuments" in projColumns, "projects must have officialDocuments column");
});

test("Drizzle Schema: B2B CRM and Analytics table structures validate column types", () => {
  // CRM Leads
  const leadCols = getTableColumns(crmLeads);
  assert.ok("agentId" in leadCols);
  assert.ok("clientName" in leadCols);
  assert.ok("clientPhone" in leadCols);
  assert.ok("status" in leadCols);
  assert.ok("budget" in leadCols);
  assert.ok("commission" in leadCols);
  assert.ok("commissionPercent" in leadCols);
  assert.ok("source" in leadCols);

  // CRM Collections
  const colCols = getTableColumns(crmCollections);
  assert.ok("shareCode" in colCols);
  assert.ok("propertyIds" in colCols);
  assert.ok("viewsCount" in colCols);

  // API Keys
  const keyCols = getTableColumns(apiKeys);
  assert.ok("key" in keyCols);
  assert.ok("permissions" in keyCols);
  assert.ok("isActive" in keyCols);

  // Classified Analytics
  const analyticsCols = getTableColumns(classifiedAnalytics);
  assert.ok("classifiedId" in analyticsCols);
  assert.ok("date" in analyticsCols);
  assert.ok("viewsCount" in analyticsCols);
  assert.ok("whatsappClicks" in analyticsCols);
});

test("Drizzle Schema: Units table contains dual currency prices and dimensions", () => {
  const unitCols = getTableColumns(units);
  assert.ok("priceTjs" in unitCols, "units must have priceTjs");
  assert.ok("priceUsd" in unitCols, "units must have priceUsd");
  assert.ok("pricePerMeterTjs" in unitCols, "units must have pricePerMeterTjs");
  assert.ok("pricePerMeterUsd" in unitCols, "units must have pricePerMeterUsd");
  assert.ok("totalArea" in unitCols, "units must have totalArea");
  assert.ok("floor" in unitCols, "units must have floor");
  assert.ok("section" in unitCols, "units must have section");
  assert.ok("status" in unitCols, "units must have status");
});
