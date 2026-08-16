import { describe, expect, it } from "vitest";
import { BREEZE_AFFILIATE_QUOTE_URL, BREEZE_CAMPAIGN_DESTINATIONS } from "./breezeCampaignDestinations";

describe("Breeze campaign destinations", () => {
  it("preserves the May–July calculator history and points the current campaign to the affiliate quote flow", () => {
    expect(BREEZE_CAMPAIGN_DESTINATIONS.slice(0, 3).every(destination => destination.destination === "Income Protection Calculator")).toBe(true);
    expect(BREEZE_CAMPAIGN_DESTINATIONS.at(-1)).toMatchObject({ period: "Current", url: BREEZE_AFFILIATE_QUOTE_URL });
  });
});
