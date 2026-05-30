// Exact Audience — Land Rover North Scottsdale Campaign Data
// Scottsdale, AZ | Luxury Automotive | Live Campaign Intelligence

export const CLIENT = {
  name: "Land Rover North Scottsdale",
  location: "Scottsdale, AZ",
  vertical: "Luxury Automotive",
  campaign: "Defender Conquest 2026",
  startDate: "May 1, 2026",
  budget: "$97,500",
  website: "landrovernorthscottsdale.com",
};

export const KPI_TARGETS = {
  impressions: 5100000,
  reach: 198000,
  completions: 4488000,
  siteVisitors: 3420,
  conversions: 891,
};

// Live counter seeds — these tick up in the UI
export const LIVE_BASE = {
  impressions: 4871342,
  reach: 188640,
  completions: 4261100,
  siteVisitors: 3247,
  conversions: 847,
  frequency: 2.61,
  completionRate: 87.5,
  avgCpm: 19.84,
};

// Daily impressions for the last 30 days (for chart)
export const DAILY_IMPRESSIONS = [
  { day: "May 1",  ctv: 51200, youtube: 19400, display: 9700 },
  { day: "May 2",  ctv: 54100, youtube: 20800, display: 10400 },
  { day: "May 3",  ctv: 56400, youtube: 21200, display: 10100 },
  { day: "May 4",  ctv: 52800, youtube: 18900, display: 9800 },
  { day: "May 5",  ctv: 58700, youtube: 22400, display: 11200 },
  { day: "May 6",  ctv: 61400, youtube: 23100, display: 11800 },
  { day: "May 7",  ctv: 64800, youtube: 24900, display: 12600 },
  { day: "May 8",  ctv: 60200, youtube: 22700, display: 11400 },
  { day: "May 9",  ctv: 62900, youtube: 23400, display: 11900 },
  { day: "May 10", ctv: 66700, youtube: 25100, display: 12800 },
  { day: "May 11", ctv: 68900, youtube: 26200, display: 13300 },
  { day: "May 12", ctv: 65400, youtube: 24900, display: 12600 },
  { day: "May 13", ctv: 71400, youtube: 27100, display: 13700 },
  { day: "May 14", ctv: 74900, youtube: 28400, display: 14400 },
  { day: "May 15", ctv: 72200, youtube: 27200, display: 13800 },
  { day: "May 16", ctv: 76100, youtube: 29100, display: 14700 },
  { day: "May 17", ctv: 78400, youtube: 29900, display: 15200 },
  { day: "May 18", ctv: 72800, youtube: 27800, display: 14100 },
  { day: "May 19", ctv: 80200, youtube: 30400, display: 15400 },
  { day: "May 20", ctv: 82700, youtube: 31200, display: 15800 },
  { day: "May 21", ctv: 79800, youtube: 30100, display: 15300 },
  { day: "May 22", ctv: 84400, youtube: 32100, display: 16200 },
  { day: "May 23", ctv: 87100, youtube: 33400, display: 16900 },
  { day: "May 24", ctv: 83600, youtube: 31800, display: 16100 },
  { day: "May 25", ctv: 88700, youtube: 34200, display: 17300 },
  { day: "May 26", ctv: 91900, youtube: 35100, display: 17700 },
  { day: "May 27", ctv: 88200, youtube: 33700, display: 17100 },
  { day: "May 28", ctv: 93800, youtube: 36400, display: 18400 },
  { day: "May 29", ctv: 96400, youtube: 37200, display: 18900 },
];

