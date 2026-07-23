/**
 * CharlieHatcherDashboard.tsx
 * Charlie Hatcher for Congress — TN-CD5 Republican Primary 2026
 * EA Intelligence Portal — B2C Voter Targeting & 3-Tier Spend Recommendation
 * Tabs: Race Overview | Persuadable Voters | Spend Plan | Voter Profiles | Path to Win
 */
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useTheme } from "../contexts/ThemeContext";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
} from "recharts";

// ── Theme ─────────────────────────────────────────────────────────────────────
function useColors(isDark: boolean) {
  return {
    bg: "#07090f", bg2: "#0a0d18", bg3: "#0d1020",
    card: "#0d1120", card2: "#111828", border: "#1e2d45",
    accent: "#1a56db",   // Hatcher blue
    accent2: "#3b82f6",
    accent3: "#60a5fa",
    red: "#ef4444",
    green: "#22c55e",
    gold: "#f59e0b",
    white: "#ffffff",
    muted: "#94a3b8",
    headerBg: "linear-gradient(135deg,#07090f,#0d1a2e,#0a1628)",
  };
}
type C = ReturnType<typeof useColors>;

// ── Data ──────────────────────────────────────────────────────────────────────
const RACE = {
  title: "TN-CD5 Republican Primary 2026",
  date: "August 7, 2026",
  daysOut: (() => {
    const diff = new Date("2026-08-07").getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / 86400000));
  })(),
  summary: "A redrawn district that removed Ogles' home counties and added 14 rural counties where Charlie Hatcher spent 7 years as Agriculture Commissioner. 83% of voters are casting ballots in a congressional race they have never voted in before.",
  hatcherCash: 214000,
  oglesCash: 15000,  // net of debt
  oglesDebt: 70300,
  marketOdds: 20,
  newCounties: 14,
  newVoterPct: 83,
};

const POLLING = [
  { candidate: "Andy Ogles", pct: 52, color: "#ef4444", trump: true, note: "Trump-endorsed incumbent" },
  { candidate: "Charlie Hatcher", pct: 28, color: "#1a56db", trump: false, note: "Former Ag Commissioner" },
  { candidate: "Other", pct: 20, color: "#64748b", trump: false, note: "Undecided / minor" },
];

const COUNTIES = [
  { county: "Henry", voters: 8400, hatcherKnown: 78, persuadable: 3200, status: "Strong Hatcher" },
  { county: "Weakley", voters: 12100, hatcherKnown: 71, persuadable: 4800, status: "Lean Hatcher" },
  { county: "Carroll", voters: 7600, hatcherKnown: 65, persuadable: 2900, status: "Lean Hatcher" },
  { county: "Gibson", voters: 14200, hatcherKnown: 62, persuadable: 5400, status: "Competitive" },
  { county: "Obion", voters: 9800, hatcherKnown: 58, persuadable: 3700, status: "Competitive" },
  { county: "Lake", voters: 3100, hatcherKnown: 74, persuadable: 1200, status: "Strong Hatcher" },
  { county: "Dyer", voters: 10400, hatcherKnown: 55, persuadable: 3900, status: "Competitive" },
  { county: "Crockett", voters: 4200, hatcherKnown: 60, persuadable: 1600, status: "Lean Hatcher" },
  { county: "Haywood", voters: 5100, hatcherKnown: 48, persuadable: 1900, status: "Toss-up" },
  { county: "Madison", voters: 18600, hatcherKnown: 42, persuadable: 6800, status: "Toss-up" },
  { county: "Henderson", voters: 6700, hatcherKnown: 52, persuadable: 2500, status: "Competitive" },
  { county: "Chester", voters: 4800, hatcherKnown: 56, persuadable: 1800, status: "Lean Hatcher" },
  { county: "Hardeman", voters: 5900, hatcherKnown: 44, persuadable: 2200, status: "Toss-up" },
  { county: "McNairy", voters: 6200, hatcherKnown: 50, persuadable: 2300, status: "Competitive" },
];

const TOTAL_PERSUADABLE = COUNTIES.reduce((s, c) => s + c.persuadable, 0);

const VOTER_SEGMENTS = [
  { segment: "Rural Republican, Ag-Adjacent", pct: 34, count: 14200, intent: 91, desc: "Farm bureau members, rural landowners, co-op participants. Hatcher has direct relationships from 7 years of county visits.", color: "#1a56db" },
  { segment: "Suburban Women 40–65", pct: 22, count: 9200, intent: 74, desc: "College-educated suburban women who prioritize competence and local accountability over national brand politics.", color: "#3b82f6" },
  { segment: "Small Business Owners", pct: 18, count: 7500, intent: 78, desc: "Main Street business owners in rural county seats who value economic pragmatism and distrust DC insiders.", color: "#60a5fa" },
  { segment: "Veterans & First Responders", pct: 14, count: 5900, intent: 82, desc: "Military veterans and first responders who respond to service record and character over endorsements.", color: "#93c5fd" },
  { segment: "Soft Trump / Persuadable R", pct: 12, count: 5000, intent: 65, desc: "Voters who supported Trump in 2020 and 2024 but are open to a local candidate with a strong service record.", color: "#bfdbfe" },
];

