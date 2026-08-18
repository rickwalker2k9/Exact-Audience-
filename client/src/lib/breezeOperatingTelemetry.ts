export const BREEZE_OPERATING_TELEMETRY = [
  { stage: "Exact Audience", value: 2696, status: "Uploaded", tone: "#14b8a6", note: "Behavior-based records" },
  { stage: "Google Ads", value: 112, status: "Uploaded", tone: "#f97316", note: "Responder records" },
  { stage: "Meta Ads", value: 238, status: "Uploaded", tone: "#fbbf24", note: "Responder records" },
  { stage: "Email outreach", value: 248, status: "Illustrative", tone: "#fbbf24", note: "Demo send/open/click state" },
] as const;

export const BREEZE_STAGE_STATUS = [
  { label: "SiteID visitor layer", status: "Pending installation", tone: "#f97316", detail: "No visitor events are shown" },
  { label: "Affiliate quote flow", status: "Active destination", tone: "#14b8a6", detail: "Conversions unavailable" },
] as const;
