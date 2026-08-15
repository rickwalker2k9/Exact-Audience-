import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useTheme } from "@/contexts/ThemeContext";
import { Tn5InteractiveMap } from "@/components/Tn5InteractiveMap";

export const ELECTION_DATE = new Date("2026-11-03T06:00:00");

export function millisecondsUntilNextLocalDay(now: Date) {
  const next = new Date(now);
  next.setHours(24, 0, 1, 0);
  return Math.max(1, next.getTime() - now.getTime());
}

export function formatCurrentDate(now: Date) {
  return now.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });
}

export const MEDIA_PLANS = [
  { name: "Lean test & learn", total: 120000, detail: "A conservative first commitment that prioritizes measurement and local proof points.", allocation: [["CTV / Streaming", 36000], ["Online video", 30000], ["Meta", 18000], ["Programmatic", 18000], ["Search", 6000], ["CRM activation", 12000]] },
  { name: "Disciplined general plan", total: 240000, detail: "Illustrative 80-day plan at $3,000 average daily pacing. Recommended only after a line-by-line scope comparison with the current agency.", allocation: [["CTV / Streaming", 72000], ["Online video", 60000], ["Meta", 36000], ["Programmatic", 36000], ["Search", 12000], ["CRM activation", 24000]] },
  { name: "Robust paid-media plan", total: 360000, detail: "Adds room for county sequencing, creative rotation, and late-window reinforcement after performance review.", allocation: [["CTV / Streaming", 108000], ["Online video", 90000], ["Meta", 54000], ["Programmatic", 54000], ["Search", 18000], ["CRM activation", 36000]] },
] as const;

const CAPABILITIES = [
  { title: "Named audience segments", text: "Build approved addressable audiences from the current general-election voter file, consented campaign data, and county-level research—not a recycled Republican primary list." },
  { title: "County-level precision", text: "Sequence media by county, issue, delivery, and field context across the redrawn 17-county district. Each market gets a documented reason for its pacing." },
  { title: "Creative intelligence", text: "Match Hatcher’s farmer, veterinarian, business-builder, and former Agriculture Commissioner record to substantiated local proof points and counsel-approved creative." },
  { title: "Closed-loop reporting", text: "Review reach, frequency, delivery, web response, field activity, and creative approval weekly before reallocating spend." },
];

const EXECUTION_STEPS = [
  ["1", "Build", "Ingest a current voter file, define approved audiences and exclusions, confirm county priorities, and set measurement baselines."],
  ["2", "Prepare", "Develop source-backed creative, complete political-ad authorizations, and obtain counsel review before anything is activated."],
  ["3", "Launch", "Exact Audience manages CTV, online video, Meta, programmatic, search, and consented CRM activation within the approved plan."],
  ["4", "Optimize", "Review delivery and frequency weekly; reallocate only against documented results and campaign direction."],
] as const;

function useCountdown() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  const remaining = Math.max(0, ELECTION_DATE.getTime() - now);
  return {
    days: Math.floor(remaining / 86_400_000),
    hours: Math.floor((remaining % 86_400_000) / 3_600_000),
    minutes: Math.floor((remaining % 3_600_000) / 60_000),
  };
}

function useCurrentLocalDate() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    let timer: number;
    const scheduleRollover = () => {
      timer = window.setTimeout(() => {
        setNow(new Date());
        scheduleRollover();
      }, millisecondsUntilNextLocalDay(new Date()));
    };
    scheduleRollover();
    return () => window.clearTimeout(timer);
  }, []);
  return now;
}

function ScrollLink({ target, children }: { target: string; children: React.ReactNode }) {
  return <button onClick={() => document.getElementById(target)?.scrollIntoView({ behavior: "smooth", block: "start" })} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-semibold text-slate-300 transition hover:border-cyan-300/50 hover:text-white">{children}</button>;
}

