import { describe, expect, it } from "vitest";
import {
  EXACT_AUDIENCE_DEMO_TOTAL,
  EXACT_AUDIENCE_EMAIL_SENT_COUNT,
  EXACT_AUDIENCE_GOOGLE_AD_SEEN_COUNT,
  EXACT_AUDIENCE_META_AD_SEEN_COUNT,
  getExactAudienceDemoActivity,
} from "./breezeExactAudienceActivity";

describe("Exact Audience illustrative activity", () => {
  it("keeps stable demo signals at the requested Google, Meta, and email volumes", () => {
    const signals = Array.from({ length: EXACT_AUDIENCE_DEMO_TOTAL }, (_, index) => getExactAudienceDemoActivity(index + 1));
    expect(signals.filter(signal => signal.googleAdSeen)).toHaveLength(EXACT_AUDIENCE_GOOGLE_AD_SEEN_COUNT);
    expect(signals.filter(signal => signal.metaAdSeen)).toHaveLength(EXACT_AUDIENCE_META_AD_SEEN_COUNT);
    expect(signals.filter(signal => signal.emailStatus !== "Pending")).toHaveLength(EXACT_AUDIENCE_EMAIL_SENT_COUNT);
    expect(getExactAudienceDemoActivity(77)).toEqual(getExactAudienceDemoActivity(77));
  });

  it("allows Google and Meta activity to overlap for the same Exact Audience record", () => {
    const signals = Array.from({ length: EXACT_AUDIENCE_DEMO_TOTAL }, (_, index) => getExactAudienceDemoActivity(index + 1));
    expect(signals.some(signal => signal.googleAdSeen && signal.metaAdSeen)).toBe(true);
  });

  it("emphasizes opened and clicked Email Outreach states within the sent activity set", () => {
    const signals = Array.from({ length: EXACT_AUDIENCE_DEMO_TOTAL }, (_, index) => getExactAudienceDemoActivity(index + 1));
    const engaged = signals.filter(signal => signal.emailStatus === "Opened" || signal.emailStatus === "Clicked");
    expect(engaged).toHaveLength(224);
    expect(engaged.length / EXACT_AUDIENCE_EMAIL_SENT_COUNT).toBeGreaterThan(0.85);
  });
});
