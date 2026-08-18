import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

export const BREEZE_CLIENT_SESSION_COOKIE = "breeze_client_session";
export const BREEZE_CLIENT_SESSION_TTL_MS = 8 * 60 * 60 * 1000;

function secureEquals(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  if (leftBuffer.length !== rightBuffer.length) return false;
  return timingSafeEqual(leftBuffer, rightBuffer);
}

export function validateBreezeClientCredentials(username: string, password: string) {
  const configuredUsername = process.env.BREEZE_CLIENT_USERNAME ?? "";
  const configuredPassword = process.env.BREEZE_CLIENT_PASSWORD ?? "";
  if (!configuredUsername || !configuredPassword) return false;
  return secureEquals(username.trim(), configuredUsername) && secureEquals(password, configuredPassword);
}

export function createBreezeClientSessionToken() {
  return randomBytes(32).toString("base64url");
}

export function hashBreezeClientSessionToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}