// ── Defender Page View Traffic ─────────────────────────────────────────────────
// Tracks site page views driven by the campaign, broken out by Defender model page
export const DEFENDER_PAGE_VIEWS = [
  { day: "May 1",  defender90: 142, defender110: 218, defender130: 87,  defenderOverview: 312, rangeRover: 198, discovery: 124 },
  { day: "May 2",  defender90: 158, defender110: 241, defender130: 94,  defenderOverview: 341, rangeRover: 212, discovery: 138 },
  { day: "May 3",  defender90: 171, defender110: 264, defender130: 102, defenderOverview: 378, rangeRover: 224, discovery: 147 },
  { day: "May 4",  defender90: 148, defender110: 229, defender130: 89,  defenderOverview: 328, rangeRover: 204, discovery: 131 },
  { day: "May 5",  defender90: 187, defender110: 298, defender130: 118, defenderOverview: 421, rangeRover: 241, discovery: 162 },
  { day: "May 6",  defender90: 204, defender110: 324, defender130: 128, defenderOverview: 458, rangeRover: 258, discovery: 178 },
  { day: "May 7",  defender90: 228, defender110: 361, defender130: 142, defenderOverview: 512, rangeRover: 287, discovery: 198 },
  { day: "May 8",  defender90: 198, defender110: 318, defender130: 124, defenderOverview: 447, rangeRover: 264, discovery: 181 },
  { day: "May 9",  defender90: 214, defender110: 342, defender130: 134, defenderOverview: 481, rangeRover: 274, discovery: 189 },
  { day: "May 10", defender90: 241, defender110: 384, defender130: 151, defenderOverview: 541, rangeRover: 298, discovery: 207 },
  { day: "May 11", defender90: 258, defender110: 412, defender130: 162, defenderOverview: 578, rangeRover: 314, discovery: 218 },
  { day: "May 12", defender90: 234, defender110: 374, defender130: 147, defenderOverview: 527, rangeRover: 301, discovery: 208 },
  { day: "May 13", defender90: 274, defender110: 437, defender130: 172, defenderOverview: 614, rangeRover: 334, discovery: 231 },
  { day: "May 14", defender90: 298, defender110: 474, defender130: 187, defenderOverview: 667, rangeRover: 358, discovery: 248 },
  { day: "May 15", defender90: 281, defender110: 448, defender130: 176, defenderOverview: 629, rangeRover: 341, discovery: 236 },
  { day: "May 16", defender90: 312, defender110: 497, defender130: 196, defenderOverview: 701, rangeRover: 374, discovery: 258 },
  { day: "May 17", defender90: 328, defender110: 524, defender130: 207, defenderOverview: 738, rangeRover: 391, discovery: 271 },
  { day: "May 18", defender90: 294, defender110: 469, defender130: 185, defenderOverview: 661, rangeRover: 358, discovery: 247 },
  { day: "May 19", defender90: 341, defender110: 544, defender130: 214, defenderOverview: 767, rangeRover: 408, discovery: 282 },
  { day: "May 20", defender90: 358, defender110: 571, defender130: 225, defenderOverview: 804, rangeRover: 427, discovery: 296 },
  { day: "May 21", defender90: 334, defender110: 533, defender130: 210, defenderOverview: 751, rangeRover: 401, discovery: 277 },
  { day: "May 22", defender90: 374, defender110: 597, defender130: 235, defenderOverview: 841, rangeRover: 447, discovery: 309 },
  { day: "May 23", defender90: 394, defender110: 628, defender130: 248, defenderOverview: 884, rangeRover: 468, discovery: 324 },
  { day: "May 24", defender90: 367, defender110: 586, defender130: 231, defenderOverview: 824, rangeRover: 438, discovery: 303 },
  { day: "May 25", defender90: 408, defender110: 651, defender130: 257, defenderOverview: 918, rangeRover: 487, discovery: 337 },
  { day: "May 26", defender90: 428, defender110: 684, defender130: 270, defenderOverview: 964, rangeRover: 511, discovery: 354 },
  { day: "May 27", defender90: 401, defender110: 641, defender130: 253, defenderOverview: 903, rangeRover: 479, discovery: 331 },
  { day: "May 28", defender90: 447, defender110: 714, defender130: 282, defenderOverview: 1007, rangeRover: 534, discovery: 369 },
  { day: "May 29", defender90: 468, defender110: 748, defender130: 296, defenderOverview: 1054, rangeRover: 558, discovery: 387 },
];

