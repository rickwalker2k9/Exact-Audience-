/**
 * starlingData.ts — Jeff Starling for Oklahoma AG — June 16, 2026 Republican Primary
 * PITCH DOCUMENT — 3 Budget Tiers ($30K / $65K / $93K) from Exact Audience Pitch Deck
 * Voter data: Statewide undecided Republican primary voter universe
 */

export const STARLING_CAMPAIGN_START = new Date("2026-05-30T00:00:00");
export const STARLING_ELECTION_DATE = new Date("2026-06-16T00:00:00");
export const STARLING_TOTAL_DAYS = 18;

export const STARLING_RACE = {
  registeredRepublicans: 1284262,
  expectedTurnoutLow: 231000,
  expectedTurnoutHigh: 282000,
  winThresholdLow: 116000,
  winThresholdHigh: 142000,
  currentPollingStarling: 20,
  currentPollingEchols: 35,
  undecided: 45,
  currentVotesStarling: 46000,
  currentVotesEchols: 81000,
  votesNeeded: 70000,
  markets: [
    { name: "Oklahoma City Metro", pct: 48, registeredR: 450000, echols: 38, starling: 16, note: "Battleground — Echols leads 38-16" },
    { name: "Tulsa Metro", pct: 32, registeredR: 350000, echols: 31, starling: 26, note: "Competitive — tight race, Starling home turf" },
    { name: "Rest of State", pct: 20, registeredR: 484262, echols: 32, starling: 18, note: "Rural/suburban — persuadable with bio message" },
  ],
};

export const STARLING_TIERS = [
  {
    id: "entry", label: "Entry", total: 30000,
    tagline: "Complement to existing broadcast TV spend",
    recommended: false,
    components: [
      { label: "CTV — OKC Market, Republican Voters 45+", budget: 11000 },
      { label: "CTV — Tulsa Market, Republican Voters 45+", budget: 11000 },
      { label: "Digital Display and Pre-roll", budget: 4000 },
      { label: "Exact Audience Platform Fee", budget: 4000 },
    ],
    metrics: {
      uniqueVoters: "75,000–95,000", frequency: "2–3x", persuasionThreshold: "Partially met",
      digitalImpressions: "80,000–120,000", siteIdContacts: "3,000–5,000",
      newVotes: "7,500–12,000", projectedTotal: "53,000–68,000", costPerVote: "$2.50–$4.00",
    },
    projections: [
      { scenario: "Conservative", votersReached: 75000, conversion: 6, newVotes: 4500, starlingTotal: "50,000–55,000" },
      { scenario: "Realistic", votersReached: 85000, conversion: 9, newVotes: 7650, starlingTotal: "53,000–62,000", highlight: true },
      { scenario: "Optimistic", votersReached: 95000, conversion: 13, newVotes: 12350, starlingTotal: "58,000–68,000" },
    ],
    ctvOKC: 11000, ctvTulsa: 11000, digital: 4000, platformFee: 4000,
    warning: "Frequency is below the persuasion threshold for most undecided voters. Best deployed as a complement to existing broadcast TV spend.",
    color: "#64748b", borderColor: "#94a3b8",
  },
  {
    id: "recommended", label: "Recommended", total: 65000,
    tagline: "Crosses persuasion threshold — majority of high-propensity voters reached",
    recommended: true,
    components: [
      { label: "CTV — OKC Market, Republican Voters 45+", budget: 25000 },
      { label: "CTV — Tulsa Market, Republican Voters 45+", budget: 25000 },
      { label: "Digital Display and Pre-roll", budget: 10000 },
      { label: "Exact Audience Platform Fee", budget: 5000 },
    ],
    metrics: {
      uniqueVoters: "170,000–220,000", frequency: "4–6x", persuasionThreshold: "Yes",
      digitalImpressions: "200,000–350,000", siteIdContacts: "6,000–9,000",
      newVotes: "23,400–28,000", projectedTotal: "69,000–84,000", costPerVote: "$2.32–$2.78",
    },
    projections: [
      { scenario: "Conservative", votersReached: 170000, conversion: 7, newVotes: 11900, starlingTotal: "58,000–68,000" },
      { scenario: "Realistic", votersReached: 195000, conversion: 12, newVotes: 23400, starlingTotal: "69,000–79,000", highlight: true },
      { scenario: "Optimistic", votersReached: 220000, conversion: 18, newVotes: 39600, starlingTotal: "85,000–96,000" },
    ],
    ctvOKC: 25000, ctvTulsa: 25000, digital: 10000, platformFee: 5000,
    warning: null, color: "#1d4ed8", borderColor: "#3b82f6",
  },
  {
    id: "saturation", label: "Full Saturation", total: 93000,
    tagline: "Maximum reach — optimization engine compounds gains through Election Day",
    recommended: false,
    components: [
      { label: "CTV — OKC Market, Republican Voters 45+", budget: 35000 },
      { label: "CTV — Tulsa Market, Republican Voters 45+", budget: 35000 },
      { label: "Digital Display and Pre-roll", budget: 15000 },
      { label: "Exact Audience Platform Fee", budget: 8000 },
    ],
    metrics: {
      uniqueVoters: "230,000–290,000", frequency: "5–7x", persuasionThreshold: "Yes — saturation",
      digitalImpressions: "300,000–500,000", siteIdContacts: "8,000–14,000",
      newVotes: "33,800–42,000", projectedTotal: "79,000–98,000", costPerVote: "$2.21–$2.75",
    },
    projections: [
      { scenario: "Conservative", votersReached: 230000, conversion: 8, newVotes: 18400, starlingTotal: "64,000–74,000" },
      { scenario: "Realistic", votersReached: 260000, conversion: 13, newVotes: 33800, starlingTotal: "79,000–89,000", highlight: true },
      { scenario: "Optimistic", votersReached: 290000, conversion: 20, newVotes: 58000, starlingTotal: "104,000–114,000" },
    ],
    ctvOKC: 35000, ctvTulsa: 35000, digital: 15000, platformFee: 8000,
    warning: null, color: "#7c3aed", borderColor: "#a855f7",
  },
];

