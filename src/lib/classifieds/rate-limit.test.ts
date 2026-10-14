import assert from "node:assert/strict";
import { test } from "node:test";
import { canCreateAnotherAd } from "./rate-limit";

test("caps three ads in a 24h window", () => {
  const now = new Date("2026-10-14T00:00:00Z");
  const two = [new Date("2026-10-13T12:00:00Z"), new Date("2026-10-13T18:00:00Z")];
  const three = [...two, new Date("2026-10-13T20:00:00Z")];
  assert.equal(canCreateAnotherAd(two, now), true);
  assert.equal(canCreateAnotherAd(three, now), false);
});
