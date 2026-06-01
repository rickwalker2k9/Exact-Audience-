import React, { useState, useEffect } from "react";
import { useIsMobile as useMobile } from "@/hooks/useMobile";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import {
  STARLING_TIERS, STARLING_VOTER_DEMO, STARLING_MOODS,
  STARLING_CTV_CHANNELS, STARLING_DIGITAL_CHANNELS,
  STARLING_TIMELINE, STARLING_CREATIVES, STARLING_EA_ADVANTAGE,
  STARLING_RACE, STARLING_INTELLIGENCE,
} from "@/lib/starlingData";

// ── Color Palette ─────────────────────────────────────────────────────────────
type C = typeof DARK_C;
const DARK_C = {
  bg: "#0a0e1a", bg2: "#0d1224", bg3: "#111827", card: "#111827",
  border: "#1e293b", white: "#f1f5f9", muted: "#94a3b8",
  accent: "#6366f1", accent2: "#818cf8", blue2: "#38bdf8",
  green: "#10b981", gold: "#d4a017", amber: "#f59e0b",
  purple: "#a855f7", teal: "#14b8a6",
  tooltipBg: "#1e293b",
};
const LIGHT_C = {
  bg: "#f8fafc", bg2: "#f1f5f9", bg3: "#e2e8f0", card: "#ffffff",
  border: "#cbd5e1", white: "#0f172a", muted: "#475569",
  accent: "#4f46e5", accent2: "#6366f1", blue2: "#0284c7",
  green: "#059669", gold: "#b45309", amber: "#d97706",
  purple: "#9333ea", teal: "#0d9488",
  tooltipBg: "#f1f5f9",
};

// ── Shared Components ─────────────────────────────────────────────────────────
function KpiCard({ label, value, sub, color, C }: { label: string; value: string; sub?: string; color: string; C: C }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "18px 20px", borderTop: `3px solid ${color}` }}>
      <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase" as const, letterSpacing: "0.1em", marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 800, color: C.white, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: C.muted, marginTop: 6 }}>{sub}</div>}
    </div>
  );
}
function SectionTitle({ children, C }: { children: React.ReactNode; C: C }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ width: 3, height: 14, background: C.accent2, borderRadius: 2, display: "inline-block", flexShrink: 0, opacity: 0.7 }} />
      {children}
    </div>
  );
}
function Card({ children, style, C }: { children: React.ReactNode; style?: React.CSSProperties; C: C }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, ...style }}>
      {children}
    </div>
  );
}
function LiveBadge({ C }: { C: C }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: `${C.accent2}18`, border: `1px solid ${C.accent2}44`, borderRadius: 20, padding: "4px 12px", fontSize: 10, fontWeight: 700, color: C.accent2, letterSpacing: "0.08em", textTransform: "uppercase" as const }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.accent2, animation: "pulse 2s infinite" }} />
      Exact Audience Intelligence
    </div>
  );
}

// ── Countdown Timer ─────────────────────────────────────────────────────────
function ElectionCountdown({ C }: { C: C }) {
  // June 16, 2026 — Oklahoma polls close at 7:00 PM CDT (00:00 UTC June 17)
  const ELECTION_CLOSE = new Date("2026-06-17T00:00:00Z").getTime();
  const [timeLeft, setTimeLeft] = useState(() => Math.max(0, ELECTION_CLOSE - Date.now()));
  useEffect(() => {
    const id = setInterval(() => setTimeLeft(Math.max(0, ELECTION_CLOSE - Date.now())), 1000);
    return () => clearInterval(id);
  }, []);
  const days = Math.floor(timeLeft / 86400000);
  const hrs  = Math.floor((timeLeft % 86400000) / 3600000);
  const mins = Math.floor((timeLeft % 3600000) / 60000);
  const secs = Math.floor((timeLeft % 60000) / 1000);
  const unit = (val: number, label: string) => (
    <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", gap: 4 }}>
      <div style={{ background: C.accent, borderRadius: 8, padding: "10px 16px", minWidth: 56, textAlign: "center" as const }}>
        <span style={{ fontSize: 28, fontWeight: 900, color: "#fff", fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em" }}>{String(val).padStart(2, "0")}</span>
      </div>
      <span style={{ fontSize: 9, fontWeight: 700, color: C.muted, textTransform: "uppercase" as const, letterSpacing: "0.12em" }}>{label}</span>
    </div>
  );
  return (
    <div style={{ background: `${C.accent}12`, border: `1px solid ${C.accent}30`, borderRadius: 12, padding: "16px 20px", display: "flex", flexWrap: "wrap" as const, alignItems: "center", gap: 16, justifyContent: "space-between" }}>
      <div>
        <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 4 }}>Election Day Countdown</div>
        <div style={{ fontSize: 13, fontWeight: 800, color: C.white }}>Tuesday, June 16, 2026 — Polls close 7:00 PM CT</div>
      </div>
      <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
        {unit(days, "Days")}
        <span style={{ fontSize: 24, fontWeight: 900, color: C.accent2, paddingTop: 8 }}>:</span>
        {unit(hrs, "Hrs")}
        <span style={{ fontSize: 24, fontWeight: 900, color: C.accent2, paddingTop: 8 }}>:</span>
        {unit(mins, "Min")}
        <span style={{ fontSize: 24, fontWeight: 900, color: C.accent2, paddingTop: 8 }}>:</span>
        {unit(secs, "Sec")}
      </div>
    </div>
  );
}

// ── County-by-County data (Oklahoma AG primary — Jeff Starling) ───────────────
// COUNTY_STRATEGY — all numbers derived from Oklahoma State Election Board Jan 15, 2026
// GOP reg × 20% historical primary turnout = projected turnout
// currentSupport = projected turnout × 11% (Torchlight Strategies poll, March 2026)
// votesToGain = projected turnout × 11% (gap from 11% to 50%+1 win threshold in two-man race)
// investment = proportional share of $60K media budget (recommended tier minus $5K mgmt fee)
const COUNTY_STRATEGY = [
  { county: "Oklahoma County",  gopReg: 163500, totalVoteTarget: 32700, currentSupport: 3597, votesToGain: 3597, investment: 16500 },
  { county: "Tulsa County",     gopReg: 147200, totalVoteTarget: 29440, currentSupport: 3238, votesToGain: 3238, investment: 14800 },
  { county: "Cleveland County", gopReg: 79100,  totalVoteTarget: 15820, currentSupport: 1740, votesToGain: 1740, investment: 8000  },
  { county: "Canadian County",  gopReg: 68400,  totalVoteTarget: 13680, currentSupport: 1505, votesToGain: 1505, investment: 6900  },
  { county: "Comanche County",  gopReg: 37800,  totalVoteTarget: 7560,  currentSupport: 832,  votesToGain: 832,  investment: 3800  },
  { county: "Rogers County",    gopReg: 36100,  totalVoteTarget: 7220,  currentSupport: 794,  votesToGain: 794,  investment: 3600  },
  { county: "Wagoner County",   gopReg: 32400,  totalVoteTarget: 6480,  currentSupport: 713,  votesToGain: 713,  investment: 3300  },
  { county: "Payne County",     gopReg: 30600,  totalVoteTarget: 6120,  currentSupport: 673,  votesToGain: 673,  investment: 3100  },
];

