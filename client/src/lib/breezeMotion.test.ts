import { describe, expect, it } from "vitest";
import { breezeCounterValue } from "./breezeMotion";

describe("breezeCounterValue", () => {
  it("starts at zero, reaches the requested total, and clamps progress", () => {
    expect(breezeCounterValue(2_696, 0)).toBe(0);
    expect(breezeCounterValue(2_696, 1)).toBe(2_696);
    expect(breezeCounterValue(2_696, 2)).toBe(2_696);
    expect(breezeCounterValue(2_696, -1)).toBe(0);
  });

  it("uses a fast-starting count-up curve", () => {
    expect(breezeCounterValue(100, 0.5)).toBeGreaterThan(50);
    expect(breezeCounterValue(100, 0.5)).toBeLessThan(100);
  });
});
