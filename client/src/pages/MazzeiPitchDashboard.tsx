/**
 * MazzeiPitchDashboard.tsx
 * Exact Audience pitch dashboard for Mike Mazzei — 2026 Oklahoma Governor's Race
 * Design: Dark political intelligence aesthetic — deep navy, amber/gold accent (Mazzei brand)
 * Runoff: August 25, 2026 | Primary: June 16, 2026
 */

import { useState } from "react";
import { useLocation } from "wouter";
import { GOV_RACE, GOV_POLLING, GOV_PATH_TO_WIN, GOV_TIMELINE } from "@/lib/govData";
import VoterIntelligence from "@/components/VoterIntelligence";
import VoterMigration from "@/components/VoterMigration";

// ── Mazzei-specific data ──────────────────────────────────────────────────────
const CANDIDATE = {
  name: "Mike Mazzei",
  title: "Former Oklahoma State Senator & Budget Secretary",
  color: "#f59e0b",
  colorLight: "#fff7ed",
  colorDark: "#9a3412",
  tagline: "Trump-Endorsed. Tax-Cutting. Outsider.",
  polling: 22.1,
  cashOnHand: "~$1.1M",
  totalRaised: "$4.39M",
  selfLoaned: "~$4.0M",
  status: "Primary Frontrunner (Post-Trump Endorsement)",
  trumpEndorsed: true,
  runoffLikelihood: "High — projected to advance",
  primaryProjection: "26–32%",
  runoffProjection: "47–52%",
  strengths: [
    "Only Trump-endorsed candidate — massive base activation",
    "Statewide name ID from Senate career and Budget Secretary role",
    "Dominant tax elimination message — income tax abolition resonates",
    "Tulsa base provides strong northeast Oklahoma ground game",
    "Outsider credibility despite legislative experience",
  ],
  vulnerabilities: [
    "Club for Growth PAC spending $4.3M in attack ads against him",
    "Most self-funded candidate — $4M in personal loans creates narrative",
    "Tribal community opposition to his policy positions",
    "Must consolidate Keating voters in runoff to win",
  ],
  pathToRunoff: [
    { step: "Hold Trump base", target: "22–24%", note: "Activated by endorsement — floor is secure" },
    { step: "Absorb Merrick voters (7.2%)", target: "+3–4%", note: "Outsider lane consolidation" },
    { step: "Activate late deciders", target: "+2–3%", note: "Trump endorsement news cycle drives final week" },
    { step: "Projected primary finish", target: "26–32%", note: "Top qualifier for August 25 runoff" },
  ],
  pathToRunoffWin: [
    { step: "Mazzei primary base", target: "104,000 votes", note: "26% of 400K turnout" },
    { step: "Absorb Keating voters (60–65%)", target: "+52,000", note: "Outsider lane migrates to Trump-endorsed candidate" },
    { step: "Absorb McCall voters (30–35%)", target: "+22,400", note: "Fiscal conservatives drawn to tax elimination" },
    { step: "Minor candidate voters (40%)", target: "+14,000", note: "Merrick bloc largely already aligned" },
    { step: "Projected runoff total", target: "192,400 votes (48.1%)", note: "Structural math favors Mazzei in runoff" },
  ],
  needToPersuade: {
    primary: "several hundred thousand registered Republicans",
    runoff: "~74,000 Keating + McCall voters to migrate",
    keySegments: [
      "Keating soft supporters who like outsiders — natural Mazzei voters",
      "McCall fiscal conservatives drawn to income tax elimination",
      "Late deciders activated by Trump endorsement news",
      "Tulsa metro Republicans not yet engaged",
    ],
  },
  eaStrategy: {
    phase1: {
      label: "Phase 1 — Primary Surge (Now → June 16)",
      budget: "$45,000–$65,000",
      objective: "Activate Trump-aligned voters and late deciders statewide",
      tactics: [
        { tactic: "CTV / OTT Targeting", detail: "Reach 280,000+ registered Republican households on streaming platforms — matched to voter file by name and address, not zip code" },
        { tactic: "Undecided Voter Suppression", detail: "Identify the ~35% of Republicans still undecided — deliver Mazzei's tax elimination message 6–8x before June 16" },
        { tactic: "Trump Endorsement Amplification", detail: "Behavioral targeting of voters who engaged with Trump content — reinforce the endorsement signal on CTV, digital, and social" },
        { tactic: "Opponent Soft-Supporter Targeting", detail: "Identify Drummond and McCall soft supporters (4–6 prior exposures to their ads) — deliver contrast messaging before they solidify" },
      ],
      expectedResult: "Push Mazzei from 22.1% base to 26–32% primary finish",
    },
    phase2: {
      label: "Phase 2 — Runoff Dominance (June 17 → August 25)",
      budget: "$85,000–$120,000",
      objective: "Absorb Keating and McCall voter blocs before Drummond can consolidate",
      tactics: [
        { tactic: "Keating Voter Identification", detail: "Use behavioral data to identify the ~87,000 Keating voters and model which 60–65% are persuadable to Mazzei — target them in the first 2 weeks of the runoff window" },
        { tactic: "McCall Fiscal Conservative Targeting", detail: "Identify McCall's ~70,000 voters who responded to tax/fiscal messaging — deliver Mazzei's income tax elimination message directly to their devices" },
        { tactic: "Voter File Suppression", detail: "Suppress already-committed Mazzei voters from ad spend — concentrate 100% of budget on persuadable and soft-opposition voters" },
        { tactic: "Behavioral Movement Tracking", detail: "Real-time reporting on which Keating/McCall voters are shifting behavioral signals toward Mazzei — adjust targeting weekly" },
      ],
      expectedResult: "Secure 60–65% Keating voter migration + 30–35% McCall migration = runoff win at 47–52%",
    },
  },
  competitiveAdvantage: "Mazzei is the only candidate who enters the runoff with structural math in his favor. The Trump endorsement activates the outsider lane. Exact Audience locks it in by identifying and reaching every Keating and McCall voter before Drummond can.",
};