// Defender page totals (campaign-to-date)
export const DEFENDER_PAGE_TOTALS = {
  defender90:       { views: 8412,  label: "Defender 90",       url: "/new-vehicles/defender-90/",  color: "#4ade80",  avgTime: "3:42", bounce: 38 },
  defender110:      { views: 13418, label: "Defender 110",      url: "/new-vehicles/defender-110/", color: "#a855f7",  avgTime: "4:18", bounce: 31 },
  defender130:      { views: 5284,  label: "Defender 130",      url: "/new-vehicles/defender-130/", color: "#38bdf8",  avgTime: "3:57", bounce: 35 },
  defenderOverview: { views: 19847, label: "Defender Overview", url: "/defender/",                  color: "#f59e0b",  avgTime: "2:54", bounce: 42 },
  rangeRover:       { views: 10124, label: "Range Rover",       url: "/new-vehicles/range-rover/",  color: "#f87171",  avgTime: "3:21", bounce: 44 },
  discovery:        { views: 7012,  label: "Discovery",         url: "/new-vehicles/discovery/",    color: "#fb923c",  avgTime: "2:47", bounce: 47 },
};

// CTV Channels — Programmatic Inventory
export const CTV_CHANNELS = [
  { name: "Samsung TV Plus",      impressions: 892400, completions: 779800, cpm: 17.60, frequency: 2.27, completionRate: 87.4, color: "#1428A0" },
  { name: "Tubi",                 impressions: 412800, completions: 330900, cpm: 57.11, frequency: 1.55, completionRate: 80.2, color: "#FA4616" },
  { name: "Roku Channel",         impressions: 387200, completions: 342800, cpm: 17.30, frequency: 3.00, completionRate: 88.5, color: "#6C1D45" },
  { name: "Sling TV",             impressions: 298400, completions: 252600, cpm: 27.44, frequency: 2.73, completionRate: 84.6, color: "#00AEEF" },
  { name: "Pluto TV",             impressions: 276100, completions: 235000, cpm: 17.86, frequency: 1.21, completionRate: 85.1, color: "#F7C948" },
  { name: "Performance Network",  impressions: 341200, completions: 272700, cpm:  8.77, frequency: 2.03, completionRate: 79.9, color: "#7C3AED" },
  { name: "Fox News",             impressions: 198400, completions: 176800, cpm: 21.07, frequency: 2.21, completionRate: 89.1, color: "#003366" },
  { name: "WatchFree+",           impressions: 187300, completions: 162700, cpm: 14.54, frequency: 2.39, completionRate: 86.9, color: "#E4002B" },
  { name: "Haystack",             impressions: 142100, completions: 132300, cpm: 21.31, frequency: 2.20, completionRate: 93.0, color: "#FF6B35" },
  { name: "fuboTV",               impressions: 134200, completions: 110300, cpm: 22.51, frequency: 2.71, completionRate: 82.2, color: "#E8173C" },
  { name: "DIRECTV",              impressions: 198700, completions: 163200, cpm: 13.91, frequency: 2.04, completionRate: 82.1, color: "#00A8E0" },
  { name: "NewsON",               impressions: 112400, completions: 105700, cpm: 15.37, frequency: 4.14, completionRate: 94.0, color: "#1A73E8" },
  { name: "Frndly TV",            impressions: 98200,  completions: 80500,  cpm: 22.10, frequency: 2.22, completionRate: 82.0, color: "#4CAF50" },
  { name: "A&E",                  impressions: 87400,  completions: 78400,  cpm: 23.33, frequency: 1.90, completionRate: 89.7, color: "#000000" },
  { name: "CNN",                  impressions: 76800,  completions: 65500,  cpm: 21.38, frequency: 1.95, completionRate: 85.4, color: "#CC0000" },
  { name: "HISTORY",              impressions: 68200,  completions: 52400,  cpm: 21.16, frequency: 1.73, completionRate: 76.9, color: "#8B6914" },
  { name: "America's Voice",      impressions: 54100,  completions: 54100,  cpm: 10.58, frequency: 3.78, completionRate: 100,  color: "#B22222" },
  { name: "Weather Nation",       impressions: 48700,  completions: 44800,  cpm: 18.01, frequency: 2.31, completionRate: 91.9, color: "#0066CC" },
  { name: "Fox Business Network", impressions: 42100,  completions: 42100,  cpm: 16.10, frequency: 1.67, completionRate: 100,  color: "#003366" },
  { name: "CNBC",                 impressions: 38400,  completions: 38400,  cpm: 28.43, frequency: 1.80, completionRate: 100,  color: "#003087" },
  { name: "Food Network",         impressions: 34200,  completions: 29900,  cpm: 29.23, frequency: 2.00, completionRate: 87.5, color: "#FF6600" },
  { name: "Comedy Central",       impressions: 28700,  completions: 24900,  cpm: 24.46, frequency: 1.50, completionRate: 86.7, color: "#FFCC00" },
  { name: "Court TV",             impressions: 24100,  completions: 21700,  cpm: 14.76, frequency: 2.22, completionRate: 90.0, color: "#8B0000" },
  { name: "The Weather Channel",  impressions: 21800,  completions: 20100,  cpm: 21.27, frequency: 1.63, completionRate: 92.3, color: "#1565C0" },
  { name: "CMT",                  impressions: 18200,  completions: 18200,  cpm: 25.12, frequency: 3.67, completionRate: 100,  color: "#CC0000" },
  { name: "GSN",                  impressions: 16400,  completions: 16400,  cpm: 23.19, frequency: 2.25, completionRate: 100,  color: "#FF6600" },
  { name: "Lifetime",             impressions: 42100,  completions: 30000,  cpm: 17.23, frequency: 2.33, completionRate: 71.4, color: "#9B59B6" },
  { name: "TV Land",              impressions: 27000,  completions: 24000,  cpm: 22.35, frequency: 3.86, completionRate: 88.9, color: "#FF8C00" },
  { name: "AMC",                  impressions: 46000,  completions: 38000,  cpm: 12.19, frequency: 1.92, completionRate: 82.6, color: "#C0392B" },
  { name: "Plex",                 impressions: 61000,  completions: 54000,  cpm: 23.66, frequency: 2.90, completionRate: 88.5, color: "#E5A00D" },
  { name: "XUMO",                 impressions: 28000,  completions: 23000,  cpm: 14.80, frequency: 3.11, completionRate: 82.1, color: "#00A8E0" },
  { name: "The CW",               impressions: 52000,  completions: 48000,  cpm:  7.99, frequency: 2.48, completionRate: 92.3, color: "#006400" },
  { name: "ESPN2",                impressions: 4000,   completions: 4000,   cpm: 23.97, frequency: 1.33, completionRate: 100,  color: "#CC0000" },
  { name: "MLB",                  impressions: 4000,   completions: 3000,   cpm: 23.97, frequency: 4.00, completionRate: 75.0, color: "#002D72" },
  { name: "Fox Sports 1",         impressions: 5000,   completions: 4000,   cpm: 22.83, frequency: 5.00, completionRate: 80.0, color: "#003366" },
  { name: "TNT",                  impressions: 4000,   completions: 4000,   cpm: 31.16, frequency: 1.00, completionRate: 100,  color: "#0057A8" },
];

