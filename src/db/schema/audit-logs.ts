import { pgTable, text, timestamp, jsonb } from "drizzle-orm/pg-core";

export const auditLogs = pgTable("audit_logs", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  userRole: text("user_role").notNull(),
  action: text("action").notNull(), // create, update, delete, change_status, login_as, toggle_feature_flag
  entityType: text("entity_type").notNull(), // project, classified, unit, user, config
  entityId: text("entity_id").notNull(),
  status: text("status").notNull(), // success, failure
  details: jsonb("details").$type<Record<string, unknown>>().default({}),
  errorMessage: text("error_message"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type AuditLog = typeof auditLogs.$inferSelect;
export type NewAuditLog = typeof auditLogs.$inferInsert;
