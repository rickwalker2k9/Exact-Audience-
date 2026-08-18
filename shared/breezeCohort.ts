export const BREEZE_TOTAL_EXACT_AUDIENCE_RECORDS = 2_696;
export const BREEZE_INITIAL_ACTIVE_COHORT = 927;
export const BREEZE_DAILY_RELEASE_BATCH = 30;

// The approved August 7 cohort remains the opening roster. Newly released
// approved records begin appearing after the first configured midnight run.
export const BREEZE_DAILY_RELEASE_START_UTC = Date.UTC(2026, 7, 19, 7, 1);

const DAY_MS = 24 * 60 * 60 * 1000;

export function getBreezeActiveCohortCount(now = new Date()) {
  const elapsedDays = Math.max(0, Math.floor((now.getTime() - BREEZE_DAILY_RELEASE_START_UTC) / DAY_MS));
  return Math.min(BREEZE_TOTAL_EXACT_AUDIENCE_RECORDS, BREEZE_INITIAL_ACTIVE_COHORT + elapsedDays * BREEZE_DAILY_RELEASE_BATCH);
}

export function getBreezeCohortStatus(now = new Date()) {
  const activeCount = getBreezeActiveCohortCount(now);
  const nextReleaseAt = activeCount >= BREEZE_TOTAL_EXACT_AUDIENCE_RECORDS
    ? null
    : new Date(BREEZE_DAILY_RELEASE_START_UTC + Math.max(0, Math.ceil((now.getTime() - BREEZE_DAILY_RELEASE_START_UTC) / DAY_MS)) * DAY_MS);

  return {
    activeCount,
    totalCount: BREEZE_TOTAL_EXACT_AUDIENCE_RECORDS,
    dailyReleaseBatch: BREEZE_DAILY_RELEASE_BATCH,
    nextReleaseAt,
  };
}