// Phoenix Local TV Channels
export const LOCAL_CHANNELS = [
  { name: "FOX 10 Phoenix",       impressions: 142800, completions: 128500, cpm: 22.40, frequency: 3.12, completionRate: 90.0 },
  { name: "12 News (KPNX)",       impressions: 128400, completions: 112700, cpm: 24.10, frequency: 2.87, completionRate: 87.8 },
  { name: "ABC15 Arizona",        impressions: 118200, completions: 103400, cpm: 23.80, frequency: 2.94, completionRate: 87.5 },
  { name: "CBS News Arizona",     impressions: 98700,  completions: 88400,  cpm: 21.90, frequency: 2.61, completionRate: 89.6 },
  { name: "AZ Family (3TV/CBS5)", impressions: 87400,  completions: 78200,  cpm: 20.70, frequency: 2.43, completionRate: 89.5 },
  { name: "KAZT (AZ TV)",         impressions: 64200,  completions: 57800,  cpm: 18.40, frequency: 2.18, completionRate: 90.0 },
  { name: "Univision Arizona",    impressions: 74000,  completions: 18000,  cpm: 17.89, frequency: 4.11, completionRate: 91.9 },
];

// YouTube Performance
export const YOUTUBE = {
  preRoll:   { impressions: 892400, completions: 714000, cpm: 14.20, completionRate: 80.0, views: 714000, cpcv: 0.018 },
  midRoll:   { impressions: 412800, completions: 371500, cpm: 18.40, completionRate: 90.0, views: 371500, cpcv: 0.020 },
  bumper:    { impressions: 287400, completions: 287400, cpm:  8.90, completionRate: 100,  views: 287400, cpcv: 0.009 },
  discovery: { impressions: 198700, completions: 178800, cpm: 12.10, completionRate: 90.0, views: 178800, cpcv: 0.014 },
};

