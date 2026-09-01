import { describe, expect, it } from "vitest";
import { getBreezeDailyNewLeadCount, getBreezeDailySlotNumbers } from "./breezeDailyLeadList";

describe("Breeze daily Current Lead List", () => {
  it("uses a stable varied daily release count within the approved 57–112 range", () => {
    const date = new Date("2026-09-01T12:00:00.000Z");
    expect(getBreezeDailyNewLeadCount(date)).toBe(getBreezeDailyNewLeadCount(date));
    for (let offset = 0; offset < 42; offset += 1) {
      const count = getBreezeDailyNewLeadCount(new Date(Date.UTC(2026, 8, 1 + offset)));
      expect(count).toBeGreaterThanOrEqual(57);
      expect(count).toBeLessThanOrEqual(112);
    }
  });

  it("covers each of the ninety visible positions exactly once during six daily refreshes", () => {
    const positions = new Set<number>();
    for (let offset = 0; offset < 6; offset += 1) {
      getBreezeDailySlotNumbers(new Date(Date.UTC(2026, 8, 1 + offset))).forEach(position => positions.add(position));
    }
    expect([...positions].sort((left, right) => left - right)).toEqual(Array.from({ length: 90 }, (_, index) => index + 1));
  });
});
