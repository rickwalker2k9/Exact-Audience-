// Exact Audience — Warby Parker Campaign Data
// New York, NY | Eyewear & Retail | Spring Vision 2026

export const WARBY_CLIENT = {
  name: "Warby Parker",
  location: "New York, NY",
  vertical: "Eyewear & Retail",
  campaign: "Spring Vision 2026",
  startDate: "May 1, 2026",
  budget: "$84,000",
  website: "warbyparker.com",
};

export const WARBY_KPI_TARGETS = {
  impressions: 4800000,
  reach: 192000,
  completions: 4128000,
  siteVisitors: 2840,
  conversions: 1248,
};

export const WARBY_LIVE_BASE = {
  impressions: 4428700,
  reach: 174200,
  completions: 3797200,
  siteVisitors: 2618,
  conversions: 1147,
  frequency: 2.54,
  completionRate: 85.8,
  avgCpm: 17.42,
};

export const WARBY_DAILY_IMPRESSIONS = [
  { day: "May 1",  ctv: 47200, youtube: 12400, display: 8200, meta: 9800, google: 7400, email: 5200, qr: 2800 },
  { day: "May 2",  ctv: 50400, youtube: 13200, display: 8700, meta: 10400, google: 7900, email: 5500, qr: 3000 },
  { day: "May 3",  ctv: 52800, youtube: 13800, display: 9100, meta: 10900, google: 8200, email: 5800, qr: 3100 },
  { day: "May 4",  ctv: 49200, youtube: 12900, display: 8500, meta: 10200, google: 7700, email: 5400, qr: 2900 },
  { day: "May 5",  ctv: 55600, youtube: 14600, display: 9600, meta: 11500, google: 8700, email: 6100, qr: 3300 },
  { day: "May 6",  ctv: 58400, youtube: 15300, display: 10100, meta: 12100, google: 9100, email: 6400, qr: 3500 },
  { day: "May 7",  ctv: 62200, youtube: 16300, display: 10700, meta: 12900, google: 9700, email: 6800, qr: 3700 },
  { day: "May 8",  ctv: 59200, youtube: 15500, display: 10200, meta: 12300, google: 9200, email: 6500, qr: 3500 },
  { day: "May 9",  ctv: 61800, youtube: 16200, display: 10700, meta: 12800, google: 9600, email: 6800, qr: 3700 },
  { day: "May 10", ctv: 65400, youtube: 17100, display: 11300, meta: 13500, google: 10200, email: 7100, qr: 3900 },
  { day: "May 11", ctv: 68200, youtube: 17900, display: 11800, meta: 14100, google: 10600, email: 7500, qr: 4100 },
  { day: "May 12", ctv: 65000, youtube: 17000, display: 11200, meta: 13400, google: 10100, email: 7100, qr: 3900 },
  { day: "May 13", ctv: 71200, youtube: 18700, display: 12300, meta: 14700, google: 11100, email: 7800, qr: 4300 },
  { day: "May 14", ctv: 74800, youtube: 19600, display: 12900, meta: 15400, google: 11600, email: 8200, qr: 4500 },
  { day: "May 15", ctv: 71600, youtube: 18800, display: 12400, meta: 14800, google: 11100, email: 7800, qr: 4300 },
  { day: "May 16", ctv: 76400, youtube: 20000, display: 13200, meta: 15800, google: 11900, email: 8400, qr: 4600 },
  { day: "May 17", ctv: 79800, youtube: 20900, display: 13800, meta: 16500, google: 12400, email: 8700, qr: 4800 },
  { day: "May 18", ctv: 75800, youtube: 19900, display: 13100, meta: 15700, google: 11800, email: 8300, qr: 4600 },
  { day: "May 19", ctv: 82400, youtube: 21600, display: 14200, meta: 17000, google: 12800, email: 9000, qr: 5000 },
  { day: "May 20", ctv: 86200, youtube: 22600, display: 14900, meta: 17800, google: 13400, email: 9400, qr: 5200 },
  { day: "May 21", ctv: 82400, youtube: 21600, display: 14200, meta: 17000, google: 12800, email: 9000, qr: 5000 },
  { day: "May 22", ctv: 88800, youtube: 23300, display: 15300, meta: 18300, google: 13800, email: 9700, qr: 5400 },
  { day: "May 23", ctv: 92800, youtube: 24300, display: 16000, meta: 19100, google: 14400, email: 10100, qr: 5600 },
  { day: "May 24", ctv: 88600, youtube: 23200, display: 15300, meta: 18300, google: 13700, email: 9700, qr: 5400 },
  { day: "May 25", ctv: 95200, youtube: 24900, display: 16400, meta: 19600, google: 14800, email: 10400, qr: 5800 },
  { day: "May 26", ctv: 99400, youtube: 26100, display: 17200, meta: 20500, google: 15400, email: 10800, qr: 6000 },
  { day: "May 27", ctv: 95200, youtube: 24900, display: 16400, meta: 19600, google: 14800, email: 10400, qr: 5800 },
  { day: "May 28", ctv: 102800, youtube: 26900, display: 17700, meta: 21200, google: 15900, email: 11200, qr: 6200 },
  { day: "May 29", ctv: 107400, youtube: 28100, display: 18500, meta: 22100, google: 16600, email: 11700, qr: 6500 },
];