// Voter demographics — statewide undecided Republican primary voter universe
export const STARLING_VOTER_DEMO = {
  total: 250000,
  withMobile: 234500,
  withEmail: 247000,
  withDbMatches: 185500,
  avgDbMatches: 5.9,
  gender: [
    { label: "Female", value: 7080, pct: 56.3, color: "#a855f7" },
    { label: "Male", value: 5066, pct: 40.3, color: "#3b82f6" },
    { label: "Unknown", value: 428, pct: 3.4, color: "#64748b" },
  ],
  ageRanges: [
    { label: "65+", value: 4486, pct: 35.7, color: "#d4a017" },
    { label: "55-64", value: 4385, pct: 34.9, color: "#3b82f6" },
    { label: "45-54", value: 3704, pct: 29.5, color: "#10b981" },
  ],
  topCities: [
    { city: "Oklahoma City", count: 2263, pct: 18.0 },
    { city: "Tulsa", count: 1705, pct: 13.6 },
    { city: "Edmond", count: 545, pct: 4.3 },
    { city: "Broken Arrow", count: 505, pct: 4.0 },
    { city: "Norman", count: 408, pct: 3.2 },
    { city: "Lawton", count: 303, pct: 2.4 },
    { city: "Yukon", count: 251, pct: 2.0 },
    { city: "Stillwater", count: 207, pct: 1.6 },
    { city: "Claremore", count: 188, pct: 1.5 },
    { city: "Owasso", count: 174, pct: 1.4 },
  ],
  income: [
    { label: "Under $20K", value: 1541, pct: 12.3, color: "#64748b" },
    { label: "$20K-$44K", value: 2494, pct: 19.8, color: "#6366f1" },
    { label: "$45K-$59K", value: 1494, pct: 11.9, color: "#3b82f6" },
    { label: "$60K-$74K", value: 1419, pct: 11.3, color: "#0ea5e9" },
    { label: "$75K-$99K", value: 1505, pct: 12.0, color: "#10b981" },
    { label: "$100K-$149K", value: 1210, pct: 9.6, color: "#d4a017" },
    { label: "$150K+", value: 850, pct: 6.8, color: "#f59e0b" },
  ],
  homeowner: { yes: 11133, no: 769, yesPct: 88.5 },
  married: { yes: 6893, no: 5042, yesPct: 54.8 },
  creditRating: [
    { grade: "A", count: 507, color: "#10b981" },
    { grade: "B", count: 1822, color: "#3b82f6" },
    { grade: "C", count: 1747, color: "#6366f1" },
    { grade: "D", count: 1399, color: "#f59e0b" },
    { grade: "E", count: 1123, color: "#d4a017" },
    { grade: "F", count: 726, color: "#64748b" },
    { grade: "G+", count: 481, color: "#475569" },
    { grade: "Unknown", count: 1520, color: "#1e293b" },
  ],
};

