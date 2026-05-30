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
  startDate: "May 1, 2026",
  electionDate: "June 16, 2026",
  budget: "$68,400",
  website: "colleenmccarty.com",
  accentColor: "#c8102e",
  dashboardId: "mccarty",
};

export const MCCARTY_LIVE_BASE = {
  impressions: 2847293,
  reach: 111093,
  completionRate: 88.4,
  ctr: 0.62,
  frequency: 2.56,
  cpv: 0.024,
};

// ── Vote Win Target Model ─────────────────────────────────────────────────────
// 2022 Tulsa County DA Republican Primary: ~48,000 total votes cast
// Win threshold: ~25,000 votes (52% of expected turnout)
// McCarty base: ~18,400 (committed supporters already identified)
// Votes still needed: ~6,600 from undecided/movable universe
export const MCCARTY_VOTE_TARGET = {
  totalExpectedVotes: 48000,
  winThreshold: 25000,
  committedBase: 18400,
  votesNeeded: 6600,
  undecidedUniverse: 22840,   // total undecided/movable voters in reach
  movedToMcCarty: 4218,       // undecided voters moved by media (persuasion threshold met)
  movedToKunzweiler: 1840,    // undecided voters who moved toward Kunzweiler
  stillUndecided: 16782,      // remaining undecided voters still in play
  electionDate: "2026-06-16",
  daysRemaining: 17,          // as of May 30
  projectedFinalVotes: 22618, // base + moved = 18,400 + 4,218
  projectedMargin: "+2,382 votes short of threshold — needs continued targeting",
  gapToWin: 2382,
};

