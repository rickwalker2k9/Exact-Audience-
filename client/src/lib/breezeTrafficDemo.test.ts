import { describe, expect, it } from "vitest";
import { BREEZE_AFFILIATE_TRAFFIC, BREEZE_CALCULATOR_TRAFFIC, BREEZE_DESTINATION_DAILY_TRAFFIC, BREEZE_TRAFFIC_DEMO, destinationMonthlyTotal } from "./breezeTrafficDemo";

describe("Breeze illustrative traffic review series", () => {
  it("uses a non-overlapping calculator-to-affiliate transition with increasing review counts", () => {
    expect(BREEZE_CALCULATOR_TRAFFIC.map(point => point.month)).toEqual(["May 2026", "June 2026"]);
    expect(BREEZE_AFFILIATE_TRAFFIC.map(point => point.month)).toEqual(["July 2026", "August 2026"]);
    expect(BREEZE_TRAFFIC_DEMO.map(point => point.hits)).toEqual([412, 686, 934, 1171]);
  });

  it("keeps calculator traffic at zero after the July transition and preserves destination totals", () => {
    const calculator = BREEZE_DESTINATION_DAILY_TRAFFIC.calculator;
    expect(calculator.slice(-2).map(point => point.hits)).toEqual([0, 0]);
    expect(destinationMonthlyTotal("calculator")).toBe(1098);
    expect(destinationMonthlyTotal("affiliate")).toBe(2105);
  });
});