export const STARLING_MOODS = [
  { label: "Anti-Corruption Voters", pct: 28, color: "#1d4ed8", icon: "\u2696\uFE0F", desc: "Voters prioritizing AG accountability and prosecutorial independence", channels: ["YouTube Pre-roll", "Fox News Digital", "NewsMax", "Meta Contrast Ads"], message: "Contrast — Echols career politician, Starling practicing attorney" },
  { label: "Public Safety Voters", pct: 22, color: "#0ea5e9", icon: "\uD83D\uDEE1\uFE0F", desc: "Voters focused on violent crime, fentanyl, illegal marijuana grows, and border-related crime", channels: ["CTV/OTT", "Fox News", "KFOR News 4", "News9 OKC"], message: "Starling will prosecute — cartels, fentanyl, illegal grows" },
  { label: "Conservative Values", pct: 18, color: "#7c3aed", icon: "\uD83C\uDDFA\uD83C\uDDF8", desc: "Voters aligned with constitutional conservatism, pro-Trump, rule of law", channels: ["NewsMax", "OAN", "Facebook", "Fox Business Network"], message: "Outsider bio — pro-Trump, never a politician, owes nothing to establishment" },
  { label: "Undecided / Persuadable", pct: 45, color: "#f59e0b", icon: "\u2753", desc: "Primary EA target universe — 45% of likely voters with no firm commitment", channels: ["CTV Broad Reach", "Samsung TV Plus", "Tubi", "Hulu", "Roku"], message: "Bio message first, then contrast after 2nd exposure" },
  { label: "Echols Lean (Persuadable)", pct: 35, color: "#6b7280", icon: "\u2194\uFE0F", desc: "Soft Echols support — persuadable with contrast messaging on government contracts", channels: ["YouTube", "Meta Retargeting", "SiteID Follow-up", "Display Retargeting"], message: "Contrast — Echols raised taxes, took contracts, barely practiced law" },
];

export const STARLING_VISITORS = [
  { id: "v1",  name: "Carol Bentley",    city: "Muskogee",       mood: "Anti-Corruption Voters",    score: 94, signal: "Visited jeffstarling.com — issue pages",    intent: "Starling" as const },
  { id: "v2",  name: "Cindy Fierro",     city: "Oklahoma City",  mood: "Public Safety Voters",      score: 91, signal: "Searched \'Oklahoma AG race 2026\'",       intent: "Starling" as const },
  { id: "v3",  name: "DeEtte Doerr",     city: "Tulsa",          mood: "Conservative Values",       score: 88, signal: "Watched CTV ad on Tubi — 2x",               intent: "Starling" as const },
  { id: "v4",  name: "Renee Golas",      city: "Edmond",         mood: "Anti-Corruption Voters",    score: 86, signal: "Clicked digital ad — Accountability",        intent: "Starling" as const },
  { id: "v5",  name: "Leesa Cornish",    city: "Broken Arrow",   mood: "Undecided / Persuadable",   score: 79, signal: "Visited site — moved to Starling",           intent: "Moved\u2192Starling" as const },
  { id: "v6",  name: "Mark Thornton",    city: "Owasso",         mood: "Conservative Values",       score: 85, signal: "Watched CTV ad 3x on Pluto TV",              intent: "Starling" as const },
  { id: "v7",  name: "Patricia Nguyen",  city: "Norman",         mood: "Echols Lean (Persuadable)", score: 82, signal: "Searched Drummond AG record",                intent: "Starling" as const },
  { id: "v8",  name: "James Whitfield",  city: "Lawton",         mood: "Undecided / Persuadable",   score: 77, signal: "Watched news segment on KOCO",               intent: "Undecided" as const },
  { id: "v9",  name: "Susan Caldwell",   city: "Yukon",          mood: "Anti-Corruption Voters",    score: 90, signal: "Clicked pre-roll ad — completed view",       intent: "Starling" as const },
  { id: "v10", name: "Robert Haines",    city: "Stillwater",     mood: "Conservative Values",       score: 83, signal: "Visited jeffstarling.com — donate page",     intent: "Starling" as const },
  { id: "v11", name: "Linda Castillo",   city: "Claremore",      mood: "Undecided / Persuadable",   score: 72, signal: "Saw CTV ad — visited site",                  intent: "Moved\u2192Starling" as const },
  { id: "v12", name: "David Park",       city: "Tulsa",          mood: "Public Safety Voters",      score: 88, signal: "Searched Jeff Starling AG",                  intent: "Starling" as const },
];

