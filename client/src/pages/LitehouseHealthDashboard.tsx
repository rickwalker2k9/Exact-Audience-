import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell, LineChart, Line
} from "recharts";

// ── Animated counter hook ─────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1.4) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, v => Math.round(v));
  useEffect(() => {
    const controls = animate(count, target, { duration, ease: "easeOut" });
    return controls.stop;
  }, [target]);
  return rounded;
}

// ── Brand colors ──────────────────────────────────────────────────────────────
// Litehouse Health: deep navy bg, bright teal accent, orange→gold EA gradient
const C = {
  bg:       "#050f1e",
  card:     "#091828",
  card2:    "#0d2035",
  border:   "#143050",
  teal:     "#00B4D8",
  tealDim:  "#007fa0",
  orange:   "#f97316",
  gold:     "#fbbf24",
  white:    "#ddeeff",
  muted:    "#6a90b0",
  grad:     "linear-gradient(135deg, #f97316, #fbbf24)",
  gradR:    "linear-gradient(135deg, #fbbf24, #f97316)",
  tealGrad: "linear-gradient(135deg, #00B4D8, #007fa0)",
};

const TABS = [
  { id: "how",     label: "How It Works" },
  { id: "siteid",  label: "Who's On Your Site" },
  { id: "roi",     label: "ROI Calculator" },
  { id: "targets", label: "This Week's Targets" },
  { id: "search",  label: "Live Search" },
];

// ── Shared UI ─────────────────────────────────────────────────────────────────
function SL({ children, color }: { children: React.ReactNode; color?: string }) {
  return (
    <div className="text-xs font-black tracking-widest mb-3" style={{ color: color || C.orange }}>
      {children}
    </div>
  );
}

function AnimatedScore({ value, color }: { value: number; color: string }) {
  const count = useCountUp(value);
  return <motion.div className="text-2xl font-black" style={{ color }}>{count}</motion.div>;
}

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
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={(data.length - 1) / (data.length - 1) * w} cy={h - (data[data.length - 1] / max) * h} r="2.5" fill={color} />
    </svg>
  );
}

// ── OUTREACH PANEL ────────────────────────────────────────────────────────────
type Contact = {
  name: string; title: string; phone: string; email: string;
  linkedin?: string; address?: string; city?: string; state?: string;
};

type TargetEntry = {
  org: string; type: "Health System" | "Hospital" | "Clinic Network" | "Academic Medical Center" | "Regional Hospital";
  city: string; state: string; beds: number; signal: string;
  intensity: number; weeks: number;
  contact: Contact;
  contact2?: Contact;
  contact3?: Contact;
  tags: string[];
  signals: string[];
  surgeTopics: string[];
  activitySummary: string;
  trend: "rising" | "steady" | "new";
  sparkline: number[];
};

function OutreachPanel({ t }: { t: TargetEntry }) {
  const [channel, setChannel] = useState<"email" | "linkedin_conn" | "linkedin_dm" | "linkedin_seq" | "mail" | "call" | "sms">("email");
  const [copied, setCopied] = useState(false);
  const first = t.contact.name.split(" ")[0];
  const channels = [
    { id: "email" as const,        label: "Email" },
    { id: "linkedin_conn" as const, label: "LI Connect" },
    { id: "linkedin_dm" as const,   label: "LI Message" },
    { id: "linkedin_seq" as const,  label: "LI Sequence" },
    { id: "mail" as const,          label: "Direct Mail" },
    { id: "call" as const,          label: "Cold Call" },
    { id: "sms" as const,           label: "SMS" },
  ];

  const annualSavings = Math.round(t.beds * 2.2 * 52 * (5100 - 2424));
  const fmtSavings = annualSavings >= 1000000
    ? `$${(annualSavings / 1000000).toFixed(1)}M`
    : `$${(annualSavings / 1000).toFixed(0)}K`;

  const content = {
    email: {
      subject: `${t.org} is spending $${(t.beds * 2.2 * 52 * 5100 / 1000000).toFixed(1)}M/yr on shift labor — here's the fix`,
      body: `${first},

A ${t.beds}-bed hospital running a typical shift mix spends over $${(t.beds * 2.2 * 52 * 5100 / 1000000).toFixed(1)}M a year on shift labor — and a big portion of that is going to travel nurses at $189K/yr when your own PRN and float pool staff are available.

Beacon fixes that. It routes every open shift to your internal staff first — automatically, in seconds. Average shift cost drops from $5,100 to $2,424. That's ${fmtSavings} back in ${t.org}'s budget every year.

No rip-and-replace. Works alongside UKG, Symplr, and your existing stack.

Worth 15 minutes to see the math for ${t.org} specifically?

[Your Name]
Litehouse Health
[Phone]`,
    },
    linkedin_conn: {
      subject: "LinkedIn Connection Request",
      body: `${first} — I work with nursing operations leaders at regional health systems across ${t.state}. Would love to connect — always good to know the people doing the hard work in healthcare workforce management.`,
    },
    linkedin_dm: {
      subject: "LinkedIn Follow-Up",
      body: `${first}, appreciate the connection!

Quick question — how is ${t.org} currently handling shift allocation when a gap opens up? Specifically, how long does it take to get from "open shift" to "filled by internal staff" before it goes to an agency?

Asking because we've been working on something that cuts that window down to seconds and the labor cost impact tends to be significant for systems your size.

Happy to share more if it's relevant.

— [Your Name]`,
    },
    mail: {
      subject: `${fmtSavings} a year is sitting in ${t.org}'s shift schedule`,
      body: `${t.contact.name}
${t.contact.title}
${t.org}
${t.city}, ${t.state}

${first},

Travel nurses cost $189,758 a year per position. Your own PRN nurses cost a fraction of that. The problem isn't the nurses — it's that most hospitals don't have a system that gets to internal staff fast enough before the shift goes external.

Beacon solves that. Every open shift is automatically broadcast to your internal PRN, float pool, and part-time staff first — in seconds, not hours. Average shift cost drops from $5,100 to $2,424.

For ${t.org}, that's ${fmtSavings} a year. In the first 90 days.

I'd love to send you a one-page savings analysis built specifically for a ${t.beds}-bed system. No obligation.

[Your Name] | [Phone] | [Email]
Litehouse Health`,
    },
    call: {
      subject: "Call Script",
      body: `OPENER:
"Hi ${first}, this is [Name] — I'll be quick. Do you have 45 seconds?"

IF YES:
"${t.org} is spending roughly $${(t.beds * 2.2 * 52 * 5100 / 1000000).toFixed(1)}M a year on shift labor. We help health systems recover a big chunk of that — specifically by making sure open shifts go to your internal PRN and float pool first, automatically, before they ever reach a travel agency. Average shift cost drops from $5,100 to $2,424.

For a ${t.beds}-bed system like ${t.org}, that's typically ${fmtSavings} a year.

Would it be worth 15 minutes to see what that looks like for your specific shift mix?"

OBJECTION — "We already use UKG / Symplr":
"Perfect — Beacon runs alongside both. We're not replacing your scheduling system, we're adding the allocation layer that routes shifts to the right resource automatically. Most of our clients were already on UKG or Symplr."

CLOSE:
"I'll text you a one-page savings breakdown right now. What's the best number?"`,
    },
    sms: {
      subject: "SMS",
      body: `${first} — [Name] here. ${t.org} could recover ${fmtSavings}/yr just by routing open shifts to internal staff before going external. 15-min demo? Reply YES and I'll send a link.`,
    },
    linkedin_seq: {
      subject: "LinkedIn 3-Message Sequence",
      body: `── MESSAGE 1 — CONNECTION REQUEST ──
${first} — I work with nursing operations leaders at regional health systems across ${t.state}. Would love to connect — always good to know the people doing the hard work in healthcare workforce management.

── MESSAGE 2 — SEND 2 DAYS AFTER CONNECTING ──
${first}, appreciate the connection!

Quick question — how is ${t.org} currently handling shift allocation when a gap opens up? Specifically, how long does it take to get from "open shift" to "filled by internal staff" before it goes to an agency?

Asking because we've been working on something that cuts that window down to seconds and the labor cost impact tends to be significant for systems your size.

Happy to share more if it's relevant.

── MESSAGE 3 — SEND 5 DAYS AFTER MESSAGE 2 (if no reply) ──
${first} — one stat worth sharing:

A ${t.beds}-bed system running a typical shift mix spends $${(t.beds * 2.2 * 52 * 5100 / 1000000).toFixed(1)}M/yr on shift labor. Beacon cuts the average shift cost from $5,100 to $2,424 by routing every open shift to internal PRN and float pool staff first — automatically, before it ever goes to an agency.

For ${t.org}, that's ${fmtSavings} a year. Worth 15 minutes to see the math for your specific shift mix?`,
    },
  };

  const active = content[channel];
  return (
    <div className="mt-3 rounded-xl overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
      <div className="flex flex-wrap" style={{ background: C.card2 }}>
        {channels.map(ch => (
          <button key={ch.id} onClick={e => { e.stopPropagation(); setChannel(ch.id); }}
            className="flex-1 min-w-[60px] py-2 text-xs font-black transition-all"
            style={{
              background: channel === ch.id ? C.grad : "transparent",
              color: channel === ch.id ? C.bg : C.teal,
              borderBottom: channel === ch.id ? "none" : `1px solid ${C.border}`,
            }}>
            {ch.label}
          </button>
        ))}
      </div>
      <div className="p-3" style={{ background: `${C.teal}08` }}>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="text-xs font-black" style={{ color: C.gold }}>{active.subject}</div>
          <button
            onClick={e => {
              e.stopPropagation();
              const text = channel === 'email' ? `Subject: ${active.subject}\n\n${active.body}` : active.body;
              navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
            }}
            className="shrink-0 text-xs font-black px-2 py-1 rounded transition-all"
            style={{ background: copied ? C.teal : `${C.teal}20`, color: copied ? C.bg : C.teal, border: `1px solid ${C.teal}40` }}>
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
        <pre className="text-xs leading-relaxed whitespace-pre-wrap font-sans" style={{ color: C.white }}>{active.body}</pre>
      </div>
    </div>
  );
}

