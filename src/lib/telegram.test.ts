import test from "node:test";
import assert from "node:assert/strict";
import {
  formatPaymentSuccessHtmlMessage,
  formatBookingHtmlMessage,
  formatSponsorshipHtmlMessage,
  formatLowBalanceHtmlMessage,
  notifyTelegramPaymentSuccess,
  notifyTelegramBookingRequest,
  notifyTelegramSponsorshipLead,
  notifyTelegramLowBalance,
  escapeHtml,
} from "./telegram";

test("Telegram Notification Suite - HTML Escaping & Sanitization", () => {
  const dirty = '<script>alert("hack")</script> & "cool"';
  const clean = escapeHtml(dirty);
  assert.ok(!clean.includes("<script>"));
  assert.ok(clean.includes("&lt;script&gt;"));
  assert.ok(clean.includes("&amp;"));
});

test("Telegram Notification Suite - Payment Success Message Formatting", () => {
  const msg = formatPaymentSuccessHtmlMessage({
    transactionId: "pay_kor_987654321",
    purpose: "classified_top",
    amountTjs: 10,
    amountUsd: 1,
    providerName: "Корти Милли (НПЦ РТ)",
    payerName: "Алишер Рахимов",
    payerPhone: "+992 92 771 2233",
    targetTitle: "1-комн. квартира, 44 м², Шёлкокомбинат",
    completedAt: "2026-10-21T10:00:00Z",
  });

  assert.ok(msg.includes("ОПЛАТА ПОЛУЧЕНА • MASKANI.TJ"));
  assert.ok(msg.includes("10 сомони"));
  assert.ok(msg.includes("👑 Поднятие в ТОП на 7 дней"));
  assert.ok(msg.includes("Корти Милли"));
  assert.ok(msg.includes("Алишер Рахимов"));
  assert.ok(msg.includes("+992 92 771 2233"));
  assert.ok(msg.includes("pay_kor_987654321"));
});

test("Telegram Notification Suite - Apartment & Unit Booking Message Formatting", () => {
  const rawMsg = formatBookingHtmlMessage({
    projectName: "Qayroqum Avenue",
    unitNumber: 42,
    parkingNumber: 12,
    storageNumber: 5,
    totalPriceTjs: 495000,
    depositTjs: 1000,
    clientPhone: "+992 92 888 7766",
    clientName: "Рустам Саидов",
    contactMode: "instant_15min",
  });
  const msg = rawMsg.replace(/\u00A0/g, " ");

  assert.ok(msg.includes("НОВАЯ БРОНЬ В НОВОСТРОЙКЕ • MASKANI.TJ"));
  assert.ok(msg.includes("Qayroqum Avenue"));
  assert.ok(msg.includes("Квартира №42"));
  assert.ok(msg.includes("Машино-место №12"));
  assert.ok(msg.includes("Кладовая №5"));
  assert.ok(msg.includes("495 000 сомони"));
  assert.ok(msg.includes("1 000 сомони"));
  assert.ok(msg.includes("+992 92 888 7766"));
  assert.ok(msg.includes("Связаться в течение 15 минут"));
});

test("Telegram Notification Suite - Corporate B2B Sponsorship Lead Formatting", () => {
  const rawMsg = formatSponsorshipHtmlMessage({
    companyName: 'ОАО «Банк Эсхата»',
    brandName: "Банк Эсхата",
    contactPerson: "Мавзуна Рахимова",
    phone: "+992 44 600 0600",
    email: "marketing@eskhata.tj",
    packageType: "annual_sponsor",
    estimatedBudgetTjs: 120000,
    notes: "Генеральное спонсорство разделов ипотеки в Согде на 2026-2027 год.",
  });
  const msg = rawMsg.replace(/\u00A0/g, " ");

  assert.ok(msg.includes("B2B ЗАЯВКА НА СПОНСОРСТВО • MASKANI.TJ"));
  assert.ok(msg.includes("Банк Эсхата"));
  assert.ok(msg.includes("Мавзуна Рахимова"));
  assert.ok(msg.includes("+992 44 600 0600"));
  assert.ok(msg.includes("marketing@eskhata.tj"));
  assert.ok(msg.includes("Генеральный спонсор"));
  assert.ok(msg.includes("120 000 сомони"));
});

test("Telegram Notification Suite - Low Balance Warning Alert Formatting", () => {
  const msg = formatLowBalanceHtmlMessage({
    companyName: "Artel Таджикистан",
    advertiserId: "adv-artel",
    remainingBalanceTjs: 45,
    campaignName: "Бытовая техника новосёлам",
    contactPhone: "+992 92 999 1111",
  });

  assert.ok(msg.includes("НИЗКИЙ БАЛАНС РЕКЛАМОДАТЕЛЯ • MASKANI.TJ"));
  assert.ok(msg.includes("Artel Таджикистан"));
  assert.ok(msg.includes("adv-artel"));
  assert.ok(msg.includes("45 сомони"));
  assert.ok(msg.includes("Бытовая техника новосёлам"));
});

test("Telegram Notification Suite - Simulated Dispatch without Bot Token", async () => {
  // In dev / test environment, dispatchers should gracefully simulate and return { success: true, simulated: true }
  const res1 = await notifyTelegramPaymentSuccess({
    transactionId: "tx_test_1",
    purpose: "classified_turbo",
    amountTjs: 20,
    providerName: "Dushanbe City",
    payerPhone: "+992 92 000 0000",
  });
  assert.equal(res1.success, true);
  assert.equal(res1.simulated, true);

  const res2 = await notifyTelegramBookingRequest({
    projectName: "Test Complex",
    totalPriceTjs: 300000,
    clientPhone: "+992 92 111 2233",
  });
  assert.equal(res2.success, true);
  assert.equal(res2.simulated, true);

  const res3 = await notifyTelegramSponsorshipLead({
    companyName: "Test Co",
    brandName: "Test",
    contactPerson: "Manager",
    phone: "+992 92 222 3344",
    packageType: "quarterly_sponsor",
  });
  assert.equal(res3.success, true);
  assert.equal(res3.simulated, true);

  const res4 = await notifyTelegramLowBalance({
    companyName: "Test Co",
    advertiserId: "adv-test",
    remainingBalanceTjs: 50,
  });
  assert.equal(res4.success, true);
  assert.equal(res4.simulated, true);
});
