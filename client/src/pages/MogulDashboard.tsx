import { useState, useEffect, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

// ── Brand colors ──────────────────────────────────────────────────────────────
const C = {
  bg:      "#060810",
  card:    "#0c0e1a",
  card2:   "#111428",
  border:  "#1a1e38",
  gold:    "#f59e0b",
  amber:   "#fbbf24",
  purple:  "#8b5cf6",
  purpleL: "#a78bfa",
  teal:    "#14b8a6",
  green:   "#10b981",
  red:     "#ef4444",
  white:   "#f1f5f9",
  muted:   "#64748b",
  tier0:   "#f59e0b",
  tier2:   "#14b8a6",
  tier3:   "#8b5cf6",
};

const TABS = [
  { id: "opportunity", label: "The Opportunity" },
  { id: "search",      label: "Live Investor Search" },
  { id: "siteid",      label: "Site Visitor ID" },
  { id: "roi",         label: "ROI Calculator" },
  { id: "pricing",     label: "Pricing" },
];

function useCountUp(target: number, duration = 1.4) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, v => Math.round(v));
  useEffect(() => {
    const controls = animate(count, target, { duration, ease: "easeOut" });
    return controls.stop;
  }, [target]);
  return rounded;
}

function SL({ children, color }: { children: React.ReactNode; color?: string }) {
  return (
    <div className="text-xs font-black tracking-widest mb-3" style={{ color: color || C.gold }}>
      {children}
    </div>
  );
}

function IbBadge({ score }: { score: number }) {
  const color = score >= 90 ? C.gold : score >= 80 ? C.teal : C.purpleL;
  const label = score >= 90 ? "HOT" : score >= 80 ? "STRONG" : "ACTIVE";
  return (
    <div className="flex items-center gap-1.5">
      <div className="text-lg font-black" style={{ color }}>{score}</div>
      <div className="text-xs font-black px-1.5 py-0.5 rounded" style={{ background: `${color}20`, color }}>{label}</div>
    </div>
  );
}

function SqlTierBadge({ tier }: { tier: string }) {
  const map: Record<string, { color: string; label: string }> = {
    "Tier 0": { color: C.gold,   label: "TIER 0 — ACCREDITED" },
    "Tier 3": { color: C.purple, label: "TIER 3 — $50K+" },
    "Tier 2": { color: C.teal,   label: "TIER 2 — $30K+" },
  };
  const m = map[tier] || { color: C.muted, label: tier };
  return (
    <span className="text-xs font-black px-2 py-0.5 rounded-full" style={{ background: `${m.color}20`, color: m.color, border: `1px solid ${m.color}40` }}>
      {m.label}
    </span>
  );
}

