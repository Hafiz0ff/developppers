import {
  pgTable,
  text,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";
import { classifieds } from "./classifieds";

export const crmLeads = pgTable("crm_leads", {
  id: text("id").primaryKey(),
  agentId: text("agent_id").notNull(),
  clientName: text("client_name").notNull(),
  clientPhone: text("client_phone").notNull(),
  
  // Связь с объявлением (если лид пришел по конкретному объекту)
  classifiedId: text("classified_id").references(() => classifieds.id, { onDelete: "set null" }),
  classifiedTitle: text("classified_title"),
  
  // Статус воронки: new | contacted | showing | deal | closed
  status: text("status").notNull().default("new"),
  
  // Финансы
  budget: integer("budget").default(0).notNull(), // В долларах США
  commission: integer("commission").default(0).notNull(), // Расчетная комиссия маклера в USD
  commissionPercent: integer("commission_percent").default(2).notNull(), // Процент комиссии (по умолчанию 2%)
  
  // Источник лида: phone_click | whatsapp_click | manual | website
  source: text("source").default("website").notNull(),
  
  notes: text("notes"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const crmCollections = pgTable("crm_collections", {
  id: text("id").primaryKey(),
  shareCode: text("share_code").notNull().unique(), // Уникальный публичный код для ссылки /p/[shareCode]
  agentId: text("agent_id").notNull(),
  agentName: text("agent_name").notNull(),
  agentPhone: text("agent_phone").notNull(),
  agentAvatar: text("agent_avatar"),
  agentAgency: text("agent_agency"),
  
  title: text("title").notNull().default("Персональная подборка недвижимости"),
  notes: text("notes"),
  
  // Список ID выбранных объектов в формате JSON строки: ["c1", "c2", "c3"]
  propertyIds: text("property_ids").notNull(),
  
  viewsCount: integer("views_count").default(0).notNull(),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type CrmLead = typeof crmLeads.$inferSelect;
export type NewCrmLead = typeof crmLeads.$inferInsert;

export type CrmCollection = typeof crmCollections.$inferSelect;
export type NewCrmCollection = typeof crmCollections.$inferInsert;
