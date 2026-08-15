import { describe, expect, it } from "vitest";
import { TN5_COUNTIES } from "./tn5Map";

describe("TN-5 interactive map data", () => {
  it("contains all 17 counties described in the 2026 public district list", () => {
    expect(TN5_COUNTIES).toHaveLength(17);
    expect(new Set(TN5_COUNTIES.map(county => county.name)).size).toBe(17);
  });

  it("flags every county with a planning lens rather than a vote forecast", () => {
    expect(TN5_COUNTIES.every(county => county.planningLens.length > 30)).toBe(true);
  });
});
