import { describe, expect, it } from "vitest";
import { BREEZE_SOURCE_TOTALS, getBreezeSourceTraffic } from "./breezeSourceTraffic";

describe("Breeze daily source traffic demo", () => {
  it("uses a rolling eight-day date series ending on the current local date while preserving source values", () => {
    const series = getBreezeSourceTraffic(new Date(2026, 7, 17));
    expect(series[0].day).toBe("Aug 10");
    expect(series.at(-1)?.day).toBe("Aug 17");
    expect(series).toHaveLength(8);
    expect(series.every(day => day.google > 0 && day.meta > 0 && day.email > 0)).toBe(true);
    expect(BREEZE_SOURCE_TOTALS.google).toBeGreaterThan(BREEZE_SOURCE_TOTALS.meta);
  });
});
