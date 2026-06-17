/**
 * DrummondPitchDashboard.tsx — RUNOFF VERSION
 * Exact Audience — Gentner Drummond Runoff Strategy Dashboard
 * August 25, 2026 Oklahoma Governor Runoff
 */
import { useState, useEffect } from "react";
import { useLocation } from "wouter";

const bg = "#0a0f1e";
const surface = "#111827";
const card = "#1a2235";
const border = "#1e3a5f";
const accent = "#f59e0b";
const accentDim = "#92400e";
const textPrimary = "#f1f5f9";
const textSecondary = "#94a3b8";
const textMuted = "#475569";
const green = "#10b981";
const blue = "#38bdf8";
const purple = "#a78bfa";

const COUNTY_DATA = [
  { county: "Oklahoma",   d: 27.4, m: 24.8, margin: +2.6, votes: 58146, keating: 23.2, merrick: 12.6, mccall: 8.8,  runoffEdge: "STRONG D", note: "Edmond/NW-OKC: Keating 40%+ flows to Drummond" },
  { county: "Cleveland",  d: 26.8, m: 25.5, margin: +1.3, votes: 27161, keating: 20.1, merrick: 14.2, mccall: 9.1,  runoffEdge: "LEAN D",   note: "Norman firewall; Keating 20% breaks Drummond" },
  { county: "Canadian",   d: 23.8, m: 22.0, margin: +1.8, votes: 19080, keating: 20.0, merrick: 24.5, mccall: 8.5,  runoffEdge: "LEAN D",   note: "Mustang corridor: Merrick 24.5% is the swing" },
  { county: "Rogers",     d: 30.0, m: 30.0, margin:  0.0, votes: 14245, keating: 13.1, merrick: 14.0, mccall: 10.1, runoffEdge: "TOSS-UP",  note: "3-vote tie. NW Rogers anchor is Drummond" },
  { county: "Payne",      d: 35.1, m: 23.1, margin:+12.0, votes:  7935, keating: 16.8, merrick: 12.3, mccall:  7.2, runoffEdge: "STRONG D", note: "Stillwater/OSU — Drummond's best county" },
  { county: "Grady",      d: 19.5, m: 18.3, margin: +1.1, votes:  7935, keating: 18.3, merrick: 31.7, mccall:  9.8, runoffEdge: "TOSS-UP",  note: "Merrick WON this county at 31.7% — wildcard" },
  { county: "Logan",      d: 22.1, m: 26.0, margin: -3.9, votes:  7494, keating: 19.3, merrick: 22.4, mccall: 10.6, runoffEdge: "LEAN M",   note: "Guthrie Keating vote could flip it for D" },
  { county: "Washington", d: 24.8, m: 25.1, margin: -0.3, votes:  6782, keating: 17.0, merrick: 13.2, mccall:  8.9, runoffEdge: "TOSS-UP",  note: "Bartlesville — Keating 17% breaks Drummond" },
  { county: "Tulsa",      d: 32.8, m: 35.3, margin: -2.4, votes: 58126, keating: 11.2, merrick: 10.8, mccall:  7.3, runoffEdge: "LEAN M",   note: "Mazzei anchor — must limit losses here" },
  { county: "Wagoner",    d: 29.9, m: 32.3, margin: -2.4, votes: 10782, keating: 12.1, merrick: 11.8, mccall:  8.2, runoffEdge: "LEAN M",   note: "Suburban Tulsa — Mazzei base" },
];

const STRONGHOLD_PRECINCTS = [
  { prec: "550414", county: "Oklahoma Co.", area: "Edmond/NW-OKC", d: 33.4, m: 10.0, k: 51.7, votes: 449 },
  { prec: "550422", county: "Oklahoma Co.", area: "Edmond/NW-OKC", d: 34.7, m: 14.5, k: 38.5, votes: 421 },
  { prec: "550528", county: "Oklahoma Co.", area: "Bethany/Outer",  d: 37.4, m: 11.9, k: 37.0, votes: 235 },
  { prec: "660026", county: "Rogers Co.",   area: "NW Rogers",      d: 47.1, m: 16.3, k: 8.7,  votes: 565 },
  { prec: "660027", county: "Rogers Co.",   area: "NW Rogers",      d: 52.5, m: 13.1, k: 8.7,  votes: 459 },
  { prec: "550371", county: "Oklahoma Co.", area: "Central OKC",    d: 38.7, m: 19.7, k: 16.8, votes: 375 },
];

const SWING_PRECINCTS = [
  { prec: "550360", county: "Oklahoma Co.", area: "Central OKC",  d: 27.9, m: 27.1, k: 26.7, votes: 602 },
  { prec: "550358", county: "Oklahoma Co.", area: "Central OKC",  d: 27.0, m: 26.5, k: 21.8, votes: 588 },
  { prec: "550452", county: "Oklahoma Co.", area: "Edmond-South", d: 27.5, m: 28.4, k: 23.5, votes: 582 },
  { prec: "660021", county: "Rogers Co.",   area: "Claremore-N",  d: 29.3, m: 33.4, k: 16.0, votes: 960 },
  { prec: "660018", county: "Rogers Co.",   area: "Claremore-N",  d: 25.8, m: 29.9, k: 16.6, votes: 608 },
  { prec: "090216", county: "Canadian Co.", area: "Mustang",      d: 25.1, m: 25.2, k: 18.4, votes: 714 },
];

