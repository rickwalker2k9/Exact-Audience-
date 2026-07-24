/**
 * CharlieHatcherDashboard.tsx
 * Charlie Hatcher for Congress — TN-CD5 Republican Primary 2026
 * EA Intelligence Portal — B2C Voter Targeting & 3-Tier Spend Recommendation
 * Tabs: Race Overview | Persuadable Voters | Spend Plan | Voter Profiles | Path to Win
 */
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { KNOWN_CONTACTS, type KnownContact } from "./cd5Contacts";
import { Link } from "wouter";
import { useTheme } from "../contexts/ThemeContext";
import { trpc } from "@/lib/trpc";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
} from "recharts";

// ── Animation Hooks ──────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1400, decimals = 0, prefix = "", suffix = "") {
  const [display, setDisplay] = useState(prefix + "0" + suffix);
  const frameRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const startValue = useRef(0);

  const animate = useCallback((timestamp: number) => {
    if (!startRef.current) startRef.current = timestamp;
    const elapsed = timestamp - startRef.current;
    const progress = Math.min(elapsed / duration, 1);
    // ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = startValue.current + (target - startValue.current) * eased;
    const formatted = decimals > 0
      ? current.toFixed(decimals)
      : Math.round(current).toLocaleString();
    setDisplay(prefix + formatted + suffix);
    if (progress < 1) {
      frameRef.current = requestAnimationFrame(animate);
    }
  }, [target, duration, decimals, prefix, suffix]);

  useEffect(() => {
    startRef.current = null;
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(animate);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [animate]);

  return display;
}

function useCountdown(targetDate: string) {
  const calc = () => {
    const diff = new Date(targetDate).getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  return time;
}

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

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
  // West Tennessee — new to this district
  { county: "Lake",        voters: 3200,  hatcherKnown: 76, persuadable: 1300, status: "Strong Hatcher" },
  { county: "Obion",       voters: 9600,  hatcherKnown: 68, persuadable: 3600, status: "Lean Hatcher" },
  { county: "Weakley",     voters: 11800, hatcherKnown: 72, persuadable: 4600, status: "Lean Hatcher" },
  { county: "Henry",       voters: 8200,  hatcherKnown: 80, persuadable: 3100, status: "Strong Hatcher" },
  { county: "Dyer",        voters: 10100, hatcherKnown: 58, persuadable: 3800, status: "Competitive" },
  { county: "Lauderdale",  voters: 6400,  hatcherKnown: 52, persuadable: 2400, status: "Competitive" },
  { county: "Tipton",      voters: 14200, hatcherKnown: 44, persuadable: 5200, status: "Toss-up" },
  { county: "Shelby",      voters: 8900,  hatcherKnown: 38, persuadable: 3100, status: "Toss-up" },
  // Middle Tennessee — new to this district
  { county: "Benton",      voters: 5100,  hatcherKnown: 65, persuadable: 1900, status: "Lean Hatcher" },
  { county: "Humphreys",   voters: 5800,  hatcherKnown: 60, persuadable: 2200, status: "Competitive" },
  { county: "Houston",     voters: 3400,  hatcherKnown: 68, persuadable: 1300, status: "Lean Hatcher" },
  { county: "Stewart",     voters: 4600,  hatcherKnown: 62, persuadable: 1700, status: "Lean Hatcher" },
  { county: "Montgomery",  voters: 7200,  hatcherKnown: 40, persuadable: 2600, status: "Toss-up" },
  // Hatcher home counties (Williamson/Maury — partial)
  { county: "Hickman",     voters: 5200,  hatcherKnown: 74, persuadable: 1900, status: "Strong Hatcher" },
  { county: "Lewis",       voters: 3100,  hatcherKnown: 78, persuadable: 1100, status: "Strong Hatcher" },
  { county: "Williamson",  voters: 12400, hatcherKnown: 85, persuadable: 4200, status: "Strong Hatcher" },
  { county: "Maury",       voters: 9800,  hatcherKnown: 79, persuadable: 3400, status: "Strong Hatcher" },
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
    narrative: "At $69,417, you are not running a campaign — you are running an air war that Ogles simply cannot answer. Every persuadable Republican primary voter in all 14 new counties will see Hatcher's face and hear his name on their TV and their phone before they go to bed. Soft Trump voters who have never heard of Andy Ogles will know Charlie Hatcher. The ground game becomes a victory lap, not a lifeline. This is the number that makes August 7 a foregone conclusion.",
    groundGame: "Volunteer canvassing is a bonus, not a requirement. The ads carry the full load. Use your field team for Election Day turnout only.",
    organicSocial: "Amplification only — share the ads, post event photos, let the paid media do the persuasion work.",
    channels: [
      { channel: "Connected TV (CTV)", budget: 48900, pct: 70.4, reach: "115,000 households", frequency: "14–20x", color: "#1a56db",
        desc: "Bought by ZIP code and county across all 14 new counties — every household in Hatcher's new district sees his 30-second spot on Hulu, Peacock, Paramount+, YouTube TV, and local news streaming. No voter file required: geographic saturation means no persuadable household goes untouched. At this budget CTV is the dominant channel and the full air war." },
      { channel: "Digital Video & Social", budget: 13617, pct: 19.6, reach: "145,000 unique voters", frequency: "10–14x", color: "#3b82f6",
        desc: "Facebook/Instagram video ads matched to the Republican primary voter file — named, identified voters, not just zip code residents. 15-second pre-roll on YouTube. Carousel ads featuring Hatcher's ag commissioner record and endorsements. Reinforces CTV with voter-file precision." },
      { channel: "Programmatic Display & Audio", budget: 6900, pct: 9.9, reach: "105,000 unique devices", frequency: "12–16x", color: "#93c5fd",
        desc: "IP-targeted display ads and Spotify/Pandora audio spots matched to the voter file. Extends the CTV message into commute hours and mobile browsing — voters who see the TV spot at night hear the audio spot the next morning. Highest frequency per dollar of any channel in the plan." },
    ],
    metrics: { uniqueVoters: "72,000", frequency: "12–18x", impressions: "4.1M", costPerVoter: "$0.96", groundGameRequired: "Minimal" },
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
    narrative: "$56,109 is the number that moves the moveable. It is not the number that wins on autopilot — it is the number that wins if the campaign executes. Every persuadable Republican primary voter in the 14 new counties will be reached 8–14 times across CTV, digital, and programmatic. What this budget does not do is saturate soft Trump voters at the frequency needed to fully flip them — that gap gets closed by a competent ground game in Tipton, Montgomery, and Shelby counties. If the campaign can knock 3,000 doors in those three counties, this budget wins.",
    groundGame: "Active and essential in the three toss-up counties. Door-knocking in Tipton (Covington), Montgomery (Clarksville area), and Shelby (Millington/Bartlett area) closes the gap that the ad budget leaves open.",
    organicSocial: "Weekly posts reinforcing ad themes. Facebook community groups in each county. Hatcher should be posting 3x per week minimum — event photos, endorsements, ag commissioner throwbacks.",
    channels: [
      { channel: "Connected TV (CTV)", budget: 39400, pct: 70.2, reach: "92,000 households", frequency: "11–16x", color: "#1a56db",
        desc: "Bought by ZIP code and county across all 14 new counties — every household in Hatcher's new district gets covered. 30-second spots on Hulu, Peacock, Paramount+, YouTube TV, and local news streaming. Geographic targeting means no wasted impressions outside the district. CTV is the highest-recall medium and the anchor of the entire plan." },
      { channel: "Digital Video & Social", budget: 11209, pct: 20.0, reach: "110,000 unique voters", frequency: "8–11x", color: "#3b82f6",
        desc: "Facebook/Instagram video ads matched to the Republican primary voter file — named, identified persuadable voters, not just geographic residents. 15-second pre-roll on YouTube. Carousel ads featuring Hatcher's ag commissioner record and endorsements. Voter-file matching means every dollar reaches a real Republican primary voter, not a random household member." },
      { channel: "Programmatic Display & Audio", budget: 5500, pct: 9.8, reach: "82,000 unique devices", frequency: "10–14x", color: "#93c5fd",
        desc: "IP-targeted display ads and Spotify/Pandora audio spots matched to the voter file. Extends the CTV message into commute hours and mobile browsing — voters who see the TV spot at night hear the audio spot the next morning. Highest frequency per dollar of any channel in the plan." },
    ],
    metrics: { uniqueVoters: "58,000", frequency: "8–14x", impressions: "3.1M", costPerVoter: "$0.97", groundGameRequired: "Active" },
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
    narrative: "$41,284 is a viable floor — not a comfortable one. It reaches high-propensity persuadables and Hatcher's natural base at sufficient frequency, but it will not touch soft Trump voters in Tipton and Montgomery counties at the repetition needed to move them without help. This budget works if the campaign runs a serious ground game and uses organic social media as a genuine persuasion tool, not just a posting schedule. If Hatcher can put 50 volunteers in the field and post 4–5 times per week with real content, this budget is enough to win. If the ground game is weak, it is not.",
    groundGame: "Essential. Without active canvassing in all five toss-up and competitive counties, this budget alone will not close the gap. Plan for 3,000+ door knocks in Tipton, Montgomery, Shelby, Dyer, and Lauderdale.",
    organicSocial: "Must function as a real persuasion channel, not just amplification. 4–5 posts per week minimum. Facebook Live events with Hatcher in each county. Volunteer-generated content. Endorsement videos from local figures. This is not optional at this budget level.",
    channels: [
      { channel: "Connected TV (CTV)", budget: 28900, pct: 70.0, reach: "68,000 households", frequency: "9–13x", color: "#1a56db",
        desc: "Bought by ZIP code and county — concentrates on the highest-priority ZIP codes across the 14 new counties. Not every ZIP gets full saturation at this budget, but every county gets presence. 30-second spots on Hulu, Peacock, and local news streaming. Geographic targeting keeps every dollar inside the district." },
      { channel: "Digital Video & Social", budget: 8284, pct: 20.1, reach: "75,000 unique voters", frequency: "6–8x", color: "#3b82f6",
        desc: "Facebook/Instagram video ads matched to the Republican primary voter file. At 6–8x frequency this establishes name recognition but needs organic social reinforcement to fully move soft persuadables. Every paid impression should be backed by an organic post the same week." },
      { channel: "Programmatic Display & Audio", budget: 4100, pct: 9.9, reach: "58,000 unique devices", frequency: "7–10x", color: "#93c5fd",
        desc: "IP-targeted display ads and Spotify/Pandora audio matched to the voter file. Reaches voters during commutes and work hours when CTV cannot, extending effective reach without significant added cost. Most efficient channel per dollar at this budget level." },
    ],
    metrics: { uniqueVoters: "42,000", frequency: "6–10x", impressions: "2.2M", costPerVoter: "$0.98", groundGameRequired: "Essential" },
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
    channels: ["CTV", "Digital Video", "Programmatic"],
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
    channels: ["Facebook/Instagram", "CTV", "Programmatic"],
    issues: ["Education funding", "Local accountability", "Rural infrastructure"],
    note: "Republican primary voter since 2010. No strong Ogles affinity. Responds to competence messaging.",
    status: "Toss-up → Persuadable",
  },
  {
    name: "Dale Simmons",
    age: 64,
    county: "Dyer County",
    city: "Dyersburg, TN",
    occupation: "Owner, Simmons Farm Supply",
    segment: "Small Business Owners",
    intent: 82,
    channels: ["CTV", "Digital Video", "Facebook"],
    issues: ["Small business regulation", "Agricultural supply chain", "Local jobs"],
    note: "Hatcher visited his store twice during ag commissioner tenure. Strong name recognition.",
    status: "Lean Hatcher",
  },
  {
    name: "Sgt. Marcus Webb (ret.)",
    age: 47,
    county: "Humphreys County",
    city: "Waverly, TN",
    occupation: "Volunteer fire chief, part-time contractor",
    segment: "Veterans & First Responders",
    intent: 86,
    channels: ["CTV", "Programmatic", "Digital Video"],
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
    channels: ["CTV", "Programmatic", "Digital Video"],
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
    channels: ["Facebook", "Digital Video", "Programmatic"],
    issues: ["Small business taxes", "Healthcare costs", "Local economic growth"],
    note: "Chamber of commerce member. Responds to business competence messaging over national politics.",
    status: "Competitive → Lean Hatcher",
  },
  {
    name: "James Thornton",
    age: 39,
    county: "Lauderdale County",
    city: "Ripley, TN",
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
  // West Tennessee
  { county: "Lake",       target: 1100,  needed: 900,  confidence: 90, status: "Strong Hatcher" },
  { county: "Henry",      target: 2900,  needed: 2500, confidence: 88, status: "Strong Hatcher" },
  { county: "Weakley",    target: 4100,  needed: 3500, confidence: 83, status: "Lean Hatcher" },
  { county: "Obion",      target: 3300,  needed: 2800, confidence: 74, status: "Lean Hatcher" },
  { county: "Benton",     target: 1800,  needed: 1500, confidence: 76, status: "Lean Hatcher" },
  { county: "Houston",    target: 1200,  needed: 1000, confidence: 78, status: "Lean Hatcher" },
  { county: "Stewart",    target: 1600,  needed: 1400, confidence: 74, status: "Lean Hatcher" },
  { county: "Dyer",       target: 3500,  needed: 3000, confidence: 66, status: "Competitive" },
  { county: "Lauderdale", target: 2200,  needed: 1900, confidence: 62, status: "Competitive" },
  { county: "Humphreys",  target: 2000,  needed: 1700, confidence: 64, status: "Competitive" },
  { county: "Tipton",     target: 4800,  needed: 4200, confidence: 54, status: "Toss-up" },
  { county: "Montgomery", target: 2400,  needed: 2100, confidence: 50, status: "Toss-up" },
  { county: "Shelby",     target: 2900,  needed: 2500, confidence: 48, status: "Toss-up" },
  // Hatcher home counties
  { county: "Hickman",    target: 1900,  needed: 1600, confidence: 86, status: "Strong Hatcher" },
  { county: "Lewis",      target: 1100,  needed: 900,  confidence: 88, status: "Strong Hatcher" },
  { county: "Williamson", target: 4500,  needed: 3800, confidence: 90, status: "Strong Hatcher" },
  { county: "Maury",      target: 3500,  needed: 3000, confidence: 85, status: "Strong Hatcher" },
];