// ── Undecided → Moved Voter Feed (daily movement log) ────────────────────────
export const MCCARTY_MOVED_VOTERS = [
  // Voters who started undecided and have been moved to McCarty by media
  { id: "mv-001", name: "Leesa Cornish",    city: "Oklahoma City", originalIntent: "Undecided", currentIntent: "McCarty", exposures: 6, lastSignal: "Watched 'Victims First' :15 — 6th CTV completion", movedDate: "May 28", score: 86 },
  { id: "mv-002", name: "Derek DeMott",     city: "Newalla",       originalIntent: "Undecided", currentIntent: "McCarty", exposures: 5, lastSignal: "Visited site after QR scan, read Blueprint for Justice", movedDate: "May 27", score: 82 },
  { id: "mv-003", name: "Alison Taylor",    city: "Oklahoma City", originalIntent: "Undecided", currentIntent: "McCarty", exposures: 7, lastSignal: "Watched debate replay + email open + site visit", movedDate: "May 26", score: 88 },
  { id: "mv-004", name: "Will Zhou",        city: "Oklahoma City", originalIntent: "Undecided", currentIntent: "McCarty", exposures: 5, lastSignal: "Searched 'Colleen McCarty prosecutor record'", movedDate: "May 25", score: 79 },
  { id: "mv-005", name: "Christian Dean",   city: "Edmond",        originalIntent: "Undecided", currentIntent: "McCarty", exposures: 6, lastSignal: "Reddit engagement + CTV 4x completion", movedDate: "May 24", score: 83 },
  { id: "mv-006", name: "Suzie Sells",      city: "Tulsa",         originalIntent: "Undecided", currentIntent: "McCarty", exposures: 5, lastSignal: "Facebook comment on debate post + site visit", movedDate: "May 23", score: 80 },
  { id: "mv-007", name: "Tracy Hatfield",   city: "Tulsa",         originalIntent: "Undecided", currentIntent: "McCarty", exposures: 6, lastSignal: "Watched 'Accountability' :30 on Fox News 3x", movedDate: "May 22", score: 84 },
  { id: "mv-008", name: "Jane Emerick",     city: "Broken Arrow",  originalIntent: "Undecided", currentIntent: "McCarty", exposures: 5, lastSignal: "Email open + clicked 'Blueprint for Justice' link", movedDate: "May 21", score: 81 },
  { id: "mv-009", name: "Annette Intrieri", city: "Tulsa",         originalIntent: "Undecided", currentIntent: "McCarty", exposures: 7, lastSignal: "Watched debate live + YouTube replay + site visit", movedDate: "May 20", score: 91 },
  { id: "mv-010", name: "Gary Tian",        city: "Owasso",        originalIntent: "Undecided", currentIntent: "McCarty", exposures: 5, lastSignal: "CTV 5x completion across Samsung + Tubi", movedDate: "May 19", score: 78 },
  { id: "mv-011", name: "Sharon Maxey",     city: "Jenks",         originalIntent: "Undecided", currentIntent: "McCarty", exposures: 6, lastSignal: "Watched 'Endorsement' :30 on Court TV + email open", movedDate: "May 18", score: 85 },
  { id: "mv-012", name: "Matthew Enslein",  city: "Sand Springs",  originalIntent: "Undecided", currentIntent: "McCarty", exposures: 5, lastSignal: "Google search 'Tulsa DA race' + site visit 2x", movedDate: "May 17", score: 77 },
  // Still undecided — in progress
  { id: "mv-013", name: "Janis Vogel",      city: "Tulsa",         originalIntent: "Undecided", currentIntent: "Undecided", exposures: 3, lastSignal: "CTV 3x completion — near threshold", movedDate: null, score: 71 },
  { id: "mv-014", name: "Michael Beumer",   city: "Collinsville",  originalIntent: "Undecided", currentIntent: "Undecided", exposures: 2, lastSignal: "YouTube pre-roll completion", movedDate: null, score: 64 },
  { id: "mv-015", name: "Regina Brutus",    city: "Tulsa",         originalIntent: "Undecided", currentIntent: "Undecided", exposures: 4, lastSignal: "Meta ad engagement — 'Accountability' creative", movedDate: null, score: 74 },
  { id: "mv-016", name: "Irene Epifani",    city: "Sapulpa",       originalIntent: "Undecided", currentIntent: "Undecided", exposures: 3, lastSignal: "Visited site — 1:12 session, did not convert", movedDate: null, score: 68 },
  { id: "mv-017", name: "Dan Sandberg",     city: "Collinsville",  originalIntent: "Undecided", currentIntent: "Undecided", exposures: 4, lastSignal: "Google search + CTV 2x — needs 1–2 more", movedDate: null, score: 72 },
  // Moved toward Kunzweiler
  { id: "mv-018", name: "Jose Martin",      city: "Tulsa",         originalIntent: "Undecided", currentIntent: "Kunzweiler", exposures: 2, lastSignal: "Visited Kunzweiler campaign site after CTV impression", movedDate: "May 25", score: 41 },
  { id: "mv-019", name: "Brian Horn",       city: "Edmond",        originalIntent: "Undecided", currentIntent: "Kunzweiler", exposures: 1, lastSignal: "Watched Kunzweiler TV ad — no McCarty exposure yet", movedDate: "May 22", score: 38 },
];

export const MCCARTY_DAILY_IMPRESSIONS = [
  { date: "May 1",  impressions: 52400,  completions: 44200 },
  { date: "May 3",  impressions: 61800,  completions: 53100 },
  { date: "May 5",  impressions: 74200,  completions: 64800 },
  { date: "May 7",  impressions: 88400,  completions: 77900 },
  { date: "May 9",  impressions: 96100,  completions: 85200 },
  { date: "May 11", impressions: 104800, completions: 93400 },
  { date: "May 13", impressions: 118200, completions: 105600 }, // debate day boost
  { date: "May 15", impressions: 142600, completions: 128400 }, // post-debate surge
  { date: "May 17", impressions: 136200, completions: 121800 },
  { date: "May 19", impressions: 152400, completions: 138200 }, // News on 6 debate
  { date: "May 21", impressions: 168800, completions: 154200 },
  { date: "May 23", impressions: 182400, completions: 167600 },
  { date: "May 25", impressions: 196200, completions: 181400 },
  { date: "May 27", impressions: 208600, completions: 193800 },
  { date: "May 29", impressions: 224400, completions: 209200 },
  { date: "May 30", impressions: 238800, completions: 222400 },
];

