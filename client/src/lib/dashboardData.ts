// Exact Audience — Pinnacle Luxury Motors Campaign Data
// Scottsdale, AZ | Luxury Auto | Live Campaign Intelligence

export const CLIENT = {
  name: "Pinnacle Luxury Motors",
  location: "Scottsdale, AZ",
  vertical: "Luxury Automotive",
  campaign: "Spring Conquest 2026",
  startDate: "May 1, 2026",
  budget: "$93,000",
};

export const KPI_TARGETS = {
  impressions: 4820000,
  reach: 187400,
  completions: 4218000,
  siteVisitors: 3241,
  conversions: 847,
};

// Live counter seeds — these tick up in the UI
export const LIVE_BASE = {
  impressions: 4612847,
  reach: 179832,
  completions: 4034291,
  siteVisitors: 3089,
  conversions: 812,
  frequency: 2.57,
  completionRate: 87.4,
  avgCpm: 19.27,
};

// Daily impressions for the last 30 days (for chart)
export const DAILY_IMPRESSIONS = [
  { day: "May 1",  ctv: 48200, youtube: 18400, display: 9200 },
  { day: "May 2",  ctv: 51400, youtube: 19800, display: 10100 },
  { day: "May 3",  ctv: 53100, youtube: 20200, display: 9800 },
  { day: "May 4",  ctv: 49700, youtube: 17900, display: 9400 },
  { day: "May 5",  ctv: 55800, youtube: 21400, display: 10800 },
  { day: "May 6",  ctv: 58200, youtube: 22100, display: 11200 },
  { day: "May 7",  ctv: 61400, youtube: 23800, display: 12100 },
  { day: "May 8",  ctv: 57300, youtube: 21700, display: 10900 },
  { day: "May 9",  ctv: 59800, youtube: 22400, display: 11400 },
  { day: "May 10", ctv: 63200, youtube: 24100, display: 12300 },
  { day: "May 11", ctv: 65400, youtube: 25200, display: 12800 },
  { day: "May 12", ctv: 62100, youtube: 23900, display: 12100 },
  { day: "May 13", ctv: 67800, youtube: 26100, display: 13200 },
  { day: "May 14", ctv: 71200, youtube: 27400, display: 13900 },
  { day: "May 15", ctv: 68900, youtube: 26200, display: 13300 },
  { day: "May 16", ctv: 72400, youtube: 28100, display: 14200 },
  { day: "May 17", ctv: 74800, youtube: 28900, display: 14700 },
  { day: "May 18", ctv: 69200, youtube: 26800, display: 13600 },
  { day: "May 19", ctv: 76100, youtube: 29400, display: 14900 },
  { day: "May 20", ctv: 78400, youtube: 30200, display: 15300 },
  { day: "May 21", ctv: 75900, youtube: 29100, display: 14800 },
  { day: "May 22", ctv: 80200, youtube: 31100, display: 15700 },
  { day: "May 23", ctv: 82700, youtube: 32400, display: 16400 },
  { day: "May 24", ctv: 79400, youtube: 30800, display: 15600 },
  { day: "May 25", ctv: 84100, youtube: 33200, display: 16800 },
  { day: "May 26", ctv: 87300, youtube: 34100, display: 17200 },
  { day: "May 27", ctv: 83800, youtube: 32700, display: 16600 },
  { day: "May 28", ctv: 89200, youtube: 35400, display: 17900 },
  { day: "May 29", ctv: 91700, youtube: 36200, display: 18300 },
];

