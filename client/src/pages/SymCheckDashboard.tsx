import { useState, useEffect, useRef } from "react";
import symcheckLogo from "../assets/symcheck-logo.png";
import { useLocation } from "wouter";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie, LineChart, Line
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
// SymCheck: deep navy bg, neon teal primary, sunset orange→gold EA gradient
const C = {
  bg:      "#060d18",
  card:    "#0b1525",
  card2:   "#0f1d33",
  border:  "#162540",
  teal:    "#6EC5EC",
  tealDim: "#3a8ab5",
  orange:  "#f97316",
  gold:    "#fbbf24",
  white:   "#e2eaf4",
  muted:   "#7a9bbf",
  grad:    "linear-gradient(135deg, #f97316, #fbbf24)",
  gradR:   "linear-gradient(135deg, #fbbf24, #f97316)",
  tealGrad:"linear-gradient(135deg, #6EC5EC, #3a8ab5)",
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
  org: string; type: "Health System" | "Hospital" | "Clinic Network" | "Employer Group" | "Insurance";
  city: string; state: string; employees: number; signal: string;
  intensity: number; weeks: number;
  contact: Contact;
  contact2?: Contact;
  tags: string[];
  signals: string[];
  surgeTopics: string[];
  activitySummary: string;
  trend: "rising" | "steady" | "new";
  sparkline: number[];
};

function OutreachPanel({ t }: { t: TargetEntry }) {
  const [channel, setChannel] = useState<"email" | "linkedin_conn" | "linkedin_dm" | "mail" | "call" | "sms">("email");
  const first = t.contact.name.split(" ")[0];
  const channels = [
    { id: "email" as const,        label: "Email" },
    { id: "linkedin_conn" as const, label: "LI Connect" },
    { id: "linkedin_dm" as const,   label: "LI Message" },
    { id: "mail" as const,          label: "Direct Mail" },
    { id: "call" as const,          label: "Cold Call" },
    { id: "sms" as const,           label: "SMS" },
  ];

  const content = {
    email: {
      subject: `Workforce Wellness Intelligence — ${t.org}`,
      body: `Hi ${first},\n\nI'm reaching out because we've noticed ${t.org} has been actively researching ${t.signal.toLowerCase()} solutions over the past ${t.weeks} week${t.weeks > 1 ? "s" : ""}.\n\nSymCheck is an AI-powered contactless wellness platform that gives HR and benefits teams real-time workforce health insights — no wearables, no apps, just a 30-second scan that measures heart rate, stress, BMI, and more.\n\nWe're working with several ${t.type === "Employer Group" ? "employers" : "health systems"} in ${t.state} right now and thought ${t.org} would be a natural fit given your current evaluation.\n\nWould a 20-minute demo make sense this week? I can show you exactly what your workforce health data would look like on day one.\n\nBest,\n[Your Name]\nSymCheck — Enterprise Wellness\n[Phone]`,
    },
    linkedin_conn: {
      subject: "LinkedIn Connection Request",
      body: `Hi ${first} — I work with SymCheck, an AI-powered contactless wellness platform helping ${t.type === "Employer Group" ? "HR teams" : "health systems"} get real-time workforce health insights without wearables or apps. I noticed ${t.org} has been evaluating wellness solutions and thought it might be worth connecting. Happy to share what we're seeing in the market.`,
    },
    linkedin_dm: {
      subject: "LinkedIn Follow-Up Message",
      body: `Hi ${first}, thanks for connecting!\n\nI wanted to follow up — I noticed ${t.org} has been actively researching ${t.signal.toLowerCase()} and I think SymCheck could be a strong fit.\n\nWe use contactless rPPG technology to measure wellness metrics in under 60 seconds — no wearables, no apps, fully HIPAA-compliant. The platform gives ${t.contact.title.includes("HR") || t.contact.title.includes("Benefits") ? "HR and benefits teams" : "clinical and operations leaders"} a real-time view of workforce health at scale.\n\nI'd love to show you a live demo — even a 15-minute call would give you a clear picture. Would this week work?\n\n— [Your Name]`,
    },
    mail: {
      subject: "Direct Mail — Personalized Letter",
      body: `${t.contact.name}\n${t.contact.title}\n${t.org}\n${t.city}, ${t.state}\n\nDear ${first},\n\nAs workforce wellness becomes a top priority for ${t.type === "Employer Group" ? "employers" : "health systems"} across ${t.state}, SymCheck is helping organizations like ${t.org} get ahead of the curve.\n\nOur contactless wellness platform delivers real-time health insights for your entire workforce — heart rate, stress levels, BMI, and more — in a 30-second scan. No wearables. No apps. No friction.\n\nI'd welcome the opportunity to send you a no-obligation overview of what a SymCheck deployment would look like for ${t.org}. Simply reach out directly:\n\n[Your Name] | [Phone] | [Email]\nSymCheck Enterprise Wellness\n\nWarm regards,\n[Your Name]`,
    },
    call: {
      subject: "Cold Call Script",
      body: `OPENING:\n"Hi, may I speak with ${t.contact.name}? … Hi ${first}, this is [Name] from SymCheck. We're an AI-powered wellness platform — do you have 90 seconds?"\n\nIF YES:\n"We work with ${t.type === "Employer Group" ? "HR and benefits teams" : "health systems"} to give them real-time workforce health data — contactless, no wearables, 30-second scan. I noticed ${t.org} has been evaluating ${t.signal.toLowerCase()} recently, and I think we might be exactly what you're looking for. Can I send you a 2-minute overview video and schedule a quick demo?"\n\nOBJECTION — "We already have a wellness program":\n"That's great — most of our clients do. SymCheck actually layers on top of existing programs and gives you the data layer that most wellness vendors don't provide. It's the difference between knowing your participation rate and knowing your workforce's actual health status in real time."\n\nCLOSE:\n"I'll send you a short overview right now. What's the best email? And does [day] or [day] work for a 20-minute demo?"`,
    },
    sms: {
      subject: "SMS — Text Message",
      body: `Hi ${first}, this is [Name] from SymCheck. I noticed ${t.org} has been researching ${t.signal.toLowerCase()} solutions. We offer contactless AI wellness scans — no apps, no wearables, 30 sec. Worth a quick demo? Reply YES and I'll send a link. 🙏`,
    },
  };

  const active = content[channel];
  return (
    <div className="mt-3 rounded-xl overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
      {/* Channel tabs */}
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
        <div className="text-xs font-black mb-2" style={{ color: C.gold }}>{active.subject}</div>
        <pre className="text-xs leading-relaxed whitespace-pre-wrap font-sans" style={{ color: C.white }}>{active.body}</pre>
      </div>
    </div>
  );
}

