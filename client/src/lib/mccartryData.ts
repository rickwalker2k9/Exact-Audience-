/**
 * mccartryData.ts
 * Colleen McCarty for Tulsa County District Attorney — June 16, 2026 Republican Primary
 * Campaign data: CTV-heavy (74%), debate engagement, voter intelligence, vote projections
 * Framework adapted from the Jeff Starling Behavioral Intelligence model
 */

export const MCCARTY_CLIENT = {
  name: "Colleen McCarty for DA",
  location: "Tulsa, OK",
  vertical: "Political Campaign",
  campaign: "Modern DA for Modern Tulsa — Primary 2026",
  startDate: "May 28, 2026",
  electionDate: "June 16, 2026",
  budget: "$33,000",
  website: "colleenmccarty.com",
  accentColor: "#2a6496",
  dashboardId: "mccarty",
};

export const MCCARTY_LIVE_BASE = {
  impressions: 487420,
  reach: 18420,
  completionRate: 89.4,
  ctr: 0.58,
  frequency: 2.1,
  cpv: 0.028,
};

// ── Vote Win Target Model ─────────────────────────────────────────────────────
// Tulsa County DA Republican Primary 2026 — 2-PERSON RACE (winner-take-all)
// Registered Republicans in Tulsa County: ~191,215 (April 2026 official data)
// Expected primary turnout: ~28,000–38,000 votes (2-person race, higher engagement than 2018 3-way)
// Win threshold: 50%+1 of actual turnout — estimated ~15,000–19,000 votes needed
// 2018 Republican DA primary (3-way): 74,888 total; Kunzweiler won with 32,011 (42.7%)
// McCarty committed base: ~5,200 (strong supporters identified via behavioral signals)
// Undecided universe: ~60% of likely voters per internal polling
// Campaign is Day 3 of 18 (started May 28, election June 16)
export const MCCARTY_VOTE_TARGET = {
  totalExpectedVotes: 32000,    // 2-person race, ~17% of 191K registered Republicans
  winThreshold: 16001,          // 50%+1 of 32,000 expected votes
  committedBase: 5200,          // strong supporters confirmed via behavioral signals
  votesNeeded: 10801,           // 16,001 - 5,200 = still needed from undecided pool
  undecidedUniverse: 19200,     // ~60% of 32,000 expected voters = undecided/persuadable
  movedToMcCarty: 840,          // undecided voters moved by media so far (Day 3)
  movedToKunzweiler: 620,       // undecided voters who moved toward Kunzweiler
  stillUndecided: 17740,        // remaining undecided voters still in play
  electionDate: "2026-06-16",
  campaignDay: 3,               // Day 3 of 18
  daysRemaining: 15,            // 15 days left
  projectedFinalVotes: 6040,    // base + moved so far = 5,200 + 840
  projectedMargin: "On pace — 6,040 projected vs 16,001 needed. 15 days to close gap.",
  gapToWin: 9961,               // 16,001 - 6,040
  raceType: "2-person Republican primary — winner IS the next DA (no general election opponent)",
  eligibleVoters: 191215,       // registered Republicans in Tulsa County (April 2026)
};