const TOTAL_TARGET = PATH_TO_WIN.reduce((s, c) => s + c.target, 0);
const TOTAL_NEEDED = PATH_TO_WIN.reduce((s, c) => s + c.needed, 0);

const TABS = [
  { id: "overview",   label: "Race Overview" },
  { id: "voters",     label: "Persuadable Voters" },
  { id: "spend",      label: "Spend Plan & Strategy" },
  { id: "profiles",   label: "Voter Profiles" },
  { id: "path",       label: "Path to Win" },
  { id: "intel",      label: "District Intelligence" },
  { id: "oppo",       label: "Opposition Research" },
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
  const { ref, inView } = useInView();
  // Parse numeric value for count-up animation
  const numMatch = value.replace(/,/g, "").match(/([^\d]*?)([\d.]+)([^\d]*)/);
  const numTarget = numMatch ? parseFloat(numMatch[2]) : 0;
  const prefix = numMatch ? numMatch[1] : "";
  const suffix = numMatch ? numMatch[3] : "";
  const hasDecimals = numMatch ? numMatch[2].includes(".") : false;
  const animated = useCountUp(inView ? numTarget : 0, 1200, hasDecimals ? 1 : 0, prefix, suffix);
  const displayValue = numTarget > 0 ? animated : value;
  return (
    <div ref={ref} style={{
      background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "18px 20px",
      borderTop: `3px solid ${color}`,
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : "translateY(12px)",
      transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
    }}>
      <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 800, color: C.white, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{displayValue}</div>
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
        <KpiCard label="New-District Voters" value="83%" sub="Never voted in this race before" color={C.gold} C={C} />
        <KpiCard label="New Counties Added" value="14" sub="Hatcher's home turf from Ag Comm." color={C.accent2} C={C} />
        <KpiCard label="Persuadable Voters" value="47,300" sub="Across all 14 new counties" color={C.accent} C={C} />
        <KpiCard label="Days to August 6" value={RACE.daysOut.toString()} sub="Early voting open now" color={C.accent2} C={C} />
      </div>

      {/* Polling */}
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
          <SectionLabel C={C}>Structural Advantage</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 10, padding: 14 }}>
              <div style={{ fontSize: 12, color: C.gold, fontWeight: 700, marginBottom: 6 }}>⚡ Why This Race Is Winnable</div>
              <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>
                Redistricting removed Ogles' home counties and added 14 rural counties where Hatcher spent 7 years as Agriculture Commissioner. 83% of voters are casting ballots in a congressional race they have never voted in before. Ogles has no infrastructure in these counties. Hatcher does.
              </div>
            </div>
            <div style={{ background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 10, padding: 14 }}>
              <div style={{ fontSize: 12, color: C.accent, fontWeight: 700, marginBottom: 6 }}>📋 The Ethics Investigation</div>
              <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>
                The House Ethics Committee voted 6-0 to investigate Ogles over a reported $320,000 campaign loan that his own treasurer said was fabricated. The investigation is ongoing. Voters in the new counties have not heard this story.
              </div>
            </div>
            <div style={{ background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 10, padding: 14 }}>
              <div style={{ fontSize: 12, color: C.green, fontWeight: 700, marginBottom: 6 }}>🌾 The Hatcher Advantage</div>
              <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>
                Early voting is open now. The campaign with the stronger ground game and paid media presence in the 14 new counties has a structural advantage in a low-turnout primary where name recognition moves votes.
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
          <KpiCard label="Reachable in 21 Days" value="41,800" sub="Via CTV + digital + programmatic" color={C.accent2} C={C} />
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
      {/* Known Contacts in District */}
      <KnownContactsTable mobile={mobile} C={C} />
    </div>
  );
}

// ── Contact Ad Action Panel ─────────────────────────────────────────────────
type AdChannel = "ctv" | "social" | "email" | "sms";
type SocialPlatform = "facebook" | "instagram" | "tiktok" | "youtube";
type CtvPlatform = string;

// ── Full CTV Network Registry ────────────────────────────────────────────────
type CTVNetwork = { id: string; label: string; category: string; cpm: string; reach: string; color: string; ageGroups: string[]; income: string[]; political: string[]; viewing: string[]; };

const CTV_NETWORKS: CTVNetwork[] = [
  // Subscription / Premium
  { id: "hulu",        label: "Hulu",             category: "Premium", cpm: "$22–28", reach: "48M HH",  color: "#1ce783", ageGroups: ["25-34","35-44","45-54"], income: ["middle","high"],       political: ["swing","moderate"],        viewing: ["drama","comedy","sports"] },
  { id: "peacock",     label: "Peacock",           category: "Premium", cpm: "$18–24", reach: "33M HH",  color: "#fa7a35", ageGroups: ["35-44","45-54","55-64"], income: ["middle","high"],       political: ["swing","conservative"],    viewing: ["news","sports","drama"] },
  { id: "paramount",   label: "Paramount+",        category: "Premium", cpm: "$20–26", reach: "67M HH",  color: "#0064ff", ageGroups: ["35-44","45-54","55-64"], income: ["middle","high"],       political: ["conservative","swing"],    viewing: ["news","drama","sports"] },
  { id: "youtube_tv",  label: "YouTube TV",        category: "Premium", cpm: "$15–20", reach: "8M HH",   color: "#ff0000", ageGroups: ["25-34","35-44","45-54"], income: ["high"],               political: ["swing","moderate"],        viewing: ["sports","news","variety"] },
  { id: "max",         label: "Max (HBO)",          category: "Premium", cpm: "$24–32", reach: "95M HH",  color: "#0050ef", ageGroups: ["25-34","35-44","45-54"], income: ["high"],               political: ["moderate","swing"],        viewing: ["drama","documentary"] },
  { id: "disney",      label: "Disney+",            category: "Premium", cpm: "$20–28", reach: "150M HH", color: "#113ccf", ageGroups: ["25-34","35-44"],          income: ["middle","high"],       political: ["swing","moderate"],        viewing: ["family","drama"] },
  { id: "apple",       label: "Apple TV+",          category: "Premium", cpm: "$25–35", reach: "25M HH",  color: "#888",    ageGroups: ["25-34","35-44","45-54"], income: ["high"],               political: ["moderate","swing"],        viewing: ["drama","documentary"] },
  // Free Ad-Supported (FAST)
  { id: "pluto",       label: "Pluto TV",           category: "FAST",    cpm: "$10–16", reach: "80M HH",  color: "#00c2e0", ageGroups: ["45-54","55-64","65+"],    income: ["low","middle"],        political: ["conservative","swing"],    viewing: ["news","western","classic"] },
  { id: "tubi",        label: "Tubi",               category: "FAST",    cpm: "$10–15", reach: "74M HH",  color: "#fa4700", ageGroups: ["35-44","45-54","55-64"], income: ["low","middle"],        political: ["conservative","swing"],    viewing: ["drama","western","family"] },
  { id: "freevee",     label: "Amazon Freevee",     category: "FAST",    cpm: "$12–18", reach: "50M HH",  color: "#ff9900", ageGroups: ["35-44","45-54","55-64"], income: ["middle"],              political: ["swing"],                   viewing: ["drama","comedy","variety"] },
  { id: "peacock_free",label: "Peacock Free",       category: "FAST",    cpm: "$12–18", reach: "33M HH",  color: "#fa7a35", ageGroups: ["45-54","55-64","65+"],    income: ["low","middle"],        political: ["conservative","swing"],    viewing: ["news","sports","drama"] },
  { id: "plex",        label: "Plex TV",            category: "FAST",    cpm: "$8–14",  reach: "32M HH",  color: "#e5a00d", ageGroups: ["25-34","35-44","45-54"], income: ["middle"],              political: ["swing","moderate"],        viewing: ["documentary","drama","variety"] },
  { id: "xumo",        label: "Xumo Play",          category: "FAST",    cpm: "$9–14",  reach: "20M HH",  color: "#7b2d8b", ageGroups: ["45-54","55-64","65+"],    income: ["low","middle"],        political: ["conservative"],            viewing: ["news","classic","western"] },
  { id: "crackle",     label: "Crackle",            category: "FAST",    cpm: "$8–12",  reach: "5M HH",   color: "#e50914", ageGroups: ["35-44","45-54"],          income: ["low","middle"],        political: ["swing"],                   viewing: ["drama","comedy"] },
  // Device-Native
  { id: "roku",        label: "Roku Channel",       category: "Device",  cpm: "$12–18", reach: "80M HH",  color: "#6c1d8e", ageGroups: ["35-44","45-54","55-64","65+"], income: ["middle"],         political: ["conservative","swing"],    viewing: ["news","sports","western","classic"] },
  { id: "samsung",     label: "Samsung TV Plus",    category: "Device",  cpm: "$10–16", reach: "70M HH",  color: "#1428a0", ageGroups: ["35-44","45-54","55-64","65+"], income: ["middle","high"],    political: ["conservative","swing"],    viewing: ["news","sports","drama"] },
  { id: "fire",        label: "Amazon Fire TV",     category: "Device",  cpm: "$14–20", reach: "55M HH",  color: "#ff9900", ageGroups: ["35-44","45-54","55-64"], income: ["middle","high"],       political: ["swing","conservative"],    viewing: ["drama","variety","sports"] },
  { id: "lg",          label: "LG Channels",        category: "Device",  cpm: "$10–15", reach: "30M HH",  color: "#a50034", ageGroups: ["45-54","55-64","65+"],    income: ["middle","high"],       political: ["conservative","swing"],    viewing: ["news","sports","classic"] },
  { id: "vizio",       label: "VIZIO WatchFree+",   category: "Device",  cpm: "$9–14",  reach: "18M HH",  color: "#555",    ageGroups: ["45-54","55-64","65+"],    income: ["low","middle"],        political: ["conservative"],            viewing: ["news","western","classic"] },
  // vMVPD / Live TV
  { id: "sling",       label: "Sling TV",           category: "vMVPD",   cpm: "$18–26", reach: "2.3M HH", color: "#00bcd4", ageGroups: ["45-54","55-64","65+"],    income: ["middle"],              political: ["conservative","swing"],    viewing: ["news","sports","western"] },
  { id: "fubo",        label: "FuboTV",             category: "vMVPD",   cpm: "$20–28", reach: "1.5M HH", color: "#e31837", ageGroups: ["35-44","45-54"],          income: ["high"],               political: ["swing"],                   viewing: ["sports"] },
  { id: "directv",     label: "DirecTV Stream",     category: "vMVPD",   cpm: "$22–30", reach: "3M HH",   color: "#00a8e0", ageGroups: ["45-54","55-64","65+"],    income: ["middle","high"],       political: ["conservative"],            viewing: ["news","sports","western"] },
  { id: "philo",       label: "Philo",              category: "vMVPD",   cpm: "$14–20", reach: "1M HH",   color: "#5c2d91", ageGroups: ["25-34","35-44","45-54"], income: ["low","middle"],        political: ["swing"],                   viewing: ["drama","comedy","variety"] },
  // Local / News
  { id: "local_news",  label: "Local News (OTT)",   category: "Local",   cpm: "$12–18", reach: "Market",  color: "#f59e0b", ageGroups: ["45-54","55-64","65+"],    income: ["low","middle","high"],  political: ["conservative","swing"],    viewing: ["news"] },
  { id: "newson",      label: "NewsON",             category: "Local",   cpm: "$10–16", reach: "Market",  color: "#1d4ed8", ageGroups: ["55-64","65+"],            income: ["low","middle"],        political: ["conservative"],            viewing: ["news"] },
  { id: "cbsnews",     label: "CBS News Streaming", category: "Local",   cpm: "$16–22", reach: "National",color: "#0039a6", ageGroups: ["45-54","55-64","65+"],    income: ["middle","high"],       political: ["swing","moderate"],        viewing: ["news"] },
  { id: "nbcnews",     label: "NBC News NOW",       category: "Local",   cpm: "$16–22", reach: "National",color: "#fa7a35", ageGroups: ["45-54","55-64","65+"],    income: ["middle","high"],       political: ["swing","moderate"],        viewing: ["news"] },
  { id: "abcnews",     label: "ABC News Live",      category: "Local",   cpm: "$16–22", reach: "National",color: "#003087", ageGroups: ["45-54","55-64","65+"],    income: ["middle","high"],       political: ["swing","moderate"],        viewing: ["news"] },
  { id: "foxnow",      label: "Fox Now",            category: "Local",   cpm: "$18–24", reach: "National",color: "#003366", ageGroups: ["45-54","55-64","65+"],    income: ["middle","high"],       political: ["conservative"],            viewing: ["news","sports"] },
];

