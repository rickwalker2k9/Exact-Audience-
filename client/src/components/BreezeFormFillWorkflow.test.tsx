// @vitest-environment jsdom
import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BreezeFormFillWorkflow } from "./BreezeFormFillWorkflow";

describe("BreezeFormFillWorkflow", () => {
  it("advances through staged contact, eligibility, consent, and review without enabling external submission", () => {
    render(<BreezeFormFillWorkflow leadName="Demo Lead" />);

    expect(screen.getByText("Step 1 of 4")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Create demo contact pair" }));
    expect(screen.getByText(/Demo email placeholder:/)).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Continue" }));

    fireEvent.click(screen.getByLabelText(/Yes, continue to the quote flow/));
    fireEvent.click(screen.getByRole("button", { name: "Continue" }));

    fireEvent.click(screen.getByLabelText(/I confirm this is a staged demo only/));
    fireEvent.click(screen.getByRole("button", { name: "Continue" }));

    expect(screen.getByText("Step 4 of 4")).toBeTruthy();
    expect(screen.getByText(/Ready for review/)).toBeTruthy();
    expect(screen.getByRole("button", { name: "External submission is disabled" })).toHaveProperty("disabled", true);
  });
});
