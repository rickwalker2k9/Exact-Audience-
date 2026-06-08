/**
 * voterProfiles.ts
 * 12 identified registered Republican voters for the 2026 Oklahoma Governor's race.
 * 6 from Oklahoma County (OKC area), 6 from Tulsa County.
 *
 * Each profile includes:
 *  - 30-day LOOKBACK window: Reddit threads, Truth Social (rare), candidate websites,
 *    TV station debate coverage, YouTube debate replays, TV website replays
 *  - CAMPAIGN period: CTV (network vs streaming), Email, Facebook, LinkedIn,
 *    SMS, retargeting, direct mail
 *  - Custom per-voter suggested messaging for each active channel
 *  - Media mix recommendations with allocation percentages
 *  - Predicted persuasion windows (7-day, 30-day, Election Day)
 *
 * Design: dark purple #0c0618, gold #f59e0b, orange #f97316, white text
 */

// ── Types ─────────────────────────────────────────────────────────────────────

export type VoterStatus =
  | "Undecided"
  | "Soft Keating"
  | "Soft McCall"
  | "Soft Drummond"
  | "Persuadable";

export interface VoterJourneyStep {
  phase: "lookback" | "campaign";
  date: string;
  channel: string;
  action: string;
  signal: "positive" | "neutral" | "negative";
  detail: string;
  strength: "low" | "medium" | "high" | "very-high";
}

export interface PersuasionWindow {
  window: string;
  probability: number;
  reasoning: string;
}

export interface ChannelMessage {
  channel: string;
  subject?: string;
  body: string;
  tactic: string;
}

export interface MediaRecommendation {
  channel: string;
  allocation: number;
  tactic: string;
  color: string;
}

export interface VoterProfile {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  occupation: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  county: "Oklahoma" | "Tulsa";
  status: VoterStatus;
  primaryVotingHistory: string;
  currentSignal: string;
  adTouches: number;
  moveProbability: number; // 0–100
  tags: string[];
  voterDNA: string;
  journeySummary: string;
  journey: VoterJourneyStep[];
  persuasionWindows: PersuasionWindow[];
  channelMessages: ChannelMessage[];
  mediaRecommendations: MediaRecommendation[];
}

// ── Helper exports ────────────────────────────────────────────────────────────

export function getStatusColor(status: VoterStatus): string {
  switch (status) {
    case "Undecided":      return "#fbbf24";
    case "Soft Keating":   return "#f97316";
    case "Soft McCall":    return "#f59e0b";
    case "Soft Drummond":  return "#d97706";
    case "Persuadable":    return "#34d399";
    default:               return "#ffffff";
  }
}

export function getMoveProbabilityColor(p: number): string {
  if (p >= 75) return "#34d399";
  if (p >= 55) return "#fbbf24";
  return "#f97316";
}

export function getVoterById(id: string): VoterProfile | undefined {
  return VOTER_PROFILES.find(v => v.id === id);
}

// ── 12 Voter Profiles ─────────────────────────────────────────────────────────

