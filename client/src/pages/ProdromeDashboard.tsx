// ─────────────────────────────────────────────────────────────────────────────
// ProdromeDashboard.tsx
// Exact Audience Pitch Portal — Prodrome Science
// Design: Deep navy + emerald green + gold-amber accent
// ICP: Functional medicine practitioners, integrative MDs, neurologists,
//      longevity clinics, chiropractors, autism/dementia specialists
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
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
  { stat: "80%",     label: "Reduction in dementia risk with high plasmalogen levels", sub: "Published in Journal of Lipid Research — independently replicated" },
  { stat: "30+",     label: "Years of peer-reviewed plasmalogen research", sub: "Dr. Goodenowe's work replicated in Japan, Europe, and North America" },
  { stat: "$44B",    label: "Global anti-aging supplement market", sub: "Prodrome sits at the intersection of brain health + longevity" },
  { stat: "3.5%/yr", label: "Rate of plasmalogen decline after age 40", sub: "Every patient over 40 is a candidate for ProdromeScan™ testing" },
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

      {/* EA pitch */}
      <div className="rounded-2xl p-5" style={{ background: `linear-gradient(135deg, ${C.card} 0%, #0a2218 100%)`, border: `1px solid ${C.green}30` }}>
        <SL color={C.green}>WHY EXACT AUDIENCE FOR PRODROME</SL>
        <div className="text-sm font-black mb-3" style={{ color: C.white }}>The practitioner acquisition problem — solved.</div>
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
  const ORG_TYPES = ["", "Functional Medicine Clinic", "Academic Medical Center", "Hospital", "Naturopathic Medicine", "Longevity / Nootropics Brand", "Lab Ordering Platform", "Medical Association", "Education & Certification"];
  const TITLES = ["", "Medical Director", "Founder & CEO", "Director of Clinical Operations", "VP Partnerships", "Chief Science Officer", "Director of Research Programs", "VP Clinical Programs"];

  function runSearch() {
    if (searching) return;
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

    if (orgType) pool = pool.filter(t => t.type === orgType || t.tags.some(tag => tag.toLowerCase().includes(orgType.toLowerCase())));

    if (title) {
      const titleLower = title.toLowerCase();
      pool = pool.filter(t =>
        t.contact.title.toLowerCase().includes(titleLower) ||
        (t.contact2 && t.contact2.title.toLowerCase().includes(titleLower))
      );
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
        <div className="flex items-center justify-between max-w-2xl mx-auto">
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
        <div className="flex gap-1 overflow-x-auto max-w-2xl mx-auto">
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
      <div className="px-4 py-5 max-w-2xl mx-auto">
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
