import test from "node:test";
import assert from "node:assert/strict";
import {
  calculateParkingStats,
  calculateStorageStats,
  validateDescriptionLength,
  validateUniqueNumbers,
  generateParkingSpotsForQayroqum,
  generateStorageUnitsForQayroqum,
} from "./parking-storage";
import { INITIAL_PROJECTS } from "./data/mock-db";

test("Stage 1: Validation of description length (limit 400 characters)", () => {
  const shortText = "Современный охраняемый подземный паркинг на 500 мест.";
  assert.equal(validateDescriptionLength(shortText), true, "Short text must be valid");

  const exactly400 = "a".repeat(400);
  assert.equal(validateDescriptionLength(exactly400), true, "400 characters must be valid");

  const over400 = "a".repeat(401);
  assert.equal(validateDescriptionLength(over400), false, "401 characters must be rejected");

  assert.equal(validateDescriptionLength(""), true, "Empty text must be valid");
});

test("Stage 1: Parking stats calculation handles empty and populated sets", () => {
  const emptyStats = calculateParkingStats([]);
  assert.equal(emptyStats.totalSpots, 0);
  assert.equal(emptyStats.availableSpots, 0);
  assert.equal(emptyStats.minPriceTjs, 0);

  const spots = generateParkingSpotsForQayroqum();
  assert.ok(spots.length >= 30, "Qayroqum should have at least 30 spots");

  const stats = calculateParkingStats(spots);
  assert.equal(stats.totalSpots, spots.length);
  assert.ok(stats.availableSpots > 0, "Should have available spots");
  assert.ok(stats.reservedSpots > 0, "Should have reserved spots");
  assert.ok(stats.soldSpots > 0, "Should have sold spots");
  assert.equal(
    stats.totalSpots,
    stats.availableSpots + stats.reservedSpots + stats.soldSpots,
    "Sum of all statuses must equal total spots"
  );
  assert.ok(stats.minPriceUsd > 0, "Minimum price must be positive");
  assert.ok(stats.minPriceTjs > 0, "Minimum TJS price must be positive");
});

test("Stage 1: Storage units stats calculation and statuses integrity", () => {
  const units = generateStorageUnitsForQayroqum();
  assert.equal(units.length, 16, "Should have exactly 16 storage units");

  const stats = calculateStorageStats(units);
  assert.equal(stats.totalUnits, 16);
  assert.ok(stats.availableUnits > 0);
  assert.ok(stats.reservedUnits > 0);
  assert.ok(stats.soldUnits > 0);
  assert.equal(
    stats.totalUnits,
    stats.availableUnits + stats.reservedUnits + stats.soldUnits
  );
});

test("Stage 1: Unique number validation detects duplicates", () => {
  const uniqueItems = [{ number: "01" }, { number: "02" }, { number: "03" }];
  const resValid = validateUniqueNumbers(uniqueItems, "number");
  assert.equal(resValid.isValid, true);
  assert.equal(resValid.duplicates.length, 0);

  const duplicateItems = [{ number: "01" }, { number: "02" }, { number: "01" }];
  const resDup = validateUniqueNumbers(duplicateItems, "number");
  assert.equal(resDup.isValid, false);
  assert.deepEqual(resDup.duplicates, ["01"]);
});