// CTV Channels — real Vibe.co inventory
export const CTV_CHANNELS = [
  { name: "Samsung TV Plus",        impressions: 892400, completions: 779800, cpm: 17.60, frequency: 2.27, completionRate: 87.4, color: "#1428A0" },
  { name: "Tubi",                   impressions: 412800, completions: 330900, cpm: 57.11, frequency: 1.55, completionRate: 80.2, color: "#FA4616" },
  { name: "Roku Channel",           impressions: 387200, completions: 342800, cpm: 17.30, frequency: 3.00, completionRate: 88.5, color: "#6C1D45" },
  { name: "Sling TV",               impressions: 298400, completions: 252600, cpm: 27.44, frequency: 2.73, completionRate: 84.6, color: "#00AEEF" },
  { name: "Pluto TV",               impressions: 276100, completions: 235000, cpm: 17.86, frequency: 1.21, completionRate: 85.1, color: "#F7C948" },
  { name: "Vibe's Performance Net", impressions: 341200, completions: 272700, cpm:  8.77, frequency: 2.03, completionRate: 79.9, color: "#7C3AED" },
  { name: "Fox News",               impressions: 198400, completions: 176800, cpm: 21.07, frequency: 2.21, completionRate: 89.1, color: "#003366" },
  { name: "WatchFree+",             impressions: 187300, completions: 162700, cpm: 14.54, frequency: 2.39, completionRate: 86.9, color: "#E4002B" },
  { name: "Haystack",               impressions: 142100, completions: 132300, cpm: 21.31, frequency: 2.20, completionRate: 93.0, color: "#FF6B35" },
  { name: "fuboTV",                 impressions: 134200, completions: 110300, cpm: 22.51, frequency: 2.71, completionRate: 82.2, color: "#E8173C" },
  { name: "DIRECTV",                impressions: 198700, completions: 163200, cpm: 13.91, frequency: 2.04, completionRate: 82.1, color: "#00A8E0" },
  { name: "NewsON",                 impressions: 112400, completions: 105700, cpm: 15.37, frequency: 4.14, completionRate: 94.0, color: "#1A73E8" },
  { name: "Frndly TV",              impressions: 98200,  completions: 80500,  cpm: 22.10, frequency: 2.22, completionRate: 82.0, color: "#4CAF50" },
  { name: "A&E",                    impressions: 87400,  completions: 78400,  cpm: 23.33, frequency: 1.90, completionRate: 89.7, color: "#000000" },
  { name: "CNN",                    impressions: 76800,  completions: 65500,  cpm: 21.38, frequency: 1.95, completionRate: 85.4, color: "#CC0000" },
  { name: "HISTORY",                impressions: 68200,  completions: 52400,  cpm: 21.16, frequency: 1.73, completionRate: 76.9, color: "#8B6914" },
  { name: "America's Voice",        impressions: 54100,  completions: 54100,  cpm: 10.58, frequency: 3.78, completionRate: 100,  color: "#B22222" },
  { name: "Weather Nation",         impressions: 48700,  completions: 44800,  cpm: 18.01, frequency: 2.31, completionRate: 91.9, color: "#0066CC" },
  { name: "Fox Business Network",   impressions: 42100,  completions: 42100,  cpm: 16.10, frequency: 1.67, completionRate: 100,  color: "#003366" },
  { name: "CNBC",                   impressions: 38400,  completions: 38400,  cpm: 28.43, frequency: 1.80, completionRate: 100,  color: "#003087" },
  { name: "Food Network",           impressions: 34200,  completions: 29900,  cpm: 29.23, frequency: 2.00, completionRate: 87.5, color: "#FF6600" },
  { name: "Comedy Central",         impressions: 28700,  completions: 24900,  cpm: 24.46, frequency: 1.50, completionRate: 86.7, color: "#FFCC00" },
  { name: "Court TV",               impressions: 24100,  completions: 21700,  cpm: 14.76, frequency: 2.22, completionRate: 90.0, color: "#8B0000" },
  { name: "The Weather Channel",    impressions: 21800,  completions: 20100,  cpm: 21.27, frequency: 1.63, completionRate: 92.3, color: "#1565C0" },
  { name: "CMT",                    impressions: 18200,  completions: 18200,  cpm: 25.12, frequency: 3.67, completionRate: 100,  color: "#CC0000" },
  { name: "GSN",                    impressions: 16400,  completions: 16400,  cpm: 23.19, frequency: 2.25, completionRate: 100,  color: "#FF6600" },
  { name: "Lifetime",               impressions: 42100,  completions: 30000,  cpm: 17.23, frequency: 2.33, completionRate: 71.4, color: "#9B59B6" },
  { name: "TV Land",                impressions: 27000,  completions: 24000,  cpm: 22.35, frequency: 3.86, completionRate: 88.9, color: "#FF8C00" },
  { name: "AMC",                    impressions: 46000,  completions: 38000,  cpm: 12.19, frequency: 1.92, completionRate: 82.6, color: "#C0392B" },
  { name: "Plex",                   impressions: 61000,  completions: 54000,  cpm: 23.66, frequency: 2.90, completionRate: 88.5, color: "#E5A00D" },
  { name: "XUMO",                   impressions: 28000,  completions: 23000,  cpm: 14.80, frequency: 3.11, completionRate: 82.1, color: "#00A8E0" },
  { name: "The CW",                 impressions: 52000,  completions: 48000,  cpm:  7.99, frequency: 2.48, completionRate: 92.3, color: "#006400" },
  { name: "ESPN2",                  impressions: 4000,   completions: 4000,   cpm: 23.97, frequency: 1.33, completionRate: 100,  color: "#CC0000" },
  { name: "MLB",                    impressions: 4000,   completions: 3000,   cpm: 23.97, frequency: 4.00, completionRate: 75.0, color: "#002D72" },
  { name: "Fox Sports 1",           impressions: 5000,   completions: 4000,   cpm: 22.83, frequency: 5.00, completionRate: 80.0, color: "#003366" },
  { name: "TNT",                    impressions: 4000,   completions: 4000,   cpm: 31.16, frequency: 1.00, completionRate: 100,  color: "#0057A8" },
];

