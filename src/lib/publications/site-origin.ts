/**
 * Returns the trusted canonical site origin configured in the environment.
 * Prevents Host header spoofing attacks when generating canonical CTA URLs.
 */
export function getCanonicalSiteOrigin(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "https://maskani.tj";
  return envUrl.replace(/\/+$/, "");
}
