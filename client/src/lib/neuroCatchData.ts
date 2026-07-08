/**
 * neuroCatchData.ts
 * NeuroCatch Inc. — Brain Vital Signs Platform
 * B2B & B2C Campaign Intelligence Dashboard
 *
 * Color palette: Deep purple bg (#07071a / #0d0d28) | Gold→Orange gradient (#f59e0b → #f97316 → #ea580c) | White text
 *
 * Sources: NeuroCatch Comprehensive Marketing Plan (Revised Edition, July 8, 2026)
 * Market data: Straits Research, Towards Healthcare, Brain Injury Association of America
 */

export const NEUROCATCH_CLIENT = {
  name: "NeuroCatch",
  logo: "🧠",
  vertical: "MedTech / Cognitive Assessment",
  campaign: "Brain Vital Signs — B2B & B2C Market Entry 2026",
  accentColor: "#f59e0b",
  dashboardId: "neurocatch" as const,
  location: "Phoenix, AZ (US HQ) · Vancouver, BC (Global HQ)",
  website: "neurocatch.com",
  tagline: "You can't effectively treat what you can't objectively measure.",
};

// ── MARKET OPPORTUNITY ────────────────────────────────────────────────────────
export const NEUROCATCH_MARKET = {
  cognitiveAssessmentMarket2025: 8.82,   // $B
  cognitiveAssessmentCAGR: 16.0,          // %
  digitalBrainHealthMarket2034: 478,      // $B
  concussionMgmtMarket2034: 11.25,        // $B
  scansCompleted: 30000,
  testDurationMinutes: 6,
};

export const NEUROCATCH_MARKET_CARDS = [
  {
    label: "Cognitive Assessment Market (2025)",
    value: "$8.82B",
    sub: "Growing at 16% CAGR",
    icon: "📈",
  },
  {
    label: "Digital Brain Health Market (2034)",
    value: "$478B",
    sub: "Projected market size",
    icon: "🌐",
  },
  {
    label: "Concussion Mgmt Market (2034)",
    value: "$11.25B",
    sub: "Fastest-growing sub-segment",
    icon: "🏥",
  },
  {
    label: "Scans Completed to Date",
    value: "30,000+",
    sub: "Validated clinical data",
    icon: "✅",
  },
  {
    label: "Test Duration",
    value: "6 min",
    sub: "Point-of-care, non-invasive",
    icon: "⚡",
  },
  {
    label: "CAGR — Cognitive Assessment",
    value: "16%+",
    sub: "Through 2030",
    icon: "🚀",
  },
];

// ── COMPETITIVE POSITIONING ───────────────────────────────────────────────────
export const NEUROCATCH_COMPETITORS = [
  {
    name: "ImPACT Applications",
    tech: "Computerized behavioral testing",
    limitation: "Relies on patient effort & self-report; susceptible to malingering",
    hasEEG: false,
    hasPhysio: false,
    hasPortable: false,
  },
  {
    name: "Sway Medical",
    tech: "Smartphone balance & cognition app",
    limitation: "No physiological brain activity measurement whatsoever",
    hasEEG: false,
    hasPhysio: false,
    hasPortable: true,
  },
  {
    name: "C3 Logix",
    tech: "iPad-based symptom & motor testing",
    limitation: "Subjective and behavioral; no EEG component",
    hasEEG: false,
    hasPhysio: false,
    hasPortable: true,
  },
  {
    name: "NeuroCatch®",
    tech: "Portable EEG (ERPs: N100, P300, N400)",
    limitation: "Objective, physiological, impervious to malingering",
    hasEEG: true,
    hasPhysio: true,
    hasPortable: true,
    isUs: true,
  },
];

