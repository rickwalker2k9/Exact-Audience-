/**
 * barrettData.ts
 * Barrett Financial Group — SiteID.ai Visitor Identification Demo
 * Founded 2002 by Trevor Barrett | NMLS: 181106
 * HQ: 2701 East Insight Way, Suite 150, Chandler, AZ 85286
 * Phone: (480) 459-4500 | loans@barrettfinancial.com
 * Website: barrettfinancial.com
 * Scale: 3,000+ loans/month | Licensed in 49 states
 * Loan products: Conventional, FHA, VA, Jumbo, Reverse, ARM, USDA, DPA, Interest-Only
 *
 * SITEID.AI PITCH:
 *   barrettfinancial.com receives ~18,400 visitors/month
 *   Only ~3.2% (588/month) fill out a form or request a quote
 *   96.8% (17,812/month) leave without identifying themselves
 *   SiteID.ai identifies 58% of anonymous visitors = 10,331 identified/month
 *   At Barrett's avg loan value of $385,000 and 2.1% close rate on identified leads:
 *   10,331 × 2.1% = 217 additional loans/month × $3,850 avg revenue = $835,000/month
 *
 * TRAFFIC MATH:
 *   Monthly visitors: ~18,400
 *   Daily: ~613 visitors/day
 *   SiteID identified (58%): ~356/day | ~10,331/month
 *   Anonymous (42%): ~257/day | ~7,728/month
 *   Form completions (3.2%): ~588/month
 *
 * TOP PAGES:
 *   / (Home): 34% of traffic
 *   /loan-programs: 18%
 *   /about-us: 11%
 *   /reviews: 9%
 *   /contact: 7%
 *   /fha-loans: 6%
 *   /va-loans: 5%
 *   /jumbo-loans: 4%
 *   /refinance: 3%
 *   Other: 3%
 */

// ── CLIENT INFO ───────────────────────────────────────────────────────────────
export const BARRETT_CLIENT = {
  name: "Barrett Financial Group",
  logo: "🏠",
  vertical: "Mortgage Lending",
  campaign: "SiteID.ai Visitor Identification — Mortgage Lead Recovery 2026",
  accentColor: "#1d4ed8",
  dashboardId: "barrett-financial" as const,
  location: "Chandler / Scottsdale, AZ",
  budget: "$4,800/mo",
  website: "barrettfinancial.com",
};

// ── LIVE BASE STATS ───────────────────────────────────────────────────────────
export const BARRETT_LIVE_BASE = {
  impressions: 2204800,
  reach: 18400,
  completions: 1847000,
  siteVisitors: 10331,       // SiteID-identified visitors (58% of 17,812 anonymous)
  conversions: 588,          // form completions / quote requests
  frequency: 119.8,
  completionRate: 83.8,
  avgCpm: 0,
};

