/**
 * BreezeDashboard.tsx
 * Breeze Insurance — Disability Insurance Digital Campaign 2026
 * Channel mix: Meta (35%), Google (30%), LinkedIn (25%), Email (10%) — minimal CTV
 */
import GenericDashboard from "./GenericDashboard";
import {
  BREEZE_CLIENT, BREEZE_LIVE_BASE, BREEZE_DAILY_IMPRESSIONS,
  BREEZE_MEDIA_MIX, BREEZE_CTV_CHANNELS, BREEZE_CREATIVES,
  BREEZE_MOODS, BREEZE_VISITORS, BREEZE_SITE_PAGES, BREEZE_QR,
} from "@/lib/breezeData";
import { BREEZE_PEOPLE, BREEZE_SEGMENT_STATS } from "@/lib/breezeInsurancePeopleSegment";
import { BREEZE_WEB_TRAFFIC } from "@/lib/webTrafficData";

export default function BreezeDashboard() {
  return (
    <GenericDashboard
      client={{ ...BREEZE_CLIENT, accentColor: "#0ea5e9", dashboardId: "breeze-insurance" as const }}
      liveBase={BREEZE_LIVE_BASE}
      dailyImpressions={BREEZE_DAILY_IMPRESSIONS}
      mediaMix={BREEZE_MEDIA_MIX}
      ctvChannels={BREEZE_CTV_CHANNELS}
      creatives={BREEZE_CREATIVES}
      moods={BREEZE_MOODS}
      visitors={BREEZE_VISITORS}
      sitePages={BREEZE_SITE_PAGES}
      sitePagesLabel="Product Pages"
      qr={BREEZE_QR}
      ctvRecommendationsMode={true}
      audienceSegment={BREEZE_PEOPLE as any}
      audienceSegmentStats={BREEZE_SEGMENT_STATS as any}
      webTraffic={BREEZE_WEB_TRAFFIC}
    />
  );
}
