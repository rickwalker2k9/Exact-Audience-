import { describe, expect, it } from "vitest";
import { parseBreezePixelCsv } from "./breezePixelImport";

describe("Breeze pixel spreadsheet parsing", () => {
  it("accepts the documented platform, pixel ID, status, and events columns", () => {
    const rows = parseBreezePixelCsv("Platform,Pixel ID,Status,Events\nMeta Pixel,123456789,active,PageView;Lead;QuoteStart\nGoogle Tag,AW-987654,needs-review,PageView|FormStart");
    expect(rows).toEqual([
      { platform: "Meta Pixel", pixelId: "123456789", status: "active", eventNames: ["PageView", "Lead", "QuoteStart"] },
      { platform: "Google Tag", pixelId: "AW-987654", status: "needs-review", eventNames: ["PageView", "FormStart"] },
    ]);
  });

  it("rejects missing required columns", () => {
    expect(() => parseBreezePixelCsv("Platform,Pixel ID\nMeta Pixel,123456789")).toThrow("Missing required spreadsheet column");
  });
});
