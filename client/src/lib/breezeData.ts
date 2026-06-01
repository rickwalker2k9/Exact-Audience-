/**
 * breezeData.ts
 * Breeze Insurance — Disability Insurance Digital Campaign 2026
 * Channel mix: Meta (35%), Google (30%), LinkedIn (25%), Email (10%) — minimal CTV
 */

export const BREEZE_CLIENT = {
  name: "Breeze Insurance",
  logo: "🌬️",
  vertical: "Insurance",
  campaign: "Disability Insurance — Working Professionals 2026",
  accentColor: "#0ea5e9",
  dashboardId: "breeze-insurance" as const,
  location: "National",
  budget: "$21,500",
  website: "meetbreeze.com",
};

// $21,500 digital-only (no TV yet). Reach 80K unique professionals across Meta/Google/LinkedIn/Email.
// At $11.80 avg CPM across digital channels: ~1.82M impressions served to 80K unique people = 22.8x avg frequency
export const BREEZE_LIVE_BASE = {
  impressions: 1820000,  // $21,500 / $11.80 CPM × 1000
  reach: 80000,          // 80K unique professionals reached
  completions: 1532000,  // 84.2% completion rate
  siteVisitors: 8400,    // ~10.5% click-through to site
  conversions: 312,      // ~3.7% conversion rate from site visitors
  frequency: 22.8,       // 1.82M impressions / 80K reach
  completionRate: 84.2,
  avgCpm: 11.80,
};

// Digital-only impressions (no CTV yet). Total ~1.82M across 31 days.
export const BREEZE_DAILY_IMPRESSIONS = [
  { day: "May 1",  ctv: 0, youtube: 0, display: 14800, meta: 36200, google: 31000, email: 5200 },
  { day: "May 5",  ctv: 0, youtube: 0, display: 16100, meta: 39300, google: 33700, email: 5700 },
  { day: "May 10", ctv: 0, youtube: 0, display: 17400, meta: 42600, google: 36500, email: 6100 },
  { day: "May 15", ctv: 0, youtube: 0, display: 19700, meta: 48200, google: 41300, email: 6900 },
  { day: "May 20", ctv: 0, youtube: 0, display: 22000, meta: 53800, google: 46100, email: 7700 },
  { day: "May 25", ctv: 0, youtube: 0, display: 24300, meta: 59400, google: 50900, email: 8500 },
  { day: "May 31", ctv: 0, youtube: 0, display: 26200, meta: 64000, google: 54800, email: 9200 },
];

// Channel mix: Meta (35%), Google (30%), LinkedIn (25%), Email (7%), CTV (3%) — Total: $21,500
export const BREEZE_MEDIA_MIX = [
  { channel: "Meta (Facebook/Instagram)", pct: 35, color: "#1877F2", spend: 7525,  impressions: 237000 },
  { channel: "Google (Search + Display)", pct: 30, color: "#4285F4", spend: 6450,  impressions: 203000 },
  { channel: "LinkedIn",                  pct: 25, color: "#0A66C2", spend: 5375,  impressions: 169000 },
  { channel: "Email Marketing",           pct: 7,  color: "#10b981", spend: 1505,  impressions:  47000 },
  { channel: "CTV/OTT (minimal)",         pct: 3,  color: "#0ea5e9", spend:   645, impressions:  20000 },
]; // Total: $21,500

