// @vitest-environment jsdom
import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BreezeRecordAccessNotice, buildPriorPeriodActivitySequence, SelectedAudienceJourney } from "./BreezeFunnelHierarchy";

describe("SelectedAudienceJourney", () => {
  it("renders source fields, channel status, and general coverage resources without inferring personal activity", () => {
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

    expect(screen.getByText("Details in this list")).toBeTruthy();
    expect(screen.getByText("Age range")).toBeTruthy();
    expect(screen.getByText("Income range")).toBeTruthy();
    expect(screen.getByText("Phone")).toBeTruthy();
    expect(screen.queryByText("Email")).toBeNull();
    expect(screen.getByText("Ad and email updates")).toBeTruthy();
    expect(screen.getByText("Coverage research path")).toBeTruthy();
    expect(screen.getByText("Guardian Life")).toBeTruthy();
    expect(screen.queryByText(/likelihood|demo|illustrative|SiteID/i)).toBeNull();
  });

  it("creates an exact-count activity sequence without unsupported event detail", () => {
    expect(buildPriorPeriodActivitySequence(3)).toEqual([
      "Activity 1",
      "Activity 2",
      "Activity 3",
    ]);
    expect(buildPriorPeriodActivitySequence(-2)).toEqual([]);
  });

  it("renders an aggregate-only public access notice without prospect identities", () => {
    render(<BreezeRecordAccessNotice />);
    expect(screen.getByText("Individual prospect records are protected")).toBeTruthy();
    expect(screen.queryByText("Janice Threatte")).toBeNull();
    expect(screen.queryByText("Troy Brant")).toBeNull();
  });
});
