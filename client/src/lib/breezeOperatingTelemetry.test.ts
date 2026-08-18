import { BREEZE_OPERATING_TELEMETRY, BREEZE_STAGE_STATUS } from "./breezeOperatingTelemetry";
import { describe, expect, it } from "vitest";

describe("Breeze operating telemetry", () => {
  it("keeps uploaded responder records separate from illustrative email activity", () => {
    expect(BREEZE_OPERATING_TELEMETRY.find(item => item.stage === "Google Ads")?.value).toBe(112);
    expect(BREEZE_OPERATING_TELEMETRY.find(item => item.stage === "Meta Ads")?.value).toBe(238);
    expect(BREEZE_OPERATING_TELEMETRY.find(item => item.stage === "Email outreach")?.status).toBe("Illustrative");
  });

  it("represents SiteID and affiliate as operating statuses rather than conversion metrics", () => {
    expect(BREEZE_STAGE_STATUS[0]?.status).toBe("Pending installation");
    expect(BREEZE_STAGE_STATUS[1]?.detail).toBe("Conversions unavailable");
  });
});