// ── DAILY IMPRESSIONS (last 30 days — May 3 to June 2) ───────────────────────
// Barrett runs Google Search, Meta Retargeting, and Display
// No CTV active yet — recommended
export const BARRETT_DAILY_IMPRESSIONS = [
  { day: "May 3",  youtube: 0, display: 8200, meta: 6100, google: 9400 },
  { day: "May 4",  youtube: 0, display: 8300, meta: 6200, google: 9500 },
  { day: "May 5",  youtube: 0, display: 8100, meta: 6000, google: 9300 },
  { day: "May 6",  youtube: 0, display: 8400, meta: 6300, google: 9600 },
  { day: "May 7",  youtube: 0, display: 8500, meta: 6400, google: 9700 },
  { day: "May 8",  youtube: 0, display: 8200, meta: 6100, google: 9400 },
  { day: "May 9",  youtube: 0, display: 8300, meta: 6200, google: 9500 },
  { day: "May 10", youtube: 0, display: 8600, meta: 6500, google: 9800 },
  { day: "May 11", youtube: 0, display: 8700, meta: 6600, google: 9900 },
  { day: "May 12", youtube: 0, display: 8400, meta: 6300, google: 9600 },
  { day: "May 13", youtube: 0, display: 8500, meta: 6400, google: 9700 },
  { day: "May 14", youtube: 0, display: 8800, meta: 6700, google: 10000 },
  { day: "May 15", youtube: 0, display: 8900, meta: 6800, google: 10100 },
  { day: "May 16", youtube: 0, display: 8600, meta: 6500, google: 9800 },
  { day: "May 17", youtube: 0, display: 8700, meta: 6600, google: 9900 },
  { day: "May 18", youtube: 0, display: 9000, meta: 6900, google: 10200 },
  { day: "May 19", youtube: 0, display: 9100, meta: 7000, google: 10300 },
  { day: "May 20", youtube: 0, display: 8800, meta: 6700, google: 10000 },
  { day: "May 21", youtube: 0, display: 8900, meta: 6800, google: 10100 },
  { day: "May 22", youtube: 0, display: 9200, meta: 7100, google: 10400 },
  { day: "May 23", youtube: 0, display: 9300, meta: 7200, google: 10500 },
  { day: "May 24", youtube: 0, display: 9000, meta: 6900, google: 10200 },
  { day: "May 25", youtube: 0, display: 9100, meta: 7000, google: 10300 },
  { day: "May 26", youtube: 0, display: 9400, meta: 7300, google: 10600 },
  { day: "May 27", youtube: 0, display: 9500, meta: 7400, google: 10700 },
  { day: "May 28", youtube: 0, display: 9200, meta: 7100, google: 10400 },
  { day: "May 29", youtube: 0, display: 9300, meta: 7200, google: 10500 },
  { day: "May 30", youtube: 0, display: 9600, meta: 7500, google: 10800 },
  { day: "Jun 1",  youtube: 0, display: 9700, meta: 7600, google: 10900 },
  { day: "Jun 2",  youtube: 0, display: 9800, meta: 7700, google: 11000 },
];

// ── MEDIA MIX ─────────────────────────────────────────────────────────────────
export const BARRETT_MEDIA_MIX = [
  { channel: "Google Search",   impressions: 308000, spend: 2160, pct: 45, color: "#4285F4" },
  { channel: "Meta Retargeting",impressions: 220000, spend: 1440, pct: 30, color: "#1877F2" },
  { channel: "Display / GDN",   impressions: 189000, spend: 960,  pct: 20, color: "#34A853" },
  { channel: "Email Nurture",   impressions: 44800,  spend: 240,  pct: 5,  color: "#EA4335" },
];

// ── CTV CHANNELS (Recommended — not yet active) ───────────────────────────────
export const BARRETT_CTV_CHANNELS = [
  { name: "HGTV",           cpm: 28, completionRate: 94, tier: "Premium", estReach: 12400, audienceScore: 97, note: "Home improvement audience — highest intent for mortgage", color: "#10b981" },
  { name: "Fox Business",   cpm: 32, completionRate: 91, tier: "Premium", estReach: 8900,  audienceScore: 94, note: "High-income homebuyers and investors", color: "#3b82f6" },
  { name: "CNN",            cpm: 30, completionRate: 89, tier: "Premium", estReach: 9200,  audienceScore: 88, note: "Broad reach, 35-54 homeowner demographic", color: "#ef4444" },
  { name: "CNBC",           cpm: 35, completionRate: 92, tier: "Premium", estReach: 7100,  audienceScore: 96, note: "Financial decision-makers, jumbo loan prospects", color: "#6366f1" },
  { name: "Discovery+",     cpm: 22, completionRate: 88, tier: "Standard",estReach: 14200, audienceScore: 85, note: "Home & lifestyle audience", color: "#f59e0b" },
  { name: "Peacock",        cpm: 20, completionRate: 86, tier: "Standard",estReach: 16800, audienceScore: 82, note: "Broad AZ market reach", color: "#8b5cf6" },
  { name: "Tubi",           cpm: 14, completionRate: 84, tier: "Value",   estReach: 22400, audienceScore: 76, note: "First-time buyer demographic, 25-40", color: "#ec4899" },
  { name: "Pluto TV",       cpm: 12, completionRate: 82, tier: "Value",   estReach: 24100, audienceScore: 74, note: "High volume, lower income bracket", color: "#14b8a6" },
];

