import assert from "node:assert/strict";
import { test } from "node:test";
import { NextRequest } from "next/server";
import { hasPermission, canModifyEntity } from "@/lib/auth/rbac";
import { validateAttributeValues } from "@/lib/classifieds/attributes";
import { GET as getAttributesRoute, PATCH as patchAttributesRoute } from "@/app/api/super-admin/listing-attributes/route";
import { getRecentAuditLogs } from "@/lib/audit-logger";

test("API Authorization: Roles check conforms to Stage 2 specification", () => {
  // 1. C2C User, Realtor, Agency, and Agent are allowed to create classifieds
  assert.equal(hasPermission("user", "classified:create"), true);
  assert.equal(hasPermission("realtor", "classified:create"), true);
  assert.equal(hasPermission("agency", "classified:create"), true);
  assert.equal(hasPermission("agency_agent", "classified:create"), true);
  assert.equal(hasPermission("admin", "classified:create"), true);
  assert.equal(hasPermission("super_admin", "classified:create"), true);

  // 2. Developer is restricted from C2C classifieds and uses projects/units primary market
  assert.equal(hasPermission("developer", "classified:create"), false);
  assert.equal(hasPermission("developer", "project:create"), true);
});

test("API Validation: Server rejects unauthorized or invalid attribute payloads", () => {
  // 1. Rental ad attempting to smuggle minor_owners legal attribute
  const rentWithLegal = validateAttributeValues("rent_long", "apartment", {
    wifi: true,
    minor_owners: true,
  });
  assert.equal(rentWithLegal.valid, false);
  assert.ok(rentWithLegal.errors.minor_owners);

  // 2. Commercial attributes attempted in residential ad
  const resWithComm = validateAttributeValues("sale", "apartment", {
    fire_extinguishing: true,
  });
  assert.equal(resWithComm.valid, false);
  assert.ok(resWithComm.errors.fire_extinguishing);

  // 3. Out-of-bounds numerical values
  const outOfBounds = validateAttributeValues("sale", "apartment", {
    floor: 150, // Max 100
    built_year: 1400, // Min 1800
  });
  assert.equal(outOfBounds.valid, false);
  assert.ok(outOfBounds.errors.floor);
  assert.ok(outOfBounds.errors.built_year);

  // 4. Valid attributes payload
  const valid = validateAttributeValues("sale", "apartment", {
    wifi: true,
    heating: true,
    floor: 5,
    floors_count: 12,
    built_year: 2020,
    renovation_type: "euro",
    minor_owners: false,
  });
  assert.equal(valid.valid, true);
  assert.equal(valid.sanitizedValues.wifi, true);
  assert.equal(valid.sanitizedValues.floor, 5);
  assert.equal(valid.sanitizedValues.renovation_type, "euro");
});

test("API Ownership & IDOR Protection: Users can only mutate their own records", () => {
  const actor1 = { id: "user_1", role: "user" as const };
  const actor2 = { id: "user_2", role: "user" as const };
  const agencyManager = { id: "agency_owner", role: "agency" as const, agencyId: "agency_alpha" };
  const agencyListing = { userId: "agent_9", agencyId: "agency_alpha" };
  const strangerListing = { userId: "user_1", agencyId: "agency_beta" };
  const superAdmin = { id: "super_1", role: "super_admin" as const };

  // Actor1 owns entity -> allowed
  assert.equal(canModifyEntity(actor1, { userId: "user_1" }), true);

  // Actor2 cannot touch Actor1 entity -> blocked (IDOR protection)
  assert.equal(canModifyEntity(actor2, { userId: "user_1" }), false);

  // Agency manager can manage listings within their agency
  assert.equal(canModifyEntity(agencyManager, agencyListing), true);
  assert.equal(canModifyEntity(agencyManager, strangerListing), false);

  // Super-admin has universal master access
  assert.equal(canModifyEntity(superAdmin, { userId: "user_1" }), true);
});

test("Super-Admin API: GET and PATCH listing attributes with audit logging", async () => {
  // 1. Unauthorized GET request is rejected with 403
  const unauthorizedReq = new NextRequest("http://localhost:3000/api/super-admin/listing-attributes", {
    headers: { "x-test-role": "user" },
  });
  const unauthRes = await getAttributesRoute(unauthorizedReq);
  assert.equal(unauthRes.status, 403);

  // 2. Super-admin GET request succeeds and returns dictionary
  const adminReq = new NextRequest("http://localhost:3000/api/super-admin/listing-attributes", {
    headers: { "x-test-role": "super_admin" },
  });
  const adminRes = await getAttributesRoute(adminReq);
  assert.equal(adminRes.status, 200);
  const data = await adminRes.json();
  assert.equal(data.success, true);
  assert.ok(data.sections.length >= 7);
  assert.ok(data.attributes.length >= 45);

  // 3. Super-admin archives an attribute
  const patchReq = new NextRequest("http://localhost:3000/api/super-admin/listing-attributes", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "x-test-role": "super_admin",
    },
    body: JSON.stringify({
      code: "waste_chute",
      action: "archive",
      reason: "Deprecated feature for modern buildings",
    }),
  });
  const patchRes = await patchAttributesRoute(patchReq);
  assert.equal(patchRes.status, 200);
  const patchData = await patchRes.json();
  assert.equal(patchData.success, true);
  assert.equal(patchData.attribute.active, false);

  // 4. Verify audit log entry was generated
  const auditLogs = getRecentAuditLogs(5);
  const latestAudit = auditLogs.find(
    (log) => log.entityType === "listing_attribute" && log.entityId === "waste_chute"
  );
  assert.ok(latestAudit, "Must record audit log for listing_attribute change");
  assert.equal(latestAudit.action, "toggle_feature_flag");
  assert.equal(latestAudit.details?.action, "archive");

  // 5. Restore attribute back
  const restoreReq = new NextRequest("http://localhost:3000/api/super-admin/listing-attributes", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "x-test-role": "super_admin",
    },
    body: JSON.stringify({
      code: "waste_chute",
      action: "restore",
      reason: "Restored by test suite",
    }),
  });
  const restoreRes = await patchAttributesRoute(restoreReq);
  assert.equal(restoreRes.status, 200);
  const restoreData = await restoreRes.json();
  assert.equal(restoreData.attribute.active, true);
});