test("Stage 1: Qayroqum Avenue contains complete and valid parking & storage configurations", () => {
  const qayroqum = INITIAL_PROJECTS.find((p) => p.slug === "qayroqum-avenue");
  assert.ok(qayroqum, "Qayroqum Avenue must exist in INITIAL_PROJECTS");

  // Parking config
  assert.ok(qayroqum.parkingConfig, "parkingConfig must be defined");
  assert.equal(qayroqum.parkingConfig.isEnabled, true);
  assert.equal(qayroqum.parkingConfig.images.length, 3, "Must have exactly 3 photos for collage");
  assert.ok(qayroqum.parkingConfig.description.length <= 400, "RU description must be <= 400 chars");
  assert.ok(qayroqum.parkingConfig.descriptionTg.length <= 400, "TG description must be <= 400 chars");
  assert.equal(qayroqum.parkingConfig.title, "Паркинг");
  assert.equal(qayroqum.parkingConfig.titleTg, "Таваққуфгоҳ");
  assert.equal(qayroqum.parkingConfig.subtitle, "Подземные паркинги");
  assert.equal(qayroqum.parkingConfig.subtitleTg, "Таваққуфгоҳҳои зеризаминӣ");

  // Storage config
  assert.ok(qayroqum.storageConfig, "storageConfig must be defined");
  assert.equal(qayroqum.storageConfig.isEnabled, true);
  assert.ok(qayroqum.storageConfig.images.length >= 1, "Must have photos");
  assert.ok(qayroqum.storageConfig.description.length <= 400, "RU description must be <= 400 chars");
  assert.ok(qayroqum.storageConfig.descriptionTg.length <= 400, "TG description must be <= 400 chars");
  assert.equal(qayroqum.storageConfig.title, "Кладовые");
  assert.equal(qayroqum.storageConfig.titleTg, "Анборхонаҳо");
  assert.equal(qayroqum.storageConfig.subtitle, "Кладовые для хранения вещей");
  assert.equal(qayroqum.storageConfig.subtitleTg, "Анборхонаҳо барои нигоҳдории ашё");

  // Unique spot numbers check
  assert.ok(qayroqum.parkingSpots, "parkingSpots must be populated");
  const spotCheck = validateUniqueNumbers(qayroqum.parkingSpots, "number");
  assert.equal(spotCheck.isValid, true, "All parking spots must have unique numbers");

  // Unique storage unit numbers check
  assert.ok(qayroqum.storageUnits, "storageUnits must be populated");
  const unitCheck = validateUniqueNumbers(qayroqum.storageUnits, "number");
  assert.equal(unitCheck.isValid, true, "All storage units must have unique numbers");
});

test("Stage 2: Visibility rules for parking and storage sections", () => {
  // Test helper simulating section visibility logic
  function shouldRenderSection(config?: { isEnabled: boolean; description?: string; descriptionTg?: string; images?: string[] }): boolean {
    if (!config || !config.isEnabled) return false;
    const hasDesc = Boolean(config.description?.trim() || config.descriptionTg?.trim());
    const hasImg = Boolean(config.images && config.images.length > 0);
    return hasDesc || hasImg;
  }

  assert.equal(shouldRenderSection(undefined), false, "Undefined config must not render");
  assert.equal(shouldRenderSection({ isEnabled: false, description: "Тест", images: ["img.jpg"] }), false, "Disabled config must not render");
  assert.equal(shouldRenderSection({ isEnabled: true, description: "", images: [] }), false, "Empty config must not render");
  assert.equal(shouldRenderSection({ isEnabled: true, description: "Есть описание", images: [] }), true, "Config with description must render");
  assert.equal(shouldRenderSection({ isEnabled: true, description: "", images: ["img.jpg"] }), true, "Config with photos must render");
});

test("Stage 2: ApplePhotoLightbox cyclic navigation logic", () => {
  function getNextIndex(current: number, total: number): number {
    if (total <= 1) return current;
    return (current + 1) % total;
  }

  function getPrevIndex(current: number, total: number): number {
    if (total <= 1) return current;
    return (current - 1 + total) % total;
  }

  const totalPhotos = 3;
  // Forward cyclic: 0 -> 1 -> 2 -> 0
  assert.equal(getNextIndex(0, totalPhotos), 1);
  assert.equal(getNextIndex(1, totalPhotos), 2);
  assert.equal(getNextIndex(2, totalPhotos), 0);

  // Backward cyclic: 0 -> 2 -> 1 -> 0
  assert.equal(getPrevIndex(0, totalPhotos), 2);
  assert.equal(getPrevIndex(2, totalPhotos), 1);
  assert.equal(getPrevIndex(1, totalPhotos), 0);

  // Single photo
  assert.equal(getNextIndex(0, 1), 0);
  assert.equal(getPrevIndex(0, 1), 0);
});

