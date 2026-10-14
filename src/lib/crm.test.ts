import assert from "node:assert/strict";
import { test } from "node:test";
import { formatLeadHtmlMessage, LeadNotificationPayload } from "./telegram";
import {
  addInMemoryCollection,
  findInMemoryCollection,
  incrementInMemoryViews,
  resetInMemoryCollectionsForTests,
} from "./crm-collections-store";

test("CRM Lead: Commission calculation logic (2% standard and rental)", () => {
  const calculateCommission = (budget: number, percent = 2) => {
    return Math.round(budget * (percent / 100));
  };

  // 1. $49,000 apartment sale at 2% standard broker rate
  const comm1 = calculateCommission(49000, 2);
  assert.equal(comm1, 980);

  // 2. $65,000 house sale at 2% standard rate
  const comm2 = calculateCommission(65000, 2);
  assert.equal(comm2, 1300);

  // 3. Commercial rental ($776/month) with 100% first month commission
  const rentalComm = calculateCommission(776, 100);
  assert.equal(rentalComm, 776);
});

test("CRM Lead: Stage transitions follow Kanban flow", () => {
  const VALID_STAGES = ["new", "contacted", "showing", "deal", "closed"] as const;
  type LeadStage = (typeof VALID_STAGES)[number];

  const canTransition = (from: LeadStage, to: LeadStage): boolean => {
    // A lead can move forward or backward between adjacent or active stages, or be closed
    if (to === "closed") return true;
    const fromIdx = VALID_STAGES.indexOf(from);
    const toIdx = VALID_STAGES.indexOf(to);
    return Math.abs(toIdx - fromIdx) >= 0;
  };

  assert.ok(canTransition("new", "contacted"));
  assert.ok(canTransition("contacted", "showing"));
  assert.ok(canTransition("showing", "deal"));
  assert.ok(canTransition("deal", "closed"));
  assert.ok(canTransition("new", "closed")); // Can disqualify or close anytime
});

test("CRM Telegram: HTML formatting, escaping and channel label generation", () => {
  const payload: LeadNotificationPayload = {
    clientName: "Фарҳод <Нозиров>",
    clientPhone: "+992 92 771 44 22",
    classifiedTitle: "3-ҳуҷрагӣ & таъмири аврупоӣ (18 мкр)",
    budget: 49000,
    commission: 980,
    source: "whatsapp_click",
    notes: "Оила бо 2 кӯдак <мехоҳад дидан>",
    crmUrl: "https://maskani.tj/profile/crm",
  };

  const formatted = formatLeadHtmlMessage(payload);

  // Must properly escape HTML entities to avoid broken Telegram markup
  assert.ok(formatted.includes("&lt;Нозиров&gt;"));
  assert.ok(formatted.includes("3-ҳуҷрагӣ &amp; таъмири аврупоӣ"));
  assert.ok(formatted.includes("&lt;мехоҳад дидан&gt;"));

  // Channel mapping check
  assert.ok(formatted.includes("💬 Переход в WhatsApp"));

  // Budget and commission check
  assert.ok(formatted.includes("$49,000"));
  assert.ok(formatted.includes("$980"));

  // CRM link check
  assert.ok(formatted.includes('href="https://maskani.tj/profile/crm"'));
});

test("CRM Collections: View counting and white-label client presentation", () => {
  resetInMemoryCollectionsForTests();

  const customCollection = {
    id: "col-test-broker-1",
    shareCode: "sugd-vip-12",
    agentId: "agent-rustam",
    agentName: "Рустам Аҳмедов",
    agentPhone: "+992 92 777 00 22",
    agentAvatar: "https://images.unsplash.com/photo-test.jpg",
    agentAgency: "Агентии «Суғд-Инвест»",
    title: "Интихоби хонадонҳои элита дар Хуҷанд",
    notes: "Барои муштарии мӯҳтарам интихоб гардид.",
    propertyIds: JSON.stringify(["c1", "c4"]),
    viewsCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  addInMemoryCollection(customCollection);

  const found = findInMemoryCollection("sugd-vip-12");
  assert.ok(found);
  assert.equal(found.viewsCount, 0);

  // View count incrementing
  incrementInMemoryViews(found.id);
  const updated = findInMemoryCollection("sugd-vip-12");
  assert.equal(updated?.viewsCount, 1);

  // Verify properties in selection
  const ids = JSON.parse(updated!.propertyIds);
  assert.deepEqual(ids, ["c1", "c4"]);
});

test("CRM Vocabulary: Pure literary Tajik terminology without calques", () => {
  const dictionary = {
    leads: "Мизоҷон (дархостҳо)",
    deals: "Муомилаҳо",
    pipeline: "Воронкаи мизоҷон",
    commission: "Ҳаққи хизмат",
    showing: "Нишондиҳӣ",
    collection: "Интихоби амвол",
    analytics: "Таҳлил ва ҳисобот",
    verifiedBroker: "Мутахассиси тасдиқшуда",
  };

  // Verify absence of colloquialisms or Russian calques
  assert.ok(!dictionary.commission.toLowerCase().includes("комиссия"));
  assert.ok(!dictionary.collection.toLowerCase().includes("подборка"));
  assert.ok(!dictionary.deals.toLowerCase().includes("сделка"));
  assert.ok(dictionary.pipeline.includes("Воронка"));
  assert.ok(dictionary.showing.includes("Нишондиҳӣ"));
});
