import assert from "node:assert/strict";
import { test } from "node:test";
import { setOtp, verifyOtp } from "./otp";

test("accepts a valid code and rejects expired ones", () => {
  const now = 1_700_000_000_000;
  setOtp("+992900000001", "123456", now + 60_000);
  assert.equal(verifyOtp("+992900000001", "123456", now), true);
  assert.equal(verifyOtp("+992900000001", "000000", now), false);
  setOtp("+992900000002", "654321", now - 1);
  assert.equal(verifyOtp("+992900000002", "654321", now), false);
});