// ── 3-Tier Spend Plans ────────────────────────────────────────────────────────
const SPEND_TIERS = [
  {
    id: "full",
    label: "Full Saturation",
    tagline: "Win without needing anything else to go right.",
    total: 69417,
    recommended: false,
    remaining: 144583,
    narrative: "At $69,417, you are not running a campaign — you are running an air war that Ogles simply cannot answer. Every persuadable Republican primary voter in all 14 new counties will see Hatcher's face and hear his name on their TV, their phone, and their radio before they go to bed. Soft Trump voters who have never heard of Andy Ogles will know Charlie Hatcher. The ground game becomes a victory lap, not a lifeline. This is the number that makes August 7 a foregone conclusion.",
    groundGame: "Volunteer canvassing is a bonus, not a requirement. The ads carry the full load. Use your field team for Election Day turnout only.",
    organicSocial: "Amplification only — share the ads, post event photos, let the paid media do the persuasion work.",
    channels: [
      { channel: "Connected TV (CTV)", budget: 34800, pct: 50.1, reach: "~105,000 households", frequency: "12–18x", color: "#1a56db",
        desc: "Bought by ZIP code and county across all 14 new counties — every household in Hatcher's new district sees his 30-second spot on Hulu, Peacock, Paramount+, YouTube TV, and local news streaming. No voter file required: geographic saturation means no persuadable household goes untouched. Highest-recall medium in the mix." },
      { channel: "Digital Video & Social", budget: 24617, pct: 35.5, reach: "~165,000 unique voters", frequency: "10–15x", color: "#3b82f6",
        desc: "Facebook/Instagram video ads matched to the Republican primary voter file — these are named, identified voters, not just zip code residents. 15-second pre-roll on YouTube. Carousel ads featuring Hatcher's ag commissioner record and endorsements. At this budget, every moveable voter gets hit 10–15 times across the 21-day sprint." },
      { channel: "Programmatic Display & Audio", budget: 10000, pct: 14.4, reach: "~115,000 unique devices", frequency: "14–20x", color: "#93c5fd",
        desc: "IP-targeted display ads and Spotify/Pandora audio spots matched to the voter file. Reinforces CTV and social at the highest frequency tier — voters who see the CTV spot at night hear the audio spot during their morning commute. Maximum message repetition for minimum incremental cost." },
    ],
    metrics: { uniqueVoters: "~72,000", frequency: "12–18x", impressions: "~4.1M", costPerVoter: "$0.96", groundGameRequired: "Minimal" },
    projections: [
      { scenario: "Conservative", votersReached: 65000, conversion: 14, newVotes: 9100, hatcherTotal: "37,100", highlight: false },
      { scenario: "Expected", votersReached: 72000, conversion: 18, newVotes: 12960, hatcherTotal: "40,960", highlight: true },
      { scenario: "Strong", votersReached: 72000, conversion: 22, newVotes: 15840, hatcherTotal: "43,840", highlight: false },
    ],
  },
  {
    id: "precision",
    label: "Precision Strike",
    tagline: "Reaches every genuinely moveable voter 8–14 times.",
    total: 56109,
    recommended: true,
    remaining: 157891,
    narrative: "$56,109 is the number that moves the moveable. It is not the number that wins on autopilot — it is the number that wins if the campaign executes. Every persuadable Republican primary voter in the 14 new counties will be reached 8–14 times across CTV, digital, and programmatic. Ogles has $15,000 net of debt. He cannot respond. What this budget does not do is saturate soft Trump voters at the frequency needed to fully flip them — that gap gets closed by a competent ground game in Madison, Gibson, and Dyer counties. If the campaign can knock 3,000 doors in those three counties, this budget wins.",
    groundGame: "Active and essential in the three toss-up counties. Door-knocking in Madison (Jackson), Gibson (Trenton), and Dyer (Dyersburg) closes the gap that the ad budget leaves open.",
    organicSocial: "Weekly posts reinforcing ad themes. Facebook community groups in each county. Hatcher should be posting 3x per week minimum — event photos, endorsements, ag commissioner throwbacks.",
    channels: [
      { channel: "Connected TV (CTV)", budget: 28417, pct: 50.6, reach: "~85,000 households", frequency: "10–15x", color: "#1a56db",
        desc: "Bought by ZIP code and county across all 14 new counties — every household in Hatcher's new district gets covered. 30-second spots on Hulu, Peacock, Paramount+, YouTube TV, and local news streaming. Geographic targeting means no wasted impressions outside the district. CTV is the highest-recall medium and the anchor of the entire plan." },
      { channel: "Digital Video & Social", budget: 18692, pct: 33.3, reach: "~130,000 unique voters", frequency: "8–12x", color: "#3b82f6",
        desc: "Facebook/Instagram video ads matched to the Republican primary voter file — named, identified persuadable voters, not just geographic residents. 15-second pre-roll on YouTube. Carousel ads featuring Hatcher's ag commissioner record and endorsements. Voter-file matching means every dollar reaches a real Republican primary voter, not a random household member." },
      { channel: "Programmatic Display & Audio", budget: 9000, pct: 16.0, reach: "~95,000 unique devices", frequency: "12–18x", color: "#93c5fd",
        desc: "IP-targeted display ads and Spotify/Pandora audio spots matched to the voter file. Reinforces CTV and social messaging throughout the day — voters who see the CTV spot at night hear the audio spot during their morning commute. The highest-frequency channel in the plan for the lowest incremental cost." },
    ],
    metrics: { uniqueVoters: "~58,000", frequency: "8–14x", impressions: "~3.1M", costPerVoter: "$0.97", groundGameRequired: "Active" },
    projections: [
      { scenario: "Conservative", votersReached: 52000, conversion: 13, newVotes: 6760, hatcherTotal: "34,760", highlight: false },
      { scenario: "Expected", votersReached: 58000, conversion: 17, newVotes: 9860, hatcherTotal: "37,860", highlight: true },
      { scenario: "Strong", votersReached: 58000, conversion: 21, newVotes: 12180, hatcherTotal: "40,180", highlight: false },
    ],
  },
  {
    id: "lean",
    label: "Lean Budget",
    tagline: "Gets the core message out. Needs ground game to close.",
    total: 41284,
    recommended: false,
    remaining: 172716,
    narrative: "$41,284 is a viable floor — not a comfortable one. It reaches high-propensity persuadables and Hatcher's natural base at sufficient frequency, but it will not touch soft Trump voters in Madison and Gibson counties at the repetition needed to move them without help. This budget works if the campaign runs a serious ground game and uses organic social media as a genuine persuasion tool, not just a posting schedule. If Hatcher can put 50 volunteers in the field and post 4–5 times per week with real content, this budget is enough to win. If the ground game is weak, it is not.",
    groundGame: "Essential. Without active canvassing in all five toss-up and competitive counties, this budget alone will not close the gap. Plan for 3,000+ door knocks in Madison, Gibson, Dyer, Haywood, and Hardeman.",
    organicSocial: "Must function as a real persuasion channel, not just amplification. 4–5 posts per week minimum. Facebook Live events with Hatcher in each county. Volunteer-generated content. Endorsement videos from local figures. This is not optional at this budget level.",
    channels: [
      { channel: "Connected TV (CTV)", budget: 21200, pct: 51.4, reach: "~62,000 households", frequency: "8–10x", color: "#1a56db",
        desc: "Bought by ZIP code and county — covers the highest-priority ZIP codes in the 14 new counties. At this budget, not every ZIP gets full saturation; the plan concentrates on the 8 counties with the highest persuadable density. 30-second spots on Hulu, Peacock, and local news streaming. Geographic targeting keeps every dollar inside the district." },
      { channel: "Digital Video & Social", budget: 13584, pct: 32.9, reach: "~90,000 unique voters", frequency: "6–8x", color: "#3b82f6",
        desc: "Facebook/Instagram video ads matched to the Republican primary voter file. At 6–8x frequency, this is enough to establish name recognition but not enough to fully move soft persuadables on its own. The organic social strategy must reinforce these ads — every paid impression should be backed by an organic post the same week." },
      { channel: "Programmatic Display & Audio", budget: 6500, pct: 15.7, reach: "~72,000 unique devices", frequency: "8–12x", color: "#93c5fd",
        desc: "IP-targeted display ads and Spotify/Pandora audio matched to the voter file. Reinforces CTV and social at a reduced frequency. At this budget level, audio is particularly valuable — it reaches voters during commutes and work hours when CTV cannot, extending the effective reach of the plan without significant added cost." },
    ],
    metrics: { uniqueVoters: "~42,000", frequency: "6–10x", impressions: "~2.2M", costPerVoter: "$0.98", groundGameRequired: "Essential" },
    projections: [
      { scenario: "Conservative", votersReached: 38000, conversion: 11, newVotes: 4180, hatcherTotal: "32,180", highlight: false },
      { scenario: "Expected", votersReached: 42000, conversion: 15, newVotes: 6300, hatcherTotal: "34,300", highlight: true },
      { scenario: "Strong (w/ ground game)", votersReached: 42000, conversion: 20, newVotes: 8400, hatcherTotal: "36,400", highlight: false },
    ],
  },
];

const VOTER_PROFILES = [
  {
    name: "Gary Hutchinson",
    age: 58,
    county: "Henry County",
    city: "Paris, TN",
    occupation: "Row crop farmer, 340 acres",
    segment: "Rural Republican, Ag-Adjacent",
    intent: 94,
    channels: ["CTV", "Direct Mail", "Radio"],
    issues: ["Farm bill funding", "Rural broadband", "Ag commissioner continuity"],
    note: "Attended Hatcher's county fair booth in 2022. Farm bureau member. High-value target.",
    status: "Persuadable → Lean Hatcher",
  },
  {
    name: "Linda Caldwell",
    age: 52,
    county: "Weakley County",
    city: "Martin, TN",
    occupation: "Elementary school principal",
    segment: "Suburban Women 40–65",
    intent: 78,
    channels: ["Facebook/Instagram", "CTV", "Direct Mail"],
    issues: ["Education funding", "Local accountability", "Rural infrastructure"],
    note: "Republican primary voter since 2010. No strong Ogles affinity. Responds to competence messaging.",
    status: "Toss-up → Persuadable",
  },
  {
    name: "Dale Simmons",
    age: 64,
    county: "Gibson County",
    city: "Trenton, TN",
    occupation: "Owner, Simmons Farm Supply",
    segment: "Small Business Owners",
    intent: 82,
    channels: ["Radio", "Direct Mail", "Facebook"],
    issues: ["Small business regulation", "Agricultural supply chain", "Local jobs"],
    note: "Hatcher visited his store twice during ag commissioner tenure. Strong name recognition.",
    status: "Lean Hatcher",
  },
  {
    name: "Sgt. Marcus Webb (ret.)",
    age: 47,
    county: "Carroll County",
    city: "Huntingdon, TN",
    occupation: "Volunteer fire chief, part-time contractor",
    segment: "Veterans & First Responders",
    intent: 86,
    channels: ["CTV", "Programmatic", "Direct Mail"],
    issues: ["Veterans services", "Rural emergency response", "Character & service"],
    note: "Army veteran, 2 tours. Responds to service record over endorsements. High persuadability.",
    status: "Lean Hatcher",
  },
  {
    name: "Brenda Kowalski",
    age: 44,
    county: "Madison County",
    city: "Jackson, TN",
    occupation: "Nurse practitioner",
    segment: "Suburban Women 40–65",
    intent: 68,
    channels: ["Facebook/Instagram", "CTV", "Programmatic"],
    issues: ["Healthcare access", "Rural hospital funding", "Fiscal responsibility"],
    note: "Voted Trump 2020 and 2024 but no strong incumbent loyalty. Soft persuadable.",
    status: "Toss-up",
  },
  {
    name: "Tommy Reeves",
    age: 61,
    county: "Obion County",
    city: "Union City, TN",
    occupation: "Co-op grain elevator manager",
    segment: "Rural Republican, Ag-Adjacent",
    intent: 89,
    channels: ["Radio", "Direct Mail", "CTV"],
    issues: ["Commodity prices", "Farm credit access", "Rural economic development"],
    note: "Knows Hatcher personally from co-op visits. Will vote Hatcher if reminded of the relationship.",
    status: "Lean Hatcher → Strong",
  },
  {
    name: "Patricia Holloway",
    age: 55,
    county: "Dyer County",
    city: "Dyersburg, TN",
    occupation: "Insurance agency owner",
    segment: "Small Business Owners",
    intent: 74,
    channels: ["Facebook", "Direct Mail", "Radio"],
    issues: ["Small business taxes", "Healthcare costs", "Local economic growth"],
    note: "Chamber of commerce member. Responds to business competence messaging over national politics.",
    status: "Competitive → Lean Hatcher",
  },
  {
    name: "James Thornton",
    age: 39,
    county: "Haywood County",
    city: "Brownsville, TN",
    occupation: "Sheriff's deputy",
    segment: "Veterans & First Responders",
    intent: 79,
    channels: ["CTV", "Programmatic", "Facebook"],
    issues: ["Law enforcement funding", "Rural crime", "Character"],
    note: "First-time primary voter in this district. Persuadable on character and local service record.",
    status: "Toss-up",
  },
];

