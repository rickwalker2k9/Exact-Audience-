/**
 * McCallPitchDashboard.tsx
 * Exact Audience pitch dashboard for Charles McCall — 2026 Oklahoma Governor's Race
 * Design: Dark political intelligence — deep navy, purple accent (McCall brand)
 * Slant: Legislative experience + fiscal conservatism — convert donor network to votes
 */

import { useState } from "react";
import { useLocation } from "wouter";
import { GOV_POLLING, GOV_TIMELINE } from "@/lib/govData";
import VoterIntelligence from "@/components/VoterIntelligence";
import VoterMigration from "@/components/VoterMigration";

const CANDIDATE = {
  name: "Charles McCall",
  title: "Former Oklahoma House Speaker",
  color: "#fb923c",
  tagline: "Legislative Record. Fiscal Conservative. Ready to Lead.",
  polling: 18.4,
  cashOnHand: "~$1.56M",
  totalRaised: "$4.76M",
  selfLoaned: "$3.1M",
  status: "Competitive — Needs Catalyst to Advance",
  trumpEndorsed: false,
  primaryProjection: "17–21%",
  runoffProjection: "Requires Drummond collapse to qualify",
  strengths: [
    "Highest total funds raised in the race — $4.76M",
    "Best-organized ground operation and campaign infrastructure",
    "Former House Speaker — deepest legislative relationships in Oklahoma",
    "Strong business community and institutional donor network",
    "Well-produced advertising — strong on tax and fiscal messaging",
    "Southeast Oklahoma base provides geographic diversity",
  ],
  vulnerabilities: [
    "Polling flat to slightly down since late 2025 — wrong trajectory",
    "Squeezed between Drummond (establishment) and Mazzei (outsider)",
    "Business-community donor base is not a primary voting bloc",
    "Must convert financial advantage into votes — has not done so yet",
    "Needs Drummond to collapse or a major external catalyst to advance",
    "Most self-funded candidate after Mazzei — $3.1M in personal loans",
  ],
  pathToRunoff: [
    { step: "Hold business-community base", target: "18–20%", note: "Institutional Republicans + fiscal conservatives" },
    { step: "Convert donor network to votes", target: "+1–2%", note: "Financial supporters who haven't voted yet" },
    { step: "Drummond collapse or major endorsement", target: "Required", note: "External catalyst needed to break out of 18–21% range" },
    { step: "Projected primary finish", target: "17–21%", note: "Runoff qualification requires Drummond to underperform" },
  ],
  pathToRunoffWin: [
    { step: "McCall primary base", target: "72,000 votes", note: "18% of 400K turnout" },
    { step: "Absorb Drummond collapse voters", target: "+35,000", note: "If Drummond underperforms — establishment lane opens" },
    { step: "Absorb Keating fiscal conservatives", target: "+12,000", note: "Voters who responded to tax/fiscal messaging" },
    { step: "Business community activation", target: "+8,000", note: "Convert donor network to actual primary votes" },
    { step: "Projected runoff total", target: "127,000 votes (31.8%)", note: "Competitive — requires Drummond collapse scenario" },
  ],
  needToPersuade: {
    primary: "10,884 voters from a pool of 80,850 persuadable Republicans statewide",
    runoff: "~47,000 Drummond + Keating fiscal voters to migrate",
    keySegments: [
      "Drummond soft supporters who respond to legislative experience messaging",
      "Keating fiscal conservatives drawn to McCall's tax elimination platform",
      "Business community members who are donors but haven't voted yet",
      "Southeast Oklahoma Republicans who want a candidate from their region",
    ],
  },
  eaStrategy: {
    phase1: {
      label: "Phase 1 — Donor-to-Voter Conversion (Now → June 16)",
      budget: "$140,000–$170,000",
      objective: "Convert the financial donor network into actual primary votes and absorb Drummond soft supporters",
      tactics: [
        { tactic: "Donor-to-Voter Conversion Targeting", detail: "Identify registered Republican voters who have donated to McCall's campaign but whose household has not yet shown strong primary voting signals — deliver activation messaging to convert financial support into votes before June 16" },
        { tactic: "Drummond Soft-Supporter Identification", detail: "Use behavioral data to identify Drummond voters who have also engaged with McCall's fiscal messaging — these voters are persuadable to McCall if they see him as the stronger legislative executive" },
        { tactic: "Business Community Activation", detail: "Target registered Republican households in the business community — Chamber of Commerce members, business owners, fiscal conservatives — who respond to McCall's record as House Speaker and his tax elimination platform" },
        { tactic: "Southeast Oklahoma Surge", detail: "Concentrate CTV and digital targeting in McCall's home region — southeast Oklahoma counties where he has the strongest name recognition and can run up the score to offset deficits in metro areas" },
      ],
      expectedResult: "Convert donor network to votes + absorb Drummond soft supporters — hold 18–21% and position for runoff if Drummond underperforms",
    },
    phase2: {
      label: "Phase 2 — Establishment Consolidation (June 17 → August 25)",
      budget: "$330,000–$465,000",
      objective: "Become the consolidation candidate for the entire establishment and fiscal conservative lane",
      tactics: [
        { tactic: "Drummond Voter Absorption (Priority)", detail: "If Drummond fails to advance, identify all ~88,000 Drummond voters by name on the voter file — model which 50–55% are persuadable to McCall — deliver messaging in the first 2 weeks before Mazzei can reach them" },
        { tactic: "Fiscal Conservative Targeting", detail: "Identify voters who responded to Mazzei's income tax elimination message but are skeptical of his self-funding and outsider positioning — McCall's legislative record on fiscal policy is the bridge message" },
        { tactic: "Business Community Mobilization", detail: "Full activation of the business donor network statewide — convert every financial supporter into a voter and a volunteer who brings 3–5 additional voters from their network" },
        { tactic: "Behavioral Movement Dashboard", detail: "Real-time tracking of which Drummond and Keating voter segments are shifting toward McCall — weekly optimization to concentrate budget on highest-conversion segments" },
      ],
      expectedResult: "Absorb 50–55% of Drummond voters + business community mobilization = competitive runoff position at 38–46%",
    },
  },
  competitiveAdvantage: "McCall has the most money, the best infrastructure, and the deepest legislative relationships in the race — but none of that matters if donors don't vote. Exact Audience identifies every donor and business community supporter by name on the voter file and converts financial support into actual primary votes.",
};

