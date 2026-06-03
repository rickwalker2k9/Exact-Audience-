import React, { useState, useEffect } from "react";
import { useIsMobile as useMobile } from "@/hooks/useMobile";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import {
  ECHOLS_TIERS, ECHOLS_VOTER_DEMO, ECHOLS_MOODS,
  ECHOLS_CTV_CHANNELS, ECHOLS_DIGITAL_CHANNELS,
  ECHOLS_TIMELINE, ECHOLS_CREATIVES, ECHOLS_EA_ADVANTAGE,
  ECHOLS_RACE, ECHOLS_INTELLIGENCE, ECHOLS_OPPOSITION_POINTS,
} from "@/lib/echolsData";

// ── Color Palette (Blue / Navy theme for Echols) ──────────────────────────────
type C = typeof DARK_C;
const DARK_C = {
  bg: "#060c1a", bg2: "#091224", bg3: "#0d1a2e", card: "#0d1a2e",
  border: "#1a2e4a", white: "#e8f4fd", muted: "#7ba8c8",
  accent: "#1d4ed8", accent2: "#3b82f6", blue2: "#60a5fa",
  green: "#10b981", gold: "#f59e0b", amber: "#f59e0b",
  purple: "#a855f7", teal: "#0ea5e9",
  tooltipBg: "#1a2e4a",
};
const LIGHT_C = {
  bg: "#f0f7ff", bg2: "#e0efff", bg3: "#d0e7ff", card: "#ffffff",
  border: "#93c5fd", white: "#0f172a", muted: "#1e40af",
  accent: "#1d4ed8", accent2: "#2563eb", blue2: "#1d4ed8",
  green: "#059669", gold: "#b45309", amber: "#d97706",
  purple: "#9333ea", teal: "#0284c7",
  tooltipBg: "#e0efff",
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

// ── County data (Echols perspective) ─────────────────────────────────────────
const ECHOLS_COUNTY_STRATEGY = [
  { county: "Oklahoma County",  gopReg: 163500, totalVoteTarget: 32700, currentSupport: 3597, votesToGain: 3597, investment: 16500 },
  { county: "Tulsa County",     gopReg: 147200, totalVoteTarget: 29440, currentSupport: 3238, votesToGain: 3238, investment: 14800 },
  { county: "Cleveland County", gopReg: 79100,  totalVoteTarget: 15820, currentSupport: 1740, votesToGain: 1740, investment: 8000  },
  { county: "Canadian County",  gopReg: 68400,  totalVoteTarget: 13680, currentSupport: 1505, votesToGain: 1505, investment: 6900  },
  { county: "Comanche County",  gopReg: 37800,  totalVoteTarget: 7560,  currentSupport: 832,  votesToGain: 832,  investment: 3800  },
  { county: "Rogers County",    gopReg: 36100,  totalVoteTarget: 7220,  currentSupport: 794,  votesToGain: 794,  investment: 3600  },
  { county: "Wagoner County",   gopReg: 32400,  totalVoteTarget: 6480,  currentSupport: 713,  votesToGain: 713,  investment: 3300  },
  { county: "Payne County",     gopReg: 30600,  totalVoteTarget: 6120,  currentSupport: 673,  votesToGain: 673,  investment: 3100  },
];

// ── Vote Math Engine ─────────────────────────────────────────────────────────
function useVoteMath() {
  function getMidnightCSTKey() {
    const now = new Date();
    const cst = new Date(now.getTime() - 6 * 3600000);
    return `${cst.getUTCFullYear()}-${cst.getUTCMonth()}-${cst.getUTCDate()}`;
  }
  const [dayKey, setDayKey] = useState(getMidnightCSTKey);
  useEffect(() => {
    function scheduleRefresh() {
      const now = new Date();
      const cst = new Date(now.getTime() - 6 * 3600000);
      const nextMidnight = new Date(cst);
      nextMidnight.setUTCHours(24, 0, 0, 0);
      const msUntilMidnight = nextMidnight.getTime() - cst.getTime();
      return setTimeout(() => {
        setDayKey(getMidnightCSTKey());
        scheduleRefresh();
      }, msUntilMidnight);
    }
    const t = scheduleRefresh();
    return () => clearTimeout(t);
  }, []);

  const ELECTION_UTC = new Date("2026-06-17T00:00:00Z").getTime();
  const now = Date.now();
  const daysLeft = Math.max(0, Math.ceil((ELECTION_UTC - now) / 86400000));

  const ECHOLS_BASE   = 32.5;
  const STARLING_BASE = 30.7;
  const UNDECIDED_BASE = 36.8;

  const counties = [
    { county: "Oklahoma County",  gopReg: 163500 },
    { county: "Tulsa County",     gopReg: 147200 },
    { county: "Cleveland County", gopReg: 79100  },
    { county: "Canadian County",  gopReg: 68400  },
    { county: "Comanche County",  gopReg: 37800  },
    { county: "Rogers County",    gopReg: 36100  },
    { county: "Wagoner County",   gopReg: 32400  },
    { county: "Payne County",     gopReg: 30600  },
  ];

  const TURNOUT = 0.20;
  const totalTurnout = Math.round(counties.reduce((s, c) => s + c.gopReg, 0) * TURNOUT);
  const echolsVotes   = Math.round(totalTurnout * (ECHOLS_BASE / 100));
  const starlingVotes = Math.round(totalTurnout * (STARLING_BASE / 100));
  const undecidedPool = Math.round(totalTurnout * (UNDECIDED_BASE / 100));
  const winThreshold  = Math.floor(totalTurnout / 2) + 1;
  const votesNeeded   = winThreshold - echolsVotes;
  const minUndecidedShare = (starlingVotes - echolsVotes + undecidedPool) / (2 * undecidedPool);
  const minUndecidedVotes = Math.round(undecidedPool * minUndecidedShare) + 1;

  const countyData = counties.map(c => {
    const t = Math.round(c.gopReg * TURNOUT);
    const u = Math.round(t * (UNDECIDED_BASE / 100));
    const need = Math.round(u * minUndecidedShare) + 1;
    return { county: c.county.replace(" County", ""), turnout: t, undecided: u, echolsNeeds: need };
  });

  return { dayKey, daysLeft, totalTurnout, echolsVotes, starlingVotes, undecidedPool, winThreshold, votesNeeded, minUndecidedShare, minUndecidedVotes, countyData, ECHOLS_BASE, STARLING_BASE, UNDECIDED_BASE };
}

// ── Animated Counter ─────────────────────────────────────────────────────────
function AnimatedCounter({ target, duration = 1200, prefix = "", suffix = "", color, style }: { target: number; duration?: number; prefix?: string; suffix?: string; color: string; style?: React.CSSProperties }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setVal(Math.round(ease * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return <span style={{ color, ...style }}>{prefix}{val.toLocaleString()}{suffix}</span>;
}

// ── TAB: Overview ─────────────────────────────────────────────────────────────
function TabOverview({ mobile, C }: { mobile: boolean; C: C }) {
  const R = ECHOLS_RACE;
  const vm = useVoteMath();
  const [barsVisible, setBarsVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setBarsVisible(true), 300); return () => clearTimeout(t); }, []);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Election Countdown */}
      <ElectionCountdown C={C} />

      {/* Mission Banner */}
      <div style={{ background: `linear-gradient(135deg, ${C.accent}18 0%, ${C.teal}12 100%)`, border: `1px solid ${C.accent2}40`, borderRadius: 12, padding: "20px 24px" }}>
        <div style={{ fontSize: 16, fontWeight: 900, color: C.white, marginBottom: 6 }}>Right Person. Right Message. Right Time.</div>
        <div style={{ fontSize: 13, color: C.white, lineHeight: 1.7, fontWeight: 400 }}>
          Exact Audience has identified <strong style={{ color: C.accent2 }}>200,035 undecided Republican primary voters</strong> across Oklahoma — by name, address, mobile number, and email. Jon Echols leads the race and has the endorsements of 59 county sheriffs, the Oklahoma FOP, and every major law enforcement organization in the state. Exact Audience locks in that lead — reaching every persuadable voter on the exact screen they are watching right now.
        </div>
      </div>

      {/* Race Snapshot */}
      <Card C={C}>
        <SectionTitle C={C}>Race Snapshot — Oklahoma AG Primary</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr 1fr" : "repeat(4,1fr)", gap: 12, marginBottom: 16 }}>
          <KpiCard label="Election Date" value={R.electionDate} color={C.accent2} C={C} />
          <KpiCard label="Race Type: Primary" value="Primary" sub="Echols vs. Starling" color={C.blue2} C={C} />
          <KpiCard label="Office" value="Attorney General" sub="Oklahoma Statewide" color={C.gold} C={C} />
          <KpiCard label="EA Advantage" value="Voter DNA" sub="Identified by name & address" color={C.green} C={C} />
        </div>
        {/* Polling bar */}
        <div style={{ background: C.bg3, borderRadius: 10, padding: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase" as const, letterSpacing: "0.1em", marginBottom: 10 }}>Current Polling Landscape</div>
          <div style={{ fontSize: 15, fontWeight: 800, color: C.white, lineHeight: 1.5, marginBottom: 16 }}>
            36.8% of likely voters are still undecided — Echols leads by 1.8 points. Exact Audience locks in that lead by reaching every persuadable voter by name, on the exact screen they are watching right now.
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { name: "Jon Echols", pct: R.echolsPct, color: C.accent2 },
              { name: "Jeff Starling", pct: R.starlingPct, color: C.muted },
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
        </div>
      </Card>

      {/* ── VOTE MATH SECTION ─────────────────────────────────────────── */}
      <div style={{ background: `linear-gradient(135deg, ${C.accent}20 0%, ${C.teal}14 50%, ${C.blue2}10 100%)`, border: `1px solid ${C.accent2}50`, borderRadius: 14, padding: mobile ? 16 : 24 }}>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.accent2, textTransform: "uppercase" as const, letterSpacing: "0.14em", marginBottom: 6 }}>Live Vote Math — Updates Daily at Midnight CST</div>
          <div style={{ fontSize: mobile ? 20 : 26, fontWeight: 900, color: C.white, lineHeight: 1.2, marginBottom: 8 }}>
            Echols needs <AnimatedCounter target={vm.votesNeeded} color={C.accent2} style={{ fontSize: mobile ? 22 : 28 }} /> more votes to win.
          </div>
          <div style={{ fontSize: 13, color: C.white, lineHeight: 1.6 }}>
            With <strong style={{ color: C.teal }}>{vm.daysLeft} days</strong> until Election Day, there are{" "}
            <strong style={{ color: C.gold }}>tens of thousands of undecided Republican primary voters</strong>{" "}
            across 8 counties — identified by name, address, and device. Echols must win{" "}
            <strong style={{ color: C.accent2 }}>{(vm.minUndecidedShare * 100).toFixed(1)}%</strong> of them to cross the finish line.
          </div>
        </div>

        {/* KPI Row */}
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr 1fr" : "repeat(4,1fr)", gap: 10, marginBottom: 20 }}>
          {[
            { label: "Win Threshold",         value: vm.winThreshold,  color: C.green,    sub: "votes needed to win" },
            { label: "Echols Has Now",         value: vm.echolsVotes,   color: C.accent2,  sub: `${vm.ECHOLS_BASE}% committed` },
            { label: "Starling Has Now",       value: vm.starlingVotes, color: C.muted,    sub: `${vm.STARLING_BASE}% committed` },
            { label: "Votes Echols Still Needs", value: vm.votesNeeded, color: "#f87171",  sub: "from undecided pool" },
          ].map(k => (
            <div key={k.label} style={{ background: `${C.card}cc`, borderRadius: 10, padding: "14px 16px", borderTop: `3px solid ${k.color}`, backdropFilter: "blur(4px)" }}>
              <div style={{ fontSize: 9, color: C.muted, textTransform: "uppercase" as const, letterSpacing: "0.1em", marginBottom: 6 }}>{k.label}</div>
              <div style={{ fontSize: 22, fontWeight: 900, lineHeight: 1 }}>
                <AnimatedCounter target={k.value} color={k.color} duration={1400} />
              </div>
              <div style={{ fontSize: 10, color: C.muted, marginTop: 4 }}>{k.sub}</div>
            </div>
          ))}
        </div>

        {/* Polling bars animated */}
        <div style={{ background: `${C.bg3}cc`, borderRadius: 10, padding: 16, marginBottom: 20, backdropFilter: "blur(4px)" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 14 }}>Current Polling — 8-County Universe</div>
          {[
            { name: "Jon Echols",             pct: vm.ECHOLS_BASE,    color: C.accent2, votes: vm.echolsVotes },
            { name: "Jeff Starling",          pct: vm.STARLING_BASE,  color: "#94a3b8",  votes: vm.starlingVotes },
            { name: "Undecided / Persuadable", pct: vm.UNDECIDED_BASE, color: C.teal,    votes: vm.undecidedPool },
          ].map(bar => (
            <div key={bar.name} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: C.white }}>{bar.name}</span>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <span style={{ fontSize: 11, color: C.muted }}><AnimatedCounter target={bar.votes} color={C.muted} duration={1600} /> votes</span>
                  <span style={{ fontSize: 14, fontWeight: 900, color: bar.color }}>{bar.pct}%</span>
                </div>
              </div>
              <div style={{ background: C.border, borderRadius: 6, height: 12, overflow: "hidden" }}>
                <div style={{ width: barsVisible ? `${bar.pct}%` : "0%", background: `linear-gradient(90deg, ${bar.color}, ${bar.color}bb)`, height: "100%", borderRadius: 6, transition: "width 1.2s cubic-bezier(0.23,1,0.32,1)" }} />
              </div>
            </div>
          ))}
        </div>

        {/* County bar chart */}
        <div style={{ background: `${C.bg3}cc`, borderRadius: 10, padding: 16, backdropFilter: "blur(4px)" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 14 }}>Voters To Persuade Per County — From Undecided Pool</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={vm.countyData} layout="vertical" margin={{ top: 0, right: 60, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} horizontal={false} />
              <XAxis type="number" tick={{ fill: C.muted, fontSize: 10 }} tickFormatter={(v: number) => v.toLocaleString()} />
              <YAxis type="category" dataKey="county" tick={{ fill: C.white, fontSize: 11, fontWeight: 600 }} width={90} />
              <Tooltip
                contentStyle={{ background: C.tooltipBg, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 11 }}
                labelStyle={{ color: C.white, fontWeight: 700 }}
                formatter={(value: number, name: string) => [value.toLocaleString(), name === "echolsNeeds" ? "Need To Persuade" : name === "undecided" ? "Total Undecided" : name]}
              />
              <Bar dataKey="undecided" name="Total Undecided" fill={`${C.teal}50`} radius={[0,4,4,0]} />
              <Bar dataKey="echolsNeeds" name="Need To Persuade" fill={C.accent2} radius={[0,4,4,0]} label={{ position: "right", fill: C.accent2, fontSize: 10, fontWeight: 700, formatter: (v: number) => v.toLocaleString() }} />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ marginTop: 10, fontSize: 11, color: C.white, lineHeight: 1.6 }}>
            <strong style={{ color: C.accent2 }}>Oklahoma + Tulsa counties alone</strong> hold the majority of the undecided universe. Echols' law enforcement endorsements give him a structural advantage in both metro areas.
          </div>
        </div>
      </div>

      {/* Voter Mood Segments */}
      <Card C={C}>
        <SectionTitle C={C}>Statewide Voter Mood Segments — What They Are Watching</SectionTitle>
        <div style={{ fontSize: 12, color: C.white, marginBottom: 14, lineHeight: 1.6 }}>
          Our behavioral data shows how undecided Oklahoma Republican primary voters are consuming media right now. Each mood segment maps directly to the channels where they can be reached.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 12 }}>
          {ECHOLS_MOODS.map((m: any) => (
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
          {ECHOLS_EA_ADVANTAGE.map((a: any) => (
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
                  <div style={{ fontSize: 11, color: C.white, lineHeight: 1.5 }}>{s.desc}</div>
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
        <SectionTitle C={C}>County-by-County Strategy — Focusing Resources Where They Deliver</SectionTitle>
        <div style={{ overflowX: "auto" as const }}>
          <table style={{ width: "100%", borderCollapse: "collapse" as const, fontSize: 11 }}>
            <thead>
              <tr style={{ background: C.bg3 }}>
                {["County", "GOP Reg.", "Proj. Turnout", "Current Support", "Need To Persuade", "Investment"].map(h => (
                  <th key={h} style={{ padding: "8px 12px", textAlign: "left" as const, color: C.white, fontWeight: 600, borderBottom: `1px solid ${C.border}`, whiteSpace: "nowrap" as const }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ECHOLS_COUNTY_STRATEGY.map((row, i) => (
                <tr key={row.county} style={{ borderBottom: `1px solid ${C.border}`, background: i % 2 === 0 ? "transparent" : `${C.bg3}50` }}>
                  <td style={{ padding: "8px 12px", color: C.white, fontWeight: 600 }}>{row.county}</td>
                  <td style={{ padding: "8px 12px", color: C.white }}>{row.gopReg.toLocaleString()}</td>
                  <td style={{ padding: "8px 12px", color: C.white }}>{row.totalVoteTarget.toLocaleString()}</td>
                  <td style={{ padding: "8px 12px", color: C.accent2, fontWeight: 700 }}>{row.currentSupport.toLocaleString()}</td>
                  <td style={{ padding: "8px 12px", color: C.gold, fontWeight: 700 }}>{row.votesToGain.toLocaleString()}</td>
                  <td style={{ padding: "8px 12px", color: C.green, fontWeight: 700 }}>${row.investment.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: 14, background: C.bg3, borderRadius: 8, padding: "12px 16px", fontSize: 12, color: C.white, lineHeight: 1.6 }}>
          Built on Oklahoma State Election Board voter counts (Jan 2026) with 20% primary turnout projection. Two-man race: Echols vs. Starling. Exact Audience has matched the full undecided universe in every county — these voters are identified by name and ready to reach.
        </div>
      </Card>

      {/* SEO Comparison */}
      <Card C={C}>
        <SectionTitle C={C}>Website & SEO Intelligence — jonechols.com vs jeffstarling.com</SectionTitle>
        <div style={{ fontSize: 12, color: C.white, lineHeight: 1.6, marginBottom: 14 }}>
          Source: Ubersuggest, May 2026. Neither candidate is running paid search — all traffic is organic.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 16, marginBottom: 16 }}>
          <div style={{ background: `${C.accent}12`, border: `1px solid ${C.accent}30`, borderRadius: 10, padding: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: C.accent2, marginBottom: 12 }}>jonechols.com</div>
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
                  <div style={{ fontSize: 10, color: C.accent2 }}>{s.note}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 12, fontSize: 12, color: C.white, lineHeight: 1.6 }}>
              <strong style={{ color: C.green }}>22,929 backlinks</strong> from 14 years in the Oklahoma House give jonechols.com massive domain authority. Paid search on "jon echols attorney general" and "echols oklahoma ag" would capture high-intent voters with zero competition.
            </div>
          </div>
          <div style={{ background: `${C.gold}08`, border: `1px solid ${C.gold}25`, borderRadius: 10, padding: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: C.gold, marginBottom: 12 }}>jeffstarling.com</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { label: "Monthly Organic Visits", value: "26", note: "100% organic" },
                { label: "Domain Authority", value: "17", note: "New entrant" },
                { label: "Ranking Keywords", value: "14", note: "All organic" },
                { label: "Backlinks", value: "48", note: "6 nofollow" },
              ].map(s => (
                <div key={s.label} style={{ background: C.bg3, borderRadius: 8, padding: "10px 12px" }}>
                  <div style={{ fontSize: 10, color: C.muted, marginBottom: 4, textTransform: "uppercase" as const, letterSpacing: "0.08em" }}>{s.label}</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: C.white }}>{s.value}</div>
                  <div style={{ fontSize: 10, color: C.gold }}>{s.note}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 12, fontSize: 12, color: C.white, lineHeight: 1.6 }}>
              <strong style={{ color: C.gold }}>Key insight:</strong> Starling gets 26 organic visits/month vs. Echols' 4 — but Starling's DA is only 17 with 48 backlinks. Echols' 22,929 backlinks are a structural advantage that paid search can immediately monetize.
            </div>
          </div>
        </div>
        <div style={{ background: `${C.teal}10`, border: `1px solid ${C.teal}30`, borderRadius: 8, padding: "12px 16px", fontSize: 12, color: C.white, lineHeight: 1.6 }}>
          <strong style={{ color: C.accent2 }}>Strategic implication:</strong> Echols is winning the endorsement and credibility battle but losing the digital presence battle. Paid search on "jon echols attorney general" and contrast keywords ("starling dark money", "starling exploit victim ad") would capture voters already searching — and Starling is running zero paid search to defend his position.
        </div>
      </Card>
    </div>
  );
}

// ── TAB: Voter Universe ───────────────────────────────────────────────────────
function TabVoterUniverse({ mobile, C }: { mobile: boolean; C: C }) {
  const D = ECHOLS_VOTER_DEMO;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ background: `${C.accent}10`, border: `1px solid ${C.accent2}30`, borderRadius: 12, padding: "16px 20px" }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: C.white, marginBottom: 6 }}>Statewide Undecided Republican Primary Voter Universe</div>
        <div style={{ fontSize: 12, color: C.white, lineHeight: 1.6 }}>
          Exact Audience has identified and profiled a large statewide universe of undecided Republican primary voters across Oklahoma. Every person below is identified by name, address, mobile number, email, and behavioral data — not modeled estimates. These are real, reachable voters.
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: mobile ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: 12 }}>
        <KpiCard label="Voter Universe" value="Statewide" sub="Identified by name & address" color={C.accent2} C={C} />
        <KpiCard label="Mobile Reachable" value="93.8%" sub="Direct mobile number on file" color={C.blue2} C={C} />
        <KpiCard label="Email on File" value="98.8%" sub="Verified personal email" color={C.green} C={C} />
        <KpiCard label="Avg DB Matches" value={`${D.avgDbMatches}x`} sub="Data points per voter" color={C.gold} C={C} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 16 }}>
        <Card C={C}>
          <SectionTitle C={C}>Gender Breakdown</SectionTitle>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={D.gender} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" paddingAngle={3}>
                {D.gender.map((g: any) => <Cell key={g.label} fill={g.color} />)}
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
                {D.ageRanges.map((a: any) => <Cell key={a.label} fill={a.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

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

      <Card C={C}>
        <SectionTitle C={C}>Behavioral Intelligence — What They Are Doing Online Right Now</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 10 }}>
          {ECHOLS_INTELLIGENCE.map((s: any) => (
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
  const [selected, setSelected] = useState(1);
  const tier = ECHOLS_TIERS[selected];
  const tierColors = [C.teal, C.accent2, C.purple];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ background: `${C.blue2}10`, border: `1px solid ${C.blue2}30`, borderRadius: 12, padding: "14px 18px" }}>
        <div style={{ fontSize: 12, color: C.white, fontWeight: 700, marginBottom: 4 }}>Three Investment Levels — Three Outcomes</div>
        <div style={{ fontSize: 12, color: C.white, lineHeight: 1.6 }}>
          Every dollar goes directly toward reaching identified, named, undecided Republican primary voters in Oklahoma — on the exact streaming channels they watch right now. Below is what each investment level delivers in reach, frequency, and estimated votes moved.
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
        {ECHOLS_TIERS.map((t: any, i: number) => (
          <button key={t.id} onClick={() => setSelected(i)} style={{
            background: selected === i ? `${tierColors[i]}18` : C.card,
            border: `2px solid ${selected === i ? tierColors[i] : C.border}`,
            borderRadius: 12, padding: "14px 16px", cursor: "pointer", textAlign: "left" as const, transition: "all 0.15s",
          }}>
            {t.recommended && <div style={{ fontSize: 9, fontWeight: 700, color: tierColors[i], textTransform: "uppercase" as const, letterSpacing: "0.1em", marginBottom: 4 }}>Recommended</div>}
            <div style={{ fontSize: 14, fontWeight: 800, color: C.white }}>${(t.total / 1000).toFixed(0)}K</div>
            <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{t.label}</div>
          </button>
        ))}
      </div>

      <Card C={C}>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 16, fontWeight: 900, color: C.white }}>{tier.label}</div>
          <div style={{ fontSize: 12, color: C.white, marginTop: 4, lineHeight: 1.6 }}>{tier.tagline}</div>
        </div>

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
                  <span style={{ fontSize: 10, color: C.white }}>New Votes for Echols</span>
                  <span style={{ fontSize: 12, fontWeight: 800, color: tierColors[selected] }}>{p.newVotes.toLocaleString()}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 10, color: C.white }}>Projected Total</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: C.green }}>{p.echolsTotal}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card C={C}>
        <SectionTitle C={C}>Side-by-Side Comparison</SectionTitle>
        <div style={{ overflowX: "auto" as const }}>
          <table style={{ width: "100%", borderCollapse: "collapse" as const, fontSize: 11 }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left" as const, padding: "8px 12px", color: C.muted, fontWeight: 600, borderBottom: `1px solid ${C.border}` }}>Metric</th>
                {ECHOLS_TIERS.map((t: any, i: number) => (
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
                  {ECHOLS_TIERS.map((t: any, i: number) => (
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
// Channel logo lookup — uses Clearbit CDN for real network logos
const ECHOLS_CTV_LOGO_MAP: Record<string, string> = {
  "Fox News": "foxnews.com", "CNN": "cnn.com", "MSNBC": "msnbc.com", "Newsmax": "newsmax.com",
  "HLN": "cnn.com", "CNBC": "cnbc.com", "Bloomberg TV": "bloomberg.com",
  "News 9 (KWTV OKC)": "news9.com", "KFOR (OKC NBC)": "kfor.com", "KOCO (OKC ABC)": "koco.com",
  "News on 6 (KOTV Tulsa)": "newson6.com", "Fox 23 Tulsa": "fox23.com", "KJRH (Tulsa NBC)": "kjrh.com",
  "Pluto TV": "pluto.tv", "Tubi": "tubi.tv", "Peacock": "peacocktv.com",
  "Paramount+": "paramountplus.com", "Hulu Live": "hulu.com", "YouTube TV": "tv.youtube.com",
  "Sling TV": "sling.com", "DirecTV Stream": "directv.com", "FuboTV": "fubo.tv",
  "Philo": "philo.com", "Frndly TV": "frndlytv.com", "Vidgo": "vidgo.com",
  "Discovery+": "discoveryplus.com", "A&E": "aetv.com", "History Channel": "history.com",
  "Lifetime": "mylifetime.com", "Hallmark Channel": "hallmarkchannel.com", "HGTV": "hgtv.com",
  "Food Network": "foodnetwork.com", "TLC": "tlc.com", "Bravo": "bravotv.com",
  "E! Entertainment": "eonline.com", "OWN": "oprah.com", "WE tv": "wetv.com",
  "Investigation Discovery": "investigationdiscovery.com", "Court TV": "courttv.com", "Oxygen": "oxygen.com",
  "AMC": "amc.com", "IFC": "ifc.com", "BBC America": "bbcamerica.com",
  "TCM": "tcm.com", "Freeform": "freeform.com", "Disney+": "disneyplus.com",
  "ESPN+": "espn.com", "ESPN": "espn.com", "Fox Sports": "foxsports.com",
  "NBC Sports": "nbcsports.com", "CBS Sports Network": "cbssports.com",
  "FS1": "foxsports.com", "FS2": "foxsports.com", "Big Ten Network": "btn.com",
  "SEC Network": "espn.com", "Golf Channel": "golfchannel.com", "Tennis Channel": "tennischannel.com",
  "Outdoor Channel": "outdoorchannel.com", "Sportsman Channel": "thesportsmanchannel.com",
  "Cowboy Channel": "cowboychannel.com", "RFD-TV": "rfdtv.com",
  "GAC Family": "greatamericanfamily.com", "CMT": "cmt.com", "MTV": "mtv.com",
  "VH1": "vh1.com", "BET": "bet.com", "Univision": "univision.com",
  "Telemundo": "telemundo.com", "Cozi TV": "cozitv.com", "MeTV": "metv.com",
  "OAN": "oann.com", "ABC News Live": "abcnews.go.com", "CBS News": "cbsnews.com",
  "NBC News Now": "nbcnews.com", "NFL Network": "nfl.com", "MLB Network": "mlb.com",
  "NBA TV": "nba.com", "HBO Max": "max.com", "Apple TV+": "apple.com",
  "Amazon Prime": "primevideo.com", "TBS": "tbs.com", "TNT": "tntdrama.com",
  "USA Network": "usanetwork.com", "National Geographic": "nationalgeographic.com",
  "Travel Channel": "travelchannel.com", "Animal Planet": "animalplanet.com",
  "Hallmark": "hallmarkchannel.com", "Plex": "plex.tv", "Xumo": "xumo.com",
};

function EcholsChannelLogo({ name, color }: { name: string; color: string }) {
  const domain = ECHOLS_CTV_LOGO_MAP[name];
  const [err, setErr] = React.useState(false);
  if (!domain || err) {
    return <div style={{ width: 24, height: 24, borderRadius: 6, background: color + "33", border: `1px solid ${color}55`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><div style={{ width: 8, height: 8, borderRadius: "50%", background: color }} /></div>;
  }
  return <img src={`https://logo.clearbit.com/${domain}`} alt={name} onError={() => setErr(true)} style={{ width: 24, height: 24, borderRadius: 6, objectFit: "contain", background: "#fff", flexShrink: 0 }} />;
}

function TabCTVUniverse({ mobile, C }: { mobile: boolean; C: C }) {
  const [filter, setFilter] = useState("all");
  const tiers = ["all", "premium", "news", "sports", "entertainment", "lifestyle"];
  const filtered = filter === "all" ? ECHOLS_CTV_CHANNELS : ECHOLS_CTV_CHANNELS.filter((ch: any) => ch.tier === filter);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Card C={C}>
        <SectionTitle C={C}>Why CTV Wins This Race</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "repeat(3,1fr)", gap: 12 }}>
          {[
            { title: "Voter-Level Targeting", desc: "We match your voter file to streaming households. Your ad only runs in front of identified, named undecided Republican primary voters — not a general audience." },
            { title: "74 Premium Channels", desc: "From Fox News to Hallmark to ESPN — we reach your voters wherever they stream, across every device in the household." },
            { title: "No Wasted Spend", desc: "Traditional broadcast TV buys the whole market. CTV buys only the voters you need. Every impression is a targeted voter impression." },
          ].map(item => (
            <div key={item.title} style={{ background: C.bg3, borderRadius: 10, padding: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.white, marginBottom: 6 }}>{item.title}</div>
              <div style={{ fontSize: 12, color: C.white, lineHeight: 1.5 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </Card>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const }}>
        {tiers.map(t => (
          <button key={t} onClick={() => setFilter(t)} style={{
            background: filter === t ? C.accent2 : C.card,
            border: `1px solid ${filter === t ? C.accent2 : C.border}`,
            color: filter === t ? "#fff" : C.muted,
            borderRadius: 20, padding: "5px 14px", fontSize: 11, fontWeight: 600, cursor: "pointer", textTransform: "capitalize" as const,
          }}>{t === "all" ? `All (${ECHOLS_CTV_CHANNELS.length})` : t}</button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr 1fr" : "repeat(4,1fr)", gap: 8 }}>
        {filtered.map((ch: any) => (
          <div key={ch.name} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 12px", display: "flex", alignItems: "center", gap: 10 }}>
            <EcholsChannelLogo name={ch.name} color={ch.color} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: C.white, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{ch.name}</div>
              <div style={{ fontSize: 9, color: C.white, textTransform: "capitalize" as const }}>{ch.tier}</div>
            </div>
          </div>
        ))}
      </div>

      <Card C={C}>
        <SectionTitle C={C}>Digital Channels — Included at All Tiers</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 10 }}>
          {ECHOLS_DIGITAL_CHANNELS.map((ch: any) => (
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

      <Card C={C}>
        <SectionTitle C={C}>Proposed Ad Concepts</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 12 }}>
          {ECHOLS_CREATIVES.map((cr: any) => (
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
const ECHOLS_ACTION_PLAN = [
  { day: "Jun 2",  phase: "Launch",     channel: "Digital", action: "Activate Meta + Google retargeting on jonechols.com visitors. Serve contrast creative: 'Proven Conservative vs. Dark Money Outsider.'" },
  { day: "Jun 2",  phase: "Launch",     channel: "Email",   action: "Deploy first email blast to matched voter list: subject line 'The AG Race Is Closer Than You Think.' Include Echols' 59-sheriff endorsement and law enforcement record." },
  { day: "Jun 3",  phase: "Launch",     channel: "CTV",     action: "Begin CTV pre-roll on Fox News, Newsmax, Hulu. 30-sec bio spot. Target Oklahoma DMA households with GOP registration match." },
  { day: "Jun 4",  phase: "Build",      channel: "Digital", action: "Expand Exact Audience voter targeting: upload full 200K undecided voter list to Meta and Google. Activate lookalike audiences based on Echols' existing supporter base." },
  { day: "Jun 5",  phase: "Build",      channel: "Digital", action: "Launch paid search on 'oklahoma attorney general 2026', 'starling dark money ad', 'jon echols attorney'. Bid on Starling branded terms." },
  { day: "Jun 6",  phase: "Build",      channel: "Social",  action: "Release contrast video on Facebook/Instagram: Starling's dark money PAC exploiting Micaela Borrego vs. Echols' integrity record. Boost to undecided voter lookalike audience." },
  { day: "Jun 7",  phase: "Build",      channel: "Email",   action: "Second email: 'Jeff Starling's PAC Exploited a Brain-Damaged Victim.' — KFOR story, attorney Noble McIntyre quote, Echols' refusal to run that kind of campaign." },
  { day: "Jun 8",  phase: "Accelerate", channel: "CTV",     action: "Rotate to contrast CTV spot: 'Starling spent four days refusing to denounce an ad exploiting a 23-year-old accident victim. That is not Oklahoma values.' Increase frequency in OKC and Tulsa DMAs." },
  { day: "Jun 9",  phase: "Accelerate", channel: "Digital", action: "Segment Exact Audience voter list by county. Serve county-specific ads: Oklahoma County, Tulsa County, Cleveland County each get tailored law enforcement endorsement messaging." },
  { day: "Jun 10", phase: "Accelerate", channel: "Social",  action: "Deploy testimonial carousel ads: 59 Oklahoma sheriffs, FOP, Professional Firefighters endorsing Echols. Target 45–65 male homeowners in top 8 counties." },
  { day: "Jun 11", phase: "Close",      channel: "Email",   action: "Third email: 'Five Days Left — Here's Why I'm Voting for Jon Echols.' Personal tone. Include early voting reminder and polling location link." },
  { day: "Jun 12", phase: "Close",      channel: "CTV",     action: "Final CTV push: closing-argument spot. 'On June 16, Oklahoma chooses its next AG. Choose the fifth-generation Oklahoman who has spent 12 years fighting for you.' Max frequency." },
  { day: "Jun 13", phase: "Close",      channel: "Digital", action: "Surge digital spend 40%. Retarget every voter who visited jonechols.com more than once. Serve 'Polls Close at 7PM' urgency creative." },
  { day: "Jun 14", phase: "Close",      channel: "Social",  action: "Final Facebook/Instagram push. 'Two days left.' GOTV creative. Remind early voters. Boost to all matched voter segments simultaneously." },
  { day: "Jun 15", phase: "GOTV",       channel: "All",     action: "Full GOTV day. Email: 'Tomorrow is Election Day.' CTV: 'Vote Tomorrow.' Digital: polling location finder ads. Social: shareable 'I'm voting for Jon Echols' graphic." },
  { day: "Jun 16", phase: "GOTV",       channel: "All",     action: "Election Day. Morning digital surge 6AM–9AM. Midday reminder 11AM–1PM. Final push 4PM–6:30PM. All channels on maximum frequency. Polls close 7PM CT." },
];
const PHASE_COLORS: Record<string, string> = { Launch: "#6366f1", Build: "#0ea5e9", Accelerate: "#10b981", Close: "#f59e0b", GOTV: "#ef4444" };

function TabActionPlan({ mobile, C }: { mobile: boolean; C: C }) {
  const [filter, setFilter] = useState("All");
  const phases = ["All", "Launch", "Build", "Accelerate", "Close", "GOTV"];
  const filtered = filter === "All" ? ECHOLS_ACTION_PLAN : ECHOLS_ACTION_PLAN.filter(a => a.phase === filter);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ background: `${C.accent}10`, border: `1px solid ${C.accent2}30`, borderRadius: 12, padding: "14px 18px" }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: C.white, marginBottom: 4 }}>14-Day Sprint to Election Day</div>
        <div style={{ fontSize: 12, color: C.white, lineHeight: 1.6 }}>
          June 2 through June 16. Every channel activated in sequence. Exact Audience voter targeting runs across all channels simultaneously — the same identified voter sees Echols on CTV, Facebook, Google, and email in a coordinated 14-day push.
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const }}>
        {phases.map(p => (
          <button key={p} onClick={() => setFilter(p)} style={{
            background: filter === p ? (PHASE_COLORS[p] ?? C.accent2) : C.card,
            border: `1px solid ${filter === p ? (PHASE_COLORS[p] ?? C.accent2) : C.border}`,
            color: filter === p ? "#fff" : C.muted,
            borderRadius: 20, padding: "5px 14px", fontSize: 11, fontWeight: 600, cursor: "pointer",
          }}>{p}</button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.map(item => (
          <div key={`${item.day}-${item.channel}-${item.phase}`} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 16px", display: "flex", gap: 12, alignItems: "flex-start" }}>
            <div style={{ flexShrink: 0, minWidth: 52 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: C.white }}>{item.day}</div>
              <div style={{ fontSize: 9, color: PHASE_COLORS[item.phase] ?? C.accent2, fontWeight: 700, textTransform: "uppercase" as const, marginTop: 2 }}>{item.phase}</div>
            </div>
            <div style={{ width: 1, background: C.border, alignSelf: "stretch", flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.accent2, textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 4 }}>{item.channel}</div>
              <div style={{ fontSize: 12, color: C.white, lineHeight: 1.5 }}>{item.action}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── TAB: Opposition Research ──────────────────────────────────────────────────
function TabOppositionResearch({ mobile, C }: { mobile: boolean; C: C }) {
  const severityColor = (s: string) => s === "high" ? "#ef4444" : s === "medium" ? C.gold : C.muted;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, #ef444418 0%, ${C.accent}10 100%)`, border: "1px solid #ef444440", borderRadius: 12, padding: "16px 20px" }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: C.white, marginBottom: 6 }}>Opposition Research — Jeff Starling</div>
        <div style={{ fontSize: 12, color: C.white, lineHeight: 1.6 }}>
          These are the documented, sourced vulnerabilities in Jeff Starling's record. Each point is backed by news coverage, debate transcripts, or public records. Exact Audience can deliver targeted contrast messaging on each of these issues to the exact voters most likely to be moved by them.
        </div>
      </div>

      {/* Featured: Dark Money Ad Controversy */}
      <div style={{ background: `linear-gradient(135deg, #ef444420 0%, #b91c1c10 100%)`, border: "2px solid #ef444460", borderRadius: 14, padding: mobile ? 16 : 24 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#ef4444", textTransform: "uppercase" as const, letterSpacing: "0.14em", marginBottom: 8 }}>Featured — Highest Impact Vulnerability</div>
        <div style={{ fontSize: mobile ? 16 : 20, fontWeight: 900, color: C.white, lineHeight: 1.3, marginBottom: 12 }}>
          Starling's PAC Exploited a Brain-Damaged Accident Victim for Political Gain
        </div>
        <div style={{ fontSize: 13, color: C.white, lineHeight: 1.7, marginBottom: 16 }}>
          A dark money PAC aligned with Jeff Starling ran political attack ads featuring <strong style={{ color: "#ef4444" }}>Micaela Borrego</strong> — a 23-year-old woman who nearly died in a drunk-driving crash and suffered permanent brain damage. Her attorney, <strong style={{ color: C.white }}>Noble McIntyre</strong>, publicly called it <em>"a disgusting attempt to exploit human tragedy for political gain."</em>
        </div>
        <div style={{ background: `#ef444415`, border: "1px solid #ef444430", borderRadius: 10, padding: "14px 16px", marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#ef4444", marginBottom: 6 }}>The Timeline</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { date: "May 22, 2026", event: "Starling PAC releases ad featuring Borrego's accident without family consent" },
              { date: "May 23, 2026", event: "Noble McIntyre (Borrego's attorney) publicly demands ad be removed" },
              { date: "May 23–26, 2026", event: "Starling has four days to denounce the ad — refuses to comment" },
              { date: "May 26, 2026", event: "KFOR News covers the story: 'Attorney calls for political attack ad referencing Sara Polston, Micaela Borrego to be removed'" },
              { date: "May 26, 2026", event: "Echols campaign highlights Starling's silence as disqualifying" },
            ].map(t => (
              <div key={t.date} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#ef4444", flexShrink: 0, minWidth: 90 }}>{t.date}</div>
                <div style={{ fontSize: 11, color: C.white, lineHeight: 1.4 }}>{t.event}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 10 }}>
          <div style={{ background: C.bg3, borderRadius: 8, padding: "10px 14px" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, marginBottom: 4 }}>Source</div>
            <div style={{ fontSize: 11, color: C.white }}>KFOR News, May 26, 2026</div>
          </div>
          <div style={{ background: C.bg3, borderRadius: 8, padding: "10px 14px" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, marginBottom: 4 }}>EA Strategy</div>
            <div style={{ fontSize: 11, color: C.white }}>Target 45–65 female voters in OKC + Tulsa with contrast creative on this issue — highest persuasion potential</div>
          </div>
        </div>
      </div>

      {/* All Opposition Points */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {ECHOLS_OPPOSITION_POINTS.map((pt: any) => (
          <Card key={pt.category} C={C}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8, gap: 12 }}>
              <div>
                <div style={{ fontSize: 9, fontWeight: 700, color: C.muted, textTransform: "uppercase" as const, letterSpacing: "0.1em", marginBottom: 4 }}>{pt.category}</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: C.white, lineHeight: 1.3 }}>{pt.headline}</div>
              </div>
              <div style={{ fontSize: 9, fontWeight: 700, color: severityColor(pt.severity), background: `${severityColor(pt.severity)}15`, border: `1px solid ${severityColor(pt.severity)}30`, borderRadius: 8, padding: "3px 10px", flexShrink: 0, textTransform: "uppercase" as const }}>
                {pt.severity} impact
              </div>
            </div>
            <div style={{ fontSize: 12, color: C.white, lineHeight: 1.6, marginBottom: 8 }}>{pt.detail}</div>
            <div style={{ fontSize: 10, color: C.muted, fontStyle: "italic" as const }}>Source: {pt.source}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ── TAB: Counter-Strategy ────────────────────────────────────────────────────
function TabCounterStrategy({ mobile, C }: { mobile: boolean; C: C }) {
  const [animIn, setAnimIn] = useState(false);
  useEffect(() => { const t = setTimeout(() => setAnimIn(true), 80); return () => clearTimeout(t); }, []);

  const threatItems = [
    { label: "Super PAC Budget", value: "$5,000,000", note: "Jeff Starling aligned PAC", color: "#ef4444" },
    { label: "Attack Ad Spend (Est.)", value: "$3,200,000", note: "TV, digital, mail combined", color: "#f97316" },
    { label: "Negative TV Spots", value: "14 Markets", note: "OKC, Tulsa + 12 cable markets", color: "#f59e0b" },
    { label: "Days Remaining", value: "14", note: "Until June 16 Primary", color: "#ef4444" },
  ];

  const counterMoves = [
    {
      priority: "IMMEDIATE",
      color: "#ef4444",
      title: "Same-Screen Counter-Messaging",
      description: "When Starling's PAC runs a CTV spot, Echols' Exact Audience ads run on the same streaming services — same household, same device — within 24 hours. The voter sees the attack, then sees the counter immediately.",
      channels: ["Hulu", "Peacock", "Paramount+", "Sling", "Fubo"],
      metric: "43,799 undecided voters targeted by name",
    },
    {
      priority: "HIGH",
      color: "#f97316",
      title: "Exploit the Borrego Ad Backlash",
      description: "Starling's PAC ran an ad exploiting brain-damaged accident victim Micaela Borrego without family consent. Her attorney publicly condemned it. Exact Audience serves contrast ads to voters who searched Starling's name or the controversy — reaching persuadables already questioning him.",
      channels: ["Meta", "Google Search", "YouTube", "CTV"],
      metric: "Target: 45–65 female voters, OKC + Tulsa",
    },
    {
      priority: "HIGH",
      color: "#f59e0b",
      title: "Base Protection — Retain Committed Voters",
      description: "Starling's PAC will try to suppress Echols' 32.5% committed base with doubt and confusion. Exact Audience retargets every identified Echols supporter with reinforcement messaging — keeping them committed and driving turnout on June 16.",
      channels: ["Email", "Meta", "CTV", "Google Display"],
      metric: "38,682 committed Echols voters reinforced",
    },
    {
      priority: "MEDIUM",
      color: C.accent2,
      title: "Surge the Undecided Universe",
      description: "The 43,799 undecided voters are the battlefield. Echols needs 20,829 of them. Exact Audience reaches all 43,799 by name, on every screen, with the right message — something a $5M TV buy cannot do with precision. Oklahoma and Tulsa counties alone hold 22,868 undecided voters.",
      channels: ["CTV", "Meta", "Google", "LinkedIn", "Email"],
      metric: "Need 20,829 of 43,799 undecided voters",
    },
    {
      priority: "MEDIUM",
      color: C.green,
      title: "Carpetbagger Contrast",
      description: "Starling moved to Oklahoma from Virginia and has no roots in the state. Echols is a 5th-generation Oklahoman, 12-year state legislator, and co-founder of Shelter Oklahoma Schools. This contrast resonates strongly with Republican primary voters who value authentic Oklahoma ties.",
      channels: ["Meta", "CTV", "Email"],
      metric: "Target: rural + suburban GOP primary voters",
    },
  ];

  const budgetRows = [
    { channel: "CTV / Streaming", allocation: "$42,000", pct: 45, note: "Counter Starling's TV buys on same screens" },
    { channel: "Meta (FB + IG)", allocation: "$18,600", pct: 20, note: "Borrego contrast + base reinforcement" },
    { channel: "Google Search", allocation: "$14,880", pct: 16, note: "Capture voters searching Starling controversy" },
    { channel: "Email", allocation: "$9,300", pct: 10, note: "Base turnout + committed voter reinforcement" },
    { channel: "Google Display", allocation: "$8,370", pct: 9, note: "Undecided voter retargeting" },
  ];

  const rapidResponse = [
    { day: "Jun 2",  action: "Launch CTV counter-campaign — all 8 counties simultaneously" },
    { day: "Jun 3",  action: "Deploy Borrego contrast ads on Meta + Google Search" },
    { day: "Jun 4",  action: "Email blast to identified Echols supporters — turnout messaging" },
    { day: "Jun 5",  action: "Surge undecided voter pool with 5-touch frequency cap" },
    { day: "Jun 7",  action: "Mid-sprint optimization — shift budget to highest-converting counties" },
    { day: "Jun 9",  action: "Carpetbagger contrast creative goes live on CTV + Meta" },
    { day: "Jun 11", action: "Final base reinforcement push — email + Meta retargeting" },
    { day: "Jun 13", action: "72-hour GOTV sprint begins — all channels at max frequency" },
    { day: "Jun 16", action: "Election Day — voter turnout suppression defense + GOTV final push" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, opacity: animIn ? 1 : 0, transform: animIn ? "translateY(0)" : "translateY(12px)", transition: "all 0.4s cubic-bezier(0.23,1,0.32,1)" }}>

      {/* Alert Banner */}
      <div style={{ background: "linear-gradient(135deg, #ef444420 0%, #b91c1c10 100%)", border: "2px solid #ef444460", borderRadius: 14, padding: mobile ? 16 : 24 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#ef4444", textTransform: "uppercase" as const, letterSpacing: "0.14em", marginBottom: 8 }}>Active Threat — Immediate Response Required</div>
        <div style={{ fontSize: mobile ? 18 : 24, fontWeight: 900, color: C.white, lineHeight: 1.3, marginBottom: 12 }}>
          Starling Super PAC Has $5M in Negative Ads Running Against Echols
        </div>
        <div style={{ fontSize: 13, color: C.white, lineHeight: 1.7 }}>
          A super PAC aligned with Jeff Starling is running $5 million in attack ads targeting Jon Echols across TV, digital, and mail. Exact Audience is the only tool that can counter this at the individual voter level — reaching every undecided voter by name, on the exact screen they are watching, with a counter-message within 24 hours of seeing the attack.
        </div>
      </div>

      {/* Threat KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 12 }}>
        {threatItems.map((t, i) => (
          <div key={t.label} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px 18px", borderTop: `3px solid ${t.color}`,
            opacity: animIn ? 1 : 0, transform: animIn ? "translateY(0)" : "translateY(16px)",
            transition: `all 0.4s cubic-bezier(0.23,1,0.32,1) ${i * 80}ms` }}>
            <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase" as const, letterSpacing: "0.1em", marginBottom: 6 }}>{t.label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: t.color, lineHeight: 1 }}>{t.value}</div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 6 }}>{t.note}</div>
          </div>
        ))}
      </div>

      {/* Counter Moves */}
      <SectionTitle C={C}>Exact Audience Counter-Strategy — 5 Moves</SectionTitle>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {counterMoves.map((move, i) => (
          <div key={move.title} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: mobile ? 16 : 20,
            opacity: animIn ? 1 : 0, transform: animIn ? "translateX(0)" : "translateX(-16px)",
            transition: `all 0.45s cubic-bezier(0.23,1,0.32,1) ${100 + i * 70}ms`,
            borderLeft: `4px solid ${move.color}` }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 10 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 9, fontWeight: 700, color: move.color, background: `${move.color}15`, border: `1px solid ${move.color}30`, borderRadius: 6, padding: "2px 8px", textTransform: "uppercase" as const, letterSpacing: "0.1em" }}>{move.priority}</span>
                </div>
                <div style={{ fontSize: 15, fontWeight: 800, color: C.white, lineHeight: 1.3 }}>{move.title}</div>
              </div>
            </div>
            <div style={{ fontSize: 12, color: C.white, lineHeight: 1.7, marginBottom: 12 }}>{move.description}</div>
            <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 6, marginBottom: 10 }}>
              {move.channels.map(ch => (
                <span key={ch} style={{ fontSize: 10, fontWeight: 600, color: C.accent2, background: `${C.accent2}15`, border: `1px solid ${C.accent2}30`, borderRadius: 6, padding: "3px 10px" }}>{ch}</span>
              ))}
            </div>
            <div style={{ fontSize: 11, color: move.color, fontWeight: 700 }}>{move.metric}</div>
          </div>
        ))}
      </div>

      {/* Budget Allocation */}
      <SectionTitle C={C}>Recommended Budget Allocation — Tier 3 ($93K)</SectionTitle>
      <Card C={C}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {budgetRows.map((row, i) => (
            <div key={row.channel} style={{ opacity: animIn ? 1 : 0, transition: `opacity 0.4s ease ${200 + i * 60}ms` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: C.white }}>{row.channel}</span>
                  <span style={{ fontSize: 10, color: C.muted }}>{row.note}</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 800, color: C.accent2 }}>{row.allocation}</span>
              </div>
              <div style={{ height: 6, background: C.bg3, borderRadius: 3, overflow: "hidden" }}>
                <div style={{ height: "100%", width: animIn ? `${row.pct}%` : "0%", background: `linear-gradient(90deg, ${C.accent} 0%, ${C.accent2} 100%)`, borderRadius: 3, transition: `width 0.8s cubic-bezier(0.23,1,0.32,1) ${300 + i * 80}ms` }} />
              </div>
            </div>
          ))}
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 12, marginTop: 4, display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: C.white }}>Total Campaign Budget</span>
            <span style={{ fontSize: 15, fontWeight: 900, color: C.green }}>$93,150</span>
          </div>
        </div>
      </Card>

      {/* Rapid Response Timeline */}
      <SectionTitle C={C}>14-Day Rapid Response Timeline</SectionTitle>
      <Card C={C}>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {rapidResponse.map((item, i) => (
            <div key={item.day} style={{ display: "flex", gap: 16, alignItems: "flex-start", padding: "10px 0",
              borderBottom: i < rapidResponse.length - 1 ? `1px solid ${C.border}` : "none",
              opacity: animIn ? 1 : 0, transition: `opacity 0.4s ease ${400 + i * 50}ms` }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: C.accent2, flexShrink: 0, minWidth: 52, paddingTop: 1 }}>{item.day}</div>
              <div style={{ width: 2, background: i === 0 ? C.accent2 : i === rapidResponse.length - 1 ? "#ef4444" : C.border, alignSelf: "stretch", flexShrink: 0, borderRadius: 1 }} />
              <div style={{ fontSize: 12, color: C.white, lineHeight: 1.5 }}>{item.action}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Why EA Wins This */}
      <div style={{ background: `linear-gradient(135deg, ${C.accent}18 0%, ${C.accent2}10 100%)`, border: `1px solid ${C.accent2}40`, borderRadius: 14, padding: mobile ? 16 : 24 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: C.white, marginBottom: 12 }}>Why Exact Audience Wins This Fight</div>
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 12 }}>
          {[
            { label: "$5M PAC Reach", value: "Broad — wastes 60–70% on non-voters", icon: "✗", color: "#ef4444" },
            { label: "Exact Audience Reach", value: "Precise — every dollar hits an identified undecided voter", icon: "✓", color: C.green },
            { label: "PAC Counter-Targeting", value: "Cannot reach the same voter who saw the attack ad", icon: "✗", color: "#ef4444" },
            { label: "EA Counter-Targeting", value: "Same household, same device, within 24 hours of attack ad", icon: "✓", color: C.green },
            { label: "PAC Voter ID", value: "Cannot identify who is persuadable vs. already committed", icon: "✗", color: "#ef4444" },
            { label: "EA Voter ID", value: "SiteID.ai identifies every visitor by name, address, device", icon: "✓", color: C.green },
          ].map(row => (
            <div key={row.label} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ fontSize: 14, fontWeight: 900, color: row.color, flexShrink: 0, marginTop: 1 }}>{row.icon}</span>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: row.color, marginBottom: 2 }}>{row.label}</div>
                <div style={{ fontSize: 11, color: C.white, lineHeight: 1.5 }}>{row.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────────────────────
const TABS = ["Overview", "Voter Universe", "What We Can Do", "CTV Universe", "15-Day Plan", "Counter-Strategy", "Opposition Research"];

export default function EcholsDashboard() {
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
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.accent2, flexShrink: 0 }} />
              <span style={{ fontSize: mobile ? 11 : 13, fontWeight: 700, color: C.white, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>Jon Echols — AG Race</span>
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
        {tab === 5 && <TabCounterStrategy mobile={mobile} C={C} />}
        {tab === 6 && <TabOppositionResearch mobile={mobile} C={C} />}
      </div>
    </div>
  );
}
