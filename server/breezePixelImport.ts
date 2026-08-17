export type BreezePixelStatus = "active" | "paused" | "needs-review";

export type BreezePixelImportRow = {
  platform: string;
  pixelId: string;
  status: BreezePixelStatus;
  eventNames: string[];
};

const REQUIRED_HEADERS = ["platform", "pixel id", "status", "events"] as const;

function readCsvLine(line: string) {
  const fields: string[] = [];
  let field = "";
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (char === '"' && line[index + 1] === '"' && quoted) {
      field += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      fields.push(field.trim());
      field = "";
    } else {
      field += char;
    }
  }
  fields.push(field.trim());
  return fields;
}

function normalizeHeader(value: string) {
  return value.trim().toLowerCase().replace(/[_-]+/g, " ").replace(/\s+/g, " ");
}

export function parseBreezePixelCsv(csvText: string): BreezePixelImportRow[] {
  const lines = csvText.replace(/^\uFEFF/, "").split(/\r?\n/).filter(line => line.trim());
  if (lines.length < 2) throw new Error("The pixel spreadsheet needs a header row and at least one configuration row.");
  const headers = readCsvLine(lines[0]).map(normalizeHeader);
  const positions = Object.fromEntries(headers.map((header, index) => [header, index]));
  const missing = REQUIRED_HEADERS.filter(header => positions[header] === undefined);
  if (missing.length) throw new Error(`Missing required spreadsheet column${missing.length > 1 ? "s" : ""}: ${missing.join(", ")}.`);

  const rows = lines.slice(1).map((line, rowIndex) => {
    const values = readCsvLine(line);
    const platform = values[positions.platform] ?? "";
    const pixelId = values[positions["pixel id"]] ?? "";
    const statusRaw = (values[positions.status] ?? "").toLowerCase().replace(/\s+/g, "-");
    const events = (values[positions.events] ?? "").split(/[;,|]/).map(value => value.trim()).filter(Boolean);
    if (!platform || !pixelId || !statusRaw || events.length === 0) throw new Error(`Row ${rowIndex + 2} must include platform, pixel ID, status, and at least one event.`);
    if (!/^[a-z0-9._:-]{2,160}$/i.test(pixelId)) throw new Error(`Row ${rowIndex + 2} has an invalid pixel ID.`);
    if (!["active", "paused", "needs-review"].includes(statusRaw)) throw new Error(`Row ${rowIndex + 2} has an invalid status. Use active, paused, or needs-review.`);
    return { platform: platform.slice(0, 80), pixelId, status: statusRaw as BreezePixelStatus, eventNames: Array.from(new Set(events)).slice(0, 20) };
  });
  if (rows.length > 100) throw new Error("A pixel import may contain at most 100 configurations.");
  return rows;
}
