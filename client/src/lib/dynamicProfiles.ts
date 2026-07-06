/**
 * dynamicProfiles.ts
 * Date-seeded daily profile rotation for the six commercial client dashboards.
 * Every day the page loads, a new set of 3 profiles is selected from a larger pool,
 * with all signal dates shifted to be relative to today.
 * Same 3 profiles show all day; they rotate at midnight.
 */

import type { BuyerProfile, IntentSignal } from "./buyerProfiles";

// ─── Seeded RNG ───────────────────────────────────────────────────────────────
function seedRng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function todaySeed(dashboardId: string): number {
  const d = new Date();
  const base = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  // Mix in dashboard-specific offset so each dashboard rotates independently
  const offset = dashboardId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return base + offset;
}

function pickN<T>(arr: T[], n: number, rng: () => number): T[] {
  const copy = [...arr];
  const result: T[] = [];
  for (let i = 0; i < n && copy.length > 0; i++) {
    const idx = Math.floor(rng() * copy.length);
    result.push(copy.splice(idx, 1)[0]);
  }
  return result;
}

// ─── Date helpers ─────────────────────────────────────────────────────────────
function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function shiftSignalDates(signals: IntentSignal[]): IntentSignal[] {
  const n = signals.length;
  return signals.map((sig, i) => ({
    ...sig,
    date: daysAgo(n - 1 - i),
  }));
}

function jitterScore(base: number, rng: () => number): number {
  return Math.min(100, Math.max(10, base + Math.floor(rng() * 7) - 3));
}

// ─────────────────────────────────────────────────────────────────────────────
// PROFILE POOLS
// ─────────────────────────────────────────────────────────────────────────────

type RawProfile = Omit<BuyerProfile, "signals"> & { signals: Omit<IntentSignal, "date">[] };

