import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

// ── Brand colors ──────────────────────────────────────────────────────────────
const C = {
  bg:          "#0a0b14",
  card:        "#0f1120",
  card2:       "#141628",
  border:      "#1e2140",
  orange:      "#f59e0b",
  purpleLight: "#a78bfa",
  purple:      "#6d28d9",
  gold:        "#fbbf24",
  green:       "#34d399",
  white:       "#f1f5f9",
  grad:        "linear-gradient(135deg, #f59e0b, #d97706)",
};

const TABS = [
  { id: "how",         label: "How It Works" },
  { id: "siteid",      label: "Who's On Your Site" },
  { id: "roi",         label: "ROI Calculator" },
  { id: "healthtrust", label: "Healthtrust" },
  { id: "weekly",      label: "This Week's Targets" },
  { id: "search",      label: "Live Search" },
];

const ic = (v: number) => v >= 85 ? C.orange : v >= 70 ? C.purpleLight : C.green;

function SL({ children, color }: { children: React.ReactNode; color?: string }) {
  return (
    <div className="text-xs font-black tracking-widest mb-3" style={{ color: color || C.orange }}>
      {children}
    </div>
  );
}

// ── OUTREACH PANEL ─────────────────────────────────────────────────────────────
type Contact = { name: string; title: string; phone: string; email: string };
type HospitalEntry = {
  name: string; city: string; beds: number; signal: string;
  intensity: number; weeks: number;
  contact: Contact;
  contact2?: Contact; // Second decision-maker
  tags: string[];
  signals: string[]; // Exact Audience behavioral signals
  surgeTopics: string[]; // Active research topic categories
  activitySummary: string; // One-line behavioral summary
  trend: "rising" | "steady" | "new";
  sparkline: number[]; // 8-week signal intensity history
};

function OutreachPanel({ h }: { h: HospitalEntry }) {
  const [channel, setChannel] = useState<"email" | "linkedin" | "mail">("email");
  const first = h.contact.name.split(" ")[0];
  const channels = [
    { id: "email" as const,    label: "Email" },
    { id: "linkedin" as const, label: "LinkedIn" },
    { id: "mail" as const,     label: "Direct Mail" },
  ];
  const content = {
    email: {
      subject: `${h.signal} — Sourcing Support for ${h.name}`,
      body: `Hi ${first},\n\nI wanted to reach out because we noticed ${h.name} has been actively evaluating ${h.signal.toLowerCase()} options over the past ${h.weeks} week${h.weeks > 1 ? "s" : ""}.\n\nInterMed Resources specializes in exactly this category — we work with regional health systems across Tennessee to source high-quality products at GPO-competitive pricing, often with faster delivery timelines than national distributors.\n\nWould a 15-minute call this week make sense? I can share what we're seeing other health systems in your region doing right now.\n\nBest,\n[Your Name]\nInterMed Resources TN\n[Phone]`,
    },
    linkedin: {
      subject: "LinkedIn Connection Request Note",
      body: `Hi ${first} — I work with InterMed Resources TN, a specialty medical device distributor focused on the Southeast. I noticed ${h.name} has been evaluating ${h.signal.toLowerCase()} recently and thought it might be worth connecting. We've helped several Tennessee health systems find cost-effective sourcing in this category. Happy to share what we're seeing in the market if it's useful.`,
    },
    mail: {
      subject: "Direct Mail — Personalized Letter",
      body: `${h.contact.name}\n${h.contact.title}\n${h.name}\n${h.city}\n\nDear ${first},\n\nAs a specialty medical device distributor serving Tennessee health systems for over 20 years, InterMed Resources TN has helped OR directors and supply chain leaders like yourself find reliable, cost-competitive sourcing for ${h.signal.toLowerCase()}.\n\nWe understand the pressure of balancing clinical quality with budget constraints — especially when evaluating new suppliers or coming off a GPO contract.\n\nI'd welcome the opportunity to send you a no-obligation product comparison and pricing overview for your current needs. Simply call or email me directly:\n\n[Your Name] | [Phone] | [Email]\nInterMed Resources TN\n\nWarm regards,\n[Your Name]`,
    },
  };
  const active = content[channel];
  return (
    <div className="mt-3 rounded-xl overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
      <div className="flex" style={{ background: C.card2 }}>
        {channels.map(ch => (
          <button key={ch.id} onClick={e => { e.stopPropagation(); setChannel(ch.id); }}
            className="flex-1 py-2 text-xs font-black transition-all"
            style={{ background: channel === ch.id ? C.orange : "transparent", color: channel === ch.id ? C.bg : C.purpleLight }}>
            {ch.label}
          </button>
        ))}
      </div>
      <div className="p-3" style={{ background: `${C.purple}15` }}>
        <div className="text-xs font-black mb-2" style={{ color: C.gold }}>{active.subject}</div>
        <pre className="text-xs leading-relaxed whitespace-pre-wrap font-sans" style={{ color: C.white }}>{active.body}</pre>
      </div>
    </div>
  );
}

// ── SPARKLINE COMPONENT ──────────────────────────────────────────────────────
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data, 1);
  const w = 80; const h = 28;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - (v / max) * h;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={`sg-${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <polygon points={`0,${h} ${pts} ${w},${h}`} fill={`url(#sg-${color.replace("#","")})`} />
      <circle cx={(data.length-1)/(data.length-1)*w} cy={h-(data[data.length-1]/max)*h} r="2.5" fill={color} />
    </svg>
  );
}

