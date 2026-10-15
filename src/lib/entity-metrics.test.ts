import { test } from "node:test";
import assert from "node:assert/strict";
import {
  normalizeEntityId,
  getBaselineEntityStats,
  hasViewedEntityRecently,
  recordUniqueEntityView,
  isEntityInFavorites,
  toggleEntityFavorite,
  DEFAULT_PROJECT_METRICS,
  DEFAULT_CLASSIFIED_METRICS,
} from "./entity-metrics";

// Minimal mock for localStorage and window in Node test environment
class LocalStorageMock {
  private store: Record<string, string> = {};

  getItem(key: string) {
    return this.store[key] || null;
  }

  setItem(key: string, value: string) {
    this.store[key] = String(value);
  }

  removeItem(key: string) {
    delete this.store[key];
  }

  clear() {
    this.store = {};
  }
}

// Polyfill window & localStorage for Node test runner
(globalThis as any).window = globalThis;
(globalThis as any).localStorage = new LocalStorageMock();

test("Entity Metrics: normalizeEntityId handles prefixes and slugs", () => {
  assert.equal(normalizeEntityId("classified-17034738"), "17034738");
  assert.equal(
    normalizeEntityId("17034738-1-komn-kvartira-4-etazh-44-m2-sholkombinat"),
    "17034738"
  );
  assert.equal(normalizeEntityId("sirdaryo-plaza"), "sirdaryo-plaza");
  assert.equal(normalizeEntityId(""), "");
});

test("Entity Metrics: getBaselineEntityStats returns known and deterministic stats", () => {
  const sirdaryo = getBaselineEntityStats("sirdaryo-plaza");
  assert.equal(sirdaryo.viewsCount, DEFAULT_PROJECT_METRICS["sirdaryo-plaza"].viewsCount);
  assert.equal(sirdaryo.favoritesCount, DEFAULT_PROJECT_METRICS["sirdaryo-plaza"].favoritesCount);

  const classified = getBaselineEntityStats("17034738");
  assert.equal(classified.viewsCount, DEFAULT_CLASSIFIED_METRICS["17034738"].viewsCount);
  assert.equal(classified.favoritesCount, DEFAULT_CLASSIFIED_METRICS["17034738"].favoritesCount);

  // Unknown entity gets deterministic stats
  const unknown = getBaselineEntityStats("unknown-complex-xyz");
  assert.ok(unknown.viewsCount > 0);
  assert.ok(unknown.favoritesCount > 0);
});

test("Entity Metrics: 24-hour unique view deduplication prevents inflation", () => {
  localStorage.clear();
  const slug = "qayroqum-avenue";
  const now = 1700000000000;

  // First view should be counted
  const first = recordUniqueEntityView(slug, now);
  assert.equal(first, true);
  assert.equal(hasViewedEntityRecently(slug, now), true);

  // Second view immediately after or on page refresh should NOT be counted
  const reload = recordUniqueEntityView(slug, now + 5000);
  assert.equal(reload, false);

  // View after 12 hours should still NOT be counted
  const hours12Later = now + 12 * 60 * 60 * 1000;
  assert.equal(recordUniqueEntityView(slug, hours12Later), false);

  // View after 25 hours should be counted as a new unique visit
  const hours25Later = now + 25 * 60 * 60 * 1000;
  assert.equal(recordUniqueEntityView(slug, hours25Later), true);
});

test("Entity Metrics: favorites toggling updates status and syncs state", () => {
  localStorage.clear();
  const id = "17034738";

  assert.equal(isEntityInFavorites(id), false);

  // Toggle on
  const state1 = toggleEntityFavorite(id);
  assert.equal(state1, true);
  assert.equal(isEntityInFavorites(id), true);

  // Toggle off
  const state2 = toggleEntityFavorite(id);
  assert.equal(state2, false);
  assert.equal(isEntityInFavorites(id), false);
});
