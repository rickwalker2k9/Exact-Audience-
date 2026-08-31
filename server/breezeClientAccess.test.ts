import { describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";
import { appRouter } from "./routers";
import { BREEZE_CLIENT_SESSION_COOKIE, BREEZE_CLIENT_SESSION_TTL_MS, createBreezeClientSessionToken, hashBreezeClientSessionToken, validateBreezeClientCredentials } from "./breezeClientAccess";

vi.mock("./_core/notification", () => ({ notifyOwner: vi.fn().mockResolvedValue(false) }));

type CookieCall = { name: string; value: string; options: Record<string, unknown> };

function createClientContext(cookie = "") {
  const cookies: CookieCall[] = [];
  const ctx: TrpcContext = {
    user: null,
    req: { protocol: "https", headers: { cookie } } as TrpcContext["req"],
    res: {
      cookie: (name: string, value: string, options: Record<string, unknown>) => cookies.push({ name, value, options }),
      clearCookie: () => undefined,
    } as TrpcContext["res"],
  };
  return { ctx, cookies };
}

describe("Breeze client credential validation", () => {
  const hasManagedCredentials = Boolean(process.env.BREEZE_CLIENT_USERNAME?.trim() && process.env.BREEZE_CLIENT_PASSWORD?.trim());

  it.skipIf(!hasManagedCredentials)("accepts the managed server credentials through the Breeze client login endpoint and issues an isolated session", async () => {
    const username = process.env.BREEZE_CLIENT_USERNAME ?? "";
    const password = process.env.BREEZE_CLIENT_PASSWORD ?? "";
    expect(username).not.toBe("");
    expect(password).not.toBe("");
    expect(validateBreezeClientCredentials(username, password)).toBe(true);
    expect(validateBreezeClientCredentials(username, `${password}-invalid`)).toBe(false);
    const { ctx, cookies } = createClientContext();
    const login = await appRouter.createCaller(ctx).breezeClient.login({ username, password, acknowledged: true });
    expect(login.success).toBe(true);
    const sessionCookie = cookies.find(cookie => cookie.name === BREEZE_CLIENT_SESSION_COOKIE);
    expect(sessionCookie?.value).toHaveLength(43);
    expect(sessionCookie?.options).toMatchObject({ httpOnly: true, secure: true, sameSite: "none" });
    const { ctx: statusContext } = createClientContext(`${BREEZE_CLIENT_SESSION_COOKIE}=${sessionCookie?.value}`);
    expect((await appRouter.createCaller(statusContext).breezeClient.status()).authenticated).toBe(true);
  });

  it("tolerates accidental surrounding whitespace in managed credential values", () => {
    const originalUsername = process.env.BREEZE_CLIENT_USERNAME;
    const originalPassword = process.env.BREEZE_CLIENT_PASSWORD;
    process.env.BREEZE_CLIENT_USERNAME = ` ${originalUsername ?? "Breeze2026"} `;
    process.env.BREEZE_CLIENT_PASSWORD = ` ${originalPassword ?? "JessBreeze2026"} `;

    expect(validateBreezeClientCredentials((originalUsername ?? "Breeze2026").trim(), (originalPassword ?? "JessBreeze2026").trim())).toBe(true);

    if (originalUsername === undefined) delete process.env.BREEZE_CLIENT_USERNAME;
    else process.env.BREEZE_CLIENT_USERNAME = originalUsername;
    if (originalPassword === undefined) delete process.env.BREEZE_CLIENT_PASSWORD;
    else process.env.BREEZE_CLIENT_PASSWORD = originalPassword;
  });

  it("creates opaque, hashable sessions with an eight-hour maximum lifetime", () => {
    const token = createBreezeClientSessionToken();
    expect(token).toHaveLength(43);
    expect(hashBreezeClientSessionToken(token)).toHaveLength(64);
    expect(BREEZE_CLIENT_SESSION_TTL_MS).toBe(28_800_000);
  });
});
