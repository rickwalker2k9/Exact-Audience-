import { describe, expect, it } from "vitest";
import { BREEZE_AFFILIATE_TRAFFIC, BREEZE_CALCULATOR_TRAFFIC, BREEZE_TRAFFIC_DEMO } from "./breezeTrafficDemo";

describe("Breeze illustrative traffic review series", () => {
  it("uses a non-overlapping calculator-to-affiliate transition with increasing review counts", () => {
    expect(BREEZE_CALCULATOR_TRAFFIC.map(point => point.month)).toEqual(["May 2026", "June 2026"]);
    expect(BREEZE_AFFILIATE_TRAFFIC.map(point => point.month)).toEqual(["July 2026", "August 2026"]);
    expect(BREEZE_TRAFFIC_DEMO.map(point => point.hits)).toEqual([412, 686, 934, 1171]);
  });
});
