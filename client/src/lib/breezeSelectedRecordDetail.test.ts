import { describe, expect, it } from "vitest";
import { getBreezeSupportedDetailFields } from "./breezeSelectedRecordDetail";

describe("Breeze selected-record source fields", () => {
  it("returns only populated source-supported profile fields and omits a missing phone", () => {
    const fields = getBreezeSupportedDetailFields({
      ageRange: "45-54",
      incomeRange: "$100K-$149K",
      email: "prospect@example.com",
      phone: "",
    });
    expect(fields).toEqual([
      { label: "Age range", value: "45-54" },
      { label: "Income range", value: "$100K-$149K" },
      { label: "Email", value: "prospect@example.com" },
    ]);
  });

  it("does not add likelihood, inferred research, demo, or illustrative detail fields", () => {
    const labels = getBreezeSupportedDetailFields({ ageRange: "", incomeRange: "", email: "", phone: "555-0100" }).map(field => field.label.toLowerCase());
    expect(labels).toEqual(["phone"]);
    expect(labels.join(" ")).not.toMatch(/likelihood|research|demo|illustrative/);
  });
});
