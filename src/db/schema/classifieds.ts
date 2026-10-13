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
  dealTypeEnum,
  propertyTypeEnum,
  classifiedStatusEnum,
  currencyEnum,
} from "./enums";
import { users } from "./auth";

export const classifieds = pgTable("classifieds", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),

  dealType: dealTypeEnum("deal_type").default("sale").notNull(),
  propertyType: propertyTypeEnum("property_type").default("apartment").notNull(),
  status: classifiedStatusEnum("status").default("active").notNull(),

  // Локация в Согдийской области
  city: sogdCityEnum("city").default("khujand").notNull(),
  district: text("district"), // Микрорайон, махалля или джамоат (напр. "Махалля Раззок", "19 мкр", "Унчи")
  address: text("address").notNull(),
  landmark: text("landmark"), // Например "Около рынка Панчшанбе"
  latitude: numeric("latitude", { precision: 10, scale: 7 }),
  longitude: numeric("longitude", { precision: 10, scale: 7 }),

  // Параметры объекта
  roomsCount: integer("rooms_count"), // Для квартир и домов
  totalArea: numeric("total_area", { precision: 7, scale: 2 }).notNull(), // Общая площадь в м²
  livingArea: numeric("living_area", { precision: 7, scale: 2 }),
  kitchenArea: numeric("kitchen_area", { precision: 7, scale: 2 }),
  landAreaSotka: numeric("land_area_sotka", { precision: 6, scale: 2 }), // Площадь участка в сотках (для домов/участков)

  floor: integer("floor"),
  floorsCount: integer("floors_count"), // Всего этажей в доме
  buildingType: text("building_type"), // Кирпичный, монолитный, панельный, хавли
  renovation: text("renovation"), // "Евроремонт", "Косметический", "Коробка", "Требует ремонта"

  // Коммуникации (актуально для Согдийской области)
  hasCityWater: boolean("has_city_water").default(true).notNull(), // Постоянный водопровод
  hasWaterHauz: boolean("has_water_hauz").default(false).notNull(), // Хауз / накопитель воды
  hasElectricity: boolean("has_electricity").default(true).notNull(), // Электричество / 3-фазы
  hasHeating: boolean("has_heating").default(false).notNull(), // Отопление (автономное/городское)
  hasSewerage: boolean("has_sewerage").default(true).notNull(), // Канализация / септик
  isFurnished: boolean("is_furnished").default(false).notNull(), // С мебелью и техникой

  // Цены и валюта
  originalCurrency: currencyEnum("original_currency").default("USD").notNull(),
  priceTjs: numeric("price_tjs", { precision: 14, scale: 2 }).notNull(),
  priceUsd: numeric("price_usd", { precision: 14, scale: 2 }).notNull(),
  isNegotiable: boolean("is_negotiable").default(false).notNull(), // Торг уместен
  exchangePossible: boolean("exchange_possible").default(false).notNull(), // Возможен обмен / бартер

  // Контактные данные
  contactName: text("contact_name").notNull(),
  contactPhone: text("contact_phone").notNull(),
  contactPhoneSecondary: text("contact_phone_secondary"),
  contactWhatsapp: text("contact_whatsapp"),
  contactTelegram: text("contact_telegram"),

  // Медиа и продвижение
  photos: jsonb("photos").$type<string[]>().default([]),
  viewsCount: integer("views_count").default(0).notNull(),
  isPromoted: boolean("is_promoted").default(false).notNull(),
  promotedUntil: timestamp("promoted_until"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Classified = typeof classifieds.$inferSelect;
export type NewClassified = typeof classifieds.$inferInsert;
