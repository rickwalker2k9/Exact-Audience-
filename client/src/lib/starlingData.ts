/**
 * starlingData.ts
 * Jeff Starling for Oklahoma Attorney General — June 16, 2026 Republican Primary
 * PITCH DOCUMENT — 3 Budget Tiers from Exact Audience Pitch Deck (June 2026)
 * Presented by Rick Walker | Exact Audience | exactaudience.ai | siteid.ai
 * 2-person race: Starling vs. Jon Echols
 */

export const STARLING_CAMPAIGN_START = new Date("2026-05-30T00:00:00");
export const STARLING_ELECTION_DATE = new Date("2026-06-16T00:00:00");
export const STARLING_TOTAL_DAYS = 18;

// ── Race Context ──────────────────────────────────────────────────────────────
export const STARLING_RACE = {
  registeredRepublicans: 1284262,
  expectedTurnoutLow: 231000,
  expectedTurnoutHigh: 282000,
  winThresholdLow: 116000,
  winThresholdHigh: 142000,
  currentPollingStarling: 20,
  currentPollingEchols: 35,
  undecided: 45,
  currentVotesStarling: 46000,   // ~20% of 231K low-end
  currentVotesEchols: 81000,     // ~35% of 231K low-end
  votesNeeded: 70000,            // need to more than double current support
  markets: [
    { name: "Oklahoma City Metro", pct: 48, registeredR: 450000, echols: 38, starling: 16, note: "Battleground — Echols leads 38–16" },
    { name: "Tulsa Metro", pct: 32, registeredR: 350000, echols: 31, starling: 26, note: "Stronghold — tight race, Starling home turf" },
    { name: "Rest of State", pct: 20, registeredR: 484262, echols: 32, starling: 18, note: "Rural/suburban — persuadable with bio message" },
  ],
};

// ── Three Budget Tiers (from Exact Audience Pitch Deck) ──────────────────────
export const STARLING_TIERS = [
  {
    id: "entry",
    label: "Entry",
    total: 30000,
    tagline: "Complement to existing broadcast TV spend",
    recommended: false,
    components: [
      { label: "CTV — OKC Market, Republican Voters 45+", budget: 11000 },
      { label: "CTV — Tulsa Market, Republican Voters 45+", budget: 11000 },
      { label: "Digital Display and Pre-roll", budget: 4000 },
      { label: "Exact Audience Platform Fee", budget: 4000 },
    ],
    metrics: {
      uniqueVoters: "75,000–95,000",
      frequency: "2–3x",
      persuasionThreshold: "Partially met",
      digitalImpressions: "80,000–120,000",
      siteIdContacts: "3,000–5,000",
      newVotes: "7,500–12,000",
      projectedTotal: "53,000–68,000",
      costPerVote: "$2.50–$4.00",
    },
    projections: [
      { scenario: "Conservative", votersReached: 75000, conversion: 6, newVotes: 4500, starlingTotal: "50,000–55,000" },
      { scenario: "Realistic", votersReached: 85000, conversion: 9, newVotes: 7650, starlingTotal: "53,000–62,000", highlight: true },
      { scenario: "Optimistic", votersReached: 95000, conversion: 13, newVotes: 12350, starlingTotal: "58,000–68,000" },
    ],
    ctvOKC: 11000,
    ctvTulsa: 11000,
    digital: 4000,
    platformFee: 4000,
    warning: "Frequency is below the persuasion threshold for most undecided voters. Best deployed as a complement to existing broadcast TV spend.",
    color: "#64748b",
    borderColor: "#94a3b8",
  },
  {
    id: "recommended",
    label: "Recommended",
    total: 65000,
    tagline: "Crosses persuasion threshold — majority of high-propensity voters reached",
    recommended: true,
    components: [
      { label: "CTV — OKC Market, Republican Voters 45+", budget: 25000 },
      { label: "CTV — Tulsa Market, Republican Voters 45+", budget: 25000 },
      { label: "Digital Display and Pre-roll", budget: 10000 },
      { label: "Exact Audience Platform Fee", budget: 5000 },
    ],
    metrics: {
      uniqueVoters: "170,000–220,000",
      frequency: "4–6x",
      persuasionThreshold: "Yes",
      digitalImpressions: "200,000–350,000",
      siteIdContacts: "6,000–9,000",
      newVotes: "23,400–28,000",
      projectedTotal: "69,000–84,000",
      costPerVote: "$2.32–$2.78",
    },
    projections: [
      { scenario: "Conservative", votersReached: 170000, conversion: 7, newVotes: 11900, starlingTotal: "58,000–68,000" },
      { scenario: "Realistic", votersReached: 195000, conversion: 12, newVotes: 23400, starlingTotal: "69,000–79,000", highlight: true },
      { scenario: "Optimistic", votersReached: 220000, conversion: 18, newVotes: 39600, starlingTotal: "85,000–96,000" },
    ],
    ctvOKC: 25000,
    ctvTulsa: 25000,
    digital: 10000,
    platformFee: 5000,
    warning: null,
    color: "#1d4ed8",
    borderColor: "#3b82f6",
  },
  {
    id: "saturation",
    label: "Full Saturation",
    total: 93000,
    tagline: "Maximum reach — optimization engine compounds gains through Election Day",
    recommended: false,
    components: [
      { label: "CTV — OKC Market, Republican Voters 45+", budget: 35000 },
      { label: "CTV — Tulsa Market, Republican Voters 45+", budget: 35000 },
      { label: "Digital Display and Pre-roll", budget: 15000 },
      { label: "Exact Audience Platform Fee", budget: 8000 },
    ],
    metrics: {
      uniqueVoters: "230,000–290,000",
      frequency: "5–7x",
      persuasionThreshold: "Yes — saturation",
      digitalImpressions: "300,000–500,000",
      siteIdContacts: "8,000–14,000",
      newVotes: "33,800–42,000",
      projectedTotal: "79,000–98,000",
      costPerVote: "$2.21–$2.75",
    },
    projections: [
      { scenario: "Conservative", votersReached: 230000, conversion: 8, newVotes: 18400, starlingTotal: "64,000–74,000" },
      { scenario: "Realistic", votersReached: 260000, conversion: 13, newVotes: 33800, starlingTotal: "79,000–89,000", highlight: true },
      { scenario: "Optimistic", votersReached: 290000, conversion: 20, newVotes: 58000, starlingTotal: "104,000–114,000" },
    ],
    ctvOKC: 35000,
    ctvTulsa: 35000,
    digital: 15000,
    platformFee: 8000,
    warning: null,
    color: "#7c3aed",
    borderColor: "#a855f7",
  },
];

