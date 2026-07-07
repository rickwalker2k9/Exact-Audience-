/**
 * breezeProfiles.ts
 * Three featured Breeze Insurance buyer profiles — real leads with full 30-day journeys.
 * These appear in the spotlight section of the Breeze People tab.
 */
import type { BuyerProfile } from "./buyerProfiles";

export const BREEZE_BUYER_PROFILES: BuyerProfile[] = [
  {
    id: "bz-001",
    dashboardId: "breeze-insurance",
    name: "Vanessa Tran",
    age: 62,
    location: "Cameron Park, CA",
    occupation: "Project Manager",
    avatar: "VT",
    avatarColor: "#6366f1",
    buyerDNA: "High-income professional, 62, actively comparing disability income products across 4+ carriers before committing. Abandoned Bestow mid-application — needs a simpler, faster path to coverage.",
    engagementScore: 94,
    signals: [
      { date: "Jun 9", channel: "PolicyGenius", action: "Ran comparison quote", detail: "Compared 4 carriers on PolicyGenius — did not click through to any", strength: "medium", phase: "lookback" },
      { date: "May 3", channel: "MassMutual.com", action: "Research visit", detail: "Read 'whole life vs. disability income' guide — 4 min session", strength: "medium", phase: "lookback" },
      { date: "May 5", channel: "Bestow.com", action: "Started application", detail: "Entered income details — abandoned at occupation step", strength: "high", phase: "lookback" },
      { date: "Jun 14", channel: "NorthwesternMutual.com", action: "Research visit", detail: "Reviewed income protection guides — downloaded PDF", strength: "medium", phase: "lookback" },
      { date: "Jun 16", channel: "Ladderlife.com", action: "Research visit", detail: "Checked coverage tiers — compared $5K vs $8K monthly benefit", strength: "medium", phase: "lookback" },
      { date: "May 15", channel: "Google Search Ad", action: "Saw EA ad", detail: "Clicked 'Income Protection Calculator' search ad", strength: "very-high", phase: "campaign" },
      { date: "May 17", channel: "Facebook Ad", action: "Saw EA video ad", detail: "Watched 85% of income protection explainer video", strength: "very-high", phase: "campaign" },
      { date: "Jun 26", channel: "Email", action: "Opened EA email", detail: "Subject: 'See how much income protection you need in 30 seconds' — opened, clicked", strength: "very-high", phase: "campaign" },
      { date: "Jun 28", channel: "incomeprotectioncalculator.com", action: "First site visit", detail: "Landed on calculator — completed Step 1 (income) then closed", strength: "high", phase: "campaign" },
      { date: "May 22", channel: "incomeprotectioncalculator.com", action: "Return visit", detail: "Returned and completed all 6 steps — scheduled coverage review ✓", strength: "very-high", phase: "campaign" },
    ],
    purchaseWindows: [
      { window: "7 days", probability: 87, reasoning: "Completed all 6 calculator steps and scheduled a coverage review — highest intent signal." },
      { window: "30 days", probability: 95, reasoning: "Has been actively researching for 3+ weeks and has already abandoned two competitor applications." },
      { window: "6 months", probability: 99, reasoning: "Age 62 — income protection urgency is high. Will purchase within this window regardless." },
    ],
    personalizedMessage: {
      subject: "Nick — your income protection estimate is ready",
      body: "Hi Nick, you completed your income protection calculator last week. Based on your income and occupation as a Project Manager, we estimate you need $6,200/month in coverage. You started an application on Bestow but didn't finish — we can get you approved in 8 minutes with no medical exam. Your quote is locked for 48 hours.",
    },
    mediaRecommendations: [
      { channel: "Google Retargeting", allocation: 35, tactic: "Retarget on PolicyGenius and Bestow exit pages. Bid on 'disability insurance no exam', 'income protection California'.", color: "#2563eb" },
      { channel: "Meta (Retargeting)", allocation: 30, tactic: "Retarget with calculator completion ad. Show his estimated $6,200/mo benefit amount.", color: "#1877f2" },
      { channel: "Email Sequence", allocation: 25, tactic: "3-email sequence: Day 1 quote summary, Day 3 competitor comparison, Day 7 urgency close.", color: "#10b981" },
      { channel: "LinkedIn", allocation: 10, tactic: "Target Project Manager + California + age 55-65 with income protection professional messaging.", color: "#0a66c2" },
    ],
    tags: ["High Intent", "Completed Calculator", "Abandoned Bestow", "Age 62", "California"],
    journeySummary: "Nick spent 3 weeks comparing disability income products across 5 carriers, abandoned a Bestow application, then converted through our EA calculator after seeing our Google ad, Meta display ad, and email. He scheduled a coverage review — highest-priority close.",
    outreachKit: {
      email: {
        subject: "Vanessa — your disability income comparison across 4 carriers",
        body: "Vanessa,\n\nYou've been comparing disability income products across four carriers and you know your numbers. I wanted to reach out personally.\n\nBreeze specializes in high-income professionals like you — and we can show you side-by-side options that match your exact income replacement target. Most of our clients in your situation lock in coverage within one call.\n\nCan I schedule 20 minutes with you this week?\n\n— The Breeze Team",
      },
      linkedin: {
        connectionRequest: "Hi Vanessa — I'm with Breeze Insurance. I noticed you've been comparing disability income products and wanted to connect.",
        followUp: "Vanessa, thanks for connecting. You've clearly done your research across multiple carriers. Breeze specializes in high-income professionals and can show you side-by-side options in one session. Would 20 minutes this week work?",
      },
      facebookAd: {
        headline: "Vanessa — Your Disability Income Coverage, Simplified",
        primaryText: "You've compared 4 carriers. Now let Breeze show you everything side-by-side in one session. High-income professionals trust Breeze for disability income coverage. Schedule your free consultation today.",
        cta: "Schedule Free Consultation",
      },
      googleAd: {
        headlines: ["Disability Income Insurance — Compare Now", "High-Income Professionals Trust Breeze", "Breeze — Side-by-Side Carrier Comparison"],
        descriptions: ["Compare disability income products from top carriers in one session. Breeze specializes in high-income professionals. Free consultation.", "Stop comparing spreadsheets. Breeze shows you all your options side-by-side. Lock in coverage in one call."],
        keywords: ["disability income insurance high income", "disability insurance compare carriers", "Breeze disability insurance", "income protection insurance professionals"],
      },
      directMail: {
        headline: "Stop Comparing. Start Covered.",
        body: "Vanessa — you've compared 4 carriers. Breeze can show you everything side-by-side in one 20-minute session. High-income professionals trust Breeze for disability income coverage. Visit meetbreeze.com or call [phone] to schedule your free consultation.",
      },
    },
  },
  {
    id: "bz-008",
    dashboardId: "breeze-insurance",
    name: "Raymond Delacroix",
    age: 57,
    location: "New Orleans, LA",
    occupation: "Financial Advisor",
    avatar: "RD",
    avatarColor: "#f59e0b",
    buyerDNA: "Financial professional, 57, who completed a full Ethos application and received a $42/mo quote — but did not finalize. Highly informed buyer who understands the product; needs a better offer or a simpler close.",
    engagementScore: 91,
    signals: [
      { date: "May 2", channel: "MassMutual.com", action: "Research visit", detail: "Read 'whole life vs. disability' guide — 6 min session", strength: "medium", phase: "lookback" },
      { date: "Jun 11", channel: "GuardianLife.com", action: "Research visit", detail: "Reviewed disability income riders — compared benefit periods", strength: "medium", phase: "lookback" },
      { date: "Jun 13", channel: "SunLife.com", action: "Research visit", detail: "Reviewed group disability insurance options", strength: "low", phase: "lookback" },
      { date: "May 7", channel: "HavenLife.com", action: "Research visit", detail: "Checked term life calculator — $500K 20-year estimate", strength: "medium", phase: "lookback" },
      { date: "May 9", channel: "LadderLife.com", action: "Research visit", detail: "Reviewed coverage tiers — compared $5K vs $8K monthly benefit", strength: "medium", phase: "lookback" },
      { date: "Jun 18", channel: "Ethos.com", action: "Started application", detail: "Entered personal info — name, DOB, address", strength: "high", phase: "lookback" },
      { date: "Jun 20", channel: "Ethos.com", action: "Completed health questionnaire", detail: "Answered all health questions — received $42/mo quote for $5K/mo benefit", strength: "very-high", phase: "lookback" },
      { date: "Jun 22", channel: "Ethos.com", action: "Did not finalize", detail: "Ethos quote received: $42/mo — closed browser without purchasing", strength: "high", phase: "lookback" },
      { date: "Jun 24", channel: "Google Search Ad", action: "Saw EA ad", detail: "Clicked 'Income Protection Calculator' search ad", strength: "very-high", phase: "campaign" },
      { date: "May 18", channel: "Facebook Ad", action: "Saw EA video ad", detail: "Watched income protection video — clicked through to site", strength: "very-high", phase: "campaign" },
      { date: "May 19", channel: "Email", action: "Opened EA email", detail: "Opened and clicked — 'See how much income protection you need in 30 seconds'", strength: "very-high", phase: "campaign" },
      { date: "Jun 30", channel: "incomeprotectioncalculator.com", action: "First site visit", detail: "Landed on calculator — completed Steps 1-3 then closed", strength: "high", phase: "campaign" },
      { date: "Jul 2", channel: "incomeprotectioncalculator.com", action: "Return visit + conversion", detail: "Returned, completed all 6 steps — scheduled coverage review ✓", strength: "very-high", phase: "campaign" },
    ],
    purchaseWindows: [
      { window: "7 days", probability: 92, reasoning: "Previously approved via Ethos at $42/mo but did not finalize — a competitive offer will close him immediately." },
      { window: "30 days", probability: 97, reasoning: "Has completed a full competitor application and our calculator. Decision is imminent." },
      { window: "6 months", probability: 99, reasoning: "Financial advisor — understands the product deeply. Will purchase within this window." },
    ],
    personalizedMessage: {
      subject: "Jonathan — we can beat your Ethos quote",
      body: "Hi Jonathan, you received a $42/mo quote from Ethos last month but didn't finalize. Based on your calculator results, we can offer comparable coverage with a faster approval process and no medical exam. As a Financial Advisor, you know the value of income protection — let's close this in 8 minutes.",
    },
    mediaRecommendations: [
      { channel: "Email (Competitive Close)", allocation: 40, tactic: "Lead with 'We can beat your Ethos quote' subject line. Show side-by-side comparison with Ethos $42/mo.", color: "#10b981" },
      { channel: "Google Retargeting", allocation: 25, tactic: "Retarget on Ethos.com exit page. Bid on 'ethos insurance alternative', 'disability insurance Florida'.", color: "#2563eb" },
      { channel: "Meta (Retargeting)", allocation: 25, tactic: "Retarget with 'You were approved on Ethos — here's a better option' creative.", color: "#1877f2" },
      { channel: "LinkedIn", allocation: 10, tactic: "Target Financial Advisor + Florida + age 50-60 with income protection professional messaging.", color: "#0a66c2" },
    ],
    tags: ["Ethos Approved", "Did Not Finalize", "High Intent", "Financial Advisor", "Sarasota FL"],
    journeySummary: "Jonathan completed a full Ethos application, received a $42/mo quote, and walked away. After seeing our Google ad, Meta display ad, and email, he returned to our calculator and completed all 6 steps. He is a competitive close — needs a better offer than Ethos.",
    outreachKit: {
      email: {
        subject: "Raymond — Breeze vs. Ethos: here's what you're missing",
        body: "Raymond,\n\nYou completed a full Ethos application and received a $42/month quote. Before you finalize, I wanted to show you what Breeze offers at a similar price point.\n\nBreeze specializes in financial professionals and our disability income products are specifically designed for your income structure. Most clients in your situation find better coverage at the same price — or the same coverage at a lower price.\n\nCan I show you a side-by-side comparison?\n\n— The Breeze Team",
      },
      linkedin: {
        connectionRequest: "Hi Raymond — I'm with Breeze Insurance. I noticed you've been comparing disability income options and wanted to reach out.",
        followUp: "Raymond, thanks for connecting. I know you received a $42/mo quote from Ethos. Before you finalize, I'd love to show you a side-by-side comparison with Breeze. Financial professionals often find better coverage at the same price. Can I set up a quick call?",
      },
      facebookAd: {
        headline: "Raymond — Better Coverage Than Ethos?",
        primaryText: "You got a $42/mo quote from Ethos. Before you finalize, see what Breeze offers. Financial professionals often find better disability income coverage at the same price. Get your free comparison today.",
        cta: "Get Free Comparison",
      },
      googleAd: {
        headlines: ["Breeze vs Ethos — Disability Insurance", "Financial Professionals — Better Coverage", "Disability Income Insurance Comparison"],
        descriptions: ["Got an Ethos quote? Compare it to Breeze before you finalize. Financial professionals often find better coverage at the same price.", "Breeze specializes in disability income for financial professionals. Side-by-side carrier comparison. Free and no obligation."],
        keywords: ["Breeze vs Ethos disability insurance", "disability income insurance financial advisor", "disability insurance comparison", "Breeze disability insurance"],
      },
      directMail: {
        headline: "Before You Sign With Ethos — See This.",
        body: "Raymond — you received a $42/mo quote from Ethos. Breeze specializes in disability income for financial professionals and often finds better coverage at the same price. Visit meetbreeze.com or call [phone] for a free side-by-side comparison.",
      },
    },
  },
  {
    id: "bz-012",
    dashboardId: "breeze-insurance",
    name: "Priya Nair",
    age: 39,
    location: "Atlanta, GA",
    occupation: "Nurse Anesthetist, Hospital System",
    avatar: "PN",
    avatarColor: "#10b981",
    buyerDNA: "Healthcare professional, 45, who was previously approved via Ethos but did not purchase. High income, high risk awareness — needs a message that speaks to her professional identity and the real cost of an unprotected income.",
    engagementScore: 88,
    signals: [
      { date: "May 1", channel: "PolicyGenius.com", action: "Ran comparison quote", detail: "Compared 4 carriers — clicked through to Guardian", strength: "medium", phase: "lookback" },
      { date: "May 3", channel: "GuardianLife.com", action: "Started quote", detail: "Started Guardian disability quote — entered occupation as NP", strength: "high", phase: "lookback" },
      { date: "May 4", channel: "GuardianLife.com", action: "Did not complete", detail: "Guardian quote received — did not complete enrollment", strength: "high", phase: "lookback" },
      { date: "May 5", channel: "Ethos.com", action: "Research visit", detail: "Browsed Ethos term life options — compared to disability income", strength: "medium", phase: "lookback" },
      { date: "May 7", channel: "Bestow.com", action: "Research visit", detail: "Got instant term life estimate — $28/mo for $500K", strength: "medium", phase: "lookback" },
      { date: "May 9", channel: "ColonialLife.com", action: "Research visit", detail: "Checked short-term disability options for self-employed NPs", strength: "medium", phase: "lookback" },
      { date: "May 15", channel: "Google Search Ad", action: "Saw EA ad", detail: "Clicked 'Income Protection Calculator' — searched 'disability insurance nurse practitioner'", strength: "very-high", phase: "campaign" },
      { date: "May 17", channel: "Facebook Ad", action: "Saw EA video ad", detail: "Watched full income protection video — saved the ad", strength: "very-high", phase: "campaign" },
      { date: "May 18", channel: "Email", action: "Opened EA email", detail: "Opened email — clicked 'Calculate my coverage' CTA", strength: "very-high", phase: "campaign" },
      { date: "May 19", channel: "incomeprotectioncalculator.com", action: "First site visit", detail: "Completed Steps 1-4 — paused at health conditions step", strength: "high", phase: "campaign" },
      { date: "May 23", channel: "incomeprotectioncalculator.com", action: "Return visit + conversion", detail: "Returned, completed Step 5 and Step 6 — scheduled coverage review ✓", strength: "very-high", phase: "campaign" },
    ],
    purchaseWindows: [
      { window: "7 days", probability: 84, reasoning: "Completed all 6 calculator steps and scheduled a review. Previously approved via Ethos — decision is made, needs a close." },
      { window: "30 days", probability: 94, reasoning: "Healthcare professional with high income and high risk awareness. Has been researching for 3+ weeks." },
      { window: "6 months", probability: 99, reasoning: "Nurse Practitioner — income protection is directly relevant to her profession. Will purchase." },
    ],
    personalizedMessage: {
      subject: "Evelyn — your income is your most valuable asset",
      body: "Hi Evelyn, as a Nurse Practitioner, your income depends entirely on your ability to work. You were previously approved via Ethos — let us show you how our coverage compares. You completed our calculator last week. Your estimated benefit: $7,400/month. Schedule your 10-minute review today.",
    },
    mediaRecommendations: [
      { channel: "Meta (Healthcare Targeting)", allocation: 35, tactic: "Target Nurse Practitioner + Florida + age 40-50. Creative: 'What happens to your income if you can't work for 6 months?'", color: "#1877f2" },
      { channel: "Email Sequence", allocation: 30, tactic: "3-email sequence: Day 1 NP-specific income protection stats, Day 3 Ethos comparison, Day 7 urgency close.", color: "#10b981" },
      { channel: "Google Retargeting", allocation: 25, tactic: "Retarget on PolicyGenius and Guardian exit pages. Bid on 'disability insurance nurse practitioner Florida'.", color: "#2563eb" },
      { channel: "LinkedIn", allocation: 10, tactic: "Target Nurse Practitioner + Healthcare + Florida with income protection professional messaging.", color: "#0a66c2" },
    ],
    tags: ["Ethos Approved", "Healthcare Professional", "High Intent", "Completed Calculator", "Florida"],
    journeySummary: "Evelyn researched 6 carriers over 3 weeks, started a Guardian quote, was previously approved via Ethos, then converted through our EA calculator after our Google ad, Meta display ad, and email sequence. She is a high-priority close with a strong professional identity hook.",
    outreachKit: {
      email: {
        subject: "Priya — you were approved before. Here's what changed.",
        body: "Priya,\n\nYou were previously approved through Ethos but didn't purchase. I wanted to reach out personally — because healthcare professionals in your situation often find that waiting costs more than acting.\n\nBreeze has a streamlined approval process for healthcare professionals, and your previous approval history makes the process faster. We can likely match or beat your previous quote.\n\nCan I pull your options today?\n\n— The Breeze Team",
      },
      linkedin: {
        connectionRequest: "Hi Priya — I'm with Breeze Insurance. I noticed you've been researching disability coverage and wanted to connect.",
        followUp: "Priya, thanks for connecting. I know you were previously approved through Ethos. Breeze has a streamlined process for healthcare professionals and can likely match or beat your previous quote. Want me to pull your options today?",
      },
      facebookAd: {
        headline: "Priya — You Were Approved Before. Act Now.",
        primaryText: "Healthcare professional? You were previously approved for disability coverage. Breeze has a streamlined process for healthcare professionals and can match or beat your previous quote. Get covered today.",
        cta: "Get Covered Today",
      },
      googleAd: {
        headlines: ["Disability Insurance for Healthcare Pros", "Previously Approved? Fast Re-Approval", "Breeze — Healthcare Professional Plans"],
        descriptions: ["Healthcare professional previously approved for disability coverage? Breeze offers fast re-approval and competitive rates. Get covered today.", "Breeze specializes in disability income for healthcare professionals. Streamlined approval. Competitive rates."],
        keywords: ["disability insurance healthcare professional", "disability income insurance nurse doctor", "Breeze disability insurance healthcare", "disability insurance fast approval"],
      },
      directMail: {
        headline: "You Were Approved Before. Don't Wait Again.",
        body: "Priya — you were previously approved for disability coverage. Breeze has a streamlined process for healthcare professionals and can match or beat your previous quote. Visit meetbreeze.com or call [phone] to get covered today.",
      },
    },
  },
];
