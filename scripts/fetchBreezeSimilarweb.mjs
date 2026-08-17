import { writeFile } from "node:fs/promises";
import { callDataApi } from "../server/_core/dataApi.ts";

const domain = "meetbreeze.com";
const query = {
  country: "world",
  granularity: "monthly",
  main_domain_only: "true",
  start_date: "2026-02",
  end_date: "2026-07",
};

const [visits, desktopSources, bounceRate] = await Promise.all([
  callDataApi("Similarweb/get_visits_total", { pathParams: { domain }, query }),
  callDataApi("Similarweb/get_traffic_sources_desktop", { pathParams: { domain }, query }),
  callDataApi("Similarweb/get_bounce_rate", { pathParams: { domain }, query }),
]);

await writeFile(
  new URL("../research/breeze-similarweb-2026-08-17.json", import.meta.url),
  `${JSON.stringify({ retrievedAt: "2026-08-17", domain, visits, desktopSources, bounceRate }, null, 2)}\n`,
  "utf8",
);
