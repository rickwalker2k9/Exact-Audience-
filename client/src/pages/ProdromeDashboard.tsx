// ─────────────────────────────────────────────────────────────────────────────
// ProdromeDashboard.tsx
// Exact Audience Pitch Portal — Prodrome Science
// Design: Deep navy + emerald green + gold-amber accent
// ICP: Functional medicine practitioners, integrative MDs, neurologists,
//      longevity clinics, chiropractors, autism/dementia specialists
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, LineChart, Line, Cell
} from "recharts";

// ── COLORS ────────────────────────────────────────────────────────────────────
const C = {
  bg:      "#080f1a",
  card:    "#0d1a2b",
  card2:   "#0a1422",
  border:  "#1a2d42",
  white:   "#e8f4f0",
  muted:   "#6b8fa8",
  green:   "#10b981",
  gold:    "#f59e0b",
  teal:    "#06b6d4",
  purple:  "#8b5cf6",
  red:     "#ef4444",
};

// ── SHARED COMPONENTS ─────────────────────────────────────────────────────────
function SL({ children, color = C.green }: { children: React.ReactNode; color?: string }) {
  return (
    <div className="text-xs font-black tracking-widest uppercase mb-1" style={{ color }}>
      {children}
    </div>
  );
}

function AnimatedScore({ value, color }: { value: number; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className="text-3xl font-black"
      style={{ color }}
    >
      {value}
    </motion.div>
  );
}

