import { test, describe, beforeEach } from "node:test";
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
import { checkObjectOwnership, getOwnedPublishableObjects, getObjectPhotos } from "./ownership";
import {
  verifyTelegramChannelAdmin,
  publishPhotoToTelegramChannel,
} from "./telegram-publisher";
import {
  saveLinkedChannel,
  getLinkedChannel,
  checkRecentPublicationDuplicate,
  normalizeChannelUsername,
  acquirePublicationLock,
  finalizePublicationLock,
} from "./telegram-channel-store";
import { CATALOG_PROPERTIES } from "@/lib/catalog-data";
import { INITIAL_PROJECTS, INITIAL_DEVELOPERS } from "@/lib/data/mock-db";
import { POST as verifyChannelRoute } from "@/app/api/publications/telegram/verify-channel/route";
import { GET as getChannelRoute } from "@/app/api/publications/telegram/channel/route";
import { POST as publishRoute } from "@/app/api/publications/telegram/publish/route";
import { POST as prepareRoute } from "@/app/api/publications/prepare/route";
import { GET as getObjectsRoute } from "@/app/api/publications/objects/route";
import { getPublicationsActor } from "./auth-guard";

describe("MASKANI.TJ — Telegram Publishing Module v2.0 (Hardened Security Suite)", () => {
  const sampleApartment = CATALOG_PROPERTIES[0];
  const sampleProject = INITIAL_PROJECTS[0]; // proj_qayroqum
  const sampleDev = INITIAL_DEVELOPERS[0]; // dev_qayroqum

  beforeEach(() => {
    // Ensure test environment is active
    (process.env as Record<string, string | undefined>).NODE_ENV = "test";
    process.env.ALLOW_PUBLICATIONS_DEMO = "true";
  });

  describe("1. Authentication & Role Guard (Remark 1)", () => {
    test("Rejects unauthenticated role spoofing when demo mode is disabled", async () => {
      // Temporarily disable demo mode
      process.env.ALLOW_PUBLICATIONS_DEMO = "false";
      (process.env as Record<string, string | undefined>).NODE_ENV = "production";

      const req = new NextRequest("http://localhost:3000/api/publications/objects?demoRole=realtor");
      const actor = await getPublicationsActor(req);
      assert.equal(actor, null, "Should not allow demoRole spoofing in production without session");

      const res = await getObjectsRoute(req);
      assert.equal(res.status, 401);
      const data = await res.json();
      assert.equal(data.error, "unauthorized");

      // Restore test env
      (process.env as Record<string, string | undefined>).NODE_ENV = "test";
      process.env.ALLOW_PUBLICATIONS_DEMO = "true";
    });

    test("Permits test actor only when ALLOW_PUBLICATIONS_DEMO is true and flags isDemo: true", async () => {
      const req = new NextRequest("http://localhost:3000/api/publications/objects?demoRole=realtor");
      const actor = await getPublicationsActor(req);
      assert.ok(actor);
      assert.equal(actor.role, "realtor");
      assert.equal(actor.isDemo, true);
    });
  });

  describe("2. Strict Ownership & IDOR Protection (Remarks 2 & 7)", () => {
    test("Realtor A cannot access or publish existing listing owned by Realtor B (returns 403 Forbidden)", async () => {
      // 16766211 belongs to usr_realtor_01
      // Attempt access by usr_realtor_02
      const result = await checkObjectOwnership({
        objectId: "16766211",
        objectType: "classified",
        actorRole: "realtor",
        actorId: "usr_realtor_02", // Different realtor
      });

      assert.equal(result.allowed, false);
      assert.equal(result.statusCode, 403);
      assert.match(result.reason!, /только собственные объявления/);
    });

    test("Developer B cannot access or publish existing project of Developer A (returns 403 Forbidden)", async () => {
      // proj_qayroqum belongs to dev_qayroqum (rep: usr_dev_rep_01)
      // Attempt access by usr_dev_istiqlol (Istiqlol Group rep)
      const result = await checkObjectOwnership({
        objectId: "proj_qayroqum",
        objectType: "project",
        actorRole: "developer",
        actorId: "usr_dev_istiqlol", // Different developer
      });

      assert.equal(result.allowed, false);
      assert.equal(result.statusCode, 403);
      assert.match(result.reason!, /своей строительной компании/);
    });

    test("Unknown developer user without company mapping gets 0 objects and cannot publish", async () => {
      const result = await checkObjectOwnership({
        objectId: "proj_qayroqum",
        objectType: "project",
        actorRole: "developer",
        actorId: "usr_unknown_dev_account",
      });

      assert.equal(result.allowed, false);
      assert.equal(result.statusCode, 403);
      assert.match(result.reason!, /не привязан ни к одной компании-застройщику/);

      const items = await getOwnedPublishableObjects("developer", "usr_unknown_dev_account");
      assert.equal(items.length, 0, "Unknown developer must have 0 objects");
    });

    test("Realtor cannot prepare a developer project via API (403 Forbidden)", async () => {
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
  });

  describe("3. Channel & Photo Anti-Spoofing (Remark 3)", () => {
    test("Rejects publication if client attempts to spoof channelUsername different from verified channel", async () => {
      // Ensure realtor has linked channel
      await saveLinkedChannel({
        userId: "usr_realtor_01",
        channelUsername: "@khujand_realty_official",
        channelTitle: "Официальный канал",
        verifiedAt: new Date().toISOString(),
      });

      const req = new NextRequest("http://localhost:3000/api/publications/telegram/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          objectId: "16766211",
          objectType: "classified",
          photoUrl: "https://cdntj.somon.tj/media/cache1/0c/06/0c0649a1e353ebed09d618483c815ea4.webp",
          editableBody: "Уютная 2-комнатная квартира",
          locale: "ru",
          channelUsername: "@malicious_victim_channel", // Spoofed channel!
          demoRole: "realtor",
        }),
      });

      const res = await publishRoute(req);
      assert.equal(res.status, 403);
      const data = await res.json();
      assert.equal(data.error, "channel_mismatch");
      assert.match(data.message, /Подмена канала запрещена/);
    });

    test("Rejects publication if photoUrl does not belong to the selected object", async () => {
      await saveLinkedChannel({
        userId: "usr_realtor_01",
        channelUsername: "@khujand_realty_official",
        channelTitle: "Официальный канал",
        verifiedAt: new Date().toISOString(),
      });

      const req = new NextRequest("http://localhost:3000/api/publications/telegram/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          objectId: "16766211",
          objectType: "classified",
          photoUrl: "https://malicious.com/unauthorized_external_image.jpg", // Unrelated photo!
          editableBody: "Уютная 2-комнатная квартира",
          locale: "ru",
          demoRole: "realtor",
        }),
      });

      const res = await publishRoute(req);
      assert.equal(res.status, 400);
      const data = await res.json();
      assert.equal(data.error, "unauthorized_photo");
      assert.match(data.message, /не принадлежит выбранному объекту/);
    });

    test("Accepts publication when photo belongs to the verified object photos", async () => {
      await saveLinkedChannel({
        userId: "usr_realtor_01",
        channelUsername: "@khujand_realty_official",
        channelTitle: "Официальный канал",
        verifiedAt: new Date().toISOString(),
      });

      const req = new NextRequest("http://localhost:3000/api/publications/telegram/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          objectId: "16766211",
          objectType: "classified",
          photoUrl: "https://cdntj.somon.tj/media/cache1/0c/06/0c0649a1e353ebed09d618483c815ea4.webp",
          editableBody: "Уютная 2-комнатная квартира в 8 микрорайоне.",
          locale: "ru",
          demoRole: "realtor",
        }),
      });

      const res = await publishRoute(req);
      assert.equal(res.status, 200);
      const data = await res.json();
      assert.equal(data.success, true);
    });
  });

  describe("4. In-Flight Lock & Network Timeout / Uncertain State (Remark 4)", () => {
    test("Prevents parallel in-flight race condition for simultaneous requests", async () => {
      const lockParams = {
        userId: "test_concurrency_user",
        objectId: "16766211",
        channelUsername: "@concurrency_channel",
        userRole: "realtor",
        objectType: "classified" as const,
        photoUrl: "https://example.com/photo.jpg",
        captionSnippet: "Test",
      };

      // 1st request acquires lock
      const lock1 = await acquirePublicationLock(lockParams);
      assert.equal(lock1.acquired, true);

      // 2nd simultaneous request MUST be rejected
      const lock2 = await acquirePublicationLock(lockParams);
      assert.equal(lock2.acquired, false);
      assert.match(lock2.reason!, /уже выполняется/);

      // Clean up lock
      await finalizePublicationLock(lock1.lockId!, { status: "failed" });
    });

    test("Blocks retry after uncertain network timeout to protect against duplicate posts", async () => {
      const lockParams = {
        userId: "test_timeout_user",
        objectId: "16766211",
        channelUsername: "@timeout_channel",
        userRole: "realtor",
        objectType: "classified" as const,
        photoUrl: "https://example.com/photo.jpg",
        captionSnippet: "Test Timeout",
      };

      const lock = await acquirePublicationLock(lockParams);
      assert.equal(lock.acquired, true);

      // Simulate network timeout -> status uncertain
      await finalizePublicationLock(lock.lockId!, {
        status: "uncertain",
        error: "Network timeout while awaiting Telegram response",
      });

      // Subsequent attempt must be blocked with uncertain notice
      const retryLock = await acquirePublicationLock(lockParams);
      assert.equal(retryLock.acquired, false);
      assert.match(retryLock.reason!, /неопределён из-за таймаута сети/);
    });
  });

  describe("5. Text Integrity & Dynamic Counter (Remarks 5 & 6)", () => {
    test("Preserves full project description without silent truncation", () => {
      const parts = buildProjectPublicationParts(sampleProject, sampleDev, "ru");
      assert.ok(parts.editableBody.toLowerCase().includes("флагманский жилой комплекс"));
      assert.ok(parts.editableBody.includes("Qayroqum Avenue"));
    });

    test("Dynamic counter correctly computes max allowed body characters", () => {
      const contacts = "Контакты: +992 92 771 2233";
      const cta = "Все фотографии и подробности объекта — на Maskani.tj";
      const counts = calculateTelegramCharCount("Short title", contacts, cta);

      assert.ok(counts.maxAllowedBodyChars > 0);
      assert.equal(counts.maxAllowedBodyChars + counts.reservedChars, 1024);
    });
  });

  describe("6. Host Header Poisoning Protection (Remark 8)", () => {
    test("CTA canonical link uses trusted environment origin regardless of incoming Host header", async () => {
      const req = new NextRequest("http://localhost:3000/api/publications/prepare", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Host": "attacker-controlled-phishing.com", // Malicious host header!
          "X-Forwarded-Host": "attacker-controlled-phishing.com",
        },
        body: JSON.stringify({
          objectId: "16766211",
          objectType: "classified",
          locale: "ru",
          demoRole: "realtor",
        }),
      });

      const res = await prepareRoute(req);
      assert.equal(res.status, 200);
      const data = await res.json();

      // Canonical link must NOT contain attacker's domain!
      assert.ok(
        !data.material.canonicalUrl.includes("attacker-controlled-phishing.com"),
        "Canonical URL must not be poisoned by Host header"
      );
      assert.match(data.material.canonicalUrl, /^https:\/\/maskani\.tj/);
    });
  });
});
