/**
 * KeatingPitchDashboard.tsx
 * Exact Audience pitch dashboard for Chip Keating — 2026 Oklahoma Governor's Race
 * Design: Dark political intelligence — deep navy, green accent (Keating brand)
 * Slant: Outsider lane consolidation — law enforcement, anti-establishment, debate breakout
 */

import { useState } from "react";
import { useLocation } from "wouter";
import { GOV_POLLING, GOV_TIMELINE } from "@/lib/govData";
import VoterIntelligence from "@/components/VoterIntelligence";
import VoterMigration from "@/components/VoterMigration";

const CANDIDATE = {
  name: "Chip Keating",
  title: "Law Enforcement Executive & Son of Gov. Frank Keating",
  color: "#d97706",
  tagline: "Real Experience. Real Law Enforcement. Real Outsider.",
  polling: 21.4,
  cashOnHand: "~$1.34M",
  totalRaised: "$3.44M",
  selfLoaned: "$2.0M",
  status: "Competitive — Outsider Lane Consolidation Required",
  trumpEndorsed: false,
  primaryProjection: "22–26%",
  runoffProjection: "Needs debate breakout to qualify",
  strengths: [
    "Best natural debater in the field — strong on-stage performer",
    "Unique law enforcement lane — Secretary of Public Safety under Gov. Stitt",
    "Frank Keating name recognition — legacy brand in Oklahoma Republican politics",
    "Authentic outsider credibility — not a career politician",
    "Strong grassroots activist and conservative base",
    "Law enforcement endorsements and public safety community support",
  ],
  vulnerabilities: [
    "Stuck in low 20s — ceiling appears limited without a breakout moment",
    "Trump endorsement of Mazzei threatens the outsider lane he owns",
    "Lacks broad campaign infrastructure compared to Drummond and McCall",
    "No clear path to absorb other candidates' voters without a catalyst",
    "Final debate performance is make-or-break for runoff qualification",
  ],
  pathToRunoff: [
    { step: "Hold activist conservative base", target: "21–22%", note: "Law enforcement community + grassroots conservatives" },
    { step: "Absorb Merrick voters (7.2%)", target: "+3–4%", note: "Outsider lane consolidation — most natural migration" },
    { step: "Debate breakout moment", target: "+2–3%", note: "Required — must move numbers in final 9 days" },
    { step: "Projected primary finish", target: "22–26%", note: "Runoff qualification requires strong debate performance" },
  ],
  pathToRunoffWin: [
    { step: "Keating primary base", target: "88,000 votes", note: "22% of 400K turnout" },
    { step: "Absorb Merrick outsider voters (65%)", target: "+18,720", note: "Outsider lane fully consolidated" },
    { step: "Peel Mazzei soft supporters (6%)", target: "+15,600", note: "Voters who like outsiders but not Trump-aligned" },
    { step: "Minor candidate voters (45%)", target: "+15,750", note: "Conservative activists from smaller campaigns" },
    { step: "Projected runoff total", target: "138,070 votes (34.5%)", note: "Competitive — needs Mazzei to underperform" },
  ],
  needToPersuade: {
    primary: "3,954 voters from a pool of 80,850 persuadable Republicans statewide",
    runoff: "~34,000 Merrick + soft Mazzei voters to migrate",
    keySegments: [
      "Jake Merrick voters (7.2%) — outsider conservatives looking for a home",
      "Mazzei soft supporters who like outsiders but are skeptical of Trump alignment",
      "Law enforcement community members who are registered Republicans",
      "Conservative activists who want a candidate with real executive experience",
    ],
  },
  eaStrategy: {
    phase1: {
      label: "Phase 1 — Outsider Consolidation (Now → June 16)",
      budget: "$140,000–$170,000",
      objective: "Consolidate the entire outsider lane and create a debate breakout moment",
      tactics: [
        { tactic: "Merrick Voter Identification & Targeting", detail: "Use behavioral data to identify the ~29,000 Merrick voters by name on the voter file — model which 65% are persuadable to Keating — deliver law enforcement and outsider messaging to those exact voters before June 16" },
        { tactic: "Mazzei Soft-Supporter Targeting", detail: "Identify registered Republicans who have engaged with Mazzei content but show skepticism signals — voters who like outsiders but are uncomfortable with the Trump-endorsement dynamic are Keating's best secondary target" },
        { tactic: "Law Enforcement Community Activation", detail: "Target households of registered Republican law enforcement professionals, first responders, and public safety workers — Keating's Secretary of Public Safety background is uniquely compelling to this segment" },
        { tactic: "Debate Amplification", detail: "Pre-identify the ~50,000 most persuadable undecided voters — deploy targeted digital and CTV immediately following the final debate to amplify Keating's performance to the exact voters who haven't committed" },
      ],
      expectedResult: "Absorb 65% of Merrick voters + peel 5–6% from Mazzei soft supporters — advance to runoff at 22–26%",
    },
    phase2: {
      label: "Phase 2 — Runoff Breakout (June 17 → August 25)",
      budget: "$330,000–$465,000",
      objective: "Consolidate the full outsider lane and position Keating as the only authentic alternative to Mazzei",
      tactics: [
        { tactic: "Full Outsider Lane Consolidation", detail: "In a Mazzei vs. Keating runoff scenario, identify every voter who chose any non-establishment candidate in the primary — these voters are the natural Keating coalition and must be reached in the first 2 weeks" },
        { tactic: "Anti-Establishment Contrast Messaging", detail: "Identify voters who showed negative behavioral signals toward Drummond and McCall (establishment candidates) — these voters need to see Keating as the authentic outsider alternative to Mazzei" },
        { tactic: "Law Enforcement Voter Surge", detail: "Activate the full law enforcement community network statewide — target registered Republican households with law enforcement connections across all 77 Oklahoma counties" },
        { tactic: "Behavioral Movement Dashboard", detail: "Real-time tracking of which voter segments are shifting toward Keating — weekly optimization to concentrate budget on highest-conversion segments" },
      ],
      expectedResult: "Consolidate outsider lane + law enforcement vote = competitive runoff position at 40–48%",
    },
  },
  competitiveAdvantage: "Keating owns the law enforcement lane and the authentic outsider lane — two segments that no other candidate can credibly claim. Exact Audience identifies every registered Republican in those segments by name and delivers Keating's message to them before Mazzei's Trump endorsement absorbs the entire anti-establishment vote.",
};

