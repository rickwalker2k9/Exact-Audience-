import { describe, expect, it } from "vitest";
import { BREEZE_WEBSITE_SNAPSHOT, BREEZE_WEBSITE_TRAFFIC } from "./breezeWebsiteTraffic";

describe("Breeze third-party site traffic snapshot", () => {
  it("keeps the reported July estimate separate from the derived prior-month point", () => {
    expect(BREEZE_WEBSITE_TRAFFIC[1]).toMatchObject({ month: "Jul", visits: BREEZE_WEBSITE_SNAPSHOT.reportedVisits });
    expect(BREEZE_WEBSITE_TRAFFIC[0].basis).toContain("Derived");
    expect(BREEZE_WEBSITE_SNAPSHOT.monthOverMonthChange).toBe(24.19);
  });
});
