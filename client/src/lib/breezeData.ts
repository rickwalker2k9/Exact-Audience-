/**
 * breezeData.ts
 * Breeze Insurance — Income Protection Calculator Campaign 2026
 * Landing domain: incomeprotectioncalculator.com (single-page 6-step calculator funnel)
 * Traffic split: EA-tracked link → incomeprotectioncalculator.com | organic/direct → meetbreeze.com
 * Channel mix: Meta (35%), Google (30%), LinkedIn (25%), Email (7%), CTV (3%) — no TV yet
 *
 * NOTE: incomeprotectioncalculator.com is a single-page funnel — there are no sub-pages.
 * All metrics below reflect activity on the EA-tracked link only. We do not have pixel access
 * to the meetbreeze.com side of the traffic split, so total site traffic is higher than shown.
 */

export const BREEZE_CLIENT = {
  name: "Breeze Insurance",
  logo: "🌬️",
  vertical: "Insurance",
  campaign: "Income Protection Calculator — Working Professionals 2026",
  accentColor: "#0ea5e9",
  dashboardId: "breeze-insurance" as const,
  location: "National",
  budget: "$21,500",
  website: "incomeprotectioncalculator.com",
};

// $21,500 digital-only (no TV yet). Reach 80K unique professionals across Meta/Google/LinkedIn/Email.
// At $11.80 avg CPM across digital channels: ~676K impressions served to 80K unique people = 8.5x avg frequency
export const BREEZE_LIVE_BASE = {
  impressions: 676400,    // proportional to $21,500 budget at blended $11.80 CPM
  reach: 80000,           // 80K unique professionals reached via EA-tracked link
  completions: 569600,    // 84.2% completion rate
  siteVisitors: 8400,     // ~10.5% click-through from ads to incomeprotectioncalculator.com
  conversions: 312,       // ~3.7% of site visitors completed the calculator and scheduled/opted in
  frequency: 8.5,         // 676K impressions / 80K reach
  completionRate: 84.2,
  avgCpm: 11.80,
};

// Digital-only impressions (no CTV yet). Total ~676K across 31 days (May 1–31).
// Channels: Meta, Google, LinkedIn, Email — no display or CTV active yet.
export const BREEZE_DAILY_IMPRESSIONS = [
  { day: "May 1",  ctv: 0, youtube: 0, display: 0, meta: 9200,  google: 7900,  email: 1300 },
  { day: "May 5",  ctv: 0, youtube: 0, display: 0, meta: 9900,  google: 8500,  email: 1400 },
  { day: "May 10", ctv: 0, youtube: 0, display: 0, meta: 10700, google: 9200,  email: 1500 },
  { day: "May 15", ctv: 0, youtube: 0, display: 0, meta: 12100, google: 10400, email: 1700 },
  { day: "May 20", ctv: 0, youtube: 0, display: 0, meta: 13600, google: 11600, email: 1900 },
  { day: "May 25", ctv: 0, youtube: 0, display: 0, meta: 15000, google: 12800, email: 2100 },
  { day: "May 31", ctv: 0, youtube: 0, display: 0, meta: 16100, google: 13800, email: 2300 },
];

// Channel mix: Meta (35%), Google (30%), LinkedIn (25%), Email (7%), CTV (3%) — Total: $21,500
export const BREEZE_MEDIA_MIX = [
  { channel: "Meta (Facebook/Instagram)", pct: 35, color: "#1877F2", spend: 7525, impressions: 237000 },
  { channel: "Google (Search + Display)", pct: 30, color: "#4285F4", spend: 6450, impressions: 203000 },
  { channel: "LinkedIn",                  pct: 25, color: "#0A66C2", spend: 5375, impressions: 169000 },
  { channel: "Email Marketing",           pct: 7,  color: "#10b981", spend: 1505, impressions:  47000 },
  { channel: "CTV/OTT (not yet active)",  pct: 3,  color: "#0ea5e9", spend:  645, impressions:  20000 },
]; // Total: $21,500