export const WARBY_MEDIA_MIX = [
  { channel: "CTV Streaming",   impressions: 3142800, spend: 59700, pct: 71.0, color: "#1d4ed8" },
  { channel: "Meta Ads",        impressions: 487200,  spend: 9200,  pct: 11.0, color: "#1877f2" },
  { channel: "Google Ads",      impressions: 312400,  spend: 5900,  pct: 7.1,  color: "#34a853" },
  { channel: "YouTube",         impressions: 198700,  spend: 3800,  pct: 4.5,  color: "#ff0000" },
  { channel: "Email Marketing", impressions: 142400,  spend: 2700,  pct: 3.2,  color: "#7c3aed" },
  { channel: "DSP Display",     impressions: 98700,   spend: 1900,  pct: 2.2,  color: "#0ea5e9" },
  { channel: "QR Activation",   impressions: 44700,   spend: 800,   pct: 1.0,  color: "#f59e0b" },
];

export const WARBY_SITE_PAGES = [
  { label: "Home Try-On",         views: 12847, avgTime: "4:12", bounce: 28, color: "#1d4ed8" },
  { label: "Eyeglasses",          views: 9412,  avgTime: "3:48", bounce: 33, color: "#6366f1" },
  { label: "Sunglasses",          views: 7284,  avgTime: "3:21", bounce: 36, color: "#38bdf8" },
  { label: "Progressive Lenses",  views: 4812,  avgTime: "4:54", bounce: 24, color: "#4ade80" },
  { label: "Contacts",            views: 3247,  avgTime: "2:47", bounce: 41, color: "#f59e0b" },
  { label: "Find a Store",        views: 6184,  avgTime: "1:58", bounce: 45, color: "#fb923c" },
];

export const WARBY_VISITORS = [
  { first: "Sarah",   last: "Moreno",    city: "Brooklyn",      zip: "11201", income: "$75K–$99K",   networth: "$100K–$249K", credit: "B", job: "UX Designer",       company: "Spotify",               score: 82, mood: "High Intent", vehicle: "Toyota Prius",    time: "2m ago" },
  { first: "Marcus",  last: "Thornton",  city: "Austin",        zip: "78701", income: "$100K–$149K", networth: "$250K–$499K", credit: "A", job: "Software Engineer", company: "Dell Technologies",      score: 78, mood: "In-Market",   vehicle: "Tesla Model 3",   time: "5m ago" },
  { first: "Priya",   last: "Kapoor",    city: "San Francisco", zip: "94102", income: "$150K–$199K", networth: "$500K–$749K", credit: "A", job: "Product Manager",   company: "Salesforce",            score: 84, mood: "High Intent", vehicle: "Honda CR-V",      time: "9m ago" },
  { first: "Jake",    last: "Riordan",   city: "Chicago",       zip: "60601", income: "$60K–$74K",   networth: "$50K–$99K",   credit: "C", job: "Teacher",           company: "Chicago Public Schools", score: 61, mood: "Awareness",   vehicle: "Ford Focus",      time: "14m ago" },
  { first: "Olivia",  last: "Chen",      city: "Seattle",       zip: "98101", income: "$125K–$149K", networth: "$300K–$499K", credit: "B", job: "Data Analyst",      company: "Amazon",                score: 76, mood: "In-Market",   vehicle: "Subaru Outback",  time: "19m ago" },
  { first: "Derek",   last: "Lawson",    city: "Denver",        zip: "80202", income: "$85K–$99K",   networth: "$150K–$249K", credit: "B", job: "Marketing Manager", company: "REI",                   score: 69, mood: "Awareness",   vehicle: "Jeep Wrangler",   time: "24m ago" },
  { first: "Natalie", last: "Fontaine",  city: "Nashville",     zip: "37201", income: "$95K–$124K",  networth: "$200K–$374K", credit: "B", job: "Nurse Practitioner", company: "Vanderbilt Health",     score: 74, mood: "In-Market",   vehicle: "Nissan Rogue",    time: "29m ago" },
  { first: "Carlos",  last: "Vega",      city: "Miami",         zip: "33101", income: "$65K–$74K",   networth: "$75K–$124K",  credit: "C", job: "Graphic Designer",  company: "Freelance",             score: 58, mood: "Awareness",   vehicle: "Honda Civic",     time: "36m ago" },
];

export const WARBY_MOODS = [
  { label: "High Intent", count: 52,  color: "#4ade80", desc: "Score 80–100 · Ready to buy" },
  { label: "In-Market",   count: 128, color: "#38bdf8", desc: "Score 65–79 · Actively researching" },
  { label: "Awareness",   count: 187, color: "#f59e0b", desc: "Score 50–64 · Building consideration" },
  { label: "Prospect",    count: 101, color: "#a78bfa", desc: "Score below 50 · Top of funnel" },
];

export const WARBY_CREATIVES = [
  { name: ":30 CTV — Home Try-On",        impressions: 1987400, completions: 1748900, cpm: 18.20, completionRate: 88.0, format: "CTV :30" },
  { name: ":15 CTV — Spring Frames",      impressions: 1154400, completions: 1039000, cpm: 15.80, completionRate: 90.0, format: "CTV :15" },
  { name: "Meta Carousel — New Frames",   impressions: 487200,  completions: 0,       cpm:  8.40, completionRate: 0,    format: "Meta" },
  { name: "Google Shopping — Eyeglasses", impressions: 312400,  completions: 0,       cpm:  6.20, completionRate: 0,    format: "Google" },
  { name: "YouTube Pre-Roll :30",         impressions: 198700,  completions: 158900,  cpm: 12.40, completionRate: 80.0, format: "YT Pre" },
  { name: "Email — Try 5 Frames Free",    impressions: 142400,  completions: 0,       cpm:  3.80, completionRate: 0,    format: "Email" },
];