const TABS = ["Overview", "Path to Win", "EA Strategy", "Race Context", "Voter Intelligence", "Voter Migration"] as const;
type Tab = typeof TABS[number];

export default function KeatingPitchDashboard() {
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
        .k-tab { padding: 10px 20px; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 600; letter-spacing: 0.03em; transition: all 0.15s; border: 1px solid transparent; }
        .k-tab:hover { background: rgba(245,158,11,0.12); }
        .k-tab.active { background: rgba(245,158,11,0.18); border-color: rgba(245,158,11,0.4); color: #ffffff; }
        .k-card { background: ${cardBg}; border: 1px solid ${border}; border-radius: 12px; padding: 24px; }
        .k-card-accent { background: ${cardBg}; border: 1px solid rgba(245,158,11,0.3); border-radius: 12px; padding: 24px; }
        .step-row { display: flex; align-items: flex-start; gap: 16px; padding: 14px 0; border-bottom: 1px solid ${border}; }
        .step-row:last-child { border-bottom: none; }
        .step-num { width: 28px; height: 28px; border-radius: 50%; background: rgba(245,158,11,0.2); border: 1px solid rgba(245,158,11,0.4); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: #ffffff; flex-shrink: 0; margin-top: 2px; }
        .tactic-row { padding: 16px 0; border-bottom: 1px solid ${border}; }
        .tactic-row:last-child { border-bottom: none; }
        .badge { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; letter-spacing: 0.05em; }
        .poll-bar { height: 8px; border-radius: 4px; }
        @media (max-width: 768px) { .k-grid-2 { grid-template-columns: 1fr !important; } }
      `}</style>

      <div style={{ background: "linear-gradient(135deg, #130a28 0%, #1a0840 100%)", borderBottom: `1px solid ${border}`, padding: "0 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 0", borderBottom: `1px solid ${border}` }}>
            <button onClick={() => navigate("/campaigns")} style={{ background: "none", border: "none", color: textSecondary, cursor: "pointer", fontSize: 13 }}>← Campaign Directory</button>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <span style={{ fontSize: 11, color: textMuted, letterSpacing: "0.1em", textTransform: "uppercase" }}>Exact Audience</span>
              <span style={{ fontSize: 11, color: textMuted }}>•</span>
              <span style={{ fontSize: 11, color: textMuted }}>Confidential Pitch</span>
            </div>
          </div>
          <div style={{ padding: "32px 0 28px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 20, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 280 }}>
                <div style={{ display: "flex", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
                  <span className="badge" style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)", color: "#fbbf24" }}>LAW ENFORCEMENT</span>
                  <span className="badge" style={{ background: "rgba(14,159,110,0.1)", border: "1px solid rgba(245,158,11,0.25)", color: "#fbbf24" }}>AUTHENTIC OUTSIDER</span>
                  <span className="badge" style={{ background: "rgba(255,255,255,0.07)", border: `1px solid ${border}`, color: textMuted }}>KEATING LEGACY</span>
                </div>
                <h1 style={{ fontSize: 36, fontWeight: 800, margin: "0 0 6px", letterSpacing: "-0.02em" }}>Chip Keating</h1>
                <p style={{ fontSize: 16, color: textSecondary, margin: "0 0 4px" }}>{CANDIDATE.title}</p>
                <p style={{ fontSize: 14, color: accent, fontWeight: 600, margin: 0 }}>{CANDIDATE.tagline}</p>
              </div>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                {[
                  { label: "Current Polling", value: `${CANDIDATE.polling}%`, sub: "Projected: 22–26%" },
                  { label: "Primary Date", value: "June 16", sub: "9 days away" },
                  { label: "Runoff Date", value: "Aug 25", sub: "79 days if needed" },
                  { label: "Cash on Hand", value: CANDIDATE.cashOnHand, sub: "Grassroots funded" },
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
          <div style={{ display: "flex", gap: 4 }}>
            {TABS.map(t => (
              <button key={t} className={`k-tab${tab === t ? " active" : ""}`} onClick={() => setTab(t)} style={{ color: tab === t ? "#fbbf24" : textSecondary }}>{t}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>

        {tab === "Overview" && (
          <div>
            <div style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.25)", borderRadius: 10, padding: "14px 20px", marginBottom: 24, display: "flex", gap: 12 }}>
              <span style={{ fontSize: 18 }}>⚡</span>
              <div>
                <span style={{ fontWeight: 700, color: "#fbbf24", fontSize: 13 }}>Critical Window: </span>
                <span style={{ color: textSecondary, fontSize: 13 }}>Keating is the best natural debater in the field. The final debate before June 16 is the make-or-break moment. Exact Audience amplifies that performance to the right voters immediately after — before opponents can respond.</span>
              </div>
            </div>
            <div className="k-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
              <div className="k-card-accent">
                <h3 style={{ fontSize: 14, fontWeight: 700, color: accent, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 16px" }}>Campaign Strengths</h3>
                {CANDIDATE.strengths.map((s, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                    <span style={{ color: "#fbbf24", fontSize: 14, flexShrink: 0 }}>✓</span>
                    <span style={{ fontSize: 14, color: textSecondary, lineHeight: 1.5 }}>{s}</span>
                  </div>
                ))}
              </div>
              <div className="k-card">
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#fbbf24", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 16px" }}>Vulnerabilities to Address</h3>
                {CANDIDATE.vulnerabilities.map((v, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                    <span style={{ color: "#fbbf24", fontSize: 14, flexShrink: 0 }}>!</span>
                    <span style={{ fontSize: 14, color: textSecondary, lineHeight: 1.5 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="k-card" style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: textSecondary, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 20px" }}>Current Race Polling — NonDoc/Independent Survey, May 26</h3>
              {GOV_POLLING.filter(p => p.pct >= 5).map(p => (
                <div key={p.candidate} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: 14, fontWeight: p.candidate === "Chip Keating" ? 700 : 400, color: p.candidate === "Chip Keating" ? accent : textSecondary }}>
                      {p.candidate}{p.trump ? " ★" : ""}
                    </span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: p.candidate === "Chip Keating" ? accent : textPrimary }}>{p.pct}%</span>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 4, overflow: "hidden" }}>
                    <div className="poll-bar" style={{ width: `${p.pct * 3}%`, background: p.candidate === "Chip Keating" ? accent : p.color }} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.25)", borderRadius: 12, padding: 24 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: accent, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 12px" }}>Why Exact Audience for Keating</h3>
              <p style={{ fontSize: 15, color: textPrimary, lineHeight: 1.7, margin: 0 }}>{CANDIDATE.competitiveAdvantage}</p>
            </div>
          </div>
        )}

        {tab === "Path to Win" && (
          <div>
            <div className="k-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
              <div className="k-card-accent">
                <h3 style={{ fontSize: 14, fontWeight: 700, color: accent, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 4px" }}>Phase 1: Primary Path</h3>
                <p style={{ fontSize: 12, color: textMuted, margin: "0 0 20px" }}>June 16, 2026 — Qualify for Runoff</p>
                {CANDIDATE.pathToRunoff.map((s, i) => (
                  <div key={i} className="step-row">
                    <div className="step-num">{i + 1}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: textPrimary }}>{s.step}</span>
                        <span style={{ fontSize: 14, fontWeight: 800, color: accent, whiteSpace: "nowrap" }}>{s.target}</span>
                      </div>
                      <p style={{ fontSize: 12, color: textMuted, margin: "4px 0 0" }}>{s.note}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="k-card">
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#fbbf24", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 4px" }}>Phase 2: Runoff Path</h3>
                <p style={{ fontSize: 12, color: textMuted, margin: "0 0 20px" }}>August 25, 2026 — Win the Governorship</p>
                {CANDIDATE.pathToRunoffWin.map((s, i) => (
                  <div key={i} className="step-row">
                    <div className="step-num" style={{ background: "rgba(251,191,36,0.1)", borderColor: "rgba(52,211,153,0.3)", color: "#fbbf24" }}>{i + 1}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: textPrimary }}>{s.step}</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#fbbf24", whiteSpace: "nowrap" }}>{s.target}</span>
                      </div>
                      <p style={{ fontSize: 12, color: textMuted, margin: "4px 0 0" }}>{s.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="k-card">
              <h3 style={{ fontSize: 14, fontWeight: 700, color: textSecondary, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 16px" }}>Need To Persuade</h3>
              <div className="k-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 12, color: textMuted, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>Primary Universe</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: accent }}>{CANDIDATE.needToPersuade.primary}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: textMuted, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>Key Migration Target</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "#fbbf24" }}>{CANDIDATE.needToPersuade.runoff}</div>
                </div>
              </div>
              {CANDIDATE.needToPersuade.keySegments.map((seg, i) => (
                <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8 }}>
                  <span style={{ color: accent, fontSize: 14, flexShrink: 0 }}>→</span>
                  <span style={{ fontSize: 14, color: textSecondary }}>{seg}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "EA Strategy" && (
          <div>
            <div style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${border}`, borderRadius: 12, padding: 24, marginBottom: 24 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: textSecondary, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 16px" }}>Why Exact Audience Is Different</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
                {[
                  { label: "Traditional Agency", items: ["Platform-defined audiences", "Cookie-based anonymous targeting", "No voter file connection", "CTR and CPM metrics only"], accent: false },
                  { label: "Exact Audience", items: ["Named voter file targeting", "Individual-level identity resolution", "Specific registered Republican by name", "Voters behaviorally moved — tracked back to file"], accent: true },
                ].map(col => (
                  <div key={col.label} style={{ background: col.accent ? "rgba(245,158,11,0.06)" : "rgba(255,255,255,0.04)", border: col.accent ? "1px solid rgba(245,158,11,0.25)" : `1px solid ${border}`, borderRadius: 10, padding: 16 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: col.accent ? accent : textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>{col.label}</div>
                    {col.items.map((item, i) => (
                      <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                        <span style={{ color: col.accent ? "#fbbf24" : "#f59e0b", fontSize: 13, flexShrink: 0 }}>{col.accent ? "✓" : "✗"}</span>
                        <span style={{ fontSize: 13, color: col.accent ? textPrimary : textMuted }}>{item}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 16, padding: "12px 16px", background: "rgba(245,158,11,0.08)", borderRadius: 8, borderLeft: `3px solid ${accent}` }}>
                <p style={{ margin: 0, fontSize: 14, color: textPrimary, fontStyle: "italic" }}>
                  "Your current agency buys ads that reach people <em>like</em> your voters. Exact Audience buys ads that reach <em>your actual voters</em> — by name, on the voter file — and tells you which ones moved."
                </p>
              </div>
            </div>
            {[CANDIDATE.eaStrategy.phase1, CANDIDATE.eaStrategy.phase2].map((phase, pi) => (
              <div key={pi} className={pi === 0 ? "k-card-accent" : "k-card"} style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: pi === 0 ? accent : "#fbbf24", margin: "0 0 4px" }}>{phase.label}</h3>
                    <p style={{ fontSize: 13, color: textMuted, margin: 0 }}>{phase.objective}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: pi === 0 ? accent : "#fbbf24" }}>{phase.budget}</div>
                    <div style={{ fontSize: 11, color: textMuted, textTransform: "uppercase", letterSpacing: "0.06em" }}>Recommended Budget</div>
                  </div>
                </div>
                {phase.tactics.map((t, i) => (
                  <div key={i} className="tactic-row">
                    <div style={{ fontSize: 14, fontWeight: 700, color: textPrimary, marginBottom: 4 }}>{t.tactic}</div>
                    <div style={{ fontSize: 13, color: textSecondary, lineHeight: 1.6 }}>{t.detail}</div>
                  </div>
                ))}
                <div style={{ marginTop: 16, padding: "10px 14px", background: "rgba(251,191,36,0.08)", borderRadius: 8, border: "1px solid rgba(251,191,36,0.2)" }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#fbbf24" }}>Expected Result: </span>
                  <span style={{ fontSize: 13, color: textSecondary }}>{phase.expectedResult}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "Race Context" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 24 }}>
              {[
                { label: "Registered Republicans", value: "900,000" },
                { label: "Expected Primary Turnout", value: "400,000" },
                { label: "Win Threshold (Primary)", value: "200,001" },
                { label: "Expected Runoff Turnout", value: "280,000" },
                { label: "Win Threshold (Runoff)", value: "140,001" },
                { label: "Merrick Voters Available", value: "~29,000" },
              ].map(s => (
                <div key={s.label} className="k-card" style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: accent }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: textMuted, textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div className="k-card">
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
                </div>
              ))}
            </div>
          </div>

        )}
        {tab === "Voter Intelligence" && (
          <div style={{ padding: "0 4px" }}>
            <VoterIntelligence
              candidateName="Keating"
              accent="#f59e0b"
              mode="primary"
            />
          </div>
        )}
        {tab === "Voter Migration" && (
          <div style={{ padding: "0 4px" }}>
            <VoterMigration
              candidateName="Keating"
              mode="primary"
            />
          </div>
        )}
      </div>
    </div>
  );
}
