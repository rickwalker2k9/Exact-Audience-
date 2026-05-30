/**
 * Exact Audience — Live Campaign Intelligence Dashboard
 * Design: Dark command-center aesthetic, Exact Audience navy/purple brand
 * Layout: Sticky header + tab bar, full-width panels per tab
 * Animation: Live counters, chart updates, visitor feed rotation
 */

import { useState, useEffect, useRef } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import {
  CLIENT, LIVE_BASE, DAILY_IMPRESSIONS, CTV_CHANNELS, LOCAL_CHANNELS,
  YOUTUBE, DSP, SITE_VISITORS, DEMOGRAPHICS, MOODS, CONTENT_SEGMENTS,
  DAYPARTS, CREATIVES
} from "@/lib/dashboardData";
import { PEOPLE } from "@/lib/peopleData";

// ── Color tokens ──────────────────────────────────────────────────────────────
const C = {
  bg:      "#07071a",
  bg2:     "#0d0d28",
  bg3:     "#12123a",
  card:    "#0f0f2e",
  card2:   "#141440",
  border:  "#252560",
  purple:  "#7c3aed",
  purple2: "#a855f7",
  purple3: "#c084fc",
  green:   "#4ade80",
  gold:    "#f59e0b",
  blue:    "#38bdf8",
  red:     "#f87171",
  white:   "#f1f5f9",
  muted:   "#8892b0",
};

const TABS = [
  "Overview", "CPM & Channels", "Creatives",
  "Audience Intel", "Day Part", "Content", "Moods", "People"
];

// ── Utility ───────────────────────────────────────────────────────────────────
function fmt(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + "M";
  if (n >= 1_000)     return (n / 1_000).toFixed(1) + "K";
  return n.toLocaleString();
}

function useTick(base: number, step: number, interval = 8000) {
  const [val, setVal] = useState(base);
  useEffect(() => {
    const id = setInterval(() => setVal(v => v + step), interval);
    return () => clearInterval(id);
  }, [step, interval]);
  return val;
}

// ── Sub-components ────────────────────────────────────────────────────────────
function KpiCard({ label, value, sub, color }: { label: string; value: string; sub?: string; color: string }) {
  return (
    <div style={{
      background: C.card, border: `1px solid ${C.border}`,
      borderRadius: 12, padding: "20px 24px",
      borderTop: `3px solid ${color}`,
    }}>
      <div style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 800, color: C.white, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: C.muted, marginTop: 6 }}>{sub}</div>}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ width: 3, height: 14, background: C.purple2, borderRadius: 2, display: "inline-block" }} />
      {children}
    </div>
  );
}

function ProgressBar({ value, max, color = C.purple2 }: { value: number; max: number; color?: string }) {
  return (
    <div style={{ background: C.bg3, borderRadius: 4, height: 6, overflow: "hidden" }}>
      <div style={{ width: `${Math.min(100, (value / max) * 100)}%`, background: color, height: "100%", borderRadius: 4, transition: "width 0.6s ease" }} />
    </div>
  );
}

