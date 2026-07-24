import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

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