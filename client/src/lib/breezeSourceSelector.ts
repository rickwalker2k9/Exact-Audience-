export const BREEZE_SOURCE_SELECTOR = [
  {
    id: "google-ads",
    label: "Google Ads",
    sourceLabel: "Google Ads · approved source records",
    count: 112,
    accent: "orange" as const,
  },
  {
    id: "meta-ads",
    label: "Meta Ads",
    sourceLabel: "Meta Ads · approved source records",
    count: 238,
    accent: "gold" as const,
  },
  {
    id: "exact-audience",
    label: "Exact Audience Data",
    sourceLabel: "Email Outreach · Exact Audience",
    count: 2696,
    accent: "teal" as const,
  },
] as const;

export type BreezeSourceSelectorId = (typeof BREEZE_SOURCE_SELECTOR)[number]["id"];
