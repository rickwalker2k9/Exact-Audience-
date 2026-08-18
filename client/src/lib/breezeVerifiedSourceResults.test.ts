import { describe, expect, it } from "vitest";
import { BREEZE_VERIFIED_SOURCE_RESULTS, BREEZE_VERIFIED_SOURCE_TOTAL, getBreezeVerifiedSourceShares } from "./breezeVerifiedSourceResults";

describe("Breeze verified source allocation", () => {
  it("preserves the user-confirmed Google Ads allocation and assigns the remaining supplied records to Meta Ads", () => {
    expect(BREEZE_VERIFIED_SOURCE_RESULTS.totalRecords).toBe(350);
    expect(BREEZE_VERIFIED_SOURCE_RESULTS.googleAdsRecords).toBe(112);
    expect(BREEZE_VERIFIED_SOURCE_RESULTS.metaAdsRecords).toBe(238);
    expect(BREEZE_VERIFIED_SOURCE_TOTAL).toBe(BREEZE_VERIFIED_SOURCE_RESULTS.totalRecords);
    expect(BREEZE_VERIFIED_SOURCE_RESULTS.landingPageVisits).toBeNull();
  });

  it("returns source shares that reconcile to the verified engagement allocation", () => {
    expect(getBreezeVerifiedSourceShares()).toEqual({ googleAds: 32, metaAds: 68 });
  });
});
