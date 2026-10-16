import test from "node:test";
import assert from "node:assert/strict";
import {
  calculateBundleTotal,
  formatSeparatedNumber,
  generateTimeSlots,
  getDeveloperCrmSettings,
} from "./crm-booking-store";
import { SelectedDealBundle } from "@/types/crm-booking";

test("CRM Booking DoD-01..03: Developer CRM Settings & State Transitions", () => {
  // dev-1 has CRM connected and scenario enabled by default
  const settings1 = getDeveloperCrmSettings("dev-1");
  assert.equal(settings1.crmConnected, true);
  assert.equal(settings1.bookingScenarioEnabled, true);
  assert.equal(settings1.workHoursStart, "09:00");
  assert.equal(settings1.workHoursEnd, "22:00");

  // dev-2 has CRM disconnected
  const settings2 = getDeveloperCrmSettings("dev-2");
  assert.equal(settings2.crmConnected, false);
  assert.equal(settings2.bookingScenarioEnabled, false);

  // Unknown developer returns safe defaults
  const settingsUnknown = getDeveloperCrmSettings("unknown-developer-xyz");
  assert.equal(settingsUnknown.crmConnected, false);
  assert.equal(settingsUnknown.bookingScenarioEnabled, false);
  assert.equal(settingsUnknown.workHoursStart, "09:00");
  assert.equal(settingsUnknown.workHoursEnd, "22:00");
});

test("CRM Booking DoD-07 & DoD-10: Deal Builder (Cart) Calculations & Independence", () => {
  const mockApartment = {
    id: "u_48",
    number: "48",
    roomsCount: 2,
    floor: 4,
    totalArea: 56,
    priceTjs: 720000,
    priceUsd: 66055,
  };

  const mockParking = {
    id: "p_16",
    number: "16",
    level: "-1 этаж",
    area: 15,
    priceTjs: 85000,
    priceUsd: 7798,
  };

  const mockStorage = {
    id: "s_12",
    number: "12",
    level: "-1 этаж",
    area: 6,
    priceTjs: 20000,
    priceUsd: 1835,
  };

  // 1. Empty bundle
  const emptyBundle: SelectedDealBundle = { unit: null, parking: null, storage: null };
  const resEmpty = calculateBundleTotal(emptyBundle, "TJS");
  assert.equal(resEmpty.total, 0);
  assert.equal(resEmpty.itemsCount, 0);
  assert.equal(resEmpty.hasItems, false);

  // 2. Unit only
  const unitOnlyBundle: SelectedDealBundle = { unit: mockApartment, parking: null, storage: null };
  const resUnit = calculateBundleTotal(unitOnlyBundle, "TJS");
  assert.equal(resUnit.total, 720000);
  assert.equal(resUnit.itemsCount, 1);
  assert.equal(resUnit.hasItems, true);

  const resUnitUsd = calculateBundleTotal(unitOnlyBundle, "USD");
  assert.equal(resUnitUsd.total, 66055);

  // 3. Apartment + Parking + Storage bundle (DoD-10)
  const fullBundle: SelectedDealBundle = {
    unit: mockApartment,
    parking: mockParking,
    storage: mockStorage,
  };

  const resFull = calculateBundleTotal(fullBundle, "TJS");
  assert.equal(resFull.unitCost, 720000);
  assert.equal(resFull.parkingCost, 85000);
  assert.equal(resFull.storageCost, 20000);
  assert.equal(resFull.total, 825000); // 720 000 + 85 000 + 20 000 = 825 000
  assert.equal(resFull.itemsCount, 3);

  // 4. Removing parking retains apartment without resetting it (DoD-10)
  const bundleWithoutParking: SelectedDealBundle = {
    ...fullBundle,
    parking: null,
  };

  const resWithoutParking = calculateBundleTotal(bundleWithoutParking, "TJS");
  assert.equal(bundleWithoutParking.unit?.number, "48");
  assert.equal(resWithoutParking.parkingCost, 0);
  assert.equal(resWithoutParking.total, 740000); // 720 000 + 20 000
  assert.equal(resWithoutParking.itemsCount, 2);

  // 5. Removing storage retains apartment
  const bundleWithoutStorage: SelectedDealBundle = {
    ...bundleWithoutParking,
    storage: null,
  };
  const resWithoutStorage = calculateBundleTotal(bundleWithoutStorage, "TJS");
  assert.equal(bundleWithoutStorage.unit?.number, "48");
  assert.equal(resWithoutStorage.total, 720000);
  assert.equal(resWithoutStorage.itemsCount, 1);
});

test("CRM Booking DoD-07: Price Formatting with Space Separator", () => {
  assert.equal(formatSeparatedNumber(720000), "720 000");
  assert.equal(formatSeparatedNumber(85000), "85 000");
  assert.equal(formatSeparatedNumber(20000), "20 000");
  assert.equal(formatSeparatedNumber(825000), "825 000");
  assert.equal(formatSeparatedNumber(1250000), "1 250 000");
  assert.equal(formatSeparatedNumber(0), "0");
});

test("CRM Booking DoD-11 & DoD-12: Time Slots Generation (09:00 - 22:00)", () => {
  const slots = generateTimeSlots("09:00", "22:00", false);
  assert.equal(slots.length, 27); // 9:00, 9:30, 10:00 ... 22:00
  assert.equal(slots[0].value, "09:00");
  assert.equal(slots[slots.length - 1].value, "22:00");
  assert.ok(slots.every((s) => !s.disabled));

  // Custom range
  const customSlots = generateTimeSlots("10:00", "12:00", false);
  assert.deepEqual(
    customSlots.map((s) => s.value),
    ["10:00", "10:30", "11:00", "11:30", "12:00"]
  );
});