export const MCCARTY_MEDIA_MIX = [
  { channel: "CTV Streaming",    pct: 74, impressions: 2107197, spend: 50616, color: "#c8102e" },
  { channel: "Meta Ads",         pct: 10, impressions:  284729, spend:  6840, color: "#1877f2" },
  { channel: "Google Ads",       pct:  6, impressions:  170838, spend:  4104, color: "#fbbc04" },
  { channel: "YouTube",          pct:  5, impressions:  142365, spend:  3420, color: "#ff0000" },
  { channel: "Email Marketing",  pct:  3, impressions:   85419, spend:  2052, color: "#10b981" },
  { channel: "QR Activation",    pct:  2, impressions:   56946, spend:  1368, color: "#8b5cf6" },
];

export const MCCARTY_CTV_CHANNELS = [
  { name: "Samsung TV Plus",     impressions: 312840, completions: 284200, cpm: 17.35, frequency: 2.65, completionRate: 90.8, color: "#c8102e" },
  { name: "Tubi",                impressions: 228400, completions: 204600, cpm: 18.20, frequency: 2.41, completionRate: 89.6, color: "#f97316" },
  { name: "Pluto TV",            impressions: 198600, completions: 177800, cpm: 16.80, frequency: 2.18, completionRate: 89.5, color: "#a855f7" },
  { name: "Roku Channel",        impressions: 186400, completions: 167200, cpm: 19.40, frequency: 2.32, completionRate: 89.7, color: "#6366f1" },
  { name: "Fox News",            impressions: 164200, completions: 148600, cpm: 22.10, frequency: 2.84, completionRate: 90.5, color: "#1d4ed8" },
  { name: "NewsNation",          impressions: 142800, completions: 128400, cpm: 17.38, frequency: 2.22, completionRate: 89.9, color: "#0ea5e9" },
  { name: "News on 6 / KOTV",    impressions: 138200, completions: 126400, cpm: 15.58, frequency: 2.50, completionRate: 91.5, color: "#10b981" },
  { name: "2 News Oklahoma KJRH",impressions: 124600, completions: 112800, cpm: 15.58, frequency: 2.10, completionRate: 90.5, color: "#14b8a6" },
  { name: "Court TV",            impressions: 112400, completions: 101200, cpm: 14.76, frequency: 2.22, completionRate: 90.0, color: "#f59e0b" },
  { name: "America's Voice",     impressions: 104800, completions:  96200, cpm: 10.58, frequency: 3.78, completionRate: 91.8, color: "#ef4444" },
  { name: "A&E Network",         impressions:  98200, completions:  89400, cpm: 15.71, frequency: 1.96, completionRate: 91.0, color: "#8b5cf6" },
  { name: "HISTORY",             impressions:  86400, completions:  77800, cpm: 21.16, frequency: 1.73, completionRate: 90.0, color: "#d97706" },
  { name: "Performance Network", impressions:  74200, completions:  66800, cpm:  8.40, frequency: 1.84, completionRate: 90.0, color: "#64748b" },
];

export const MCCARTY_CREATIVES = [
  { name: "Name ID — 'Colleen' :30",     impressions: 842400, completions: 762800, ctr: 0.71, completionRate: 90.5, color: "#c8102e" },
  { name: "Accountability — 'Enough' :30", impressions: 624800, completions: 564200, ctr: 0.68, completionRate: 90.3, color: "#ef4444" },
  { name: "Victims First :15",           impressions: 488200, completions: 436400, ctr: 0.64, completionRate: 89.4, color: "#f97316" },
  { name: "Debate Highlight :15",        impressions: 412600, completions: 374800, ctr: 0.82, completionRate: 90.8, color: "#f59e0b" },
  { name: "Taxpayer Waste :30",          impressions: 286400, completions: 256200, ctr: 0.58, completionRate: 89.5, color: "#10b981" },
  { name: "Endorsement — Law Enforcement :30", impressions: 192893, completions: 172400, ctr: 0.74, completionRate: 89.4, color: "#6366f1" },
];