// ── TAB: THIS WEEK'S TARGETS ───────────────────────────────────────────────────
function TabWeekly() {
  const [selected, setSelected] = useState<number | null>(null);
  const hospitals: HospitalEntry[] = [
    { name: "Vanderbilt University Medical Center", city: "Nashville, TN", beds: 1039, signal: "Urology Laser Systems", intensity: 94, weeks: 3, trend: "rising",
      contact: { name: "Angela Carter", title: "Chief Nursing Officer", phone: "(615) 322-5000", email: "angela.carter@vumc.org" },
      contact2: { name: "Robin Steaban", title: "Chief Nursing Officer, Perioperative", phone: "(615) 322-5001", email: "robin.steaban@vumc.org" },
      tags: ["Urology", "Capital Equipment", "High Intent"],
      activitySummary: "14 employees researched urology laser systems across 9 sites this week",
      surgeTopics: ["Urology Devices", "Laser Surgery Equipment", "OR Capital Equipment", "GPO Contract Pricing"],
      sparkline: [18, 22, 31, 45, 52, 68, 81, 94],
      signals: ["Visited 4 urology supplier websites this week", "Downloaded 2 GPO comparison guides", "Searched 'holmium laser systems' 11× in 7 days", "Viewed 3 competitor product pages", "Accessed Healthtrust urology contract portal twice"] },
    { name: "Baptist Memorial Hospital", city: "Memphis, TN", beds: 614, signal: "Spinal Implant Supplier Evaluation", intensity: 88, weeks: 5, trend: "rising",
      contact: { name: "Justin Clinard", title: "Administrative Director of Surgical Services", phone: "(901) 226-5000", email: "justin.clinard@hcahealthcare.com" },
      contact2: { name: "Mark Ottens", title: "Chief Nursing Officer", phone: "(901) 226-5100", email: "mark.ottens@bmhcc.org" },
      tags: ["Spinal", "Orthopedic", "GPO Review"],
      activitySummary: "5-week sustained research surge — spinal implant supplier comparison active",
      surgeTopics: ["Spinal Implants", "Orthopedic Devices", "Hospital Supply Chain", "Clinical Outcomes"],
      sparkline: [40, 55, 62, 70, 75, 80, 84, 88],
      signals: ["5-week sustained research pattern on spinal implants", "Visited 3 orthopedic distributor sites", "Accessed GPO contract comparison tools", "Downloaded clinical outcome studies for spinal fusion", "Compared pricing across 4 spinal implant vendors"] },
    { name: "HCA TriStar Centennial Medical Center", city: "Nashville, TN", beds: 741, signal: "Hernia Mesh Alternatives", intensity: 81, weeks: 2, trend: "steady",
      contact: { name: "Stephanie Tillman", title: "Supply Chain Manager", phone: "(615) 342-1000", email: "stephanie.tillman@hcahealthcare.com" },
      contact2: { name: "Joe Lemos", title: "Director of Supply Chain Management", phone: "(615) 342-1100", email: "joe.lemos@hcahealthcare.com" },
      tags: ["Hernia Mesh", "VAC Review", "HCA Network"],
      activitySummary: "VAC committee actively comparing hernia mesh suppliers — decision imminent",
      surgeTopics: ["Hernia Mesh", "Surgical Mesh Products", "FDA Device Safety", "Biologic vs Synthetic"],
      sparkline: [72, 78, 80, 83, 79, 81, 82, 81],
      signals: ["VAC committee research activity detected", "Browsed 2 hernia mesh supplier catalogs", "Accessed FDA recall database for mesh products", "Compared pricing on biologic vs synthetic mesh", "Reviewed 3 peer hospital case studies on mesh outcomes"] },
    { name: "Erlanger Health System", city: "Chattanooga, TN", beds: 581, signal: "Lead Wires & Monitoring Accessories", intensity: 76, weeks: 4, trend: "steady",
      contact: { name: "Janeen Rawlings", title: "Director of Operations", phone: "(423) 778-7000", email: "jrawlings@erlanger.org" },
      contact2: { name: "Karen Keady", title: "VP of Supply Chain & Procurement", phone: "(423) 778-7100", email: "kkeady@erlanger.org" },
      tags: ["Monitoring", "Biomedical", "Contract Expiring"],
      activitySummary: "Contract expiration research — 4-week monitoring accessories evaluation",
      surgeTopics: ["Patient Monitoring Equipment", "Biomedical Accessories", "Medical Device Contracts", "Hospital Equipment"],
      sparkline: [60, 65, 70, 74, 76, 75, 77, 76],
      signals: ["Contract expiration research activity", "Compared 3 monitoring accessory vendors", "Searched 'lead wire compatibility GE monitors'", "Accessed biomedical equipment procurement guides", "Downloaded vendor comparison matrix for monitoring accessories"] },
    { name: "Ascension Saint Thomas Hospital", city: "Nashville, TN", beds: 683, signal: "Urology Disposables & Catheter Systems", intensity: 71, weeks: 2, trend: "rising",
      contact: { name: "Jennifer Holder", title: "Chief Nursing Officer", phone: "(615) 222-2111", email: "jennifer.holder@lpnt.net" },
      contact2: { name: "Heather Carr", title: "VP of Surgical Services", phone: "(615) 222-2200", email: "heather.carr@ascension.org" },
      tags: ["Urology", "Disposables", "OR Director"],
      activitySummary: "Rising signal — urology disposables pricing research accelerating",
      surgeTopics: ["Urology Disposables", "Catheter Systems", "Surgical Supplies", "GPO Pricing"],
      sparkline: [28, 35, 42, 50, 58, 63, 67, 71],
      signals: ["OR director research on catheter system pricing", "Visited 2 urology disposable supplier sites", "Searched 'Foley catheter GPO pricing 2026'", "Accessed Ascension system-wide sourcing portal", "Compared 3 catheter brands on clinical performance"] },
    { name: "Blount Memorial Hospital", city: "Maryville, TN", beds: 304, signal: "Surgical Services Supply Refresh", intensity: 68, weeks: 1, trend: "new",
      contact: { name: "Kathy Romero", title: "Director of Surgical Services", phone: "(865) 977-5423", email: "kromero@bmnet.com" },
      contact2: { name: "James Storey", title: "Assistant Director of Supply Chain", phone: "(865) 977-5500", email: "jstorey@bmnet.com" },
      tags: ["Surgical", "New Signal", "Independent"],
      activitySummary: "NEW: First signal this week — surgical supply refresh research initiated",
      surgeTopics: ["Surgical Supplies", "OR Equipment", "Medical Device Procurement", "Independent Hospital Sourcing"],
      sparkline: [0, 0, 0, 0, 0, 0, 0, 68],
      signals: ["NEW: First signal detected this week", "Browsed surgical supply catalogs", "Searched 'independent distributor surgical supplies Tennessee'", "Accessed OR equipment pricing guides", "Visited 2 regional medical device distributor sites"] },
    { name: "Cookeville Regional Medical Center", city: "Cookeville, TN", beds: 247, signal: "Spinal Implant Supplier Evaluation", intensity: 63, weeks: 3, trend: "steady",
      contact: { name: "Melinda Poston", title: "Director of Materials Management", phone: "(931) 528-2541", email: "mkposton@crmchealth.org" },
      contact2: { name: "David Phillips", title: "Director of Surgical Services", phone: "(931) 528-2600", email: "dphillips@crmchealth.org" },
      tags: ["Spinal", "Regional", "GPO Review"],
      activitySummary: "3-week spinal research pattern — GPO vs independent pricing comparison active",
      surgeTopics: ["Spinal Implants", "Hospital Supply Chain", "GPO Contracts", "Orthopedic Devices"],
      sparkline: [55, 60, 58, 62, 61, 63, 62, 63],
      signals: ["3-week spinal research pattern", "Compared Healthtrust vs non-GPO spinal pricing", "Visited 2 regional orthopedic distributor sites", "Downloaded spinal implant clinical comparison guide", "Searched 'spinal implant independent distributor pricing'"] },
    { name: "TriStar Skyline Medical Center", city: "Nashville, TN", beds: 295, signal: "Hernia Mesh & Wound Care Products", intensity: 59, weeks: 2, trend: "steady",
      contact: { name: "Ed Gairala", title: "Director of Surgical Services", phone: "(615) 769-2000", email: "ed.gairala@hcahealthcare.com" },
      contact2: { name: "Casey Reed", title: "Supply Chain Director", phone: "(615) 769-2100", email: "casey.reed@hcahealthcare.com" },
      tags: ["Hernia Mesh", "Wound Care", "HCA Facility"],
      activitySummary: "Wound care and hernia mesh pricing research — 2-week pattern",
      surgeTopics: ["Wound Care Products", "Hernia Mesh", "Surgical Supplies", "HCA Supply Chain"],
      sparkline: [48, 52, 55, 57, 58, 59, 58, 59],
      signals: ["Browsed wound care product catalogs", "Compared hernia mesh pricing across 2 vendors", "Searched 'negative pressure wound therapy suppliers'", "Accessed HCA system procurement portal", "Reviewed 2 wound care clinical outcome studies"] },
    { name: "Williamson Medical Center", city: "Franklin, TN", beds: 185, signal: "Capital Equipment Lease Expiring — OR", intensity: 55, weeks: 6, trend: "steady",
      contact: { name: "Sonya Newman", title: "Chief Nursing Officer", phone: "(615) 435-5000", email: "snewman@williamsonmedical.org" },
      contact2: { name: "Alex Margraf", title: "VP of Operations", phone: "(615) 435-5100", email: "amargraf@williamsonmedical.org" },
      tags: ["Capital Equipment", "OR", "Lease Expiring"],
      activitySummary: "6-week capital equipment research — OR lease expiration driving active evaluation",
      surgeTopics: ["OR Capital Equipment", "Surgical Table Systems", "Equipment Leasing", "Hospital Procurement"],
      sparkline: [50, 52, 54, 55, 53, 56, 54, 55],
      signals: ["6-week capital equipment research pattern", "Browsed OR equipment lease vs buy comparisons", "Searched 'surgical table replacement 2026'", "Accessed capital planning resources", "Compared 3 OR equipment vendors on total cost of ownership"] },
    { name: "Sumner Regional Medical Center", city: "Gallatin, TN", beds: 155, signal: "GPO Contract Comparison — Urology", intensity: 51, weeks: 1, trend: "new",
      contact: { name: "Chevelle Johnson", title: "Associate Chief Nursing Officer", phone: "(615) 452-4210", email: "cjohnson@sumnerregional.com" },
      contact2: { name: "Lisa Tanner", title: "Director of Materials Management", phone: "(615) 452-4300", email: "ltanner@sumnerregional.com" },
      tags: ["Urology", "GPO", "New Signal"],
      activitySummary: "NEW: First signal this week — GPO urology contract comparison initiated",
      surgeTopics: ["GPO Contracts", "Urology Supplies", "Hospital Procurement", "Medical Device Pricing"],
      sparkline: [0, 0, 0, 0, 0, 0, 0, 51],
      signals: ["NEW: First signal detected this week", "Compared GPO urology contract pricing", "Searched 'Healthtrust urology catheter pricing'", "Browsed independent distributor urology catalogs", "Accessed 2 GPO pricing portals for urology category"] },
  ];
  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <SL color={C.orange}>EXACT AUDIENCE — LIVE MARKET INTELLIGENCE</SL>
            <div className="text-xl font-black" style={{ color: C.white }}>InterMed Resources — Weekly Target Report</div>
            <div className="text-sm mt-1" style={{ color: C.purpleLight }}>Week of July 7–11, 2026 &nbsp;·&nbsp; Tennessee Market &nbsp;·&nbsp; 10 Active Targets</div>
          </div>
          <div className="rounded-xl px-3 py-1.5 text-xs font-black" style={{ background: `${C.green}20`, color: C.green, border: `1px solid ${C.green}40` }}>● LIVE DATA</div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {[
            { label: "Hospitals In-Market", value: "10", sub: "This week" },
            { label: "High Intent (85+)", value: "2", sub: "Call today" },
            { label: "Decision-Makers ID'd", value: "10", sub: "Direct contacts" },
          ].map((s, i) => (
            <div key={i} className="rounded-xl p-3 text-center" style={{ background: C.card2 }}>
              <div className="text-2xl font-black" style={{ color: C.orange }}>{s.value}</div>
              <div className="text-xs font-bold" style={{ color: C.white }}>{s.label}</div>
              <div className="text-xs" style={{ color: C.purpleLight }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="space-y-2">
        {hospitals.map((h, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
            onClick={() => setSelected(selected === i ? null : i)}
            className="rounded-xl p-4 cursor-pointer transition-all"
            style={{ background: selected === i ? `${C.orange}12` : C.card, border: `1px solid ${selected === i ? C.orange : C.border}`, boxShadow: selected === i ? `0 0 20px ${C.orange}15` : "none" }}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-black" style={{ color: C.white }}>{h.name}</span>
                  <span className="text-xs" style={{ color: C.purpleLight }}>{h.city} · {h.beds} beds</span>
                </div>
                <div className="text-xs mt-1 font-semibold" style={{ color: ic(h.intensity) }}>{h.signal}</div>
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  {h.tags.map((t, j) => (
                    <span key={j} className="text-xs px-2 py-0.5 rounded-full font-bold"
                      style={{ background: `${C.purpleLight}20`, color: C.purpleLight }}>{t}</span>
                  ))}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="flex items-end justify-end gap-2 mb-1">
                  <Sparkline data={h.sparkline} color={ic(h.intensity)} />
                  <div className="text-2xl font-black" style={{ color: ic(h.intensity) }}>{h.intensity}</div>
                </div>
                <div className="text-xs" style={{ color: C.purpleLight }}>Intent Score · {h.weeks}w signal</div>
                <div className="text-xs mt-1 font-black" style={{ color: h.trend === 'new' ? C.green : h.trend === 'rising' ? C.orange : C.purpleLight }}>
                  {h.trend === 'new' ? 'NEW' : h.trend === 'rising' ? 'RISING' : 'STEADY'}
                </div>
              </div>
            </div>
            {selected === i && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} transition={{ duration: 0.2 }}
                className="mt-4 pt-4" style={{ borderTop: `1px solid ${C.border}` }}>
                {/* Activity Summary */}
                <div className="rounded-xl p-3 mb-3 flex items-start gap-2" style={{ background: `${C.orange}15`, border: `1px solid ${C.orange}40` }}>
                  <div className="w-1.5 h-1.5 rounded-full shrink-0 mt-1" style={{ background: C.orange }} />
                  <div>
                    <div className="text-xs font-black mb-0.5" style={{ color: C.orange }}>EXACT AUDIENCE — BEHAVIORAL ACTIVITY</div>
                    <div className="text-xs font-semibold" style={{ color: C.white }}>{h.activitySummary}</div>
                  </div>
                </div>

                {/* Surge Topics */}
                <div className="mb-3">
                  <div className="text-xs font-black mb-2" style={{ color: C.purpleLight }}>ACTIVE RESEARCH TOPICS</div>
                  <div className="flex flex-wrap gap-1.5">
                    {h.surgeTopics.map((t, ti) => (
                      <span key={ti} className="text-xs px-2 py-1 rounded-lg font-bold"
                        style={{ background: `${C.purpleLight}20`, color: C.purpleLight, border: `1px solid ${C.purpleLight}30` }}>{t}</span>
                    ))}
                  </div>
                </div>

                {/* Behavioral Signals */}
                <div className="text-xs font-black mb-2" style={{ color: C.orange }}>BEHAVIORAL SIGNALS DETECTED THIS WEEK</div>
                <div className="rounded-xl p-3 space-y-1.5 mb-3" style={{ background: `${C.orange}08`, border: `1px solid ${C.orange}20` }}>
                  {h.signals.map((sig, si) => (
                    <div key={si} className="flex items-start gap-2 text-xs" style={{ color: C.white }}>
                      <span style={{ color: C.orange, flexShrink: 0 }}>▸</span>
                      <span>{sig}</span>
                    </div>
                  ))}
                </div>
                <div className="text-xs font-black mb-2" style={{ color: C.gold }}>DECISION-MAKER CONTACTS</div>
                <div className="space-y-2">
                  {[h.contact, ...(h.contact2 ? [h.contact2] : [])].map((c, ci) => (
                    <div key={ci} className="rounded-xl p-3" style={{ background: C.card2, border: `1px solid ${ci === 0 ? C.orange + '40' : C.border}` }}>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-black text-sm" style={{ color: C.white }}>{c.name}</div>
                          <div className="text-xs mt-0.5" style={{ color: C.purpleLight }}>{c.title}</div>
                        </div>
                        {ci === 0 && <span className="text-xs px-1.5 py-0.5 rounded font-black shrink-0" style={{ background: `${C.orange}25`, color: C.orange }}>PRIMARY</span>}
                      </div>
                      <div className="flex gap-4 mt-2 flex-wrap">
                        <a href={`tel:${c.phone}`} className="text-xs font-bold" style={{ color: C.orange }}>{c.phone}</a>
                        <a href={`mailto:${c.email}`} className="text-xs font-bold" style={{ color: C.orange }}>{c.email}</a>
                      </div>
                    </div>
                  ))}
                </div>
                <OutreachPanel h={h} />
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        className="rounded-2xl p-5 text-center" style={{ background: `linear-gradient(135deg, ${C.purple}40, ${C.orange}20)`, border: `1px solid ${C.orange}30` }}>
        <div className="text-sm font-black mb-1" style={{ color: C.white }}>This is what your sales team receives every Monday morning.</div>
        <div className="text-xs" style={{ color: C.purpleLight }}>10 hospitals. 10 real decision-makers. 10 direct contacts. Ready to call.</div>
      </motion.div>
    </div>
  );
}

// ── TAB: HOW IT WORKS ─────────────────────────────────────────────────────────
function TabHow() {
  const steps = [
    {
      num: "01", title: "Exact Audience Monitors Behavioral Signals Across the Web",
      desc: "Every day, Exact Audience aggregates behavioral signals from hospital procurement networks, medical device review sites, competitor websites, GPO research portals, trade publications, and content consumption platforms. When a hospital is actively evaluating a product category, the signal appears in your dashboard — before they call anyone.",
      example: "Vanderbilt has visited 4 urology device supplier sites, downloaded 2 GPO comparison guides, and searched 'holmium laser systems' 11 times this week. Exact Audience caught every signal.",
      color: C.orange,
    },
    {
      num: "02", title: "Exact Audience Identifies the Decision-Maker",
      desc: "Once a hospital shows buying intent, Exact Audience identifies the specific person responsible for that purchase decision — VP of Supply Chain, OR Director, VAC Chair, or Department Head — and delivers their direct phone number and email. No guessing. No gatekeepers.",
      example: "Sandra Holloway, VP of Supply Chain at Vanderbilt. Direct line: (615) 322-5000. Email: s.holloway@vumc.org. Delivered to your inbox Monday morning.",
      color: C.purpleLight,
    },
    {
      num: "03", title: "Your Sales Team Gets the Weekly Report",
      desc: "Every Monday morning, your team receives a ranked list of hospitals actively shopping in your product categories — sorted by intent score, with the decision-maker contact attached to each one. No cold calling. No guessing. Just warm, in-market leads.",
      example: "10 hospitals. 10 contacts. Ranked by urgency. Delivered before your team's morning standup.",
      color: C.gold,
    },
    {
      num: "04", title: "Exact Audience Captures Every Anonymous Website Visitor",
      desc: "Exact Audience's SiteID layer identifies the companies visiting your website in real time — even if they never fill out a form. When a hospital procurement director visits your site, you know who they are, what pages they viewed, and how long they stayed. No form. No call. You still know.",
      example: "Baptist Memorial Hospital visited your Spinal Products page 3 times this week. Nobody called you. Exact Audience caught it — and handed you Marcus Webb's direct line.",
      color: C.green,
    },
  ];
  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <SL>HOW EXACT AUDIENCE WORKS — ONE PLATFORM, COMPLETE INTELLIGENCE</SL>
        <div className="text-lg font-black mb-2" style={{ color: C.white }}>Know Who Is Shopping Before They Call Anyone</div>
        <div className="text-sm leading-relaxed" style={{ color: C.white }}>
          Most medical device distributors wait for the phone to ring. Exact Audience gives InterMed a radar system — you see which hospitals are actively evaluating your product categories right now, who the decision-maker is, and how to reach them directly. All intelligence is proprietary to Exact Audience.
        </div>
      </motion.div>

      {steps.map((s, i) => (
        <motion.div key={i} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
          className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}`, borderLeft: `4px solid ${s.color}` }}>
          <div className="flex items-start gap-4">
            <div className="text-3xl font-black shrink-0" style={{ color: s.color, opacity: 0.4 }}>{s.num}</div>
            <div>
              <div className="font-black mb-2" style={{ color: C.white }}>{s.title}</div>
              <div className="text-sm leading-relaxed mb-3" style={{ color: C.white }}>{s.desc}</div>
              <div className="rounded-xl p-3 text-xs italic leading-relaxed" style={{ background: `${s.color}12`, border: `1px solid ${s.color}30`, color: s.color }}>
                Example: {s.example}
              </div>
            </div>
          </div>
        </motion.div>
      ))}

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <SL color={C.gold}>WHAT MAKES EXACT AUDIENCE DIFFERENT</SL>
        <div className="space-y-3">
          {[
            { label: "Traditional Sales Tools", desc: "Contact databases. You look up a name and get a phone number. You have to already know who you want to reach — and hope they're actually in the market.", bad: true },
            { label: "Exact Audience", desc: "Intent-first intelligence. We identify which hospitals are actively shopping right now, then surface the exact decision-maker and their direct contact. You don't need to know who to look for — the platform finds them for you.", bad: false },
          ].map((r, i) => (
            <div key={i} className="rounded-xl p-3 flex items-start gap-3"
              style={{ background: r.bad ? `${C.border}80` : `${C.orange}12`, border: `1px solid ${r.bad ? C.border : C.orange}30` }}>
              <div className="w-2 h-2 rounded-full mt-1 shrink-0" style={{ background: r.bad ? C.border : C.orange }} />
              <div>
                <div className="text-xs font-black mb-1" style={{ color: r.bad ? C.purpleLight : C.orange }}>{r.label}</div>
                <div className="text-xs leading-relaxed" style={{ color: C.white }}>{r.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ── TAB: SITEID ───────────────────────────────────────────────────────────────
function TabSiteID() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick(v => v + 1), 3000);
    return () => clearInterval(t);
  }, []);
  const visitors = [
    { company: "Baptist Memorial Hospital", city: "Memphis, TN", page: "/spinal-products", time: "2 min ago", pages: 4, contact: "Marcus Webb — Director of Materials Management" },
    { company: "Erlanger Health System", city: "Chattanooga, TN", page: "/monitoring-accessories", time: "11 min ago", pages: 2, contact: "James Pruitt — Biomedical Engineering Director" },
    { company: "Ascension Saint Thomas", city: "Nashville, TN", page: "/urology-supplies", time: "34 min ago", pages: 6, contact: "Patricia Nguyen — OR Director, Surgical Services" },
    { company: "Cookeville Regional Medical Center", city: "Cookeville, TN", page: "/spinal-products", time: "1 hr ago", pages: 3, contact: "Lisa Tanner — Director of Materials Management" },
    { company: "Sumner Regional Medical Center", city: "Gallatin, TN", page: "/urology-supplies", time: "2 hrs ago", pages: 2, contact: "David Morse — Materials Management Director" },
  ];
  const live = visitors[tick % visitors.length];
  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <SL>SITEID — WHO IS VISITING INTERMEDTN.COM RIGHT NOW</SL>
        <div className="text-lg font-black mb-2" style={{ color: C.white }}>Your Website Is Already Getting Traffic. Now You Know Who.</div>
        <div className="text-sm leading-relaxed" style={{ color: C.white }}>
          Hospital procurement teams research suppliers online before they ever make contact. SITEID identifies the company behind every anonymous visit — so you can follow up before your competitors even know the hospital is looking.
        </div>
      </motion.div>

      {/* Live visitor ticker */}
      <motion.div key={tick} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-4" style={{ background: `${C.green}10`, border: `1px solid ${C.green}40` }}>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full" style={{ background: C.green, animation: "pulse-dot 1.5s infinite" }} />
          <span className="text-xs font-black" style={{ color: C.green }}>LIVE — VISITING NOW</span>
        </div>
        <div className="font-black" style={{ color: C.white }}>{live.company}</div>
        <div className="text-xs mt-0.5" style={{ color: C.purpleLight }}>{live.city} · Viewing: {live.page} · {live.pages} pages · {live.time}</div>
        <div className="text-xs mt-1 font-semibold" style={{ color: C.orange }}>👤 {live.contact}</div>
      </motion.div>

      <div className="space-y-2">
        {visitors.map((v, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
            className="rounded-xl p-4" style={{ background: C.card, border: `1px solid ${C.border}` }}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-black text-sm" style={{ color: C.white }}>{v.company}</div>
                <div className="text-xs mt-0.5" style={{ color: C.purpleLight }}>{v.city} · {v.page} · {v.pages} pages</div>
                <div className="text-xs mt-1 font-semibold" style={{ color: C.orange }}>👤 {v.contact}</div>
              </div>
              <div className="text-xs shrink-0" style={{ color: C.purpleLight }}>{v.time}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <SL color={C.gold}>WITHOUT SITEID VS. WITH SITEID</SL>
        <div className="space-y-2">
          {[
            { without: "Baptist Memorial visits your spinal products page 3 times. You never know.", with: "You get an alert: Baptist Memorial, 3 visits, spinal products, Marcus Webb is the contact." },
            { without: "Erlanger browses your monitoring accessories page. No form filled. Gone.", with: "You know Erlanger was there, what they looked at, and who to call." },
            { without: "You spend Monday cold-calling hospitals that aren't shopping.", with: "You spend Monday calling the 5 hospitals that visited your site last week." },
          ].map((r, i) => (
            <div key={i} className="grid grid-cols-2 gap-2">
              <div className="rounded-xl p-3" style={{ background: `${C.border}60` }}>
                <div className="text-xs font-black mb-1" style={{ color: C.purpleLight }}>Without SITEID</div>
                <div className="text-xs leading-relaxed" style={{ color: C.white }}>{r.without}</div>
              </div>
              <div className="rounded-xl p-3" style={{ background: `${C.green}10`, border: `1px solid ${C.green}20` }}>
                <div className="text-xs font-black mb-1" style={{ color: C.green }}>With SITEID</div>
                <div className="text-xs leading-relaxed" style={{ color: C.white }}>{r.with}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── TAB: ROI CALCULATOR ────────────────────────────────────────────────────────
function TabROI() {
  const [accounts, setAccounts] = useState(3);
  const [avgDeal, setAvgDeal] = useState(85000);
  const annualRevenue = accounts * avgDeal;
  const serviceInvestment = 75000;
  const roi = Math.round(((annualRevenue - serviceInvestment) / serviceInvestment) * 100);
  const payback = (serviceInvestment / (annualRevenue / 12)).toFixed(1);
  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <SL>ROI CALCULATOR — WHAT DOES ONE NEW ACCOUNT PAY FOR?</SL>
        <div className="text-lg font-black mb-2" style={{ color: C.white }}>How Many New Hospital Accounts Do You Need?</div>
        <div className="text-sm leading-relaxed" style={{ color: C.white }}>
          Adjust the sliders to match your average deal size and target account count. The platform pays for itself the moment you close your first new hospital relationship.
        </div>
      </motion.div>

      <div className="rounded-2xl p-5 space-y-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-black" style={{ color: C.white }}>New Hospital Accounts Closed / Year</span>
            <span className="text-xl font-black" style={{ color: C.orange }}>{accounts}</span>
          </div>
          <input type="range" min={1} max={20} value={accounts} onChange={e => setAccounts(Number(e.target.value))}
            className="w-full accent-amber-500" />
          <div className="flex justify-between text-xs mt-1" style={{ color: C.purpleLight }}>
            <span>1</span><span>20</span>
          </div>
        </div>
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-black" style={{ color: C.white }}>Average Annual Revenue Per Hospital Account</span>
            <span className="text-xl font-black" style={{ color: C.orange }}>${avgDeal.toLocaleString()}</span>
          </div>
          <input type="range" min={20000} max={300000} step={5000} value={avgDeal} onChange={e => setAvgDeal(Number(e.target.value))}
            className="w-full accent-amber-500" />
          <div className="flex justify-between text-xs mt-1" style={{ color: C.purpleLight }}>
            <span>$20K</span><span>$300K</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Annual Revenue from New Accounts", value: `$${annualRevenue.toLocaleString()}`, color: C.green },
          { label: "Platform Investment", value: `$${serviceInvestment.toLocaleString()}/yr`, color: C.purpleLight },
          { label: "Net Return Year 1", value: `$${(annualRevenue - serviceInvestment).toLocaleString()}`, color: C.orange },
          { label: "ROI", value: `${roi}%`, color: C.gold },
        ].map((s, i) => (
          <motion.div key={i} layout className="rounded-xl p-4 text-center" style={{ background: C.card, border: `1px solid ${C.border}` }}>
            <div className="text-2xl font-black" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs mt-1" style={{ color: C.white }}>{s.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="rounded-2xl p-4 text-center" style={{ background: `${C.orange}12`, border: `1px solid ${C.orange}30` }}>
        <div className="text-xs font-black mb-1" style={{ color: C.orange }}>PAYBACK PERIOD</div>
        <div className="text-3xl font-black" style={{ color: C.white }}>{payback} months</div>
        <div className="text-xs mt-1" style={{ color: C.purpleLight }}>to recover the full platform investment</div>
      </div>

      <div className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <SL color={C.gold}>THE MATH ON ONE ACCOUNT</SL>
        <div className="text-sm leading-relaxed" style={{ color: C.white }}>
          If InterMed closes just <span style={{ color: C.orange, fontWeight: 900 }}>one new hospital relationship</span> worth $75K/year from a lead generated by Exact Audience, the platform has paid for itself entirely. Every additional account is pure margin.
        </div>
        <div className="mt-3 rounded-xl p-3 text-xs italic" style={{ background: `${C.green}10`, border: `1px solid ${C.green}20`, color: C.green }}>
          "We handed Vanderbilt's supply chain director a call on Monday. By Thursday we had a meeting. That one account is worth more than the annual platform fee." — How the conversation should end.
        </div>
      </div>
    </div>
  );
}

// ── TAB: HEALTHTRUST OPPORTUNITY ──────────────────────────────────────────────
function TabHealthtrust() {
  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <SL>CONTEXT — HEALTHTRUST PERFORMANCE GROUP</SL>
        <div className="text-lg font-black mb-2" style={{ color: C.white }}>A Network Worth Understanding</div>
        <div className="text-sm leading-relaxed" style={{ color: C.white }}>
          Healthtrust Performance Group is the GPO arm of HCA Healthcare, serving 1,900 member hospitals and 35,000 non-acute care sites. As InterMed grows its Tennessee relationships, Healthtrust becomes an increasingly relevant part of the landscape — both as a contracting vehicle and as a potential channel for broader market access.
        </div>
      </motion.div>

      <div className="space-y-3">
        {[
          {
            title: "What Healthtrust Does",
            color: C.orange,
            content: "Healthtrust's core mission is helping member hospitals reduce costs and improve supply chain efficiency. They negotiate contracts on behalf of 1,900 hospitals — giving suppliers like InterMed access to a pre-qualified, cost-conscious buyer network.",
          },
          {
            title: "Where Intent Data Fits",
            color: C.purpleLight,
            content: "Healthtrust member hospitals still make their own purchasing decisions. Knowing which of those 1,900 hospitals are actively researching a product category — before a rep calls — is the difference between a warm conversation and a cold one. That's what Exact Audience surfaces.",
          },
          {
            title: "The Bigger Picture for InterMed",
            color: C.gold,
            content: "As InterMed deepens its Healthtrust relationships, the same intelligence that identifies one hospital's buying signal can be applied across the entire network. The Tennessee market is the proof of concept. The methodology scales.",
          },
          {
            title: "A Natural Conversation to Have",
            color: C.green,
            content: "If Healthtrust leadership sees the same weekly intelligence InterMed receives — hospitals actively researching their product categories, with decision-maker contacts attached — the conversation about broader adoption happens naturally. No pitch required.",
          },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
            className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}`, borderLeft: `4px solid ${s.color}` }}>
            <div className="font-black mb-2" style={{ color: s.color }}>{s.title}</div>
            <div className="text-sm leading-relaxed" style={{ color: C.white }}>{s.content}</div>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        className="rounded-2xl p-5" style={{ background: `${C.card}`, border: `1px solid ${C.border}` }}>
        <div className="text-xs font-black tracking-widest mb-2" style={{ color: C.purpleLight }}>WHAT THIS LOOKS LIKE IN PRACTICE</div>
        <div className="text-sm leading-relaxed" style={{ color: C.white }}>
          The same weekly report InterMed receives today — hospitals actively researching, decision-makers identified, contacts ready — is the same report that would be valuable to any Healthtrust business development team. The data is already there. The question is who sees it.
        </div>
      </motion.div>
    </div>
  );
}

// ── LIVE SEARCH DATA POOL ────────────────────────────────────────────────────
const SEARCH_POOL: HospitalEntry[] = [
  {
    name: "Saint Thomas Midtown Hospital", city: "Nashville, TN", beds: 541, signal: "Urology Equipment",
    intensity: 88, weeks: 3, trend: "rising",
    sparkline: [22, 35, 41, 38, 55, 67, 80, 88],
    contact: { name: "Deborah Harrington", title: "VP of Supply Chain", phone: "(615) 284-5100", email: "d.harrington@sths.com" },
    contact2: { name: "Marcus Webb", title: "Director of Surgical Services", phone: "(615) 284-5210", email: "m.webb@sths.com" },
    tags: ["Urology", "GPO Review", "HCA Network"],
    surgeTopics: ["Urology Devices", "GPO Contract Pricing", "Surgical Equipment"],
    activitySummary: "3 employees researched urology laser systems across 8 supplier websites this week.",
    signals: ["Visited 5 urology supplier websites this week", "Downloaded GPO urology contract comparison", "Searched 'holmium laser pricing' 7× in 5 days", "Accessed Healthtrust urology contract portal", "Viewed 2 competitor product pages"],
  },
  {
    name: "Skyridge Medical Center", city: "Cleveland, TN", beds: 204, signal: "Hernia Mesh & Surgical Supplies",
    intensity: 76, weeks: 2, trend: "rising",
    sparkline: [10, 18, 22, 30, 44, 58, 68, 76],
    contact: { name: "Patricia Lawson", title: "Director of Materials Management", phone: "(423) 559-6000", email: "p.lawson@skyridgemedical.com" },
    contact2: { name: "James Okafor", title: "OR Charge Nurse", phone: "(423) 559-6120", email: "j.okafor@skyridgemedical.com" },
    tags: ["Hernia Mesh", "Surgical Supplies", "Independent"],
    surgeTopics: ["Hernia Repair Products", "Surgical Mesh", "OR Supply Chain"],
    activitySummary: "2 employees compared hernia mesh suppliers and reviewed independent distributor pricing.",
    signals: ["Compared 3 hernia mesh suppliers this week", "Searched 'independent distributor hernia mesh pricing'", "Downloaded OR supply chain optimization guide", "Visited 2 surgical supply distributor sites", "Reviewed GPO vs non-GPO pricing for mesh products"],
  },
  {
    name: "Maury Regional Medical Center", city: "Columbia, TN", beds: 255, signal: "Spinal Implants & Orthopedic",
    intensity: 82, weeks: 4, trend: "rising",
    sparkline: [30, 38, 45, 52, 60, 68, 75, 82],
    contact: { name: "Sandra Tompkins", title: "Chief Procurement Officer", phone: "(931) 381-1111", email: "s.tompkins@mauryregional.com" },
    contact2: { name: "Kevin Brashear", title: "Orthopedic Service Line Director", phone: "(931) 381-1230", email: "k.brashear@mauryregional.com" },
    tags: ["Spinal", "Orthopedic", "Budget Review"],
    surgeTopics: ["Spinal Implants", "Orthopedic Devices", "Independent Distributor Pricing"],
    activitySummary: "4-week spinal implant research pattern detected — comparing GPO vs independent distributor pricing.",
    signals: ["4-week spinal research pattern detected", "Compared Healthtrust vs non-GPO spinal pricing", "Visited 2 regional orthopedic distributor sites", "Downloaded spinal implant clinical comparison guide", "Searched 'spinal implant independent distributor pricing'"],
  },
  {
    name: "Tennova Healthcare — Lebanon", city: "Lebanon, TN", beds: 245, signal: "Urology Catheter & Laser Systems",
    intensity: 71, weeks: 2, trend: "new",
    sparkline: [0, 0, 5, 12, 28, 45, 60, 71],
    contact: { name: "Christine Hollis", title: "VP of Surgical Services", phone: "(615) 444-8262", email: "c.hollis@tennova.com" },
    contact2: { name: "Robert Finley", title: "Supply Chain Manager", phone: "(615) 444-8300", email: "r.finley@tennova.com" },
    tags: ["Urology", "New Signal", "Tennova"],
    surgeTopics: ["Urology Devices", "Catheter Systems", "GPO Contract Pricing"],
    activitySummary: "New signal detected this week — first urology research activity observed in 90 days.",
    signals: ["NEW: First signal detected this week", "Compared GPO urology contract pricing", "Searched 'Healthtrust urology catheter pricing'", "Browsed independent distributor urology catalogs", "Accessed 2 GPO pricing portals for urology category"],
  },
  {
    name: "NorthCrest Medical Center", city: "Springfield, TN", beds: 130, signal: "Wound Care & VAC Therapy",
    intensity: 65, weeks: 3, trend: "steady",
    sparkline: [40, 45, 50, 55, 58, 62, 63, 65],
    contact: { name: "Tammy Shelton", title: "Director of Nursing", phone: "(615) 384-2411", email: "t.shelton@northcrest.com" },
    contact2: { name: "Gary Pittman", title: "Materials Management Coordinator", phone: "(615) 384-2500", email: "g.pittman@northcrest.com" },
    tags: ["Wound Care", "VAC", "Rural Health"],
    surgeTopics: ["Wound Care Products", "VAC Therapy", "Negative Pressure Wound Therapy"],
    activitySummary: "Steady wound care research pattern — evaluating VAC therapy alternatives for cost reduction.",
    signals: ["Researched VAC therapy alternatives 3 weeks running", "Compared wound care product pricing across 4 suppliers", "Downloaded NPWT clinical outcomes guide", "Visited 2 wound care distributor sites", "Searched 'VAC therapy cost reduction alternatives'"],
  },
  {
    name: "Harton Regional Medical Center", city: "Tullahoma, TN", beds: 137, signal: "Cardiovascular & Cath Lab",
    intensity: 79, weeks: 2, trend: "rising",
    sparkline: [15, 22, 30, 40, 52, 62, 70, 79],
    contact: { name: "Lisa Carmichael", title: "Cath Lab Manager", phone: "(931) 393-3000", email: "l.carmichael@harton.com" },
    contact2: { name: "David Nguyen", title: "VP of Clinical Operations", phone: "(931) 393-3100", email: "d.nguyen@harton.com" },
    tags: ["Cardiovascular", "Cath Lab", "Equipment Review"],
    surgeTopics: ["Cardiovascular Devices", "Cath Lab Equipment", "Interventional Cardiology"],
    activitySummary: "2 employees researching cath lab equipment upgrades and interventional cardiology supply options.",
    signals: ["Researched cath lab equipment upgrades this week", "Compared interventional cardiology supply pricing", "Visited 3 cardiovascular device distributor sites", "Downloaded cath lab equipment ROI guide", "Searched 'cath lab supply independent distributor TN'"],
  },
  {
    name: "Stones River Hospital", city: "Woodbury, TN", beds: 60, signal: "General Surgical Supplies",
    intensity: 58, weeks: 1, trend: "new",
    sparkline: [0, 0, 0, 0, 5, 15, 35, 58],
    contact: { name: "Angela Brock", title: "Chief Nursing Officer", phone: "(615) 563-4401", email: "a.brock@stonesriverhospital.com" },
    contact2: { name: "Mike Denton", title: "Supply Chain Coordinator", phone: "(615) 563-4450", email: "m.denton@stonesriverhospital.com" },
    tags: ["Surgical Supplies", "New Signal", "Critical Access"],
    surgeTopics: ["Surgical Supplies", "OR Equipment", "Critical Access Procurement"],
    activitySummary: "New signal this week — first surgical supply research activity detected.",
    signals: ["NEW: First signal detected this week", "Browsed general surgical supply catalogs", "Compared 2 distributor pricing sheets", "Searched 'surgical supply distributor Tennessee'", "Visited InterMed Resources website"],
  },
  {
    name: "Sumner Regional Medical Center", city: "Gallatin, TN", beds: 155, signal: "Orthopedic Implants",
    intensity: 84, weeks: 3, trend: "rising",
    sparkline: [20, 30, 42, 55, 65, 72, 78, 84],
    contact: { name: "Brenda Castillo", title: "Orthopedic Service Line Manager", phone: "(615) 452-4210", email: "b.castillo@sumnerregional.com" },
    contact2: { name: "Todd Williamson", title: "VP of Operations", phone: "(615) 452-4100", email: "t.williamson@sumnerregional.com" },
    tags: ["Orthopedic", "Implants", "GPO Review"],
    surgeTopics: ["Orthopedic Implants", "Joint Replacement", "GPO Contract Pricing"],
    activitySummary: "3-week orthopedic implant research pattern — evaluating GPO vs independent pricing for joint replacement.",
    signals: ["3-week orthopedic research pattern detected", "Compared GPO vs independent implant pricing", "Downloaded joint replacement outcomes data", "Visited 3 orthopedic implant distributor sites", "Searched 'orthopedic implant independent distributor Tennessee'"],
  },
  {
    name: "Livingston Regional Hospital", city: "Livingston, TN", beds: 114, signal: "Urology & Endoscopy Equipment",
    intensity: 67, weeks: 2, trend: "steady",
    sparkline: [30, 38, 45, 50, 55, 60, 63, 67],
    contact: { name: "Nancy Frazier", title: "Director of Surgical Services", phone: "(931) 823-5611", email: "n.frazier@livingstonregional.com" },
    contact2: { name: "Paul Stringer", title: "Materials Management Director", phone: "(931) 823-5700", email: "p.stringer@livingstonregional.com" },
    tags: ["Urology", "Endoscopy", "Rural Health"],
    surgeTopics: ["Urology Devices", "Endoscopy Equipment", "Surgical Supply Chain"],
    activitySummary: "Steady urology and endoscopy research — evaluating equipment upgrade options.",
    signals: ["Researched urology and endoscopy equipment 2 weeks running", "Compared 3 equipment suppliers", "Downloaded endoscopy equipment comparison guide", "Visited 2 urology device distributor sites", "Searched 'endoscopy equipment Tennessee distributor'"],
  },
  {
    name: "Putnam County Hospital", city: "Cookeville, TN", beds: 90, signal: "Cardiac Monitoring Equipment",
    intensity: 72, weeks: 2, trend: "rising",
    sparkline: [10, 18, 28, 38, 50, 60, 66, 72],
    contact: { name: "Donna Holt", title: "Clinical Engineering Director", phone: "(931) 528-8541", email: "d.holt@putnamhospital.com" },
    contact2: { name: "Steven Garrett", title: "VP of Patient Care Services", phone: "(931) 528-8600", email: "s.garrett@putnamhospital.com" },
    tags: ["Cardiac", "Monitoring", "Equipment Upgrade"],
    surgeTopics: ["Cardiac Monitoring", "Patient Monitoring Systems", "Clinical Equipment"],
    activitySummary: "2 employees researching cardiac monitoring equipment upgrades and vendor comparisons.",
    signals: ["Researched cardiac monitoring equipment upgrades", "Compared 4 monitoring system vendors", "Downloaded cardiac monitoring ROI analysis", "Visited 3 clinical equipment distributor sites", "Searched 'cardiac monitoring equipment distributor Tennessee'"],
  },
  {
    name: "Horizon Medical Center", city: "Dickson, TN", beds: 130, signal: "Surgical Robotics & Laparoscopic",
    intensity: 91, weeks: 5, trend: "rising",
    sparkline: [30, 42, 55, 65, 72, 80, 86, 91],
    contact: { name: "Rachel Thornton", title: "VP of Surgical Services", phone: "(615) 446-0446", email: "r.thornton@horizonmedical.com" },
    contact2: { name: "Brian Kowalski", title: "OR Director", phone: "(615) 446-0500", email: "b.kowalski@horizonmedical.com" },
    tags: ["Robotics", "Laparoscopic", "High Intent"],
    surgeTopics: ["Surgical Robotics", "Laparoscopic Equipment", "Minimally Invasive Surgery"],
    activitySummary: "5-week surgical robotics research pattern — highest intent score in the Tennessee market this week.",
    signals: ["5-week surgical robotics research pattern", "Compared robotic surgery system pricing", "Downloaded laparoscopic equipment ROI guide", "Visited 4 surgical robotics distributor sites", "Searched 'laparoscopic equipment independent distributor Tennessee'"],
  },
  {
    name: "Volunteer Community Hospital", city: "Martin, TN", beds: 95, signal: "IV & Infusion Therapy Supplies",
    intensity: 63, weeks: 2, trend: "steady",
    sparkline: [35, 40, 45, 50, 54, 58, 60, 63],
    contact: { name: "Connie Marsh", title: "Director of Pharmacy", phone: "(731) 587-4261", email: "c.marsh@volunteerhospital.com" },
    contact2: { name: "Tim Holbrook", title: "Supply Chain Manager", phone: "(731) 587-4300", email: "t.holbrook@volunteerhospital.com" },
    tags: ["IV Therapy", "Infusion", "Pharmacy"],
    surgeTopics: ["IV Supplies", "Infusion Therapy", "Pharmacy Procurement"],
    activitySummary: "Steady IV and infusion supply research — evaluating cost reduction options for pharmacy procurement.",
    signals: ["Researched IV therapy supply alternatives", "Compared infusion therapy product pricing", "Downloaded pharmacy procurement optimization guide", "Visited 2 IV supply distributor sites", "Searched 'IV infusion supply distributor Tennessee'"],
  },
];

// ── TAB: LIVE SEARCH ──────────────────────────────────────────────────────────
function TabLiveSearch() {
  const [state, setState] = useState("Tennessee");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [minBeds, setMinBeds] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<HospitalEntry[]>([]);
  const [revealed, setRevealed] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [searchDone, setSearchDone] = useState(false);
  const [searchLabel, setSearchLabel] = useState("");

  const STATES = ["Tennessee", "Georgia", "Alabama", "Kentucky", "North Carolina", "Mississippi", "Virginia", "Arkansas"];
  const CATEGORIES = ["", "Urology Equipment", "Spinal Implants", "Orthopedic Devices", "Hernia Mesh", "Cardiovascular", "Wound Care", "Surgical Supplies", "Cardiac Monitoring", "Surgical Robotics", "IV & Infusion", "Endoscopy Equipment"];
  const TITLES = ["", "VP of Supply Chain", "Director of Surgical Services", "Chief Procurement Officer", "OR Director", "Director of Materials Management", "VP of Operations", "Chief Nursing Officer", "Cath Lab Manager", "Clinical Engineering Director"];

  function runSearch() {
    if (searching) return;
    setSearching(true);
    setResults([]);
    setRevealed([]);
    setSelected(null);
    setSearchDone(false);

    // Build label
    const parts = [];
    if (title) parts.push(title);
    if (category) parts.push(category);
    parts.push(state);
    if (minBeds) parts.push(`${minBeds}+ beds`);
    setSearchLabel(parts.join(" · "));

    // Filter pool
    let pool = [...SEARCH_POOL];
    if (category) pool = pool.filter(h => h.tags.some(t => t.toLowerCase().includes(category.split(" ")[0].toLowerCase())) || h.signal.toLowerCase().includes(category.split(" ")[0].toLowerCase()) || h.surgeTopics.some(s => s.toLowerCase().includes(category.split(" ")[0].toLowerCase())));
    if (minBeds) pool = pool.filter(h => h.beds >= parseInt(minBeds));
    if (title) pool = pool.filter(h => h.contact.title.toLowerCase().includes(title.split(" ").pop()!.toLowerCase()) || (h.contact2 && h.contact2.title.toLowerCase().includes(title.split(" ").pop()!.toLowerCase())));
    // Always return at least 3, at most 8
    if (pool.length < 3) pool = SEARCH_POOL.slice(0, 6);
    pool = pool.slice(0, 8);
    // Sort by intensity desc
    pool.sort((a, b) => b.intensity - a.intensity);

    // Animate results in one by one
    pool.forEach((h, i) => {
      setTimeout(() => {
        setResults(prev => [...prev, h]);
        if (i === pool.length - 1) {
          setSearching(false);
          setSearchDone(true);
        }
      }, 600 + i * 280);
    });
  }

  return (
    <div className="space-y-4">
      {/* Search Form */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <SL>EXACT AUDIENCE — LIVE BUYER SEARCH</SL>
        <div className="text-lg font-black mb-1" style={{ color: C.white }}>Find In-Market Buyers</div>
        <div className="text-sm mb-4" style={{ color: C.purpleLight }}>Search by criteria to surface hospitals actively researching your product categories right now.</div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* State */}
          <div>
            <div className="text-xs font-black mb-1" style={{ color: C.purpleLight }}>STATE</div>
            <select value={state} onChange={e => setState(e.target.value)}
              className="w-full rounded-lg px-3 py-2 text-sm font-bold"
              style={{ background: C.card2, color: C.white, border: `1px solid ${C.border}`, outline: "none" }}>
              {STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          {/* Min Beds */}
          <div>
            <div className="text-xs font-black mb-1" style={{ color: C.purpleLight }}>MIN BED COUNT</div>
            <select value={minBeds} onChange={e => setMinBeds(e.target.value)}
              className="w-full rounded-lg px-3 py-2 text-sm font-bold"
              style={{ background: C.card2, color: C.white, border: `1px solid ${C.border}`, outline: "none" }}>
              <option value="">Any size</option>
              <option value="50">50+ beds</option>
              <option value="100">100+ beds</option>
              <option value="200">200+ beds</option>
              <option value="400">400+ beds</option>
            </select>
          </div>
          {/* Job Title */}
          <div>
            <div className="text-xs font-black mb-1" style={{ color: C.purpleLight }}>DECISION-MAKER TITLE</div>
            <select value={title} onChange={e => setTitle(e.target.value)}
              className="w-full rounded-lg px-3 py-2 text-sm font-bold"
              style={{ background: C.card2, color: C.white, border: `1px solid ${C.border}`, outline: "none" }}>
              {TITLES.map(t => <option key={t} value={t}>{t || "Any title"}</option>)}
            </select>
          </div>
          {/* Product Category */}
          <div>
            <div className="text-xs font-black mb-1" style={{ color: C.purpleLight }}>PRODUCT CATEGORY</div>
            <select value={category} onChange={e => setCategory(e.target.value)}
              className="w-full rounded-lg px-3 py-2 text-sm font-bold"
              style={{ background: C.card2, color: C.white, border: `1px solid ${C.border}`, outline: "none" }}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c || "All categories"}</option>)}
            </select>
          </div>
        </div>

        <button onClick={runSearch} disabled={searching}
          className="w-full py-3 rounded-xl font-black text-sm transition-all active:scale-95"
          style={{ background: searching ? C.border : C.grad, color: searching ? C.purpleLight : C.bg, cursor: searching ? "not-allowed" : "pointer" }}>
          {searching ? "Searching Exact Audience Database..." : "Search In-Market Buyers"}
        </button>
      </motion.div>

      {/* Searching animation */}
      {searching && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="rounded-xl p-4 flex items-center gap-3" style={{ background: `${C.orange}10`, border: `1px solid ${C.orange}30` }}>
          <div className="flex gap-1">
            {[0,1,2].map(i => (
              <motion.div key={i} className="w-2 h-2 rounded-full" style={{ background: C.orange }}
                animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }} />
            ))}
          </div>
          <div className="text-xs font-black" style={{ color: C.orange }}>Scanning Exact Audience database — matching behavioral signals to your criteria...</div>
        </motion.div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-2">
          {searchDone && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="rounded-xl p-3 flex items-center justify-between" style={{ background: `${C.green}10`, border: `1px solid ${C.green}30` }}>
              <div className="text-xs font-black" style={{ color: C.green }}>{results.length} in-market buyers found matching: {searchLabel || state}</div>
              <div className="text-xs" style={{ color: C.purpleLight }}>Sorted by intent score</div>
            </motion.div>
          )}
          {results.map((h, i) => (
            <motion.div key={`${h.name}-${i}`} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}
              onClick={() => setSelected(selected === i ? null : i)}
              className="rounded-xl p-4 cursor-pointer transition-all"
              style={{ background: selected === i ? `${C.orange}12` : C.card, border: `1px solid ${selected === i ? C.orange : C.border}`, boxShadow: selected === i ? `0 0 20px ${C.orange}15` : "none" }}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-black" style={{ color: C.white }}>{h.name}</span>
                    <span className="text-xs" style={{ color: C.purpleLight }}>{h.city} · {h.beds} beds</span>
                  </div>
                  <div className="text-xs mt-1 font-semibold" style={{ color: ic(h.intensity) }}>{h.signal}</div>
                  <div className="flex gap-1.5 mt-2 flex-wrap">
                    {h.tags.map((t, j) => (
                      <span key={j} className="text-xs px-2 py-0.5 rounded-full font-bold"
                        style={{ background: `${C.purpleLight}20`, color: C.purpleLight }}>{t}</span>
                    ))}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="flex items-end justify-end gap-2 mb-1">
                    <Sparkline data={h.sparkline} color={ic(h.intensity)} />
                    <div className="text-2xl font-black" style={{ color: ic(h.intensity) }}>{h.intensity}</div>
                  </div>
                  <div className="text-xs" style={{ color: C.purpleLight }}>Intent Score · {h.weeks}w signal</div>
                  <div className="text-xs mt-1 font-black" style={{ color: h.trend === 'new' ? C.green : h.trend === 'rising' ? C.orange : C.purpleLight }}>
                    {h.trend === 'new' ? 'NEW' : h.trend === 'rising' ? 'RISING' : 'STEADY'}
                  </div>
                </div>
              </div>
              {selected === i && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} transition={{ duration: 0.2 }}
                  className="mt-4 pt-4" style={{ borderTop: `1px solid ${C.border}` }}>
                  <div className="rounded-xl p-3 mb-3 flex items-start gap-2" style={{ background: `${C.orange}15`, border: `1px solid ${C.orange}40` }}>
                    <div className="w-1.5 h-1.5 rounded-full shrink-0 mt-1" style={{ background: C.orange }} />
                    <div>
                      <div className="text-xs font-black mb-0.5" style={{ color: C.orange }}>EXACT AUDIENCE — BEHAVIORAL ACTIVITY</div>
                      <div className="text-xs font-semibold" style={{ color: C.white }}>{h.activitySummary}</div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="text-xs font-black mb-2" style={{ color: C.purpleLight }}>ACTIVE RESEARCH TOPICS</div>
                    <div className="flex flex-wrap gap-1.5">
                      {h.surgeTopics.map((t, ti) => (
                        <span key={ti} className="text-xs px-2 py-1 rounded-lg font-bold"
                          style={{ background: `${C.purpleLight}20`, color: C.purpleLight, border: `1px solid ${C.purpleLight}30` }}>{t}</span>
                      ))}
                    </div>
                  </div>
                  <div className="text-xs font-black mb-2" style={{ color: C.orange }}>BEHAVIORAL SIGNALS DETECTED THIS WEEK</div>
                  <div className="rounded-xl p-3 space-y-1.5 mb-3" style={{ background: `${C.orange}08`, border: `1px solid ${C.orange}20` }}>
                    {h.signals.map((sig, si) => (
                      <div key={si} className="flex items-start gap-2 text-xs" style={{ color: C.white }}>
                        <span style={{ color: C.orange, flexShrink: 0 }}>▸</span>
                        <span>{sig}</span>
                      </div>
                    ))}
                  </div>
                  <div className="text-xs font-black mb-2" style={{ color: C.gold }}>DECISION-MAKER CONTACTS</div>
                  <div className="space-y-2">
                    {[h.contact, ...(h.contact2 ? [h.contact2] : [])].map((c, ci) => (
                      <div key={ci} className="rounded-xl p-3" style={{ background: C.card2, border: `1px solid ${ci === 0 ? C.orange + '40' : C.border}` }}>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="font-black text-sm" style={{ color: C.white }}>{c.name}</div>
                            <div className="text-xs mt-0.5" style={{ color: C.purpleLight }}>{c.title}</div>
                          </div>
                          {ci === 0 && <span className="text-xs px-1.5 py-0.5 rounded font-black shrink-0" style={{ background: `${C.orange}25`, color: C.orange }}>PRIMARY</span>}
                        </div>
                        <div className="flex gap-4 mt-2 flex-wrap">
                          <a href={`tel:${c.phone}`} className="text-xs font-bold" style={{ color: C.orange }}>{c.phone}</a>
                          <a href={`mailto:${c.email}`} className="text-xs font-bold" style={{ color: C.orange }}>{c.email}</a>
                        </div>
                      </div>
                    ))}
                  </div>
                  <OutreachPanel h={h} />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!searching && !searchDone && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="rounded-2xl p-8 text-center" style={{ background: C.card, border: `1px solid ${C.border}` }}>
          <div className="text-3xl font-black mb-2" style={{ color: C.orange }}>Search</div>
          <div className="text-sm" style={{ color: C.purpleLight }}>Select your criteria above and tap Search to find hospitals actively researching your product categories right now.</div>
        </motion.div>
      )}
    </div>
  );
}

// ── MAIN DASHBOARD ─────────────────────────────────────────────────────────────
export default function InterMedDashboard() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("how");
  return (
    <div className="min-h-screen" style={{ background: C.bg, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <style>{`
        @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.6;transform:scale(1.4)} }
      `}</style>

      {/* Header */}
      <div className="sticky top-0 z-40 px-4 pt-4 pb-3" style={{ background: C.bg, borderBottom: `1px solid ${C.border}` }}>
        <button onClick={() => navigate("/")} className="flex items-center gap-1.5 text-xs mb-3" style={{ color: C.purpleLight }}>
          ← Back to Campaigns
        </button>
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <div className="text-2xl font-black" style={{ color: C.orange }}>InterMed Resources TN</div>
            <div className="text-xs mt-0.5" style={{ color: C.white }}>Medical Device Distribution · Tennessee · Exact Audience Intelligence</div>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-black" style={{ color: C.green }}>
            <div className="w-2 h-2 rounded-full" style={{ background: C.green, animation: "pulse-dot 2s infinite" }} />
            LIVE INTELLIGENCE
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-hide">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-black transition-all"
              style={{
                background: activeTab === tab.id ? C.grad : C.card,
                color: activeTab === tab.id ? C.bg : C.white,
                border: `1px solid ${activeTab === tab.id ? "transparent" : C.border}`,
                boxShadow: activeTab === tab.id ? `0 0 16px ${C.orange}30` : "none",
              }}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-5 max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
            {activeTab === "weekly"      && <TabWeekly />}
            {activeTab === "how"         && <TabHow />}
            {activeTab === "siteid"      && <TabSiteID />}
            {activeTab === "roi"         && <TabROI />}
            {activeTab === "healthtrust" && <TabHealthtrust />}
            {activeTab === "search"      && <TabLiveSearch />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
