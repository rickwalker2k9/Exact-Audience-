/**
 * GenericDashboard.tsx — Reusable Campaign Dashboard
 * Accepts all data as props so it can render Lamborghini, Warby Parker,
 * PolicyGenius, or any future client without code duplication.
 * Design: Dark command-center (default) + light mode via ThemeContext
 */

import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { getProfilesByDashboard, type BuyerProfile } from "@/lib/buyerProfiles";
import type { PGPerson } from "@/lib/policyGeniusPeopleSegment";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { useTheme } from "../contexts/ThemeContext";
import { getNetworkLogo, getNetworkInitials } from "../lib/networkLogos";

// ── Types ─────────────────────────────────────────────────────────────────────
export interface DashClientInfo {
  name: string;
  location: string;
  vertical: string;
  campaign: string;
  budget: string;
  website: string;
  accentColor: string;   // brand accent (e.g. "#d4a017" for Lamborghini)
  dashboardId: BuyerProfile["dashboardId"];  // used to look up buyer profiles
}

export interface DashLiveBase {
  impressions: number;
  reach: number;
  completions: number;
  siteVisitors: number;
  conversions: number;
  frequency: number;
  completionRate: number;
  avgCpm: number;
}

export interface DashDailyRow {
  day: string;
  ctv?: number;
  youtube: number;
  display: number;
  meta?: number;
  google?: number;
  email?: number;
  qr?: number;
}

export interface DashMediaMixRow {
  channel: string;
  impressions: number;
  spend: number;
  pct: number;
  color: string;
}

export interface DashCtvChannel {
  name: string;
  impressions: number;
  completions: number;
  cpm: number;
  frequency: number;
  completionRate: number;
  color: string;
}

export interface DashCreative {
  name: string;
  impressions: number;
  completions: number;
  cpm: number;
  completionRate: number;
  format: string;
}

export interface DashMood {
  label: string;
  count: number;
  color: string;
  desc: string;
}

export interface DashVisitor {
  first: string;
  last: string;
  city: string;
  zip: string;
  income: string;
  networth: string;
  credit: string;
  job: string;
  company: string;
  score: number;
  mood: string;
  vehicle?: string;
  time: string;
}

export interface DashSitePage {
  label: string;
  views: number;
  avgTime: string;
  bounce: number;
  color: string;
}

export interface DashWebTraffic {
  globalRank: number;
  monthlyVisits: number;
  bounceRate: number;
  visitsTrend: number[];
  visitsDates: string[];
  trafficSources: { Search: number; Social: number; Mail: number; DisplayAds: number; Direct: number; Referrals: number };
  topKeywords?: { keyword: string; volume: string; position: number; trend: "up" | "down" | "flat" }[];
  topPages?: { url: string; label: string; views: string; bounce: number }[];
}

export interface DashQR {
  totalScans: number;
  uniqueDevices: number;
  conversionRate: number;
  avgTimeToConvert: string;
  placements: { location: string; scans: number; conversions: number }[];
}

export interface GenericDashboardProps {
  client: DashClientInfo;
  liveBase: DashLiveBase;
  dailyImpressions: DashDailyRow[];
  mediaMix: DashMediaMixRow[];
  ctvChannels: DashCtvChannel[];
  ctvRecommendationsMode?: boolean;
  creatives: DashCreative[];
  moods: DashMood[];
  visitors: DashVisitor[];
  sitePages: DashSitePage[];
  sitePagesLabel?: string;   // e.g. "Defender Pages", "Product Pages", "Insurance Pages"
  qr?: DashQR;
  webTraffic?: DashWebTraffic;
  audienceSegment?: PGPerson[];
  audienceSegmentStats?: { totalList: number; homeowners: number; avgIncomeLabel: string; netWorthLabel: string; creditGrade: string; withPhone: number; withEmail: number; targetUniverse: number; };
}

// ── Theme colors ──────────────────────────────────────────────────────────────
function useColors(isDark: boolean) {
  return isDark ? {
    bg: "#07071a", bg2: "#0d0d28", bg3: "#12123a",
    card: "#0f0f2e", card2: "#141440", border: "#252560",
    purple: "#7c3aed", purple2: "#a855f7", purple3: "#c084fc",
    green: "#4ade80", gold: "#f59e0b", blue: "#38bdf8",
    red: "#fb923c", white: "#f1f5f9", muted: "#8892b0",
    headerBg: "linear-gradient(135deg,#0a0a22,#1a0840)",
    tooltipBg: "#141440", scrollTrack: "#0d0d28", scrollThumb: "#252560",
  } : {
    bg: "#f0f4f8", bg2: "#e8edf5", bg3: "#dde4ef",
    card: "#ffffff", card2: "#f8fafc", border: "#c8d4e8",
    purple: "#7c3aed", purple2: "#7c3aed", purple3: "#9333ea",
    green: "#16a34a", gold: "#d97706", blue: "#0284c7",
    red: "#ea580c", white: "#1e293b", muted: "#64748b",
    headerBg: "linear-gradient(135deg,#1e1b4b,#312e81)",
    tooltipBg: "#ffffff", scrollTrack: "#e8edf5", scrollThumb: "#c8d4e8",
  };
}

function useIsMobile() {
  const [mobile, setMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 768);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return mobile;
}

function useTick(base: number, step: number, interval = 8000) {
  const [val, setVal] = useState(base);
  useEffect(() => {
    const id = setInterval(() => setVal(v => v + step), interval);
    return () => clearInterval(id);
  }, [step, interval]);
  return val;
}

function fmt(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toLocaleString();
}

// ── Sub-components ────────────────────────────────────────────────────────────
type C = ReturnType<typeof useColors>;

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
      <span style={{ width: 3, height: 14, background: C.purple2, borderRadius: 2, display: "inline-block", flexShrink: 0 }} />
      {children}
    </div>
  );
}