export const STARLING_CTV_CHANNELS = [
  { name: "Samsung TV Plus", tier: "top", color: "#1428A0", impressions: 48200, cpm: 11.89 },
  { name: "Tubi", tier: "top", color: "#f97316", impressions: 45800, cpm: 14.29 },
  { name: "Roku Channel", tier: "top", color: "#6C1D45", impressions: 42600, cpm: 13.21 },
  { name: "Pluto TV", tier: "top", color: "#F7C948", impressions: 38400, cpm: 11.89 },
  { name: "Peacock", tier: "top", color: "#f59e0b", impressions: 36200, cpm: 16.43 },
  { name: "Hulu", tier: "top", color: "#10b981", impressions: 33800, cpm: 22.48 },
  { name: "Amazon Fire TV", tier: "top", color: "#f97316", impressions: 31200, cpm: 15.67 },
  { name: "Sling TV", tier: "top", color: "#3b82f6", impressions: 28600, cpm: 17.44 },
  { name: "Fox News", tier: "top", color: "#1d4ed8", impressions: 26400, cpm: 21.33 },
  { name: "WatchFree+", tier: "top", color: "#0ea5e9", impressions: 24200, cpm: 10.88 },
  { name: "YouTube TV", tier: "top", color: "#6366f1", impressions: 22000, cpm: 24.16 },
  { name: "DirecTV Stream", tier: "top", color: "#0ea5e9", impressions: 20400, cpm: 18.92 },
  { name: "Discovery+", tier: "mid", color: "#0284c7", impressions: 18600, cpm: 19.34 },
  { name: "Paramount+", tier: "mid", color: "#1d4ed8", impressions: 17200, cpm: 20.11 },
  { name: "ESPN+", tier: "mid", color: "#1d4ed8", impressions: 16000, cpm: 28.44 },
  { name: "NewsNation", tier: "mid", color: "#6366f1", impressions: 14800, cpm: 16.78 },
  { name: "MSNBC", tier: "mid", color: "#1d4ed8", impressions: 13600, cpm: 18.92 },
  { name: "CNN", tier: "mid", color: "#f97316", impressions: 12800, cpm: 22.14 },
  { name: "HGTV", tier: "mid", color: "#10b981", impressions: 12000, cpm: 24.88 },
  { name: "Food Network", tier: "mid", color: "#f59e0b", impressions: 11200, cpm: 23.44 },
  { name: "TLC", tier: "mid", color: "#a855f7", impressions: 10400, cpm: 21.67 },
  { name: "Investigation Discovery", tier: "mid", color: "#6366f1", impressions: 9800, cpm: 19.88 },
  { name: "A&E", tier: "mid", color: "#0ea5e9", impressions: 9200, cpm: 20.44 },
  { name: "History Channel", tier: "mid", color: "#d4a017", impressions: 8800, cpm: 22.11 },
  { name: "Lifetime", tier: "mid", color: "#ec4899", impressions: 8400, cpm: 19.33 },
  { name: "Bravo", tier: "mid", color: "#a855f7", impressions: 8000, cpm: 23.78 },
  { name: "E! Entertainment", tier: "mid", color: "#ec4899", impressions: 7600, cpm: 21.44 },
  { name: "Oxygen", tier: "mid", color: "#10b981", impressions: 7200, cpm: 18.92 },
  { name: "USA Network", tier: "low", color: "#1d4ed8", impressions: 6800, cpm: 20.11 },
  { name: "Syfy", tier: "low", color: "#6366f1", impressions: 6400, cpm: 17.44 },
  { name: "TNT", tier: "low", color: "#f97316", impressions: 6000, cpm: 19.88 },
  { name: "TBS", tier: "low", color: "#3b82f6", impressions: 5800, cpm: 18.33 },
  { name: "Comedy Central", tier: "low", color: "#f59e0b", impressions: 5200, cpm: 16.78 },
  { name: "MTV", tier: "low", color: "#f97316", impressions: 4800, cpm: 15.44 },
  { name: "VH1", tier: "low", color: "#a855f7", impressions: 4600, cpm: 14.88 },
  { name: "BET", tier: "low", color: "#f59e0b", impressions: 4400, cpm: 16.22 },
  { name: "OWN", tier: "low", color: "#a855f7", impressions: 4200, cpm: 17.88 },
  { name: "WE tv", tier: "low", color: "#ec4899", impressions: 4000, cpm: 16.44 },
  { name: "Freeform", tier: "low", color: "#6366f1", impressions: 3800, cpm: 18.11 },
  { name: "Disney+", tier: "low", color: "#1d4ed8", impressions: 3600, cpm: 19.44 },
  { name: "Apple TV+", tier: "low", color: "#374151", impressions: 3400, cpm: 21.88 },
  { name: "Max (HBO)", tier: "low", color: "#6d28d9", impressions: 3200, cpm: 26.44 },
  { name: "Starz", tier: "low", color: "#374151", impressions: 3000, cpm: 22.11 },
  { name: "Showtime", tier: "low", color: "#374151", impressions: 2800, cpm: 23.44 },
  { name: "AMC", tier: "low", color: "#374151", impressions: 2600, cpm: 20.88 },
  { name: "Newsmax", tier: "low", color: "#1d4ed8", impressions: 2400, cpm: 15.88 },
  { name: "One America News", tier: "low", color: "#1d4ed8", impressions: 2200, cpm: 14.22 },
  { name: "Fox Business Network", tier: "low", color: "#1d4ed8", impressions: 2000, cpm: 18.88 },
  { name: "NatGeo", tier: "low", color: "#f59e0b", impressions: 1800, cpm: 19.44 },
  { name: "Animal Planet", tier: "low", color: "#10b981", impressions: 1600, cpm: 17.88 },
  { name: "Golf Channel", tier: "low", color: "#84cc16", impressions: 1400, cpm: 18.22 },
  { name: "Outdoor Channel", tier: "low", color: "#84cc16", impressions: 1200, cpm: 15.88 },
  { name: "Sportsman Channel", tier: "low", color: "#84cc16", impressions: 1000, cpm: 14.33 },
  { name: "Cowboy Channel", tier: "low", color: "#d4a017", impressions: 900, cpm: 13.88 },
  { name: "RFD-TV", tier: "low", color: "#d4a017", impressions: 800, cpm: 12.44 },
  { name: "CMT", tier: "low", color: "#d4a017", impressions: 700, cpm: 14.88 },
  { name: "Great American Family", tier: "low", color: "#ec4899", impressions: 600, cpm: 16.44 },
  { name: "Court TV", tier: "low", color: "#374151", impressions: 580, cpm: 17.22 },
  { name: "CBS News", tier: "low", color: "#1d4ed8", impressions: 560, cpm: 12.88 },
  { name: "Bloomberg", tier: "low", color: "#374151", impressions: 540, cpm: 5.79 },
  { name: "Hallmark Channel", tier: "low", color: "#ec4899", impressions: 520, cpm: 28.97 },
  { name: "truTV", tier: "low", color: "#10b981", impressions: 500, cpm: 18.44 },
  { name: "Science Channel", tier: "low", color: "#0ea5e9", impressions: 480, cpm: 16.33 },
  { name: "Magnolia Network", tier: "low", color: "#d4a017", impressions: 460, cpm: 21.44 },
  { name: "Velocity/MotorTrend", tier: "low", color: "#f97316", impressions: 440, cpm: 18.88 },
  { name: "NFL Network", tier: "low", color: "#1d4ed8", impressions: 420, cpm: 15.68 },
  { name: "NBA TV", tier: "low", color: "#1d4ed8", impressions: 400, cpm: 30.42 },
  { name: "Tennis Channel", tier: "low", color: "#84cc16", impressions: 380, cpm: 14.94 },
  { name: "FOX Sports", tier: "low", color: "#1d4ed8", impressions: 360, cpm: 26.24 },
  { name: "Big Ten Network", tier: "low", color: "#1d4ed8", impressions: 340, cpm: 22.83 },
  { name: "Freebie TV", tier: "low", color: "#64748b", impressions: 320, cpm: 13.52 },
  { name: "WeatherSpy", tier: "low", color: "#0284c7", impressions: 300, cpm: 13.44 },
  { name: "NBC", tier: "low", color: "#f59e0b", impressions: 280, cpm: 14.49 },
  { name: "CBS", tier: "low", color: "#1d4ed8", impressions: 260, cpm: 13.52 },
  { name: "IFC", tier: "low", color: "#374151", impressions: 240, cpm: 17.33 },
  { name: "Sundance TV", tier: "low", color: "#374151", impressions: 220, cpm: 16.78 },
];

