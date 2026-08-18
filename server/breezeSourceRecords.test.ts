import { describe, expect, it } from "vitest";
import { createBreezeSourceRecordKey, displaySourceName, summarizeExactAudienceGeography } from "./breezeSourceRecords";

describe("Breeze source records", () => {
  it("creates stable source-specific record keys and source labels", () => {
    const record = { source: "exact-audience" as const, firstName: "Taylor", lastName: "Morgan", email: "taylor@example.test", phone: "555-0100", city: "Phoenix", state: "AZ", recordOrdinal: 7 };
    expect(createBreezeSourceRecordKey(record)).toBe(createBreezeSourceRecordKey(record));
    expect(createBreezeSourceRecordKey(record)).not.toBe(createBreezeSourceRecordKey({ ...record, source: "google-ads" }));
    expect(displaySourceName("exact-audience")).toBe("Exact Audience Data");
  });

  it("summarizes only valid Exact Audience city and state coverage", () => {
    const summary = summarizeExactAudienceGeography([
      { source: "exact-audience", city: "Phoenix", state: "az" },
      { source: "exact-audience", city: "Phoenix", state: "AZ" },
      { source: "exact-audience", city: "Tucson", state: "AZ" },
      { source: "exact-audience", city: "Boston", state: "MA" },
      { source: "google-ads", city: "Phoenix", state: "AZ" },
      { source: "exact-audience", city: "", state: "TX" },
    ]);

    expect(summary.totalRecords).toBe(4);
    expect(summary.states).toEqual([
      { state: "AZ", count: 3, cities: [{ city: "Phoenix", count: 2 }, { city: "Tucson", count: 1 }] },
      { state: "MA", count: 1, cities: [{ city: "Boston", count: 1 }] },
    ]);
  });
});