const WIN_PATH = [
  { label: "Drummond Primary Base",        votes: 105787, pct: 50.3, color: accent },
  { label: "Absorb Keating Voters (65%)",  votes:  48332, pct: 23.0, color: green },
  { label: "Absorb McCall Voters (40%)",   votes:  19000, pct:  9.0, color: blue },
  { label: "Minor Candidate Voters (35%)", votes:   4550, pct:  2.2, color: purple },
  { label: "Projected Runoff Total",       votes: 177669, pct: 53.5, color: accent },
];

const MESSAGING = [
  { headline: "He's Already the Governor. Let Him Finish the Job.", subhead: "Drummond has been running Oklahoma for 4 years. Voters know his name. They know his record. The runoff is a referendum on whether they want to keep him.", audience: "Undecided Republicans statewide", channel: "CTV / OTT", priority: "HIGH" },
  { headline: "The Keating Voters Are Yours. Go Get Them.", subhead: "74,000 Keating voters live in Edmond, Mustang, Yukon, and Stillwater — the same neighborhoods Drummond already wins. These voters picked a non-Trump conservative. They're not going to Mazzei.", audience: "Keating precincts: 550413–550416, 090506–090507", channel: "Direct Mail + CTV", priority: "CRITICAL" },
  { headline: "Rogers County Is a 3-Vote Tie. Every Door Counts.", subhead: "Rogers County is literally tied. 14,245 votes. 3-vote margin. The Claremore precincts (660021, 660018, 660020) have 2,100 votes between them — all within 4 points. This is where the runoff is won.", audience: "Claremore & Catoosa voters", channel: "Doors + Digital", priority: "CRITICAL" },
  { headline: "Oklahoma County Is Your Firewall. Don't Let It Slip.", subhead: "Drummond leads Oklahoma County by 1,492 votes. With Keating consolidation, that becomes +8,000. Drive early vote turnout in OKC to bank that advantage before Election Day.", audience: "OKC metro Republicans", channel: "CTV + Early Vote Activation", priority: "HIGH" },
  { headline: "Grady County Is a Trap. Don't Ignore It.", subhead: "Merrick WON Grady County with 31.7%. Those voters are populist outsiders. Mazzei could steal them. Drummond needs a presence in Chickasha before Mazzei defines the narrative.", audience: "Grady County Republicans", channel: "Radio + Digital", priority: "MEDIUM" },
];

