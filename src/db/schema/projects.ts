import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  numeric,
  jsonb,
} from "drizzle-orm/pg-core";
import {
  sogdCityEnum,
  projectStatusEnum,
  buildingClassEnum,
  finishingTypeEnum,
} from "./enums";
import { developers } from "./developers";
import type {
  ProjectParkingConfig,
  ParkingSpot,
  ProjectStorageConfig,
  StorageUnit,
} from "@/types/parking-storage";
import type {
  ProjectDocument,
  ProjectDocumentsConfig,
} from "@/types/documents";

export const projects = pgTable("projects", {
  id: text("id").primaryKey(),
  developerId: text("developer_id")
    .notNull()
    .references(() => developers.id, { onDelete: "cascade" }),

  name: text("name").notNull(), // Например, "ЖК Сирдарё Плаза"
  nameTg: text("name_tg"), // Масалан, "МИ «Сирдарё Плаза»"
  slug: text("slug").notNull().unique(),
  shortDescription: text("short_description"),
  description: text("description"),
  descriptionTg: text("description_tg"),

  status: projectStatusEnum("status").default("under_construction").notNull(),
  buildingClass: buildingClassEnum("building_class").default("comfort").notNull(),
  finishing: finishingTypeEnum("finishing").default("rough").notNull(),

  // Локация в Согдийской области
  city: sogdCityEnum("city").default("khujand").notNull(),
  district: text("district"), // Микрорайон (18 мкр, 19 мкр, 34 мкр, Шелкокомбинат и др.)
  address: text("address").notNull(),
  addressTg: text("address_tg"), // Суроға бо забони тоҷикӣ
  landmark: text("landmark"), // Ориентир (Набережная, парк Камоли Худжанди, Панчшанбе)
  landmarkTg: text("landmark_tg"), // Нишона бо забони тоҷикӣ
  latitude: numeric("latitude", { precision: 10, scale: 7 }),
  longitude: numeric("longitude", { precision: 10, scale: 7 }),

  // Характеристики здания
  floorsCount: integer("floors_count").notNull(), // Количество этажей
  sectionsCount: integer("sections_count").default(1).notNull(), // Подъезды
  ceilingHeight: numeric("ceiling_height", { precision: 3, scale: 2 }), // Высота потолков в метрах (например, 3.10)
  constructionType: text("construction_type").default("Монолитно-каркасный"), // Монолит, кирпич и т.д.
  deadlineQuarter: integer("deadline_quarter"), // 1..4
  deadlineYear: integer("deadline_year"), // 2026, 2027

  // Новые стандартные характеристики участка и дома
  landArea: text("land_area"), // Площадь участка (например, "0.85 га", "12 соток")
  wallMaterial: text("wall_material"), // Материал стен (например, "Газоблок", "Кирпич")
  facade: text("facade"), // Фасад (например, "Клинкерная плитка", "Вентфасад")
  cadastralNumber: text("cadastral_number"), // Кадастровый номер участка

  // Пользовательские характеристики здания (до 3)
  customBuildingFeatures: jsonb("custom_building_features").$type<
    Array<{ id: string; title: string; value: string }>
  >().default([]),

  // Пользовательские характеристики отделки (до 3)
  finishingFeatures: jsonb("finishing_features").$type<
    Array<{ id: string; title: string; description: string }>
  >().default([]),

  // Цены (двухвалютная поддержка: TJS и USD)
  minPricePerMeterTjs: numeric("min_price_per_meter_tjs", { precision: 12, scale: 2 }),
  minPricePerMeterUsd: numeric("min_price_per_meter_usd", { precision: 12, scale: 2 }),
  minTotalPriceTjs: numeric("min_total_price_tjs", { precision: 14, scale: 2 }),
  minTotalPriceUsd: numeric("min_total_price_usd", { precision: 14, scale: 2 }),

  // Условия оплаты
  hasInstallment: boolean("has_installment").default(true).notNull(), // Беспроцентная рассрочка
  installmentMonths: integer("installment_months"), // Срок рассрочки (в месяцах)
  installmentDownPaymentPercent: integer("installment_down_payment_percent").default(30), // Первый взнос %
  hasMortgage: boolean("has_mortgage").default(false).notNull(), // Возможность ипотеки

  // Инфраструктура и удобства
  hasUndergroundParking: boolean("has_underground_parking").default(false).notNull(),
  hasElevator: boolean("has_elevator").default(true).notNull(),
  hasPlayground: boolean("has_playground").default(true).notNull(),
  hasSecurity: boolean("has_security").default(true).notNull(),
  hasAutonomousHeating: boolean("has_autonomous_heating").default(true).notNull(),
  amenities: jsonb("amenities").$type<string[]>().default([]), // ["Вид на Сырдарью", "Школа рядом", "Охрана 24/7"]
  amenitiesTg: jsonb("amenities_tg").$type<string[]>().default([]),

  // Модули Паркинг, Кладовые и Официальные Документы
  parkingConfig: jsonb("parking_config").$type<ProjectParkingConfig>(),
  parkingSpots: jsonb("parking_spots").$type<ParkingSpot[]>().default([]),
  storageConfig: jsonb("storage_config").$type<ProjectStorageConfig>(),
  storageUnits: jsonb("storage_units").$type<StorageUnit[]>().default([]),
  documentsConfig: jsonb("documents_config").$type<ProjectDocumentsConfig>(),
  officialDocuments: jsonb("official_documents").$type<ProjectDocument[]>().default([]),

  // Медиа
  coverImageUrl: text("cover_image_url"),
  images: jsonb("images").$type<string[]>().default([]),
  constructionProgress: jsonb("construction_progress").$type<
    { date: string; title: string; photos: string[] }[]
  >().default([]),
  documents: jsonb("documents").$type<
    { name: string; fileUrl: string }[]
  >().default([]),
  videoUrl: text("video_url"),

  // Статистика и продвижение
  viewsCount: integer("views_count").default(0).notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export interface CustomBuildingFeature {
  id: string;
  title: string;
  value: string;
}

export interface FinishingFeature {
  id: string;
  title: string;
  description: string;
}

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
