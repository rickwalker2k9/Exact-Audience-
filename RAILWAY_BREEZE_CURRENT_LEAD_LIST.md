# Breeze Current Lead List — Railway Daily Job

Create a second Railway service using the same repository and `main` branch. Select **Cron** as the service type. This job updates the private Breeze list before the start of each local business day.

| Field | Value |
| --- | --- |
| Repository | `rickwalker2k9/Exact-Audience-` |
| Branch | `main` |
| Build command | `pnpm build` |
| Start command | `pnpm sync:breeze-current-lead-list` |
| Schedule | `1 7 * * *` (12:01 AM MST during standard time) |
| Required variable | Copy the same `DATABASE_URL` used by the Railway web service |

The job imports the approved Google Sheet, adds a deterministic 57–112 new leads to the private upcoming-leads list, and replaces 15 of the 90 Current Lead List positions. All 90 visible positions turn over across six daily runs. The job logs only aggregate counts.