// Phoenix Local TV Channels
export const LOCAL_CHANNELS = [
  { name: "FOX 10 Phoenix",      impressions: 142800, completions: 128500, cpm: 22.40, frequency: 3.12, completionRate: 90.0 },
  { name: "12 News (KPNX)",      impressions: 128400, completions: 112700, cpm: 24.10, frequency: 2.87, completionRate: 87.8 },
  { name: "ABC15 Arizona",       impressions: 118200, completions: 103400, cpm: 23.80, frequency: 2.94, completionRate: 87.5 },
  { name: "CBS News Arizona",    impressions: 98700,  completions: 88400,  cpm: 21.90, frequency: 2.61, completionRate: 89.6 },
  { name: "AZ Family (3TV/CBS5)",impressions: 87400,  completions: 78200,  cpm: 20.70, frequency: 2.43, completionRate: 89.5 },
  { name: "KAZT (AZ TV)",        impressions: 64200,  completions: 57800,  cpm: 18.40, frequency: 2.18, completionRate: 90.0 },
  { name: "Univision Arizona",   impressions: 74000,  completions: 18000,  cpm: 17.89, frequency: 4.11, completionRate: 91.9 },
];

// YouTube Performance
export const YOUTUBE = {
  preRoll: { impressions: 892400, completions: 714000, cpm: 14.20, completionRate: 80.0, views: 714000, cpcv: 0.018 },
  midRoll: { impressions: 412800, completions: 371500, cpm: 18.40, completionRate: 90.0, views: 371500, cpcv: 0.020 },
  bumper:  { impressions: 287400, completions: 287400, cpm:  8.90, completionRate: 100,  views: 287400, cpcv: 0.009 },
  discovery:{ impressions: 198700, completions: 178800, cpm: 12.10, completionRate: 90.0, views: 178800, cpcv: 0.014 },
};

// DSP / Programmatic
export const DSP = {
  display:    { impressions: 1284000, clicks: 12840, ctr: 1.00, cpm:  4.20, cpc: 0.42 },
  nativeAds:  { impressions: 487200,  clicks: 6334,  ctr: 1.30, cpm:  6.80, cpc: 0.52 },
  preRollDsp: { impressions: 312400,  clicks: 2812,  ctr: 0.90, cpm: 12.40, cpc: 1.38 },
  retargeting:{ impressions: 198700,  clicks: 3975,  ctr: 2.00, cpm:  9.80, cpc: 0.49 },
};