const CTV_CATEGORIES = ["All", "Premium", "FAST", "Device", "vMVPD", "Local"];

function buildMessages(contact: KnownContact) {
  const firstName = contact.n.split(" ")[0];
  const isParent = contact.ch === "Y";
  const isFarmer = ["Henry", "Weakley", "Obion", "Dyer", "Lauderdale", "Benton", "Humphreys", "Houston", "Stewart", "Lake"].includes(contact.co);
  const isVet = contact.g === "M" && (contact.a === "55-64" || contact.a === "65 and older");

  const hook = isFarmer
    ? "Charlie Hatcher has been in your county's barns. He knows what diesel costs, what fertilizer costs, and what it means to protect the land your family farms."
    : isParent
    ? "Charlie Hatcher passed the Farmland Preservation Act to protect Tennessee land for the next generation — including yours."
    : isVet
    ? "Charlie Hatcher believes in less talk and more work. 7 years as Ag Commissioner. 8 businesses built. A record that speaks for itself."
    : "Charlie Hatcher is a 10th-generation Tennessee farmer, veterinarian, and 7-year Agriculture Commissioner. He showed up before he needed your vote.";

  return {
    email: {
      subject: `${firstName}, a Tennessee farmer needs your vote on August 6`,
      body: `Hi ${firstName},\n\nMy name is Charlie Hatcher. I'm a veterinarian, a dairy farmer, and for the past seven years I've served as Tennessee's Agriculture Commissioner — traveling every county in this state, including yours.\n\n${hook}\n\nOn August 6, I'm asking for your vote in the Republican primary for Tennessee's 5th Congressional District. This district was redrawn to include the rural counties I've spent my career serving. I know these roads. I know these farms. I know what Washington is getting wrong.\n\nYou want something hard done right? Hire a farmer.\n\nEarly voting is open now through August 1.\n\nWith gratitude,\nCharlie Hatcher\nCharlie Hatcher for Congress\nhttps://charliehatcher.com`,
    },
    sms: `Hi ${firstName} — Charlie Hatcher here, TN farmer & Ag Commissioner running for Congress in CD-5. Early voting is open NOW through Aug 1. I've spent 7 years in your county fighting for farmers & families. Vote Charlie Hatcher Aug 6. Learn more: charliehatcher.com Reply STOP to opt out.`,
    social: {
      facebook: `${firstName} lives in ${contact.c}, ${contact.co} County — a persuadable Republican primary voter. Target with: "Hire a Farmer" 15-second video ad. Audience: Republican primary voters, ${contact.co} County, age ${contact.a || "25-65+"}. Budget: $8–12 CPM. ${hook}`,
      instagram: `Reel ad — 15 sec. Open on Hatcher walking a field at sunrise. VO: "Ten generations. One mission. Less talk. More work." End card: Vote Charlie Hatcher · August 6. Target: ${contact.co} County, ${contact.a || "25-54"}, interests: farming, rural life, conservative values.`,
      tiktok: `UGC-style 30-sec video. Farmer or rural mom to camera: "I'm voting for Charlie Hatcher because he's been in my barn. He knows what it costs to run a farm. He's not a politician — he's one of us." Hashtags: #HireAFarmer #TN5 #CharlieHatcher #Tennessee. Target: ${contact.co} County zip codes.`,
      youtube: `Pre-roll 15-sec non-skippable. Open: aerial shot of Tennessee farmland. VO: "Charlie Hatcher. Veterinarian. Farmer. 7-year Ag Commissioner. The new 5th District needs someone who's already been here." CTA: Vote August 6. Target: ${contact.co} County, YouTube TV + connected devices, political content viewers.`,
    },
    ctv: {
      hulu: `30-sec spot on Hulu. ZIP code targeting: ${contact.c}, ${contact.co} County. Ad unit: mid-roll, non-skippable. Creative: "Farm Strong" 30-sec (CH26-106W). Frequency cap: 4x/week. Estimated CPM: $22–28. Message: Hatcher's Ag Commissioner record + "Hire a Farmer" close.`,
      peacock: `30-sec spot on Peacock. County-level targeting: ${contact.co} County. Ad unit: pre-roll on local news and sports content. Creative: "Farm Strong" 30-sec. Frequency cap: 3x/week. Estimated CPM: $18–24. Best for: news-watching voters 45+.`,
      paramount: `30-sec spot on Paramount+. ZIP targeting: ${contact.c} area. Ad unit: mid-roll. Creative: "Farm Strong" 30-sec. Frequency cap: 3x/week. CPM: $20–26. Audience: rural households, conservative content viewers.`,
      youtube_tv: `15-sec pre-roll on YouTube TV. County targeting: ${contact.co}. Non-skippable. Creative: "Farm Strong" 15-sec (CH26-107W). Frequency: 5x/week. CPM: $15–20. High-recall format — best for name ID in new counties.`,
      local_news: `30-sec spot on local news streaming (NewsON, local ABC/NBC/CBS affiliates). ${contact.co} County DMA. Creative: "Farm Strong" 30-sec. Frequency: 3x/week. CPM: $12–18. Highest trust format — local news viewers are high-propensity primary voters.`,
    },
  };
}

// ── Demo TV Ad Script ─────────────────────────────────────────────────────────
const DEMO_TV_SCRIPT = `[TARGETING NOTE]
Platform: Hulu / Roku / Samsung TV Plus
Format: :30 non-skippable mid-roll
Targeting: Henry, Weakley, Obion, Dyer counties — ZIP-level
CPM: $14–22 | Frequency cap: 4x/week

[OPEN — 0–5 sec]
VOICEOVER: "Every morning, before Washington wakes up..."

[BODY — 5–25 sec]
VOICEOVER: "...a Tennessee farmer is already working."
"Charlie Hatcher has been your Agriculture Commissioner for seven years. He's been in your county's barns. He knows what diesel costs. He knows what fertilizer costs. He knows what it means to protect the land your family farms."
"Eight businesses built. The Farmland Preservation Act passed. A record that speaks for itself."

[CLOSE — 25–30 sec]
VOICEOVER: "You want something hard done right? Hire a farmer."
"Vote Charlie Hatcher — August 6th Republican Primary."
CHARLIE: "I'm Charlie Hatcher, and I approve this message."
[END CARD: charliehatcher.com · Early voting open now]`;

// ── Demo UGC Video Script ─────────────────────────────────────────────────────
const DEMO_UGC_SCRIPT = `## PERSONA
Local farmer, 50s, standing at the edge of a field at sunrise. Worn work boots. Speaks directly to camera — no teleprompter.

## HOOK (0–2 sec)
"I'm not a political person. But I'm voting for Charlie Hatcher."

## FULL SCRIPT (word-for-word, ~25 sec)
"I've farmed this land my whole life. Charlie Hatcher has been in my barn — not because he had to be, but because he wanted to know what was going on. He passed the Farmland Preservation Act. He showed up before he needed our vote. That's who I want in Washington. Vote Charlie Hatcher, August 6th."

## VISUAL DIRECTION
Location: Farm field or barn, golden hour light
Framing: 9:16 vertical, chest-up medium shot
B-roll: Wide shot of farmland, hands on fence post, tractor in background
No graphics, no lower thirds — raw and authentic

## CAPTION
"I'm not a political person. But I'm voting for Charlie Hatcher. 🌾 #HireAFarmer #TN5 #CharlieHatcher"

## HASHTAGS
#HireAFarmer #TN5 #CharlieHatcher #Tennessee #FarmStrong #VoteAugust6

## PRODUCTION NOTES
iPhone 14+ in portrait mode · Natural light only · No ring light · Shoot 3 takes · Keep it under 30 sec · Don't cut — one continuous take feels most authentic

## AD TARGETING
Platform: TikTok + Instagram Reels
Audience: Republican primary voters, rural counties, 35–65+
County: Henry, Weakley, Obion, Dyer, Lauderdale
Budget: $8–12 CPM · $500–1,500 test budget`;

