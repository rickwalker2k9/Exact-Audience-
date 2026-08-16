export const BREEZE_AFFILIATE_QUOTE_URL = "https://www.meetbreeze.com/disability-insurance/quotes/?tunetrackingid=102ccdb8593aef1d29660f6b36f8dc";

export const BREEZE_CAMPAIGN_DESTINATIONS: ReadonlyArray<{
  period: string;
  destination: string;
  status: string;
  url?: string;
}> = [
  { period: "May 2026", destination: "Income Protection Calculator", status: "Historical traffic destination" },
  { period: "June 2026", destination: "Income Protection Calculator", status: "Historical traffic destination" },
  { period: "July 2026", destination: "Income Protection Calculator", status: "Historical traffic destination" },
  { period: "Current", destination: "Breeze affiliate quote flow", status: "Active traffic destination", url: BREEZE_AFFILIATE_QUOTE_URL },
];
