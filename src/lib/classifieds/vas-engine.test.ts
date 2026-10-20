import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  promoteClassified,
  getClassifiedVas,
  applyVasToCard,
  sortClassifiedsWithVas,
  getVasPromotionSummary,
} from "./vas-engine";
import type { ClassifiedCard } from "./map-card";

describe("Classifieds Freemium & VAS Promotion Engine", () => {
  test("promotes classified to TOP for 7 days (10 TJS)", () => {
    const promo = promoteClassified("prop-test-top", "top", 7, 10);
    assert.equal(promo.classifiedId, "prop-test-top");
    assert.equal(promo.isTop, true);
    assert.equal(promo.isHighlighted, false);
    assert.equal(promo.isUrgent, false);
    assert.equal(promo.amountPaidTjs, 10);
  });

  test("promotes classified with color highlight for 14 days (8 TJS)", () => {
    const promo = promoteClassified("prop-test-hl", "highlight", 14, 8);
    assert.equal(promo.isHighlighted, true);
    assert.equal(promo.isTop, false);
    assert.equal(promo.amountPaidTjs, 8);
  });

  test("promotes classified as urgent sale with fire badge (7 TJS)", () => {
    const promo = promoteClassified("prop-test-urg", "urgent", 10, 7);
    assert.equal(promo.isUrgent, true);
    assert.equal(promo.isTop, false);
    assert.equal(promo.amountPaidTjs, 7);
  });

  test("promotes classified with Turbo package (all-inclusive for 20 TJS)", () => {
    const promo = promoteClassified("prop-test-turbo", "turbo", 14, 20);
    assert.equal(promo.isTop, true);
    assert.equal(promo.isHighlighted, true);
    assert.equal(promo.isUrgent, true);
    assert.equal(promo.amountPaidTjs, 20);
  });

  test("sortClassifiedsWithVas places isTop items at the very top of catalog", () => {
    const rawCards: ClassifiedCard[] = [
      {
        id: "c-normal-1",
        slug: "c-normal-1",
        title: "Обычная квартира 1",
        dealType: "Продажа",
        propertyType: "Квартира",
        city: "Худжанд",
        district: "19 мкр",
        landmark: "",
        rooms: 2,
        area: 60,
        priceTjs: 350000,
        priceUsd: 32000,
        sellerType: "Собственник",
        phone: "+992920000001",
        whatsapp: "+992920000001",
        isNegotiable: true,
        image: "/img1.jpg",
        images: ["/img1.jpg"],
        features: [],
        description: "Описание",
        status: "active",
        viewsCount: 10,
        userId: "u1",
      },
      {
        id: "c-top-1",
        slug: "c-top-1",
        title: "ТОП квартира",
        dealType: "Продажа",
        propertyType: "Квартира",
        city: "Худжанд",
        district: "Центр",
        landmark: "",
        rooms: 3,
        area: 90,
        priceTjs: 600000,
        priceUsd: 55000,
        sellerType: "Собственник",
        phone: "+992920000002",
        whatsapp: "+992920000002",
        isNegotiable: false,
        image: "/img2.jpg",
        images: ["/img2.jpg"],
        features: [],
        description: "ТОП описание",
        status: "active",
        viewsCount: 150,
        userId: "u2",
      },
    ];

    promoteClassified("c-top-1", "top", 7, 10);

    const sorted = sortClassifiedsWithVas(rawCards);
    assert.equal(sorted[0].id, "c-top-1", "TOP item must be first");
    assert.equal(sorted[0].isTop, true);
    assert.equal(sorted[1].id, "c-normal-1", "Normal item must follow");
  });

  test("getVasPromotionSummary aggregates revenue and active promotions", () => {
    const summary = getVasPromotionSummary();
    assert.ok(summary.activePromotionsCount >= 3);
    assert.ok(summary.totalRevenueTjs > 30);
  });
});