// ── INVESTOR DATA POOL ────────────────────────────────────────────────────────
const INVESTOR_POOL = [
  {
    name: "Dennis Kasper",
    location: "Medina, OH",
    ib: 97.6,
    income: "$200K\u2013$250K+",
    vantage: 767,
    availableCapital: "$85K\u2013$200K",
    dti: "18%",
    sqlTier: "Tier 0",
    searchTerms: ["passive real estate income", "real estate investment platform", "accredited investor opportunities"],
    email: "syvivacious@gmail.com",
    phone: "",
    jobTitle: "Managing Director Information Technology",
    company: "Clearstead Advisory Solutions",
    category: ["OH", "real-estate", "tier0"],
  },
  {
    name: "Michael Walstien",
    location: "Minneapolis, MN",
    ib: 95.9,
    income: "$200K\u2013$250K+",
    vantage: 767,
    availableCapital: "$85K\u2013$200K",
    dti: "34%",
    sqlTier: "Tier 0",
    searchTerms: ["passive real estate income", "real estate investment platform", "accredited investor opportunities"],
    email: "walstien@hotmail.com",
    phone: "",
    jobTitle: "Financial Advisor - Managing Director",
    company: "Ameriprise Financial Services, Llc",
    category: ["MN", "real-estate", "tier0"],
  },
  {
    name: "Glen Ahearn",
    location: "Eatontown, NJ",
    ib: 95.9,
    income: "$200K\u2013$250K+",
    vantage: 767,
    availableCapital: "$85K\u2013$200K",
    dti: "18%",
    sqlTier: "Tier 0",
    searchTerms: ["passive real estate income", "accredited investor opportunities", "fractional real estate investing"],
    email: "glensheri@aol.com",
    phone: "",
    jobTitle: "Avp",
    company: "Citibank N.A. (California)",
    category: ["NJ", "real-estate", "tier0"],
  },
  {
    name: "Michael Simmons",
    location: "ME",
    ib: 95.9,
    income: "$200K\u2013$250K+",
    vantage: 767,
    availableCapital: "$85K\u2013$200K",
    dti: "18%",
    sqlTier: "Tier 0",
    searchTerms: ["passive real estate income", "real estate investment platform", "accredited investor opportunities"],
    email: "wildcat0520@yahoo.com",
    phone: "",
    jobTitle: "Managing Director, Partner",
    company: "Hightower Advisors",
    category: ["ME", "real-estate", "tier0"],
  },
  {
    name: "Joanne Cross",
    location: "Plano, TX",
    ib: 95.9,
    income: "$200K\u2013$250K+",
    vantage: 767,
    availableCapital: "$85K\u2013$200K",
    dti: "34%",
    sqlTier: "Tier 0",
    searchTerms: ["passive real estate income", "real estate investment platform", "accredited investor opportunities"],
    email: "jcross326@gmail.com",
    phone: "",
    jobTitle: "Managing Director",
    company: "Barings",
    category: ["TX", "real-estate", "tier0"],
  },
  {
    name: "Thuy Mauer",
    location: "Bainbridge Island, WA",
    ib: 95.9,
    income: "$200K\u2013$250K+",
    vantage: 767,
    availableCapital: "$85K\u2013$200K",
    dti: "18%",
    sqlTier: "Tier 0",
    searchTerms: ["passive real estate income", "real estate investment platform", "accredited investor opportunities"],
    email: "mauerll@yahoo.com",
    phone: "",
    jobTitle: "Head Pa Golf Professional",
    company: "Philadelphia Pga Junior Tour",
    category: ["WA", "real-estate", "tier0"],
  },
  {
    name: "Fanny Tan",
    location: "Chicago, IL",
    ib: 95.1,
    income: "$200K\u2013$250K+",
    vantage: 767,
    availableCapital: "$85K\u2013$200K",
    dti: "34%",
    sqlTier: "Tier 0",
    searchTerms: ["passive real estate income", "accredited investor opportunities", "fractional real estate investing"],
    email: "mcren@hotmail.com",
    phone: "",
    jobTitle: "Associate Managing Director",
    company: "Cibc",
    category: ["IL", "real-estate", "tier0"],
  },
  {
    name: "Jeffrey Capossela",
    location: "Scarsdale, NY",
    ib: 95.1,
    income: "$200K\u2013$250K+",
    vantage: 767,
    availableCapital: "$85K\u2013$200K",
    dti: "34%",
    sqlTier: "Tier 0",
    searchTerms: ["passive real estate income", "real estate investment platform", "accredited investor opportunities"],
    email: "jeffreycapossela@gmail.com",
    phone: "",
    jobTitle: "Director Of Ad Operations",
    company: "Eightbar",
    category: ["NY", "real-estate", "tier0"],
  },
  {
    name: "Vincent Devito",
    location: "Cos Cob, CT",
    ib: 95.1,
    income: "$200K\u2013$250K+",
    vantage: 767,
    availableCapital: "$85K\u2013$200K",
    dti: "34%",
    sqlTier: "Tier 0",
    searchTerms: ["passive real estate income", "real estate investment platform", "accredited investor opportunities"],
    email: "inoasamir@gmail.com",
    phone: "",
    jobTitle: "Managing Director",
    company: "Quaestor Advisors",
    category: ["CT", "real-estate", "tier0"],
  },
  {
    name: "Diane Bowerman",
    location: "Palisade, CO",
    ib: 94.3,
    income: "$200K\u2013$250K+",
    vantage: 767,
    availableCapital: "$85K\u2013$200K",
    dti: "34%",
    sqlTier: "Tier 0",
    searchTerms: ["passive real estate income", "real estate investment platform", "accredited investor opportunities"],
    email: "dcbowerman@aol.com",
    phone: "",
    jobTitle: "Head Patternmaker",
    company: "Susana Monaco",
    category: ["CO", "real-estate", "tier0"],
  },
  {
    name: "Lynn Doonan",
    location: "Stamford, CT",
    ib: 94.3,
    income: "$200K\u2013$250K+",
    vantage: 767,
    availableCapital: "$85K\u2013$200K",
    dti: "34%",
    sqlTier: "Tier 0",
    searchTerms: ["passive real estate income", "real estate investment platform", "accredited investor opportunities"],
    email: "lynndoonan@gmail.com",
    phone: "",
    jobTitle: "Vp",
    company: "Cxloyalty",
    category: ["CT", "real-estate", "tier0"],
  },
  {
    name: "Sarah Green",
    location: "Green Bay, WI",
    ib: 94.3,
    income: "$200K\u2013$250K+",
    vantage: 767,
    availableCapital: "$85K\u2013$200K",
    dti: "34%",
    sqlTier: "Tier 0",
    searchTerms: ["passive real estate income", "real estate investment platform", "accredited investor opportunities"],
    email: "declangreen@hotmail.com",
    phone: "",
    jobTitle: "Vp",
    company: "Pension Inc.",
    category: ["WI", "real-estate", "tier0"],
  },
  {
    name: "Erika Bodell",
    location: "Lancaster, PA",
    ib: 94.3,
    income: "$200K\u2013$250K+",
    vantage: 767,
    availableCapital: "$85K\u2013$200K",
    dti: "18%",
    sqlTier: "Tier 0",
    searchTerms: ["passive real estate income", "real estate investment platform", "accredited investor opportunities"],
    email: "paulb1@aol.com",
    phone: "",
    jobTitle: "Director Of Business Development",
    company: "Tristarr",
    category: ["PA", "real-estate", "tier0"],
  },
  {
    name: "Chris Bianchi",
    location: "VT",
    ib: 94.3,
    income: "$200K\u2013$250K+",
    vantage: 767,
    availableCapital: "$85K\u2013$200K",
    dti: "18%",
    sqlTier: "Tier 0",
    searchTerms: ["passive real estate income", "real estate investment platform", "accredited investor opportunities"],
    email: "bianchijc@gmail.com",
    phone: "",
    jobTitle: "Assistant Head Of School",
    company: "Killington Mountain School",
    category: ["VT", "real-estate", "tier0"],
  },
  {
    name: "Karen Shen",
    location: "South San Francisco, CA",
    ib: 94.3,
    income: "$200K\u2013$250K+",
    vantage: 767,
    availableCapital: "$85K\u2013$200K",
    dti: "34%",
    sqlTier: "Tier 0",
    searchTerms: ["passive real estate income", "real estate investment platform", "accredited investor opportunities"],
    email: "kjshen88@yahoo.com",
    phone: "",
    jobTitle: "Senior Director, Employee And Community Engagement",
    company: "Genentech",
    category: ["CA", "real-estate", "tier0"],
  },
  {
    name: "Stephen Gengaro",
    location: "New York City, NY",
    ib: 94.3,
    income: "$200K\u2013$250K+",
    vantage: 767,
    availableCapital: "$85K\u2013$200K",
    dti: "34%",
    sqlTier: "Tier 0",
    searchTerms: ["passive real estate income", "real estate investment platform", "accredited investor opportunities"],
    email: "sgengaro@gmail.com",
    phone: "",
    jobTitle: "Managing Director - Stifel",
    company: "Stifel Financial Corp.",
    category: ["NY", "real-estate", "tier0"],
  },
  {
    name: "Eran Zur",
    location: "San Francisco, CA",
    ib: 94.3,
    income: "$200K\u2013$250K+",
    vantage: 767,
    availableCapital: "$85K\u2013$200K",
    dti: "34%",
    sqlTier: "Tier 0",
    searchTerms: ["passive real estate income", "real estate investment platform", "accredited investor opportunities"],
    email: "daniellemtzur@gmail.com",
    phone: "",
    jobTitle: "Managing Director",
    company: "Fortress Investment Group",
    category: ["CA", "real-estate", "tier0"],
  },
  {
    name: "George Westphal",
    location: "Pearl River, NY",
    ib: 94.3,
    income: "$200K\u2013$250K+",
    vantage: 767,
    availableCapital: "$85K\u2013$200K",
    dti: "34%",
    sqlTier: "Tier 0",
    searchTerms: ["passive real estate income", "real estate investment platform", "accredited investor opportunities"],
    email: "tina42@hotmail.com",
    phone: "",
    jobTitle: "Director",
    company: "Nice-Pak Products, Inc.",
    category: ["NY", "real-estate", "tier0"],
  },
  {
    name: "Stuart Willner",
    location: "Norton, OH",
    ib: 94.3,
    income: "$200K\u2013$250K+",
    vantage: 767,
    availableCapital: "$85K\u2013$200K",
    dti: "34%",
    sqlTier: "Tier 0",
    searchTerms: ["passive real estate income", "real estate investment platform", "accredited investor opportunities"],
    email: "stuartwillner@gmail.com",
    phone: "",
    jobTitle: "Vp",
    company: "Veritiv",
    category: ["OH", "real-estate", "tier0"],
  },
  {
    name: "Lauren Mazzari",
    location: "Montclair, NJ",
    ib: 93.5,
    income: "$200K\u2013$250K+",
    vantage: 767,
    availableCapital: "$85K\u2013$200K",
    dti: "18%",
    sqlTier: "Tier 0",
    searchTerms: ["passive real estate income", "real estate investment platform", "accredited investor opportunities"],
    email: "laurenmazzari@yahoo.com",
    phone: "",
    jobTitle: "Manager",
    company: "Lacordaire Academy",
    category: ["NJ", "real-estate", "tier0"],
  },
  {
    name: "Andrew Stivers",
    location: "Bethesda, MD",
    ib: 93.5,
    income: "$200K\u2013$250K+",
    vantage: 767,
    availableCapital: "$85K\u2013$200K",
    dti: "34%",
    sqlTier: "Tier 0",
    searchTerms: ["passive real estate income", "real estate investment platform", "accredited investor opportunities"],
    email: "andrew.stivers@gmail.com",
    phone: "",
    jobTitle: "Managing Director",
    company: "Nera",
    category: ["MD", "real-estate", "tier0"],
  },
  {
    name: "Cecil Crain",
    location: "Jenks, OK",
    ib: 93.5,
    income: "$200K\u2013$250K+",
    vantage: 767,
    availableCapital: "$85K\u2013$200K",
    dti: "34%",
    sqlTier: "Tier 0",
    searchTerms: ["passive real estate income", "real estate investment platform", "accredited investor opportunities"],
    email: "dakota8459@aol.com",
    phone: "",
    jobTitle: "President & Sales Engineer",
    company: "Air Comfort Inc",
    category: ["OK", "real-estate", "tier0"],
  },
  {
    name: "Christy Silvanic",
    location: "San Francisco, TX",
    ib: 93.5,
    income: "$200K\u2013$250K+",
    vantage: 767,
    availableCapital: "$85K\u2013$200K",
    dti: "34%",
    sqlTier: "Tier 0",
    searchTerms: ["passive real estate income", "real estate investment platform", "accredited investor opportunities"],
    email: "silvanic@hotmail.com",
    phone: "",
    jobTitle: "Managing Director Finance",
    company: "Charles Schwab",
    category: ["TX", "real-estate", "tier0"],
  },
  {
    name: "Patrick Kaser",
    location: "Hockessin, DE",
    ib: 92.7,
    income: "$200K\u2013$250K+",
    vantage: 686,
    availableCapital: "$85K\u2013$200K",
    dti: "34%",
    sqlTier: "Tier 0",
    searchTerms: ["passive real estate income", "accredited investor opportunities", "fractional real estate investing"],
    email: "rockyhillside@gmail.com",
    phone: "",
    jobTitle: "Managing Director And Portfolio Manager",
    company: "Brandywine Global Investment Management",
    category: ["DE", "real-estate", "tier0"],
  },
  {
    name: "Barbara Wolf",
    location: "Minneapolis, MN",
    ib: 92.7,
    income: "$200K\u2013$250K+",
    vantage: 686,
    availableCapital: "$85K\u2013$200K",
    dti: "34%",
    sqlTier: "Tier 0",
    searchTerms: ["passive real estate income", "accredited investor opportunities", "fractional real estate investing"],
    email: "kandbwolf@aol.com",
    phone: "",
    jobTitle: "Head Equity Trader",
    company: "U.S. Bank",
    category: ["MN", "real-estate", "tier0"],
  },
  {
    name: "Brandon Dean",
    location: "Dallas, TX",
    ib: 92.7,
    income: "$200K\u2013$250K+",
    vantage: 686,
    availableCapital: "$85K\u2013$200K",
    dti: "34%",
    sqlTier: "Tier 0",
    searchTerms: ["real estate investment platform", "Fundrise alternative", "passive income real estate"],
    email: "brandonjdean@gmail.com",
    phone: "",
    jobTitle: "President",
    company: "Avio Consulting",
    category: ["TX", "real-estate", "tier0"],
  },
  {
    name: "Brent Willman",
    location: "Hamilton, OH",
    ib: 92.7,
    income: "$200K\u2013$250K+",
    vantage: 686,
    availableCapital: "$85K\u2013$200K",
    dti: "34%",
    sqlTier: "Tier 0",
    searchTerms: ["real estate investment platform", "Fundrise alternative", "passive income real estate"],
    email: "btwillman6@gmail.com",
    phone: "",
    jobTitle: "Director Of Site Reliability Engineering",
    company: "Constructconnect",
    category: ["OH", "real-estate", "tier0"],
  },
  {
    name: "Joanne Morreale",
    location: "Cranford, NJ",
    ib: 92.7,
    income: "$200K\u2013$250K+",
    vantage: 686,
    availableCapital: "$85K\u2013$200K",
    dti: "34%",
    sqlTier: "Tier 0",
    searchTerms: ["passive real estate income", "real estate investment platform", "accredited investor opportunities"],
    email: "joannemorreale1@gmail.com",
    phone: "",
    jobTitle: "Managing Director",
    company: "Nexthome Empire",
    category: ["NJ", "real-estate", "tier0"],
  },
  {
    name: "Michael Diller",
    location: "Salisbury, MD",
    ib: 92.7,
    income: "$200K\u2013$250K+",
    vantage: 686,
    availableCapital: "$85K\u2013$200K",
    dti: "34%",
    sqlTier: "Tier 0",
    searchTerms: ["passive real estate income", "real estate investment platform", "accredited investor opportunities"],
    email: "mldiller@yahoo.com",
    phone: "",
    jobTitle: "Mobilization Associate Director",
    company: "Accenture",
    category: ["MD", "real-estate", "tier0"],
  },
  {
    name: "Kevin Lockert",
    location: "Alpharetta, GA",
    ib: 92.7,
    income: "$200K\u2013$250K+",
    vantage: 686,
    availableCapital: "$85K\u2013$200K",
    dti: "34%",
    sqlTier: "Tier 0",
    searchTerms: ["real estate investment platform", "Fundrise alternative", "passive income real estate"],
    email: "k_lockert@yahoo.com",
    phone: "",
    jobTitle: "Svp - Americas",
    company: "Energy Exemplar",
    category: ["GA", "real-estate", "tier0"],
  },
];

