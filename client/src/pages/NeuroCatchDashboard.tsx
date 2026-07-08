/**
 * NeuroCatchDashboard.tsx
 * NeuroCatch Inc. — Brain Vital Signs Platform
 * Color palette: Deep purple bg | Gold→Orange gradient | White text ONLY
 * No other colors. Strict to palette.
 */
import { useState } from "react";
import {
  NEUROCATCH_CLIENT,
  NEUROCATCH_MARKET_CARDS,
  NEUROCATCH_COMPETITORS,
  NEUROCATCH_B2B_SEGMENTS,
  NEUROCATCH_B2C_AUDIENCES,
  NEUROCATCH_KEYWORDS,
  NEUROCATCH_OUTREACH,
  NEUROCATCH_READINESS,
  NEUROCATCH_VISITORS,
} from "@/lib/neuroCatchData";
import { useLocation } from "wouter";

// ── Palette ───────────────────────────────────────────────────────────────────
const P = {
  bg:      "#07071a",
  bg2:     "#0d0d28",
  card:    "#0f0f2e",
  card2:   "#141440",
  border:  "#252560",
  white:   "#f1f5f9",
  muted:   "#8892b0",
  gold:    "#f59e0b",
  orange:  "#f97316",
  deep:    "#ea580c",
  grad:    "linear-gradient(135deg, #f59e0b 0%, #f97316 50%, #ea580c 100%)",
  gradText:"linear-gradient(90deg, #f59e0b, #f97316, #ea580c)",
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function GradText({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={className} style={{ background: P.gradText, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
      {children}
    </span>
  );
}

function Card({ children, className = "", style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`rounded-xl border p-5 ${className}`} style={{ background: P.card, borderColor: P.border, ...style }}>
      {children}
    </div>
  );
}

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      style={{ background: copied ? P.deep : P.card2, borderColor: P.border, color: copied ? "#fff" : P.muted }}
      className="text-xs px-3 py-1 rounded-lg border transition-all duration-200 hover:opacity-80 shrink-0"
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

const TABS = [
  { id: "market",    label: "Market Intelligence" },
  { id: "segments",  label: "B2B Segments" },
  { id: "keywords",  label: "Search Volume" },
  { id: "siteid",    label: "In-Market Audience" },
  { id: "outreach",  label: "Outreach Kit" },
  { id: "readiness", label: "Campaign Readiness" },
];

// ── Tab: Market Intelligence ──────────────────────────────────────────────────
function TabMarket() {
  return (
    <div className="space-y-8">
      {/* Headline */}
      <div>
        <h2 className="text-2xl font-bold mb-1" style={{ color: P.white }}>Market Opportunity</h2>
        <p style={{ color: P.muted }} className="text-sm">The cognitive assessment space is one of the fastest-growing segments in medtech. NeuroCatch is the only point-of-care platform measuring actual physiological brain activity.</p>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {NEUROCATCH_MARKET_CARDS.map((c) => (
          <Card key={c.label}>
            <div className="text-2xl mb-2">{c.icon}</div>
            <div className="text-2xl font-bold mb-1" style={{ background: P.gradText, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{c.value}</div>
            <div className="text-xs font-semibold mb-0.5" style={{ color: P.white }}>{c.label}</div>
            <div className="text-xs" style={{ color: P.muted }}>{c.sub}</div>
          </Card>
        ))}
      </div>

      {/* Competitive moat */}
      <div>
        <h3 className="text-lg font-bold mb-4" style={{ color: P.white }}>Competitive Positioning</h3>
        <p className="text-sm mb-4" style={{ color: P.muted }}>Every major competitor relies on behavioral and self-reported data. NeuroCatch is the only platform measuring actual physiological brain activity at the point of care.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: `1px solid ${P.border}` }}>
                <th className="text-left py-2 pr-4 font-semibold" style={{ color: P.muted }}>Competitor</th>
                <th className="text-left py-2 pr-4 font-semibold" style={{ color: P.muted }}>Technology</th>
                <th className="text-left py-2 pr-4 font-semibold" style={{ color: P.muted }}>Core Limitation</th>
                <th className="text-center py-2 font-semibold" style={{ color: P.muted }}>EEG</th>
              </tr>
            </thead>
            <tbody>
              {NEUROCATCH_COMPETITORS.map((c) => (
                <tr key={c.name} style={{ borderBottom: `1px solid ${P.border}`, background: c.isUs ? "rgba(245,158,11,0.06)" : "transparent" }}>
                  <td className="py-3 pr-4 font-semibold" style={{ color: c.isUs ? P.gold : P.white }}>{c.name}{c.isUs && <span className="ml-2 text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(245,158,11,0.15)", color: P.gold }}>US</span>}</td>
                  <td className="py-3 pr-4" style={{ color: P.muted }}>{c.tech}</td>
                  <td className="py-3 pr-4 text-xs" style={{ color: c.isUs ? "#86efac" : P.muted }}>{c.limitation}</td>
                  <td className="py-3 text-center">{c.hasEEG ? <span style={{ color: P.gold }}>✓</span> : <span style={{ color: P.muted }}>✗</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>


    </div>
  );
}

// ── Tab: B2B Segments ─────────────────────────────────────────────────────────
function TabSegments() {
  const [active, setActive] = useState(0);
  const seg = NEUROCATCH_B2B_SEGMENTS[active];
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1" style={{ color: P.white }}>B2B Target Segments</h2>
        <p className="text-sm" style={{ color: P.muted }}>Priority-ranked by commercial readiness, liability barrier, and channel availability. Military/VA is #1 — the Lovell partnership is already open.</p>
      </div>

      {/* Priority list */}
      <div className="grid gap-3">
        {NEUROCATCH_B2B_SEGMENTS.map((s, i) => (
          <button key={s.segment} onClick={() => setActive(i)}
            className="w-full text-left rounded-xl border p-4 transition-all duration-200"
            style={{ background: active === i ? "rgba(245,158,11,0.08)" : P.card, borderColor: active === i ? s.color : P.border }}>
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: s.color, color: "#000" }}>{s.priority}</div>
              <div className="text-lg shrink-0">{s.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm" style={{ color: P.white }}>{s.segment}</div>
                <div className="text-xs" style={{ color: P.muted }}>{s.subLabel}</div>
              </div>
              <div className="text-xs px-2 py-0.5 rounded-full shrink-0" style={{ background: s.urgency === "high" ? "rgba(245,158,11,0.15)" : "rgba(249,115,22,0.1)", color: s.urgency === "high" ? P.gold : P.orange }}>
                {s.urgency === "high" ? "High Urgency" : "Medium Urgency"}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Detail panel */}
      <Card style={{ borderColor: seg.color + "55" }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="text-3xl">{seg.icon}</div>
          <div>
            <div className="font-bold text-lg" style={{ color: P.white }}>{seg.segment}</div>
            <div className="text-sm" style={{ color: P.muted }}>{seg.subLabel}</div>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-xs font-semibold mb-1" style={{ color: P.gold }}>WHY NOW</div>
            <p style={{ color: P.muted }}>{seg.whyNow}</p>
          </div>
          <div>
            <div className="text-xs font-semibold mb-1" style={{ color: P.gold }}>ENTRY POINT</div>
            <p style={{ color: P.muted }}>{seg.entryPoint}</p>
          </div>
          <div>
            <div className="text-xs font-semibold mb-1" style={{ color: P.gold }}>ADDRESSABLE MARKET</div>
            <p style={{ color: P.white, fontWeight: 600 }}>{seg.addressable}</p>
          </div>
          <div>
            <div className="text-xs font-semibold mb-1" style={{ color: P.gold }}>LIABILITY BARRIER</div>
            <p style={{ color: P.muted }}>{seg.liabilityBarrier}</p>
          </div>
        </div>
      </Card>

      {/* B2C audiences */}
      <div>
        <h3 className="text-lg font-bold mb-4" style={{ color: P.white }}>B2C Target Audiences</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {NEUROCATCH_B2C_AUDIENCES.map((a) => (
            <Card key={a.audience}>
              <div className="text-2xl mb-2">{a.icon}</div>
              <div className="font-semibold mb-1" style={{ color: P.white }}>{a.audience}</div>
              <div className="text-xs mb-2" style={{ color: P.muted }}>{a.motivation}</div>
              <div className="text-xs italic mb-3 p-2 rounded-lg" style={{ background: "rgba(245,158,11,0.06)", color: P.gold, borderLeft: `2px solid ${P.gold}` }}>"{a.message}"</div>
              <div className="flex flex-wrap gap-1">
                {a.channels.map(ch => (
                  <span key={ch} className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(249,115,22,0.1)", color: P.orange }}>{ch}</span>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Tab: Search Volume ────────────────────────────────────────────────────────
function TabKeywords() {
  const maxVol = Math.max(...NEUROCATCH_KEYWORDS.map(k => k.volume));
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1" style={{ color: P.white }}>Search Volume & Keyword Intelligence</h2>
        <p className="text-sm" style={{ color: P.muted }}>Monthly US search volume for NeuroCatch's highest-value keyword categories. Low competition + high volume = immediate opportunity.</p>
      </div>
      <div className="space-y-3">
        {NEUROCATCH_KEYWORDS.sort((a, b) => b.volume - a.volume).map((k) => {
          const pct = (k.volume / maxVol) * 100;
          const compColor = k.competition === "low" ? P.gold : k.competition === "medium" ? P.orange : P.deep;
          return (
            <Card key={k.keyword} className="p-4">
              <div className="flex items-center justify-between mb-2 gap-2">
                <div className="font-semibold text-sm" style={{ color: P.white }}>{k.keyword}</div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(245,158,11,0.1)", color: P.gold }}>{k.segment}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${compColor}18`, color: compColor }}>{k.competition} comp</span>
                  <span className="text-xs" style={{ color: k.trend === "up" ? P.gold : P.muted }}>{k.trend === "up" ? "↑" : "→"}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: P.card2 }}>
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, background: P.grad }} />
                </div>
                <div className="text-sm font-bold shrink-0" style={{ color: P.white }}>{k.volume.toLocaleString()}<span className="text-xs font-normal ml-1" style={{ color: P.muted }}>/mo</span></div>
              </div>
            </Card>
          );
        })}
      </div>
      <Card style={{ borderColor: "rgba(245,158,11,0.3)" }}>
        <div className="font-semibold mb-2" style={{ color: P.gold }}>⚡ Immediate Opportunity</div>
        <p className="text-sm" style={{ color: P.muted }}>
          "Concussion testing near me" (22,000/mo) and "concussion baseline test" (14,800/mo) have <strong style={{ color: P.white }}>low-to-medium competition</strong> and extremely high commercial intent. These should be the first Google Search campaigns activated.
        </p>
      </Card>
    </div>
  );
}

// ── Tab: In-Market Audience (SiteID) ─────────────────────────────────────────
function TabSiteID() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-1" style={{ color: P.white }}>In-Market Audience</h2>
          <p className="text-sm" style={{ color: P.muted }}>SiteID.ai identifies website visitors by name, title, and organization — turning anonymous traffic into actionable outreach targets.</p>
        </div>
        <div className="text-xs px-3 py-1.5 rounded-full shrink-0" style={{ background: "rgba(245,158,11,0.15)", color: P.gold, border: `1px solid ${P.gold}40` }}>
          ● Demo Data — Pre-Launch
        </div>
      </div>

      {/* Install CTA */}
      <Card style={{ borderColor: "rgba(245,158,11,0.4)", background: "rgba(245,158,11,0.05)" }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="text-2xl">🔌</div>
          <div>
            <div className="font-bold" style={{ color: P.gold }}>Install SiteID.ai on neurocatch.com</div>
            <div className="text-xs" style={{ color: P.muted }}>One script tag. Identifies 50–65% of all site visitors by name, title, company, and mailing address.</div>
          </div>
        </div>
        <p className="text-xs" style={{ color: P.muted }}>Once installed, this tab will show real-time visitor data — who is on neurocatch.com right now, what pages they viewed, and which B2B segment they belong to. The demo data below shows what this will look like.</p>
      </Card>

      {/* Visitor feed */}
      <div className="space-y-3">
        {NEUROCATCH_VISITORS.map((v, i) => (
          <Card key={i} className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0" style={{ background: P.grad, color: "#000" }}>
                {v.first[0]}{v.last[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm" style={{ color: P.white }}>{v.first} {v.last}</div>
                <div className="text-xs" style={{ color: P.muted }}>{v.title} · {v.org}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-xs px-2 py-0.5 rounded-full mb-1" style={{ background: "rgba(245,158,11,0.1)", color: P.gold }}>{v.segment}</div>
                <div className="text-xs" style={{ color: P.muted }}>{v.city} · {v.time}</div>
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: "rgba(245,158,11,0.1)", color: P.gold, border: `1px solid ${P.gold}40` }}>
                {v.score}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ── Tab: Outreach Kit ─────────────────────────────────────────────────────────
function TabOutreach() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [activeChannel, setActiveChannel] = useState<"linkedin" | "email" | "googleAd" | "directMail">("linkedin");
  const kit = NEUROCATCH_OUTREACH[activeIdx];
  const channels: { id: typeof activeChannel; label: string }[] = [
    { id: "linkedin",    label: "LinkedIn" },
    { id: "email",       label: "Email" },
    { id: "googleAd",    label: "Google Ad" },
    { id: "directMail",  label: "Direct Mail" },
  ];
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1" style={{ color: P.white }}>Outreach Kit by Segment</h2>
        <p className="text-sm" style={{ color: P.muted }}>Ready-to-use copy for each target segment. Select a segment and channel, then copy directly into your outreach platform.</p>
      </div>

      {/* Segment selector */}
      <div className="flex flex-wrap gap-2">
        {NEUROCATCH_OUTREACH.map((o, i) => (
          <button key={o.segment} onClick={() => setActiveIdx(i)}
            className="text-xs px-3 py-1.5 rounded-full border transition-all"
            style={{ background: activeIdx === i ? P.gold : P.card, borderColor: activeIdx === i ? P.gold : P.border, color: activeIdx === i ? "#000" : P.muted, fontWeight: activeIdx === i ? 700 : 400 }}>
            {o.icon} {o.segment.split(" (")[0]}
          </button>
        ))}
      </div>

      {/* Channel tabs */}
      <div className="flex gap-2 border-b" style={{ borderColor: P.border }}>
        {channels.map(ch => (
          <button key={ch.id} onClick={() => setActiveChannel(ch.id)}
            className="text-sm pb-2 px-1 border-b-2 transition-all"
            style={{ borderColor: activeChannel === ch.id ? P.gold : "transparent", color: activeChannel === ch.id ? P.gold : P.muted }}>
            {ch.label}
          </button>
        ))}
      </div>

      {/* Copy blocks */}
      {activeChannel === "linkedin" && (
        <div className="space-y-4">
          <div>
            <div className="text-xs font-semibold mb-2" style={{ color: P.gold }}>CONNECTION REQUEST</div>
            <Card>
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm leading-relaxed" style={{ color: P.white }}>{kit.linkedin.connection}</p>
                <CopyBtn text={kit.linkedin.connection} />
              </div>
            </Card>
          </div>
          <div>
            <div className="text-xs font-semibold mb-2" style={{ color: P.gold }}>FOLLOW-UP MESSAGE</div>
            <Card>
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm leading-relaxed" style={{ color: P.white }}>{kit.linkedin.followUp}</p>
                <CopyBtn text={kit.linkedin.followUp} />
              </div>
            </Card>
          </div>
        </div>
      )}
      {activeChannel === "email" && (
        <div className="space-y-4">
          <div>
            <div className="text-xs font-semibold mb-2" style={{ color: P.gold }}>SUBJECT LINE</div>
            <Card>
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold" style={{ color: P.white }}>{kit.email.subject}</p>
                <CopyBtn text={kit.email.subject} />
              </div>
            </Card>
          </div>
          <div>
            <div className="text-xs font-semibold mb-2" style={{ color: P.gold }}>EMAIL BODY</div>
            <Card>
              <div className="flex items-start justify-between gap-3">
                <pre className="text-sm leading-relaxed whitespace-pre-wrap font-sans" style={{ color: P.white }}>{kit.email.body}</pre>
                <CopyBtn text={kit.email.body} />
              </div>
            </Card>
          </div>
        </div>
      )}
      {activeChannel === "googleAd" && (
        <div className="space-y-4">
          <div>
            <div className="text-xs font-semibold mb-2" style={{ color: P.gold }}>HEADLINES</div>
            {kit.googleAd.headlines.map((h, i) => (
              <Card key={i} className="mb-2 p-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold" style={{ color: P.white }}>{h}</span>
                  <CopyBtn text={h} />
                </div>
              </Card>
            ))}
          </div>
          <div>
            <div className="text-xs font-semibold mb-2" style={{ color: P.gold }}>DESCRIPTIONS</div>
            {kit.googleAd.descriptions.map((d, i) => (
              <Card key={i} className="mb-2 p-3">
                <div className="flex items-start justify-between gap-3">
                  <span className="text-sm" style={{ color: P.white }}>{d}</span>
                  <CopyBtn text={d} />
                </div>
              </Card>
            ))}
          </div>
          <div>
            <div className="text-xs font-semibold mb-2" style={{ color: P.gold }}>TARGET KEYWORDS</div>
            <div className="flex flex-wrap gap-2">
              {kit.googleAd.keywords.map((kw) => (
                <span key={kw} className="text-xs px-3 py-1 rounded-full" style={{ background: "rgba(245,158,11,0.1)", color: P.gold, border: `1px solid ${P.gold}30` }}>{kw}</span>
              ))}
            </div>
          </div>
        </div>
      )}
      {activeChannel === "directMail" && (
        <div className="space-y-4">
          <div>
            <div className="text-xs font-semibold mb-2" style={{ color: P.gold }}>POSTCARD HEADLINE</div>
            <Card>
              <div className="flex items-center justify-between gap-3">
                <p className="text-lg font-bold" style={{ color: P.white }}>{kit.directMail.headline}</p>
                <CopyBtn text={kit.directMail.headline} />
              </div>
            </Card>
          </div>
          <div>
            <div className="text-xs font-semibold mb-2" style={{ color: P.gold }}>BODY COPY</div>
            <Card>
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm leading-relaxed" style={{ color: P.white }}>{kit.directMail.body}</p>
                <CopyBtn text={kit.directMail.body} />
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Tab: Campaign Readiness ───────────────────────────────────────────────────
function TabReadiness() {
  const critical = NEUROCATCH_READINESS.filter(r => r.priority === "critical");
  const high = NEUROCATCH_READINESS.filter(r => r.priority === "high");
  const medium = NEUROCATCH_READINESS.filter(r => r.priority === "medium");
  const done = NEUROCATCH_READINESS.filter(r => r.status === "active").length;
  const total = NEUROCATCH_READINESS.length;
  const pct = Math.round((done / total) * 100);

  function ReadinessRow({ item }: { item: typeof NEUROCATCH_READINESS[0] }) {
    const isActive = item.status === "active";
    return (
      <div className="flex items-start gap-3 p-3 rounded-xl border" style={{ background: isActive ? "rgba(245,158,11,0.06)" : P.card, borderColor: isActive ? P.gold + "55" : P.border }}>
        <div className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-xs" style={{ background: isActive ? P.gold : P.card2, color: isActive ? "#000" : P.muted, border: isActive ? "none" : `1px solid ${P.border}` }}>
          {isActive ? "✓" : "○"}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold" style={{ color: isActive ? P.gold : P.white }}>{item.item}</div>
          <div className="text-xs mt-0.5" style={{ color: P.muted }}>{item.note}</div>
        </div>
        <span className="text-xs px-2 py-0.5 rounded-full shrink-0" style={{ background: item.priority === "critical" ? "rgba(234,88,12,0.15)" : item.priority === "high" ? "rgba(249,115,22,0.1)" : "rgba(245,158,11,0.08)", color: item.priority === "critical" ? P.deep : item.priority === "high" ? P.orange : P.gold }}>
          {item.priority}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1" style={{ color: P.white }}>Campaign Readiness Scorecard</h2>
        <p className="text-sm" style={{ color: P.muted }}>Track what's live, what's pending, and what to prioritize next.</p>
      </div>

      {/* Progress */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <div className="font-semibold" style={{ color: P.white }}>Overall Readiness</div>
          <div className="text-2xl font-bold" style={{ background: P.gradText, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{pct}%</div>
        </div>
        <div className="h-3 rounded-full overflow-hidden" style={{ background: P.card2 }}>
          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: P.grad }} />
        </div>
        <div className="text-xs mt-2" style={{ color: P.muted }}>{done} of {total} items active</div>
      </Card>

      <div className="space-y-5">
        <div>
          <div className="text-xs font-bold mb-3 uppercase tracking-wider" style={{ color: P.deep }}>Critical</div>
          <div className="space-y-2">{critical.map((r, i) => <ReadinessRow key={i} item={r} />)}</div>
        </div>
        <div>
          <div className="text-xs font-bold mb-3 uppercase tracking-wider" style={{ color: P.orange }}>High Priority</div>
          <div className="space-y-2">{high.map((r, i) => <ReadinessRow key={i} item={r} />)}</div>
        </div>
        <div>
          <div className="text-xs font-bold mb-3 uppercase tracking-wider" style={{ color: P.gold }}>Medium Priority</div>
          <div className="space-y-2">{medium.map((r, i) => <ReadinessRow key={i} item={r} />)}</div>
        </div>
      </div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function NeuroCatchDashboard() {
  const [activeTab, setActiveTab] = useState("market");
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen" style={{ background: P.bg, color: P.white }}>
      {/* Header */}
      <div style={{ background: P.bg2, borderBottom: `1px solid ${P.border}` }}>
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate("/campaigns")} className="text-xs px-3 py-1.5 rounded-lg border transition-all hover:opacity-80" style={{ borderColor: P.border, color: P.muted }}>
                ← Campaigns
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: P.grad }}>🧠</div>
                <div>
                  <div className="font-bold text-lg" style={{ color: P.white }}>NeuroCatch</div>
                  <div className="text-xs" style={{ color: P.muted }}>Brain Vital Signs Platform · {NEUROCATCH_CLIENT.location}</div>
                </div>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <div className="text-xs px-3 py-1.5 rounded-full" style={{ background: "rgba(245,158,11,0.1)", color: P.gold, border: `1px solid ${P.gold}30` }}>
                🧠 MedTech / Cognitive Assessment
              </div>
              <div className="text-xs px-3 py-1.5 rounded-full" style={{ background: "rgba(249,115,22,0.1)", color: P.orange, border: `1px solid ${P.orange}30` }}>
                ⚡ Pre-Launch Intelligence
              </div>
            </div>
          </div>

          {/* Tagline */}
          <div className="mt-3 text-sm italic" style={{ color: P.muted }}>
            "<GradText>You can't effectively treat what you can't objectively measure.</GradText>"
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-4 overflow-x-auto pb-1">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className="text-sm px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-200 shrink-0"
                style={{ background: activeTab === t.id ? P.gold : "transparent", color: activeTab === t.id ? "#000" : P.muted, fontWeight: activeTab === t.id ? 700 : 400 }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {activeTab === "market"    && <TabMarket />}
        {activeTab === "segments"  && <TabSegments />}
        {activeTab === "keywords"  && <TabKeywords />}
        {activeTab === "siteid"    && <TabSiteID />}
        {activeTab === "outreach"  && <TabOutreach />}
        {activeTab === "readiness" && <TabReadiness />}
      </div>
    </div>
  );
}
