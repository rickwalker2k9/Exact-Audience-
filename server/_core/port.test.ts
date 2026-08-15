import { describe, expect, it } from "vitest";
import { RAILWAY_LISTEN_HOST, resolveListenPort } from "./port";

describe("Railway server binding", () => {
  it("preserves Railway's injected PORT and binds on all interfaces", () => {
    expect(resolveListenPort("8080")).toBe(8080);
    expect(RAILWAY_LISTEN_HOST).toBe("0.0.0.0");
  });

  it("uses the local development fallback only when no valid injected port exists", () => {
    expect(resolveListenPort(undefined)).toBe(3000);
    expect(resolveListenPort("not-a-port")).toBe(3000);
  });
});
