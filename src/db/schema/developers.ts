import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  numeric,
} from "drizzle-orm/pg-core";
import { sogdCityEnum } from "./enums";
import { users } from "./auth";

export const developers = pgTable("developers", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  nameTg: text("name_tg"), // Номи расмӣ бо тоҷикӣ
  slug: text("slug").notNull().unique(), // URL-friendly slug (e.g. /developers/qayroqum-avenue-dev)
  logoUrl: text("logo_url"),
  coverUrl: text("cover_url"),
  description: text("description"),
  descriptionTg: text("description_tg"), // Тавсифи расмӣ бо тоҷикӣ

  // Опыт и репутация
  foundedYear: integer("founded_year"),
  completedProjectsCount: integer("completed_projects_count").default(0).notNull(),
  activeProjectsCount: integer("active_projects_count").default(0).notNull(),
  rating: numeric("rating", { precision: 3, scale: 2 }).default("5.00"),
  isVerified: boolean("is_verified").default(false).notNull(),

  // Региональная локация офиса продаж
  city: sogdCityEnum("city").default("khujand").notNull(),
  officeAddress: text("office_address"), // Например, г. Худжанд, пр. И. Сомони 45
  officeAddressTg: text("office_address_tg"), // Масалан, ш. Хуҷанд, х. И. Сомонӣ 45

  // Контакты
  phone: text("phone").notNull(),
  phoneSecondary: text("phone_secondary"),
  whatsapp: text("whatsapp"),
  telegram: text("telegram"),
  email: text("email"),
  websiteUrl: text("website_url"),

  // Привязка к владельцу/аккаунту на платформе
  createdById: text("created_by_id").references(() => users.id, {
    onDelete: "set null",
  }),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Связь сотрудников/менеджеров отдела продаж с компанией-застройщиком
export const developerMembers = pgTable("developer_members", {
  id: text("id").primaryKey(),
  developerId: text("developer_id")
    .notNull()
    .references(() => developers.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  role: text("role").default("sales_agent").notNull(), // 'owner', 'manager', 'sales_agent'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Developer = typeof developers.$inferSelect;
export type NewDeveloper = typeof developers.$inferInsert;
export type DeveloperMember = typeof developerMembers.$inferSelect;
