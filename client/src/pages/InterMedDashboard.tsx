/**
 * InterMedDashboard.tsx — InterMed / Healthtrust Pitch Portal
 * Two-stage enterprise deal briefing for Roger Biles & Latda Vaughan meeting.
 * Design: Dark navy with sky-blue accent (#0ea5e9), matching EA dashboard aesthetic.
 */

import { useState } from "react";
import { useLocation } from "wouter";
import { AnimatePresence, motion } from "framer-motion";

// ── Design tokens ─────────────────────────────────────────────────────────────
const P = {
  bg:      "#07071a",
  card:    "#0d0d2b",
  card2:   "#111130",
  border:  "#1e1e4a",
  white:   "#f1f5f9",
  muted:   "#8892b0",
  blue:    "#0ea5e9",
  gold:    "#f59e0b",
  green:   "#22c55e",
  red:     "#ef4444",
  purple:  "#a855f7",
};

// ── Types ─────────────────────────────────────────────────────────────────────
interface Tab { id: string; label: string; icon: string; }

const TABS: Tab[] = [
  { id: "overview",    label: "Deal Overview",    icon: "🎯" },
  { id: "players",     label: "Key Players",      icon: "👥" },
  { id: "intermend",   label: "InterMed Direct",  icon: "🏥" },
  { id: "healthtrust", label: "Healthtrust GPO",  icon: "🌐" },
  { id: "meeting",     label: "Meeting Playbook", icon: "📋" },
  { id: "pricing",     label: "Pricing & ROI",    icon: "💰" },
];

// ── Sub-components ────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, color = P.blue }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div className="rounded-xl p-4 border" style={{ background: P.card, borderColor: P.border }}>
      <div className="text-xs font-semibold tracking-widest mb-1" style={{ color: P.muted }}>{label}</div>
      <div className="text-2xl font-black" style={{ color, letterSpacing: "-0.03em" }}>{value}</div>
      {sub && <div className="text-xs mt-1" style={{ color: P.muted }}>{sub}</div>}
    </div>
  );
}

function SectionLabel({ children, color = P.blue }: { children: React.ReactNode; color?: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="w-1.5 h-4 rounded-full" style={{ background: color }} />
      <span className="text-xs font-bold tracking-widest uppercase" style={{ color }}>{children}</span>
    </div>
  );
}