export const MCCARTY_MOODS = [
  { mood: "Civic Duty",       pct: 34, color: "#c8102e",  desc: "Engaged voters who respond to accountability messaging" },
  { mood: "Crime Concerned",  pct: 28, color: "#ef4444",  desc: "Voters prioritizing public safety and tough prosecution" },
  { mood: "Reform Minded",    pct: 18, color: "#f59e0b",  desc: "Voters frustrated with current DA office performance" },
  { mood: "Undecided",        pct: 12, color: "#6366f1",  desc: "Persuadable voters watching debate content and news" },
  { mood: "Awareness Stage",  pct:  8, color: "#64748b",  desc: "Early exposure — name recognition building" },
];

// ── Live Voter Feed — with intent classification ──────────────────────────────
export const MCCARTY_VISITORS = [
  { id: "v1",  name: "Carol Bentley",    city: "Muskogee",       mood: "Civic Duty",      score: 94, signal: "Watched News on 6 debate replay",         intent: "McCarty"    as const },
  { id: "v2",  name: "Cindy Fierro",     city: "Oklahoma City",  mood: "Crime Concerned", score: 91, signal: "Searched 'Tulsa DA race 2026'",            intent: "McCarty"    as const },
  { id: "v3",  name: "DeEtte Doerr",     city: "Tulsa",          mood: "Reform Minded",   score: 88, signal: "Watched debate on YouTube",                intent: "McCarty"    as const },
  { id: "v4",  name: "Renee Golas",      city: "Bixby",          mood: "Civic Duty",      score: 86, signal: "Clicked Meta ad — 'Accountability'",       intent: "McCarty"    as const },
  { id: "v5",  name: "Leesa Cornish",    city: "Oklahoma City",  mood: "Undecided",       score: 79, signal: "Visited colleenmccarty.com — moved",        intent: "Moved→McCarty" as const },
  { id: "v6",  name: "Jewelene Kastner", city: "El Reno",        mood: "Crime Concerned", score: 85, signal: "Watched CTV ad 3x on Tubi",                intent: "McCarty"    as const },
  { id: "v7",  name: "Randy Lopp",       city: "Tulsa",          mood: "Civic Duty",      score: 92, signal: "Shared debate clip on Facebook",            intent: "McCarty"    as const },
  { id: "v8",  name: "Sidney Mooring",   city: "Tulsa",          mood: "Reform Minded",   score: 83, signal: "Googled 'Steve Kunzweiler record'",         intent: "McCarty"    as const },
  { id: "v9",  name: "Marcia Reid",      city: "Broken Arrow",   mood: "Crime Concerned", score: 87, signal: "Watched Fox News segment on DA race",       intent: "McCarty"    as const },
  { id: "v10", name: "Derek DeMott",     city: "Newalla",        mood: "Undecided",       score: 74, signal: "Saw QR code — moved after site visit",      intent: "Moved→McCarty" as const },
  { id: "v11", name: "Kathleen Petersen",city: "Broken Arrow",   mood: "Civic Duty",      score: 96, signal: "Donated to campaign, watched debate",       intent: "McCarty"    as const },
  { id: "v12", name: "Christian Dean",   city: "Edmond",         mood: "Reform Minded",   score: 81, signal: "Reddit thread — moved after 6 exposures",   intent: "Moved→McCarty" as const },
  { id: "v13", name: "Will Zhou",        city: "Oklahoma City",  mood: "Awareness Stage", score: 68, signal: "First CTV impression — Samsung TV Plus",     intent: "Undecided"  as const },
  { id: "v14", name: "Shelly Koontz",    city: "Tulsa",          mood: "Crime Concerned", score: 89, signal: "Watched 'Victims First' ad to completion",   intent: "McCarty"    as const },
  { id: "v15", name: "Melissa Luster",   city: "Tulsa",          mood: "Civic Duty",      score: 93, signal: "Clicked Google ad — 'Colleen McCarty DA'",  intent: "McCarty"    as const },
  { id: "v16", name: "Alison Taylor",    city: "Oklahoma City",  mood: "Undecided",       score: 77, signal: "Watched debate live — moved after 7 exposures", intent: "Moved→McCarty" as const },
  { id: "v17", name: "Brian Horn",       city: "Edmond",         mood: "Crime Concerned", score: 84, signal: "Watched 'Taxpayer Waste' ad twice",         intent: "McCarty"    as const },
  { id: "v18", name: "Suzie Sells",      city: "Tulsa",          mood: "Reform Minded",   score: 80, signal: "Facebook comment on debate post",           intent: "Moved→McCarty" as const },
  { id: "v19", name: "Patricia Foster",  city: "Tulsa",          mood: "Civic Duty",      score: 90, signal: "Watched endorsement ad on Court TV",        intent: "McCarty"    as const },
  { id: "v20", name: "Richard Stokes",   city: "Tulsa",          mood: "Crime Concerned", score: 88, signal: "Searched 'Colleen McCarty prosecutor'",     intent: "McCarty"    as const },
  { id: "v21", name: "Janis Vogel",      city: "Tulsa",          mood: "Undecided",       score: 71, signal: "CTV 3x completion — 2 more needed",         intent: "Undecided"  as const },
  { id: "v22", name: "Dan Sandberg",     city: "Collinsville",   mood: "Undecided",       score: 72, signal: "Google search + CTV 2x — near threshold",   intent: "Undecided"  as const },
  { id: "v23", name: "Regina Brutus",    city: "Tulsa",          mood: "Undecided",       score: 74, signal: "Meta ad engagement — needs 1 more touch",   intent: "Undecided"  as const },
  { id: "v24", name: "Jose Martin",      city: "Tulsa",          mood: "Awareness Stage", score: 41, signal: "Visited Kunzweiler site after CTV impression", intent: "Kunzweiler" as const },
  { id: "v25", name: "Gary Tian",        city: "Owasso",         mood: "Reform Minded",   score: 78, signal: "CTV 5x completion — moved to McCarty",      intent: "Moved→McCarty" as const },
];

