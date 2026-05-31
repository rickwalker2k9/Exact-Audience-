// Exact Audience — Lamborghini of Scottsdale Campaign Data
// Scottsdale, AZ | Ultra-Luxury Automotive | Urus Conquest 2026

export const LAMBO_CLIENT = {
  name: "Lamborghini of Scottsdale",
  location: "Scottsdale, AZ",
  vertical: "Ultra-Luxury Automotive",
  campaign: "Urus Conquest 2026",
  startDate: "May 1, 2026",
  budget: "$112,000",
  website: "lamborghiniofscottsdale.com",
};

export const LAMBO_KPI_TARGETS = {
  impressions: 5800000,
  reach: 218000,
  completions: 5220000,
  siteVisitors: 248,
  conversions: 612,
};

export const LAMBO_LIVE_BASE = {
  impressions: 5214800,
  reach: 201340,
  completions: 4648200,
  siteVisitors: 221,
  conversions: 548,
  frequency: 2.59,
  completionRate: 89.2,
  avgCpm: 21.48,
};

export const LAMBO_DAILY_IMPRESSIONS = [
  { day: "May 1",  ctv: 62400, youtube: 14200, display: 6800, meta: 8400, google: 5200, email: 4100, qr: 3800 },
  { day: "May 2",  ctv: 66800, youtube: 15100, display: 7200, meta: 8900, google: 5600, email: 4300, qr: 4100 },
  { day: "May 3",  ctv: 69400, youtube: 15800, display: 7600, meta: 9200, google: 5900, email: 4500, qr: 4400 },
  { day: "May 4",  ctv: 64200, youtube: 14600, display: 7000, meta: 8600, google: 5400, email: 4200, qr: 4000 },
  { day: "May 5",  ctv: 72800, youtube: 16600, display: 8100, meta: 9800, google: 6200, email: 4800, qr: 4700 },
  { day: "May 6",  ctv: 76400, youtube: 17400, display: 8600, meta: 10200, google: 6600, email: 5100, qr: 5000 },
  { day: "May 7",  ctv: 81200, youtube: 18400, display: 9100, meta: 10900, google: 7000, email: 5400, qr: 5400 },
  { day: "May 8",  ctv: 77400, youtube: 17600, display: 8700, meta: 10400, google: 6700, email: 5200, qr: 5100 },
  { day: "May 9",  ctv: 80200, youtube: 18200, display: 9000, meta: 10800, google: 6900, email: 5300, qr: 5300 },
  { day: "May 10", ctv: 84800, youtube: 19200, display: 9500, meta: 11400, google: 7300, email: 5600, qr: 5600 },
  { day: "May 11", ctv: 88400, youtube: 20100, display: 9900, meta: 11900, google: 7600, email: 5900, qr: 5900 },
  { day: "May 12", ctv: 84200, youtube: 19100, display: 9400, meta: 11300, google: 7200, email: 5600, qr: 5500 },
  { day: "May 13", ctv: 91800, youtube: 20900, display: 10300, meta: 12300, google: 7900, email: 6100, qr: 6100 },
  { day: "May 14", ctv: 96400, youtube: 21900, display: 10800, meta: 12900, google: 8300, email: 6400, qr: 6400 },
  { day: "May 15", ctv: 92200, youtube: 20900, display: 10300, meta: 12400, google: 7900, email: 6100, qr: 6100 },
  { day: "May 16", ctv: 98400, youtube: 22400, display: 11000, meta: 13200, google: 8500, email: 6600, qr: 6600 },
  { day: "May 17", ctv: 102800, youtube: 23400, display: 11500, meta: 13800, google: 8800, email: 6800, qr: 6900 },
  { day: "May 18", ctv: 97400, youtube: 22100, display: 10900, meta: 13100, google: 8400, email: 6500, qr: 6500 },
  { day: "May 19", ctv: 106200, youtube: 24100, display: 11900, meta: 14200, google: 9100, email: 7100, qr: 7100 },
  { day: "May 20", ctv: 110800, youtube: 25200, display: 12400, meta: 14900, google: 9500, email: 7400, qr: 7400 },
  { day: "May 21", ctv: 106400, youtube: 24200, display: 11900, meta: 14300, google: 9100, email: 7100, qr: 7100 },
  { day: "May 22", ctv: 114200, youtube: 26000, display: 12800, meta: 15300, google: 9800, email: 7600, qr: 7700 },
  { day: "May 23", ctv: 118800, youtube: 27000, display: 13300, meta: 15900, google: 10200, email: 7900, qr: 8000 },
  { day: "May 24", ctv: 113400, youtube: 25800, display: 12700, meta: 15200, google: 9700, email: 7500, qr: 7600 },
  { day: "May 25", ctv: 121800, youtube: 27700, display: 13600, meta: 16300, google: 10400, email: 8100, qr: 8200 },
  { day: "May 26", ctv: 127200, youtube: 28900, display: 14200, meta: 17000, google: 10900, email: 8400, qr: 8600 },
  { day: "May 27", ctv: 122400, youtube: 27800, display: 13700, meta: 16400, google: 10500, email: 8100, qr: 8200 },
  { day: "May 28", ctv: 131200, youtube: 29800, display: 14700, meta: 17600, google: 11300, email: 8700, qr: 8900 },
  { day: "May 29", ctv: 136800, youtube: 31100, display: 15300, meta: 18300, google: 11700, email: 9100, qr: 9300 },
];

