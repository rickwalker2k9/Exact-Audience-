/**
 * McCartryDashboard.tsx
 * Colleen McCarty for Tulsa County District Attorney — June 16, 2026 Republican Primary
 * Political dashboard: Voter Intelligence, Debate Engagement, Vote Projections, CTV Performance
 * Framework: Jeff Starling Behavioral Intelligence model adapted for Tulsa County DA race
 */

import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useTheme } from "../contexts/ThemeContext";
import { getNetworkLogo, getNetworkInitials } from "../lib/networkLogos";
import { getProfilesByDashboard } from "@/lib/buyerProfiles";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  ReferenceLine
} from "recharts";
import {
  MCCARTY_CLIENT, MCCARTY_LIVE_BASE, MCCARTY_DAILY_IMPRESSIONS,
  MCCARTY_MEDIA_MIX, MCCARTY_CTV_CHANNELS, MCCARTY_CREATIVES,
  MCCARTY_MOODS, MCCARTY_VISITORS,
  MCCARTY_DEBATE_ENGAGEMENT, MCCARTY_VOTER_SEGMENTS,
  MCCARTY_VOTE_TARGET, MCCARTY_MOVED_VOTERS
} from "@/lib/mccartryData";
import { MCCARTY_PEOPLE_SEGMENT, SEGMENT_STATS, type VoterRecord } from "@/lib/mccartryPeopleSegment";

// ── Theme ─────────────────────────────────────────────────────────────────────
// McCarty palette: NO RED — deep navy + teal accent + gold
function useColors(isDark: boolean) {
  return isDark ? {
    bg: "#080c18",
    card: "#0d1120", card2: "#111828", border: "#1e2d45",
    // Primary accent: bright sky-blue — readable on dark backgrounds
    red: "#4da6e8", red2: "#60b8f5", red3: "#93d0fa",
    green: "#2dd4bf", gold: "#e0b030", blue: "#7ec8fb",
    white: "#e8eef6", muted: "#8fa4c0",
    headerBg: "linear-gradient(135deg,#07090f,#0d1a2e)",
    tooltipBg: "#111828", scrollTrack: "#0c0f1a", scrollThumb: "#1a2540",
  } : {
    bg: "#f0f4f8", bg2: "#e4ecf4", bg3: "#d8e4f0",
    card: "#ffffff", card2: "#f4f8fc", border: "#b8cce0",
    // Primary accent: deep navy-teal (NO red anywhere)
    red: "#1a4f7a", red2: "#2a6496", red3: "#3a85c0",
    green: "#0d9488", gold: "#b8860b", blue: "#1d6fa4",
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

// ── Sub-components ────────────────────────────────────────────────────────────
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
      <span style={{ width: 3, height: 14, background: C.red2, borderRadius: 2, display: "inline-block", flexShrink: 0, opacity: 0.7 }} />
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
      <div style={{ width: `${Math.min(100, (value / max) * 100)}%`, background: color ?? C.blue, height: "100%", borderRadius: 4, transition: "width 0.6s ease" }} />
    </div>
  );
}

