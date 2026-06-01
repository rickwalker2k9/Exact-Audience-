/**
 * StarlingDashboard.tsx
 * Jeff Starling for Oklahoma Attorney General — June 16, 2026 Republican Primary
 * Exact Audience Campaign Intelligence Dashboard
 * Tabs: Overview · Voter Intelligence · Media Universe · Budget Tiers · Site Traffic · Pitch Narrative · Undecided Voters
 */
import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useTheme } from "../contexts/ThemeContext";
import { getNetworkLogo, getNetworkInitials } from "../lib/networkLogos";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  ReferenceLine
} from "recharts";
import {
  STARLING_RACE, STARLING_TIERS, STARLING_VOTER_DEMO, STARLING_MOODS,
  STARLING_VISITORS, STARLING_CTV_CHANNELS, STARLING_DIGITAL_CHANNELS,
  STARLING_SITE_TRAFFIC, STARLING_TIMELINE, STARLING_CREATIVES,
  STARLING_INTELLIGENCE, STARLING_EA_ADVANTAGE, STARLING_QR,
  STARLING_CAMPAIGN_START, STARLING_ELECTION_DATE, STARLING_TOTAL_DAYS
} from "@/lib/starlingData";

// ── Theme ─────────────────────────────────────────────────────────────────────
// Starling palette: deep navy + gold accent + blue — NO RED
function useColors(isDark: boolean) {
  return isDark ? {
    bg: "#080c18", bg2: "#0a0e1c", bg3: "#0f1525",
    card: "#0d1120", card2: "#111828", border: "#1e2d45",
    accent: "#d4a017", accent2: "#e8b820", accent3: "#f5cc44",
    blue: "#4da6e8", blue2: "#60b8f5", blue3: "#93d0fa",
    green: "#2dd4bf", gold: "#d4a017", purple: "#a855f7",
    white: "#e8eef6", muted: "#8fa4c0",
    headerBg: "linear-gradient(135deg,#07090f,#0d1a2e)",
    tooltipBg: "#111828", scrollTrack: "#0c0f1a", scrollThumb: "#1a2540",
  } : {
    bg: "#f0f4f8", bg2: "#e4ecf4", bg3: "#d8e4f0",
    card: "#ffffff", card2: "#f4f8fc", border: "#b8cce0",
    accent: "#b8860b", accent2: "#c9970d", accent3: "#d4a017",
    blue: "#1a4f7a", blue2: "#2a6496", blue3: "#3a85c0",
    green: "#0d9488", gold: "#b8860b", purple: "#7c3aed",
    white: "#0f1e35", muted: "#5a7090",
    headerBg: "linear-gradient(135deg,#07090f,#0d1a2e)",
    tooltipBg: "#ffffff", scrollTrack: "#e4ecf4", scrollThumb: "#b8cce0",
  };
}
type C = ReturnType<typeof useColors>;

function useIsMobile() {
  const [m, setM] = useState(window.innerWidth < 768);
  useEffect(() => { const fn = () => setM(window.innerWidth < 768); window.addEventListener("resize", fn); return () => window.removeEventListener("resize", fn); }, []);
  return m;
}
function useTick(base: number, step: number, interval = 9000) {
  const [v, setV] = useState(base);
  useEffect(() => { const id = setInterval(() => setV(x => x + step), interval); return () => clearInterval(id); }, [step, interval]);
  return v;
}
function fmt(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toLocaleString();
}
function getCampaignDay() {
  const now = new Date();
  const start = STARLING_CAMPAIGN_START;
  const election = STARLING_ELECTION_DATE;
  const msPerDay = 86400000;
  const rawDay = Math.floor((now.getTime() - start.getTime()) / msPerDay) + 1;
  const dayNum = Math.max(1, Math.min(rawDay, STARLING_TOTAL_DAYS));
  const daysLeft = Math.max(0, Math.ceil((election.getTime() - now.getTime()) / msPerDay));
  const dailyBudget = 65000 / 18;
  const spentToDate = Math.round(dailyBudget * dayNum);
  const remainingBudget = Math.max(0, 65000 - spentToDate);
  const dailyImpressions = 172222;
  const cumulativeImpressions = dailyImpressions * dayNum;
  const votersReached = Math.round(cumulativeImpressions / 4.8);
  return { dayNum, daysLeft, spentToDate, remainingBudget, cumulativeImpressions, votersReached };
}