// ── CREATIVES ─────────────────────────────────────────────────────────────────
export const BARRETT_CREATIVES = [
  { name: "Rate Alert — 30s",        impressions: 412000, completions: 348000, cpm: 11.2, completionRate: 84.5, format: "Pre-Roll Video" },
  { name: "First Time Buyer — 15s",  impressions: 318000, completions: 271000, cpm: 10.8, completionRate: 85.2, format: "Mid-Roll Video" },
  { name: "VA Loan Hero — 30s",      impressions: 287000, completions: 241000, cpm: 12.1, completionRate: 84.0, format: "CTV Spot" },
  { name: "Jumbo Loan — Static",     impressions: 198000, completions: 168000, cpm: 9.4,  completionRate: 84.8, format: "Display Banner" },
  { name: "Refinance Now — 15s",     impressions: 176000, completions: 149000, cpm: 10.2, completionRate: 84.7, format: "Social Video" },
  { name: "Make It Happen — 30s",    impressions: 148000, completions: 124000, cpm: 11.8, completionRate: 83.8, format: "Pre-Roll Video" },
];

// ── MOODS / AUDIENCE SEGMENTS ─────────────────────────────────────────────────
export const BARRETT_MOODS = [
  { label: "First-Time Buyer",  count: 4820, color: "#3b82f6", desc: "Pre-approved shoppers, 25–40, searching Zillow + Realtor.com daily" },
  { label: "Move-Up Buyer",     count: 3140, color: "#10b981", desc: "Current homeowners with equity, searching $600K–$1.2M homes" },
  { label: "Refinance Seeker",  count: 2890, color: "#f59e0b", desc: "Rate-sensitive owners monitoring 30-yr fixed, 620+ credit" },
  { label: "VA Loan Eligible",  count: 1640, color: "#8b5cf6", desc: "Active military / veterans searching VA loan calculators" },
  { label: "Jumbo Buyer",       count: 980,  color: "#ef4444", desc: "High-net-worth prospects, $1M+ purchase price, 760+ credit" },
  { label: "Investor / DSCR",   count: 720,  color: "#ec4899", desc: "Real estate investors researching DSCR and investment loans" },
];

// ── LIVE VISITOR FEED (SiteID-identified visitors on barrettfinancial.com) ────
export const BARRETT_VISITORS = [
  { first: "Michael",  last: "Thornton",   city: "Scottsdale",  zip: "85251", income: "$148,000",  networth: "$420,000",  credit: "A+", job: "Software Engineer",    company: "Intel",           score: 94, mood: "Move-Up Buyer",    time: "2m ago" },
  { first: "Jennifer", last: "Castillo",   city: "Gilbert",     zip: "85296", income: "$112,000",  networth: "$185,000",  credit: "A",  job: "Registered Nurse",    company: "Banner Health",   score: 88, mood: "First-Time Buyer", time: "4m ago" },
  { first: "David",    last: "Okafor",     city: "Chandler",    zip: "85286", income: "$195,000",  networth: "$680,000",  credit: "A+", job: "VP of Operations",    company: "GoDaddy",         score: 96, mood: "Jumbo Buyer",      time: "7m ago" },
  { first: "Sarah",    last: "Wentworth",  city: "Mesa",        zip: "85201", income: "$88,000",   networth: "$142,000",  credit: "B+", job: "Marketing Manager",   company: "Carvana",         score: 79, mood: "First-Time Buyer", time: "11m ago" },
  { first: "Robert",   last: "Nakamura",   city: "Tempe",       zip: "85281", income: "$134,000",  networth: "$310,000",  credit: "A",  job: "Financial Analyst",   company: "Charles Schwab",  score: 91, mood: "Refinance Seeker", time: "14m ago" },
  { first: "Amanda",   last: "Blackwood",  city: "Peoria",      zip: "85345", income: "$76,000",   networth: "$98,000",   credit: "B",  job: "Teacher",             company: "PUSD",            score: 72, mood: "First-Time Buyer", time: "18m ago" },
  { first: "James",    last: "Harrington", city: "Scottsdale",  zip: "85255", income: "$312,000",  networth: "$1,240,000",credit: "A+", job: "Orthopedic Surgeon",  company: "HonorHealth",     score: 98, mood: "Jumbo Buyer",      time: "22m ago" },
  { first: "Lisa",     last: "Pemberton",  city: "Glendale",    zip: "85301", income: "$94,000",   networth: "$167,000",  credit: "A-", job: "HR Director",         company: "Avnet",           score: 83, mood: "Move-Up Buyer",    time: "27m ago" },
  { first: "Marcus",   last: "Delacroix",  city: "Surprise",    zip: "85374", income: "$68,000",   networth: "$84,000",   credit: "B+", job: "Electrician",         company: "Rosendin",        score: 74, mood: "VA Loan Eligible", time: "31m ago" },
  { first: "Stephanie",last: "Lindqvist",  city: "Chandler",    zip: "85248", income: "$158,000",  networth: "$490,000",  credit: "A+", job: "Product Manager",     company: "Amazon",          score: 93, mood: "Move-Up Buyer",    time: "36m ago" },
  { first: "Kevin",    last: "Drummond",   city: "Queen Creek",  zip: "85142", income: "$122,000",  networth: "$248,000",  credit: "A",  job: "Construction Mgr",    company: "Sundt",           score: 87, mood: "Move-Up Buyer",    time: "41m ago" },
  { first: "Patricia", last: "Gallagher",  city: "Scottsdale",  zip: "85260", income: "$204,000",  networth: "$820,000",  credit: "A+", job: "Real Estate Attorney","company": "DLA Piper",     score: 95, mood: "Investor / DSCR",  time: "47m ago" },
];

