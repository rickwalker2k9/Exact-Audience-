const PRIOR_PERIOD_ENGAGEMENT_CSV_URL = "https://docs.google.com/spreadsheets/d/1ffr7pNRmd6eNASrsKszNtxG3ROymAC9ZlBhEsa3WEG8/export?format=csv";

export type BreezePriorPeriodEngagementRecord = {
  firstName: string;
  lastName: string;
  city: string;
  state: string;
  email: string;
  phone: string;
  activityCount: number;
  sourceLabel: string;
  recordOrdinal: number;
};

let cachedRecords: BreezePriorPeriodEngagementRecord[] | null = null;
let loadPromise: Promise<BreezePriorPeriodEngagementRecord[]> | null = null;

function parseCsv(text: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (quoted) {
      if (character === '"' && text[index + 1] === '"') {
        cell += '"';
        index += 1;
      } else if (character === '"') quoted = false;
      else cell += character;
      continue;
    }
    if (character === '"') quoted = true;
    else if (character === ",") {
      row.push(cell);
      cell = "";
    } else if (character === "\n") {
      row.push(cell.replace(/\r$/, ""));
      rows.push(row);
      row = [];
      cell = "";
    } else cell += character;
  }
  if (cell || row.length) {
    row.push(cell.replace(/\r$/, ""));
    rows.push(row);
  }
  return rows;
}

export function parseBreezePriorPeriodEngagementCsv(csv: string): BreezePriorPeriodEngagementRecord[] {
  const [headers, ...rows] = parseCsv(csv);
  if (!headers) return [];
  const column = new Map(headers.map((header, index) => [header.trim(), index]));
  const required = ["FIRST NAME", "LAST NAME", "Activity"];
  if (required.some(header => column.get(header) === undefined)) throw new Error("Prior-period engagement source is missing required fields.");
  return rows
    .filter(row => row.some(value => value.trim()))
    .map((row, index) => ({
      firstName: String(row[column.get("FIRST NAME")!] ?? "").trim(),
      lastName: String(row[column.get("LAST NAME")!] ?? "").trim(),
      city: String(row[column.get("CITY")!] ?? "").trim(),
      state: String(row[column.get("ST")!] ?? "").trim(),
      phone: String(row[column.get("PHONE")!] ?? "").trim(),
      email: String(row[column.get("PERS V EMAILS")!] ?? "").trim(),
      activityCount: Math.max(0, Number.parseInt(String(row[column.get("Activity")!] ?? "0"), 10) || 0),
      sourceLabel: "Prior-period Google / Meta engagement",
      recordOrdinal: index + 1,
    }))
    .filter(record => record.firstName && record.lastName);
}

export async function getBreezePriorPeriodEngagementRecords() {
  if (cachedRecords) return cachedRecords;
  if (!loadPromise) {
    loadPromise = fetch(PRIOR_PERIOD_ENGAGEMENT_CSV_URL)
      .then(async response => {
        if (!response.ok) throw new Error(`Prior-period engagement source download failed (${response.status})`);
        return parseBreezePriorPeriodEngagementCsv(await response.text());
      })
      .then(records => {
        cachedRecords = records;
        return records;
      })
      .finally(() => {
        loadPromise = null;
      });
  }
  return loadPromise;
}
