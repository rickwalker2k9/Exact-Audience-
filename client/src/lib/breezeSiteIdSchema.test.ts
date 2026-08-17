import { describe, expect, it } from "vitest";
import { BREEZE_JOURNEY_STAGES, BREEZE_SITEID_FIELD_GROUPS } from "./breezeSiteIdSchema";

describe("Breeze SiteID visitor placeholder schema", () => {
  it("retains the supplied visitor field groups and the source-to-conversion journey", () => {
    expect(BREEZE_SITEID_FIELD_GROUPS.flatMap(group => group.fields)).toEqual(expect.arrayContaining(["Timestamp", "Referrer", "URL", "Events", "SHA256"]));
    expect(BREEZE_JOURNEY_STAGES).toHaveLength(5);
    expect(BREEZE_JOURNEY_STAGES[0]).toContain("Exact Audience");
    expect(BREEZE_JOURNEY_STAGES[3]).toContain("SiteID");
  });
});
