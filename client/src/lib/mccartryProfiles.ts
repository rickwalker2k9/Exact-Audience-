/**
 * mccartryProfiles.ts
 * Colleen McCarty for Tulsa County DA — 3 Voter Journey Profiles
 * Real names from the Tulsa DA 45+ GOP registered voter list.
 * Framework adapted from the Jeff Starling Behavioral Intelligence model.
 */

import type { BuyerProfile } from "./buyerProfiles";

export const MCCARTY_VOTER_PROFILES: BuyerProfile[] = [
  // ─── Profile 1: Carol Bentley — High-Intent Civic Voter ───────────────────
  {
    id: "mc-001",
    dashboardId: "mccarty",
    name: "Carol Bentley",
    age: 68,
    location: "Muskogee, OK 74403",
    occupation: "Retired Educator",
    avatar: "CB",
    avatarColor: "#2a6496",
    buyerDNA: "High-propensity GOP primary voter. Watches local news daily. Deeply concerned about crime victims being ignored. Responds to accountability and reform messaging. Persuasion threshold: LOW — 3–4 exposures.",
    engagementScore: 94,
    journeySummary: "Carol watched the full News on 6 debate live on May 13, then searched 'Colleen McCarty DA' the next morning. She visited colleenmccarty.com twice, watched the 'Victims First' CTV ad to completion on Samsung TV Plus, and opened the campaign email. She is within 1–2 more impressions of committing her vote. She is the highest-value voter in this segment.",
    signals: [
      { date: "May 10", channel: "CTV — Samsung TV Plus", action: "Watched ad to completion", detail: "Name ID — 'Colleen' :30 — 100% completion, 2nd exposure", strength: "medium" },
      { date: "May 13", channel: "News on 6 / KOTV", action: "Watched full debate live", detail: "McCarty vs. Kunzweiler — Tulsa County DA Republican Primary debate", strength: "very-high" },
      { date: "May 14", channel: "Google Search", action: "Searched candidate name", detail: "'Colleen McCarty DA' — clicked top organic result to colleenmccarty.com", strength: "high" },
      { date: "May 14", channel: "Campaign Website", action: "Site visit — 4:12 session", detail: "Read 'Blueprint for Justice' and 'About Colleen' pages. SiteID matched: Carol Bentley, 68, Muskogee.", strength: "very-high" },
      { date: "May 16", channel: "CTV — Tubi", action: "Watched ad to completion", detail: "Victims First :15 — 3rd CTV exposure total", strength: "high" },
      { date: "May 18", channel: "Email", action: "Opened campaign email", detail: "Subject: 'Tulsa deserves better — here's my plan' — 48% open rate segment", strength: "high" },
      { date: "May 20", channel: "Facebook", action: "Liked debate clip post", detail: "Shared McCarty's closing statement from the debate — organic social engagement", strength: "high" },
      { date: "May 22", channel: "CTV — Fox News", action: "Watched ad to completion", detail: "Accountability — 'Enough' :30 — 4th total CTV exposure", strength: "very-high" },
    ],
    purchaseWindows: [
      { window: "7 days", probability: 88, reasoning: "4 CTV completions, site visit, email open, and debate viewing all confirm she is at persuasion threshold. One more high-frequency impression in the next 7 days seals the vote." },
      { window: "30 days", probability: 96, reasoning: "She is already past persuasion threshold. Barring a major negative event, Carol is a committed McCarty voter by Election Day June 16." },
      { window: "6 months", probability: 99, reasoning: "Strong civic identity voter. Once committed, she votes. No attrition risk." },
    ],
    personalizedMessage: {
      subject: "Carol — Tulsa's crime victims need a DA who believes them",
      body: "Carol,\n\nYou watched the debate. You've seen what I stand for.\n\nFor too long, crime victims in Tulsa County have been ignored while the DA's office made headlines for the wrong reasons — hidden evidence, unlicensed lawyers in court, millions in taxpayer settlements.\n\nI'm running because Tulsa deserves a modern DA's office — one that puts victims first, uses data and technology, and operates with integrity.\n\nYour vote on June 16 is how we make that happen.\n\nWith gratitude,\nColleen McCarty\n\nP.S. Early voting begins June 9. Find your polling location at vote.ok.gov.",
    },
    mediaRecommendations: [
      { channel: "CTV — Fox News / NewsNation", allocation: 45, tactic: "1–2 final impressions of 'Accountability :30' — she watches primetime news. Time delivery for 6–9 PM window.", color: "#2a6496" },
      { channel: "Email Retargeting", allocation: 25, tactic: "Send 'Early Voting Reminder' email June 9 — she opened the last email. Include polling location lookup link.", color: "#10b981" },
      { channel: "Facebook Retargeting", allocation: 20, tactic: "Serve 'Debate Highlight :15' clip as a Facebook video ad — she already engaged with the debate organically.", color: "#1877f2" },
      { channel: "Google Search", allocation: 10, tactic: "Bid on 'Tulsa DA election 2026' — she searched this before. Serve the endorsement landing page.", color: "#fbbc04" },
    ],
    tags: ["High Intent", "Debate Viewer", "SiteID Matched", "Email Opener", "Persuasion Threshold Met"],
  },

  // ─── Profile 2: Randy Lopp — Crime-Concerned Persuadable ──────────────────
  {
    id: "mc-002",
    dashboardId: "mccarty",
    name: "Randy Lopp",
    age: 57,
    location: "Tulsa, OK 74114",
    occupation: "Commercial Contractor",
    avatar: "RL",
    avatarColor: "#0284c7",
    buyerDNA: "Tulsa resident, crime-concerned, skeptical of career politicians. Watches YouTube news and follows local crime coverage. Responds to taxpayer waste and accountability messaging. Persuasion threshold: MEDIUM — 5–6 exposures.",
    engagementScore: 87,
    journeySummary: "Randy found McCarty through a YouTube search for Tulsa crime news. He watched the 'Taxpayer Waste' CTV ad twice on Pluto TV and then searched 'Steve Kunzweiler record' — a strong contrast signal. He visited the campaign site briefly but did not convert. He needs 2–3 more targeted impressions with accountability-focused creative to cross the persuasion threshold before June 16.",
    signals: [
      { date: "May 8", channel: "YouTube", action: "Watched Tulsa crime news video", detail: "Searched 'Tulsa crime 2026' — watched KJRH news segment. Pre-roll ad served: Name ID :30", strength: "low" },
      { date: "May 11", channel: "CTV — Pluto TV", action: "Watched ad to completion", detail: "Taxpayer Waste :30 — 1st CTV exposure. 100% completion.", strength: "medium" },
      { date: "May 14", channel: "Google Search", action: "Searched incumbent DA", detail: "'Steve Kunzweiler record' — strong contrast signal. Visited Frontier article on DA race.", strength: "high" },
      { date: "May 15", channel: "CTV — Pluto TV", action: "Watched ad to completion", detail: "Taxpayer Waste :30 — 2nd exposure. Frequency now at 2x on this creative.", strength: "high" },
      { date: "May 17", channel: "Campaign Website", action: "Site visit — 1:48 session", detail: "Landed on homepage. SiteID matched: Randy Lopp, 57, Tulsa. Did not visit 'Blueprint for Justice' page.", strength: "medium" },
      { date: "May 20", channel: "Reddit", action: "Read Tulsa DA thread", detail: "r/tulsa — 'Who are you voting for in the DA race?' thread. Upvoted pro-McCarty comment.", strength: "high" },
      { date: "May 24", channel: "CTV — NewsNation", action: "Watched ad to completion", detail: "Accountability — 'Enough' :30 — 3rd total CTV exposure.", strength: "high" },
    ],
    purchaseWindows: [
      { window: "7 days", probability: 62, reasoning: "He is researching the race actively and has contrast signals (searched Kunzweiler record, Reddit engagement). Needs 2–3 more impressions to cross persuasion threshold. 62% probability with continued targeting." },
      { window: "30 days", probability: 84, reasoning: "By Election Day June 16, sustained CTV frequency plus a direct mail or email touch will likely convert him. His Reddit engagement confirms he is actively deciding." },
      { window: "6 months", probability: 91, reasoning: "Once he votes McCarty, he is likely to remain a supporter. Tulsa resident with strong local crime concerns." },
    ],
    personalizedMessage: {
      subject: "Randy — you searched Kunzweiler's record. Here's what I found.",
      body: "Randy,\n\nYou've been doing your homework on this race. Good.\n\nHere's what the record shows: under Steve Kunzweiler, Tulsa County taxpayers paid millions in court-ordered settlements because his office illegally hid evidence. Unlicensed lawyers were sent to court. Convictions were overturned on amateur mistakes.\n\nThat's not tough on crime. That's expensive incompetence.\n\nI'm a prosecutor-trained attorney who will run the DA's office like the taxpayers are watching — because they are.\n\nVote June 16.\n\nColleen McCarty",
    },
    mediaRecommendations: [
      { channel: "CTV — Pluto TV / Tubi", allocation: 50, tactic: "Serve 'Accountability :30' — he has completed 'Taxpayer Waste' twice. Rotate to the contrast message to build frequency on a new angle. Target 6–10 PM window.", color: "#0284c7" },
      { channel: "YouTube Pre-roll", allocation: 25, tactic: "Serve 'Debate Highlight :15' on Tulsa news content — he watches YouTube news. High relevance match.", color: "#4da6e8" },
      { channel: "Reddit Display", allocation: 15, tactic: "Serve banner ad on r/tulsa — he is already active in the DA race thread. Low CPM, high relevance.", color: "#64748b" },
      { channel: "Google Search Retargeting", allocation: 10, tactic: "Retarget 'Steve Kunzweiler' searchers with McCarty contrast ad. He is already in this audience.", color: "#fbbc04" },
    ],
    tags: ["Crime Concerned", "Contrast Searcher", "Reddit Active", "SiteID Matched", "Mid-Funnel"],
  },

  // ─── Profile 3: Kathleen Petersen — Civic Champion / Volunteer Potential ──
  {
    id: "mc-003",
    dashboardId: "mccarty",
    name: "Kathleen Petersen",
    age: 63,
    location: "Broken Arrow, OK 74014",
    occupation: "Nonprofit Director",
    avatar: "KP",
    avatarColor: "#f59e0b",
    buyerDNA: "Highest-value voter in the dataset. Already donated to the campaign. Watched the debate, visited the site 3 times, and opened every email. Persuasion threshold: ALREADY CONVERTED — shift to mobilization and volunteer activation.",
    engagementScore: 96,
    journeySummary: "Kathleen is the most engaged voter in the McCarty campaign's identified universe. She donated $250 after the May 13 debate, has visited the campaign site 3 times, watched 4 different CTV ads to completion, and opened all 3 campaign emails. She is not a persuasion target — she is a mobilization asset. The recommended strategy is to activate her as a volunteer and peer messenger to her Broken Arrow network.",
    signals: [
      { date: "May 5", channel: "CTV — Samsung TV Plus", action: "Watched ad to completion", detail: "Name ID — 'Colleen' :30 — 1st exposure. Searched 'Colleen McCarty' immediately after.", strength: "high" },
      { date: "May 6", channel: "Campaign Website", action: "Site visit — 6:42 session", detail: "Read entire 'Blueprint for Justice.' SiteID matched: Kathleen Petersen, 63, Broken Arrow. Nonprofit background — strong reform alignment.", strength: "very-high" },
      { date: "May 8", channel: "Email", action: "Opened + clicked campaign email", detail: "Clicked 'Donate' CTA. Donated $250 online.", strength: "very-high" },
      { date: "May 13", channel: "News on 6 / KOTV", action: "Watched full debate live", detail: "McCarty vs. Kunzweiler. Tweeted 'Colleen McCarty is exactly what Tulsa needs' after the debate.", strength: "very-high" },
      { date: "May 14", channel: "Facebook", action: "Shared debate clip", detail: "Shared McCarty's closing statement to her personal Facebook — 47 friends, Broken Arrow network.", strength: "very-high" },
      { date: "May 16", channel: "CTV — Court TV", action: "Watched ad to completion", detail: "Endorsement — Law Enforcement :30. Court TV is high-relevance for her nonprofit justice work.", strength: "high" },
      { date: "May 19", channel: "Email", action: "Opened + clicked email", detail: "Opened 'Thank you for your donation' follow-up. Clicked 'Volunteer' link but did not complete form.", strength: "very-high" },
      { date: "May 22", channel: "Campaign Website", action: "Return visit — 3:18 session", detail: "Visited 'Volunteer' and 'Events' pages. Did not submit form. Needs a direct ask.", strength: "high" },
    ],
    purchaseWindows: [
      { window: "7 days", probability: 99, reasoning: "Kathleen is already a committed McCarty voter and donor. She is not a persuasion target. Focus is 100% on mobilization — getting her to the polls and activating her as a peer messenger." },
      { window: "30 days", probability: 99, reasoning: "She will vote. The question is whether she brings 3–5 additional Broken Arrow voters with her. Volunteer activation is the highest-ROI action for this profile." },
      { window: "6 months", probability: 99, reasoning: "Long-term supporter. Likely to remain engaged post-election regardless of outcome." },
    ],
    personalizedMessage: {
      subject: "Kathleen — we need your voice in Broken Arrow",
      body: "Kathleen,\n\nThank you for your donation and for sharing the debate. You are exactly the kind of leader this campaign is built on.\n\nI have one ask: would you be willing to make 5 phone calls to your neighbors in Broken Arrow before June 16?\n\nYou don't need a script. Just tell them what you told your Facebook friends — that Tulsa needs a DA who believes crime victims and stops wasting taxpayer money.\n\nPeer-to-peer contact is the highest-converting action in any campaign. Your voice carries more weight than any ad I can run.\n\nIf you're willing, reply to this email or visit colleenmccarty.com/volunteer. I'll send you a short list of 5 registered Republicans in your ZIP code.\n\nWith deep gratitude,\nColleen",
    },
    mediaRecommendations: [
      { channel: "Email — Volunteer Ask", allocation: 50, tactic: "Direct personal email from Colleen asking Kathleen to make 5 peer calls in Broken Arrow. Include pre-filled volunteer form. This is the highest-ROI action for this profile.", color: "#10b981" },
      { channel: "CTV — Maintenance Frequency", allocation: 25, tactic: "1 additional CTV impression of 'Endorsement :30' to maintain enthusiasm. Do not over-serve — she is already converted.", color: "#f59e0b" },
      { channel: "Facebook — Peer Amplification", allocation: 15, tactic: "Boost her existing debate share post as a 'dark post' to her Broken Arrow ZIP code network. Her organic credibility amplifies the paid reach.", color: "#1877f2" },
      { channel: "SMS / Text Reminder", allocation: 10, tactic: "Send early voting reminder text June 9 with polling location. She is a high-propensity voter but a personal touch reinforces the relationship.", color: "#8b5cf6" },
    ],
    tags: ["Donor", "Debate Viewer", "Volunteer Prospect", "Peer Messenger", "Mobilization Priority", "Broken Arrow Network"],
  },
];

export function getMcCartyProfiles(): BuyerProfile[] {
  return MCCARTY_VOTER_PROFILES;
}
