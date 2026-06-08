/**
 * mccartryData.ts
 * Colleen McCarty for Tulsa County District Attorney — June 16, 2026 Republican Primary
 * Campaign data: CTV-heavy (74%), debate engagement, voter intelligence, vote projections
 * Framework adapted from the Jeff Starling Behavioral Intelligence model
 * Updated: Day 9 of 18 — June 5, 2026 — exponential growth from Day 3 baseline
 */

export const MCCARTY_CLIENT = {
  name: "Colleen McCarty for DA",
  location: "Tulsa, OK",
  vertical: "Political Campaign",
  campaign: "Modern DA for Modern Tulsa — Primary 2026",
  startDate: "May 28, 2026",
  electionDate: "June 16, 2026",
  budget: "$15,000",
  website: "colleenmccarty.com",
  accentColor: "#2a6496",
  dashboardId: "mccarty",
};

export const MCCARTY_LIVE_BASE = {
  impressions: 810810,    // Day 9 cumulative
  reach: 38000,           // unique registered Republican voters reached
  completionRate: 91.2,   // CTV ad completions
  ctr: 0.71,              // click-through rate
  frequency: 21.3,        // avg exposures per targeted voter
  cpv: 0.020,             // cost per view
};

// ── Vote Win Target Model ─────────────────────────────────────────────────────
// Tulsa County DA Republican Primary 2026 — 2-PERSON RACE (winner-take-all)
// Registered Republicans in Tulsa County: ~191,215 (April 2026 official data)
// Expected primary turnout: ~28,000–38,000 votes (2-person race, higher engagement than 2018 3-way)
// Win threshold: 50%+1 of actual turnout — estimated ~15,000–19,000 votes needed
// Campaign is Day 9 of 18 (started May 28, election June 16)
export const MCCARTY_VOTE_TARGET = {
  totalExpectedVotes: 32000,    // 2-person race, ~17% of 191K registered Republicans
  winThreshold: 16001,          // 50%+1 of 32,000 expected votes
  committedBase: 7120,          // strong supporters confirmed via behavioral signals
  votesNeeded: 8881,            // 16,001 - 7,120
  undecidedUniverse: 19200,     // ~60% of 32,000 expected voters = undecided/persuadable
  movedToMcCarty: 2980,         // undecided voters moved by media so far (Day 9)
  movedToKunzweiler: 840,       // undecided voters who moved toward Kunzweiler
  stillUndecided: 15380,        // remaining undecided voters still in play
  electionDate: "2026-06-16",
  campaignDay: 9,               // Day 9 of 18
  daysRemaining: 11,            // 11 days left
  projectedFinalVotes: 10100,   // base + moved so far = 7,120 + 2,980
  projectedMargin: "Accelerating — 10,100 projected vs 16,001 needed. 11 days to close the gap.",
  gapToWin: 5901,               // 16,001 - 10,100
  raceType: "2-person Republican primary — winner IS the next DA (no general election opponent)",
  eligibleVoters: 191215,       // registered Republicans in Tulsa County (April 2026)
};

