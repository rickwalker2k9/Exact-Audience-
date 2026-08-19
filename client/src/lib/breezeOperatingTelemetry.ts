import { BREEZE_INITIAL_ACTIVE_COHORT } from "@shared/breezeCohort";

export const BREEZE_OPERATING_TELEMETRY = [
  { stage: "Exact Audience", value: 2696, status: "List", tone: "#14b8a6", note: "Behavior Based Data" },
  { stage: "Google Ads", value: 112, status: "Replies", tone: "#f97316", note: "People who replied" },
  { stage: "Meta Ads", value: 238, status: "Replies", tone: "#fbbf24", note: "People who replied" },
  { stage: "Email outreach", value: BREEZE_INITIAL_ACTIVE_COHORT, status: "Email", tone: "#fbbf24", note: "60% opened · 21% clicked" },
] as const;

export const BREEZE_STAGE_STATUS = [
  { label: "Website visits", status: "Not installed", tone: "#f97316", detail: "No visits to show" },
  { label: "Breeze quote page", status: "Ready", tone: "#14b8a6", detail: "No sign-up results are shown" },
] as const;
