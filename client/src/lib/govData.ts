/**
 * govData.ts
 * 2026 Oklahoma Republican Governor's Primary — Intelligence Dashboard
 * Source: Intelligence Report by Rick Walker, June 7, 2026
 * Primary: June 16, 2026 | Runoff (if needed): August 25, 2026
 */

// ── Race Overview ─────────────────────────────────────────────────────────────
export const GOV_RACE = {
  title: "2026 Oklahoma Republican Governor's Primary",
  primaryDate: "June 16, 2026",
  runoffDate: "August 25, 2026",
  daysToElection: 9,
  reportDate: "June 7, 2026",
  reportAuthor: "Rick Walker",
  pollSource: "NonDoc / Independent Survey, May 26, 2026",
  registeredRepublicans: 900000,
  expectedPrimaryTurnout: 400000,
  winThreshold50: 200001, // 50%+1 of 400K expected
  runoffThreshold: 140001, // 50%+1 of ~280K runoff turnout
  trumpEndorsement: "Mike Mazzei",
  trumpEndorsementDate: "May 29, 2026",
  mostLikelyRunoff: "Mike Mazzei vs. Gentner Drummond",
  summary: "Four-way dead heat with all leading candidates within 3.7 points. No candidate positioned to clear 50% threshold. Runoff highly probable.",
};

// ── Current Polling ───────────────────────────────────────────────────────────
export const GOV_POLLING = [
  { candidate: "Mike Mazzei",          pct: 22.1, color: "#f59e0b", status: "frontrunner",  trump: true  },
  { candidate: "Gentner Drummond",      pct: 21.7, color: "#f97316", status: "runoff",       trump: false },
  { candidate: "Chip Keating",          pct: 21.4, color: "#fbbf24", status: "competitive",  trump: false },
  { candidate: "Charles McCall",        pct: 18.4, color: "#fb923c", status: "competitive",  trump: false },
  { candidate: "Jake Merrick",          pct:  7.2, color: "#6b7280", status: "minor",        trump: false },
  { candidate: "Kenneth Sturgell",      pct:  3.0, color: "#6b7280", status: "minor",        trump: false },
  { candidate: "Jennifer Domenico",     pct:  2.6, color: "#6b7280", status: "minor",        trump: false },
  { candidate: "Leisa Mitchell Haynes", pct:  2.4, color: "#6b7280", status: "minor",        trump: false },
  { candidate: "Callup Anthony Taylor", pct:  1.1, color: "#6b7280", status: "minor",        trump: false },
];