// ── Visitor Feed ──────────────────────────────────────────────────────────────
function VisitorFeed() {
  const [idx, setIdx] = useState(0);
  const [fade, setFade] = useState(true);
  useEffect(() => {
    const id = setInterval(() => {
      setFade(false);
      setTimeout(() => { setIdx(i => (i + 1) % SITE_VISITORS.length); setFade(true); }, 400);
    }, 4000);
    return () => clearInterval(id);
  }, []);
  const v = SITE_VISITORS[idx];
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, borderLeft: `3px solid ${C.green}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <span style={{ width: 8, height: 8, background: C.green, borderRadius: "50%", boxShadow: `0 0 8px ${C.green}`, animation: "blink 1.2s infinite" }} />
        <span style={{ fontSize: 11, fontWeight: 700, color: C.green, textTransform: "uppercase", letterSpacing: "0.1em" }}>SiteID — Live Visitor</span>
      </div>
      <div style={{ opacity: fade ? 1 : 0, transition: "opacity 0.4s" }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: C.white, marginBottom: 4 }}>{v.first} {v.last}</div>
        <div style={{ fontSize: 12, color: C.muted, marginBottom: 12 }}>{v.city} · {v.time}</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[
            ["Job", v.job || "—"],
            ["Company", v.company],
            ["Income", v.income],
            ["Net Worth", v.networth],
            ["Credit", v.credit],
            ["Intent Score", String(v.score)],
          ].map(([k, val]) => (
            <div key={k} style={{ background: C.bg3, borderRadius: 8, padding: "8px 12px" }}>
              <div style={{ fontSize: 10, color: C.muted, marginBottom: 2 }}>{k}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.white }}>{val}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 10, background: `${C.purple}22`, border: `1px solid ${C.purple}44`, borderRadius: 8, padding: "8px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 11, color: C.purple3 }}>Mood Signal</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: C.purple2 }}>{v.mood}</span>
        </div>
      </div>
    </div>
  );
}

// ── TAB: Overview ─────────────────────────────────────────────────────────────
function TabOverview() {
  const impressions = useTick(LIVE_BASE.impressions, 1247);
  const completions = useTick(LIVE_BASE.completions, 1089);
  const reach       = useTick(LIVE_BASE.reach, 23);
  const visitors    = useTick(LIVE_BASE.siteVisitors, 1);

  const chartData = DAILY_IMPRESSIONS.slice(-14).map(d => ({
    day: d.day.replace("May ", ""),
    CTV: Math.round(d.ctv / 1000),
    YouTube: Math.round(d.youtube / 1000),
    Display: Math.round(d.display / 1000),
  }));

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16, marginBottom: 24 }}>
      <KpiCard label="Total Impressions" value={fmt(impressions)} sub="↑ 3.2% vs last week" color={C.purple2} />
      <KpiCard label="Completed Views" value={fmt(completions)} sub={`${LIVE_BASE.completionRate}% completion rate`} color={C.green} />
      <KpiCard label="Unique Reach" value={fmt(reach)} sub={`${LIVE_BASE.frequency}x avg frequency`} color={C.blue} />
      <KpiCard label="SiteID Visitors" value={fmt(visitors)} sub="Identified by name & address" color={C.gold} />

      {/* Chart */}
      <div style={{ gridColumn: "1 / 4", background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
        <SectionTitle>Daily Delivery — Last 14 Days (000s)</SectionTitle>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="gCTV" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={C.purple2} stopOpacity={0.4} />
                <stop offset="95%" stopColor={C.purple2} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gYT" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={C.red} stopOpacity={0.4} />
                <stop offset="95%" stopColor={C.red} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gDSP" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={C.blue} stopOpacity={0.3} />
                <stop offset="95%" stopColor={C.blue} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
            <XAxis dataKey="day" tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 8, color: C.white }} />
            <Legend wrapperStyle={{ color: C.muted, fontSize: 12 }} />
            <Area type="monotone" dataKey="CTV" stroke={C.purple2} fill="url(#gCTV)" strokeWidth={2} />
            <Area type="monotone" dataKey="YouTube" stroke={C.red} fill="url(#gYT)" strokeWidth={2} />
            <Area type="monotone" dataKey="Display" stroke={C.blue} fill="url(#gDSP)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Visitor Feed */}
      <div style={{ gridColumn: "4 / 5" }}>
        <VisitorFeed />
      </div>

      {/* Channel Mix Pie */}
      <div style={{ gridColumn: "1 / 3", background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
        <SectionTitle>Channel Mix — Impression Share</SectionTitle>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={[
              { name: "CTV Streaming", value: 68 },
              { name: "YouTube", value: 18 },
              { name: "DSP Display", value: 9 },
              { name: "Local TV", value: 5 },
            ]} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
              {[C.purple2, C.red, C.blue, C.gold].map((c, i) => <Cell key={i} fill={c} />)}
            </Pie>
            <Tooltip contentStyle={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 8, color: C.white }} formatter={(v) => `${v}%`} />
            <Legend wrapperStyle={{ color: C.muted, fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Budget Pacing */}
      <div style={{ gridColumn: "3 / 5", background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
        <SectionTitle>Budget Pacing</SectionTitle>
        {[
          { label: "CTV Streaming", pct: 72, color: C.purple2 },
          { label: "YouTube", pct: 68, color: C.red },
          { label: "DSP / Programmatic", pct: 61, color: C.blue },
          { label: "Local Phoenix TV", pct: 74, color: C.gold },
          { label: "SiteID Identification", pct: 83, color: C.green },
        ].map(r => (
          <div key={r.label} style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: C.white }}>{r.label}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: r.color }}>{r.pct}% delivered</span>
            </div>
            <ProgressBar value={r.pct} max={100} color={r.color} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── TAB: CPM & Channels ───────────────────────────────────────────────────────
function TabChannels() {
  const [sort, setSort] = useState<"impressions" | "cpm" | "completionRate">("impressions");
  const sorted = [...CTV_CHANNELS].sort((a, b) => b[sort] - a[sort]);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
      {/* CTV Table */}
      <div style={{ gridColumn: "1 / 3", background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <SectionTitle>CTV Streaming Channels — Vibe.co Inventory</SectionTitle>
          <div style={{ display: "flex", gap: 8 }}>
            {(["impressions", "cpm", "completionRate"] as const).map(k => (
              <button key={k} onClick={() => setSort(k)} style={{
                padding: "4px 12px", borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: "pointer",
                background: sort === k ? C.purple : C.bg3,
                color: sort === k ? C.white : C.muted,
                border: `1px solid ${sort === k ? C.purple : C.border}`,
              }}>
                {k === "impressions" ? "Impressions" : k === "cpm" ? "CPM" : "Completion"}
              </button>
            ))}
          </div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                {["Channel", "Impressions", "Completions", "CPM", "Frequency", "Completion Rate"].map(h => (
                  <th key={h} style={{ padding: "8px 12px", textAlign: h === "Channel" ? "left" : "right", color: C.muted, fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((ch, i) => (
                <tr key={ch.name} style={{ borderBottom: `1px solid ${C.border}22`, background: i % 2 === 0 ? "transparent" : `${C.bg3}44` }}>
                  <td style={{ padding: "10px 12px", color: C.white, fontWeight: 600, display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ width: 10, height: 10, borderRadius: "50%", background: ch.color, flexShrink: 0 }} />
                    {ch.name}
                  </td>
                  <td style={{ padding: "10px 12px", textAlign: "right", color: C.white }}>{fmt(ch.impressions)}</td>
                  <td style={{ padding: "10px 12px", textAlign: "right", color: C.muted }}>{fmt(ch.completions)}</td>
                  <td style={{ padding: "10px 12px", textAlign: "right", color: C.gold }}>${ch.cpm.toFixed(2)}</td>
                  <td style={{ padding: "10px 12px", textAlign: "right", color: C.muted }}>{ch.frequency.toFixed(2)}x</td>
                  <td style={{ padding: "10px 12px", textAlign: "right" }}>
                    <span style={{ color: ch.completionRate >= 90 ? C.green : ch.completionRate >= 80 ? C.gold : C.red, fontWeight: 700 }}>
                      {ch.completionRate.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Local Phoenix */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
        <SectionTitle>Phoenix Local TV</SectionTitle>
        {LOCAL_CHANNELS.map(ch => (
          <div key={ch.name} style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 12, color: C.white, fontWeight: 600 }}>{ch.name}</span>
              <span style={{ fontSize: 11, color: C.gold }}>${ch.cpm.toFixed(2)} CPM</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 11, color: C.muted }}>{fmt(ch.impressions)} impr · {ch.frequency.toFixed(2)}x freq</span>
              <span style={{ fontSize: 11, color: ch.completionRate >= 90 ? C.green : C.gold }}>{ch.completionRate.toFixed(1)}%</span>
            </div>
            <ProgressBar value={ch.completionRate} max={100} color={C.blue} />
          </div>
        ))}
      </div>

      {/* YouTube */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
        <SectionTitle>YouTube Performance</SectionTitle>
        {[
          { label: "Pre-Roll :30", data: YOUTUBE.preRoll, color: C.red },
          { label: "Mid-Roll :15", data: YOUTUBE.midRoll, color: "#ff6b35" },
          { label: "Bumper :06",   data: YOUTUBE.bumper,  color: C.gold },
          { label: "Discovery",    data: YOUTUBE.discovery, color: C.purple2 },
        ].map(({ label, data, color }) => (
          <div key={label} style={{ background: C.bg3, borderRadius: 10, padding: "14px 16px", marginBottom: 12, borderLeft: `3px solid ${color}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: C.white }}>{label}</span>
              <span style={{ fontSize: 11, color: C.gold }}>${data.cpm.toFixed(2)} CPM</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              <div><div style={{ fontSize: 10, color: C.muted }}>Impressions</div><div style={{ fontSize: 13, fontWeight: 700, color: C.white }}>{fmt(data.impressions)}</div></div>
              <div><div style={{ fontSize: 10, color: C.muted }}>Completions</div><div style={{ fontSize: 13, fontWeight: 700, color: C.white }}>{fmt(data.completions)}</div></div>
              <div><div style={{ fontSize: 10, color: C.muted }}>VCR</div><div style={{ fontSize: 13, fontWeight: 700, color: color }}>{data.completionRate}%</div></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── TAB: Creatives ────────────────────────────────────────────────────────────