// DSP / Programmatic
export const DSP = {
  display:     { impressions: 1284000, clicks: 12840, ctr: 1.00, cpm:  4.20, cpc: 0.42 },
  nativeAds:   { impressions: 487200,  clicks: 6334,  ctr: 1.30, cpm:  6.80, cpc: 0.52 },
  preRollDsp:  { impressions: 312400,  clicks: 2812,  ctr: 0.90, cpm: 12.40, cpc: 1.38 },
  retargeting: { impressions: 198700,  clicks: 3975,  ctr: 2.00, cpm:  9.80, cpc: 0.49 },
};

// SiteID Visitor Feed — Scottsdale/Phoenix area prospects
export const SITE_VISITORS = [
  { first: "Brian",    last: "Langford",     city: "Scottsdale",      zip: "85254", income: "$250,000+",    networth: "$750K–$999K", credit: "U", job: "Executive VP",          company: "Staples Stores",           score: 90, mood: "High Intent", vehicle: "BMW 7 Series",      time: "2m ago" },
  { first: "Ashvin",   last: "Patel",        city: "Scottsdale",      zip: "85259", income: "$75K–$99K",    networth: "$1M+",        credit: "C", job: "Owner",                 company: "Hue Hospitality Inc.",     score: 79, mood: "In-Market",   vehicle: "Mercedes S-Class",  time: "4m ago" },
  { first: "Austin",   last: "Fletcher",     city: "Paradise Valley", zip: "85253", income: "$250,000+",    networth: "$25K–$49K",   credit: "D", job: "Executive",             company: "Vestar",                   score: 45, mood: "Prospect",    vehicle: "Porsche Cayenne",   time: "7m ago" },
  { first: "Kristin",  last: "Calloway",     city: "Scottsdale",      zip: "85251", income: "$150K–$199K",  networth: "$500K–$749K", credit: "E", job: "Manager",               company: "Imagen Dental Partners",   score: 72, mood: "In-Market",   vehicle: "Lexus LX",          time: "11m ago" },
  { first: "Gloria",   last: "Mendez",       city: "Tucson",          zip: "85746", income: "$100K–$149K",  networth: "$1M+",        credit: "U", job: "Accounting Tech",       company: "AZ Dept of Child Safety",  score: 70, mood: "In-Market",   vehicle: "Range Rover",       time: "14m ago" },
  { first: "Jessica",  last: "Donovan",      city: "Flagstaff",       zip: "86001", income: "$75K–$99K",    networth: "$375K–$499K", credit: "C", job: "Sr. Ops Analyst",       company: "XPO",                      score: 59, mood: "Awareness",   vehicle: "Audi Q7",           time: "18m ago" },
  { first: "Warren",   last: "Hutchins",     city: "Flagstaff",       zip: "86001", income: "$75K–$99K",    networth: "$25K–$49K",   credit: "U", job: "Manager",               company: "Olsen's Grain Inc.",       score: 56, mood: "Awareness",   vehicle: "Cadillac Escalade", time: "22m ago" },
  { first: "Ruben",    last: "Aguilar",      city: "Yuma",            zip: "85365", income: "$60K–$74K",    networth: "N/A",         credit: "E", job: "Engineer",              company: "Triveni Digital",          score: 45, mood: "Prospect",    vehicle: "Tesla Model X",     time: "26m ago" },
  { first: "Ann",      last: "Fitzgerald",   city: "Phoenix",         zip: "85028", income: "$60K–$74K",    networth: "N/A",         credit: "D", job: "Medical Social Worker", company: "Gentiva Hospice",          score: 45, mood: "Prospect",    vehicle: "Lincoln Navigator", time: "31m ago" },
  { first: "Brian",    last: "Morrison",     city: "Phoenix",         zip: "85028", income: "$100K–$149K",  networth: "-$2.5K–$2.5K",credit: "B", job: "Principal",             company: "Civil & Env. Consultants", score: 69, mood: "Awareness",   vehicle: "Volvo XC90",        time: "35m ago" },
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
    { label: "Under $25K",  value: 42 },
    { label: "$25K–$49K",   value: 68 },
    { label: "$50K–$99K",   value: 74 },
    { label: "$100K–$249K", value: 82 },
    { label: "$250K–$499K", value: 71 },
    { label: "$500K–$999K", value: 64 },
    { label: "$1M+",        value: 67 },
  ],
  credit: [
    { label: "A (Excellent)",  value: 48 },
    { label: "B (Very Good)",  value: 72 },
    { label: "C (Good)",       value: 94 },
    { label: "D (Fair)",       value: 87 },
    { label: "E (Poor)",       value: 76 },
    { label: "G (Rebuilding)", value: 41 },
    { label: "U (Unknown)",    value: 50 },
  ],
  homeowner: [
    { label: "Homeowner", value: 312 },
    { label: "Renter",    value: 98 },
    { label: "Unknown",   value: 58 },
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
  { label: "High Intent", count: 39,  color: "#4ade80", desc: "Score 80–100 · Ready to buy" },
  { label: "In-Market",   count: 94,  color: "#38bdf8", desc: "Score 65–79 · Actively researching" },
  { label: "Awareness",   count: 168, color: "#f59e0b", desc: "Score 50–64 · Building consideration" },
  { label: "Prospect",    count: 167, color: "#a78bfa", desc: "Score below 50 · Top of funnel" },
];