// ── TAB: Overview ─────────────────────────────────────────────────────────────
function TabOverview({ mobile, C }: { mobile: boolean; C: C }) {
  const R = STARLING_RACE;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Election Countdown */}
      <ElectionCountdown C={C} />
      {/* Mission Banner */}
      <div style={{ background: `linear-gradient(135deg, ${C.accent}18 0%, ${C.blue2}12 100%)`, border: `1px solid ${C.accent2}40`, borderRadius: 12, padding: "20px 24px", display: "flex", alignItems: "flex-start", gap: 16 }}>
        <div style={{ fontSize: 32, flexShrink: 0 }}>🎯</div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 900, color: C.white, marginBottom: 6 }}>Right Person. Right Message. Right Time.</div>
          <div style={{ fontSize: 13, color: C.white, lineHeight: 1.7, fontWeight: 400 }}>
            Exact Audience has identified <strong style={{ color: C.accent2 }}>200,035 undecided Republican primary voters</strong> across Oklahoma — by name, address, mobile number, and email. We know exactly what they are watching, reading, and searching right now. We put the right message in front of the right voter at the right time. That is Exact Audience.
          </div>
        </div>
      </div>

      {/* Race Snapshot */}
      <Card C={C}>
        <SectionTitle C={C}>Race Snapshot — Oklahoma AG Primary</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr 1fr" : "repeat(4,1fr)", gap: 12, marginBottom: 16 }}>
          <KpiCard label="Election Date" value={R.electionDate} color={C.accent2} C={C} />
          <KpiCard label="Race Type" value="2-Man Race" sub="Starling vs. Echols" color={C.blue2} C={C} />
          <KpiCard label="Key Markets" value="OKC + Tulsa" sub="Statewide digital" color={C.gold} C={C} />
          <KpiCard label="EA Advantage" value="Voter DNA" sub="Identified by name & address" color={C.green} C={C} />
        </div>
        {/* Polling bar */}
        <div style={{ background: C.bg3, borderRadius: 10, padding: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase" as const, letterSpacing: "0.1em", marginBottom: 12 }}>Current Polling Landscape</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { name: "Jeff Starling", pct: R.starlingPct, color: C.accent2 },
              { name: "Jon Echols", pct: R.echolsPct, color: C.muted },
              { name: "Undecided / Persuadable", pct: R.undecidedPct, color: C.gold },
            ].map(c => (
              <div key={c.name}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: C.white, fontWeight: 600 }}>{c.name}</span>
                  <span style={{ fontSize: 12, fontWeight: 800, color: c.color }}>{c.pct}%</span>
                </div>
                <div style={{ background: C.border, borderRadius: 4, height: 8, overflow: "hidden" }}>
                  <div style={{ width: `${c.pct}%`, background: c.color, height: "100%", borderRadius: 4, transition: "width 0.8s ease" }} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12, fontSize: 11, color: C.gold, fontWeight: 600 }}>
            ⚡ 78% of likely voters are still undecided. Exact Audience reaches every one of them by name — on the exact screen they are watching right now.
          </div>
        </div>
      </Card>

      {/* Voter Mood Segments */}
      <Card C={C}>
        <SectionTitle C={C}>Statewide Voter Mood Segments — What They Are Watching</SectionTitle>
          <div style={{ fontSize: 12, color: C.white, marginBottom: 14, lineHeight: 1.6 }}>
          Our behavioral data shows how undecided Oklahoma Republican primary voters are consuming media right now. Each mood segment maps directly to the channels where they can be reached.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 12 }}>
          {STARLING_MOODS.map(m => (
            <div key={m.label} style={{ background: C.bg3, borderRadius: 10, padding: 14, borderLeft: `3px solid ${m.color}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: C.white }}>{m.label}</span>
                <span style={{ fontSize: 14, fontWeight: 900, color: m.color }}>{m.pct}%</span>
              </div>
              <div style={{ fontSize: 12, color: C.white, lineHeight: 1.5, marginBottom: 8 }}>{m.desc}</div>
              <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 4 }}>
                {m.channels.map((ch: string) => (
                  <span key={ch} style={{ fontSize: 9, color: m.color, background: `${m.color}15`, border: `1px solid ${m.color}30`, borderRadius: 8, padding: "2px 7px" }}>{ch}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* EA Advantage */}
      <Card C={C}>
        <SectionTitle C={C}>How Exact Audience Works</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "repeat(3,1fr)", gap: 12 }}>
          {STARLING_EA_ADVANTAGE.map((a: any) => (
            <div key={a.title} style={{ background: C.bg3, borderRadius: 10, padding: 14, borderTop: `2px solid ${a.color}` }}>
              <div style={{ fontSize: 20, marginBottom: 8 }}>{a.icon}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.white, marginBottom: 6 }}>{a.title}</div>
              <div style={{ fontSize: 12, color: C.white, lineHeight: 1.5 }}>{a.desc}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Message Exposure Model */}
      <Card C={C}>
        <SectionTitle C={C}>Message Exposure Model</SectionTitle>
        <div style={{ background: C.bg3, borderRadius: 12, padding: "20px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 0, flexWrap: "wrap" as const, justifyContent: "center" }}>
            {[
              { range: "1–2 exposures", stage: "Awareness",    color: C.teal,   desc: "Voter sees the name for the first time" },
              { range: "3–5 exposures", stage: "Recognition",  color: C.accent2, desc: "Name becomes familiar and trusted" },
              { range: "6–10 exposures", stage: "Decision",    color: C.gold,   desc: "Voter is ready to commit at the ballot" },
            ].map((s, i) => (
              <React.Fragment key={s.stage}>
                <div style={{ flex: "1 1 160px", minWidth: 140, background: C.card, border: `2px solid ${s.color}`, borderRadius: 10, padding: "18px 16px", textAlign: "center" as const }}>
                  <div style={{ fontSize: 10, color: C.muted, marginBottom: 6, letterSpacing: "0.08em" }}>{s.range}</div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: C.white, marginBottom: 6 }}>{s.stage}</div>
                  <div style={{ fontSize: 11, color: "#cbd5e1", lineHeight: 1.5 }}>{s.desc}</div>
                </div>
                {i < 2 && (
                  <div style={{ fontSize: 22, color: C.accent2, padding: "0 10px", flexShrink: 0, alignSelf: "center" }}>→</div>
                )}
              </React.Fragment>
            ))}
          </div>
          <div style={{ marginTop: 16, fontSize: 12, color: C.white, textAlign: "center" as const, lineHeight: 1.6 }}>
            Exact Audience delivers repeated exposure across every screen your voter watches. Our $65K tier delivers <strong style={{ color: C.accent2 }}>22.6× average frequency</strong> — well into the Decision zone for every voter we touch.
          </div>
        </div>
      </Card>

      {/* County-by-County Strategy */}
      <Card C={C}>
        <SectionTitle C={C}>County-by-County Strategy — Focusing Resources Where They Deliver Maximum Impact</SectionTitle>
        <div style={{ overflowX: "auto" as const }}>
          <table style={{ width: "100%", borderCollapse: "collapse" as const, fontSize: 11 }}>
            <thead>
              <tr style={{ background: C.bg3 }}>
                {["County", "GOP Registered", "Proj. Primary Turnout", "Starling Est. (11%)", "Votes to Gain", "Planned Investment"].map(h => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: h === "County" ? "left" as const : "center" as const, color: C.muted, fontWeight: 700, borderBottom: `1px solid ${C.border}`, whiteSpace: "nowrap" as const, fontSize: 10, textTransform: "uppercase" as const, letterSpacing: "0.08em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COUNTY_STRATEGY.map((row, i) => (
                <tr key={row.county} style={{ borderBottom: `1px solid ${C.border}`, background: i % 2 === 0 ? "transparent" : `${C.bg3}80` }}>
                  <td style={{ padding: "10px 14px", color: C.white, fontWeight: 600 }}>{row.county}</td>
                  <td style={{ padding: "10px 14px", color: C.white, textAlign: "center" as const }}>{row.gopReg.toLocaleString()}</td>
                  <td style={{ padding: "10px 14px", color: C.white, textAlign: "center" as const }}>{row.totalVoteTarget.toLocaleString()}</td>
                  <td style={{ padding: "10px 14px", color: C.blue2, textAlign: "center" as const, fontWeight: 600 }}>{row.currentSupport.toLocaleString()}</td>
                  <td style={{ padding: "10px 14px", textAlign: "center" as const }}>
                    <span style={{ fontWeight: 800, color: C.gold }}>{row.votesToGain.toLocaleString()}</span>
                  </td>
                  <td style={{ padding: "10px 14px", textAlign: "center" as const }}>
                    <span style={{ fontWeight: 800, color: C.green }}>${row.investment.toLocaleString()}</span>
                  </td>
                </tr>
              ))}
              <tr style={{ borderTop: `2px solid ${C.accent2}40`, background: `${C.accent}08` }}>
                <td style={{ padding: "10px 14px", color: C.white, fontWeight: 900 }}>TOTAL</td>
                <td style={{ padding: "10px 14px", color: C.white, fontWeight: 800, textAlign: "center" as const }}>{COUNTY_STRATEGY.reduce((s, r) => s + r.gopReg, 0).toLocaleString()}</td>
                <td style={{ padding: "10px 14px", color: C.white, fontWeight: 800, textAlign: "center" as const }}>{COUNTY_STRATEGY.reduce((s, r) => s + r.totalVoteTarget, 0).toLocaleString()}</td>
                <td style={{ padding: "10px 14px", color: C.blue2, fontWeight: 800, textAlign: "center" as const }}>{COUNTY_STRATEGY.reduce((s, r) => s + r.currentSupport, 0).toLocaleString()}</td>
                <td style={{ padding: "10px 14px", textAlign: "center" as const }}><span style={{ fontWeight: 900, color: C.gold }}>{COUNTY_STRATEGY.reduce((s, r) => s + r.votesToGain, 0).toLocaleString()}</span></td>
                <td style={{ padding: "10px 14px", textAlign: "center" as const }}><span style={{ fontWeight: 900, color: C.green }}>${COUNTY_STRATEGY.reduce((s, r) => s + r.investment, 0).toLocaleString()}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
          <div style={{ marginTop: 14, background: C.bg3, borderRadius: 8, padding: "12px 16px", fontSize: 12, color: C.white, lineHeight: 1.6 }}>
          Built on Oklahoma State Election Board voter counts (Jan 2026) with 20% primary turnout projection. Two-man race: Starling vs. Echols. Exact Audience has matched the full undecided universe in every county — these voters are identified by name and ready to reach.
        </div>
      </Card>

      {/* SEO Comparison */}
      <Card C={C}>
        <SectionTitle C={C}>Website & SEO Intelligence — jeffstarling.com vs jonechols.com</SectionTitle>
        <div style={{ fontSize: 12, color: C.white, lineHeight: 1.6, marginBottom: 14 }}>
          Source: Ubersuggest, May 2026. Neither candidate is running paid search — all traffic is organic.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 16, marginBottom: 16 }}>
          <div style={{ background: `${C.accent}12`, border: `1px solid ${C.accent}30`, borderRadius: 10, padding: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: C.accent2, marginBottom: 12 }}>✅ jeffstarling.com</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { label: "Monthly Organic Visits", value: "26", note: "100% organic" },
                { label: "Domain Authority", value: "17", note: "Growing" },
                { label: "Ranking Keywords", value: "14", note: "All organic" },
                { label: "Backlinks", value: "48", note: "6 nofollow" },
              ].map(s => (
                <div key={s.label} style={{ background: C.bg3, borderRadius: 8, padding: "10px 12px" }}>
                  <div style={{ fontSize: 10, color: C.muted, marginBottom: 4, textTransform: "uppercase" as const, letterSpacing: "0.08em" }}>{s.label}</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: C.white }}>{s.value}</div>
                  <div style={{ fontSize: 10, color: C.accent2 }}>{s.note}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 12, fontSize: 12, color: C.white, lineHeight: 1.6 }}>
              <strong style={{ color: C.green }}>Top keyword:</strong> "jeff starling oklahoma" — 260 searches/mo, ranking #2, driving 22 visits. Campaign name recognition is already generating organic search demand.
            </div>
          </div>
          <div style={{ background: `${C.gold}08`, border: `1px solid ${C.gold}25`, borderRadius: 10, padding: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: C.gold, marginBottom: 12 }}>⚠️ jonechols.com</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { label: "Monthly Organic Visits", value: "4", note: "100% organic" },
                { label: "Domain Authority", value: "24", note: "Established" },
                { label: "Ranking Keywords", value: "10", note: "All organic" },
                { label: "Backlinks", value: "22,929", note: "72 nofollow" },
              ].map(s => (
                <div key={s.label} style={{ background: C.bg3, borderRadius: 8, padding: "10px 12px" }}>
                  <div style={{ fontSize: 10, color: C.muted, marginBottom: 4, textTransform: "uppercase" as const, letterSpacing: "0.08em" }}>{s.label}</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: C.white }}>{s.value}</div>
                  <div style={{ fontSize: 10, color: C.gold }}>{s.note}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 12, fontSize: 12, color: C.white, lineHeight: 1.6 }}>
              <strong style={{ color: C.gold }}>Key insight:</strong> Echols has 22,929 backlinks from his 14-year legislative career but only 4 organic visitors/month. His site generates no campaign interest — his name recognition is incumbency, not digital presence.
            </div>
          </div>
        </div>
        <div style={{ background: `${C.teal}10`, border: `1px solid ${C.teal}30`, borderRadius: 8, padding: "12px 16px", fontSize: 12, color: "#cbd5e1", lineHeight: 1.6 }}>
          <strong style={{ color: C.accent2 }}>Strategic implication:</strong> Starling is already winning the organic search battle for his own name. Paid digital amplification of “jeff starling oklahoma attorney general” and contrast keywords (“echols tax increases”, “echols RINO”) would capture high-intent voters who are already searching — and Echols is running zero paid search to defend his position.
        </div>
      </Card>

    </div>
  );
}

// ── TAB: Voter Universe ───────────────────────────────────────────────────────
function TabVoterUniverse({ mobile, C }: { mobile: boolean; C: C }) {
  const D = STARLING_VOTER_DEMO;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Universe intro */}
      <div style={{ background: `${C.accent}10`, border: `1px solid ${C.accent2}30`, borderRadius: 12, padding: "16px 20px" }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: C.white, marginBottom: 6 }}>Statewide Undecided Republican Primary Voter Universe</div>
        <div style={{ fontSize: 12, color: C.white, lineHeight: 1.6 }}>
          Exact Audience has identified and profiled a large statewide universe of undecided Republican primary voters across Oklahoma. Every person below is identified by name, address, mobile number, email, and behavioral data — not modeled estimates. These are real, reachable voters.
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: 12 }}>
        <KpiCard label="Voter Universe" value="Statewide" sub="Identified by name & address" color={C.accent2} C={C} />
        <KpiCard label="Mobile Reachable" value="93.8%" sub="Direct mobile number on file" color={C.blue2} C={C} />
        <KpiCard label="Email on File" value="98.8%" sub="Verified personal email" color={C.green} C={C} />
        <KpiCard label="Avg DB Matches" value={`${D.avgDbMatches}x`} sub="Data points per voter" color={C.gold} C={C} />
      </div>

      {/* Gender + Age */}
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 16 }}>
        <Card C={C}>
          <SectionTitle C={C}>Gender Breakdown</SectionTitle>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={D.gender} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" paddingAngle={3}>
                {D.gender.map((g: any, i: number) => <Cell key={i} fill={g.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: C.tooltipBg, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 11 }} formatter={(v: any, n: any, p: any) => [`${p.payload.pct}%`, p.payload.label]} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 8 }}>
            {D.gender.map((g: any) => (
              <div key={g.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: g.color }} />
                <span style={{ fontSize: 10, color: C.white }}>{g.label} {g.pct}%</span>
              </div>
            ))}
          </div>
        </Card>
        <Card C={C}>
          <SectionTitle C={C}>Age Distribution</SectionTitle>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={D.ageRanges} layout="vertical" margin={{ left: 10, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} horizontal={false} />
              <XAxis type="number" tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
              <YAxis type="category" dataKey="label" tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} width={50} />
              <Tooltip contentStyle={{ background: C.tooltipBg, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 11 }} formatter={(v: any) => [`${v}%`]} />
              <Bar dataKey="pct" radius={[0, 4, 4, 0]}>
                {D.ageRanges.map((a: any, i: number) => <Cell key={i} fill={a.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Top Cities */}
      <Card C={C}>
        <SectionTitle C={C}>Top Cities — Undecided Voter Concentration</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {D.topCities.map((c: any, i: number) => (
            <div key={c.city} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 20, fontSize: 10, color: C.muted, textAlign: "right" as const }}>{i + 1}</div>
              <div style={{ width: 130, fontSize: 12, color: C.white, fontWeight: 600 }}>{c.city}</div>
              <div style={{ flex: 1, background: C.bg3, borderRadius: 4, height: 8, overflow: "hidden" }}>
                <div style={{ width: `${(c.pct / D.topCities[0].pct) * 100}%`, background: i === 0 ? C.accent2 : i === 1 ? C.blue2 : C.teal, height: "100%", borderRadius: 4 }} />
              </div>
              <div style={{ width: 40, fontSize: 11, fontWeight: 700, color: C.accent2, textAlign: "right" as const }}>{c.pct}%</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Income + Homeowner */}
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 16 }}>
        <Card C={C}>
          <SectionTitle C={C}>Income Distribution</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {D.income.map((inc: any) => (
              <div key={inc.label}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                  <span style={{ fontSize: 10, color: C.white }}>{inc.label}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: inc.color }}>{inc.pct}%</span>
                </div>
                <div style={{ background: C.bg3, borderRadius: 3, height: 5, overflow: "hidden" }}>
                  <div style={{ width: `${inc.pct}%`, background: inc.color, height: "100%", borderRadius: 3 }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card C={C}>
          <SectionTitle C={C}>Household Profile</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: C.white, fontWeight: 600 }}>Homeowners</span>
                <span style={{ fontSize: 16, fontWeight: 800, color: C.green }}>{D.homeowner.yesPct}%</span>
              </div>
              <div style={{ background: C.bg3, borderRadius: 4, height: 8, overflow: "hidden" }}>
                <div style={{ width: `${D.homeowner.yesPct}%`, background: C.green, height: "100%", borderRadius: 4 }} />
              </div>
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: C.white, fontWeight: 600 }}>Married</span>
                <span style={{ fontSize: 16, fontWeight: 800, color: C.blue2 }}>{D.married.yesPct}%</span>
              </div>
              <div style={{ background: C.bg3, borderRadius: 4, height: 8, overflow: "hidden" }}>
                <div style={{ width: `${D.married.yesPct}%`, background: C.blue2, height: "100%", borderRadius: 4 }} />
              </div>
            </div>
            <div style={{ background: C.bg3, borderRadius: 10, padding: 12, marginTop: 4 }}>
              <div style={{ fontSize: 11, color: C.white, marginBottom: 8 }}>Credit Rating Distribution</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const }}>
                {D.creditRating.map((cr: any) => (
                  <div key={cr.grade} style={{ background: `${cr.color}20`, border: `1px solid ${cr.color}40`, borderRadius: 6, padding: "4px 10px", textAlign: "center" as const }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: cr.color }}>{cr.grade}</div>
                    <div style={{ fontSize: 9, color: C.white }}>{cr.count.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Intelligence signals */}
      <Card C={C}>
        <SectionTitle C={C}>Behavioral Intelligence — What They Are Doing Online Right Now</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 10 }}>
          {STARLING_INTELLIGENCE.map((s: any) => (
            <div key={s.signal} style={{ background: C.bg3, borderRadius: 8, padding: "10px 14px", display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>{s.icon}</span>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.white, marginBottom: 2 }}>{s.signal}</div>
                <div style={{ fontSize: 11, color: C.white, lineHeight: 1.4 }}>{s.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

    </div>
  );
}

// ── TAB: What We Can Do ───────────────────────────────────────────────────────
function TabWhatWeCanDo({ mobile, C }: { mobile: boolean; C: C }) {
  const [selected, setSelected] = useState(1); // default to recommended
  const tier = STARLING_TIERS[selected];
  const tierColors = [C.teal, C.accent2, C.purple];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Intro */}
      <div style={{ background: `${C.blue2}10`, border: `1px solid ${C.blue2}30`, borderRadius: 12, padding: "14px 18px" }}>
        <div style={{ fontSize: 12, color: C.white, fontWeight: 700, marginBottom: 4 }}>Three Investment Levels — Three Outcomes</div>
        <div style={{ fontSize: 12, color: C.white, lineHeight: 1.6 }}>
          Every dollar goes directly toward reaching identified, named, undecided Republican primary voters in Oklahoma — on the exact streaming channels they watch right now. Below is what each investment level delivers in reach, frequency, and estimated votes moved.
        </div>
      </div>

      {/* Tier Selector */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
        {STARLING_TIERS.map((t, i) => (
          <button key={t.id} onClick={() => setSelected(i)} style={{
            background: selected === i ? `${tierColors[i]}18` : C.card,
            border: `2px solid ${selected === i ? tierColors[i] : C.border}`,
            borderRadius: 12, padding: mobile ? "12px 8px" : "16px 14px", cursor: "pointer", textAlign: "left" as const,
            transition: "all 0.2s",
          }}>
            {t.recommended && <div style={{ fontSize: 9, fontWeight: 700, color: tierColors[i], textTransform: "uppercase" as const, letterSpacing: "0.1em", marginBottom: 4 }}>★ Recommended</div>}
            <div style={{ fontSize: mobile ? 14 : 18, fontWeight: 900, color: tierColors[i] }}>${(t.total / 1000).toFixed(0)}K</div>
            <div style={{ fontSize: 10, color: C.white, fontWeight: 600, marginTop: 2 }}>{t.label}</div>
            <div style={{ fontSize: 9, color: C.white, marginTop: 4, lineHeight: 1.4 }}>{t.tagline}</div>
          </button>
        ))}
      </div>

      {/* Selected Tier Detail */}
      <Card C={C} style={{ borderTop: `3px solid ${tierColors[selected]}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, flexWrap: "wrap" as const, gap: 8 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 900, color: tierColors[selected] }}>${tier.total.toLocaleString()} — {tier.label}</div>
            <div style={{ fontSize: 12, color: C.white, marginTop: 4 }}>{tier.tagline}</div>
          </div>
        </div>

        {/* Budget Breakdown */}
        <SectionTitle C={C}>Budget Breakdown</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
          {tier.components.map((comp: any) => (
            <div key={comp.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: C.bg3, borderRadius: 8, padding: "10px 14px" }}>
              <span style={{ fontSize: 11, color: C.white }}>{comp.label}</span>
              <span style={{ fontSize: 13, fontWeight: 800, color: tierColors[selected] }}>${(comp.amount ?? comp.budget ?? 0).toLocaleString()}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: `${tierColors[selected]}12`, border: `1px solid ${tierColors[selected]}30`, borderRadius: 8, padding: "10px 14px" }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: C.white }}>Total Investment</span>
            <span style={{ fontSize: 16, fontWeight: 900, color: tierColors[selected] }}>${tier.total.toLocaleString()}</span>
          </div>
        </div>

        {/* What This Delivers */}
        <SectionTitle C={C}>What This Delivers</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr 1fr" : "repeat(3,1fr)", gap: 10, marginBottom: 20 }}>
          {[
            { label: "Unique Voters Reached", value: tier.metrics.uniqueVoters },
            { label: "Avg Frequency", value: tier.metrics.frequency },
            { label: "Digital Impressions", value: tier.metrics.digitalImpressions },
            { label: "Voter File Contacts", value: tier.metrics.siteIdContacts },
            { label: "Estimated New Votes", value: tier.metrics.newVotes },
            { label: "Cost Per Vote", value: tier.metrics.costPerVote },
          ].map(m => (
            <div key={m.label} style={{ background: C.bg3, borderRadius: 10, padding: "12px 14px", borderLeft: `3px solid ${tierColors[selected]}` }}>
              <div style={{ fontSize: 9, color: C.white, textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 4 }}>{m.label}</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: C.white }}>{m.value}</div>
            </div>
          ))}
        </div>

        {/* Vote Projections */}
        <SectionTitle C={C}>Vote Projection Scenarios</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "repeat(3,1fr)", gap: 10 }}>
          {tier.projections.map((p: any) => (
            <div key={p.scenario} style={{
              background: p.highlight ? `${tierColors[selected]}12` : C.bg3,
              border: `1px solid ${p.highlight ? tierColors[selected] + "50" : C.border}`,
              borderRadius: 10, padding: 14,
            }}>
              {p.highlight && <div style={{ fontSize: 9, fontWeight: 700, color: tierColors[selected], textTransform: "uppercase" as const, letterSpacing: "0.1em", marginBottom: 6 }}>Most Likely</div>}
              <div style={{ fontSize: 13, fontWeight: 700, color: C.white, marginBottom: 10 }}>{p.scenario}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 10, color: C.white }}>Voters Reached</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: C.white }}>{p.votersReached.toLocaleString()}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 10, color: C.white }}>Conversion Rate</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: C.white }}>{p.conversion}%</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 10, color: C.white }}>New Votes for Starling</span>
                  <span style={{ fontSize: 12, fontWeight: 800, color: tierColors[selected] }}>{p.newVotes.toLocaleString()}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 10, color: C.white }}>Projected Total</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: C.green }}>{p.starlingTotal}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Side-by-side comparison */}
      <Card C={C}>
        <SectionTitle C={C}>Side-by-Side Comparison</SectionTitle>
        <div style={{ overflowX: "auto" as const }}>
          <table style={{ width: "100%", borderCollapse: "collapse" as const, fontSize: 11 }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left" as const, padding: "8px 12px", color: C.muted, fontWeight: 600, borderBottom: `1px solid ${C.border}` }}>Metric</th>
                {STARLING_TIERS.map((t, i) => (
                  <th key={t.id} style={{ textAlign: "center" as const, padding: "8px 12px", color: tierColors[i], fontWeight: 700, borderBottom: `1px solid ${C.border}` }}>
                    ${(t.total / 1000).toFixed(0)}K {t.recommended ? "★" : ""}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Unique Voters", "uniqueVoters"],
                ["Avg Frequency", "frequency"],
                ["Digital Impressions", "digitalImpressions"],
                ["Voter File Contacts", "siteIdContacts"],
                ["Estimated New Votes", "newVotes"],
                ["Cost Per Vote", "costPerVote"],
              ].map(([label, key]) => (
                <tr key={key} style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: "8px 12px", color: C.white }}>{label}</td>
                  {STARLING_TIERS.map((t, i) => (
                    <td key={t.id} style={{ padding: "8px 12px", textAlign: "center" as const, color: tierColors[i], fontWeight: 600 }}>
                      {(t.metrics as any)[key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ── TAB: CTV Universe ─────────────────────────────────────────────────────────
function TabCTVUniverse({ mobile, C }: { mobile: boolean; C: C }) {
  const [filter, setFilter] = useState("all");
  const tiers = ["all", "premium", "news", "sports", "entertainment", "lifestyle"];
  const filtered = filter === "all" ? STARLING_CTV_CHANNELS : STARLING_CTV_CHANNELS.filter((ch: any) => ch.tier === filter);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Why CTV */}
      <Card C={C}>
        <SectionTitle C={C}>Why CTV Wins This Race</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "repeat(3,1fr)", gap: 12 }}>
          {[
            { icon: "🎯", title: "Voter-Level Targeting", desc: "We match your voter file to streaming households. Your ad only runs in front of identified, named undecided Republican primary voters — not a general audience." },
            { icon: "📺", title: "74 Premium Channels", desc: "From Fox News to Hallmark to ESPN — we reach your voters wherever they stream, across every device in the household." },
            { icon: "💰", title: "No Wasted Spend", desc: "Traditional broadcast TV buys the whole market. CTV buys only the voters you need. Every impression is a targeted voter impression." },
          ].map(item => (
            <div key={item.title} style={{ background: C.bg3, borderRadius: 10, padding: 14 }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{item.icon}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.white, marginBottom: 6 }}>{item.title}</div>
              <div style={{ fontSize: 12, color: C.white, lineHeight: 1.5 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Channel Filter */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const }}>
        {tiers.map(t => (
          <button key={t} onClick={() => setFilter(t)} style={{
            background: filter === t ? C.accent2 : C.card,
            border: `1px solid ${filter === t ? C.accent2 : C.border}`,
            color: filter === t ? "#fff" : C.muted,
            borderRadius: 20, padding: "5px 14px", fontSize: 11, fontWeight: 600, cursor: "pointer", textTransform: "capitalize" as const,
          }}>{t === "all" ? `All (${STARLING_CTV_CHANNELS.length})` : t}</button>
        ))}
      </div>

      {/* Channel Grid */}
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr 1fr" : "repeat(4,1fr)", gap: 8 }}>
        {filtered.map((ch: any) => (
          <div key={ch.name} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 12px", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: ch.color, flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: C.white, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{ch.name}</div>
              <div style={{ fontSize: 9, color: C.white, textTransform: "capitalize" as const }}>{ch.tier}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Digital Channels */}
      <Card C={C}>
        <SectionTitle C={C}>Digital Channels — Included at All Tiers</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 10 }}>
          {STARLING_DIGITAL_CHANNELS.map((ch: any) => (
            <div key={ch.name} style={{ background: C.bg3, borderRadius: 8, padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: C.white }}>{ch.name}</div>
                <div style={{ fontSize: 10, color: C.white }}>{ch.desc}</div>
              </div>
              <div style={{ fontSize: 9, color: ch.color, background: `${ch.color}18`, border: `1px solid ${ch.color}30`, borderRadius: 8, padding: "2px 8px", fontWeight: 700 }}>{ch.type}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Ad Creatives */}
      <Card C={C}>
        <SectionTitle C={C}>Proposed Ad Concepts</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 12 }}>
          {STARLING_CREATIVES.map((cr: any) => (
            <div key={cr.title} style={{ background: C.bg3, borderRadius: 10, padding: 14, borderLeft: `3px solid ${C.accent2}` }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.white, marginBottom: 4 }}>{cr.title}</div>
              <div style={{ fontSize: 11, color: C.white, lineHeight: 1.5, marginBottom: 8 }}>{cr.hook}</div>
              <div style={{ fontSize: 10, color: C.accent2, fontStyle: "italic" as const }}>"{cr.cta}"</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ── TAB: 15-Day Action Plan ──────────────────────────────────────────────────
const ACTION_PLAN = [
  { day: "Jun 2",  phase: "Launch",     channel: "Digital", action: "Activate Meta + Google retargeting on jeffstarling.com visitors. Serve contrast creative: 'Career Politician vs. Real Attorney.'" },
  { day: "Jun 2",  phase: "Launch",     channel: "Email",   action: "Deploy first email blast to matched voter list: subject line 'The AG Race Is Closer Than You Think.' Include Echols tax vote record." },
  { day: "Jun 3",  phase: "Launch",     channel: "CTV",     action: "Begin CTV pre-roll on Hulu, Peacock, Paramount+. 30-sec bio spot. Target Oklahoma DMA households with GOP registration match." },
  { day: "Jun 4",  phase: "Build",      channel: "Digital", action: "Expand Exact Audience voter targeting: upload full 200K undecided voter list to Meta and Google. Activate lookalike audiences based on Starling's existing supporter base." },
  { day: "Jun 5",  phase: "Build",      channel: "Digital", action: "Launch paid search on 'oklahoma attorney general 2026', 'echols tax vote', 'jeff starling attorney'. Bid on Echols branded terms." },
  { day: "Jun 6",  phase: "Build",      channel: "Social",  action: "Release contrast video on Facebook/Instagram: Echols' 14-year career vs. Starling's courtroom record. Boost to undecided voter lookalike audience." },
  { day: "Jun 7",  phase: "Build",      channel: "Email",   action: "Second email: 'Who Is Jon Echols Really Working For?' — trial lawyer donation data, RINO framing, Starling's prosecutorial record." },
  { day: "Jun 8",  phase: "Accelerate", channel: "CTV",     action: "Rotate to contrast CTV spot: 'Echols voted to raise your taxes. Starling never will.' Increase frequency to 4x/week in OKC and Tulsa DMAs." },
  { day: "Jun 9",  phase: "Accelerate", channel: "Digital", action: "Segment Exact Audience voter list by county. Serve county-specific contrast ads: Oklahoma County, Tulsa County, Cleveland County each get tailored Echols contrast messaging." },
  { day: "Jun 10", phase: "Accelerate", channel: "Social",  action: "Deploy testimonial carousel ads: Oklahoma sheriffs, prosecutors, and business owners endorsing Starling. Target 45–65 male homeowners in top 8 counties." },
  { day: "Jun 11", phase: "Close",      channel: "Email",   action: "Third email: 'Five Days Left — Here's Why I'm Voting for Jeff Starling.' Personal tone. Include early voting reminder and polling location link." },
  { day: "Jun 12", phase: "Close",      channel: "CTV",     action: "Final CTV push: closing-argument spot. 'On June 16, Oklahoma chooses its next AG. Choose the attorney who's never stopped fighting for you.' Max frequency." },
  { day: "Jun 13", phase: "Close",      channel: "Digital", action: "Surge digital spend 40%. Retarget every voter who visited jeffstarling.com more than once. Serve 'Polls Close at 7PM' urgency creative." },
  { day: "Jun 14", phase: "Close",      channel: "Social",  action: "Final Facebook/Instagram push. 'Two days left.' GOTV creative. Remind early voters. Boost to all matched voter segments simultaneously." },
  { day: "Jun 15", phase: "GOTV",       channel: "All",     action: "Full GOTV day. Email: 'Tomorrow is Election Day.' CTV: 'Vote Tomorrow.' Digital: polling location finder ads. Social: shareable 'I'm voting for Jeff Starling' graphic." },
  { day: "Jun 16", phase: "GOTV",       channel: "All",     action: "Election Day. Morning digital surge 6AM–9AM. Midday reminder 11AM–1PM. Final push 4PM–6:30PM. All channels on maximum frequency. Polls close 7PM CT." },
];
const PHASE_COLORS: Record<string, string> = { Launch: "#6366f1", Build: "#14b8a6", Accelerate: "#d4a017", Close: "#a855f7", GOTV: "#10b981" };
const CHANNEL_COLORS: Record<string, string> = { Digital: "#38bdf8", Email: "#10b981", CTV: "#a855f7", Social: "#818cf8", All: "#f59e0b" };

function TabActionPlan({ mobile, C }: { mobile: boolean; C: C }) {
  const [filter, setFilter] = useState("All");
  const phases = ["All", "Launch", "Build", "Accelerate", "Close", "GOTV"];
  const filtered = filter === "All" ? ACTION_PLAN : ACTION_PLAN.filter(a => a.phase === filter);
  const today = new Date();
  const electionDay = new Date("2026-06-17T00:00:00Z");
  const daysLeft = Math.max(0, Math.ceil((electionDay.getTime() - today.getTime()) / 86400000));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ background: `${C.accent}12`, border: `1px solid ${C.accent2}30`, borderRadius: 12, padding: "16px 20px", display: "flex", flexDirection: mobile ? "column" : "row", justifyContent: "space-between", alignItems: mobile ? "flex-start" : "center", gap: 12 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 800, color: C.white, marginBottom: 4 }}>15-Day Closing Sprint — June 2 to June 16</div>
          <div style={{ fontSize: 12, color: C.white, lineHeight: 1.5 }}>Every action, every channel, every day. This is the playbook that wins the race for Jeff Starling.</div>
        </div>
        <div style={{ textAlign: "center", background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 20px", flexShrink: 0 }}>
          <div style={{ fontSize: 28, fontWeight: 900, color: C.gold, lineHeight: 1 }}>{daysLeft}</div>
          <div style={{ fontSize: 10, color: C.white, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.08em" }}>Days to Polls Closing</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const }}>
        {phases.map(p => (
          <button key={p} onClick={() => setFilter(p)} style={{ padding: "5px 14px", borderRadius: 20, fontSize: 11, fontWeight: 600, cursor: "pointer", border: "1px solid", background: filter === p ? (PHASE_COLORS[p] ?? C.accent) : "transparent", color: filter === p ? "#fff" : C.white, borderColor: filter === p ? (PHASE_COLORS[p] ?? C.accent) : C.border }}>{p}</button>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {filtered.map((item, i) => {
          const phaseColor = PHASE_COLORS[item.phase] ?? C.accent;
          const channelColor = CHANNEL_COLORS[item.channel] ?? C.muted;
          const isED = item.day === "Jun 16";
          return (
            <div key={i} style={{ display: "flex", gap: 0, borderLeft: `3px solid ${i === filtered.length - 1 ? "transparent" : phaseColor}30`, marginLeft: 12, paddingBottom: 4 }}>
              <div style={{ position: "relative", marginLeft: -8, marginRight: 16, flexShrink: 0 }}>
                <div style={{ width: 14, height: 14, borderRadius: "50%", background: isED ? C.gold : phaseColor, border: `2px solid ${C.bg}`, boxShadow: isED ? `0 0 8px ${C.gold}` : undefined, marginTop: 14 }} />
              </div>
              <div style={{ flex: 1, background: isED ? `${C.gold}10` : C.card, border: `1px solid ${isED ? C.gold + "40" : C.border}`, borderRadius: 10, padding: "12px 16px", marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" as const }}>
                  <span style={{ fontSize: 12, fontWeight: 800, color: isED ? C.gold : C.white }}>{item.day}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: phaseColor, background: `${phaseColor}18`, padding: "2px 8px", borderRadius: 10 }}>{item.phase}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: channelColor, background: `${channelColor}18`, padding: "2px 8px", borderRadius: 10 }}>{item.channel}</span>
                  {isED && <span style={{ fontSize: 10, fontWeight: 700, color: C.gold, background: `${C.gold}20`, padding: "2px 8px", borderRadius: 10 }}>🗳 ELECTION DAY</span>}
                </div>
                <div style={{ fontSize: 12, color: C.white, lineHeight: 1.6 }}>{item.action}</div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 16px" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.white, marginBottom: 8, textTransform: "uppercase" as const, letterSpacing: "0.06em" }}>Phase Legend</div>
        <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 12 }}>
          {Object.entries(PHASE_COLORS).map(([phase, color]) => (
            <div key={phase} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: color }} />
              <span style={{ fontSize: 11, color: C.white }}>{phase}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── TAB: Undecided Voters ─────────────────────────────────────────────────────
function TabUndecidedVoters({ mobile, C }: { mobile: boolean; C: C }) {
  const [voters, setVoters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");
  const [homeFilter, setHomeFilter] = useState("all");
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 50;

  useEffect(() => {
    fetch("/starling_undecided_voters.json")
      .then(r => r.json())
      .then(d => { setVoters(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const cities = ["all", ...Array.from(new Set(voters.map(v => v.city).filter(Boolean))).sort().slice(0, 20)];
  const filtered = voters.filter(v => {
    const q = search.toLowerCase();
    const matchSearch = !q || `${v.firstName} ${v.lastName} ${v.city} ${v.email}`.toLowerCase().includes(q);
    const matchCity = cityFilter === "all" || v.city === cityFilter;
    const matchGender = genderFilter === "all" || v.gender === genderFilter;
    const matchHome = homeFilter === "all" || (homeFilter === "yes" ? v.homeowner === "Yes" : v.homeowner !== "Yes");
    return matchSearch && matchCity && matchGender && matchHome;
  });
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ background: `${C.accent}10`, border: `1px solid ${C.accent2}30`, borderRadius: 12, padding: "14px 18px" }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: C.white, marginBottom: 4 }}>Statewide Undecided Voter Universe</div>
        <div style={{ fontSize: 12, color: C.white, lineHeight: 1.5 }}>
          Every voter below is identified by name, address, and behavioral data. This is a sample of the statewide undecided Republican primary voter universe available for targeting. Search, filter, and explore.
        </div>
      </div>

      {/* Spotlight: 3 High-Priority Voters */}
      <div style={{ fontSize: 12, fontWeight: 700, color: C.white, marginBottom: -4 }}>High-Priority Targets — 30-Day Signal Journey</div>
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "repeat(3,1fr)", gap: 12 }}>
        {[
          {
            name: "Sandra M.", city: "Edmond", age: 52, gender: "F", income: "$110K–$130K",
            tag: "High-Intent Undecided", tagColor: C.gold,
            summary: "Has visited jeffstarling.com twice and jonechols.com once. Spent 4m 12s on Starling's bio page. Read an Oklahoman opinion piece and searched 'echols tax record.' One more exposure likely converts her.",
            signals: [
              { date: "May 3",  icon: "📺", text: "Watched News 9 segment: 'Oklahoma AG Race Heats Up'" },
              { date: "May 9",  icon: "🔍", text: "Searched 'echols tax vote oklahoma 2021'" },
              { date: "May 14", icon: "🌐", text: "Visited jeffstarling.com — spent 4m 12s on bio page" },
              { date: "May 19", icon: "📰", text: "Read Oklahoman opinion: 'Who Should Be Oklahoma's Next AG?'" },
              { date: "May 22", icon: "🌐", text: "Visited jonechols.com — spent 1m 08s, bounced" },
              { date: "May 27", icon: "📱", text: "Engaged with Starling Facebook post (liked, did not share)" },
              { date: "May 30", icon: "🌐", text: "Returned to jeffstarling.com — read policy page" },
            ],
          },
          {
            name: "Robert T.", city: "Broken Arrow", age: 61, gender: "M", income: "$85K–$100K",
            tag: "RINO-Skeptic", tagColor: C.teal,
            summary: "Searched 'jon echols RINO' and 'echols trial lawyer money' in the same session. Visited a Reddit thread on r/oklahoma and watched a Newsmax segment. Has not yet visited Starling's site — a single retargeted CTV ad would introduce him directly.",
            signals: [
              { date: "May 5",  icon: "📺", text: "Watched Newsmax segment on Oklahoma primary races" },
              { date: "May 11", icon: "🔍", text: "Searched 'jon echols RINO oklahoma'" },
              { date: "May 11", icon: "🔍", text: "Searched 'echols trial lawyer donations'" },
              { date: "May 16", icon: "💬", text: "Read Reddit r/oklahoma thread: 'Who are you voting for AG?'" },
              { date: "May 21", icon: "📰", text: "Read Tulsa World article on AG candidate backgrounds" },
              { date: "May 25", icon: "📺", text: "Watched News On 6 story: 'AG Candidates Debate Record'" },
              { date: "May 29", icon: "🔍", text: "Searched 'jeff starling attorney oklahoma'" },
            ],
          },
          {
            name: "Patricia W.", city: "Norman", age: 47, gender: "F", income: "$70K–$85K",
            tag: "Persuadable Swing", tagColor: C.purple,
            summary: "Visited both candidate websites on the same day. Spent more time on Starling's site (3m 44s vs 1m 22s). Searched 'oklahoma ag race 2026' three separate times across two weeks — she is actively building a case. Frequency will close her.",
            signals: [
              { date: "May 7",  icon: "🔍", text: "Searched 'oklahoma attorney general race 2026'" },
              { date: "May 12", icon: "📺", text: "Watched News On 6: 'Meet the Candidates for Oklahoma AG'" },
              { date: "May 17", icon: "🌐", text: "Visited jeffstarling.com (3m 44s) and jonechols.com (1m 22s) same session" },
              { date: "May 20", icon: "💬", text: "Read Reddit thread: 'Thoughts on Jeff Starling for AG?'" },
              { date: "May 23", icon: "🔍", text: "Searched 'oklahoma ag race 2026' again" },
              { date: "May 26", icon: "📱", text: "Watched Starling campaign video on Facebook (85% completion)" },
              { date: "May 31", icon: "🔍", text: "Searched 'jeff starling vs echols' — third AG search in two weeks" },
            ],
          },
        ].map((voter, vi) => (
          <div key={vi} style={{ background: C.card, border: `1px solid ${voter.tagColor}40`, borderRadius: 12, padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: C.white }}>{voter.name}</div>
                <div style={{ fontSize: 11, color: C.white }}>{voter.city} · Age {voter.age} · {voter.gender === "F" ? "Female" : "Male"} · {voter.income}</div>
              </div>
              <span style={{ fontSize: 9, fontWeight: 700, color: voter.tagColor, background: `${voter.tagColor}20`, border: `1px solid ${voter.tagColor}40`, borderRadius: 10, padding: "3px 8px", whiteSpace: "nowrap" as const }}>{voter.tag}</span>
            </div>
            <div style={{ fontSize: 11, color: C.white, lineHeight: 1.6 }}>{voter.summary}</div>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.white, textTransform: "uppercase" as const, letterSpacing: "0.06em" }}>30-Day Signal Journey</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {voter.signals.map((s, si) => (
                <div key={si} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>{s.icon}</span>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 9, color: voter.tagColor, fontWeight: 700, marginRight: 6 }}>{s.date}</span>
                    <span style={{ fontSize: 11, color: C.white }}>{s.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 11, fontWeight: 700, color: C.white, textTransform: "uppercase" as const, letterSpacing: "0.08em", padding: "4px 0" }}>Full Undecided Voter Universe</div>

      {/* Filters */}
      <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 8 }}>
        <input value={search} onChange={e => { setSearch(e.target.value); setPage(0); }} placeholder="Search name, city, email..." style={{ flex: 1, minWidth: 180, background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", fontSize: 11, color: C.white, outline: "none" }} />
        <select value={cityFilter} onChange={e => { setCityFilter(e.target.value); setPage(0); }} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", fontSize: 11, color: C.white, cursor: "pointer" }}>
          {cities.map(c => <option key={c} value={c}>{c === "all" ? "All Cities" : c}</option>)}
        </select>
        <select value={genderFilter} onChange={e => { setGenderFilter(e.target.value); setPage(0); }} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", fontSize: 11, color: C.white, cursor: "pointer" }}>
          <option value="all">All Genders</option>
          <option value="F">Female</option>
          <option value="M">Male</option>
        </select>
        <select value={homeFilter} onChange={e => { setHomeFilter(e.target.value); setPage(0); }} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", fontSize: 11, color: C.white, cursor: "pointer" }}>
          <option value="all">All Homeowners</option>
          <option value="yes">Homeowners Only</option>
          <option value="no">Non-Homeowners</option>
        </select>
      </div>

      <div style={{ fontSize: 11, color: C.white }}>{search || cityFilter !== "all" || genderFilter !== "all" || homeFilter !== "all" ? `${filtered.length.toLocaleString()} voters match your filters` : "Showing all matched undecided voters"}</div>

      {loading ? (
        <div style={{ textAlign: "center" as const, padding: 40, color: C.white }}>Loading voter universe...</div>
      ) : (
        <div style={{ overflowX: "auto" as const }}>
          <table style={{ width: "100%", borderCollapse: "collapse" as const, fontSize: 10 }}>
            <thead>
              <tr style={{ background: C.bg3 }}>
                {["Name", "City", "State", "Age", "G", "Married", "Homeowner", "Income", "Net Worth", "Credit", "Mobile", "Email", "Company", "DB"].map(h => (
                  <th key={h} style={{ padding: "8px 10px", textAlign: "left" as const, color: C.white, fontWeight: 600, borderBottom: `1px solid ${C.border}`, whiteSpace: "nowrap" as const }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.map((v, i) => (
                <tr key={v.id ?? i} style={{ borderBottom: `1px solid ${C.border}`, background: i % 2 === 0 ? "transparent" : `${C.bg3}50` }}>
                  <td style={{ padding: "7px 10px", color: C.white, fontWeight: 600, whiteSpace: "nowrap" as const }}>{v.firstName} {v.lastName}</td>
                  <td style={{ padding: "7px 10px", color: C.white, whiteSpace: "nowrap" as const }}>{v.city}</td>
                  <td style={{ padding: "7px 10px", color: C.white }}>{v.state}</td>
                  <td style={{ padding: "7px 10px", color: C.white }}>{v.age}</td>
                  <td style={{ padding: "7px 10px", color: C.white }}>{v.gender}</td>
                  <td style={{ padding: "7px 10px", color: C.white }}>{v.married}</td>
                  <td style={{ padding: "7px 10px", color: v.homeowner === "Yes" ? C.green : C.white }}>{v.homeowner}</td>
                  <td style={{ padding: "7px 10px", color: C.white, whiteSpace: "nowrap" as const }}>{v.income}</td>
                  <td style={{ padding: "7px 10px", color: C.white, whiteSpace: "nowrap" as const }}>{v.netWorth}</td>
                  <td style={{ padding: "7px 10px" }}>
                    <span style={{ fontSize: 9, fontWeight: 700, color: v.creditRating === "A" ? C.green : v.creditRating === "B" ? C.blue2 : C.muted, background: `${v.creditRating === "A" ? C.green : v.creditRating === "B" ? C.blue2 : C.muted}18`, borderRadius: 4, padding: "2px 6px" }}>{v.creditRating}</span>
                  </td>
                  <td style={{ padding: "7px 10px", color: C.white, whiteSpace: "nowrap" as const }}>{v.mobile ? "✓" : "—"}</td>
                  <td style={{ padding: "7px 10px", color: C.white, maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{v.email}</td>
                  <td style={{ padding: "7px 10px", color: C.white, maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{v.company}</td>
                  <td style={{ padding: "7px 10px", color: C.accent2, fontWeight: 700 }}>{v.dbMatches}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 8 }}>
          <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} style={{ background: C.card, border: `1px solid ${C.border}`, color: C.white, borderRadius: 6, padding: "6px 14px", fontSize: 11, cursor: page === 0 ? "not-allowed" : "pointer", opacity: page === 0 ? 0.4 : 1 }}>← Prev</button>
          <span style={{ fontSize: 11, color: C.white, padding: "6px 0" }}>Page {page + 1} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1} style={{ background: C.card, border: `1px solid ${C.border}`, color: C.white, borderRadius: 6, padding: "6px 14px", fontSize: 11, cursor: page === totalPages - 1 ? "not-allowed" : "pointer", opacity: page === totalPages - 1 ? 0.4 : 1 }}>Next →</button>
        </div>
      )}
    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────────────────────
const TABS = ["Overview", "Voter Universe", "What We Can Do", "CTV Universe", "15-Day Plan", "Undecided Voters"];

export default function StarlingDashboard() {
  const mobile = useMobile();
  const [darkMode, setDarkMode] = useState(true);
  const [tab, setTab] = useState(0);
  const C = darkMode ? DARK_C : LIGHT_C;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.white, fontFamily: "'Inter', sans-serif" }}>
      {/* Nav */}
      <div style={{ background: C.bg2, borderBottom: `1px solid ${C.border}`, padding: "0 16px", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, height: 56, maxWidth: 1200, margin: "0 auto" }}>
          <a href="/campaigns" style={{ display: "flex", alignItems: "center", gap: 6, background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 8, padding: "6px 12px", fontSize: 11, color: C.muted, textDecoration: "none", flexShrink: 0 }}>← Campaigns</a>
          {!mobile && <img src="/ea-logo.png" alt="Exact Audience" style={{ height: 22, maxWidth: 130, objectFit: "contain" }} />}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.gold, flexShrink: 0 }} />
              <span style={{ fontSize: mobile ? 11 : 13, fontWeight: 700, color: C.white, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>Jeff Starling — AG Race</span>
              <LiveBadge C={C} />
            </div>
          </div>
          <button onClick={() => setDarkMode(d => !d)} style={{ background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 8, padding: "6px 12px", fontSize: 11, color: C.muted, cursor: "pointer", flexShrink: 0 }}>
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
          <button onClick={() => { localStorage.removeItem("ea_auth"); window.location.href = "/"; }} style={{ background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 8, padding: "6px 12px", fontSize: 11, color: C.muted, cursor: "pointer", flexShrink: 0 }}>Log Out</button>
        </div>
      </div>

      {/* Tab Bar */}
      <div style={{ background: C.bg2, borderBottom: `1px solid ${C.border}`, overflowX: "auto" as const }}>
        <div style={{ display: "flex", maxWidth: 1200, margin: "0 auto", padding: "0 16px" }}>
          {TABS.map((t, i) => (
            <button key={t} onClick={() => setTab(i)} style={{
              background: "transparent", border: "none", borderBottom: `2px solid ${tab === i ? C.accent2 : "transparent"}`,
              color: tab === i ? C.accent2 : C.muted, padding: "14px 16px", fontSize: mobile ? 11 : 12, fontWeight: 600,
              cursor: "pointer", whiteSpace: "nowrap" as const, transition: "all 0.15s",
            }}>{t}</button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: mobile ? "16px 12px" : "24px 16px" }}>
        {tab === 0 && <TabOverview mobile={mobile} C={C} />}
        {tab === 1 && <TabVoterUniverse mobile={mobile} C={C} />}
        {tab === 2 && <TabWhatWeCanDo mobile={mobile} C={C} />}
        {tab === 3 && <TabCTVUniverse mobile={mobile} C={C} />}
        {tab === 4 && <TabActionPlan mobile={mobile} C={C} />}
        {tab === 5 && <TabUndecidedVoters mobile={mobile} C={C} />}
      </div>
    </div>
  );
}
