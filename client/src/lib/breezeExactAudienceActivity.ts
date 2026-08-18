export type ExactAudienceEmailStatus = "Opened" | "Clicked" | "DNO" | "Pending";

export type ExactAudienceDemoActivity = {
  googleAdSeen: boolean;
  metaAdSeen: boolean;
  emailStatus: ExactAudienceEmailStatus;
};

export const EXACT_AUDIENCE_DEMO_TOTAL = 2_696;
export const EXACT_AUDIENCE_GOOGLE_AD_SEEN_COUNT = 1_914;
export const EXACT_AUDIENCE_META_AD_SEEN_COUNT = 998;
export const EXACT_AUDIENCE_EMAIL_SENT_COUNT = 248;

function distributedRank(recordOrdinal: number, multiplier: number, offset: number) {
  const normalized = Math.max(1, Math.floor(recordOrdinal));
  return ((normalized * multiplier + offset) % EXACT_AUDIENCE_DEMO_TOTAL + EXACT_AUDIENCE_DEMO_TOTAL) % EXACT_AUDIENCE_DEMO_TOTAL;
}

/**
 * Illustrative demo activity only. The deterministic distribution gives the
 * supplied Exact Audience list a stable, reviewable pattern without claiming
 * Google, Meta, or email-platform measurement.
 */
export function getExactAudienceDemoActivity(recordOrdinal: number): ExactAudienceDemoActivity {
  const googleAdSeen = distributedRank(recordOrdinal, 1367, 211) < EXACT_AUDIENCE_GOOGLE_AD_SEEN_COUNT;
  const metaAdSeen = distributedRank(recordOrdinal, 1301, 503) < EXACT_AUDIENCE_META_AD_SEEN_COUNT;
  const emailRank = distributedRank(recordOrdinal, 1723, 97);
  const emailStatus: ExactAudienceEmailStatus = emailRank >= EXACT_AUDIENCE_EMAIL_SENT_COUNT
    ? "Pending"
    : emailRank < 68
      ? "Clicked"
      : emailRank < 224
        ? "Opened"
        : "DNO";
  return { googleAdSeen, metaAdSeen, emailStatus };
}
