import { desc, eq, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { asc, sql } from "drizzle-orm";
import { BreezeLeadProgress, BreezePixelConfiguration, BreezeSourceRecord, InsertUser, InsertVoterCtvPrefs, users, voterCtvPrefs, breezeLeadProgress, breezeImportSources, breezePixelConfigurations, breezeSourceRecords } from "../drizzle/schema";
import { ENV } from './_core/env';
import { createBreezeSourceRecordKey } from "./breezeSourceRecords";
import { parseBreezeSourceSeed } from "./breezeSourceSeed";
import { storageGetSignedUrl } from "./storage";

let _db: ReturnType<typeof drizzle> | null = null;
let breezeSourceSeedPromise: Promise<void> | null = null;
const BREEZE_SOURCE_SEED_KEY = "breeze/private-source-seeds/approved-source-records_0d92955f.ndjson";

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// TODO: add feature queries here as your schema grows.

// ── Voter CTV Prefs ───────────────────────────────────────────────────────────

export async function getVoterCtvPrefs(voterKey: string) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(voterCtvPrefs).where(eq(voterCtvPrefs.voterKey, voterKey)).limit(1);
  return rows[0] ?? null;
}

export async function upsertVoterCtvPrefs(prefs: InsertVoterCtvPrefs) {
  const db = await getDb();
  if (!db) return;
  await db.insert(voterCtvPrefs).values(prefs).onDuplicateKeyUpdate({
    set: {
      bundleNetworkIds: prefs.bundleNetworkIds,
      primaryPlatform: prefs.primaryPlatform,
      filtersJson: prefs.filtersJson,
      lastPreset: prefs.lastPreset,
    },
  });
}

export async function getBreezeProgressByContactKeys(contactKeys: string[]) {
  const db = await getDb();
  if (!db || contactKeys.length === 0) return [] as BreezeLeadProgress[];
  return db.select().from(breezeLeadProgress).where(inArray(breezeLeadProgress.contactKey, contactKeys));
}

export async function upsertBreezeLeadProgress(input: {
  contactKey: string;
  stage: string;
  updatedByOpenId: string;
  websiteVisitedAt?: Date | null;
  formStartedAt?: Date | null;
  formCompletedAt?: Date | null;
}) {
  const db = await getDb();
  if (!db) throw new Error("Breeze progress storage is unavailable");
  await db.insert(breezeLeadProgress).values(input).onDuplicateKeyUpdate({
    set: {
      stage: input.stage,
      websiteVisitedAt: input.websiteVisitedAt ?? null,
      formStartedAt: input.formStartedAt ?? null,
      formCompletedAt: input.formCompletedAt ?? null,
      updatedByOpenId: input.updatedByOpenId,
    },
  });
}

export async function createBreezeImportSource(input: {
  ownerOpenId: string;
  sourceLabel: string;
  storageKey: string;
  mappingJson: string;
  approvedRecordCount: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Breeze import metadata storage is unavailable");
  await db.insert(breezeImportSources).values(input);
}

export async function getBreezePixelConfigurations() {
  const db = await getDb();
  if (!db) return [] as BreezePixelConfiguration[];
  return db.select().from(breezePixelConfigurations).orderBy(desc(breezePixelConfigurations.updatedAt));
}

export async function upsertBreezePixelConfiguration(input: {
  platform: string;
  pixelId: string;
  status: string;
  eventNamesJson: string;
  sourceLabel: string;
  updatedByOpenId: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Breeze pixel configuration storage is unavailable");
  await db.insert(breezePixelConfigurations).values(input).onDuplicateKeyUpdate({
    set: {
      status: input.status,
      eventNamesJson: input.eventNamesJson,
      sourceLabel: input.sourceLabel,
      updatedByOpenId: input.updatedByOpenId,
    },
  });
}

export async function upsertBreezeSourceRecords(records: Array<{
  source: string;
  recordKey: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  ageRange: string;
  incomeRange: string;
  city: string;
  state: string;
  sourceLabel: string;
  recordOrdinal: number;
}>) {
  const db = await getDb();
  if (!db) throw new Error("Breeze source record storage is unavailable");
  if (!records.length) return;
  await db.insert(breezeSourceRecords).values(records).onDuplicateKeyUpdate({
    set: {
      firstName: sql`values(firstName)`,
      lastName: sql`values(lastName)`,
      email: sql`values(email)`,
      phone: sql`values(phone)`,
      ageRange: sql`values(ageRange)`,
      incomeRange: sql`values(incomeRange)`,
      city: sql`values(city)`,
      state: sql`values(state)`,
      sourceLabel: sql`values(sourceLabel)`,
      recordOrdinal: sql`values(recordOrdinal)`,
    },
  });
}

async function seedBreezeSourceRecordsIfEmpty() {
  const db = await getDb();
  if (!db) return;
  const [existing] = await db.select({ count: sql<number>`count(*)` }).from(breezeSourceRecords);
  if (Number(existing?.count ?? 0) > 0) return;
  if (!breezeSourceSeedPromise) {
    breezeSourceSeedPromise = (async () => {
      const signedUrl = await storageGetSignedUrl(BREEZE_SOURCE_SEED_KEY);
      const response = await fetch(signedUrl);
      if (!response.ok) throw new Error(`Breeze source seed download failed (${response.status})`);
      const inputs = parseBreezeSourceSeed(await response.text());
      const normalized = inputs.map(record => ({ ...record, recordKey: createBreezeSourceRecordKey(record) }));
      for (let index = 0; index < normalized.length; index += 250) {
        await upsertBreezeSourceRecords(normalized.slice(index, index + 250));
      }
    })().finally(() => {
      breezeSourceSeedPromise = null;
    });
  }
  await breezeSourceSeedPromise;
}

export async function getBreezeSourceRecords(input: { source: string; limit: number; offset: number }) {
  const db = await getDb();
  if (!db) return [] as BreezeSourceRecord[];
  try {
    await seedBreezeSourceRecordsIfEmpty();
  } catch (error) {
    console.error("[Breeze] Source-record seed unavailable:", error);
  }
  return db.select().from(breezeSourceRecords)
    .where(eq(breezeSourceRecords.source, input.source))
    .orderBy(asc(breezeSourceRecords.recordOrdinal))
    .limit(input.limit)
    .offset(input.offset);
}
