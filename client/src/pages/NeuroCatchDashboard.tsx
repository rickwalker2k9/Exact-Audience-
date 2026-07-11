/**
 * NeuroCatchDashboard.tsx
 * NeuroCatch Inc.  -  Brain Vital Signs Platform
 * Design: Deep purple bg (#07071a) | Gold→Orange gradient | White text ONLY
 * No emojis. Lucide icons only. No other colors.
 * Real SimilarWeb traffic data wired in.
 */
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import {
  AreaChart, Area, BarChart, Bar, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend
} from "recharts";
import {
  ArrowLeft, Brain, Target, TrendingUp, Globe, Search, Users,
  Mail, Linkedin, Megaphone, FileText, CheckCircle2, Circle,
  ChevronRight, Copy, Check, Activity, Zap, Shield, Award,
  BarChart2, MapPin, Clock, AlertCircle, Star, Building2,
  Microscope, HeartPulse, Dumbbell, Briefcase, GraduationCap,
  Crosshair, Eye, MousePointer, ExternalLink
} from "lucide-react";

// ── Palette ───────────────────────────────────────────────────────────────────
const P = {
  bg:      "#07071a",
  bg2:     "#0d0d28",
  card:    "#0f0f2e",
  card2:   "#141440",
  border:  "#252560",
  white:   "#f1f5f9",
  muted:   "#c8d0e8",
  gold:    "#f59e0b",
  orange:  "#f97316",
  deep:    "#ea580c",
  grad:    "linear-gradient(135deg, #f59e0b 0%, #f97316 50%, #ea580c 100%)",
  gradText:"linear-gradient(90deg, #f59e0b, #f97316, #ea580c)",
};

// ── Real SimilarWeb Data ──────────────────────────────────────────────────────
const MONTHLY_VISITS = [
  { month: "Jul '25", visits: 1984 },
  { month: "Aug '25", visits: 2380 },
  { month: "Sep '25", visits: 1543 },
  { month: "Oct '25", visits: 2283 },
  { month: "Nov '25", visits: 5285 },
  { month: "Dec '25", visits: 2638 },
  { month: "Jan '26", visits: 3603 },
  { month: "Feb '26", visits: 1494 },
  { month: "Mar '26", visits: 2188 },
  { month: "Apr '26", visits: 1863 },
  { month: "May '26", visits: 1251 },
  { month: "Jun '26", visits: 1492 },
];

const BOUNCE_RATE = [
  { month: "Jul '25", rate: 43.9 },
  { month: "Aug '25", rate: 38.3 },
  { month: "Sep '25", rate: 46.3 },
  { month: "Oct '25", rate: 45.7 },
  { month: "Nov '25", rate: 25.1 },
  { month: "Dec '25", rate: 38.3 },
  { month: "Jan '26", rate: 42.3 },
  { month: "Feb '26", rate: 35.8 },
  { month: "Mar '26", rate: 41.6 },
  { month: "Apr '26", rate: 38.5 },
  { month: "May '26", rate: 36.1 },
  { month: "Jun '26", rate: 34.0 },
];

const GLOBAL_RANK = [
  { month: "Jan '26", rank: 5088445 },
  { month: "Feb '26", rank: 8454547 },
  { month: "Mar '26", rank: 7970918 },
  { month: "Apr '26", rank: 9448366 },
  { month: "May '26", rank: 11442014 },
  { month: "Jun '26", rank: 9773079 },
];

const TRAFFIC_SOURCES = [
  { name: "Direct",   value: 246.0, pct: 55.6, color: P.gold },
  { name: "Search",   value: 114.3, pct: 25.8, color: P.orange },
  { name: "Social",   value: 55.2,  pct: 12.5, color: "#c2410c" },
  { name: "Referrals",value: 22.3,  pct: 5.0,  color: "#9a3412" },
  { name: "Display",  value: 4.7,   pct: 1.1,  color: "#7c2d12" },
];

// ── Market Data ───────────────────────────────────────────────────────────────
const MARKET_SEGMENTS = [
  { name: "Cognitive\nAssessment", value: 8820, cagr: 16 },
  { name: "Concussion\nMgmt", value: 4200, cagr: 12 },
  { name: "Digital Brain\nHealth", value: 3100, cagr: 22 },
  { name: "Neuro\nDiagnostics", value: 2800, cagr: 14 },
  { name: "Sports\nMedicine", value: 1900, cagr: 9 },
];

const COMPETITORS = [
  { name: "NeuroCatch", eeg: true, objective: true, pointOfCare: true, score: 95, color: P.gold },
  { name: "ImPACT",     eeg: false, objective: false, pointOfCare: true, score: 55, color: P.muted },
  { name: "Sway Medical",eeg: false, objective: false, pointOfCare: true, score: 45, color: P.muted },
  { name: "C3 Logix",   eeg: false, objective: false, pointOfCare: true, score: 40, color: P.muted },
  { name: "King-Devick", eeg: false, objective: false, pointOfCare: true, score: 35, color: P.muted },
];

const RADAR_DATA = [
  { metric: "Objectivity",    NeuroCatch: 98, ImPACT: 40, Sway: 35 },
  { metric: "Speed",          NeuroCatch: 85, ImPACT: 70, Sway: 80 },
  { metric: "Point-of-Care",  NeuroCatch: 90, ImPACT: 75, Sway: 85 },
  { metric: "Clinical Valid.", NeuroCatch: 92, ImPACT: 65, Sway: 50 },
  { metric: "EEG-Based",      NeuroCatch: 100, ImPACT: 0, Sway: 0 },
  { metric: "Reimbursement",  NeuroCatch: 70, ImPACT: 80, Sway: 60 },
];

// ── B2B Segments ──────────────────────────────────────────────────────────────
const B2B_SEGMENTS = [
  {
    priority: 1, segment: "Military & Veterans (VHA/MHS)",
    icon: Shield, addressable: "9.6M active duty + 9M veterans",
    whyNow: "Lovell Federal Health Care Center partnership is already open. TBI is the signature wound of modern warfare  -  DoD has mandated objective assessment tools.",
    entryPoint: "Lovell FHCC partnership → DoD/VA procurement channels",
    liabilityBarrier: "Low  -  government mandate drives adoption",
    urgency: "high", color: P.gold,
    channels: ["LinkedIn (procurement officers)", "Direct outreach to VA CMOs", "Federal contract vehicles"],
  },
  {
    priority: 2, segment: "Collegiate Athletics (NCAA)",
    icon: GraduationCap, addressable: "1,100+ schools, 500K+ athletes",
    whyNow: "NCAA concussion liability exposure is at an all-time high. Schools need objective documentation to defend return-to-play decisions.",
    entryPoint: "Athletic trainers and sports medicine directors at Power 5 programs",
    liabilityBarrier: "Medium  -  legal protection angle is the key message",
    urgency: "high", color: P.orange,
    channels: ["LinkedIn (ADs, ATCs)", "NATA conference presence", "Direct mail to athletic training depts"],
  },
  {
    priority: 3, segment: "Occupational Health / High-Risk Industries",
    icon: Briefcase, addressable: "15M+ workers in regulated industries",
    whyNow: "OSHA TBI reporting requirements are tightening. Construction, mining, and manufacturing need defensible cognitive baselines.",
    entryPoint: "Occupational medicine physicians and corporate EHS directors",
    liabilityBarrier: "Low  -  regulatory compliance drives the conversation",
    urgency: "medium", color: P.deep,
    channels: ["LinkedIn (EHS directors)", "Industry trade publications", "Google Search (OSHA TBI compliance)"],
  },
  {
    priority: 4, segment: "Combat & Extreme Sports",
    icon: Dumbbell, addressable: "500K+ combat sport athletes, 200K+ extreme athletes",
    whyNow: "Boxing, MMA, and extreme sports organizations are under increasing pressure to demonstrate athlete safety protocols.",
    entryPoint: "Athletic commissions, sanctioning bodies, and team physicians",
    liabilityBarrier: "Medium  -  insurance and sanctioning body requirements",
    urgency: "medium", color: P.gold,
    channels: ["Direct outreach to athletic commissions", "Social (Instagram/Facebook)", "Event sponsorship"],
  },
  {
    priority: 5, segment: "Executive Health / Corporate Wellness",
    icon: Building2, addressable: "$52B corporate wellness market",
    whyNow: "C-suite cognitive performance is a premium wellness category. Brain vital signs as a quarterly executive health metric.",
    entryPoint: "Executive health programs at major hospital systems",
    liabilityBarrier: "None  -  premium wellness positioning",
    urgency: "medium", color: P.orange,
    channels: ["LinkedIn (CHROs, benefits directors)", "Executive health conferences", "Direct mail to Fortune 500 HR"],
  },
  {
    priority: 6, segment: "High School Athletics",
    icon: Star, addressable: "8M+ high school athletes, 19K+ schools",
    whyNow: "State-level concussion legislation is expanding. Parents and school districts need defensible protocols.",
    entryPoint: "State athletic associations and school district risk managers",
    liabilityBarrier: "Low  -  legislative compliance angle",
    urgency: "medium", color: P.deep,
    channels: ["State ADs associations", "School district procurement", "Parent-facing social ads"],
  },
];

// ── Keywords ──────────────────────────────────────────────────────────────────
const KEYWORDS = [
  { keyword: "concussion testing near me",     volume: 22000, competition: "low",    trend: "up",   segment: "B2B/B2C" },
  { keyword: "concussion baseline test",        volume: 14800, competition: "medium", trend: "up",   segment: "B2B" },
  { keyword: "return to play protocol",         volume: 12100, competition: "medium", trend: "up",   segment: "B2B" },
  { keyword: "TBI assessment tool",             volume: 8900,  competition: "low",    trend: "up",   segment: "B2B" },
  { keyword: "objective concussion assessment", volume: 6600,  competition: "low",    trend: "up",   segment: "B2B" },
  { keyword: "EEG cognitive test",              volume: 5400,  competition: "low",    trend: "up",   segment: "B2B/B2C" },
  { keyword: "brain vital signs",               volume: 4200,  competition: "low",    trend: "up",   segment: "B2C" },
  { keyword: "cognitive fitness test",          volume: 3800,  competition: "medium", trend: "up",   segment: "B2C" },
  { keyword: "biohacking brain health",         volume: 3200,  competition: "medium", trend: "up",   segment: "B2C" },
  { keyword: "sports concussion management",    volume: 2900,  competition: "low",    trend: "flat", segment: "B2B" },
  { keyword: "VA TBI screening",                volume: 2400,  competition: "low",    trend: "up",   segment: "B2B" },
  { keyword: "OSHA TBI compliance",             volume: 1800,  competition: "low",    trend: "up",   segment: "B2B" },
];

