import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { NextRequest } from "next/server";
import {
  buildClassifiedPublicationParts,
  buildProjectPublicationParts,
  assembleFinalTelegramCaption,
  calculateTelegramCharCount,
  getMandatoryCtaText,
  escapeTelegramHtml,
} from "./publication-builder";
import { checkObjectOwnership, getOwnedPublishableObjects } from "./ownership";
import {
  verifyTelegramChannelAdmin,
  publishPhotoToTelegramChannel,
} from "./telegram-publisher";
import {
  saveLinkedChannel,
  getLinkedChannel,
  checkRecentPublicationDuplicate,
  normalizeChannelUsername,
} from "./telegram-channel-store";
import { CATALOG_PROPERTIES } from "@/lib/catalog-data";
import { INITIAL_PROJECTS, INITIAL_DEVELOPERS } from "@/lib/data/mock-db";
import { POST as verifyChannelRoute } from "@/app/api/publications/telegram/verify-channel/route";
import { GET as getChannelRoute } from "@/app/api/publications/telegram/channel/route";
import { POST as publishRoute } from "@/app/api/publications/telegram/publish/route";
import { POST as prepareRoute } from "@/app/api/publications/prepare/route";

describe("MASKANI.TJ — Telegram Publishing Module v2.0 Integration & Unit Tests", () => {
  const sampleApartment = CATALOG_PROPERTIES[0]; // 17034738, Шёлкокомбинат
  const sampleProject = INITIAL_PROJECTS[0]; // proj_qayroqum
  const sampleDev = INITIAL_DEVELOPERS[0]; // dev_qayroqum

  describe("1. Structured Text Generation & Mandatory CTA (Section 5)", () => {
    test("Realtor CTA contains mandatory copy and valid canonical anchor link", () => {
      const partsRu = buildClassifiedPublicationParts(sampleApartment, "ru");
      assert.ok(partsRu.mandatoryCtaHtml.includes("Все фотографии и подробности объекта — на Maskani.tj"));
      assert.match(partsRu.mandatoryCtaHtml, /^<a href="https:\/\/maskani\.tj\/khujand\/kupit\/vtorichka\/.*">.*<\/a>$/);
      assert.equal(partsRu.mandatoryCtaText, "Все фотографии и подробности объекта — на Maskani.tj");

      const partsTg = buildClassifiedPublicationParts(sampleApartment, "tg");
      assert.ok(partsTg.mandatoryCtaHtml.includes("Ҳамаи аксҳо ва тафсилоти амвол — дар Maskani.tj"));
      assert.match(partsTg.mandatoryCtaHtml, /^<a href="https:\/\/maskani\.tj\/tg\/khujand\/furosh\/bozori-duyum\/.*">.*<\/a>$/);
    });

    test("Developer CTA contains mandatory copy and project canonical URL", () => {
      const partsRu = buildProjectPublicationParts(sampleProject, sampleDev, "ru");
      assert.ok(partsRu.mandatoryCtaHtml.includes("Выбирайте квартиру, изучайте планировки и условия покупки на Maskani.tj"));
      assert.equal(partsRu.mandatoryCtaText, "Выбирайте квартиру, изучайте планировки и условия покупки на Maskani.tj");
      assert.equal(partsRu.canonicalUrl, "https://maskani.tj/projects/qayroqum-avenue");

      const partsTg = buildProjectPublicationParts(sampleProject, sampleDev, "tg");
      assert.ok(partsTg.mandatoryCtaHtml.includes("Хонадонро интихоб намуда"));
      assert.equal(partsTg.canonicalUrl, "https://maskani.tj/tg/projects/qayroqum-avenue");
    });

    test("Protected contacts are separated from editable body", () => {
      const parts = buildClassifiedPublicationParts(sampleApartment, "ru");
      assert.ok(parts.protectedContacts.includes(sampleApartment.phone));
      assert.equal(parts.editableBody.includes("Контакты:"), false, "Contacts must not be in editable body");
    });
  });

  describe("2. Telegram Character Counter & 1 024 Limit (Section 6)", () => {
    test("Correctly calculates character usage, remaining chars, and reserved block", () => {
      const body = "Квартира с евроремонтом в центре города";
      const contacts = "Контакты: +992 92 771 2233";
      const cta = "Все фотографии и подробности объекта — на Maskani.tj";

      const counts = calculateTelegramCharCount(body, contacts, cta);
      assert.equal(counts.isOverLimit, false);
      assert.ok(counts.remainingChars > 800);
      assert.ok(counts.reservedChars > 0);
      assert.equal(counts.totalVisibleChars, body.length + counts.reservedChars);
    });

    test("Identifies when text exceeds 1 024 characters", () => {
      const longBody = "A".repeat(1050);
      const contacts = "Контакты: +992 92 771 2233";
      const cta = "Все фотографии и подробности объекта — на Maskani.tj";

      const counts = calculateTelegramCharCount(longBody, contacts, cta);
      assert.equal(counts.isOverLimit, true);
      assert.ok(counts.remainingChars < 0);
    });

    test("Escapes special HTML characters in caption to protect Telegram parse mode", () => {
      const unsafe = "Apartment & Loft <Special> Sale";
      const safe = escapeTelegramHtml(unsafe);
      assert.equal(safe, "Apartment &amp; Loft &lt;Special&gt; Sale");
    });
  });

  describe("3. Strict Ownership & IDOR Protection (Section 3.3)", () => {
    test("Realtor cannot access or prepare a developer project (returns 403 Forbidden)", async () => {
      const req = new NextRequest("http://localhost:3000/api/publications/prepare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          objectId: "proj_qayroqum",
          objectType: "project",
          demoRole: "realtor",
        }),
      });
      const res = await prepareRoute(req);
      assert.equal(res.status, 403);
      const data = await res.json();
      assert.equal(data.error, "forbidden");
      assert.match(data.message, /Риелторам запрещено публиковать жилые комплексы/);
    });

    test("Developer cannot access or prepare a classified listing (returns 403 Forbidden)", async () => {
      const req = new NextRequest("http://localhost:3000/api/publications/prepare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          objectId: "17034738",
          objectType: "classified",
          demoRole: "developer",
        }),
      });
      const res = await prepareRoute(req);
      assert.equal(res.status, 403);
      const data = await res.json();
      assert.equal(data.error, "forbidden");
      assert.match(data.message, /Застройщикам запрещено публиковать частные объявления/);
    });

    test("Realtor cannot publish an unowned listing (returns 403 Forbidden)", () => {
      const result = checkObjectOwnership({
        objectId: "unowned_fake_id_9999",
        objectType: "classified",
        actorRole: "realtor",
        actorId: "usr_realtor_other",
      });
      assert.equal(result.allowed, false);
      assert.match(result.reason!, /не найдено|собственные объявления/);
    });

    test("Filtering returns only owned objects for role", () => {
      const realtorItems = getOwnedPublishableObjects("realtor", "usr_realtor_01");
      assert.ok(realtorItems.length > 0);
      assert.ok(realtorItems.every((i) => i.type === "classified"));

      const devItems = getOwnedPublishableObjects("developer", "usr_dev_rep_01");
      assert.ok(devItems.length > 0);
      assert.ok(devItems.every((i) => i.type === "project"));
      assert.ok(devItems.some((i) => i.id === "proj_qayroqum"));
    });
  });

  describe("4. Telegram Channel Verification & Storage (Section 9.1)", () => {
    test("Normalizes Telegram usernames into clean @format", () => {
      assert.equal(normalizeChannelUsername("my_channel"), "@my_channel");
      assert.equal(normalizeChannelUsername("@my_channel"), "@my_channel");
      assert.equal(normalizeChannelUsername("https://t.me/my_channel"), "@my_channel");
      assert.equal(normalizeChannelUsername("https://t.me/my_channel/"), "@my_channel");
    });

    test("Saves and retrieves linked channel per user", async () => {
      const testUserId = "test_user_channel_01";
      await saveLinkedChannel({
        userId: testUserId,
        channelUsername: "khujand_apartments",
        channelTitle: "Квартиры Худжанда",
        verifiedAt: new Date().toISOString(),
      });

      const linked = await getLinkedChannel(testUserId);
      assert.ok(linked);
      assert.equal(linked.channelUsername, "@khujand_apartments");
      assert.equal(linked.channelTitle, "Квартиры Худжанда");
    });

    test("API: POST /api/publications/telegram/verify-channel successfully verifies valid channel", async () => {
      const req = new NextRequest("http://localhost:3000/api/publications/telegram/verify-channel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channelUsername: "@realty_test_sogd",
          demoRole: "realtor",
        }),
      });
      const res = await verifyChannelRoute(req);
      assert.equal(res.status, 200);
      const data = await res.json();
      assert.equal(data.success, true);
      assert.equal(data.verified, true);
      assert.equal(data.channel.channelUsername, "@realty_test_sogd");
    });

    test("API: POST /api/publications/telegram/verify-channel rejects missing channel", async () => {
      const req = new NextRequest("http://localhost:3000/api/publications/telegram/verify-channel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channelUsername: "",
          demoRole: "realtor",
        }),
      });
      const res = await verifyChannelRoute(req);
      assert.equal(res.status, 400);
    });
  });

  describe("5. Telegram Single Photo Publishing & Duplicate Prevention (Section 9.3 & 9.4)", () => {
    test("Publishes photo + caption to Telegram and returns message link", async () => {
      const req = new NextRequest("http://localhost:3000/api/publications/telegram/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          objectId: "17034738",
          objectType: "classified",
          photoUrl: "https://cdntj.somon.tj/media/cache1/9b/c7/9bc7c439558fa7c280cfb5ec74dd04b7.webp",
          editableBody: "Уютная 1-комнатная квартира в Шёлкокомбинате со свежим ремонтом.",
          locale: "ru",
          channelUsername: "@khujand_realty_official",
          demoRole: "realtor",
        }),
      });
      const res = await publishRoute(req);
      assert.equal(res.status, 200);
      const data = await res.json();
      assert.equal(data.success, true);
      assert.ok(data.messageId > 0);
      assert.match(data.postUrl, /^https:\/\/t\.me\/khujand_realty_official\/\d+$/);
    });

    test("Prevents immediate duplicate publication of same object within 15 seconds", async () => {
      const isDuplicate = await checkRecentPublicationDuplicate(
        "usr_realtor_01",
        "17034738",
        "@khujand_realty_official",
        15
      );
      assert.equal(isDuplicate, true, "Must flag immediate duplicate publication");
    });

    test("Rejects publication if caption exceeds 1 024 characters", async () => {
      const req = new NextRequest("http://localhost:3000/api/publications/telegram/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          objectId: "17034738",
          objectType: "classified",
          photoUrl: "https://cdntj.somon.tj/media/cache1/9b/c7/9bc7c439558fa7c280cfb5ec74dd04b7.webp",
          editableBody: "А".repeat(1100),
          locale: "ru",
          channelUsername: "@khujand_realty_official",
          demoRole: "realtor",
        }),
      });
      const res = await publishRoute(req);
      assert.equal(res.status, 400);
      const data = await res.json();
      assert.equal(data.error, "caption_too_long");
      assert.match(data.message, /превышает лимит Telegram/);
    });
  });
});