// ── Shared Components ─────────────────────────────────────────────────────────
function KpiCard({ label, value, sub, color, C }: { label: string; value: string; sub?: string; color: string; C: C }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "18px 20px", borderTop: `3px solid ${color}` }}>
      <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 800, color: C.white, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: C.muted, marginTop: 6 }}>{sub}</div>}
    </div>
  );
}
function SectionTitle({ children, C }: { children: React.ReactNode; C: C }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
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
function ProgressBar({ value, max, color, C }: { value: number; max: number; color?: string; C: C }) {
  return (
    <div style={{ background: C.bg3, borderRadius: 4, height: 6, overflow: "hidden" }}>
      <div style={{ width: `${Math.min(100, (value / max) * 100)}%`, background: color ?? C.blue2, height: "100%", borderRadius: 4, transition: "width 0.6s ease" }} />
    </div>
  );
}

// ── Live Voter Feed ───────────────────────────────────────────────────────────
function VoterFeed({ C }: { C: C }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => { const id = setInterval(() => setIdx(i => (i + 1) % STARLING_VISITORS.length), 4200); return () => clearInterval(id); }, []);
  const v = STARLING_VISITORS[idx];
  const intentColor = v.intent === "Undecided" ? C.muted : v.intent.includes("Moved") ? C.green : C.accent2;
  return (
    <Card C={C}>
      <SectionTitle C={C}>Live Voter Signal Feed</SectionTitle>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {STARLING_VISITORS.slice(0, 8).map((voter, i) => (
          <div key={voter.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 10, background: i === idx ? `${C.accent}12` : C.bg3, border: `1px solid ${i === idx ? C.accent2 + "44" : "transparent"}`, transition: "all 0.3s" }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: `${C.blue2}22`, border: `2px solid ${C.blue2}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: C.blue2, flexShrink: 0 }}>
              {voter.name.split(" ").map(n => n[0]).join("")}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.white }}>{voter.name} <span style={{ fontSize: 10, color: C.muted, fontWeight: 400 }}>· {voter.city}</span></div>
              <div style={{ fontSize: 10, color: C.muted, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{voter.signal}</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: intentColor, background: `${intentColor}18`, border: `1px solid ${intentColor}40`, borderRadius: 10, padding: "2px 8px", whiteSpace: "nowrap" }}>{voter.intent}</div>
              <div style={{ fontSize: 10, color: C.muted }}>Score: <strong style={{ color: voter.score >= 85 ? C.green : voter.score >= 75 ? C.accent2 : C.muted }}>{voter.score}</strong></div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── TAB: Overview ─────────────────────────────────────────────────────────────
function TabOverview({ mobile, C }: { mobile: boolean; C: C }) {
  const { cumulativeImpressions, votersReached, dayNum, daysLeft } = getCampaignDay();
  const impressions = useTick(cumulativeImpressions, 1200);
  const reach = useTick(votersReached, 22);

  const dailyData = STARLING_SITE_TRAFFIC.map(d => ({
    day: d.day.replace("Day ", "D"),
    Visitors: d.visitors,
    New: d.newVisitors,
  }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr 1fr" : "1fr 1fr 1fr 1fr", gap: 12 }}>
        <KpiCard label="Projected Impressions" value={fmt(impressions)} sub={`Day ${dayNum} of 18 · ${daysLeft} days left`} color={C.accent2} C={C} />
        <KpiCard label="Voters Reached" value={fmt(reach)} sub="4.8x avg frequency" color={C.blue2} C={C} />
        <KpiCard label="Undecided Universe" value="Statewide" sub="Named, matched individuals" color={C.green} C={C} />
        <KpiCard label="Reachable via Mobile/Email" value="93.8%" sub="93.8% with verified mobile" color={C.purple} C={C} />
      </div>

      {/* Race Context */}
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 12 }}>
        <Card C={C}>
          <SectionTitle C={C}>Race Snapshot — Starling vs. Echols</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { label: "Jeff Starling", pct: STARLING_RACE.currentPollingStarling, color: C.accent2 },
              { label: "Jon Echols", pct: STARLING_RACE.currentPollingEchols, color: C.blue2 },
              { label: "Undecided", pct: STARLING_RACE.undecided, color: C.muted },
            ].map(r => (
              <div key={r.label}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: C.white, fontWeight: 600 }}>{r.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 800, color: r.color }}>{r.pct}%</span>
                </div>
                <ProgressBar value={r.pct} max={100} color={r.color} C={C} />
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14, padding: "10px 14px", background: `${C.accent}12`, border: `1px solid ${C.accent2}33`, borderRadius: 10 }}>
            <div style={{ fontSize: 11, color: C.accent2, fontWeight: 700, marginBottom: 4 }}>The Opportunity</div>
            <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.6 }}>
              45% undecided in a 2-person race. Win threshold: ~116,000–142,000 votes. Starling needs to move roughly 70,000 voters in 18 days. Our statewide undecided universe is the starting point.
            </div>
          </div>
        </Card>
        <Card C={C}>
          <SectionTitle C={C}>Market Breakdown</SectionTitle>
          {STARLING_RACE.markets.map(m => (
            <div key={m.name} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: C.white, fontWeight: 600 }}>{m.name}</span>
                <span style={{ fontSize: 10, color: C.muted }}>{m.pct}% of turnout</span>
              </div>
              <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                <div style={{ flex: m.starling, background: C.accent2, borderRadius: 3, height: 8, minWidth: 4 }} />
                <div style={{ flex: m.echols, background: C.blue2, borderRadius: 3, height: 8, minWidth: 4 }} />
                <div style={{ flex: 100 - m.starling - m.echols, background: C.muted + "44", borderRadius: 3, height: 8, minWidth: 4 }} />
              </div>
              <div style={{ fontSize: 10, color: C.muted }}>{m.note}</div>
            </div>
          ))}
          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 10, height: 10, borderRadius: 2, background: C.accent2 }} /><span style={{ fontSize: 10, color: C.muted }}>Starling</span></div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 10, height: 10, borderRadius: 2, background: C.blue2 }} /><span style={{ fontSize: 10, color: C.muted }}>Echols</span></div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 10, height: 10, borderRadius: 2, background: C.muted + "44" }} /><span style={{ fontSize: 10, color: C.muted }}>Undecided</span></div>
          </div>
        </Card>
      </div>

      {/* Site Traffic Chart */}
      <Card C={C}>
        <SectionTitle C={C}>Campaign Site Traffic — Daily Visitors</SectionTitle>
        <ResponsiveContainer width="100%" height={mobile ? 180 : 220}>
          <AreaChart data={dailyData}>
            <defs>
              <linearGradient id="gVisitors" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={C.accent2} stopOpacity={0.4} />
                <stop offset="95%" stopColor={C.accent2} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gNew" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={C.blue2} stopOpacity={0.3} />
                <stop offset="95%" stopColor={C.blue2} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
            <XAxis dataKey="day" tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} width={35} />
            <Tooltip contentStyle={{ background: C.tooltipBg, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 11 }} />
            <Area type="monotone" dataKey="Visitors" stroke={C.accent2} fill="url(#gVisitors)" strokeWidth={2} />
            <Area type="monotone" dataKey="New" stroke={C.blue2} fill="url(#gNew)" strokeWidth={1.5} />
          </AreaChart>
        </ResponsiveContainer>
        <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 10, height: 3, background: C.accent2, borderRadius: 2 }} /><span style={{ fontSize: 10, color: C.muted }}>Total Visitors</span></div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 10, height: 3, background: C.blue2, borderRadius: 2 }} /><span style={{ fontSize: 10, color: C.muted }}>New Visitors</span></div>
        </div>
      </Card>

      {/* Voter Mood Segments */}
      <Card C={C}>
        <SectionTitle C={C}>Voter Mood Segments — Media Channel Mapping</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 12 }}>
          {STARLING_MOODS.map(m => (
            <div key={m.label} style={{ background: C.bg3, borderRadius: 10, padding: 14, borderLeft: `3px solid ${m.color}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: C.white }}>{m.label}</span>
                <span style={{ fontSize: 14, fontWeight: 900, color: m.color }}>{m.pct}%</span>
              </div>
              <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.5, marginBottom: 8 }}>{m.desc}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {m.channels.map(ch => (
                  <span key={ch} style={{ fontSize: 9, color: m.color, background: `${m.color}15`, border: `1px solid ${m.color}30`, borderRadius: 8, padding: "2px 7px" }}>{ch}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 18-Day Timeline */}
      <Card C={C}>
        <SectionTitle C={C}>18-Day Campaign Timeline</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {STARLING_TIMELINE.map((t, i) => (
            <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div style={{ width: 80, flexShrink: 0, fontSize: 10, fontWeight: 700, color: t.election ? C.green : C.accent2, paddingTop: 2 }}>{t.days}</div>
              <div style={{ width: 3, flexShrink: 0, background: t.election ? C.green : C.blue2, borderRadius: 2, alignSelf: "stretch", minHeight: 20 }} />
              <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.5 }}>{t.activity}</div>
            </div>
          ))}
        </div>
      </Card>

      <VoterFeed C={C} />
    </div>
  );
}

