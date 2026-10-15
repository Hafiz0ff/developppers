import { test } from "node:test";
import assert from "node:assert/strict";
import {
  getFeatureFlags,
  isFeatureEnabled,
  setFeatureFlagOverride,
  resetFeatureFlagOverrides,
  DEFAULT_FEATURE_FLAGS,
} from "./feature-flags";

test("Feature Flags: default values keep privileged/unfinished UI safely disabled", () => {
  resetFeatureFlagOverrides();
  const flags = getFeatureFlags();

  // Super-admin panel is strictly false by default on this phase
  assert.equal(flags.superAdminPanel, false);
  assert.equal(flags.superAdminAuditLogs, false);

  // Active production modules remain enabled
  assert.equal(flags.developerAdminV2, true);
  assert.equal(flags.interactiveMap, true);
  assert.equal(flags.pdfWatermarking, true);
});

test("Feature Flags: runtime overrides allow controlled testing and phased rollout", () => {
  resetFeatureFlagOverrides();
  assert.equal(isFeatureEnabled("superAdminPanel"), false);

  // Override to true
  setFeatureFlagOverride("superAdminPanel", true);
  assert.equal(isFeatureEnabled("superAdminPanel"), true);

  // Reset back to defaults
  resetFeatureFlagOverrides();
  assert.equal(isFeatureEnabled("superAdminPanel"), false);
});