// Content Consumer Segments
export const CONTENT_SEGMENTS = [
  { label: "Business/Finance",      count: 112, color: "#38bdf8" },
  { label: "General Entertainment", count: 98,  color: "#a78bfa" },
  { label: "Lifestyle/News",        count: 87,  color: "#4ade80" },
  { label: "Tech/Innovation",       count: 74,  color: "#f59e0b" },
  { label: "Education",             count: 52,  color: "#fb923c" },
  { label: "Health/Wellness",       count: 45,  color: "#f472b6" },
];

// Day Part Performance
export const DAYPARTS = [
  { label: "Morning/Daytime", impressions: 1284000, completionRate: 84.2, cpm: 16.80, count: 142 },
  { label: "Evening News",    impressions: 1087200, completionRate: 91.4, cpm: 22.40, count: 118 },
  { label: "Primetime",       impressions: 1421800, completionRate: 88.7, cpm: 24.10, count: 124 },
  { label: "Late Night",      impressions: 819600,  completionRate: 82.1, cpm: 14.20, count: 84  },
];

// Creative Performance — Defender-focused
export const CREATIVES = [
  { name: ":30 CTV — Defender Conquest",    impressions: 1842000, completions: 1620000, cpm: 19.40, completionRate: 88.0, format: "CTV :30" },
  { name: ":15 CTV — Defender Retarget",    impressions: 1124000, completions: 1002000, cpm: 16.80, completionRate: 89.1, format: "CTV :15" },
  { name: "YouTube Pre-Roll :30 Defender",  impressions: 892400,  completions: 714000,  cpm: 14.20, completionRate: 80.0, format: "YT Pre" },
  { name: "YouTube Mid-Roll :15 Defender",  impressions: 412800,  completions: 371500,  cpm: 18.40, completionRate: 90.0, format: "YT Mid" },
  { name: "YouTube Bumper :06",             impressions: 287400,  completions: 287400,  cpm:  8.90, completionRate: 100,  format: "YT Bump" },
  { name: "DSP Display 300×250 Defender",   impressions: 1284000, completions: 0,       cpm:  4.20, completionRate: 0,    format: "Display" },
  { name: "DSP Native — Defender 110",      impressions: 487200,  completions: 0,       cpm:  6.80, completionRate: 0,    format: "Native" },
  { name: "Local Phoenix :30 Defender",     impressions: 659700,  completions: 592000,  cpm: 22.20, completionRate: 89.7, format: "Local" },
];
