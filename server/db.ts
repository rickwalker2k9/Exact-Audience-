import { and, asc, desc, eq, inArray, isNull, lte, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { BreezeClientSession, BreezeLeadProgress, BreezePixelConfiguration, BreezeSourceRecord, InsertUser, InsertVoterCtvPrefs, users, voterCtvPrefs, breezeClientSessions, breezeCurrentLeadList, breezeDailyLeadLists, breezeLeadProgress, breezeImportSources, breezePixelConfigurations, breezeSourceRecords, breezeUpcomingLeads } from "../drizzle/schema";
import { ENV } from './_core/env';
import { createBreezeSourceRecordKey, summarizeExactAudienceGeography } from "./breezeSourceRecords";
import { parseBreezeSourceSeed } from "./breezeSourceSeed";
import { storageGetSignedUrl } from "./storage";
import { getBreezeActiveCohortCount, getBreezeCohortStatus } from "@shared/breezeCohort";

let _db: ReturnType<typeof drizzle> | null = null;
let breezeSourceSeedPromise: Promise<void> | null = null;
let breezeSourceSeedRecords: Awaited<ReturnType<typeof parseBreezeSourceSeed>> | null = null;
let breezeSourceSeedLoadPromise: Promise<Awaited<ReturnType<typeof parseBreezeSourceSeed>>> | null = null;
const breezeClientSessionFallback = new Map<string, BreezeClientSession>();
const BREEZE_SOURCE_SEED_KEY = "breeze/private-source-seeds/approved-source-records_0d92955f.ndjson";
const BREEZE_SOURCE_SEED_PROXY = "https://exaudash-unrq5kjn.manus.space";

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

export async function createBreezeClientSession(input: {
  sessionHash: string;
  loginName: string;
  acknowledgedAt: Date;
  expiresAt: Date;
}) {
  const db = await getDb();
  const now = new Date();
  if (!db) {
    const session: BreezeClientSession = {
      id: breezeClientSessionFallback.size + 1,
      sessionHash: input.sessionHash,
      loginName: input.loginName,
      acknowledgedAt: input.acknowledgedAt,
      loggedInAt: now,
      lastSeenAt: now,
      expiresAt: input.expiresAt,
      closedAt: null,
    };
    breezeClientSessionFallback.set(input.sessionHash, session);
    return session;
  }
  await db.insert(breezeClientSessions).values(input);
  const [session] = await db.select().from(breezeClientSessions).where(eq(breezeClientSessions.sessionHash, input.sessionHash)).limit(1);
  if (!session) throw new Error("Breeze client session could not be created.");
  return session;
}

export async function getBreezeClientSession(sessionHash: string) {
  const db = await getDb();
  if (!db) return breezeClientSessionFallback.get(sessionHash) ?? null;
  const [session] = await db.select().from(breezeClientSessions).where(eq(breezeClientSessions.sessionHash, sessionHash)).limit(1);
  return session ?? null;
}

export async function touchBreezeClientSession(sessionHash: string, closed = false) {
  const now = new Date();
  const db = await getDb();
  if (!db) {
    const session = breezeClientSessionFallback.get(sessionHash);
    if (!session) return null;
    const next = { ...session, lastSeenAt: now, closedAt: closed ? now : session.closedAt };
    breezeClientSessionFallback.set(sessionHash, next);
    return next;
  }
  await db.update(breezeClientSessions).set({ lastSeenAt: now, ...(closed ? { closedAt: now } : {}) }).where(eq(breezeClientSessions.sessionHash, sessionHash));
  return getBreezeClientSession(sessionHash);
}

export async function getBreezeClientAccessReport(limit = 100) {
  const db = await getDb();
  if (!db) return Array.from(breezeClientSessionFallback.values()).sort((a, b) => b.loggedInAt.getTime() - a.loggedInAt.getTime()).slice(0, limit);
  return db.select().from(breezeClientSessions).orderBy(desc(breezeClientSessions.loggedInAt)).limit(limit);
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
  children?: string;
  homeowner?: string;
  gender?: string;
  city: string;
  state: string;
  zip?: string;
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
      children: sql`values(children)`,
      homeowner: sql`values(homeowner)`,
      gender: sql`values(gender)`,
      city: sql`values(city)`,
      state: sql`values(state)`,
      zip: sql`values(zip)`,
      sourceLabel: sql`values(sourceLabel)`,
      recordOrdinal: sql`values(recordOrdinal)`,
    },
  });
}

