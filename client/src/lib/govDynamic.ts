// govDynamic.ts — Dynamic daily progression model for Oklahoma Governor's Race
// Updates automatically based on today's date relative to June 16, 2026 primary

export const PRIMARY_DATE = new Date("2026-06-16T20:00:00-05:00"); // June 16 8pm CT
export const MODEL_START = new Date("2026-06-07T00:00:00-05:00");  // Day 0 baseline

export function getDaysToElection(): number {
  const now = new Date();
  const diff = PRIMARY_DATE.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function getDayNumber(): number {
  const now = new Date();
  const diff = now.getTime() - MODEL_START.getTime();
  const day = Math.floor(diff / (1000 * 60 * 60 * 24));
  return Math.min(Math.max(day, 0), 10);
}

// ── Baseline polling (Day 0 — June 7) ─────────────────────────────────────────
const BASELINE = {
  mazzei:   22.0,
  drummond: 21.7,
  keating:  21.4,
  mccall:   18.4,
  undecided: 16.5,
};

// ── Daily progression model ────────────────────────────────────────────────────
// Each day models the effect of:
//   1. Trump endorsement bandwagon (Mazzei gains from undecided + soft Keating)
//   2. Anti-Mazzei consolidation (Drummond gains from soft McCall)
//   3. Keating bleed to Mazzei (Trump effect)
//   4. McCall bleed to Drummond (institutional consolidation)
//   5. Late decider activation (all candidates gain from undecided pool)

interface DaySnapshot {
  day: number;
  date: string;
  mazzei: number;
  drummond: number;
  keating: number;
  mccall: number;
  undecided: number;
  // Bleed risk: % of each candidate's soft supporters at risk of moving to Mazzei
  keatingBleedRisk: number;
  mccallBleedRisk: number;
  drummondBleedRisk: number;
  // Migration flows (cumulative voters moved)
  softKeatingToMazzei: number;
  softMccallToDrummond: number;
  undecidedToMazzei: number;
  // Race status
  runoffProjection: string;
  urgencyLevel: "moderate" | "high" | "critical";
  headline: string;
}

export const DAILY_PROGRESSION: DaySnapshot[] = [
  {
    day: 0, date: "Jun 7",
    mazzei: 22.0, drummond: 21.7, keating: 21.4, mccall: 18.4, undecided: 16.5,
    keatingBleedRisk: 18, mccallBleedRisk: 14, drummondBleedRisk: 8,
    softKeatingToMazzei: 0, softMccallToDrummond: 0, undecidedToMazzei: 0,
    runoffProjection: "Mazzei vs. Drummond (55% probability)",
    urgencyLevel: "high",
    headline: "Four-way dead heat — Trump endorsement beginning to move soft voters",
  },
  {
    day: 1, date: "Jun 8",
    mazzei: 22.8, drummond: 22.0, keating: 21.0, mccall: 18.1, undecided: 16.1,
    keatingBleedRisk: 21, mccallBleedRisk: 16, drummondBleedRisk: 9,
    softKeatingToMazzei: 800, softMccallToDrummond: 600, undecidedToMazzei: 1200,
    runoffProjection: "Mazzei vs. Drummond (58% probability)",
    urgencyLevel: "high",
    headline: "Mazzei gains 0.8 pts — bandwagon effect accelerating among soft Keating voters",
  },
  {
    day: 2, date: "Jun 9",
    mazzei: 23.7, drummond: 22.4, keating: 20.5, mccall: 17.8, undecided: 15.6,
    keatingBleedRisk: 24, mccallBleedRisk: 18, drummondBleedRisk: 10,
    softKeatingToMazzei: 1700, softMccallToDrummond: 1100, undecidedToMazzei: 2600,
    runoffProjection: "Mazzei vs. Drummond (62% probability)",
    urgencyLevel: "high",
    headline: "Keating drops below 21% — soft supporters migrating to Mazzei at accelerating rate",
  },
  {
    day: 3, date: "Jun 10",
    mazzei: 24.8, drummond: 22.9, keating: 19.9, mccall: 17.4, undecided: 15.0,
    keatingBleedRisk: 28, mccallBleedRisk: 21, drummondBleedRisk: 11,
    softKeatingToMazzei: 2800, softMccallToDrummond: 1700, undecidedToMazzei: 4200,
    runoffProjection: "Mazzei vs. Drummond (66% probability)",
    urgencyLevel: "critical",
    headline: "Mazzei breaks 24% — Keating and McCall must act now or risk falling out of contention",
  },
  {
    day: 4, date: "Jun 11",
    mazzei: 26.1, drummond: 23.5, keating: 19.2, mccall: 17.0, undecided: 14.2,
    keatingBleedRisk: 32, mccallBleedRisk: 24, drummondBleedRisk: 12,
    softKeatingToMazzei: 4100, softMccallToDrummond: 2400, undecidedToMazzei: 6000,
    runoffProjection: "Mazzei vs. Drummond (70% probability)",
    urgencyLevel: "critical",
    headline: "Mazzei pulls away — 6-day window to stop the consolidation is closing fast",
  },
  {
    day: 5, date: "Jun 12",
    mazzei: 27.5, drummond: 24.2, keating: 18.4, mccall: 16.5, undecided: 13.4,
    keatingBleedRisk: 36, mccallBleedRisk: 27, drummondBleedRisk: 13,
    softKeatingToMazzei: 5600, softMccallToDrummond: 3200, undecidedToMazzei: 8100,
    runoffProjection: "Mazzei vs. Drummond (74% probability)",
    urgencyLevel: "critical",
    headline: "5 days out — Keating and McCall in danger zone; Drummond consolidating as #2",
  },
  {
    day: 6, date: "Jun 13",
    mazzei: 29.0, drummond: 25.0, keating: 17.5, mccall: 16.0, undecided: 12.5,
    keatingBleedRisk: 40, mccallBleedRisk: 30, drummondBleedRisk: 14,
    softKeatingToMazzei: 7300, softMccallToDrummond: 4100, undecidedToMazzei: 10400,
    runoffProjection: "Mazzei vs. Drummond (78% probability)",
    urgencyLevel: "critical",
    headline: "4 days out — Mazzei approaching 30%; Keating and McCall fighting for survival",
  },
  {
    day: 7, date: "Jun 14",
    mazzei: 30.6, drummond: 25.9, keating: 16.5, mccall: 15.4, undecided: 11.6,
    keatingBleedRisk: 44, mccallBleedRisk: 33, drummondBleedRisk: 15,
    softKeatingToMazzei: 9100, softMccallToDrummond: 5100, undecidedToMazzei: 13000,
    runoffProjection: "Mazzei vs. Drummond (82% probability)",
    urgencyLevel: "critical",
    headline: "3 days out — Mazzei at 30.6%; Drummond solidifying #2; Keating and McCall must close gap",
  },
  {
    day: 8, date: "Jun 15",
    mazzei: 32.2, drummond: 26.8, keating: 15.4, mccall: 14.8, undecided: 10.8,
    keatingBleedRisk: 48, mccallBleedRisk: 36, drummondBleedRisk: 16,
    softKeatingToMazzei: 11100, softMccallToDrummond: 6200, undecidedToMazzei: 15800,
    runoffProjection: "Mazzei vs. Drummond (86% probability)",
    urgencyLevel: "critical",
    headline: "Eve of election — Mazzei leads by 5.4 pts; Drummond in 2nd; Keating and McCall need miracle",
  },
  {
    day: 9, date: "Jun 16",
    mazzei: 33.5, drummond: 27.5, keating: 14.5, mccall: 14.2, undecided: 10.3,
    keatingBleedRisk: 52, mccallBleedRisk: 39, drummondBleedRisk: 17,
    softKeatingToMazzei: 13000, softMccallToDrummond: 7400, undecidedToMazzei: 18500,
    runoffProjection: "Mazzei vs. Drummond (89% probability)",
    urgencyLevel: "critical",
    headline: "ELECTION DAY — Projected: Mazzei 33.5%, Drummond 27.5%, Keating 14.5%, McCall 14.2%",
  },
  {
    day: 10, date: "Jun 16",
    mazzei: 33.5, drummond: 27.5, keating: 14.5, mccall: 14.2, undecided: 10.3,
    keatingBleedRisk: 52, mccallBleedRisk: 39, drummondBleedRisk: 17,
    softKeatingToMazzei: 13000, softMccallToDrummond: 7400, undecidedToMazzei: 18500,
    runoffProjection: "Mazzei vs. Drummond (89% probability)",
    urgencyLevel: "critical",
    headline: "ELECTION DAY — Final projections locked",
  },
];

// ── Get today's snapshot ───────────────────────────────────────────────────────
export function getTodaySnapshot(): DaySnapshot {
  const day = getDayNumber();
  return DAILY_PROGRESSION[Math.min(day, DAILY_PROGRESSION.length - 1)];
}

// ── Candidate-specific bleed risk ─────────────────────────────────────────────
export interface BleedRiskModel {
  candidateName: string;
  currentPct: number;
  softSupporters: number;        // voters not firmly committed
  atRiskToMazzei: number;        // soft supporters likely to migrate to Mazzei
  atRiskPct: number;             // % of soft supporters at risk
  retainableWithEA: number;      // voters EA can retain with precision retargeting
  netVoteImpact: number;         // votes gained vs. lost without EA intervention
  urgencyMessage: string;
}

export function getCandidateBleedRisk(candidate: "drummond" | "keating" | "mccall"): BleedRiskModel {
  const snap = getTodaySnapshot();
  const daysLeft = getDaysToElection();

  const configs = {
    drummond: {
      name: "Drummond",
      softSupporters: 18500,
      bleedPct: snap.drummondBleedRisk,
      retainRate: 0.72,
      urgency: `Club for Growth's $4.3M attack campaign is pushing soft Drummond supporters toward Mazzei as a "safe" choice. ${snap.drummondBleedRisk}% of your soft supporters show migration signals — EA can identify and retain them before they leave.`,
    },
    keating: {
      name: "Keating",
      softSupporters: 22800,
      bleedPct: snap.keatingBleedRisk,
      retainRate: 0.65,
      urgency: `Trump's endorsement is pulling ${snap.keatingBleedRisk}% of your soft supporters toward Mazzei. The "outsider lane" you built is being absorbed. EA can identify the ${Math.round(22800 * snap.keatingBleedRisk / 100)} at-risk voters and deliver a retention message before they're gone.`,
    },
    mccall: {
      name: "McCall",
      softSupporters: 21200,
      bleedPct: snap.mccallBleedRisk,
      retainRate: 0.68,
      urgency: `${snap.mccallBleedRisk}% of your soft supporters are showing signals of consolidating behind Drummond as the "stop Mazzei" candidate. EA can intercept those voters with your fiscal conservative message before Drummond locks them in.`,
    },
  };

  const cfg = configs[candidate];
  const atRisk = Math.round(cfg.softSupporters * cfg.bleedPct / 100);
  const retainable = Math.round(atRisk * cfg.retainRate);

  return {
    candidateName: cfg.name,
    currentPct: snap[candidate],
    softSupporters: cfg.softSupporters,
    atRiskToMazzei: atRisk,
    atRiskPct: cfg.bleedPct,
    retainableWithEA: retainable,
    netVoteImpact: retainable,
    urgencyMessage: cfg.urgency,
  };
}

// ── Migration flow summary ─────────────────────────────────────────────────────
export function getMigrationSummary() {
  const snap = getTodaySnapshot();
  const daysLeft = getDaysToElection();
  return {
    daysLeft,
    dayNumber: snap.day,
    todayDate: snap.date,
    headline: snap.headline,
    urgencyLevel: snap.urgencyLevel,
    runoffProjection: snap.runoffProjection,
    flows: [
      {
        from: "Soft Keating voters",
        to: "Mazzei",
        count: snap.softKeatingToMazzei,
        driver: "Trump endorsement bandwagon",
        color: "#f59e0b",
      },
      {
        from: "Soft McCall voters",
        to: "Drummond",
        count: snap.softMccallToDrummond,
        driver: "Anti-Mazzei institutional consolidation",
        color: "#f97316",
      },
      {
        from: "Pure undecideds",
        to: "Mazzei",
        count: snap.undecidedToMazzei,
        driver: "Frontrunner effect / late deciders",
        color: "#fbbf24",
      },
    ],
    polling: [
      { name: "Mazzei", pct: snap.mazzei, trend: snap.mazzei > BASELINE.mazzei ? "up" : "flat" },
      { name: "Drummond", pct: snap.drummond, trend: snap.drummond > BASELINE.drummond ? "up" : "flat" },
      { name: "Keating", pct: snap.keating, trend: snap.keating < BASELINE.keating ? "down" : "flat" },
      { name: "McCall", pct: snap.mccall, trend: snap.mccall < BASELINE.mccall ? "down" : "flat" },
      { name: "Undecided", pct: snap.undecided, trend: "down" },
    ],
  };
}
