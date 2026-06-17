/**
 * MazzeiPitchDashboard.tsx — CLEAN RUNOFF VERSION
 * Exact Audience — Mike Mazzei Runoff Strategy
 * 4 tabs: Primary Prediction | Runoff Forecast | County Breakdown | Path to Win
 */
import { useState, useEffect } from "react";
import { useLocation } from "wouter";

const bg = "#0a0f1e";
const surface = "#111827";
const card = "#1a2235";
const border = "#1e3a5f";
const accent = "#fb923c";
const accentDim = "#7c2d12";
const textPrimary = "#f1f5f9";
const textSecondary = "#94a3b8";
const textMuted = "#475569";
const green = "#10b981";
const blue = "#38bdf8";
const gold = "#f59e0b";
const purple = "#a78bfa";

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

const PRIMARY_PREDICTIONS = [
  { candidate: "Gentner Drummond", predicted: 25.8,  actual: 25.43, color: gold,   isClient: false },
  { candidate: "Mike Mazzei",      predicted: 24.5,  actual: 24.75, color: accent, isClient: true  },
  { candidate: "Chip Keating",     predicted: 19.1,  actual: 18.07, color: purple, isClient: false },
  { candidate: "Jake Merrick",     predicted: 15.3,  actual: 14.67, color: "#34d399", isClient: false },
  { candidate: "Charles McCall",   predicted: 14.1,  actual: 13.87, color: blue,   isClient: false },
];

const COUNTIES = [
  { county: "Tulsa",      dPct: 44.1, mPct: 55.9, votes: 62000, conf: 79, tier: "MAZZEI BASE",       note: "Mazzei's anchor — wins by 11.8 pts in primary. Must hold 55%+ in the runoff. Trump endorsement resonates here. Drummond will not compete in Tulsa County." },
  { county: "Wagoner",    dPct: 45.8, mPct: 54.2, votes: 11000, conf: 76, tier: "MAZZEI BASE",       note: "Eastern OK suburban Tulsa. Mazzei wins comfortably. Protect the margin — McCall voters here flow naturally to Mazzei." },
  { county: "Pittsburg",  dPct: 42.1, mPct: 57.9, votes: 5500,  conf: 72, tier: "MAZZEI BASE",       note: "McCall's SE Oklahoma base. McCall got 14.4% here — those voters flow to Mazzei. Consolidate early." },
  { county: "Sequoyah",   dPct: 40.8, mPct: 59.2, votes: 3800,  conf: 70, tier: "MAZZEI BASE",       note: "Deep eastern OK. Mazzei's territory. McCall voters align with Mazzei's coalition." },
  { county: "Rogers",     dPct: 50.4, mPct: 49.6, votes: 14500, conf: 52, tier: "TOSS-UP",           note: "3-vote margin in the primary. Most important county in the runoff. Claremore is Mazzei's anchor — must hold it and flip Catoosa." },
  { county: "Grady",      dPct: 48.6, mPct: 51.4, votes: 7600,  conf: 58, tier: "LEAN MAZZEI",       note: "Merrick WON this county at 31.7%. Those populist outsider voters are the swing. Mazzei needs them — they're not natural Drummond voters." },
  { county: "Logan",      dPct: 47.2, mPct: 52.8, votes: 7500,  conf: 63, tier: "LEAN MAZZEI",       note: "Guthrie is Mazzei's anchor. Drummond needs Keating voters in Guthrie to flip it — Mazzei must neutralize that by reaching Keating voters first." },
  { county: "Canadian",   dPct: 51.8, mPct: 48.2, votes: 12500, conf: 65, tier: "TOSS-UP",           note: "Mustang corridor is the battleground. Merrick ran 24.5% — Mazzei needs those Merrick voters to flip Canadian." },
  { county: "Washington", dPct: 50.1, mPct: 49.9, votes: 6800,  conf: 55, tier: "TOSS-UP",           note: "Bartlesville — nearly tied. Keating 17% is the swing. Mazzei must compete here." },
  { county: "Cleveland",  dPct: 52.4, mPct: 47.6, votes: 28000, conf: 74, tier: "LEAN DRUMMOND",     note: "Norman is Drummond's firewall. Mazzei needs Moore precincts (140100, 140114) to flip — both within 1 pt." },
  { county: "Oklahoma",   dPct: 56.2, mPct: 43.8, votes: 58000, conf: 88, tier: "DRUMMOND FIREWALL", note: "Drummond's biggest prize. Mazzei's only play is to limit losses — hold Inner OKC/South and hope Keating consolidation underperforms." },
];