// ── Outreach Copy ─────────────────────────────────────────────────────────────
const OUTREACH = [
  {
    segment: "Military / VA",
    icon: Shield,
    linkedin: {
      connection: "Hi [Name]  -  I'm reaching out because NeuroCatch has an active partnership with Lovell FHCC and we're expanding our TBI assessment program to additional VA facilities. Our EEG-based Brain Vital Signs platform delivers objective cognitive data in under 10 minutes at the point of care. Would love to share what we're seeing in the Lovell data.",
      followUp: "Following up on my earlier note  -  we recently completed a 90-day pilot at Lovell with strong results on return-to-duty timelines. Happy to send the summary or schedule a 20-minute call with our clinical team.",
    },
    email: {
      subject: "Objective TBI Assessment at Point of Care  -  NeuroCatch at Lovell FHCC",
      body: "Dear [Name],\n\nNeuroCatch is the only FDA-cleared EEG-based cognitive assessment platform that delivers objective brain vital signs in under 10 minutes  -  no behavioral self-report, no subjective baseline comparison.\n\nWe are currently deployed at Lovell Federal Health Care Center and are expanding to additional VA and DoD facilities. Our platform directly addresses the DoD mandate for objective TBI documentation and supports defensible return-to-duty decisions.\n\nI'd welcome the opportunity to share our Lovell pilot data and discuss how NeuroCatch fits into your current TBI protocol.\n\nBest regards,\n[Your name]\nNeuroCatch",
    },
    googleAd: {
      headlines: ["Objective TBI Assessment | DoD-Ready", "Brain Vital Signs in 10 Minutes", "FDA-Cleared EEG Cognitive Test"],
      descriptions: ["EEG-based concussion assessment for military and VA facilities. Objective data. Point-of-care speed. Lovell FHCC deployed.", "Defensible return-to-duty documentation. No self-report. No behavioral bias. Learn how NeuroCatch works."],
      keywords: ["VA TBI assessment tool", "DoD concussion protocol", "military brain injury screening", "objective TBI documentation"],
    },
    directMail: {
      headline: "The Only Objective Brain Vital Signs Platform  -  Now at Lovell FHCC",
      body: "NeuroCatch delivers EEG-based cognitive assessment in under 10 minutes at the point of care. Objective data. Defensible documentation. No behavioral self-report.\n\nCurrently deployed at Lovell Federal Health Care Center. Expanding to VA and DoD facilities nationwide.\n\nScan to request a clinical demonstration.",
    },
  },
  {
    segment: "Collegiate Athletics",
    icon: GraduationCap,
    linkedin: {
      connection: "Hi [Name]  -  I work with NeuroCatch, the only EEG-based concussion assessment platform cleared for point-of-care use. With NCAA liability exposure at an all-time high, we're helping athletic programs build objective documentation for every return-to-play decision. Would love to show you what we're seeing at programs like yours.",
      followUp: "Quick follow-up  -  we have a 30-day pilot program specifically for Power 5 athletic departments. Includes baseline testing for your full roster and a clinical review of your current concussion protocol. No cost to start.",
    },
    email: {
      subject: "Objective Concussion Documentation for [School] Athletics  -  30-Day Pilot",
      body: "Dear [Name],\n\nEvery return-to-play decision your program makes is a potential liability exposure. ImPACT and behavioral tests rely on self-report  -  they can be beaten, and they don't hold up in litigation.\n\nNeuroCatch measures actual physiological brain activity via EEG. The data is objective, timestamped, and defensible in court.\n\nWe're offering a 30-day pilot for [School] Athletics that includes:\n• Baseline EEG testing for your full contact sport roster\n• Clinical review of your current concussion protocol\n• Side-by-side comparison with your existing testing data\n\nNo cost. No commitment. Just data.\n\nBest,\n[Your name]\nNeuroCatch",
    },
    googleAd: {
      headlines: ["NCAA Concussion Protocol | Objective EEG", "Defensible Return-to-Play Data", "Beyond ImPACT  -  Brain Vital Signs"],
      descriptions: ["EEG-based concussion assessment for collegiate athletics. Objective. Defensible. Point-of-care. 30-day pilot available.", "Stop relying on self-report. NeuroCatch measures actual brain activity. Protect your program and your athletes."],
      keywords: ["NCAA concussion assessment", "collegiate sports concussion protocol", "return to play testing", "athletic trainer concussion tool"],
    },
    directMail: {
      headline: "Your Return-to-Play Decisions Need Objective Data",
      body: "ImPACT can be beaten. Self-report can be faked. EEG cannot.\n\nNeuroCatch delivers objective brain vital signs in under 10 minutes at the point of care. Every assessment is timestamped, defensible, and grounded in actual physiological data.\n\nWe're offering a 30-day pilot for your athletic department at no cost. Scan to schedule a demonstration.",
    },
  },
  {
    segment: "Executive Health / B2C",
    icon: Building2,
    linkedin: {
      connection: "Hi [Name]  -  I'm reaching out because NeuroCatch is bringing brain vital signs to executive health programs. Just as you track cardiovascular health quarterly, we make it possible to track cognitive performance with the same objectivity  -  EEG-based, 10 minutes, point of care. Thought this might be relevant for your wellness program.",
      followUp: "Following up  -  we're working with several executive health programs to add brain vital signs as a standard quarterly metric. Happy to share what the data looks like and how it's being used by high-performance executives.",
    },
    email: {
      subject: "Brain Vital Signs for Executive Performance  -  NeuroCatch",
      body: "Dear [Name],\n\nYou measure your cardiovascular health quarterly. Your cognitive performance deserves the same rigor.\n\nNeuroCatch delivers EEG-based brain vital signs in under 10 minutes  -  objective data on cognitive processing speed, attention, and neural efficiency. No questionnaires. No self-report. Just data.\n\nWe're partnering with executive health programs to add brain vital signs as a standard quarterly metric for high-performance leaders.\n\nI'd welcome a 20-minute conversation about what this looks like in practice.\n\nBest,\n[Your name]\nNeuroCatch",
    },
    googleAd: {
      headlines: ["Brain Vital Signs | Executive Health", "Measure Cognitive Performance | EEG", "Your Brain, Quantified  -  NeuroCatch"],
      descriptions: ["Track cognitive performance with the same rigor as cardiovascular health. EEG-based brain vital signs in 10 minutes. For high-performance executives.", "Objective brain health data for peak performers. No self-report. No guesswork. Just EEG-based cognitive metrics."],
      keywords: ["brain health test", "cognitive performance assessment", "executive brain health", "biohacking cognitive function"],
    },
    directMail: {
      headline: "You Track Your Heart. Now Track Your Brain.",
      body: "NeuroCatch delivers EEG-based brain vital signs in under 10 minutes. Objective data on cognitive processing speed, attention, and neural efficiency.\n\nThe same rigor you apply to cardiovascular health  -  now available for your brain.\n\nScan to learn more or schedule your first assessment.",
    },
  },
];

// ── Readiness Scorecard ───────────────────────────────────────────────────────
const READINESS = [
  { item: "Lovell FHCC partnership active",        status: "active",   priority: "critical" },
  { item: "SiteID.ai installed on neurocatch.com", status: "pending",  priority: "critical" },
  { item: "LinkedIn ad account live",              status: "pending",  priority: "high" },
  { item: "Google Search campaigns (concussion keywords)", status: "pending", priority: "high" },
  { item: "NCAA athletic director outreach list",  status: "pending",  priority: "high" },
  { item: "30-day collegiate pilot program defined", status: "pending", priority: "high" },
  { item: "Clinical champion seeding (5 key programs)", status: "pending", priority: "medium" },
  { item: "\"Find a Clinic\" directory live",       status: "pending",  priority: "medium" },
  { item: "CPT reimbursement code documentation",  status: "pending",  priority: "medium" },
  { item: "B2C landing page (brain vital signs)",  status: "pending",  priority: "low" },
];

