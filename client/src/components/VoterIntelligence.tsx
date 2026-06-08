/**
 * VoterIntelligence.tsx
 * Shared Voter Intelligence tab component for all four Governor pitch dashboards
 * Shows: 8-county targeting map, top 12 voter profiles with journeys, moveable voter table
 * Design: Dark purple / gold / white — matches Barrett/Governor palette
 */

import { useState } from "react";
import { VOTER_PROFILES as RICH_VOTER_PROFILES } from "@/lib/voterProfiles";
import { VoterCard } from "@/components/VoterCard";

// ── 8 Key Counties ──────────────────────────────────────────────────────────
export const EIGHT_COUNTIES = [
  {
    name: "Oklahoma County",
    city: "Oklahoma City",
    registeredRep: 142800,
    undecided: 38200,
    softKeating: 8100,
    softMcCall: 9400,
    note: "Largest GOP voter pool in state — OKC metro suburban voters are the primary battleground",
  },
  {
    name: "Tulsa County",
    city: "Tulsa",
    registeredRep: 128400,
    undecided: 34100,
    softKeating: 7200,
    softMcCall: 8600,
    note: "Drummond's home base — business community and suburban conservatives are highly persuadable",
  },
  {
    name: "Cleveland County",
    city: "Norman",
    registeredRep: 52300,
    undecided: 13800,
    softKeating: 3100,
    softMcCall: 3700,
    note: "OU-adjacent suburban voters — educated professionals, high engagement with policy messaging",
  },
  {
    name: "Canadian County",
    city: "Yukon / El Reno",
    registeredRep: 41700,
    undecided: 11200,
    softKeating: 2400,
    softMcCall: 2900,
    note: "Fast-growing OKC exurb — new residents are less locked in, highly targetable via CTV",
  },
  {
    name: "Rogers County",
    city: "Claremore / Broken Arrow",
    registeredRep: 38900,
    undecided: 10400,
    softKeating: 2200,
    softMcCall: 2600,
    note: "Tulsa exurb — law enforcement and rural conservative voters overlap with Keating's natural base",
  },
  {
    name: "Wagoner County",
    city: "Wagoner / Broken Arrow East",
    registeredRep: 29600,
    undecided: 7900,
    softKeating: 1700,
    softMcCall: 2000,
    note: "Growing suburban county — voters are newer to the area and less committed to any candidate",
  },
  {
    name: "Comanche County",
    city: "Lawton",
    registeredRep: 24800,
    undecided: 6600,
    softKeating: 1400,
    softMcCall: 1700,
    note: "Military community — Fort Sill adjacent, responds strongly to law enforcement and security messaging",
  },
  {
    name: "Pottawatomie County",
    city: "Shawnee",
    registeredRep: 18900,
    undecided: 5100,
    softKeating: 1100,
    softMcCall: 1300,
    note: "Swing county between OKC and Tulsa — tribal-adjacent, responds to AG credibility and rural values",
  },
];

// ── Top 12 Voter Profiles ────────────────────────────────────────────────────
// 6 OKC area + 6 Tulsa area — from the actual voter list
// Status and journey are fictionalized for presentation purposes (no real data exposed)

export type VoterStatus = "Undecided" | "Soft Keating" | "Soft McCall" | "Soft Drummond" | "Persuadable";

export interface VoterProfile {
  id: number;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  zip: string;
  county: string;
  area: "OKC" | "Tulsa";
  status: VoterStatus;
  priorVoting: string;
  currentSignal: string;
  touchpoints: number;
  moveProbability: number; // 0-100
  journey: JourneyStep[];
}

export interface JourneyStep {
  phase: string;
  action: string;
  channel: string;
  timing: string;
  goal: string;
}