function TabCreatives() {
  const chartData = CREATIVES.map(c => ({ name: c.format, CPM: c.cpm, VCR: c.completionRate }));
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
      <div style={{ gridColumn: "1 / 3", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {CREATIVES.map(cr => (
          <div key={cr.name} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, borderTop: `3px solid ${C.purple2}` }}>
            <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>{cr.format}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.white, marginBottom: 12, lineHeight: 1.3 }}>{cr.name}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <div><div style={{ fontSize: 10, color: C.muted }}>Impressions</div><div style={{ fontSize: 14, fontWeight: 700, color: C.white }}>{fmt(cr.impressions)}</div></div>
              <div><div style={{ fontSize: 10, color: C.muted }}>CPM</div><div style={{ fontSize: 14, fontWeight: 700, color: C.gold }}>${cr.cpm.toFixed(2)}</div></div>
              {cr.completionRate > 0 && (
                <div style={{ gridColumn: "1 / 3" }}>
                  <div style={{ fontSize: 10, color: C.muted, marginBottom: 4 }}>Completion Rate</div>
                  <ProgressBar value={cr.completionRate} max={100} color={cr.completionRate >= 90 ? C.green : C.purple2} />
                  <div style={{ fontSize: 12, fontWeight: 700, color: cr.completionRate >= 90 ? C.green : C.purple2, marginTop: 4 }}>{cr.completionRate.toFixed(1)}%</div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
        <SectionTitle>CPM by Creative Format</SectionTitle>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} horizontal={false} />
            <XAxis type="number" tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis dataKey="name" type="category" tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} width={70} />
            <Tooltip contentStyle={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 8, color: C.white }} formatter={(v) => `$${Number(v).toFixed(2)}`} />
            <Bar dataKey="CPM" fill={C.gold} radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
        <SectionTitle>Completion Rate by Format</SectionTitle>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData.filter(d => d.VCR > 0)} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} horizontal={false} />
            <XAxis type="number" domain={[0, 100]} tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis dataKey="name" type="category" tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} width={70} />
            <Tooltip contentStyle={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 8, color: C.white }} formatter={(v) => `${v}%`} />
            <Bar dataKey="VCR" fill={C.green} radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ── TAB: Audience Intelligence ────────────────────────────────────────────────