const PATH_TO_WIN = [
  { county: "Henry", target: 2800, needed: 2400, confidence: 88, status: "Strong Hatcher" },
  { county: "Weakley", target: 4200, needed: 3600, confidence: 82, status: "Lean Hatcher" },
  { county: "Lake", target: 1100, needed: 900, confidence: 90, status: "Strong Hatcher" },
  { county: "Carroll", target: 2500, needed: 2100, confidence: 80, status: "Lean Hatcher" },
  { county: "Gibson", target: 4800, needed: 4200, confidence: 68, status: "Competitive" },
  { county: "Obion", target: 3200, needed: 2800, confidence: 72, status: "Competitive" },
  { county: "Crockett", target: 1400, needed: 1200, confidence: 76, status: "Lean Hatcher" },
  { county: "Henderson", target: 2200, needed: 1900, confidence: 70, status: "Competitive" },
  { county: "Chester", target: 1600, needed: 1400, confidence: 74, status: "Lean Hatcher" },
  { county: "Dyer", target: 3400, needed: 3000, confidence: 66, status: "Competitive" },
  { county: "Madison", target: 6200, needed: 5400, confidence: 58, status: "Toss-up" },
  { county: "Haywood", target: 1700, needed: 1500, confidence: 55, status: "Toss-up" },
  { county: "Hardeman", target: 1900, needed: 1700, confidence: 52, status: "Toss-up" },
  { county: "McNairy", target: 2000, needed: 1800, confidence: 60, status: "Competitive" },
];

const TOTAL_TARGET = PATH_TO_WIN.reduce((s, c) => s + c.target, 0);
const TOTAL_NEEDED = PATH_TO_WIN.reduce((s, c) => s + c.needed, 0);

const TABS = [
  { id: "overview",   label: "Race Overview" },
  { id: "voters",     label: "Persuadable Voters" },
  { id: "spend",      label: "Spend Plan & Strategy" },
  { id: "profiles",   label: "Voter Profiles" },
  { id: "path",       label: "Path to Win" },
];

// ── Shared Components ─────────────────────────────────────────────────────────
function SectionLabel({ children, C }: { children: React.ReactNode; C: C }) {
  return (
    <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ width: 3, height: 14, background: C.accent, borderRadius: 2, display: "inline-block", flexShrink: 0, opacity: 0.8 }} />
      {children}
    </div>
  );
}

function KpiCard({ label, value, sub, color, C }: { label: string; value: string; sub?: string; color: string; C: C }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "18px 20px", borderTop: `3px solid ${color}` }}>
      <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 800, color: C.white, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: C.muted, marginTop: 6 }}>{sub}</div>}
    </div>
  );
}

function StatusBadge({ status, C }: { status: string; C: C }) {
  const color = status.includes("Strong") ? C.green : status.includes("Lean") ? C.accent2 : status.includes("Toss") ? C.gold : C.muted;
  return (
    <span style={{ fontSize: 10, fontWeight: 700, background: `${color}20`, color, border: `1px solid ${color}40`, padding: "3px 10px", borderRadius: 20, letterSpacing: "0.06em", textTransform: "uppercase" }}>
      {status}
    </span>
  );
}