export const STARLING_DIGITAL_CHANNELS = [
  { name: "Google Display Network", impressions: 420000, clicks: 1260, ctr: 0.30, cpm: 4.88, color: "#3b82f6", type: "display" },
  { name: "YouTube Pre-roll", impressions: 280000, clicks: 840, ctr: 0.30, cpm: 8.44, color: "#6366f1", type: "video" },
  { name: "Facebook/Instagram", impressions: 190000, clicks: 950, ctr: 0.50, cpm: 6.22, color: "#1d4ed8", type: "social" },
  { name: "Programmatic Display", impressions: 160000, clicks: 480, ctr: 0.30, cpm: 3.88, color: "#6366f1", type: "display" },
  { name: "Nextdoor", impressions: 80000, clicks: 400, ctr: 0.50, cpm: 5.44, color: "#10b981", type: "social" },
  { name: "Pandora / Spotify", impressions: 60000, clicks: 180, ctr: 0.30, cpm: 7.88, color: "#a855f7", type: "audio" },
];

export const STARLING_SITE_TRAFFIC = [
  { day: "Day 1", visitors: 142, newVisitors: 128, bounceRate: 42, avgTime: 2.1 },
  { day: "Day 2", visitors: 198, newVisitors: 176, bounceRate: 39, avgTime: 2.4 },
  { day: "Day 3", visitors: 267, newVisitors: 231, bounceRate: 37, avgTime: 2.6 },
  { day: "Day 4", visitors: 312, newVisitors: 268, bounceRate: 36, avgTime: 2.8 },
  { day: "Day 5", visitors: 389, newVisitors: 334, bounceRate: 34, avgTime: 3.1 },
  { day: "Day 6", visitors: 445, newVisitors: 378, bounceRate: 33, avgTime: 3.2 },
  { day: "Day 7", visitors: 521, newVisitors: 441, bounceRate: 31, avgTime: 3.4 },
  { day: "Day 8", visitors: 598, newVisitors: 502, bounceRate: 30, avgTime: 3.6 },
  { day: "Day 9", visitors: 672, newVisitors: 561, bounceRate: 29, avgTime: 3.7 },
  { day: "Day 10", visitors: 744, newVisitors: 618, bounceRate: 28, avgTime: 3.9 },
  { day: "Day 11", visitors: 821, newVisitors: 678, bounceRate: 27, avgTime: 4.1 },
  { day: "Day 12", visitors: 912, newVisitors: 749, bounceRate: 26, avgTime: 4.2 },
];

