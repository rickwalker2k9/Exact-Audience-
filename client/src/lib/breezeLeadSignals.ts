export type BreezeDemoSignal = {
  views: number;
  engagedAfter: number;
  sevenDay: number;
  thirtyDay: number;
  channels: string[];
};

function stableHash(value: string) {
  return Array.from(value).reduce((total, character) => ((total << 5) - total + character.charCodeAt(0)) | 0, 0) >>> 0;
}

/**
 * A stable illustrative demo signal. It is not a measured ad-delivery or
 * conversion feed and must remain paired with the portal's demo-data label.
 */
export function buildBreezeDemoSignal(leadName: string): BreezeDemoSignal {
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
  };
}