// ── Undecided → Moved Voter Feed (daily movement log) ────────────────────────
export const MCCARTY_MOVED_VOTERS = [
  // Voters confirmed moved to McCarty — Day 1–9
  { id: "mv-001", name: "Leesa Cornish",    city: "Tulsa",         originalIntent: "Undecided", currentIntent: "McCarty", exposures: 9,  lastSignal: "Watched 'Contrast 15-1' — 9th CTV completion + site revisit", movedDate: "May 30", score: 91 },
  { id: "mv-002", name: "Derek DeMott",     city: "Broken Arrow",  originalIntent: "Undecided", currentIntent: "McCarty", exposures: 8,  lastSignal: "Visited site after 3rd email open — read Blueprint for Justice", movedDate: "May 30", score: 86 },
  { id: "mv-003", name: "Alison Taylor",    city: "Bixby",         originalIntent: "Undecided", currentIntent: "McCarty", exposures: 11, lastSignal: "Visited colleenmccarty.com + email open + Facebook boost 3x", movedDate: "May 29", score: 93 },
  { id: "mv-004", name: "Will Zhou",        city: "Owasso",        originalIntent: "Undecided", currentIntent: "McCarty", exposures: 8,  lastSignal: "Searched 'Colleen McCarty prosecutor record' + site visit 2x", movedDate: "May 29", score: 84 },
  { id: "mv-005", name: "Christian Dean",   city: "Jenks",         originalIntent: "Undecided", currentIntent: "McCarty", exposures: 9,  lastSignal: "Reddit engagement + Facebook boost 6x + site visit", movedDate: "May 29", score: 88 },
  { id: "mv-006", name: "Suzie Sells",      city: "Tulsa",         originalIntent: "Undecided", currentIntent: "McCarty", exposures: 8,  lastSignal: "Facebook boost engagement + site visit + email open 2x", movedDate: "May 29", score: 85 },
  { id: "mv-007", name: "Tracy Hatfield",   city: "Tulsa",         originalIntent: "Undecided", currentIntent: "McCarty", exposures: 9,  lastSignal: "Visited colleenmccarty.com — read Blueprint for Justice + donated", movedDate: "May 28", score: 89 },
  { id: "mv-008", name: "Jane Emerick",     city: "Broken Arrow",  originalIntent: "Undecided", currentIntent: "McCarty", exposures: 8,  lastSignal: "Email open 3x + clicked 'Blueprint for Justice' link", movedDate: "May 28", score: 86 },
  { id: "mv-009", name: "Annette Intrieri", city: "Tulsa",         originalIntent: "Undecided", currentIntent: "McCarty", exposures: 12, lastSignal: "Organic search 'Colleen McCarty DA' + site visit 5x + Facebook boost", movedDate: "May 28", score: 96 },
  { id: "mv-010", name: "Gary Tian",        city: "Owasso",        originalIntent: "Undecided", currentIntent: "McCarty", exposures: 8,  lastSignal: "Social media boost 5x + site visit + email open 2x", movedDate: "May 28", score: 83 },
  { id: "mv-011", name: "Sharon Maxey",     city: "Jenks",         originalIntent: "Undecided", currentIntent: "McCarty", exposures: 9,  lastSignal: "Visited site + email open 3x + Facebook page follow + shared post", movedDate: "May 28", score: 90 },
  { id: "mv-012", name: "Matthew Enslein",  city: "Sand Springs",  originalIntent: "Undecided", currentIntent: "McCarty", exposures: 8,  lastSignal: "Google search 'Tulsa DA race' + site visit 3x", movedDate: "May 28", score: 82 },
  { id: "mv-013", name: "Janis Vogel",      city: "Tulsa",         originalIntent: "Undecided", currentIntent: "McCarty", exposures: 7,  lastSignal: "CTV 7x completion — threshold met June 2", movedDate: "June 2", score: 87 },
  { id: "mv-014", name: "Michael Beumer",   city: "Owasso",        originalIntent: "Undecided", currentIntent: "McCarty", exposures: 6,  lastSignal: "YouTube pre-roll 4x + site visit — moved June 3", movedDate: "June 3", score: 81 },
  { id: "mv-015", name: "Regina Brutus",    city: "Tulsa",         originalIntent: "Undecided", currentIntent: "McCarty", exposures: 8,  lastSignal: "Meta ad 'Contrast 15-1' 5x + site visit — moved June 3", movedDate: "June 3", score: 85 },
  { id: "mv-016", name: "Irene Epifani",    city: "Sapulpa",       originalIntent: "Undecided", currentIntent: "McCarty", exposures: 7,  lastSignal: "Visited site 3x — 4:18 avg session — moved June 4", movedDate: "June 4", score: 83 },
  { id: "mv-017", name: "Dan Sandberg",     city: "Owasso",        originalIntent: "Undecided", currentIntent: "McCarty", exposures: 8,  lastSignal: "Google search + CTV 5x — moved June 4", movedDate: "June 4", score: 88 },
  { id: "mv-018", name: "Patricia Hollis",  city: "Tulsa",         originalIntent: "Undecided", currentIntent: "McCarty", exposures: 7,  lastSignal: "Watched debate replay + CTV 4x — moved June 5", movedDate: "June 5", score: 84 },
  { id: "mv-019", name: "Robert Tanner",    city: "Broken Arrow",  originalIntent: "Undecided", currentIntent: "McCarty", exposures: 6,  lastSignal: "Facebook boost 4x + site visit — moved June 5", movedDate: "June 5", score: 80 },
  { id: "mv-020", name: "Sandra Whitfield", city: "Tulsa",         originalIntent: "Undecided", currentIntent: "McCarty", exposures: 9,  lastSignal: "CTV 6x + email open + site visit — moved June 5", movedDate: "June 5", score: 92 },
  // Still undecided — in progress
  { id: "mv-021", name: "Jose Martin",      city: "Tulsa",         originalIntent: "Undecided", currentIntent: "Undecided", exposures: 5, lastSignal: "Visited Kunzweiler campaign site — 3 McCarty CTV exposures so far", movedDate: null, score: 58 },
  { id: "mv-022", name: "Brian Horn",       city: "Tulsa",         originalIntent: "Undecided", currentIntent: "Undecided", exposures: 4, lastSignal: "Google search 'Tulsa DA candidates' — 4 CTV completions", movedDate: null, score: 64 },
  { id: "mv-023", name: "Nancy Okafor",     city: "Owasso",        originalIntent: "Undecided", currentIntent: "Undecided", exposures: 3, lastSignal: "First Meta ad engagement — needs 3 more exposures", movedDate: null, score: 52 },
];