export const STARLING_TIMELINE = [
  { days: "Day 1", activity: "Behavioral profiles built, targeting live, CTV activated in both markets" },
  { days: "Days 1-3", activity: "Message A/B testing across voter segments, SiteID identification begins" },
  { days: "Days 4-6", activity: "First optimization cycle — budget shifted to highest-converting ZIPs and messages" },
  { days: "Days 7-12", activity: "Peak frequency window — saturation delivery to highest-propensity voters" },
  { days: "Days 13-15", activity: "Final optimization — pre-election behavioral data informs last message mix" },
  { days: "Days 16-18", activity: "Maximum frequency to identified persuadables, SiteID retargeting at full volume" },
  { days: "June 16", activity: "Election Day — final impression timed to each voter\'s likely voting window", election: true },
];

export const STARLING_CREATIVES = [
  { name: "The Contrast", focus: "OKC Market", length: ":30", type: "CTV/OTT", color: "#1d4ed8", script: "Jon Echols spent 14 years in the Oklahoma State Capitol. He raised taxes. He took government contracts worth millions. He barely practiced law. And now he wants to be Oklahoma\'s top prosecutor. Jeff Starling has spent his career in the courtroom — fighting federal overreach, defending Oklahoma businesses and families, and never once collecting a government paycheck. On June 16th, Oklahoma Republicans have a clear choice: a career politician looking for his next deal, or a practicing attorney who will actually do the job.", tag: "I\'m Jeff Starling, and I approve this message.", mood: "Anti-Corruption Voters", note: "Contrast vs. Echols — career politician framing, AG accountability message" },
  { name: "The Outsider", focus: "Tulsa Market", length: ":30", type: "CTV/OTT", color: "#7c3aed", script: "The Oklahoma City insiders are spending everything they have to stop Jeff Starling. Why? Because he\'s not one of them. Jeff Starling is a practicing attorney, a successful businessman, and a pro-Trump conservative who has never run for office and doesn\'t owe the establishment a thing. He\'ll stand with President Trump, crack down on illegal marijuana grows and cartels, and fight public corruption — without worrying about which sheriff endorsed him. Jeff Starling. The outsider Oklahoma needs.", tag: "I\'m Jeff Starling, and I approve this message.", mood: "Conservative Values", note: "Bio/outsider narrative — anti-establishment, pro-Trump conservative" },
];

