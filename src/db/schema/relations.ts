import { relations } from "drizzle-orm";
import { users, sessions, accounts } from "./auth";
import { developers, developerMembers } from "./developers";
import { projects } from "./projects";
import { units } from "./units";
import { classifieds } from "./classifieds";
import { favorites } from "./favorites";
import { classifiedAnalytics } from "./analytics";
import { apiKeys } from "./api-keys";
import { crmLeads, crmCollections } from "./crm";
import { adAdvertisers, adCampaigns, adCreatives } from "./ads";

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  accounts: many(accounts),
  classifieds: many(classifieds),
  developerMembers: many(developerMembers),
  createdDevelopers: many(developers),
  favorites: many(favorites),
  apiKeys: many(apiKeys),
}));


export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const developersRelations = relations(developers, ({ one, many }) => ({
  creator: one(users, {
    fields: [developers.createdById],
    references: [users.id],
  }),
  members: many(developerMembers),
  projects: many(projects),
}));

export const developerMembersRelations = relations(developerMembers, ({ one }) => ({
  developer: one(developers, {
    fields: [developerMembers.developerId],
    references: [developers.id],
  }),
  user: one(users, {
    fields: [developerMembers.userId],
    references: [users.id],
  }),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  developer: one(developers, {
    fields: [projects.developerId],
    references: [developers.id],
  }),
  units: many(units),
  favorites: many(favorites),
}));

export const unitsRelations = relations(units, ({ one }) => ({
  project: one(projects, {
    fields: [units.projectId],
    references: [projects.id],
  }),
}));

export const classifiedsRelations = relations(classifieds, ({ one, many }) => ({
  user: one(users, {
    fields: [classifieds.userId],
    references: [users.id],
  }),
  favorites: many(favorites),
  analytics: many(classifiedAnalytics),
}));

export const classifiedAnalyticsRelations = relations(classifiedAnalytics, ({ one }) => ({
  classified: one(classifieds, {
    fields: [classifiedAnalytics.classifiedId],
    references: [classifieds.id],
  }),
}));

export const apiKeysRelations = relations(apiKeys, ({ one }) => ({
  user: one(users, {
    fields: [apiKeys.userId],
    references: [users.id],
  }),
}));

export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(users, {
    fields: [favorites.userId],
    references: [users.id],
  }),
  project: one(projects, {
    fields: [favorites.projectId],
    references: [projects.id],
  }),
  classified: one(classifieds, {
    fields: [favorites.classifiedId],
    references: [classifieds.id],
  }),
}));

export const crmLeadsRelations = relations(crmLeads, ({ one }) => ({
  classified: one(classifieds, {
    fields: [crmLeads.classifiedId],
    references: [classifieds.id],
  }),
}));

export const adAdvertisersRelations = relations(adAdvertisers, ({ one, many }) => ({
  user: one(users, {
    fields: [adAdvertisers.userId],
    references: [users.id],
  }),
  campaigns: many(adCampaigns),
}));

export const adCampaignsRelations = relations(adCampaigns, ({ one, many }) => ({
  advertiser: one(adAdvertisers, {
    fields: [adCampaigns.advertiserId],
    references: [adAdvertisers.id],
  }),
  creatives: many(adCreatives),
}));

export const adCreativesRelations = relations(adCreatives, ({ one }) => ({
  campaign: one(adCampaigns, {
    fields: [adCreatives.campaignId],
    references: [adCampaigns.id],
  }),
}));