// ── B2B TARGET SEGMENTS (PRIORITY RANKED) ────────────────────────────────────
export const NEUROCATCH_B2B_SEGMENTS = [
  {
    priority: 1,
    segment: "Military & Veterans Health",
    subLabel: "VHA / MHS",
    whyNow: "Lovell Government Services partnership opens federal purchasing vehicles. Clinicians are motivated and not ego-resistant.",
    entryPoint: "Lovell Government Services channel",
    addressable: "9M enrolled veterans + 9.6M active duty & families",
    liabilityBarrier: "None — VA/MHS clinicians actively seek better TBI/PTSD tools",
    urgency: "high",
    icon: "🎖️",
    color: "#f59e0b",
  },
  {
    priority: 2,
    segment: "Collegiate Athletics",
    subLabel: "NCAA",
    whyNow: "Duty-of-care liability creates urgency. Universities face legal exposure if they fail to adopt best-practice concussion protocols.",
    entryPoint: "Athletic Directors, Team Physicians",
    addressable: "1,100+ NCAA schools · 500,000+ student athletes",
    liabilityBarrier: "Minimal — objective data is a legal shield for universities",
    urgency: "high",
    icon: "🏈",
    color: "#f97316",
  },
  {
    priority: 3,
    segment: "Occupational Health",
    subLabel: "High-Risk Industries",
    whyNow: "Mining, oil & gas, transportation, construction — required by regulation to assess cognitive fitness for duty.",
    entryPoint: "Occupational Medicine Physicians, HR Directors",
    addressable: "15M+ workers in federally regulated high-risk industries",
    liabilityBarrier: "None — cognitive fitness is a safety metric",
    urgency: "medium",
    icon: "⚙️",
    color: "#ea580c",
  },
  {
    priority: 4,
    segment: "Combat & Extreme Sports",
    subLabel: "MMA, Boxing, MTB, Skiing",
    whyNow: "Athletic commissions under public scrutiny. NeuroCatch already has Crankworx foothold. No NFL-style liability wall.",
    entryPoint: "Athletic Commissions, Team Physicians",
    addressable: "50+ MMA organizations · 300+ boxing commissions · 200+ ski resorts",
    liabilityBarrier: "Low — commissions actively seek objective protocols",
    urgency: "medium",
    icon: "🥊",
    color: "#f59e0b",
  },
  {
    priority: 5,
    segment: "Executive Health Clinics",
    subLabel: "Corporate Wellness",
    whyNow: "High-value, low-volume. CEOs and C-suite as early adopters. Strong ROI narrative around cognitive performance.",
    entryPoint: "Executive Health Program Directors, CHROs",
    addressable: "2,000+ concierge & executive health programs in the US",
    liabilityBarrier: "None — performance optimization framing",
    urgency: "medium",
    icon: "💼",
    color: "#f97316",
  },
  {
    priority: 6,
    segment: "High School Athletics",
    subLabel: "K-12 Sports Programs",
    whyNow: "8M+ student athletes. Parent-driven demand. Same duty-of-care urgency as NCAA but at massive scale.",
    entryPoint: "State Athletic Associations, School Boards",
    addressable: "19,000+ high schools with athletic programs · 8M+ student athletes",
    liabilityBarrier: "Low — parents and boards want the most rigorous tools",
    urgency: "medium",
    icon: "🏫",
    color: "#ea580c",
  },
];

// ── B2C TARGET AUDIENCES ──────────────────────────────────────────────────────
export const NEUROCATCH_B2C_AUDIENCES = [
  {
    audience: "Biohackers & Performance Optimizers",
    motivation: "Competitive edge, self-quantification",
    message: "You track your sleep, your HRV, your VO2 max. Are you tracking your brain?",
    channels: ["Instagram", "TikTok", "Podcast Sponsorships"],
    icon: "⚡",
  },
  {
    audience: "Parents of Youth Athletes",
    motivation: "Child safety, duty of care",
    message: "The most objective concussion baseline available — because your child deserves more than a symptom checklist.",
    channels: ["Facebook", "Instagram", "Google Search"],
    icon: "👨‍👩‍👦",
  },
  {
    audience: "Proactive Aging Adults (50+)",
    motivation: "Fear of cognitive decline, proactive health",
    message: "Catch changes in brain function before symptoms appear.",
    channels: ["Facebook", "YouTube", "Google Display"],
    icon: "🧬",
  },
  {
    audience: "First Responders & Veterans",
    motivation: "Occupational brain health",
    message: "Your brain takes hits your body doesn't show. Measure it.",
    channels: ["LinkedIn", "Facebook", "Google Search"],
    icon: "🎖️",
  },
];

