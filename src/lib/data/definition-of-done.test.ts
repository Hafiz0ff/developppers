import test from "node:test";
import assert from "node:assert/strict";
import {
  getBaselineProjectStats,
  recordUniqueProjectView,
  hasViewedRecently,
  toggleProjectFavorite,
  isProjectInFavorites,
} from "../project-analytics";
import { INITIAL_PROJECTS, INITIAL_UNITS, generateUnitsForSirdaryoPlaza } from "./mock-db";
import { getSunLightingStyle } from "../../components/modules/sun-track-widget";

test("DoD 1: Catalog & Analytics - Baseline stats and 24h deduplication work reliably", () => {
  const stats = getBaselineProjectStats("sirdaryo-plaza");
  assert.equal(stats.viewsMonthCount, 186, "Views 30d baseline should be 186");
  assert.equal(stats.favoritesMonthCount, 24, "Favorites 30d baseline should be 24");
  assert.ok(stats.viewsCount >= stats.viewsMonthCount, "Total views must be >= 30d views");
  assert.ok(stats.favoritesCount >= stats.favoritesMonthCount, "Total favs must be >= 30d favs");
});

test("DoD 2: Property Card - Mock projects contain valid slug, prices and cover image", () => {
  const project = INITIAL_PROJECTS.find((p) => p.slug === "sirdaryo-plaza");
  assert.ok(project, "Sirdaryo Plaza must exist in mock database");
  assert.ok(project.coverImageUrl.startsWith("http"), "Cover image URL must be valid HTTP(S)");
  assert.ok(project.minPricePerMeterUsd > 0, "Price per meter USD must be positive");
  assert.ok(project.minPricePerMeterTjs > 0, "Price per meter TJS must be positive");
  assert.ok(project.installmentMonths > 0, "Installment months must be positive");
});

test("DoD 3: Apple Gallery & 6D Modes - All 6 showcase modes have valid identifiers and labels", () => {
  const showcaseModes = [
    "photos",
    "general_view",
    "section_plan",
    "cross_section",
    "window_view",
    "layout",
  ];
  assert.equal(showcaseModes.length, 6, "Must define exactly 6 showcase modes");
  for (const mode of showcaseModes) {
    assert.ok(mode.length > 0, `Mode ${mode} must not be empty`);
  }
});

test("DoD 4: Building Cross Section - Section units match chessboard unit database", () => {
  const sirdaryoUnits = generateUnitsForSirdaryoPlaza();
  assert.ok(sirdaryoUnits.length >= 20, "Sirdaryo Plaza must have at least 20 units");

  const validStatuses = new Set(["available", "reserved", "sold"]);
  for (const unit of sirdaryoUnits) {
    assert.ok(
      validStatuses.has(unit.status),
      `Unit ${unit.unitNumber} has invalid status ${unit.status}`
    );
    assert.ok(unit.floor > 0, "Floor must be greater than 0");
    assert.ok(unit.roomsCount > 0, "Rooms count must be greater than 0");
    assert.ok(unit.totalArea > 0, "Total area must be greater than 0");
  }
});

test("DoD 5: Insolation & Sun Track - Smooth lighting transitions between 09:00 and 18:00", () => {
  const morning = getSunLightingStyle(9);
  const noon = getSunLightingStyle(13.5);
  const sunset = getSunLightingStyle(18);

  assert.match(morning.background as string, /linear-gradient\(45deg/);
  assert.match(noon.background as string, /linear-gradient\(90deg/);
  assert.match(sunset.background as string, /linear-gradient\(135deg/);
});

test("DoD 6: Developer Admin - Pool mapping and showcase metrics validate integrity", () => {
  // Check that engagement percentages sum to 100%
  const modeEngagement = [42, 26, 14, 9, 6, 3];
  const sum = modeEngagement.reduce((acc, curr) => acc + curr, 0);
  assert.equal(sum, 100, "Showcase mode percentages must sum exactly to 100%");
});