// ── Candidate Profiles ────────────────────────────────────────────────────────
export const GOV_CANDIDATES = {
  drummond: {
    name: "Gentner Drummond",
    title: "Oklahoma Attorney General",
    polling: 21.7,
    color: "#f97316",
    colorLight: "#fff7ed",
    status: "Likely Runoff Qualifier",
    statusColor: "#f97316",
    strengths: [
      "Highest name recognition statewide",
      "Deepest institutional support network",
      "Establishment Republican base — rural voters, tribal-friendly conservatives",
      "Most logical anti-Mazzei consolidation candidate",
    ],
    weaknesses: [
      "Polling flat since early 2026 — no momentum",
      "Vulnerable to Trump endorsement narrative",
      "Must win majority of McCall voters to advance",
    ],
    pathToWin: {
      description: "Drummond's path runs through consolidating the anti-Mazzei establishment vote. He must absorb the majority of McCall's business-community donors and institutional Republicans while holding his rural base. His ceiling in the primary is limited by the Trump endorsement effect, but in a runoff, he becomes the natural home for every voter who didn't choose Mazzei.",
      steps: [
        { label: "Hold committed base", value: "21.7%", note: "Institutional Republicans + rural voters" },
        { label: "Absorb McCall voters", value: "50–55%", note: "Establishment overlap — most natural migration" },
        { label: "Absorb Keating voters", value: "20–25%", note: "Law enforcement conservatives" },
        { label: "Absorb minor candidate voters", value: "~40%", note: "Merrick + others" },
      ],
      primaryProjection: "24–27%",
      runoffProjection: "47–52%",
      runoffScenario: "Mazzei vs. Drummond — Drummond consolidates anti-Mazzei vote",
    },
    needToPersuade: {
      universe: "several hundred thousand",
      keatingMigration: "20–25% of Keating's ~21% share",
      mccallMigration: "50–55% of McCall's ~18% share",
      keyMessage: "Proven leadership, institutional trust, anti-Mazzei consolidation",
    },
    debatePerformance: "Strong — positioned as the experienced, steady choice",
    fundingStatus: "Well-funded with deep donor network",
  },

  keating: {
    name: "Chip Keating",
    title: "Law Enforcement Executive",
    polling: 21.4,
    color: "#fbbf24",
    colorLight: "#fefce8",
    status: "Competitive — Difficult Path",
    statusColor: "#fbbf24",
    strengths: [
      "Strong activist and grassroots support",
      "Excellent debate performer",
      "Law enforcement and public safety lane — unique positioning",
      "Outsider credibility with anti-establishment voters",
    ],
    weaknesses: [
      "Lacks broad campaign infrastructure",
      "Stuck in low 20s — ceiling appears limited",
      "Trump endorsement of Mazzei threatens outsider lane",
      "No clear path to absorb other candidates' voters",
    ],
    pathToWin: {
      description: "Keating's path requires consolidating the outsider/anti-establishment lane before Mazzei absorbs it entirely. He must aggressively court Merrick voters (7.2%) and position himself as the authentic law-and-order alternative to the Trump-endorsed frontrunner. A strong final debate performance is essential to break out of the low 20s.",
      steps: [
        { label: "Hold committed base", value: "21.4%", note: "Activist conservatives + law enforcement community" },
        { label: "Absorb Merrick voters", value: "60–70%", note: "Outsider lane consolidation" },
        { label: "Peel Mazzei soft supporters", value: "5–8%", note: "Voters who like outsiders but not Trump-aligned" },
        { label: "Debate breakout moment", value: "Required", note: "Must move 3–5 points in final 9 days" },
      ],
      primaryProjection: "22–26%",
      runoffProjection: "Unlikely to qualify — needs significant movement",
      runoffScenario: "Keating voters split ~60-65% to Mazzei, ~20-25% to Drummond in runoff",
    },
    needToPersuade: {
      universe: "several hundred thousand",
      merrickMigration: "60–70% of Merrick's 7.2% share",
      mazzeiPeel: "5–8% of Mazzei soft supporters",
      keyMessage: "Real law enforcement experience, authentic outsider, not a politician",
    },
    debatePerformance: "Strong — best natural debater in the field",
    fundingStatus: "Limited infrastructure — grassroots funded",
  },

  mccall: {
    name: "Charles McCall",
    title: "Former Oklahoma House Speaker",
    polling: 18.4,
    color: "#fb923c",
    colorLight: "#fff7ed",
    status: "Competitive — Flat Trajectory",
    statusColor: "#fb923c",
    strengths: [
      "Significant financial resources and campaign infrastructure",
      "Strong business community and institutional donor network",
      "Former House Speaker — deep legislative relationships",
      "Well-organized ground operation",
    ],
    weaknesses: [
      "Polling flat to slightly down since late 2025",
      "Struggling to expand beyond institutional Republicans",
      "Business-community donor base is not a primary voting bloc",
      "Positioned between Drummond (establishment) and Mazzei (outsider) — squeezed",
    ],
    pathToWin: {
      description: "McCall's path requires a fundamental shift in the race dynamics. He needs Drummond to collapse so he can consolidate the establishment lane, or needs to break through with a major news moment or endorsement. His financial resources give him staying power, but his polling trajectory is the wrong direction with 9 days left.",
      steps: [
        { label: "Hold committed base", value: "18.4%", note: "Business community + institutional Republicans" },
        { label: "Drummond collapse scenario", value: "Required", note: "Must absorb establishment lane if Drummond fades" },
        { label: "Major endorsement or news break", value: "Required", note: "Needs external catalyst to move numbers" },
        { label: "Consolidate business-donor network", value: "Target", note: "Convert financial support into votes" },
      ],
      primaryProjection: "17–21%",
      runoffProjection: "Unlikely to qualify — needs Drummond collapse",
      runoffScenario: "McCall voters split ~50-55% to Drummond, ~30-35% to Mazzei in runoff",
    },
    needToPersuade: {
      universe: "several hundred thousand",
      drummondOverlap: "Must peel establishment voters from Drummond",
      businessVoters: "Convert donor network into actual primary votes",
      keyMessage: "Legislative experience, fiscal conservatism, proven results",
    },
    debatePerformance: "Solid but not breakthrough — has not created separation",
    fundingStatus: "Best-funded campaign in the field",
  },
};

