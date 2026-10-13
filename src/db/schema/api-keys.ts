import {
  pgTable,
  text,
  timestamp,
  boolean,
  jsonb,
} from "drizzle-orm/pg-core";
import { users } from "./auth";

export const apiKeys = pgTable("api_keys", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  name: text("name").notNull(), // Название интеграции, например "AmoCRM Main"
  key: text("key").notNull().unique(), // Токен формата sr_live_...
  permissions: jsonb("permissions")
    .$type<string[]>()
    .default(["read_analytics", "auto_import_feed"])
    .notNull(),

  isActive: boolean("is_active").default(true).notNull(),
  lastUsedAt: timestamp("last_used_at"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type ApiKey = typeof apiKeys.$inferSelect;
export type NewApiKey = typeof apiKeys.$inferInsert;