// ── SITE PAGES ────────────────────────────────────────────────────────────────
export const BARRETT_SITE_PAGES = [
  { label: "Home",           views: 6256, avgTime: "1:42", bounce: 48, color: "#3b82f6" },
  { label: "Loan Programs",  views: 3312, avgTime: "3:18", bounce: 31, color: "#10b981" },
  { label: "About Us",       views: 2024, avgTime: "2:04", bounce: 42, color: "#f59e0b" },
  { label: "Reviews",        views: 1656, avgTime: "2:51", bounce: 28, color: "#8b5cf6" },
  { label: "FHA Loans",      views: 1104, avgTime: "3:44", bounce: 24, color: "#ef4444" },
  { label: "VA Loans",       views: 920,  avgTime: "3:52", bounce: 22, color: "#ec4899" },
  { label: "Jumbo Loans",    views: 736,  avgTime: "4:12", bounce: 19, color: "#14b8a6" },
  { label: "Contact",        views: 1288, avgTime: "1:28", bounce: 55, color: "#6366f1" },
];

// ── WEB TRAFFIC ───────────────────────────────────────────────────────────────
export const BARRETT_WEB_TRAFFIC = {
  globalRank: 284200,
  monthlyVisits: 18400,
  bounceRate: 52.3,
  visitsTrend: [14200, 15100, 15800, 16400, 17100, 17600, 18400, 1840],
  visitsDates: ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun MTD"],
  trafficSources: { Search: 52, Social: 14, Mail: 8, DisplayAds: 11, Direct: 11, Referrals: 4 },
  topKeywords: [
    { keyword: "mortgage broker scottsdale",  volume: "2,400/mo", position: 3,  trend: "up"   as const },
    { keyword: "fha loan arizona",            volume: "4,800/mo", position: 7,  trend: "up"   as const },
    { keyword: "va loan scottsdale",          volume: "1,900/mo", position: 4,  trend: "flat" as const },
    { keyword: "jumbo loan chandler az",      volume: "880/mo",   position: 5,  trend: "up"   as const },
    { keyword: "barrett financial group",     volume: "1,200/mo", position: 1,  trend: "flat" as const },
    { keyword: "first time home buyer az",    volume: "3,200/mo", position: 12, trend: "up"   as const },
    { keyword: "refinance mortgage arizona",  volume: "2,100/mo", position: 9,  trend: "down" as const },
  ],
  topPages: [
    { url: "/",              label: "Home",          views: "6,256", bounce: 48 },
    { url: "/loan-programs", label: "Loan Programs", views: "3,312", bounce: 31 },
    { url: "/about-us",      label: "About Us",      views: "2,024", bounce: 42 },
    { url: "/reviews",       label: "Reviews",       views: "1,656", bounce: 28 },
    { url: "/fha-loans",     label: "FHA Loans",     views: "1,104", bounce: 24 },
  ],
  trafficSplitNote: "52% of traffic arrives via organic search — high-intent mortgage shoppers actively comparing lenders. 96.8% leave without filling out a form.",
};

