import { describe, expect, it } from "vitest";
import { parseBreezePriorPeriodEngagementCsv } from "./breezePriorPeriodEngagement";

describe("parseBreezePriorPeriodEngagementCsv", () => {
  it("keeps only the fields supplied by the separate prior-period ad-engagement source", () => {
    const records = parseBreezePriorPeriodEngagementCsv([
      "FIRST NAME,LAST NAME,CITY,ST,PHONE,PERS V EMAILS,Gender,Activity",
      "Troy,Brant,Sparta,IL,(618) 502-9513,tbrant4161@mail.tm,M,9",
    ].join("\n"));

    expect(records).toEqual([{
      firstName: "Troy",
      lastName: "Brant",
      city: "Sparta",
      state: "IL",
      phone: "(618) 502-9513",
      email: "tbrant4161@mail.tm",
      activityCount: 9,
      sourceLabel: "Prior-period Google / Meta engagement",
      recordOrdinal: 1,
    }]);
    expect(records[0]).not.toHaveProperty("ageRange");
    expect(records[0]).not.toHaveProperty("incomeRange");
  });
});
