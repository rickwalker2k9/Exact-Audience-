/**
 * buyerProfiles.ts
 * Individual buyer journey profiles — 3 per dashboard, 12 total.
 * Each profile includes: identity, engagement history, intent signals,
 * predicted purchase windows, personalized messaging, and recommended media mix.
 */

export type IntentSignal = {
  date: string;
  channel: string;
  action: string;
  detail: string;
  strength: "low" | "medium" | "high" | "very-high";
  phase?: "lookback" | "campaign"; // lookback = pre-campaign 30-day window; campaign = active campaign period
};

export type PurchaseWindow = {
  window: "7 days" | "30 days" | "6 months";
  probability: number; // 0-100
  reasoning: string;
};

export type MediaRecommendation = {
  channel: string;
  allocation: number; // percent
  tactic: string;
  color: string;
};

export type BuyerProfile = {
  id: string;
  dashboardId: "land-rover" | "lamborghini" | "warby-parker" | "policygenius" | "mccarty" | "breeze-insurance" | "barrett-financial";
  name: string;
  age: number;
  location: string;
  occupation: string;
  avatar: string; // initials
  avatarColor: string;
  buyerDNA: string; // one-line summary of their buyer DNA
  engagementScore: number; // 0-100
  signals: IntentSignal[];
  purchaseWindows: PurchaseWindow[];
  personalizedMessage: {
    subject: string;
    body: string;
  };
  mediaRecommendations: MediaRecommendation[];
  tags: string[];
  journeySummary: string;
};

// ─────────────────────────────────────────────────────────────────────────────
// LAND ROVER NORTH SCOTTSDALE — 3 PROFILES
// ─────────────────────────────────────────────────────────────────────────────

