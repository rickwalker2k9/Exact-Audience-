/**
 * GovernorDashboard.tsx
 * 2026 Oklahoma Republican Governor's Primary — EA Intelligence Dashboard
 * Tabs: Overview | Drummond | Keating | McCall | Path to Win
 * Source: Intelligence Report by Rick Walker, June 7, 2026
 */

import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useTheme } from "../contexts/ThemeContext";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
} from "recharts";
import {
  GOV_RACE, GOV_POLLING, GOV_CANDIDATES, GOV_VOTER_MIGRATION,
  GOV_PATH_TO_WIN, GOV_TIMELINE, GOV_STRATEGIC,
} from "@/lib/govData";

// ── Theme ─────────────────────────────────────────────────────────────────────
function useColors(isDark: boolean) {
  return isDark ? {
    bg: "#07090f", bg2: "#0a0d18", bg3: "#0d1020",
    card: "#0d1120", card2: "#111828", border: "#1e2d45",
    accent: "#f59e0b", accent2: "#fbbf24", accent3: "#fcd34d",
    blue: "#fb923c", green: "#f59e0b", purple: "#ffffff", orange: "#f97316",
    white: "#ffffff", muted: "#ffffff",
    headerBg: "linear-gradient(135deg,#07090f,#0d1a2e,#0a1628)",
    tooltipBg: "#111828",
    drummond: "#fb923c",
    keating: "#f59e0b",
    mccall: "#ffffff",
    mazzei: "#f97316",
  } : {
    bg: "#f0f4f8", bg2: "#e4ecf4", bg3: "#d8e4f0",
    card: "#ffffff", card2: "#f4f8fc", border: "#b8cce0",
    accent: "#d97706", accent2: "#b45309", accent3: "#92400e",
    blue: "#f97316", green: "#059669", purple: "#ffffff", orange: "#ea580c",
    white: "#0f1e35", muted: "#5a7090",
    headerBg: "linear-gradient(135deg,#07090f,#0d1a2e,#0a1628)",
    tooltipBg: "#ffffff",
    drummond: "#f97316",
    keating: "#059669",
    mccall: "#ffffff",
    mazzei: "#ea580c",
  };
}
type C = ReturnType<typeof useColors>;

function useIsMobile() {
  const [m, setM] = useState(window.innerWidth < 768);
  useEffect(() => { const fn = () => setM(window.innerWidth < 768); window.addEventListener("resize", fn); return () => window.removeEventListener("resize", fn); }, []);
  return m;
}

function fmt(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(0) + "K";
  return n.toLocaleString();
}

// ── Sub-components ────────────────────────────────────────────────────────────
function Card({ children, style, C }: { children: React.ReactNode; style?: React.CSSProperties; C: C }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, ...style }}>
      {children}
    </div>
  );
}

function SectionTitle({ children, C }: { children: React.ReactNode; C: C }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ width: 3, height: 14, background: C.accent, borderRadius: 2, display: "inline-block", flexShrink: 0, opacity: 0.8 }} />
      {children}
    </div>
  );
}

function KpiCard({ label, value, sub, color, C }: { label: string; value: string; sub?: string; color: string; C: C }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "18px 20px", borderTop: `3px solid ${color}` }}>
      <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 800, color: C.white, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: C.muted, marginTop: 6 }}>{sub}</div>}
    </div>
  );
}

function PollBar({ candidate, pct, color, trump, C }: { candidate: string; pct: number; color: string; trump: boolean; C: C }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: C.white }}>{candidate}</span>
          {trump && (
            <span style={{ fontSize: 9, fontWeight: 800, background: "#f59e0b", color: "#fff", padding: "1px 6px", borderRadius: 4, letterSpacing: "0.05em" }}>TRUMP ✓</span>
          )}
        </div>
        <span style={{ fontSize: 14, fontWeight: 800, color }}>{pct}%</span>
      </div>
      <div style={{ background: C.bg3, borderRadius: 4, height: 8, overflow: "hidden" }}>
        <div style={{ width: `${(pct / 30) * 100}%`, background: color, height: "100%", borderRadius: 4, transition: "width 0.8s ease" }} />
      </div>
    </div>
  );
}