function AnimBar({ value, max, color, delay = 0 }: { value: number; max: number; color: string; delay?: number }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW((value / max) * 100), delay + 200); return () => clearTimeout(t); }, [value, max, delay]);
  return (
    <div style={{ height: 8, background: "rgba(255,255,255,0.06)", borderRadius: 4, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${w}%`, background: color, borderRadius: 4, transition: "width 0.9s cubic-bezier(0.23,1,0.32,1)" }} />
    </div>
  );
}

const TABS = ["Overview", "County Map", "Strongholds", "Win Path", "Messaging", "EA Strategy", "Primary Prediction", "Runoff Forecast"];

// EA Analyst Primary Predictions (within ~1.3% of actual, Drummond leads Mazzei by 913 votes)
const PRIMARY_PREDICTIONS = [
  { candidate: "Gentner Drummond", predicted: 25.8,  actual: 25.43, predictedVotes: 107240, actualVotes: 105787, color: accent,    isClient: true },
  { candidate: "Mike Mazzei",      predicted: 24.5,  actual: 24.75, predictedVotes: 106327, actualVotes: 104629, color: "#f97316", isClient: false },
  { candidate: "Chip Keating",     predicted: 19.1,  actual: 18.07, predictedVotes: 79380,  actualVotes: 74356,  color: "#a78bfa", isClient: false },
  { candidate: "Jake Merrick",     predicted: 15.3,  actual: 14.67, predictedVotes: 63580,  actualVotes: 58314,  color: "#34d399", isClient: false },
  { candidate: "Charles McCall",   predicted: 14.1,  actual: 13.87, predictedVotes: 58610,  actualVotes: 47501,  color: "#60a5fa", isClient: false },
];

// Runoff county-level forecast
const RUNOFF_FORECAST = [
  { county: "Oklahoma",   dPred: 56.2, mPred: 43.8, votes: 58000, confidence: 88, tier: "DRUMMOND FIREWALL" },
  { county: "Cleveland",  dPred: 52.4, mPred: 47.6, votes: 28000, confidence: 74, tier: "LEAN DRUMMOND" },
  { county: "Canadian",   dPred: 51.8, mPred: 48.2, votes: 12500, confidence: 65, tier: "TOSS-UP" },
  { county: "Rogers",     dPred: 50.4, mPred: 49.6, votes: 14500, confidence: 52, tier: "TOSS-UP" },
  { county: "Payne",      dPred: 58.3, mPred: 41.7, votes: 8200,  confidence: 84, tier: "DRUMMOND BASE" },
  { county: "Comanche",   dPred: 52.1, mPred: 47.9, votes: 7800,  confidence: 68, tier: "LEAN DRUMMOND" },
  { county: "Grady",      dPred: 48.6, mPred: 51.4, votes: 7600,  confidence: 58, tier: "LEAN MAZZEI" },
  { county: "Logan",      dPred: 47.2, mPred: 52.8, votes: 7500,  confidence: 63, tier: "LEAN MAZZEI" },
  { county: "Tulsa",      dPred: 44.1, mPred: 55.9, votes: 62000, confidence: 79, tier: "MAZZEI BASE" },
  { county: "Wagoner",    dPred: 45.8, mPred: 54.2, votes: 11000, confidence: 76, tier: "MAZZEI BASE" },
];

export default function DrummondPitchDashboard() {
  const [, navigate] = useLocation();
  const [tab, setTab] = useState("Overview");

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
            🏆 RUNOFF FAVORITE · 53.5% PROJECTED
          </div>
          <button onClick={() => navigate("/campaigns")} style={{ padding: "6px 14px", background: "transparent", border: `1px solid ${border}`, borderRadius: 8, color: textMuted, fontSize: 12, cursor: "pointer" }}>← Back</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: surface, borderBottom: `1px solid ${border}`, padding: "0 24px", display: "flex", gap: 4, overflowX: "auto" }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: "12px 16px", background: "transparent", border: "none", cursor: "pointer", fontSize: 13, fontWeight: tab === t ? 700 : 400, color: tab === t ? accent : textMuted, borderBottom: tab === t ? `2px solid ${accent}` : "2px solid transparent", whiteSpace: "nowrap", transition: "color 0.2s" }}>{t}</button>
        ))}
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 16px" }}>

        {tab === "Overview" && (
          <div>
            <div style={{ background: `linear-gradient(135deg, ${accentDim}40, transparent)`, border: `1px solid ${accent}40`, borderRadius: 16, padding: "28px 32px", marginBottom: 28, textAlign: "center" }}>
              <div style={{ fontSize: 30, fontWeight: 900, color: accent, lineHeight: 1.2, marginBottom: 10 }}>Drummond Is Winning.<br />He Just Needs to Stay on the Field.</div>
              <div style={{ fontSize: 15, color: textSecondary, maxWidth: 680, margin: "0 auto" }}>He leads by 1,158 votes. 74,000 Keating voters are up for grabs. Most of them live in his backyard. The math is on his side — but only if he shows up in August.</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 14, marginBottom: 28 }}>
              {[
                { label: "Primary Votes", value: "105,787", color: accent },
                { label: "Current Lead", value: "1,158 votes", color: green },
                { label: "Keating Votes Up for Grabs", value: "74,356", color: blue },
                { label: "Projected Runoff %", value: "53.5%", color: accent },
                { label: "Rogers Co. Margin", value: "3 votes", color: "#f97316" },
                { label: "Projected Win Margin", value: "25,000+", color: green },
              ].map((s, i) => (
                <div key={i} style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: "18px 16px", textAlign: "center" }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 6 }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: 24, marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 20 }}>Primary Result — Head to Head</div>
              {[{ name: "Gentner Drummond", pct: 50.3, votes: 105787, color: accent }, { name: "Mike Mazzei", pct: 49.7, votes: 104629, color: "#64748b" }].map((c, i) => (
                <div key={i} style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: c.color }}>{c.name}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: c.color }}>{c.pct}% · {c.votes.toLocaleString()} votes</span>
                  </div>
                  <AnimBar value={c.pct} max={55} color={c.color} delay={i * 150} />
                </div>
              ))}
              <div style={{ marginTop: 16, padding: "10px 14px", background: "rgba(16,185,129,0.08)", borderRadius: 8, border: "1px solid rgba(16,185,129,0.2)" }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: green }}>Drummond leads by 1,158 votes heading into the August 25 runoff.</span>
              </div>
            </div>
            <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 20 }}>The 193,000 Eliminated Votes — Where Do They Go?</div>
              {[
                { name: "Chip Keating", votes: 74356, pct: 18.8, leans: "DRUMMOND", leansColor: accent, reason: "OKC suburb overlap, non-Trump conservative" },
                { name: "Jake Merrick",  votes: 58314, pct: 14.7, leans: "SPLIT",    leansColor: "#f97316", reason: "Outsider/populist — true swing voters" },
                { name: "Charles McCall",votes: 47501, pct: 12.0, leans: "MAZZEI",   leansColor: "#64748b", reason: "SE Oklahoma base aligns with Mazzei" },
                { name: "Minor Candidates",votes:13000,pct:  3.3, leans: "SPLIT",    leansColor: "#64748b", reason: "Scattered" },
              ].map((c, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 0", borderBottom: i < 3 ? `1px solid ${border}` : "none", flexWrap: "wrap" }}>
                  <div style={{ flex: 1, minWidth: 160 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: textPrimary }}>{c.name}</div>
                    <div style={{ fontSize: 12, color: textMuted, marginTop: 2 }}>{c.reason}</div>
                  </div>
                  <div style={{ width: 110, textAlign: "right" }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: textPrimary }}>{c.votes.toLocaleString()}</div>
                    <div style={{ fontSize: 11, color: textMuted }}>{c.pct}% of primary</div>
                  </div>
                  <div style={{ padding: "4px 12px", background: `${c.leansColor}20`, border: `1px solid ${c.leansColor}40`, borderRadius: 20, fontSize: 11, fontWeight: 700, color: c.leansColor, minWidth: 90, textAlign: "center" }}>
                    → {c.leans}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "County Map" && (
          <div>
            <div style={{ background: `linear-gradient(135deg, ${accentDim}30, transparent)`, border: `1px solid ${accent}30`, borderRadius: 16, padding: "20px 24px", marginBottom: 24 }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: accent, marginBottom: 6 }}>The Map Is Yours. Protect It.</div>
              <div style={{ fontSize: 14, color: textSecondary }}>Drummond leads or ties in 7 of the 10 biggest counties. Consolidate Keating voters in OKC suburbs and hold Rogers County (currently a 3-vote tie).</div>
            </div>
            {COUNTY_DATA.map((c, i) => {
              const edgeColor = c.runoffEdge.includes("STRONG D") ? green : c.runoffEdge.includes("LEAN D") ? accent : c.runoffEdge.includes("TOSS") ? "#f97316" : "#64748b";
              return (
                <div key={i} style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: "16px 20px", marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 12 }}>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: textPrimary }}>{c.county} County</div>
                      <div style={{ fontSize: 12, color: textMuted, marginTop: 2 }}>{c.votes.toLocaleString()} votes · {c.note}</div>
                    </div>
                    <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                      <div style={{ textAlign: "center" }}><div style={{ fontSize: 20, fontWeight: 800, color: accent }}>{c.d}%</div><div style={{ fontSize: 10, color: textMuted }}>Drummond</div></div>
                      <div style={{ fontSize: 14, color: textMuted }}>vs</div>
                      <div style={{ textAlign: "center" }}><div style={{ fontSize: 20, fontWeight: 800, color: "#64748b" }}>{c.m}%</div><div style={{ fontSize: 10, color: textMuted }}>Mazzei</div></div>
                      <div style={{ padding: "4px 12px", background: `${edgeColor}20`, border: `1px solid ${edgeColor}40`, borderRadius: 20, fontSize: 11, fontWeight: 700, color: edgeColor }}>{c.runoffEdge}</div>
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                    {[{ label: "Keating", val: c.keating, color: blue }, { label: "Merrick", val: c.merrick, color: purple }, { label: "McCall", val: c.mccall, color: "#64748b" }].map((s, j) => (
                      <div key={j} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: "8px 10px" }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: s.color }}>{s.val}%</div>
                        <div style={{ fontSize: 10, color: textMuted }}>{s.label} vote</div>
                        <AnimBar value={s.val} max={45} color={s.color} delay={i * 80 + j * 40} />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === "Strongholds" && (
          <div>
            <div style={{ background: `linear-gradient(135deg, ${accentDim}30, transparent)`, border: `1px solid ${accent}30`, borderRadius: 16, padding: "20px 24px", marginBottom: 24 }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: accent, marginBottom: 6 }}>These Are Your Neighborhoods. They Already Love You.</div>
              <div style={{ fontSize: 14, color: textSecondary }}>These precincts voted Drummond by 15–40 points. In the runoff, Keating voters in these same neighborhoods add another 10–20 points on top.</div>
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>🔒 Locked — Drummond Strongholds</div>
            {STRONGHOLD_PRECINCTS.map((p, i) => (
              <div key={i} style={{ background: card, border: `1px solid ${border}`, borderRadius: 10, padding: "14px 18px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", marginBottom: 10 }}>
                <div style={{ flex: 1, minWidth: 180 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: textPrimary }}>Precinct {p.prec} — {p.area}</div>
                  <div style={{ fontSize: 12, color: textMuted, marginTop: 2 }}>{p.county} · {p.votes} votes</div>
                </div>
                <div style={{ display: "flex", gap: 20 }}>
                  <div style={{ textAlign: "center" }}><div style={{ fontSize: 18, fontWeight: 800, color: accent }}>{p.d}%</div><div style={{ fontSize: 10, color: textMuted }}>Drummond</div></div>
                  <div style={{ textAlign: "center" }}><div style={{ fontSize: 18, fontWeight: 800, color: "#64748b" }}>{p.m}%</div><div style={{ fontSize: 10, color: textMuted }}>Mazzei</div></div>
                  <div style={{ textAlign: "center" }}><div style={{ fontSize: 18, fontWeight: 800, color: blue }}>{p.k}%</div><div style={{ fontSize: 10, color: textMuted }}>Keating</div></div>
                </div>
                <div style={{ padding: "4px 12px", background: `${green}20`, border: `1px solid ${green}40`, borderRadius: 20, fontSize: 11, fontWeight: 700, color: green }}>+{(p.d - p.m).toFixed(1)} pts</div>
              </div>
            ))}
            <div style={{ fontSize: 12, fontWeight: 700, color: textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12, marginTop: 24 }}>⚡ Swing Precincts — Win These, Win the Runoff</div>
            {SWING_PRECINCTS.map((p, i) => {
              const dLeads = p.d > p.m;
              return (
                <div key={i} style={{ background: card, border: "1px solid rgba(249,115,22,0.3)", borderRadius: 10, padding: "14px 18px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", marginBottom: 10 }}>
                  <div style={{ flex: 1, minWidth: 180 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: textPrimary }}>Precinct {p.prec} — {p.area}</div>
                    <div style={{ fontSize: 12, color: textMuted, marginTop: 2 }}>{p.county} · {p.votes} votes</div>
                  </div>
                  <div style={{ display: "flex", gap: 20 }}>
                    <div style={{ textAlign: "center" }}><div style={{ fontSize: 18, fontWeight: 800, color: dLeads ? accent : "#64748b" }}>{p.d}%</div><div style={{ fontSize: 10, color: textMuted }}>Drummond</div></div>
                    <div style={{ textAlign: "center" }}><div style={{ fontSize: 18, fontWeight: 800, color: !dLeads ? "#f97316" : "#64748b" }}>{p.m}%</div><div style={{ fontSize: 10, color: textMuted }}>Mazzei</div></div>
                    <div style={{ textAlign: "center" }}><div style={{ fontSize: 18, fontWeight: 800, color: blue }}>{p.k}%</div><div style={{ fontSize: 10, color: textMuted }}>Keating</div></div>
                  </div>
                  <div style={{ padding: "4px 12px", background: "rgba(249,115,22,0.15)", border: "1px solid rgba(249,115,22,0.3)", borderRadius: 20, fontSize: 11, fontWeight: 700, color: "#f97316" }}>{dLeads ? `D +${(p.d-p.m).toFixed(1)}` : `M +${(p.m-p.d).toFixed(1)}`} · SWING</div>
                </div>
              );
            })}
          </div>
        )}

        {tab === "Win Path" && (
          <div>
            <div style={{ background: `linear-gradient(135deg, ${accentDim}30, transparent)`, border: `1px solid ${accent}30`, borderRadius: 16, padding: "20px 24px", marginBottom: 24 }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: accent, marginBottom: 6 }}>Here's Exactly How Drummond Wins in August</div>
              <div style={{ fontSize: 14, color: textSecondary }}>He starts with 105,000 votes. Keating's 74,000 voters live in his neighborhoods. If 65% come home to Drummond, the race is over.</div>
            </div>
            {WIN_PATH.map((s, i) => (
              <div key={i} style={{ background: card, border: `1px solid ${i === WIN_PATH.length-1 ? accent : border}`, borderRadius: 12, padding: "18px 20px", marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 12 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: i === WIN_PATH.length-1 ? accent : textPrimary }}>{s.label}</div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.votes.toLocaleString()}</div>
                    <div style={{ fontSize: 11, color: textMuted }}>{s.pct}% of runoff</div>
                  </div>
                </div>
                <AnimBar value={s.pct} max={60} color={s.color} delay={i * 120} />
              </div>
            ))}
            <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: 24, marginTop: 8 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 20 }}>Keating Vote Geography — Where the 74,000 Live</div>
              {[
                { area: "Oklahoma County (Edmond/NW-OKC)", keating: 13485, dShare: "70%", netGain: "+9,440", note: "Keating ran 40%+ in Edmond — these are Drummond voters" },
                { area: "Cleveland County",                keating:  5468, dShare: "65%", netGain: "+3,554", note: "Norman/Moore suburbs — Drummond firewall" },
                { area: "Canadian County",                 keating:  3816, dShare: "60%", netGain: "+2,290", note: "Mustang/Yukon — Merrick also strong, splits" },
                { area: "Tulsa County",                    keating:  6508, dShare: "45%", netGain: "+1,951", note: "Lower share — Mazzei's home turf competes" },
                { area: "All Other Counties",              keating: 45079, dShare: "65%", netGain: "+29,301", note: "Statewide Keating voters lean Drummond" },
              ].map((r, i) => (
                <div key={i} style={{ padding: "12px 0", borderBottom: i < 4 ? `1px solid ${border}` : "none", display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
                  <div style={{ flex: 1, minWidth: 180 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: textPrimary }}>{r.area}</div>
                    <div style={{ fontSize: 12, color: textMuted, marginTop: 2 }}>{r.note}</div>
                  </div>
                  <div style={{ display: "flex", gap: 20 }}>
                    <div style={{ textAlign: "center" }}><div style={{ fontSize: 15, fontWeight: 700, color: blue }}>{r.keating.toLocaleString()}</div><div style={{ fontSize: 10, color: textMuted }}>Keating votes</div></div>
                    <div style={{ textAlign: "center" }}><div style={{ fontSize: 15, fontWeight: 700, color: accent }}>{r.dShare}</div><div style={{ fontSize: 10, color: textMuted }}>→ Drummond</div></div>
                    <div style={{ textAlign: "center" }}><div style={{ fontSize: 15, fontWeight: 700, color: green }}>{r.netGain}</div><div style={{ fontSize: 10, color: textMuted }}>Net gain</div></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "Messaging" && (
          <div>
            <div style={{ background: `linear-gradient(135deg, ${accentDim}30, transparent)`, border: `1px solid ${accent}30`, borderRadius: 16, padding: "20px 24px", marginBottom: 24 }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: accent, marginBottom: 6 }}>What to Say. Who to Say It To. Where to Say It.</div>
              <div style={{ fontSize: 14, color: textSecondary }}>Five message tracks, each aimed at a specific voter segment. Exact Audience delivers each message to the exact precincts and households where it will move votes.</div>
            </div>
            {MESSAGING.map((m, i) => (
              <div key={i} style={{ background: card, border: `1px solid ${m.priority === "CRITICAL" ? accent : border}`, borderRadius: 12, padding: "20px 24px", marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 12 }}>
                  <div style={{ padding: "3px 10px", background: m.priority === "CRITICAL" ? `${accent}25` : "rgba(255,255,255,0.06)", border: `1px solid ${m.priority === "CRITICAL" ? accent : border}`, borderRadius: 20, fontSize: 11, fontWeight: 700, color: m.priority === "CRITICAL" ? accent : textMuted }}>{m.priority}</div>
                  <div style={{ padding: "3px 10px", background: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.2)", borderRadius: 20, fontSize: 11, color: blue }}>{m.channel}</div>
                </div>
                <div style={{ fontSize: 18, fontWeight: 800, color: textPrimary, marginBottom: 10, lineHeight: 1.3 }}>{m.headline}</div>
                <div style={{ fontSize: 14, color: textSecondary, lineHeight: 1.6, marginBottom: 12 }}>{m.subhead}</div>
                <div style={{ padding: "8px 12px", background: "rgba(255,255,255,0.04)", borderRadius: 8, fontSize: 12, color: textMuted }}>
                  <span style={{ fontWeight: 700, color: textSecondary }}>Target: </span>{m.audience}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "EA Strategy" && (
          <div>
            <div style={{ background: `linear-gradient(135deg, ${accentDim}30, transparent)`, border: `1px solid ${accent}30`, borderRadius: 16, padding: "20px 24px", marginBottom: 24 }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: accent, marginBottom: 6 }}>Exact Audience Finds Your Voters by Name. Not by Zip Code.</div>
              <div style={{ fontSize: 14, color: textSecondary }}>Every Keating voter in Edmond. Every swing voter in Claremore. Every persuadable in Mustang. We match them to the voter file and put your message on their TV — by name.</div>
            </div>
            {[
              { phase: "Phase 1 — Keating Voter Consolidation (Now → July 15)", budget: "$45,000–$65,000", objective: "Lock in Keating's 74,000 voters before Mazzei reaches them", tactics: [
                { tactic: "CTV Voter File Match — Edmond/NW-OKC", detail: "Match Keating voter addresses in precincts 550413–550416 to streaming households. Deliver Drummond's 'finish the job' message 6–8x before July 15." },
                { tactic: "Canadian County Mustang Blitz", detail: "Precinct 090216 (714 votes, dead tie) and 090504 (659 votes, Mazzei +1.1). These Keating-heavy precincts need Drummond messaging before Mazzei defines the narrative." },
                { tactic: "Rogers County Claremore Targeting", detail: "Precincts 660021 (960 votes), 660018 (608 votes), 660020 (560 votes) — all within 4 points. CTV + direct mail to Keating/Merrick households in Claremore." },
              ], result: "Bank 40,000–50,000 Keating votes before August 25" },
              { phase: "Phase 2 — Early Vote Activation (July 15 → August 15)", budget: "$30,000–$45,000", objective: "Drive early vote turnout in Oklahoma County — Drummond's firewall", tactics: [
                { tactic: "Early Vote Reminder Sequence", detail: "Oklahoma County early/absentee voters broke +8.4 pts for Drummond in the primary. Target the same households with early vote reminder messaging — mail + CTV + digital sequence." },
                { tactic: "Payne County Turnout Drive", detail: "Drummond won Payne County by 12 points. With Keating consolidation it becomes +20. Drive turnout in Stillwater to bank a large early margin." },
                { tactic: "Grady County Defense", detail: "Merrick won Grady County at 31.7%. Drummond needs a presence in Chickasha before Mazzei defines the narrative. Radio + digital to Merrick households." },
              ], result: "Build 15,000+ vote early vote cushion before Election Day" },
            ].map((phase, pi) => (
              <div key={pi} style={{ background: card, border: `1px solid ${pi === 0 ? accent : border}`, borderRadius: 12, padding: 24, marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: pi === 0 ? accent : "#fbbf24" }}>{phase.phase}</div>
                    <div style={{ fontSize: 13, color: textMuted, marginTop: 4 }}>{phase.objective}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 24, fontWeight: 800, color: pi === 0 ? accent : "#fbbf24" }}>{phase.budget}</div>
                    <div style={{ fontSize: 11, color: textMuted, textTransform: "uppercase", letterSpacing: "0.06em" }}>Recommended Budget</div>
                  </div>
                </div>
                {phase.tactics.map((t, i) => (
                  <div key={i} style={{ padding: "12px 0", borderBottom: i < phase.tactics.length - 1 ? `1px solid ${border}` : "none" }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: textPrimary, marginBottom: 4 }}>{t.tactic}</div>
                    <div style={{ fontSize: 13, color: textSecondary, lineHeight: 1.6 }}>{t.detail}</div>
                  </div>
                ))}
                <div style={{ marginTop: 16, padding: "10px 14px", background: "rgba(251,191,36,0.08)", borderRadius: 8, border: "1px solid rgba(251,191,36,0.2)" }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#fbbf24" }}>Expected Result: </span>
                  <span style={{ fontSize: 13, color: textSecondary }}>{phase.result}</span>
                </div>
              </div>
            ))}
            <div style={{ padding: "20px 24px", borderLeft: `3px solid ${accent}`, background: "rgba(245,158,11,0.05)", borderRadius: "0 8px 8px 0" }}>
              <p style={{ margin: 0, fontSize: 14, color: textSecondary, fontStyle: "italic", lineHeight: 1.7 }}>"Your current agency buys ads that reach people <em>like</em> your voters. Exact Audience buys ads that reach <em>your actual voters</em> — by name, on the voter file — and tells you which precincts moved."</p>
            </div>
          </div>
        )}

        {tab === "Primary Prediction" && (
          <div style={{ padding: "0 4px" }}>
            <div style={{ background: `linear-gradient(135deg, ${accentDim}40, transparent)`, border: `1px solid ${accent}40`, borderRadius: 16, padding: "28px 32px", marginBottom: 28, textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: accent, lineHeight: 1.2, marginBottom: 10 }}>We Called It Before the Votes Came In.</div>
              <div style={{ fontSize: 15, color: textSecondary, maxWidth: 680, margin: "0 auto" }}>Our analyst model projected the primary outcome — including the runoff — before Election Day. Here's how our forecast compared to the actual June 16 results.</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 14, marginBottom: 28 }}>
              {[
                { label: "Forecast Accuracy", value: "98.7%", color: green },
                { label: "Predicted Vote Gap", value: "913 votes", color: accent },
                { label: "Actual Vote Gap", value: "1,158 votes", color: blue },
                { label: "Votes Off on Gap", value: "245 votes", color: purple },
              ].map((s, i) => (
                <div key={i} style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: "18px 16px", textAlign: "center" }}>
                  <div style={{ fontSize: 26, fontWeight: 800, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 6 }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: 24, marginBottom: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: textPrimary, marginBottom: 20, textTransform: "uppercase", letterSpacing: "0.08em" }}>EA Predicted vs. Actual — All Candidates</div>
              {PRIMARY_PREDICTIONS.map((c, i) => (
                <div key={i} style={{ marginBottom: 22 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, flexWrap: "wrap", gap: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: c.color }} />
                      <span style={{ fontSize: 14, fontWeight: c.isClient ? 700 : 500, color: c.isClient ? accent : textPrimary }}>{c.candidate}{c.isClient ? " ★" : ""}</span>
                    </div>
                    <div style={{ display: "flex", gap: 16, fontSize: 13, flexWrap: "wrap" }}>
                      <span style={{ color: c.color, fontWeight: 700 }}>Predicted: {c.predicted.toFixed(1)}%</span>
                      <span style={{ color: textMuted }}>Actual: {c.actual.toFixed(2)}%</span>
                      <span style={{ color: Math.abs(c.predicted - c.actual) < 1.5 ? green : "#f87171", fontWeight: 700 }}>Δ {(c.predicted - c.actual > 0 ? "+" : "")}{(c.predicted - c.actual).toFixed(2)}%</span>
                    </div>
                  </div>
                  <div style={{ marginBottom: 6 }}>
                    <div style={{ fontSize: 11, color: textMuted, marginBottom: 3 }}>EA PREDICTED</div>
                    <AnimBar value={c.predicted} max={30} color={c.color} delay={i * 80} />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: textMuted, marginBottom: 3 }}>ACTUAL RESULT</div>
                    <AnimBar value={c.actual} max={30} color={c.color + "60"} delay={i * 80 + 300} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ background: `linear-gradient(135deg, ${accentDim}20, rgba(16,185,129,0.05))`, border: `1px solid ${accent}40`, borderRadius: 12, padding: 24 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: green, marginBottom: 8 }}>✓ EA Called the Runoff Before Election Night</div>
              <div style={{ fontSize: 14, color: textSecondary, lineHeight: 1.7 }}>Our model projected no candidate would reach 50% and that Drummond and Mazzei would advance to an August 25 runoff — with Drummond holding a narrow lead of approximately 913 votes. The actual margin was 1,158 votes. We were within 245 votes on the gap and within 1.3% on every candidate's share.</div>
            </div>
          </div>
        )}

        {tab === "Runoff Forecast" && (
          <div style={{ padding: "0 4px" }}>
            <div style={{ background: `linear-gradient(135deg, ${accentDim}40, transparent)`, border: `1px solid ${accent}40`, borderRadius: 16, padding: "28px 32px", marginBottom: 28, textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: accent, lineHeight: 1.2, marginBottom: 10 }}>EA Runoff Forecast — August 25, 2026</div>
              <div style={{ fontSize: 15, color: textSecondary, maxWidth: 680, margin: "0 auto" }}>Our analyst model projects Drummond wins the runoff 53.5% to 46.5% — a margin of approximately 25,000 votes. Here's the county-by-county breakdown driving that projection.</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 14, marginBottom: 28 }}>
              {[
                { label: "Drummond Projected", value: "53.5%", color: accent },
                { label: "Mazzei Projected", value: "46.5%", color: "#f97316" },
                { label: "Projected Margin", value: "~25,000", color: green },
                { label: "Model Confidence", value: "74%", color: blue },
              ].map((s, i) => (
                <div key={i} style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: "18px 16px", textAlign: "center" }}>
                  <div style={{ fontSize: 26, fontWeight: 800, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 6 }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ background: `linear-gradient(135deg, ${accentDim}20, transparent)`, border: `1px solid ${accent}30`, borderRadius: 12, padding: 20, marginBottom: 24 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: accent, marginBottom: 8 }}>The Engine: 74,000 Keating Voters</div>
              <div style={{ fontSize: 13, color: textSecondary, lineHeight: 1.7 }}>Keating's voters are geographically concentrated in Drummond's best territory — Edmond, Mustang, Yukon, Stillwater. Our model projects 65% of Keating voters break Drummond, delivering a net gain of +22,000 votes. That's the entire margin.</div>
              <div style={{ marginTop: 12, display: "flex", gap: 20, flexWrap: "wrap" }}>
                <div><div style={{ fontSize: 22, fontWeight: 900, color: accent }}>74,356</div><div style={{ fontSize: 11, color: textMuted, textTransform: "uppercase" }}>Keating Votes Up for Grabs</div></div>
                <div><div style={{ fontSize: 22, fontWeight: 900, color: green }}>65%</div><div style={{ fontSize: 11, color: textMuted, textTransform: "uppercase" }}>Projected to Drummond</div></div>
                <div><div style={{ fontSize: 22, fontWeight: 900, color: blue }}>+22,000</div><div style={{ fontSize: 11, color: textMuted, textTransform: "uppercase" }}>Net Gain for Drummond</div></div>
              </div>
            </div>
            <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: 24, marginBottom: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: textPrimary, marginBottom: 20, textTransform: "uppercase", letterSpacing: "0.08em" }}>County-by-County Runoff Projection</div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${border}` }}>
                      {["County", "Drummond %", "Mazzei %", "Est. Votes", "Confidence", "Tier"].map(h => (
                        <th key={h} style={{ padding: "8px 12px", textAlign: "left", color: textMuted, fontWeight: 600, textTransform: "uppercase", fontSize: 11, letterSpacing: "0.06em" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {RUNOFF_FORECAST.map((r, i) => (
                      <tr key={i} style={{ borderBottom: `1px solid ${border}20` }}>
                        <td style={{ padding: "10px 12px", fontWeight: 700, color: textPrimary }}>{r.county}</td>
                        <td style={{ padding: "10px 12px", color: accent, fontWeight: 700 }}>{r.dPred.toFixed(1)}%</td>
                        <td style={{ padding: "10px 12px", color: "#f97316", fontWeight: 700 }}>{r.mPred.toFixed(1)}%</td>
                        <td style={{ padding: "10px 12px", color: textSecondary }}>{r.votes.toLocaleString()}</td>
                        <td style={{ padding: "10px 12px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ flex: 1, height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
                              <div style={{ height: "100%", width: `${r.confidence}%`, background: r.confidence > 80 ? green : r.confidence > 65 ? "#fbbf24" : "#f87171", borderRadius: 3 }} />
                            </div>
                            <span style={{ fontSize: 12, color: textMuted, minWidth: 32 }}>{r.confidence}%</span>
                          </div>
                        </td>
                        <td style={{ padding: "10px 12px" }}>
                          <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 4, background: r.tier.includes("DRUMMOND") ? `${accentDim}40` : r.tier === "TOSS-UP" ? "rgba(251,191,36,0.15)" : "rgba(249,115,22,0.15)", color: r.tier.includes("DRUMMOND") ? accent : r.tier === "TOSS-UP" ? "#fbbf24" : "#f97316" }}>{r.tier}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div style={{ background: `linear-gradient(135deg, ${accentDim}20, rgba(251,191,36,0.05))`, border: `1px solid ${accent}40`, borderRadius: 12, padding: 24 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: accent, marginBottom: 8 }}>Why This Forecast Matters for Your Campaign</div>
              <div style={{ fontSize: 14, color: textSecondary, lineHeight: 1.7 }}>We don't just predict the outcome — we tell you which precincts are driving it and which voters you need to reach. The 10 counties above represent 87% of the projected runoff vote. Exact Audience can reach the specific households in every swing precinct by name, on their TV, before August 25.</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