export async function getBreezeCurrentLeadList() {
  const db = await getDb();
  if (!db) return { leads: [], metadata: null };
  const leads = await db.select({
    firstName: breezeSourceRecords.firstName,
    lastName: breezeSourceRecords.lastName,
    email: breezeSourceRecords.email,
    phone: breezeSourceRecords.phone,
    ageRange: breezeSourceRecords.ageRange,
    incomeRange: breezeSourceRecords.incomeRange,
    children: breezeSourceRecords.children,
    homeowner: breezeSourceRecords.homeowner,
    gender: breezeSourceRecords.gender,
    city: breezeSourceRecords.city,
    state: breezeSourceRecords.state,
    zip: breezeSourceRecords.zip,
    recordOrdinal: breezeSourceRecords.recordOrdinal,
    assignedAt: breezeCurrentLeadList.assignedAt,
    listDate: breezeDailyLeadLists.listDate,
    releaseCount: breezeDailyLeadLists.releaseCount,
    sourceLastSyncedAt: breezeDailyLeadLists.sourceLastSyncedAt,
  }).from(breezeCurrentLeadList)
    .innerJoin(breezeSourceRecords, eq(breezeCurrentLeadList.recordKey, breezeSourceRecords.recordKey))
    .innerJoin(breezeDailyLeadLists, eq(breezeCurrentLeadList.sourceLeadListId, breezeDailyLeadLists.id))
    .orderBy(asc(breezeCurrentLeadList.slotNumber));
  const [latest] = await db.select().from(breezeDailyLeadLists).orderBy(desc(breezeDailyLeadLists.listDate)).limit(1);
  const [upcoming] = await db.select({ count: sql<number>`count(*)` }).from(breezeUpcomingLeads).where(isNull(breezeUpcomingLeads.releasedAt));
  return {
    leads,
    metadata: latest ? {
      listDate: latest.listDate,
      releaseCount: latest.releaseCount,
      sourceLastSyncedAt: latest.sourceLastSyncedAt,
      upcomingLeadCount: Number(upcoming?.count ?? 0),
    } : null,
  };
}

async function loadBreezeSourceSeedRecords() {
  if (breezeSourceSeedRecords) return breezeSourceSeedRecords;
  if (!breezeSourceSeedLoadPromise) {
    breezeSourceSeedLoadPromise = (async () => {
      let response: Response;
      try {
        const signedUrl = await storageGetSignedUrl(BREEZE_SOURCE_SEED_KEY);
        response = await fetch(signedUrl);
      } catch {
        // Railway does not receive the Manus Forge credentials. The managed site
        // proxies the same private key through its existing signed storage route.
        response = await fetch(`${BREEZE_SOURCE_SEED_PROXY}/manus-storage/${BREEZE_SOURCE_SEED_KEY}`);
      }
      if (!response.ok) throw new Error(`Breeze source seed download failed (${response.status})`);
      return parseBreezeSourceSeed(await response.text());
    })().then(records => {
      breezeSourceSeedRecords = records;
      return records;
    }).finally(() => {
      breezeSourceSeedLoadPromise = null;
    });
  }
  return breezeSourceSeedLoadPromise;
}

async function seedBreezeSourceRecordsIfEmpty() {
  const db = await getDb();
  if (!db) return;
  const [existing] = await db.select({ count: sql<number>`count(*)` }).from(breezeSourceRecords);
  if (Number(existing?.count ?? 0) > 0) return;
  if (!breezeSourceSeedPromise) {
    breezeSourceSeedPromise = (async () => {
      const inputs = await loadBreezeSourceSeedRecords();
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
  const activeCohortCount = getBreezeActiveCohortCount();
  const db = await getDb();
  if (!db) {
    try {
      const seedRecords = await loadBreezeSourceSeedRecords();
      const filtered = seedRecords
        .filter(record => record.source === input.source)
        .filter(record => record.source !== "exact-audience" || record.recordOrdinal <= activeCohortCount)
        .sort((left, right) => input.source === "exact-audience" ? right.recordOrdinal - left.recordOrdinal : left.recordOrdinal - right.recordOrdinal);
      return filtered
        .slice(input.offset, input.offset + input.limit)
        .map((record, index) => ({
          id: -(input.offset + index + 1),
          ...record,
          createdAt: new Date(0),
          updatedAt: new Date(0),
        })) as BreezeSourceRecord[];
    } catch (error) {
      console.error("[Breeze] In-memory source-record seed unavailable:", error);
      return [] as BreezeSourceRecord[];
    }
  }
  try {
    await seedBreezeSourceRecordsIfEmpty();
  } catch (error) {
    console.error("[Breeze] Source-record seed unavailable:", error);
  }
  const where = input.source === "exact-audience"
    ? and(eq(breezeSourceRecords.source, input.source), lte(breezeSourceRecords.recordOrdinal, activeCohortCount))
    : eq(breezeSourceRecords.source, input.source);
  return db.select().from(breezeSourceRecords)
    .where(where)
    .orderBy(input.source === "exact-audience" ? desc(breezeSourceRecords.recordOrdinal) : asc(breezeSourceRecords.recordOrdinal))
    .limit(input.limit)
    .offset(input.offset);
}

export async function getBreezeActiveCohortStatus() {
  return getBreezeCohortStatus();
}

export async function getBreezeExactAudienceGeography() {
  const activeCohortCount = getBreezeActiveCohortCount();
  const db = await getDb();
  if (!db) {
    try {
      return summarizeExactAudienceGeography((await loadBreezeSourceSeedRecords())
        .filter(record => record.source !== "exact-audience" || record.recordOrdinal <= activeCohortCount));
    } catch (error) {
      console.error("[Breeze] In-memory geography seed unavailable:", error);
      return summarizeExactAudienceGeography([]);
    }
  }

  try {
    await seedBreezeSourceRecordsIfEmpty();
    const records = await db.select({
      source: breezeSourceRecords.source,
      city: breezeSourceRecords.city,
      state: breezeSourceRecords.state,
    }).from(breezeSourceRecords).where(and(
      eq(breezeSourceRecords.source, "exact-audience"),
      lte(breezeSourceRecords.recordOrdinal, activeCohortCount),
    ));
    return summarizeExactAudienceGeography(records);
  } catch (error) {
    console.error("[Breeze] Geographic aggregation unavailable:", error);
    return summarizeExactAudienceGeography([]);
  }
}
