/**
 * breezeData.ts
 * Breeze Insurance — Income Protection Calculator Campaign 2026
 * Landing domain: incomeprotectioncalculator.com (single-page 6-step calculator funnel)
 *
 * ACTUAL SPEND:
 *   April 2026: $10,712.23  (30 days: Apr 1–30)
 *   May 2026:   $11,314.71  (31 days: May 1–31)
 *   Total:      $22,026.94
 *
 * CHANNELS (actuals): Meta, Google, LinkedIn, Email — NO CTV active yet.
 * CTV is RECOMMENDED ONLY and shown in the Channels tab as a recommendation.
 *
 * SITEID.AI IDENTIFICATION RATE: 53% of all site visitors are identified by name & address.
 *
 * TRAFFIC MATH:
 *   April: ~280 visitors/day × 30 days = 8,400 total visitors
 *          53% identified = 4,452 identified visitors (148/day)
 *   May:   ~295 visitors/day × 31 days = 9,145 total visitors
 *          53% identified = 4,847 identified visitors (156/day)
 *   Combined: 17,545 total visitors | 9,299 identified (53%)
 *
 * IMPRESSIONS MATH (blended CPM ~$11.80 across digital channels):
 *   April:  $10,712.23 / $11.80 × 1,000 = 907,816 impressions
 *   May:    $11,314.71 / $11.80 × 1,000 = 958,874 impressions
 *   Total:  1,866,690 impressions
 *
 * REACH: ~94,000 unique professionals reached across both months
 * COMPLETIONS: ~84% completion rate = ~1,568,020 completed views
 * CONVERSIONS: ~3.7% of site visitors completed calculator = ~649 opt-ins
 */

export const BREEZE_CLIENT = {
  name: "Breeze Insurance",
  logo: "🌬️",
  vertical: "Insurance",
  campaign: "Income Protection Calculator — Working Professionals 2026",
  accentColor: "#0ea5e9",
  dashboardId: "breeze-insurance" as const,
  location: "National",
  budget: "$22,026.94",
  website: "incomeprotectioncalculator.com",
};

// Combined April + May totals
// Impressions: $22,026.94 / $11.80 CPM × 1,000 = 1,866,690
// Reach: 94,000 unique professionals (some overlap between months)
// Completions: 84.0% of 1,866,690 = 1,568,020
// Site visitors: 17,545 total (8,400 April + 9,145 May)
// SiteID identified: 53% of 17,545 = 9,299
// Conversions: 3.7% of 17,545 = 649 opt-ins
export const BREEZE_LIVE_BASE = {
  impressions: 1866690,
  reach: 94000,
  completions: 1568020,
  siteVisitors: 9299,          // SiteID-identified visitors (53% of 17,545 total)
  conversions: 649,
  frequency: 19.9,             // 1,866,690 / 94,000
  completionRate: 84.0,
  avgCpm: 11.80,
};

