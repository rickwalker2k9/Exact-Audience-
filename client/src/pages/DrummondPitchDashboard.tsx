/**
 * DrummondPitchDashboard.tsx
 * Exact Audience pitch dashboard for Gentner Drummond — 2026 Oklahoma Governor's Race
 * Design: Dark political intelligence — deep navy, blue accent (Drummond brand)
 * Slant: Institutional consolidation — anti-Mazzei establishment vote
 */

import { useState } from "react";
import { useLocation } from "wouter";
import { GOV_POLLING, GOV_TIMELINE } from "@/lib/govData";
import VoterIntelligence from "@/components/VoterIntelligence";
import VoterMigration from "@/components/VoterMigration";

const CANDIDATE = {
  name: "Gentner Drummond",
  title: "Oklahoma Attorney General",
  color: "#f97316",
  colorLight: "#fff7ed",
  tagline: "Proven. Trusted. Ready.",
  polling: 21.7,
  cashOnHand: "~$1.55M",
  totalRaised: "$4.35M",
  selfLoaned: "$0",
  status: "Likely Runoff Qualifier — Anti-Mazzei Consolidation Candidate",
  trumpEndorsed: false,
  primaryProjection: "22–26%",
  runoffProjection: "47–52% (if McCall voters consolidate)",
  strengths: [
    "Highest name recognition statewide — AG for 3+ years",
    "Only candidate with zero personal loans — pure grassroots credibility",
    "Natural consolidation candidate for all non-Mazzei voters in runoff",
    "Tribal community support — strong rural Oklahoma base",
    "Oklahoma Fraternal Order of Police endorsement",
    "Deep institutional donor network — most durable fundraising base",
  ],
  vulnerabilities: [
    "Club for Growth spending $4.3M in attack ads against him",
    "Polling flat since early 2026 — no momentum signal",
    "Trump endorsement of Mazzei creates headwind with base voters",
    "Must win majority of McCall voters to advance to runoff",
    "Perceived as establishment in an anti-establishment cycle",
  ],
  pathToRunoff: [
    { step: "Hold institutional base", target: "21–23%", note: "AG name ID + rural conservatives + tribal-friendly voters" },
    { step: "Absorb McCall soft supporters", target: "+2–3%", note: "Business community overlap — most natural migration" },
    { step: "Counter Club for Growth attacks", target: "Defend floor", note: "Attack ads are the primary threat to his primary finish" },
    { step: "Projected primary finish", target: "22–26%", note: "Advances to August 25 runoff as #2 qualifier" },
  ],
  pathToRunoffWin: [
    { step: "Drummond primary base", target: "88,000 votes", note: "22% of 400K turnout" },
    { step: "Absorb McCall voters (50–55%)", target: "+36,400", note: "Establishment overlap — most natural migration" },
    { step: "Absorb Keating voters (20–25%)", target: "+19,000", note: "Law enforcement conservatives lean toward AG" },
    { step: "Minor candidate voters (34%)", target: "+12,000", note: "Institutional voters from smaller candidates" },
    { step: "Projected runoff total", target: "155,400 votes (38.8%)", note: "Competitive but trails Mazzei — needs strong McCall absorption" },
  ],
  needToPersuade: {
    primary: "3,261 voters from a pool of 38,899 soft Keating + McCall supporters",
    runoff: "~106,000 McCall + Keating voters to migrate",
    keySegments: [
      "McCall business-community donors who need to convert to votes",
      "Keating law enforcement conservatives who respect the AG",
      "Tribal-friendly rural Republicans in eastern Oklahoma",
      "Late deciders who want experience over endorsement",
    ],
  },
  eaStrategy: {
    phase1: {
      label: "Phase 1 — Primary Defense & Consolidation (Now → June 16)",
      budget: "$140,000–$170,000",
      objective: "Defend institutional base from Club for Growth attacks and absorb McCall soft supporters",
      tactics: [
        { tactic: "Attack Ad Counter-Targeting", detail: "Identify the specific registered Republican voters who have been exposed to Club for Growth attack ads — deliver Drummond's credibility message to those exact voters before they solidify against him" },
        { tactic: "McCall Soft-Supporter Identification", detail: "Use behavioral data to identify McCall voters who have seen Drummond ads and are showing engagement signals — target them with consolidation messaging in the final 9 days" },
        { tactic: "CTV Household Targeting", detail: "Reach 260,000+ registered Republican households on streaming platforms matched to voter file — focus on rural eastern Oklahoma and tribal-adjacent communities where Drummond is strongest" },
        { tactic: "Credibility Amplification", detail: "Target undecided voters who have searched for AG record, law enforcement, or tribal policy — reinforce Drummond's proven track record vs. self-funded outsiders" },
      ],
      expectedResult: "Hold 21–23% base, absorb 2–3% from McCall — advance to runoff as #2 qualifier",
    },
    phase2: {
      label: "Phase 2 — Runoff Consolidation (June 17 → August 25)",
      budget: "$330,000–$465,000",
      objective: "Become the single consolidation candidate for every voter who didn't choose Mazzei",
      tactics: [
        { tactic: "McCall Voter Absorption (Priority)", detail: "Identify all ~70,000 McCall voters by name on the voter file — model which 50–55% are persuadable to Drummond — deliver targeted messaging in the first 2 weeks before Mazzei can reach them" },
        { tactic: "Keating Voter Outreach", detail: "Target the 20–25% of ~87,000 Keating voters who lean toward institutional candidates — AG record on law enforcement is the bridge message" },
        { tactic: "Anti-Mazzei Consolidation Messaging", detail: "Identify voters who engaged with Club for Growth attack content or showed negative behavioral signals toward Mazzei — these voters are looking for an alternative and Drummond is the only viable one" },
        { tactic: "Behavioral Tracking Dashboard", detail: "Real-time reporting on which McCall and Keating voter segments are shifting toward Drummond — weekly optimization of budget allocation across CTV, digital, and OTT" },
      ],
      expectedResult: "Absorb 50–55% of McCall voters + 20–25% of Keating voters = competitive runoff at 38–47%",
    },
  },
  competitiveAdvantage: "Drummond is the only candidate who can consolidate the entire non-Mazzei vote in a runoff. Every voter who rejected Mazzei, Keating, and McCall has one logical home. Exact Audience identifies those voters by name and reaches them before Mazzei can define the runoff narrative.",
};