// Media Mix — CTV dominant (73%)
export const LAMBO_MEDIA_MIX = [
  { channel: "CTV Streaming",   impressions: 3812400, spend: 81900, pct: 73.1, color: "#d4a017" },
  { channel: "QR Activation",   impressions: 412800,  spend: 8900,  pct: 7.9,  color: "#f59e0b" },
  { channel: "Meta Ads",        impressions: 387200,  spend: 8300,  pct: 7.4,  color: "#1877f2" },
  { channel: "Google Ads",      impressions: 248700,  spend: 5300,  pct: 4.8,  color: "#34a853" },
  { channel: "YouTube",         impressions: 187400,  spend: 4000,  pct: 3.6,  color: "#60a5fa" },
  { channel: "Email Marketing", impressions: 98700,   spend: 2100,  pct: 1.9,  color: "#7c3aed" },
  { channel: "DSP Display",     impressions: 67300,   spend: 1500,  pct: 1.3,  color: "#0ea5e9" },
];

// CTV Channels
export const LAMBO_CTV_CHANNELS = [
  { name: "Samsung TV Plus",      impressions: 1024200, completions: 921800, cpm: 18.40, frequency: 2.41, completionRate: 90.0, color: "#1428A0" },
  { name: "Roku Channel",         impressions: 487400,  completions: 438600, cpm: 19.20, frequency: 3.10, completionRate: 89.9, color: "#6C1D45" },
  { name: "Tubi",                 impressions: 412800,  completions: 330200, cpm: 57.11, frequency: 1.62, completionRate: 80.0, color: "#f97316" },
  { name: "Fox News",             impressions: 298400,  completions: 268600, cpm: 22.40, frequency: 2.31, completionRate: 90.0, color: "#003366" },
  { name: "CNBC",                 completions: 187400,  impressions: 187400, cpm: 28.43, frequency: 1.82, completionRate: 100,  color: "#003087" },
  { name: "Fox Business Network", impressions: 164200,  completions: 164200, cpm: 16.10, frequency: 1.71, completionRate: 100,  color: "#003366" },
  { name: "Sling TV",             impressions: 298400,  completions: 252600, cpm: 27.44, frequency: 2.73, completionRate: 84.6, color: "#00AEEF" },
  { name: "Pluto TV",             impressions: 187400,  completions: 159400, cpm: 17.86, frequency: 1.24, completionRate: 85.1, color: "#F7C948" },
  { name: "DIRECTV",              impressions: 198700,  completions: 163200, cpm: 13.91, frequency: 2.04, completionRate: 82.1, color: "#00A8E0" },
  { name: "ESPN2",                impressions: 87400,   completions: 78700,  cpm: 24.10, frequency: 1.41, completionRate: 90.0, color: "#0369a1" },
  { name: "Golf Channel",         impressions: 164200,  completions: 152700, cpm: 26.80, frequency: 2.14, completionRate: 93.0, color: "#1a6b3c" },
  { name: "Performance Network",  impressions: 201400,  completions: 161100, cpm:  8.77, frequency: 2.11, completionRate: 80.0, color: "#7C3AED" },
];

// QR Code Activation
export const LAMBO_QR = {
  totalScans: 8412,
  uniqueDevices: 7284,
  conversionRate: 6.8,
  avgTimeToConvert: "4.2 days",
  placements: [
    { location: "Scottsdale Fashion Square (OOH)", scans: 2841, conversions: 198 },
    { location: "Old Town Scottsdale Billboards",  scans: 2214, conversions: 154 },
    { location: "Direct Mail Insert",              scans: 1687, conversions: 118 },
    { location: "Print — AZ Business Magazine",   scans: 987,  conversions: 69 },
    { location: "Event Activation — Barrett-Jackson", scans: 683, conversions: 48 },
  ],
};

