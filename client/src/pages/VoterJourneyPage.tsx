// VoterJourneyPage.tsx — Full voter journey detail page
// Accessed via /voter/:id?from=candidateSlug
// Design: dark purple bg, gold/orange accents — matches Barrett SiteID buyer profile style
// Shows: profile hero, voter DNA, lookback/campaign timeline, persuasion windows,
//        media mix allocation, per-channel personalized messaging

import { useParams, useLocation } from "wouter";
import { getVoterById, getStatusColor, getMoveProbabilityColor } from "@/lib/voterProfiles";

const C = {
  bg: "#0c0618",
  card: "#130a28",
  card2: "#1a0d35",
  border: "#2a1a4a",
  gold: "#f59e0b",
  orange: "#f97316",
  white: "#ffffff",
  muted: "rgba(255,255,255,0.55)",
};

function channelIcon(channel: string): string {
  const c = channel.toLowerCase();
  if (c.includes("ctv") || c.includes("hulu") || c.includes("peacock") || c.includes("tubi") || c.includes("pluto") || c.includes("samsung") || c.includes("kfor") || c.includes("kwtv") || c.includes("kotv") || c.includes("kjrh") || c.includes("oeta") || c.includes("newsmax") || c.includes("fox news") || c.includes("fox business") || c.includes("oan")) return "📺";
  if (c.includes("email")) return "✉️";
  if (c.includes("facebook") || c.includes("instagram")) return "📘";
  if (c.includes("linkedin")) return "💼";
  if (c.includes("google") || c.includes("search")) return "🔍";
  if (c.includes("sms") || c.includes("text")) return "💬";
  if (c.includes("reddit")) return "🟠";
  if (c.includes("youtube")) return "▶️";
  if (c.includes("truth social")) return "🇺🇸";
  if (c.includes("retarget") || c.includes("display")) return "🎯";
  if (c.includes("mail") && !c.includes("email")) return "📬";
  return "🌐";
}

function msgColor(channel: string): string {
  const c = channel.toLowerCase();
  if (c.includes("email")) return "#10b981";
  if (c.includes("ctv") || c.includes("tv")) return "#f59e0b";
  if (c.includes("facebook") || c.includes("instagram") || c.includes("meta")) return "#1877f2";
  if (c.includes("linkedin")) return "#0a66c2";
  if (c.includes("sms") || c.includes("text")) return "#f97316";
  if (c.includes("retarget") || c.includes("display")) return "#7c3aed";
  if (c.includes("mail") && !c.includes("email")) return "#38bdf8";
  if (c.includes("google")) return "#fbbc04";
  return "#818cf8";
}

function StrengthBadge({ strength }: { strength: "low" | "medium" | "high" | "very-high" }) {
  const map = {
    "low":       { label: "Low",       bg: "#1f2937", color: "#9ca3af" },
    "medium":    { label: "Medium",    bg: "#1e3a5f", color: "#60a5fa" },
    "high":      { label: "High",      bg: "#14532d", color: "#4ade80" },
    "very-high": { label: "Very High", bg: "#4c1d95", color: "#c084fc" },
  };
  const s = map[strength];
  return (
    <span style={{ background: s.bg, color: s.color, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, letterSpacing: "0.06em", textTransform: "uppercase" as const, whiteSpace: "nowrap" as const }}>
      {s.label}
    </span>
  );
}

function signalDotColor(signal: "positive" | "neutral" | "negative", phase: "lookback" | "campaign"): string {
  if (phase === "lookback") return "#fbbf24";
  if (signal === "positive") return "#34d399";
  if (signal === "negative") return "#f87171";
  return "#818cf8";
}

function ProbBar({ probability, color }: { probability: number; color: string }) {
  return (
    <div style={{ width: "100%", height: 8, background: "rgba(255,255,255,0.08)", borderRadius: 4, overflow: "hidden" }}>
      <div style={{ width: `${probability}%`, height: "100%", background: color, borderRadius: 4 }} />
    </div>
  );
}

function getSignalColor(signal: "positive" | "neutral" | "negative"): string {
  if (signal === "positive") return "#22c55e";
  if (signal === "negative") return "#f97316";
  return "#f59e0b";
}

function getSignalLabel(signal: "positive" | "neutral" | "negative"): string {
  if (signal === "positive") return "Strong Signal";
  if (signal === "negative") return "Bleed Risk";
  return "Monitoring";
}

