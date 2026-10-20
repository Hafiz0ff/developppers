import {
  pgTable,
  text,
  timestamp,
  integer,
  boolean,
  decimal,
  jsonb,
} from "drizzle-orm/pg-core";
import { users } from "./auth";

/**
 * Advertisers (Рекламодатели и Генеральные спонсоры)
 * Examples: Банк Эсхата, Мегафон Таджикистан, Tcell, Фаровон, Сомон Сохтмон, Артель, etc.
 */
export const adAdvertisers = pgTable("ad_advertisers", {
  id: text("id").primaryKey(),
  companyName: text("company_name").notNull(),
  brandName: text("brand_name").notNull(),
  tin: text("tin"), // ИНН компании
  contactPerson: text("contact_person").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  websiteUrl: text("website_url"),
  logoUrl: text("logo_url"),

  // Сфера деятельности: bank, telecom, developer, manufacturing, retail, services
  industry: text("industry").notNull().default("other"),

  // Тип партнерства:
  // - sponsor_annual: Годовой эксклюзивный спонсорский пакет (высокий приоритет)
  // - auction_bidder: Оплата за показы/клики по аукционной ставке
  // - partner_direct: Прямой разовый контракт
  tier: text("tier").notNull().default("auction_bidder"),

  // Статус: active, paused, pending_approval, archived
  status: text("status").notNull().default("active"),

  // Финансовый баланс аккаунта
  balanceTjs: integer("balance_tjs").default(0).notNull(),
  balanceUsd: integer("balance_usd").default(0).notNull(),
  totalSpentTjs: integer("total_spent_tjs").default(0).notNull(),
  totalSpentUsd: integer("total_spent_usd").default(0).notNull(),

  // Связь с аккаунтом пользователя-представителя (если создан ЛК рекламодателя)
  userId: text("user_id").references(() => users.id, { onDelete: "set null" }),

  notes: text("notes"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Advertising Campaigns (Рекламные кампании)
 * Настройка таргетинга, бюджетов, гео, категорий и моделей оплаты.
 */
export const adCampaigns = pgTable("ad_campaigns", {
  id: text("id").primaryKey(),
  advertiserId: text("advertiser_id")
    .notNull()
    .references(() => adAdvertisers.id, { onDelete: "cascade" }),

  name: text("name").notNull(),

  // Модель монетизации:
  // - annual_sponsorship: Фиксированная годовая плата (спонсорство)
  // - auction_cpm: Аукцион по ставке за 1 000 показов (как в Яндекс Директ)
  // - auction_cpc: Аукцион по ставке за клик (переход)
  billingModel: text("billing_model").notNull().default("auction_cpm"),

  // Ставка аукциона (в сомони за 1000 показов или за клик)
  bidAmountTjs: decimal("bid_amount_tjs", { precision: 10, scale: 2 }).default("15.00").notNull(),
  bidAmountUsd: decimal("bid_amount_usd", { precision: 10, scale: 2 }).default("1.40").notNull(),

  // Бюджеты и лимиты
  totalBudgetTjs: integer("total_budget_tjs").default(0).notNull(),
  dailyLimitTjs: integer("daily_limit_tjs").default(0).notNull(), // 0 = без лимита

  // Даты кампании (для годовых контрактов: ровно 365 дней)
  startDate: timestamp("start_date").defaultNow().notNull(),
  endDate: timestamp("end_date"),

  // Таргетинг по Гео (массив городов Согда): ["all"] | ["khujand", "istaravshan", "isfara", "guliston", "buston"]
  geoTargeting: jsonb("geo_targeting").$type<string[]>().default(["all"]).notNull(),

  // Таргетинг по категориям: ["all"] | ["new_buildings", "secondary", "commercial", "houses"]
  categoryTargeting: jsonb("category_targeting").$type<string[]>().default(["all"]).notNull(),

  // Места размещения баннера: ["catalog_banner", "homepage_hero", "search_featured"]
  placementSlots: jsonb("placement_slots").$type<string[]>().default(["catalog_banner"]).notNull(),

  // Статус кампании: active, paused, completed, draft
  status: text("status").notNull().default("active"),

  // Метрики кампании
  impressionsCount: integer("impressions_count").default(0).notNull(),
  clicksCount: integer("clicks_count").default(0).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Advertising Creatives (Баннеры и рекламные материалы)
 */
export const adCreatives = pgTable("ad_creatives", {
  id: text("id").primaryKey(),
  campaignId: text("campaignId")
    .notNull()
    .references(() => adCampaigns.id, { onDelete: "cascade" }),

  titleRu: text("title_ru").notNull(),
  titleTg: text("title_tg").notNull(),
  subtitleRu: text("subtitle_ru"),
  subtitleTg: text("subtitle_tg"),

  badgeTextRu: text("badge_text_ru"),
  badgeTextTg: text("badge_text_tg"),

  ctaTextRu: text("cta_text_ru").default("Узнать больше").notNull(),
  ctaTextTg: text("cta_text_tg").default("Маълумоти бештар").notNull(),

  targetUrl: text("target_url").notNull(),
  bannerImageUrl: text("banner_image_url"),
  mobileImageUrl: text("mobile_image_url"),

  // Прямые контакты (звонок / WhatsApp при клике)
  actionType: text("action_type").default("link").notNull(), // "link" | "phone" | "whatsapp"
  phone: text("phone"),
  whatsapp: text("whatsapp"),

  // Цветовая тема карточки/баннера (для стильного отображения в каталоге)
  bgColorHex: text("bg_color_hex").default("#064e3b"),
  textColorHex: text("text_color_hex").default("#ffffff"),
  accentColorHex: text("accent_color_hex").default("#10b981"),

  isActive: boolean("is_active").default(true).notNull(),

  impressionsCount: integer("impressions_count").default(0).notNull(),
  clicksCount: integer("clicks_count").default(0).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Ad Impressions & Clicks Log (Аналитический лог показов и переходов)
 */
export const adTrackingLogs = pgTable("ad_tracking_logs", {
  id: text("id").primaryKey(),
  campaignId: text("campaign_id").notNull(),
  creativeId: text("creative_id").notNull(),
  eventType: text("event_type").notNull(), // "impression" | "click"

  city: text("city").default("khujand"),
  category: text("category").default("all"),
  slot: text("slot").default("catalog_banner"),

  userAgent: text("user_agent"),
  ipHash: text("ip_hash"), // Анонимизированный хэш IP для дедупликации

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type AdAdvertiser = typeof adAdvertisers.$inferSelect;
export type NewAdAdvertiser = typeof adAdvertisers.$inferInsert;

export type AdCampaign = typeof adCampaigns.$inferSelect;
export type NewAdCampaign = typeof adCampaigns.$inferInsert;

export type AdCreative = typeof adCreatives.$inferSelect;
export type NewAdCreative = typeof adCreatives.$inferInsert;

export type AdTrackingLog = typeof adTrackingLogs.$inferSelect;
export type NewAdTrackingLog = typeof adTrackingLogs.$inferInsert;
