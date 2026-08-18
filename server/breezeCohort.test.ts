import { describe, expect, it } from "vitest";
import {
  BREEZE_DAILY_RELEASE_BATCH,
  BREEZE_DAILY_RELEASE_START_UTC,
  BREEZE_INITIAL_ACTIVE_COHORT,
  BREEZE_TOTAL_EXACT_AUDIENCE_RECORDS,
  getBreezeActiveCohortCount,
} from "@shared/breezeCohort";

describe("Breeze active cohort", () => {
  it("starts with the first approved 927-contact cohort before the daily release time", () => {
    expect(getBreezeActiveCohortCount(new Date(BREEZE_DAILY_RELEASE_START_UTC - 1))).toBe(BREEZE_INITIAL_ACTIVE_COHORT);
  });

  it("adds one small approved batch per full day and caps at the approved source total", () => {
    expect(getBreezeActiveCohortCount(new Date(BREEZE_DAILY_RELEASE_START_UTC + 24 * 60 * 60 * 1000))).toBe(BREEZE_INITIAL_ACTIVE_COHORT + BREEZE_DAILY_RELEASE_BATCH);
    expect(getBreezeActiveCohortCount(new Date(BREEZE_DAILY_RELEASE_START_UTC + 365 * 24 * 60 * 60 * 1000))).toBe(BREEZE_TOTAL_EXACT_AUDIENCE_RECORDS);
  });
});