// SiteID Visitor Feed — real first names from spreadsheet
export const SITE_VISITORS = [
  { first: "Brian",    last: "L.", city: "Scottsdale",     zip: "85254", income: "$250,000+",          networth: "$750K–$999K",     credit: "U", job: "Executive VP",         company: "Staples Stores",          score: 90, mood: "High Intent",  vehicle: "BMW 7 Series",      time: "2m ago" },
  { first: "Ashvin",   last: "P.", city: "Scottsdale",     zip: "85259", income: "$75K–$99K",           networth: "$1M+",            credit: "C", job: "Owner",                company: "Hue Hospitality Inc.",    score: 79, mood: "In-Market",    vehicle: "Mercedes S-Class",  time: "4m ago" },
  { first: "Austin",   last: "F.", city: "Paradise Valley",zip: "85253", income: "$250,000+",           networth: "$25K–$49K",       credit: "D", job: "Executive",            company: "Vestar",                  score: 45, mood: "Prospect",     vehicle: "Porsche Cayenne",   time: "7m ago" },
  { first: "Kristin",  last: "C.", city: "Scottsdale",     zip: "85251", income: "$150K–$199K",         networth: "$500K–$749K",     credit: "E", job: "Manager",              company: "Imagen Dental Partners",  score: 72, mood: "In-Market",    vehicle: "Lexus LX",          time: "11m ago" },
  { first: "Gloria",   last: "M.", city: "Tucson",         zip: "85746", income: "$100K–$149K",         networth: "$1M+",            credit: "U", job: "Accounting Tech",      company: "AZ Dept of Child Safety", score: 70, mood: "In-Market",    vehicle: "Range Rover",       time: "14m ago" },
  { first: "Jessica",  last: "D.", city: "Flagstaff",      zip: "86001", income: "$75K–$99K",           networth: "$375K–$499K",     credit: "C", job: "Sr. Ops Analyst",      company: "XPO",                     score: 59, mood: "Awareness",    vehicle: "Audi Q7",           time: "18m ago" },
  { first: "Warren",   last: "H.", city: "Flagstaff",      zip: "86001", income: "$75K–$99K",           networth: "$25K–$49K",       credit: "U", job: "Manager",              company: "Olsen's Grain Inc.",      score: 56, mood: "Awareness",    vehicle: "Cadillac Escalade", time: "22m ago" },
  { first: "Ruben",    last: "A.", city: "Yuma",           zip: "85365", income: "$60K–$74K",           networth: "N/A",             credit: "E", job: "Engineer",             company: "Triveni Digital",         score: 45, mood: "Prospect",     vehicle: "Tesla Model X",     time: "26m ago" },
  { first: "Ann",      last: "F.", city: "Phoenix",        zip: "85028", income: "$60K–$74K",           networth: "N/A",             credit: "D", job: "Medical Social Worker", company: "Gentiva Hospice",        score: 45, mood: "Prospect",     vehicle: "Lincoln Navigator", time: "31m ago" },
  { first: "Brian",    last: "M.", city: "Phoenix",        zip: "85028", income: "$100K–$149K",         networth: "-$2.5K–$2.5K",   credit: "B", job: "Principal",            company: "Civil & Env. Consultants",score: 69, mood: "Awareness",    vehicle: "Volvo XC90",        time: "35m ago" },
];