// ── TARGET DATA POOL ──────────────────────────────────────────────────────────
const TARGET_POOL: TargetEntry[] = [
  {
    org: "Vanderbilt University Medical Center", type: "Health System",
    city: "Nashville", state: "TN", employees: 24000,
    signal: "Employee Wellness Platform Evaluation", intensity: 94, weeks: 4,
    contact: { name: "Patricia Holloway", title: "VP of Human Resources", phone: "(615) 322-5000", email: "p.holloway@vumc.org", linkedin: "linkedin.com/in/patricia-holloway-vumc", address: "1211 Medical Center Dr", city: "Nashville", state: "TN" },
    contact2: { name: "Dr. Marcus Webb", title: "Chief Wellness Officer", phone: "(615) 322-7841", email: "m.webb@vumc.org" },
    tags: ["Health System", "Academic Medical Center", "Large Employer"],
    signals: ["Visited 3 wellness platform vendor sites", "Downloaded SHRM wellness ROI report", "Searched 'contactless health screening' 8x"],
    surgeTopics: ["Workforce wellness", "Contactless biometrics", "Employee health data"],
    activitySummary: "VUMC HR leadership actively evaluating enterprise wellness platforms with biometric screening capabilities.",
    trend: "rising", sparkline: [40, 52, 61, 70, 78, 85, 90, 94],
  },
  {
    org: "HCA Healthcare Corporate", type: "Health System",
    city: "Nashville", state: "TN", employees: 290000,
    signal: "Workforce Health Intelligence Platform", intensity: 91, weeks: 3,
    contact: { name: "Jennifer Caldwell", title: "SVP Benefits & Total Rewards", phone: "(615) 344-9551", email: "j.caldwell@hcahealthcare.com", linkedin: "linkedin.com/in/jennifer-caldwell-hca", address: "One Park Plaza", city: "Nashville", state: "TN" },
    contact2: { name: "Thomas Reeves", title: "Chief People Officer", phone: "(615) 344-2000", email: "t.reeves@hcahealthcare.com" },
    tags: ["Health System", "Fortune 500", "National Employer"],
    signals: ["Researched AI health screening vendors", "Viewed SymCheck competitor pages", "Downloaded wellness program ROI whitepaper"],
    surgeTopics: ["AI wellness", "Population health", "Benefits technology"],
    activitySummary: "HCA benefits team evaluating AI-powered wellness screening for system-wide deployment.",
    trend: "rising", sparkline: [55, 60, 68, 75, 80, 85, 88, 91],
  },
  {
    org: "Nissan North America", type: "Employer Group",
    city: "Franklin", state: "TN", employees: 8500,
    signal: "Contactless Wellness Screening Program", intensity: 88, weeks: 5,
    contact: { name: "Angela Morrison", title: "Director of Benefits & Wellness", phone: "(615) 725-1000", email: "a.morrison@nissan-usa.com", linkedin: "linkedin.com/in/angela-morrison-nissan", address: "One Nissan Way", city: "Franklin", state: "TN" },
    tags: ["Automotive", "Large Employer", "Manufacturing"],
    signals: ["Visited wellness vendor comparison sites", "Searched 'no-touch health screening employees'", "Downloaded OSHA wellness compliance guide"],
    surgeTopics: ["Contactless screening", "Manufacturing wellness", "OSHA compliance"],
    activitySummary: "Nissan benefits team actively sourcing contactless wellness solutions for plant and office employees.",
    trend: "rising", sparkline: [30, 42, 55, 62, 70, 78, 84, 88],
  },
  {
    org: "BlueCross BlueShield of Tennessee", type: "Insurance",
    city: "Chattanooga", state: "TN", employees: 6200,
    signal: "Member Wellness Platform Integration", intensity: 85, weeks: 3,
    contact: { name: "Robert Finley", title: "VP of Population Health", phone: "(423) 535-5600", email: "r.finley@bcbst.com", linkedin: "linkedin.com/in/robert-finley-bcbst", address: "801 Pine St", city: "Chattanooga", state: "TN" },
    contact2: { name: "Sandra Kim", title: "Director of Digital Health", phone: "(423) 535-7200", email: "s.kim@bcbst.com" },
    tags: ["Insurance", "Payer", "Population Health"],
    signals: ["Researched member wellness engagement tools", "Viewed AI health assessment platforms", "Downloaded digital health ROI report"],
    surgeTopics: ["Member engagement", "Digital health", "Preventive care"],
    activitySummary: "BCBST population health team evaluating AI wellness tools for member engagement programs.",
    trend: "steady", sparkline: [60, 65, 68, 72, 75, 78, 82, 85],
  },
  {
    org: "Tennessee Valley Authority", type: "Employer Group",
    city: "Knoxville", state: "TN", employees: 10500,
    signal: "Employee Health & Wellness Initiative", intensity: 82, weeks: 6,
    contact: { name: "David Okafor", title: "Chief Human Resources Officer", phone: "(865) 632-2101", email: "d.okafor@tva.gov", linkedin: "linkedin.com/in/david-okafor-tva", address: "400 W Summit Hill Dr", city: "Knoxville", state: "TN" },
    tags: ["Government", "Utility", "Large Employer"],
    signals: ["Visited 4 wellness platform vendor sites", "Searched 'biometric screening no wearables'", "Downloaded federal wellness program guidelines"],
    surgeTopics: ["Biometric screening", "Federal wellness", "Employee health"],
    activitySummary: "TVA HR leadership sourcing modern wellness screening to replace outdated annual biometric events.",
    trend: "rising", sparkline: [35, 45, 52, 60, 68, 74, 79, 82],
  },
  {
    org: "Ascension Saint Thomas", type: "Hospital",
    city: "Nashville", state: "TN", employees: 7800,
    signal: "Staff Wellness & Burnout Prevention Platform", intensity: 79, weeks: 4,
    contact: { name: "Michelle Torres", title: "VP of Nursing & Clinical Operations", phone: "(615) 222-2111", email: "m.torres@ascension.org", linkedin: "linkedin.com/in/michelle-torres-ascension", address: "4220 Harding Pike", city: "Nashville", state: "TN" },
    tags: ["Hospital", "Catholic Health System", "Clinical Staff"],
    signals: ["Researched nurse burnout prevention tools", "Viewed wellness screening platforms", "Downloaded Joint Commission wellness standards"],
    surgeTopics: ["Nurse burnout", "Clinical staff wellness", "Healthcare retention"],
    activitySummary: "Ascension clinical operations evaluating wellness tools specifically for nursing staff burnout reduction.",
    trend: "steady", sparkline: [50, 55, 60, 65, 68, 72, 76, 79],
  },
  {
    org: "Dollar General Corporation", type: "Employer Group",
    city: "Goodlettsville", state: "TN", employees: 158000,
    signal: "Frontline Employee Wellness Program", intensity: 76, weeks: 3,
    contact: { name: "Karen Walsh", title: "SVP Human Resources", phone: "(615) 855-4000", email: "k.walsh@dollargeneral.com", linkedin: "linkedin.com/in/karen-walsh-dg", address: "100 Mission Ridge", city: "Goodlettsville", state: "TN" },
    tags: ["Retail", "Fortune 500", "Frontline Workforce"],
    signals: ["Researched frontline worker wellness solutions", "Viewed mobile-first health platforms", "Downloaded retail employee health report"],
    surgeTopics: ["Frontline wellness", "Mobile health", "Retail workforce"],
    activitySummary: "Dollar General HR evaluating scalable wellness solutions for distributed retail workforce.",
    trend: "new", sparkline: [20, 28, 38, 48, 58, 65, 71, 76],
  },
  {
    org: "Erlanger Health System", type: "Hospital",
    city: "Chattanooga", state: "TN", employees: 5400,
    signal: "Workforce Wellness & Retention Program", intensity: 73, weeks: 2,
    contact: { name: "James Whitfield", title: "Chief People Officer", phone: "(423) 778-7000", email: "j.whitfield@erlanger.org", linkedin: "linkedin.com/in/james-whitfield-erlanger", address: "975 E 3rd St", city: "Chattanooga", state: "TN" },
    tags: ["Hospital", "Regional Health System", "Clinical Staff"],
    signals: ["Visited wellness vendor sites", "Searched 'contactless biometric health check'"],
    surgeTopics: ["Staff retention", "Wellness screening", "Healthcare HR"],
    activitySummary: "Erlanger HR evaluating wellness platforms to support staff retention and reduce turnover.",
    trend: "new", sparkline: [25, 32, 40, 48, 55, 62, 68, 73],
  },
  {
    org: "Bridgestone Americas", type: "Employer Group",
    city: "Nashville", state: "TN", employees: 55000,
    signal: "Global Employee Wellness Platform", intensity: 87, weeks: 5,
    contact: { name: "Lisa Nakamura", title: "VP Global Benefits & Wellness", phone: "(615) 937-1000", email: "l.nakamura@bridgestone.com", linkedin: "linkedin.com/in/lisa-nakamura-bridgestone", address: "200 4th Ave S", city: "Nashville", state: "TN" },
    tags: ["Manufacturing", "Global Employer", "Fortune 500"],
    signals: ["Researched global wellness platform vendors", "Viewed AI health screening demos", "Downloaded manufacturing wellness ROI study"],
    surgeTopics: ["Global wellness", "Manufacturing health", "AI screening"],
    activitySummary: "Bridgestone benefits team evaluating AI wellness platforms for global workforce deployment.",
    trend: "rising", sparkline: [42, 52, 60, 68, 75, 80, 84, 87],
  },
  {
    org: "Cigna Healthcare Tennessee", type: "Insurance",
    city: "Memphis", state: "TN", employees: 4200,
    signal: "Employer Wellness Product Integration", intensity: 71, weeks: 2,
    contact: { name: "Brian Osei", title: "Director of Employer Solutions", phone: "(901) 748-4100", email: "b.osei@cigna.com", linkedin: "linkedin.com/in/brian-osei-cigna", address: "6060 Primacy Pkwy", city: "Memphis", state: "TN" },
    tags: ["Insurance", "Payer", "Employer Benefits"],
    signals: ["Researched wellness platform partnerships", "Viewed contactless health tech vendors"],
    surgeTopics: ["Wellness partnerships", "Employer benefits", "Health tech"],
    activitySummary: "Cigna employer solutions team evaluating wellness platform integrations for employer group clients.",
    trend: "new", sparkline: [30, 38, 45, 52, 58, 63, 68, 71],
  },
];

