import assert from "node:assert/strict";
import { test } from "node:test";
import {
  canPostClassified,
  canMutateClassified,
  canModerateClassifieds,
  initialClassifiedStatus,
  canOwnerSetStatus,
} from "./access";

test("only role user can post", () => {
  assert.equal(canPostClassified("user"), true);
  assert.equal(canPostClassified("realtor"), false);
  assert.equal(canPostClassified("developer"), false);
  assert.equal(canPostClassified("admin"), false);
  assert.equal(canPostClassified(undefined), false);
});

test("owner can mutate, stranger cannot", () => {
  assert.equal(canMutateClassified({ actorId: "u1", actorRole: "user", ownerId: "u1" }), true);
  assert.equal(canMutateClassified({ actorId: "u2", actorRole: "user", ownerId: "u1" }), false);
  assert.equal(canMutateClassified({ actorId: "a1", actorRole: "admin", ownerId: "u1" }), false);
});

test("only admin can moderate", () => {
  assert.equal(canModerateClassifieds("admin"), true);
  assert.equal(canModerateClassifieds("user"), false);
});

test("slice 1 auto-approves, slice 2 stays pending", () => {
  assert.equal(initialClassifiedStatus({ autoApprove: true }), "active");
  assert.equal(initialClassifiedStatus({ autoApprove: false }), "pending");
});

test("owner may archive or mark sold only", () => {
  assert.equal(canOwnerSetStatus("archived"), true);
  assert.equal(canOwnerSetStatus("sold"), true);
  assert.equal(canOwnerSetStatus("active"), false);
  assert.equal(canOwnerSetStatus("pending"), false);
});