// ── TARGET DATA POOL ──────────────────────────────────────────────────────────
const TARGET_POOL: TargetEntry[] = [
  {
    org: "Intermountain Health", type: "Health System",
    city: "Salt Lake City", state: "UT", beds: 4200,
    signal: "Healthcare Workforce Optimization Platform", intensity: 96, weeks: 5,
    contact: { name: "Heather Brace", title: "Chief People Officer", phone: "(801) 442-2000", email: "h.brace@imail.org", linkedin: "linkedin.com/in/heather-brace-intermountain", address: "36 S State St", city: "Salt Lake City", state: "UT" },
    contact2: { name: "Dr. Katy Welkie", title: "Chief Nursing Officer", phone: "(801) 442-5100", email: "k.welkie@imail.org" },
    contact3: { name: "Rob Allen", title: "CFO", phone: "(801) 442-3000", email: "r.allen@imail.org" },
    tags: ["Health System", "26 Hospitals", "Non-Profit", "Mountain West"],
    signals: ["Visited Litehouse Beacon product page 4x", "Researched travel nurse cost reduction strategies", "Downloaded AONL workforce optimization report", "Viewed UKG integration documentation"],
    surgeTopics: ["Travel nurse reduction", "Internal float pool optimization", "Shift cost management"],
    activitySummary: "Intermountain Health's CPO and CNO leadership actively evaluating internal resource management platforms to reduce $340M annual travel nurse spend.",
    trend: "rising", sparkline: [45, 58, 67, 74, 82, 88, 93, 96],
  },
  {
    org: "Advocate Health", type: "Health System",
    city: "Charlotte", state: "NC", beds: 6800,
    signal: "Internal PRN Pool Expansion + Beacon Integration", intensity: 93, weeks: 4,
    contact: { name: "Mary Beth Kingston", title: "Chief Nursing Officer", phone: "(704) 355-2000", email: "mb.kingston@advocatehealth.com", linkedin: "linkedin.com/in/marybeth-kingston-advocate", address: "900 S Tryon St", city: "Charlotte", state: "NC" },
    contact2: { name: "James Skogsbergh", title: "Co-CEO", phone: "(704) 355-1000", email: "j.skogsbergh@advocatehealth.com" },
    contact3: { name: "Dominic Nakis", title: "CFO", phone: "(704) 355-2200", email: "d.nakis@advocatehealth.com" },
    tags: ["Health System", "67 Hospitals", "Existing Litehouse Partner", "Expansion Opportunity"],
    signals: ["Returned to Beacon marketplace page 6x this week", "Researched Beacon UKG integration specs", "Visited Litehouse clinician marketplace page", "Reviewed case study: shift cost reduction"],
    surgeTopics: ["Beacon marketplace expansion", "PRN pool growth", "Float pool automation"],
    activitySummary: "Advocate Health (existing Litehouse partner) is actively researching expansion of Beacon deployment to additional facilities and the marketplace component.",
    trend: "rising", sparkline: [60, 68, 74, 80, 85, 89, 91, 93],
  },
  {
    org: "HCA Healthcare", type: "Health System",
    city: "Nashville", state: "TN", beds: 47000,
    signal: "Enterprise Workforce Management Platform RFP", intensity: 91, weeks: 6,
    contact: { name: "Sammie Mosier", title: "Chief Nurse Executive", phone: "(615) 344-9551", email: "s.mosier@hcahealthcare.com", linkedin: "linkedin.com/in/sammie-mosier-hca", address: "One Park Plaza", city: "Nashville", state: "TN" },
    contact2: { name: "Phillip Billington", title: "Chief People Officer", phone: "(615) 344-2000", email: "p.billington@hcahealthcare.com" },
    tags: ["Health System", "Fortune 500", "186 Hospitals", "National"],
    signals: ["Researched AI-driven shift allocation vendors", "Viewed Beacon vs Symplr comparison", "Downloaded workforce management RFP template", "Visited Litehouse EOR model page"],
    surgeTopics: ["AI shift allocation", "EOR model", "Enterprise WFM RFP"],
    activitySummary: "HCA Healthcare nursing leadership actively building an enterprise WFM RFP — evaluating Beacon alongside legacy vendors for system-wide deployment.",
    trend: "rising", sparkline: [50, 58, 65, 72, 78, 83, 88, 91],
  },
  {
    org: "Providence Health & Services", type: "Health System",
    city: "Renton", state: "WA", beds: 8900,
    signal: "Travel Nurse Dependency Reduction Initiative", intensity: 88, weeks: 4,
    contact: { name: "Sylvain Trepanier", title: "Chief Nursing Officer", phone: "(425) 525-3355", email: "s.trepanier@providence.org", linkedin: "linkedin.com/in/sylvain-trepanier-providence", address: "1801 Lind Ave SW", city: "Renton", state: "WA" },
    contact2: { name: "Greg Till", title: "Chief People Officer", phone: "(425) 525-3000", email: "g.till@providence.org" },
    contact3: { name: "Rhonda Medows", title: "CFO", phone: "(425) 525-3100", email: "r.medows@providence.org" },
    tags: ["Health System", "51 Hospitals", "Non-Profit", "Pacific Northwest"],
    signals: ["Visited travel nurse cost calculator page", "Researched internal float pool best practices", "Viewed Beacon scheduling automation features", "Downloaded AONL staffing model templates"],
    surgeTopics: ["Float pool automation", "Travel nurse cost reduction", "Internal PRN development"],
    activitySummary: "Providence CNO team actively sourcing platforms to reduce 38% travel nurse dependency — Beacon's internal-first allocation model directly addresses their stated initiative.",
    trend: "rising", sparkline: [40, 50, 60, 68, 74, 80, 85, 88],
  },
  {
    org: "CommonSpirit Health", type: "Health System",
    city: "Chicago", state: "IL", beds: 12000,
    signal: "Shift Cost Optimization — Beacon Evaluation", intensity: 85, weeks: 3,
    contact: { name: "Kathleen Sanford", title: "Chief Nursing Officer", phone: "(312) 664-7000", email: "k.sanford@commonspirit.org", linkedin: "linkedin.com/in/kathleen-sanford-commonspirit", address: "444 W Lake St", city: "Chicago", state: "IL" },
    contact2: { name: "Tami Minnier", title: "Chief Operating Officer", phone: "(312) 664-7100", email: "t.minnier@commonspirit.org" },
    tags: ["Health System", "140 Hospitals", "Non-Profit", "National"],
    signals: ["Viewed Beacon product demo video 2x", "Researched Symplr Smart Square integration options", "Visited Litehouse marketplace page", "Searched 'reduce travel nurse spend 2026'"],
    surgeTopics: ["Shift cost optimization", "Symplr integration", "Marketplace staffing"],
    activitySummary: "CommonSpirit Health operations team evaluating Beacon as a shift cost optimization layer on top of existing Symplr deployment.",
    trend: "steady", sparkline: [55, 60, 65, 70, 74, 78, 82, 85],
  },
  {
    org: "Ascension Health", type: "Health System",
    city: "St. Louis", state: "MO", beds: 9400,
    signal: "Internal Resource Management Platform Search", intensity: 83, weeks: 5,
    contact: { name: "Susan Nestor", title: "VP of Nursing Operations", phone: "(314) 733-8000", email: "s.nestor@ascension.org", linkedin: "linkedin.com/in/susan-nestor-ascension", address: "101 S Hanley Rd", city: "St. Louis", state: "MO" },
    contact2: { name: "Eduardo Conrado", title: "Chief Strategy Officer", phone: "(314) 733-8100", email: "e.conrado@ascension.org" },
    tags: ["Health System", "140 Hospitals", "Catholic Health", "National"],
    signals: ["Researched internal PRN pool development strategies", "Viewed Beacon EOR model documentation", "Visited Litehouse clinician credentialing page", "Downloaded HFMA labor cost benchmarking report"],
    surgeTopics: ["Internal PRN development", "EOR model", "Credentialing automation"],
    activitySummary: "Ascension VP of Nursing Operations researching internal resource management platforms — specifically interested in Beacon's EOR model and credentialing automation.",
    trend: "steady", sparkline: [42, 50, 57, 63, 68, 73, 78, 83],
  },
  {
    org: "Banner Health", type: "Health System",
    city: "Phoenix", state: "AZ", beds: 3800,
    signal: "Oracle Integration + Workforce Automation RFI", intensity: 80, weeks: 3,
    contact: { name: "Deb Krmpotic", title: "Chief Nursing Officer", phone: "(602) 747-4000", email: "d.krmpotic@bannerhealth.com", linkedin: "linkedin.com/in/deb-krmpotic-banner", address: "2901 N Central Ave", city: "Phoenix", state: "AZ" },
    contact2: { name: "Jim Roxburgh", title: "Chief Operating Officer", phone: "(602) 747-4100", email: "j.roxburgh@bannerhealth.com" },
    contact3: { name: "Dennis Dahlen", title: "CFO", phone: "(602) 747-4200", email: "d.dahlen@bannerhealth.com" },
    tags: ["Health System", "30 Hospitals", "Oracle Integration", "Southwest"],
    signals: ["Viewed Beacon Oracle integration documentation", "Researched workforce automation RFI templates", "Visited Litehouse Tableau analytics page", "Searched 'Oracle Beacon integration healthcare'"],
    surgeTopics: ["Oracle integration", "Workforce automation", "Tableau analytics"],
    activitySummary: "Banner Health IT and nursing operations teams evaluating Beacon's Oracle integration for a workforce automation RFI — Beacon's plug-and-play Oracle connector is a direct fit.",
    trend: "new", sparkline: [20, 32, 44, 55, 62, 68, 74, 80],
  },
  {
    org: "Bon Secours Mercy Health", type: "Health System",
    city: "Cincinnati", state: "OH", beds: 4100,
    signal: "Travel Nurse Contract Reduction + Internal Staffing Build", intensity: 77, weeks: 4,
    contact: { name: "Janice Walters", title: "Chief Nursing Officer", phone: "(513) 952-5000", email: "j.walters@bsmhealth.org", linkedin: "linkedin.com/in/janice-walters-bsmhealth", address: "1701 Mercy Health Pl", city: "Cincinnati", state: "OH" },
    contact2: { name: "Mark Taylor", title: "Chief Human Resources Officer", phone: "(513) 952-5100", email: "m.taylor@bsmhealth.org" },
    tags: ["Health System", "48 Hospitals", "Catholic Health", "Midwest"],
    signals: ["Researched travel nurse contract reduction case studies", "Viewed Beacon internal PRN pool features", "Downloaded NSI staffing benchmarking report", "Visited Litehouse marketplace clinician sourcing page"],
    surgeTopics: ["Travel nurse reduction", "Internal PRN build", "Clinician marketplace"],
    activitySummary: "Bon Secours Mercy Health CNO team actively building a strategy to reduce travel nurse contracts by 50% over 18 months — Beacon's internal-first allocation and marketplace are the exact solution.",
    trend: "rising", sparkline: [30, 40, 48, 55, 61, 66, 72, 77],
  },
];

// ── SITE VISITORS ─────────────────────────────────────────────────────────────
const SITE_VISITORS = [
  {
    name: "Vanessa Drummond", title: "VP of Nursing Operations", org: "Froedtert Health",
    city: "Milwaukee", state: "WI",
    visits: 9, lastSeen: "Today, 9:14 AM",
    timeOnSite: "14m 22s",
    pages: ["/beacon", "/beacon#how-it-works", "/beacon#marketplace", "/request-your-demo"],
    tier: "HOT PROSPECT — Demo Request Page",
    tierColor: C.orange,
    income: "$200K–$235K",
    phone: "(414) 777-8000",
    email: "v.drummond@froedtert.com",
    linkedin: "linkedin.com/in/vanessa-drummond-froedtert",
    address: "9200 W Wisconsin Ave, Milwaukee, WI 53226",
    outreach: "Vanessa has visited the Beacon product page 9 times and reached the demo request page — she's ready to move. Lead with the shift cost math ($5,100 → $2,424) and reference Froedtert's 500+ beds. Offer a 20-minute live demo this week.",
  },
  {
    name: "Terrence Okafor", title: "Chief Nursing Officer", org: "OhioHealth",
    city: "Columbus", state: "OH",
    visits: 5, lastSeen: "Today, 11:33 AM",
    timeOnSite: "9m 04s",
    pages: ["/beacon", "/clinicians", "/beacon#savings", "/about-us"],
    tier: "HIGH INTENT — Comparing Cost Models",
    tierColor: C.gold,
    income: "$285K–$345K",
    phone: "(614) 544-4455",
    email: "t.okafor@ohiohealth.com",
    linkedin: "linkedin.com/in/terrence-okafor-ohiohealth",
    address: "180 E Broad St, Columbus, OH 43215",
    outreach: "Terrence reviewed the Beacon product page, the clinician marketplace, and the savings calculator — he's running the numbers for OhioHealth's 12 hospitals. Lead with the EOR model and the internal-first allocation story, then anchor on the $66K annual savings per travel nurse replaced.",
  },
  {
    name: "Brianna Castillo", title: "Director of Workforce Management", org: "Memorial Hermann Health System",
    city: "Houston", state: "TX",
    visits: 6, lastSeen: "Today, 2:17 PM",
    timeOnSite: "10m 38s",
    pages: ["/beacon#integrations", "/beacon#analytics", "/competitors", "/beacon#pricing"],
    tier: "ACTIVE EVALUATOR — Competitor Research in Progress",
    tierColor: C.teal,
    income: "$148K–$178K",
    phone: "(713) 338-4000",
    email: "b.castillo@memorialhermann.org",
    linkedin: "linkedin.com/in/brianna-castillo-memorialhermann",
    address: "929 Gessner Rd, Houston, TX 77024",
    outreach: "Brianna is actively comparing Beacon against competitors — she hit the integrations page, analytics, and then went to a competitor comparison page before coming back to pricing. She's not done deciding. Lead with the UKG integration story and Tableau analytics, and offer a side-by-side comparison call.",
  },
  {
    name: "Preston Whitmore", title: "CFO", org: "Prisma Health",
    city: "Greenville", state: "SC",
    visits: 4, lastSeen: "Today, 8:02 AM",
    timeOnSite: "7m 15s",
    pages: ["/beacon#savings", "/beacon", "/beacon#pricing", "/request-your-demo"],
    tier: "FINANCIAL BUYER — Running the Numbers",
    tierColor: C.gold,
    income: "$315K–$385K",
    phone: "(864) 455-7000",
    email: "p.whitmore@prismahealth.org",
    linkedin: "linkedin.com/in/preston-whitmore-prismahealth",
    address: "300 E McBee Ave, Greenville, SC 29601",
    outreach: "Preston went straight to the savings calculator, then to the product page, then to pricing, then to the demo request — he's building a business case for Prisma's board. Lead with the $5,100 → $2,424 shift cost reduction, annualize it for Prisma's 18 hospitals, and send him a one-page ROI summary he can share internally.",
  },
  {
    name: "Alondra Reyes", title: "VP of Human Resources", org: "CommonSpirit Health",
    city: "Chicago", state: "IL",
    visits: 2, lastSeen: "Today, 10:15 AM",
    timeOnSite: "3m 48s",
    pages: ["/clinicians", "/about-us"],
    tier: "EARLY STAGE — Initial Awareness",
    tierColor: C.tealDim,
    income: "$165K–$200K",
    phone: "(312) 795-7000",
    email: "a.reyes@commonspirit.org",
    linkedin: "linkedin.com/in/alondra-reyes-commonspirit",
    address: "121 W Wacker Dr, Chicago, IL 60601",
    outreach: "Alondra is early-stage, reviewing the clinician marketplace and About Us. CommonSpirit has 140+ hospitals — if she moves forward, this is a landmark account. Send a warm intro with the one-page Beacon overview and the travel nurse cost data. Don't push for a demo yet.",
  },
];