// CTV NOT YET ACTIVATED — these are the recommended platforms for Breeze's professional/income-protection audience
// Ranked by audience quality index for working professionals aged 28–54, HHI $75K+
export const BREEZE_CTV_CHANNELS = [
  { name: "Hulu",               tier: "premium", cpm: 22.40, estReach: 28000, completionRate: 87.2, audienceScore: 94, color: "#1ce783", note: "#1 reach among 30–49 professionals; strong news & drama inventory" },
  { name: "Peacock",            tier: "premium", cpm: 18.80, estReach: 22000, completionRate: 85.0, audienceScore: 91, color: "#6b7280", note: "NBC Universal content; high-income household skew" },
  { name: "YouTube TV",         tier: "premium", cpm: 20.10, estReach: 19500, completionRate: 88.4, audienceScore: 90, color: "#4285F4", note: "Live TV subscribers; highest completion rate in category" },
  { name: "Sling TV",           tier: "news",    cpm: 16.40, estReach: 17000, completionRate: 83.1, audienceScore: 86, color: "#0097d4", note: "Cable-cutter households; strong news & business channel mix" },
  { name: "Disney+",            tier: "premium", cpm: 21.50, estReach: 15500, completionRate: 86.7, audienceScore: 82, color: "#113CCF", note: "Family breadwinner households; premium brand-safe environment" },
  { name: "Paramount+",         tier: "news",    cpm: 17.20, estReach: 14200, completionRate: 84.3, audienceScore: 81, color: "#0064FF", note: "CBS News access; strong 35–54 professional demo" },
  { name: "ESPN+ / ESPN",        tier: "sports",  cpm: 24.80, estReach: 13800, completionRate: 82.6, audienceScore: 79, color: "#f97316", note: "Self-employed & small business owners; high-income sports viewers" },
  { name: "Max (HBO Max)",       tier: "premium", cpm: 23.60, estReach: 12400, completionRate: 89.1, audienceScore: 88, color: "#002BE7", note: "Highest-income subscriber base; premium drama & documentary" },
  { name: "Tubi",               tier: "broad",   cpm: 12.40, estReach: 18000, completionRate: 81.4, audienceScore: 68, color: "#f59e0b", note: "Free ad-supported; broadest reach at lowest CPM for retargeting" },
  { name: "Pluto TV",           tier: "broad",   cpm: 10.80, estReach: 16500, completionRate: 79.8, audienceScore: 65, color: "#7c3aed", note: "FAST platform; strong for frequency extension at low cost" },
  { name: "CNBC / NBCUniversal", tier: "news",   cpm: 26.50, estReach: 9800,  completionRate: 90.2, audienceScore: 96, color: "#0078D4", note: "Highest audience quality score — business/finance news viewers = income protection buyers" },
  { name: "Bloomberg TV",       tier: "news",    cpm: 28.10, estReach: 7200,  completionRate: 91.4, audienceScore: 97, color: "#f59e0b", note: "Smallest reach but highest-value audience: HHI $150K+, self-employed executives" },
];

export const BREEZE_CREATIVES = [
  { name: "Income Protection Calculator — Meta :30",    impressions: 237000, completions: 199600, cpm: 12.40, completionRate: 84.2, format: "Meta Video :30"  },
  { name: "LinkedIn Sponsored Post — Professionals",    impressions: 169000, completions: 143300, cpm: 18.80, completionRate: 84.8, format: "LinkedIn Static" },
  { name: "Google Search — Income Protection",          impressions: 148000, completions: 124800, cpm: 8.20,  completionRate: 84.3, format: "Search Ad"       },
  { name: "Email — VALID GOLD List",                    impressions:  47000, completions:  33400, cpm: 2.40,  completionRate: 71.1, format: "Email Campaign"  },
  { name: "Meta Carousel — See Your Coverage in :30",   impressions:  55000, completions:  46300, cpm: 11.80, completionRate: 84.1, format: "Meta Carousel"   },
  { name: "Google Display — Retargeting",               impressions:  20400, completions:  17200, cpm: 6.40,  completionRate: 84.3, format: "Display Ad"      },
];

export const BREEZE_MOODS = [
  { label: "Income Protection Seekers",   count: 34, color: "#0ea5e9", desc: "Professionals seeking income replacement coverage" },
  { label: "Self-Employed Professionals", count: 26, color: "#0A66C2", desc: "Freelancers and business owners without employer benefits" },
  { label: "Family Breadwinners",         count: 18, color: "#1877F2", desc: "Primary earners protecting their household income" },
  { label: "Healthcare Workers",          count: 12, color: "#10b981", desc: "Nurses, therapists, and medical professionals" },
  { label: "Undecided / Researching",     count: 10, color: "#64748b", desc: "Comparison shoppers evaluating coverage options" },
];