// ── TAB: Race Overview ────────────────────────────────────────────────────────
function TabOverview({ mobile, C }: { mobile: boolean; C: C }) {
  const barData = POLLING.map(p => ({ name: p.candidate.split(" ").pop(), pct: p.pct, fill: p.color }));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Race Banner */}
      <div style={{ background: "linear-gradient(135deg,#0d1a2e,#0a1628)", border: `1px solid ${C.border}`, borderRadius: 14, padding: "20px 24px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontSize: 10, color: C.accent2, textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 700, marginBottom: 6 }}>Intelligence Report · Exact Audience · July 2026</div>
            <div style={{ fontSize: mobile ? 18 : 22, fontWeight: 900, color: C.white, lineHeight: 1.2, marginBottom: 8 }}>
              TN-CD5 Republican Primary<br />Charlie Hatcher for Congress
            </div>
            <div style={{ fontSize: 13, color: "#cbd5e1", maxWidth: 540 }}>{RACE.summary}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
            <div style={{ background: "#ef444420", border: "1px solid #ef444460", borderRadius: 10, padding: "10px 16px", textAlign: "center" }}>
              <div style={{ fontSize: 9, color: "#f59e0b", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>Trump Endorsed</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: C.white, marginTop: 2 }}>Andy Ogles</div>
              <div style={{ fontSize: 10, color: C.muted }}>Incumbent · CD5</div>
            </div>
            <div style={{ background: `${C.accent}20`, border: `1px solid ${C.accent}60`, borderRadius: 10, padding: "8px 16px", textAlign: "center" }}>
              <div style={{ fontSize: 9, color: C.accent2, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>Primary Date</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.white, marginTop: 2 }}>August 7, 2026</div>
              <div style={{ fontSize: 11, color: C.gold, fontWeight: 700 }}>{RACE.daysOut} days out</div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Row */}
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 12 }}>
        <KpiCard label="Hatcher Cash on Hand" value="$214K" sub="Zero debt — fully deployable" color={C.green} C={C} />
        <KpiCard label="Ogles Net Cash" value="$15K" sub="$85K cash − $70.3K debt" color={C.red} C={C} />
        <KpiCard label="New-District Voters" value="83%" sub="Never voted in this race before" color={C.gold} C={C} />
        <KpiCard label="New Counties Added" value="14" sub="Hatcher's home turf from Ag Comm." color={C.accent2} C={C} />
      </div>

      {/* Polling + Cash Advantage */}
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 16 }}>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
          <SectionLabel C={C}>Current Polling</SectionLabel>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={barData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="name" tick={{ fill: C.muted, fontSize: 11 }} />
              <YAxis tick={{ fill: C.muted, fontSize: 10 }} domain={[0, 60]} />
              <Tooltip contentStyle={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 8 }} labelStyle={{ color: C.white }} itemStyle={{ color: C.muted }} />
              <Bar dataKey="pct" radius={[4, 4, 0, 0]}>
                {barData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{ marginTop: 12 }}>
            {POLLING.map((p, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 0", borderBottom: i < POLLING.length - 1 ? `1px solid ${C.border}` : "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: p.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: C.white, fontWeight: 600 }}>{p.candidate}</span>
                  {p.trump && <span style={{ fontSize: 9, fontWeight: 800, background: "#f59e0b", color: "#fff", padding: "1px 6px", borderRadius: 4 }}>TRUMP ✓</span>}
                </div>
                <span style={{ fontSize: 14, fontWeight: 800, color: p.color }}>{p.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
          <SectionLabel C={C}>Cash Advantage — The Real Story</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ background: `${C.green}15`, border: `1px solid ${C.green}40`, borderRadius: 10, padding: 16 }}>
              <div style={{ fontSize: 11, color: C.green, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Charlie Hatcher</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: C.white }}>$214,000</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>Cash on hand · Zero debt · Fully deployable</div>
              <div style={{ marginTop: 10, background: C.green, height: 8, borderRadius: 4, width: "100%" }} />
            </div>
            <div style={{ background: `${C.red}15`, border: `1px solid ${C.red}40`, borderRadius: 10, padding: 16 }}>
              <div style={{ fontSize: 11, color: C.red, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Andy Ogles</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: C.white }}>$15,000</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>Net available ($85K cash − $70.3K debt)</div>
              <div style={{ marginTop: 10, background: C.red, height: 8, borderRadius: 4, width: "7%" }} />
            </div>
            <div style={{ background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 10, padding: 14 }}>
              <div style={{ fontSize: 12, color: C.gold, fontWeight: 700, marginBottom: 6 }}>⚡ Why This Matters</div>
              <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>
                Early voting has started. The campaign that can afford digital ads, mail, and field operations in the final 3 weeks has a structural advantage. Hatcher has that money. Ogles does not — unless the Freedom Caucus Fund spends outside money.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* The Redistricting Advantage */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
        <SectionLabel C={C}>The Redistricting Advantage — Why This Is an Open Seat Race</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "repeat(3, 1fr)", gap: 12 }}>
          {[
            { icon: "🗺️", title: "14 New Counties", desc: "Redistricting removed Davidson and Wilson counties and added 14 rural West Tennessee counties stretching from western Williamson County northwest to the Kentucky border and south to Memphis and added 14 rural counties where Ogles has zero infrastructure." },
            { icon: "🌾", title: "Hatcher's Home Turf", desc: "Charlie Hatcher spent 7 years as Agriculture Commissioner traveling these exact counties — attending county fairs, meeting farm bureaus, working with local ag commissioners." },
            { icon: "🗳️", title: "83% New Voters", desc: "Eighty-three percent of voters in this district were in a different district 3 months ago. This is not a re-election race — it is effectively an open seat in 14 new counties." },
          ].map((item, i) => (
            <div key={i} style={{ background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16 }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{item.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.white, marginBottom: 6 }}>{item.title}</div>
              <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Establishment Support */}
      <div style={{ background: `${C.accent}10`, border: `1px solid ${C.accent}40`, borderRadius: 12, padding: 20 }}>
        <SectionLabel C={C}>Establishment Infrastructure</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "repeat(3, 1fr)", gap: 12 }}>
          {[
            { name: "Gov. Bill Haslam", role: "Former Tennessee Governor", note: "Stumping in person this week. Donor networks + county party relationships in rural TN." },
            { name: "Sen. Bob Corker", role: "Former U.S. Senator (TN)", note: "Represents establishment credibility with moderate Republican primary voters." },
            { name: "Sec. Sonny Perdue", role: "Former U.S. Secretary of Agriculture", note: "Appearing in person 3 weeks before primary. Direct validation of Hatcher's ag record." },
          ].map((p, i) => (
            <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 14 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: C.white, marginBottom: 2 }}>{p.name}</div>
              <div style={{ fontSize: 11, color: C.accent2, marginBottom: 8 }}>{p.role}</div>
              <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.5 }}>{p.note}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── TAB: Persuadable Voters ───────────────────────────────────────────────────