// ── TAB: Voter Intelligence ───────────────────────────────────────────────────
function TabVoterIntel({ mobile, C }: { mobile: boolean; C: C }) {
  const D = STARLING_VOTER_DEMO;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Intelligence KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 12 }}>
        {STARLING_INTELLIGENCE.map(item => (
          <div key={item.label} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px 18px", borderTop: `3px solid ${item.color}` }}>
            <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>{item.label}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: item.color }}>{item.value}</div>
          </div>
        ))}
      </div>

      {/* Gender + Age */}
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 16 }}>
        <Card C={C}>
          <SectionTitle C={C}>Gender Distribution</SectionTitle>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={D.gender} dataKey="value" cx="50%" cy="50%" outerRadius={70} innerRadius={40}>
                {D.gender.map((g, i) => <Cell key={i} fill={g.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: C.tooltipBg, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 11 }} formatter={(v: number) => [v.toLocaleString(), ""]} />
              <Legend formatter={(v) => <span style={{ fontSize: 11, color: C.muted }}>{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 4 }}>
            {D.gender.map(g => (
              <div key={g.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: g.color }} />
                <span style={{ fontSize: 11, color: C.muted }}>{g.label}: <strong style={{ color: C.white }}>{g.pct}%</strong></span>
              </div>
            ))}
          </div>
        </Card>
        <Card C={C}>
          <SectionTitle C={C}>Age Distribution</SectionTitle>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={D.ageRanges} barSize={48}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
              <XAxis dataKey="label" tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} width={35} />
              <Tooltip contentStyle={{ background: C.tooltipBg, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 11 }} formatter={(v: number) => [v.toLocaleString() + " voters", ""]} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {D.ageRanges.map((a, i) => <Cell key={i} fill={a.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{ fontSize: 11, color: C.muted, marginTop: 8, textAlign: "center" }}>100% of undecided voters are age 45+ — prime CTV audience</div>
        </Card>
      </div>

      {/* Income */}
      <Card C={C}>
        <SectionTitle C={C}>Income Distribution</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {D.income.map(inc => (
            <div key={inc.label}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: C.white }}>{inc.label}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: inc.color }}>{inc.value.toLocaleString()} <span style={{ fontSize: 10, color: C.muted }}>({inc.pct}%)</span></span>
              </div>
              <ProgressBar value={inc.pct} max={25} color={inc.color} C={C} />
            </div>
          ))}
        </div>
      </Card>

      {/* Top Cities + Homeowner/Married */}
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "2fr 1fr", gap: 16 }}>
        <Card C={C}>
          <SectionTitle C={C}>Top Cities — Undecided Voter Concentration</SectionTitle>
          {D.topCities.map((city, i) => (
            <div key={city.city} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: C.white }}>{i + 1}. {city.city}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: C.accent2 }}>{city.count.toLocaleString()} <span style={{ fontSize: 10, color: C.muted }}>({city.pct}%)</span></span>
              </div>
              <ProgressBar value={city.pct} max={20} color={i < 2 ? C.accent2 : i < 5 ? C.blue2 : C.muted} C={C} />
            </div>
          ))}
        </Card>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Card C={C} style={{ flex: 1 }}>
            <SectionTitle C={C}>Homeowners</SectionTitle>
            <div style={{ fontSize: 36, fontWeight: 900, color: C.green }}>{D.homeowner.yesPct}%</div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>{D.homeowner.yes.toLocaleString()} of {D.total.toLocaleString()} voters own their home</div>
            <div style={{ marginTop: 10 }}>
              <ProgressBar value={D.homeowner.yesPct} max={100} color={C.green} C={C} />
            </div>
          </Card>
          <Card C={C} style={{ flex: 1 }}>
            <SectionTitle C={C}>Married</SectionTitle>
            <div style={{ fontSize: 36, fontWeight: 900, color: C.blue2 }}>{D.married.yesPct}%</div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>{D.married.yes.toLocaleString()} of {D.total.toLocaleString()} voters are married</div>
            <div style={{ marginTop: 10 }}>
              <ProgressBar value={D.married.yesPct} max={100} color={C.blue2} C={C} />
            </div>
          </Card>
          <Card C={C} style={{ flex: 1 }}>
            <SectionTitle C={C}>Credit Rating</SectionTitle>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {D.creditRating.map(cr => (
                <div key={cr.grade} style={{ textAlign: "center", background: C.bg3, borderRadius: 8, padding: "6px 10px", border: `1px solid ${cr.color}40` }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: cr.color }}>{cr.grade}</div>
                  <div style={{ fontSize: 9, color: C.muted }}>{cr.count.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ── TAB: Media Universe ───────────────────────────────────────────────────────
function TabMediaUniverse({ mobile, C }: { mobile: boolean; C: C }) {
  const [tierFilter, setTierFilter] = useState<"all" | "top" | "mid" | "low">("all");
  const channels = tierFilter === "all" ? STARLING_CTV_CHANNELS : STARLING_CTV_CHANNELS.filter(ch => ch.tier === tierFilter);
  const totalImpressions = STARLING_CTV_CHANNELS.reduce((s, c) => s + c.impressions, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 12 }}>
        <KpiCard label="CTV Channels" value={STARLING_CTV_CHANNELS.length.toString()} sub="Full streaming universe" color={C.accent2} C={C} />
        <KpiCard label="Digital Channels" value={STARLING_DIGITAL_CHANNELS.length.toString()} sub="Display, video, social, audio" color={C.blue2} C={C} />
        <KpiCard label="Total CTV Impressions" value={fmt(totalImpressions)} sub="Projected at $65K tier" color={C.green} C={C} />
        <KpiCard label="Avg CPM" value="$18.44" sub="Across all CTV channels" color={C.purple} C={C} />
      </div>

      {/* Digital Channels */}
      <Card C={C}>
        <SectionTitle C={C}>Digital & Social Channels</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 10 }}>
          {STARLING_DIGITAL_CHANNELS.map(ch => (
            <div key={ch.name} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: C.bg3, borderRadius: 10, borderLeft: `3px solid ${ch.color}` }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.white }}>{ch.name}</div>
                <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{fmt(ch.impressions)} impressions · ${ch.cpm.toFixed(2)} CPM · {ch.ctr}% CTR</div>
              </div>
              <div style={{ fontSize: 10, color: ch.color, background: `${ch.color}18`, border: `1px solid ${ch.color}30`, borderRadius: 8, padding: "2px 8px", textTransform: "capitalize" }}>{ch.type}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* CTV Channel Grid */}
      <Card C={C}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
          <SectionTitle C={C}>CTV Channel Universe — {STARLING_CTV_CHANNELS.length} Channels</SectionTitle>
          <div style={{ display: "flex", gap: 4 }}>
            {(["all", "top", "mid", "low"] as const).map(t => (
              <button key={t} onClick={() => setTierFilter(t)} style={{ padding: "4px 10px", fontSize: 10, fontWeight: 700, borderRadius: 6, cursor: "pointer", border: `1px solid ${tierFilter === t ? C.accent2 : C.border}`, background: tierFilter === t ? `${C.accent2}18` : "transparent", color: tierFilter === t ? C.accent2 : C.muted, transition: "all 0.15s", textTransform: "capitalize" }}>{t}</button>
            ))}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: 8 }}>
          {channels.map(ch => {
            const logo = getNetworkLogo(ch.name);
            const initials = getNetworkInitials(ch.name);
            return (
              <div key={ch.name} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: C.bg3, borderRadius: 10, border: `1px solid ${C.border}` }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, overflow: "hidden", flexShrink: 0, background: `${ch.color}22`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {logo ? <img src={logo} alt={ch.name} style={{ width: "100%", height: "100%", objectFit: "contain" }} /> : <span style={{ fontSize: 9, fontWeight: 800, color: ch.color }}>{initials}</span>}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: C.white, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ch.name}</div>
                  <div style={{ fontSize: 9, color: C.muted }}>{fmt(ch.impressions)} impr · ${ch.cpm.toFixed(2)} CPM</div>
                </div>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: ch.tier === "top" ? C.green : ch.tier === "mid" ? C.accent2 : C.muted, flexShrink: 0 }} />
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 8, height: 8, borderRadius: "50%", background: C.green }} /><span style={{ fontSize: 10, color: C.muted }}>Top Tier</span></div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 8, height: 8, borderRadius: "50%", background: C.accent2 }} /><span style={{ fontSize: 10, color: C.muted }}>Mid Tier</span></div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 8, height: 8, borderRadius: "50%", background: C.muted }} /><span style={{ fontSize: 10, color: C.muted }}>Long Tail</span></div>
        </div>
      </Card>

      {/* Ad Creatives */}
      <Card C={C}>
        <SectionTitle C={C}>Ad Concepts — CTV :30 Scripts</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 16 }}>
          {STARLING_CREATIVES.map(cr => (
            <div key={cr.name} style={{ background: C.bg3, borderRadius: 12, padding: 16, borderTop: `3px solid ${cr.color}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: C.white }}>{cr.name}</div>
                <div style={{ fontSize: 10, color: cr.color, background: `${cr.color}18`, border: `1px solid ${cr.color}30`, borderRadius: 8, padding: "2px 8px" }}>{cr.focus} · {cr.length}</div>
              </div>
              <div style={{ fontSize: 10, color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{cr.note}</div>
              <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.7, fontStyle: "italic", borderLeft: `2px solid ${cr.color}44`, paddingLeft: 10 }}>
                &ldquo;{cr.script.substring(0, 200)}...&rdquo;
              </div>
              <div style={{ fontSize: 10, color: cr.color, marginTop: 8, fontWeight: 600 }}>{cr.tag}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ── TAB: Budget Tiers ─────────────────────────────────────────────────────────
function TabBudgetTiers({ mobile, C }: { mobile: boolean; C: C }) {
  const [activeTier, setActiveTier] = useState(1);
  const tier = STARLING_TIERS[activeTier];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Tier Selector */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        {STARLING_TIERS.map((t, i) => (
          <button key={t.id} onClick={() => setActiveTier(i)} style={{ background: activeTier === i ? `${t.color}18` : C.card, border: `2px solid ${activeTier === i ? t.color : C.border}`, borderRadius: 12, padding: "16px 12px", cursor: "pointer", textAlign: "center", transition: "all 0.2s" }}>
            <div style={{ fontSize: 10, color: t.color, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>{t.recommended ? "★ Recommended" : t.label}</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: C.white }}>${(t.total / 1000).toFixed(0)}K</div>
            <div style={{ fontSize: 10, color: C.muted, marginTop: 4 }}>{t.tagline.substring(0, 40)}...</div>
          </button>
        ))}
      </div>

      {/* Active Tier Detail */}
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 16 }}>
        <Card C={C}>
          <SectionTitle C={C}>Budget Breakdown — {tier.label} (${tier.total.toLocaleString()})</SectionTitle>
          {tier.components.map(comp => (
            <div key={comp.label} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: C.white }}>{comp.label}</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: tier.color }}>${comp.budget.toLocaleString()}</span>
              </div>
              <ProgressBar value={comp.budget} max={tier.total} color={tier.color} C={C} />
            </div>
          ))}
          {tier.warning && (
            <div style={{ marginTop: 12, padding: "10px 14px", background: `${C.accent}12`, border: `1px solid ${C.accent2}33`, borderRadius: 10, fontSize: 11, color: C.accent2 }}>
              ⚠️ {tier.warning}
            </div>
          )}
        </Card>
        <Card C={C}>
          <SectionTitle C={C}>Performance Metrics</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {Object.entries(tier.metrics).map(([key, val]) => (
              <div key={key} style={{ background: C.bg3, borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ fontSize: 9, color: C.muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>{key.replace(/([A-Z])/g, " $1").trim()}</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: C.white }}>{val}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Vote Projections */}
      <Card C={C}>
        <SectionTitle C={C}>Vote Projection Scenarios — {tier.label}</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr 1fr", gap: 12 }}>
          {tier.projections.map(proj => (
            <div key={proj.scenario} style={{ background: proj.highlight ? `${tier.color}12` : C.bg3, border: `1px solid ${proj.highlight ? tier.color + "44" : C.border}`, borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 10, color: proj.highlight ? tier.color : C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>{proj.scenario}{proj.highlight ? " ★" : ""}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div><span style={{ fontSize: 10, color: C.muted }}>Voters Reached: </span><strong style={{ fontSize: 12, color: C.white }}>{proj.votersReached.toLocaleString()}</strong></div>
                <div><span style={{ fontSize: 10, color: C.muted }}>Conversion Rate: </span><strong style={{ fontSize: 12, color: C.white }}>{proj.conversion}%</strong></div>
                <div><span style={{ fontSize: 10, color: C.muted }}>New Votes: </span><strong style={{ fontSize: 14, color: proj.highlight ? tier.color : C.white }}>{proj.newVotes.toLocaleString()}</strong></div>
                <div><span style={{ fontSize: 10, color: C.muted }}>Starling Total: </span><strong style={{ fontSize: 12, color: proj.highlight ? tier.color : C.white }}>{proj.starlingTotal}</strong></div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Side-by-Side Comparison */}
      <Card C={C}>
        <SectionTitle C={C}>Tier Comparison</SectionTitle>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                <th style={{ textAlign: "left", padding: "8px 12px", color: C.muted, fontWeight: 700, fontSize: 10, textTransform: "uppercase" }}>Metric</th>
                {STARLING_TIERS.map(t => <th key={t.id} style={{ textAlign: "center", padding: "8px 12px", color: t.color, fontWeight: 700, fontSize: 11 }}>{t.label}<br />${(t.total / 1000).toFixed(0)}K</th>)}
              </tr>
            </thead>
            <tbody>
              {[
                ["Unique Voters", "uniqueVoters"],
                ["Frequency", "frequency"],
                ["Persuasion Threshold", "persuasionThreshold"],
                ["Digital Impressions", "digitalImpressions"],
                ["SiteID Contacts", "siteIdContacts"],
                ["New Votes (Realistic)", "newVotes"],
                ["Projected Total", "projectedTotal"],
                ["Cost Per Vote", "costPerVote"],
              ].map(([label, key]) => (
                <tr key={key} style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: "8px 12px", color: C.muted, fontSize: 11 }}>{label}</td>
                  {STARLING_TIERS.map(t => <td key={t.id} style={{ textAlign: "center", padding: "8px 12px", color: C.white, fontSize: 11 }}>{t.metrics[key as keyof typeof t.metrics]}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ── TAB: Site Traffic ─────────────────────────────────────────────────────────
function TabSiteTraffic({ mobile, C }: { mobile: boolean; C: C }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 12 }}>
        <KpiCard label="Total Site Visitors" value={fmt(STARLING_SITE_TRAFFIC.reduce((s, d) => s + d.visitors, 0))} sub="Days 1–12" color={C.accent2} C={C} />
        <KpiCard label="Avg Daily Visitors" value={Math.round(STARLING_SITE_TRAFFIC.reduce((s, d) => s + d.visitors, 0) / STARLING_SITE_TRAFFIC.length).toLocaleString()} sub="Growing daily" color={C.blue2} C={C} />
        <KpiCard label="Avg Bounce Rate" value={Math.round(STARLING_SITE_TRAFFIC.reduce((s, d) => s + d.bounceRate, 0) / STARLING_SITE_TRAFFIC.length) + "%"} sub="Declining — good sign" color={C.green} C={C} />
        <KpiCard label="Avg Time on Site" value={(STARLING_SITE_TRAFFIC.reduce((s, d) => s + d.avgTime, 0) / STARLING_SITE_TRAFFIC.length).toFixed(1) + "m"} sub="Increasing engagement" color={C.purple} C={C} />
      </div>

      <Card C={C}>
        <SectionTitle C={C}>Daily Visitor Trend</SectionTitle>
        <ResponsiveContainer width="100%" height={mobile ? 200 : 260}>
          <AreaChart data={STARLING_SITE_TRAFFIC}>
            <defs>
              <linearGradient id="gVis" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={C.accent2} stopOpacity={0.4} />
                <stop offset="95%" stopColor={C.accent2} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gNewVis" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={C.blue2} stopOpacity={0.3} />
                <stop offset="95%" stopColor={C.blue2} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
            <XAxis dataKey="day" tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} width={40} />
            <Tooltip contentStyle={{ background: C.tooltipBg, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 11 }} />
            <Area type="monotone" dataKey="visitors" name="Total Visitors" stroke={C.accent2} fill="url(#gVis)" strokeWidth={2} />
            <Area type="monotone" dataKey="newVisitors" name="New Visitors" stroke={C.blue2} fill="url(#gNewVis)" strokeWidth={1.5} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 16 }}>
        <Card C={C}>
          <SectionTitle C={C}>Bounce Rate Trend</SectionTitle>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={STARLING_SITE_TRAFFIC}>
              <defs>
                <linearGradient id="gBounce" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.green} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={C.green} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="day" tick={{ fill: C.muted, fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: C.muted, fontSize: 9 }} axisLine={false} tickLine={false} width={30} domain={[20, 50]} />
              <Tooltip contentStyle={{ background: C.tooltipBg, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 11 }} formatter={(v: number) => [v + "%", "Bounce Rate"]} />
              <Area type="monotone" dataKey="bounceRate" name="Bounce Rate %" stroke={C.green} fill="url(#gBounce)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
          <div style={{ fontSize: 11, color: C.muted, marginTop: 8 }}>Declining bounce rate indicates improving message resonance</div>
        </Card>
        <Card C={C}>
          <SectionTitle C={C}>Avg Time on Site (minutes)</SectionTitle>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={STARLING_SITE_TRAFFIC} barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
              <XAxis dataKey="day" tick={{ fill: C.muted, fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: C.muted, fontSize: 9 }} axisLine={false} tickLine={false} width={30} domain={[0, 5]} />
              <Tooltip contentStyle={{ background: C.tooltipBg, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 11 }} formatter={(v: number) => [v + "m", "Avg Time"]} />
              <Bar dataKey="avgTime" fill={C.blue2} radius={[4, 4, 0, 0]} />
              <ReferenceLine y={3.0} stroke={C.accent2} strokeDasharray="4 3" strokeWidth={1.5} label={{ value: "3m threshold", position: "right", fill: C.accent2, fontSize: 9 }} />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ fontSize: 11, color: C.muted, marginTop: 8 }}>Visitors spending 3+ minutes are 4x more likely to convert</div>
        </Card>
      </div>

      {/* Traffic Data Table */}
      <Card C={C}>
        <SectionTitle C={C}>Daily Traffic Detail</SectionTitle>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                {["Day", "Total Visitors", "New Visitors", "Bounce Rate", "Avg Time"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "8px 12px", color: C.muted, fontWeight: 700, fontSize: 10, textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {STARLING_SITE_TRAFFIC.map((d, i) => (
                <tr key={d.day} style={{ borderBottom: `1px solid ${C.border}`, background: i % 2 === 0 ? "transparent" : `${C.bg3}` }}>
                  <td style={{ padding: "8px 12px", color: C.accent2, fontWeight: 700 }}>{d.day}</td>
                  <td style={{ padding: "8px 12px", color: C.white, fontWeight: 600 }}>{d.visitors.toLocaleString()}</td>
                  <td style={{ padding: "8px 12px", color: C.muted }}>{d.newVisitors.toLocaleString()}</td>
                  <td style={{ padding: "8px 12px", color: d.bounceRate < 30 ? C.green : C.muted }}>{d.bounceRate}%</td>
                  <td style={{ padding: "8px 12px", color: d.avgTime >= 3 ? C.blue2 : C.muted }}>{d.avgTime}m</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ── TAB: Pitch Narrative ──────────────────────────────────────────────────────
function TabPitchNarrative({ mobile, C }: { mobile: boolean; C: C }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* EA Advantage Cards */}
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr 1fr", gap: 12 }}>
        {STARLING_EA_ADVANTAGE.map(item => (
          <div key={item.title} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, borderTop: `3px solid ${item.color}` }}>
            <div style={{ fontSize: 22, marginBottom: 10 }}>
              {item.icon === "target" ? "🎯" : item.icon === "tv" ? "📺" : item.icon === "brain" ? "🧠" : item.icon === "phone" ? "📱" : item.icon === "dollar" ? "💰" : "📅"}
            </div>
            <div style={{ fontSize: 13, fontWeight: 800, color: item.color, marginBottom: 8 }}>{item.title}</div>
            <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.6 }}>{item.desc}</div>
          </div>
        ))}
      </div>

      {/* Why CTV */}
      <Card C={C}>
        <SectionTitle C={C}>Why CTV for This Race</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr 1fr", gap: 12 }}>
          {[
            { title: "Precision Targeting", desc: "We serve ads only to the undecided Republicans we have identified by name — not the general population. Every dollar goes to a persuadable voter.", color: C.accent2, icon: "🎯" },
            { title: "Unskippable Completion", desc: "CTV ads are non-skippable. Our 95%+ completion rate means every voter who sees the ad watches the full message. Traditional TV cannot guarantee this.", color: C.blue2, icon: "📺" },
            { title: "Cross-Device Retargeting", desc: "After a voter sees the CTV ad, we follow them to their phone, tablet, and desktop with reinforcing digital ads. The message compounds across every screen.", color: C.green, icon: "🔄" },
            { title: "Real-Time Optimization", desc: "Every 48 hours, we shift budget to the channels, ZIPs, and messages performing best. Traditional TV buys are locked in. Ours are not.", color: C.purple, icon: "⚡" },
            { title: "Behavioral Intelligence", desc: "We know what these voters watch, read, and search. We match their behavioral profile to the right message at the right moment — not just demographics.", color: C.accent3, icon: "🧠" },
            { title: "Measurable Results", desc: "We track site visits, behavioral signals, and voter movement in real time. You see exactly what is working and what is not — updated daily.", color: C.blue3, icon: "📊" },
          ].map(item => (
            <div key={item.title} style={{ background: C.bg3, borderRadius: 10, padding: 14 }}>
              <div style={{ fontSize: 20, marginBottom: 8 }}>{item.icon}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: item.color, marginBottom: 6 }}>{item.title}</div>
              <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.5 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* The Math */}
      <Card C={C}>
        <SectionTitle C={C}>The Math — Why $65K Can Win This Race</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 16 }}>
          <div>
            <div style={{ fontSize: 12, color: C.muted, marginBottom: 12, lineHeight: 1.7 }}>
              The win threshold is approximately <strong style={{ color: C.white }}>116,000–142,000 votes</strong>. Starling currently polls at roughly 46,000 votes. He needs to move approximately <strong style={{ color: C.accent2 }}>70,000 voters</strong> in 18 days.
            </div>
            <div style={{ fontSize: 12, color: C.muted, marginBottom: 12, lineHeight: 1.7 }}>
              Our identified undecided universe spans hundreds of thousands of voters statewide. At a realistic 12% conversion rate with 4–6x frequency, the direct moves from our universe alone are substantial.
            </div>
            <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.7 }}>
              But the real multiplier is the <strong style={{ color: C.white }}>broader CTV reach</strong>: 170,000–220,000 unique voters at the recommended tier. At 12% conversion, that is <strong style={{ color: C.accent2 }}>20,400–26,400 new votes</strong> — enough to close the gap.
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { label: "Current Starling Votes", value: "~46,000", color: C.accent2 },
              { label: "Win Threshold", value: "116,000–142,000", color: C.blue2 },
              { label: "Votes Needed", value: "~70,000", color: C.muted },
              { label: "Realistic New Votes ($65K)", value: "23,400–28,000", color: C.green },
              { label: "Cost Per New Vote", value: "$2.32–$2.78", color: C.purple },
              { label: "Undecided Universe Identified", value: "Statewide", color: C.accent3 },
            ].map(item => (
              <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: C.bg3, borderRadius: 10 }}>
                <span style={{ fontSize: 11, color: C.muted }}>{item.label}</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: item.color }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* About Exact Audience */}
      <Card C={C}>
        <SectionTitle C={C}>About Exact Audience</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "2fr 1fr", gap: 16 }}>
          <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.8 }}>
            <p style={{ marginBottom: 10 }}>Exact Audience is a behavioral intelligence and programmatic advertising firm specializing in political campaigns, automotive, and high-intent consumer categories. We combine first-party data matching, CTV/OTT delivery, and real-time optimization to reach the exact voters, buyers, and prospects that matter to our clients.</p>
            <p>Our SiteID technology identifies the individuals visiting your website and your competitors&apos; websites by name, address, and behavioral profile — then builds a custom media plan to reach them across 74+ CTV channels and every major digital platform.</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ background: C.bg3, borderRadius: 10, padding: 14, textAlign: "center" }}>
              <img src="/ea-logo.png" alt="Exact Audience" style={{ height: 40, objectFit: "contain", marginBottom: 8 }} />
              <div style={{ fontSize: 11, color: C.muted }}>exactaudience.ai</div>
              <div style={{ fontSize: 11, color: C.muted }}>siteid.ai</div>
            </div>
            <div style={{ background: C.bg3, borderRadius: 10, padding: 14 }}>
              <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Presented by</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.white }}>Rick Walker</div>
              <div style={{ fontSize: 11, color: C.muted }}>Exact Audience</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

// ── TAB: Undecided Voters ─────────────────────────────────────────────────────
type VoterRow = {
  "FIRST NAME": string; "LAST NAME": string; CITY: string; ST: string; ZIP: string;
  AGE: string; GENDER: string; MARRIED: string; CHILDREN: string; HOMEOWNER: string;
  "INCOME RANGE": string; "NET WORTH": string; "CREDIT RTG": string; EDUCATION: string;
  MOBILE: string; "PERS EMAIL": string; "CO NAME": string; "JOB TITLE": string; "DB MATCHES": string;
};

function TabUndecidedVoters({ mobile, C }: { mobile: boolean; C: C }) {
  const [voters, setVoters] = useState<VoterRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("All");
  const [genderFilter, setGenderFilter] = useState("All");
  const [homeFilter, setHomeFilter] = useState("All");
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 50;

  useEffect(() => {
    fetch("/starling_voters.json")
      .then(r => r.json())
      .then((data: VoterRow[]) => { setVoters(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const cities = ["All", ...Array.from(new Set(voters.map(v => v.CITY).filter(Boolean))).sort().slice(0, 20)];

  const filtered = voters.filter(v => {
    const q = search.toLowerCase();
    const matchSearch = !q || `${v["FIRST NAME"]} ${v["LAST NAME"]} ${v.CITY} ${v["PERS EMAIL"]}`.toLowerCase().includes(q);
    const matchCity = cityFilter === "All" || v.CITY === cityFilter;
    const matchGender = genderFilter === "All" || v.GENDER === genderFilter;
    const matchHome = homeFilter === "All" || v.HOMEOWNER === homeFilter;
    return matchSearch && matchCity && matchGender && matchHome;
  });

  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const creditColor = (g: string) => {
    if (g === "A") return C.green;
    if (g === "B") return C.blue2;
    if (g === "C") return C.accent2;
    if (g === "D" || g === "E") return C.muted;
    return C.muted;
  };

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300, color: C.muted, fontSize: 14 }}>
        Loading voter records...
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Summary KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 12 }}>
        <KpiCard label="Total Undecided Voters" value="Statewide" sub="Identified by name & address" color={C.accent2} C={C} />
        <KpiCard label="Showing" value={filtered.length.toLocaleString()} sub="Matching current filters" color={C.blue2} C={C} />
        <KpiCard label="With Mobile" value="93.8%" sub="Verified mobile number" color={C.green} C={C} />
        <KpiCard label="With Email" value="98.8%" sub="Personal email on file" color={C.purple} C={C} />
      </div>

      {/* Filters */}
      <Card C={C}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(0); }}
            placeholder="Search name, city, email..."
            style={{ flex: 1, minWidth: 200, padding: "8px 12px", background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 8, color: C.white, fontSize: 12, outline: "none" }}
          />
          <select value={cityFilter} onChange={e => { setCityFilter(e.target.value); setPage(0); }} style={{ padding: "8px 12px", background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 8, color: C.white, fontSize: 12 }}>
            {cities.map(c => <option key={c} value={c}>{c === "All" ? "All Cities" : c}</option>)}
          </select>
          <select value={genderFilter} onChange={e => { setGenderFilter(e.target.value); setPage(0); }} style={{ padding: "8px 12px", background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 8, color: C.white, fontSize: 12 }}>
            <option value="All">All Genders</option>
            <option value="F">Female</option>
            <option value="M">Male</option>
          </select>
          <select value={homeFilter} onChange={e => { setHomeFilter(e.target.value); setPage(0); }} style={{ padding: "8px 12px", background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 8, color: C.white, fontSize: 12 }}>
            <option value="All">All</option>
            <option value="Y">Homeowners</option>
            <option value="N">Renters</option>
          </select>
          {(search || cityFilter !== "All" || genderFilter !== "All" || homeFilter !== "All") && (
            <button onClick={() => { setSearch(""); setCityFilter("All"); setGenderFilter("All"); setHomeFilter("All"); setPage(0); }} style={{ padding: "8px 12px", background: `${C.accent2}18`, border: `1px solid ${C.accent2}44`, borderRadius: 8, color: C.accent2, fontSize: 12, cursor: "pointer" }}>
              Clear Filters
            </button>
          )}
        </div>
      </Card>

      {/* Voter Table */}
      <Card C={C} style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
            <thead>
              <tr style={{ background: C.bg3, borderBottom: `1px solid ${C.border}` }}>
                {["Name", "City", "Age", "G", "Married", "HO", "Income Range", "Net Worth", "Credit", "Mobile", "Email", "Company", "DB"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "10px 12px", color: C.muted, fontWeight: 700, fontSize: 10, textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map((v, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${C.border}`, background: i % 2 === 0 ? "transparent" : `${C.bg3}88` }}>
                  <td style={{ padding: "8px 12px", color: C.white, fontWeight: 600, whiteSpace: "nowrap" }}>{v["FIRST NAME"]} {v["LAST NAME"]}</td>
                  <td style={{ padding: "8px 12px", color: C.muted, whiteSpace: "nowrap" }}>{v.CITY}, {v.ST}</td>
                  <td style={{ padding: "8px 12px", color: C.muted, textAlign: "center" }}>{v.AGE}</td>
                  <td style={{ padding: "8px 12px", color: v.GENDER === "F" ? C.purple : C.blue2, fontWeight: 700, textAlign: "center" }}>{v.GENDER}</td>
                  <td style={{ padding: "8px 12px", color: v.MARRIED === "Y" ? C.green : C.muted, textAlign: "center" }}>{v.MARRIED}</td>
                  <td style={{ padding: "8px 12px", color: v.HOMEOWNER === "Y" ? C.accent2 : C.muted, textAlign: "center" }}>{v.HOMEOWNER}</td>
                  <td style={{ padding: "8px 12px", color: C.muted, whiteSpace: "nowrap" }}>{v["INCOME RANGE"]}</td>
                  <td style={{ padding: "8px 12px", color: C.muted, whiteSpace: "nowrap" }}>{v["NET WORTH"]}</td>
                  <td style={{ padding: "8px 12px", textAlign: "center" }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: creditColor(v["CREDIT RTG"]), background: `${creditColor(v["CREDIT RTG"])}18`, border: `1px solid ${creditColor(v["CREDIT RTG"])}30`, borderRadius: 6, padding: "2px 6px" }}>{v["CREDIT RTG"]}</span>
                  </td>
                  <td style={{ padding: "8px 12px", color: v.MOBILE ? C.green : C.muted, fontSize: 10, whiteSpace: "nowrap" }}>{v.MOBILE ? v.MOBILE.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, "+$1 ($2) $3-$4") : "—"}</td>
                  <td style={{ padding: "8px 12px", color: v["PERS EMAIL"] ? C.blue2 : C.muted, fontSize: 10, whiteSpace: "nowrap", maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis" }}>{v["PERS EMAIL"] || "—"}</td>
                  <td style={{ padding: "8px 12px", color: C.muted, fontSize: 10, whiteSpace: "nowrap", maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis" }}>{v["CO NAME"] || "—"}</td>
                  <td style={{ padding: "8px 12px", color: C.accent2, fontWeight: 700, textAlign: "center" }}>{v["DB MATCHES"] || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderTop: `1px solid ${C.border}`, flexWrap: "wrap", gap: 8 }}>
          <div style={{ fontSize: 11, color: C.muted }}>
            Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)} of {filtered.length.toLocaleString()} voters
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => setPage(0)} disabled={page === 0} style={{ padding: "5px 10px", fontSize: 11, borderRadius: 6, cursor: page === 0 ? "not-allowed" : "pointer", background: page === 0 ? "transparent" : `${C.accent2}18`, border: `1px solid ${page === 0 ? C.border : C.accent2}`, color: page === 0 ? C.muted : C.accent2 }}>«</button>
            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} style={{ padding: "5px 10px", fontSize: 11, borderRadius: 6, cursor: page === 0 ? "not-allowed" : "pointer", background: page === 0 ? "transparent" : `${C.accent2}18`, border: `1px solid ${page === 0 ? C.border : C.accent2}`, color: page === 0 ? C.muted : C.accent2 }}>‹ Prev</button>
            <span style={{ padding: "5px 12px", fontSize: 11, color: C.white, background: C.bg3, borderRadius: 6, border: `1px solid ${C.border}` }}>Page {page + 1} of {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} style={{ padding: "5px 10px", fontSize: 11, borderRadius: 6, cursor: page >= totalPages - 1 ? "not-allowed" : "pointer", background: page >= totalPages - 1 ? "transparent" : `${C.accent2}18`, border: `1px solid ${page >= totalPages - 1 ? C.border : C.accent2}`, color: page >= totalPages - 1 ? C.muted : C.accent2 }}>Next ›</button>
            <button onClick={() => setPage(totalPages - 1)} disabled={page >= totalPages - 1} style={{ padding: "5px 10px", fontSize: 11, borderRadius: 6, cursor: page >= totalPages - 1 ? "not-allowed" : "pointer", background: page >= totalPages - 1 ? "transparent" : `${C.accent2}18`, border: `1px solid ${page >= totalPages - 1 ? C.border : C.accent2}`, color: page >= totalPages - 1 ? C.muted : C.accent2 }}>»</button>
          </div>
        </div>
      </Card>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
