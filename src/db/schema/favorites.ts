import { pgTable, text, timestamp, unique } from "drizzle-orm/pg-core";
import { users } from "./auth";
import { projects } from "./projects";
import { classifieds } from "./classifieds";

export const favorites = pgTable(
  "favorites",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    // Может быть сохранена либо новостройка, либо частное объявление
    projectId: text("project_id").references(() => projects.id, {
      onDelete: "cascade",
    }),
    classifiedId: text("classified_id").references(() => classifieds.id, {
      onDelete: "cascade",
    }),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    unique("user_project_fav_unique").on(table.userId, table.projectId),
    unique("user_classified_fav_unique").on(table.userId, table.classifiedId),
  ]
);

export type Favorite = typeof favorites.$inferSelect;
export type NewFavorite = typeof favorites.$inferInsert;
