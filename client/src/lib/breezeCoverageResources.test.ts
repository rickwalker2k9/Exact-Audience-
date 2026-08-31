import { describe, expect, it } from "vitest";
import { getBreezeCoverageResources } from "./breezeCoverageResources";

describe("getBreezeCoverageResources", () => {
  it("prioritizes verified Austin-area resources and returns a bounded path", () => {
    const resources = getBreezeCoverageResources("Austin", 15);
    expect(resources).toHaveLength(4);
    expect(resources[0]).toMatchObject({ provider: "The Texas Insurance Broker", citySpecific: true });
    expect(resources.every(resource => resource.href.startsWith("https://"))).toBe(true);
  });

  it("returns a varied national path when no city-specific resource is available", () => {
    const firstPath = getBreezeCoverageResources("Dallas", 1);
    const secondPath = getBreezeCoverageResources("Dallas", 2);
    expect(firstPath).toHaveLength(4);
    expect(secondPath).toHaveLength(4);
    expect(firstPath[0].provider).not.toBe(secondPath[0].provider);
  });
});
