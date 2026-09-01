import { parse } from "csv-parse/sync";
import { asc, eq, isNull, sql } from "drizzle-orm";
import { breezeCurrentLeadList, breezeDailyLeadLists, breezeSourceRecords, breezeUpcomingLeads } from "../drizzle/schema";
import { getDb, upsertBreezeSourceRecords } from "./db";
import { createBreezeSourceRecordKey, type BreezeRecordSource } from "./breezeSourceRecords";

const DAY_MS = 86_400_000;
const CURRENT_LEAD_LIST_SIZE = 90;
const DAILY_NEW_LEAD_MIN = 57;
const DAILY_NEW_LEAD_MAX = 112;
const DAILY_SLOT_REFRESH_COUNT = 15;
const APPROVED_SOURCE: BreezeRecordSource = "breeze-approved-sheet";
const APPROVED_SOURCE_LABEL = "Approved Breeze Google Sheet";
const APPROVED_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/1HTgGrePJqi9GHajtBoWuYhNlJEPvOS8_AHrX4wo76LA/gviz/tq?tqx=out:csv&gid=0";

type ApprovedLead = {
  firstName: string; lastName: string; phone: string; email: string; ageRange: string; children: string; homeowner: string; incomeRange: string; gender: string; city: string; state: string; zip: string;
};

function utcDay(date: Date) { return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())); }
function clean(value: unknown, label: string) { return String(value ?? "").replace(new RegExp(`^\\s*${label.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}\\s*[:\\-]?\\s*`, "i"), "").trim(); }
function mapApprovedLead(row: string[]): ApprovedLead | null {
  const lead = {
    firstName: clean(row[0], "First Name"), lastName: clean(row[1], "Last Name"), phone: clean(row[2], "Skiptrace Wireless Numbers"), email: clean(row[3], "Personal Verified Emails"), ageRange: clean(row[4], "Age Range"), children: clean(row[5], "Children"), homeowner: clean(row[6], "Homeowner"), incomeRange: clean(row[7], "Income Range"), gender: clean(row[8], "Gender"), city: clean(row[10], "Personal City"), state: clean(row[11], "Personal State").toUpperCase(), zip: clean(row[12], "Personal ZIP"),
  };
  return lead.firstName && lead.lastName ? lead : null;
}

export function getBreezeDailyNewLeadCount(date: Date) {
  const hash = Array.from(utcDay(date).toISOString().slice(0, 10)).reduce((value, character) => (value * 31 + character.charCodeAt(0)) >>> 0, 17);
  return DAILY_NEW_LEAD_MIN + (hash % (DAILY_NEW_LEAD_MAX - DAILY_NEW_LEAD_MIN + 1));
}

export function getBreezeDailySlotNumbers(date: Date) {
  const dayIndex = Math.floor(utcDay(date).getTime() / DAY_MS) % 6;
  return Array.from({ length: DAILY_SLOT_REFRESH_COUNT }, (_, index) => dayIndex * DAILY_SLOT_REFRESH_COUNT + index + 1);
}

async function importApprovedLeads() {
  const response = await fetch(APPROVED_SHEET_CSV_URL, { signal: AbortSignal.timeout(90_000) });
  if (!response.ok) throw new Error(`Approved Breeze Sheet import failed (${response.status})`);
  const rows = parse(await response.text(), { relax_column_count: true, skip_empty_lines: true, trim: false }) as string[][];
  const records = rows.map(mapApprovedLead).filter((lead): lead is ApprovedLead => Boolean(lead)).map((lead, index) => ({
    ...lead,
    source: APPROVED_SOURCE,
    sourceLabel: APPROVED_SOURCE_LABEL,
    recordOrdinal: index + 1,
    recordKey: createBreezeSourceRecordKey({ ...lead, source: APPROVED_SOURCE, recordOrdinal: index + 1 }),
  }));
  for (let index = 0; index < records.length; index += 250) await upsertBreezeSourceRecords(records.slice(index, index + 250));
  return { count: records.length, syncedAt: new Date() };
}

export async function refreshBreezeDailyLeadList(now = new Date()) {
  const db = await getDb();
  if (!db) throw new Error("Breeze lead-list storage is unavailable");
  const imported = await importApprovedLeads();
  const listDate = utcDay(now);
  const [existing] = await db.select().from(breezeDailyLeadLists).where(eq(breezeDailyLeadLists.listDate, listDate)).limit(1);
  const [currentCount] = await db.select({ count: sql<number>`count(*)` }).from(breezeCurrentLeadList);
  const releaseCount = Number(currentCount?.count ?? 0) === 0 ? CURRENT_LEAD_LIST_SIZE : getBreezeDailyNewLeadCount(listDate);
  let dailyList = existing;
  if (!dailyList) {
    await db.insert(breezeDailyLeadLists).values({ listDate, releaseCount, importedRecordCount: imported.count, sourceLastSyncedAt: imported.syncedAt, sourceLabel: APPROVED_SOURCE_LABEL });
    [dailyList] = await db.select().from(breezeDailyLeadLists).where(eq(breezeDailyLeadLists.listDate, listDate)).limit(1);
  }
  if (!dailyList) throw new Error("Breeze daily lead list could not be created");
  const [alreadyQueued] = await db.select({ count: sql<number>`count(*)` }).from(breezeUpcomingLeads).where(eq(breezeUpcomingLeads.leadListId, dailyList.id));
  if (Number(alreadyQueued?.count ?? 0) === 0) {
    const queued = await db.select({ recordKey: breezeUpcomingLeads.recordKey }).from(breezeUpcomingLeads);
    const queuedKeys = new Set(queued.map(row => row.recordKey));
    const candidates = (await db.select().from(breezeSourceRecords).where(eq(breezeSourceRecords.source, APPROVED_SOURCE)).orderBy(asc(breezeSourceRecords.recordOrdinal))).filter(row => !queuedKeys.has(row.recordKey)).slice(0, dailyList.releaseCount);
    const [lastPosition] = await db.select({ value: sql<number>`coalesce(max(${breezeUpcomingLeads.queuePosition}), 0)` }).from(breezeUpcomingLeads);
    if (candidates.length) await db.insert(breezeUpcomingLeads).values(candidates.map((record, index) => ({ recordKey: record.recordKey, leadListId: dailyList.id, queuePosition: Number(lastPosition?.value ?? 0) + index + 1, addedAt: listDate })));
  }
  const roster = await db.select().from(breezeCurrentLeadList);
  const slots = roster.length === 0 ? Array.from({ length: CURRENT_LEAD_LIST_SIZE }, (_, index) => index + 1) : getBreezeDailySlotNumbers(listDate);
  const nextLeads = await db.select().from(breezeUpcomingLeads).where(isNull(breezeUpcomingLeads.releasedAt)).orderBy(asc(breezeUpcomingLeads.queuePosition)).limit(slots.length);
  for (let index = 0; index < nextLeads.length; index += 1) {
    const nextLead = nextLeads[index];
    await db.insert(breezeCurrentLeadList).values({ slotNumber: slots[index], recordKey: nextLead.recordKey, sourceLeadListId: nextLead.leadListId, assignedAt: listDate }).onDuplicateKeyUpdate({ set: { recordKey: nextLead.recordKey, sourceLeadListId: nextLead.leadListId, assignedAt: listDate } });
    await db.update(breezeUpcomingLeads).set({ releasedAt: listDate }).where(eq(breezeUpcomingLeads.id, nextLead.id));
  }
  return { listDate, releaseCount: dailyList.releaseCount, importedRecordCount: imported.count, visibleSlotsRefreshed: nextLeads.length };
}
