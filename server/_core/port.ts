export const RAILWAY_LISTEN_HOST = "0.0.0.0";

export function resolveListenPort(portValue: string | undefined): number {
  const parsedPort = Number.parseInt(portValue || "3000", 10);
  return Number.isInteger(parsedPort) && parsedPort > 0 ? parsedPort : 3000;
}
