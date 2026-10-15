import { test } from "node:test";
import assert from "node:assert/strict";
import { formatPublicationDate, formatPricePerSquareMeter } from "./format-utils";

test("Classifieds Format: formatPricePerSquareMeter handles standard and edge cases", () => {
  // Test 977 636 somoni / m² exactly as requested in prompt: «Цена за метр: 977 636 сомони/м²»
  const resRu = formatPricePerSquareMeter(9776360, 10, "ru");
  assert.equal(resRu, "Цена за метр: 977 636 сомони/м²");

  const resTg = formatPricePerSquareMeter(9776360, 10, "tg");
  assert.equal(resTg, "Нарх барои метр: 977 636 сомонӣ/м²");

  // Empty or invalid cases return empty string
  assert.equal(formatPricePerSquareMeter(0, 10), "");
  assert.equal(formatPricePerSquareMeter(100000, 0), "");
  assert.equal(formatPricePerSquareMeter(-50, 10), "");
});

test("Classifieds Format: formatPublicationDate matches specification format", () => {
  const fixedDate = new Date(2026, 9, 15, 11, 54); // October 15, 2026, 11:54
  const resRu = formatPublicationDate(fixedDate, "ru");
  assert.equal(resRu, "Публикация 15.окт, 11:54");

  const resTg = formatPublicationDate(fixedDate, "tg");
  assert.equal(resTg, "Нашр 15.окт, 11:54");
});
