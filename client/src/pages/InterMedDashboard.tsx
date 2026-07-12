/**
 * InterMedDashboard.tsx — InterMed / Healthtrust Pitch Portal
 * Design: Dark navy bg, deep purple + orange/gold gradient, white text only.
 * No grey, no lavender. Heavy animation throughout.
 */

import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { AnimatePresence, motion } from "framer-motion";

// ── Design tokens ─────────────────────────────────────────────────────────────
const C = {
  bg:     "#07071a",
  card:   "#0d0d2b",
  card2:  "#111130",
  border: "#2a1a4a",
  white:  "#ffffff",
  orange: "#f97316",
  gold:   "#f59e0b",
  purple: "#7c3aed",
  purpleLight: "#a855f7",
  red:    "#ef4444",
  green:  "#22c55e",
  // gradient stops
  grad: "linear-gradient(135deg, #7c3aed 0%, #f97316 100%)",
  gradGold: "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)",
  gradPurple: "linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%)",
};

// ── Animated counter hook ─────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1800, start = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setVal(Math.round(ease * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return val;
}

// ── Intersection observer hook ────────────────────────────────────────────────
function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

// ── Animated dollar counter ───────────────────────────────────────────────────
function DollarCounter({ value, prefix = "$", suffix = "", duration = 1800, color = C.orange }: {
  value: number; prefix?: string; suffix?: string; duration?: number; color?: string;
}) {
  const { ref, inView } = useInView();
  const count = useCountUp(value, duration, inView);
  const fmt = (n: number) => {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
    if (n >= 1_000) return (n / 1_000).toFixed(0) + "K";
    return n.toString();
  };
  return <span ref={ref} style={{ color }}>{prefix}{fmt(count)}{suffix}</span>;
}

// ── Glowing stat card ─────────────────────────────────────────────────────────
function GlowCard({ label, value, sub, color = C.orange, delay = 0 }: {
  label: string; value: React.ReactNode; sub?: string; color?: string; delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className="rounded-2xl p-4 relative overflow-hidden"
      style={{ background: C.card, border: `1px solid ${color}40`, boxShadow: `0 0 24px ${color}18` }}>
      <div className="absolute inset-0 opacity-5" style={{ background: `radial-gradient(circle at 70% 30%, ${color}, transparent 70%)` }} />
      <div className="text-xs font-bold tracking-widest mb-1 relative" style={{ color: `${color}cc` }}>{label}</div>
      <div className="text-2xl font-black relative" style={{ letterSpacing: "-0.03em" }}>{value}</div>
      {sub && <div className="text-xs mt-1 relative" style={{ color: `${color}99` }}>{sub}</div>}
    </motion.div>
  );
}

// ── Animated bar ──────────────────────────────────────────────────────────────
function AnimBar({ pct, color, delay = 0 }: { pct: number; color: string; delay?: number }) {
  const { ref, inView } = useInView();
  return (
    <div ref={ref} className="h-2 rounded-full overflow-hidden" style={{ background: `${color}20` }}>
      <motion.div className="h-full rounded-full" style={{ background: color }}
        initial={{ width: 0 }} animate={{ width: inView ? `${pct}%` : 0 }}
        transition={{ delay, duration: 1.2, ease: [0.23, 1, 0.32, 1] }} />
    </div>
  );
}

// ── Pulse dot ─────────────────────────────────────────────────────────────────
function PulseDot({ color }: { color: string }) {
  return (
    <span className="relative inline-flex w-2.5 h-2.5">
      <span className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping" style={{ background: color }} />
      <span className="relative inline-flex rounded-full w-2.5 h-2.5" style={{ background: color }} />
    </span>
  );
}

// ── Section label ─────────────────────────────────────────────────────────────
function SL({ children, color = C.orange }: { children: React.ReactNode; color?: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-1 h-5 rounded-full" style={{ background: C.grad }} />
      <span className="text-xs font-black tracking-widest uppercase" style={{ color }}>{children}</span>
    </div>
  );
}

// ── Tab definitions ───────────────────────────────────────────────────────────
const TABS = [
  { id: "overview",    label: "Deal Overview",    icon: "🎯" },
  { id: "players",     label: "Key Players",      icon: "👥" },
  { id: "intermend",   label: "InterMed Direct",  icon: "🏥" },
  { id: "healthtrust", label: "Healthtrust GPO",  icon: "🌐" },
  { id: "meeting",     label: "Meeting Playbook", icon: "📋" },
  { id: "pricing",     label: "Pricing & ROI",    icon: "💰" },
  { id: "weekly",      label: "Weekly Report Demo", icon: "📊" },
];

