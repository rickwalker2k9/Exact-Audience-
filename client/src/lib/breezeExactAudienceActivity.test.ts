import { describe, expect, it } from "vitest";
import {
  EXACT_AUDIENCE_DEMO_TOTAL,
  EXACT_AUDIENCE_EMAIL_CLICKED_COUNT,
  EXACT_AUDIENCE_EMAIL_OPENED_COUNT,
  EXACT_AUDIENCE_EMAIL_SENT_COUNT,
  EXACT_AUDIENCE_GOOGLE_AD_SEEN_COUNT,
  EXACT_AUDIENCE_META_AD_SEEN_COUNT,
  getExactAudienceDemoActivity,
} from "./breezeExactAudienceActivity";

describe("Exact Audience activity", () => {
  it("keeps stable signals at the requested Google, Meta, and active-cohort email volumes", () => {
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

  it("uses the confirmed 60% opened and 21% clicked mix across the approved 927-contact cohort", () => {
    const signals = Array.from({ length: EXACT_AUDIENCE_DEMO_TOTAL }, (_, index) => getExactAudienceDemoActivity(index + 1));
    expect(signals.filter(signal => signal.emailStatus === "Opened")).toHaveLength(EXACT_AUDIENCE_EMAIL_OPENED_COUNT);
    expect(signals.filter(signal => signal.emailStatus === "Clicked")).toHaveLength(EXACT_AUDIENCE_EMAIL_CLICKED_COUNT);
    expect((EXACT_AUDIENCE_EMAIL_OPENED_COUNT / EXACT_AUDIENCE_EMAIL_SENT_COUNT) * 100).toBeCloseTo(60, 0);
    expect((EXACT_AUDIENCE_EMAIL_CLICKED_COUNT / EXACT_AUDIENCE_EMAIL_SENT_COUNT) * 100).toBeCloseTo(21, 0);
  });
});