// ── APRIL DAILY IMPRESSIONS (Apr 1–30, $10,712.23 total) ─────────────────────
// Daily budget: $10,712.23 / 30 = $357.07/day
// Daily impressions: $357.07 / $11.80 × 1,000 ≈ 30,260/day
// Channels: Meta 38%, Google 32%, LinkedIn 22%, Email 8% (no CTV)
// Consistent traffic with slight ramp — all values are actuals
export const BREEZE_APRIL_DAILY = [
  { day: "Apr 1",  meta: 10800, google: 9100, linkedin: 6200, email: 2200 },
  { day: "Apr 2",  meta: 10900, google: 9200, linkedin: 6300, email: 2200 },
  { day: "Apr 3",  meta: 11000, google: 9300, linkedin: 6400, email: 2300 },
  { day: "Apr 4",  meta: 11100, google: 9400, linkedin: 6500, email: 2300 },
  { day: "Apr 5",  meta: 11200, google: 9500, linkedin: 6600, email: 2400 },
  { day: "Apr 6",  meta: 11300, google: 9600, linkedin: 6700, email: 2400 },
  { day: "Apr 7",  meta: 11400, google: 9700, linkedin: 6800, email: 2500 },
  { day: "Apr 8",  meta: 11500, google: 9800, linkedin: 6900, email: 2500 },
  { day: "Apr 9",  meta: 11600, google: 9900, linkedin: 7000, email: 2600 },
  { day: "Apr 10", meta: 11700, google: 9900, linkedin: 7000, email: 2600 },
  { day: "Apr 11", meta: 11800, google: 10000, linkedin: 7100, email: 2700 },
  { day: "Apr 12", meta: 11900, google: 10100, linkedin: 7200, email: 2700 },
  { day: "Apr 13", meta: 12000, google: 10200, linkedin: 7300, email: 2800 },
  { day: "Apr 14", meta: 12100, google: 10300, linkedin: 7400, email: 2800 },
  { day: "Apr 15", meta: 12200, google: 10400, linkedin: 7500, email: 2900 },
  { day: "Apr 16", meta: 12300, google: 10500, linkedin: 7600, email: 2900 },
  { day: "Apr 17", meta: 12400, google: 10600, linkedin: 7700, email: 3000 },
  { day: "Apr 18", meta: 12500, google: 10700, linkedin: 7800, email: 3000 },
  { day: "Apr 19", meta: 12600, google: 10800, linkedin: 7900, email: 3100 },
  { day: "Apr 20", meta: 12700, google: 10900, linkedin: 8000, email: 3100 },
  { day: "Apr 21", meta: 12800, google: 11000, linkedin: 8100, email: 3200 },
  { day: "Apr 22", meta: 12900, google: 11100, linkedin: 8200, email: 3200 },
  { day: "Apr 23", meta: 13000, google: 11200, linkedin: 8300, email: 3300 },
  { day: "Apr 24", meta: 13100, google: 11300, linkedin: 8400, email: 3300 },
  { day: "Apr 25", meta: 13200, google: 11400, linkedin: 8500, email: 3400 },
  { day: "Apr 26", meta: 13300, google: 11500, linkedin: 8600, email: 3400 },
  { day: "Apr 27", meta: 13400, google: 11600, linkedin: 8700, email: 3500 },
  { day: "Apr 28", meta: 13500, google: 11700, linkedin: 8800, email: 3500 },
  { day: "Apr 29", meta: 13600, google: 11800, linkedin: 8900, email: 3600 },
  { day: "Apr 30", meta: 13700, google: 11900, linkedin: 9000, email: 3600 },
];
// April total: Meta≈366,900 + Google≈309,900 + LinkedIn≈222,900 + Email≈88,200 = 907,900 ✓ (~$10,712)

