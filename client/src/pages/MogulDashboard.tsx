import { useState, useEffect, useRef } from "react";
import reinvestorImg from "../assets/reinvestor.png";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, LineChart, Line, RadialBarChart, RadialBar, Legend } from "recharts";

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
    city: "Medina", state: "OH", zip: "44256",
    address: "1847 Weymouth Rd",
    ib: 97.6,
    income: "$285K",
    vantage: 771,
    availableCapital: "$140K",
    dti: "17%",
    sqlTier: "Tier 0",
    searchTerms: ["passive real estate income", "real estate investment platform", "accredited investor opportunities"],
    email: "syvivacious@gmail.com",
    phone: "(330) 722-4891",
    linkedin: "linkedin.com/in/dennis-kasper-clearstead",
    jobTitle: "Managing Director, Information Technology",
    company: "Clearstead Advisory Solutions",
    category: ["OH", "real-estate", "tier0"],
    outreach: {
      email: { subject: "Dennis — passive income from institutional real estate", body: "Hi Dennis, I noticed you've been actively researching passive real estate income and accredited investor platforms. Given your background at Clearstead, you already understand capital allocation — Mogul Club lets you put idle capital to work in institutional-grade properties generating 15–20% IRR with zero management overhead. Happy to send our current deal sheet. Worth 10 minutes?" },
      linkedin: { connect: "Hi Dennis — saw you've been exploring accredited real estate platforms. I run Mogul Club, fractional ownership in institutional properties at 15–20% IRR. Would love to connect.", dm: "Dennis, following up on my connection request. We have a current deal in Nashville generating 17.4% IRR — minimum $25K. Happy to send the one-pager if you're curious." },
      directMail: { headline: "Dennis, your capital deserves institutional-grade returns.", body: "You've earned accredited investor status. Mogul Club gives you access to the same commercial real estate deals that family offices and hedge funds invest in — without the $1M minimums. Our current Nashville portfolio is returning 17.4% IRR. Scan the QR code to see the full deal sheet." },
      ads: { segment: "Accredited Investor — Financial Services Executive — Ohio", headline: "Institutional Real Estate. No Landlord Headaches.", body: "15–20% IRR. Fractional ownership. Accredited investors only. See current deals." },
      sms: "Hi Dennis, this is Mogul Club — you recently researched accredited real estate platforms. We have a Nashville deal at 17.4% IRR, $25K min. Want the one-pager? Reply YES.",
    },
  },
  {
    name: "Michael Walstien",
    location: "Minneapolis, MN",
    city: "Minneapolis", state: "MN", zip: "55416",
    address: "3204 Huntington Ave S",
    ib: 95.9,
    income: "$310K",
    vantage: 758,
    availableCapital: "$95K",
    dti: "22%",
    sqlTier: "Tier 0",
    searchTerms: ["passive real estate income", "real estate investment platform", "accredited investor opportunities"],
    email: "walstien@hotmail.com",
    phone: "(612) 381-7204",
    linkedin: "linkedin.com/in/michael-walstien-ameriprise",
    jobTitle: "Financial Advisor — Managing Director",
    company: "Ameriprise Financial Services",
    category: ["MN", "real-estate", "tier0"],
    outreach: {
      email: { subject: "Michael — a real estate deal your clients would want", body: "Hi Michael, as a Managing Director at Ameriprise you likely have clients asking about real asset diversification. Mogul Club offers fractional commercial real estate at 15–20% IRR — fully passive, no management. Our current Minneapolis-area deal may be relevant to your book. Happy to share the deck." },
      linkedin: { connect: "Hi Michael — fellow finance professional here. Mogul Club offers accredited investors fractional commercial RE at 15–20% IRR. Thought it might be relevant to your practice.", dm: "Michael, appreciate the connection. We have a deal in your backyard — Minneapolis industrial, 16.8% projected IRR, $25K minimum. Happy to send the deal sheet if you'd like to review." },
      directMail: { headline: "Michael, your clients are asking about real assets.", body: "Mogul Club gives accredited investors — and their advisors — access to institutional commercial real estate with 15–20% IRR, no property management, and quarterly distributions. Our Minneapolis industrial deal closes in 30 days. Scan to see the full prospectus." },
      ads: { segment: "Financial Advisor — Accredited Investor — Minneapolis Metro", headline: "Real Estate Returns Without the Work.", body: "Fractional commercial RE. 15–20% IRR. Quarterly distributions. Accredited investors only." },
      sms: "Hi Michael, Mogul Club here — we have a Minneapolis industrial deal at 16.8% IRR closing in 30 days. $25K min, fully passive. Want the one-pager? Reply YES.",
    },
  },
  {
    name: "Glen Ahearn",
    location: "Eatontown, NJ",
    city: "Eatontown", state: "NJ", zip: "07724",
    address: "52 Wyckoff Rd",
    ib: 95.9,
    income: "$265K",
    vantage: 762,
    availableCapital: "$110K",
    dti: "19%",
    sqlTier: "Tier 0",
    searchTerms: ["passive real estate income", "accredited investor opportunities", "fractional real estate investing"],
    email: "glensheri@aol.com",
    phone: "(732) 544-8823",
    linkedin: "linkedin.com/in/glen-ahearn-citibank",
    jobTitle: "AVP",
    company: "Citibank N.A.",
    category: ["NJ", "real-estate", "tier0"],
    outreach: {
      email: { subject: "Glen — fractional real estate for accredited investors", body: "Hi Glen, your recent research into fractional real estate investing caught our attention. Mogul Club offers accredited investors like yourself direct access to commercial properties generating 15–20% IRR — no tenant calls, no maintenance. Our current NJ-area deal is open for 2 more weeks. Want me to send the details?" },
      linkedin: { connect: "Hi Glen — noticed your interest in fractional real estate. Mogul Club offers accredited investors institutional-grade deals at 15–20% IRR. Happy to share more.", dm: "Glen, thanks for connecting. We have a New Jersey multifamily deal at 15.9% IRR with a $25K minimum — closes in two weeks. Happy to send the one-pager." },
      directMail: { headline: "Glen, fractional real estate that actually performs.", body: "You've been researching accredited investor platforms. Mogul Club delivers what most promise: institutional commercial real estate, 15–20% IRR, quarterly cash flow, zero management. Our NJ multifamily deal closes soon. Scan to review the full deal sheet." },
      ads: { segment: "Accredited Investor — Banking Professional — New Jersey", headline: "Fractional Real Estate. Institutional Returns.", body: "No landlord work. 15–20% IRR. Accredited investors only. Current NJ deal open now." },
      sms: "Hi Glen, Mogul Club here — NJ multifamily deal at 15.9% IRR, $25K min, closes in 2 weeks. Interested? Reply YES for the one-pager.",
    },
  },
  {
    name: "Michael Simmons",
    location: "Portland, ME",
    city: "Portland", state: "ME", zip: "04101",
    address: "88 Eastern Promenade",
    ib: 95.9,
    income: "$340K",
    vantage: 774,
    availableCapital: "$175K",
    dti: "14%",
    sqlTier: "Tier 0",
    searchTerms: ["passive real estate income", "real estate investment platform", "accredited investor opportunities"],
    email: "wildcat0520@yahoo.com",
    phone: "(207) 773-5512",
    linkedin: "linkedin.com/in/michael-simmons-hightower",
    jobTitle: "Managing Director, Partner",
    company: "Hightower Advisors",
    category: ["ME", "real-estate", "tier0"],
    outreach: {
      email: { subject: "Michael — institutional real estate for your portfolio", body: "Hi Michael, as a Partner at Hightower you understand alternative allocations. Mogul Club gives accredited investors direct access to commercial real estate deals that typically require $1M+ minimums — we've lowered that to $25K. Current deal: Portland-area industrial at 18.2% IRR. Happy to send the prospectus." },
      linkedin: { connect: "Hi Michael — Partner at Hightower, you know alternatives. Mogul Club offers accredited investors fractional commercial RE at 15–20% IRR. Worth a look.", dm: "Michael, appreciate the connection. We have a Portland-area industrial deal at 18.2% IRR, $25K minimum. Happy to send the full deal sheet if you'd like to review it." },
      directMail: { headline: "Michael, institutional real estate without the institutional minimums.", body: "Hightower clients expect sophisticated alternatives. Mogul Club delivers commercial real estate deals at 15–20% IRR with a $25K minimum — the same assets family offices hold, now accessible to individual accredited investors. Our Portland industrial deal closes in 3 weeks." },
      ads: { segment: "Accredited Investor — Wealth Management Partner — Maine", headline: "Commercial Real Estate. $25K Minimum.", body: "Institutional deals. 15–20% IRR. No management. Accredited investors only." },
      sms: "Hi Michael, Mogul Club — Portland industrial deal at 18.2% IRR, $25K min. Closes in 3 weeks. Want the prospectus? Reply YES.",
    },
  },
  {
    name: "Joanne Cross",
    location: "Plano, TX",
    city: "Plano", state: "TX", zip: "75093",
    address: "4112 Windhaven Ln",
    ib: 95.9,
    income: "$295K",
    vantage: 769,
    availableCapital: "$120K",
    dti: "21%",
    sqlTier: "Tier 0",
    searchTerms: ["passive real estate income", "real estate investment platform", "accredited investor opportunities"],
    email: "jcross326@gmail.com",
    phone: "(972) 867-4401",
    linkedin: "linkedin.com/in/joanne-cross-barings",
    jobTitle: "Managing Director",
    company: "Barings",
    category: ["TX", "real-estate", "tier0"],
    outreach: {
      email: { subject: "Joanne — passive real estate income in the Texas market", body: "Hi Joanne, your research into passive real estate income platforms brought you to our attention. As Managing Director at Barings, you understand yield-generating assets. Mogul Club offers accredited investors fractional ownership in Texas commercial properties at 15–20% IRR — fully managed, quarterly distributions. Our current Dallas-Plano corridor deal is open now." },
      linkedin: { connect: "Hi Joanne — noticed your interest in passive real estate income. Mogul Club offers accredited investors institutional commercial RE at 15–20% IRR in Texas. Happy to share.", dm: "Joanne, thanks for connecting. We have a Plano-area office park deal at 16.5% IRR, $25K minimum. Happy to send the one-pager if you'd like to take a look." },
      directMail: { headline: "Joanne, Texas commercial real estate — passive income, institutional returns.", body: "You've been researching accredited investor platforms. Mogul Club delivers Texas commercial real estate at 15–20% IRR with no property management required. Our current Plano corridor deal is generating strong pre-sale interest. Scan to see the full deal sheet." },
      ads: { segment: "Accredited Investor — Finance Executive — Dallas-Plano Metro", headline: "Texas Real Estate. Passive Income. 15–20% IRR.", body: "Fractional commercial RE in the Dallas corridor. Accredited investors only. See current deals." },
      sms: "Hi Joanne, Mogul Club — Plano office park deal at 16.5% IRR, $25K min. Fully passive. Want the one-pager? Reply YES.",
    },
  },
  {
    name: "Thuy Mauer",
    location: "Bainbridge Island, WA",
    city: "Bainbridge Island", state: "WA", zip: "98110",
    address: "7340 NE Sunrise Dr",
    ib: 95.9,
    income: "$255K",
    vantage: 756,
    availableCapital: "$90K",
    dti: "23%",
    sqlTier: "Tier 0",
    searchTerms: ["passive real estate income", "real estate investment platform", "accredited investor opportunities"],
    email: "mauerll@yahoo.com",
    phone: "(206) 842-7713",
    linkedin: "linkedin.com/in/thuy-mauer",
    jobTitle: "Head PA Golf Professional",
    company: "Philadelphia PGA Junior Tour",
    category: ["WA", "real-estate", "tier0"],
    outreach: {
      email: { subject: "Thuy — real estate income without the management", body: "Hi Thuy, you've been researching passive real estate income platforms and we think Mogul Club is exactly what you're looking for. Fractional ownership in institutional commercial properties — 15–20% IRR, quarterly distributions, zero landlord work. Our current Pacific Northwest deal is open to accredited investors now." },
      linkedin: { connect: "Hi Thuy — saw your interest in passive real estate income. Mogul Club offers accredited investors fractional commercial RE at 15–20% IRR, no management required.", dm: "Thuy, thanks for connecting. We have a Seattle-area industrial deal at 17.1% IRR, $25K minimum. Happy to send the one-pager if you're curious." },
      directMail: { headline: "Thuy, your income deserves to work as hard as you do.", body: "Mogul Club gives accredited investors access to institutional commercial real estate — the kind that generates 15–20% IRR without requiring you to manage a single tenant. Our Pacific Northwest deal is open now. Scan to review the full prospectus." },
      ads: { segment: "Accredited Investor — Pacific Northwest", headline: "Real Estate Returns. Zero Management.", body: "Fractional commercial RE. 15–20% IRR. Quarterly cash flow. Accredited investors only." },
      sms: "Hi Thuy, Mogul Club — Seattle industrial deal at 17.1% IRR, $25K min. Fully passive. Want the one-pager? Reply YES.",
    },
  },
  {
    name: "Fanny Tan",
    location: "Chicago, IL",
    city: "Chicago", state: "IL", zip: "60614",
    address: "2241 N Lincoln Ave",
    ib: 95.1,
    income: "$275K",
    vantage: 763,
    availableCapital: "$105K",
    dti: "26%",
    sqlTier: "Tier 0",
    searchTerms: ["passive real estate income", "accredited investor opportunities", "fractional real estate investing"],
    email: "mcren@hotmail.com",
    phone: "(312) 555-8847",
    linkedin: "linkedin.com/in/fanny-tan-cibc",
    jobTitle: "Associate Managing Director",
    company: "CIBC",
    category: ["IL", "real-estate", "tier0"],
    outreach: {
      email: { subject: "Fanny — fractional real estate for accredited investors in Chicago", body: "Hi Fanny, your research into fractional real estate investing and accredited investor platforms caught our attention. As Associate MD at CIBC, you understand yield-generating alternatives. Mogul Club offers institutional commercial real estate at 15–20% IRR with a $25K minimum. Our Chicago-area deal is currently open." },
      linkedin: { connect: "Hi Fanny — noticed your interest in fractional real estate. Mogul Club offers accredited investors institutional commercial RE at 15–20% IRR in the Chicago market.", dm: "Fanny, thanks for connecting. We have a Chicago logistics deal at 16.2% IRR, $25K minimum. Happy to send the deal sheet if you'd like to review." },
      directMail: { headline: "Fanny, institutional real estate in your own backyard.", body: "Mogul Club gives Chicago-area accredited investors direct access to commercial real estate deals generating 15–20% IRR — no property management, no tenant headaches. Our current Chicago logistics deal is open for the next 3 weeks. Scan to see the full prospectus." },
      ads: { segment: "Accredited Investor — Banking Professional — Chicago Metro", headline: "Chicago Commercial Real Estate. 15–20% IRR.", body: "Fractional ownership. No management. Accredited investors only. Current deal open now." },
      sms: "Hi Fanny, Mogul Club — Chicago logistics deal at 16.2% IRR, $25K min. Closes in 3 weeks. Want the one-pager? Reply YES.",
    },
  },
  {
    name: "Jeffrey Capossela",
    location: "Scarsdale, NY",
    city: "Scarsdale", state: "NY", zip: "10583",
    address: "14 Walworth Ave",
    ib: 95.1,
    income: "$320K",
    vantage: 768,
    availableCapital: "$155K",
    dti: "18%",
    sqlTier: "Tier 0",
    searchTerms: ["passive real estate income", "real estate investment platform", "accredited investor opportunities"],
    email: "jeffreycapossela@gmail.com",
    phone: "(914) 723-6614",
    linkedin: "linkedin.com/in/jeffrey-capossela",
    jobTitle: "Director of Ad Operations",
    company: "Eightbar",
    category: ["NY", "real-estate", "tier0"],
    outreach: {
      email: { subject: "Jeffrey — real estate income for Westchester accredited investors", body: "Hi Jeffrey, you've been researching passive real estate income and investment platforms. Mogul Club gives accredited investors in the Westchester area access to institutional commercial real estate at 15–20% IRR — no management, quarterly distributions. Our current NYC-metro deal is open now. Worth a look?" },
      linkedin: { connect: "Hi Jeffrey — saw your interest in passive real estate income. Mogul Club offers accredited investors institutional commercial RE at 15–20% IRR in the NYC metro. Happy to share.", dm: "Jeffrey, thanks for connecting. We have a Westchester-area mixed-use deal at 17.8% IRR, $25K minimum. Happy to send the one-pager if you're curious." },
      directMail: { headline: "Jeffrey, institutional real estate in the NYC metro.", body: "Mogul Club gives Westchester-area accredited investors access to the same commercial real estate deals that institutional investors hold — at 15–20% IRR, $25K minimum. No property management required. Our current NYC-metro deal closes in 4 weeks. Scan to review." },
      ads: { segment: "Accredited Investor — Digital Media Executive — Westchester NY", headline: "NYC Metro Real Estate. Institutional Returns.", body: "Fractional commercial RE. 15–20% IRR. No management. Accredited investors only." },
      sms: "Hi Jeffrey, Mogul Club — Westchester mixed-use deal at 17.8% IRR, $25K min. Closes in 4 weeks. Want the one-pager? Reply YES.",
    },
  },
  {
    name: "Vincent Devito",
    location: "Cos Cob, CT",
    city: "Cos Cob", state: "CT", zip: "06807",
    address: "31 Orchard St",
    ib: 95.1,
    income: "$380K",
    vantage: 779,
    availableCapital: "$200K",
    dti: "12%",
    sqlTier: "Tier 0",
    searchTerms: ["passive real estate income", "real estate investment platform", "accredited investor opportunities"],
    email: "inoasamir@gmail.com",
    phone: "(203) 869-4422",
    linkedin: "linkedin.com/in/vincent-devito-quaestor",
    jobTitle: "Managing Director",
    company: "Quaestor Advisors",
    category: ["CT", "real-estate", "tier0"],
    outreach: {
      email: { subject: "Vincent — institutional real estate for your portfolio", body: "Hi Vincent, as Managing Director at Quaestor Advisors you're no stranger to alternative investments. Mogul Club offers accredited investors direct access to institutional commercial real estate at 15–20% IRR — the same asset class your institutional clients hold. Our current Greenwich-area deal is open now. Happy to send the prospectus." },
      linkedin: { connect: "Hi Vincent — MD at Quaestor, you understand alternatives. Mogul Club offers accredited investors institutional commercial RE at 15–20% IRR in the CT/NY corridor.", dm: "Vincent, thanks for connecting. We have a Greenwich-area commercial deal at 19.1% IRR, $25K minimum. Happy to send the full prospectus if you'd like to review." },
      directMail: { headline: "Vincent, the institutional real estate deals you know — now accessible.", body: "Mogul Club gives accredited investors direct access to commercial real estate deals that typically require $1M+ minimums. Our Greenwich-area deal is generating 19.1% projected IRR. $25K minimum. Quarterly distributions. No management. Scan to see the full deal sheet." },
      ads: { segment: "Accredited Investor — Investment Management — Greenwich CT Corridor", headline: "Institutional Real Estate. $25K Minimum.", body: "The deals family offices hold — now accessible. 15–20% IRR. Accredited investors only." },
      sms: "Hi Vincent, Mogul Club — Greenwich commercial deal at 19.1% IRR, $25K min. Fully passive. Want the prospectus? Reply YES.",
    },
  },
  {
    name: "Diane Bowerman",
    location: "Palisade, CO",
    city: "Palisade", state: "CO", zip: "81526",
    address: "3812 G Rd",
    ib: 94.3,
    income: "$240K",
    vantage: 754,
    availableCapital: "$88K",
    dti: "28%",
    sqlTier: "Tier 0",
    searchTerms: ["passive real estate income", "real estate investment platform", "accredited investor opportunities"],
    email: "dcbowerman@aol.com",
    phone: "(970) 464-7731",
    linkedin: "linkedin.com/in/diane-bowerman",
    jobTitle: "Head Patternmaker",
    company: "Susana Monaco",
    category: ["CO", "real-estate", "tier0"],
    outreach: {
      email: { subject: "Diane — passive real estate income in Colorado", body: "Hi Diane, your research into passive real estate income platforms brought you to our attention. Mogul Club offers accredited investors fractional ownership in commercial properties generating 15–20% IRR — no landlord work, quarterly distributions. Our current Colorado deal is open now. Want me to send the details?" },
      linkedin: { connect: "Hi Diane — saw your interest in passive real estate income. Mogul Club offers accredited investors commercial RE at 15–20% IRR in Colorado. Happy to share more.", dm: "Diane, thanks for connecting. We have a Colorado Springs commercial deal at 15.7% IRR, $25K minimum. Happy to send the one-pager if you're interested." },
      directMail: { headline: "Diane, Colorado real estate income — without the management.", body: "Mogul Club gives Colorado accredited investors access to institutional commercial real estate at 15–20% IRR. No tenants to manage, no maintenance calls. Our current Colorado Springs deal is open now. Scan to review the full prospectus." },
      ads: { segment: "Accredited Investor — Colorado", headline: "Colorado Commercial Real Estate. Passive Income.", body: "Fractional ownership. 15–20% IRR. No management. Accredited investors only." },
      sms: "Hi Diane, Mogul Club — Colorado Springs commercial deal at 15.7% IRR, $25K min. Fully passive. Want the one-pager? Reply YES.",
    },
  },
  {
    name: "Lynn Doonan",
    location: "Stamford, CT",
    city: "Stamford", state: "CT", zip: "06902",
    address: "87 Strawberry Hill Ave",
    ib: 94.3,
    income: "$260K",
    vantage: 761,
    availableCapital: "$100K",
    dti: "24%",
    sqlTier: "Tier 0",
    searchTerms: ["passive real estate income", "real estate investment platform", "accredited investor opportunities"],
    email: "lynndoonan@gmail.com",
    phone: "(203) 348-9921",
    linkedin: "linkedin.com/in/lynn-doonan-cxloyalty",
    jobTitle: "VP",
    company: "CXLoyalty",
    category: ["CT", "real-estate", "tier0"],
    outreach: {
      email: { subject: "Lynn — real estate income for Stamford accredited investors", body: "Hi Lynn, you've been researching passive real estate income and investment platforms. Mogul Club gives Stamford-area accredited investors access to institutional commercial real estate at 15–20% IRR — no management, quarterly distributions. Our current CT deal is open now. Worth a look?" },
      linkedin: { connect: "Hi Lynn — noticed your interest in passive real estate income. Mogul Club offers accredited investors institutional commercial RE at 15–20% IRR in the Stamford area.", dm: "Lynn, thanks for connecting. We have a Stamford-area mixed-use deal at 16.4% IRR, $25K minimum. Happy to send the one-pager if you're curious." },
      directMail: { headline: "Lynn, institutional real estate in Fairfield County.", body: "Mogul Club gives Stamford-area accredited investors direct access to commercial real estate deals at 15–20% IRR — no property management, no tenant calls. Our current Fairfield County deal closes in 3 weeks. Scan to review the full prospectus." },
      ads: { segment: "Accredited Investor — Corporate Executive — Stamford CT", headline: "Fairfield County Real Estate. 15–20% IRR.", body: "Fractional commercial RE. No management. Accredited investors only. Current deal open." },
      sms: "Hi Lynn, Mogul Club — Stamford mixed-use deal at 16.4% IRR, $25K min. Closes in 3 weeks. Want the one-pager? Reply YES.",
    },
  },
  {
    name: "Sarah Green",
    location: "Green Bay, WI",
    city: "Green Bay", state: "WI", zip: "54301",
    address: "1124 S Monroe Ave",
    ib: 94.3,
    income: "$230K",
    vantage: 752,
    availableCapital: "$82K",
    dti: "29%",
    sqlTier: "Tier 0",
    searchTerms: ["passive real estate income", "real estate investment platform", "accredited investor opportunities"],
    email: "declangreen@hotmail.com",
    phone: "(920) 432-6614",
    linkedin: "linkedin.com/in/sarah-green-pension",
    jobTitle: "VP",
    company: "Pension Inc.",
    category: ["WI", "real-estate", "tier0"],
    outreach: {
      email: { subject: "Sarah — passive real estate income in Wisconsin", body: "Hi Sarah, your research into passive real estate income platforms caught our attention. Mogul Club offers accredited investors fractional ownership in commercial properties generating 15–20% IRR — no management, quarterly distributions. Our current Midwest deal is open now. Happy to send the details." },
      linkedin: { connect: "Hi Sarah — saw your interest in passive real estate income. Mogul Club offers accredited investors commercial RE at 15–20% IRR in the Midwest. Happy to share.", dm: "Sarah, thanks for connecting. We have a Milwaukee-area industrial deal at 15.4% IRR, $25K minimum. Happy to send the one-pager if you're interested." },
      directMail: { headline: "Sarah, Midwest commercial real estate — passive income, institutional returns.", body: "Mogul Club gives Wisconsin accredited investors access to institutional commercial real estate at 15–20% IRR. No tenants, no maintenance. Our current Milwaukee-area industrial deal is open now. Scan to review the full prospectus." },
      ads: { segment: "Accredited Investor — Finance Professional — Green Bay WI", headline: "Midwest Real Estate. Passive Income.", body: "Fractional commercial RE. 15–20% IRR. No management. Accredited investors only." },
      sms: "Hi Sarah, Mogul Club — Milwaukee industrial deal at 15.4% IRR, $25K min. Fully passive. Want the one-pager? Reply YES.",
    },
  },
  {
    name: "Erika Bodell",
    location: "Lancaster, PA",
    city: "Lancaster", state: "PA", zip: "17601",
    address: "445 Harrisburg Ave",
    ib: 94.3,
    income: "$245K",
    vantage: 757,
    availableCapital: "$92K",
    dti: "20%",
    sqlTier: "Tier 0",
    searchTerms: ["passive real estate income", "real estate investment platform", "accredited investor opportunities"],
    email: "paulb1@aol.com",
    phone: "(717) 394-8812",
    linkedin: "linkedin.com/in/erika-bodell-tristarr",
    jobTitle: "Director of Business Development",
    company: "Tristarr",
    category: ["PA", "real-estate", "tier0"],
    outreach: {
      email: { subject: "Erika — passive real estate income in Pennsylvania", body: "Hi Erika, your research into passive real estate income platforms brought you to our attention. Mogul Club offers accredited investors fractional ownership in commercial properties at 15–20% IRR — fully managed, quarterly distributions. Our current PA deal is open now. Want me to send the details?" },
      linkedin: { connect: "Hi Erika — noticed your interest in passive real estate income. Mogul Club offers accredited investors commercial RE at 15–20% IRR in Pennsylvania. Happy to share.", dm: "Erika, thanks for connecting. We have a Philadelphia-area logistics deal at 16.1% IRR, $25K minimum. Happy to send the one-pager if you're curious." },
      directMail: { headline: "Erika, Pennsylvania commercial real estate — passive income.", body: "Mogul Club gives Pennsylvania accredited investors access to institutional commercial real estate at 15–20% IRR. No property management required. Our current Philadelphia-area logistics deal is open now. Scan to review the full deal sheet." },
      ads: { segment: "Accredited Investor — Business Development — Lancaster PA", headline: "PA Commercial Real Estate. 15–20% IRR.", body: "Fractional ownership. No management. Accredited investors only. Current PA deal open." },
      sms: "Hi Erika, Mogul Club — Philadelphia logistics deal at 16.1% IRR, $25K min. Fully passive. Want the one-pager? Reply YES.",
    },
  },
  {
    name: "Chris Bianchi",
    location: "Killington, VT",
    city: "Killington", state: "VT", zip: "05751",
    address: "2208 Killington Rd",
    ib: 94.3,
    income: "$215K",
    vantage: 751,
    availableCapital: "$78K",
    dti: "22%",
    sqlTier: "Tier 0",
    searchTerms: ["passive real estate income", "real estate investment platform", "accredited investor opportunities"],
    email: "bianchijc@gmail.com",
    phone: "(802) 422-7741",
    linkedin: "linkedin.com/in/chris-bianchi-killington",
    jobTitle: "Assistant Head of School",
    company: "Killington Mountain School",
    category: ["VT", "real-estate", "tier0"],
    outreach: {
      email: { subject: "Chris — passive real estate income in New England", body: "Hi Chris, you've been researching passive real estate income and investment platforms. Mogul Club offers accredited investors fractional ownership in commercial properties at 15–20% IRR — no management, quarterly distributions. Our current New England deal is open now. Worth a look?" },
      linkedin: { connect: "Hi Chris — saw your interest in passive real estate income. Mogul Club offers accredited investors commercial RE at 15–20% IRR in New England. Happy to share.", dm: "Chris, thanks for connecting. We have a Burlington-area commercial deal at 15.2% IRR, $25K minimum. Happy to send the one-pager if you're interested." },
      directMail: { headline: "Chris, New England commercial real estate — passive income.", body: "Mogul Club gives Vermont accredited investors access to institutional commercial real estate at 15–20% IRR. No tenants, no maintenance. Our current Burlington-area deal is open now. Scan to review the full prospectus." },
      ads: { segment: "Accredited Investor — Education Professional — Vermont", headline: "New England Real Estate. Passive Income.", body: "Fractional commercial RE. 15–20% IRR. No management. Accredited investors only." },
      sms: "Hi Chris, Mogul Club — Burlington commercial deal at 15.2% IRR, $25K min. Fully passive. Want the one-pager? Reply YES.",
    },
  },
  {
    name: "Karen Shen",
    location: "South San Francisco, CA",
    city: "South San Francisco", state: "CA", zip: "94080",
    address: "512 Grand Ave",
    ib: 94.3,
    income: "$390K",
    vantage: 781,
    availableCapital: "$210K",
    dti: "11%",
    sqlTier: "Tier 0",
    searchTerms: ["passive real estate income", "real estate investment platform", "accredited investor opportunities"],
    email: "kjshen88@yahoo.com",
    phone: "(650) 877-4422",
    linkedin: "linkedin.com/in/karen-shen-genentech",
    jobTitle: "Senior Director, Employee & Community Engagement",
    company: "Genentech",
    category: ["CA", "real-estate", "tier0"],
    outreach: {
      email: { subject: "Karen — Bay Area real estate income without the management", body: "Hi Karen, as Senior Director at Genentech you're likely looking for passive income that doesn't require your time. Mogul Club offers accredited investors fractional ownership in Bay Area commercial properties at 15–20% IRR — no management, quarterly distributions. Our current South Bay deal is open now." },
      linkedin: { connect: "Hi Karen — Senior Director at Genentech, you understand high-value investments. Mogul Club offers accredited investors Bay Area commercial RE at 15–20% IRR. Happy to share.", dm: "Karen, thanks for connecting. We have a South Bay biotech corridor deal at 18.9% IRR, $25K minimum. Happy to send the one-pager if you're curious." },
      directMail: { headline: "Karen, Bay Area commercial real estate — institutional returns.", body: "Mogul Club gives Bay Area accredited investors direct access to commercial real estate deals at 15–20% IRR — no property management, no tenant calls. Our current South Bay biotech corridor deal closes in 3 weeks. Scan to review the full prospectus." },
      ads: { segment: "Accredited Investor — Biotech Executive — Bay Area CA", headline: "Bay Area Real Estate. 15–20% IRR.", body: "Fractional commercial RE. No management. Accredited investors only. Current Bay Area deal open." },
      sms: "Hi Karen, Mogul Club — South Bay biotech corridor deal at 18.9% IRR, $25K min. Closes in 3 weeks. Want the one-pager? Reply YES.",
    },
  },
  {
    name: "Stephen Gengaro",
    location: "New York City, NY",
    city: "New York", state: "NY", zip: "10022",
    address: "425 E 58th St Apt 14C",
    ib: 94.3,
    income: "$415K",
    vantage: 783,
    availableCapital: "$230K",
    dti: "10%",
    sqlTier: "Tier 0",
    searchTerms: ["passive real estate income", "real estate investment platform", "accredited investor opportunities"],
    email: "sgengaro@gmail.com",
    phone: "(212) 888-4471",
    linkedin: "linkedin.com/in/stephen-gengaro-stifel",
    jobTitle: "Managing Director",
    company: "Stifel Financial Corp.",
    category: ["NY", "real-estate", "tier0"],
    outreach: {
      email: { subject: "Stephen — institutional real estate outside of public markets", body: "Hi Stephen, as Managing Director at Stifel you understand the value of real asset diversification. Mogul Club offers accredited investors direct access to institutional commercial real estate at 15–20% IRR — the kind of deal that typically requires $1M+ minimums. Our current NYC-area deal is open now. Happy to send the prospectus." },
      linkedin: { connect: "Hi Stephen — MD at Stifel, you understand institutional alternatives. Mogul Club offers accredited investors commercial RE at 15–20% IRR. Happy to share.", dm: "Stephen, thanks for connecting. We have a NYC-area commercial deal at 19.4% IRR, $25K minimum. Happy to send the full prospectus if you'd like to review." },
      directMail: { headline: "Stephen, institutional real estate — now accessible at $25K.", body: "Mogul Club gives NYC-area accredited investors direct access to commercial real estate deals that typically require $1M+ minimums. Our current deal is generating 19.4% projected IRR. Quarterly distributions. No management. Scan to see the full deal sheet." },
      ads: { segment: "Accredited Investor — Investment Banking — NYC", headline: "Institutional Real Estate. $25K Minimum.", body: "The deals institutional investors hold — now accessible. 15–20% IRR. Accredited investors only." },
      sms: "Hi Stephen, Mogul Club — NYC commercial deal at 19.4% IRR, $25K min. Fully passive. Want the prospectus? Reply YES.",
    },
  },
  {
    name: "Eran Zur",
    location: "San Francisco, CA",
    city: "San Francisco", state: "CA", zip: "94115",
    address: "2841 Broderick St",
    ib: 94.3,
    income: "$450K",
    vantage: 786,
    availableCapital: "$250K",
    dti: "9%",
    sqlTier: "Tier 0",
    searchTerms: ["passive real estate income", "real estate investment platform", "accredited investor opportunities"],
    email: "daniellemtzur@gmail.com",
    phone: "(415) 922-7834",
    linkedin: "linkedin.com/in/eran-zur-fortress",
    jobTitle: "Managing Director",
    company: "Fortress Investment Group",
    category: ["CA", "real-estate", "tier0"],
    outreach: {
      email: { subject: "Eran — real estate deals outside of Fortress", body: "Hi Eran, as Managing Director at Fortress you see institutional real estate deals daily. Mogul Club offers accredited investors the same asset class at a $25K minimum — 15–20% IRR, quarterly distributions, fully managed. Our current SF-area deal may be of interest. Happy to send the prospectus." },
      linkedin: { connect: "Hi Eran — MD at Fortress, you know institutional real estate. Mogul Club offers accredited investors the same asset class at $25K minimum, 15–20% IRR.", dm: "Eran, thanks for connecting. We have an SF-area commercial deal at 20.1% IRR, $25K minimum. Happy to send the full prospectus if you'd like to review." },
      directMail: { headline: "Eran, institutional real estate — on your personal balance sheet.", body: "You work with institutional real estate daily. Mogul Club lets you put your own capital in the same asset class at a $25K minimum — 20.1% projected IRR on our current SF deal. Quarterly distributions. No management. Scan to see the full deal sheet." },
      ads: { segment: "Accredited Investor — Private Equity — San Francisco", headline: "Institutional Real Estate. Personal Portfolio.", body: "The deals you know — now on your balance sheet. 15–20% IRR. $25K minimum. Accredited investors only." },
      sms: "Hi Eran, Mogul Club — SF commercial deal at 20.1% IRR, $25K min. Fully passive. Want the prospectus? Reply YES.",
    },
  },
  {
    name: "George Westphal",
    location: "Pearl River, NY",
    city: "Pearl River", state: "NY", zip: "10965",
    address: "18 Middletown Rd",
    ib: 94.3,
    income: "$250K",
    vantage: 759,
    availableCapital: "$97K",
    dti: "25%",
    sqlTier: "Tier 0",
    searchTerms: ["passive real estate income", "real estate investment platform", "accredited investor opportunities"],
    email: "tina42@hotmail.com",
    phone: "(845) 735-4412",
    linkedin: "linkedin.com/in/george-westphal-nicepak",
    jobTitle: "Director",
    company: "Nice-Pak Products, Inc.",
    category: ["NY", "real-estate", "tier0"],
    outreach: {
      email: { subject: "George — passive real estate income in the Hudson Valley", body: "Hi George, your research into passive real estate income platforms caught our attention. Mogul Club offers accredited investors fractional ownership in commercial properties at 15–20% IRR — no management, quarterly distributions. Our current Hudson Valley deal is open now. Want me to send the details?" },
      linkedin: { connect: "Hi George — saw your interest in passive real estate income. Mogul Club offers accredited investors commercial RE at 15–20% IRR in the Hudson Valley. Happy to share.", dm: "George, thanks for connecting. We have a Hudson Valley commercial deal at 16.7% IRR, $25K minimum. Happy to send the one-pager if you're curious." },
      directMail: { headline: "George, Hudson Valley commercial real estate — passive income.", body: "Mogul Club gives Hudson Valley accredited investors access to institutional commercial real estate at 15–20% IRR. No tenants, no maintenance. Our current deal is open now. Scan to review the full prospectus." },
      ads: { segment: "Accredited Investor — Corporate Director — Rockland County NY", headline: "Hudson Valley Real Estate. Passive Income.", body: "Fractional commercial RE. 15–20% IRR. No management. Accredited investors only." },
      sms: "Hi George, Mogul Club — Hudson Valley commercial deal at 16.7% IRR, $25K min. Fully passive. Want the one-pager? Reply YES.",
    },
  },
  {
    name: "Stuart Willner",
    location: "Norton, OH",
    city: "Norton", state: "OH", zip: "44203",
    address: "3341 Greenwich Rd",
    ib: 94.3,
    income: "$235K",
    vantage: 753,
    availableCapital: "$85K",
    dti: "27%",
    sqlTier: "Tier 0",
    searchTerms: ["passive real estate income", "real estate investment platform", "accredited investor opportunities"],
    email: "stuartwillner@gmail.com",
    phone: "(330) 825-6612",
    linkedin: "linkedin.com/in/stuart-willner-veritiv",
    jobTitle: "VP",
    company: "Veritiv",
    category: ["OH", "real-estate", "tier0"],
    outreach: {
      email: { subject: "Stuart — passive real estate income in Northeast Ohio", body: "Hi Stuart, your research into passive real estate income platforms brought you to our attention. Mogul Club offers accredited investors fractional ownership in commercial properties at 15–20% IRR — no management, quarterly distributions. Our current Ohio deal is open now. Want me to send the details?" },
      linkedin: { connect: "Hi Stuart — noticed your interest in passive real estate income. Mogul Club offers accredited investors commercial RE at 15–20% IRR in Ohio. Happy to share.", dm: "Stuart, thanks for connecting. We have an Akron-area industrial deal at 15.8% IRR, $25K minimum. Happy to send the one-pager if you're interested." },
      directMail: { headline: "Stuart, Northeast Ohio commercial real estate — passive income.", body: "Mogul Club gives Ohio accredited investors access to institutional commercial real estate at 15–20% IRR. No tenants, no maintenance. Our current Akron-area industrial deal is open now. Scan to review the full prospectus." },
      ads: { segment: "Accredited Investor — Distribution Executive — Akron OH Metro", headline: "Ohio Real Estate. Passive Income.", body: "Fractional commercial RE. 15–20% IRR. No management. Accredited investors only." },
      sms: "Hi Stuart, Mogul Club — Akron industrial deal at 15.8% IRR, $25K min. Fully passive. Want the one-pager? Reply YES.",
    },
  },
  {
    name: "Lauren Mazzari",
    location: "Montclair, NJ",
    city: "Montclair", state: "NJ", zip: "07042",
    address: "29 Watchung Ave",
    ib: 93.5,
    income: "$220K",
    vantage: 750,
    availableCapital: "$80K",
    dti: "21%",
    sqlTier: "Tier 0",
    searchTerms: ["passive real estate income", "real estate investment platform", "accredited investor opportunities"],
    email: "laurenmazzari@yahoo.com",
    phone: "(973) 744-8831",
    linkedin: "linkedin.com/in/lauren-mazzari",
    jobTitle: "Manager",
    company: "Lacordaire Academy",
    category: ["NJ", "real-estate", "tier0"],
    outreach: {
      email: { subject: "Lauren — passive real estate income in New Jersey", body: "Hi Lauren, your research into passive real estate income platforms caught our attention. Mogul Club offers accredited investors fractional ownership in commercial properties at 15–20% IRR — no management, quarterly distributions. Our current NJ deal is open now. Want me to send the details?" },
      linkedin: { connect: "Hi Lauren — saw your interest in passive real estate income. Mogul Club offers accredited investors commercial RE at 15–20% IRR in New Jersey. Happy to share.", dm: "Lauren, thanks for connecting. We have a Montclair-area mixed-use deal at 15.3% IRR, $25K minimum. Happy to send the one-pager if you're curious." },
      directMail: { headline: "Lauren, New Jersey commercial real estate — passive income.", body: "Mogul Club gives NJ accredited investors access to institutional commercial real estate at 15–20% IRR. No tenants, no maintenance. Our current Montclair-area deal is open now. Scan to review the full prospectus." },
      ads: { segment: "Accredited Investor — Education Professional — Montclair NJ", headline: "NJ Real Estate. Passive Income.", body: "Fractional commercial RE. 15–20% IRR. No management. Accredited investors only." },
      sms: "Hi Lauren, Mogul Club — Montclair mixed-use deal at 15.3% IRR, $25K min. Fully passive. Want the one-pager? Reply YES.",
    },
  },
  {
    name: "Andrew Stivers",
    location: "Bethesda, MD",
    city: "Bethesda", state: "MD", zip: "20814",
    address: "5512 Westbard Ave",
    ib: 93.5,
    income: "$360K",
    vantage: 776,
    availableCapital: "$185K",
    dti: "13%",
    sqlTier: "Tier 0",
    searchTerms: ["passive real estate income", "real estate investment platform", "accredited investor opportunities"],
    email: "andrew.stivers@gmail.com",
    phone: "(301) 654-7712",
    linkedin: "linkedin.com/in/andrew-stivers-nera",
    jobTitle: "Managing Director",
    company: "NERA Economic Consulting",
    category: ["MD", "real-estate", "tier0"],
    outreach: {
      email: { subject: "Andrew — institutional real estate for DC-area accredited investors", body: "Hi Andrew, as Managing Director at NERA you understand economic modeling and yield. Mogul Club offers accredited investors direct access to institutional commercial real estate at 15–20% IRR — the same asset class that DC-area family offices hold. Our current Maryland deal is open now. Happy to send the prospectus." },
      linkedin: { connect: "Hi Andrew — MD at NERA, you understand yield and alternatives. Mogul Club offers accredited investors institutional commercial RE at 15–20% IRR in the DC metro. Happy to share.", dm: "Andrew, thanks for connecting. We have a Bethesda-area commercial deal at 17.6% IRR, $25K minimum. Happy to send the full prospectus if you'd like to review." },
      directMail: { headline: "Andrew, DC-area commercial real estate — institutional returns.", body: "Mogul Club gives DC-metro accredited investors direct access to commercial real estate deals at 15–20% IRR — no property management, no tenant calls. Our current Bethesda-area deal closes in 3 weeks. Scan to review the full prospectus." },
      ads: { segment: "Accredited Investor — Economic Consulting — Bethesda MD", headline: "DC Metro Real Estate. 15–20% IRR.", body: "Fractional commercial RE. No management. Accredited investors only. Current DC deal open." },
      sms: "Hi Andrew, Mogul Club — Bethesda commercial deal at 17.6% IRR, $25K min. Closes in 3 weeks. Want the one-pager? Reply YES.",
    },
  },
  {
    name: "Cecil Crain",
    location: "Jenks, OK",
    city: "Jenks", state: "OK", zip: "74037",
    address: "1803 W 101st St S",
    ib: 93.5,
    income: "$290K",
    vantage: 764,
    availableCapital: "$115K",
    dti: "23%",
    sqlTier: "Tier 0",
    searchTerms: ["passive real estate income", "real estate investment platform", "accredited investor opportunities"],
    email: "dakota8459@aol.com",
    phone: "(918) 299-7741",
    linkedin: "linkedin.com/in/cecil-crain-aircomfort",
    jobTitle: "President & Sales Engineer",
    company: "Air Comfort Inc.",
    category: ["OK", "real-estate", "tier0"],
    outreach: {
      email: { subject: "Cecil — passive real estate income in Oklahoma", body: "Hi Cecil, as President of Air Comfort you understand what it means to build a business. Mogul Club offers accredited investors like yourself passive income from institutional commercial real estate at 15–20% IRR — no management, quarterly distributions. Our current Tulsa-area deal is open now. Want me to send the details?" },
      linkedin: { connect: "Hi Cecil — President at Air Comfort, you understand building wealth. Mogul Club offers accredited investors commercial RE at 15–20% IRR in Oklahoma. Happy to share.", dm: "Cecil, thanks for connecting. We have a Tulsa-area commercial deal at 16.3% IRR, $25K minimum. Happy to send the one-pager if you're interested." },
      directMail: { headline: "Cecil, Oklahoma commercial real estate — passive income.", body: "Mogul Club gives Oklahoma accredited investors access to institutional commercial real estate at 15–20% IRR. No tenants, no maintenance. Our current Tulsa-area deal is open now. Scan to review the full prospectus." },
      ads: { segment: "Accredited Investor — Business Owner — Tulsa OK Metro", headline: "Oklahoma Real Estate. Passive Income.", body: "Fractional commercial RE. 15–20% IRR. No management. Accredited investors only." },
      sms: "Hi Cecil, Mogul Club — Tulsa commercial deal at 16.3% IRR, $25K min. Fully passive. Want the one-pager? Reply YES.",
    },
  },
  {
    name: "Christy Silvanic",
    location: "Houston, TX",
    city: "Houston", state: "TX", zip: "77019",
    address: "3214 Del Monte Dr",
    ib: 93.5,
    income: "$330K",
    vantage: 772,
    availableCapital: "$160K",
    dti: "16%",
    sqlTier: "Tier 0",
    searchTerms: ["passive real estate income", "real estate investment platform", "accredited investor opportunities"],
    email: "silvanic@hotmail.com",
    phone: "(713) 621-8834",
    linkedin: "linkedin.com/in/christy-silvanic-schwab",
    jobTitle: "Managing Director, Finance",
    company: "Charles Schwab",
    category: ["TX", "real-estate", "tier0"],
    outreach: {
      email: { subject: "Christy — real estate income beyond the market", body: "Hi Christy, as Managing Director at Schwab you help clients diversify beyond public markets. Mogul Club offers accredited investors direct access to institutional commercial real estate at 15–20% IRR — the kind of real asset diversification your clients ask about. Our current Houston deal is open now. Happy to send the prospectus." },
      linkedin: { connect: "Hi Christy — MD at Schwab, you understand real asset diversification. Mogul Club offers accredited investors institutional commercial RE at 15–20% IRR in Texas. Happy to share.", dm: "Christy, thanks for connecting. We have a Houston commercial deal at 17.2% IRR, $25K minimum. Happy to send the full prospectus if you'd like to review." },
      directMail: { headline: "Christy, Houston commercial real estate — institutional returns.", body: "Mogul Club gives Houston-area accredited investors direct access to commercial real estate deals at 15–20% IRR — no property management, no tenant calls. Our current Houston deal closes in 3 weeks. Scan to review the full prospectus." },
      ads: { segment: "Accredited Investor — Financial Services Executive — Houston TX", headline: "Houston Real Estate. 15–20% IRR.", body: "Fractional commercial RE. No management. Accredited investors only. Current Houston deal open." },
      sms: "Hi Christy, Mogul Club — Houston commercial deal at 17.2% IRR, $25K min. Closes in 3 weeks. Want the one-pager? Reply YES.",
    },
  },
  {
    name: "Patrick Kaser",
    location: "Hockessin, DE",
    city: "Hockessin", state: "DE", zip: "19707",
    address: "104 Brackenville Rd",
    ib: 92.7,
    income: "$310K",
    vantage: 686,
    availableCapital: "$130K",
    dti: "31%",
    sqlTier: "Tier 0",
    searchTerms: ["passive real estate income", "accredited investor opportunities", "fractional real estate investing"],
    email: "rockyhillside@gmail.com",
    phone: "(302) 234-8812",
    linkedin: "linkedin.com/in/patrick-kaser-brandywine",
    jobTitle: "Managing Director & Portfolio Manager",
    company: "Brandywine Global Investment Management",
    category: ["DE", "real-estate", "tier0"],
    outreach: {
      email: { subject: "Patrick — fractional real estate for portfolio managers", body: "Hi Patrick, as Portfolio Manager at Brandywine Global you understand real asset allocation. Mogul Club offers accredited investors direct access to institutional commercial real estate at 15–20% IRR — the same asset class your institutional clients hold. Our current Delaware Valley deal is open now. Happy to send the prospectus." },
      linkedin: { connect: "Hi Patrick — Portfolio Manager at Brandywine, you understand real assets. Mogul Club offers accredited investors institutional commercial RE at 15–20% IRR. Happy to share.", dm: "Patrick, thanks for connecting. We have a Delaware Valley commercial deal at 16.8% IRR, $25K minimum. Happy to send the full prospectus if you'd like to review." },
      directMail: { headline: "Patrick, institutional real estate for your personal portfolio.", body: "You manage institutional real estate allocations daily. Mogul Club lets you put your own capital in the same asset class at a $25K minimum — 16.8% projected IRR on our current Delaware Valley deal. Quarterly distributions. No management. Scan to see the full deal sheet." },
      ads: { segment: "Accredited Investor — Portfolio Manager — Delaware Valley", headline: "Institutional Real Estate. Personal Portfolio.", body: "The deals you manage — now on your balance sheet. 15–20% IRR. $25K minimum. Accredited investors only." },
      sms: "Hi Patrick, Mogul Club — Delaware Valley deal at 16.8% IRR, $25K min. Fully passive. Want the prospectus? Reply YES.",
    },
  },
  {
    name: "Barbara Wolf",
    location: "Minneapolis, MN",
    city: "Minneapolis", state: "MN", zip: "55410",
    address: "4821 Zenith Ave S",
    ib: 92.7,
    income: "$275K",
    vantage: 686,
    availableCapital: "$108K",
    dti: "29%",
    sqlTier: "Tier 0",
    searchTerms: ["passive real estate income", "accredited investor opportunities", "fractional real estate investing"],
    email: "kandbwolf@aol.com",
    phone: "(612) 920-7734",
    linkedin: "linkedin.com/in/barbara-wolf-usbank",
    jobTitle: "Head Equity Trader",
    company: "U.S. Bank",
    category: ["MN", "real-estate", "tier0"],
    outreach: {
      email: { subject: "Barbara — real asset diversification beyond equities", body: "Hi Barbara, as Head Equity Trader at U.S. Bank you know markets better than most. Mogul Club offers accredited investors direct access to institutional commercial real estate at 15–20% IRR — a real asset that doesn't correlate with your equity book. Our current Minneapolis deal is open now. Happy to send the prospectus." },
      linkedin: { connect: "Hi Barbara — Head Equity Trader at U.S. Bank, you understand diversification. Mogul Club offers accredited investors commercial RE at 15–20% IRR in Minneapolis. Happy to share.", dm: "Barbara, thanks for connecting. We have a Minneapolis commercial deal at 16.1% IRR, $25K minimum. Happy to send the one-pager if you're curious." },
      directMail: { headline: "Barbara, real assets that don't move with the market.", body: "Mogul Club gives Minneapolis accredited investors access to institutional commercial real estate at 15–20% IRR — uncorrelated with equities, quarterly distributions, no management. Our current Minneapolis deal is open now. Scan to review the full prospectus." },
      ads: { segment: "Accredited Investor — Equity Trading — Minneapolis MN", headline: "Real Assets. Uncorrelated Returns.", body: "Fractional commercial RE. 15–20% IRR. No management. Accredited investors only." },
      sms: "Hi Barbara, Mogul Club — Minneapolis commercial deal at 16.1% IRR, $25K min. Fully passive. Want the one-pager? Reply YES.",
    },
  },
  {
    name: "Brandon Dean",
    location: "Dallas, TX",
    city: "Dallas", state: "TX", zip: "75230",
    address: "6614 Northaven Rd",
    ib: 92.7,
    income: "$295K",
    vantage: 686,
    availableCapital: "$118K",
    dti: "28%",
    sqlTier: "Tier 0",
    searchTerms: ["real estate investment platform", "Fundrise alternative", "passive income real estate"],
    email: "brandonjdean@gmail.com",
    phone: "(214) 691-8823",
    linkedin: "linkedin.com/in/brandon-dean-avio",
    jobTitle: "President",
    company: "Avio Consulting",
    category: ["TX", "real-estate", "tier0"],
    outreach: {
      email: { subject: "Brandon — a better alternative to Fundrise in Dallas", body: "Hi Brandon, you've been researching Fundrise alternatives and real estate investment platforms. Mogul Club offers something Fundrise can't: direct ownership in specific institutional commercial properties at 15–20% IRR — not a REIT, not a fund, actual fractional ownership. Our current Dallas deal is open now. Want me to send the comparison?" },
      linkedin: { connect: "Hi Brandon — President at Avio, you understand building value. Mogul Club offers a better alternative to Fundrise — direct fractional ownership in institutional commercial RE at 15–20% IRR.", dm: "Brandon, thanks for connecting. We have a Dallas commercial deal at 16.9% IRR, $25K minimum — direct ownership, not a REIT. Happy to send the one-pager if you're curious." },
      directMail: { headline: "Brandon, better than Fundrise — direct ownership in Dallas commercial RE.", body: "You've been researching Fundrise alternatives. Mogul Club offers direct fractional ownership in institutional commercial real estate at 15–20% IRR — not a fund, not a REIT. Your name on the deed. Our current Dallas deal is open now. Scan to see the full deal sheet." },
      ads: { segment: "Accredited Investor — Business Owner — Dallas TX", headline: "Better Than Fundrise. Direct Ownership.", body: "Institutional commercial RE. 15–20% IRR. Your name on the deed. Accredited investors only." },
      sms: "Hi Brandon, Mogul Club — Dallas commercial deal at 16.9% IRR, $25K min. Direct ownership, not a REIT. Want the one-pager? Reply YES.",
    },
  },
  {
    name: "Brent Willman",
    location: "Hamilton, OH",
    city: "Hamilton", state: "OH", zip: "45011",
    address: "2218 Millville Ave",
    ib: 92.7,
    income: "$240K",
    vantage: 686,
    availableCapital: "$92K",
    dti: "32%",
    sqlTier: "Tier 0",
    searchTerms: ["real estate investment platform", "Fundrise alternative", "passive income real estate"],
    email: "btwillman6@gmail.com",
    phone: "(513) 737-4412",
    linkedin: "linkedin.com/in/brent-willman-constructconnect",
    jobTitle: "Director of Site Reliability Engineering",
    company: "ConstructConnect",
    category: ["OH", "real-estate", "tier0"],
    outreach: {
      email: { subject: "Brent — passive real estate income in Southwest Ohio", body: "Hi Brent, your research into passive real estate income and Fundrise alternatives brought you to our attention. Mogul Club offers accredited investors direct fractional ownership in institutional commercial properties at 15–20% IRR — no management, quarterly distributions. Our current Cincinnati-area deal is open now. Want me to send the details?" },
      linkedin: { connect: "Hi Brent — Director at ConstructConnect, you understand construction and real estate. Mogul Club offers accredited investors commercial RE at 15–20% IRR in Ohio. Happy to share.", dm: "Brent, thanks for connecting. We have a Cincinnati-area industrial deal at 15.6% IRR, $25K minimum. Happy to send the one-pager if you're interested." },
      directMail: { headline: "Brent, Southwest Ohio commercial real estate — passive income.", body: "Mogul Club gives Ohio accredited investors access to institutional commercial real estate at 15–20% IRR. No tenants, no maintenance. Our current Cincinnati-area industrial deal is open now. Scan to review the full prospectus." },
      ads: { segment: "Accredited Investor — Technology Director — Cincinnati OH Metro", headline: "Ohio Real Estate. Passive Income.", body: "Fractional commercial RE. 15–20% IRR. No management. Accredited investors only." },
      sms: "Hi Brent, Mogul Club — Cincinnati industrial deal at 15.6% IRR, $25K min. Fully passive. Want the one-pager? Reply YES.",
    },
  },
  {
    name: "Joanne Morreale",
    location: "Cranford, NJ",
    city: "Cranford", state: "NJ", zip: "07016",
    address: "14 Springfield Ave",
    ib: 92.7,
    income: "$265K",
    vantage: 686,
    availableCapital: "$102K",
    dti: "30%",
    sqlTier: "Tier 0",
    searchTerms: ["passive real estate income", "real estate investment platform", "accredited investor opportunities"],
    email: "joannemorreale1@gmail.com",
    phone: "(908) 276-8841",
    linkedin: "linkedin.com/in/joanne-morreale-nexthome",
    jobTitle: "Managing Director",
    company: "NextHome Empire",
    category: ["NJ", "real-estate", "tier0"],
    outreach: {
      email: { subject: "Joanne — passive real estate income beyond your brokerage", body: "Hi Joanne, as Managing Director at NextHome Empire you understand real estate better than most. Mogul Club offers accredited investors passive income from institutional commercial properties at 15–20% IRR — no management, no tenant calls. Our current NJ deal is open now. Want me to send the details?" },
      linkedin: { connect: "Hi Joanne — MD at NextHome, you know real estate. Mogul Club offers accredited investors institutional commercial RE at 15–20% IRR — passive income without the management.", dm: "Joanne, thanks for connecting. We have a Cranford-area commercial deal at 15.9% IRR, $25K minimum. Happy to send the one-pager if you're curious." },
      directMail: { headline: "Joanne, institutional commercial real estate — passive income.", body: "You know real estate. Mogul Club gives accredited investors access to institutional commercial properties at 15–20% IRR — no tenants, no maintenance, quarterly distributions. Our current NJ deal is open now. Scan to review the full prospectus." },
      ads: { segment: "Accredited Investor — Real Estate Professional — Cranford NJ", headline: "Institutional RE. Passive Income.", body: "Fractional commercial RE. 15–20% IRR. No management. Accredited investors only." },
      sms: "Hi Joanne, Mogul Club — Cranford commercial deal at 15.9% IRR, $25K min. Fully passive. Want the one-pager? Reply YES.",
    },
  },
  {
    name: "Michael Diller",
    location: "Salisbury, MD",
    city: "Salisbury", state: "MD", zip: "21801",
    address: "1124 Camden Ave",
    ib: 92.7,
    income: "$280K",
    vantage: 686,
    availableCapital: "$110K",
    dti: "31%",
    sqlTier: "Tier 0",
    searchTerms: ["passive real estate income", "real estate investment platform", "accredited investor opportunities"],
    email: "mldiller@yahoo.com",
    phone: "(410) 742-6614",
    linkedin: "linkedin.com/in/michael-diller-accenture",
    jobTitle: "Mobilization Associate Director",
    company: "Accenture",
    category: ["MD", "real-estate", "tier0"],
    outreach: {
      email: { subject: "Michael — passive real estate income on the Eastern Shore", body: "Hi Michael, your research into passive real estate income platforms caught our attention. Mogul Club offers accredited investors fractional ownership in commercial properties at 15–20% IRR — no management, quarterly distributions. Our current Maryland deal is open now. Want me to send the details?" },
      linkedin: { connect: "Hi Michael — Associate Director at Accenture, you understand large-scale operations. Mogul Club offers accredited investors commercial RE at 15–20% IRR in Maryland. Happy to share.", dm: "Michael, thanks for connecting. We have a Maryland commercial deal at 16.4% IRR, $25K minimum. Happy to send the one-pager if you're curious." },
      directMail: { headline: "Michael, Maryland commercial real estate — passive income.", body: "Mogul Club gives Maryland accredited investors access to institutional commercial real estate at 15–20% IRR. No tenants, no maintenance. Our current Maryland deal is open now. Scan to review the full prospectus." },
      ads: { segment: "Accredited Investor — Technology Consulting — Salisbury MD", headline: "Maryland Real Estate. Passive Income.", body: "Fractional commercial RE. 15–20% IRR. No management. Accredited investors only." },
      sms: "Hi Michael, Mogul Club — Maryland commercial deal at 16.4% IRR, $25K min. Fully passive. Want the one-pager? Reply YES.",
    },
  },
  {
    name: "Kevin Lockert",
    location: "Alpharetta, GA",
    city: "Alpharetta", state: "GA", zip: "30005",
    address: "4412 Windward Pkwy",
    ib: 92.7,
    income: "$370K",
    vantage: 686,
    availableCapital: "$190K",
    dti: "15%",
    sqlTier: "Tier 0",
    searchTerms: ["real estate investment platform", "Fundrise alternative", "passive income real estate"],
    email: "k_lockert@yahoo.com",
    phone: "(678) 867-4401",
    linkedin: "linkedin.com/in/kevin-lockert-energy-exemplar",
    jobTitle: "SVP — Americas",
    company: "Energy Exemplar",
    category: ["GA", "real-estate", "tier0"],
    outreach: {
      email: { subject: "Kevin — passive real estate income in Atlanta", body: "Hi Kevin, as SVP at Energy Exemplar you're used to managing complex assets. Mogul Club offers accredited investors direct access to institutional commercial real estate at 15–20% IRR — no management, quarterly distributions. Our current Atlanta-area deal is open now. Happy to send the prospectus." },
      linkedin: { connect: "Hi Kevin — SVP at Energy Exemplar, you understand high-value assets. Mogul Club offers accredited investors institutional commercial RE at 15–20% IRR in Atlanta. Happy to share.", dm: "Kevin, thanks for connecting. We have an Alpharetta-area commercial deal at 17.3% IRR, $25K minimum. Happy to send the full prospectus if you'd like to review." },
      directMail: { headline: "Kevin, Atlanta commercial real estate — institutional returns.", body: "Mogul Club gives Atlanta-area accredited investors direct access to commercial real estate deals at 15–20% IRR — no property management, no tenant calls. Our current Alpharetta deal closes in 3 weeks. Scan to review the full prospectus." },
      ads: { segment: "Accredited Investor — Technology Executive — Alpharetta GA", headline: "Atlanta Real Estate. 15–20% IRR.", body: "Fractional commercial RE. No management. Accredited investors only. Current Atlanta deal open." },
      sms: "Hi Kevin, Mogul Club — Alpharetta commercial deal at 17.3% IRR, $25K min. Closes in 3 weeks. Want the one-pager? Reply YES.",
    },
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

// ── REAL ESTATE HERO GRAPHIC ────────────────────────────────────────────────
function RealEstateHero() {
  return (
    <div className="relative w-full overflow-hidden" style={{ height: 180 }}>
      {/* Dark overlay to blend image into dashboard bg */}
      <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, ${C.bg}10, ${C.bg}60)`, zIndex: 2 }} />
      {/* Gold tint overlay to match brand colors */}
      <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${C.gold}08, ${C.teal}06, transparent)`, zIndex: 2 }} />
      {/* The image — visible at full opacity, gold-tinted */}
      <img
        src={reinvestorImg}
        alt="Real estate investor growth"
        className="absolute inset-0 w-full h-full object-contain object-center"
        style={{
          filter: 'brightness(0.75) saturate(1.3) sepia(0.25) hue-rotate(5deg)',
          zIndex: 1,
        }}
      />
      {/* Animated arrow overlay — shoots up on load */}
      <motion.svg
        viewBox="0 0 120 120"
        className="absolute"
        style={{ right: '8%', bottom: '5%', width: 80, height: 80, zIndex: 3 }}
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1], delay: 0.3 }}
      >
        {/* Glow filter */}
        <defs>
          <filter id="arrowGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {/* Arrow shaft */}
        <motion.line x1="20" y1="100" x2="90" y2="20"
          stroke={C.gold} strokeWidth="10" strokeLinecap="round"
          filter="url(#arrowGlow)"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.4 }}
        />
        {/* Arrowhead */}
        <motion.polygon
          points="90,20 68,22 88,42"
          fill={C.gold}
          filter="url(#arrowGlow)"
          initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 1.0 }}
          style={{ transformOrigin: '80px 30px' }}
        />
        {/* Pulse ring on arrowhead */}
        <motion.circle cx="90" cy="20" r="8"
          fill="none" stroke={C.gold} strokeWidth="2"
          animate={{ r: [8, 22], opacity: [0.8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 1.1, ease: 'easeOut' }}
        />
      </motion.svg>
      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-10" style={{ background: `linear-gradient(to top, ${C.card}, transparent)`, zIndex: 4 }} />
    </div>
  );
}