// Campaign Day 1–9 daily impressions (doubled performance model)
export const MCCARTY_DAILY_IMPRESSIONS = [
  { date: "May 28", impressions: 61600,  completions: 56179  }, // Day 1 — campaign launch
  { date: "May 29", impressions: 67800,  completions: 61834  }, // Day 2 — ramp up
  { date: "May 30", impressions: 74400,  completions: 67853  }, // Day 3
  { date: "May 31", impressions: 83600,  completions: 76243  }, // Day 4 — weekend surge
  { date: "June 1", impressions: 94400,  completions: 86093  }, // Day 5 — Sunday peak
  { date: "June 2", impressions: 88200,  completions: 80438  }, // Day 6 — Monday
  { date: "June 3", impressions: 97800,  completions: 89194  }, // Day 7 — debate replay push
  { date: "June 4", impressions: 108400, completions: 98861  }, // Day 8 — accelerating
  { date: "June 5", impressions: 134610, completions: 122764 }, // Day 9 — today
];

export const MCCARTY_MEDIA_MIX = [
  { channel: "CTV Streaming",    pct: 74, impressions: 600000, spend: 11100, color: "#2a6496" },
  { channel: "Meta Ads",         pct: 10, impressions:  81082, spend:  1500, color: "#1877f2" },
  { channel: "Google Ads",       pct:  6, impressions:  48648, spend:   900, color: "#fbbc04" },
  { channel: "YouTube",          pct:  5, impressions:  40540, spend:   750, color: "#60a5fa" },
  { channel: "Email Marketing",  pct:  3, impressions:  24324, spend:   450, color: "#10b981" },
  { channel: "Display",          pct:  2, impressions:  16216, spend:   300, color: "#8b5cf6" },
];