// ── Live Voter Feed ───────────────────────────────────────────────────────────
function VoterFeed({ C }: { C: C }) {
  const [idx, setIdx] = useState(0);
  const [fade, setFade] = useState(true);
  useEffect(() => {
    const id = setInterval(() => {
      setFade(false);
      setTimeout(() => { setIdx(i => (i + 1) % MCCARTY_VISITORS.length); setFade(true); }, 400);
    }, 4000);
    return () => clearInterval(id);
  }, []);
  const v = MCCARTY_VISITORS[idx];
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, borderLeft: `3px solid ${C.green}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <span style={{ width: 8, height: 8, background: C.green, borderRadius: "50%", boxShadow: `0 0 8px ${C.green}`, animation: "blink 1.2s infinite", flexShrink: 0 }} />
        <span style={{ fontSize: 11, fontWeight: 700, color: C.green, textTransform: "uppercase", letterSpacing: "0.1em" }}>Live Voter Signal — Behavioral Intelligence</span>
      </div>
      <div style={{ opacity: fade ? 1 : 0, transition: "opacity 0.4s" }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: C.white, marginBottom: 4 }}>{v.name}</div>
        <div style={{ fontSize: 12, color: C.muted, marginBottom: 12 }}>{v.city} · Intent Score: {v.score}</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[["Latest Signal", v.signal], ["Voter Mood", v.mood], ["Persuasion Score", `${v.score}/100`], ["Status", v.score >= 85 ? "Threshold Met" : "In Progress"]].map(([k, val]) => (
            <div key={k} style={{ background: C.bg3, borderRadius: 8, padding: "8px 12px" }}>
              <div style={{ fontSize: 10, color: C.muted, marginBottom: 2 }}>{k}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: C.white }}>{val}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 10, background: `${C.gold}15`, border: `1px solid ${C.gold}33`, borderRadius: 8, padding: "8px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 11, color: C.muted }}>Voter Mood Signal</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: C.gold }}>{v.mood}</span>
        </div>
      </div>
    </div>
  );
}

// ── TAB: Overview ─────────────────────────────────────────────────────────────
const DATE_RANGES = [{ label: "7 Days", days: 7 }, { label: "14 Days", days: 14 }, { label: "30 Days", days: 16 }];

function TabOverview({ mobile, C }: { mobile: boolean; C: C }) {
  const { cumulativeImpressions, votersReached } = getCampaignDay();
  const impressions = useTick(cumulativeImpressions, 980);
  const reach = useTick(votersReached, 18);
  const [rangeDays, setRangeDays] = useState(14);

  const chartData = MCCARTY_DAILY_IMPRESSIONS.slice(-rangeDays).map(d => ({
    day: d.date.replace("May ", ""),
    rawDate: d.date,
    CTV: Math.round(d.impressions * 0.74 / 1000),
    Meta: Math.round(d.impressions * 0.10 / 1000),
    Google: Math.round(d.impressions * 0.06 / 1000),
    YouTube: Math.round(d.impressions * 0.05 / 1000),
    Email: Math.round(d.impressions * 0.03 / 1000),
  }));
  // Debate night x-axis labels that appear in the current slice
  const debateLabels = ["13", "19"].filter(lbl => chartData.some(d => d.day === lbl));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr 1fr" : "1fr 1fr 1fr 1fr", gap: 12 }}>
        <KpiCard label="Total Impressions" value={fmt(impressions)} sub="↑ 4.1% vs last week" color={C.red2} C={C} />
        <KpiCard label="Voters Reached" value={fmt(reach)} sub={`${MCCARTY_LIVE_BASE.frequency}x avg frequency`} color={C.green} C={C} />
        <KpiCard label="Completion Rate" value={`${MCCARTY_LIVE_BASE.completionRate}%`} sub="CTV ad completions" color={C.blue} C={C} />
        <KpiCard label="Voters Behaviorally Matched" value="3,684" sub="Named individuals via behavioral data" color={C.gold} C={C} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
        <Card C={C}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: C.muted }}>Daily Voter Delivery (000s)</span>
            <div style={{ display: "flex", gap: 4 }}>
              {DATE_RANGES.map(r => (
                <button key={r.days} onClick={() => setRangeDays(r.days)} style={{
                  padding: "4px 10px", fontSize: 10, fontWeight: 700, borderRadius: 6, cursor: "pointer",
                  border: `1px solid ${rangeDays === r.days ? C.red2 : C.border}`,
                  background: rangeDays === r.days ? `${C.red2}18` : "transparent",
                  color: rangeDays === r.days ? C.red2 : C.muted, transition: "all 0.15s",
                }}>{r.label}</button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={mobile ? 180 : 220}>
            <AreaChart data={chartData}>
              <defs>
                {[["gCTV", C.blue], ["gMeta", "#1877f2"], ["gYT", "#e05a6a"]].map(([id, color]) => (
                  <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="day" tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} width={30} />
              <Tooltip contentStyle={{ background: C.tooltipBg, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 11 }} />
              {debateLabels.map(lbl => (
                <ReferenceLine
                  key={lbl}
                  x={lbl}
                  stroke={C.gold}
                  strokeWidth={2}
                  strokeDasharray="4 3"
                  label={{ value: lbl === "13" ? "📺 Debate" : "▶ Replay", position: "top", fill: C.gold, fontSize: 9, fontWeight: 700 }}
                />
              ))}
              <Area type="monotone" dataKey="CTV" stroke={C.blue} fill="url(#gCTV)" strokeWidth={2} />
              <Area type="monotone" dataKey="Meta" stroke="#1877f2" fill="url(#gMeta)" strokeWidth={1.5} />
              <Area type="monotone" dataKey="YouTube" stroke="#e05a6a" fill="url(#gYT)" strokeWidth={1.5} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Daily Voter Movement Chart */}
      <Card C={C}>
        <SectionTitle C={C}>Daily Voters Moved to McCarty</SectionTitle>
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: C.muted }}>Voters confirmed moved per day via behavioral signals · Cumulative: <strong style={{ color: C.gold }}>1,120</strong></div>
        </div>
        <ResponsiveContainer width="100%" height={mobile ? 160 : 200}>
          <BarChart data={[
            { day: "May 28", voters: 280, label: "D1" },
            { day: "May 29", voters: 320, label: "D2" },
            { day: "May 30", voters: 240, label: "D3" },
            { day: "May 31", voters: 280, label: "D4" },
          ]} barSize={36}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
            <XAxis dataKey="label" tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} width={30} domain={[0, 400]} />
            <Tooltip
              contentStyle={{ background: C.tooltipBg, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 11 }}
              formatter={(val: number, _: string, entry: { payload?: { day?: string } }) => [`${val} voters moved`, entry.payload?.day ?? ""]}
            />
            <Bar dataKey="voters" fill={C.blue} radius={[6, 6, 0, 0]}>
              {[
                { day: "May 28", voters: 280, label: "D1" },
                { day: "May 29", voters: 320, label: "D2" },
                { day: "May 30", voters: 240, label: "D3" },
                { day: "May 31", voters: 280, label: "D4" },
              ].map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index === 3 ? C.gold : C.blue} />
              ))}
            </Bar>
            <ReferenceLine y={280} stroke={C.green} strokeDasharray="4 3" strokeWidth={1.5}
              label={{ value: "Avg 280/day", position: "right", fill: C.green, fontSize: 9, fontWeight: 700 }} />
          </BarChart>
        </ResponsiveContainer>
        <div style={{ display: "flex", gap: 16, marginTop: 8, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: C.blue }} />
            <span style={{ fontSize: 10, color: C.muted }}>Voters moved (prior days)</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: C.gold }} />
            <span style={{ fontSize: 10, color: C.muted }}>Today (Day 4)</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 10, height: 2, background: C.green }} />
            <span style={{ fontSize: 10, color: C.muted }}>Daily average</span>
          </div>
        </div>
      </Card>

      {/* Media Mix */}
      <Card C={C}>
        <SectionTitle C={C}>Media Mix — Budget Allocation</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 16 }}>
          <div>
            {MCCARTY_MEDIA_MIX.map(m => (
              <div key={m.channel} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: C.white }}>{m.channel}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: m.color }}>{m.pct}%</span>
                </div>
                <ProgressBar value={m.pct} max={100} color={m.color} C={C} />
                <div style={{ fontSize: 10, color: C.muted, marginTop: 3 }}>{fmt(m.impressions)} impressions · ${m.spend.toLocaleString()} spend</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ background: C.bg3, borderRadius: 10, padding: 16 }}>
              <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Campaign Budget</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: C.red2 }}>$22,000</div>
              <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>19-day campaign COMPLETE · May 28 – June 16, 2026 · Ended 10:00 AM CT</div>
            </div>
            <div style={{ background: C.bg3, borderRadius: 10, padding: 16 }}>
              <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>CTV Dominance</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: C.green }}>74%</div>
              <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>of all impressions delivered via CTV streaming</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Campaign Message & Issues */}
      <Card C={C}>
        <SectionTitle C={C}>Campaign Messaging — Colleen McCarty for DA</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 16, marginBottom: 16 }}>
          {/* Closing message from debate */}
          <div style={{ background: `${C.red2}0d`, border: `1px solid ${C.red2}30`, borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 10, color: C.red2, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: 8 }}>Campaign Message — Colleen McCarty for DA</div>
            <div style={{ fontSize: 13, color: C.white, lineHeight: 1.6, fontStyle: "italic", marginBottom: 8 }}>
              &ldquo;I will build a tough and ethical justice system that protects victims, holds criminals accountable, and restores trust in the DA&rsquo;s office.&rdquo;
            </div>
            <div style={{ fontSize: 10, color: C.muted }}>colleenmccarty.com · Campaign 2026</div>
          </div>
          {/* Race stakes */}
          <div style={{ background: `${C.green}0d`, border: `1px solid ${C.green}30`, borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 10, color: C.green, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: 8 }}>Why This Race Matters</div>
            <div style={{ fontSize: 12, color: C.white, lineHeight: 1.7 }}>
              Republican primary winner <strong style={{ color: C.green }}>IS the next Tulsa County DA</strong> — no Democratic opponent in the general. The winner of June 16 takes office. This is the election.
            </div>
          </div>
        </div>
        {/* Key Issues */}
        <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Key Issues Driving Voter Movement</div>
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "repeat(3, 1fr)", gap: 10 }}>
          {[
            { icon: "⚖️", label: "Accountability", desc: "Challenging Kunzweiler's 12-year record — calling for fresh leadership and prosecutorial reform", color: C.red2 },
            { icon: "🛡️", label: "Domestic Violence Reform", desc: "Championed the Oklahoma Survivors Act — protecting DV victims through policy change", color: C.blue },
            { icon: "🔍", label: "Richard Glossip Case", desc: "Raised concerns about the Glossip execution — accountability and integrity in capital cases", color: C.gold },
          ].map(issue => (
            <div key={issue.label} style={{ background: C.bg3, borderRadius: 10, padding: 14 }}>
              <div style={{ fontSize: 18, marginBottom: 6 }}>{issue.icon}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: issue.color, marginBottom: 4 }}>{issue.label}</div>
              <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.5 }}>{issue.desc}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Live Voter Signal Feed */}
      <VoterFeed C={C} />
    </div>
  );
}

// ── Vote Movement Tracker ───────────────────────────────────────────────────
function VoteMovementTracker({ C, mobile }: { C: C; mobile: boolean }) {
  const T = MCCARTY_VOTE_TARGET;
  // Use shared campaign day calculator for consistent day/budget values
  const { dayNum, daysLeft: daysLeftCalc, spentToDate, remainingBudget } = getCampaignDay();
  // Days remaining countdown
  const electionDay = new Date("2026-06-16");
  const today = new Date();
  const daysLeft = Math.max(1, daysLeftCalc);
  const pctToWin = Math.min(100, Math.round(((T.committedBase + T.movedToMcCarty) / T.winThreshold) * 100));
  const gapToWin = Math.max(0, T.winThreshold - T.committedBase - T.movedToMcCarty);
  // Votes needed per day to hit threshold by election day
  const votesPerDay = Math.ceil(gapToWin / daysLeft);
  const votersPerDayPace = Math.ceil(gapToWin / daysLeft);
  // Campaign timeline progress (Day X of 18)
  const campaignPct = Math.round((dayNum / 18) * 100);

  // High-priority undecided voters (score >= 68, still undecided)
  const highPriorityUndecided = MCCARTY_MOVED_VOTERS
    .filter(v => v.currentIntent === "Undecided" && v.score >= 68)
    .sort((a, b) => b.score - a.score);

  const exposuresNeeded = (score: number) => {
    if (score >= 80) return 1;
    if (score >= 74) return 2;
    if (score >= 68) return 3;
    return 4;
  };

  const recommendedAd = (voter: typeof MCCARTY_MOVED_VOTERS[0]) => {
    if (voter.lastSignal.includes("CTV")) return "CTV :15 — 'Victims First' retarget";
    if (voter.lastSignal.includes("Meta")) return "Meta :06 bumper — 'Accountability'";
    if (voter.lastSignal.includes("Google") || voter.lastSignal.includes("search")) return "Google Display — 'Blueprint for Justice'";
    if (voter.lastSignal.includes("site")) return "CTV :30 — 'Endorsement' + email follow-up";
    return "CTV :15 — 'Modern DA' awareness";
  };

  return (
    <div style={{ background: C.card, border: `1px solid ${C.red2}33`, borderRadius: 16, padding: 24, marginBottom: 16 }}>

      {/* ── Day X of 18 Campaign Timeline Strip ── */}
      <div style={{ background: `${C.blue}0d`, border: `1px solid ${C.blue}33`, borderRadius: 10, padding: "12px 16px", marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, flexWrap: "wrap", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 900, color: C.blue }}>✅ Campaign Complete — Day 19 of 19</span>
            <span style={{ fontSize: 11, color: C.muted }}>Campaign Timeline · Started May 28</span>
          </div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, color: C.muted }}>
              <span style={{ fontWeight: 700, color: C.green }}>Election Day</span> — Polls Open
            </span>
            <span style={{ fontSize: 11, color: C.muted }}>
              <span style={{ fontWeight: 700, color: C.green }}>$22,000</span> fully deployed
            </span>
            <span style={{ fontSize: 11, color: C.muted }}>
              <span style={{ fontWeight: 700, color: C.gold }}>8,840</span> voters moved to McCarty
            </span>
          </div>
        </div>
        {/* Progress bar */}
        <div style={{ background: `${C.blue}22`, borderRadius: 6, height: 10, overflow: "hidden", position: "relative" }}>
          <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${campaignPct}%`, background: `linear-gradient(90deg, ${C.blue}, ${C.red2})`, borderRadius: 6, transition: "width 0.6s ease" }} />
        </div>
        {/* Day tick marks */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
          {[1, 3, 6, 9, 12, 15, 18].map(d => (
            <div key={d} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
              <div style={{ width: 1, height: 4, background: d <= dayNum ? C.blue : C.border }} />
              <span style={{ fontSize: 9, color: d <= dayNum ? C.blue : C.muted, fontWeight: d === dayNum ? 900 : 400 }}>D{d}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.red2, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 4 }}>🗳️ Vote Win Tracker — June 16, 2026</div>
          <div style={{ fontSize: 13, color: C.muted }}>Target: {T.winThreshold.toLocaleString()} votes to win Tulsa County DA Republican Primary</div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ background: `${C.red2}15`, border: `1px solid ${C.red2}30`, borderRadius: 12, padding: "10px 20px", textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: C.green, lineHeight: 1 }}>✅</div>
            <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Campaign Complete</div>
          </div>
          <div style={{ background: `${C.gold}22`, border: `1px solid ${C.gold}44`, borderRadius: 12, padding: "10px 20px", textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: C.gold, lineHeight: 1 }}>8,840</div>
            <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Voters Moved to McCarty</div>
          </div>
        </div>
      </div>

      {/* Daily pace alert bar */}
      <div style={{ background: `${C.gold}15`, border: `1px solid ${C.gold}33`, borderRadius: 10, padding: "10px 16px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 16 }}>🏁</span>
        <div>
          <span style={{ fontSize: 12, fontWeight: 700, color: C.green }}>Campaign Complete — $22,000 fully deployed · Ended June 16 at 10:00 AM CT</span>
          <span style={{ fontSize: 11, color: C.muted }}> — 8,840 undecided voters confirmed moved to McCarty · $2.49 cost per voter moved · 46% conversion rate on undecided universe.</span>
        </div>
      </div>

      {/* Budget Urgency Calculator */}
      <div style={{ background: `${C.red2}0a`, border: `1px solid ${C.red2}25`, borderRadius: 12, padding: 16, marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.red2, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>💰 Budget Urgency — Ad Spend Required to Close the Gap</div>
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "repeat(3, 1fr)", gap: 10, marginBottom: 12 }}>
          {[
            {
              label: "Spend/Day Needed",
              value: `$${Math.ceil(3800 / daysLeft).toLocaleString()}`,
              sub: `To deliver ${votesPerDay} exposures/day to undecided voters`,
              color: C.red2,
            },
            {
              label: "Cost Per Vote Moved",
              value: "$0.90",
              sub: "Based on current CTV CPV × avg exposures to threshold",
              color: C.gold,
            },
            {
              label: "Remaining Budget",
              value: `$${remainingBudget.toLocaleString()}`,
              sub: `Campaign complete — $22,000 fully deployed · Election Day`,
              color: C.green,
            },
          ].map(k => (
            <div key={k.label} style={{ background: C.bg3, borderRadius: 10, padding: "12px 14px", borderTop: `3px solid ${k.color}` }}>
              <div style={{ fontSize: 9, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{k.label}</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: k.color, lineHeight: 1 }}>{k.value}</div>
              <div style={{ fontSize: 10, color: C.muted, marginTop: 4 }}>{k.sub}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 8 }}>
          {[
            { channel: "CTV Streaming (74%)",   dailySpend: Math.ceil(3800 * 0.74 / daysLeft), note: "Primary voter ID channel — maintain dominance" },
            { channel: "Meta Ads (10%)",         dailySpend: Math.ceil(3800 * 0.10 / daysLeft), note: "Retarget site visitors + lookalike undecided" },
            { channel: "Google Ads (6%)",        dailySpend: Math.ceil(3800 * 0.06 / daysLeft), note: "Search intent — 'Tulsa DA race' keyword capture" },
            { channel: "YouTube (5%)",           dailySpend: Math.ceil(3800 * 0.05 / daysLeft), note: "CTV retarget audience — high-intent segment" },
          ].map(c => (
            <div key={c.channel} style={{ background: C.bg3, borderRadius: 8, padding: "8px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: C.white }}>{c.channel}</div>
                <div style={{ fontSize: 10, color: C.muted }}>{c.note}</div>
              </div>
              <div style={{ fontSize: 14, fontWeight: 800, color: C.gold, flexShrink: 0, marginLeft: 8 }}>${c.dailySpend}/day</div>
            </div>
          ))}
        </div>
      </div>

      {/* Win Progress Bar */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 12, color: C.white, fontWeight: 600 }}>Projected Votes: {(T.committedBase + T.movedToMcCarty).toLocaleString()}</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: pctToWin >= 100 ? C.green : C.gold }}>{pctToWin}% of win threshold</span>
        </div>
        <div style={{ background: C.bg3, borderRadius: 8, height: 14, overflow: "hidden", position: "relative" }}>
          {/* Committed base */}
          <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${Math.min(100, (T.committedBase / T.winThreshold) * 100)}%`, background: C.red2, borderRadius: "8px 0 0 8px" }} />
          {/* Moved voters */}
          <div style={{ position: "absolute", left: `${(T.committedBase / T.winThreshold) * 100}%`, top: 0, height: "100%", width: `${Math.min(100 - (T.committedBase / T.winThreshold) * 100, (T.movedToMcCarty / T.winThreshold) * 100)}%`, background: C.green }} />
          {/* Win threshold line */}
          <div style={{ position: "absolute", right: 0, top: 0, height: "100%", width: 2, background: "rgba(255,255,255,0.6)" }} />
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 8, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: C.red2, flexShrink: 0 }} />
            <span style={{ fontSize: 11, color: C.muted }}>Committed Base: {T.committedBase.toLocaleString()}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: C.green, flexShrink: 0 }} />
            <span style={{ fontSize: 11, color: C.muted }}>Moved from Undecided: +{T.movedToMcCarty.toLocaleString()}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: "rgba(255,255,255,0.2)", flexShrink: 0 }} />
            <span style={{ fontSize: 11, color: C.muted }}>Still needed: {gapToWin.toLocaleString()} more votes</span>
          </div>
        </div>
      </div>

      {/* 4 KPI boxes */}
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 10, marginBottom: 20 }}>
        {[
          { label: "Undecided Universe",   value: T.undecidedUniverse.toLocaleString(), sub: "Total movable voters in reach",          color: C.blue },
          { label: "Moved → McCarty",       value: T.movedToMcCarty.toLocaleString(),   sub: "Undecided → confirmed via media signals", color: C.green },
          { label: "Still Undecided",       value: T.stillUndecided.toLocaleString(),   sub: "Active targeting priority",               color: C.gold },
          { label: "Needs More Exposure", value: T.movedToKunzweiler.toLocaleString(), sub: "In reach — additional touches needed",    color: "#64748b" },
        ].map(k => (
          <div key={k.label} style={{ background: C.bg3, borderRadius: 10, padding: "12px 14px", borderTop: `3px solid ${k.color}` }}>
            <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{k.label}</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: k.color, lineHeight: 1 }}>{k.value}</div>
            <div style={{ fontSize: 10, color: C.muted, marginTop: 4 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* High-Priority Undecided Shortlist */}
      <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <span style={{ fontSize: 14 }}>🎯</span>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.gold, textTransform: "uppercase", letterSpacing: "0.1em" }}>High-Priority Undecided — Next Touch Targets</div>
            <div style={{ fontSize: 11, color: C.muted }}>Voters with highest intent scores still in play — 1–3 more exposures needed to cross threshold</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {highPriorityUndecided.map(voter => (
            <div key={voter.id} style={{
              background: `${C.gold}0d`,
              border: `1px solid ${C.gold}33`,
              borderRadius: 10,
              padding: "12px 16px",
              display: "grid",
              gridTemplateColumns: mobile ? "1fr" : "1fr 1fr 180px 50px",
              gap: 10,
              alignItems: "center",
            }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.white }}>{voter.name}</div>
                <div style={{ fontSize: 11, color: C.muted }}>{voter.city} · {voter.exposures} exposures so far</div>
              </div>
              <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.4 }}>{voter.lastSignal}</div>
              <div style={{ background: `${C.blue}22`, border: `1px solid ${C.blue}33`, borderRadius: 8, padding: "6px 10px" }}>
                <div style={{ fontSize: 9, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>Recommended Next Ad</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: C.blue }}>{recommendedAd(voter)}</div>
                <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{exposuresNeeded(voter.score)} more exposure{exposuresNeeded(voter.score) > 1 ? "s" : ""} to threshold</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: C.gold }}>{voter.score}</div>
                <div style={{ fontSize: 9, color: C.muted }}>Score</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Moved Voter Log ───────────────────────────────────────────────────────────
function MovedVoterLog({ mobile, C }: { mobile: boolean; C: C }) {
  const [filter, setFilter] = useState<"all" | "moved" | "undecided" | "lost">("all");
  const filtered = MCCARTY_MOVED_VOTERS.filter(v => {
    if (filter === "moved") return v.currentIntent === "McCarty";
    if (filter === "undecided") return v.currentIntent === "Undecided";
    if (filter === "lost") return v.currentIntent !== "McCarty" && v.currentIntent !== "Undecided";
    return true;
  });

  const intentColor = (intent: string) => {
    if (intent === "McCarty") return C.green;
    if (intent === "Undecided") return C.gold;
    return "#64748b";
  };
  const intentLabel = (intent: string) => {
    if (intent === "McCarty") return "✅ Moved → McCarty";
    if (intent === "Undecided") return "⏳ Still Undecided";
    return "⏳ Needs More Exposure";
  };

  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.12em" }}>Undecided Voter Movement Log</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {(["all", "moved", "undecided", "lost"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: "4px 10px", fontSize: 10, fontWeight: 700, borderRadius: 6, cursor: "pointer", border: `1px solid ${filter === f ? C.red2 : C.border}`,
              background: filter === f ? `${C.red2}18` : "transparent", color: filter === f ? C.red2 : C.muted, transition: "all 0.15s",
            }}>{f === "all" ? "All" : f === "moved" ? "Moved → McCarty" : f === "undecided" ? "Still Undecided" : "Needs More Exposure"}</button>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.map(v => (
          <div key={v.id} style={{ background: C.bg3, borderRadius: 10, padding: "12px 16px", display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr 120px 80px", gap: 8, alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.white }}>{v.name}</div>
              <div style={{ fontSize: 11, color: C.muted }}>{v.city} · {v.exposures} exposures</div>
            </div>
            <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.4 }}>{v.lastSignal}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: intentColor(v.currentIntent) }}>{intentLabel(v.currentIntent)}</div>
            <div style={{ textAlign: mobile ? "left" : "right" }}>
              <div style={{ fontSize: 16, fontWeight: 900, color: v.score >= 80 ? C.green : v.score >= 65 ? C.gold : "#64748b" }}>{v.score}</div>
              <div style={{ fontSize: 9, color: C.muted }}>Intent Score</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── TAB: Voter Intelligence ───────────────────────────────────────────────────
function TabVoterIntel({ mobile, C }: { mobile: boolean; C: C }) {
  const PERSUASION_DATA = [
    { segment: "Threshold Met (5+ exposures)", count: 4840, color: C.green },
    { segment: "Near Threshold (3–4 exposures)", count: 9620, color: C.gold },
    { segment: "In Progress (1–2 exposures)", count: 14180, color: C.blue },
    { segment: "Not Yet Reached", count: 1600, color: C.muted },
  ];

  const MOOD_CHART = MCCARTY_MOODS.map(m => ({ name: m.mood, value: m.pct, color: m.color }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Vote Win Tracker — always at top */}
      <VoteMovementTracker C={C} mobile={mobile} />

      {/* Voter Intent Segmentation */}
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "repeat(3, 1fr)", gap: 12 }}>
        {[
          { label: "Colleen McCarty", count: 15960, pct: 49, color: C.red2, icon: "🟦", desc: `Committed base 7,120 + 8,840 moved = 15,960 projected votes (FINAL)` },
          { label: "Undecided / Movable", count: 9120, pct: 28, color: C.gold, icon: "🟡", desc: "Remaining undecided — polls open Election Day" },
          { label: "Steve Kunzweiler", count: 6920, pct: 22, color: "#64748b", icon: "⬜", desc: "Committed Kunzweiler base + 1,240 moved from undecided" },
        ].map(seg => (
          <div key={seg.label} style={{ background: C.card, border: `2px solid ${seg.color}44`, borderRadius: 14, padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <span style={{ fontSize: 22 }}>{seg.icon}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: C.white }}>{seg.label}</div>
                <div style={{ fontSize: 10, color: C.muted }}>{seg.desc}</div>
              </div>
            </div>
            <div style={{ fontSize: 32, fontWeight: 900, color: seg.color, lineHeight: 1, marginBottom: 8 }}>{seg.count.toLocaleString()}</div>
            <ProgressBar value={seg.pct} max={100} color={seg.color} C={C} />
            <div style={{ fontSize: 11, color: C.muted, marginTop: 6 }}>{seg.pct}% of likely primary voters</div>
          </div>
        ))}
      </div>

      {/* Moved Voter Log */}
      <MovedVoterLog mobile={mobile} C={C} />

      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr 1fr" : "1fr 1fr 1fr 1fr", gap: 12 }}>
        <KpiCard label="Total Voter Universe" value="30,240" sub="Tulsa County GOP 45+ registered" color={C.red2} C={C} />
        <KpiCard label="Persuasion Threshold Met" value="18,840" sub="5+ exposures delivered — campaign complete" color={C.green} C={C} />
        <KpiCard label="Behavioral Matches" value="7,284" sub="Named voters matched via behavioral data (final)" color={C.gold} C={C} />
        <KpiCard label="Avg Persuasion Score" value="64.2" sub="Across all reached voters" color={C.blue} C={C} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 16 }}>
        <Card C={C}>
          <SectionTitle C={C}>Persuasion Threshold Tracker</SectionTitle>
          <div style={{ fontSize: 11, color: C.muted, marginBottom: 16 }}>Every voter has a threshold — the number of exposures required before they move. We score each voter and allocate frequency accordingly.</div>
          {PERSUASION_DATA.map(p => (
            <div key={p.segment} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: C.white }}>{p.segment}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: p.color }}>{fmt(p.count)}</span>
              </div>
              <ProgressBar value={p.count} max={30240} color={p.color} C={C} />
            </div>
          ))}
        </Card>

        <Card C={C}>
          <SectionTitle C={C}>Voter Mood Distribution</SectionTitle>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={MOOD_CHART} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {MOOD_CHART.map((m, i) => <Cell key={i} fill={m.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: C.tooltipBg, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {MCCARTY_MOODS.map(m => (
              <div key={m.mood} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: m.color, flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: C.white, flex: 1 }}>{m.mood}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: m.color }}>{m.pct}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card C={C}>
        <SectionTitle C={C}>Voter Segments — Geographic Breakdown</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "repeat(3, 1fr)", gap: 12 }}>
          {MCCARTY_VOTER_SEGMENTS.map(seg => (
            <div key={seg.label} style={{ background: C.bg3, borderRadius: 10, padding: 14, borderLeft: `3px solid ${seg.color}` }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.white, marginBottom: 6 }}>{seg.label}</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: seg.color, marginBottom: 4 }}>{fmt(seg.views)}</div>
              <div style={{ fontSize: 10, color: C.muted }}>Avg time: {seg.avgTime} · Bounce: {seg.bounce}%</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ── TAB: Debate Engagement ────────────────────────────────────────────────────
function TabDebate({ mobile, C }: { mobile: boolean; C: C }) {
  const DE = MCCARTY_DEBATE_ENGAGEMENT;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr 1fr" : "1fr 1fr 1fr 1fr", gap: 12 }}>
        <KpiCard label="Total Debate Viewers" value={fmt(DE.totalDebateViewers)} sub="Across all platforms" color={C.red2} C={C} />
        <KpiCard label="News on 6 Live" value={fmt(DE.newsOn6Live)} sub="KOTV live broadcast" color={C.gold} C={C} />
        <KpiCard label="YouTube Replay" value={fmt(DE.youtubeReplay)} sub="Post-debate replay views" color={C.blue} C={C} />
        <KpiCard label="Social Media Clips" value={fmt(DE.socialMediaClips)} sub="Facebook + Instagram clips" color={C.blue} C={C} />
      </div>

      <Card C={C}>
        <SectionTitle C={C}>Debate Viewer Retargeting Windows</SectionTitle>
        <div style={{ fontSize: 11, color: C.muted, marginBottom: 16 }}>Voters who watched the debate are 4–6x more likely to convert than cold audiences. Each segment requires a different follow-up message.</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {DE.retargetingWindow.map(r => (
            <div key={r.label} style={{ background: C.bg3, borderRadius: 10, padding: "14px 16px", display: "flex", flexDirection: mobile ? "column" : "row", alignItems: mobile ? "flex-start" : "center", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{
                    fontSize: 9, fontWeight: 800, padding: "2px 7px", borderRadius: 20,
                    background: r.retargetPriority === "URGENT" ? `${C.blue}33` : r.retargetPriority === "HIGH" ? `${C.green}22` : `${C.gold}22`,
                    color: r.retargetPriority === "URGENT" ? C.red2 : r.retargetPriority === "HIGH" ? C.green : C.gold,
                    border: `1px solid ${r.retargetPriority === "URGENT" ? C.blue + "44" : r.retargetPriority === "HIGH" ? C.green + "33" : C.gold + "33"}`,
                    textTransform: "uppercase", letterSpacing: "0.08em",
                  }}>{r.retargetPriority}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: C.white }}>{r.label}</span>
                </div>
                <div style={{ fontSize: 11, color: C.muted }}>{fmt(r.count)} voters in this segment</div>
              </div>
              <div style={{ background: C.card, borderRadius: 8, padding: "8px 12px", minWidth: mobile ? "100%" : 280 }}>
                <div style={{ fontSize: 9, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>Recommended Ad</div>
                <div style={{ fontSize: 11, color: C.white }}>{r.recommendedAd}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card C={C}>
        <SectionTitle C={C}>Post-Debate Impression Surge</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {DE.debateDates.map(d => (
            <div key={d.date} style={{ background: C.bg3, borderRadius: 10, padding: "12px 16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.white }}>{d.date} — {d.platform}</div>
                  <div style={{ fontSize: 11, color: C.muted }}>{fmt(d.viewers)} viewers · {fmt(d.postAdImpressions)} post-debate impressions served</div>
                </div>
                <div style={{ fontSize: 20, fontWeight: 900, color: C.red2 }}>+{Math.round(d.postAdImpressions / d.viewers * 100)}%</div>
              </div>
              <ProgressBar value={d.postAdImpressions} max={15000} color={C.red2} C={C} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ── TAB: Vote Projections ─────────────────────────────────────────────────────
function TabVoteProjections({ mobile, C }: { mobile: boolean; C: C }) {
  // Dynamic budget pacing based on today's date
  const { dayNum: DAYS_ELAPSED, spentToDate: SPEND_TO_DATE, remainingBudget: SPEND_REMAINING } = getCampaignDay();
  const BUDGET_TOTAL = 22000;
  const DAYS_TOTAL = 19;
  const SPEND_PER_DAY = 640; // baseline daily rate (phases 2–3)
  const SURGE_PER_DAY = 1375; // last 4 days surge rate

  // Actual results through current day
  const RESULTS_TO_DATE = [
    { label: "Total Impressions Delivered", value: "2,184,000", sub: "Final 19-day campaign total across all channels", color: C.red2 },
    { label: "Unique Voters Reached", value: "84,600", sub: "Registered Republican voters in Tulsa County (final)", color: C.blue },
    { label: "Avg Completion Rate", value: "92.8%", sub: "CTV + digital combined (final)", color: C.green },
    { label: "Voters Moved to McCarty", value: "8,840", sub: "Confirmed via behavioral signals — 46% conversion rate", color: C.gold },
  ];

  // Final campaign outcomes
  const PROJECTION_ROWS = [
    { label: "Total Spend Deployed", value: "$22,000", sub: "100% of budget deployed — campaign complete", color: C.red2 },
    { label: "Cost Per Voter Moved", value: "$2.49", sub: "$22,000 ÷ 8,840 voters confirmed moved to McCarty", color: C.blue },
    { label: "Voter Conversion Rate", value: "46%", sub: "8,840 of 19,200 undecided universe converted", color: C.gold },
    { label: "Projected Vote Total", value: "15,960", sub: "Committed base 7,120 + 8,840 moved — 41 votes from win threshold", color: C.green },
  ];

  // Spend pacing
  const SPEND_PHASES = [
    { phase: "Days 1–3 (Complete)",    spend: "$2,500",  pct: Math.round(2500  / BUDGET_TOTAL * 100), note: "Campaign launch + CTV launch (Day 2) + A/B test window · ~$833/day", done: DAYS_ELAPSED >= 3 },
    { phase: `Days 4–9${DAYS_ELAPSED >= 4 && DAYS_ELAPSED <= 9 ? " — Active" : DAYS_ELAPSED > 9 ? " (Complete)" : ""}`, spend: "$3,840",  pct: Math.round(3840  / BUDGET_TOTAL * 100), note: "Peak frequency — saturation to top voter ZIPs · ~$640/day", done: DAYS_ELAPSED > 9 },
    { phase: `Days 10–14${DAYS_ELAPSED >= 10 && DAYS_ELAPSED <= 14 ? " — Active" : DAYS_ELAPSED > 14 ? " (Complete)" : ""}`, spend: "$3,200",  pct: Math.round(3200  / BUDGET_TOTAL * 100), note: "Final optimization + retargeting of near-threshold voters · ~$640/day", done: DAYS_ELAPSED > 14 },
    { phase: "Days 15–19 — SURGE 🚀 (Complete)", spend: "$7,335", pct: Math.round(7335 / BUDGET_TOTAL * 100), note: "Election-eve surge — 2–3x daily spend · ~$1,467/day · Max frequency to all identified persuadables", done: true },
  ];

  const TIMELINE = [
    { day: "Day 1 — May 28",  done: true,  activity: "Campaign website live. Social media boosts activated. Organic search traffic begins. Behavioral audience building starts." },
    { day: "Day 2 — May 29",  done: true,  activity: "CTV commercials launched across 74 streaming channels. Meta + Google ads live. Behavioral signals spiking. First voter movements confirmed." },
    { day: "Day 3 — May 30",  done: true,  activity: "First optimization cycle. Budget shifted to highest-converting ZIPs. First confirmed voter movements to McCarty." },
    { day: "Day 4 — May 31",  done: true,  activity: "Peak frequency window opens. Saturation delivery to highest-propensity voters. CTV retargeting at full volume. Budget pace: $640/day." },
    { day: "Days 5–9",        done: true, activity: "Continued peak frequency. Lookalike expansion from CTV retargeting audience. Behavioral scoring updated daily. 2,980 voters moved by Day 9." },
    { day: "Days 10–12",      done: true, activity: "Mid-campaign data review. Creative rotation based on completion rates. 5,600 total voters moved by Day 12." },
    { day: "Days 13–14",      done: true, activity: "Final optimization pass. Pre-election behavioral data informs last message mix. Retargeting maximized on highest-intent voters." },
    { day: "Days 15–19 🚀",   done: true, activity: "SURGE PHASE COMPLETE: $7,335 deployed in final 5 days (~$1,467/day). 8,840 total voters moved to McCarty. Campaign ended June 16 at 10:00 AM CT." },
    { day: "June 16 ✅",       done: true, activity: "Election Day. Campaign complete 10:00 AM CT. 2,184,000 total impressions delivered. 84,600 unique voters reached. 8,840 confirmed moved to McCarty. Polls close 7:00 PM CT." },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Budget summary bar */}
      <div style={{ background: `${C.red2}10`, border: `1px solid ${C.red2}30`, borderRadius: 14, padding: "16px 20px", display: "flex", flexWrap: "wrap", gap: 20, alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Total Campaign Budget</div>
          <div style={{ fontSize: 32, fontWeight: 900, color: C.red2, lineHeight: 1 }}>$22,000</div>
          <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>19-day campaign COMPLETE · May 28 – June 16, 2026 · Ended 10:00 AM CT</div>
        </div>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: C.gold }}>${SPEND_TO_DATE.toLocaleString()}</div>
            <div style={{ fontSize: 10, color: C.muted }}>Spent (Day {DAYS_ELAPSED})</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: C.green }}>${SPEND_REMAINING.toLocaleString()}</div>
            <div style={{ fontSize: 10, color: C.muted }}>Remaining ($0 — fully spent)</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: C.blue }}>${SPEND_PER_DAY.toLocaleString()}/day</div>
            <div style={{ fontSize: 10, color: C.muted }}>Baseline Daily Rate</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: C.gold }}>$2.49</div>
            <div style={{ fontSize: 10, color: C.muted }}>Cost Per Voter Moved</div>
          </div>
        </div>
      </div>

      {/* Results to date */}
      <Card C={C}>
        <SectionTitle C={C}>Results Delivered — Days 1–{DAYS_ELAPSED}</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 12 }}>
          {RESULTS_TO_DATE.map(r => (
            <div key={r.label} style={{ background: `${r.color}10`, border: `1px solid ${r.color}30`, borderRadius: 10, padding: 14 }}>
              <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{r.label}</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: r.color, lineHeight: 1, marginBottom: 4 }}>{r.value}</div>
              <div style={{ fontSize: 10, color: C.muted }}>{r.sub}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Forward projections */}
      <Card C={C}>
        <SectionTitle C={C}>Final Campaign Outcomes — 19-Day Results</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 12, marginBottom: 16 }}>
          {PROJECTION_ROWS.map(r => (
            <div key={r.label} style={{ background: `${r.color}10`, border: `1px solid ${r.color}30`, borderRadius: 10, padding: 14 }}>
              <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{r.label}</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: r.color, lineHeight: 1, marginBottom: 4 }}>{r.value}</div>
              <div style={{ fontSize: 10, color: C.muted }}>{r.sub}</div>
            </div>
          ))}
        </div>
        <div style={{ background: `${C.green}0d`, border: `1px solid ${C.green}30`, borderRadius: 10, padding: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.green, marginBottom: 4 }}>🏁 Campaign Complete — Final Status</div>
          <div style={{ fontSize: 13, color: C.white }}>Tulsa County DA Republican primary: <strong>2-person race</strong> — winner is the next DA (no general election opponent). 19-day campaign ended June 16 at 10:00 AM CT. <strong>$22,000 fully deployed</strong>. McCarty projected at <strong>15,960 votes</strong> — within 41 votes of the 16,001 win threshold. <strong style={{ color: C.green }}>8,840 undecided voters moved to McCarty at $2.49 per voter.</strong> Polls close 7:00 PM CT.</div>
        </div>
      </Card>

      {/* Spend pacing */}
      <Card C={C}>
        <SectionTitle C={C}>Budget Pacing — $22,000 Across 19 Days (COMPLETE)</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {SPEND_PHASES.map(p => (
            <div key={p.phase} style={{ background: p.done ? `${C.green}0a` : `${C.red2}08`, border: `1px solid ${p.done ? C.green : C.red2}25`, borderRadius: 10, padding: "12px 16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, flexWrap: "wrap", gap: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 10, color: p.done ? C.green : C.muted }}>{p.done ? "✓" : "◦"}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: p.done ? C.green : C.white }}>{p.phase}</span>
                </div>
                <span style={{ fontSize: 14, fontWeight: 800, color: p.done ? C.green : C.red2 }}>{p.spend}</span>
              </div>
              <ProgressBar value={p.pct} max={100} color={p.done ? C.green : C.red2} C={C} />
              <div style={{ fontSize: 10, color: C.muted, marginTop: 6 }}>{p.note}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* 18-day timeline */}
      <Card C={C}>
        <SectionTitle C={C}>19-Day Campaign Timeline (COMPLETE)</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {TIMELINE.map((t, i) => (
            <div key={t.day} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ width: 90, flexShrink: 0, fontSize: 10, fontWeight: 700, color: t.done ? C.green : t.day === "June 16" ? C.red2 : C.gold, textTransform: "uppercase", letterSpacing: "0.05em", paddingTop: 2 }}>{t.day}</div>
              <div style={{ width: 2, background: t.done ? C.green : i === TIMELINE.length - 1 ? C.red2 : C.border, alignSelf: "stretch", borderRadius: 1, flexShrink: 0 }} />
              <div style={{ fontSize: 12, color: t.done ? C.white : C.muted, paddingTop: 1 }}>
                {t.done && <span style={{ color: C.green, marginRight: 4 }}>✓</span>}
                {t.activity}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ── CTV Channel Table with tier grouping and show-more toggle ────────────────
function CtvChannelTable({ mobile, C }: { mobile: boolean; C: C }) {
  const [showAll, setShowAll] = useState(false);
  const topChannels = MCCARTY_CTV_CHANNELS.filter(ch => (ch as any).tier === "top");
  const midChannels = MCCARTY_CTV_CHANNELS.filter(ch => (ch as any).tier === "mid");
  const lowChannels = MCCARTY_CTV_CHANNELS.filter(ch => (ch as any).tier === "low");
  const visibleMid = showAll ? midChannels : midChannels.slice(0, 8);
  const visibleLow = showAll ? lowChannels : [];

  const ChannelRow = ({ ch, i }: { ch: typeof MCCARTY_CTV_CHANNELS[0]; i: number }) => {
    const logoUrl = getNetworkLogo(ch.name);
    const initials = getNetworkInitials(ch.name);
    return (
      <tr key={ch.name} style={{ background: i % 2 === 0 ? "transparent" : C.bg3 }}>
        <td style={{ padding: "7px 10px", color: C.white, fontWeight: 600 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {logoUrl ? (
              <img src={logoUrl} alt={ch.name} width={22} height={22}
                style={{ borderRadius: 4, objectFit: "contain", background: "#fff", padding: 2, flexShrink: 0 }}
                onError={(e) => { const img = e.target as HTMLImageElement; img.style.display="none"; }}
              />
            ) : (
              <span style={{ width: 22, height: 22, borderRadius: 4, background: ch.color, flexShrink: 0, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 7, fontWeight: 800, color: "#fff" }}>{initials}</span>
            )}
            <span style={{ fontSize: 12 }}>{ch.name}</span>
            {(ch as any).local && <span style={{ fontSize: 8, fontWeight: 700, background: "#10b98122", color: "#10b981", border: "1px solid #10b98144", borderRadius: 10, padding: "1px 5px", textTransform: "uppercase" }}>LOCAL</span>}
          </div>
        </td>
        <td style={{ padding: "7px 10px", color: C.white, fontSize: 12 }}>{fmt(ch.impressions)}</td>
        <td style={{ padding: "7px 10px", color: C.white, fontSize: 12 }}>{fmt(ch.completions)}</td>
        <td style={{ padding: "7px 10px", color: C.gold, fontSize: 12 }}>${ch.cpm.toFixed(2)}</td>
        {!mobile && <td style={{ padding: "7px 10px", color: C.white, fontSize: 12 }}>{ch.frequency.toFixed(2)}x</td>}
        <td style={{ padding: "7px 10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <ProgressBar value={ch.completionRate} max={100} color={ch.color} C={C} />
            <span style={{ fontSize: 10, fontWeight: 700, color: ch.color, minWidth: 32 }}>{ch.completionRate}%</span>
          </div>
        </td>
      </tr>
    );
  };

  const TableHeader = () => (
    <thead>
      <tr>
        {["Channel", "Impressions", "Completions", "CPM", ...(!mobile ? ["Frequency"] : []), "Completion %"].map(h => (
          <th key={h} style={{ textAlign: "left", padding: "7px 10px", fontSize: 9, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em", borderBottom: `1px solid ${C.border}` }}>{h}</th>
        ))}
      </tr>
    </thead>
  );

  const TierLabel = ({ label, count }: { label: string; count: number }) => (
    <tr>
      <td colSpan={mobile ? 5 : 6} style={{ padding: "10px 10px 4px", fontSize: 9, fontWeight: 800, color: C.muted, textTransform: "uppercase", letterSpacing: "0.1em", borderTop: `1px solid ${C.border}` }}>
        {label} <span style={{ color: C.blue, marginLeft: 4 }}>{count} channels</span>
      </td>
    </tr>
  );

  return (
    <Card C={C}>
      <SectionTitle C={C}>CTV Channel Performance — All 74 Channels</SectionTitle>
      <div style={{ fontSize: 11, color: C.muted, marginBottom: 12 }}>Showing all active channels. Local Tulsa stations highlighted. Sorted by impression volume.</div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <TableHeader />
          <tbody>
            <TierLabel label="Top Tier" count={topChannels.length} />
            {topChannels.map((ch, i) => <ChannelRow key={ch.name} ch={ch} i={i} />)}
            <TierLabel label="Mid Tier" count={midChannels.length} />
            {visibleMid.map((ch, i) => <ChannelRow key={ch.name} ch={ch} i={i} />)}
            {showAll && <TierLabel label="Lower Tier" count={lowChannels.length} />}
            {visibleLow.map((ch, i) => <ChannelRow key={ch.name} ch={ch} i={i} />)}
          </tbody>
        </table>
      </div>
      <button
        onClick={() => setShowAll(v => !v)}
        style={{ marginTop: 12, padding: "7px 16px", background: "transparent", border: `1px solid ${C.border}`, borderRadius: 8, color: C.muted, fontSize: 11, cursor: "pointer", width: "100%" }}
      >
        {showAll ? `▲ Show fewer channels` : `▼ Show all 74 channels (${midChannels.length - 8} more mid + ${lowChannels.length} lower tier)`}
      </button>
    </Card>
  );
}

// ── TAB: CTV Performance ──────────────────────────────────────────────────────
function TabCTV({ mobile, C }: { mobile: boolean; C: C }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr 1fr" : "1fr 1fr 1fr 1fr", gap: 12 }}>
        <KpiCard label="CTV Impressions" value="2.11M" sub="74% of total campaign" color={C.red2} C={C} />
        <KpiCard label="Avg Completion Rate" value="90.4%" sub="Across all CTV channels" color={C.green} C={C} />
        <KpiCard label="Avg CPM" value="$17.82" sub="Blended CTV rate" color={C.gold} C={C} />
        <KpiCard label="Channels Active" value="74" sub="Samsung, Tubi, FOX 23 Tulsa + 71 more" color={C.blue} C={C} />
      </div>

      <CtvChannelTable mobile={mobile} C={C} />

      <Card C={C}>
        <SectionTitle C={C}>Creative Performance — 2 Ads Rotating Evenly</SectionTitle>
        <div style={{ fontSize: 11, color: C.muted, marginBottom: 16 }}>Both :15 spots are running at equal weight (50/50 rotation) across all CTV and digital channels.</div>
        {MCCARTY_CREATIVES.map(cr => (
          <div key={cr.name} style={{ background: C.bg3, borderRadius: 10, padding: "14px 16px", marginBottom: 12, borderLeft: `3px solid ${cr.color}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6, flexWrap: "wrap", gap: 6 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: C.white }}>{cr.name}</span>
                  <span style={{ fontSize: 9, fontWeight: 700, background: `${cr.color}22`, color: cr.color, border: `1px solid ${cr.color}44`, borderRadius: 20, padding: "2px 8px", textTransform: "uppercase", letterSpacing: "0.08em" }}>50% rotation</span>
                </div>
                <div style={{ fontSize: 11, color: C.muted }}>{(cr as any).note}</div>
              </div>
              <span style={{ fontSize: 11, color: C.muted, flexShrink: 0 }}>{fmt(cr.impressions)} impressions · CTR {cr.ctr}%</span>
            </div>
            <ProgressBar value={cr.completionRate} max={100} color={cr.color} C={C} />
            <div style={{ fontSize: 10, color: C.muted, marginTop: 4 }}>{cr.completionRate}% completion rate · {fmt(cr.completions)} completed views</div>
          </div>
        ))}
      </Card>
    </div>
  );
}

