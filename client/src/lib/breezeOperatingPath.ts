export type BreezeOperatingPathStage = {
  id: "audience" | "responders" | "email" | "website" | "destination";
  order: number;
  label: string;
  value: string;
  status: string;
  sourceType: "uploaded" | "illustrative" | "awaiting" | "available";
};

/**
 * Operating-path facts used by the Breeze public funnel. The source type keeps
 * uploaded results, illustrative demo activity, and awaiting-source states
 * visibly distinct.
 */
export const BREEZE_OPERATING_PATH: BreezeOperatingPathStage[] = [
  { id: "audience", order: 1, label: "Exact Audience list", value: "2,696", status: "Uploaded behavior-based records", sourceType: "uploaded" },
  { id: "responders", order: 2, label: "Google + Meta responders", value: "350", status: "112 Google + 238 Meta uploaded records", sourceType: "uploaded" },
  { id: "email", order: 3, label: "Email outreach", value: "248", status: "Illustrative sent/open/click state", sourceType: "illustrative" },
  { id: "website", order: 4, label: "Website visitors", value: "—", status: "Awaiting SiteID visitor CSV", sourceType: "awaiting" },
  { id: "destination", order: 5, label: "Breeze affiliate quote", value: "Active", status: "Destination active; conversions unavailable", sourceType: "available" },
];