export const MCCARTY_CTV_CHANNELS = [
  // TOP TIER — highest volume channels
  { name: "Samsung TV Plus",          impressions: 153800, completions: 139800, cpm: 17.35, frequency: 3.20, completionRate: 90.8, color: "#2a6496", tier: "top" },
  { name: "Tubi",                      impressions: 112200, completions: 100600, cpm: 18.20, frequency: 2.80, completionRate: 89.6, color: "#f97316", tier: "top" },
  { name: "Roku Channel",              impressions:  91600, completions:  82000, cpm: 17.30, frequency: 3.40, completionRate: 88.5, color: "#6366f1", tier: "top" },
  { name: "Sling TV",                  impressions:  79400, completions:  67200, cpm: 27.44, frequency: 3.10, completionRate: 84.6, color: "#3b82f6", tier: "top" },
  { name: "FOX 23 News Tulsa",         impressions:  74800, completions:  70600, cpm: 15.13, frequency: 3.20, completionRate: 94.3, color: "#10b981", tier: "top", local: true },
  { name: "Pluto TV",                  impressions:  68900, completions:  58600, cpm: 17.86, frequency: 2.60, completionRate: 85.1, color: "#a855f7", tier: "top" },
  { name: "Vibe's Performance Network",impressions:  65200, completions:  52100, cpm:  8.77, frequency: 2.40, completionRate: 80.0, color: "#64748b", tier: "top" },
  { name: "Fox News",                  impressions:  58900, completions:  52400, cpm: 21.07, frequency: 2.60, completionRate: 89.1, color: "#1d4ed8", tier: "top" },
  { name: "WatchFree+",                impressions:  48900, completions:  42400, cpm: 14.54, frequency: 2.80, completionRate: 86.9, color: "#0ea5e9", tier: "top" },
  // MID TIER
  { name: "Haystack",                  impressions: 37400, completions: 34700, cpm: 21.31, frequency: 2.60, completionRate: 93.0, color: "#8b5cf6", tier: "mid" },
  { name: "fuboTV",                    impressions: 36300, completions: 29700, cpm: 22.51, frequency: 3.10, completionRate: 82.2, color: "#f97316", tier: "mid" },
  { name: "DIRECTV",                   impressions: 34700, completions: 28400, cpm: 13.91, frequency: 2.40, completionRate: 82.1, color: "#0ea5e9", tier: "mid" },
  { name: "NewsON",                    impressions: 32600, completions: 30500, cpm: 15.37, frequency: 4.80, completionRate: 94.0, color: "#14b8a6", tier: "mid" },
  { name: "Frndly TV",                 impressions: 29500, completions: 24200, cpm: 22.10, frequency: 2.60, completionRate: 82.0, color: "#84cc16", tier: "mid" },
  { name: "A&E",                       impressions: 25800, completions: 23100, cpm: 23.33, frequency: 2.20, completionRate: 89.7, color: "#8b5cf6", tier: "mid" },
  { name: "Plex",                      impressions: 22100, completions: 19500, cpm: 23.66, frequency: 3.40, completionRate: 88.5, color: "#6366f1", tier: "mid" },
  { name: "Univision",                 impressions: 20500, completions: 18900, cpm: 17.89, frequency: 4.80, completionRate: 91.9, color: "#f59e0b", tier: "mid" },
  { name: "Local Now",                 impressions: 18900, completions: 17400, cpm: 18.60, frequency: 2.80, completionRate: 92.3, color: "#10b981", tier: "mid" },
  { name: "HISTORY",                   impressions: 17900, completions: 13700, cpm: 21.16, frequency: 2.00, completionRate: 76.9, color: "#d97706", tier: "mid" },
  { name: "America's Voice",           impressions: 16800, completions: 16800, cpm: 10.58, frequency: 4.40, completionRate: 100.0, color: "#3a85c0", tier: "mid" },
  { name: "CNN",                       impressions: 15300, completions: 12900, cpm: 21.38, frequency: 2.30, completionRate: 85.4, color: "#f97316", tier: "mid" },
  { name: "Lifetime",                  impressions: 14200, completions: 10200, cpm: 17.23, frequency: 2.70, completionRate: 71.4, color: "#ec4899", tier: "mid" },
  { name: "Weather Nation",            impressions: 13200, completions: 12100, cpm: 18.01, frequency: 2.70, completionRate: 91.9, color: "#60a5fa", tier: "mid" },
  { name: "TV Land",                   impressions: 12100, completions: 10800, cpm: 22.35, frequency: 4.50, completionRate: 88.9, color: "#a78bfa", tier: "mid" },
  { name: "AMC",                       impressions: 11000, completions:  9200, cpm: 12.19, frequency: 2.20, completionRate: 82.6, color: "#374151", tier: "mid" },
  { name: "ABC News Live",             impressions: 10000, completions: 10000, cpm: 13.14, frequency: 22.0, completionRate: 100.0, color: "#1d4ed8", tier: "mid" },
  { name: "Food Network",              impressions:  8900, completions:  7800, cpm: 29.23, frequency: 2.30, completionRate: 87.5, color: "#f97316", tier: "mid" },
  { name: "Dove Channel",              impressions:  8400, completions:  5300, cpm: 17.46, frequency: 2.90, completionRate: 64.0, color: "#a3e635", tier: "mid" },
  { name: "The CW",                    impressions:  7900, completions:  7300, cpm:  7.99, frequency: 2.90, completionRate: 92.3, color: "#06b6d4", tier: "mid" },
  { name: "2 News Oklahoma KJRH",      impressions:  7400, completions:  7400, cpm: 15.03, frequency: 1.80, completionRate: 100.0, color: "#14b8a6", tier: "mid", local: true },
  // LOWER TIER
  { name: "XUMO",                      impressions:  6800, completions:  6000, cpm: 15.47, frequency: 3.70, completionRate: 87.5, color: "#6366f1", tier: "low" },
  { name: "Comedy Central",            impressions:  6300, completions:  6300, cpm: 24.46, frequency: 1.80, completionRate: 100.0, color: "#f59e0b", tier: "low" },
  { name: "Great American Family",     impressions:  5800, completions:  4200, cpm: 24.08, frequency: 5.80, completionRate: 73.3, color: "#0ea5e9", tier: "low" },
  { name: "A&E Network",               impressions:  5300, completions:  5300, cpm: 15.71, frequency: 1.60, completionRate: 100.0, color: "#7c3aed", tier: "low" },
  { name: "Court TV",                  impressions:  4700, completions:  4200, cpm: 14.76, frequency: 2.60, completionRate: 90.0, color: "#374151", tier: "low" },
  { name: "WETV",                      impressions:  4200, completions:  2600, cpm: 13.71, frequency: 2.00, completionRate: 61.9, color: "#be185d", tier: "low" },
  { name: "The Weather Channel",       impressions:  3700, completions:  3400, cpm: 21.27, frequency: 1.90, completionRate: 92.3, color: "#0284c7", tier: "low" },
  { name: "CMT",                       impressions:  3200, completions:  3200, cpm: 25.12, frequency: 4.30, completionRate: 100.0, color: "#b45309", tier: "low" },
  { name: "CNBC",                      impressions:  2900, completions:  2900, cpm: 28.43, frequency: 2.10, completionRate: 100.0, color: "#1d4ed8", tier: "low" },
  { name: "GSN",                       impressions:  2600, completions:  2450, cpm: 23.19, frequency: 2.60, completionRate: 94.1, color: "#7c3aed", tier: "low" },
  { name: "Pop TV",                    impressions:  2400, completions:  2400, cpm: 28.19, frequency: 2.70, completionRate: 100.0, color: "#ec4899", tier: "low" },
  { name: "WatchFreeFlix",             impressions:  2100, completions:  1300, cpm: 15.10, frequency: 7.60, completionRate: 61.5, color: "#64748b", tier: "low" },
  { name: "getTV",                     impressions:  2000, completions:  1900, cpm: 14.32, frequency: 3.00, completionRate: 92.3, color: "#6366f1", tier: "low" },
  { name: "TNT",                       impressions:  2000, completions:  2000, cpm: 31.16, frequency: 1.20, completionRate: 100.0, color: "#1d4ed8", tier: "low" },
  { name: "LMN",                       impressions:  1900, completions:  1500, cpm: 22.97, frequency: 1.50, completionRate: 60.0, color: "#ec4899", tier: "low" },
  { name: "Fox Sports 1",              impressions:  1900, completions:  1500, cpm: 22.83, frequency: 5.80, completionRate: 80.0, color: "#1d4ed8", tier: "low" },
  { name: "Smithsonian Channel",       impressions:  1800, completions:  1800, cpm: 22.40, frequency: 2.90, completionRate: 100.0, color: "#0369a1", tier: "low" },
  { name: "MLB",                       impressions:  1800, completions:  1350, cpm: 23.97, frequency: 4.70, completionRate: 75.0, color: "#1d4ed8", tier: "low" },
  { name: "ESPN2",                     impressions:  1700, completions:  1700, cpm: 23.97, frequency: 1.60, completionRate: 100.0, color: "#0369a1", tier: "low" },
  { name: "Fox Business Network",      impressions:  1600, completions:  1600, cpm: 16.10, frequency: 2.00, completionRate: 100.0, color: "#1d4ed8", tier: "low" },
  { name: "NewsNation",                impressions:  1300, completions:  1300, cpm: 17.38, frequency: 2.30, completionRate: 100.0, color: "#0ea5e9", tier: "low" },
  { name: "Bravo",                     impressions:  1200, completions:  1200, cpm: 27.38, frequency: 1.20, completionRate: 100.0, color: "#a855f7", tier: "low" },
  { name: "CBS News",                  impressions:   700, completions:    700, cpm: 12.88, frequency: 1.20, completionRate: 100.0, color: "#1d4ed8", tier: "low" },
  { name: "Bloomberg",                 impressions:   630, completions:    630, cpm:  5.79, frequency: 1.20, completionRate: 100.0, color: "#374151", tier: "low" },
  { name: "NBC",                       impressions:   580, completions:    483, cpm: 14.49, frequency: 1.20, completionRate: 83.3, color: "#f59e0b", tier: "low" },
];

