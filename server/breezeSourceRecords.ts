import { createHash } from "node:crypto";

export const BREEZE_RECORD_SOURCES = ["google-ads", "meta-ads", "exact-audience"] as const;
export type BreezeRecordSource = (typeof BREEZE_RECORD_SOURCES)[number];

export type BreezeSourceRecordInput = {
  source: BreezeRecordSource;
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
};

export type BreezeAudienceGeography = {
  totalRecords: number;
  states: Array<{
    state: string;
    count: number;
    cities: Array<{ city: string; count: number }>;
  }>;
};

export function createBreezeSourceRecordKey(record: Pick<BreezeSourceRecordInput, "source" | "firstName" | "lastName" | "email" | "phone" | "city" | "state" | "recordOrdinal">) {
  return createHash("sha256").update([
    record.source,
    record.firstName.trim().toLowerCase(),
    record.lastName.trim().toLowerCase(),
    record.email.trim().toLowerCase(),
    record.phone.replace(/\D/g, ""),
    record.city.trim().toLowerCase(),
    record.state.trim().toLowerCase(),
    String(record.recordOrdinal),
  ].join("|")) .digest("hex");
}

export function displaySourceName(source: BreezeRecordSource) {
  return source === "google-ads" ? "Google Ads" : source === "meta-ads" ? "Meta Ads" : "Exact Audience Data";
}

export function summarizeExactAudienceGeography(records: Array<{ source: string; city: string; state: string }>): BreezeAudienceGeography {
  const states = new Map<string, Map<string, number>>();
  let totalRecords = 0;

  for (const record of records) {
    if (record.source !== "exact-audience") continue;
    const state = record.state.trim().toUpperCase();
    const city = record.city.trim();
    if (!/^[A-Z]{2}$/.test(state) || !city) continue;

    totalRecords += 1;
    const cities = states.get(state) ?? new Map<string, number>();
    cities.set(city, (cities.get(city) ?? 0) + 1);
    states.set(state, cities);
  }

  return {
    totalRecords,
    states: Array.from(states.entries())
      .map(([state, cities]) => ({
        state,
        count: Array.from(cities.values()).reduce((sum, value) => sum + value, 0),
        cities: Array.from(cities.entries())
          .map(([city, count]) => ({ city, count }))
          .sort((left, right) => right.count - left.count || left.city.localeCompare(right.city))
          .slice(0, 4),
      }))
      .sort((left, right) => right.count - left.count || left.state.localeCompare(right.state)),
  };
}