// ── 18-Day Campaign Timeline ──────────────────────────────────────────────────
export const STARLING_TIMELINE = [
  { days: "Day 1", activity: "Behavioral profiles built, targeting live, CTV activated in both markets" },
  { days: "Days 1–3", activity: "Message A/B testing across voter segments, SiteID identification begins" },
  { days: "Days 4–6", activity: "First optimization cycle — budget shifted to highest-converting ZIPs and messages" },
  { days: "Days 7–12", activity: "Peak frequency window — saturation delivery to highest-propensity voters" },
  { days: "Days 13–15", activity: "Final optimization — pre-election behavioral data informs last message mix" },
  { days: "Days 16–18", activity: "Maximum frequency to identified persuadables, SiteID retargeting at full volume" },
  { days: "June 16", activity: "Election Day — final impression timed to each voter's likely voting window", election: true },
];

// ── Ad Concepts ───────────────────────────────────────────────────────────────
export const STARLING_CREATIVES = [
  {
    name: "The Contrast",
    focus: "OKC Market",
    length: ":30",
    type: "CTV/OTT",
    color: "#1d4ed8",
    script: "Jon Echols spent 14 years in the Oklahoma State Capitol. He raised taxes. He took government contracts worth millions. He barely practiced law. And now he wants to be Oklahoma's top prosecutor. Jeff Starling has spent his career in the courtroom — fighting federal overreach, defending Oklahoma businesses and families, and never once collecting a government paycheck. On June 16th, Oklahoma Republicans have a clear choice: a career politician looking for his next deal, or a practicing attorney who will actually do the job.",
    tag: "I'm Jeff Starling, and I approve this message.",
    mood: "Anti-Corruption Voters",
    note: "Contrast vs. Echols — career politician framing, AG accountability message",
  },
  {
    name: "The Outsider",
    focus: "Tulsa Market",
    length: ":30",
    type: "CTV/OTT",
    color: "#7c3aed",
    script: "The Oklahoma City insiders are spending everything they have to stop Jeff Starling. Why? Because he's not one of them. Jeff Starling is a practicing attorney, a successful businessman, and a pro-Trump conservative who has never run for office and doesn't owe the establishment a thing. He'll stand with President Trump, crack down on illegal marijuana grows and cartels, and fight public corruption — without worrying about which sheriff endorsed him. Jeff Starling. The outsider Oklahoma needs.",
    tag: "I'm Jeff Starling, and I approve this message.",
    mood: "Conservative Values",
    note: "Bio/outsider narrative — anti-establishment, pro-Trump conservative",
  },
];