// ── SEARCH VOLUME & KEYWORD INTELLIGENCE ─────────────────────────────────────
export const NEUROCATCH_KEYWORDS = [
  { keyword: "concussion testing near me",        volume: 22000, trend: "up",   competition: "low",    segment: "B2C / Sports" },
  { keyword: "objective concussion assessment",   volume: 8100,  trend: "up",   competition: "low",    segment: "B2B / Sports Med" },
  { keyword: "return to play protocol",           volume: 18000, trend: "up",   competition: "medium", segment: "B2B / Sports Med" },
  { keyword: "TBI assessment tool",               volume: 6600,  trend: "up",   competition: "low",    segment: "B2B / Military" },
  { keyword: "cognitive fitness test",            volume: 12000, trend: "up",   competition: "medium", segment: "B2B / Occupational" },
  { keyword: "brain vital signs",                 volume: 2900,  trend: "up",   competition: "low",    segment: "Brand" },
  { keyword: "EEG cognitive assessment",          volume: 4400,  trend: "up",   competition: "low",    segment: "B2B / Clinical" },
  { keyword: "biohacking brain health",           volume: 9900,  trend: "up",   competition: "medium", segment: "B2C / Biohacker" },
  { keyword: "concussion baseline test",          volume: 14800, trend: "up",   competition: "medium", segment: "B2C / Parents" },
  { keyword: "cognitive decline prevention",      volume: 27000, trend: "up",   competition: "high",   segment: "B2C / Aging" },
  { keyword: "occupational cognitive assessment", volume: 3600,  trend: "flat", competition: "low",    segment: "B2B / Occupational" },
  { keyword: "PTSD cognitive testing",            volume: 5400,  trend: "up",   competition: "low",    segment: "B2B / Military" },
];

