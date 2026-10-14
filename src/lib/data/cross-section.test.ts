import assert from "node:assert/strict";
import { test } from "node:test";
import { generateUnitsForSirdaryoPlaza } from "./mock-db";

test("sirdaryo plaza units have valid cross-section structure and status counts", () => {
  const units = generateUnitsForSirdaryoPlaza();
  assert.ok(units.length > 0, "Units array should not be empty");

  // Ensure all units have valid statuses
  const validStatuses = new Set(["available", "reserved", "sold"]);
  for (const unit of units) {
    assert.ok(
      validStatuses.has(unit.status),
      `Unit ${unit.unitNumber} has invalid status ${unit.status}`
    );
    assert.ok(unit.floor >= 1 && unit.floor <= 12, `Floor ${unit.floor} out of range`);
    assert.ok(unit.roomsCount >= 1 && unit.roomsCount <= 4, `Rooms ${unit.roomsCount} out of range`);
  }

  // Check section distribution
  const sections = new Set(units.map((u) => u.section));
  assert.equal(sections.size, 3, "Expected 3 sections in Sirdaryo Plaza");

  // Count by status
  const available = units.filter((u) => u.status === "available").length;
  const reserved = units.filter((u) => u.status === "reserved").length;
  const sold = units.filter((u) => u.status === "sold").length;

  assert.ok(available > 0, "Must have available units");
  assert.ok(reserved > 0, "Must have reserved units");
  assert.ok(sold > 0, "Must have sold units");
  assert.equal(available + reserved + sold, units.length);
});

test("cross-section grouping correctly maps units per floor and section", () => {
  const units = generateUnitsForSirdaryoPlaza();
  const section1Units = units.filter((u) => u.section === "Секция 1");
  assert.ok(section1Units.length > 0);

  // Group by floor
  const floorMap = new Map<number, typeof units>();
  for (const u of section1Units) {
    const list = floorMap.get(u.floor) || [];
    list.push(u);
    floorMap.set(u.floor, list);
  }

  // Floors 1 to 12 must have units
  for (let f = 1; f <= 12; f++) {
    const floorList = floorMap.get(f);
    assert.ok(floorList && floorList.length > 0, `Floor ${f} must have units`);
  }
});