// ── SITE VISITORS ─────────────────────────────────────────────────────────────
const SITE_VISITORS = [
  {
    name: "Patricia H.", org: "Vanderbilt UMC", title: "VP Human Resources",
    city: "Nashville", state: "TN", lastSeen: "4m ago", visits: 6,
    pages: ["Enterprise Wellness", "How It Works", "Pricing"],
    timeOnSite: "9m 14s", tier: "TIER 0 — DECISION MAKER",
    tierColor: C.orange, income: "$285K",
    phone: "(615) 322-5000", email: "p.holloway@vumc.org",
    address: "1211 Medical Center Dr, Nashville, TN 37232",
    linkedin: "linkedin.com/in/patricia-holloway-vumc",
    outreach: "Hi Patricia — I noticed you were exploring our Enterprise Wellness and Pricing pages on SymCheck.com. Vanderbilt's scale is exactly where our platform shines — 24,000 employees, real-time wellness data, no wearables. Would a 20-minute demo this week make sense?",
  },
  {
    name: "Jennifer C.", org: "HCA Healthcare", title: "SVP Benefits & Total Rewards",
    city: "Nashville", state: "TN", lastSeen: "12m ago", visits: 4,
    pages: ["Platform", "Features", "Applications"],
    timeOnSite: "7m 32s", tier: "TIER 0 — DECISION MAKER",
    tierColor: C.orange, income: "$340K",
    phone: "(615) 344-9551", email: "j.caldwell@hcahealthcare.com",
    address: "One Park Plaza, Nashville, TN 37203",
    linkedin: "linkedin.com/in/jennifer-caldwell-hca",
    outreach: "Hi Jennifer — HCA's scale is remarkable and your team was just on our Platform and Features pages. SymCheck can deploy across your entire system — contactless, HIPAA-compliant, real-time. Worth 20 minutes to see what workforce health data looks like at HCA scale?",
  },
  {
    name: "Angela M.", org: "Nissan North America", title: "Director of Benefits & Wellness",
    city: "Franklin", state: "TN", lastSeen: "28m ago", visits: 3,
    pages: ["How It Works", "Vitals", "Contact"],
    timeOnSite: "5m 48s", tier: "TIER 1 — BENEFITS BUYER",
    tierColor: C.teal, income: "$195K",
    phone: "(615) 725-1000", email: "a.morrison@nissan-usa.com",
    address: "One Nissan Way, Franklin, TN 37067",
    linkedin: "linkedin.com/in/angela-morrison-nissan",
    outreach: "Hi Angela — I saw you were checking out our Vitals platform on SymCheck.com. For a manufacturing environment like Nissan, contactless wellness screening is a game-changer — no scheduling, no friction, 30 seconds per employee. Happy to show you what it looks like on the plant floor.",
  },
  {
    name: "David O.", org: "Tennessee Valley Authority", title: "Chief Human Resources Officer",
    city: "Knoxville", state: "TN", lastSeen: "1h ago", visits: 5,
    pages: ["Wellness", "Enterprise", "Pricing"],
    timeOnSite: "11m 05s", tier: "TIER 0 — DECISION MAKER",
    tierColor: C.orange, income: "$310K",
    phone: "(865) 632-2101", email: "d.okafor@tva.gov",
    address: "400 W Summit Hill Dr, Knoxville, TN 37902",
    linkedin: "linkedin.com/in/david-okafor-tva",
    outreach: "Hi David — TVA's workforce health initiative is exactly the kind of program SymCheck was built for. I noticed you spent time on our Pricing page — I'd love to walk you through what a TVA deployment would look like and what the ROI looks like at 10,500 employees.",
  },
  {
    name: "Robert F.", org: "BlueCross BlueShield TN", title: "VP Population Health",
    city: "Chattanooga", state: "TN", lastSeen: "2h ago", visits: 2,
    pages: ["Platform", "Insights"],
    timeOnSite: "4m 22s", tier: "TIER 1 — STRATEGIC PARTNER",
    tierColor: C.teal, income: "$265K",
    phone: "(423) 535-5600", email: "r.finley@bcbst.com",
    address: "801 Pine St, Chattanooga, TN 37402",
    linkedin: "linkedin.com/in/robert-finley-bcbst",
    outreach: "Hi Robert — A BCBST partnership would be incredibly powerful — imagine offering SymCheck's contactless wellness screening as a member benefit across your entire book. I saw you were on our Insights page. Would a partnership conversation make sense?",
  },
];

// ── SEARCH POOL ───────────────────────────────────────────────────────────────
const SEARCH_POOL = TARGET_POOL;