// ── OUTREACH KIT BY SEGMENT ───────────────────────────────────────────────────
export const NEUROCATCH_OUTREACH = [
  {
    segment: "Military & Veterans (VA/MHS)",
    icon: "🎖️",
    linkedin: {
      connection: "Hi [Name] — I work with NeuroCatch, which just partnered with Lovell Government Services to bring objective EEG-based cognitive assessment to VA and MHS facilities. Given your work in veteran health, I'd love to connect and share what we're seeing in TBI/PTSD assessment outcomes.",
      followUp: "Thanks for connecting. We're seeing strong adoption across VA facilities through the Lovell channel — the ability to get an objective brain vital sign in 6 minutes, without relying on patient self-report, is changing how clinicians approach TBI and PTSD screening. Happy to share our clinical outcomes data if useful.",
    },
    email: {
      subject: "Objective TBI Assessment for VA/MHS — NeuroCatch + Lovell Partnership",
      body: "Dear [Name],\n\nThrough our partnership with Lovell Government Services, NeuroCatch is now available to VA and MHS facilities through existing federal purchasing vehicles.\n\nThe NeuroCatch Platform delivers objective Brain Vital Signs (N100, P300, N400) in 6 minutes — physiological EEG data that is impervious to malingering and doesn't rely on patient self-report. For TBI and PTSD assessment in veteran populations, this is a meaningful clinical upgrade.\n\nWould you have 20 minutes for a brief clinical overview? I can also arrange a live demonstration at your facility.\n\nBest regards,\n[Your Name]\nNeuroCatch",
    },
    googleAd: {
      headlines: ["Objective TBI Assessment", "6-Minute Brain Vital Signs", "VA-Accessible via Lovell"],
      descriptions: ["EEG-based cognitive assessment for TBI & PTSD. Available through federal purchasing channels. Request a clinical demo.", "Objective, physiological brain data in 6 minutes. Not self-report. Not behavioral. Real EEG. For VA & MHS clinicians."],
      keywords: ["TBI assessment VA", "objective cognitive test military", "PTSD brain assessment tool", "veteran cognitive screening"],
    },
    directMail: {
      headline: "Your Veterans Deserve More Than a Symptom Checklist.",
      body: "NeuroCatch delivers objective Brain Vital Signs in 6 minutes — physiological EEG data that doesn't rely on patient self-report. Now available to VA and MHS facilities through Lovell Government Services. Request a clinical demonstration at neurocatch.com.",
    },
  },
  {
    segment: "Collegiate Athletics (NCAA)",
    icon: "🏈",
    linkedin: {
      connection: "Hi [Name] — I work with NeuroCatch, the only point-of-care platform that measures objective physiological brain activity (not behavioral self-report) in under 10 minutes. Given the concussion management responsibilities at [University], I thought it was worth connecting.",
      followUp: "Thanks for connecting. The core question we hear from athletic trainers and team physicians is: 'When I clear an athlete to return to play, what is that decision based on?' With NeuroCatch, it's based on objective EEG data — not a symptom checklist. That's a meaningful difference for both the athlete and your institution's duty-of-care obligations.",
    },
    email: {
      subject: "Return-to-Play Decisions Based on Objective Data — Not Symptom Checklists",
      body: "Dear [Name],\n\nEvery time your athletic trainers clear an athlete to return to play, that decision carries real liability. If it's based on a symptom checklist, you're relying on self-report from a player who wants to get back on the field.\n\nNeuroCatch changes that. Our platform delivers objective Brain Vital Signs — physiological EEG measurements of N100, P300, and N400 — in 6 minutes, at the point of care. The data is impervious to malingering.\n\nWe're working with NCAA programs across the country. I'd welcome the opportunity to show you what this looks like in practice.\n\nBest,\n[Your Name]\nNeuroCatch",
    },
    googleAd: {
      headlines: ["Objective Concussion Assessment", "Return-to-Play with Real Data", "6-Minute EEG at Point of Care"],
      descriptions: ["Stop relying on symptom checklists. NeuroCatch delivers objective brain vital signs in 6 minutes. NCAA programs nationwide.", "Physiological EEG data for return-to-play decisions. Impervious to malingering. Built for athletic trainers and team physicians."],
      keywords: ["NCAA concussion protocol", "objective concussion test", "return to play EEG", "athletic trainer concussion tool"],
    },
    directMail: {
      headline: "When You Clear an Athlete, What Is That Decision Based On?",
      body: "With NeuroCatch, it's based on objective physiological EEG data — not a symptom checklist. 6 minutes. Point of care. Impervious to malingering. Trusted by athletic programs nationwide. Learn more at neurocatch.com.",
    },
  },
  {
    segment: "Occupational Health / High-Risk Industries",
    icon: "⚙️",
    linkedin: {
      connection: "Hi [Name] — I work with NeuroCatch, a portable EEG platform that delivers objective cognitive fitness assessments in 6 minutes. Given the fitness-for-duty requirements in your industry, I thought this might be relevant to your work.",
      followUp: "Thanks for connecting. The core message for occupational health is simple: cognitive fitness is a safety metric. NeuroCatch lets you measure it like one — objective, physiological, 6 minutes, point of care. Strong fit for pre-shift screening, post-incident assessment, and return-to-work protocols.",
    },
    email: {
      subject: "Cognitive Fitness Is a Safety Metric — Measure It Like One",
      body: "Dear [Name],\n\nIn high-risk industries, you measure physical fitness. You measure fatigue. But cognitive impairment — from head injury, fatigue, or neurological conditions — is often invisible until it causes an incident.\n\nNeuroCatch delivers objective cognitive fitness assessments in 6 minutes, at the point of care. Physiological EEG data. Not self-report. Not behavioral testing. Real brain activity measurement.\n\nStrong applications for: post-incident assessment, return-to-work protocols, pre-shift screening for safety-critical roles.\n\nHappy to walk you through the platform. Would a 20-minute call work?\n\nBest,\n[Your Name]\nNeuroCatch",
    },
    googleAd: {
      headlines: ["Cognitive Fitness Assessment", "6-Min EEG for Workplace Safety", "Objective Brain Testing"],
      descriptions: ["Cognitive impairment is a safety risk. Measure it objectively. NeuroCatch delivers brain vital signs in 6 minutes for occupational health.", "Post-incident. Return-to-work. Pre-shift screening. Objective cognitive fitness assessment for high-risk industries."],
      keywords: ["occupational cognitive assessment", "fitness for duty cognitive test", "workplace brain health screening", "post-incident cognitive evaluation"],
    },
    directMail: {
      headline: "Cognitive Fitness Is a Safety Metric. Measure It Like One.",
      body: "NeuroCatch delivers objective brain vital signs in 6 minutes — physiological EEG data for post-incident assessment, return-to-work protocols, and pre-shift screening. Built for high-risk industries. Learn more at neurocatch.com.",
    },
  },
  {
    segment: "Biohackers & Performance Optimizers (B2C)",
    icon: "⚡",
    linkedin: {
      connection: "Hi [Name] — You track your sleep, your HRV, your VO2 max. NeuroCatch is the first portable platform that lets you track your actual brain vital signs — objective EEG data in 6 minutes. Thought you'd find this interesting.",
      followUp: "Thanks for connecting. The performance community has been incredibly receptive to NeuroCatch — the idea that you can get objective physiological brain data (N100, P300, N400) in 6 minutes, the same way you'd check your heart rate, is resonating strongly. Happy to share more.",
    },
    email: {
      subject: "You Track Everything Else. Are You Tracking Your Brain?",
      body: "Hey [Name],\n\nYou've optimized your sleep. Your HRV. Your VO2 max. Your recovery.\n\nBut what about your brain?\n\nNeuroCatch is the first portable platform that delivers objective Brain Vital Signs — physiological EEG measurements — in 6 minutes. The same way you'd check your heart rate or blood oxygen, you can now get a real readout of your cognitive processing speed, attention, and sensory function.\n\nFind a NeuroCatch clinic near you at neurocatch.com.\n\n— The NeuroCatch Team",
    },
    googleAd: {
      headlines: ["Track Your Brain Vital Signs", "6-Minute Cognitive Assessment", "Biohack Your Brain Health"],
      descriptions: ["You track sleep, HRV, VO2 max. Now track your brain. Objective EEG-based cognitive assessment in 6 minutes. Find a clinic near you.", "NeuroCatch delivers physiological brain vital signs — not a quiz, not self-report. Real EEG data. For performance optimizers."],
      keywords: ["brain health biohacking", "cognitive performance test", "brain vital signs", "EEG brain test near me"],
    },
    directMail: {
      headline: "You Track Everything Else. Are You Tracking Your Brain?",
      body: "NeuroCatch delivers objective Brain Vital Signs — physiological EEG data — in 6 minutes. Find a clinic near you at neurocatch.com. Your brain is the most important performance metric you're not measuring.",
    },
  },
];

