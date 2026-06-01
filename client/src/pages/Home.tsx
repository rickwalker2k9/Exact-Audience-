/**
 * Exact Audience — Live Campaign Intelligence Dashboard
 * Design: Dark command-center aesthetic (default) + clean light mode toggle
 * Layout: Sticky header + tab bar, responsive grid (single-col mobile, multi-col desktop)
 * Animation: Live counters, chart updates, visitor feed rotation
 */

import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { getNetworkLogo, getNetworkInitials } from "../lib/networkLogos";
import { CLIENT, LIVE_BASE, DAILY_IMPRESSIONS, CTV_CHANNELS, LOCAL_CHANNELS,
  YOUTUBE, DSP, SITE_VISITORS, DEMOGRAPHICS, MOODS, CONTENT_SEGMENTS,
  DAYPARTS, CREATIVES, DEFENDER_PAGE_VIEWS, DEFENDER_PAGE_TOTALS
} from "@/lib/dashboardData";
import { PEOPLE } from "@/lib/peopleData";
import { getProfilesByDashboard } from "@/lib/buyerProfiles";
import { useTheme } from "@/contexts/ThemeContext";

// ── Theme-aware color tokens ──────────────────────────────────────────────────
function useColors(isDark: boolean) {
  return isDark ? {
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
    headerBg: "linear-gradient(135deg,#0a0a22,#1a0840)",
    tooltipBg: "#141440",
    scrollTrack: "#0d0d28",
    scrollThumb: "#252560",
  } : {
    bg:      "#f0f4f8",
    bg2:     "#e8edf5",
    bg3:     "#dde4ef",
    card:    "#ffffff",
    card2:   "#f8fafc",
    border:  "#c8d4e8",
    purple:  "#7c3aed",
    purple2: "#7c3aed",
    purple3: "#9333ea",
    green:   "#16a34a",
    gold:    "#d97706",
    blue:    "#0284c7",
    red:     "#dc2626",
    white:   "#1e293b",
    muted:   "#64748b",
    headerBg: "linear-gradient(135deg,#1e1b4b,#312e81)",
    tooltipBg: "#ffffff",
    scrollTrack: "#e8edf5",
    scrollThumb: "#c8d4e8",
  };
}

const TABS = [
  "Overview", "Channels", "Creatives",
  "Audience", "Day Part", "Content", "Moods", "People", "Defender Pages"
];

// ── Responsive hook ───────────────────────────────────────────────────────────
function useIsMobile() {
  const [mobile, setMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 768);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return mobile;
}

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
function KpiCard({ label, value, sub, color, C }: { label: string; value: string; sub?: string; color: string; C: ReturnType<typeof useColors> }) {
  return (
    <div style={{
      background: C.card, border: `1px solid ${C.border}`,
      borderRadius: 12, padding: "18px 20px",
      borderTop: `3px solid ${color}`,
    }}>
      <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 800, color: C.white, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: C.muted, marginTop: 6 }}>{sub}</div>}
    </div>
  );
}

function SectionTitle({ children, C }: { children: React.ReactNode; C: ReturnType<typeof useColors> }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ width: 3, height: 14, background: C.purple2, borderRadius: 2, display: "inline-block", flexShrink: 0 }} />
      {children}
    </div>
  );
}

function ProgressBar({ value, max, color, C }: { value: number; max: number; color?: string; C: ReturnType<typeof useColors> }) {
  const barColor = color ?? C.purple2;
  return (
    <div style={{ background: C.bg3, borderRadius: 4, height: 6, overflow: "hidden" }}>
      <div style={{ width: `${Math.min(100, (value / max) * 100)}%`, background: barColor, height: "100%", borderRadius: 4, transition: "width 0.6s ease" }} />
    </div>
  );
}

function Card({ children, style, C }: { children: React.ReactNode; style?: React.CSSProperties; C: ReturnType<typeof useColors> }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, ...style }}>
      {children}
    </div>
  );
}