function ProgressBar({ value, max, color, C }: { value: number; max: number; color?: string; C: C }) {
  return (
    <div style={{ background: C.bg3, borderRadius: 4, height: 6, overflow: "hidden" }}>
      <div style={{ width: `${Math.min(100, (value / max) * 100)}%`, background: color ?? C.purple2, height: "100%", borderRadius: 4, transition: "width 0.6s ease" }} />
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

function VisitorFeed({ visitors, C }: { visitors: DashVisitor[]; C: C }) {
  const [idx, setIdx] = useState(0);
  const [fade, setFade] = useState(true);
  useEffect(() => {
    const id = setInterval(() => {
      setFade(false);
      setTimeout(() => { setIdx(i => (i + 1) % visitors.length); setFade(true); }, 400);
    }, 4000);
    return () => clearInterval(id);
  }, [visitors.length]);
  const v = visitors[idx];
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
          {[["Job", v.job || "—"], ["Company", v.company], ["Income", v.income], ["Net Worth", v.networth], ["Credit", v.credit], ["Intent Score", String(v.score)]].map(([k, val]) => (
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
const DATE_RANGES = [{ label: "Last 7 Days", days: 7 }, { label: "Last 14 Days", days: 14 }, { label: "Last 30 Days", days: 29 }];

function TabOverview({ mobile, C, liveBase, dailyImpressions, mediaMix, visitors, accentColor }: {
  mobile: boolean; C: C; liveBase: DashLiveBase;
  dailyImpressions: DashDailyRow[]; mediaMix: DashMediaMixRow[];
  visitors: DashVisitor[]; accentColor: string;
}) {
  const impressions = useTick(liveBase.impressions, 1247);
  const completions = useTick(liveBase.completions, 1089);
  const reach = useTick(liveBase.reach, 23);
  const siteVisitors = useTick(liveBase.siteVisitors, 1);
  const [rangeDays, setRangeDays] = useState(14);

  const chartData = dailyImpressions.slice(-rangeDays).map(d => ({
    day: d.day.replace("May ", ""),
    ...(d.ctv ? { CTV: Math.round(d.ctv / 1000) } : {}),
    YouTube: Math.round(d.youtube / 1000),
    Display: Math.round(d.display / 1000),
    ...(d.meta ? { Meta: Math.round(d.meta / 1000) } : {}),
    ...(d.google ? { Google: Math.round(d.google / 1000) } : {}),
  }));

  const rangeLabel = DATE_RANGES.find(r => r.days === rangeDays)?.label ?? "Last 14 Days";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr 1fr" : "1fr 1fr 1fr 1fr", gap: 12 }}>
        <KpiCard label="Total Impressions" value={fmt(impressions)} sub="↑ 3.2% vs last week" color={accentColor} C={C} />
        <KpiCard label="Completed Views" value={fmt(completions)} sub={`${liveBase.completionRate}% completion`} color={C.green} C={C} />
        <KpiCard label="Unique Reach" value={fmt(reach)} sub={`${liveBase.frequency}x avg frequency`} color={C.blue} C={C} />
        <KpiCard label="SiteID Visitors" value={fmt(siteVisitors)} sub="Identified by name & address" color={C.gold} C={C} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
        <Card C={C}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: C.muted }}>Daily Delivery — {rangeLabel} (000s)</span>
            <div style={{ display: "flex", gap: 4 }}>
              {DATE_RANGES.map(r => (
                <button key={r.days} onClick={() => setRangeDays(r.days)} style={{
                  padding: "4px 10px", fontSize: 10, fontWeight: 700, borderRadius: 6, cursor: "pointer",
                  border: `1px solid ${rangeDays === r.days ? accentColor : C.border}`,
                  background: rangeDays === r.days ? `${accentColor}22` : "transparent",
                  color: rangeDays === r.days ? accentColor : C.muted,
                  transition: "all 0.15s",
                }}>{r.label.replace("Last ", "")}</button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={mobile ? 180 : 220}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="gCTV2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={accentColor} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={accentColor} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gYT2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.red} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={C.red} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gDSP2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.blue} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={C.blue} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="day" tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} width={30} />
              <Tooltip contentStyle={{ background: C.tooltipBg, border: `1px solid ${C.border}`, borderRadius: 8, color: C.white, fontSize: 12 }} />
              <Legend wrapperStyle={{ color: C.muted, fontSize: 11 }} />
              <Area type="monotone" dataKey="CTV" stroke={accentColor} fill="url(#gCTV2)" strokeWidth={2} />
              <Area type="monotone" dataKey="YouTube" stroke={C.red} fill="url(#gYT2)" strokeWidth={2} />
              <Area type="monotone" dataKey="Display" stroke={C.blue} fill="url(#gDSP2)" strokeWidth={2} />
              {chartData[0]?.Meta !== undefined && <Area type="monotone" dataKey="Meta" stroke="#1877f2" fill="none" strokeWidth={1.5} strokeDasharray="4 2" />}
              {chartData[0]?.Google !== undefined && <Area type="monotone" dataKey="Google" stroke="#34a853" fill="none" strokeWidth={1.5} strokeDasharray="4 2" />}
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Channel Mix + Budget Pacing */}
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 16 }}>
        <Card C={C}>
          <SectionTitle C={C}>Channel Mix — Impression Share</SectionTitle>
          {mobile ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {mediaMix.map(item => (
                <div key={item.channel}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, color: C.white, fontWeight: 600 }}>
                      <span style={{ width: 10, height: 10, borderRadius: "50%", background: item.color, flexShrink: 0 }} />
                      {item.channel}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: item.color }}>{item.pct}%</span>
                  </div>
                  <ProgressBar value={item.pct} max={100} color={item.color} C={C} />
                </div>
              ))}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={mediaMix.map(m => ({ name: m.channel, value: m.pct }))}
                  cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                  {mediaMix.map((m, i) => <Cell key={i} fill={m.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: C.tooltipBg, border: `1px solid ${C.border}`, borderRadius: 8, color: C.white }} formatter={(v) => `${v}%`} />
                <Legend wrapperStyle={{ color: C.muted, fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card C={C}>
          <SectionTitle C={C}>Budget Pacing</SectionTitle>
          {mediaMix.map(r => (
            <div key={r.channel} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 12, color: C.white }}>{r.channel}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: r.color }}>{Math.round(60 + r.pct * 0.4)}%</span>
              </div>
              <ProgressBar value={Math.round(60 + r.pct * 0.4)} max={100} color={r.color} C={C} />
            </div>
          ))}
        </Card>
      </div>

      {/* SiteID Visitor Feed — moved below channel mix */}
      <VisitorFeed visitors={visitors} C={C} />
    </div>
  );
}