// CTV NOT YET ACTIVATED — these are the recommended platforms for Breeze's professional/income-protection audience
// Ranked by audience quality index for working professionals aged 28–54, HHI $75K+
export const BREEZE_CTV_CHANNELS = [
  { name: "Hulu",              tier: "premium",  cpm: 22.40, estReach: 28000, completionRate: 87.2, audienceScore: 94, color: "#1ce783",  note: "#1 reach among 30–49 professionals; strong news & drama inventory" },
  { name: "Peacock",           tier: "premium",  cpm: 18.80, estReach: 22000, completionRate: 85.0, audienceScore: 91, color: "#6b7280",  note: "NBC Universal content; high-income household skew" },
  { name: "YouTube TV",        tier: "premium",  cpm: 20.10, estReach: 19500, completionRate: 88.4, audienceScore: 90, color: "#FF0000",  note: "Live TV subscribers; highest completion rate in category" },
  { name: "Sling TV",          tier: "news",     cpm: 16.40, estReach: 17000, completionRate: 83.1, audienceScore: 86, color: "#0097d4",  note: "Cable-cutter households; strong news & business channel mix" },
  { name: "Disney+",           tier: "premium",  cpm: 21.50, estReach: 15500, completionRate: 86.7, audienceScore: 82, color: "#113CCF",  note: "Family breadwinner households; premium brand-safe environment" },
  { name: "Paramount+",        tier: "news",     cpm: 17.20, estReach: 14200, completionRate: 84.3, audienceScore: 81, color: "#0064FF",  note: "CBS News access; strong 35–54 professional demo" },
  { name: "ESPN+ / ESPN",       tier: "sports",   cpm: 24.80, estReach: 13800, completionRate: 82.6, audienceScore: 79, color: "#CC0000",  note: "Self-employed & small business owners; high-income sports viewers" },
  { name: "Max (HBO Max)",      tier: "premium",  cpm: 23.60, estReach: 12400, completionRate: 89.1, audienceScore: 88, color: "#002BE7",  note: "Highest-income subscriber base; premium drama & documentary" },
  { name: "Tubi",              tier: "broad",    cpm: 12.40, estReach: 18000, completionRate: 81.4, audienceScore: 68, color: "#f97316",  note: "Free ad-supported; broadest reach at lowest CPM for retargeting" },
  { name: "Pluto TV",          tier: "broad",    cpm: 10.80, estReach: 16500, completionRate: 79.8, audienceScore: 65, color: "#7c3aed",  note: "FAST platform; strong for frequency extension at low cost" },
  { name: "CNBC / NBCUniversal",tier: "news",    cpm: 26.50, estReach: 9800,  completionRate: 90.2, audienceScore: 96, color: "#0078D4",  note: "Highest audience quality score — business/finance news viewers = income protection buyers" },
  { name: "Bloomberg TV",      tier: "news",     cpm: 28.10, estReach: 7200,  completionRate: 91.4, audienceScore: 97, color: "#f59e0b",  note: "Smallest reach but highest-value audience: HHI $150K+, self-employed executives" },
];

export const BREEZE_CREATIVES = [
  { name: "Income Protection — Meta :30",       impressions: 487200, completions: 410200, cpm: 12.40, completionRate: 84.2, format: "Meta Video :30"     },
  { name: "LinkedIn Sponsored Post — Professional", impressions: 312400, completions: 264900, cpm: 18.80, completionRate: 84.8, format: "LinkedIn Static"  },
  { name: "Google Search — Disability Insurance",impressions: 284700, completions: 240100, cpm: 8.20,  completionRate: 84.3, format: "Search Ad"          },
  { name: "Email — VALID GOLD List",            impressions: 43900,  completions: 31200,  cpm: 2.40,  completionRate: 71.1, format: "Email Campaign"     },
  { name: "Meta Carousel — Coverage Options",   impressions: 198400, completions: 166900, cpm: 11.80, completionRate: 84.1, format: "Meta Carousel"      },
  { name: "Google Display — Retargeting",       impressions: 147200, completions: 124100, cpm: 6.40,  completionRate: 84.3, format: "Display Ad"         },
];

export const BREEZE_MOODS = [
  { label: "Income Protection Seekers",  count: 34, color: "#0ea5e9", desc: "Professionals seeking income replacement coverage" },
  { label: "Self-Employed Professionals",count: 26, color: "#0A66C2", desc: "Freelancers and business owners without employer benefits" },
  { label: "Family Breadwinners",        count: 18, color: "#1877F2", desc: "Primary earners protecting their household income" },
  { label: "Healthcare Workers",         count: 12, color: "#10b981", desc: "Nurses, therapists, and medical professionals" },
  { label: "Undecided / Researching",    count: 10, color: "#64748b", desc: "Comparison shoppers evaluating coverage options" },
];