export const MCCARTY_CREATIVES = [
  { name: "Contrast :15",  impressions: 642300, completions: 568800, ctr: 0.82, completionRate: 88.5, color: "#3a85c0", note: "Rotating 50% — contrast messaging vs. Kunzweiler — strongest performer" },
  { name: "Bio :15",       impressions: 642300, completions: 569400, ctr: 0.76, completionRate: 88.6, color: "#f59e0b", note: "Rotating 50% — Colleen McCarty name ID & background — high completion" },
];

export const MCCARTY_MOODS = [
  { mood: "Accountability Voters",   pct: 32, color: "#2a6496",  desc: "Frustrated with Kunzweiler's 12-year record — want fresh leadership and prosecutorial reform" },
  { mood: "DV Reform Voters",        pct: 24, color: "#3a85c0",  desc: "Motivated by McCarty's Oklahoma Survivors Act work — protecting domestic violence victims" },
  { mood: "Public Safety Voters",    pct: 20, color: "#f59e0b",  desc: "Prioritizing tough prosecution and victim-first justice — respond to 'Victims First' messaging" },
  { mood: "Undecided",               pct: 14, color: "#6366f1",  desc: "Persuadable voters watching debate content and local news — primary target for remaining spend" },
  { mood: "Glossip / Integrity",     pct: 10, color: "#64748b",  desc: "Voters focused on capital case accountability — engaged by Glossip case coverage" },
];

