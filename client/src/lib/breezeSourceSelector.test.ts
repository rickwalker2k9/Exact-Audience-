import { describe, expect, it } from "vitest";
import { BREEZE_SOURCE_SELECTOR } from "./breezeSourceSelector";

describe("Breeze source selector", () => {
  it("provides Google Ads, Meta Ads, and Exact Audience Data sources with white-logo assets", () => {
    expect(BREEZE_SOURCE_SELECTOR.map(source => source.label)).toEqual(["Google Ads", "Meta Ads", "Exact Audience Data"]);
    expect(BREEZE_SOURCE_SELECTOR.every(source => source.logo.includes("-white_"))).toBe(true);
    expect(BREEZE_SOURCE_SELECTOR.find(source => source.id === "exact-audience")?.sourceLabel).toContain("Exact Audience");
  });
});
