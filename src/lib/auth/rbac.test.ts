import { test } from "node:test";
import assert from "node:assert/strict";
import {
  hasPermission,
  assertPermission,
  canModifyEntity,
  ForbiddenError,
  UserRole,
} from "./rbac";

test("RBAC: All 7 roles are defined and obey permission boundaries", () => {
  const roles: UserRole[] = [
    "user",
    "realtor",
    "developer",
    "agency",
    "agency_agent",
    "admin",
    "super_admin",
  ];

  // Super admin has every permission
  for (const r of roles) {
    if (r === "super_admin") {
      assert.equal(hasPermission(r, "system:super_admin_access"), true);
      assert.equal(hasPermission(r, "project:delete"), true);
      assert.equal(hasPermission(r, "classified:delete_any"), true);
    }
  }

  // Regular user cannot delete other's classifieds or access super admin
  assert.equal(hasPermission("user", "classified:delete_any"), false);
  assert.equal(hasPermission("user", "system:super_admin_access"), false);
  assert.equal(hasPermission("user", "project:create"), false);

  // Developer can manage chessboard, parking and storage, but cannot moderate ads
  assert.equal(hasPermission("developer", "project:manage_chess"), true);
  assert.equal(hasPermission("developer", "project:manage_parking"), true);
  assert.equal(hasPermission("developer", "classified:moderate"), false);

  // Agency can manage agents and assign leads, but cannot manage projects
  assert.equal(hasPermission("agency", "agency:manage_agents"), true);
  assert.equal(hasPermission("agency", "agency:assign_leads"), true);
  assert.equal(hasPermission("agency", "project:create"), false);

  // Admin can moderate classifieds and projects, but cannot access super_admin system operations
  assert.equal(hasPermission("admin", "classified:moderate"), true);
  assert.equal(hasPermission("admin", "project:update_any"), true);
  assert.equal(hasPermission("admin", "system:super_admin_access"), false);
});

test("RBAC: assertPermission throws ForbiddenError on violation", () => {
  assert.throws(
    () => {
      assertPermission("user", "system:manage_feature_flags");
    },
    (err: unknown) => {
      assert.ok(err instanceof ForbiddenError);
      assert.equal((err as ForbiddenError).status, 403);
      return true;
    }
  );

  // Super admin never throws
  assert.doesNotThrow(() => {
    assertPermission("super_admin", "system:manage_feature_flags");
  });
});

test("RBAC: canModifyEntity enforces strict ownership protection", () => {
  const userA = { id: "user_1", role: "user" as UserRole };
  const userB = { id: "user_2", role: "user" as UserRole };

  // User A cannot modify entity owned by User B
  assert.equal(canModifyEntity(userA, { userId: "user_2" }), false);
  assert.equal(canModifyEntity(userA, { userId: "user_1" }), true);

  // Developer can modify their own complex
  const dev = { id: "dev_1", role: "developer" as UserRole, developerId: "sugdiyona" };
  assert.equal(canModifyEntity(dev, { developerId: "sugdiyona" }), true);
  assert.equal(canModifyEntity(dev, { developerId: "somon_sokhtmon" }), false);

  // Super admin can modify anything
  const superAdmin = { id: "sa_1", role: "super_admin" as UserRole };
  assert.equal(canModifyEntity(superAdmin, { userId: "user_999" }), true);
  assert.equal(canModifyEntity(superAdmin, { developerId: "any_developer" }), true);
});
