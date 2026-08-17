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