export default function VoterJourneyPage() {
  const { id } = useParams<{ id: string }>();
  const [location, navigate] = useLocation();

  const fromSlug = new URLSearchParams(location.split("?")[1] || "").get("from") || "drummond";
  const voter = getVoterById(id || "");

  if (!voter) {
    return (
      <div style={{ background: C.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
          <div style={{ color: C.white, fontSize: 18, fontWeight: 700 }}>Voter profile not found</div>
          <button onClick={() => navigate(`/pitch/${fromSlug}`)} style={{ marginTop: 20, padding: "10px 24px", background: C.gold, color: "#0c0618", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 800 }}>← Back to Dashboard</button>
        </div>
      </div>
    );
  }

  const statusColor = getStatusColor(voter.status);
  const initials = `${voter.firstName[0]}${voter.lastName[0]}`;
  const positiveSignals = voter.journey.filter(j => j.signal === "positive").length;
  const negativeSignals = voter.journey.filter(j => j.signal === "negative").length;
  const lookbackSteps = voter.journey.filter(j => j.phase === "lookback");
  const campaignSteps = voter.journey.filter(j => j.phase === "campaign");
  const windowColors = ["#34d399", "#fbbf24", "#f59e0b"];

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.35s ease-out both; }
        * { box-sizing: border-box; }
      `}</style>

      {/* Sticky Header */}
      <div style={{ background: "#0a0618", padding: "0 24px", height: 58, display: "flex", alignItems: "center", gap: 16, position: "sticky", top: 0, zIndex: 100, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <button onClick={() => navigate(`/pitch/${fromSlug}`)} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, padding: "5px 14px", color: C.white, fontSize: 12, cursor: "pointer", fontWeight: 600 }}>← Dashboard</button>
        <div style={{ width: 1, height: 24, background: "rgba(255,255,255,0.15)" }} />
        <span style={{ fontSize: 11, color: C.muted }}>Voter Intelligence / {voter.firstName} {voter.lastName}</span>
      </div>

      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "32px 24px 80px" }}>

        {/* Profile Hero */}
        <div className="fade-up" style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 24, alignItems: "center", background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: "28px 32px", marginBottom: 24, borderTop: `4px solid ${statusColor}` }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: `linear-gradient(135deg, ${statusColor}cc, #f97316cc)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 800, color: "#0c0618", flexShrink: 0, boxShadow: `0 0 28px ${statusColor}44` }}>
            {initials}
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 4 }}>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: C.white, margin: 0 }}>{voter.firstName} {voter.lastName}</h1>
              <span style={{ padding: "4px 12px", borderRadius: 20, border: `1px solid ${statusColor}`, color: statusColor, fontSize: 11, fontWeight: 700, letterSpacing: "0.06em" }}>{voter.status.toUpperCase()}</span>
            </div>
            <div style={{ color: C.muted, fontSize: 13, marginBottom: 6 }}>{voter.age} · {voter.occupation} · {voter.city}, {voter.state} {voter.zip} · {voter.county} County</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {voter.tags.map(tag => (<span key={tag} style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", color: C.gold, fontSize: 10, fontWeight: 600, padding: "3px 10px", borderRadius: 20 }}>{tag}</span>))}
            </div>
          </div>
          <div style={{ textAlign: "center", flexShrink: 0 }}>
            <div style={{ fontSize: 44, fontWeight: 900, color: getMoveProbabilityColor(voter.moveProbability), lineHeight: 1 }}>{voter.moveProbability}%</div>
            <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase" as const, letterSpacing: "0.08em", marginTop: 4 }}>Move Probability</div>
          </div>
        </div>

        {/* Stats row */}
        <div className="fade-up" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 20 }}>
          {[
            { label: "Ad Touches", value: voter.adTouches, color: C.gold },
            { label: "Lookback Signals", value: lookbackSteps.length, color: "#fbbf24" },
            { label: "Campaign Touches", value: campaignSteps.length, color: "#818cf8" },
            { label: "Positive Signals", value: positiveSignals, color: "#34d399" },
            { label: "Bleed Signals", value: negativeSignals, color: "#f87171" },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "14px", textAlign: "center" }}>
              <div style={{ fontSize: 26, fontWeight: 800, color, marginBottom: 4 }}>{value}</div>
              <div style={{ fontSize: 10, color: C.muted }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Voter DNA */}
        <div className="fade-up" style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)", borderRadius: 14, padding: "18px 24px", marginBottom: 20 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.gold, textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 8 }}>🧬 Voter DNA</div>
          <div style={{ fontSize: 14, color: C.white, lineHeight: 1.7 }}>{voter.voterDNA}</div>
        </div>

        {/* Journey Summary */}
        <div className="fade-up" style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "18px 24px", marginBottom: 24 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 8 }}>Journey Summary</div>
          <div style={{ fontSize: 14, color: C.white, lineHeight: 1.7 }}>{voter.journeySummary}</div>
        </div>

        {/* Two-column: Timeline + Right panel */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>

          {/* Digital Footprint Timeline */}
          <div className="fade-up" style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "20px 24px" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 16 }}>📡 Digital Footprint — Full Signal Timeline</div>

            {/* Lookback phase */}
            {lookbackSteps.length > 0 && (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <div style={{ flex: 1, height: 1, background: "rgba(251,191,36,0.3)" }} />
                  <div style={{ fontSize: 9, fontWeight: 800, textTransform: "uppercase" as const, letterSpacing: "0.14em", padding: "3px 10px", borderRadius: 20, background: "rgba(251,191,36,0.12)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.3)", whiteSpace: "nowrap" as const }}>30-Day Lookback Window</div>
                  <div style={{ flex: 1, height: 1, background: "rgba(251,191,36,0.3)" }} />
                </div>
                {lookbackSteps.map((step, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "44px 1fr", gap: 10, paddingBottom: 14, position: "relative" }}>
                    {i < lookbackSteps.length - 1 && (<div style={{ position: "absolute", left: 21, top: 22, bottom: 0, width: 2, background: "rgba(251,191,36,0.2)" }} />)}
                    <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", gap: 3, zIndex: 1 }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#fbbf24", boxShadow: "0 0 8px rgba(251,191,36,0.5)", marginTop: 4 }} />
                      <div style={{ fontSize: 9, color: C.muted, textAlign: "center" as const, lineHeight: 1.2 }}>{step.date}</div>
                    </div>
                    <div style={{ background: C.card2, border: "1px solid rgba(251,191,36,0.15)", borderRadius: 10, padding: "9px 12px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3, gap: 6 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: C.gold, display: "flex", alignItems: "center", gap: 4 }}><span>{channelIcon(step.channel)}</span><span>{step.channel}</span></div>
                        <StrengthBadge strength={step.strength} />
                      </div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: C.white, marginBottom: 3 }}>{step.action}</div>
                      <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.5 }}>{step.detail}</div>
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* Campaign phase */}
            {campaignSteps.length > 0 && (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, marginTop: lookbackSteps.length > 0 ? 8 : 0 }}>
                  <div style={{ flex: 1, height: 1, background: "rgba(129,140,248,0.3)" }} />
                  <div style={{ fontSize: 9, fontWeight: 800, textTransform: "uppercase" as const, letterSpacing: "0.14em", padding: "3px 10px", borderRadius: 20, background: "rgba(129,140,248,0.12)", color: "#818cf8", border: "1px solid rgba(129,140,248,0.3)", whiteSpace: "nowrap" as const }}>Campaign Period</div>
                  <div style={{ flex: 1, height: 1, background: "rgba(129,140,248,0.3)" }} />
                </div>
                {campaignSteps.map((step, i) => {
                  const dotColor = signalDotColor(step.signal, step.phase);
                  const borderCol = step.signal === "positive" ? "rgba(52,211,153,0.2)" : step.signal === "negative" ? "rgba(248,113,113,0.2)" : "rgba(129,140,248,0.15)";
                  return (
                    <div key={i} style={{ display: "grid", gridTemplateColumns: "44px 1fr", gap: 10, paddingBottom: i < campaignSteps.length - 1 ? 14 : 0, position: "relative" }}>
                      {i < campaignSteps.length - 1 && (<div style={{ position: "absolute", left: 21, top: 22, bottom: 0, width: 2, background: "rgba(129,140,248,0.2)" }} />)}
                      <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", gap: 3, zIndex: 1 }}>
                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: dotColor, boxShadow: `0 0 8px ${dotColor}66`, marginTop: 4 }} />
                        <div style={{ fontSize: 9, color: C.muted, textAlign: "center" as const, lineHeight: 1.2 }}>{step.date}</div>
                      </div>
                      <div style={{ background: C.card2, border: `1px solid ${borderCol}`, borderRadius: 10, padding: "9px 12px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3, gap: 6 }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: dotColor, display: "flex", alignItems: "center", gap: 4 }}><span>{channelIcon(step.channel)}</span><span>{step.channel}</span></div>
                          <StrengthBadge strength={step.strength} />
                        </div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: C.white, marginBottom: 3 }}>{step.action}</div>
                        <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.5 }}>{step.detail}</div>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>

          {/* Right column */}
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 20 }}>

            {/* Persuasion Windows */}
            <div className="fade-up" style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "20px 24px" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 16 }}>🎯 Predicted Persuasion Windows</div>
              <div style={{ display: "flex", flexDirection: "column" as const, gap: 18 }}>
                {voter.persuasionWindows.map((pw, i) => (
                  <div key={pw.window}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: C.white }}>{pw.window}</div>
                      <div style={{ fontSize: 20, fontWeight: 900, color: windowColors[i] }}>{pw.probability}%</div>
                    </div>
                    <ProbBar probability={pw.probability} color={windowColors[i]} />
                    <div style={{ fontSize: 11, color: C.muted, marginTop: 6, lineHeight: 1.5 }}>{pw.reasoning}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Media Mix */}
            <div className="fade-up" style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "20px 24px" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 16 }}>📊 Recommended Media Mix</div>
              <div style={{ display: "flex", flexDirection: "column" as const, gap: 14 }}>
                {voter.mediaRecommendations.map((rec, i) => (
                  <div key={i}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 15 }}>{channelIcon(rec.channel)}</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: C.white }}>{rec.channel}</span>
                      </div>
                      <span style={{ fontSize: 14, fontWeight: 800, color: rec.color }}>{rec.allocation}%</span>
                    </div>
                    <div style={{ width: "100%", height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3, marginBottom: 4, overflow: "hidden" }}>
                      <div style={{ width: `${rec.allocation}%`, height: "100%", background: rec.color, borderRadius: 3 }} />
                    </div>
                    <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.5 }}>{rec.tactic}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Voting History + Signal */}
            <div className="fade-up" style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "20px 24px" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 12 }}>🗳️ Voting History & Signal</div>
              <div style={{ display: "flex", flexDirection: "column" as const, gap: 12 }}>
                {[
                  { label: "Primary Voting History", value: voter.primaryVotingHistory },
                  { label: "Current Behavioral Signal", value: voter.currentSignal },
                  { label: "Ad Touches to Date", value: `${voter.adTouches} confirmed exposures` },
                ].map(item => (
                  <div key={item.label} style={{ background: C.card2, borderRadius: 10, padding: "12px 14px", border: `1px solid ${C.border}` }}>
                    <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 4 }}>{item.label}</div>
                    <div style={{ fontSize: 13, color: C.white, lineHeight: 1.55 }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Per-Channel Suggested Messaging */}
        <div className="fade-up" style={{ background: C.card, border: "1px solid rgba(245,158,11,0.3)", borderRadius: 14, padding: "24px 28px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.gold, textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 20 }}>✉️ Recommended Per-Channel Messaging — Personalized to {voter.firstName}'s Journey</div>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 16 }}>
            {voter.channelMessages.map((msg, i) => {
              const col = msgColor(msg.channel);
              return (
                <div key={i} style={{ background: C.card2, border: `1px solid ${col}33`, borderRadius: 12, padding: "18px 20px", borderLeft: `3px solid ${col}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                    <span style={{ fontSize: 18 }}>{channelIcon(msg.channel)}</span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: col, textTransform: "uppercase" as const, letterSpacing: "0.06em" }}>{msg.channel}</span>
                    <div style={{ flex: 1, height: 1, background: `${col}22` }} />
                    <span style={{ fontSize: 10, color: C.muted, fontStyle: "italic" }}>Tactic: {msg.tactic}</span>
                  </div>
                  {msg.subject && (
                    <div style={{ marginBottom: 10 }}>
                      <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 4 }}>Subject Line</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: C.white, background: `${col}0d`, padding: "8px 12px", borderRadius: 8, border: `1px solid ${col}22` }}>{msg.subject}</div>
                    </div>
                  )}
                  <div>
                    <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 6 }}>{msg.subject ? "Message Body" : "Messaging Guidance"}</div>
                    <div style={{ fontSize: 12, color: C.white, lineHeight: 1.75, whiteSpace: "pre-wrap" as const, background: "rgba(255,255,255,0.03)", padding: "12px 14px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.06)" }}>{msg.body}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
