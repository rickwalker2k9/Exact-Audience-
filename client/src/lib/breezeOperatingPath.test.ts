import { describe, expect, it } from "vitest";
import { BREEZE_OPERATING_PATH } from "./breezeOperatingPath";

describe("Breeze operating path", () => {
  it("distinguishes uploaded records, illustrative activity, future SiteID data, and the available affiliate destination", () => {
    expect(BREEZE_OPERATING_PATH.map(stage => stage.id)).toEqual(["audience", "responders", "email", "website", "destination"]);
    expect(BREEZE_OPERATING_PATH[0]).toMatchObject({ value: "2,696", sourceType: "uploaded" });
    expect(BREEZE_OPERATING_PATH[1]).toMatchObject({ value: "350", sourceType: "uploaded" });
    expect(BREEZE_OPERATING_PATH[2].sourceType).toBe("illustrative");
    expect(BREEZE_OPERATING_PATH[3].sourceType).toBe("awaiting");
    expect(BREEZE_OPERATING_PATH[4].sourceType).toBe("available");
  });
});
