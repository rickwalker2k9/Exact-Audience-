// @vitest-environment jsdom
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Tn5InteractiveMap } from "./Tn5InteractiveMap";

describe("Tn5InteractiveMap", () => {
  it("updates the county intelligence panel when a TN-5 county is selected", async () => {
    const user = userEvent.setup();
    render(<Tn5InteractiveMap card="#0d1428" ink="#eef5ff" muted="#9cadc8" border="rgba(148,163,184,.18)" isDark />);

    expect(screen.getByText("Williamson County")).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Open Lake county intelligence" }));

    expect(screen.getByText("Lake County")).toBeTruthy();
    expect(screen.getAllByText(/Northwest rural/i).length).toBeGreaterThan(0);
  });
});