const RACE_CONTEXT = {
  primaryDate: "June 16, 2026",
  runoffDate: "August 25, 2026",
  daysToRunoff: 79,
  expectedRunoffTurnout: 280000,
  runoffWinThreshold: 140001,
  pacSpending: "$7.1M in PAC ads in the race",
  clubForGrowthAttack: "$4.3M Club for Growth attack ads targeting Mazzei",
};

// ── Tabs ──────────────────────────────────────────────────────────────────────
const TABS = ["Overview", "Path to Win", "EA Strategy", "Race Context", "Voter Intelligence", "Voter Migration"] as const;
type Tab = typeof TABS[number];

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmt(n: number) { return n.toLocaleString(); }

export default function MazzeiPitchDashboard() {
  const [, navigate] = useLocation();
  const [tab, setTab] = useState<Tab>("Overview");

  const accent = CANDIDATE.color;
  const bg = "#0c0618";
  const cardBg = "#130a28";
  const border = "#2a1a4a";
  const textPrimary = "#ffffff";
  const textSecondary = "#ffffff";
  const textMuted = "#ffffff";

  return (
    <div style={{ minHeight: "100vh", background: bg, color: textPrimary, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <style>{`
        .pitch-tab { padding: 10px 20px; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 600; letter-spacing: 0.03em; transition: all 0.15s; border: 1px solid transparent; }
        .pitch-tab:hover { background: rgba(245,158,11,0.12); }
        .pitch-tab.active { background: rgba(245,158,11,0.18); border-color: rgba(245,158,11,0.4); color: #fb923c; }
        .pitch-card { background: ${cardBg}; border: 1px solid ${border}; border-radius: 12px; padding: 24px; }
        .pitch-card-accent { background: ${cardBg}; border: 1px solid rgba(245,158,11,0.3); border-radius: 12px; padding: 24px; }
        .step-row { display: flex; align-items: flex-start; gap: 16px; padding: 14px 0; border-bottom: 1px solid ${border}; }
        .step-row:last-child { border-bottom: none; }
        .step-num { width: 28px; height: 28px; border-radius: 50%; background: rgba(232,93,4,0.2); border: 1px solid rgba(245,158,11,0.4); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: #fb923c; flex-shrink: 0; margin-top: 2px; }
        .tactic-row { padding: 16px 0; border-bottom: 1px solid ${border}; }
        .tactic-row:last-child { border-bottom: none; }
        .badge { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; letter-spacing: 0.05em; }
        .poll-bar { height: 8px; border-radius: 4px; transition: width 0.6s ease; }
        @media (max-width: 768px) { .pitch-grid-2 { grid-template-columns: 1fr !important; } }
      `}</style>

      {/* ── Header ── */}
      <div style={{ background: "linear-gradient(135deg, #0d0d2b 0%, #1a0a00 100%)", borderBottom: `1px solid ${border}`, padding: "0 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          {/* Nav */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 0", borderBottom: `1px solid ${border}` }}>
            <button onClick={() => navigate("/campaigns")} style={{ background: "none", border: "none", color: textSecondary, cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
              ← Campaign Directory
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 11, color: textMuted, letterSpacing: "0.1em", textTransform: "uppercase" }}>Exact Audience</span>
              <span style={{ fontSize: 11, color: textMuted }}>•</span>
              <span style={{ fontSize: 11, color: textMuted }}>Confidential Pitch</span>
            </div>
          </div>

          {/* Hero */}
          <div style={{ padding: "32px 0 28px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 20, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 280 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                  <span className="badge" style={{ background: "rgba(232,93,4,0.15)", border: "1px solid rgba(245,158,11,0.3)", color: "#fb923c" }}>
                    ★ TRUMP ENDORSED
                  </span>
                  <span className="badge" style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", color: "#fbbf24" }}>
                    PRIMARY FRONTRUNNER
                  </span>
                </div>
                <h1 style={{ fontSize: 36, fontWeight: 800, margin: "0 0 6px", letterSpacing: "-0.02em" }}>
                  Mike Mazzei
                </h1>
                <p style={{ fontSize: 16, color: textSecondary, margin: "0 0 4px" }}>{CANDIDATE.title}</p>
                <p style={{ fontSize: 14, color: accent, fontWeight: 600, margin: 0 }}>{CANDIDATE.tagline}</p>
              </div>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                {[
                  { label: "Current Polling", value: `${CANDIDATE.polling}%`, sub: "Post-endorsement: 26–32%" },
                  { label: "Primary Date", value: "June 16", sub: "9 days away" },
                  { label: "Runoff Date", value: "Aug 25", sub: "79 days if needed" },
                  { label: "Cash on Hand", value: CANDIDATE.cashOnHand, sub: "Est. as of June 7" },
                ].map(kpi => (
                  <div key={kpi.label} style={{ background: "rgba(255,255,255,0.08)", border: `1px solid ${border}`, borderRadius: 10, padding: "14px 20px", minWidth: 120, textAlign: "center" }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: accent }}>{kpi.value}</div>
                    <div style={{ fontSize: 11, color: textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 2 }}>{kpi.label}</div>
                    <div style={{ fontSize: 11, color: textSecondary, marginTop: 3 }}>{kpi.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 4, paddingBottom: 0 }}>
            {TABS.map(t => (
              <button key={t} className={`pitch-tab${tab === t ? " active" : ""}`} onClick={() => setTab(t)} style={{ color: tab === t ? "#fb923c" : textSecondary }}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>

        {/* ── OVERVIEW ── */}
        {tab === "Overview" && (
          <div>
            {/* Alert: Club for Growth */}
            <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)", borderRadius: 10, padding: "14px 20px", marginBottom: 24, display: "flex", alignItems: "flex-start", gap: 12 }}>
              <span style={{ fontSize: 18 }}>⚠️</span>
              <div>
                <span style={{ fontWeight: 700, color: "#fbbf24", fontSize: 13 }}>Active Attack: </span>
                <span style={{ color: textSecondary, fontSize: 13 }}>Club for Growth PAC has spent <strong style={{ color: textPrimary }}>$4.3 million</strong> in attack ads targeting Mazzei. Total PAC spending in the race: $7.1M. This is the primary threat to his frontrunner position.</span>
              </div>
            </div>

            <div className="pitch-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
              {/* Strengths */}
              <div className="pitch-card-accent">
                <h3 style={{ fontSize: 14, fontWeight: 700, color: accent, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 16px" }}>Campaign Strengths</h3>
                {CANDIDATE.strengths.map((s, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                    <span style={{ color: "#fbbf24", fontSize: 14, marginTop: 1, flexShrink: 0 }}>✓</span>
                    <span style={{ fontSize: 14, color: textSecondary, lineHeight: 1.5 }}>{s}</span>
                  </div>
                ))}
              </div>

              {/* Vulnerabilities */}
              <div className="pitch-card">
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#fbbf24", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 16px" }}>Vulnerabilities to Address</h3>
                {CANDIDATE.vulnerabilities.map((v, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                    <span style={{ color: "#fbbf24", fontSize: 14, marginTop: 1, flexShrink: 0 }}>!</span>
                    <span style={{ fontSize: 14, color: textSecondary, lineHeight: 1.5 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Race Polling */}
            <div className="pitch-card" style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: textSecondary, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 20px" }}>Current Race Polling — NonDoc/Independent Survey, May 26</h3>
              {GOV_POLLING.filter(p => p.pct >= 5).map(p => (
                <div key={p.candidate} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: 14, fontWeight: p.candidate === "Mike Mazzei" ? 700 : 400, color: p.candidate === "Mike Mazzei" ? accent : textSecondary }}>
                      {p.candidate} {p.trump && "★"}
                    </span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: p.candidate === "Mike Mazzei" ? accent : textPrimary }}>{p.pct}%</span>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 4, overflow: "hidden" }}>
                    <div className="poll-bar" style={{ width: `${p.pct * 3}%`, background: p.candidate === "Mike Mazzei" ? accent : (p.color || "#ffffff") }} />
                  </div>
                </div>
              ))}
              <p style={{ fontSize: 12, color: textMuted, marginTop: 12, marginBottom: 0 }}>★ Trump-endorsed. Post-endorsement projections: Mazzei 26–32% | Drummond 22–26% | Keating 20–24% | McCall 16–20%</p>
            </div>

            {/* Competitive Advantage */}
            <div style={{ background: `linear-gradient(135deg, rgba(232,93,4,0.08) 0%, rgba(232,93,4,0.03) 100%)`, border: `1px solid rgba(245,158,11,0.25)`, borderRadius: 12, padding: 24 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: accent, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 12px" }}>Why Exact Audience for Mazzei</h3>
              <p style={{ fontSize: 15, color: textPrimary, lineHeight: 1.7, margin: 0 }}>{CANDIDATE.competitiveAdvantage}</p>
            </div>
          </div>
        )}

        {/* ── PATH TO WIN ── */}
        {tab === "Path to Win" && (
          <div>
            <div className="pitch-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
              {/* Primary Path */}
              <div className="pitch-card-accent">
                <h3 style={{ fontSize: 14, fontWeight: 700, color: accent, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 4px" }}>Phase 1: Primary Path</h3>
                <p style={{ fontSize: 12, color: textMuted, margin: "0 0 20px" }}>June 16, 2026 — Qualify for Runoff</p>
                {CANDIDATE.pathToRunoff.map((s, i) => (
                  <div key={i} className="step-row">
                    <div className="step-num">{i + 1}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: textPrimary }}>{s.step}</span>
                        <span style={{ fontSize: 14, fontWeight: 800, color: accent, whiteSpace: "nowrap" }}>{s.target}</span>
                      </div>
                      <p style={{ fontSize: 12, color: textMuted, margin: "4px 0 0" }}>{s.note}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Runoff Path */}
              <div className="pitch-card">
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#fbbf24", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 4px" }}>Phase 2: Runoff Path</h3>
                <p style={{ fontSize: 12, color: textMuted, margin: "0 0 20px" }}>August 25, 2026 — Win the Governorship</p>
                {CANDIDATE.pathToRunoffWin.map((s, i) => (
                  <div key={i} className="step-row">
                    <div className="step-num" style={{ background: "rgba(251,191,36,0.1)", borderColor: "rgba(52,211,153,0.3)", color: "#fbbf24" }}>{i + 1}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: textPrimary }}>{s.step}</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#fbbf24", whiteSpace: "nowrap" }}>{s.target}</span>
                      </div>
                      <p style={{ fontSize: 12, color: textMuted, margin: "4px 0 0" }}>{s.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Need to Persuade */}
            <div className="pitch-card" style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: textSecondary, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 16px" }}>Need To Persuade</h3>
              <div className="pitch-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <div style={{ fontSize: 12, color: textMuted, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>Primary Universe</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: accent }}>{CANDIDATE.needToPersuade.primary}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: textMuted, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>Runoff Migration Target</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "#fbbf24" }}>{CANDIDATE.needToPersuade.runoff}</div>
                </div>
              </div>
              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: 12, color: textMuted, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>Key Voter Segments</div>
                {CANDIDATE.needToPersuade.keySegments.map((seg, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8 }}>
                    <span style={{ color: accent, fontSize: 14, flexShrink: 0 }}>→</span>
                    <span style={{ fontSize: 14, color: textSecondary }}>{seg}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Win Math */}
            <div style={{ background: `linear-gradient(135deg, rgba(52,211,153,0.06) 0%, rgba(52,211,153,0.02) 100%)`, border: "1px solid rgba(251,191,36,0.2)", borderRadius: 12, padding: 24 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#fbbf24", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 16px" }}>Runoff Win Math</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16 }}>
                {[
                  { label: "Expected Runoff Turnout", value: "280,000" },
                  { label: "Win Threshold", value: "140,001" },
                  { label: "Mazzei Projected Total", value: "192,400" },
                  { label: "Projected Win Margin", value: "+52,399" },
                  { label: "Projected Vote Share", value: "48.1%" },
                  { label: "Structural Advantage", value: "Keating voters" },
                ].map(m => (
                  <div key={m.label} style={{ textAlign: "center", padding: "12px 8px", background: "rgba(52,211,153,0.05)", borderRadius: 8, border: "1px solid rgba(251,191,36,0.1)" }}>
                    <div style={{ fontSize: 20, fontWeight: 800, color: "#fbbf24" }}>{m.value}</div>
                    <div style={{ fontSize: 11, color: textMuted, marginTop: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>{m.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── EA STRATEGY ── */}
        {tab === "EA Strategy" && (
          <div>
            {/* What Makes EA Different */}
            <div style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${border}`, borderRadius: 12, padding: 24, marginBottom: 24 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: textSecondary, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 16px" }}>Why Exact Audience Is Different</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
                {[
                  { label: "Traditional Agency", items: ["Platform-defined audiences", "Cookie-based anonymous targeting", "Demographic segments", "Impressions to 'target demo'", "No voter file connection", "CTR and CPM metrics only"] },
                  { label: "Exact Audience", items: ["Named voter file targeting", "Individual-level identity resolution", "Specific registered Republican by name", "Confirmed delivery to voter file match", "Voter suppression + persuasion model", "Voters behaviorally moved — tracked back to file"], accent: true },
                ].map(col => (
                  <div key={col.label} style={{ background: col.accent ? "rgba(232,93,4,0.06)" : "rgba(255,255,255,0.04)", border: col.accent ? "1px solid rgba(245,158,11,0.25)" : `1px solid ${border}`, borderRadius: 10, padding: 16 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: col.accent ? accent : textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>{col.label}</div>
                    {col.items.map((item, i) => (
                      <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                        <span style={{ color: col.accent ? "#fbbf24" : "#f59e0b", fontSize: 13, flexShrink: 0, marginTop: 1 }}>{col.accent ? "✓" : "✗"}</span>
                        <span style={{ fontSize: 13, color: col.accent ? textPrimary : textMuted }}>{item}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 16, padding: "12px 16px", background: "rgba(232,93,4,0.08)", borderRadius: 8, borderLeft: `3px solid ${accent}` }}>
                <p style={{ margin: 0, fontSize: 14, color: textPrimary, fontStyle: "italic" }}>
                  "Your current agency buys ads that reach people <em>like</em> your voters. Exact Audience buys ads that reach <em>your actual voters</em> — by name, on the voter file — and tells you which ones moved."
                </p>
              </div>
            </div>

            {/* Phase 1 */}
            <div className="pitch-card-accent" style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: accent, margin: "0 0 4px" }}>{CANDIDATE.eaStrategy.phase1.label}</h3>
                  <p style={{ fontSize: 13, color: textMuted, margin: 0 }}>{CANDIDATE.eaStrategy.phase1.objective}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: accent }}>{CANDIDATE.eaStrategy.phase1.budget}</div>
                  <div style={{ fontSize: 11, color: textMuted, textTransform: "uppercase", letterSpacing: "0.06em" }}>Recommended Budget</div>
                </div>
              </div>
              {CANDIDATE.eaStrategy.phase1.tactics.map((t, i) => (
                <div key={i} className="tactic-row">
                  <div style={{ fontSize: 14, fontWeight: 700, color: textPrimary, marginBottom: 4 }}>{t.tactic}</div>
                  <div style={{ fontSize: 13, color: textSecondary, lineHeight: 1.6 }}>{t.detail}</div>
                </div>
              ))}
              <div style={{ marginTop: 16, padding: "10px 14px", background: "rgba(251,191,36,0.08)", borderRadius: 8, border: "1px solid rgba(251,191,36,0.2)" }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#fbbf24" }}>Expected Result: </span>
                <span style={{ fontSize: 13, color: textSecondary }}>{CANDIDATE.eaStrategy.phase1.expectedResult}</span>
              </div>
            </div>

            {/* Phase 2 */}
            <div className="pitch-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: "#fbbf24", margin: "0 0 4px" }}>{CANDIDATE.eaStrategy.phase2.label}</h3>
                  <p style={{ fontSize: 13, color: textMuted, margin: 0 }}>{CANDIDATE.eaStrategy.phase2.objective}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#fbbf24" }}>{CANDIDATE.eaStrategy.phase2.budget}</div>
                  <div style={{ fontSize: 11, color: textMuted, textTransform: "uppercase", letterSpacing: "0.06em" }}>Recommended Budget</div>
                </div>
              </div>
              {CANDIDATE.eaStrategy.phase2.tactics.map((t, i) => (
                <div key={i} className="tactic-row">
                  <div style={{ fontSize: 14, fontWeight: 700, color: textPrimary, marginBottom: 4 }}>{t.tactic}</div>
                  <div style={{ fontSize: 13, color: textSecondary, lineHeight: 1.6 }}>{t.detail}</div>
                </div>
              ))}
              <div style={{ marginTop: 16, padding: "10px 14px", background: "rgba(251,191,36,0.08)", borderRadius: 8, border: "1px solid rgba(251,191,36,0.2)" }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#fbbf24" }}>Expected Result: </span>
                <span style={{ fontSize: 13, color: textSecondary }}>{CANDIDATE.eaStrategy.phase2.expectedResult}</span>
              </div>
            </div>
          </div>
        )}

        {/* ── RACE CONTEXT ── */}
        {tab === "Race Context" && (
          <div>
            {/* Key Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 24 }}>
              {[
                { label: "Registered Republicans", value: "900,000" },
                { label: "Expected Primary Turnout", value: "400,000" },
                { label: "Win Threshold (Primary)", value: "200,001" },
                { label: "Expected Runoff Turnout", value: "280,000" },
                { label: "Win Threshold (Runoff)", value: "140,001" },
                { label: "Total PAC Spending", value: "$7.1M" },
              ].map(s => (
                <div key={s.label} className="pitch-card" style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: accent }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: textMuted, textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Timeline */}
            <div className="pitch-card">
              <h3 style={{ fontSize: 14, fontWeight: 700, color: textSecondary, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 20px" }}>Race Timeline</h3>
              {GOV_TIMELINE.map((ev, i) => (
                <div key={i} style={{ display: "flex", gap: 16, paddingBottom: 16, marginBottom: 16, borderBottom: i < GOV_TIMELINE.length - 1 ? `1px solid ${border}` : "none" }}>
                  <div style={{ width: 90, flexShrink: 0 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: accent }}>{ev.date.split(",")[0]}</div>
                    <div style={{ fontSize: 10, color: textMuted }}>{ev.date.split(",")[1]?.trim()}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: textPrimary, marginBottom: 4 }}>{ev.event}</div>
                    <div style={{ fontSize: 13, color: textSecondary, lineHeight: 1.5 }}>{ev.impact}</div>
                  </div>
                  <div>
                    <span className="badge" style={{
                      background: ev.type === "election" ? "rgba(245,158,11,0.12)" : ev.type === "endorsement" ? "rgba(251,191,36,0.1)" : "rgba(255,255,255,0.07)",
                      border: `1px solid ${ev.type === "election" ? "rgba(245,158,11,0.3)" : ev.type === "endorsement" ? "rgba(52,211,153,0.25)" : border}`,
                      color: ev.type === "election" ? accent : ev.type === "endorsement" ? "#fbbf24" : textMuted,
                      textTransform: "uppercase",
                    }}>
                      {ev.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        )}
        {tab === "Voter Intelligence" && (
          <div style={{ padding: "0 4px" }}>
            <VoterIntelligence
              candidateName="Mazzei"
              accent="#f59e0b"
              mode="runoff"
            />
          </div>
        )}
        {tab === "Voter Migration" && (
          <div style={{ padding: "0 4px" }}>
            <VoterMigration
              candidateName="Mazzei"
              mode="runoff"
            />
          </div>
        )}
      </div>
    </div>
  );
}
