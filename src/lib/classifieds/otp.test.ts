import assert from "node:assert/strict";
import { test } from "node:test";
import { NextRequest } from "next/server";
import { issueOtp, setOtp, verifyOtp } from "./otp";
import { POST as authOtpPost } from "@/app/api/auth/otp/route";

test("accepts a valid code and rejects expired ones", () => {
  const now = 1_700_000_000_000;
  setOtp("+992900000001", "123456", now + 60_000);
  assert.equal(verifyOtp("+992900000001", "123456", now), true);
  assert.equal(verifyOtp("+992900000001", "000000", now), false);
  setOtp("+992900000002", "654321", now - 1);
  assert.equal(verifyOtp("+992900000002", "654321", now), false);
});

test("issueOtp generates 4-digit codes by default for OTP V7 and supports 6-digit codes", () => {
  const code4 = issueOtp("+992927000001", Date.now(), 4);
  assert.equal(code4.length, 4);
  assert.match(code4, /^\d{4}$/);
  assert.equal(verifyOtp("+992927000001", code4), true);

  const code6 = issueOtp("+992927000002", Date.now(), 6);
  assert.equal(code6.length, 6);
  assert.match(code6, /^\d{6}$/);
  assert.equal(verifyOtp("+992927000002", code6), true);
});

test("POST /api/auth/otp issues 4-digit code, verifies valid code, and rejects 0000", async () => {
  const sendReq = new NextRequest("http://localhost:3000/api/auth/otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "send", phone: "+992 92 700 1122" }),
  });
  const sendRes = await authOtpPost(sendReq);
  assert.equal(sendRes.status, 200);
  const sendBody = await sendRes.json();
  assert.equal(sendBody.success, true);
  assert.equal(String(sendBody.demoCode).length, 4);

  // Rejects explicit invalid test code 0000
  const badReq = new NextRequest("http://localhost:3000/api/auth/otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "verify", phone: "+992 92 700 1122", code: "0000" }),
  });
  const badRes = await authOtpPost(badReq);
  assert.equal(badRes.status, 400);

  // Accepts issued 4-digit code
  const okReq = new NextRequest("http://localhost:3000/api/auth/otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "verify",
      phone: "+992 92 700 1122",
      code: sendBody.demoCode,
    }),
  });
  const okRes = await authOtpPost(okReq);
  assert.equal(okRes.status, 200);
  const okBody = await okRes.json();
  assert.equal(okBody.success, true);
  assert.equal(okBody.phoneVerified, true);
});
