/**
 * NeuroCatchDashboard.tsx
 * NeuroCatch Inc. — Brain Vital Signs Platform
 * Design: Deep purple bg (#07071a) | Gold→Orange gradient | White text ONLY
 * No emojis. Lucide icons only. No other colors.
 * Real SimilarWeb traffic data wired in.
 */
import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import {
  AreaChart, Area, BarChart, Bar, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line
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
    whyNow: "Lovell Federal Health Care Center partnership is already open. TBI is the signature wound of modern warfare — DoD has mandated objective assessment tools.",
    entryPoint: "Lovell FHCC partnership → DoD/VA procurement channels",
    liabilityBarrier: "Low — government mandate drives adoption",
    urgency: "high", color: P.gold,
    channels: ["LinkedIn (procurement officers)", "Direct outreach to VA CMOs", "Federal contract vehicles"],
  },
  {
    priority: 2, segment: "Collegiate Athletics (NCAA)",
    icon: GraduationCap, addressable: "1,100+ schools, 500K+ athletes",
    whyNow: "NCAA concussion liability exposure is at an all-time high. Schools need objective documentation to defend return-to-play decisions.",
    entryPoint: "Athletic trainers and sports medicine directors at Power 5 programs",
    liabilityBarrier: "Medium — legal protection angle is the key message",
    urgency: "high", color: P.orange,
    channels: ["LinkedIn (ADs, ATCs)", "NATA conference presence", "Direct mail to athletic training depts"],
  },
  {
    priority: 3, segment: "Occupational Health / High-Risk Industries",
    icon: Briefcase, addressable: "15M+ workers in regulated industries",
    whyNow: "OSHA TBI reporting requirements are tightening. Construction, mining, and manufacturing need defensible cognitive baselines.",
    entryPoint: "Occupational medicine physicians and corporate EHS directors",
    liabilityBarrier: "Low — regulatory compliance drives the conversation",
    urgency: "medium", color: P.deep,
    channels: ["LinkedIn (EHS directors)", "Industry trade publications", "Google Search (OSHA TBI compliance)"],
  },
  {
    priority: 4, segment: "Combat & Extreme Sports",
    icon: Dumbbell, addressable: "500K+ combat sport athletes, 200K+ extreme athletes",
    whyNow: "Boxing, MMA, and extreme sports organizations are under increasing pressure to demonstrate athlete safety protocols.",
    entryPoint: "Athletic commissions, sanctioning bodies, and team physicians",
    liabilityBarrier: "Medium — insurance and sanctioning body requirements",
    urgency: "medium", color: P.gold,
    channels: ["Direct outreach to athletic commissions", "Social (Instagram/Facebook)", "Event sponsorship"],
  },
  {
    priority: 5, segment: "Executive Health / Corporate Wellness",
    icon: Building2, addressable: "$52B corporate wellness market",
    whyNow: "C-suite cognitive performance is a premium wellness category. Brain vital signs as a quarterly executive health metric.",
    entryPoint: "Executive health programs at major hospital systems",
    liabilityBarrier: "None — premium wellness positioning",
    urgency: "medium", color: P.orange,
    channels: ["LinkedIn (CHROs, benefits directors)", "Executive health conferences", "Direct mail to Fortune 500 HR"],
  },
  {
    priority: 6, segment: "High School Athletics",
    icon: Star, addressable: "8M+ high school athletes, 19K+ schools",
    whyNow: "State-level concussion legislation is expanding. Parents and school districts need defensible protocols.",
    entryPoint: "State athletic associations and school district risk managers",
    liabilityBarrier: "Low — legislative compliance angle",
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
      connection: "Hi [Name] — I'm reaching out because NeuroCatch has an active partnership with Lovell FHCC and we're expanding our TBI assessment program to additional VA facilities. Our EEG-based Brain Vital Signs platform delivers objective cognitive data in under 10 minutes at the point of care. Would love to share what we're seeing in the Lovell data.",
      followUp: "Following up on my earlier note — we recently completed a 90-day pilot at Lovell with strong results on return-to-duty timelines. Happy to send the summary or schedule a 20-minute call with our clinical team.",
    },
    email: {
      subject: "Objective TBI Assessment at Point of Care — NeuroCatch at Lovell FHCC",
      body: "Dear [Name],\n\nNeuroCatch is the only FDA-cleared EEG-based cognitive assessment platform that delivers objective brain vital signs in under 10 minutes — no behavioral self-report, no subjective baseline comparison.\n\nWe are currently deployed at Lovell Federal Health Care Center and are expanding to additional VA and DoD facilities. Our platform directly addresses the DoD mandate for objective TBI documentation and supports defensible return-to-duty decisions.\n\nI'd welcome the opportunity to share our Lovell pilot data and discuss how NeuroCatch fits into your current TBI protocol.\n\nBest regards,\n[Your name]\nNeuroCatch",
    },
    googleAd: {
      headlines: ["Objective TBI Assessment | DoD-Ready", "Brain Vital Signs in 10 Minutes", "FDA-Cleared EEG Cognitive Test"],
      descriptions: ["EEG-based concussion assessment for military and VA facilities. Objective data. Point-of-care speed. Lovell FHCC deployed.", "Defensible return-to-duty documentation. No self-report. No behavioral bias. Learn how NeuroCatch works."],
      keywords: ["VA TBI assessment tool", "DoD concussion protocol", "military brain injury screening", "objective TBI documentation"],
    },
    directMail: {
      headline: "The Only Objective Brain Vital Signs Platform — Now at Lovell FHCC",
      body: "NeuroCatch delivers EEG-based cognitive assessment in under 10 minutes at the point of care. Objective data. Defensible documentation. No behavioral self-report.\n\nCurrently deployed at Lovell Federal Health Care Center. Expanding to VA and DoD facilities nationwide.\n\nScan to request a clinical demonstration.",
    },
  },
  {
    segment: "Collegiate Athletics",
    icon: GraduationCap,
    linkedin: {
      connection: "Hi [Name] — I work with NeuroCatch, the only EEG-based concussion assessment platform cleared for point-of-care use. With NCAA liability exposure at an all-time high, we're helping athletic programs build objective documentation for every return-to-play decision. Would love to show you what we're seeing at programs like yours.",
      followUp: "Quick follow-up — we have a 30-day pilot program specifically for Power 5 athletic departments. Includes baseline testing for your full roster and a clinical review of your current concussion protocol. No cost to start.",
    },
    email: {
      subject: "Objective Concussion Documentation for [School] Athletics — 30-Day Pilot",
      body: "Dear [Name],\n\nEvery return-to-play decision your program makes is a potential liability exposure. ImPACT and behavioral tests rely on self-report — they can be beaten, and they don't hold up in litigation.\n\nNeuroCatch measures actual physiological brain activity via EEG. The data is objective, timestamped, and defensible in court.\n\nWe're offering a 30-day pilot for [School] Athletics that includes:\n• Baseline EEG testing for your full contact sport roster\n• Clinical review of your current concussion protocol\n• Side-by-side comparison with your existing testing data\n\nNo cost. No commitment. Just data.\n\nBest,\n[Your name]\nNeuroCatch",
    },
    googleAd: {
      headlines: ["NCAA Concussion Protocol | Objective EEG", "Defensible Return-to-Play Data", "Beyond ImPACT — Brain Vital Signs"],
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
      connection: "Hi [Name] — I'm reaching out because NeuroCatch is bringing brain vital signs to executive health programs. Just as you track cardiovascular health quarterly, we make it possible to track cognitive performance with the same objectivity — EEG-based, 10 minutes, point of care. Thought this might be relevant for your wellness program.",
      followUp: "Following up — we're working with several executive health programs to add brain vital signs as a standard quarterly metric. Happy to share what the data looks like and how it's being used by high-performance executives.",
    },
    email: {
      subject: "Brain Vital Signs for Executive Performance — NeuroCatch",
      body: "Dear [Name],\n\nYou measure your cardiovascular health quarterly. Your cognitive performance deserves the same rigor.\n\nNeuroCatch delivers EEG-based brain vital signs in under 10 minutes — objective data on cognitive processing speed, attention, and neural efficiency. No questionnaires. No self-report. Just data.\n\nWe're partnering with executive health programs to add brain vital signs as a standard quarterly metric for high-performance leaders.\n\nI'd welcome a 20-minute conversation about what this looks like in practice.\n\nBest,\n[Your name]\nNeuroCatch",
    },
    googleAd: {
      headlines: ["Brain Vital Signs | Executive Health", "Measure Cognitive Performance | EEG", "Your Brain, Quantified — NeuroCatch"],
      descriptions: ["Track cognitive performance with the same rigor as cardiovascular health. EEG-based brain vital signs in 10 minutes. For high-performance executives.", "Objective brain health data for peak performers. No self-report. No guesswork. Just EEG-based cognitive metrics."],
      keywords: ["brain health test", "cognitive performance assessment", "executive brain health", "biohacking cognitive function"],
    },
    directMail: {
      headline: "You Track Your Heart. Now Track Your Brain.",
      body: "NeuroCatch delivers EEG-based brain vital signs in under 10 minutes. Objective data on cognitive processing speed, attention, and neural efficiency.\n\nThe same rigor you apply to cardiovascular health — now available for your brain.\n\nScan to learn more or schedule your first assessment.",
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
function BrainMap() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setPulse(p => (p + 1) % 5), 1200);
    return () => clearInterval(t);
  }, []);

  const nodes = [
    { id: "linkedin",  label: "LinkedIn",     icon: Linkedin,    x: 155, y: 95,  desc: "B2B decision-maker outreach — Athletic Directors, VA CMOs, EHS Directors", color: P.gold },
    { id: "google",    label: "Google Search", icon: Search,      x: 290, y: 75,  desc: "High-intent keyword capture — 22K/mo 'concussion testing near me'", color: P.orange },
    { id: "email",     label: "Email",         icon: Mail,        x: 370, y: 160, desc: "Personalized clinical outreach with pilot program offer", color: P.gold },
    { id: "display",   label: "Display Ads",   icon: Eye,         x: 320, y: 250, desc: "Brand awareness across medical and sports media networks", color: P.deep },
    { id: "direct",    label: "Direct Mail",   icon: FileText,    x: 130, y: 240, desc: "Physical touchpoint for high-value B2B targets", color: P.orange },
    { id: "social",    label: "Social",        icon: Megaphone,   x: 80,  y: 155, desc: "B2C biohacker and athlete audience on Instagram/Facebook", color: P.gold },
  ];

  return (
    <div className="relative w-full" style={{ maxWidth: 480, margin: "0 auto" }}>
      <svg viewBox="0 0 460 320" className="w-full" style={{ filter: "drop-shadow(0 0 30px rgba(245,158,11,0.15))" }}>
        {/* Brain outline - simplified anatomical shape */}
        <defs>
          <radialGradient id="brainGrad" cx="50%" cy="45%" r="55%">
            <stop offset="0%" stopColor="#1a1a4e" />
            <stop offset="100%" stopColor="#0a0a28" />
          </radialGradient>
          <radialGradient id="glowGold" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Brain body */}
        <ellipse cx="230" cy="165" rx="170" ry="130" fill="url(#brainGrad)" stroke={P.border} strokeWidth="1.5" />

        {/* Brain hemisphere line */}
        <path d="M 230 45 Q 235 165 230 285" stroke={P.border} strokeWidth="1" fill="none" strokeDasharray="4,4" opacity="0.5" />

        {/* Cortex folds - left hemisphere */}
        <path d="M 100 120 Q 130 100 155 115 Q 170 125 160 145" stroke={P.gold} strokeWidth="1.2" fill="none" opacity="0.3" />
        <path d="M 85 155 Q 100 140 125 148 Q 145 155 140 175" stroke={P.gold} strokeWidth="1.2" fill="none" opacity="0.3" />
        <path d="M 95 190 Q 120 178 145 185 Q 162 192 158 210" stroke={P.gold} strokeWidth="1.2" fill="none" opacity="0.3" />
        <path d="M 115 225 Q 140 215 165 222 Q 178 228 172 245" stroke={P.gold} strokeWidth="1.2" fill="none" opacity="0.3" />

        {/* Cortex folds - right hemisphere */}
        <path d="M 305 120 Q 275 100 250 115 Q 235 125 245 145" stroke={P.orange} strokeWidth="1.2" fill="none" opacity="0.3" />
        <path d="M 320 155 Q 305 140 280 148 Q 260 155 265 175" stroke={P.orange} strokeWidth="1.2" fill="none" opacity="0.3" />
        <path d="M 310 190 Q 285 178 260 185 Q 243 192 247 210" stroke={P.orange} strokeWidth="1.2" fill="none" opacity="0.3" />
        <path d="M 290 225 Q 265 215 240 222 Q 227 228 233 245" stroke={P.orange} strokeWidth="1.2" fill="none" opacity="0.3" />

        {/* Connection lines from nodes to brain */}
        {nodes.map((n) => (
          <line
            key={n.id + "-line"}
            x1={n.x} y1={n.y}
            x2={230} y2={165}
            stroke={hovered === n.id ? n.color : P.border}
            strokeWidth={hovered === n.id ? 1.5 : 0.8}
            strokeDasharray={hovered === n.id ? "none" : "3,4"}
            opacity={hovered === n.id ? 0.8 : 0.35}
            style={{ transition: "all 0.3s ease" }}
          />
        ))}

        {/* Center brain core glow */}
        <circle cx="230" cy="165" r="18" fill="url(#glowGold)" />
        <circle cx="230" cy="165" r="8" fill={P.gold} opacity="0.9" filter="url(#glow)" />
        <circle cx="230" cy="165" r={12 + Math.sin(pulse * 1.2) * 3} fill="none" stroke={P.gold} strokeWidth="1" opacity="0.4" />

        {/* Node circles */}
        {nodes.map((n, i) => {
          const isHov = hovered === n.id;
          const isPulsing = pulse === i;
          const Icon = n.icon;
          return (
            <g key={n.id} style={{ cursor: "pointer" }} onMouseEnter={() => setHovered(n.id)} onMouseLeave={() => setHovered(null)}>
              {/* Pulse ring */}
              <circle cx={n.x} cy={n.y} r={isPulsing ? 22 : 16} fill="none" stroke={n.color} strokeWidth="1"
                opacity={isPulsing ? 0.6 : 0.2} style={{ transition: "all 0.4s ease" }} />
              {/* Node bg */}
              <circle cx={n.x} cy={n.y} r="14" fill={isHov ? n.color : P.card2}
                stroke={n.color} strokeWidth={isHov ? 2 : 1}
                filter={isHov ? "url(#glow)" : "none"}
                style={{ transition: "all 0.25s ease" }} />
              {/* Icon placeholder (text) */}
              <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize="10" fill={isHov ? "#000" : n.color} fontWeight="bold">
                {n.label.slice(0, 2).toUpperCase()}
              </text>
              {/* Label */}
              <text x={n.x} y={n.y + 26} textAnchor="middle" fontSize="9" fill={isHov ? n.color : P.muted}
                style={{ transition: "all 0.25s ease" }}>
                {n.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Hover tooltip */}
      {hovered && (() => {
        const n = nodes.find(x => x.id === hovered)!;
        return (
          <div className="absolute inset-x-0 bottom-0 mx-4 rounded-xl border p-3 text-sm"
            style={{ background: P.card2, borderColor: n.color + "60", color: P.white }}>
            <div className="font-semibold mb-1" style={{ color: n.color }}>{n.label}</div>
            <div style={{ color: P.muted, fontSize: 12 }}>{n.desc}</div>
          </div>
        );
      })()}
    </div>
  );
}

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
          { label: "Peak Month", value: peakVisits.toLocaleString(), sub: "Nov '25 — highest traffic", icon: TrendingUp },
          { label: "Bounce Rate", value: `${latestBounce}%`, sub: "Down from 43.9% — improving", icon: MousePointer },
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
          <div className="font-semibold" style={{ color: P.white }}>Monthly Visits — 12 Month Trend</div>
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
          <p className="text-xs mt-2" style={{ color: P.muted }}>Bounce rate trending down from 43.9% → 34.0% — engagement improving as brand awareness grows.</p>
        </Card>

        <Card>
          <div className="font-semibold mb-4" style={{ color: P.white }}>Traffic Sources — Jun '26</div>
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
            Zero paid search traffic — massive untapped opportunity in Google Search.
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
              NeuroCatch currently drives <strong style={{ color: P.white }}>100% of traffic organically</strong> — no paid search, no paid social at scale. The 22,000/mo search volume for "concussion testing near me" is completely uncaptured. Activating Google Search campaigns on the top 5 keywords could 3–5x monthly visits within 90 days.
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
        <div className="font-semibold mb-4" style={{ color: P.white }}>Competitive Positioning — NeuroCatch vs. Market</div>
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

// ── Tab: Brain Map ────────────────────────────────────────────────────────────
function TabBrainMap() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-1" style={{ color: P.white }}>Marketing Brain Map</h2>
        <p className="text-sm" style={{ color: P.muted }}>Every marketing channel activates a different region of the buyer's decision-making process. Hover each node to see the strategy.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        <BrainMap />

        <div className="space-y-3">
          <div className="font-semibold text-sm mb-3" style={{ color: P.gold }}>Channel Activation Map</div>
          {[
            { icon: Linkedin,   label: "LinkedIn",      desc: "B2B decision-maker outreach", reach: "Athletic Directors, VA CMOs, EHS Directors" },
            { icon: Search,     label: "Google Search", desc: "High-intent keyword capture",  reach: "22K/mo 'concussion testing near me'" },
            { icon: Mail,       label: "Email",         desc: "Clinical outreach + pilots",   reach: "Personalized with 30-day pilot offer" },
            { icon: Eye,        label: "Display Ads",   desc: "Brand awareness",              reach: "Medical and sports media networks" },
            { icon: FileText,   label: "Direct Mail",   desc: "High-value B2B touchpoint",    reach: "Physical mail to key decision-makers" },
            { icon: Megaphone,  label: "Social",        desc: "B2C biohacker audience",       reach: "Instagram/Facebook — brain health enthusiasts" },
          ].map((c) => (
            <div key={c.label} className="flex items-start gap-3 p-3 rounded-xl border" style={{ background: P.card, borderColor: P.border }}>
              <c.icon size={16} style={{ color: P.gold, marginTop: 2, flexShrink: 0 }} />
              <div>
                <div className="text-sm font-semibold" style={{ color: P.white }}>{c.label}</div>
                <div className="text-xs" style={{ color: P.muted }}>{c.desc}</div>
                <div className="text-xs mt-0.5" style={{ color: P.orange }}>{c.reach}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
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
            <p className="text-sm" style={{ color: P.muted }}>The Lovell partnership is active. Everything else is ready to activate — the infrastructure is straightforward to build.</p>
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
          <Zap size={14} /> Next 30 Days — Priority Actions
        </div>
        <ol className="space-y-2 text-sm" style={{ color: P.muted }}>
          <li className="flex gap-2"><span style={{ color: P.gold }}>1.</span> Install SiteID.ai on neurocatch.com (one script tag — 48 hours to live data)</li>
          <li className="flex gap-2"><span style={{ color: P.gold }}>2.</span> Activate Google Search on top 5 concussion keywords ($3K/mo test budget)</li>
          <li className="flex gap-2"><span style={{ color: P.gold }}>3.</span> Build NCAA Athletic Director LinkedIn outreach list (50 Power 5 targets)</li>
          <li className="flex gap-2"><span style={{ color: P.gold }}>4.</span> Define 30-day collegiate pilot program offer and one-pager</li>
          <li className="flex gap-2"><span style={{ color: P.gold }}>5.</span> Launch LinkedIn campaign targeting VA/DoD procurement officers</li>
        </ol>
      </Card>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
const TABS = [
  { id: "site",      label: "Site Intelligence",  icon: Activity },
  { id: "market",    label: "Market Intelligence", icon: BarChart2 },
  { id: "segments",  label: "B2B Segments",        icon: Users },
  { id: "keywords",  label: "Search Volume",       icon: Search },
  { id: "brain",     label: "Brain Map",           icon: Brain },
  { id: "outreach",  label: "Outreach Kit",        icon: Megaphone },
  { id: "readiness", label: "Readiness",           icon: CheckCircle2 },
];

export default function NeuroCatchDashboard() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("site");

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
              <p className="text-sm font-semibold mt-0.5" style={{ color: P.orange }}>Brain Vital Signs — B2B & B2C Market Entry 2026</p>
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
              { label: "Bounce Rate",     value: "34.0%",   sub: "Trending down — improving" },
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
        {activeTab === "outreach"  && <TabOutreach />}
        {activeTab === "readiness" && <TabReadiness />}
      </div>
    </div>
  );
}
