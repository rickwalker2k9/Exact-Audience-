/**
 * LandRoverDashboard.tsx
 * Land Rover North Scottsdale — Defender Conquest 2026
 */
import GenericDashboard from "./GenericDashboard";
import {
  LANDROVER_CLIENT, LANDROVER_LIVE_BASE, LANDROVER_DAILY_IMPRESSIONS,
  LANDROVER_MEDIA_MIX, LANDROVER_CTV_CHANNELS, LANDROVER_CREATIVES,
  LANDROVER_MOODS, LANDROVER_VISITORS, LANDROVER_QR,
} from "@/lib/landRoverData";
import { LANDROVER_WEB_TRAFFIC } from "@/lib/webTrafficData";

const LANDROVER_SITE_PAGES = [
  { label: "Defender",       views: 14284, avgTime: "5:12", bounce: 22, color: "#1a6b3c" },
  { label: "Range Rover",    views: 10412, avgTime: "4:48", bounce: 25, color: "#d4a017" },
  { label: "Discovery",      views: 7284,  avgTime: "4:18", bounce: 28, color: "#0ea5e9" },
  { label: "Build & Price",  views: 12847, avgTime: "8:24", bounce: 14, color: "#4ade80" },
  { label: "Inventory",      views: 9412,  avgTime: "3:58", bounce: 31, color: "#38bdf8" },
  { label: "Schedule Test Drive", views: 4184, avgTime: "2:44", bounce: 38, color: "#a78bfa" },
];

export default function LandRoverDashboard() {
  return (
    <GenericDashboard
      client={{ ...LANDROVER_CLIENT, accentColor: "#1a6b3c", dashboardId: "land-rover" as const }}
      liveBase={LANDROVER_LIVE_BASE}
      dailyImpressions={LANDROVER_DAILY_IMPRESSIONS}
      mediaMix={LANDROVER_MEDIA_MIX}
      ctvChannels={LANDROVER_CTV_CHANNELS}
      creatives={LANDROVER_CREATIVES}
      moods={LANDROVER_MOODS}
      visitors={LANDROVER_VISITORS}
      sitePages={LANDROVER_SITE_PAGES}
      sitePagesLabel="Model Pages"
      qr={LANDROVER_QR}
      webTraffic={LANDROVER_WEB_TRAFFIC}
    />
  );
}
