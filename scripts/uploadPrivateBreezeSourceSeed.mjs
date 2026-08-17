import { readFile } from "node:fs/promises";
import { storagePut } from "../server/storage.ts";

const sourcePath = "/home/ubuntu/Downloads/breeze-intake/breeze-source-records.ndjson";
const contents = await readFile(sourcePath);
const { key } = await storagePut(
  "breeze/private-source-seeds/approved-source-records.ndjson",
  contents,
  "application/x-ndjson",
);

console.log(JSON.stringify({ key, byteCount: contents.byteLength }));