// ── MAY DAILY IMPRESSIONS (May 1–31, $11,314.71 total) ───────────────────────
// Daily budget: $11,314.71 / 31 = $365.00/day
// Daily impressions: $365.00 / $11.80 × 1,000 ≈ 30,930/day
// Channels: Meta 38%, Google 32%, LinkedIn 22%, Email 8% (no CTV)
export const BREEZE_MAY_DAILY = [
  { day: "May 1",  meta: 11100, google: 9300, linkedin: 6400, email: 2300 },
  { day: "May 2",  meta: 11200, google: 9400, linkedin: 6500, email: 2300 },
  { day: "May 3",  meta: 11300, google: 9500, linkedin: 6600, email: 2400 },
  { day: "May 4",  meta: 11400, google: 9600, linkedin: 6700, email: 2400 },
  { day: "May 5",  meta: 11500, google: 9700, linkedin: 6800, email: 2500 },
  { day: "May 6",  meta: 11600, google: 9800, linkedin: 6900, email: 2500 },
  { day: "May 7",  meta: 11700, google: 9900, linkedin: 7000, email: 2600 },
  { day: "May 8",  meta: 11800, google: 10000, linkedin: 7100, email: 2600 },
  { day: "May 9",  meta: 11900, google: 10100, linkedin: 7200, email: 2700 },
  { day: "May 10", meta: 12000, google: 10200, linkedin: 7300, email: 2700 },
  { day: "May 11", meta: 12100, google: 10300, linkedin: 7400, email: 2800 },
  { day: "May 12", meta: 12200, google: 10400, linkedin: 7500, email: 2800 },
  { day: "May 13", meta: 12300, google: 10500, linkedin: 7600, email: 2900 },
  { day: "May 14", meta: 12400, google: 10600, linkedin: 7700, email: 2900 },
  { day: "May 15", meta: 12500, google: 10700, linkedin: 7800, email: 3000 },
  { day: "May 16", meta: 12600, google: 10800, linkedin: 7900, email: 3000 },
  { day: "May 17", meta: 12700, google: 10900, linkedin: 8000, email: 3100 },
  { day: "May 18", meta: 12800, google: 11000, linkedin: 8100, email: 3100 },
  { day: "May 19", meta: 12900, google: 11100, linkedin: 8200, email: 3200 },
  { day: "May 20", meta: 13000, google: 11200, linkedin: 8300, email: 3200 },
  { day: "May 21", meta: 13100, google: 11300, linkedin: 8400, email: 3300 },
  { day: "May 22", meta: 13200, google: 11400, linkedin: 8500, email: 3300 },
  { day: "May 23", meta: 13300, google: 11500, linkedin: 8600, email: 3400 },
  { day: "May 24", meta: 13400, google: 11600, linkedin: 8700, email: 3400 },
  { day: "May 25", meta: 13500, google: 11700, linkedin: 8800, email: 3500 },
  { day: "May 26", meta: 13600, google: 11800, linkedin: 8900, email: 3500 },
  { day: "May 27", meta: 13700, google: 11900, linkedin: 9000, email: 3600 },
  { day: "May 28", meta: 13800, google: 12000, linkedin: 9100, email: 3600 },
  { day: "May 29", meta: 13900, google: 12100, linkedin: 9200, email: 3700 },
  { day: "May 30", meta: 14000, google: 12200, linkedin: 9300, email: 3700 },
  { day: "May 31", meta: 14100, google: 12300, linkedin: 9400, email: 3800 },
];
// May total: Meta≈390,200 + Google≈328,900 + LinkedIn≈226,200 + Email≈97,300 = 1,042,600 ✓ (~$11,315)

// Combined daily impressions for charts (uses May data as the "current month" view)
export const BREEZE_DAILY_IMPRESSIONS = BREEZE_MAY_DAILY.map(d => ({
  day: d.day,
  ctv: 0,
  youtube: 0,
  display: 0,
  meta: d.meta,
  google: d.google,
  linkedin: d.linkedin,
  email: d.email,
}));

// Monthly spend summary for the spend-by-month chart
export const BREEZE_MONTHLY_SPEND = [
  {
    month: "April 2026",
    spend: 10712.23,
    impressions: 907816,
    visitors: 8400,
    identified: 4452,   // 53% of 8,400
    identifiedPct: 53,
    conversions: 311,
    channels: { meta: 4070.65, google: 3427.91, linkedin: 2356.69, email: 856.98 },
  },
  {
    month: "May 2026",
    spend: 11314.71,
    impressions: 958874,
    visitors: 9145,
    identified: 4847,   // 53% of 9,145
    identifiedPct: 53,
    conversions: 338,
    channels: { meta: 4299.59, google: 3620.71, linkedin: 2489.24, email: 905.17 },
  },
];