// ── CAMPAIGN READINESS SCORECARD ──────────────────────────────────────────────
export const NEUROCATCH_READINESS = [
  { item: "SiteID.ai installed on neurocatch.com",        status: "pending",  priority: "critical", note: "Required to identify in-market visitors by name & company" },
  { item: "LinkedIn Campaign Manager account active",     status: "pending",  priority: "high",     note: "Primary B2B channel for all 6 segments" },
  { item: "Google Search campaigns live",                 status: "pending",  priority: "high",     note: "Capture high-intent searches: 'concussion testing near me'" },
  { item: "\"Find a Clinic\" directory on neurocatch.com", status: "pending", priority: "high",     note: "Creates B2C pull demand that flows to B2B clients" },
  { item: "Clinical champion seeding program launched",   status: "pending",  priority: "high",     note: "Target 3–5 early adopters per segment for co-publication" },
  { item: "Lovell federal channel activated",             status: "active",   priority: "critical", note: "Partnership announced — activate as primary VA/MHS channel" },
  { item: "Meta/Instagram B2C campaign live",             status: "pending",  priority: "medium",   note: "Biohacker + parents of athletes audience targeting" },
  { item: "Podcast sponsorship outreach sent",            status: "pending",  priority: "medium",   note: "Huberman Lab, Peter Attia Drive, FoundMyFitness" },
  { item: "ACSM conference booth booked",                 status: "pending",  priority: "medium",   note: "American College of Sports Medicine — top B2B conference" },
  { item: "\"Know Your Brain Vital Signs\" campaign live", status: "pending", priority: "medium",   note: "Consumer awareness campaign across social + YouTube" },
];