const LR_POOL: RawProfile[] = [
  {
    id: "lr-p01", dashboardId: "land-rover",
    name: "Cameron Whitfield", age: 44, location: "Paradise Valley, AZ",
    occupation: "Commercial Real Estate Developer", avatar: "CW", avatarColor: "#1a6b3c",
    buyerDNA: "Upgrading from a BMW X5 M. Configured Defender 110 in Fuji White with 7-seat option. Checked payoff balance at Chase Auto Finance. Finance-ready.",
    engagementScore: 88,
    signals: [
      { channel: "CTV", action: "Completed ad view", detail: "Watched full 30-sec Defender 110 spot on Hulu — replayed once", strength: "high" },
      { channel: "Google Search", action: "Keyword search", detail: '"Defender 110 vs BMW X5 M towing capacity" and "Land Rover Defender 110 7-seat"', strength: "very-high" },
      { channel: "Website", action: "Configurator", detail: "Built Defender 110 in Fuji White with 7-seat option and tow package — 14 min session", strength: "very-high" },
      { channel: "3rd-Party Data", action: "Financial site visit", detail: "Visited Chase Auto Finance — checked BMW X5 M payoff balance ($58,200)", strength: "very-high" },
      { channel: "Meta", action: "Ad engagement", detail: "Clicked Defender 110 family adventure Instagram ad — saved post", strength: "high" },
      { channel: "Website", action: "Return visit", detail: "Returned to configurator — added Xenon Pearl paint and tow package. Viewed finance calculator.", strength: "very-high" },
      { channel: "3rd-Party Data", action: "Accessory research", detail: "Browsed Defender 110 roof tent ($3,400), ARB dual air compressor ($680), and Warn winch kit ($1,950)", strength: "high" },
      { channel: "Email", action: "Opened + clicked", detail: "Opened 'Current Defender 110 Inventory' email — clicked through to in-stock units page", strength: "very-high" },
    ],
    purchaseWindows: [
      { window: "7 days", probability: 62, reasoning: "Finance site visits + configurator completion + email click = someone who has mentally bought." },
      { window: "30 days", probability: 87, reasoning: "BMW payoff research signals active preparation to trade. Will transact within the month." },
      { window: "6 months", probability: 97, reasoning: "High-income buyer with clear upgrade intent." },
    ],
    personalizedMessage: {
      subject: "Cameron — your Fuji White Defender 110 with 7-seat config is in stock",
      body: "Cameron, we noticed you configured a Fuji White Defender 110 with the 7-seat option and tow package — and we happen to have that exact spec in stock right now. We can also take your BMW X5 M on trade and structure a deal that makes the monthly work.",
    },
    mediaRecommendations: [
      { channel: "Email (Personal Outreach)", allocation: 35, tactic: "Personalized email referencing his exact configuration. Mention in-stock unit and trade-in offer.", color: "#1a6b3c" },
      { channel: "CTV Retargeting", allocation: 28, tactic: "Serve Defender 110 family adventure creative on Hulu and Peacock. Target Paradise Valley, male 40-50.", color: "#7c3aed" },
      { channel: "Google Retargeting", allocation: 20, tactic: "Retarget on configurator exit. Bid on 'Defender 110 in stock Scottsdale'.", color: "#2563eb" },
      { channel: "Meta (Retargeting)", allocation: 12, tactic: "Retarget with in-stock unit photo + 'Your configuration is ready' CTA.", color: "#1877f2" },
      { channel: "Direct Mail", allocation: 5, tactic: "Premium postcard showing Fuji White Defender 110 with tow package.", color: "#f59e0b" },
    ],
    tags: ["Defender 110", "BMW Conquest", "7-Seat", "Finance Ready", "High Intent"],
    journeySummary: "Cameron has configured his exact Defender 110, checked his BMW payoff, and clicked through an inventory email. He is a 7-day close.",
  },
  {
    id: "lr-p02", dashboardId: "land-rover",
    name: "Natalie Osei", age: 38, location: "Scottsdale, AZ",
    occupation: "Pediatric Surgeon", avatar: "NO", avatarColor: "#0f766e",
    buyerDNA: "Comparing Range Rover Sport vs. Defender 130 for a growing family. Safety-focused. Visited IIHS and NHTSA rating pages. Saved two CPO units. Checked CPO financing rates.",
    engagementScore: 74,
    signals: [
      { channel: "CTV", action: "Completed ad view", detail: "Watched full Range Rover Sport safety ad on Peacock — searched brand immediately after", strength: "high" },
      { channel: "Google Search", action: "Keyword search", detail: '"Range Rover Sport safety rating 2025" and "Defender 130 IIHS crash test"', strength: "very-high" },
      { channel: "Website", action: "Page visit", detail: "Range Rover Sport and Defender 130 comparison page — spent 18 min. Viewed CPO inventory.", strength: "very-high" },
      { channel: "3rd-Party Data", action: "Research visit", detail: "Visited IIHS.org and NHTSA.gov — checked 5-star ratings and side-impact scores for both models", strength: "very-high" },
      { channel: "Email", action: "Opened", detail: "Opened 'Certified Pre-Owned Range Rover Sport — Save $18K' email — opened twice", strength: "medium" },
      { channel: "Meta", action: "Ad engagement", detail: "Clicked on Range Rover Sport family safety Instagram ad — visited CPO inventory page", strength: "high" },
      { channel: "Website", action: "Return visit", detail: "Returned to CPO inventory — viewed two specific 2024 Range Rover Sport HSE units. Saved both.", strength: "very-high" },
      { channel: "3rd-Party Data", action: "Financial site visit", detail: "Visited Land Rover Financial Services CPO financing page — checked 60-month rate for $85K vehicle", strength: "very-high" },
    ],
    purchaseWindows: [
      { window: "7 days", probability: 44, reasoning: "CPO financing research + two saved units = someone very close to a decision." },
      { window: "30 days", probability: 78, reasoning: "Safety-focused buyer with a clear shortlist. Will buy within the month." },
      { window: "6 months", probability: 94, reasoning: "Family is growing and she is actively replacing her current vehicle." },
    ],
    personalizedMessage: {
      subject: "Natalie — the two Range Rover Sport CPO units you saved are still available",
      body: "Natalie, we noticed you saved two 2024 Range Rover Sport HSE units from our CPO inventory. Both are still available and both scored 5-star NHTSA ratings. Want to come in for a test drive this week?",
    },
    mediaRecommendations: [
      { channel: "Email (CPO Offer)", allocation: 38, tactic: "Reference her two saved CPO units by VIN. Lead with safety credentials and $18K savings.", color: "#0f766e" },
      { channel: "CTV Retargeting", allocation: 25, tactic: "Serve Range Rover Sport family/safety creative on Peacock and Hulu. Target Scottsdale, female 35-45.", color: "#7c3aed" },
      { channel: "Google Retargeting", allocation: 20, tactic: "Retarget on CPO inventory exit. Bid on 'Range Rover Sport CPO Scottsdale'.", color: "#2563eb" },
      { channel: "Meta (Retargeting)", allocation: 12, tactic: "Retarget with CPO unit photos + '5-Star Safety + $18K Savings' messaging.", color: "#1877f2" },
      { channel: "Direct Mail", allocation: 5, tactic: "Premium CPO offer mailer with IIHS safety badge and her two saved unit specs.", color: "#f59e0b" },
    ],
    tags: ["Range Rover Sport", "CPO", "Safety Buyer", "Family", "Finance Research"],
    journeySummary: "Natalie is a safety-first family buyer who has saved two CPO Range Rover Sport units and checked financing rates. A personal outreach referencing her saved units will convert her.",
  },
  {
    id: "lr-p03", dashboardId: "land-rover",
    name: "Troy Abernathy", age: 31, location: "Tempe, AZ",
    occupation: "Software Engineering Manager", avatar: "TA", avatarColor: "#1d4ed8",
    buyerDNA: "First-time luxury SUV buyer. Currently leasing a Toyota 4Runner. Researching Defender 90 for weekend overlanding. Checked 4Runner trade-in value on Carvana.",
    engagementScore: 58,
    signals: [
      { channel: "CTV", action: "Partial view", detail: "Watched 22 sec of Defender 90 adventure ad on Tubi — paused at off-road sequence", strength: "medium" },
      { channel: "Google Search", action: "Keyword search", detail: '"Defender 90 vs 4Runner TRD Pro overlanding" and "Defender 90 lift kit options"', strength: "high" },
      { channel: "Website", action: "Page visit", detail: "Accessories page — spent 11 min on Defender 90 roof rack, skid plate, and snorkel options", strength: "high" },
      { channel: "Reddit", action: "Forum activity", detail: 'r/overlanding: "Thinking about trading my 4Runner for a Defender 90 — worth the premium?" — 47 upvotes', strength: "high" },
      { channel: "Meta", action: "Ad engagement", detail: "Clicked on Defender 90 build-your-own Instagram ad — visited configurator", strength: "medium" },
      { channel: "Website", action: "Return visit", detail: "Viewed lease deals page — Defender 90 from $879/mo. Visited 'Current Offers' three times.", strength: "very-high" },
      { channel: "3rd-Party Data", action: "Financial site visit", detail: "Visited Carvana to check 4Runner TRD Pro trade-in value ($31,200 estimate)", strength: "very-high" },
    ],
    purchaseWindows: [
      { window: "7 days", probability: 14, reasoning: "Lease pricing research and trade-in check are early-stage signals." },
      { window: "30 days", probability: 41, reasoning: "Accessories research + lease pricing + trade-in check = mentally moving toward a Defender." },
      { window: "6 months", probability: 79, reasoning: "Strong brand affinity and clear upgrade intent. 4Runner lease likely ends in this window." },
    ],
    personalizedMessage: {
      subject: "Troy — Defender 90 lease from $879/mo + we'll cover your 4Runner pull-ahead",
      body: "Troy, we saw you checking out Defender 90 lease options and the accessories lineup. We're running a lease pull-ahead program that can get you out of your 4Runner early with no penalty and into a Defender 90 from $879/mo.",
    },
    mediaRecommendations: [
      { channel: "CTV Retargeting", allocation: 30, tactic: "Serve Defender 90 adventure/overlanding creative on Tubi and Pluto TV.", color: "#7c3aed" },
      { channel: "Meta (Retargeting)", allocation: 26, tactic: "Retarget with Defender 90 accessories carousel + 'Lease from $879' CTA.", color: "#1877f2" },
      { channel: "Google Retargeting", allocation: 22, tactic: "Bid on 'Defender 90 lease AZ', 'Defender 90 vs 4Runner'.", color: "#2563eb" },
      { channel: "Email (Nurture)", allocation: 14, tactic: "Accessories inspiration email + lease pull-ahead offer.", color: "#0f766e" },
      { channel: "QR Code Activation", allocation: 8, tactic: "Target Tempe zip codes with a postcard showing a kitted-out Defender 90.", color: "#f59e0b" },
    ],
    tags: ["Defender 90", "Accessories", "Lease", "Toyota Conquest", "Overlanding"],
    journeySummary: "Troy is a first-time luxury buyer currently leasing a 4Runner. He is deep in accessories research and has checked his trade-in value. A lease pull-ahead offer is his conversion path.",
  },
  {
    id: "lr-p04", dashboardId: "land-rover",
    name: "Stephanie Harmon", age: 47, location: "North Scottsdale, AZ",
    occupation: "Chief Marketing Officer, Healthcare System", avatar: "SH", avatarColor: "#9333ea",
    buyerDNA: "Trading in a 2022 Volvo XC90. Wants Range Rover Velar for daily commute. Visited dealership website 4 times. Opened 3 emails. Requested a brochure.",
    engagementScore: 71,
    signals: [
      { channel: "CTV", action: "Completed ad view", detail: "Watched Range Rover Velar lifestyle spot on Hulu — saved to watchlist", strength: "high" },
      { channel: "Google Search", action: "Keyword search", detail: '"Range Rover Velar vs Volvo XC90 2026" and "Range Rover Velar lease North Scottsdale"', strength: "very-high" },
      { channel: "Website", action: "Page visit", detail: "Range Rover Velar gallery and configurator — built in Santorini Black with Ebony interior, 14 min", strength: "very-high" },
      { channel: "Email", action: "Opened + clicked", detail: "Opened 'Range Rover Velar — Now Leasing from $799/mo' email — clicked to inventory page", strength: "very-high" },
      { channel: "3rd-Party Data", action: "Financial site visit", detail: "Visited Volvo Financial Services — checked XC90 trade-in/payoff value ($41,800 residual)", strength: "very-high" },
      { channel: "Website", action: "Brochure request", detail: "Submitted brochure request form for Range Rover Velar P250 — provided email and phone", strength: "very-high" },
    ],
    purchaseWindows: [
      { window: "7 days", probability: 58, reasoning: "Brochure request + Volvo payoff check + email click = someone preparing to transact." },
      { window: "30 days", probability: 82, reasoning: "XC90 trade-in research signals she is actively preparing. Will transact within the month." },
      { window: "6 months", probability: 96, reasoning: "High-income professional with clear upgrade intent." },
    ],
    personalizedMessage: {
      subject: "Stephanie — your Santorini Black Velar P250 is ready for a test drive",
      body: "Stephanie, thank you for requesting the Velar brochure. We have a Santorini Black P250 on the lot right now — the exact spec you configured. We can also take your XC90 on trade. Want to come in this week?",
    },
    mediaRecommendations: [
      { channel: "Personal Outreach (Phone)", allocation: 40, tactic: "Call from sales rep referencing her brochure request and exact configuration.", color: "#9333ea" },
      { channel: "Email (Inventory)", allocation: 30, tactic: "Personalized email with in-stock Santorini Black Velar photo + trade-in offer.", color: "#7c3aed" },
      { channel: "CTV Retargeting", allocation: 20, tactic: "Serve Velar lifestyle creative on Hulu. Target North Scottsdale, female 43-53.", color: "#1877f2" },
      { channel: "Direct Mail", allocation: 10, tactic: "Premium postcard with her configured color + personal note from sales manager.", color: "#f59e0b" },
    ],
    tags: ["Range Rover Velar", "Volvo Conquest", "Brochure Request", "High Intent", "Lease Buyer"],
    journeySummary: "Stephanie has submitted a brochure request, configured her exact spec, and checked her Volvo trade-in value. A personal outreach call will close her within 7 days.",
  },
  {
    id: "lr-p05", dashboardId: "land-rover",
    name: "Marcus Delgado", age: 53, location: "Fountain Hills, AZ",
    occupation: "Orthopedic Surgeon, Private Practice", avatar: "MD", avatarColor: "#b45309",
    buyerDNA: "Cash buyer. Wants a Defender 130 for family road trips. Visited the dealership once. Comparing to a Suburban High Country. Researching towing capacity and 3rd-row comfort.",
    engagementScore: 65,
    signals: [
      { channel: "CTV", action: "Completed ad view", detail: "Watched Defender 130 family road trip spot on Peacock — searched brand next morning", strength: "high" },
      { channel: "Google Search", action: "Keyword search", detail: '"Defender 130 vs Suburban High Country towing" and "Defender 130 3rd row legroom"', strength: "very-high" },
      { channel: "Website", action: "Page visit", detail: "Defender 130 specs and seating page — spent 16 min. Compared towing specs to Suburban.", strength: "high" },
      { channel: "Dealership", action: "In-person visit", detail: "Walked in unannounced — test drove a Defender 130 X. Spent 90 min with sales rep.", strength: "very-high" },
      { channel: "3rd-Party Data", action: "Research visit", detail: "Visited Chevy.com — compared Suburban High Country MSRP ($78,400) to Defender 130 ($95,200)", strength: "high" },
      { channel: "Email", action: "Opened", detail: "Opened 'Defender 130 — Built for Every Adventure' email — did not click but opened twice", strength: "medium" },
    ],
    purchaseWindows: [
      { window: "7 days", probability: 32, reasoning: "In-person test drive is a strong signal but he is still comparing to the Suburban. A follow-up call from the sales rep who met him will accelerate." },
      { window: "30 days", probability: 67, reasoning: "Cash buyer who has test driven. Price comparison research signals he is close to a decision." },
      { window: "6 months", probability: 91, reasoning: "High-income cash buyer with clear family vehicle need. Will purchase within this window." },
    ],
    personalizedMessage: {
      subject: "Marcus — great meeting you last week. The Defender 130 X is still available.",
      body: "Marcus, it was great meeting you last week. The Defender 130 X you drove is still on the lot. I wanted to follow up personally — we can structure a cash deal that makes the premium over the Suburban feel like the obvious choice. Want to come back in this week?",
    },
    mediaRecommendations: [
      { channel: "Personal Outreach (Phone)", allocation: 45, tactic: "Sales rep who met him calls personally. Reference the test drive and Suburban comparison.", color: "#b45309" },
      { channel: "Email (Follow-Up)", allocation: 30, tactic: "Personal follow-up email from sales rep. Reference his test drive and the Defender 130 X availability.", color: "#7c3aed" },
      { channel: "CTV Retargeting", allocation: 15, tactic: "Serve Defender 130 family road trip creative on Peacock. Target Fountain Hills, male 48-58.", color: "#1877f2" },
      { channel: "Direct Mail", allocation: 10, tactic: "Premium Defender 130 X spec sheet with a handwritten note from the sales rep.", color: "#f59e0b" },
    ],
    tags: ["Defender 130", "Chevy Conquest", "In-Person Visit", "Cash Buyer", "Family Vehicle"],
    journeySummary: "Marcus test drove a Defender 130 X and is comparing to a Suburban High Country. A personal follow-up from the sales rep who met him will close this within 30 days.",
  },
  {
    id: "lr-p06", dashboardId: "land-rover",
    name: "Jennifer Castillo", age: 41, location: "Chandler, AZ",
    occupation: "VP of Operations, Logistics Company", avatar: "JC", avatarColor: "#0ea5e9",
    buyerDNA: "Leasing a 2024 Mercedes GLE. Wants a Range Rover Sport HSE for the school run and weekend trips. Visited the website 6 times. Opened every email. Has not called yet.",
    engagementScore: 79,
    signals: [
      { channel: "CTV", action: "Completed ad view", detail: "Watched Range Rover Sport 'Above and Beyond' spot on Hulu — searched brand immediately", strength: "high" },
      { channel: "Google Search", action: "Keyword search", detail: '"Range Rover Sport HSE vs Mercedes GLE 450" and "Range Rover Sport lease Scottsdale"', strength: "very-high" },
      { channel: "Website", action: "Page visit", detail: "Range Rover Sport HSE configurator — built in Carpathian Grey with Ebony interior, 12 min", strength: "very-high" },
      { channel: "Email", action: "Opened + clicked", detail: "Opened 'Range Rover Sport — Lease from $1,099/mo' email — clicked to inventory page", strength: "very-high" },
      { channel: "3rd-Party Data", action: "Financial site visit", detail: "Visited Mercedes Financial Services — checked GLE 450 lease payoff and early termination fee ($2,800)", strength: "very-high" },
      { channel: "Website", action: "Return visit", detail: "Returned to inventory page — viewed 4 in-stock Range Rover Sport HSE units. Saved two.", strength: "very-high" },
      { channel: "Email", action: "Opened", detail: "Opened 'Your saved Range Rover Sport units are still available' email — opened 3 times", strength: "high" },
    ],
    purchaseWindows: [
      { window: "7 days", probability: 51, reasoning: "Saved two inventory units + Mercedes payoff check + repeated email opens = someone very close. A personal call will close this." },
      { window: "30 days", probability: 84, reasoning: "Mercedes lease early termination research signals she is actively preparing to switch." },
      { window: "6 months", probability: 97, reasoning: "High-income professional with clear upgrade intent and an active lease she wants out of." },
    ],
    personalizedMessage: {
      subject: "Jennifer — the two Range Rover Sport HSE units you saved are still available",
      body: "Jennifer, we noticed you saved two Range Rover Sport HSE units from our inventory. Both are still available. We can also help you out of your GLE lease early — the $2,800 early termination fee is something we can work into the deal. Want to come in this week?",
    },
    mediaRecommendations: [
      { channel: "Email (Personal Outreach)", allocation: 38, tactic: "Reference her two saved units and GLE lease situation. Offer to cover early termination.", color: "#0ea5e9" },
      { channel: "CTV Retargeting", allocation: 25, tactic: "Serve Range Rover Sport lifestyle creative on Hulu. Target Chandler, female 37-47.", color: "#7c3aed" },
      { channel: "Google Retargeting", allocation: 20, tactic: "Retarget on inventory page exit. Bid on 'Range Rover Sport lease Scottsdale'.", color: "#2563eb" },
      { channel: "Meta (Retargeting)", allocation: 12, tactic: "Retarget with her two saved unit photos + 'Your Range Rover is waiting' CTA.", color: "#1877f2" },
      { channel: "Direct Mail", allocation: 5, tactic: "Premium postcard with Carpathian Grey Range Rover Sport + early termination offer.", color: "#f59e0b" },
    ],
    tags: ["Range Rover Sport", "Mercedes Conquest", "Saved Units", "Lease Buyer", "High Intent"],
    journeySummary: "Jennifer has saved two inventory units, checked her Mercedes lease payoff, and opened every email. A personal call referencing her saved units and the early termination offer will close her.",
  },
];

