/**
 * BuyerProfilePage.tsx
 * Full buyer journey detail view — shown when clicking a buyer profile from the People tab.
 * Shows: identity, buyer DNA, engagement timeline, intent signals, purchase window predictions,
 * personalized messaging, and recommended media mix.
 */

import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { getProfileById, type BuyerProfile, type OutreachKit } from "@/lib/buyerProfiles";
import { getDailyProfiles } from "@/lib/dynamicProfiles";
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

// ── Copy block with copy button ──────────────────────────────────────────────
function CopyBlock({ label, value, C }: { label: string; value: string; C: Record<string, string> }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.1em" }}>{label}</span>
        <button onClick={copy} style={{ background: copied ? "#14532d" : "rgba(255,255,255,0.07)", color: copied ? "#4ade80" : C.muted, border: "none", borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 700, cursor: "pointer", transition: "all 0.15s" }}>
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <div style={{ background: "rgba(0,0,0,0.25)", border: `1px solid ${C.border}`, borderRadius: 8, padding: "12px 14px", fontSize: 13, color: C.white, lineHeight: 1.75, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{value}</div>
    </div>
  );
}

// ── Outreach Kit Section ───────────────────────────────────────────────────────
const OUTREACH_TABS = [
  { key: "email",      label: "Email",       icon: "✉️" },
  { key: "linkedin",   label: "LinkedIn",    icon: "💼" },
  { key: "facebookAd", label: "Facebook Ad", icon: "🎟️" },
  { key: "googleAd",   label: "Google Ad",   icon: "🔍" },
  { key: "directMail", label: "Direct Mail", icon: "📬" },
] as const;

function OutreachKitSection({ profile, accentColor, C }: { profile: BuyerProfile; accentColor: string; C: Record<string, string> }) {
  const [activeTab, setActiveTab] = useState<typeof OUTREACH_TABS[number]["key"]>("email");
  const kit = profile.outreachKit;

  if (!kit) {
    return (
      <div className="fade-up" style={{ background: C.card, border: `1px solid ${accentColor}55`, borderRadius: 14, padding: "24px 28px" }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: accentColor, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 16 }}>✉️ Recommended Personalized Message</div>
        <div style={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 10, padding: "20px 24px" }}>
          <CopyBlock label="Subject" value={profile.personalizedMessage.subject} C={C} />
          <CopyBlock label="Message" value={profile.personalizedMessage.body} C={C} />
        </div>
      </div>
    );
  }

  const renderTab = () => {
    switch (activeTab) {
      case "email":
        return (
          <div>
            <CopyBlock label="Subject Line" value={kit.email.subject} C={C} />
            <CopyBlock label="Email Body" value={kit.email.body} C={C} />
          </div>
        );
      case "linkedin":
        return (
          <div>
            <CopyBlock label="Connection Request" value={kit.linkedin.connectionRequest} C={C} />
            <CopyBlock label="Follow-Up Message" value={kit.linkedin.followUp} C={C} />
          </div>
        );
      case "facebookAd":
        return (
          <div>
            <CopyBlock label="Headline" value={kit.facebookAd.headline} C={C} />
            <CopyBlock label="Primary Text" value={kit.facebookAd.primaryText} C={C} />
            <CopyBlock label="Call to Action" value={kit.facebookAd.cta} C={C} />
          </div>
        );
      case "googleAd":
        return (
          <div>
            <CopyBlock label="Headlines (use up to 3)" value={kit.googleAd.headlines.join("\n")} C={C} />
            <CopyBlock label="Descriptions (use up to 2)" value={kit.googleAd.descriptions.join("\n")} C={C} />
            <CopyBlock label="Target Keywords" value={kit.googleAd.keywords.join("\n")} C={C} />
          </div>
        );
      case "directMail":
        return (
          <div>
            <CopyBlock label="Postcard Headline" value={kit.directMail.headline} C={C} />
            <CopyBlock label="Postcard Body Copy" value={kit.directMail.body} C={C} />
          </div>
        );
    }
  };

  return (
    <div className="fade-up" style={{ background: C.card, border: `1px solid ${accentColor}55`, borderRadius: 14, padding: "24px 28px" }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: accentColor, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 4 }}>📤 Personalized Outreach Kit</div>
      <div style={{ fontSize: 12, color: C.muted, marginBottom: 20 }}>Every message below is written specifically for {profile.name.split(" ")[0]} based on their Buyer's DNA and site journey. Click any field to copy.</div>
      <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
        {OUTREACH_TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              background: activeTab === tab.key ? accentColor : "rgba(255,255,255,0.06)",
              color: activeTab === tab.key ? "#fff" : C.muted,
              border: activeTab === tab.key ? `1px solid ${accentColor}` : `1px solid ${C.border}`,
              borderRadius: 8, padding: "7px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer",
              transition: "all 0.15s", display: "flex", alignItems: "center", gap: 5,
            }}
          >
            <span>{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>
      <div style={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 10, padding: "20px 24px" }}>
        {renderTab()}
      </div>
    </div>
  );
}