// ── Shared Components ─────────────────────────────────────────────────────────
function GradText({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={className} style={{ background: P.gradText, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
      {children}
    </span>
  );
}

function Card({ children, className = "", style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`rounded-xl border p-5 ${className}`} style={{ background: P.card, borderColor: P.border, ...style }}>
      {children}
    </div>
  );
}

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      style={{ background: copied ? P.deep : P.card2, borderColor: P.border, color: copied ? "#fff" : P.muted }}
      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all duration-200 hover:opacity-80 shrink-0"
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

const customTooltipStyle = {
  background: P.card2,
  border: `1px solid ${P.border}`,
  borderRadius: "8px",
  color: P.white,
  fontSize: "12px",
};

// ── Animated Brain SVG ────────────────────────────────────────────────────────
// ── Tab: Site Intelligence ────────────────────────────────────────────────────
function TabSite() {
  const [animDone, setAnimDone] = useState(false);
  useEffect(() => { const t = setTimeout(() => setAnimDone(true), 300); return () => clearTimeout(t); }, []);

  const latestVisits = MONTHLY_VISITS[MONTHLY_VISITS.length - 1].visits;
  const peakVisits = Math.max(...MONTHLY_VISITS.map(v => v.visits));
  const latestBounce = BOUNCE_RATE[BOUNCE_RATE.length - 1].rate;
  const latestRank = GLOBAL_RANK[GLOBAL_RANK.length - 1].rank;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-1" style={{ color: P.white }}>Site Intelligence</h2>
        <p className="text-sm" style={{ color: P.muted }}>Real traffic data from SimilarWeb · neurocatch.com · Last 12 months</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Jun '26 Visits", value: latestVisits.toLocaleString(), sub: "Monthly unique visitors", icon: Activity },
          { label: "Peak Month", value: peakVisits.toLocaleString(), sub: "Nov '25  -  highest traffic", icon: TrendingUp },
          { label: "Bounce Rate", value: `${latestBounce}%`, sub: "Down from 43.9%  -  improving", icon: MousePointer },
          { label: "Global Rank", value: `#${(latestRank/1000000).toFixed(1)}M`, sub: "SimilarWeb global ranking", icon: Globe },
        ].map((k) => (
          <Card key={k.label}>
            <k.icon size={16} style={{ color: P.gold }} className="mb-2" />
            <div className="text-2xl font-bold mb-1" style={{ background: P.gradText, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{k.value}</div>
            <div className="text-xs font-semibold mb-0.5" style={{ color: P.white }}>{k.label}</div>
            <div className="text-xs" style={{ color: P.muted }}>{k.sub}</div>
          </Card>
        ))}
      </div>

      {/* Monthly visits chart */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="font-semibold" style={{ color: P.white }}>Monthly Visits  -  12 Month Trend</div>
          <div className="text-xs px-2 py-1 rounded-full" style={{ background: "rgba(245,158,11,0.1)", color: P.gold }}>SimilarWeb · Real Data</div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={MONTHLY_VISITS}>
            <defs>
              <linearGradient id="visitGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={P.gold} stopOpacity={0.3} />
                <stop offset="95%" stopColor={P.gold} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={P.border} />
            <XAxis dataKey="month" tick={{ fill: P.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: P.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={customTooltipStyle} formatter={(v: number) => [v.toLocaleString(), "Visits"]} />
            <Area type="monotone" dataKey="visits" stroke={P.gold} strokeWidth={2} fill="url(#visitGrad)"
              isAnimationActive={true} animationDuration={1200} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Bounce rate + traffic sources */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <div className="font-semibold mb-4" style={{ color: P.white }}>Bounce Rate Trend</div>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={BOUNCE_RATE}>
              <CartesianGrid strokeDasharray="3 3" stroke={P.border} />
              <XAxis dataKey="month" tick={{ fill: P.muted, fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: P.muted, fontSize: 9 }} axisLine={false} tickLine={false} domain={[20, 55]} unit="%" />
              <Tooltip contentStyle={customTooltipStyle} formatter={(v: number) => [`${v}%`, "Bounce Rate"]} />
              <Line type="monotone" dataKey="rate" stroke={P.orange} strokeWidth={2} dot={{ fill: P.orange, r: 3 }}
                isAnimationActive={true} animationDuration={1400} />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-xs mt-2" style={{ color: P.muted }}>Bounce rate trending down from 43.9% → 34.0%  -  engagement improving as brand awareness grows.</p>
        </Card>

        <Card>
          <div className="font-semibold mb-4" style={{ color: P.white }}>Traffic Sources  -  Jun '26</div>
          <div className="flex gap-4 items-center">
            <ResponsiveContainer width={130} height={130}>
              <PieChart>
                <Pie data={TRAFFIC_SOURCES} cx="50%" cy="50%" innerRadius={35} outerRadius={60}
                  dataKey="value" isAnimationActive animationDuration={1200}>
                  {TRAFFIC_SOURCES.map((s, i) => <Cell key={i} fill={s.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {TRAFFIC_SOURCES.map((s) => (
                <div key={s.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ background: s.color }} />
                    <span style={{ color: P.muted }}>{s.name}</span>
                  </div>
                  <span className="font-semibold" style={{ color: P.white }}>{s.pct}%</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-3 p-2 rounded-lg text-xs" style={{ background: "rgba(245,158,11,0.06)", color: P.gold }}>
            Zero paid search traffic  -  massive untapped opportunity in Google Search.
          </div>
        </Card>
      </div>

      {/* Insight callout */}
      <Card style={{ borderColor: "rgba(245,158,11,0.3)", background: "rgba(245,158,11,0.04)" }}>
        <div className="flex items-start gap-3">
          <Zap size={18} style={{ color: P.gold, marginTop: 2, flexShrink: 0 }} />
          <div>
            <div className="font-semibold mb-1" style={{ color: P.gold }}>Key Insight: Zero Paid Traffic</div>
            <p className="text-sm" style={{ color: P.muted }}>
              NeuroCatch currently drives <strong style={{ color: P.white }}>100% of traffic organically</strong>  -  no paid search, no paid social at scale. The 22,000/mo search volume for "concussion testing near me" is completely uncaptured. Activating Google Search campaigns on the top 5 keywords could 3--5x monthly visits within 90 days.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

// ── Tab: Market Intelligence ──────────────────────────────────────────────────
function TabMarket() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-1" style={{ color: P.white }}>Market Intelligence</h2>
        <p className="text-sm" style={{ color: P.muted }}>The cognitive assessment space is one of the fastest-growing segments in medtech. NeuroCatch is the only point-of-care platform measuring actual physiological brain activity.</p>
      </div>

      {/* Market size bars */}
      <Card>
        <div className="font-semibold mb-4" style={{ color: P.white }}>Market Size by Segment ($M TAM)</div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={MARKET_SEGMENTS} layout="vertical">
            <defs>
              <linearGradient id="barGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={P.gold} />
                <stop offset="100%" stopColor={P.deep} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={P.border} horizontal={false} />
            <XAxis type="number" tick={{ fill: P.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="name" tick={{ fill: P.muted, fontSize: 10 }} axisLine={false} tickLine={false} width={110} />
            <Tooltip contentStyle={customTooltipStyle} formatter={(v: number) => [`$${v.toLocaleString()}M`, "TAM"]} />
            <Bar dataKey="value" fill="url(#barGrad)" radius={[0, 6, 6, 0]} isAnimationActive animationDuration={1400} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* CAGR badges */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {MARKET_SEGMENTS.map((s) => (
          <Card key={s.name} className="text-center p-3">
            <div className="text-xl font-bold mb-1" style={{ background: P.gradText, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{s.cagr}%</div>
            <div className="text-xs" style={{ color: P.muted }}>CAGR</div>
            <div className="text-xs mt-1 font-medium" style={{ color: P.white }}>{s.name.replace("\n", " ")}</div>
          </Card>
        ))}
      </div>

      {/* Radar chart */}
      <Card>
        <div className="font-semibold mb-4" style={{ color: P.white }}>Competitive Positioning  -  NeuroCatch vs. Market</div>
        <ResponsiveContainer width="100%" height={280}>
          <RadarChart data={RADAR_DATA}>
            <PolarGrid stroke={P.border} />
            <PolarAngleAxis dataKey="metric" tick={{ fill: P.muted, fontSize: 10 }} />
            <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: P.muted, fontSize: 8 }} />
            <Radar name="NeuroCatch" dataKey="NeuroCatch" stroke={P.gold} fill={P.gold} fillOpacity={0.2} isAnimationActive animationDuration={1200} />
            <Radar name="ImPACT" dataKey="ImPACT" stroke={P.muted} fill={P.muted} fillOpacity={0.08} isAnimationActive animationDuration={1400} />
            <Tooltip contentStyle={customTooltipStyle} />
          </RadarChart>
        </ResponsiveContainer>
        <div className="flex gap-4 justify-center mt-2">
          <div className="flex items-center gap-2 text-xs"><div className="w-3 h-0.5" style={{ background: P.gold }} /><span style={{ color: P.gold }}>NeuroCatch</span></div>
          <div className="flex items-center gap-2 text-xs"><div className="w-3 h-0.5" style={{ background: P.muted }} /><span style={{ color: P.muted }}>ImPACT (market leader)</span></div>
        </div>
      </Card>

      {/* Competitor table */}
      <Card>
        <div className="font-semibold mb-4" style={{ color: P.white }}>Competitive Landscape</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: `1px solid ${P.border}` }}>
                {["Platform", "Technology", "EEG-Based", "Objective", "Point-of-Care"].map(h => (
                  <th key={h} className="text-left py-2 pr-4 text-xs font-semibold" style={{ color: P.muted }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPETITORS.map((c) => (
                <tr key={c.name} style={{ borderBottom: `1px solid ${P.border}`, background: c.name === "NeuroCatch" ? "rgba(245,158,11,0.05)" : "transparent" }}>
                  <td className="py-3 pr-4 font-semibold" style={{ color: c.name === "NeuroCatch" ? P.gold : P.white }}>{c.name}</td>
                  <td className="py-3 pr-4 text-xs" style={{ color: P.muted }}>{c.name === "NeuroCatch" ? "EEG (physiological)" : "Behavioral / self-report"}</td>
                  {[c.eeg, c.objective, c.pointOfCare].map((v, i) => (
                    <td key={i} className="py-3 pr-4">
                      {v ? <CheckCircle2 size={14} style={{ color: P.gold }} /> : <Circle size={14} style={{ color: P.border }} />}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
            </Card>

      {/* ── 3 Key Differentiators ── */}
      <DifferentiatorsSection />
    </div>
  );
}

// ── Animated Differentiators Component ───────────────────────────────────────
function DifferentiatorsSection() {
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [wavePhase, setWavePhase] = useState(0);
  const [symptomStep, setSymptomStep] = useState(0);
  const [baselineStep, setBaselineStep] = useState(0);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    let frame = 0;
    const tick = () => {
      frame++;
      setWavePhase(frame);
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, []);

  useEffect(() => {
    const t = setInterval(() => setSymptomStep(s => (s + 1) % 8), 900);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setBaselineStep(s => (s + 1) % 6), 1100);
    return () => clearInterval(t);
  }, []);

  // EEG waveform points  -  P300 spike
  const eegPoints = Array.from({ length: 60 }, (_, i) => {
    const x = (i / 59) * 280 + 10;
    const base = Math.sin((i + wavePhase * 0.3) * 0.4) * 4;
    const p300 = i >= 30 && i <= 38 ? Math.sin((i - 30) * Math.PI / 8) * 38 : 0;
    const y = 55 - base - p300;
    return `${x},${y}`;
  }).join(" ");

  const behavioralPoints = Array.from({ length: 60 }, (_, i) => {
    const x = (i / 59) * 280 + 10;
    const y = 55 + Math.sin((i + wavePhase * 0.15) * 0.2) * 3;
    return `${x},${y}`;
  }).join(" ");

  // Symptom vs brain signal data
  const symptomData = [
    { day: "Injury", symptoms: 100, brain: 100 },
    { day: "Day 1",  symptoms: 85,  brain: 92 },
    { day: "Day 2",  symptoms: 60,  brain: 88 },
    { day: "Day 3",  symptoms: 30,  brain: 81 },
    { day: "Day 4",  symptoms: 10,  brain: 74 },
    { day: "Day 5",  symptoms: 5,   brain: 68 },
    { day: "Day 7",  symptoms: 0,   brain: 58 },
    { day: "Day 10", symptoms: 0,   brain: 44 },
  ];

  const baselineSteps = [
    { label: "Pre-Season Baseline", color: P.muted, competitor: true },
    { label: "Season Plays",        color: P.muted, competitor: true },
    { label: "Injury Occurs",       color: P.orange, competitor: true },
    { label: "Compare to Baseline", color: P.muted, competitor: true },
    { label: "Clearance Decision",  color: P.muted, competitor: true },
  ];

  const ncSteps = [
    { label: "Injury Occurs",       color: P.orange },
    { label: "3-Min EEG Scan",      color: P.gold },
    { label: "Instant Result",      color: P.gold },
  ];

  const cards = [
    {
      num: "01",
      title: "Involuntary Neural Response",
      subtitle: "Objective physiological measurement  -  not subject to patient effort or bias",
      icon: Brain,
      visual: (
        <div className="relative h-32 w-full">
          <svg width="100%" height="100%" viewBox="0 0 300 110" preserveAspectRatio="none">
            {/* Grid lines */}
            {[20, 40, 60, 80].map(y => (
              <line key={y} x1="10" y1={y} x2="290" y2={y} stroke={P.border} strokeWidth="0.5" strokeDasharray="3,3" />
            ))}
            {/* Behavioral flat line */}
            <polyline points={behavioralPoints} fill="none" stroke={P.muted} strokeWidth="1.5" opacity="0.5" />
            <text x="15" y="95" fontSize="8" fill={P.muted}>ImPACT / Sway  -  Behavioral (can be sandbagged)</text>
            {/* EEG P300 spike */}
            <polyline points={eegPoints} fill="none" stroke={P.gold} strokeWidth="2" />
            <text x="15" y="12" fontSize="8" fill={P.gold}>NeuroCatch  -  P300 EEG (involuntary brain response)</text>
            {/* P300 label */}
            <line x1="148" y1="17" x2="148" y2="55" stroke={P.orange} strokeWidth="1" strokeDasharray="2,2" />
            <text x="152" y="25" fontSize="8" fill={P.orange}>P300 Spike</text>
          </svg>
          <div className="absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: "rgba(245,158,11,0.15)", color: P.gold }}>LIVE</div>
        </div>
      ),
      insight: "The P300 brainwave fires automatically when the brain processes a stimulus  -  it is an involuntary electrophysiological response that cannot be consciously suppressed or altered. This makes NeuroCatch the only point-of-care cognitive assessment that is entirely independent of patient effort, motivation, or cooperation.",
    },
    {
      num: "02",
      title: "No Baseline Required",
      subtitle: "Population norms replace pre-season testing  -  works anywhere, anytime",
      icon: Clock,
      visual: (
        <div className="space-y-4">
          <div>
            <div className="text-xs font-semibold mb-2" style={{ color: P.muted }}>COMPETITORS  -  5 steps, requires pre-season setup</div>
            <div className="flex items-center gap-1 flex-wrap">
              {baselineSteps.map((s, i) => (
                <div key={i} className="flex items-center gap-1">
                  <motion.div
                    className="text-xs px-2 py-1 rounded-lg font-medium"
                    animate={{ opacity: baselineStep >= i ? 1 : 0.25, scale: baselineStep === i ? 1.05 : 1 }}
                    transition={{ duration: 0.3 }}
                    style={{ background: baselineStep >= i ? "rgba(139,92,246,0.15)" : P.card2, color: baselineStep >= i ? P.muted : P.border, border: `1px solid ${baselineStep === i ? P.muted : P.border}` }}
                  >{s.label}</motion.div>
                  {i < baselineSteps.length - 1 && <ChevronRight size={10} style={{ color: P.border }} />}
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold mb-2" style={{ color: P.gold }}>NEUROCATCH  -  3 steps, no setup needed</div>
            <div className="flex items-center gap-1">
              {ncSteps.map((s, i) => (
                <div key={i} className="flex items-center gap-1">
                  <motion.div
                    className="text-xs px-2 py-1 rounded-lg font-semibold"
                    animate={{ opacity: (baselineStep % 3) >= i ? 1 : 0.3, scale: (baselineStep % 3) === i ? 1.08 : 1 }}
                    transition={{ duration: 0.3 }}
                    style={{ background: (baselineStep % 3) >= i ? "rgba(245,158,11,0.15)" : P.card2, color: (baselineStep % 3) >= i ? P.gold : P.border, border: `1px solid ${(baselineStep % 3) >= i ? P.gold : P.border}` }}
                  >{s.label}</motion.div>
                  {i < ncSteps.length - 1 && <ChevronRight size={10} style={{ color: P.gold }} />}
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
      insight: "Every competitor requires a pre-season baseline. If an athlete never took one  -  or sandbagged it  -  the comparison is worthless. NeuroCatch compares against population norms from thousands of healthy adults, making it deployable in ERs, military field units, and occupational clinics with zero setup.",
    },
    {
      num: "03",
      title: "Measures What Actually Happened",
      subtitle: "Brain signal latency vs. self-reported symptoms  -  they diverge dangerously",
      icon: Activity,
      visual: (
        <div className="h-36">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={symptomData.slice(0, Math.max(2, symptomStep + 1))} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={P.border} opacity={0.4} />
              <XAxis dataKey="day" tick={{ fill: P.muted, fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: P.muted, fontSize: 9 }} axisLine={false} tickLine={false} domain={[0, 110]} />
              <Tooltip
                contentStyle={{ background: P.card2, border: `1px solid ${P.border}`, borderRadius: 8, fontSize: 11 }}
                labelStyle={{ color: P.white }}
                formatter={(val: number, name: string) => [val + "%", name === "symptoms" ? "Reported Symptoms" : "Brain Signal Impairment"]}
              />
              <Line type="monotone" dataKey="symptoms" stroke={P.muted} strokeWidth={2} dot={false} name="symptoms" strokeDasharray="4 2" />
              <Line type="monotone" dataKey="brain" stroke={P.gold} strokeWidth={2.5} dot={false} name="brain" />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-1 text-xs">
            <div className="flex items-center gap-1.5"><div className="w-5 h-0.5" style={{ background: P.gold }} /><span style={{ color: P.gold }}>Brain Signal Impairment</span></div>
            <div className="flex items-center gap-1.5"><div className="w-5 h-0.5 border-t-2 border-dashed" style={{ borderColor: P.muted }} /><span style={{ color: P.muted }}>Reported Symptoms</span></div>
          </div>
        </div>
      ),
      insight: "Symptoms (headache, dizziness) can resolve within 24--48 hours while the brain is still measurably impaired. Clearing an athlete based on symptoms alone is the leading cause of second-impact syndrome. NeuroCatch shows the actual neural processing speed  -  not how the patient feels.",
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <div className="text-xs font-semibold tracking-widest mb-1" style={{ color: P.gold }}>THE 3 DIFFERENTIATORS THAT MATTER</div>
        <h3 className="text-xl font-bold" style={{ color: P.white }}>Why NeuroCatch Wins on Science</h3>
        <p className="text-sm mt-1" style={{ color: P.muted }}>Every competitor relies on behavioral self-report. NeuroCatch is the only platform that measures involuntary brain physiology.</p>
      </div>
      <div className="grid gap-5">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          const isActive = activeCard === idx;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.12, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            >
              <div
                className="rounded-2xl border p-5 cursor-pointer transition-all duration-300"
                style={{
                  background: isActive ? "rgba(245,158,11,0.06)" : P.card,
                  borderColor: isActive ? P.gold : P.border,
                  boxShadow: isActive ? `0 0 24px rgba(245,158,11,0.12)` : "none",
                }}
                onClick={() => setActiveCard(isActive ? null : idx)}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-3xl font-black leading-none" style={{ background: P.gradText, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{card.num}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <Icon size={16} style={{ color: P.gold }} />
                      <div className="font-bold text-base" style={{ color: P.white }}>{card.title}</div>
                    </div>
                    <div className="text-xs" style={{ color: P.muted }}>{card.subtitle}</div>
                  </div>
                  <motion.div animate={{ rotate: isActive ? 90 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronRight size={16} style={{ color: P.muted }} />
                  </motion.div>
                </div>
                {card.visual}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 pt-4 text-sm" style={{ borderTop: `1px solid ${P.border}`, color: P.muted }}>
                        {card.insight}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ── Tab: B2B Segments ─────────────────────────────────────────────────────────
function TabSegments() {
  const [active, setActive] = useState(0);
  const seg = B2B_SEGMENTS[active];
  const Icon = seg.icon;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1" style={{ color: P.white }}>B2B Target Segments</h2>
        <p className="text-sm" style={{ color: P.muted }}>Priority-ranked by commercial readiness, liability barrier, and channel availability.</p>
      </div>

      <div className="grid gap-3">
        {B2B_SEGMENTS.map((s, i) => {
          const SIcon = s.icon;
          return (
            <button key={s.segment} onClick={() => setActive(i)}
              className="w-full text-left rounded-xl border p-4 transition-all duration-200"
              style={{ background: active === i ? "rgba(245,158,11,0.07)" : P.card, borderColor: active === i ? s.color : P.border }}>
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: s.color, color: "#000" }}>{s.priority}</div>
                <SIcon size={16} style={{ color: active === i ? s.color : P.muted, flexShrink: 0 }} />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm" style={{ color: P.white }}>{s.segment}</div>
                  <div className="text-xs" style={{ color: P.muted }}>{s.addressable}</div>
                </div>
                <div className="text-xs px-2 py-0.5 rounded-full shrink-0" style={{ background: s.urgency === "high" ? "rgba(245,158,11,0.15)" : "rgba(249,115,22,0.1)", color: s.urgency === "high" ? P.gold : P.orange }}>
                  {s.urgency === "high" ? "High Priority" : "Medium Priority"}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <Card style={{ borderColor: seg.color + "55" }}>
        <div className="flex items-center gap-3 mb-5">
          <Icon size={24} style={{ color: seg.color }} />
          <div>
            <div className="font-bold text-lg" style={{ color: P.white }}>{seg.segment}</div>
            <div className="text-sm" style={{ color: P.muted }}>{seg.addressable}</div>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-5 text-sm">
          <div>
            <div className="text-xs font-semibold mb-1.5 flex items-center gap-1.5" style={{ color: P.gold }}>
              <Zap size={11} /> WHY NOW
            </div>
            <p style={{ color: P.muted }}>{seg.whyNow}</p>
          </div>
          <div>
            <div className="text-xs font-semibold mb-1.5 flex items-center gap-1.5" style={{ color: P.gold }}>
              <Target size={11} /> ENTRY POINT
            </div>
            <p style={{ color: P.muted }}>{seg.entryPoint}</p>
          </div>
          <div>
            <div className="text-xs font-semibold mb-1.5 flex items-center gap-1.5" style={{ color: P.gold }}>
              <Shield size={11} /> LIABILITY BARRIER
            </div>
            <p style={{ color: P.muted }}>{seg.liabilityBarrier}</p>
          </div>
          <div>
            <div className="text-xs font-semibold mb-1.5 flex items-center gap-1.5" style={{ color: P.gold }}>
              <Megaphone size={11} /> CHANNELS
            </div>
            <div className="flex flex-wrap gap-1.5">
              {seg.channels.map(ch => (
                <span key={ch} className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(249,115,22,0.1)", color: P.orange }}>{ch}</span>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

// ── Tab: Search Volume ────────────────────────────────────────────────────────
function TabKeywords() {
  const maxVol = Math.max(...KEYWORDS.map(k => k.volume));
  const sorted = [...KEYWORDS].sort((a, b) => b.volume - a.volume);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1" style={{ color: P.white }}>Search Volume & Keyword Intelligence</h2>
        <p className="text-sm" style={{ color: P.muted }}>Monthly US search volume for NeuroCatch's highest-value keyword categories. Low competition + high volume = immediate opportunity.</p>
      </div>

      {/* Bar chart */}
      <Card>
        <div className="font-semibold mb-4" style={{ color: P.white }}>Monthly Search Volume by Keyword</div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={sorted.slice(0, 8)} layout="vertical">
            <defs>
              <linearGradient id="kwGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={P.gold} />
                <stop offset="100%" stopColor={P.deep} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={P.border} horizontal={false} />
            <XAxis type="number" tick={{ fill: P.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="keyword" tick={{ fill: P.muted, fontSize: 9 }} axisLine={false} tickLine={false} width={180} />
            <Tooltip contentStyle={customTooltipStyle} formatter={(v: number) => [`${v.toLocaleString()}/mo`, "Search Volume"]} />
            <Bar dataKey="volume" fill="url(#kwGrad)" radius={[0, 6, 6, 0]} isAnimationActive animationDuration={1400} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Full keyword table */}
      <div className="space-y-2">
        {sorted.map((k) => {
          const pct = (k.volume / maxVol) * 100;
          const compColor = k.competition === "low" ? P.gold : k.competition === "medium" ? P.orange : P.deep;
          return (
            <Card key={k.keyword} className="p-4">
              <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
                <div className="font-semibold text-sm" style={{ color: P.white }}>{k.keyword}</div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(245,158,11,0.1)", color: P.gold }}>{k.segment}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${compColor}18`, color: compColor }}>{k.competition} comp</span>
                  <TrendingUp size={12} style={{ color: k.trend === "up" ? P.gold : P.muted }} />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: P.card2 }}>
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, background: P.grad, transition: "width 1s ease" }} />
                </div>
                <div className="text-sm font-bold shrink-0" style={{ color: P.white }}>{k.volume.toLocaleString()}<span className="text-xs font-normal ml-1" style={{ color: P.muted }}>/mo</span></div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card style={{ borderColor: "rgba(245,158,11,0.3)" }}>
        <div className="font-semibold mb-2 flex items-center gap-2" style={{ color: P.gold }}>
          <Zap size={14} /> Immediate Opportunity
        </div>
        <p className="text-sm" style={{ color: P.muted }}>
          "Concussion testing near me" (22,000/mo) and "concussion baseline test" (14,800/mo) have <strong style={{ color: P.white }}>low-to-medium competition</strong> and extremely high commercial intent. NeuroCatch currently captures zero of this traffic through paid search. These should be the first Google Search campaigns activated.
        </p>
      </Card>
    </div>
  );
}


// ── Brain Map (full-width layout) ────────────────────────────────────────────
const BRAIN_REGIONS = [
  {
    id: "prefrontal", label: "Prefrontal Cortex", shortLabel: "PFC",
    cx: 22, cy: 28, color: "#f59e0b",
    function: "Decision-Making & Rational Evaluation",
    marketingChannel: "Case Studies & Clinical Data",
    channels: ["White papers & ROI calculators", "Clinical trial results", "Peer-reviewed citations", "Implementation case studies"],
    insight: "The prefrontal cortex governs executive function, cost-benefit analysis, and trust formation. B2B buyers evaluating NeuroCatch engage this region when reviewing clinical validation data, pricing models, and implementation case studies. Logic-first content  -  data sheets, outcome studies, ROI models  -  activates this region and moves prospects toward a rational purchase decision.",
    brainRole: "Executive function, working memory, risk assessment, trust evaluation",
  },
  {
    id: "amygdala", label: "Amygdala", shortLabel: "AMY",
    cx: 42, cy: 58, color: "#f97316",
    function: "Fear, Urgency & Emotional Response",
    marketingChannel: "Risk & Consequence Messaging",
    channels: ["'What if you miss a concussion?' copy", "Liability risk messaging", "Second-impact syndrome statistics", "Urgency-driven CTAs"],
    insight: "The amygdala processes threat signals and triggers the fight-or-flight response. In B2B marketing, this is activated by liability risk messaging  -  'what happens if an athlete is cleared too soon?' Athletic directors, military medical officers, and occupational health directors all carry institutional liability. Messaging that surfaces the consequences of inaction activates the amygdala and creates urgency to act.",
    brainRole: "Threat detection, emotional memory, fear response, urgency",
  },
  {
    id: "hippocampus", label: "Hippocampus", shortLabel: "HPC",
    cx: 62, cy: 55, color: "#f59e0b",
    function: "Memory Formation & Brand Recall",
    marketingChannel: "Retargeting & Consistent Brand Presence",
    channels: ["Retargeting display ads", "Consistent logo/color usage", "Email drip sequences", "Conference presence + follow-up"],
    insight: "The hippocampus encodes experiences into long-term memory. Repeated exposure to the NeuroCatch brand  -  at conferences, in retargeting ads, in email sequences  -  builds the memory trace that makes the brand feel familiar and trustworthy when a decision is finally made. Familiarity reduces perceived risk. The buyer who has seen NeuroCatch 12 times before a demo call is far more likely to convert.",
    brainRole: "Long-term memory encoding, spatial navigation, familiarity recognition",
  },
  {
    id: "visual_cortex", label: "Visual Cortex", shortLabel: "V1",
    cx: 82, cy: 42, color: "#f97316",
    function: "Visual Processing & First Impressions",
    marketingChannel: "Video Demos & Visual Brand Assets",
    channels: ["Product demo videos", "Infographics", "LinkedIn carousel posts", "Conference booth visuals"],
    insight: "The visual cortex processes imagery before language  -  a prospect's first impression of NeuroCatch is formed visually before they read a single word. High-quality demo videos showing the 3-minute EEG process, clean product photography, and professional infographics activate this region and establish credibility instantly.",
    brainRole: "Primary visual processing, pattern recognition, first impression formation",
  },
  {
    id: "insula", label: "Insula", shortLabel: "INS",
    cx: 52, cy: 44, color: "#f59e0b",
    function: "Empathy, Gut Feeling & Physical Sensation",
    marketingChannel: "Human-Centered Stories & Patient Narratives",
    channels: ["Athlete injury stories", "Parent testimonials", "Clinician empathy content", "Human faces in ad creative"],
    insight: "The insula processes interoception  -  the brain's awareness of internal body states  -  and is the seat of empathy and gut-level intuition. When a prospect reads a story about an athlete whose career was saved because NeuroCatch caught a concussion that ImPACT missed, the insula fires. Human-centered storytelling activates the insula and creates emotional resonance that data alone cannot.",
    brainRole: "Interoception, empathy, disgust/pleasure, gut intuition",
  },
  {
    id: "anterior_cingulate", label: "Anterior Cingulate", shortLabel: "ACC",
    cx: 35, cy: 38, color: "#f97316",
    function: "Conflict Resolution & Social Proof",
    marketingChannel: "Peer Validation & Authority Endorsements",
    channels: ["'Trusted by 400+ clinics' social proof", "Peer institution logos", "Clinical champion endorsements", "Conference speaker credibility"],
    insight: "The anterior cingulate cortex (ACC) activates during decision conflict  -  the 'should I or shouldn't I?' moment. It is highly sensitive to social proof and peer behavior. When a prospect sees that a peer institution has adopted NeuroCatch, the ACC resolves the conflict in favor of adoption. Peer validation is the most powerful signal for this region.",
    brainRole: "Conflict monitoring, error detection, social norm processing, decision finalization",
  },
];

// Channel activation data for the radar/bar chart below the region buttons
const CHANNEL_ACTIVATION = [
  { channel: "LinkedIn",    prefrontal: 90, amygdala: 40, hippocampus: 70, insula: 60, brocas: 80, visual: 50, acc: 85, nac: 45 },
  { channel: "Google",      prefrontal: 85, amygdala: 55, hippocampus: 65, insula: 30, brocas: 95, visual: 40, acc: 50, nac: 60 },
  { channel: "Email",       prefrontal: 80, amygdala: 70, hippocampus: 75, insula: 65, brocas: 90, visual: 35, acc: 60, nac: 55 },
  { channel: "Video/Demo",  prefrontal: 70, amygdala: 65, hippocampus: 80, insula: 75, brocas: 60, visual: 98, acc: 70, nac: 85 },
  { channel: "Direct Mail", prefrontal: 75, amygdala: 50, hippocampus: 60, insula: 55, brocas: 70, visual: 65, acc: 45, nac: 40 },
  { channel: "Social",      prefrontal: 45, amygdala: 80, hippocampus: 55, insula: 90, brocas: 50, visual: 85, acc: 75, nac: 90 },
];

// Separated so rotation animation doesn't remount region cards
// Isolated rotation component  -  never causes card remounts
// Brain with subtle neural pathway electric current animation
function BrainVisual({ selected, hovered }: { selected: string | null; hovered: string | null }) {
  const [tick, setTick] = useState(0);
  const animRef = useRef<number | null>(null);
  useEffect(() => {
    let f = 0;
    const loop = () => { f++; setTick(f); animRef.current = requestAnimationFrame(loop); };
    animRef.current = requestAnimationFrame(loop);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, []);

  const t = tick / 60;

  // Neural pathway segments  -  each is a short curved line segment that lights up
  // Positioned to follow the brain's actual gyri/sulci structure
  const PATHWAYS = [
    // Outer cortex ring  -  top arc
    { x1: 20, y1: 20, x2: 32, y2: 13, cx: 26, cy: 14 },
    { x1: 32, y1: 13, x2: 46, y2: 10, cx: 39, cy: 9  },
    { x1: 46, y1: 10, x2: 60, y2: 12, cx: 53, cy: 8  },
    { x1: 60, y1: 12, x2: 72, y2: 18, cx: 67, cy: 12 },
    { x1: 72, y1: 18, x2: 80, y2: 28, cx: 79, cy: 21 },
    { x1: 80, y1: 28, x2: 83, y2: 40, cx: 85, cy: 34 },
    // Right side going down
    { x1: 83, y1: 40, x2: 80, y2: 53, cx: 85, cy: 47 },
    { x1: 80, y1: 53, x2: 73, y2: 62, cx: 80, cy: 60 },
    // Bottom arc
    { x1: 73, y1: 62, x2: 60, y2: 67, cx: 67, cy: 68 },
    { x1: 60, y1: 67, x2: 47, y2: 65, cx: 53, cy: 69 },
    { x1: 47, y1: 65, x2: 34, y2: 60, cx: 40, cy: 66 },
    { x1: 34, y1: 60, x2: 22, y2: 52, cx: 26, cy: 60 },
    // Left side going up
    { x1: 22, y1: 52, x2: 16, y2: 40, cx: 14, cy: 47 },
    { x1: 16, y1: 40, x2: 18, y2: 28, cx: 13, cy: 34 },
    { x1: 18, y1: 28, x2: 20, y2: 20, cx: 14, cy: 23 },
    // Inner pathways  -  horizontal
    { x1: 25, y1: 35, x2: 40, y2: 32, cx: 32, cy: 29 },
    { x1: 40, y1: 32, x2: 55, y2: 35, cx: 47, cy: 30 },
    { x1: 55, y1: 35, x2: 70, y2: 38, cx: 62, cy: 32 },
    // Inner pathways  -  diagonal
    { x1: 30, y1: 45, x2: 45, y2: 40, cx: 37, cy: 39 },
    { x1: 45, y1: 40, x2: 60, y2: 43, cx: 52, cy: 38 },
    { x1: 60, y1: 43, x2: 72, y2: 50, cx: 68, cy: 44 },
    // Deep pathways
    { x1: 35, y1: 50, x2: 48, y2: 52, cx: 41, cy: 48 },
    { x1: 48, y1: 52, x2: 62, y2: 55, cx: 55, cy: 50 },
    // Cross connections
    { x1: 28, y1: 25, x2: 38, y2: 38, cx: 30, cy: 32 },
    { x1: 55, y1: 22, x2: 60, y2: 35, cx: 60, cy: 28 },
    { x1: 70, y1: 28, x2: 68, y2: 42, cx: 73, cy: 35 },
    { x1: 25, y1: 42, x2: 35, y2: 52, cx: 27, cy: 49 },
  ];

  const ZONE_PATHS: Record<string, string> = {
    prefrontal:         "M 14,6 Q 28,2 44,9 Q 38,26 28,31 Q 18,28 11,18 Z",
    amygdala:           "M 34,53 Q 44,49 51,56 Q 49,66 39,68 Q 31,64 32,56 Z",
    hippocampus:        "M 54,51 Q 67,47 74,56 Q 72,66 61,69 Q 52,65 53,56 Z",
    visual_cortex:      "M 71,31 Q 87,26 94,39 Q 91,53 81,56 Q 71,51 69,41 Z",
    insula:             "M 41,36 Q 54,31 61,41 Q 59,51 49,53 Q 39,49 39,41 Z",
    anterior_cingulate: "M 24,31 Q 37,26 44,36 Q 41,46 31,48 Q 21,45 22,37 Z",
  };

  return (
    <div className="relative rounded-xl overflow-hidden" style={{ flex: '1 1 0', minWidth: 0, background: 'transparent' }}>
      <img
        src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663344335759/WcCRppeQmwrDTLId.png"
        alt="Brain"
        style={{ display: 'block', width: '100%', height: 'auto', filter: 'saturate(1.1) brightness(1.0) drop-shadow(0 0 18px rgba(245,158,11,0.35))' }}
        draggable={false}
      />
      <svg viewBox="0 0 100 100" preserveAspectRatio="none"
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        <defs>
          <filter id="pathGlow">
            <feGaussianBlur stdDeviation="0.6" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="zoneGlow">
            <feGaussianBlur stdDeviation="2.5" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* Zone highlights on click/hover */}
        {BRAIN_REGIONS.map((r) => {
          const isActive = selected === r.id || hovered === r.id;
          const path = ZONE_PATHS[r.id];
          if (!path) return null;
          return (
            <path key={r.id} d={path}
              fill={isActive ? r.color : 'transparent'}
              opacity={isActive ? 0.38 : 0}
              filter={isActive ? 'url(#zoneGlow)' : 'none'}
              style={{ transition: 'opacity 0.4s ease' }}
            />
          );
        })}

        {/* Neural pathways  -  each lights up as a traveling electric current */}
        {PATHWAYS.map((p, i) => {
          // Each pathway has its own phase offset  -  fires at different times
          const speed = 0.55 + (i % 5) * 0.08;
          const phase = (t * speed + i * 0.23) % 1;
          // The "lit" portion travels along the path  -  we draw a short bright segment
          // using strokeDasharray trick: total length ~20 units, lit segment = 3, gap = 17
          const dashLen = 3;
          const gapLen = 17;
          const offset = -(phase * (dashLen + gapLen));
          // Base line  -  very faint, always visible
          const baseOpacity = 0.08 + (i % 3) * 0.02;
          // Active segment opacity  -  subtle pulse
          const activeOpacity = 0.28 + Math.sin(t * 2 + i * 0.4) * 0.08;

          return (
            <g key={i} filter="url(#pathGlow)">
              {/* Base pathway  -  always faintly visible */}
              <path
                d={`M ${p.x1} ${p.y1} Q ${p.cx} ${p.cy} ${p.x2} ${p.y2}`}
                fill="none"
                stroke="#f59e0b"
                strokeWidth="0.35"
                opacity={baseOpacity}
              />
              {/* Traveling electric pulse */}
              <path
                d={`M ${p.x1} ${p.y1} Q ${p.cx} ${p.cy} ${p.x2} ${p.y2}`}
                fill="none"
                stroke="#fde68a"
                strokeWidth="0.8"
                opacity={activeOpacity}
                strokeDasharray={`${dashLen} ${gapLen}`}
                strokeDashoffset={offset}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}


// Animated neural network SVG  -  channel nodes firing to brain region nodes
function NeuralChannelMap() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    let f = 0;
    const t = setInterval(() => { f++; setTick(f); }, 16);
    return () => clearInterval(t);
  }, []);
  const t = tick / 60;
  const channels = [
    { id: 'linkedin',    label: 'LinkedIn',    x: 160, y: 40,  color: '#f59e0b' },
    { id: 'google',      label: 'Google',      x: 340, y: 40,  color: '#f97316' },
    { id: 'email',       label: 'Email',       x: 460, y: 140, color: '#fb923c' },
    { id: 'video',       label: 'Video/Demo',  x: 400, y: 270, color: '#f59e0b' },
    { id: 'direct',      label: 'Direct Mail', x: 100, y: 270, color: '#f97316' },
    { id: 'social',      label: 'Social',      x: 40,  y: 140, color: '#fb923c' },
  ];
  const brainNodes = [
    { id: 'pfc', label: 'PFC', x: 250, y: 100, color: '#f59e0b' },
    { id: 'amy', label: 'AMY', x: 200, y: 180, color: '#f97316' },
    { id: 'hpc', label: 'HPC', x: 300, y: 180, color: '#fb923c' },
  ];
  const connections = [
    { from: channels[0], to: brainNodes[0], strength: 0.9 },
    { from: channels[0], to: brainNodes[1], strength: 0.4 },
    { from: channels[1], to: brainNodes[0], strength: 0.85 },
    { from: channels[1], to: brainNodes[1], strength: 0.55 },
    { from: channels[2], to: brainNodes[0], strength: 0.8 },
    { from: channels[2], to: brainNodes[1], strength: 0.7 },
    { from: channels[2], to: brainNodes[2], strength: 0.75 },
    { from: channels[3], to: brainNodes[1], strength: 0.65 },
    { from: channels[3], to: brainNodes[2], strength: 0.8 },
    { from: channels[4], to: brainNodes[0], strength: 0.75 },
    { from: channels[4], to: brainNodes[2], strength: 0.6 },
    { from: channels[5], to: brainNodes[1], strength: 0.8 },
    { from: channels[5], to: brainNodes[2], strength: 0.55 },
  ];
  return (
    <div className="rounded-2xl border p-5" style={{ background: P.card, borderColor: P.border }}>
      <div className="mb-3">
        <div className="font-semibold" style={{ color: P.white }}>Channel \u2192 Brain Activation Map</div>
        <div className="text-xs mt-0.5" style={{ color: P.muted }}>Live neural pathway visualization  -  which channels fire which brain regions</div>
      </div>
      <svg viewBox="0 0 500 310" style={{ width: '100%', height: 'auto', display: 'block' }}>
        <defs>
          <filter id="nodeGlow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          <filter id="brainGlow"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>
        {connections.map((c, i) => {
          const phase = (t * 1.2 + i * 0.4) % 1;
          const px = c.from.x + (c.to.x - c.from.x) * phase;
          const py = c.from.y + (c.to.y - c.from.y) * phase;
          const lineOpacity = 0.12 + c.strength * 0.2;
          return (
            <g key={i}>
              <line x1={c.from.x} y1={c.from.y} x2={c.to.x} y2={c.to.y}
                stroke={c.from.color} strokeWidth={c.strength * 1.5} opacity={lineOpacity} strokeDasharray="4 6" />
              <circle cx={px} cy={py} r={2.5} fill={c.from.color} opacity={0.9} filter="url(#nodeGlow)" />
            </g>
          );
        })}
        {brainNodes.map((r) => {
          const pulse = 0.85 + Math.sin(t * 2.5 + r.x * 0.05) * 0.15;
          return (
            <g key={r.id}>
              <circle cx={r.x} cy={r.y} r={28 * pulse} fill={r.color} opacity={0.07} />
              <circle cx={r.x} cy={r.y} r={18} fill={r.color} opacity={0.18} filter="url(#brainGlow)" />
              <circle cx={r.x} cy={r.y} r={12} fill={r.color} opacity={0.6} />
              <circle cx={r.x} cy={r.y} r={5} fill={r.color} opacity={1} />
              <text x={r.x} y={r.y + 30} textAnchor="middle" fill={r.color} fontSize="9" fontWeight="700">{r.label}</text>
            </g>
          );
        })}
        {channels.map((c) => {
          const pulse = 0.9 + Math.sin(t * 1.8 + c.x * 0.03) * 0.1;
          return (
            <g key={c.id}>
              <circle cx={c.x} cy={c.y} r={20 * pulse} fill={c.color} opacity={0.07} />
              <circle cx={c.x} cy={c.y} r={10} fill={c.color} opacity={0.25} filter="url(#nodeGlow)" />
              <circle cx={c.x} cy={c.y} r={6} fill={c.color} opacity={0.85} />
              <text x={c.x} y={c.y - 16} textAnchor="middle" fill="#e2e8f0" fontSize="9" fontWeight="600">{c.label}</text>
            </g>
          );
        })}
        <text x={10} y={302} fill="#475569" fontSize="7.5">\u25cf Channel nodes  \u25cf Brain regions (PFC=Prefrontal, AMY=Amygdala, HPC=Hippocampus)  \u2014 Pulse intensity = activation strength</text>
      </svg>
    </div>
  );
}

function TabBrainMap() {
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setPulse(p => (p + 1) % BRAIN_REGIONS.length), 1600);
    return () => clearInterval(t);
  }, []);

  const selectedRegion = BRAIN_REGIONS.find(r => r.id === selected);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold mb-0.5" style={{ color: P.white }}>Marketing Brain Map</h2>
        <p className="text-xs" style={{ color: P.muted }}>Every marketing channel activates a different region of the buyer's decision-making process. Click a region to explore the strategy.</p>
      </div>

      {/* ── 3 compact cards | brain (flex-1) | 3 compact cards ── */}
      <div className="flex items-center gap-4">

        {/* Left 3 cards  -  auto width, content-sized */}
        <div className="flex flex-col gap-2.5" style={{ flexShrink: 0 }}>
          {BRAIN_REGIONS.slice(0, 3).map((r, i) => {
            const isActive = selected === r.id;
            const isHov = hovered === r.id;
            const isPulse = pulse === i;
            return (
              <div key={r.id} role="button" tabIndex={0}
                onClick={() => setSelected(isActive ? null : r.id)}
                onMouseEnter={() => setHovered(r.id)}
                onMouseLeave={() => setHovered(null)}
                onKeyDown={e => e.key === 'Enter' && setSelected(isActive ? null : r.id)}
                className="cursor-pointer rounded-xl border transition-all duration-200"
                style={{
                  padding: '10px 14px',
                  background: isActive ? `${r.color}22` : isHov ? `${r.color}0e` : P.card,
                  borderColor: isActive ? r.color : isHov ? `${r.color}60` : isPulse ? `${r.color}40` : P.border,
                  boxShadow: isActive ? `0 0 20px ${r.color}40` : isPulse ? `0 0 8px ${r.color}20` : 'none',
                  width: 175,
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: r.color, boxShadow: isActive ? `0 0 8px ${r.color}` : 'none' }} />
                  <span className="text-sm font-bold" style={{ color: isActive ? r.color : P.white }}>{r.label}</span>
                </div>
                <div className="text-xs" style={{ color: P.muted, lineHeight: 1.4 }}>{r.function}</div>
              </div>
            );
          })}
        </div>

        {/* Brain  -  takes all remaining space */}
        <BrainVisual selected={selected} hovered={hovered} />

        {/* Right 3 cards */}
        <div className="flex flex-col gap-2.5" style={{ flexShrink: 0 }}>
          {BRAIN_REGIONS.slice(3, 6).map((r, i) => {
            const isActive = selected === r.id;
            const isHov = hovered === r.id;
            const isPulse = pulse === (i + 3);
            return (
              <div key={r.id} role="button" tabIndex={0}
                onClick={() => setSelected(isActive ? null : r.id)}
                onMouseEnter={() => setHovered(r.id)}
                onMouseLeave={() => setHovered(null)}
                onKeyDown={e => e.key === 'Enter' && setSelected(isActive ? null : r.id)}
                className="cursor-pointer rounded-xl border transition-all duration-200"
                style={{
                  padding: '10px 14px',
                  background: isActive ? `${r.color}22` : isHov ? `${r.color}0e` : P.card,
                  borderColor: isActive ? r.color : isHov ? `${r.color}60` : isPulse ? `${r.color}40` : P.border,
                  boxShadow: isActive ? `0 0 20px ${r.color}40` : isPulse ? `0 0 8px ${r.color}20` : 'none',
                  width: 175,
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: r.color, boxShadow: isActive ? `0 0 8px ${r.color}` : 'none' }} />
                  <span className="text-sm font-bold" style={{ color: isActive ? r.color : P.white }}>{r.label}</span>
                </div>
                <div className="text-xs" style={{ color: P.muted, lineHeight: 1.4 }}>{r.function}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Detail panel ── */}
      <AnimatePresence mode="wait">
        {selectedRegion && (
          <motion.div key={selectedRegion.id}
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
            className="rounded-2xl border p-5"
            style={{ background: `${selectedRegion.color}0a`, borderColor: `${selectedRegion.color}50` }}
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="text-xs font-semibold tracking-widest mb-0.5" style={{ color: selectedRegion.color }}>{selectedRegion.function.toUpperCase()}</div>
                <h3 className="text-xl font-bold" style={{ color: P.white }}>{selectedRegion.label}</h3>
                <div className="text-xs mt-0.5" style={{ color: P.muted }}>{selectedRegion.brainRole}</div>
              </div>
              <button onClick={() => setSelected(null)} className="text-xs px-3 py-1.5 rounded-lg shrink-0" style={{ background: P.card2, color: P.muted }}>✕ Close</button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-xl p-4" style={{ background: P.card2, borderLeft: `3px solid ${selectedRegion.color}` }}>
                <div className="text-xs font-semibold mb-1" style={{ color: selectedRegion.color }}>Primary Channel</div>
                <div className="text-base font-bold mb-3" style={{ color: P.white }}>{selectedRegion.marketingChannel}</div>
                <div className="text-xs font-semibold mb-1" style={{ color: P.muted }}>MESSAGING ANGLE</div>
                <div className="text-xs" style={{ color: P.muted }}>{selectedRegion.insight.split('.')[0]}.</div>
              </div>
              <div className="rounded-xl p-4" style={{ background: P.card2 }}>
                <div className="text-xs font-semibold mb-2" style={{ color: P.gold }}>Activation Tactics</div>
                <div className="space-y-2">
                  {selectedRegion.channels.map((ch, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs">
                      <div className="w-1.5 h-1.5 rounded-full shrink-0 mt-1" style={{ background: selectedRegion.color }} />
                      <span style={{ color: P.muted }}>{ch}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-xl p-4" style={{ background: P.card2 }}>
                <div className="text-xs font-semibold mb-2" style={{ color: P.gold }}>Neuroscience Insight</div>
                <p className="text-xs leading-relaxed" style={{ color: P.muted }}>{selectedRegion.insight}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Animated neural network channel map ── */}
      <NeuralChannelMap />
    </div>
  );
}


// ── Tab: Outreach Kit ─────────────────────────────────────────────────────────
function TabOutreach() {
  const [activeSeg, setActiveSeg] = useState(0);
  const [activeTab, setActiveTab] = useState<"linkedin"|"email"|"google"|"direct">("linkedin");
  const seg = OUTREACH[activeSeg];
  const Icon = seg.icon;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1" style={{ color: P.white }}>Outreach Kit</h2>
        <p className="text-sm" style={{ color: P.muted }}>Ready-to-use copy for each target segment across all channels. Click any field to copy.</p>
      </div>

      {/* Segment selector */}
      <div className="flex gap-2 flex-wrap">
        {OUTREACH.map((s, i) => {
          const SIcon = s.icon;
          return (
            <button key={s.segment} onClick={() => setActiveSeg(i)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl border text-sm transition-all duration-200"
              style={{ background: activeSeg === i ? "rgba(245,158,11,0.1)" : P.card, borderColor: activeSeg === i ? P.gold : P.border, color: activeSeg === i ? P.gold : P.muted }}>
              <SIcon size={13} />
              {s.segment}
            </button>
          );
        })}
      </div>

      {/* Channel tabs */}
      <div className="flex gap-1 p-1 rounded-xl" style={{ background: P.card2 }}>
        {(["linkedin", "email", "google", "direct"] as const).map((t) => (
          <button key={t} onClick={() => setActiveTab(t)}
            className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all duration-200 capitalize"
            style={{ background: activeTab === t ? P.card : "transparent", color: activeTab === t ? P.white : P.muted }}>
            {t === "linkedin" ? "LinkedIn" : t === "email" ? "Email" : t === "google" ? "Google Ad" : "Direct Mail"}
          </button>
        ))}
      </div>

      {/* Copy blocks */}
      <div className="space-y-4">
        {activeTab === "linkedin" && (
          <>
            <Card>
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs font-semibold flex items-center gap-1.5" style={{ color: P.gold }}><Linkedin size={12} /> CONNECTION REQUEST</div>
                <CopyBtn text={seg.linkedin.connection} />
              </div>
              <p className="text-sm leading-relaxed" style={{ color: P.muted }}>{seg.linkedin.connection}</p>
            </Card>
            <Card>
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs font-semibold flex items-center gap-1.5" style={{ color: P.gold }}><Linkedin size={12} /> FOLLOW-UP MESSAGE</div>
                <CopyBtn text={seg.linkedin.followUp} />
              </div>
              <p className="text-sm leading-relaxed" style={{ color: P.muted }}>{seg.linkedin.followUp}</p>
            </Card>
          </>
        )}
        {activeTab === "email" && (
          <Card>
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-semibold flex items-center gap-1.5" style={{ color: P.gold }}><Mail size={12} /> SUBJECT LINE</div>
              <CopyBtn text={seg.email.subject} />
            </div>
            <div className="p-3 rounded-lg mb-4 text-sm font-semibold" style={{ background: P.card2, color: P.white }}>{seg.email.subject}</div>
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-semibold flex items-center gap-1.5" style={{ color: P.gold }}><Mail size={12} /> EMAIL BODY</div>
              <CopyBtn text={seg.email.body} />
            </div>
            <pre className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: P.muted, fontFamily: "inherit" }}>{seg.email.body}</pre>
          </Card>
        )}
        {activeTab === "google" && (
          <Card>
            <div className="mb-4">
              <div className="text-xs font-semibold mb-2 flex items-center gap-1.5" style={{ color: P.gold }}><Search size={12} /> HEADLINES (up to 3)</div>
              <div className="space-y-2">
                {seg.googleAd.headlines.map((h, i) => (
                  <div key={i} className="flex items-center justify-between gap-2 p-2 rounded-lg" style={{ background: P.card2 }}>
                    <span className="text-sm" style={{ color: P.white }}>{h}</span>
                    <CopyBtn text={h} />
                  </div>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <div className="text-xs font-semibold mb-2 flex items-center gap-1.5" style={{ color: P.gold }}><Search size={12} /> DESCRIPTIONS</div>
              <div className="space-y-2">
                {seg.googleAd.descriptions.map((d, i) => (
                  <div key={i} className="flex items-start justify-between gap-2 p-2 rounded-lg" style={{ background: P.card2 }}>
                    <span className="text-sm" style={{ color: P.muted }}>{d}</span>
                    <CopyBtn text={d} />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold mb-2 flex items-center gap-1.5" style={{ color: P.gold }}><Target size={12} /> TARGET KEYWORDS</div>
              <div className="flex flex-wrap gap-2">
                {seg.googleAd.keywords.map((k) => (
                  <div key={k} className="flex items-center gap-1.5 px-2 py-1 rounded-lg" style={{ background: P.card2 }}>
                    <span className="text-xs" style={{ color: P.muted }}>{k}</span>
                    <CopyBtn text={k} />
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}
        {activeTab === "direct" && (
          <Card>
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-semibold flex items-center gap-1.5" style={{ color: P.gold }}><FileText size={12} /> POSTCARD HEADLINE</div>
              <CopyBtn text={seg.directMail.headline} />
            </div>
            <div className="p-3 rounded-lg mb-4 text-lg font-bold" style={{ background: P.card2, color: P.white }}>{seg.directMail.headline}</div>
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-semibold flex items-center gap-1.5" style={{ color: P.gold }}><FileText size={12} /> BODY COPY</div>
              <CopyBtn text={seg.directMail.body} />
            </div>
            <pre className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: P.muted, fontFamily: "inherit" }}>{seg.directMail.body}</pre>
          </Card>
        )}
      </div>
    </div>
  );
}

// ── Tab: Campaign Readiness ───────────────────────────────────────────────────
function TabReadiness() {
  const active = READINESS.filter(r => r.status === "active").length;
  const total = READINESS.length;
  const pct = Math.round((active / total) * 100);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1" style={{ color: P.white }}>Campaign Readiness</h2>
        <p className="text-sm" style={{ color: P.muted }}>10-item scorecard showing NeuroCatch's current campaign infrastructure status.</p>
      </div>

      {/* Score */}
      <Card style={{ borderColor: "rgba(245,158,11,0.3)" }}>
        <div className="flex items-center gap-6">
          <div className="relative w-20 h-20 shrink-0">
            <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
              <circle cx="40" cy="40" r="32" fill="none" stroke={P.border} strokeWidth="6" />
              <circle cx="40" cy="40" r="32" fill="none" stroke={P.gold} strokeWidth="6"
                strokeDasharray={`${2 * Math.PI * 32 * pct / 100} ${2 * Math.PI * 32 * (1 - pct / 100)}`}
                strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold" style={{ color: P.gold }}>{pct}%</span>
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold mb-1" style={{ color: P.white }}>{active} of {total} Complete</div>
            <p className="text-sm" style={{ color: P.muted }}>The Lovell partnership is active. Everything else is ready to activate  -  the infrastructure is straightforward to build.</p>
          </div>
        </div>
      </Card>

      {/* Checklist */}
      <div className="space-y-2">
        {READINESS.map((r) => {
          const priorityColor = r.priority === "critical" ? P.gold : r.priority === "high" ? P.orange : r.priority === "medium" ? P.deep : P.muted;
          return (
            <div key={r.item} className="flex items-center gap-3 p-3 rounded-xl border" style={{ background: P.card, borderColor: r.status === "active" ? P.gold + "40" : P.border }}>
              {r.status === "active"
                ? <CheckCircle2 size={16} style={{ color: P.gold, flexShrink: 0 }} />
                : <Circle size={16} style={{ color: P.border, flexShrink: 0 }} />
              }
              <span className="flex-1 text-sm" style={{ color: r.status === "active" ? P.white : P.muted }}>{r.item}</span>
              <span className="text-xs px-2 py-0.5 rounded-full shrink-0" style={{ background: `${priorityColor}15`, color: priorityColor }}>
                {r.priority}
              </span>
            </div>
          );
        })}
      </div>

      <Card style={{ borderColor: "rgba(245,158,11,0.3)", background: "rgba(245,158,11,0.04)" }}>
        <div className="font-semibold mb-2 flex items-center gap-2" style={{ color: P.gold }}>
          <Zap size={14} /> Next 30 Days  -  Priority Actions
        </div>
        <ol className="space-y-2 text-sm" style={{ color: P.muted }}>
          <li className="flex gap-2"><span style={{ color: P.gold }}>1.</span> Install SiteID.ai on neurocatch.com (one script tag  -  48 hours to live data)</li>
          <li className="flex gap-2"><span style={{ color: P.gold }}>2.</span> Activate Google Search on top 5 concussion keywords ($3K/mo test budget)</li>
          <li className="flex gap-2"><span style={{ color: P.gold }}>3.</span> Build NCAA Athletic Director LinkedIn outreach list (50 Power 5 targets)</li>
          <li className="flex gap-2"><span style={{ color: P.gold }}>4.</span> Define 30-day collegiate pilot program offer and one-pager</li>
          <li className="flex gap-2"><span style={{ color: P.gold }}>5.</span> Launch LinkedIn campaign targeting VA/DoD procurement officers</li>
        </ol>
      </Card>
    </div>
  );
}

// ── Tab: TBI Brain Injury Reference ──────────────────────────────────────────
const TBI_REGIONS = [
  {
    id: 'frontal',
    label: 'Frontal Lobe',
    color: '#f59e0b',
    position: { left: '18%', top: '12%' },
    anatomy: "Executive function, personality, voluntary movement, speech production (Broca's area)",
    tbiSymptoms: [
      'Impaired executive function  -  poor planning, judgment, impulse control',
      'Personality changes  -  irritability, disinhibition, apathy',
      'Difficulty initiating tasks or switching between activities',
      "Expressive aphasia (Broca's area damage)",
      'Contralateral motor weakness or paralysis',
    ],
    neurocatchValue: "NeuroCatch's P300 and N200 waveforms directly measure frontal lobe processing speed and executive function. Objective millisecond-level data replaces subjective self-report.",
    legalValue: 'Frontal lobe injuries are the most commonly disputed in PI cases. Objective ERP data showing slowed cognitive processing provides irrefutable documentation that subjective neuropsych testing cannot.',
    prevalence: '60--70% of TBI cases involve frontal lobe damage',
    docTip: 'Baseline vs. post-injury comparison is critical  -  NeuroCatch establishes objective cognitive benchmarks.',
  },
  {
    id: 'temporal',
    label: 'Temporal Lobe',
    color: '#f97316',
    position: { left: '12%', top: '48%' },
    anatomy: "Memory formation (hippocampus), language comprehension (Wernicke's area), auditory processing, emotion regulation (amygdala)",
    tbiSymptoms: [
      'Short-term memory loss  -  inability to form new memories',
      'Receptive aphasia - difficulty understanding spoken/written language',
      'Auditory processing deficits',
      'Emotional dysregulation  -  anxiety, aggression, mood swings',
      'Seizure susceptibility (temporal lobe epilepsy)',
    ],
    neurocatchValue: "The N400 waveform measured by NeuroCatch reflects semantic language processing in Wernicke's area. Memory encoding deficits show as reduced P300 amplitude  -  a direct biomarker of hippocampal function.",
    legalValue: "Memory complaints are the #1 disputed symptom in TBI litigation. NeuroCatch's N200/P300 latency data provides objective evidence of memory processing deficits that cannot be faked or coached.",
    prevalence: '45--55% of moderate-to-severe TBI cases',
    docTip: 'Serial NeuroCatch assessments over 3--6 months document recovery trajectory for settlement negotiations.',
  },
  {
    id: 'parietal',
    label: 'Parietal Lobe',
    color: '#fb923c',
    position: { left: '55%', top: '10%' },
    anatomy: 'Sensory integration, spatial awareness, attention, reading and arithmetic processing',
    tbiSymptoms: [
      'Sensory deficits  -  numbness, tingling, loss of proprioception',
      'Spatial disorientation  -  difficulty navigating familiar environments',
      'Hemispatial neglect (contralateral side ignored)',
      'Difficulty with reading, writing, and arithmetic',
      'Apraxia  -  inability to perform learned motor tasks',
    ],
    neurocatchValue: "Parietal attention networks are reflected in the P300 component. NeuroCatch's attention-related ERP markers quantify the degree of attentional deficit with precision unavailable through behavioral testing.",
    legalValue: 'Spatial and attentional deficits directly impact work capacity and daily function. Objective ERP documentation supports vocational rehabilitation claims and lost-earnings calculations.',
    prevalence: '30--40% of TBI cases with significant functional impact',
    docTip: 'Combine NeuroCatch data with occupational therapy assessments for comprehensive functional impact documentation.',
  },
  {
    id: 'occipital',
    label: 'Occipital Lobe',
    color: '#fbbf24',
    position: { left: '78%', top: '28%' },
    anatomy: 'Primary visual cortex  -  processes all visual information including color, motion, depth perception',
    tbiSymptoms: [
      'Visual field deficits  -  hemianopia or quadrantanopia',
      'Visual processing disorders  -  difficulty interpreting images',
      'Photophobia  -  hypersensitivity to light',
      'Visual hallucinations or cortical blindness',
      'Difficulty with reading due to visual tracking problems',
    ],
    neurocatchValue: "NeuroCatch's visual evoked potential components (P100, N200) directly measure occipital cortex processing. Delayed latencies objectively document visual pathway damage.",
    legalValue: 'Visual deficits are often minimized or disbelieved without objective testing. ERP-documented visual processing delays provide courtroom-ready evidence of occipital injury.',
    prevalence: '25--35% of TBI cases involve some visual processing disruption',
    docTip: 'Visual processing deficits often co-occur with post-concussion syndrome  -  NeuroCatch captures both simultaneously.',
  },
  {
    id: 'cerebellum',
    label: 'Cerebellum',
    color: '#f59e0b',
    position: { left: '72%', top: '62%' },
    anatomy: 'Motor coordination, balance, fine motor control, timing of movements, some cognitive functions',
    tbiSymptoms: [
      'Ataxia  -  unsteady gait, balance problems',
      'Dysmetria  -  difficulty judging distances and movements',
      'Tremor and coordination deficits',
      'Slurred speech (dysarthria)',
      'Cognitive cerebellar syndrome  -  impaired attention and executive function',
    ],
    neurocatchValue: "Cerebellar timing functions are reflected in ERP component latencies. NeuroCatch's precise millisecond timing measurements can detect subtle cerebellar processing delays not visible on standard imaging.",
    legalValue: 'Balance and coordination deficits directly impact employment and daily living. Objective ERP timing data complements balance testing for comprehensive injury documentation.',
    prevalence: '20--30% of TBI cases, higher in rear-impact collisions',
    docTip: 'Cerebellar injuries often appear normal on MRI  -  NeuroCatch provides functional evidence when structural imaging is negative.',
  },
  {
    id: 'brainstem',
    label: 'Brain Stem',
    color: '#ef4444',
    position: { left: '45%', top: '72%' },
    anatomy: 'Vital functions (breathing, heart rate), consciousness, sleep-wake cycles, cranial nerve nuclei, reticular activating system',
    tbiSymptoms: [
      'Altered consciousness  -  from confusion to coma',
      'Sleep disorders  -  insomnia, hypersomnia, disrupted circadian rhythm',
      'Autonomic dysfunction  -  blood pressure instability, temperature dysregulation',
      'Cranial nerve palsies  -  double vision, facial weakness, swallowing difficulty',
      'Locked-in syndrome in severe cases',
    ],
    neurocatchValue: "The brainstem auditory evoked response (BAER) and early ERP components reflect brainstem integrity. NeuroCatch's sub-100ms components provide a window into brainstem function unavailable through behavioral testing.",
    legalValue: 'Brainstem injuries carry the highest severity and settlement value. Objective ERP documentation of brainstem dysfunction is critical for establishing injury severity in catastrophic TBI cases.',
    prevalence: 'Present in 15--20% of moderate-severe TBI; associated with worst outcomes',
    docTip: 'Brainstem injuries require serial NeuroCatch assessments  -  early documentation establishes baseline for long-term prognosis.',
  },
];

function TabTBI() {
  const [selected, setSelected] = useState<string | null>('frontal');

  const selectedRegion = TBI_REGIONS.find(r => r.id === selected);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full" style={{ background: '#ef4444', boxShadow: '0 0 8px #ef4444' }} />
          <span className="text-xs font-semibold tracking-widest" style={{ color: '#ef4444' }}>CLINICAL REFERENCE</span>
        </div>
        <h2 className="text-xl font-bold mb-0.5" style={{ color: P.white }}>TBI Brain Injury Atlas</h2>
        <p className="text-xs" style={{ color: P.muted }}>Tap a brain region to see clinical TBI presentation and why NeuroCatch documentation is critical.</p>
      </div>

      {/* Brain image — full width, no side columns */}
      <div className="relative rounded-2xl overflow-hidden w-full" style={{ background: 'transparent' }}>
        <img
          src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663344335759/WcCRppeQmwrDTLId.png"
          alt="Brain"
          style={{ display: 'block', width: '100%', height: 'auto', filter: 'saturate(1.0) brightness(0.9) drop-shadow(0 0 16px rgba(239,68,68,0.25))' }}
          draggable={false}
        />
      </div>

      {/* Region selector — 2-column grid, tap-friendly */}
      <div className="grid grid-cols-2 gap-2">
        {TBI_REGIONS.map((r) => {
          const isActive = selected === r.id;
          return (
            <button key={r.id} onClick={() => setSelected(isActive ? null : r.id)}
              className="text-left rounded-xl border transition-all duration-200 px-3 py-3 w-full"
              style={{
                background: isActive ? `${r.color}18` : P.card,
                borderColor: isActive ? r.color : P.border,
                boxShadow: isActive ? `0 0 14px ${r.color}28` : 'none',
                minHeight: 56,
              }}>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: r.color, boxShadow: isActive ? `0 0 8px ${r.color}` : 'none' }} />
                <span className="text-sm font-bold leading-tight" style={{ color: isActive ? r.color : P.white }}>{r.label}</span>
              </div>
              <div className="text-xs mt-1 ml-4" style={{ color: P.muted, fontSize: '0.6rem', lineHeight: 1.3 }}>{r.anatomy.split(',')[0]}</div>
            </button>
          );
        })}
      </div>

      {/* Detail panel — full width, stacked columns on mobile */}
      <AnimatePresence mode="wait">
        {selectedRegion && (
          <motion.div key={selectedRegion.id}
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
            className="rounded-2xl border p-4"
            style={{ background: `${selectedRegion.color}08`, borderColor: `${selectedRegion.color}40` }}>

            {/* Region header */}
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <div className="text-xs font-semibold tracking-widest mb-0.5" style={{ color: selectedRegion.color }}>
                  TBI — {selectedRegion.label.toUpperCase()}
                </div>
                <h3 className="text-lg font-bold mb-1" style={{ color: P.white }}>{selectedRegion.label}</h3>
                <div className="text-xs leading-relaxed" style={{ color: P.muted }}>{selectedRegion.anatomy}</div>
                <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: `${selectedRegion.color}20`, color: selectedRegion.color }}>
                  {selectedRegion.prevalence}
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="text-xs px-2.5 py-1.5 rounded-lg shrink-0" style={{ background: P.card2, color: P.muted }}>✕</button>
            </div>

            {/* Stacked sections — no side-by-side columns on mobile */}
            <div className="space-y-3">
              {/* TBI Symptoms */}
              <div className="rounded-xl p-3" style={{ background: P.card2, borderLeft: `3px solid ${selectedRegion.color}` }}>
                <div className="text-xs font-semibold mb-2" style={{ color: selectedRegion.color }}>Clinical TBI Presentation</div>
                <div className="space-y-1.5">
                  {selectedRegion.tbiSymptoms.map((s, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full shrink-0 mt-1" style={{ background: selectedRegion.color }} />
                      <span className="text-xs leading-relaxed" style={{ color: P.muted }}>{s}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* NeuroCatch Value */}
              <div className="rounded-xl p-3" style={{ background: P.card2 }}>
                <div className="text-xs font-semibold mb-2" style={{ color: P.gold }}>NeuroCatch Assessment Value</div>
                <p className="text-xs leading-relaxed mb-3" style={{ color: P.muted }}>{selectedRegion.neurocatchValue}</p>
                <div className="rounded-lg p-2.5" style={{ background: `${P.gold}12`, border: `1px solid ${P.gold}30` }}>
                  <div className="text-xs font-semibold mb-0.5" style={{ color: P.gold }}>Documentation Tip</div>
                  <div className="text-xs leading-relaxed" style={{ color: P.muted }}>{selectedRegion.docTip}</div>
                </div>
              </div>

              {/* Legal Value */}
              <div className="rounded-xl p-3" style={{ background: P.card2 }}>
                <div className="text-xs font-semibold mb-2" style={{ color: '#60a5fa' }}>Legal & Settlement Value</div>
                <p className="text-xs leading-relaxed mb-3" style={{ color: P.muted }}>{selectedRegion.legalValue}</p>
                <div className="rounded-lg p-2.5" style={{ background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.2)' }}>
                  <div className="text-xs font-semibold mb-0.5" style={{ color: '#60a5fa' }}>Why Objective Data Wins</div>
                  <div className="text-xs leading-relaxed" style={{ color: P.muted }}>ERP biomarkers are physiological measurements - they cannot be coached, faked, or dismissed as subjective complaint.</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom CTA */}
      <div className="rounded-2xl border p-4" style={{ background: P.card, borderColor: P.border }}>
        <div className="font-semibold mb-1 text-sm" style={{ color: P.white }}>Document TBI with objective biomarkers</div>
        <div className="text-xs mb-3" style={{ color: P.muted }}>NeuroCatch delivers FDA-cleared ERP assessment in under 8 minutes.</div>
        <div className="flex gap-2">
          <a href="https://neurocatch.com" target="_blank" rel="noopener noreferrer"
            className="flex-1 text-center px-3 py-2 rounded-lg text-xs font-semibold" style={{ background: P.gold, color: '#0a0e1c' }}>
            Request Demo
          </a>
          <a href="https://neurocatch.com" target="_blank" rel="noopener noreferrer"
            className="flex-1 text-center px-3 py-2 rounded-lg text-xs font-semibold border" style={{ background: 'transparent', color: P.white, borderColor: P.border }}>
            Clinical Evidence
          </a>
        </div>
      </div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
const TABS = [
  { id: "brain",     label: "Brain Map",           icon: Brain },
  { id: "tbi",       label: "TBI Atlas",            icon: Brain },
  { id: "site",      label: "Site Intelligence",  icon: Activity },
  { id: "market",    label: "Market Intelligence", icon: BarChart2 },
  { id: "segments",  label: "B2B Segments",        icon: Users },
  { id: "keywords",  label: "Search Volume",       icon: Search },
  { id: "outreach",  label: "Outreach Kit",        icon: Megaphone },
  { id: "readiness", label: "Readiness",           icon: CheckCircle2 },
];

export default function NeuroCatchDashboard() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("brain");

  return (
    <div className="min-h-screen" style={{ background: P.bg, color: P.white }}>
      {/* Header */}
      <div style={{ background: P.bg2, borderBottom: `1px solid ${P.border}` }}>
        <div className="max-w-6xl mx-auto px-4 py-4">
          <button onClick={() => navigate("/campaigns")}
            className="flex items-center gap-2 text-sm mb-4 transition-opacity hover:opacity-70"
            style={{ color: P.muted }}>
            <ArrowLeft size={14} /> Back to Campaigns
          </button>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <Brain size={28} style={{ color: P.gold }} />
                <h1 className="text-3xl font-bold" style={{ background: P.gradText, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  NeuroCatch
                </h1>
              </div>
              <p className="text-sm" style={{ color: P.muted }}>MedTech / Cognitive Assessment · Phoenix, AZ (US HQ)</p>
              <p className="text-sm font-semibold mt-0.5" style={{ color: P.orange }}>Brain Vital Signs  -  B2B & B2C Market Entry 2026</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: P.gold }} />
              <span className="text-xs font-semibold tracking-widest" style={{ color: P.gold }}>CAMPAIGN ACTIVE</span>
            </div>
          </div>

          {/* KPI strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
            {[
              { label: "Jun '26 Visits",  value: "1,492",   sub: "Real SimilarWeb data" },
              { label: "Bounce Rate",     value: "34.0%",   sub: "Trending down  -  improving" },
              { label: "Zero Paid Traffic", value: "0%",    sub: "Massive untapped opportunity" },
              { label: "Market CAGR",     value: "16%",     sub: "Cognitive assessment market" },
            ].map((k) => (
              <div key={k.label} className="rounded-xl border p-3" style={{ background: P.card, borderColor: P.border }}>
                <div className="text-xl font-bold" style={{ background: P.gradText, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{k.value}</div>
                <div className="text-xs font-semibold mt-0.5" style={{ color: P.white }}>{k.label}</div>
                <div className="text-xs" style={{ color: P.muted }}>{k.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tab nav */}
      <div style={{ background: P.bg2, borderBottom: `1px solid ${P.border}` }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto py-2 no-scrollbar">
            {TABS.map((t) => {
              const TIcon = t.icon;
              return (
                <button key={t.id} onClick={() => setActiveTab(t.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 shrink-0"
                  style={{ background: activeTab === t.id ? "rgba(245,158,11,0.12)" : "transparent", color: activeTab === t.id ? P.gold : P.muted, borderBottom: activeTab === t.id ? `2px solid ${P.gold}` : "2px solid transparent" }}>
                  <TIcon size={13} />
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {activeTab === "site"      && <TabSite />}
        {activeTab === "market"    && <TabMarket />}
        {activeTab === "segments"  && <TabSegments />}
        {activeTab === "keywords"  && <TabKeywords />}
        {activeTab === "brain"     && <TabBrainMap />}
        {activeTab === "tbi"       && <TabTBI />}
        {activeTab === "outreach"  && <TabOutreach />}
        {activeTab === "readiness" && <TabReadiness />}
      </div>
    </div>
  );
}