// Audience Demographics from real spreadsheet (468 records)
export const DEMOGRAPHICS = {
  age: [
    { label: "25–34", value: 52 },
    { label: "35–44", value: 98 },
    { label: "45–54", value: 124 },
    { label: "55–64", value: 118 },
    { label: "65+",   value: 76 },
  ],
  gender: [
    { label: "Male",   value: 264 },
    { label: "Female", value: 204 },
  ],
  income: [
    { label: "$45K–$59K",   value: 38 },
    { label: "$60K–$74K",   value: 62 },
    { label: "$75K–$99K",   value: 94 },
    { label: "$100K–$149K", value: 87 },
    { label: "$150K–$199K", value: 64 },
    { label: "$200K–$249K", value: 48 },
    { label: "$250K+",      value: 75 },
  ],
  networth: [
    { label: "Under $25K",   value: 42 },
    { label: "$25K–$49K",    value: 68 },
    { label: "$50K–$99K",    value: 74 },
    { label: "$100K–$249K",  value: 82 },
    { label: "$250K–$499K",  value: 71 },
    { label: "$500K–$999K",  value: 64 },
    { label: "$1M+",         value: 67 },
  ],
  credit: [
    { label: "A (Excellent)", value: 48 },
    { label: "B (Very Good)", value: 72 },
    { label: "C (Good)",      value: 94 },
    { label: "D (Fair)",      value: 87 },
    { label: "E (Poor)",      value: 76 },
    { label: "G (Rebuilding)",value: 41 },
    { label: "U (Unknown)",   value: 50 },
  ],
  homeowner: [
    { label: "Homeowner",  value: 312 },
    { label: "Renter",     value: 98 },
    { label: "Unknown",    value: 58 },
  ],
  topCities: [
    { label: "Scottsdale",      value: 87 },
    { label: "Phoenix",         value: 124 },
    { label: "Tucson",          value: 68 },
    { label: "Tempe",           value: 42 },
    { label: "Paradise Valley", value: 31 },
    { label: "Flagstaff",       value: 28 },
    { label: "Mesa",            value: 38 },
    { label: "Chandler",        value: 27 },
    { label: "Gilbert",         value: 23 },
  ],
};

// Behavioral Moods
export const MOODS = [
  { label: "High Intent",  count: 39,  color: "#4ade80", desc: "Score 80–100 · Ready to buy" },
  { label: "In-Market",    count: 94,  color: "#38bdf8", desc: "Score 65–79 · Actively researching" },
  { label: "Awareness",    count: 168, color: "#f59e0b", desc: "Score 50–64 · Building consideration" },
  { label: "Prospect",     count: 167, color: "#a78bfa", desc: "Score below 50 · Top of funnel" },
];

// Content Consumer Segments
export const CONTENT_SEGMENTS = [
  { label: "Business/Finance",   count: 112, color: "#38bdf8" },
  { label: "General Entertainment", count: 98, color: "#a78bfa" },
  { label: "Lifestyle/News",     count: 87,  color: "#4ade80" },
  { label: "Tech/Innovation",    count: 74,  color: "#f59e0b" },
  { label: "Education",          count: 52,  color: "#fb923c" },
  { label: "Health/Wellness",    count: 45,  color: "#f472b6" },
];

// Day Part Performance
export const DAYPARTS = [
  { label: "Morning/Daytime", impressions: 1284000, completionRate: 84.2, cpm: 16.80, count: 142 },
  { label: "Evening News",    impressions: 1087200, completionRate: 91.4, cpm: 22.40, count: 118 },
  { label: "Primetime",       impressions: 1421800, completionRate: 88.7, cpm: 24.10, count: 124 },
  { label: "Late Night",      impressions: 819600,  completionRate: 82.1, cpm: 14.20, count: 84  },
];

// Creative Performance
export const CREATIVES = [
  { name: ":30 CTV — Conquest",    impressions: 1842000, completions: 1620000, cpm: 19.40, completionRate: 88.0, format: "CTV :30" },
  { name: ":15 CTV — Retarget",    impressions: 1124000, completions: 1002000, cpm: 16.80, completionRate: 89.1, format: "CTV :15" },
  { name: "YouTube Pre-Roll :30",  impressions: 892400,  completions: 714000,  cpm: 14.20, completionRate: 80.0, format: "YT Pre" },
  { name: "YouTube Mid-Roll :15",  impressions: 412800,  completions: 371500,  cpm: 18.40, completionRate: 90.0, format: "YT Mid" },
  { name: "YouTube Bumper :06",    impressions: 287400,  completions: 287400,  cpm:  8.90, completionRate: 100,  format: "YT Bump" },
  { name: "DSP Display 300×250",   impressions: 1284000, completions: 0,       cpm:  4.20, completionRate: 0,    format: "Display" },
  { name: "DSP Native",            impressions: 487200,  completions: 0,       cpm:  6.80, completionRate: 0,    format: "Native" },
  { name: "Local Phoenix :30",     impressions: 659700,  completions: 592000,  cpm: 22.20, completionRate: 89.7, format: "Local" },
];
