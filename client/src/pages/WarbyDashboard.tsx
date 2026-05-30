/**
 * WarbyDashboard.tsx
 * Warby Parker — Spring Vision 2026
 */
import GenericDashboard from "./GenericDashboard";
import {
  WARBY_CLIENT, WARBY_LIVE_BASE, WARBY_DAILY_IMPRESSIONS,
  WARBY_MEDIA_MIX, WARBY_VISITORS, WARBY_MOODS, WARBY_CREATIVES, WARBY_SITE_PAGES,
} from "@/lib/warbyData";

const WARBY_CTV_CHANNELS = [
  { name: "Hulu",              impressions: 842400, completions: 757800, cpm: 21.40, frequency: 2.84, completionRate: 90.0, color: "#1ce783" },
  { name: "Peacock",           impressions: 487400, completions: 438700, cpm: 18.20, frequency: 2.41, completionRate: 90.0, color: "#000000" },
  { name: "Tubi",              impressions: 398200, completions: 318600, cpm: 14.80, frequency: 1.72, completionRate: 80.0, color: "#FA4616" },
  { name: "Samsung TV Plus",   impressions: 312400, completions: 281200, cpm: 16.40, frequency: 2.14, completionRate: 90.0, color: "#1428A0" },
  { name: "Pluto TV",          impressions: 248700, completions: 211400, cpm: 12.60, frequency: 1.84, completionRate: 85.0, color: "#F7C948" },
  { name: "Roku Channel",      impressions: 198700, completions: 178800, cpm: 17.80, frequency: 2.24, completionRate: 90.0, color: "#6C1D45" },
  { name: "DIRECTV",           impressions: 164200, completions: 139600, cpm: 13.20, frequency: 1.64, completionRate: 85.0, color: "#00A8E0" },
  { name: "E! Entertainment",  impressions: 124800, completions: 112300, cpm: 19.40, frequency: 1.44, completionRate: 90.0, color: "#9333ea" },
  { name: "Bravo",             impressions: 98700,  completions: 88800,  cpm: 22.10, frequency: 1.34, completionRate: 90.0, color: "#7c3aed" },
  { name: "Performance Network",impressions: 67300, completions: 53800,  cpm:  8.40, frequency: 1.14, completionRate: 80.0, color: "#1d4ed8" },
];

export default function WarbyDashboard() {
  return (
    <GenericDashboard
      client={{ ...WARBY_CLIENT, accentColor: "#1d4ed8", dashboardId: "warby-parker" as const }}
      liveBase={WARBY_LIVE_BASE}
      dailyImpressions={WARBY_DAILY_IMPRESSIONS}
      mediaMix={WARBY_MEDIA_MIX}
      ctvChannels={WARBY_CTV_CHANNELS}
      creatives={WARBY_CREATIVES}
      moods={WARBY_MOODS}
      visitors={WARBY_VISITORS}
      sitePages={WARBY_SITE_PAGES}
      sitePagesLabel="Product Pages"
    />
  );
}
