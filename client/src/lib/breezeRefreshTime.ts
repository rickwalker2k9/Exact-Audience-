export function formatBreezeRefreshTime(value: string | null | undefined, locale = "en-US") {
  if (!value) return "Refresh time unavailable";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Refresh time unavailable";
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}