export default function CharlieHatcherGeneralDashboard() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [selectedPlan, setSelectedPlan] = useState(1);
  const clock = useCountdown();
  const currentDate = useCurrentLocalDate();
  const plan = MEDIA_PLANS[selectedPlan];
  const todayLabel = formatCurrentDate(currentDate);

  const background = isDark ? "#070b19" : "#f5f8fc";
  const card = isDark ? "#0d1428" : "#ffffff";
  const ink = isDark ? "#eef5ff" : "#14213d";
  const muted = isDark ? "#9cadc8" : "#52627d";
  const border = isDark ? "rgba(148,163,184,.18)" : "rgba(30,41,59,.12)";

  return (
    <main style={{ minHeight: "100vh", background, color: ink, fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif" }}>
      <header style={{ position: "sticky", top: 0, zIndex: 20, background: isDark ? "rgba(7,11,25,.94)" : "rgba(245,248,252,.94)", backdropFilter: "blur(16px)", borderBottom: `1px solid ${border}` }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "14px 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Link href="/campaigns" style={{ color: muted, textDecoration: "none", fontSize: 12 }}>← Campaigns</Link>
              <span style={{ width: 1, height: 20, background: border }} />
              <div><div style={{ fontSize: 15, fontWeight: 900, color: ink }}>Charlie Hatcher for Congress</div><div style={{ fontSize: 10, color: muted, marginTop: 2 }}>TN-05 · General Election · Hatcher (R) vs. Molder (D)</div></div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <ScrollLink target="race">Race</ScrollLink><ScrollLink target="capabilities">Targeting</ScrollLink><ScrollLink target="district-map">District map</ScrollLink><ScrollLink target="execution">Ad execution</ScrollLink><ScrollLink target="media">Media plan</ScrollLink>
            </div>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "28px 24px 56px" }}>
        <section id="race" style={{ scrollMarginTop: 90, padding: "26px", borderRadius: 20, background: "linear-gradient(125deg,#10213f 0%,#0a1931 55%,#123044 100%)", color: "#f8fbff", border: "1px solid rgba(103,232,249,.25)", boxShadow: "0 28px 70px rgba(0,0,0,.22)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.4fr) minmax(260px,.6fr)", gap: 24, alignItems: "stretch" }}>
            <div>
              <div style={{ color: "#67e8f9", fontSize: 10, letterSpacing: ".16em", fontWeight: 800, textTransform: "uppercase", marginBottom: 10 }}>General-election race brief · updated {todayLabel}</div>
              <h1 style={{ margin: 0, fontSize: "clamp(27px,4vw,45px)", lineHeight: 1.04, letterSpacing: "-.035em" }}>A clear November plan for a new district and a well-funded opponent.</h1>
              <p style={{ color: "#b9c8dc", maxWidth: 690, fontSize: 14, lineHeight: 1.7, margin: "16px 0 0" }}>Charlie Hatcher won the Republican primary with 53.2% and advances to face Columbia Mayor Chaz Molder on Nov. 3. The redrawn district spans 17 counties, making disciplined local targeting, verifiable creative, and transparent media management more important than a generic primary playbook.</p>
              <div style={{ marginTop: 18, display: "flex", gap: 8, flexWrap: "wrap" }}><span className="rounded-full" style={{ background: "rgba(34,197,94,.16)", border: "1px solid rgba(74,222,128,.34)", padding: "6px 10px", color: "#bbf7d0", fontSize: 11, fontWeight: 700 }}>Primary complete</span><span style={{ background: "rgba(103,232,249,.10)", border: "1px solid rgba(103,232,249,.28)", padding: "6px 10px", color: "#cffafe", fontSize: 11, fontWeight: 700, borderRadius: 999 }}>November general election</span></div>
            </div>
            <div style={{ borderRadius: 16, padding: 18, background: "rgba(6,17,36,.58)", border: "1px solid rgba(255,255,255,.12)" }}>
              <div style={{ color: "#facc15", fontSize: 10, fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase" }}>Time to Nov. 3</div>
              <div style={{ display: "flex", gap: 12, marginTop: 14 }}>{[[clock.days,"days"],[clock.hours,"hrs"],[clock.minutes,"min"]].map(([value,label]) => <div key={String(label)}><div style={{ fontSize: 28, fontWeight: 900, fontVariantNumeric: "tabular-nums" }}>{String(value).padStart(2,"0")}</div><div style={{ color: "#9cadc8", fontSize: 9, textTransform: "uppercase", letterSpacing: ".08em" }}>{label}</div></div>)}</div>
              <div style={{ marginTop: 18, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,.1)", color: "#b9c8dc", fontSize: 11, lineHeight: 1.6 }}>Public FEC filing through July 17 shows Molder with approximately <strong style={{ color: "#f8fbff" }}>$1.48M cash on hand</strong>. Refresh this baseline when new filings arrive.</div>
            </div>
          </div>
        </section>

        <section style={{ marginTop: 18, display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr))", gap: 12 }}>
          {[["53.2%","Hatcher primary share","Reported Aug. 6 result","#6ee7b7"],["17","Counties","Middle TN to Memphis","#67e8f9"],["$1.48M","Molder cash on hand","Public FEC through Jul. 17","#facc15"],["$240K","Lean-plan illustration","Not a savings claim yet","#c4b5fd"]].map(([value,label,sub,color]) => <div key={label} style={{ background: card, border: `1px solid ${border}`, borderTop: `3px solid ${color}`, borderRadius: 14, padding: "15px 16px" }}><div style={{ color, fontWeight: 900, fontSize: 23 }}>{value}</div><div style={{ color: ink, fontWeight: 750, fontSize: 11, marginTop: 5 }}>{label}</div><div style={{ color: muted, fontSize: 10, marginTop: 4, lineHeight: 1.45 }}>{sub}</div></div>)}
        </section>

        <section id="capabilities" style={{ scrollMarginTop: 90, marginTop: 34 }}>
          <div style={{ display: "flex", alignItems: "end", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 14 }}><div><div style={{ color: "#0ea5e9", fontSize: 10, letterSpacing: ".14em", fontWeight: 800, textTransform: "uppercase" }}>What Exact Audience demonstrates</div><h2 style={{ margin: "6px 0 0", fontSize: 27, letterSpacing: "-.025em" }}>Granularity without clutter.</h2></div><p style={{ color: muted, fontSize: 12, maxWidth: 440, lineHeight: 1.6, margin: 0 }}>The point is not more dashboards. It is a documented workflow that shows exactly how audience, creative, and delivery decisions become granular.</p></div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr))", gap: 12 }}>{CAPABILITIES.map((item, index) => <article key={item.title} style={{ background: card, border: `1px solid ${border}`, borderRadius: 14, padding: 17 }}><div style={{ width: 28, height: 28, borderRadius: 8, display: "grid", placeItems: "center", background: "rgba(14,165,233,.13)", color: "#38bdf8", fontWeight: 900, fontSize: 12 }}>{String(index + 1).padStart(2,"0")}</div><h3 style={{ color: ink, margin: "13px 0 7px", fontSize: 13 }}>{item.title}</h3><p style={{ color: muted, fontSize: 11, lineHeight: 1.65, margin: 0 }}>{item.text}</p></article>)}</div>
        </section>

        <Tn5InteractiveMap card={card} ink={ink} muted={muted} border={border} isDark={isDark} />

        <section id="execution" style={{ scrollMarginTop: 90, marginTop: 34, display: "grid", gridTemplateColumns: "minmax(0,1.15fr) minmax(320px,.85fr)", gap: 16 }}>
          <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, padding: 20 }}><div style={{ color: "#0ea5e9", fontSize: 10, letterSpacing: ".14em", fontWeight: 800, textTransform: "uppercase" }}>Paid-ad execution</div><h2 style={{ margin: "7px 0 8px", fontSize: 25, letterSpacing: "-.025em" }}>We plan, launch, manage, and report the ads.</h2><p style={{ color: muted, fontSize: 12, lineHeight: 1.65, margin: "0 0 16px" }}>Exact Audience operates the paid workflow across CTV, online video, Meta, programmatic, search, and consented CRM activation. The campaign approves strategy, creative, budget ceiling, and compliance; each change is logged against a weekly report.</p><div style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 10 }}>{EXECUTION_STEPS.map(([number,title,text]) => <div key={number} style={{ background: isDark ? "#0a1020" : "#f6f9fd", border: `1px solid ${border}`, borderRadius: 12, padding: 14 }}><div style={{ color: "#38bdf8", fontSize: 11, fontWeight: 900 }}>{number}</div><div style={{ color: ink, fontSize: 12, fontWeight: 800, marginTop: 5 }}>{title}</div><div style={{ color: muted, fontSize: 10, lineHeight: 1.55, marginTop: 5 }}>{text}</div></div>)}</div></div>
          <aside style={{ background: "linear-gradient(145deg,#10213f,#13284a)", border: "1px solid rgba(103,232,249,.22)", borderRadius: 16, padding: 20, color: "#f8fbff" }}><div style={{ color: "#67e8f9", fontSize: 10, letterSpacing: ".14em", fontWeight: 800, textTransform: "uppercase" }}>What gets reported</div><h3 style={{ margin: "8px 0 13px", fontSize: 19 }}>A weekly operating view—not vanity metrics.</h3>{["Budget deployed versus approved cap","Reach and frequency by approved geography","Creative status and substantiation record","Web, field, and owned-channel response","Recommended next action with rationale"].map(item => <div key={item} style={{ padding: "9px 0", borderBottom: "1px solid rgba(255,255,255,.1)", color: "#cbd8e8", fontSize: 11, lineHeight: 1.5 }}>✓&nbsp;&nbsp;{item}</div>)}<p style={{ color: "#9cadc8", fontSize: 10, lineHeight: 1.55, margin: "15px 0 0" }}>Delivery and audience estimates require signed rate cards and platform reporting. No channel is presented as a guaranteed vote outcome.</p></aside>
        </section>

        <section id="media" style={{ scrollMarginTop: 90, marginTop: 34, background: card, border: `1px solid ${border}`, borderRadius: 16, padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: 16, flexWrap: "wrap" }}><div><div style={{ color: "#0ea5e9", fontSize: 10, letterSpacing: ".14em", fontWeight: 800, textTransform: "uppercase" }}>Decision-ready media scenarios</div><h2 style={{ margin: "7px 0 0", fontSize: 25, letterSpacing: "-.025em" }}>A lower-spend alternative, stated honestly.</h2></div><div style={{ color: muted, maxWidth: 420, fontSize: 11, lineHeight: 1.6 }}>The campaign’s agency proposal has not been supplied. These illustrative plans cannot be called “substantially less” until their total scope, fees, production, deliverables, and cancellation terms are compared line by line.</div></div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 10, marginTop: 18 }}>{MEDIA_PLANS.map((item,index) => <button key={item.name} onClick={() => setSelectedPlan(index)} style={{ textAlign: "left", cursor: "pointer", borderRadius: 12, padding: 15, background: selectedPlan === index ? "rgba(14,165,233,.11)" : isDark ? "#0a1020" : "#f6f9fd", border: `2px solid ${selectedPlan === index ? "#38bdf8" : border}`, color: ink }}><div style={{ color: selectedPlan === index ? "#38bdf8" : muted, fontSize: 10, textTransform: "uppercase", fontWeight: 800, letterSpacing: ".08em" }}>{index === 1 ? "Illustrative recommendation" : "Scenario"}</div><div style={{ fontSize: 25, fontWeight: 900, marginTop: 7 }}>${item.total.toLocaleString()}</div><div style={{ fontSize: 12, fontWeight: 800, marginTop: 4 }}>{item.name}</div></button>)}</div>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(280px,.7fr)", gap: 20, marginTop: 20, paddingTop: 20, borderTop: `1px solid ${border}` }}><div><h3 style={{ margin: 0, fontSize: 16 }}>${plan.total.toLocaleString()} · {plan.name}</h3><p style={{ color: muted, fontSize: 11, lineHeight: 1.65, margin: "7px 0 15px" }}>{plan.detail}</p><div style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 8 }}>{plan.allocation.map(([channel,budget]) => <div key={channel} style={{ padding: "10px 12px", background: isDark ? "#0a1020" : "#f6f9fd", border: `1px solid ${border}`, borderRadius: 9, display: "flex", justifyContent: "space-between", gap: 8 }}><span style={{ color: muted, fontSize: 11 }}>{channel}</span><strong style={{ color: ink, fontSize: 12 }}>${budget.toLocaleString()}</strong></div>)}</div></div><div style={{ borderLeft: `1px solid ${border}`, paddingLeft: 20 }}><div style={{ color: "#f59e0b", fontWeight: 900, fontSize: 11, textTransform: "uppercase", letterSpacing: ".08em" }}>Approval checklist</div>{["Agency scope and fees","Production costs","Rate-card estimates","Platform minimums","Legal and policy review","Measurement plan"].map(item => <div key={item} style={{ color: muted, fontSize: 11, marginTop: 10 }}>□&nbsp;&nbsp;{item}</div>)}</div></div>
        </section>

        <section style={{ marginTop: 34, padding: "18px 20px", borderRadius: 14, border: `1px solid ${border}`, color: muted, fontSize: 10, lineHeight: 1.65 }}><strong style={{ color: ink }}>Sources and guardrails.</strong> Public race and district context: Nashville Banner and Tennessee Lookout, Aug. 6–7, 2026. Campaign-finance figures: FEC candidate profiles for Chaz Molder (H6TN05397) and Charlie Hatcher (H6TN05405), coverage through July 17, 2026. Molder biography and issue framing are summarized from his campaign website and should be independently verified before use in paid creative. All political creative, audience activation, and media buying require campaign approval, applicable platform authorization, and legal/compliance review.</section>
      </div>
      <style>{`@media(max-width:800px){main section>div[style*="grid-template-columns"]{grid-template-columns:1fr !important}main section[style*="repeat(4"]{grid-template-columns:1fr 1fr !important}}@media(max-width:520px){main section[style*="repeat(4"]{grid-template-columns:1fr !important}}`}</style>
    </main>
  );
}
