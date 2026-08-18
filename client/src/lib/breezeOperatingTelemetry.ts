import { BREEZE_INITIAL_ACTIVE_COHORT } from "@shared/breezeCohort";

export const BREEZE_OPERATING_TELEMETRY = [
  { stage: "Exact Audience", value: 2696, status: "Data", tone: "#14b8a6", note: "Behavior Based Data" },
  { stage: "Google Ads", value: 112, status: "Engagement", tone: "#f97316", note: "Engagement records" },
  { stage: "Meta Ads", value: 238, status: "Engagement", tone: "#fbbf24", note: "Engagement records" },
  { stage: "Email outreach", value: BREEZE_INITIAL_ACTIVE_COHORT, status: "Outreach", tone: "#fbbf24", note: "60% opened · 21% clicked across active outreach" },
] as const;

export const BREEZE_STAGE_STATUS = [
  { label: "SiteID visitor layer", status: "Pending installation", tone: "#f97316", detail: "No visitor events are shown" },
  { label: "Affiliate quote flow", status: "Active destination", tone: "#14b8a6", detail: "Conversions unavailable" },
] as const;
