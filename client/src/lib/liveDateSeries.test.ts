import { describe, expect, it } from "vitest";
import { relabelSeriesToCurrentDate } from "./liveDateSeries";

describe("relabelSeriesToCurrentDate", () => {
  it("anchors the newest traffic row to the viewer's current local date", () => {
    const series = [
      { day: "legacy 1", ctv: 100 },
      { day: "legacy 2", ctv: 200 },
      { day: "legacy 3", ctv: 300 },
    ];

    const relabeled = relabelSeriesToCurrentDate(series, new Date(2026, 7, 15, 12));

    expect(relabeled.map(row => row.day)).toEqual(["Aug 13", "Aug 14", "Aug 15"]);
    expect(relabeled.map(row => row.ctv)).toEqual([100, 200, 300]);
  });

  it("rolls labels back across a month boundary without retaining stale month names", () => {
    const relabeled = relabelSeriesToCurrentDate(
      [{ day: "old" }, { day: "old" }, { day: "old" }],
      new Date(2026, 7, 1, 12),
    );

    expect(relabeled.map(row => row.day)).toEqual(["Jul 30", "Jul 31", "Aug 1"]);
  });

  it("supports a complete 30-day current-date window", () => {
    const source = Array.from({ length: 30 }, (_, index) => ({ day: `legacy ${index}` }));
    const relabeled = relabelSeriesToCurrentDate(source, new Date(2026, 7, 15, 12));

    expect(relabeled).toHaveLength(30);
    expect(relabeled[0].day).toBe("Jul 17");
    expect(relabeled.at(-1)?.day).toBe("Aug 15");
  });
});