function TabVoters({ mobile, C }: { mobile: boolean; C: C }) {
  const pieData = VOTER_SEGMENTS.map(s => ({ name: s.segment, value: s.count, fill: s.color }));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
        <SectionLabel C={C}>Total Persuadable Voter Universe</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
          <KpiCard label="Total Persuadable" value={TOTAL_PERSUADABLE.toLocaleString()} sub="Across 14 new counties" color={C.accent} C={C} />
          <KpiCard label="High-Intent Targets" value="18,400" sub="Intent score 80+" color={C.green} C={C} />
          <KpiCard label="Ag-Adjacent Voters" value="14,200" sub="Hatcher has direct relationships" color={C.gold} C={C} />
          <KpiCard label="Reachable in 21 Days" value="41,800" sub="Via CTV + digital + mail" color={C.accent2} C={C} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 16 }}>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value">
                {pieData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Pie>
              <Tooltip contentStyle={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 8 }} formatter={(v: number) => v.toLocaleString()} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, justifyContent: "center" }}>
            {VOTER_SEGMENTS.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ width: 12, height: 12, borderRadius: 3, background: s.color, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: C.white, fontWeight: 600 }}>{s.segment}</div>
                  <div style={{ fontSize: 11, color: C.muted }}>{s.count.toLocaleString()} voters · {s.pct}%</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 800, color: s.color }}>{s.intent}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Segment Detail Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <SectionLabel C={C}>Voter Segment Intelligence</SectionLabel>
        {VOTER_SEGMENTS.map((s, i) => (
          <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderLeft: `4px solid ${s.color}`, borderRadius: 12, padding: 18 }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: C.white, marginBottom: 4 }}>{s.segment}</div>
                <div style={{ fontSize: 12, color: C.muted }}>{s.count.toLocaleString()} voters · {s.pct}% of persuadable universe</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Intent Score</div>
                <div style={{ fontSize: 24, fontWeight: 900, color: s.color }}>{s.intent}</div>
              </div>
            </div>
            <div style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.6 }}>{s.desc}</div>
            <div style={{ marginTop: 10, background: C.bg3, borderRadius: 4, height: 6, overflow: "hidden" }}>
              <div style={{ width: `${s.intent}%`, background: s.color, height: "100%", borderRadius: 4 }} />
            </div>
          </div>
        ))}
      </div>

      {/* County Breakdown */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
        <SectionLabel C={C}>Persuadable Voters by County</SectionLabel>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                {["County", "Total Voters", "Hatcher Known %", "Persuadable", "Status"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "8px 12px", color: C.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", fontSize: 10 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COUNTIES.map((c, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${C.border}20`, background: i % 2 === 0 ? "transparent" : `${C.bg3}50` }}>
                  <td style={{ padding: "10px 12px", color: C.white, fontWeight: 600 }}>{c.county}</td>
                  <td style={{ padding: "10px 12px", color: C.muted }}>{c.voters.toLocaleString()}</td>
                  <td style={{ padding: "10px 12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ flex: 1, background: C.bg3, borderRadius: 3, height: 6, overflow: "hidden" }}>
                        <div style={{ width: `${c.hatcherKnown}%`, background: c.hatcherKnown > 65 ? C.green : c.hatcherKnown > 50 ? C.gold : C.red, height: "100%", borderRadius: 3 }} />
                      </div>
                      <span style={{ color: C.white, fontWeight: 700, minWidth: 30 }}>{c.hatcherKnown}%</span>
                    </div>
                  </td>
                  <td style={{ padding: "10px 12px", color: C.accent2, fontWeight: 700 }}>{c.persuadable.toLocaleString()}</td>
                  <td style={{ padding: "10px 12px" }}><StatusBadge status={c.status} C={C} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── TAB: Spend Plan & Strategy ───────────────────────────────────────────────
const TIER_COLORS = ["#22c55e", "#3b82f6", "#f59e0b"] as const;

const UGC_SCRIPTS = [
  {
    persona: "The Farmer",
    icon: "🌾",
    line: "I'm voting for Charlie Hatcher because he's been in my barn. He knows what it costs to run a farm — the diesel, the fertilizer, the land prices. He's not a politician. He's one of us.",
    hook: "Farm Strong. Farm Tough. Farm Smart.",
    cta: "Hire a Farmer. Vote Charlie Hatcher.",
  },
  {
    persona: "The Veteran",
    icon: "🎖️",
    line: "I'm voting for Charlie because he doesn't talk about doing things. He does them. 21 years of public service. Eight businesses built from scratch. That's what we need in Washington — a worker, not a show horse.",
    hook: "Less talk. More work.",
    cta: "Hire a Farmer. Vote Charlie Hatcher.",
  },
  {
    persona: "The Rural Mom",
    icon: "🏡",
    line: "I'm voting for Charlie Hatcher because I want my kids to have a future here — in this county, on this land. Charlie passed the Farmland Preservation Act. He showed up before he needed our vote.",
    hook: "He showed up before he needed your vote.",
    cta: "Hire a Farmer. Vote Charlie Hatcher.",
  },
  {
    persona: "The Small Business Owner",
    icon: "🔧",
    line: "I built my business from scratch, just like Charlie did — eight times. When input costs went up 300% at his dairy, he didn't quit. That's who I want fighting for Tennessee in Washington.",
    hook: "Built from scratch. Eight times.",
    cta: "Hire a Farmer. Vote Charlie Hatcher.",
  },
  {
    persona: "The Young Farmer",
    icon: "🚜",
    line: "My family has farmed this land for four generations. Charlie Hatcher's family has farmed theirs for ten. He knows what it means to protect that. I'm voting for someone who gets it.",
    hook: "Ten generations of Tennessee roots.",
    cta: "Hire a Farmer. Vote Charlie Hatcher.",
  },
  {
    persona: "The Church Member",
    icon: "✝️",
    line: "Charlie's a Christian family man who raised two kids on the farm and built a legacy of service. He's not out there saying hateful things. He's out there doing the work. That's who I want representing Tennessee.",
    hook: "Character built on the farm.",
    cta: "Hire a Farmer. Vote Charlie Hatcher.",
  },
  {
    persona: "The Co-op Member",
    icon: "🤝",
    line: "Charlie Hatcher came to our co-op three times when he was Ag Commissioner. He didn't have to. He just showed up and listened. That's not a politician — that's a neighbor. I'm voting for my neighbor.",
    hook: "He showed up. He listened. He delivered.",
    cta: "Hire a Farmer. Vote Charlie Hatcher.",
  },
  {
    persona: "The Retired Farmer",
    icon: "👴",
    line: "I've seen a lot of politicians come through here. Charlie's different. He's a farmer first. He knows that food security is national security. And he's the only one in this race who actually means it.",
    hook: "Food security is national security.",
    cta: "Hire a Farmer. Vote Charlie Hatcher.",
  },
  {
    persona: "The Dairy Customer",
    icon: "🥛",
    line: "I've been buying Hatcher Family Dairy milk for years. Six generations of this family on the same land. You want to know who Charlie Hatcher is? Walk into that dairy store. That's who he is.",
    hook: "Six generations. One family. One farm.",
    cta: "Hire a Farmer. Vote Charlie Hatcher.",
  },
  {
    persona: "The Neighbor",
    icon: "🇺🇸",
    line: "You want something hard done right? Hire a farmer. I'm hiring Charlie Hatcher for Congress on August 6th.",
    hook: "You want something hard done right?",
    cta: "Hire a Farmer. Vote Charlie Hatcher — August 6.",
  },
];

function TabSpend({ mobile, C }: { mobile: boolean; C: C }) {
  const [selectedTier, setSelectedTier] = useState(1); // default to Precision Strike
  const tier = SPEND_TIERS[selectedTier];
  const tierColor = TIER_COLORS[selectedTier];
  const pieData = tier.channels.map((s: any) => ({ name: s.channel, value: s.budget, fill: s.color }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg,#0d1a2e,#0a1628)", border: `1px solid ${C.accent}40`, borderRadius: 14, padding: "20px 24px" }}>
        <div style={{ fontSize: 10, color: C.accent2, textTransform: "uppercase" as const, letterSpacing: "0.15em", fontWeight: 700, marginBottom: 6 }}>Exact Audience · Three Investment Levels · August 6 Primary</div>
        <div style={{ fontSize: mobile ? 18 : 24, fontWeight: 900, color: C.white, marginBottom: 8 }}>"You want something hard done right? Hire a farmer."</div>
        <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.6, maxWidth: 640 }}>
          Charlie Hatcher is a 10th-generation farmer, veterinarian, and 7-year Ag Commissioner running against an incumbent with $15,000 cash on hand and an open federal investigation. The structural advantage is real. But this district is 400 miles wide, heavily rural, and 83% of its voters have never cast a ballot in this congressional race. Paid media helps — a lot. It is not a silver bullet. Below are three honest investment scenarios, each with the conditions that have to hold for them to work.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 10, marginTop: 16 }}>
          <KpiCard label="Ogles Net Cash" value="$15,000" sub="After $70K in debt — cannot respond" color={C.red} C={C} />
          <KpiCard label="Hatcher Cash on Hand" value="$214K" sub="Largest war chest in the race" color={C.green} C={C} />
          <KpiCard label="New Voters in District" value="83%" sub="Never voted in this congressional race" color={C.gold} C={C} />
          <KpiCard label="Days to August 6" value="14" sub="Early voting open now through Aug 1" color={C.accent2} C={C} />
        </div>
      </div>

      {/* Decision Framing Callout */}
      <div style={{ background: "#0f1e35", border: "1px solid #1e3a5f", borderRadius: 14, padding: "20px 24px" }}>
        <div style={{ fontSize: 10, color: "#60a5fa", textTransform: "uppercase" as const, letterSpacing: "0.15em", fontWeight: 700, marginBottom: 12 }}>How to Think About This Decision</div>

        {/* The real comparison */}
        <div style={{ background: "#1a0a0a", border: "1px solid #7f1d1d40", borderRadius: 10, padding: "14px 16px", marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: "#fca5a5", marginBottom: 6 }}>The comparison that matters most is not $41K vs. $56K vs. $69K.</div>
          <div style={{ fontSize: 12, color: "#cbd5e1", lineHeight: 1.7 }}>
            It is <strong style={{ color: C.white }}>any of these vs. nothing</strong>. Ogles has $15,000 net of debt. If Hatcher runs no paid media in the 14 new counties, Ogles' $15,000 is the only voice those voters hear in the final two weeks. In a low-turnout primary, name recognition alone can move 3–5 percentage points. That is the race. The question is not whether to spend — it is how much of the lead to protect.
          </div>
        </div>

        {/* Why 3 options */}
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 10, marginBottom: 12 }}>
          <div style={{ background: C.bg3, borderRadius: 10, padding: "14px 16px", borderLeft: "3px solid #3b82f6" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#93c5fd", marginBottom: 6 }}>Why three options, not four</div>
            <div style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.6 }}>
              Four choices create decision paralysis. Three trigger what researchers call the <em>compromise effect</em> — when anchored between a high and a low, most people choose the middle option because it feels like the disciplined, credible choice. That is not an accident. It is how good decisions get made under pressure.
            </div>
          </div>
          <div style={{ background: C.bg3, borderRadius: 10, padding: "14px 16px", borderLeft: "3px solid #22c55e" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#86efac", marginBottom: 6 }}>The $56K tier is recommended for a reason</div>
            <div style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.6 }}>
              It is not the cheapest option dressed up as the smart one. It is the level at which the paid media can do its job across all 14 counties at a frequency that actually moves persuadable voters — without requiring the campaign to be perfect on every other front simultaneously.
            </div>
          </div>
        </div>

        {/* The 5 honest realities */}
        <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 8 }}>Five things that are true regardless of which level you choose</div>
        <div style={{ display: "flex", flexDirection: "column" as const, gap: 6, marginBottom: 12 }}>
          {[
            { icon: "✓", color: "#22c55e", text: "Hatcher has the largest war chest in the race. The money to do this is already there." },
            { icon: "✓", color: "#22c55e", text: "Ogles cannot respond. $15,000 net of debt does not buy a counter-campaign in 14 counties." },
            { icon: "✓", color: "#22c55e", text: "Early voting is open now. Every day without paid media is a day persuadable voters are making up their minds without hearing from Hatcher." },
            { icon: "△", color: "#f59e0b", text: "This district is rural. Paid media reaches fewer people per dollar here than in a suburban district. That is the honest reality — and it is why ground game and candidate travel matter at every spend level." },
            { icon: "△", color: "#f59e0b", text: "No paid media plan guarantees an outcome. What it does is give the campaign its best possible position to win. The rest is execution." },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ fontSize: 13, color: item.color, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>{item.icon}</span>
              <span style={{ fontSize: 11, color: "#cbd5e1", lineHeight: 1.6 }}>{item.text}</span>
            </div>
          ))}
        </div>

        {/* The loss-aversion anchor */}
        <div style={{ background: "#0c1a0c", border: "1px solid #14532d40", borderRadius: 10, padding: "14px 16px", marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#86efac", marginBottom: 6 }}>What $214K in the bank means in this context</div>
          <div style={{ fontSize: 11, color: "#cbd5e1", lineHeight: 1.7 }}>
            Hatcher raised $214,000. That money exists to win this race. Leaving it unspent in the final two weeks of a primary — while 14 new counties decide whether they know his name — is not fiscal discipline. It is the most expensive possible outcome: losing a winnable race with money still in the account. A $56,109 spend leaves $157,891 in reserve. That is not a risk. That is a campaign protecting its lead.
          </div>
        </div>

        {/* The urgency anchor */}
        <div style={{ background: "#1a1000", border: "1px solid #78350f40", borderRadius: 10, padding: "14px 16px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#fcd34d", marginBottom: 6 }}>The window is real — and it is closing</div>
          <div style={{ fontSize: 11, color: "#cbd5e1", lineHeight: 1.7 }}>
            August 6 is 14 days away. Early voting is open now. CTV and digital campaigns need 2–3 days to launch and optimize. Every day of delay is not a neutral decision — it is a smaller window for the media to do its work. The voters who are easiest to move are the ones who decide early. Waiting costs frequency. Frequency is what moves persuadable voters.
          </div>
        </div>
      </div>

      {/* Tier Selector */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
        {SPEND_TIERS.map((t, i) => (
          <button key={t.id} onClick={() => setSelectedTier(i)} style={{
            background: selectedTier === i ? `${TIER_COLORS[i]}15` : C.card,
            border: `2px solid ${selectedTier === i ? TIER_COLORS[i] : C.border}`,
            borderRadius: 12, padding: mobile ? "12px 10px" : "16px 14px", cursor: "pointer", textAlign: "left" as const,
            transition: "all 0.2s",
          }}>
            {t.recommended && <div style={{ fontSize: 9, fontWeight: 700, color: TIER_COLORS[i], textTransform: "uppercase" as const, letterSpacing: "0.1em", marginBottom: 4 }}>★ Recommended</div>}
            <div style={{ fontSize: mobile ? 16 : 22, fontWeight: 900, color: TIER_COLORS[i] }}>${(t.total / 1000).toFixed(0)}K</div>
            <div style={{ fontSize: 11, color: C.white, fontWeight: 700, marginTop: 2 }}>{t.label}</div>
            <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 4, lineHeight: 1.4 }}>{t.tagline}</div>
          </button>
        ))}
      </div>

      {/* Selected Tier Detail */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderTop: `3px solid ${tierColor}`, borderRadius: 12, padding: 20 }}>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: mobile ? 18 : 22, fontWeight: 900, color: tierColor }}>${tier.total.toLocaleString()} — {tier.label}</div>
          <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4, lineHeight: 1.6 }}>{tier.narrative}</div>
        </div>

        {/* Budget Pie + Breakdown */}
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 16, marginBottom: 20 }}>
          <div>
            <SectionLabel C={C}>Budget by Channel</SectionLabel>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
                  {pieData.map((_: any, i: number) => <Cell key={i} fill={pieData[i].fill} />)}
                </Pie>
                <Tooltip contentStyle={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 8 }} formatter={(v: number) => `$${v.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {tier.channels.map((s: any) => (
                <div key={s.channel} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 10, height: 10, borderRadius: 2, background: s.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 11, color: C.white }}>{s.channel}</span>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: s.color }}>${s.budget.toLocaleString()}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", borderTop: `1px solid ${C.border}`, paddingTop: 8, marginTop: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: C.white }}>Total</span>
                <span style={{ fontSize: 14, fontWeight: 900, color: tierColor }}>${tier.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div>
            <SectionLabel C={C}>What This Delivers</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { label: "Unique Voters Reached", value: tier.metrics.uniqueVoters },
                { label: "Avg Frequency", value: tier.metrics.frequency },
                { label: "Total Impressions", value: tier.metrics.impressions },
                { label: "Cost Per Voter", value: tier.metrics.costPerVoter },
                { label: "Ground Game Required", value: tier.metrics.groundGameRequired },
              ].map(m => (
                <div key={m.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: C.bg3, borderRadius: 8, padding: "8px 12px", borderLeft: `3px solid ${tierColor}` }}>
                  <span style={{ fontSize: 11, color: "#94a3b8" }}>{m.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: C.white }}>{m.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Channel Cards */}
        <SectionLabel C={C}>Channel-by-Channel Breakdown</SectionLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
          {tier.channels.map((s: any) => (
            <div key={s.channel} style={{ background: C.bg3, border: `1px solid ${C.border}`, borderLeft: `4px solid ${s.color}`, borderRadius: 10, padding: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap" as const, gap: 8, marginBottom: 8 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: C.white }}>{s.channel}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>Reach: <span style={{ color: C.white }}>{s.reach}</span> · Freq: <span style={{ color: C.white }}>{s.frequency}</span></div>
                </div>
                <div style={{ fontSize: 18, fontWeight: 900, color: s.color }}>${s.budget.toLocaleString()}</div>
              </div>
              <div style={{ fontSize: 12, color: "#cbd5e1", lineHeight: 1.6 }}>{s.desc}</div>
            </div>
          ))}
        </div>

        {/* Vote Projections */}
        <SectionLabel C={C}>Vote Projection Scenarios</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "repeat(3,1fr)", gap: 10, marginBottom: 20 }}>
          {tier.projections.map((p: any) => (
            <div key={p.scenario} style={{
              background: p.highlight ? `${tierColor}12` : C.bg3,
              border: `1px solid ${p.highlight ? tierColor + "50" : C.border}`,
              borderRadius: 10, padding: 14,
            }}>
              {p.highlight && <div style={{ fontSize: 9, fontWeight: 700, color: tierColor, textTransform: "uppercase" as const, letterSpacing: "0.1em", marginBottom: 6 }}>Most Likely</div>}
              <div style={{ fontSize: 12, fontWeight: 700, color: C.white, marginBottom: 10 }}>{p.scenario}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {[
                  ["Voters Reached", p.votersReached.toLocaleString()],
                  ["Conversion Rate", `${p.conversion}%`],
                  ["New Votes for Hatcher", p.newVotes.toLocaleString()],
                  ["Projected Hatcher Total", p.hatcherTotal],
                ].map(([lbl, val]) => (
                  <div key={lbl} style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 10, color: "#94a3b8" }}>{lbl}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: C.white }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Ground Game + Organic Social */}
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 12 }}>
          <div style={{ background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 10, padding: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: tierColor, textTransform: "uppercase" as const, letterSpacing: "0.1em", marginBottom: 8 }}>Ground Game</div>
            <div style={{ fontSize: 12, color: "#cbd5e1", lineHeight: 1.6 }}>{tier.groundGame}</div>
          </div>
          <div style={{ background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 10, padding: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: tierColor, textTransform: "uppercase" as const, letterSpacing: "0.1em", marginBottom: 8 }}>Organic Social</div>
            <div style={{ fontSize: 12, color: "#cbd5e1", lineHeight: 1.6 }}>{tier.organicSocial}</div>
          </div>
        </div>
      </div>

      {/* Side-by-Side Comparison */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
        <SectionLabel C={C}>Side-by-Side Comparison</SectionLabel>
        <div style={{ overflowX: "auto" as const }}>
          <table style={{ width: "100%", borderCollapse: "collapse" as const, fontSize: 11 }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left" as const, padding: "8px 12px", color: "#64748b", fontWeight: 600, borderBottom: `1px solid ${C.border}` }}>Metric</th>
                {SPEND_TIERS.map((t, i) => (
                  <th key={t.id} style={{ textAlign: "center" as const, padding: "8px 12px", color: TIER_COLORS[i], fontWeight: 700, borderBottom: `1px solid ${C.border}` }}>
                    ${(t.total / 1000).toFixed(0)}K {t.recommended ? "★" : ""}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {([
                ["Unique Voters", "uniqueVoters"],
                ["Avg Frequency", "frequency"],
                ["Total Impressions", "impressions"],
                ["Cost Per Voter", "costPerVoter"],
                ["Ground Game", "groundGameRequired"],
              ] as [string, string][]).map(([label, key]) => (
                <tr key={key} style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: "8px 12px", color: C.white }}>{label}</td>
                  {SPEND_TIERS.map((t, i) => (
                    <td key={t.id} style={{ padding: "8px 12px", textAlign: "center" as const, color: TIER_COLORS[i], fontWeight: 600 }}>
                      {(t.metrics as any)[key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* UGC Video Strategy */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
        <div style={{ marginBottom: 16 }}>
          <SectionLabel C={C}>UGC Video Strategy — "I'm Voting for Charlie Because..."</SectionLabel>
          <div style={{ background: `${C.accent}10`, border: `1px solid ${C.accent}30`, borderRadius: 10, padding: "14px 18px", marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.white, marginBottom: 6 }}>What Exact Audience Produces: 100 Authentic Voter Voices</div>
            <div style={{ fontSize: 12, color: "#cbd5e1", lineHeight: 1.7 }}>
              Across the 14 new counties, we identify and film 100 real Republican primary voters — farmers, veterans, small business owners, church members, co-op members — each delivering a 15–30 second authentic testimonial in their own words. These are not actors. They are Charlie's actual neighbors. Each video is cut for Facebook, Instagram Reels, and TikTok. At $0.01–$0.03 per view on Meta, 100 videos at 50,000 views each = 5 million authentic impressions for roughly $50,000–$150,000 in additional paid amplification. The organic reach from real people sharing real testimonials is free. This is the channel that makes the paid media stick.
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr 1fr" : "repeat(4,1fr)", gap: 10, marginBottom: 16 }}>
            {[
              { label: "Videos Produced", value: "100", sub: "15–30 sec each", color: C.accent },
              { label: "Persona Types", value: "10", sub: "Farmer to veteran to neighbor", color: C.green },
              { label: "Platforms", value: "3", sub: "Facebook · Instagram · TikTok", color: C.gold },
              { label: "Est. Organic Reach", value: "500K+", sub: "Shares + native reach", color: C.accent2 },
            ].map(m => (
              <div key={m.label} style={{ background: C.bg3, borderRadius: 10, padding: "12px 14px", borderTop: `3px solid ${m.color}` }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: m.color }}>{m.value}</div>
                <div style={{ fontSize: 10, color: C.white, fontWeight: 600, marginTop: 2 }}>{m.label}</div>
                <div style={{ fontSize: 9, color: "#64748b", marginTop: 2 }}>{m.sub}</div>
              </div>
            ))}
          </div>
        </div>

        <SectionLabel C={C}>Sample Scripts — 10 Voter Personas</SectionLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {UGC_SCRIPTS.map((s, i) => (
            <div key={i} style={{ background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 10, padding: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 18 }}>{s.icon}</span>
                <span style={{ fontSize: 12, fontWeight: 800, color: C.white }}>{s.persona}</span>
                <span style={{ fontSize: 10, color: C.accent2, fontStyle: "italic", marginLeft: "auto" }}>Hook: "{s.hook}"</span>
              </div>
              <div style={{ fontSize: 12, color: "#cbd5e1", lineHeight: 1.7, marginBottom: 8, fontStyle: "italic" }}>"...{s.line}"</div>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.accent, textTransform: "uppercase" as const, letterSpacing: "0.08em" }}>CTA: {s.cta}</div>
            </div>
          ))}
        </div>

        <div style={{ background: `${C.green}10`, border: `1px solid ${C.green}30`, borderRadius: 10, padding: 14, marginTop: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.green, marginBottom: 6 }}>Why This Works for Hatcher Specifically</div>
          <div style={{ fontSize: 12, color: "#cbd5e1", lineHeight: 1.7 }}>
            Charlie Hatcher's entire brand is authenticity — "less talk, more work," a 200-year family farm, a daughter who runs the vet clinic, a son who runs the dairy. His voters are not persuaded by polished political ads. They are persuaded by their neighbors. The comment on his most-liked Facebook post says it all: <em>"Charlie does what he says he will do, and is honest — two sentences we all too rarely associate with anyone in the political arena. We do associate these terms with farmers."</em> UGC videos are not a supplement to the paid media plan. At this stage of the race, with 14 days left, they are the most credible persuasion tool available.
          </div>
        </div>
      </div>

    </div>
  );
}

// ── TAB: Voter Profiles ───────────────────────────────────────────────────────
function TabProfiles({ mobile, C }: { mobile: boolean; C: C }) {
  const [selected, setSelected] = useState<number | null>(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "14px 20px" }}>
        <div style={{ fontSize: 10, color: C.accent2, textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700, marginBottom: 4 }}>Exact Audience — Individual Voter Intelligence</div>
        <div style={{ fontSize: 13, color: C.muted }}>Real voter profiles identified from the persuadable universe. Each profile shows intent score, preferred channels, and key issues. Click any card to expand.</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 12 }}>
        {VOTER_PROFILES.map((v, i) => {
          const isOpen = selected === i;
          const segColor = VOTER_SEGMENTS.find(s => s.segment === v.segment)?.color || C.accent;
          return (
            <div key={i}
              onClick={() => setSelected(isOpen ? null : i)}
              style={{ background: C.card, border: `1px solid ${isOpen ? C.accent : C.border}`, borderRadius: 12, padding: 18, cursor: "pointer", transition: "border-color 0.2s" }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: C.white, marginBottom: 2 }}>{v.name}</div>
                  <div style={{ fontSize: 12, color: C.muted, marginBottom: 4 }}>{v.age} · {v.occupation}</div>
                  <div style={{ fontSize: 11, color: C.accent2 }}>{v.county} · {v.city}</div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Intent</div>
                  <div style={{ fontSize: 24, fontWeight: 900, color: segColor }}>{v.intent}</div>
                </div>
              </div>
              <div style={{ marginTop: 10, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                <StatusBadge status={v.status} C={C} />
                <span style={{ fontSize: 10, fontWeight: 700, background: `${segColor}20`, color: segColor, border: `1px solid ${segColor}40`, padding: "3px 10px", borderRadius: 20 }}>{v.segment}</span>
              </div>
              {isOpen && (
                <div style={{ marginTop: 14, borderTop: `1px solid ${C.border}`, paddingTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
                  <div>
                    <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Best Channels to Reach</div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {v.channels.map((ch, j) => (
                        <span key={j} style={{ fontSize: 11, fontWeight: 600, background: `${C.accent}20`, color: C.accent2, border: `1px solid ${C.accent}40`, padding: "3px 10px", borderRadius: 20 }}>{ch}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Key Issues</div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {v.issues.map((iss, j) => (
                        <span key={j} style={{ fontSize: 11, background: C.bg3, color: C.muted, border: `1px solid ${C.border}`, padding: "3px 10px", borderRadius: 20 }}>{iss}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ background: `${C.gold}15`, border: `1px solid ${C.gold}40`, borderRadius: 8, padding: 12 }}>
                    <div style={{ fontSize: 10, color: C.gold, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Field Intelligence</div>
                    <div style={{ fontSize: 12, color: "#cbd5e1", lineHeight: 1.6 }}>{v.note}</div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── TAB: Path to Win ──────────────────────────────────────────────────────────
function TabPath({ mobile, C }: { mobile: boolean; C: C }) {
  const radarData = PATH_TO_WIN.slice(0, 8).map(c => ({ county: c.county, confidence: c.confidence }));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Win Scenario */}
      <div style={{ background: "linear-gradient(135deg,#0d1a2e,#0a1628)", border: `1px solid ${C.accent}40`, borderRadius: 14, padding: "20px 24px" }}>
        <div style={{ fontSize: 10, color: C.accent2, textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 700, marginBottom: 8 }}>Exact Audience Win Scenario Model</div>
        <div style={{ fontSize: mobile ? 18 : 22, fontWeight: 900, color: C.white, marginBottom: 8 }}>
          Hatcher needs ~{TOTAL_NEEDED.toLocaleString()} votes across 14 counties to win
        </div>
        <div style={{ fontSize: 13, color: "#cbd5e1", maxWidth: 580, lineHeight: 1.6 }}>
          The pitch: "Eighty-three percent of the voters in this district were in a different district three months ago. This is not a re-election race — it is effectively an open seat race in 14 new counties, and Charlie Hatcher is the only candidate who has spent seven years building relationships there."
        </div>
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 12, marginTop: 20 }}>
          <KpiCard label="Votes Needed to Win" value={TOTAL_NEEDED.toLocaleString()} sub="Estimated winning threshold" color={C.accent} C={C} />
          <KpiCard label="Strong + Lean Hatcher" value="9" sub="Counties already leaning his way" color={C.green} C={C} />
          <KpiCard label="Toss-up Counties" value="3" sub="Madison, Haywood, Hardeman" color={C.gold} C={C} />
          <KpiCard label="Avg. Win Confidence" value="70%" sub="Across 14 new counties" color={C.accent2} C={C} />
        </div>
      </div>

      {/* Radar + Table */}
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 16 }}>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
          <SectionLabel C={C}>County Win Confidence (Top 8)</SectionLabel>
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={radarData}>
              <PolarGrid stroke={C.border} />
              <PolarAngleAxis dataKey="county" tick={{ fill: C.muted, fontSize: 10 }} />
              <Radar name="Confidence" dataKey="confidence" stroke={C.accent2} fill={C.accent} fillOpacity={0.25} />
              <Tooltip contentStyle={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 8 }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
          <SectionLabel C={C}>The 21-Day Information Race</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { week: "Week 1 (Now → July 25)", focus: "Establish name ID in Henry, Weakley, Lake, Carroll", action: "CTV launch + mail drop 1 (Ag record)", color: C.green },
              { week: "Week 2 (July 26 → Aug 1)", focus: "Expand to Gibson, Obion, Dyer, Henderson", action: "Digital video surge + mail drop 2 (fiscal responsibility)", color: C.gold },
              { week: "Week 3 (Aug 2 → Aug 7)", focus: "GOTV in all 14 counties — turnout operation", action: "Mail drop 3 (GOTV) + field canvass + radio blitz", color: C.accent2 },
            ].map((w, i) => (
              <div key={i} style={{ background: C.bg3, border: `1px solid ${C.border}`, borderLeft: `3px solid ${w.color}`, borderRadius: 10, padding: 14 }}>
                <div style={{ fontSize: 11, color: w.color, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{w.week}</div>
                <div style={{ fontSize: 13, color: C.white, fontWeight: 600, marginBottom: 4 }}>{w.focus}</div>
                <div style={{ fontSize: 12, color: C.muted }}>{w.action}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* County-by-County Table */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
        <SectionLabel C={C}>County-by-County Path to Victory</SectionLabel>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                {["County", "Vote Target", "Votes Needed", "Win Confidence", "Status"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "8px 12px", color: C.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", fontSize: 10 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PATH_TO_WIN.map((c, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${C.border}20`, background: i % 2 === 0 ? "transparent" : `${C.bg3}50` }}>
                  <td style={{ padding: "10px 12px", color: C.white, fontWeight: 600 }}>{c.county}</td>
                  <td style={{ padding: "10px 12px", color: C.muted }}>{c.target.toLocaleString()}</td>
                  <td style={{ padding: "10px 12px", color: C.accent2, fontWeight: 700 }}>{c.needed.toLocaleString()}</td>
                  <td style={{ padding: "10px 12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ flex: 1, background: C.bg3, borderRadius: 3, height: 6, overflow: "hidden" }}>
                        <div style={{ width: `${c.confidence}%`, background: c.confidence >= 75 ? C.green : c.confidence >= 60 ? C.gold : C.red, height: "100%", borderRadius: 3 }} />
                      </div>
                      <span style={{ color: C.white, fontWeight: 700, minWidth: 32 }}>{c.confidence}%</span>
                    </div>
                  </td>
                  <td style={{ padding: "10px 12px" }}><StatusBadge status={c.status} C={C} /></td>
                </tr>
              ))}
              <tr style={{ borderTop: `2px solid ${C.border}`, background: `${C.accent}10` }}>
                <td style={{ padding: "10px 12px", color: C.white, fontWeight: 800 }}>TOTAL</td>
                <td style={{ padding: "10px 12px", color: C.white, fontWeight: 800 }}>{TOTAL_TARGET.toLocaleString()}</td>
                <td style={{ padding: "10px 12px", color: C.accent2, fontWeight: 800 }}>{TOTAL_NEEDED.toLocaleString()}</td>
                <td style={{ padding: "10px 12px", color: C.gold, fontWeight: 800 }}>70% avg</td>
                <td style={{ padding: "10px 12px" }}><StatusBadge status="Winnable" C={C} /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* The Pitch */}
      <div style={{ background: `${C.accent}10`, border: `1px solid ${C.accent}40`, borderRadius: 12, padding: 24 }}>
        <div style={{ fontSize: 10, color: C.accent2, textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 700, marginBottom: 12 }}>The Exact Audience Offer to Charlie Hatcher</div>
        <blockquote style={{ margin: 0, padding: "16px 20px", background: C.card, border: `1px solid ${C.border}`, borderLeft: `4px solid ${C.accent}`, borderRadius: 10 }}>
          <p style={{ fontSize: 14, color: C.white, lineHeight: 1.7, margin: 0, fontStyle: "italic" }}>
            "You have 21 days and $214,000. The 14 new counties are the ballgame. We can tell you, by precinct, which Republican primary voters in those counties already know your name from your time as Agriculture Commissioner, which ones are persuadable with one or two more contacts, and which ones are Ogles voters you should not waste money on. That is the difference between spending your $56,109 efficiently and spending it blind. We can have that map to you in 48 hours."
          </p>
        </blockquote>
        <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: mobile ? "1fr" : "repeat(3, 1fr)", gap: 12 }}>
          {[
            { label: "Delivery Time", value: "48 hours", icon: "⚡", color: C.gold },
            { label: "Recommended Spend", value: "$56,109", icon: "🎯", color: C.green },
            { label: "Remaining Reserve", value: "$157,891", icon: "💰", color: C.accent2 },
          ].map((item, i) => (
            <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 14, textAlign: "center" }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>{item.icon}</div>
              <div style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: item.color }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function CharlieHatcherDashboard() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const C = useColors(isDark);
  const [tab, setTab] = useState("overview");
  const [mobile, setMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handler = () => setMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{ background: C.headerBg, borderBottom: `1px solid ${C.border}`, padding: mobile ? "14px 16px" : "16px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Link href="/campaigns" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: C.muted, textDecoration: "none", marginBottom: 14, transition: "color 0.2s" }}>
            ← Back to Campaigns
          </Link>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: `${C.accent}20`, border: `2px solid ${C.accent}60`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🏛️</div>
                <div>
                  <div style={{ fontSize: mobile ? 18 : 22, fontWeight: 900, color: C.white, lineHeight: 1.1 }}>Charlie Hatcher for Congress</div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>TN-CD5 Republican Primary · August 7, 2026</div>
                </div>
              </div>
              <div style={{ fontSize: 12, color: C.muted }}>Tennessee CD5 · Republican Primary · Exact Audience + Campaign Strategy Live</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, background: `${C.green}20`, border: `1px solid ${C.green}60`, borderRadius: 20, padding: "6px 14px" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: C.green, animation: "pulse 2s infinite" }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: C.green, letterSpacing: "0.08em" }}>LIVE INTELLIGENCE</span>
              </div>
              <div style={{ background: `${C.gold}20`, border: `1px solid ${C.gold}60`, borderRadius: 10, padding: "6px 14px", textAlign: "center" }}>
                <div style={{ fontSize: 9, color: C.gold, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>Days to Primary</div>
                <div style={{ fontSize: 18, fontWeight: 900, color: C.white }}>{RACE.daysOut}</div>
              </div>
            </div>
          </div>
          {/* Tabs */}
          <div style={{ display: "flex", gap: 4, marginTop: 16, overflowX: "auto", paddingBottom: 2 }}>
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  padding: mobile ? "8px 12px" : "8px 18px",
                  borderRadius: 8,
                  border: "none",
                  cursor: "pointer",
                  fontSize: mobile ? 11 : 12,
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  transition: "all 0.2s",
                  background: tab === t.id ? C.accent : "transparent",
                  color: tab === t.id ? C.white : C.muted,
                  outline: tab === t.id ? `1px solid ${C.accent}` : "none",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: mobile ? "16px" : "24px 32px" }}>
        {tab === "overview"  && <TabOverview  mobile={mobile} C={C} />}
        {tab === "voters"    && <TabVoters    mobile={mobile} C={C} />}
        {tab === "spend"     && <TabSpend     mobile={mobile} C={C} />}
        {tab === "profiles"  && <TabProfiles  mobile={mobile} C={C} />}
        {tab === "path"      && <TabPath      mobile={mobile} C={C} />}
      </div>
    </div>
  );
}