// ── SITE VISITOR DATA ─────────────────────────────────────────────────────────
const SITE_VISITORS = [
  {
    name: "Kevin L.",
    location: "Austin, TX",
    pagesViewed: ["Properties", "Short-Term Rentals", "How It Works"],
    timeOnSite: "6m 42s",
    visits: 3,
    income: "$220K",
    vantage: 734,
    sqlTier: "Tier 3",
    email: "k.larson@gmail.com",
    phone: "(512) 334-7821",
    lastSeen: "2h ago",
  },
  {
    name: "Patricia M.",
    location: "Dallas, TX",
    pagesViewed: ["Properties", "Investor FAQ", "Sign Up"],
    timeOnSite: "11m 18s",
    visits: 5,
    income: "$310K",
    vantage: 762,
    sqlTier: "Tier 0",
    email: "p.morgan@outlook.com",
    phone: "(214) 778-4412",
    lastSeen: "4h ago",
  },
  {
    name: "Daniel R.",
    location: "Miami, FL",
    pagesViewed: ["Long-Term Rentals", "Returns Calculator", "Properties"],
    timeOnSite: "8m 55s",
    visits: 2,
    income: "$185K",
    vantage: 718,
    sqlTier: "Tier 2",
    email: "d.rivera@gmail.com",
    phone: "(305) 551-9934",
    lastSeen: "6h ago",
  },
  {
    name: "Susan T.",
    location: "New York, NY",
    pagesViewed: ["Properties", "About", "Investor FAQ", "Sign Up"],
    timeOnSite: "14m 02s",
    visits: 7,
    income: "$395K",
    vantage: 778,
    sqlTier: "Tier 0",
    email: "s.taylor@gmail.com",
    phone: "(212) 445-6637",
    lastSeen: "1h ago",
  },
  {
    name: "Brian C.",
    location: "Los Angeles, CA",
    pagesViewed: ["Short-Term Rentals", "Properties"],
    timeOnSite: "3m 14s",
    visits: 1,
    income: "$245K",
    vantage: 741,
    sqlTier: "Tier 3",
    email: "b.clark@icloud.com",
    phone: "(310) 882-3318",
    lastSeen: "8h ago",
  },
];

