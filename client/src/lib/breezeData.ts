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
  budget: "$89,000",
  website: "meetbreeze.com",
};

export const BREEZE_LIVE_BASE = {
  impressions: 2847420,
  reach: 184210,
  completions: 2397200,
  siteVisitors: 48420,
  conversions: 1847,
  frequency: 2.4,
  completionRate: 84.2,
  avgCpm: 11.80,
};

export const BREEZE_DAILY_IMPRESSIONS = [
  { day: "May 1",  ctv: 8400,  youtube: 12600, display: 14200, meta: 29500, google: 25300, email: 4200 },
  { day: "May 5",  ctv: 9100,  youtube: 13700, display: 15400, meta: 32000, google: 27400, email: 4600 },
  { day: "May 10", ctv: 9900,  youtube: 14800, display: 16600, meta: 34500, google: 29600, email: 5000 },
  { day: "May 15", ctv: 11200, youtube: 16800, display: 18900, meta: 39300, google: 33700, email: 5700 },
  { day: "May 20", ctv: 12500, youtube: 18700, display: 21000, meta: 43700, google: 37400, email: 6300 },
  { day: "May 25", ctv: 13800, youtube: 20700, display: 23200, meta: 48400, google: 41500, email: 7000 },
  { day: "May 31", ctv: 14900, youtube: 22300, display: 25000, meta: 52100, google: 44700, email: 7500 },
];

// Channel mix: Meta, Google, LinkedIn, Email — minimal CTV
export const BREEZE_MEDIA_MIX = [
  { channel: "Meta (Facebook/Instagram)", pct: 35, color: "#1877F2", spend: 31150, impressions: 997000 },
  { channel: "Google (Search + Display)", pct: 30, color: "#4285F4", spend: 26700, impressions: 854200 },
  { channel: "LinkedIn",                  pct: 25, color: "#0A66C2", spend: 22250, impressions: 711800 },
  { channel: "Email Marketing",           pct: 7,  color: "#10b981", spend: 6230,  impressions: 185400 },
  { channel: "CTV/OTT (minimal)",         pct: 3,  color: "#0ea5e9", spend: 2670,  impressions: 98300  },
];

// CTV is minimal — just 3 channels
export const BREEZE_CTV_CHANNELS = [
  { name: "Hulu",         impressions: 48200,  completions: 40900,  cpm: 22.40, frequency: 1.4, completionRate: 84.9, color: "#1ce783" },
  { name: "Peacock",      impressions: 31400,  completions: 26700,  cpm: 18.80, frequency: 1.2, completionRate: 85.0, color: "#000000" },
  { name: "Tubi",         impressions: 18700,  completions: 15400,  cpm: 12.40, frequency: 1.1, completionRate: 82.4, color: "#FA4616" },
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
