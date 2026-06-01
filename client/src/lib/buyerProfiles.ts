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
  dashboardId: "land-rover" | "lamborghini" | "warby-parker" | "policygenius" | "mccarty" | "breeze-insurance";
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
    name: "Marcus Thornton",
    age: 42,
    location: "Paradise Valley, AZ",
    occupation: "Commercial Real Estate Developer",
    avatar: "MT",
    avatarColor: "#0f766e",
    buyerDNA: "Outdoor-lifestyle driven, researching Defender 110 for family adventures + status. Financing-aware.",
    engagementScore: 87,
    signals: [
      { date: "May 14", channel: "CTV", action: "Completed ad view", detail: "Defender 110 — 'Go Beyond' 30-sec spot. Watched 3x in 5 days.", strength: "high" },
      { date: "May 17", channel: "Google Search", action: "Keyword search", detail: '"Defender 110 vs Range Rover Sport off-road" — landed on LR North Scottsdale inventory page', strength: "high" },
      { date: "May 19", channel: "Website", action: "Page visit", detail: "Defender 110 build & price tool — spent 14 min, configured Carpathian Grey + Black Pack", strength: "very-high" },
      { date: "May 21", channel: "Reddit", action: "Forum activity", detail: 'r/LandRover: Asked "Is the Defender 110 worth it over a 4Runner for Sedona trips?" — 12 replies', strength: "medium" },
      { date: "May 23", channel: "Email", action: "Opened + clicked", detail: "Spring Conquest offer email — clicked 'Schedule Test Drive' but did not submit form", strength: "high" },
      { date: "May 27", channel: "Meta", action: "Ad engagement", detail: "Liked Defender 110 video post, saved it to collection", strength: "medium" },
      { date: "May 29", channel: "Website", action: "Return visit", detail: "Checked financing calculator — $1,200/mo at 72 months on $89K Defender 110", strength: "very-high" },
      { date: "May 30", channel: "3rd-Party Data", action: "Financial site visit", detail: "Visited LightStream.com auto loan page — compared dealer financing vs. outside loan at 6.49% APR", strength: "very-high" },
      { date: "May 31", channel: "3rd-Party Data", action: "Accessory research", detail: "Browsed Defender 110 18\" Gloss Black Satin wheels ($2,800) and Roof Rack System ($1,400) on LR accessories site", strength: "high" },
    ],
    purchaseWindows: [
      { window: "7 days", probability: 28, reasoning: "High engagement but still in comparison phase. Reddit activity suggests he's validating the decision socially before committing." },
      { window: "30 days", probability: 72, reasoning: "Financing calculator use + build configurator = strong purchase intent. A test drive offer or limited inventory alert will likely close this." },
      { window: "6 months", probability: 94, reasoning: "All behavioral signals point to a committed buyer. The only variable is timing around a real estate deal he may be closing." },
    ],
    personalizedMessage: {
      subject: "Marcus — your Carpathian Grey Defender 110 is still available",
      body: "Hi Marcus, we noticed you built out a Defender 110 in Carpathian Grey with the Black Pack last week — that exact configuration is currently in stock at Land Rover North Scottsdale. With current financing at $1,189/mo for 72 months, this is one of the best windows we've seen this year. We'd love to hold it for you for 48 hours and set up a private test drive through Sedona country if you're interested. No pressure — just wanted to make sure you had first access before it moves.",
    },
    mediaRecommendations: [
      { channel: "CTV Retargeting", allocation: 38, tactic: "Serve Defender 110 'Build Your Adventure' 15-sec spot on Hulu and Peacock during evening hours (7–10pm). Frequency cap: 3x/week.", color: "#7c3aed" },
      { channel: "Email (Personalized)", allocation: 22, tactic: "Send 1:1 inventory hold email with his saved configuration + financing quote. Follow up in 5 days if no response.", color: "#0f766e" },
      { channel: "Google Retargeting", allocation: 18, tactic: "Display retargeting on Defender 110 inventory page and financing calculator. Bid on 'Defender 110 Scottsdale' and 'Land Rover financing AZ'.", color: "#2563eb" },
      { channel: "Meta (Retargeting)", allocation: 14, tactic: "Dynamic product ad showing his configured Defender 110 in Carpathian Grey. Target Paradise Valley + Scottsdale zip codes.", color: "#1877f2" },
      { channel: "QR Code Activation", allocation: 8, tactic: "Mail a personalized QR postcard to Paradise Valley — links directly to his saved build with a 'Reserve Now' CTA.", color: "#f59e0b" },
    ],
    tags: ["Defender 110", "Financing", "High Intent", "Outdoor Lifestyle", "Reddit Active"],
    journeySummary: "Marcus discovered Land Rover through CTV, validated on Google, built his dream spec online, and is now in the final comparison phase. He's a 30-day close with the right personal outreach.",
  },
  {
    id: "lr-002",
    dashboardId: "land-rover",
    name: "Priya Sharma",
    age: 36,
    location: "Scottsdale, AZ",
    occupation: "Pediatric Surgeon",
    avatar: "PS",
    avatarColor: "#7c3aed",
    buyerDNA: "Safety-first, luxury-conscious. Researching Defender 90 as a personal vehicle upgrade from her current BMW X5.",
    engagementScore: 74,
    signals: [
      { date: "May 10", channel: "CTV", action: "Completed ad view", detail: "Defender 90 lifestyle spot — watched on Peacock during a medical drama binge", strength: "medium" },
      { date: "May 15", channel: "Meta", action: "Ad click", detail: "Clicked 'Learn More' on Defender 90 Instagram carousel — spent 4 min on landing page", strength: "medium" },
      { date: "May 18", channel: "Website", action: "Page visit", detail: "Defender 90 safety features page + compared to Range Rover Evoque", strength: "high" },
      { date: "May 22", channel: "Google Search", action: "Keyword search", detail: '"Defender 90 vs BMW X5 safety ratings" and "Land Rover Scottsdale service reviews"', strength: "high" },
      { date: "May 25", channel: "Email", action: "Opened", detail: "Opened Spring Conquest email but did not click — opened again 2 days later", strength: "medium" },
      { date: "May 28", channel: "Website", action: "Return visit", detail: "Visited 'Certified Pre-Owned' section — browsed 2023 Defender 90 options under $70K", strength: "very-high" },
      { date: "May 29", channel: "3rd-Party Data", action: "Financial site visit", detail: "Visited Chase Auto Finance and Capital One Auto Navigator — pre-qualification check for $65K–$75K vehicle loan", strength: "very-high" },
      { date: "May 30", channel: "3rd-Party Data", action: "Accessory research", detail: "Searched Defender 90 all-weather floor mats, cargo liner, and tow hitch accessories — total accessory basket ~$1,200", strength: "medium" },
    ],
    purchaseWindows: [
      { window: "7 days", probability: 15, reasoning: "Still in research phase, comparing to her current vehicle. CPO browsing suggests she may be price-sensitive or testing the market." },
      { window: "30 days", probability: 58, reasoning: "Safety research + CPO interest = a buyer who wants the brand but may need a value bridge. A CPO incentive or service package offer could accelerate this." },
      { window: "6 months", probability: 88, reasoning: "High brand affinity, multiple touchpoints, and clear vehicle preference. She will buy a Defender — the question is new vs. CPO and the timing around her schedule." },
    ],
    personalizedMessage: {
      subject: "Priya — 2023 Defender 90 CPO with full warranty, under $68K",
      body: "Hi Priya, based on your recent browsing we wanted to share a Certified Pre-Owned 2023 Defender 90 that just arrived at Land Rover North Scottsdale — fully inspected, under factory warranty extension, and priced at $67,900. As a CPO vehicle it comes with 2 years of complimentary scheduled maintenance. We know your schedule is demanding, so we're happy to arrange an after-hours private viewing at a time that works for you. No obligation — just want to make sure you see this one before it goes.",
    },
    mediaRecommendations: [
      { channel: "CTV Retargeting", allocation: 32, tactic: "Serve Defender 90 CPO and safety-focused creative on Peacock and Hulu. Run during medical/drama content blocks (9–11pm).", color: "#7c3aed" },
      { channel: "Email (Personalized)", allocation: 28, tactic: "CPO inventory alert with specific vehicle + pricing. Emphasize warranty and service package. Send Tuesday morning (she likely reviews emails before rounds).", color: "#0f766e" },
      { channel: "Meta (Retargeting)", allocation: 20, tactic: "Retarget with Defender 90 CPO carousel. Highlight safety ratings and 'Certified Pre-Owned Peace of Mind' messaging.", color: "#1877f2" },
      { channel: "Google Retargeting", allocation: 14, tactic: "Bid on 'Defender 90 CPO Scottsdale', 'Land Rover certified pre-owned AZ'. Display on automotive comparison sites.", color: "#2563eb" },
      { channel: "QR Code Activation", allocation: 6, tactic: "Direct mail to Scottsdale 85254 zip — QR links to CPO inventory filtered to Defender 90 under $70K.", color: "#f59e0b" },
    ],
    tags: ["Defender 90", "CPO", "Safety Research", "BMW Conquest", "High Value"],
    journeySummary: "Priya is a methodical researcher who discovered Land Rover via CTV, validated safety credentials, and is now comparing new vs. CPO. A personalized CPO offer with service perks is her likely conversion trigger.",
  },
  {
    id: "lr-003",
    dashboardId: "land-rover",
    name: "Derek Walton",
    age: 29,
    location: "Tempe, AZ",
    occupation: "Tech Startup Founder",
    avatar: "DW",
    avatarColor: "#f59e0b",
    buyerDNA: "Aspirational buyer. Researching Defender 90 accessories and wheel upgrades — currently leasing a Jeep Wrangler. Upgrade signal.",
    engagementScore: 61,
    signals: [
      { date: "May 12", channel: "CTV", action: "Partial view", detail: "Watched 18 sec of 30-sec Defender 90 ad on Tubi — dropped at product shot", strength: "low" },
      { date: "May 16", channel: "Google Search", action: "Keyword search", detail: '"Defender 90 aftermarket wheels" and "Defender 90 vs Wrangler Rubicon"', strength: "high" },
      { date: "May 19", channel: "Website", action: "Page visit", detail: "Accessories page — spent 8 min on wheel and suspension upgrades for Defender 90", strength: "high" },
      { date: "May 21", channel: "Reddit", action: "Forum activity", detail: 'r/overlanding: "Anyone running a Defender 90 on 33s? Worth the cost vs. Wrangler?" — active thread', strength: "high" },
      { date: "May 24", channel: "Meta", action: "Ad engagement", detail: "Clicked on Defender 90 accessories Instagram post, followed Land Rover North Scottsdale account", strength: "medium" },
      { date: "May 27", channel: "Website", action: "Return visit", detail: "Visited 'Current Offers' page — viewed lease deals on Defender 90 starting at $899/mo", strength: "very-high" },
      { date: "May 28", channel: "3rd-Party Data", action: "Financial site visit", detail: "Visited Carvana and CarMax to check Jeep Wrangler trade-in value ($28,400 estimate) — preparing to trade in", strength: "very-high" },
      { date: "May 30", channel: "3rd-Party Data", action: "Accessory research", detail: "Browsed Defender 90 18\" Gloss Black Satin wheels ($2,800), Old Spice Orange roof rack ($1,800), and ARB recovery kit ($620) on overlanding forums", strength: "high" },
    ],
    purchaseWindows: [
      { window: "7 days", probability: 8, reasoning: "Lease curiosity is early-stage. He's comparing options and his Jeep lease may not be up yet. Not a short-term close." },
      { window: "30 days", probability: 34, reasoning: "Accessories research + lease pricing check = someone who's mentally moving toward a Defender but needs a financial trigger. A lease pull-ahead offer could work." },
      { window: "6 months", probability: 76, reasoning: "Strong brand affinity, overlanding community validation, and clear upgrade intent. His Jeep lease likely ends in this window — timing is the key variable." },
    ],
    personalizedMessage: {
      subject: "Derek — Defender 90 lease from $899/mo + we'll cover your Jeep lease pull-ahead",
      body: "Hey Derek, we saw you checking out Defender 90 lease options and the accessories lineup — honestly, the 90 on a set of 18\" Gloss Black Satin wheels is one of the best setups we've seen come through the lot. We're currently running a lease pull-ahead program that can get you out of your Jeep early with no penalty and into a Defender 90 from $899/mo. If you want to come by and see the accessories in person — or just take one out on the 101 — we'll make it worth your time.",
    },
    mediaRecommendations: [
      { channel: "CTV Retargeting", allocation: 28, tactic: "Serve Defender 90 adventure/overlanding creative on Tubi and Pluto TV. Use 15-sec 'Built for More' spot with wheel/accessory focus.", color: "#7c3aed" },
      { channel: "Meta (Retargeting)", allocation: 26, tactic: "Retarget with Defender 90 accessories carousel + 'Lease from $899' CTA. Target Tempe + Chandler zip codes, age 25-34.", color: "#1877f2" },
      { channel: "Google Retargeting", allocation: 22, tactic: "Bid on 'Defender 90 lease AZ', 'Defender 90 wheels upgrade', 'Jeep Wrangler vs Defender'. Display on overlanding/4x4 content.", color: "#2563eb" },
      { channel: "Email (Nurture)", allocation: 14, tactic: "Accessories inspiration email + lease pull-ahead offer. Keep tone casual and peer-to-peer, not salesy.", color: "#0f766e" },
      { channel: "QR Code Activation", allocation: 10, tactic: "Target Tempe zip codes with a postcard showing a kitted-out Defender 90. QR links to lease calculator + accessory builder.", color: "#f59e0b" },
    ],
    tags: ["Defender 90", "Accessories", "Lease", "Jeep Conquest", "Overlanding", "Reddit Active"],
    journeySummary: "Derek is an aspirational upgrader currently leasing a Jeep. He's deep in the accessories and comparison research phase. A lease pull-ahead offer with an accessories hook is his conversion path.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// LAMBORGHINI OF SCOTTSDALE — 3 PROFILES
// ─────────────────────────────────────────────────────────────────────────────

export const LAMBORGHINI_PROFILES: BuyerProfile[] = [
  {
    id: "lambo-001",
    dashboardId: "lamborghini",
    name: "Nathaniel Reeves",
    age: 51,
    location: "Paradise Valley, AZ",
    occupation: "Private Equity Partner",
    avatar: "NR",
    avatarColor: "#d4a017",
    buyerDNA: "Trophy buyer. Researching Urus S as a 3rd vehicle — has a Ferrari 488 and a Bentley Bentayga. Wants exclusivity and personalization.",
    engagementScore: 91,
    signals: [
      { date: "May 8", channel: "CTV", action: "Completed ad view", detail: "Urus S launch spot — watched on Hulu 4x over 10 days. High completion rate.", strength: "very-high" },
      { date: "May 12", channel: "Website", action: "Page visit", detail: "Urus S configurator — spent 22 min. Built in Giallo Inti (yellow) with Nero Noctis interior + carbon fiber trim.", strength: "very-high" },
      { date: "May 15", channel: "Google Search", action: "Keyword search", detail: '"Lamborghini Urus S vs Bentley Bentayga Speed" and "Urus S Scottsdale allocation"', strength: "high" },
      { date: "May 18", channel: "Meta", action: "Ad engagement", detail: "Watched full 60-sec Urus S video on Instagram, commented 'this in yellow 🔥'", strength: "very-high" },
      { date: "May 21", channel: "Website", action: "Return visit", detail: "Visited 'Ad Personam' custom order page — spent 11 min reviewing bespoke options", strength: "very-high" },
      { date: "May 24", channel: "Email", action: "Opened + clicked", detail: "Opened VIP event invitation email, clicked RSVP but did not complete", strength: "high" },
      { date: "May 28", channel: "Phone/Inquiry", action: "Inbound call", detail: "Called dealership asking about Urus S allocation timeline and deposit requirements", strength: "very-high" },
      { date: "May 29", channel: "3rd-Party Data", action: "Financial site visit", detail: "Visited Lamborghini Financial Services site — reviewed balloon payment (PCP) vs. outright purchase options on $280K+ vehicle", strength: "very-high" },
      { date: "May 31", channel: "3rd-Party Data", action: "Accessory research", detail: "Browsed Urus S Ad Personam accessories: Senso Unico carbon fiber package ($18K), custom Giallo Inti brake calipers ($4,200), and Lamborghini luggage set ($3,800)", strength: "high" },
    ],
    purchaseWindows: [
      { window: "7 days", probability: 42, reasoning: "Inbound call about allocation and deposit = serious buyer. He's deciding between waiting for his custom build vs. taking a stock unit. A personal call from the GM could close this week." },
      { window: "30 days", probability: 85, reasoning: "All signals point to an imminent purchase. The only friction is the allocation wait for his custom spec. A stock Urus S in a compelling color could close in 30 days." },
      { window: "6 months", probability: 98, reasoning: "This is a guaranteed purchase. The question is stock vs. custom order. He will own a Urus S — the dealership's job is to make the experience feel exclusive enough to justify the wait." },
    ],
    personalizedMessage: {
      subject: "Nathaniel — a private preview of our incoming Urus S allocation",
      body: "Nathaniel, thank you for your call last week. I wanted to personally reach out to let you know we have an incoming Urus S allocation arriving in 6 weeks — Giallo Inti with a Nero Noctis interior, which I believe aligns closely with the build you configured online. Given your interest in the Ad Personam program, I'd like to invite you to a private preview evening at the dealership where you can review the full bespoke options with our Lamborghini specialist before we open this allocation to the broader list. This is an exclusive opportunity for a select group of clients. I'll hold your spot if you can confirm by Friday.",
    },
    mediaRecommendations: [
      { channel: "CTV (Premium)", allocation: 35, tactic: "Serve Urus S 'Expect the Unexpected' 60-sec spot on Hulu and Peacock premium inventory. Target Paradise Valley + Scottsdale 85253/85255 zip codes. Evening hours only.", color: "#7c3aed" },
      { channel: "Email (VIP 1:1)", allocation: 30, tactic: "Personal email from GM/Sales Director — not a mass campaign. Invite to private allocation preview. Handwritten tone.", color: "#7c3aed" },
      { channel: "Meta (Luxury Retargeting)", allocation: 18, tactic: "Retarget with Urus S Ad Personam bespoke configurator content. Target HHI $500K+, luxury auto owners in Paradise Valley.", color: "#1877f2" },
      { channel: "Direct Mail (Luxury)", allocation: 12, tactic: "Send a physical Urus S brochure with a handwritten note and QR code to his saved configuration. Premium matte print.", color: "#f59e0b" },
      { channel: "Google (Brand Defense)", allocation: 5, tactic: "Bid on 'Lamborghini Scottsdale' and 'Urus S Arizona' to ensure he finds the dealership first if he searches again.", color: "#2563eb" },
    ],
    tags: ["Urus S", "Ad Personam", "VIP", "Trophy Buyer", "Inbound Inquiry", "Very High Intent"],
    journeySummary: "Nathaniel is a confirmed buyer who has already called the dealership. He wants exclusivity and a personalized experience. The dealership's job is to make him feel like the most important client they have — because he is.",
  },
  {
    id: "lambo-002",
    dashboardId: "lamborghini",
    name: "Tyler Marsh",
    age: 34,
    location: "Scottsdale, AZ",
    occupation: "Tech Company Founder (Series B)",
    avatar: "TM",
    avatarColor: "#f59e0b",
    buyerDNA: "First Lamborghini buyer. Researching Huracán EVO Spyder — motivated by lifestyle and social identity. Financing-open. Watching YouTube reviews obsessively.",
    engagementScore: 78,
    signals: [
      { date: "May 11", channel: "CTV", action: "Completed ad view", detail: "Huracán EVO Spyder spot on Peacock — watched 2x same session", strength: "high" },
      { date: "May 14", channel: "YouTube", action: "Video engagement", detail: "Watched 3 Huracán EVO Spyder reviews (Throttle House, CarWow, Doug DeMuro) — avg 18 min each", strength: "very-high" },
      { date: "May 17", channel: "Website", action: "Page visit", detail: "Huracán EVO Spyder inventory page — viewed 2 units, one in Arancio Borealis (orange)", strength: "high" },
      { date: "May 19", channel: "Reddit", action: "Forum activity", detail: 'r/Lamborghini: "First Lambo — Huracán EVO Spyder or wait for the Revuelto?" — 28 replies, very active', strength: "very-high" },
      { date: "May 22", channel: "Google Search", action: "Keyword search", detail: '"Lamborghini financing Scottsdale" and "Huracán EVO Spyder monthly payment $250K"', strength: "very-high" },
      { date: "May 26", channel: "Meta", action: "Ad engagement", detail: "Shared Lamborghini Scottsdale Instagram post to his story with caption 'soon 👀'", strength: "very-high" },
      { date: "May 28", channel: "3rd-Party Data", action: "Financial site visit", detail: "Visited JM&A Group and Lamborghini Financial Services — compared 60 vs. 72-month financing on $248K Huracán EVO Spyder; also checked pre-approval on Capital One Auto", strength: "very-high" },
      { date: "May 30", channel: "3rd-Party Data", action: "Accessory research", detail: "Browsed Huracán EVO Spyder aftermarket: Novitec exhaust system ($12,400), OEM carbon fiber door sills ($2,800), and custom Arancio Borealis car cover ($890)", strength: "high" },
    ],
    purchaseWindows: [
      { window: "7 days", probability: 22, reasoning: "Reddit thread shows he's still weighing Huracán vs. waiting for Revuelto. Financing research is active but he hasn't requested a quote yet." },
      { window: "30 days", probability: 67, reasoning: "Social sharing + financing research = someone who has mentally committed but needs a financial path confirmed. A financing pre-approval offer could close this month." },
      { window: "6 months", probability: 91, reasoning: "He will buy a Lamborghini. The Huracán vs. Revuelto question is the only variable. If Revuelto allocation is 18+ months, he'll take the Huracán EVO Spyder now." },
    ],
    personalizedMessage: {
      subject: "Tyler — the orange Huracán EVO Spyder won't last. Here's what financing looks like.",
      body: "Tyler, we noticed you've been researching the Huracán EVO Spyder — and honestly, the Arancio Borealis unit we have in stock right now is one of the best-looking cars on our floor. On the Revuelto question: we're currently looking at 14–18 month allocation waits for most configurations, so if you want to be driving a Lamborghini this summer, the EVO Spyder is your move. On financing: at current rates, a 60-month term on this unit comes to approximately $3,800/mo with 20% down. We can have a pre-approval back to you within 24 hours — no commitment required. Want us to hold the orange one for 48 hours while you think it over?",
    },
    mediaRecommendations: [
      { channel: "CTV Retargeting", allocation: 30, tactic: "Serve Huracán EVO Spyder 'Born to Be Wild' spot on Peacock and Hulu. Target Scottsdale 85251/85257 zip codes, age 28-40, HHI $300K+.", color: "#7c3aed" },
      { channel: "Meta (Retargeting)", allocation: 28, tactic: "Retarget with Huracán EVO Spyder inventory carousel + 'Financing from $3,800/mo' CTA. He shared our post — he's warm. Use social proof messaging.", color: "#1877f2" },
      { channel: "Email (Financing Focus)", allocation: 22, tactic: "Send financing pre-approval offer with specific monthly payment on the Arancio Borealis unit. Subject line: 'Your Huracán EVO Spyder financing — 24-hour pre-approval'.", color: "#7c3aed" },
      { channel: "YouTube Retargeting", allocation: 14, tactic: "Run 15-sec non-skippable pre-roll on Lamborghini content and automotive review channels. 'The orange one is still here. For now.'", color: "#f59e0b" },
      { channel: "Google (Search)", allocation: 6, tactic: "Bid on 'Lamborghini financing Scottsdale', 'Huracán EVO Spyder for sale Arizona'. Capture his active search intent.", color: "#2563eb" },
    ],
    tags: ["Huracán EVO Spyder", "First Lambo", "Financing", "Reddit Active", "Social Sharer", "High Intent"],
    journeySummary: "Tyler is a first-time Lamborghini buyer who has mentally committed but needs a financial bridge and a reason to act now vs. wait for the Revuelto. Social validation and a financing offer are his conversion triggers.",
  },
  {
    id: "lambo-003",
    dashboardId: "lamborghini",
    name: "Sandra Kessler",
    age: 47,
    location: "Fountain Hills, AZ",
    occupation: "Plastic Surgeon / Practice Owner",
    avatar: "SK",
    avatarColor: "#9333ea",
    buyerDNA: "Repeat luxury buyer. Researching Urus Performante for herself — currently drives a Porsche Cayenne Turbo. Focused on performance specs and exclusivity.",
    engagementScore: 69,
    signals: [
      { date: "May 9", channel: "CTV", action: "Completed ad view", detail: "Urus Performante track performance spot on Hulu — completed twice", strength: "high" },
      { date: "May 13", channel: "Website", action: "Page visit", detail: "Urus Performante specs page — compared to Cayenne Turbo GT side-by-side for 9 min", strength: "high" },
      { date: "May 16", channel: "Google Search", action: "Keyword search", detail: '"Urus Performante vs Cayenne Turbo GT 0-60" and "Lamborghini Scottsdale women buyers"', strength: "medium" },
      { date: "May 20", channel: "Meta", action: "Ad engagement", detail: "Clicked on Urus Performante Instagram ad — saved the post", strength: "medium" },
      { date: "May 25", channel: "Website", action: "Return visit", detail: "Visited Urus Performante configurator — built in Bianco Monocerus (white) with Alcantara interior", strength: "very-high" },
      { date: "May 28", channel: "Email", action: "Opened", detail: "Opened VIP client event email — did not click but opened 3 times over 2 days", strength: "medium" },
      { date: "May 29", channel: "3rd-Party Data", action: "Financial site visit", detail: "Visited Porsche Financial Services to check Cayenne Turbo GT trade-in/payoff value ($118K residual) — evaluating equity position before upgrade", strength: "very-high" },
      { date: "May 31", channel: "3rd-Party Data", action: "Accessory research", detail: "Browsed Urus Performante carbon fiber front splitter ($6,200), Bianco Monocerus painted brake calipers ($3,400), and Lamborghini Squadra Corse floor mats ($1,200)", strength: "high" },
    ],
    purchaseWindows: [
      { window: "7 days", probability: 12, reasoning: "Still in comparison mode. The Cayenne Turbo GT is a serious competitor for her. She needs a performance differentiator that justifies the premium." },
      { window: "30 days", probability: 44, reasoning: "Configurator use + repeated email opens = warming up. A private track day or performance demo event could be the tipping point." },
      { window: "6 months", probability: 82, reasoning: "She will upgrade from the Cayenne — the question is whether it's the Urus Performante or the Cayenne Turbo GT. Lamborghini's job is to make the experience feel worth the premium." },
    ],
    personalizedMessage: {
      subject: "Sandra — a private Urus Performante performance experience, just for you",
      body: "Sandra, we'd like to invite you to an exclusive private driving experience at Scottsdale Performance Driving School — just you and a Lamborghini Urus Performante on a closed course. No sales pressure, no audience. Just 45 minutes to feel the difference between 657hp in a Lambo and everything else on the road. We know you've been comparing the Performante to the Cayenne Turbo GT — we think one lap will answer that question better than any spec sheet. We have two dates available in the next 10 days. Would either work for your schedule?",
    },
    mediaRecommendations: [
      { channel: "CTV (Performance)", allocation: 32, tactic: "Serve Urus Performante track/performance creative on Hulu premium. Target Fountain Hills + North Scottsdale, female 40-55, HHI $400K+.", color: "#7c3aed" },
      { channel: "Email (Experience)", allocation: 30, tactic: "Private track day invitation — personalized, from the dealership principal. Emphasize exclusivity and no-pressure experience.", color: "#9333ea" },
      { channel: "Meta (Retargeting)", allocation: 20, tactic: "Retarget with Urus Performante performance specs carousel. 'The Cayenne Turbo GT is impressive. The Urus Performante is unforgettable.' messaging.", color: "#1877f2" },
      { channel: "Google (Conquest)", allocation: 12, tactic: "Bid on 'Urus Performante vs Cayenne Turbo GT', 'Lamborghini Scottsdale test drive'. Capture her comparison search intent.", color: "#2563eb" },
      { channel: "Direct Mail", allocation: 6, tactic: "Premium matte postcard with Urus Performante in Bianco Monocerus (her configured color) + private event QR code.", color: "#f59e0b" },
    ],
    tags: ["Urus Performante", "Porsche Conquest", "Performance Buyer", "Repeat Luxury", "Experience-Driven"],
    journeySummary: "Sandra is a sophisticated repeat luxury buyer comparing the Urus Performante to her current Cayenne Turbo GT. A premium experience — not a sales pitch — is what will convert her.",
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
    name: "Brian Okafor",
    age: 38,
    location: "Denver, CO",
    occupation: "Software Engineer (Remote)",
    avatar: "BO",
    avatarColor: "#7c3aed",
    buyerDNA: "New father (6 months). Actively researching term life insurance for the first time. Motivated by family protection, price-comparison focused.",
    engagementScore: 88,
    signals: [
      { date: "May 12", channel: "CTV", action: "Completed ad view", detail: "PolicyGenius 'Protect What Matters' 30-sec spot on Hulu — watched 3x in 1 week", strength: "very-high" },
      { date: "May 15", channel: "Google Search", action: "Keyword search", detail: '"best term life insurance for new parents" and "PolicyGenius vs Haven Life review"', strength: "very-high" },
      { date: "May 17", channel: "Website", action: "Page visit", detail: "Term life insurance comparison tool — got quotes from 4 carriers. Spent 18 min.", strength: "very-high" },
      { date: "May 19", channel: "Email", action: "Opened + clicked", detail: "Opened 'Your quotes are ready' email — clicked through to compare Ladder vs. Banner Life", strength: "high" },
      { date: "May 22", channel: "Reddit", action: "Forum activity", detail: 'r/personalfinance: "New dad — how much term life do I actually need?" — got 40+ replies, very engaged', strength: "high" },
      { date: "May 25", channel: "Website", action: "Return visit", detail: "Returned to PolicyGenius — started application for $750K 20-year term, stopped at medical history section", strength: "very-high" },
      { date: "May 28", channel: "Email", action: "Opened", detail: "Opened 'Complete your application' follow-up email — opened but did not click", strength: "high" },
    ],
    purchaseWindows: [
      { window: "7 days", probability: 62, reasoning: "Started application and stopped at medical history — this is a friction point, not a lack of intent. A human advisor call or chat could close this week." },
      { window: "30 days", probability: 88, reasoning: "All signals point to an imminent purchase. He has quotes, has done comparison research, and has started an application. He just needs help over the finish line." },
      { window: "6 months", probability: 97, reasoning: "New father with clear family protection motivation. He will buy term life insurance — PolicyGenius just needs to be the one to close him." },
    ],
    personalizedMessage: {
      subject: "Brian — your $750K term life application is 80% done. Let us help you finish.",
      body: "Hi Brian, we noticed you started your $750K 20-year term life application last week and got to the medical history section. That part can feel overwhelming, but it's actually simpler than it looks — most applicants complete it in under 10 minutes with one of our licensed advisors on the phone. We'd love to schedule a free 15-minute call to walk you through it and get your application submitted today. Given that you have a 6-month-old at home, getting this done now means your family is protected starting this month. Want to book a time that works for you?",
    },
    mediaRecommendations: [
      { channel: "Email (Application Recovery)", allocation: 40, tactic: "Application abandonment email with advisor call CTA. Emphasize 'your family is protected starting this month' urgency. Send within 24 hours of abandonment.", color: "#7c3aed" },
      { channel: "CTV Retargeting", allocation: 25, tactic: "Serve 'Protect What Matters' spot on Hulu during evening hours. Target Denver, male 32-42, new parent signals.", color: "#7c3aed" },
      { channel: "Google Retargeting", allocation: 18, tactic: "Display retargeting on PolicyGenius application page. Bid on 'term life insurance new parent', 'PolicyGenius application help'.", color: "#2563eb" },
      { channel: "Meta (Retargeting)", allocation: 12, tactic: "Retarget with 'Your family deserves this protection' messaging. Show the $750K 20-year term quote he received.", color: "#1877f2" },
      { channel: "SMS/Advisor Outreach", allocation: 5, tactic: "Advisor outbound call or SMS: 'Hi Brian, I'm your PolicyGenius advisor — I can help you finish your application in 10 minutes. When's a good time?'", color: "#f59e0b" },
    ],
    tags: ["Term Life", "New Father", "Application Started", "Very High Intent", "Reddit Active"],
    journeySummary: "Brian is a new father who has done all the research, gotten quotes, and started an application. The only friction is the medical history section. A human touchpoint will close this.",
  },
  {
    id: "pg-002",
    dashboardId: "policygenius",
    name: "Angela Vasquez",
    age: 52,
    location: "Atlanta, GA",
    occupation: "Real Estate Agent",
    avatar: "AV",
    avatarColor: "#0284c7",
    buyerDNA: "Empty nester researching whole life and final expense insurance. Motivated by estate planning and leaving a legacy. Comparing multiple providers.",
    engagementScore: 67,
    signals: [
      { date: "May 10", channel: "CTV", action: "Completed ad view", detail: "PolicyGenius whole life insurance spot on Peacock — completed twice", strength: "high" },
      { date: "May 13", channel: "Google Search", action: "Keyword search", detail: '"whole life insurance for 50s" and "final expense insurance vs whole life"', strength: "high" },
      { date: "May 16", channel: "Website", action: "Page visit", detail: "Whole life insurance page + final expense comparison — spent 20 min reading", strength: "high" },
      { date: "May 19", channel: "Email", action: "Opened + clicked", detail: "Opened 'Life Insurance for Every Stage' email — clicked on 'Whole Life for 50+' section", strength: "high" },
      { date: "May 23", channel: "Meta", action: "Ad engagement", detail: "Clicked on 'Is whole life worth it?' Facebook article ad — read the full article", strength: "medium" },
      { date: "May 27", channel: "Website", action: "Return visit", detail: "Returned to PolicyGenius — used quote tool for $200K whole life. Did not complete.", strength: "high" },
    ],
    purchaseWindows: [
      { window: "7 days", probability: 18, reasoning: "Still in education and comparison phase. Whole life is a bigger, more considered decision than term. She needs more information and trust-building before committing." },
      { window: "30 days", probability: 48, reasoning: "Active research + quote tool use = warming up. An educational advisor call focused on estate planning (not sales) could move her to application stage." },
      { window: "6 months", probability: 81, reasoning: "Clear motivation (legacy/estate planning) + active research = a buyer who will purchase. The timeline depends on how quickly she builds trust with a provider." },
    ],
    personalizedMessage: {
      subject: "Angela — a free 20-minute estate planning conversation (no sales pitch)",
      body: "Hi Angela, we noticed you've been researching whole life and final expense insurance options — and we want to make sure you have all the information you need to make the right decision for your family, not just the right product for us to sell. We'd like to offer you a free 20-minute conversation with one of our licensed advisors who specializes in estate planning for clients in their 50s. No sales pitch, no pressure — just answers to your questions about how whole life fits into a broader legacy plan. Would a call this week work for you?",
    },
    mediaRecommendations: [
      { channel: "CTV (Education)", allocation: 30, tactic: "Serve 'Legacy Planning with PolicyGenius' educational spot on Peacock. Target Atlanta, female 48-58, homeowner signals.", color: "#0284c7" },
      { channel: "Email (Advisor)", allocation: 28, tactic: "Free estate planning consultation offer. Advisor-focused, educational tone. No product push. Send Tuesday morning.", color: "#7c3aed" },
      { channel: "Meta (Content)", allocation: 22, tactic: "Retarget with 'Whole Life vs. Final Expense — what's right for you?' article ad. Build trust through education before asking for conversion.", color: "#1877f2" },
      { channel: "Google (Education)", allocation: 14, tactic: "Bid on 'whole life insurance 50s', 'final expense vs whole life', 'estate planning life insurance'. Serve educational landing pages.", color: "#2563eb" },
      { channel: "Email (Nurture)", allocation: 6, tactic: "3-part email series: 'Understanding Whole Life', 'How Much Coverage Do You Need?', 'Real Stories from PolicyGenius Clients'. Weekly cadence.", color: "#16a34a" },
    ],
    tags: ["Whole Life", "Final Expense", "Estate Planning", "Empty Nester", "Education Phase"],
    journeySummary: "Angela is a thoughtful, education-first buyer researching whole life insurance for legacy planning. She needs trust-building and expert guidance before she'll commit — not a sales pitch.",
  },
  {
    id: "pg-003",
    dashboardId: "policygenius",
    name: "James Keller",
    age: 31,
    location: "Nashville, TN",
    occupation: "Nurse Practitioner",
    avatar: "JK",
    avatarColor: "#16a34a",
    buyerDNA: "Employer coverage gap buyer. Just started a new job with a 90-day waiting period. Needs short-term coverage bridge + evaluating long-term term life.",
    engagementScore: 76,
    signals: [
      { date: "May 11", channel: "CTV", action: "Completed ad view", detail: "PolicyGenius 'Coverage Gap' spot on Tubi — watched during a late-night shift break", strength: "medium" },
      { date: "May 14", channel: "Google Search", action: "Keyword search", detail: '"life insurance during employer waiting period" and "short term life insurance 90 days"', strength: "very-high" },
      { date: "May 16", channel: "Website", action: "Page visit", detail: "Term life insurance page + 'How quickly can I get covered?' FAQ — spent 11 min", strength: "high" },
      { date: "May 19", channel: "Email", action: "Opened + clicked", detail: "Opened 'Get covered in 48 hours' email — clicked through to instant decision term life page", strength: "very-high" },
      { date: "May 22", channel: "Meta", action: "Ad engagement", detail: "Clicked on 'No medical exam required' Facebook ad — visited no-exam life insurance page", strength: "high" },
      { date: "May 26", channel: "Website", action: "Return visit", detail: "Returned to PolicyGenius — got quotes for $500K 10-year term. Saved quotes but did not apply.", strength: "very-high" },
    ],
    purchaseWindows: [
      { window: "7 days", probability: 68, reasoning: "Coverage gap urgency is real and time-sensitive. He has quotes saved and clicked on a 'get covered in 48 hours' email. A no-exam, fast-approval offer could close this week." },
      { window: "30 days", probability: 89, reasoning: "His employer waiting period creates a hard deadline. He will buy coverage — the question is whether PolicyGenius closes him before he finds another provider." },
      { window: "6 months", probability: 96, reasoning: "As a nurse practitioner, he understands health risk better than most. He will maintain life insurance coverage long-term. High LTV customer." },
    ],
    personalizedMessage: {
      subject: "James — get $500K in coverage with no medical exam. Approved in 48 hours.",
      body: "Hi James, we know you're in a coverage gap right now with your new job's waiting period — and we want to help you close that gap fast. PolicyGenius can get you $500K in term life coverage with no medical exam required, and most applicants receive a decision within 48 hours. Based on the quotes you saved, you're looking at approximately $28/mo for a 10-year term at your age and health profile. That's less than a streaming subscription for $500K in family protection. Want to complete your application now? It takes about 8 minutes.",
    },
    mediaRecommendations: [
      { channel: "Email (Urgency)", allocation: 42, tactic: "Coverage gap urgency email with no-exam, 48-hour approval CTA. Specific monthly price from his saved quote. Send within 24 hours.", color: "#16a34a" },
      { channel: "CTV Retargeting", allocation: 22, tactic: "Serve 'Get covered in 48 hours' spot on Tubi and Pluto TV. Target Nashville, male 28-36, healthcare worker signals.", color: "#7c3aed" },
      { channel: "Google Retargeting", allocation: 18, tactic: "Retarget on PolicyGenius quote page. Bid on 'life insurance no medical exam', 'term life insurance fast approval'.", color: "#2563eb" },
      { channel: "Meta (Urgency)", allocation: 14, tactic: "Retarget with 'Your coverage gap closes in 48 hours' messaging. Show his $500K quote and monthly price.", color: "#1877f2" },
      { channel: "SMS/Push", allocation: 4, tactic: "Day 3 follow-up: 'James — your $500K quote expires in 48 hours. Complete your application in 8 minutes.' with direct link.", color: "#f59e0b" },
    ],
    tags: ["Term Life", "Coverage Gap", "No Medical Exam", "Fast Approval", "High Urgency"],
    journeySummary: "James has a real, time-sensitive coverage gap and has already gotten quotes. Urgency is his conversion driver — a fast-approval, no-exam offer with his specific quote will close him within 7 days.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// LOOKUP HELPER
// ─────────────────────────────────────────────────────────────────────────────

import { MCCARTY_VOTER_PROFILES } from "./mccartryProfiles";
import { BREEZE_BUYER_PROFILES } from "./breezeProfiles";

export const ALL_PROFILES: BuyerProfile[] = [
  ...LAND_ROVER_PROFILES,
  ...LAMBORGHINI_PROFILES,
  ...WARBY_PROFILES,
  ...POLICYGENIUS_PROFILES,
  ...MCCARTY_VOTER_PROFILES,
  ...BREEZE_BUYER_PROFILES,
];

export function getProfilesByDashboard(dashboardId: BuyerProfile["dashboardId"]): BuyerProfile[] {
  return ALL_PROFILES.filter(p => p.dashboardId === dashboardId);
}

export function getProfileById(id: string): BuyerProfile | undefined {
  return ALL_PROFILES.find(p => p.id === id);
}
