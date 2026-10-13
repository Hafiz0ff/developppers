import {
  pgTable,
  text,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";
import { classifieds } from "./classifieds";

export const classifiedAnalytics = pgTable("classified_analytics", {
  id: text("id").primaryKey(),
  classifiedId: text("classified_id")
    .notNull()
    .references(() => classifieds.id, { onDelete: "cascade" }),

  // Дата среза для ежедневных выгрузок и графиков (формат YYYY-MM-DD)
  date: text("date").notNull(),

  // Метрики воронки
  viewsCount: integer("views_count").default(0).notNull(),
  phoneViewsCount: integer("phone_views_count").default(0).notNull(),
  favoritesCount: integer("favorites_count").default(0).notNull(),
  whatsappClicks: integer("whatsapp_clicks").default(0).notNull(),
  chatInitiations: integer("chat_initiations").default(0).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type ClassifiedAnalytics = typeof classifiedAnalytics.$inferSelect;
export type NewClassifiedAnalytics = typeof classifiedAnalytics.$inferInsert;
