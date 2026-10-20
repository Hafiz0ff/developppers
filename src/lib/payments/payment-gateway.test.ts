import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  createPaymentOrder,
  verifyPaymentOtp,
  confirmPayment,
  getPaymentTransaction,
  listPaymentTransactions,
  getFintechAnalytics,
  formatPaymentPrice,
  PAYMENT_PROVIDERS,
  VAS_SERVICES,
  AD_PACKAGES,
} from "./payment-gateway";
import { getAllAdvertisers } from "@/lib/ads/ad-engine";

describe("Tajikistan National Payment Gateway & FinTech Engine", () => {
  test("creates Korti Milli payment order with 3D Secure challenge", () => {
    const tx = createPaymentOrder({
      purpose: "classified_top",
      amountTjs: 10,
      provider: "korti_milli",
      payerPhone: "+992 92 700 1122",
      payerName: "Джамшед Умаров",
    });

    assert.ok(tx.id.startsWith("pay_kor_"));
    assert.equal(tx.amountTjs, 10);
    assert.equal(tx.currency, "TJS");
    assert.equal(tx.provider, "korti_milli");
    assert.equal(tx.method, "card");
    assert.equal(tx.status, "processing"); // card requires 3D Secure OTP
    assert.equal(tx.otpCode, "1234");
    assert.ok(tx.descriptionRu.includes("ТОП"));
  });

  test("creates Dushanbe City (DC) QR payment order", () => {
    const tx = createPaymentOrder({
      purpose: "ad_balance",
      amountTjs: 1500,
      provider: "dushanbe_city",
      method: "qr",
      payerPhone: "+992 90 123 4567",
      payerName: "ЗАО Согд Трейдинг",
    });

    assert.equal(tx.provider, "dushanbe_city");
    assert.equal(tx.method, "qr");
    assert.equal(tx.status, "pending");
    assert.ok(tx.qrCodeData?.includes("dcpay://qr?merchant=maskani_tj"));
    assert.ok(tx.qrCodeData?.includes("amount=1500"));
  });

  test("creates Alif Salom 0% installment payment order", () => {
    const tx = createPaymentOrder({
      purpose: "ad_balance",
      amountTjs: 5000,
      provider: "alif_mobi",
      method: "installment_salom",
      payerPhone: "+992 92 999 0011",
      installmentMonths: 6,
    });

    assert.equal(tx.provider, "alif_mobi");
    assert.equal(tx.method, "installment_salom");
    assert.equal(tx.installmentMonths, 6);
  });

  test("verifies Korti Milli 3D Secure SMS OTP and marks payment completed", () => {
    const tx = createPaymentOrder({
      purpose: "classified_highlight",
      amountTjs: 15,
      provider: "korti_milli",
      payerPhone: "+992 92 111 2233",
    });

    // Invalid OTP
    const failedRes = verifyPaymentOtp(tx.id, "9999");
    assert.equal(failedRes.success, false);
    assert.ok(failedRes.error?.includes("Неверный"));

    // Valid OTP
    const successRes = verifyPaymentOtp(tx.id, "1234");
    assert.equal(successRes.success, true);
    assert.equal(successRes.transaction?.status, "completed");
    assert.ok(successRes.transaction?.completedAt);
  });

  test("completes advertiser balance top-up and reflects in ad engine store", () => {
    const eskhataAdv = getAllAdvertisers().find((a) => a.id === "adv-eskhata");
    assert.ok(eskhataAdv);
    const initialBalance = eskhataAdv.balanceTjs;

    const tx = createPaymentOrder({
      purpose: "ad_balance",
      amountTjs: 2000,
      provider: "eskhata_online",
      advertiserId: "adv-eskhata",
      payerPhone: "+992 (44) 600-0-600",
    });

    confirmPayment(tx.id, "ESK-TEST-9988");

    const updatedAdv = getAllAdvertisers().find((a) => a.id === "adv-eskhata");
    assert.equal(updatedAdv?.balanceTjs, initialBalance + 2000);
  });

  test("calculates FinTech analytics for Super Admin executive overview", () => {
    const analytics = getFintechAnalytics();

    assert.ok(analytics.totalProcessedTjs > 100000, "Should include seeded contracts");
    assert.ok(analytics.completedTransactionsCount >= 5);
    assert.ok(analytics.byProvider.korti_milli.count >= 1);
    assert.ok(analytics.byProvider.dushanbe_city.count >= 1);
    assert.ok(analytics.byProvider.alif_mobi.count >= 1);
    assert.ok(analytics.byProvider.eskhata_online.count >= 1);
  });

  test("formats prices with Tajik somoni and USD conversion", () => {
    const p1 = formatPaymentPrice(1090);
    assert.equal(p1.tjs, 1090);
    assert.equal(p1.usd, 100);
    assert.ok(p1.formattedTjs.includes("сомони"));
    assert.ok(p1.formattedUsd.includes("$100"));
  });

  test("verifies VAS services catalog covers all promotional formats with exact pricing", () => {
    assert.ok(VAS_SERVICES.classified_top);
    assert.ok(VAS_SERVICES.classified_highlight);
    assert.ok(VAS_SERVICES.classified_urgent);
    assert.ok(VAS_SERVICES.classified_turbo);

    assert.equal(VAS_SERVICES.classified_top.priceTjs, 10);
    assert.equal(VAS_SERVICES.classified_highlight.priceTjs, 8);
    assert.equal(VAS_SERVICES.classified_urgent.priceTjs, 7);
    assert.equal(VAS_SERVICES.classified_turbo.priceTjs, 20);
  });
});