// ── TAB: Channels ─────────────────────────────────────────────────────────────
function TabChannels({ mobile, C, ctvChannels, mediaMix, qr, ctvRecommendationsMode }: {
  mobile: boolean; C: C; ctvChannels: DashCtvChannel[]; mediaMix: DashMediaMixRow[]; qr?: DashQR; ctvRecommendationsMode?: boolean;
}) {
  const [sort, setSort] = useState<"impressions" | "cpm" | "completionRate">("impressions");
  const sorted = [...ctvChannels].sort((a, b) => b[sort] - a[sort]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Card C={C}>
        <div style={{ display: "flex", flexDirection: mobile ? "column" : "row", justifyContent: "space-between", alignItems: mobile ? "flex-start" : "center", gap: 12, marginBottom: 16 }}>
          <SectionTitle C={C}>{ctvRecommendationsMode ? "CTV Streaming — Recommended Channels" : "CTV Streaming — Channel Inventory"}</SectionTitle>
          {ctvRecommendationsMode && (
            <div style={{ marginBottom: 14, padding: "10px 14px", borderRadius: 8, background: "rgba(14,165,233,0.12)", border: "1px solid rgba(14,165,233,0.3)", fontSize: 12, color: C.muted, lineHeight: 1.6 }}>
              <span style={{ color: C.blue, fontWeight: 700 }}>📺 CTV Recommendation</span> — Breeze has not yet activated CTV/OTT advertising. The channels below represent the <strong style={{ color: C.white }}>recommended inventory</strong> for a future CTV buy based on your target audience (self-employed professionals, healthcare workers, income protection seekers). Estimated CPMs and completion rates are based on current market benchmarks.
            </div>
          )}
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

      {/* Digital channels summary */}
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 16 }}>
        <Card C={C}>
          <SectionTitle C={C}>Digital Channel Mix</SectionTitle>
          {mediaMix.filter(m => m.channel !== "CTV Streaming").map(m => (
            <div key={m.channel} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 12, color: C.white, fontWeight: 600 }}>{m.channel}</span>
                <span style={{ fontSize: 11, color: C.gold }}>${(m.spend / 1000).toFixed(1)}K spend</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: C.muted }}>{fmt(m.impressions)} impr · {m.pct}% share</span>
              </div>
              <ProgressBar value={m.pct} max={30} color={m.color} C={C} />
            </div>
          ))}
        </Card>

        {qr ? (
          <Card C={C}>
            <SectionTitle C={C}>QR Code Activation</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
              {[
                { label: "Total Scans", value: fmt(qr.totalScans), color: C.gold },
                { label: "Unique Devices", value: fmt(qr.uniqueDevices), color: C.blue },
                { label: "Conversion Rate", value: `${qr.conversionRate}%`, color: C.green },
                { label: "Avg Time to Convert", value: qr.avgTimeToConvert, color: C.purple2 },
              ].map(s => (
                <div key={s.label} style={{ background: C.bg3, borderRadius: 10, padding: "12px 14px" }}>
                  <div style={{ fontSize: 10, color: C.muted, marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: s.color }}>{s.value}</div>
                </div>
              ))}
            </div>
            {qr.placements.map(p => (
              <div key={p.location} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: C.white, fontWeight: 600 }}>{p.location}</span>
                  <span style={{ fontSize: 11, color: C.green }}>{p.conversions} conv</span>
                </div>
                <ProgressBar value={p.scans} max={qr.totalScans} color={C.gold} C={C} />
              </div>
            ))}
          </Card>
        ) : (
          <Card C={C}>
            <SectionTitle C={C}>Channel Spend Distribution</SectionTitle>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={mediaMix} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} horizontal={false} />
                <XAxis type="number" tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis dataKey="channel" type="category" tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} width={110} />
                <Tooltip contentStyle={{ background: C.tooltipBg, border: `1px solid ${C.border}`, borderRadius: 8, color: C.white }} formatter={(v) => `$${Number(v).toLocaleString()}`} />
                <Bar dataKey="spend" radius={[0, 4, 4, 0]}>
                  {mediaMix.map((m, i) => <Cell key={i} fill={m.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}
      </div>
    </div>
  );
}

