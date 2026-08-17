export type BreezeDestinationKey = "calculator" | "affiliate";

export type BreezeTrafficDemoPoint = {
  month: string;
  hits: number;
  destination: "Income Protection Calculator" | "Breeze affiliate quote flow";
};

export type BreezeDailyTrafficPoint = {
  day: string;
  hits: number;
};

export const BREEZE_DESTINATIONS: Record<BreezeDestinationKey, {
  title: string;
  eyebrow: string;
  description: string;
  destinationUrl?: string;
  activePeriod: string;
  optIns: number | null;
}> = {
  calculator: {
    title: "Income Protection Tool",
    eyebrow: "Historical destination",
    description: "Traffic was routed to the Income Protection Calculator through June. This route has no July or August traffic after the campaign transition.",
    activePeriod: "May–June 2026",
    optIns: null,
  },
  affiliate: {
    title: "Breeze Affiliate Quote Flow",
    eyebrow: "Current destination",
    description: "Current approved-lead routing points to the Breeze affiliate quote flow beginning in July.",
    activePeriod: "July–August 2026",
    destinationUrl: "https://www.meetbreeze.com/disability-insurance/quotes/?tunetrackingid=102ccdb8593aef1d29660f6b36f8dc",
    optIns: null,
  },
};

// User-requested illustrative review data. These values are intentionally not sourced campaign analytics.
export const BREEZE_TRAFFIC_DEMO: readonly BreezeTrafficDemoPoint[] = [
  { month: "May 2026", hits: 412, destination: "Income Protection Calculator" },
  { month: "June 2026", hits: 686, destination: "Income Protection Calculator" },
  { month: "July 2026", hits: 934, destination: "Breeze affiliate quote flow" },
  { month: "August 2026", hits: 1171, destination: "Breeze affiliate quote flow" },
];

export const BREEZE_CALCULATOR_TRAFFIC = BREEZE_TRAFFIC_DEMO.filter(point => point.destination === "Income Protection Calculator");
export const BREEZE_AFFILIATE_TRAFFIC = BREEZE_TRAFFIC_DEMO.filter(point => point.destination === "Breeze affiliate quote flow");
export const BREEZE_TRAFFIC_DEMO_MAX = Math.max(...BREEZE_TRAFFIC_DEMO.map(point => point.hits));

const dailyPattern = [0.83, 0.95, 1.04, 0.91, 1.1, 0.98, 1.19] as const;

function dailySeries(month: string, total: number): BreezeDailyTrafficPoint[] {
  const dayCount = 7;
  const raw = dailyPattern.map(weight => Math.round((total / dayCount) * weight));
  const correction = total - raw.reduce((sum, value) => sum + value, 0);
  raw[raw.length - 1] += correction;
  return raw.map((hits, index) => ({ day: `${month} ${index + 1}`, hits }));
}

export const BREEZE_DESTINATION_DAILY_TRAFFIC: Record<BreezeDestinationKey, BreezeDailyTrafficPoint[]> = {
  calculator: [
    ...dailySeries("May", 412),
    ...dailySeries("Jun", 686),
    { day: "Jul", hits: 0 },
    { day: "Aug", hits: 0 },
  ],
  affiliate: [
    ...dailySeries("Jul", 934),
    ...dailySeries("Aug", 1171),
  ],
};

export function destinationMonthlyTotal(destination: BreezeDestinationKey) {
  return BREEZE_DESTINATION_DAILY_TRAFFIC[destination].reduce((sum, point) => sum + point.hits, 0);
}
