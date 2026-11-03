/**
 * MASKANI.TJ — Showcase Specification Acceptance Tests (Stage 2)
 * Automated verification of criteria AC-01 through AC-46
 */

import { test, describe } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  getShowcaseMiniCards,
  getShowcaseSections,
  computeMiniCardBadge,
  resolveMiniCardHref,
  resolveSectionHref,
  getDeveloperApartmentsCount,
  updateMiniCard,
  updateShowcaseSection,
  resetShowcaseToDefaults,
} from "./showcase-store";
import { resolveCatalogUrl } from "@/lib/seo/url-resolver";
import { BLOG_ARTICLES } from "@/lib/data/blog-data";
import { REALTORS_DATA } from "@/lib/data/realtors-data";
import { SERVICES_DATA } from "@/lib/data/services-data";

describe("MASKANI.TJ Stage 2 — Acceptance Criteria (AC-01 through AC-46)", () => {
  test("AC-01 & AC-02: Upper block contains exactly 7 mini-cards with approved titles and icons", () => {
    const cards = getShowcaseMiniCards();
    assert.equal(cards.length, 7, "Must contain exactly 7 mini-cards");

    const expectedTitlesRu = [
      "Новостройки",
      "Вторичка",
      "Дома и дачи",
      "Коммерция",
      "Услуги",
      "Риелторы",
      "Застройщики",
    ];

    const actualTitlesRu = cards.map((c) => c.title.ru);
    assert.deepEqual(actualTitlesRu, expectedTitlesRu);

    // Verify all cards have 3 languages defined
    for (const card of cards) {
      assert.ok(card.title.ru, "Must have RU title");
      assert.ok(card.title.tg, "Must have TG title");
      assert.ok(card.title.en, "Must have EN title");
    }
  });

  test("AC-03: All 7 approved Apple Tahoe icon PNG assets exist on disk", () => {
    const cards = getShowcaseMiniCards();
    for (const card of cards) {
      const publicPath = path.join(process.cwd(), "public", card.icon);
      assert.ok(
        fs.existsSync(publicPath),
        `Asset file must exist at ${publicPath}`
      );
    }
  });

  test("AC-05..AC-11: Target resolution conforms strictly to central URL resolver", () => {
    const cards = getShowcaseMiniCards();

    // 1. Новостройки -> /khujand/kupit/novostroyki
    const newBuildsHref = resolveMiniCardHref(cards[0], "khujand", "ru");
    assert.equal(newBuildsHref, "/khujand/kupit/novostroyki");

    // 2. Вторичка -> /khujand/kupit/vtorichka
    const resaleHref = resolveMiniCardHref(cards[1], "khujand", "ru");
    assert.equal(resaleHref, "/khujand/kupit/vtorichka");

    // 3. Дома и дачи -> /khujand/kupit/doma
    const housesHref = resolveMiniCardHref(cards[2], "khujand", "ru");
    assert.equal(housesHref, "/khujand/kupit/doma");

    // 4. Коммерция -> /khujand/kommercheskaya
    const commHref = resolveMiniCardHref(cards[3], "khujand", "ru");
    assert.equal(commHref, "/khujand/kommercheskaya");

    // 5. Услуги -> /khujand/uslugi
    const srvHref = resolveMiniCardHref(cards[4], "khujand", "ru");
    assert.equal(srvHref, "/khujand/uslugi");

    // 6. Риелторы -> /khujand/rieltory (GAP eliminated: not agencies!)
    const rltHref = resolveMiniCardHref(cards[5], "khujand", "ru");
    assert.equal(rltHref, "/khujand/rieltory");

    // 7. Застройщики -> /khujand/zastroyshchiki
    const devHref = resolveMiniCardHref(cards[6], "khujand", "ru");
    assert.equal(devHref, "/khujand/zastroyshchiki");
  });

  test("AC-10: Realtor catalog is distinct from agencies catalog", () => {
    const realtorsUrlRu = resolveCatalogUrl("catalog_realtors", "khujand", "ru");
    const agenciesUrlRu = resolveCatalogUrl("catalog_agencies", "khujand", "ru");

    assert.equal(realtorsUrlRu, "/khujand/rieltory");
    assert.equal(agenciesUrlRu, "/khujand/agentstva");
    assert.notEqual(realtorsUrlRu, agenciesUrlRu, "Realtors must NOT be conflated with agencies");

    // Check TG locale
    const realtorsUrlTg = resolveCatalogUrl("catalog_realtors", "khujand", "tg");
    const agenciesUrlTg = resolveCatalogUrl("catalog_agencies", "khujand", "tg");
    assert.equal(realtorsUrlTg, "/tg/khujand/rieltoron");
    assert.equal(agenciesUrlTg, "/tg/khujand/agenticho");
  });

  test("AC-12..AC-15: Dynamic computation of mini-card badges from actual records", () => {
    const cards = getShowcaseMiniCards();

    for (const card of cards) {
      const badge = computeMiniCardBadge(card, "khujand");
      assert.ok(
        /^\d+\+$/.test(badge),
        `Badge "${badge}" must follow format "N+" (e.g., 25+, 30+)`
      );
    }

    // Specific counts check
    const newBuildsBadge = computeMiniCardBadge(cards[0]);
    assert.equal(newBuildsBadge, "25+", "26 projects round to 25+");

    const resaleBadge = computeMiniCardBadge(cards[1]);
    assert.equal(resaleBadge, "8+", "Resale badge matches 8+ published properties");
  });

  test("AC-16..AC-18: Exactly 8 showcase sections with max 4 cards per row", () => {
    const sections = getShowcaseSections();
    assert.equal(sections.length, 8, "Must contain exactly 8 showcase sections");

    const expectedSectionTitlesRu = [
      "Новостройки",
      "Купить квартиру",
      "Снять квартиру",
      "Купить дом",
      "Коммерция",
      "Услуги",
      "Застройщики",
      "Статьи",
    ];

    const actualTitlesRu = sections.map((s) => s.title.ru);
    assert.deepEqual(actualTitlesRu, expectedSectionTitlesRu);

    for (const s of sections) {
      assert.equal(s.maxCards, 4, "Desktop layout must be 4 cards (4 x 1)");
      const href = resolveSectionHref(s, "khujand", "ru");
      assert.ok(href.startsWith("/"), "Section header must resolve to a valid URL");
    }
  });

  test("AC-30: Developer apartment count strictly verified from units", () => {
    // dev_qayroqum has 224 generated units
    const qayroqumUnits = getDeveloperApartmentsCount("dev_qayroqum");
    assert.equal(qayroqumUnits, 224, "Qayroqum Avenue units count must be 224");

    // Developer without modeled units returns 0 (count will be hidden, avoiding fake data)
    const emptyDevUnits = getDeveloperApartmentsCount("dev_unmodeled");
    assert.equal(emptyDevUnits, 0, "Unmodeled developer must return 0 units");
  });

  test("AC-31 & AC-32: 4 editorial articles with specific topics and valid covers", () => {
    assert.equal(BLOG_ARTICLES.length, 4, "Must contain exactly 4 articles");

    const expectedSlugs = [
      "kupit-ili-arendovat-nedvizhimost",
      "investitsii-v-nedvizhimost-tadzhikistana",
      "kak-vybrat-nadyozhnogo-agenta",
      "skolko-stoit-otsenka-nedvizhimosti",
    ];

    const actualSlugs = BLOG_ARTICLES.map((a) => a.slug);
    assert.deepEqual(actualSlugs, expectedSlugs);

    for (const article of BLOG_ARTICLES) {
      assert.ok(article.title, "Article must have title");
      assert.ok(article.titleTg, "Article must have TG title");
      assert.ok(article.coverImage, "Article must have cover image");

      const coverPath = path.join(process.cwd(), "public", article.coverImage);
      assert.ok(
        fs.existsSync(coverPath),
        `Article cover image must exist at ${coverPath}`
      );
    }
  });

  test("AC-33..AC-40: Super Admin store updates and protections", () => {
    resetShowcaseToDefaults();

    // 1. Can toggle visibility
    const updated = updateMiniCard("mini_commercial", { visible: false });
    assert.equal(updated?.visible, false);

    // 2. Reject arbitrary target IDs not in registry (AC-35)
    assert.throws(
      () => {
        updateMiniCard("mini_commercial", { targetId: "https://evil.com/phishing" });
      },
      /Invalid targetId/,
      "Must reject arbitrary external URLs"
    );

    // 3. Can update section title
    const secUpdated = updateShowcaseSection("sec_new_builds", {
      title: { ru: "Новостройки Худжанда", tg: "Биноҳои нав", en: "New Builds" },
    });
    assert.equal(secUpdated?.title.ru, "Новостройки Худжанда");

    // Cleanup
    resetShowcaseToDefaults();
  });

  test("AC-41 & AC-42: City switching updates target URLs without breaking locale", () => {
    const cards = getShowcaseMiniCards();

    // Dushanbe in Russian
    const dushanbeRu = resolveMiniCardHref(cards[0], "dushanbe", "ru");
    assert.equal(dushanbeRu, "/dushanbe/kupit/novostroyki");

    // Dushanbe in Tajik
    const dushanbeTg = resolveMiniCardHref(cards[0], "dushanbe", "tg");
    assert.equal(dushanbeTg, "/tg/dushanbe/furosh/binohoi-nav");

    // Khujand in English
    const khujandEn = resolveMiniCardHref(cards[0], "khujand", "en");
    assert.equal(khujandEn, "/en/khujand/sale/new-builds");
  });
});