const PRECINCTS: Record<string, { prec: string; area: string; d: number; m: number; k: number; votes: number; note: string }[]> = {
  "Rogers": [
    { prec: "660021", area: "Claremore-North (960 votes — largest)", d: 29.3, m: 33.4, k: 16.0, votes: 960, note: "Mazzei's most important precinct. Must hold +4 and grow it in the runoff." },
    { prec: "660030", area: "Claremore (632 votes)",                  d: 26.4, m: 39.9, k: 13.6, votes: 632, note: "Mazzei's strongest large precinct. Anchor — protect it." },
    { prec: "660018", area: "Claremore-North (608 votes)",            d: 25.8, m: 29.9, k: 16.6, votes: 608, note: "Mazzei +4.1 — Keating 16.6% is the risk. Drummond will target this." },
    { prec: "660020", area: "Claremore (560 votes)",                  d: 29.6, m: 31.6, k: 14.6, votes: 560, note: "Mazzei +2.0 — hold this Claremore precinct." },
    { prec: "660110", area: "Catoosa/SW Rogers (513 votes)",          d: 31.6, m: 30.4, k: 11.9, votes: 513, note: "Drummond +1.2 — Mazzei's flip target. Win Catoosa and win the county." },
    { prec: "660027", area: "NW Rogers/Owasso border (459 votes)",    d: 52.5, m: 13.1, k: 8.7,  votes: 459, note: "Drummond's anchor. He wins by +39 pts. Mazzei can't win this — just limit it." },
  ],
  "Grady": [
    { prec: "260041", area: "Chickasha (652 votes)", d: 19.2, m: 21.8, k: 18.4, votes: 652, note: "Mazzei +2.6 — Merrick 32.5%. Win the Merrick voters here and win Grady." },
    { prec: "260044", area: "Chickasha (606 votes)", d: 22.3, m: 21.8, k: 17.5, votes: 606, note: "Dead tie — Merrick 28.4%. Mazzei must win this." },
    { prec: "260038", area: "Chickasha (559 votes)", d: 17.7, m: 20.4, k: 16.5, votes: 559, note: "Mazzei +2.7 — Merrick 32.6%. Hold and grow." },
    { prec: "260037", area: "Chickasha (578 votes)", d: 20.6, m: 15.6, k: 16.4, votes: 578, note: "Drummond +5.0 — Merrick 39.6%. Mazzei's flip target. Win Merrick voters here." },
    { prec: "260040", area: "Chickasha (524 votes)", d: 18.9, m: 16.2, k: 11.3, votes: 524, note: "Drummond +2.7 — Merrick 47.5% dominated. Biggest swing precinct in Grady." },
  ],
  "Canadian": [
    { prec: "090216", area: "Mustang (714 votes — dead tie)",  d: 25.1, m: 25.2, k: 18.4, votes: 714, note: "Dead tie — biggest battleground precinct in county. Win this, win Canadian." },
    { prec: "090210", area: "Mustang (322 votes)",             d: 19.6, m: 20.2, k: 38.8, votes: 322, note: "Merrick 38.8% — highest in any county. Whoever wins Merrick voters wins this." },
    { prec: "090202", area: "Mustang (395 votes)",             d: 23.0, m: 23.5, k: 21.0, votes: 395, note: "Mazzei +0.5 — coin flip. Keating 21% is the risk." },
    { prec: "090507", area: "Yukon (800 votes — largest)",     d: 29.6, m: 21.5, k: 21.3, votes: 800, note: "Drummond +8.1 — his best large precinct. Mazzei must limit losses here." },
    { prec: "090504", area: "Yukon (659 votes)",               d: 19.9, m: 21.0, k: 23.5, votes: 659, note: "Mazzei +1.1 — Keating 23.5% and Merrick 27.5%. Mazzei's flip opportunity." },
  ],
  "Logan": [
    { prec: "420207", area: "Guthrie (747 votes — largest)", d: 19.5, m: 27.2, k: 17.0, votes: 747, note: "Mazzei's anchor — wins by +7.7 pts. Protect this at all costs." },
    { prec: "420104", area: "Guthrie (569 votes)",           d: 20.7, m: 29.9, k: 15.5, votes: 569, note: "Mazzei +9.2 — his strongest Guthrie precinct. Anchor." },
    { prec: "420107", area: "Guthrie (503 votes)",           d: 25.0, m: 28.2, k: 22.1, votes: 503, note: "Mazzei +3.2 — Keating 22.1% is the risk. Drummond will target this." },
    { prec: "420105", area: "Guthrie (474 votes)",           d: 23.2, m: 27.8, k: 21.7, votes: 474, note: "Mazzei +4.6 — Keating 21.7%. Hold this to hold Logan." },
    { prec: "420303", area: "Rural/North (585 votes)",       d: 19.7, m: 16.9, k: 19.3, votes: 585, note: "Drummond +2.7 — Merrick 30.4%. Mazzei's flip target in rural Logan." },
  ],
  "Cleveland": [
    { prec: "140100", area: "Moore (484 votes — dead tie)", d: 26.2, m: 26.4, k: 22.3, votes: 484, note: "Dead tie — Keating 22.3%. Win the Keating voters here and flip Moore." },
    { prec: "140114", area: "Moore (512 votes)",            d: 25.8, m: 26.6, k: 23.8, votes: 512, note: "Mazzei +0.8 — Keating 23.8%. Hold this." },
    { prec: "140102", area: "Moore (486 votes)",            d: 25.3, m: 28.0, k: 22.0, votes: 486, note: "Mazzei +2.7 — Keating 22%. Mazzei's best Moore precinct." },
    { prec: "140113", area: "Moore (658 votes — largest)",  d: 27.8, m: 25.5, k: 21.6, votes: 658, note: "Drummond +2.3 — must flip this to win Cleveland." },
    { prec: "140338", area: "Norman-South (391 votes)",     d: 27.9, m: 26.4, k: 19.7, votes: 391, note: "Drummond +1.5 — Norman is his firewall. Mazzei needs to compete here." },
  ],
};