// ── SIMULATED SITEID VISITORS (pre-launch demo data) ─────────────────────────
export const NEUROCATCH_VISITORS = [
  { first: "Marcus",   last: "Holloway",   city: "San Antonio",  zip: "78201", title: "Athletic Trainer",          org: "UTSA Athletics",             segment: "Collegiate Athletics", time: "2m ago",  score: 94 },
  { first: "Jennifer", last: "Vasquez",    city: "Phoenix",      zip: "85001", title: "Occupational Med Physician", org: "Banner Health Occupational",  segment: "Occupational Health",  time: "7m ago",  score: 91 },
  { first: "Derek",    last: "Okonkwo",    city: "Washington",   zip: "20001", title: "VA Clinical Psychologist",   org: "DC VA Medical Center",        segment: "Military / VA",        time: "11m ago", score: 97 },
  { first: "Samantha", last: "Reyes",      city: "Denver",       zip: "80201", title: "Sports Medicine Physician",  org: "UCHealth Sports Medicine",    segment: "Collegiate Athletics", time: "15m ago", score: 89 },
  { first: "Brandon",  last: "Whitfield",  city: "Las Vegas",    zip: "89101", title: "MMA Commission Medical Dir", org: "Nevada Athletic Commission",  segment: "Combat Sports",        time: "22m ago", score: 93 },
  { first: "Priya",    last: "Nair",       city: "Austin",       zip: "78701", title: "Biohacker / Health Coach",   org: "Self-Employed",               segment: "B2C / Biohacker",      time: "28m ago", score: 82 },
  { first: "Colonel",  last: "T. Briggs",  city: "Fort Sam",     zip: "78234", title: "MHS Neurologist",            org: "Brooke Army Medical Center",  segment: "Military / MHS",       time: "34m ago", score: 96 },
  { first: "Lisa",     last: "Thornton",   city: "Chapel Hill",  zip: "27514", title: "Team Physician",             org: "UNC Athletics",               segment: "Collegiate Athletics", time: "41m ago", score: 88 },
  { first: "Ryan",     last: "Castellano", city: "Pittsburgh",   zip: "15201", title: "Neuropsychologist",          org: "UPMC Sports Medicine",        segment: "Clinical Champion",    time: "49m ago", score: 95 },
  { first: "Angela",   last: "Morrison",   city: "Phoenix",      zip: "85012", title: "Executive Health Director",  org: "Mayo Clinic Executive Health", segment: "Executive Health",    time: "55m ago", score: 90 },
];