export const BREEZE_VISITORS = [
  { first: "Michael",   last: "Hartley",   city: "Arlington",   zip: "22201", income: "$95K–$130K", networth: "$180K–$350K", credit: "A", job: "Software Engineer",    company: "Booz Allen",    score: 91, mood: "Income Protection Seeker",   time: "2m ago"  },
  { first: "Sarah",     last: "Kowalski",  city: "Denver",      zip: "80201", income: "$110K–$150K",networth: "$220K–$420K", credit: "A", job: "Freelance Consultant",  company: "Self-Employed", score: 94, mood: "Self-Employed Professional",  time: "4m ago"  },
  { first: "James",     last: "Nguyen",    city: "Seattle",     zip: "98101", income: "$85K–$120K", networth: "$150K–$300K", credit: "B", job: "Project Manager",      company: "Amazon",        score: 82, mood: "Family Breadwinner",          time: "7m ago"  },
  { first: "Patricia",  last: "Delgado",   city: "Miami",       zip: "33101", income: "$90K–$130K", networth: "$170K–$340K", credit: "A", job: "Physical Therapist",    company: "Baptist Health",score: 88, mood: "Healthcare Worker",           time: "11m ago" },
  { first: "Robert",    last: "Osei",      city: "Chicago",     zip: "60601", income: "$80K–$115K", networth: "$130K–$260K", credit: "B", job: "Marketing Manager",    company: "Publicis",      score: 76, mood: "Income Protection Seeker",   time: "14m ago" },
  { first: "Angela",    last: "Fontaine",  city: "Nashville",   zip: "37201", income: "$75K–$110K", networth: "$120K–$240K", credit: "B", job: "Independent Realtor",  company: "Self-Employed", score: 84, mood: "Self-Employed Professional",  time: "18m ago" },
  { first: "Christopher",last: "Webb",     city: "Phoenix",     zip: "85001", income: "$80K–$115K", networth: "$130K–$260K", credit: "B", job: "Operations Manager",   company: "Honeywell",     score: 79, mood: "Family Breadwinner",          time: "22m ago" },
  { first: "Sandra",    last: "Bergstrom", city: "Portland",    zip: "97201", income: "$95K–$135K", networth: "$180K–$360K", credit: "A", job: "Nurse Practitioner",   company: "OHSU",          score: 90, mood: "Healthcare Worker",           time: "26m ago" },
  { first: "William",   last: "Chambers",  city: "Baltimore",   zip: "21201", income: "$70K–$100K", networth: "$110K–$220K", credit: "B", job: "Graphic Designer",     company: "Freelance",     score: 64, mood: "Undecided / Researching",    time: "31m ago" },
  { first: "Dorothy",   last: "Morales",   city: "San Antonio", zip: "78201", income: "$75K–$110K", networth: "$120K–$240K", credit: "B", job: "HR Specialist",        company: "USAA",          score: 81, mood: "Self-Employed Professional",  time: "36m ago" },
  { first: "Harold",    last: "Kimura",    city: "Honolulu",    zip: "96801", income: "$85K–$120K", networth: "$150K–$300K", credit: "A", job: "Dentist",              company: "Private Practice",score: 87, mood: "Healthcare Worker",          time: "42m ago" },
  { first: "Catherine", last: "Morse",     city: "Boston",      zip: "02101", income: "$100K–$145K",networth: "$200K–$400K", credit: "A", job: "Attorney",             company: "Self-Employed", score: 93, mood: "Income Protection Seeker",   time: "48m ago" },
];

export const BREEZE_SITE_PAGES = [
  { label: "Short-Term Disability",  views: 48420,  avgTime: "3:42", bounce: 28, color: "#0ea5e9" },
  { label: "Long-Term Disability",   views: 41280,  avgTime: "4:18", bounce: 24, color: "#0A66C2" },
  { label: "Self-Employed Coverage", views: 34710,  avgTime: "4:52", bounce: 21, color: "#1877F2" },
  { label: "Get a Quote",            views: 28940,  avgTime: "5:14", bounce: 18, color: "#10b981" },
  { label: "How It Works",           views: 22180,  avgTime: "3:28", bounce: 32, color: "#f59e0b" },
  { label: "Pricing",                views: 18470,  avgTime: "4:01", bounce: 26, color: "#a78bfa" },
];

export const BREEZE_QR = undefined;