const PATH_TO_WIN = [
  {
    priority: "1", color: accent,
    action: "Win the Merrick Vote in Grady and Canadian Counties",
    votes: "~29,000 swing votes",
    counties: "Grady (260037, 260040, 260041) · Canadian (090210, 090216)",
    detail: "Jake Merrick got 58,314 votes statewide — and he WON Grady County outright at 31.7%. Those voters are populist outsiders who didn't vote for Drummond OR Mazzei. In Grady's precinct 260040, Merrick got 47.5% of the vote. In Canadian's precinct 090210, Merrick got 38.8%. These voters are not natural Drummond voters — they ran away from the establishment candidate. Mazzei's Trump endorsement actually helps here: these are the voters who respond to the anti-establishment, change-agent message. Win them and you win both counties.",
  },
  {
    priority: "2", color: blue,
    action: "Consolidate McCall's SE Oklahoma Base",
    votes: "~30,000 votes",
    counties: "Pittsburg, Sequoyah, McCurtain, Pushmataha, Atoka, Johnston",
    detail: "Charles McCall got 47,501 votes statewide — and his base is concentrated in SE Oklahoma where he served as House Speaker. Atoka County went 69.4% McCall. Johnston went 62.5%. These voters are deeply familiar with McCall and trusted him. They are NOT Drummond voters — they're eastern Oklahoma conservatives who want a change from the status quo, and Drummond — the former AG — represents that establishment. Mazzei's coalition already includes this geography. The play is to reach McCall voters directly and make the case that Mazzei is the natural home for their vote.",
  },
  {
    priority: "3", color: purple,
    action: "Flip Rogers County — Win Claremore, Flip Catoosa",
    votes: "14,500-vote county, 3-vote primary margin",
    counties: "Rogers Co. (660021, 660110, 660018, 660030)",
    detail: "Rogers County was a 3-vote tie in the primary. Mazzei wins Claremore (precincts 660021, 660030, 660018) but Drummond owns the NW Rogers/Owasso border (660026, 660027) where he wins by 30–39 points. Mazzei's path: hold all Claremore precincts and flip the Catoosa/SW Rogers precincts (660110, 660130, 660128 — all within 1–4 pts of Drummond). Win Rogers County and it's a major psychological and numerical blow to Drummond.",
  },
  {
    priority: "4", color: green,
    action: "Hold Guthrie in Logan County Against the Keating Threat",
    votes: "7,500-vote county",
    counties: "Logan Co. (420207, 420107, 420105, 420104)",
    detail: "Mazzei leads Logan County by 161 votes. Drummond's only path here is to consolidate Keating voters in Guthrie — precincts 420107 and 420105 both had 21–22% Keating and Drummond is within 3–5 pts. If Keating voters in Guthrie break 65% for Drummond, he flips Logan. Mazzei needs to reach those Keating voters first with a message that resonates: Mazzei is the change candidate, Drummond is more of the same. The Keating voter who rejected the establishment brand in the primary can be persuaded to stay in the anti-Drummond column.",
  },
  {
    priority: "5", color: "#f87171",
    action: "Compete in Moore (Cleveland County) — Don't Cede It",
    votes: "28,000-vote county",
    counties: "Cleveland Co. (140100, 140114, 140102, 140113)",
    detail: "Cleveland County is Drummond's firewall — he leads by 2.4 pts. But Moore precincts 140100 and 140114 are dead ties (within 1 pt) with 22–24% Keating. If Mazzei can win the Keating vote in Moore, he flips those precincts and makes Cleveland competitive. Norman is harder — Drummond runs 28%+ there. But Moore alone has 3,000+ votes and it's a coin flip. Don't write off Cleveland County.",
  },
];