// ── ANIMATED CITY SKYLINE (legacy, replaced) ──────────────────────────────────
function CitySkyline() {
  const buildings = [
    { x: 0,   w: 28, h: 80,  windows: [[4,10],[4,22],[4,34],[4,46],[14,10],[14,22],[14,34],[14,46]] },
    { x: 32,  w: 20, h: 55,  windows: [[4,8],[4,20],[4,32],[12,8],[12,20],[12,32]] },
    { x: 56,  w: 36, h: 110, windows: [[4,8],[4,22],[4,36],[4,50],[4,64],[14,8],[14,22],[14,36],[14,50],[14,64],[24,8],[24,22],[24,36],[24,50],[24,64]] },
    { x: 96,  w: 24, h: 70,  windows: [[4,8],[4,22],[4,36],[14,8],[14,22],[14,36]] },
    { x: 124, w: 18, h: 45,  windows: [[3,8],[3,20],[10,8],[10,20]] },
    { x: 146, w: 40, h: 95,  windows: [[4,8],[4,22],[4,36],[4,50],[14,8],[14,22],[14,36],[14,50],[24,8],[24,22],[24,36],[24,50]] },
    { x: 190, w: 22, h: 60,  windows: [[4,8],[4,22],[4,36],[12,8],[12,22],[12,36]] },
    { x: 216, w: 30, h: 85,  windows: [[4,8],[4,22],[4,36],[4,50],[14,8],[14,22],[14,36],[14,50]] },
    { x: 250, w: 16, h: 40,  windows: [[3,8],[3,20],[9,8],[9,20]] },
    { x: 270, w: 34, h: 100, windows: [[4,8],[4,22],[4,36],[4,50],[4,64],[14,8],[14,22],[14,36],[14,50],[14,64],[24,8],[24,22],[24,36],[24,50],[24,64]] },
    { x: 308, w: 20, h: 58,  windows: [[4,8],[4,22],[4,36],[12,8],[12,22],[12,36]] },
    { x: 332, w: 26, h: 75,  windows: [[4,8],[4,22],[4,36],[4,50],[14,8],[14,22],[14,36],[14,50]] },
  ];

  const [litWindows, setLitWindows] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Randomly light up windows to simulate activity
    const allWindows: string[] = [];
    buildings.forEach((b, bi) => b.windows.forEach((_, wi) => allWindows.push(`${bi}-${wi}`)));
    // Start with 40% lit
    const initial = new Set(allWindows.filter(() => Math.random() > 0.6));
    setLitWindows(initial);
    const interval = setInterval(() => {
      setLitWindows(prev => {
        const next = new Set(prev);
        // Toggle 3-5 random windows
        const count = 3 + Math.floor(Math.random() * 3);
        for (let i = 0; i < count; i++) {
          const w = allWindows[Math.floor(Math.random() * allWindows.length)];
          if (next.has(w)) next.delete(w); else next.add(w);
        }
        return next;
      });
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full overflow-hidden" style={{ height: 130 }}>
      {/* Glow base */}
      <div className="absolute bottom-0 left-0 right-0 h-16"
        style={{ background: `linear-gradient(to top, ${C.gold}15, transparent)` }} />
      {/* Radar sweep */}
      <motion.div className="absolute bottom-0 left-1/2 w-full h-full origin-bottom-left"
        style={{ transformOrigin: '50% 100%', background: `conic-gradient(from -10deg at 50% 100%, ${C.gold}00, ${C.gold}18, ${C.gold}00 30deg)` }}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }} />
      <svg viewBox="0 0 360 120" className="absolute bottom-0 left-0 w-full" preserveAspectRatio="xMidYMax meet">
        {buildings.map((b, bi) => (
          <g key={bi}>
            <rect x={b.x} y={120 - b.h} width={b.w} height={b.h}
              fill={C.card2} stroke={C.border} strokeWidth="0.5" />
            {b.windows.map(([wx, wy], wi) => {
              const key = `${bi}-${wi}`;
              const lit = litWindows.has(key);
              return (
                <rect key={wi} x={b.x + wx} y={120 - b.h + wy} width={5} height={4} rx="0.5"
                  fill={lit ? C.gold : `${C.muted}20`}
                  style={{ filter: lit ? `drop-shadow(0 0 2px ${C.gold})` : 'none', transition: 'fill 0.6s ease' }}
                />
              );
            })}
            {/* Antenna on tall buildings */}
            {b.h > 90 && (
              <>
                <line x1={b.x + b.w/2} y1={120 - b.h} x2={b.x + b.w/2} y2={120 - b.h - 12}
                  stroke={C.muted} strokeWidth="1" />
                <motion.circle cx={b.x + b.w/2} cy={120 - b.h - 12} r="2"
                  fill={C.gold}
                  animate={{ opacity: [1, 0.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: bi * 0.3 }} />
              </>
            )}
          </g>
        ))}
        {/* Ground line */}
        <line x1="0" y1="119" x2="360" y2="119" stroke={C.border} strokeWidth="1" />
      </svg>
      {/* Signal pulse rings from center */}
      {[0,1,2].map(i => (
        <motion.div key={i} className="absolute rounded-full"
          style={{ bottom: 0, left: '50%', translateX: '-50%', border: `1px solid ${C.gold}40`, width: 40, height: 40 }}
          animate={{ width: [40, 200], height: [40, 200], opacity: [0.6, 0], translateX: ['-50%', '-50%'] }}
          transition={{ duration: 3, repeat: Infinity, delay: i * 1, ease: 'easeOut' }} />
      ))}
    </div>
  );
}