// ── TAB: HOW IT WORKS ─────────────────────────────────────────────────────────
function TabHow() {
  const marketData = [
    { year: "2025", value: 2.48 },
    { year: "2026", value: 2.73 },
    { year: "2027", value: 2.99 },
    { year: "2028", value: 3.28 },
    { year: "2029", value: 3.60 },
    { year: "2030", value: 3.95 },
    { year: "2031", value: 4.33 },
    { year: "2032", value: 4.75 },
    { year: "2033", value: 4.97 },
    { year: "2034", value: 5.20 },
  ];

  const shiftCostData = [
    { label: "Overtime RN", cost: 180, fill: C.muted },
    { label: "Float Pool", cost: 65, fill: C.tealDim },
    { label: "Travel RN", cost: 270, fill: C.orange },
    { label: "Internal PRN", cost: 62, fill: C.teal },
    { label: "LH Marketplace", cost: 75, fill: C.gold },
  ];

  const stats = [
    { label: "Healthcare WFM Market 2025", value: "$2.48B", sub: "Growing to $5.20B by 2034 — 8.6% CAGR" },
    { label: "Travel Nurse Annual Cost", value: "$189K", sub: "vs $123K for staff RN — $66K savings per position" },
    { label: "Shift Cost Without Beacon", value: "$5,100", sub: "Overtime + float + travel per shift" },
    { label: "Shift Cost With Beacon", value: "$2,424", sub: "53% reduction — intelligent internal-first allocation" },
    { label: "Hospital Labor % of OpEx", value: "50–60%", sub: "Labor is the single largest cost center" },
    { label: "US Travel Nurse Spend", value: "$8.9B", sub: "Annual hospital spend — still 2x pre-COVID levels" },
  ];

  return (
    <div className="space-y-4">
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <SL>LITEHOUSE HEALTH — BEACON PLATFORM INTELLIGENCE</SL>
        <div className="text-xl font-black mb-2" style={{ color: C.white }}>
          Your Buyers Are Researching Staffing Solutions Right Now.
          <span style={{ background: C.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}> You Don't Know Who They Are.</span>
        </div>
        <div className="text-sm leading-relaxed" style={{ color: C.muted }}>
          CNOs and VPs of Nursing at regional hospitals spend weeks researching workforce management platforms before ever requesting a demo. They visit your site, read your case studies, compare your integrations — and then go dark. Exact Audience + SiteID identifies every hospital that visits <span style={{ color: C.teal, fontWeight: 700 }}>litehousehealth.com</span>, surfaces the decision-maker's contact record, and tells you exactly what they looked at — before you make a single cold call.
        </div>
      </motion.div>

      {/* Market stats grid */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="rounded-xl p-4" style={{ background: C.card, border: `1px solid ${C.border}` }}>
            <div className="text-2xl font-black mb-1" style={{ background: C.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{s.value}</div>
            <div className="text-xs font-black mb-1" style={{ color: C.white }}>{s.label}</div>
            <div className="text-xs" style={{ color: C.muted }}>{s.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* Market growth chart */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <SL color={C.teal}>HEALTHCARE WFM MARKET GROWTH — 2025–2034</SL>
        <div className="text-sm font-black mb-3" style={{ color: C.white }}>$2.48B → $5.20B — The Window Is Now</div>
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={marketData} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="lhMarketGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={C.teal} stopOpacity={0.35} />
                <stop offset="95%" stopColor={C.teal} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <XAxis dataKey="year" tick={{ fill: C.muted, fontSize: 9 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: C.muted, fontSize: 9 }} axisLine={false} tickLine={false}
              tickFormatter={v => `$${v}B`} domain={[2, 5.5]} />
            <Tooltip contentStyle={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 8, color: C.white, fontSize: 11 }}
              formatter={(v: number) => [`$${v.toFixed(2)}B`, "Market Size"]} />
            <Area type="monotone" dataKey="value" stroke={C.teal} strokeWidth={2} fill="url(#lhMarketGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Shift cost comparison */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <SL color={C.gold}>BEACON SHIFT COST BREAKDOWN</SL>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="rounded-xl p-4 text-center" style={{ background: `${C.border}80`, border: `1px solid ${C.border}` }}>
            <div className="text-xs font-black mb-1" style={{ color: C.muted }}>WITHOUT BEACON</div>
            <div className="text-3xl font-black" style={{ color: C.muted }}>$5,100</div>
            <div className="text-xs mt-1" style={{ color: C.muted }}>per shift avg</div>
            <div className="text-xs mt-2 space-y-0.5" style={{ color: C.muted }}>
              <div>Overtime (2) × $90 = $180</div>
              <div>Float Pool (1) × $65 = $65</div>
              <div>Travel (3) × $90 = $270</div>
            </div>
          </div>
          <div className="rounded-xl p-4 text-center" style={{ background: `${C.teal}10`, border: `1px solid ${C.teal}30` }}>
            <div className="text-xs font-black mb-1" style={{ color: C.teal }}>WITH BEACON</div>
            <div className="text-3xl font-black" style={{ background: C.tealGrad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>$2,424</div>
            <div className="text-xs mt-1" style={{ color: C.teal }}>per shift avg</div>
            <div className="text-xs mt-2 space-y-0.5" style={{ color: C.muted }}>
              <div>Internal PRN (1) × $62 = $62</div>
              <div>LH Marketplace (1) × $75 = $75</div>
              <div>Float Pool (1) × $65 = $65</div>
            </div>
          </div>
        </div>
        <div className="rounded-xl p-3" style={{ background: `${C.orange}10`, border: `1px solid ${C.orange}25` }}>
          <div className="text-xs font-black mb-1" style={{ color: C.orange }}>53% SHIFT COST REDUCTION — BEACON ADVANTAGE</div>
          <div className="text-sm" style={{ color: C.white }}>A 500-bed hospital running 200 open shifts/week saves <span style={{ color: C.gold, fontWeight: 900 }}>$2.7M/year</span> with Beacon's intelligent internal-first allocation. One deployment pays for the platform 10x over.</div>
        </div>
      </motion.div>

      {/* Beacon workflow */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <SL color={C.teal}>HOW BEACON WORKS — 6-STEP INTERNAL-FIRST ALLOCATION</SL>
        <div className="space-y-3">
          {[
            { step: "1", label: "Open Shifts Aggregated", desc: "Unit Leaders and Central Staffing post open shifts into Beacon." },
            { step: "2", label: "Full-Time Caregivers First", desc: "FTEs get first claim window — overtime rules and competency checks applied automatically." },
            { step: "3", label: "Resource Pool Broadcast", desc: "Beacon pushes to your Resource Pool with targeted notifications via the Beacon app." },
            { step: "4", label: "Internal PRN Activation", desc: "After your designated window, Beacon broadcasts to internal PRN staff." },
            { step: "5", label: "Litehouse Marketplace", desc: "Only after internal resources are fully optimized — shifts open to local W2 marketplace nurses." },
            { step: "6", label: "Travel as Last Resort", desc: "Specialty shifts not filled internally become available to travelers — at your discretion, not by default." },
          ].map((s, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 font-black text-xs"
                style={{ background: i < 4 ? C.tealGrad : C.grad, color: C.bg }}>{s.step}</div>
              <div>
                <div className="text-sm font-black" style={{ color: C.white }}>{s.label}</div>
                <div className="text-xs mt-0.5" style={{ color: C.muted }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Competitive comparison */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
        className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <SL color={C.gold}>COMPETITIVE LANDSCAPE — WHY BEACON WINS</SL>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                {["Vendor", "Internal Opt.", "Marketplace", "EOR Model", "Integrations", "Avg ACV"].map(h => (
                  <th key={h} className="text-left py-2 pr-3 font-black" style={{ color: C.muted }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { name: "Litehouse Beacon", internal: "✓ AI-Driven", mkt: "✓ Local W2", eor: "✓", integrations: "UKG, Oracle, Symplr", acv: "$150K–$400K", highlight: true },
                { name: "UKG (Kronos)",     internal: "Partial",      mkt: "✗",          eor: "✗", integrations: "Native only",        acv: "$200K–$800K" },
                { name: "Symplr",           internal: "Scheduling",   mkt: "✗",          eor: "✗", integrations: "Limited",            acv: "$100K–$300K" },
                { name: "ShiftMed",         internal: "✗",            mkt: "✓ Gig",      eor: "Partial", integrations: "Symplr only",  acv: "$50K–$150K" },
                { name: "QGenda",           internal: "Physician",    mkt: "✗",          eor: "✗", integrations: "Limited",            acv: "$80K–$200K" },
              ].map((r, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${C.border}40`, background: r.highlight ? `${C.teal}10` : "transparent" }}>
                  <td className="py-2 pr-3 font-black" style={{ color: r.highlight ? C.teal : C.white }}>{r.name}{r.highlight ? " ★" : ""}</td>
                  <td className="py-2 pr-3" style={{ color: r.internal === "✓ AI-Driven" ? C.teal : C.muted }}>{r.internal}</td>
                  <td className="py-2 pr-3" style={{ color: r.mkt === "✓ Local W2" ? C.teal : C.muted }}>{r.mkt}</td>
                  <td className="py-2 pr-3" style={{ color: r.eor === "✓" ? C.teal : C.muted }}>{r.eor}</td>
                  <td className="py-2 pr-3" style={{ color: C.muted }}>{r.integrations}</td>
                  <td className="py-2" style={{ color: r.highlight ? C.gold : C.muted }}>{r.acv}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* EA pitch */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}
        className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <SL color={C.gold}>WHAT MAKES EXACT AUDIENCE DIFFERENT FOR LITEHOUSE</SL>
        <div className="space-y-3">
          {[
            { label: "Traditional B2B Healthcare Sales", desc: "Cold calls to hospital switchboards. Emails to generic nursing@hospital.org addresses. You have no idea which health systems are actively evaluating workforce platforms right now — so you spray and pray.", bad: true },
            { label: "Exact Audience + SiteID for Litehouse", desc: "Intent-first intelligence. We identify which health systems are visiting litehousehealth.com right now, surface the CNO or VP of Nursing's direct contact, and tell you exactly what pages they viewed — Beacon product page, integrations, demo request — before you make a single call. You call warm, not cold.", bad: false },
          ].map((r, i) => (
            <div key={i} className="rounded-xl p-3 flex items-start gap-3"
              style={{ background: r.bad ? `${C.border}80` : `${C.teal}12`, border: `1px solid ${r.bad ? C.border : C.teal}30` }}>
              <div className="w-2 h-2 rounded-full mt-1 shrink-0" style={{ background: r.bad ? C.border : C.teal }} />
              <div>
                <div className="text-xs font-black mb-1" style={{ color: r.bad ? C.muted : C.teal }}>{r.label}</div>
                <div className="text-xs leading-relaxed" style={{ color: C.white }}>{r.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ── TAB: SITE ID ──────────────────────────────────────────────────────────────
function TabSiteID() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <div className="flex items-center justify-between mb-1">
          <SL>LITEHOUSEHEALTH.COM — LIVE SITE VISITOR INTELLIGENCE</SL>
          <div className="flex items-center gap-1.5 text-xs font-black" style={{ color: C.teal }}>
            <div className="w-2 h-2 rounded-full" style={{ background: C.teal, animation: "pulse-dot 2s infinite" }} />
            LIVE
          </div>
        </div>
        <div className="text-lg font-black mb-1" style={{ color: C.white }}>Today's Identified Visitors — litehousehealth.com</div>
        <div className="text-sm" style={{ color: C.muted }}>
          Every health system visiting your site today — identified in real time. No form. No call. You know who they are before they know you know.
        </div>
        <div className="grid grid-cols-3 gap-3 mt-4">
          {[
            { label: "Health Systems Identified Today", value: 5, color: C.orange },
            { label: "Decision-Makers Identified", value: 5, color: C.teal },
            { label: "Avg Time on Site", value: "7m 19s", color: C.gold, raw: true },
          ].map((s, i) => (
            <div key={i} className="rounded-xl p-3 text-center" style={{ background: C.card2, border: `1px solid ${C.border}` }}>
              {s.raw
                ? <div className="text-2xl font-black" style={{ color: s.color }}>{s.value}</div>
                : <AnimatedScore value={s.value as number} color={s.color} />}
              <div className="text-xs mt-1" style={{ color: C.muted }}>{s.label}</div>
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
                <div className="text-2xl font-black" style={{ color: C.orange }}>{v.visits}</div>
                <div className="text-xs" style={{ color: C.muted }}>visits</div>
              </div>
            </div>

            <div className="mt-2 inline-block px-2 py-0.5 rounded-full text-xs font-black"
              style={{ background: `${v.tierColor}20`, color: v.tierColor, border: `1px solid ${v.tierColor}40` }}>
              {v.tier}
            </div>

            <div className="flex flex-wrap gap-1.5 mt-2">
              {v.pages.map((p, j) => (
                <span key={j} className="px-2 py-0.5 rounded-full text-xs"
                  style={{ background: `${C.teal}15`, color: C.teal, border: `1px solid ${C.teal}25` }}>{p}</span>
              ))}
            </div>
            <div className="flex gap-4 mt-2 text-xs" style={{ color: C.muted }}>
              <span>Last seen: <span style={{ color: C.white }}>{v.lastSeen}</span></span>
              <span>Time on site: <span style={{ color: C.white }}>{v.timeOnSite}</span></span>
              <span>Est. income: <span style={{ color: C.gold }}>{v.income}</span></span>
            </div>
          </div>

          <AnimatePresence>
            {expanded === i && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
                onClick={e => e.stopPropagation()}>
                <div className="px-4 pb-4 space-y-3" style={{ borderTop: `1px solid ${C.border}` }}>
                  <div className="pt-3">
                    <div className="text-xs font-black mb-2" style={{ color: C.orange }}>VERIFIED CONTACT RECORD</div>
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

                  <div>
                    <div className="text-xs font-black mb-2" style={{ color: C.teal }}>SUGGESTED OUTREACH</div>
                    <div className="rounded-xl p-3 text-xs leading-relaxed" style={{ background: `${C.teal}10`, border: `1px solid ${C.teal}25`, color: C.white }}>
                      {v.outreach}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-black mb-2" style={{ color: C.orange }}>MULTI-CHANNEL OUTREACH</div>
                    {(() => {
                      const t = TARGET_POOL.find(tp => tp.org.toLowerCase().includes(v.org.split(" ")[0].toLowerCase())) || TARGET_POOL[i % TARGET_POOL.length];
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
  // Monthly fee: $8K–$12K over 90-day pilot
  const [monthlyFee, setMonthlyFee] = useState(10000);
  const [avgDeal, setAvgDeal] = useState(200000);

  const pilotCost = monthlyFee * 3; // 90 days = 3 months
  const annualCost = monthlyFee * 12;

  // Conservative: healthcare sales cycle is long — model 90-day pilot pipeline
  // Pilot generates ~40–80 identified health systems, 3–6 demos, 0–1 closes in 90 days
  // But 1 close at $200K = full ROI in year 1
  const leadsPerMonth  = Math.round((monthlyFee / 8000) * 28);  // ~28–42 identified/mo
  const pilotLeads     = leadsPerMonth * 3;
  const pilotDemos     = Math.round(pilotLeads * 0.08);          // 8% demo rate (healthcare B2B)
  const pilotDeals     = Math.round(pilotDemos * 0.22);          // 22% close rate
  const pilotRevenue   = pilotDeals * avgDeal;
  const pilotROI       = pilotCost > 0 ? ((pilotRevenue - pilotCost) / pilotCost * 100).toFixed(0) : "0";
  const annualRevenue  = Math.round((pilotDeals / 3) * 12 * avgDeal); // annualized run rate
  const roiMultiple    = annualCost > 0 ? (annualRevenue / annualCost).toFixed(1) : "0";
  const payback        = annualRevenue > 0 ? (annualCost / (annualRevenue / 12)).toFixed(1) : "—";

  const tierLabel = monthlyFee <= 9000  ? { label: "Pilot — Conservative", color: C.teal } :
                    monthlyFee <= 10500 ? { label: "Pilot — Recommended",  color: C.orange } :
                                         { label: "Pilot — Accelerated",   color: C.gold };

  const projectionData = Array.from({ length: 3 }, (_, m) => ({
    month: `Month ${m + 1}`,
    pipeline: Math.round(leadsPerMonth * (m + 1) * avgDeal * 0.08 * 0.22),
    cost: monthlyFee * (m + 1),
  }));

  const MARKET_FACTS = [
    { stat: "$2.48B",  label: "Healthcare WFM market size in 2025",              sub: "Growing to $5.20B by 2034 — 8.6% CAGR" },
    { stat: "$66K",    label: "Savings per position: staff RN vs travel RN",     sub: "NSI: $189K travel vs $123K staff — per year, per nurse" },
    { stat: "53%",     label: "Shift cost reduction with Beacon",                sub: "$5,100 → $2,424 per shift — proven at Advocate Health" },
    { stat: "$8.9B",   label: "US hospital travel nurse spend (2022)",           sub: "Still 2x pre-COVID levels — every CNO is under pressure to cut" },
    { stat: "92%",     label: "CNOs research WFM vendors anonymously online",    sub: "They visit 4–6 vendor sites before ever filling out a form" },
    { stat: "$200K",   label: "Avg Beacon ACV — regional health system",        sub: "500-bed system at $8/bed/month + implementation = $200K/yr" },
  ];

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-5" style={{ background: C.card, border: `2px solid ${C.teal}` }}>
        <SL color={C.teal}>90-DAY PILOT — PROVE IT BEFORE YOU SCALE IT</SL>
        <div className="text-lg font-black mb-1" style={{ color: C.white }}>Start at $8K–$12K/Month. One Health System Pays for the Year.</div>
        <div className="text-sm leading-relaxed mb-4" style={{ color: C.muted }}>
          Healthcare B2B has long sales cycles — 6 to 18 months from first touch to signed contract. The right move is a{" "}
          <span style={{ color: C.teal, fontWeight: 900 }}>90-day pilot</span> that proves pipeline before scaling spend.
          SiteID delivers value in week one — you see exactly which CNOs are on your site before a single deal closes.
        </div>

        {/* 90-day pilot callout */}
        <div className="rounded-xl p-3 mb-4" style={{ background: `${C.teal}12`, border: `1px solid ${C.teal}30` }}>
          <div className="text-xs font-black mb-1" style={{ color: C.teal }}>WHY 90 DAYS FIRST</div>
          <div className="text-xs leading-relaxed" style={{ color: C.white }}>
            90 days is enough to: (1) identify 80–120 health systems actively evaluating WFM platforms, (2) surface 6–10 CNO/VP Nursing direct contacts, (3) book 3–6 demos, and (4) get 1–2 deals into late-stage pipeline. One Beacon deal at $200K pays for <span style={{ color: C.gold, fontWeight: 900 }}>20 months</span> of the pilot fee.
          </div>
        </div>

        {/* Monthly fee slider */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span style={{ color: C.muted }}>MONTHLY PILOT FEE</span>
            <span className="font-black" style={{ color: tierLabel.color }}>{tierLabel.label} — ${monthlyFee.toLocaleString()}/mo</span>
          </div>
          <input type="range" min={8000} max={12000} step={500} value={monthlyFee}
            onChange={e => setMonthlyFee(Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, ${C.teal} 0%, ${C.orange} ${((monthlyFee - 8000) / 4000) * 100}%, ${C.border} ${((monthlyFee - 8000) / 4000) * 100}%)` }} />
          <div className="flex justify-between text-xs mt-1" style={{ color: C.muted }}>
            <span>$8K/mo</span><span>$12K/mo</span>
          </div>
          <div className="text-xs mt-1 text-center font-black" style={{ color: C.muted }}>
            90-day pilot total: <span style={{ color: C.white }}>${pilotCost.toLocaleString()}</span>
          </div>
        </div>

        {/* Avg deal slider */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span style={{ color: C.muted }}>AVG BEACON DEAL SIZE</span>
            <span className="font-black" style={{ color: C.teal }}>${avgDeal.toLocaleString()}/yr</span>
          </div>
          <input type="range" min={150000} max={400000} step={10000} value={avgDeal}
            onChange={e => setAvgDeal(Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, ${C.teal} 0%, ${C.teal} ${((avgDeal - 150000) / 250000) * 100}%, ${C.border} ${((avgDeal - 150000) / 250000) * 100}%)` }} />
          <div className="flex justify-between text-xs mt-1" style={{ color: C.muted }}>
            <span>$150K</span><span>$400K</span>
          </div>
        </div>

        {/* 90-day KPI grid */}
        <div className="text-xs font-black mb-2" style={{ color: C.muted }}>90-DAY PILOT RESULTS</div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Health Systems Identified", value: pilotLeads, color: C.teal },
            { label: "Demos Booked", value: pilotDemos, color: C.orange },
            { label: "Deals in Pipeline", value: pilotDeals, color: C.gold },
          ].map((k, i) => (
            <div key={i} className="rounded-xl p-3 text-center" style={{ background: C.card2, border: `1px solid ${C.border}` }}>
              <div className="text-2xl font-black" style={{ color: k.color }}>{k.value}</div>
              <div className="text-xs mt-1" style={{ color: C.muted }}>{k.label}</div>
            </div>
          ))}
        </div>

        {/* Revenue summary */}
        <div className="mt-4 rounded-xl p-4" style={{ background: `${C.orange}10`, border: `1px solid ${C.orange}25` }}>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-xl font-black" style={{ background: C.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                ${(annualRevenue / 1000).toFixed(0)}K
              </div>
              <div className="text-xs" style={{ color: C.muted }}>Annualized ARR</div>
            </div>
            <div>
              <div className="text-xl font-black" style={{ background: C.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {roiMultiple}x
              </div>
              <div className="text-xs" style={{ color: C.muted }}>Annual ROI Multiple</div>
            </div>
            <div>
              <div className="text-xl font-black" style={{ background: C.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {payback}mo
              </div>
              <div className="text-xs" style={{ color: C.muted }}>Payback Period</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Projection chart */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <SL color={C.teal}>90-DAY PILOT — PIPELINE BUILD TRAJECTORY</SL>
        <div className="text-xs mb-3" style={{ color: C.muted }}>Pipeline value building vs. cumulative pilot cost over 3 months</div>
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={projectionData} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="lhRevGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={C.orange} stopOpacity={0.35} />
                <stop offset="95%" stopColor={C.orange} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" tick={{ fill: C.muted, fontSize: 9 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: C.muted, fontSize: 9 }} axisLine={false} tickLine={false}
              tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} />
            <Tooltip contentStyle={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 8, color: C.white, fontSize: 11 }}
              formatter={(v: number) => [`$${v.toLocaleString()}`, ""]} />
            <Area type="monotone" dataKey="pipeline" stroke={C.orange} strokeWidth={2} fill="url(#lhRevGrad)" name="Pipeline Value" />
            <Line type="monotone" dataKey="cost" stroke={C.tealDim} strokeWidth={1.5} strokeDasharray="4 3" dot={false} name="Pilot Cost" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Market facts */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <SL color={C.gold}>MARKET INTELLIGENCE — THE NUMBERS BEHIND THE PITCH</SL>
        <div className="grid grid-cols-2 gap-3">
          {MARKET_FACTS.map((f, i) => (
            <div key={i} className="rounded-xl p-3" style={{ background: C.card2, border: `1px solid ${C.border}` }}>
              <div className="text-xl font-black mb-0.5" style={{ background: C.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{f.stat}</div>
              <div className="text-xs font-black mb-0.5" style={{ color: C.white }}>{f.label}</div>
              <div className="text-xs" style={{ color: C.muted }}>{f.sub}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* One account math */}
      <div className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <SL color={C.gold}>THE MATH ON ONE ACCOUNT</SL>
        <div className="text-sm leading-relaxed" style={{ color: C.muted }}>
          If Litehouse closes just <span style={{ color: C.orange, fontWeight: 900 }}>one new health system relationship</span> worth $200K/year from a lead generated by Exact Audience, the platform has paid for itself entirely — and that's before the marketplace revenue kicks in. Every additional hospital is pure margin.
        </div>
        <div className="mt-3 rounded-xl p-3 text-xs italic" style={{ background: `${C.teal}10`, border: `1px solid ${C.teal}20`, color: C.teal }}>
          "We identified Froedtert Health's VP of Nursing visiting the Beacon page 7 times. We called on Monday. Demo was Thursday. That one account is worth more than the entire annual platform fee." — How the conversation should end.
        </div>
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
        <div className="flex items-center justify-between mb-1">
          <SL>EXACT AUDIENCE — WEEK OF JULY 14, 2026</SL>
          <div className="flex items-center gap-1.5 text-xs font-black" style={{ color: C.teal }}>
            <div className="w-2 h-2 rounded-full" style={{ background: C.teal, animation: "pulse-dot 2s infinite" }} />
            LIVE
          </div>
        </div>
        <div className="text-lg font-black mb-1" style={{ color: C.white }}>8 Active Targets — National Health System Market</div>
        <div className="text-sm" style={{ color: C.muted }}>
          Health systems actively evaluating workforce management platforms right now. Ranked by intent score. CNO and VP Nursing contact included.
        </div>
      </motion.div>

      {TARGET_POOL.map((t, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
          className="rounded-2xl overflow-hidden cursor-pointer"
          style={{ background: C.card, border: `1px solid ${C.border}` }}
          onClick={() => setSelected(selected === i ? null : i)}>

          <div className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="font-black" style={{ color: C.white }}>{t.org}</div>
                <div className="text-xs mt-0.5" style={{ color: C.muted }}>{t.type} · {t.city}, {t.state} · {t.beds.toLocaleString()} beds</div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-2xl font-black" style={{ color: t.intensity >= 90 ? C.orange : t.intensity >= 80 ? C.gold : C.teal }}>{t.intensity}</div>
                <div className="text-xs" style={{ color: C.muted }}>intent</div>
              </div>
            </div>

            <div className="mt-2 flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded-full text-xs font-black"
                style={{ background: `${C.orange}20`, color: C.orange, border: `1px solid ${C.orange}40` }}>
                {t.signal}
              </span>
              <span className="text-xs" style={{ color: C.muted }}>{t.weeks}w signal</span>
              <span className="text-xs font-black" style={{ color: t.trend === "rising" ? C.teal : t.trend === "new" ? C.gold : C.muted }}>
                {t.trend === "rising" ? "↑ Rising" : t.trend === "new" ? "★ New" : "→ Steady"}
              </span>
            </div>

            <div className="flex items-center justify-between mt-3">
              <div className="text-xs" style={{ color: C.muted }}>
                <span style={{ color: C.white }}>{t.contact.name}</span> · {t.contact.title}
              </div>
              <Sparkline data={t.sparkline} color={t.intensity >= 85 ? C.orange : C.teal} />
            </div>

            <div className="flex flex-wrap gap-1 mt-2">
              {t.tags.map((tag, j) => (
                <span key={j} className="px-1.5 py-0.5 rounded text-xs"
                  style={{ background: `${C.teal}12`, color: C.teal }}>{tag}</span>
              ))}
            </div>
          </div>

          <AnimatePresence>
            {selected === i && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
                onClick={e => e.stopPropagation()}>
                <div className="px-4 pb-4 space-y-3" style={{ borderTop: `1px solid ${C.border}` }}>

                  <div className="pt-3 rounded-xl p-3 text-xs italic leading-relaxed"
                    style={{ background: `${C.orange}10`, border: `1px solid ${C.orange}25`, color: C.orange }}>
                    {t.activitySummary}
                  </div>

                  <div>
                    <div className="text-xs font-black mb-2" style={{ color: C.teal }}>BEHAVIORAL SIGNALS DETECTED</div>
                    <div className="space-y-1">
                      {t.signals.map((sig, j) => (
                        <div key={j} className="flex items-start gap-2 text-xs" style={{ color: C.muted }}>
                          <span style={{ color: C.teal }}>◆</span>{sig}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-black mb-2" style={{ color: C.orange }}>DECISION-MAKER CONTACT RECORD</div>
                    <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
                      {[
                        ["Name", t.contact.name],
                        ["Title", t.contact.title],
                        ["Phone", t.contact.phone],
                        ["Email", t.contact.email],
                        ["LinkedIn", t.contact.linkedin || "—"],
                        ["Address", t.contact.address ? `${t.contact.address}, ${t.contact.city}, ${t.contact.state}` : `${t.city}, ${t.state}`],
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
                      <div className="text-xs font-black mb-2" style={{ color: C.gold }}>SECONDARY CONTACT</div>
                      <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
                        {[
                          ["Name", t.contact2.name],
                          ["Title", t.contact2.title],
                          ["Phone", t.contact2.phone],
                          ["Email", t.contact2.email],
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
                    <div className="text-xs font-black mb-1" style={{ color: C.orange }}>MULTI-CHANNEL OUTREACH — PERSONALIZED TO {t.contact.name.toUpperCase()}</div>
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
const SEARCH_POOL: TargetEntry[] = [
  ...TARGET_POOL,
  {
    org: "Sanford Health", type: "Health System",
    city: "Sioux Falls", state: "SD", beds: 2800,
    signal: "Workforce Management Platform Evaluation", intensity: 79, weeks: 3,
    contact: { name: "Erica DeBoer", title: "Chief Nursing Officer", phone: "(605) 333-1000", email: "e.deboer@sanfordhealth.org", linkedin: "linkedin.com/in/erica-deboer-sanford", address: "1305 W 18th St", city: "Sioux Falls", state: "SD" },
    tags: ["Health System", "Regional", "Midwest"],
    signals: ["Viewed Beacon product page", "Researched float pool optimization", "Visited Litehouse clinician marketplace"],
    surgeTopics: ["Float pool", "Internal staffing", "Marketplace"],
    activitySummary: "Sanford Health CNO evaluating workforce management platforms for rural health system optimization.",
    trend: "steady", sparkline: [40, 48, 55, 60, 65, 70, 75, 79],
  },
  {
    org: "Geisinger Health System", type: "Health System",
    city: "Danville", state: "PA", beds: 1900,
    signal: "Travel Nurse Reduction + Internal PRN Build", intensity: 74, weeks: 2,
    contact: { name: "Jaewon Ryu", title: "President & CEO", phone: "(570) 271-6211", email: "j.ryu@geisinger.edu", linkedin: "linkedin.com/in/jaewon-ryu-geisinger", address: "100 N Academy Ave", city: "Danville", state: "PA" },
    contact2: { name: "Susan Robel", title: "Chief Nursing Officer", phone: "(570) 271-6000", email: "s.robel@geisinger.edu" },
    tags: ["Health System", "Academic", "Northeast"],
    signals: ["Researched internal PRN development", "Viewed Beacon EOR model", "Downloaded AONL staffing report"],
    surgeTopics: ["PRN development", "EOR model", "Staffing optimization"],
    activitySummary: "Geisinger leadership evaluating Beacon for internal PRN pool development to reduce travel nurse dependency.",
    trend: "new", sparkline: [20, 30, 42, 52, 60, 66, 71, 74],
  },
  {
    org: "Spectrum Health", type: "Health System",
    city: "Grand Rapids", state: "MI", beds: 2100,
    signal: "Shift Allocation Automation Research", intensity: 71, weeks: 3,
    contact: { name: "Tina Freese Decker", title: "President & CEO", phone: "(616) 391-1774", email: "t.freedecker@spectrumhealth.org", linkedin: "linkedin.com/in/tina-freese-decker", address: "100 Michigan St NE", city: "Grand Rapids", state: "MI" },
    tags: ["Health System", "Regional", "Midwest"],
    signals: ["Viewed Beacon shift allocation features", "Researched UKG integration options", "Visited Litehouse about page"],
    surgeTopics: ["Shift automation", "UKG integration", "Cost reduction"],
    activitySummary: "Spectrum Health operations team researching shift allocation automation — Beacon's UKG integration is a direct fit.",
    trend: "steady", sparkline: [35, 42, 50, 56, 61, 65, 68, 71],
  },
  // ── Oklahoma ──────────────────────────────────────────────────────────────
  {
    org: "INTEGRIS Health", type: "Health System",
    city: "Oklahoma City", state: "OK", beds: 3200,
    signal: "Travel Nurse Cost Reduction Initiative", intensity: 83, weeks: 4,
    contact: { name: "Timothy Pehrson", title: "President & CEO", phone: "(405) 951-2000", email: "t.pehrson@integrishealth.com", linkedin: "linkedin.com/in/timothy-pehrson", address: "3300 NW Expressway", city: "Oklahoma City", state: "OK" },
    contact2: { name: "Sherri Carr", title: "Chief Nursing Officer", phone: "(405) 951-2100", email: "s.carr@integrishealth.com" },
    tags: ["Health System", "Regional", "South Central"],
    signals: ["Viewed Beacon travel nurse reduction case study", "Researched internal float pool build", "Compared Litehouse vs ShiftMed pricing"],
    surgeTopics: ["Travel nurse reduction", "Float pool", "Cost per shift"],
    activitySummary: "INTEGRIS CNO actively evaluating platforms to cut $4.2M in annual travel nurse spend — Beacon's marketplace model is a direct fit.",
    trend: "rising", sparkline: [30, 40, 52, 60, 68, 74, 79, 83],
  },
  {
    org: "OU Health", type: "Academic Medical Center",
    city: "Oklahoma City", state: "OK", beds: 1200,
    signal: "Workforce Scheduling Platform Evaluation", intensity: 76, weeks: 2,
    contact: { name: "Chuck Spicer", title: "President & CEO", phone: "(405) 271-4700", email: "c.spicer@ouhealth.com", linkedin: "linkedin.com/in/chuck-spicer-ouhealth", address: "700 NE 13th St", city: "Oklahoma City", state: "OK" },
    contact2: { name: "Kelli Whittington", title: "Chief Nursing Officer", phone: "(405) 271-5911", email: "k.whittington@ouhealth.com" },
    tags: ["Academic Medical Center", "Teaching Hospital", "South Central"],
    signals: ["Researched workforce scheduling platforms", "Viewed Beacon EHR integration page", "Downloaded AONL workforce report"],
    surgeTopics: ["Scheduling automation", "EHR integration", "Staffing efficiency"],
    activitySummary: "OU Health operations team evaluating scheduling platforms — Beacon's Epic integration and shift automation are key differentiators.",
    trend: "new", sparkline: [20, 32, 44, 54, 62, 68, 72, 76],
  },
  {
    org: "Saint Francis Health System", type: "Health System",
    city: "Tulsa", state: "OK", beds: 1800,
    signal: "Internal PRN Pool Development", intensity: 69, weeks: 3,
    contact: { name: "Jake Henry Jr.", title: "President & CEO", phone: "(918) 494-2200", email: "j.henry@saintfrancis.com", linkedin: "linkedin.com/in/jake-henry-saintfrancis", address: "6161 S Yale Ave", city: "Tulsa", state: "OK" },
    tags: ["Health System", "Regional", "South Central"],
    signals: ["Viewed Litehouse clinician marketplace", "Researched PRN pool best practices", "Compared Beacon vs Symplr"],
    surgeTopics: ["PRN pool", "Internal staffing", "Marketplace"],
    activitySummary: "Saint Francis HR leadership building internal PRN pool to reduce agency dependency — Litehouse marketplace is a direct pipeline.",
    trend: "steady", sparkline: [38, 45, 52, 57, 61, 64, 67, 69],
  },
  // ── Kansas ────────────────────────────────────────────────────────────────
  {
    org: "The University of Kansas Health System", type: "Academic Medical Center",
    city: "Kansas City", state: "KS", beds: 1000,
    signal: "Staffing Optimization Platform Search", intensity: 78, weeks: 3,
    contact: { name: "Bob Page", title: "President & CEO", phone: "(913) 588-5000", email: "r.page@kumed.com", linkedin: "linkedin.com/in/bob-page-kumed", address: "4000 Cambridge St", city: "Kansas City", state: "KS" },
    contact2: { name: "Tammy Peterman", title: "Chief Nursing Officer", phone: "(913) 588-1227", email: "t.peterman@kumed.com" },
    tags: ["Academic Medical Center", "Teaching Hospital", "Midwest"],
    signals: ["Researched staffing optimization platforms", "Viewed Beacon float pool features", "Visited Litehouse about page"],
    surgeTopics: ["Float pool", "Staffing optimization", "Cost reduction"],
    activitySummary: "KU Health System CNO evaluating workforce platforms — Beacon's academic medical center case studies are resonating.",
    trend: "rising", sparkline: [28, 38, 50, 58, 65, 70, 74, 78],
  },
  // ── Nebraska ──────────────────────────────────────────────────────────────
  {
    org: "Nebraska Medicine", type: "Academic Medical Center",
    city: "Omaha", state: "NE", beds: 900,
    signal: "Travel Nurse Spend Reduction", intensity: 72, weeks: 2,
    contact: { name: "James Linder", title: "CEO", phone: "(402) 552-2000", email: "j.linder@nebraskamed.com", linkedin: "linkedin.com/in/james-linder-nebraskamed", address: "987 S 72nd St", city: "Omaha", state: "NE" },
    tags: ["Academic Medical Center", "Teaching Hospital", "Midwest"],
    signals: ["Viewed Beacon travel nurse reduction ROI calculator", "Researched EOR staffing models", "Compared Litehouse vs Aya Healthcare"],
    surgeTopics: ["Travel nurse reduction", "EOR model", "Cost per shift"],
    activitySummary: "Nebraska Medicine CFO and CNO aligned on reducing $2.8M travel nurse budget — Beacon's EOR model is under active evaluation.",
    trend: "new", sparkline: [22, 34, 46, 55, 62, 66, 69, 72],
  },
  // ── Iowa ──────────────────────────────────────────────────────────────────
  {
    org: "UnityPoint Health", type: "Health System",
    city: "Des Moines", state: "IA", beds: 4200,
    signal: "Workforce Management Platform Evaluation", intensity: 81, weeks: 4,
    contact: { name: "Clay Holderman", title: "President & CEO", phone: "(515) 241-6212", email: "c.holderman@unitypoint.org", linkedin: "linkedin.com/in/clay-holderman-unitypoint", address: "1776 West Lakes Pkwy", city: "West Des Moines", state: "IA" },
    contact2: { name: "Pamela Delagardelle", title: "Chief Nursing Officer", phone: "(515) 241-6000", email: "p.delagardelle@unitypoint.org" },
    tags: ["Health System", "Regional", "Midwest"],
    signals: ["Viewed Beacon workforce management overview", "Researched shift allocation automation", "Downloaded Litehouse shift cost calculator"],
    surgeTopics: ["Workforce management", "Shift automation", "Float pool"],
    activitySummary: "UnityPoint Health CNO evaluating Beacon for system-wide workforce management across 40+ facilities in Iowa, Illinois, and Wisconsin.",
    trend: "rising", sparkline: [32, 42, 54, 62, 69, 74, 78, 81],
  },
  // ── Texas ─────────────────────────────────────────────────────────────────
  {
    org: "Baylor Scott & White Health", type: "Health System",
    city: "Dallas", state: "TX", beds: 6800,
    signal: "Enterprise Staffing Platform RFP", intensity: 91, weeks: 5,
    contact: { name: "Pete McCanna", title: "President & CEO", phone: "(214) 820-0111", email: "p.mccanna@bswhealth.org", linkedin: "linkedin.com/in/pete-mccanna-bsw", address: "2001 Bryan St", city: "Dallas", state: "TX" },
    contact2: { name: "Nate Spell", title: "Chief Nursing Officer", phone: "(214) 820-3151", email: "n.spell@bswhealth.org" },
    contact3: { name: "Michael Sanborn", title: "CFO", phone: "(214) 820-0222", email: "m.sanborn@bswhealth.org" },
    tags: ["Health System", "Large System", "South Central"],
    signals: ["Issued enterprise staffing platform RFP", "Viewed Beacon enterprise features", "Researched Litehouse marketplace scale", "Compared Beacon vs UKG Workforce Central"],
    surgeTopics: ["Enterprise staffing", "RFP evaluation", "System-wide deployment"],
    activitySummary: "BSW Health issued a formal RFP for enterprise staffing platform — Beacon is on the shortlist. Decision expected Q3 2026.",
    trend: "rising", sparkline: [50, 60, 70, 76, 82, 86, 89, 91],
  },
  {
    org: "Memorial Hermann Health System", type: "Health System",
    city: "Houston", state: "TX", beds: 5200,
    signal: "Float Pool Optimization Initiative", intensity: 84, weeks: 3,
    contact: { name: "David Callender", title: "President & CEO", phone: "(713) 242-2700", email: "d.callender@memorialhermann.org", linkedin: "linkedin.com/in/david-callender-memorialhermann", address: "929 Gessner Rd", city: "Houston", state: "TX" },
    contact2: { name: "Erin Denholm", title: "Chief Nursing Officer", phone: "(713) 242-2800", email: "e.denholm@memorialhermann.org" },
    contact3: { name: "Lance Renfrow", title: "CFO", phone: "(713) 242-2900", email: "l.renfrow@memorialhermann.org" },
    tags: ["Health System", "Large System", "South Central"],
    signals: ["Viewed Beacon float pool optimization case study", "Researched internal PRN marketplace", "Visited Litehouse clinician onboarding page"],
    surgeTopics: ["Float pool", "PRN marketplace", "Clinician onboarding"],
    activitySummary: "Memorial Hermann CNO leading float pool optimization project — Litehouse marketplace is a direct fit for their local W2 clinician pipeline.",
    trend: "steady", sparkline: [42, 52, 62, 68, 73, 77, 81, 84],
  },
  // ── Colorado ──────────────────────────────────────────────────────────────
  {
    org: "UCHealth", type: "Health System",
    city: "Aurora", state: "CO", beds: 3800,
    signal: "Workforce Technology Stack Modernization", intensity: 77, weeks: 3,
    contact: { name: "Elizabeth Concordia", title: "President & CEO", phone: "(720) 848-0000", email: "e.concordia@uchealth.org", linkedin: "linkedin.com/in/elizabeth-concordia-uchealth", address: "12605 E 16th Ave", city: "Aurora", state: "CO" },
    contact2: { name: "Teri Lura", title: "Chief Nursing Officer", phone: "(720) 848-1000", email: "t.lura@uchealth.org" },
    tags: ["Health System", "Academic", "Mountain West"],
    signals: ["Researched workforce technology modernization", "Viewed Beacon API integration docs", "Compared Litehouse vs QGenda"],
    surgeTopics: ["Tech modernization", "API integration", "Scheduling automation"],
    activitySummary: "UCHealth CIO and CNO co-leading workforce tech modernization — Beacon's API-first architecture is a key differentiator.",
    trend: "new", sparkline: [25, 36, 48, 57, 63, 68, 73, 77],
  },
  // ── Georgia ───────────────────────────────────────────────────────────────
  {
    org: "Piedmont Healthcare", type: "Health System",
    city: "Atlanta", state: "GA", beds: 4500,
    signal: "Travel Nurse Dependency Reduction", intensity: 86, weeks: 4,
    contact: { name: "Kevin Brown", title: "President & CEO", phone: "(404) 425-1000", email: "k.brown@piedmont.org", linkedin: "linkedin.com/in/kevin-brown-piedmont", address: "1800 Howell Mill Rd NW", city: "Atlanta", state: "GA" },
    contact2: { name: "Leslie Donahue", title: "Chief Nursing Officer", phone: "(404) 425-1100", email: "l.donahue@piedmont.org" },
    tags: ["Health System", "Large System", "Southeast"],
    signals: ["Viewed Beacon travel nurse reduction ROI", "Researched Litehouse W2 marketplace model", "Downloaded shift cost comparison tool"],
    surgeTopics: ["Travel nurse reduction", "W2 marketplace", "Shift cost"],
    activitySummary: "Piedmont Healthcare CNO targeting 40% reduction in travel nurse spend by Q4 2026 — Beacon's marketplace model is under active evaluation.",
    trend: "rising", sparkline: [38, 50, 62, 70, 76, 80, 83, 86],
  },
  // ── Florida ───────────────────────────────────────────────────────────────
  {
    org: "AdventHealth", type: "Health System",
    city: "Altamonte Springs", state: "FL", beds: 8900,
    signal: "System-Wide Staffing Platform Evaluation", intensity: 88, weeks: 5,
    contact: { name: "Terry Shaw", title: "President & CEO", phone: "(407) 357-1000", email: "t.shaw@adventhealth.com", linkedin: "linkedin.com/in/terry-shaw-adventhealth", address: "900 Hope Way", city: "Altamonte Springs", state: "FL" },
    contact2: { name: "Kathleen Vollman", title: "Chief Nursing Officer", phone: "(407) 357-1100", email: "k.vollman@adventhealth.com" },
    tags: ["Health System", "Large System", "Southeast"],
    signals: ["Viewed Beacon system-wide deployment case study", "Researched Litehouse marketplace scale", "Compared Beacon vs Symplr workforce"],
    surgeTopics: ["System-wide deployment", "Marketplace scale", "Workforce management"],
    activitySummary: "AdventHealth CNO evaluating Beacon for system-wide deployment across 50+ facilities — scale and integration depth are the deciding factors.",
    trend: "rising", sparkline: [45, 56, 66, 73, 78, 82, 85, 88],
  },
  // ── Minnesota ─────────────────────────────────────────────────────────────
  {
    org: "Allina Health", type: "Health System",
    city: "Minneapolis", state: "MN", beds: 3100,
    signal: "Internal Staffing Marketplace Build", intensity: 75, weeks: 2,
    contact: { name: "Penny Wheeler", title: "President & CEO", phone: "(612) 262-5000", email: "p.wheeler@allinahealth.org", linkedin: "linkedin.com/in/penny-wheeler-allina", address: "2925 Chicago Ave", city: "Minneapolis", state: "MN" },
    contact2: { name: "Corrine Haviley", title: "Chief Nursing Officer", phone: "(612) 262-5100", email: "c.haviley@allinahealth.org" },
    tags: ["Health System", "Regional", "Midwest"],
    signals: ["Researched internal staffing marketplace models", "Viewed Litehouse EOR model", "Visited Beacon clinician onboarding page"],
    surgeTopics: ["Internal marketplace", "EOR model", "Clinician onboarding"],
    activitySummary: "Allina Health CNO building internal staffing marketplace — Litehouse's W2 EOR model is the exact structure they're evaluating.",
    trend: "new", sparkline: [24, 36, 48, 57, 63, 68, 71, 75],
  },
  // ── Indiana ───────────────────────────────────────────────────────────────
  {
    org: "Indiana University Health", type: "Health System",
    city: "Indianapolis", state: "IN", beds: 3600,
    signal: "Workforce Optimization Platform RFP", intensity: 82, weeks: 4,
    contact: { name: "Dennis Murphy", title: "President & CEO", phone: "(317) 962-2000", email: "d.murphy@iuhealth.org", linkedin: "linkedin.com/in/dennis-murphy-iuhealth", address: "340 W 10th St", city: "Indianapolis", state: "IN" },
    contact2: { name: "Sherri Stahl", title: "Chief Nursing Officer", phone: "(317) 962-2100", email: "s.stahl@iuhealth.org" },
    tags: ["Health System", "Academic", "Midwest"],
    signals: ["Issued workforce optimization RFP", "Viewed Beacon enterprise deployment guide", "Researched Litehouse marketplace volume"],
    surgeTopics: ["Workforce optimization", "Enterprise deployment", "Marketplace volume"],
    activitySummary: "IU Health issued a workforce optimization RFP — Beacon is being evaluated alongside UKG and Symplr. Decision expected Q3 2026.",
    trend: "rising", sparkline: [36, 48, 58, 66, 72, 76, 79, 82],
  },
  // ── Tennessee ─────────────────────────────────────────────────────────────
  {
    org: "Vanderbilt University Medical Center", type: "Academic Medical Center",
    city: "Nashville", state: "TN", beds: 1000,
    signal: "Internal Float Pool Expansion", intensity: 88, weeks: 4,
    contact: { name: "C. Wright Pinson", title: "Chief Nursing Officer", phone: "(615) 322-5000", email: "c.pinson@vumc.org", linkedin: "linkedin.com/in/wright-pinson-vumc", address: "1211 Medical Center Dr", city: "Nashville", state: "TN" },
    contact2: { name: "Cecelia Moore", title: "CFO", phone: "(615) 322-5100", email: "c.moore@vumc.org" },
    contact3: { name: "Pam Jones", title: "VP of Nursing Operations", phone: "(615) 322-5200", email: "p.jones@vumc.org" },
    tags: ["Academic Medical Center", "Research", "Mid-South"],
    signals: ["Viewed Beacon float pool features", "Researched internal PRN development", "Visited Litehouse marketplace page"],
    surgeTopics: ["Float pool expansion", "PRN development", "Shift cost reduction"],
    activitySummary: "VUMC nursing leadership evaluating Beacon for float pool expansion across Nashville campus.",
    trend: "rising", sparkline: [50, 60, 68, 74, 79, 83, 86, 88],
  },
  {
    org: "Erlanger Health System", type: "Health System",
    city: "Chattanooga", state: "TN", beds: 975,
    signal: "Travel Nurse Cost Reduction Initiative", intensity: 79, weeks: 3,
    contact: { name: "Stephanie Duggan", title: "Chief Nursing Officer", phone: "(423) 778-7000", email: "s.duggan@erlanger.org", linkedin: "linkedin.com/in/stephanie-duggan-erlanger", address: "975 E 3rd St", city: "Chattanooga", state: "TN" },
    contact2: { name: "Kevin Spiegel", title: "CFO", phone: "(423) 778-7100", email: "k.spiegel@erlanger.org" },
    contact3: { name: "Marcus Doyle", title: "VP of Human Resources", phone: "(423) 778-7200", email: "m.doyle@erlanger.org" },
    tags: ["Health System", "Regional", "Mid-South"],
    signals: ["Researched travel nurse alternatives", "Viewed Beacon shift allocation waterfall", "Downloaded AONL staffing benchmarks"],
    surgeTopics: ["Travel nurse reduction", "Shift allocation", "Internal staffing"],
    activitySummary: "Erlanger CNO team actively sourcing a travel nurse reduction strategy — Beacon's internal-first model is a direct fit.",
    trend: "rising", sparkline: [40, 50, 58, 64, 70, 74, 77, 79],
  },
  // ── Illinois ──────────────────────────────────────────────────────────────
  {
    org: "Northwestern Medicine", type: "Health System",
    city: "Chicago", state: "IL", beds: 1600,
    signal: "Workforce Management Platform Evaluation", intensity: 86, weeks: 4,
    contact: { name: "Cynthia Barnard", title: "Chief Nursing Officer", phone: "(312) 926-2000", email: "c.barnard@nm.org", linkedin: "linkedin.com/in/cynthia-barnard-nm", address: "251 E Huron St", city: "Chicago", state: "IL" },
    contact2: { name: "James Garofalo", title: "CFO", phone: "(312) 926-2100", email: "j.garofalo@nm.org" },
    contact3: { name: "Theresa Fitzsimmons", title: "VP of Nursing Operations", phone: "(312) 926-2200", email: "t.fitzsimmons@nm.org" },
    tags: ["Health System", "Academic", "Midwest"],
    signals: ["Evaluated workforce management platforms", "Viewed Beacon analytics dashboard", "Researched Litehouse EOR model"],
    surgeTopics: ["Workforce management", "Analytics", "EOR model"],
    activitySummary: "Northwestern Medicine nursing ops evaluating Beacon for system-wide workforce management — strong analytics and EOR model interest.",
    trend: "rising", sparkline: [48, 58, 66, 72, 77, 81, 84, 86],
  },
  {
    org: "Rush University Medical Center", type: "Academic Medical Center",
    city: "Chicago", state: "IL", beds: 671,
    signal: "Internal PRN Pool Build", intensity: 77, weeks: 3,
    contact: { name: "Shafiq Rab", title: "Chief Nursing Officer", phone: "(312) 942-5000", email: "s.rab@rush.edu", linkedin: "linkedin.com/in/shafiq-rab-rush", address: "1620 W Harrison St", city: "Chicago", state: "IL" },
    contact2: { name: "Chantal Vella", title: "CFO", phone: "(312) 942-5100", email: "c.vella@rush.edu" },
    contact3: { name: "Karen Dunn Navarra", title: "VP of Nursing Operations", phone: "(312) 942-5200", email: "k.navarra@rush.edu" },
    tags: ["Academic Medical Center", "Research", "Midwest"],
    signals: ["Researched internal PRN pool development", "Viewed Beacon marketplace features", "Visited Litehouse clinician onboarding page"],
    surgeTopics: ["Internal PRN", "Marketplace", "Clinician onboarding"],
    activitySummary: "Rush University Medical Center building internal PRN pool — Beacon's marketplace and credentialing automation are directly relevant.",
    trend: "steady", sparkline: [42, 50, 57, 62, 66, 70, 74, 77],
  },
  // ── Ohio ──────────────────────────────────────────────────────────────────
  {
    org: "Cleveland Clinic", type: "Health System",
    city: "Cleveland", state: "OH", beds: 1400,
    signal: "Enterprise Staffing Platform RFI", intensity: 90, weeks: 5,
    contact: { name: "Kelly Hancock", title: "Chief Nursing Officer", phone: "(216) 444-2200", email: "k.hancock@ccf.org", linkedin: "linkedin.com/in/kelly-hancock-clevelandclinic", address: "9500 Euclid Ave", city: "Cleveland", state: "OH" },
    contact2: { name: "Steven Glass", title: "CFO", phone: "(216) 444-2300", email: "s.glass@ccf.org" },
    contact3: { name: "Meredith Foxx", title: "Chief People Officer", phone: "(216) 444-2400", email: "m.foxx@ccf.org" },
    tags: ["Health System", "Academic", "Midwest", "Fortune 500"],
    signals: ["Issued enterprise staffing platform RFI", "Viewed Beacon enterprise deployment guide", "Researched Litehouse marketplace scale", "Compared Beacon vs Symplr"],
    surgeTopics: ["Enterprise staffing", "RFI evaluation", "System-wide deployment"],
    activitySummary: "Cleveland Clinic issued a formal RFI for enterprise staffing platform — Beacon is on the evaluation list alongside Symplr and UKG.",
    trend: "rising", sparkline: [55, 63, 70, 76, 81, 85, 88, 90],
  },
  {
    org: "University Hospitals", type: "Health System",
    city: "Cleveland", state: "OH", beds: 1032,
    signal: "Float Pool Automation Initiative", intensity: 81, weeks: 3,
    contact: { name: "Nora Triola", title: "Chief Nursing Officer", phone: "(216) 844-1000", email: "n.triola@uhhospitals.org", linkedin: "linkedin.com/in/nora-triola-uh", address: "11100 Euclid Ave", city: "Cleveland", state: "OH" },
    contact2: { name: "Paul Hinchey", title: "CFO", phone: "(216) 844-1100", email: "p.hinchey@uhhospitals.org" },
    contact3: { name: "Gail Lovelace", title: "VP of Nursing Operations", phone: "(216) 844-1200", email: "g.lovelace@uhhospitals.org" },
    tags: ["Health System", "Academic", "Midwest"],
    signals: ["Researched float pool automation", "Viewed Beacon scheduling features", "Visited Litehouse marketplace page"],
    surgeTopics: ["Float pool", "Scheduling automation", "Marketplace"],
    activitySummary: "University Hospitals CNO team evaluating float pool automation — Beacon's internal-first scheduling model is a strong fit.",
    trend: "rising", sparkline: [44, 52, 60, 66, 71, 75, 78, 81],
  },
  // ── North Carolina ────────────────────────────────────────────────────────
  {
    org: "Atrium Health", type: "Health System",
    city: "Charlotte", state: "NC", beds: 1700,
    signal: "Travel Nurse Dependency Reduction", intensity: 87, weeks: 4,
    contact: { name: "Sherri Rausch", title: "Chief Nursing Officer", phone: "(704) 355-2000", email: "s.rausch@atriumhealth.org", linkedin: "linkedin.com/in/sherri-rausch-atrium", address: "1000 Blythe Blvd", city: "Charlotte", state: "NC" },
    contact2: { name: "Greg Gombar", title: "CFO", phone: "(704) 355-2100", email: "g.gombar@atriumhealth.org" },
    contact3: { name: "Phyllis Wingate", title: "VP of Nursing Operations", phone: "(704) 355-2200", email: "p.wingate@atriumhealth.org" },
    tags: ["Health System", "Large System", "Southeast"],
    signals: ["Researched travel nurse reduction strategies", "Viewed Beacon internal-first allocation", "Downloaded NSI staffing benchmarks"],
    surgeTopics: ["Travel nurse reduction", "Internal allocation", "Staffing benchmarks"],
    activitySummary: "Atrium Health CNO team actively reducing travel nurse dependency — Beacon's waterfall allocation model directly addresses their initiative.",
    trend: "rising", sparkline: [48, 57, 65, 71, 76, 80, 84, 87],
  },
  {
    org: "Duke University Health System", type: "Academic Medical Center",
    city: "Durham", state: "NC", beds: 957,
    signal: "Workforce Analytics Platform Search", intensity: 80, weeks: 3,
    contact: { name: "Mary Ann Fuchs", title: "Chief Nursing Officer", phone: "(919) 684-8111", email: "m.fuchs@duke.edu", linkedin: "linkedin.com/in/maryann-fuchs-duke", address: "2301 Erwin Rd", city: "Durham", state: "NC" },
    contact2: { name: "Kenneth Morris", title: "CFO", phone: "(919) 684-8200", email: "k.morris@duke.edu" },
    contact3: { name: "Lisa Pickett", title: "Chief People Officer", phone: "(919) 684-8300", email: "l.pickett@duke.edu" },
    tags: ["Academic Medical Center", "Research", "Southeast"],
    signals: ["Researched workforce analytics platforms", "Viewed Beacon Tableau integration", "Visited Litehouse analytics demo page"],
    surgeTopics: ["Workforce analytics", "Tableau integration", "Data-driven staffing"],
    activitySummary: "Duke Health nursing leadership evaluating workforce analytics platforms — Beacon's Tableau integration and real-time dashboards are a strong fit.",
    trend: "steady", sparkline: [44, 52, 59, 65, 69, 73, 77, 80],
  },
  // ── Washington ────────────────────────────────────────────────────────────
  {
    org: "UW Medicine", type: "Academic Medical Center",
    city: "Seattle", state: "WA", beds: 1200,
    signal: "Internal Staffing Platform Evaluation", intensity: 84, weeks: 4,
    contact: { name: "Liz Concordia", title: "Chief Nursing Officer", phone: "(206) 598-3300", email: "l.concordia@uwmedicine.org", linkedin: "linkedin.com/in/liz-concordia-uw", address: "1959 NE Pacific St", city: "Seattle", state: "WA" },
    contact2: { name: "Paul Hayes", title: "CFO", phone: "(206) 598-3400", email: "p.hayes@uwmedicine.org" },
    contact3: { name: "Cindy Hecker", title: "VP of Nursing Operations", phone: "(206) 598-3500", email: "c.hecker@uwmedicine.org" },
    tags: ["Academic Medical Center", "Research", "Pacific Northwest"],
    signals: ["Evaluated internal staffing platforms", "Viewed Beacon scheduling automation", "Researched Litehouse marketplace clinicians"],
    surgeTopics: ["Internal staffing", "Scheduling automation", "Clinician marketplace"],
    activitySummary: "UW Medicine nursing ops evaluating internal staffing platforms to reduce travel nurse reliance — Beacon's automation and marketplace are directly relevant.",
    trend: "rising", sparkline: [46, 55, 63, 69, 74, 78, 81, 84],
  },
  {
    org: "MultiCare Health System", type: "Health System",
    city: "Tacoma", state: "WA", beds: 1500,
    signal: "Float Pool Optimization + Marketplace", intensity: 76, weeks: 3,
    contact: { name: "Diane Cecchettini", title: "Chief Nursing Officer", phone: "(253) 403-1000", email: "d.cecchettini@multicare.org", linkedin: "linkedin.com/in/diane-cecchettini-multicare", address: "315 Martin Luther King Jr Way", city: "Tacoma", state: "WA" },
    contact2: { name: "Brett Callow", title: "CFO", phone: "(253) 403-1100", email: "b.callow@multicare.org" },
    contact3: { name: "Rhonda Haney", title: "VP of Human Resources", phone: "(253) 403-1200", email: "r.haney@multicare.org" },
    tags: ["Health System", "Regional", "Pacific Northwest"],
    signals: ["Researched float pool optimization", "Viewed Beacon marketplace features", "Downloaded AONL staffing templates"],
    surgeTopics: ["Float pool", "Marketplace", "Staffing templates"],
    activitySummary: "MultiCare CNO team optimizing float pool and exploring Litehouse marketplace for local W2 clinician sourcing.",
    trend: "steady", sparkline: [38, 47, 55, 61, 66, 70, 73, 76],
  },
  // ── Missouri ──────────────────────────────────────────────────────────────
  {
    org: "BJC HealthCare", type: "Health System",
    city: "St. Louis", state: "MO", beds: 3000,
    signal: "Enterprise WFM Platform Search", intensity: 85, weeks: 4,
    contact: { name: "Kimberly Russo", title: "Chief Nursing Officer", phone: "(314) 747-3000", email: "k.russo@bjc.org", linkedin: "linkedin.com/in/kimberly-russo-bjc", address: "4901 Forest Park Ave", city: "St. Louis", state: "MO" },
    contact2: { name: "Michael Lucido", title: "CFO", phone: "(314) 747-3100", email: "m.lucido@bjc.org" },
    contact3: { name: "Paula Friedman", title: "VP of Nursing Operations", phone: "(314) 747-3200", email: "p.friedman@bjc.org" },
    tags: ["Health System", "Academic", "Midwest"],
    signals: ["Researched enterprise WFM platforms", "Viewed Beacon vs UKG comparison", "Visited Litehouse EOR model page"],
    surgeTopics: ["Enterprise WFM", "UKG comparison", "EOR model"],
    activitySummary: "BJC HealthCare nursing leadership evaluating enterprise WFM platforms — Beacon's EOR model and UKG integration are key differentiators.",
    trend: "rising", sparkline: [46, 55, 63, 69, 74, 78, 82, 85],
  },
  {
    org: "Mercy Health", type: "Health System",
    city: "Chesterfield", state: "MO", beds: 2500,
    signal: "Travel Nurse Contract Reduction", intensity: 78, weeks: 3,
    contact: { name: "Shannon Sock", title: "Chief Nursing Officer", phone: "(314) 579-6100", email: "s.sock@mercy.net", linkedin: "linkedin.com/in/shannon-sock-mercy", address: "14528 S Outer 40 Dr", city: "Chesterfield", state: "MO" },
    contact2: { name: "Donn Sorensen", title: "CFO", phone: "(314) 579-6200", email: "d.sorensen@mercy.net" },
    contact3: { name: "Cheryl Matejka", title: "Chief People Officer", phone: "(314) 579-6300", email: "c.matejka@mercy.net" },
    tags: ["Health System", "Catholic Health", "Midwest"],
    signals: ["Researched travel nurse contract reduction", "Viewed Beacon internal PRN pool features", "Downloaded HFMA labor cost report"],
    surgeTopics: ["Travel nurse reduction", "Internal PRN", "Labor cost"],
    activitySummary: "Mercy Health CNO team reducing travel nurse contracts — Beacon's internal-first allocation and marketplace are the solution.",
    trend: "steady", sparkline: [40, 49, 56, 62, 67, 71, 75, 78],
  },
  // ── Arizona ───────────────────────────────────────────────────────────────
  {
    org: "Dignity Health", type: "Health System",
    city: "Phoenix", state: "AZ", beds: 800,
    signal: "Workforce Optimization RFI", intensity: 82, weeks: 3,
    contact: { name: "Laurie Eberst", title: "Chief Nursing Officer", phone: "(602) 406-3000", email: "l.eberst@dignityhealth.org", linkedin: "linkedin.com/in/laurie-eberst-dignity", address: "185 S 14th Ave", city: "Phoenix", state: "AZ" },
    contact2: { name: "Michael Blaszyk", title: "CFO", phone: "(602) 406-3100", email: "m.blaszyk@dignityhealth.org" },
    contact3: { name: "Colleen Sweeney", title: "VP of Nursing Operations", phone: "(602) 406-3200", email: "c.sweeney@dignityhealth.org" },
    tags: ["Health System", "Catholic Health", "Southwest"],
    signals: ["Issued workforce optimization RFI", "Viewed Beacon scheduling automation", "Researched Litehouse marketplace"],
    surgeTopics: ["Workforce optimization", "Scheduling automation", "Marketplace"],
    activitySummary: "Dignity Health nursing ops issued a workforce optimization RFI — Beacon's scheduling automation and marketplace are strong fits.",
    trend: "rising", sparkline: [42, 52, 60, 66, 71, 75, 79, 82],
  },
  // ── Michigan ──────────────────────────────────────────────────────────────
  {
    org: "Henry Ford Health", type: "Health System",
    city: "Detroit", state: "MI", beds: 2400,
    signal: "Internal Staffing Platform RFP", intensity: 84, weeks: 4,
    contact: { name: "Veronica Hall", title: "Chief Nursing Officer", phone: "(313) 916-2600", email: "v.hall@hfhs.org", linkedin: "linkedin.com/in/veronica-hall-henryford", address: "2799 W Grand Blvd", city: "Detroit", state: "MI" },
    contact2: { name: "Robin Damschroder", title: "CFO", phone: "(313) 916-2700", email: "r.damschroder@hfhs.org" },
    contact3: { name: "Diane Radcliffe", title: "VP of Human Resources", phone: "(313) 916-2800", email: "d.radcliffe@hfhs.org" },
    tags: ["Health System", "Academic", "Midwest"],
    signals: ["Issued internal staffing platform RFP", "Viewed Beacon enterprise features", "Researched Litehouse marketplace scale"],
    surgeTopics: ["Internal staffing", "Enterprise features", "Marketplace scale"],
    activitySummary: "Henry Ford Health issued a staffing platform RFP — Beacon is being evaluated for system-wide deployment across 5 hospitals.",
    trend: "rising", sparkline: [46, 55, 63, 69, 74, 78, 81, 84],
  },
  {
    org: "Beaumont Health", type: "Health System",
    city: "Southfield", state: "MI", beds: 3400,
    signal: "Travel Nurse Reduction Initiative", intensity: 77, weeks: 3,
    contact: { name: "Susan Grant", title: "Chief Nursing Officer", phone: "(248) 898-5000", email: "s.grant@beaumont.org", linkedin: "linkedin.com/in/susan-grant-beaumont", address: "26901 Beaumont Blvd", city: "Southfield", state: "MI" },
    contact2: { name: "John Kerndl", title: "CFO", phone: "(248) 898-5100", email: "j.kerndl@beaumont.org" },
    contact3: { name: "Carolyn Wilson", title: "Chief People Officer", phone: "(248) 898-5200", email: "c.wilson@beaumont.org" },
    tags: ["Health System", "Regional", "Midwest"],
    signals: ["Researched travel nurse reduction", "Viewed Beacon internal PRN features", "Visited Litehouse clinician marketplace"],
    surgeTopics: ["Travel nurse reduction", "Internal PRN", "Clinician marketplace"],
    activitySummary: "Beaumont Health CNO team reducing travel nurse reliance — Beacon's internal-first model and marketplace are directly relevant.",
    trend: "steady", sparkline: [40, 49, 56, 62, 67, 71, 74, 77],
  },
  // ── Wisconsin ─────────────────────────────────────────────────────────────
  {
    org: "UW Health", type: "Academic Medical Center",
    city: "Madison", state: "WI", beds: 642,
    signal: "Workforce Management Platform Evaluation", intensity: 80, weeks: 3,
    contact: { name: "Polly Noel", title: "Chief Nursing Officer", phone: "(608) 263-6400", email: "p.noel@uwhealth.org", linkedin: "linkedin.com/in/polly-noel-uwhealth", address: "600 Highland Ave", city: "Madison", state: "WI" },
    contact2: { name: "Alan Kaplan", title: "CFO", phone: "(608) 263-6500", email: "a.kaplan@uwhealth.org" },
    contact3: { name: "Jeff Poltawsky", title: "VP of Human Resources", phone: "(608) 263-6600", email: "j.poltawsky@uwhealth.org" },
    tags: ["Academic Medical Center", "Research", "Midwest"],
    signals: ["Evaluated workforce management platforms", "Viewed Beacon analytics dashboard", "Researched Litehouse EOR model"],
    surgeTopics: ["Workforce management", "Analytics", "EOR model"],
    activitySummary: "UW Health nursing leadership evaluating WFM platforms — Beacon's analytics and EOR model are strong differentiators.",
    trend: "rising", sparkline: [44, 53, 61, 67, 72, 75, 78, 80],
  },
  // ── Pennsylvania ──────────────────────────────────────────────────────────
  {
    org: "UPMC", type: "Health System",
    city: "Pittsburgh", state: "PA", beds: 8500,
    signal: "Enterprise Staffing Platform RFP", intensity: 89, weeks: 5,
    contact: { name: "Debra Caplan", title: "Chief Nursing Officer", phone: "(412) 647-2345", email: "d.caplan@upmc.edu", linkedin: "linkedin.com/in/debra-caplan-upmc", address: "200 Lothrop St", city: "Pittsburgh", state: "PA" },
    contact2: { name: "Edward Karlovich", title: "CFO", phone: "(412) 647-2400", email: "e.karlovich@upmc.edu" },
    contact3: { name: "Tami Minnier", title: "Chief People Officer", phone: "(412) 647-2500", email: "t.minnier@upmc.edu" },
    tags: ["Health System", "Academic", "Fortune 500", "Northeast"],
    signals: ["Issued enterprise staffing RFP", "Viewed Beacon enterprise deployment guide", "Researched Litehouse marketplace volume", "Compared Beacon vs Symplr"],
    surgeTopics: ["Enterprise staffing", "RFP evaluation", "System-wide deployment"],
    activitySummary: "UPMC issued a formal enterprise staffing RFP — Beacon is on the shortlist. Decision expected Q3 2026.",
    trend: "rising", sparkline: [52, 61, 69, 75, 80, 84, 87, 89],
  },
  {
    org: "Jefferson Health", type: "Health System",
    city: "Philadelphia", state: "PA", beds: 3800,
    signal: "Float Pool Automation Initiative", intensity: 79, weeks: 3,
    contact: { name: "Judy Sabino", title: "Chief Nursing Officer", phone: "(215) 955-6000", email: "j.sabino@jefferson.edu", linkedin: "linkedin.com/in/judy-sabino-jefferson", address: "111 S 11th St", city: "Philadelphia", state: "PA" },
    contact2: { name: "Neil Lubarsky", title: "CFO", phone: "(215) 955-6100", email: "n.lubarsky@jefferson.edu" },
    contact3: { name: "Sheryl Zimmerman", title: "VP of Nursing Operations", phone: "(215) 955-6200", email: "s.zimmerman@jefferson.edu" },
    tags: ["Health System", "Academic", "Northeast"],
    signals: ["Researched float pool automation", "Viewed Beacon scheduling features", "Visited Litehouse marketplace page"],
    surgeTopics: ["Float pool", "Scheduling automation", "Marketplace"],
    activitySummary: "Jefferson Health CNO team evaluating float pool automation — Beacon's internal-first scheduling model is a strong fit.",
    trend: "steady", sparkline: [42, 51, 58, 64, 68, 72, 76, 79],
  },
  // ── Virginia ──────────────────────────────────────────────────────────────
  {
    org: "Inova Health System", type: "Health System",
    city: "Falls Church", state: "VA", beds: 1700,
    signal: "Travel Nurse Cost Reduction", intensity: 83, weeks: 4,
    contact: { name: "Moreen Donahue", title: "Chief Nursing Officer", phone: "(703) 776-3332", email: "m.donahue@inova.org", linkedin: "linkedin.com/in/moreen-donahue-inova", address: "8110 Gatehouse Rd", city: "Falls Church", state: "VA" },
    contact2: { name: "Kathleen Sheridan", title: "CFO", phone: "(703) 776-3400", email: "k.sheridan@inova.org" },
    contact3: { name: "Traci Recupero", title: "VP of Nursing Operations", phone: "(703) 776-3500", email: "t.recupero@inova.org" },
    tags: ["Health System", "Regional", "Mid-Atlantic"],
    signals: ["Researched travel nurse cost reduction", "Viewed Beacon internal-first allocation", "Downloaded AONL staffing benchmarks"],
    surgeTopics: ["Travel nurse reduction", "Internal allocation", "Staffing benchmarks"],
    activitySummary: "Inova Health CNO team reducing travel nurse dependency — Beacon's waterfall allocation model is a direct fit.",
    trend: "rising", sparkline: [44, 53, 61, 67, 72, 76, 80, 83],
  },
  {
    org: "VCU Health", type: "Academic Medical Center",
    city: "Richmond", state: "VA", beds: 865,
    signal: "Workforce Analytics Platform Search", intensity: 75, weeks: 3,
    contact: { name: "Cheryl Hicks", title: "Chief Nursing Officer", phone: "(804) 828-9000", email: "c.hicks@vcuhealth.org", linkedin: "linkedin.com/in/cheryl-hicks-vcuhealth", address: "1250 E Marshall St", city: "Richmond", state: "VA" },
    contact2: { name: "Melinda Hancock", title: "CFO", phone: "(804) 828-9100", email: "m.hancock@vcuhealth.org" },
    contact3: { name: "Lori Sherrill", title: "VP of Human Resources", phone: "(804) 828-9200", email: "l.sherrill@vcuhealth.org" },
    tags: ["Academic Medical Center", "Research", "Mid-Atlantic"],
    signals: ["Researched workforce analytics platforms", "Viewed Beacon Tableau integration", "Visited Litehouse analytics demo page"],
    surgeTopics: ["Workforce analytics", "Tableau integration", "Data-driven staffing"],
    activitySummary: "VCU Health nursing leadership evaluating workforce analytics platforms — Beacon's Tableau integration is a key differentiator.",
    trend: "steady", sparkline: [38, 47, 54, 60, 65, 69, 72, 75],
  },
  // ── South Carolina ────────────────────────────────────────────────────────
  {
    org: "MUSC Health", type: "Academic Medical Center",
    city: "Charleston", state: "SC", beds: 750,
    signal: "Internal PRN Pool Development", intensity: 78, weeks: 3,
    contact: { name: "Marilyn Schaffner", title: "Chief Nursing Officer", phone: "(843) 792-2300", email: "m.schaffner@musc.edu", linkedin: "linkedin.com/in/marilyn-schaffner-musc", address: "169 Ashley Ave", city: "Charleston", state: "SC" },
    contact2: { name: "Patrick Cawley", title: "CFO", phone: "(843) 792-2400", email: "p.cawley@musc.edu" },
    contact3: { name: "Kimberly Schmitt", title: "VP of Nursing Operations", phone: "(843) 792-2500", email: "k.schmitt@musc.edu" },
    tags: ["Academic Medical Center", "Research", "Southeast"],
    signals: ["Researched internal PRN pool development", "Viewed Beacon marketplace features", "Visited Litehouse clinician onboarding"],
    surgeTopics: ["Internal PRN", "Marketplace", "Clinician onboarding"],
    activitySummary: "MUSC Health nursing leadership building internal PRN pool — Beacon's marketplace and credentialing automation are directly relevant.",
    trend: "rising", sparkline: [40, 49, 57, 63, 68, 72, 75, 78],
  },
  // ── New York ──────────────────────────────────────────────────────────────
  {
    org: "NYU Langone Health", type: "Academic Medical Center",
    city: "New York", state: "NY", beds: 1069,
    signal: "Enterprise Workforce Management Evaluation", intensity: 87, weeks: 4,
    contact: { name: "Kimberly Glassman", title: "Chief Nursing Officer", phone: "(212) 263-7300", email: "k.glassman@nyulangone.org", linkedin: "linkedin.com/in/kimberly-glassman-nyu", address: "550 First Ave", city: "New York", state: "NY" },
    contact2: { name: "Vicki Match Suna", title: "CFO", phone: "(212) 263-7400", email: "v.suna@nyulangone.org" },
    contact3: { name: "Diane Adams", title: "Chief People Officer", phone: "(212) 263-7500", email: "d.adams@nyulangone.org" },
    tags: ["Academic Medical Center", "Research", "Northeast"],
    signals: ["Evaluated enterprise WFM platforms", "Viewed Beacon analytics dashboard", "Researched Litehouse EOR model"],
    surgeTopics: ["Enterprise WFM", "Analytics", "EOR model"],
    activitySummary: "NYU Langone nursing leadership evaluating enterprise WFM platforms — Beacon's analytics and EOR model are strong differentiators.",
    trend: "rising", sparkline: [50, 59, 67, 73, 78, 82, 85, 87],
  },
  {
    org: "Northwell Health", type: "Health System",
    city: "New Hyde Park", state: "NY", beds: 4200,
    signal: "Travel Nurse Reduction + Internal Staffing Build", intensity: 83, weeks: 4,
    contact: { name: "Kerri Scanlon", title: "Chief Nursing Officer", phone: "(516) 465-8100", email: "k.scanlon@northwell.edu", linkedin: "linkedin.com/in/kerri-scanlon-northwell", address: "2000 Marcus Ave", city: "New Hyde Park", state: "NY" },
    contact2: { name: "Michele Cusack", title: "CFO", phone: "(516) 465-8200", email: "m.cusack@northwell.edu" },
    contact3: { name: "Maxine Carrington", title: "Chief People Officer", phone: "(516) 465-8300", email: "m.carrington@northwell.edu" },
    tags: ["Health System", "Large System", "Northeast"],
    signals: ["Researched travel nurse reduction strategies", "Viewed Beacon internal-first allocation", "Downloaded NSI staffing benchmarks"],
    surgeTopics: ["Travel nurse reduction", "Internal allocation", "Staffing benchmarks"],
    activitySummary: "Northwell Health CNO team building internal staffing strategy to reduce travel nurse reliance — Beacon's waterfall model is a direct fit.",
    trend: "rising", sparkline: [46, 55, 63, 69, 74, 78, 81, 83],
  },
  // ── California ────────────────────────────────────────────────────────────
  {
    org: "Cedars-Sinai Medical Center", type: "Academic Medical Center",
    city: "Los Angeles", state: "CA", beds: 886,
    signal: "Workforce Analytics + Float Pool Optimization", intensity: 85, weeks: 4,
    contact: { name: "Linda Burnes Bolton", title: "Chief Nursing Officer", phone: "(310) 423-5000", email: "l.bolton@cshs.org", linkedin: "linkedin.com/in/linda-burnes-bolton-cedars", address: "8700 Beverly Blvd", city: "Los Angeles", state: "CA" },
    contact2: { name: "Edward Prunchunas", title: "CFO", phone: "(310) 423-5100", email: "e.prunchunas@cshs.org" },
    contact3: { name: "Jeanne Flores", title: "VP of Nursing Operations", phone: "(310) 423-5200", email: "j.flores@cshs.org" },
    tags: ["Academic Medical Center", "Research", "West Coast"],
    signals: ["Researched workforce analytics platforms", "Viewed Beacon Tableau integration", "Visited Litehouse float pool optimization page"],
    surgeTopics: ["Workforce analytics", "Float pool optimization", "Tableau integration"],
    activitySummary: "Cedars-Sinai nursing leadership evaluating analytics platforms for float pool optimization — Beacon's Tableau integration is a key differentiator.",
    trend: "rising", sparkline: [48, 57, 65, 71, 76, 80, 83, 85],
  },
  {
    org: "Sutter Health", type: "Health System",
    city: "Sacramento", state: "CA", beds: 5000,
    signal: "Travel Nurse Dependency Reduction", intensity: 80, weeks: 3,
    contact: { name: "Cynthia Plouché", title: "Chief Nursing Officer", phone: "(916) 733-8800", email: "c.plouche@sutterhealth.org", linkedin: "linkedin.com/in/cynthia-plouche-sutter", address: "2200 River Plaza Dr", city: "Sacramento", state: "CA" },
    contact2: { name: "Jim Conforti", title: "CFO", phone: "(916) 733-8900", email: "j.conforti@sutterhealth.org" },
    contact3: { name: "Sarah Krevans", title: "Chief People Officer", phone: "(916) 733-9000", email: "s.krevans@sutterhealth.org" },
    tags: ["Health System", "Large System", "West Coast"],
    signals: ["Researched travel nurse reduction", "Viewed Beacon internal PRN features", "Downloaded AONL staffing benchmarks"],
    surgeTopics: ["Travel nurse reduction", "Internal PRN", "Staffing benchmarks"],
    activitySummary: "Sutter Health CNO team reducing travel nurse reliance — Beacon's internal-first model and marketplace are directly relevant.",
    trend: "steady", sparkline: [42, 51, 58, 64, 68, 72, 76, 80],
  },
  // ── Massachusetts ─────────────────────────────────────────────────────────
  {
    org: "Mass General Brigham", type: "Health System",
    city: "Somerville", state: "MA", beds: 6000,
    signal: "Enterprise WFM Platform RFP", intensity: 88, weeks: 5,
    contact: { name: "Gaurdia Banister", title: "Chief Nursing Officer", phone: "(617) 726-2000", email: "g.banister@mgh.harvard.edu", linkedin: "linkedin.com/in/gaurdia-banister-mgh", address: "399 Revolution Dr", city: "Somerville", state: "MA" },
    contact2: { name: "Peter Markell", title: "CFO", phone: "(617) 726-2100", email: "p.markell@mgh.harvard.edu" },
    contact3: { name: "Rosemary Sheehan", title: "Chief People Officer", phone: "(617) 726-2200", email: "r.sheehan@mgh.harvard.edu" },
    tags: ["Health System", "Academic", "Fortune 500", "Northeast"],
    signals: ["Issued enterprise WFM platform RFP", "Viewed Beacon enterprise deployment guide", "Researched Litehouse marketplace volume", "Compared Beacon vs Symplr"],
    surgeTopics: ["Enterprise WFM", "RFP evaluation", "System-wide deployment"],
    activitySummary: "Mass General Brigham issued a formal enterprise WFM RFP — Beacon is on the shortlist alongside Symplr and UKG.",
    trend: "rising", sparkline: [52, 61, 69, 75, 80, 84, 86, 88],
  },
];

function TabLiveSearch() {
  const [state, setState] = useState("National");
  const [orgType, setOrgType] = useState("");
  const [title, setTitle] = useState("");
  const [minBeds, setMinBeds] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<TargetEntry[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [searchDone, setSearchDone] = useState(false);
  const [searchLabel, setSearchLabel] = useState("");
  const [loadingIdx, setLoadingIdx] = useState<number[]>([]);
  const [loadedIdx, setLoadedIdx] = useState<number[]>([]);

  const STATES = ["National", "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"];
  const ORG_TYPES = ["", "Health System", "Hospital", "Academic Medical Center", "Regional Hospital"];
  const TITLES = ["", "Chief Nursing Officer", "CFO", "VP of Nursing Operations", "Chief People Officer", "VP of Human Resources", "President & CEO", "Director of Workforce Management"];
  const BED_SIZES = ["", "500", "1000", "2000", "5000", "10000"];

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
    if (minBeds) parts.push(`${parseInt(minBeds).toLocaleString()}+ beds`);
    setSearchLabel(parts.join(" · "));

    let pool = [...SEARCH_POOL];
    // ── State filter MUST apply first — never show wrong-state results ──
    if (state && state !== "National") {
      const stateAbbr: Record<string, string> = {
        "Tennessee": "TN", "Illinois": "IL", "Ohio": "OH", "North Carolina": "NC",
        "Washington": "WA", "Missouri": "MO", "Arizona": "AZ", "Utah": "UT",
        "Pennsylvania": "PA", "Michigan": "MI", "South Dakota": "SD", "Texas": "TX",
        "Colorado": "CO", "Wisconsin": "WI", "Minnesota": "MN", "Indiana": "IN",
        "Georgia": "GA", "Florida": "FL", "California": "CA", "New York": "NY",
        "Oklahoma": "OK", "Kansas": "KS", "Nebraska": "NE", "Iowa": "IA",
        "Arkansas": "AR", "Louisiana": "LA", "Mississippi": "MS", "Alabama": "AL",
        "Kentucky": "KY", "Virginia": "VA", "Maryland": "MD", "New Jersey": "NJ",
        "Massachusetts": "MA", "Connecticut": "CT", "Oregon": "OR", "Nevada": "NV",
        "Idaho": "ID", "Montana": "MT", "Wyoming": "WY", "New Mexico": "NM",
        "North Dakota": "ND", "South Carolina": "SC", "West Virginia": "WV",
        "Delaware": "DE", "Rhode Island": "RI", "Vermont": "VT", "New Hampshire": "NH",
        "Maine": "ME", "Hawaii": "HI", "Alaska": "AK",
      };
      const abbr = stateAbbr[state] || state;
      pool = pool.filter(t => t.state === abbr || t.state === state);
    }
    if (orgType) pool = pool.filter(t => t.type === orgType || t.tags.some(tag => tag.toLowerCase().includes(orgType.toLowerCase())));
    if (minBeds) pool = pool.filter(t => t.beds >= parseInt(minBeds));
    if (title) {
      const titleLower = title.toLowerCase();
      pool = pool.filter(t =>
        t.contact.title.toLowerCase().includes(titleLower) ||
        (t.contact2 && t.contact2.title.toLowerCase().includes(titleLower)) ||
        (t.contact3 && t.contact3.title.toLowerCase().includes(titleLower))
      );
    }
    // If no results found for this state, show a "no results" message instead of wrong-state fallback
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
        }, 1200);
      }, 500 + i * 320);
    });
  }

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <SL>EXACT AUDIENCE — LIVE HEALTHCARE WFM BUYER SEARCH</SL>
        <div className="text-lg font-black mb-1" style={{ color: C.white }}>Find In-Market Health Systems</div>
        <div className="text-sm mb-4" style={{ color: C.muted }}>Search by criteria to surface health systems actively evaluating workforce management platforms right now.</div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <div className="text-xs font-black mb-1" style={{ color: C.muted }}>MARKET / REGION</div>
            <select value={state} onChange={e => setState(e.target.value)}
              className="w-full rounded-lg px-3 py-2 text-sm font-bold"
              style={{ background: C.card2, color: C.white, border: `1px solid ${C.border}`, outline: "none" }}>
              {STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <div className="text-xs font-black mb-1" style={{ color: C.muted }}>ORGANIZATION TYPE</div>
            <select value={orgType} onChange={e => setOrgType(e.target.value)}
              className="w-full rounded-lg px-3 py-2 text-sm font-bold"
              style={{ background: C.card2, color: C.white, border: `1px solid ${C.border}`, outline: "none" }}>
              {ORG_TYPES.map(o => <option key={o} value={o}>{o || "All types"}</option>)}
            </select>
          </div>
          <div>
            <div className="text-xs font-black mb-1" style={{ color: C.muted }}>DECISION-MAKER TITLE</div>
            <select value={title} onChange={e => setTitle(e.target.value)}
              className="w-full rounded-lg px-3 py-2 text-sm font-bold"
              style={{ background: C.card2, color: C.white, border: `1px solid ${C.border}`, outline: "none" }}>
              {TITLES.map(t => <option key={t} value={t}>{t || "Any title"}</option>)}
            </select>
          </div>
          <div>
            <div className="text-xs font-black mb-1" style={{ color: C.muted }}>MIN BED COUNT</div>
            <select value={minBeds} onChange={e => setMinBeds(e.target.value)}
              className="w-full rounded-lg px-3 py-2 text-sm font-bold"
              style={{ background: C.card2, color: C.white, border: `1px solid ${C.border}`, outline: "none" }}>
              <option value="">Any size</option>
              {BED_SIZES.filter(Boolean).map(s => <option key={s} value={s}>{parseInt(s).toLocaleString()}+ beds</option>)}
            </select>
          </div>
        </div>

        <button onClick={runSearch} disabled={searching}
          className="w-full py-3 rounded-xl font-black text-sm transition-all active:scale-95"
          style={{ background: searching ? C.border : C.grad, color: searching ? C.muted : C.bg, cursor: searching ? "not-allowed" : "pointer" }}>
          {searching ? "Scanning Exact Audience Database..." : "Search In-Market Health Systems"}
        </button>
      </motion.div>

      {searching && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="rounded-2xl p-4 text-center" style={{ background: C.card, border: `1px solid ${C.border}` }}>
          <div className="flex items-center justify-center gap-2 text-sm font-black" style={{ color: C.teal }}>
            <div className="w-2 h-2 rounded-full" style={{ background: C.teal, animation: "pulse-dot 1s infinite" }} />
            Scanning Exact Audience database for {searchLabel}...
          </div>
        </motion.div>
      )}

      {searchDone && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="text-xs font-black" style={{ color: C.orange }}>
          {results.length} IN-MARKET HEALTH SYSTEMS FOUND — {searchLabel}
        </motion.div>
      )}

      {results.map((t, i) => {
        const isLoading = loadingIdx.includes(i) && !loadedIdx.includes(i);
        return (
          <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
            className="rounded-2xl overflow-hidden cursor-pointer"
            style={{ background: C.card, border: `1px solid ${C.border}` }}
            onClick={() => setSelected(selected === i ? null : i)}>

            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-black" style={{ color: C.white }}>{t.org}</div>
                  <div className="text-xs mt-0.5" style={{ color: C.muted }}>{t.type} · {t.city}, {t.state} · {t.beds.toLocaleString()} beds</div>
                  <div className="text-xs mt-0.5" style={{ color: C.muted }}>{t.contact.name} · {t.contact.title}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-2xl font-black" style={{ color: t.intensity >= 90 ? C.orange : C.teal }}>{t.intensity}</div>
                  <div className="text-xs" style={{ color: C.muted }}>intent</div>
                </div>
              </div>

              <div className="mt-2">
                <span className="px-2 py-0.5 rounded-full text-xs font-black"
                  style={{ background: `${C.orange}20`, color: C.orange, border: `1px solid ${C.orange}40` }}>
                  {t.signal}
                </span>
              </div>

              {isLoading ? (
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2 text-xs" style={{ color: C.teal }}>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: C.teal, animation: "pulse-dot 1s infinite" }} />
                    Pulling contact record from Exact Audience...
                  </div>
                  {[1, 2, 3].map(j => (
                    <div key={j} className="h-3 rounded animate-pulse" style={{ background: C.card2, width: `${70 + j * 8}%` }} />
                  ))}
                </div>
              ) : loadedIdx.includes(i) ? (
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div style={{ color: C.muted }}>Phone: <span style={{ color: C.white }}>{t.contact.phone}</span></div>
                  <div style={{ color: C.muted }}>Email: <span style={{ color: C.white }}>{t.contact.email}</span></div>
                </div>
              ) : null}
            </div>

            <AnimatePresence>
              {selected === i && loadedIdx.includes(i) && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
                  onClick={e => e.stopPropagation()}>
                  <div className="px-4 pb-4 space-y-3" style={{ borderTop: `1px solid ${C.border}` }}>
                    <div className="pt-3">
                      <div className="text-xs font-black mb-2" style={{ color: C.orange }}>FULL CONTACT RECORD</div>
                      <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
                        {[
                          ["Name", t.contact.name],
                          ["Title", t.contact.title],
                          ["Phone", t.contact.phone],
                          ["Email", t.contact.email],
                          ["LinkedIn", t.contact.linkedin || "—"],
                          ["Location", `${t.city}, ${t.state}`],
                          ["Org Size", `${t.beds.toLocaleString()} beds`],
                        ].map(([label, value], j) => (
                          <div key={j} className="flex px-3 py-2 text-xs"
                            style={{ background: j % 2 === 0 ? C.card2 : C.card, borderBottom: `1px solid ${C.border}` }}>
                            <span className="w-24 shrink-0 font-black" style={{ color: C.muted }}>{label}</span>
                            <span style={{ color: C.white }}>{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-black mb-1" style={{ color: C.teal }}>MULTI-CHANNEL OUTREACH</div>
                      <OutreachPanel t={t} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}

// ── MAIN DASHBOARD ────────────────────────────────────────────────────────────
export default function LitehouseHealthDashboard() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("how");

  return (
    <div className="min-h-screen" style={{ background: C.bg, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <style>{`
        @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.6;transform:scale(1.5)} }
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        .animate-pulse { animation: pulse 1.5s ease-in-out infinite; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance:none; width:18px; height:18px; border-radius:50%; background:${C.orange}; cursor:pointer; box-shadow:0 0 8px ${C.orange}60; }
        input[type=range]::-moz-range-thumb { width:18px; height:18px; border-radius:50%; background:${C.orange}; cursor:pointer; border:none; }
      `}</style>

      {/* Header */}
      <div className="sticky top-0 z-40 px-4 pt-4 pb-3" style={{ background: C.bg, borderBottom: `1px solid ${C.border}` }}>
        <button onClick={() => navigate("/")} className="flex items-center gap-1.5 text-xs mb-3" style={{ color: C.muted }}>
          ← Back to Campaigns
        </button>
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-0.5">
              {/* Litehouse Health wordmark */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm"
                  style={{ background: C.tealGrad, color: C.bg }}>LH</div>
                <span className="text-base font-black" style={{ color: C.white }}>Litehouse Health</span>
              </div>
              <span className="text-xs font-black px-2 py-0.5 rounded" style={{ background: C.grad, color: C.bg }}>EXACT AUDIENCE</span>
            </div>
            <div className="text-xs" style={{ color: C.muted }}>Beacon Platform · Healthcare WFM Intelligence · Exact Audience + SiteID</div>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-black" style={{ color: C.teal }}>
            <div className="w-2 h-2 rounded-full" style={{ background: C.teal, animation: "pulse-dot 2s infinite" }} />
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
                boxShadow: activeTab === tab.id ? `0 0 16px ${C.orange}40` : "none",
              }}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-5 max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
            {activeTab === "how"     && <TabHow />}
            {activeTab === "siteid"  && <TabSiteID />}
            {activeTab === "roi"     && <TabROI />}
            {activeTab === "targets" && <TabTargets />}
            {activeTab === "search"  && <TabLiveSearch />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
