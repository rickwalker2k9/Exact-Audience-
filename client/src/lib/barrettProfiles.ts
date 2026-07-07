/**
 * barrettProfiles.ts
 * Three featured Barrett Financial buyer profiles — SiteID-identified mortgage shoppers
 * with full 30-day research journeys showing competitor visits and no form submission.
 */
import type { BuyerProfile } from "./buyerProfiles";

export const BARRETT_BUYER_PROFILE_CARDS: BuyerProfile[] = [
  {
    id: "bf-001",
    dashboardId: "barrett-financial",
    name: "Michael Thornton",
    age: 38,
    location: "Scottsdale, AZ 85251",
    occupation: "Software Engineer at Intel",
    avatar: "MT",
    avatarColor: "#1d4ed8",
    buyerDNA: "Move-up buyer with $420K equity, researching $720K jumbo loan across 4 lenders. Visited /contact twice but never submitted. 14 total site visits over 30 days.",
    engagementScore: 94,
    signals: [
      { date: "May 4",  channel: "Google Search",     action: "Searched mortgage brokers",   detail: '"best mortgage brokers scottsdale az" — 8 results reviewed', strength: "medium",    phase: "lookback" },
      { date: "May 5",  channel: "Zillow",             action: "Home browsing",               detail: "Browsed 4 homes, $850K–$1.1M, 85255 zip — saved 2 listings", strength: "high",      phase: "lookback" },
      { date: "May 7",  channel: "Realtor.com",        action: "Saved listings",              detail: "Saved 3 listings in North Scottsdale — avg price $940K", strength: "medium",    phase: "lookback" },
      { date: "May 9",  channel: "NerdWallet",         action: "Mortgage calculator",         detail: "$720K loan at 6.8% — monthly payment $4,706", strength: "high",      phase: "lookback" },
      { date: "May 11", channel: "Google Search Ad",   action: "Clicked Barrett ad",          detail: "Landed on /loan-programs — spent 3:44", strength: "very-high", phase: "campaign" },
      { date: "May 14", channel: "Rocket Mortgage",    action: "Started application",         detail: "Began pre-approval — abandoned at income verification step", strength: "very-high", phase: "lookback" },
      { date: "May 16", channel: "Meta Ad",            action: "Clicked Barrett retargeting", detail: "Returned to barrettfinancial.com — viewed /jumbo-loans", strength: "very-high", phase: "campaign" },
      { date: "May 18", channel: "barrettfinancial.com", action: "Read reviews",             detail: "Spent 4:12 on /reviews — read 18 testimonials", strength: "high",      phase: "campaign" },
      { date: "May 22", channel: "LoanDepot",          action: "Rate comparison",             detail: "Compared jumbo rates — bounced in 1:20", strength: "medium",    phase: "lookback" },
      { date: "May 24", channel: "barrettfinancial.com", action: "Deep engagement",          detail: "Spent 6:44 on /loan-programs — viewed jumbo + conventional", strength: "very-high", phase: "campaign" },
      { date: "May 26", channel: "barrettfinancial.com", action: "Visited /contact",         detail: "Spent 2:18 on contact page — did NOT submit form", strength: "very-high", phase: "campaign" },
      { date: "Jun 2",  channel: "SiteID.ai",          action: "Identified",                  detail: "SiteID identified Michael Thornton — 14 total visits, 0 form submissions", strength: "very-high", phase: "campaign" },
    ],
    purchaseWindows: [
      { window: "7 days",   probability: 82, reasoning: "Visited /contact twice without submitting — decision is made, just needs a direct outreach." },
      { window: "30 days",  probability: 94, reasoning: "Has been actively researching for 30 days, abandoned Rocket Mortgage, and keeps returning to Barrett." },
      { window: "6 months", probability: 99, reasoning: "Has saved Zillow listings and configured a $720K loan — purchase intent is certain." },
    ],
    personalizedMessage: {
      subject: "Michael — your jumbo loan pre-approval is ready",
      body: "Hi Michael, I noticed you've been researching jumbo loans for your move to North Scottsdale. You visited our site 14 times over the last month and spent time on our /contact page — I wanted to reach out directly. We can pre-approve your $720K jumbo loan in 24 hours with our digital process. No office visit required. Your rate is locked for 60 days.",
    },
    mediaRecommendations: [
      { channel: "Direct Outreach", allocation: 50, tactic: "Personal call/email from a Barrett loan officer within 24 hours. Reference his Zillow activity and jumbo loan research.", color: "#1d4ed8" },
      { channel: "Google Retargeting", allocation: 25, tactic: "Retarget on Rocket Mortgage and LoanDepot exit pages. Bid on 'jumbo loan scottsdale', 'mortgage broker 85255'.", color: "#4285F4" },
      { channel: "Meta Retargeting", allocation: 15, tactic: "Show jumbo loan testimonial creative. Highlight Barrett's 3,000+ loans/month volume and local expertise.", color: "#1877F2" },
      { channel: "Email Sequence", allocation: 10, tactic: "3-email: Day 1 jumbo pre-approval offer, Day 3 rate comparison vs Rocket, Day 7 urgency close.", color: "#10b981" },
    ],
    tags: ["Jumbo Buyer", "14 Site Visits", "Abandoned Rocket Mortgage", "Visited /contact", "High Equity"],
    journeySummary: "Michael spent 30 days researching a $720K jumbo loan, abandoned a Rocket Mortgage application, visited Barrett's /contact page twice without submitting, and was identified by SiteID. He is a direct-outreach close — the highest-value prospect in the identified pool.",
    outreachKit: {
      email: {
        subject: "Michael — your $720K jumbo loan comparison + a rate note",
        body: "Michael,\n\nYou've been comparing $720K jumbo loan options across four lenders. I wanted to reach out personally before rates move.\n\nBarrett Financial has a jumbo product specifically designed for move-up buyers with strong equity positions — and with $420K in equity, you're in an excellent position. We can likely beat the rates you've seen elsewhere and close in 21 days.\n\nCan I pull a custom quote for you today?\n\n— [Loan Officer]\nBarrett Financial Group",
      },
      linkedin: {
        connectionRequest: "Hi Michael — I'm a loan officer at Barrett Financial Group. I noticed you've been comparing jumbo loan options and wanted to connect.",
        followUp: "Michael, thanks for connecting. I know you're comparing $720K jumbo loan options. Barrett Financial specializes in move-up buyers with strong equity positions. We can likely beat the rates you've seen and close in 21 days. Can I pull a custom quote for you?",
      },
      facebookAd: {
        headline: "Michael — Your $720K Jumbo Loan, Simplified",
        primaryText: "You have $420K in equity and you're comparing jumbo loan options. Barrett Financial specializes in move-up buyers like you. Competitive rates. 21-day close. Get your custom quote today.",
        cta: "Get Custom Quote",
      },
      googleAd: {
        headlines: ["$720K Jumbo Loan — Competitive Rates", "Move-Up Buyer? Barrett Financial Specializes", "Jumbo Loan — 21-Day Close Guaranteed"],
        descriptions: ["$420K in equity? Barrett Financial has a jumbo product designed for move-up buyers. Competitive rates and 21-day close.", "Comparing jumbo loan options? Barrett Financial can likely beat your best rate. Get your custom quote today."],
        keywords: ["jumbo loan Scottsdale AZ", "$720K jumbo mortgage", "move-up buyer jumbo loan", "Barrett Financial Group mortgage"],
      },
      directMail: {
        headline: "Your $720K Jumbo Loan — We Can Beat Your Best Rate.",
        body: "Michael — you have $420K in equity and you're comparing jumbo loan options. Barrett Financial specializes in move-up buyers and can likely beat the rates you've seen elsewhere. 21-day close. Call [phone] or visit barrettfinancial.com for your custom quote.",
      },
    },
  },
  {
    id: "bf-002",
    dashboardId: "barrett-financial",
    name: "James Harrington",
    age: 52,
    location: "Scottsdale, AZ 85255",
    occupation: "Orthopedic Surgeon at HonorHealth",
    avatar: "JH",
    avatarColor: "#7c3aed",
    buyerDNA: "Ultra-high-net-worth buyer researching $1.85M jumbo/interest-only loan. Compared Chase Private Client and Wells Fargo Private Mortgage before returning to Barrett 6 times.",
    engagementScore: 98,
    signals: [
      { date: "May 1",  channel: "Google Search",      action: "Searched jumbo rates",       detail: '"jumbo mortgage rates scottsdale 2026" — reviewed top 5 results', strength: "medium",    phase: "lookback" },
      { date: "May 3",  channel: "Zillow Luxury",       action: "Luxury home browsing",       detail: "Browsed 6 homes, $2.1M–$3.4M in 85255 — saved 2 listings", strength: "high",      phase: "lookback" },
      { date: "May 7",  channel: "Chase Private Client","action": "Rate comparison",          detail: "Visited Chase jumbo loan page — bounced after 2:14", strength: "medium",    phase: "lookback" },
      { date: "May 9",  channel: "Google Search Ad",    action: "Clicked Barrett ad",         detail: '"interest only jumbo loan arizona" — landed on /jumbo-loans', strength: "very-high", phase: "campaign" },
      { date: "May 11", channel: "barrettfinancial.com","action": "Deep research",            detail: "Spent 8:22 on /jumbo-loans and /interest-only pages", strength: "very-high", phase: "campaign" },
      { date: "May 13", channel: "Wells Fargo",         action: "Got rate sheet",             detail: "Visited Wells Fargo Private Mortgage — received rate sheet", strength: "high",      phase: "lookback" },
      { date: "May 16", channel: "Google Display Ad",   action: "Clicked retargeting",        detail: "Returned to barrettfinancial.com via Google display ad", strength: "very-high", phase: "campaign" },
      { date: "May 19", channel: "barrettfinancial.com","action": "Read reviews",             detail: "Spent 5:48 on /reviews — read 14 testimonials, focused on jumbo loans", strength: "high",      phase: "campaign" },
      { date: "May 22", channel: "barrettfinancial.com","action": "Visited /contact",         detail: "Spent 3:12 on contact page — did NOT submit form", strength: "very-high", phase: "campaign" },
      { date: "May 29", channel: "barrettfinancial.com","action": "Viewed loan officers",     detail: "Spent 4:44 browsing loan officer profiles — researching who to call", strength: "very-high", phase: "campaign" },
      { date: "Jun 2",  channel: "SiteID.ai",           action: "Identified",                 detail: "SiteID identified James Harrington — $1.85M estimated loan, 812 credit score", strength: "very-high", phase: "campaign" },
    ],
    purchaseWindows: [
      { window: "7 days",   probability: 76, reasoning: "Viewed loan officer profiles — he is selecting who to call. A direct outreach from the right officer will close this." },
      { window: "30 days",  probability: 92, reasoning: "Has been comparing Chase and Wells Fargo Private Mortgage. Barrett is the clear front-runner based on return visits." },
      { window: "6 months", probability: 99, reasoning: "Saved $2.1M–$3.4M Zillow listings — this purchase is happening. The only question is which lender wins." },
    ],
    personalizedMessage: {
      subject: "James — your interest-only jumbo pre-approval",
      body: "Hi James, I saw you've been researching interest-only jumbo loans for a North Scottsdale property. You've visited our site multiple times and spent time reviewing our loan officer profiles — I wanted to reach out directly. As a physician, you qualify for our Medical Professional Mortgage program: up to $2.5M with no PMI, interest-only option available, and a 24-hour pre-approval. Let's talk this week.",
    },
    mediaRecommendations: [
      { channel: "Direct Outreach (VIP)", allocation: 60, tactic: "Senior loan officer personal call within 4 hours. Reference his interest-only research and physician status. Offer Medical Professional Mortgage program.", color: "#7c3aed" },
      { channel: "Google Retargeting", allocation: 20, tactic: "Retarget on Chase and Wells Fargo exit pages. Bid on 'physician mortgage arizona', 'jumbo loan no PMI scottsdale'.", color: "#4285F4" },
      { channel: "Meta Retargeting", allocation: 15, tactic: "Show physician mortgage creative. Highlight $2.5M limit, no PMI, interest-only option.", color: "#1877F2" },
      { channel: "Email", allocation: 5, tactic: "Physician mortgage program one-pager. Subject: 'Your Medical Professional Mortgage — up to $2.5M, no PMI'.", color: "#10b981" },
    ],
    tags: ["Jumbo $1.85M", "Physician Buyer", "Interest-Only", "Compared Chase + Wells Fargo", "812 Credit Score"],
    journeySummary: "James is a $1.85M jumbo buyer who compared Chase Private Client and Wells Fargo Private Mortgage before returning to Barrett 6 times. He viewed loan officer profiles — he is selecting who to call. A VIP outreach from a senior loan officer will close this deal within 7 days.",
    outreachKit: {
      email: {
        subject: "James — your $1.85M interest-only jumbo: a private conversation",
        body: "James,\n\nYou've been researching $1.85M jumbo and interest-only loan options, and you've compared Chase Private Client and First Republic. I wanted to reach out personally.\n\nBarrett Financial has a private client program for ultra-high-net-worth buyers that most lenders don't advertise. We can structure an interest-only product that optimizes your cash flow and preserves your investment capital.\n\nThis is a conversation worth having. When can I call you?\n\n— [Senior Loan Officer]\nBarrett Financial Group",
      },
      linkedin: {
        connectionRequest: "James — I'm a senior loan officer at Barrett Financial Group. I specialize in ultra-high-net-worth mortgage solutions and wanted to connect.",
        followUp: "James, thanks for connecting. I know you're researching $1.85M interest-only jumbo options. Barrett Financial has a private client program that most lenders don't advertise — designed specifically for buyers in your position. This is a conversation worth having. When can I call you?",
      },
      facebookAd: {
        headline: "James — $1.85M Interest-Only Jumbo, Private Client",
        primaryText: "Barrett Financial has a private client program for ultra-high-net-worth buyers researching $1.85M+ interest-only jumbo loans. Optimize your cash flow. Preserve your investment capital. Schedule a private consultation today.",
        cta: "Schedule Private Consultation",
      },
      googleAd: {
        headlines: ["$1.85M Interest-Only Jumbo Loan", "Private Client Mortgage — Barrett Financial", "Ultra-High-Net-Worth Mortgage Solutions"],
        descriptions: ["Barrett Financial private client program for $1.85M+ interest-only jumbo loans. Optimize cash flow. Preserve investment capital.", "Ultra-high-net-worth mortgage solutions. Private consultation. Competitive rates. Call Barrett Financial today."],
        keywords: ["interest-only jumbo loan $1.85M", "ultra-high-net-worth mortgage Scottsdale", "private client mortgage AZ", "Barrett Financial Group jumbo"],
      },
      directMail: {
        headline: "A Mortgage Solution Most Lenders Won't Tell You About.",
        body: "James — Barrett Financial has a private client program for ultra-high-net-worth buyers researching $1.85M+ interest-only jumbo loans. Optimize your cash flow. Preserve your investment capital. Call [phone] for a private consultation.",
      },
    },
  },
  {
    id: "bf-003",
    dashboardId: "barrett-financial",
    name: "Jennifer Castillo",
    age: 29,
    location: "Gilbert, AZ 85296",
    occupation: "Registered Nurse at Banner Health",
    avatar: "JC",
    avatarColor: "#10b981",
    buyerDNA: "First-time buyer, 29, researching FHA and DPA programs. Abandoned a LoanDepot pre-approval and a Better.com rate quote. 8 total Barrett visits — never submitted a form.",
    engagementScore: 88,
    signals: [
      { date: "May 2",  channel: "Google Search",      action: "Searched first-time buyer",  detail: '"first time home buyer programs arizona 2026" — read 3 articles', strength: "medium",    phase: "lookback" },
      { date: "May 3",  channel: "AZ Housing Finance", action: "DPA research",               detail: "Read Arizona DPA program requirements — checked income limits", strength: "medium",    phase: "lookback" },
      { date: "May 5",  channel: "Zillow",             action: "Home browsing",               detail: "Browsed 12 homes, $350K–$420K in Gilbert — saved 4 listings", strength: "high",      phase: "lookback" },
      { date: "May 9",  channel: "LoanDepot",          action: "Started pre-approval",        detail: "Began pre-approval — abandoned at income verification step", strength: "very-high", phase: "lookback" },
      { date: "May 11", channel: "Google Search Ad",   action: "Clicked Barrett FHA ad",     detail: '"barrett financial fha loan gilbert az" — landed on /fha-loans', strength: "very-high", phase: "campaign" },
      { date: "May 13", channel: "barrettfinancial.com","action": "FHA research",             detail: "Spent 4:22 on /fha-loans and /down-payment-assistance pages", strength: "very-high", phase: "campaign" },
      { date: "May 15", channel: "Better.com",         action: "Got rate quote",              detail: "Received FHA rate quote — did not proceed with application", strength: "high",      phase: "lookback" },
      { date: "May 17", channel: "Meta Ad",            action: "Clicked Barrett retargeting", detail: "Returned to barrettfinancial.com — viewed /reviews", strength: "high",      phase: "campaign" },
      { date: "May 23", channel: "barrettfinancial.com","action": "Used calculator",          detail: "Used mortgage calculator — $380K FHA, 3.5% down, $2,148/mo", strength: "very-high", phase: "campaign" },
      { date: "May 27", channel: "barrettfinancial.com","action": "Visited /contact",         detail: "Spent 2:14 on contact page — did NOT submit form", strength: "very-high", phase: "campaign" },
      { date: "Jun 2",  channel: "SiteID.ai",          action: "Identified",                  detail: "SiteID identified Jennifer Castillo — FHA buyer, $112K income, 741 credit score", strength: "very-high", phase: "campaign" },
    ],
    purchaseWindows: [
      { window: "7 days",   probability: 74, reasoning: "Used the mortgage calculator with specific numbers ($380K, 3.5% down) — she knows what she wants. Visited /contact and didn't submit." },
      { window: "30 days",  probability: 91, reasoning: "Has been researching for 4 weeks, abandoned LoanDepot, rejected Better.com quote. Barrett is her top choice." },
      { window: "6 months", probability: 98, reasoning: "Saved 4 Zillow listings in Gilbert — this purchase is imminent. First-time buyer urgency is high." },
    ],
    personalizedMessage: {
      subject: "Jennifer — your FHA pre-approval + DPA options",
      body: "Hi Jennifer, I saw you've been researching FHA loans and down payment assistance programs for a home in Gilbert. You used our mortgage calculator last week — $380K FHA with 3.5% down. With your income and credit score, you likely qualify for Arizona's HOME Plus DPA program, which can cover your entire down payment. I can have your pre-approval ready in 24 hours. Want to talk this week?",
    },
    mediaRecommendations: [
      { channel: "Direct Outreach", allocation: 45, tactic: "Personal call/email from a Barrett FHA specialist. Lead with DPA program eligibility — she qualifies for HOME Plus.", color: "#10b981" },
      { channel: "Email Sequence", allocation: 25, tactic: "3-email: Day 1 DPA eligibility check, Day 3 FHA vs conventional comparison, Day 7 pre-approval urgency.", color: "#f59e0b" },
      { channel: "Meta Retargeting", allocation: 20, tactic: "Show FHA first-time buyer creative. Highlight $0 down payment option via DPA. Target Gilbert, AZ.", color: "#1877F2" },
      { channel: "Google Retargeting", allocation: 10, tactic: "Retarget on LoanDepot and Better.com exit pages. Bid on 'FHA loan gilbert az', 'down payment assistance arizona'.", color: "#4285F4" },
    ],
    tags: ["First-Time Buyer", "FHA / DPA", "Abandoned LoanDepot", "741 Credit Score", "Gilbert AZ"],
    journeySummary: "Jennifer spent 4 weeks researching FHA loans and DPA programs, abandoned a LoanDepot pre-approval, rejected a Better.com quote, and used Barrett's mortgage calculator with specific numbers. She visited /contact and didn't submit. A DPA-led outreach will close her within 7 days.",
    outreachKit: {
      email: {
        subject: "Jennifer — your FHA + DPA options: let's get you pre-approved today",
        body: "Jennifer,\n\nYou've been researching FHA loans and down payment assistance programs, and you started a pre-approval with LoanDepot. I wanted to reach out personally.\n\nBarrett Financial specializes in first-time buyers and we have access to DPA programs that can cover up to 5% of your purchase price — which means you could be in a home with as little as $0 out of pocket.\n\nCan I pull your pre-approval today? It takes about 10 minutes.\n\n— [Loan Officer]\nBarrett Financial Group",
      },
      linkedin: {
        connectionRequest: "Hi Jennifer — I'm a loan officer at Barrett Financial Group. I specialize in first-time buyer programs and wanted to connect.",
        followUp: "Jennifer, thanks for connecting. I know you're researching FHA and DPA programs. Barrett Financial has access to DPA programs that can cover up to 5% of your purchase price — potentially $0 out of pocket. I can pull your pre-approval in 10 minutes. Want me to?",
      },
      facebookAd: {
        headline: "Jennifer — $0 Down with DPA. Get Pre-Approved Today.",
        primaryText: "First-time buyer? Barrett Financial has down payment assistance programs that can cover up to 5% of your purchase price. Get pre-approved in 10 minutes. $0 out of pocket possible.",
        cta: "Get Pre-Approved Now",
      },
      googleAd: {
        headlines: ["First-Time Buyer DPA Programs AZ", "$0 Down Payment Assistance — Pre-Approve Now", "FHA Loan + DPA — Barrett Financial"],
        descriptions: ["First-time buyer? Barrett Financial has DPA programs covering up to 5% of purchase price. Get pre-approved in 10 minutes.", "FHA loans + down payment assistance. $0 out of pocket possible. Barrett Financial specializes in first-time buyers."],
        keywords: ["FHA loan first-time buyer AZ", "down payment assistance Arizona", "first-time buyer pre-approval", "Barrett Financial Group FHA"],
      },
      directMail: {
        headline: "First-Time Buyer? $0 Down Is Possible.",
        body: "Jennifer — Barrett Financial has down payment assistance programs that can cover up to 5% of your purchase price. Get pre-approved in 10 minutes. Visit barrettfinancial.com or call [phone] today.",
      },
    },
  },
];
