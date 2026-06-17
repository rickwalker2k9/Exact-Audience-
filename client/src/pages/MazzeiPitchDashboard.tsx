/**
 * MazzeiPitchDashboard.tsx — RUNOFF VERSION
 * Exact Audience — Mike Mazzei Runoff Strategy Dashboard
 * August 25, 2026 Oklahoma Governor Runoff
 */
import { useState, useEffect } from "react";
import { useLocation } from "wouter";

const bg = "#0a0f1e";
const surface = "#111827";
const card = "#1a2235";
const border = "#1e3a5f";
const accent = "#6366f1";       // Mazzei indigo/purple
const accentAlt = "#818cf8";
const accentDim = "#312e81";
const textPrimary = "#f1f5f9";
const textSecondary = "#94a3b8";
const textMuted = "#475569";
const green = "#10b981";
const blue = "#38bdf8";
const orange = "#f97316";

const COUNTY_DATA = [
  { county: "Tulsa",      m: 35.3, d: 32.8, margin: +2.4, votes: 58126, keating: 11.2, merrick: 10.8, mccall:  7.3, runoffEdge: "STRONG M", note: "Mazzei anchor — Trump endorsement resonates here" },
  { county: "Wagoner",    m: 32.3, d: 29.9, margin: +2.4, votes: 10782, keating: 12.1, merrick: 11.8, mccall:  8.2, runoffEdge: "LEAN M",   note: "Suburban Tulsa — Mazzei base" },
  { county: "Pittsburg",  m: 31.3, d: 24.1, margin: +7.2, votes:  5301, keating: 14.2, merrick: 12.1, mccall: 11.8, runoffEdge: "STRONG M", note: "McCall country — McCall voters flow to Mazzei" },
  { county: "Sequoyah",   m: 31.3, d: 21.6, margin: +9.7, votes:  3618, keating: 12.3, merrick: 11.4, mccall: 13.2, runoffEdge: "STRONG M", note: "SE Oklahoma — McCall base aligns with Mazzei" },
  { county: "Logan",      m: 26.0, d: 22.1, margin: +3.9, votes:  7494, keating: 19.3, merrick: 22.4, mccall: 10.6, runoffEdge: "LEAN M",   note: "Guthrie — Mazzei leads but Keating 19% is risk" },
  { county: "Rogers",     m: 30.0, d: 30.0, margin:  0.0, votes: 14245, keating: 13.1, merrick: 14.0, mccall: 10.1, runoffEdge: "TOSS-UP",  note: "3-vote tie — Claremore is Mazzei's best flip target" },
  { county: "Washington", m: 25.1, d: 24.8, margin: +0.3, votes:  6782, keating: 17.0, merrick: 13.2, mccall:  8.9, runoffEdge: "TOSS-UP",  note: "Bartlesville — nearly tied, Merrick 13% is swing" },
  { county: "Grady",      m: 18.3, d: 19.5, margin: -1.1, votes:  7935, keating: 18.3, merrick: 31.7, mccall:  9.8, runoffEdge: "TOSS-UP",  note: "Merrick WON this county — Mazzei can steal Merrick voters" },
  { county: "Oklahoma",   m: 24.8, d: 27.4, margin: -2.6, votes: 58146, keating: 23.2, merrick: 12.6, mccall:  8.8, runoffEdge: "LEAN D",   note: "Drummond firewall — Keating 23% flows to Drummond" },
  { county: "Canadian",   m: 22.0, d: 23.8, margin: -1.8, votes: 19080, keating: 20.0, merrick: 24.5, mccall:  8.5, runoffEdge: "LEAN D",   note: "Mustang: Merrick 24.5% — Mazzei's best flip opportunity" },
];