// SiteID Visitors
export const LAMBO_VISITORS = [
  { first: "Michael",  last: "Reinhardt",  city: "Paradise Valley", zip: "85253", income: "$500K+",      networth: "$5M+",        credit: "A", job: "CEO",                   company: "Henkel Corp",             score: 96, mood: "High Intent", vehicle: "Ferrari 488",       time: "3m ago" },
  { first: "David",    last: "Kessler",     city: "Scottsdale",      zip: "85255", income: "$350K–$499K",  networth: "$2M–$5M",     credit: "A", job: "Managing Partner",     company: "Fenix Capital",           score: 91, mood: "High Intent", vehicle: "Porsche 911 Turbo", time: "6m ago" },
  { first: "Jennifer", last: "Whitmore",    city: "Scottsdale",      zip: "85259", income: "$250K–$349K",  networth: "$1M–$2M",     credit: "B", job: "Plastic Surgeon",      company: "Scottsdale Aesthetics",   score: 88, mood: "High Intent", vehicle: "Range Rover SVR",   time: "9m ago" },
  { first: "Robert",   last: "Stavros",     city: "Paradise Valley", zip: "85253", income: "$500K+",       networth: "$5M+",        credit: "A", job: "Real Estate Developer",  company: "SunState Properties",    score: 94, mood: "High Intent", vehicle: "Bentley Bentayga",  time: "12m ago" },
  { first: "Ashley",   last: "Tran",        city: "Scottsdale",      zip: "85254", income: "$200K–$249K",  networth: "$750K–$999K", credit: "B", job: "VP Marketing",         company: "Henkel Corp",             score: 79, mood: "In-Market",   vehicle: "BMW X7",            time: "16m ago" },
  { first: "James",    last: "Morales",     city: "Tempe",           zip: "85284", income: "$150K–$199K",  networth: "$500K–$749K", credit: "C", job: "Orthopedic Surgeon",   company: "Dignity Health",          score: 72, mood: "In-Market",   vehicle: "Lexus LX600",       time: "21m ago" },
  { first: "Lauren",   last: "Beckett",     city: "Chandler",        zip: "85248", income: "$100K–$149K",  networth: "$250K–$499K", credit: "B", job: "Tech Executive",       company: "GoDaddy",                 score: 68, mood: "Awareness",   vehicle: "Tesla Model S",     time: "28m ago" },
  { first: "Thomas",   last: "Harrington",  city: "Gilbert",         zip: "85297", income: "$75K–$99K",    networth: "$100K–$249K", credit: "C", job: "Financial Advisor",    company: "Edward Jones",            score: 54, mood: "Awareness",   vehicle: "Audi Q8",           time: "34m ago" },
];

export const LAMBO_MOODS = [
  { label: "High Intent", count: 47,  color: "#4ade80", desc: "Score 80–100 · Ready to buy" },
  { label: "In-Market",   count: 112, color: "#38bdf8", desc: "Score 65–79 · Actively researching" },
  { label: "Awareness",   count: 198, color: "#f59e0b", desc: "Score 50–64 · Building consideration" },
  { label: "Prospect",    count: 191, color: "#a78bfa", desc: "Score below 50 · Top of funnel" },
];

export const LAMBO_CREATIVES = [
  { name: ":30 CTV — Urus Conquest",       impressions: 2214000, completions: 1992600, cpm: 21.40, completionRate: 90.0, format: "CTV :30" },
  { name: ":15 CTV — Huracán Retarget",    impressions: 1124000, completions: 1011600, cpm: 18.80, completionRate: 90.0, format: "CTV :15" },
  { name: "Meta Video — Urus :15",         impressions: 387200,  completions: 0,       cpm:  9.20, completionRate: 0,    format: "Meta" },
  { name: "Google Display — Conquest",     impressions: 248700,  completions: 0,       cpm:  5.40, completionRate: 0,    format: "Google" },
  { name: "YouTube Pre-Roll :30",          impressions: 187400,  completions: 149900,  cpm: 14.20, completionRate: 80.0, format: "YT Pre" },
  { name: "Email — Urus VIP Invite",       impressions: 98700,   completions: 0,       cpm:  4.10, completionRate: 0,    format: "Email" },
  { name: "QR — Fashion Square OOH",       impressions: 67300,   completions: 0,       cpm:  3.20, completionRate: 0,    format: "QR" },
];
