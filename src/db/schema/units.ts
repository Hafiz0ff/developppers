import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  numeric,
  jsonb,
} from "drizzle-orm/pg-core";
import { unitTypeEnum, unitStatusEnum, finishingTypeEnum } from "./enums";
import { projects } from "./projects";

export const units = pgTable("units", {
  id: text("id").primaryKey(),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),

  unitNumber: text("unit_number"), // Номер квартиры или помещения (напр. "Кв. 34")
  type: unitTypeEnum("type").default("apartment").notNull(),
  roomsCount: integer("rooms_count").notNull(), // 0 = студия, 1, 2, 3, 4+

  // Площади (в кв. метрах)
  totalArea: numeric("total_area", { precision: 7, scale: 2 }).notNull(), // Напр. 78.50 м²
  livingArea: numeric("living_area", { precision: 7, scale: 2 }),
  kitchenArea: numeric("kitchen_area", { precision: 7, scale: 2 }),

  // Расположение в здании
  floor: integer("floor").notNull(), // Этаж
  section: text("section"), // Блок / секция (напр. "Блок А", "Подъезд 2")

  // Цены (двухвалютная система)
  priceTjs: numeric("price_tjs", { precision: 14, scale: 2 }).notNull(),
  priceUsd: numeric("price_usd", { precision: 14, scale: 2 }).notNull(),
  pricePerMeterTjs: numeric("price_per_meter_tjs", { precision: 12, scale: 2 }).notNull(),
  pricePerMeterUsd: numeric("price_per_meter_usd", { precision: 12, scale: 2 }).notNull(),

  // Статус и отделка
  status: unitStatusEnum("status").default("available").notNull(),
  finishing: finishingTypeEnum("finishing").default("rough").notNull(),

  // Особенности планировки
  hasBalcony: boolean("has_balcony").default(true).notNull(),
  hasTerrace: boolean("has_terrace").default(false).notNull(),
  windowView: text("window_view"), // Напр. "Панорамный вид на Сырдарью"
  bathroomsCount: integer("bathrooms_count").default(1).notNull(),

  // Медиа планировки
  layoutPlanUrl: text("layout_plan_url"), // Ссылка на чертеж планировки
  images: jsonb("images").$type<string[]>().default([]), // 3D рендеры или фото

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Unit = typeof units.$inferSelect;
export type NewUnit = typeof units.$inferInsert;
