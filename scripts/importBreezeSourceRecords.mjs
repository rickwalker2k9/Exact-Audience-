import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import mysql from "mysql2/promise";

const INPUT_PATH = "/home/ubuntu/Downloads/breeze-intake/breeze-source-records.ndjson";
const BATCH_SIZE = 250;

const compact = value => String(value ?? "").trim();
const recordKey = record => createHash("sha256").update([
  compact(record.source), compact(record.firstName).toLowerCase(), compact(record.lastName).toLowerCase(),
  compact(record.email).toLowerCase(), compact(record.phone).replace(/\D/g, ""),
  compact(record.city).toLowerCase(), compact(record.state).toLowerCase(), String(record.recordOrdinal),
].join("|")).digest("hex");

const main = async () => {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is unavailable");
  const raw = await readFile(INPUT_PATH, "utf8");
  const records = raw.trim().split("\n").filter(Boolean).map(line => JSON.parse(line));
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  const sql = `INSERT INTO breeze_source_records
    (source, recordKey, firstName, lastName, email, phone, ageRange, incomeRange, city, state, sourceLabel, recordOrdinal)
    VALUES ?
    ON DUPLICATE KEY UPDATE
      firstName=VALUES(firstName), lastName=VALUES(lastName), email=VALUES(email), phone=VALUES(phone),
      ageRange=VALUES(ageRange), incomeRange=VALUES(incomeRange), city=VALUES(city), state=VALUES(state),
      sourceLabel=VALUES(sourceLabel), recordOrdinal=VALUES(recordOrdinal)`;

  for (let index = 0; index < records.length; index += BATCH_SIZE) {
    const batch = records.slice(index, index + BATCH_SIZE).map(record => [
      compact(record.source), recordKey(record), compact(record.firstName), compact(record.lastName),
      compact(record.email), compact(record.phone), compact(record.ageRange), compact(record.incomeRange),
      compact(record.city), compact(record.state), compact(record.sourceLabel), Number(record.recordOrdinal),
    ]);
    await connection.query(sql, [batch]);
  }
  await connection.end();
  const counts = records.reduce((total, record) => ({ ...total, [record.source]: (total[record.source] ?? 0) + 1 }), {});
  console.log(`imported=${records.length}`);
  console.log(`source_counts=${JSON.stringify(counts)}`);
};

main().catch(error => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
