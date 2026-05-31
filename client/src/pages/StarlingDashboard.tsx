/**
 * StarlingDashboard.tsx
 * Jeff Starling for Oklahoma Attorney General — June 16, 2026 Republican Primary
 * PITCH DOCUMENT — 3 Budget Tiers ($30K / $65K / $93K)
 * Exact Audience | exactaudience.ai | siteid.ai
 * Design: Deep navy + crimson red + gold — Oklahoma political authority
 */

import { useState } from "react";
import { Link } from "wouter";
import {
  STARLING_TIERS,
  STARLING_RACE,
  STARLING_TIMELINE,
  STARLING_CREATIVES,
  STARLING_MOODS,
  STARLING_CTV_CHANNELS,
  STARLING_DIGITAL_CHANNELS,
  STARLING_INTELLIGENCE,
  STARLING_EA_ADVANTAGE,
  STARLING_VISITORS,
} from "@/lib/starlingData";

// ── Color palette ─────────────────────────────────────────────────────────────
const C = {
  navy: "#0a1628",
  navyMid: "#0f1f3d",
  navyLight: "#1a2f52",
  navyBorder: "#1e3a5f",
  red: "#c0392b",
  redLight: "#e74c3c",
  gold: "#d4a017",
  goldLight: "#e8b84b",
  white: "#f8fafc",
  muted: "#94a3b8",
  mutedDark: "#64748b",
  blue: "#3b82f6",
  blueLight: "#60a5fa",
  purple: "#7c3aed",
  green: "#10b981",
  text: "#e2e8f0",
  textDim: "#94a3b8",
};