function StatusBadge({ status, color }: { status: string; color: string }) {
  return (
    <span style={{ fontSize: 10, fontWeight: 700, background: `${color}20`, color, border: `1px solid ${color}40`, padding: "3px 10px", borderRadius: 20, letterSpacing: "0.06em", textTransform: "uppercase" }}>
      {status}
    </span>
  );
}

// ── TAB: Overview ─────────────────────────────────────────────────────────────
function TabOverview({ mobile, C }: { mobile: boolean; C: C }) {
  const topFour = GOV_POLLING.filter(p => ["Mike Mazzei", "Gentner Drummond", "Chip Keating", "Charles McCall"].includes(p.candidate));
  const minor = GOV_POLLING.filter(p => p.status === "minor");

  const barData = topFour.map(p => ({ name: p.candidate.split(" ").pop(), pct: p.pct, fill: p.color }));

  const timelineEvents = GOV_TIMELINE.filter(e => e.type !== "report");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Race Summary Banner */}
      <div style={{ background: "linear-gradient(135deg,#0d1a2e,#0a1628)", border: `1px solid ${C.border}`, borderRadius: 14, padding: "20px 24px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontSize: 10, color: C.accent, textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 700, marginBottom: 6 }}>Intelligence Report · Rick Walker · June 7, 2026</div>
            <div style={{ fontSize: mobile ? 18 : 22, fontWeight: 900, color: "#ffffff", lineHeight: 1.2, marginBottom: 8 }}>
              2026 Oklahoma Republican<br />Governor's Primary
            </div>
            <div style={{ fontSize: 13, color: "#ffffff", maxWidth: 520 }}>{GOV_RACE.summary}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
            <div style={{ background: "#e85d0420", border: "1px solid #e85d0460", borderRadius: 10, padding: "10px 16px", textAlign: "center" }}>
              <div style={{ fontSize: 9, color: "#f59e0b", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>Trump Endorsed</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#ffffff", marginTop: 2 }}>Mike Mazzei</div>
              <div style={{ fontSize: 10, color: "#ffffff" }}>May 29, 2026</div>
            </div>
            <div style={{ background: "#1a56db20", border: "1px solid #1a56db60", borderRadius: 10, padding: "8px 16px", textAlign: "center" }}>
              <div style={{ fontSize: 9, color: "#fbbf24", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>Most Likely Runoff</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#ffffff", marginTop: 2 }}>Mazzei vs. Drummond</div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Row */}
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 12 }}>
        <KpiCard label="Days to Primary" value="9" sub="June 16, 2026" color={C.accent} C={C} />
        <KpiCard label="Registered Republicans" value="900K+" sub="Statewide Oklahoma" color={C.blue} C={C} />
        <KpiCard label="Expected Turnout" value="~400K" sub="Historical ~40-50% of registered" color={C.green} C={C} />
        <KpiCard label="Win Threshold" value="200,001" sub="50%+1 — runoff if no one hits 50%" color={C.purple} C={C} />
      </div>

      {/* Polling + Chart */}
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 16 }}>
        <Card C={C}>
          <SectionTitle C={C}>Current Polling — May 26, 2026</SectionTitle>
          <div style={{ marginBottom: 8 }}>
            {topFour.map(p => (
              <PollBar key={p.candidate} candidate={p.candidate} pct={p.pct} color={p.color} trump={p.trump} C={C} />
            ))}
          </div>
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 10, marginTop: 4 }}>
            <div style={{ fontSize: 10, color: C.muted, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Minor Candidates</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {minor.map(p => (
                <span key={p.candidate} style={{ fontSize: 11, color: C.muted, background: C.bg3, padding: "3px 8px", borderRadius: 6 }}>
                  {p.candidate.split(" ").pop()}: {p.pct}%
                </span>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 10, fontSize: 10, color: C.muted, fontStyle: "italic" }}>
            Source: NonDoc / Independent Survey, May 26, 2026
          </div>
        </Card>

        <Card C={C}>
          <SectionTitle C={C}>Top 4 — Visual Comparison</SectionTitle>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} barSize={40}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="name" tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 30]} unit="%" />
              <Tooltip
                contentStyle={{ background: C.tooltipBg, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 11 }}
                formatter={(v: number) => [`${v}%`, "Polling"]}
              />
              {barData.map((d, i) => (
                <Bar key={i} dataKey="pct" fill={d.fill} radius={[4, 4, 0, 0]}>
                  {barData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Bar>
              ))}
            </BarChart>
          </ResponsiveContainer>
          <div style={{ marginTop: 8, background: `${C.accent}15`, border: `1px solid ${C.accent}30`, borderRadius: 8, padding: "8px 12px" }}>
            <div style={{ fontSize: 11, color: C.accent, fontWeight: 700 }}>⚠ Dead Heat</div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>All 4 candidates within 3.7 points. Margin of error encompasses entire spread. Race decided by turnout and late-stage persuasion.</div>
          </div>
        </Card>
      </div>

      {/* Runoff Projection */}
      <Card C={C}>
        <SectionTitle C={C}>Primary Projections — Post-Trump Endorsement</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 12, marginBottom: 16 }}>
          {[
            { name: "Mazzei", low: 26, high: 32, color: C.mazzei, note: "Trump boost from 22.1% base", qualifier: true },
            { name: "Drummond", low: 22, high: 26, color: C.drummond, note: "Institutional floor, flat polling", qualifier: true },
            { name: "Keating", low: 20, high: 24, color: C.keating, note: "Needs debate breakout" },
            { name: "McCall", low: 16, high: 20, color: C.mccall, note: "Declining trajectory" },
          ].map(c => (
            <div key={c.name} style={{ background: C.bg3, borderRadius: 10, padding: 14, borderLeft: `3px solid ${c.color}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.white }}>{c.name}</span>
                {c.qualifier && <span style={{ fontSize: 9, fontWeight: 700, background: `${c.color}25`, color: c.color, padding: "2px 6px", borderRadius: 4 }}>RUNOFF</span>}
              </div>
              <div style={{ fontSize: 22, fontWeight: 900, color: c.color }}>{c.low}–{c.high}%</div>
              <div style={{ fontSize: 10, color: C.muted, marginTop: 4 }}>{c.note}</div>
            </div>
          ))}
        </div>
        <div style={{ background: `${C.blue}10`, border: `1px solid ${C.blue}30`, borderRadius: 10, padding: "12px 16px" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.blue, marginBottom: 4 }}>Most Probable Runoff: Mazzei vs. Drummond — August 25, 2026</div>
          <div style={{ fontSize: 12, color: C.muted }}>Structural math in a runoff favors Mazzei if he absorbs the majority of Keating's outsider voters. Drummond's path requires consolidating McCall's establishment base. The pool of voters to persuade numbers in the <strong style={{ color: C.white }}>several hundred thousand</strong>.</div>
        </div>
      </Card>

      {/* Timeline */}
      <Card C={C}>
        <SectionTitle C={C}>Key Events Timeline</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {timelineEvents.map((e, i) => (
            <div key={i} style={{ display: "flex", gap: 16, paddingBottom: i < timelineEvents.length - 1 ? 16 : 0 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: e.type === "endorsement" ? "#f59e0b" : e.type === "election" ? C.accent : e.type === "runoff" ? C.blue : C.muted, flexShrink: 0, marginTop: 3 }} />
                {i < timelineEvents.length - 1 && <div style={{ width: 1, flex: 1, background: C.border, marginTop: 4 }} />}
              </div>
              <div style={{ paddingBottom: 4 }}>
                <div style={{ fontSize: 10, color: C.muted, marginBottom: 2 }}>{e.date}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.white, marginBottom: 3 }}>{e.event}</div>
                <div style={{ fontSize: 11, color: C.muted }}>{e.impact}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ── Candidate Tab Component ───────────────────────────────────────────────────
function CandidateTab({ candidateKey, mobile, C }: { candidateKey: "drummond" | "keating" | "mccall"; mobile: boolean; C: C }) {
  const cd = GOV_CANDIDATES[candidateKey];
  const colorMap: Record<string, string> = { drummond: C.drummond, keating: C.keating, mccall: C.mccall };
  const color = colorMap[candidateKey];

  // Radar data for candidate profile
  const radarData = [
    { subject: "Name ID", value: candidateKey === "drummond" ? 92 : candidateKey === "keating" ? 58 : 72 },
    { subject: "Funding", value: candidateKey === "drummond" ? 78 : candidateKey === "keating" ? 35 : 95 },
    { subject: "Infrastructure", value: candidateKey === "drummond" ? 85 : candidateKey === "keating" ? 30 : 88 },
    { subject: "Debate Perf.", value: candidateKey === "drummond" ? 72 : candidateKey === "keating" ? 90 : 65 },
    { subject: "Momentum", value: candidateKey === "drummond" ? 45 : candidateKey === "keating" ? 55 : 38 },
    { subject: "Voter Breadth", value: candidateKey === "drummond" ? 80 : candidateKey === "keating" ? 42 : 60 },
  ];

  // Voter migration pie for this candidate in runoff
  const migrationData = GOV_VOTER_MIGRATION.map(pool => ({
    name: pool.pool,
    toCandidate: candidateKey === "drummond"
      ? Math.round((pool.toDrummond.low + pool.toDrummond.high) / 2)
      : candidateKey === "keating"
      ? Math.round((pool.toMazzei.low + pool.toMazzei.high) / 2 * 0.3) // Keating voters go to Mazzei mostly
      : Math.round((pool.toDrummond.low + pool.toDrummond.high) / 2 * 0.6),
    color: pool.pool === "Keating Voters" ? C.keating : pool.pool === "McCall Voters" ? C.mccall : C.muted,
  }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Candidate Header */}
      <div style={{ background: `linear-gradient(135deg,${color}15,${color}05)`, border: `1px solid ${color}40`, borderRadius: 14, padding: "20px 24px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontSize: 10, color, textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 700, marginBottom: 4 }}>Candidate Profile</div>
            <div style={{ fontSize: mobile ? 22 : 28, fontWeight: 900, color: C.white, lineHeight: 1.1, marginBottom: 4 }}>{cd.name}</div>
            <div style={{ fontSize: 13, color: C.muted, marginBottom: 10 }}>{cd.title}</div>
            <StatusBadge status={cd.status} color={color} />
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.1em" }}>Current Polling</div>
            <div style={{ fontSize: 42, fontWeight: 900, color, lineHeight: 1 }}>{cd.polling}%</div>
            <div style={{ fontSize: 11, color: C.muted }}>NonDoc / May 26, 2026</div>
          </div>
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 16 }}>
        <Card C={C}>
          <SectionTitle C={C}>Strengths</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {cd.strengths.map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ color: C.green, fontSize: 14, flexShrink: 0, marginTop: 1 }}>✓</span>
                <span style={{ fontSize: 13, color: C.white }}>{s}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card C={C}>
          <SectionTitle C={C}>Vulnerabilities</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {cd.weaknesses.map((w, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ color: "#f59e0b", fontSize: 14, flexShrink: 0, marginTop: 1 }}>✗</span>
                <span style={{ fontSize: 13, color: C.white }}>{w}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Path to Win */}
      <Card C={C}>
        <SectionTitle C={C}>Path to Win</SectionTitle>
        <div style={{ fontSize: 13, color: C.muted, marginBottom: 16, lineHeight: 1.6 }}>{cd.pathToWin.description}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
          {cd.pathToWin.steps.map((step, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, background: C.bg3, borderRadius: 8, padding: "10px 14px" }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: `${color}20`, border: `1px solid ${color}50`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color }}>{i + 1}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.white }}>{step.label}</div>
                <div style={{ fontSize: 11, color: C.muted }}>{step.note}</div>
              </div>
              <div style={{ fontSize: 14, fontWeight: 800, color }}>{step.value}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={{ background: `${color}10`, border: `1px solid ${color}30`, borderRadius: 10, padding: "12px 16px" }}>
            <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Primary Projection</div>
            <div style={{ fontSize: 22, fontWeight: 900, color }}>{cd.pathToWin.primaryProjection}</div>
          </div>
          <div style={{ background: `${color}10`, border: `1px solid ${color}30`, borderRadius: 10, padding: "12px 16px" }}>
            <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Runoff Projection</div>
            <div style={{ fontSize: 16, fontWeight: 800, color, lineHeight: 1.2 }}>{cd.pathToWin.runoffProjection}</div>
          </div>
        </div>
      </Card>

      {/* Need to Persuade */}
      <Card C={C}>
        <SectionTitle C={C}>Need to Persuade</SectionTitle>
        <div style={{ background: `${color}08`, border: `1px solid ${color}25`, borderRadius: 10, padding: "14px 18px", marginBottom: 14 }}>
          <div style={{ fontSize: 12, color: C.muted, marginBottom: 4 }}>Persuadable Voter Pool</div>
          <div style={{ fontSize: 20, fontWeight: 900, color }}>{cd.needToPersuade.universe}</div>
          <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>Targetable via behavioral data across CTV, digital, and OTT platforms</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 10 }}>
          {Object.entries(cd.needToPersuade)
            .filter(([k]) => k !== "universe" && k !== "keyMessage")
            .map(([key, val]) => (
              <div key={key} style={{ background: C.bg3, borderRadius: 8, padding: "10px 14px" }}>
                <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>
                  {key.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase())}
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.white }}>{val as string}</div>
              </div>
            ))}
        </div>
        <div style={{ marginTop: 12, background: `${C.accent}10`, border: `1px solid ${C.accent}30`, borderRadius: 8, padding: "10px 14px" }}>
          <div style={{ fontSize: 10, color: C.accent, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>Key Message</div>
          <div style={{ fontSize: 13, color: C.white }}>{cd.needToPersuade.keyMessage}</div>
        </div>
      </Card>

      {/* Candidate Radar */}
      <Card C={C}>
        <SectionTitle C={C}>Campaign Strength Profile</SectionTitle>
        <ResponsiveContainer width="100%" height={240}>
          <RadarChart data={radarData}>
            <PolarGrid stroke={C.border} />
            <PolarAngleAxis dataKey="subject" tick={{ fill: C.muted, fontSize: 10 }} />
            <Radar name={cd.name} dataKey="value" stroke={color} fill={color} fillOpacity={0.2} />
            <Tooltip contentStyle={{ background: C.tooltipBg, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 11 }} />
          </RadarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

// ── TAB: Path to Win ──────────────────────────────────────────────────────────
function TabPathToWin({ mobile, C }: { mobile: boolean; C: C }) {
  const p = GOV_PATH_TO_WIN;

  const runoffBar = [
    { name: "Mazzei", base: 104, keating: 52, mccall: 22, minor: 14, total: 192, color: C.mazzei },
    { name: "Drummond", base: 88, keating: 19, mccall: 36, minor: 12, total: 155, color: C.drummond },
  ];

  const migrationPie = [
    { name: "Keating → Mazzei (60-65%)", value: 52, color: C.mazzei },
    { name: "Keating → Drummond (20-25%)", value: 19, color: C.drummond },
    { name: "Keating → Undecided (15%)", value: 13, color: C.muted },
    { name: "McCall → Drummond (50-55%)", value: 36, color: C.drummond },
    { name: "McCall → Mazzei (30-35%)", value: 22, color: C.mazzei },
    { name: "McCall → Undecided (15%)", value: 11, color: C.muted },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Strategic Overview */}
      <div style={{ background: "linear-gradient(135deg,#0d1a2e,#0a1628)", border: `1px solid ${C.border}`, borderRadius: 14, padding: "20px 24px" }}>
        <div style={{ fontSize: 10, color: C.accent, textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 700, marginBottom: 6 }}>Strategic Imperative</div>
        <div style={{ fontSize: mobile ? 16 : 20, fontWeight: 800, color: "#ffffff", marginBottom: 8 }}>{GOV_STRATEGIC.headline}</div>
        <div style={{ fontSize: 13, color: "#ffffff", lineHeight: 1.6, maxWidth: 680 }}>{GOV_STRATEGIC.summary}</div>
        <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 8 }}>
          {GOV_STRATEGIC.channels.map(ch => (
            <span key={ch} style={{ fontSize: 11, fontWeight: 600, background: `${C.accent}15`, color: C.accent, border: `1px solid ${C.accent}30`, padding: "4px 10px", borderRadius: 6 }}>{ch}</span>
          ))}
        </div>
      </div>

      {/* Runoff Math */}
      <Card C={C}>
        <SectionTitle C={C}>Runoff Vote Math — Mazzei vs. Drummond (Aug 25)</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 16, marginBottom: 16 }}>
          {runoffBar.map(c => (
            <div key={c.name} style={{ background: C.bg3, borderRadius: 10, padding: 16, borderTop: `3px solid ${c.color}` }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: C.white, marginBottom: 12 }}>{c.name}</div>
              {[
                { label: "Own primary base", value: c.base, color: c.color },
                { label: "Absorbed from Keating", value: c.keating, color: C.keating },
                { label: "Absorbed from McCall", value: c.mccall, color: C.mccall },
                { label: "Minor candidate voters", value: c.minor, color: C.muted },
              ].map(row => (
                <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: 11, color: C.muted }}>{row.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: row.color }}>{fmt(row.value * 1000)}</span>
                </div>
              ))}
              <div style={{ borderTop: `1px solid ${C.border}`, marginTop: 8, paddingTop: 8, display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: C.white }}>Projected Total</span>
                <span style={{ fontSize: 16, fontWeight: 900, color: c.color }}>{fmt(c.total * 1000)}</span>
              </div>
              <div style={{ background: C.bg2, borderRadius: 6, height: 6, overflow: "hidden", marginTop: 8 }}>
                <div style={{ width: `${(c.total / 200) * 100}%`, background: c.color, height: "100%", borderRadius: 6 }} />
              </div>
              <div style={{ fontSize: 10, color: C.muted, marginTop: 4 }}>Win threshold: 200,001 votes</div>
            </div>
          ))}
        </div>
        <div style={{ background: `${C.mazzei}10`, border: `1px solid ${C.mazzei}30`, borderRadius: 10, padding: "12px 16px" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.mazzei, marginBottom: 4 }}>Structural Math Favors Mazzei</div>
          <div style={{ fontSize: 12, color: C.muted }}>Mazzei projects ~192K votes vs. Drummond's ~155K in the runoff — assuming he absorbs 60-65% of Keating's outsider voters. Drummond needs McCall voters to consolidate heavily AND needs Keating voters to split more evenly than expected.</div>
        </div>
      </Card>

      {/* Voter Migration Analysis */}
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 16 }}>
        <Card C={C}>
          <SectionTitle C={C}>Voter Migration Model</SectionTitle>
          {GOV_VOTER_MIGRATION.map((pool, i) => (
            <div key={i} style={{ marginBottom: 16, paddingBottom: i < GOV_VOTER_MIGRATION.length - 1 ? 16 : 0, borderBottom: i < GOV_VOTER_MIGRATION.length - 1 ? `1px solid ${C.border}` : "none" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.white, marginBottom: 8 }}>
                {pool.pool} <span style={{ fontSize: 11, color: C.muted, fontWeight: 400 }}>({pool.poolPct}% of electorate)</span>
              </div>
              {[
                { label: "→ Mazzei", range: `${pool.toMazzei.low}–${pool.toMazzei.high}%`, color: C.mazzei },
                { label: "→ Drummond", range: `${pool.toDrummond.low}–${pool.toDrummond.high}%`, color: C.drummond },
                { label: "→ Undecided", range: `~${pool.undecided}%`, color: C.muted },
              ].map(row => (
                <div key={row.label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: C.muted }}>{row.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: row.color }}>{row.range}</span>
                </div>
              ))}
              <div style={{ fontSize: 11, color: C.muted, marginTop: 6, fontStyle: "italic", lineHeight: 1.5 }}>{pool.rationale}</div>
            </div>
          ))}
        </Card>

        <Card C={C}>
          <SectionTitle C={C}>Need to Persuade — Runoff Window</SectionTitle>
          <div style={{ background: `${C.accent}10`, border: `1px solid ${C.accent}30`, borderRadius: 10, padding: "14px 18px", marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: C.accent, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Persuadable Voter Pool</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: C.white }}>Several Hundred Thousand</div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>Keating + McCall soft supporters targetable via behavioral data</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { label: "Target Group", value: "Keating & McCall soft supporters", color: C.accent },
              { label: "Channels", value: "CTV, Digital, OTT Platforms", color: C.blue },
              { label: "Window", value: "First 2 weeks of runoff", color: C.green },
              { label: "Approach", value: "Real-time behavioral data model", color: C.purple },
              { label: "Why Not Broadcast TV", value: "Inefficient — can't target specific voters", color: "#f59e0b" },
            ].map(row => (
              <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: C.bg3, borderRadius: 8, padding: "8px 12px" }}>
                <span style={{ fontSize: 11, color: C.muted }}>{row.label}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: row.color, textAlign: "right", maxWidth: "55%" }}>{row.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Primary Scenario Summary */}
      <Card C={C}>
        <SectionTitle C={C}>Primary Scenario — June 16 Projections</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 12 }}>
          {[
            { name: "Mazzei", low: p.primaryProjections.mazzei.low, high: p.primaryProjections.mazzei.high, votes_low: p.primaryProjections.mazzei.votes_low, votes_high: p.primaryProjections.mazzei.votes_high, note: p.primaryProjections.mazzei.note, color: C.mazzei },
            { name: "Drummond", low: p.primaryProjections.drummond.low, high: p.primaryProjections.drummond.high, votes_low: p.primaryProjections.drummond.votes_low, votes_high: p.primaryProjections.drummond.votes_high, note: p.primaryProjections.drummond.note, color: C.drummond },
            { name: "Keating", low: p.primaryProjections.keating.low, high: p.primaryProjections.keating.high, votes_low: p.primaryProjections.keating.votes_low, votes_high: p.primaryProjections.keating.votes_high, note: p.primaryProjections.keating.note, color: C.keating },
            { name: "McCall", low: p.primaryProjections.mccall.low, high: p.primaryProjections.mccall.high, votes_low: p.primaryProjections.mccall.votes_low, votes_high: p.primaryProjections.mccall.votes_high, note: p.primaryProjections.mccall.note, color: C.mccall },
          ].map(c => (
            <div key={c.name} style={{ background: C.bg3, borderRadius: 10, padding: 14, borderLeft: `3px solid ${c.color}` }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.white, marginBottom: 6 }}>{c.name}</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: c.color }}>{c.low}–{c.high}%</div>
              <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{fmt(c.votes_low)}–{fmt(c.votes_high)} votes</div>
              <div style={{ fontSize: 10, color: C.muted, marginTop: 6, fontStyle: "italic" }}>{c.note}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, background: `${C.accent}10`, border: `1px solid ${C.accent}30`, borderRadius: 8, padding: "10px 14px" }}>
          <div style={{ fontSize: 11, color: C.accent, fontWeight: 700 }}>⚠ Runoff Highly Probable</div>
          <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>No candidate projected to clear 50%+1 (200,001 votes). Top 2 advance to August 25 runoff. Keating and McCall voter migration determines the winner.</div>
        </div>
      </Card>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
const TABS = ["Overview", "Drummond", "Keating", "McCall", "Path to Win"];

export default function GovernorDashboard() {
  const [tab, setTab] = useState(0);
  const [time, setTime] = useState(new Date());
  const mobile = useIsMobile();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const C = useColors(isDark);
  const [, navigate] = useLocation();

  useEffect(() => { const id = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(id); }, []);

  const tabColors = ["", C.drummond, C.keating, C.mccall, C.accent];

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{ background: C.headerBg, borderBottom: `1px solid ${C.border}`, padding: mobile ? "14px 16px" : "16px 28px", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => navigate("/")} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: 20, padding: 0, lineHeight: 1 }}>←</button>
            <div>
              <div style={{ fontSize: 10, color: C.accent, textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 700 }}>Exact Audience · Intelligence Dashboard</div>
              <div style={{ fontSize: mobile ? 14 : 17, fontWeight: 800, color: "#ffffff", lineHeight: 1.2 }}>
                2026 Oklahoma Governor's Race
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 10, color: C.muted }}>Primary</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.accent }}>June 16, 2026</div>
            </div>
            <div style={{ width: 1, height: 28, background: C.border }} />
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 10, color: C.muted }}>Days Out</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: "#ffffff" }}>9</div>
            </div>
            <button onClick={toggleTheme} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "6px 10px", cursor: "pointer", color: C.muted, fontSize: 14 }}>
              {isDark ? "☀" : "◑"}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginTop: 14, overflowX: "auto", paddingBottom: 2 }}>
          {TABS.map((t, i) => (
            <button key={t} onClick={() => setTab(i)} style={{
              padding: "6px 14px", fontSize: 11, fontWeight: 700, borderRadius: 8, cursor: "pointer", whiteSpace: "nowrap",
              border: `1px solid ${tab === i ? (tabColors[i] || C.accent) : C.border}`,
              background: tab === i ? `${tabColors[i] || C.accent}18` : "transparent",
              color: tab === i ? (tabColors[i] || C.accent) : C.muted,
              transition: "all 0.15s",
            }}>{t}</button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: mobile ? "16px" : "24px 28px", maxWidth: 1200, margin: "0 auto" }}>
        {tab === 0 && <TabOverview mobile={mobile} C={C} />}
        {tab === 1 && <CandidateTab candidateKey="drummond" mobile={mobile} C={C} />}
        {tab === 2 && <CandidateTab candidateKey="keating" mobile={mobile} C={C} />}
        {tab === 3 && <CandidateTab candidateKey="mccall" mobile={mobile} C={C} />}
        {tab === 4 && <TabPathToWin mobile={mobile} C={C} />}
      </div>

      {/* Footer */}
      <div style={{ borderTop: `1px solid ${C.border}`, padding: "12px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <div style={{ fontSize: 10, color: C.muted }}>Intelligence Report by Rick Walker · June 7, 2026 · Source: NonDoc/Independent Survey, May 26, 2026</div>
        <div style={{ fontSize: 10, color: C.muted }}>{time.toLocaleTimeString()}</div>
      </div>

      <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
    </div>
  );
}