// ── TAB: Voter Profiles ───────────────────────────────────────────────────────
function TabVoterProfiles({ mobile, C }: { mobile: boolean; C: C }) {
  const [, navigate] = useLocation();
  const profiles = getProfilesByDashboard("mccarty");
  const windowColors = ["#4ade80", "#f59e0b", "#38bdf8"];

  return (
    <div style={{ padding: mobile ? "16px" : "24px 28px" }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: C.white, marginBottom: 4 }}>Featured Voter Journey Profiles</div>
        <div style={{ fontSize: 12, color: C.muted }}>3 identified voters from the Tulsa DA 45+ GOP registered voter list — click any profile to view their full engagement history, persuasion signals, and personalized outreach strategy.</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "repeat(3, 1fr)", gap: 16 }}>
        {profiles.map(profile => (
          <div
            key={profile.id}
            onClick={() => navigate(`/buyer/${profile.id}`)}
            style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20, cursor: "pointer", transition: "all 0.18s ease", borderTop: `3px solid ${profile.avatarColor}`, position: "relative" }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = "translateY(-3px)"; el.style.boxShadow = `0 8px 28px ${profile.avatarColor}22`; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = ""; el.style.boxShadow = ""; }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: profile.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: "#fff", flexShrink: 0 }}>{profile.avatar}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.white }}>{profile.name}</div>
                <div style={{ fontSize: 11, color: C.muted }}>{profile.age} · {profile.occupation}</div>
              </div>
            </div>
            <div style={{ fontSize: 11, color: C.muted, marginBottom: 10 }}>📍 {profile.location}</div>
            <div style={{ background: `${profile.avatarColor}18`, border: `1px solid ${profile.avatarColor}33`, borderRadius: 8, padding: "8px 10px", marginBottom: 12 }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: profile.avatarColor, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 3 }}>🗳️ Voter DNA</div>
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
    </div>
  );
}

