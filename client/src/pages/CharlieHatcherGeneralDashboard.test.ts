import { describe, expect, it } from "vitest";
import { ELECTION_DATE, formatCurrentDate, MEDIA_PLANS, millisecondsUntilNextLocalDay } from "./CharlieHatcherGeneralDashboard";

describe("Charlie Hatcher general-election dashboard", () => {
  it("targets the November 3, 2026 general election", () => {
    expect(ELECTION_DATE.toISOString()).toBe("2026-11-03T06:00:00.000Z");
  });

  it("keeps every displayed media scenario internally reconciled", () => {
    for (const plan of MEDIA_PLANS) {
      const allocationTotal = plan.allocation.reduce((sum, [, budget]) => sum + budget, 0);
      expect(allocationTotal).toBe(plan.total);
    }
  });

  it("includes the disciplined $240,000 general-election scenario", () => {
    expect(MEDIA_PLANS.find(plan => plan.total === 240000)?.name).toBe("Disciplined general plan");
  });

  it("rolls the visible update date at the next local midnight", () => {
    const lateNight = new Date(2026, 7, 15, 23, 59, 59, 500);
    expect(millisecondsUntilNextLocalDay(lateNight)).toBe(1500);
    expect(formatCurrentDate(new Date(2026, 7, 15))).not.toBe(formatCurrentDate(new Date(2026, 7, 16)));
  });
});