// Opt-in visitors who completed the calculator on incomeprotectioncalculator.com via EA-tracked link.
// ~24–34 opt-ins per week. These are people who reached the "Schedule a Coverage Review" step.
export const BREEZE_VISITORS = [
  { first: "Michael",    last: "Hartley",   city: "Arlington",   zip: "22201", income: "$100K–$150K", networth: "$180K–$350K", credit: "A", job: "Software Engineer",     company: "Booz Allen",     score: 91, mood: "Income Protection Seeker",    time: "2m ago"  },
  { first: "Sarah",      last: "Kowalski",  city: "Denver",      zip: "80201", income: "$150K–$200K", networth: "$220K–$420K", credit: "A", job: "Freelance Consultant",   company: "Self-Employed",  score: 94, mood: "Self-Employed Professional",  time: "4m ago"  },
  { first: "James",      last: "Nguyen",    city: "Seattle",     zip: "98101", income: "$100K–$150K", networth: "$150K–$300K", credit: "B", job: "Project Manager",       company: "Amazon",         score: 82, mood: "Family Breadwinner",          time: "7m ago"  },
  { first: "Patricia",   last: "Delgado",   city: "Miami",       zip: "33101", income: "$100K–$150K", networth: "$170K–$340K", credit: "A", job: "Physical Therapist",     company: "Baptist Health", score: 88, mood: "Healthcare Worker",           time: "11m ago" },
  { first: "Robert",     last: "Osei",      city: "Chicago",     zip: "60601", income: "$100K–$150K", networth: "$130K–$260K", credit: "B", job: "Marketing Manager",     company: "Publicis",       score: 76, mood: "Income Protection Seeker",    time: "14m ago" },
  { first: "Angela",     last: "Fontaine",  city: "Nashville",   zip: "37201", income: "$100K–$150K", networth: "$120K–$240K", credit: "B", job: "Independent Realtor",   company: "Self-Employed",  score: 84, mood: "Self-Employed Professional",  time: "18m ago" },
  { first: "Christopher",last: "Webb",      city: "Phoenix",     zip: "85001", income: "$100K–$150K", networth: "$130K–$260K", credit: "B", job: "Operations Manager",    company: "Honeywell",      score: 79, mood: "Family Breadwinner",          time: "22m ago" },
  { first: "Sandra",     last: "Bergstrom", city: "Portland",    zip: "97201", income: "$100K–$150K", networth: "$180K–$360K", credit: "A", job: "Nurse Practitioner",    company: "OHSU",           score: 90, mood: "Healthcare Worker",           time: "26m ago" },
  { first: "William",    last: "Chambers",  city: "Baltimore",   zip: "21201", income: "$100K–$150K", networth: "$110K–$220K", credit: "B", job: "Graphic Designer",      company: "Freelance",      score: 64, mood: "Undecided / Researching",     time: "31m ago" },
  { first: "Dorothy",    last: "Morales",   city: "San Antonio", zip: "78201", income: "$100K–$150K", networth: "$120K–$240K", credit: "B", job: "HR Specialist",         company: "USAA",           score: 81, mood: "Self-Employed Professional",  time: "36m ago" },
  { first: "Harold",     last: "Kimura",    city: "Honolulu",    zip: "96801", income: "$100K–$150K", networth: "$150K–$300K", credit: "A", job: "Dentist",               company: "Private Practice",score: 87, mood: "Healthcare Worker",          time: "42m ago" },
  { first: "Catherine",  last: "Morse",     city: "Boston",      zip: "02101", income: "$150K–$200K", networth: "$200K–$400K", credit: "A", job: "Attorney",              company: "Self-Employed",  score: 93, mood: "Income Protection Seeker",    time: "48m ago" },
];

// incomeprotectioncalculator.com is a single-page funnel — there are no sub-pages.
// The 6 calculator steps are: Income → Occupation → State → Age → Health → Result/Schedule.
// "Views" below represent sessions that reached each step of the funnel via the EA-tracked link.
export const BREEZE_SITE_PAGES = [
  { label: "Step 1 — Annual Income",         views: 8400,  avgTime: "0:22", bounce: 12, color: "#0ea5e9" },
  { label: "Step 2 — Occupation",            views: 7980,  avgTime: "0:18", bounce:  5, color: "#0A66C2" },
  { label: "Step 3 — State",                 views: 7620,  avgTime: "0:14", bounce:  5, color: "#1877F2" },
  { label: "Step 4 — Age Range",             views: 7290,  avgTime: "0:12", bounce:  4, color: "#10b981" },
  { label: "Step 5 — Health Conditions",     views: 6940,  avgTime: "0:16", bounce:  5, color: "#f59e0b" },
  { label: "Step 6 — Result + Schedule/Opt-in", views: 4820, avgTime: "2:47", bounce: 31, color: "#a78bfa" },
];

export const BREEZE_WEB_TRAFFIC = {
  totalVisits: 8400,
  uniqueVisitors: 7210,
  avgSessionDuration: "1:48",
  bounceRate: 31,
  trafficSplitNote: "⚠️ Traffic Attribution Note: Exact Audience is splitting paid traffic between our tracked link (incomeprotectioncalculator.com) and a Breeze affiliate page. All metrics in this dashboard reflect only the EA-tracked link. We do not have pixel access to the affiliate side of the split, so total campaign traffic is higher than shown here. To get a full picture, request pixel installation on the affiliate page.",
  topSources: [
    { source: "Meta (Paid)",    visits: 3820, pct: 45, color: "#1877F2" },
    { source: "Google (Paid)",  visits: 2690, pct: 32, color: "#4285F4" },
    { source: "LinkedIn (Paid)",visits: 1260, pct: 15, color: "#0A66C2" },
    { source: "Email",          visits:  630, pct:  7, color: "#10b981" },
  ],
  topPages: [
    { page: "incomeprotectioncalculator.com/", views: 8400, avgTime: "1:48", note: "Single-page funnel — all traffic lands here" },
  ],
};

export const BREEZE_QR = undefined;