// ── Visitor Feed ──────────────────────────────────────────────────────────────
function VisitorFeed({ C }: { C: ReturnType<typeof useColors> }) {
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
        <span style={{ width: 8, height: 8, background: C.green, borderRadius: "50%", boxShadow: `0 0 8px ${C.green}`, animation: "blink 1.2s infinite", flexShrink: 0 }} />
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
const DATE_RANGES = [
  { label: "Last 7 Days",  days: 7 },
  { label: "Last 14 Days", days: 14 },
  { label: "Last 30 Days", days: 29 },
];

function TabOverview({ mobile, C }: { mobile: boolean; C: ReturnType<typeof useColors> }) {
  const impressions = useTick(LIVE_BASE.impressions, 1247);
  const completions = useTick(LIVE_BASE.completions, 1089);
  const reach       = useTick(LIVE_BASE.reach, 23);
  const visitors    = useTick(LIVE_BASE.siteVisitors, 1);
  const [rangeDays, setRangeDays] = useState(14);

  const chartData = DAILY_IMPRESSIONS.slice(-rangeDays).map(d => ({
    day: d.day.replace("May ", ""),
    CTV: Math.round(d.ctv / 1000),
    YouTube: Math.round(d.youtube / 1000),
    Display: Math.round(d.display / 1000),
  }));

  const rangeLabel = DATE_RANGES.find(r => r.days === rangeDays)?.label ?? "Last 14 Days";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* KPI row */}
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr 1fr" : "1fr 1fr 1fr 1fr", gap: 12 }}>
        <KpiCard label="Total Impressions" value={fmt(impressions)} sub="↑ 3.2% vs last week" color={C.purple2} C={C} />
        <KpiCard label="Completed Views" value={fmt(completions)} sub={`${LIVE_BASE.completionRate}% completion`} color={C.green} C={C} />
        <KpiCard label="Unique Reach" value={fmt(reach)} sub={`${LIVE_BASE.frequency}x avg frequency`} color={C.blue} C={C} />
        <KpiCard label="SiteID Visitors" value={fmt(visitors)} sub="Identified by name & address" color={C.gold} C={C} />
      </div>

      {/* Chart */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
        <Card C={C}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: C.muted }}>Daily Delivery — {rangeLabel} (000s)</span>
            <div style={{ display: "flex", gap: 4 }}>
              {DATE_RANGES.map(r => (
                <button key={r.days} onClick={() => setRangeDays(r.days)} style={{
                  padding: "4px 10px", fontSize: 10, fontWeight: 700, borderRadius: 6, cursor: "pointer",
                  border: `1px solid ${rangeDays === r.days ? C.purple2 : C.border}`,
                  background: rangeDays === r.days ? `${C.purple2}22` : "transparent",
                  color: rangeDays === r.days ? C.purple2 : C.muted,
                  transition: "all 0.15s",
                  letterSpacing: "0.04em",
                }}>{r.label.replace("Last ", "")}</button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={mobile ? 180 : 220}>
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
              <XAxis dataKey="day" tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} width={30} />
              <Tooltip contentStyle={{ background: C.tooltipBg, border: `1px solid ${C.border}`, borderRadius: 8, color: C.white, fontSize: 12 }} />
              <Legend wrapperStyle={{ color: C.muted, fontSize: 11 }} />
              <Area type="monotone" dataKey="CTV" stroke={C.purple2} fill="url(#gCTV)" strokeWidth={2} />
              <Area type="monotone" dataKey="YouTube" stroke={C.red} fill="url(#gYT)" strokeWidth={2} />
              <Area type="monotone" dataKey="Display" stroke={C.blue} fill="url(#gDSP)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Channel Mix + Budget Pacing */}
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 16 }}>
        <Card C={C}>
          <SectionTitle C={C}>Channel Mix — Impression Share</SectionTitle>
          {mobile ? (
            // Mobile: clean horizontal bar list
            <div style={{ display: "flex", flexDirection: "column", gap: 12, paddingTop: 4 }}>
              {[
                { name: "CTV Streaming", value: 68, color: C.purple2 },
                { name: "YouTube",       value: 18, color: C.red },
                { name: "DSP Display",   value: 9,  color: C.blue },
                { name: "Local TV",      value: 5,  color: C.gold },
              ].map(item => (
                <div key={item.name}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, color: C.white, fontWeight: 600 }}>
                      <span style={{ width: 10, height: 10, borderRadius: "50%", background: item.color, flexShrink: 0 }} />
                      {item.name}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: item.color }}>{item.value}%</span>
                  </div>
                  <ProgressBar value={item.value} max={100} color={item.color} C={C} />
                </div>
              ))}
            </div>
          ) : (
            // Desktop: donut chart
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
                <Tooltip contentStyle={{ background: C.tooltipBg, border: `1px solid ${C.border}`, borderRadius: 8, color: C.white }} formatter={(v) => `${v}%`} />
                <Legend wrapperStyle={{ color: C.muted, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card C={C}>
          <SectionTitle C={C}>Budget Pacing</SectionTitle>
          {[
            { label: "CTV Streaming", pct: 72, color: C.purple2 },
            { label: "YouTube", pct: 68, color: C.red },
            { label: "DSP / Programmatic", pct: 61, color: C.blue },
            { label: "Local Phoenix TV", pct: 74, color: C.gold },
            { label: "SiteID Identification", pct: 83, color: C.green },
          ].map(r => (
            <div key={r.label} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 12, color: C.white }}>{r.label}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: r.color }}>{r.pct}%</span>
              </div>
              <ProgressBar value={r.pct} max={100} color={r.color} C={C} />
            </div>
          ))}
        </Card>
      </div>

      {/* SiteID Visitor Feed — moved below channel mix for realistic pacing */}
      <VisitorFeed C={C} />
    </div>
  );
}

