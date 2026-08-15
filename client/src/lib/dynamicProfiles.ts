/**
 * dynamicProfiles.ts
 * Date-seeded daily profile rotation for the six commercial client dashboards.
 * Every day the page loads, a new set of 3 profiles is selected from a larger pool,
 * with all signal dates shifted to be relative to today.
 * Same 3 profiles show all day; they rotate at midnight.
 */

import type { BuyerProfile, IntentSignal, OutreachKit } from "./buyerProfiles";
import { WARBY_PROFILES, POLICYGENIUS_PROFILES } from "./buyerProfiles";
import { BREEZE_BUYER_PROFILES } from "./breezeProfiles";
import { BARRETT_BUYER_PROFILE_CARDS } from "./barrettProfiles";

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

function pickRotatingProfiles<T>(arr: T[], n: number, dashboardId: string): T[] {
  if (arr.length === 0) return [];
  const daysSinceEpoch = Math.floor(Date.now() / 86_400_000);
  const offset = dashboardId.split("").reduce((total, char) => total + char.charCodeAt(0), 0) % arr.length;
  const start = (daysSinceEpoch * n + offset) % arr.length;
  return Array.from({ length: Math.min(n, arr.length) }, (_, index) => arr[(start + index) % arr.length]);
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
    outreachKit: {
      email: {
        subject: "Cameron — your Fuji White Defender 110 with 7-seat config is in stock",
        body: "Cameron,\n\nWe noticed you built a Fuji White Defender 110 with the 7-seat option and tow package on our configurator — and we have that exact spec in stock right now.\n\nWe can also take your BMW X5 M on trade and structure a deal that makes the monthly work. Your payoff is likely around $58K, and current trade values on the X5 M are strong.\n\nWould you like to come in for a private showing this week? I can have the keys ready.\n\n— [Sales Rep Name]\nLand Rover North Scottsdale",
      },
      linkedin: {
        connectionRequest: "Hi Cameron — I'm with Land Rover North Scottsdale. I noticed you've been researching the Defender 110 and wanted to connect. Happy to answer any questions.",
        followUp: "Cameron, thanks for connecting. I wanted to reach out personally — we have a Fuji White Defender 110 with the 7-seat option in stock right now. Given your BMW X5 M, the trade-in timing is actually ideal. Would a private showing work for you this week?",
      },
      facebookAd: {
        headline: "Your Defender 110 Is Ready",
        primaryText: "Cameron, the Fuji White Defender 110 with 7-seat option you configured is in stock at Land Rover North Scottsdale. Strong trade values on BMW X5 M right now. Book a private showing today.",
        cta: "Schedule Private Showing",
      },
      googleAd: {
        headlines: ["Defender 110 In Stock Scottsdale", "7-Seat Defender — Take Your BMW on Trade", "Land Rover North Scottsdale — Book Now"],
        descriptions: ["Fuji White Defender 110 with 7-seat + tow package available now. Strong BMW X5 M trade values.", "Private showings available. Finance-ready buyers welcome. Call or book online today."],
        keywords: ["Defender 110 in stock Scottsdale", "Land Rover Defender 7 seat AZ", "BMW X5 trade in Land Rover", "Defender 110 tow package"],
      },
      directMail: {
        headline: "Your Defender 110 Is Waiting",
        body: "Cameron — the Fuji White Defender 110 with 7-seat option and tow package you configured is in stock at Land Rover North Scottsdale. We're also seeing strong trade values on BMW X5 M right now. Call [phone] or visit us at [address] to schedule a private showing. This unit won't last.",
      },
    },
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
    outreachKit: {
      email: {
        subject: "Natalie — your two saved CPO Range Rover Sport units + a safety note",
        body: "Natalie,\n\nYou saved two CPO Range Rover Sport units on our site, and I wanted to reach out personally before they move.\n\nBoth units have passed our 165-point CPO inspection and carry the full manufacturer warranty. The Range Rover Sport received a Top Safety Pick+ from IIHS — the same rating you were researching.\n\nI'd love to schedule a test drive for you and your family this weekend. Which day works best?\n\n— [Sales Rep Name]\nLand Rover North Scottsdale",
      },
      linkedin: {
        connectionRequest: "Hi Natalie — I'm with Land Rover North Scottsdale. I saw you've been researching the Range Rover Sport for your family and wanted to connect.",
        followUp: "Natalie, thanks for connecting. I wanted to personally follow up on the two CPO Range Rover Sport units you saved. Both are still available and carry the full IIHS Top Safety Pick+ rating you were researching. Would a family test drive this weekend work for you?",
      },
      facebookAd: {
        headline: "Top Safety Pick+ — CPO Range Rover Sport",
        primaryText: "Natalie, your two saved CPO Range Rover Sport units are still available at Land Rover North Scottsdale. IIHS Top Safety Pick+. Full manufacturer warranty. Up to $18K below new MSRP. Schedule your family test drive today.",
        cta: "Book Family Test Drive",
      },
      googleAd: {
        headlines: ["CPO Range Rover Sport Scottsdale", "IIHS Top Safety Pick+ — In Stock Now", "Save $18K vs New — CPO Warranty Included"],
        descriptions: ["Certified Pre-Owned Range Rover Sport with full manufacturer warranty. IIHS Top Safety Pick+. Available now.", "Family-ready luxury SUV. CPO inspection certified. Book your test drive at Land Rover North Scottsdale."],
        keywords: ["CPO Range Rover Sport Scottsdale", "safest luxury SUV 2024", "Range Rover Sport CPO AZ", "Range Rover Sport vs Defender 130"],
      },
      directMail: {
        headline: "The Safest Luxury SUV — Now CPO Certified",
        body: "Natalie — the two CPO Range Rover Sport units you saved are still available. Both carry IIHS Top Safety Pick+ and the full manufacturer warranty — at up to $18,000 below new MSRP. Call [phone] or visit Land Rover North Scottsdale to schedule your family test drive.",
      },
    },
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
    outreachKit: {
      email: {
        subject: "Troy — Defender 90 lease from $879/mo + the accessory build you've been planning",
        body: "Troy,\n\nI noticed you've been deep in Defender 90 research — overlanding builds, accessories, and community forums. I wanted to reach out personally.\n\nWe have a Defender 90 available now, and current lease rates start at $879/mo with $0 down. We can also include a factory accessory credit so you can start building it out from day one.\n\nWant to come in and see it? I'll have it pulled out front for you.\n\n— [Sales Rep Name]\nLand Rover North Scottsdale",
      },
      linkedin: {
        connectionRequest: "Hey Troy — I'm with Land Rover North Scottsdale. Saw you've been researching the Defender 90 for overlanding and wanted to connect.",
        followUp: "Troy, thanks for connecting. I wanted to reach out about the Defender 90 — we have one available now and current lease rates are $879/mo. We can also include an accessory credit to start your build. Would you want to come see it this week?",
      },
      facebookAd: {
        headline: "Defender 90 — Lease from $879/mo",
        primaryText: "Troy, the Defender 90 you've been researching is available now at Land Rover North Scottsdale. Lease from $879/mo with accessory credit included. Built for overlanding. Come see it this week.",
        cta: "See It This Week",
      },
      googleAd: {
        headlines: ["Defender 90 Lease AZ — $879/mo", "Defender 90 vs 4Runner — See the Difference", "Overlanding-Ready Defender 90 In Stock"],
        descriptions: ["Lease a Defender 90 from $879/mo with accessory credit. Pull-ahead available on your 4Runner lease.", "Built for overlanding. Available now at Land Rover North Scottsdale. Book a test drive today."],
        keywords: ["Defender 90 lease AZ", "Defender 90 vs 4Runner", "Defender 90 overlanding build", "Land Rover Defender 90 Scottsdale"],
      },
      directMail: {
        headline: "Built for More. Lease from $879/mo.",
        body: "Troy — the Defender 90 you've been researching is available now at Land Rover North Scottsdale. Lease from $879/mo with an accessory credit to start your build. We can also do a lease pull-ahead on your 4Runner. Call [phone] or stop by — I'll have it ready for you.",
      },
    },
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
    outreachKit: {
      email: {
        subject: "Stephanie — your Defender 130 brochure request + a personal note",
        body: "Stephanie,\n\nThank you for requesting the Defender 130 brochure and for spending time on our configurator. I noticed you also checked your Volvo trade-in value — which tells me you're getting serious.\n\nI'd love to set up a personal call to walk through your exact spec and talk through the trade. We're seeing strong values on Volvo XC90s right now.\n\nWhen works best for a quick 15-minute call?\n\n— [Sales Rep Name]\nLand Rover North Scottsdale",
      },
      linkedin: {
        connectionRequest: "Hi Stephanie — I'm with Land Rover North Scottsdale. I saw you've been researching the Defender 130 and wanted to reach out personally.",
        followUp: "Stephanie, thanks for connecting. I wanted to follow up on your Defender 130 brochure request. You've clearly done your research — I'd love to set up a 15-minute call to walk through your exact spec and discuss your Volvo trade. When works for you?",
      },
      facebookAd: {
        headline: "Stephanie — Your Defender 130 Awaits",
        primaryText: "You've configured it. You've researched it. Now let's make it yours. Land Rover North Scottsdale has Defender 130 units available and strong Volvo XC90 trade values right now. Schedule your personal consultation today.",
        cta: "Schedule Consultation",
      },
      googleAd: {
        headlines: ["Defender 130 — Personal Consultation", "Strong Volvo XC90 Trade Values Now", "Land Rover Defender 130 In Stock Scottsdale"],
        descriptions: ["Defender 130 available now. Strong trade values on Volvo XC90. Personal consultation with no pressure.", "Book your Defender 130 test drive at Land Rover North Scottsdale. Trade-in appraisal included."],
        keywords: ["Defender 130 Scottsdale", "Volvo XC90 trade in Land Rover", "Defender 130 vs Volvo XC90", "Land Rover Defender 130 AZ"],
      },
      directMail: {
        headline: "Your Defender 130 Is Ready When You Are",
        body: "Stephanie — you've done the research. You've configured your exact spec. Now let's make it happen. Land Rover North Scottsdale has Defender 130 units available and we're seeing strong trade values on Volvo XC90 right now. Call [phone] to schedule your personal consultation.",
      },
    },
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
    outreachKit: {
      email: {
        subject: "Marcus — following up on your Defender 130 X test drive",
        body: "Marcus,\n\nIt was great having you in for the Defender 130 X test drive. I know you're comparing it to the Suburban High Country, and I wanted to share a few things that might help.\n\nThe Defender 130 X has a significantly higher tow rating (8,200 lbs vs. 8,000 lbs), a more capable off-road suspension, and a far more distinctive ownership experience. We also have a strong conquest offer available for Suburban owners right now.\n\nWould you like to come back in for a side-by-side comparison? I can have both vehicles ready.\n\n— [Sales Rep Name]\nLand Rover North Scottsdale",
      },
      linkedin: {
        connectionRequest: "Hi Marcus — I'm with Land Rover North Scottsdale. You came in for a Defender 130 X test drive recently and I wanted to follow up personally.",
        followUp: "Marcus, thanks for connecting. I know you're comparing the Defender 130 X to the Suburban High Country. I'd love to share some side-by-side specs and our current conquest offer for Suburban owners. Would a follow-up visit work for you this week?",
      },
      facebookAd: {
        headline: "Defender 130 X vs. Suburban — See the Difference",
        primaryText: "Marcus, you test drove the Defender 130 X. Now compare it side-by-side with the Suburban High Country. Land Rover North Scottsdale has a conquest offer available for Suburban owners. Come back in this week.",
        cta: "Book Comparison Drive",
      },
      googleAd: {
        headlines: ["Defender 130 X vs Suburban High Country", "Conquest Offer for Suburban Owners", "Defender 130 X — 8,200 lb Tow Rating"],
        descriptions: ["Test drove the Defender 130 X? Compare it to your Suburban High Country. Conquest offer available now at Land Rover North Scottsdale.", "Higher tow rating. Better off-road capability. More distinctive. Book your comparison drive today."],
        keywords: ["Defender 130 X vs Suburban High Country", "Land Rover Defender 130 X Scottsdale", "Suburban conquest offer Land Rover", "Defender 130 X tow rating"],
      },
      directMail: {
        headline: "You Drove It. Now Own It.",
        body: "Marcus — you test drove the Defender 130 X. We know you're comparing it to the Suburban High Country. The Defender 130 X has a higher tow rating, better off-road capability, and we have a conquest offer available for Suburban owners right now. Call [phone] to schedule your follow-up visit.",
      },
    },
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
    outreachKit: {
      email: {
        subject: "Jennifer — your two saved Range Rover Sport units + an early termination offer",
        body: "Jennifer,\n\nYou've saved two Range Rover Sport units on our site and you've opened every email we've sent — which tells me you're ready.\n\nI also noticed you checked your Mercedes lease payoff. We have an early termination program that can get you out of your current lease and into a new Range Rover Sport with minimal penalty. I'd love to walk you through the numbers.\n\nCan I give you a quick call this week?\n\n— [Sales Rep Name]\nLand Rover North Scottsdale",
      },
      linkedin: {
        connectionRequest: "Hi Jennifer — I'm with Land Rover North Scottsdale. I noticed you've been researching the Range Rover Sport and wanted to connect.",
        followUp: "Jennifer, thanks for connecting. You've saved two Range Rover Sport units and I know you've been looking at your Mercedes lease payoff. We have an early termination program that can get you out of your lease with minimal penalty. Would a quick call work this week?",
      },
      facebookAd: {
        headline: "Jennifer — Get Out of Your Mercedes Lease Early",
        primaryText: "Land Rover North Scottsdale has an early termination program that can get you into a new Range Rover Sport with minimal penalty. Your two saved units are still available. Call us today.",
        cta: "Get Early Termination Details",
      },
      googleAd: {
        headlines: ["Early Lease Termination — Range Rover Sport", "Get Out of Your Mercedes Lease Now", "Range Rover Sport — Your Two Saved Units Available"],
        descriptions: ["Land Rover North Scottsdale early termination program. Get out of your Mercedes lease with minimal penalty. Range Rover Sport in stock.", "Your saved units are still available. Call today to discuss early termination and trade-in options."],
        keywords: ["Mercedes lease early termination Land Rover", "Range Rover Sport Scottsdale", "lease swap Mercedes to Land Rover", "Range Rover Sport in stock AZ"],
      },
      directMail: {
        headline: "Your Mercedes Lease Doesn't Have to Wait",
        body: "Jennifer — your two saved Range Rover Sport units are still available at Land Rover North Scottsdale. We have an early termination program that can get you out of your Mercedes lease with minimal penalty. Call [phone] to get the numbers today.",
      },
    },
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
    outreachKit: {
      email: {
        subject: "Preston — your Nero Noctis Urus S allocation is confirmed",
        body: "Preston,\n\nThank you for your calls. I wanted to reach out personally to confirm that we have a Nero Noctis Urus S with Senso interior allocation available for you.\n\nI'd like to invite you for a private viewing before it's publicly listed. We can walk through the full spec, discuss delivery timeline, and compare it to the Cayenne Turbo GT availability you've been tracking.\n\nWhen can I have you in?\n\n— [Dealership Principal]\nLamborghini of Scottsdale",
      },
      linkedin: {
        connectionRequest: "Preston — I'm the principal at Lamborghini of Scottsdale. You've called us twice about the Urus S and I wanted to connect directly.",
        followUp: "Preston, thanks for connecting. I have a Nero Noctis Urus S with Senso interior allocation available right now — before it's publicly listed. I'd like to invite you for a private viewing. When works for you?",
      },
      facebookAd: {
        headline: "Your Nero Noctis Urus S Is Ready",
        primaryText: "Preston — Lamborghini of Scottsdale has a Nero Noctis Urus S with Senso interior available for private viewing. Confirmed allocation. No waitlist. Contact us today.",
        cta: "Request Private Viewing",
      },
      googleAd: {
        headlines: ["Urus S Nero Noctis — Private Allocation", "Lamborghini of Scottsdale — Confirmed Stock", "Urus S vs Cayenne Turbo GT — See Both"],
        descriptions: ["Nero Noctis Urus S with Senso interior available now. Private viewing before public listing. Call Lamborghini of Scottsdale.", "Confirmed allocation. No waitlist. Compare Urus S to Cayenne Turbo GT. Schedule your private appointment."],
        keywords: ["Urus S Nero Noctis Scottsdale", "Lamborghini Urus S allocation AZ", "Urus S vs Cayenne Turbo GT", "Lamborghini of Scottsdale"],
      },
      directMail: {
        headline: "Your Allocation Is Confirmed.",
        body: "Preston — Lamborghini of Scottsdale has a Nero Noctis Urus S with Senso interior available for private viewing. This is a confirmed allocation — not a waitlist. Call [phone] or reply to this card to schedule your private appointment.",
      },
    },
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
    outreachKit: {
      email: {
        subject: "Alexis — a private Huracán Tecnica experience, just for you",
        body: "Alexis,\n\nI saw your DM about a test drive and I wanted to reach out personally. We'd love to set up a private, no-pressure Huracán Tecnica experience — just you, the car, and one of our specialists.\n\nNo crowds. No sales floor. Just the car.\n\nWhen works for you?\n\n— [Sales Specialist]\nLamborghini of Scottsdale",
      },
      linkedin: {
        connectionRequest: "Hi Alexis — I'm with Lamborghini of Scottsdale. I saw your message about a test drive and wanted to connect directly.",
        followUp: "Alexis, thanks for connecting. I'd love to set up a private Huracán Tecnica experience for you — no pressure, no crowds. Just you and the car. When works for you this week?",
      },
      facebookAd: {
        headline: "A Private Huracán Experience — Just for You",
        primaryText: "Alexis, Lamborghini of Scottsdale is offering a private, no-pressure Huracán Tecnica experience. No sales floor. No crowds. Just you and the car. Book your private drive today.",
        cta: "Book Private Drive",
      },
      googleAd: {
        headlines: ["Private Huracán Tecnica Test Drive", "Lamborghini of Scottsdale — No Pressure", "First Lamborghini? We'll Make It Special"],
        descriptions: ["Private, no-pressure Huracán Tecnica experience at Lamborghini of Scottsdale. No crowds. Just you and the car.", "First-time Lamborghini buyer? We specialize in making it memorable. Book your private drive today."],
        keywords: ["Huracán Tecnica test drive Scottsdale", "Lamborghini private experience AZ", "buy Lamborghini Huracán Scottsdale", "Lamborghini of Scottsdale"],
      },
      directMail: {
        headline: "Your Private Huracán Experience Awaits.",
        body: "Alexis — Lamborghini of Scottsdale is inviting you to a private, no-pressure Huracán Tecnica experience. No sales floor. No crowds. Just you and the car. Call [phone] to book your private drive.",
      },
    },
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
    outreachKit: {
      email: {
        subject: "Diane — a private Urus Performante track experience, by invitation only",
        body: "Diane,\n\nYou've been comparing the Urus Performante to your Taycan Turbo S, and I wanted to invite you to something special.\n\nWe're hosting a private track experience for a small group of serious buyers — a chance to push the Urus Performante on a closed course and feel the difference yourself.\n\nThis is by invitation only. Would you like to join us?\n\n— [Sales Specialist]\nLamborghini of Scottsdale",
      },
      linkedin: {
        connectionRequest: "Hi Diane — I'm with Lamborghini of Scottsdale. I know you've been comparing the Urus Performante to your Taycan Turbo S and wanted to reach out.",
        followUp: "Diane, thanks for connecting. We're hosting a private track experience for a small group of serious buyers — a chance to push the Urus Performante on a closed course. This is by invitation only. Would you like to join us?",
      },
      facebookAd: {
        headline: "Urus Performante — Private Track Experience",
        primaryText: "Diane, Lamborghini of Scottsdale is hosting a private track experience for serious Urus Performante buyers. Push it on a closed course. Compare it to your Taycan Turbo S. By invitation only.",
        cta: "Request Your Invitation",
      },
      googleAd: {
        headlines: ["Urus Performante vs Taycan Turbo S", "Private Track Day — Lamborghini Scottsdale", "Urus Performante — By Invitation Only"],
        descriptions: ["Compare the Urus Performante to your Porsche Taycan Turbo S on a private track. Invitation-only event at Lamborghini of Scottsdale.", "Serious buyers only. Private track experience. Push the Urus Performante on a closed course. Request your invitation."],
        keywords: ["Urus Performante vs Taycan Turbo S", "Lamborghini Urus Performante Scottsdale", "private track day Lamborghini AZ", "Urus Performante test drive"],
      },
      directMail: {
        headline: "By Invitation Only.",
        body: "Diane — Lamborghini of Scottsdale is hosting a private track experience for a small group of serious Urus Performante buyers. Push it on a closed course. Compare it to your Taycan Turbo S. This invitation is exclusive. Call [phone] to confirm your spot.",
      },
    },
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
    outreachKit: {
      email: {
        subject: "Victor — your Urus S delivery date is ready to confirm",
        body: "Victor,\n\nThank you for coming in and for confirming your cash purchase. I wanted to reach out personally to let you know we're ready to confirm your delivery date.\n\nWe can have the Urus S prepped, detailed, and ready for delivery within the week. I'd love to make this a proper handover experience — champagne, photos, the works.\n\nWhen would you like to take delivery?\n\n— [Sales Manager]\nLamborghini of Scottsdale",
      },
      linkedin: {
        connectionRequest: "Victor — I'm the sales manager at Lamborghini of Scottsdale. You test drove the Urus S and confirmed your purchase. I wanted to connect directly to coordinate delivery.",
        followUp: "Victor, thanks for connecting. We're ready to confirm your Urus S delivery date. We can have it ready within the week. I'd love to make this a proper handover experience. When works for you?",
      },
      facebookAd: {
        headline: "Victor — Your Urus S Is Ready for Delivery",
        primaryText: "Lamborghini of Scottsdale is ready to confirm your Urus S delivery date. Cash purchase confirmed. We'll make it a handover experience you won't forget. Call us today.",
        cta: "Confirm Delivery Date",
      },
      googleAd: {
        headlines: ["Urus S Delivery — Confirm Your Date", "Lamborghini of Scottsdale — Ready Now", "Cash Purchase Urus S — Delivery This Week"],
        descriptions: ["Your Urus S is ready. Confirm your delivery date at Lamborghini of Scottsdale. Cash purchase. No delays.", "We'll make it a proper handover experience. Call today to confirm your Urus S delivery date."],
        keywords: ["Urus S delivery Scottsdale", "Lamborghini Urus S cash purchase AZ", "Lamborghini of Scottsdale delivery", "buy Urus S Scottsdale"],
      },
      directMail: {
        headline: "Your Urus S Is Ready.",
        body: "Victor — Lamborghini of Scottsdale is ready to confirm your Urus S delivery date. Cash purchase confirmed. We can have it prepped and ready within the week. Call [phone] to schedule your handover.",
      },
    },
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
    outreachKit: {
      email: {
        subject: "Rachel — a private Urus S consultation, just for you",
        body: "Rachel,\n\nThank you for attending our event and for test driving the Urus S. I wanted to follow up personally.\n\nI'd love to set up a private consultation — just you and one of our female specialists — to walk through your exact configuration and answer any questions without the noise of the showroom.\n\nWhen works best for you?\n\n— [Female Sales Specialist]\nLamborghini of Scottsdale",
      },
      linkedin: {
        connectionRequest: "Hi Rachel — I'm a specialist at Lamborghini of Scottsdale. You attended our event and test drove the Urus S. I wanted to follow up personally.",
        followUp: "Rachel, thanks for connecting. I'd love to set up a private consultation for you — just you and me, walking through your exact Urus S configuration. No pressure, no showroom noise. When works for you?",
      },
      facebookAd: {
        headline: "Rachel — Your Private Urus S Consultation",
        primaryText: "Lamborghini of Scottsdale is offering a private, female-forward Urus S consultation. You test drove it. Now let's configure it exactly the way you want it. Book your private session today.",
        cta: "Book Private Consultation",
      },
      googleAd: {
        headlines: ["Private Urus S Consultation — Scottsdale", "Female-Forward Lamborghini Experience", "Configure Your Urus S — No Pressure"],
        descriptions: ["Private Urus S consultation at Lamborghini of Scottsdale. Female specialist. No pressure. Configure your exact spec.", "You test drove it. Now make it yours. Book a private Urus S consultation at Lamborghini of Scottsdale."],
        keywords: ["Urus S Scottsdale private consultation", "Lamborghini female buyer AZ", "Urus S configuration Scottsdale", "Lamborghini of Scottsdale women"],
      },
      directMail: {
        headline: "Your Private Urus S Consultation Awaits.",
        body: "Rachel — Lamborghini of Scottsdale is offering a private, female-forward Urus S consultation. You test drove it at our event. Now let's configure it exactly the way you want it. Call [phone] to book your private session.",
      },
    },
  },
  {
    id: "lb-p06", dashboardId: "lamborghini",
    name: "Marisol Vega", age: 42, location: "Paradise Valley, AZ",
    occupation: "Chief Financial Officer, Regional Health Network", avatar: "MV", avatarColor: "#0f766e",
    buyerDNA: "Executive replacing a Mercedes G 63 with a refined daily-performance SUV. Values discretion, scheduling control, and a concise, data-led purchase process.",
    engagementScore: 94,
    signals: [
      { channel: "CTV", action: "Completed ad view", detail: "Watched the Urus SE efficiency-and-performance spot through completion on a business-travel hotel stream", strength: "high" },
      { channel: "Google Search", action: "Comparison research", detail: "Searched 'Urus SE real-world range' and 'Urus SE vs G 63 daily driving'", strength: "very-high" },
      { channel: "Website", action: "Model comparison", detail: "Compared Urus SE and Urus S dimensions, rear-seat specifications, and available driver-assistance features for 17 minutes", strength: "high" },
      { channel: "Concierge", action: "Live chat", detail: "Asked for a weekday private appointment outside showroom hours and requested a concise ownership-cost overview", strength: "very-high" },
      { channel: "Calendar", action: "Appointment request", detail: "Selected a Tuesday morning private Urus SE walkaround and asked that no financing paperwork be prepared in advance", strength: "very-high" },
    ],
    purchaseWindows: [
      { window: "7 days", probability: 68, reasoning: "She has chosen the model category and requested a controlled appointment; the next interaction is the decision point." },
      { window: "30 days", probability: 86, reasoning: "A specific scheduling request and model comparison indicate an active replacement cycle rather than casual browsing." },
      { window: "6 months", probability: 96, reasoning: "Her existing vehicle and executive use case make a luxury SUV replacement highly likely this year." },
    ],
    personalizedMessage: { subject: "Marisol — your private Urus SE appointment is reserved", body: "Marisol, your requested weekday Urus SE walkaround is reserved. We will have a single vehicle prepared, the specifications you reviewed on hand, and a concise ownership comparison ready when you arrive." },
    mediaRecommendations: [
      { channel: "Personal Concierge", allocation: 45, tactic: "Confirm her requested appointment with one point of contact and a short ownership brief; do not use a high-volume sales cadence.", color: "#0f766e" },
      { channel: "Email", allocation: 30, tactic: "Send a one-page Urus SE versus G 63 daily-use comparison before the appointment.", color: "#7c3aed" },
      { channel: "CTV Retargeting", allocation: 15, tactic: "Use Urus SE refinement and daily usability creative in business-travel viewing environments.", color: "#38bdf8" },
      { channel: "Direct Mail", allocation: 10, tactic: "Deliver a minimal, premium appointment confirmation card after she visits.", color: "#f59e0b" },
    ],
    tags: ["Urus SE", "Executive Replacement", "Private Appointment", "Discretion", "High Intent"],
    journeySummary: "Marisol is not accessory-shopping; she is choosing a quieter, more controlled purchase experience for a practical executive replacement. A punctual private appointment and concise comparison are the right next step.",
  },
  {
    id: "lb-p07", dashboardId: "lamborghini",
    name: "Trent Nakamura", age: 49, location: "Scottsdale, AZ",
    occupation: "Hospitality Group Owner", avatar: "TN", avatarColor: "#d4a017",
    buyerDNA: "Lease-maturity buyer whose Range Rover Autobiography term ends this quarter. Exploring a Urus S because he wants a higher-energy arrival experience for hospitality events.",
    engagementScore: 88,
    signals: [
      { channel: "Email", action: "Opened", detail: "Opened a dealership ownership newsletter focused on lease-turnover timing and current Urus S arrivals", strength: "medium" },
      { channel: "Financial Services", action: "Lease maturity check", detail: "Reviewed the remaining term and residual value on a Range Rover Autobiography lease", strength: "very-high" },
      { channel: "Website", action: "Inventory watchlist", detail: "Saved two Urus S units and revisited their delivery-estimate panels on three separate days", strength: "very-high" },
      { channel: "Phone", action: "Trade-in question", detail: "Asked whether an early evaluation can be completed before the lease end date", strength: "high" },
      { channel: "Website", action: "Deal estimator", detail: "Used the payment-versus-cash comparison tool without submitting a credit application", strength: "medium" },
    ],
    purchaseWindows: [
      { window: "7 days", probability: 54, reasoning: "He needs an early trade evaluation before the lease date drives the timetable." },
      { window: "30 days", probability: 79, reasoning: "Saved inventory and lease research point to a planned turnover within the current quarter." },
      { window: "6 months", probability: 93, reasoning: "The scheduled lease maturity gives this journey a clear, real deadline." },
    ],
    personalizedMessage: { subject: "Trent — an early appraisal before your lease-maturity decision", body: "Trent, we can complete a no-obligation appraisal before your lease maturity and walk through the two Urus S units you saved. That will give you a clear answer without forcing a decision today." },
    mediaRecommendations: [
      { channel: "Personal Outreach", allocation: 40, tactic: "Assign a trade specialist to schedule an early appraisal around his hospitality operating hours.", color: "#d4a017" },
      { channel: "Email", allocation: 30, tactic: "Send the two saved units with arrival timing and a transparent lease-transition checklist.", color: "#7c3aed" },
      { channel: "Google Retargeting", allocation: 20, tactic: "Reach him on lease-maturity and Urus S inventory queries, not aftermarket searches.", color: "#38bdf8" },
      { channel: "CTV Retargeting", allocation: 10, tactic: "Use arrival-and-presence creative that fits his hospitality-host identity.", color: "#14b8a6" },
    ],
    tags: ["Urus S", "Lease Maturity", "Saved Inventory", "Trade Evaluation", "Planned Turnover"],
    journeySummary: "Trent's journey is governed by a lease clock. His best next step is an early appraisal and a transparent transition plan—not a generic follow-up campaign.",
  },
  {
    id: "lb-p08", dashboardId: "lamborghini",
    name: "Imani Brooks", age: 37, location: "Phoenix, AZ",
    occupation: "Chief Operating Officer, Technology Services Firm", avatar: "IB", avatarColor: "#38bdf8",
    buyerDNA: "Relocating executive who wants a performance SUV delivered soon after settling in Arizona. She is researching remotely and values a complete video-first buying process.",
    engagementScore: 83,
    signals: [
      { channel: "Google Search", action: "Local-market research", detail: "Searched 'Lamborghini Urus in stock Phoenix delivery' while researching Scottsdale neighborhoods", strength: "high" },
      { channel: "Website", action: "Remote inventory visit", detail: "Viewed in-stock Urus S inventory from an out-of-state IP and used the distance-to-dealer map", strength: "high" },
      { channel: "Concierge", action: "Video request", detail: "Requested a live video walkaround of a Blu Eleos Urus S before her relocation date", strength: "very-high" },
      { channel: "Phone", action: "Logistics call", detail: "Asked about vehicle holding, delivery timing, and Arizona registration steps", strength: "very-high" },
      { channel: "Website", action: "Return visit", detail: "Revisited the same VIN page after receiving a relocation checklist", strength: "high" },
    ],
    purchaseWindows: [
      { window: "7 days", probability: 39, reasoning: "She has a strong product preference but needs her move timeline confirmed." },
      { window: "30 days", probability: 72, reasoning: "A requested walkaround and logistics call make this a concrete relocation purchase." },
      { window: "6 months", probability: 90, reasoning: "Her relocation provides a natural new-market vehicle purchase event." },
    ],
    personalizedMessage: { subject: "Imani — your remote Urus S walkaround and delivery timeline", body: "Imani, we can host a live walkaround of the Blu Eleos Urus S and map the timing from your move date through Arizona delivery. We will keep the process video-first until you are ready to visit." },
    mediaRecommendations: [
      { channel: "Concierge Video", allocation: 45, tactic: "Schedule a live, single-vehicle video walkaround with delivery and registration questions answered in one session.", color: "#38bdf8" },
      { channel: "Email", allocation: 25, tactic: "Send a relocation-to-delivery timeline and the exact vehicle specification sheet.", color: "#7c3aed" },
      { channel: "Google Retargeting", allocation: 20, tactic: "Target local-market and in-stock Urus delivery searches as her relocation approaches.", color: "#14b8a6" },
      { channel: "CTV Retargeting", allocation: 10, tactic: "Keep an understated Urus S ownership message present during her Arizona market research.", color: "#f59e0b" },
    ],
    tags: ["Urus S", "Relocation", "Remote Buyer", "Video Walkaround", "Delivery Planning"],
    journeySummary: "Imani is on a relocation clock and is buying remotely. A remote walkaround and delivery plan matter more than an in-store event or accessory content.",
  },
  {
    id: "lb-p09", dashboardId: "lamborghini",
    name: "Owen Calder", age: 61, location: "Fountain Hills, AZ",
    occupation: "Private Investor", avatar: "OC", avatarColor: "#9333ea",
    buyerDNA: "Collector exploring his next allocation after a Ferrari 812 GTS. Values scarcity, provenance, and a serious conversation about future Lamborghini allocation rather than immediate retail inventory.",
    engagementScore: 86,
    signals: [
      { channel: "Print", action: "Editorial engagement", detail: "Visited long-form coverage of limited-production Lamborghini models and collector-market history", strength: "high" },
      { channel: "Website", action: "Heritage content visit", detail: "Read the Revuelto and limited-series ownership pages, then downloaded the collector consultation request", strength: "very-high" },
      { channel: "Phone", action: "Allocation inquiry", detail: "Asked the dealership principal how collector relationship history affects future allocation conversations", strength: "very-high" },
      { channel: "Dealership", action: "Private consultation request", detail: "Requested a quiet consultation focused on model horizon and ownership provenance rather than a showroom test drive", strength: "very-high" },
    ],
    purchaseWindows: [
      { window: "7 days", probability: 31, reasoning: "His immediate action is relationship-building, not a retail close." },
      { window: "30 days", probability: 49, reasoning: "A private allocation conversation could convert to a deposit if the right opportunity appears." },
      { window: "6 months", probability: 82, reasoning: "Collector interest is durable and tied to future model availability." },
    ],
    personalizedMessage: { subject: "Owen — a private collector conversation at your pace", body: "Owen, we would be glad to arrange a private conversation about Lamborghini model horizons, ownership history, and how to build the right relationship for a future allocation. There is no retail presentation attached." },
    mediaRecommendations: [
      { channel: "Dealership Principal", allocation: 55, tactic: "Use a principal-led collector consultation; avoid performance marketing or promotional pricing language.", color: "#9333ea" },
      { channel: "Private Email", allocation: 25, tactic: "Share concise model-horizon material and provenance-focused editorial content.", color: "#d4a017" },
      { channel: "Direct Mail", allocation: 20, tactic: "Send a discreet collector portfolio rather than an inventory brochure.", color: "#0f766e" },
    ],
    tags: ["Collector", "Future Allocation", "Revuelto", "Private Consultation", "Relationship-Led"],
    journeySummary: "Owen is a collector journey, not an in-market retargeting sequence. A principal-led allocation conversation is the appropriate next action.",
  },
  {
    id: "lb-p10", dashboardId: "lamborghini",
    name: "Leila Sethi", age: 45, location: "Paradise Valley, AZ",
    occupation: "Founder, Energy Advisory Firm", avatar: "LS", avatarColor: "#14b8a6",
    buyerDNA: "Considering a Urus SE as a performance-oriented family SUV. Her decision is centered on charging practicality, day-to-day range, and whether hybrid ownership fits an energy-conscious lifestyle.",
    engagementScore: 79,
    signals: [
      { channel: "YouTube", action: "Long-form view", detail: "Watched an Urus SE engineering overview and a real-world hybrid-use review through completion", strength: "high" },
      { channel: "Google Search", action: "Practicality research", detail: "Searched 'Urus SE charging time home charger' and 'Urus SE family daily use'", strength: "very-high" },
      { channel: "Website", action: "Ownership tools", detail: "Used the charging and range explainer, then compared Urus SE to Bentayga Hybrid operating assumptions", strength: "high" },
      { channel: "Email", action: "Guide request", detail: "Requested the dealership's hybrid ownership guide and selected family-use as her interest area", strength: "very-high" },
      { channel: "Concierge", action: "Question submitted", detail: "Asked whether a home charging consultation can be coordinated before a test drive", strength: "high" },
    ],
    purchaseWindows: [
      { window: "7 days", probability: 26, reasoning: "She is still resolving ownership-fit questions before she wants a vehicle appointment." },
      { window: "30 days", probability: 63, reasoning: "A guide request and detailed home-charging question show practical evaluation is underway." },
      { window: "6 months", probability: 87, reasoning: "Her need is category-based and will persist once the hybrid ownership questions are answered." },
    ],
    personalizedMessage: { subject: "Leila — a clear Urus SE ownership and charging conversation", body: "Leila, we can arrange a short, practical Urus SE ownership discussion focused on home charging, real-world use, and the questions that matter for your household before you decide whether to drive one." },
    mediaRecommendations: [
      { channel: "Educational Email", allocation: 38, tactic: "Send a concise hybrid ownership guide and answer her charging question directly.", color: "#14b8a6" },
      { channel: "Concierge Consultation", allocation: 32, tactic: "Offer a product specialist conversation before asking for a test drive.", color: "#7c3aed" },
      { channel: "YouTube Retargeting", allocation: 20, tactic: "Use engineering and daily-use Urus SE creative rather than status-led creative.", color: "#38bdf8" },
      { channel: "Direct Mail", allocation: 10, tactic: "Follow with a premium Urus SE ownership overview after the education call.", color: "#f59e0b" },
    ],
    tags: ["Urus SE", "Hybrid Ownership", "Family Use", "Education Journey", "Longer Consideration"],
    journeySummary: "Leila's journey is practical and education-led. She needs credible hybrid-use answers before a drive, not generic urgency or aftermarket content.",
  },
  {
    id: "lb-p11", dashboardId: "lamborghini",
    name: "Julian Verma", age: 54, location: "Scottsdale, AZ",
    occupation: "Managing Director, Restaurant Group", avatar: "JV", avatarColor: "#f59e0b",
    buyerDNA: "Brand-experience buyer who first encountered Lamborghini through a hospitality event. He is responding to the social occasion and a potential executive-hosting vehicle rather than a technical specification chase.",
    engagementScore: 74,
    signals: [
      { channel: "Event", action: "RSVP", detail: "Registered for a sunset reveal event and added a guest from his executive team", strength: "high" },
      { channel: "Email", action: "Opened + clicked", detail: "Opened the event itinerary twice and clicked the RSVP confirmation details", strength: "high" },
      { channel: "Website", action: "Brand story visit", detail: "Visited the Urus lifestyle gallery and dealership hospitality page after the event invitation", strength: "medium" },
      { channel: "Event", action: "Attendance", detail: "Attended the reveal, spoke with a product specialist, and requested to be notified about the next private drive event", strength: "very-high" },
      { channel: "CRM", action: "Follow-up preference", detail: "Selected text-message event invitations rather than sales calls", strength: "high" },
    ],
    purchaseWindows: [
      { window: "7 days", probability: 18, reasoning: "He is engaging with the brand experience and has not yet started a direct product evaluation." },
      { window: "30 days", probability: 46, reasoning: "A follow-up driving event can convert brand affinity into a product conversation." },
      { window: "6 months", probability: 76, reasoning: "His engagement is relationship-led and could mature through relevant private events." },
    ],
    personalizedMessage: { subject: "Julian — the next private Lamborghini driving event", body: "Julian, thank you for joining us at the reveal. We will reserve a place for you at the next intimate driving event and will text you the details before invitations are released more broadly." },
    mediaRecommendations: [
      { channel: "SMS Event Invitation", allocation: 45, tactic: "Respect his stated preference: send one concise invitation to a relevant private drive event.", color: "#f59e0b" },
      { channel: "Email", allocation: 25, tactic: "Follow event attendance with a visual recap and a low-pressure next-event option.", color: "#7c3aed" },
      { channel: "CTV Retargeting", allocation: 20, tactic: "Use hospitality and arrival-experience creative, not price or configuration messaging.", color: "#14b8a6" },
      { channel: "Personal Outreach", allocation: 10, tactic: "Have the specialist he met send a brief personal thank-you before the next event.", color: "#38bdf8" },
    ],
    tags: ["Event Attendee", "Brand Experience", "SMS Preference", "Hospitality", "Nurture"],
    journeySummary: "Julian is a relationship and experience journey. The correct next action is a relevant private drive invitation, not an inventory pitch.",
  },
  {
    id: "lb-p12", dashboardId: "lamborghini",
    name: "Arden Morales", age: 38, location: "Tempe, AZ",
    occupation: "Founder, Motorsport Software Startup", avatar: "AM", avatarColor: "#38bdf8",
    buyerDNA: "Performance enthusiast moving from an Audi R8 into a more usable super-SUV. The buying trigger is proving the driving experience, not acquiring a customized build.",
    engagementScore: 76,
    signals: [
      { channel: "Podcast", action: "Content engagement", detail: "Clicked from a motorsport technology podcast episode to the Urus Performante performance page", strength: "medium" },
      { channel: "Google Search", action: "Performance research", detail: "Searched 'Urus Performante lap time' and 'Urus Performante vs DBX 707 handling'", strength: "very-high" },
      { channel: "Website", action: "Technical visit", detail: "Read the performance, chassis, and drive-mode specifications; spent 15 minutes on telemetry content", strength: "high" },
      { channel: "Experience", action: "Drive interest", detail: "Requested notification for the next controlled-road or track-oriented demonstration", strength: "very-high" },
      { channel: "Email", action: "Content click", detail: "Clicked a comparison article about performance SUV driving dynamics", strength: "high" },
    ],
    purchaseWindows: [
      { window: "7 days", probability: 21, reasoning: "He needs a credible driving experience before his purchase timing becomes immediate." },
      { window: "30 days", probability: 57, reasoning: "He has defined the performance comparison set and asked for a demonstration." },
      { window: "6 months", probability: 84, reasoning: "The category transition from a two-seat sports car to a usable performance SUV is meaningful and durable." },
    ],
    personalizedMessage: { subject: "Arden — a performance-focused Urus Performante drive", body: "Arden, we will keep you first in line for our next performance-focused Urus demonstration. It will be built around how the vehicle drives—not a showroom sales presentation." },
    mediaRecommendations: [
      { channel: "Performance Experience", allocation: 40, tactic: "Invite him to a controlled demonstration where a specialist can answer chassis and drive-mode questions.", color: "#38bdf8" },
      { channel: "Technical Email", allocation: 30, tactic: "Share focused performance comparisons and driving-dynamics material.", color: "#7c3aed" },
      { channel: "YouTube Retargeting", allocation: 20, tactic: "Use engineering and handling content, avoiding lifestyle or accessory messaging.", color: "#14b8a6" },
      { channel: "Google Retargeting", allocation: 10, tactic: "Target competitive performance-SUV research terms.", color: "#f59e0b" },
    ],
    tags: ["Urus Performante", "Driving Experience", "Performance Research", "Audi Conquest", "Consideration"],
    journeySummary: "Arden is evaluating driving credibility. A track-oriented demonstration and technical conversation will advance this journey; accessory merchandising will not.",
  },
  {
    id: "lb-p13", dashboardId: "lamborghini",
    name: "Caleb Roth", age: 57, location: "Carefree, AZ",
    occupation: "Logistics Executive", avatar: "CR", avatarColor: "#0f766e",
    buyerDNA: "Current Aston Martin DBX owner entering a trade window. His journey is valuation-led: he wants clarity on equity, market timing, and whether a Urus provides the right business-and-weekend vehicle blend.",
    engagementScore: 81,
    signals: [
      { channel: "Market Data", action: "Resale research", detail: "Reviewed market-value ranges and recent transaction trends for a 2023 Aston Martin DBX", strength: "very-high" },
      { channel: "Website", action: "Trade estimator", detail: "Completed an initial non-binding trade estimate using his current vehicle details", strength: "very-high" },
      { channel: "Google Search", action: "Competitive research", detail: "Searched 'Urus S resale value' and 'Urus S vs DBX long-term value'", strength: "high" },
      { channel: "Concierge", action: "Valuation request", detail: "Asked for a preliminary appraisal appointment and a side-by-side ownership cost conversation", strength: "very-high" },
      { channel: "Website", action: "Return visit", detail: "Returned to an in-stock Urus S after reviewing the trade-estimate confirmation", strength: "high" },
    ],
    purchaseWindows: [
      { window: "7 days", probability: 47, reasoning: "A completed estimate and requested appraisal create a clear near-term decision point." },
      { window: "30 days", probability: 74, reasoning: "He is actively weighing equity and value retention, not merely browsing models." },
      { window: "6 months", probability: 91, reasoning: "The mature trade window supports a likely replacement once the numbers are clear." },
    ],
    personalizedMessage: { subject: "Caleb — a clear DBX-to-Urus appraisal conversation", body: "Caleb, we can prepare a straightforward preliminary appraisal and walk through the Urus S ownership case next to your DBX. The goal is to give you decision-quality numbers before you commit to a next step." },
    mediaRecommendations: [
      { channel: "Trade Specialist", allocation: 45, tactic: "Lead with a transparent, appointment-based appraisal and market context.", color: "#0f766e" },
      { channel: "Email", allocation: 30, tactic: "Send a concise ownership-value comparison built around his existing DBX.", color: "#7c3aed" },
      { channel: "Google Retargeting", allocation: 15, tactic: "Use valuation and competitive SUV value messaging, not creative customization.", color: "#38bdf8" },
      { channel: "Direct Mail", allocation: 10, tactic: "Follow the appraisal with a premium, factual trade review packet.", color: "#f59e0b" },
    ],
    tags: ["Urus S", "Aston Martin Conquest", "Trade Appraisal", "Resale Value", "Decision-Ready"],
    journeySummary: "Caleb is using equity and resale-value logic to govern his timing. A clear appraisal is more relevant than a generic test-drive invitation.",
  },
  {
    id: "lb-p14", dashboardId: "lamborghini",
    name: "Talia Okeke", age: 33, location: "Scottsdale, AZ",
    occupation: "Architect and Studio Principal", avatar: "TO", avatarColor: "#d4a017",
    buyerDNA: "Referral-led first Lamborghini consideration. She responds to design, service, and a low-pressure concierge experience, and wants to understand how an Urus fits both client-facing work and personal travel.",
    engagementScore: 71,
    signals: [
      { channel: "Referral", action: "Introduction", detail: "A current owner referred her to a client experience specialist for a first Lamborghini conversation", strength: "very-high" },
      { channel: "Website", action: "Design exploration", detail: "Spent time with color, material, and interior-design galleries rather than technical configuration tools", strength: "high" },
      { channel: "Instagram", action: "Organic engagement", detail: "Saved dealership posts featuring client delivery experiences and interior craftsmanship", strength: "medium" },
      { channel: "Concierge", action: "Preference call", detail: "Asked for a short conversation about ownership, service pickup, and private viewing options before selecting a model", strength: "very-high" },
      { channel: "Website", action: "Return visit", detail: "Returned to Urus S interior pages after the concierge call", strength: "high" },
    ],
    purchaseWindows: [
      { window: "7 days", probability: 17, reasoning: "She is establishing trust and understanding the ownership experience before she wants a transaction." },
      { window: "30 days", probability: 43, reasoning: "A referred, concierge-led conversation can develop quickly if the experience remains personal." },
      { window: "6 months", probability: 78, reasoning: "Her design and service priorities make this a real first-luxury purchase path, but not an urgency play." },
    ],
    personalizedMessage: { subject: "Talia — an introduction to Lamborghini ownership, on your terms", body: "Talia, thank you for the introduction. We would be pleased to arrange a short private conversation about ownership, service, and the Urus experience before you decide whether a vehicle viewing is useful." },
    mediaRecommendations: [
      { channel: "Client Experience Specialist", allocation: 45, tactic: "Keep one consistent concierge contact and begin with her ownership and service questions.", color: "#d4a017" },
      { channel: "Email", allocation: 25, tactic: "Share design-led Urus material and an explanation of the private viewing process.", color: "#7c3aed" },
      { channel: "Instagram Retargeting", allocation: 20, tactic: "Use craftsmanship and delivery-experience content, avoiding conversion pressure.", color: "#14b8a6" },
      { channel: "Direct Mail", allocation: 10, tactic: "Send a referral acknowledgment with a simple invitation to view when ready.", color: "#38bdf8" },
    ],
    tags: ["Urus S", "Referral", "First Lamborghini", "Design-Led", "Concierge"],
    journeySummary: "Talia is a referral and service-experience journey. A single thoughtful concierge relationship is the correct next action—not a repeated promotional sequence.",
  },
  {
    id: "lb-p15", dashboardId: "lamborghini",
    name: "Sasha Feldman", age: 47, location: "Paradise Valley, AZ",
    occupation: "Venture Partner, Southwest Venture Fund", avatar: "SF", avatarColor: "#a78bfa",
    buyerDNA: "Aspirational brand explorer moving from a Bentley Continental GT into a more versatile second vehicle. Her interest began with ownership community and design culture—not an active transaction timeline.",
    engagementScore: 63,
    signals: [
      { channel: "Newsletter", action: "Subscription", detail: "Subscribed to dealership event and ownership-culture updates after reading a design-focused delivery story", strength: "medium" },
      { channel: "Instagram", action: "Organic engagement", detail: "Saved posts about Lamborghini club drives and commented on a client delivery experience", strength: "medium" },
      { channel: "Website", action: "Brand exploration", detail: "Read the Urus ownership overview and viewed the customer-experience calendar without opening inventory", strength: "medium" },
      { channel: "Event", action: "Interest registered", detail: "Asked to be considered for a future owners-and-guests drive rather than a sales appointment", strength: "high" },
      { channel: "Website", action: "Return visit", detail: "Returned to the Urus SE lifestyle page after a club-drive recap was posted", strength: "medium" },
    ],
    purchaseWindows: [
      { window: "7 days", probability: 9, reasoning: "Her engagement is cultural and community-led; a hard sales sequence would be premature." },
      { window: "30 days", probability: 27, reasoning: "A relevant drive experience may create a model conversation, but she is not yet evaluating inventory." },
      { window: "6 months", probability: 68, reasoning: "She has established high-quality brand affinity and a plausible second-vehicle need." },
    ],
    personalizedMessage: { subject: "Sasha — a future Lamborghini owners-and-guests drive", body: "Sasha, we will keep you informed about our next owners-and-guests driving experience. It is designed to let you spend time with the community and the vehicles without turning the day into a sales appointment." },
    mediaRecommendations: [
      { channel: "Event Nurture", allocation: 45, tactic: "Invite her to one relevant community drive and preserve a low-pressure cadence.", color: "#a78bfa" },
      { channel: "Editorial Email", allocation: 30, tactic: "Share ownership stories and design-led event recaps rather than inventory alerts.", color: "#7c3aed" },
      { channel: "Instagram Retargeting", allocation: 15, tactic: "Use club-drive and ownership-community creative aligned with her organic engagement.", color: "#14b8a6" },
      { channel: "Personal Outreach", allocation: 10, tactic: "Have the community host send a short welcome before the next drive event.", color: "#d4a017" },
    ],
    tags: ["Brand Explorer", "Community", "Owners Event", "Urus SE", "Long-Cycle Nurture"],
    journeySummary: "Sasha is a long-cycle community journey. Relevant owner experiences build trust; inventory pressure or an aftermarket-parts sequence would be counterproductive.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// STATIC POOLS — Warby Parker, PolicyGenius, Breeze, Barrett
// These use the static profiles from their respective files.
// ─────────────────────────────────────────────────────────────────────────────
const WARBY_POOL: RawProfile[] = WARBY_PROFILES as RawProfile[];
const PG_POOL: RawProfile[] = POLICYGENIUS_PROFILES as RawProfile[];
const BREEZE_POOL: RawProfile[] = BREEZE_BUYER_PROFILES as RawProfile[];
const BARRETT_POOL: RawProfile[] = BARRETT_BUYER_PROFILE_CARDS as RawProfile[];

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT: getDailyProfiles
// ─────────────────────────────────────────────────────────────────────────────
type DashboardId = "land-rover" | "lamborghini" | "warby-parker" | "policygenius" | "breeze-insurance" | "barrett-financial";

const POOL_MAP: Record<string, RawProfile[]> = {
  "land-rover": LR_POOL,
  "lamborghini": LAMBO_POOL,
  "warby-parker": WARBY_POOL,
  "policygenius": PG_POOL,
  "breeze-insurance": BREEZE_POOL,
  "barrett-financial": BARRETT_POOL,
};

/**
 * Returns 3 profiles for the given dashboard in a deterministic daily rotation.
 * The same 3 profiles are returned all day; every new day advances to the next
 * group so profiles do not repeat until the available pool has been covered.
 * Dates in signals are shifted to be relative to today.
 */
export function getDailyProfiles(dashboardId: DashboardId): BuyerProfile[] {
  const pool = POOL_MAP[dashboardId];
  if (!pool || pool.length === 0) return [];

  const rng = seedRng(todaySeed(dashboardId));
  const picked = pickRotatingProfiles(pool, 3, dashboardId);

  return picked.map(p => ({
    ...p,
    engagementScore: jitterScore(p.engagementScore, rng),
    signals: shiftSignalDates(p.signals as IntentSignal[]),
  }));
}

export { LR_POOL, LAMBO_POOL };
