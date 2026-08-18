// @vitest-environment jsdom
import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SelectedAudienceJourney } from "./BreezeFunnelHierarchy";

describe("SelectedAudienceJourney", () => {
  it("renders only populated source fields and channel/outreach status without inferred detail", () => {
    render(<SelectedAudienceJourney record={{
      id: 1,
      source: "exact-audience",
      firstName: "Avery",
      lastName: "Source",
      ageRange: "45-54",
      incomeRange: "$100K-$149K",
      email: "",
      phone: "555-0100",
      city: "Phoenix",
      state: "AZ",
      recordOrdinal: 4,
    }} />);

    expect(screen.getByText("Available source fields")).toBeTruthy();
    expect(screen.getByText("Age range")).toBeTruthy();
    expect(screen.getByText("Income range")).toBeTruthy();
    expect(screen.getByText("Phone")).toBeTruthy();
    expect(screen.queryByText("Email")).toBeNull();
    expect(screen.getByText("Channel and outreach status")).toBeTruthy();
    expect(screen.queryByText(/likelihood|research|demo|illustrative|SiteID/i)).toBeNull();
  });
});