// Primary journey template (Drummond / Keating / McCall)
const primaryJourney = (candidateName: string, accent: string): JourneyStep[] => [
  {
    phase: "1",
    action: "Initial CTV Exposure",
    channel: "Connected TV / Streaming",
    timing: "Days 1–3",
    goal: `Voter sees ${candidateName} ad on Hulu/Peacock — matched to voter file by name and address`,
  },
  {
    phase: "2",
    action: "Digital Reinforcement",
    channel: "Facebook / Instagram / YouTube",
    timing: "Days 3–5",
    goal: "Same voter sees social ad with policy contrast — behavioral signal captured (view, click, or engagement)",
  },
  {
    phase: "3",
    action: "Frequency Boost",
    channel: "CTV + Digital (combined)",
    timing: "Days 5–7",
    goal: "Voter reaches 4–6 exposure threshold — behavioral data shows shift from undecided to soft supporter",
  },
  {
    phase: "4",
    action: "Closing Message",
    channel: "OTT / Pre-roll Video",
    timing: "Days 7–9",
    goal: `Final persuasion push — voter moves to confirmed ${candidateName} supporter before June 16`,
  },
];

// Runoff journey template (Mazzei)
const runoffJourney = (candidateName: string): JourneyStep[] => [
  {
    phase: "1",
    action: "Post-Primary Identification",
    channel: "Voter File Match",
    timing: "June 17–20",
    goal: "Identify every Keating and McCall voter by name — model which 55–65% are persuadable to Mazzei in the runoff",
  },
  {
    phase: "2",
    action: "First Contact — CTV",
    channel: "Connected TV / Streaming",
    timing: "June 21–28",
    goal: `Voter sees ${candidateName} runoff message on their TV — Trump endorsement + governing vision`,
  },
  {
    phase: "3",
    action: "Digital Reinforcement",
    channel: "Facebook / Instagram",
    timing: "June 28 – July 10",
    goal: "Behavioral signal captured — voter engaging with Mazzei content, moving from soft to committed",
  },
  {
    phase: "4",
    action: "Sustained Frequency",
    channel: "CTV + Digital + OTT",
    timing: "July 10 – Aug 10",
    goal: "Voter reaches 8–12 exposure threshold over 7 weeks — behavioral confirmation of support",
  },
  {
    phase: "5",
    action: "Turnout Activation",
    channel: "Digital + Direct Mail",
    timing: "Aug 10–24",
    goal: "Final activation push — voter receives personalized early voting reminder matched to their address",
  },
];