// ── Voter Mood Segments → Media Channel Mapping ──────────────────────────────
export const STARLING_MOODS = [
  {
    label: "Anti-Corruption Voters",
    pct: 28,
    color: "#1d4ed8",
    icon: "⚖️",
    desc: "Voters prioritizing AG accountability and prosecutorial independence — Echols' government contracts are the wedge",
    channels: ["YouTube Pre-roll", "Fox News Digital", "NewsMax", "Meta Contrast Ads"],
    message: "Contrast — Echols career politician, Starling practicing attorney",
  },
  {
    label: "Public Safety Voters",
    pct: 22,
    color: "#0ea5e9",
    icon: "🛡️",
    desc: "Voters focused on violent crime, fentanyl, illegal marijuana grows, and border-related crime",
    channels: ["CTV/OTT", "Fox News", "KFOR News 4", "News9 OKC"],
    message: "Starling will prosecute — cartels, fentanyl, illegal grows",
  },
  {
    label: "Conservative Values",
    pct: 18,
    color: "#7c3aed",
    icon: "🇺🇸",
    desc: "Voters aligned with constitutional conservatism, pro-Trump, rule of law",
    channels: ["NewsMax", "OAN", "Facebook", "Fox Business Network"],
    message: "Outsider bio — pro-Trump, never a politician, owes nothing to establishment",
  },
  {
    label: "Undecided / Persuadable",
    pct: 45,
    color: "#f59e0b",
    icon: "❓",
    desc: "Primary EA target universe — 45% of likely voters with no firm commitment",
    channels: ["CTV Broad Reach", "Samsung TV Plus", "Tubi", "Hulu", "Roku", "The Lost Ogle"],
    message: "Bio message first, then contrast after 2nd exposure",
  },
  {
    label: "Echols Lean (Persuadable)",
    pct: 35,
    color: "#6b7280",
    icon: "↔️",
    desc: "Soft Echols support — persuadable with contrast messaging on government contracts and tax record",
    channels: ["YouTube", "Meta Retargeting", "SiteID Follow-up", "Display Retargeting"],
    message: "Contrast — Echols raised taxes, took contracts, barely practiced law",
  },
];