const TABS = ["Overview", "Voter Intelligence", "Media Universe", "Budget Tiers", "Site Traffic", "Pitch Narrative", "Undecided Voters"];

export default function StarlingDashboard() {
  const [tab, setTab] = useState(0);
  const [time, setTime] = useState(new Date());
  const [exporting, setExporting] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const mobile = useIsMobile();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const C = useColors(isDark);
  const [, navigate] = useLocation();
  const campaign = getCampaignDay();

  useEffect(() => { const id = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(id); }, []);

  async function handleExport() {
    if (exporting || !contentRef.current) return;
    setExporting(true);
    try {
      const { default: jsPDF } = await import("jspdf");
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(contentRef.current, { scale: 2, useCORS: true, backgroundColor: isDark ? "#080c18" : "#f0f4f8", logging: false });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = (canvas.height * pdfW) / canvas.width;
      const pageH = pdf.internal.pageSize.getHeight();
      let y = 0;
      while (y < pdfH) {
        if (y > 0) pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, -y, pdfW, pdfH);
        y += pageH;
      }
      pdf.save(`ExactAudience_Starling_${TABS[tab]}_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (err) { console.error(err); }
    finally { setExporting(false); }
  }

  const tabContent = [
    <TabOverview mobile={mobile} C={C} />,
    <TabVoterIntel mobile={mobile} C={C} />,
    <TabMediaUniverse mobile={mobile} C={C} />,
    <TabBudgetTiers mobile={mobile} C={C} />,
    <TabSiteTraffic mobile={mobile} C={C} />,
    <TabPitchNarrative mobile={mobile} C={C} />,
    <TabUndecidedVoters mobile={mobile} C={C} />,
  ];

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", color: C.white, transition: "background 0.3s, color 0.3s" }}>
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.15} }
        @keyframes pdot  { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.4)} }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: ${C.scrollTrack}; }
        ::-webkit-scrollbar-thumb { background: ${C.scrollThumb}; border-radius: 3px; }
        * { box-sizing: border-box; }
      `}</style>

      {/* Header */}
      <div style={{ background: C.headerBg, borderBottom: "1px solid rgba(212,160,23,0.25)", padding: mobile ? "12px 16px" : "14px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 200 }}>
        <div style={{ display: "flex", alignItems: "center", gap: mobile ? 10 : 16, minWidth: 0 }}>
          <button onClick={() => navigate("/campaigns")} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 8, padding: "5px 10px", color: "#f1f5f9", fontSize: 11, cursor: "pointer", flexShrink: 0 }}>
            ← Campaigns
          </button>
          <div style={{ width: 1, height: 24, background: "rgba(255,255,255,0.2)", flexShrink: 0 }} />
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <span style={{ width: 8, height: 8, background: "#d4a017", borderRadius: "50%", boxShadow: "0 0 8px #d4a01788", animation: "pdot 2s ease-in-out infinite" }} />
            {!mobile && <img src="/ea-logo.png" alt="Exact Audience" style={{ height: 22, maxWidth: 160, objectFit: "contain", objectPosition: "left center", filter: "brightness(1.15)" }} />}
          </div>
          {!mobile && <div style={{ width: 1, height: 30, background: "rgba(255,255,255,0.2)" }} />}
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: mobile ? 12 : 14, fontWeight: 700, color: "#ffffff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Jeff Starling for AG</div>
            {!mobile && <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)" }}>Oklahoma · Republican Primary · June 16, 2026</div>}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: mobile ? 6 : 10, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(74,222,128,.15)", border: "1px solid rgba(74,222,128,.35)", borderRadius: 20, padding: "4px 10px", fontSize: 10, fontWeight: 700, color: "#4ade80", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            <span style={{ width: 6, height: 6, background: "#4ade80", borderRadius: "50%", animation: "blink 1.2s ease-in-out infinite" }} />
            Live
          </div>
          {!mobile && (
            <button onClick={handleExport} disabled={exporting} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 8, padding: "5px 12px", color: "#f1f5f9", fontSize: 11, cursor: "pointer" }}>
              {exporting ? "Exporting..." : "📄 Export PDF"}
            </button>
          )}
          <button onClick={toggleTheme} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 20, padding: "5px 12px", color: "#f1f5f9", fontSize: 11, cursor: "pointer" }}>
            {isDark ? "☀️ Light" : "🌙 Dark"}
          </button>
          <button onClick={() => { localStorage.removeItem("ea_dashboard_auth"); window.location.href = "/"; }} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 20, padding: "5px 10px", color: "#94a3b8", fontSize: 11, fontWeight: 600, cursor: "pointer", flexShrink: 0, whiteSpace: "nowrap" }}>
            🔒 {mobile ? "" : "Log Out"}
          </button>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", fontVariantNumeric: "tabular-nums" }}>
            {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </div>
        </div>
      </div>

      {/* Campaign Day Progress Bar */}
      <div style={{ background: isDark ? "#080c18" : "#eef3f8", borderBottom: `1px solid ${C.border}`, padding: mobile ? "8px 16px" : "10px 28px", display: "flex", alignItems: "center", gap: mobile ? 10 : 20, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <span style={{ fontSize: 10, fontWeight: 800, color: C.accent2, textTransform: "uppercase", letterSpacing: "0.1em" }}>Day {campaign.dayNum} of 18</span>
          <span style={{ fontSize: 10, color: C.muted }}>·</span>
          <span style={{ fontSize: 10, color: C.muted }}>{campaign.daysLeft} days to June 16</span>
        </div>
        <div style={{ flex: 1, minWidth: 120, height: 6, background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)", borderRadius: 3, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${(campaign.dayNum / 18) * 100}%`, background: `linear-gradient(90deg, ${C.blue2}, ${C.accent2})`, borderRadius: 3, transition: "width 0.6s ease" }} />
        </div>
        <div style={{ display: "flex", gap: mobile ? 12 : 24, flexShrink: 0 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: C.white }}>${campaign.spentToDate.toLocaleString()}</div>
            <div style={{ fontSize: 9, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Spent</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: C.green }}>${campaign.remainingBudget.toLocaleString()}</div>
            <div style={{ fontSize: 9, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Remaining</div>
          </div>
          {!mobile && (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: C.accent2 }}>{fmt(campaign.cumulativeImpressions)}</div>
              <div style={{ fontSize: 9, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Proj. Impressions</div>
            </div>
          )}
        </div>
      </div>

      {/* Race Context Banner */}
      <div style={{ background: isDark ? "#0a1020" : "#e8f0f8", borderBottom: `1px solid ${C.border}`, padding: mobile ? "8px 16px" : "9px 28px", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, background: `${C.accent2}18`, border: `1px solid ${C.accent2}40`, borderRadius: 20, padding: "3px 10px", flexShrink: 0 }}>
          <span style={{ fontSize: 9, fontWeight: 800, color: C.accent2, textTransform: "uppercase", letterSpacing: "0.1em" }}>🗳️ Republican Primary</span>
        </div>
        <span style={{ fontSize: 10, color: C.muted }}>·</span>
        <span style={{ fontSize: 10, color: C.white, fontWeight: 600 }}>June 16, 2026</span>
        <span style={{ fontSize: 10, color: C.muted }}>·</span>
        <span style={{ fontSize: 10, color: C.muted }}>2-person race: Starling vs. Echols</span>
        <span style={{ fontSize: 10, color: C.muted }}>·</span>
        <span style={{ fontSize: 10, color: C.green, fontWeight: 700 }}>Winner becomes next Oklahoma AG</span>
        {!mobile && (
          <>
            <span style={{ fontSize: 10, color: C.muted }}>·</span>
            <span style={{ fontSize: 10, color: C.muted }}>~1.28M registered Republicans · Win threshold: ~116,000–142,000 votes</span>
          </>
        )}
      </div>

      {/* Tabs */}
      <div style={{ background: C.bg2, borderBottom: `1px solid ${C.border}`, padding: "0 28px", overflowX: "auto", display: "flex", gap: 0 }}>
        {TABS.map((t, i) => (
          <button key={t} onClick={() => setTab(i)} style={{
            padding: mobile ? "10px 12px" : "12px 18px", fontSize: mobile ? 10 : 11, fontWeight: 700,
            letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer", whiteSpace: "nowrap",
            background: "transparent", border: "none", borderBottom: `2px solid ${tab === i ? C.accent2 : "transparent"}`,
            color: tab === i ? C.accent2 : C.muted, transition: "all 0.15s",
          }}>{t}</button>
        ))}
      </div>

      {/* Content */}
      <div ref={contentRef} style={{ padding: mobile ? "16px" : "24px 28px" }}>
        {tabContent[tab]}
      </div>

      {/* Footer */}
      <div style={{ padding: "16px 28px", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <div style={{ fontSize: 10, color: C.muted }}>Powered by Exact Audience · Behavioral Intelligence · exactaudience.ai</div>
        <div style={{ fontSize: 10, color: C.muted }}>Jeff Starling for Oklahoma AG · June 16, 2026 Republican Primary</div>
      </div>
    </div>
  );
}