const TABS = ["Overview", "Path to Win", "EA Strategy", "Race Context", "Voter Intelligence", "Voter Migration"] as const;
type Tab = typeof TABS[number];

export default function McCallPitchDashboard() {
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
        .m-tab { padding: 10px 20px; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 600; letter-spacing: 0.03em; transition: all 0.15s; border: 1px solid transparent; }
        .m-tab:hover { background: rgba(245,158,11,0.12); }
        .m-tab.active { background: rgba(245,158,11,0.18); border-color: rgba(245,158,11,0.4); color: #ffffff; }
        .m-card { background: ${cardBg}; border: 1px solid ${border}; border-radius: 12px; padding: 24px; }
        .m-card-accent { background: ${cardBg}; border: 1px solid rgba(245,158,11,0.3); border-radius: 12px; padding: 24px; }
        .step-row { display: flex; align-items: flex-start; gap: 16px; padding: 14px 0; border-bottom: 1px solid ${border}; }
        .step-row:last-child { border-bottom: none; }
        .step-num { width: 28px; height: 28px; border-radius: 50%; background: rgba(251,146,60,0.2); border: 1px solid rgba(245,158,11,0.4); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: #ffffff; flex-shrink: 0; margin-top: 2px; }
        .tactic-row { padding: 16px 0; border-bottom: 1px solid ${border}; }
        .tactic-row:last-child { border-bottom: none; }
        .badge { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; letter-spacing: 0.05em; }
        .poll-bar { height: 8px; border-radius: 4px; }
        @media (max-width: 768px) { .m-grid-2 { grid-template-columns: 1fr !important; } }
      `}</style>

      <div style={{ background: "linear-gradient(135deg, #0c0618 0%, #1a0840 100%)", borderBottom: `1px solid ${border}`, padding: "0 24px" }}>
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
                  <span className="badge" style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)", color: "#ffffff" }}>FORMER HOUSE SPEAKER</span>
                  <span className="badge" style={{ background: "rgba(251,146,60,0.1)", border: "1px solid rgba(245,158,11,0.25)", color: "#ffffff" }}>MOST FUNDS RAISED</span>
                  <span className="badge" style={{ background: "rgba(255,255,255,0.07)", border: `1px solid ${border}`, color: textMuted }}>FISCAL CONSERVATIVE</span>
                </div>
                <h1 style={{ fontSize: 36, fontWeight: 800, margin: "0 0 6px", letterSpacing: "-0.02em" }}>Charles McCall</h1>
                <p style={{ fontSize: 16, color: textSecondary, margin: "0 0 4px" }}>{CANDIDATE.title}</p>
                <p style={{ fontSize: 14, color: accent, fontWeight: 600, margin: 0 }}>{CANDIDATE.tagline}</p>
              </div>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                {[
                  { label: "Current Polling", value: `${CANDIDATE.polling}%`, sub: "Projected: 17–21%" },
                  { label: "Primary Date", value: "June 16", sub: "9 days away" },
                  { label: "Runoff Date", value: "Aug 25", sub: "79 days if needed" },
                  { label: "Cash on Hand", value: CANDIDATE.cashOnHand, sub: "Best-funded campaign" },
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
              <button key={t} className={`m-tab${tab === t ? " active" : ""}`} onClick={() => setTab(t)} style={{ color: tab === t ? "#ffffff" : textSecondary }}>{t}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>

        {tab === "Overview" && (
          <div>
            <div style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.25)", borderRadius: 10, padding: "14px 20px", marginBottom: 24, display: "flex", gap: 12 }}>
              <span style={{ fontSize: 18 }}>💡</span>
              <div>
                <span style={{ fontWeight: 700, color: "#fbbf24", fontSize: 13 }}>The Core Problem: </span>
                <span style={{ color: textSecondary, fontSize: 13 }}>McCall has raised the most money in the race but is polling 4th. The gap between financial support and voter support is the problem Exact Audience solves — by identifying every donor and business community supporter by name and converting them into votes.</span>
              </div>
            </div>
            <div className="m-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
              <div className="m-card-accent">
                <h3 style={{ fontSize: 14, fontWeight: 700, color: accent, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 16px" }}>Campaign Strengths</h3>
                {CANDIDATE.strengths.map((s, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                    <span style={{ color: "#fbbf24", fontSize: 14, flexShrink: 0 }}>✓</span>
                    <span style={{ fontSize: 14, color: textSecondary, lineHeight: 1.5 }}>{s}</span>
                  </div>
                ))}
              </div>
              <div className="m-card">
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#fbbf24", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 16px" }}>Vulnerabilities to Address</h3>
                {CANDIDATE.vulnerabilities.map((v, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                    <span style={{ color: "#fbbf24", fontSize: 14, flexShrink: 0 }}>!</span>
                    <span style={{ fontSize: 14, color: textSecondary, lineHeight: 1.5 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="m-card" style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: textSecondary, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 20px" }}>Current Race Polling — NonDoc/Independent Survey, May 26</h3>
              {GOV_POLLING.filter(p => p.pct >= 5).map(p => (
                <div key={p.candidate} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: 14, fontWeight: p.candidate === "Charles McCall" ? 700 : 400, color: p.candidate === "Charles McCall" ? accent : textSecondary }}>
                      {p.candidate}{p.trump ? " ★" : ""}
                    </span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: p.candidate === "Charles McCall" ? accent : textPrimary }}>{p.pct}%</span>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 4, overflow: "hidden" }}>
                    <div className="poll-bar" style={{ width: `${p.pct * 3}%`, background: p.candidate === "Charles McCall" ? accent : p.color }} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.25)", borderRadius: 12, padding: 24 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: accent, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 12px" }}>Why Exact Audience for McCall</h3>
              <p style={{ fontSize: 15, color: textPrimary, lineHeight: 1.7, margin: 0 }}>{CANDIDATE.competitiveAdvantage}</p>
            </div>
          </div>
        )}

        {tab === "Path to Win" && (
          <div>
            <div className="m-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
              <div className="m-card-accent">
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
              <div className="m-card">
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
            <div className="m-card">
              <h3 style={{ fontSize: 14, fontWeight: 700, color: textSecondary, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 16px" }}>Need To Persuade</h3>
              <div className="m-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
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
                  { label: "Traditional Agency", items: ["Platform-defined audiences", "Cookie-based anonymous targeting", "No voter file connection", "CTR and CPM metrics only"], accent: false },
                  { label: "Exact Audience", items: ["Named voter file targeting", "Individual-level identity resolution", "Donor-to-voter conversion model", "Voters behaviorally moved — tracked back to file"], accent: true },
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
                  "You've raised the most money in this race. Exact Audience makes sure every dollar you raised translates into a vote — by identifying your donors and supporters by name on the voter file and delivering your message directly to them."
                </p>
              </div>
            </div>
            {[CANDIDATE.eaStrategy.phase1, CANDIDATE.eaStrategy.phase2].map((phase, pi) => (
              <div key={pi} className={pi === 0 ? "m-card-accent" : "m-card"} style={{ marginBottom: 20 }}>
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
                { label: "McCall Total Raised", value: "$4.76M" },
              ].map(s => (
                <div key={s.label} className="m-card" style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: accent }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: textMuted, textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div className="m-card">
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
              candidateName="McCall"
              accent="#f59e0b"
              mode="primary"
            />
          </div>
        )}
        {tab === "Voter Migration" && (
          <div style={{ padding: "0 4px" }}>
            <VoterMigration
              candidateName="McCall"
              mode="primary"
            />
          </div>
        )}
      </div>
    </div>
  );
}