export const LAND_ROVER_PROFILES: BuyerProfile[] = [
  {
    id: "lr-001",
    dashboardId: "land-rover",
    name: "Cameron Whitfield",
    age: 44,
    location: "Paradise Valley, AZ",
    occupation: "Commercial Real Estate Developer",
    avatar: "CW",
    avatarColor: "#1a6b3c",
    buyerDNA: "Upgrading from a 2023 BMW X5 M. Researching Defender 110 for family + off-road weekend use. Visited three financing sites — ready to transact.",
    engagementScore: 88,
    signals: [
      { date: "Jun 9",  channel: "CTV", action: "Completed ad view", detail: "Watched full 30-sec Defender 110 'Above & Beyond' spot on Hulu — replayed once", strength: "high" },
      { date: "Jun 12", channel: "Google Search", action: "Keyword search", detail: '"Defender 110 vs BMW X5 M towing capacity" and "Land Rover Defender 110 7-seat configuration"', strength: "very-high" },
      { date: "Jun 14", channel: "Website", action: "Page visit", detail: "Defender 110 specs and configurator — built in Fuji White with 7-seat option, spent 14 min", strength: "very-high" },
      { date: "Jun 17", channel: "3rd-Party Data", action: "Financial site visit", detail: "Visited Chase Auto Finance and BMW Financial Services to check X5 M payoff balance ($58,200) — preparing to trade in", strength: "very-high" },
      { date: "Jun 20", channel: "Meta", action: "Ad engagement", detail: "Clicked on Defender 110 family adventure Instagram ad — saved post and visited dealership page", strength: "high" },
      { date: "Jun 23", channel: "Website", action: "Return visit", detail: "Returned to configurator — added Xenon Pearl paint ($1,200) and tow package ($1,800). Viewed finance calculator.", strength: "very-high" },
      { date: "Jun 26", channel: "3rd-Party Data", action: "Accessory research", detail: "Browsed Defender 110 roof tent system ($3,400), ARB dual air compressor ($680), and Warn winch kit ($1,950) on overlanding forums", strength: "high" },
      { date: "Jul 1",  channel: "Email", action: "Opened + clicked", detail: "Opened 'Current Defender 110 Inventory' email — clicked through to in-stock units page", strength: "very-high" },
    ],
    purchaseWindows: [
      { window: "7 days",   probability: 62, reasoning: "Finance site visits + configurator completion + email click = someone who has mentally bought. A personal outreach from the sales team will close this." },
      { window: "30 days",  probability: 87, reasoning: "BMW payoff research signals he is actively preparing to trade. He will transact within the month." },
      { window: "6 months", probability: 97, reasoning: "High-income buyer with clear upgrade intent. Will purchase regardless — the question is whether it is Land Rover or a competitor." },
    ],
    personalizedMessage: {
      subject: "Cameron — your Fuji White Defender 110 with 7-seat config is in stock",
      body: "Cameron, we noticed you configured a Fuji White Defender 110 with the 7-seat option and tow package — and we happen to have that exact spec in stock right now. We can also take your BMW X5 M on trade and structure a deal that makes the monthly work. If you want to come in and see it in person, we will have it pulled up front and ready. No pressure, no pitch — just the keys.",
    },
    mediaRecommendations: [
      { channel: "Email (Personal Outreach)", allocation: 35, tactic: "Personalized email from sales rep referencing his exact configuration. Mention in-stock unit and trade-in offer. Send within 24 hours.", color: "#1a6b3c" },
      { channel: "CTV Retargeting",          allocation: 28, tactic: "Serve Defender 110 family adventure creative on Hulu and Peacock. Target Paradise Valley + Scottsdale, male 40-50, HHI $300K+.", color: "#7c3aed" },
      { channel: "Google Retargeting",       allocation: 20, tactic: "Retarget on configurator exit. Bid on 'Defender 110 in stock Scottsdale', 'Land Rover Defender 7 seat'.", color: "#2563eb" },
      { channel: "Meta (Retargeting)",       allocation: 12, tactic: "Retarget with in-stock unit photo + 'Your configuration is ready' CTA. Target Paradise Valley zip codes.", color: "#1877f2" },
      { channel: "Direct Mail",              allocation: 5,  tactic: "Premium postcard showing Fuji White Defender 110 with tow package + personal note from sales manager.", color: "#f59e0b" },
    ],
    tags: ["Defender 110", "BMW Conquest", "7-Seat", "Tow Package", "Finance Ready", "High Intent"],
    journeySummary: "Cameron has configured his exact Defender 110, checked his BMW payoff, and clicked through an inventory email. He is a 7-day close — a personal outreach referencing his saved configuration will convert him.",
  },
  {
    id: "lr-002",
    dashboardId: "land-rover",
    name: "Natalie Osei",
    age: 38,
    location: "Scottsdale, AZ",
    occupation: "Pediatric Surgeon",
    avatar: "NO",
    avatarColor: "#0f766e",
    buyerDNA: "Comparing Range Rover Sport vs. Defender 130 for a growing family. Safety-focused. Visited IIHS and NHTSA rating pages. CPO buyer candidate.",
    engagementScore: 74,
    signals: [
      { date: "Jun 11", channel: "CTV", action: "Completed ad view", detail: "Watched full Range Rover Sport safety ad on Peacock — searched brand immediately after", strength: "high" },
      { date: "Jun 13", channel: "Google Search", action: "Keyword search", detail: '"Range Rover Sport safety rating 2025" and "Defender 130 IIHS crash test"', strength: "very-high" },
      { date: "Jun 15", channel: "Website", action: "Page visit", detail: "Range Rover Sport and Defender 130 comparison page — spent 18 min. Viewed CPO inventory.", strength: "very-high" },
      { date: "Jun 18", channel: "3rd-Party Data", action: "Research visit", detail: "Visited IIHS.org and NHTSA.gov — checked 5-star ratings and side-impact scores for both models", strength: "very-high" },
      { date: "Jun 22", channel: "Email", action: "Opened", detail: "Opened 'Certified Pre-Owned Range Rover Sport — Save $18K' email — did not click but opened twice", strength: "medium" },
      { date: "Jun 25", channel: "Meta", action: "Ad engagement", detail: "Clicked on Range Rover Sport family safety Instagram ad — visited CPO inventory page", strength: "high" },
      { date: "Jun 28", channel: "Website", action: "Return visit", detail: "Returned to CPO inventory — viewed two specific 2024 Range Rover Sport HSE units. Saved both.", strength: "very-high" },
      { date: "Jul 2",  channel: "3rd-Party Data", action: "Financial site visit", detail: "Visited Land Rover Financial Services CPO financing page — checked 60-month rate for $85K vehicle", strength: "very-high" },
    ],
    purchaseWindows: [
      { window: "7 days",   probability: 44, reasoning: "CPO financing research + two saved units = someone very close to a decision. A CPO test drive appointment offer will accelerate this." },
      { window: "30 days",  probability: 78, reasoning: "Safety-focused buyer with a clear shortlist. She will buy within the month — CPO pricing and a personal consultation are the conversion levers." },
      { window: "6 months", probability: 94, reasoning: "Family is growing and she is actively replacing her current vehicle. High-certainty purchase within this window." },
    ],
    personalizedMessage: {
      subject: "Natalie — the two Range Rover Sport CPO units you saved are still available",
      body: "Natalie, we noticed you saved two 2024 Range Rover Sport HSE units from our CPO inventory. Both are still available. As a CPO vehicle, each comes with the full Land Rover warranty, a 165-point inspection, and roadside assistance — plus you save $18K off new. We know safety is the priority for your family, and both units scored 5-star NHTSA ratings. Want to come in for a test drive this week? We can have both pulled and ready for a side-by-side comparison.",
    },
    mediaRecommendations: [
      { channel: "Email (CPO Offer)",   allocation: 38, tactic: "Reference her two saved CPO units by VIN. Lead with safety credentials and $18K savings. Include a 'Schedule Test Drive' CTA.", color: "#0f766e" },
      { channel: "CTV Retargeting",     allocation: 25, tactic: "Serve Range Rover Sport family/safety creative on Peacock and Hulu. Target Scottsdale, female 35-45, HHI $250K+.", color: "#7c3aed" },
      { channel: "Google Retargeting",  allocation: 20, tactic: "Retarget on CPO inventory exit. Bid on 'Range Rover Sport CPO Scottsdale', 'safest luxury SUV 2024'.", color: "#2563eb" },
      { channel: "Meta (Retargeting)",  allocation: 12, tactic: "Retarget with CPO unit photos + '5-Star Safety + $18K Savings' messaging. Target Scottsdale zip codes.", color: "#1877f2" },
      { channel: "Direct Mail",         allocation: 5,  tactic: "Premium CPO offer mailer with IIHS safety badge and her two saved unit specs.", color: "#f59e0b" },
    ],
    tags: ["Range Rover Sport", "CPO", "Safety Buyer", "Family", "Finance Research", "High Intent"],
    journeySummary: "Natalie is a safety-first family buyer who has saved two CPO Range Rover Sport units and checked financing rates. A personal outreach referencing her saved units and safety credentials is her conversion trigger.",
  },
  {
    id: "lr-003",
    dashboardId: "land-rover",
    name: "Troy Abernathy",
    age: 31,
    location: "Tempe, AZ",
    occupation: "Software Engineering Manager",
    avatar: "TA",
    avatarColor: "#1d4ed8",
    buyerDNA: "First-time luxury SUV buyer. Currently leasing a Toyota 4Runner. Researching Defender 90 for weekend overlanding. Deep in accessories and community forums.",
    engagementScore: 58,
    signals: [
      { date: "Jun 14", channel: "CTV", action: "Partial view", detail: "Watched 22 sec of Defender 90 adventure ad on Tubi — paused at off-road sequence", strength: "medium" },
      { date: "Jun 17", channel: "Google Search", action: "Keyword search", detail: '"Defender 90 vs 4Runner TRD Pro overlanding" and "Defender 90 lift kit options"', strength: "high" },
      { date: "Jun 19", channel: "Website", action: "Page visit", detail: "Accessories page — spent 11 min on Defender 90 roof rack, skid plate, and snorkel options", strength: "high" },
      { date: "Jun 22", channel: "Reddit", action: "Forum activity", detail: 'r/overlanding: "Thinking about trading my 4Runner for a Defender 90 — worth the premium?" — 47 upvotes', strength: "high" },
      { date: "Jun 25", channel: "Meta", action: "Ad engagement", detail: "Clicked on Defender 90 build-your-own Instagram ad — visited configurator", strength: "medium" },
      { date: "Jun 29", channel: "Website", action: "Return visit", detail: "Viewed lease deals page — Defender 90 from $879/mo. Visited 'Current Offers' three times.", strength: "very-high" },
      { date: "Jul 3",  channel: "3rd-Party Data", action: "Financial site visit", detail: "Visited Carvana to check 4Runner TRD Pro trade-in value ($31,200 estimate)", strength: "very-high" },
    ],
    purchaseWindows: [
      { window: "7 days",   probability: 14, reasoning: "Lease pricing research and trade-in check are early-stage signals. He is comparing options and his 4Runner lease may not be up yet." },
      { window: "30 days",  probability: 41, reasoning: "Accessories research + lease pricing + trade-in check = someone mentally moving toward a Defender. A lease pull-ahead offer with an accessories hook could accelerate." },
      { window: "6 months", probability: 79, reasoning: "Strong brand affinity, overlanding community validation, and clear upgrade intent. His 4Runner lease likely ends in this window." },
    ],
    personalizedMessage: {
      subject: "Troy — Defender 90 lease from $879/mo + we'll cover your 4Runner pull-ahead",
      body: "Troy, we saw you checking out Defender 90 lease options and the accessories lineup — the 90 with a roof rack and skid plate is one of the best overlanding setups we build. We're running a lease pull-ahead program that can get you out of your 4Runner early with no penalty and into a Defender 90 from $879/mo. Come by and we'll build your spec together — or just take one out on the 101 and see how it feels.",
    },
    mediaRecommendations: [
      { channel: "CTV Retargeting",    allocation: 30, tactic: "Serve Defender 90 adventure/overlanding creative on Tubi and Pluto TV. 15-sec 'Built for More' spot with accessories focus.", color: "#7c3aed" },
      { channel: "Meta (Retargeting)", allocation: 26, tactic: "Retarget with Defender 90 accessories carousel + 'Lease from $879' CTA. Target Tempe + Chandler zip codes, age 28-36.", color: "#1877f2" },
      { channel: "Google Retargeting", allocation: 22, tactic: "Bid on 'Defender 90 lease AZ', 'Defender 90 vs 4Runner', 'Defender 90 overlanding build'. Display on off-road content.", color: "#2563eb" },
      { channel: "Email (Nurture)",    allocation: 14, tactic: "Accessories inspiration email + lease pull-ahead offer. Casual tone, peer-to-peer — not a sales pitch.", color: "#0f766e" },
      { channel: "QR Code Activation", allocation: 8, tactic: "Target Tempe zip codes with a postcard showing a kitted-out Defender 90. QR links to lease calculator + accessory builder.", color: "#f59e0b" },
    ],
    tags: ["Defender 90", "Accessories", "Lease", "Toyota Conquest", "Overlanding", "Reddit Active"],
    journeySummary: "Troy is a first-time luxury buyer currently leasing a 4Runner. He is deep in accessories research and has checked his trade-in value. A lease pull-ahead offer with an overlanding accessories hook is his conversion path.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// LAMBORGHINI OF SCOTTSDALE — 3 PROFILES
// ─────────────────────────────────────────────────────────────────────────────

export const LAMBORGHINI_PROFILES: BuyerProfile[] = [
  {
    id: "lb-001",
    dashboardId: "lamborghini",
    name: "Preston Hargrove",
    age: 52,
    location: "Paradise Valley, AZ",
    occupation: "Private Equity Managing Partner",
    avatar: "PH",
    avatarColor: "#d4a017",
    buyerDNA: "Confirmed buyer. Has called the dealership twice. Wants Urus S in Nero Noctis with full Senso interior. Comparing delivery timeline vs. Porsche Cayenne Turbo GT availability.",
    engagementScore: 96,
    signals: [
      { date: "Jun 10", channel: "CTV", action: "Completed ad view", detail: "Watched full 60-sec Urus S launch film on YouTube Premium — shared to his assistant via text", strength: "very-high" },
      { date: "Jun 13", channel: "Google Search", action: "Keyword search", detail: '"Urus S Nero Noctis in stock Arizona" and "Lamborghini Scottsdale delivery time 2026"', strength: "very-high" },
      { date: "Jun 15", channel: "Website", action: "Page visit", detail: "Urus S configurator — built in Nero Noctis with Senso full leather, Alcantara headliner, and carbon package. Spent 22 min.", strength: "very-high" },
      { date: "Jun 17", channel: "Phone", action: "Inbound call", detail: "Called dealership — asked about current Urus S inventory and allocation. Spoke with sales manager for 8 min.", strength: "very-high" },
      { date: "Jun 20", channel: "3rd-Party Data", action: "Financial site visit", detail: "Visited Lamborghini Financial Services and JP Morgan Private Bank auto lending page — comparing cash vs. financing options", strength: "very-high" },
      { date: "Jun 24", channel: "Website", action: "Return visit", detail: "Returned to configurator — added Senso Tricolore stitching ($4,200) and transparent engine hood ($8,800). Printed spec sheet.", strength: "very-high" },
      { date: "Jun 28", channel: "Phone", action: "Second inbound call", detail: "Called again — asked specifically about ADM (above dealer markup) and whether allocation could be secured this week.", strength: "very-high" },
      { date: "Jul 2",  channel: "3rd-Party Data", action: "Accessory research", detail: "Browsed Lamborghini Squadra Corse carbon fiber side skirts ($14,200), Pirelli P Zero Corsa upgrade ($6,800), and Novitec exhaust system ($18,500)", strength: "high" },
    ],
    purchaseWindows: [
      { window: "7 days",   probability: 89, reasoning: "Two inbound calls + full configuration + financing research = a buyer who has mentally committed. Allocation confirmation and a personal relationship close will seal this." },
      { window: "30 days",  probability: 97, reasoning: "He will buy this month. The only variable is whether it is from Lamborghini of Scottsdale or a competing dealer with faster allocation." },
      { window: "6 months", probability: 99, reasoning: "High-net-worth repeat luxury buyer. Will purchase regardless — the relationship determines where." },
    ],
    personalizedMessage: {
      subject: "Preston — we secured your Nero Noctis Urus S allocation",
      body: "Preston, I wanted to reach out personally to let you know we have secured an allocation for the Urus S in Nero Noctis with the Senso interior package you configured. Given the current demand, this allocation will not last long. I'd like to invite you in for a private viewing this week — just you, no other clients, and I'll walk you through the full spec personally. We can also discuss the ADM and financing structure at that time. What day works best for you?",
    },
    mediaRecommendations: [
      { channel: "Personal Outreach (Phone)", allocation: 45, tactic: "Dealership principal calls Preston directly. Reference his two inbound calls and his exact configuration. Offer private allocation viewing.", color: "#d4a017" },
      { channel: "Email (Allocation)",        allocation: 30, tactic: "Personalized email from sales manager with allocation confirmation and private viewing invitation. Reference his Nero Noctis spec.", color: "#9333ea" },
      { channel: "CTV (Exclusivity)",         allocation: 15, tactic: "Serve Urus S 'Ownership Experience' creative on YouTube Premium. Target Paradise Valley, male 48-58, HHI $1M+.", color: "#7c3aed" },
      { channel: "Direct Mail (Premium)",     allocation: 10, tactic: "Hand-delivered spec sheet in Lamborghini branded folder with a personal note from the GM. Sent to his Paradise Valley address.", color: "#f59e0b" },
    ],
    tags: ["Urus S", "Nero Noctis", "Allocation", "Inbound Caller", "Immediate Close", "HNW Buyer"],
    journeySummary: "Preston has called the dealership twice, completed a full Urus S configuration, and researched financing. He is a confirmed buyer — the dealership's job is to make him feel like the most important client they have.",
  },
  {
    id: "lb-002",
    dashboardId: "lamborghini",
    name: "Alexis Fontaine",
    age: 34,
    location: "Scottsdale, AZ",
    occupation: "Founder & CEO, SaaS Company (Post-Exit)",
    avatar: "AF",
    avatarColor: "#7c3aed",
    buyerDNA: "First Lamborghini buyer. Recently closed a $40M Series B exit. Researching Huracán Sterrato for weekend driving. Social validation-driven — active on Instagram and car forums.",
    engagementScore: 79,
    signals: [
      { date: "Jun 12", channel: "Instagram", action: "Ad engagement", detail: "Clicked on Huracán Sterrato desert adventure reel — watched twice, saved, commented 'this is the one'", strength: "very-high" },
      { date: "Jun 14", channel: "Google Search", action: "Keyword search", detail: '"Huracán Sterrato review 2026" and "Lamborghini Scottsdale Sterrato in stock"', strength: "very-high" },
      { date: "Jun 16", channel: "Website", action: "Page visit", detail: "Huracán Sterrato specs and gallery — spent 19 min. Viewed all color options, focused on Arancio Borealis (orange).", strength: "very-high" },
      { date: "Jun 19", channel: "YouTube", action: "Video view", detail: "Watched Doug DeMuro Huracán Sterrato review (full 28 min) and Motor Trend track test", strength: "high" },
      { date: "Jun 22", channel: "3rd-Party Data", action: "Financial site visit", detail: "Visited Lamborghini Financial Services — checked 48-month financing rate for $280K vehicle", strength: "very-high" },
      { date: "Jun 25", channel: "Website", action: "Return visit", detail: "Returned to configurator — built in Arancio Borealis with Nero Ade interior and exposed carbon fiber package", strength: "very-high" },
      { date: "Jun 29", channel: "Instagram", action: "Organic activity", detail: "Followed @lamborghiniofscottsdale and liked 6 recent Sterrato posts — DM'd asking about test drive availability", strength: "very-high" },
      { date: "Jul 3",  channel: "3rd-Party Data", action: "Accessory research", detail: "Browsed Huracán Sterrato Senso leather upgrade ($8,400), carbon fiber door sills ($3,200), and Lamborghini branded driving gloves ($380)", strength: "high" },
    ],
    purchaseWindows: [
      { window: "7 days",   probability: 71, reasoning: "Instagram DM about test drive + full configuration + financing research = a buyer who has mentally committed. A test drive experience will close this." },
      { window: "30 days",  probability: 91, reasoning: "Post-exit founder with liquidity and clear intent. She will buy within the month — the experience determines the dealership." },
      { window: "6 months", probability: 98, reasoning: "First Lamborghini buyer who has done full research and is emotionally committed. Will purchase regardless." },
    ],
    personalizedMessage: {
      subject: "Alexis — your Arancio Borealis Sterrato test drive is ready",
      body: "Alexis, we saw your DM and we have a Huracán Sterrato in Arancio Borealis available for a private test drive this week. We'll take it out on the 101 and then up Scottsdale Road into the McDowell Mountains — the terrain it was built for. No other clients, no time pressure. Just you and the car. We'll also have your configured spec ready so you can see exactly how it will look when it's yours. What day works for you?",
    },
    mediaRecommendations: [
      { channel: "Instagram (DM Response)", allocation: 40, tactic: "Respond to her DM personally from the dealership account. Offer a private test drive with specific date options. Keep tone peer-to-peer.", color: "#e1306c" },
      { channel: "Email (Experience)",      allocation: 28, tactic: "Private test drive invitation with Arancio Borealis Sterrato photo. Reference her configuration. From the sales manager personally.", color: "#9333ea" },
      { channel: "CTV (Lifestyle)",         allocation: 18, tactic: "Serve Sterrato desert adventure creative on YouTube Premium and Hulu. Target Scottsdale, female 30-40, post-exit founder signals.", color: "#7c3aed" },
      { channel: "Meta (Retargeting)",      allocation: 10, tactic: "Retarget with her configured color (Arancio Borealis) + 'Your Sterrato is waiting' CTA.", color: "#1877f2" },
      { channel: "Google Retargeting",      allocation: 4,  tactic: "Bid on 'Huracán Sterrato Scottsdale', 'Lamborghini test drive AZ'. Capture her active search intent.", color: "#2563eb" },
    ],
    tags: ["Huracán Sterrato", "First Lambo", "Post-Exit Founder", "Instagram Active", "Test Drive Ready"],
    journeySummary: "Alexis is a first-time Lamborghini buyer who has DM'd the dealership asking about a test drive. She has configured her exact spec and checked financing. A private, experience-first test drive will close her.",
  },
  {
    id: "lb-003",
    dashboardId: "lamborghini",
    name: "Diane Castellano",
    age: 58,
    location: "Fountain Hills, AZ",
    occupation: "Retired Orthopedic Surgeon",
    avatar: "DC",
    avatarColor: "#b45309",
    buyerDNA: "Repeat luxury buyer. Currently owns a Porsche Taycan Turbo S. Comparing Urus Performante to Cayenne Turbo GT. Performance-driven, not status-driven. Wants a track experience before deciding.",
    engagementScore: 67,
    signals: [
      { date: "Jun 11", channel: "CTV", action: "Completed ad view", detail: "Watched full Urus Performante performance ad on Hulu — searched brand immediately after", strength: "high" },
      { date: "Jun 14", channel: "Google Search", action: "Keyword search", detail: '"Urus Performante 0-60 vs Cayenne Turbo GT" and "Lamborghini track experience Arizona"', strength: "very-high" },
      { date: "Jun 16", channel: "Website", action: "Page visit", detail: "Urus Performante specs page — compared to Cayenne Turbo GT side-by-side for 12 min. Viewed track mode documentation.", strength: "high" },
      { date: "Jun 19", channel: "3rd-Party Data", action: "Financial site visit", detail: "Visited Porsche Financial Services to check Taycan Turbo S payoff/trade-in value ($142K residual)", strength: "very-high" },
      { date: "Jun 23", channel: "Meta", action: "Ad engagement", detail: "Clicked on Urus Performante track day invitation ad — visited events page", strength: "high" },
      { date: "Jun 27", channel: "Website", action: "Return visit", detail: "Returned to configurator — built Urus Performante in Grigio Telesto with carbon fiber package. Spent 9 min.", strength: "very-high" },
      { date: "Jul 1",  channel: "Email", action: "Opened + clicked", detail: "Opened 'Private Urus Performante Track Experience' invitation email — clicked through to RSVP page", strength: "very-high" },
    ],
    purchaseWindows: [
      { window: "7 days",   probability: 28, reasoning: "Still in comparison mode. The Cayenne Turbo GT is a serious competitor. She needs a performance differentiator — a track experience is the conversion trigger." },
      { window: "30 days",  probability: 58, reasoning: "Configurator use + trade-in research + track event click = warming up fast. A private track day invitation will be the tipping point." },
      { window: "6 months", probability: 86, reasoning: "She will upgrade from the Taycan — the question is whether it is the Urus Performante or the Cayenne Turbo GT. The experience determines the outcome." },
    ],
    personalizedMessage: {
      subject: "Diane — a private Urus Performante track experience, just for you",
      body: "Diane, we'd like to invite you to an exclusive private driving experience at Scottsdale Performance Driving School — just you and a Lamborghini Urus Performante on a closed course. No sales pressure, no audience. Just 45 minutes to feel the difference between 657hp in a Lambo and everything else on the road. We know you've been comparing the Performante to the Cayenne Turbo GT — we think one lap will answer that question better than any spec sheet. We have two dates available next week. Would either work?",
    },
    mediaRecommendations: [
      { channel: "Email (Track Invitation)", allocation: 35, tactic: "Private track day invitation — personalized, from the dealership principal. Emphasize exclusivity and no-pressure experience.", color: "#b45309" },
      { channel: "CTV (Performance)",        allocation: 28, tactic: "Serve Urus Performante track creative on Hulu premium. Target Fountain Hills, female 52-62, HHI $500K+.", color: "#7c3aed" },
      { channel: "Meta (Retargeting)",       allocation: 20, tactic: "Retarget with Urus Performante performance specs carousel. 'The Cayenne Turbo GT is impressive. The Urus Performante is unforgettable.'", color: "#1877f2" },
      { channel: "Google (Conquest)",        allocation: 12, tactic: "Bid on 'Urus Performante vs Cayenne Turbo GT', 'Lamborghini track day Scottsdale'. Capture her comparison search intent.", color: "#2563eb" },
      { channel: "Direct Mail",              allocation: 5,  tactic: "Premium matte postcard with Urus Performante in Grigio Telesto (her configured color) + private track event QR code.", color: "#f59e0b" },
    ],
    tags: ["Urus Performante", "Porsche Conquest", "Performance Buyer", "Track Experience", "Repeat Luxury"],
    journeySummary: "Diane is a sophisticated repeat luxury buyer comparing the Urus Performante to her current Taycan Turbo S. A private track experience — not a sales pitch — is what will convert her.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// WARBY PARKER — 3 PROFILES
// ─────────────────────────────────────────────────────────────────────────────

export const WARBY_PROFILES: BuyerProfile[] = [
  {
    id: "wb-001",
    dashboardId: "warby-parker",
    name: "Jasmine Lawson",
    age: 28,
    location: "Brooklyn, NY",
    occupation: "UX Designer",
    avatar: "JL",
    avatarColor: "#0284c7",
    buyerDNA: "Style-driven repeat buyer. Researching new prescription frames + sunglasses. Responds to aesthetic content and peer reviews.",
    engagementScore: 82,
    signals: [
      { date: "May 15", channel: "CTV", action: "Completed ad view", detail: "Warby Parker 'See Yourself' spring collection spot on Hulu — watched twice", strength: "high" },
      { date: "May 17", channel: "Meta", action: "Ad engagement", detail: "Saved 3 frame styles from Instagram carousel — Haskell, Durand, and Percey", strength: "very-high" },
      { date: "May 19", channel: "Website", action: "Page visit", detail: "Home Try-On page — added 5 frames to try-on cart but did not submit", strength: "very-high" },
      { date: "May 22", channel: "Email", action: "Opened + clicked", detail: "Spring collection email — clicked on Haskell frame, spent 6 min on product page", strength: "high" },
      { date: "May 25", channel: "Google Search", action: "Keyword search", detail: '"Warby Parker Haskell review" and "best prescription glasses for oval face"', strength: "high" },
      { date: "May 28", channel: "Website", action: "Return visit", detail: "Returned to Home Try-On cart — added Haskell in Whiskey Tortoise and submitted order", strength: "very-high" },
    ],
    purchaseWindows: [
      { window: "7 days", probability: 78, reasoning: "She submitted a Home Try-On order — this is a near-certain purchase. The try-on program converts at 50%+ and she's already shown strong preference for the Haskell." },
      { window: "30 days", probability: 94, reasoning: "Home Try-On submission + strong frame preference + past purchase history = very high conversion. She will buy within the try-on window." },
      { window: "6 months", probability: 99, reasoning: "Jasmine is a repeat Warby Parker customer. She will buy again regardless — the question is just this purchase cycle." },
    ],
    personalizedMessage: {
      subject: "Jasmine — your Home Try-On is on its way 🎉",
      body: "Hi Jasmine! Your Home Try-On frames are being packed right now — the Haskell in Whiskey Tortoise is a great pick for your face shape. While you're trying them on, we wanted to let you know the Durand in Pacific Crystal you saved is currently on sale for $20 off this week only. A lot of our customers end up ordering both — one for everyday, one for weekends. Your try-on kit arrives in 2 business days. We can't wait to see which one you choose!",
    },
    mediaRecommendations: [
      { channel: "Email (Conversion)", allocation: 40, tactic: "Try-on confirmation + upsell email with saved frames. Send day of shipment and day 3 of try-on period. Personalized subject line with frame name.", color: "#0284c7" },
      { channel: "Meta (Retargeting)", allocation: 28, tactic: "Retarget with dynamic product ads showing her saved frames. 'Your try-on is on its way — here's what to order next' messaging.", color: "#1877f2" },
      { channel: "CTV Retargeting", allocation: 18, tactic: "Serve Warby Parker lifestyle spot on Hulu during evening hours. Reinforce brand warmth during the try-on decision window.", color: "#7c3aed" },
      { channel: "Google (Brand)", allocation: 10, tactic: "Bid on 'Warby Parker Haskell review' to serve a review/social proof page when she validates her choice.", color: "#2563eb" },
      { channel: "SMS/Push", allocation: 4, tactic: "Day 4 try-on reminder: 'Only 1 day left to decide — which frame is your favorite?' with direct purchase link.", color: "#f59e0b" },
    ],
    tags: ["Home Try-On", "Prescription Frames", "Repeat Buyer", "Style-Driven", "High Intent"],
    journeySummary: "Jasmine is a style-conscious repeat buyer who discovered new frames via Instagram, validated through reviews, and submitted a Home Try-On. She's a near-certain purchase within 7 days.",
  },
  {
    id: "wb-002",
    dashboardId: "warby-parker",
    name: "Carlos Mendez",
    age: 44,
    location: "Austin, TX",
    occupation: "High School Principal",
    avatar: "CM",
    avatarColor: "#16a34a",
    buyerDNA: "Practical first-time buyer. Needs reading glasses and prescription sunglasses. Price-conscious, researching value vs. LensCrafters.",
    engagementScore: 63,
    signals: [
      { date: "May 13", channel: "CTV", action: "Partial view", detail: "Warby Parker value proposition spot on Peacock — watched 20 of 30 sec", strength: "medium" },
      { date: "May 16", channel: "Google Search", action: "Keyword search", detail: '"Warby Parker vs LensCrafters price" and "prescription glasses online $95"', strength: "high" },
      { date: "May 18", channel: "Website", action: "Page visit", detail: "How It Works page + pricing page — spent 12 min comparing $95 single vision to insurance options", strength: "high" },
      { date: "May 21", channel: "Email", action: "Opened", detail: "Opened 'First Pair Free Trial' promotional email — opened twice but did not click", strength: "medium" },
      { date: "May 24", channel: "Meta", action: "Ad engagement", detail: "Clicked on 'Readers starting at $95' Facebook ad — visited reading glasses collection", strength: "medium" },
      { date: "May 27", channel: "Website", action: "Return visit", detail: "Visited reading glasses + prescription sunglasses pages. Added 2 frames to cart, abandoned at checkout.", strength: "very-high" },
    ],
    purchaseWindows: [
      { window: "7 days", probability: 45, reasoning: "Cart abandonment with 2 items = high intent with a friction point. A small discount or free shipping offer could close this immediately." },
      { window: "30 days", probability: 74, reasoning: "He's clearly in the market and has validated Warby Parker's value proposition. A cart recovery email with a modest incentive should convert him." },
      { window: "6 months", probability: 92, reasoning: "He needs glasses — this is a practical purchase. He will buy from Warby Parker or a competitor. The cart abandonment is a timing/friction issue, not a preference issue." },
    ],
    personalizedMessage: {
      subject: "Carlos — your cart is saved. Free shipping on your first order.",
      body: "Hi Carlos, we noticed you left a couple of frames in your cart — the Durand and the Haskell Sun. We wanted to make sure you knew that free shipping is included on all orders, and if you use your vision insurance, many plans cover $150+ of your purchase. Your cart is saved and ready when you are. If you have any questions about how insurance works with your order, our team can walk you through it in under 5 minutes — just reply to this email.",
    },
    mediaRecommendations: [
      { channel: "Email (Cart Recovery)", allocation: 38, tactic: "Cart abandonment email within 2 hours. Emphasize free shipping + insurance compatibility. Send a follow-up at 48 hours with a $10 off code.", color: "#16a34a" },
      { channel: "Google Retargeting", allocation: 26, tactic: "Display retargeting on his abandoned cart items. Bid on 'Warby Parker vs LensCrafters' to serve a comparison landing page.", color: "#2563eb" },
      { channel: "Meta (Retargeting)", allocation: 22, tactic: "Dynamic product ad showing his abandoned frames. 'Still thinking it over? Free shipping + 30-day returns.' messaging.", color: "#1877f2" },
      { channel: "CTV Retargeting", allocation: 10, tactic: "Serve value-focused Warby Parker spot on Peacock. Reinforce the $95 price point and quality message.", color: "#7c3aed" },
      { channel: "Email (Nurture)", allocation: 4, tactic: "If no conversion in 7 days, send a 'How vision insurance works with Warby Parker' educational email.", color: "#0284c7" },
    ],
    tags: ["Reading Glasses", "Cart Abandonment", "Price-Conscious", "LensCrafters Conquest", "First-Time Buyer"],
    journeySummary: "Carlos is a practical first-time buyer who validated Warby Parker's value, added items to cart, but abandoned at checkout. A cart recovery email with a friction-reducing offer is his conversion path.",
  },
  {
    id: "wb-003",
    dashboardId: "warby-parker",
    name: "Rachel Harmon",
    age: 32,
    location: "Chicago, IL",
    occupation: "Marketing Director",
    avatar: "RH",
    avatarColor: "#db2777",
    buyerDNA: "Gift buyer + self-buyer. Researching frames as a birthday gift for her partner + a new pair for herself. High AOV potential.",
    engagementScore: 71,
    signals: [
      { date: "May 14", channel: "CTV", action: "Completed ad view", detail: "Warby Parker 'Gift of Sight' spot on Hulu — watched during primetime", strength: "medium" },
      { date: "May 16", channel: "Google Search", action: "Keyword search", detail: '"Warby Parker gift card" and "best glasses for men oval face"', strength: "high" },
      { date: "May 18", channel: "Website", action: "Page visit", detail: "Men's frames collection + gift card page — spent 15 min browsing men's styles", strength: "high" },
      { date: "May 20", channel: "Meta", action: "Ad engagement", detail: "Clicked on 'Gift a Home Try-On' Facebook ad — visited gifting page", strength: "very-high" },
      { date: "May 23", channel: "Website", action: "Page visit", detail: "Women's frames collection — visited her own wishlist from a previous session", strength: "high" },
      { date: "May 27", channel: "Email", action: "Opened + clicked", detail: "Opened 'Father's Day Gift Ideas' email — clicked on men's frames section", strength: "high" },
    ],
    purchaseWindows: [
      { window: "7 days", probability: 55, reasoning: "Father's Day email engagement + active gifting research = time-sensitive purchase. The Father's Day deadline (June 15) creates urgency. She may buy 2 pairs." },
      { window: "30 days", probability: 85, reasoning: "Both gift and self-purchase intent are active. High AOV potential — she's likely to spend $200+ in a single order." },
      { window: "6 months", probability: 97, reasoning: "Rachel is a high-value repeat buyer type. She'll buy for herself and gift to others multiple times per year." },
    ],
    personalizedMessage: {
      subject: "Rachel — gift a Home Try-On for Father's Day (ships in 2 days)",
      body: "Hi Rachel! Father's Day is June 15th — and gifting a Warby Parker Home Try-On is honestly one of the most thoughtful things you can do. He gets to try 5 frames at home, pick his favorite, and you get all the credit. We can ship a gift kit in 2 business days, and we'll include a personalized note from you. While you're at it — we noticed you have a wishlist from a few months ago. We're running a 'buy one, gift one' promotion this week where your second pair is 20% off. Want to treat yourself too?",
    },
    mediaRecommendations: [
      { channel: "Email (Gift + Self)", allocation: 36, tactic: "Father's Day gifting email with Home Try-On gift option + 'treat yourself' upsell. Time-sensitive subject line. Send now with 7-day countdown.", color: "#db2777" },
      { channel: "Meta (Retargeting)", allocation: 26, tactic: "Retarget with men's frames carousel for gift + women's frames for self. 'Two pairs, one order, 20% off the second' messaging.", color: "#1877f2" },
      { channel: "CTV Retargeting", allocation: 20, tactic: "Serve Warby Parker gifting creative on Hulu. Target Chicago, female 28-38. Father's Day urgency messaging.", color: "#7c3aed" },
      { channel: "Google (Gift Search)", allocation: 12, tactic: "Bid on 'Warby Parker gift card', 'glasses gift for men', 'Father's Day glasses gift'. Capture her active gift search.", color: "#2563eb" },
      { channel: "Email (Reminder)", allocation: 6, tactic: "Send a 'Last chance — Father's Day shipping cutoff is June 12' reminder if no purchase by June 10.", color: "#0284c7" },
    ],
    tags: ["Gift Buyer", "Father's Day", "High AOV", "Self-Purchase", "Repeat Buyer Type"],
    journeySummary: "Rachel is a dual-intent buyer — shopping for a Father's Day gift and considering a new pair for herself. Father's Day urgency + a 'buy one, gift one' offer creates a high-AOV conversion opportunity.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// POLICYGENIUS — 3 PROFILES
// ─────────────────────────────────────────────────────────────────────────────

export const POLICYGENIUS_PROFILES: BuyerProfile[] = [
  {
    id: "pg-001",
    dashboardId: "policygenius",
    name: "Marcus Webb",
    age: 37,
    location: "Austin, TX",
    occupation: "Senior Software Engineer, Series C Startup",
    avatar: "MW",
    avatarColor: "#7c3aed",
    buyerDNA: "New father (8 weeks). Searching for $1M term life coverage. Has quotes from two competitors but has not applied. Urgency is real — wife is pushing for coverage before he returns to travel schedule.",
    engagementScore: 84,
    signals: [
      { date: "Jun 16", channel: "CTV", action: "Completed ad view", detail: "Watched full PolicyGenius 'protect what matters' spot on Hulu — searched brand within 3 minutes", strength: "very-high" },
      { date: "Jun 18", channel: "Google Search", action: "Keyword search", detail: '"$1 million term life insurance 37 year old" and "best term life insurance for new parents"', strength: "very-high" },
      { date: "Jun 20", channel: "Website", action: "Page visit", detail: "Term life insurance comparison page — spent 16 min. Ran quote tool for $1M 20-year term.", strength: "very-high" },
      { date: "Jun 22", channel: "3rd-Party Data", action: "Competitor visit", detail: "Visited Ladder Life and Haven Life — got quotes at $38/mo and $41/mo respectively. Did not apply to either.", strength: "very-high" },
      { date: "Jun 25", channel: "Email", action: "Opened + clicked", detail: "Opened 'New parent? Get $1M covered in 10 minutes' email — clicked through to no-exam term life page", strength: "very-high" },
      { date: "Jun 28", channel: "Website", action: "Return visit", detail: "Returned to PolicyGenius — ran quote for $1M 20-year term. Received $34/mo estimate. Saved but did not apply.", strength: "very-high" },
      { date: "Jul 3",  channel: "Meta", action: "Ad engagement", detail: "Clicked on 'New dad? Get covered before your next trip' Facebook ad — visited application page", strength: "high" },
    ],
    purchaseWindows: [
      { window: "7 days",   probability: 74, reasoning: "Has quotes from two competitors, a PolicyGenius quote saved, and clicked on an urgency ad. A no-exam, fast-approval offer with his specific quote will close this week." },
      { window: "30 days",  probability: 92, reasoning: "New father with real urgency and a wife pushing for coverage. He will buy — the question is which provider closes him first." },
      { window: "6 months", probability: 98, reasoning: "High-earning tech professional who understands risk. Will maintain life insurance long-term. High LTV customer." },
    ],
    personalizedMessage: {
      subject: "Marcus — $1M coverage, no medical exam, approved in 48 hours. $34/mo.",
      body: "Marcus, we know you've been comparing quotes — and we want to make this easy. PolicyGenius can get you $1M in 20-year term life coverage with no medical exam required. Based on your profile, you're looking at approximately $34/mo — less than the quotes you received from Ladder and Haven, and with a faster approval process. Most applicants receive a decision within 48 hours. Your family is covered before your next work trip. It takes about 10 minutes to complete the application. Want to finish it now?",
    },
    mediaRecommendations: [
      { channel: "Email (Urgency Close)", allocation: 40, tactic: "Reference his $34/mo quote and compare to Ladder/Haven quotes. Lead with 'New dad urgency' and no-exam fast approval. Send within 24 hours.", color: "#7c3aed" },
      { channel: "CTV Retargeting",       allocation: 22, tactic: "Serve 'Protect your family in 48 hours' spot on Hulu and Peacock. Target Austin, male 33-42, new parent signals.", color: "#9333ea" },
      { channel: "Google Retargeting",    allocation: 18, tactic: "Retarget on quote page exit. Bid on 'term life insurance no exam Austin', 'best life insurance new parents'.", color: "#2563eb" },
      { channel: "Meta (Urgency)",        allocation: 16, tactic: "Retarget with 'Your $1M quote is ready — complete in 10 minutes' messaging. Show $34/mo price prominently.", color: "#1877f2" },
      { channel: "SMS/Push",              allocation: 4,  tactic: "Day 2 follow-up: 'Marcus — your $1M quote expires in 48 hours. 10 minutes to protect your family.' with direct application link.", color: "#f59e0b" },
    ],
    tags: ["Term Life", "New Parent", "No Medical Exam", "Competitor Quotes", "High Urgency", "$1M Coverage"],
    journeySummary: "Marcus is a new father with quotes from two competitors and a PolicyGenius quote saved. Urgency is real — a no-exam, fast-approval offer at $34/mo will close him within 7 days.",
  },
  {
    id: "pg-002",
    dashboardId: "policygenius",
    name: "Renata Sousa",
    age: 44,
    location: "Miami, FL",
    occupation: "Immigration Attorney, Solo Practice",
    avatar: "RS",
    avatarColor: "#0ea5e9",
    buyerDNA: "Self-employed attorney researching disability insurance and whole life. Has a 12-year-old and a 9-year-old. Focused on income replacement and legacy planning. Education-first buyer.",
    engagementScore: 68,
    signals: [
      { date: "Jun 14", channel: "CTV", action: "Completed ad view", detail: "Watched PolicyGenius disability insurance spot on Peacock — visited site same evening", strength: "high" },
      { date: "Jun 17", channel: "Google Search", action: "Keyword search", detail: '"disability insurance self-employed attorney" and "whole life insurance legacy planning 40s"', strength: "very-high" },
      { date: "Jun 19", channel: "Website", action: "Page visit", detail: "Disability insurance and whole life comparison pages — spent 22 min. Read 'How much disability coverage do I need?' guide.", strength: "very-high" },
      { date: "Jun 23", channel: "Email", action: "Opened", detail: "Opened 'Self-employed? Here's what happens if you can't work' email — opened twice but did not click", strength: "medium" },
      { date: "Jun 26", channel: "Meta", action: "Ad engagement", detail: "Clicked on 'Income protection for solo practitioners' Facebook ad — visited disability insurance page", strength: "high" },
      { date: "Jun 30", channel: "Website", action: "Return visit", detail: "Returned to PolicyGenius — used income replacement calculator. Estimated need: $8,500/mo benefit. Did not get quote.", strength: "very-high" },
      { date: "Jul 4",  channel: "Google Search", action: "Keyword search", detail: '"PolicyGenius disability insurance review" and "best disability insurance for lawyers"', strength: "high" },
    ],
    purchaseWindows: [
      { window: "7 days",   probability: 22, reasoning: "Education-first buyer who is still in research mode. She needs a trusted advisor consultation before she will commit — not a quote tool." },
      { window: "30 days",  probability: 54, reasoning: "Calculator use + return visit + repeat searches = warming up. An advisor call focused on her specific situation (solo practice, two kids) will accelerate." },
      { window: "6 months", probability: 84, reasoning: "She will buy both disability and whole life — the question is timing and which provider earns her trust first." },
    ],
    personalizedMessage: {
      subject: "Renata — a 20-minute call to build your income protection plan",
      body: "Renata, based on your income replacement calculator results, you're looking at approximately $8,500/mo in disability coverage — which is the right number for a solo practice attorney with two kids. Rather than a quote tool, I'd like to offer you a 20-minute call with one of our licensed advisors who specializes in coverage for self-employed professionals. No sales pressure — just a clear picture of what you need, what it costs, and how to structure it for your situation. Would this week work?",
    },
    mediaRecommendations: [
      { channel: "Email (Advisor Offer)",  allocation: 38, tactic: "Offer a 20-minute advisor call — not a quote. Reference her calculator result ($8,500/mo). Position as education, not sales.", color: "#0ea5e9" },
      { channel: "CTV Retargeting",        allocation: 24, tactic: "Serve disability insurance 'solo practice' creative on Peacock and Hulu. Target Miami, female 40-50, self-employed professional signals.", color: "#7c3aed" },
      { channel: "Google Retargeting",     allocation: 20, tactic: "Retarget on calculator exit. Bid on 'disability insurance attorney Florida', 'income protection self-employed'.", color: "#2563eb" },
      { channel: "Meta (Education)",       allocation: 14, tactic: "Retarget with 'What happens to your practice if you can't work for 6 months?' educational creative. Link to advisor booking.", color: "#1877f2" },
      { channel: "LinkedIn",               allocation: 4,  tactic: "Target Immigration Attorney + Miami + age 40-50 with income protection professional messaging.", color: "#0a66c2" },
    ],
    tags: ["Disability Insurance", "Whole Life", "Self-Employed", "Solo Practice", "Legacy Planning", "Education Buyer"],
    journeySummary: "Renata is a self-employed attorney who has used the income replacement calculator and returned twice. She is an education-first buyer — an advisor call focused on her specific situation will convert her.",
  },
  {
    id: "pg-003",
    dashboardId: "policygenius",
    name: "Derek Okafor",
    age: 29,
    location: "Charlotte, NC",
    occupation: "Physical Therapist, Hospital System",
    avatar: "DO",
    avatarColor: "#16a34a",
    buyerDNA: "Just started new job with 90-day benefits waiting period. Needs short-term coverage bridge + evaluating $750K term life. Has quotes saved. Coverage gap urgency is real.",
    engagementScore: 77,
    signals: [
      { date: "Jun 18", channel: "CTV", action: "Completed ad view", detail: "Watched PolicyGenius 'coverage gap' spot on Tubi — searched brand within 5 minutes", strength: "very-high" },
      { date: "Jun 20", channel: "Google Search", action: "Keyword search", detail: '"life insurance during employer waiting period" and "term life insurance fast approval no exam"', strength: "very-high" },
      { date: "Jun 22", channel: "Website", action: "Page visit", detail: "Term life insurance page + 'How quickly can I get covered?' FAQ — spent 13 min", strength: "high" },
      { date: "Jun 25", channel: "Email", action: "Opened + clicked", detail: "Opened 'Get covered in 48 hours' email — clicked through to instant decision term life page", strength: "very-high" },
      { date: "Jun 28", channel: "Meta", action: "Ad engagement", detail: "Clicked on 'No medical exam required' Facebook ad — visited no-exam life insurance page", strength: "high" },
      { date: "Jul 2",  channel: "Website", action: "Return visit", detail: "Returned to PolicyGenius — got quotes for $750K 15-year term. Saved quotes but did not apply.", strength: "very-high" },
    ],
    purchaseWindows: [
      { window: "7 days",   probability: 71, reasoning: "Coverage gap urgency is real and time-sensitive. He has quotes saved and clicked on a 'get covered in 48 hours' email. A no-exam, fast-approval offer will close this week." },
      { window: "30 days",  probability: 91, reasoning: "His employer waiting period creates a hard deadline. He will buy coverage — the question is whether PolicyGenius closes him before he finds another provider." },
      { window: "6 months", probability: 97, reasoning: "As a physical therapist, he understands health risk. Will maintain life insurance long-term. High LTV customer." },
    ],
    personalizedMessage: {
      subject: "Derek — get $750K in coverage with no medical exam. Approved in 48 hours.",
      body: "Derek, we know you're in a coverage gap right now with your new job's waiting period — and we want to help you close that gap fast. PolicyGenius can get you $750K in 15-year term life coverage with no medical exam required, and most applicants receive a decision within 48 hours. Based on the quotes you saved, you're looking at approximately $24/mo for a 15-year term at your age and health profile. That's less than a gym membership for $750K in family protection. Want to complete your application now? It takes about 8 minutes.",
    },
    mediaRecommendations: [
      { channel: "Email (Urgency)",    allocation: 42, tactic: "Coverage gap urgency email with no-exam, 48-hour approval CTA. Specific monthly price from his saved quote. Send within 24 hours.", color: "#16a34a" },
      { channel: "CTV Retargeting",   allocation: 22, tactic: "Serve 'Get covered in 48 hours' spot on Tubi and Pluto TV. Target Charlotte, male 26-34, healthcare worker signals.", color: "#7c3aed" },
      { channel: "Google Retargeting", allocation: 18, tactic: "Retarget on quote page. Bid on 'life insurance no medical exam', 'term life insurance fast approval Charlotte'.", color: "#2563eb" },
      { channel: "Meta (Urgency)",    allocation: 14, tactic: "Retarget with 'Your coverage gap closes in 48 hours' messaging. Show his $750K quote and $24/mo price.", color: "#1877f2" },
      { channel: "SMS/Push",          allocation: 4,  tactic: "Day 3 follow-up: 'Derek — your $750K quote expires in 48 hours. Complete your application in 8 minutes.' with direct link.", color: "#f59e0b" },
    ],
    tags: ["Term Life", "Coverage Gap", "No Medical Exam", "Fast Approval", "High Urgency", "Healthcare Worker"],
    journeySummary: "Derek has a real, time-sensitive coverage gap and has saved quotes. Urgency is his conversion driver — a fast-approval, no-exam offer at $24/mo will close him within 7 days.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// LOOKUP HELPER
// ─────────────────────────────────────────────────────────────────────────────

import { MCCARTY_VOTER_PROFILES } from "./mccartryProfiles";
import { BREEZE_BUYER_PROFILES } from "./breezeProfiles";
import { BARRETT_BUYER_PROFILE_CARDS } from "./barrettProfiles";

export const ALL_PROFILES: BuyerProfile[] = [
  ...LAND_ROVER_PROFILES,
  ...LAMBORGHINI_PROFILES,
  ...WARBY_PROFILES,
  ...POLICYGENIUS_PROFILES,
  ...MCCARTY_VOTER_PROFILES,
  ...BREEZE_BUYER_PROFILES,
  ...BARRETT_BUYER_PROFILE_CARDS,
];

export function getProfilesByDashboard(dashboardId: BuyerProfile["dashboardId"]): BuyerProfile[] {
  return ALL_PROFILES.filter(p => p.dashboardId === dashboardId);
}

export function getProfileById(id: string): BuyerProfile | undefined {
  return ALL_PROFILES.find(p => p.id === id);
}