// ── TAB: Creatives ────────────────────────────────────────────────────────────
function TabCreatives({ mobile, C, creatives }: { mobile: boolean; C: C; creatives: DashCreative[] }) {
  const chartData = creatives.map(c => ({ name: c.format, CPM: c.cpm, VCR: c.completionRate }));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 14 }}>
        {creatives.map(cr => (
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

// ── TAB: Moods ────────────────────────────────────────────────────────────────
function TabMoods({ mobile, C, moods }: { mobile: boolean; C: C; moods: DashMood[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 12 }}>
        {moods.map(m => (
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
              <Pie data={moods} cx="50%" cy="50%" outerRadius={90} innerRadius={45} dataKey="count" nameKey="label" paddingAngle={4}>
                {moods.map((m, i) => <Cell key={i} fill={m.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: C.tooltipBg, border: `1px solid ${C.border}`, borderRadius: 8, color: C.white }} />
              <Legend wrapperStyle={{ color: C.muted, fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
        <Card C={C}>
          <SectionTitle C={C}>Mood Breakdown</SectionTitle>
          {moods.map(m => (
            <div key={m.label} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 13, color: C.white, fontWeight: 600 }}>{m.label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: m.color }}>{m.count} people</span>
              </div>
              <ProgressBar value={m.count} max={Math.max(...moods.map(x => x.count))} color={m.color} C={C} />
              <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>{m.desc}</div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

// ── TAB: Site Pages ───────────────────────────────────────────────────────────
function TabSitePages({ mobile, C, sitePages, label, dailyImpressions, accentColor }: {
  mobile: boolean; C: C; sitePages: DashSitePage[]; label: string;
  dailyImpressions: DashDailyRow[]; accentColor: string;
}) {
  const [rangeDays, setRangeDays] = useState(14);
  const totalViews = sitePages.reduce((s, p) => s + p.views, 0);

  const chartData = dailyImpressions.slice(-rangeDays).map((d, i) => {
    const base = (d.ctv ?? d.youtube) / 1000;
    return {
      day: d.day.replace("May ", ""),
      ...Object.fromEntries(sitePages.map((p, pi) => [
        p.label.split(" ")[0],
        Math.round(base * (0.3 - pi * 0.04) * (1 + i * 0.01))
      ]))
    };
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr 1fr" : "repeat(3, 1fr)", gap: 12 }}>
        {[
          { label: "Total Page Views", value: fmt(totalViews), color: accentColor },
          { label: "Avg Bounce Rate", value: `${Math.round(sitePages.reduce((s, p) => s + p.bounce, 0) / sitePages.length)}%`, color: C.gold },
          { label: "Best Performer", value: sitePages.sort((a, b) => b.views - a.views)[0]?.label ?? "—", color: C.green },
        ].map(s => (
          <KpiCard key={s.label} label={s.label} value={s.value} color={s.color} C={C} />
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "3fr 2fr", gap: 16 }}>
        <Card C={C}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
            <SectionTitle C={C}>{label} — Daily Trend</SectionTitle>
            <div style={{ display: "flex", gap: 4 }}>
              {DATE_RANGES.map(r => (
                <button key={r.days} onClick={() => setRangeDays(r.days)} style={{
                  padding: "4px 10px", fontSize: 10, fontWeight: 700, borderRadius: 6, cursor: "pointer",
                  border: `1px solid ${rangeDays === r.days ? accentColor : C.border}`,
                  background: rangeDays === r.days ? `${accentColor}22` : "transparent",
                  color: rangeDays === r.days ? accentColor : C.muted,
                }}>{r.label.replace("Last ", "")}</button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="day" tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} width={30} />
              <Tooltip contentStyle={{ background: C.tooltipBg, border: `1px solid ${C.border}`, borderRadius: 8, color: C.white }} />
              <Legend wrapperStyle={{ color: C.muted, fontSize: 11 }} />
              {sitePages.map((p, i) => (
                <Area key={p.label} type="monotone" dataKey={p.label.split(" ")[0]} stroke={p.color} fill="none" strokeWidth={i === 0 ? 2.5 : 1.5} />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card C={C}>
          <SectionTitle C={C}>Page Performance</SectionTitle>
          {[...sitePages].sort((a, b) => b.views - a.views).map(page => (
            <div key={page.label} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: C.white, fontWeight: 600 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: page.color, flexShrink: 0 }} />
                  {page.label}
                </span>
                <span style={{ fontSize: 11, color: C.muted }}>{page.avgTime} avg · <span style={{ color: page.bounce < 38 ? C.green : page.bounce < 44 ? C.gold : C.red }}>{page.bounce}% bounce</span></span>
              </div>
              <ProgressBar value={page.views} max={Math.max(...sitePages.map(p => p.views))} color={page.color} C={C} />
              <div style={{ fontSize: 11, color: C.muted, marginTop: 3 }}>{fmt(page.views)} views</div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

// ── TAB: Web Traffic (SimilarWeb) ────────────────────────────────────────────
function TabWebTraffic({ mobile, C, webTraffic, accentColor }: {
  mobile: boolean; C: C; webTraffic: DashWebTraffic; accentColor: string;
}) {
  const { globalRank, monthlyVisits, bounceRate, visitsTrend, visitsDates, trafficSources, topKeywords, topPages } = webTraffic;
  const trendData = visitsTrend.map((v, i) => ({ month: visitsDates[i]?.slice(5) ?? i, visits: Math.round(v / 1000) }));
  const totalSrc = (trafficSources.Search || 0) + (trafficSources.Social || 0) + (trafficSources.Mail || 0) + (trafficSources.DisplayAds || 0) + (trafficSources.Direct || 0) + (trafficSources.Referrals || 0);
  const srcData = [
    { name: "Direct", value: Math.round((trafficSources.Direct / totalSrc) * 100), color: accentColor },
    { name: "Search", value: Math.round((trafficSources.Search / totalSrc) * 100), color: C.green },
    { name: "Referrals", value: Math.round((trafficSources.Referrals / totalSrc) * 100), color: C.gold },
    { name: "Social", value: Math.round((trafficSources.Social / totalSrc) * 100), color: C.blue },
    { name: "Display", value: Math.round((trafficSources.DisplayAds / totalSrc) * 100), color: C.purple2 },
    { name: "Email", value: Math.round((trafficSources.Mail / totalSrc) * 100), color: "#f472b6" },
  ].filter(s => s.value > 0);

  const defaultKeywords = [
    { keyword: "life insurance", volume: "2.4M", position: 3, trend: "up" as const },
    { keyword: "term life insurance", volume: "1.1M", position: 2, trend: "up" as const },
    { keyword: "homeowners insurance", volume: "890K", position: 5, trend: "flat" as const },
    { keyword: "insurance quotes", volume: "720K", position: 4, trend: "down" as const },
    { keyword: "renters insurance", volume: "540K", position: 6, trend: "up" as const },
    { keyword: "disability insurance", volume: "310K", position: 8, trend: "flat" as const },
  ];
  const keywords = topKeywords ?? defaultKeywords;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ padding: "8px 12px", borderRadius: 8, background: "rgba(14,165,233,0.08)", border: "1px solid rgba(14,165,233,0.2)", fontSize: 11, color: C.muted }}>
        <span style={{ color: C.blue, fontWeight: 700 }}>📊 SimilarWeb Data</span> — Website traffic analytics sourced from SimilarWeb (Apr 2026). Powered by Exact Audience behavioral intelligence layer.
      </div>
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 12 }}>
        <KpiCard label="Global Rank" value={`#${globalRank.toLocaleString()}`} color={accentColor} C={C} />
        <KpiCard label="Monthly Visits" value={monthlyVisits >= 1000000 ? `${(monthlyVisits / 1000000).toFixed(1)}M` : monthlyVisits >= 1000 ? `${Math.round(monthlyVisits / 1000)}K` : monthlyVisits.toLocaleString()} color={C.green} C={C} />
        <KpiCard label="Bounce Rate" value={`${bounceRate}%`} color={bounceRate < 45 ? C.green : bounceRate < 55 ? C.gold : C.red} C={C} />
        <KpiCard label="Traffic Sources" value={`${srcData.length} channels`} color={C.gold} C={C} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "3fr 2fr", gap: 16 }}>
        <Card C={C}>
          <SectionTitle C={C}>Monthly Visits Trend (6 months)</SectionTitle>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={trendData}>
              <defs><linearGradient id="swGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={accentColor} stopOpacity={0.3}/><stop offset="95%" stopColor={accentColor} stopOpacity={0}/></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="month" tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} width={35} tickFormatter={v => `${v}K`} />
              <Tooltip contentStyle={{ background: C.tooltipBg, border: `1px solid ${C.border}`, borderRadius: 8, color: C.white }} formatter={(v: number) => [`${v}K visits`, "Monthly Visits"]} />
              <Area type="monotone" dataKey="visits" stroke={accentColor} fill="url(#swGrad)" strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        <Card C={C}>
          <SectionTitle C={C}>Traffic Sources</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
            {srcData.map(s => (
              <div key={s.name}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: C.white, fontWeight: 600 }}>{s.name}</span>
                  <span style={{ fontSize: 12, color: s.color, fontWeight: 700 }}>{s.value}%</span>
                </div>
                <ProgressBar value={s.value} max={100} color={s.color} C={C} />
              </div>
            ))}
          </div>
        </Card>
      </div>
      <Card C={C}>
        <SectionTitle C={C}>Top Organic Keywords</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "repeat(3, 1fr)", gap: 10 }}>
          {keywords.map(kw => (
            <div key={kw.keyword} style={{ background: C.bg2, borderRadius: 8, padding: "10px 14px", border: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.white }}>{kw.keyword}</div>
                <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>Vol: {kw.volume} · Pos #{kw.position}</div>
              </div>
              <span style={{ fontSize: 16, color: kw.trend === "up" ? C.green : kw.trend === "down" ? C.red : C.gold }}>
                {kw.trend === "up" ? "↑" : kw.trend === "down" ? "↓" : "→"}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ── Theme Toggle ──────────────────────────────────────────────────────────────
function ThemeToggle({ isDark, onToggle }: { isDark: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} style={{
      display: "flex", alignItems: "center", gap: 6,
      background: isDark ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.2)",
      border: "1px solid rgba(255,255,255,0.25)", borderRadius: 20, padding: "5px 12px",
      cursor: "pointer", fontSize: 11, fontWeight: 600, color: "#ffffff",
      letterSpacing: "0.04em", transition: "all 0.2s ease", flexShrink: 0,
    }}>
      <span style={{ fontSize: 14 }}>{isDark ? "☀️" : "🌙"}</span>
      <span>{isDark ? "Light" : "Dark"}</span>
    </button>
  );
}

// ── TABS ──────────────────────────────────────────────────────────────────────
// TABS is built dynamically in the component to support optional Audience tab

// ── Main Component ────────────────────────────────────────────────────────────
// ── TabPeople ─────────────────────────────────────────────────────────────────
function TabPeople({ mobile, C, dashboardId, accentColor, audienceSegment, audienceSegmentStats }: {
  mobile: boolean; C: C; dashboardId: BuyerProfile["dashboardId"]; accentColor: string;
  audienceSegment?: PGPerson[];
  audienceSegmentStats?: { totalList: number; homeowners: number; avgIncomeLabel: string; netWorthLabel: string; creditGrade: string; withPhone: number; withEmail: number; targetUniverse: number; };
}) {
  const [, navigate] = useLocation();
  const profiles = getProfilesByDashboard(dashboardId);
  const windowColors = ["#4ade80", "#f59e0b", "#38bdf8"];
  const [search, setSearch] = useState("");
  const [filterState, setFilterState] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterGender, setFilterGender] = useState("All");
  const [showCount, setShowCount] = useState(20);

  const people = audienceSegment || [];
  const states = ["All", ...Array.from(new Set(people.map(p => p.state))).sort()];
  const statuses = ["All", "hot", "warm", "reached", "pending"];
  const genders = ["All", "Male", "Female"];
  const filtered = people.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = !q || `${p.firstName} ${p.lastName}`.toLowerCase().includes(q) || p.city.toLowerCase().includes(q) || p.state.toLowerCase().includes(q);
    const matchState = filterState === "All" || p.state === filterState;
    const matchStatus = filterStatus === "All" || p.status === filterStatus;
    const matchGender = filterGender === "All" || p.gender === filterGender;
    return matchSearch && matchState && matchStatus && matchGender;
  });
  const statusColor = (s: string) => s === "hot" ? "#f59e0b" : s === "warm" ? accentColor : s === "reached" ? "#38bdf8" : "#6b7280";
  const statusLabel = (s: string) => s === "hot" ? "HOT" : s === "warm" ? "WARM" : s === "reached" ? "REACHED" : "PENDING";

  return (
    <div style={{ padding: mobile ? "16px" : "24px 28px" }}>
      {/* Featured Profiles */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: C.white, marginBottom: 4 }}>Featured Buyer Profiles</div>
        <div style={{ fontSize: 12, color: C.muted }}>3 identified individuals — click any profile to view their full buyer journey, intent signals, and personalized media recommendations.</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
        {profiles.map(profile => (
          <div
            key={profile.id}
            onClick={() => navigate(`/buyer/${profile.id}`)}
            style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "20px", cursor: "pointer", transition: "all 0.18s ease", borderTop: `3px solid ${profile.avatarColor}`, position: "relative", overflow: "hidden" }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = "translateY(-3px)"; el.style.boxShadow = `0 8px 28px ${profile.avatarColor}22`; el.style.borderColor = profile.avatarColor; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = "translateY(0)"; el.style.boxShadow = "none"; el.style.borderColor = C.border; }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: profile.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: "#fff", flexShrink: 0, boxShadow: `0 0 12px ${profile.avatarColor}44` }}>{profile.avatar}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.white }}>{profile.name}</div>
                <div style={{ fontSize: 11, color: C.muted }}>{profile.age} · {profile.occupation}</div>
              </div>
            </div>
            <div style={{ fontSize: 11, color: C.muted, marginBottom: 10 }}>📍 {profile.location}</div>
            <div style={{ background: `${profile.avatarColor}18`, border: `1px solid ${profile.avatarColor}33`, borderRadius: 8, padding: "8px 10px", marginBottom: 12 }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: profile.avatarColor, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 3 }}>🧬 Buyer DNA</div>
              <div style={{ fontSize: 11, color: C.white, lineHeight: 1.5 }}>{profile.buyerDNA}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6, marginBottom: 12 }}>
              {profile.purchaseWindows.map((pw, i) => (
                <div key={pw.window} style={{ background: C.card2, borderRadius: 8, padding: "8px 6px", textAlign: "center" }}>
                  <div style={{ fontSize: 14, fontWeight: 900, color: windowColors[i] }}>{pw.probability}%</div>
                  <div style={{ fontSize: 9, color: C.muted, lineHeight: 1.3 }}>{pw.window}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 12 }}>
              {profile.tags.slice(0, 3).map(tag => (
                <span key={tag} style={{ background: `${profile.avatarColor}18`, border: `1px solid ${profile.avatarColor}33`, color: profile.avatarColor, fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 20 }}>{tag}</span>
              ))}
            </div>
            <div style={{ fontSize: 10, fontWeight: 700, color: profile.avatarColor, textTransform: "uppercase", letterSpacing: "0.08em" }}>View Full Journey →</div>
          </div>
        ))}
      </div>

      {/* Full Audience List — shown when audienceSegment is provided */}
      {people.length > 0 && audienceSegmentStats && (
        <div>
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 24, marginBottom: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: C.white, marginBottom: 4 }}>Target Audience List</div>
            <div style={{ fontSize: 12, color: C.muted }}>Full identified audience — search, filter, and explore every person in the target universe.</div>
          </div>
          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: mobile ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: 12, marginBottom: 16 }}>
            {[
              { label: "Total List", value: audienceSegmentStats.totalList.toLocaleString(), sub: "Identified targets", color: accentColor },
              { label: "Homeowners", value: "100%", sub: `All ${audienceSegmentStats.homeowners.toLocaleString()} verified`, color: "#4ade80" },
              { label: "With Email", value: audienceSegmentStats.withEmail.toLocaleString(), sub: "Personal emails on file", color: "#38bdf8" },
              { label: "With Phone", value: audienceSegmentStats.withPhone.toLocaleString(), sub: "Mobile reachable", color: "#f59e0b" },
            ].map(s => (
              <div key={s.label} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.white, marginTop: 2 }}>{s.label}</div>
                <div style={{ fontSize: 10, color: C.muted }}>{s.sub}</div>
              </div>
            ))}
          </div>
          {/* Filters */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12, alignItems: "center" }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, city, state..."
              style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "7px 12px", color: C.white, fontSize: 12, outline: "none", minWidth: 180, flex: 1 }} />
            {[{ label: "State", value: filterState, set: setFilterState, opts: states },
              { label: "Status", value: filterStatus, set: setFilterStatus, opts: statuses },
              { label: "Gender", value: filterGender, set: setFilterGender, opts: genders },
            ].map(f => (
              <select key={f.label} value={f.value} onChange={e => f.set(e.target.value)}
                style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "7px 10px", color: C.white, fontSize: 11, outline: "none", cursor: "pointer" }}>
                {f.opts.map(o => <option key={o} value={o}>{f.label === "Status" && o !== "All" ? o.toUpperCase() : o}</option>)}
              </select>
            ))}
            <div style={{ fontSize: 11, color: C.muted }}>{filtered.length.toLocaleString()} of {people.length}</div>
          </div>
          {/* Table */}
          <div style={{ overflowX: "auto", borderRadius: 12, border: `1px solid ${C.border}` }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
              <thead>
                <tr style={{ background: C.card2 }}>
                  {["Name","City","State","Age","Gender","Income","Net Worth","Credit","Ads","Completion","Product Interest","Status"].map(h => (
                    <th key={h} style={{ padding: "9px 10px", textAlign: "left", color: C.muted, fontWeight: 700, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap", borderBottom: `1px solid ${C.border}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0, showCount).map((p, i) => (
                  <tr key={p.id} style={{ background: i % 2 === 0 ? C.card : C.card2, transition: "background 0.12s" }}
                    onMouseEnter={e => (e.currentTarget.style.background = `${accentColor}18`)}
                    onMouseLeave={e => (e.currentTarget.style.background = i % 2 === 0 ? C.card : C.card2)}>
                    <td style={{ padding: "8px 10px", color: C.white, fontWeight: 600, whiteSpace: "nowrap" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 28, height: 28, borderRadius: "50%", background: accentColor + "33", border: `1px solid ${accentColor}55`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: accentColor, flexShrink: 0 }}>{p.firstName[0]}{p.lastName[0]}</div>
                        {p.firstName} {p.lastName}
                      </div>
                    </td>
                    <td style={{ padding: "8px 10px", color: C.muted }}>{p.city}</td>
                    <td style={{ padding: "8px 10px", color: C.muted }}>{p.state}</td>
                    <td style={{ padding: "8px 10px", color: C.muted }}>{p.ageRange}</td>
                    <td style={{ padding: "8px 10px", color: C.muted }}>{p.gender}</td>
                    <td style={{ padding: "8px 10px", color: C.white, whiteSpace: "nowrap" }}>{p.incomeRange.replace(" to ", "–")}</td>
                    <td style={{ padding: "8px 10px", color: C.white, whiteSpace: "nowrap" }}>{p.netWorth.replace(" to ", "–")}</td>
                    <td style={{ padding: "8px 10px" }}>
                      <span style={{ background: p.creditRating === "A" ? "#4ade8033" : p.creditRating === "B" ? "#38bdf833" : "#f59e0b33", color: p.creditRating === "A" ? "#4ade80" : p.creditRating === "B" ? "#38bdf8" : "#f59e0b", padding: "2px 7px", borderRadius: 20, fontSize: 10, fontWeight: 800 }}>{p.creditRating}</span>
                    </td>
                    <td style={{ padding: "8px 10px", color: C.white, textAlign: "center" }}>{p.adsSeen}</td>
                    <td style={{ padding: "8px 10px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div style={{ flex: 1, height: 4, background: C.border, borderRadius: 2, minWidth: 40 }}>
                          <div style={{ height: "100%", width: `${p.completionRate}%`, background: accentColor, borderRadius: 2 }} />
                        </div>
                        <span style={{ color: C.muted, fontSize: 10 }}>{p.completionRate}%</span>
                      </div>
                    </td>
                    <td style={{ padding: "8px 10px", color: C.muted, whiteSpace: "nowrap" }}>{p.productInterest}</td>
                    <td style={{ padding: "8px 10px" }}>
                      <span style={{ background: statusColor(p.status) + "22", color: statusColor(p.status), padding: "2px 8px", borderRadius: 20, fontSize: 9, fontWeight: 800, letterSpacing: "0.05em" }}>{statusLabel(p.status)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length > showCount && (
            <div style={{ textAlign: "center", marginTop: 14 }}>
              <button onClick={() => setShowCount(c => c + 20)} style={{ background: accentColor, color: "#fff", border: "none", borderRadius: 8, padding: "8px 20px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Show 20 more ({filtered.length - showCount} remaining)</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── TabAudienceSegment ───────────────────────────────────────────────────────
function TabAudienceSegment({ mobile, C, accentColor, people, stats }: {
  mobile: boolean; C: C; accentColor: string;
  people: PGPerson[];
  stats: { totalList: number; homeowners: number; avgIncomeLabel: string; netWorthLabel: string; creditGrade: string; withPhone: number; withEmail: number; targetUniverse: number; };
}) {
  const [search, setSearch] = useState("");
  const [filterState, setFilterState] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterGender, setFilterGender] = useState("All");
  const [showCount, setShowCount] = useState(20);

  const states = ["All", ...Array.from(new Set(people.map(p => p.state))).sort()];
  const statuses = ["All", "hot", "warm", "reached", "pending"];
  const genders = ["All", "Male", "Female"];

  const filtered = people.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = !q || `${p.firstName} ${p.lastName}`.toLowerCase().includes(q) || p.city.toLowerCase().includes(q) || p.state.toLowerCase().includes(q);
    const matchState = filterState === "All" || p.state === filterState;
    const matchStatus = filterStatus === "All" || p.status === filterStatus;
    const matchGender = filterGender === "All" || p.gender === filterGender;
    return matchSearch && matchState && matchStatus && matchGender;
  });

  const statusColor = (s: string) => s === "hot" ? "#f59e0b" : s === "warm" ? accentColor : s === "reached" ? "#38bdf8" : "#6b7280";
  const statusLabel = (s: string) => s === "hot" ? "HOT" : s === "warm" ? "WARM" : s === "reached" ? "REACHED" : "PENDING";

  return (
    <div style={{ padding: mobile ? "12px" : "24px 28px" }}>
      {/* Stats bar */}
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Total List", value: stats.totalList.toLocaleString(), sub: "Premium White Hot", color: accentColor },
          { label: "Homeowners", value: "100%", sub: `All ${stats.homeowners.toLocaleString()} verified`, color: "#4ade80" },
          { label: "With Email", value: stats.withEmail.toLocaleString(), sub: "Personal emails on file", color: "#38bdf8" },
          { label: "With Phone", value: stats.withPhone.toLocaleString(), sub: "Mobile reachable", color: "#f59e0b" },
        ].map(s => (
          <div key={s.label} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px" }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.white, marginTop: 2 }}>{s.label}</div>
            <div style={{ fontSize: 10, color: C.muted }}>{s.sub}</div>
          </div>
        ))}
      </div>
      {/* Filters */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14, alignItems: "center" }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search name, city, state..."
          style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "7px 12px", color: C.white, fontSize: 12, outline: "none", minWidth: 180, flex: 1 }}
        />
        {[{ label: "State", value: filterState, set: setFilterState, opts: states },
          { label: "Status", value: filterStatus, set: setFilterStatus, opts: statuses },
          { label: "Gender", value: filterGender, set: setFilterGender, opts: genders },
        ].map(f => (
          <select key={f.label} value={f.value} onChange={e => f.set(e.target.value)}
            style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "7px 10px", color: C.white, fontSize: 11, outline: "none", cursor: "pointer" }}>
            {f.opts.map(o => <option key={o} value={o}>{f.label === "Status" && o !== "All" ? o.toUpperCase() : o}</option>)}
          </select>
        ))}
        <div style={{ fontSize: 11, color: C.muted, marginLeft: "auto" }}>{filtered.length.toLocaleString()} of {people.length} shown</div>
      </div>
      {/* Table */}
      <div style={{ overflowX: "auto", borderRadius: 12, border: `1px solid ${C.border}` }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
          <thead>
            <tr style={{ background: C.card2 }}>
              {["Name","City","State","Age","Gender","Income","Net Worth","Credit","Ads","Completion","Product Interest","Status"].map(h => (
                <th key={h} style={{ padding: "9px 10px", textAlign: "left", color: C.muted, fontWeight: 700, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap", borderBottom: `1px solid ${C.border}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, showCount).map((p, i) => (
              <tr key={p.id} style={{ background: i % 2 === 0 ? C.card : C.card2, transition: "background 0.12s" }}
                onMouseEnter={e => (e.currentTarget.style.background = `${accentColor}18`)}
                onMouseLeave={e => (e.currentTarget.style.background = i % 2 === 0 ? C.card : C.card2)}>
                <td style={{ padding: "8px 10px", color: C.white, fontWeight: 600, whiteSpace: "nowrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: accentColor + "33", border: `1px solid ${accentColor}55`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: accentColor, flexShrink: 0 }}>{p.firstName[0]}{p.lastName[0]}</div>
                    {p.firstName} {p.lastName}
                  </div>
                </td>
                <td style={{ padding: "8px 10px", color: C.muted }}>{p.city}</td>
                <td style={{ padding: "8px 10px", color: C.muted }}>{p.state}</td>
                <td style={{ padding: "8px 10px", color: C.muted }}>{p.ageRange}</td>
                <td style={{ padding: "8px 10px", color: C.muted }}>{p.gender}</td>
                <td style={{ padding: "8px 10px", color: C.white, whiteSpace: "nowrap" }}>{p.incomeRange.replace(" to ", "–")}</td>
                <td style={{ padding: "8px 10px", color: C.white, whiteSpace: "nowrap" }}>{p.netWorth.replace(" to ", "–")}</td>
                <td style={{ padding: "8px 10px" }}>
                  <span style={{ background: p.creditRating === "A" ? "#4ade8033" : p.creditRating === "B" ? "#38bdf833" : "#f59e0b33", color: p.creditRating === "A" ? "#4ade80" : p.creditRating === "B" ? "#38bdf8" : "#f59e0b", padding: "2px 7px", borderRadius: 20, fontSize: 10, fontWeight: 800 }}>{p.creditRating}</span>
                </td>
                <td style={{ padding: "8px 10px", color: C.white, textAlign: "center" }}>{p.adsSeen}</td>
                <td style={{ padding: "8px 10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ flex: 1, height: 4, background: C.border, borderRadius: 2, minWidth: 40 }}>
                      <div style={{ height: "100%", width: `${p.completionRate}%`, background: accentColor, borderRadius: 2 }} />
                    </div>
                    <span style={{ color: C.muted, fontSize: 10 }}>{p.completionRate}%</span>
                  </div>
                </td>
                <td style={{ padding: "8px 10px", color: C.muted, whiteSpace: "nowrap" }}>{p.productInterest}</td>
                <td style={{ padding: "8px 10px" }}>
                  <span style={{ background: statusColor(p.status) + "22", color: statusColor(p.status), padding: "2px 8px", borderRadius: 20, fontSize: 9, fontWeight: 800, letterSpacing: "0.05em" }}>{statusLabel(p.status)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filtered.length > showCount && (
        <div style={{ textAlign: "center", marginTop: 14 }}>
          <button onClick={() => setShowCount(c => c + 20)} style={{ background: accentColor, color: "#fff", border: "none", borderRadius: 8, padding: "8px 20px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Show 20 more ({filtered.length - showCount} remaining)</button>
        </div>
      )}
    </div>
  );
}

export default function GenericDashboard(props: GenericDashboardProps) {
  const { client, liveBase, dailyImpressions, mediaMix, ctvChannels, creatives, moods, visitors, sitePages, sitePagesLabel = "Site Pages", qr, audienceSegment, audienceSegmentStats } = props;
  const [tab, setTab] = useState(0);
  const [time, setTime] = useState(new Date());
  const [exporting, setExporting] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const mobile = useIsMobile();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const C = useColors(isDark);
  const [, navigate] = useLocation();

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
      const canvas = await html2canvas(contentRef.current, { scale: 2, useCORS: true, backgroundColor: isDark ? "#07071a" : "#f0f4f8", logging: false });
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
      pdf.save(`ExactAudience_${client.name.replace(/\s+/g, "_")}_${TABS[tab]}_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (err) {
      console.error("PDF export failed", err);
    } finally {
      setExporting(false);
    }
  }

  const { webTraffic } = props;
  const TABS = [
    "Overview", "Channels", "Creatives", "Moods", "Site Pages", ...(webTraffic ? ["Web Traffic"] : []), "People",
  ];

  const tabContent = [
    <TabOverview mobile={mobile} C={C} liveBase={liveBase} dailyImpressions={dailyImpressions} mediaMix={mediaMix} visitors={visitors} accentColor={client.accentColor} />,
    <TabChannels mobile={mobile} C={C} ctvChannels={ctvChannels} mediaMix={mediaMix} qr={qr} ctvRecommendationsMode={props.ctvRecommendationsMode} />,
    <TabCreatives mobile={mobile} C={C} creatives={creatives} />,
    <TabMoods mobile={mobile} C={C} moods={moods} />,
    <TabSitePages mobile={mobile} C={C} sitePages={sitePages} label={sitePagesLabel} dailyImpressions={dailyImpressions} accentColor={client.accentColor} />,
    ...(webTraffic ? [<TabWebTraffic mobile={mobile} C={C} webTraffic={webTraffic} accentColor={client.accentColor} />] : []),
    <TabPeople mobile={mobile} C={C} dashboardId={client.dashboardId as BuyerProfile["dashboardId"]} accentColor={client.accentColor} audienceSegment={audienceSegment} audienceSegmentStats={audienceSegmentStats} />,
  ];

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif", color: C.white, transition: "background 0.3s ease, color 0.3s ease" }}>
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.15} }
        @keyframes pdot  { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.4)} }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: ${C.scrollTrack}; }
        ::-webkit-scrollbar-thumb { background: ${C.scrollThumb}; border-radius: 3px; }
        * { box-sizing: border-box; }
      `}</style>

      {/* Header */}
      <div style={{ background: C.headerBg, borderBottom: `1px solid ${isDark ? "#252560" : "rgba(255,255,255,0.15)"}`, padding: mobile ? "12px 16px" : "14px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 200 }}>
        <div style={{ display: "flex", alignItems: "center", gap: mobile ? 10 : 16, minWidth: 0 }}>
          <button onClick={() => navigate("/campaigns")} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 8, padding: "5px 10px", color: "#f1f5f9", fontSize: 11, cursor: "pointer", flexShrink: 0 }}>
            ← Campaigns
          </button>
          <div style={{ width: 1, height: 24, background: "rgba(255,255,255,0.2)", flexShrink: 0 }} />
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <span style={{ width: 8, height: 8, background: client.accentColor, borderRadius: "50%", boxShadow: `0 0 10px ${client.accentColor}`, animation: "pdot 2s ease-in-out infinite" }} />
            <img src="/manus-storage/ea-logo_6e5af419.png" alt="Exact Audience" style={{ height: mobile ? 18 : 22, objectFit: "contain", filter: "brightness(1.15)" }} />
          </div>
          {!mobile && <div style={{ width: 1, height: 30, background: "rgba(255,255,255,0.2)" }} />}
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: mobile ? 12 : 14, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: "#ffffff" }}>{client.name}</div>
            {!mobile && <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)" }}>{client.location} · {client.vertical} · {client.campaign}</div>}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: mobile ? 6 : 10, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(74,222,128,.15)", border: "1px solid rgba(74,222,128,.35)", borderRadius: 20, padding: "4px 10px", fontSize: 10, fontWeight: 700, color: "#4ade80", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            <span style={{ width: 6, height: 6, background: "#4ade80", borderRadius: "50%", animation: "blink 1.2s ease-in-out infinite" }} />
            Live
          </div>
          {!mobile && <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", fontFamily: "monospace" }}>{time.toLocaleTimeString()}</div>}
          {!mobile && (
            <button onClick={handleExport} disabled={exporting} style={{ display: "flex", alignItems: "center", gap: 5, background: exporting ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 20, padding: "5px 12px", cursor: exporting ? "not-allowed" : "pointer", fontSize: 11, fontWeight: 600, color: "#ffffff", transition: "all 0.2s ease", flexShrink: 0, opacity: exporting ? 0.6 : 1 }}>
              <span>{exporting ? "⏳" : "📄"}</span>
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
            padding: mobile ? "11px 12px" : "13px 18px", fontSize: mobile ? 11 : 12, fontWeight: 600,
            color: tab === i ? C.white : C.muted, background: "transparent", border: "none", cursor: "pointer",
            borderBottom: `2px solid ${tab === i ? client.accentColor : "transparent"}`,
            whiteSpace: "nowrap", transition: "all .2s", letterSpacing: "0.03em", flexShrink: 0,
          }}>{t}</button>
        ))}
      </div>

      {/* Content */}
      <div ref={contentRef} style={{ padding: mobile ? "16px 12px" : "24px 28px" }}>
        {tabContent[tab]}
      </div>

      {/* Footer */}
      <div style={{ borderTop: `1px solid ${C.border}`, padding: mobile ? "12px 16px" : "14px 28px", display: "flex", flexDirection: mobile ? "column" : "row", justifyContent: "space-between", alignItems: mobile ? "flex-start" : "center", gap: 4, fontSize: 10, color: C.muted }}>
        <span>Exact Audience · exactaudience.ai · siteid.ai</span>
        <span>Powered by Google DV360 · SiteID Intelligence</span>
        {!mobile && <span>Data refreshes every 8 seconds</span>}
      </div>
    </div>
  );
}
