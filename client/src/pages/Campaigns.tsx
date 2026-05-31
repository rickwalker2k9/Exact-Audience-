/**
 * Campaigns.tsx — Exact Audience Campaign Directory
 * Post-login home screen. Cards with hasDashboard=true route to full dashboards.
 * Uses internal useTheme hook — no props needed.
 */

import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { CLIENTS, type CampaignClient } from "@/lib/clientRegistry";
import { useTheme } from "@/contexts/ThemeContext";

// ── Sparkline ─────────────────────────────────────────────────────────────────
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 80, h = 28;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible" }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
      <circle cx={pts.split(" ").at(-1)!.split(",")[0]} cy={pts.split(" ").at(-1)!.split(",")[1]} r="2.5" fill={color} />
    </svg>
  );
}

function fmt(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(0) + "K";
  return n.toString();
}

// ── Logo with fallback ───────────────────────────────────────────────────────
function ClientLogo({ client, size = 36 }: { client: CampaignClient; size?: number }) {
  const initials = client.name.split(/\s+/).slice(0, 2).map(w => w[0]).join("").toUpperCase();
  const logoUrl = client.logoDomain
    ? `https://logo.clearbit.com/${client.logoDomain}`
    : null;

  if (!logoUrl) {
    return (
      <div style={{ width: size, height: size, borderRadius: 8, background: client.primaryColor + "22", border: `1.5px solid ${client.primaryColor}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.33, fontWeight: 800, color: client.primaryColor, flexShrink: 0 }}>
        {initials}
      </div>
    );
  }

  return (
    <div style={{ width: size, height: size, borderRadius: 8, background: "#fff", border: `1.5px solid #e2e8f0`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
      <img
        src={logoUrl}
        alt={client.name}
        style={{ width: size - 8, height: size - 8, objectFit: "contain" }}
        onError={e => {
          const img = e.currentTarget;
          img.style.display = "none";
          const parent = img.parentElement!;
          parent.style.background = client.primaryColor + "22";
          parent.style.border = `1.5px solid ${client.primaryColor}44`;
          parent.innerHTML = `<span style="font-size:${size * 0.33}px;font-weight:800;color:${client.primaryColor}">${initials}</span>`;
        }}
      />
    </div>
  );
}

// ── Campaign Card ─────────────────────────────────────────────────────────────
function CampaignCard({ client, dark, onClick }: { client: CampaignClient; dark: boolean; onClick: () => void }) {
  const cardBg  = dark ? "#0d0d2b" : "#ffffff";
  const hoverBg = dark ? "#13133a" : "#f8fafc";
  const border  = dark ? "#1e1e4a" : "#e2e8f0";
  const textPrimary   = dark ? "#f1f5f9" : "#0f172a";
  const textSecondary = dark ? "#8892b0" : "#64748b";

  return (
    <div
      onClick={onClick}
      style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 14, padding: "20px", cursor: "pointer", transition: "all 0.18s cubic-bezier(0.23,1,0.32,1)", position: "relative", overflow: "hidden" }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.background = hoverBg;
        el.style.borderColor = client.primaryColor;
        el.style.transform = "translateY(-2px)";
        el.style.boxShadow = `0 8px 32px ${client.primaryColor}22`;
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.background = cardBg;
        el.style.borderColor = border;
        el.style.transform = "translateY(0)";
        el.style.boxShadow = "none";
      }}
    >
      {/* Accent bar */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: client.primaryColor, borderRadius: "14px 14px 0 0" }} />

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12, marginTop: 4 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10, flex: 1, minWidth: 0 }}>
          <ClientLogo client={client} size={36} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: textPrimary, lineHeight: 1.3, marginBottom: 2 }}>{client.name}</div>
            <div style={{ fontSize: 11, color: textSecondary, fontWeight: 500 }}>{client.vertical}</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5, flexShrink: 0, marginLeft: 8 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 6px #4ade80", animation: "pulse-dot 2s ease-in-out infinite" }} />
          <span style={{ fontSize: 10, color: "#4ade80", fontWeight: 700, letterSpacing: "0.06em" }}>LIVE</span>
        </div>
      </div>

      <div style={{ fontSize: 11, color: textSecondary, marginBottom: 14 }}>{client.location} · {client.campaign}</div>

      {/* Stats */}
      <div style={{ display: "flex", gap: 16, marginBottom: 14 }}>
        {[
          { label: "Impressions", value: fmt(client.impressionsToDate), color: textPrimary },
          { label: "Reach",       value: fmt(client.reachToDate),       color: textPrimary },
          { label: "Completion",  value: `${client.completionRate}%`,   color: client.primaryColor },
        ].map(s => (
          <div key={s.label}>
            <div style={{ fontSize: 16, fontWeight: 800, color: s.color, letterSpacing: "-0.02em" }}>{s.value}</div>
            <div style={{ fontSize: 10, color: textSecondary, fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Sparkline + budget */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <Sparkline data={client.trend} color={client.primaryColor} />
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: textPrimary }}>{client.budget}</div>
          <div style={{ fontSize: 10, color: textSecondary }}>Budget</div>
        </div>
      </div>


    </div>
  );
}

// ── Slug → route map ──────────────────────────────────────────────────────────
const SLUG_ROUTES: Record<string, string> = {
  "land-rover":                  "/land-rover",
  "lamborghini-scottsdale":      "/lamborghini",
  "warby-parker":                "/warby-parker",
  "policygenius":                "/policygenius",
  "colleen-mccarty":             "/mccarty",
  "breeze-insurance":            "/breeze-insurance",
  "starling":                    "/starling",
};

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function Campaigns() {
  const [, navigate] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const dark = theme === "dark";
  const [search, setSearch] = useState("");
  const [filterVertical, setFilterVertical] = useState("All");

  const bg          = dark ? "#07071a" : "#f0f4f8";
  const headerBg    = "linear-gradient(135deg,#0d0d2b 0%,#1a0840 100%)";
  const textPrimary = dark ? "#f1f5f9" : "#0f172a";
  const textSecondary = dark ? "#8892b0" : "#64748b";
  const inputBg     = dark ? "#13133a" : "#ffffff";
  const inputBorder = dark ? "#252560" : "#e2e8f0";

  const verticals = useMemo(() => {
    const all = new Set(CLIENTS.map(c => c.vertical));
    return ["All", ...Array.from(all).sort()];
  }, []);

  const filtered = useMemo(() => CLIENTS.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = q === "" || c.name.toLowerCase().includes(q) || c.vertical.toLowerCase().includes(q) || c.campaign.toLowerCase().includes(q);
    const matchVertical = filterVertical === "All" || c.vertical === filterVertical;
    return matchSearch && matchVertical;
  }), [search, filterVertical]);

  function handleCardClick(client: CampaignClient) {
    const route = SLUG_ROUTES[client.slug];
    if (route) {
      navigate(route);
    } else {
      navigate(`/campaign/${client.slug}`);
    }
  }

  const totalImpressions = CLIENTS.reduce((s, c) => s + c.impressionsToDate, 0);
  const totalReach = CLIENTS.reduce((s, c) => s + c.reachToDate, 0);

  return (
    <div style={{ minHeight: "100vh", background: bg, fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif" }}>
      <style>{`
        @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.6;transform:scale(1.3)} }
        @keyframes fadeInUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .camp-card-enter { animation: fadeInUp 0.35s ease-out both; }
        .camp-search:focus { outline:none; border-color:#7c3aed !important; box-shadow:0 0 0 3px rgba(124,58,237,0.2); }
      `}</style>

      {/* Header */}
      <div style={{ background: headerBg, padding: "0 24px", boxShadow: "0 2px 24px rgba(0,0,0,0.4)" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ width: 10, height: 10, background: "#a855f7", borderRadius: "50%", boxShadow: "0 0 14px #a855f7", animation: "pulse-dot 2s ease-in-out infinite" }} />
            <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: "0.18em", color: "#f1f5f9" }}>EXACT AUDIENCE</span>
            <span style={{ color: "#4a5568", margin: "0 4px" }}>|</span>
            <span style={{ fontSize: 13, color: "#8892b0", fontWeight: 500 }}>Campaign Intelligence</span>
          </div>
          <button onClick={toggleTheme ?? (() => {})} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 20, padding: "6px 14px", color: "#f1f5f9", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
            {dark ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>
      </div>



      {/* Content */}
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "28px 24px" }}>
        {/* Search + filter */}
        <div style={{ display: "flex", gap: 12, marginBottom: 28, flexWrap: "wrap", alignItems: "center" }}>
          <input
            className="camp-search"
            type="text"
            placeholder="Search campaigns, clients, verticals..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, minWidth: 220, background: inputBg, border: `1px solid ${inputBorder}`, borderRadius: 10, padding: "10px 16px", color: textPrimary, fontSize: 13, transition: "border-color 0.2s, box-shadow 0.2s" }}
          />
          <select value={filterVertical} onChange={e => setFilterVertical(e.target.value)} style={{ background: inputBg, border: `1px solid ${inputBorder}`, borderRadius: 10, padding: "10px 14px", color: textPrimary, fontSize: 13, cursor: "pointer" }}>
            {verticals.map(v => <option key={v} value={v}>{v}</option>)}
          </select>

        </div>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {filtered.map((client, i) => (
            <div key={client.id} className="camp-card-enter" style={{ animationDelay: `${i * 0.03}s` }}>
              <CampaignCard client={client} dark={dark} onClick={() => handleCardClick(client)} />
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0", color: textSecondary }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>No campaigns match your search</div>
            <div style={{ fontSize: 13, marginTop: 4 }}>Try a different keyword or vertical filter</div>
          </div>
        )}
      </div>

      <div style={{ textAlign: "center", padding: "24px", fontSize: 11, color: dark ? "#2d3748" : "#94a3b8" }}>
        Exact Audience · Campaign Intelligence Platform · Powered by SiteID · {new Date().getFullYear()}
      </div>
    </div>
  );
}