// ── Undecided → Moved Voter Feed (daily movement log) ────────────────────────
export const MCCARTY_MOVED_VOTERS = [
  // Voters who started undecided and have been moved to McCarty by media
  { id: "mv-001", name: "Leesa Cornish",    city: "Tulsa",         originalIntent: "Undecided", currentIntent: "McCarty", exposures: 6, lastSignal: "Watched 'Contrast 15-1' — 6th CTV completion", movedDate: "May 30", score: 86 },
  { id: "mv-002", name: "Derek DeMott",     city: "Broken Arrow",  originalIntent: "Undecided", currentIntent: "McCarty", exposures: 5, lastSignal: "Visited site after QR scan, read Blueprint for Justice", movedDate: "May 30", score: 82 },
  { id: "mv-003", name: "Alison Taylor",    city: "Bixby",         originalIntent: "Undecided", currentIntent: "McCarty", exposures: 7, lastSignal: "Visited colleenmccarty.com + email open + Facebook boost engagement", movedDate: "May 29", score: 88 },
  { id: "mv-004", name: "Will Zhou",        city: "Owasso",        originalIntent: "Undecided", currentIntent: "McCarty", exposures: 5, lastSignal: "Searched 'Colleen McCarty prosecutor record' + site visit", movedDate: "May 29", score: 79 },
  { id: "mv-005", name: "Christian Dean",   city: "Jenks",         originalIntent: "Undecided", currentIntent: "McCarty", exposures: 6, lastSignal: "Reddit engagement + Facebook boost 4x + site visit", movedDate: "May 29", score: 83 },
  { id: "mv-006", name: "Suzie Sells",      city: "Tulsa",         originalIntent: "Undecided", currentIntent: "McCarty", exposures: 5, lastSignal: "Facebook boost engagement + site visit + email open", movedDate: "May 29", score: 80 },
  { id: "mv-007", name: "Tracy Hatfield",   city: "Tulsa",         originalIntent: "Undecided", currentIntent: "McCarty", exposures: 6, lastSignal: "Visited colleenmccarty.com — read Blueprint for Justice", movedDate: "May 28", score: 84 },
  { id: "mv-008", name: "Jane Emerick",     city: "Broken Arrow",  originalIntent: "Undecided", currentIntent: "McCarty", exposures: 5, lastSignal: "Email open + clicked 'Blueprint for Justice' link", movedDate: "May 28", score: 81 },
  { id: "mv-009", name: "Annette Intrieri", city: "Tulsa",         originalIntent: "Undecided", currentIntent: "McCarty", exposures: 7, lastSignal: "Organic search 'Colleen McCarty DA' + site visit 3x + Facebook boost", movedDate: "May 28", score: 91 },
  { id: "mv-010", name: "Gary Tian",        city: "Owasso",        originalIntent: "Undecided", currentIntent: "McCarty", exposures: 5, lastSignal: "Social media boost 3x + site visit + email open", movedDate: "May 28", score: 78 },
  { id: "mv-011", name: "Sharon Maxey",     city: "Jenks",         originalIntent: "Undecided", currentIntent: "McCarty", exposures: 6, lastSignal: "Visited site + email open + Facebook page follow", movedDate: "May 28", score: 85 },
  { id: "mv-012", name: "Matthew Enslein",  city: "Sand Springs",  originalIntent: "Undecided", currentIntent: "McCarty", exposures: 5, lastSignal: "Google search 'Tulsa DA race' + site visit 2x", movedDate: "May 28", score: 77 },
  // Still undecided — in progress
  { id: "mv-013", name: "Janis Vogel",      city: "Tulsa",         originalIntent: "Undecided", currentIntent: "Undecided", exposures: 3, lastSignal: "CTV 3x completion — near threshold", movedDate: null, score: 71 },
  { id: "mv-014", name: "Michael Beumer",   city: "Owasso",        originalIntent: "Undecided", currentIntent: "Undecided", exposures: 2, lastSignal: "YouTube pre-roll completion", movedDate: null, score: 64 },
  { id: "mv-015", name: "Regina Brutus",    city: "Tulsa",         originalIntent: "Undecided", currentIntent: "Undecided", exposures: 4, lastSignal: "Meta ad engagement — 'Contrast 15-1' creative", movedDate: null, score: 74 },
  { id: "mv-016", name: "Irene Epifani",    city: "Sapulpa",       originalIntent: "Undecided", currentIntent: "Undecided", exposures: 3, lastSignal: "Visited site — 1:12 session, did not convert", movedDate: null, score: 68 },
  { id: "mv-017", name: "Dan Sandberg",     city: "Owasso",        originalIntent: "Undecided", currentIntent: "Undecided", exposures: 4, lastSignal: "Google search + CTV 2x — needs 1–2 more", movedDate: null, score: 72 },
  // Still undecided — additional voters in progress
  { id: "mv-018", name: "Jose Martin",      city: "Tulsa",         originalIntent: "Undecided", currentIntent: "Undecided", exposures: 2, lastSignal: "Visited Kunzweiler campaign site — no McCarty exposure yet", movedDate: null, score: 41 },
  { id: "mv-019", name: "Brian Horn",       city: "Tulsa",         originalIntent: "Undecided", currentIntent: "Undecided", exposures: 1, lastSignal: "Google search 'Tulsa DA candidates' — first exposure pending", movedDate: null, score: 38 },
];

