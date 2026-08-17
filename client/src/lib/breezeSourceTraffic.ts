import { relabelSeriesToCurrentDate } from "./liveDateSeries";

const BREEZE_SOURCE_TRAFFIC_VALUES = [
  { day: "", google: 46, meta: 31, email: 9 },
  { day: "", google: 52, meta: 34, email: 11 },
  { day: "", google: 48, meta: 38, email: 10 },
  { day: "", google: 61, meta: 42, email: 14 },
  { day: "", google: 57, meta: 47, email: 13 },
  { day: "", google: 66, meta: 45, email: 16 },
  { day: "", google: 71, meta: 54, email: 18 },
  { day: "", google: 76, meta: 59, email: 17 },
];

export function getBreezeSourceTraffic(currentDate = new Date()) {
  return relabelSeriesToCurrentDate(BREEZE_SOURCE_TRAFFIC_VALUES, currentDate);
}

export const BREEZE_SOURCE_TRAFFIC = getBreezeSourceTraffic();

export const BREEZE_SOURCE_TOTALS = BREEZE_SOURCE_TRAFFIC_VALUES.reduce(
  (totals, day) => ({
    google: totals.google + day.google,
    meta: totals.meta + day.meta,
    email: totals.email + day.email,
  }),
  { google: 0, meta: 0, email: 0 },
);