// ── Copy block with copy button ──────────────────────────────────────────────
export default function BuyerProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { theme } = useTheme();
  const dark = theme === "dark";

  // Search dynamic pools first (date-shifted signals), then fall back to static ALL_PROFILES
  const DYNAMIC_IDS = ["land-rover", "lamborghini", "warby-parker", "policygenius", "breeze-insurance", "barrett-financial"] as const;
  const allDynamic = DYNAMIC_IDS.flatMap(d => getDailyProfiles(d));
  const profile = allDynamic.find(p => p.id === (id ?? "")) ?? getProfileById(id ?? "");

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
    "mccarty": "/mccarty",
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
        <img src="/ea-logo.png" alt="Exact Audience" style={{ height: 22, objectFit: "contain", filter: "brightness(1.1)" }} />
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
              {profile.signals.map((signal, i) => {
                const prevPhase = i > 0 ? (profile.signals[i - 1] as any).phase : null;
                const curPhase = (signal as any).phase;
                const showPhaseHeader = curPhase && curPhase !== prevPhase;
                return (
                  <div key={i}>
                    {showPhaseHeader && (
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, marginTop: i > 0 ? 8 : 0 }}>
                        <div style={{ flex: 1, height: 1, background: curPhase === "lookback" ? "rgba(251,191,36,0.3)" : "rgba(129,140,248,0.3)" }} />
                        <div style={{
                          fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.14em",
                          padding: "3px 10px", borderRadius: 20,
                          background: curPhase === "lookback" ? "rgba(251,191,36,0.12)" : "rgba(129,140,248,0.12)",
                          color: curPhase === "lookback" ? "#fbbf24" : "#818cf8",
                          border: `1px solid ${curPhase === "lookback" ? "rgba(251,191,36,0.3)" : "rgba(129,140,248,0.3)"}`
                        }}>
                          {curPhase === "lookback" ? "30-Day Lookback Window" : "Campaign Period"}
                        </div>
                        <div style={{ flex: 1, height: 1, background: curPhase === "lookback" ? "rgba(251,191,36,0.3)" : "rgba(129,140,248,0.3)" }} />
                      </div>
                    )}
                    <div style={{ display: "grid", gridTemplateColumns: "56px 1fr", gap: 12, paddingBottom: 16, position: "relative" }}>
                      {i < profile.signals.length - 1 && (
                        <div style={{ position: "absolute", left: 27, top: 28, bottom: 0, width: 2, background: `${profile.avatarColor}33` }} />
                      )}
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, zIndex: 1 }}>
                        <div style={{
                          width: 10, height: 10, borderRadius: "50%",
                          background: curPhase === "campaign" ? "#818cf8" : curPhase === "lookback" ? "#fbbf24" : profile.avatarColor,
                          boxShadow: `0 0 8px ${curPhase === "campaign" ? "#818cf866" : curPhase === "lookback" ? "#fbbf2466" : profile.avatarColor + "66"}`,
                          marginTop: 4
                        }} />
                        <div style={{ fontSize: 9, color: C.muted, textAlign: "center", lineHeight: 1.2 }}>{signal.date}</div>
                      </div>
                      <div style={{
                        background: C.card2,
                        border: `1px solid ${curPhase === "campaign" ? "rgba(129,140,248,0.25)" : curPhase === "lookback" ? "rgba(251,191,36,0.2)" : C.border}`,
                        borderRadius: 10, padding: "10px 14px"
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4, gap: 8 }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: profile.avatarColor }}>{signal.channel}</div>
                          <StrengthBadge strength={signal.strength} />
                        </div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: C.white, marginBottom: 3 }}>{signal.action}</div>
                        <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.5 }}>{signal.detail}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
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