export const VOTER_PROFILES: VoterProfile[] = [

  // ═══════════════════════════════════════════════════════════════════════════
  // OKLAHOMA COUNTY — 6 voters
  // ═══════════════════════════════════════════════════════════════════════════

  // ── ok-001: Robert Hargrove — Commercial Real Estate, Soft McCall ──────────
  {
    id: "ok-001",
    firstName: "Robert",
    lastName: "Hargrove",
    age: 58,
    occupation: "Commercial Real Estate Developer",
    address: "4821 NW Grand Blvd",
    city: "Oklahoma City",
    state: "OK",
    zip: "73116",
    county: "Oklahoma",
    status: "Soft McCall",
    primaryVotingHistory: "Voted in 6 of last 8 Republican primaries",
    currentSignal: "Researched McCall's fiscal policy page 3x — comparing to Drummond's business record",
    adTouches: 7,
    moveProbability: 68,
    tags: ["Fiscal Conservative", "Business Owner", "High-Frequency Voter", "CRE Sector"],
    voterDNA: "High-propensity Republican primary voter in commercial real estate. Driven by fiscal conservatism and business-friendly governance. Visited McCall's budget page multiple times but also researching Drummond's business record — classic institutional conservative comparison-shopping before committing. Responds to economic credibility and endorsements from the business community.",
    journeySummary: "Robert's 30-day lookback shows a voter already deep in the race — he read debate coverage on KFOR.com, watched the YouTube replay of the OETA debate, and visited both McCall and Drummond's campaign sites before any paid campaign reached him. His Reddit activity on r/oklahoma confirms he's actively comparing candidates. Once CTV launched, he completed 7 ads across Fox News and Fox Business. He is a high-value conversion — one final frequency push and a direct email from the candidate will seal his vote.",
    journey: [
      // ── 30-DAY LOOKBACK ──────────────────────────────────────────────────
      { phase: "lookback", date: "May 10", channel: "Google Search", action: "Searched governor race", detail: "\"Oklahoma governor race 2026 candidates\" — clicked KFOR.com race overview article. Spent 5:42 on page.", signal: "neutral", strength: "medium" },
      { phase: "lookback", date: "May 12", channel: "KFOR.com", action: "Read debate coverage", detail: "Read KFOR article on the first Republican primary debate. Returned to the page twice. SiteID matched.", signal: "neutral", strength: "medium" },
      { phase: "lookback", date: "May 14", channel: "YouTube — OETA", action: "Watched debate replay", detail: "Searched 'Oklahoma governor debate 2026' — watched OETA full debate replay. 47:12 watch time. Paused during fiscal policy exchange.", signal: "neutral", strength: "high" },
      { phase: "lookback", date: "May 17", channel: "McCall Campaign Site", action: "Visited mccallforoklahoma.com", detail: "Landed on budget/fiscal page — 4:18 session. Read tax cut plan in full. First candidate site visit.", signal: "positive", strength: "high" },
      { phase: "lookback", date: "May 19", channel: "Reddit — r/oklahoma", action: "Read governor race thread", detail: "r/oklahoma — 'Who are you voting for in the GOP governor primary?' — read 34 comments, upvoted a pro-McCall fiscal policy comment. Did not post.", signal: "positive", strength: "high" },
      { phase: "lookback", date: "May 21", channel: "Drummond Campaign Site", action: "Visited drummondok.com", detail: "Visited AG record and business endorsements page — 3:05 session. Comparison-shopping signal.", signal: "neutral", strength: "medium" },
      { phase: "lookback", date: "May 24", channel: "Google Search", action: "Searched candidate comparison", detail: "\"McCall vs Drummond governor\" — clicked Oklahoman.com candidate comparison article.", signal: "neutral", strength: "medium" },
      { phase: "lookback", date: "May 27", channel: "McCall Campaign Site", action: "Returned to fiscal page", detail: "Second visit to mccallforoklahoma.com budget page — 3:48 session. Viewed endorsements tab.", signal: "positive", strength: "high" },
      // ── CAMPAIGN PERIOD ──────────────────────────────────────────────────
      { phase: "campaign", date: "Jun 1", channel: "CTV — Fox News", action: "Watched McCall fiscal ad (full completion)", detail: "McCall 'Oklahoma Business First' :30 — 100% completion. First CTV exposure. No channel change.", signal: "positive", strength: "high" },
      { phase: "campaign", date: "Jun 2", channel: "Facebook", action: "Clicked McCall campaign ad", detail: "Visited mccallforoklahoma.com from Facebook ad — 4:12 on budget page. Third site visit.", signal: "positive", strength: "high" },
      { phase: "campaign", date: "Jun 3", channel: "Google Search", action: "Searched 'Drummond vs McCall governor'", detail: "Comparison shopping — visited both campaign sites in same session. Still evaluating.", signal: "neutral", strength: "medium" },
      { phase: "campaign", date: "Jun 4", channel: "CTV — Fox Business", action: "Watched Drummond ad (full completion)", detail: "Drummond biographical :30 — completed. Potential split-decision signal.", signal: "neutral", strength: "medium" },
      { phase: "campaign", date: "Jun 5", channel: "Facebook", action: "Liked McCall tax cut post", detail: "Liked McCall's tax cut announcement post — organic engagement signal.", signal: "positive", strength: "high" },
      { phase: "campaign", date: "Jun 6", channel: "CTV — Fox Business", action: "Watched McCall ad (full completion)", detail: "7th total ad exposure — behavioral signal strengthening toward McCall.", signal: "positive", strength: "high" },
      { phase: "campaign", date: "Jun 7", channel: "Instagram", action: "Viewed McCall endorsement story (3x replay)", detail: "Replayed McCall business community endorsement story three times — high intent signal.", signal: "positive", strength: "very-high" },
    ],
    persuasionWindows: [
      { window: "7 days", probability: 58, reasoning: "7 CTV completions, 3 site visits, and Reddit engagement show strong pre-existing McCall lean. Needs 2–3 more impressions to cross persuasion threshold before June 16." },
      { window: "30 days", probability: 68, reasoning: "Fiscal conservative who has done his research. A direct email with business community endorsements will likely seal his vote. Drummond comparison-shopping is weakening." },
      { window: "Election Day", probability: 79, reasoning: "High-propensity voter who votes when he's made up his mind. Once committed to McCall, he votes. No attrition risk." },
    ],
    channelMessages: [
      {
        channel: "Email",
        subject: "Robert — Oklahoma's business community is backing Kevin McCall",
        body: "Robert,\n\nYou've been doing your research on this race — and you've seen what Oklahoma's business community has seen.\n\nKevin McCall is the only candidate in this race with a real plan to cut taxes, reduce regulation, and put Oklahoma businesses first.\n\nThe Oklahoma Chamber of Commerce, the state's top commercial real estate leaders, and over 200 business owners across the state have endorsed Kevin because they know what's at stake.\n\nYour vote on June 16 is how we protect Oklahoma's economic future.\n\nKevin McCall for Governor",
        tactic: "Send Tuesday June 10 — business-focused subject line, endorsement-heavy body. Include chamber endorsement quote.",
      },
      {
        channel: "Facebook",
        subject: undefined,
        body: "Robert Hargrove has engaged with McCall's fiscal content 3x. Serve the 'Oklahoma Business First' video ad with the tax cut plan graphic. Use business owner targeting overlay.",
        tactic: "Retarget with :15 tax cut clip. Serve in Facebook feed, not Stories. $18 CPM bid.",
      },
      {
        channel: "CTV",
        subject: undefined,
        body: "Serve McCall 'Oklahoma Business First' :30 on Fox Business and Fox News. Robert watches both. Target 6–9 PM window. Frequency cap: 3 more impressions.",
        tactic: "Fox Business primetime + Fox News evening. Fiscal policy creative. 3-impression frequency cap.",
      },
      {
        channel: "SMS",
        subject: undefined,
        body: "Robert — Kevin McCall's tax cut plan would save Oklahoma businesses an avg of $4,200/yr. Vote June 16. Early voting starts June 9. mccallforoklahoma.com",
        tactic: "Send June 12 — 3 days before election. Business-specific stat. Include early voting link.",
      },
    ],
    mediaRecommendations: [
      { channel: "CTV — Fox Business / Fox News", allocation: 40, tactic: "3 final impressions of 'Oklahoma Business First :30'. Target 6–9 PM. Fox Business primetime is his primary viewing window.", color: "#f59e0b" },
      { channel: "Email", allocation: 28, tactic: "Business community endorsement email June 10. He opened the last email. Chamber endorsement quote as lead.", color: "#10b981" },
      { channel: "Facebook Retargeting", allocation: 20, tactic: "Retarget with :15 tax cut clip. He engaged with McCall content organically. Business owner targeting overlay.", color: "#1877f2" },
      { channel: "SMS", allocation: 12, tactic: "June 12 text with business savings stat. He's a high-propensity voter — a direct touch in final days will close.", color: "#f97316" },
    ],
  },

  // ── ok-002: Patricia Whitfield — Retired Principal, Undecided ──────────────
  {
    id: "ok-002",
    firstName: "Patricia",
    lastName: "Whitfield",
    age: 64,
    occupation: "Retired School Principal",
    address: "2317 NW 58th St",
    city: "Oklahoma City",
    state: "OK",
    zip: "73112",
    county: "Oklahoma",
    status: "Undecided",
    primaryVotingHistory: "Voted in every Republican primary since 2004",
    currentSignal: "Visited governor's race coverage on Oklahoman.com — no candidate site visits yet",
    adTouches: 4,
    moveProbability: 52,
    tags: ["Education Voter", "High-Frequency Voter", "Late Decider", "News Reader"],
    voterDNA: "Consistent Republican primary voter who has not yet committed to any candidate. Consuming race news heavily but not visiting campaign sites — classic late decider who will be influenced by final-week advertising frequency. Education policy is her primary driver. Responds to endorsements from teachers, school boards, and civic organizations.",
    journeySummary: "Patricia's lookback shows a voter deeply engaged with the race through news coverage but not yet ready to commit. She watched the KWTV debate replay on YouTube, read Oklahoman.com coverage extensively, and visited the OETA debate page twice. No candidate site visits in the lookback window — she's consuming news, not campaign materials. Once CTV launched, she completed ads for Drummond and Keating but has not clicked through to either site. A final-week frequency push with education-focused messaging will be decisive.",
    journey: [
      { phase: "lookback", date: "May 8", channel: "Oklahoman.com", action: "Read governor race overview", detail: "Read 'Oklahoma GOP governor primary: what you need to know' — 7:22 on page. SiteID matched.", signal: "neutral", strength: "medium" },
      { phase: "lookback", date: "May 11", channel: "YouTube — KWTV News 9", action: "Watched debate replay", detail: "Searched 'Oklahoma governor debate' — watched KWTV News 9 debate replay. 38:44 watch time. Paused during education exchange.", signal: "neutral", strength: "high" },
      { phase: "lookback", date: "May 14", channel: "OETA.tv", action: "Visited debate replay page", detail: "Visited oeta.tv/governor-debate — watched 22 minutes of the OETA debate replay. Returned same day.", signal: "neutral", strength: "high" },
      { phase: "lookback", date: "May 17", channel: "Facebook", action: "Engaged with civic content", detail: "Liked Oklahoma Education Association Facebook post about the governor's race. Commented 'Education has to be the priority.'", signal: "neutral", strength: "medium" },
      { phase: "lookback", date: "May 20", channel: "Google Search", action: "Searched candidate education positions", detail: "\"Oklahoma governor candidates education policy\" — read Oklahoman.com candidate comparison. No site visits.", signal: "neutral", strength: "medium" },
      { phase: "lookback", date: "May 24", channel: "Oklahoman.com", action: "Read endorsement coverage", detail: "Read 'Who has endorsed who in the GOP governor primary' — 5:18 on page. Education endorsements section highlighted.", signal: "neutral", strength: "medium" },
      { phase: "campaign", date: "Jun 2", channel: "CTV — KFOR", action: "Watched Drummond ad (full completion)", detail: "Drummond biographical :30 — first CTV exposure. No follow-up action.", signal: "neutral", strength: "medium" },
      { phase: "campaign", date: "Jun 3", channel: "Facebook", action: "Viewed governor's race news article", detail: "Read Oklahoman.com race overview from Facebook link — 6:30 on page. Still consuming news.", signal: "neutral", strength: "medium" },
      { phase: "campaign", date: "Jun 5", channel: "CTV — KWTV", action: "Watched Keating ad (full completion)", detail: "Keating law enforcement :30 — completed. No channel change. Second CTV exposure.", signal: "neutral", strength: "medium" },
      { phase: "campaign", date: "Jun 7", channel: "Facebook", action: "Clicked governor race news link", detail: "Read Frontier article on candidate positions — undecided signal. Still no candidate site visit.", signal: "neutral", strength: "low" },
    ],
    persuasionWindows: [
      { window: "7 days", probability: 42, reasoning: "High-propensity voter consuming news but not yet engaging with campaign materials. Needs 3–4 more CTV impressions plus an education-focused message to trigger a site visit and commit." },
      { window: "30 days", probability: 52, reasoning: "Late deciders like Patricia are won in the final week. Sustained CTV frequency with education messaging will move her. She votes every primary — she will decide, just late." },
      { window: "Election Day", probability: 68, reasoning: "Once she commits, she votes. The question is which candidate reaches her with the right message in the final 5 days." },
    ],
    channelMessages: [
      {
        channel: "Email",
        subject: "Patricia — which governor candidate has the strongest education plan?",
        body: "Patricia,\n\nYou've been following this race closely — and you know education is on the ballot.\n\nAs a retired principal, you've seen what strong leadership in the governor's office means for Oklahoma schools.\n\n[Candidate] has committed to [specific education policy] — and has earned the endorsement of [education organization].\n\nYour vote on June 16 matters for every classroom in Oklahoma.\n\nEarly voting starts June 9.",
        tactic: "Education-first subject line. Personalize with candidate's specific education policy commitment. Send June 9 — early voting day.",
      },
      {
        channel: "CTV",
        subject: undefined,
        body: "Patricia watches KFOR and KWTV. Serve education-focused creative on both local stations. She completed ads on both — frequency is building. 2–3 more impressions needed.",
        tactic: "KFOR + KWTV local news adjacency. Education-focused :30. Target 5–7 PM local news window.",
      },
      {
        channel: "Facebook",
        subject: undefined,
        body: "Patricia engaged with the Oklahoma Education Association post. Retarget with education-focused campaign content. She responds to civic and education messaging.",
        tactic: "Retarget with education policy video. Target OEA member lookalike audience. Serve in feed during morning hours.",
      },
    ],
    mediaRecommendations: [
      { channel: "CTV — KFOR / KWTV Local News", allocation: 50, tactic: "3–4 final impressions of education-focused :30. She completed ads on both stations. Local news adjacency 5–7 PM.", color: "#f59e0b" },
      { channel: "Facebook Retargeting", allocation: 30, tactic: "Education policy video ad. She engaged with OEA content. Civic/education targeting overlay.", color: "#1877f2" },
      { channel: "Email", allocation: 20, tactic: "Education-first email June 9. Late decider — she needs a direct message to trigger commitment.", color: "#10b981" },
    ],
  },

  // ── ok-003: David Strickland — Oil & Gas Engineer, Soft Keating ────────────
  {
    id: "ok-003",
    firstName: "David",
    lastName: "Strickland",
    age: 47,
    occupation: "Oil & Gas Engineer",
    address: "1104 Westridge Dr",
    city: "Edmond",
    state: "OK",
    zip: "73034",
    county: "Oklahoma",
    status: "Soft Keating",
    primaryVotingHistory: "Voted in 4 of last 6 Republican primaries",
    currentSignal: "Visited keating2026.com twice — viewed 'Law & Order' and 'Energy' pages",
    adTouches: 5,
    moveProbability: 61,
    tags: ["Energy Sector", "Law & Order Voter", "Keating Soft Supporter", "Mazzei Bleed Risk"],
    voterDNA: "Mid-propensity Republican primary voter in the energy sector. Drawn to Keating's law enforcement background and outsider message. At risk of migrating to Mazzei following Trump endorsement — needs reinforcement messaging in final 9 days. Energy policy is his secondary driver — Keating's oil & gas stance is a differentiator.",
    journeySummary: "David's lookback shows a voter activated by the Trump endorsement controversy — he searched Mazzei's endorsement, read the Frontier coverage, and visited Truth Social to see Trump's original post. He then visited Keating's site twice, focusing on the Law & Order and Energy pages. His Reddit activity on r/oklahoma shows he's skeptical of Trump's involvement in state races. CTV has reached him 5 times, but the Mazzei Trump ad created a bleed signal. A Keating-specific energy policy message and final-week frequency will hold him.",
    journey: [
      { phase: "lookback", date: "May 9", channel: "Google Search", action: "Searched Oklahoma governor race", detail: "\"Oklahoma governor 2026 Republican primary\" — clicked Frontier article on the field. First research signal.", signal: "neutral", strength: "medium" },
      { phase: "lookback", date: "May 13", channel: "Truth Social", action: "Viewed Trump endorsement post", detail: "Visited Trump's Truth Social post endorsing Mazzei for Oklahoma governor. Read comments. Did not repost. Rare Truth Social signal.", signal: "neutral", strength: "medium" },
      { phase: "lookback", date: "May 15", channel: "Frontier.com", action: "Read Mazzei endorsement coverage", detail: "Read 'Trump endorses Mazzei in Oklahoma governor race' — 4:44 on page. Read comments section.", signal: "neutral", strength: "medium" },
      { phase: "lookback", date: "May 18", channel: "Reddit — r/oklahoma", action: "Read Trump endorsement thread", detail: "r/oklahoma — 'Does Trump's endorsement matter in the governor race?' — read 28 comments. Upvoted skeptical comment about outside interference.", signal: "neutral", strength: "medium" },
      { phase: "lookback", date: "May 20", channel: "Keating Campaign Site", action: "Visited keating2026.com", detail: "First visit — Law & Order page. 3:45 session. Read Keating's law enforcement background.", signal: "positive", strength: "high" },
      { phase: "lookback", date: "May 23", channel: "YouTube — OETA", action: "Watched debate energy exchange", detail: "Searched 'Oklahoma governor debate energy policy' — watched the energy policy segment of the OETA debate. 12:18 watch time.", signal: "positive", strength: "high" },
      { phase: "lookback", date: "May 26", channel: "Keating Campaign Site", action: "Returned to keating2026.com", detail: "Second visit — viewed Energy page. 2:58 session. Behavioral lock-in signal for Keating.", signal: "positive", strength: "high" },
      { phase: "campaign", date: "Jun 1", channel: "CTV — Fox News", action: "Watched Keating :30 (full completion)", detail: "Keating 'Oklahoma Outsider' :30 — first CTV exposure. Strong completion signal.", signal: "positive", strength: "high" },
      { phase: "campaign", date: "Jun 4", channel: "CTV — Fox News", action: "Watched Mazzei Trump endorsement ad", detail: "Mazzei Trump endorsement :30 — completed. Potential bleed signal — he already researched this endorsement.", signal: "neutral", strength: "medium" },
      { phase: "campaign", date: "Jun 5", channel: "Facebook", action: "Viewed Keating post (no engagement)", detail: "Scrolled past Keating campaign post without engaging — weakening signal.", signal: "neutral", strength: "low" },
      { phase: "campaign", date: "Jun 7", channel: "Google Search", action: "Searched 'Trump endorsement Oklahoma governor'", detail: "Re-researching Trump endorsement — bleed risk elevated. Visited Mazzei site for first time.", signal: "negative", strength: "medium" },
    ],
    persuasionWindows: [
      { window: "7 days", probability: 51, reasoning: "Bleed risk is real — he's re-researching the Trump endorsement and visited Mazzei's site. Needs 2–3 Keating-specific energy policy impressions to hold." },
      { window: "30 days", probability: 61, reasoning: "His Reddit skepticism of Trump interference and his two Keating site visits show a genuine Keating lean. Energy policy messaging will reinforce this before June 16." },
      { window: "Election Day", probability: 72, reasoning: "If held through final week, he votes Keating. Mid-propensity voter who activates when he's committed." },
    ],
    channelMessages: [
      {
        channel: "Email",
        subject: "David — Chip Keating is the only candidate who will fight for Oklahoma's energy industry",
        body: "David,\n\nYou know what's at stake for Oklahoma's oil and gas industry — and you know that the next governor will set the tone for energy policy for the next four years.\n\nChip Keating has committed to protecting Oklahoma's energy sector from federal overreach, opposing any carbon tax, and keeping Oklahoma's energy economy the strongest in the nation.\n\nHe's not a career politician. He's an Oklahoman who understands what drives this state's economy.\n\nVote Chip Keating on June 16.\n\nEarly voting starts June 9.",
        tactic: "Energy-first subject line. Send June 10. Keating energy policy specifics. Counter the Mazzei bleed with policy contrast.",
      },
      {
        channel: "CTV",
        subject: undefined,
        body: "David watches Fox News. Serve Keating energy policy :30 on Fox News and Fox Business. He completed the Mazzei Trump ad — counter with Keating's energy record. Frequency cap: 3 more impressions.",
        tactic: "Fox News + Fox Business. Keating energy creative. Counter-program against Mazzei Trump ad frequency.",
      },
      {
        channel: "SMS",
        subject: undefined,
        body: "David — Chip Keating is the only candidate with a real plan to protect Oklahoma's oil & gas industry from Biden-era regulations. Vote June 16. keating2026.com",
        tactic: "Send June 13. Energy-specific stat. Direct link to Keating energy page.",
      },
      {
        channel: "Retargeting",
        subject: undefined,
        body: "David visited keating2026.com twice. Retarget with Keating energy policy display ad on Frontier.com and Oklahoman.com. He reads both. Energy sector targeting overlay.",
        tactic: "Display retargeting on Frontier + Oklahoman. Energy policy creative. $12 CPM bid.",
      },
    ],
    mediaRecommendations: [
      { channel: "CTV — Fox News / Fox Business", allocation: 38, tactic: "3 final impressions of Keating energy :30. Counter-program against Mazzei Trump ad. Fox Business 7–9 PM.", color: "#f97316" },
      { channel: "Email", allocation: 28, tactic: "Energy-first email June 10. He's researching — a direct policy message will hold him.", color: "#10b981" },
      { channel: "Display Retargeting", allocation: 20, tactic: "Retarget on Frontier + Oklahoman. He reads both. Energy sector overlay.", color: "#7c3aed" },
      { channel: "SMS", allocation: 14, tactic: "June 13 text with energy policy stat. Final-week direct touch.", color: "#f59e0b" },
    ],
  },

  // ── ok-004: Susan Caldwell — Healthcare Admin, Soft Drummond ──────────────
  {
    id: "ok-004",
    firstName: "Susan",
    lastName: "Caldwell",
    age: 55,
    occupation: "Healthcare Administrator",
    address: "8803 S Western Ave",
    city: "Oklahoma City",
    state: "OK",
    zip: "73139",
    county: "Oklahoma",
    status: "Soft Drummond",
    primaryVotingHistory: "Voted in 7 of last 8 Republican primaries",
    currentSignal: "Visited drummondok.com — viewed 'About Gentner' and endorsements page",
    adTouches: 8,
    moveProbability: 74,
    tags: ["Healthcare Voter", "Institutional Republican", "High-Frequency Voter", "Drummond Base"],
    voterDNA: "High-propensity institutional Republican with healthcare administration background. Drawn to Drummond's AG record, military service, and mainstream Republican endorsements. Responds to credibility and institutional trust signals. Strong move probability — needs 2–3 more frequency touches to lock in before June 16.",
    journeySummary: "Susan's lookback shows a voter who did her research before any campaign reached her — she watched the KWTV debate replay, visited Drummond's site twice, and read his endorsement coverage on Oklahoman.com. Her LinkedIn activity shows engagement with Drummond's professional network posts. Once CTV launched, she completed 8 ads across KWTV and Fox News. She followed Drummond's Instagram account on June 6 — a strong commitment signal. She is near the persuasion threshold. A final email with healthcare policy specifics will seal her vote.",
    journey: [
      { phase: "lookback", date: "May 7", channel: "Oklahoman.com", action: "Read Drummond profile", detail: "Read 'Who is Gentner Drummond?' — 6:18 on page. First candidate research signal.", signal: "positive", strength: "medium" },
      { phase: "lookback", date: "May 10", channel: "YouTube — KWTV News 9", action: "Watched debate replay", detail: "Watched KWTV News 9 debate replay — 44:22 watch time. Paused during healthcare exchange. Strong engagement signal.", signal: "positive", strength: "high" },
      { phase: "lookback", date: "May 13", channel: "Drummond Campaign Site", action: "Visited drummondok.com", detail: "First visit — 'About Gentner' page. 5:20 session. Read military service and AG record.", signal: "positive", strength: "high" },
      { phase: "lookback", date: "May 16", channel: "LinkedIn", action: "Engaged with Drummond endorsement post", detail: "Liked Drummond's post about Oklahoma Healthcare Association endorsement. Left comment: 'Exactly what Oklahoma needs.'", signal: "positive", strength: "high" },
      { phase: "lookback", date: "May 19", channel: "Oklahoman.com", action: "Read endorsement coverage", detail: "Read 'Drummond earns mainstream Republican endorsements' — 4:44 on page. Endorsements page focus.", signal: "positive", strength: "high" },
      { phase: "lookback", date: "May 23", channel: "Drummond Campaign Site", action: "Returned to drummondok.com", detail: "Second visit — endorsements page. 3:10 session. Behavioral lock-in signal.", signal: "positive", strength: "very-high" },
      { phase: "campaign", date: "May 29", channel: "CTV — KWTV", action: "Watched Drummond biographical ad (full completion)", detail: "Drummond 'Oklahoma's Next Governor' :30 — first CTV exposure. Strong completion.", signal: "positive", strength: "high" },
      { phase: "campaign", date: "May 31", channel: "Facebook", action: "Clicked Drummond campaign ad", detail: "Visited drummondok.com from Facebook ad — 5:20 on About page. Third site visit.", signal: "positive", strength: "high" },
      { phase: "campaign", date: "Jun 2", channel: "CTV — Fox News", action: "Watched Drummond military service ad (full completion)", detail: "3rd CTV exposure — strong completion signal.", signal: "positive", strength: "high" },
      { phase: "campaign", date: "Jun 3", channel: "Google Search", action: "Searched 'Drummond endorsements'", detail: "Visited endorsements page — 3:10 on page. Reinforcement signal.", signal: "positive", strength: "high" },
      { phase: "campaign", date: "Jun 5", channel: "CTV — KFOR", action: "Watched Drummond ad (full completion)", detail: "5th CTV exposure — behavioral lock-in signal.", signal: "positive", strength: "high" },
      { phase: "campaign", date: "Jun 6", channel: "Instagram", action: "Followed Drummond campaign account", detail: "Account follow — strong commitment signal. Near persuasion threshold.", signal: "positive", strength: "very-high" },
      { phase: "campaign", date: "Jun 7", channel: "CTV — Fox News", action: "Watched Drummond closing ad (full completion)", detail: "8th CTV exposure — near confirmed mover.", signal: "positive", strength: "very-high" },
    ],
    persuasionWindows: [
      { window: "7 days", probability: 65, reasoning: "8 CTV completions, 3 site visits, LinkedIn engagement, and Instagram follow show strong Drummond commitment. One final email with healthcare policy specifics will seal her vote." },
      { window: "30 days", probability: 74, reasoning: "High-propensity voter who has done her research and is near the persuasion threshold. She follows Drummond on Instagram — she's committed." },
      { window: "Election Day", probability: 86, reasoning: "Once committed, she votes. 7 of 8 primary voting history. No attrition risk." },
    ],
    channelMessages: [
      {
        channel: "Email",
        subject: "Susan — Gentner Drummond's healthcare plan for Oklahoma",
        body: "Susan,\n\nAs someone who has dedicated your career to healthcare administration, you know what strong leadership in the governor's office means for Oklahoma's healthcare system.\n\nGentner Drummond has committed to protecting Oklahoma's healthcare infrastructure, expanding rural healthcare access, and fighting federal mandates that threaten Oklahoma hospitals.\n\nHe has earned the endorsement of the Oklahoma Healthcare Association — because they know he will fight for Oklahoma patients and providers.\n\nYour vote on June 16 matters.\n\nGentner Drummond for Governor",
        tactic: "Healthcare-first subject line. Send June 10. OHA endorsement as lead. She engaged with that endorsement on LinkedIn.",
      },
      {
        channel: "LinkedIn",
        subject: undefined,
        body: "Susan engaged with Drummond's LinkedIn endorsement post. Serve Drummond's professional network content — AG record, healthcare endorsements, military service. LinkedIn professional targeting.",
        tactic: "LinkedIn sponsored content. Healthcare administrator targeting. Drummond endorsement creative.",
      },
      {
        channel: "CTV",
        subject: undefined,
        body: "Susan watches KWTV and Fox News. Serve Drummond closing :30 on both. She's at 8 exposures — 2 more will seal the vote. Healthcare-focused creative if available.",
        tactic: "KWTV + Fox News. Drummond closing creative. 2 final impressions. Healthcare adjacency if available.",
      },
    ],
    mediaRecommendations: [
      { channel: "CTV — KWTV / Fox News", allocation: 42, tactic: "2 final impressions of Drummond closing :30. She's at 8 exposures — near threshold. KWTV local news adjacency.", color: "#d97706" },
      { channel: "Email", allocation: 30, tactic: "Healthcare-first email June 10. OHA endorsement lead. She engaged with that endorsement on LinkedIn.", color: "#10b981" },
      { channel: "LinkedIn", allocation: 18, tactic: "Drummond professional network content. Healthcare administrator targeting. She's active on LinkedIn.", color: "#0a66c2" },
      { channel: "Instagram Retargeting", allocation: 10, tactic: "She follows Drummond on Instagram. Serve closing message in Stories. Commitment reinforcement.", color: "#e1306c" },
    ],
  },

  // ── ok-005: Michael Tanner — Small Business Owner, Persuadable ────────────
  {
    id: "ok-005",
    firstName: "Michael",
    lastName: "Tanner",
    age: 42,
    occupation: "Small Business Owner (HVAC)",
    address: "3301 NW 23rd St",
    city: "Oklahoma City",
    state: "OK",
    zip: "73107",
    county: "Oklahoma",
    status: "Persuadable",
    primaryVotingHistory: "Voted in 3 of last 8 Republican primaries — low-frequency but activated",
    currentSignal: "Clicked Mazzei Trump endorsement ad — first candidate site visit",
    adTouches: 3,
    moveProbability: 44,
    tags: ["Small Business", "Low-Frequency Voter", "Trump Voter", "Mazzei Lean"],
    voterDNA: "Infrequent Republican primary voter activated by Trump endorsement. First candidate engagement was Mazzei's Trump endorsement ad. Classic persuadable who can be moved by frequency — currently leaning Mazzei but not committed. Small business owner who responds to economic messaging and anti-establishment framing.",
    journeySummary: "Michael's lookback shows a voter who was not engaged with the race until Trump's endorsement of Mazzei. He saw Trump's Truth Social post, searched the endorsement, and visited Mazzei's site for the first time. He has not visited any other candidate's site. His Reddit activity on r/oklahoma shows he's a Trump-first voter who follows national politics more than state races. He's persuadable — but only to a candidate who can credibly claim the Trump lane or make a compelling economic argument for small business owners.",
    journey: [
      { phase: "lookback", date: "May 15", channel: "Truth Social", action: "Saw Trump Mazzei endorsement post", detail: "Trump's Truth Social endorsement of Mazzei — saw post in feed. Liked it. First engagement with the governor's race.", signal: "positive", strength: "medium" },
      { phase: "lookback", date: "May 16", channel: "Google Search", action: "Searched Mazzei endorsement", detail: "\"Trump endorses Mazzei Oklahoma\" — clicked Frontier article. First news site visit for the race.", signal: "positive", strength: "medium" },
      { phase: "lookback", date: "May 18", channel: "Mazzei Campaign Site", action: "Visited mikeforok.com", detail: "First candidate site visit — homepage. 2:15 session. Did not visit sub-pages.", signal: "positive", strength: "medium" },
      { phase: "lookback", date: "May 22", channel: "Reddit — r/oklahoma", action: "Read Trump endorsement thread", detail: "r/oklahoma — 'Trump endorses Mazzei — does it matter?' — read 19 comments. Upvoted pro-Trump comment.", signal: "positive", strength: "medium" },
      { phase: "campaign", date: "Jun 4", channel: "CTV — Newsmax", action: "Watched Mazzei Trump endorsement ad (full completion)", detail: "Mazzei Trump endorsement :30 — first CTV exposure. Trump message landed.", signal: "positive", strength: "high" },
      { phase: "campaign", date: "Jun 5", channel: "Facebook", action: "Clicked Mazzei campaign ad", detail: "Visited mikeforok.com from Facebook ad — 2:15 on homepage. Second site visit.", signal: "positive", strength: "medium" },
      { phase: "campaign", date: "Jun 7", channel: "Facebook", action: "Viewed Mazzei post (no engagement)", detail: "Scrolled past — not yet committed. Frequency needs to increase.", signal: "neutral", strength: "low" },
    ],
    persuasionWindows: [
      { window: "7 days", probability: 34, reasoning: "Low-frequency voter who is activated but not committed. Mazzei has the Trump lane advantage. Needs 4–5 more impressions to cross persuasion threshold." },
      { window: "30 days", probability: 44, reasoning: "If reached with sustained frequency in the final week, he will vote. The question is which candidate reaches him most. Mazzei has the early lead." },
      { window: "Election Day", probability: 58, reasoning: "Low-frequency voter — there is attrition risk. If he votes, it's likely Mazzei. If he doesn't vote, he's a lost opportunity." },
    ],
    channelMessages: [
      {
        channel: "Facebook",
        subject: undefined,
        body: "Michael clicked the Mazzei Trump endorsement ad. Serve Mazzei 'Trump's Choice for Oklahoma' video ad with small business messaging. He's a small business owner — economic framing will resonate.",
        tactic: "Mazzei Trump + small business creative. Facebook feed. Small business owner targeting. $15 CPM.",
      },
      {
        channel: "CTV",
        subject: undefined,
        body: "Michael watches Newsmax. Serve Mazzei Trump endorsement :30 on Newsmax and OAN. He completed the first exposure — frequency needs to build. 3–4 more impressions needed.",
        tactic: "Newsmax + OAN. Mazzei Trump creative. 4 impressions in final 7 days.",
      },
      {
        channel: "SMS",
        subject: undefined,
        body: "Michael — President Trump endorsed Mike Mazzei for Oklahoma Governor. Vote June 16. mikeforok.com",
        tactic: "Send June 14. Trump endorsement message. Simple and direct. Include site link.",
      },
    ],
    mediaRecommendations: [
      { channel: "CTV — Newsmax / OAN", allocation: 45, tactic: "4 final impressions of Mazzei Trump endorsement :30. He watches Newsmax. Frequency is the key driver.", color: "#f59e0b" },
      { channel: "Facebook", allocation: 35, tactic: "Trump + small business creative. He clicked the Facebook ad once. Retarget with economic messaging.", color: "#1877f2" },
      { channel: "SMS", allocation: 20, tactic: "June 14 text with Trump endorsement. Low-frequency voter — direct touch in final days will activate.", color: "#f97316" },
    ],
  },

  // ── ok-006: Linda Beaumont — Retired Nurse, Undecided ─────────────────────
  {
    id: "ok-006",
    firstName: "Linda",
    lastName: "Beaumont",
    age: 71,
    occupation: "Retired Nurse",
    address: "5612 NW 82nd St",
    city: "Oklahoma City",
    state: "OK",
    zip: "73132",
    county: "Oklahoma",
    status: "Undecided",
    primaryVotingHistory: "Voted in every Republican primary since 1992",
    currentSignal: "Completed 4 different candidate ads — comparing all options",
    adTouches: 9,
    moveProbability: 57,
    tags: ["Senior Voter", "Healthcare Voter", "High-Frequency Voter", "Late Decider", "All-Candidate Exposure"],
    voterDNA: "Extremely high-propensity Republican primary voter consuming all candidate messaging but not committing. Has completed ads for Drummond, Keating, McCall, and Mazzei. Will be decided by final-week frequency — whoever reaches her most in the last 5 days wins her vote. Healthcare and senior issues are her primary drivers.",
    journeySummary: "Linda is the most valuable undecided voter in this dataset — she has voted in every Republican primary since 1992 and has consumed all four candidates' messaging without committing. Her lookback shows she watched the full OETA debate replay, read coverage on all four candidates, and visited the AARP Oklahoma page about the governor's race. She has completed 9 ads across 4 candidates. Whoever achieves the highest final-week frequency with a healthcare-focused message wins her vote.",
    journey: [
      { phase: "lookback", date: "May 6", channel: "OETA.tv", action: "Watched full debate replay", detail: "Watched the full OETA governor debate replay — 1:12:44 watch time. Paused multiple times during healthcare exchanges.", signal: "neutral", strength: "high" },
      { phase: "lookback", date: "May 9", channel: "AARP Oklahoma", action: "Read governor's race voter guide", detail: "Visited aarp.org/oklahoma — read 'What the governor candidates say about senior issues.' 8:22 on page.", signal: "neutral", strength: "high" },
      { phase: "lookback", date: "May 12", channel: "Oklahoman.com", action: "Read all-candidate comparison", detail: "Read 'Oklahoma GOP governor primary: where the candidates stand' — 9:14 on page. Read all four candidate sections.", signal: "neutral", strength: "medium" },
      { phase: "lookback", date: "May 16", channel: "YouTube — KFOR", action: "Watched KFOR debate segment", detail: "Searched 'Oklahoma governor debate healthcare' — watched KFOR debate segment on healthcare. 18:44 watch time.", signal: "neutral", strength: "high" },
      { phase: "lookback", date: "May 20", channel: "Facebook", action: "Engaged with AARP Oklahoma post", detail: "Liked AARP Oklahoma's post about the governor's race. Commented 'Healthcare has to be the top priority.'", signal: "neutral", strength: "medium" },
      { phase: "campaign", date: "May 28", channel: "CTV — KWTV", action: "Watched McCall ad (full completion)", detail: "First CTV exposure — McCall :30. Completed without action.", signal: "neutral", strength: "medium" },
      { phase: "campaign", date: "Jun 1", channel: "CTV — Fox News", action: "Watched Drummond ad (full completion)", detail: "Comparing candidates — no site visit. Second CTV exposure.", signal: "neutral", strength: "medium" },
      { phase: "campaign", date: "Jun 2", channel: "CTV — KFOR", action: "Watched Keating ad (full completion)", detail: "Third candidate exposure — still undecided.", signal: "neutral", strength: "medium" },
      { phase: "campaign", date: "Jun 4", channel: "CTV — Newsmax", action: "Watched Mazzei Trump endorsement ad (full completion)", detail: "Completed all four candidates — pure undecided signal.", signal: "neutral", strength: "medium" },
      { phase: "campaign", date: "Jun 5", channel: "Facebook", action: "Clicked Oklahoman.com race article", detail: "Reading race coverage — decision not made. 5th candidate exposure.", signal: "neutral", strength: "low" },
      { phase: "campaign", date: "Jun 6", channel: "CTV — Fox News", action: "Watched Drummond ad (full completion)", detail: "6th total exposure — Drummond getting more frequency than others.", signal: "neutral", strength: "medium" },
    ],
    persuasionWindows: [
      { window: "7 days", probability: 47, reasoning: "She will vote — she always does. The question is which candidate achieves highest final-week frequency. Drummond has 2 exposures vs 1 each for others." },
      { window: "30 days", probability: 57, reasoning: "Final-week frequency race. Healthcare-focused messaging will be decisive. AARP engagement confirms senior issues are her primary driver." },
      { window: "Election Day", probability: 71, reasoning: "She votes every primary. Once she commits in the final days, she follows through. No attrition risk." },
    ],
    channelMessages: [
      {
        channel: "CTV",
        subject: undefined,
        body: "Linda has completed ads for all four candidates. Whoever achieves highest final-week frequency wins her vote. Serve healthcare-focused :30 on Fox News and KWTV. 3–4 impressions in final 5 days.",
        tactic: "Fox News + KWTV. Healthcare-focused creative. 4 impressions in final 5 days. Evening news window.",
      },
      {
        channel: "Email",
        subject: "Linda — which governor candidate has the strongest plan for Oklahoma seniors?",
        body: "Linda,\n\nYou've been following this race closely — and you know that the next governor will shape healthcare and senior services in Oklahoma for years to come.\n\n[Candidate] has committed to [specific senior/healthcare policy] — and has earned the endorsement of [senior organization].\n\nYour vote on June 16 matters for every senior in Oklahoma.\n\nEarly voting starts June 9.",
        tactic: "Senior/healthcare-first subject line. Send June 9. AARP-style framing. She engaged with AARP content.",
      },
      {
        channel: "Facebook",
        subject: undefined,
        body: "Linda engaged with AARP Oklahoma content. Retarget with healthcare-focused campaign content. Senior voter targeting. She responds to healthcare and senior issues messaging.",
        tactic: "AARP lookalike targeting. Healthcare creative. Morning hours — senior voters are active early.",
      },
    ],
    mediaRecommendations: [
      { channel: "CTV — Fox News / KWTV", allocation: 55, tactic: "4 final impressions of healthcare-focused :30. She's completed 9 ads — frequency race is the deciding factor. Evening news window.", color: "#f59e0b" },
      { channel: "Facebook Retargeting", allocation: 25, tactic: "Healthcare/senior creative. AARP lookalike targeting. She engaged with AARP content organically.", color: "#1877f2" },
      { channel: "Email", allocation: 20, tactic: "Senior-focused email June 9. AARP-style framing. She's a late decider — a direct message will trigger commitment.", color: "#10b981" },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TULSA COUNTY — 6 voters
  // ═══════════════════════════════════════════════════════════════════════════

  // ── tu-001: James Whitmore — Attorney, Soft Drummond ──────────────────────
  {
    id: "tu-001",
    firstName: "James",
    lastName: "Whitmore",
    age: 61,
    occupation: "Attorney",
    address: "2847 E 51st St",
    city: "Tulsa",
    state: "OK",
    zip: "74105",
    county: "Tulsa",
    status: "Soft Drummond",
    primaryVotingHistory: "Voted in 8 of last 8 Republican primaries",
    currentSignal: "Visited drummondok.com 4 times — viewed AG record and endorsements",
    adTouches: 11,
    moveProbability: 82,
    tags: ["Legal Community", "Institutional Republican", "Drummond Base", "Perfect Attendance Voter"],
    voterDNA: "Perfect-attendance Republican primary voter in the legal community. Deeply engaged with Drummond's AG record and institutional endorsements. At 82% move probability — one of the highest-confidence Drummond converts in the Tulsa market. Responds to legal credibility, bar association endorsements, and institutional Republican messaging.",
    journeySummary: "James is the highest-confidence Drummond voter in this dataset. His lookback shows he searched Drummond's AG record, watched the KOTV debate replay, visited drummondok.com four times, and engaged with Drummond's LinkedIn posts about bar association endorsements. He has completed 11 CTV ads — more than any other voter in this dataset. He shared a Drummond campaign post on June 5 — a strong organic commitment signal. He is a confirmed mover. Final-week messaging should be reinforcement, not persuasion.",
    journey: [
      { phase: "lookback", date: "May 5", channel: "Google Search", action: "Searched Drummond AG record", detail: "\"Drummond attorney general record Oklahoma\" — visited drummondok.com and Oklahoman.com AG record coverage.", signal: "positive", strength: "high" },
      { phase: "lookback", date: "May 8", channel: "YouTube — KOTV", action: "Watched KOTV debate replay", detail: "Watched KOTV News on 6 debate replay — 52:18 watch time. Paused during AG record exchange.", signal: "positive", strength: "high" },
      { phase: "lookback", date: "May 11", channel: "Drummond Campaign Site", action: "Visited drummondok.com", detail: "First visit — AG record page. 8:45 session. Read full AG record section.", signal: "positive", strength: "very-high" },
      { phase: "lookback", date: "May 14", channel: "LinkedIn", action: "Engaged with Drummond bar association post", detail: "Liked Oklahoma Bar Association endorsement post. Left comment: 'Exactly the leadership we need in the AG's office — and now the governor's office.'", signal: "positive", strength: "very-high" },
      { phase: "lookback", date: "May 17", channel: "Drummond Campaign Site", action: "Returned to drummondok.com", detail: "Second visit — endorsements page. 6:22 session. Read all legal community endorsements.", signal: "positive", strength: "very-high" },
      { phase: "lookback", date: "May 21", channel: "Oklahoman.com", action: "Read Drummond endorsement coverage", detail: "Read 'Drummond earns legal community endorsements' — 5:44 on page. Returned same day.", signal: "positive", strength: "high" },
      { phase: "lookback", date: "May 25", channel: "Drummond Campaign Site", action: "Third visit — drummondok.com", detail: "Visited AG record and About pages. 4:18 session. Behavioral lock-in confirmed.", signal: "positive", strength: "very-high" },
      { phase: "campaign", date: "May 25", channel: "CTV — KOTV", action: "Watched Drummond AG record ad (full completion)", detail: "First CTV exposure — strong completion signal.", signal: "positive", strength: "high" },
      { phase: "campaign", date: "May 27", channel: "Google Search", action: "Searched 'Drummond attorney general record'", detail: "Post-ad search — visited drummondok.com for fourth time. 7:12 session.", signal: "positive", strength: "very-high" },
      { phase: "campaign", date: "May 30", channel: "CTV — Fox News", action: "Watched Drummond ad (full completion)", detail: "3rd CTV exposure — returning visitor signal.", signal: "positive", strength: "high" },
      { phase: "campaign", date: "Jun 1", channel: "LinkedIn", action: "Engaged with Drummond endorsement post", detail: "Liked bar association endorsement post. Second LinkedIn engagement.", signal: "positive", strength: "high" },
      { phase: "campaign", date: "Jun 3", channel: "CTV — KJRH", action: "Watched Drummond ad (full completion)", detail: "5th CTV exposure — behavioral lock-in.", signal: "positive", strength: "high" },
      { phase: "campaign", date: "Jun 5", channel: "Facebook", action: "Shared Drummond campaign post", detail: "Organic share — strong commitment signal. Confirmed mover.", signal: "positive", strength: "very-high" },
      { phase: "campaign", date: "Jun 7", channel: "CTV — Fox News", action: "Watched Drummond closing ad (full completion)", detail: "11th CTV exposure — confirmed mover.", signal: "positive", strength: "very-high" },
    ],
    persuasionWindows: [
      { window: "7 days", probability: 74, reasoning: "11 CTV completions, 4 site visits, 2 LinkedIn engagements, and an organic Facebook share. He is a confirmed mover. Final-week messaging is reinforcement only." },
      { window: "30 days", probability: 82, reasoning: "Perfect-attendance voter who has done his research and committed. Bar association endorsements are his primary driver. No persuasion needed — just reinforcement." },
      { window: "Election Day", probability: 94, reasoning: "He votes every primary. He's shared Drummond's content. He is a confirmed Drummond voter barring a major negative event." },
    ],
    channelMessages: [
      {
        channel: "Email",
        subject: "James — thank you for your support. Here's how to make your vote count.",
        body: "James,\n\nThank you for your support of Gentner Drummond's campaign for governor.\n\nYour vote on June 16 — and your voice in the legal community — matters enormously.\n\nEarly voting starts June 9. Find your polling location at vote.ok.gov.\n\nIf you know other attorneys or legal professionals who are undecided, please share this: drummondok.com\n\nWith gratitude,\nGentner Drummond",
        tactic: "Gratitude + turnout activation email. He's committed — reinforce and activate. Include early voting info and referral ask.",
      },
      {
        channel: "LinkedIn",
        subject: undefined,
        body: "James is active on LinkedIn and has engaged with Drummond's legal community posts twice. Serve Drummond's bar association endorsement content. He's a confirmed mover — use LinkedIn for peer influence activation.",
        tactic: "LinkedIn sponsored content. Legal professional targeting. Bar association endorsement creative. Peer influence framing.",
      },
      {
        channel: "CTV",
        subject: undefined,
        body: "James has completed 11 CTV ads. Serve 1–2 final reinforcement impressions of Drummond closing :30. He's confirmed — no need for heavy frequency. KOTV and Fox News.",
        tactic: "KOTV + Fox News. Drummond closing creative. 2 final reinforcement impressions. Evening news window.",
      },
    ],
    mediaRecommendations: [
      { channel: "CTV — KOTV / Fox News", allocation: 35, tactic: "2 final reinforcement impressions. He's confirmed — no heavy frequency needed. Evening news window.", color: "#d97706" },
      { channel: "Email", allocation: 35, tactic: "Gratitude + turnout activation. He's committed — activate and ask for referrals in the legal community.", color: "#10b981" },
      { channel: "LinkedIn", allocation: 30, tactic: "Bar association endorsement content. He's active on LinkedIn. Peer influence activation in the legal community.", color: "#0a66c2" },
    ],
  },

  // ── tu-002: Carol Simmons — Dental Practice Owner, Soft McCall ────────────
  {
    id: "tu-002",
    firstName: "Carol",
    lastName: "Simmons",
    age: 53,
    occupation: "Dental Practice Owner",
    address: "1423 S Utica Ave",
    city: "Tulsa",
    state: "OK",
    zip: "74104",
    county: "Tulsa",
    status: "Soft McCall",
    primaryVotingHistory: "Voted in 5 of last 8 Republican primaries",
    currentSignal: "Visited mccallforoklahoma.com — viewed tax cut plan page",
    adTouches: 6,
    moveProbability: 63,
    tags: ["Small Business Owner", "Fiscal Conservative", "McCall Soft Supporter", "Drummond Consolidation Risk"],
    voterDNA: "Mid-propensity Republican primary voter and small business owner drawn to McCall's fiscal conservative message. Tax cut plan is her primary driver. At risk of consolidating to Drummond as the 'stop Mazzei' candidate in final days — needs McCall-specific business messaging to hold.",
    journeySummary: "Carol's lookback shows a voter activated by the fiscal policy debate — she watched the KJRH debate replay, visited McCall's tax cut page twice, and read Tulsa World coverage of the candidates' business positions. Her Reddit activity on r/tulsa shows she's concerned about the Mazzei consolidation narrative. Once CTV launched, she completed 6 McCall ads. A direct email with dental practice-specific tax savings will be decisive.",
    journey: [
      { phase: "lookback", date: "May 8", channel: "Google Search", action: "Searched Oklahoma governor tax policy", detail: "\"Oklahoma governor candidates tax policy\" — clicked Tulsa World candidate comparison. First research signal.", signal: "neutral", strength: "medium" },
      { phase: "lookback", date: "May 11", channel: "YouTube — KJRH", action: "Watched KJRH debate replay", detail: "Watched KJRH 2 News debate replay — 41:18 watch time. Paused during fiscal policy exchange.", signal: "positive", strength: "high" },
      { phase: "lookback", date: "May 14", channel: "McCall Campaign Site", action: "Visited mccallforoklahoma.com", detail: "First visit — tax cut plan page. 4:22 session. Read full tax plan.", signal: "positive", strength: "high" },
      { phase: "lookback", date: "May 17", channel: "Reddit — r/tulsa", action: "Read governor race thread", detail: "r/tulsa — 'McCall vs Drummond — who's better for small business?' — read 21 comments. Upvoted pro-McCall fiscal comment.", signal: "positive", strength: "high" },
      { phase: "lookback", date: "May 21", channel: "Tulsa World", action: "Read business candidate comparison", detail: "Read 'Oklahoma governor candidates and small business' — 5:18 on page. McCall section highlighted.", signal: "positive", strength: "medium" },
      { phase: "lookback", date: "May 25", channel: "McCall Campaign Site", action: "Returned to tax cut page", detail: "Second visit — tax cut plan page. 3:44 session. Viewed endorsements tab.", signal: "positive", strength: "high" },
      { phase: "campaign", date: "Jun 1", channel: "CTV — KOTV", action: "Watched McCall tax cut ad (full completion)", detail: "First CTV exposure — McCall fiscal :30. Strong completion.", signal: "positive", strength: "high" },
      { phase: "campaign", date: "Jun 2", channel: "Facebook", action: "Clicked McCall campaign ad", detail: "Visited mccallforoklahoma.com from Facebook — third site visit. 3:18 on tax page.", signal: "positive", strength: "high" },
      { phase: "campaign", date: "Jun 4", channel: "CTV — KJRH", action: "Watched McCall ad (full completion)", detail: "3rd CTV exposure — behavioral signal strengthening.", signal: "positive", strength: "high" },
      { phase: "campaign", date: "Jun 5", channel: "Google Search", action: "Searched 'Drummond stop Mazzei'", detail: "Consolidation narrative research — potential McCall bleed risk to Drummond.", signal: "negative", strength: "medium" },
      { phase: "campaign", date: "Jun 6", channel: "CTV — KOTV", action: "Watched McCall ad (full completion)", detail: "5th CTV exposure — holding signal.", signal: "positive", strength: "medium" },
      { phase: "campaign", date: "Jun 7", channel: "CTV — Fox News", action: "Watched McCall ad (full completion)", detail: "6th CTV exposure — near persuasion threshold.", signal: "positive", strength: "high" },
    ],
    persuasionWindows: [
      { window: "7 days", probability: 53, reasoning: "6 CTV completions and 3 site visits show strong McCall lean. Consolidation narrative is a bleed risk. A direct email with dental practice-specific tax savings will hold her." },
      { window: "30 days", probability: 63, reasoning: "Fiscal conservative who has done her research. McCall's tax cut plan is her primary driver. Counter the Drummond consolidation narrative with McCall-specific business messaging." },
      { window: "Election Day", probability: 74, reasoning: "Mid-propensity voter who activates when committed. If held through final week, she votes McCall." },
    ],
    channelMessages: [
      {
        channel: "Email",
        subject: "Carol — what McCall's tax cut plan means for your dental practice",
        body: "Carol,\n\nAs a dental practice owner, you know that every dollar in taxes is a dollar that can't go back into your business.\n\nKevin McCall's tax cut plan would eliminate the state income tax on small business pass-through income — saving the average Oklahoma small business owner over $6,200 per year.\n\nNo other candidate in this race has a plan this specific, this bold, or this focused on small business owners like you.\n\nDon't let the 'stop Mazzei' narrative push you away from the candidate who will actually fight for your business.\n\nVote Kevin McCall on June 16.\n\nKevin McCall for Governor",
        tactic: "Business-specific tax savings. Counter consolidation narrative directly. Send June 10. Dental practice framing.",
      },
      {
        channel: "CTV",
        subject: undefined,
        body: "Carol watches KOTV and KJRH. Serve McCall fiscal :30 on both. She's at 6 exposures — 2–3 more will seal the vote. Counter-program against Drummond consolidation narrative.",
        tactic: "KOTV + KJRH. McCall fiscal creative. 3 final impressions. Counter consolidation narrative.",
      },
      {
        channel: "Facebook",
        subject: undefined,
        body: "Carol clicked McCall's Facebook ad and visited the tax cut page. Retarget with small business tax savings graphic. She's a dental practice owner — specific business savings messaging.",
        tactic: "McCall small business retargeting. Tax savings graphic. Business owner targeting overlay.",
      },
      {
        channel: "SMS",
        subject: undefined,
        body: "Carol — McCall's tax plan saves Oklahoma small business owners avg $6,200/yr. Don't let the 'stop Mazzei' narrative cost you the best candidate for your business. Vote June 16.",
        tactic: "Send June 12. Counter consolidation narrative. Business savings stat. Direct and personal.",
      },
    ],
    mediaRecommendations: [
      { channel: "CTV — KOTV / KJRH", allocation: 38, tactic: "3 final impressions of McCall fiscal :30. She's at 6 exposures. Counter consolidation narrative.", color: "#f59e0b" },
      { channel: "Email", allocation: 30, tactic: "Dental practice tax savings email June 10. Business-specific framing. Counter Drummond consolidation narrative.", color: "#10b981" },
      { channel: "Facebook Retargeting", allocation: 20, tactic: "Small business tax savings graphic. She clicked McCall's Facebook ad. Business owner targeting.", color: "#1877f2" },
      { channel: "SMS", allocation: 12, tactic: "June 12 text with business savings stat. Counter consolidation narrative directly.", color: "#f97316" },
    ],
  },

  // ── tu-003: Randy Lopp — Commercial Contractor, Soft Keating ──────────────
  {
    id: "tu-003",
    firstName: "Randy",
    lastName: "Lopp",
    age: 57,
    occupation: "Commercial Contractor",
    address: "1244 E 29th St",
    city: "Tulsa",
    state: "OK",
    zip: "74114",
    county: "Tulsa",
    status: "Soft Keating",
    primaryVotingHistory: "Voted in 5 of last 8 Republican primaries",
    currentSignal: "Engaged with Keating outsider messaging — no donation, soft lean",
    adTouches: 3,
    moveProbability: 62,
    tags: ["Construction Sector", "Outsider Voter", "Keating Soft Supporter", "Anti-Establishment"],
    voterDNA: "Mid-propensity Republican primary voter in the construction industry. Drawn to Keating's outsider message and skepticism of career politicians. Responds to anti-establishment framing and economic messaging for the trades. Needs frequency and a direct economic message to move from soft to committed.",
    journeySummary: "Randy's lookback shows a voter activated by the outsider narrative — he watched the KJRH debate, read Frontier coverage of Keating's campaign, and visited keating2026.com twice. His Reddit activity on r/tulsa shows frustration with career politicians. Once CTV launched, he completed 3 Keating ads. A direct email with construction industry messaging will be decisive.",
    journey: [
      { phase: "lookback", date: "May 9", channel: "Google Search", action: "Searched Oklahoma governor outsider candidates", detail: "\"Oklahoma governor outsider candidate 2026\" — clicked Frontier article on Keating's campaign.", signal: "neutral", strength: "medium" },
      { phase: "lookback", date: "May 13", channel: "YouTube — KJRH", action: "Watched KJRH debate replay", detail: "Watched KJRH 2 News debate replay — 35:22 watch time. Paused during Keating outsider exchange.", signal: "positive", strength: "high" },
      { phase: "lookback", date: "May 16", channel: "Reddit — r/tulsa", action: "Read governor race thread", detail: "r/tulsa — 'Tired of career politicians — who's the real outsider in the governor race?' — read 17 comments. Upvoted pro-Keating comment.", signal: "positive", strength: "high" },
      { phase: "lookback", date: "May 20", channel: "Keating Campaign Site", action: "Visited keating2026.com", detail: "First visit — outsider message page. 3:12 session. Read Keating's background.", signal: "positive", strength: "high" },
      { phase: "lookback", date: "May 24", channel: "Keating Campaign Site", action: "Returned to keating2026.com", detail: "Second visit — economy page. 2:44 session. Construction and trades messaging.", signal: "positive", strength: "high" },
      { phase: "campaign", date: "Jun 2", channel: "CTV — KJRH", action: "Watched Keating outsider ad (full completion)", detail: "First CTV exposure — Keating 'Oklahoma Outsider' :30. Strong completion.", signal: "positive", strength: "high" },
      { phase: "campaign", date: "Jun 4", channel: "Facebook", action: "Engaged with Keating post (liked)", detail: "Liked Keating's construction industry endorsement post. Soft commitment signal.", signal: "positive", strength: "medium" },
      { phase: "campaign", date: "Jun 6", channel: "CTV — KJRH", action: "Watched Keating ad (full completion)", detail: "3rd CTV exposure — behavioral signal strengthening.", signal: "positive", strength: "high" },
    ],
    persuasionWindows: [
      { window: "7 days", probability: 52, reasoning: "3 CTV completions and 2 site visits show a Keating lean. Needs 3–4 more impressions and a construction-specific economic message to cross persuasion threshold." },
      { window: "30 days", probability: 62, reasoning: "Anti-establishment voter who responds to outsider framing. Keating's construction industry endorsements are a differentiator. Direct email will move him." },
      { window: "Election Day", probability: 74, reasoning: "Mid-propensity voter who activates when committed. If reached with sustained frequency, he votes." },
    ],
    channelMessages: [
      {
        channel: "Email",
        subject: "Randy — Chip Keating is the only candidate who isn't a career politician",
        body: "Randy,\n\nYou've seen what career politicians do to Oklahoma — they talk about the economy while the trades get left behind.\n\nChip Keating has never held elected office. He's not a lawyer, not a career politician, not a lobbyist. He's an Oklahoman who built his career outside of government — and he understands what it means to run a business and create jobs.\n\nHe's committed to cutting regulations that hurt the construction industry, protecting right-to-work, and putting Oklahoma workers first.\n\nVote Chip Keating on June 16.\n\nEarly voting starts June 9.",
        tactic: "Outsider + construction industry framing. Send June 10. Anti-establishment tone. Trades-specific policy.",
      },
      {
        channel: "CTV",
        subject: undefined,
        body: "Randy watches KJRH. Serve Keating 'Oklahoma Outsider' :30 on KJRH and KOTV. He's completed 3 exposures — 3 more needed to cross persuasion threshold.",
        tactic: "KJRH + KOTV. Keating outsider creative. 3 final impressions. Evening news window.",
      },
      {
        channel: "Facebook",
        subject: undefined,
        body: "Randy liked Keating's construction industry endorsement post. Retarget with construction/trades-focused Keating content. Outsider framing resonates.",
        tactic: "Keating construction industry creative. He liked the endorsement post. Trades worker targeting overlay.",
      },
    ],
    mediaRecommendations: [
      { channel: "CTV — KJRH / KOTV", allocation: 45, tactic: "3 final impressions of Keating outsider :30. He's completed 3 — needs 3 more. KJRH evening news.", color: "#f97316" },
      { channel: "Email", allocation: 30, tactic: "Outsider + construction industry email June 10. Anti-establishment tone. Trades-specific policy.", color: "#10b981" },
      { channel: "Facebook Retargeting", allocation: 25, tactic: "Construction/trades Keating content. He liked the endorsement post. Trades worker targeting.", color: "#1877f2" },
    ],
  },

  // ── tu-004: Shelly Koontz — Nurse Practitioner, Undecided ─────────────────
  {
    id: "tu-004",
    firstName: "Shelly",
    lastName: "Koontz",
    age: 48,
    occupation: "Nurse Practitioner",
    address: "2218 E 59th St",
    city: "Tulsa",
    state: "OK",
    zip: "74105",
    county: "Tulsa",
    status: "Undecided",
    primaryVotingHistory: "Voted in every Republican primary since 2010",
    currentSignal: "No strong signal — household in premium CTV targeting zone",
    adTouches: 1,
    moveProbability: 71,
    tags: ["Healthcare Voter", "High-Frequency Voter", "Premium CTV Zone", "Late Decider"],
    voterDNA: "Consistent Republican primary voter in healthcare. Has not yet engaged with any candidate's campaign materials. In a premium CTV targeting zone — household is reachable via streaming. Healthcare policy is her primary driver. High move probability because she votes every primary and has not yet committed — whoever reaches her first with healthcare-focused messaging wins.",
    journeySummary: "Shelly's lookback shows a voter who consumes healthcare news but has not yet engaged with the governor's race. She read KOTV coverage of the race, watched a KJRH healthcare policy segment, and visited the Oklahoma State Medical Association's website. No candidate site visits, no debate replays. She has received only 1 CTV impression. She is the highest-value undecided voter in the Tulsa dataset — high-propensity, healthcare-focused, and completely uncommitted. First mover wins.",
    journey: [
      { phase: "lookback", date: "May 10", channel: "KOTV.com", action: "Read governor race overview", detail: "Read KOTV 'Oklahoma GOP governor primary preview' — 4:12 on page. First race engagement signal.", signal: "neutral", strength: "low" },
      { phase: "lookback", date: "May 15", channel: "YouTube — KJRH", action: "Watched healthcare policy segment", detail: "Searched 'Oklahoma governor healthcare policy' — watched KJRH healthcare policy debate segment. 14:22 watch time.", signal: "neutral", strength: "medium" },
      { phase: "lookback", date: "May 19", channel: "Oklahoma State Medical Association", action: "Visited OSMA endorsement page", detail: "Visited okmed.org — read OSMA's governor's race endorsement guidance. 6:18 on page.", signal: "neutral", strength: "medium" },
      { phase: "lookback", date: "May 23", channel: "Facebook", action: "Engaged with healthcare news post", detail: "Liked KOTV Facebook post about Oklahoma healthcare legislation. No governor race engagement yet.", signal: "neutral", strength: "low" },
      { phase: "campaign", date: "Jun 5", channel: "CTV — Hulu", action: "Watched Drummond ad (full completion)", detail: "First CTV exposure — Drummond :30. Completed. No follow-up action yet.", signal: "neutral", strength: "medium" },
    ],
    persuasionWindows: [
      { window: "7 days", probability: 61, reasoning: "High-propensity voter with only 1 CTV exposure. She is completely persuadable. Healthcare-focused messaging on CTV and email will trigger a site visit and commitment." },
      { window: "30 days", probability: 71, reasoning: "She votes every primary. She will decide in the final week. First candidate to reach her with healthcare-focused messaging wins." },
      { window: "Election Day", probability: 83, reasoning: "Once committed, she votes. No attrition risk. The question is which candidate reaches her first." },
    ],
    channelMessages: [
      {
        channel: "Email",
        subject: "Shelly — which governor candidate has the strongest plan for Oklahoma healthcare?",
        body: "Shelly,\n\nAs a nurse practitioner, you know that the next governor of Oklahoma will shape healthcare policy for the next four years.\n\n[Candidate] has committed to [specific healthcare policy] — and has earned the endorsement of the Oklahoma State Medical Association.\n\nYour vote on June 16 matters for every patient and provider in Oklahoma.\n\nEarly voting starts June 9. Find your polling location at vote.ok.gov.",
        tactic: "Healthcare-first subject line. OSMA endorsement lead. She visited OSMA's website. Send June 9.",
      },
      {
        channel: "CTV",
        subject: undefined,
        body: "Shelly is in a premium CTV zone and has received only 1 impression. She is completely persuadable. Serve healthcare-focused :30 on Hulu, Peacock, and KOTV. 4–5 impressions needed.",
        tactic: "Hulu + Peacock + KOTV. Healthcare-focused creative. 5 impressions in final 10 days. First mover advantage.",
      },
      {
        channel: "LinkedIn",
        subject: undefined,
        body: "Shelly is a nurse practitioner — she is likely active on LinkedIn for professional development. Serve healthcare-focused candidate content. OSMA endorsement creative.",
        tactic: "LinkedIn healthcare professional targeting. OSMA endorsement creative. She visited OSMA's website.",
      },
    ],
    mediaRecommendations: [
      { channel: "CTV — Hulu / Peacock / KOTV", allocation: 50, tactic: "5 impressions in final 10 days. She's only had 1 exposure. Healthcare-focused creative. Premium streaming + local news.", color: "#f59e0b" },
      { channel: "Email", allocation: 28, tactic: "OSMA endorsement lead. Healthcare-first framing. She visited OSMA's website. Send June 9.", color: "#10b981" },
      { channel: "LinkedIn", allocation: 22, tactic: "Healthcare professional targeting. OSMA endorsement creative. Nurse practitioner audience.", color: "#0a66c2" },
    ],
  },

  // ── tu-005: Janis Vogel — Financial Advisor, Persuadable ──────────────────
  {
    id: "tu-005",
    firstName: "Janis",
    lastName: "Vogel",
    age: 62,
    occupation: "Financial Advisor",
    address: "7760 Riverside Pkwy",
    city: "Tulsa",
    state: "OK",
    zip: "74136",
    county: "Tulsa",
    status: "Persuadable",
    primaryVotingHistory: "Voted every primary since 2014 — high-propensity voter",
    currentSignal: "Engaged with both Drummond and Keating ads — actively comparing candidates",
    adTouches: 6,
    moveProbability: 83,
    tags: ["Financial Sector", "High-Frequency Voter", "Comparison Shopper", "Drummond-Keating Split"],
    voterDNA: "High-propensity Republican primary voter in financial services. Actively comparing Drummond and Keating — has engaged with both campaigns' materials. Fiscal conservatism and institutional credibility are her primary drivers. At 83% move probability — she will vote, and she is close to a decision. The candidate who reaches her with the strongest fiscal credibility message in the final week wins.",
    journeySummary: "Janis is the most analytically engaged voter in this dataset. Her lookback shows she watched both the OETA and KOTV debate replays, visited both Drummond and Keating's campaign sites, and read multiple candidate comparison articles. She searched 'Drummond vs Keating fiscal policy' twice. Her Reddit activity on r/tulsa shows she's asking for peer recommendations. She has completed 6 ads across both candidates. She is close to a decision — a direct email with fiscal policy specifics from either candidate will close her.",
    journey: [
      { phase: "lookback", date: "May 6", channel: "YouTube — OETA", action: "Watched full OETA debate replay", detail: "Watched full OETA debate replay — 1:08:44 watch time. Paused during fiscal policy and economic exchanges.", signal: "neutral", strength: "high" },
      { phase: "lookback", date: "May 9", channel: "Drummond Campaign Site", action: "Visited drummondok.com", detail: "First candidate site visit — fiscal policy page. 4:18 session.", signal: "positive", strength: "medium" },
      { phase: "lookback", date: "May 12", channel: "YouTube — KOTV", action: "Watched KOTV debate replay", detail: "Watched KOTV debate replay — 38:22 watch time. Second debate replay — highly engaged voter.", signal: "neutral", strength: "high" },
      { phase: "lookback", date: "May 15", channel: "Keating Campaign Site", action: "Visited keating2026.com", detail: "First Keating site visit — economy page. 3:44 session. Comparison-shopping signal.", signal: "positive", strength: "medium" },
      { phase: "lookback", date: "May 18", channel: "Reddit — r/tulsa", action: "Asked for governor race recommendation", detail: "r/tulsa — Posted: 'Drummond or Keating — who's better for Oklahoma's economy?' — received 14 replies. Read all.", signal: "neutral", strength: "high" },
      { phase: "lookback", date: "May 21", channel: "Google Search", action: "Searched fiscal policy comparison", detail: "\"Drummond vs Keating fiscal policy\" — clicked Oklahoman.com candidate comparison. First of two such searches.", signal: "neutral", strength: "high" },
      { phase: "lookback", date: "May 25", channel: "Google Search", action: "Searched fiscal policy comparison again", detail: "\"Drummond vs Keating fiscal policy\" — second search. Visited both campaign sites in same session.", signal: "neutral", strength: "very-high" },
      { phase: "campaign", date: "Jun 1", channel: "CTV — Fox News", action: "Watched Drummond ad (full completion)", detail: "First CTV exposure — Drummond :30. Strong completion.", signal: "positive", strength: "medium" },
      { phase: "campaign", date: "Jun 3", channel: "CTV — KOTV", action: "Watched Keating ad (full completion)", detail: "Second CTV exposure — Keating :30. Comparing candidates.", signal: "positive", strength: "medium" },
      { phase: "campaign", date: "Jun 5", channel: "Facebook", action: "Clicked Drummond campaign post", detail: "Clicked through to drummondok.com — 3:12 on fiscal page. Drummond getting more engagement.", signal: "positive", strength: "high" },
      { phase: "campaign", date: "Jun 6", channel: "CTV — Fox News", action: "Watched Drummond closing ad (full completion)", detail: "Drummond getting more frequency — 2 Drummond vs 1 Keating CTV exposure.", signal: "positive", strength: "high" },
      { phase: "campaign", date: "Jun 7", channel: "LinkedIn", action: "Engaged with Drummond financial endorsement post", detail: "Liked Drummond's post about Oklahoma financial services endorsements. Drummond pulling ahead.", signal: "positive", strength: "high" },
    ],
    persuasionWindows: [
      { window: "7 days", probability: 73, reasoning: "6 CTV completions, multiple site visits, Reddit engagement, and two fiscal policy comparison searches. She is close to a decision. Drummond has more recent engagement." },
      { window: "30 days", probability: 83, reasoning: "High-propensity voter who has done extensive research. She will decide in the final week. Drummond's fiscal credibility and financial sector endorsements are pulling ahead." },
      { window: "Election Day", probability: 92, reasoning: "She votes every primary. Once she commits, she votes. No attrition risk." },
    ],
    channelMessages: [
      {
        channel: "Email",
        subject: "Janis — the fiscal case for Gentner Drummond",
        body: "Janis,\n\nYou've been doing your research — and you've seen what both candidates are saying about Oklahoma's economy.\n\nHere's what the numbers show: Gentner Drummond has the endorsement of Oklahoma's top financial services leaders, the Oklahoma Chamber of Commerce, and every major business association in the state.\n\nHe has a proven record of fiscal discipline as Attorney General — returning $4.2 million in unspent funds to the state treasury in his first term.\n\nFor a financial advisor who understands what fiscal credibility actually means, Gentner Drummond is the clear choice.\n\nVote June 16. Early voting starts June 9.\n\nGentner Drummond for Governor",
        tactic: "Fiscal credibility framing. Financial sector endorsements. AG fiscal record specifics. Send June 10.",
      },
      {
        channel: "LinkedIn",
        subject: undefined,
        body: "Janis engaged with Drummond's LinkedIn financial endorsement post. Serve Drummond's financial sector endorsement content. She's a financial advisor — professional credibility messaging.",
        tactic: "LinkedIn financial professional targeting. Drummond fiscal credibility creative. She engaged with the endorsement post.",
      },
      {
        channel: "CTV",
        subject: undefined,
        body: "Janis has completed 6 ads — 2 Drummond, 1 Keating. Drummond is pulling ahead. Serve 2 final Drummond fiscal :30 impressions on Fox News. Seal the decision.",
        tactic: "Fox News. Drummond fiscal closing creative. 2 final impressions. Evening news window.",
      },
    ],
    mediaRecommendations: [
      { channel: "CTV — Fox News", allocation: 35, tactic: "2 final Drummond fiscal impressions. She's at 6 exposures — Drummond pulling ahead. Evening news.", color: "#d97706" },
      { channel: "Email", allocation: 32, tactic: "Fiscal credibility email June 10. Financial sector endorsements. AG fiscal record specifics.", color: "#10b981" },
      { channel: "LinkedIn", allocation: 23, tactic: "Financial professional targeting. Drummond fiscal credibility. She engaged with the endorsement post.", color: "#0a66c2" },
      { channel: "Facebook Retargeting", allocation: 10, tactic: "Drummond fiscal closing creative. She clicked a Drummond Facebook post. Reinforcement.", color: "#1877f2" },
    ],
  },

  // ── tu-006: DeEtte Doerr — Downtown Tulsa Professional, Undecided ──────────
  {
    id: "tu-006",
    firstName: "DeEtte",
    lastName: "Doerr",
    age: 54,
    occupation: "Corporate Attorney",
    address: "1100 Oneok Plz",
    city: "Tulsa",
    state: "OK",
    zip: "74121",
    county: "Tulsa",
    status: "Undecided",
    primaryVotingHistory: "Voted in 5 of last 8 Republican primaries",
    currentSignal: "No engagement signal yet — downtown Tulsa professional, CTV target",
    adTouches: 0,
    moveProbability: 65,
    tags: ["Legal Community", "Downtown Tulsa", "Corporate Professional", "CTV Target", "Unreached"],
    voterDNA: "Mid-propensity Republican primary voter in the corporate legal community. Has not yet been reached by any campaign. Downtown Tulsa professional who consumes news through streaming and professional networks. High value because she votes when engaged and has not yet committed — first mover wins. Responds to institutional credibility, legal community endorsements, and professional governance messaging.",
    journeySummary: "DeEtte's lookback shows a voter who is aware of the race but has not yet engaged with any candidate's campaign. She read Tulsa World coverage of the race, visited the Tulsa Bar Association's website, and watched a KOTV news segment about the governor's race on YouTube. No candidate site visits, no debate replays, no ad completions. She is completely unreached — a blank slate. The first campaign to reach her with a credible legal community endorsement message wins her vote.",
    journey: [
      { phase: "lookback", date: "May 11", channel: "Tulsa World", action: "Read governor race overview", detail: "Read 'Oklahoma GOP governor primary: the field' — 3:44 on page. First race engagement.", signal: "neutral", strength: "low" },
      { phase: "lookback", date: "May 15", channel: "Tulsa Bar Association", action: "Visited TBA endorsement page", detail: "Visited tulsabar.com — checked if TBA had endorsed in the governor's race. 2:18 on page.", signal: "neutral", strength: "medium" },
      { phase: "lookback", date: "May 19", channel: "YouTube — KOTV", action: "Watched KOTV governor race segment", detail: "Watched KOTV 'Governor's race update' news segment — 8:44 watch time. First video engagement.", signal: "neutral", strength: "medium" },
      { phase: "lookback", date: "May 23", channel: "LinkedIn", action: "Viewed Drummond professional post", detail: "Viewed Drummond's bar association endorsement post on LinkedIn — did not engage. Awareness signal.", signal: "neutral", strength: "low" },
    ],
    persuasionWindows: [
      { window: "7 days", probability: 55, reasoning: "Completely unreached — 0 ad exposures. High-propensity voter who is aware of the race. First campaign to reach her with a credible legal community endorsement message wins." },
      { window: "30 days", probability: 65, reasoning: "She votes when engaged. She visited the Tulsa Bar Association's website — legal community endorsements are her primary driver. 4–5 CTV impressions plus an email will commit her." },
      { window: "Election Day", probability: 78, reasoning: "Mid-propensity voter who activates when committed. If reached in the final week, she votes." },
    ],
    channelMessages: [
      {
        channel: "Email",
        subject: "DeEtte — Gentner Drummond has earned the legal community's trust",
        body: "DeEtte,\n\nAs a corporate attorney in Tulsa, you know that the next governor of Oklahoma will set the tone for the legal and regulatory environment in this state for years to come.\n\nGentner Drummond has earned the endorsement of the Oklahoma Bar Association, the Tulsa County Bar Association, and dozens of Tulsa's top corporate attorneys.\n\nHis record as Attorney General speaks for itself — 47 major legal victories for Oklahoma, $4.2 million returned to the state treasury, and a reputation for integrity that is unmatched in this race.\n\nVote Gentner Drummond on June 16.\n\nEarly voting starts June 9.",
        tactic: "Legal community endorsements lead. TBA endorsement specific. Corporate attorney framing. Send June 9.",
      },
      {
        channel: "CTV",
        subject: undefined,
        body: "DeEtte has 0 ad exposures. She is in a premium CTV zone — downtown Tulsa professional household. Serve Drummond institutional credibility :30 on Hulu, Peacock, and KOTV. 5 impressions needed.",
        tactic: "Hulu + Peacock + KOTV. Drummond institutional credibility creative. 5 impressions in final 10 days.",
      },
      {
        channel: "LinkedIn",
        subject: undefined,
        body: "DeEtte viewed Drummond's LinkedIn post but did not engage. Serve Drummond's bar association endorsement content as sponsored LinkedIn post. Corporate attorney targeting.",
        tactic: "LinkedIn corporate attorney targeting. Bar association endorsement creative. She viewed the organic post — sponsored will reach her.",
      },
    ],
    mediaRecommendations: [
      { channel: "CTV — Hulu / Peacock / KOTV", allocation: 45, tactic: "5 impressions in final 10 days. She's completely unreached. Drummond institutional credibility creative.", color: "#d97706" },
      { channel: "Email", allocation: 30, tactic: "TBA endorsement lead. Corporate attorney framing. She visited TBA's website. Send June 9.", color: "#10b981" },
      { channel: "LinkedIn", allocation: 25, tactic: "Bar association endorsement creative. She viewed the organic post. Corporate attorney targeting.", color: "#0a66c2" },
    ],
  },

];
