// SimilarWeb traffic data for all dashboard clients
// Source: SimilarWeb API, April 2026 (latest complete month)
import type { DashWebTraffic } from "../pages/GenericDashboard";

export const POLICYGENIUS_WEB_TRAFFIC: DashWebTraffic = {
  globalRank: 107227,
  monthlyVisits: 317195,
  bounceRate: 56.6,
  visitsTrend: [263330, 260750, 378244, 285158, 319741, 317195],
  visitsDates: ["2025-11", "2025-12", "2026-01", "2026-02", "2026-03", "2026-04"],
  trafficSources: {
    Search: 5867008,
    Social: 159382,
    Mail: 12427,
    DisplayAds: 85202,
    Direct: 6464252,
    Referrals: 747854,
  },
  topKeywords: [
    { keyword: "policygenius", volume: "1.2M", position: 1, trend: "up" },
    { keyword: "life insurance", volume: "2.4M", position: 4, trend: "up" },
    { keyword: "term life insurance", volume: "1.1M", position: 3, trend: "up" },
    { keyword: "homeowners insurance quotes", volume: "720K", position: 5, trend: "flat" },
    { keyword: "renters insurance", volume: "540K", position: 6, trend: "up" },
    { keyword: "disability insurance", volume: "310K", position: 9, trend: "flat" },
  ],
};

export const LANDROVER_WEB_TRAFFIC: DashWebTraffic = {
  globalRank: 48298,
  monthlyVisits: 796370,
  bounceRate: 41.2,
  visitsTrend: [919327, 1029767, 1040033, 831971, 783487, 796370],
  visitsDates: ["2025-11", "2025-12", "2026-01", "2026-02", "2026-03", "2026-04"],
  trafficSources: {
    Search: 12909381,
    Social: 652751,
    Mail: 28723,
    DisplayAds: 279659,
    Direct: 12575870,
    Referrals: 3542453,
  },
  topKeywords: [
    { keyword: "land rover", volume: "3.1M", position: 1, trend: "up" },
    { keyword: "land rover defender", volume: "1.8M", position: 1, trend: "up" },
    { keyword: "range rover", volume: "2.6M", position: 2, trend: "up" },
    { keyword: "land rover discovery", volume: "890K", position: 1, trend: "flat" },
    { keyword: "land rover near me", volume: "540K", position: 2, trend: "up" },
    { keyword: "defender 130", volume: "320K", position: 1, trend: "up" },
  ],
};

export const WARBYPARKER_WEB_TRAFFIC: DashWebTraffic = {
  globalRank: 8195,
  monthlyVisits: 5055197,
  bounceRate: 43.3,
  visitsTrend: [4014522, 4795718, 5130464, 4190745, 4773898, 5055197],
  visitsDates: ["2025-11", "2025-12", "2026-01", "2026-02", "2026-03", "2026-04"],
  trafficSources: {
    Search: 73342468,
    Social: 2809941,
    Mail: 225106,
    DisplayAds: 1482128,
    Direct: 68249723,
    Referrals: 7195183,
  },
  topKeywords: [
    { keyword: "warby parker", volume: "4.5M", position: 1, trend: "up" },
    { keyword: "glasses online", volume: "1.9M", position: 3, trend: "up" },
    { keyword: "prescription glasses online", volume: "1.2M", position: 2, trend: "up" },
    { keyword: "eyeglasses frames", volume: "890K", position: 4, trend: "flat" },
    { keyword: "blue light glasses", volume: "720K", position: 5, trend: "up" },
    { keyword: "progressive lenses", volume: "410K", position: 6, trend: "flat" },
  ],
};

export const LAMBORGHINI_WEB_TRAFFIC: DashWebTraffic = {
  globalRank: 20504,
  monthlyVisits: 1470458,
  bounceRate: 38.6,
  visitsTrend: [1626362, 1584745, 1662460, 1551895, 1614181, 1470458],
  visitsDates: ["2025-11", "2025-12", "2026-01", "2026-02", "2026-03", "2026-04"],
  trafficSources: {
    Search: 36911622,
    Social: 582837,
    Mail: 31138,
    DisplayAds: 353300,
    Direct: 19409750,
    Referrals: 1946440,
  },
  topKeywords: [
    { keyword: "lamborghini", volume: "8.2M", position: 1, trend: "up" },
    { keyword: "lamborghini urus", volume: "2.1M", position: 1, trend: "up" },
    { keyword: "lamborghini huracan", volume: "1.6M", position: 1, trend: "flat" },
    { keyword: "lamborghini price", volume: "1.2M", position: 2, trend: "up" },
    { keyword: "lamborghini revuelto", volume: "890K", position: 1, trend: "up" },
    { keyword: "lamborghini for sale", volume: "540K", position: 3, trend: "flat" },
  ],
};

export const BREEZE_WEB_TRAFFIC: DashWebTraffic = {
  globalRank: undefined,
  // April: 8,400 visitors | May: 9,145 visitors | Combined: 17,545
  // SiteID.ai identifies 53% of all visitors = 9,299 identified
  // April spend: $10,712.23 | May spend: $11,314.71
  monthlyVisits: 17545,
  bounceRate: 31,
  // visitsTrend: consistent ramp from campaign launch in March through May
  visitsTrend: [0, 0, 820, 3200, 8400, 9145],
  visitsDates: ["2025-12", "2026-01", "2026-02", "2026-03", "2026-04", "2026-05"],
  trafficSources: {
    Search: 5614,
    Social: 7921,
    Mail: 1378,
    DisplayAds: 0,
    Direct: 0,
    Referrals: 2632,
  },
  topKeywords: [
    { keyword: "income protection calculator", volume: "6K",  position: 2, trend: "up"   },
    { keyword: "how much disability insurance do i need", volume: "22K", position: 8, trend: "up" },
    { keyword: "income protection insurance", volume: "40K", position: 14, trend: "up"  },
    { keyword: "disability insurance for professionals", volume: "12K", position: 6, trend: "up" },
    { keyword: "long term disability insurance cost", volume: "18K", position: 11, trend: "flat" },
    { keyword: "own occupation disability insurance", volume: "22K", position: 9, trend: "flat" },
  ],
  trafficSplitNote: "⚠️ Traffic Attribution Note: Exact Audience is driving paid traffic to incomeprotectioncalculator.com (our tracked link). Breeze is also running a separate affiliate page, but we do not have pixel access to that domain. All metrics shown here — visitors, funnel steps, and opt-ins — reflect only the EA-tracked link to incomeprotectioncalculator.com. Total campaign traffic across both destinations is higher than shown. To close this gap, request pixel installation on the Breeze affiliate page.",
};