// ── TAB: People Segment ──────────────────────────────────────────────────────
function TabPeopleSegment({ mobile, C }: { mobile: boolean; C: C }) {
  const [search, setSearch] = useState("");
  const [filterCity, setFilterCity] = useState("All");
  const [filterGender, setFilterGender] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortBy, setSortBy] = useState<"name" | "age" | "score">("score");

  const cities = ["All", ...Array.from(new Set(MCCARTY_PEOPLE_SEGMENT.map(v => v.city))).sort()];
  const statusColors: Record<VoterRecord["status"], string> = {
    moved: "#4ade80",
    engaged: C.blue,
    reached: C.gold,
    pending: C.muted,
  };
  const statusLabels: Record<VoterRecord["status"], string> = {
    moved: "✓ Moved",
    engaged: "◉ Engaged",
    reached: "◎ Reached",
    pending: "○ Pending",
  };

  const filtered = MCCARTY_PEOPLE_SEGMENT
    .filter(v => {
      const q = search.toLowerCase();
      const nameMatch = !q || `${v.firstName} ${v.lastName}`.toLowerCase().includes(q) || v.city.toLowerCase().includes(q) || v.zip.includes(q);
      const cityMatch = filterCity === "All" || v.city === filterCity;
      const genderMatch = filterGender === "All" || v.gender === filterGender;
      const statusMatch = filterStatus === "All" || v.status === filterStatus;
      return nameMatch && cityMatch && genderMatch && statusMatch;
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.lastName.localeCompare(b.lastName);
      if (sortBy === "age") return b.age - a.age;
      return b.persuasionScore - a.persuasionScore;
    });

  const movedCount = MCCARTY_PEOPLE_SEGMENT.filter(v => v.status === "moved").length;
  const engagedCount = MCCARTY_PEOPLE_SEGMENT.filter(v => v.status === "engaged").length;

  return (
    <div style={{ padding: mobile ? "12px" : "20px 28px" }}>
      {/* Header stats */}
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: 10, marginBottom: 16 }}>
        {[
          { label: "Target Universe", value: "83,076", sub: "45+ Tulsa County GOP", color: C.blue },
          { label: "Voters Reached", value: "68,420", sub: "82% of universe", color: C.gold },
          { label: "Moved to McCarty", value: "1,120", sub: "Day 4 total", color: "#4ade80" },
          { label: "Mobile Reachable", value: "87%", sub: "Have mobile on file", color: C.blue },
        ].map(s => (
          <div key={s.label} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px" }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.white, marginTop: 2 }}>{s.label}</div>
            <div style={{ fontSize: 10, color: C.muted }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px", marginBottom: 14, display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search name, city, ZIP…"
          style={{ flex: "1 1 180px", background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 7, padding: "7px 12px", color: C.white, fontSize: 12, outline: "none" }}
        />
        {[
          { label: "City", value: filterCity, set: setFilterCity, opts: cities },
          { label: "Gender", value: filterGender, set: setFilterGender, opts: ["All", "F", "M"] },
          { label: "Status", value: filterStatus, set: setFilterStatus, opts: ["All", "moved", "engaged", "reached", "pending"] },
          { label: "Sort", value: sortBy, set: (v: string) => setSortBy(v as "name" | "age" | "score"), opts: ["score", "name", "age"] },
        ].map(f => (
          <select key={f.label} value={f.value} onChange={e => f.set(e.target.value)}
            style={{ background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 7, padding: "7px 10px", color: C.white, fontSize: 11, cursor: "pointer" }}>
            {f.opts.map(o => <option key={o} value={o}>{f.label === "Sort" ? `Sort: ${o}` : o === "All" ? `${f.label}: All` : o}</option>)}
          </select>
        ))}
        <span style={{ fontSize: 11, color: C.muted, marginLeft: "auto" }}>{filtered.length} of {MCCARTY_PEOPLE_SEGMENT.length} shown</span>
      </div>

      {/* Voter grid */}
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "repeat(2, 1fr)", gap: 10 }}>
        {filtered.map(voter => (
          <div key={voter.id} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px", borderLeft: `3px solid ${statusColors[voter.status]}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: statusColors[voter.status] + "33", border: `2px solid ${statusColors[voter.status]}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: statusColors[voter.status], flexShrink: 0 }}>
                  {voter.firstName[0]}{voter.lastName[0]}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.white }}>{voter.firstName} {voter.lastName}</div>
                  <div style={{ fontSize: 10, color: C.muted }}>{voter.city}, OK {voter.zip} · Age {voter.age} · {voter.gender === "F" ? "Female" : "Male"}</div>
                </div>
              </div>
              <span style={{ fontSize: 9, fontWeight: 700, background: statusColors[voter.status] + "22", color: statusColors[voter.status], border: `1px solid ${statusColors[voter.status]}44`, borderRadius: 20, padding: "2px 8px", whiteSpace: "nowrap" }}>
                {statusLabels[voter.status]}
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6, marginBottom: 8 }}>
              <div style={{ background: C.bg3, borderRadius: 6, padding: "5px 6px", textAlign: "center" }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: C.blue }}>{voter.adsSeen}</div>
                <div style={{ fontSize: 8, color: C.muted }}>Ads Seen</div>
              </div>
              <div style={{ background: C.bg3, borderRadius: 6, padding: "5px 6px", textAlign: "center" }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: C.gold }}>{voter.completionRate}%</div>
                <div style={{ fontSize: 8, color: C.muted }}>Completion</div>
              </div>
              <div style={{ background: C.bg3, borderRadius: 6, padding: "5px 6px", textAlign: "center" }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: statusColors[voter.status] }}>{voter.persuasionScore}</div>
                <div style={{ fontSize: 8, color: C.muted }}>Persuasion</div>
              </div>
              <div style={{ background: C.bg3, borderRadius: 6, padding: "5px 6px", textAlign: "center" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: C.white }}>{voter.hasMobile ? "📱" : "📞"}</div>
                <div style={{ fontSize: 8, color: C.muted }}>{voter.hasMobile ? "Mobile" : "Landline"}</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 9, color: C.muted }}>Issue:</span>
              <span style={{ fontSize: 9, fontWeight: 700, background: C.blue + "22", color: C.blue, border: `1px solid ${C.blue}33`, borderRadius: 10, padding: "1px 6px" }}>{voter.mood}</span>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px 20px", color: C.muted, fontSize: 13 }}>No voters match your filters.</div>
      )}

      <div style={{ marginTop: 16, padding: "10px 14px", background: C.bg3, borderRadius: 8, fontSize: 10, color: C.muted, textAlign: "center" }}>
        Showing a representative sample of 60 voters from the 83,076-voter Tulsa County GOP 45+ target universe. Full list: 111,000 registered GOP voters on file.
      </div>
    </div>
  );
}

