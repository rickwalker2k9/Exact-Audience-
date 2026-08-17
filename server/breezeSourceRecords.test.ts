import { describe, expect, it } from "vitest";
import { createBreezeSourceRecordKey, displaySourceName } from "./breezeSourceRecords";

describe("Breeze source records", () => {
  it("creates stable source-specific record keys and source labels", () => {
    const record = { source: "exact-audience" as const, firstName: "Taylor", lastName: "Morgan", email: "taylor@example.test", phone: "555-0100", city: "Phoenix", state: "AZ", recordOrdinal: 7 };
    expect(createBreezeSourceRecordKey(record)).toBe(createBreezeSourceRecordKey(record));
    expect(createBreezeSourceRecordKey(record)).not.toBe(createBreezeSourceRecordKey({ ...record, source: "google-ads" }));
    expect(displaySourceName("exact-audience")).toBe("Exact Audience Data");
  });
});
