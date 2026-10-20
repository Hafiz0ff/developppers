import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  getAllAdvertisers,
  getAdvertiserById,
  getAllCampaigns,
  serveAdBanner,
  recordAdClick,
  createAdvertiser,
  getSuperAdminAdAnalytics,
} from "./ad-engine";

describe("Programmatic Ad Engine & Sponsorship Platform", () => {
  test("seeded advertisers include major Tajikistan corporate giants", () => {
    const advertisers = getAllAdvertisers();
    assert.ok(advertisers.length >= 6, "Must have at least 6 corporate advertisers");

    const brandNames = advertisers.map((a) => a.brandName);
    assert.ok(brandNames.includes("Банк Эсхата"), "Must have Bank Eskhata");
    assert.ok(brandNames.includes("МегаФон Таджикистан"), "Must have Megafon");
    assert.ok(brandNames.includes("Tcell"), "Must have Tcell");
    assert.ok(brandNames.includes("Фаровон"), "Must have Farovon");
    assert.ok(brandNames.includes("Сомон Сохтмон"), "Must have Somon Sohtmon");
    assert.ok(brandNames.includes("Artel"), "Must have Artel");
  });

  test("serveAdBanner returns active sponsor or auction banner with localized content", () => {
    const bannerRu = serveAdBanner({
      city: "khujand",
      category: "new_buildings",
      language: "ru",
    });

    assert.ok(bannerRu, "Must return a banner");
    assert.ok(bannerRu.title.length > 0, "Title must not be empty");
    assert.ok(bannerRu.ctaText.length > 0, "CTA text must not be empty");
    assert.ok(
      ["sponsor_annual", "auction_bidder", "self_promo"].includes(bannerRu.tier),
      "Must have valid tier"
    );

    // Test Tajik localization
    const bannerTg = serveAdBanner({
      city: "khujand",
      category: "new_buildings",
      language: "tg",
    });
    assert.ok(bannerTg.title.length > 0, "Tajik title must not be empty");
  });

  test("serveAdBanner returns self_promo fallback when no campaign matches criteria", () => {
    const fallback = serveAdBanner({
      city: "khujand",
      category: "new_buildings",
      slot: "search_featured", // none of our seed campaigns are in search_featured
      language: "ru",
    });

    assert.equal(fallback.tier, "self_promo");
    assert.ok(fallback.title.includes("Ваша реклама здесь"));
    assert.ok(fallback.whatsapp, "Must provide contact WhatsApp");
    assert.ok(fallback.phone, "Must provide contact Phone");
  });

  test("recordAdClick increments campaign and creative click counts", () => {
    const campaigns = getAllCampaigns();
    const camp = campaigns[0];
    const initialClicks = camp.clicksCount;
    const creative = camp.creatives[0];

    const success = recordAdClick(camp.id, creative.id);
    assert.equal(success, true);
    assert.equal(camp.clicksCount, initialClicks + 1);
  });

  test("createAdvertiser adds new brand to store", () => {
    const newAdv = createAdvertiser({
      companyName: "ООО «Сугдцемент»",
      brandName: "Сугдцемент",
      tin: "050012345",
      contactPerson: "Алишер Раджабов",
      phone: "+992 92 111 2233",
      email: "info@sughdcement.tj",
      websiteUrl: "https://sughdcement.tj",
      industry: "manufacturing",
      tier: "auction_bidder",
      status: "active",
      balanceTjs: 50000,
      balanceUsd: 4600,
    });

    assert.ok(newAdv.id.startsWith("adv-"));
    const fetched = getAdvertiserById(newAdv.id);
    assert.ok(fetched);
    assert.equal(fetched.brandName, "Сугдцемент");
  });

  test("getSuperAdminAdAnalytics calculates aggregated revenue and impressions", () => {
    const analytics = getSuperAdminAdAnalytics();
    assert.ok(analytics.totalAdvertisers >= 6);
    assert.ok(analytics.activeSponsors >= 3);
    assert.ok(analytics.totalAnnualContractValueTjs > 0);
    assert.ok(analytics.totalImpressions > 0);
    assert.ok(analytics.averageCtr.includes("%"));
  });
});
