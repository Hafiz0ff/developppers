import assert from "node:assert/strict";
import { test } from "node:test";
import { filterPublicClassifieds, parseClassifiedListQuery } from "./filters";

const rows = [
  {
    id: "a",
    status: "active",
    city: "khujand",
    propertyType: "apartment",
    dealType: "sale",
    roomsCount: 3,
    priceUsd: 49000,
    title: "18 мкр",
  },
  {
    id: "p",
    status: "pending",
    city: "khujand",
    propertyType: "apartment",
    dealType: "sale",
    roomsCount: 2,
    priceUsd: 38000,
    title: "скрыто",
  },
  {
    id: "x",
    status: "archived",
    city: "gafurov",
    propertyType: "house",
    dealType: "sale",
    roomsCount: 5,
    priceUsd: 65000,
    title: "хавли",
  },
  {
    id: "h",
    status: "active",
    city: "gafurov",
    propertyType: "house",
    dealType: "sale",
    roomsCount: 5,
    priceUsd: 65000,
    title: "дом Унчи",
  },
];

test("public list hides pending and archived", () => {
  const q = parseClassifiedListQuery({});
  const listed = filterPublicClassifieds(rows, q);
  assert.deepEqual(
    listed.map((r) => r.id),
    ["a", "h"]
  );
});

test("city and rooms filters apply on top of active", () => {
  const q = parseClassifiedListQuery({ city: "khujand", rooms: "3" });
  assert.deepEqual(
    filterPublicClassifieds(rows, q).map((r) => r.id),
    ["a"]
  );
});
