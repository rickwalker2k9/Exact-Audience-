export const BREEZE_SOURCE_TRAFFIC_START = "Aug 10";

export const BREEZE_SOURCE_TRAFFIC = [
  { day: "Aug 10", google: 46, meta: 31, email: 9 },
  { day: "Aug 11", google: 52, meta: 34, email: 11 },
  { day: "Aug 12", google: 48, meta: 38, email: 10 },
  { day: "Aug 13", google: 61, meta: 42, email: 14 },
  { day: "Aug 14", google: 57, meta: 47, email: 13 },
  { day: "Aug 15", google: 66, meta: 45, email: 16 },
  { day: "Aug 16", google: 71, meta: 54, email: 18 },
  { day: "Aug 17", google: 76, meta: 59, email: 17 },
];

export const BREEZE_SOURCE_TOTALS = BREEZE_SOURCE_TRAFFIC.reduce(
  (totals, day) => ({
    google: totals.google + day.google,
    meta: totals.meta + day.meta,
    email: totals.email + day.email,
  }),
  { google: 0, meta: 0, email: 0 },
);
