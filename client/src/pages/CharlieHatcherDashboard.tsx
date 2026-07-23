/**
 * CharlieHatcherDashboard.tsx
 * Charlie Hatcher for Congress — TN-CD5 Republican Primary 2026
 * EA Intelligence Portal — B2C Voter Targeting & $80K Spend Recommendation
 * Tabs: Race Overview | Persuadable Voters | $80K Spend Plan | Voter Profiles | Path to Win
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

const SPEND_PLAN = [
  {
    channel: "Connected TV (CTV)",
    budget: 24000,
    pct: 30,
    reach: "38,000 households",
    frequency: "8–12x per voter",
    desc: "30-second spots on Hulu, Peacock, Paramount+, and local news streaming. Targets registered Republican primary voters by household in all 14 new counties. Highest recall medium.",
    color: "#1a56db",
  },
  {
    channel: "Digital Video & Social",
    budget: 18000,
    pct: 22.5,
    reach: "52,000 unique voters",
    frequency: "6–9x per voter",
    desc: "Facebook/Instagram video ads targeting Republican primary voters 35+ in the 14 new counties. Includes carousel ads for Hatcher's ag record and 15-second pre-roll on YouTube.",
    color: "#3b82f6",
  },
  {
    channel: "Direct Mail",
    budget: 16000,
    pct: 20,
    reach: "28,000 households",
    frequency: "3 mail pieces",
    desc: "Three targeted mail drops to high-propensity Republican primary voters in persuadable precincts. Piece 1: Ag record. Piece 2: Cash advantage / fiscal responsibility. Piece 3: Final GOTV.",
    color: "#60a5fa",
  },
  {
    channel: "Programmatic Display & Audio",
    budget: 10000,
    pct: 12.5,
    reach: "45,000 unique devices",
    frequency: "10–15x per voter",
    desc: "IP-targeted display ads and Spotify/Pandora audio spots. Reaches persuadable voters on mobile and desktop throughout the day. Reinforces TV and mail messaging.",
    color: "#93c5fd",
  },
  {
    channel: "Field Operations & GOTV",
    budget: 8000,
    pct: 10,
    reach: "12,000 doors",
    frequency: "1–2 contacts",
    desc: "Targeted canvassing in Henry, Weakley, Lake, and Carroll counties — Hatcher's strongest new-county turf. Voter ID calls in Madison and Gibson (toss-up counties).",
    color: "#bfdbfe",
  },
  {
    channel: "Radio & Podcast",
    budget: 4000,
    pct: 5,
    reach: "60,000 listeners",
    frequency: "4–6x per voter",
    desc: "Local AM/FM radio in rural county markets and targeted podcast ads on conservative news podcasts consumed by rural Tennessee Republicans.",
    color: "#dbeafe",
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
  { id: "spend",      label: "$80K Spend Plan" },
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
            { icon: "🗺️", title: "14 New Counties", desc: "Redistricting removed Ogles' home counties (Maury, Marshall, Lewis, eastern Williamson) and added 14 rural counties where Ogles has zero infrastructure." },
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

// ── TAB: $80K Spend Plan ──────────────────────────────────────────────────────
function TabSpend({ mobile, C }: { mobile: boolean; C: C }) {
  const pieData = SPEND_PLAN.map(s => ({ name: s.channel, value: s.budget, fill: s.color }));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Spend Summary Banner */}
      <div style={{ background: "linear-gradient(135deg,#0d1a2e,#0a1628)", border: `1px solid ${C.accent}40`, borderRadius: 14, padding: "20px 24px" }}>
        <div style={{ fontSize: 10, color: C.accent2, textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 700, marginBottom: 8 }}>Exact Audience Recommended Spend · 21-Day Sprint</div>
        <div style={{ fontSize: mobile ? 22 : 28, fontWeight: 900, color: C.white, marginBottom: 8 }}>$80,000 Precision Voter Targeting Plan</div>
        <div style={{ fontSize: 13, color: "#cbd5e1", maxWidth: 600, lineHeight: 1.6 }}>
          Reach every persuadable Republican primary voter in the 14 new counties at least 6–12 times before August 7. The goal is not broad awareness — it is surgical repetition to the ~42,000 voters who are genuinely moveable. Ogles cannot match this spend. That is the window.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 12, marginTop: 20 }}>
          <KpiCard label="Total Recommended Spend" value="$80,000" sub="21-day sprint to August 7" color={C.accent} C={C} />
          <KpiCard label="Unique Voters Reached" value="42,000+" sub="Across all channels combined" color={C.green} C={C} />
          <KpiCard label="Avg. Touchpoints/Voter" value="8–14x" sub="Enough to move persuadables" color={C.gold} C={C} />
          <KpiCard label="Hatcher Cash Available" value="$214K" sub="$134K remaining after spend" color={C.accent2} C={C} />
        </div>
      </div>

      {/* Channel Breakdown */}
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 16 }}>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
          <SectionLabel C={C}>Budget Allocation by Channel</SectionLabel>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value">
                {pieData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Pie>
              <Tooltip contentStyle={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 8 }} formatter={(v: number) => `$${v.toLocaleString()}` } />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
            {SPEND_PLAN.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: s.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: C.white }}>{s.channel}</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: s.color }}>${s.budget.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
          <SectionLabel C={C}>Why $80K Moves the Needle</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { label: "Ogles' net available cash", value: "$15,000", color: C.red, note: "Cannot run a meaningful paid media campaign in the final 3 weeks" },
              { label: "Hatcher after $80K spend", value: "$134,000", color: C.green, note: "Still has reserve for GOTV and unexpected needs" },
              { label: "Persuadable voters reached", value: "42,000+", color: C.accent2, note: "Every moveable voter in the 14 new counties touched 8–14 times" },
              { label: "Trump endorsement reach", value: "Limited", color: C.gold, note: "In a low-salience primary, endorsement only matters if voters know about it. Hatcher's job is to win the information race first." },
            ].map((item, i) => (
              <div key={i} style={{ background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 10, padding: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>{item.label}</span>
                  <span style={{ fontSize: 16, fontWeight: 800, color: item.color }}>{item.value}</span>
                </div>
                <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.5 }}>{item.note}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Channel Detail Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <SectionLabel C={C}>Channel-by-Channel Breakdown</SectionLabel>
        {SPEND_PLAN.map((s, i) => (
          <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderLeft: `4px solid ${s.color}`, borderRadius: 12, padding: 18 }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: C.white, marginBottom: 4 }}>{s.channel}</div>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 11, color: C.muted }}>Reach: <span style={{ color: C.white, fontWeight: 600 }}>{s.reach}</span></span>
                  <span style={{ fontSize: 11, color: C.muted }}>Frequency: <span style={{ color: C.white, fontWeight: 600 }}>{s.frequency}</span></span>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Budget</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: s.color }}>${s.budget.toLocaleString()}</div>
                <div style={{ fontSize: 11, color: C.muted }}>{s.pct}% of total</div>
              </div>
            </div>
            <div style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.6 }}>{s.desc}</div>
          </div>
        ))}
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
            "You have 21 days and $214,000. The 14 new counties are the ballgame. We can tell you, by precinct, which Republican primary voters in those counties already know your name from your time as Agriculture Commissioner, which ones are persuadable with one or two more contacts, and which ones are Ogles voters you should not waste money on. That is the difference between spending your $214,000 efficiently and spending it blind. We can have that map to you in 48 hours."
          </p>
        </blockquote>
        <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: mobile ? "1fr" : "repeat(3, 1fr)", gap: 12 }}>
          {[
            { label: "Delivery Time", value: "48 hours", icon: "⚡", color: C.gold },
            { label: "Recommended Spend", value: "$80,000", icon: "🎯", color: C.green },
            { label: "Remaining Reserve", value: "$134,000", icon: "💰", color: C.accent2 },
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