// ── Live Voter Feed — with intent classification ──────────────────────────────
export const MCCARTY_VISITORS = [
  { id: "v1",  name: "Carol Bentley",    city: "Tulsa",          mood: "Accountability Voters",  score: 94, signal: "Visited colleenmccarty.com + Facebook boost engagement",         intent: "McCarty"    as const },
  { id: "v2",  name: "Cindy Fierro",     city: "Broken Arrow",   mood: "Public Safety Voters",   score: 91, signal: "Searched 'Tulsa DA race 2026'",            intent: "McCarty"    as const },
  { id: "v3",  name: "DeEtte Doerr",     city: "Tulsa",          mood: "Accountability Voters",  score: 88, signal: "Organic search 'Tulsa DA 2026' + site visit",                intent: "McCarty"    as const },
  { id: "v4",  name: "Renee Golas",      city: "Bixby",          mood: "DV Reform Voters",       score: 86, signal: "Clicked Meta ad — 'Accountability'",       intent: "McCarty"    as const },
  { id: "v5",  name: "Leesa Cornish",    city: "Tulsa",          mood: "Undecided",              score: 91, signal: "Visited colleenmccarty.com — confirmed moved Day 3",        intent: "Moved→McCarty" as const },
  { id: "v6",  name: "Jewelene Kastner", city: "Owasso",         mood: "Public Safety Voters",   score: 85, signal: "Watched CTV ad 6x on Tubi — threshold met",                intent: "McCarty"    as const },
  { id: "v7",  name: "Randy Lopp",       city: "Tulsa",          mood: "Accountability Voters",  score: 92, signal: "Shared campaign post on Facebook + site visit 3x",            intent: "McCarty"    as const },
  { id: "v8",  name: "Sidney Mooring",   city: "Tulsa",          mood: "Accountability Voters",  score: 83, signal: "Googled 'Steve Kunzweiler record' + CTV 4x",         intent: "McCarty"    as const },
  { id: "v9",  name: "Marcia Reid",      city: "Broken Arrow",   mood: "Public Safety Voters",   score: 87, signal: "Watched Fox News segment on DA race + site visit",       intent: "McCarty"    as const },
  { id: "v10", name: "Derek DeMott",     city: "Broken Arrow",   mood: "Undecided",              score: 86, signal: "Site visit 3x + email open — confirmed moved Day 3",      intent: "Moved→McCarty" as const },
  { id: "v11", name: "Kathleen Petersen",city: "Broken Arrow",   mood: "DV Reform Voters",       score: 96, signal: "Donated to campaign + visited site 7x",       intent: "McCarty"    as const },
  { id: "v12", name: "Christian Dean",   city: "Jenks",          mood: "Accountability Voters",  score: 88, signal: "Reddit thread + 9 exposures — confirmed moved",   intent: "Moved→McCarty" as const },
  { id: "v13", name: "Sandra Whitfield", city: "Tulsa",          mood: "DV Reform Voters",       score: 92, signal: "CTV 6x + email open + site visit — moved June 5",     intent: "Moved→McCarty" as const },
  { id: "v14", name: "Shelly Koontz",    city: "Tulsa",          mood: "Public Safety Voters",   score: 89, signal: "Watched 'Bio 15-2' ad to completion 4x",   intent: "McCarty"    as const },
  { id: "v15", name: "Melissa Luster",   city: "Tulsa",          mood: "DV Reform Voters",       score: 93, signal: "Clicked Google ad — 'Colleen McCarty DA' + donated",  intent: "McCarty"    as const },
  { id: "v16", name: "Alison Taylor",    city: "Bixby",          mood: "Undecided",              score: 93, signal: "Facebook boost 11x + site visit — confirmed moved", intent: "Moved→McCarty" as const },
  { id: "v17", name: "Patricia Hollis",  city: "Tulsa",          mood: "Public Safety Voters",   score: 84, signal: "Watched debate replay + CTV 4x — moved June 5", intent: "Moved→McCarty" as const },
  { id: "v18", name: "Suzie Sells",      city: "Tulsa",          mood: "Accountability Voters",  score: 85, signal: "Facebook boost engagement + site visit 3x — confirmed moved",           intent: "Moved→McCarty" as const },
  { id: "v19", name: "Patricia Foster",  city: "Tulsa",          mood: "DV Reform Voters",       score: 90, signal: "Watched 'Bio 15-2' on Court TV 3x + site visit",        intent: "McCarty"    as const },
  { id: "v20", name: "Richard Stokes",   city: "Tulsa",          mood: "Glossip / Integrity",    score: 88, signal: "Searched 'Colleen McCarty prosecutor' + CTV 5x",     intent: "McCarty"    as const },
  { id: "v21", name: "Dan Sandberg",     city: "Owasso",         mood: "Undecided",              score: 88, signal: "Google search + CTV 8x — moved June 4",   intent: "Moved→McCarty" as const },
  { id: "v22", name: "Michael Beumer",   city: "Owasso",         mood: "Undecided",              score: 81, signal: "YouTube pre-roll 4x + site visit — moved June 3",   intent: "Moved→McCarty" as const },
  { id: "v23", name: "Regina Brutus",    city: "Tulsa",          mood: "Undecided",              score: 85, signal: "Meta ad 'Contrast 15-1' 5x — moved June 3",   intent: "Moved→McCarty" as const },
  { id: "v24", name: "Jose Martin",      city: "Tulsa",          mood: "Accountability Voters",  score: 58, signal: "Visited Kunzweiler site — 3 McCarty CTV exposures so far", intent: "Undecided" as const },
  { id: "v25", name: "Gary Tian",        city: "Owasso",         mood: "Accountability Voters",  score: 83, signal: "CTV 8x completion + email open — confirmed moved",      intent: "Moved→McCarty" as const },
];