// ── Full Channel Universe ─────────────────────────────────────────────────────
// 74 CTV channels (same universe as McCarty) + Oklahoma-specific digital
export const STARLING_CTV_CHANNELS = [
  // TOP TIER
  { name: "Samsung TV Plus",          tier: "top",  color: "#1428A0" },
  { name: "Tubi",                     tier: "top",  color: "#f97316" },
  { name: "Roku Channel",             tier: "top",  color: "#6C1D45" },
  { name: "Sling TV",                 tier: "top",  color: "#3b82f6" },
  { name: "Pluto TV",                 tier: "top",  color: "#F7C948" },
  { name: "Vibe's Performance Network", tier: "top", color: "#64748b" },
  { name: "Fox News",                 tier: "top",  color: "#1d4ed8" },
  { name: "WatchFree+",               tier: "top",  color: "#0ea5e9" },
  // MID TIER
  { name: "Haystack",                 tier: "mid",  color: "#8b5cf6" },
  { name: "fuboTV",                   tier: "mid",  color: "#f97316" },
  { name: "DIRECTV",                  tier: "mid",  color: "#0ea5e9" },
  { name: "NewsON",                   tier: "mid",  color: "#14b8a6" },
  { name: "Frndly TV",                tier: "mid",  color: "#84cc16" },
  { name: "A&E",                      tier: "mid",  color: "#8b5cf6" },
  { name: "Plex",                     tier: "mid",  color: "#6366f1" },
  { name: "Univision",                tier: "mid",  color: "#f59e0b" },
  { name: "Local Now",                tier: "mid",  color: "#10b981" },
  { name: "HISTORY",                  tier: "mid",  color: "#d97706" },
  { name: "America's Voice",          tier: "mid",  color: "#3a85c0" },
  { name: "CNN",                      tier: "mid",  color: "#f97316" },
  { name: "Lifetime",                 tier: "mid",  color: "#ec4899" },
  { name: "Weather Nation",           tier: "mid",  color: "#60a5fa" },
  { name: "TV Land",                  tier: "mid",  color: "#a78bfa" },
  { name: "AMC",                      tier: "mid",  color: "#374151" },
  { name: "ABC News Live",            tier: "mid",  color: "#1d4ed8" },
  { name: "Food Network",             tier: "mid",  color: "#f97316" },
  { name: "Dove Channel",             tier: "mid",  color: "#a3e635" },
  { name: "The CW",                   tier: "mid",  color: "#06b6d4" },
  // LOWER TIER
  { name: "XUMO",                     tier: "low",  color: "#6366f1" },
  { name: "Comedy Central",           tier: "low",  color: "#f59e0b" },
  { name: "Great American Family",    tier: "low",  color: "#0ea5e9" },
  { name: "A&E Network",              tier: "low",  color: "#7c3aed" },
  { name: "Court TV",                 tier: "low",  color: "#374151" },
  { name: "WETV",                     tier: "low",  color: "#be185d" },
  { name: "The Weather Channel",      tier: "low",  color: "#0284c7" },
  { name: "CMT",                      tier: "low",  color: "#b45309" },
  { name: "CNBC",                     tier: "low",  color: "#1d4ed8" },
  { name: "GSN",                      tier: "low",  color: "#7c3aed" },
  { name: "Pop TV",                   tier: "low",  color: "#ec4899" },
  { name: "WatchFreeFlix",            tier: "low",  color: "#64748b" },
  { name: "getTV",                    tier: "low",  color: "#6b7280" },
  { name: "TNT",                      tier: "low",  color: "#1d4ed8" },
  { name: "LMN",                      tier: "low",  color: "#ec4899" },
  { name: "Fox Sports 1",             tier: "low",  color: "#1d4ed8" },
  { name: "Smithsonian Channel",      tier: "low",  color: "#0369a1" },
  { name: "MLB",                      tier: "low",  color: "#1d4ed8" },
  { name: "ESPN2",                    tier: "low",  color: "#0369a1" },
  { name: "Fuse",                     tier: "low",  color: "#7c3aed" },
  { name: "Tiny House Nation",        tier: "low",  color: "#84cc16" },
  { name: "Fox Business Network",     tier: "low",  color: "#1d4ed8" },
  { name: "NHL",                      tier: "low",  color: "#374151" },
  { name: "FXX",                      tier: "low",  color: "#1d4ed8" },
  { name: "REELZ",                    tier: "low",  color: "#6b7280" },
  { name: "FYI",                      tier: "low",  color: "#a78bfa" },
  { name: "SYFY",                     tier: "low",  color: "#7c3aed" },
  { name: "NewsNation",               tier: "low",  color: "#0ea5e9" },
  { name: "Bravo",                    tier: "low",  color: "#a855f7" },
  { name: "MotorTrend",               tier: "low",  color: "#f97316" },
  { name: "truTV",                    tier: "low",  color: "#10b981" },
  { name: "CBS",                      tier: "low",  color: "#1d4ed8" },
  { name: "FOX Sports",               tier: "low",  color: "#1d4ed8" },
  { name: "Big Ten Network",          tier: "low",  color: "#1d4ed8" },
  { name: "Fox Sports 2",             tier: "low",  color: "#1d4ed8" },
  { name: "NFL",                      tier: "low",  color: "#1d4ed8" },
  { name: "Freebie TV",               tier: "low",  color: "#64748b" },
  { name: "WeatherSpy",               tier: "low",  color: "#0284c7" },
  { name: "CBS News",                 tier: "low",  color: "#1d4ed8" },
  { name: "Bloomberg",                tier: "low",  color: "#374151" },
  { name: "NBC",                      tier: "low",  color: "#f59e0b" },
  { name: "NBA TV",                   tier: "low",  color: "#1d4ed8" },
  { name: "Hallmark Channel",         tier: "low",  color: "#ec4899" },
  { name: "Tennis Channel",           tier: "low",  color: "#84cc16" },
  // Oklahoma LOCAL TV (OKC + Tulsa markets)
  { name: "KFOR News 4 (OKC)",        tier: "top",  color: "#1d4ed8", local: true },
  { name: "News9 / KWTV (OKC)",       tier: "top",  color: "#0ea5e9", local: true },
  { name: "KOTV / News on 6 (Tulsa)", tier: "top",  color: "#7c3aed", local: true },
  { name: "KOCO 5 (OKC)",             tier: "top",  color: "#f59e0b", local: true },
  { name: "FOX 23 Tulsa",             tier: "top",  color: "#10b981", local: true },
  { name: "2 News Oklahoma KJRH",     tier: "mid",  color: "#14b8a6", local: true },
];

