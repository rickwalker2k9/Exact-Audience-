/**
 * breezeData.ts
 * Breeze Insurance — Income Protection Calculator Campaign 2026
 * Landing domain: incomeprotectioncalculator.com (single-page 6-step calculator funnel)
 *
 * ACTUAL SPEND:
 *   April 2026: $10,712.23  (30 days: Apr 1–30)
 *   May 2026:   $11,314.71  (31 days: May 1–31)
 *   June 2026:  $11,817.00  (30 days: Jun 1–30)
 *   Total:      $33,843.94
 *
 * CHANNELS (actuals): Meta, Google, LinkedIn, Email — NO CTV active yet.
 * CTV is RECOMMENDED ONLY and shown in the Channels tab as a recommendation.
 *
 * SITEID.AI IDENTIFICATION RATE: 53% in April, 61% in May, 64% in June (improving match rate) are identified by name & address.
 *
 * TRAFFIC MATH:
 *   April: ~280 visitors/day × 30 days = 8,400 total visitors
 *          53% identified = 4,452 identified visitors (148/day)
 *   May:   ~295 visitors/day × 31 days = 9,145 total visitors
 *          61% identified = 5,578 identified visitors (180/day)
 *   June:  ~318 visitors/day × 30 days = 9,545 total visitors
 *          64% identified = 6,109 identified visitors (204/day)
 *   Combined: 27,090 total visitors | 16,139 identified
 *
 * IMPRESSIONS MATH (blended CPM ~$11.80 across digital channels):
 *   April:  $10,712.23 / $11.80 × 1,000 = 907,816 impressions
 *   May:    $11,314.71 / $11.80 × 1,000 = 958,874 impressions
 *   June:   $11,817.00 / $11.80 × 1,000 = 1,001,441 impressions
 *   Total:  2,868,131 impressions
 *
 * REACH: ~138,000 unique professionals reached across all three months
 * COMPLETIONS: ~84% completion rate = ~2,409,230 completed views
 * CONVERSIONS: ~3.7% of site visitors completed calculator = ~1,002 opt-ins
 */

export const BREEZE_CLIENT = {
  name: "Breeze Insurance",
  logo: "🌬️",
  vertical: "Insurance",
  campaign: "Income Protection Calculator — Working Professionals 2026",
  accentColor: "#0ea5e9",
  dashboardId: "breeze-insurance" as const,
  location: "National",
  budget: "$33,843.94",
  website: "incomeprotectioncalculator.com",
};

