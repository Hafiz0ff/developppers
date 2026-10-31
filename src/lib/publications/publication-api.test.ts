import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { NextRequest } from "next/server";
import { GET as getObjects } from "@/app/api/publications/objects/route";
import { POST as prepareMaterial } from "@/app/api/publications/prepare/route";
import { GET as downloadPhotos } from "@/app/api/publications/download-photos/route";

describe("MASKANI.TJ — Publications API Integration Tests (Specification v2.0)", () => {
  test("GET /api/publications/objects rejects unauthenticated guests with 401 Unauthorized or 403 Forbidden", async () => {
    // When demo mode is not enabled
    process.env.ALLOW_PUBLICATIONS_DEMO = "false";
    (process.env as Record<string, string | undefined>).NODE_ENV = "production";

    const req = new NextRequest("http://localhost:3000/api/publications/objects");
    const res = await getObjects(req);
    assert.ok(res.status === 401 || res.status === 403);
    const body = await res.json();
    assert.equal(body.success, false);

    // Restore test env
    (process.env as Record<string, string | undefined>).NODE_ENV = "test";
    process.env.ALLOW_PUBLICATIONS_DEMO = "true";
  });

  test("GET /api/publications/objects returns owned active listings for realtor demo role", async () => {
    const req = new NextRequest("http://localhost:3000/api/publications/objects?demoRole=realtor");
    const res = await getObjects(req);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.equal(body.role, "realtor");
    assert.ok(Array.isArray(body.items));
    assert.ok(body.count > 0);
    assert.equal(body.items[0].type, "classified");
  });

  test("GET /api/publications/objects returns owned projects for developer role", async () => {
    const req = new NextRequest("http://localhost:3000/api/publications/objects?demoRole=developer");
    const res = await getObjects(req);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.equal(body.role, "developer");
    assert.ok(Array.isArray(body.items));
    assert.ok(body.count > 0);
    assert.equal(body.items[0].type, "project");
  });

  test("POST /api/publications/prepare generates structured post with mandatory CTA for listing", async () => {
    const req = new NextRequest("http://localhost:3000/api/publications/prepare", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        objectId: "16766211",
        objectType: "classified",
        locale: "ru",
        demoRole: "realtor",
      }),
    });
    const res = await prepareMaterial(req);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.ok(body.material.editableBody.length > 20);
    assert.ok(body.material.mandatoryCtaHtml.includes("Все фотографии и подробности объекта — на Maskani.tj"));
    assert.match(body.material.canonicalUrl, /kupit/);
  });

  test("POST /api/publications/prepare generates structured post with developer CTA for project", async () => {
    const req = new NextRequest("http://localhost:3000/api/publications/prepare", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        objectId: "proj_qayroqum",
        objectType: "project",
        locale: "ru",
        demoRole: "developer",
      }),
    });
    const res = await prepareMaterial(req);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.ok(body.material.editableBody.includes("Кайраккум"));
    assert.ok(body.material.mandatoryCtaHtml.includes("Выбирайте квартиру, изучайте планировки и условия покупки на Maskani.tj"));
    assert.ok(body.material.canonicalUrl.includes("/projects/qayroqum-avenue"));
  });

  test("POST /api/publications/prepare validates missing translation with 400 no_translation", async () => {
    const req = new NextRequest("http://localhost:3000/api/publications/prepare", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        objectId: "16766211",
        objectType: "classified",
        locale: "en", // English translation not in mock catalog
        demoRole: "realtor",
      }),
    });
    const res = await prepareMaterial(req);
    assert.equal(res.status, 400);
    const body = await res.json();
    assert.equal(body.success, false);
    assert.equal(body.error, "no_translation");
  });

  test("GET /api/publications/download-photos returns 410 Gone per TZ v2.0 Section 7 & 16", async () => {
    const req = new NextRequest("http://localhost:3000/api/publications/download-photos?objectId=17034738");
    const res = await downloadPhotos();
    assert.equal(res.status, 410);
    const data = await res.json();
    assert.equal(data.error, "deprecated_endpoint");
  });
});