// Campaign started May 28 — Day 3 of 18 as of May 30
export const MCCARTY_DAILY_IMPRESSIONS = [
  { date: "May 28", impressions: 148200, completions: 132400 }, // Day 1 — campaign launch
  { date: "May 29", impressions: 162800, completions: 145600 }, // Day 2 — ramp up
  { date: "May 30", impressions: 176420, completions: 158200 }, // Day 3 — today
];

export const MCCARTY_MEDIA_MIX = [
  { channel: "CTV Streaming",    pct: 74, impressions: 360891, spend: 24420, color: "#2a6496" },
  { channel: "Meta Ads",         pct: 10, impressions:  48742, spend:  3300, color: "#1877f2" },
  { channel: "Google Ads",       pct:  6, impressions:  29245, spend:  1980, color: "#fbbc04" },
  { channel: "YouTube",          pct:  5, impressions:  24371, spend:  1650, color: "#60a5fa" },
  { channel: "Email Marketing",  pct:  3, impressions:  14623, spend:   990, color: "#10b981" },
  { channel: "QR Activation",    pct:  2, impressions:   9748, spend:   660, color: "#8b5cf6" },
];

export const MCCARTY_CTV_CHANNELS = [
  // TOP TIER — highest volume channels
  { name: "Samsung TV Plus",          impressions: 58420, completions: 53100, cpm: 17.35, frequency: 2.65, completionRate: 90.8, color: "#2a6496", tier: "top" },
  { name: "Tubi",                      impressions: 42600, completions: 38200, cpm: 18.20, frequency: 2.41, completionRate: 89.6, color: "#f97316", tier: "top" },
  { name: "Roku Channel",              impressions: 34800, completions: 31200, cpm: 17.30, frequency: 3.00, completionRate: 88.5, color: "#6366f1", tier: "top" },
  { name: "Sling TV",                  impressions: 30200, completions: 25600, cpm: 27.44, frequency: 2.73, completionRate: 84.6, color: "#3b82f6", tier: "top" },
  { name: "FOX 23 News Tulsa",         impressions: 28400, completions: 26800, cpm: 15.13, frequency: 2.83, completionRate: 94.3, color: "#10b981", tier: "top", local: true },
  { name: "Pluto TV",                  impressions: 26200, completions: 22300, cpm: 17.86, frequency: 1.21, completionRate: 85.1, color: "#a855f7", tier: "top" },
  { name: "Vibe's Performance Network",impressions: 24800, completions: 19800, cpm:  8.77, frequency: 2.03, completionRate: 80.0, color: "#64748b", tier: "top" },
  { name: "Fox News",                  impressions: 22400, completions: 19900, cpm: 21.07, frequency: 2.21, completionRate: 89.1, color: "#1d4ed8", tier: "top" },
  { name: "WatchFree+",                impressions: 18600, completions: 16100, cpm: 14.54, frequency: 2.39, completionRate: 86.9, color: "#0ea5e9", tier: "top" },
  // MID TIER
  { name: "Haystack",                  impressions: 14200, completions: 13200, cpm: 21.31, frequency: 2.20, completionRate: 93.0, color: "#8b5cf6", tier: "mid" },
  { name: "fuboTV",                    impressions: 13800, completions: 11300, cpm: 22.51, frequency: 2.71, completionRate: 82.2, color: "#f97316", tier: "mid" },
  { name: "DIRECTV",                   impressions: 13200, completions: 10800, cpm: 13.91, frequency: 2.04, completionRate: 82.1, color: "#0ea5e9", tier: "mid" },
  { name: "NewsON",                    impressions: 12400, completions: 11600, cpm: 15.37, frequency: 4.14, completionRate: 94.0, color: "#14b8a6", tier: "mid" },
  { name: "Frndly TV",                 impressions: 11200, completions:  9200, cpm: 22.10, frequency: 2.22, completionRate: 82.0, color: "#84cc16", tier: "mid" },
  { name: "A&E",                       impressions:  9800, completions:  8800, cpm: 23.33, frequency: 1.90, completionRate: 89.7, color: "#8b5cf6", tier: "mid" },
  { name: "Plex",                      impressions:  8400, completions:  7400, cpm: 23.66, frequency: 2.90, completionRate: 88.5, color: "#6366f1", tier: "mid" },
  { name: "Univision",                 impressions:  7800, completions:  7200, cpm: 17.89, frequency: 4.11, completionRate: 91.9, color: "#f59e0b", tier: "mid" },
  { name: "Local Now",                 impressions:  7200, completions:  6600, cpm: 18.60, frequency: 2.41, completionRate: 92.3, color: "#10b981", tier: "mid" },
  { name: "HISTORY",                   impressions:  6800, completions:  5200, cpm: 21.16, frequency: 1.73, completionRate: 76.9, color: "#d97706", tier: "mid" },
  { name: "America's Voice",           impressions:  6400, completions:  6400, cpm: 10.58, frequency: 3.78, completionRate: 100.0, color: "#3a85c0", tier: "mid" },
  { name: "CNN",                       impressions:  5800, completions:  4900, cpm: 21.38, frequency: 1.95, completionRate: 85.4, color: "#f97316", tier: "mid" },
  { name: "Lifetime",                  impressions:  5400, completions:  3900, cpm: 17.23, frequency: 2.33, completionRate: 71.4, color: "#ec4899", tier: "mid" },
  { name: "Weather Nation",            impressions:  5000, completions:  4600, cpm: 18.01, frequency: 2.31, completionRate: 91.9, color: "#60a5fa", tier: "mid" },
  { name: "TV Land",                   impressions:  4600, completions:  4100, cpm: 22.35, frequency: 3.86, completionRate: 88.9, color: "#a78bfa", tier: "mid" },
  { name: "AMC",                       impressions:  4200, completions:  3500, cpm: 12.19, frequency: 1.92, completionRate: 82.6, color: "#374151", tier: "mid" },
  { name: "ABC News Live",             impressions:  3800, completions:  3800, cpm: 13.14, frequency: 19.0, completionRate: 100.0, color: "#1d4ed8", tier: "mid" },
  { name: "Food Network",              impressions:  3400, completions:  3000, cpm: 29.23, frequency: 2.00, completionRate: 87.5, color: "#f97316", tier: "mid" },
  { name: "Dove Channel",              impressions:  3200, completions:  2000, cpm: 17.46, frequency: 2.50, completionRate: 64.0, color: "#a3e635", tier: "mid" },
  { name: "The CW",                    impressions:  3000, completions:  2800, cpm:  7.99, frequency: 2.48, completionRate: 92.3, color: "#06b6d4", tier: "mid" },
  { name: "2 News Oklahoma KJRH",      impressions:  2800, completions:  2800, cpm: 15.03, frequency: 1.50, completionRate: 100.0, color: "#14b8a6", tier: "mid", local: true },
  // LOWER TIER
  { name: "XUMO",                      impressions:  2600, completions:  2300, cpm: 15.47, frequency: 3.20, completionRate: 87.5, color: "#6366f1", tier: "low" },
  { name: "Comedy Central",            impressions:  2400, completions:  2400, cpm: 24.46, frequency: 1.50, completionRate: 100.0, color: "#f59e0b", tier: "low" },
  { name: "Great American Family",     impressions:  2200, completions:  1600, cpm: 24.08, frequency: 5.00, completionRate: 73.3, color: "#0ea5e9", tier: "low" },
  { name: "A&E Network",               impressions:  2000, completions:  2000, cpm: 15.71, frequency: 1.36, completionRate: 100.0, color: "#7c3aed", tier: "low" },
  { name: "Court TV",                  impressions:  1800, completions:  1600, cpm: 14.76, frequency: 2.22, completionRate: 90.0, color: "#374151", tier: "low" },
  { name: "WETV",                      impressions:  1600, completions:  1000, cpm: 13.71, frequency: 1.75, completionRate: 61.9, color: "#be185d", tier: "low" },
  { name: "The Weather Channel",       impressions:  1400, completions:  1300, cpm: 21.27, frequency: 1.63, completionRate: 92.3, color: "#0284c7", tier: "low" },
  { name: "CMT",                       impressions:  1200, completions:  1200, cpm: 25.12, frequency: 3.67, completionRate: 100.0, color: "#b45309", tier: "low" },
  { name: "CNBC",                      impressions:  1100, completions:  1100, cpm: 28.43, frequency: 1.80, completionRate: 100.0, color: "#1d4ed8", tier: "low" },
  { name: "GSN",                       impressions:  1000, completions:    940, cpm: 23.19, frequency: 2.25, completionRate: 94.1, color: "#7c3aed", tier: "low" },
  { name: "Pop TV",                    impressions:   900, completions:    900, cpm: 28.19, frequency: 2.33, completionRate: 100.0, color: "#ec4899", tier: "low" },
  { name: "WatchFreeFlix",             impressions:   800, completions:    490, cpm: 15.10, frequency: 6.50, completionRate: 61.5, color: "#64748b", tier: "low" },
  { name: "getTV",                     impressions:   780, completions:    720, cpm: 14.32, frequency: 2.60, completionRate: 92.3, color: "#6b7280", tier: "low" },
  { name: "TNT",                       impressions:   760, completions:    760, cpm: 31.16, frequency: 1.00, completionRate: 100.0, color: "#1d4ed8", tier: "low" },
  { name: "LMN",                       impressions:   740, completions:    560, cpm: 22.97, frequency: 1.25, completionRate: 60.0, color: "#ec4899", tier: "low" },
  { name: "Fox Sports 1",              impressions:   720, completions:    576, cpm: 22.83, frequency: 5.00, completionRate: 80.0, color: "#1d4ed8", tier: "low" },
  { name: "Smithsonian Channel",       impressions:   700, completions:    700, cpm: 22.40, frequency: 2.50, completionRate: 100.0, color: "#0369a1", tier: "low" },
  { name: "MLB",                       impressions:   680, completions:    510, cpm: 23.97, frequency: 4.00, completionRate: 75.0, color: "#1d4ed8", tier: "low" },
  { name: "ESPN2",                     impressions:   660, completions:    660, cpm: 23.97, frequency: 1.33, completionRate: 100.0, color: "#0369a1", tier: "low" },
  { name: "Fuse",                      impressions:   640, completions:    256, cpm: 17.96, frequency: 2.50, completionRate: 40.0, color: "#7c3aed", tier: "low" },
  { name: "Tiny House Nation",         impressions:   620, completions:    620, cpm: 14.30, frequency: 3.00, completionRate: 100.0, color: "#84cc16", tier: "low" },
  { name: "Fox Business Network",      impressions:   600, completions:    600, cpm: 16.10, frequency: 1.67, completionRate: 100.0, color: "#1d4ed8", tier: "low" },
  { name: "NHL",                       impressions:   580, completions:    580, cpm: 24.88, frequency: 1.50, completionRate: 100.0, color: "#374151", tier: "low" },
  { name: "FXX",                       impressions:   560, completions:    560, cpm: 22.80, frequency: 1.00, completionRate: 100.0, color: "#1d4ed8", tier: "low" },
  { name: "REELZ",                     impressions:   540, completions:    540, cpm: 16.48, frequency: 2.00, completionRate: 100.0, color: "#6b7280", tier: "low" },
  { name: "FYI",                       impressions:   520, completions:    260, cpm: 20.07, frequency: 1.00, completionRate: 50.0, color: "#a78bfa", tier: "low" },
  { name: "SYFY",                      impressions:   500, completions:    500, cpm: 36.21, frequency: 1.00, completionRate: 100.0, color: "#7c3aed", tier: "low" },
  { name: "NewsNation",                impressions:   480, completions:    480, cpm: 17.38, frequency: 2.00, completionRate: 100.0, color: "#0ea5e9", tier: "low" },
  { name: "Bravo",                     impressions:   460, completions:    460, cpm: 27.38, frequency: 1.00, completionRate: 100.0, color: "#a855f7", tier: "low" },
  { name: "MotorTrend",                impressions:   440, completions:    440, cpm: 27.38, frequency: 1.00, completionRate: 100.0, color: "#f97316", tier: "low" },
  { name: "truTV",                     impressions:   420, completions:    420, cpm: 27.38, frequency: 1.00, completionRate: 100.0, color: "#10b981", tier: "low" },
  { name: "CBS",                       impressions:   400, completions:    200, cpm: 13.52, frequency: 1.00, completionRate: 50.0, color: "#1d4ed8", tier: "low" },
  { name: "FOX Sports",                impressions:   380, completions:    380, cpm: 26.24, frequency: 1.00, completionRate: 100.0, color: "#1d4ed8", tier: "low" },
  { name: "Big Ten Network",           impressions:   360, completions:    360, cpm: 22.83, frequency: 1.00, completionRate: 100.0, color: "#1d4ed8", tier: "low" },
  { name: "Fox Sports 2",              impressions:   340, completions:    340, cpm: 17.41, frequency: 1.00, completionRate: 100.0, color: "#1d4ed8", tier: "low" },
  { name: "NFL",                       impressions:   320, completions:    320, cpm: 15.68, frequency: 1.00, completionRate: 100.0, color: "#1d4ed8", tier: "low" },
  { name: "Freebie TV",                impressions:   300, completions:    300, cpm: 13.52, frequency: 1.00, completionRate: 100.0, color: "#64748b", tier: "low" },
  { name: "WeatherSpy",                impressions:   280, completions:    280, cpm: 13.44, frequency: 1.00, completionRate: 100.0, color: "#0284c7", tier: "low" },
  { name: "CBS News",                  impressions:   260, completions:    260, cpm: 12.88, frequency: 1.00, completionRate: 100.0, color: "#1d4ed8", tier: "low" },
  { name: "Bloomberg",                 impressions:   240, completions:    240, cpm:  5.79, frequency: 1.00, completionRate: 100.0, color: "#374151", tier: "low" },
  { name: "NBC",                       impressions:   220, completions:    183, cpm: 14.49, frequency: 1.00, completionRate: 83.3, color: "#f59e0b", tier: "low" },
  { name: "NBA TV",                    impressions:   200, completions:    200, cpm: 30.42, frequency: 2.00, completionRate: 100.0, color: "#1d4ed8", tier: "low" },
  { name: "Hallmark Channel",          impressions:   180, completions:    180, cpm: 28.97, frequency: 1.00, completionRate: 100.0, color: "#ec4899", tier: "low" },
  { name: "Tennis Channel",            impressions:   160, completions:    160, cpm: 14.94, frequency: 1.00, completionRate: 100.0, color: "#84cc16", tier: "low" },
];

