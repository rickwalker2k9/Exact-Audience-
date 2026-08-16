import { createHash } from "node:crypto";

export const BREEZE_SHEET_ID = "14E8eR5vIKd-_rYc1XBtAfkGosz2SKXau5qOTrOjZI4I";
export const BREEZE_ALLOWED_TABS = {
  valid: "✅ VALID (Send These)",
  validGold: "⭐ VALID GOLD (Best)",
} as const;

const REQUIRED_HEADERS = ["FIRST NAME", "LAST NAME", "PERS V EMAILS", "ZB Status"];

export type ApprovedLead = {
  tier: "valid" | "valid-gold";
  firstName: string;
  lastName: string;
  city: string;
  state: string;
  email: string;
  status: string;
  emailProvider: string;
  lastKnownActivity: string;
};

export type BreezeOwnerReviewLead = {
  name: string;
  location: string;
  emailProvider: string;
  stage: BreezeFunnelStage;
  lastKnownActivity: string;
};

export const BREEZE_FUNNEL_STAGES = ["approved", "activated", "visited", "form-started", "form-completed"] as const;
export type BreezeFunnelStage = (typeof BREEZE_FUNNEL_STAGES)[number];

export function getBreezeContactKey(lead: Pick<ApprovedLead, "email">) {
  return createHash("sha256").update(lead.email.trim().toLowerCase()).digest("hex");
}

export type ApprovedLeadImport = {
  leads: ApprovedLead[];
  schemaReady: boolean;
  reason?: string;
};

function parseCsvLine(line: string) {
  const values: string[] = [];
  let current = "";
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (char === '"') {
      if (quoted && line[index + 1] === '"') { current += '"'; index += 1; }
      else quoted = !quoted;
    } else if (char === "," && !quoted) {
      values.push(current.trim()); current = "";
    } else current += char;
  }
  values.push(current.trim());
  return values;
}

export function parseCsv(text: string) {
  return text.replace(/^\uFEFF/, "").split(/\r?\n/).filter(Boolean).map(parseCsvLine);
}

export function mapApprovedCsv(csv: string, tier: ApprovedLead["tier"]): ApprovedLeadImport {
  const rows = parseCsv(csv);
  const headers = rows[0]?.map(header => header.trim().toUpperCase()) ?? [];
  const missingHeaders = REQUIRED_HEADERS.filter(header => !headers.includes(header.toUpperCase()));
  if (missingHeaders.length) {
    return { leads: [], schemaReady: false, reason: `Header row required: ${missingHeaders.join(", ")}` };
  }
  const column = (header: string) => headers.indexOf(header.toUpperCase());
  const get = (row: string[], header: string) => row[column(header)]?.trim() ?? "";
  const leads = rows.slice(1).map(row => ({
    tier,
    firstName: get(row, "FIRST NAME"),
    lastName: get(row, "LAST NAME"),
    city: get(row, "CITY"),
    state: get(row, "ST"),
    email: get(row, "PERS V EMAILS"),
    status: get(row, "ZB Status").toLowerCase(),
    emailProvider: get(row, "ZB SMTP Provider"),
    lastKnownActivity: get(row, "ZB Last Known Activity"),
  })).filter(lead => lead.status === "valid" && lead.email);
  return { leads, schemaReady: true };
}

function sheetUrl(tab: string) {
  return `https://docs.google.com/spreadsheets/d/${BREEZE_SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(tab)}`;
}

async function fetchTab(tab: string, tier: ApprovedLead["tier"]) {
  const response = await fetch(sheetUrl(tab));
  if (!response.ok) throw new Error(`Google Sheet fetch failed (${response.status})`);
  return mapApprovedCsv(await response.text(), tier);
}

export async function getApprovedBreezeLeads() {
  const [valid, validGold] = await Promise.all([
    fetchTab(BREEZE_ALLOWED_TABS.valid, "valid"),
    fetchTab(BREEZE_ALLOWED_TABS.validGold, "valid-gold"),
  ]);
  return {
    valid,
    validGold,
    refreshedAt: new Date().toISOString(),
  };
}

export function toLeadSummary(imports: Awaited<ReturnType<typeof getApprovedBreezeLeads>>) {
  return {
    valid: { count: imports.valid.leads.length, schemaReady: imports.valid.schemaReady, reason: imports.valid.reason ?? null },
    validGold: { count: imports.validGold.leads.length, schemaReady: imports.validGold.schemaReady, reason: imports.validGold.reason ?? null },
    allowedTabs: [BREEZE_ALLOWED_TABS.valid, BREEZE_ALLOWED_TABS.validGold],
    refreshedAt: imports.refreshedAt,
  };
}

/**
 * Temporary owner-review projection. It omits email, provider, and source
 * metadata while allowing the approved roster and funnel state to be reviewed.
 */
export function toOwnerReviewLead(lead: ApprovedLead, stage: BreezeFunnelStage): BreezeOwnerReviewLead {
  return {
    name: `${lead.firstName} ${lead.lastName}`.trim() || "Approved contact",
    location: [lead.city, lead.state].filter(Boolean).join(", ") || "Location unavailable",
    emailProvider: lead.emailProvider || "Provider unavailable",
    stage,
    lastKnownActivity: lead.lastKnownActivity || "—",
  };
}

export function buildFunnelCounts(stages: BreezeFunnelStage[]) {
  return BREEZE_FUNNEL_STAGES.reduce((counts, stage) => {
    counts[stage] = stages.filter(current => BREEZE_FUNNEL_STAGES.indexOf(current) >= BREEZE_FUNNEL_STAGES.indexOf(stage)).length;
    return counts;
  }, {} as Record<BreezeFunnelStage, number>);
}
