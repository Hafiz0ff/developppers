import assert from "node:assert/strict";
import { test } from "node:test";
import {
  getBaselineProjectStats,
  recordUniqueProjectView,
  hasViewedRecently,
  toggleProjectFavorite,
  isProjectInFavorites,
} from "./project-analytics";

// Minimal mock for localStorage in Node test environment
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
const originalWindow = (globalThis as any).window;
(globalThis as any).window = globalThis;
(globalThis as any).localStorage = new LocalStorageMock();

test("baseline stats return expected metrics for known and unknown projects", () => {
  const sirdaryo = getBaselineProjectStats("sirdaryo-plaza");
  assert.equal(sirdaryo.viewsMonthCount, 186);
  assert.equal(sirdaryo.favoritesMonthCount, 24);
  assert.ok(sirdaryo.viewsCount >= sirdaryo.viewsMonthCount);

  const unknown = getBaselineProjectStats("unknown-project-slug");
  assert.ok(unknown.viewsCount > 0);
  assert.ok(unknown.viewsMonthCount > 0);
});

test("unique view recording dedupes within 24 hours", () => {
  (globalThis as any).localStorage.clear();

  const slug = "test-project";
  const t0 = 1000000;

  // First view should be accepted
  const first = recordUniqueProjectView(slug, t0);
  assert.equal(first, true, "First view should be unique");
  assert.equal(hasViewedRecently(slug, t0), true);

  // Subsequent view within 1 hour should be ignored
  const second = recordUniqueProjectView(slug, t0 + 3600 * 1000);
  assert.equal(second, false, "Duplicate view within 24 hours must be rejected");

  // View after 25 hours should be treated as a new unique visit
  const third = recordUniqueProjectView(slug, t0 + 25 * 3600 * 1000);
  assert.equal(third, true, "Visit after 25h must count as new unique view");
});

test("favorites toggling persists and updates status correctly", () => {
  (globalThis as any).localStorage.clear();
  const slug = "sirdaryo-plaza";

  assert.equal(isProjectInFavorites(slug), false);

  const added = toggleProjectFavorite(slug);
  assert.equal(added, true, "Should be added to favorites");
  assert.equal(isProjectInFavorites(slug), true);

  const removed = toggleProjectFavorite(slug);
  assert.equal(removed, false, "Should be removed from favorites");
  assert.equal(isProjectInFavorites(slug), false);
});
