/**
 * Feature Flags Management System
 * Implements Section 5.3 of the specification:
 * - Module visibility toggling
 * - Safe phased rollout of administrative capabilities without altering core UI code
 * - Safe default configuration ensuring privileged/incomplete sections remain hidden
 */

export interface FeatureFlagsConfig {
  /**
   * Super-Admin UI Panel
   * Default: false (interface is not yet implemented)
   */
  superAdminPanel: boolean;

  /**
   * Audit Logs explorer
   * Default: false
   */
  superAdminAuditLogs: boolean;

  /**
   * Enhanced Developer Admin Suite
   * Default: true
   */
  developerAdminV2: boolean;

  /**
   * Agency multi-agent management
   * Default: false
   */
  agencyMultiAgent: boolean;

  /**
   * Interactive Geo-Map of Sughd (Phase 9)
   * Default: true
   */
  interactiveMap: boolean;

  /**
   * Automated PDF Watermarking for official documents
   * Default: true
   */
  pdfWatermarking: boolean;

  /**
   * CRM Lead Distribution Pipeline
   * Default: true
   */
  crmLeadDistribution: boolean;
}

export const DEFAULT_FEATURE_FLAGS: FeatureFlagsConfig = {
  superAdminPanel: false, // Strict: full UI is disabled on current stage
  superAdminAuditLogs: false,
  developerAdminV2: true,
  agencyMultiAgent: false,
  interactiveMap: true,
  pdfWatermarking: true,
  crmLeadDistribution: true,
};

// In-memory runtime overrides (for testing, staging, and session toggling)
const runtimeOverrides: Partial<FeatureFlagsConfig> = {};

/**
 * Returns active feature flags, merged with environment variables and runtime overrides
 */
export function getFeatureFlags(): FeatureFlagsConfig {
  const envSuperAdmin = process.env.NEXT_PUBLIC_FF_SUPER_ADMIN === "true";
  const envAuditLogs = process.env.NEXT_PUBLIC_FF_AUDIT_LOGS === "true";

  return {
    ...DEFAULT_FEATURE_FLAGS,
    superAdminPanel: envSuperAdmin || DEFAULT_FEATURE_FLAGS.superAdminPanel,
    superAdminAuditLogs: envAuditLogs || DEFAULT_FEATURE_FLAGS.superAdminAuditLogs,
    ...runtimeOverrides,
  };
}

/**
 * Checks whether a specific feature flag is currently active
 */
export function isFeatureEnabled(flagName: keyof FeatureFlagsConfig): boolean {
  const flags = getFeatureFlags();
  return Boolean(flags[flagName]);
}

/**
 * Overrides a feature flag at runtime (useful in tests and dev environments)
 */
export function setFeatureFlagOverride(flagName: keyof FeatureFlagsConfig, isEnabled: boolean): void {
  runtimeOverrides[flagName] = isEnabled;
}

/**
 * Resets all runtime feature flag overrides
 */
export function resetFeatureFlagOverrides(): void {
  for (const key of Object.keys(runtimeOverrides) as Array<keyof FeatureFlagsConfig>) {
    delete runtimeOverrides[key];
  }
}
