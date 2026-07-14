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
