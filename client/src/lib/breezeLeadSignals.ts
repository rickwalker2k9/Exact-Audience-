export type BreezeEngagementSignal = {
  views: number;
  engagedAfter: number;
  sevenDay: number;
  thirtyDay: number;
  channels: string[];
  researchPath: Array<{
    provider: string;
    topic: string;
  }>;
};

const RESEARCH_PATHS = [
  [
    { provider: "MassMutual", topic: "long-term disability coverage" },
    { provider: "PolicyGenius", topic: "income replacement options" },
    { provider: "Guardian", topic: "own-occupation protection" },
  ],
  [
    { provider: "Ethos", topic: "income-protection comparison" },
    { provider: "Principal", topic: "benefit-period planning" },
    { provider: "Ladder", topic: "household income safeguards" },
  ],
  [
    { provider: "Northwestern Mutual", topic: "professional income protection" },
    { provider: "The Standard", topic: "specialty occupation coverage" },
    { provider: "PolicyGenius", topic: "policy comparison" },
  ],
  [
    { provider: "Mutual of Omaha", topic: "income-replacement planning" },
    { provider: "MassMutual", topic: "coverage amount research" },
    { provider: "Lincoln Financial", topic: "long-term protection options" },
  ],
  [
    { provider: "Haven Life", topic: "household protection research" },
    { provider: "Ethos", topic: "benefit affordability" },
    { provider: "Guardian", topic: "disability-income comparisons" },
  ],
] as const;

function stableHash(value: string) {
  return Array.from(value).reduce((total, character) => ((total << 5) - total + character.charCodeAt(0)) | 0, 0) >>> 0;
}

export function buildBreezeEngagementSignal(leadName: string): BreezeEngagementSignal {
  const hash = stableHash(leadName);
  const views = 1 + (hash % 6);
  const engagedAfter = Math.min(views, 3 + (hash % 4));
  const sevenDay = 10 + views * 4 + (hash % 7);
  const thirtyDay = Math.min(88, sevenDay + 20 + (hash % 12));
  const channelPool = ["Google Ads", "Meta Ads", "Email"];
  return {
    views,
    engagedAfter,
    sevenDay,
    thirtyDay,
    channels: channelPool.slice(0, 1 + (hash % 3)),
    researchPath: RESEARCH_PATHS[hash % RESEARCH_PATHS.length].map(step => ({ ...step })),
  };
}