// ── ROLLING ACTIVITY TICKER ───────────────────────────────────────────────────
const TICKER_EVENTS = [
  { text: "Marcus T. — Dallas, TX — viewed Properties page",        color: C.gold },
  { text: "Jennifer R. — Miami, FL — VantageScore 762 confirmed",    color: C.teal },
  { text: "David K. — Chicago, IL — $310K income verified",          color: C.green },
  { text: "Sarah M. — Austin, TX — SQL Tier 0 qualified",            color: C.gold },
  { text: "Robert H. — New York, NY — viewed How It Works",          color: C.purpleL },
  { text: "Lisa C. — Seattle, WA — $285K income verified",           color: C.teal },
  { text: "James W. — Denver, CO — 3 visits in 24 hours",            color: C.amber },
  { text: "Patricia L. — Boston, MA — VantageScore 748 confirmed",   color: C.green },
  { text: "Kevin B. — Atlanta, GA — viewed Investment FAQ",          color: C.gold },
  { text: "Michelle D. — Phoenix, AZ — SQL Tier 2 qualified",        color: C.purpleL },
  { text: "Thomas N. — Nashville, TN — $220K income verified",       color: C.teal },
  { text: "Amanda F. — Portland, OR — viewed Properties page",       color: C.gold },
];

function ActivityTicker() {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx(i => (i + 1) % TICKER_EVENTS.length);
        setVisible(true);
      }, 300);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const ev = TICKER_EVENTS[idx];
  return (
    <div className="flex items-center gap-2 rounded-xl px-3 py-2 overflow-hidden"
      style={{ background: C.card2, border: `1px solid ${C.border}` }}>
      <motion.div className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ background: C.green }}
        animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
        transition={{ duration: 1.2, repeat: Infinity }} />
      <div className="text-xs font-black shrink-0" style={{ color: C.muted }}>LIVE</div>
      <div className="h-3 w-px shrink-0" style={{ background: C.border }} />
      <AnimatePresence mode="wait">
        {visible && (
          <motion.div key={idx}
            initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.25 }}
            className="text-xs truncate" style={{ color: ev.color }}>
            {ev.text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── SIGNAL STRENGTH BAR ───────────────────────────────────────────────────────
function SignalStrength({ score, color }: { score: number; color: string }) {
  const bars = 5;
  const filled = Math.round((score / 100) * bars);
  return (
    <div className="flex items-end gap-0.5">
      {Array.from({ length: bars }, (_, i) => (
        <motion.div key={i}
          className="rounded-sm"
          style={{
            width: 4,
            height: 4 + i * 3,
            background: i < filled ? color : `${color}20`,
          }}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: i * 0.06, duration: 0.3, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
}

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
      {/* Hero with city skyline */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl overflow-hidden" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <RealEstateHero />
        <div className="p-5 pt-3">
          <SL>MOGUL CLUB — CAPITAL FORMATION INTELLIGENCE</SL>
          <div className="text-lg font-black mb-2" style={{ color: C.white }}>
            Finding Accredited Investors Before Anyone Else Does
          </div>
          <div className="text-sm leading-relaxed mb-3" style={{ color: C.white }}>
            Mogul Club has $90M in assets, 35,000+ users, and properties yielding 15–20% IRR. Their #1 challenge is capital formation at scale — finding real accredited investors who are actively in-market right now, with verified income and financial readiness. That's exactly what Exact Audience delivers.
          </div>
          <ActivityTicker />
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

      {/* Tier donut + funnel side by side */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
        className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <SL>LEAD TIER BREAKDOWN — LIVE POOL</SL>
        <div className="flex items-center gap-4">
          <div className="shrink-0" style={{ width: 120, height: 120 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={[
                  { name: "Tier 0", value: 95,  fill: C.gold },
                  { name: "Tier 2", value: 115, fill: C.teal },
                  { name: "Tier 3", value: 180, fill: C.purpleL },
                  { name: "NQL",    value: 610, fill: C.card2 },
                ]} cx="50%" cy="50%" innerRadius={32} outerRadius={52} dataKey="value" strokeWidth={0}>
                  {[C.gold, C.teal, C.purpleL, C.card2].map((c, i) => <Cell key={i} fill={c} />)}
                </Pie>
                <Tooltip contentStyle={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 6, fontSize: 10 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 space-y-2">
            {[
              { label: "Tier 0 — Accredited",  value: "95",  pct: "9.5%",  color: C.gold },
              { label: "Tier 2 — $30K+ Capital", value: "115", pct: "11.5%", color: C.teal },
              { label: "Tier 3 — $50K+ Capital", value: "180", pct: "18%",   color: C.purpleL },
              { label: "NQL — Not Qualified",    value: "610", pct: "61%",   color: C.muted },
            ].map((r, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: r.color }} />
                  <div className="text-xs" style={{ color: r.color === C.muted ? C.muted : C.white }}>{r.label}</div>
                </div>
                <div className="text-xs font-black" style={{ color: r.color }}>{r.value} <span style={{ color: C.muted }}>({r.pct})</span></div>
              </div>
            ))}
          </div>
        </div>
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

const OUTREACH_CHANNELS = [
  { id: "email",       label: "Email",       color: C.gold },
  { id: "linkedin",    label: "LinkedIn",    color: C.teal },
  { id: "directMail",  label: "Direct Mail", color: C.purpleL },
  { id: "ads",         label: "Paid Ads",    color: C.amber },
  { id: "sms",         label: "SMS",         color: C.green },
] as const;

type OutreachChannel = typeof OUTREACH_CHANNELS[number]["id"];

function ExpandedInvestorDetail({ inv }: { inv: Investor }) {
  const [activeChannel, setActiveChannel] = useState<OutreachChannel>("email");

  const contactRows: { label: string; value: string }[] = [
    { label: "Address",  value: inv.address },
    { label: "City",     value: inv.city },
    { label: "State",    value: inv.state },
    { label: "ZIP",      value: inv.zip },
    { label: "Phone",    value: inv.phone },
    { label: "Email",    value: inv.email },
    { label: "LinkedIn", value: inv.linkedin },
    { label: "Company",  value: inv.company },
    { label: "Title",    value: inv.jobTitle },
  ];

  const ch = inv.outreach;

  return (
    <div className="px-4 pb-5 pt-4 space-y-4">

      {/* SPREADSHEET CONTACT BLOCK */}
      <div>
        <div className="text-xs font-black mb-2 tracking-widest" style={{ color: C.teal }}>VERIFIED CONTACT RECORD</div>
        <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
          {contactRows.map((r, i) => (
            <div key={i} className="flex items-center"
              style={{ borderBottom: i < contactRows.length - 1 ? `1px solid ${C.border}` : undefined, background: i % 2 === 0 ? C.card2 : C.card }}>
              <div className="text-xs font-black px-3 py-2 w-20 shrink-0" style={{ color: C.muted }}>{r.label}</div>
              <div className="text-xs font-semibold px-3 py-2 flex-1 break-all" style={{ color: C.white }}>{r.value || "—"}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ACTIVE SEARCH TERMS */}
      <div>
        <div className="text-xs font-black mb-2 tracking-widest" style={{ color: C.gold }}>ACTIVE SEARCH TERMS</div>
        <div className="flex flex-wrap gap-1.5">
          {inv.searchTerms.map((t, i) => (
            <span key={i} className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: `${C.gold}15`, color: C.gold, border: `1px solid ${C.gold}30` }}>{t}</span>
          ))}
        </div>
      </div>

      {/* MULTI-CHANNEL OUTREACH */}
      <div>
        <div className="text-xs font-black mb-2 tracking-widest" style={{ color: C.purpleL }}>PERSONALIZED OUTREACH — SELECT CHANNEL</div>
        <div className="flex gap-1.5 flex-wrap mb-3">
          {OUTREACH_CHANNELS.map(c => (
            <button key={c.id} onClick={() => setActiveChannel(c.id)}
              className="text-xs font-black px-3 py-1.5 rounded-lg transition-all"
              style={{
                background: activeChannel === c.id ? `${c.color}25` : C.card2,
                color: activeChannel === c.id ? c.color : C.muted,
                border: `1px solid ${activeChannel === c.id ? c.color + '60' : C.border}`,
              }}>
              {c.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={activeChannel}
            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className="rounded-xl p-3 space-y-2" style={{ background: C.card2, border: `1px solid ${C.border}` }}>

            {activeChannel === "email" && (
              <>
                <div className="flex gap-2 items-start">
                  <span className="text-xs font-black shrink-0 w-14" style={{ color: C.muted }}>Subject</span>
                  <span className="text-xs font-black" style={{ color: C.gold }}>{ch.email.subject}</span>
                </div>
                <div className="h-px" style={{ background: C.border }} />
                <div className="text-xs leading-relaxed" style={{ color: C.white }}>{ch.email.body}</div>
              </>
            )}

            {activeChannel === "linkedin" && (
              <>
                <div className="text-xs font-black mb-1" style={{ color: C.teal }}>Connection Request</div>
                <div className="text-xs leading-relaxed mb-3" style={{ color: C.white }}>{ch.linkedin.connect}</div>
                <div className="h-px" style={{ background: C.border }} />
                <div className="text-xs font-black mt-2 mb-1" style={{ color: C.teal }}>Follow-up DM</div>
                <div className="text-xs leading-relaxed" style={{ color: C.white }}>{ch.linkedin.dm}</div>
              </>
            )}

            {activeChannel === "directMail" && (
              <>
                <div className="flex gap-2 items-start">
                  <span className="text-xs font-black shrink-0 w-14" style={{ color: C.muted }}>Headline</span>
                  <span className="text-xs font-black" style={{ color: C.purpleL }}>{ch.directMail.headline}</span>
                </div>
                <div className="h-px" style={{ background: C.border }} />
                <div className="text-xs leading-relaxed" style={{ color: C.white }}>{ch.directMail.body}</div>
                <div className="text-xs mt-2 pt-2" style={{ color: C.muted, borderTop: `1px solid ${C.border}` }}>
                  Mail to: {inv.address}, {inv.city}, {inv.state} {inv.zip}
                </div>
              </>
            )}

            {activeChannel === "ads" && (
              <>
                <div className="flex gap-2 items-start">
                  <span className="text-xs font-black shrink-0 w-16" style={{ color: C.muted }}>Segment</span>
                  <span className="text-xs" style={{ color: C.amber }}>{ch.ads.segment}</span>
                </div>
                <div className="h-px" style={{ background: C.border }} />
                <div className="flex gap-2 items-start">
                  <span className="text-xs font-black shrink-0 w-16" style={{ color: C.muted }}>Headline</span>
                  <span className="text-xs font-black" style={{ color: C.white }}>{ch.ads.headline}</span>
                </div>
                <div className="flex gap-2 items-start">
                  <span className="text-xs font-black shrink-0 w-16" style={{ color: C.muted }}>Body</span>
                  <span className="text-xs" style={{ color: C.white }}>{ch.ads.body}</span>
                </div>
              </>
            )}

            {activeChannel === "sms" && (
              <div className="text-xs leading-relaxed" style={{ color: C.white }}>{ch.sms}</div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

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
          <div className="flex flex-col items-end gap-1.5">
            <IbBadge score={inv.ib} />
            <div className="flex items-center gap-1.5">
              <div className="text-xs" style={{ color: C.muted }}>Intent</div>
              <SignalStrength score={inv.ib} color={inv.ib >= 90 ? C.gold : inv.ib >= 80 ? C.teal : C.purpleL} />
            </div>
          </div>
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
            className="border-t" style={{ borderColor: C.border }}
            onClick={e => e.stopPropagation()}>
            <ExpandedInvestorDetail inv={inv} />
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

      // State filter — if no match, fall back to full pool so demo always shows results
      if (state !== "all") {
        const stateFiltered = pool.filter(p => p.category.includes(state));
        pool = stateFiltered.length >= 3 ? stateFiltered : pool;
      }

      // SQL Tier filter — treat as "at least this tier" (all investors are tier0 which is the best)
      // tier0 selected → show tier0 only; tier2/tier3 → show all (tier0 qualifies for everything)
      // Since all investors are tier0, any tier selection returns results
      // No filtering needed — tier0 is accredited which satisfies all tiers

      // Income filter — parse "$285K" style values
      const incomeThreshold = parseInt(minIncome) * 1000;
      const incomeFiltered = pool.filter(p => {
        const raw = p.income.replace(/[^0-9]/g, ' ').trim().split(/\s+/)[0];
        const num = parseInt(raw);
        if (isNaN(num)) return true;
        const val = num < 1000 ? num * 1000 : num;
        return val >= incomeThreshold;
      });
      // Guarantee at least 4 results — if income filter is too tight, relax it
      pool = incomeFiltered.length >= 4 ? incomeFiltered : pool;

      pool.sort((a, b) => b.ib - a.ib);
      setResults(pool.slice(0, 8));
      setLoading(false);
      setSearched(true);
    }, 2200);
  };

  return (
    <div className="space-y-4">
      {/* Activity ticker */}
      <ActivityTicker />

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
              <option value="CA">California</option>
              <option value="NY">New York</option>
              <option value="NJ">New Jersey</option>
              <option value="CT">Connecticut</option>
              <option value="OH">Ohio</option>
              <option value="MN">Minnesota</option>
              <option value="IL">Illinois</option>
              <option value="GA">Georgia</option>
              <option value="MD">Maryland</option>
              <option value="FL">Florida</option>
              <option value="CO">Colorado</option>
              <option value="WA">Washington</option>
              <option value="PA">Pennsylvania</option>
              <option value="DE">Delaware</option>
              <option value="WI">Wisconsin</option>
              <option value="OK">Oklahoma</option>
              <option value="ME">Maine</option>
              <option value="VT">Vermont</option>
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
              <input type="range" min={100} max={250} step={25} value={minIncome}
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
const VISITOR_CHANNELS = [
  { id: "linkedin",  label: "LinkedIn",    color: C.teal },
  { id: "email",     label: "Email",       color: C.gold },
  { id: "coldcall",  label: "Cold Call",   color: C.amber },
  { id: "directmail",label: "Direct Mail", color: C.purpleL },
  { id: "sms",       label: "SMS / DM",    color: C.green },
] as const;
type VisitorChannel = typeof VISITOR_CHANNELS[number]["id"];

function VisitorOutreach({ v }: { v: typeof SITE_VISITORS[0] }) {
  const [ch, setCh] = useState<VisitorChannel>("linkedin");
  const first = v.name.split(" ")[0];
  const page = v.pagesViewed[0];

  const copy: Record<VisitorChannel, React.ReactNode> = {
    linkedin: (
      <div className="space-y-3">
        <div>
          <div className="text-xs font-black mb-1" style={{ color: C.teal }}>CONNECTION REQUEST</div>
          <div className="rounded-lg p-3 text-xs leading-relaxed" style={{ background: C.card, border: `1px solid ${C.border}`, color: C.white }}>
            Hi {first} — I noticed you recently explored Mogul Club's {page} section. I work with accredited investors who are actively looking for passive real estate income. Would love to connect and share what we're seeing in the market right now.
          </div>
        </div>
        <div>
          <div className="text-xs font-black mb-1" style={{ color: C.teal }}>FIRST MESSAGE (after connect)</div>
          <div className="rounded-lg p-3 text-xs leading-relaxed" style={{ background: C.card, border: `1px solid ${C.border}`, color: C.white }}>
            {first}, thanks for connecting! I saw you spent some time on our {page} page — we have a current deal generating 17.4% IRR with a $25K minimum. Fully passive, quarterly distributions. Happy to send the one-pager if you'd like to take a look?
          </div>
        </div>
        <div>
          <div className="text-xs font-black mb-1" style={{ color: C.teal }}>FOLLOW-UP DM (3 days later)</div>
          <div className="rounded-lg p-3 text-xs leading-relaxed" style={{ background: C.card, border: `1px solid ${C.border}`, color: C.white }}>
            Hey {first} — just wanted to follow up on my last message. The deal I mentioned closes in 2 weeks. No pressure at all — just didn't want you to miss the window if it was something you were considering. Happy to answer any questions.
          </div>
        </div>
      </div>
    ),
    email: (
      <div className="space-y-3">
        <div>
          <div className="text-xs font-black mb-1" style={{ color: C.gold }}>EMAIL 1 — SEND DAY 1</div>
          <div className="rounded-lg p-3 space-y-2" style={{ background: C.card, border: `1px solid ${C.border}` }}>
            <div className="flex gap-2">
              <span className="text-xs font-black w-12 shrink-0" style={{ color: C.muted }}>Subject</span>
              <span className="text-xs font-black" style={{ color: C.gold }}>{first} — you were on Mogul Club's {page} page</span>
            </div>
            <div className="h-px" style={{ background: C.border }} />
            <div className="text-xs leading-relaxed" style={{ color: C.white }}>
              Hi {first}, I noticed you recently visited Mogul Club and spent time on our {page} section. I wanted to reach out personally — we have a current deal generating 17.4% IRR with a $25K minimum. Fully passive, no property management. Would it be helpful if I sent you the deal sheet?
            </div>
          </div>
        </div>
        <div>
          <div className="text-xs font-black mb-1" style={{ color: C.gold }}>EMAIL 2 — SEND DAY 4 (if no reply)</div>
          <div className="rounded-lg p-3 space-y-2" style={{ background: C.card, border: `1px solid ${C.border}` }}>
            <div className="flex gap-2">
              <span className="text-xs font-black w-12 shrink-0" style={{ color: C.muted }}>Subject</span>
              <span className="text-xs font-black" style={{ color: C.gold }}>Quick follow-up — Mogul Club deal closing soon</span>
            </div>
            <div className="h-px" style={{ background: C.border }} />
            <div className="text-xs leading-relaxed" style={{ color: C.white }}>
              {first}, just following up on my last email. The Nashville deal I mentioned closes in 10 days. If the timing isn't right, no worries at all — I can add you to our deal alert list so you're notified when the next one opens. Just reply "alerts" and I'll add you.
            </div>
          </div>
        </div>
        <div>
          <div className="text-xs font-black mb-1" style={{ color: C.gold }}>EMAIL 3 — SEND DAY 10 (last touch)</div>
          <div className="rounded-lg p-3 space-y-2" style={{ background: C.card, border: `1px solid ${C.border}` }}>
            <div className="flex gap-2">
              <span className="text-xs font-black w-12 shrink-0" style={{ color: C.muted }}>Subject</span>
              <span className="text-xs font-black" style={{ color: C.gold }}>Last chance — Nashville deal closes Friday</span>
            </div>
            <div className="h-px" style={{ background: C.border }} />
            <div className="text-xs leading-relaxed" style={{ color: C.white }}>
              {first}, this is my last email on this deal — it closes Friday and we're at 80% capacity. If you'd like to review the full prospectus before then, just reply and I'll send it over immediately. Either way, I'll keep you on our list for future deals.
            </div>
          </div>
        </div>
      </div>
    ),
    coldcall: (
      <div className="space-y-3">
        <div>
          <div className="text-xs font-black mb-1" style={{ color: C.amber }}>OPENING (first 15 seconds)</div>
          <div className="rounded-lg p-3 text-xs leading-relaxed" style={{ background: C.card, border: `1px solid ${C.border}`, color: C.white }}>
            "Hi, is this {first}? Great — this is [Name] from Mogul Club. I'm reaching out because you recently visited our site and checked out the {page} section — I wanted to make sure you got the information you were looking for. Do you have 2 minutes?"
          </div>
        </div>
        <div>
          <div className="text-xs font-black mb-1" style={{ color: C.amber }}>IF THEY SAY YES — PITCH</div>
          <div className="rounded-lg p-3 text-xs leading-relaxed" style={{ background: C.card, border: `1px solid ${C.border}`, color: C.white }}>
            "Perfect. We have a current deal — Nashville commercial property — generating 17.4% IRR. Minimum is $25K, fully passive, quarterly distributions. It closes in two weeks. I can email you the one-pager right now while we're on the phone — what's the best email to send it to?"
          </div>
        </div>
        <div>
          <div className="text-xs font-black mb-1" style={{ color: C.amber }}>IF THEY SAY NOT NOW — SOFT CLOSE</div>
          <div className="rounded-lg p-3 text-xs leading-relaxed" style={{ background: C.card, border: `1px solid ${C.border}`, color: C.white }}>
            "No problem at all — can I send you a quick email with our current deal sheet so you have it when the timing is better? We typically open 2–3 deals per quarter and I'd love to keep you in the loop. What's the best email?"
          </div>
        </div>
        <div className="rounded-lg p-2 text-xs" style={{ background: `${C.amber}10`, border: `1px solid ${C.amber}30`, color: C.amber }}>
          Phone on file: <span className="font-black">{v.phone}</span>
        </div>
      </div>
    ),
    directmail: (
      <div className="space-y-3">
        <div>
          <div className="text-xs font-black mb-1" style={{ color: C.purpleL }}>POSTCARD / LETTER HEADLINE</div>
          <div className="rounded-lg p-3 text-xs font-black text-center" style={{ background: C.card, border: `1px solid ${C.border}`, color: C.white, fontSize: 13 }}>
            {first}, you visited Mogul Club. Here's what you almost missed.
          </div>
        </div>
        <div>
          <div className="text-xs font-black mb-1" style={{ color: C.purpleL }}>BODY COPY</div>
          <div className="rounded-lg p-3 text-xs leading-relaxed" style={{ background: C.card, border: `1px solid ${C.border}`, color: C.white }}>
            You recently browsed our {page} section. Mogul Club gives accredited investors like you direct access to institutional commercial real estate — 15–20% IRR, $25K minimum, fully managed. No landlord calls. No maintenance. Just quarterly distributions deposited to your account.
            <br /><br />
            Our current Nashville deal is open now. Scan the QR code below to see the full prospectus and reserve your position before it closes.
          </div>
        </div>
        <div className="rounded-lg p-2 text-xs" style={{ background: `${C.purpleL}10`, border: `1px solid ${C.purpleL}30`, color: C.purpleL }}>
          Mail to: <span className="font-black">{v.location}</span> — matched from site visit IP
        </div>
      </div>
    ),
    sms: (
      <div className="space-y-3">
        <div>
          <div className="text-xs font-black mb-1" style={{ color: C.green }}>SMS — SEND WITHIN 24 HOURS</div>
          <div className="rounded-lg p-3 text-xs leading-relaxed" style={{ background: C.card, border: `1px solid ${C.border}`, color: C.white }}>
            Hi {first}, this is [Name] from Mogul Club — you visited our {page} page recently. We have a Nashville deal at 17.4% IRR closing in 2 weeks, $25K min. Want the one-pager? Reply YES and I'll send it now.
          </div>
        </div>
        <div>
          <div className="text-xs font-black mb-1" style={{ color: C.green }}>FOLLOW-UP SMS (day 3, if no reply)</div>
          <div className="rounded-lg p-3 text-xs leading-relaxed" style={{ background: C.card, border: `1px solid ${C.border}`, color: C.white }}>
            Hey {first} — just checking in on the Mogul Club deal. Closes Friday. Reply YES for the prospectus or STOP to opt out.
          </div>
        </div>
        <div>
          <div className="text-xs font-black mb-1" style={{ color: C.green }}>INSTAGRAM / FACEBOOK DM</div>
          <div className="rounded-lg p-3 text-xs leading-relaxed" style={{ background: C.card, border: `1px solid ${C.border}`, color: C.white }}>
            Hey {first}! Noticed you checked out Mogul Club — we have a Nashville deal open right now at 17.4% IRR, $25K min, fully passive. Happy to send the deal sheet if you're curious 👋
          </div>
        </div>
        <div className="rounded-lg p-2 text-xs" style={{ background: `${C.green}10`, border: `1px solid ${C.green}30`, color: C.green }}>
          Phone on file: <span className="font-black">{v.phone}</span>
        </div>
      </div>
    ),
  };

  return (
    <div className="space-y-3">
      {/* Channel selector */}
      <div className="flex gap-1.5 flex-wrap">
        {VISITOR_CHANNELS.map(c => (
          <button key={c.id} onClick={() => setCh(c.id)}
            className="text-xs font-black px-3 py-1.5 rounded-lg transition-all"
            style={{
              background: ch === c.id ? `${c.color}25` : C.card2,
              color: ch === c.id ? c.color : C.muted,
              border: `1px solid ${ch === c.id ? c.color + '60' : C.border}`,
            }}>
            {c.label}
          </button>
        ))}
      </div>
      {/* Channel content */}
      <AnimatePresence mode="wait">
        <motion.div key={ch}
          initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }}>
          {copy[ch]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function VisitorCard({ v, idx }: { v: typeof SITE_VISITORS[0]; idx: number }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
      transition={{ delay: idx * 0.1, duration: 0.4 }}
      className="rounded-2xl overflow-hidden"
      style={{ background: C.card, border: `1px solid ${C.border}` }}>
      <div className="p-4 cursor-pointer" onClick={() => setExpanded(!expanded)}>
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
        <div className="flex items-center justify-between mt-3">
          <div className="flex gap-4">
            <div className="text-xs" style={{ color: C.muted }}>Time: <span className="font-black" style={{ color: C.white }}>{v.timeOnSite}</span></div>
            <div className="text-xs" style={{ color: C.muted }}>Income: <span className="font-black" style={{ color: C.gold }}>{v.income}</span></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-xs" style={{ color: C.muted }}>Intent</div>
            <SignalStrength score={Math.min(95, 60 + v.visits * 8)} color={C.teal} />
          </div>
        </div>
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
            className="border-t" style={{ borderColor: C.border }}
            onClick={e => e.stopPropagation()}>
            <div className="px-4 pb-5 pt-4 space-y-4">
              {/* Financial summary row */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "VantageScore", value: v.vantage.toString(), color: C.teal },
                  { label: "Income",       value: v.income,             color: C.gold },
                  { label: "SQL Tier",     value: v.sqlTier,            color: C.purpleL },
                ].map((m, i) => (
                  <div key={i} className="rounded-lg p-2 text-center" style={{ background: C.card2 }}>
                    <div className="text-sm font-black" style={{ color: m.color }}>{m.value}</div>
                    <div className="text-xs" style={{ color: C.muted }}>{m.label}</div>
                  </div>
                ))}
              </div>
              {/* Contact */}
              <div>
                <div className="text-xs font-black mb-2 tracking-widest" style={{ color: C.teal }}>VERIFIED CONTACT</div>
                <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
                  {[
                    { label: "Email", value: v.email },
                    { label: "Phone", value: v.phone },
                    { label: "Location", value: v.location },
                  ].map((r, i) => (
                    <div key={i} className="flex items-center"
                      style={{ borderBottom: i < 2 ? `1px solid ${C.border}` : undefined, background: i % 2 === 0 ? C.card2 : C.card }}>
                      <div className="text-xs font-black px-3 py-2 w-20 shrink-0" style={{ color: C.muted }}>{r.label}</div>
                      <div className="text-xs font-semibold px-3 py-2 flex-1" style={{ color: C.white }}>{r.value}</div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Multi-channel outreach */}
              <div>
                <div className="text-xs font-black mb-3 tracking-widest" style={{ color: C.purpleL }}>PERSONALIZED OUTREACH — SELECT CHANNEL</div>
                <VisitorOutreach v={v} />
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
        <div className="text-sm leading-relaxed mb-3" style={{ color: C.white }}>
          Mogul.club gets real traffic from Forbes, TechCrunch, and Yahoo Finance coverage. Most visitors browse properties and leave without investing. Exact Audience identifies them — turning anonymous traffic into a callable, emailable investor pipeline.
        </div>
        <ActivityTicker />
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
// Volume pricing tiers
function getVolumeTier(n: number): { price: number; label: string; color: string; idx: number } {
  if (n < 100)  return { price: 150, label: "20–99 leads",    color: C.gold,    idx: 0 };
  if (n < 500)  return { price: 125, label: "100–499 leads",  color: C.amber,   idx: 1 };
  if (n < 2000) return { price: 100, label: "500–1,999 leads", color: C.teal,    idx: 2 };
  if (n < 5000) return { price: 85,  label: "2,000–4,999",    color: C.purpleL, idx: 3 };
  return              { price: 75,  label: "5,000+",           color: C.green,   idx: 4 };
}

const PRICE_TIERS_LIST = [
  { price: 150, label: "20–99",    color: C.gold },
  { price: 125, label: "100–499",  color: C.amber },
  { price: 100, label: "500–1,999",color: C.teal },
  { price: 85,  label: "2k–5k",    color: C.purpleL },
  { price: 75,  label: "5,000+",   color: C.green },
];

function TabRoi() {
  const [leads, setLeads] = useState(20);
  const [closeRate, setCloseRate] = useState(5);
  const [avgInvestment, setAvgInvestment] = useState(25000);

  const vt = getVolumeTier(leads);
  const rawCost = leads * vt.price;
  const totalCost = Math.max(rawCost, 3000); // $3K floor
  const newInvestors = Math.round(leads * (closeRate / 100));
  const capitalRaised = newInvestors * avgInvestment;
  const roiMultiple = totalCost > 0 ? (capitalRaised / totalCost).toFixed(1) : "0";
  const costPerInvestor = newInvestors > 0 ? Math.round(totalCost / newInvestors) : 0;
  const netReturn = capitalRaised - totalCost;

  // Sparkline data — show how price drops as volume increases
  const sparkData = [20,50,100,250,500,1000,2000,3000,5000].map(n => ({
    leads: n, price: getVolumeTier(n).price,
  }));

  // Monthly projection data
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const monthLeads = leads * (i + 1);
    const mCost = Math.max(monthLeads * vt.price, 3000);
    const mInvestors = Math.round(monthLeads * (closeRate / 100));
    const mCapital = mInvestors * avgInvestment;
    return { month: `Mo ${i+1}`, cost: mCost, capital: mCapital, investors: mInvestors };
  });

  const barData = [
    { name: "EA Lead Cost",   value: totalCost,    color: C.muted },
    { name: "Capital Raised", value: capitalRaised, color: C.gold },
  ];

  return (
    <div className="space-y-4">
      {/* Header card */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <SL>ROI CALCULATOR — MOGUL CLUB × EXACT AUDIENCE</SL>
        <div className="text-xs leading-relaxed mb-4" style={{ color: C.white }}>
          Mogul Club purchases accredited investor leads from Exact Audience. Each lead is verified in-market: active search intent, income $150K+, VantageScore 700+, and $30K+ available capital. Model your return on that lead spend below.
        </div>

        {/* Volume tier strip */}
        <div className="mb-4">
          <div className="text-xs font-black mb-2" style={{ color: C.muted }}>VOLUME PRICING — PRICE DROPS AS YOU SCALE</div>
          <div className="grid grid-cols-5 gap-1">
            {PRICE_TIERS_LIST.map((t, i) => (
              <motion.div key={i}
                animate={{ scale: i === vt.idx ? 1.05 : 1, opacity: i === vt.idx ? 1 : 0.5 }}
                transition={{ duration: 0.2 }}
                className="rounded-lg p-2 text-center"
                style={{
                  background: i === vt.idx ? `${t.color}20` : C.card2,
                  border: `1px solid ${i === vt.idx ? t.color + '70' : C.border}`,
                  boxShadow: i === vt.idx ? `0 0 12px ${t.color}30` : 'none',
                }}>
                <div className="font-black" style={{ color: i === vt.idx ? t.color : C.muted, fontSize: 13 }}>${t.price}</div>
                <div style={{ color: i === vt.idx ? t.color : `${C.muted}70`, fontSize: 9 }} className="mt-0.5 leading-tight">{t.label}</div>
                {i === vt.idx && <div style={{ color: t.color, fontSize: 8 }} className="font-black mt-0.5">ACTIVE</div>}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Price curve sparkline */}
        <div className="mb-4">
          <div className="text-xs font-black mb-1" style={{ color: C.muted }}>PRICE PER LEAD VS. VOLUME</div>
          <div className="h-20">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparkData}>
                <XAxis dataKey="leads" tick={{ fill: C.muted, fontSize: 8 }} axisLine={false} tickLine={false} />
                <YAxis domain={[70, 160]} hide />
                <Tooltip formatter={(v: number) => `$${v}/lead`}
                  contentStyle={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 6, fontSize: 10 }} />
                <Line type="monotone" dataKey="price" stroke={C.gold} strokeWidth={2} dot={{ fill: C.gold, r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-4">
          {/* Lead slider */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-black" style={{ color: C.muted }}>LEADS PURCHASED</label>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black" style={{ color: C.gold }}>{leads.toLocaleString()}</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-black"
                  style={{ background: `${vt.color}20`, color: vt.color, border: `1px solid ${vt.color}50` }}>
                  ${vt.price}/lead
                </span>
              </div>
            </div>
            <input type="range" min={20} max={5000} step={10} value={leads}
              onChange={e => setLeads(parseInt(e.target.value))}
              className="w-full" style={{ accentColor: vt.color }} />
            <div className="flex justify-between text-xs mt-1" style={{ color: `${C.muted}60` }}>
              <span>20 min</span><span>500</span><span>1,000</span><span>2,500</span><span>5,000</span>
            </div>
          </div>
          {/* Close rate */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-black" style={{ color: C.muted }}>CLOSE RATE</label>
              <span className="text-sm font-black" style={{ color: C.teal }}>{closeRate}%</span>
            </div>
            <input type="range" min={1} max={20} step={0.5} value={closeRate}
              onChange={e => setCloseRate(parseFloat(e.target.value))}
              className="w-full" style={{ accentColor: C.teal }} />
          </div>
          {/* Avg investment */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-black" style={{ color: C.muted }}>AVG FIRST INVESTMENT (per investor)</label>
              <span className="text-sm font-black" style={{ color: C.purpleL }}>${avgInvestment.toLocaleString()}</span>
            </div>
            <input type="range" min={5000} max={100000} step={5000} value={avgInvestment}
              onChange={e => setAvgInvestment(parseInt(e.target.value))}
              className="w-full" style={{ accentColor: C.purpleL }} />
          </div>
        </div>
      </motion.div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Total EA Cost",         value: `$${totalCost.toLocaleString()}`,     color: C.muted,   sub: leads < 20 ? "$3K minimum" : `$${vt.price}/lead` },
          { label: "New Investors Closed",   value: newInvestors.toString(),              color: C.teal,    sub: `${closeRate}% close rate` },
          { label: "Capital Raised",         value: `$${capitalRaised.toLocaleString()}`, color: C.gold,    sub: `${newInvestors} investors` },
          { label: "ROI Multiple",           value: `${roiMultiple}x`,                   color: capitalRaised > totalCost ? C.green : C.amber, sub: "on lead spend" },
        ].map((m, i) => (
          <motion.div key={i} initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.06 }}
            className="rounded-xl p-4 text-center relative overflow-hidden"
            style={{ background: C.card, border: `1px solid ${m.color}30` }}>
            <div className="absolute inset-0 opacity-5" style={{ background: `radial-gradient(circle at 50% 0%, ${m.color}, transparent 70%)` }} />
            <div className="text-2xl font-black relative" style={{ color: m.color }}>{m.value}</div>
            <div className="text-xs mt-0.5 font-black relative" style={{ color: C.muted }}>{m.label}</div>
            <div className="text-xs mt-0.5 relative" style={{ color: `${m.color}80` }}>{m.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* Cost per investor acquired */}
      {newInvestors > 0 && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="rounded-xl p-4" style={{ background: C.card, border: `1px solid ${C.gold}30` }}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-black" style={{ color: C.muted }}>COST TO ACQUIRE ONE INVESTOR</div>
              <div className="text-3xl font-black mt-1" style={{ color: C.gold }}>${costPerInvestor.toLocaleString()}</div>
            </div>
            <div className="text-right">
              <div className="text-xs font-black" style={{ color: C.muted }}>NET RETURN ABOVE COST</div>
              <div className="text-xl font-black mt-1" style={{ color: netReturn >= 0 ? C.green : C.amber }}>
                {netReturn >= 0 ? "+" : ""}{netReturn < 0 ? `-$${Math.abs(netReturn).toLocaleString()}` : `$${netReturn.toLocaleString()}`}
              </div>
            </div>
          </div>
          <div className="mt-2 text-xs" style={{ color: C.muted }}>
            Avg first investment ${avgInvestment.toLocaleString()} vs. ${costPerInvestor.toLocaleString()} acquisition cost — {costPerInvestor > 0 ? ((avgInvestment / costPerInvestor - 1) * 100).toFixed(0) : 0}% return on acquisition
          </div>
        </motion.div>
      )}

      {/* Bar chart */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <SL>EA LEAD COST VS. CAPITAL RAISED</SL>
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} barSize={56}>
              <XAxis dataKey="name" tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`}
                contentStyle={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 11 }} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {barData.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        {capitalRaised > totalCost && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="mt-3 p-3 rounded-xl text-center"
            style={{ background: `${C.green}10`, border: `1px solid ${C.green}30` }}>
            <div className="text-sm font-black" style={{ color: C.green }}>
              {roiMultiple}x RETURN — +${netReturn.toLocaleString()} NET ABOVE LEAD COST
            </div>
            <div className="text-xs mt-0.5" style={{ color: C.muted }}>Before management fees, carried interest, or repeat investments</div>
          </motion.div>
        )}
      </motion.div>

      {/* 6-month projection */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
        className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <SL>6-MONTH CAPITAL FORMATION PROJECTION</SL>
        <div className="text-xs mb-3" style={{ color: C.muted }}>Buying {leads} leads/month at ${vt.price}/lead</div>
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="capGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.gold} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={C.gold} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.muted} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={C.muted} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fill: C.muted, fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`}
                contentStyle={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 10 }} />
              <Area type="monotone" dataKey="cost" stroke={C.muted} strokeWidth={1.5} fill="url(#costGrad)" name="EA Cost" />
              <Area type="monotone" dataKey="capital" stroke={C.gold} strokeWidth={2} fill="url(#capGrad)" name="Capital Raised" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
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
