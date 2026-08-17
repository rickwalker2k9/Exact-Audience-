import { BREEZE_RECORD_SOURCES, type BreezeRecordSource, type BreezeSourceRecordInput } from "./breezeSourceRecords";

const validSources = new Set<string>(BREEZE_RECORD_SOURCES);

export function parseBreezeSourceSeed(contents: string): BreezeSourceRecordInput[] {
  const records: BreezeSourceRecordInput[] = [];
  const lines = contents.split(/\r?\n/);
  lines.forEach((line, lineIndex) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    let parsed: Partial<BreezeSourceRecordInput>;
    try {
      parsed = JSON.parse(trimmed) as Partial<BreezeSourceRecordInput>;
    } catch {
      throw new Error(`Invalid Breeze source seed JSON at line ${lineIndex + 1}`);
    }
    if (!parsed.source || !validSources.has(parsed.source)) {
      throw new Error(`Invalid Breeze source seed source at line ${lineIndex + 1}`);
    }
    if (!Number.isInteger(parsed.recordOrdinal) || !parsed.firstName || !parsed.lastName) {
      throw new Error(`Incomplete Breeze source seed record at line ${lineIndex + 1}`);
    }
    records.push({
      source: parsed.source as BreezeRecordSource,
      firstName: String(parsed.firstName).trim(),
      lastName: String(parsed.lastName).trim(),
      email: String(parsed.email ?? "").trim(),
      phone: String(parsed.phone ?? "").trim(),
      ageRange: String(parsed.ageRange ?? "").trim(),
      incomeRange: String(parsed.incomeRange ?? "").trim(),
      city: String(parsed.city ?? "").trim(),
      state: String(parsed.state ?? "").trim(),
      sourceLabel: String(parsed.sourceLabel ?? "").trim(),
      recordOrdinal: Number(parsed.recordOrdinal),
    });
  });
  return records;
}