export const MCCARTY_CREATIVES = [
  { name: "Contrast :15",  impressions: 244000, completions: 216000, ctr: 0.74, completionRate: 88.5, color: "#3a85c0", note: "Rotating 50% — contrast messaging vs. Kunzweiler" },
  { name: "Bio :15",       impressions: 243420, completions: 215800, ctr: 0.69, completionRate: 88.6, color: "#f59e0b", note: "Rotating 50% — Colleen McCarty name ID & background" },
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
  { id: "v5",  name: "Leesa Cornish",    city: "Tulsa",          mood: "Undecided",              score: 79, signal: "Visited colleenmccarty.com — moved",        intent: "Moved→McCarty" as const },
  { id: "v6",  name: "Jewelene Kastner", city: "Owasso",         mood: "Public Safety Voters",   score: 85, signal: "Watched CTV ad 3x on Tubi",                intent: "McCarty"    as const },
  { id: "v7",  name: "Randy Lopp",       city: "Tulsa",          mood: "Accountability Voters",  score: 92, signal: "Shared campaign post on Facebook + site visit",            intent: "McCarty"    as const },
  { id: "v8",  name: "Sidney Mooring",   city: "Tulsa",          mood: "Accountability Voters",  score: 83, signal: "Googled 'Steve Kunzweiler record'",         intent: "McCarty"    as const },
  { id: "v9",  name: "Marcia Reid",      city: "Broken Arrow",   mood: "Public Safety Voters",   score: 87, signal: "Watched Fox News segment on DA race",       intent: "McCarty"    as const },
  { id: "v10", name: "Derek DeMott",     city: "Broken Arrow",   mood: "Undecided",              score: 74, signal: "Saw QR code — moved after site visit",      intent: "Moved→McCarty" as const },
  { id: "v11", name: "Kathleen Petersen",city: "Broken Arrow",   mood: "DV Reform Voters",       score: 96, signal: "Donated to campaign + visited site 4x",       intent: "McCarty"    as const },
  { id: "v12", name: "Christian Dean",   city: "Jenks",          mood: "Accountability Voters",  score: 81, signal: "Reddit thread — moved after 6 exposures",   intent: "Moved→McCarty" as const },
  { id: "v13", name: "Will Zhou",        city: "Owasso",         mood: "Undecided",              score: 68, signal: "First CTV impression — Samsung TV Plus",     intent: "Undecided"  as const },
  { id: "v14", name: "Shelly Koontz",    city: "Tulsa",          mood: "Public Safety Voters",   score: 89, signal: "Watched 'Bio 15-2' ad to completion",   intent: "McCarty"    as const },
  { id: "v15", name: "Melissa Luster",   city: "Tulsa",          mood: "DV Reform Voters",       score: 93, signal: "Clicked Google ad — 'Colleen McCarty DA'",  intent: "McCarty"    as const },
  { id: "v16", name: "Alison Taylor",    city: "Bixby",          mood: "Undecided",              score: 77, signal: "Facebook boost 7x + site visit — moved to McCarty", intent: "Moved→McCarty" as const },
  { id: "v17", name: "Brian Horn",       city: "Tulsa",          mood: "Public Safety Voters",   score: 84, signal: "Watched 'Contrast 15-1' twice on Fox News", intent: "McCarty"    as const },
  { id: "v18", name: "Suzie Sells",      city: "Tulsa",          mood: "Accountability Voters",  score: 80, signal: "Facebook boost engagement + site visit",           intent: "Moved→McCarty" as const },
  { id: "v19", name: "Patricia Foster",  city: "Tulsa",          mood: "DV Reform Voters",       score: 90, signal: "Watched 'Bio 15-2' on Court TV",        intent: "McCarty"    as const },
  { id: "v20", name: "Richard Stokes",   city: "Tulsa",          mood: "Glossip / Integrity",    score: 88, signal: "Searched 'Colleen McCarty prosecutor'",     intent: "McCarty"    as const },
  { id: "v21", name: "Janis Vogel",      city: "Tulsa",          mood: "Undecided",              score: 71, signal: "CTV 3x completion — 2 more needed",         intent: "Undecided"  as const },
    { id: "v22", name: "Dan Sandberg",      city: "Owasso",         mood: "Undecided",              score: 72, signal: "Google search + CTV 2x — near threshold",   intent: "Undecided"  as const },
  { id: "v23", name: "Regina Brutus",    city: "Tulsa",          mood: "Undecided",              score: 74, signal: "Meta ad engagement — needs 1 more touch",   intent: "Undecided"  as const },
  { id: "v24", name: "Jose Martin",      city: "Tulsa",          mood: "Accountability Voters",  score: 41, signal: "Visited Kunzweiler site after CTV impression", intent: "Kunzweiler" as const },
  { id: "v25", name: "Gary Tian",        city: "Owasso",         mood: "Accountability Voters",  score: 78, signal: "CTV 5x completion — moved to McCarty",      intent: "Moved→McCarty" as const },
];

