/**
 * VoterCard.tsx
 * Voter profile card — matches Barrett Financial SiteID buyer card style.
 * Shows: avatar, voter DNA, persuasion windows (3), tags, channel count, VIEW FULL JOURNEY →
 * Design: dark purple #0c0618, card #1a0d35, gold #f59e0b, orange #f97316, white text
 */

import { useLocation } from "wouter";
import type { VoterProfile } from "@/lib/voterProfiles";
import { getStatusColor, getMoveProbabilityColor } from "@/lib/voterProfiles";

// ── Channel icon map ──────────────────────────────────────────────────────────
function channelIcon(channel: string): string {
  const c = channel.toLowerCase();
  if (c.includes("ctv") || c.includes("tv") || c.includes("hulu") || c.includes("peacock") || c.includes("tubi") || c.includes("pluto") || c.includes("samsung") || c.includes("kfor") || c.includes("kwtv") || c.includes("kotv") || c.includes("kjrh") || c.includes("oeta")) return "📺";
  if (c.includes("email")) return "✉️";
  if (c.includes("facebook") || c.includes("instagram") || c.includes("meta")) return "📘";
  if (c.includes("linkedin")) return "💼";
  if (c.includes("google") || c.includes("search")) return "🔍";
  if (c.includes("sms") || c.includes("text")) return "💬";
  if (c.includes("reddit")) return "🟠";
  if (c.includes("youtube")) return "▶️";
  if (c.includes("truth social")) return "🇺🇸";
  if (c.includes("retarget") || c.includes("display")) return "🎯";
  if (c.includes("mail")) return "📬";
  if (c.includes("campaign site") || c.includes("website")) return "🌐";
  return "📡";
}

// ── Probability bar ───────────────────────────────────────────────────────────
function ProbBar({ value, color }: { value: number; color: string }) {
  return (
    <div style={{ width: "100%", height: 5, background: "rgba(255,255,255,0.08)", borderRadius: 3, overflow: "hidden", marginTop: 4 }}>
      <div style={{ width: `${value}%`, height: "100%", background: color, borderRadius: 3, transition: "width 0.8s ease-out" }} />
    </div>
  );
}

interface VoterCardProps {
  voter: VoterProfile;
  candidateSlug: string;
}