export const VOTER_PROFILES: VoterProfile[] = [
  // OKC Area — 6 voters
  {
    id: 1,
    firstName: "Cindy",
    lastName: "Fierro",
    address: "1013 Samantha Ln",
    city: "Oklahoma City",
    zip: "73160",
    county: "Cleveland County",
    area: "OKC",
    status: "Undecided",
    priorVoting: "Voted 2022 primary, skipped 2020 primary",
    currentSignal: "Engaged with multiple candidate ads — no commitment signal",
    touchpoints: 2,
    moveProbability: 68,
    journey: [],
  },
  {
    id: 2,
    firstName: "Leesa",
    lastName: "Cornish",
    address: "11723 N Meridian Pl",
    city: "Oklahoma City",
    zip: "73162",
    county: "Oklahoma County",
    area: "OKC",
    status: "Soft McCall",
    priorVoting: "Voted every primary 2018–2024",
    currentSignal: "Viewed McCall ad twice — no click-through, no donation signal",
    touchpoints: 3,
    moveProbability: 54,
    journey: [],
  },
  {
    id: 3,
    firstName: "Alison",
    lastName: "Taylor",
    address: "3001 Regency Ct",
    city: "Oklahoma City",
    zip: "73120",
    county: "Oklahoma County",
    area: "OKC",
    status: "Soft Drummond",
    priorVoting: "Consistent primary voter — voted 2020, 2022, 2024",
    currentSignal: "Engaged with Drummond credibility ad — soft positive signal",
    touchpoints: 4,
    moveProbability: 72,
    journey: [],
  },
  {
    id: 4,
    firstName: "Christian",
    lastName: "Dean",
    address: "1919 East 2nd St",
    city: "Edmond",
    zip: "73034",
    county: "Oklahoma County",
    area: "OKC",
    status: "Undecided",
    priorVoting: "Voted 2022 primary only",
    currentSignal: "No ad engagement yet — household is in CTV targeting window",
    touchpoints: 0,
    moveProbability: 61,
    journey: [],
  },
  {
    id: 5,
    firstName: "Patricia",
    lastName: "Foster",
    address: "3308 W Memorial Rd",
    city: "Oklahoma City",
    zip: "73120",
    county: "Oklahoma County",
    area: "OKC",
    status: "Soft Keating",
    priorVoting: "Voted 2018, 2022 primaries — skipped 2020",
    currentSignal: "Viewed Keating law enforcement ad — positive engagement signal",
    touchpoints: 3,
    moveProbability: 58,
    journey: [],
  },
  {
    id: 6,
    firstName: "Dan",
    lastName: "Sandberg",
    address: "3121 Delmar Rd",
    city: "Oklahoma City",
    zip: "73115",
    county: "Oklahoma County",
    area: "OKC",
    status: "Persuadable",
    priorVoting: "Voted every primary since 2016",
    currentSignal: "High engagement with multiple candidates — actively researching the race",
    touchpoints: 5,
    moveProbability: 79,
    journey: [],
  },
  // Tulsa Area — 6 voters
  {
    id: 7,
    firstName: "Randy",
    lastName: "Lopp",
    address: "1244 E 29th St",
    city: "Tulsa",
    zip: "74114",
    county: "Tulsa County",
    area: "Tulsa",
    status: "Soft Keating",
    priorVoting: "Voted 2020, 2022 primaries",
    currentSignal: "Engaged with Keating outsider messaging — no donation, soft lean",
    touchpoints: 3,
    moveProbability: 62,
    journey: [],
  },
  {
    id: 8,
    firstName: "Shelly",
    lastName: "Koontz",
    address: "2218 E 59th St",
    city: "Tulsa",
    zip: "74105",
    county: "Tulsa County",
    area: "Tulsa",
    status: "Undecided",
    priorVoting: "Consistent primary voter — voted every cycle 2016–2024",
    currentSignal: "No strong signal — household in premium CTV targeting zone",
    touchpoints: 1,
    moveProbability: 71,
    journey: [],
  },
  {
    id: 9,
    firstName: "Annette",
    lastName: "Intrieri",
    address: "6800 S Granite Ave",
    city: "Tulsa",
    zip: "74136",
    county: "Tulsa County",
    area: "Tulsa",
    status: "Soft McCall",
    priorVoting: "Voted 2022 primary — donor to McCall campaign",
    currentSignal: "Donor who hasn't shown strong voting signal this cycle — conversion target",
    touchpoints: 4,
    moveProbability: 55,
    journey: [],
  },
  {
    id: 10,
    firstName: "Janis",
    lastName: "Vogel",
    address: "7760 Riverside Pkwy",
    city: "Tulsa",
    zip: "74136",
    county: "Tulsa County",
    area: "Tulsa",
    status: "Persuadable",
    priorVoting: "Voted every primary since 2014 — high-propensity voter",
    currentSignal: "Engaged with both Drummond and Keating ads — actively comparing candidates",
    touchpoints: 6,
    moveProbability: 83,
    journey: [],
  },
  {
    id: 11,
    firstName: "Jane",
    lastName: "Emerick",
    address: "6316 E 89th Pl",
    city: "Tulsa",
    zip: "74137",
    county: "Tulsa County",
    area: "Tulsa",
    status: "Soft Drummond",
    priorVoting: "Voted 2020, 2022, 2024 primaries",
    currentSignal: "Positive engagement with Drummond AG record ad — near threshold",
    touchpoints: 5,
    moveProbability: 74,
    journey: [],
  },
  {
    id: 12,
    firstName: "DeEtte",
    lastName: "Doerr",
    address: "1100 Oneok Plz",
    city: "Tulsa",
    zip: "74121",
    county: "Tulsa County",
    area: "Tulsa",
    status: "Undecided",
    priorVoting: "Voted 2022 primary — skipped 2020",
    currentSignal: "No engagement signal yet — downtown Tulsa professional, CTV target",
    touchpoints: 0,
    moveProbability: 65,
    journey: [],
  },
];

