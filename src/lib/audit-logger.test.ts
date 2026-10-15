import { test } from "node:test";
import assert from "node:assert/strict";
import {
  logAuditEvent,
  getRecentAuditLogs,
  clearInMemoryAuditLogs,
  sanitizeAuditDetails,
} from "./audit-logger";

test("Audit Logger: records administrative action with full audit trail", async () => {
  clearInMemoryAuditLogs();

  const log = await logAuditEvent({
    userId: "admin_123",
    userRole: "admin",
    action: "change_status",
    entityType: "classified",
    entityId: "17034738",
    status: "success",
    details: { oldStatus: "pending", newStatus: "active" },
    ipAddress: "217.11.180.25",
  });

  assert.ok(log.id.startsWith("audit_"));
  assert.equal(log.userId, "admin_123");
  assert.equal(log.action, "change_status");
  assert.equal(log.entityType, "classified");
  assert.equal(log.status, "success");

  const recent = getRecentAuditLogs(10);
  assert.equal(recent.length, 1);
  assert.equal(recent[0].id, log.id);
});

test("Audit Logger: strictly redacts passwords, tokens and secrets from logged details", () => {
  const sensitivePayload = {
    username: "farrukh",
    password: "SuperSecretPassword123!",
    token: "jwt.header.payload.signature",
    apiKey: "msk_live_9876543210",
    nested: {
      secret: "sensitive_seed",
      publicInfo: "Худжанд",
    },
  };

  const sanitized = sanitizeAuditDetails(sensitivePayload);

  assert.equal(sanitized.password, "[REDACTED]");
  assert.equal(sanitized.token, "[REDACTED]");
  assert.equal(sanitized.apiKey, "[REDACTED]");
  assert.equal((sanitized.nested as Record<string, unknown>).secret, "[REDACTED]");
  assert.equal((sanitized.nested as Record<string, unknown>).publicInfo, "Худжанд");
  assert.equal(sanitized.username, "farrukh");
});
