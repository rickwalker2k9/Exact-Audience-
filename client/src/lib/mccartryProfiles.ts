/**
 * mccartryProfiles.ts
 * 3 voter journey profiles for the Colleen McCarty for DA campaign.
 * Each profile includes a 30-day pre-campaign LOOKBACK window (April 28 – May 27)
 * showing real online behavioral signals, then the CAMPAIGN period (May 28+).
 *
 * Lookback signals: news site visits, crime/justice searches, Kunzweiler research,
 * civic Facebook engagement, local political content.
 * Campaign signals: website visits + social boosts (May 28), CTV + digital (May 29+).
 */
import type { BuyerProfile } from "./buyerProfiles";

export const MCCARTY_VOTER_PROFILES: BuyerProfile[] = [
  // ─── Profile 1: Carol Bentley — High-Intent Civic Voter ───────────────────
  {
    id: "mc-001",
    dashboardId: "mccarty",
    name: "Carol Bentley",
    age: 68,
    location: "Tulsa, OK 74136",
    occupation: "Retired Educator",
    avatar: "CB",
    avatarColor: "#2a6496",
    buyerDNA: "High-propensity GOP primary voter. Watches local news daily. Deeply concerned about crime victims being ignored. Responds to accountability and reform messaging. Persuasion threshold: LOW — 3–4 exposures.",
    engagementScore: 94,
    journeySummary: "Carol\'s 30-day lookback shows a voter already primed on crime and DA accountability — she visited local news sites, read about the Glossip case, and searched Kunzweiler\'s record before Colleen\'s campaign ever launched. Once the campaign went live May 28, she visited the website the same day. When CTV ads launched May 29, she completed multiple ad views within 48 hours. She is the highest-value voter in this segment.",
    signals: [
      // ── 30-DAY LOOKBACK (April 28 – May 27) ──────────────────────────────
      { phase: "lookback", date: "Apr 29", channel: "News on 6 / KOTV.com", action: "Read crime coverage", detail: "Visited KOTV.com — read \'Tulsa County DA race heats up\' article. Spent 6:42 on page. SiteID matched.", strength: "medium" },
      { phase: "lookback", date: "May 2",  channel: "Google Search", action: "Searched DA race", detail: "\"Tulsa County DA candidates 2026\" — clicked Tulsa World article on the Republican primary field", strength: "medium" },
      { phase: "lookback", date: "May 5",  channel: "Tulsa World", action: "Read political coverage", detail: "Read \'Who is running for Tulsa County DA?\' — spent 4:18 on article. Visited twice in one week.", strength: "medium" },
      { phase: "lookback", date: "May 8",  channel: "Google Search", action: "Searched incumbent DA", detail: "\"Steve Kunzweiler record\" and \"Kunzweiler DA controversy\" — visited Frontier article on unlicensed attorneys scandal", strength: "high" },
      { phase: "lookback", date: "May 10", channel: "Facebook", action: "Engaged with civic content", detail: "Liked and commented on Tulsa County Republican Women\'s Facebook post about the DA race. Followed local political group.", strength: "medium" },
      { phase: "lookback", date: "May 13", channel: "Google Search", action: "Searched candidate", detail: "\"Colleen McCarty prosecutor\" — first search of the candidate. Clicked to colleenmccarty.com but bounced after 0:42.", strength: "medium" },
      { phase: "lookback", date: "May 16", channel: "News on 6 / KOTV.com", action: "Read crime/justice story", detail: "Read KOTV story on Tulsa crime statistics and DA office performance. Shared to personal Facebook.", strength: "high" },
      { phase: "lookback", date: "May 19", channel: "Facebook", action: "Engaged with political content", detail: "Watched a 2-min Facebook video on Tulsa crime victims advocacy. Commented \'This is exactly why we need new leadership in the DA office.\'", strength: "high" },
      { phase: "lookback", date: "May 22", channel: "Google Search", action: "Searched Glossip case", detail: "\"Richard Glossip case Tulsa\" and \"DA office misconduct Oklahoma\" — read multiple articles on hidden evidence controversy", strength: "very-high" },
      { phase: "lookback", date: "May 25", channel: "Tulsa World", action: "Read endorsement coverage", detail: "Read \'McCarty endorsed by Tulsa County Sheriff\' article — spent 8:14 on page. Returned same day.", strength: "very-high" },
      { phase: "lookback", date: "May 27", channel: "Google Search", action: "Searched candidate again", detail: "\"Colleen McCarty DA endorsements\" and \"Colleen McCarty Blueprint for Justice\" — visited campaign site for 2:18", strength: "high" },
      // ── CAMPAIGN PERIOD (May 28+) ─────────────────────────────────────────
      { phase: "campaign", date: "May 28", channel: "Campaign Website", action: "Site visit — 4:12 session", detail: "Returned to colleenmccarty.com — read \'Blueprint for Justice\' and \'About Colleen\' pages in full. SiteID matched: Carol Bentley, 68, Tulsa.", strength: "very-high" },
      { phase: "campaign", date: "May 28", channel: "Facebook Boost", action: "Engaged with boosted post", detail: "Liked and shared Colleen\'s campaign launch post. Left comment: \'Tulsa needs this change.\' Organic + paid reach overlap.", strength: "high" },
      { phase: "campaign", date: "May 29", channel: "CTV — Samsung TV Plus", action: "Watched ad to completion", detail: "Name ID — \'Colleen\' :30 — 100% completion. First CTV exposure after campaign launch.", strength: "high" },
      { phase: "campaign", date: "May 30", channel: "CTV — Tubi", action: "Watched ad to completion", detail: "Victims First :15 — 2nd CTV exposure. Watched during primetime evening viewing.", strength: "high" },
      { phase: "campaign", date: "May 31", channel: "Email", action: "Opened campaign email", detail: "Subject: \'Tulsa deserves better — here\'s my plan\' — opened within 4 hours of send.", strength: "high" },
      { phase: "campaign", date: "Jun 1",  channel: "CTV — Fox News", action: "Watched ad to completion", detail: "Accountability — \'Enough\' :30 — 3rd total CTV exposure. Watched during Fox News primetime.", strength: "very-high" },
    ],
    purchaseWindows: [
      { window: "7 days", probability: 88, reasoning: "3 CTV completions, site visit, email open, and 30-day lookback showing deep pre-existing issue alignment. One more high-frequency impression seals the vote." },
      { window: "30 days", probability: 96, reasoning: "She was already researching the race and Kunzweiler\'s record before the campaign launched. She is past persuasion threshold. Barring a major negative event, Carol is a committed McCarty voter by June 16." },
      { window: "6 months", probability: 99, reasoning: "Strong civic identity voter. Once committed, she votes. No attrition risk." },
    ],
    personalizedMessage: {
      subject: "Carol — Tulsa\'s crime victims need a DA who believes them",
      body: "Carol,\n\nYou\'ve been following this race closely — and you already know what\'s at stake.\n\nFor too long, crime victims in Tulsa County have been ignored while the DA\'s office made headlines for the wrong reasons — hidden evidence, unlicensed lawyers in court, millions in taxpayer settlements.\n\nI\'m running because Tulsa deserves a modern DA\'s office — one that puts victims first, uses data and technology, and operates with integrity.\n\nYour vote on June 16 is how we make that happen.\n\nWith gratitude,\nColleen McCarty\n\nP.S. Early voting begins June 9. Find your polling location at vote.ok.gov.",
    },
    mediaRecommendations: [
      { channel: "CTV — Fox News / NewsNation", allocation: 45, tactic: "1–2 final impressions of \'Accountability :30\' — she watches primetime news. Time delivery for 6–9 PM window.", color: "#2a6496" },
      { channel: "Email Retargeting", allocation: 25, tactic: "Send \'Early Voting Reminder\' email June 9 — she opened the last email. Include polling location lookup link.", color: "#10b981" },
      { channel: "Facebook Retargeting", allocation: 20, tactic: "Serve \'Victims First :15\' clip as a Facebook video ad — she already engaged with civic content organically.", color: "#1877f2" },
      { channel: "Google Search", allocation: 10, tactic: "Bid on \'Tulsa DA election 2026\' — she searched this before. Serve the endorsement landing page.", color: "#fbbc04" },
    ],
    tags: ["High Intent", "30-Day Lookback", "SiteID Matched", "Email Opener", "Persuasion Threshold Met"],
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
    journeySummary: "Randy\'s 30-day lookback reveals a voter driven by frustration with local crime and government waste — he searched Tulsa crime statistics, read about the DA office budget, and visited Kunzweiler\'s campaign site before Colleen\'s campaign launched. He is not a natural early adopter but responds to contrast messaging. His Reddit engagement on the DA race confirms he is actively deciding. Needs 2–3 more targeted impressions to cross the persuasion threshold before June 16.",
    signals: [
      // ── 30-DAY LOOKBACK (April 28 – May 27) ──────────────────────────────
      { phase: "lookback", date: "Apr 30", channel: "Google Search", action: "Searched local crime", detail: "\"Tulsa crime rate 2026\" and \"Tulsa violent crime statistics\" — visited KJRH and Tulsa World crime coverage", strength: "medium" },
      { phase: "lookback", date: "May 3",  channel: "YouTube", action: "Watched local news segment", detail: "Searched \'Tulsa crime news\' — watched KJRH 2 News segment on property crime surge in midtown Tulsa. 8:42 watch time.", strength: "medium" },
      { phase: "lookback", date: "May 6",  channel: "Facebook", action: "Engaged with local news post", detail: "Commented on Tulsa World Facebook post about DA office budget: \'Where does all this money go? Crime is still out of control.\'", strength: "medium" },
      { phase: "lookback", date: "May 9",  channel: "Google Search", action: "Searched DA office", detail: "\"Tulsa DA office budget\" and \"Kunzweiler DA performance\" — visited Frontier article on DA office taxpayer settlements", strength: "high" },
      { phase: "lookback", date: "May 12", channel: "Kunzweiler Campaign Site", action: "Visited incumbent site", detail: "Visited stevekunzweiler.com — spent 1:24 on homepage. Did not visit sub-pages. Behavioral signal: evaluating incumbent.", strength: "medium" },
      { phase: "lookback", date: "May 15", channel: "Google Search", action: "Searched DA race", detail: "\"Tulsa DA race 2026 candidates\" — clicked Tulsa World primary preview article. Read about all three candidates.", strength: "medium" },
      { phase: "lookback", date: "May 18", channel: "Reddit", action: "Read political thread", detail: "r/tulsa — \'Who are you voting for in the DA race?\' thread. Read 22 comments. Did not post. Upvoted pro-reform comment.", strength: "high" },
      { phase: "lookback", date: "May 21", channel: "YouTube", action: "Watched accountability content", detail: "Watched \'Tulsa DA office controversy\' YouTube video — 14:22 watch time. Subscribed to Tulsa political commentary channel.", strength: "high" },
      { phase: "lookback", date: "May 24", channel: "Google Search", action: "Searched taxpayer waste", detail: "\"Kunzweiler unlicensed attorneys\" and \"Tulsa DA office scandal\" — read multiple Frontier and Tulsa World investigative pieces", strength: "very-high" },
      { phase: "lookback", date: "May 27", channel: "Facebook", action: "Engaged with civic content", detail: "Liked post from Tulsa County Republican Party about the DA primary. Clicked through to party website.", strength: "medium" },
      // ── CAMPAIGN PERIOD (May 28+) ─────────────────────────────────────────
      { phase: "campaign", date: "May 28", channel: "Campaign Website", action: "Site visit — 1:48 session", detail: "Landed on colleenmccarty.com homepage. SiteID matched: Randy Lopp, 57, Tulsa. Did not visit \'Blueprint for Justice\' page.", strength: "medium" },
      { phase: "campaign", date: "May 28", channel: "Facebook Boost", action: "Saw boosted post", detail: "Campaign launch post served via Facebook boost — impression confirmed, no engagement yet.", strength: "low" },
      { phase: "campaign", date: "May 29", channel: "CTV — Pluto TV", action: "Watched ad to completion", detail: "Taxpayer Waste :30 — 1st CTV exposure. 100% completion. Served during evening content block.", strength: "medium" },
      { phase: "campaign", date: "May 31", channel: "CTV — Pluto TV", action: "Watched ad to completion", detail: "Taxpayer Waste :30 — 2nd exposure. Frequency now at 2x on this creative.", strength: "high" },
      { phase: "campaign", date: "Jun 1",  channel: "Google Search", action: "Searched candidate name", detail: "\"Colleen McCarty DA record\" — strong post-ad search signal. Visited Frontier endorsement article.", strength: "high" },
      { phase: "campaign", date: "Jun 2",  channel: "CTV — NewsNation", action: "Watched ad to completion", detail: "Accountability — \'Enough\' :30 — 3rd total CTV exposure. Frequency building toward persuasion threshold.", strength: "high" },
    ],
    purchaseWindows: [
      { window: "7 days", probability: 62, reasoning: "He researched Kunzweiler\'s record extensively in the lookback window and is now receiving CTV impressions. Contrast signals are strong. Needs 2–3 more impressions to cross persuasion threshold." },
      { window: "30 days", probability: 84, reasoning: "By Election Day June 16, sustained CTV frequency plus a direct mail or email touch will likely convert him. His Reddit engagement confirms he is actively deciding." },
      { window: "6 months", probability: 91, reasoning: "Once he votes McCarty, he is likely to remain a supporter. Tulsa resident with strong local crime concerns." },
    ],
    personalizedMessage: {
      subject: "Randy — you\'ve been following the DA race. Here\'s what the record shows.",
      body: "Randy,\n\nYou\'ve been doing your research — and you\'ve seen what I\'ve seen.\n\nUnlicensed attorneys practicing in Tulsa County courts. Millions in taxpayer settlements. A DA\'s office that has been in the headlines for the wrong reasons for years.\n\nI\'m running because Tulsa taxpayers deserve accountability — and crime victims deserve a DA who actually fights for them.\n\nI\'m Colleen McCarty. I\'ve spent my career as a prosecutor. I know how to run this office, and I know what needs to change.\n\nVote June 16. Early voting starts June 9.\n\nColleen McCarty",
    },
    mediaRecommendations: [
      { channel: "CTV — Pluto TV / NewsNation", allocation: 42, tactic: "Continue \'Taxpayer Waste :30\' and \'Accountability :30\' rotation. He responds to contrast messaging. Target 6–10 PM window.", color: "#0284c7" },
      { channel: "Google Retargeting", allocation: 22, tactic: "Retarget on Frontier and Tulsa World. Bid on \'Kunzweiler DA record\', \'Tulsa DA accountability\'. Serve contrast-focused display ad.", color: "#fbbc04" },
      { channel: "Facebook Retargeting", allocation: 20, tactic: "Serve \'Taxpayer Waste\' video clip as Facebook ad. He engaged with the DA race on Facebook organically — retarget that audience.", color: "#1877f2" },
      { channel: "YouTube Retargeting", allocation: 10, tactic: "Pre-roll on Tulsa news and political content. He watches YouTube news — serve \'Accountability :15\' before local news segments.", color: "#f59e0b" },
      { channel: "Email", allocation: 6, tactic: "If email is available: \'Randy — the Kunzweiler record, in one page.\' Direct accountability summary with vote.ok.gov link.", color: "#10b981" },
    ],
    tags: ["Crime-Concerned", "30-Day Lookback", "Kunzweiler Researcher", "Reddit Active", "Contrast Messaging"],
  },

  // ─── Profile 3: Melissa Tran — First-Time Primary Voter ──────────────────
  {
    id: "mc-003",
    dashboardId: "mccarty",
    name: "Melissa Tran",
    age: 44,
    location: "Broken Arrow, OK 74012",
    occupation: "Nurse Practitioner",
    avatar: "MT",
    avatarColor: "#7c3aed",
    buyerDNA: "Registered GOP voter but infrequent primary participant. Motivated by domestic violence reform and victim advocacy. Responds to personal story and reform messaging. Persuasion threshold: MEDIUM — 4–5 exposures.",
    engagementScore: 79,
    journeySummary: "Melissa\'s 30-day lookback shows a voter activated by DV advocacy content — she followed local victim services organizations on Facebook, read about the DA office\'s handling of DV cases, and searched for candidate positions on victim advocacy before the campaign launched. She is not a political news consumer but engages deeply with cause-driven content. Once the campaign launched May 28, she visited the website and engaged with social media boosts. CTV impressions are building her toward the persuasion threshold.",
    signals: [
      // ── 30-DAY LOOKBACK (April 28 – May 27) ──────────────────────────────
      { phase: "lookback", date: "May 1",  channel: "Facebook", action: "Followed advocacy page", detail: "Followed Tulsa DVIS (Domestic Violence Intervention Services) Facebook page. Engaged with 3 posts about survivor resources.", strength: "medium" },
      { phase: "lookback", date: "May 4",  channel: "Google Search", action: "Searched DV policy", detail: "\"Tulsa domestic violence prosecution rate\" and \"DA office DV cases Oklahoma\" — visited DVIS.org and a Tulsa World report on DV case outcomes", strength: "high" },
      { phase: "lookback", date: "May 7",  channel: "Facebook", action: "Engaged with news post", detail: "Commented on KJRH Facebook post about DV awareness month: \'The DA office needs to do better for survivors.\'", strength: "high" },
      { phase: "lookback", date: "May 10", channel: "Google Search", action: "Searched DA race", detail: "\"Tulsa DA candidates domestic violence\" — looking for candidate positions on DV prosecution. Visited Tulsa World primary coverage.", strength: "high" },
      { phase: "lookback", date: "May 13", channel: "Tulsa World", action: "Read candidate profile", detail: "Read \'Meet the candidates for Tulsa County DA\' — spent 9:14 on article. Focused on McCarty\'s victim advocacy background.", strength: "very-high" },
      { phase: "lookback", date: "May 16", channel: "Google Search", action: "Searched candidate", detail: "\"Colleen McCarty domestic violence\" and \"Colleen McCarty victim advocacy\" — first direct candidate search", strength: "high" },
      { phase: "lookback", date: "May 19", channel: "Facebook", action: "Engaged with advocacy content", detail: "Shared a post from Oklahoma Coalition Against Domestic Violence and Sexual Assault. Tagged two friends.", strength: "medium" },
      { phase: "lookback", date: "May 22", channel: "colleenmccarty.com", action: "First site visit — 3:28 session", detail: "Visited campaign website — read \'Protecting Victims\' page and \'About Colleen\' bio. Did not convert. SiteID matched: Melissa Tran, 44, Broken Arrow.", strength: "very-high" },
      { phase: "lookback", date: "May 25", channel: "Facebook", action: "Saw organic campaign post", detail: "McCarty campaign post about DV prosecution reform appeared in feed — liked the post. First organic campaign contact.", strength: "medium" },
      { phase: "lookback", date: "May 27", channel: "Google Search", action: "Searched voting info", detail: "\"Tulsa County primary election 2026 date\" and \"how to vote in Oklahoma primary\" — checking election logistics for the first time", strength: "high" },
      // ── CAMPAIGN PERIOD (May 28+) ─────────────────────────────────────────
      { phase: "campaign", date: "May 28", channel: "Campaign Website", action: "Return visit — 5:44 session", detail: "Returned to colleenmccarty.com — read \'Blueprint for Justice\' in full, visited \'Endorsements\' page. SiteID re-matched.", strength: "very-high" },
      { phase: "campaign", date: "May 28", channel: "Facebook Boost", action: "Engaged with boosted post", detail: "Liked and saved Colleen\'s campaign launch video. Clicked \'Learn More\' link to website.", strength: "high" },
      { phase: "campaign", date: "May 29", channel: "CTV — Tubi", action: "Watched ad to completion", detail: "Bio 15-2 — \'Colleen\'s Story\' :15 — 100% completion. First CTV exposure. Served during evening content block.", strength: "high" },
      { phase: "campaign", date: "May 30", channel: "Meta", action: "Ad engagement", detail: "Clicked on \'Protecting Victims\' Facebook ad — visited Victims page on campaign site for 2:18.", strength: "high" },
      { phase: "campaign", date: "Jun 1",  channel: "CTV — Samsung TV Plus", action: "Watched ad to completion", detail: "Victims First :15 — 2nd CTV exposure. Watched during primetime. Frequency building.", strength: "very-high" },
    ],
    purchaseWindows: [
      { window: "7 days", probability: 71, reasoning: "Deep pre-campaign engagement on DV advocacy, two site visits, and two CTV completions. She is emotionally aligned with the campaign message. 1–2 more impressions will likely seal the vote." },
      { window: "30 days", probability: 90, reasoning: "She searched voting logistics on May 27 — she intends to vote. Her issue alignment is strong and she is actively engaging with campaign content. High probability of conversion by June 16." },
      { window: "6 months", probability: 95, reasoning: "Cause-driven voter. Once activated on an issue, she stays engaged. High LTV supporter if the campaign maintains contact." },
    ],
    personalizedMessage: {
      subject: "Melissa — Tulsa\'s DV survivors need a DA who fights for them",
      body: "Melissa,\n\nYou\'ve been following the work of Tulsa DVIS and advocating for survivors. You know what\'s at stake in this race.\n\nAs a prosecutor, I\'ve stood in courtrooms and fought for domestic violence victims when no one else would. I\'ve seen firsthand what happens when a DA\'s office doesn\'t prioritize survivor cases — and I\'ve made it my mission to change that.\n\nMy Blueprint for Justice includes a dedicated DV prosecution unit, mandatory victim advocate assignment for every case, and a zero-tolerance policy for case dismissals without victim consultation.\n\nYour vote on June 16 is a vote for every survivor in Tulsa County.\n\nWith gratitude,\nColleen McCarty\n\nP.S. Early voting begins June 9. It takes less than 10 minutes. vote.ok.gov",
    },
    mediaRecommendations: [
      { channel: "CTV — Tubi / Samsung TV Plus", allocation: 40, tactic: "Continue \'Bio 15-2\' and \'Victims First :15\' rotation. She responds to personal story and victim advocacy messaging. Evening delivery.", color: "#7c3aed" },
      { channel: "Facebook Retargeting", allocation: 28, tactic: "Serve \'Protecting Victims\' video ad. Retarget her DV advocacy Facebook engagement. She is active in this content category.", color: "#1877f2" },
      { channel: "Email", allocation: 18, tactic: "If email available: \'Melissa — my commitment to DV survivors in Tulsa County.\' Personal story format with Blueprint for Justice summary and vote.ok.gov link.", color: "#10b981" },
      { channel: "Google Retargeting", allocation: 10, tactic: "Display retargeting on DV advocacy and local news sites. Bid on \'Tulsa DA victims\' and \'Colleen McCarty\'.", color: "#fbbc04" },
      { channel: "Instagram", allocation: 4, tactic: "Serve \'Victims First :15\' as Instagram Story ad. She is active on Facebook/Instagram ecosystem.", color: "#8b5cf6" },
    ],
    tags: ["DV Advocacy", "30-Day Lookback", "SiteID Matched", "First-Time Primary", "Cause-Driven"],
  },
];

export function getMcCartyProfiles(): BuyerProfile[] {
  return MCCARTY_VOTER_PROFILES;
}
