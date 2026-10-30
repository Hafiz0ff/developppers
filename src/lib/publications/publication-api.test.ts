import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { NextRequest } from "next/server";
import { GET as getObjects } from "@/app/api/publications/objects/route";
import { POST as prepareMaterial } from "@/app/api/publications/prepare/route";
import { GET as downloadPhotos } from "@/app/api/publications/download-photos/route";

describe("MASKANI.TJ — Publications API Integration Tests (Specification v1.1 Stage 3 & 5)", () => {
  test("GET /api/publications/objects rejects unauthenticated guests with 403 Forbidden", async () => {
    const req = new NextRequest("http://localhost:3000/api/publications/objects");
    const res = await getObjects(req);
    assert.equal(res.status, 403);
    const body = await res.json();
    assert.equal(body.success, false);
    assert.equal(body.error, "forbidden");
  });

  test("GET /api/publications/objects returns active listings for realtor demo role", async () => {
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

  test("GET /api/publications/objects returns projects for developer role", async () => {
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

  test("POST /api/publications/prepare generates complete post for listing", async () => {
    const req = new NextRequest("http://localhost:3000/api/publications/prepare", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        objectId: "17034738",
        objectType: "classified",
        locale: "ru",
        demoRole: "realtor",
      }),
    });
    const res = await prepareMaterial(req);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.ok(body.material.text.length > 50);
    assert.match(body.material.canonicalUrl, /kupit/);
  });

  test("POST /api/publications/prepare generates complete post for project", async () => {
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
    assert.ok(body.material.text.includes("Кайраккум"));
    assert.ok(body.material.canonicalUrl.includes("/projects/qayroqum-avenue"));
  });

  test("POST /api/publications/prepare validates missing translation with 400 no_translation", async () => {
    const req = new NextRequest("http://localhost:3000/api/publications/prepare", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        objectId: "17034738",
        objectType: "classified",
        locale: "en", // English translation is not present in mock catalog
        demoRole: "realtor",
      }),
    });
    const res = await prepareMaterial(req);
    assert.equal(res.status, 400);
    const body = await res.json();
    assert.equal(body.success, false);
    assert.equal(body.error, "no_translation");
  });

  test("GET /api/publications/download-photos returns 403 Forbidden for unauthenticated guest", async () => {
    const req = new NextRequest("http://localhost:3000/api/publications/download-photos?objectId=17034738");
    const res = await downloadPhotos(req);
    assert.equal(res.status, 403);
  });

  test("GET /api/publications/download-photos returns ZIP stream for valid object", async () => {
    const req = new NextRequest("http://localhost:3000/api/publications/download-photos?objectId=17034738&demoRole=realtor");
    const res = await downloadPhotos(req);
    assert.equal(res.status, 200);
    assert.equal(res.headers.get("Content-Type"), "application/zip");
    assert.ok(res.headers.get("Content-Disposition")?.includes("maskani-17034738-photos.zip"));
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    assert.ok(buffer.length > 50);
    // PK zip signature
    assert.equal(buffer.readUInt32LE(0), 0x04034b50);
  });
});