const LAMBO_POOL: RawProfile[] = [
  {
    id: "lb-p01", dashboardId: "lamborghini",
    name: "Preston Hargrove", age: 52, location: "Paradise Valley, AZ",
    occupation: "Private Equity Managing Partner", avatar: "PH", avatarColor: "#d4a017",
    buyerDNA: "Confirmed buyer. Called the dealership twice. Wants Urus S in Nero Noctis with full Senso interior. Comparing delivery timeline vs. Porsche Cayenne Turbo GT availability.",
    engagementScore: 96,
    signals: [
      { channel: "CTV", action: "Completed ad view", detail: "Watched full 60-sec Urus S launch film on YouTube Premium — shared to his assistant", strength: "very-high" },
      { channel: "Google Search", action: "Keyword search", detail: '"Urus S Nero Noctis in stock Arizona" and "Lamborghini Scottsdale delivery time 2026"', strength: "very-high" },
      { channel: "Website", action: "Configurator", detail: "Built Urus S in Nero Noctis with Senso full leather, Alcantara headliner, carbon package — 22 min", strength: "very-high" },
      { channel: "Phone", action: "Inbound call", detail: "Called dealership — asked about current Urus S inventory and allocation. Spoke 8 min.", strength: "very-high" },
      { channel: "3rd-Party Data", action: "Financial site visit", detail: "Visited Lamborghini Financial Services and JP Morgan Private Bank auto lending page", strength: "very-high" },
      { channel: "Website", action: "Return visit", detail: "Added Senso Tricolore stitching ($4,200) and transparent engine hood ($8,800). Printed spec sheet.", strength: "very-high" },
      { channel: "Phone", action: "Second inbound call", detail: "Called again — asked about ADM and whether allocation could be secured this week.", strength: "very-high" },
      { channel: "3rd-Party Data", action: "Accessory research", detail: "Browsed carbon fiber side skirts ($14,200), Pirelli P Zero Corsa upgrade ($6,800), Novitec exhaust ($18,500)", strength: "high" },
    ],
    purchaseWindows: [
      { window: "7 days", probability: 89, reasoning: "Two inbound calls + full configuration + financing research = confirmed buyer." },
      { window: "30 days", probability: 97, reasoning: "He will buy this month. The only variable is whether it is from this dealership or a competitor." },
      { window: "6 months", probability: 99, reasoning: "High-net-worth repeat luxury buyer. Will purchase regardless." },
    ],
    personalizedMessage: {
      subject: "Preston — we secured your Nero Noctis Urus S allocation",
      body: "Preston, I wanted to reach out personally to let you know we have secured an allocation for the Urus S in Nero Noctis with the Senso interior package you configured. I'd like to invite you in for a private viewing this week — just you, no other clients.",
    },
    mediaRecommendations: [
      { channel: "Personal Outreach (Phone)", allocation: 45, tactic: "Dealership principal calls Preston directly. Reference his two inbound calls and exact configuration.", color: "#d4a017" },
      { channel: "Email (Allocation)", allocation: 30, tactic: "Personalized email with allocation confirmation and private viewing invitation.", color: "#9333ea" },
      { channel: "CTV (Exclusivity)", allocation: 15, tactic: "Serve Urus S 'Ownership Experience' creative on YouTube Premium. Target Paradise Valley, male 48-58.", color: "#7c3aed" },
      { channel: "Direct Mail (Premium)", allocation: 10, tactic: "Hand-delivered spec sheet in Lamborghini branded folder with personal note from GM.", color: "#f59e0b" },
    ],
    tags: ["Urus S", "Nero Noctis", "Allocation", "Inbound Caller", "Immediate Close", "HNW Buyer"],
    journeySummary: "Preston has called the dealership twice, completed a full Urus S configuration, and researched financing. He is a confirmed buyer.",
  },
  {
    id: "lb-p02", dashboardId: "lamborghini",
    name: "Alexis Fontaine", age: 34, location: "Scottsdale, AZ",
    occupation: "Founder & CEO, SaaS Company (Post-Exit)", avatar: "AF", avatarColor: "#7c3aed",
    buyerDNA: "First Lamborghini buyer. Post-exit founder. Researching Huracán Sterrato. DM'd the dealership on Instagram asking about a test drive. Configured in Arancio Borealis.",
    engagementScore: 79,
    signals: [
      { channel: "Instagram", action: "Ad engagement", detail: "Clicked on Huracán Sterrato desert adventure reel — watched twice, saved, commented 'this is the one'", strength: "very-high" },
      { channel: "Google Search", action: "Keyword search", detail: '"Huracán Sterrato review 2026" and "Lamborghini Scottsdale Sterrato in stock"', strength: "very-high" },
      { channel: "Website", action: "Page visit", detail: "Huracán Sterrato specs and gallery — spent 19 min. Focused on Arancio Borealis (orange).", strength: "very-high" },
      { channel: "YouTube", action: "Video view", detail: "Watched Doug DeMuro Huracán Sterrato review (full 28 min) and Motor Trend track test", strength: "high" },
      { channel: "3rd-Party Data", action: "Financial site visit", detail: "Visited Lamborghini Financial Services — checked 48-month financing rate for $280K vehicle", strength: "very-high" },
      { channel: "Website", action: "Configurator", detail: "Built Sterrato in Arancio Borealis with Nero Ade interior and exposed carbon fiber package", strength: "very-high" },
      { channel: "Instagram", action: "Organic activity", detail: "Followed @lamborghiniofscottsdale and DM'd asking about test drive availability", strength: "very-high" },
    ],
    purchaseWindows: [
      { window: "7 days", probability: 71, reasoning: "Instagram DM about test drive + full configuration + financing research = buyer who has committed mentally." },
      { window: "30 days", probability: 91, reasoning: "Post-exit founder with liquidity and clear intent. Will buy within the month." },
      { window: "6 months", probability: 98, reasoning: "First Lamborghini buyer who has done full research and is emotionally committed." },
    ],
    personalizedMessage: {
      subject: "Alexis — your Arancio Borealis Sterrato test drive is ready",
      body: "Alexis, we saw your DM and we have a Huracán Sterrato in Arancio Borealis available for a private test drive this week. No other clients, no time pressure. Just you and the car.",
    },
    mediaRecommendations: [
      { channel: "Instagram (DM Response)", allocation: 40, tactic: "Respond to her DM personally. Offer a private test drive with specific date options.", color: "#e1306c" },
      { channel: "Email (Experience)", allocation: 28, tactic: "Private test drive invitation with Arancio Borealis Sterrato photo.", color: "#9333ea" },
      { channel: "CTV (Lifestyle)", allocation: 18, tactic: "Serve Sterrato desert adventure creative on YouTube Premium and Hulu.", color: "#7c3aed" },
      { channel: "Meta (Retargeting)", allocation: 10, tactic: "Retarget with her configured color + 'Your Sterrato is waiting' CTA.", color: "#1877f2" },
      { channel: "Google Retargeting", allocation: 4, tactic: "Bid on 'Huracán Sterrato Scottsdale', 'Lamborghini test drive AZ'.", color: "#2563eb" },
    ],
    tags: ["Huracán Sterrato", "First Lambo", "Post-Exit Founder", "Instagram Active", "Test Drive Ready"],
    journeySummary: "Alexis is a first-time Lamborghini buyer who has DM'd the dealership asking about a test drive. A private, experience-first test drive will close her.",
  },
  {
    id: "lb-p03", dashboardId: "lamborghini",
    name: "Diane Castellano", age: 58, location: "Fountain Hills, AZ",
    occupation: "Retired Orthopedic Surgeon", avatar: "DC", avatarColor: "#b45309",
    buyerDNA: "Repeat luxury buyer. Currently owns a Porsche Taycan Turbo S. Comparing Urus Performante to Cayenne Turbo GT. Performance-driven. Clicked on a track day invitation email.",
    engagementScore: 67,
    signals: [
      { channel: "CTV", action: "Completed ad view", detail: "Watched full Urus Performante performance ad on Hulu — searched brand immediately after", strength: "high" },
      { channel: "Google Search", action: "Keyword search", detail: '"Urus Performante 0-60 vs Cayenne Turbo GT" and "Lamborghini track experience Arizona"', strength: "very-high" },
      { channel: "Website", action: "Page visit", detail: "Urus Performante specs page — compared to Cayenne Turbo GT side-by-side for 12 min", strength: "high" },
      { channel: "3rd-Party Data", action: "Financial site visit", detail: "Visited Porsche Financial Services — checked Taycan Turbo S payoff/trade-in value ($142K residual)", strength: "very-high" },
      { channel: "Meta", action: "Ad engagement", detail: "Clicked on Urus Performante track day invitation ad — visited events page", strength: "high" },
      { channel: "Website", action: "Configurator", detail: "Built Urus Performante in Grigio Telesto with carbon fiber package — 9 min", strength: "very-high" },
      { channel: "Email", action: "Opened + clicked", detail: "Opened 'Private Urus Performante Track Experience' invitation — clicked through to RSVP page", strength: "very-high" },
    ],
    purchaseWindows: [
      { window: "7 days", probability: 28, reasoning: "Still in comparison mode. A track experience is the conversion trigger." },
      { window: "30 days", probability: 58, reasoning: "Configurator use + trade-in research + track event click = warming up fast." },
      { window: "6 months", probability: 86, reasoning: "She will upgrade from the Taycan — the experience determines the outcome." },
    ],
    personalizedMessage: {
      subject: "Diane — a private Urus Performante track experience, just for you",
      body: "Diane, we'd like to invite you to an exclusive private driving experience at Scottsdale Performance Driving School — just you and a Lamborghini Urus Performante on a closed course. No sales pressure. Just 45 minutes to feel the difference.",
    },
    mediaRecommendations: [
      { channel: "Email (Track Invitation)", allocation: 35, tactic: "Private track day invitation — personalized, from the dealership principal.", color: "#b45309" },
      { channel: "CTV (Performance)", allocation: 28, tactic: "Serve Urus Performante track creative on Hulu premium. Target Fountain Hills, female 52-62.", color: "#7c3aed" },
      { channel: "Meta (Retargeting)", allocation: 20, tactic: "Retarget with Urus Performante performance specs carousel.", color: "#1877f2" },
      { channel: "Google (Conquest)", allocation: 12, tactic: "Bid on 'Urus Performante vs Cayenne Turbo GT', 'Lamborghini track day Scottsdale'.", color: "#2563eb" },
      { channel: "Direct Mail", allocation: 5, tactic: "Premium postcard with Urus Performante in Grigio Telesto + private track event QR code.", color: "#f59e0b" },
    ],
    tags: ["Urus Performante", "Porsche Conquest", "Performance Buyer", "Track Experience", "Repeat Luxury"],
    journeySummary: "Diane is a repeat luxury buyer comparing the Urus Performante to her Taycan Turbo S. A private track experience will convert her.",
  },
  {
    id: "lb-p04", dashboardId: "lamborghini",
    name: "Victor Harmon", age: 45, location: "Scottsdale, AZ",
    occupation: "Real Estate Developer", avatar: "VH", avatarColor: "#16a34a",
    buyerDNA: "Repeat Lamborghini owner. Currently has a 2023 Huracán EVO. Wants to add a Urus S as a second vehicle. Visited the dealership once. Cash buyer. Wants delivery this month.",
    engagementScore: 91,
    signals: [
      { channel: "CTV", action: "Completed ad view", detail: "Watched Urus S 'Everyday Supercar' spot on YouTube Premium — called the dealership same day", strength: "very-high" },
      { channel: "Phone", action: "Inbound call", detail: "Called dealership — confirmed he already owns a Huracán EVO and wants to add a Urus S. Spoke 12 min.", strength: "very-high" },
      { channel: "Website", action: "Configurator", detail: "Built Urus S in Verde Mantis with Nero Ade interior and full Senso package — 18 min", strength: "very-high" },
      { channel: "Dealership", action: "In-person visit", detail: "Came in for a test drive — drove a Verde Mantis Urus S. Spent 2 hours with sales manager.", strength: "very-high" },
      { channel: "3rd-Party Data", action: "Financial site visit", detail: "Visited Lamborghini Financial Services — confirmed cash purchase preference, no financing needed", strength: "very-high" },
      { channel: "Email", action: "Opened + clicked", detail: "Opened 'Verde Mantis Urus S — Allocation Available' email — clicked to inventory page", strength: "very-high" },
    ],
    purchaseWindows: [
      { window: "7 days", probability: 84, reasoning: "Repeat owner who test drove, confirmed cash purchase, and clicked on an allocation email. Needs a delivery date." },
      { window: "30 days", probability: 96, reasoning: "He will buy this month. The only variable is allocation timing." },
      { window: "6 months", probability: 99, reasoning: "Confirmed repeat Lamborghini buyer." },
    ],
    personalizedMessage: {
      subject: "Victor — Verde Mantis Urus S allocation confirmed. Ready when you are.",
      body: "Victor, great to see you last week. I wanted to let you know we have a Verde Mantis Urus S allocation confirmed and ready for delivery. As a cash transaction, we can have the paperwork done in under an hour. What day works for you?",
    },
    mediaRecommendations: [
      { channel: "Personal Outreach (Phone)", allocation: 50, tactic: "Sales manager calls Victor directly. Reference his test drive and confirm allocation and delivery date.", color: "#16a34a" },
      { channel: "Email (Delivery)", allocation: 35, tactic: "Allocation confirmation email with delivery timeline and paperwork preview.", color: "#9333ea" },
      { channel: "Direct Mail", allocation: 15, tactic: "Hand-delivered Verde Mantis Urus S spec sheet with a personal note from the GM.", color: "#f59e0b" },
    ],
    tags: ["Urus S", "Verde Mantis", "Repeat Owner", "Cash Buyer", "In-Person Visit", "Immediate Close"],
    journeySummary: "Victor is a repeat Lamborghini owner who test drove a Urus S and confirmed a cash purchase. A delivery date confirmation will close him immediately.",
  },
  {
    id: "lb-p05", dashboardId: "lamborghini",
    name: "Rachel Yuen", age: 39, location: "Paradise Valley, AZ",
    occupation: "Plastic Surgeon, Private Practice", avatar: "RY", avatarColor: "#e11d48",
    buyerDNA: "First Lamborghini. Comparing Urus S to a Bentley Bentayga. Attended a dealership event last month. Follows the dealership on Instagram. Wants a female-forward buying experience.",
    engagementScore: 72,
    signals: [
      { channel: "Instagram", action: "Organic activity", detail: "Liked 8 Urus S posts on @lamborghiniofscottsdale — commented on a Bianco Monocerus unit", strength: "high" },
      { channel: "CTV", action: "Completed ad view", detail: "Watched Urus S lifestyle spot on Hulu — searched brand immediately after", strength: "high" },
      { channel: "Google Search", action: "Keyword search", detail: '"Urus S vs Bentley Bentayga 2026" and "Lamborghini Scottsdale women buyers"', strength: "very-high" },
      { channel: "Dealership", action: "Event attendance", detail: "Attended 'Ladies Night at Lamborghini' event — test drove a Urus S. Spoke with sales manager.", strength: "very-high" },
      { channel: "Website", action: "Configurator", detail: "Built Urus S in Bianco Monocerus with Alcantara interior — 11 min", strength: "very-high" },
      { channel: "3rd-Party Data", action: "Financial site visit", detail: "Visited Bentley Financial Services — checked Bentayga lease vs. purchase options", strength: "high" },
    ],
    purchaseWindows: [
      { window: "7 days", probability: 22, reasoning: "Still comparing to Bentayga. Event attendance and configurator use are strong signals but she needs a follow-up experience." },
      { window: "30 days", probability: 61, reasoning: "Event attendee who has configured and researched financing. A private consultation will accelerate." },
      { window: "6 months", probability: 88, reasoning: "First luxury supercar buyer who has done serious research. Will purchase within this window." },
    ],
    personalizedMessage: {
      subject: "Rachel — a private Urus S consultation, just for you",
      body: "Rachel, it was wonderful meeting you at our event last month. I'd like to invite you back for a private consultation — just you and the Bianco Monocerus Urus S you configured. No other clients, no pressure. We can also compare the Urus S and Bentayga side by side so you have all the information you need.",
    },
    mediaRecommendations: [
      { channel: "Email (Private Consultation)", allocation: 38, tactic: "Personal invitation from the female sales consultant who met her at the event.", color: "#e11d48" },
      { channel: "Instagram (Retargeting)", allocation: 28, tactic: "Retarget with Bianco Monocerus Urus S content. 'Your configuration is waiting' messaging.", color: "#e1306c" },
      { channel: "CTV (Lifestyle)", allocation: 20, tactic: "Serve Urus S lifestyle creative on Hulu. Target Paradise Valley, female 35-45.", color: "#7c3aed" },
      { channel: "Meta (Retargeting)", allocation: 10, tactic: "Retarget with Urus S vs. Bentayga comparison content.", color: "#1877f2" },
      { channel: "Direct Mail", allocation: 4, tactic: "Premium postcard with Bianco Monocerus Urus S + private consultation invitation.", color: "#f59e0b" },
    ],
    tags: ["Urus S", "Bianco Monocerus", "Bentley Conquest", "Event Attendee", "First Lambo", "Female Buyer"],
    journeySummary: "Rachel attended a dealership event, test drove a Urus S, and configured her exact spec. A private female-forward consultation will convert her within 30 days.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT: getDailyProfiles
// ─────────────────────────────────────────────────────────────────────────────
type DashboardId = "land-rover" | "lamborghini" | "warby-parker" | "policygenius" | "breeze-insurance" | "barrett-financial";

const POOL_MAP: Record<string, RawProfile[]> = {
  "land-rover": LR_POOL,
  "lamborghini": LAMBO_POOL,
};

/**
 * Returns 3 profiles for the given dashboard, seeded by today's date.
 * The same 3 profiles are returned all day; they rotate at midnight.
 * Dates in signals are shifted to be relative to today.
 */
export function getDailyProfiles(dashboardId: DashboardId): BuyerProfile[] {
  const pool = POOL_MAP[dashboardId];
  if (!pool || pool.length === 0) return [];

  const rng = seedRng(todaySeed(dashboardId));
  const picked = pickN(pool, 3, rng);

  return picked.map(p => ({
    ...p,
    engagementScore: jitterScore(p.engagementScore, rng),
    signals: shiftSignalDates(p.signals as IntentSignal[]),
  }));
}

export { LR_POOL, LAMBO_POOL };
