// VoterMigration.tsx — Dynamic daily voter migration & bleed risk component
// Auto-updates based on today's date relative to June 16, 2026 primary

import { useEffect, useState } from "react";
import {
  getMigrationSummary,
  getCandidateBleedRisk,
  getDaysToElection,
  getDayNumber,
  DAILY_PROGRESSION,
} from "@/lib/govDynamic";

// ── Color palette (Barrett-inspired dark purple + gold/orange) ─────────────────
const bg       = "#0c0618";
const card     = "#1a0f35";
const cardAlt  = "#130a28";
const border   = "#2a1a4a";
const accent   = "#f59e0b";
const accent2  = "#f97316";
const accent3  = "#fbbf24";
const textPrimary   = "#ffffff";
const textSecondary = "#ffffff";
const textMuted     = "#ffffff";

interface Props {
  candidateName: "Drummond" | "Keating" | "McCall" | "Mazzei";
  mode: "primary" | "runoff";
}

export default function VoterMigration({ candidateName, mode }: Props) {
  const [now, setNow] = useState(new Date());

  // Refresh every hour so the dashboard updates automatically
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const summary = getMigrationSummary();
  const daysLeft = getDaysToElection();
  const dayNum = getDayNumber();

  const candidateKey = candidateName.toLowerCase() as "drummond" | "keating" | "mccall";
  const bleed = candidateName !== "Mazzei" ? getCandidateBleedRisk(candidateKey) : null;

  const urgencyColor = summary.urgencyLevel === "critical" ? accent2 : accent;

  // ── Polling trend bar ──────────────────────────────────────────────────────
  const pollingBar = (pct: number, max: number = 40) => {
    const w = Math.round((pct / max) * 100);
    return (
      <div style={{ background: border, borderRadius: 4, height: 8, overflow: "hidden", flex: 1 }}>
        <div style={{ width: `${w}%`, height: "100%", background: `linear-gradient(90deg, ${accent}, ${accent2})`, borderRadius: 4, transition: "width 0.6s ease" }} />
      </div>
    );
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", color: textPrimary }}>

      {/* ── Header: Live Countdown ── */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: "16px 24px", flex: 1, minWidth: 140, textAlign: "center" }}>
          <div style={{ fontSize: 36, fontWeight: 900, color: urgencyColor, lineHeight: 1 }}>{daysLeft}</div>
          <div style={{ fontSize: 11, color: textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 6 }}>Days to Election</div>
        </div>
        <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: "16px 24px", flex: 1, minWidth: 140, textAlign: "center" }}>
          <div style={{ fontSize: 36, fontWeight: 900, color: accent, lineHeight: 1 }}>Day {dayNum}</div>
          <div style={{ fontSize: 11, color: textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 6 }}>of 10-Day Model</div>
        </div>
        <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: "16px 24px", flex: 2, minWidth: 200 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: urgencyColor, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
            {summary.urgencyLevel === "critical" ? "⚠ CRITICAL WINDOW" : "HIGH URGENCY"}
          </div>
          <div style={{ fontSize: 13, color: textPrimary, lineHeight: 1.5 }}>{summary.headline}</div>
        </div>
      </div>

      {/* ── Live Polling Tracker ── */}
      <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: 20, marginBottom: 16 }}>
        <h3 style={{ fontSize: 13, fontWeight: 700, color: textSecondary, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 16px" }}>
          Live Polling — Updated {summary.todayDate}
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {summary.polling.map(p => (
            <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 80, fontSize: 13, fontWeight: p.name === candidateName ? 700 : 500, color: p.name === candidateName ? accent : textPrimary }}>
                {p.name}
              </div>
              {pollingBar(p.pct)}
              <div style={{ width: 50, textAlign: "right", fontSize: 14, fontWeight: 700, color: p.name === candidateName ? accent : textPrimary }}>
                {p.pct.toFixed(1)}%
              </div>
              <div style={{ width: 40, fontSize: 11, color: p.trend === "up" ? "#22c55e" : p.trend === "down" ? accent2 : textMuted }}>
                {p.trend === "up" ? "▲" : p.trend === "down" ? "▼" : "—"}
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, fontSize: 11, color: textMuted, borderTop: `1px solid ${border}`, paddingTop: 10 }}>
          Runoff projection: <span style={{ color: accent, fontWeight: 600 }}>{summary.runoffProjection}</span>
        </div>
      </div>

      {/* ── Voter Migration Flows ── */}
      <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: 20, marginBottom: 16 }}>
        <h3 style={{ fontSize: 13, fontWeight: 700, color: textSecondary, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 16px" }}>
          Voter Migration Flows — Cumulative Through Today
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {summary.flows.map((f, i) => (
            <div key={i} style={{ background: cardAlt, border: `1px solid ${border}`, borderRadius: 8, padding: "12px 16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: textPrimary, marginBottom: 4 }}>
                    <span style={{ color: f.color }}>{f.from}</span>
                    <span style={{ color: textMuted, margin: "0 8px" }}>→</span>
                    <span style={{ color: accent }}>{f.to}</span>
                  </div>
                  <div style={{ fontSize: 12, color: textSecondary }}>{f.driver}</div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: f.color }}>{f.count.toLocaleString()}</div>
                  <div style={{ fontSize: 10, color: textMuted, textTransform: "uppercase", letterSpacing: "0.05em" }}>voters migrated</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Candidate Bleed Risk (not shown for Mazzei) ── */}
      {bleed && (
        <div style={{ background: card, border: `2px solid ${urgencyColor}`, borderRadius: 12, padding: 20, marginBottom: 16 }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: urgencyColor, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 16px" }}>
            {candidateName} Bleed Risk Analysis
          </h3>
          <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
            <div style={{ background: cardAlt, border: `1px solid ${border}`, borderRadius: 8, padding: "12px 16px", flex: 1, minWidth: 120, textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: urgencyColor }}>{bleed.atRiskPct}%</div>
              <div style={{ fontSize: 10, color: textMuted, textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 4 }}>Soft Supporters<br/>At Risk</div>
            </div>
            <div style={{ background: cardAlt, border: `1px solid ${border}`, borderRadius: 8, padding: "12px 16px", flex: 1, minWidth: 120, textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: urgencyColor }}>{bleed.atRiskToMazzei.toLocaleString()}</div>
              <div style={{ fontSize: 10, color: textMuted, textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 4 }}>Voters<br/>At Risk of Leaving</div>
            </div>
            <div style={{ background: cardAlt, border: `1px solid ${border}`, borderRadius: 8, padding: "12px 16px", flex: 1, minWidth: 120, textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: "#22c55e" }}>{bleed.retainableWithEA.toLocaleString()}</div>
              <div style={{ fontSize: 10, color: textMuted, textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 4 }}>Retainable<br/>with EA</div>
            </div>
          </div>
          <div style={{ background: cardAlt, border: `1px solid ${border}`, borderRadius: 8, padding: "12px 16px", fontSize: 13, color: textPrimary, lineHeight: 1.6 }}>
            {bleed.urgencyMessage}
          </div>
        </div>
      )}

      {/* ── Mazzei runoff message ── */}
      {candidateName === "Mazzei" && (
        <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: 20, marginBottom: 16 }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: accent, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 12px" }}>
            Runoff Position — August 25
          </h3>
          <div style={{ fontSize: 13, color: textPrimary, lineHeight: 1.7 }}>
            Mazzei is the projected primary winner at <strong style={{ color: accent }}>33.5%</strong>. The runoff opponent is most likely Drummond (27.5%). The runoff electorate will include approximately <strong style={{ color: accent }}>106,000 Keating + McCall voters</strong> who need to be absorbed before August 25. EA's runoff strategy targets those voters by name starting June 17 — the day after the primary.
          </div>
          <div style={{ marginTop: 12, display: "flex", gap: 12, flexWrap: "wrap" }}>
            {[
              { label: "Keating voters to absorb", value: "~49,000" },
              { label: "McCall voters to absorb", value: "~43,000" },
              { label: "Days to runoff", value: "70" },
              { label: "Runoff budget needed", value: "$330K–$465K" },
            ].map(s => (
              <div key={s.label} style={{ background: cardAlt, border: `1px solid ${border}`, borderRadius: 8, padding: "10px 14px", flex: 1, minWidth: 120, textAlign: "center" }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: accent }}>{s.value}</div>
                <div style={{ fontSize: 10, color: textMuted, textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 10-Day Progression Chart ── */}
      <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: 20 }}>
        <h3 style={{ fontSize: 13, fontWeight: 700, color: textSecondary, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 16px" }}>
          10-Day Projection Model — Polling Trajectory
        </h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${border}` }}>
                {["Date", "Mazzei", "Drummond", "Keating", "McCall", "Status"].map(h => (
                  <th key={h} style={{ padding: "8px 10px", textAlign: h === "Date" || h === "Status" ? "left" : "center", color: textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", fontSize: 10 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DAILY_PROGRESSION.slice(0, 10).map((d, i) => {
                const isToday = i === dayNum;
                const rowBg = isToday ? `${accent}18` : "transparent";
                return (
                  <tr key={d.day} style={{ background: rowBg, borderBottom: `1px solid ${border}` }}>
                    <td style={{ padding: "8px 10px", color: isToday ? accent : textPrimary, fontWeight: isToday ? 700 : 400 }}>
                      {d.date}{isToday ? " ◀ Today" : ""}
                    </td>
                    <td style={{ padding: "8px 10px", textAlign: "center", color: accent, fontWeight: 600 }}>{d.mazzei.toFixed(1)}%</td>
                    <td style={{ padding: "8px 10px", textAlign: "center", color: textPrimary }}>{d.drummond.toFixed(1)}%</td>
                    <td style={{ padding: "8px 10px", textAlign: "center", color: textPrimary }}>{d.keating.toFixed(1)}%</td>
                    <td style={{ padding: "8px 10px", textAlign: "center", color: textPrimary }}>{d.mccall.toFixed(1)}%</td>
                    <td style={{ padding: "8px 10px", fontSize: 11, color: d.urgencyLevel === "critical" ? accent2 : accent }}>
                      {d.urgencyLevel === "critical" ? "⚠ Critical" : "High"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: 10, fontSize: 11, color: textMuted }}>
          Model updates automatically each day. Projections based on historical Trump-endorsement bandwagon effects in 4-way Republican primaries (2018–2024 comparable races).
        </div>
      </div>

    </div>
  );
}
