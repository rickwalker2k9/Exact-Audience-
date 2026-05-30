/**
 * PolicyGeniusDashboard.tsx
 * PolicyGenius — Life Insurance Awareness 2026
 */
import GenericDashboard from "./GenericDashboard";
import {
  PG_CLIENT, PG_LIVE_BASE, PG_DAILY_IMPRESSIONS,
  PG_MEDIA_MIX, PG_VISITORS, PG_MOODS, PG_CREATIVES, PG_INSURANCE_PAGES,
} from "@/lib/policyGeniusData";

const PG_CTV_CHANNELS = [
  { name: "Hulu",              impressions: 712400, completions: 598400, cpm: 19.80, frequency: 2.64, completionRate: 84.0, color: "#1ce783" },
  { name: "Peacock",           impressions: 487200, completions: 409200, cpm: 17.40, frequency: 2.24, completionRate: 84.0, color: "#000000" },
  { name: "Tubi",              impressions: 398400, completions: 318700, cpm: 13.60, frequency: 1.84, completionRate: 80.0, color: "#FA4616" },
  { name: "Samsung TV Plus",   impressions: 312400, completions: 262400, cpm: 15.20, frequency: 2.04, completionRate: 84.0, color: "#1428A0" },
  { name: "Pluto TV",          impressions: 248700, completions: 199000, cpm: 11.40, frequency: 1.74, completionRate: 80.0, color: "#F7C948" },
  { name: "Roku Channel",      impressions: 198700, completions: 166900, cpm: 16.60, frequency: 2.14, completionRate: 84.0, color: "#6C1D45" },
  { name: "DIRECTV",           impressions: 164200, completions: 131400, cpm: 12.40, frequency: 1.54, completionRate: 80.0, color: "#00A8E0" },
  { name: "CNN",               impressions: 124800, completions: 104900, cpm: 22.80, frequency: 1.44, completionRate: 84.0, color: "#cc0000" },
  { name: "MSNBC",             impressions: 98700,  completions: 82900,  cpm: 20.40, frequency: 1.34, completionRate: 84.0, color: "#0078d4" },
  { name: "Performance Network",impressions: 95600, completions: 76500,  cpm:  7.80, frequency: 1.14, completionRate: 80.0, color: "#7c3aed" },
];

export default function PolicyGeniusDashboard() {
  return (
    <GenericDashboard
      client={{ ...PG_CLIENT, accentColor: "#7c3aed" }}
      liveBase={PG_LIVE_BASE}
      dailyImpressions={PG_DAILY_IMPRESSIONS}
      mediaMix={PG_MEDIA_MIX}
      ctvChannels={PG_CTV_CHANNELS}
      creatives={PG_CREATIVES}
      moods={PG_MOODS}
      visitors={PG_VISITORS}
      sitePages={PG_INSURANCE_PAGES}
      sitePagesLabel="Insurance Pages"
    />
  );
}