const STRONGHOLD_PRECINCTS = [
  { prec: "660021", county: "Rogers Co.",   area: "Claremore-North", m: 33.4, d: 29.3, k: 16.0, votes: 960,  note: "Biggest Rogers precinct — M +4.2 pts" },
  { prec: "660030", county: "Rogers Co.",   area: "Claremore-South", m: 39.9, d: 26.4, k: 13.6, votes: 632,  note: "M +13.5 pts — Mazzei's strongest Rogers precinct" },
  { prec: "660018", county: "Rogers Co.",   area: "Claremore-North", m: 29.9, d: 25.8, k: 16.6, votes: 608,  note: "M +4.1 pts — Keating 16.6% is the swing" },
  { prec: "420207", county: "Logan Co.",    area: "Guthrie",         m: 27.2, d: 19.5, k: 17.0, votes: 747,  note: "Biggest Logan precinct — M +7.7 pts" },
  { prec: "420104", county: "Logan Co.",    area: "Guthrie",         m: 29.9, d: 20.7, k: 15.5, votes: 569,  note: "Guthrie core — M +9.2 pts" },
  { prec: "090200", county: "Canadian Co.", area: "Mustang",         m: 26.2, d: 23.5, k: 15.7, votes: 701,  note: "Largest Canadian precinct — M +2.7 pts" },
];

const SWING_PRECINCTS = [
  { prec: "660004", county: "Rogers Co.",   area: "Claremore-South", m: 26.7, d: 27.3, k: 15.8, votes: 495, note: "D leads by 0.6 pts — flippable" },
  { prec: "660015", county: "Rogers Co.",   area: "Claremore-South", m: 24.4, d: 30.5, k: 16.7, votes: 455, note: "D leads 6 pts — Keating 16.7% is key" },
  { prec: "090216", county: "Canadian Co.", area: "Mustang",         m: 25.2, d: 25.1, k: 18.4, votes: 714, note: "Dead tie — largest Canadian precinct" },
  { prec: "090504", county: "Canadian Co.", area: "Mustang",         m: 20.9, d: 19.9, k: 23.5, votes: 659, note: "M leads by 1 pt — Keating 23.5% is the swing" },
  { prec: "550452", county: "Oklahoma Co.", area: "Edmond-South",    m: 28.4, d: 27.5, k: 23.5, votes: 582, note: "M leads by 0.9 pts — Keating 23.5% could flip it" },
  { prec: "260041", county: "Grady Co.",    area: "Chickasha",       m: 21.8, d: 19.2, k: 18.4, votes: 652, note: "Merrick 32.5% — whoever wins Merrick voters wins Grady" },
];

const WIN_PATH = [
  { label: "Mazzei Primary Base",          votes: 104629, pct: 49.7, color: accent },
  { label: "Absorb McCall Voters (60%)",   votes:  28501, pct: 13.5, color: green },
  { label: "Win Merrick Voters (50%)",     votes:  29157, pct: 13.9, color: blue },
  { label: "Hold Keating Voters (35%)",    votes:  26025, pct: 12.4, color: orange },
  { label: "Projected Runoff Total",       votes: 188312, pct: 46.5, color: accent },
];