// ── BUYER PROFILES (SiteID-identified mortgage shoppers) ─────────────────────
// These are the people visiting barrettfinancial.com who never fill out a form.
// SiteID.ai identifies them so Barrett's loan officers can follow up.
export const BARRETT_BUYER_PROFILES = [
  {
    id: "barrett-001",
    first: "Michael",
    last: "Thornton",
    city: "Scottsdale",
    state: "AZ",
    zip: "85251",
    age: 38,
    gender: "Male",
    income: "$148,000",
    networth: "$420,000",
    homeEquity: "$187,000",
    creditGrade: "A+",
    creditScore: 784,
    homeowner: true,
    job: "Software Engineer",
    company: "Intel",
    score: 94,
    mood: "Move-Up Buyer",
    loanType: "Conventional / Jumbo",
    estimatedLoanAmount: "$720,000",
    journey: [
      { date: "May 4",  action: "Searched 'best mortgage brokers scottsdale az' on Google",       channel: "Google Search",    site: "google.com" },
      { date: "May 5",  action: "Browsed 4 homes on Zillow, price range $850K–$1.1M",              channel: "Organic",          site: "zillow.com" },
      { date: "May 7",  action: "Visited Realtor.com — saved 3 listings in 85255",                 channel: "Organic",          site: "realtor.com" },
      { date: "May 9",  action: "Used NerdWallet mortgage calculator — $720K at 6.8%",             channel: "Organic",          site: "nerdwallet.com" },
      { date: "May 11", action: "Clicked Barrett Financial Google ad — visited /loan-programs",    channel: "Google Search Ad", site: "barrettfinancial.com" },
      { date: "May 12", action: "Returned to barrettfinancial.com — viewed /jumbo-loans page",     channel: "Direct",           site: "barrettfinancial.com" },
      { date: "May 14", action: "Visited Rocket Mortgage — started application, did not complete", channel: "Organic",          site: "rocketmortgage.com" },
      { date: "May 16", action: "Returned to barrettfinancial.com via Meta retargeting ad",        channel: "Meta Ad",          site: "barrettfinancial.com" },
      { date: "May 18", action: "Viewed /reviews page — spent 4:12 reading testimonials",         channel: "Direct",           site: "barrettfinancial.com" },
      { date: "May 20", action: "Searched 'jumbo loan rates arizona 2026' — clicked Barrett ad",   channel: "Google Search Ad", site: "barrettfinancial.com" },
      { date: "May 22", action: "Visited LoanDepot — compared rates, bounced in 1:20",            channel: "Organic",          site: "loandepot.com" },
      { date: "May 24", action: "Returned to barrettfinancial.com — spent 6:44 on /loan-programs",channel: "Direct",           site: "barrettfinancial.com" },
      { date: "May 26", action: "Visited /contact page — did NOT submit form",                     channel: "Direct",           site: "barrettfinancial.com" },
      { date: "Jun 2",  action: "Active on barrettfinancial.com — SiteID identified",              channel: "SiteID.ai",        site: "barrettfinancial.com" },
    ],
  },
  {
    id: "barrett-002",
    first: "Jennifer",
    last: "Castillo",
    city: "Gilbert",
    state: "AZ",
    zip: "85296",
    age: 29,
    gender: "Female",
    income: "$112,000",
    networth: "$185,000",
    homeEquity: null,
    creditGrade: "A",
    creditScore: 741,
    homeowner: false,
    job: "Registered Nurse",
    company: "Banner Health",
    score: 88,
    mood: "First-Time Buyer",
    loanType: "FHA / Conventional",
    estimatedLoanAmount: "$380,000",
    journey: [
      { date: "May 2",  action: "Searched 'first time home buyer programs arizona 2026'",          channel: "Google Search",    site: "google.com" },
      { date: "May 3",  action: "Visited AZ Housing Finance Authority — read DPA program info",    channel: "Organic",          site: "azhousing.gov" },
      { date: "May 5",  action: "Browsed Zillow — 12 homes viewed, $350K–$420K in Gilbert",       channel: "Organic",          site: "zillow.com" },
      { date: "May 7",  action: "Used FHA loan calculator on HUD.gov",                             channel: "Organic",          site: "hud.gov" },
      { date: "May 9",  action: "Visited loanDepot — started pre-approval, abandoned at income step",channel: "Organic",        site: "loandepot.com" },
      { date: "May 11", action: "Searched 'barrett financial fha loan gilbert az' — visited site", channel: "Google Search Ad", site: "barrettfinancial.com" },
      { date: "May 13", action: "Viewed /fha-loans and /down-payment-assistance pages",            channel: "Direct",           site: "barrettfinancial.com" },
      { date: "May 15", action: "Visited Better.com — got a rate quote, did not proceed",          channel: "Organic",          site: "better.com" },
      { date: "May 17", action: "Returned to barrettfinancial.com via Meta ad — viewed /reviews",  channel: "Meta Ad",          site: "barrettfinancial.com" },
      { date: "May 20", action: "Searched 'how much house can I afford on $112k salary'",          channel: "Google Search",    site: "google.com" },
      { date: "May 23", action: "Visited barrettfinancial.com — used mortgage calculator",         channel: "Direct",           site: "barrettfinancial.com" },
      { date: "May 27", action: "Visited /contact page — spent 2:14, did NOT submit form",         channel: "Direct",           site: "barrettfinancial.com" },
      { date: "Jun 2",  action: "Active on barrettfinancial.com — SiteID identified",              channel: "SiteID.ai",        site: "barrettfinancial.com" },
    ],
  },
  {
    id: "barrett-003",
    first: "James",
    last: "Harrington",
    city: "Scottsdale",
    state: "AZ",
    zip: "85255",
    age: 52,
    gender: "Male",
    income: "$312,000",
    networth: "$1,240,000",
    homeEquity: "$640,000",
    creditGrade: "A+",
    creditScore: 812,
    homeowner: true,
    job: "Orthopedic Surgeon",
    company: "HonorHealth",
    score: 98,
    mood: "Jumbo Buyer",
    loanType: "Jumbo / Interest-Only",
    estimatedLoanAmount: "$1,850,000",
    journey: [
      { date: "May 1",  action: "Searched 'jumbo mortgage rates scottsdale 2026'",                 channel: "Google Search",    site: "google.com" },
      { date: "May 3",  action: "Browsed Zillow Luxury — 6 homes viewed, $2.1M–$3.4M in 85255",   channel: "Organic",          site: "zillow.com" },
      { date: "May 5",  action: "Visited Compass Real Estate — saved 2 listings",                  channel: "Organic",          site: "compass.com" },
      { date: "May 7",  action: "Visited Chase Private Client — jumbo loan page, bounced",         channel: "Organic",          site: "chase.com" },
      { date: "May 9",  action: "Searched 'interest only jumbo loan arizona' — clicked Barrett ad",channel: "Google Search Ad", site: "barrettfinancial.com" },
      { date: "May 11", action: "Spent 8:22 on /jumbo-loans and /interest-only pages",             channel: "Direct",           site: "barrettfinancial.com" },
      { date: "May 13", action: "Visited Wells Fargo Private Mortgage — got rate sheet",           channel: "Organic",          site: "wellsfargo.com" },
      { date: "May 16", action: "Returned to barrettfinancial.com via Google retargeting",         channel: "Google Display Ad",site: "barrettfinancial.com" },
      { date: "May 19", action: "Viewed /reviews — read 14 reviews, spent 5:48",                  channel: "Direct",           site: "barrettfinancial.com" },
      { date: "May 22", action: "Visited /contact — spent 3:12, did NOT submit form",              channel: "Direct",           site: "barrettfinancial.com" },
      { date: "May 26", action: "Searched 'barrett financial group reviews jumbo loan'",            channel: "Google Search",    site: "google.com" },
      { date: "May 29", action: "Returned to barrettfinancial.com — viewed loan officer profiles", channel: "Direct",           site: "barrettfinancial.com" },
      { date: "Jun 2",  action: "Active on barrettfinancial.com — SiteID identified",              channel: "SiteID.ai",        site: "barrettfinancial.com" },
    ],
  },
  {
    id: "barrett-004",
    first: "Robert",
    last: "Nakamura",
    city: "Tempe",
    state: "AZ",
    zip: "85281",
    age: 44,
    gender: "Male",
    income: "$134,000",
    networth: "$310,000",
    homeEquity: "$124,000",
    creditGrade: "A",
    creditScore: 762,
    homeowner: true,
    job: "Financial Analyst",
    company: "Charles Schwab",
    score: 91,
    mood: "Refinance Seeker",
    loanType: "Conventional Refinance",
    estimatedLoanAmount: "$440,000",
    journey: [
      { date: "May 6",  action: "Searched 'should I refinance my mortgage 2026 arizona'",          channel: "Google Search",    site: "google.com" },
      { date: "May 8",  action: "Used Bankrate refinance calculator — current rate 7.1%, target 6.4%",channel: "Organic",       site: "bankrate.com" },
      { date: "May 10", action: "Visited Rocket Mortgage refinance page — got rate estimate",       channel: "Organic",          site: "rocketmortgage.com" },
      { date: "May 12", action: "Searched 'barrett financial refinance scottsdale' — visited site", channel: "Google Search Ad", site: "barrettfinancial.com" },
      { date: "May 14", action: "Viewed /refinance and /conventional-loans pages",                  channel: "Direct",           site: "barrettfinancial.com" },
      { date: "May 16", action: "Visited LoanDepot refinance — started application, abandoned",     channel: "Organic",          site: "loandepot.com" },
      { date: "May 19", action: "Returned to barrettfinancial.com via Meta retargeting ad",         channel: "Meta Ad",          site: "barrettfinancial.com" },
      { date: "May 22", action: "Visited /reviews — read refinance testimonials",                   channel: "Direct",           site: "barrettfinancial.com" },
      { date: "May 25", action: "Visited /contact — spent 1:48, did NOT submit form",               channel: "Direct",           site: "barrettfinancial.com" },
      { date: "Jun 2",  action: "Active on barrettfinancial.com — SiteID identified",               channel: "SiteID.ai",        site: "barrettfinancial.com" },
    ],
  },
  {
    id: "barrett-005",
    first: "Marcus",
    last: "Delacroix",
    city: "Surprise",
    state: "AZ",
    zip: "85374",
    age: 34,
    gender: "Male",
    income: "$68,000",
    networth: "$84,000",
    homeEquity: null,
    creditGrade: "B+",
    creditScore: 698,
    homeowner: false,
    job: "Electrician",
    company: "Rosendin",
    score: 74,
    mood: "VA Loan Eligible",
    loanType: "VA Loan",
    estimatedLoanAmount: "$320,000",
    journey: [
      { date: "May 8",  action: "Searched 'va loan no down payment arizona 2026'",                  channel: "Google Search",    site: "google.com" },
      { date: "May 10", action: "Visited VA.gov — read VA loan eligibility requirements",            channel: "Organic",          site: "va.gov" },
      { date: "May 12", action: "Browsed Zillow — 8 homes, $280K–$340K in Surprise/Peoria",         channel: "Organic",          site: "zillow.com" },
      { date: "May 14", action: "Visited Veterans United — started pre-approval, abandoned at docs", channel: "Organic",          site: "veteransunited.com" },
      { date: "May 16", action: "Searched 'barrett financial va loan arizona' — clicked ad",         channel: "Google Search Ad", site: "barrettfinancial.com" },
      { date: "May 18", action: "Viewed /va-loans page — spent 4:38",                               channel: "Direct",           site: "barrettfinancial.com" },
      { date: "May 21", action: "Returned via Meta ad — viewed loan officer profiles",               channel: "Meta Ad",          site: "barrettfinancial.com" },
      { date: "May 24", action: "Visited /contact — spent 2:02, did NOT submit form",               channel: "Direct",           site: "barrettfinancial.com" },
      { date: "Jun 2",  action: "Active on barrettfinancial.com — SiteID identified",               channel: "SiteID.ai",        site: "barrettfinancial.com" },
    ],
  },
];

// ── AUDIENCE SEGMENT STATS ────────────────────────────────────────────────────
export const BARRETT_SEGMENT_STATS = {
  totalList: 10331,
  homeowners: 6820,
  avgIncomeLabel: "$128,400",
  netWorthLabel: "$342,000",
  creditGrade: "A / A+",
  withPhone: 9140,
  withEmail: 9820,
  targetUniverse: 10331,
};

// ── ROI MATH ──────────────────────────────────────────────────────────────────
export const BARRETT_ROI = {
  monthlyVisitors: 18400,
  anonymousVisitors: 17812,
  anonymousPct: 96.8,
  identifiedBySiteId: 10331,
  identificationRate: 58,
  avgLoanValue: 385000,
  avgRevenuePerLoan: 3850,
  closeRatePct: 2.1,
  additionalLoansPerMonth: 217,
  additionalRevenuePerMonth: 835450,
  siteIdMonthlyCost: 4800,
  roi: 174,
};