export function VoterCard({ voter, candidateSlug }: VoterCardProps) {
  const [, navigate] = useLocation();

  const initials = `${voter.firstName[0]}${voter.lastName[0]}`;
  const statusColor = getStatusColor(voter.status);

  // Derive unique channels touched
  const uniqueChannels = Array.from(new Set(voter.journey.map(j => {
    const c = j.channel.toLowerCase();
    if (c.includes("ctv") || c.includes("tv") || c.includes("hulu") || c.includes("peacock") || c.includes("tubi") || c.includes("pluto") || c.includes("samsung") || c.includes("kfor") || c.includes("kwtv") || c.includes("kotv") || c.includes("kjrh") || c.includes("oeta")) return "CTV";
    if (c.includes("email")) return "Email";
    if (c.includes("facebook") || c.includes("instagram") || c.includes("meta")) return "Facebook/Meta";
    if (c.includes("linkedin")) return "LinkedIn";
    if (c.includes("google") || c.includes("search")) return "Google";
    if (c.includes("sms")) return "SMS";
    if (c.includes("reddit")) return "Reddit";
    if (c.includes("youtube")) return "YouTube";
    if (c.includes("truth social")) return "Truth Social";
    if (c.includes("campaign site") || c.includes("website")) return "Campaign Site";
    return "Other";
  })));

  const lookbackCount = voter.journey.filter(j => j.phase === "lookback").length;
  const campaignCount = voter.journey.filter(j => j.phase === "campaign").length;
  const positiveCount = voter.journey.filter(j => j.signal === "positive").length;

  const handleViewJourney = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/voter/${voter.id}?from=${candidateSlug}`);
  };

  return (
    <div
      onClick={handleViewJourney}
      style={{
        background: "#1a0d35",
        border: "1px solid #2a1a4a",
        borderRadius: 16,
        padding: "24px",
        cursor: "pointer",
        transition: "border-color 0.2s, transform 0.15s, box-shadow 0.2s",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        gap: 0,
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = "#f59e0b";
        el.style.transform = "translateY(-3px)";
        el.style.boxShadow = "0 8px 32px rgba(245,158,11,0.15)";
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = "#2a1a4a";
        el.style.transform = "translateY(0)";
        el.style.boxShadow = "none";
      }}
    >
      {/* Top accent bar */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 3,
        background: `linear-gradient(90deg, ${statusColor}, #f97316)`,
        borderRadius: "16px 16px 0 0",
      }} />

      {/* Header: avatar + name + status */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 14, marginTop: 4 }}>
        {/* Avatar */}
        <div style={{
          width: 52, height: 52, borderRadius: "50%", flexShrink: 0,
          background: `linear-gradient(135deg, ${statusColor}cc, #f97316cc)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 17, fontWeight: 800, color: "#0c0618",
          boxShadow: `0 0 18px ${statusColor}44`,
        }}>
          {initials}
        </div>

        {/* Name + details */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#ffffff", marginBottom: 2, lineHeight: 1.2 }}>
            {voter.firstName} {voter.lastName}
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", marginBottom: 6 }}>
            {voter.age} · {voter.occupation}
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>
            📍 {voter.city}, {voter.state} · {voter.county} County
          </div>
        </div>

        {/* Status badge */}
        <div style={{
          padding: "4px 10px", borderRadius: 20, flexShrink: 0,
          border: `1px solid ${statusColor}66`,
          background: `${statusColor}18`,
          color: statusColor,
          fontSize: 10, fontWeight: 700, letterSpacing: "0.06em",
          whiteSpace: "nowrap", textTransform: "uppercase",
        }}>
          {voter.status}
        </div>
      </div>

      {/* Voter DNA */}
      <div style={{
        background: "rgba(245,158,11,0.07)",
        border: "1px solid rgba(245,158,11,0.18)",
        borderRadius: 10, padding: "11px 13px", marginBottom: 14,
      }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#f59e0b", letterSpacing: "0.1em", marginBottom: 5, textTransform: "uppercase" }}>
          🧬 Voter DNA
        </div>
        <div style={{ fontSize: 12, color: "#ffffff", lineHeight: 1.55, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {voter.voterDNA}
        </div>
      </div>

      {/* Persuasion windows — 3 columns */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
        {voter.persuasionWindows.map((pw, i) => {
          const col = getMoveProbabilityColor(pw.probability);
          return (
            <div key={i} style={{
              background: "rgba(255,255,255,0.04)",
              borderRadius: 10, padding: "10px 8px", textAlign: "center",
            }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: col, lineHeight: 1, marginBottom: 3 }}>
                {pw.probability}%
              </div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", lineHeight: 1.3 }}>{pw.window}</div>
              <ProbBar value={pw.probability} color={col} />
            </div>
          );
        })}
      </div>

      {/* Signal stats row */}
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {[
          { label: "Lookback signals", value: lookbackCount, color: "#fbbf24" },
          { label: "Campaign touches", value: campaignCount, color: "#818cf8" },
          { label: "Positive signals", value: positiveCount, color: "#34d399" },
        ].map(stat => (
          <div key={stat.label} style={{
            flex: 1, background: "rgba(255,255,255,0.04)", borderRadius: 8,
            padding: "8px 6px", textAlign: "center",
          }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: stat.color, lineHeight: 1 }}>{stat.value}</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", marginTop: 2, lineHeight: 1.3 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Channel icons touched */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 14 }}>
        {uniqueChannels.slice(0, 8).map(ch => (
          <span key={ch} style={{
            padding: "3px 9px", borderRadius: 20, fontSize: 11,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.8)",
            display: "flex", alignItems: "center", gap: 4,
          }}>
            <span>{channelIcon(ch)}</span>
            <span style={{ fontSize: 10 }}>{ch}</span>
          </span>
        ))}
        {uniqueChannels.length > 8 && (
          <span style={{ padding: "3px 9px", borderRadius: 20, fontSize: 10, background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.5)" }}>
            +{uniqueChannels.length - 8} more
          </span>
        )}
      </div>

      {/* Tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 18 }}>
        {voter.tags.slice(0, 4).map(tag => (
          <span key={tag} style={{
            padding: "3px 9px", borderRadius: 20, fontSize: 10, fontWeight: 600,
            background: "rgba(245,158,11,0.1)",
            border: "1px solid rgba(245,158,11,0.2)",
            color: "#f59e0b",
          }}>
            {tag}
          </span>
        ))}
      </div>

      {/* VIEW FULL JOURNEY CTA */}
      <div style={{ marginTop: "auto" }}>
        <button
          onClick={handleViewJourney}
          style={{
            width: "100%",
            background: "rgba(245,158,11,0.1)",
            border: "1px solid rgba(245,158,11,0.35)",
            borderRadius: 10,
            padding: "11px 16px",
            cursor: "pointer",
            color: "#f59e0b",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.07em",
            textTransform: "uppercase",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            transition: "background 0.15s, border-color 0.15s",
          }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLButtonElement;
            el.style.background = "rgba(245,158,11,0.2)";
            el.style.borderColor = "rgba(245,158,11,0.6)";
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLButtonElement;
            el.style.background = "rgba(245,158,11,0.1)";
            el.style.borderColor = "rgba(245,158,11,0.35)";
          }}
        >
          VIEW FULL JOURNEY →
        </button>
      </div>
    </div>
  );
}