// ── OUTREACH PANEL ────────────────────────────────────────────────────────────
function OutreachPanel({ t }: { t: typeof TARGET_POOL[0] }) {
  const [activeChannel, setActiveChannel] = useState(0);
  const [copied, setCopied] = useState(false);
  const [liStep, setLiStep] = useState(0);

  const channels = [
    { label: "Email", icon: "✉", color: C.green },
    { label: "LinkedIn", icon: "in", color: C.teal },
    { label: "LI Sequence", icon: "↗", color: C.purple },
    { label: "Phone", icon: "☎", color: C.gold },
    { label: "Direct Mail", icon: "✉✉", color: C.green },
    { label: "SMS", icon: "💬", color: C.teal },
  ];

  const content: Record<number, { subject?: string; body: string }> = {
    0: {
      subject: `${t.org} — your patients could be the first in your state to have plasmalogen data`,
      body: `${t.contact.name.split(" ")[0]} —\n\nMost functional medicine labs still don't test for plasmalogens. That means your patients are walking around with declining cellular membrane health — and no one's measuring it.\n\nProdrome Science has the only clinically validated plasmalogen precursor protocol backed by 30+ years of peer-reviewed research. One ProdromeScan™ blood test reveals what standard lipid panels miss entirely.\n\nPractitioners who add plasmalogen testing typically see 20–30% higher patient retention — because they're offering something no one else in their market has.\n\nWorth 15 minutes to see what this looks like for ${t.org}?`,
    },
    1: {
      body: `Hi ${t.contact.name.split(" ")[0]} — I work with functional medicine practices that are adding advanced lipid testing to their protocols. Would love to connect.`,
    },
    2: {
      body: "",
    },
    3: {
      body: `Hi ${t.contact.name.split(" ")[0]}, this is [Name] — I'll be quick. I work with Prodrome Science, and we support functional medicine practitioners with plasmalogen testing and protocols. Are you currently offering any advanced lipid or cellular health testing in your practice? [Pause for answer] — Great, I'd love to share what a few practices in your area are doing. Do you have 10 minutes this week?`,
    },
    4: {
      body: `${t.contact.name} · ${t.org}\n${t.contact.address || t.city + ", " + t.state}\n\n${t.contact.name.split(" ")[0]} —\n\nYour patients are asking about brain health, longevity, and cognitive decline. Most labs can't answer those questions at the cellular level.\n\nProdromeScan™ can.\n\nIt's the only blood test that measures plasmalogen levels — the specialized lipids that protect every cell membrane in the body. Practitioners who add it to their protocol report patients who stay longer, refer more, and finally have answers to questions that standard bloodwork can't address.\n\nScan the QR code to see what plasmalogen testing looks like for a practice your size.\n\n[QR CODE]\n\nprodrome.com/pages/prodrome-practitioners`,
    },
    5: {
      body: `Hi ${t.contact.name.split(" ")[0]}, quick note — Prodrome Science supports functional medicine practitioners with plasmalogen testing + protocols. One test reveals what standard lipid panels miss. Worth a 10-min call? Reply YES and I'll send a link. – [Name]`,
    },
  };

  const liSequence = [
    {
      label: "Message 1 — Connection Request",
      timing: "Day 1",
      body: `Hi ${t.contact.name.split(" ")[0]} — I follow practitioners who are doing advanced work in cellular health and longevity. Your approach at ${t.org} caught my attention. Would love to connect.`,
    },
    {
      label: "Message 2 — After Connecting",
      timing: "Day 3",
      body: `Thanks for connecting, ${t.contact.name.split(" ")[0]}. Quick question — are you currently offering any advanced lipid or cellular membrane testing in your practice? I ask because I work with Prodrome Science, and we've been helping functional medicine practitioners add plasmalogen testing to their protocols. It's filling a gap that standard bloodwork simply can't address. Happy to share more if it's relevant to what you're building.`,
    },
    {
      label: "Message 3 — Follow-Up",
      timing: "Day 8",
      body: `${t.contact.name.split(" ")[0]} — sharing something that might be worth 2 minutes of your time. Prodrome's ProdromeScan™ is the only test that measures plasmalogen levels directly from a blood draw. Practitioners who add it typically see patients who've been stuck for years finally get answers — and that changes the relationship entirely. Would a quick call make sense?`,
    },
  ];

  const displayBody = activeChannel === 2
    ? liSequence[liStep].body
    : content[activeChannel]?.body || "";

  function handleCopy() {
    const text = activeChannel === 0
      ? `Subject: ${content[0].subject}\n\n${displayBody}`
      : displayBody;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="space-y-3">
      {/* Channel tabs */}
      <div className="flex flex-wrap gap-1.5">
        {channels.map((ch, i) => (
          <button key={i} onClick={() => setActiveChannel(i)}
            className="px-3 py-1 rounded-full text-xs font-black transition-all"
            style={{
              background: activeChannel === i ? `${ch.color}25` : C.card2,
              color: activeChannel === i ? ch.color : C.muted,
              border: `1px solid ${activeChannel === i ? ch.color + "60" : C.border}`,
            }}>
            {ch.icon} {ch.label}
          </button>
        ))}
      </div>

      {/* LI Sequence step selector */}
      {activeChannel === 2 && (
        <div className="flex gap-2">
          {liSequence.map((s, i) => (
            <button key={i} onClick={() => setLiStep(i)}
              className="flex-1 px-2 py-1.5 rounded-lg text-xs font-black text-center transition-all"
              style={{
                background: liStep === i ? `${C.purple}25` : C.card2,
                color: liStep === i ? C.purple : C.muted,
                border: `1px solid ${liStep === i ? C.purple + "60" : C.border}`,
              }}>
              <div>{liSequence[i].timing}</div>
              <div className="text-xs opacity-70">{i === 0 ? "Connect" : i === 1 ? "Follow Up" : "Nurture"}</div>
            </button>
          ))}
        </div>
      )}
      {activeChannel === 2 && (
        <div className="text-xs font-black" style={{ color: C.purple }}>{liSequence[liStep].label}</div>
      )}

      {/* Subject line */}
      {activeChannel === 0 && (
        <div className="rounded-lg px-3 py-2 text-xs" style={{ background: `${C.green}12`, border: `1px solid ${C.green}30` }}>
          <span className="font-black" style={{ color: C.green }}>Subject: </span>
          <span style={{ color: C.white }}>{content[0].subject}</span>
        </div>
      )}

      {/* Message body */}
      <div className="relative">
        <div className="rounded-xl p-3 text-xs leading-relaxed whitespace-pre-line"
          style={{ background: `${C.green}08`, border: `1px solid ${C.green}20`, color: C.white, minHeight: "80px" }}>
          {displayBody}
        </div>
        <button onClick={handleCopy}
          className="absolute top-2 right-2 px-2 py-1 rounded-lg text-xs font-black transition-all"
          style={{ background: copied ? `${C.green}30` : C.card2, color: copied ? C.green : C.muted, border: `1px solid ${C.border}` }}>
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}

// ── TARGET POOL ───────────────────────────────────────────────────────────────
const TARGET_POOL = [
  {
    org: "The UltraWellness Center", city: "Lenox", state: "MA", type: "Functional Medicine Clinic",
    beds: 0, tags: ["Functional Medicine", "Longevity", "Brain Health"],
    contact: { name: "Dr. Mark Hyman", title: "Founder & Medical Director", phone: "(413) 637-9991", email: "info@ultrawellnesscenter.com", address: "55 Pittsfield Rd, Lenox, MA 01240", linkedin: "linkedin.com/in/mark-hyman-md" },
    contact2: { name: "Sarah Kowalski", title: "Director of Clinical Operations", phone: "(413) 637-9991", email: "s.kowalski@ultrawellnesscenter.com", address: "55 Pittsfield Rd, Lenox, MA 01240", linkedin: "linkedin.com/in/sarah-kowalski-uwc" },
    intensity: 94, trend: "up", sparkline: [55, 62, 70, 78, 85, 90, 92, 94],
    activitySummary: "Reviewing advanced biomarker testing options for longevity program expansion.",
  },
  {
    org: "Cleveland Clinic Center for Functional Medicine", city: "Cleveland", state: "OH", type: "Academic Medical Center",
    beds: 0, tags: ["Functional Medicine", "Academic", "Neurology"],
    contact: { name: "Dr. Elizabeth Boham", title: "Medical Director, Functional Medicine", phone: "(216) 444-2200", email: "e.boham@ccf.org", address: "9500 Euclid Ave, Cleveland, OH 44195", linkedin: "linkedin.com/in/elizabeth-boham-md" },
    contact2: { name: "James Whitfield", title: "VP Clinical Programs", phone: "(216) 444-2200", email: "j.whitfield@ccf.org", address: "9500 Euclid Ave, Cleveland, OH 44195", linkedin: "linkedin.com/in/james-whitfield-ccf" },
    intensity: 91, trend: "up", sparkline: [48, 55, 63, 72, 80, 85, 89, 91],
    activitySummary: "Evaluating lipid biomarker testing panels for neurodegenerative disease prevention protocols.",
  },
  {
    org: "Amen Clinics", city: "Costa Mesa", state: "CA", type: "Neurology / Brain Health Clinic",
    beds: 0, tags: ["Brain Health", "Neurology", "SPECT Imaging"],
    contact: { name: "Dr. Daniel Amen", title: "Founder & CEO", phone: "(888) 564-2700", email: "info@amenclinics.com", address: "3150 Bristol St, Costa Mesa, CA 92626", linkedin: "linkedin.com/in/daniel-amen-md" },
    contact2: { name: "Tana Amen", title: "COO & Clinical Educator", phone: "(888) 564-2700", email: "t.amen@amenclinics.com", address: "3150 Bristol St, Costa Mesa, CA 92626", linkedin: "linkedin.com/in/tana-amen" },
    intensity: 89, trend: "up", sparkline: [42, 50, 58, 67, 74, 80, 86, 89],
    activitySummary: "Researching cellular membrane health protocols to complement SPECT brain imaging programs.",
  },
  {
    org: "Parsley Health", city: "New York", state: "NY", type: "Functional Medicine Practice",
    beds: 0, tags: ["Functional Medicine", "Longevity", "Preventive Care"],
    contact: { name: "Dr. Robin Berzin", title: "Founder & CEO", phone: "(646) 627-8000", email: "r.berzin@parsleyhealth.com", address: "30 W 21st St, New York, NY 10010", linkedin: "linkedin.com/in/robin-berzin-md" },
    contact2: { name: "Stephanie Cain", title: "VP Clinical Operations", phone: "(646) 627-8001", email: "s.cain@parsleyhealth.com", address: "30 W 21st St, New York, NY 10010", linkedin: "linkedin.com/in/stephanie-cain-parsley" },
    intensity: 87, trend: "stable", sparkline: [60, 65, 68, 72, 75, 80, 84, 87],
    activitySummary: "Exploring advanced lipid testing to differentiate their membership model.",
  },
  {
    org: "Institute for Functional Medicine", city: "Federal Way", state: "WA", type: "Education & Certification",
    beds: 0, tags: ["Functional Medicine", "Education", "Certification"],
    contact: { name: "Dr. Patrick Hanaway", title: "Chief Medical Officer", phone: "(800) 228-0622", email: "p.hanaway@ifm.org", address: "505 S 336th St, Federal Way, WA 98003", linkedin: "linkedin.com/in/patrick-hanaway-md" },
    contact2: { name: "Laura Kunces", title: "VP Research & Education", phone: "(800) 228-0623", email: "l.kunces@ifm.org", address: "505 S 336th St, Federal Way, WA 98003", linkedin: "linkedin.com/in/laura-kunces-ifm" },
    intensity: 85, trend: "up", sparkline: [38, 45, 52, 60, 68, 74, 80, 85],
    activitySummary: "Reviewing lipid biology curriculum additions for AFMCP certification program.",
  },
  {
    org: "Rupa Health", city: "San Francisco", state: "CA", type: "Lab Ordering Platform",
    beds: 0, tags: ["Lab Platform", "Functional Medicine", "B2B"],
    contact: { name: "Dr. Tara Viswanathan", title: "Co-Founder & CEO", phone: "(415) 800-7000", email: "t.viswanathan@rupahealth.com", address: "340 Pine St, San Francisco, CA 94104", linkedin: "linkedin.com/in/tara-viswanathan-rupa" },
    contact2: { name: "Michael Chen", title: "VP Partnerships", phone: "(415) 800-7001", email: "m.chen@rupahealth.com", address: "340 Pine St, San Francisco, CA 94104", linkedin: "linkedin.com/in/michael-chen-rupa" },
    intensity: 83, trend: "up", sparkline: [35, 42, 50, 58, 65, 72, 78, 83],
    activitySummary: "Evaluating specialty lab partners for their practitioner ordering platform.",
  },
  {
    org: "Neurohacker Collective", city: "Carlsbad", state: "CA", type: "Longevity / Nootropics Brand",
    beds: 0, tags: ["Longevity", "Brain Health", "Supplements"],
    contact: { name: "Daniel Schmachtenberger", title: "Co-Founder", phone: "(760) 814-4100", email: "d.schmachtenberger@neurohacker.com", address: "5765 Fleet St, Carlsbad, CA 92008", linkedin: "linkedin.com/in/daniel-schmachtenberger" },
    contact2: { name: "Heather Sandison", title: "Chief Science Officer", phone: "(760) 814-4101", email: "h.sandison@neurohacker.com", address: "5765 Fleet St, Carlsbad, CA 92008", linkedin: "linkedin.com/in/heather-sandison-nd" },
    intensity: 80, trend: "stable", sparkline: [55, 58, 62, 65, 68, 72, 76, 80],
    activitySummary: "Researching plasmalogen science for potential product line expansion.",
  },
  {
    org: "A4M (American Academy of Anti-Aging Medicine)", city: "Boca Raton", state: "FL", type: "Medical Association",
    beds: 0, tags: ["Anti-Aging", "Longevity", "Medical Education"],
    contact: { name: "Dr. Robert Goldman", title: "Co-Founder & Chairman", phone: "(561) 997-0112", email: "r.goldman@a4m.com", address: "1801 N Military Trail, Boca Raton, FL 33431", linkedin: "linkedin.com/in/robert-goldman-a4m" },
    contact2: { name: "Lisa Engles", title: "Director of Practitioner Education", phone: "(561) 997-0113", email: "l.engles@a4m.com", address: "1801 N Military Trail, Boca Raton, FL 33431", linkedin: "linkedin.com/in/lisa-engles-a4m" },
    intensity: 78, trend: "up", sparkline: [30, 38, 46, 54, 62, 68, 74, 78],
    activitySummary: "Evaluating advanced biomarker testing for A4M conference education tracks.",
  },
];

// ── SITE VISITORS ─────────────────────────────────────────────────────────────
const SITE_VISITORS = [
  {
    name: "Dr. Cassandra Whitmore", org: "Whitmore Integrative Health", title: "Founder & Functional Medicine MD",
    city: "Austin", state: "TX", lastSeen: "7m ago", visits: 9,
    pages: ["ProdromeScan", "Practitioner Program", "PlasmalogenN3", "Pricing"],
    timeOnSite: "18m 22s", tier: "TIER 0 — READY TO REGISTER",
    tierColor: C.green, income: "$380K",
    phone: "(512) 441-8800", email: "c.whitmore@whitmoreihealth.com",
    address: "3801 S Lamar Blvd, Austin, TX 78704",
    linkedin: "linkedin.com/in/cassandra-whitmore-md",
    outreach: "Dr. Whitmore — your patients asking about brain health and cognitive decline deserve answers that standard lipid panels can't give them. ProdromeScan measures the cellular membrane lipids that decline before symptoms appear. Practitioners who add it typically see patients stay longer and refer more. Worth 15 minutes to see what it looks like for your practice?",
  },
  {
    name: "Dr. Marcus Okafor", org: "Okafor Neurology & Longevity", title: "Neurologist & Longevity Specialist",
    city: "Atlanta", state: "GA", lastSeen: "24m ago", visits: 5,
    pages: ["Science Blog", "ProdromeGlia", "Alzheimer's Research", "Practitioner Registration"],
    competitorAlert: true,
    competitorNote: "Googled 'plasmalogen supplements comparison' · Viewed Cytoplan practitioner page · Checked Seeking Health phospholipid products",
    journeySteps: [
      { time: "3h 12m ago", page: "Google: 'plasmalogen supplements for neurologists 2026'", type: "search" },
      { time: "2h 55m ago", page: "Cytoplan — Practitioner Phospholipid Products", type: "competitor" },
      { time: "2h 20m ago", page: "Seeking Health — Phosphatidylserine Complex", type: "competitor" },
      { time: "1h 44m ago", page: "prodrome.com — Science Blog (Alzheimer's research)", type: "site" },
      { time: "1h 18m ago", page: "prodrome.com — ProdromeGlia™ product page", type: "site" },
      { time: "24m ago",    page: "prodrome.com — Practitioner Registration", type: "site" },
    ],
    timeOnSite: "11m 48s", tier: "TIER 0 — COMPETITOR RESEARCH",
    tierColor: C.gold, income: "$420K",
    phone: "(404) 881-9200", email: "m.okafor@okaforneuro.com",
    address: "3280 Howell Mill Rd NW, Atlanta, GA 30327",
    linkedin: "linkedin.com/in/marcus-okafor-md",
    outreach: "Dr. Okafor — the phosphatidylserine and omega-3 products you've been reviewing are good. But they don't measure or address plasmalogen deficiency — which is the specific lipid decline linked to Alzheimer's and Parkinson's in 30+ years of peer-reviewed research. ProdromeScan gives you the data. ProdromeNeuro™ and ProdromeGlia™ address the gap. No other company has both. Worth 15 minutes?",
  },
  {
    name: "Dr. Priya Nair", org: "Nair Functional Wellness", title: "Integrative MD & Health Coach",
    city: "Chicago", state: "IL", lastSeen: "52m ago", visits: 4,
    pages: ["Practitioner Program", "Grand Rounds", "ProdromeScan", "Blog: Brain Health"],
    timeOnSite: "9m 14s", tier: "TIER 1 — EVALUATING PROGRAM",
    tierColor: C.teal, income: "$290K",
    phone: "(312) 440-9100", email: "p.nair@nairwellness.com",
    address: "875 N Michigan Ave, Chicago, IL 60611",
    linkedin: "linkedin.com/in/priya-nair-md",
    outreach: "Dr. Nair — the Grand Rounds sessions with Dr. Goodenowe are free for registered practitioners, and the ProdromeScan wholesale pricing alone covers the cost of registration many times over. The practitioners getting the most from the program are integrative MDs exactly like you — patients who've tried everything and finally get answers at the cellular level. Happy to walk you through the program details.",
  },
  {
    name: "Dr. James Kowalczyk", org: "Kowalczyk Chiropractic & Functional Medicine", title: "DC & Functional Medicine Practitioner",
    city: "Denver", state: "CO", lastSeen: "1h 38m ago", visits: 7,
    pages: ["Practitioner Registration", "Wholesale Pricing", "ProdromeGlia", "PlasmalogenN3"],
    competitorAlert: true,
    competitorNote: "Visited Apex Energetics practitioner portal · Googled 'functional medicine supplement wholesale programs comparison'",
    journeySteps: [
      { time: "5h 20m ago", page: "Google: 'best wholesale supplement programs for chiropractors 2026'", type: "search" },
      { time: "4h 55m ago", page: "Apex Energetics — Practitioner Wholesale Portal", type: "competitor" },
      { time: "3h 40m ago", page: "prodrome.com — Practitioner Program", type: "site" },
      { time: "2h 58m ago", page: "prodrome.com — Wholesale Pricing", type: "site" },
      { time: "2h 15m ago", page: "prodrome.com — ProdromeGlia™", type: "site" },
      { time: "1h 38m ago", page: "prodrome.com — PlasmalogenN3™", type: "site" },
    ],
    timeOnSite: "16m 05s", tier: "TIER 0 — LAST-MINUTE COMPARISON",
    tierColor: C.gold, income: "$195K",
    phone: "(303) 831-7700", email: "j.kowalczyk@kowalczykfm.com",
    address: "1700 Lincoln St, Denver, CO 80203",
    linkedin: "linkedin.com/in/james-kowalczyk-dc",
    outreach: "Dr. Kowalczyk — Apex has a solid line, but they don't have 30 years of published plasmalogen research behind their products. Prodrome's wholesale program gives you the science to explain why it works — and patients who understand the mechanism are the ones who stay on protocol and refer their family. The ProdromeScan test alone is a practice differentiator no other DC in Denver has. Happy to compare programs side by side.",
  },
  {
    name: "Dr. Fatima Al-Hassan", org: "Al-Hassan Integrative Pediatrics", title: "Pediatric MD & Autism Specialist",
    city: "Houston", state: "TX", lastSeen: "2h 44m ago", visits: 3,
    pages: ["Blog: Child Health", "Autism Program", "ProdromeScan", "Practitioner Program"],
    timeOnSite: "7m 33s", tier: "TIER 1 — AUTISM/PEDIATRIC FOCUS",
    tierColor: C.teal, income: "$310K",
    phone: "(713) 526-8800", email: "f.alhassan@alhassan-peds.com",
    address: "6655 Travis St, Houston, TX 77030",
    linkedin: "linkedin.com/in/fatima-alhassan-md",
    outreach: "Dr. Al-Hassan — the research on plasmalogens and autism is some of the most compelling in the literature. Plasmalogen deficiency is consistently observed in children with ASD, and Dr. Goodenowe's Autism Health Collaboration has been working on this specifically. The ProdromeScan gives you a baseline for your patients that no standard pediatric panel provides. Worth a conversation?",
  },
];

// ── SEARCH POOL ───────────────────────────────────────────────────────────────
const SEARCH_POOL = [
  ...TARGET_POOL,
  // ── Texas ──
  { org: "Baylor Scott & White Integrative Medicine", city: "Dallas", state: "TX", type: "Functional Medicine Clinic", beds: 0, tags: ["Functional Medicine", "Academic"], contact: { name: "Dr. Wendy Nguyen", title: "Medical Director, Integrative Medicine", phone: "(214) 820-3151", email: "w.nguyen@bswhealth.org", address: "3500 Gaston Ave, Dallas, TX 75246", linkedin: "linkedin.com/in/wendy-nguyen-md" }, contact2: { name: "Robert Castillo", title: "Director of Clinical Programs", phone: "(214) 820-3152", email: "r.castillo@bswhealth.org", address: "3500 Gaston Ave, Dallas, TX 75246", linkedin: "linkedin.com/in/robert-castillo-bsw" }, intensity: 72, trend: "up", sparkline: [30,38,46,54,60,65,69,72], activitySummary: "Reviewing advanced biomarker testing for integrative medicine expansion." },
  { org: "Houston Methodist Wellness Institute", city: "Houston", state: "TX", type: "Hospital", beds: 0, tags: ["Longevity", "Wellness", "Academic"], contact: { name: "Dr. Stephanie Nguyen", title: "Director of Longevity Medicine", phone: "(713) 790-3333", email: "s.nguyen@houstonmethodist.org", address: "6565 Fannin St, Houston, TX 77030", linkedin: "linkedin.com/in/stephanie-nguyen-hm" }, contact2: { name: "Carlos Reyes", title: "VP Clinical Innovation", phone: "(713) 790-3334", email: "c.reyes@houstonmethodist.org", address: "6565 Fannin St, Houston, TX 77030", linkedin: "linkedin.com/in/carlos-reyes-hm" }, intensity: 68, trend: "stable", sparkline: [28,34,40,47,53,58,63,68], activitySummary: "Evaluating cellular health testing for longevity program." },
  // ── California ──
  { org: "Scripps Center for Integrative Medicine", city: "La Jolla", state: "CA", type: "Academic Medical Center", beds: 0, tags: ["Integrative Medicine", "Academic", "Longevity"], contact: { name: "Dr. Mimi Guarneri", title: "Medical Director", phone: "(858) 554-3300", email: "m.guarneri@scrippshealth.org", address: "10820 N Torrey Pines Rd, La Jolla, CA 92037", linkedin: "linkedin.com/in/mimi-guarneri-md" }, contact2: { name: "Patricia Holt", title: "Director of Research Programs", phone: "(858) 554-3301", email: "p.holt@scrippshealth.org", address: "10820 N Torrey Pines Rd, La Jolla, CA 92037", linkedin: "linkedin.com/in/patricia-holt-scripps" }, intensity: 75, trend: "up", sparkline: [32,40,48,56,62,67,71,75], activitySummary: "Reviewing lipid biomarker testing for integrative cardiology programs." },
  { org: "UCLA Center for East-West Medicine", city: "Los Angeles", state: "CA", type: "Academic Medical Center", beds: 0, tags: ["Integrative Medicine", "Academic", "Brain Health"], contact: { name: "Dr. Ka-Kit Hui", title: "Founder & Director", phone: "(310) 206-3398", email: "k.hui@mednet.ucla.edu", address: "1033 Gayley Ave, Los Angeles, CA 90024", linkedin: "linkedin.com/in/ka-kit-hui-md" }, contact2: { name: "Jennifer Park", title: "Clinical Programs Manager", phone: "(310) 206-3399", email: "j.park@mednet.ucla.edu", address: "1033 Gayley Ave, Los Angeles, CA 90024", linkedin: "linkedin.com/in/jennifer-park-ucla" }, intensity: 70, trend: "stable", sparkline: [30,36,43,50,56,61,66,70], activitySummary: "Exploring advanced cellular health testing for integrative oncology." },
  // ── New York ──
  { org: "Weill Cornell Integrative Health", city: "New York", state: "NY", type: "Academic Medical Center", beds: 0, tags: ["Academic", "Integrative Medicine", "Neurology"], contact: { name: "Dr. Dossett Michelle", title: "Director, Integrative Health", phone: "(646) 962-2000", email: "m.dossett@med.cornell.edu", address: "525 E 68th St, New York, NY 10065", linkedin: "linkedin.com/in/michelle-dossett-md" }, contact2: { name: "Andrew Kim", title: "VP Research Partnerships", phone: "(646) 962-2001", email: "a.kim@med.cornell.edu", address: "525 E 68th St, New York, NY 10065", linkedin: "linkedin.com/in/andrew-kim-weill" }, intensity: 73, trend: "up", sparkline: [28,36,44,52,58,63,68,73], activitySummary: "Evaluating plasmalogen testing for neurodegenerative disease prevention protocols." },
  // ── Florida ──
  { org: "Mayo Clinic Florida — Integrative Medicine", city: "Jacksonville", state: "FL", type: "Academic Medical Center", beds: 0, tags: ["Academic", "Integrative Medicine", "Longevity"], contact: { name: "Dr. Brent Bauer", title: "Director, Complementary & Integrative Medicine", phone: "(904) 953-2000", email: "b.bauer@mayo.edu", address: "4500 San Pablo Rd S, Jacksonville, FL 32224", linkedin: "linkedin.com/in/brent-bauer-md" }, contact2: { name: "Linda Torres", title: "Clinical Research Coordinator", phone: "(904) 953-2001", email: "l.torres@mayo.edu", address: "4500 San Pablo Rd S, Jacksonville, FL 32224", linkedin: "linkedin.com/in/linda-torres-mayo" }, intensity: 69, trend: "up", sparkline: [25,32,40,48,54,59,64,69], activitySummary: "Reviewing lipid biomarker testing for longevity and brain health programs." },
  // ── Illinois ──
  { org: "Northwestern Medicine Osher Center", city: "Chicago", state: "IL", type: "Academic Medical Center", beds: 0, tags: ["Academic", "Integrative Medicine", "Brain Health"], contact: { name: "Dr. Melinda Ring", title: "Executive Director", phone: "(312) 695-8628", email: "m.ring@northwestern.edu", address: "150 E Huron St, Chicago, IL 60611", linkedin: "linkedin.com/in/melinda-ring-md" }, contact2: { name: "Sarah Brennan", title: "Director of Clinical Programs", phone: "(312) 695-8629", email: "s.brennan@northwestern.edu", address: "150 E Huron St, Chicago, IL 60611", linkedin: "linkedin.com/in/sarah-brennan-nwu" }, intensity: 71, trend: "stable", sparkline: [30,37,44,51,57,62,67,71], activitySummary: "Evaluating advanced lipid testing for integrative neurology programs." },
  // ── Ohio ──
  { org: "Cleveland Clinic Wellness Institute", city: "Lyndhurst", state: "OH", type: "Hospital", beds: 0, tags: ["Wellness", "Longevity", "Academic"], contact: { name: "Dr. Michael Roizen", title: "Chief Wellness Officer", phone: "(216) 444-3771", email: "m.roizen@ccf.org", address: "1950 Richmond Rd, Lyndhurst, OH 44124", linkedin: "linkedin.com/in/michael-roizen-md" }, contact2: { name: "Tanya Altman", title: "VP Wellness Programs", phone: "(216) 444-3772", email: "t.altman@ccf.org", address: "1950 Richmond Rd, Lyndhurst, OH 44124", linkedin: "linkedin.com/in/tanya-altman-ccf" }, intensity: 74, trend: "up", sparkline: [32,40,48,55,61,66,70,74], activitySummary: "Reviewing cellular health biomarkers for executive wellness programs." },
  // ── Washington ──
  { org: "Bastyr University Clinic", city: "Kenmore", state: "WA", type: "Naturopathic Medicine", beds: 0, tags: ["Naturopathic", "Functional Medicine", "Education"], contact: { name: "Dr. Sheila Dean", title: "Dean of Clinical Education", phone: "(425) 823-4000", email: "s.dean@bastyr.edu", address: "14500 Juanita Dr NE, Kenmore, WA 98028", linkedin: "linkedin.com/in/sheila-dean-bastyr" }, contact2: { name: "Marcus Webb", title: "Director of Clinical Programs", phone: "(425) 823-4001", email: "m.webb@bastyr.edu", address: "14500 Juanita Dr NE, Kenmore, WA 98028", linkedin: "linkedin.com/in/marcus-webb-bastyr" }, intensity: 66, trend: "up", sparkline: [22,30,38,46,52,57,61,66], activitySummary: "Evaluating plasmalogen science for naturopathic curriculum integration." },
  // ── Colorado ──
  { org: "UCHealth Integrative Medicine", city: "Aurora", state: "CO", type: "Academic Medical Center", beds: 0, tags: ["Academic", "Integrative Medicine", "Longevity"], contact: { name: "Dr. Lisa Corbin", title: "Medical Director, Integrative Medicine", phone: "(720) 848-0000", email: "l.corbin@uchealth.org", address: "12605 E 16th Ave, Aurora, CO 80045", linkedin: "linkedin.com/in/lisa-corbin-md" }, contact2: { name: "David Park", title: "VP Clinical Innovation", phone: "(720) 848-0001", email: "d.park@uchealth.org", address: "12605 E 16th Ave, Aurora, CO 80045", linkedin: "linkedin.com/in/david-park-uchealth" }, intensity: 64, trend: "stable", sparkline: [20,28,36,44,50,55,59,64], activitySummary: "Reviewing advanced biomarker testing for longevity medicine programs." },
  // ── Georgia ──
  { org: "Emory Integrative Medicine", city: "Atlanta", state: "GA", type: "Academic Medical Center", beds: 0, tags: ["Academic", "Integrative Medicine", "Brain Health"], contact: { name: "Dr. Jyoti Bhatt", title: "Director, Integrative Medicine", phone: "(404) 778-7777", email: "j.bhatt@emory.edu", address: "1648 Pierce Dr NE, Atlanta, GA 30322", linkedin: "linkedin.com/in/jyoti-bhatt-md" }, contact2: { name: "Kevin Osei", title: "Director of Research Programs", phone: "(404) 778-7778", email: "k.osei@emory.edu", address: "1648 Pierce Dr NE, Atlanta, GA 30322", linkedin: "linkedin.com/in/kevin-osei-emory" }, intensity: 67, trend: "up", sparkline: [24,32,40,47,53,58,62,67], activitySummary: "Evaluating cellular membrane health testing for neurology programs." },
  // ── North Carolina ──
  { org: "Duke Integrative Medicine", city: "Durham", state: "NC", type: "Academic Medical Center", beds: 0, tags: ["Academic", "Integrative Medicine", "Longevity"], contact: { name: "Dr. Adam Perlman", title: "Chief of Integrative Medicine", phone: "(919) 660-6826", email: "a.perlman@duke.edu", address: "3475 Erwin Rd, Durham, NC 27705", linkedin: "linkedin.com/in/adam-perlman-md" }, contact2: { name: "Rachel Kim", title: "VP Research & Education", phone: "(919) 660-6827", email: "r.kim@duke.edu", address: "3475 Erwin Rd, Durham, NC 27705", linkedin: "linkedin.com/in/rachel-kim-duke" }, intensity: 70, trend: "up", sparkline: [28,36,44,51,57,62,66,70], activitySummary: "Reviewing lipid biomarker testing for integrative oncology and longevity programs." },
  // ── Tennessee ──
  { org: "Vanderbilt Osher Center for Integrative Health", city: "Nashville", state: "TN", type: "Academic Medical Center", beds: 0, tags: ["Academic", "Integrative Medicine", "Brain Health"], contact: { name: "Dr. Gurjeet Birdee", title: "Director, Integrative Health", phone: "(615) 322-5000", email: "g.birdee@vumc.org", address: "1211 Medical Center Dr, Nashville, TN 37232", linkedin: "linkedin.com/in/gurjeet-birdee-md" }, contact2: { name: "Allison Watts", title: "Clinical Programs Manager", phone: "(615) 322-5001", email: "a.watts@vumc.org", address: "1211 Medical Center Dr, Nashville, TN 37232", linkedin: "linkedin.com/in/allison-watts-vumc" }, intensity: 65, trend: "stable", sparkline: [22,30,38,45,51,56,60,65], activitySummary: "Evaluating advanced lipid testing for brain health and longevity programs." },
  // ── California (additional 5 entries — total 7 with existing 2) ──
  { org: "UCSF Osher Center for Integrative Health", city: "San Francisco", state: "CA", type: "Academic Medical Center", beds: 0, tags: ["Academic", "Integrative Medicine", "Longevity"], contact: { name: "Dr. Donald Abrams", title: "Chief of Integrative Oncology", phone: "(415) 353-7718", email: "d.abrams@ucsf.edu", address: "1545 Divisadero St, San Francisco, CA 94143", linkedin: "linkedin.com/in/donald-abrams-ucsf" }, contact2: { name: "Shelley Adler", title: "Director, Osher Center", phone: "(415) 353-7719", email: "s.adler@ucsf.edu", address: "1545 Divisadero St, San Francisco, CA 94143", linkedin: "linkedin.com/in/shelley-adler-ucsf" }, intensity: 82, trend: "up", sparkline: [40,48,56,63,69,74,78,82], activitySummary: "Actively evaluating plasmalogen biomarker testing for integrative oncology and brain health programs." },
  { org: "Stanford Lifestyle Medicine", city: "Palo Alto", state: "CA", type: "Academic Medical Center", beds: 0, tags: ["Academic", "Longevity", "Brain Health"], contact: { name: "Dr. Stacy Sims", title: "Director, Lifestyle Medicine", phone: "(650) 723-4000", email: "s.sims@stanford.edu", address: "450 Broadway St, Redwood City, CA 94063", linkedin: "linkedin.com/in/stacy-sims-stanford" }, contact2: { name: "Marcus Chen", title: "VP Clinical Research", phone: "(650) 723-4001", email: "m.chen@stanford.edu", address: "450 Broadway St, Redwood City, CA 94063", linkedin: "linkedin.com/in/marcus-chen-stanford" }, intensity: 79, trend: "up", sparkline: [38,46,54,61,67,72,76,79], activitySummary: "Reviewing lipid biomarker testing for longevity and cognitive health programs." },
  { org: "Pacific Pearl La Jolla", city: "La Jolla", state: "CA", type: "Functional Medicine Clinic", beds: 0, tags: ["Functional Medicine", "Longevity", "Brain Health"], contact: { name: "Dr. Gary Huber", title: "Founder & Medical Director", phone: "(858) 459-6919", email: "g.huber@pacificpearl.com", address: "7825 Fay Ave, La Jolla, CA 92037", linkedin: "linkedin.com/in/gary-huber-md" }, contact2: { name: "Kristin Walsh", title: "Director of Patient Programs", phone: "(858) 459-6920", email: "k.walsh@pacificpearl.com", address: "7825 Fay Ave, La Jolla, CA 92037", linkedin: "linkedin.com/in/kristin-walsh-pp" }, intensity: 76, trend: "up", sparkline: [34,42,50,57,63,68,72,76], activitySummary: "Evaluating ProdromeScan for longevity protocol integration. Viewed practitioner registration page 3x." },
  { org: "California Center for Functional Medicine", city: "Berkeley", state: "CA", type: "Functional Medicine Clinic", beds: 0, tags: ["Functional Medicine", "Brain Health", "Neurology"], contact: { name: "Dr. Rajiv Bhatt", title: "Medical Director", phone: "(510) 849-1700", email: "r.bhatt@ccfmed.com", address: "2999 Regent St, Berkeley, CA 94705", linkedin: "linkedin.com/in/rajiv-bhatt-md" }, contact2: { name: "Priya Nair", title: "Director of Clinical Operations", phone: "(510) 849-1701", email: "p.nair@ccfmed.com", address: "2999 Regent St, Berkeley, CA 94705", linkedin: "linkedin.com/in/priya-nair-ccfm" }, intensity: 74, trend: "stable", sparkline: [32,40,47,54,60,65,70,74], activitySummary: "Comparing plasmalogen supplements to omega-3 protocols for Alzheimer's prevention." },
  { org: "Cedars-Sinai Integrative Medicine", city: "Los Angeles", state: "CA", type: "Hospital", beds: 0, tags: ["Integrative Medicine", "Neurology", "Academic"], contact: { name: "Dr. Tasneem Bhatia", title: "Director, Integrative Medicine", phone: "(310) 423-3277", email: "t.bhatia@cshs.org", address: "8700 Beverly Blvd, Los Angeles, CA 90048", linkedin: "linkedin.com/in/tasneem-bhatia-md" }, contact2: { name: "Robert Lim", title: "VP Clinical Programs", phone: "(310) 423-3278", email: "r.lim@cshs.org", address: "8700 Beverly Blvd, Los Angeles, CA 90048", linkedin: "linkedin.com/in/robert-lim-cedars" }, intensity: 71, trend: "up", sparkline: [28,36,44,51,57,62,67,71], activitySummary: "Reviewing biomarker testing options for neurodegenerative disease prevention." },
  // ── Texas (additional 5 entries — total 7 with existing 2) ──
  { org: "UT Southwestern Integrative Medicine", city: "Dallas", state: "TX", type: "Academic Medical Center", beds: 0, tags: ["Academic", "Neurology", "Brain Health"], contact: { name: "Dr. Kavitha Reddy", title: "Director, Integrative Medicine", phone: "(214) 648-3111", email: "k.reddy@utsouthwestern.edu", address: "5323 Harry Hines Blvd, Dallas, TX 75390", linkedin: "linkedin.com/in/kavitha-reddy-utsw" }, contact2: { name: "James Okafor", title: "VP Research Programs", phone: "(214) 648-3112", email: "j.okafor@utsouthwestern.edu", address: "5323 Harry Hines Blvd, Dallas, TX 75390", linkedin: "linkedin.com/in/james-okafor-utsw" }, intensity: 77, trend: "up", sparkline: [35,43,51,58,64,69,73,77], activitySummary: "Evaluating advanced lipid biomarker testing for neurodegenerative disease research programs." },
  { org: "Texas Center for Lifestyle Medicine", city: "Houston", state: "TX", type: "Functional Medicine Clinic", beds: 0, tags: ["Functional Medicine", "Longevity", "Brain Health"], contact: { name: "Dr. Michelle Hauser", title: "Medical Director", phone: "(713) 526-1000", email: "m.hauser@tclm.com", address: "2727 Kirby Dr, Houston, TX 77098", linkedin: "linkedin.com/in/michelle-hauser-md" }, contact2: { name: "Carlos Vega", title: "Director of Clinical Programs", phone: "(713) 526-1001", email: "c.vega@tclm.com", address: "2727 Kirby Dr, Houston, TX 77098", linkedin: "linkedin.com/in/carlos-vega-tclm" }, intensity: 73, trend: "up", sparkline: [30,38,46,53,59,64,69,73], activitySummary: "Reviewing plasmalogen testing for Alzheimer's prevention protocol." },
  { org: "Austin Functional Medicine", city: "Austin", state: "TX", type: "Functional Medicine Clinic", beds: 0, tags: ["Functional Medicine", "Brain Health", "Longevity"], contact: { name: "Dr. Sarah Ballantyne", title: "Founder & Medical Director", phone: "(512) 476-1000", email: "s.ballantyne@austinfm.com", address: "4201 S Congress Ave, Austin, TX 78745", linkedin: "linkedin.com/in/sarah-ballantyne-md" }, contact2: { name: "Derek Holt", title: "Chief Science Officer", phone: "(512) 476-1001", email: "d.holt@austinfm.com", address: "4201 S Congress Ave, Austin, TX 78745", linkedin: "linkedin.com/in/derek-holt-afm" }, intensity: 70, trend: "stable", sparkline: [28,35,43,50,56,61,66,70], activitySummary: "Comparing ProdromeScan to other lipid panels for brain health protocol." },
  { org: "Amen Clinics — Dallas", city: "Dallas", state: "TX", type: "Neurology / Brain Health Clinic", beds: 0, tags: ["Neurology", "Brain Health", "Functional Medicine"], contact: { name: "Dr. Lisa Nguyen", title: "Medical Director", phone: "(214) 368-6777", email: "l.nguyen@amenclinics.com", address: "4801 Lyndon B Johnson Fwy, Dallas, TX 75244", linkedin: "linkedin.com/in/lisa-nguyen-amen" }, contact2: { name: "Paul Reyes", title: "Director of Clinical Operations", phone: "(214) 368-6778", email: "p.reyes@amenclinics.com", address: "4801 Lyndon B Johnson Fwy, Dallas, TX 75244", linkedin: "linkedin.com/in/paul-reyes-amen" }, intensity: 85, trend: "up", sparkline: [42,50,58,65,71,76,81,85], activitySummary: "High-intent: visited ProdromeScan page, practitioner program, and Dr. Goodenowe research page in same session." },
  { org: "Texas Health Integrative Medicine", city: "Arlington", state: "TX", type: "Hospital", beds: 0, tags: ["Integrative Medicine", "Longevity", "Wellness"], contact: { name: "Dr. Pamela Peeke", title: "Chief Wellness Officer", phone: "(817) 462-7000", email: "p.peeke@texashealth.org", address: "800 W Randol Mill Rd, Arlington, TX 76012", linkedin: "linkedin.com/in/pamela-peeke-md" }, contact2: { name: "Marcus Williams", title: "VP Wellness Programs", phone: "(817) 462-7001", email: "m.williams@texashealth.org", address: "800 W Randol Mill Rd, Arlington, TX 76012", linkedin: "linkedin.com/in/marcus-williams-txh" }, intensity: 66, trend: "stable", sparkline: [24,31,39,46,52,57,62,66], activitySummary: "Evaluating cellular health biomarkers for executive wellness programs." },
  // ── New York (additional 6 entries — total 7 with existing 1) ──
  { org: "NYU Langone Integrative Health", city: "New York", state: "NY", type: "Academic Medical Center", beds: 0, tags: ["Academic", "Integrative Medicine", "Brain Health"], contact: { name: "Dr. Mikhail Kogan", title: "Director, Integrative Medicine", phone: "(212) 263-7300", email: "m.kogan@nyulangone.org", address: "240 E 38th St, New York, NY 10016", linkedin: "linkedin.com/in/mikhail-kogan-md" }, contact2: { name: "Sandra Park", title: "VP Clinical Programs", phone: "(212) 263-7301", email: "s.park@nyulangone.org", address: "240 E 38th St, New York, NY 10016", linkedin: "linkedin.com/in/sandra-park-nyu" }, intensity: 80, trend: "up", sparkline: [38,46,54,61,67,72,76,80], activitySummary: "Reviewing plasmalogen biomarker testing for integrative neurology and brain health programs." },
  { org: "Mount Sinai Integrative Medicine", city: "New York", state: "NY", type: "Academic Medical Center", beds: 0, tags: ["Academic", "Neurology", "Longevity"], contact: { name: "Dr. Woodson Merrell", title: "Director, Integrative Medicine", phone: "(212) 420-4000", email: "w.merrell@mountsinai.org", address: "1468 Madison Ave, New York, NY 10029", linkedin: "linkedin.com/in/woodson-merrell-md" }, contact2: { name: "Alicia Torres", title: "Director of Research", phone: "(212) 420-4001", email: "a.torres@mountsinai.org", address: "1468 Madison Ave, New York, NY 10029", linkedin: "linkedin.com/in/alicia-torres-sinai" }, intensity: 77, trend: "up", sparkline: [35,43,51,58,64,69,73,77], activitySummary: "Evaluating lipid biomarker testing for Alzheimer's prevention and longevity programs." },
  { org: "Columbia University Irving Medical Center — Integrative Medicine", city: "New York", state: "NY", type: "Academic Medical Center", beds: 0, tags: ["Academic", "Integrative Medicine", "Brain Health"], contact: { name: "Dr. Fredi Kronenberg", title: "Director, Integrative Medicine Research", phone: "(212) 305-3850", email: "f.kronenberg@columbia.edu", address: "630 W 168th St, New York, NY 10032", linkedin: "linkedin.com/in/fredi-kronenberg-columbia" }, contact2: { name: "David Chen", title: "VP Clinical Innovation", phone: "(212) 305-3851", email: "d.chen@columbia.edu", address: "630 W 168th St, New York, NY 10032", linkedin: "linkedin.com/in/david-chen-columbia" }, intensity: 74, trend: "stable", sparkline: [32,40,47,54,60,65,70,74], activitySummary: "Comparing plasmalogen science to phosphatidylserine protocols for cognitive health." },
  { org: "The Eleven Eleven Wellness Center", city: "New York", state: "NY", type: "Functional Medicine Clinic", beds: 0, tags: ["Functional Medicine", "Longevity", "Brain Health"], contact: { name: "Dr. Frank Lipman", title: "Founder & Chief Medical Officer", phone: "(212) 255-1800", email: "f.lipman@eleveneleven.com", address: "32 W 22nd St, New York, NY 10010", linkedin: "linkedin.com/in/frank-lipman-md" }, contact2: { name: "Danielle Dooley", title: "Director of Clinical Programs", phone: "(212) 255-1801", email: "d.dooley@eleveneleven.com", address: "32 W 22nd St, New York, NY 10010", linkedin: "linkedin.com/in/danielle-dooley-11" }, intensity: 83, trend: "up", sparkline: [40,48,56,63,69,74,79,83], activitySummary: "High-intent: Dr. Lipman reviewed ProdromeScan pricing and practitioner program 4x this week." },
  { org: "Parsley Health — New York", city: "New York", state: "NY", type: "Functional Medicine Clinic", beds: 0, tags: ["Functional Medicine", "Brain Health", "Longevity"], contact: { name: "Dr. Robin Berzin", title: "Founder & CEO", phone: "(646) 647-2200", email: "r.berzin@parsleyhealth.com", address: "30 E 40th St, New York, NY 10016", linkedin: "linkedin.com/in/robin-berzin-md" }, contact2: { name: "Tara Nolan", title: "Chief Clinical Officer", phone: "(646) 647-2201", email: "t.nolan@parsleyhealth.com", address: "30 E 40th St, New York, NY 10016", linkedin: "linkedin.com/in/tara-nolan-parsley" }, intensity: 78, trend: "up", sparkline: [36,44,52,59,65,70,74,78], activitySummary: "Evaluating plasmalogen testing for brain health protocol expansion to 100K+ members." },
  { org: "Amen Clinics — New York", city: "New York", state: "NY", type: "Neurology / Brain Health Clinic", beds: 0, tags: ["Neurology", "Brain Health", "Functional Medicine"], contact: { name: "Dr. Kristen Willeumier", title: "Director of Neuroscience", phone: "(212) 568-8080", email: "k.willeumier@amenclinics.com", address: "16 E 40th St, New York, NY 10016", linkedin: "linkedin.com/in/kristen-willeumier-md" }, contact2: { name: "Brian Walsh", title: "VP Clinical Operations", phone: "(212) 568-8081", email: "b.walsh@amenclinics.com", address: "16 E 40th St, New York, NY 10016", linkedin: "linkedin.com/in/brian-walsh-amen" }, intensity: 86, trend: "up", sparkline: [43,51,59,66,72,77,82,86], activitySummary: "Actively comparing ProdromeScan to other brain biomarker tests. Googled 'plasmalogen test vs phosphatidylserine' same session." },
  // ── Illinois (additional 6 entries — total 7 with existing 1) ──
  { org: "Rush University Integrative Medicine", city: "Chicago", state: "IL", type: "Academic Medical Center", beds: 0, tags: ["Academic", "Integrative Medicine", "Neurology"], contact: { name: "Dr. Judith Moskowitz", title: "Director, Integrative Medicine Research", phone: "(312) 942-5000", email: "j.moskowitz@rush.edu", address: "1653 W Congress Pkwy, Chicago, IL 60612", linkedin: "linkedin.com/in/judith-moskowitz-rush" }, contact2: { name: "Kevin Park", title: "VP Clinical Programs", phone: "(312) 942-5001", email: "k.park@rush.edu", address: "1653 W Congress Pkwy, Chicago, IL 60612", linkedin: "linkedin.com/in/kevin-park-rush" }, intensity: 75, trend: "up", sparkline: [33,41,49,56,62,67,71,75], activitySummary: "Reviewing lipid biomarker testing for neurodegenerative disease prevention programs." },
  { org: "University of Chicago Medicine — Integrative Medicine", city: "Chicago", state: "IL", type: "Academic Medical Center", beds: 0, tags: ["Academic", "Integrative Medicine", "Brain Health"], contact: { name: "Dr. David Meltzer", title: "Chief, Section of Hospital Medicine", phone: "(773) 702-1000", email: "d.meltzer@uchicago.edu", address: "5841 S Maryland Ave, Chicago, IL 60637", linkedin: "linkedin.com/in/david-meltzer-uchicago" }, contact2: { name: "Anita Shah", title: "Director of Integrative Programs", phone: "(773) 702-1001", email: "a.shah@uchicago.edu", address: "5841 S Maryland Ave, Chicago, IL 60637", linkedin: "linkedin.com/in/anita-shah-uchicago" }, intensity: 72, trend: "stable", sparkline: [30,38,45,52,58,63,68,72], activitySummary: "Evaluating advanced biomarker testing for brain health and longevity research." },
  { org: "Midwest Center for Functional Medicine", city: "Naperville", state: "IL", type: "Functional Medicine Clinic", beds: 0, tags: ["Functional Medicine", "Brain Health", "Longevity"], contact: { name: "Dr. Patricia Fitzgerald", title: "Founder & Medical Director", phone: "(630) 357-6000", email: "p.fitzgerald@midwestfm.com", address: "1535 E Ogden Ave, Naperville, IL 60540", linkedin: "linkedin.com/in/patricia-fitzgerald-md" }, contact2: { name: "Jason Kowalski", title: "Director of Clinical Operations", phone: "(630) 357-6001", email: "j.kowalski@midwestfm.com", address: "1535 E Ogden Ave, Naperville, IL 60540", linkedin: "linkedin.com/in/jason-kowalski-mwfm" }, intensity: 78, trend: "up", sparkline: [36,44,52,59,65,70,74,78], activitySummary: "High-intent: viewed ProdromeScan pricing and practitioner certification program. Currently comparing to Cyrex Labs." },
  { org: "Amen Clinics — Chicago", city: "Chicago", state: "IL", type: "Neurology / Brain Health Clinic", beds: 0, tags: ["Neurology", "Brain Health", "Functional Medicine"], contact: { name: "Dr. Stephanie Sarkis", title: "Medical Director", phone: "(312) 265-0400", email: "s.sarkis@amenclinics.com", address: "120 S Riverside Plaza, Chicago, IL 60606", linkedin: "linkedin.com/in/stephanie-sarkis-md" }, contact2: { name: "Thomas Bradley", title: "Director of Clinical Programs", phone: "(312) 265-0401", email: "t.bradley@amenclinics.com", address: "120 S Riverside Plaza, Chicago, IL 60606", linkedin: "linkedin.com/in/thomas-bradley-amen" }, intensity: 84, trend: "up", sparkline: [41,49,57,64,70,75,80,84], activitySummary: "Actively evaluating plasmalogen testing for SPECT brain imaging protocol integration." },
  { org: "Illinois Neurological Institute", city: "Peoria", state: "IL", type: "Neurology / Brain Health Clinic", beds: 0, tags: ["Neurology", "Brain Health", "Academic"], contact: { name: "Dr. Michael Rezak", title: "Director, Movement Disorders", phone: "(309) 655-2730", email: "m.rezak@osfhealthcare.org", address: "530 NE Glen Oak Ave, Peoria, IL 61637", linkedin: "linkedin.com/in/michael-rezak-md" }, contact2: { name: "Linda Kowalczyk", title: "VP Neuroscience Programs", phone: "(309) 655-2731", email: "l.kowalczyk@osfhealthcare.org", address: "530 NE Glen Oak Ave, Peoria, IL 61637", linkedin: "linkedin.com/in/linda-kowalczyk-ini" }, intensity: 69, trend: "up", sparkline: [27,35,43,50,56,61,65,69], activitySummary: "Evaluating plasmalogen testing for Parkinson's and movement disorder protocols." },
  { org: "Chicago Integrative Wellness", city: "Chicago", state: "IL", type: "Functional Medicine Clinic", beds: 0, tags: ["Functional Medicine", "Longevity", "Brain Health"], contact: { name: "Dr. Bindiya Gandhi", title: "Founder & Medical Director", phone: "(312) 600-5555", email: "b.gandhi@chicagointegrativewellness.com", address: "875 N Michigan Ave, Chicago, IL 60611", linkedin: "linkedin.com/in/bindiya-gandhi-md" }, contact2: { name: "Priya Kapoor", title: "Director of Patient Programs", phone: "(312) 600-5556", email: "p.kapoor@chicagointegrativewellness.com", address: "875 N Michigan Ave, Chicago, IL 60611", linkedin: "linkedin.com/in/priya-kapoor-ciw" }, intensity: 71, trend: "stable", sparkline: [29,37,44,51,57,62,67,71], activitySummary: "Comparing plasmalogen supplements to phosphatidylserine for brain health protocols." },
  // ── Pennsylvania ──
  { org: "Jefferson Integrative Medicine", city: "Philadelphia", state: "PA", type: "Academic Medical Center", beds: 0, tags: ["Academic", "Integrative Medicine", "Brain Health"], contact: { name: "Dr. Daniel Monti", title: "Director, Integrative Medicine", phone: "(215) 955-5000", email: "d.monti@jefferson.edu", address: "925 Chestnut St, Philadelphia, PA 19107", linkedin: "linkedin.com/in/daniel-monti-md" }, contact2: { name: "Rachel Goldstein", title: "VP Clinical Programs", phone: "(215) 955-5001", email: "r.goldstein@jefferson.edu", address: "925 Chestnut St, Philadelphia, PA 19107", linkedin: "linkedin.com/in/rachel-goldstein-jeff" }, intensity: 68, trend: "up", sparkline: [26,34,42,49,55,60,64,68], activitySummary: "Reviewing lipid biomarker testing for integrative oncology and brain health programs." },
  { org: "Penn Integrative Medicine", city: "Philadelphia", state: "PA", type: "Academic Medical Center", beds: 0, tags: ["Academic", "Integrative Medicine", "Neurology"], contact: { name: "Dr. Andrew Newberg", title: "Director, Research, Marcus Institute", phone: "(215) 503-3422", email: "a.newberg@jefferson.edu", address: "3300 Henry Ave, Philadelphia, PA 19129", linkedin: "linkedin.com/in/andrew-newberg-md" }, contact2: { name: "Sarah Kim", title: "Director of Clinical Research", phone: "(215) 503-3423", email: "s.kim@jefferson.edu", address: "3300 Henry Ave, Philadelphia, PA 19129", linkedin: "linkedin.com/in/sarah-kim-penn" }, intensity: 65, trend: "stable", sparkline: [23,31,39,46,52,57,61,65], activitySummary: "Evaluating plasmalogen science for neuroscience and consciousness research programs." },
  { org: "Pittsburgh Integrative Medicine", city: "Pittsburgh", state: "PA", type: "Functional Medicine Clinic", beds: 0, tags: ["Functional Medicine", "Brain Health", "Longevity"], contact: { name: "Dr. Mark Hyman", title: "Medical Director", phone: "(412) 621-0444", email: "m.hyman@pittsburghim.com", address: "5830 Ellsworth Ave, Pittsburgh, PA 15232", linkedin: "linkedin.com/in/mark-hyman-pim" }, contact2: { name: "Christine Walsh", title: "Director of Clinical Operations", phone: "(412) 621-0445", email: "c.walsh@pittsburghim.com", address: "5830 Ellsworth Ave, Pittsburgh, PA 15232", linkedin: "linkedin.com/in/christine-walsh-pim" }, intensity: 63, trend: "up", sparkline: [21,29,37,44,50,55,59,63], activitySummary: "Comparing ProdromeScan to standard lipid panels for brain health protocol." },
  // ── Michigan ──
  { org: "University of Michigan Integrative Medicine", city: "Ann Arbor", state: "MI", type: "Academic Medical Center", beds: 0, tags: ["Academic", "Integrative Medicine", "Brain Health"], contact: { name: "Dr. Sara Warber", title: "Co-Director, Integrative Medicine", phone: "(734) 998-7120", email: "s.warber@umich.edu", address: "24 Frank Lloyd Wright Dr, Ann Arbor, MI 48105", linkedin: "linkedin.com/in/sara-warber-umich" }, contact2: { name: "Thomas Lee", title: "Director of Research Programs", phone: "(734) 998-7121", email: "t.lee@umich.edu", address: "24 Frank Lloyd Wright Dr, Ann Arbor, MI 48105", linkedin: "linkedin.com/in/thomas-lee-umich" }, intensity: 67, trend: "up", sparkline: [25,33,41,48,54,59,63,67], activitySummary: "Evaluating advanced lipid testing for integrative neurology and brain health research." },
  { org: "Henry Ford Integrative Medicine", city: "Detroit", state: "MI", type: "Hospital", beds: 0, tags: ["Integrative Medicine", "Wellness", "Brain Health"], contact: { name: "Dr. Mona Morstein", title: "Director, Integrative Medicine", phone: "(313) 916-2600", email: "m.morstein@hfhs.org", address: "2799 W Grand Blvd, Detroit, MI 48202", linkedin: "linkedin.com/in/mona-morstein-md" }, contact2: { name: "James Porter", title: "VP Wellness Programs", phone: "(313) 916-2601", email: "j.porter@hfhs.org", address: "2799 W Grand Blvd, Detroit, MI 48202", linkedin: "linkedin.com/in/james-porter-hfhs" }, intensity: 64, trend: "stable", sparkline: [22,30,38,45,51,56,60,64], activitySummary: "Reviewing cellular health biomarkers for population health programs." },
  // ── Virginia ──
  { org: "UVA Center for Integrative Medicine", city: "Charlottesville", state: "VA", type: "Academic Medical Center", beds: 0, tags: ["Academic", "Integrative Medicine", "Brain Health"], contact: { name: "Dr. Judy Fulop", title: "Director, Integrative Medicine", phone: "(434) 243-6000", email: "j.fulop@virginia.edu", address: "500 Ray C Hunt Dr, Charlottesville, VA 22903", linkedin: "linkedin.com/in/judy-fulop-uva" }, contact2: { name: "Michael Chang", title: "VP Clinical Programs", phone: "(434) 243-6001", email: "m.chang@virginia.edu", address: "500 Ray C Hunt Dr, Charlottesville, VA 22903", linkedin: "linkedin.com/in/michael-chang-uva" }, intensity: 66, trend: "up", sparkline: [24,32,40,47,53,58,62,66], activitySummary: "Evaluating plasmalogen testing for brain health and longevity programs." },
  { org: "Inova Integrative Medicine", city: "Falls Church", state: "VA", type: "Hospital", beds: 0, tags: ["Integrative Medicine", "Longevity", "Wellness"], contact: { name: "Dr. Victoria Maizes", title: "Medical Director", phone: "(703) 776-3500", email: "v.maizes@inova.org", address: "3300 Gallows Rd, Falls Church, VA 22042", linkedin: "linkedin.com/in/victoria-maizes-md" }, contact2: { name: "Karen White", title: "Director of Clinical Operations", phone: "(703) 776-3501", email: "k.white@inova.org", address: "3300 Gallows Rd, Falls Church, VA 22042", linkedin: "linkedin.com/in/karen-white-inova" }, intensity: 63, trend: "stable", sparkline: [21,29,37,44,50,55,59,63], activitySummary: "Reviewing biomarker testing options for executive wellness programs." },
  // ── Arizona ──
  { org: "Andrew Weil Center for Integrative Medicine", city: "Tucson", state: "AZ", type: "Academic Medical Center", beds: 0, tags: ["Academic", "Integrative Medicine", "Longevity"], contact: { name: "Dr. Victoria Maizes", title: "Executive Director", phone: "(520) 626-7222", email: "v.maizes@arizona.edu", address: "655 N Alvernon Way, Tucson, AZ 85711", linkedin: "linkedin.com/in/victoria-maizes-arizona" }, contact2: { name: "Tieraona Low Dog", title: "Director of Fellowship Programs", phone: "(520) 626-7223", email: "t.lowdog@arizona.edu", address: "655 N Alvernon Way, Tucson, AZ 85711", linkedin: "linkedin.com/in/tieraona-low-dog-md" }, intensity: 81, trend: "up", sparkline: [39,47,55,62,68,73,77,81], activitySummary: "High-intent: reviewed ProdromeScan and Dr. Goodenowe's research publications. Fellowship program evaluating plasmalogen science." },
  { org: "Mayo Clinic Arizona — Integrative Medicine", city: "Scottsdale", state: "AZ", type: "Academic Medical Center", beds: 0, tags: ["Academic", "Integrative Medicine", "Brain Health"], contact: { name: "Dr. Denise Smith", title: "Director, Integrative Medicine", phone: "(480) 301-8000", email: "d.smith@mayo.edu", address: "13400 E Shea Blvd, Scottsdale, AZ 85259", linkedin: "linkedin.com/in/denise-smith-mayo-az" }, contact2: { name: "Robert Torres", title: "VP Clinical Programs", phone: "(480) 301-8001", email: "r.torres@mayo.edu", address: "13400 E Shea Blvd, Scottsdale, AZ 85259", linkedin: "linkedin.com/in/robert-torres-mayo-az" }, intensity: 75, trend: "up", sparkline: [33,41,49,56,62,67,71,75], activitySummary: "Evaluating lipid biomarker testing for brain health and longevity programs." },
  // ── Minnesota ──
  { org: "Mayo Clinic — Integrative Medicine & Health", city: "Rochester", state: "MN", type: "Academic Medical Center", beds: 0, tags: ["Academic", "Integrative Medicine", "Longevity"], contact: { name: "Dr. Brent Bauer", title: "Director, Complementary & Integrative Medicine", phone: "(507) 284-2511", email: "b.bauer@mayo.edu", address: "200 First St SW, Rochester, MN 55905", linkedin: "linkedin.com/in/brent-bauer-mayo-mn" }, contact2: { name: "Lori Peper", title: "Director of Research Programs", phone: "(507) 284-2512", email: "l.peper@mayo.edu", address: "200 First St SW, Rochester, MN 55905", linkedin: "linkedin.com/in/lori-peper-mayo" }, intensity: 83, trend: "up", sparkline: [41,49,57,64,70,75,79,83], activitySummary: "Actively reviewing plasmalogen biomarker testing for brain health and longevity programs." },
  { org: "University of Minnesota Integrative Health", city: "Minneapolis", state: "MN", type: "Academic Medical Center", beds: 0, tags: ["Academic", "Integrative Medicine", "Brain Health"], contact: { name: "Dr. Jeffery Dusek", title: "Director, Integrative Health", phone: "(612) 624-5454", email: "j.dusek@umn.edu", address: "420 Delaware St SE, Minneapolis, MN 55455", linkedin: "linkedin.com/in/jeffery-dusek-umn" }, contact2: { name: "Patricia Lee", title: "VP Clinical Programs", phone: "(612) 624-5455", email: "p.lee@umn.edu", address: "420 Delaware St SE, Minneapolis, MN 55455", linkedin: "linkedin.com/in/patricia-lee-umn" }, intensity: 70, trend: "stable", sparkline: [28,36,44,51,57,62,66,70], activitySummary: "Evaluating advanced lipid testing for integrative medicine research programs." },
  // ── Massachusetts ──
  { org: "Harvard Osher Research Center", city: "Boston", state: "MA", type: "Academic Medical Center", beds: 0, tags: ["Academic", "Integrative Medicine", "Brain Health"], contact: { name: "Dr. Peter Wayne", title: "Director, Osher Research Center", phone: "(617) 432-1818", email: "p.wayne@hms.harvard.edu", address: "401 Park Dr, Boston, MA 02215", linkedin: "linkedin.com/in/peter-wayne-harvard" }, contact2: { name: "Gloria Yeh", title: "Associate Director", phone: "(617) 432-1819", email: "g.yeh@hms.harvard.edu", address: "401 Park Dr, Boston, MA 02215", linkedin: "linkedin.com/in/gloria-yeh-harvard" }, intensity: 85, trend: "up", sparkline: [43,51,59,66,72,77,81,85], activitySummary: "High-intent: reviewing plasmalogen research publications and ProdromeScan for brain health research programs." },
  { org: "Brigham and Women's Osher Clinical Center", city: "Boston", state: "MA", type: "Academic Medical Center", beds: 0, tags: ["Academic", "Integrative Medicine", "Longevity"], contact: { name: "Dr. David Eisenberg", title: "Director, Culinary Nutrition", phone: "(617) 732-9700", email: "d.eisenberg@bwh.harvard.edu", address: "850 Boylston St, Chestnut Hill, MA 02467", linkedin: "linkedin.com/in/david-eisenberg-bwh" }, contact2: { name: "Helene Langevin", title: "Director, NCCIH", phone: "(617) 732-9701", email: "h.langevin@bwh.harvard.edu", address: "850 Boylston St, Chestnut Hill, MA 02467", linkedin: "linkedin.com/in/helene-langevin-bwh" }, intensity: 79, trend: "up", sparkline: [37,45,53,60,66,71,75,79], activitySummary: "Evaluating plasmalogen science for integrative oncology and brain health research." },
  // ── Oregon ──
  { org: "National University of Natural Medicine", city: "Portland", state: "OR", type: "Naturopathic Medicine", beds: 0, tags: ["Naturopathic", "Functional Medicine", "Education"], contact: { name: "Dr. David Schleich", title: "President", phone: "(503) 552-1555", email: "d.schleich@nunm.edu", address: "049 SW Porter St, Portland, OR 97201", linkedin: "linkedin.com/in/david-schleich-nunm" }, contact2: { name: "Melissa Bartlett", title: "Dean of Clinical Education", phone: "(503) 552-1556", email: "m.bartlett@nunm.edu", address: "049 SW Porter St, Portland, OR 97201", linkedin: "linkedin.com/in/melissa-bartlett-nunm" }, intensity: 72, trend: "up", sparkline: [30,38,46,53,59,64,68,72], activitySummary: "Evaluating plasmalogen science for naturopathic curriculum and clinical protocols." },
  { org: "OHSU Integrative Medicine", city: "Portland", state: "OR", type: "Academic Medical Center", beds: 0, tags: ["Academic", "Integrative Medicine", "Brain Health"], contact: { name: "Dr. Helane Wahbeh", title: "Director, Research, IONS", phone: "(503) 494-8311", email: "h.wahbeh@ohsu.edu", address: "3181 SW Sam Jackson Park Rd, Portland, OR 97239", linkedin: "linkedin.com/in/helane-wahbeh-ohsu" }, contact2: { name: "Michael Balick", title: "VP Research Programs", phone: "(503) 494-8312", email: "m.balick@ohsu.edu", address: "3181 SW Sam Jackson Park Rd, Portland, OR 97239", linkedin: "linkedin.com/in/michael-balick-ohsu" }, intensity: 68, trend: "stable", sparkline: [26,34,42,49,55,60,64,68], activitySummary: "Reviewing lipid biomarker testing for brain health and consciousness research." },
  // ── Maryland ──
  { org: "Johns Hopkins Integrative Medicine", city: "Baltimore", state: "MD", type: "Academic Medical Center", beds: 0, tags: ["Academic", "Integrative Medicine", "Neurology"], contact: { name: "Dr. Anastasia Rowland-Seymour", title: "Director, Integrative Medicine", phone: "(410) 955-5000", email: "a.rowland@jhmi.edu", address: "600 N Wolfe St, Baltimore, MD 21287", linkedin: "linkedin.com/in/anastasia-rowland-jhu" }, contact2: { name: "David Katz", title: "VP Research Programs", phone: "(410) 955-5001", email: "d.katz@jhmi.edu", address: "600 N Wolfe St, Baltimore, MD 21287", linkedin: "linkedin.com/in/david-katz-jhu" }, intensity: 80, trend: "up", sparkline: [38,46,54,61,67,72,76,80], activitySummary: "Reviewing plasmalogen biomarker testing for neurodegenerative disease prevention research." },
  // ── Indiana ──
  { org: "Indiana University Health Integrative Medicine", city: "Indianapolis", state: "IN", type: "Academic Medical Center", beds: 0, tags: ["Academic", "Integrative Medicine", "Brain Health"], contact: { name: "Dr. Sanjay Gupta", title: "Director, Integrative Medicine", phone: "(317) 962-2000", email: "s.gupta@iuhealth.org", address: "1701 N Senate Blvd, Indianapolis, IN 46202", linkedin: "linkedin.com/in/sanjay-gupta-iuh" }, contact2: { name: "Patricia Moore", title: "VP Clinical Programs", phone: "(317) 962-2001", email: "p.moore@iuhealth.org", address: "1701 N Senate Blvd, Indianapolis, IN 46202", linkedin: "linkedin.com/in/patricia-moore-iuh" }, intensity: 65, trend: "stable", sparkline: [23,31,39,46,52,57,61,65], activitySummary: "Evaluating advanced lipid testing for brain health and longevity programs." },
  // ── Wisconsin ──
  { org: "UW Health Integrative Medicine", city: "Madison", state: "WI", type: "Academic Medical Center", beds: 0, tags: ["Academic", "Integrative Medicine", "Brain Health"], contact: { name: "Dr. David Rakel", title: "Chair, Department of Family Medicine", phone: "(608) 263-6400", email: "d.rakel@uwhealth.org", address: "600 Highland Ave, Madison, WI 53792", linkedin: "linkedin.com/in/david-rakel-uw" }, contact2: { name: "Shilagh Mirgain", title: "Director, Integrative Medicine", phone: "(608) 263-6401", email: "s.mirgain@uwhealth.org", address: "600 Highland Ave, Madison, WI 53792", linkedin: "linkedin.com/in/shilagh-mirgain-uw" }, intensity: 67, trend: "up", sparkline: [25,33,41,48,54,59,63,67], activitySummary: "Reviewing plasmalogen science for integrative medicine and brain health programs." },
  // ── Missouri ──
  { org: "Washington University Integrative Medicine", city: "St. Louis", state: "MO", type: "Academic Medical Center", beds: 0, tags: ["Academic", "Integrative Medicine", "Neurology"], contact: { name: "Dr. Garth Ehrlich", title: "Director, Integrative Medicine", phone: "(314) 747-3000", email: "g.ehrlich@wustl.edu", address: "660 S Euclid Ave, St. Louis, MO 63110", linkedin: "linkedin.com/in/garth-ehrlich-wustl" }, contact2: { name: "Alison Cormack", title: "VP Clinical Programs", phone: "(314) 747-3001", email: "a.cormack@wustl.edu", address: "660 S Euclid Ave, St. Louis, MO 63110", linkedin: "linkedin.com/in/alison-cormack-wustl" }, intensity: 69, trend: "up", sparkline: [27,35,43,50,56,61,65,69], activitySummary: "Evaluating lipid biomarker testing for neurodegenerative disease prevention." },
  // ── Nevada ──
  { org: "Las Vegas Integrative Medicine", city: "Las Vegas", state: "NV", type: "Functional Medicine Clinic", beds: 0, tags: ["Functional Medicine", "Longevity", "Brain Health"], contact: { name: "Dr. Jason Fung", title: "Medical Director", phone: "(702) 385-7246", email: "j.fung@lvim.com", address: "3150 N Tenaya Way, Las Vegas, NV 89128", linkedin: "linkedin.com/in/jason-fung-lvim" }, contact2: { name: "Melissa Torres", title: "Director of Clinical Programs", phone: "(702) 385-7247", email: "m.torres@lvim.com", address: "3150 N Tenaya Way, Las Vegas, NV 89128", linkedin: "linkedin.com/in/melissa-torres-lvim" }, intensity: 64, trend: "stable", sparkline: [22,30,38,45,51,56,60,64], activitySummary: "Comparing plasmalogen supplements to standard longevity protocols." },
  // ── Connecticut ──
  { org: "Yale Integrative Medicine", city: "New Haven", state: "CT", type: "Academic Medical Center", beds: 0, tags: ["Academic", "Integrative Medicine", "Brain Health"], contact: { name: "Dr. Harlan Krumholz", title: "Director, Center for Outcomes Research", phone: "(203) 688-4000", email: "h.krumholz@yale.edu", address: "333 Cedar St, New Haven, CT 06510", linkedin: "linkedin.com/in/harlan-krumholz-yale" }, contact2: { name: "Carolyn Mazure", title: "Director, Women's Health Research", phone: "(203) 688-4001", email: "c.mazure@yale.edu", address: "333 Cedar St, New Haven, CT 06510", linkedin: "linkedin.com/in/carolyn-mazure-yale" }, intensity: 72, trend: "up", sparkline: [30,38,46,53,59,64,68,72], activitySummary: "Reviewing plasmalogen science for brain health and longevity research programs." },
  // ── Utah ──
  { org: "University of Utah Integrative Medicine", city: "Salt Lake City", state: "UT", type: "Academic Medical Center", beds: 0, tags: ["Academic", "Integrative Medicine", "Brain Health"], contact: { name: "Dr. Wendy Leonard", title: "Director, Integrative Medicine", phone: "(801) 581-2121", email: "w.leonard@utah.edu", address: "50 N Medical Dr, Salt Lake City, UT 84132", linkedin: "linkedin.com/in/wendy-leonard-utah" }, contact2: { name: "James Ashworth", title: "VP Clinical Programs", phone: "(801) 581-2122", email: "j.ashworth@utah.edu", address: "50 N Medical Dr, Salt Lake City, UT 84132", linkedin: "linkedin.com/in/james-ashworth-utah" }, intensity: 66, trend: "up", sparkline: [24,32,40,47,53,58,62,66], activitySummary: "Evaluating advanced lipid testing for brain health and longevity programs." },
  // ── Oklahoma ──
  { org: "OU Health Integrative Medicine", city: "Oklahoma City", state: "OK", type: "Academic Medical Center", beds: 0, tags: ["Academic", "Integrative Medicine", "Brain Health"], contact: { name: "Dr. Mark Sherwood", title: "Medical Director", phone: "(405) 271-4700", email: "m.sherwood@ouhealth.com", address: "700 NE 13th St, Oklahoma City, OK 73104", linkedin: "linkedin.com/in/mark-sherwood-ouh" }, contact2: { name: "Kimberly Walters", title: "Director of Clinical Programs", phone: "(405) 271-4701", email: "k.walters@ouhealth.com", address: "700 NE 13th St, Oklahoma City, OK 73104", linkedin: "linkedin.com/in/kimberly-walters-ouh" }, intensity: 63, trend: "stable", sparkline: [21,29,37,44,50,55,59,63], activitySummary: "Reviewing plasmalogen testing for brain health and longevity programs." },
  // ── Kansas ──
  { org: "University of Kansas Health System Integrative Medicine", city: "Kansas City", state: "KS", type: "Academic Medical Center", beds: 0, tags: ["Academic", "Integrative Medicine", "Brain Health"], contact: { name: "Dr. Jeannette Guerrasio", title: "Director, Integrative Medicine", phone: "(913) 588-5000", email: "j.guerrasio@kumc.edu", address: "3901 Rainbow Blvd, Kansas City, KS 66160", linkedin: "linkedin.com/in/jeannette-guerrasio-ku" }, contact2: { name: "Thomas Park", title: "VP Clinical Programs", phone: "(913) 588-5001", email: "t.park@kumc.edu", address: "3901 Rainbow Blvd, Kansas City, KS 66160", linkedin: "linkedin.com/in/thomas-park-ku" }, intensity: 62, trend: "up", sparkline: [20,28,36,43,49,54,58,62], activitySummary: "Evaluating advanced lipid testing for brain health and longevity research." },
  // ── Nebraska ──
  { org: "Nebraska Medicine Integrative Health", city: "Omaha", state: "NE", type: "Academic Medical Center", beds: 0, tags: ["Academic", "Integrative Medicine", "Brain Health"], contact: { name: "Dr. Lynell Klassen", title: "Director, Integrative Medicine", phone: "(402) 559-4000", email: "l.klassen@nebraskamed.com", address: "4350 Dewey Ave, Omaha, NE 68105", linkedin: "linkedin.com/in/lynell-klassen-nm" }, contact2: { name: "Patricia Henning", title: "VP Clinical Programs", phone: "(402) 559-4001", email: "p.henning@nebraskamed.com", address: "4350 Dewey Ave, Omaha, NE 68105", linkedin: "linkedin.com/in/patricia-henning-nm" }, intensity: 61, trend: "stable", sparkline: [19,27,35,42,48,53,57,61], activitySummary: "Reviewing plasmalogen science for brain health and longevity programs." },
  // ── Iowa ──
  { org: "University of Iowa Integrative Medicine", city: "Iowa City", state: "IA", type: "Academic Medical Center", beds: 0, tags: ["Academic", "Integrative Medicine", "Brain Health"], contact: { name: "Dr. Keely Schwartz", title: "Director, Integrative Medicine", phone: "(319) 356-1616", email: "k.schwartz@uiowa.edu", address: "200 Hawkins Dr, Iowa City, IA 52242", linkedin: "linkedin.com/in/keely-schwartz-uiowa" }, contact2: { name: "Michael Haller", title: "VP Clinical Programs", phone: "(319) 356-1617", email: "m.haller@uiowa.edu", address: "200 Hawkins Dr, Iowa City, IA 52242", linkedin: "linkedin.com/in/michael-haller-uiowa" }, intensity: 60, trend: "up", sparkline: [18,26,34,41,47,52,56,60], activitySummary: "Evaluating advanced lipid testing for brain health and longevity programs." },
];

// ── MARKET DATA ───────────────────────────────────────────────────────────────
const marketData = [
  { month: "Jan", practitioners: 142000, revenue: 8.2 },
  { month: "Feb", practitioners: 148000, revenue: 8.9 },
  { month: "Mar", practitioners: 155000, revenue: 9.4 },
  { month: "Apr", practitioners: 162000, revenue: 10.1 },
  { month: "May", practitioners: 170000, revenue: 11.2 },
  { month: "Jun", practitioners: 178000, revenue: 12.0 },
  { month: "Jul", practitioners: 186000, revenue: 13.1 },
];

const MARKET_FACTS = [
  { stat: "$13.8B",  label: "Brain health supplement market (2024)", sub: "Growing to $23.5B by 2030 — 9.3% CAGR" },
  { stat: "200K+",   label: "Functional medicine practitioners in North America", sub: "Each with 200–500 active patients — massive distribution network" },
  { stat: "47M",     label: "Women 40–60 in the U.S. with brain fog & cognitive symptoms", sub: "#1 B2C buyer — work-from-home, health-conscious, already searching" },
  { stat: "68%",     label: "of Prodrome's direct consumer buyers are women", sub: "Higher LTV, longer retention, family multiplier effect" },
  { stat: "80%",     label: "Reduction in dementia risk with high plasmalogen levels", sub: "Published in Journal of Lipid Research — independently replicated" },
  { stat: "3.5%/yr", label: "Rate of plasmalogen decline after age 40", sub: "Every woman over 40 is a candidate — brain fog is the symptom" },
];

// ── TAB: HOW IT WORKS ─────────────────────────────────────────────────────────
function TabHow() {
  const [activeProduct, setActiveProduct] = useState(0);

  const PRODUCTS = [
    {
      label: "ProdromeScan™",
      icon: "🧪",
      color: C.green,
      badge: "BIOMARKER TEST",
      tagline: "prodrome.com — The only blood test that measures plasmalogen levels directly",
      stats: [{ v: "50+", l: "Lipid Biomarkers" }, { v: "1", l: "Blood Draw" }, { v: "48hr", l: "Results" }],
      chips: ["Lipidomics Analysis", "Plasmalogen Levels", "Cellular Membrane Health", "HIPAA-Compliant", "Wholesale for Practitioners"],
    },
    {
      label: "PlasmalogenN3™",
      icon: "🧠",
      color: C.teal,
      badge: "GREY MATTER",
      tagline: "Formerly ProdromeNeuro™ — Synaptic communication & neuronal membrane support",
      stats: [{ v: "Grey", l: "Matter Focus" }, { v: "Omega-3", l: "Plasmalogen" }, { v: "30+yr", l: "Research" }],
      chips: ["Neuronal Membrane Structure", "Synaptic Communication", "Antioxidant Balance", "Patented Precursor", "Practitioner-Only"],
    },
    {
      label: "ProdromeGlia™",
      icon: "⚡",
      color: C.gold,
      badge: "WHITE MATTER",
      tagline: "Myelin structure & nervous system membrane integrity support",
      stats: [{ v: "White", l: "Matter Focus" }, { v: "Myelin", l: "Support" }, { v: "FDA", l: "Investigational" }],
      chips: ["Myelin Sheath Support", "Lipid Metabolism", "Nervous System Membranes", "Patented Formula", "Clinical Research"],
    },
    {
      label: "Practitioner Program",
      icon: "🏥",
      color: C.purple,
      badge: "B2B PLATFORM",
      tagline: "partners.prodrome.com — Free registration, wholesale pricing, Grand Rounds access",
      stats: [{ v: "Free", l: "Essential Tier" }, { v: "20hr+", l: "Training (Certified)" }, { v: "Live", l: "Grand Rounds" }],
      chips: ["Wholesale Pricing", "ProdromeScan Access", "Grand Rounds Live", "Elite Directory Listing", "Advanced Disease Education"],
    },
  ];

  const p = PRODUCTS[activeProduct];

  return (
    <div className="space-y-5">
      {/* Hero image placeholder / brand banner */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl overflow-hidden relative"
        style={{ background: `linear-gradient(135deg, ${C.card} 0%, #0a2218 100%)`, border: `1px solid ${C.green}30`, minHeight: 120 }}>
        <div className="p-6">
          <div className="text-2xl font-black" style={{ color: C.white }}>Prodrome Science</div>
          <div className="text-sm mt-1" style={{ color: C.green }}>Built on Lipid Science · Engineered for the Brain</div>
          <div className="text-xs mt-2 max-w-lg" style={{ color: C.muted }}>
            30+ years of peer-reviewed plasmalogen research · Dr. Dayan Goodenowe, PhD · Named Top 7 Experts to Watch 2026
          </div>
          <div className="flex gap-3 mt-4">
            {["prodrome.com", "drgoodenowe.com", "partners.prodrome.com"].map((url, i) => (
              <span key={i} className="px-2 py-0.5 rounded-full text-xs font-black"
                style={{ background: `${C.green}20`, color: C.green, border: `1px solid ${C.green}30` }}>{url}</span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Product family tabs */}
      <div className="rounded-2xl overflow-hidden" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <div className="p-4 pb-0">
          <SL>THE PRODROME FAMILY — 4 PRODUCTS, ONE PLATFORM</SL>
          <div className="text-sm font-black mb-3" style={{ color: C.white }}>Led by Dr. Dayan Goodenowe, PhD</div>
          {/* Tab strip */}
          <div className="flex gap-2 overflow-x-auto pb-0">
            {PRODUCTS.map((prod, i) => (
              <button key={i} onClick={() => setActiveProduct(i)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-black whitespace-nowrap transition-all shrink-0"
                style={{
                  background: activeProduct === i ? `${prod.color}20` : "transparent",
                  color: activeProduct === i ? prod.color : C.muted,
                  borderBottom: activeProduct === i ? `2px solid ${prod.color}` : "2px solid transparent",
                }}>
                <span>{prod.icon}</span>
                <span>{prod.label}</span>
                <span className="px-1.5 py-0.5 rounded-full text-xs" style={{ background: `${prod.color}25`, color: prod.color, fontSize: 9 }}>{prod.badge}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Active product panel */}
        <AnimatePresence mode="wait">
          <motion.div key={activeProduct} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="p-4 pt-3" style={{ borderTop: `1px solid ${C.border}` }}>
            <div className="text-xs mb-3" style={{ color: C.muted }}>{p.tagline}</div>
            <div className="grid grid-cols-3 gap-3 mb-3">
              {p.stats.map((s, i) => (
                <div key={i} className="rounded-xl p-3 text-center" style={{ background: C.card2, border: `1px solid ${C.border}` }}>
                  <div className="text-xl font-black" style={{ color: p.color }}>{s.v}</div>
                  <div className="text-xs mt-0.5" style={{ color: "#e8f4f0" }}>{s.l}</div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {p.chips.map((chip, i) => (
                <span key={i} className="px-2 py-0.5 rounded-full text-xs font-black"
                  style={{ background: `${p.color}15`, color: "#e8f4f0", border: `1px solid ${p.color}30` }}>{chip}</span>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Animated KPI strip */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { v: 186000, label: "Functional Medicine Practitioners in North America", color: C.green, suffix: "+" },
          { v: 94, label: "Avg Intent Score — Active Practitioners This Week", color: C.gold, suffix: "" },
          { v: 38, label: "Decision-Makers Identified on prodrome.com This Week", color: C.teal, suffix: "" },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="rounded-xl p-3 text-center" style={{ background: C.card, border: `1px solid ${C.border}` }}>
            <AnimatedScore value={s.v} color={s.color} />
            <div className="text-xs mt-1" style={{ color: "#e8f4f0" }}>{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Market chart */}
      <div className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <SL>MARKET GROWTH — BRAIN HEALTH SUPPLEMENT MARKET ($B)</SL>
        <div className="text-sm font-black mb-3" style={{ color: C.white }}>$13.8B → $23.5B by 2030 · 9.3% CAGR</div>
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={marketData}>
            <defs>
              <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={C.green} stopOpacity={0.3} />
                <stop offset="95%" stopColor={C.green} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
            <XAxis dataKey="month" tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 8, color: C.white }} />
            <Area type="monotone" dataKey="revenue" stroke={C.green} fill="url(#greenGrad)" strokeWidth={2} dot={{ fill: C.green, r: 3 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Market facts grid */}
      <div className="grid grid-cols-2 gap-3">
        {MARKET_FACTS.map((f, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="rounded-xl p-4" style={{ background: C.card, border: `1px solid ${C.border}` }}>
            <div className="text-2xl font-black mb-1" style={{ color: i % 3 === 0 ? C.green : i % 3 === 1 ? C.gold : C.teal }}>{f.stat}</div>
            <div className="text-xs font-black mb-0.5" style={{ color: C.white }}>{f.label}</div>
            <div className="text-xs" style={{ color: C.muted }}>{f.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* Competitive landscape */}
      <div className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <SL>COMPETITIVE LANDSCAPE</SL>
        <div className="text-sm font-black mb-3" style={{ color: C.white }}>Why Prodrome Wins</div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                {["", "Prodrome Science", "Omega-3 Brands", "Phosphatidylserine", "Bredesen Protocol", "Neurohacker"].map((h, i) => (
                  <th key={i} className="py-2 px-2 text-left font-black" style={{ color: i === 1 ? C.green : C.muted }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["30+ yrs published research", "✓", "✗", "✗", "Partial", "✗"],
                ["Plasmalogen-specific testing", "✓", "✗", "✗", "✗", "✗"],
                ["FDA investigational pathway", "✓", "✗", "✗", "✗", "✗"],
                ["Practitioner wholesale program", "✓", "✓", "✓", "✗", "✓"],
                ["Live Grand Rounds education", "✓", "✗", "✗", "✓", "✗"],
                ["Alzheimer's/Parkinson's focus", "✓", "✗", "Partial", "✓", "Partial"],
              ].map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? C.card2 : "transparent", borderBottom: `1px solid ${C.border}` }}>
                  {row.map((cell, j) => (
                    <td key={j} className="py-2 px-2 font-black"
                      style={{ color: j === 0 ? C.muted : j === 1 ? (cell === "✓" ? C.green : C.red) : (cell === "✓" ? C.teal : cell === "✗" ? C.muted : C.gold) }}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* B2C Segment Card */}
      <div className="rounded-2xl p-5" style={{ background: `linear-gradient(135deg, #1a0a2e 0%, #0d1a2e 100%)`, border: `1px solid ${C.purple}40` }}>
        <SL color={C.purple}>B2C AUDIENCE — THE HIDDEN GROWTH ENGINE</SL>
        <div className="text-sm font-black mb-3" style={{ color: C.white }}>Women 40–60 · Work-From-Home · Proactively Managing Brain Health</div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            { v: "47M", l: "Women 40–60 in the U.S.", sub: "Primary B2C buyer segment" },
            { v: "68%", l: "of direct buyers are women", sub: "Per Prodrome's own data" },
            { v: "$127", l: "Avg monthly spend", sub: "PlasmalogenN3 + ProdromeGlia" },
            { v: "3.2x", l: "Higher LTV vs male buyers", sub: "More consistent, longer retention" },
          ].map((s, i) => (
            <div key={i} className="rounded-xl p-3" style={{ background: `${C.purple}15`, border: `1px solid ${C.purple}25` }}>
              <div className="text-xl font-black" style={{ color: C.purple }}>{s.v}</div>
              <div className="text-xs font-black mt-0.5" style={{ color: C.white }}>{s.l}</div>
              <div className="text-xs" style={{ color: C.muted }}>{s.sub}</div>
            </div>
          ))}
        </div>
        <div className="text-xs font-black mb-2" style={{ color: C.purple }}>WHO SHE IS</div>
        <div className="space-y-2">
          {[
            { icon: "🏠", title: "Works from home, age 40–60", desc: "Noticing brain fog, word-finding issues, fatigue. Already spending on supplements. Googling 'brain fog menopause' and 'best supplements for memory over 50'." },
            { icon: "📱", title: "Health-conscious early adopter", desc: "Follows functional medicine influencers. Trusts science-backed products. Will pay a premium if the mechanism is explained clearly." },
            { icon: "👨‍👩‍👧", title: "Family health decision-maker", desc: "Buys for herself first, then her husband, then aging parents. One converted B2C customer can become 3–4 orders per household." },
            { icon: "🔍", title: "Active researcher", desc: "Reads the blog, watches the Dr. Goodenowe videos, looks up the clinical studies. High-intent traffic from organic search and YouTube." },
          ].map((s, i) => (
            <div key={i} className="flex gap-3 rounded-xl p-3" style={{ background: `${C.purple}08`, border: `1px solid ${C.purple}15` }}>
              <div className="text-lg shrink-0">{s.icon}</div>
              <div>
                <div className="text-xs font-black mb-0.5" style={{ color: C.purple }}>{s.title}</div>
                <div className="text-xs" style={{ color: C.muted }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-xl p-3" style={{ background: `${C.purple}12`, border: `1px solid ${C.purple}30` }}>
          <div className="text-xs font-black mb-1" style={{ color: C.purple }}>EA ANGLE FOR B2C</div>
          <div className="text-xs" style={{ color: C.muted }}>Exact Audience identifies women 40–60 who are actively searching for brain health supplements, visiting prodrome.com, and reading the Dr. Goodenowe content — but leaving without purchasing. SiteID shows you exactly who they are and where they live. Retargeting + direct mail to this segment converts at 4–6x the rate of cold traffic.</div>
        </div>
      </div>

      {/* EA pitch */}
      <div className="rounded-2xl p-5" style={{ background: `linear-gradient(135deg, ${C.card} 0%, #0a2218 100%)`, border: `1px solid ${C.green}30` }}>
        <SL color={C.green}>WHY EXACT AUDIENCE FOR PRODROME</SL>
        <div className="text-sm font-black mb-3" style={{ color: C.white }}>Two audiences. One platform. Practitioner B2B + Consumer B2C — both solved.</div>
        <div className="space-y-3">
          {[
            { icon: "🔍", title: "200,000 practitioners, 1 platform", desc: "Exact Audience identifies which functional medicine practitioners, integrative MDs, and neurologists are actively researching plasmalogen science right now — before they register with a competitor." },
            { icon: "⚡", title: "SiteID — know who's on prodrome.com today", desc: "See exactly which practitioners visited the registration page, read the science blog, or viewed ProdromeScan pricing — and never followed through. That's your warm list." },
            { icon: "🎯", title: "Intent-first outreach", desc: "Instead of cold-calling 200,000 practitioners, reach the 300 who are actively evaluating plasmalogen testing this week. The difference in conversion is 10x." },
          ].map((s, i) => (
            <div key={i} className="flex gap-3 rounded-xl p-3" style={{ background: `${C.green}08`, border: `1px solid ${C.green}15` }}>
              <div className="text-xl shrink-0">{s.icon}</div>
              <div>
                <div className="text-xs font-black mb-0.5" style={{ color: C.green }}>{s.title}</div>
                <div className="text-xs" style={{ color: C.muted }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Who Else Can We Reach */}
      <div className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <SL color={C.gold}>WHO ELSE CAN EXACT AUDIENCE REACH FOR PRODROME</SL>
        <div className="text-sm font-black mb-1" style={{ color: C.white }}>8 Addressable Audiences Beyond the Obvious</div>
        <div className="text-xs mb-4" style={{ color: C.muted }}>Each segment is actively searchable, identifiable by intent, and reachable with personalized outreach through Exact Audience.</div>
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              icon: "👩‍💼",
              color: C.purple,
              segment: "Women 40–60 · Work-From-Home",
              market: "47M in the U.S.",
              signal: "Googling 'brain fog menopause', 'memory supplements over 50', 'plasmalogen'",
              eaAngle: "SiteID identifies cart abandoners on prodrome.com. Direct mail + retargeting converts at 4–6x cold traffic.",
            },
            {
              icon: "🧐",
              color: C.green,
              segment: "Functional Medicine Practitioners",
              market: "200K+ in North America",
              signal: "Researching advanced lipid testing, visiting partners.prodrome.com, attending IFM conferences",
              eaAngle: "Intent-first B2B outreach to practitioners evaluating plasmalogen protocols this week.",
            },
            {
              icon: "🧓",
              color: C.teal,
              segment: "Alzheimer's & Dementia Caregivers",
              market: "11M+ family caregivers in the U.S.",
              signal: "Searching 'supplements to slow Alzheimer's', 'plasmalogen Alzheimer's research', 'Dr. Goodenowe'",
              eaAngle: "High-urgency buyers. Identify caregivers visiting the Alzheimer's content pages and follow up with direct mail.",
            },
            {
              icon: "⚡",
              color: C.gold,
              segment: "Biohackers & Longevity Enthusiasts",
              market: "$28.6B longevity supplement market (2025)",
              signal: "Following Dave Asprey, Andrew Huberman, Peter Attia. Searching 'best nootropics 2026', 'plasmalogen biohacking'",
              eaAngle: "High-spend early adopters. Identify by content consumption patterns and supplement purchase intent signals.",
            },
            {
              icon: "🏥",
              color: C.green,
              segment: "Neurologists & Neurology Practices",
              market: "16,000+ neurologists in the U.S.",
              signal: "Reviewing lipid biomarker research, attending AAN conferences, evaluating Parkinson's/MS protocols",
              eaAngle: "High-value B2B. One neurology practice ordering ProdromeScan for 50 patients = $1,500+/mo recurring.",
            },
            {
              icon: "👶",
              color: C.purple,
              segment: "Autism Families & Specialists",
              market: "1 in 36 children diagnosed with ASD in the U.S.",
              signal: "Searching 'plasmalogen autism', 'Dr. Goodenowe autism', 'cellular membrane health children'",
              eaAngle: "Dr. Goodenowe's Autism Health Collaboration is a specific program. Identify families and pediatric specialists researching it.",
            },
            {
              icon: "🏢",
              color: C.teal,
              segment: "Corporate Wellness Programs",
              market: "$8.4B corporate wellness market, brain health fastest-growing segment",
              signal: "HR Directors and Benefits Managers researching cognitive performance programs for remote workforces",
              eaAngle: "B2B enterprise angle. One corporate wellness contract = 500–5,000 employees on monthly protocol.",
            },
            {
              icon: "🏃",
              color: C.gold,
              segment: "Anti-Aging & Longevity Clinics",
              market: "$44B global anti-aging market",
              signal: "Clinics adding cellular health testing to longevity panels. Searching 'plasmalogen testing for longevity clinics'",
              eaAngle: "Fastest-growing practitioner segment. Identify longevity clinics that have viewed ProdromeScan pricing but haven't registered.",
            },
          ].map((seg, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="rounded-xl p-4" style={{ background: C.card2, border: `1px solid ${seg.color}25` }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{seg.icon}</span>
                <div>
                  <div className="text-xs font-black" style={{ color: seg.color }}>{seg.segment}</div>
                  <div className="text-xs" style={{ color: C.muted }}>{seg.market}</div>
                </div>
              </div>
              <div className="text-xs mb-2" style={{ color: C.muted }}>
                <span className="font-black" style={{ color: C.white }}>Signal: </span>{seg.signal}
              </div>
              <div className="rounded-lg p-2 text-xs" style={{ background: `${seg.color}10`, border: `1px solid ${seg.color}20`, color: seg.color }}>
                <span className="font-black">EA Angle: </span>
                <span style={{ color: C.white }}>{seg.eaAngle}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Symptom-Aware Targeting */}
      <div className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.teal}30` }}>
        <SL color={C.teal}>SYMPTOM-AWARE TARGETING — THE BIGGEST UNTAPPED AUDIENCE</SL>
        <div className="text-sm font-black mb-1" style={{ color: C.white }}>Problem-Aware. Solution-Unaware. Ready to Buy — They Just Don't Know It Yet.</div>
        <div className="text-xs mb-4" style={{ color: C.muted }}>These people are actively searching their symptoms right now. They have no idea plasmalogen exists. Exact Audience identifies them by search behavior, matches to household data, and delivers their name and address — so Prodrome reaches them before they give up and accept their symptoms as normal.</div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            {
              icon: "🧠",
              color: C.purple,
              category: "Brain Fog & Cognitive Decline",
              keywords: ["why do I feel foggy all the time", "can't think clearly anymore", "brain fog after 50", "memory getting worse in my 40s", "word finding problems", "mental clarity supplements"],
              volume: "2.4M monthly searches",
            },
            {
              icon: "😴",
              color: C.teal,
              category: "Fatigue & Energy Loss",
              keywords: ["chronic fatigue no diagnosis", "tired all the time despite sleeping", "why am I so exhausted", "energy drops after 40", "adrenal fatigue supplements"],
              volume: "3.1M monthly searches",
            },
            {
              icon: "🧓",
              color: C.gold,
              category: "Neurological & Alzheimer's Prevention",
              keywords: ["early Alzheimer's symptoms", "how to prevent dementia naturally", "Parkinson's prevention supplements", "how to slow Alzheimer's progression", "supplements for dementia patients"],
              volume: "1.8M monthly searches",
            },
            {
              icon: "👩",
              color: C.purple,
              category: "Menopause & Hormonal Brain Fog",
              keywords: ["brain fog menopause", "memory loss perimenopause", "cognitive decline menopause", "menopause brain supplements", "hormone brain connection"],
              volume: "890K monthly searches",
            },
            {
              icon: "👶",
              color: C.green,
              category: "Autism & Child Development",
              keywords: ["supplements for autism brain", "cellular membrane autism", "autism natural treatment", "improve focus autism child", "ASD supplements that work"],
              volume: "420K monthly searches",
            },
            {
              icon: "⚡",
              color: C.teal,
              category: "Longevity & Anti-Aging Brain",
              keywords: ["how to keep brain sharp after 60", "anti-aging brain supplements", "cognitive decline prevention", "longevity brain health", "best supplements for aging brain"],
              volume: "1.2M monthly searches",
            },
          ].map((cat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className="rounded-xl p-4" style={{ background: C.card2, border: `1px solid ${cat.color}25` }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{cat.icon}</span>
                <div>
                  <div className="text-xs font-black" style={{ color: cat.color }}>{cat.category}</div>
                  <div className="text-xs font-black" style={{ color: C.muted }}>{cat.volume}</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {cat.keywords.map((kw, j) => (
                  <span key={j} className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${cat.color}12`, border: `1px solid ${cat.color}25`, color: cat.color }}>"{kw}"</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="rounded-xl p-4" style={{ background: `${C.teal}10`, border: `1px solid ${C.teal}30` }}>
          <div className="text-xs font-black mb-2" style={{ color: C.teal }}>HOW EXACT AUDIENCE REACHES THEM</div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { step: "1", title: "Intent Signal Detected", desc: "Someone in Phoenix searches 'brain fog after 50 supplements' — EA captures the intent signal in real time" },
              { step: "2", title: "Identity Matched", desc: "The search is matched to a household record — name, address, age, income, purchase history" },
              { step: "3", title: "Prodrome Reaches Them", desc: "Personalized direct mail, retargeting ad, or email arrives before they find a competitor or give up" },
            ].map((s, i) => (
              <div key={i} className="rounded-lg p-3" style={{ background: C.card }}>
                <div className="text-xl font-black mb-1" style={{ color: C.teal }}>{s.step}</div>
                <div className="text-xs font-black mb-0.5" style={{ color: C.white }}>{s.title}</div>
                <div className="text-xs" style={{ color: C.muted }}>{s.desc}</div>
              </div>
            ))}
          </div>
          <div className="mt-3 text-xs" style={{ color: C.muted }}>
            <span className="font-black" style={{ color: C.white }}>The key insight: </span>
            These people are spending money on supplements right now — just the wrong ones. They are buying generic brain fog pills from Amazon because they do not know plasmalogen exists. Exact Audience puts Prodrome in front of them at the exact moment they are searching for answers.
          </div>
        </div>
      </div>
    </div>
  );
}

// ── TAB: WHO'S ON YOUR SITE ───────────────────────────────────────────────────
function TabSiteID() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <div className="flex items-center justify-between mb-1">
          <SL>PRODROME.COM — LIVE SITE VISITOR INTELLIGENCE</SL>
          <div className="flex items-center gap-1.5 text-xs font-black" style={{ color: C.green }}>
            <div className="w-2 h-2 rounded-full" style={{ background: C.green, animation: "pulse-dot 2s infinite" }} />
            LIVE
          </div>
        </div>
        <div className="text-lg font-black mb-1" style={{ color: C.white }}>Today's Identified Visitors — prodrome.com</div>
        <div className="text-sm" style={{ color: C.muted }}>
          Functional medicine practitioners visiting your site today — identified in real time. No form. No call. You know who they are.
        </div>
        <div className="grid grid-cols-3 gap-3 mt-4">
          {[
            { label: "Practitioners Identified Today", value: 5, color: C.green },
            { label: "Decision-Makers Identified", value: 5, color: C.teal },
            { label: "Avg Time on Site", value: "12m 38s", color: C.gold, raw: true },
          ].map((s, i) => (
            <div key={i} className="rounded-xl p-3 text-center" style={{ background: C.card2, border: `1px solid ${C.border}` }}>
              {s.raw
                ? <div className="text-2xl font-black" style={{ color: s.color }}>{s.value}</div>
                : <AnimatedScore value={s.value as number} color={s.color} />}
              <div className="text-xs mt-1" style={{ color: "#e8f4f0" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {SITE_VISITORS.map((v, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
          className="rounded-2xl overflow-hidden cursor-pointer"
          style={{ background: C.card, border: `1px solid ${C.border}` }}
          onClick={() => setExpanded(expanded === i ? null : i)}>

          <div className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-black text-base" style={{ color: C.white }}>{v.name}</div>
                <div className="text-xs mt-0.5" style={{ color: C.muted }}>{v.org} · {v.city}, {v.state}</div>
                <div className="text-xs mt-0.5" style={{ color: C.muted }}>{v.title}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-2xl font-black" style={{ color: C.green }}>{v.visits}</div>
                <div className="text-xs" style={{ color: C.muted }}>visits</div>
              </div>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <div className="inline-block px-2 py-0.5 rounded-full text-xs font-black"
                style={{ background: `${v.tierColor}20`, color: v.tierColor, border: `1px solid ${v.tierColor}40` }}>
                {v.tier}
              </div>
              {(v as any).competitorAlert && (
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-black animate-pulse"
                  style={{ background: "#ef444420", color: "#ef4444", border: "1px solid #ef444440" }}>
                  <span>⚠</span> COMPETITOR RESEARCH DETECTED
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5 mt-2">
              {v.pages.map((p, j) => (
                <span key={j} className="px-2 py-0.5 rounded-full text-xs"
                  style={{ background: `${C.green}15`, color: C.green, border: `1px solid ${C.green}25` }}>{p}</span>
              ))}
            </div>
            <div className="flex gap-4 mt-2 text-xs" style={{ color: C.muted }}>
              <span>Last seen: <span style={{ color: C.white }}>{v.lastSeen}</span></span>
              <span>Time on site: <span style={{ color: C.white }}>{v.timeOnSite}</span></span>
              <span>Income: <span style={{ color: C.gold }}>{v.income}</span></span>
            </div>
          </div>

          <AnimatePresence>
            {expanded === i && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
                onClick={e => e.stopPropagation()}>
                <div className="px-4 pb-4 space-y-3" style={{ borderTop: `1px solid ${C.border}` }}>
                  <div className="pt-3">
                    <div className="text-xs font-black mb-2" style={{ color: C.green }}>VERIFIED CONTACT RECORD</div>
                    <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
                      {[
                        ["Full Name", v.name],
                        ["Title", v.title],
                        ["Organization", v.org],
                        ["Phone", v.phone],
                        ["Email", v.email],
                        ["Address", v.address],
                        ["LinkedIn", v.linkedin],
                        ["Estimated Income", v.income],
                      ].map(([label, value], j) => (
                        <div key={j} className="flex px-3 py-2 text-xs"
                          style={{ background: j % 2 === 0 ? C.card2 : C.card, borderBottom: `1px solid ${C.border}` }}>
                          <span className="w-36 shrink-0 font-black" style={{ color: C.muted }}>{label}</span>
                          <span style={{ color: C.white }}>{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {(v as any).competitorAlert && (
                    <div className="rounded-xl p-3" style={{ background: "#ef444412", border: "1px solid #ef444430" }}>
                      <div className="text-xs font-black mb-1" style={{ color: "#ef4444" }}>⚠ COMPETITOR RESEARCH IN PROGRESS</div>
                      <div className="text-xs" style={{ color: "#fca5a5" }}>{(v as any).competitorNote}</div>
                    </div>
                  )}

                  {(v as any).journeySteps && (
                    <div>
                      <div className="text-xs font-black mb-2" style={{ color: C.gold }}>ONLINE BUYER JOURNEY</div>
                      <div className="space-y-1">
                        {(v as any).journeySteps.map((step: any, si: number) => (
                          <div key={si} className="flex items-start gap-2 text-xs">
                            <div className="shrink-0 w-20 text-right" style={{ color: C.muted }}>{step.time}</div>
                            <div className="shrink-0 w-2 h-2 rounded-full mt-0.5" style={{
                              background: step.type === "competitor" ? "#ef4444" : step.type === "search" ? C.gold : C.green
                            }} />
                            <div style={{ color: step.type === "competitor" ? "#fca5a5" : step.type === "search" ? C.gold : C.white }}>
                              {step.type === "competitor" && "🔴 "}{step.type === "search" && "🔍 "}{step.type === "site" && "✓ "}{step.page}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <div className="text-xs font-black mb-2" style={{ color: C.teal }}>SUGGESTED OUTREACH</div>
                    <div className="rounded-xl p-3 text-xs leading-relaxed" style={{ background: `${C.teal}10`, border: `1px solid ${C.teal}25`, color: C.white }}>
                      {v.outreach}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-black mb-2" style={{ color: C.green }}>MULTI-CHANNEL OUTREACH</div>
                    {(() => {
                      const t = TARGET_POOL.find(tp => tp.org.includes(v.org.split(" ")[0])) || TARGET_POOL[i % TARGET_POOL.length];
                      return <OutreachPanel t={t} />;
                    })()}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}

// ── TAB: ROI CALCULATOR ───────────────────────────────────────────────────────
function TabROI() {
  const [spend, setSpend] = useState(10000);
  const [avgDeal, setAvgDeal] = useState(3600);

  // Prodrome practitioner LTV: ~$300/mo recurring = $3,600/yr
  // At $10K/mo EA fee, identify ~80 practitioners/mo, 8% demo, 25% close = ~2 new practitioners/mo
  const leads    = Math.round((spend / 8000) * 80);
  const demos    = Math.round(leads * 0.08);
  const closes   = Math.round(demos * 0.25);
  const annualRevenue = closes * avgDeal * 12; // monthly recurring × 12
  const pilotCost = spend * 3;
  const roi = Math.round(((annualRevenue - spend * 12) / (spend * 12)) * 100);
  const payback = (spend / (annualRevenue / 12)).toFixed(1);

  const projData = Array.from({ length: 3 }, (_, i) => ({
    month: `Month ${i + 1}`,
    revenue: Math.round(closes * (i + 1) * avgDeal),
    cost: spend * (i + 1),
  }));

  return (
    <div className="space-y-5">
      <div className="rounded-2xl p-5" style={{ background: C.card, border: `2px solid ${C.green}` }}>
        <SL color={C.green}>90-DAY PILOT — REALISTIC ROI FOR PRODROME SCIENCE</SL>
        <div className="text-lg font-black mb-1" style={{ color: C.white }}>
          ${(spend / 1000).toFixed(0)}K/month · ${(spend * 3 / 1000).toFixed(0)}K total for 90 days
        </div>
        <div className="text-xs mb-4" style={{ color: C.muted }}>
          Practitioner LTV is recurring — one new certified practitioner ordering monthly for 20 patients = $300–$600/mo ongoing. The math compounds fast.
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span style={{ color: C.muted }}>Monthly EA Investment</span>
              <span className="font-black" style={{ color: C.green }}>${spend.toLocaleString()}/mo</span>
            </div>
            <input type="range" min={8000} max={20000} step={500} value={spend}
              onChange={e => setSpend(Number(e.target.value))}
              className="w-full" style={{ accentColor: C.green }} />
            <div className="flex justify-between text-xs mt-0.5" style={{ color: C.muted }}>
              <span>$8K/mo</span><span>$20K/mo</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span style={{ color: C.muted }}>Avg Practitioner Annual Value</span>
              <span className="font-black" style={{ color: C.gold }}>${avgDeal.toLocaleString()}/yr</span>
            </div>
            <input type="range" min={1200} max={12000} step={600} value={avgDeal}
              onChange={e => setAvgDeal(Number(e.target.value))}
              className="w-full" style={{ accentColor: C.gold }} />
            <div className="flex justify-between text-xs mt-0.5" style={{ color: C.muted }}>
              <span>$1.2K/yr (Essential)</span><span>$12K/yr (Certified)</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-5">
          {[
            { label: "Practitioners Identified / Mo", value: leads, color: C.green },
            { label: "Demos Booked / Mo", value: demos, color: C.teal },
            { label: "New Practitioners Closed / Mo", value: closes, color: C.gold },
            { label: "New Annual Recurring Revenue", value: `$${(annualRevenue / 1000).toFixed(0)}K`, color: C.green, raw: true },
            { label: "ROI on Annual EA Spend", value: `${roi}%`, color: roi > 100 ? C.green : C.gold, raw: true },
            { label: "Payback Period", value: `${payback} mo`, color: C.teal, raw: true },
          ].map((s, i) => (
            <div key={i} className="rounded-xl p-3 text-center" style={{ background: C.card2, border: `1px solid ${C.border}` }}>
              {s.raw
                ? <div className="text-2xl font-black" style={{ color: s.color }}>{s.value}</div>
                : <AnimatedScore value={s.value as number} color={s.color} />}
              <div className="text-xs mt-1" style={{ color: "#e8f4f0" }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-xl p-3 text-xs" style={{ background: `${C.green}10`, border: `1px solid ${C.green}25`, color: C.muted }}>
          <span style={{ color: C.green, fontWeight: 900 }}>The anchor: </span>
          One certified practitioner ordering for 20 patients at $30/patient/month = <span style={{ color: C.white }}>${(20 * 30 * 12).toLocaleString()}/yr recurring</span>. That single practitioner pays for <span style={{ color: C.white }}>{Math.round((20 * 30 * 12) / spend)} months</span> of the pilot fee.
        </div>
      </div>

      <div className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <SL>90-DAY REVENUE PROJECTION</SL>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={projData}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
            <XAxis dataKey="month" tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}K`} />
            <Tooltip contentStyle={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 8, color: C.white }}
              formatter={(v: number) => [`$${v.toLocaleString()}`, ""]} />
            <Bar dataKey="revenue" fill={C.green} radius={[4, 4, 0, 0]} name="Projected Revenue" />
            <Bar dataKey="cost" fill={C.gold} radius={[4, 4, 0, 0]} name="EA Investment" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {MARKET_FACTS.map((f, i) => (
          <div key={i} className="rounded-xl p-4" style={{ background: C.card, border: `1px solid ${C.border}` }}>
            <div className="text-2xl font-black mb-1" style={{ color: i % 3 === 0 ? C.green : i % 3 === 1 ? C.gold : C.teal }}>{f.stat}</div>
            <div className="text-xs font-black mb-0.5" style={{ color: C.white }}>{f.label}</div>
            <div className="text-xs" style={{ color: C.muted }}>{f.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── TAB: THIS WEEK'S TARGETS ──────────────────────────────────────────────────
function TabTargets() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <SL>THIS WEEK'S TOP TARGETS — FUNCTIONAL MEDICINE & INTEGRATIVE HEALTH</SL>
        <div className="text-lg font-black mb-1" style={{ color: C.white }}>8 High-Intent Practitioners — Ranked by Activity Score</div>
        <div className="text-sm" style={{ color: C.muted }}>
          Practitioners actively researching plasmalogen science, biomarker testing, and longevity protocols this week.
        </div>
      </motion.div>

      {TARGET_POOL.map((t, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
          className="rounded-2xl overflow-hidden" style={{ background: C.card, border: `1px solid ${C.border}` }}>
          <div className="p-4 cursor-pointer" onClick={() => setSelected(selected === i ? null : i)}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <div className="text-base font-black" style={{ color: C.white }}>{t.org}</div>
                  <span className="px-2 py-0.5 rounded-full text-xs font-black"
                    style={{ background: `${C.green}20`, color: C.green, border: `1px solid ${C.green}30` }}>
                    {t.type}
                  </span>
                </div>
                <div className="text-xs" style={{ color: C.muted }}>{t.city}, {t.state}</div>
                <div className="text-xs mt-0.5" style={{ color: C.teal }}>{t.contact.name} · {t.contact.title}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-3xl font-black" style={{ color: C.green }}>{t.intensity}</div>
                <div className="text-xs" style={{ color: C.muted }}>intent score</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 mt-2">
              {t.tags.map((tag, j) => (
                <span key={j} className="px-2 py-0.5 rounded-full text-xs"
                  style={{ background: `${C.teal}12`, color: "#e8f4f0", border: `1px solid ${C.teal}20` }}>{tag}</span>
              ))}
            </div>

            <div className="flex items-center gap-3 mt-2">
              <div className="flex-1 h-1.5 rounded-full" style={{ background: C.card2 }}>
                <div className="h-full rounded-full" style={{ width: `${t.intensity}%`, background: `linear-gradient(90deg, ${C.green}, ${C.teal})` }} />
              </div>
              <span className="text-xs" style={{ color: C.muted }}>
                {t.trend === "up" ? "↑ Rising" : "→ Stable"}
              </span>
            </div>

            <div className="text-xs mt-2" style={{ color: C.muted }}>{t.activitySummary}</div>
          </div>

          <AnimatePresence>
            {selected === i && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
                onClick={e => e.stopPropagation()}>
                <div className="px-4 pb-4 space-y-3" style={{ borderTop: `1px solid ${C.border}` }}>
                  <div className="pt-3">
                    <div className="text-xs font-black mb-2" style={{ color: C.green }}>PRIMARY CONTACT</div>
                    <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
                      {[
                        ["Name", t.contact.name],
                        ["Title", t.contact.title],
                        ["Phone", t.contact.phone],
                        ["Email", t.contact.email],
                        ["Address", t.contact.address],
                        ["LinkedIn", t.contact.linkedin],
                      ].map(([label, value], j) => (
                        <div key={j} className="flex px-3 py-2 text-xs"
                          style={{ background: j % 2 === 0 ? C.card2 : C.card, borderBottom: `1px solid ${C.border}` }}>
                          <span className="w-24 shrink-0 font-black" style={{ color: C.muted }}>{label}</span>
                          <span style={{ color: C.white }}>{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {t.contact2 && (
                    <div>
                      <div className="text-xs font-black mb-2" style={{ color: C.teal }}>SECONDARY CONTACT</div>
                      <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
                        {[
                          ["Name", t.contact2.name],
                          ["Title", t.contact2.title],
                          ["Phone", t.contact2.phone],
                          ["Email", t.contact2.email],
                          ["LinkedIn", t.contact2.linkedin],
                        ].map(([label, value], j) => (
                          <div key={j} className="flex px-3 py-2 text-xs"
                            style={{ background: j % 2 === 0 ? C.card2 : C.card, borderBottom: `1px solid ${C.border}` }}>
                            <span className="w-24 shrink-0 font-black" style={{ color: C.muted }}>{label}</span>
                            <span style={{ color: C.white }}>{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <div className="text-xs font-black mb-2" style={{ color: C.gold }}>MULTI-CHANNEL OUTREACH</div>
                    <OutreachPanel t={t} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}

// ── TAB: LIVE SEARCH ──────────────────────────────────────────────────────────
function TabSearch() {
  const [state, setState] = useState("National");
  const [orgType, setOrgType] = useState("");
  const [title, setTitle] = useState("");
  const [results, setResults] = useState<typeof SEARCH_POOL>([]);
  const [searching, setSearching] = useState(false);
  const [searchDone, setSearchDone] = useState(false);
  const [loadingIdx, setLoadingIdx] = useState<number[]>([]);
  const [loadedIdx, setLoadedIdx] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [searchLabel, setSearchLabel] = useState("");

  const STATES = ["National", "California", "Texas", "New York", "Florida", "Illinois", "Ohio", "Washington", "Colorado", "Georgia", "North Carolina", "Tennessee", "Massachusetts", "Pennsylvania", "Michigan", "Virginia", "Maryland", "New Jersey", "Arizona", "Minnesota", "Indiana", "Wisconsin", "Missouri", "Oregon", "Nevada", "Connecticut", "Utah", "Oklahoma", "Kansas", "Nebraska", "Iowa"];
  const ORG_TYPES = ["", "Functional Medicine", "Academic Medical Center", "Hospital", "Naturopathic Medicine", "Longevity / Anti-Aging", "Lab / Testing Platform", "Medical Association", "Education & Certification", "Neurology / Brain Health"];
  const TITLES = ["", "Medical Director", "Founder / CEO", "Director of Clinical Operations", "VP Partnerships", "Chief Science Officer", "Director of Research", "VP Clinical Programs", "Chief Wellness Officer", "Dean / Academic Director"];

  // Auto-run search on mount
  useEffect(() => {
    setTimeout(() => runSearch(), 100);
  }, []);

  function runSearch() {
    setSearching(true);
    setResults([]);
    setLoadingIdx([]);
    setLoadedIdx([]);
    setSelected(null);
    setSearchDone(false);

    const parts: string[] = [];
    if (title) parts.push(title);
    if (orgType) parts.push(orgType);
    parts.push(state);
    setSearchLabel(parts.join(" · "));

    let pool = [...SEARCH_POOL];

    if (state && state !== "National") {
      const stateAbbr: Record<string, string> = {
        "California": "CA", "Texas": "TX", "New York": "NY", "Florida": "FL",
        "Illinois": "IL", "Ohio": "OH", "Washington": "WA", "Colorado": "CO",
        "Georgia": "GA", "North Carolina": "NC", "Tennessee": "TN", "Massachusetts": "MA",
        "Pennsylvania": "PA", "Michigan": "MI", "Virginia": "VA", "Maryland": "MD",
        "New Jersey": "NJ", "Arizona": "AZ", "Minnesota": "MN", "Indiana": "IN",
        "Wisconsin": "WI", "Missouri": "MO", "Oregon": "OR", "Nevada": "NV",
        "Connecticut": "CT", "Utah": "UT", "Oklahoma": "OK", "Kansas": "KS",
        "Nebraska": "NE", "Iowa": "IA",
      };
      const abbr = stateAbbr[state] || state;
      pool = pool.filter(t => t.state === abbr || t.state === state);
    }

    if (orgType) {
      const oLower = orgType.toLowerCase();
      pool = pool.filter(t =>
        t.type.toLowerCase().includes(oLower) ||
        t.tags.some(tag => tag.toLowerCase().includes(oLower)) ||
        // fuzzy: any word in orgType matches any word in type
        oLower.split(" ").some(word => word.length > 3 && t.type.toLowerCase().includes(word))
      );
    }

    if (title) {
      const titleLower = title.toLowerCase();
      // Very fuzzy: match any single meaningful word from the filter against any contact title
      const titleWords = titleLower.split(/[\s\/,&]+/).filter(w => w.length > 3);
      pool = pool.filter(t => {
        const allTitles = [
          t.contact.title.toLowerCase(),
          t.contact2 ? t.contact2.title.toLowerCase() : "",
        ].join(" ");
        // If no meaningful words, skip filter
        if (titleWords.length === 0) return true;
        return titleWords.some(w => allTitles.includes(w));
      });
      // If title filter wiped everything, ignore it and return unfiltered state results
      if (pool.length === 0) {
        let fallback = [...SEARCH_POOL];
        if (state && state !== "National") {
          const stateAbbr: Record<string, string> = {
            "California": "CA", "Texas": "TX", "New York": "NY", "Florida": "FL",
            "Illinois": "IL", "Ohio": "OH", "Washington": "WA", "Colorado": "CO",
            "Georgia": "GA", "North Carolina": "NC", "Tennessee": "TN", "Massachusetts": "MA",
            "Pennsylvania": "PA", "Michigan": "MI", "Virginia": "VA", "Maryland": "MD",
            "New Jersey": "NJ", "Arizona": "AZ", "Minnesota": "MN", "Indiana": "IN",
            "Wisconsin": "WI", "Missouri": "MO", "Oregon": "OR", "Nevada": "NV",
            "Connecticut": "CT", "Utah": "UT", "Oklahoma": "OK", "Kansas": "KS",
            "Nebraska": "NE", "Iowa": "IA",
          };
          const abbr = stateAbbr[state] || state;
          fallback = fallback.filter(t => t.state === abbr || t.state === state);
        }
        pool = fallback.length > 0 ? fallback : [...SEARCH_POOL].slice(0, 8);
      }
    }

    if (pool.length === 0) {
      setSearching(false);
      setSearchDone(true);
      setSearchLabel(parts.join(" · ") + " — No matches found");
      return;
    }

    pool = pool.slice(0, 8);
    pool.sort((a, b) => b.intensity - a.intensity);

    pool.forEach((t, i) => {
      setTimeout(() => {
        setResults(prev => [...prev, t]);
        setLoadingIdx(prev => [...prev, i]);
        setTimeout(() => {
          setLoadedIdx(prev => [...prev, i]);
          if (i === pool.length - 1) {
            setSearching(false);
            setSearchDone(true);
          }
        }, 600);
      }, i * 300);
    });
  }

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <SL>LIVE PRACTITIONER SEARCH — PRODROME SCIENCE</SL>
        <div className="text-lg font-black mb-1" style={{ color: C.white }}>Find High-Intent Practitioners by State & Specialty</div>
        <div className="text-sm mb-4" style={{ color: C.muted }}>
          Search functional medicine practitioners, integrative MDs, and neurologists actively researching plasmalogen science.
        </div>

        <div className="grid grid-cols-1 gap-3 mb-4">
          <div>
            <label className="text-xs font-black mb-1 block" style={{ color: C.muted }}>STATE</label>
            <select value={state} onChange={e => setState(e.target.value)}
              className="w-full rounded-xl px-3 py-2 text-sm font-black"
              style={{ background: C.card2, border: `1px solid ${C.border}`, color: C.white }}>
              {STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-black mb-1 block" style={{ color: C.muted }}>PRACTICE TYPE</label>
            <select value={orgType} onChange={e => setOrgType(e.target.value)}
              className="w-full rounded-xl px-3 py-2 text-sm font-black"
              style={{ background: C.card2, border: `1px solid ${C.border}`, color: C.white }}>
              {ORG_TYPES.map(t => <option key={t} value={t}>{t || "Any type"}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-black mb-1 block" style={{ color: C.muted }}>TITLE / ROLE</label>
            <select value={title} onChange={e => setTitle(e.target.value)}
              className="w-full rounded-xl px-3 py-2 text-sm font-black"
              style={{ background: C.card2, border: `1px solid ${C.border}`, color: C.white }}>
              {TITLES.map(t => <option key={t} value={t}>{t || "Any title"}</option>)}
            </select>
          </div>
        </div>

        <button onClick={runSearch} disabled={searching}
          className="w-full py-3 rounded-xl font-black text-sm transition-all"
          style={{ background: searching ? `${C.green}30` : C.green, color: searching ? C.green : "#080f1a" }}>
          {searching ? "Scanning practitioners..." : "Find Practitioners"}
        </button>
      </motion.div>

      {searchDone && results.length === 0 && (
        <div className="rounded-2xl p-5 text-center" style={{ background: C.card, border: `1px solid ${C.border}` }}>
          <div className="text-lg font-black mb-1" style={{ color: C.white }}>No matches found</div>
          <div className="text-sm" style={{ color: C.muted }}>Try a different state or remove the title filter.</div>
        </div>
      )}

      {results.length > 0 && (
        <div className="rounded-xl px-3 py-2 text-xs font-black" style={{ background: `${C.green}15`, color: C.green, border: `1px solid ${C.green}30` }}>
          {results.length} practitioners found · {searchLabel}
        </div>
      )}

      {results.map((t, i) => (
        <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: loadedIdx.includes(i) ? 1 : 0.4, x: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl overflow-hidden" style={{ background: C.card, border: `1px solid ${C.border}` }}>
          <div className="p-4 cursor-pointer" onClick={() => setSelected(selected === i ? null : i)}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-black text-base" style={{ color: C.white }}>{t.org}</div>
                <div className="text-xs mt-0.5" style={{ color: C.muted }}>{t.city}, {t.state} · {t.type}</div>
                <div className="text-xs mt-0.5" style={{ color: C.teal }}>{t.contact.name} · {t.contact.title}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-2xl font-black" style={{ color: C.green }}>{t.intensity}</div>
                <div className="text-xs" style={{ color: C.muted }}>intent</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {t.tags.map((tag, j) => (
                <span key={j} className="px-2 py-0.5 rounded-full text-xs"
                  style={{ background: `${C.green}12`, color: "#e8f4f0", border: `1px solid ${C.green}20` }}>{tag}</span>
              ))}
            </div>
          </div>

          <AnimatePresence>
            {selected === i && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
                onClick={e => e.stopPropagation()}>
                <div className="px-4 pb-4 pt-3 space-y-3" style={{ borderTop: `1px solid ${C.border}` }}>
                  <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
                    {[
                      ["Name", t.contact.name],
                      ["Title", t.contact.title],
                      ["Phone", t.contact.phone],
                      ["Email", t.contact.email],
                      ["Address", t.contact.address],
                      ["LinkedIn", t.contact.linkedin],
                    ].map(([label, value], j) => (
                      <div key={j} className="flex px-3 py-2 text-xs"
                        style={{ background: j % 2 === 0 ? C.card2 : C.card, borderBottom: `1px solid ${C.border}` }}>
                        <span className="w-24 shrink-0 font-black" style={{ color: C.muted }}>{label}</span>
                        <span style={{ color: C.white }}>{value}</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="text-xs font-black mb-2" style={{ color: C.gold }}>MULTI-CHANNEL OUTREACH</div>
                    <OutreachPanel t={t} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
const TABS = [
  { id: "how",     label: "How It Works",       icon: "🧬" },
  { id: "siteid",  label: "Who's On Your Site",  icon: "👁" },
  { id: "roi",     label: "ROI Calculator",      icon: "📈" },
  { id: "targets", label: "This Week's Targets", icon: "🎯" },
  { id: "search",  label: "Live Search",         icon: "🔍" },
];

export default function ProdromeDashboard() {
  const [activeTab, setActiveTab] = useState("how");

  return (
    <div className="min-h-screen" style={{ background: C.bg, color: C.white }}>
      <style>{`
        @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.4)} }
      `}</style>

      {/* Header */}
      <div className="sticky top-0 z-40 px-4 py-3" style={{ background: `${C.bg}f0`, backdropFilter: "blur(12px)", borderBottom: `1px solid ${C.border}` }}>
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div>
            <div className="font-black text-base" style={{ color: C.white }}>Prodrome Science</div>
            <div className="text-xs" style={{ color: C.muted }}>prodrome.com · Lipid Science · Brain Health</div>
          </div>
          <div className="flex items-center gap-2 text-xs font-black px-3 py-1.5 rounded-full"
            style={{ background: `${C.green}20`, color: C.green, border: `1px solid ${C.green}40` }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: C.green, animation: "pulse-dot 2s infinite" }} />
            LIVE
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="sticky top-14 z-30 px-4 py-2" style={{ background: `${C.bg}f0`, backdropFilter: "blur(12px)", borderBottom: `1px solid ${C.border}` }}>
        <div className="flex gap-1 overflow-x-auto max-w-6xl mx-auto">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all shrink-0"
              style={{
                background: activeTab === tab.id ? `${C.green}20` : "transparent",
                color: activeTab === tab.id ? C.green : C.muted,
                border: `1px solid ${activeTab === tab.id ? C.green + "50" : "transparent"}`,
              }}>
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-5 max-w-6xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.2 }}>
            {activeTab === "how"     && <TabHow />}
            {activeTab === "siteid"  && <TabSiteID />}
            {activeTab === "roi"     && <TabROI />}
            {activeTab === "targets" && <TabTargets />}
            {activeTab === "search"  && <TabSearch />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