// ══════════════════════════════════════════════════════════════════════════════
// TAB: DEAL OVERVIEW
// ══════════════════════════════════════════════════════════════════════════════
function TabOverview() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex items-center gap-2 mb-1">
          <PulseDot color={C.green} />
          <span className="text-xs font-black tracking-widest" style={{ color: C.green }}>HIGH-VALUE OPPORTUNITY — TWO-STAGE ENTERPRISE DEAL</span>
        </div>
        <h2 className="text-3xl font-black mb-2" style={{ background: C.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "-0.04em" }}>
          $10.7M — $20M+ Over 3 Years
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: C.white }}>
          Roger Biles (InterMed Resources TN) + Latda Vaughan — warm intro via commission partner.
          Stage 1: direct enterprise sale to InterMed. Stage 2: strategic partnership with Healthtrust GPO
          that unlocks a network of 1,900 hospitals and 1,000 contracted suppliers.
        </p>
      </motion.div>

      {/* Year 1 KPIs */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <GlowCard label="Year 1 Conservative" value={<DollarCounter value={3290000} color={C.orange} />} sub="3-stream total" color={C.orange} delay={0} />
        <GlowCard label="3-Year Upside" value={<DollarCounter value={20000000} color={C.purpleLight} />} sub="Gross revenue" color={C.purpleLight} delay={0.1} />
        <GlowCard label="3-Year Net to EA" value={<DollarCounter value={15000000} color={C.gold} />} sub="After 25% commission" color={C.gold} delay={0.2} />
        <GlowCard label="Commission (25%)" value={<DollarCounter value={822500} color={C.green} />} sub="Year 1 conservative" color={C.green} delay={0.3} />
      </div>

      {/* Two-stage structure */}
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          {
            num: "1", title: "Stage 1 — InterMed Direct", color: C.orange,
            body: "InterMed distributes medical devices to 2,500+ hospitals. Their independent product lines (lasers, urology, spinal implants, hernia mesh) need BuyersDNA + ExactAudience to find which hospitals are actively shopping right now.",
            badge: "Entry point — solve their immediate pain first",
            value: "$75K–$150K/yr",
          },
          {
            num: "2", title: "Stage 2 — Healthtrust GPO", color: C.purpleLight,
            body: "Healthtrust (owned by HCA) manages 1,900+ hospitals and 26,000+ care sites. Their business development team signed 58 new members in 2023. ExactAudience identifies hospitals showing GPO evaluation intent before competitors know.",
            badge: "Strategic prize — network growth engine",
            value: "$250K–$500K+/yr",
          },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: i === 0 ? -20 : 20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.1, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            className="rounded-2xl p-5 relative overflow-hidden"
            style={{ background: `${s.color}08`, border: `1px solid ${s.color}35` }}>
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-5" style={{ background: s.color, transform: "translate(30%, -30%)" }} />
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black shrink-0"
                style={{ background: s.color, color: C.bg }}>{s.num}</div>
              <span className="font-black text-sm" style={{ color: s.color }}>{s.title}</span>
            </div>
            <p className="text-xs leading-relaxed mb-3" style={{ color: C.white }}>{s.body}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: `${s.color}20`, color: s.color }}>{s.badge}</span>
              <span className="text-lg font-black" style={{ color: s.color }}>{s.value}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* One-sentence pitches */}
      <div className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <SL color={C.gold}>One-Sentence Pitches</SL>
        <div className="space-y-3">
          {[
            { label: "For Roger / InterMed", color: C.orange, pitch: "\"We tell your sales team which hospitals are actively shopping for medical devices right now — and we hand them the name of the person doing the shopping.\"" },
            { label: "For Healthtrust", color: C.purpleLight, pitch: "\"We identify every hospital in the country that is evaluating a GPO relationship right now, before your competitors know — and we hand your business development team that list every month.\"" },
          ].map((p, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="rounded-xl p-4" style={{ background: C.card2, borderLeft: `3px solid ${p.color}` }}>
              <div className="text-xs font-black mb-1.5" style={{ color: p.color }}>{p.label}</div>
              <div className="text-sm font-semibold italic leading-relaxed" style={{ color: C.white }}>{p.pitch}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Commission warning */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
        className="rounded-xl p-4 flex items-start gap-3" style={{ background: `${C.red}10`, border: `1px solid ${C.red}40` }}>
        <span className="text-xl shrink-0">⚠️</span>
        <div>
          <div className="text-sm font-black mb-1" style={{ color: C.red }}>Commission Agreement — Do This First</div>
          <div className="text-xs leading-relaxed" style={{ color: C.white }}>
            25% on BOTH the InterMed direct deal AND any Healthtrust deal. Document before the first call. Do not discuss in the room with Roger and Latda.
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB: KEY PLAYERS
// ══════════════════════════════════════════════════════════════════════════════
function TabPlayers() {
  const [active, setActive] = useState<string | null>('roger');
  const players = [
    {
      id: 'roger', name: 'Roger Biles', title: 'Founder, Managing Partner & CEO', company: 'InterMed Resources TN', color: C.orange, emoji: '👔',
      bio: "Over 20 years in healthcare distribution. Founded SourceMark before building InterMed. During COVID-19, leveraged a 20-year relationship with one of China's largest trading groups to supply 60M+ masks when most distributors were paralyzed.",
      connections: ['Trump Small Business Council member', 'Deep C-suite relationships inside HCA Healthcare', 'Direct access to Healthtrust leadership', '20-year relationship with China\'s largest trading groups', 'Previously founded SourceMark'],
      strategy: ['Treat him as a door-opener, not just a customer', 'Let him bring up the Healthtrust opportunity — don\'t lead with it', 'His HCA connections mean he can get you in front of Healthtrust leadership', 'Ask directly: "Who at Healthtrust runs hospital network development?"', 'His China relationships may open international medical device manufacturer opportunities'],
      role: 'Primary decision-maker and door-opener to Healthtrust',
    },
    {
      id: 'latda', name: 'Latda Vaughan', title: 'Medical Device Consultant (30 years)', company: 'InterMed Resources TN — Senior Consultant', color: C.purpleLight, emoji: '🩺',
      bio: "Not listed as an executive but operates as Roger's right hand on business development and GPO strategy. With 30 years in medical devices, she has deep relationships inside hospital procurement and the GPO world.",
      connections: ['30 years in medical device industry', 'Deep relationships inside hospital procurement', 'Likely knows Healthtrust buyers personally', 'GPO strategy and business development expertise', "Roger's primary operational partner"],
      strategy: ['Treat Latda as a CO-DECISION-MAKER — not a plus-one', 'She likely has more operational knowledge of Healthtrust than Roger day-to-day', 'Direct your product demo to her — she will understand the data value immediately', 'Ask her specifically about procurement decision-maker contacts inside hospitals', 'She may be the one who facilitates the Healthtrust introduction operationally'],
      role: 'Co-decision-maker with deep GPO and procurement relationships',
    },
    {
      id: 'healthtrust', name: 'Healthtrust Leadership', title: 'Key Contacts for Stage 2', company: 'Healthtrust Performance Group (HCA)', color: C.gold, emoji: '🏛',
      bio: "Healthtrust is owned by HCA Healthcare — the world's largest for-profit hospital operator. These are the people Roger can introduce you to for the Stage 2 network growth conversation.",
      connections: ['Ed Jones — President & CEO', 'Jocelyn Bradshaw — President, GPO Operations', 'Rich Philbrick — Chief Customer Officer', 'Eric Swaim — SVP, Strategic Sourcing'],
      strategy: ['Rich Philbrick (Chief Customer Officer) is your primary Stage 2 target', 'Ed Jones (President & CEO) is the ultimate decision-maker', 'Do NOT cold-approach Healthtrust — let Roger make the introduction', 'Frame the pitch as a network growth engine, not a software subscription', 'The ROI on a single new hospital member justifies the $250K–$500K price'],
      role: 'Stage 2 target — ask Roger for the introduction',
    },
  ];
  const ap = players.find(p => p.id === active);
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-black mb-1" style={{ background: C.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Key Players</h2>
        <p className="text-xs" style={{ color: C.white }}>Tap each person to see their profile, connections, and exact meeting strategy.</p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {players.map((p, i) => (
          <motion.button key={p.id} onClick={() => setActive(p.id === active ? null : p.id)}
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            whileTap={{ scale: 0.97 }}
            className="rounded-xl p-3 border text-left transition-all duration-200"
            style={{ background: active === p.id ? `${p.color}18` : C.card, borderColor: active === p.id ? p.color : C.border, boxShadow: active === p.id ? `0 0 20px ${p.color}25` : 'none' }}>
            <div className="text-2xl mb-1">{p.emoji}</div>
            <div className="text-xs font-black leading-tight" style={{ color: active === p.id ? p.color : C.white }}>{p.name}</div>
            <div className="text-xs mt-0.5 leading-tight" style={{ color: `${p.color}99`, fontSize: '0.6rem' }}>{p.title.split('(')[0].trim()}</div>
          </motion.button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {ap && (
          <motion.div key={ap.id} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            className="rounded-2xl border p-5 space-y-4 relative overflow-hidden"
            style={{ background: `${ap.color}08`, borderColor: `${ap.color}35` }}>
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-5" style={{ background: ap.color, transform: "translate(40%, -40%)" }} />
            <div>
              <div className="text-xs font-black tracking-widest mb-0.5" style={{ color: ap.color }}>{ap.company.toUpperCase()}</div>
              <h3 className="text-xl font-black mb-0.5" style={{ color: C.white }}>{ap.name}</h3>
              <div className="text-xs mb-2" style={{ color: `${ap.color}cc` }}>{ap.title}</div>
              <span className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: `${ap.color}20`, color: ap.color }}>{ap.role}</span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: C.white }}>{ap.bio}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {[{ title: "Key Connections", items: ap.connections, color: ap.color }, { title: "Meeting Strategy", items: ap.strategy, color: C.gold }].map((col, ci) => (
                <div key={ci} className="rounded-xl p-3" style={{ background: C.card2, borderLeft: `3px solid ${col.color}` }}>
                  <div className="text-xs font-black mb-2" style={{ color: col.color }}>{col.title}</div>
                  <div className="space-y-1.5">
                    {col.items.map((item, j) => (
                      <motion.div key={j} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: j * 0.05 }}
                        className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full shrink-0 mt-1" style={{ background: col.color }} />
                        <span className="text-xs leading-relaxed" style={{ color: C.white }}>{item}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB: INTERMED DIRECT
// ══════════════════════════════════════════════════════════════════════════════
function TabInterMed() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-black mb-1" style={{ background: C.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>InterMed Direct — Stage 1</h2>
        <p className="text-xs leading-relaxed" style={{ color: C.white }}>$650M medical device distributor. Their independent product lines need ExactAudience to find which hospitals are actively shopping right now.</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Revenue", value: "$650M+", sub: "Medical device distribution", color: C.orange },
          { label: "Hospitals Served", value: "2,500+", sub: "Nationwide", color: C.orange },
          { label: "Pricing Anchor", value: "$75K–$150K", sub: "BuyersDNA + ExactAudience + SITEID", color: C.gold },
          { label: "Contract Type", value: "Annual", sub: "Enterprise SaaS", color: C.green },
        ].map((s, i) => (
          <GlowCard key={i} label={s.label} value={<span style={{ color: s.color }}>{s.value}</span>} sub={s.sub} color={s.color} delay={i * 0.07} />
        ))}
      </div>
      {[
        { title: "Independent Product Lines (where ExactAudience fits most)", color: C.orange, items: ["Medical lasers — sold independently to hospitals & surgery centers", "Urology supplies — independent product line outside Healthtrust contracts", "Spinal implants — high-value, long sales cycle, needs intent data", "Hernia mesh — competitive category, need to know who is evaluating suppliers", "Lead wires & cables — repeat purchase, loyalty and competitive displacement"] },
        { title: "Their Pain — What ExactAudience Solves", color: C.red, items: ["Sales team calls hospitals cold with no data on who is actively shopping", "No visibility into which hospitals are evaluating new device suppliers right now", "Don't know when a hospital is coming up on contract renewal", "Can't identify the right decision-maker before calling", "intermedtn.com gets hospital visitors who leave anonymously — SITEID solves this"] },
      ].map((card, ci) => (
        <motion.div key={ci} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + ci * 0.1 }}
          className="rounded-2xl p-4" style={{ background: C.card, border: `1px solid ${C.border}`, borderLeft: `3px solid ${card.color}` }}>
          <div className="text-sm font-black mb-3" style={{ color: card.color }}>{card.title}</div>
          <div className="space-y-2">
            {card.items.map((item, j) => (
              <motion.div key={j} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + j * 0.06 }}
                className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5" style={{ background: card.color }} />
                <span className="text-xs leading-relaxed" style={{ color: C.white }}>{item}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}
      {/* Target Intelligence */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="rounded-2xl p-5 space-y-4" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <SL color={C.purpleLight}>Target Intelligence — What Hospitals Are Searching For</SL>
        <p className="text-xs leading-relaxed" style={{ color: C.white }}>These are the active buying signals BuyersDNA monitors across 127 data sources. When a hospital administrator searches for any of these, InterMed's sales team gets the alert — with the decision-maker's name and contact.</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {[
            { category: "Surgical & Procedural Equipment", signals: ["Laser systems for urology, ENT & dermatology", "Minimally invasive surgical tools", "Capital equipment evaluation (lease expiring)", "New service line launch research"] },
            { category: "Spinal & Orthopedic Implants", signals: ["Spinal implant supplier evaluation", "Coming off GPO contract — seeking alternatives", "New surgeon joining with specific system preference", "Value analysis committee review triggered"] },
            { category: "Hernia Mesh & Wound Care", signals: ["Hernia mesh supplier alternatives (recall/price increase)", "VAC evaluation of wound care products", "New surgeon preference driving switch", "Cost reduction initiative on consumables"] },
            { category: "Urology Supplies & Disposables", signals: ["Catheter system sourcing", "Stone management tool evaluation", "Laser fiber supplier comparison", "Utilization cost overrun review"] },
            { category: "Lead Wires, Cables & Monitoring", signals: ["OEM-compatible replacement search", "Service contract expiring on capital equipment", "Biomedical cost reduction initiative", "Standardization across facilities"] },
            { category: "GPO & Vendor Evaluation", signals: ["Competitor distributor site visits", "GPO contract comparison research", "Medical device trade publication activity", "New surgeon hire triggering supply review"] },
          ].map((cat, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.07 }}
              className="rounded-xl p-3" style={{ background: C.card2, borderLeft: `3px solid ${C.purpleLight}` }}>
              <div className="text-xs font-black mb-2" style={{ color: C.purpleLight }}>{cat.category}</div>
              <div className="space-y-1">
                {cat.signals.map((s, j) => (
                  <div key={j} className="flex items-start gap-1.5">
                    <div className="w-1 h-1 rounded-full shrink-0 mt-1.5" style={{ background: C.purpleLight }} />
                    <span className="text-xs leading-relaxed" style={{ color: C.white }}>{s}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div>
          <div className="text-xs font-black mb-2" style={{ color: C.gold }}>Decision-Makers BuyersDNA Targets</div>
          <div className="space-y-1.5">
            {[
              { title: "VP of Supply Chain / Materials Management", role: "Final vendor approval and contract execution" },
              { title: "Value Analysis Committee (VAC) Chair", role: "Clinical and cost evaluation before any new product enters" },
              { title: "OR Director / Surgical Services Director", role: "Drives capital equipment decisions for the OR" },
              { title: "Chief of Urology / Department Head", role: "Physician preference driving urology supply choices" },
              { title: "Biomedical Engineering Director", role: "Approves equipment compatibility and service contracts" },
              { title: "CFO / VP Finance", role: "Signs off on capital purchases above threshold" },
            ].map((dm, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.06 }}
                className="flex items-start justify-between gap-3 rounded-lg p-2.5" style={{ background: C.card2 }}>
                <span className="text-xs font-black" style={{ color: C.orange }}>{dm.title}</span>
                <span className="text-xs text-right" style={{ color: C.white, maxWidth: '55%' }}>{dm.role}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="rounded-xl p-3" style={{ background: `${C.orange}10`, border: `1px solid ${C.orange}30` }}>
          <div className="text-xs font-black mb-1" style={{ color: C.orange }}>The Demo Moment</div>
          <div className="text-sm font-semibold italic leading-relaxed" style={{ color: C.white }}>
            "Here are 47 hospitals actively researching urology laser systems right now — and here is the name and direct contact of the supply chain director at each one."
          </div>
        </div>
      </motion.div>

      <div className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <SL color={C.gold}>What to Demo in the Meeting</SL>
        <div className="space-y-3">
          {[
            { tool: "BuyersDNA", desc: "Show a live list of hospitals currently showing intent signals for their product categories. \"Here are 47 hospitals actively researching urology suppliers right now.\"" },
            { tool: "ExactAudience", desc: "Show the decision-maker contact for each hospital — supply chain director name, email, phone. \"Here is the person doing the shopping at each hospital.\"" },
            { tool: "SITEID on intermedtn.com", desc: "\"Right now, hospitals are visiting your website and leaving anonymously. SITEID tells you who they are in real time. Would you want to know which hospital supply chain directors are already looking at you?\"" },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
              className="rounded-xl p-3" style={{ background: C.card2, borderLeft: `3px solid ${C.orange}` }}>
              <div className="text-xs font-black mb-1" style={{ color: C.orange }}>{item.tool}</div>
              <div className="text-xs leading-relaxed" style={{ color: C.white }}>{item.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB: HEALTHTRUST GPO
// ══════════════════════════════════════════════════════════════════════════════
function TabHealthtrust() {
  const [activeLevel, setActiveLevel] = useState<number | null>(null);
  const levels = [
    { num: 1, title: "Passive — Direct Contract Only", color: C.orange, revenue: "$350K–$500K/yr", desc: "Healthtrust uses ExactAudience internally for business development. No member or supplier recommendation. Revenue stays at $350K–$500K/year.", action: "Minimum viable outcome — acceptable but not the goal." },
    { num: 2, title: "Endorsed Vendor", color: C.purpleLight, revenue: "$2M–$4M/yr", desc: "Healthtrust includes ExactAudience in their preferred vendor directory and mentions it in member communications. Hospitals and suppliers discover it organically. Drives 2.5–5% adoption.", action: "Ask Roger to facilitate an introduction to Healthtrust business development leadership to discuss this level." },
    { num: 3, title: "Active Channel Partner", color: C.gold, revenue: "$6M–$12M/yr", desc: "Healthtrust actively recommends ExactAudience to members and suppliers as part of their performance improvement portfolio. Drives 10%+ adoption and unlocks the full upside scenario.", action: "The prize. Requires authorization from Healthtrust executive leadership — ask Roger for the right introduction." },
  ];
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-black mb-1" style={{ background: C.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Healthtrust GPO — Stage 2</h2>
        <p className="text-xs leading-relaxed" style={{ color: C.white }}>The strategic prize. Healthtrust Performance Group (owned by HCA) manages 1,900+ hospitals. Their network growth problem is ExactAudience's biggest opportunity.</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Member Hospitals", value: "1,900+", sub: "+ 26,000 care sites", color: C.purpleLight },
          { label: "New Members 2023", value: "58+", sub: "Signed or renewed", color: C.purpleLight },
          { label: "Platform Price", value: "$250K–$500K+", sub: "Per year", color: C.gold },
          { label: "Parent Company", value: "HCA", sub: "World's largest for-profit hospital operator", color: C.orange },
        ].map((s, i) => (
          <GlowCard key={i} label={s.label} value={<span style={{ color: s.color }}>{s.value}</span>} sub={s.sub} color={s.color} delay={i * 0.07} />
        ))}
      </div>

      {/* Partnership levels — animated funnel */}
      <div className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <SL color={C.gold}>3 Partnership Levels — What Has to Be True</SL>
        <p className="text-xs mb-4" style={{ color: C.white }}>The difference between conservative and upside is entirely determined by which level Healthtrust commits to. Tap each level to see the details.</p>
        <div className="space-y-3">
          {levels.map((lv, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
              <button onClick={() => setActiveLevel(activeLevel === lv.num ? null : lv.num)}
                className="w-full rounded-xl p-4 text-left transition-all duration-200"
                style={{ background: activeLevel === lv.num ? `${lv.color}15` : C.card2, border: `1px solid ${activeLevel === lv.num ? lv.color : C.border}`, boxShadow: activeLevel === lv.num ? `0 0 20px ${lv.color}20` : 'none' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm shrink-0"
                      style={{ background: activeLevel === lv.num ? lv.color : `${lv.color}20`, color: activeLevel === lv.num ? C.bg : lv.color }}>
                      {lv.num}
                    </div>
                    <div>
                      <div className="text-sm font-black" style={{ color: activeLevel === lv.num ? lv.color : C.white }}>{lv.title}</div>
                      <div className="text-xs font-bold" style={{ color: lv.color }}>{lv.revenue}</div>
                    </div>
                  </div>
                  <motion.span animate={{ rotate: activeLevel === lv.num ? 180 : 0 }} transition={{ duration: 0.2 }}
                    className="text-xs" style={{ color: lv.color }}>▼</motion.span>
                </div>
                <AnimatePresence>
                  {activeLevel === lv.num && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }} className="overflow-hidden">
                      <div className="mt-3 pt-3 space-y-2" style={{ borderTop: `1px solid ${lv.color}30` }}>
                        <p className="text-xs leading-relaxed" style={{ color: C.white }}>{lv.desc}</p>
                        <div className="rounded-lg p-2.5" style={{ background: `${lv.color}15`, borderLeft: `2px solid ${lv.color}` }}>
                          <div className="text-xs font-black" style={{ color: lv.color }}>Your ask in the meeting:</div>
                          <div className="text-xs mt-0.5" style={{ color: C.white }}>{lv.action}</div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Leadership targets */}
      <div className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <SL color={C.orange}>Healthtrust Leadership — Your Targets</SL>
        <div className="space-y-2">
          {[
            { name: "Rich Philbrick", title: "Chief Customer Officer", priority: "SECONDARY", color: C.orange },
            { name: "Ed Jones", title: "President & CEO", priority: "ULTIMATE", color: C.purpleLight },
            { name: "Jocelyn Bradshaw", title: "President, GPO Operations", priority: "OPERATIONS", color: C.green },
          ].map((p, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.07 }}
              className="flex items-center justify-between rounded-xl p-3" style={{ background: C.card2 }}>
              <div>
                <div className="text-sm font-black" style={{ color: C.white }}>{p.name}</div>
                <div className="text-xs" style={{ color: `${p.color}cc` }}>{p.title}</div>
              </div>
              <div className="text-xs font-black px-2 py-1 rounded-full" style={{ background: `${p.color}20`, color: p.color }}>{p.priority}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB: MEETING PLAYBOOK
// ══════════════════════════════════════════════════════════════════════════════
function TabMeeting() {
  const [openStep, setOpenStep] = useState<number | null>(0);
  const steps = [
    { num: 1, title: "Open by Understanding Their World First", color: C.orange, instruction: "Before you pitch anything, ask questions that let Roger and Latda tell you exactly where the pain is. The goal of this section is to LISTEN, not talk.", questions: ["How does InterMed's sales team currently identify which hospitals are the right targets for their own product lines outside the Healthtrust contract structure?", "When a hospital is coming up on a contract renewal or evaluating new suppliers, how does InterMed find out — and how early?", "What does the typical sales cycle look like for their independent products? Who are the decision-makers inside a hospital they need to reach?", "What is the biggest friction point in growing the independent product business right now?"] },
    { num: 2, title: "Establish the Intent Data Concept Simply", color: C.purpleLight, instruction: "Once you understand their pain, introduce BuyersDNA without jargon.", questions: ["\"What if your sales team knew which hospitals were actively researching new device suppliers right now — before they called anyone?\"", "Explain: hospitals leave behavioral signals across the web when evaluating vendors — research activity, content consumption, competitor site visits. BuyersDNA aggregates those signals from 127 data sources.", "\"If we handed your sales team a weekly list of hospitals showing active buying signals in your product categories, how would that change how they prioritize their outreach?\""] },
    { num: 3, title: "Introduce SITEID for intermedtn.com", color: C.green, instruction: "Show them the anonymous visitor problem on their own website.", questions: ["Right now, hospitals and procurement directors visit intermedtn.com and leave anonymously. InterMed has no idea who they are.", "SITEID places a pixel on their site and identifies those visitors by name, company, and contact information in real time.", "\"Would it be valuable to know which hospital supply chain directors are already looking at your site — before your sales team makes a single cold call?\""] },
    { num: 4, title: "Discuss the Healthtrust Network Growth Opportunity", color: C.gold, instruction: "Let Roger or Latda raise this — but if they don't, introduce it here.", questions: ["Healthtrust's business development team is actively trying to grow their network. They signed 58 new members in 2023. The challenge is knowing which hospitals are open to a GPO conversation before a competitor gets there.", "\"When Healthtrust's business development team is looking for new hospital members, how do they currently identify which hospitals to approach?\"", "\"Who at Healthtrust runs hospital network development? Is that a relationship you can facilitate?\""] },
    { num: 5, title: "Explore the White-Label / Co-Sell Model", color: C.orange, instruction: "Ask whether InterMed would want to offer ExactAudience as a value-added service to the manufacturers they distribute for.", questions: ["\"Are there manufacturers in your network who would pay for better hospital targeting data?\"", "\"Could this be something InterMed offers as part of your distribution value proposition?\"", "This creates a potential channel partner relationship — not just a direct sale."] },
    { num: 6, title: "Explore the China Angle", color: C.purpleLight, instruction: "Roger's 20-year relationship with China's largest trading groups is a significant asset.", questions: ["\"Are there Chinese medical device manufacturers trying to enter the US hospital market through Healthtrust or other GPO channels?\"", "Those manufacturers face an even harder targeting problem — they have no US market intelligence. ExactAudience could be the tool that helps them identify the right US hospital buyers.", "\"Are any of your China relationships looking to expand into the US hospital market? That is a use case we could support directly.\""] },
    { num: 7, title: "Close with a Specific Next Step", color: C.green, instruction: "Do not leave without a defined next action.", questions: ["\"Can we run a 30-day pilot on intermedtn.com with SITEID so you can see exactly who is visiting your site right now?\"", "\"Can you make an introduction to the business development team at Healthtrust so we can explore the network growth conversation?\"", "\"Can we put together a one-page proposal showing what this looks like for your independent product lines specifically?\""] },
  ];
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-black mb-1" style={{ background: C.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Meeting Playbook</h2>
        <p className="text-xs" style={{ color: C.white }}>7-step framework for the Roger Biles & Latda Vaughan meeting. Tap each step to expand.</p>
      </div>
      <div className="space-y-2">
        {steps.map((step, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="rounded-xl border overflow-hidden"
            style={{ borderColor: openStep === i ? step.color : C.border, background: openStep === i ? `${step.color}08` : C.card }}>
            <button className="w-full flex items-center gap-3 p-4 text-left" onClick={() => setOpenStep(openStep === i ? null : i)}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0"
                style={{ background: openStep === i ? step.color : `${step.color}20`, color: openStep === i ? C.bg : step.color }}>{step.num}</div>
              <span className="text-sm font-black flex-1" style={{ color: openStep === i ? step.color : C.white }}>{step.title}</span>
              <motion.span animate={{ rotate: openStep === i ? 180 : 0 }} transition={{ duration: 0.2 }} className="text-xs" style={{ color: step.color }}>▼</motion.span>
            </button>
            <AnimatePresence>
              {openStep === i && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22 }} className="overflow-hidden">
                  <div className="px-4 pb-4 space-y-3">
                    <div className="text-xs leading-relaxed px-3 py-2 rounded-lg" style={{ background: C.card2, color: C.white, borderLeft: `3px solid ${step.color}` }}>{step.instruction}</div>
                    <div className="space-y-2">
                      {step.questions.map((q, j) => (
                        <motion.div key={j} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: j * 0.05 }}
                          className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5" style={{ background: step.color }} />
                          <span className="text-xs leading-relaxed" style={{ color: C.white }}>{q}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
      <div className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <SL color={C.red}>Questions to Have Answered Before You Leave</SL>
        <div className="space-y-2">
          {[
            { q: "Who are the decision-makers inside hospitals for their product categories?", why: "Shapes how you configure BuyersDNA targeting" },
            { q: "Does Healthtrust have a formal vendor evaluation process for new tools?", why: "Determines the sales cycle length for Stage 2" },
            { q: "Who is Roger's specific contact at Healthtrust for business development?", why: "Identifies the right introduction to request" },
            { q: "Is Latda actively involved in the Healthtrust relationship or primarily the independent product side?", why: "Determines who to keep in the loop post-meeting" },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="rounded-xl p-3" style={{ background: C.card2 }}>
              <div className="text-xs font-black mb-1" style={{ color: C.white }}>{item.q}</div>
              <div className="text-xs" style={{ color: `${C.orange}cc` }}>Why it matters: {item.why}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB: PRICING & ROI  (full 3-stream animated model)
// ══════════════════════════════════════════════════════════════════════════════
function AnimatedRevenueBar({ label, gross, net, commission, color, delay = 0 }: {
  label: string; gross: number; net: number; commission: number; color: string; delay?: number;
}) {
  const { ref, inView } = useInView();
  const maxGross = 12000000;
  const grossPct = (gross / maxGross) * 100;
  const netPct = (net / maxGross) * 100;
  const fmt = (n: number) => n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : `$${(n / 1_000).toFixed(0)}K`;
  return (
    <div ref={ref} className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-black" style={{ color }}>{label}</span>
        <span className="text-sm font-black" style={{ color }}>{fmt(gross)}</span>
      </div>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-xs w-16 shrink-0" style={{ color: `${color}99` }}>Gross</span>
          <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ background: `${color}15` }}>
            <motion.div className="h-full rounded-full" style={{ background: color }}
              initial={{ width: 0 }} animate={{ width: inView ? `${grossPct}%` : 0 }}
              transition={{ delay, duration: 1.4, ease: [0.23, 1, 0.32, 1] }} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs w-16 shrink-0" style={{ color: `${C.green}99` }}>Net to EA</span>
          <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ background: `${C.green}15` }}>
            <motion.div className="h-full rounded-full" style={{ background: C.green }}
              initial={{ width: 0 }} animate={{ width: inView ? `${netPct}%` : 0 }}
              transition={{ delay: delay + 0.15, duration: 1.4, ease: [0.23, 1, 0.32, 1] }} />
          </div>
        </div>
      </div>
      <div className="flex gap-3 text-xs">
        <span style={{ color: C.white }}>Net: <strong style={{ color: C.green }}>{fmt(net)}</strong></span>
        <span style={{ color: C.white }}>Commission: <strong style={{ color: C.gold }}>{fmt(commission)}</strong></span>
      </div>
    </div>
  );
}

function TabPricing() {
  const [activeYear, setActiveYear] = useState<1 | 2 | 3>(1);
  const yearData = {
    1: {
      label: "Year 1 — Conservative",
      streams: [
        { label: "Healthtrust Direct Contract", gross: 350000, net: 262500, commission: 87500, color: C.purpleLight },
        { label: "Member Hospital Adoption (2.5% = 48 hospitals)", gross: 1440000, net: 1080000, commission: 360000, color: C.orange },
        { label: "Supplier Network Adoption (5% = 20 suppliers)", gross: 1500000, net: 1125000, commission: 375000, color: C.gold },
      ],
      total: { gross: 3290000, net: 2467500, commission: 822500 },
    },
    2: {
      label: "Year 2 — Base Scenario",
      streams: [
        { label: "Healthtrust Direct Contract (renewed)", gross: 400000, net: 300000, commission: 100000, color: C.purpleLight },
        { label: "Member Hospital Adoption (5% = 95 hospitals)", gross: 2850000, net: 2137500, commission: 712500, color: C.orange },
        { label: "Supplier Network Adoption (10% = 40 suppliers)", gross: 3000000, net: 2250000, commission: 750000, color: C.gold },
      ],
      total: { gross: 6250000, net: 4687500, commission: 1562500 },
    },
    3: {
      label: "Year 3 — Upside Scenario",
      streams: [
        { label: "Healthtrust Direct Contract (expanded)", gross: 500000, net: 375000, commission: 125000, color: C.purpleLight },
        { label: "Member Hospital Adoption (10% = 190 hospitals)", gross: 5700000, net: 4275000, commission: 1425000, color: C.orange },
        { label: "Supplier Network Adoption (15% = 60 suppliers)", gross: 4500000, net: 3375000, commission: 1125000, color: C.gold },
      ],
      total: { gross: 10700000, net: 8025000, commission: 2675000 },
    },
  };
  const yd = yearData[activeYear];
  const fmt = (n: number) => n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : `$${(n / 1_000).toFixed(0)}K`;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black mb-1" style={{ background: C.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Pricing & ROI — 3-Stream Model</h2>
        <p className="text-xs leading-relaxed" style={{ color: C.white }}>This is not a $325K deal. It is a $10.7M–$20M+ opportunity depending on which partnership level Healthtrust commits to.</p>
      </div>

      {/* 3-year totals */}
      <div className="grid grid-cols-3 gap-2">
        {([1, 2, 3] as const).map(yr => (
          <motion.button key={yr} onClick={() => setActiveYear(yr)} whileTap={{ scale: 0.97 }}
            className="rounded-xl p-3 text-center transition-all duration-200"
            style={{ background: activeYear === yr ? `${C.orange}15` : C.card, border: `1px solid ${activeYear === yr ? C.orange : C.border}`, boxShadow: activeYear === yr ? `0 0 20px ${C.orange}20` : 'none' }}>
            <div className="text-xs font-black mb-1" style={{ color: activeYear === yr ? C.orange : C.white }}>Year {yr}</div>
            <div className="text-lg font-black" style={{ color: activeYear === yr ? C.orange : C.white }}>
              {yr === 1 ? '$3.3M' : yr === 2 ? '$6.3M' : '$10.7M'}
            </div>
            <div className="text-xs" style={{ color: `${C.orange}80` }}>{yr === 1 ? 'Conservative' : yr === 2 ? 'Base' : 'Upside'}</div>
          </motion.button>
        ))}
      </div>

      {/* Animated stream bars */}
      <AnimatePresence mode="wait">
        <motion.div key={activeYear} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }} className="rounded-2xl p-5 space-y-5"
          style={{ background: C.card, border: `1px solid ${C.border}` }}>
          <SL color={C.orange}>{yd.label}</SL>
          {yd.streams.map((s, i) => (
            <AnimatedRevenueBar key={i} label={s.label} gross={s.gross} net={s.net} commission={s.commission} color={s.color} delay={i * 0.15} />
          ))}
          <div className="pt-3 rounded-xl p-4" style={{ background: C.card2, border: `1px solid ${C.gold}40` }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-black" style={{ color: C.gold }}>Year {activeYear} Total</span>
              <span className="text-2xl font-black" style={{ background: C.gradGold, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{fmt(yd.total.gross)}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><div className="text-xs font-black" style={{ color: C.green }}>{fmt(yd.total.net)}</div><div className="text-xs" style={{ color: `${C.green}80` }}>Net to ExactAudience</div></div>
              <div><div className="text-xs font-black" style={{ color: C.gold }}>{fmt(yd.total.commission)}</div><div className="text-xs" style={{ color: `${C.gold}80` }}>Referral commission (25%)</div></div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* 3-year cumulative */}
      <div className="rounded-2xl p-5" style={{ background: `${C.purple}10`, border: `1px solid ${C.purpleLight}30` }}>
        <SL color={C.purpleLight}>3-Year Cumulative View</SL>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Conservative", gross: 16600000, net: 12400000, comm: 4100000 },
            { label: "Base", gross: 20000000, net: 15000000, comm: 5000000 },
            { label: "Upside", gross: 30000000, net: 22500000, comm: 7500000 },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
              className="rounded-xl p-3 text-center" style={{ background: C.card2 }}>
              <div className="text-xs font-black mb-1" style={{ color: C.white }}>{s.label}</div>
              <div className="text-xl font-black mb-1" style={{ background: C.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                <DollarCounter value={s.gross} duration={2000} color="inherit" />
              </div>
              <div className="text-xs" style={{ color: C.green }}>Net: {fmt(s.net)}</div>
              <div className="text-xs" style={{ color: C.gold }}>Comm: {fmt(s.comm)}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Key assumptions */}
      <div className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <SL color={C.gold}>Key Assumptions</SL>
        <div className="space-y-2">
          {[
            { assumption: "1,900 member hospitals", basis: "Healthtrust public data" },
            { assumption: "~400 addressable mid-market suppliers", basis: "Healthtrust public data; excludes large enterprises with in-house data teams" },
            { assumption: "$30,000/year per hospital", basis: "SITEID + BuyersDNA mid-market pricing" },
            { assumption: "$75,000/year per supplier", basis: "BuyersDNA + ExactAudience enterprise pricing" },
            { assumption: "25% referral commission", basis: "Existing partner agreement — document before first call" },
            { assumption: "Conservative adoption rates", basis: "Dependent on Healthtrust's active endorsement — see Partnership Levels" },
          ].map((row, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
              className="flex items-start justify-between gap-3 rounded-xl p-3" style={{ background: C.card2 }}>
              <span className="text-xs font-black" style={{ color: C.orange }}>{row.assumption}</span>
              <span className="text-xs text-right" style={{ color: C.white }}>{row.basis}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Commission warning */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        className="rounded-xl p-4 flex items-start gap-3" style={{ background: `${C.red}10`, border: `1px solid ${C.red}40` }}>
        <span className="text-xl shrink-0">⚠️</span>
        <div>
          <div className="text-sm font-black mb-1" style={{ color: C.red }}>Commission Agreement — Do This First</div>
          <div className="text-xs leading-relaxed" style={{ color: C.white }}>
            25% on BOTH the InterMed direct deal AND any Healthtrust deal that flows from this introduction.
            Document before the first call. Do not discuss in the room with Roger and Latda — but make sure your internal paperwork is clean before any proposal goes out.
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB: WEEKLY REPORT DEMO
// ══════════════════════════════════════════════════════════════════════════════
type HospitalEntry = {
  name: string; city: string; beds: number; signal: string;
  intensity: number; weeks: number;
  contact: { name: string; title: string; phone: string; email: string };
  tags: string[];
};

function OutreachPanel({ h }: { h: HospitalEntry }) {
  const [channel, setChannel] = useState<'email' | 'linkedin' | 'mail'>('email');
  const first = h.contact.name.split(' ')[0];
  const channels: { id: 'email' | 'linkedin' | 'mail'; label: string; icon: string }[] = [
    { id: 'email', label: 'Email', icon: '✉️' },
    { id: 'linkedin', label: 'LinkedIn', icon: '💼' },
    { id: 'mail', label: 'Direct Mail', icon: '📬' },
  ];
  const content = {
    email: {
      subject: `${h.signal} — Sourcing Support for ${h.name}`,
      body: `Hi ${first},\n\nI wanted to reach out because we noticed ${h.name} has been actively evaluating ${h.signal.toLowerCase()} options over the past ${h.weeks} week${h.weeks > 1 ? 's' : ''}.\n\nInterMed Resources specializes in exactly this category — we work with regional health systems across Tennessee to source high-quality products at GPO-competitive pricing, often with faster delivery timelines than national distributors.\n\nWould a 15-minute call this week make sense? I can share what we're seeing other health systems in your region doing right now.\n\nBest,\n[Your Name]\nInterMed Resources TN\n[Phone]`,
    },
    linkedin: {
      subject: 'LinkedIn Connection Request Note',
      body: `Hi ${first} — I work with InterMed Resources TN, a specialty medical device distributor focused on the Southeast. I noticed ${h.name} has been evaluating ${h.signal.toLowerCase()} recently and thought it might be worth connecting. We've helped several Tennessee health systems find cost-effective sourcing in this category. Happy to share what we're seeing in the market if it's useful.`,
    },
    mail: {
      subject: 'Direct Mail — Personalized Letter',
      body: `${h.contact.name}\n${h.contact.title}\n${h.name}\n${h.city}\n\nDear ${first},\n\nAs a specialty medical device distributor serving Tennessee health systems for over 20 years, InterMed Resources TN has helped OR directors and supply chain leaders like yourself find reliable, cost-competitive sourcing for ${h.signal.toLowerCase()}.\n\nWe understand the pressure of balancing clinical quality with budget constraints — especially when evaluating new suppliers or coming off a GPO contract.\n\nI'd welcome the opportunity to send you a no-obligation product comparison and pricing overview for your current needs. Simply call or email me directly:\n\n[Your Name] | [Phone] | [Email]\nInterMed Resources TN\n\nWarm regards,\n[Your Name]`,
    },
  };
  const active = content[channel];
  return (
    <div className="mt-3 rounded-xl overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
      <div className="flex" style={{ background: C.card2 }}>
        {channels.map(ch => (
          <button key={ch.id} onClick={() => setChannel(ch.id)}
            className="flex-1 py-2 text-xs font-black transition-all"
            style={{
              background: channel === ch.id ? C.orange : 'transparent',
              color: channel === ch.id ? C.bg : C.purpleLight,
            }}>
            {ch.icon} {ch.label}
          </button>
        ))}
      </div>
      <div className="p-3" style={{ background: `${C.purple}15` }}>
        <div className="text-xs font-black mb-2" style={{ color: C.gold }}>{'subject' in active ? active.subject : ''}</div>
        <pre className="text-xs leading-relaxed whitespace-pre-wrap font-sans" style={{ color: C.white }}>{active.body}</pre>
      </div>
    </div>
  );
}

function TabWeeklyReport() {
  const [selected, setSelected] = useState<number | null>(null);
  const hospitals = [
    {
      name: "Vanderbilt University Medical Center",
      city: "Nashville, TN", beds: 1039, signal: "Urology Laser Systems",
      intensity: 94, weeks: 3,
      contact: { name: "Sandra Holloway", title: "VP of Supply Chain", phone: "(615) 322-5000", email: "s.holloway@vumc.org" },
      tags: ["Urology", "Capital Equipment", "High Intent"],
    },
    {
      name: "Baptist Memorial Hospital",
      city: "Memphis, TN", beds: 614, signal: "Spinal Implant Supplier Evaluation",
      intensity: 88, weeks: 5,
      contact: { name: "Marcus Webb", title: "Director of Materials Management", phone: "(901) 226-5000", email: "m.webb@bmhcc.org" },
      tags: ["Spinal", "Orthopedic", "GPO Review"],
    },
    {
      name: "HCA TriStar Centennial Medical Center",
      city: "Nashville, TN", beds: 741, signal: "Hernia Mesh Alternatives",
      intensity: 81, weeks: 2,
      contact: { name: "Denise Cartwright", title: "VAC Chair & Clinical Value Director", phone: "(615) 342-1000", email: "d.cartwright@hcahealthcare.com" },
      tags: ["Hernia Mesh", "VAC Review", "HCA Network"],
    },
    {
      name: "Erlanger Health System",
      city: "Chattanooga, TN", beds: 581, signal: "Lead Wires & Monitoring Accessories",
      intensity: 76, weeks: 4,
      contact: { name: "James Pruitt", title: "Biomedical Engineering Director", phone: "(423) 778-7000", email: "j.pruitt@erlanger.org" },
      tags: ["Monitoring", "Biomedical", "Contract Expiring"],
    },
    {
      name: "Ascension Saint Thomas Hospital",
      city: "Nashville, TN", beds: 683, signal: "Urology Disposables & Catheter Systems",
      intensity: 71, weeks: 2,
      contact: { name: "Patricia Nguyen", title: "OR Director, Surgical Services", phone: "(615) 222-2111", email: "p.nguyen@ascension.org" },
      tags: ["Urology", "Disposables", "OR Director"],
    },
    {
      name: "Regional One Health",
      city: "Memphis, TN", beds: 337, signal: "Minimally Invasive Surgical Tools",
      intensity: 68, weeks: 1,
      contact: { name: "Anthony Brooks", title: "VP Procurement & Supply Chain", phone: "(901) 545-7100", email: "a.brooks@regionalonehealth.org" },
      tags: ["Surgical", "MIS", "New Signal"],
    },
    {
      name: "Cookeville Regional Medical Center",
      city: "Cookeville, TN", beds: 247, signal: "Spinal Implant Supplier Evaluation",
      intensity: 63, weeks: 3,
      contact: { name: "Lisa Tanner", title: "Director of Materials Management", phone: "(931) 528-2541", email: "l.tanner@crmchealth.org" },
      tags: ["Spinal", "Regional", "GPO Review"],
    },
    {
      name: "Wellmont Holston Valley Medical Center",
      city: "Kingsport, TN", beds: 345, signal: "Hernia Mesh & Wound Care Products",
      intensity: 59, weeks: 2,
      contact: { name: "Robert Simmons", title: "Supply Chain Manager", phone: "(423) 224-4000", email: "r.simmons@ballad health.org" },
      tags: ["Hernia Mesh", "Wound Care", "Mid-Market"],
    },
    {
      name: "St. Thomas Rutherford Hospital",
      city: "Murfreesboro, TN", beds: 286, signal: "Capital Equipment Lease Expiring — OR",
      intensity: 55, weeks: 6,
      contact: { name: "Karen Odom", title: "OR Director", phone: "(615) 396-4100", email: "k.odom@ascension.org" },
      tags: ["Capital Equipment", "OR", "Lease Expiring"],
    },
    {
      name: "Sumner Regional Medical Center",
      city: "Gallatin, TN", beds: 155, signal: "GPO Contract Comparison — Urology",
      intensity: 51, weeks: 1,
      contact: { name: "David Morse", title: "Materials Management Director", phone: "(615) 452-4210", email: "d.morse@sumnerregional.com" },
      tags: ["Urology", "GPO", "New Signal"],
    },
  ];
  const intensityColor = (v: number) => v >= 85 ? C.orange : v >= 70 ? C.purpleLight : C.green;
  
  return (
    <div className="space-y-5">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <div className="text-xs font-black tracking-widest mb-1" style={{ color: C.orange }}>BUYERSDNA + EXACTAUDIENCE</div>
            <div className="text-xl font-black" style={{ color: C.white }}>InterMed Resources — Weekly Intelligence Report</div>
            <div className="text-sm mt-0.5" style={{ color: C.purpleLight }}>Week of July 7–11, 2026 &nbsp;·&nbsp; Tennessee Market &nbsp;·&nbsp; 10 Active Targets</div>
          </div>
          <div className="rounded-xl px-4 py-2 text-xs font-black" style={{ background: `${C.orange}20`, color: C.orange, border: `1px solid ${C.orange}40` }}>SAMPLE DELIVERY</div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {[
            { label: "Hospitals In-Market", value: "10", sub: "This week" },
            { label: "High Intent (85+)", value: "2", sub: "Immediate outreach" },
            { label: "Decision-Makers ID'd", value: "10", sub: "Direct contacts" },
          ].map((s, i) => (
            <div key={i} className="rounded-xl p-3 text-center" style={{ background: C.card2 }}>
              <div className="text-2xl font-black" style={{ color: C.orange }}>{s.value}</div>
              <div className="text-xs font-bold" style={{ color: C.white }}>{s.label}</div>
              <div className="text-xs" style={{ color: C.purpleLight }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Hospital List */}
      <div className="space-y-2">
        {hospitals.map((h, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
            onClick={() => setSelected(selected === i ? null : i)}
            className="rounded-xl p-4 cursor-pointer transition-all"
            style={{
              background: selected === i ? `${C.orange}15` : C.card,
              border: `1px solid ${selected === i ? C.orange : C.border}`,
              boxShadow: selected === i ? `0 0 20px ${C.orange}20` : 'none',
            }}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-black" style={{ color: C.white }}>{h.name}</span>
                  <span className="text-xs" style={{ color: C.purpleLight }}>{h.city}</span>
                  <span className="text-xs" style={{ color: C.purpleLight }}>·</span>
                  <span className="text-xs" style={{ color: C.purpleLight }}>{h.beds} beds</span>
                </div>
                <div className="text-xs mt-1 font-semibold" style={{ color: intensityColor(h.intensity) }}>🔥 {h.signal}</div>
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  {h.tags.map((t, j) => (
                    <span key={j} className="text-xs px-2 py-0.5 rounded-full font-bold"
                      style={{ background: `${C.purpleLight}20`, color: C.purpleLight }}>{t}</span>
                  ))}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-2xl font-black" style={{ color: intensityColor(h.intensity) }}>{h.intensity}</div>
                <div className="text-xs" style={{ color: C.purpleLight }}>Intent Score</div>
                <div className="text-xs mt-0.5" style={{ color: C.purpleLight }}>{h.weeks}w signal</div>
              </div>
            </div>
            {/* Expanded contact */}
            {selected === i && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.2 }}
                className="mt-4 pt-4" style={{ borderTop: `1px solid ${C.border}` }}>
                <div className="text-xs font-black mb-2" style={{ color: C.gold }}>DECISION-MAKER CONTACT</div>
                <div className="rounded-xl p-3 space-y-1" style={{ background: C.card2 }}>
                  <div className="font-black" style={{ color: C.white }}>{h.contact.name}</div>
                  <div className="text-xs" style={{ color: C.purpleLight }}>{h.contact.title}</div>
                  <div className="flex gap-4 mt-2 flex-wrap">
                    <a href={`tel:${h.contact.phone}`} className="text-xs font-bold" style={{ color: C.orange }}>📞 {h.contact.phone}</a>
                    <a href={`mailto:${h.contact.email}`} className="text-xs font-bold" style={{ color: C.orange }}>✉️ {h.contact.email}</a>
                  </div>
                </div>
                <OutreachPanel h={h} />
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Footer CTA */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
        className="rounded-2xl p-5 text-center" style={{ background: `linear-gradient(135deg, ${C.purple}40, ${C.orange}20)`, border: `1px solid ${C.orange}30` }}>
        <div className="text-sm font-black mb-1" style={{ color: C.white }}>This is what your sales team receives every Monday morning.</div>
        <div className="text-xs" style={{ color: C.purpleLight }}>10 hospitals. 10 decision-makers. 10 direct contacts. Ready to call.</div>
      </motion.div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN DASHBOARD
// ══════════════════════════════════════════════════════════════════════════════
export default function InterMedDashboard() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen" style={{ background: C.bg, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <style>{`
        @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.6;transform:scale(1.4)} }
        .animate-ping { animation: pulse-dot 1.5s cubic-bezier(0,0,0.2,1) infinite; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #7c3aed44; border-radius: 4px; }
      `}</style>

      {/* Sticky header */}
      <div className="sticky top-0 z-50 border-b" style={{ background: `${C.bg}f0`, backdropFilter: 'blur(16px)', borderColor: C.border }}>
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-3 h-14">
            <button onClick={() => navigate('/campaigns')}
              className="text-xs flex items-center gap-1.5 transition-opacity hover:opacity-70 font-semibold"
              style={{ color: C.orange }}>
              ← Back to Campaigns
            </button>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="max-w-4xl mx-auto px-4 pt-6 pb-4">
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">🏥</span>
              <h1 className="text-3xl font-black" style={{ background: C.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: '-0.04em' }}>
                InterMed / Healthtrust
              </h1>
            </div>
            <div className="text-xs mb-1 font-semibold" style={{ color: C.white }}>Healthcare / Medical Device Distribution · Brentwood, TN</div>
            <div className="text-xs font-black" style={{ color: C.gold }}>InterMed Direct + Healthtrust Network Growth 2026</div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <PulseDot color={C.green} />
            <span className="text-xs font-black tracking-widest" style={{ color: C.green }}>PITCH READY</span>
          </div>
        </motion.div>

        {/* Hero KPIs */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 mb-5">
          <GlowCard label="Year 1 Total" value={<DollarCounter value={3290000} color={C.orange} />} sub="3-stream conservative" color={C.orange} delay={0} />
          <GlowCard label="3-Year Upside" value={<DollarCounter value={20000000} color={C.purpleLight} />} sub="Gross revenue" color={C.purpleLight} delay={0.08} />
          <GlowCard label="Healthtrust Network" value="1,900+" sub="Member hospitals" color={C.gold} delay={0.16} />
          <GlowCard label="Commission (25%)" value={<DollarCounter value={822500} color={C.green} />} sub="Year 1 — document now" color={C.green} delay={0.24} />
        </div>

        {/* Tab nav */}
        <div className="flex gap-1 overflow-x-auto pb-1 -mx-1 px-1" style={{ scrollbarWidth: 'none' }}>
          {TABS.map(tab => (
            <motion.button key={tab.id} onClick={() => setActiveTab(tab.id)} whileTap={{ scale: 0.96 }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-black whitespace-nowrap transition-all duration-150 shrink-0"
              style={{
                background: activeTab === tab.id ? C.grad : C.card,
                color: activeTab === tab.id ? C.bg : C.white,
                border: `1px solid ${activeTab === tab.id ? 'transparent' : C.border}`,
                boxShadow: activeTab === tab.id ? `0 0 16px ${C.orange}30` : 'none',
              }}>
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
        <AnimatePresence mode="wait">
          <motion.div key={activeTab}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}>
            {activeTab === 'overview'    && <TabOverview />}
            {activeTab === 'players'     && <TabPlayers />}
            {activeTab === 'intermend'   && <TabInterMed />}
            {activeTab === 'healthtrust' && <TabHealthtrust />}
            {activeTab === 'meeting'     && <TabMeeting />}
            {activeTab === 'pricing'     && <TabPricing />}
            {activeTab === 'weekly'      && <TabWeeklyReport />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