// ── TAB: OPPORTUNITY ──────────────────────────────────────────────────────────
function TabOpportunity() {
  const stats = [
    { label: "Assets Under Management", value: 90, suffix: "M", prefix: "$", color: C.gold },
    { label: "Platform Users",           value: 35000, suffix: "+", prefix: "", color: C.teal },
    { label: "Average IRR",              value: 18.8, suffix: "%", prefix: "", color: C.green },
    { label: "Seed Round Raised",        value: 3.6, suffix: "M", prefix: "$", color: C.purpleL },
  ];

  const funnelData = [
    { name: "Intent Only", value: 1000, color: C.gold },
    { name: "Income $150K+", value: 620, color: C.amber },
    { name: "VantageScore 700+", value: 390, color: C.teal },
    { name: "SQL Tier 2+", value: 210, color: C.purple },
    { name: "SQL Tier 3+", value: 95, color: C.purpleL },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <SL>MOGUL CLUB — CAPITAL FORMATION INTELLIGENCE</SL>
        <div className="text-lg font-black mb-2" style={{ color: C.white }}>
          Finding Accredited Investors Before Anyone Else Does
        </div>
        <div className="text-sm leading-relaxed" style={{ color: C.white }}>
          Mogul Club has $90M in assets, 35,000+ users, and properties yielding 15–20% IRR. Their #1 challenge is capital formation at scale — finding real accredited investors who are actively in-market right now, with verified income and financial readiness. That's exactly what Exact Audience delivers.
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map((s, i) => {
          const count = useCountUp(s.value, 1.6);
          return (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl p-4 text-center relative overflow-hidden"
              style={{ background: C.card2, border: `1px solid ${s.color}30`, boxShadow: `0 0 20px ${s.color}08` }}>
              <div className="absolute inset-0 opacity-5 rounded-xl" style={{ background: `radial-gradient(circle at 50% 50%, ${s.color}, transparent 70%)` }} />
              <div className="text-2xl font-black relative" style={{ color: s.color }}>
                {s.prefix}<motion.span>{count}</motion.span>{s.suffix}
              </div>
              <div className="text-xs mt-1 font-semibold relative" style={{ color: C.muted }}>{s.label}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Three layers */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <SL>THE THREE-LAYER QUALIFIED INVESTOR LEAD</SL>
        {[
          { num: "01", label: "Intent Layer", desc: "Real people actively searching for fractional real estate investing, passive real estate income, accredited investor opportunities — right now.", color: C.gold },
          { num: "02", label: "Financial Readiness", desc: "Soft-credit pre-screen: VantageScore, verified income, DTI, available capital. No SSN required. Every lead is financially verified before delivery.", color: C.teal },
          { num: "03", label: "SQL Routing", desc: "Every lead tagged SQL or NQL and tiered by buying power. Larry's team only sees Tier 2+ — people with $30K+ accessible capital ready to invest.", color: C.purpleL },
        ].map((l, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
            className="flex gap-4 mb-4 last:mb-0">
            <div className="text-3xl font-black shrink-0 w-8 text-right" style={{ color: `${l.color}40` }}>{l.num}</div>
            <div>
              <div className="font-black mb-1" style={{ color: l.color }}>{l.label}</div>
              <div className="text-sm leading-relaxed" style={{ color: C.white }}>{l.desc}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Qualification funnel chart */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <SL>QUALIFICATION FUNNEL — FROM INTENT TO SQL</SL>
        <div className="text-xs mb-4" style={{ color: C.muted }}>Starting from 1,000 active real estate intent signals</div>
        <div className="space-y-2">
          {funnelData.map((d, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 + i * 0.1 }}>
              <div className="flex justify-between text-xs mb-1">
                <span style={{ color: d.color }} className="font-semibold">{d.name}</span>
                <span style={{ color: C.muted }}>{d.value.toLocaleString()} leads</span>
              </div>
              <div className="h-5 rounded-lg overflow-hidden" style={{ background: C.card2 }}>
                <motion.div className="h-full rounded-lg"
                  style={{ background: `linear-gradient(90deg, ${d.color}60, ${d.color}90)` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(d.value / 1000) * 100}%` }}
                  transition={{ delay: 0.6 + i * 0.1, duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-4 p-3 rounded-xl text-center" style={{ background: `${C.purple}15`, border: `1px solid ${C.purple}30` }}>
          <div className="text-xs font-black" style={{ color: C.purpleL }}>LARRY ONLY SEES THE BOTTOM TWO TIERS</div>
          <div className="text-xs mt-1" style={{ color: C.muted }}>95–210 pre-qualified accredited investor prospects per 1,000 intent signals</div>
        </div>
      </motion.div>
    </div>
  );
}

// ── TAB: LIVE INVESTOR SEARCH ─────────────────────────────────────────────────
type Investor = typeof INVESTOR_POOL[0];

function VantageCountUp({ target, started }: { target: number; started: boolean }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, v => Math.round(v));
  useEffect(() => {
    if (!started) return;
    const controls = animate(count, target, { duration: 1.4, ease: "easeOut" });
    return controls.stop;
  }, [started, target]);
  if (!started) return <span>—</span>;
  return <motion.span>{rounded}</motion.span>;
}

function InvestorCard({ inv, idx }: { inv: Investor; idx: number }) {
  const [expanded, setExpanded] = useState(false);
  const [financialLoaded, setFinancialLoaded] = useState(false);

  // Staggered delay per card so they load sequentially in the demo
  useEffect(() => {
    setFinancialLoaded(false);
    const delay = 1400 + idx * 140;
    const t = setTimeout(() => setFinancialLoaded(true), delay);
    return () => clearTimeout(t);
  }, [idx]);

  const dtiNum = parseFloat(inv.dti);
  const dtiColor = dtiNum <= 30 ? C.green : C.amber;
  const vantageColor = inv.vantage >= 750 ? C.green : C.teal;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: idx * 0.12, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="rounded-2xl overflow-hidden cursor-pointer"
      style={{ background: C.card, border: `1px solid ${C.border}` }}
      onClick={() => setExpanded(!expanded)}>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <div className="font-black text-base" style={{ color: C.white }}>{inv.name}</div>
              <SqlTierBadge tier={inv.sqlTier} />
            </div>
            <div className="text-xs" style={{ color: C.muted }}>{inv.location}</div>
            {inv.jobTitle && (
              <div className="text-xs mt-0.5" style={{ color: C.muted }}>
                {inv.jobTitle}{inv.company ? <span style={{ color: `${C.gold}90` }}> @ {inv.company}</span> : ''}
              </div>
            )}
          </div>
          <IbBadge score={inv.ib} />
        </div>

        {/* LeadFi financial pre-screen — two-stage load */}
        <AnimatePresence mode="wait">
          {!financialLoaded ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              {/* Status text */}
              <div className="flex items-center gap-2 mt-3 mb-2">
                <motion.div className="w-1.5 h-1.5 rounded-full" style={{ background: C.teal }}
                  animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity }} />
                <span className="text-xs" style={{ color: C.teal }}>Pulling financial profile...</span>
              </div>
              {/* Shimmer metric cards */}
              <div className="grid grid-cols-3 gap-2">
                {[0, 1, 2].map(i => (
                  <div key={i} className="rounded-lg p-2" style={{ background: C.card2 }}>
                    <Skeleton className="h-4 w-3/4 mx-auto mb-1.5" style={{ background: `${C.border}` }} />
                    <Skeleton className="h-2.5 w-1/2 mx-auto" style={{ background: `${C.border}80` }} />
                  </div>
                ))}
              </div>
              {/* Shimmer DTI bar */}
              <div className="flex items-center gap-2 mt-3">
                <Skeleton className="h-2.5 w-16" style={{ background: `${C.border}` }} />
                <Skeleton className="flex-1 h-1.5 rounded-full" style={{ background: `${C.border}` }} />
              </div>
            </motion.div>
          ) : (
            <motion.div key="loaded" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}>
              {/* Confirmed badge */}
              <div className="flex items-center gap-2 mt-3 mb-2">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <circle cx="5" cy="5" r="5" fill={C.green} fillOpacity="0.25" />
                  <path d="M3 5l1.5 1.5L7 3.5" stroke={C.green} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-xs" style={{ color: C.green }}>Financial profile confirmed</span>
              </div>
              {/* Metric cards */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Income", color: C.gold, content: (
                    <motion.div className="text-sm font-black" style={{ color: C.gold }}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}>
                      {inv.income}
                    </motion.div>
                  )},
                  { label: "VantageScore", color: vantageColor, content: (
                    <div className="text-sm font-black" style={{ color: vantageColor }}>
                      <VantageCountUp target={inv.vantage} started={financialLoaded} />
                    </div>
                  )},
                  { label: "Avail. Capital", color: C.purpleL, content: (
                    <motion.div className="text-sm font-black" style={{ color: C.purpleL }}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
                      {inv.availableCapital}
                    </motion.div>
                  )},
                ].map((m, i) => (
                  <div key={i} className="rounded-lg p-2 text-center" style={{ background: C.card2 }}>
                    {m.content}
                    <div className="text-xs" style={{ color: C.muted }}>{m.label}</div>
                  </div>
                ))}
              </div>
              {/* DTI */}
              <div className="flex items-center gap-2 mt-3">
                <div className="text-xs" style={{ color: C.muted }}>DTI:</div>
                <motion.div className="text-xs font-black" style={{ color: dtiColor }}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                  {inv.dti}
                </motion.div>
                <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: C.card2 }}>
                  <motion.div className="h-full rounded-full"
                    style={{ background: dtiColor }}
                    initial={{ width: 0 }}
                    animate={{ width: inv.dti }}
                    transition={{ delay: 0.25, duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
            className="border-t px-4 pb-4 pt-3 space-y-3" style={{ borderColor: C.border }}>

            {/* Active search terms */}
            <div>
              <div className="text-xs font-black mb-2" style={{ color: C.gold }}>ACTIVE SEARCH TERMS</div>
              <div className="flex flex-wrap gap-1.5">
                {inv.searchTerms.map((t, i) => (
                  <span key={i} className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${C.gold}15`, color: C.gold, border: `1px solid ${C.gold}30` }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Contact info */}
            <div>
              <div className="text-xs font-black mb-2" style={{ color: C.teal }}>VERIFIED CONTACT</div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="text-xs font-semibold w-12" style={{ color: C.muted }}>Email</div>
                  <div className="text-xs font-black" style={{ color: C.white }}>{inv.email}</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-xs font-semibold w-12" style={{ color: C.muted }}>Phone</div>
                  <div className="text-xs font-black" style={{ color: C.white }}>{inv.phone}</div>
                </div>
              </div>
            </div>

            {/* Outreach template */}
            <div>
              <div className="text-xs font-black mb-2" style={{ color: C.purpleL }}>SUGGESTED OUTREACH</div>
              <div className="rounded-xl p-3 text-xs leading-relaxed" style={{ background: C.card2, color: C.white, border: `1px solid ${C.border}` }}>
                Hi {inv.name.split(" ")[0]}, I noticed you've been researching real estate investment platforms recently. Mogul Club offers fractional ownership in institutional-grade properties with 15–20% IRR — no landlord headaches, no large minimums. Happy to send you our current property portfolio. Worth a quick look?
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function TabSearch() {
  const [state, setState] = useState("all");
  const [sqlTier, setSqlTier] = useState("all");
  const [minIncome, setMinIncome] = useState("150");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Investor[]>([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    setLoading(true);
    setResults([]);
    setSearched(false);
    setTimeout(() => {
      let pool = [...INVESTOR_POOL];
      if (state !== "all") pool = pool.filter(p => p.category.includes(state));
      if (sqlTier !== "all") pool = pool.filter(p => p.category.includes(sqlTier));
      const incomeThreshold = parseInt(minIncome) * 1000;
      // Income filter — handle both "$285K" style and "$200K–$250K+" style
      pool = pool.filter(p => {
        const raw = p.income.replace(/[^0-9]/g, ' ').trim().split(/\s+/)[0];
        const num = parseInt(raw);
        if (isNaN(num)) return true;
        // If value looks like thousands (e.g. 200 from "$200K"), multiply
        const val = num < 1000 ? num * 1000 : num;
        return val >= incomeThreshold;
      });
      pool.sort((a, b) => b.ib - a.ib);
      setResults(pool.slice(0, 8));
      setLoading(false);
      setSearched(true);
    }, 2200);
  };

  return (
    <div className="space-y-4">
      {/* Search form */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <SL>EXACT AUDIENCE — LIVE INVESTOR INTELLIGENCE</SL>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="text-xs font-black mb-1.5 block" style={{ color: C.muted }}>STATE / MARKET</label>
            <select value={state} onChange={e => setState(e.target.value)}
              className="w-full rounded-xl px-3 py-2.5 text-sm font-semibold"
              style={{ background: C.card2, border: `1px solid ${C.border}`, color: C.white }}>
              <option value="all">All Markets</option>
              <option value="TX">Texas</option>
              <option value="FL">Florida</option>
              <option value="CA">California</option>
              <option value="NY">New York</option>
              <option value="DC">Washington DC</option>
              <option value="GA">Georgia</option>
              <option value="CO">Colorado</option>
              <option value="AZ">Arizona</option>
              <option value="IL">Illinois</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-black mb-1.5 block" style={{ color: C.muted }}>SQL TIER</label>
            <select value={sqlTier} onChange={e => setSqlTier(e.target.value)}
              className="w-full rounded-xl px-3 py-2.5 text-sm font-semibold"
              style={{ background: C.card2, border: `1px solid ${C.border}`, color: C.white }}>
              <option value="all">All Tiers</option>
              <option value="tier0">Tier 0 — Accredited ($100K+ income)</option>
              <option value="tier3">Tier 3 — $50K+ accessible capital</option>
              <option value="tier2">Tier 2 — $30K+ accessible capital</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="text-xs font-black mb-1.5 block" style={{ color: C.muted }}>MINIMUM INCOME ($K)</label>
            <div className="flex items-center gap-3">
              <input type="range" min={100} max={400} step={25} value={minIncome}
                onChange={e => setMinIncome(e.target.value)}
                className="flex-1" style={{ accentColor: C.gold }} />
              <div className="text-sm font-black w-16 text-right" style={{ color: C.gold }}>${minIncome}K+</div>
            </div>
          </div>
        </div>
        <button onClick={handleSearch} disabled={loading}
          className="w-full py-3 rounded-xl font-black text-sm tracking-wide transition-all active:scale-95"
          style={{ background: loading ? `${C.gold}40` : `linear-gradient(135deg, ${C.gold}, #d97706)`, color: "#000" }}>
          {loading ? "Scanning Exact Audience Database..." : "Search In-Market Investors"}
        </button>
      </motion.div>

      {/* Loading animation */}
      {loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="rounded-2xl p-6 text-center" style={{ background: C.card, border: `1px solid ${C.border}` }}>
          <div className="flex justify-center gap-2 mb-3">
            {[0, 1, 2].map(i => (
              <motion.div key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: C.gold }}
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }} />
            ))}
          </div>
          <div className="text-sm font-black" style={{ color: C.gold }}>Scanning behavioral signals...</div>
          <div className="text-xs mt-1" style={{ color: C.muted }}>Matching intent data · Verifying income · Running financial pre-screen</div>
        </motion.div>
      )}

      {/* Results */}
      {searched && !loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-black" style={{ color: C.gold }}>{results.length} IN-MARKET INVESTORS FOUND</div>
            <div className="text-xs" style={{ color: C.muted }}>Sorted by I|B Score</div>
          </div>
          <div className="space-y-3">
            {results.map((inv, i) => <InvestorCard key={inv.name} inv={inv} idx={i} />)}
          </div>
          {results.length === 0 && (
            <div className="text-center py-8" style={{ color: C.muted }}>
              No results match these criteria. Try broadening your search.
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

// ── TAB: SITE VISITOR ID ──────────────────────────────────────────────────────
function VisitorCard({ v, idx }: { v: typeof SITE_VISITORS[0]; idx: number }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
      transition={{ delay: idx * 0.1, duration: 0.4 }}
      className="rounded-2xl overflow-hidden cursor-pointer"
      style={{ background: C.card, border: `1px solid ${C.border}` }}
      onClick={() => setExpanded(!expanded)}>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="font-black" style={{ color: C.white }}>{v.name}</div>
              <SqlTierBadge tier={v.sqlTier} />
            </div>
            <div className="text-xs" style={{ color: C.muted }}>{v.location} · Last seen {v.lastSeen}</div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-lg font-black" style={{ color: C.teal }}>{v.visits}</div>
            <div className="text-xs" style={{ color: C.muted }}>visits</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {v.pagesViewed.map((p, i) => (
            <span key={i} className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${C.teal}15`, color: C.teal, border: `1px solid ${C.teal}30` }}>
              {p}
            </span>
          ))}
        </div>
        <div className="flex gap-4 mt-3">
          <div className="text-xs" style={{ color: C.muted }}>Time on site: <span className="font-black" style={{ color: C.white }}>{v.timeOnSite}</span></div>
          <div className="text-xs" style={{ color: C.muted }}>Income: <span className="font-black" style={{ color: C.gold }}>{v.income}</span></div>
        </div>
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
            className="border-t px-4 pb-4 pt-3 space-y-3" style={{ borderColor: C.border }}>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "VantageScore", value: v.vantage.toString(), color: C.teal },
                { label: "SQL Tier", value: v.sqlTier, color: C.purpleL },
              ].map((m, i) => (
                <div key={i} className="rounded-lg p-2 text-center" style={{ background: C.card2 }}>
                  <div className="text-sm font-black" style={{ color: m.color }}>{m.value}</div>
                  <div className="text-xs" style={{ color: C.muted }}>{m.label}</div>
                </div>
              ))}
            </div>
            <div>
              <div className="text-xs font-black mb-2" style={{ color: C.teal }}>VERIFIED CONTACT</div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="text-xs w-12 font-semibold" style={{ color: C.muted }}>Email</div>
                  <div className="text-xs font-black" style={{ color: C.white }}>{v.email}</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-xs w-12 font-semibold" style={{ color: C.muted }}>Phone</div>
                  <div className="text-xs font-black" style={{ color: C.white }}>{v.phone}</div>
                </div>
              </div>
            </div>
            <div>
              <div className="text-xs font-black mb-2" style={{ color: C.purpleL }}>SUGGESTED OUTREACH</div>
              <div className="rounded-xl p-3 text-xs leading-relaxed" style={{ background: C.card2, color: C.white, border: `1px solid ${C.border}` }}>
                Hi {v.name.split(" ")[0]}, I noticed you were checking out our {v.pagesViewed[0]} section on Mogul.club. Thought I'd reach out directly — happy to walk you through our current offerings and answer any questions. What's the best way to connect?
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function TabSiteId() {
  const hourlyData = [
    { h: "8am", v: 4 }, { h: "9am", v: 7 }, { h: "10am", v: 12 }, { h: "11am", v: 9 },
    { h: "12pm", v: 15 }, { h: "1pm", v: 11 }, { h: "2pm", v: 18 }, { h: "3pm", v: 14 },
    { h: "4pm", v: 21 }, { h: "5pm", v: 16 }, { h: "6pm", v: 8 }, { h: "7pm", v: 5 },
  ];

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <SL>MOGUL.CLUB — SITE VISITOR IDENTIFICATION</SL>
        <div className="text-sm leading-relaxed mb-4" style={{ color: C.white }}>
          Mogul.club gets real traffic from Forbes, TechCrunch, and Yahoo Finance coverage. Most visitors browse properties and leave without investing. Exact Audience identifies them — turning anonymous traffic into a callable, emailable investor pipeline.
        </div>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={hourlyData}>
              <defs>
                <linearGradient id="tealGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.teal} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={C.teal} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="h" tick={{ fill: C.muted, fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 11 }} />
              <Area type="monotone" dataKey="v" stroke={C.teal} strokeWidth={2} fill="url(#tealGrad)" name="Visitors" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="text-xs text-center mt-1" style={{ color: C.muted }}>Today's visitor traffic — mogul.club</div>
      </motion.div>

      <div className="flex items-center justify-between">
        <div className="text-xs font-black" style={{ color: C.teal }}>TODAY'S IDENTIFIED VISITORS</div>
        <div className="flex items-center gap-1.5">
          <motion.div className="w-2 h-2 rounded-full" style={{ background: C.green }}
            animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
          <div className="text-xs font-black" style={{ color: C.green }}>LIVE</div>
        </div>
      </div>

      <div className="space-y-3">
        {SITE_VISITORS.map((v, i) => <VisitorCard key={v.name} v={v} idx={i} />)}
      </div>
    </div>
  );
}

// ── TAB: ROI CALCULATOR ───────────────────────────────────────────────────────
function TabRoi() {
  const [leads, setLeads] = useState(50);
  const [closeRate, setCloseRate] = useState(4);
  const [avgInvestment, setAvgInvestment] = useState(10000);
  const [tier, setTier] = useState("financial");

  const pricePerLead = tier === "intent" ? 30 : tier === "financial" ? 87.5 : tier === "sql2" ? 150 : 250;
  const serviceCost = leads * pricePerLead;
  const investors = Math.round(leads * (closeRate / 100));
  const capitalDeployed = investors * avgInvestment;
  const roi = serviceCost > 0 ? ((capitalDeployed - serviceCost) / serviceCost * 100).toFixed(0) : "0";
  const roiMultiple = serviceCost > 0 ? (capitalDeployed / serviceCost).toFixed(1) : "0";

  const barData = [
    { name: "Service Cost", value: serviceCost, color: C.muted },
    { name: "Capital Deployed", value: capitalDeployed, color: C.gold },
  ];

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <SL>ROI CALCULATOR — MOGUL CLUB INVESTOR PIPELINE</SL>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-black mb-1.5 block" style={{ color: C.muted }}>LEAD TYPE</label>
            <select value={tier} onChange={e => setTier(e.target.value)}
              className="w-full rounded-xl px-3 py-2.5 text-sm font-semibold"
              style={{ background: C.card2, border: `1px solid ${C.border}`, color: C.white }}>
              <option value="intent">Intent-Only Lead ($25–$35/lead)</option>
              <option value="financial">Financial Readiness Lead ($75–$100/lead)</option>
              <option value="sql2">SQL Tier 2+ Lead ($125–$175/lead)</option>
              <option value="sql3">SQL Tier 3 Lead ($200–$300/lead)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-black mb-1.5 block" style={{ color: C.muted }}>
              NUMBER OF LEADS: <span style={{ color: C.gold }}>{leads}</span>
            </label>
            <input type="range" min={25} max={500} step={25} value={leads}
              onChange={e => setLeads(parseInt(e.target.value))}
              className="w-full" style={{ accentColor: C.gold }} />
          </div>

          <div>
            <label className="text-xs font-black mb-1.5 block" style={{ color: C.muted }}>
              CLOSE RATE: <span style={{ color: C.teal }}>{closeRate}%</span>
            </label>
            <input type="range" min={1} max={15} step={0.5} value={closeRate}
              onChange={e => setCloseRate(parseFloat(e.target.value))}
              className="w-full" style={{ accentColor: C.teal }} />
          </div>

          <div>
            <label className="text-xs font-black mb-1.5 block" style={{ color: C.muted }}>
              AVG FIRST INVESTMENT: <span style={{ color: C.purpleL }}>${avgInvestment.toLocaleString()}</span>
            </label>
            <input type="range" min={1000} max={50000} step={1000} value={avgInvestment}
              onChange={e => setAvgInvestment(parseInt(e.target.value))}
              className="w-full" style={{ accentColor: C.purpleL }} />
          </div>
        </div>
      </motion.div>

      {/* Results */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Service Cost", value: `$${serviceCost.toLocaleString()}`, color: C.muted },
          { label: "New Investors", value: investors.toString(), color: C.teal },
          { label: "Capital Deployed", value: `$${capitalDeployed.toLocaleString()}`, color: C.gold },
          { label: "ROI Multiple", value: `${roiMultiple}x`, color: capitalDeployed > serviceCost ? C.green : C.red },
        ].map((m, i) => (
          <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-xl p-4 text-center" style={{ background: C.card, border: `1px solid ${m.color}30` }}>
            <div className="text-2xl font-black" style={{ color: m.color }}>{m.value}</div>
            <div className="text-xs mt-1" style={{ color: C.muted }}>{m.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Bar chart */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <SL>COST VS. CAPITAL DEPLOYED</SL>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} barSize={48}>
              <XAxis dataKey="name" tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`}
                contentStyle={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 11 }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {barData.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {capitalDeployed > serviceCost && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="mt-3 p-3 rounded-xl text-center"
            style={{ background: `${C.green}10`, border: `1px solid ${C.green}30` }}>
            <div className="text-xs font-black" style={{ color: C.green }}>
              {roiMultiple}x RETURN ON INVESTMENT
            </div>
            <div className="text-xs mt-0.5" style={{ color: C.muted }}>
              Before repeat investments, management fees, or carried interest
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

// ── TAB: PRICING ──────────────────────────────────────────────────────────────
function TabPricing() {
  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <SL>PILOT OFFER — START HERE</SL>
        <div className="text-center py-4">
          <div className="text-4xl font-black mb-1" style={{ color: C.gold }}>$2,500</div>
          <div className="text-sm font-black mb-3" style={{ color: C.white }}>25 SQL Tier 2+ Leads</div>
          <div className="text-xs leading-relaxed mb-4" style={{ color: C.muted }}>
            Every lead: active real estate investment intent + VantageScore 700+ + verified income $150K+ + $30K+ available capital + DTI under 40%. Delivered within 5 business days.
          </div>
          <div className="p-3 rounded-xl text-xs" style={{ background: `${C.gold}10`, border: `1px solid ${C.gold}30`, color: C.white }}>
            If Larry doesn't close at least one investor in 30 days, we credit the next batch.
          </div>
        </div>
      </motion.div>

      <div className="space-y-3">
        {[
          {
            label: "Intent-Only Lead",
            desc: "Active real estate investor intent, verified contact info, income signal, I|B Score",
            price: "$25–$35",
            unit: "per lead",
            min: "100 leads minimum",
            color: C.amber,
          },
          {
            label: "Financial Readiness Lead",
            desc: "Intent + soft-credit pre-screen: VantageScore, income, DTI, available credit, SQL/NQL tag",
            price: "$75–$100",
            unit: "per lead",
            min: "50 leads minimum",
            color: C.teal,
          },
          {
            label: "SQL Tier 2+ Lead",
            desc: "Intent + financial pre-screen + only SQLs with $30K+ buying power delivered",
            price: "$125–$175",
            unit: "per lead",
            min: "25 leads minimum",
            color: C.purpleL,
          },
          {
            label: "SQL Tier 3 Lead",
            desc: "Intent + financial pre-screen + only SQLs with $50K+ buying power — top 10% of list",
            price: "$200–$300",
            unit: "per lead",
            min: "10 leads minimum",
            color: C.purple,
          },
        ].map((p, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
            className="rounded-2xl p-4" style={{ background: C.card, border: `1px solid ${C.border}`, borderLeft: `4px solid ${p.color}` }}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="font-black mb-1" style={{ color: p.color }}>{p.label}</div>
                <div className="text-xs leading-relaxed mb-1" style={{ color: C.white }}>{p.desc}</div>
                <div className="text-xs" style={{ color: C.muted }}>{p.min}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-lg font-black" style={{ color: p.color }}>{p.price}</div>
                <div className="text-xs" style={{ color: C.muted }}>{p.unit}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Monthly retainer */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <SL color={C.purpleL}>MONTHLY RETAINER — ONGOING INVESTOR PIPELINE</SL>
        <div className="space-y-3">
          {[
            { label: "Starter", desc: "50 Financial Readiness Leads/mo (SQL Tier 2+)", price: "$5,000/mo", color: C.teal },
            { label: "Growth", desc: "100 Financial Readiness Leads/mo (SQL Tier 2+) + site visitor ID", price: "$9,500/mo", color: C.purpleL },
            { label: "Pro", desc: "200 Financial Readiness Leads/mo (SQL Tier 2+) + site visitor ID + ad audience uploads", price: "$17,500/mo", color: C.gold },
          ].map((r, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl" style={{ background: C.card2, border: `1px solid ${r.color}20` }}>
              <div>
                <div className="font-black text-sm" style={{ color: r.color }}>{r.label}</div>
                <div className="text-xs mt-0.5" style={{ color: C.muted }}>{r.desc}</div>
              </div>
              <div className="text-sm font-black shrink-0 ml-3" style={{ color: r.color }}>{r.price}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ── MAIN DASHBOARD ────────────────────────────────────────────────────────────
export default function MogulDashboard() {
  const [activeTab, setActiveTab] = useState("opportunity");

  // Domain-based routing: buyersdna.com → search tab
  useEffect(() => {
    const host = window.location.hostname;
    if (host.includes("buyersdna")) setActiveTab("search");
    else if (host.includes("siteid")) setActiveTab("siteid");
  }, []);

  return (
    <div className="min-h-screen" style={{ background: C.bg, color: C.white }}>
      {/* Header */}
      <div className="sticky top-0 z-50" style={{ background: `${C.bg}f0`, backdropFilter: "blur(12px)", borderBottom: `1px solid ${C.border}` }}>
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-xs font-black tracking-widest" style={{ color: C.gold }}>EXACT AUDIENCE</div>
              <div className="text-sm font-black" style={{ color: C.white }}>Mogul Club — Investor Intelligence</div>
            </div>
            <div className="flex items-center gap-1.5">
              <motion.div className="w-2 h-2 rounded-full" style={{ background: C.green }}
                animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
              <div className="text-xs font-black" style={{ color: C.green }}>LIVE</div>
            </div>
          </div>
          <div className="flex gap-1 overflow-x-auto pb-0.5 scrollbar-hide">
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-black transition-all"
                style={{
                  background: activeTab === tab.id ? C.gold : "transparent",
                  color: activeTab === tab.id ? "#000" : C.muted,
                  border: activeTab === tab.id ? "none" : `1px solid ${C.border}`,
                }}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-4 max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div key={activeTab}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
            {activeTab === "opportunity" && <TabOpportunity />}
            {activeTab === "search"      && <TabSearch />}
            {activeTab === "siteid"      && <TabSiteId />}
            {activeTab === "roi"         && <TabRoi />}
            {activeTab === "pricing"     && <TabPricing />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
