import { describe, expect, it } from "vitest";
import { buildFunnelCounts, getBreezeContactKey, mapApprovedCsv, toLeadSummary } from "./breezeSheet";

const headers = "FIRST NAME,LAST NAME,CITY,ST,PERS V EMAILS,ZB Status,ZB SMTP Provider,ZB Last Known Activity";

describe("Breeze approved lead import", () => {
  it("imports only valid records when the approved schema is present", () => {
    const result = mapApprovedCsv(`${headers}\nAda,Stone,Austin,TX,ada@example.com,valid,google,2026-08-15\nBlocked,Lead,Austin,TX,blocked@example.com,invalid,google,`, "valid-gold");
    expect(result.schemaReady).toBe(true);
    expect(result.leads).toHaveLength(1);
    expect(result.leads[0]).toMatchObject({ firstName: "Ada", tier: "valid-gold", status: "valid" });
  });

  it("refuses a tab with no reviewed header row", () => {
    const result = mapApprovedCsv("Ada,Stone,Austin,TX,ada@example.com,valid", "valid");
    expect(result.schemaReady).toBe(false);
    expect(result.leads).toEqual([]);
    expect(result.reason).toContain("Header row required");
  });

  it("returns aggregate-only data for the public portal summary", () => {
    const importResult = mapApprovedCsv(`${headers}\nAda,Stone,Austin,TX,ada@example.com,valid,google,2026-08-15`, "valid-gold");
    const summary = toLeadSummary({ valid: { leads: [], schemaReady: false, reason: "Header row required" }, validGold: importResult, refreshedAt: "2026-08-16T00:00:00.000Z" });
    expect(JSON.stringify(summary)).not.toContain("ada@example.com");
    expect(summary.validGold.count).toBe(1);
  });

  it("uses a stable non-email contact key and cumulative real funnel counts", () => {
    const contactKey = getBreezeContactKey({ email: "ada@example.com" });
    expect(contactKey).toHaveLength(64);
    expect(contactKey).not.toContain("ada@example.com");
    expect(buildFunnelCounts(["approved", "visited", "form-completed"])).toEqual({
      approved: 3,
      activated: 2,
      visited: 2,
      "form-started": 1,
      "form-completed": 1,
    });
  });
});