// ── TAB: HOW IT WORKS ─────────────────────────────────────────────────────────
function TabHow() {
  const steps = [
    {
      num: "01", title: "Exact Audience Monitors Behavioral Signals Across the Web",
      desc: "Every day, Exact Audience aggregates behavioral signals from HR benefits forums, wellness vendor comparison sites, healthcare industry publications, LinkedIn activity, and content platforms. When an employer or health system is actively evaluating a wellness platform, the signal appears in your SymCheck dashboard — before they contact anyone.",
      example: "Vanderbilt UMC's HR team visited 3 wellness platform vendor sites, downloaded a SHRM wellness ROI report, and searched 'contactless health screening' 8 times this week. Exact Audience caught every signal and delivered it to your dashboard Monday morning.",
      color: C.orange,
    },
    {
      num: "02", title: "Exact Audience Identifies the Decision-Maker",
      desc: "Once an organization shows buying intent, Exact Audience identifies the specific person responsible for that purchase decision — VP of HR, Director of Benefits, Chief People Officer, or Chief Wellness Officer — and delivers their direct phone number, email, and LinkedIn profile. No guessing. No gatekeepers.",
      example: "Patricia Holloway, VP of Human Resources at Vanderbilt UMC. Direct line: (615) 322-5000. Email: p.holloway@vumc.org. LinkedIn: linkedin.com/in/patricia-holloway-vumc. Delivered to your inbox Monday morning.",
      color: C.teal,
    },
    {
      num: "03", title: "SymCheck Gets the Weekly Target Report",
      desc: "Every Monday morning, your sales team receives a ranked list of employers and health systems actively shopping for wellness platforms — sorted by intent score, with the decision-maker contact attached to each one. No cold calling into the dark. No guessing who's in market. Just warm, verified, in-market leads.",
      example: "10 organizations. 10 contacts. Ranked by urgency. Delivered before your team's morning standup. This week: Vanderbilt, HCA, Nissan, TVA, Bridgestone — all actively evaluating.",
      color: C.gold,
    },
    {
      num: "04", title: "SiteID Captures Every Anonymous Visitor to SymCheck.com",
      desc: "Exact Audience's SiteID layer identifies the companies visiting symcheck.com in real time — even if they never fill out a form. When a benefits director at a Fortune 500 company visits your Pricing page, you know who they are, what pages they viewed, and how long they stayed. No form. No call. You still know.",
      example: "Jennifer Caldwell, SVP Benefits at HCA Healthcare, visited your Platform and Features pages for 7 minutes and 32 seconds today. Nobody filled out a form. SiteID caught it — and handed you her direct line.",
      color: C.orange,
    },
  ];

  const marketData = [
    { week: "Wk 1", orgs: 6 }, { week: "Wk 2", orgs: 8 }, { week: "Wk 3", orgs: 9 },
    { week: "Wk 4", orgs: 11 }, { week: "Wk 5", orgs: 13 }, { week: "Wk 6", orgs: 15 },
    { week: "Wk 7", orgs: 18 }, { week: "Wk 8", orgs: 22 },
  ];

  const categoryData = [
    { name: "Health Systems", value: 8 }, { name: "Large Employers", value: 12 },
    { name: "Insurance / Payers", value: 5 }, { name: "Clinic Networks", value: 4 },
    { name: "Gov / Education", value: 3 }, { name: "Retail / Frontline", value: 6 },
  ];

  return (
    <div className="space-y-4">
      {/* Hero card */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <SL>HOW EXACT AUDIENCE WORKS FOR SYMCHECK — COMPLETE B2B INTELLIGENCE</SL>
        <div className="text-lg font-black mb-2" style={{ color: C.white }}>Know Who Is Evaluating Wellness Platforms Right Now</div>
        <div className="text-sm leading-relaxed" style={{ color: C.muted }}>
          Most wellness vendors wait for inbound demos. Exact Audience gives SymCheck a radar system — you see which employers and health systems are actively evaluating wellness platforms right now, who the decision-maker is, and how to reach them directly. Every signal is proprietary to Exact Audience.
        </div>
        {/* Stat row */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          {[
            { label: "Orgs In-Market This Week", value: 22, color: C.orange },
            { label: "Decision-Makers Identified", value: 38, color: C.teal },
            { label: "Avg Intent Score", value: 81, color: C.gold },
          ].map((s, i) => (
            <div key={i} className="rounded-xl p-3 text-center" style={{ background: C.card2, border: `1px solid ${C.border}` }}>
              <AnimatedScore value={s.value} color={s.color} />
              <div className="text-xs mt-1" style={{ color: C.muted }}>{s.label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Market activity chart */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <SL color={C.teal}>MARKET ACTIVITY — LAST 8 WEEKS</SL>
        <div className="text-sm font-black mb-3" style={{ color: C.white }}>Organizations Actively Evaluating Wellness Platforms</div>
        <ResponsiveContainer width="100%" height={140}>
          <AreaChart data={marketData} margin={{ top: 5, right: 5, left: -30, bottom: 0 }}>
            <defs>
              <linearGradient id="symAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={C.orange} stopOpacity={0.4} />
                <stop offset="95%" stopColor={C.orange} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="week" tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 8, color: C.white, fontSize: 11 }} />
            <Area type="monotone" dataKey="orgs" stroke={C.orange} strokeWidth={2} fill="url(#symAreaGrad)" dot={{ fill: C.orange, r: 3 }} activeDot={{ r: 5 }} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Category breakdown */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <SL color={C.gold}>IN-MARKET ACTIVITY BY BUYER SEGMENT — THIS WEEK</SL>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart layout="vertical" data={categoryData} margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
            <XAxis type="number" tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="name" tick={{ fill: C.white, fontSize: 10 }} axisLine={false} tickLine={false} width={110} />
            <Tooltip contentStyle={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 8, color: C.white, fontSize: 11 }} />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {[C.orange, C.teal, C.gold, C.teal, C.orange, C.gold].map((color, i) => (
                <Cell key={i} fill={color} fillOpacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Steps */}
      {steps.map((s, i) => (
        <motion.div key={i} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
          className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}`, borderLeft: `4px solid ${s.color}` }}>
          <div className="flex items-start gap-4">
            <div className="text-3xl font-black shrink-0" style={{ color: s.color, opacity: 0.35 }}>{s.num}</div>
            <div>
              <div className="font-black mb-2" style={{ color: C.white }}>{s.title}</div>
              <div className="text-sm leading-relaxed mb-3" style={{ color: C.muted }}>{s.desc}</div>
              <div className="rounded-xl p-3 text-xs italic leading-relaxed" style={{ background: `${s.color}12`, border: `1px solid ${s.color}30`, color: s.color }}>
                Example: {s.example}
              </div>
            </div>
          </div>
        </motion.div>
      ))}

      {/* ── MARKET INTELLIGENCE SECTION ── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
        className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <SL color={C.gold}>MARKET INTELLIGENCE — WHAT MOST PEOPLE DON'T KNOW ABOUT YOUR SPACE</SL>
        <div className="text-sm font-black mb-4" style={{ color: C.white }}>The numbers that make the business case undeniable</div>
        <div className="grid grid-cols-2 gap-3">
          {MARKET_FACTS.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 + i * 0.08 }}
              className="rounded-xl p-4" style={{ background: C.card2, border: `1px solid ${C.border}` }}>
              <div className="text-2xl font-black" style={{ background: C.grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{f.stat}</div>
              <div className="text-xs font-bold mt-1" style={{ color: C.white }}>{f.label}</div>
              <div className="text-xs mt-1 leading-relaxed" style={{ color: C.muted }}>{f.sub}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── WHAT BIOMETRIC SCREENING SAVES ── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
        className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <SL color={C.teal}>WHAT SYMCHECK SAVES A COMPANY IN INSURANCE & HEALTH COSTS</SL>
        <div className="text-sm font-black mb-1" style={{ color: C.white }}>The ROI case for your buyer — before they even talk to you</div>
        <div className="text-xs mb-4" style={{ color: C.muted }}>Based on Optum, RAND, and SHRM workforce wellness studies</div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={[
            { category: "Avoided Claims",    savings: 291 },
            { category: "Reduced Absenteeism", savings: 340 },
            { category: "Lower Turnover",    savings: 520 },
            { category: "Productivity Gain", savings: 410 },
            { category: "Rx Cost Reduction", savings: 185 },
          ]} margin={{ top: 5, right: 5, left: -10, bottom: 20 }}>
            <XAxis dataKey="category" tick={{ fill: C.muted, fontSize: 9 }} axisLine={false} tickLine={false} angle={-15} textAnchor="end" />
            <YAxis tick={{ fill: C.muted, fontSize: 9 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
            <Tooltip contentStyle={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 8, color: C.white, fontSize: 11 }}
              formatter={(v: number) => [`$${v}/employee/yr`, "Annual Savings"]} />
            <Bar dataKey="savings" radius={[4, 4, 0, 0]}>
              {[C.orange, C.gold, C.teal, C.orange, C.tealDim].map((color, i) => (
                <Cell key={i} fill={color} fillOpacity={0.9} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-3 rounded-xl p-3" style={{ background: `${C.orange}10`, border: `1px solid ${C.orange}25` }}>
          <div className="text-xs font-black mb-1" style={{ color: C.orange }}>TOTAL SAVINGS PER EMPLOYEE / YEAR</div>
          <div className="text-3xl font-black" style={{ background: C.grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>$1,746</div>
          <div className="text-xs mt-1" style={{ color: C.muted }}>A 1,000-employee hospital saves <span style={{ color: C.white, fontWeight: 900 }}>$1.74M/year</span> in total workforce health costs when employees participate in a biometric wellness program. SymCheck's annual fee is a fraction of that.</div>
        </div>
      </motion.div>

      {/* ── COMPETITOR COMPARISON ── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
        className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <SL color={C.gold}>COMPETITIVE LANDSCAPE — WHY SYMCHECK WINS</SL>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                {["Vendor", "Technology", "Hardware", "HIPAA", "Avg ACV"].map(h => (
                  <th key={h} className="text-left py-2 pr-3 font-black" style={{ color: C.muted }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { name: "SymCheck",   tech: "rPPG + AI",       hw: "None — any camera", hipaa: "✓", acv: "$75K–$280K",  highlight: true },
                { name: "Shen.AI",    tech: "rPPG SDK (Software Dev. Kit)", hw: "SDK only",  hipaa: "Partial", acv: "$10K+/yr" },
                { name: "Binah.ai",   tech: "rPPG",           hw: "SDK only",          hipaa: "Partial", acv: "$50K+ enterprise" },
                { name: "NuraLogix",  tech: "Transdermal Opt.",hw: "Tablet required",   hipaa: "✓", acv: "$50K+ enterprise" },
                { name: "Biometrics Co.", tech: "Traditional", hw: "Kiosk $3K–$8K",    hipaa: "✓", acv: "$25K–$60K" },
              ].map((r, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${C.border}40`, background: r.highlight ? `${C.orange}10` : 'transparent' }}>
                  <td className="py-2 pr-3 font-black" style={{ color: r.highlight ? C.orange : C.white }}>{r.name}{r.highlight ? " ★" : ""}</td>
                  <td className="py-2 pr-3" style={{ color: C.muted }}>{r.tech}</td>
                  <td className="py-2 pr-3" style={{ color: r.hw === "None — any camera" ? C.teal : C.muted }}>{r.hw}</td>
                  <td className="py-2 pr-3" style={{ color: r.hipaa === "✓" ? C.teal : C.muted }}>{r.hipaa}</td>
                  <td className="py-2" style={{ color: r.highlight ? C.gold : C.muted }}>{r.acv}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Differentiation */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}
        className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <SL color={C.gold}>WHAT MAKES EXACT AUDIENCE DIFFERENT FOR SYMCHECK</SL>
        <div className="space-y-3">
          {[
            { label: "Traditional B2B Sales", desc: "Cold outreach to HR directories. You call a generic benefits email and hope someone responds. You have no idea if they're actually evaluating wellness platforms right now.", bad: true },
            { label: "Exact Audience + SiteID", desc: "Intent-first intelligence. We identify which employers and health systems are actively shopping for wellness platforms right now, surface the exact decision-maker, and tell you what pages they visited on your own website — before you make a single call.", bad: false },
          ].map((r, i) => (
            <div key={i} className="rounded-xl p-3 flex items-start gap-3"
              style={{ background: r.bad ? `${C.border}80` : `${C.orange}12`, border: `1px solid ${r.bad ? C.border : C.orange}30` }}>
              <div className="w-2 h-2 rounded-full mt-1 shrink-0" style={{ background: r.bad ? C.border : C.orange }} />
              <div>
                <div className="text-xs font-black mb-1" style={{ color: r.bad ? C.muted : C.orange }}>{r.label}</div>
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
  const [outreachOpen, setOutreachOpen] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <div className="flex items-center justify-between mb-1">
          <SL>SYMCHECK.COM — LIVE SITE VISITOR INTELLIGENCE</SL>
          <div className="flex items-center gap-1.5 text-xs font-black" style={{ color: C.teal }}>
            <div className="w-2 h-2 rounded-full" style={{ background: C.teal, animation: "pulse-dot 2s infinite" }} />
            LIVE
          </div>
        </div>
        <div className="text-lg font-black mb-1" style={{ color: C.white }}>Today's Identified Visitors — symcheck.com</div>
        <div className="text-sm" style={{ color: C.muted }}>
          Every company visiting your site today — identified in real time. No form. No call. You know who they are.
        </div>
        <div className="grid grid-cols-3 gap-3 mt-4">
          {[
            { label: "Companies Identified Today", value: 5, color: C.orange },
            { label: "Decision-Makers Identified", value: 5, color: C.teal },
            { label: "Avg Time on Site", value: "7m 28s", color: C.gold, raw: true },
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

      {/* Visitor cards */}
      {SITE_VISITORS.map((v, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
          className="rounded-2xl overflow-hidden cursor-pointer"
          style={{ background: C.card, border: `1px solid ${C.border}` }}
          onClick={() => setExpanded(expanded === i ? null : i)}>

          {/* Summary row */}
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

            {/* Tier badge */}
            <div className="mt-2 inline-block px-2 py-0.5 rounded-full text-xs font-black"
              style={{ background: `${v.tierColor}20`, color: v.tierColor, border: `1px solid ${v.tierColor}40` }}>
              {v.tier}
            </div>

            {/* Pages + time */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {v.pages.map((p, j) => (
                <span key={j} className="px-2 py-0.5 rounded-full text-xs"
                  style={{ background: `${C.teal}15`, color: C.teal, border: `1px solid ${C.teal}25` }}>{p}</span>
              ))}
            </div>
            <div className="flex gap-4 mt-2 text-xs" style={{ color: C.muted }}>
              <span>Last seen: <span style={{ color: C.white }}>{v.lastSeen}</span></span>
              <span>Time on site: <span style={{ color: C.white }}>{v.timeOnSite}</span></span>
              <span>Income: <span style={{ color: C.gold }}>{v.income}</span></span>
            </div>
          </div>

          {/* Expanded contact + outreach */}
          <AnimatePresence>
            {expanded === i && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
                onClick={e => e.stopPropagation()}>
                <div className="px-4 pb-4 space-y-3" style={{ borderTop: `1px solid ${C.border}` }}>
                  {/* Contact block */}
                  <div className="pt-3">
                    <div className="text-xs font-black mb-2" style={{ color: C.orange }}>VERIFIED CONTACT RECORD</div>
                    <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
                      {[
                        ["Full Name", v.name.replace(".", "")],
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

                  {/* Quick outreach preview */}
                  <div>
                    <div className="text-xs font-black mb-2" style={{ color: C.teal }}>SUGGESTED OUTREACH</div>
                    <div className="rounded-xl p-3 text-xs leading-relaxed" style={{ background: `${C.teal}10`, border: `1px solid ${C.teal}25`, color: C.white }}>
                      {v.outreach}
                    </div>
                  </div>

                  {/* Full outreach channels */}
                  <div>
                    <div className="text-xs font-black mb-2" style={{ color: C.orange }}>MULTI-CHANNEL OUTREACH</div>
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
const SCENARIOS = [
  { label: "Starter", spend: 20000, leads: 133, meetings: 11, deals: 3, avgDeal: 75000, revenue: 225000, roi: 11, color: C.teal },
  { label: "Growth",  spend: 30000, leads: 200, meetings: 16, deals: 4, avgDeal: 100000, revenue: 400000, roi: 13, color: C.orange },
  { label: "Scale",   spend: 40000, leads: 267, meetings: 21, deals: 5, avgDeal: 150000, revenue: 750000, roi: 19, color: C.gold },
];

const MARKET_FACTS = [
  { stat: "$26.7B",   label: "Contactless biometric market in 2025",                 sub: "Growing 19.4% CAGR (Compound Annual Growth Rate) — fastest segment in digital health" },
  { stat: "$16,000",  label: "What US employers spend per employee/yr on benefits",   sub: "A 1,000-person hospital spends $16M/yr — SymCheck is a rounding error" },
  { stat: "$291",     label: "Annual medical cost savings per screened employee",     sub: "Optum: biometric screening reduces claims by $291/person/yr" },
  { stat: "$10K+",    label: "What competitors charge just for the SDK (Software Development Kit)", sub: "Shen.AI $10K/yr; Binah.ai & NuraLogix enterprise-only at $50K+" },
  { stat: "92%",      label: "HR Directors research wellness vendors anonymously",    sub: "They visit 4–6 vendor sites before ever filling out a form" },
  { stat: "$140K",    label: "Avg annual contract — regional hospital",              sub: "1,500-bed system at $8/employee/month = $144K/yr. One deal = 7x ROI" },
];

function TabROI() {
  // Single slider: $20K → $40K in $1K steps
  const [spend, setSpend] = useState(25000);
  const [avgDeal, setAvgDeal] = useState(100000);

  // Derived values scale linearly with spend
  const leads    = Math.round((spend / 20000) * 133);
  const meetings = Math.round(leads * 0.08);
  const deals    = Math.round(meetings * 0.25);
  const annualRevenue = deals * avgDeal;
  const roi = Math.round(((annualRevenue - spend) / spend) * 100);
  const payback = (spend / (annualRevenue / 12)).toFixed(1);
  const roiMultiple = (annualRevenue / spend).toFixed(1);

  // Tier label
  const tierLabel = spend <= 22000 ? { label: "Starter", color: C.teal } :
                    spend <= 32000 ? { label: "Growth",  color: C.orange } :
                                    { label: "Scale",   color: C.gold };

  // Projection data
  const projectionData = Array.from({ length: 12 }, (_, m) => ({
    month: `M${m + 1}`,
    revenue: Math.round((annualRevenue / 12) * (m + 1)),
    cost: spend,
  }));

  // Dummy sc for backward compat
  const sc = { spend, leads, meetings, deals, avgDeal, color: tierLabel.color };

  return (
    <div className="space-y-4">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <SL>ROI CALCULATOR — THE CASE FOR $20K–$40K/MO</SL>
        <div className="text-lg font-black mb-2" style={{ color: C.white }}>One New Enterprise Account Covers the Monthly Fee Many Times Over</div>
        <div className="text-sm leading-relaxed" style={{ color: C.muted }}>
          SymCheck's average enterprise contract runs{" "}
          <span style={{ color: C.orange, fontWeight: 900 }}>$75K–$280K/year</span> depending on org size.
          Exact Audience identifies the HR Directors, CNOs, and Benefits VPs who are actively researching wellness platforms right now —
          before they ever fill out a form. You get first-mover advantage on every in-market buyer.
        </div>
      </motion.div>

      {/* Market intelligence cards */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <SL color={C.teal}>MARKET INTELLIGENCE — WHAT MOST PEOPLE DON'T KNOW</SL>
        <div className="grid grid-cols-2 gap-3">
          {MARKET_FACTS.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 + i * 0.07 }}
              className="rounded-xl p-3" style={{ background: C.card2, border: `1px solid ${C.border}` }}>
              <div className="text-xl font-black" style={{ background: C.grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{f.stat}</div>
              <div className="text-xs font-bold mt-1" style={{ color: C.white }}>{f.label}</div>
              <div className="text-xs mt-1" style={{ color: C.muted }}>{f.sub}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── MAIN SPEND SLIDER ── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="rounded-2xl p-5 space-y-5" style={{ background: C.card, border: `2px solid ${tierLabel.color}` }}>
        <div className="flex items-center justify-between">
          <SL color={tierLabel.color}>YOUR EXACT AUDIENCE INVESTMENT</SL>
          <div className="px-3 py-1 rounded-full text-xs font-black" style={{ background: `${tierLabel.color}20`, color: tierLabel.color }}>
            {tierLabel.label}
          </div>
        </div>
        {/* Big spend display */}
        <div className="text-center">
          <div className="text-6xl font-black" style={{ background: C.grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            ${(spend / 1000).toFixed(0)}K
          </div>
          <div className="text-xs mt-1" style={{ color: C.muted }}>per month · adjust with slider below</div>
        </div>
        {/* Slider */}
        <div>
          <input type="range" min={20000} max={40000} step={1000} value={spend}
            onChange={e => setSpend(Number(e.target.value))}
            className="w-full" style={{ accentColor: tierLabel.color }} />
          <div className="flex justify-between text-xs mt-1" style={{ color: C.muted }}>
            <span>$20K/mo — Starter</span><span>$30K/mo — Growth</span><span>$40K/mo — Scale</span>
          </div>
        </div>
        {/* Live metrics row */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Targeted Leads",   value: leads.toLocaleString(),          color: tierLabel.color },
            { label: "Meetings Booked",  value: meetings.toLocaleString(),        color: C.teal },
            { label: "Deals Closed",     value: deals.toLocaleString(),           color: C.orange },
            { label: "ROI Multiple",     value: `${roiMultiple}x`,               color: C.gold },
          ].map((m, i) => (
            <div key={i} className="rounded-xl p-3 text-center" style={{ background: C.card2, border: `1px solid ${C.border}` }}>
              <div className="text-xl font-black" style={{ color: m.color }}>{m.value}</div>
              <div className="text-xs mt-0.5" style={{ color: C.muted }}>{m.label}</div>
            </div>
          ))}
        </div>
        {/* Summary sentence */}
        <div className="rounded-xl p-3 text-xs" style={{ background: `${tierLabel.color}10`, border: `1px solid ${tierLabel.color}25`, color: C.muted }}>
          <span style={{ color: tierLabel.color, fontWeight: 900 }}>${(spend/1000).toFixed(0)}K/mo invested → </span>
          {leads} targeted leads → {meetings} meetings booked (8% rate) → {deals} deals closed (25% close rate) →{" "}
          <span style={{ color: C.white, fontWeight: 900 }}>${annualRevenue.toLocaleString()} projected revenue</span> at ${avgDeal.toLocaleString()} avg ACV (Annual Contract Value)
        </div>
      </motion.div>

      {/* ACV slider */}
      <div className="rounded-2xl p-5 space-y-4" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <SL>ADJUST AVERAGE CONTRACT VALUE</SL>
        <div className="flex justify-between items-center">
          <span className="text-sm font-black" style={{ color: C.white }}>Avg Annual Contract Value (ACV)</span>
          <span className="text-2xl font-black" style={{ color: C.orange }}>${avgDeal.toLocaleString()}</span>
        </div>
        <input type="range" min={25000} max={500000} step={5000} value={avgDeal}
          onChange={e => setAvgDeal(Number(e.target.value))}
          className="w-full" style={{ accentColor: C.orange }} />
        <div className="flex justify-between text-xs" style={{ color: C.muted }}>
          <span>$25K — Clinic</span><span>$140K — Regional Hospital</span><span>$500K — Health System</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Projected Revenue",  value: `$${annualRevenue.toLocaleString()}`,              color: C.teal },
          { label: "EA Investment",      value: `$${spend.toLocaleString()}/mo`,                   color: C.muted },
          { label: "Net Return Year 1",  value: `$${(annualRevenue - spend).toLocaleString()}`,    color: C.orange },
          { label: "ROI",               value: `${roi}%`,                                          color: C.gold },
        ].map((s, i) => (
          <motion.div key={i} layout className="rounded-xl p-4 text-center" style={{ background: C.card, border: `1px solid ${C.border}` }}>
            <div className="text-2xl font-black" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs mt-1" style={{ color: C.muted }}>{s.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="rounded-2xl p-4 text-center" style={{ background: `${C.orange}12`, border: `1px solid ${C.orange}30` }}>
        <div className="text-xs font-black mb-1" style={{ color: C.orange }}>PAYBACK PERIOD</div>
        <div className="text-3xl font-black" style={{ color: C.white }}>{payback} months</div>
        <div className="text-xs mt-1" style={{ color: C.muted }}>to recover the full monthly platform investment</div>
      </div>

      {/* 12-month projection */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <SL color={C.teal}>12-MONTH REVENUE PROJECTION</SL>
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={projectionData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="projGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={C.teal} stopOpacity={0.35} />
                <stop offset="95%" stopColor={C.teal} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" tick={{ fill: C.muted, fontSize: 9 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: C.muted, fontSize: 9 }} axisLine={false} tickLine={false}
              tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} />
            <Tooltip contentStyle={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 8, color: C.white, fontSize: 11 }}
              formatter={(v: number) => [`$${v.toLocaleString()}`, ""]} />
            <Area type="monotone" dataKey="revenue" stroke={C.teal} strokeWidth={2} fill="url(#projGrad)" />
            <Line type="monotone" dataKey="cost" stroke={C.orange} strokeWidth={1.5} strokeDasharray="4 3" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
        <div className="flex gap-4 mt-2 text-xs" style={{ color: C.muted }}>
          <span><span style={{ color: C.teal }}>—</span> Cumulative Revenue</span>
          <span><span style={{ color: C.orange }}>- -</span> Platform Investment</span>
        </div>
      </motion.div>

      {/* Segment revenue chart */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
        className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <SL color={C.gold}>REVENUE OPPORTUNITY BY BUYER SEGMENT</SL>
        <div className="text-xs mb-3" style={{ color: C.muted }}>Average annual contract value by organization type</div>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={[
            { tier: "Clinic Network", revenue: 45000 },
            { tier: "Mid-Market Employer", revenue: 85000 },
            { tier: "Regional Hospital", revenue: 140000 },
            { tier: "Health System", revenue: 280000 },
            { tier: "Fortune 500", revenue: 450000 },
          ]} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
            <XAxis dataKey="tier" tick={{ fill: C.muted, fontSize: 9 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: C.muted, fontSize: 9 }} axisLine={false} tickLine={false}
              tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} />
            <Tooltip contentStyle={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 8, color: C.white, fontSize: 11 }}
              formatter={(v: number) => [`$${v.toLocaleString()}`, "Avg ACV"]} />
            <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
              {[C.tealDim, C.teal, C.gold, C.orange, C.orange].map((color, i) => (
                <Cell key={i} fill={color} fillOpacity={0.9} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      <div className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <SL color={C.gold}>THE MATH ON ONE ACCOUNT</SL>
        <div className="text-sm leading-relaxed" style={{ color: C.muted }}>
          If SymCheck closes just <span style={{ color: C.orange, fontWeight: 900 }}>one new health system relationship</span> worth $140K/year from a lead generated by Exact Audience, the platform has paid for itself entirely. Every additional account is pure margin.
        </div>
        <div className="mt-3 rounded-xl p-3 text-xs italic" style={{ background: `${C.teal}10`, border: `1px solid ${C.teal}20`, color: C.teal }}>
          "We handed Vanderbilt's VP of HR a call on Monday. By Thursday we had a demo scheduled. That one account is worth more than the annual platform fee." — How the conversation should end.
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
        <div className="text-lg font-black mb-1" style={{ color: C.white }}>10 Active Targets — Tennessee Market</div>
        <div className="text-sm" style={{ color: C.muted }}>
          Organizations actively evaluating wellness platforms right now. Ranked by intent score. Decision-maker contact included.
        </div>
      </motion.div>

      {TARGET_POOL.map((t, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
          className="rounded-2xl overflow-hidden cursor-pointer"
          style={{ background: C.card, border: `1px solid ${C.border}` }}
          onClick={() => setSelected(selected === i ? null : i)}>

          {/* Summary */}
          <div className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="font-black" style={{ color: C.white }}>{t.org}</div>
                <div className="text-xs mt-0.5" style={{ color: C.muted }}>{t.type} · {t.city}, {t.state} · {t.employees.toLocaleString()} employees</div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-2xl font-black" style={{ color: t.intensity >= 90 ? C.orange : t.intensity >= 80 ? C.gold : C.teal }}>{t.intensity}</div>
                <div className="text-xs" style={{ color: C.muted }}>intent</div>
              </div>
            </div>

            {/* Signal + trend */}
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

            {/* Sparkline + contact preview */}
            <div className="flex items-center justify-between mt-3">
              <div className="text-xs" style={{ color: C.muted }}>
                <span style={{ color: C.white }}>{t.contact.name}</span> · {t.contact.title}
              </div>
              <Sparkline data={t.sparkline} color={t.intensity >= 85 ? C.orange : C.teal} />
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mt-2">
              {t.tags.map((tag, j) => (
                <span key={j} className="px-1.5 py-0.5 rounded text-xs"
                  style={{ background: `${C.teal}12`, color: C.teal }}>{tag}</span>
              ))}
            </div>
          </div>

          {/* Expanded detail */}
          <AnimatePresence>
            {selected === i && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
                onClick={e => e.stopPropagation()}>
                <div className="px-4 pb-4 space-y-3" style={{ borderTop: `1px solid ${C.border}` }}>

                  {/* Activity summary */}
                  <div className="pt-3 rounded-xl p-3 text-xs italic leading-relaxed"
                    style={{ background: `${C.orange}10`, border: `1px solid ${C.orange}25`, color: C.orange }}>
                    {t.activitySummary}
                  </div>

                  {/* Behavioral signals */}
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

                  {/* Contact records */}
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

                  {/* Second contact if available */}
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

                  {/* Outreach */}
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
function TabLiveSearch() {
  const [state, setState] = useState("Tennessee");
  const [orgType, setOrgType] = useState("");
  const [title, setTitle] = useState("");
  const [minEmployees, setMinEmployees] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<TargetEntry[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [searchDone, setSearchDone] = useState(false);
  const [searchLabel, setSearchLabel] = useState("");
  const [loadingIdx, setLoadingIdx] = useState<number[]>([]);
  const [loadedIdx, setLoadedIdx] = useState<number[]>([]);

  const STATES = ["Tennessee", "Georgia", "Alabama", "Kentucky", "North Carolina", "Texas", "Florida", "Ohio", "Illinois", "New York", "California"];
  const ORG_TYPES = ["", "Health System", "Hospital", "Employer Group", "Clinic Network", "Insurance"];
  const TITLES = ["", "VP of Human Resources", "Director of Benefits", "Chief People Officer", "Chief Wellness Officer", "SVP Benefits & Total Rewards", "Director of Wellness", "VP Population Health"];
  const EMP_SIZES = ["", "500", "1000", "5000", "10000", "50000"];

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
    if (minEmployees) parts.push(`${parseInt(minEmployees).toLocaleString()}+ employees`);
    setSearchLabel(parts.join(" · "));

    let pool = [...SEARCH_POOL];
    if (orgType) pool = pool.filter(t => t.type === orgType || t.tags.some(tag => tag.toLowerCase().includes(orgType.toLowerCase())));
    if (minEmployees) pool = pool.filter(t => t.employees >= parseInt(minEmployees));
    if (title) pool = pool.filter(t => t.contact.title.toLowerCase().includes(title.split(" ").pop()!.toLowerCase()) || (t.contact2 && t.contact2.title.toLowerCase().includes(title.split(" ").pop()!.toLowerCase())));
    if (pool.length < 3) pool = SEARCH_POOL.slice(0, 6);
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
      {/* Search form */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <SL>EXACT AUDIENCE — LIVE WELLNESS BUYER SEARCH</SL>
        <div className="text-lg font-black mb-1" style={{ color: C.white }}>Find In-Market Wellness Buyers</div>
        <div className="text-sm mb-4" style={{ color: C.muted }}>Search by criteria to surface organizations actively evaluating wellness platforms right now.</div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <div className="text-xs font-black mb-1" style={{ color: C.muted }}>STATE / MARKET</div>
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
            <div className="text-xs font-black mb-1" style={{ color: C.muted }}>MIN EMPLOYEE COUNT</div>
            <select value={minEmployees} onChange={e => setMinEmployees(e.target.value)}
              className="w-full rounded-lg px-3 py-2 text-sm font-bold"
              style={{ background: C.card2, color: C.white, border: `1px solid ${C.border}`, outline: "none" }}>
              <option value="">Any size</option>
              {EMP_SIZES.filter(Boolean).map(s => <option key={s} value={s}>{parseInt(s).toLocaleString()}+ employees</option>)}
            </select>
          </div>
        </div>

        <button onClick={runSearch} disabled={searching}
          className="w-full py-3 rounded-xl font-black text-sm transition-all active:scale-95"
          style={{ background: searching ? C.border : C.grad, color: searching ? C.muted : C.bg, cursor: searching ? "not-allowed" : "pointer" }}>
          {searching ? "Searching Exact Audience Database..." : "Search In-Market Wellness Buyers"}
        </button>
      </motion.div>

      {/* Searching animation */}
      {searching && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="rounded-2xl p-4 text-center" style={{ background: C.card, border: `1px solid ${C.border}` }}>
          <div className="flex items-center justify-center gap-2 text-sm font-black" style={{ color: C.teal }}>
            <div className="w-2 h-2 rounded-full" style={{ background: C.teal, animation: "pulse-dot 1s infinite" }} />
            Scanning Exact Audience database for {searchLabel}...
          </div>
        </motion.div>
      )}

      {/* Results count */}
      {searchDone && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="text-xs font-black" style={{ color: C.orange }}>
          {results.length} IN-MARKET WELLNESS BUYERS FOUND — {searchLabel}
        </motion.div>
      )}

      {/* Result cards */}
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
                  <div className="text-xs mt-0.5" style={{ color: C.muted }}>{t.type} · {t.city}, {t.state} · {t.employees.toLocaleString()} employees</div>
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

              {/* LeadFi-style loading for contact data */}
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

            {/* Expanded */}
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
                          ["Org Size", `${t.employees.toLocaleString()} employees`],
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
export default function SymCheckDashboard() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("how");

  return (
    <div className="min-h-screen" style={{ background: C.bg, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <style>{`
        @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.6;transform:scale(1.5)} }
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        .animate-pulse { animation: pulse 1.5s ease-in-out infinite; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
      `}</style>

      {/* Header */}
      <div className="sticky top-0 z-40 px-4 pt-4 pb-3" style={{ background: C.bg, borderBottom: `1px solid ${C.border}` }}>
        <button onClick={() => navigate("/")} className="flex items-center gap-1.5 text-xs mb-3" style={{ color: C.muted }}>
          ← Back to Campaigns
        </button>
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-0.5">
              <img src={symcheckLogo} alt="SymCheck" style={{ height: 32, width: 'auto', objectFit: 'contain' }} />
              <span className="text-xs font-black px-2 py-0.5 rounded" style={{ background: C.grad, color: C.bg }}>EXACT AUDIENCE</span>
            </div>
            <div className="text-xs" style={{ color: C.muted }}>AI-Powered Wellness Intelligence · Tennessee Market · Exact Audience + SiteID</div>
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
