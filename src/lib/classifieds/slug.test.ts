import assert from "node:assert/strict";
import { test } from "node:test";
import { makeClassifiedSlug } from "./slug";

test("builds unique url-safe slug", () => {
  const slug = makeClassifiedSlug("3-комнатная квартира, 18 мкр!", "id_abc123xyz");
  assert.match(slug, /18-mkr|komnatnaya|kvartira/i);
  assert.ok(slug.endsWith("abc123xyz") || slug.includes("abc123"));
  assert.equal(slug.includes(" "), false);
});