// ── Oklahoma Digital Channel Universe ────────────────────────────────────────
export const STARLING_DIGITAL_CHANNELS = [
  // Social Media
  { name: "Meta (Facebook + Instagram)", category: "Social", color: "#1877f2", note: "Conservative voter targeting, 45+ Facebook-heavy demographic", priority: "high" },
  { name: "YouTube", category: "Video", color: "#60a5fa", note: "Pre-roll on political, news, and conservative content", priority: "high" },
  { name: "TikTok", category: "Social", color: "#010101", note: "Younger Republican voters — outsider/bio narrative", priority: "medium" },
  { name: "Reddit", category: "Social", color: "#f97316", note: "r/oklahoma, r/okc, r/tulsa — organic + paid targeting", priority: "medium" },
  // Oklahoma-Specific Digital
  { name: "The Lost Ogle", category: "Oklahoma Media", color: "#0ea5e9", note: "Oklahoma's most-read political blog — informed voters of all ages", priority: "high" },
  { name: "NonDoc.com", category: "Oklahoma Media", color: "#1d4ed8", note: "Oklahoma political journalism — engaged primary voters", priority: "high" },
  { name: "Oklahoma Watch", category: "Oklahoma Media", color: "#0ea5e9", note: "Investigative journalism — anti-corruption voter segment", priority: "medium" },
  { name: "Tulsa World Digital", category: "Oklahoma Media", color: "#374151", note: "Tulsa market digital display and pre-roll", priority: "medium" },
  { name: "The Oklahoman / NewsOK", category: "Oklahoma Media", color: "#6b7280", note: "OKC market digital — conservative readership", priority: "medium" },
  // Programmatic / Display
  { name: "Google Display Network", category: "Programmatic", color: "#fbbc04", note: "Statewide display retargeting — site visitors + lookalikes", priority: "high" },
  { name: "Digital Display / Pre-roll", category: "Programmatic", color: "#4f46e5", note: "Statewide Republican voter targeting via behavioral data", priority: "high" },
  { name: "SiteID Retargeting", category: "Behavioral", color: "#10b981", note: "60% match rate on jeffstarling.com visitors — follow-up sequence", priority: "high" },
  // Conservative Digital
  { name: "NewsMax Digital", category: "Conservative Media", color: "#f97316", note: "Conservative primary voters — contrast messaging", priority: "medium" },
  { name: "OAN Digital", category: "Conservative Media", color: "#1a1a2e", note: "Hard-right conservative segment", priority: "medium" },
  { name: "Fox News Digital", category: "Conservative Media", color: "#003366", note: "Broad conservative reach — OKC and Tulsa markets", priority: "high" },
];

// ── Exact Audience vs. Traditional Media ─────────────────────────────────────
export const STARLING_EA_ADVANTAGE = [
  { capability: "Audience targeting", traditional: "Demographics, party registration", ea: "Real individuals, behavioral intent" },
  { capability: "Media placement", traditional: "Platform-level scheduling", ea: "Voter-level — right screen, right hour" },
  { capability: "Optimization", traditional: "Weekly or post-campaign", ea: "Real-time, hour-by-hour reallocation" },
  { capability: "Site visitor intelligence", traditional: "Anonymous traffic", ea: "SiteID identifies 60% of visitors" },
  { capability: "Final-day strategy", traditional: "Pre-set plan", ea: "Adjusted on 48-hour behavioral data" },
];

