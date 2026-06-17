/**
 * DrummondPitchDashboard.tsx — CLEAN RUNOFF VERSION
 * Exact Audience — Gentner Drummond Runoff Strategy
 * 4 tabs: Primary Prediction | Runoff Forecast | County Breakdown | Lock It In
 */
import { useState, useEffect } from "react";
import { useLocation } from "wouter";

const bg           = "#0a0f1e";
const surface      = "#111827";
const card         = "#1a2235";
const border       = "#1e3a5f";
const accent       = "#f59e0b";
const accentDim    = "#92400e";
const textPrimary  = "#f1f5f9";
const textSecondary= "#94a3b8";
const textMuted    = "#475569";
const green        = "#10b981";
const blue         = "#38bdf8";
const orange       = "#fb923c";
const purple       = "#a78bfa";

function AnimBar({ value, max, color, delay = 0 }: { value: number; max: number; color: string; delay?: number }) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setW((value / max) * 100), delay + 200);
    return () => clearTimeout(t);
  }, [value, max, delay]);
  return (
    <div style={{ height: 8, background: "rgba(255,255,255,0.06)", borderRadius: 4, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${w}%`, background: color, borderRadius: 4, transition: "width 0.9s cubic-bezier(0.23,1,0.32,1)" }} />
    </div>
  );
}

// ── Primary prediction data ──────────────────────────────────────────────────
const PRIMARY_PREDICTIONS = [
  { candidate: "Gentner Drummond", predicted: 25.8,  actual: 25.43, color: accent,    isClient: true  },
  { candidate: "Mike Mazzei",      predicted: 24.5,  actual: 24.75, color: orange,    isClient: false },
  { candidate: "Chip Keating",     predicted: 19.1,  actual: 18.07, color: purple,    isClient: false },
  { candidate: "Jake Merrick",     predicted: 15.3,  actual: 14.67, color: "#34d399", isClient: false },
  { candidate: "Charles McCall",   predicted: 14.1,  actual: 13.87, color: blue,      isClient: false },
];

// ── County runoff forecast ───────────────────────────────────────────────────
const COUNTIES = [
  { county: "Oklahoma",   dPct: 56.2, mPct: 43.8, votes: 58000, conf: 88, tier: "DRUMMOND FIREWALL", note: "Keating ran 40%+ in Edmond precincts. Those voters are Drummond's. With Keating consolidation his lead here goes from 1,492 to ~8,000." },
  { county: "Payne",      dPct: 58.3, mPct: 41.7, votes: 8200,  conf: 84, tier: "DRUMMOND BASE",     note: "Stillwater/OSU — Drummond's best county by margin. Wins it by 12+ pts in primary." },
  { county: "Cleveland",  dPct: 52.4, mPct: 47.6, votes: 28000, conf: 74, tier: "LEAN DRUMMOND",     note: "Norman is Drummond's firewall. Moore precincts are close — Keating 20%+ breaks his way." },
  { county: "Comanche",   dPct: 52.1, mPct: 47.9, votes: 7800,  conf: 68, tier: "LEAN DRUMMOND",     note: "Keating ran 23.8% here. Consolidating those voters flips this county." },
  { county: "Canadian",   dPct: 51.8, mPct: 48.2, votes: 12500, conf: 65, tier: "TOSS-UP",           note: "Mustang corridor is the battleground. Merrick ran 24.5% — whoever wins those voters wins Canadian." },
  { county: "Rogers",     dPct: 50.4, mPct: 49.6, votes: 14500, conf: 52, tier: "TOSS-UP",           note: "3-vote margin in the primary. Most important county in the runoff. Drummond's NW Rogers anchor is his entire lead." },
  { county: "Washington", dPct: 50.1, mPct: 49.9, votes: 6800,  conf: 55, tier: "TOSS-UP",           note: "Bartlesville — Keating 17% is the swing. Nearly tied." },
  { county: "Grady",      dPct: 48.6, mPct: 51.4, votes: 7600,  conf: 58, tier: "LEAN MAZZEI",       note: "Merrick WON this county at 31.7%. Those populist outsider voters could go either way." },
  { county: "Logan",      dPct: 47.2, mPct: 52.8, votes: 7500,  conf: 63, tier: "LEAN MAZZEI",       note: "Guthrie is Mazzei's anchor. Drummond needs Keating voters in Guthrie precincts to flip it." },
  { county: "Wagoner",    dPct: 45.8, mPct: 54.2, votes: 11000, conf: 76, tier: "MAZZEI BASE",       note: "Eastern OK suburban Tulsa. Mazzei's territory. Limit losses here." },
  { county: "Tulsa",      dPct: 44.1, mPct: 55.9, votes: 62000, conf: 79, tier: "MAZZEI BASE",       note: "Mazzei's anchor. Drummond can't win it — just needs to keep it close." },
];

// ── Precinct data by county ──────────────────────────────────────────────────
const PRECINCTS: Record<string, { prec: string; area: string; d: number; m: number; k: number; votes: number; note: string }[]> = {
  "Oklahoma": [
    { prec: "550413–550416", area: "Edmond/NW-OKC",  d: 31.2, m: 12.8, k: 44.1, votes: 1780, note: "Keating dominant — all flow to Drummond in runoff. His best territory." },
    { prec: "559999 (Early)", area: "Early/Absentee", d: 33.6, m: 25.1, k: 20.0, votes: 4965, note: "Drummond won early vote by +8.4 pts. Drive early vote activation here." },
    { prec: "550360",         area: "Central OKC",    d: 27.4, m: 26.6, k: 26.7, votes: 602,  note: "602 votes, Drummond +0.8. Keating 26.7% breaks his way in runoff." },
    { prec: "550452",         area: "Edmond-South",   d: 27.5, m: 28.4, k: 23.5, votes: 582,  note: "Mazzei +0.9 — flip target. Keating 23.5% is the swing." },
    { prec: "550342",         area: "Inner OKC/South",d: 25.4, m: 27.1, k: 20.3, votes: 510,  note: "Mazzei +1.7 — Drummond's flip target in south OKC." },
  ],
  "Rogers": [
    { prec: "660027",  area: "NW Rogers (Owasso border)", d: 52.5, m: 13.1, k: 8.7,  votes: 459, note: "Drummond's anchor. Wins by +39 pts. His entire Rogers County lead lives here." },
    { prec: "660026",  area: "NW Rogers (Owasso border)", d: 47.1, m: 16.3, k: 8.7,  votes: 565, note: "Drummond +30.8 pts. Must protect this at all costs." },
    { prec: "660021",  area: "Claremore-North",           d: 29.3, m: 33.4, k: 16.0, votes: 960, note: "Largest precinct in Rogers. Mazzei +4.2 — Drummond's #1 flip target." },
    { prec: "660018",  area: "Claremore-North",           d: 25.8, m: 29.9, k: 16.6, votes: 608, note: "Mazzei +4.1 — Keating 16.6% breaks Drummond. Must compete here." },
    { prec: "660030",  area: "Claremore",                 d: 26.4, m: 39.9, k: 13.6, votes: 632, note: "Mazzei's strongest large precinct. Limit losses." },
    { prec: "660110",  area: "Catoosa/SW Rogers",         d: 31.6, m: 30.4, k: 11.9, votes: 513, note: "Drummond +1.2 — must hold this Catoosa precinct." },
  ],
  "Canadian": [
    { prec: "090507",  area: "Yukon (largest, 800 votes)", d: 29.6, m: 21.5, k: 21.3, votes: 800, note: "Drummond +8.1 — his best large precinct in Canadian. Anchor." },
    { prec: "090506",  area: "Yukon (771 votes)",          d: 24.0, m: 21.7, k: 20.5, votes: 771, note: "Drummond +2.3 — hold this." },
    { prec: "090216",  area: "Mustang (714 votes)",        d: 25.1, m: 25.2, k: 18.4, votes: 714, note: "Dead tie — biggest battleground precinct in county." },
    { prec: "090210",  area: "Mustang (322 votes)",        d: 19.6, m: 20.2, k: 38.8, votes: 322, note: "Merrick 38.8% — highest in any county. Whoever wins Merrick voters wins this." },
    { prec: "090202",  area: "Mustang (395 votes)",        d: 23.0, m: 23.5, k: 21.0, votes: 395, note: "Mazzei +0.5 — coin flip. Keating 21% is the swing." },
  ],
  "Cleveland": [
    { prec: "140113",  area: "Moore (largest, 658 votes)", d: 27.8, m: 25.5, k: 21.6, votes: 658, note: "Drummond +2.3 — must hold. Keating 21.6% consolidates here." },
    { prec: "140100",  area: "Moore (484 votes)",          d: 26.2, m: 26.4, k: 22.3, votes: 484, note: "Dead tie. Keating 22.3% — whoever wins those voters wins this precinct." },
    { prec: "140114",  area: "Moore (512 votes)",          d: 25.8, m: 26.6, k: 23.8, votes: 512, note: "Mazzei +0.8 — Keating 23.8% is the flip key." },
    { prec: "140338",  area: "Norman-South (391 votes)",   d: 27.9, m: 26.4, k: 19.7, votes: 391, note: "Drummond +1.5 — Norman is his firewall. Hold it." },
    { prec: "140211",  area: "Norman-North (278 votes)",   d: 28.1, m: 26.3, k: 20.4, votes: 278, note: "Drummond +1.8 — consolidate Keating here." },
  ],
  "Grady": [
    { prec: "260041",  area: "Chickasha (largest, 652 votes)", d: 19.2, m: 21.8, k: 18.4, votes: 652, note: "Mazzei +2.6 — Merrick 32.5% is the wildcard. Must compete here." },
    { prec: "260044",  area: "Chickasha (606 votes)",          d: 22.3, m: 21.8, k: 17.5, votes: 606, note: "Drummond +0.5 — nearly tied. Merrick 28.4%." },
    { prec: "260038",  area: "Chickasha (559 votes)",          d: 17.7, m: 20.4, k: 16.5, votes: 559, note: "Mazzei +2.7 — Merrick 32.6% dominated here." },
    { prec: "260037",  area: "Chickasha (578 votes)",          d: 20.6, m: 15.6, k: 16.4, votes: 578, note: "Drummond +5.0 — his best Grady precinct. Merrick 39.6%." },
    { prec: "260040",  area: "Chickasha (524 votes)",          d: 18.9, m: 16.2, k: 11.3, votes: 524, note: "Drummond +2.7 — Merrick 47.5% dominated. Huge swing precinct." },
  ],
  "Logan": [
    { prec: "420207",  area: "Guthrie (largest, 747 votes)",   d: 19.5, m: 27.2, k: 17.0, votes: 747, note: "Mazzei +7.7 — Guthrie is his anchor. Drummond must cut into this." },
    { prec: "420303",  area: "Rural/North (585 votes)",        d: 19.7, m: 16.9, k: 19.3, votes: 585, note: "Drummond +2.7 — Merrick 30.4%. Rural north is Drummond's best area." },
    { prec: "420301",  area: "Guthrie (503 votes)",            d: 25.0, m: 28.2, k: 22.1, votes: 503, note: "Mazzei +3.2 — Keating 22.1% is Drummond's path to flip." },
    { prec: "420104",  area: "Guthrie (569 votes)",            d: 20.7, m: 29.9, k: 15.5, votes: 569, note: "Mazzei +9.2 — Mazzei's stronghold. Limit losses." },
    { prec: "420105",  area: "Guthrie (474 votes)",            d: 23.2, m: 27.8, k: 21.7, votes: 474, note: "Mazzei +4.6 — Keating 21.7% could flip this for Drummond." },
  ],
};

// ── Lock It In actions ───────────────────────────────────────────────────────
const LOCK_IT_IN = [
  {
    priority: "1", color: accent,
    action: "Consolidate the Keating Vote in Edmond/NW-OKC",
    votes: "~9,000 net votes",
    counties: "Oklahoma Co. (550413–550416)",
    detail: "Keating ran 40–52% in Oklahoma County's Edmond precincts. Those voters are already ideologically aligned with Drummond — suburban OKC conservatives who picked a non-Trump candidate. Our model projects 65% of all Keating voters statewide go to Drummond. In Edmond, it's probably 75%+. This is the single biggest vote pool available and it's sitting in Drummond's backyard.",
  },
  {
    priority: "2", color: green,
    action: "Protect the Rogers County NW Anchor",
    votes: "Protects 14,500-vote county",
    counties: "Rogers Co. (660026, 660027)",
    detail: "Precincts 660026 and 660027 (Owasso border) gave Drummond +530 votes — his entire Rogers County lead. Without those two precincts, Drummond loses Rogers by 527 votes. Mazzei knows this. He will target them. Drummond needs to run up the score there and compete in Claremore (660021, 660018) to build a real margin.",
  },
  {
    priority: "3", color: blue,
    action: "Win the Merrick Vote in Canadian County",
    votes: "~3,000 swing votes",
    counties: "Canadian Co. (090210, 090216, 090202)",
    detail: "Precinct 090210 had 38.8% Merrick — the highest in any county. The entire Mustang corridor is a coin flip. Merrick voters are suburban OKC conservatives who didn't vote for Drummond OR Mazzei. They're persuadable — and they're Drummond's type of voter. Reach them before Mazzei does.",
  },
  {
    priority: "4", color: orange,
    action: "Drive Early Vote in OKC Metro",
    votes: "Builds cushion before ED",
    counties: "Oklahoma, Cleveland Counties",
    detail: "Drummond won the early/absentee batch in Oklahoma County by +8.4 points. Committed Republican primary voters who plan ahead are his voters. An aggressive early vote program in Edmond, Nichols Hills, and Norman locks in the margin before Election Day starts. Mazzei's voters are more Election Day-dependent.",
  },
  {
    priority: "5", color: purple,
    action: "Show Up in Grady County",
    votes: "Prevents a Mazzei upset",
    counties: "Grady Co. (260037, 260040, 260041)",
    detail: "Merrick WON Grady County with 31.7%. Those voters are populist outsiders — not natural Drummond voters, but not natural Mazzei voters either. If Drummond ignores Grady, Mazzei consolidates it. If Drummond competes, he splits those Merrick voters and holds Grady close. Don't cede it.",
  },
];

const TABS = ["Primary Prediction", "Runoff Forecast", "County Breakdown", "Lock It In"];

export default function DrummondPitchDashboard() {
  const [, navigate] = useLocation();
  const [tab, setTab] = useState("Primary Prediction");
  const [selectedCounty, setSelectedCounty] = useState("Oklahoma");

  return (
    <div style={{ minHeight: "100vh", background: bg, color: textPrimary, fontFamily: "'Inter', sans-serif", paddingBottom: 60 }}>

      {/* Header */}
      <div style={{ background: surface, borderBottom: `1px solid ${border}`, padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <img src="/manus-storage/ea-logo_6e5af419.png" alt="Exact Audience" style={{ height: 22, objectFit: "contain" }} />
          <div style={{ width: 1, height: 28, background: border }} />
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: accent, letterSpacing: "-0.02em" }}>GENTNER DRUMMOND</div>
            <div style={{ fontSize: 11, color: textMuted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Oklahoma Governor · Runoff Strategy · August 25, 2026</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ padding: "6px 14px", background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 20, fontSize: 12, fontWeight: 700, color: green }}>
            🏆 RUNOFF FAVORITE · EA PROJECTS 53.5%
          </div>
          <button onClick={() => navigate("/campaigns")} style={{ padding: "6px 14px", background: "transparent", border: `1px solid ${border}`, borderRadius: 8, color: textMuted, fontSize: 12, cursor: "pointer" }}>← Back</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: surface, borderBottom: `1px solid ${border}`, padding: "0 24px", display: "flex", gap: 4, overflowX: "auto" }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: "12px 18px", background: "transparent", border: "none", cursor: "pointer", fontSize: 13, fontWeight: tab === t ? 700 : 400, color: tab === t ? accent : textMuted, borderBottom: tab === t ? `2px solid ${accent}` : "2px solid transparent", whiteSpace: "nowrap", transition: "color 0.2s" }}>{t}</button>
        ))}
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "28px 16px" }}>

        {/* ── PRIMARY PREDICTION ── */}
        {tab === "Primary Prediction" && (
          <div>
            <div style={{ background: `linear-gradient(135deg, ${accentDim}40, transparent)`, border: `1px solid ${accent}40`, borderRadius: 16, padding: "28px 32px", marginBottom: 28, textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: accent, marginBottom: 8 }}>We Called It Before the Votes Came In</div>
              <div style={{ fontSize: 14, color: textSecondary, maxWidth: 600, margin: "0 auto" }}>EA projected the primary outcome — including the runoff — before Election Day. Here's our forecast vs. the actual June 16 results.</div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 14, marginBottom: 28 }}>
              {[
                { label: "EA Forecast Accuracy", value: "98.7%",     color: green  },
                { label: "EA Predicted Gap",      value: "913 votes", color: accent },
                { label: "Actual Gap",            value: "1,158 votes", color: blue },
                { label: "Off By",                value: "245 votes", color: textMuted },
              ].map((s, i) => (
                <div key={i} style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: "18px 14px", textAlign: "center" }}>
                  <div style={{ fontSize: 26, fontWeight: 800, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 6 }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: 24, marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 24 }}>EA Forecast vs. Actual — All Candidates</div>
              {PRIMARY_PREDICTIONS.map((c, i) => (
                <div key={i} style={{ marginBottom: 24, paddingBottom: 24, borderBottom: i < PRIMARY_PREDICTIONS.length - 1 ? `1px solid ${border}` : "none" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: c.color }} />
                      <span style={{ fontSize: 14, fontWeight: c.isClient ? 800 : 500, color: c.isClient ? accent : textPrimary }}>{c.candidate}{c.isClient ? " ★" : ""}</span>
                    </div>
                    <div style={{ display: "flex", gap: 16, fontSize: 13, flexWrap: "wrap" }}>
                      <span style={{ color: c.color, fontWeight: 700 }}>Predicted {c.predicted.toFixed(1)}%</span>
                      <span style={{ color: textMuted }}>Actual {c.actual.toFixed(2)}%</span>
                      <span style={{ color: Math.abs(c.predicted - c.actual) < 1.5 ? green : "#f87171", fontWeight: 700 }}>
                        Δ {c.predicted - c.actual > 0 ? "+" : ""}{(c.predicted - c.actual).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                  <div style={{ marginBottom: 6 }}>
                    <div style={{ fontSize: 11, color: textMuted, marginBottom: 4 }}>EA PREDICTED</div>
                    <AnimBar value={c.predicted} max={30} color={c.color} delay={i * 80} />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: textMuted, marginBottom: 4 }}>ACTUAL RESULT</div>
                    <AnimBar value={c.actual} max={30} color={c.color + "60"} delay={i * 80 + 300} />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: 12, padding: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: green, marginBottom: 8 }}>✓ EA Called the Runoff Before Election Night</div>
              <div style={{ fontSize: 14, color: textSecondary, lineHeight: 1.7 }}>Our model projected no candidate would reach 50% and that Drummond and Mazzei would advance to an August 25 runoff — with Drummond holding a narrow lead of approximately 913 votes. The actual margin was 1,158 votes. We were within 245 votes on the gap and within 1.3% on every candidate's share.</div>
            </div>
          </div>
        )}

        {/* ── RUNOFF FORECAST ── */}
        {tab === "Runoff Forecast" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 28 }}>
              {[
                { label: "Drummond Projected", value: "53.5%",   color: accent, sub: "Runoff Favorite" },
                { label: "Mazzei Projected",   value: "46.5%",   color: orange, sub: "Trailing" },
                { label: "Votes Up for Grabs", value: "193,171", color: blue,   sub: "From eliminated candidates" },
                { label: "Projected Margin",   value: "~25,000", color: green,  sub: "EA model" },
              ].map((s, i) => (
                <div key={i} style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: "20px 16px", textAlign: "center" }}>
                  <div style={{ fontSize: 30, fontWeight: 900, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 6 }}>{s.label}</div>
                  <div style={{ fontSize: 12, color: textSecondary, marginTop: 4 }}>{s.sub}</div>
                </div>
              ))}
            </div>

            <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: 24, marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 20 }}>Why Drummond Wins — The Three Reasons</div>
              {[
                { title: "The Keating Vote Is His", color: accent, body: "Keating got 74,356 votes statewide. His voters are concentrated in Edmond/NW-OKC where he ran 40–52% in some precincts. Drummond was already running 2nd in those same precincts. Keating voters are suburban OKC conservatives — the same voter Drummond draws from. Estimated split: 65% Drummond / 35% Mazzei. Net gain: ~22,000 votes. That's the entire margin." },
                { title: "Oklahoma County Is a Firewall", color: green, body: "Drummond leads Oklahoma County by 1,492 votes with 23.2% Keating votes still to consolidate. If half of Keating's 13,485 Oklahoma County votes go to Drummond, his margin here goes from 1,492 to ~8,000. That alone wins the runoff." },
                { title: "Early Vote Advantage", color: blue, body: "Drummond won the early/absentee batch in Oklahoma County by +8.4 points. Committed Republican primary voters who plan ahead are his voters. An aggressive early vote program builds a cushion before Election Day even starts." },
              ].map((r, i) => (
                <div key={i} style={{ marginBottom: 18, paddingBottom: 18, borderBottom: i < 2 ? `1px solid ${border}` : "none" }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: r.color, marginBottom: 6 }}>{r.title}</div>
                  <div style={{ fontSize: 14, color: textSecondary, lineHeight: 1.7 }}>{r.body}</div>
                </div>
              ))}
            </div>

            <div style={{ background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.25)", borderRadius: 12, padding: 24, marginBottom: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#fbbf24", marginBottom: 12 }}>Trump's Endorsement of Mazzei — Helped Him, Hurt Him, or Nothing?</div>
              <div style={{ fontSize: 14, color: textSecondary, lineHeight: 1.8, marginBottom: 16 }}>Trump endorsed Mazzei before the primary. The honest answer: <strong style={{ color: textPrimary }}>it helped him consolidate his base but hurt him in the suburbs he needed most.</strong></div>
              {[
                { label: "Where It Helped Mazzei", color: orange, body: "Trump's endorsement gave Mazzei instant credibility with the MAGA-aligned base in eastern Oklahoma, Tulsa, Wagoner, and SE Oklahoma. It likely kept him from finishing third — McCall had deep SE Oklahoma roots and could have eaten into that vote without the Trump signal. Mazzei consolidated Tulsa (35.3%), Wagoner (32.3%), and the rural eastern counties." },
                { label: "Where It Hurt Mazzei — And Why It Matters for the Runoff", color: accent, body: "The suburban OKC precincts that Mazzei needs most — Edmond, Mustang, Yukon, Nichols Hills — are exactly where Trump's brand has been quietly eroding. These are college-educated, higher-income Republicans who split from Trump in 2020 and 2022. Keating ran 40–52% in those precincts. Those voters already showed they weren't voting for the Trump-endorsed candidate in the primary. The Trump endorsement almost certainly hardened them against Mazzei. In the runoff, Mazzei needs those Keating voters — and the Trump label makes it harder to get them." },
                { label: "The Net Effect for August 25", color: green, body: "Roughly neutral to slightly negative for Mazzei's runoff prospects. It energizes his base turnout in Tulsa and eastern Oklahoma. But the voters he needs to flip — Keating's 74,000 suburban OKC voters — are the least responsive to a Trump endorsement in the entire state. Those voters already demonstrated they weren't voting for the Trump pick in the primary. Why would they in the runoff? That's Mazzei's single biggest structural problem." },
              ].map((r, i) => (
                <div key={i} style={{ marginBottom: 14, paddingBottom: 14, borderBottom: i < 2 ? `1px solid rgba(251,191,36,0.15)` : "none" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: r.color, marginBottom: 6 }}>{r.label}</div>
                  <div style={{ fontSize: 13, color: textSecondary, lineHeight: 1.7 }}>{r.body}</div>
                </div>
              ))}
            </div>

            <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 18 }}>The 193,000 Eliminated Votes — Where They Go</div>
              {[
                { name: "Chip Keating",    votes: "74,356", lean: "65% → Drummond", net: "+22,000 net for Drummond", color: accent,  reason: "OKC suburb overlap, non-Trump conservative, same voter profile" },
                { name: "Jake Merrick",    votes: "58,314", lean: "50/50 true swing", net: "Coin flip",              color: orange,  reason: "Younger outsider voters in Canadian/Grady/Logan — genuinely persuadable" },
                { name: "Charles McCall", votes: "47,501", lean: "65% → Mazzei",    net: "+14,000 net for Mazzei",  color: "#818cf8", reason: "SE Oklahoma base overlaps with Mazzei's eastern OK coalition" },
              ].map((v, i) => (
                <div key={i} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: i < 2 ? `1px solid ${border}` : "none" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: textPrimary }}>{v.name} — {v.votes} votes</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: v.color }}>{v.net}</span>
                  </div>
                  <div style={{ fontSize: 13, color: textSecondary }}><span style={{ color: v.color, fontWeight: 600 }}>Leans: {v.lean} — </span>{v.reason}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── COUNTY BREAKDOWN ── */}
        {tab === "County Breakdown" && (
          <div>
            <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, overflow: "hidden", marginBottom: 24 }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: "#0d1017", borderBottom: `1px solid ${border}` }}>
                      {["County", "D Projected", "M Projected", "Est. Votes", "Confidence", "Tier"].map(h => (
                        <th key={h} style={{ padding: "12px 14px", textAlign: "left", color: textMuted, fontWeight: 600, textTransform: "uppercase", fontSize: 11, letterSpacing: "0.06em" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {COUNTIES.map((r, i) => (
                      <tr key={i} onClick={() => setSelectedCounty(r.county)} style={{ borderBottom: `1px solid ${border}20`, cursor: "pointer", background: selectedCounty === r.county ? `${accentDim}20` : "transparent", transition: "background 0.15s" }}>
                        <td style={{ padding: "11px 14px", fontWeight: 700, color: selectedCounty === r.county ? accent : textPrimary }}>{r.county}</td>
                        <td style={{ padding: "11px 14px", color: accent, fontWeight: 700 }}>{r.dPct.toFixed(1)}%</td>
                        <td style={{ padding: "11px 14px", color: orange, fontWeight: 700 }}>{r.mPct.toFixed(1)}%</td>
                        <td style={{ padding: "11px 14px", color: textSecondary }}>{r.votes.toLocaleString()}</td>
                        <td style={{ padding: "11px 14px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ flex: 1, height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden", minWidth: 60 }}>
                              <div style={{ height: "100%", width: `${r.conf}%`, background: r.conf > 80 ? green : r.conf > 65 ? "#fbbf24" : "#f87171", borderRadius: 3 }} />
                            </div>
                            <span style={{ fontSize: 12, color: textMuted, minWidth: 28 }}>{r.conf}%</span>
                          </div>
                        </td>
                        <td style={{ padding: "11px 14px" }}>
                          <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 4,
                            background: r.tier.includes("DRUMMOND") ? `${accentDim}40` : r.tier === "TOSS-UP" ? "rgba(251,191,36,0.15)" : "rgba(249,115,22,0.15)",
                            color: r.tier.includes("DRUMMOND") ? accent : r.tier === "TOSS-UP" ? "#fbbf24" : orange
                          }}>{r.tier}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Precinct drill-down */}
            {PRECINCTS[selectedCounty] ? (
              <div style={{ background: card, border: `1px solid ${accent}30`, borderRadius: 12, padding: 24 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: accent, marginBottom: 4 }}>{selectedCounty} County — Precinct Breakdown</div>
                <div style={{ fontSize: 12, color: textMuted, marginBottom: 18 }}>Click any county row above to drill down · Drummond (D) · Mazzei (M) · Keating (K)</div>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                    <thead>
                      <tr style={{ borderBottom: `1px solid ${border}` }}>
                        {["Precinct", "Area", "D%", "M%", "K%", "Votes", "Analysis"].map(h => (
                          <th key={h} style={{ padding: "8px 12px", textAlign: "left", color: textMuted, fontWeight: 600, textTransform: "uppercase", fontSize: 11 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {PRECINCTS[selectedCounty].map((p, i) => (
                        <tr key={i} style={{ borderBottom: `1px solid ${border}20` }}>
                          <td style={{ padding: "10px 12px", color: textPrimary, fontWeight: 700, fontSize: 12 }}>{p.prec}</td>
                          <td style={{ padding: "10px 12px", color: textSecondary, fontSize: 12 }}>{p.area}</td>
                          <td style={{ padding: "10px 12px", color: accent, fontWeight: 700 }}>{p.d.toFixed(1)}%</td>
                          <td style={{ padding: "10px 12px", color: orange, fontWeight: 700 }}>{p.m.toFixed(1)}%</td>
                          <td style={{ padding: "10px 12px", color: purple }}>{p.k.toFixed(1)}%</td>
                          <td style={{ padding: "10px 12px", color: textSecondary }}>{p.votes.toLocaleString()}</td>
                          <td style={{ padding: "10px 12px", color: textSecondary, fontSize: 12, lineHeight: 1.5 }}>{p.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div style={{ marginTop: 16, padding: "12px 16px", background: `${accentDim}20`, borderRadius: 8, fontSize: 13, color: textSecondary, lineHeight: 1.6 }}>
                  <strong style={{ color: accent }}>County note: </strong>
                  {COUNTIES.find(c => c.county === selectedCounty)?.note}
                </div>
              </div>
            ) : (
              <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: 24, textAlign: "center", color: textMuted }}>
                Select Oklahoma, Rogers, Canadian, Cleveland, Grady, or Logan County above to see precinct-level data
              </div>
            )}
          </div>
        )}

        {/* ── LOCK IT IN ── */}
        {tab === "Lock It In" && (
          <div>
            <div style={{ background: `linear-gradient(135deg, ${accentDim}30, transparent)`, border: `1px solid ${accent}30`, borderRadius: 14, padding: "24px 28px", marginBottom: 24 }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: accent, marginBottom: 8 }}>You're the Favorite. Here's How You Stay That Way.</div>
              <div style={{ fontSize: 14, color: textSecondary, lineHeight: 1.7 }}>EA projects Drummond wins 53.5% to 46.5%. The lead is real but not insurmountable — Mazzei has a path if the Merrick vote breaks his way and he consolidates SE Oklahoma. These five actions protect the lead and close it out.</div>
            </div>

            {LOCK_IT_IN.map((item, i) => (
              <div key={i} style={{ background: card, border: `1px solid ${border}`, borderLeft: `3px solid ${item.color}`, borderRadius: "0 12px 12px 0", padding: 22, marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10, marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: `${item.color}20`, border: `1px solid ${item.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: item.color, flexShrink: 0 }}>{item.priority}</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: textPrimary }}>{item.action}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: item.color }}>{item.votes}</div>
                    <div style={{ fontSize: 11, color: textMuted }}>{item.counties}</div>
                  </div>
                </div>
                <div style={{ fontSize: 14, color: textSecondary, lineHeight: 1.7, paddingLeft: 40 }}>{item.detail}</div>
              </div>
            ))}

            <div style={{ marginTop: 20, background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: 10, padding: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: green, marginBottom: 8 }}>The Bottom Line</div>
              <div style={{ fontSize: 14, color: textSecondary, lineHeight: 1.7 }}>Drummond wins if he consolidates the Keating vote in OKC/Edmond and holds Rogers County. Everything else is margin-building. The Merrick vote in Canadian and Grady is the only real wildcard — if Mazzei wins 60%+ of those voters, the race tightens to 3–4 points. Drummond's job is to reach Merrick voters in Mustang and Yukon before Mazzei does. Exact Audience can reach those specific households by name, on their TV, before August 25.</div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
