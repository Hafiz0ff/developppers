import assert from "node:assert/strict";
import { test } from "node:test";
import { classifiedInputSchema } from "./schema";

test("rejects classified without required fields", () => {
  const result = classifiedInputSchema.safeParse({
    title: "",
    photos: [],
  });
  assert.equal(result.success, false);
});

test("accepts a minimal apartment sale", () => {
  const result = classifiedInputSchema.safeParse({
    title: "3-комнатная в 18 мкр",
    description: "Светлая квартира с евроремонтом и документами.",
    dealType: "sale",
    propertyType: "apartment",
    city: "khujand",
    address: "18 мкр, дом 15",
    roomsCount: 3,
    totalArea: 76,
    priceTjs: 536550,
    priceUsd: 49000,
    originalCurrency: "USD",
    contactName: "Дилшод",
    contactPhone: "+992929994321",
    photos: ["https://example.com/a.jpg"],
  });
  assert.equal(result.success, true);
});
