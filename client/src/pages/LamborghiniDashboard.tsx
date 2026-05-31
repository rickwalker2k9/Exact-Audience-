/**
 * LamborghiniDashboard.tsx
 * Lamborghini of Scottsdale — Urus Conquest 2026
 */
import GenericDashboard from "./GenericDashboard";
import {
  LAMBO_CLIENT, LAMBO_LIVE_BASE, LAMBO_DAILY_IMPRESSIONS,
  LAMBO_MEDIA_MIX, LAMBO_CTV_CHANNELS, LAMBO_CREATIVES,
  LAMBO_MOODS, LAMBO_VISITORS, LAMBO_QR,
} from "@/lib/lamborghiniData";
import { LAMBO_PEOPLE, LAMBO_SEGMENT_STATS } from "@/lib/lamborghiniPeopleSegment";
import { LAMBORGHINI_WEB_TRAFFIC } from "@/lib/webTrafficData";

const LAMBO_SITE_PAGES = [
  { label: "Urus",         views: 11284, avgTime: "4:42", bounce: 24, color: "#d4a017" },
  { label: "Huracán",      views: 7412,  avgTime: "4:18", bounce: 27, color: "#f59e0b" },
  { label: "Revuelto",     views: 5284,  avgTime: "5:01", bounce: 22, color: "#14b8a6" },
  { label: "Build & Price",views: 9847,  avgTime: "7:24", bounce: 16, color: "#4ade80" },
  { label: "Inventory",    views: 8412,  avgTime: "3:58", bounce: 31, color: "#38bdf8" },
  { label: "Contact Us",   views: 4184,  avgTime: "2:14", bounce: 44, color: "#a78bfa" },
];

export default function LamborghiniDashboard() {
  return (
    <GenericDashboard
      client={{ ...LAMBO_CLIENT, accentColor: "#d4a017", dashboardId: "lamborghini" as const }}
      liveBase={LAMBO_LIVE_BASE}
      dailyImpressions={LAMBO_DAILY_IMPRESSIONS}
      mediaMix={LAMBO_MEDIA_MIX}
      ctvChannels={LAMBO_CTV_CHANNELS}
      creatives={LAMBO_CREATIVES}
      moods={LAMBO_MOODS}
      visitors={LAMBO_VISITORS}
      sitePages={LAMBO_SITE_PAGES}
      sitePagesLabel="Model Pages"
      qr={LAMBO_QR}
      audienceSegment={LAMBO_PEOPLE as any}
      audienceSegmentStats={LAMBO_SEGMENT_STATS}
      webTraffic={LAMBORGHINI_WEB_TRAFFIC}
    />
  );
}