function TabAudience() {
  const maxAge = Math.max(...DEMOGRAPHICS.age.map(d => d.value));
  const maxInc = Math.max(...DEMOGRAPHICS.income.map(d => d.value));
  const maxNW  = Math.max(...DEMOGRAPHICS.networth.map(d => d.value));
  const maxCity = Math.max(...DEMOGRAPHICS.topCities.map(d => d.value));

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
      {/* Age */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
        <SectionTitle>Age Distribution</SectionTitle>
        {DEMOGRAPHICS.age.map(d => (
          <div key={d.label} style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ fontSize: 12, color: C.white }}>{d.label}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: C.purple3 }}>{d.value}</span>
            </div>
            <ProgressBar value={d.value} max={maxAge} color={C.purple2} />
          </div>
        ))}
      </div>

      {/* Gender + Homeowner */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
          <SectionTitle>Gender</SectionTitle>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={DEMOGRAPHICS.gender} cx="50%" cy="50%" innerRadius={40} outerRadius={60} dataKey="value" paddingAngle={4}>
                <Cell fill={C.blue} />
                <Cell fill={C.purple3} />
              </Pie>
              <Tooltip contentStyle={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 8, color: C.white }} />
              <Legend wrapperStyle={{ color: C.muted, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
          <SectionTitle>Homeowner Status</SectionTitle>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={DEMOGRAPHICS.homeowner} cx="50%" cy="50%" innerRadius={40} outerRadius={60} dataKey="value" paddingAngle={4}>
                {[C.green, C.red, C.muted].map((c, i) => <Cell key={i} fill={c} />)}
              </Pie>
              <Tooltip contentStyle={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 8, color: C.white }} />
              <Legend wrapperStyle={{ color: C.muted, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Income */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
        <SectionTitle>Household Income</SectionTitle>
        {DEMOGRAPHICS.income.map(d => (
          <div key={d.label} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 11, color: C.white }}>{d.label}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: C.gold }}>{d.value}</span>
            </div>
            <ProgressBar value={d.value} max={maxInc} color={C.gold} />
          </div>
        ))}
      </div>

      {/* Net Worth */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
        <SectionTitle>Net Worth</SectionTitle>
        {DEMOGRAPHICS.networth.map(d => (
          <div key={d.label} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 11, color: C.white }}>{d.label}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: C.green }}>{d.value}</span>
            </div>
            <ProgressBar value={d.value} max={maxNW} color={C.green} />
          </div>
        ))}
      </div>

      {/* Credit */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
        <SectionTitle>Credit Rating</SectionTitle>
        {DEMOGRAPHICS.credit.map(d => (
          <div key={d.label} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 11, color: C.white }}>{d.label}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: C.blue }}>{d.value}</span>
            </div>
            <ProgressBar value={d.value} max={94} color={C.blue} />
          </div>
        ))}
      </div>

      {/* Top Cities */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
        <SectionTitle>Top Cities</SectionTitle>
        {DEMOGRAPHICS.topCities.map(d => (
          <div key={d.label} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 12, color: C.white }}>{d.label}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: C.purple3 }}>{d.value}</span>
            </div>
            <ProgressBar value={d.value} max={maxCity} color={C.purple2} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── TAB: Day Part ─────────────────────────────────────────────────────────────