const TABS = ["Overview", "Path to Win", "EA Strategy", "Race Context", "Voter Intelligence", "Voter Migration"] as const;
type Tab = typeof TABS[number];

export default function DrummondPitchDashboard() {
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
        .d-tab { padding: 10px 20px; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 600; letter-spacing: 0.03em; transition: all 0.15s; border: 1px solid transparent; }
        .d-tab:hover { background: rgba(249,115,22,0.12); }
        .d-tab.active { background: rgba(249,115,22,0.18); border-color: rgba(249,115,22,0.4); color: #ffffff; }
        .d-card { background: ${cardBg}; border: 1px solid ${border}; border-radius: 12px; padding: 24px; }
        .d-card-accent { background: ${cardBg}; border: 1px solid rgba(249,115,22,0.3); border-radius: 12px; padding: 24px; }
        .step-row { display: flex; align-items: flex-start; gap: 16px; padding: 14px 0; border-bottom: 1px solid ${border}; }
        .step-row:last-child { border-bottom: none; }
        .step-num { width: 28px; height: 28px; border-radius: 50%; background: rgba(249,115,22,0.2); border: 1px solid rgba(249,115,22,0.4); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: #ffffff; flex-shrink: 0; margin-top: 2px; }
        .tactic-row { padding: 16px 0; border-bottom: 1px solid ${border}; }
        .tactic-row:last-child { border-bottom: none; }
        .badge { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; letter-spacing: 0.05em; }
        .poll-bar { height: 8px; border-radius: 4px; }
        @media (max-width: 768px) { .d-grid-2 { grid-template-columns: 1fr !important; } }
      `}</style>

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #0d0d2b 0%, #0a1628 100%)", borderBottom: `1px solid ${border}`, padding: "0 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 0", borderBottom: `1px solid ${border}` }}>
            <button onClick={() => navigate("/campaigns")} style={{ background: "none", border: "none", color: textSecondary, cursor: "pointer", fontSize: 13 }}>
              ← Campaign Directory
            </button>
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
                  <span className="badge" style={{ background: "rgba(249,115,22,0.15)", border: "1px solid rgba(249,115,22,0.3)", color: "#fbbf24" }}>ATTORNEY GENERAL</span>
                  <span className="badge" style={{ background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.25)", color: "#fbbf24" }}>RUNOFF QUALIFIER</span>
                  <span className="badge" style={{ background: "rgba(255,255,255,0.07)", border: `1px solid ${border}`, color: textMuted }}>ZERO SELF-LOANS</span>
                </div>
                <h1 style={{ fontSize: 36, fontWeight: 800, margin: "0 0 6px", letterSpacing: "-0.02em" }}>Gentner Drummond</h1>
                <p style={{ fontSize: 16, color: textSecondary, margin: "0 0 4px" }}>{CANDIDATE.title}</p>
                <p style={{ fontSize: 14, color: accent, fontWeight: 600, margin: 0 }}>{CANDIDATE.tagline}</p>
              </div>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                {[
                  { label: "Current Polling", value: `${CANDIDATE.polling}%`, sub: "Projected: 22–26%" },
                  { label: "Primary Date", value: "June 16", sub: "9 days away" },
                  { label: "Runoff Date", value: "Aug 25", sub: "79 days if needed" },
                  { label: "Cash on Hand", value: CANDIDATE.cashOnHand, sub: "No personal loans" },
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
          <div style={{ display: "flex", gap: 4, paddingBottom: 0 }}>
            {(["Overview", "Path to Win", "EA Strategy", "Race Context", "Voter Intelligence", "Voter Migration"] as Tab[]).map(t => (
              <button key={t} className={`d-tab${tab === t ? " active" : ""}`} onClick={() => setTab(t)} style={{ color: tab === t ? "#fbbf24" : textSecondary }}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>

        {tab === "Overview" && (
          <div>
            <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)", borderRadius: 10, padding: "14px 20px", marginBottom: 24, display: "flex", gap: 12 }}>
              <span style={{ fontSize: 18 }}>⚠️</span>
              <div>
                <span style={{ fontWeight: 700, color: "#fbbf24", fontSize: 13 }}>Active Attack: </span>
                <span style={{ color: textSecondary, fontSize: 13 }}>Club for Growth PAC has spent <strong style={{ color: textPrimary }}>$4.3 million</strong> in attack ads targeting Drummond specifically. This is the primary threat to his primary finish and must be countered with precision counter-targeting.</span>
              </div>
            </div>
            <div className="d-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
              <div className="d-card-accent">
                <h3 style={{ fontSize: 14, fontWeight: 700, color: accent, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 16px" }}>Campaign Strengths</h3>
                {CANDIDATE.strengths.map((s, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                    <span style={{ color: "#fbbf24", fontSize: 14, flexShrink: 0 }}>✓</span>
                    <span style={{ fontSize: 14, color: textSecondary, lineHeight: 1.5 }}>{s}</span>
                  </div>
                ))}
              </div>
              <div className="d-card">
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#fbbf24", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 16px" }}>Vulnerabilities to Address</h3>
                {CANDIDATE.vulnerabilities.map((v, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                    <span style={{ color: "#fbbf24", fontSize: 14, flexShrink: 0 }}>!</span>
                    <span style={{ fontSize: 14, color: textSecondary, lineHeight: 1.5 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="d-card" style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: textSecondary, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 20px" }}>Current Race Polling — NonDoc/Independent Survey, May 26</h3>
              {GOV_POLLING.filter(p => p.pct >= 5).map(p => (
                <div key={p.candidate} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: 14, fontWeight: p.candidate === "Gentner Drummond" ? 700 : 400, color: p.candidate === "Gentner Drummond" ? accent : textSecondary }}>
                      {p.candidate}{p.trump ? " ★" : ""}
                    </span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: p.candidate === "Gentner Drummond" ? accent : textPrimary }}>{p.pct}%</span>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 4, overflow: "hidden" }}>
                    <div className="poll-bar" style={{ width: `${p.pct * 3}%`, background: p.candidate === "Gentner Drummond" ? accent : p.color }} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ background: "rgba(26,86,219,0.06)", border: "1px solid rgba(249,115,22,0.25)", borderRadius: 12, padding: 24 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: accent, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 12px" }}>Why Exact Audience for Drummond</h3>
              <p style={{ fontSize: 15, color: textPrimary, lineHeight: 1.7, margin: 0 }}>{CANDIDATE.competitiveAdvantage}</p>
            </div>
          </div>
        )}

        {tab === "Path to Win" && (
          <div>
            <div className="d-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
              <div className="d-card-accent">
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
              <div className="d-card">
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
            <div className="d-card" style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: textSecondary, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 16px" }}>Need To Persuade</h3>
              <div className="d-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 12, color: textMuted, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>Primary Universe</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: accent }}>{CANDIDATE.needToPersuade.primary}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: textMuted, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>Runoff Migration Target</div>
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
                  { label: "Traditional Agency", items: ["Platform-defined audiences", "Cookie-based anonymous targeting", "Demographic segments", "No voter file connection", "CTR and CPM metrics only"], accent: false },
                  { label: "Exact Audience", items: ["Named voter file targeting", "Individual-level identity resolution", "Specific registered Republican by name", "Voter suppression + persuasion model", "Voters behaviorally moved — tracked back to file"], accent: true },
                ].map(col => (
                  <div key={col.label} style={{ background: col.accent ? "rgba(26,86,219,0.06)" : "rgba(255,255,255,0.04)", border: col.accent ? "1px solid rgba(249,115,22,0.25)" : `1px solid ${border}`, borderRadius: 10, padding: 16 }}>
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
              <div style={{ marginTop: 16, padding: "12px 16px", background: "rgba(26,86,219,0.08)", borderRadius: 8, borderLeft: `3px solid ${accent}` }}>
                <p style={{ margin: 0, fontSize: 14, color: textPrimary, fontStyle: "italic" }}>
                  "Your current agency buys ads that reach people <em>like</em> your voters. Exact Audience buys ads that reach <em>your actual voters</em> — by name, on the voter file — and tells you which ones moved."
                </p>
              </div>
            </div>

            {[CANDIDATE.eaStrategy.phase1, CANDIDATE.eaStrategy.phase2].map((phase, pi) => (
              <div key={pi} className={pi === 0 ? "d-card-accent" : "d-card"} style={{ marginBottom: 20 }}>
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
                { label: "PAC Attack Spend vs. Drummond", value: "$4.3M" },
              ].map(s => (
                <div key={s.label} className="d-card" style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: accent }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: textMuted, textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div className="d-card">
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
              candidateName="Drummond"
              accent="#f59e0b"
              mode="primary"
            />
          </div>
        )}
        {tab === "Voter Migration" && (
          <div style={{ padding: "0 4px" }}>
            <VoterMigration
              candidateName="Drummond"
              mode="primary"
            />
          </div>
        )}
      </div>
    </div>
  );
}