// ── TAB: CPM & Channels ───────────────────────────────────────────────────────
function TabChannels({ mobile, C }: { mobile: boolean; C: ReturnType<typeof useColors> }) {
  const [sort, setSort] = useState<"impressions" | "cpm" | "completionRate">("impressions");
  const sorted = [...CTV_CHANNELS].sort((a, b) => b[sort] - a[sort]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Card C={C}>
        <div style={{ display: "flex", flexDirection: mobile ? "column" : "row", justifyContent: "space-between", alignItems: mobile ? "flex-start" : "center", gap: 12, marginBottom: 16 }}>
          <SectionTitle C={C}>CTV Streaming — Channel Inventory</SectionTitle>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {(["impressions", "cpm", "completionRate"] as const).map(k => (
              <button key={k} onClick={() => setSort(k)} style={{
                padding: "4px 12px", borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: "pointer",
                background: sort === k ? C.purple : C.bg3,
                color: sort === k ? "#ffffff" : C.muted,
                border: `1px solid ${sort === k ? C.purple : C.border}`,
              }}>
                {k === "impressions" ? "Impressions" : k === "cpm" ? "CPM" : "Completion"}
              </button>
            ))}
          </div>
        </div>
        <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: mobile ? 11 : 12, minWidth: 520 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                {["Channel", "Impressions", "Completions", "CPM", "Freq", "VCR"].map(h => (
                  <th key={h} style={{ padding: "8px 10px", textAlign: h === "Channel" ? "left" : "right", color: C.muted, fontWeight: 600, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((ch, i) => (
                <tr key={ch.name} style={{ borderBottom: `1px solid ${C.border}`, background: i % 2 === 0 ? "transparent" : C.bg3 }}>
                  <td style={{ padding: "9px 10px", color: C.white, fontWeight: 600, whiteSpace: "nowrap" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                      {(() => {
                        const logoUrl = getNetworkLogo(ch.name);
                        const initials = getNetworkInitials(ch.name);
                        const InitialsBadge = () => (
                          <span style={{ width: 24, height: 24, borderRadius: 5, background: ch.color, flexShrink: 0, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 800, color: "#fff", letterSpacing: 0 }}>{initials}</span>
                        );
                        return logoUrl ? (
                          <img
                            src={logoUrl}
                            alt={ch.name}
                            width={24}
                            height={24}
                            style={{ borderRadius: 5, objectFit: "contain", background: "#fff", padding: 2, flexShrink: 0 }}
                            onError={(e) => {
                              const img = e.target as HTMLImageElement;
                              const badge = document.createElement("span");
                              badge.style.cssText = `width:24px;height:24px;border-radius:5px;background:${ch.color};flex-shrink:0;display:inline-flex;align-items:center;justify-content:center;font-size:8px;font-weight:800;color:#fff`;
                              badge.textContent = initials;
                              img.parentNode?.insertBefore(badge, img);
                              img.style.display = "none";
                            }}
                          />
                        ) : (
                          <InitialsBadge />
                        );
                      })()}
                      {ch.name}
                    </span>
                  </td>
                  <td style={{ padding: "9px 10px", textAlign: "right", color: C.white }}>{fmt(ch.impressions)}</td>
                  <td style={{ padding: "9px 10px", textAlign: "right", color: C.muted }}>{fmt(ch.completions)}</td>
                  <td style={{ padding: "9px 10px", textAlign: "right", color: C.gold }}>${ch.cpm.toFixed(2)}</td>
                  <td style={{ padding: "9px 10px", textAlign: "right", color: C.muted }}>{ch.frequency.toFixed(2)}x</td>
                  <td style={{ padding: "9px 10px", textAlign: "right" }}>
                    <span style={{ color: ch.completionRate >= 90 ? C.green : ch.completionRate >= 80 ? C.gold : C.red, fontWeight: 700 }}>
                      {ch.completionRate.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 16 }}>
        <Card C={C}>
          <SectionTitle C={C}>Phoenix Local TV</SectionTitle>
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
              <ProgressBar value={ch.completionRate} max={100} color={C.blue} C={C} />
            </div>
          ))}
        </Card>

        <Card C={C}>
          <SectionTitle C={C}>YouTube Performance</SectionTitle>
          {[
            { label: "Pre-Roll :30", data: YOUTUBE.preRoll, color: C.red },
            { label: "Mid-Roll :15", data: YOUTUBE.midRoll, color: "#ff6b35" },
            { label: "Bumper :06",   data: YOUTUBE.bumper,  color: C.gold },
            { label: "Discovery",    data: YOUTUBE.discovery, color: C.purple2 },
          ].map(({ label, data, color }) => (
            <div key={label} style={{ background: C.bg3, borderRadius: 10, padding: "12px 14px", marginBottom: 10, borderLeft: `3px solid ${color}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.white }}>{label}</span>
                <span style={{ fontSize: 11, color: C.gold }}>${data.cpm.toFixed(2)} CPM</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                <div><div style={{ fontSize: 10, color: C.muted }}>Impressions</div><div style={{ fontSize: 13, fontWeight: 700, color: C.white }}>{fmt(data.impressions)}</div></div>
                <div><div style={{ fontSize: 10, color: C.muted }}>Completions</div><div style={{ fontSize: 13, fontWeight: 700, color: C.white }}>{fmt(data.completions)}</div></div>
                <div><div style={{ fontSize: 10, color: C.muted }}>VCR</div><div style={{ fontSize: 13, fontWeight: 700, color }}>{data.completionRate}%</div></div>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

// ── TAB: Creatives ────────────────────────────────────────────────────────────
function TabCreatives({ mobile, C }: { mobile: boolean; C: ReturnType<typeof useColors> }) {
  const chartData = CREATIVES.map(c => ({ name: c.format, CPM: c.cpm, VCR: c.completionRate }));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 14 }}>
        {CREATIVES.map(cr => (
          <div key={cr.name} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16, borderTop: `3px solid ${C.purple2}` }}>
            <div style={{ fontSize: 9, color: C.muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 5 }}>{cr.format}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.white, marginBottom: 10, lineHeight: 1.3 }}>{cr.name}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <div><div style={{ fontSize: 9, color: C.muted }}>Impressions</div><div style={{ fontSize: 13, fontWeight: 700, color: C.white }}>{fmt(cr.impressions)}</div></div>
              <div><div style={{ fontSize: 9, color: C.muted }}>CPM</div><div style={{ fontSize: 13, fontWeight: 700, color: C.gold }}>${cr.cpm.toFixed(2)}</div></div>
              {cr.completionRate > 0 && (
                <div style={{ gridColumn: "1 / 3" }}>
                  <div style={{ fontSize: 9, color: C.muted, marginBottom: 4 }}>Completion Rate</div>
                  <ProgressBar value={cr.completionRate} max={100} color={cr.completionRate >= 90 ? C.green : C.purple2} C={C} />
                  <div style={{ fontSize: 11, fontWeight: 700, color: cr.completionRate >= 90 ? C.green : C.purple2, marginTop: 4 }}>{cr.completionRate.toFixed(1)}%</div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 16 }}>
        <Card C={C}>
          <SectionTitle C={C}>CPM by Creative Format</SectionTitle>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} horizontal={false} />
              <XAxis type="number" tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} width={65} />
              <Tooltip contentStyle={{ background: C.tooltipBg, border: `1px solid ${C.border}`, borderRadius: 8, color: C.white }} formatter={(v) => `$${Number(v).toFixed(2)}`} />
              <Bar dataKey="CPM" fill={C.gold} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card C={C}>
          <SectionTitle C={C}>Completion Rate by Format</SectionTitle>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData.filter(d => d.VCR > 0)} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} width={65} />
              <Tooltip contentStyle={{ background: C.tooltipBg, border: `1px solid ${C.border}`, borderRadius: 8, color: C.white }} formatter={(v) => `${v}%`} />
              <Bar dataKey="VCR" fill={C.green} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}

// ── TAB: Audience Intelligence ────────────────────────────────────────────────
function TabAudience({ mobile, C }: { mobile: boolean; C: ReturnType<typeof useColors> }) {
  const maxAge  = Math.max(...DEMOGRAPHICS.age.map(d => d.value));
  const maxInc  = Math.max(...DEMOGRAPHICS.income.map(d => d.value));
  const maxNW   = Math.max(...DEMOGRAPHICS.networth.map(d => d.value));
  const maxCity = Math.max(...DEMOGRAPHICS.topCities.map(d => d.value));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr 1fr", gap: 16 }}>
        <Card C={C}>
          <SectionTitle C={C}>Age Distribution</SectionTitle>
          {DEMOGRAPHICS.age.map(d => (
            <div key={d.label} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: C.white }}>{d.label}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: C.purple3 }}>{d.value}</span>
              </div>
              <ProgressBar value={d.value} max={maxAge} color={C.purple2} C={C} />
            </div>
          ))}
        </Card>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card C={C}>
            <SectionTitle C={C}>Gender</SectionTitle>
            <ResponsiveContainer width="100%" height={130}>
              <PieChart>
                <Pie data={DEMOGRAPHICS.gender} cx="50%" cy="50%" innerRadius={35} outerRadius={55} dataKey="value" paddingAngle={4}>
                  <Cell fill={C.blue} />
                  <Cell fill={C.purple3} />
                </Pie>
                <Tooltip contentStyle={{ background: C.tooltipBg, border: `1px solid ${C.border}`, borderRadius: 8, color: C.white }} />
                <Legend wrapperStyle={{ color: C.muted, fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
          <Card C={C}>
            <SectionTitle C={C}>Homeowner Status</SectionTitle>
            <ResponsiveContainer width="100%" height={130}>
              <PieChart>
                <Pie data={DEMOGRAPHICS.homeowner} cx="50%" cy="50%" innerRadius={35} outerRadius={55} dataKey="value" paddingAngle={4}>
                  {[C.green, C.red, C.muted].map((c, i) => <Cell key={i} fill={c} />)}
                </Pie>
                <Tooltip contentStyle={{ background: C.tooltipBg, border: `1px solid ${C.border}`, borderRadius: 8, color: C.white }} />
                <Legend wrapperStyle={{ color: C.muted, fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <Card C={C}>
          <SectionTitle C={C}>Household Income</SectionTitle>
          {DEMOGRAPHICS.income.map(d => (
            <div key={d.label} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: C.white }}>{d.label}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: C.gold }}>{d.value}</span>
              </div>
              <ProgressBar value={d.value} max={maxInc} color={C.gold} C={C} />
            </div>
          ))}
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 16 }}>
        <Card C={C}>
          <SectionTitle C={C}>Net Worth</SectionTitle>
          {DEMOGRAPHICS.networth.map(d => (
            <div key={d.label} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: C.white }}>{d.label}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: C.green }}>{d.value}</span>
              </div>
              <ProgressBar value={d.value} max={maxNW} color={C.green} C={C} />
            </div>
          ))}
        </Card>
        <Card C={C}>
          <SectionTitle C={C}>Credit Rating</SectionTitle>
          {DEMOGRAPHICS.credit.map(d => (
            <div key={d.label} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: C.white }}>{d.label}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: C.blue }}>{d.value}</span>
              </div>
              <ProgressBar value={d.value} max={94} color={C.blue} C={C} />
            </div>
          ))}
        </Card>
      </div>

      <Card C={C}>
        <SectionTitle C={C}>Top Cities</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 10 }}>
          {DEMOGRAPHICS.topCities.map(d => (
            <div key={d.label}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: C.white }}>{d.label}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: C.purple3 }}>{d.value}</span>
              </div>
              <ProgressBar value={d.value} max={maxCity} color={C.purple2} C={C} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ── TAB: Day Part ─────────────────────────────────────────────────────────────
function TabDayPart({ mobile, C }: { mobile: boolean; C: ReturnType<typeof useColors> }) {
  const heatData = Array.from({ length: 24 }, (_, h) => {
    const base = h >= 6 && h <= 9 ? 0.7 : h >= 17 && h <= 21 ? 1.0 : h >= 22 || h <= 5 ? 0.3 : 0.5;
    return { hour: `${h}:00`, value: Math.round(base * 100 + Math.random() * 20) };
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 12 }}>
        {DAYPARTS.map((dp, i) => {
          const colors = [C.gold, C.blue, C.purple2, C.muted];
          return (
            <div key={dp.label} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16, borderTop: `3px solid ${colors[i]}` }}>
              <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>{dp.label}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: C.white }}>{fmt(dp.impressions)}</div>
              <div style={{ fontSize: 10, color: C.muted, marginBottom: 10 }}>impressions</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <div><div style={{ fontSize: 9, color: C.muted }}>CPM</div><div style={{ fontSize: 12, fontWeight: 700, color: C.gold }}>${dp.cpm.toFixed(2)}</div></div>
                <div><div style={{ fontSize: 9, color: C.muted }}>VCR</div><div style={{ fontSize: 12, fontWeight: 700, color: colors[i] }}>{dp.completionRate}%</div></div>
              </div>
              <div style={{ marginTop: 10 }}>
                <div style={{ fontSize: 9, color: C.muted, marginBottom: 4 }}>{dp.count} audience members</div>
                <ProgressBar value={dp.count} max={142} color={colors[i]} C={C} />
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 16 }}>
        <Card C={C}>
          <SectionTitle C={C}>24-Hour Activity Heatmap</SectionTitle>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {heatData.map(h => {
              const intensity = h.value / 120;
              return (
                <div key={h.hour} title={`${h.hour}: ${h.value}%`} style={{
                  width: mobile ? 28 : 32, height: mobile ? 28 : 32, borderRadius: 6,
                  background: `rgba(168, 85, 247, ${intensity})`,
                  border: `1px solid ${C.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 9, color: intensity > 0.5 ? "#ffffff" : C.muted,
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
        </Card>

        <Card C={C}>
          <SectionTitle C={C}>Impressions by Day Part</SectionTitle>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={DAYPARTS.map(d => ({ name: d.label.split("/")[0], impressions: Math.round(d.impressions / 1000), cpm: d.cpm }))}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="name" tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} width={30} />
              <Tooltip contentStyle={{ background: C.tooltipBg, border: `1px solid ${C.border}`, borderRadius: 8, color: C.white }} formatter={(v) => `${v}K`} />
              <Bar dataKey="impressions" fill={C.purple2} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}

// ── TAB: Content ──────────────────────────────────────────────────────────────
function TabContent({ mobile, C }: { mobile: boolean; C: ReturnType<typeof useColors> }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 16 }}>
        <Card C={C}>
          <SectionTitle C={C}>Content Consumer Segments</SectionTitle>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={CONTENT_SEGMENTS} cx="50%" cy="50%" outerRadius={100} dataKey="count" nameKey="label" paddingAngle={3}>
                {CONTENT_SEGMENTS.map((seg, i) => <Cell key={i} fill={seg.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: C.tooltipBg, border: `1px solid ${C.border}`, borderRadius: 8, color: C.white }} />
              <Legend wrapperStyle={{ color: C.muted, fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card C={C}>
          <SectionTitle C={C}>Segment Breakdown</SectionTitle>
          {CONTENT_SEGMENTS.map(seg => (
            <div key={seg.label} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: C.white }}>{seg.label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: seg.color }}>{seg.count} people</span>
              </div>
              <ProgressBar value={seg.count} max={112} color={seg.color} C={C} />
            </div>
          ))}
        </Card>
      </div>

      <Card C={C}>
        <SectionTitle C={C}>Content Segment × Day Part</SectionTitle>
        <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, minWidth: 480 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                <th style={{ padding: "8px 14px", textAlign: "left", color: C.muted, fontWeight: 600, fontSize: 10 }}>Segment</th>
                {["Morning", "Eve News", "Primetime", "Late Night"].map(dp => (
                  <th key={dp} style={{ padding: "8px 14px", textAlign: "center", color: C.muted, fontWeight: 600, fontSize: 10 }}>{dp}</th>
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
                  <tr key={seg.label} style={{ borderBottom: `1px solid ${C.border}`, background: i % 2 === 0 ? "transparent" : C.bg3 }}>
                    <td style={{ padding: "10px 14px", color: C.white, fontWeight: 600, whiteSpace: "nowrap" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: seg.color, flexShrink: 0 }} />
                        {seg.label}
                      </span>
                    </td>
                    {byDP.map((c, j) => (
                      <td key={j} style={{ padding: "10px 14px", textAlign: "center", color: c > 5 ? C.white : C.muted, fontWeight: c > 5 ? 700 : 400 }}>{c}</td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ── TAB: Moods ────────────────────────────────────────────────────────────────
function TabMoods({ mobile, C }: { mobile: boolean; C: ReturnType<typeof useColors> }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 12 }}>
        {MOODS.map(m => (
          <div key={m.label} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, borderTop: `3px solid ${m.color}`, textAlign: "center" }}>
            <div style={{ fontSize: 38, fontWeight: 900, color: m.color, marginBottom: 4 }}>{m.count}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.white, marginBottom: 5 }}>{m.label}</div>
            <div style={{ fontSize: 11, color: C.muted }}>{m.desc}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 16 }}>
        <Card C={C}>
          <SectionTitle C={C}>Mood Distribution</SectionTitle>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={MOODS} cx="50%" cy="50%" outerRadius={90} innerRadius={45} dataKey="count" nameKey="label" paddingAngle={4}>
                {MOODS.map((m, i) => <Cell key={i} fill={m.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: C.tooltipBg, border: `1px solid ${C.border}`, borderRadius: 8, color: C.white }} />
              <Legend wrapperStyle={{ color: C.muted, fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card C={C}>
          <SectionTitle C={C}>Mood × Net Worth Correlation</SectionTitle>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={[
              { mood: "High Intent", "$1M+": 12, "$500K+": 14, "$250K+": 8, "Under": 5 },
              { mood: "In-Market",   "$1M+": 18, "$500K+": 24, "$250K+": 28, "Under": 24 },
              { mood: "Awareness",   "$1M+": 22, "$500K+": 38, "$250K+": 52, "Under": 56 },
              { mood: "Prospect",    "$1M+": 15, "$500K+": 26, "$250K+": 48, "Under": 78 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="mood" tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} width={28} />
              <Tooltip contentStyle={{ background: C.tooltipBg, border: `1px solid ${C.border}`, borderRadius: 8, color: C.white }} />
              <Legend wrapperStyle={{ color: C.muted, fontSize: 10 }} />
              <Bar dataKey="$1M+" stackId="a" fill={C.green} />
              <Bar dataKey="$500K+" stackId="a" fill={C.blue} />
              <Bar dataKey="$250K+" stackId="a" fill={C.purple2} />
              <Bar dataKey="Under" stackId="a" fill={C.muted} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}

// ── TAB: People ───────────────────────────────────────────────────────────────
function TabPeople({ mobile, C }: { mobile: boolean; C: ReturnType<typeof useColors> }) {
  const [, navigate] = useLocation();
  const [search, setSearch] = useState("");
  const [filterMood, setFilterMood] = useState("All");
  const [filterCity, setFilterCity] = useState("All");
  const lrProfiles = getProfilesByDashboard("land-rover");
  const windowColors = ["#4ade80", "#f59e0b", "#38bdf8"];

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
      {/* ── Featured Buyer Profiles ── */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: C.white, marginBottom: 4 }}>Featured Buyer Profiles</div>
        <div style={{ fontSize: 12, color: C.muted, marginBottom: 14 }}>3 identified individuals — click any profile to view their full buyer journey, intent signals, and personalized media recommendations.</div>
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "repeat(3, 1fr)", gap: 14 }}>
          {lrProfiles.map(profile => (
            <div
              key={profile.id}
              onClick={() => navigate(`/buyer/${profile.id}`)}
              style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "18px", cursor: "pointer", transition: "all 0.18s ease", borderTop: `3px solid ${profile.avatarColor}` }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = "translateY(-3px)"; el.style.boxShadow = `0 8px 24px ${profile.avatarColor}22`; el.style.borderColor = profile.avatarColor; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = "translateY(0)"; el.style.boxShadow = "none"; el.style.borderColor = C.border; }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: profile.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: "#fff", flexShrink: 0 }}>{profile.avatar}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.white }}>{profile.name}</div>
                  <div style={{ fontSize: 11, color: C.muted }}>{profile.age} · {profile.occupation}</div>
                </div>
              </div>
              <div style={{ background: `${profile.avatarColor}18`, border: `1px solid ${profile.avatarColor}33`, borderRadius: 8, padding: "8px 10px", marginBottom: 10 }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: profile.avatarColor, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 2 }}>🧬 Buyer DNA</div>
                <div style={{ fontSize: 11, color: C.white, lineHeight: 1.5 }}>{profile.buyerDNA}</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 5, marginBottom: 10 }}>
                {profile.purchaseWindows.map((pw, i) => (
                  <div key={pw.window} style={{ background: C.bg3, borderRadius: 7, padding: "7px 5px", textAlign: "center" }}>
                    <div style={{ fontSize: 13, fontWeight: 900, color: windowColors[i] }}>{pw.probability}%</div>
                    <div style={{ fontSize: 9, color: C.muted, lineHeight: 1.3 }}>{pw.window}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 10, fontWeight: 700, color: profile.avatarColor, textTransform: "uppercase", letterSpacing: "0.08em" }}>View Full Journey →</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Full People Table ── */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search name, city, company..."
          style={{ flex: 1, minWidth: 180, background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", color: C.white, fontSize: 13, outline: "none" }}
        />
        {[{ label: "Mood", val: filterMood, set: setFilterMood, opts: moods },
          { label: "City", val: filterCity, set: setFilterCity, opts: cities }].map(f => (
          <select key={f.label} value={f.val} onChange={e => f.set(e.target.value)} style={{
            background: C.card, border: `1px solid ${C.border}`, borderRadius: 8,
            padding: "10px 14px", color: C.white, fontSize: 13, outline: "none", cursor: "pointer",
            maxWidth: mobile ? 140 : 200,
          }}>
            {f.opts.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        ))}
        <div style={{ padding: "10px 14px", background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 13, color: C.muted, whiteSpace: "nowrap" }}>
          {filtered.length} of {PEOPLE.length}
        </div>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }}>
        <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, minWidth: mobile ? 600 : 900 }}>
            <thead>
              <tr style={{ background: C.bg3, borderBottom: `1px solid ${C.border}` }}>
                {(mobile
                  ? ["Name", "City", "Income", "Net Worth", "Score", "Mood"]
                  : ["Name", "City", "Age", "Income", "Net Worth", "Credit", "Job / Company", "Phones", "Score", "Mood", "Content", "Day Part"]
                ).map(h => (
                  <th key={h} style={{ padding: "10px 12px", textAlign: "left", color: C.muted, fontWeight: 600, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${C.border}`, background: i % 2 === 0 ? "transparent" : C.bg3 }}>
                  <td style={{ padding: "9px 12px", color: C.white, fontWeight: 700, whiteSpace: "nowrap" }}>{p.first} {p.last}</td>
                  <td style={{ padding: "9px 12px", color: C.muted, whiteSpace: "nowrap" }}>{p.city}</td>
                  {!mobile && <td style={{ padding: "9px 12px", color: C.muted, whiteSpace: "nowrap" }}>{p.age || "—"}</td>}
                  <td style={{ padding: "9px 12px", color: C.gold, whiteSpace: "nowrap" }}>{p.income || "—"}</td>
                  <td style={{ padding: "9px 12px", color: C.green, whiteSpace: "nowrap" }}>{p.networth || "—"}</td>
                  {!mobile && (
                    <td style={{ padding: "9px 12px", textAlign: "center" }}>
                      <span style={{ background: `${C.blue}22`, color: C.blue, borderRadius: 4, padding: "2px 7px", fontWeight: 700 }}>{p.credit || "—"}</span>
                    </td>
                  )}
                  {!mobile && (
                    <td style={{ padding: "9px 12px", color: C.muted, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {p.job ? <><span style={{ color: C.white }}>{p.job}</span> · {p.company}</> : p.company || "—"}
                    </td>
                  )}
                  {!mobile && <td style={{ padding: "9px 12px", textAlign: "center", color: C.white }}>{p.phone_count}</td>}
                  <td style={{ padding: "9px 12px", textAlign: "center" }}>
                    <span style={{ color: p.score >= 80 ? C.green : p.score >= 65 ? C.blue : p.score >= 50 ? C.gold : C.muted, fontWeight: 700 }}>{p.score}</span>
                  </td>
                  <td style={{ padding: "9px 12px", whiteSpace: "nowrap" }}>
                    <span style={{ color: moodColor[p.mood] || C.muted, fontWeight: 600 }}>{p.mood}</span>
                  </td>
                  {!mobile && <td style={{ padding: "9px 12px", color: C.muted, whiteSpace: "nowrap" }}>{p.content}</td>}
                  {!mobile && <td style={{ padding: "9px 12px", color: C.muted, whiteSpace: "nowrap" }}>{p.daypart}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Theme Toggle Button ───────────────────────────────────────────────────────
function ThemeToggle({ isDark, onToggle }: { isDark: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      style={{
        display: "flex", alignItems: "center", gap: 6,
        background: isDark ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.2)",
        border: "1px solid rgba(255,255,255,0.25)",
        borderRadius: 20, padding: "5px 12px",
        cursor: "pointer", fontSize: 11, fontWeight: 600,
        color: "#ffffff", letterSpacing: "0.04em",
        transition: "all 0.2s ease",
        flexShrink: 0,
      }}
    >
      <span style={{ fontSize: 14 }}>{isDark ? "☀️" : "🌙"}</span>
      {!false && <span>{isDark ? "Light" : "Dark"}</span>}
    </button>
  );
}

// ── TAB: Defender Pages ─────────────────────────────────────────────────────────────
function TabDefenderPages({ mobile, C }: { mobile: boolean; C: ReturnType<typeof useColors> }) {
  const [rangeDays, setRangeDays] = useState(14);
  const chartData = DEFENDER_PAGE_VIEWS.slice(-rangeDays).map(d => ({
    day: d.day.replace("May ", ""),
    "Def. 90":  d.defender90,
    "Def. 110": d.defender110,
    "Def. 130": d.defender130,
    "Overview": d.defenderOverview,
    "Range Rover": d.rangeRover,
    "Discovery": d.discovery,
  }));

  const totals = Object.values(DEFENDER_PAGE_TOTALS);
  const totalDefenderViews = totals.filter(p => p.label.startsWith("Defender")).reduce((s, p) => s + p.views, 0);
  const totalAllViews = totals.reduce((s, p) => s + p.views, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Defender KPI summary row */}
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr 1fr" : "repeat(4,1fr)", gap: 12 }}>
        <KpiCard label="Defender Page Views" value={totalDefenderViews.toLocaleString()} sub="Campaign to date" color={C.green} C={C} />
        <KpiCard label="Defender 110 Views" value={DEFENDER_PAGE_TOTALS.defender110.views.toLocaleString()} sub="Top Defender model" color={C.purple2} C={C} />
        <KpiCard label="Defender Overview" value={DEFENDER_PAGE_TOTALS.defenderOverview.views.toLocaleString()} sub="Landing page visits" color={C.gold} C={C} />
        <KpiCard label="Defender Share" value={`${Math.round(totalDefenderViews / totalAllViews * 100)}%`} sub="Of all site page views" color={C.blue} C={C} />
      </div>

      {/* Page view trend chart */}
      <Card C={C}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
          <SectionTitle C={C}>Page Views by Model — Daily Trend</SectionTitle>
          <div style={{ display: "flex", gap: 4 }}>
            {[{label:"7 Days",days:7},{label:"14 Days",days:14},{label:"30 Days",days:29}].map(r => (
              <button key={r.days} onClick={() => setRangeDays(r.days)} style={{
                padding: "4px 10px", fontSize: 10, fontWeight: 700, borderRadius: 6, cursor: "pointer",
                border: `1px solid ${rangeDays === r.days ? C.purple2 : C.border}`,
                background: rangeDays === r.days ? `${C.purple2}22` : "transparent",
                color: rangeDays === r.days ? C.purple2 : C.muted,
                transition: "all 0.15s", letterSpacing: "0.04em",
              }}>{r.label}</button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={mobile ? 200 : 260}>
          <AreaChart data={chartData}>
            <defs>
              {[
                { id: "gD90",  color: C.green   },
                { id: "gD110", color: C.purple2 },
                { id: "gD130", color: C.blue    },
                { id: "gDOv",  color: C.gold    },
                { id: "gRR",   color: C.red     },
                { id: "gDis",  color: "#fb923c" },
              ].map(g => (
                <linearGradient key={g.id} id={g.id} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={g.color} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={g.color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
            <XAxis dataKey="day" tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} width={36} />
            <Tooltip contentStyle={{ background: C.tooltipBg, border: `1px solid ${C.border}`, borderRadius: 8, color: C.white, fontSize: 11 }} />
            <Legend wrapperStyle={{ color: C.muted, fontSize: 10 }} />
            <Area type="monotone" dataKey="Def. 90"    stroke={C.green}   fill="url(#gD90)"  strokeWidth={2} />
            <Area type="monotone" dataKey="Def. 110"   stroke={C.purple2} fill="url(#gD110)" strokeWidth={2.5} />
            <Area type="monotone" dataKey="Def. 130"   stroke={C.blue}    fill="url(#gD130)" strokeWidth={2} />
            <Area type="monotone" dataKey="Overview"   stroke={C.gold}    fill="url(#gDOv)"  strokeWidth={2} />
            <Area type="monotone" dataKey="Range Rover" stroke={C.red}    fill="url(#gRR)"   strokeWidth={1.5} strokeDasharray="4 2" />
            <Area type="monotone" dataKey="Discovery"  stroke="#fb923c"   fill="url(#gDis)"  strokeWidth={1.5} strokeDasharray="4 2" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Per-page breakdown cards */}
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr 1fr", gap: 12 }}>
        {totals.map(page => (
          <div key={page.label} style={{
            background: C.card, border: `1px solid ${C.border}`, borderRadius: 12,
            padding: 20, borderLeft: `4px solid ${page.color}`,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.white, marginBottom: 3 }}>{page.label}</div>
                <div style={{ fontSize: 10, color: C.muted, letterSpacing: "0.04em" }}>{page.url}</div>
              </div>
              <div style={{ fontSize: 22, fontWeight: 900, color: page.color }}>{page.views.toLocaleString()}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <div style={{ background: C.bg3, borderRadius: 8, padding: "8px 12px" }}>
                <div style={{ fontSize: 9, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>Avg. Time on Page</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.white }}>{page.avgTime}</div>
              </div>
              <div style={{ background: C.bg3, borderRadius: 8, padding: "8px 12px" }}>
                <div style={{ fontSize: 9, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>Bounce Rate</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: page.bounce < 38 ? C.green : page.bounce < 44 ? C.gold : C.red }}>{page.bounce}%</div>
              </div>
            </div>
            <div style={{ marginTop: 10 }}>
              <ProgressBar value={page.views} max={totalAllViews} color={page.color} C={C} />
            </div>
          </div>
        ))}
      </div>

      {/* Defender vs non-Defender share */}
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 16 }}>
        <Card C={C}>
          <SectionTitle C={C}>Defender vs. Other Models — Page Share</SectionTitle>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={[
                  { name: "Defender 110", value: DEFENDER_PAGE_TOTALS.defender110.views },
                  { name: "Defender Overview", value: DEFENDER_PAGE_TOTALS.defenderOverview.views },
                  { name: "Defender 90", value: DEFENDER_PAGE_TOTALS.defender90.views },
                  { name: "Defender 130", value: DEFENDER_PAGE_TOTALS.defender130.views },
                  { name: "Range Rover", value: DEFENDER_PAGE_TOTALS.rangeRover.views },
                  { name: "Discovery", value: DEFENDER_PAGE_TOTALS.discovery.views },
                ]}
                cx="50%" cy="50%" innerRadius={55} outerRadius={88} paddingAngle={3} dataKey="value"
              >
                {[C.purple2, C.gold, C.green, C.blue, C.red, "#fb923c"].map((c, i) => <Cell key={i} fill={c} />)}
              </Pie>
              <Tooltip contentStyle={{ background: C.tooltipBg, border: `1px solid ${C.border}`, borderRadius: 8, color: C.white, fontSize: 11 }} />
              <Legend wrapperStyle={{ color: C.muted, fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card C={C}>
          <SectionTitle C={C}>Engagement Quality by Page</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingTop: 4 }}>
            {totals.map(page => (
              <div key={page.label}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: C.white, fontWeight: 600 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: page.color, flexShrink: 0 }} />
                    {page.label}
                  </span>
                  <span style={{ fontSize: 11, color: C.muted }}>{page.avgTime} avg · <span style={{ color: page.bounce < 38 ? C.green : page.bounce < 44 ? C.gold : C.red }}>{page.bounce}% bounce</span></span>
                </div>
                <ProgressBar value={100 - page.bounce} max={100} color={page.color} C={C} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

const TABS_LABELS = ["Overview","Channels","Creatives","Audience","Day Part","Content","Moods","People","Defender Pages"];

// ── Main Dashboard ─────────────────────────────────────────────────────────────
export default function Home() {
  const [, navigate] = useLocation();
  const [tab, setTab] = useState(0);
  const [time, setTime] = useState(new Date());
  const [exporting, setExporting] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const mobile = useIsMobile();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const C = useColors(isDark);

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  async function handleExport() {
    if (exporting || !contentRef.current) return;
    setExporting(true);
    try {
      const { default: jsPDF } = await import("jspdf");
      const { default: html2canvas } = await import("html2canvas");
      const el = contentRef.current;
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: isDark ? "#07071a" : "#f0f4f8",
        logging: false,
      });
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
      const tabName = TABS_LABELS[tab] ?? "Report";
      pdf.save(`ExactAudience_${CLIENT.name.replace(/\s+/g,"_")}_${tabName}_${new Date().toISOString().slice(0,10)}.pdf`);
    } catch (err) {
      console.error("PDF export failed", err);
    } finally {
      setExporting(false);
    }
  }

  const tabContent = [
    <TabOverview mobile={mobile} C={C} />,
    <TabChannels mobile={mobile} C={C} />,
    <TabCreatives mobile={mobile} C={C} />,
    <TabAudience mobile={mobile} C={C} />,
    <TabDayPart mobile={mobile} C={C} />,
    <TabContent mobile={mobile} C={C} />,
    <TabMoods mobile={mobile} C={C} />,
    <TabPeople mobile={mobile} C={C} />,
    <TabDefenderPages mobile={mobile} C={C} />,
  ];

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif", color: C.white, transition: "background 0.3s ease, color 0.3s ease" }}>
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.15} }
        @keyframes pdot  { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.4)} }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: ${C.scrollTrack}; }
        ::-webkit-scrollbar-thumb { background: ${C.scrollThumb}; border-radius: 3px; }
        input::placeholder { color: ${C.muted}; }
        select option { background: ${C.card}; color: ${C.white}; }
        * { box-sizing: border-box; }
      `}</style>

      {/* Header */}
      <div style={{
        background: C.headerBg,
        borderBottom: `1px solid ${isDark ? "#252560" : "rgba(255,255,255,0.15)"}`,
        padding: mobile ? "12px 16px" : "14px 28px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 200,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: mobile ? 10 : 16, minWidth: 0 }}>
          <button onClick={() => navigate("/campaigns")} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 8, padding: "5px 10px", color: "#f1f5f9", fontSize: 11, cursor: "pointer", flexShrink: 0, whiteSpace: "nowrap" }}>← Campaigns</button>
          <div style={{ width: 1, height: 24, background: "rgba(255,255,255,0.2)", flexShrink: 0 }} />
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <span style={{ width: 8, height: 8, background: "#a855f7", borderRadius: "50%", boxShadow: `0 0 10px #a855f7`, animation: "pdot 2s ease-in-out infinite", flexShrink: 0 }} />
            <img src="/ea-logo.png" alt="Exact Audience" style={{ height: mobile ? 16 : 20, objectFit: "contain", filter: "brightness(1.1)" }} />
          </div>
          {!mobile && <div style={{ width: 1, height: 30, background: "rgba(255,255,255,0.2)" }} />}
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: mobile ? 12 : 14, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: "#ffffff" }}>{CLIENT.name}</div>
            {!mobile && <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)" }}>{CLIENT.location} · {CLIENT.vertical} · {CLIENT.campaign}</div>}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: mobile ? 6 : 10, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(74,222,128,.15)", border: "1px solid rgba(74,222,128,.35)", borderRadius: 20, padding: "4px 10px", fontSize: 10, fontWeight: 700, color: "#4ade80", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            <span style={{ width: 6, height: 6, background: "#4ade80", borderRadius: "50%", animation: "blink 1.2s ease-in-out infinite" }} />
            Live
          </div>
          {!mobile && <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", fontFamily: "monospace" }}>{time.toLocaleTimeString()}</div>}
          {!mobile && (
            <button
              onClick={handleExport}
              disabled={exporting}
              title="Download PDF report of current tab"
              style={{
                display: "flex", alignItems: "center", gap: 5,
                background: exporting ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.25)",
                borderRadius: 20, padding: "5px 12px",
                cursor: exporting ? "not-allowed" : "pointer",
                fontSize: 11, fontWeight: 600, color: "#ffffff",
                letterSpacing: "0.04em", transition: "all 0.2s ease",
                flexShrink: 0, opacity: exporting ? 0.6 : 1,
              }}
            >
              <span style={{ fontSize: 13 }}>{exporting ? "⏳" : "📄"}</span>
              <span>{exporting ? "Exporting..." : "Export PDF"}</span>
            </button>
          )}
          <ThemeToggle isDark={isDark} onToggle={toggleTheme ?? (() => {})} />
        </div>
      </div>

      {/* Tab Bar */}
      <div style={{ background: C.bg2, borderBottom: `1px solid ${C.border}`, padding: mobile ? "0 8px" : "0 28px", display: "flex", overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
        {TABS.map((t, i) => (
          <button key={t} onClick={() => setTab(i)} style={{
            padding: mobile ? "11px 12px" : "13px 18px",
            fontSize: mobile ? 11 : 12, fontWeight: 600,
            color: tab === i ? C.white : C.muted,
            background: "transparent", border: "none", cursor: "pointer",
            borderBottom: `2px solid ${tab === i ? C.purple2 : "transparent"}`,
            whiteSpace: "nowrap", transition: "all .2s", letterSpacing: "0.03em",
            flexShrink: 0,
          }}>
            {t}
          </button>
        ))}
      </div>

      {/* Content */}
      <div ref={contentRef} style={{ padding: mobile ? "16px 12px" : "24px 28px" }}>
        {tabContent[tab]}
      </div>

      {/* Footer */}
      <div style={{ borderTop: `1px solid ${C.border}`, padding: mobile ? "12px 16px" : "14px 28px", display: "flex", flexDirection: mobile ? "column" : "row", justifyContent: "space-between", alignItems: mobile ? "flex-start" : "center", gap: 4, fontSize: 10, color: C.muted }}>
        <span>Exact Audience · exactaudience.ai</span>
        <span>Powered by Google DV360 · Exact Audience Intelligence</span>
        {!mobile && <span>Data refreshes every 8 seconds</span>}
      </div>
    </div>
  );
}
