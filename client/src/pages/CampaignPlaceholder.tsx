/**
 * CampaignPlaceholder.tsx — Shown for campaigns without a full dashboard yet
 */
import { useLocation, useParams } from "wouter";
import { CLIENTS } from "@/lib/clientRegistry";
import { useTheme } from "@/contexts/ThemeContext";

export default function CampaignPlaceholder() {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const [, navigate] = useLocation();
  const params = useParams<{ slug: string }>();
  const client = CLIENTS.find(c => c.slug === params.slug);

  const bg = dark ? "#07071a" : "#f0f4f8";
  const cardBg = dark ? "#0d0d2b" : "#ffffff";
  const border = dark ? "#1e1e4a" : "#e2e8f0";
  const textPrimary = dark ? "#f1f5f9" : "#0f172a";
  const textSecondary = dark ? "#8892b0" : "#64748b";
  const headerBg = "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)";

  if (!client) {
    return (
      <div style={{ minHeight: "100vh", background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: textPrimary, textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>404</div>
          <div>Campaign not found</div>
          <button onClick={() => navigate("/campaigns")} style={{ marginTop: 16, padding: "8px 20px", background: "#7c3aed", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" }}>
            Back to Campaigns
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: bg, fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif" }}>
      <style>{`@keyframes pulse-dot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.6;transform:scale(1.3)}}`}</style>

      {/* Header */}
      <div style={{ background: headerBg, padding: "0 24px", boxShadow: "0 2px 24px rgba(0,0,0,0.4)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", height: 64, gap: 16 }}>
          <button
            onClick={() => navigate("/campaigns")}
            style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 8, padding: "6px 12px", color: "#f1f5f9", fontSize: 12, cursor: "pointer" }}
          >
            ← Campaigns
          </button>
          <span style={{ width: 8, height: 8, background: "#a855f7", borderRadius: "50%", boxShadow: "0 0 10px #a855f7", animation: "pulse-dot 2s ease-in-out infinite" }} />
          <img src="/ea-logo.png" alt="Exact Audience" style={{ height: 22, objectFit: "contain", filter: "brightness(1.1)" }} />
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 640, margin: "80px auto", padding: "0 24px" }}>
        <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 20, padding: "48px 40px", textAlign: "center", position: "relative", overflow: "hidden" }}>
          {/* Top accent */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: client.primaryColor }} />

          {/* Status badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: `${client.primaryColor}18`, border: `1px solid ${client.primaryColor}44`, borderRadius: 20, padding: "4px 14px", marginBottom: 24 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 6px #4ade80", animation: "pulse-dot 2s ease-in-out infinite" }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: "#4ade80", letterSpacing: "0.1em" }}>CAMPAIGN ACTIVE</span>
          </div>

          <div style={{ fontSize: 26, fontWeight: 800, color: textPrimary, marginBottom: 6 }}>{client.name}</div>
          <div style={{ fontSize: 14, color: textSecondary, marginBottom: 4 }}>{client.vertical} · {client.location}</div>
          <div style={{ fontSize: 13, color: client.primaryColor, fontWeight: 600, marginBottom: 32 }}>{client.campaign}</div>

          {/* Quick stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 36 }}>
            {[
              { label: "Impressions", value: client.impressionsToDate >= 1_000_000 ? (client.impressionsToDate / 1_000_000).toFixed(1) + "M" : (client.impressionsToDate / 1_000).toFixed(0) + "K" },
              { label: "Reach", value: (client.reachToDate / 1_000).toFixed(0) + "K" },
              { label: "Completion", value: client.completionRate + "%" },
            ].map(stat => (
              <div key={stat.label} style={{ background: dark ? "#13133a" : "#f8fafc", borderRadius: 12, padding: "16px 12px" }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: client.primaryColor }}>{stat.value}</div>
                <div style={{ fontSize: 11, color: textSecondary, marginTop: 2 }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Message */}
          <div style={{ background: dark ? "#13133a" : "#f8fafc", borderRadius: 12, padding: "20px 24px", marginBottom: 28, border: `1px solid ${border}` }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: textPrimary, marginBottom: 6 }}>Full Dashboard Coming Soon</div>
            <div style={{ fontSize: 13, color: textSecondary, lineHeight: 1.6 }}>
              The full interactive campaign dashboard for <strong style={{ color: textPrimary }}>{client.name}</strong> is currently being configured. 
              Campaign data is being collected and will be available shortly.
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button
              onClick={() => navigate("/campaigns")}
              style={{ background: "#7c3aed", color: "#fff", border: "none", borderRadius: 10, padding: "12px 24px", fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "background 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#6d28d9")}
              onMouseLeave={e => (e.currentTarget.style.background = "#7c3aed")}
            >
              ← Back to All Campaigns
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
