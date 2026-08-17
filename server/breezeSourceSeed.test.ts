import { describe, expect, it } from "vitest";
import { parseBreezeSourceSeed } from "./breezeSourceSeed";

describe("Breeze private source seed", () => {
  it("parses only validated source records and ignores blank lines", () => {
    const rows = parseBreezeSourceSeed(`
{"source":"google-ads","firstName":"Avery","lastName":"Ng","email":"avery@example.test","phone":"","ageRange":"","incomeRange":"","city":"Phoenix","state":"AZ","sourceLabel":"Google Ads","recordOrdinal":1}

{"source":"exact-audience","firstName":"Jordan","lastName":"Lee","email":"jordan@example.test","phone":"","ageRange":"35-44","incomeRange":"100K+","city":"Mesa","state":"AZ","sourceLabel":"Exact Audience · Email Outreach","recordOrdinal":2}
`);
    expect(rows).toHaveLength(2);
    expect(rows.map(row => row.source)).toEqual(["google-ads", "exact-audience"]);
  });

  it("rejects an invalid source instead of treating it as an approved record", () => {
    expect(() => parseBreezeSourceSeed('{"source":"unknown","firstName":"A","lastName":"B","recordOrdinal":1}')).toThrow("Invalid Breeze source seed source");
  });
});