// ── Campaign Day Calculator ──────────────────────────────────────────────────
function getCampaignDay() {
  const start = new Date("2026-05-28");
  const election = new Date("2026-06-16");
  // Campaign ended at 10am CT June 16 — cap at Day 19
  const campaignEnd = new Date("2026-06-16T10:00:00-05:00");
  const today = new Date() > campaignEnd ? campaignEnd : new Date();
  const msPerDay = 1000 * 60 * 60 * 24;
  // Clamp between day 1 and day 18
  const dayNum = Math.min(19, Math.max(1, Math.floor((today.getTime() - start.getTime()) / msPerDay) + 1));
  const daysLeft = 0; // Campaign complete — Election Day
  // Pacing: Days 1-3 $833/day, Days 4-14 $1,000/day, Days 15-19 $1,467/day (total $22,000)
  function dailyRate(d: number) {
    if (d <= 3)  return 833; // $2,499
    if (d <= 14) return 640;
    return 1375;
  }
  let spentToDate = 0;
  for (let d = 1; d <= dayNum; d++) spentToDate += dailyRate(d);
  spentToDate = Math.min(22000, spentToDate);
  const remainingBudget = 0; // Campaign complete — fully spent
  // Impressions: final 19-day total = 2,184,000
  const cumulativeImpressions = Math.min(2184000, Math.round(60000 * ((Math.pow(1.10, dayNum) - 1) / 0.10)));
  // Voters reached: final = 84,600 unique registered Republican voters
  const votersReached = Math.min(84600, 16800 + (dayNum - 3) * 3800);
  return { dayNum, daysLeft, spentToDate, remainingBudget, cumulativeImpressions, votersReached };
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
const TABS = ["Overview", "Voter Intel", "Debate", "Vote Projections", "CTV", "People Segment", "Voter Profiles"];

export default function McCartryDashboard() {
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
      const canvas = await html2canvas(contentRef.current, { scale: 2, useCORS: true, backgroundColor: isDark ? "#0a0a0f" : "#f0f4f8", logging: false });
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
      pdf.save(`ExactAudience_McCarty_${TABS[tab]}_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (err) { console.error(err); }
    finally { setExporting(false); }
  }

  const tabContent = [
    <TabOverview mobile={mobile} C={C} />,
    <TabVoterIntel mobile={mobile} C={C} />,
    <TabDebate mobile={mobile} C={C} />,
    <TabVoteProjections mobile={mobile} C={C} />,
    <TabCTV mobile={mobile} C={C} />,
    <TabPeopleSegment mobile={mobile} C={C} />,
    <TabVoterProfiles mobile={mobile} C={C} />,
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
      <div style={{ background: C.headerBg, borderBottom: "1px solid rgba(155,35,53,0.25)", padding: mobile ? "12px 16px" : "14px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 200 }}>
        <div style={{ display: "flex", alignItems: "center", gap: mobile ? 10 : 16, minWidth: 0 }}>
          <button onClick={() => navigate("/campaigns")} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 8, padding: "5px 10px", color: "#f1f5f9", fontSize: 11, cursor: "pointer", flexShrink: 0 }}>
            ← Campaigns
          </button>
          <div style={{ width: 1, height: 24, background: "rgba(255,255,255,0.2)", flexShrink: 0 }} />
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <span style={{ width: 8, height: 8, background: C.red2, borderRadius: "50%", boxShadow: `0 0 8px ${C.red2}88`, animation: "pdot 2s ease-in-out infinite" }} />
            {!mobile && <img src="/ea-logo.png" alt="Exact Audience" style={{ height: 22, maxWidth: 160, objectFit: "contain", objectPosition: "left center", filter: "brightness(1.15)" }} />}
          </div>
          {!mobile && <div style={{ width: 1, height: 30, background: "rgba(255,255,255,0.2)" }} />}
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: mobile ? 12 : 14, fontWeight: 700, color: "#ffffff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Colleen McCarty for DA</div>
            {!mobile && <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)" }}>Tulsa County, OK · Republican Primary · June 16, 2026</div>}
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
          <span style={{ fontSize: 10, fontWeight: 800, color: C.blue, textTransform: "uppercase", letterSpacing: "0.1em" }}>Campaign Complete — Day 19 of 19</span>
          <span style={{ fontSize: 10, color: C.muted }}>·</span>
          <span style={{ fontSize: 10, color: C.muted }}>Ended 10:00 AM CT — Election Day</span>
        </div>
        <div style={{ flex: 1, minWidth: 120, height: 6, background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)", borderRadius: 3, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${(campaign.dayNum / 18) * 100}%`, background: `linear-gradient(90deg, ${C.blue}, ${C.red2})`, borderRadius: 3, transition: "width 0.6s ease" }} />
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
              <div style={{ fontSize: 12, fontWeight: 800, color: C.gold }}>{fmt(campaign.cumulativeImpressions)}</div>
              <div style={{ fontSize: 9, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Proj. Impressions</div>
            </div>
          )}
        </div>
      </div>

      {/* Race Context Banner */}
      <div style={{ background: isDark ? "#0a1020" : "#e8f0f8", borderBottom: `1px solid ${C.border}`, padding: mobile ? "8px 16px" : "9px 28px", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, background: `${C.red2}18`, border: `1px solid ${C.red2}40`, borderRadius: 20, padding: "3px 10px", flexShrink: 0 }}>
          <span style={{ fontSize: 9, fontWeight: 800, color: C.red2, textTransform: "uppercase", letterSpacing: "0.1em" }}>🗳️ Republican Primary</span>
        </div>
        <span style={{ fontSize: 10, color: C.muted }}>·</span>
        <span style={{ fontSize: 10, color: C.white, fontWeight: 600 }}>June 16, 2026</span>
        <span style={{ fontSize: 10, color: C.muted }}>·</span>
        <span style={{ fontSize: 10, color: C.muted }}>2-person race: McCarty vs. Kunzweiler</span>
        <span style={{ fontSize: 10, color: C.muted }}>·</span>
        <span style={{ fontSize: 10, color: C.green, fontWeight: 700 }}>Winner becomes next Tulsa County DA — no general election opponent</span>
        {!mobile && (
          <>
            <span style={{ fontSize: 10, color: C.muted }}>·</span>
            <span style={{ fontSize: 10, color: C.muted }}>~191,000 eligible Republican voters · Win threshold: ~16,001 votes</span>
          </>
        )}
      </div>

      {/* Tabs */}
      <div style={{ background: C.bg2, borderBottom: `1px solid ${C.border}`, padding: "0 28px", overflowX: "auto", display: "flex", gap: 0 }}>
        {TABS.map((t, i) => (
          <button key={t} onClick={() => setTab(i)} style={{
            padding: mobile ? "10px 12px" : "12px 18px", fontSize: mobile ? 10 : 11, fontWeight: 700,
            letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer", whiteSpace: "nowrap",
            background: "transparent", border: "none", borderBottom: `2px solid ${tab === i ? C.red2 : "transparent"}`,
            color: tab === i ? C.red2 : C.muted, transition: "all 0.15s",
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
        <div style={{ fontSize: 10, color: C.muted }}>Colleen McCarty for Tulsa County DA · June 16, 2026 Republican Primary</div>
      </div>
    </div>
  );
}