export const MCCARTY_QR = {
  scans: 842,
  uniqueLocations: 12,
  topLocations: ["Tulsa Fairgrounds", "Broken Arrow Farmers Market", "Owasso Community Center", "Bixby Town Hall", "Sand Springs Library"],
  conversionRate: 18.4,
};

// ── Debate Engagement Data ────────────────────────────────────────────────────
export const MCCARTY_DEBATE_ENGAGEMENT = {
  totalDebateViewers: 8420,
  newsOn6Live: 3840,
  youtubeReplay: 2180,
  socialMediaClips: 1640,
  podcastMentions: 760,
  debateDates: [
    { date: "May 28", platform: "News on 6 / KOTV (Live)", viewers: 3840, postAdImpressions: 12400 },
    { date: "May 29", platform: "YouTube Replay",          viewers: 2180, postAdImpressions:  8600 },
    { date: "May 30", platform: "Social Media Clips",      viewers: 1640, postAdImpressions:  6200 },
  ],
  retargetingWindow: [
    { label: "Watched full debate",      count: 3840, retargetPriority: "HIGH",   recommendedAd: "Contrast 15-1 — reinforce key debate moment" },
    { label: "Watched YouTube replay",   count: 2180, retargetPriority: "HIGH",   recommendedAd: "Contrast 15-1 — follow up on reform message" },
    { label: "Engaged social clips",     count: 1640, retargetPriority: "MEDIUM", recommendedAd: "Bio 15-2 — emotional resonance" },
    { label: "Searched DA race after",   count:  980, retargetPriority: "HIGH",   recommendedAd: "Bio 15-2 — seal name recognition" },
    { label: "Visited site after debate",count:  620, retargetPriority: "URGENT", recommendedAd: "Bio 15-2 — close with credibility" },
  ],
};

// ── Voter Segment Pages (replaces "Site Pages") ───────────────────────────────
export const MCCARTY_VOTER_SEGMENTS = [
  { label: "GOP 45+ Tulsa City",     views: 6840, avgTime: "3:42", bounce: 22, color: "#2a6496" },
  { label: "GOP 45+ Broken Arrow",   views: 3280, avgTime: "3:18", bounce: 24, color: "#3a85c0" },
  { label: "GOP 45+ Bixby/Jenks",    views: 2140, avgTime: "3:54", bounce: 21, color: "#f97316" },
  { label: "GOP 45+ Owasso",         views: 1820, avgTime: "3:28", bounce: 26, color: "#f59e0b" },
  { label: "GOP 45+ Sand Springs",   views: 1460, avgTime: "3:12", bounce: 28, color: "#10b981" },
  { label: "Debate Viewers Retarget",views: 1640, avgTime: "4:18", bounce: 18, color: "#6366f1" },
];
