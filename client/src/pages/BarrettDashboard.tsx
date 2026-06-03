/**
 * BarrettDashboard.tsx
 * Barrett Financial Group — SiteID.ai Visitor Identification Sales Demo
 * The pitch: 96.8% of barrettfinancial.com visitors leave without filling out a form.
 * SiteID identifies 58% of them (10,331/month) by name, address, income, and credit grade.
 * ROI: 10,331 × 2.1% close rate × $3,850 avg revenue = $835,450/month vs $4,800 SiteID cost = 174x ROI
 */

import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { getProfilesByDashboard } from "@/lib/buyerProfiles";
import {
  BARRETT_CLIENT, BARRETT_LIVE_BASE, BARRETT_DAILY_IMPRESSIONS,
  BARRETT_MEDIA_MIX, BARRETT_CTV_CHANNELS, BARRETT_CREATIVES,
  BARRETT_MOODS, BARRETT_VISITORS, BARRETT_SITE_PAGES,
  BARRETT_WEB_TRAFFIC, BARRETT_SEGMENT_STATS, BARRETT_ROI,
} from "@/lib/barrettData";
import { getNetworkLogo, getNetworkInitials } from "@/lib/networkLogos";

// ── Colors ────────────────────────────────────────────────────────────────────
const C = {
  bg:      "#06080f",
  bg2:     "#0b0f1c",
  bg3:     "#111827",
  card:    "#0f1629",
  card2:   "#141d35",
  border:  "#1e2d4a",
  accent:  "#1d4ed8",
  accent2: "#3b82f6",
  accent3: "#60a5fa",
  green:   "#22c55e",
  gold:    "#f59e0b",
  red:     "#ef4444",
  purple:  "#8b5cf6",
  white:   "#f1f5f9",
  muted:   "#94a3b8",
  headerBg:"linear-gradient(135deg,#06080f,#0d1a3a)",
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmt(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toLocaleString();
}
function fmtDollar(n: number) {
  if (n >= 1_000_000) return "$" + (n / 1_000_000).toFixed(2) + "M";
  if (n >= 1_000) return "$" + (n / 1_000).toFixed(0) + "K";
  return "$" + n.toLocaleString();
}
function useIsMobile() {
  const [m, setM] = useState(window.innerWidth < 768);
  useEffect(() => {
    const fn = () => setM(window.innerWidth < 768);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return m;
}
function useTick(base: number, step: number, interval = 9000) {
  const [v, setV] = useState(base);
  useEffect(() => {
    const id = setInterval(() => setV(x => x + step), interval);
    return () => clearInterval(id);
  }, [step, interval]);
  return v;
}
function useCountUp(target: number, duration = 1800) {
  const [val, setVal] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(target * ease));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  return val;
}

// ── Sub-components ────────────────────────────────────────────────────────────
function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20, ...style }}>
      {children}
    </div>
  );
}
function SectionTitle({ children, color }: { children: React.ReactNode; color?: string }) {
  return (
    <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ width: 3, height: 14, background: color ?? C.accent2, borderRadius: 2, display: "inline-block", flexShrink: 0 }} />
      {children}
    </div>
  );
}
function Bar2({ value, max, color }: { value: number; max: number; color?: string }) {
  return (
    <div style={{ background: C.bg3, borderRadius: 4, height: 6, overflow: "hidden" }}>
      <div style={{ width: `${Math.min(100, (value / max) * 100)}%`, background: color ?? C.accent2, height: "100%", borderRadius: 4, transition: "width 0.8s ease" }} />
    </div>
  );
}