const MESSAGING = [
  { headline: "Trump Picked Mazzei. That Means Something.", subhead: "The President of the United States endorsed Mike Mazzei. In a Republican primary, that's the most powerful signal a voter can get. Lean into it in Tulsa, Wagoner, Pittsburg, and SE Oklahoma — where it moves the most votes.", audience: "Tulsa County, Wagoner, SE Oklahoma base", channel: "CTV / OTT", priority: "HIGH" },
  { headline: "McCall Voters: You Already Know Mike.", subhead: "Charles McCall's voters are in SE Oklahoma — Pittsburg, Sequoyah, Atoka, Johnston. They're fiscal conservatives who want someone who knows how to get things done in the Capitol. That's Mazzei. Reach them in the first two weeks before Drummond does.", audience: "McCall precincts: Pittsburg, Sequoyah, Atoka, Johnston counties", channel: "Direct Mail + CTV", priority: "CRITICAL" },
  { headline: "Rogers County Is a 3-Vote Tie. Claremore Is Yours.", subhead: "Rogers County is literally tied by 3 votes. Mazzei leads in Claremore (precincts 660021, 660030, 660018). Drummond leads in NW Rogers (Owasso border). The play: drive Claremore turnout and flip one Catoosa precinct. That wins Rogers County and puts Mazzei over the top.", audience: "Claremore & Catoosa voters", channel: "Doors + Digital", priority: "CRITICAL" },
  { headline: "Grady County Is Up for Grabs. Merrick Voters Are Waiting.", subhead: "Merrick WON Grady County with 31.7%. Those are populist outsider voters — they're not going to Drummond (the incumbent). Mazzei needs to make the case in Chickasha and Tuttle that he's the change candidate, not the status quo.", audience: "Grady County Merrick voters (precincts 260037, 260040, 260041)", channel: "Radio + Digital", priority: "HIGH" },
  { headline: "Canadian County Mustang Is a Dead Tie. Win It.", subhead: "Precinct 090216 (714 votes) is tied by 1 vote. Precinct 090504 (659 votes) — Mazzei leads by 1 point. Merrick ran 23–27% in these precincts. Those voters are persuadable. Mazzei needs to be on their TVs before Drummond defines the Keating narrative.", audience: "Mustang/Yukon precincts 090216, 090504, 090202, 090205", channel: "CTV + Digital", priority: "HIGH" },
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

const TABS = ["Overview", "County Map", "Strongholds", "Win Path", "Messaging", "EA Strategy"];

export default function MazzeiPitchDashboard() {
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
            <div style={{ fontSize: 18, fontWeight: 800, color: accentAlt, letterSpacing: "-0.02em" }}>MIKE MAZZEI</div>
            <div style={{ fontSize: 11, color: textMuted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Oklahoma Governor · Runoff Strategy · August 25, 2026</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ padding: "6px 14px", background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 20, fontSize: 12, fontWeight: 700, color: accentAlt }}>
            ★ TRUMP ENDORSED · 46.5% PROJECTED
          </div>
          <button onClick={() => navigate("/campaigns")} style={{ padding: "6px 14px", background: "transparent", border: `1px solid ${border}`, borderRadius: 8, color: textMuted, fontSize: 12, cursor: "pointer" }}>← Back</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: surface, borderBottom: `1px solid ${border}`, padding: "0 24px", display: "flex", gap: 4, overflowX: "auto" }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: "12px 16px", background: "transparent", border: "none", cursor: "pointer", fontSize: 13, fontWeight: tab === t ? 700 : 400, color: tab === t ? accentAlt : textMuted, borderBottom: tab === t ? `2px solid ${accentAlt}` : "2px solid transparent", whiteSpace: "nowrap", transition: "color 0.2s" }}>{t}</button>
        ))}
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 16px" }}>

        {tab === "Overview" && (
          <div>
            <div style={{ background: `linear-gradient(135deg, ${accentDim}60, transparent)`, border: `1px solid ${accent}40`, borderRadius: 16, padding: "28px 32px", marginBottom: 28, textAlign: "center" }}>
              <div style={{ fontSize: 30, fontWeight: 900, color: accentAlt, lineHeight: 1.2, marginBottom: 10 }}>Mazzei Is 1,158 Votes Behind.<br />The Votes to Win Are Right There.</div>
              <div style={{ fontSize: 15, color: textSecondary, maxWidth: 680, margin: "0 auto" }}>He trails by less than 0.6 points. McCall's 47,000 voters are in his backyard. Merrick's 58,000 are up for grabs. Win those two groups and Mazzei wins the runoff.</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 14, marginBottom: 28 }}>
              {[
                { label: "Primary Votes", value: "104,629", color: accentAlt },
                { label: "Deficit to Close", value: "1,158 votes", color: orange },
                { label: "McCall Votes Up for Grabs", value: "47,501", color: green },
                { label: "Merrick Votes Up for Grabs", value: "58,314", color: blue },
                { label: "Rogers Co. Margin", value: "3 votes", color: orange },
                { label: "Projected Runoff %", value: "46.5%", color: accentAlt },
              ].map((s, i) => (
                <div key={i} style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: "18px 16px", textAlign: "center" }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 6 }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: 24, marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 20 }}>Primary Result — Head to Head</div>
              {[{ name: "Mike Mazzei", pct: 49.7, votes: 104629, color: accentAlt }, { name: "Gentner Drummond", pct: 50.3, votes: 105787, color: "#64748b" }].map((c, i) => (
                <div key={i} style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: c.color }}>{c.name}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: c.color }}>{c.pct}% · {c.votes.toLocaleString()} votes</span>
                  </div>
                  <AnimBar value={c.pct} max={55} color={c.color} delay={i * 150} />
                </div>
              ))}
              <div style={{ marginTop: 16, padding: "10px 14px", background: "rgba(99,102,241,0.08)", borderRadius: 8, border: "1px solid rgba(99,102,241,0.2)" }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: accentAlt }}>Mazzei trails by just 1,158 votes (0.55 pts). This is a coin flip heading into August 25.</span>
              </div>
            </div>
            <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 20 }}>The 193,000 Eliminated Votes — Mazzei's Opportunity</div>
              {[
                { name: "Jake Merrick",   votes: 58314, pct: 14.7, leans: "SPLIT",  leansColor: orange, reason: "Outsider/populist — Mazzei can win these as the 'change' candidate" },
                { name: "Charles McCall", votes: 47501, pct: 12.0, leans: "MAZZEI", leansColor: accentAlt, reason: "SE Oklahoma base — natural Mazzei territory" },
                { name: "Chip Keating",   votes: 74356, pct: 18.8, leans: "DRUMMOND", leansColor: "#64748b", reason: "OKC suburb overlap — Drummond's best consolidation target" },
                { name: "Minor Candidates", votes: 13000, pct: 3.3, leans: "SPLIT", leansColor: "#64748b", reason: "Scattered" },
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
                  <div style={{ padding: "4px 12px", background: `${c.leansColor}20`, border: `1px solid ${c.leansColor}40`, borderRadius: 20, fontSize: 11, fontWeight: 700, color: c.leansColor, minWidth: 90, textAlign: "center" }}>→ {c.leans}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "County Map" && (
          <div>
            <div style={{ background: `linear-gradient(135deg, ${accentDim}40, transparent)`, border: `1px solid ${accent}30`, borderRadius: 16, padding: "20px 24px", marginBottom: 24 }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: accentAlt, marginBottom: 6 }}>Hold Tulsa. Win SE Oklahoma. Steal Grady and Canadian.</div>
              <div style={{ fontSize: 14, color: textSecondary }}>Mazzei's base is Tulsa + eastern Oklahoma. His path to winning is holding that base while flipping Rogers County (3-vote tie) and stealing Merrick voters in Grady and Canadian counties.</div>
            </div>
            {COUNTY_DATA.map((c, i) => {
              const edgeColor = c.runoffEdge.includes("STRONG M") ? accentAlt : c.runoffEdge.includes("LEAN M") ? accent : c.runoffEdge.includes("TOSS") ? orange : "#64748b";
              return (
                <div key={i} style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: "16px 20px", marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 12 }}>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: textPrimary }}>{c.county} County</div>
                      <div style={{ fontSize: 12, color: textMuted, marginTop: 2 }}>{c.votes.toLocaleString()} votes · {c.note}</div>
                    </div>
                    <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                      <div style={{ textAlign: "center" }}><div style={{ fontSize: 20, fontWeight: 800, color: accentAlt }}>{c.m}%</div><div style={{ fontSize: 10, color: textMuted }}>Mazzei</div></div>
                      <div style={{ fontSize: 14, color: textMuted }}>vs</div>
                      <div style={{ textAlign: "center" }}><div style={{ fontSize: 20, fontWeight: 800, color: "#64748b" }}>{c.d}%</div><div style={{ fontSize: 10, color: textMuted }}>Drummond</div></div>
                      <div style={{ padding: "4px 12px", background: `${edgeColor}20`, border: `1px solid ${edgeColor}40`, borderRadius: 20, fontSize: 11, fontWeight: 700, color: edgeColor }}>{c.runoffEdge}</div>
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                    {[{ label: "Keating", val: c.keating, color: "#64748b" }, { label: "Merrick", val: c.merrick, color: blue }, { label: "McCall", val: c.mccall, color: green }].map((s, j) => (
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
            <div style={{ background: `linear-gradient(135deg, ${accentDim}40, transparent)`, border: `1px solid ${accent}30`, borderRadius: 16, padding: "20px 24px", marginBottom: 24 }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: accentAlt, marginBottom: 6 }}>These Are Your Neighborhoods. They Voted for You First.</div>
              <div style={{ fontSize: 14, color: textSecondary }}>Mazzei's strongholds are in Claremore, Guthrie, and the Mustang corridor. In the runoff, McCall voters in these same areas will add another 5–10 points.</div>
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>🔒 Locked — Mazzei Strongholds</div>
            {STRONGHOLD_PRECINCTS.map((p, i) => (
              <div key={i} style={{ background: card, border: `1px solid ${border}`, borderRadius: 10, padding: "14px 18px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", marginBottom: 10 }}>
                <div style={{ flex: 1, minWidth: 180 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: textPrimary }}>Precinct {p.prec} — {p.area}</div>
                  <div style={{ fontSize: 12, color: textMuted, marginTop: 2 }}>{p.county} · {p.votes} votes · {p.note}</div>
                </div>
                <div style={{ display: "flex", gap: 20 }}>
                  <div style={{ textAlign: "center" }}><div style={{ fontSize: 18, fontWeight: 800, color: accentAlt }}>{p.m}%</div><div style={{ fontSize: 10, color: textMuted }}>Mazzei</div></div>
                  <div style={{ textAlign: "center" }}><div style={{ fontSize: 18, fontWeight: 800, color: "#64748b" }}>{p.d}%</div><div style={{ fontSize: 10, color: textMuted }}>Drummond</div></div>
                  <div style={{ textAlign: "center" }}><div style={{ fontSize: 18, fontWeight: 800, color: blue }}>{p.k}%</div><div style={{ fontSize: 10, color: textMuted }}>Keating</div></div>
                </div>
                <div style={{ padding: "4px 12px", background: `${accentAlt}20`, border: `1px solid ${accentAlt}40`, borderRadius: 20, fontSize: 11, fontWeight: 700, color: accentAlt }}>+{(p.m - p.d).toFixed(1)} pts</div>
              </div>
            ))}
            <div style={{ fontSize: 12, fontWeight: 700, color: textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12, marginTop: 24 }}>⚡ Swing Precincts — Win These, Win the Runoff</div>
            {SWING_PRECINCTS.map((p, i) => {
              const mLeads = p.m > p.d;
              return (
                <div key={i} style={{ background: card, border: "1px solid rgba(249,115,22,0.3)", borderRadius: 10, padding: "14px 18px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", marginBottom: 10 }}>
                  <div style={{ flex: 1, minWidth: 180 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: textPrimary }}>Precinct {p.prec} — {p.area}</div>
                    <div style={{ fontSize: 12, color: textMuted, marginTop: 2 }}>{p.county} · {p.votes} votes · {p.note}</div>
                  </div>
                  <div style={{ display: "flex", gap: 20 }}>
                    <div style={{ textAlign: "center" }}><div style={{ fontSize: 18, fontWeight: 800, color: mLeads ? accentAlt : "#64748b" }}>{p.m}%</div><div style={{ fontSize: 10, color: textMuted }}>Mazzei</div></div>
                    <div style={{ textAlign: "center" }}><div style={{ fontSize: 18, fontWeight: 800, color: !mLeads ? orange : "#64748b" }}>{p.d}%</div><div style={{ fontSize: 10, color: textMuted }}>Drummond</div></div>
                    <div style={{ textAlign: "center" }}><div style={{ fontSize: 18, fontWeight: 800, color: blue }}>{p.k}%</div><div style={{ fontSize: 10, color: textMuted }}>Keating</div></div>
                  </div>
                  <div style={{ padding: "4px 12px", background: "rgba(249,115,22,0.15)", border: "1px solid rgba(249,115,22,0.3)", borderRadius: 20, fontSize: 11, fontWeight: 700, color: orange }}>{mLeads ? `M +${(p.m-p.d).toFixed(1)}` : `D +${(p.d-p.m).toFixed(1)}`} · SWING</div>
                </div>
              );
            })}
          </div>
        )}

        {tab === "Win Path" && (
          <div>
            <div style={{ background: `linear-gradient(135deg, ${accentDim}40, transparent)`, border: `1px solid ${accent}30`, borderRadius: 16, padding: "20px 24px", marginBottom: 24 }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: accentAlt, marginBottom: 6 }}>Here's Exactly How Mazzei Wins in August</div>
              <div style={{ fontSize: 14, color: textSecondary }}>He starts with 104,000 votes. McCall's 47,000 voters are in SE Oklahoma — his home turf. Win 60% of them and the gap is closed before the Merrick vote even matters.</div>
            </div>
            {WIN_PATH.map((s, i) => (
              <div key={i} style={{ background: card, border: `1px solid ${i === WIN_PATH.length-1 ? accentAlt : border}`, borderRadius: 12, padding: "18px 20px", marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 12 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: i === WIN_PATH.length-1 ? accentAlt : textPrimary }}>{s.label}</div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.votes.toLocaleString()}</div>
                    <div style={{ fontSize: 11, color: textMuted }}>{s.pct}% of runoff</div>
                  </div>
                </div>
                <AnimBar value={s.pct} max={60} color={s.color} delay={i * 120} />
              </div>
            ))}
            <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: 24, marginTop: 8 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 20 }}>McCall Vote Geography — Where the 47,000 Live</div>
              {[
                { area: "SE Oklahoma (Pittsburg, Sequoyah, Atoka, Johnston)", mccall: 8200, mShare: "65%", netGain: "+5,330", note: "McCall's home base — natural Mazzei territory" },
                { area: "Tulsa County",                                        mccall: 4250, mShare: "60%", netGain: "+2,550", note: "Mazzei anchor county — McCall voters follow" },
                { area: "Logan County (Guthrie)",                              mccall: 2200, mShare: "55%", netGain: "+1,210", note: "Mazzei already leads Logan — McCall seals it" },
                { area: "Canadian County",                                     mccall: 1620, mShare: "50%", netGain: "+810",   note: "Split territory — Merrick also strong here" },
                { area: "All Other Counties",                                  mccall: 31231,mShare: "58%", netGain: "+18,114",note: "Statewide McCall voters lean Mazzei" },
              ].map((r, i) => (
                <div key={i} style={{ padding: "12px 0", borderBottom: i < 4 ? `1px solid ${border}` : "none", display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
                  <div style={{ flex: 1, minWidth: 180 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: textPrimary }}>{r.area}</div>
                    <div style={{ fontSize: 12, color: textMuted, marginTop: 2 }}>{r.note}</div>
                  </div>
                  <div style={{ display: "flex", gap: 20 }}>
                    <div style={{ textAlign: "center" }}><div style={{ fontSize: 15, fontWeight: 700, color: green }}>{r.mccall.toLocaleString()}</div><div style={{ fontSize: 10, color: textMuted }}>McCall votes</div></div>
                    <div style={{ textAlign: "center" }}><div style={{ fontSize: 15, fontWeight: 700, color: accentAlt }}>{r.mShare}</div><div style={{ fontSize: 10, color: textMuted }}>→ Mazzei</div></div>
                    <div style={{ textAlign: "center" }}><div style={{ fontSize: 15, fontWeight: 700, color: green }}>{r.netGain}</div><div style={{ fontSize: 10, color: textMuted }}>Net gain</div></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "Messaging" && (
          <div>
            <div style={{ background: `linear-gradient(135deg, ${accentDim}40, transparent)`, border: `1px solid ${accent}30`, borderRadius: 16, padding: "20px 24px", marginBottom: 24 }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: accentAlt, marginBottom: 6 }}>What to Say. Who to Say It To. Where to Say It.</div>
              <div style={{ fontSize: 14, color: textSecondary }}>Five message tracks, each aimed at a specific voter segment. Exact Audience delivers each message to the exact precincts and households where it will move votes.</div>
            </div>
            {MESSAGING.map((m, i) => (
              <div key={i} style={{ background: card, border: `1px solid ${m.priority === "CRITICAL" ? accentAlt : border}`, borderRadius: 12, padding: "20px 24px", marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 12 }}>
                  <div style={{ padding: "3px 10px", background: m.priority === "CRITICAL" ? `${accentAlt}25` : "rgba(255,255,255,0.06)", border: `1px solid ${m.priority === "CRITICAL" ? accentAlt : border}`, borderRadius: 20, fontSize: 11, fontWeight: 700, color: m.priority === "CRITICAL" ? accentAlt : textMuted }}>{m.priority}</div>
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
            <div style={{ background: `linear-gradient(135deg, ${accentDim}40, transparent)`, border: `1px solid ${accent}30`, borderRadius: 16, padding: "20px 24px", marginBottom: 24 }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: accentAlt, marginBottom: 6 }}>Exact Audience Finds Your Voters by Name. Not by Zip Code.</div>
              <div style={{ fontSize: 14, color: textSecondary }}>Every McCall voter in SE Oklahoma. Every Merrick voter in Grady County. Every swing voter in Claremore. We match them to the voter file and put your message on their TV — by name.</div>
            </div>
            {[
              { phase: "Phase 1 — McCall Voter Absorption (Now → July 15)", budget: "$40,000–$55,000", objective: "Lock in McCall's 47,000 voters before Drummond reaches them", tactics: [
                { tactic: "SE Oklahoma CTV Blitz", detail: "Match McCall voter addresses in Pittsburg, Sequoyah, Atoka, and Johnston counties to streaming households. Deliver Mazzei's 'change' message 6–8x before July 15. These voters are in Mazzei's natural territory." },
                { tactic: "Tulsa County McCall Outreach", detail: "4,250 McCall voters in Tulsa County. Mazzei already leads Tulsa — these voters are the easiest consolidation. CTV + digital sequence targeting McCall household addresses." },
                { tactic: "Logan County Guthrie Lock-In", detail: "Mazzei leads Logan County by 3.9 pts. McCall got 10.6% there. 2,200 McCall voters in Logan — lock them in early to prevent Drummond from flipping Guthrie's Keating precincts." },
              ], result: "Close the 1,158-vote gap and build a 5,000-vote cushion before July 15" },
              { phase: "Phase 2 — Merrick Voter Persuasion (July 15 → August 15)", budget: "$35,000–$50,000", objective: "Win the Merrick vote in Grady and Canadian counties — the true swing voters", tactics: [
                { tactic: "Grady County Merrick Targeting", detail: "Merrick WON Grady County at 31.7%. Precincts 260037, 260040, 260041 (Chickasha area) — 1,700+ votes, Merrick ran 32–47%. These voters are populist outsiders. Mazzei's message: 'I'm the change candidate, not the incumbent.'" },
                { tactic: "Canadian County Mustang Blitz", detail: "Precinct 090216 (714 votes, dead tie) and 090504 (659 votes, Mazzei +1 pt). Merrick ran 23–27% in these precincts. CTV + digital to Merrick household addresses in Mustang/Yukon before Drummond defines the Keating narrative." },
                { tactic: "Rogers County Claremore Turnout Drive", detail: "Rogers County is a 3-vote tie. Mazzei leads Claremore (660021, 660030, 660018 — 2,200 votes, M +4–13 pts). Drive turnout in Claremore specifically — doors + mail + CTV — to bank a 300–400 vote cushion before Election Day." },
              ], result: "Win Grady County, flip Canadian County, hold Rogers — net +8,000 votes" },
            ].map((phase, pi) => (
              <div key={pi} style={{ background: card, border: `1px solid ${pi === 0 ? accentAlt : border}`, borderRadius: 12, padding: 24, marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: pi === 0 ? accentAlt : "#818cf8" }}>{phase.phase}</div>
                    <div style={{ fontSize: 13, color: textMuted, marginTop: 4 }}>{phase.objective}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 24, fontWeight: 800, color: pi === 0 ? accentAlt : "#818cf8" }}>{phase.budget}</div>
                    <div style={{ fontSize: 11, color: textMuted, textTransform: "uppercase", letterSpacing: "0.06em" }}>Recommended Budget</div>
                  </div>
                </div>
                {phase.tactics.map((t, i) => (
                  <div key={i} style={{ padding: "12px 0", borderBottom: i < phase.tactics.length - 1 ? `1px solid ${border}` : "none" }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: textPrimary, marginBottom: 4 }}>{t.tactic}</div>
                    <div style={{ fontSize: 13, color: textSecondary, lineHeight: 1.6 }}>{t.detail}</div>
                  </div>
                ))}
                <div style={{ marginTop: 16, padding: "10px 14px", background: "rgba(99,102,241,0.08)", borderRadius: 8, border: "1px solid rgba(99,102,241,0.2)" }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: accentAlt }}>Expected Result: </span>
                  <span style={{ fontSize: 13, color: textSecondary }}>{phase.result}</span>
                </div>
              </div>
            ))}
            <div style={{ padding: "20px 24px", borderLeft: `3px solid ${accentAlt}`, background: "rgba(99,102,241,0.05)", borderRadius: "0 8px 8px 0" }}>
              <p style={{ margin: 0, fontSize: 14, color: textSecondary, fontStyle: "italic", lineHeight: 1.7 }}>"Your current agency buys ads that reach people <em>like</em> your voters. Exact Audience buys ads that reach <em>your actual voters</em> — by name, on the voter file — and tells you which precincts moved."</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
