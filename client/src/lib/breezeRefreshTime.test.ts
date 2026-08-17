import { describe, expect, it } from "vitest";
import { formatBreezeRefreshTime } from "./breezeRefreshTime";

describe("Breeze refresh time", () => {
  it("formats a valid approved-source refresh timestamp", () => {
    expect(formatBreezeRefreshTime("2026-08-17T15:30:00.000Z", "en-US")).toContain("Aug");
  });

  it("does not fabricate a refresh time for missing or malformed input", () => {
    expect(formatBreezeRefreshTime(undefined)).toBe("Refresh time unavailable");
    expect(formatBreezeRefreshTime("not-a-date")).toBe("Refresh time unavailable");
  });
});
