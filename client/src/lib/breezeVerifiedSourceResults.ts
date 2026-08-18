/**
 * Aggregate source allocation from the user-supplied reporting workbook
 * (Google Sheet 1AydQ20lsvFBgO7sdFf8c0ZddWgnYyi-anMedOJBuky0).
 * The workbook contains 350 verified records. The user confirmed that 112 are
 * attributable to Google Ads; the remaining records are attributed to Meta Ads.
 * It does not contain daily delivery, click, or landing-page-visit fields.
 */
export const BREEZE_VERIFIED_SOURCE_RESULTS = {
  totalRecords: 350,
  googleAdsRecords: 112,
  metaAdsRecords: 238,
  landingPageVisits: null,
  sourceLabel: "User-supplied source worksheet",
  reportedOn: "Aug 17, 2026",
} as const;

export const BREEZE_VERIFIED_SOURCE_TOTAL =
  BREEZE_VERIFIED_SOURCE_RESULTS.googleAdsRecords + BREEZE_VERIFIED_SOURCE_RESULTS.metaAdsRecords;

export function getBreezeVerifiedSourceShares() {
  const total = BREEZE_VERIFIED_SOURCE_RESULTS.totalRecords;
  return {
    googleAds: Math.round((BREEZE_VERIFIED_SOURCE_RESULTS.googleAdsRecords / total) * 100),
    metaAds: Math.round((BREEZE_VERIFIED_SOURCE_RESULTS.metaAdsRecords / total) * 100),
  };
}
