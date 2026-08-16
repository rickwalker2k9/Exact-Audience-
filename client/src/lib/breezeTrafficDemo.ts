export type BreezeTrafficDemoPoint = {
  month: string;
  hits: number;
  destination: "Income Protection Calculator" | "Breeze affiliate quote flow";
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
