/**
 * Public Similarweb observation captured on August 17, 2026.
 * July is the reported visit estimate. June is mathematically derived from the
 * same source's reported July +24.19% month-over-month change.
 */
export const BREEZE_WEBSITE_TRAFFIC = [
  { month: "Jun", visits: 16346, basis: "Derived from July estimate and reported month-over-month change" },
  { month: "Jul", visits: 20300, basis: "Reported Similarweb visit estimate" },
];

export const BREEZE_WEBSITE_SNAPSHOT = {
  source: "Similarweb",
  retrievedOn: "Aug 17, 2026",
  reportedVisits: 20300,
  monthOverMonthChange: 24.19,
  bounceRate: 47.24,
  pagesPerVisit: 4.28,
  averageVisitDuration: "2:38",
  organicSearchShare: 41.72,
} as const;

export function formatBreezeOperatingDate(date = new Date()) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "America/Phoenix",
  }).format(date);
}
