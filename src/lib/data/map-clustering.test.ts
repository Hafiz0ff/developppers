import { test } from "node:test";
import assert from "node:assert/strict";
import {
  getAllMapProperties,
  clusterMapProperties,
  formatPriceShort,
  MapPropertyItem,
} from "../geo-utils";

test("Stage 3: formatPriceShort formats USD and TJS accurately in RU and TG", () => {
  // USD
  assert.equal(formatPriceShort(48500, 531000, "USD", "ru"), "$48,500");
  assert.equal(formatPriceShort(1200000, 13140000, "USD", "ru"), "$1.2M");

  // TJS
  assert.equal(formatPriceShort(48500, 530000, "TJS", "ru"), "530 тыс. TJS");
  assert.equal(formatPriceShort(48500, 530000, "TJS", "tg"), "530 ҳ. сомонӣ");
  assert.equal(formatPriceShort(150000, 1640000, "TJS", "ru"), "1.6 млн TJS");
  assert.equal(formatPriceShort(150000, 1640000, "TJS", "tg"), "1.6 млн сомонӣ");
});

test("Stage 3: clusterMapProperties groups items at low zoom (regional level)", () => {
  const all = getAllMapProperties();
  assert.ok(all.length >= 17, "Should have at least 17 properties");

  // At regional zoom (zoom = 10, whole Sughd)
  const clustersZoom10 = clusterMapProperties(all, 10);
  assert.ok(
    clustersZoom10.length < all.length,
    `At zoom 10, items should cluster: ${clustersZoom10.length} < ${all.length}`
  );

  const clusterItems = clustersZoom10.filter((c) => c.isCluster);
  assert.ok(clusterItems.length > 0, "Should produce at least one cluster at zoom 10");

  for (const cluster of clusterItems) {
    if (cluster.isCluster) {
      assert.ok(cluster.count >= 2, "Cluster must have at least 2 items");
      assert.equal(cluster.properties.length, cluster.count);
      assert.ok(cluster.minPriceUsd > 0, "Cluster must have valid minPriceUsd");
      assert.ok(cluster.minPriceTjs > 0, "Cluster must have valid minPriceTjs");
    }
  }
});

test("Stage 3: clusterMapProperties unpacks items at high zoom (street level)", () => {
  const all = getAllMapProperties();

  // At street zoom (zoom = 15)
  const pinsZoom15 = clusterMapProperties(all, 15);
  // Most items should be standalone pins
  const singlePins = pinsZoom15.filter((p) => !p.isCluster);
  assert.ok(
    singlePins.length >= 10,
    `At zoom 15, most items should be individual pins: got ${singlePins.length}`
  );
});

test("Stage 3: Total properties count is preserved across clustering", () => {
  const all = getAllMapProperties();

  for (const zoom of [9, 11, 13, 15]) {
    const clustered = clusterMapProperties(all, zoom);
    let totalItems = 0;

    for (const item of clustered) {
      if (item.isCluster) {
        totalItems += item.count;
      } else {
        totalItems += 1;
      }
    }

    assert.equal(
      totalItems,
      all.length,
      `Total count must match ${all.length} at zoom ${zoom}, got ${totalItems}`
    );
  }
});
