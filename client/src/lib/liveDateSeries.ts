export type DayLabeledRow = { day: string };

function startOfLocalDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function formatDashboardDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
}

/**
 * Keeps the delivery values intact while anchoring the newest row to the
 * viewer's local calendar date. This prevents a static source-data label from
 * making a live dashboard look stale as time passes.
 */
export function relabelSeriesToCurrentDate<T extends DayLabeledRow>(series: T[], currentDate = new Date()): T[] {
  const today = startOfLocalDay(currentDate);

  return series.map((row, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (series.length - 1 - index));
    return { ...row, day: formatDashboardDate(date) };
  });
}

export function millisecondsUntilNextLocalDay(currentDate = new Date()) {
  const nextDay = startOfLocalDay(currentDate);
  nextDay.setDate(nextDay.getDate() + 1);
  return Math.max(1_000, nextDay.getTime() - currentDate.getTime() + 1_000);
}
