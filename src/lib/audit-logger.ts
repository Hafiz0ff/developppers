/**
 * Audit Logger Service
 * Implements Section 5.4 of the specification:
 * - Records who performed the action (userId, userRole)
 * - What action was performed (create, update, delete, change_status, etc.)
 * - Which entity was targeted (entityType, entityId)
 * - Timestamp and operation status (success / failure)
 * - Automatic redaction of sensitive credentials (passwords, tokens, keys)
 */

export type AuditAction =
  | "create"
  | "update"
  | "delete"
  | "change_status"
  | "login_as"
  | "toggle_feature_flag"
  | "moderate";

export type AuditEntityType =
  | "project"
  | "classified"
  | "unit"
  | "user"
  | "config"
  | "lead";

export interface AuditLogEntry {
  userId: string;
  userRole: string;
  action: AuditAction;
  entityType: AuditEntityType;
  entityId: string;
  status: "success" | "failure";
  details?: Record<string, unknown>;
  errorMessage?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface StoredAuditLog extends AuditLogEntry {
  id: string;
  createdAt: string;
}

// In-memory buffer for audit events (useful for testing, development, and fallback)
const inMemoryAuditLogs: StoredAuditLog[] = [];
const MAX_IN_MEMORY_LOGS = 500;

const SENSITIVE_KEYS = new Set([
  "password",
  "token",
  "secret",
  "accesstoken",
  "refreshtoken",
  "apikey",
  "code",
  "authorization",
  "idtoken",
]);

/**
 * Recursively sanitizes audit details, masking passwords, API tokens and keys
 */
export function sanitizeAuditDetails(data?: Record<string, unknown>): Record<string, unknown> {
  if (!data || typeof data !== "object") return {};

  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data)) {
    const lowerKey = key.toLowerCase();
    if (SENSITIVE_KEYS.has(lowerKey)) {
      sanitized[key] = "[REDACTED]";
    } else if (value && typeof value === "object" && !Array.isArray(value)) {
      sanitized[key] = sanitizeAuditDetails(value as Record<string, unknown>);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/**
 * Logs an administrative action with metadata and data protection
 */
export async function logAuditEvent(entry: AuditLogEntry): Promise<StoredAuditLog> {
  const sanitizedDetails = sanitizeAuditDetails(entry.details);

  const stored: StoredAuditLog = {
    ...entry,
    id: `audit_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    details: sanitizedDetails,
    createdAt: new Date().toISOString(),
  };

  inMemoryAuditLogs.unshift(stored);
  if (inMemoryAuditLogs.length > MAX_IN_MEMORY_LOGS) {
    inMemoryAuditLogs.pop();
  }

  // Attempt to write to database if db client is configured
  try {
    const { db } = await import("@/db");
    const { auditLogs } = await import("@/db/schema/audit-logs");
    if (db && auditLogs) {
      await db.insert(auditLogs).values({
        id: stored.id,
        userId: stored.userId,
        userRole: stored.userRole,
        action: stored.action,
        entityType: stored.entityType,
        entityId: stored.entityId,
        status: stored.status,
        details: stored.details,
        errorMessage: stored.errorMessage || null,
        ipAddress: stored.ipAddress || null,
        userAgent: stored.userAgent || null,
      });
    }
  } catch {
    // Graceful fallback to in-memory store if DB is disconnected (e.g. test environment)
  }

  return stored;
}

/**
 * Returns recent in-memory audit logs for inspection
 */
export function getRecentAuditLogs(limit = 50): StoredAuditLog[] {
  return inMemoryAuditLogs.slice(0, limit);
}

/**
 * Clears in-memory audit logs (useful in tests)
 */
export function clearInMemoryAuditLogs(): void {
  inMemoryAuditLogs.length = 0;
}