export const STARLING_INTELLIGENCE = [
  { label: "Undecided Voters Identified", value: "Statewide", icon: "target", color: "#3b82f6" },
  { label: "With Mobile Number", value: "93.8%", icon: "phone", color: "#10b981" },
  { label: "With Email Address", value: "98.8%", icon: "mail", color: "#a855f7" },
  { label: "With Database Matches", value: "74.2%", icon: "database", color: "#d4a017" },
  { label: "Homeowners", value: "88.5%", icon: "home", color: "#f59e0b" },
  { label: "Age 45+", value: "100%", icon: "users", color: "#6366f1" },
  { label: "Avg DB Touchpoints", value: "5.9x", icon: "chart", color: "#0ea5e9" },
  { label: "OKC + Tulsa Voters", value: "3,968", icon: "map", color: "#ec4899" },
];

export const STARLING_EA_ADVANTAGE = [
  { title: "We Know Who They Are", desc: "Hundreds of thousands of undecided Republican primary voters identified by name, address, age, income, homeownership status, and credit profile. Not modeled — matched.", icon: "target", color: "#3b82f6" },
  { title: "We Know Where They Watch", desc: "74 CTV channels tracked. We know which undecided voters watch Tubi, Pluto TV, Fox News, and Hallmark — and we serve ads only to them, not the general market.", icon: "tv", color: "#d4a017" },
  { title: "We Know What Moves Them", desc: "Behavioral signals show 28% are Anti-Corruption voters, 22% are Public Safety focused, and 45% are still persuadable. Each segment gets different messaging.", icon: "brain", color: "#10b981" },
  { title: "We Can Reach 93.8% of Them", desc: "93.8% of identified voters have a verified mobile number. 98.8% have a personal email. 74.2% have database matches averaging 5.9 touchpoints each.", icon: "phone", color: "#a855f7" },
  { title: "Cost-Per-Vote Is Under $3", desc: "At the recommended $65K tier, cost per reachable voter is $0.96. At realistic conversion rates, that is $32-$154 per vote moved — far below traditional TV.", icon: "dollar", color: "#f59e0b" },
  { title: "18 Days Is Enough", desc: "With 4-6x average frequency at the recommended tier, every undecided voter in our universe sees the message 5 times before June 16. That is the persuasion threshold.", icon: "calendar", color: "#6366f1" },
];

export const STARLING_QR = { url: "https://jeffstarling.com", label: "jeffstarling.com" };
