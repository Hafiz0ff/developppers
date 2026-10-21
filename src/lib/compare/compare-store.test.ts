import { test, describe, beforeEach } from "node:test";
import assert from "node:assert/strict";
import {
  CompareProperty,
  addToCompareStore,
  removeFromCompareStore,
  clearCompareStore,
  getStoredCompareItems,
  isItemInCompareStore,
  detectBestMetrics,
  getDifferingRowKeys,
  MAX_COMPARE_ITEMS,
} from "./compare-store";

// Mock localStorage and window for NodeJS test runner
class MockLocalStorage {
  private store: Record<string, string> = {};
  getItem(key: string) {
    return this.store[key] || null;
  }
  setItem(key: string, value: string) {
    this.store[key] = value;
  }
  removeItem(key: string) {
    delete this.store[key];
  }
  clear() {
    this.store = {};
  }
}

const mockLS = new MockLocalStorage();
(global as any).localStorage = mockLS;
(global as any).window = {
  dispatchEvent: () => true,
};

const sampleProps: CompareProperty[] = [
  {
    id: "prop-1",
    slug: "prop-1",
    title: "1-комн. квартира Шёлкокомбинат",
    dealType: "Продажа",
    propertyType: "Квартира",
    city: "Худжанд",
    district: "Шёлкокомбинат",
    priceTjs: 300000,
    priceUsd: 27500,
    pricePerMeterTjs: 6818,
    pricePerMeterUsd: 625,
    area: 44,
    rooms: 1,
    floor: "4/9",
    image: "/img1.jpg",
    hasCityWater: true,
    hasWaterHauz: false,
    hasElectricity: true,
    hasHeating: true,
    hasSewerage: true,
    isFurnished: false,
    renovation: "Евроремонт",
    buildingType: "Монолит",
    sellerType: "Собственник",
    phone: "+992920000001",
    whatsapp: "+992920000001",
    isNegotiable: true,
  },
  {
    id: "prop-2",
    slug: "prop-2",
    title: "2-комн. квартира 19 мкр",
    dealType: "Продажа",
    propertyType: "Квартира",
    city: "Худжанд",
    district: "19 мкр",
    priceTjs: 420000,
    priceUsd: 38500,
    pricePerMeterTjs: 6461,
    pricePerMeterUsd: 592,
    area: 65,
    rooms: 2,
    floor: "3/5",
    image: "/img2.jpg",
    hasCityWater: true,
    hasWaterHauz: false,
    hasElectricity: true,
    hasHeating: true,
    hasSewerage: true,
    isFurnished: true,
    renovation: "Косметический",
    buildingType: "Панельный",
    sellerType: "Собственник",
    phone: "+992920000002",
    whatsapp: "+992920000002",
    isNegotiable: false,
  },
  {
    id: "prop-3",
    slug: "prop-3",
    title: "3-комн. квартира Центр",
    dealType: "Продажа",
    propertyType: "Квартира",
    city: "Худжанд",
    district: "Центр (Панчшанбе)",
    priceTjs: 650000,
    priceUsd: 59600,
    pricePerMeterTjs: 7222,
    pricePerMeterUsd: 662,
    area: 90,
    rooms: 3,
    floor: "7/12",
    image: "/img3.jpg",
    hasCityWater: true,
    hasWaterHauz: true,
    hasElectricity: true,
    hasHeating: false,
    hasSewerage: true,
    isFurnished: true,
    renovation: "Евроремонт",
    buildingType: "Монолит",
    sellerType: "Агентство",
    phone: "+992920000003",
    whatsapp: "+992920000003",
    isNegotiable: true,
  },
];

describe("Property Comparison Store & Difference Engine", () => {
  beforeEach(() => {
    clearCompareStore();
  });

  test("adds items to compare and verifies presence", () => {
    const res1 = addToCompareStore(sampleProps[0]);
    assert.equal(res1.success, true);
    assert.equal(res1.items.length, 1);
    assert.equal(isItemInCompareStore("prop-1"), true);
    assert.equal(isItemInCompareStore("prop-2"), false);

    const res2 = addToCompareStore(sampleProps[1]);
    assert.equal(res2.success, true);
    assert.equal(res2.items.length, 2);
    assert.equal(isItemInCompareStore("prop-2"), true);
  });

  test("does not add duplicates", () => {
    addToCompareStore(sampleProps[0]);
    const res = addToCompareStore(sampleProps[0]);
    assert.equal(res.success, true);
    assert.equal(res.items.length, 1);
  });

  test("enforces maximum limit of 4 properties", () => {
    addToCompareStore(sampleProps[0]);
    addToCompareStore(sampleProps[1]);
    addToCompareStore(sampleProps[2]);
    addToCompareStore({ ...sampleProps[0], id: "prop-4", slug: "prop-4" });

    assert.equal(getStoredCompareItems().length, 4);

    // 5th property attempt
    const res5 = addToCompareStore({ ...sampleProps[0], id: "prop-5", slug: "prop-5" });
    assert.equal(res5.success, false);
    assert.ok(res5.error?.includes(`не более ${MAX_COMPARE_ITEMS}`));
    assert.equal(getStoredCompareItems().length, 4);
  });

  test("removes item from compare correctly", () => {
    addToCompareStore(sampleProps[0]);
    addToCompareStore(sampleProps[1]);
    assert.equal(getStoredCompareItems().length, 2);

    removeFromCompareStore("prop-1");
    const after = getStoredCompareItems();
    assert.equal(after.length, 1);
    assert.equal(after[0].id, "prop-2");
    assert.equal(isItemInCompareStore("prop-1"), false);
  });

  test("detects best metrics among compared properties", () => {
    const best = detectBestMetrics([sampleProps[0], sampleProps[1], sampleProps[2]]);

    // Lowest price is prop-1 (300 000 TJS)
    assert.equal(best.lowestPriceId, "prop-1");

    // Lowest price per meter is prop-2 (6 461 TJS/m²)
    assert.equal(best.lowestPricePerMeterId, "prop-2");

    // Largest area is prop-3 (90 m²)
    assert.equal(best.largestAreaId, "prop-3");
  });

  test("detects differing row keys and identical fields", () => {
    // Both prop-1 and prop-2 have city="Худжанд", hasCityWater=true, hasWaterHauz=false, hasSewerage=true
    const diffKeys = getDifferingRowKeys([sampleProps[0], sampleProps[1]]);

    assert.ok(diffKeys.has("price"));
    assert.ok(diffKeys.has("area"));
    assert.ok(diffKeys.has("rooms"));
    assert.ok(diffKeys.has("renovation"));
    assert.ok(diffKeys.has("isFurnished"));

    // Identical fields should NOT be in diffKeys
    assert.equal(diffKeys.has("city"), false);
    assert.equal(diffKeys.has("hasCityWater"), false);
    assert.equal(diffKeys.has("hasWaterHauz"), false);
    assert.equal(diffKeys.has("hasSewerage"), false);
  });
});