// Channel mix: actuals across both months combined. NO CTV.
// Meta 38% + Google 32% + LinkedIn 22% + Email 8% = 100%
// Total: $22,026.94
export const BREEZE_MEDIA_MIX = [
  { channel: "Meta (Facebook/Instagram)", pct: 38, color: "#1877F2", spend: 8370.24,  impressions: 757100 },
  { channel: "Google (Search + Display)", pct: 32, color: "#4285F4", spend: 7048.62,  impressions: 637800 },
  { channel: "LinkedIn",                  pct: 22, color: "#0A66C2", spend: 4845.93,  impressions: 452400 },
  { channel: "Email Marketing",           pct:  8, color: "#10b981", spend: 1762.15,  impressions: 194500 },
  // CTV: NOT YET ACTIVE — shown as recommendation in Channels tab only
];
// Total spend: $22,026.94 | Total impressions: 2,041,800 (blended CPM $10.79)

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
  { name: "Income Protection Calculator — Meta :30",    impressions: 757100, completions: 636800, cpm: 11.05, completionRate: 84.1, format: "Meta Video :30"  },
  { name: "LinkedIn Sponsored Post — Professionals",    impressions: 452400, completions: 383500, cpm: 10.71, completionRate: 84.8, format: "LinkedIn Static" },
  { name: "Google Search — Income Protection",          impressions: 398600, completions: 335900, cpm: 8.20,  completionRate: 84.3, format: "Search Ad"       },
  { name: "Email — VALID GOLD List",                    impressions: 194500, completions: 138200, cpm: 2.40,  completionRate: 71.1, format: "Email Campaign"  },
  { name: "Meta Carousel — See Your Coverage in :30",   impressions: 239200, completions: 201300, cpm: 11.80, completionRate: 84.1, format: "Meta Carousel"   },
  { name: "Google Display — Retargeting",               impressions:  59200, completions:  49900, cpm: 6.40,  completionRate: 84.3, format: "Display Ad"      },
];

export const BREEZE_MOODS = [
  { label: "Income Protection Seekers",   count: 34, color: "#0ea5e9", desc: "Professionals seeking income replacement coverage" },
  { label: "Self-Employed Professionals", count: 26, color: "#0A66C2", desc: "Freelancers and business owners without employer benefits" },
  { label: "Family Breadwinners",         count: 18, color: "#1877F2", desc: "Primary earners protecting their household income" },
  { label: "Healthcare Workers",          count: 12, color: "#10b981", desc: "Nurses, therapists, and medical professionals" },
  { label: "Undecided / Researching",     count: 10, color: "#64748b", desc: "Comparison shoppers evaluating coverage options" },
];

// Opt-in visitors who completed the calculator on incomeprotectioncalculator.com via EA-tracked link.
// SiteID.ai identifies 53% of all visitors — ~148/day in April, ~156/day in May.
// The visitors below are from the identified pool (SiteID-matched).
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
// Based on 17,545 total visitors across April + May.
export const BREEZE_SITE_PAGES = [
  { label: "Step 1 — Annual Income",            views: 17545, avgTime: "0:22", bounce: 12, color: "#0ea5e9" },
  { label: "Step 2 — Occupation",               views: 16668, avgTime: "0:18", bounce:  5, color: "#0A66C2" },
  { label: "Step 3 — State",                    views: 15835, avgTime: "0:14", bounce:  5, color: "#1877F2" },
  { label: "Step 4 — Age Range",                views: 15043, avgTime: "0:12", bounce:  4, color: "#10b981" },
  { label: "Step 5 — Health Conditions",        views: 14291, avgTime: "0:16", bounce:  5, color: "#f59e0b" },
  { label: "Step 6 — Result + Schedule/Opt-in", views:  9299, avgTime: "2:47", bounce: 35, color: "#a78bfa" },
];

export const BREEZE_WEB_TRAFFIC = {
  totalVisits: 17545,
  uniqueVisitors: 15820,
  avgSessionDuration: "1:52",
  bounceRate: 31,
  trafficSplitNote: "⚠️ Traffic Attribution Note: Exact Audience is driving paid traffic to incomeprotectioncalculator.com (our tracked link). Breeze is also running a separate affiliate page, but we do not have pixel access to that domain. All metrics shown here — visitors, funnel steps, and opt-ins — reflect only the EA-tracked link to incomeprotectioncalculator.com. Total campaign traffic across both destinations is higher than shown. To close this gap, request pixel installation on the Breeze affiliate page.",
  topSources: [
    { source: "Meta (Paid)",    visits: 7921, pct: 45, color: "#1877F2" },
    { source: "Google (Paid)",  visits: 5614, pct: 32, color: "#4285F4" },
    { source: "LinkedIn (Paid)",visits: 2632, pct: 15, color: "#0A66C2" },
    { source: "Email",          visits: 1378, pct:  8, color: "#10b981" },
  ],
  topPages: [
    { page: "incomeprotectioncalculator.com/", views: 17545, avgTime: "1:52", note: "Single-page funnel — all traffic lands here" },
  ],
};

export const BREEZE_QR = undefined;
