import { describe, expect, it } from "vitest";
import { buildBreezeDemoSignal } from "./breezeLeadSignals";

describe("Breeze illustrative lead signal", () => {
  it("returns a stable one-through-six ad-view journey with two likelihood windows", () => {
    const first = buildBreezeDemoSignal("Approved demo lead");
    const second = buildBreezeDemoSignal("Approved demo lead");

    expect(first).toEqual(second);
    expect(first.views).toBeGreaterThanOrEqual(1);
    expect(first.views).toBeLessThanOrEqual(6);
    expect(first.engagedAfter).toBeLessThanOrEqual(first.views);
    expect(first.sevenDay).toBeGreaterThan(0);
    expect(first.thirtyDay).toBeGreaterThan(first.sevenDay);
    expect(first.thirtyDay).toBeLessThanOrEqual(88);
    expect(first.channels.length).toBeGreaterThanOrEqual(1);
    expect(first.channels.length).toBeLessThanOrEqual(3);
    expect(first.channels.every(channel => ["Google Ads", "Meta Ads", "Email"].includes(channel))).toBe(true);
  });
});
