export const BREEZE_SOURCE_SELECTOR = [
  {
    id: "google-ads",
    label: "Google Ads",
    sourceLabel: "Google Ads · approved source records",
    logo: "/manus-storage/breeze-google-white_39124f64.png",
    logoClassName: "scale-[1.75]",
    count: 112,
    accent: "orange" as const,
  },
  {
    id: "meta-ads",
    label: "Meta Ads",
    sourceLabel: "Meta Ads · approved source records",
    logo: "/manus-storage/breeze-meta-white_892b80f0.png",
    logoClassName: "scale-[2.25]",
    count: 238,
    accent: "gold" as const,
  },
  {
    id: "exact-audience",
    label: "Exact Audience Data",
    sourceLabel: "Email Outreach · Exact Audience",
    logo: "/manus-storage/breeze-exact-audience-white_f2401364.png",
    logoClassName: "scale-[1.9]",
    count: 2696,
    accent: "teal" as const,
  },
] as const;

export type BreezeSourceSelectorId = (typeof BREEZE_SOURCE_SELECTOR)[number]["id"];
