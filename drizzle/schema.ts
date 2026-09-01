import { int, mysqlEnum, mysqlTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// TODO: Add your tables here

// Persists the last CTV filter state per voter contact so the panel remembers
// which networks were targeted when the user re-opens the drawer.
export const voterCtvPrefs = mysqlTable("voter_ctv_prefs", {
  id: int("id").autoincrement().primaryKey(),
  /** Stable voter identifier — first+last+county slug e.g. "john-doe-henry" */
  voterKey: varchar("voterKey", { length: 128 }).notNull().unique(),
  /** Comma-separated list of selected network IDs in the bundle */
  bundleNetworkIds: text("bundleNetworkIds"),
  /** The single "primary" selected platform */
  primaryPlatform: varchar("primaryPlatform", { length: 64 }),
  /** Active filter dimensions (JSON-serialised) */
  filtersJson: text("filtersJson"),
  /** Last preset applied */
  lastPreset: varchar("lastPreset", { length: 64 }),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type VoterCtvPrefs = typeof voterCtvPrefs.$inferSelect;
export type InsertVoterCtvPrefs = typeof voterCtvPrefs.$inferInsert;

// Stores only a deterministic contact key plus staff-entered funnel events.
// Individual contact details remain in the approved Google Sheet and are not copied into the database.
export const breezeLeadProgress = mysqlTable("breeze_lead_progress", {
  id: int("id").autoincrement().primaryKey(),
  contactKey: varchar("contactKey", { length: 128 }).notNull().unique(),
  stage: varchar("stage", { length: 32 }).notNull().default("approved"),
  websiteVisitedAt: timestamp("websiteVisitedAt"),
  formStartedAt: timestamp("formStartedAt"),
  formCompletedAt: timestamp("formCompletedAt"),
  updatedByOpenId: varchar("updatedByOpenId", { length: 64 }).notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BreezeLeadProgress = typeof breezeLeadProgress.$inferSelect;
export type InsertBreezeLeadProgress = typeof breezeLeadProgress.$inferInsert;

// Stores metadata only for staff-uploaded source spreadsheets; file bytes live in secure object storage.
export const breezeImportSources = mysqlTable("breeze_import_sources", {
  id: int("id").autoincrement().primaryKey(),
  ownerOpenId: varchar("ownerOpenId", { length: 64 }).notNull(),
  sourceLabel: varchar("sourceLabel", { length: 255 }).notNull(),
  storageKey: text("storageKey").notNull(),
  mappingJson: text("mappingJson").notNull(),
  approvedRecordCount: int("approvedRecordCount").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type BreezeImportSource = typeof breezeImportSources.$inferSelect;

// Stores staff-managed tracking-pixel configuration and supported events.
// Raw import files remain in secure object storage, rather than database columns.
export const breezePixelConfigurations = mysqlTable("breeze_pixel_configurations", {
  id: int("id").autoincrement().primaryKey(),
  platform: varchar("platform", { length: 80 }).notNull(),
  pixelId: varchar("pixelId", { length: 160 }).notNull(),
  status: varchar("status", { length: 24 }).notNull().default("needs-review"),
  eventNamesJson: text("eventNamesJson").notNull(),
  sourceLabel: varchar("sourceLabel", { length: 255 }).notNull(),
  updatedByOpenId: varchar("updatedByOpenId", { length: 64 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => [uniqueIndex("breeze_pixel_platform_id_unique").on(table.platform, table.pixelId)]);

export type BreezePixelConfiguration = typeof breezePixelConfigurations.$inferSelect;

// Persisted source-specific records used by the Breeze operating portal.
// The source file remains in controlled intake; this table only stores the
// selected presentation fields required for the owner-requested source views.
export const breezeSourceRecords = mysqlTable("breeze_source_records", {
  id: int("id").autoincrement().primaryKey(),
  source: varchar("source", { length: 32 }).notNull(),
  recordKey: varchar("recordKey", { length: 64 }).notNull(),
  firstName: varchar("firstName", { length: 100 }).notNull(),
  lastName: varchar("lastName", { length: 100 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 64 }).notNull(),
  ageRange: varchar("ageRange", { length: 64 }).notNull(),
  incomeRange: varchar("incomeRange", { length: 64 }).notNull(),
  children: varchar("children", { length: 64 }).notNull().default(""),
  homeowner: varchar("homeowner", { length: 64 }).notNull().default(""),
  gender: varchar("gender", { length: 32 }).notNull().default(""),
  city: varchar("city", { length: 120 }).notNull(),
  state: varchar("state", { length: 32 }).notNull(),
  zip: varchar("zip", { length: 16 }).notNull().default(""),
  sourceLabel: varchar("sourceLabel", { length: 255 }).notNull(),
  recordOrdinal: int("recordOrdinal").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => [uniqueIndex("breeze_source_record_unique").on(table.source, table.recordKey)]);

export type BreezeSourceRecord = typeof breezeSourceRecords.$inferSelect;

export const breezeDailyLeadLists = mysqlTable("breeze_daily_lead_lists", {
  id: int("id").autoincrement().primaryKey(),
  listDate: timestamp("listDate").notNull(),
  releaseCount: int("releaseCount").notNull(),
  importedRecordCount: int("importedRecordCount").notNull(),
  sourceLastSyncedAt: timestamp("sourceLastSyncedAt").notNull(),
  sourceLabel: varchar("sourceLabel", { length: 255 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => [uniqueIndex("breeze_daily_lead_list_date_unique").on(table.listDate)]);

export type BreezeDailyLeadList = typeof breezeDailyLeadLists.$inferSelect;

// Each approved lead is added once to the Upcoming Leads queue and is marked
// released only when assigned to the 90-person Current Lead List.
export const breezeUpcomingLeads = mysqlTable("breeze_upcoming_leads", {
  id: int("id").autoincrement().primaryKey(),
  recordKey: varchar("recordKey", { length: 64 }).notNull(),
  leadListId: int("leadListId").notNull(),
  queuePosition: int("queuePosition").notNull(),
  addedAt: timestamp("addedAt").notNull(),
  releasedAt: timestamp("releasedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => [
  uniqueIndex("breeze_upcoming_lead_record_unique").on(table.recordKey),
  uniqueIndex("breeze_upcoming_lead_position_unique").on(table.queuePosition),
]);

export type BreezeUpcomingLead = typeof breezeUpcomingLeads.$inferSelect;

// Exactly 90 active slots. Fifteen slots are refreshed daily to complete one
// full Current Lead List turnover across six daily releases.
export const breezeCurrentLeadList = mysqlTable("breeze_current_lead_list", {
  id: int("id").autoincrement().primaryKey(),
  slotNumber: int("slotNumber").notNull(),
  recordKey: varchar("recordKey", { length: 64 }).notNull(),
  sourceLeadListId: int("sourceLeadListId").notNull(),
  assignedAt: timestamp("assignedAt").notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => [
  uniqueIndex("breeze_current_lead_slot_unique").on(table.slotNumber),
  uniqueIndex("breeze_current_lead_record_unique").on(table.recordKey),
]);

export type BreezeCurrentLead = typeof breezeCurrentLeadList.$inferSelect;

// Server-managed sessions for the isolated Breeze client portal. The raw browser
// token is never persisted; only a SHA-256 hash is retained for validation and
// owner-only access reporting.
export const breezeClientSessions = mysqlTable("breeze_client_sessions", {
  id: int("id").autoincrement().primaryKey(),
  sessionHash: varchar("sessionHash", { length: 64 }).notNull().unique(),
  loginName: varchar("loginName", { length: 120 }).notNull(),
  acknowledgedAt: timestamp("acknowledgedAt").notNull(),
  loggedInAt: timestamp("loggedInAt").defaultNow().notNull(),
  lastSeenAt: timestamp("lastSeenAt").defaultNow().notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  closedAt: timestamp("closedAt"),
});

export type BreezeClientSession = typeof breezeClientSessions.$inferSelect;
