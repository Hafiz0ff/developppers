import test from "node:test";
import assert from "node:assert/strict";
import {
  formatNewBuildingPricePerMeter,
  getPricePerMeterLabel,
} from "./new-building-price";

test("New Building Price: formats standard calculation with space separator and currency", () => {
  // Test case matching exact prompt specification: 11 250 сомони/м²
  const res1 = formatNewBuildingPricePerMeter({
    pricePerMeterTjs: 11250,
    currency: "TJS",
    language: "ru",
  });
  assert.equal(res1, "11 250 сомони/м²");

  // Tajik localization: сомонӣ/м²
  const resTg = formatNewBuildingPricePerMeter({
    pricePerMeterTjs: 11250,
    currency: "TJS",
    language: "tg",
  });
  assert.equal(resTg, "11 250 сомонӣ/м²");

  // USD currency
  const resUsd = formatNewBuildingPricePerMeter({
    pricePerMeterUsd: 1025,
    currency: "USD",
    language: "ru",
  });
  assert.equal(resUsd, "1 025 $/м²");
});

test("New Building Price: calculates price per meter from total price and area", () => {
  // Total 562 500 TJS / 50 sqm = 11 250
  const calculated = formatNewBuildingPricePerMeter({
    totalPriceTjs: 562500,
    areaSqm: 50,
    currency: "TJS",
    language: "ru",
  });
  assert.equal(calculated, "11 250 сомони/м²");

  // Total $61,500 / 60 sqm = $1,025
  const calculatedUsd = formatNewBuildingPricePerMeter({
    totalPriceUsd: 61500,
    areaSqm: 60,
    currency: "USD",
  });
  assert.equal(calculatedUsd, "1 025 $/м²");
});

test("New Building Price: does not display when price or area is missing or calculation is impossible", () => {
  // Missing values
  assert.equal(formatNewBuildingPricePerMeter({}), null);
  assert.equal(formatNewBuildingPricePerMeter({ pricePerMeterTjs: 0 }), null);
  assert.equal(formatNewBuildingPricePerMeter({ pricePerMeterTjs: -100 }), null);
  assert.equal(formatNewBuildingPricePerMeter({ pricePerMeterTjs: null }), null);

  // Zero area or zero price in calculation
  assert.equal(
    formatNewBuildingPricePerMeter({
      totalPriceTjs: 500000,
      areaSqm: 0,
      currency: "TJS",
    }),
    null
  );
  assert.equal(
    formatNewBuildingPricePerMeter({
      totalPriceTjs: 0,
      areaSqm: 50,
      currency: "TJS",
    }),
    null
  );
  assert.equal(
    formatNewBuildingPricePerMeter({
      totalPriceTjs: 500000,
      areaSqm: -10,
      currency: "TJS",
    }),
    null
  );
  assert.equal(
    formatNewBuildingPricePerMeter({
      totalPriceTjs: null,
      areaSqm: 50,
      currency: "TJS",
    }),
    null
  );
});

test("New Building Price: getPricePerMeterLabel returns proper bilingual labels", () => {
  assert.equal(getPricePerMeterLabel("ru"), "Цена за метр");
  assert.equal(getPricePerMeterLabel("tg"), "Нарх барои метр");
});