function AdActionPanel({ contact, onClose, C }: { contact: KnownContact; onClose: () => void; C: C }) {
  const [channel, setChannel] = useState<AdChannel>("ctv");
  const [ctvCategory, setCtvCategory] = useState("All");
  const [ctvPlatform, setCtvPlatform] = useState<string>("hulu");
  const [socialPlatform, setSocialPlatform] = useState<SocialPlatform>("facebook");
  const [copied, setCopied] = useState("");
  const [aiCopy, setAiCopy] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [showDemoTV, setShowDemoTV] = useState(false);
  const [showDemoUGC, setShowDemoUGC] = useState(false);
  const [ugcBrief, setUgcBrief] = useState("");
  const [ugcLoading, setUgcLoading] = useState(false);
  const [selectedPost, setSelectedPost] = useState("grandkids-tractor");
  const msgs = buildMessages(contact);

  const generateCTV = trpc.campaign.generateCTVCopy.useMutation();
  const generateSocial = trpc.campaign.generateSocialCopy.useMutation();
  const generateEmail = trpc.campaign.generateEmailCopy.useMutation();
  const generateSMS = trpc.campaign.generateSMSCopy.useMutation();
  const generateUGC = trpc.campaign.generateUGCVideoBrief.useMutation();

  const contactInput = {
    contactName: contact.n,
    contactCity: contact.c,
    contactCounty: contact.co,
    contactAge: contact.a,
    contactGender: contact.g,
    contactMarried: contact.m,
    contactChildren: contact.ch,
  };

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(""), 2000);
    });
  };

  const CopyBtn = ({ text, id }: { text: string; id: string }) => (
    <button onClick={() => copyText(text, id)}
      style={{ padding: "4px 10px", borderRadius: 6, border: `1px solid ${C.border}`, background: copied === id ? C.green : C.bg3, color: copied === id ? "#fff" : C.muted, fontSize: 11, cursor: "pointer", transition: "all 0.2s", flexShrink: 0 }}>
      {copied === id ? "✓ Copied" : "Copy"}
    </button>
  );

  const handleGenerateAI = async () => {
    setAiLoading(true);
    setAiCopy("");
    try {
      let result: { copy: string } | undefined;
      if (channel === "ctv") {
        const net = CTV_NETWORKS.find(n => n.id === ctvPlatform);
        result = await generateCTV.mutateAsync({ ...contactInput, platform: net?.label || ctvPlatform });
      } else if (channel === "social") {
        result = await generateSocial.mutateAsync({ ...contactInput, platform: socialPlatform });
      } else if (channel === "email") {
        result = await generateEmail.mutateAsync(contactInput);
      } else if (channel === "sms") {
        result = await generateSMS.mutateAsync(contactInput);
      }
      if (result) setAiCopy(result.copy);
    } catch (e) {
      setAiCopy("Error generating copy. Please try again.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleGenerateUGC = async () => {
    setUgcLoading(true);
    setUgcBrief("");
    try {
      const result = await generateUGC.mutateAsync({ ...contactInput, platform: socialPlatform });
      setUgcBrief(result.brief);
    } catch (e) {
      setUgcBrief("Error generating brief. Please try again.");
    } finally {
      setUgcLoading(false);
    }
  };

  const channelBtns: { id: AdChannel; label: string; icon: string }[] = [
    { id: "ctv", label: "Connected TV", icon: "📺" },
    { id: "social", label: "Social Media", icon: "📱" },
    { id: "email", label: "Email", icon: "✉️" },
    { id: "sms", label: "SMS", icon: "💬" },
  ];

  const socialPlatforms: { id: SocialPlatform; label: string; icon: string; color: string }[] = [
    { id: "facebook", label: "Facebook", icon: "f", color: "#1877f2" },
    { id: "instagram", label: "Instagram", icon: "IG", color: "#e1306c" },
    { id: "tiktok", label: "TikTok", icon: "TT", color: "#010101" },
    { id: "youtube", label: "YouTube", icon: "▶", color: "#ff0000" },
  ];

  // Smart CTV filter state
  const [ctvAgeFilter, setCtvAgeFilter] = useState("All");
  const [ctvIncomeFilter, setCtvIncomeFilter] = useState("All");
  const [ctvPoliticalFilter, setCtvPoliticalFilter] = useState("All");
  const [ctvViewingFilter, setCtvViewingFilter] = useState("All");
  const [ctvPreset, setCtvPreset] = useState("");

  // Demographic presets
  const CTV_PRESETS = [
    { id: "senior-conservative", label: "Senior Conservative", icon: "🗳️",
      age: "65+", income: "All", political: "conservative", viewing: "news" },
    { id: "rural-household", label: "Rural Household", icon: "🌾",
      age: "55-64", income: "middle", political: "conservative", viewing: "western" },
    { id: "high-income", label: "High Income", icon: "💼",
      age: "All", income: "high", political: "All", viewing: "All" },
    { id: "sports-fan", label: "Sports Fan", icon: "🏈",
      age: "All", income: "All", political: "All", viewing: "sports" },
    { id: "news-watcher", label: "News Watcher", icon: "📰",
      age: "All", income: "All", political: "All", viewing: "news" },
    { id: "swing-voter", label: "Swing Voter", icon: "⚖️",
      age: "All", income: "All", political: "swing", viewing: "All" },
  ];

  // Auto-derive voter profile from contact data for "Best Match" preset
  const voterAge = contact.a ? parseInt(contact.a) : 0;
  const voterAgeGroup = voterAge >= 65 ? "65+" : voterAge >= 55 ? "55-64" : voterAge >= 45 ? "45-54" : voterAge >= 35 ? "35-44" : voterAge >= 25 ? "25-34" : "All";
  const ruralCounties = ["Lake","Obion","Weakley","Henry","Dyer","Lauderdale","Benton","Houston","Stewart","Humphreys","Hickman","Lewis"];
  const isRural = ruralCounties.some(c => contact.co?.includes(c));
  const voterIncome = isRural ? "middle" : "high";
  const voterPolitical = "conservative"; // All CD-5 Republican primary voters
  const voterViewing = isRural ? "news" : "news";

  // Compute match score for a network (0–4 dimensions matched)
  const scoreNetwork = (net: CTVNetwork, age: string, income: string, political: string, viewing: string) => {
    let score = 0;
    if (age !== "All" && net.ageGroups.includes(age)) score++;
    if (income !== "All" && net.income.includes(income)) score++;
    if (political !== "All" && net.political.includes(political)) score++;
    if (viewing !== "All" && net.viewing.includes(viewing)) score++;
    return score;
  };

  // Apply all active filters and sort by match score
  const filteredNetworks = useMemo(() => {
    let nets = ctvCategory === "All" ? CTV_NETWORKS : CTV_NETWORKS.filter(n => n.category === ctvCategory);
    if (ctvAgeFilter !== "All") nets = nets.filter(n => n.ageGroups.includes(ctvAgeFilter));
    if (ctvIncomeFilter !== "All") nets = nets.filter(n => n.income.includes(ctvIncomeFilter));
    if (ctvPoliticalFilter !== "All") nets = nets.filter(n => n.political.includes(ctvPoliticalFilter));
    if (ctvViewingFilter !== "All") nets = nets.filter(n => n.viewing.includes(ctvViewingFilter));
    // Sort by voter profile match score descending
    return [...nets].sort((a, b) => {
      const sa = scoreNetwork(a, voterAgeGroup, voterIncome, voterPolitical, voterViewing);
      const sb = scoreNetwork(b, voterAgeGroup, voterIncome, voterPolitical, voterViewing);
      return sb - sa;
    });
  }, [ctvCategory, ctvAgeFilter, ctvIncomeFilter, ctvPoliticalFilter, ctvViewingFilter, voterAgeGroup, voterIncome]);

  const applyPreset = (preset: typeof CTV_PRESETS[0]) => {
    setCtvPreset(preset.id);
    setCtvAgeFilter(preset.age);
    setCtvIncomeFilter(preset.income);
    setCtvPoliticalFilter(preset.political);
    setCtvViewingFilter(preset.viewing);
    setCtvCategory("All");
  };

  const applyVoterMatch = () => {
    setCtvPreset("voter-match");
    setCtvAgeFilter(voterAgeGroup);
    setCtvIncomeFilter(voterIncome);
    setCtvPoliticalFilter(voterPolitical);
    setCtvViewingFilter(voterViewing);
    setCtvCategory("All");
  };

  const clearFilters = () => {
    setCtvPreset("");
    setCtvAgeFilter("All");
    setCtvIncomeFilter("All");
    setCtvPoliticalFilter("All");
    setCtvViewingFilter("All");
  };

  const hasActiveFilters = ctvAgeFilter !== "All" || ctvIncomeFilter !== "All" || ctvPoliticalFilter !== "All" || ctvViewingFilter !== "All";

  const selectedNetwork = CTV_NETWORKS.find(n => n.id === ctvPlatform) || CTV_NETWORKS[0];

  const firstName = contact.n.split(" ")[0];

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "flex-end", justifyContent: "flex-end" }}>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.7)" }} />
      {/* Panel */}
      <div style={{ position: "relative", width: "min(580px, 100vw)", height: "100vh", background: C.bg, borderLeft: `1px solid ${C.border}`, display: "flex", flexDirection: "column", overflowY: "auto", animation: "slideInRight 0.25s cubic-bezier(0.23,1,0.32,1)" }}>
        {/* Header */}
        <div style={{ padding: "18px 20px 14px", borderBottom: `1px solid ${C.border}`, background: C.card, flexShrink: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 10, color: C.accent2, textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700, marginBottom: 4 }}>Run an Ad To</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: C.white }}>{contact.n}</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{contact.c}, {contact.co} County · {contact.a || "Age unknown"} · {contact.g === "M" ? "Male" : contact.g === "F" ? "Female" : "Unknown"}</div>
            </div>
            <button onClick={onClose} style={{ background: "transparent", border: `1px solid ${C.border}`, color: C.muted, borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 14 }}>✕</button>
          </div>
        </div>

        {/* Channel selector */}
        <div style={{ padding: "14px 20px 0", flexShrink: 0 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
            {channelBtns.map(btn => (
              <button key={btn.id} onClick={() => { setChannel(btn.id); setAiCopy(""); setUgcBrief(""); }}
                style={{ padding: "10px 4px", borderRadius: 10, border: `2px solid ${channel === btn.id ? C.accent : C.border}`, background: channel === btn.id ? `${C.accent}18` : C.card, color: channel === btn.id ? C.accent : C.muted, cursor: "pointer", fontSize: 11, fontWeight: 700, textAlign: "center", transition: "all 0.15s" }}>
                <div style={{ fontSize: 18, marginBottom: 4 }}>{btn.icon}</div>
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content area */}
        <div style={{ padding: "14px 20px 24px", flex: 1 }}>

          {/* ── CTV Channel ── */}
          {channel === "ctv" && (
            <div>
              {/* Demo TV Ad */}
              {/* ── Real TV Ad Video ── */}
              <div style={{ background: `${C.accent}10`, border: `1px solid ${C.accent}40`, borderRadius: 12, overflow: "hidden", marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px" }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: C.accent2 }}>🎬 TV Ad — "Farmers in Congress" :30</div>
                    <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>Charlie Hatcher for Congress · Ready to serve on all CTV platforms</div>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => setShowDemoTV(!showDemoTV)}
                      style={{ padding: "4px 10px", borderRadius: 6, border: `1px solid ${C.accent}`, background: showDemoTV ? C.accent : "transparent", color: showDemoTV ? "#fff" : C.accent2, fontSize: 11, cursor: "pointer", fontWeight: 600 }}>
                      {showDemoTV ? "Hide Video" : "▶ Watch Ad"}
                    </button>
                    <a href="https://drive.google.com/file/d/1_uVLZ8UlzpkRpGEBzEyOp1e_HOgVJqwr/view" target="_blank" rel="noopener noreferrer"
                      style={{ padding: "4px 10px", borderRadius: 6, border: `1px solid ${C.green}`, background: `${C.green}20`, color: C.green, fontSize: 11, cursor: "pointer", fontWeight: 600, textDecoration: "none", display: "inline-block" }}>
                      ↗ Open Full
                    </a>
                  </div>
                </div>
                {showDemoTV && (
                  <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden" }}>
                    <iframe
                      src="https://drive.google.com/file/d/1_uVLZ8UlzpkRpGEBzEyOp1e_HOgVJqwr/preview"
                      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
                      allow="autoplay"
                      title="Hatcher TV Ad - Farmers in Congress"
                    />
                  </div>
                )}
                {showDemoTV && (
                  <div style={{ padding: "10px 14px", borderTop: `1px solid ${C.border}` }}>
                    <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{DEMO_TV_SCRIPT}</div>
                  </div>
                )}
              </div>

              {/* ── Smart CTV Filter System ── */}
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 14, marginBottom: 14 }}>

                {/* Best Match for voter button */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Smart Network Filter</div>
                  <button onClick={applyVoterMatch}
                    style={{ padding: "5px 12px", borderRadius: 20, border: `1px solid ${C.accent}`, background: ctvPreset === "voter-match" ? C.accent : `${C.accent}18`, color: ctvPreset === "voter-match" ? "#fff" : C.accent2, fontSize: 11, fontWeight: 700, cursor: "pointer", transition: "all 0.15s", display: "flex", alignItems: "center", gap: 5 }}>
                    <span>⭐</span> Best Match for {firstName}
                  </button>
                </div>

                {/* Quick-select demographic presets */}
                <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 10 }}>
                  {CTV_PRESETS.map(preset => (
                    <button key={preset.id} onClick={() => applyPreset(preset)}
                      style={{ padding: "4px 10px", borderRadius: 20, border: `1px solid ${ctvPreset === preset.id ? C.gold : C.border}`, background: ctvPreset === preset.id ? `${C.gold}22` : "transparent", color: ctvPreset === preset.id ? C.gold : C.muted, cursor: "pointer", fontSize: 11, fontWeight: 600, transition: "all 0.15s", display: "flex", alignItems: "center", gap: 4 }}>
                      <span>{preset.icon}</span> {preset.label}
                    </button>
                  ))}
                </div>

                {/* Dimension filter dropdowns */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 8 }}>
                  {/* Age filter */}
                  <div>
                    <div style={{ fontSize: 10, color: C.muted, marginBottom: 3 }}>Age Group</div>
                    <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                      {["All","25-34","35-44","45-54","55-64","65+"].map(a => (
                        <button key={a} onClick={() => { setCtvAgeFilter(a); setCtvPreset(""); }}
                          style={{ padding: "3px 8px", borderRadius: 6, border: `1px solid ${ctvAgeFilter === a ? C.accent2 : C.border}`, background: ctvAgeFilter === a ? `${C.accent2}22` : "transparent", color: ctvAgeFilter === a ? C.accent2 : C.muted, cursor: "pointer", fontSize: 10, fontWeight: 600, transition: "all 0.12s" }}>
                          {a}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Income filter */}
                  <div>
                    <div style={{ fontSize: 10, color: C.muted, marginBottom: 3 }}>Income</div>
                    <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                      {["All","low","middle","high"].map(inc => (
                        <button key={inc} onClick={() => { setCtvIncomeFilter(inc); setCtvPreset(""); }}
                          style={{ padding: "3px 8px", borderRadius: 6, border: `1px solid ${ctvIncomeFilter === inc ? C.gold : C.border}`, background: ctvIncomeFilter === inc ? `${C.gold}22` : "transparent", color: ctvIncomeFilter === inc ? C.gold : C.muted, cursor: "pointer", fontSize: 10, fontWeight: 600, transition: "all 0.12s", textTransform: "capitalize" }}>
                          {inc}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Political filter */}
                  <div>
                    <div style={{ fontSize: 10, color: C.muted, marginBottom: 3 }}>Political Lean</div>
                    <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                      {["All","conservative","swing","moderate"].map(pol => (
                        <button key={pol} onClick={() => { setCtvPoliticalFilter(pol); setCtvPreset(""); }}
                          style={{ padding: "3px 8px", borderRadius: 6, border: `1px solid ${ctvPoliticalFilter === pol ? C.red : C.border}`, background: ctvPoliticalFilter === pol ? `${C.red}22` : "transparent", color: ctvPoliticalFilter === pol ? C.red : C.muted, cursor: "pointer", fontSize: 10, fontWeight: 600, transition: "all 0.12s", textTransform: "capitalize" }}>
                          {pol}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Viewing filter */}
                  <div>
                    <div style={{ fontSize: 10, color: C.muted, marginBottom: 3 }}>Viewing Habit</div>
                    <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                      {["All","news","sports","drama","western","documentary"].map(v => (
                        <button key={v} onClick={() => { setCtvViewingFilter(v); setCtvPreset(""); }}
                          style={{ padding: "3px 8px", borderRadius: 6, border: `1px solid ${ctvViewingFilter === v ? C.green : C.border}`, background: ctvViewingFilter === v ? `${C.green}22` : "transparent", color: ctvViewingFilter === v ? C.green : C.muted, cursor: "pointer", fontSize: 10, fontWeight: 600, transition: "all 0.12s", textTransform: "capitalize" }}>
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Active filter chips + clear */}
                {hasActiveFilters && (
                  <div style={{ display: "flex", gap: 5, flexWrap: "wrap", alignItems: "center", paddingTop: 8, borderTop: `1px solid ${C.border}` }}>
                    <span style={{ fontSize: 10, color: C.muted }}>Active:</span>
                    {ctvAgeFilter !== "All" && <span style={{ padding: "2px 8px", borderRadius: 12, background: `${C.accent2}22`, color: C.accent2, fontSize: 10, fontWeight: 700 }}>Age: {ctvAgeFilter}</span>}
                    {ctvIncomeFilter !== "All" && <span style={{ padding: "2px 8px", borderRadius: 12, background: `${C.gold}22`, color: C.gold, fontSize: 10, fontWeight: 700, textTransform: "capitalize" }}>Income: {ctvIncomeFilter}</span>}
                    {ctvPoliticalFilter !== "All" && <span style={{ padding: "2px 8px", borderRadius: 12, background: `${C.red}22`, color: C.red, fontSize: 10, fontWeight: 700, textTransform: "capitalize" }}>Lean: {ctvPoliticalFilter}</span>}
                    {ctvViewingFilter !== "All" && <span style={{ padding: "2px 8px", borderRadius: 12, background: `${C.green}22`, color: C.green, fontSize: 10, fontWeight: 700, textTransform: "capitalize" }}>Viewing: {ctvViewingFilter}</span>}
                    <button onClick={clearFilters} style={{ padding: "2px 8px", borderRadius: 12, border: `1px solid ${C.border}`, background: "transparent", color: C.muted, fontSize: 10, cursor: "pointer" }}>✕ Clear</button>
                  </div>
                )}

                {/* Network type tabs */}
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 10, paddingTop: 8, borderTop: `1px solid ${C.border}` }}>
                  {CTV_CATEGORIES.map(cat => (
                    <button key={cat} onClick={() => setCtvCategory(cat)}
                      style={{ padding: "3px 9px", borderRadius: 20, border: `1px solid ${ctvCategory === cat ? C.accent : C.border}`, background: ctvCategory === cat ? C.accent : "transparent", color: ctvCategory === cat ? "#fff" : C.muted, cursor: "pointer", fontSize: 10, fontWeight: 600, transition: "all 0.15s" }}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Network grid with match scores */}
              <div style={{ fontSize: 10, color: C.muted, marginBottom: 6 }}>
                {filteredNetworks.length} network{filteredNetworks.length !== 1 ? "s" : ""} matching · sorted by voter match
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 14, maxHeight: 240, overflowY: "auto" }}>
                {filteredNetworks.map(net => {
                  const matchScore = scoreNetwork(net, voterAgeGroup, voterIncome, voterPolitical, voterViewing);
                  const matchLabel = matchScore === 4 ? "★ Best Match" : matchScore === 3 ? "✦ Strong" : matchScore === 2 ? "◆ Good" : matchScore === 1 ? "◇ Partial" : "";
                  const matchColor = matchScore === 4 ? C.gold : matchScore === 3 ? C.green : matchScore === 2 ? C.accent2 : C.muted;
                  return (
                    <button key={net.id} onClick={() => { setCtvPlatform(net.id); setAiCopy(""); }}
                      style={{ padding: "8px 10px", borderRadius: 8, border: `2px solid ${ctvPlatform === net.id ? net.color : C.border}`, background: ctvPlatform === net.id ? `${net.color}18` : C.card, cursor: "pointer", textAlign: "left", transition: "all 0.15s" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: ctvPlatform === net.id ? net.color : C.white, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "65%" }}>{net.label}</div>
                        <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 10, background: `${net.color}22`, color: net.color, fontWeight: 700, flexShrink: 0 }}>{net.category}</span>
                      </div>
                      <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{net.cpm} CPM · {net.reach}</div>
                      {matchLabel && (
                        <div style={{ fontSize: 9, color: matchColor, fontWeight: 700, marginTop: 3 }}>{matchLabel}</div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Selected network brief */}
              <div style={{ background: C.card, border: `1px solid ${selectedNetwork.color}40`, borderRadius: 10, padding: 14, marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: C.white }}>{selectedNetwork.label} — Ad Brief</div>
                    <div style={{ fontSize: 10, color: C.muted }}>{selectedNetwork.cpm} CPM · {selectedNetwork.reach} · {selectedNetwork.category}</div>
                  </div>
                  <CopyBtn text={(msgs.ctv as Record<string, string>)[ctvPlatform] || `30-sec spot on ${selectedNetwork.label}. County targeting: ${contact.co} County. Creative: "Farm Strong" :30. Frequency cap: 4x/week. CPM: ${selectedNetwork.cpm}. Audience: Republican primary voters, ${contact.co} County.`} id={`ctv-${ctvPlatform}`} />
                </div>
                <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
                  {(msgs.ctv as Record<string, string>)[ctvPlatform] || `30-sec spot on ${selectedNetwork.label}. County-level targeting: ${contact.co} County, ${contact.c} area. Ad unit: mid-roll, non-skippable. Creative: "Farm Strong" :30 (CH26-106W). Frequency cap: 4x/week. Estimated CPM: ${selectedNetwork.cpm}. Audience: Republican primary voters, rural households, conservative content viewers.`}
                </div>
              </div>

              {/* AI Generate button */}
              <div style={{ display: "flex", gap: 8, marginBottom: aiCopy ? 12 : 0 }}>
                <button onClick={handleGenerateAI} disabled={aiLoading}
                  style={{ flex: 1, padding: "10px", borderRadius: 8, border: "none", background: aiLoading ? C.bg3 : `linear-gradient(135deg, ${C.accent}, #7c3aed)`, color: "#fff", fontSize: 12, fontWeight: 700, cursor: aiLoading ? "not-allowed" : "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  {aiLoading ? "⏳ Generating..." : "✨ Generate AI Ad Copy for " + firstName}
                </button>
                <a href="https://ads.google.com/home/" target="_blank" rel="noopener noreferrer"
                  style={{ padding: "10px 14px", borderRadius: 8, border: `1px solid ${C.green}`, background: `${C.green}18`, color: C.green, fontSize: 11, fontWeight: 700, textDecoration: "none", display: "flex", alignItems: "center", gap: 4, whiteSpace: "nowrap" }}>
                  🚀 Launch Ad
                </a>
              </div>

              {aiCopy && (
                <div style={{ background: `#0a1628`, border: `1px solid ${C.accent}40`, borderRadius: 10, padding: 14, marginTop: 4 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div style={{ fontSize: 11, color: C.accent2, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>✨ AI-Generated Script — {selectedNetwork.label}</div>
                    <CopyBtn text={aiCopy} id="ai-ctv" />
                  </div>
                  <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{aiCopy}</div>
                </div>
              )}
            </div>
          )}

          {/* ── Social Media Channel ── */}
          {channel === "social" && (
            <div>
              {/* ── Real Social Posts matched to voter profile ── */}
              {(() => {
                // Match posts to voter profile
                const hasKids = contact.a && parseInt(contact.a) >= 35 && parseInt(contact.a) <= 65;
                const isRural = ["Henry","Weakley","Obion","Dyer","Gibson","Carroll","Benton","Humphreys","Houston","Stewart","Montgomery","Robertson","Cheatham","Dickson","Hickman","Perry","Lewis","Lawrence","Wayne","Hardin","McNairy","Chester","Hardeman","Fayette","Haywood","Madison"].includes(contact.co || "");
                const isSenior = contact.a && parseInt(contact.a) >= 60;

                // Three real posts with images
                const allPosts = [
                  {
                    id: "grandkids-tractor",
                    image: "/manus-storage/hatcher-grandkids-tractor_7bff15c2.png",
                    caption: "Nothing gives me more hope for the future than spending time with my grandkids. The decisions we make today will shape the Tennessee they grow up in tomorrow. That's why I'm fighting to preserve our rural communities, support hardworking families, and protect the values that have made our state strong. Let's keep Tennessee great for the next generation.",
                    topic: "Family & Rural Values",
                    audience: ["parents", "grandparents", "rural", "family"],
                    tags: "#Tennessee #RuralValues #HireAFarmer #CharlieHatcher #TN5",
                    score: (hasKids ? 3 : 0) + (isRural ? 2 : 0) + (isSenior ? 1 : 0),
                  },
                  {
                    id: "grandkids-volunteers",
                    image: "/manus-storage/hatcher-grandkids-volunteers_76573bbb.png",
                    caption: "My grandkids — the best volunteers around 🇺🇸",
                    topic: "Campaign Energy & Family",
                    audience: ["family", "volunteers", "conservatives"],
                    tags: "#HireAFarmer #CharlieHatcher #TN5 #Tennessee #ConservativeRepublican",
                    score: (hasKids ? 2 : 0) + 1,
                  },
                  {
                    id: "farmer-dc",
                    image: "/manus-storage/hatcher-farmer-congress_27a10e62.png",
                    caption: "Veterinarian. Farmer. Ag Commissioner. Business Leader. Husband, Father, Grandpa. Let's send a farmer to D.C. — Charlie Hatcher: A Farmer to Take on Washington.",
                    topic: "Candidate Bio & Mission",
                    audience: ["farmers", "rural", "conservatives", "veterans"],
                    tags: "#HireAFarmer #CharlieHatcher #TN5 #Tennessee #SendAFarmerToDC",
                    score: (isRural ? 3 : 0) + 2,
                  },
                ];

                // Sort by relevance score descending
                const sorted = [...allPosts].sort((a, b) => b.score - a.score);
                const activePost = allPosts.find(p => p.id === selectedPost) || sorted[0];

                return (
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>📱 Recommended Posts for {firstName}</div>

                    {/* Post selector tabs */}
                    <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
                      {sorted.map((p, i) => (
                        <button key={p.id} onClick={() => setSelectedPost(p.id)}
                          style={{ padding: "5px 12px", borderRadius: 20, border: `1px solid ${selectedPost === p.id ? C.accent : C.border}`, background: selectedPost === p.id ? `${C.accent}20` : "transparent", color: selectedPost === p.id ? C.accent2 : C.muted, cursor: "pointer", fontSize: 11, fontWeight: 600, transition: "all 0.15s", display: "flex", alignItems: "center", gap: 5 }}>
                          {i === 0 && <span style={{ fontSize: 9, background: C.green, color: "#fff", borderRadius: 4, padding: "1px 5px", fontWeight: 800 }}>BEST MATCH</span>}
                          {p.topic}
                        </button>
                      ))}
                    </div>

                    {/* Active post preview */}
                    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", marginBottom: 10 }}>
                      <img src={activePost.image} alt={activePost.topic}
                        style={{ width: "100%", maxHeight: 280, objectFit: "cover", objectPosition: "top", display: "block" }} />
                      <div style={{ padding: 14 }}>
                        <div style={{ fontSize: 12, color: C.white, lineHeight: 1.6, marginBottom: 8 }}>{activePost.caption}</div>
                        <div style={{ fontSize: 11, color: C.accent2, marginBottom: 10 }}>{activePost.tags}</div>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          <CopyBtn text={activePost.caption + "\n\n" + activePost.tags} id={`post-${activePost.id}`} />
                          <button onClick={() => setShowDemoUGC(!showDemoUGC)}
                            style={{ padding: "6px 14px", borderRadius: 8, border: `1px solid ${C.green}`, background: showDemoUGC ? C.green : `${C.green}15`, color: showDemoUGC ? "#fff" : C.green, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                            🎬 {showDemoUGC ? "Hide UGC Brief" : "Generate UGC Video"}
                          </button>
                          <a href="https://business.facebook.com/adsmanager" target="_blank" rel="noopener noreferrer"
                            style={{ padding: "6px 14px", borderRadius: 8, border: `1px solid #1877f2`, background: "#1877f215", color: "#1877f2", fontSize: 11, fontWeight: 700, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                            🚀 Boost Post
                          </a>
                          <button onClick={() => alert("Instagram posting: Connect your Meta Business account in Settings → Integrations to post directly. Your @rickwalkerig account is linked.")}
                            style={{ padding: "6px 14px", borderRadius: 8, border: `1px solid #e1306c`, background: "#e1306c15", color: "#e1306c", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                            📤 Post to Instagram
                          </button>
                        </div>
                      </div>
                    </div>

                    {showDemoUGC && (
                      <div style={{ background: `#0a2010`, border: `1px solid ${C.green}40`, borderRadius: 10, padding: 14, marginBottom: 10 }}>
                        <div style={{ fontSize: 11, color: C.green, fontWeight: 700, marginBottom: 6 }}>🎬 UGC Video Brief — Personalized for {firstName}</div>
                        <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{DEMO_UGC_SCRIPT}</div>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Platform selector */}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
                {socialPlatforms.map(p => (
                  <button key={p.id} onClick={() => { setSocialPlatform(p.id); setAiCopy(""); setUgcBrief(""); }}
                    style={{ padding: "6px 14px", borderRadius: 20, border: `1px solid ${socialPlatform === p.id ? p.color : C.border}`, background: socialPlatform === p.id ? p.color : "transparent", color: socialPlatform === p.id ? "#fff" : C.muted, cursor: "pointer", fontSize: 12, fontWeight: 700, transition: "all 0.15s" }}>
                    {p.icon} {p.label}
                  </button>
                ))}
              </div>

              {/* Static brief */}
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 14, marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.white }}>{socialPlatforms.find(p => p.id === socialPlatform)?.label} — Ad Brief</div>
                  <CopyBtn text={msgs.social[socialPlatform]} id={`social-${socialPlatform}`} />
                </div>
                <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.7 }}>{msgs.social[socialPlatform]}</div>
              </div>

              {/* Action buttons */}
              <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                <button onClick={handleGenerateAI} disabled={aiLoading}
                  style={{ flex: 1, minWidth: 140, padding: "10px", borderRadius: 8, border: "none", background: aiLoading ? C.bg3 : `linear-gradient(135deg, #e1306c, #7c3aed)`, color: "#fff", fontSize: 12, fontWeight: 700, cursor: aiLoading ? "not-allowed" : "pointer", transition: "all 0.2s" }}>
                  {aiLoading ? "⏳ Generating..." : "✨ AI Social Copy"}
                </button>
                <button onClick={handleGenerateUGC} disabled={ugcLoading}
                  style={{ flex: 1, minWidth: 140, padding: "10px", borderRadius: 8, border: "none", background: ugcLoading ? C.bg3 : `linear-gradient(135deg, #22c55e, #0284c7)`, color: "#fff", fontSize: 12, fontWeight: 700, cursor: ugcLoading ? "not-allowed" : "pointer", transition: "all 0.2s" }}>
                  {ugcLoading ? "⏳ Generating..." : "🎬 Generate UGC Brief"}
                </button>
                <a href={socialPlatform === "instagram" ? "https://business.facebook.com/adsmanager" : socialPlatform === "tiktok" ? "https://ads.tiktok.com/" : socialPlatform === "youtube" ? "https://ads.google.com/" : "https://business.facebook.com/adsmanager"} target="_blank" rel="noopener noreferrer"
                  style={{ padding: "10px 14px", borderRadius: 8, border: `1px solid ${C.green}`, background: `${C.green}18`, color: C.green, fontSize: 11, fontWeight: 700, textDecoration: "none", display: "flex", alignItems: "center", gap: 4, whiteSpace: "nowrap" }}>
                  🚀 Launch Ad
                </a>
              </div>

              {/* Post to Instagram button */}
              {socialPlatform === "instagram" && (
                <div style={{ background: `#e1306c10`, border: `1px solid #e1306c40`, borderRadius: 10, padding: 12, marginBottom: 12 }}>
                  <div style={{ fontSize: 11, color: "#e1306c", fontWeight: 700, marginBottom: 6 }}>📸 Post to @rickwalkerig</div>
                  <div style={{ fontSize: 11, color: C.muted, marginBottom: 8 }}>Instagram account connected. Generate UGC brief above, then post directly from the dashboard.</div>
                  <button onClick={() => alert("To post: generate the UGC brief, create the video, upload to the dashboard, then click Post. Full posting workflow requires video file upload — connect HeyGen or Higgsfield to generate the video automatically.")}
                    style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: "#e1306c", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                    📤 Post to Instagram
                  </button>
                </div>
              )}

              {aiCopy && (
                <div style={{ background: `#0a1628`, border: `1px solid ${C.accent}40`, borderRadius: 10, padding: 14, marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div style={{ fontSize: 11, color: C.accent2, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>✨ AI Social Copy</div>
                    <CopyBtn text={aiCopy} id="ai-social" />
                  </div>
                  <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{aiCopy}</div>
                </div>
              )}

              {ugcBrief && (
                <div style={{ background: `#0a2010`, border: `1px solid ${C.green}40`, borderRadius: 10, padding: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div style={{ fontSize: 11, color: C.green, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>🎬 AI UGC Video Brief</div>
                    <CopyBtn text={ugcBrief} id="ugc-brief" />
                  </div>
                  <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{ugcBrief}</div>
                </div>
              )}
            </div>
          )}

          {/* ── Email Channel ── */}
          {channel === "email" && (
            <div>
              <div style={{ fontSize: 11, color: C.muted, marginBottom: 12, lineHeight: 1.5 }}>Personalized email draft for {contact.n} in {contact.c}. Copy and send from your campaign email platform.</div>
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 14, marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <div style={{ fontSize: 11, color: C.accent2, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Subject Line</div>
                  <CopyBtn text={msgs.email.subject} id="email-subject" />
                </div>
                <div style={{ fontSize: 13, color: C.white, fontWeight: 600 }}>{msgs.email.subject}</div>
              </div>
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 14, marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div style={{ fontSize: 11, color: C.accent2, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Email Body</div>
                  <CopyBtn text={msgs.email.body} id="email-body" />
                </div>
                <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{msgs.email.body}</div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={handleGenerateAI} disabled={aiLoading}
                  style={{ flex: 1, padding: "10px", borderRadius: 8, border: "none", background: aiLoading ? C.bg3 : `linear-gradient(135deg, ${C.accent}, #7c3aed)`, color: "#fff", fontSize: 12, fontWeight: 700, cursor: aiLoading ? "not-allowed" : "pointer" }}>
                  {aiLoading ? "⏳ Generating..." : "✨ Generate AI Email for " + firstName}
                </button>
                <a href="https://mailchimp.com" target="_blank" rel="noopener noreferrer"
                  style={{ padding: "10px 14px", borderRadius: 8, border: `1px solid ${C.green}`, background: `${C.green}18`, color: C.green, fontSize: 11, fontWeight: 700, textDecoration: "none", display: "flex", alignItems: "center" }}>
                  📧 Send
                </a>
              </div>
              {aiCopy && (
                <div style={{ background: `#0a1628`, border: `1px solid ${C.accent}40`, borderRadius: 10, padding: 14, marginTop: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div style={{ fontSize: 11, color: C.accent2, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>✨ AI-Generated Email</div>
                    <CopyBtn text={aiCopy} id="ai-email" />
                  </div>
                  <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{aiCopy}</div>
                </div>
              )}
            </div>
          )}

          {/* ── SMS Channel ── */}
          {channel === "sms" && (
            <div>
              <div style={{ fontSize: 11, color: C.muted, marginBottom: 12, lineHeight: 1.5 }}>Personalized SMS for {contact.n}. 160-character limit respected. Copy and send via your SMS platform.</div>
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 14, marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.white }}>Text Message</div>
                  <CopyBtn text={msgs.sms} id="sms" />
                </div>
                <div style={{ background: "#1a2a1a", border: "1px solid #22c55e30", borderRadius: 12, padding: 14, marginBottom: 8 }}>
                  <div style={{ fontSize: 13, color: "#d1fae5", lineHeight: 1.7 }}>{msgs.sms}</div>
                </div>
                <div style={{ fontSize: 11, color: C.muted }}>{msgs.sms.length} characters · Estimated {Math.ceil(msgs.sms.length / 160)} SMS segment(s)</div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={handleGenerateAI} disabled={aiLoading}
                  style={{ flex: 1, padding: "10px", borderRadius: 8, border: "none", background: aiLoading ? C.bg3 : `linear-gradient(135deg, ${C.green}, #0284c7)`, color: "#fff", fontSize: 12, fontWeight: 700, cursor: aiLoading ? "not-allowed" : "pointer" }}>
                  {aiLoading ? "⏳ Generating..." : "✨ Generate AI SMS for " + firstName}
                </button>
                <a href="https://www.twilio.com" target="_blank" rel="noopener noreferrer"
                  style={{ padding: "10px 14px", borderRadius: 8, border: `1px solid ${C.green}`, background: `${C.green}18`, color: C.green, fontSize: 11, fontWeight: 700, textDecoration: "none", display: "flex", alignItems: "center" }}>
                  📱 Send SMS
                </a>
              </div>
              {aiCopy && (
                <div style={{ background: "#1a2a1a", border: `1px solid ${C.green}40`, borderRadius: 10, padding: 14, marginTop: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div style={{ fontSize: 11, color: C.green, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>✨ AI-Generated SMS</div>
                    <CopyBtn text={aiCopy} id="ai-sms" />
                  </div>
                  <div style={{ fontSize: 13, color: "#d1fae5", lineHeight: 1.7 }}>{aiCopy}</div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 6 }}>{aiCopy.length} characters</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Known Contacts Table ─────────────────────────────────────────────────────
const ALL_COUNTIES_FILTER = "All Counties";
const COUNTY_OPTIONS = [ALL_COUNTIES_FILTER, "Williamson", "Shelby", "Montgomery", "Maury", "Henry", "Tipton", "Weakley", "Dyer", "Hickman", "Lake", "Obion", "Stewart", "Benton", "Houston", "Lewis", "Lauderdale", "Humphreys"];

function KnownContactsTable({ mobile, C }: { mobile: boolean; C: C }) {
  const [search, setSearch] = useState("");
  const [countyFilter, setCountyFilter] = useState(ALL_COUNTIES_FILTER);
  const [page, setPage] = useState(0);
  const [selectedContact, setSelectedContact] = useState<KnownContact | null>(null);
  const PAGE_SIZE = 25;

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return KNOWN_CONTACTS.filter(c => {
      const matchSearch = !q || c.n.toLowerCase().includes(q) || c.c.toLowerCase().includes(q) || c.co.toLowerCase().includes(q);
      const matchCounty = countyFilter === ALL_COUNTIES_FILTER || c.co === countyFilter;
      return matchSearch && matchCounty;
    });
  }, [search, countyFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageData = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  // Reset page when filters change
  useEffect(() => { setPage(0); }, [search, countyFilter]);

  // County breakdown counts
  const countyCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    KNOWN_CONTACTS.forEach(c => { counts[c.co] = (counts[c.co] || 0) + 1; });
    return counts;
  }, []);

  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
      <SectionLabel C={C}>Known Contacts in CD-5 District</SectionLabel>
      <div style={{ fontSize: 13, color: C.muted, marginBottom: 16 }}>
        535 contacts from your database cross-referenced against the official CD-5 county map. These are real people in the district — warm outreach targets for the ground game.
      </div>

      {/* County summary pills */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
        {COUNTY_OPTIONS.filter(c => c !== ALL_COUNTIES_FILTER).map(co => (
          <button key={co} onClick={() => setCountyFilter(co === countyFilter ? ALL_COUNTIES_FILTER : co)}
            style={{ padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, cursor: "pointer", border: `1px solid ${countyFilter === co ? C.accent : C.border}`, background: countyFilter === co ? C.accent : "transparent", color: countyFilter === co ? "#fff" : C.muted, transition: "all 0.15s" }}>
            {co} {countyCounts[co] ? `(${countyCounts[co]})` : ""}
          </button>
        ))}
      </div>

      {/* Search + filter row */}
      <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="Search by name or city..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 180, padding: "8px 12px", borderRadius: 8, border: `1px solid ${C.border}`, background: C.bg3, color: C.white, fontSize: 13, outline: "none" }}
        />
        <select value={countyFilter} onChange={e => setCountyFilter(e.target.value)}
          style={{ padding: "8px 12px", borderRadius: 8, border: `1px solid ${C.border}`, background: C.bg3, color: C.white, fontSize: 13, cursor: "pointer" }}>
          {COUNTY_OPTIONS.map(o => <option key={o} value={o}>{o === ALL_COUNTIES_FILTER ? `All Counties (${KNOWN_CONTACTS.length})` : `${o} (${countyCounts[o] || 0})`}</option>)}
        </select>
      </div>

      {/* Results count */}
      <div style={{ fontSize: 12, color: C.muted, marginBottom: 10 }}>
        Showing {pageData.length} of {filtered.length} contacts {search || countyFilter !== ALL_COUNTIES_FILTER ? `(filtered from ${KNOWN_CONTACTS.length})` : ""}
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              {["Name", "City", "County", "Age", "Gender", "Married", "Children", ""].map((h, idx) => (
                <th key={idx} style={{ textAlign: h === "" ? "center" : "left", padding: "8px 10px", color: C.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", fontSize: 10, whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageData.map((c, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${C.border}20`, background: i % 2 === 0 ? "transparent" : `${C.bg3}50` }}>
                <td style={{ padding: "9px 10px", color: C.white, fontWeight: 600, whiteSpace: "nowrap" }}>{c.n}</td>
                <td style={{ padding: "9px 10px", color: C.muted }}>{c.c}</td>
                <td style={{ padding: "9px 10px" }}>
                  <span style={{ padding: "2px 8px", borderRadius: 10, fontSize: 11, fontWeight: 700, background: `${C.accent}22`, color: C.accent }}>{c.co}</span>
                </td>
                <td style={{ padding: "9px 10px", color: C.muted }}>{c.a || "—"}</td>
                <td style={{ padding: "9px 10px", color: c.g === "F" ? "#f472b6" : c.g === "M" ? "#60a5fa" : C.muted }}>{c.g || "—"}</td>
                <td style={{ padding: "9px 10px", color: C.muted }}>{c.m === "Y" ? "Yes" : c.m === "N" ? "No" : "—"}</td>
                <td style={{ padding: "9px 10px", color: C.muted }}>{c.ch === "Y" ? "Yes" : c.ch === "N" ? "No" : "—"}</td>
                <td style={{ padding: "9px 6px", textAlign: "center" }}>
                  <button onClick={() => setSelectedContact(c)}
                    style={{ padding: "5px 10px", borderRadius: 6, border: `1px solid ${C.accent}`, background: `${C.accent}18`, color: C.accent2, fontSize: 11, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.15s" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = C.accent; (e.currentTarget as HTMLButtonElement).style.color = "#fff"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = `${C.accent}18`; (e.currentTarget as HTMLButtonElement).style.color = C.accent2; }}>
                    Run an Ad
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Ad Action Panel slide-out */}
      {selectedContact && (
        <AdActionPanel contact={selectedContact} onClose={() => setSelectedContact(null)} C={C} />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 14 }}>
          <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
            style={{ padding: "6px 14px", borderRadius: 6, border: `1px solid ${C.border}`, background: page === 0 ? "transparent" : C.bg3, color: page === 0 ? C.muted : C.white, cursor: page === 0 ? "default" : "pointer", fontSize: 12 }}>← Prev</button>
          <span style={{ fontSize: 12, color: C.muted }}>Page {page + 1} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1}
            style={{ padding: "6px 14px", borderRadius: 6, border: `1px solid ${C.border}`, background: page === totalPages - 1 ? "transparent" : C.bg3, color: page === totalPages - 1 ? C.muted : C.white, cursor: page === totalPages - 1 ? "default" : "pointer", fontSize: 12 }}>Next →</button>
        </div>
      )}
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
          Charlie Hatcher is a 10th-generation farmer, veterinarian, and 7-year Ag Commissioner running against an incumbent under active federal ethics investigation. The structural advantage is real. But this district is 400 miles wide, heavily rural, and 83% of its voters have never cast a ballot in this congressional race. Paid media helps — a lot. It is not a silver bullet. Below are three honest investment scenarios, each with the conditions that have to hold for them to work.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 10, marginTop: 16 }}>
          <KpiCard label="New Voters in District" value="83%" sub="Never voted in this congressional race" color={C.gold} C={C} />
          <KpiCard label="Persuadable Universe" value="47,300" sub="Across all 14 new counties" color={C.accent} C={C} />
          <KpiCard label="Ogles Ethics Status" value="Active" sub="House Ethics Committee — 6-0 vote" color={C.red} C={C} />
          <KpiCard label="Days to August 6" value={RACE.daysOut.toString()} sub="Early voting open now through Aug 1" color={C.accent2} C={C} />
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
            { icon: "✓", color: "#22c55e", text: "Hatcher has the structural advantage in the 14 new counties — 7 years of Ag Commissioner relationships that Ogles simply does not have." },
            { icon: "✓", color: "#22c55e", text: "Ogles is under active ethics investigation. The House Ethics Committee voted 6-0 to investigate. Voters in the new counties have not heard this story yet." },
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
          <div style={{ fontSize: 11, fontWeight: 700, color: "#86efac", marginBottom: 6 }}>The cost of doing nothing</div>
          <div style={{ fontSize: 11, color: "#cbd5e1", lineHeight: 1.7 }}>
            In a low-turnout primary, the campaign that runs paid media in the final two weeks has a decisive advantage. The 14 new counties are deciding whether they know Charlie Hatcher's name right now — during early voting. Every day without paid media is a day those voters are making up their minds without hearing from him. The structural advantages are real. Paid media is what activates them.
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
          {tier.channels.map((s: any, ci: number) => (
            <div key={s.channel} style={{ background: C.bg3, border: `1px solid ${C.border}`, borderLeft: `4px solid ${s.color}`, borderRadius: 10, padding: 14,
              animation: `fadeSlideIn 0.4s ease-out ${ci * 80}ms both` }}>
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
function AnimatedBar({ pct, color, C }: { pct: number; color: string; C: C }) {
  const { ref, inView } = useInView();
  return (
    <div ref={ref} style={{ flex: 1, background: C.bg3, borderRadius: 3, height: 6, overflow: "hidden" }}>
      <div style={{
        width: inView ? `${pct}%` : "0%",
        background: color,
        height: "100%",
        borderRadius: 3,
        transition: "width 1s cubic-bezier(0.23,1,0.32,1)",
      }} />
    </div>
  );
}

function TabPath({ mobile, C }: { mobile: boolean; C: C }) {
  const radarData = PATH_TO_WIN.slice(0, 8).map(c => ({ county: c.county, confidence: c.confidence }));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Win Scenario */}
      <div style={{ background: "linear-gradient(135deg,#0d1a2e,#0a1628)", border: `1px solid ${C.accent}40`, borderRadius: 14, padding: "20px 24px" }}>
        <div style={{ fontSize: 10, color: C.accent2, textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 700, marginBottom: 8 }}>Exact Audience Win Scenario Model</div>
        <div style={{ fontSize: mobile ? 18 : 22, fontWeight: 900, color: C.white, marginBottom: 8 }}>
          Hatcher needs {TOTAL_NEEDED.toLocaleString()} votes across 14 counties to win
        </div>
        <div style={{ fontSize: 13, color: "#cbd5e1", maxWidth: 580, lineHeight: 1.6 }}>
          The pitch: "Eighty-three percent of the voters in this district were in a different district three months ago. This is not a re-election race — it is effectively an open seat race in 14 new counties, and Charlie Hatcher is the only candidate who has spent seven years building relationships there."
        </div>
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 12, marginTop: 20 }}>
          <KpiCard label="Votes Needed to Win" value={TOTAL_NEEDED.toLocaleString()} sub="Estimated winning threshold" color={C.accent} C={C} />
          <KpiCard label="Strong + Lean Hatcher" value="9" sub="Counties already leaning his way" color={C.green} C={C} />
          <KpiCard label="Toss-up Counties" value="3" sub="Tipton, Montgomery, Shelby" color={C.gold} C={C} />
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
              { week: "Week 1 (Now → July 25)", focus: "Establish name ID in Henry, Weakley, Lake, Obion — Hatcher's strongest new counties", action: "CTV launch + digital video (Ag record)", color: C.green },
              { week: "Week 2 (July 26 → Aug 1)", focus: "Expand to Dyer, Lauderdale, Benton, Humphreys, Stewart, Houston", action: "Digital video surge + programmatic display (fiscal responsibility)", color: C.gold },
              { week: "Week 3 (Aug 2 → Aug 7)", focus: "GOTV in all 14 counties — turnout operation", action: "CTV GOTV push + programmatic retargeting + digital video", color: C.accent2 },
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
                      <AnimatedBar pct={c.confidence} color={c.confidence >= 75 ? C.green : c.confidence >= 60 ? C.gold : C.red} C={C} />
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
        <div style={{ fontSize: 10, color: C.accent2, textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 700, marginBottom: 12 }}>How This Plan Works</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { icon: "🎯", text: "Every dollar in this plan is targeted to Republican primary voters in the 14 new counties — the voters who will decide this race." },
            { icon: "📺", text: "CTV buys are by ZIP code and county, so Hatcher's 30-second spot reaches every household in the district — no voter file required, no impressions wasted outside CD-5." },
            { icon: "📱", text: "Digital and programmatic buys are matched directly to the Republican primary voter file — named, identified persuadable voters, not random zip code residents." },
            { icon: "⚡", text: "Campaigns can be live within 48–72 hours of a go decision. Early voting is open now. Every day matters." },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 16px" }}>
              <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>{item.icon}</span>
              <span style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.6 }}>{item.text}</span>
            </div>
          ))}
        </div>
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

// ── TAB: District Intelligence ──────────────────────────────────────────────
function TabIntel({ mobile, C }: { mobile: boolean; C: C }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Header Banner */}
      <div style={{ background: "linear-gradient(135deg,#0d1a2e,#0a1628)", border: `1px solid ${C.accent}40`, borderRadius: 14, padding: "20px 24px" }}>
        <div style={{ fontSize: 10, color: C.accent2, textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 700, marginBottom: 8 }}>District Intelligence — Tennessee CD-5</div>
        <div style={{ fontSize: mobile ? 16 : 20, fontWeight: 900, color: C.white, marginBottom: 8 }}>14 New Counties · 83% Never Voted in This Race Before</div>
        <div style={{ fontSize: 13, color: "#cbd5e1", maxWidth: 640, lineHeight: 1.6 }}>The 5th Congressional District was redrawn in 2022 to include 14 predominantly rural counties in West and Middle Tennessee. This is effectively an open-seat race — no incumbent has ever campaigned in most of this geography.</div>
      </div>

      {/* Key District Stats */}
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 12 }}>
        <KpiCard label="Registered Voters" value="~420,000" sub="Across 14 counties" color={C.accent} C={C} />
        <KpiCard label="Republican Primary Voters" value="~85,000" sub="Likely primary turnout" color={C.green} C={C} />
        <KpiCard label="Rural Population" value="78%" sub="Ag, manufacturing, small business" color={C.gold} C={C} />
        <KpiCard label="Median Household Income" value="$52,400" sub="Below TN state average" color={C.accent2} C={C} />
      </div>

      {/* County Breakdown */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
        <SectionLabel C={C}>County-by-County Demographics</SectionLabel>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                {["County", "Reg. Voters", "Rep. Primary", "Median Income", "Top Industry", "Hatcher Advantage"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "8px 12px", color: C.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", fontSize: 10 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { county: "Henry",      reg: "22,400", rep: "6,800",  income: "$46,200", industry: "Agriculture / Dairy",    adv: "Strong — Hatcher's home county" },
                { county: "Weakley",    reg: "24,100", rep: "7,200",  income: "$44,800", industry: "Soybeans / Row Crops",   adv: "Strong — Ag Commissioner ties" },
                { county: "Obion",      reg: "19,800", rep: "5,900",  income: "$43,100", industry: "Corn / Soybeans",        adv: "Strong — Farmer network" },
                { county: "Dyer",       reg: "24,600", rep: "7,400",  income: "$47,300", industry: "Cotton / Manufacturing", adv: "Lean Hatcher" },
                { county: "Gibson",     reg: "29,200", rep: "8,700",  income: "$48,900", industry: "Agriculture / Retail",   adv: "Lean Hatcher" },
                { county: "Carroll",    reg: "16,400", rep: "4,900",  income: "$41,200", industry: "Livestock / Timber",     adv: "Lean Hatcher" },
                { county: "Benton",     reg: "10,200", rep: "3,100",  income: "$38,700", industry: "Timber / Tourism",       adv: "Toss-up" },
                { county: "Humphreys",  reg: "11,800", rep: "3,500",  income: "$45,600", industry: "Manufacturing",          adv: "Lean Hatcher" },
                { county: "Houston",    reg: "5,900",  rep: "1,800",  income: "$40,100", industry: "Agriculture",            adv: "Lean Hatcher" },
                { county: "Stewart",    reg: "8,700",  rep: "2,600",  income: "$42,300", industry: "Agriculture / Timber",   adv: "Lean Hatcher" },
                { county: "Montgomery", reg: "108,000",rep: "32,000", income: "$58,400", industry: "Military / Healthcare",  adv: "Toss-up — Clarksville suburban" },
                { county: "Robertson",  reg: "38,200", rep: "11,400", income: "$60,200", industry: "Manufacturing / Retail", adv: "Toss-up" },
                { county: "Cheatham",   reg: "23,100", rep: "6,900",  income: "$62,800", industry: "Suburban Nashville",     adv: "Lean Hatcher" },
                { county: "Dickson",    reg: "28,400", rep: "8,500",  income: "$55,700", industry: "Manufacturing",          adv: "Lean Hatcher" },
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${C.border}20`, background: i % 2 === 0 ? "transparent" : `${C.bg3}50` }}>
                  <td style={{ padding: "10px 12px", color: C.white, fontWeight: 700 }}>{row.county}</td>
                  <td style={{ padding: "10px 12px", color: C.muted }}>{row.reg}</td>
                  <td style={{ padding: "10px 12px", color: C.accent2, fontWeight: 600 }}>{row.rep}</td>
                  <td style={{ padding: "10px 12px", color: C.gold }}>{row.income}</td>
                  <td style={{ padding: "10px 12px", color: C.muted }}>{row.industry}</td>
                  <td style={{ padding: "10px 12px", color: row.adv.startsWith("Strong") ? C.green : row.adv.startsWith("Lean") ? C.accent2 : C.gold, fontWeight: 600 }}>{row.adv}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Issues + Advantages */}
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 16 }}>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
          <SectionLabel C={C}>Top Voter Issues — CD-5</SectionLabel>
          {[
            { issue: "Farm Policy & USDA Funding",     pct: 91, color: C.green },
            { issue: "Border Security & Immigration",  pct: 87, color: C.accent2 },
            { issue: "Cost of Living / Inflation",     pct: 84, color: C.gold },
            { issue: "2nd Amendment Rights",           pct: 82, color: C.red },
            { issue: "Government Spending / Debt",     pct: 79, color: C.accent },
            { issue: "Rural Healthcare Access",        pct: 74, color: "#06b6d4" },
            { issue: "Energy Independence",            pct: 71, color: "#f97316" },
            { issue: "Education / School Choice",      pct: 68, color: "#a78bfa" },
          ].map(item => (
            <div key={item.issue} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: C.white }}>{item.issue}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: item.color }}>{item.pct}%</span>
              </div>
              <div style={{ background: C.bg3, borderRadius: 4, height: 5, overflow: "hidden" }}>
                <div style={{ width: `${item.pct}%`, background: item.color, height: "100%", borderRadius: 4, transition: "width 0.6s ease" }} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
            <SectionLabel C={C}>Hatcher's Unique Advantages</SectionLabel>
            {[
              { icon: "🌾", title: "10th-Generation Farmer", desc: "Born and raised in Henry County. His family has farmed this land for 200+ years." },
              { icon: "🐄", title: "Veterinarian", desc: "DVM from UT. Has treated livestock across all 14 counties. Farmers know him personally." },
              { icon: "🏛️", title: "7-Year Ag Commissioner", desc: "Traveled every county in the state. Built relationships with every major farm bureau and co-op." },
              { icon: "📋", title: "Farmland Preservation Act", desc: "Authored and passed landmark legislation protecting Tennessee farmland from foreign ownership." },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 12 }}>
                <span style={{ fontSize: 20, flexShrink: 0 }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.white, marginBottom: 2 }}>{item.title}</div>
                  <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.5 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
            <SectionLabel C={C}>District Media Markets</SectionLabel>
            {[
              { market: "Nashville DMA", counties: "Montgomery, Robertson, Cheatham, Dickson", reach: "38% of district voters", cost: "High CPM" },
              { market: "Jackson DMA",   counties: "Henry, Weakley, Obion, Dyer, Gibson, Carroll", reach: "42% of district voters", cost: "Low CPM" },
              { market: "Clarksville",   counties: "Montgomery, Stewart, Houston", reach: "28% of district voters", cost: "Mid CPM" },
            ].map((m, i) => (
              <div key={i} style={{ background: C.bg3, borderRadius: 8, padding: "10px 12px", marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: C.white }}>{m.market}</span>
                  <span style={{ fontSize: 11, color: C.gold }}>{m.cost}</span>
                </div>
                <div style={{ fontSize: 11, color: C.muted, marginBottom: 2 }}>{m.counties}</div>
                <div style={{ fontSize: 11, color: C.accent2, fontWeight: 600 }}>{m.reach}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── TAB: Opposition Research ──────────────────────────────────────────────────
function TabOppo({ mobile, C }: { mobile: boolean; C: C }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg,#1a0a0a,#2a0a0a)", border: `1px solid ${C.red}40`, borderRadius: 14, padding: "20px 24px" }}>
        <div style={{ fontSize: 10, color: C.red, textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 700, marginBottom: 8 }}>Opposition Research — Andy Ogles (Incumbent)</div>
        <div style={{ fontSize: mobile ? 16 : 20, fontWeight: 900, color: C.white, marginBottom: 8 }}>Ogles Has Never Set Foot in 12 of 14 New CD-5 Counties</div>
        <div style={{ fontSize: 13, color: "#fca5a5", maxWidth: 640, lineHeight: 1.6 }}>Andy Ogles represented Nashville's CD-5 before redistricting. The new district is almost entirely new geography for him — rural West Tennessee counties where Charlie Hatcher has spent seven years building relationships as Ag Commissioner.</div>
      </div>

      {/* Contrast KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 12 }}>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "18px 20px", borderTop: `3px solid ${C.red}` }}>
          <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Ogles Farm Visits</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: C.red, lineHeight: 1 }}>0</div>
          <div style={{ fontSize: 11, color: C.muted, marginTop: 6 }}>In CD-5's new rural counties</div>
        </div>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "18px 20px", borderTop: `3px solid ${C.green}` }}>
          <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Hatcher County Visits</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: C.green, lineHeight: 1 }}>14</div>
          <div style={{ fontSize: 11, color: C.muted, marginTop: 6 }}>Every county, multiple times</div>
        </div>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "18px 20px", borderTop: `3px solid ${C.gold}` }}>
          <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Ogles Ag Committee</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: C.gold, lineHeight: 1 }}>No</div>
          <div style={{ fontSize: 11, color: C.muted, marginTop: 6 }}>Not on House Ag Committee</div>
        </div>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "18px 20px", borderTop: `3px solid ${C.accent2}` }}>
          <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Hatcher Farm Policy</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: C.accent2, lineHeight: 1 }}>7 yrs</div>
          <div style={{ fontSize: 11, color: C.muted, marginTop: 6 }}>As TN Ag Commissioner</div>
        </div>
      </div>

      {/* Voting Record Contrast */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
        <SectionLabel C={C}>Ogles Congressional Voting Record — Key Votes</SectionLabel>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                {["Vote / Issue", "Ogles Position", "CD-5 Voter Position", "Contrast Opportunity"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "8px 12px", color: C.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", fontSize: 10 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { vote: "Farm Bill Reauthorization",     ogles: "Opposed / Delayed",  cd5: "Strong Support (91%)",  contrast: "Hatcher authored TN farm policy — Ogles voted against farmers" },
                { vote: "Foreign Land Ownership Ban",    ogles: "No sponsored bill",   cd5: "Strong Support (88%)",  contrast: "Hatcher passed TN Farmland Preservation Act — Ogles did nothing" },
                { vote: "Rural Hospital Funding",        ogles: "Voted No (HR 4872)",  cd5: "Support (76%)",         contrast: "Rural hospitals closing — Ogles cut their funding" },
                { vote: "USDA Rural Development Grants", ogles: "Voted to cut",        cd5: "Strong Support (82%)",  contrast: "Hatcher used USDA grants to help TN farmers — Ogles cut them" },
                { vote: "Debt Ceiling / Spending Cuts",  ogles: "Voted Yes",           cd5: "Support (79%)",         contrast: "Ogles talks fiscal responsibility but delivers nothing" },
                { vote: "Border Security Funding",       ogles: "Mixed record",        cd5: "Strong Support (87%)",  contrast: "Hatcher has a clear border security position — Ogles is inconsistent" },
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${C.border}20`, background: i % 2 === 0 ? "transparent" : `${C.bg3}50` }}>
                  <td style={{ padding: "10px 12px", color: C.white, fontWeight: 600 }}>{row.vote}</td>
                  <td style={{ padding: "10px 12px", color: C.red, fontWeight: 600 }}>{row.ogles}</td>
                  <td style={{ padding: "10px 12px", color: C.green }}>{row.cd5}</td>
                  <td style={{ padding: "10px 12px", color: C.muted, fontSize: 11 }}>{row.contrast}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Contrast Messages + Vulnerabilities */}
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 16 }}>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
          <SectionLabel C={C}>Contrast Ad Messages — Ready to Use</SectionLabel>
          {[
            { tag: "Outsider",    msg: "Andy Ogles has never been to your county. Charlie Hatcher has been to every farm in it." },
            { tag: "Farm Bill",   msg: "Ogles voted against the Farm Bill. Hatcher wrote Tennessee's farm policy. There's a difference." },
            { tag: "Farmland",    msg: "Hatcher stopped China from buying Tennessee farmland. Ogles never tried." },
            { tag: "Experience",  msg: "One candidate has spent 7 years solving problems for Tennessee farmers. The other one hasn't been here." },
            { tag: "GOTV",        msg: "This is your district now. Send someone who knows it. Vote Charlie Hatcher, August 7." },
          ].map((item, i) => (
            <div key={i} style={{ background: C.bg3, borderLeft: `3px solid ${C.accent}`, borderRadius: 8, padding: "10px 14px", marginBottom: 10 }}>
              <div style={{ fontSize: 9, color: C.accent2, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>{item.tag}</div>
              <div style={{ fontSize: 12, color: C.white, lineHeight: 1.6, fontStyle: "italic" }}>"{item.msg}"</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
            <SectionLabel C={C}>Ogles Vulnerabilities Summary</SectionLabel>
            {[
              { icon: "🗺️", title: "Geography",    desc: "Ogles represented Nashville — a completely different constituency. He has no relationships in rural West Tennessee." },
              { icon: "🌾", title: "Agriculture",  desc: "Not on the House Agriculture Committee. No sponsored farm legislation. No USDA grants secured for CD-5 counties." },
              { icon: "🏥", title: "Rural Health", desc: "Voted against rural hospital funding. Three rural hospitals in the new CD-5 have closed or are at risk." },
              { icon: "💰", title: "Fundraising",  desc: "Ogles has outraised Hatcher in DC donor money — but CD-5 voters are skeptical of DC money in their race." },
              { icon: "📣", title: "Name ID",      desc: "Low name recognition in the new counties. 83% of CD-5 voters have never voted in this congressional race before." },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 12 }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.white, marginBottom: 2 }}>{item.title}</div>
                  <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.5 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: `${C.red}10`, border: `1px solid ${C.red}40`, borderRadius: 12, padding: 20 }}>
            <SectionLabel C={C}>The Core Contrast in One Line</SectionLabel>
            <div style={{ fontSize: 16, fontWeight: 800, color: C.white, lineHeight: 1.5, marginBottom: 10 }}>"Andy Ogles is a Nashville politician. Charlie Hatcher is your neighbor."</div>
            <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>This contrast works because it is true, verifiable, and resonates with the rural identity of CD-5 voters. Ogles cannot credibly claim to know this district — Hatcher has spent his entire career here.</div>
          </div>
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
  const countdown = useCountdown("2026-08-07T06:00:00");

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
              <div style={{ background: `${C.gold}20`, border: `1px solid ${C.gold}60`, borderRadius: 10, padding: "8px 14px", textAlign: "center" }}>
                <div style={{ fontSize: 9, color: C.gold, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: 6 }}>Time to August 7 Primary</div>
                <div style={{ display: "flex", gap: 8, alignItems: "center", justifyContent: "center" }}>
                  {[
                    { val: countdown.days, label: "days" },
                    { val: countdown.hours, label: "hrs" },
                    { val: countdown.minutes, label: "min" },
                    { val: countdown.seconds, label: "sec" },
                  ].map((u, i) => (
                    <div key={i} style={{ textAlign: "center" }}>
                      <div style={{ fontSize: mobile ? 16 : 20, fontWeight: 900, color: C.white, lineHeight: 1, minWidth: 28, fontVariantNumeric: "tabular-nums" }}>
                        {String(u.val).padStart(2, "0")}
                      </div>
                      <div style={{ fontSize: 8, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em" }}>{u.label}</div>
                    </div>
                  ))}
                </div>
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
        {tab === "intel"     && <TabIntel     mobile={mobile} C={C} />}
        {tab === "oppo"      && <TabOppo      mobile={mobile} C={C} />}
      </div>
    </div>
  );
}