export const MCCARTY_QR = {
  scans: 4284,
  uniqueLocations: 38,
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
    { date: "May 13", platform: "News on 6 / KOTV", viewers: 3840, postAdImpressions: 12400 },
    { date: "May 19", platform: "YouTube Replay",   viewers: 2180, postAdImpressions:  8600 },
    { date: "May 21", platform: "Social Media Clips",viewers: 1640, postAdImpressions:  6200 },
  ],
  retargetingWindow: [
    { label: "Watched full debate",      count: 3840, retargetPriority: "HIGH",   recommendedAd: "Debate Highlight :15 — reinforce key moment" },
    { label: "Watched YouTube replay",   count: 2180, retargetPriority: "HIGH",   recommendedAd: "Accountability :30 — follow up on reform message" },
    { label: "Engaged social clips",     count: 1640, retargetPriority: "MEDIUM", recommendedAd: "Victims First :15 — emotional resonance" },
    { label: "Searched DA race after",   count:  980, retargetPriority: "HIGH",   recommendedAd: "Name ID :30 — seal name recognition" },
    { label: "Visited site after debate",count:  620, retargetPriority: "URGENT", recommendedAd: "Endorsement :30 — close with credibility" },
  ],
};

// ── Voter Segment Pages (replaces "Site Pages") ───────────────────────────────
export const MCCARTY_VOTER_SEGMENTS = [
  { label: "GOP 45+ Tulsa City",     views: 38420, avgTime: "3:42", bounce: 22, color: "#c8102e" },
  { label: "GOP 45+ Broken Arrow",   views: 18640, avgTime: "3:18", bounce: 24, color: "#ef4444" },
  { label: "GOP 45+ Bixby/Jenks",    views: 12480, avgTime: "3:54", bounce: 21, color: "#f97316" },
  { label: "GOP 45+ Owasso",         views:  9820, avgTime: "3:28", bounce: 26, color: "#f59e0b" },
  { label: "GOP 45+ Sand Springs",   views:  7640, avgTime: "3:12", bounce: 28, color: "#10b981" },
  { label: "Debate Viewers Retarget",views:  8420, avgTime: "4:18", bounce: 18, color: "#6366f1" },
];