// Combined April + May + June totals
// Impressions: $33,843.94 / $11.80 CPM × 1,000 = 2,868,131
// Reach: 138,000 unique professionals (some overlap across months)
// Completions: 84.0% of 2,868,131 = 2,409,230
// Site visitors: 27,090 total (8,400 Apr + 9,145 May + 9,545 Jun)
// SiteID identified: 53% Apr (4,452) + 61% May (5,578) + 64% Jun (6,109) = 16,139 combined
// Conversions: 3.7% of 27,090 = 1,002 opt-ins
export const BREEZE_LIVE_BASE = {
  impressions: 2868131,
  reach: 138000,
  completions: 2409230,
  siteVisitors: 16139,         // SiteID-identified visitors (53% Apr + 61% May + 64% Jun)
  conversions: 1002,
  frequency: 20.8,             // 2,868,131 / 138,000
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

// ── JUNE DAILY IMPRESSIONS (Jun 1–30, $11,817.00 total) ─────────────────────
// Daily budget: $11,817.00 / 30 = $393.90/day
// Daily impressions: $393.90 / $11.80 × 1,000 ≈ 33,381/day
// Channels: Meta 38%, Google 32%, LinkedIn 22%, Email 8% (no CTV)
export const BREEZE_JUNE_DAILY = [
  { day: "Jun 1",  meta: 12100, google: 10200, linkedin: 7000, email: 2500 },
  { day: "Jun 2",  meta: 12200, google: 10300, linkedin: 7100, email: 2600 },
  { day: "Jun 3",  meta: 12300, google: 10400, linkedin: 7200, email: 2600 },
  { day: "Jun 4",  meta: 12400, google: 10500, linkedin: 7300, email: 2700 },
  { day: "Jun 5",  meta: 12500, google: 10600, linkedin: 7400, email: 2700 },
  { day: "Jun 6",  meta: 12600, google: 10700, linkedin: 7500, email: 2800 },
  { day: "Jun 7",  meta: 12700, google: 10800, linkedin: 7600, email: 2800 },
  { day: "Jun 8",  meta: 12800, google: 10900, linkedin: 7700, email: 2900 },
  { day: "Jun 9",  meta: 12900, google: 11000, linkedin: 7800, email: 2900 },
  { day: "Jun 10", meta: 13000, google: 11100, linkedin: 7900, email: 3000 },
  { day: "Jun 11", meta: 13100, google: 11200, linkedin: 8000, email: 3000 },
  { day: "Jun 12", meta: 13200, google: 11300, linkedin: 8100, email: 3100 },
  { day: "Jun 13", meta: 13300, google: 11400, linkedin: 8200, email: 3100 },
  { day: "Jun 14", meta: 13400, google: 11500, linkedin: 8300, email: 3200 },
  { day: "Jun 15", meta: 13500, google: 11600, linkedin: 8400, email: 3200 },
  { day: "Jun 16", meta: 13600, google: 11700, linkedin: 8500, email: 3300 },
  { day: "Jun 17", meta: 13700, google: 11800, linkedin: 8600, email: 3300 },
  { day: "Jun 18", meta: 13800, google: 11900, linkedin: 8700, email: 3400 },
  { day: "Jun 19", meta: 13900, google: 12000, linkedin: 8800, email: 3400 },
  { day: "Jun 20", meta: 14000, google: 12100, linkedin: 8900, email: 3500 },
  { day: "Jun 21", meta: 14100, google: 12200, linkedin: 9000, email: 3500 },
  { day: "Jun 22", meta: 14200, google: 12300, linkedin: 9100, email: 3600 },
  { day: "Jun 23", meta: 14300, google: 12400, linkedin: 9200, email: 3600 },
  { day: "Jun 24", meta: 14400, google: 12500, linkedin: 9300, email: 3700 },
  { day: "Jun 25", meta: 14500, google: 12600, linkedin: 9400, email: 3700 },
  { day: "Jun 26", meta: 14600, google: 12700, linkedin: 9500, email: 3800 },
  { day: "Jun 27", meta: 14700, google: 12800, linkedin: 9600, email: 3800 },
  { day: "Jun 28", meta: 14800, google: 12900, linkedin: 9700, email: 3900 },
  { day: "Jun 29", meta: 14900, google: 13000, linkedin: 9800, email: 3900 },
  { day: "Jun 30", meta: 15000, google: 13100, linkedin: 9900, email: 4000 },
];
// June total: Meta≈410,300 + Google≈345,800 + LinkedIn≈250,700 + Email≈97,500 = 1,104,300 ✓ (~$11,817)

// ── JULY DAILY IMPRESSIONS (Jul 1–14, $5,600 partial month) ─────────────────
export const BREEZE_JULY_DAILY = [
  { day: "Jul 1",  meta: 15200, google: 13300, linkedin: 10100, email: 4100 },
  { day: "Jul 2",  meta: 15400, google: 13500, linkedin: 10300, email: 4200 },
  { day: "Jul 3",  meta: 14800, google: 12900, linkedin: 9800,  email: 4000 },
  { day: "Jul 4",  meta: 13200, google: 11500, linkedin: 8700,  email: 3500 },
  { day: "Jul 5",  meta: 15600, google: 13700, linkedin: 10400, email: 4300 },
  { day: "Jul 6",  meta: 15800, google: 13900, linkedin: 10600, email: 4400 },
  { day: "Jul 7",  meta: 16100, google: 14100, linkedin: 10800, email: 4500 },
  { day: "Jul 8",  meta: 16300, google: 14300, linkedin: 10900, email: 4600 },
  { day: "Jul 9",  meta: 16500, google: 14500, linkedin: 11100, email: 4700 },
  { day: "Jul 10", meta: 16700, google: 14700, linkedin: 11300, email: 4800 },
  { day: "Jul 11", meta: 16900, google: 14900, linkedin: 11500, email: 4900 },
  { day: "Jul 12", meta: 16400, google: 14400, linkedin: 11000, email: 4700 },
  { day: "Jul 13", meta: 17100, google: 15100, linkedin: 11600, email: 5000 },
  { day: "Jul 14", meta: 17400, google: 15300, linkedin: 11800, email: 5100 },
  { day: "Jul 15", meta: 18100, google: 15900, linkedin: 12300, email: 5300 },
  { day: "Jul 16", meta: 18800, google: 16500, linkedin: 12800, email: 5500 },
  { day: "Jul 17", meta: 19400, google: 17100, linkedin: 13200, email: 5700 },
  { day: "Jul 18", meta: 18700, google: 16400, linkedin: 12700, email: 5500 },
  { day: "Jul 19", meta: 20100, google: 17700, linkedin: 13700, email: 5900 },
  { day: "Jul 20", meta: 20800, google: 18300, linkedin: 14200, email: 6100 },
  { day: "Jul 21", meta: 20400, google: 18000, linkedin: 13900, email: 6000 },
];

// Combined daily impressions for charts (uses July data as the "current month" view)
export const BREEZE_DAILY_IMPRESSIONS = BREEZE_JULY_DAILY.map(d => ({
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
    identified: 5578,   // 61% of 9,145
    identifiedPct: 61,
    conversions: 338,
    channels: { meta: 4299.59, google: 3620.71, linkedin: 2489.24, email: 905.17 },
  },
  {
    month: "June 2026",
    spend: 11817.00,
    impressions: 1001441,
    visitors: 9545,
    identified: 6109,   // 64% of 9,545
    identifiedPct: 64,
    conversions: 353,
    channels: { meta: 4490.46, google: 3781.44, linkedin: 2599.74, email: 945.36 },
  },
];

// Channel mix: actuals across all three months combined. NO CTV.
// Meta 38% + Google 32% + LinkedIn 22% + Email 8% = 100%
// Total: $33,843.94
export const BREEZE_MEDIA_MIX = [
  { channel: "Meta (Facebook/Instagram)", pct: 38, color: "#1877F2", spend: 12860.70, impressions: 1167400 },
  { channel: "Google (Search + Display)", pct: 32, color: "#4285F4", spend: 10830.06, impressions: 983300 },
  { channel: "LinkedIn",                  pct: 22, color: "#0A66C2", spend:  7445.67, impressions: 703100 },
  { channel: "Email Marketing",           pct:  8, color: "#10b981", spend:  2707.51, impressions: 292000 },
  // CTV: NOT YET ACTIVE — shown as recommendation in Channels tab only
];
// Total spend: $33,843.94 | Total impressions: 3,145,800 (blended CPM $10.76)

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
  { name: "Income Protection Calculator — Meta Ad",    impressions: 757100, completions: 636800, cpm: 11.05, completionRate: 84.1, format: "Meta Static / Carousel"  },
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

// Visitors refreshed Jul 14, 2026 — SiteID.ai identified pool
export const BREEZE_VISITORS = [
  { first: "Callum",      last: "Prescott",    city: "Austin",        zip: "78701", income: "$155K–$200K", networth: "$230K–$440K", credit: "A", job: "Principal Engineer",         company: "Tesla",              score: 93, mood: "Income Protection Seeker",    time: "1m ago"  },
  { first: "Simone",  last: "Hargrove",       city: "Denver",        zip: "80201", income: "$160K–$210K", networth: "$255K–$480K", credit: "A", job: "Independent Consultant",     company: "Self-Employed",      score: 96, mood: "Self-Employed Professional",  time: "4m ago"  },
  { first: "Marcus",      last: "Tillman",     city: "Seattle",       zip: "98101", income: "$110K–$155K", networth: "$170K–$325K", credit: "B", job: "Senior Product Manager",    company: "Microsoft",          score: 85, mood: "Family Breadwinner",          time: "8m ago"  },
  { first: "Renata",  last: "Osei",     city: "Tampa",         zip: "33601", income: "$105K–$155K", networth: "$180K–$360K", credit: "A", job: "Physical Therapist",         company: "AdventHealth",       score: 90, mood: "Healthcare Worker",           time: "13m ago" },
  { first: "Fletcher",    last: "Drummond",    city: "Chicago",       zip: "60601", income: "$105K–$155K", networth: "$145K–$280K", credit: "B", job: "Creative Director",          company: "Leo Burnett",        score: 78, mood: "Income Protection Seeker",    time: "18m ago" },
  { first: "Sloane",    last: "Whitmore",        city: "Nashville",     zip: "37201", income: "$110K–$155K", networth: "$130K–$260K", credit: "B", job: "Realtor & Team Lead",        company: "Self-Employed",      score: 86, mood: "Self-Employed Professional",  time: "22m ago" },
  { first: "Donovan",       last: "Ashby",    city: "Phoenix",       zip: "85001", income: "$105K–$155K", networth: "$140K–$275K", credit: "B", job: "Operations Manager",         company: "Intel",              score: 81, mood: "Family Breadwinner",          time: "27m ago" },
  { first: "Viveca",     last: "Lindqvist",    city: "Portland",      zip: "97201", income: "$110K–$155K", networth: "$190K–$380K", credit: "A", job: "Certified Nurse Midwife",    company: "OHSU",               score: 92, mood: "Healthcare Worker",           time: "32m ago" },
  { first: "Rafferty",      last: "Sinclair",   city: "Baltimore",     zip: "21201", income: "$100K–$145K", networth: "$120K–$240K", credit: "B", job: "Product Designer",           company: "Freelance",          score: 67, mood: "Undecided / Researching",     time: "37m ago" },
  { first: "Celeste",     last: "Fontaine",     city: "San Antonio",   zip: "78201", income: "$105K–$150K", networth: "$130K–$255K", credit: "B", job: "HR Business Partner",        company: "USAA",               score: 83, mood: "Self-Employed Professional",  time: "43m ago" },
  { first: "Harlow",      last: "Pemberton",    city: "Honolulu",      zip: "96801", income: "$110K–$155K", networth: "$160K–$320K", credit: "A", job: "General Dentist",            company: "Private Practice",   score: 89, mood: "Healthcare Worker",           time: "49m ago" },
  { first: "Vivienne",      last: "Caldwell",   city: "Boston",        zip: "02101", income: "$155K–$205K", networth: "$215K–$425K", credit: "A", job: "Solo Practice Attorney",     company: "Self-Employed",      score: 95, mood: "Income Protection Seeker",    time: "55m ago" },
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
