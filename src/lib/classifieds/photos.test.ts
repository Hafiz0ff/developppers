import assert from "node:assert/strict";
import { test } from "node:test";
import { assertClassifiedPhoto, buildPhotoObjectPath } from "./photos";

test("rejects empty, huge, and non-image files", () => {
  assert.throws(() => assertClassifiedPhoto({ size: 0, type: "image/jpeg", name: "a.jpg" }));
  assert.throws(() =>
    assertClassifiedPhoto({ size: 11 * 1024 * 1024, type: "image/jpeg", name: "a.jpg" })
  );
  assert.throws(() =>
    assertClassifiedPhoto({ size: 1000, type: "application/pdf", name: "a.pdf" })
  );
});

test("accepts jpeg under 10MB", () => {
  assert.doesNotThrow(() =>
    assertClassifiedPhoto({ size: 500_000, type: "image/jpeg", name: "p.jpg" })
  );
});

test("builds storage object path", () => {
  assert.equal(buildPhotoObjectPath("u1", "draft-1", 0, "jpg"), "u1/draft-1/0.jpg");
});