// ── Voter Migration Model (Runoff: Mazzei vs. Drummond) ───────────────────────
export const GOV_VOTER_MIGRATION = [
  {
    pool: "Keating Voters",
    poolPct: 21,
    toMazzei: { low: 60, high: 65 },
    toDrummond: { low: 20, high: 25 },
    undecided: 15,
    rationale: "Keating voters prefer outsider, anti-establishment candidates. Trump endorsement makes Mazzei the natural landing spot. Drummond represents the establishment these voters explicitly rejected.",
  },
  {
    pool: "McCall Voters",
    poolPct: 18,
    toMazzei: { low: 30, high: 35 },
    toDrummond: { low: 50, high: 55 },
    undecided: 15,
    rationale: "McCall voters are predominantly establishment and transactional. Drummond is the logical choice. However, Mazzei's aggressive tax elimination messaging will siphon off a meaningful percentage of McCall's fiscal conservative base.",
  },
  {
    pool: "Minor Candidate Voters",
    poolPct: 10,
    toMazzei: { low: 35, high: 45 },
    toDrummond: { low: 30, high: 40 },
    undecided: 20,
    rationale: "Merrick voters (7.2%) lean outsider, likely to Mazzei. Remaining minor candidates split more evenly.",
  },
];

// ── Path to Win Math ──────────────────────────────────────────────────────────
// Based on 400K expected primary turnout
export const GOV_PATH_TO_WIN = {
  expectedTurnout: 400000,
  winThreshold: 200001,
  runoffThreshold: 140001, // ~35% likely qualifies for runoff in 4-way race

  // Primary scenario: no one hits 50%, runoff between top 2
  primaryProjections: {
    mazzei:   { low: 26, high: 32, votes_low: 104000, votes_high: 128000, note: "Trump boost pushes from 22.1% base" },
    drummond: { low: 22, high: 26, votes_low:  88000, votes_high: 104000, note: "Flat polling, institutional floor" },
    keating:  { low: 20, high: 24, votes_low:  80000, votes_high:  96000, note: "Needs debate breakout" },
    mccall:   { low: 16, high: 20, votes_low:  64000, votes_high:  80000, note: "Declining trajectory" },
  },

  // Runoff scenario: Mazzei vs. Drummond
  runoffProjections: {
    mazzei: {
      base: 104000,
      keatingAbsorb: 52000,   // 60% of ~87K Keating voters
      mccallAbsorb: 22400,    // 32% of ~70K McCall voters
      minorAbsorb: 14000,     // 40% of ~35K minor voters
      total: 192400,
      pct: 48.1,
      note: "Structural math favors Mazzei if he absorbs Keating voters",
    },
    drummond: {
      base: 88000,
      keatingAbsorb: 19000,   // 22% of ~87K Keating voters
      mccallAbsorb: 36400,    // 52% of ~70K McCall voters
      minorAbsorb: 12000,     // 34% of ~35K minor voters
      total: 155400,
      pct: 38.8,
      note: "Drummond needs McCall voters to consolidate — still trails Mazzei",
    },
  },
};

// ── Key Events Timeline ───────────────────────────────────────────────────────
export const GOV_TIMELINE = [
  { date: "April 6, 2026",   event: "First Republican Primary Debate",          impact: "Mazzei and Keating performed strongly. Drummond held ground. McCall did not create separation.", type: "debate" },
  { date: "May 28, 2026",    event: "Second Republican Primary Debate",          impact: "Mazzei again strong on tax elimination platform. Keating best natural debater. McCall solid but no breakthrough.", type: "debate" },
  { date: "May 26, 2026",    event: "NonDoc/Independent Poll Released",          impact: "Confirmed 4-way dead heat: Mazzei 22.1%, Drummond 21.7%, Keating 21.4%, McCall 18.4%", type: "poll" },
  { date: "May 29, 2026",    event: "Trump Endorses Mike Mazzei",                impact: "Most significant external factor in the race. Likely pushes Mazzei into high 20s or low 30s. Opponents immediately reaffirmed Trump support.", type: "endorsement" },
  { date: "June 7, 2026",    event: "Intelligence Report Published",             impact: "Rick Walker analysis: Mazzei vs. Drummond runoff most probable. Keating voters key to runoff outcome.", type: "report" },
  { date: "June 16, 2026",   event: "Republican Primary Election Day",           impact: "Win threshold: 50%+1. Runoff highly probable.", type: "election" },
  { date: "August 25, 2026", event: "Runoff Election (if needed)",               impact: "Most likely matchup: Mazzei vs. Drummond. Keating/McCall voter migration determines winner.", type: "runoff" },
];

// ── Strategic Imperative ──────────────────────────────────────────────────────
export const GOV_STRATEGIC = {
  headline: "The Persuasion Window",
  summary: "In a runoff scenario, the electorate shrinks and the race is decided by identifying and persuading soft supporters of the eliminated candidates. Traditional broadcast television is inefficient for this task.",
  targetVoterPool: "several hundred thousand",
  targetCandidates: ["Keating", "McCall"],
  channels: ["CTV / Streaming", "Digital Display", "OTT Platforms", "Targeted Social"],
  window: "First two weeks of runoff window",
  approach: "Real-time behavioral data model to identify which specific Keating and McCall voters are persuadable. Target them across digital, streaming, and OTT platforms before the opponent can react.",
};