// ── Debate Engagement Data ────────────────────────────────────────────────────
export const MCCARTY_DEBATE_ENGAGEMENT = {
  totalDebateViewers: 22840,    // up from 8,420 — replay views compounding
  newsOn6Live: 3840,
  youtubeReplay: 9620,          // up from 2,180 — 9 days of replay accumulation
  socialMediaClips: 6840,       // up from 1,640
  podcastMentions: 2540,        // up from 760
  debateDates: [
    { date: "May 28", platform: "News on 6 / KOTV (Live)", viewers: 3840, postAdImpressions: 12400 },
    { date: "May 29", platform: "YouTube Replay — Day 2",  viewers: 4280, postAdImpressions: 18600 },
    { date: "May 30", platform: "Social Media Clips",      viewers: 2640, postAdImpressions:  9200 },
    { date: "June 1", platform: "YouTube Replay — Day 5",  viewers: 3180, postAdImpressions: 14800 },
    { date: "June 3", platform: "YouTube Replay — Day 7",  viewers: 2140, postAdImpressions: 11400 },
    { date: "June 5", platform: "YouTube Replay — Day 9",  viewers: 1840, postAdImpressions:  9600 },
  ],
  retargetingWindow: [
    { label: "Watched full debate",      count: 3840,  retargetPriority: "HIGH",   recommendedAd: "Contrast 15-1 — reinforce key debate moment" },
    { label: "Watched YouTube replay",   count: 9620,  retargetPriority: "HIGH",   recommendedAd: "Contrast 15-1 — follow up on reform message" },
    { label: "Engaged social clips",     count: 6840,  retargetPriority: "MEDIUM", recommendedAd: "Bio 15-2 — emotional resonance" },
    { label: "Searched DA race after",   count: 4180,  retargetPriority: "HIGH",   recommendedAd: "Bio 15-2 — seal name recognition" },
    { label: "Visited site after debate",count: 2840,  retargetPriority: "URGENT", recommendedAd: "Bio 15-2 — close with credibility" },
  ],
};

// ── Voter Segment Pages (replaces "Site Pages") ───────────────────────────────
export const MCCARTY_VOTER_SEGMENTS = [
  { label: "GOP 45+ Tulsa City",     views: 18420, avgTime: "3:42", bounce: 22, color: "#2a6496" },
  { label: "GOP 45+ Broken Arrow",   views:  8840, avgTime: "3:18", bounce: 24, color: "#3a85c0" },
  { label: "GOP 45+ Bixby/Jenks",    views:  5760, avgTime: "3:54", bounce: 21, color: "#f97316" },
  { label: "GOP 45+ Owasso",         views:  4920, avgTime: "3:28", bounce: 26, color: "#f59e0b" },
  { label: "GOP 45+ Sand Springs",   views:  3940, avgTime: "3:12", bounce: 28, color: "#10b981" },
  { label: "Debate Viewers Retarget",views:  6840, avgTime: "4:18", bounce: 18, color: "#6366f1" },
];
