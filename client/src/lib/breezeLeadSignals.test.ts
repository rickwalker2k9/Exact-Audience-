import { describe, expect, it } from "vitest";
import { buildBreezeEngagementSignal } from "./breezeLeadSignals";

describe("Breeze engagement signal", () => {
  it("returns a stable one-through-six ad-view journey with two likelihood windows", () => {
    const first = buildBreezeEngagementSignal("Approved lead");
    const second = buildBreezeEngagementSignal("Approved lead");

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
    expect(first.researchPath).toHaveLength(3);
    expect(first.researchPath.some(step => ["MassMutual", "Ethos", "PolicyGenius"].includes(step.provider))).toBe(true);
  });

  it("creates deterministic but varied insurance-research paths across records", () => {
    const paths = ["Avery King", "Bianca Lee", "Carlos Moore", "Danielle Reed", "Elena Stone"]
      .map(name => buildBreezeEngagementSignal(name).researchPath.map(step => step.provider).join("|"));

    expect(new Set(paths).size).toBeGreaterThan(1);
  });
});