function TabDayPart() {
  const heatData = Array.from({ length: 24 }, (_, h) => {
    const base = h >= 6 && h <= 9 ? 0.7 : h >= 17 && h <= 21 ? 1.0 : h >= 22 || h <= 5 ? 0.3 : 0.5;
    return { hour: `${h}:00`, value: Math.round(base * 100 + Math.random() * 20) };
  });

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
      {/* Day Part Cards */}
      <div style={{ gridColumn: "1 / 3", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {DAYPARTS.map((dp, i) => {
          const colors = [C.gold, C.blue, C.purple2, C.muted];
          return (
            <div key={dp.label} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, borderTop: `3px solid ${colors[i]}` }}>
              <div style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>{dp.label}</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: C.white }}>{fmt(dp.impressions)}</div>
              <div style={{ fontSize: 11, color: C.muted, marginBottom: 12 }}>impressions</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <div><div style={{ fontSize: 10, color: C.muted }}>CPM</div><div style={{ fontSize: 13, fontWeight: 700, color: C.gold }}>${dp.cpm.toFixed(2)}</div></div>
                <div><div style={{ fontSize: 10, color: C.muted }}>VCR</div><div style={{ fontSize: 13, fontWeight: 700, color: colors[i] }}>{dp.completionRate}%</div></div>
              </div>
              <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: 10, color: C.muted, marginBottom: 4 }}>{dp.count} audience members</div>
                <ProgressBar value={dp.count} max={142} color={colors[i]} />
              </div>
            </div>
          );
        })}
      </div>

      {/* 24-Hour Heatmap */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
        <SectionTitle>24-Hour Activity Heatmap</SectionTitle>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {heatData.map(h => {
            const intensity = h.value / 120;
            return (
              <div key={h.hour} title={`${h.hour}: ${h.value}%`} style={{
                width: 32, height: 32, borderRadius: 6,
                background: `rgba(168, 85, 247, ${intensity})`,
                border: `1px solid ${C.border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 9, color: intensity > 0.5 ? C.white : C.muted,
              }}>
                {h.hour.split(":")[0]}
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 12, display: "flex", gap: 16, fontSize: 11, color: C.muted }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 12, height: 12, background: `rgba(168,85,247,0.2)`, borderRadius: 2 }} />Low</span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 12, height: 12, background: `rgba(168,85,247,0.6)`, borderRadius: 2 }} />Medium</span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 12, height: 12, background: `rgba(168,85,247,1.0)`, borderRadius: 2 }} />Peak</span>
        </div>
      </div>

      {/* Impressions by Day Part Chart */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
        <SectionTitle>Impressions by Day Part</SectionTitle>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={DAYPARTS.map(d => ({ name: d.label.split("/")[0], impressions: Math.round(d.impressions / 1000), cpm: d.cpm }))}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
            <XAxis dataKey="name" tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 8, color: C.white }} formatter={(v) => `${v}K`} />
            <Bar dataKey="impressions" fill={C.purple2} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ── TAB: Content ──────────────────────────────────────────────────────────────
function TabContent() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
        <SectionTitle>Content Consumer Segments</SectionTitle>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie data={CONTENT_SEGMENTS} cx="50%" cy="50%" outerRadius={110} dataKey="count" nameKey="label" paddingAngle={3} label={({ label, percent }) => `${label} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
              {CONTENT_SEGMENTS.map((seg, i) => <Cell key={i} fill={seg.color} />)}
            </Pie>
            <Tooltip contentStyle={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 8, color: C.white }} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
        <SectionTitle>Segment Breakdown</SectionTitle>
        {CONTENT_SEGMENTS.map(seg => (
          <div key={seg.label} style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.white }}>{seg.label}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: seg.color }}>{seg.count} people</span>
            </div>
            <ProgressBar value={seg.count} max={112} color={seg.color} />
          </div>
        ))}
      </div>

      {/* Content x Day Part cross-tab */}
      <div style={{ gridColumn: "1 / 3", background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
        <SectionTitle>Content Segment × Day Part</SectionTitle>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                <th style={{ padding: "8px 16px", textAlign: "left", color: C.muted, fontWeight: 600, fontSize: 11 }}>Segment</th>
                {["Morning/Daytime", "Evening News", "Primetime", "Late Night"].map(dp => (
                  <th key={dp} style={{ padding: "8px 16px", textAlign: "center", color: C.muted, fontWeight: 600, fontSize: 11 }}>{dp}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CONTENT_SEGMENTS.map((seg, i) => {
                const counts = PEOPLE.filter(p => p.content === seg.label);
                const byDP = ["Morning/Daytime", "Evening News", "Primetime", "Late Night"].map(dp =>
                  counts.filter(p => p.daypart === dp).length
                );
                return (
                  <tr key={seg.label} style={{ borderBottom: `1px solid ${C.border}22`, background: i % 2 === 0 ? "transparent" : `${C.bg3}44` }}>
                    <td style={{ padding: "10px 16px", color: C.white, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: seg.color }} />
                      {seg.label}
                    </td>
                    {byDP.map((c, j) => (
                      <td key={j} style={{ padding: "10px 16px", textAlign: "center", color: c > 5 ? C.white : C.muted, fontWeight: c > 5 ? 700 : 400 }}>{c}</td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── TAB: Moods ────────────────────────────────────────────────────────────────
function TabMoods() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
      <div style={{ gridColumn: "1 / 3", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {MOODS.map(m => (
          <div key={m.label} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24, borderTop: `3px solid ${m.color}`, textAlign: "center" }}>
            <div style={{ fontSize: 42, fontWeight: 900, color: m.color, marginBottom: 4 }}>{m.count}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.white, marginBottom: 6 }}>{m.label}</div>
            <div style={{ fontSize: 11, color: C.muted }}>{m.desc}</div>
          </div>
        ))}
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
        <SectionTitle>Mood Distribution</SectionTitle>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie data={MOODS} cx="50%" cy="50%" outerRadius={100} innerRadius={50} dataKey="count" nameKey="label" paddingAngle={4}>
              {MOODS.map((m, i) => <Cell key={i} fill={m.color} />)}
            </Pie>
            <Tooltip contentStyle={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 8, color: C.white }} />
            <Legend wrapperStyle={{ color: C.muted, fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
        <SectionTitle>Mood × Net Worth Correlation</SectionTitle>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={[
            { mood: "High Intent", "$1M+": 12, "$500K+": 14, "$250K+": 8, "Under $250K": 5 },
            { mood: "In-Market",   "$1M+": 18, "$500K+": 24, "$250K+": 28, "Under $250K": 24 },
            { mood: "Awareness",   "$1M+": 22, "$500K+": 38, "$250K+": 52, "Under $250K": 56 },
            { mood: "Prospect",    "$1M+": 15, "$500K+": 26, "$250K+": 48, "Under $250K": 78 },
          ]}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
            <XAxis dataKey="mood" tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 8, color: C.white }} />
            <Legend wrapperStyle={{ color: C.muted, fontSize: 11 }} />
            <Bar dataKey="$1M+" stackId="a" fill={C.green} />
            <Bar dataKey="$500K+" stackId="a" fill={C.blue} />
            <Bar dataKey="$250K+" stackId="a" fill={C.purple2} />
            <Bar dataKey="Under $250K" stackId="a" fill={C.muted} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ── TAB: People ───────────────────────────────────────────────────────────────
function TabPeople() {
  const [search, setSearch] = useState("");
  const [filterMood, setFilterMood] = useState("All");
  const [filterCity, setFilterCity] = useState("All");

  const cities = ["All", ...Array.from(new Set(PEOPLE.map(p => p.city).filter(Boolean))).sort()];
  const moods  = ["All", "High Intent", "In-Market", "Awareness", "Prospect"];

  const filtered = PEOPLE.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = !q || `${p.first} ${p.last} ${p.city} ${p.job} ${p.company}`.toLowerCase().includes(q);
    const matchMood = filterMood === "All" || p.mood === filterMood;
    const matchCity = filterCity === "All" || p.city === filterCity;
    return matchSearch && matchMood && matchCity;
  });

  const moodColor: Record<string, string> = {
    "High Intent": C.green, "In-Market": C.blue, "Awareness": C.gold, "Prospect": C.purple3
  };

  return (
    <div>
      {/* Filters */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search name, city, company..."
          style={{ flex: 1, minWidth: 220, background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 16px", color: C.white, fontSize: 13, outline: "none" }}
        />
        {[{ label: "Mood", val: filterMood, set: setFilterMood, opts: moods },
          { label: "City", val: filterCity, set: setFilterCity, opts: cities }].map(f => (
          <select key={f.label} value={f.val} onChange={e => f.set(e.target.value)} style={{
            background: C.card, border: `1px solid ${C.border}`, borderRadius: 8,
            padding: "10px 16px", color: C.white, fontSize: 13, outline: "none", cursor: "pointer"
          }}>
            {f.opts.map(o => <option key={o} value={o}>{f.label === "Mood" && o !== "All" ? o : o}</option>)}
          </select>
        ))}
        <div style={{ padding: "10px 16px", background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 13, color: C.muted }}>
          {filtered.length} of {PEOPLE.length} shown
        </div>
      </div>

      {/* Table */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ background: C.bg3, borderBottom: `1px solid ${C.border}` }}>
                {["Name", "City", "Age", "Income", "Net Worth", "Credit", "Job / Company", "Phones", "Score", "Mood", "Content", "Day Part"].map(h => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", color: C.muted, fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${C.border}22`, background: i % 2 === 0 ? "transparent" : `${C.bg3}44` }}>
                  <td style={{ padding: "10px 14px", color: C.white, fontWeight: 700, whiteSpace: "nowrap" }}>{p.first} {p.last}</td>
                  <td style={{ padding: "10px 14px", color: C.muted, whiteSpace: "nowrap" }}>{p.city}</td>
                  <td style={{ padding: "10px 14px", color: C.muted, whiteSpace: "nowrap" }}>{p.age || "—"}</td>
                  <td style={{ padding: "10px 14px", color: C.gold, whiteSpace: "nowrap", fontSize: 11 }}>{p.income || "—"}</td>
                  <td style={{ padding: "10px 14px", color: C.green, whiteSpace: "nowrap", fontSize: 11 }}>{p.networth || "—"}</td>
                  <td style={{ padding: "10px 14px", textAlign: "center" }}>
                    <span style={{ background: `${C.blue}22`, color: C.blue, borderRadius: 4, padding: "2px 8px", fontWeight: 700 }}>{p.credit || "—"}</span>
                  </td>
                  <td style={{ padding: "10px 14px", color: C.muted, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {p.job ? <><span style={{ color: C.white }}>{p.job}</span> · {p.company}</> : p.company || "—"}
                  </td>
                  <td style={{ padding: "10px 14px", textAlign: "center", color: C.white }}>{p.phone_count}</td>
                  <td style={{ padding: "10px 14px", textAlign: "center" }}>
                    <span style={{ color: p.score >= 80 ? C.green : p.score >= 65 ? C.blue : p.score >= 50 ? C.gold : C.muted, fontWeight: 700 }}>{p.score}</span>
                  </td>
                  <td style={{ padding: "10px 14px", whiteSpace: "nowrap" }}>
                    <span style={{ color: moodColor[p.mood] || C.muted, fontWeight: 600, fontSize: 11 }}>{p.mood}</span>
                  </td>
                  <td style={{ padding: "10px 14px", color: C.muted, whiteSpace: "nowrap", fontSize: 11 }}>{p.content}</td>
                  <td style={{ padding: "10px 14px", color: C.muted, whiteSpace: "nowrap", fontSize: 11 }}>{p.daypart}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────────────────────
export default function Home() {
  const [tab, setTab] = useState(0);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const tabContent = [
    <TabOverview />, <TabChannels />, <TabCreatives />,
    <TabAudience />, <TabDayPart />, <TabContent />,
    <TabMoods />, <TabPeople />
  ];

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif", color: C.white }}>
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.15} }
        @keyframes pdot  { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.4)} }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: ${C.bg2}; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 3px; }
        input::placeholder { color: ${C.muted}; }
        select option { background: ${C.card}; }
      `}</style>

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg,#0a0a22,#1a0840)", borderBottom: `1px solid ${C.border}`, padding: "14px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 200 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 8, height: 8, background: C.purple2, borderRadius: "50%", boxShadow: `0 0 10px ${C.purple2}`, animation: "pdot 2s ease-in-out infinite" }} />
            EXACT AUDIENCE
          </div>
          <div style={{ width: 1, height: 30, background: C.border }} />
          <div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>{CLIENT.name}</div>
            <div style={{ fontSize: 10, color: C.muted }}>{CLIENT.location} · {CLIENT.vertical} · {CLIENT.campaign}</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(74,222,128,.1)", border: "1px solid rgba(74,222,128,.3)", borderRadius: 20, padding: "4px 12px", fontSize: 10, fontWeight: 700, color: C.green, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            <span style={{ width: 6, height: 6, background: C.green, borderRadius: "50%", animation: "blink 1.2s ease-in-out infinite" }} />
            Live
          </div>
          <div style={{ fontSize: 10, color: C.muted, fontFamily: "monospace" }}>
            {time.toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Tab Bar */}
      <div style={{ background: C.bg2, borderBottom: `1px solid ${C.border}`, padding: "0 28px", display: "flex", overflowX: "auto" }}>
        {TABS.map((t, i) => (
          <button key={t} onClick={() => setTab(i)} style={{
            padding: "13px 18px", fontSize: 12, fontWeight: 600,
            color: tab === i ? C.white : C.muted,
            background: "transparent", border: "none", cursor: "pointer",
            borderBottom: `2px solid ${tab === i ? C.purple2 : "transparent"}`,
            whiteSpace: "nowrap", transition: "all .2s", letterSpacing: "0.03em",
          }}>
            {t}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: "24px 28px" }}>
        {tabContent[tab]}
      </div>

      {/* Footer */}
      <div style={{ borderTop: `1px solid ${C.border}`, padding: "14px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 10, color: C.muted }}>
        <span>Exact Audience · exactaudience.ai · siteid.ai</span>
        <span>Powered by Vibe.co · Google DV360 · SiteID Intelligence</span>
        <span>Data refreshes every 8 seconds</span>
      </div>
    </div>
  );
}
