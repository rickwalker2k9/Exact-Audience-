/**
 * IMAGINE AGENCY — Intelligence Platform Demo Dashboard
 * Design: Dark tech aesthetic — black/charcoal bg, purple/blue gradient accents
 * Layout: Full-width mobile-first, sticky header, tab navigation
 * Brand: Imagine Agency | Exact Audience | SiteID | Buyers' DNA
 * Domain routing: hostname → default tab
 *   imagine-agency.com / default → overview
 *   exactaudience.ai → exact-audience
 *   siteid.ai → siteid
 *   buyersdna.com → buyers-dna
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, ResponsiveContainer,
  Tooltip, PieChart, Pie, Cell, LineChart, Line
} from "recharts";

// ─── Color palette ────────────────────────────────────────────────────────────
const C = {
  bg:          "#08090f",
  card:        "#0f1018",
  card2:       "#13141f",
  border:      "#1e2035",
  purple:      "#7c3aed",
  purpleLight: "#a78bfa",
  blue:        "#3b82f6",
  blueLight:   "#93c5fd",
  green:       "#10b981",
  orange:      "#f97316",
  gold:        "#f59e0b",
  white:       "#f1f5f9",
  muted:       "#64748b",
  gradient:    "linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)",
};

// ─── Domain → tab mapping ─────────────────────────────────────────────────────
function getDefaultTab(): string {
  const host = window.location.hostname.toLowerCase();
  if (host.includes("exactaudience")) return "exact-audience";
  if (host.includes("siteid"))        return "siteid";
  if (host.includes("buyersdna"))     return "buyers-dna";
  return "overview";
}

// ─── Tab definitions ──────────────────────────────────────────────────────────
const TABS = [
  { id: "overview",       label: "Overview" },
  { id: "exact-audience", label: "Exact Audience" },
  { id: "siteid",         label: "SiteID" },
  { id: "buyers-dna",     label: "Buyers' DNA" },
  { id: "live-search",    label: "Live Search" },
];

// ─── Shared label component ───────────────────────────────────────────────────
function SL({ children, color }: { children: React.ReactNode; color?: string }) {
  return (
    <div className="text-xs font-black tracking-widest mb-3" style={{ color: color || C.purpleLight, letterSpacing: "0.12em" }}>
      {children}
    </div>
  );
}

// ─── Animated counter hook ────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1200) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const n = useCountUp(value);
  return <span>{n.toLocaleString()}{suffix}</span>;
}

// ─── Sparkline ────────────────────────────────────────────────────────────────
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const w = 60, h = 28;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={w} height={h} style={{ overflow: "visible" }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
      <circle cx={pts.split(" ").pop()!.split(",")[0]} cy={pts.split(" ").pop()!.split(",")[1]} r={2.5} fill={color} />
    </svg>
  );
}

// ─── IB Score badge ───────────────────────────────────────────────────────────
function IBBadge({ score }: { score: number }) {
  const color = score >= 90 ? C.orange : score >= 80 ? C.purpleLight : C.green;
  const label = score >= 90 ? "HOT LEAD" : score >= 80 ? "STRONG" : "ACTIVE";
  return (
    <div className="text-right">
      <div className="text-2xl font-black" style={{ color }}>{score}</div>
      <div className="text-xs font-black" style={{ color }}>{label}</div>
      <div className="text-xs" style={{ color: C.muted }}>I|B Score</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB: OVERVIEW
// ═══════════════════════════════════════════════════════════════════════════════
function TabOverview({ setTab }: { setTab: (t: string) => void }) {
  const marketData = [
    { week: "W1", buyers: 1240 }, { week: "W2", buyers: 1580 }, { week: "W3", buyers: 1320 },
    { week: "W4", buyers: 2100 }, { week: "W5", buyers: 1890 }, { week: "W6", buyers: 2450 },
    { week: "W7", buyers: 2180 }, { week: "W8", buyers: 2890 },
  ];

  const products = [
    {
      id: "exact-audience",
      name: "Exact Audience",
      tagline: "Stop targeting audiences. Start targeting actual buyers.",
      description: "Identifies real people showing buying intent based on what they search, what they engage with, and where they are in-market. Returns name, verified email, phone, income, age, and I|B Score.",
      color: C.purple,
      stat: "94",
      statLabel: "Max I|B Score",
    },
    {
      id: "siteid",
      name: "SiteID",
      tagline: "See the exact people on your site.",
      description: "Identifies the real people visiting your website — name, email, phone, job title, address, income, homeowner status — before they buy somewhere else. NCOA-refreshed monthly.",
      color: C.blue,
      stat: "60%",
      statLabel: "Identification Rate",
    },
    {
      id: "buyers-dna",
      name: "Buyers' DNA",
      tagline: "What if you could clone your best customers?",
      description: "Takes your buyers list, looks back 90 days at their digital journey, builds a behavioral avatar, then finds thousands of people moving through the exact same pattern right now.",
      color: C.orange,
      stat: "90",
      statLabel: "Days Lookback",
    },
  ];

  return (
    <div className="space-y-5">
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-6 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0f0a1e 0%, #0a0f1e 100%)", border: `1px solid ${C.purple}40` }}>
        <div className="absolute inset-0 opacity-10" style={{ background: "radial-gradient(ellipse at 80% 20%, #7c3aed 0%, transparent 60%)" }} />
        <div className="relative">
          <div className="text-xs font-black tracking-widest mb-2" style={{ color: C.purpleLight }}>IMAGINE AGENCY — INTELLIGENCE PLATFORM</div>
          <div className="text-2xl font-black leading-tight mb-2" style={{ color: C.white }}>
            Your next client<br />is looking for you<br /><span style={{ background: C.gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>right now.</span>
          </div>
          <div className="text-sm mb-4" style={{ color: C.muted }}>
            We identify real buyers by name, behavior, and intent — before they ever contact you.
          </div>
          <div className="flex gap-3 flex-wrap">
            {products.map(p => (
              <button key={p.id} onClick={() => setTab(p.id)}
                className="text-xs font-black px-3 py-1.5 rounded-lg transition-all active:scale-95"
                style={{ background: `${p.color}20`, color: p.color, border: `1px solid ${p.color}40` }}>
                {p.name}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Market activity chart */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <SL color={C.purpleLight}>IN-MARKET BUYER ACTIVITY — LAST 8 WEEKS</SL>
        <ResponsiveContainer width="100%" height={120}>
          <AreaChart data={marketData} margin={{ top: 5, right: 0, left: -30, bottom: 0 }}>
            <defs>
              <linearGradient id="grad-overview" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={C.purple} stopOpacity={0.4} />
                <stop offset="100%" stopColor={C.purple} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="week" tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={false} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 8, color: C.white, fontSize: 11 }} />
            <Area type="monotone" dataKey="buyers" stroke={C.purple} strokeWidth={2} fill="url(#grad-overview)" />
          </AreaChart>
        </ResponsiveContainer>
        <div className="text-xs text-center mt-1" style={{ color: C.muted }}>Buyers actively researching in your market</div>
      </motion.div>

      {/* Product cards */}
      {products.map((p, i) => (
        <motion.div key={p.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.08 }}
          onClick={() => setTab(p.id)}
          className="rounded-2xl p-5 cursor-pointer transition-all active:scale-99"
          style={{ background: C.card, border: `1px solid ${C.border}` }}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="text-xs font-black tracking-widest mb-1" style={{ color: p.color }}>{p.name.toUpperCase()}</div>
              <div className="text-sm font-bold mb-1" style={{ color: C.white }}>{p.tagline}</div>
              <div className="text-xs leading-relaxed" style={{ color: C.muted }}>{p.description}</div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-2xl font-black" style={{ color: p.color }}>{p.stat}</div>
              <div className="text-xs" style={{ color: C.muted }}>{p.statLabel}</div>
            </div>
          </div>
          <div className="mt-3 text-xs font-black" style={{ color: p.color }}>See Demo →</div>
        </motion.div>
      ))}

      {/* Stats row */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="grid grid-cols-3 gap-3">
        {[
          { label: "Buyers Identified", value: 12847, suffix: "+" },
          { label: "Avg I|B Score", value: 87 },
          { label: "Data Accuracy", value: 94, suffix: "%" },
        ].map((s, i) => (
          <div key={i} className="rounded-xl p-3 text-center" style={{ background: C.card, border: `1px solid ${C.border}` }}>
            <div className="text-xl font-black" style={{ color: C.purpleLight }}>
              <AnimatedNumber value={s.value} suffix={s.suffix} />
            </div>
            <div className="text-xs mt-0.5" style={{ color: C.muted }}>{s.label}</div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB: EXACT AUDIENCE
// ═══════════════════════════════════════════════════════════════════════════════
const EA_PROFILES = [
  { name: "Sarah Mitchell", location: "Austin, TX", intent: "auto insurance Texas", email: "sarah.m@email.com", phone: "(512) 555-0147", income: "$125K", age: 42, score: 94, sparkline: [55,62,70,68,75,82,88,94] },
  { name: "James Rodriguez", location: "Phoenix, AZ", intent: "car insurance rates comparison", email: "j.rodriguez@email.com", phone: "(602) 555-0198", income: "$98K", age: 35, score: 87, sparkline: [40,48,55,60,65,72,80,87] },
  { name: "Michael Chen", location: "Seattle, WA", intent: "SaaS CRM software enterprise", email: "m.chen@email.com", phone: "(206) 555-0234", income: "$185K", age: 38, score: 91, sparkline: [50,58,65,70,74,80,86,91] },
  { name: "Emily Watson", location: "Denver, CO", intent: "home insurance quote online", email: "emily.w@email.com", phone: "(303) 555-0167", income: "$112K", age: 45, score: 82, sparkline: [38,44,50,55,60,65,74,82] },
  { name: "David Park", location: "Chicago, IL", intent: "B2B sales tools CRM", email: "dpark@email.com", phone: "(312) 555-0289", income: "$145K", age: 51, score: 89, sparkline: [45,52,58,64,70,76,83,89] },
  { name: "Amanda Torres", location: "Nashville, TN", intent: "medical device procurement", email: "a.torres@email.com", phone: "(615) 555-0312", income: "$138K", age: 44, score: 93, sparkline: [52,60,68,72,78,84,89,93] },
];

function TabExactAudience() {
  const [selected, setSelected] = useState<number | null>(null);
  const categoryData = [
    { cat: "Insurance", count: 3420 },
    { cat: "SaaS/Tech", count: 2890 },
    { cat: "Healthcare", count: 2340 },
    { cat: "Real Estate", count: 1980 },
    { cat: "Finance", count: 1650 },
  ];

  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-5 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1a0a2e 0%, #0a0f1e 100%)", border: `1px solid ${C.purple}40` }}>
        <div className="absolute inset-0 opacity-10" style={{ background: "radial-gradient(ellipse at 70% 30%, #7c3aed 0%, transparent 60%)" }} />
        <div className="relative">
          <SL color={C.purpleLight}>EXACT AUDIENCE — AUDIENCE INTELLIGENCE</SL>
          <div className="text-lg font-black mb-1" style={{ color: C.white }}>Stop Targeting Audiences.</div>
          <div className="text-lg font-black mb-3" style={{ background: C.gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Start Targeting Actual Buyers.</div>
          <div className="text-xs" style={{ color: C.muted }}>Real people showing buying intent — by name, behavior, and in-market signal.</div>
        </div>
      </motion.div>

      {/* Category breakdown */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <SL color={C.purple}>IN-MARKET BUYERS BY CATEGORY — THIS WEEK</SL>
        <ResponsiveContainer width="100%" height={130}>
          <BarChart data={categoryData} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
            <XAxis type="number" tick={{ fill: C.muted, fontSize: 9 }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="cat" tick={{ fill: C.white, fontSize: 10 }} axisLine={false} tickLine={false} width={70} />
            <Tooltip contentStyle={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 8, color: C.white, fontSize: 11 }} />
            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
              {categoryData.map((_, i) => (
                <Cell key={i} fill={[C.purple, C.blue, C.purpleLight, C.blueLight, C.green][i]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* I|B Score legend */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="rounded-xl p-4 flex gap-4" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <div className="flex-1 text-center">
          <div className="text-lg font-black" style={{ color: C.orange }}>90+</div>
          <div className="text-xs font-black" style={{ color: C.orange }}>HOT LEAD</div>
        </div>
        <div className="w-px" style={{ background: C.border }} />
        <div className="flex-1 text-center">
          <div className="text-lg font-black" style={{ color: C.purpleLight }}>80–89</div>
          <div className="text-xs font-black" style={{ color: C.purpleLight }}>STRONG</div>
        </div>
        <div className="w-px" style={{ background: C.border }} />
        <div className="flex-1 text-center">
          <div className="text-lg font-black" style={{ color: C.green }}>70–79</div>
          <div className="text-xs font-black" style={{ color: C.green }}>ACTIVE</div>
        </div>
        <div className="w-px" style={{ background: C.border }} />
        <div className="flex-1 text-center">
          <div className="text-xs font-black mb-0.5" style={{ color: C.muted }}>I|B Score</div>
          <div className="text-xs" style={{ color: C.muted }}>Intent | Behavior</div>
        </div>
      </motion.div>

      {/* Buyer profiles */}
      <SL color={C.purpleLight}>LIVE BUYER PROFILES — SHOWING {EA_PROFILES.length} OF 12,847</SL>
      <div className="space-y-2">
        {EA_PROFILES.map((p, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.06 }}
            onClick={() => setSelected(selected === i ? null : i)}
            className="rounded-xl p-4 cursor-pointer transition-all"
            style={{ background: selected === i ? `${C.purple}12` : C.card, border: `1px solid ${selected === i ? C.purple : C.border}`, boxShadow: selected === i ? `0 0 20px ${C.purple}15` : "none" }}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-black" style={{ color: C.white }}>{p.name}</span>
                  <span className="text-xs" style={{ color: C.muted }}>{p.location}</span>
                </div>
                <div className="text-xs mt-1 font-semibold" style={{ color: C.purpleLight }}>"{p.intent}"</div>
                <div className="flex gap-2 mt-2">
                  <span className="text-xs" style={{ color: C.muted }}>Age {p.age}</span>
                  <span className="text-xs" style={{ color: C.muted }}>·</span>
                  <span className="text-xs" style={{ color: C.muted }}>{p.income} income</span>
                </div>
              </div>
              <div className="flex items-end gap-2 shrink-0">
                <Sparkline data={p.sparkline} color={p.score >= 90 ? C.orange : p.score >= 80 ? C.purpleLight : C.green} />
                <IBBadge score={p.score} />
              </div>
            </div>
            <AnimatePresence>
              {selected === i && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
                  className="mt-4 pt-4 space-y-3" style={{ borderTop: `1px solid ${C.border}` }}>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "Email", value: p.email },
                      { label: "Phone", value: p.phone },
                      { label: "Income", value: p.income },
                      { label: "Age", value: String(p.age) },
                    ].map((f, fi) => (
                      <div key={fi} className="rounded-lg p-2.5" style={{ background: C.card2 }}>
                        <div className="text-xs font-black mb-0.5" style={{ color: C.muted }}>{f.label.toUpperCase()}</div>
                        <div className="text-xs font-semibold" style={{ color: C.white }}>{f.value}</div>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-xl p-3" style={{ background: `${C.purple}10`, border: `1px solid ${C.purple}30` }}>
                    <div className="text-xs font-black mb-1" style={{ color: C.purple }}>SUGGESTED OUTREACH</div>
                    <div className="text-xs" style={{ color: C.white }}>
                      "{p.name.split(" ")[0]} — most companies in your space are spending budget on ads that reach everyone and convert no one. Exact Audience shows you the specific companies already in-market for {p.intent.split(" ").slice(0, 3).join(" ")} — so you reach buyers when they're ready, not before. Worth 10 minutes?"
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 text-xs font-black py-2 rounded-lg transition-all active:scale-95"
                      style={{ background: `${C.purple}20`, color: C.purpleLight, border: `1px solid ${C.purple}40` }}>
                      Email Template
                    </button>
                    <button className="flex-1 text-xs font-black py-2 rounded-lg transition-all active:scale-95"
                      style={{ background: `${C.blue}20`, color: C.blueLight, border: `1px solid ${C.blue}40` }}>
                      LinkedIn Message
                    </button>
                    <button className="flex-1 text-xs font-black py-2 rounded-lg transition-all active:scale-95"
                      style={{ background: `${C.green}20`, color: C.green, border: `1px solid ${C.green}40` }}>
                      Direct Mail
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB: SITEID
// ═══════════════════════════════════════════════════════════════════════════════
const SITE_VISITORS = [
  { initials: "JD", name: "John Davis", title: "Product Manager", company: "Google", email: "john.davis@google.com", phone: "(415) 555-1234", city: "San Francisco, CA", income: "$185K", homeowner: true, pages: ["Pricing", "Features", "Case Studies"], time: "4m 32s", visits: 3, intent: "SaaS CRM comparison" },
  { initials: "SP", name: "Sarah Park", title: "CEO", company: "TechStartup", email: "sarah@techstartup.io", phone: "(212) 555-5678", city: "New York, NY", income: "$210K", homeowner: false, pages: ["Home", "Pricing"], time: "2m 18s", visits: 1, intent: "Lead generation platform" },
  { initials: "MW", name: "Mike Wilson", title: "VP Sales", company: "Enterprise Co", email: "mike@enterprise.com", phone: "(512) 555-9012", city: "Austin, TX", income: "$165K", homeowner: true, pages: ["Features", "Integrations", "Pricing", "Contact"], time: "8m 45s", visits: 5, intent: "Sales intelligence tool" },
  { initials: "AL", name: "Amanda Lee", title: "Director of Marketing", company: "MedDevice Inc", email: "a.lee@meddevice.com", phone: "(615) 555-2341", city: "Nashville, TN", income: "$142K", homeowner: true, pages: ["Home", "Features"], time: "1m 52s", visits: 2, intent: "B2B audience data" },
  { initials: "RC", name: "Robert Chen", title: "CFO", company: "FinanceCorp", email: "r.chen@financecorp.com", phone: "(312) 555-7890", city: "Chicago, IL", income: "$225K", homeowner: true, pages: ["Pricing", "ROI Calculator", "Contact"], time: "6m 10s", visits: 4, intent: "Revenue intelligence" },
];

function TabSiteID() {
  const [selected, setSelected] = useState<number | null>(null);
  const [tick, setTick] = useState(0);
  const liveVisitor = SITE_VISITORS[tick % SITE_VISITORS.length];

  useEffect(() => {
    const t = setInterval(() => setTick(x => x + 1), 4000);
    return () => clearInterval(t);
  }, []);

  const visitData = [
    { hour: "8am", visits: 12 }, { hour: "9am", visits: 28 }, { hour: "10am", visits: 45 },
    { hour: "11am", visits: 38 }, { hour: "12pm", visits: 22 }, { hour: "1pm", visits: 35 },
    { hour: "2pm", visits: 52 }, { hour: "3pm", visits: 48 }, { hour: "4pm", visits: 41 },
  ];

  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-5 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0a1020 0%, #0a1530 100%)", border: `1px solid ${C.blue}40` }}>
        <div className="absolute inset-0 opacity-10" style={{ background: "radial-gradient(ellipse at 70% 30%, #3b82f6 0%, transparent 60%)" }} />
        <div className="relative">
          <SL color={C.blueLight}>SITEID — VISITOR INTELLIGENCE</SL>
          <div className="text-lg font-black mb-1" style={{ color: C.white }}>See The Exact People</div>
          <div className="text-lg font-black mb-3" style={{ background: "linear-gradient(135deg, #3b82f6 0%, #93c5fd 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>On Your Site Right Now.</div>
          <div className="grid grid-cols-3 gap-3 mt-3">
            {[
              { label: "Today's Visitors", value: "247" },
              { label: "Identified", value: "148" },
              { label: "ID Rate", value: "60%" },
            ].map((s, i) => (
              <div key={i} className="rounded-xl p-2.5 text-center" style={{ background: `${C.blue}15`, border: `1px solid ${C.blue}30` }}>
                <div className="text-lg font-black" style={{ color: C.blueLight }}>{s.value}</div>
                <div className="text-xs" style={{ color: C.muted }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Hourly traffic chart */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <SL color={C.blueLight}>SITE TRAFFIC — TODAY BY HOUR</SL>
        <ResponsiveContainer width="100%" height={100}>
          <AreaChart data={visitData} margin={{ top: 5, right: 0, left: -30, bottom: 0 }}>
            <defs>
              <linearGradient id="grad-siteid" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={C.blue} stopOpacity={0.4} />
                <stop offset="100%" stopColor={C.blue} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="hour" tick={{ fill: C.muted, fontSize: 9 }} axisLine={false} tickLine={false} />
            <YAxis tick={false} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 8, color: C.white, fontSize: 11 }} />
            <Area type="monotone" dataKey="visits" stroke={C.blue} strokeWidth={2} fill="url(#grad-siteid)" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Live visitor ticker */}
      <motion.div key={tick} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-xl p-4" style={{ background: `${C.green}10`, border: `1px solid ${C.green}40` }}>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full" style={{ background: C.green, animation: "pulse 1.5s infinite" }} />
          <span className="text-xs font-black" style={{ color: C.green }}>LIVE — ON YOUR SITE NOW</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black shrink-0"
            style={{ background: `${C.blue}30`, color: C.blueLight }}>
            {liveVisitor.initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-black" style={{ color: C.white }}>{liveVisitor.name}</div>
            <div className="text-xs" style={{ color: C.muted }}>{liveVisitor.title} · {liveVisitor.company}</div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-xs font-black" style={{ color: C.green }}>{liveVisitor.time}</div>
            <div className="text-xs" style={{ color: C.muted }}>{liveVisitor.visits} visit{liveVisitor.visits > 1 ? "s" : ""}</div>
          </div>
        </div>
      </motion.div>

      {/* Visitor list */}
      <SL color={C.blueLight}>IDENTIFIED VISITORS — TODAY</SL>
      <div className="space-y-2">
        {SITE_VISITORS.map((v, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.06 }}
            onClick={() => setSelected(selected === i ? null : i)}
            className="rounded-xl p-4 cursor-pointer transition-all"
            style={{ background: selected === i ? `${C.blue}12` : C.card, border: `1px solid ${selected === i ? C.blue : C.border}` }}>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black shrink-0"
                style={{ background: `${C.blue}25`, color: C.blueLight }}>
                {v.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-black" style={{ color: C.white }}>{v.name}</span>
                  <span className="text-xs" style={{ color: C.muted }}>{v.title}</span>
                </div>
                <div className="text-xs mt-0.5" style={{ color: C.blueLight }}>{v.company} · {v.city}</div>
                <div className="flex gap-1.5 mt-1.5 flex-wrap">
                  {v.pages.slice(0, 3).map((pg, pi) => (
                    <span key={pi} className="text-xs px-1.5 py-0.5 rounded font-bold"
                      style={{ background: `${C.blue}20`, color: C.blueLight }}>{pg}</span>
                  ))}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-sm font-black" style={{ color: C.white }}>{v.time}</div>
                <div className="text-xs" style={{ color: C.muted }}>{v.visits} visits</div>
              </div>
            </div>
            <AnimatePresence>
              {selected === i && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
                  className="mt-4 pt-4 space-y-3" style={{ borderTop: `1px solid ${C.border}` }}>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "Email", value: v.email },
                      { label: "Phone", value: v.phone },
                      { label: "Income", value: v.income },
                      { label: "Homeowner", value: v.homeowner ? "Yes" : "No" },
                    ].map((f, fi) => (
                      <div key={fi} className="rounded-lg p-2.5" style={{ background: C.card2 }}>
                        <div className="text-xs font-black mb-0.5" style={{ color: C.muted }}>{f.label.toUpperCase()}</div>
                        <div className="text-xs font-semibold" style={{ color: C.white }}>{f.value}</div>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-xl p-3" style={{ background: `${C.blue}10`, border: `1px solid ${C.blue}30` }}>
                    <div className="text-xs font-black mb-1" style={{ color: C.blueLight }}>INTENT SIGNAL</div>
                    <div className="text-xs font-semibold" style={{ color: C.white }}>"{v.intent}"</div>
                  </div>
                  <div className="rounded-xl p-3" style={{ background: `${C.purple}10`, border: `1px solid ${C.purple}30` }}>
                    <div className="text-xs font-black mb-1" style={{ color: C.purpleLight }}>SUGGESTED OUTREACH</div>
                    <div className="text-xs" style={{ color: C.white }}>
                      "{v.name.split(" ")[0]} — {v.company} is exactly the kind of company Exact Audience was built for. We identify the specific buyers in your market who are actively researching solutions like yours — before they ever talk to a competitor. Happy to show you what that pipeline looks like for your category."
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 text-xs font-black py-2 rounded-lg" style={{ background: `${C.blue}20`, color: C.blueLight, border: `1px solid ${C.blue}40` }}>Email</button>
                    <button className="flex-1 text-xs font-black py-2 rounded-lg" style={{ background: `${C.purple}20`, color: C.purpleLight, border: `1px solid ${C.purple}40` }}>LinkedIn</button>
                    <button className="flex-1 text-xs font-black py-2 rounded-lg" style={{ background: `${C.green}20`, color: C.green, border: `1px solid ${C.green}40` }}>Direct Mail</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB: BUYERS' DNA
// ═══════════════════════════════════════════════════════════════════════════════
const JOURNEY_STEPS = [
  { day: "Day -90", event: "Searched 'best CRM for sales teams'", type: "search", platform: "Google" },
  { day: "Day -82", event: "Visited 3 competitor review pages on G2", type: "research", platform: "G2.com" },
  { day: "Day -74", event: "Downloaded 'CRM Comparison Guide' PDF", type: "content", platform: "Industry Blog" },
  { day: "Day -61", event: "Watched 'Sales Automation' webinar", type: "content", platform: "YouTube" },
  { day: "Day -48", event: "Searched 'CRM pricing enterprise'", type: "search", platform: "Google" },
  { day: "Day -35", event: "Visited your website — Pricing page", type: "site", platform: "Your Site" },
  { day: "Day -22", event: "Returned to your site — Features + Integrations", type: "site", platform: "Your Site" },
  { day: "Day -14", event: "Requested a demo", type: "conversion", platform: "Your Site" },
  { day: "Day 0", event: "Became a customer", type: "purchase", platform: "Your Site" },
];

const DNA_CLONES = [
  { name: "Marcus Johnson", location: "Dallas, TX", stage: "Day -48", match: 96, intent: "Searching 'CRM pricing enterprise'" },
  { name: "Lisa Chen", location: "Boston, MA", stage: "Day -61", match: 91, intent: "Watching sales automation content" },
  { name: "Derek Williams", location: "Atlanta, GA", stage: "Day -74", match: 88, intent: "Downloaded comparison guide" },
  { name: "Priya Patel", location: "San Jose, CA", stage: "Day -35", match: 94, intent: "Visited competitor pricing pages" },
  { name: "Tom Bradley", location: "Denver, CO", stage: "Day -22", match: 89, intent: "Multiple site visits, high engagement" },
];

function TabBuyersDNA() {
  const [showClones, setShowClones] = useState(false);
  const typeColor = (t: string) => {
    if (t === "purchase") return C.green;
    if (t === "conversion") return C.orange;
    if (t === "site") return C.blue;
    if (t === "content") return C.purpleLight;
    return C.muted;
  };

  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-5 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1a0a0a 0%, #0a0a1a 100%)", border: `1px solid ${C.orange}40` }}>
        <div className="absolute inset-0 opacity-10" style={{ background: "radial-gradient(ellipse at 60% 40%, #f97316 0%, transparent 60%)" }} />
        <div className="relative">
          <SL color={C.orange}>BUYERS' DNA — BEHAVIORAL CLONING</SL>
          <div className="text-lg font-black mb-1" style={{ color: C.white }}>What if you could clone</div>
          <div className="text-lg font-black mb-3" style={{ background: "linear-gradient(135deg, #f97316 0%, #f59e0b 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>your best customers?</div>
          <div className="text-xs mb-4" style={{ color: C.muted }}>Your best buyers left a digital fingerprint. We extract that exact pattern and find thousands of people who match it perfectly.</div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Days Lookback", value: "90" },
              { label: "Pattern Match", value: "96%" },
              { label: "Clones Found", value: "2,847" },
            ].map((s, i) => (
              <div key={i} className="rounded-xl p-2.5 text-center" style={{ background: `${C.orange}15`, border: `1px solid ${C.orange}30` }}>
                <div className="text-lg font-black" style={{ color: C.orange }}>{s.value}</div>
                <div className="text-xs" style={{ color: C.muted }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Buyer journey visualization */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <SL color={C.orange}>THE 90-DAY BUYER JOURNEY — YOUR BEST CUSTOMER</SL>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-3 top-2 bottom-2 w-0.5" style={{ background: `linear-gradient(to bottom, ${C.muted}40, ${C.green})` }} />
          <div className="space-y-3 pl-8">
            {JOURNEY_STEPS.map((step, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.07 }}
                className="relative">
                {/* Dot */}
                <div className="absolute -left-5 top-1.5 w-2.5 h-2.5 rounded-full"
                  style={{ background: typeColor(step.type), boxShadow: step.type === "purchase" ? `0 0 8px ${C.green}` : "none" }} />
                <div className="rounded-lg p-2.5" style={{ background: step.type === "purchase" ? `${C.green}15` : step.type === "site" ? `${C.blue}10` : C.card2, border: `1px solid ${typeColor(step.type)}30` }}>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1">
                      <div className="text-xs font-black mb-0.5" style={{ color: typeColor(step.type) }}>{step.day}</div>
                      <div className="text-xs font-semibold" style={{ color: C.white }}>{step.event}</div>
                    </div>
                    <div className="text-xs shrink-0 px-1.5 py-0.5 rounded font-bold"
                      style={{ background: `${typeColor(step.type)}20`, color: typeColor(step.type) }}>
                      {step.platform}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Find clones button */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <button onClick={() => setShowClones(true)}
          className="w-full py-4 rounded-2xl font-black text-sm transition-all active:scale-98"
          style={{ background: "linear-gradient(135deg, #f97316 0%, #f59e0b 100%)", color: "#000" }}>
          Find Buyers Matching This DNA Pattern
        </button>
      </motion.div>

      {/* Clone results */}
      <AnimatePresence>
        {showClones && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="space-y-3">
            <SL color={C.orange}>2,847 BUYERS MATCHING YOUR DNA PATTERN — TOP MATCHES</SL>
            {DNA_CLONES.map((c, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                className="rounded-xl p-4" style={{ background: C.card, border: `1px solid ${C.border}` }}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="text-sm font-black" style={{ color: C.white }}>{c.name}</div>
                    <div className="text-xs mt-0.5" style={{ color: C.muted }}>{c.location}</div>
                    <div className="text-xs mt-1 font-semibold" style={{ color: C.orange }}>Currently at: {c.stage}</div>
                    <div className="text-xs mt-0.5" style={{ color: C.muted }}>{c.intent}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-2xl font-black" style={{ color: C.orange }}>{c.match}%</div>
                    <div className="text-xs font-black" style={{ color: C.orange }}>DNA MATCH</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB: LIVE SEARCH
// ═══════════════════════════════════════════════════════════════════════════════
const SEARCH_POOL = [
  { name: "Jennifer Walsh", title: "VP of Operations", company: "Nashville General Hospital", location: "Nashville, TN", email: "j.walsh@nashvillegeneral.org", phone: "(615) 555-0441", income: "$165K", score: 91, intent: "Hospital supply chain optimization", tags: ["Supply Chain", "GPO Contracts"], sparkline: [40,52,61,68,74,80,86,91] },
  { name: "Carlos Mendez", title: "Director of Procurement", company: "Baptist Memorial Health", location: "Memphis, TN", email: "c.mendez@baptistmemorial.org", phone: "(901) 555-0382", income: "$148K", score: 87, intent: "Medical device procurement process", tags: ["Medical Devices", "Procurement"], sparkline: [35,44,52,58,65,72,79,87] },
  { name: "Rachel Kim", title: "Chief Nursing Officer", company: "Vanderbilt University Medical", location: "Nashville, TN", email: "r.kim@vumc.org", phone: "(615) 555-0219", income: "$195K", score: 94, intent: "Urology equipment evaluation", tags: ["Urology", "Equipment"], sparkline: [55,64,70,76,82,87,91,94] },
  { name: "Brian Foster", title: "CEO", company: "Erlanger Health System", location: "Chattanooga, TN", email: "b.foster@erlanger.org", phone: "(423) 555-0567", income: "$285K", score: 89, intent: "Healthcare technology investment", tags: ["Health Tech", "Leadership"], sparkline: [42,50,58,64,70,77,83,89] },
  { name: "Stephanie Moore", title: "Director of Surgical Services", company: "Saint Thomas Health", location: "Nashville, TN", email: "s.moore@saintthomas.org", phone: "(615) 555-0734", income: "$158K", score: 86, intent: "Surgical supply chain review", tags: ["Surgical", "Supply Chain"], sparkline: [38,46,53,60,67,73,80,86] },
  { name: "David Nguyen", title: "VP Supply Chain", company: "TriStar Health", location: "Brentwood, TN", email: "d.nguyen@tristarhealth.com", phone: "(615) 555-0891", income: "$172K", score: 92, intent: "GPO contract renegotiation", tags: ["GPO", "Contracts"], sparkline: [48,57,64,70,76,82,88,92] },
  { name: "Maria Santos", title: "CFO", company: "Williamson Medical Center", location: "Franklin, TN", email: "m.santos@williamsonmedical.org", phone: "(615) 555-0123", income: "$225K", score: 83, intent: "Capital equipment budget planning", tags: ["Capital Equipment", "Finance"], sparkline: [32,40,48,55,62,68,76,83] },
  { name: "Kevin Park", title: "Director of IT", company: "Cookeville Regional Medical", location: "Cookeville, TN", email: "k.park@cookeville-regional.org", phone: "(931) 555-0456", income: "$138K", score: 78, intent: "Healthcare IT infrastructure", tags: ["Health IT", "Infrastructure"], sparkline: [28,35,42,50,57,63,70,78] },
];

function TabLiveSearch() {
  const [state, setState] = useState("Tennessee");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [results, setResults] = useState<typeof SEARCH_POOL>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);

  const handleSearch = useCallback(() => {
    setLoading(true);
    setResults([]);
    setSearched(false);
    setSelected(null);
    let filtered = [...SEARCH_POOL];
    if (title) filtered = filtered.filter(r => r.title.toLowerCase().includes(title.toLowerCase()));
    if (category) filtered = filtered.filter(r => r.tags.some(t => t.toLowerCase().includes(category.toLowerCase())));
    filtered.sort((a, b) => b.score - a.score);
    if (filtered.length === 0) filtered = SEARCH_POOL.slice(0, 4);

    setTimeout(() => {
      setLoading(false);
      setSearched(true);
      filtered.forEach((r, i) => {
        setTimeout(() => setResults(prev => [...prev, r]), i * 280);
      });
    }, 2200);
  }, [title, category]);

  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <SL>LIVE SEARCH — FIND IN-MARKET BUYERS</SL>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-black mb-1.5 block" style={{ color: C.muted }}>STATE</label>
            <select value={state} onChange={e => setState(e.target.value)}
              className="w-full rounded-xl px-3 py-2.5 text-sm font-semibold outline-none"
              style={{ background: C.card2, color: C.white, border: `1px solid ${C.border}` }}>
              <option>Tennessee</option><option>Georgia</option><option>Texas</option>
              <option>Florida</option><option>California</option><option>Illinois</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-black mb-1.5 block" style={{ color: C.muted }}>DECISION-MAKER TITLE (optional)</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. VP Supply Chain, Director, CEO"
              className="w-full rounded-xl px-3 py-2.5 text-sm outline-none placeholder:text-slate-600"
              style={{ background: C.card2, color: C.white, border: `1px solid ${C.border}` }} />
          </div>
          <div>
            <label className="text-xs font-black mb-1.5 block" style={{ color: C.muted }}>PRODUCT CATEGORY (optional)</label>
            <select value={category} onChange={e => setCategory(e.target.value)}
              className="w-full rounded-xl px-3 py-2.5 text-sm font-semibold outline-none"
              style={{ background: C.card2, color: C.white, border: `1px solid ${C.border}` }}>
              <option value="">All Categories</option>
              <option>Urology</option><option>Surgical</option><option>Supply Chain</option>
              <option>GPO</option><option>Medical Devices</option><option>Health IT</option>
            </select>
          </div>
          <button onClick={handleSearch} disabled={loading}
            className="w-full py-3.5 rounded-xl font-black text-sm transition-all active:scale-97 disabled:opacity-60"
            style={{ background: loading ? C.card2 : C.gradient, color: C.white }}>
            {loading ? "Scanning Exact Audience Database..." : "Search In-Market Buyers"}
          </button>
        </div>
      </motion.div>

      {/* Loading animation */}
      {loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-3 py-8">
          <div className="flex gap-2">
            {[0, 1, 2].map(i => (
              <motion.div key={i} className="w-2.5 h-2.5 rounded-full"
                style={{ background: C.purpleLight }}
                animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 0.8, delay: i * 0.2, repeat: Infinity }} />
            ))}
          </div>
          <div className="text-xs font-black" style={{ color: C.purpleLight }}>SCANNING EXACT AUDIENCE DATABASE...</div>
          <div className="text-xs" style={{ color: C.muted }}>Matching behavioral signals · Verifying contacts · Scoring intent</div>
        </motion.div>
      )}

      {/* Results */}
      {searched && results.length > 0 && (
        <div>
          <SL>{results.length} IN-MARKET BUYERS FOUND — {state.toUpperCase()}</SL>
          <div className="space-y-2">
            {results.map((r, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}
                onClick={() => setSelected(selected === i ? null : i)}
                className="rounded-xl p-4 cursor-pointer transition-all"
                style={{ background: selected === i ? `${C.purple}12` : C.card, border: `1px solid ${selected === i ? C.purple : C.border}` }}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-black" style={{ color: C.white }}>{r.name}</div>
                    <div className="text-xs mt-0.5" style={{ color: C.purpleLight }}>{r.title}</div>
                    <div className="text-xs mt-0.5" style={{ color: C.muted }}>{r.company} · {r.location}</div>
                    <div className="text-xs mt-1 font-semibold" style={{ color: C.muted }}>"{r.intent}"</div>
                    <div className="flex gap-1.5 mt-2 flex-wrap">
                      {r.tags.map((t, ti) => (
                        <span key={ti} className="text-xs px-1.5 py-0.5 rounded font-bold"
                          style={{ background: `${C.purpleLight}20`, color: C.purpleLight }}>{t}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-end gap-2 shrink-0">
                    <Sparkline data={r.sparkline} color={r.score >= 90 ? C.orange : r.score >= 80 ? C.purpleLight : C.green} />
                    <IBBadge score={r.score} />
                  </div>
                </div>
                <AnimatePresence>
                  {selected === i && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
                      className="mt-4 pt-4 space-y-3" style={{ borderTop: `1px solid ${C.border}` }}>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { label: "Email", value: r.email },
                          { label: "Phone", value: r.phone },
                          { label: "Income", value: r.income },
                          { label: "Title", value: r.title },
                        ].map((f, fi) => (
                          <div key={fi} className="rounded-lg p-2.5" style={{ background: C.card2 }}>
                            <div className="text-xs font-black mb-0.5" style={{ color: C.muted }}>{f.label.toUpperCase()}</div>
                            <div className="text-xs font-semibold" style={{ color: C.white }}>{f.value}</div>
                          </div>
                        ))}
                      </div>
                      <div className="rounded-xl p-3" style={{ background: `${C.purple}10`, border: `1px solid ${C.purple}30` }}>
                        <div className="text-xs font-black mb-1" style={{ color: C.purpleLight }}>SUGGESTED OUTREACH</div>
                        <div className="text-xs" style={{ color: C.white }}>
                          "{r.name.split(" ")[0]} — healthcare organizations in {state} are leaving significant pipeline on the table by reaching out to the wrong accounts at the wrong time. We identify the specific health systems actively in-market for {r.tags[0]} right now. Worth a quick call to see who's on your list?"
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="flex-1 text-xs font-black py-2 rounded-lg" style={{ background: `${C.purple}20`, color: C.purpleLight, border: `1px solid ${C.purple}40` }}>Email</button>
                        <button className="flex-1 text-xs font-black py-2 rounded-lg" style={{ background: `${C.blue}20`, color: C.blueLight, border: `1px solid ${C.blue}40` }}>LinkedIn</button>
                        <button className="flex-1 text-xs font-black py-2 rounded-lg" style={{ background: `${C.green}20`, color: C.green, border: `1px solid ${C.green}40` }}>Direct Mail</button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════════
export default function ImagineAgencyDashboard() {
  const [tab, setTab] = useState(getDefaultTab);
  const headerRef = useRef<HTMLDivElement>(null);

  const tabContent: Record<string, React.ReactNode> = {
    "overview":       <TabOverview setTab={setTab} />,
    "exact-audience": <TabExactAudience />,
    "siteid":         <TabSiteID />,
    "buyers-dna":     <TabBuyersDNA />,
    "live-search":    <TabLiveSearch />,
  };

  return (
    <div className="min-h-screen" style={{ background: C.bg, color: C.white, fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div ref={headerRef} className="sticky top-0 z-50 px-4 pt-4 pb-0" style={{ background: C.bg }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs"
                style={{ background: C.gradient, color: C.white }}>IA</div>
              <div>
                <div className="text-sm font-black" style={{ color: C.white }}>Imagine Agency</div>
                <div className="text-xs" style={{ color: C.muted }}>Intelligence Platform</div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: C.green, animation: "pulse 2s infinite" }} />
            <span className="text-xs font-black" style={{ color: C.green }}>LIVE</span>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 overflow-x-auto pb-3 scrollbar-hide" style={{ scrollbarWidth: "none" }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-black transition-all whitespace-nowrap"
              style={{
                background: tab === t.id ? C.gradient : "transparent",
                color: tab === t.id ? C.white : C.muted,
                border: tab === t.id ? "none" : `1px solid transparent`,
              }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-8 pt-2">
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
            {tabContent[tab]}
          </motion.div>
        </AnimatePresence>
      </div>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
