/**
 * BuyerProfilePage.tsx
 * Full buyer journey detail view — shown when clicking a buyer profile from the People tab.
 * Shows: identity, buyer DNA, engagement timeline, intent signals, purchase window predictions,
 * personalized messaging, and recommended media mix.
 */

import { useParams, useLocation } from "wouter";
import { getProfileById, type BuyerProfile } from "@/lib/buyerProfiles";
import { useTheme } from "@/contexts/ThemeContext";

// ── Signal strength badge ─────────────────────────────────────────────────────
function StrengthBadge({ strength }: { strength: BuyerProfile["signals"][0]["strength"] }) {
  const map = {
    "low":       { label: "Low",       bg: "#374151", color: "#9ca3af" },
    "medium":    { label: "Medium",    bg: "#1e3a5f", color: "#60a5fa" },
    "high":      { label: "High",      bg: "#14532d", color: "#4ade80" },
    "very-high": { label: "Very High", bg: "#4c1d95", color: "#c084fc" },
  };
  const s = map[strength];
  return (
    <span style={{ background: s.bg, color: s.color, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, letterSpacing: "0.06em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
      {s.label}
    </span>
  );
}

// ── Purchase window bar ───────────────────────────────────────────────────────
function ProbabilityBar({ probability, color }: { probability: number; color: string }) {
  return (
    <div style={{ width: "100%", height: 8, background: "rgba(255,255,255,0.08)", borderRadius: 4, overflow: "hidden" }}>
      <div style={{ width: `${probability}%`, height: "100%", background: color, borderRadius: 4, transition: "width 1s ease-out" }} />
    </div>
  );
}

// ── Channel color map ─────────────────────────────────────────────────────────
function ChannelIcon({ channel }: { channel: string }) {
  const icons: Record<string, string> = {
    "CTV": "📺", "CTV Retargeting": "📺", "CTV (Premium)": "📺", "CTV (Performance)": "📺", "CTV (Education)": "📺",
    "Email": "✉️", "Email (Personalized)": "✉️", "Email (Conversion)": "✉️", "Email (Cart Recovery)": "✉️",
    "Email (Urgency)": "✉️", "Email (Application Recovery)": "✉️", "Email (Advisor)": "✉️",
    "Email (Gift + Self)": "✉️", "Email (Financing Focus)": "✉️", "Email (Experience)": "✉️",
    "Email (Nurture)": "✉️", "Email (Reminder)": "✉️", "Email (VIP 1:1)": "✉️",
    "Meta": "📘", "Meta (Retargeting)": "📘", "Meta (Luxury Retargeting)": "📘",
    "Meta (Content)": "📘", "Meta (Urgency)": "📘",
    "Google": "🔍", "Google Retargeting": "🔍", "Google (Brand)": "🔍", "Google (Conquest)": "🔍",
    "Google (Search)": "🔍", "Google (Brand Defense)": "🔍", "Google (Gift Search)": "🔍",
    "Google (Education)": "🔍",
    "QR Code Activation": "📱", "Direct Mail": "📬", "Direct Mail (Luxury)": "📬",
    "SMS/Push": "💬", "SMS/Advisor Outreach": "💬",
    "YouTube Retargeting": "▶️",
  };
  return <span style={{ fontSize: 16 }}>{icons[channel] ?? "📡"}</span>;
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function BuyerProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { theme } = useTheme();
  const dark = theme === "dark";

  const profile = getProfileById(id ?? "");

  const C = dark ? {
    bg: "#07071a", bg2: "#0d0d28", card: "#0f0f2e", card2: "#141440",
    border: "#252560", white: "#f1f5f9", muted: "#8892b0",
    headerBg: "linear-gradient(135deg,#0a0a22,#1a0840)",
  } : {
    bg: "#f0f4f8", bg2: "#e8edf5", card: "#ffffff", card2: "#f8fafc",
    border: "#c8d4e8", white: "#1e293b", muted: "#64748b",
    headerBg: "linear-gradient(135deg,#1e1b4b,#312e81)",
  };

  // Back route based on dashboard
  const backRoutes: Record<string, string> = {
    "land-rover": "/",
    "lamborghini": "/lamborghini",
    "warby-parker": "/warby-parker",
    "policygenius": "/policygenius",
  };

  if (!profile) {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", color: C.white, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>Profile not found</div>
          <button onClick={() => navigate("/campaigns")} style={{ marginTop: 20, padding: "10px 24px", background: "#7c3aed", color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 700 }}>
            ← Back to Campaigns
          </button>
        </div>
      </div>
    );
  }

  const backRoute = backRoutes[profile.dashboardId] ?? "/campaigns";
  const windowColors = ["#4ade80", "#f59e0b", "#38bdf8"];

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif", color: C.white }}>
      <style>{`
        @keyframes pdot{0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        .fade-up{animation:fadeUp 0.4s ease-out both;}
        * { box-sizing: border-box; }
      `}</style>

      {/* Header */}
      <div style={{ background: C.headerBg, padding: "0 24px", height: 60, display: "flex", alignItems: "center", gap: 16, position: "sticky", top: 0, zIndex: 100, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <button onClick={() => navigate(backRoute)} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 8, padding: "5px 12px", color: "#f1f5f9", fontSize: 11, cursor: "pointer", whiteSpace: "nowrap" }}>
          ← Dashboard
        </button>
        <div style={{ width: 1, height: 24, background: "rgba(255,255,255,0.2)" }} />
        <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.18em", color: "#f1f5f9" }}>EXACT AUDIENCE</span>
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>/ Buyer Profile</span>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px 60px" }}>

        {/* ── Profile Hero ── */}
        <div className="fade-up" style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 24, alignItems: "center", background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: "28px 32px", marginBottom: 24, borderTop: `4px solid ${profile.avatarColor}` }}>
          {/* Avatar */}
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: profile.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 800, color: "#ffffff", flexShrink: 0, boxShadow: `0 0 24px ${profile.avatarColor}44` }}>
            {profile.avatar}
          </div>
          {/* Identity */}
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: C.white, marginBottom: 4 }}>{profile.name}</div>
            <div style={{ fontSize: 13, color: C.muted, marginBottom: 8 }}>{profile.age} · {profile.occupation} · {profile.location}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {profile.tags.map(tag => (
                <span key={tag} style={{ background: `${profile.avatarColor}22`, border: `1px solid ${profile.avatarColor}44`, color: profile.avatarColor, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, letterSpacing: "0.06em" }}>{tag}</span>
              ))}
            </div>
          </div>
          {/* Engagement score */}
          <div style={{ textAlign: "center", flexShrink: 0 }}>
            <div style={{ fontSize: 36, fontWeight: 900, color: profile.avatarColor, lineHeight: 1 }}>{profile.engagementScore}</div>
            <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 4 }}>Engagement<br />Score</div>
          </div>
        </div>

        {/* ── Buyer DNA ── */}
        <div className="fade-up" style={{ background: `${profile.avatarColor}18`, border: `1px solid ${profile.avatarColor}44`, borderRadius: 14, padding: "18px 24px", marginBottom: 24 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: profile.avatarColor, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8 }}>🧬 Buyer DNA</div>
          <div style={{ fontSize: 14, color: C.white, lineHeight: 1.7 }}>{profile.buyerDNA}</div>
        </div>

        {/* ── Journey Summary ── */}
        <div className="fade-up" style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "20px 24px", marginBottom: 24 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 10 }}>Journey Summary</div>
          <div style={{ fontSize: 14, color: C.white, lineHeight: 1.7 }}>{profile.journeySummary}</div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>

          {/* ── Intent Signals Timeline ── */}
          <div className="fade-up" style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "20px 24px" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 16 }}>📡 Intent Signals — Engagement Timeline</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {profile.signals.map((signal, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "56px 1fr", gap: 12, paddingBottom: 16, position: "relative" }}>
                  {/* Timeline line */}
                  {i < profile.signals.length - 1 && (
                    <div style={{ position: "absolute", left: 27, top: 28, bottom: 0, width: 2, background: `${profile.avatarColor}33` }} />
                  )}
                  {/* Date bubble */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, zIndex: 1 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: profile.avatarColor, boxShadow: `0 0 8px ${profile.avatarColor}66`, marginTop: 4 }} />
                    <div style={{ fontSize: 9, color: C.muted, textAlign: "center", lineHeight: 1.2 }}>{signal.date}</div>
                  </div>
                  {/* Signal content */}
                  <div style={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4, gap: 8 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: profile.avatarColor }}>{signal.channel}</div>
                      <StrengthBadge strength={signal.strength} />
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: C.white, marginBottom: 3 }}>{signal.action}</div>
                    <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.5 }}>{signal.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right column ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Purchase Windows */}
            <div className="fade-up" style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "20px 24px" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 16 }}>🎯 Predicted Purchase Windows</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {profile.purchaseWindows.map((pw, i) => (
                  <div key={pw.window}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: C.white }}>{pw.window}</div>
                      <div style={{ fontSize: 18, fontWeight: 900, color: windowColors[i] }}>{pw.probability}%</div>
                    </div>
                    <ProbabilityBar probability={pw.probability} color={windowColors[i]} />
                    <div style={{ fontSize: 11, color: C.muted, marginTop: 6, lineHeight: 1.5 }}>{pw.reasoning}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Media Mix */}
            <div className="fade-up" style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "20px 24px" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 16 }}>📊 Recommended Media Mix</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {profile.mediaRecommendations.map((rec, i) => (
                  <div key={i}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <ChannelIcon channel={rec.channel} />
                        <span style={{ fontSize: 12, fontWeight: 700, color: C.white }}>{rec.channel}</span>
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 800, color: rec.color }}>{rec.allocation}%</span>
                    </div>
                    <div style={{ width: "100%", height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3, marginBottom: 4, overflow: "hidden" }}>
                      <div style={{ width: `${rec.allocation}%`, height: "100%", background: rec.color, borderRadius: 3 }} />
                    </div>
                    <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.5 }}>{rec.tactic}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* ── Personalized Message ── */}
        <div className="fade-up" style={{ background: C.card, border: `1px solid ${profile.avatarColor}55`, borderRadius: 14, padding: "24px 28px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: profile.avatarColor, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 16 }}>✉️ Recommended Personalized Message</div>
          <div style={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 10, padding: "20px 24px" }}>
            <div style={{ fontSize: 11, color: C.muted, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.08em" }}>Subject</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.white, marginBottom: 16, paddingBottom: 16, borderBottom: `1px solid ${C.border}` }}>{profile.personalizedMessage.subject}</div>
            <div style={{ fontSize: 11, color: C.muted, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.08em" }}>Message</div>
            <div style={{ fontSize: 13, color: C.white, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{profile.personalizedMessage.body}</div>
          </div>
        </div>

      </div>
    </div>
  );
}