// ── Tabs ──────────────────────────────────────────────────────────────────────
const TABS = [
  { id: "overview", label: "Overview" },
  { id: "tiers", label: "Budget Tiers" },
  { id: "channels", label: "Channel Universe" },
  { id: "intelligence", label: "Voter Intelligence" },
  { id: "timeline", label: "18-Day Plan" },
  { id: "ads", label: "Ad Concepts" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmt(n: number) {
  return n >= 1000000
    ? `${(n / 1000000).toFixed(1)}M`
    : n >= 1000
    ? `${(n / 1000).toFixed(0)}K`
    : String(n);
}

function fmtDollar(n: number) {
  return `$${n.toLocaleString()}`;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function RaceContextBanner() {
  return (
    <div
      style={{
        background: `linear-gradient(135deg, ${C.navyMid} 0%, #1a0a0a 100%)`,
        borderBottom: `2px solid ${C.red}`,
        padding: "10px 20px",
        display: "flex",
        flexWrap: "wrap",
        gap: "6px 24px",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {[
        { label: "Election", value: "June 16, 2026" },
        { label: "Race", value: "Oklahoma AG Republican Primary" },
        { label: "Registered Republicans", value: fmt(STARLING_RACE.registeredRepublicans) },
        { label: "Expected Turnout", value: `${fmt(STARLING_RACE.expectedTurnoutLow)}–${fmt(STARLING_RACE.expectedTurnoutHigh)}` },
        { label: "Win Threshold", value: `~${fmt(STARLING_RACE.winThresholdLow)}–${fmt(STARLING_RACE.winThresholdHigh)} votes` },
        { label: "Undecided", value: `${STARLING_RACE.undecided}%` },
      ].map((item) => (
        <div key={item.label} style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <span style={{ color: C.muted, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>{item.label}</span>
          <span style={{ color: C.gold, fontWeight: 700, fontSize: 13 }}>{item.value}</span>
        </div>
      ))}
    </div>
  );
}

function TabOverview() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Pitch headline */}
      <div style={{ background: C.navyMid, border: `1px solid ${C.navyBorder}`, borderRadius: 12, padding: "28px 32px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 280 }}>
            <div style={{ color: C.red, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
              Behavioral Intelligence &amp; Precision Media Strategy
            </div>
            <h2 style={{ color: C.white, fontSize: 26, fontWeight: 800, lineHeight: 1.2, margin: "0 0 12px" }}>
              Winning the Final 18 Days
            </h2>
            <p style={{ color: C.text, fontSize: 15, lineHeight: 1.7, margin: 0 }}>
              The June 16 Republican primary for Oklahoma Attorney General is wide open. 78–80% of Republican primary voters remain undecided or have no opinion of either candidate. Jon Echols has spent 14 years in the Capitol and three years running for this office, and he still cannot break 35% in any public poll.
            </p>
            <p style={{ color: C.text, fontSize: 15, lineHeight: 1.7, margin: "12px 0 0" }}>
              The message leverage is extraordinary — <strong style={{ color: C.gold }}>Starling's biography moves 80% of voters toward him</strong> when they hear it, and <strong style={{ color: C.gold }}>Echols' record moves 79% against him</strong>. The only question is whether the campaign deploys the resources to deliver it at scale before June 16.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, minWidth: 200 }}>
            <div style={{ background: C.navyLight, borderRadius: 10, padding: "14px 18px", border: `1px solid ${C.navyBorder}` }}>
              <div style={{ color: C.muted, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>Starling Polling</div>
              <div style={{ color: C.gold, fontSize: 28, fontWeight: 800 }}>20%</div>
              <div style={{ color: C.textDim, fontSize: 12 }}>~46K–56K projected votes</div>
            </div>
            <div style={{ background: C.navyLight, borderRadius: 10, padding: "14px 18px", border: `1px solid ${C.navyBorder}` }}>
              <div style={{ color: C.muted, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>Undecided Universe</div>
              <div style={{ color: C.blueLight, fontSize: 28, fontWeight: 800 }}>45%</div>
              <div style={{ color: C.textDim, fontSize: 12 }}>~104K–127K votes available</div>
            </div>
            <div style={{ background: C.navyLight, borderRadius: 10, padding: "14px 18px", border: `1px solid ${C.navyBorder}` }}>
              <div style={{ color: C.muted, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>Votes Needed to Win</div>
              <div style={{ color: C.redLight, fontSize: 28, fontWeight: 800 }}>116K–142K</div>
              <div style={{ color: C.textDim, fontSize: 12 }}>50%+1 of expected turnout</div>
            </div>
          </div>
        </div>
      </div>

      {/* Market breakdown */}
      <div style={{ background: C.navyMid, border: `1px solid ${C.navyBorder}`, borderRadius: 12, padding: "24px 28px" }}>
        <h3 style={{ color: C.white, fontSize: 16, fontWeight: 700, margin: "0 0 16px" }}>Market Breakdown</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
          {STARLING_RACE.markets.map((m) => (
            <div key={m.name} style={{ background: C.navyLight, borderRadius: 10, padding: "16px 20px", border: `1px solid ${C.navyBorder}` }}>
              <div style={{ color: C.gold, fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{m.name}</div>
              <div style={{ color: C.textDim, fontSize: 12, marginBottom: 10 }}>{m.note}</div>
              <div style={{ display: "flex", gap: 16 }}>
                <div>
                  <div style={{ color: C.muted, fontSize: 10, textTransform: "uppercase" }}>Echols</div>
                  <div style={{ color: C.redLight, fontWeight: 700, fontSize: 18 }}>{m.echols}%</div>
                </div>
                <div>
                  <div style={{ color: C.muted, fontSize: 10, textTransform: "uppercase" }}>Starling</div>
                  <div style={{ color: C.blueLight, fontWeight: 700, fontSize: 18 }}>{m.starling}%</div>
                </div>
                <div>
                  <div style={{ color: C.muted, fontSize: 10, textTransform: "uppercase" }}>Reg. R</div>
                  <div style={{ color: C.text, fontWeight: 600, fontSize: 14 }}>{fmt(m.registeredR)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* EA vs Traditional */}
      <div style={{ background: C.navyMid, border: `1px solid ${C.navyBorder}`, borderRadius: 12, padding: "24px 28px" }}>
        <h3 style={{ color: C.white, fontSize: 16, fontWeight: 700, margin: "0 0 4px" }}>Exact Audience vs. Traditional Media</h3>
        <p style={{ color: C.textDim, fontSize: 13, margin: "0 0 16px" }}>
          We don't target demographics. We target named individuals across every screen they touch.
        </p>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.navyBorder}` }}>
                <th style={{ color: C.muted, textAlign: "left", padding: "8px 12px", fontWeight: 600, textTransform: "uppercase", fontSize: 11 }}>Capability</th>
                <th style={{ color: C.muted, textAlign: "left", padding: "8px 12px", fontWeight: 600, textTransform: "uppercase", fontSize: 11 }}>Traditional Media Firm</th>
                <th style={{ color: C.gold, textAlign: "left", padding: "8px 12px", fontWeight: 600, textTransform: "uppercase", fontSize: 11 }}>Exact Audience</th>
              </tr>
            </thead>
            <tbody>
              {STARLING_EA_ADVANTAGE.map((row, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${C.navyBorder}22` }}>
                  <td style={{ color: C.text, padding: "10px 12px", fontWeight: 600 }}>{row.capability}</td>
                  <td style={{ color: C.textDim, padding: "10px 12px" }}>{row.traditional}</td>
                  <td style={{ color: C.blueLight, padding: "10px 12px" }}>{row.ea}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live voter feed */}
      <div style={{ background: C.navyMid, border: `1px solid ${C.navyBorder}`, borderRadius: 12, padding: "24px 28px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.green, boxShadow: `0 0 8px ${C.green}` }} />
          <h3 style={{ color: C.white, fontSize: 16, fontWeight: 700, margin: 0 }}>Live Voter Intelligence Feed</h3>
          <span style={{ color: C.textDim, fontSize: 12 }}>— sample of what the platform tracks in real time</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {STARLING_VISITORS.slice(0, 10).map((v, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 12px", background: C.navyLight, borderRadius: 8, flexWrap: "wrap" }}>
              {v.hot && <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.redLight, flexShrink: 0 }} />}
              {!v.hot && <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.mutedDark, flexShrink: 0 }} />}
              <span style={{ color: C.white, fontWeight: 600, fontSize: 13, minWidth: 80 }}>{v.name}</span>
              <span style={{ color: C.textDim, fontSize: 12, minWidth: 100 }}>{v.city}, {v.state} {v.zip}</span>
              <span style={{ color: C.text, fontSize: 12, flex: 1 }}>{v.signal}</span>
              <span style={{ color: C.blueLight, fontSize: 11, background: `${C.blue}22`, padding: "2px 8px", borderRadius: 4 }}>{v.mood}</span>
              <span style={{ color: C.mutedDark, fontSize: 11 }}>{v.device}</span>
              <span style={{ color: C.mutedDark, fontSize: 11 }}>{v.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TabTiers() {
  const [selectedTier, setSelectedTier] = useState<string>("recommended");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Tier selector cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
        {STARLING_TIERS.map((tier) => (
          <button
            key={tier.id}
            onClick={() => setSelectedTier(tier.id)}
            style={{
              background: selectedTier === tier.id ? C.navyLight : C.navyMid,
              border: `2px solid ${selectedTier === tier.id ? tier.borderColor : C.navyBorder}`,
              borderRadius: 12,
              padding: "20px 24px",
              cursor: "pointer",
              textAlign: "left",
              transition: "all 0.2s",
              position: "relative",
            }}
          >
            {tier.recommended && (
              <div style={{
                position: "absolute", top: -10, right: 16,
                background: C.gold, color: C.navy, fontSize: 10, fontWeight: 800,
                padding: "3px 10px", borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.08em",
              }}>
                Recommended
              </div>
            )}
            <div style={{ color: tier.color, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>
              {tier.label}
            </div>
            <div style={{ color: C.white, fontSize: 32, fontWeight: 800, marginBottom: 4 }}>
              {fmtDollar(tier.total)}
            </div>
            <div style={{ color: C.textDim, fontSize: 12, lineHeight: 1.5 }}>{tier.tagline}</div>
            <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: C.muted, fontSize: 12 }}>Unique voters reached</span>
                <span style={{ color: C.text, fontSize: 12, fontWeight: 600 }}>{tier.metrics.uniqueVoters}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: C.muted, fontSize: 12 }}>Avg frequency</span>
                <span style={{ color: C.text, fontSize: 12, fontWeight: 600 }}>{tier.metrics.frequency}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: C.muted, fontSize: 12 }}>Persuasion threshold</span>
                <span style={{ color: tier.id === "entry" ? C.gold : C.green, fontSize: 12, fontWeight: 600 }}>{tier.metrics.persuasionThreshold}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: C.muted, fontSize: 12 }}>New votes (realistic)</span>
                <span style={{ color: C.blueLight, fontSize: 12, fontWeight: 700 }}>{tier.metrics.newVotes}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: C.muted, fontSize: 12 }}>Projected Starling total</span>
                <span style={{ color: C.gold, fontSize: 12, fontWeight: 700 }}>{tier.metrics.projectedTotal}</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Selected tier detail */}
      {STARLING_TIERS.filter((t) => t.id === selectedTier).map((tier) => (
        <div key={tier.id} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Budget breakdown */}
          <div style={{ background: C.navyMid, border: `1px solid ${tier.borderColor}`, borderRadius: 12, padding: "24px 28px" }}>
            <h3 style={{ color: C.white, fontSize: 16, fontWeight: 700, margin: "0 0 16px" }}>
              {fmtDollar(tier.total)} — Budget Breakdown
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {tier.components.map((c, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: C.navyLight, borderRadius: 8 }}>
                  <span style={{ color: C.text, fontSize: 14 }}>{c.label}</span>
                  <span style={{ color: C.gold, fontWeight: 700, fontSize: 15 }}>{fmtDollar(c.budget)}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", background: `${tier.color}22`, borderRadius: 8, border: `1px solid ${tier.borderColor}` }}>
                <span style={{ color: C.white, fontWeight: 700, fontSize: 15 }}>Total Investment</span>
                <span style={{ color: tier.color === "#1d4ed8" ? C.blueLight : tier.color === "#7c3aed" ? "#a78bfa" : C.muted, fontWeight: 800, fontSize: 18 }}>{fmtDollar(tier.total)}</span>
              </div>
            </div>
            {tier.warning && (
              <div style={{ marginTop: 12, padding: "10px 14px", background: `${C.gold}15`, border: `1px solid ${C.gold}44`, borderRadius: 8, color: C.gold, fontSize: 13 }}>
                ⚠️ {tier.warning}
              </div>
            )}
          </div>

          {/* Vote conversion projections */}
          <div style={{ background: C.navyMid, border: `1px solid ${C.navyBorder}`, borderRadius: 12, padding: "24px 28px" }}>
            <h3 style={{ color: C.white, fontSize: 16, fontWeight: 700, margin: "0 0 16px" }}>Vote Conversion Projections</h3>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${C.navyBorder}` }}>
                    {["Scenario", "Voters Reached", "Conversion Rate", "New Votes", "Starling Total"].map((h) => (
                      <th key={h} style={{ color: C.muted, textAlign: "left", padding: "8px 12px", fontWeight: 600, textTransform: "uppercase", fontSize: 11 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tier.projections.map((p, i) => (
                    <tr key={i} style={{
                      borderBottom: `1px solid ${C.navyBorder}22`,
                      background: p.highlight ? `${C.blue}11` : "transparent",
                    }}>
                      <td style={{ color: p.highlight ? C.gold : C.text, padding: "10px 12px", fontWeight: p.highlight ? 700 : 400 }}>
                        {p.highlight ? "★ " : ""}{p.scenario}
                      </td>
                      <td style={{ color: C.text, padding: "10px 12px" }}>{fmt(p.votersReached)}</td>
                      <td style={{ color: p.highlight ? C.blueLight : C.text, padding: "10px 12px", fontWeight: p.highlight ? 700 : 400 }}>{p.conversion}%</td>
                      <td style={{ color: p.highlight ? C.blueLight : C.text, padding: "10px 12px", fontWeight: p.highlight ? 700 : 400 }}>{fmt(p.newVotes)}</td>
                      <td style={{ color: p.highlight ? C.gold : C.text, padding: "10px 12px", fontWeight: p.highlight ? 700 : 400 }}>{p.starlingTotal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Full metrics */}
          <div style={{ background: C.navyMid, border: `1px solid ${C.navyBorder}`, borderRadius: 12, padding: "24px 28px" }}>
            <h3 style={{ color: C.white, fontSize: 16, fontWeight: 700, margin: "0 0 16px" }}>Full Performance Metrics</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
              {[
                { label: "Unique Voters Reached", value: tier.metrics.uniqueVoters, color: C.blueLight },
                { label: "Average Frequency", value: tier.metrics.frequency, color: C.text },
                { label: "Digital Impressions", value: tier.metrics.digitalImpressions, color: C.text },
                { label: "SiteID Contacts", value: tier.metrics.siteIdContacts, color: C.green },
                { label: "New Votes (Realistic)", value: tier.metrics.newVotes, color: C.blueLight },
                { label: "Projected Total", value: tier.metrics.projectedTotal, color: C.gold },
                { label: "Cost Per Vote Moved", value: tier.metrics.costPerVote, color: C.text },
                { label: "Persuasion Threshold", value: tier.metrics.persuasionThreshold, color: tier.id === "entry" ? C.gold : C.green },
              ].map((m) => (
                <div key={m.label} style={{ background: C.navyLight, borderRadius: 8, padding: "14px 16px" }}>
                  <div style={{ color: C.muted, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4 }}>{m.label}</div>
                  <div style={{ color: m.color, fontWeight: 700, fontSize: 16 }}>{m.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* Comparison table */}
      <div style={{ background: C.navyMid, border: `1px solid ${C.navyBorder}`, borderRadius: 12, padding: "24px 28px" }}>
        <h3 style={{ color: C.white, fontSize: 16, fontWeight: 700, margin: "0 0 16px" }}>All Three Levels — Side-by-Side</h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.navyBorder}` }}>
                <th style={{ color: C.muted, textAlign: "left", padding: "8px 12px", fontWeight: 600, textTransform: "uppercase", fontSize: 11 }}>Metric</th>
                {STARLING_TIERS.map((t) => (
                  <th key={t.id} style={{ color: t.recommended ? C.gold : C.muted, textAlign: "center", padding: "8px 12px", fontWeight: 700, fontSize: 13 }}>
                    {fmtDollar(t.total)}
                    {t.recommended && <div style={{ fontSize: 10, color: C.gold }}>★ Recommended</div>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { label: "Unique voters reached", key: "uniqueVoters" as const },
                { label: "Average frequency", key: "frequency" as const },
                { label: "Persuasion threshold", key: "persuasionThreshold" as const },
                { label: "Digital impressions", key: "digitalImpressions" as const },
                { label: "SiteID contacts", key: "siteIdContacts" as const },
                { label: "New votes generated", key: "newVotes" as const },
                { label: "Projected Starling total", key: "projectedTotal" as const },
                { label: "Cost per vote moved", key: "costPerVote" as const },
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${C.navyBorder}22` }}>
                  <td style={{ color: C.text, padding: "10px 12px", fontWeight: 500 }}>{row.label}</td>
                  {STARLING_TIERS.map((t) => (
                    <td key={t.id} style={{ color: t.recommended ? C.blueLight : C.textDim, padding: "10px 12px", textAlign: "center", fontWeight: t.recommended ? 600 : 400 }}>
                      {t.metrics[row.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ color: C.textDim, fontSize: 12, marginTop: 12, lineHeight: 1.6 }}>
          Cost per vote moved decreases as budget increases. At $93,000, the optimization engine compounds gains hour by hour — the inverse of broadcast TV, where additional spend produces diminishing returns.
        </p>
      </div>
    </div>
  );
}

function TabChannels() {
  const [showAllCTV, setShowAllCTV] = useState(false);
  const topCTV = STARLING_CTV_CHANNELS.filter((c) => c.tier === "top");
  const midCTV = STARLING_CTV_CHANNELS.filter((c) => c.tier === "mid");
  const lowCTV = STARLING_CTV_CHANNELS.filter((c) => c.tier === "low");
  const localCTV = STARLING_CTV_CHANNELS.filter((c) => (c as any).local);

  const visibleMid = showAllCTV ? midCTV : midCTV.slice(0, 8);
  const visibleLow = showAllCTV ? lowCTV : lowCTV.slice(0, 6);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Oklahoma Local TV */}
      <div style={{ background: C.navyMid, border: `1px solid ${C.navyBorder}`, borderRadius: 12, padding: "24px 28px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <span style={{ background: C.red, color: C.white, fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 4, textTransform: "uppercase" }}>LOCAL</span>
          <h3 style={{ color: C.white, fontSize: 16, fontWeight: 700, margin: 0 }}>Oklahoma TV Stations</h3>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
          {localCTV.map((ch) => (
            <div key={ch.name} style={{ background: C.navyLight, borderRadius: 8, padding: "12px 14px", border: `1px solid ${ch.color}44`, display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: ch.color, flexShrink: 0 }} />
              <span style={{ color: C.text, fontSize: 13, fontWeight: 600 }}>{ch.name}</span>
              <span style={{ marginLeft: "auto", background: C.red, color: C.white, fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 3 }}>LOCAL</span>
            </div>
          ))}
        </div>
      </div>

      {/* Oklahoma Digital */}
      <div style={{ background: C.navyMid, border: `1px solid ${C.navyBorder}`, borderRadius: 12, padding: "24px 28px" }}>
        <h3 style={{ color: C.white, fontSize: 16, fontWeight: 700, margin: "0 0 16px" }}>Oklahoma Digital Channel Universe</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {["Social", "Video", "Oklahoma Media", "Programmatic", "Behavioral", "Conservative Media"].map((cat) => {
            const channels = STARLING_DIGITAL_CHANNELS.filter((c) => c.category === cat);
            if (!channels.length) return null;
            return (
              <div key={cat}>
                <div style={{ color: C.muted, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6, marginTop: 8 }}>{cat}</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 8 }}>
                  {channels.map((ch) => (
                    <div key={ch.name} style={{ background: C.navyLight, borderRadius: 8, padding: "10px 14px", border: `1px solid ${ch.color}33`, display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: ch.color, flexShrink: 0, marginTop: 4 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ color: C.text, fontSize: 13, fontWeight: 600 }}>{ch.name}</div>
                        <div style={{ color: C.textDim, fontSize: 11, marginTop: 2 }}>{ch.note}</div>
                      </div>
                      {ch.priority === "high" && (
                        <span style={{ background: `${C.green}22`, color: C.green, fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 3, flexShrink: 0 }}>HIGH</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Voter mood → channel mapping */}
      <div style={{ background: C.navyMid, border: `1px solid ${C.navyBorder}`, borderRadius: 12, padding: "24px 28px" }}>
        <h3 style={{ color: C.white, fontSize: 16, fontWeight: 700, margin: "0 0 16px" }}>Voter Mood → Channel Mapping</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {STARLING_MOODS.map((mood) => (
            <div key={mood.label} style={{ background: C.navyLight, borderRadius: 10, padding: "14px 18px", border: `1px solid ${mood.color}33` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
                <span style={{ fontSize: 18 }}>{mood.icon}</span>
                <span style={{ color: mood.color, fontWeight: 700, fontSize: 14 }}>{mood.label}</span>
                <span style={{ color: C.gold, fontWeight: 700, fontSize: 14 }}>{mood.pct}%</span>
              </div>
              <p style={{ color: C.textDim, fontSize: 12, margin: "0 0 8px", lineHeight: 1.5 }}>{mood.desc}</p>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 6 }}>
                {mood.channels.map((ch) => (
                  <span key={ch} style={{ background: `${mood.color}22`, color: mood.color, fontSize: 11, padding: "3px 8px", borderRadius: 4, fontWeight: 600 }}>{ch}</span>
                ))}
              </div>
              <div style={{ color: C.textDim, fontSize: 12 }}>
                <strong style={{ color: C.text }}>Message:</strong> {mood.message}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTV channel universe */}
      <div style={{ background: C.navyMid, border: `1px solid ${C.navyBorder}`, borderRadius: 12, padding: "24px 28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
          <h3 style={{ color: C.white, fontSize: 16, fontWeight: 700, margin: 0 }}>
            CTV Channel Universe — {STARLING_CTV_CHANNELS.filter((c) => !(c as any).local).length} Streaming Channels
          </h3>
          <button
            onClick={() => setShowAllCTV(!showAllCTV)}
            style={{ background: C.navyLight, border: `1px solid ${C.navyBorder}`, color: C.blueLight, padding: "6px 14px", borderRadius: 6, cursor: "pointer", fontSize: 12 }}
          >
            {showAllCTV ? "Show Less" : "Show All"}
          </button>
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ color: C.muted, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Top Tier</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {topCTV.filter((c) => !(c as any).local).map((ch) => (
              <span key={ch.name} style={{ background: `${ch.color}22`, border: `1px solid ${ch.color}55`, color: C.text, fontSize: 12, padding: "4px 10px", borderRadius: 6 }}>{ch.name}</span>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ color: C.muted, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Mid Tier</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {visibleMid.map((ch) => (
              <span key={ch.name} style={{ background: C.navyLight, border: `1px solid ${C.navyBorder}`, color: C.textDim, fontSize: 12, padding: "4px 10px", borderRadius: 6 }}>{ch.name}</span>
            ))}
            {!showAllCTV && midCTV.length > 8 && (
              <span style={{ color: C.mutedDark, fontSize: 12, padding: "4px 10px" }}>+{midCTV.length - 8} more</span>
            )}
          </div>
        </div>

        {showAllCTV && (
          <div>
            <div style={{ color: C.muted, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Lower Tier</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {visibleLow.map((ch) => (
                <span key={ch.name} style={{ background: C.navyLight, border: `1px solid ${C.navyBorder}`, color: C.mutedDark, fontSize: 11, padding: "3px 8px", borderRadius: 5 }}>{ch.name}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TabIntelligence() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ background: C.navyMid, border: `1px solid ${C.navyBorder}`, borderRadius: 12, padding: "24px 28px" }}>
        <h3 style={{ color: C.white, fontSize: 16, fontWeight: 700, margin: "0 0 8px" }}>What We Know Before a Dollar Is Spent</h3>
        <p style={{ color: C.textDim, fontSize: 13, margin: "0 0 20px", lineHeight: 1.6 }}>
          Before a single impression runs, Exact Audience builds a behavioral profile on every registered Republican primary voter in the OKC and Tulsa markets.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 14 }}>
          {STARLING_INTELLIGENCE.map((item) => (
            <div key={item.label} style={{ background: C.navyLight, borderRadius: 10, padding: "18px 20px", border: `1px solid ${C.navyBorder}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <span style={{ fontSize: 22 }}>{item.icon}</span>
                <span style={{ color: C.gold, fontWeight: 700, fontSize: 14 }}>{item.label}</span>
              </div>
              <p style={{ color: C.text, fontSize: 13, lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Real-time optimization */}
      <div style={{ background: C.navyMid, border: `1px solid ${C.navyBorder}`, borderRadius: 12, padding: "24px 28px" }}>
        <h3 style={{ color: C.white, fontSize: 16, fontWeight: 700, margin: "0 0 8px" }}>Real-Time Budget Optimization</h3>
        <p style={{ color: C.textDim, fontSize: 13, margin: "0 0 16px", lineHeight: 1.6 }}>
          A standard media buy is set on Day 1 and runs unchanged through Election Day. The campaign gets a report after the votes are counted. Exact Audience runs a live optimization model. Every hour, the platform measures which ZIP codes are converting, which message variants are winning, which time windows are producing the highest completion rates, and which platforms are driving the most post-exposure site traffic. Budget moves immediately — away from what is not working, toward what is.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
          {[
            { label: "Optimization Cycle", value: "Every hour", icon: "⏱️" },
            { label: "Message Testing", value: "Bio vs. Contrast", icon: "🔬" },
            { label: "Peak Efficiency", value: "Day 12 of 18", icon: "📈" },
            { label: "SiteID Match Rate", value: "60% of visitors", icon: "🎯" },
          ].map((item) => (
            <div key={item.label} style={{ background: C.navyLight, borderRadius: 8, padding: "14px 16px", textAlign: "center" }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>{item.icon}</div>
              <div style={{ color: C.gold, fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{item.value}</div>
              <div style={{ color: C.muted, fontSize: 12 }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* SiteID */}
      <div style={{ background: C.navyMid, border: `1px solid ${C.navyBorder}`, borderRadius: 12, padding: "24px 28px" }}>
        <h3 style={{ color: C.white, fontSize: 16, fontWeight: 700, margin: "0 0 8px" }}>SiteID: Identifying Voters Who Visit the Campaign Website</h3>
        <p style={{ color: C.textDim, fontSize: 13, margin: "0 0 16px", lineHeight: 1.6 }}>
          Every voter who visits jeffstarling.com is anonymous. They arrive, read, and leave — the campaign has no idea who they were. SiteID identifies those visitors at a 60% match rate — name, email, verified phone, home address, and behavioral intent signals. Each identified visitor is added to a direct outreach sequence: a follow-up ad, a campaign email, or a volunteer call. The conversion rate on this retargeted audience is 4–6x higher than cold impressions.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
          {[
            { label: "Match Rate", value: "60%", color: C.green },
            { label: "Retargeted Conversion Lift", value: "4–6x", color: C.blueLight },
            { label: "Site Visits (18 days)", value: "10,000–20,000", color: C.text },
            { label: "Identified Contacts ($65K)", value: "6,000–9,000", color: C.gold },
          ].map((item) => (
            <div key={item.label} style={{ background: C.navyLight, borderRadius: 8, padding: "14px 16px" }}>
              <div style={{ color: C.muted, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4 }}>{item.label}</div>
              <div style={{ color: item.color, fontWeight: 700, fontSize: 20 }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TabTimeline() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ background: C.navyMid, border: `1px solid ${C.navyBorder}`, borderRadius: 12, padding: "24px 28px" }}>
        <h3 style={{ color: C.white, fontSize: 16, fontWeight: 700, margin: "0 0 20px" }}>18-Day Campaign Execution Plan</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {STARLING_TIMELINE.map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 16, position: "relative" }}>
              {/* Connector line */}
              {i < STARLING_TIMELINE.length - 1 && (
                <div style={{ position: "absolute", left: 19, top: 40, bottom: 0, width: 2, background: (item as any).election ? C.gold : C.navyBorder }} />
              )}
              {/* Dot */}
              <div style={{
                width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                background: (item as any).election ? C.gold : C.navyLight,
                border: `2px solid ${(item as any).election ? C.gold : C.navyBorder}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                zIndex: 1,
              }}>
                <span style={{ fontSize: 16 }}>{(item as any).election ? "🗳️" : "📍"}</span>
              </div>
              {/* Content */}
              <div style={{ paddingBottom: 24, flex: 1 }}>
                <div style={{ color: (item as any).election ? C.gold : C.blueLight, fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{item.days}</div>
                <div style={{ color: C.text, fontSize: 13, lineHeight: 1.6 }}>{item.activity}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Launch timeline */}
      <div style={{ background: C.navyMid, border: `1px solid ${C.navyBorder}`, borderRadius: 12, padding: "24px 28px" }}>
        <h3 style={{ color: C.white, fontSize: 16, fontWeight: 700, margin: "0 0 16px" }}>Launch Commitment</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
          {[
            { label: "Launch Timeline", value: "Within 24 hours of approval", icon: "🚀" },
            { label: "Heavy Run Through", value: "June 13 (last early voting day)", icon: "📅" },
            { label: "Maintain Through", value: "June 15 (day before election)", icon: "📅" },
            { label: "Daily Reporting", value: "Reach, frequency, performance", icon: "📊" },
            { label: "Mid-Campaign Optimization", value: "Budget shifted to winners", icon: "⚡" },
            { label: "Final Summary", value: "Full performance report", icon: "📋" },
          ].map((item) => (
            <div key={item.label} style={{ background: C.navyLight, borderRadius: 8, padding: "14px 16px" }}>
              <div style={{ fontSize: 20, marginBottom: 8 }}>{item.icon}</div>
              <div style={{ color: C.gold, fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{item.value}</div>
              <div style={{ color: C.muted, fontSize: 12 }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TabAds() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ background: C.navyMid, border: `1px solid ${C.navyBorder}`, borderRadius: 12, padding: "24px 28px" }}>
        <h3 style={{ color: C.white, fontSize: 16, fontWeight: 700, margin: "0 0 8px" }}>Ad Concepts — Voiceover, No New Filming Required</h3>
        <p style={{ color: C.textDim, fontSize: 13, margin: "0 0 20px", lineHeight: 1.6 }}>
          Both concepts are :30 voiceover spots that can be produced immediately using existing footage. No new filming required. The candidate only speaks to state their name and approve the message.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
          {STARLING_CREATIVES.map((ad) => (
            <div key={ad.name} style={{ background: C.navyLight, borderRadius: 12, padding: "22px 24px", border: `1px solid ${ad.color}44` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
                <div>
                  <div style={{ color: ad.color, fontWeight: 800, fontSize: 16 }}>{ad.name}</div>
                  <div style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>{ad.focus} · {ad.length} · {ad.type}</div>
                </div>
                <span style={{ background: `${ad.color}22`, color: ad.color, fontSize: 11, padding: "3px 10px", borderRadius: 4, fontWeight: 600 }}>{ad.mood}</span>
              </div>
              <div style={{ background: C.navy, borderRadius: 8, padding: "16px 18px", marginBottom: 12 }}>
                <div style={{ color: C.muted, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Voiceover Script</div>
                <p style={{ color: C.text, fontSize: 13, lineHeight: 1.7, margin: 0, fontStyle: "italic" }}>"{ad.script}"</p>
                <p style={{ color: C.gold, fontSize: 12, margin: "10px 0 0", fontStyle: "italic" }}>— {ad.tag}</p>
              </div>
              <div style={{ color: C.textDim, fontSize: 12 }}>{ad.note}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Message testing note */}
      <div style={{ background: C.navyMid, border: `1px solid ${C.navyBorder}`, borderRadius: 12, padding: "24px 28px" }}>
        <h3 style={{ color: C.white, fontSize: 16, fontWeight: 700, margin: "0 0 12px" }}>Real-Time Message Testing</h3>
        <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>
          Within 48 hours of launch, the platform will know which message is winning in OKC versus Tulsa, by age group, by income band. The Contrast ad is expected to outperform in OKC where Echols leads 38–16. The Outsider bio is expected to outperform in Tulsa where the race is tight and Starling has home-field advantage. Budget shifts to the winner immediately — every dollar follows the data.
        </p>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function StarlingDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div style={{ minHeight: "100vh", background: C.navy, color: C.text, fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ background: C.navyMid, borderBottom: `2px solid ${C.red}`, padding: "0 20px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", flexWrap: "wrap", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <Link href="/campaigns" style={{ color: C.muted, fontSize: 13, textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
                ← Campaigns
              </Link>
              <div style={{ width: 1, height: 20, background: C.navyBorder }} />
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ color: C.white, fontWeight: 800, fontSize: 18 }}>Jeff Starling</span>
                  <span style={{ color: C.muted, fontSize: 14 }}>for Oklahoma Attorney General</span>
                  <span style={{ background: C.red, color: C.white, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4, textTransform: "uppercase" }}>PITCH</span>
                </div>
                <div style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>
                  Exact Audience · exactaudience.ai · siteid.ai · Presented by Rick Walker
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div style={{ background: C.navyLight, border: `1px solid ${C.navyBorder}`, borderRadius: 8, padding: "6px 14px", textAlign: "center" }}>
                <div style={{ color: C.muted, fontSize: 10, textTransform: "uppercase" }}>Election</div>
                <div style={{ color: C.gold, fontWeight: 700, fontSize: 13 }}>June 16, 2026</div>
              </div>
              <div style={{ background: C.navyLight, border: `1px solid ${C.navyBorder}`, borderRadius: 8, padding: "6px 14px", textAlign: "center" }}>
                <div style={{ color: C.muted, fontSize: 10, textTransform: "uppercase" }}>Budget Range</div>
                <div style={{ color: C.blueLight, fontWeight: 700, fontSize: 13 }}>$30K – $93K</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Race context banner */}
      <RaceContextBanner />

      {/* Tabs */}
      <div style={{ background: C.navyMid, borderBottom: `1px solid ${C.navyBorder}`, overflowX: "auto" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px", display: "flex", gap: 0 }}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: "transparent",
                border: "none",
                borderBottom: `3px solid ${activeTab === tab.id ? C.red : "transparent"}`,
                color: activeTab === tab.id ? C.white : C.muted,
                padding: "14px 18px",
                cursor: "pointer",
                fontWeight: activeTab === tab.id ? 700 : 400,
                fontSize: 13,
                whiteSpace: "nowrap",
                transition: "all 0.15s",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 20px" }}>
        {activeTab === "overview" && <TabOverview />}
        {activeTab === "tiers" && <TabTiers />}
        {activeTab === "channels" && <TabChannels />}
        {activeTab === "intelligence" && <TabIntelligence />}
        {activeTab === "timeline" && <TabTimeline />}
        {activeTab === "ads" && <TabAds />}
      </div>

      {/* Footer */}
      <div style={{ borderTop: `1px solid ${C.navyBorder}`, padding: "16px 20px", textAlign: "center" }}>
        <p style={{ color: C.mutedDark, fontSize: 12, margin: 0 }}>
          Exact Audience · rick@exactaudience.ai · exactaudience.ai · siteid.ai · Confidential · June 2026
        </p>
      </div>
    </div>
  );
}
