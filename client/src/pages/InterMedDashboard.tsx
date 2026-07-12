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
  { id: "weekly",    label: "This Week's Targets", icon: "🎯" },
  { id: "how",       label: "How It Works",        icon: "⚙️" },
  { id: "siteid",    label: "Who's On Your Site",  icon: "👁️" },
  { id: "roi",       label: "ROI Calculator",      icon: "📈" },
  { id: "healthtrust", label: "Healthtrust Opportunity", icon: "🌐" },
];

function SL({ children, color }: { children: React.ReactNode; color?: string }) {
  return (
    <div className="text-xs font-black tracking-widest mb-3" style={{ color: color || C.orange }}>
      {children}
    </div>
  );
}

// ── OUTREACH PANEL ─────────────────────────────────────────────────────────────
type HospitalEntry = {
  name: string; city: string; beds: number; signal: string;
  intensity: number; weeks: number;
  contact: { name: string; title: string; phone: string; email: string };
  tags: string[];
};

function OutreachPanel({ h }: { h: HospitalEntry }) {
  const [channel, setChannel] = useState<"email" | "linkedin" | "mail">("email");
  const first = h.contact.name.split(" ")[0];
  const channels = [
    { id: "email" as const,    label: "Email",       icon: "✉️" },
    { id: "linkedin" as const, label: "LinkedIn",    icon: "💼" },
    { id: "mail" as const,     label: "Direct Mail", icon: "📬" },
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
            {ch.icon} {ch.label}
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

// ── TAB: THIS WEEK'S TARGETS ───────────────────────────────────────────────────
function TabWeekly() {
  const [selected, setSelected] = useState<number | null>(null);
  const hospitals: HospitalEntry[] = [
    { name: "Vanderbilt University Medical Center", city: "Nashville, TN", beds: 1039, signal: "Urology Laser Systems", intensity: 94, weeks: 3, contact: { name: "Sandra Holloway", title: "VP of Supply Chain", phone: "(615) 322-5000", email: "s.holloway@vumc.org" }, tags: ["Urology", "Capital Equipment", "High Intent"] },
    { name: "Baptist Memorial Hospital", city: "Memphis, TN", beds: 614, signal: "Spinal Implant Supplier Evaluation", intensity: 88, weeks: 5, contact: { name: "Marcus Webb", title: "Director of Materials Management", phone: "(901) 226-5000", email: "m.webb@bmhcc.org" }, tags: ["Spinal", "Orthopedic", "GPO Review"] },
    { name: "HCA TriStar Centennial Medical Center", city: "Nashville, TN", beds: 741, signal: "Hernia Mesh Alternatives", intensity: 81, weeks: 2, contact: { name: "Denise Cartwright", title: "VAC Chair & Clinical Value Director", phone: "(615) 342-1000", email: "d.cartwright@hcahealthcare.com" }, tags: ["Hernia Mesh", "VAC Review", "HCA Network"] },
    { name: "Erlanger Health System", city: "Chattanooga, TN", beds: 581, signal: "Lead Wires & Monitoring Accessories", intensity: 76, weeks: 4, contact: { name: "James Pruitt", title: "Biomedical Engineering Director", phone: "(423) 778-7000", email: "j.pruitt@erlanger.org" }, tags: ["Monitoring", "Biomedical", "Contract Expiring"] },
    { name: "Ascension Saint Thomas Hospital", city: "Nashville, TN", beds: 683, signal: "Urology Disposables & Catheter Systems", intensity: 71, weeks: 2, contact: { name: "Patricia Nguyen", title: "OR Director, Surgical Services", phone: "(615) 222-2111", email: "p.nguyen@ascension.org" }, tags: ["Urology", "Disposables", "OR Director"] },
    { name: "Regional One Health", city: "Memphis, TN", beds: 337, signal: "Minimally Invasive Surgical Tools", intensity: 68, weeks: 1, contact: { name: "Anthony Brooks", title: "VP Procurement & Supply Chain", phone: "(901) 545-7100", email: "a.brooks@regionalonehealth.org" }, tags: ["Surgical", "MIS", "New Signal"] },
    { name: "Cookeville Regional Medical Center", city: "Cookeville, TN", beds: 247, signal: "Spinal Implant Supplier Evaluation", intensity: 63, weeks: 3, contact: { name: "Lisa Tanner", title: "Director of Materials Management", phone: "(931) 528-2541", email: "l.tanner@crmchealth.org" }, tags: ["Spinal", "Regional", "GPO Review"] },
    { name: "Wellmont Holston Valley Medical Center", city: "Kingsport, TN", beds: 345, signal: "Hernia Mesh & Wound Care Products", intensity: 59, weeks: 2, contact: { name: "Robert Simmons", title: "Supply Chain Manager", phone: "(423) 224-4000", email: "r.simmons@balladhealth.org" }, tags: ["Hernia Mesh", "Wound Care", "Mid-Market"] },
    { name: "St. Thomas Rutherford Hospital", city: "Murfreesboro, TN", beds: 286, signal: "Capital Equipment Lease Expiring — OR", intensity: 55, weeks: 6, contact: { name: "Karen Odom", title: "OR Director", phone: "(615) 396-4100", email: "k.odom@ascension.org" }, tags: ["Capital Equipment", "OR", "Lease Expiring"] },
    { name: "Sumner Regional Medical Center", city: "Gallatin, TN", beds: 155, signal: "GPO Contract Comparison — Urology", intensity: 51, weeks: 1, contact: { name: "David Morse", title: "Materials Management Director", phone: "(615) 452-4210", email: "d.morse@sumnerregional.com" }, tags: ["Urology", "GPO", "New Signal"] },
  ];
  const ic = (v: number) => v >= 85 ? C.orange : v >= 70 ? C.purpleLight : C.green;
  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <SL color={C.orange}>BUYERSDNA + EXACTAUDIENCE — LIVE INTELLIGENCE</SL>
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
                <div className="text-xs mt-1 font-semibold" style={{ color: ic(h.intensity) }}>🔥 {h.signal}</div>
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  {h.tags.map((t, j) => (
                    <span key={j} className="text-xs px-2 py-0.5 rounded-full font-bold"
                      style={{ background: `${C.purpleLight}20`, color: C.purpleLight }}>{t}</span>
                  ))}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-2xl font-black" style={{ color: ic(h.intensity) }}>{h.intensity}</div>
                <div className="text-xs" style={{ color: C.purpleLight }}>Intent Score</div>
                <div className="text-xs mt-0.5" style={{ color: C.purpleLight }}>{h.weeks}w signal</div>
              </div>
            </div>
            {selected === i && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} transition={{ duration: 0.2 }}
                className="mt-4 pt-4" style={{ borderTop: `1px solid ${C.border}` }}>
                <div className="text-xs font-black mb-2" style={{ color: C.gold }}>DECISION-MAKER CONTACT</div>
                <div className="rounded-xl p-3 space-y-1" style={{ background: C.card2 }}>
                  <div className="font-black" style={{ color: C.white }}>{h.contact.name}</div>
                  <div className="text-xs" style={{ color: C.purpleLight }}>{h.contact.title}</div>
                  <div className="flex gap-4 mt-2 flex-wrap">
                    <a href={`tel:${h.contact.phone}`} className="text-xs font-bold" style={{ color: C.orange }}>📞 {h.contact.phone}</a>
                    <a href={`mailto:${h.contact.email}`} className="text-xs font-bold" style={{ color: C.orange }}>✉️ {h.contact.email}</a>
                  </div>
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
        <div className="text-xs" style={{ color: C.purpleLight }}>10 hospitals. 10 decision-makers. 10 direct contacts. Ready to call.</div>
      </motion.div>
    </div>
  );
}

// ── TAB: HOW IT WORKS ─────────────────────────────────────────────────────────
function TabHow() {
  const steps = [
    {
      num: "01", title: "BuyersDNA Monitors 127 Data Sources",
      desc: "Every day, BuyersDNA aggregates behavioral signals from hospital procurement networks, medical device review sites, competitor websites, GPO research portals, trade publications, and content consumption platforms. When a hospital is actively evaluating a product category, the signal appears.",
      example: "Vanderbilt has visited 4 urology device supplier sites, downloaded 2 GPO comparison guides, and searched 'urology laser systems' 11 times this week.",
      color: C.orange,
    },
    {
      num: "02", title: "ExactAudience Identifies the Decision-Maker",
      desc: "Once a hospital shows buying intent, ExactAudience identifies the specific person responsible for that purchase decision — VP of Supply Chain, OR Director, VAC Chair, or Department Head — and delivers their direct phone number and email.",
      example: "Sandra Holloway, VP of Supply Chain at Vanderbilt. Direct line: (615) 322-5000. Email: s.holloway@vumc.org.",
      color: C.purpleLight,
    },
    {
      num: "03", title: "Your Sales Team Gets the Weekly Report",
      desc: "Every Monday morning, your team receives a ranked list of hospitals actively shopping in your product categories — sorted by intent score, with the decision-maker contact attached to each one. No cold calling. No guessing. Just warm, in-market leads.",
      example: "10 hospitals. 10 contacts. Ranked by urgency. Delivered before your team's morning standup.",
      color: C.gold,
    },
    {
      num: "04", title: "SITEID Captures Visitors to IntermedTN.com",
      desc: "SITEID identifies the companies visiting your website in real time — even if they never fill out a form. When a hospital procurement director visits your site, you know who they are, what pages they viewed, and how long they stayed.",
      example: "Baptist Memorial Hospital visited your Spinal Products page 3 times this week. Nobody called you. SITEID caught it.",
      color: C.green,
    },
  ];
  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <SL>THE PLATFORM — THREE TOOLS, ONE WORKFLOW</SL>
        <div className="text-lg font-black mb-2" style={{ color: C.white }}>Know Who Is Shopping Before They Call Anyone</div>
        <div className="text-sm leading-relaxed" style={{ color: C.white }}>
          Most medical device distributors wait for the phone to ring. ExactAudience gives InterMed a radar system — you see which hospitals are actively evaluating your product categories right now, who the decision-maker is, and how to reach them directly.
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
                📍 Example: {s.example}
              </div>
            </div>
          </div>
        </motion.div>
      ))}

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <SL color={C.gold}>WHAT SETS THIS APART FROM LUSHA OR ZOOMINFO</SL>
        <div className="space-y-3">
          {[
            { label: "Lusha / ZoomInfo", desc: "Contact databases. You look up a name and get a phone number. You have to already know who you want to reach.", bad: true },
            { label: "ExactAudience + BuyersDNA", desc: "Intent-first. We tell you which hospitals are shopping right now, then attach the decision-maker contact. You don't need to know who to look for — the platform finds them for you.", bad: false },
          ].map((r, i) => (
            <div key={i} className="rounded-xl p-3 flex items-start gap-3"
              style={{ background: r.bad ? `${C.border}80` : `${C.orange}12`, border: `1px solid ${r.bad ? C.border : C.orange}30` }}>
              <div className="text-lg shrink-0">{r.bad ? "📖" : "🎯"}</div>
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
                <div className="text-xs font-black mb-1" style={{ color: C.purpleLight }}>❌ Without SITEID</div>
                <div className="text-xs leading-relaxed" style={{ color: C.white }}>{r.without}</div>
              </div>
              <div className="rounded-xl p-3" style={{ background: `${C.green}10`, border: `1px solid ${C.green}20` }}>
                <div className="text-xs font-black mb-1" style={{ color: C.green }}>✅ With SITEID</div>
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
          If InterMed closes just <span style={{ color: C.orange, fontWeight: 900 }}>one new hospital relationship</span> worth $75K/year from a lead generated by BuyersDNA, the platform has paid for itself entirely. Every additional account is pure margin.
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
        <SL>THE BIGGER PICTURE — HEALTHTRUST PERFORMANCE GROUP</SL>
        <div className="text-lg font-black mb-2" style={{ color: C.white }}>From One Distributor to 1,900 Hospitals</div>
        <div className="text-sm leading-relaxed" style={{ color: C.white }}>
          Healthtrust Performance Group is the GPO arm of HCA Healthcare — the world's largest for-profit hospital operator. They serve 1,900 member hospitals and 35,000 non-acute care sites. If InterMed can facilitate an introduction to Healthtrust leadership, the opportunity expands from a single distributor relationship to a network-wide platform partnership.
        </div>
      </motion.div>

      <div className="space-y-3">
        {[
          {
            title: "The Problem Healthtrust Has",
            color: C.orange,
            content: "Healthtrust's core value proposition is helping member hospitals reduce costs and improve supply chain efficiency. But they don't have a tool that tells them which hospitals in their network are actively evaluating new suppliers — or which hospitals outside their network are shopping and could be recruited as new members.",
          },
          {
            title: "What ExactAudience Solves for Them",
            color: C.purpleLight,
            content: "BuyersDNA can identify hospitals showing intent signals for GPO membership, supply chain optimization, and cost reduction programs. ExactAudience can identify the CFO, VP of Supply Chain, or CEO at each hospital. Healthtrust gets a weekly list of hospitals that are actively looking for exactly what they offer.",
          },
          {
            title: "The Network Growth Opportunity",
            color: C.gold,
            content: "A single new hospital member is worth millions in contract volume to Healthtrust. If ExactAudience helps them recruit even 10 new hospital members per year, the ROI on the platform investment is measured in tens of millions. This is not a software subscription conversation — it is a network growth engine conversation.",
          },
          {
            title: "The Member & Supplier Adoption Opportunity",
            color: C.green,
            content: "Healthtrust's 1,900 member hospitals each face the same challenge InterMed faces — finding in-market buyers before competitors do. If Healthtrust recommends ExactAudience to their members and contracted suppliers as a preferred performance tool, the addressable market expands dramatically.",
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
        className="rounded-2xl p-5" style={{ background: `linear-gradient(135deg, ${C.purple}40, ${C.orange}20)`, border: `1px solid ${C.orange}30` }}>
        <div className="text-sm font-black mb-2" style={{ color: C.white }}>The Ask for the Healthtrust Conversation</div>
        <div className="text-sm leading-relaxed italic" style={{ color: C.white }}>
          "We're not asking Healthtrust to buy software. We're asking them to let us show their business development team how BuyersDNA identifies hospitals that are actively shopping for GPO membership right now — and how ExactAudience delivers the CEO or CFO contact at each one. One pilot. One market. Thirty days."
        </div>
      </motion.div>
    </div>
  );
}

// ── MAIN DASHBOARD ─────────────────────────────────────────────────────────────
export default function InterMedDashboard() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("weekly");
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
            <div className="text-2xl font-black" style={{ color: C.orange }}>🏥 InterMed Resources TN</div>
            <div className="text-xs mt-0.5" style={{ color: C.white }}>Medical Device Distribution · Tennessee · Powered by ExactAudience</div>
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
              {tab.icon} {tab.label}
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
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