// ── Status color helper ──────────────────────────────────────────────────────
export function statusColor(status: VoterStatus): string {
  switch (status) {
    case "Undecided": return "#fbbf24";
    case "Soft Keating": return "#f97316";
    case "Soft McCall": return "#f59e0b";
    case "Soft Drummond": return "#d97706";
    case "Persuadable": return "#34d399";
    default: return "#ffffff";
  }
}

// ── Main Component ───────────────────────────────────────────────────────────
interface VoterIntelligenceProps {
  candidateName: string;
  accent: string;
  mode: "primary" | "runoff";
}

export default function VoterIntelligence({ candidateName, accent, mode }: VoterIntelligenceProps) {
  const [selectedVoter, setSelectedVoter] = useState<VoterProfile | null>(null);
  const [areaFilter, setAreaFilter] = useState<"All" | "OKC" | "Tulsa">("All");

  const bg = "#0c0618";
  const cardBg = "#130a28";
  const border = "#2a1a4a";
  const textPrimary = "#ffffff";

  const journey = mode === "runoff" ? runoffJourney(candidateName) : primaryJourney(candidateName, accent);

  const filteredVoters = areaFilter === "All"
    ? VOTER_PROFILES
    : VOTER_PROFILES.filter(v => v.area === areaFilter);

  const totalUndecided = EIGHT_COUNTIES.reduce((s, c) => s + c.undecided, 0);
  const totalSoftKeating = EIGHT_COUNTIES.reduce((s, c) => s + c.softKeating, 0);
  const totalSoftMcCall = EIGHT_COUNTIES.reduce((s, c) => s + c.softMcCall, 0);

  return (
    <div>
      {/* Header summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 28 }}>
        {[
          { label: "Undecided Voters — 8 Counties", value: totalUndecided.toLocaleString(), sub: "Registered Republicans with no committed candidate" },
          { label: "Soft Keating Voters", value: totalSoftKeating.toLocaleString(), sub: "Persuadable — 1–2 more touches needed to move" },
          { label: "Soft McCall Voters", value: totalSoftMcCall.toLocaleString(), sub: "Persuadable — financial supporters not yet voting" },
        ].map(kpi => (
          <div key={kpi.label} style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 12, padding: "20px 24px" }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: accent, marginBottom: 4 }}>{kpi.value}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: textPrimary, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>{kpi.label}</div>
            <div style={{ fontSize: 12, color: "#ffffff", opacity: 0.7 }}>{kpi.sub}</div>
          </div>
        ))}
      </div>

      {/* 8 County Table */}
      <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 12, padding: 24, marginBottom: 28 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: accent, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 4px" }}>
          8 Key Counties — Targeted Persuasion Universe
        </h3>
        <p style={{ fontSize: 13, color: textPrimary, opacity: 0.7, margin: "0 0 20px" }}>
          {mode === "primary"
            ? `These 8 counties contain the highest concentration of undecided and soft-lean voters who can move to ${candidateName} before June 16.`
            : `These 8 counties contain the largest pools of Keating and McCall voters who are persuadable to ${candidateName} in the August 25 runoff.`}
        </p>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${border}` }}>
                {["County", "City", "Reg. Republicans", "Undecided", "Soft Keating", "Soft McCall", "Key Insight"].map(h => (
                  <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontSize: 11, fontWeight: 700, color: accent, textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {EIGHT_COUNTIES.map((county, i) => (
                <tr key={county.name} style={{ borderBottom: `1px solid ${border}`, background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent" }}>
                  <td style={{ padding: "10px 12px", fontWeight: 700, color: textPrimary, whiteSpace: "nowrap" }}>{county.name}</td>
                  <td style={{ padding: "10px 12px", color: textPrimary }}>{county.city}</td>
                  <td style={{ padding: "10px 12px", color: textPrimary, fontWeight: 600 }}>{county.registeredRep.toLocaleString()}</td>
                  <td style={{ padding: "10px 12px", color: "#fbbf24", fontWeight: 700 }}>{county.undecided.toLocaleString()}</td>
                  <td style={{ padding: "10px 12px", color: "#f97316", fontWeight: 600 }}>{county.softKeating.toLocaleString()}</td>
                  <td style={{ padding: "10px 12px", color: "#f59e0b", fontWeight: 600 }}>{county.softMcCall.toLocaleString()}</td>
                  <td style={{ padding: "10px 12px", color: textPrimary, opacity: 0.8, fontSize: 12, maxWidth: 220 }}>{county.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Voter Journey */}
      <div style={{ background: cardBg, border: `1px solid rgba(251,191,36,0.3)`, borderRadius: 12, padding: 24, marginBottom: 28 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: "#fbbf24", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 4px" }}>
          Voter Journey — {mode === "primary" ? "Primary Persuasion Path (Now → June 16)" : "Runoff Persuasion Path (June 17 → Aug 25)"}
        </h3>
        <p style={{ fontSize: 13, color: textPrimary, opacity: 0.7, margin: "0 0 20px" }}>
          {mode === "primary"
            ? `How Exact Audience moves an undecided registered Republican to a confirmed ${candidateName} voter in 9 days.`
            : `How Exact Audience converts a Keating or McCall primary voter into a confirmed ${candidateName} runoff voter over 70 days.`}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {journey.map((step, i) => (
            <div key={i} style={{ display: "flex", gap: 0, alignItems: "stretch" }}>
              {/* Timeline spine */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 40, flexShrink: 0 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: `rgba(251,191,36,0.15)`, border: `2px solid ${accent}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: accent, flexShrink: 0, zIndex: 1 }}>{step.phase}</div>
                {i < journey.length - 1 && <div style={{ width: 2, flex: 1, background: `linear-gradient(to bottom, ${accent}40, ${accent}10)`, minHeight: 24 }} />}
              </div>
              {/* Content */}
              <div style={{ flex: 1, paddingLeft: 16, paddingBottom: i < journey.length - 1 ? 24 : 0 }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 6, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: textPrimary }}>{step.action}</span>
                  <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 20, background: `rgba(251,191,36,0.12)`, border: `1px solid rgba(251,191,36,0.3)`, color: "#fbbf24", fontWeight: 600 }}>{step.channel}</span>
                  <span style={{ fontSize: 11, color: textPrimary, opacity: 0.6 }}>{step.timing}</span>
                </div>
                <p style={{ fontSize: 13, color: textPrimary, opacity: 0.8, margin: 0, lineHeight: 1.6 }}>{step.goal}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Voter Profiles — SiteID-style cards */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: accent, textTransform: "uppercase" as const, letterSpacing: "0.08em", margin: "0 0 4px" }}>
              Identified Voter Profiles — OKC &amp; Tulsa Metro
            </h3>
            <p style={{ fontSize: 12, color: textPrimary, opacity: 0.6, margin: 0 }}>
              Registered Republicans matched to voter file — click any card to view full digital footprint &amp; personalized messaging
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {(["All", "Oklahoma", "Tulsa"] as const).map(f => (
              <button key={f} onClick={() => setAreaFilter(f as "All" | "OKC" | "Tulsa")} style={{
                padding: "6px 14px", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer",
                background: areaFilter === f ? `rgba(251,191,36,0.18)` : "transparent",
                border: areaFilter === f ? `1px solid rgba(251,191,36,0.4)` : `1px solid ${border}`,
                color: areaFilter === f ? "#fbbf24" : textPrimary,
              }}>{f === "Oklahoma" ? "OKC" : f === "Tulsa" ? "Tulsa" : f}</button>
            ))}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20 }}>
          {RICH_VOTER_PROFILES
            .filter(v => areaFilter === "All" || v.county === areaFilter)
            .map(voter => (
              <VoterCard key={voter.id} voter={voter} candidateSlug={candidateName.toLowerCase().replace(/\s+/g, "-")} />
            ))
          }
        </div>
      </div>
    </div>
  );
}