const TABS = ["Primary Prediction", "Runoff Forecast", "County Breakdown", "Path to Win"];

export default function MazzeiPitchDashboard() {
  const [, navigate] = useLocation();
  const [tab, setTab] = useState("Primary Prediction");
  const [selectedCounty, setSelectedCounty] = useState("Rogers");

  return (
    <div style={{ minHeight: "100vh", background: bg, color: textPrimary, fontFamily: "'Inter', sans-serif", paddingBottom: 60 }}>

      {/* Header */}
      <div style={{ background: surface, borderBottom: `1px solid ${border}`, padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <img src="/manus-storage/ea-logo_6e5af419.png" alt="Exact Audience" style={{ height: 22, objectFit: "contain" }} />
          <div style={{ width: 1, height: 28, background: border }} />
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: accent, letterSpacing: "-0.02em" }}>MIKE MAZZEI</div>
            <div style={{ fontSize: 11, color: textMuted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Oklahoma Governor · Runoff Strategy · August 25, 2026</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ padding: "6px 14px", background: "rgba(251,191,36,0.15)", border: "1px solid rgba(251,191,36,0.3)", borderRadius: 20, fontSize: 12, fontWeight: 700, color: gold }}>
            🇺🇸 TRUMP ENDORSED · EA PROJECTS 46.5%
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
                { label: "EA Forecast Accuracy", value: "98.7%",       color: green    },
                { label: "EA Predicted Gap",      value: "913 votes",   color: accent   },
                { label: "Actual Gap",            value: "1,158 votes", color: gold     },
                { label: "Off By",                value: "245 votes",   color: textMuted },
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
                { label: "Mazzei Projected",   value: "46.5%",   color: accent,     sub: "Trailing" },
                { label: "Drummond Projected", value: "53.5%",   color: gold,       sub: "Favorite" },
                { label: "Votes Up for Grabs", value: "193,171", color: blue,       sub: "From eliminated candidates" },
                { label: "Gap to Close",       value: "~25,000", color: "#f87171",  sub: "EA model" },
              ].map((s, i) => (
                <div key={i} style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: "20px 16px", textAlign: "center" }}>
                  <div style={{ fontSize: 30, fontWeight: 900, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 6 }}>{s.label}</div>
                  <div style={{ fontSize: 12, color: textSecondary, marginTop: 4 }}>{s.sub}</div>
                </div>
              ))}
            </div>

            {/* Trump endorsement analysis */}
            <div style={{ background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.25)", borderRadius: 12, padding: 24, marginBottom: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: gold, marginBottom: 12 }}>Trump's Endorsement — How It Played and What It Means for August</div>
              <div style={{ fontSize: 14, color: textSecondary, lineHeight: 1.8, marginBottom: 16 }}>Trump endorsed Mazzei before the primary. The honest read: <strong style={{ color: textPrimary }}>it helped consolidate the base but created a ceiling in the suburbs Mazzei needs most.</strong></div>
              {[
                { label: "Where It Helped", color: green, body: "The endorsement gave Mazzei instant credibility with the MAGA-aligned base in Tulsa, Wagoner, eastern Oklahoma, and SE Oklahoma. It likely kept him from finishing third — McCall had deep SE Oklahoma roots and could have eaten into that vote without the Trump signal. Mazzei consolidated his eastern coalition because of the endorsement." },
                { label: "Where It Created a Problem", color: "#f87171", body: "The suburban OKC precincts Mazzei needs — Edmond, Mustang, Yukon, Nichols Hills — are exactly where Trump's brand has been quietly eroding. These are college-educated, higher-income Republicans who split from Trump in 2020 and 2022. Keating ran 40–52% in those precincts. Those voters already showed they weren't voting for the Trump-endorsed candidate in the primary. The Trump label makes it harder to win them in the runoff." },
                { label: "The Runoff Strategy Implication", color: accent, body: "Mazzei can't un-ring the Trump bell — but he can reframe it. The message in the suburbs isn't 'Trump endorsed me.' It's 'I'm the change candidate. Drummond was the AG — he's the establishment. If you wanted something different, I'm the only option left.' The Merrick voters in Grady and Canadian (who ran away from the establishment) and the McCall voters in SE Oklahoma (who wanted a different kind of conservative) are reachable on that message — regardless of the Trump endorsement." },
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
                { name: "Chip Keating",   votes: "74,356", lean: "65% → Drummond",  net: "+22,000 net for Drummond", color: gold,   reason: "OKC suburb overlap, non-Trump conservative, same voter profile as Drummond. This is Mazzei's biggest problem." },
                { name: "Jake Merrick",   votes: "58,314", lean: "50/50 true swing", net: "Coin flip — Mazzei must win these", color: accent, reason: "Younger populist outsider voters in Canadian/Grady/Logan. Not natural Drummond voters. Mazzei's best opportunity." },
                { name: "Charles McCall", votes: "47,501", lean: "65% → Mazzei",    net: "+14,000 net for Mazzei",  color: purple, reason: "SE Oklahoma base overlaps with Mazzei's eastern OK coalition. These voters are already in his geography." },
              ].map((v, i) => (
                <div key={i} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: i < 2 ? `1px solid ${border}` : "none" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: textPrimary }}>{v.name} — {v.votes} votes</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: v.color }}>{v.net}</span>
                  </div>
                  <div style={{ fontSize: 13, color: textSecondary }}><span style={{ color: v.color, fontWeight: 600 }}>Leans: {v.lean} — </span>{v.reason}</div>
                </div>
              ))}
              <div style={{ marginTop: 16, padding: "12px 16px", background: "rgba(251,146,60,0.08)", borderRadius: 8, fontSize: 13, color: textSecondary, lineHeight: 1.6 }}>
                <strong style={{ color: accent }}>Net math: </strong>If Keating breaks 65/35 for Drummond and McCall breaks 65/35 for Mazzei, Drummond nets +22,000 and Mazzei nets +14,000 from those two pools. Merrick's 58,000 votes are the tiebreaker. Mazzei needs to win at least 55% of Merrick voters to close the gap. That means reaching Grady County, Canadian County's Mustang corridor, and Logan County's rural precincts — where Merrick ran 30–47%.
              </div>
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
                      {["County", "M Projected", "D Projected", "Est. Votes", "Confidence", "Tier"].map(h => (
                        <th key={h} style={{ padding: "12px 14px", textAlign: "left", color: textMuted, fontWeight: 600, textTransform: "uppercase", fontSize: 11, letterSpacing: "0.06em" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {COUNTIES.map((r, i) => (
                      <tr key={i} onClick={() => setSelectedCounty(r.county)} style={{ borderBottom: `1px solid ${border}20`, cursor: "pointer", background: selectedCounty === r.county ? `${accentDim}20` : "transparent", transition: "background 0.15s" }}>
                        <td style={{ padding: "11px 14px", fontWeight: 700, color: selectedCounty === r.county ? accent : textPrimary }}>{r.county}</td>
                        <td style={{ padding: "11px 14px", color: accent, fontWeight: 700 }}>{r.mPct.toFixed(1)}%</td>
                        <td style={{ padding: "11px 14px", color: gold, fontWeight: 700 }}>{r.dPct.toFixed(1)}%</td>
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
                            background: r.tier.includes("MAZZEI BASE") ? `${accentDim}40` : r.tier === "LEAN MAZZEI" ? `${accentDim}25` : r.tier === "TOSS-UP" ? "rgba(251,191,36,0.15)" : "rgba(245,158,11,0.15)",
                            color: r.tier.includes("MAZZEI") ? accent : r.tier === "TOSS-UP" ? "#fbbf24" : gold
                          }}>{r.tier}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {PRECINCTS[selectedCounty] ? (
              <div style={{ background: card, border: `1px solid ${accent}30`, borderRadius: 12, padding: 24 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: accent, marginBottom: 4 }}>{selectedCounty} County — Precinct Breakdown</div>
                <div style={{ fontSize: 12, color: textMuted, marginBottom: 18 }}>Click any county row above to drill down · Mazzei (M) · Drummond (D) · Keating (K)</div>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                    <thead>
                      <tr style={{ borderBottom: `1px solid ${border}` }}>
                        {["Precinct", "Area", "M%", "D%", "K%", "Votes", "Analysis"].map(h => (
                          <th key={h} style={{ padding: "8px 12px", textAlign: "left", color: textMuted, fontWeight: 600, textTransform: "uppercase", fontSize: 11 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {PRECINCTS[selectedCounty].map((p, i) => (
                        <tr key={i} style={{ borderBottom: `1px solid ${border}20` }}>
                          <td style={{ padding: "10px 12px", color: textPrimary, fontWeight: 700, fontSize: 12 }}>{p.prec}</td>
                          <td style={{ padding: "10px 12px", color: textSecondary, fontSize: 12 }}>{p.area}</td>
                          <td style={{ padding: "10px 12px", color: accent, fontWeight: 700 }}>{p.m.toFixed(1)}%</td>
                          <td style={{ padding: "10px 12px", color: gold, fontWeight: 700 }}>{p.d.toFixed(1)}%</td>
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
                Select Rogers, Grady, Canadian, Logan, or Cleveland County above to see precinct-level data
              </div>
            )}
          </div>
        )}

        {/* ── PATH TO WIN ── */}
        {tab === "Path to Win" && (
          <div>
            <div style={{ background: `linear-gradient(135deg, ${accentDim}30, transparent)`, border: `1px solid ${accent}30`, borderRadius: 14, padding: "24px 28px", marginBottom: 24 }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: accent, marginBottom: 8 }}>You're Down. The Votes to Win Are Right There.</div>
              <div style={{ fontSize: 14, color: textSecondary, lineHeight: 1.7 }}>EA projects Drummond wins 53.5% to 46.5% — but the math is not insurmountable. Mazzei needs to win the Merrick vote in Grady and Canadian, consolidate McCall's SE Oklahoma base, and flip Rogers County. If all three happen simultaneously, this race is 50/50. Here's the specific playbook.</div>
            </div>

            {PATH_TO_WIN.map((item, i) => (
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

            <div style={{ marginTop: 20, background: "rgba(251,146,60,0.06)", border: "1px solid rgba(251,146,60,0.25)", borderRadius: 10, padding: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: accent, marginBottom: 8 }}>The Honest Bottom Line</div>
              <div style={{ fontSize: 14, color: textSecondary, lineHeight: 1.7 }}>Mazzei's path requires three things to go right simultaneously: win the Merrick vote in Grady and Canadian, consolidate McCall's SE Oklahoma base, and flip Rogers County. If any one of those fails, Drummond wins by 6–8 points. If all three succeed, this race is within 2–3 points and genuinely competitive. The Merrick vote is the key — those 58,000 voters are the true swing of the entire runoff. Exact Audience can reach those specific households by name, on their TV, in the specific precincts where Merrick ran 30–47%, before August 25.</div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
