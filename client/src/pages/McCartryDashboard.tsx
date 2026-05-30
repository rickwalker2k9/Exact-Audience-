/**
 * McCartryDashboard.tsx
 * Colleen McCarty for Tulsa County District Attorney — June 16, 2026 Republican Primary
 * Political dashboard: Voter Intelligence, Debate Engagement, Vote Projections, CTV Performance
 * Framework: Jeff Starling Behavioral Intelligence model adapted for Tulsa County DA race
 */

import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useTheme } from "@/contexts/ThemeContext";
import { getProfilesByDashboard } from "@/lib/buyerProfiles";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  ReferenceLine
} from "recharts";
import {
  MCCARTY_CLIENT, MCCARTY_LIVE_BASE, MCCARTY_DAILY_IMPRESSIONS,
  MCCARTY_MEDIA_MIX, MCCARTY_CTV_CHANNELS, MCCARTY_CREATIVES,
  MCCARTY_MOODS, MCCARTY_VISITORS, MCCARTY_QR,
  MCCARTY_DEBATE_ENGAGEMENT, MCCARTY_VOTER_SEGMENTS,
  MCCARTY_VOTE_TARGET, MCCARTY_MOVED_VOTERS
} from "@/lib/mccartryData";

// ── Theme ─────────────────────────────────────────────────────────────────────
function useColors(isDark: boolean) {
  return isDark ? {
    bg: "#0a0a0f", bg2: "#0f0f1a", bg3: "#141420",
    card: "#0f0f1e", card2: "#141428", border: "#1e1e3a",
    red: "#c8102e", red2: "#ef4444", red3: "#fca5a5",
    green: "#4ade80", gold: "#f59e0b", blue: "#38bdf8",
    white: "#f1f5f9", muted: "#8892b0",
    headerBg: "linear-gradient(135deg,#1a0000,#3a0010)",
    tooltipBg: "#141428", scrollTrack: "#0f0f1a", scrollThumb: "#1e1e3a",
  } : {
    bg: "#f0f4f8", bg2: "#e8edf5", bg3: "#dde4ef",
    card: "#ffffff", card2: "#f8fafc", border: "#c8d4e8",
    red: "#c8102e", red2: "#dc2626", red3: "#ef4444",
    green: "#16a34a", gold: "#d97706", blue: "#0284c7",
    white: "#1e293b", muted: "#64748b",
    headerBg: "linear-gradient(135deg,#1a0000,#3a0010)",
    tooltipBg: "#ffffff", scrollTrack: "#e8edf5", scrollThumb: "#c8d4e8",
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
      <span style={{ width: 3, height: 14, background: C.red, borderRadius: 2, display: "inline-block", flexShrink: 0 }} />
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
      <div style={{ width: `${Math.min(100, (value / max) * 100)}%`, background: color ?? C.red, height: "100%", borderRadius: 4, transition: "width 0.6s ease" }} />
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
        <span style={{ fontSize: 11, fontWeight: 700, color: C.green, textTransform: "uppercase", letterSpacing: "0.1em" }}>SiteID — Live Voter Identified</span>
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
        <div style={{ marginTop: 10, background: `${C.red}22`, border: `1px solid ${C.red}44`, borderRadius: 8, padding: "8px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 11, color: C.red3 }}>Voter Mood Signal</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: C.red2 }}>{v.mood}</span>
        </div>
      </div>
    </div>
  );
}

// ── TAB: Overview ─────────────────────────────────────────────────────────────
const DATE_RANGES = [{ label: "7 Days", days: 7 }, { label: "14 Days", days: 14 }, { label: "30 Days", days: 16 }];

function TabOverview({ mobile, C }: { mobile: boolean; C: C }) {
  const impressions = useTick(MCCARTY_LIVE_BASE.impressions, 980);
  const reach = useTick(MCCARTY_LIVE_BASE.reach, 18);
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
        <KpiCard label="Total Impressions" value={fmt(impressions)} sub="↑ 4.1% vs last week" color={C.red} C={C} />
        <KpiCard label="Voters Reached" value={fmt(reach)} sub={`${MCCARTY_LIVE_BASE.frequency}x avg frequency`} color={C.green} C={C} />
        <KpiCard label="Completion Rate" value={`${MCCARTY_LIVE_BASE.completionRate}%`} sub="CTV ad completions" color={C.blue} C={C} />
        <KpiCard label="SiteID Voters ID'd" value="6,284" sub="Name, address, phone matched" color={C.gold} C={C} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "3fr 1fr", gap: 16 }}>
        <Card C={C}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: C.muted }}>Daily Voter Delivery (000s)</span>
            <div style={{ display: "flex", gap: 4 }}>
              {DATE_RANGES.map(r => (
                <button key={r.days} onClick={() => setRangeDays(r.days)} style={{
                  padding: "4px 10px", fontSize: 10, fontWeight: 700, borderRadius: 6, cursor: "pointer",
                  border: `1px solid ${rangeDays === r.days ? C.red : C.border}`,
                  background: rangeDays === r.days ? `${C.red}22` : "transparent",
                  color: rangeDays === r.days ? C.red : C.muted, transition: "all 0.15s",
                }}>{r.label}</button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={mobile ? 180 : 220}>
            <AreaChart data={chartData}>
              <defs>
                {[["gCTV", C.red], ["gMeta", "#1877f2"], ["gYT", "#ff0000"]].map(([id, color]) => (
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
              <Area type="monotone" dataKey="CTV" stroke={C.red} fill="url(#gCTV)" strokeWidth={2} />
              <Area type="monotone" dataKey="Meta" stroke="#1877f2" fill="url(#gMeta)" strokeWidth={1.5} />
              <Area type="monotone" dataKey="YouTube" stroke="#ff0000" fill="url(#gYT)" strokeWidth={1.5} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        <VoterFeed C={C} />
      </div>

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
              <div style={{ fontSize: 28, fontWeight: 900, color: C.red }}>$68,400</div>
              <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>18-day primary campaign · May 1 – June 16, 2026</div>
            </div>
            <div style={{ background: C.bg3, borderRadius: 10, padding: 16 }}>
              <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>CTV Dominance</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: C.green }}>74%</div>
              <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>of all impressions delivered via CTV streaming</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

// ── Vote Movement Tracker ───────────────────────────────────────────────────
function VoteMovementTracker({ C }: { C: C }) {
  const T = MCCARTY_VOTE_TARGET;
  // Days remaining countdown
  const electionDay = new Date("2026-06-16");
  const today = new Date();
  const daysLeft = Math.max(1, Math.ceil((electionDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
  const pctToWin = Math.min(100, Math.round(((T.committedBase + T.movedToMcCarty) / T.winThreshold) * 100));
  const gapToWin = Math.max(0, T.winThreshold - T.committedBase - T.movedToMcCarty);
  // Votes needed per day to hit threshold by election day
  const votesPerDay = Math.ceil(gapToWin / daysLeft);
  const votersPerDayPace = Math.ceil(gapToWin / daysLeft);

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
    <div style={{ background: C.card, border: `2px solid ${C.red}44`, borderRadius: 16, padding: 24, marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.red, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 4 }}>🗳️ Vote Win Tracker — June 16, 2026</div>
          <div style={{ fontSize: 13, color: C.muted }}>Target: {T.winThreshold.toLocaleString()} votes to win Tulsa County DA Republican Primary</div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ background: `${C.red}22`, border: `1px solid ${C.red}44`, borderRadius: 12, padding: "10px 20px", textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: C.red, lineHeight: 1 }}>{daysLeft}</div>
            <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Days to Election</div>
          </div>
          <div style={{ background: `${C.gold}22`, border: `1px solid ${C.gold}44`, borderRadius: 12, padding: "10px 20px", textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: C.gold, lineHeight: 1 }}>{votersPerDayPace}</div>
            <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Votes/Day Needed</div>
          </div>
        </div>
      </div>

      {/* Daily pace alert bar */}
      <div style={{ background: `${C.gold}15`, border: `1px solid ${C.gold}33`, borderRadius: 10, padding: "10px 16px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 16 }}>⚡</span>
        <div>
          <span style={{ fontSize: 12, fontWeight: 700, color: C.gold }}>Daily Pace Required: {votesPerDay} undecided voters moved per day</span>
          <span style={{ fontSize: 11, color: C.muted }}> — to close the {gapToWin.toLocaleString()}-vote gap before June 16. Current pace: {Math.round(T.movedToMcCarty / 17)}/day (needs acceleration).</span>
        </div>
      </div>

      {/* Budget Urgency Calculator */}
      <div style={{ background: `${C.red}0d`, border: `1px solid ${C.red}33`, borderRadius: 12, padding: 16, marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.red, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>💰 Budget Urgency — Ad Spend Required to Close the Gap</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 12 }}>
          {[
            {
              label: "Spend/Day Needed",
              value: `$${Math.ceil(3800 / daysLeft).toLocaleString()}`,
              sub: `To deliver ${votesPerDay} exposures/day to undecided voters`,
              color: C.red,
            },
            {
              label: "Cost Per Vote Moved",
              value: "$0.90",
              sub: "Based on current CTV CPV × avg exposures to threshold",
              color: C.gold,
            },
            {
              label: "Remaining Budget",
              value: `$${Math.max(0, 68400 - Math.round(68400 * (17 - daysLeft) / 17)).toLocaleString()}`,
              sub: `Est. unspent of $68,400 total · ${daysLeft} days left`,
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
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[
            { channel: "CTV Streaming (74%)",   dailySpend: Math.ceil(3800 * 0.74 / daysLeft), note: "Primary voter ID channel — maintain dominance" },
            { channel: "Meta Ads (10%)",         dailySpend: Math.ceil(3800 * 0.10 / daysLeft), note: "Retarget debate viewers + lookalike undecided" },
            { channel: "Google Ads (6%)",        dailySpend: Math.ceil(3800 * 0.06 / daysLeft), note: "Search intent — 'Tulsa DA race' keyword capture" },
            { channel: "YouTube (5%)",           dailySpend: Math.ceil(3800 * 0.05 / daysLeft), note: "Debate replay retarget — high-intent segment" },
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
          <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${Math.min(100, (T.committedBase / T.winThreshold) * 100)}%`, background: C.red, borderRadius: "8px 0 0 8px" }} />
          {/* Moved voters */}
          <div style={{ position: "absolute", left: `${(T.committedBase / T.winThreshold) * 100}%`, top: 0, height: "100%", width: `${Math.min(100 - (T.committedBase / T.winThreshold) * 100, (T.movedToMcCarty / T.winThreshold) * 100)}%`, background: C.green }} />
          {/* Win threshold line */}
          <div style={{ position: "absolute", right: 0, top: 0, height: "100%", width: 2, background: "rgba(255,255,255,0.6)" }} />
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 8, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: C.red, flexShrink: 0 }} />
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
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 20 }}>
        {[
          { label: "Undecided Universe",   value: T.undecidedUniverse.toLocaleString(), sub: "Total movable voters in reach",          color: C.blue },
          { label: "Moved → McCarty",       value: T.movedToMcCarty.toLocaleString(),   sub: "Undecided → confirmed via media signals", color: C.green },
          { label: "Still Undecided",       value: T.stillUndecided.toLocaleString(),   sub: "Active targeting priority",               color: C.gold },
          { label: "Moved → Kunzweiler",    value: T.movedToKunzweiler.toLocaleString(), sub: "Lost from undecided pool",               color: "#64748b" },
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
              gridTemplateColumns: "1fr 1fr 180px 50px",
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
    if (filter === "lost") return v.currentIntent === "Kunzweiler";
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
    return "❌ Moved → Kunzweiler";
  };

  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.12em" }}>Undecided Voter Movement Log</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {(["all", "moved", "undecided", "lost"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: "4px 10px", fontSize: 10, fontWeight: 700, borderRadius: 6, cursor: "pointer", border: `1px solid ${filter === f ? C.red : C.border}`,
              background: filter === f ? `${C.red}22` : "transparent", color: filter === f ? C.red : C.muted, transition: "all 0.15s",
            }}>{f === "all" ? "All" : f === "moved" ? "Moved → McCarty" : f === "undecided" ? "Still Undecided" : "Lost to Kunzweiler"}</button>
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
    { segment: "Threshold Met (5+ exposures)", count: 42840, color: C.green },
    { segment: "Near Threshold (3–4 exposures)", count: 28620, color: C.gold },
    { segment: "In Progress (1–2 exposures)", count: 24180, color: C.blue },
    { segment: "Not Yet Reached", count: 15453, color: C.muted },
  ];

  const MOOD_CHART = MCCARTY_MOODS.map(m => ({ name: m.mood, value: m.pct, color: m.color }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Vote Win Tracker — always at top */}
      <VoteMovementTracker C={C} />

      {/* Voter Intent Segmentation */}
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "repeat(3, 1fr)", gap: 12 }}>
        {[
          { label: "Colleen McCarty", count: 18400 + 4218, pct: 47, color: C.red, icon: "🟥", desc: "Committed + moved undecided voters" },
          { label: "Undecided / Movable", count: 16782, pct: 35, color: C.gold, icon: "🟡", desc: "Still in play — primary ad target" },
          { label: "Steve Kunzweiler", count: 18400 + 1840, pct: 18, color: "#64748b", icon: "⬜", desc: "Committed Kunzweiler + moved from undecided" },
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
        <KpiCard label="Total Voter Universe" value="111,093" sub="Tulsa County GOP 45+ registered" color={C.red} C={C} />
        <KpiCard label="Persuasion Threshold Met" value="42,840" sub="5+ exposures delivered" color={C.green} C={C} />
        <KpiCard label="SiteID Matched" value="6,284" sub="60% match rate on site visitors" color={C.gold} C={C} />
        <KpiCard label="Avg Persuasion Score" value="67.4" sub="Across all reached voters" color={C.blue} C={C} />
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
              <ProgressBar value={p.count} max={111093} color={p.color} C={C} />
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
        <KpiCard label="Total Debate Viewers" value={fmt(DE.totalDebateViewers)} sub="Across all platforms" color={C.red} C={C} />
        <KpiCard label="News on 6 Live" value={fmt(DE.newsOn6Live)} sub="KOTV live broadcast" color={C.gold} C={C} />
        <KpiCard label="YouTube Replay" value={fmt(DE.youtubeReplay)} sub="Post-debate replay views" color="#ff0000" C={C} />
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
                    background: r.retargetPriority === "URGENT" ? `${C.red}33` : r.retargetPriority === "HIGH" ? `${C.green}22` : `${C.gold}22`,
                    color: r.retargetPriority === "URGENT" ? C.red2 : r.retargetPriority === "HIGH" ? C.green : C.gold,
                    border: `1px solid ${r.retargetPriority === "URGENT" ? C.red + "44" : r.retargetPriority === "HIGH" ? C.green + "33" : C.gold + "33"}`,
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
                <div style={{ fontSize: 20, fontWeight: 900, color: C.red }}>+{Math.round(d.postAdImpressions / d.viewers * 100)}%</div>
              </div>
              <ProgressBar value={d.postAdImpressions} max={15000} color={C.red} C={C} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ── TAB: Vote Projections ─────────────────────────────────────────────────────
function TabVoteProjections({ mobile, C }: { mobile: boolean; C: C }) {
  const BUDGET_LEVELS = [
    {
      budget: "$30,000",
      reach: "75,000–95,000",
      frequency: "2–3x",
      impressions: "80,000–120,000",
      siteId: "3,000–5,000",
      newVotes: "7,500–12,000",
      projected: "53,000–68,000",
      cpv: "$2.50–$4.00",
      color: C.blue,
    },
    {
      budget: "$65,000",
      reach: "170,000–220,000",
      frequency: "4–6x",
      impressions: "200,000–350,000",
      siteId: "6,000–9,000",
      newVotes: "23,400–28,000",
      projected: "69,000–84,000",
      cpv: "$2.32–$2.78",
      color: C.gold,
      recommended: true,
    },
    {
      budget: "$93,000",
      reach: "230,000–290,000",
      frequency: "5–7x",
      impressions: "300,000–500,000",
      siteId: "8,000–14,000",
      newVotes: "33,800–42,000",
      projected: "79,000–98,000",
      cpv: "$2.21–$2.75",
      color: C.red,
    },
  ];

  const CONVERSION_SCENARIOS = [
    { scenario: "Conservative", voters: 85000, conversion: 9, newVotes: 7650, total: "53,000–62,000", color: C.blue },
    { scenario: "Realistic", voters: 111093, conversion: 12, newVotes: 13331, total: "62,000–74,000", color: C.gold },
    { scenario: "Optimistic", voters: 111093, conversion: 18, newVotes: 19997, total: "74,000–88,000", color: C.green },
  ];

  const TIMELINE = [
    { day: "Day 1", activity: "Behavioral profiles built, targeting live, CTV activated in Tulsa market" },
    { day: "Days 1–3", activity: "Message A/B testing across voter segments. SiteID identification begins." },
    { day: "Days 4–6", activity: "First optimization cycle — budget shifted to highest-converting ZIPs and messages" },
    { day: "Days 7–12", activity: "Peak frequency window — saturation delivery to highest-propensity voters" },
    { day: "Days 13–15", activity: "Final optimization — pre-election behavioral data informs last message mix" },
    { day: "Days 16–18", activity: "Maximum frequency to identified persuadables. SiteID retargeting at full volume." },
    { day: "June 16", activity: "Election Day — final impression timed to each voter's likely voting window" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Budget levels */}
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "repeat(3, 1fr)", gap: 16 }}>
        {BUDGET_LEVELS.map(b => (
          <Card key={b.budget} C={C} style={{ borderTop: `3px solid ${b.color}`, position: "relative" }}>
            {b.recommended && (
              <div style={{ position: "absolute", top: -1, right: 16, background: C.gold, color: "#000", fontSize: 9, fontWeight: 800, padding: "3px 8px", borderRadius: "0 0 6px 6px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Recommended</div>
            )}
            <div style={{ fontSize: 22, fontWeight: 900, color: b.color, marginBottom: 12 }}>{b.budget}</div>
            {[
              ["Voters Reached", b.reach],
              ["Avg Frequency", b.frequency],
              ["Digital Impressions", b.impressions],
              ["SiteID Contacts", b.siteId],
              ["New Votes Generated", b.newVotes],
              ["Projected Total", b.projected],
              ["Cost Per Vote", b.cpv],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${C.border}` }}>
                <span style={{ fontSize: 11, color: C.muted }}>{k}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: C.white }}>{v}</span>
              </div>
            ))}
          </Card>
        ))}
      </div>

      {/* Conversion scenarios */}
      <Card C={C}>
        <SectionTitle C={C}>Vote Conversion Scenarios — Current $68,400 Budget</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "repeat(3, 1fr)", gap: 12 }}>
          {CONVERSION_SCENARIOS.map(s => (
            <div key={s.scenario} style={{ background: C.bg3, borderRadius: 10, padding: 16, borderTop: `3px solid ${s.color}` }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: s.color, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>{s.scenario}</div>
              <div style={{ fontSize: 11, color: C.muted, marginBottom: 6 }}>{fmt(s.voters)} voters reached · {s.conversion}% conversion</div>
              <div style={{ fontSize: 26, fontWeight: 900, color: s.color, marginBottom: 4 }}>{fmt(s.newVotes)}</div>
              <div style={{ fontSize: 10, color: C.muted }}>new votes generated</div>
              <div style={{ marginTop: 8, fontSize: 12, fontWeight: 700, color: C.white }}>Projected Total: {s.total}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16, background: `${C.red}11`, border: `1px solid ${C.red}33`, borderRadius: 10, padding: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.red2, marginBottom: 4 }}>Votes Needed to Win</div>
          <div style={{ fontSize: 13, color: C.white }}>Tulsa County DA primary: approximately <strong>12,000–18,000</strong> votes needed to win in a 3-way primary. McCarty is tracking toward <strong>14,200–19,800</strong> at current trajectory. The race is within reach.</div>
        </div>
      </Card>

      {/* 18-day timeline */}
      <Card C={C}>
        <SectionTitle C={C}>18-Day Campaign Timeline</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {TIMELINE.map((t, i) => (
            <div key={t.day} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ width: 80, flexShrink: 0, fontSize: 10, fontWeight: 700, color: t.day === "June 16" ? C.red : C.gold, textTransform: "uppercase", letterSpacing: "0.06em", paddingTop: 2 }}>{t.day}</div>
              <div style={{ width: 2, background: i === TIMELINE.length - 1 ? C.red : C.border, alignSelf: "stretch", borderRadius: 1, flexShrink: 0 }} />
              <div style={{ fontSize: 12, color: C.white, paddingTop: 1 }}>{t.activity}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ── TAB: CTV Performance ──────────────────────────────────────────────────────
function TabCTV({ mobile, C }: { mobile: boolean; C: C }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr 1fr" : "1fr 1fr 1fr 1fr", gap: 12 }}>
        <KpiCard label="CTV Impressions" value="2.11M" sub="74% of total campaign" color={C.red} C={C} />
        <KpiCard label="Avg Completion Rate" value="90.4%" sub="Across all CTV channels" color={C.green} C={C} />
        <KpiCard label="Avg CPM" value="$17.82" sub="Blended CTV rate" color={C.gold} C={C} />
        <KpiCard label="Channels Active" value="13" sub="Samsung, Tubi, Fox News + 10 more" color={C.blue} C={C} />
      </div>

      <Card C={C}>
        <SectionTitle C={C}>CTV Channel Performance — Impressions & Completion Rate</SectionTitle>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr>
                {["Channel", "Impressions", "Completions", "CPM", "Frequency", "Completion %"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "8px 10px", fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em", borderBottom: `1px solid ${C.border}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MCCARTY_CTV_CHANNELS.map((ch, i) => (
                <tr key={ch.name} style={{ background: i % 2 === 0 ? "transparent" : C.bg3 }}>
                  <td style={{ padding: "8px 10px", color: C.white, fontWeight: 600 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: ch.color, flexShrink: 0 }} />
                      {ch.name}
                    </div>
                  </td>
                  <td style={{ padding: "8px 10px", color: C.white }}>{fmt(ch.impressions)}</td>
                  <td style={{ padding: "8px 10px", color: C.white }}>{fmt(ch.completions)}</td>
                  <td style={{ padding: "8px 10px", color: C.gold }}>${ch.cpm.toFixed(2)}</td>
                  <td style={{ padding: "8px 10px", color: C.white }}>{ch.frequency.toFixed(2)}x</td>
                  <td style={{ padding: "8px 10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <ProgressBar value={ch.completionRate} max={100} color={ch.color} C={C} />
                      <span style={{ fontSize: 11, fontWeight: 700, color: ch.color, minWidth: 36 }}>{ch.completionRate}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card C={C}>
        <SectionTitle C={C}>Creative Performance</SectionTitle>
        {MCCARTY_CREATIVES.map(cr => (
          <div key={cr.name} style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 12, color: C.white }}>{cr.name}</span>
              <span style={{ fontSize: 11, color: C.muted }}>{fmt(cr.impressions)} impressions · CTR {cr.ctr}%</span>
            </div>
            <ProgressBar value={cr.completionRate} max={100} color={cr.color} C={C} />
            <div style={{ fontSize: 10, color: C.muted, marginTop: 3 }}>{cr.completionRate}% completion rate</div>
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

// ── Main Dashboard ────────────────────────────────────────────────────────────
const TABS = ["Overview", "Voter Intel", "Debate", "Vote Projections", "CTV", "Voter Profiles"];

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
      <div style={{ background: C.headerBg, borderBottom: "1px solid rgba(200,16,46,0.3)", padding: mobile ? "12px 16px" : "14px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 200 }}>
        <div style={{ display: "flex", alignItems: "center", gap: mobile ? 10 : 16, minWidth: 0 }}>
          <button onClick={() => navigate("/campaigns")} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 8, padding: "5px 10px", color: "#f1f5f9", fontSize: 11, cursor: "pointer", flexShrink: 0 }}>
            ← Campaigns
          </button>
          <div style={{ width: 1, height: 24, background: "rgba(255,255,255,0.2)", flexShrink: 0 }} />
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <span style={{ width: 8, height: 8, background: C.red, borderRadius: "50%", boxShadow: `0 0 10px ${C.red}`, animation: "pdot 2s ease-in-out infinite" }} />
            <span style={{ fontSize: mobile ? 10 : 12, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "#ffffff" }}>{mobile ? "EA" : "EXACT AUDIENCE"}</span>
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
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", fontVariantNumeric: "tabular-nums" }}>
            {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: C.bg2, borderBottom: `1px solid ${C.border}`, padding: "0 28px", overflowX: "auto", display: "flex", gap: 0 }}>
        {TABS.map((t, i) => (
          <button key={t} onClick={() => setTab(i)} style={{
            padding: mobile ? "10px 12px" : "12px 18px", fontSize: mobile ? 10 : 11, fontWeight: 700,
            letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer", whiteSpace: "nowrap",
            background: "transparent", border: "none", borderBottom: `2px solid ${tab === i ? C.red : "transparent"}`,
            color: tab === i ? C.red : C.muted, transition: "all 0.15s",
          }}>{t}</button>
        ))}
      </div>

      {/* Content */}
      <div ref={contentRef} style={{ padding: mobile ? "16px" : "24px 28px" }}>
        {tabContent[tab]}
      </div>

      {/* Footer */}
      <div style={{ padding: "16px 28px", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <div style={{ fontSize: 10, color: C.muted }}>Powered by Exact Audience · SiteID Intelligence · exactaudience.ai</div>
        <div style={{ fontSize: 10, color: C.muted }}>Colleen McCarty for Tulsa County DA · June 16, 2026 Republican Primary</div>
      </div>
    </div>
  );
}