// ── ANIMATED VISITOR FUNNEL HERO ──────────────────────────────────────────────
function FunnelHero({ mobile }: { mobile: boolean }) {
  const totalVisitors    = useCountUp(18400, 2000);
  const formFills        = useCountUp(588,   2200);
  const anonymous        = useCountUp(17812, 2100);
  const identified       = useCountUp(10331, 2400);
  const stillAnonymous   = useCountUp(7481,  2300);
  const liveIdentified   = useTick(10331, 1);

  const funnelSteps = [
    { label: "Monthly Website Visitors",       value: 18400,  pct: 100,  color: C.accent2,  desc: "Total unique visitors to barrettfinancial.com" },
    { label: "Fill Out a Form / Request Quote", value: 588,    pct: 3.2,  color: C.green,    desc: "Only 3.2% identify themselves — the rest leave anonymously" },
    { label: "Leave Without Any Action",        value: 17812,  pct: 96.8, color: C.red,      desc: "96.8% are invisible to your loan officers" },
    { label: "SiteID Identifies",               value: 10331,  pct: 58,   color: C.gold,     desc: "58% of anonymous visitors identified by name, address, income & credit" },
    { label: "Still Anonymous After SiteID",    value: 7481,   pct: 40.7, color: C.muted,    desc: "42% remain unidentified — the irreducible unknown" },
  ];

  // Breakdown of the 17,812 who leave
  const leaveBreakdown = [
    { label: "Bounced immediately (< 30s)",     value: 9568,  pct: 53.7, color: "#ef4444", desc: "Left before reading anything" },
    { label: "Engaged but did not convert",     value: 8244,  pct: 46.3, color: C.gold,   desc: "Read loan programs, reviews, contact page — then left. Highest-value targets." },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Hero Banner */}
      <div style={{
        background: "linear-gradient(135deg, #0d1a3a 0%, #0a1628 50%, #06080f 100%)",
        border: `1px solid ${C.border}`,
        borderRadius: 16,
        padding: mobile ? "24px 20px" : "36px 40px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Background glow */}
        <div style={{ position: "absolute", top: -60, right: -60, width: 300, height: 300, background: `radial-gradient(circle, ${C.accent}22 0%, transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -40, left: -40, width: 200, height: 200, background: `radial-gradient(circle, ${C.gold}11 0%, transparent 70%)`, pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ background: `${C.accent}22`, border: `1px solid ${C.accent}44`, borderRadius: 8, padding: "4px 12px", fontSize: 10, fontWeight: 700, color: C.accent3, letterSpacing: "0.1em", textTransform: "uppercase" }}>SiteID.ai — Visitor Intelligence</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 20, padding: "4px 10px", fontSize: 10, fontWeight: 700, color: C.green }}>
              <span style={{ width: 6, height: 6, background: C.green, borderRadius: "50%", animation: "blink 1.2s infinite" }} />
              Live
            </div>
          </div>
          <h1 style={{ fontSize: mobile ? 22 : 34, fontWeight: 900, color: C.white, lineHeight: 1.15, marginBottom: 12, letterSpacing: "-0.02em" }}>
            96.8% of your visitors leave<br />
            <span style={{ color: C.accent3 }}>without filling out a form.</span>
          </h1>
          <p style={{ fontSize: mobile ? 13 : 16, color: C.muted, lineHeight: 1.7, maxWidth: 640, marginBottom: 24 }}>
            Every month, <strong style={{ color: C.white }}>18,400 people</strong> visit barrettfinancial.com. Only <strong style={{ color: C.green }}>588 fill out a form</strong>. The other <strong style={{ color: C.red }}>17,812 leave anonymously</strong> — and your loan officers never know they were there.
            <br /><br />
            <strong style={{ color: C.gold }}>SiteID.ai identifies 10,331 of them</strong> by name, address, income, and credit grade — so your team can follow up before they sign with Rocket Mortgage.
          </p>

          {/* Live counter */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <div style={{ background: `${C.gold}18`, border: `1px solid ${C.gold}44`, borderRadius: 12, padding: "12px 20px", textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: C.gold, fontVariantNumeric: "tabular-nums" }}>{liveIdentified.toLocaleString()}</div>
              <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 2 }}>Identified This Month</div>
            </div>
            <div style={{ background: `${C.green}18`, border: `1px solid ${C.green}44`, borderRadius: 12, padding: "12px 20px", textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: C.green }}>58%</div>
              <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 2 }}>Identification Rate</div>
            </div>
            <div style={{ background: `${C.accent}18`, border: `1px solid ${C.accent}44`, borderRadius: 12, padding: "12px 20px", textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: C.accent3 }}>174x</div>
              <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 2 }}>Return on Investment</div>
            </div>
            <div style={{ background: `${C.red}18`, border: `1px solid ${C.red}44`, borderRadius: 12, padding: "12px 20px", textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: C.red }}>17,812</div>
              <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 2 }}>Leave Without a Form</div>
            </div>
          </div>
        </div>
      </div>

      {/* Animated Funnel */}
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 16 }}>
        <Card>
          <SectionTitle>Visitor Funnel — barrettfinancial.com</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {funnelSteps.map((step, i) => {
              const animated = [totalVisitors, formFills, anonymous, identified, stillAnonymous][i];
              const width = i === 0 ? 100 : i === 1 ? 3.2 : i === 2 ? 96.8 : i === 3 ? 58 : 40.7;
              return (
                <div key={step.label}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: C.white }}>{step.label}</div>
                      <div style={{ fontSize: 10, color: C.muted, marginTop: 1 }}>{step.desc}</div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 12 }}>
                      <div style={{ fontSize: 18, fontWeight: 900, color: step.color }}>{animated.toLocaleString()}</div>
                      <div style={{ fontSize: 10, color: C.muted }}>{step.pct}%</div>
                    </div>
                  </div>
                  <div style={{ background: C.bg3, borderRadius: 6, height: 10, overflow: "hidden" }}>
                    <div style={{
                      width: `${width}%`,
                      background: step.color,
                      height: "100%",
                      borderRadius: 6,
                      transition: "width 1.2s cubic-bezier(0.23,1,0.32,1)",
                      boxShadow: `0 0 8px ${step.color}66`,
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Who Leaves Breakdown */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card>
            <SectionTitle color={C.red}>Of the 17,812 Who Leave Without a Form...</SectionTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {leaveBreakdown.map(item => (
                <div key={item.label} style={{ background: C.bg3, borderRadius: 10, padding: "14px 16px", borderLeft: `3px solid ${item.color}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: C.white }}>{item.label}</div>
                      <div style={{ fontSize: 11, color: C.muted, marginTop: 3, lineHeight: 1.5 }}>{item.desc}</div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 12 }}>
                      <div style={{ fontSize: 22, fontWeight: 900, color: item.color }}>{item.value.toLocaleString()}</div>
                      <div style={{ fontSize: 10, color: C.muted }}>{item.pct}%</div>
                    </div>
                  </div>
                  <Bar2 value={item.pct} max={100} color={item.color} />
                </div>
              ))}
              <div style={{ background: `${C.gold}12`, border: `1px solid ${C.gold}33`, borderRadius: 10, padding: "12px 16px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.gold, marginBottom: 4 }}>The High-Value Target: 8,244 Engaged-But-Left</div>
                <div style={{ fontSize: 11, color: C.white, lineHeight: 1.6 }}>
                  These visitors read your loan programs, checked your reviews, and visited your contact page — then walked away. They are <strong style={{ color: C.gold }}>actively shopping for a mortgage</strong> and comparing you against Rocket Mortgage, LoanDepot, and Better.com. SiteID identifies them so your loan officers can reach out <em>before</em> they sign elsewhere.
                </div>
              </div>
            </div>
          </Card>

          {/* Pie chart of visitor outcomes */}
          <Card>
            <SectionTitle>Visitor Outcome Breakdown</SectionTitle>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={[
                    { name: "Form Fills (3.2%)",           value: 588,   fill: C.green  },
                    { name: "SiteID Identified (56.1%)",   value: 10331, fill: C.gold   },
                    { name: "Still Anonymous (40.7%)",     value: 7481,  fill: "#374151" },
                  ]}
                  cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                  paddingAngle={3} dataKey="value"
                >
                  {[C.green, C.gold, "#374151"].map((color, i) => <Cell key={i} fill={color} />)}
                </Pie>
                <Tooltip
                  contentStyle={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 8, color: C.white, fontSize: 11 }}
                  formatter={(v: number) => v.toLocaleString()}
                />
                <Legend wrapperStyle={{ fontSize: 10, color: C.muted }} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ── ROI CALCULATOR ────────────────────────────────────────────────────────────
function ROICalculator({ mobile }: { mobile: boolean }) {
  const [closeRate, setCloseRate] = useState(2.1);
  const [avgRevenue, setAvgRevenue] = useState(3850);
  const [siteIdCost] = useState(4800);

  const identified = 10331;
  const additionalLoans = Math.round(identified * (closeRate / 100));
  const additionalRevenue = additionalLoans * avgRevenue;
  const roi = Math.round(additionalRevenue / siteIdCost);
  const roiMultiple = (additionalRevenue / siteIdCost).toFixed(0);

  const roiAnimated = useCountUp(roi, 2000);
  const revenueAnimated = useCountUp(additionalRevenue, 2200);
  const loansAnimated = useCountUp(additionalLoans, 1800);

  const steps = [
    { label: "Identified Visitors / Month",  value: identified.toLocaleString(),    color: C.gold,   icon: "👤" },
    { label: "Close Rate on Identified",     value: `${closeRate}%`,                color: C.accent3,icon: "%" },
    { label: "Additional Loans / Month",     value: loansAnimated.toLocaleString(), color: C.green,  icon: "🏠" },
    { label: "Avg Revenue per Loan",         value: `$${avgRevenue.toLocaleString()}`, color: C.purple, icon: "$" },
    { label: "Additional Revenue / Month",   value: fmtDollar(revenueAnimated),     color: C.green,  icon: "💰" },
    { label: "SiteID Monthly Cost",          value: `$${siteIdCost.toLocaleString()}`, color: C.muted,  icon: "💳" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Big ROI number */}
      <div style={{
        background: "linear-gradient(135deg, #0d1a3a, #0a1628)",
        border: `1px solid ${C.border}`,
        borderRadius: 16,
        padding: mobile ? "24px 20px" : "32px 40px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 400, height: 400, background: `radial-gradient(circle, ${C.gold}08 0%, transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 8 }}>Return on Investment</div>
          <div style={{ fontSize: mobile ? 72 : 100, fontWeight: 900, color: C.gold, lineHeight: 1, letterSpacing: "-0.04em", fontVariantNumeric: "tabular-nums" }}>
            {roiAnimated.toLocaleString()}x
          </div>
          <div style={{ fontSize: mobile ? 14 : 18, color: C.white, marginTop: 8 }}>
            <span style={{ color: C.green, fontWeight: 800 }}>{fmtDollar(revenueAnimated)}/month</span>
            <span style={{ color: C.muted }}> additional revenue vs. </span>
            <span style={{ color: C.red, fontWeight: 800 }}>${siteIdCost.toLocaleString()}/month</span>
            <span style={{ color: C.muted }}> SiteID cost</span>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 16 }}>
        {/* Math breakdown */}
        <Card>
          <SectionTitle color={C.gold}>ROI Math</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {steps.map((s, i) => (
              <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: C.bg3, borderRadius: 10, borderLeft: `3px solid ${s.color}` }}>
                <div style={{ fontSize: 12, color: C.muted }}>{s.label}</div>
                <div style={{ fontSize: 16, fontWeight: 900, color: s.color }}>{s.value}</div>
              </div>
            ))}
            <div style={{ padding: "14px 16px", background: `${C.gold}15`, border: `1px solid ${C.gold}44`, borderRadius: 10, textAlign: "center" }}>
              <div style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>Net Additional Revenue After SiteID Cost</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: C.gold }}>{fmtDollar(revenueAnimated - siteIdCost)}/month</div>
              <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{fmtDollar((revenueAnimated - siteIdCost) * 12)}/year</div>
            </div>
          </div>
        </Card>

        {/* Interactive sliders */}
        <Card>
          <SectionTitle color={C.accent2}>Adjust Your Numbers</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: C.white, fontWeight: 600 }}>Close Rate on Identified Leads</span>
                <span style={{ fontSize: 14, fontWeight: 900, color: C.accent3 }}>{closeRate}%</span>
              </div>
              <input
                type="range" min={0.5} max={10} step={0.1} value={closeRate}
                onChange={e => setCloseRate(parseFloat(e.target.value))}
                style={{ width: "100%", accentColor: C.accent2, cursor: "pointer" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: C.muted, marginTop: 4 }}>
                <span>0.5%</span><span style={{ color: C.accent3 }}>Industry avg: 2.1%</span><span>10%</span>
              </div>
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: C.white, fontWeight: 600 }}>Avg Revenue per Loan</span>
                <span style={{ fontSize: 14, fontWeight: 900, color: C.purple }}>${avgRevenue.toLocaleString()}</span>
              </div>
              <input
                type="range" min={1000} max={10000} step={50} value={avgRevenue}
                onChange={e => setAvgRevenue(parseInt(e.target.value))}
                style={{ width: "100%", accentColor: C.purple, cursor: "pointer" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: C.muted, marginTop: 4 }}>
                <span>$1,000</span><span style={{ color: C.purple }}>Barrett avg: $3,850</span><span>$10,000</span>
              </div>
            </div>

            {/* Result cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div style={{ background: `${C.green}15`, border: `1px solid ${C.green}33`, borderRadius: 10, padding: "14px", textAlign: "center" }}>
                <div style={{ fontSize: 10, color: C.muted, marginBottom: 4 }}>Additional Loans/Mo</div>
                <div style={{ fontSize: 24, fontWeight: 900, color: C.green }}>{additionalLoans}</div>
              </div>
              <div style={{ background: `${C.gold}15`, border: `1px solid ${C.gold}33`, borderRadius: 10, padding: "14px", textAlign: "center" }}>
                <div style={{ fontSize: 10, color: C.muted, marginBottom: 4 }}>ROI Multiple</div>
                <div style={{ fontSize: 24, fontWeight: 900, color: C.gold }}>{roiMultiple}x</div>
              </div>
            </div>

            <div style={{ background: C.bg3, borderRadius: 10, padding: "12px 14px", fontSize: 11, color: C.muted, lineHeight: 1.6 }}>
              Barrett Financial closes <strong style={{ color: C.white }}>3,000+ loans/month</strong>. Even a <strong style={{ color: C.green }}>0.5% close rate</strong> on SiteID-identified visitors yields <strong style={{ color: C.green }}>{Math.round(10331 * 0.005)} additional loans/month</strong> — {fmtDollar(Math.round(10331 * 0.005) * avgRevenue)} in additional revenue vs. ${siteIdCost.toLocaleString()} SiteID cost.
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ── LIVE VISITOR FEED ─────────────────────────────────────────────────────────
function LiveVisitorFeed({ mobile }: { mobile: boolean }) {
  const [idx, setIdx] = useState(0);
  const [fade, setFade] = useState(true);
  const [visitorLog, setVisitorLog] = useState<Array<{ name: string; city: string; mood: string; time: string; credit: string; income: string }>>([]);

  useEffect(() => {
    const id = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        const nextIdx = (idx + 1) % BARRETT_VISITORS.length;
        setIdx(nextIdx);
        setFade(true);
        const v = BARRETT_VISITORS[nextIdx];
        setVisitorLog(prev => [{
          name: `${v.first} ${v.last}`,
          city: v.city,
          mood: v.mood,
          time: "just now",
          credit: v.credit,
          income: v.income,
        }, ...prev].slice(0, 8));
      }, 400);
    }, 3500);
    return () => clearInterval(id);
  }, [idx]);

  const v = BARRETT_VISITORS[idx];
  const creditColor = (c: string) => c.startsWith("A") ? C.green : c.startsWith("B") ? C.gold : C.muted;
  const moodColor = (m: string) => {
    if (m.includes("Jumbo")) return C.purple;
    if (m.includes("Move-Up")) return C.accent2;
    if (m.includes("First")) return C.green;
    if (m.includes("Refin")) return C.gold;
    if (m.includes("VA")) return "#f97316";
    return C.muted;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Header stats */}
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr 1fr" : "repeat(4,1fr)", gap: 12 }}>
        {[
          { label: "Identified Today",    value: "356",    sub: "58% of today's visitors",   color: C.gold   },
          { label: "Avg Income",          value: "$128K",  sub: "Identified visitor avg",     color: C.green  },
          { label: "A / A+ Credit",       value: "68%",    sub: "Of identified visitors",     color: C.accent3},
          { label: "With Phone + Email",  value: "9,140",  sub: "Reachable contacts",         color: C.purple },
        ].map(s => (
          <div key={s.label} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px 18px", borderTop: `3px solid ${s.color}` }}>
            <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 10, color: C.muted, marginTop: 4 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 16 }}>
        {/* Live spotlight card */}
        <Card style={{ borderLeft: `3px solid ${C.green}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <span style={{ width: 8, height: 8, background: C.green, borderRadius: "50%", boxShadow: `0 0 8px ${C.green}`, animation: "blink 1.2s infinite", flexShrink: 0 }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: C.green, textTransform: "uppercase", letterSpacing: "0.1em" }}>SiteID — Live Identification</span>
          </div>
          <div style={{ opacity: fade ? 1 : 0, transition: "opacity 0.4s ease" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <div style={{ width: 52, height: 52, borderRadius: "50%", background: `${C.accent}33`, border: `2px solid ${C.accent}66`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 900, color: C.accent3, flexShrink: 0 }}>
                {v.first[0]}{v.last[0]}
              </div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 900, color: C.white }}>{v.first} {v.last}</div>
                <div style={{ fontSize: 12, color: C.muted }}>{v.city} · {v.time}</div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
              {[
                ["Job Title",   v.job],
                ["Company",     v.company],
                ["Income",      v.income],
                ["Net Worth",   v.networth],
                ["Credit Grade",v.credit],
                ["Intent Score",String(v.score) + "/100"],
              ].map(([k, val]) => (
                <div key={k} style={{ background: C.bg3, borderRadius: 8, padding: "8px 12px" }}>
                  <div style={{ fontSize: 9, color: C.muted, marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.08em" }}>{k}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: k === "Credit Grade" ? creditColor(val) : C.white }}>{val}</div>
                </div>
              ))}
            </div>
            <div style={{ background: `${moodColor(v.mood)}18`, border: `1px solid ${moodColor(v.mood)}44`, borderRadius: 8, padding: "8px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Loan Intent</span>
              <span style={{ fontSize: 13, fontWeight: 800, color: moodColor(v.mood) }}>{v.mood}</span>
            </div>
          </div>
        </Card>

        {/* Visitor log */}
        <Card>
          <SectionTitle>Recent Identifications</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {BARRETT_VISITORS.slice(0, 8).map((vis, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "8px 12px", borderRadius: 8,
                background: i === 0 ? `${C.green}10` : C.bg3,
                border: `1px solid ${i === 0 ? C.green + "33" : C.border}`,
                transition: "all 0.3s",
              }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: `${C.accent}22`, border: `1px solid ${C.accent}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: C.accent3, flexShrink: 0 }}>
                  {vis.first[0]}{vis.last[0]}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.white, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{vis.first} {vis.last}</div>
                  <div style={{ fontSize: 10, color: C.muted }}>{vis.city} · {vis.income}</div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: creditColor(vis.credit), background: `${creditColor(vis.credit)}18`, padding: "2px 7px", borderRadius: 20 }}>{vis.credit}</div>
                  <div style={{ fontSize: 9, color: C.muted, marginTop: 2 }}>{vis.time}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Full visitor table */}
      <Card>
        <SectionTitle>All Identified Visitors — This Month</SectionTitle>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, minWidth: 700 }}>
            <thead>
              <tr style={{ background: C.card2 }}>
                {["Name","City","Income","Net Worth","Credit","Job","Company","Loan Intent","Score"].map(h => (
                  <th key={h} style={{ padding: "9px 10px", textAlign: "left", color: C.muted, fontWeight: 700, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap", borderBottom: `1px solid ${C.border}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {BARRETT_VISITORS.map((vis, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? C.card : C.card2, transition: "background 0.12s" }}
                  onMouseEnter={e => (e.currentTarget.style.background = `${C.accent}18`)}
                  onMouseLeave={e => (e.currentTarget.style.background = i % 2 === 0 ? C.card : C.card2)}>
                  <td style={{ padding: "8px 10px", color: C.white, fontWeight: 600, whiteSpace: "nowrap" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: `${C.accent}22`, border: `1px solid ${C.accent}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, color: C.accent3, flexShrink: 0 }}>{vis.first[0]}{vis.last[0]}</div>
                      {vis.first} {vis.last}
                    </div>
                  </td>
                  <td style={{ padding: "8px 10px", color: C.muted }}>{vis.city}</td>
                  <td style={{ padding: "8px 10px", color: C.white, whiteSpace: "nowrap" }}>{vis.income}</td>
                  <td style={{ padding: "8px 10px", color: C.muted, whiteSpace: "nowrap" }}>{vis.networth}</td>
                  <td style={{ padding: "8px 10px" }}>
                    <span style={{ background: `${creditColor(vis.credit)}22`, color: creditColor(vis.credit), padding: "2px 8px", borderRadius: 20, fontSize: 10, fontWeight: 800 }}>{vis.credit}</span>
                  </td>
                  <td style={{ padding: "8px 10px", color: C.muted, whiteSpace: "nowrap" }}>{vis.job}</td>
                  <td style={{ padding: "8px 10px", color: C.muted, whiteSpace: "nowrap" }}>{vis.company}</td>
                  <td style={{ padding: "8px 10px" }}>
                    <span style={{ background: `${moodColor(vis.mood)}18`, color: moodColor(vis.mood), padding: "2px 8px", borderRadius: 20, fontSize: 10, fontWeight: 700 }}>{vis.mood}</span>
                  </td>
                  <td style={{ padding: "8px 10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ flex: 1, height: 4, background: C.border, borderRadius: 2, minWidth: 40 }}>
                        <div style={{ height: "100%", width: `${vis.score}%`, background: vis.score >= 90 ? C.green : vis.score >= 80 ? C.gold : C.accent2, borderRadius: 2 }} />
                      </div>
                      <span style={{ color: C.white, fontSize: 10, fontWeight: 700 }}>{vis.score}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ── BUYER JOURNEYS (People Tab) ───────────────────────────────────────────────
function BuyerJourneys({ mobile }: { mobile: boolean }) {
  const [, navigate] = useLocation();
  const profiles = getProfilesByDashboard("barrett-financial");
  const [activeProfile, setActiveProfile] = useState<string | null>(null);

  const channelColor = (ch: string) => {
    if (ch.includes("Google")) return "#4285F4";
    if (ch.includes("Meta") || ch.includes("Facebook")) return "#1877F2";
    if (ch.includes("SiteID")) return C.gold;
    if (ch.includes("Zillow")) return "#006AFF";
    if (ch.includes("Rocket")) return "#e63946";
    if (ch.includes("LoanDepot") || ch.includes("loandepot")) return "#f97316";
    if (ch.includes("Better")) return "#10b981";
    if (ch.includes("Veterans")) return "#8b5cf6";
    if (ch.includes("Chase")) return "#003087";
    if (ch.includes("Wells")) return "#d4a017";
    if (ch.includes("Direct") || ch.includes("barrettfinancial")) return C.accent2;
    return C.muted;
  };

  const siteLabel = (site: string) => {
    if (site === "barrettfinancial.com") return "Barrett Financial";
    if (site === "rocketmortgage.com") return "Rocket Mortgage";
    if (site === "loandepot.com") return "LoanDepot";
    if (site === "better.com") return "Better.com";
    if (site === "veteransunited.com") return "Veterans United";
    if (site === "wellsfargo.com") return "Wells Fargo";
    if (site === "chase.com") return "Chase";
    return site;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Intro */}
      <div style={{ background: `${C.accent}12`, border: `1px solid ${C.accent}33`, borderRadius: 12, padding: "16px 20px" }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: C.white, marginBottom: 6 }}>Lead Profiles — SiteID-Identified Mortgage Shoppers</div>
        <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.7 }}>
          These are real people who visited barrettfinancial.com, spent time researching loan programs, visited competitor sites, and <strong style={{ color: C.red }}>never filled out a form</strong>. SiteID identified them by name, address, income, and credit grade. Each profile shows their full 30-day research journey.
        </div>
      </div>

      {/* Profile cards */}
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "repeat(3,1fr)", gap: 16 }}>
        {profiles.map(profile => (
          <div
            key={profile.id}
            onClick={() => navigate(`/buyer/${profile.id}`)}
            style={{
              background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20,
              cursor: "pointer", transition: "all 0.18s ease", borderTop: `3px solid ${profile.avatarColor}`,
            }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = "translateY(-3px)"; el.style.boxShadow = `0 8px 28px ${profile.avatarColor}22`; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = "translateY(0)"; el.style.boxShadow = "none"; }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: profile.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 900, color: "#fff", flexShrink: 0, boxShadow: `0 0 14px ${profile.avatarColor}44` }}>{profile.avatar}</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: C.white }}>{profile.name}</div>
                <div style={{ fontSize: 11, color: C.muted }}>{profile.age} · {profile.occupation}</div>
              </div>
            </div>
            <div style={{ fontSize: 11, color: C.muted, marginBottom: 10 }}>📍 {profile.location}</div>
            <div style={{ background: `${profile.avatarColor}15`, border: `1px solid ${profile.avatarColor}33`, borderRadius: 8, padding: "8px 12px", marginBottom: 12 }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: profile.avatarColor, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 3 }}>Buyer DNA</div>
              <div style={{ fontSize: 11, color: C.white, lineHeight: 1.5 }}>{profile.buyerDNA}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6, marginBottom: 12 }}>
              {profile.purchaseWindows.map((pw, i) => (
                <div key={pw.window} style={{ background: C.card2, borderRadius: 8, padding: "8px 6px", textAlign: "center" }}>
                  <div style={{ fontSize: 16, fontWeight: 900, color: [C.green, C.gold, C.accent3][i] }}>{pw.probability}%</div>
                  <div style={{ fontSize: 9, color: C.muted, lineHeight: 1.3 }}>{pw.window}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 12 }}>
              {profile.tags.slice(0, 3).map(tag => (
                <span key={tag} style={{ background: `${profile.avatarColor}15`, border: `1px solid ${profile.avatarColor}33`, color: profile.avatarColor, fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 20 }}>{tag}</span>
              ))}
            </div>
            <div style={{ fontSize: 10, fontWeight: 700, color: profile.avatarColor, textTransform: "uppercase", letterSpacing: "0.08em" }}>View Full Journey →</div>
          </div>
        ))}
      </div>

      {/* Inline journey timeline for quick view */}
      <Card>
        <SectionTitle>30-Day Research Journey — Michael Thornton (Move-Up Buyer, $720K Jumbo)</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {profiles[0]?.signals.map((sig, i) => {
            const isBarrett = sig.channel.toLowerCase().includes("barrett") || sig.detail.toLowerCase().includes("barrettfinancial");
            const isSiteId = sig.channel === "SiteID.ai";
            const isCompetitor = sig.channel.includes("Rocket") || sig.channel.includes("LoanDepot") || sig.channel.includes("Wells") || sig.channel.includes("Chase");
            return (
              <div key={i} style={{ display: "flex", gap: 14, paddingBottom: i < (profiles[0]?.signals.length ?? 0) - 1 ? 0 : 0 }}>
                {/* Timeline line */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                  <div style={{
                    width: 12, height: 12, borderRadius: "50%", flexShrink: 0, marginTop: 10,
                    background: isSiteId ? C.gold : isBarrett ? C.accent2 : isCompetitor ? C.red : C.muted,
                    boxShadow: isSiteId ? `0 0 8px ${C.gold}` : isBarrett ? `0 0 6px ${C.accent2}` : "none",
                  }} />
                  {i < (profiles[0]?.signals.length ?? 0) - 1 && (
                    <div style={{ width: 1, flex: 1, background: C.border, minHeight: 20 }} />
                  )}
                </div>
                <div style={{ paddingBottom: 12, flex: 1 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginTop: 6 }}>
                    <span style={{ fontSize: 10, color: C.muted, fontWeight: 600, whiteSpace: "nowrap" }}>{sig.date}</span>
                    <span style={{
                      fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 20,
                      background: isSiteId ? `${C.gold}22` : isBarrett ? `${C.accent}22` : isCompetitor ? `${C.red}22` : `${C.muted}22`,
                      color: isSiteId ? C.gold : isBarrett ? C.accent3 : isCompetitor ? C.red : C.muted,
                    }}>{sig.channel}</span>
                  </div>
                  <div style={{ fontSize: 12, color: C.white, marginTop: 3, lineHeight: 1.5 }}>{sig.detail}</div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

// ── WEB TRAFFIC TAB ───────────────────────────────────────────────────────────
function WebTrafficTab({ mobile }: { mobile: boolean }) {
  const wt = BARRETT_WEB_TRAFFIC;
  const srcData = Object.entries(wt.trafficSources).map(([name, value], i) => ({
    name, value, color: [C.accent2, "#1877F2", C.gold, C.green, C.purple, C.muted][i],
  }));
  const trendData = wt.visitsTrend.map((v, i) => ({ month: wt.visitsDates[i], visits: v }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr 1fr" : "repeat(4,1fr)", gap: 12 }}>
        {[
          { label: "Monthly Visitors",    value: "18,400",  sub: "↑ 7.2% vs last month",  color: C.accent2 },
          { label: "Bounce Rate",         value: "52.3%",   sub: "Industry avg: 58%",      color: C.gold    },
          { label: "Organic Search",      value: "52%",     sub: "of all traffic",         color: C.green   },
          { label: "Global Rank",         value: "#284,200",sub: "Mortgage broker niche",  color: C.purple  },
        ].map(s => (
          <div key={s.label} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px 18px", borderTop: `3px solid ${s.color}` }}>
            <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 10, color: C.muted, marginTop: 4 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "2fr 1fr", gap: 16 }}>
        <Card>
          <SectionTitle>Monthly Visitor Trend</SectionTitle>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="bfGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.accent2} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={C.accent2} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="month" tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => fmt(v)} />
              <Tooltip contentStyle={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 8, color: C.white, fontSize: 11 }} formatter={(v: number) => v.toLocaleString()} />
              <Area type="monotone" dataKey="visits" stroke={C.accent2} fill="url(#bfGrad)" strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <SectionTitle>Traffic Sources</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {srcData.map(s => (
              <div key={s.name}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: C.white, fontWeight: 600 }}>{s.name}</span>
                  <span style={{ fontSize: 12, color: s.color, fontWeight: 700 }}>{s.value}%</span>
                </div>
                <Bar2 value={s.value} max={100} color={s.color} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Keywords */}
      <Card>
        <SectionTitle>Top Organic Keywords</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "repeat(3,1fr)", gap: 10 }}>
          {wt.topKeywords?.map(kw => (
            <div key={kw.keyword} style={{ background: C.bg3, borderRadius: 8, padding: "10px 14px", border: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.white }}>{kw.keyword}</div>
                <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>Vol: {kw.volume} · Pos #{kw.position}</div>
              </div>
              <span style={{ fontSize: 18, color: kw.trend === "up" ? C.green : kw.trend === "down" ? C.red : C.gold }}>
                {kw.trend === "up" ? "↑" : kw.trend === "down" ? "↓" : "→"}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Site Pages */}
      <Card>
        <SectionTitle>Top Site Pages</SectionTitle>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ background: C.card2 }}>
                {["Page","Monthly Views","Avg Time","Bounce Rate","SiteID Value"].map(h => (
                  <th key={h} style={{ padding: "9px 12px", textAlign: "left", color: C.muted, fontWeight: 700, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: `1px solid ${C.border}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {BARRETT_SITE_PAGES.map((p, i) => (
                <tr key={p.label} style={{ background: i % 2 === 0 ? C.card : C.card2 }}>
                  <td style={{ padding: "9px 12px", color: C.white, fontWeight: 600 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: p.color, flexShrink: 0 }} />
                      {p.label}
                    </div>
                  </td>
                  <td style={{ padding: "9px 12px", color: C.white }}>{p.views.toLocaleString()}</td>
                  <td style={{ padding: "9px 12px", color: C.muted }}>{p.avgTime}</td>
                  <td style={{ padding: "9px 12px" }}>
                    <span style={{ color: p.bounce < 30 ? C.green : p.bounce < 45 ? C.gold : C.muted }}>{p.bounce}%</span>
                  </td>
                  <td style={{ padding: "9px 12px" }}>
                    <span style={{ fontSize: 10, color: p.bounce < 30 ? C.green : C.gold, background: p.bounce < 30 ? `${C.green}18` : `${C.gold}18`, padding: "2px 8px", borderRadius: 20, fontWeight: 700 }}>
                      {p.bounce < 30 ? "High Intent" : p.bounce < 45 ? "Medium Intent" : "Research"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: 14, padding: "12px 14px", background: C.bg3, borderRadius: 8, fontSize: 11, color: C.muted, lineHeight: 1.6 }}>
          <strong style={{ color: C.white }}>SiteID Insight:</strong> {wt.trafficSplitNote}
        </div>
      </Card>
    </div>
  );
}

// ── CHANNELS TAB ──────────────────────────────────────────────────────────────
function ChannelsTab({ mobile }: { mobile: boolean }) {
  const [sort, setSort] = useState<"audienceScore" | "cpm" | "completionRate">("audienceScore");
  const sorted = [...BARRETT_CTV_CHANNELS].sort((a, b) => {
    if (sort === "audienceScore") return (b.audienceScore ?? 0) - (a.audienceScore ?? 0);
    if (sort === "cpm") return a.cpm - b.cpm;
    return b.completionRate - a.completionRate;
  });

  const mediaPieData = BARRETT_MEDIA_MIX.map(m => ({ name: m.channel, value: m.spend, fill: m.color }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Active channels */}
      <Card>
        <SectionTitle color={C.green}>Active Channels — Current Media Mix</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr 1fr" : "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
          {BARRETT_MEDIA_MIX.map(m => (
            <div key={m.channel} style={{ background: C.bg3, borderRadius: 10, padding: "14px 16px", borderTop: `3px solid ${m.color}` }}>
              <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{m.channel}</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: m.color }}>{m.pct}%</div>
              <div style={{ fontSize: 12, color: C.white, fontWeight: 600, marginTop: 2 }}>${m.spend.toLocaleString()}/mo</div>
              <div style={{ fontSize: 10, color: C.muted, marginTop: 4 }}>{fmt(m.impressions)} impressions</div>
              <Bar2 value={m.pct} max={50} color={m.color} />
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 16 }}>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={mediaPieData} cx="50%" cy="50%" outerRadius={80} paddingAngle={3} dataKey="value">
                {mediaPieData.map((d, i) => <Cell key={i} fill={d.fill} />)}
              </Pie>
              <Tooltip contentStyle={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 8, color: C.white, fontSize: 11 }} formatter={(v: number) => `$${v.toLocaleString()}`} />
              <Legend wrapperStyle={{ fontSize: 10, color: C.muted }} />
            </PieChart>
          </ResponsiveContainer>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={BARRETT_MEDIA_MIX} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} horizontal={false} />
              <XAxis type="number" tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
              <YAxis dataKey="channel" type="category" tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} width={120} />
              <Tooltip contentStyle={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 8, color: C.white, fontSize: 11 }} formatter={(v: number) => `$${v.toLocaleString()}`} />
              <Bar dataKey="spend" radius={[0, 4, 4, 0]}>
                {BARRETT_MEDIA_MIX.map((m, i) => <Cell key={i} fill={m.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* CTV Recommendation */}
      <Card>
        <div style={{ marginBottom: 14, padding: "12px 16px", borderRadius: 8, background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.3)", fontSize: 12, color: C.muted, lineHeight: 1.6 }}>
          <span style={{ color: C.accent3, fontWeight: 700 }}>CTV Recommendation</span> — Barrett Financial has not yet activated CTV/OTT advertising. The channels below represent the <strong style={{ color: C.white }}>recommended inventory</strong> for a future CTV buy targeting homebuyers, refinancers, and mortgage shoppers in Arizona. HGTV and Fox Business are the top-priority placements based on audience intent score.
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
          <SectionTitle>CTV Streaming — Recommended Channels</SectionTitle>
          <div style={{ display: "flex", gap: 8 }}>
            {(["audienceScore","cpm","completionRate"] as const).map(k => (
              <button key={k} onClick={() => setSort(k)} style={{
                padding: "4px 12px", borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: "pointer",
                background: sort === k ? C.accent : C.bg3,
                color: sort === k ? "#fff" : C.muted,
                border: `1px solid ${sort === k ? C.accent : C.border}`,
              }}>
                {k === "audienceScore" ? "Audience Score" : k === "cpm" ? "CPM" : "Completion"}
              </button>
            ))}
          </div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, minWidth: 640 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                {["Channel","Audience Score","Est. Reach","CPM","VCR","Why This Platform"].map(h => (
                  <th key={h} style={{ padding: "8px 10px", textAlign: h === "Channel" || h === "Why This Platform" ? "left" : "right", color: C.muted, fontWeight: 600, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((ch, i) => {
                const score = ch.audienceScore ?? 0;
                const scoreColor = score >= 90 ? C.green : score >= 80 ? C.gold : C.accent3;
                const logoUrl = getNetworkLogo(ch.name);
                const initials = getNetworkInitials(ch.name);
                return (
                  <tr key={ch.name} style={{ borderBottom: `1px solid ${C.border}`, background: i % 2 === 0 ? "transparent" : C.bg3 }}>
                    <td style={{ padding: "9px 10px", color: C.white, fontWeight: 600, whiteSpace: "nowrap" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                        {logoUrl ? (
                          <img src={logoUrl} alt={ch.name} width={24} height={24} style={{ borderRadius: 5, objectFit: "contain", background: "#fff", padding: 2, flexShrink: 0 }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                        ) : (
                          <span style={{ width: 24, height: 24, borderRadius: 5, background: ch.color, flexShrink: 0, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 800, color: "#fff" }}>{initials}</span>
                        )}
                        {ch.name}
                      </span>
                    </td>
                    <td style={{ padding: "9px 10px", textAlign: "right" }}>
                      <span style={{ background: `${scoreColor}22`, color: scoreColor, fontWeight: 700, padding: "2px 8px", borderRadius: 4 }}>{score}/100</span>
                    </td>
                    <td style={{ padding: "9px 10px", textAlign: "right", color: C.white }}>{ch.estReach ? fmt(ch.estReach) : "—"}</td>
                    <td style={{ padding: "9px 10px", textAlign: "right", color: C.gold }}>${ch.cpm.toFixed(2)}</td>
                    <td style={{ padding: "9px 10px", textAlign: "right" }}>
                      <span style={{ color: ch.completionRate >= 90 ? C.green : ch.completionRate >= 80 ? C.gold : C.accent3, fontWeight: 700 }}>{ch.completionRate.toFixed(1)}%</span>
                    </td>
                    <td style={{ padding: "9px 10px", color: C.muted, fontSize: 11 }}>{ch.note ?? "—"}</td>
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

// ── AUDIENCE SEGMENTS TAB ─────────────────────────────────────────────────────
function AudienceTab({ mobile }: { mobile: boolean }) {
  const stats = BARRETT_SEGMENT_STATS;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: 12 }}>
        {[
          { label: "Identified This Month", value: stats.totalList.toLocaleString(), sub: "58% identification rate", color: C.gold    },
          { label: "Avg Household Income",  value: stats.avgIncomeLabel,             sub: "Identified visitor avg",  color: C.green   },
          { label: "Avg Net Worth",         value: stats.netWorthLabel,              sub: "Identified visitor avg",  color: C.accent3 },
          { label: "Credit Grade",          value: stats.creditGrade,               sub: "Majority of identified",  color: C.purple  },
        ].map(s => (
          <div key={s.label} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px 18px", borderTop: `3px solid ${s.color}` }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.white, marginTop: 4 }}>{s.label}</div>
            <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Loan intent segments */}
      <Card>
        <SectionTitle>Loan Intent Segments</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "repeat(3,1fr)", gap: 12 }}>
          {BARRETT_MOODS.map(m => (
            <div key={m.label} style={{ background: C.bg3, borderRadius: 10, padding: "14px 16px", borderLeft: `3px solid ${m.color}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.white }}>{m.label}</div>
                <div style={{ fontSize: 20, fontWeight: 900, color: m.color }}>{m.count.toLocaleString()}</div>
              </div>
              <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.5, marginBottom: 8 }}>{m.desc}</div>
              <Bar2 value={m.count} max={5000} color={m.color} />
            </div>
          ))}
        </div>
      </Card>

      {/* Reachability */}
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 16 }}>
        <Card>
          <SectionTitle>Reachability</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { label: "With Phone Number",  value: stats.withPhone,  total: stats.totalList, color: C.green   },
              { label: "With Email Address", value: stats.withEmail,  total: stats.totalList, color: C.accent3 },
              { label: "Homeowners",         value: stats.homeowners, total: stats.totalList, color: C.gold    },
            ].map(r => (
              <div key={r.label}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: C.white, fontWeight: 600 }}>{r.label}</span>
                  <span style={{ fontSize: 12, color: r.color, fontWeight: 700 }}>{r.value.toLocaleString()} ({Math.round(r.value/r.total*100)}%)</span>
                </div>
                <Bar2 value={r.value} max={r.total} color={r.color} />
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <SectionTitle>Loan Intent Distribution</SectionTitle>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={BARRETT_MOODS} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} horizontal={false} />
              <XAxis type="number" tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis dataKey="label" type="category" tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} width={110} />
              <Tooltip contentStyle={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 8, color: C.white, fontSize: 11 }} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {BARRETT_MOODS.map((m, i) => <Cell key={i} fill={m.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
const TABS = ["Overview", "ROI Calculator", "Live Visitors", "Buyer Journeys", "Audience", "Web Traffic", "Channels"];

export default function BarrettDashboard() {
  const [tab, setTab] = useState(0);
  const [time, setTime] = useState(new Date());
  const [, navigate] = useLocation();
  const mobile = useIsMobile();
  const liveVisitors = useTick(BARRETT_LIVE_BASE.siteVisitors, 1);

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif", color: C.white }}>
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.15} }
        @keyframes pdot  { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.4)} }
        @keyframes slideIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: ${C.bg2}; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 3px; }
        input[type=range]::-webkit-slider-thumb { width: 16px; height: 16px; }
      `}</style>

      {/* Header */}
      <div style={{ background: C.headerBg, borderBottom: `1px solid ${C.border}`, padding: mobile ? "12px 16px" : "14px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 200 }}>
        <div style={{ display: "flex", alignItems: "center", gap: mobile ? 10 : 16, minWidth: 0 }}>
          <button onClick={() => navigate("/campaigns")} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, padding: "5px 10px", color: "#f1f5f9", fontSize: 11, cursor: "pointer", flexShrink: 0 }}>
            ← Campaigns
          </button>
          <div style={{ width: 1, height: 24, background: "rgba(255,255,255,0.15)", flexShrink: 0 }} />
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <span style={{ width: 8, height: 8, background: C.accent2, borderRadius: "50%", boxShadow: `0 0 10px ${C.accent2}`, animation: "pdot 2s ease-in-out infinite" }} />
            {!mobile && <img src="/ea-logo.png" alt="Exact Audience" style={{ height: 22, maxWidth: 160, objectFit: "contain", objectPosition: "left center", filter: "brightness(1.15)" }} />}
          </div>
          {!mobile && <div style={{ width: 1, height: 30, background: "rgba(255,255,255,0.15)" }} />}
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: mobile ? 12 : 15, fontWeight: 800, color: "#ffffff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Barrett Financial Group</div>
            {!mobile && <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>Chandler, AZ · Mortgage Lending · SiteID.ai Visitor Intelligence</div>}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: mobile ? 6 : 10, flexShrink: 0 }}>
          {/* Live identified counter */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 20, padding: "4px 10px", fontSize: 10, fontWeight: 700, color: C.gold }}>
            <span style={{ width: 6, height: 6, background: C.gold, borderRadius: "50%", animation: "blink 1.2s ease-in-out infinite" }} />
            {liveVisitors.toLocaleString()} Identified
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 20, padding: "4px 10px", fontSize: 10, fontWeight: 700, color: C.green }}>
            <span style={{ width: 6, height: 6, background: C.green, borderRadius: "50%", animation: "blink 1.2s ease-in-out infinite" }} />
            Live
          </div>
          {!mobile && <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", fontFamily: "monospace" }}>{time.toLocaleTimeString()}</div>}
          <button onClick={() => { localStorage.removeItem("ea_dashboard_auth"); window.location.href = "/"; }} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 20, padding: "5px 10px", color: "#94a3b8", fontSize: 11, fontWeight: 600, cursor: "pointer", flexShrink: 0 }}>
            🔒 {mobile ? "" : "Log Out"}
          </button>
        </div>
      </div>

      {/* Tab Bar */}
      <div style={{ background: C.bg2, borderBottom: `1px solid ${C.border}`, padding: mobile ? "0 8px" : "0 28px", display: "flex", overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
        {TABS.map((t, i) => (
          <button key={t} onClick={() => setTab(i)} style={{
            padding: mobile ? "11px 12px" : "13px 18px", fontSize: mobile ? 11 : 12, fontWeight: 600,
            color: tab === i ? C.white : C.muted, background: "transparent", border: "none", cursor: "pointer",
            borderBottom: `2px solid ${tab === i ? C.accent2 : "transparent"}`,
            whiteSpace: "nowrap", transition: "all 0.2s", letterSpacing: "0.03em", flexShrink: 0,
          }}>{t}</button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: mobile ? "16px 12px" : "24px 28px", animation: "slideIn 0.25s ease" }} key={tab}>
        {tab === 0 && <FunnelHero mobile={mobile} />}
        {tab === 1 && <ROICalculator mobile={mobile} />}
        {tab === 2 && <LiveVisitorFeed mobile={mobile} />}
        {tab === 3 && <BuyerJourneys mobile={mobile} />}
        {tab === 4 && <AudienceTab mobile={mobile} />}
        {tab === 5 && <WebTrafficTab mobile={mobile} />}
        {tab === 6 && <ChannelsTab mobile={mobile} />}
      </div>

      {/* Footer */}
      <div style={{ borderTop: `1px solid ${C.border}`, padding: mobile ? "12px 16px" : "14px 28px", display: "flex", flexDirection: mobile ? "column" : "row", justifyContent: "space-between", alignItems: mobile ? "flex-start" : "center", gap: 4, fontSize: 10, color: C.muted }}>
        <span>Exact Audience · exactaudience.ai</span>
        <span style={{ color: C.gold }}>SiteID.ai — Visitor Intelligence for Barrett Financial Group</span>
        {!mobile && <span>Data refreshes every 9 seconds</span>}
      </div>
    </div>
  );
}
