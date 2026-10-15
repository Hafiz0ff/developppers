import test from "node:test";
import assert from "node:assert/strict";
import {
  getAdBucket,
  getAdBlock1Variant,
  getAdBlock2Variant,
} from "./ad-config";

test("Ad Config: getAdBucket produces deterministic 0..99 values", () => {
  const bucket1 = getAdBucket("classified-1");
  const bucket2 = getAdBucket("classified-1");
  assert.equal(bucket1, bucket2, "Identical seeds must yield identical buckets");

  const bucketA = getAdBucket("item-abc");
  assert.ok(bucketA >= 0 && bucketA < 100);

  // Null/undefined safety
  assert.equal(getAdBucket(null), 0);
  assert.equal(getAdBucket(undefined), 0);
});

test("Ad Config: Ad Block 1 variants distribute correctly across 40% / 30% / 30%", () => {
  let countSelfPromo = 0;
  let countEskhataMortgage = 0;
  let countEskhataInsurance = 0;

  // Test across 1000 items
  const total = 1000;
  for (let i = 0; i < total; i++) {
    const variant = getAdBlock1Variant(`prop_${i}`);
    if (variant === "self_promo") countSelfPromo++;
    else if (variant === "eskhata_mortgage") countEskhataMortgage++;
    else if (variant === "eskhata_insurance") countEskhataInsurance++;
  }

  // Expect roughly 40% / 30% / 30% (+/- 5% statistical margin)
  assert.ok(countSelfPromo > 350 && countSelfPromo < 450, `Self-promo was ${countSelfPromo}`);
  assert.ok(countEskhataMortgage > 250 && countEskhataMortgage < 350, `Eskhata Mortgage was ${countEskhataMortgage}`);
  assert.ok(countEskhataInsurance > 250 && countEskhataInsurance < 350, `Eskhata Insurance was ${countEskhataInsurance}`);
});

test("Ad Config: Ad Block 2 variants distribute correctly across 40% / 60%", () => {
  let countArtelStd = 0;
  let countArtelBundle = 0;

  const total = 1000;
  for (let i = 0; i < total; i++) {
    const variant = getAdBlock2Variant(`item_${i}`);
    if (variant === "artel_standard") countArtelStd++;
    else if (variant === "artel_mortgage_bundle") countArtelBundle++;
  }

  assert.ok(countArtelStd > 350 && countArtelStd < 450, `Artel std was ${countArtelStd}`);
  assert.ok(countArtelBundle > 550 && countArtelBundle < 650, `Artel bundle was ${countArtelBundle}`);
});
