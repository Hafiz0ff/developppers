import assert from "node:assert/strict";
import { test } from "node:test";
import {
  addInMemoryCollection,
  findInMemoryCollection,
  resetInMemoryCollectionsForTests,
} from "./crm-collections-store";

test("created share links resolve the selected properties, not the demo fallback", () => {
  resetInMemoryCollectionsForTests();

  addInMemoryCollection({
    id: "col-custom-1",
    shareCode: "pick-abc12",
    agentId: "agent-default",
    agentName: "Тестовый маклер",
    agentPhone: "+992 90 000 00 00",
    agentAvatar: "",
    agentAgency: "Test",
    title: "Только коммерция",
    notes: "Один объект",
    propertyIds: JSON.stringify(["c3"]),
    viewsCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const found = findInMemoryCollection("pick-abc12");
  assert.ok(found, "created collection must be found by share code");
  assert.deepEqual(JSON.parse(found.propertyIds), ["c3"]);
  assert.equal(found.title, "Только коммерция");
});

test("unknown pick-* codes do not masquerade as the demo collection", () => {
  resetInMemoryCollectionsForTests();
  assert.equal(findInMemoryCollection("pick-unknown"), null);
});

test("the seeded khujand-top3 demo collection remains available", () => {
  resetInMemoryCollectionsForTests();
  const demo = findInMemoryCollection("khujand-top3");
  assert.ok(demo);
  assert.deepEqual(JSON.parse(demo.propertyIds), ["c1", "c4", "c2"]);
});