// ── Voter Intelligence Capabilities ──────────────────────────────────────────
export const STARLING_INTELLIGENCE = [
  { label: "Mood and Emotional State", desc: "We track the content each voter is consuming and match the message to their current mindset. A voter reading about government corruption gets a contrast message. A voter consuming outsider-candidate content gets the bio.", icon: "🧠" },
  { label: "Media Consumption Patterns", desc: "We know which platforms each voter uses, which shows they watch, and whether they consume political content in the morning, primetime, or late at night. We follow the voter to the screen they are actually on.", icon: "📺" },
  { label: "Online Behavior Windows", desc: "We track when each voter is online across all devices and serve the right format — CTV, pre-roll, display — at the right moment on the right screen.", icon: "⏱️" },
  { label: "Persuasion Threshold Score", desc: "Every voter has a threshold — the number of exposures required before they move. We score each voter and allocate frequency accordingly. Low-threshold voters get hit early. High-threshold voters get sustained frequency through Election Day.", icon: "🎯" },
  { label: "Message Testing", desc: "We test bio versus contrast, outsider versus prosecutor, in real time. Within 48 hours we know which message is winning in OKC versus Tulsa, by age group, by income band. Budget shifts to the winner immediately.", icon: "🔬" },
  { label: "Pre-Election Behavioral Signals", desc: "In the 48–72 hours before Election Day, we read each voter's content consumption and time the final impression as close to their likely voting window as possible.", icon: "🗳️" },
];

// ── Live Voter Feed (sample — statewide Oklahoma) ─────────────────────────────
export const STARLING_VISITORS = [
  { name: "David M.",    city: "Edmond",       state: "OK", zip: "73034", signal: "Watched Outsider :30 to completion", time: "2m ago",  mood: "Conservative Values",      device: "CTV",     hot: true  },
  { name: "Karen T.",    city: "Broken Arrow",  state: "OK", zip: "74012", signal: "Clicked Meta ad — jeffstarling.com", time: "4m ago",  mood: "Anti-Corruption Voters",   device: "Mobile",  hot: true  },
  { name: "Robert H.",   city: "Tulsa",         state: "OK", zip: "74103", signal: "Watched Contrast :30 to completion", time: "7m ago",  mood: "Public Safety Voters",     device: "CTV",     hot: true  },
  { name: "Linda B.",    city: "Norman",        state: "OK", zip: "73069", signal: "Visited jeffstarling.com — Issues page", time: "11m ago", mood: "Anti-Corruption Voters", device: "Desktop", hot: false },
  { name: "James W.",    city: "Yukon",         state: "OK", zip: "73099", signal: "Watched Outsider :30 — 3rd exposure", time: "14m ago", mood: "Conservative Values",     device: "CTV",     hot: true  },
  { name: "Patricia S.", city: "Moore",         state: "OK", zip: "73160", signal: "Engaged with Starling YouTube pre-roll", time: "18m ago", mood: "Public Safety Voters",  device: "Mobile",  hot: false },
  { name: "Michael R.",  city: "Owasso",        state: "OK", zip: "74055", signal: "Watched Contrast :30 — 2nd exposure", time: "22m ago", mood: "Echols Lean (Persuadable)", device: "CTV",   hot: true  },
  { name: "Susan K.",    city: "Midwest City",  state: "OK", zip: "73110", signal: "Clicked Meta ad — donation page visit", time: "26m ago", mood: "Anti-Corruption Voters", device: "Mobile", hot: true  },
  { name: "Thomas A.",   city: "Jenks",         state: "OK", zip: "74037", signal: "Visited jeffstarling.com — About page", time: "31m ago", mood: "Conservative Values",   device: "Desktop", hot: false },
  { name: "Nancy G.",    city: "Bixby",         state: "OK", zip: "74008", signal: "Watched Outsider :30 — 1st exposure", time: "35m ago", mood: "Undecided / Persuadable", device: "CTV",    hot: false },
  { name: "Charles P.",  city: "Mustang",       state: "OK", zip: "73064", signal: "Watched Contrast :30 to completion", time: "39m ago", mood: "Echols Lean (Persuadable)", device: "CTV",   hot: true  },
  { name: "Barbara L.",  city: "Claremore",     state: "OK", zip: "74017", signal: "Engaged with Starling display ad", time: "44m ago", mood: "Public Safety Voters",       device: "Mobile",  hot: false },
  { name: "William F.",  city: "Stillwater",    state: "OK", zip: "74074", signal: "Read The Lost Ogle — Starling profile", time: "48m ago", mood: "Anti-Corruption Voters", device: "Desktop", hot: false },
  { name: "Dorothy M.",  city: "Lawton",        state: "OK", zip: "73501", signal: "Watched Fox News Digital pre-roll", time: "52m ago", mood: "Conservative Values",       device: "Mobile",  hot: false },
  { name: "George H.",   city: "Enid",          state: "OK", zip: "73701", signal: "CTV 4th exposure — near persuasion threshold", time: "58m ago", mood: "Undecided / Persuadable", device: "CTV", hot: true },
];