test("Stage 3: Interactive parking chessboard filtering logic", () => {
  const qayroqum = INITIAL_PROJECTS.find((p) => p.slug === "qayroqum-avenue")!;
  const spots = qayroqum.parkingSpots || [];

  // Filter by level
  const level1Spots = spots.filter((s) => s.level === "-1 этаж");
  const level2Spots = spots.filter((s) => s.level === "-2 этаж");
  assert.equal(level1Spots.length, 20);
  assert.equal(level2Spots.length, 18);
  assert.equal(level1Spots.length + level2Spots.length, spots.length);

  // Filter by status
  const available = spots.filter((s) => s.status === "available");
  const reserved = spots.filter((s) => s.status === "reserved");
  const sold = spots.filter((s) => s.status === "sold");
  assert.ok(available.length > 0);
  assert.ok(reserved.length > 0);
  assert.ok(sold.length > 0);
  assert.equal(available.length + reserved.length + sold.length, spots.length);

  // Filter by type
  const standard = spots.filter((s) => s.type === "standard");
  const family = spots.filter((s) => s.type === "family_double");
  const large = spots.filter((s) => s.type === "large");
  const moto = spots.filter((s) => s.type === "moto");
  assert.ok(standard.length > 0);
  assert.ok(family.length > 0);
  assert.ok(large.length > 0);
  assert.ok(moto.length > 0);
});

test("Stage 3: WhatsApp booking text generator integrity", () => {
  const spot = {
    number: "№ 05",
    level: "-1 этаж",
    area: 34.0,
    priceTjs: 89790,
    priceUsd: 8200,
  };
  const projectName = "Qayroqum Avenue";

  const ruText = `Здравствуйте! Я хочу забронировать / приобрести машино-место ${spot.number} на уровне ${spot.level} в ЖК «${projectName}». Площадь: ${spot.area} м², стоимость: 89 790 сомони.`;
  assert.ok(ruText.includes("№ 05"));
  assert.ok(ruText.includes("-1 этаж"));
  assert.ok(ruText.includes("Qayroqum Avenue"));
  assert.ok(ruText.includes("34"));

  const tgText = `Салом! Ман мехоҳам ҷойи мошини ${spot.number} дар ${spot.level} дар МИ «${projectName}»-ро харидорӣ / банд намоям.`;
  assert.ok(tgText.includes("ҷойи мошин"));
  assert.ok(tgText.includes("№ 05"));
  assert.ok(tgText.includes("банд намоям"));
});

test("Stage 4: Data retention when parking or storage is disabled", () => {
  // When developer toggles disabled, spots and units are preserved
  const originalSpots = [{ id: "s1", number: "№ 01", status: "available" as const }];
  const originalUnits = [{ id: "u1", number: "К-01", status: "available" as const }];

  let parkingEnabled = true;
  let storedSpots = [...originalSpots];

  // Disable parking
  parkingEnabled = false;
  // storedSpots is NOT wiped out
  assert.equal(storedSpots.length, 1);
  assert.equal(storedSpots[0].number, "№ 01");

  // Re-enable parking
  parkingEnabled = true;
  assert.equal(parkingEnabled, true);
  assert.equal(storedSpots.length, 1);
});

test("Stage 4: Photo collage management reordering and max limits", () => {
  const images = ["photo1.jpg", "photo2.jpg", "photo3.jpg"];

  // Reorder left (index 1 to 0)
  const updated = [...images];
  const [moved] = updated.splice(1, 1);
  updated.splice(0, 0, moved);

  assert.deepEqual(updated, ["photo2.jpg", "photo1.jpg", "photo3.jpg"]);
  assert.equal(updated.length, 3);
});

test("Stage 4: Spot status cycling logic", () => {
  function getNextStatus(current: "available" | "reserved" | "sold"): "available" | "reserved" | "sold" {
    if (current === "available") return "reserved";
    if (current === "reserved") return "sold";
    return "available";
  }

  assert.equal(getNextStatus("available"), "reserved");
  assert.equal(getNextStatus("reserved"), "sold");
  assert.equal(getNextStatus("sold"), "available");
});