function InfoCard({ title, items, color = P.blue }: { title: string; items: string[]; color?: string }) {
  return (
    <div className="rounded-xl p-4 border" style={{ background: P.card2, borderColor: P.border, borderLeft: `3px solid ${color}` }}>
      <div className="text-sm font-bold mb-3" style={{ color: P.white }}>{title}</div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5" style={{ background: color }} />
            <span className="text-xs leading-relaxed" style={{ color: P.muted }}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Tab: Deal Overview ────────────────────────────────────────────────────────
function TabOverview() {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full" style={{ background: P.green, boxShadow: `0 0 8px ${P.green}` }} />
          <span className="text-xs font-bold tracking-widest" style={{ color: P.green }}>HIGH-VALUE OPPORTUNITY</span>
        </div>
        <h2 className="text-2xl font-black mb-1" style={{ color: P.white, letterSpacing: "-0.03em" }}>Two-Stage Enterprise Deal</h2>
        <p className="text-sm leading-relaxed" style={{ color: P.muted }}>
          Roger Biles (InterMed Resources TN) + Latda Vaughan — warm intro via commission partner. 
          Stage 1: direct enterprise sale to InterMed. Stage 2: strategic partnership with Healthtrust GPO.
        </p>
      </div>

      {/* Deal value cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="InterMed Direct" value="$75K–$150K" sub="Annual contract" color={P.blue} />
        <StatCard label="Healthtrust GPO" value="$250K–$500K+" sub="Platform partnership" color={P.purple} />
        <StatCard label="Total Year 1" value="$325K–$650K+" sub="Conservative–upside" color={P.gold} />
        <StatCard label="Commission (25%)" value="$81K–$162K+" sub="Referral partner" color={P.green} />
      </div>

      {/* Two-stage structure */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl p-5 border" style={{ background: `${P.blue}0a`, borderColor: `${P.blue}30` }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-black" style={{ background: P.blue, color: '#07071a' }}>1</div>
            <span className="font-bold text-sm" style={{ color: P.blue }}>Stage 1 — InterMed Direct</span>
          </div>
          <p className="text-xs leading-relaxed mb-3" style={{ color: P.muted }}>
            InterMed distributes medical devices to 2,500+ hospitals. Their independent product lines 
            (lasers, urology, spinal implants, hernia mesh) need BuyersDNA + ExactAudience to find 
            which hospitals are actively shopping right now.
          </p>
          <div className="text-xs font-semibold px-3 py-1.5 rounded-full inline-block" style={{ background: `${P.blue}20`, color: P.blue }}>
            Entry point — solve their immediate pain first
          </div>
        </div>

        <div className="rounded-2xl p-5 border" style={{ background: `${P.purple}0a`, borderColor: `${P.purple}30` }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-black" style={{ background: P.purple, color: '#07071a' }}>2</div>
            <span className="font-bold text-sm" style={{ color: P.purple }}>Stage 2 — Healthtrust GPO</span>
          </div>
          <p className="text-xs leading-relaxed mb-3" style={{ color: P.muted }}>
            Healthtrust (owned by HCA) manages 1,900+ hospitals and 26,000+ care sites. Their business 
            development team signed 58 new members in 2023. ExactAudience identifies hospitals showing 
            GPO evaluation intent before competitors know.
          </p>
          <div className="text-xs font-semibold px-3 py-1.5 rounded-full inline-block" style={{ background: `${P.purple}20`, color: P.purple }}>
            Strategic prize — network growth engine
          </div>
        </div>
      </div>

      {/* One-sentence pitches */}
      <div className="rounded-2xl p-5 border" style={{ background: P.card, borderColor: P.border }}>
        <SectionLabel color={P.gold}>One-Sentence Pitches</SectionLabel>
        <div className="space-y-4">
          <div className="rounded-xl p-4" style={{ background: P.card2, borderLeft: `3px solid ${P.blue}` }}>
            <div className="text-xs font-bold mb-1" style={{ color: P.blue }}>For Roger / InterMed</div>
            <div className="text-sm font-semibold italic" style={{ color: P.white }}>
              "We tell your sales team which hospitals are actively shopping for medical devices right now — and we hand them the name of the person doing the shopping."
            </div>
          </div>
          <div className="rounded-xl p-4" style={{ background: P.card2, borderLeft: `3px solid ${P.purple}` }}>
            <div className="text-xs font-bold mb-1" style={{ color: P.purple }}>For Healthtrust</div>
            <div className="text-sm font-semibold italic" style={{ color: P.white }}>
              "We identify every hospital in the country that is evaluating a GPO relationship right now, before your competitors know — and we hand your business development team that list every month."
            </div>
          </div>
        </div>
      </div>

      {/* Opportunity source */}
      <div className="rounded-xl p-4 border" style={{ background: P.card, borderColor: P.border }}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-bold tracking-widest mb-1" style={{ color: P.muted }}>OPPORTUNITY SOURCE</div>
            <div className="text-sm font-semibold" style={{ color: P.white }}>Commission partner — warm intro</div>
            <div className="text-xs mt-0.5" style={{ color: P.muted }}>25% commission on both InterMed direct AND Healthtrust deal. Document before first call.</div>
          </div>
          <div className="text-right">
            <div className="text-xs font-bold" style={{ color: P.red }}>⚠ Action Required</div>
            <div className="text-xs mt-0.5" style={{ color: P.muted }}>Sign commission agreement now</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Tab: Key Players ──────────────────────────────────────────────────────────
function TabPlayers() {
  const [active, setActive] = useState<string | null>('roger');

  const players = [
    {
      id: 'roger',
      name: 'Roger Biles',
      title: 'Founder, Managing Partner & CEO',
      company: 'InterMed Resources TN',
      color: P.blue,
      emoji: '👔',
      bio: 'Over 20 years in healthcare distribution. Founded SourceMark before building InterMed. During COVID-19, leveraged a 20-year relationship with one of China\'s largest trading groups to supply 60M+ masks when most distributors were paralyzed.',
      connections: [
        'Trump Small Business Council member',
        'Deep C-suite relationships inside HCA Healthcare',
        'Direct access to Healthtrust leadership',
        '20-year relationship with China\'s largest trading groups',
        'Previously founded SourceMark',
      ],
      strategy: [
        'Treat him as a door-opener, not just a customer',
        'Let him bring up the Healthtrust opportunity — don\'t lead with it',
        'His HCA connections mean he can get you in front of Young Fried or Rich Philbrick',
        'Ask directly: "Who at Healthtrust runs hospital network development?"',
        'His China relationships may open international medical device manufacturer opportunities',
      ],
      role: 'Primary decision-maker and door-opener to Healthtrust',
    },
    {
      id: 'latda',
      name: 'Latda Vaughan',
      title: 'Medical Device Consultant (30 years)',
      company: 'InterMed Resources TN — Senior Consultant',
      color: P.purple,
      emoji: '🩺',
      bio: 'Not listed as an executive but operates as Roger\'s right hand on business development and GPO strategy. With 30 years in medical devices, she has deep relationships inside hospital procurement and the GPO world.',
      connections: [
        '30 years in medical device industry',
        'Deep relationships inside hospital procurement',
        'Likely knows Healthtrust buyers personally',
        'GPO strategy and business development expertise',
        'Roger\'s primary operational partner',
      ],
      strategy: [
        'Treat Latda as a CO-DECISION-MAKER — not a plus-one',
        'She likely has more operational knowledge of Healthtrust than Roger day-to-day',
        'Direct your product demo to her — she will understand the data value immediately',
        'Ask her specifically about procurement decision-maker contacts inside hospitals',
        'She may be the one who facilitates the Healthtrust introduction operationally',
      ],
      role: 'Co-decision-maker with deep GPO and procurement relationships',
    },
    {
      id: 'healthtrust',
      name: 'Healthtrust Leadership',
      title: 'Key Contacts for Stage 2',
      company: 'Healthtrust Performance Group (HCA)',
      color: P.gold,
      emoji: '🏛',
      bio: 'Healthtrust is owned by HCA Healthcare — the world\'s largest for-profit hospital operator. These are the people Roger can introduce you to for the Stage 2 network growth conversation.',
      connections: [
        'Ed Jones — President & CEO',
        'Jocelyn Bradshaw — President, GPO Operations',
        'Rich Philbrick — Chief Customer Officer',
        'Young Fried — SVP, Business Development & Pharmacy Services',
        'Eric Swaim — SVP, Strategic Sourcing',
      ],
      strategy: [
        'Young Fried (SVP Business Development) is your primary target for Stage 2',
        'Rich Philbrick (Chief Customer Officer) is the secondary target',
        'Do NOT cold-approach Healthtrust — let Roger make the introduction',
        'Frame the pitch as a network growth engine, not a software subscription',
        'The ROI on a single new hospital member justifies the $250K–$500K price',
      ],
      role: 'Stage 2 target — ask Roger for the introduction',
    },
  ];

  const activePlayer = players.find(p => p.id === active);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-black mb-1" style={{ color: P.white }}>Key Players</h2>
        <p className="text-xs" style={{ color: P.muted }}>Click each person to see their profile, connections, and meeting strategy.</p>
      </div>

      {/* Player selector */}
      <div className="grid grid-cols-3 gap-2">
        {players.map(p => (
          <button key={p.id} onClick={() => setActive(p.id === active ? null : p.id)}
            className="rounded-xl p-3 border text-left transition-all duration-200"
            style={{
              background: active === p.id ? `${p.color}15` : P.card,
              borderColor: active === p.id ? p.color : P.border,
              boxShadow: active === p.id ? `0 0 16px ${p.color}20` : 'none',
            }}>
            <div className="text-xl mb-1">{p.emoji}</div>
            <div className="text-xs font-bold leading-tight" style={{ color: active === p.id ? p.color : P.white }}>{p.name}</div>
            <div className="text-xs mt-0.5 leading-tight" style={{ color: P.muted, fontSize: '0.6rem' }}>{p.title.split('(')[0].trim()}</div>
          </button>
        ))}
      </div>

      {/* Detail panel */}
      <AnimatePresence mode="wait">
        {activePlayer && (
          <motion.div key={activePlayer.id}
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
            className="rounded-2xl border p-5 space-y-4"
            style={{ background: `${activePlayer.color}08`, borderColor: `${activePlayer.color}30` }}>

            <div>
              <div className="text-xs font-bold tracking-widest mb-0.5" style={{ color: activePlayer.color }}>{activePlayer.company.toUpperCase()}</div>
              <h3 className="text-lg font-black mb-0.5" style={{ color: P.white }}>{activePlayer.name}</h3>
              <div className="text-xs mb-2" style={{ color: P.muted }}>{activePlayer.title}</div>
              <div className="text-xs px-3 py-1.5 rounded-full inline-block font-semibold" style={{ background: `${activePlayer.color}20`, color: activePlayer.color }}>{activePlayer.role}</div>
            </div>

            <p className="text-xs leading-relaxed" style={{ color: P.muted }}>{activePlayer.bio}</p>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl p-3" style={{ background: P.card2, borderLeft: `3px solid ${activePlayer.color}` }}>
                <div className="text-xs font-bold mb-2" style={{ color: activePlayer.color }}>Key Connections</div>
                <div className="space-y-1.5">
                  {activePlayer.connections.map((c, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full shrink-0 mt-1" style={{ background: activePlayer.color }} />
                      <span className="text-xs" style={{ color: P.muted }}>{c}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-xl p-3" style={{ background: P.card2, borderLeft: `3px solid ${P.gold}` }}>
                <div className="text-xs font-bold mb-2" style={{ color: P.gold }}>Meeting Strategy</div>
                <div className="space-y-1.5">
                  {activePlayer.strategy.map((s, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full shrink-0 mt-1" style={{ background: P.gold }} />
                      <span className="text-xs" style={{ color: P.muted }}>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Tab: InterMed Direct ──────────────────────────────────────────────────────
function TabInterMed() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-black mb-1" style={{ color: P.white }}>InterMed Direct — Stage 1</h2>
        <p className="text-xs leading-relaxed" style={{ color: P.muted }}>
          $650M medical device distributor. Their independent product lines need ExactAudience to find 
          which hospitals are actively shopping right now.
        </p>
      </div>

      {/* Company facts */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Revenue" value="$650M+" sub="Medical device distribution" color={P.blue} />
        <StatCard label="Hospitals Served" value="2,500+" sub="Nationwide" color={P.blue} />
        <StatCard label="Pricing Anchor" value="$75K–$150K" sub="BuyersDNA + ExactAudience + SITEID" color={P.gold} />
        <StatCard label="Contract Type" value="Annual" sub="Enterprise SaaS" color={P.green} />
      </div>

      {/* Products they sell */}
      <InfoCard
        title="InterMed Independent Product Lines (where ExactAudience fits most)"
        color={P.blue}
        items={[
          "Medical lasers — sold independently to hospitals & surgery centers",
          "Urology supplies — independent product line outside Healthtrust contracts",
          "Spinal implants — high-value, long sales cycle, needs intent data",
          "Hernia mesh — competitive category, need to know who is evaluating suppliers",
          "Lead wires & cables — repeat purchase, loyalty and competitive displacement",
        ]}
      />

      {/* What they need */}
      <InfoCard
        title="Their Pain — What ExactAudience Solves"
        color={P.red}
        items={[
          "Sales team calls hospitals cold with no data on who is actively shopping",
          "No visibility into which hospitals are evaluating new device suppliers right now",
          "Don't know when a hospital is coming up on contract renewal",
          "Can't identify the right decision-maker (supply chain director, OR manager, CMO) before calling",
          "intermedtn.com gets hospital visitors who leave anonymously — SITEID solves this",
        ]}
      />

      {/* What to demo */}
      <div className="rounded-2xl p-5 border" style={{ background: P.card, borderColor: P.border }}>
        <SectionLabel color={P.gold}>What to Demo in the Meeting</SectionLabel>
        <div className="space-y-3">
          {[
            { tool: "BuyersDNA", desc: "Show a live list of hospitals currently showing intent signals for their product categories. \"Here are 47 hospitals actively researching urology suppliers right now.\"" },
            { tool: "ExactAudience", desc: "Show the decision-maker contact for each hospital — supply chain director name, email, phone. \"Here is the person doing the shopping at each hospital.\"" },
            { tool: "SITEID on intermedtn.com", desc: "\"Right now, hospitals are visiting your website and leaving anonymously. SITEID tells you who they are in real time. Would you want to know which hospital supply chain directors are already looking at you?\"" },
          ].map((item, i) => (
            <div key={i} className="rounded-xl p-3" style={{ background: P.card2, borderLeft: `3px solid ${P.blue}` }}>
              <div className="text-xs font-bold mb-1" style={{ color: P.blue }}>{item.tool}</div>
              <div className="text-xs leading-relaxed" style={{ color: P.muted }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Close options */}
      <InfoCard
        title="Closing Options — Pick One Before You Leave"
        color={P.green}
        items={[
          "\"Can we run a 30-day SITEID pilot on intermedtn.com so you can see exactly who is visiting your site right now?\"",
          "\"Can we put together a one-page proposal showing what this looks like for your independent product lines specifically?\"",
          "\"Can your team give us a list of your top 20 target hospitals? We'll show you which ones are in-market right now.\"",
        ]}
      />
    </div>
  );
}

// ── Tab: Healthtrust GPO ──────────────────────────────────────────────────────
function TabHealthtrust() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-black mb-1" style={{ color: P.white }}>Healthtrust GPO — Stage 2</h2>
        <p className="text-xs leading-relaxed" style={{ color: P.muted }}>
          The strategic prize. Healthtrust Performance Group (owned by HCA) manages 1,900+ hospitals. 
          Their network growth problem is ExactAudience's biggest opportunity.
        </p>
      </div>

      {/* Scale cards */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Member Hospitals" value="1,900+" sub="+ 26,000 care sites" color={P.purple} />
        <StatCard label="New Members 2023" value="58+" sub="Signed or renewed" color={P.purple} />
        <StatCard label="Pricing Anchor" value="$250K–$500K+" sub="Platform partnership/year" color={P.gold} />
        <StatCard label="Parent Company" value="HCA" sub="World's largest for-profit hospital operator" color={P.blue} />
      </div>

      {/* What Healthtrust needs */}
      <InfoCard
        title="Healthtrust's Network Growth Problem"
        color={P.purple}
        items={[
          "Business development team is actively trying to recruit new hospital members",
          "Challenge: knowing which hospitals are open to a GPO conversation BEFORE competitors get there",
          "Signed 58 new members in 2023 — they want to accelerate this",
          "No tool today that identifies hospitals showing GPO evaluation intent signals",
          "SITEID on healthtrustpg.com identifies every hospital admin who visits but doesn't convert",
        ]}
      />

      {/* The pitch */}
      <div className="rounded-2xl p-5 border" style={{ background: `${P.purple}0a`, borderColor: `${P.purple}30` }}>
        <SectionLabel color={P.purple}>The Network Growth Engine Pitch</SectionLabel>
        <div className="rounded-xl p-4 mb-4" style={{ background: P.card2 }}>
          <div className="text-sm font-bold italic mb-2" style={{ color: P.white }}>
            "You grew by 58 new members last year. We can tell you which hospitals are evaluating a GPO relationship right now, before your competitors know. We hand your business development team a monthly list of in-market prospects. You close more members, faster."
          </div>
          <div className="text-xs" style={{ color: P.muted }}>This is a network growth engine pitch — NOT a software subscription pitch.</div>
        </div>
        <div className="space-y-2">
          {[
            "ExactAudience identifies hospitals showing intent around supply chain optimization, cost reduction, and procurement evaluation",
            "BuyersDNA surfaces the behavioral fingerprint of a hospital that is open to a Healthtrust conversation",
            "SITEID on healthtrustpg.com identifies every hospital administrator who visits and leaves without requesting info",
            "Monthly delivery: a list of in-market hospitals your BD team should call this week",
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5" style={{ background: P.purple }} />
              <span className="text-xs leading-relaxed" style={{ color: P.muted }}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Leadership targets */}
      <div className="rounded-2xl p-5 border" style={{ background: P.card, borderColor: P.border }}>
        <SectionLabel color={P.gold}>Healthtrust Leadership — Your Targets</SectionLabel>
        <div className="space-y-2">
          {[
            { name: "Young Fried", title: "SVP, Business Development & Pharmacy Services", priority: "PRIMARY", color: P.gold },
            { name: "Rich Philbrick", title: "Chief Customer Officer", priority: "SECONDARY", color: P.blue },
            { name: "Ed Jones", title: "President & CEO", priority: "ULTIMATE", color: P.purple },
            { name: "Jocelyn Bradshaw", title: "President, GPO Operations", priority: "OPERATIONS", color: P.green },
          ].map((p, i) => (
            <div key={i} className="flex items-center justify-between rounded-xl p-3" style={{ background: P.card2 }}>
              <div>
                <div className="text-sm font-bold" style={{ color: P.white }}>{p.name}</div>
                <div className="text-xs" style={{ color: P.muted }}>{p.title}</div>
              </div>
              <div className="text-xs font-bold px-2 py-1 rounded-full" style={{ background: `${p.color}20`, color: p.color }}>{p.priority}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 rounded-xl p-3" style={{ background: `${P.gold}10`, border: `1px solid ${P.gold}30` }}>
          <div className="text-xs font-bold mb-1" style={{ color: P.gold }}>Critical Rule</div>
          <div className="text-xs" style={{ color: P.muted }}>Do NOT cold-approach Healthtrust independently. Let Roger make the introduction. Ask him directly: "Who at Healthtrust runs hospital network development? Can you facilitate that introduction?"</div>
        </div>
      </div>

      {/* Pricing model */}
      <InfoCard
        title="Healthtrust Pricing Model"
        color={P.gold}
        items={[
          "Structure as a PLATFORM PARTNERSHIP — not a per-seat license",
          "Suggested: $250,000–$500,000/year with a performance component tied to new member conversions",
          "ROI justification: a single new hospital member is worth millions to Healthtrust — justify the price accordingly",
          "As they add hospitals, the contract value grows — make it scale with their network",
          "If Healthtrust recommends ExactAudience to their 1,900 member hospitals, the long-term value is not measurable in a single year",
        ]}
      />
    </div>
  );
}

// ── Tab: Meeting Playbook ─────────────────────────────────────────────────────
function TabMeeting() {
  const [openStep, setOpenStep] = useState<number | null>(0);

  const steps = [
    {
      num: 1,
      title: "Open by Understanding Their World First",
      color: P.blue,
      instruction: "Before you pitch anything, ask questions that let Roger and Latda tell you exactly where the pain is. The goal of this section is to LISTEN, not talk.",
      questions: [
        "How does InterMed's sales team currently identify which hospitals are the right targets for their own product lines outside the Healthtrust contract structure?",
        "When a hospital is coming up on a contract renewal or evaluating new suppliers, how does InterMed find out — and how early?",
        "What does the typical sales cycle look like for their independent products? Who are the decision-makers inside a hospital they need to reach?",
        "What is the biggest friction point in growing the independent product business right now — is it finding the right hospitals, reaching the right people, or converting interest into a signed deal?",
      ],
    },
    {
      num: 2,
      title: "Establish the Intent Data Concept Simply",
      color: P.purple,
      instruction: "Once you understand their pain, introduce BuyersDNA without jargon.",
      questions: [
        "\"What if your sales team knew which hospitals were actively researching new device suppliers right now — before they called anyone?\"",
        "Explain: hospitals leave behavioral signals across the web when evaluating vendors — research activity, content consumption, competitor site visits. BuyersDNA aggregates those signals from 127 data sources.",
        "\"If we handed your sales team a weekly list of hospitals showing active buying signals in your product categories, how would that change how they prioritize their outreach?\"",
      ],
    },
    {
      num: 3,
      title: "Introduce SITEID for intermedtn.com",
      color: P.green,
      instruction: "Show them the anonymous visitor problem on their own website.",
      questions: [
        "Right now, hospitals and procurement directors visit intermedtn.com and leave anonymously. InterMed has no idea who they are.",
        "SITEID places a pixel on their site and identifies those visitors by name, company, and contact information in real time.",
        "\"Would it be valuable to know which hospital supply chain directors are already looking at your site — before your sales team makes a single cold call?\"",
      ],
    },
    {
      num: 4,
      title: "Discuss the Healthtrust Network Growth Opportunity",
      color: P.gold,
      instruction: "Let Roger or Latda raise this — but if they don't, introduce it here.",
      questions: [
        "Healthtrust's business development team is actively trying to grow their network. They signed 58 new members in 2023. The challenge is knowing which hospitals are open to a GPO conversation before a competitor gets there.",
        "\"When Healthtrust's business development team is looking for new hospital members, how do they currently identify which hospitals to approach? Is that a conversation we could have with the right person there?\"",
        "\"Who at Healthtrust runs hospital network development? Is that a relationship you can facilitate?\"",
      ],
    },
    {
      num: 5,
      title: "Explore the White-Label / Co-Sell Model",
      color: P.blue,
      instruction: "Ask whether InterMed would want to offer ExactAudience as a value-added service to the manufacturers they distribute for.",
      questions: [
        "\"Are there manufacturers in your network who would pay for better hospital targeting data?\"",
        "\"Could this be something InterMed offers as part of your distribution value proposition?\"",
        "This creates a potential channel partner relationship — not just a direct sale.",
      ],
    },
    {
      num: 6,
      title: "Explore the China Angle",
      color: P.purple,
      instruction: "Roger's 20-year relationship with China's largest trading groups is a significant asset.",
      questions: [
        "\"Are there Chinese medical device manufacturers trying to enter the US hospital market through Healthtrust or other GPO channels?\"",
        "Those manufacturers face an even harder targeting problem — they have no US market intelligence. ExactAudience could be the tool that helps them identify the right US hospital buyers.",
        "\"Are any of your China relationships looking to expand into the US hospital market? That is a use case we could support directly.\"",
      ],
    },
    {
      num: 7,
      title: "Close with a Specific Next Step",
      color: P.green,
      instruction: "Do not leave without a defined next action.",
      questions: [
        "\"Can we run a 30-day pilot on intermedtn.com with SITEID so you can see exactly who is visiting your site right now?\"",
        "\"Can you make an introduction to the business development team at Healthtrust so we can explore the network growth conversation?\"",
        "\"Can we put together a one-page proposal showing what this looks like for your independent product lines specifically?\"",
      ],
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-black mb-1" style={{ color: P.white }}>Meeting Playbook</h2>
        <p className="text-xs" style={{ color: P.muted }}>7-step framework for the Roger Biles & Latda Vaughan meeting. Tap each step to expand.</p>
      </div>

      <div className="space-y-2">
        {steps.map((step, i) => (
          <div key={i} className="rounded-xl border overflow-hidden transition-all duration-200"
            style={{ borderColor: openStep === i ? step.color : P.border, background: openStep === i ? `${step.color}08` : P.card }}>
            <button className="w-full flex items-center gap-3 p-4 text-left" onClick={() => setOpenStep(openStep === i ? null : i)}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0"
                style={{ background: openStep === i ? step.color : P.card2, color: openStep === i ? '#07071a' : step.color }}>
                {step.num}
              </div>
              <span className="text-sm font-semibold flex-1" style={{ color: openStep === i ? step.color : P.white }}>{step.title}</span>
              <span className="text-xs" style={{ color: P.muted }}>{openStep === i ? '▲' : '▼'}</span>
            </button>
            <AnimatePresence>
              {openStep === i && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22 }} className="overflow-hidden">
                  <div className="px-4 pb-4 space-y-3">
                    <div className="text-xs leading-relaxed px-3 py-2 rounded-lg" style={{ background: P.card2, color: P.muted, borderLeft: `3px solid ${step.color}` }}>
                      {step.instruction}
                    </div>
                    <div className="space-y-2">
                      {step.questions.map((q, j) => (
                        <div key={j} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5" style={{ background: step.color }} />
                          <span className="text-xs leading-relaxed" style={{ color: P.muted }}>{q}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Questions to have answered */}
      <div className="rounded-2xl p-5 border" style={{ background: P.card, borderColor: P.border }}>
        <SectionLabel color={P.red}>Questions to Have Answered Before You Leave</SectionLabel>
        <div className="space-y-2">
          {[
            { q: "Who are the decision-makers inside hospitals for their product categories?", why: "Shapes how you configure BuyersDNA targeting" },
            { q: "Does Healthtrust have a formal vendor evaluation process for new tools?", why: "Determines the sales cycle length for Stage 2" },
            { q: "Who is Roger's specific contact at Healthtrust for business development?", why: "Identifies the right introduction to request" },
            { q: "Is Latda actively involved in the Healthtrust relationship or primarily the independent product side?", why: "Determines who to keep in the loop post-meeting" },
          ].map((item, i) => (
            <div key={i} className="rounded-xl p-3" style={{ background: P.card2 }}>
              <div className="text-xs font-semibold mb-1" style={{ color: P.white }}>{item.q}</div>
              <div className="text-xs" style={{ color: P.muted }}>Why it matters: {item.why}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Tab: Pricing & ROI ────────────────────────────────────────────────────────
function TabPricing() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-black mb-1" style={{ color: P.white }}>Pricing & ROI</h2>
        <p className="text-xs" style={{ color: P.muted }}>Two-tier pricing structure. Document commission agreement before any proposal goes out.</p>
      </div>

      {/* Deal value table */}
      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: P.border }}>
        <div className="grid grid-cols-3 gap-0 text-xs font-bold px-4 py-3" style={{ background: P.card2, color: P.muted }}>
          <span>Deal</span>
          <span className="text-center">Conservative</span>
          <span className="text-right">Upside</span>
        </div>
        {[
          { deal: "InterMed Direct (annual)", low: "$75,000", high: "$150,000", color: P.blue },
          { deal: "Healthtrust Partnership (annual)", low: "$250,000", high: "$500,000+", color: P.purple },
          { deal: "Total Year 1", low: "$325,000", high: "$650,000+", color: P.gold },
          { deal: "Commission to partner (25%)", low: "$81,250", high: "$162,500+", color: P.green },
        ].map((row, i) => (
          <div key={i} className="grid grid-cols-3 gap-0 px-4 py-3 border-t" style={{ borderColor: P.border, background: i % 2 === 0 ? P.card : P.card2 }}>
            <span className="text-xs font-semibold" style={{ color: P.white }}>{row.deal}</span>
            <span className="text-center text-sm font-bold" style={{ color: row.color }}>{row.low}</span>
            <span className="text-right text-sm font-bold" style={{ color: row.color }}>{row.high}</span>
          </div>
        ))}
      </div>

      {/* InterMed pricing breakdown */}
      <div className="rounded-2xl p-5 border" style={{ background: P.card, borderColor: P.border }}>
        <SectionLabel color={P.blue}>InterMed Pricing Breakdown</SectionLabel>
        <div className="space-y-2">
          {[
            { item: "BuyersDNA", desc: "Hospital intent data — 127 sources, weekly in-market hospital list", price: "Included" },
            { item: "ExactAudience", desc: "Decision-maker identification — supply chain directors, OR managers, CMOs", price: "Included" },
            { item: "SITEID on intermedtn.com", desc: "Anonymous visitor identification — real-time hospital visitor deanonymization", price: "Included" },
            { item: "Total package", desc: "Full stack — annual contract", price: "$75K–$150K/yr" },
          ].map((item, i) => (
            <div key={i} className="flex items-start justify-between rounded-xl p-3 gap-3" style={{ background: P.card2 }}>
              <div className="flex-1">
                <div className="text-xs font-bold" style={{ color: P.white }}>{item.item}</div>
                <div className="text-xs mt-0.5" style={{ color: P.muted }}>{item.desc}</div>
              </div>
              <div className="text-xs font-bold shrink-0" style={{ color: P.blue }}>{item.price}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Healthtrust pricing */}
      <div className="rounded-2xl p-5 border" style={{ background: `${P.purple}08`, borderColor: `${P.purple}30` }}>
        <SectionLabel color={P.purple}>Healthtrust Platform Partnership Model</SectionLabel>
        <div className="space-y-3">
          <div className="rounded-xl p-3" style={{ background: P.card2 }}>
            <div className="text-xs font-bold mb-1" style={{ color: P.purple }}>Structure</div>
            <div className="text-xs leading-relaxed" style={{ color: P.muted }}>Platform partnership — NOT a per-seat license. Price scales with their network as they add hospitals. Performance component tied to new member conversions.</div>
          </div>
          <div className="rounded-xl p-3" style={{ background: P.card2 }}>
            <div className="text-xs font-bold mb-1" style={{ color: P.gold }}>ROI Justification</div>
            <div className="text-xs leading-relaxed" style={{ color: P.muted }}>A single new hospital member is worth millions to Healthtrust in contract volume. The $250K–$500K price is trivial compared to the revenue from even 5 new member hospitals. If they recommend ExactAudience to their 1,900 members, the long-term value is not measurable in a single year.</div>
          </div>
          <div className="rounded-xl p-3" style={{ background: P.card2 }}>
            <div className="text-xs font-bold mb-1" style={{ color: P.green }}>Suggested Anchor</div>
            <div className="text-xs leading-relaxed" style={{ color: P.muted }}>$250,000–$500,000/year base + performance bonus per new hospital member converted. Start the conversation at $350K and negotiate from there.</div>
          </div>
        </div>
      </div>

      {/* Commission warning */}
      <div className="rounded-xl p-4 border" style={{ background: `${P.red}08`, borderColor: `${P.red}30` }}>
        <div className="flex items-start gap-3">
          <div className="text-lg shrink-0">⚠️</div>
          <div>
            <div className="text-sm font-bold mb-1" style={{ color: P.red }}>Commission Agreement — Do This First</div>
            <div className="text-xs leading-relaxed" style={{ color: P.muted }}>
              Your referral partner gets 25% on BOTH the InterMed direct deal AND any Healthtrust deal that flows from this introduction. 
              Document it before the first call so there is no ambiguity later. Do not discuss the 25% commission in the room with Roger and Latda — 
              but make sure your internal paperwork is clean before any proposal goes out.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function InterMedDashboard() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");

  const activeTabData = TABS.find(t => t.id === activeTab)!;

  return (
    <div className="min-h-screen" style={{ background: P.bg, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      {/* Header */}
      <div className="sticky top-0 z-50 border-b" style={{ background: `${P.bg}f0`, backdropFilter: 'blur(12px)', borderColor: P.border }}>
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-3 h-14">
            <button onClick={() => navigate('/campaigns')} className="text-xs flex items-center gap-1.5 transition-opacity hover:opacity-70" style={{ color: P.muted }}>
              ← Back to Campaigns
            </button>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="max-w-4xl mx-auto px-4 pt-6 pb-4">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">🏥</span>
              <h1 className="text-2xl font-black" style={{ color: P.blue, letterSpacing: '-0.03em' }}>InterMed / Healthtrust</h1>
            </div>
            <div className="text-xs mb-1" style={{ color: P.muted }}>Healthcare / Medical Device Distribution · Brentwood, TN</div>
            <div className="text-xs font-semibold" style={{ color: P.gold }}>InterMed Direct + Healthtrust Network Growth 2026</div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="w-2 h-2 rounded-full" style={{ background: P.green, boxShadow: `0 0 6px ${P.green}` }} />
            <span className="text-xs font-bold tracking-widest" style={{ color: P.green }}>PITCH READY</span>
          </div>
        </div>

        {/* Top KPIs */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 mb-5">
          <StatCard label="Deal Value" value="$325K–$650K" sub="Year 1 total" color={P.gold} />
          <StatCard label="Healthtrust" value="1,900+" sub="Member hospitals" color={P.purple} />
          <StatCard label="InterMed Revenue" value="$650M+" sub="Medical device distribution" color={P.blue} />
          <StatCard label="Commission" value="25%" sub="Both deals — document now" color={P.green} />
        </div>

        {/* Tab nav */}
        <div className="flex gap-1 overflow-x-auto pb-1 -mx-1 px-1" style={{ scrollbarWidth: 'none' }}>
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 shrink-0"
              style={{
                background: activeTab === tab.id ? P.blue : P.card,
                color: activeTab === tab.id ? '#07071a' : P.muted,
                border: `1px solid ${activeTab === tab.id ? P.blue : P.border}`,
              }}>
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
        <AnimatePresence mode="wait">
          <motion.div key={activeTab}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}>
            {activeTab === 'overview'    && <TabOverview />}
            {activeTab === 'players'     && <TabPlayers />}
            {activeTab === 'intermend'   && <TabInterMed />}
            {activeTab === 'healthtrust' && <TabHealthtrust />}
            {activeTab === 'meeting'     && <TabMeeting />}
            {activeTab === 'pricing'     && <TabPricing />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
