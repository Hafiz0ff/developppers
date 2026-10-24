/**
 * URL Alias & 301 Redirect Registry
 * Ensures Single-Hop 301 Permanent Redirects, Chain Elimination & Loop Prevention
 * Conforms to MASKANI.TJ SEO Specification v1.7 (Sections 2.1, 5, 13, 15)
 */

export interface UrlAlias {
  id: string;
  oldPath: string; // Normalized lowercase path with leading slash, no trailing slash
  targetPath: string; // Canonical destination path
  entityId: string;
  entityType: "listing" | "category" | "developer" | "complex" | "other";
  statusCode: 301 | 308;
  reason: string;
  createdAt: string;
  status: "active" | "superseded";
}

export interface AliasResolution {
  targetPath: string;
  statusCode: number;
  reason: string;
  hopsEliminated: number;
}

// In-memory runtime alias store (can be persisted to Postgres/Drizzle)
let aliasRegistry: Map<string, UrlAlias> = new Map();

/**
 * Normalizes a URL path:
 * - ensures single leading slash
 * - removes trailing slash (except root '/')
 * - lowercases
 * - strips duplicate slashes and query strings
 */
export function normalizePath(path: string): string {
  if (!path) return "/";
  let clean = path.split("?")[0].split("#")[0].trim().toLowerCase();
  clean = clean.replace(/\/+/g, "/");
  if (clean.length > 1 && clean.endsWith("/")) {
    clean = clean.slice(0, -1);
  }
  if (!clean.startsWith("/")) {
    clean = `/${clean}`;
  }
  return clean;
}

/**
 * Records a URL redirect alias.
 * Enforces AC-12 / AC-15:
 * 1. Loop Prevention: Cannot redirect to itself (oldPath === targetPath).
 * 2. Chain Elimination: If any existing alias points to `oldPath`, repoint it directly to `targetPath`.
 * 3. Terminal Hop: If `targetPath` itself already redirects, resolve to terminal target.
 */
export function recordUrlAlias(params: {
  oldPath: string;
  targetPath: string;
  entityId: string;
  entityType?: "listing" | "category" | "developer" | "complex" | "other";
  reason: string;
  statusCode?: 301 | 308;
}): UrlAlias | null {
  const normOld = normalizePath(params.oldPath);
  let normTarget = normalizePath(params.targetPath);

  // 1. Loop Prevention: never create alias pointing to itself
  if (normOld === normTarget) {
    return null;
  }

  // 2. Terminal Hop: if target already has an alias, follow it to avoid chain
  const existingTargetAlias = aliasRegistry.get(normTarget);
  if (existingTargetAlias && existingTargetAlias.status === "active") {
    if (existingTargetAlias.targetPath !== normOld) {
      normTarget = existingTargetAlias.targetPath;
    }
  }

  const aliasId = `alias_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const newAlias: UrlAlias = {
    id: aliasId,
    oldPath: normOld,
    targetPath: normTarget,
    entityId: params.entityId,
    entityType: params.entityType || "listing",
    statusCode: params.statusCode || 301,
    reason: params.reason,
    createdAt: new Date().toISOString(),
    status: "active",
  };

  // 3. Chain Elimination: Find any existing aliases that currently point to normOld
  // and update them directly to normTarget! (A -> B, now B -> C => A -> C)
  for (const [key, item] of aliasRegistry.entries()) {
    if (item.targetPath === normOld && item.oldPath !== normTarget) {
      aliasRegistry.set(key, {
        ...item,
        targetPath: normTarget,
        reason: `${item.reason} -> chain eliminated to ${normTarget}`,
      });
    }
  }

  aliasRegistry.set(normOld, newAlias);
  return newAlias;
}

/**
 * Resolves whether an incoming path should be redirected.
 * Returns the single-hop canonical targetPath if an active alias exists, or null.
 */
export function resolveUrlAlias(path: string): AliasResolution | null {
  const norm = normalizePath(path);
  const alias = aliasRegistry.get(norm);
  if (!alias || alias.status !== "active") {
    return null;
  }

  let finalTarget = alias.targetPath;
  let hopsEliminated = 0;

  // Extra safety check: if targetPath itself has another alias, follow it
  const visited = new Set<string>([norm]);
  while (aliasRegistry.has(finalTarget)) {
    const next = aliasRegistry.get(finalTarget)!;
    if (visited.has(next.targetPath)) {
      // Loop detected in chain; break out to prevent infinite loop
      break;
    }
    visited.add(finalTarget);
    finalTarget = next.targetPath;
    hopsEliminated++;
  }

  return {
    targetPath: finalTarget,
    statusCode: alias.statusCode,
    reason: alias.reason,
    hopsEliminated,
  };
}

/**
 * Returns all active URL aliases
 */
export function getAllUrlAliases(): UrlAlias[] {
  return Array.from(aliasRegistry.values());
}

/**
 * Clears aliases store (used in testing)
 */
export function resetUrlAliasesForTesting(): void {
  aliasRegistry.clear();
}
