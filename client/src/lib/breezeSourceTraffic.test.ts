import { describe, expect, it } from "vitest";
import { BREEZE_SOURCE_TOTALS, BREEZE_SOURCE_TRAFFIC, BREEZE_SOURCE_TRAFFIC_START } from "./breezeSourceTraffic";

describe("Breeze daily source traffic demo", () => {
  it("starts on August 10 and provides daily Google, Meta, and Email values", () => {
    expect(BREEZE_SOURCE_TRAFFIC_START).toBe("Aug 10");
    expect(BREEZE_SOURCE_TRAFFIC[0].day).toBe("Aug 10");
    expect(BREEZE_SOURCE_TRAFFIC).toHaveLength(8);
    expect(BREEZE_SOURCE_TRAFFIC.every(day => day.google > 0 && day.meta > 0 && day.email > 0)).toBe(true);
    expect(BREEZE_SOURCE_TOTALS.google).toBeGreaterThan(BREEZE_SOURCE_TOTALS.meta);
  });
});
