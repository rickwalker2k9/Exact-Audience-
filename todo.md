
## New Features — CTV Ad Panel Enhancements (Jul 24, 2026)

- [x] Multi-network bundle selector: checkboxes on network cards, combined reach/CPM estimate panel, unified AI brief generation for the bundle
- [x] Per-voter filter persistence: DB table (voter_ctv_prefs), tRPC save/load procedures, auto-load last filter state when panel opens
- [x] Real ad launch wiring: Meta Ads Manager API integration (createCampaign, createAdSet, createAd), CTV DSP launch stub (The Trade Desk / DV360 structure), launch confirmation modal with campaign ID

## Fix Empty Tabs — Charlie Hatcher Dashboard
- [ ] Fill Opposition Research tab with real content (Ogles ethics investigation, voting record, vulnerabilities, contrast messaging, attack lines)
- [ ] Fill District Intelligence tab with real content (county-by-county breakdown, media markets, ag economy, key voter issues, infrastructure)

## Lamborghini Dashboard Refresh — Aug 15, 2026
- [x] Expand the SiteID visitor roster with fresh, distinct Lamborghini buyer profiles.
- [x] Expand and rotate customer journeys so daily profile cards do not repeat the same individuals prematurely.
- [x] Give every Lamborghini journey a distinct trigger, signal sequence, buying pace, and next-best outreach action; avoid repeated aftermarket-parts arcs.
- [x] Complete the Lamborghini pool in full three-profile rotation groups and test that no profile repeats before every profile has appeared.
- [x] Verify the Lamborghini dashboard rotation and TypeScript build before checkpointing.
- [x] Replace the older full People-tab audience roster so all displayed Lamborghini individuals are refreshed and distinct.

## Railway Deployment Remediation — Aug 15, 2026
- [x] Diagnose and fix the Railway network healthcheck failure for the latest dashboard deployment.
- [x] Verify Railway serves the refreshed Lamborghini roster after the corrected deployment succeeds.
- [x] Inspect the correct Railway service deployment at project c3bc7500-c9f9-46b5-b081-a7ee4eac9cae and resolve any remaining healthcheck failure.
- [x] Replace unsupported import.meta.dirname usage in the production bundle and ensure missing Railway configuration does not crash startup.
- [x] Document the required OAUTH_SERVER_URL Railway variable and any other mandatory service configuration.
- [x] Confirm that the Railway deployment created from GitHub commit cc48eb2 succeeds, rather than reviewing the older failed b49bcbda deployment.
- [x] Obtain the status or logs for the Railway deployment created after 1:42 PM MST, not deployment b49bcbda from 1:12 PM MST.
- [x] Trigger a new Railway deployment from GitHub main if no deployment for cc48eb2 appears in the service deployment list.

## Lamborghini Demo URL — Aug 15, 2026
- [x] Identify the Railway public domain for the active Exact Audience service and verify the `/lamborghini` demo route.
- [x] Confirm the public `/lamborghini` URL returns HTTP 200 and displays the refreshed Exact Audience dashboard content.

## Lamborghini Live Dates — Aug 15, 2026
- [x] Replace static Lamborghini traffic-series dates with labels derived from the viewer’s current local date.
- [x] Make time-sensitive dashboard labels roll forward automatically and cover the live 7-, 14-, and 30-day chart selections.
- [x] Add test coverage for date rollover behavior and verify the public Railway demo after deployment.
- [x] Correct the chart's 30-day selection to include exactly 30 current-date labels and validate it before deployment.

## Cross-Dashboard Live Dates & Client Priorities — Aug 15, 2026
- [ ] Apply live calendar-based traffic dates to Warby Parker, Land Rover, Charlie Hatcher, and Barrett, and ensure Breeze has no obsolete static traffic dates after its live-portal redesign.
- [x] Verify Warby Parker and Land Rover inherit the shared live-date mapping, then convert Barrett’s standalone traffic and monthly labels.
- [x] Convert GenericDashboard Site Pages trend labels to the shared live-date utility so Warby Parker and Land Rover have no remaining static chart dates.
- [ ] Add a current local refresh timestamp to Breeze’s approved-source portal layer and re-verify the full named-dashboard rollout.
- [x] Audit and refine Charlie Hatcher date-sensitive views and requested campaign adjustments.
- [ ] Audit and refine Breeze date-sensitive views and requested campaign adjustments.
- [ ] Gather the business, brand, campaign, and data requirements for a new car-dealership dashboard.
- [ ] Validate all updated dashboard routes and deploy the shared live-date update to Railway.
- [x] Verify on Railway that Warby Parker and Land Rover render current shared live-date labels after the latest deployment.
- [ ] Sign in to Breeze and verify the approved-source refresh timestamp renders as a current local date/time on Railway.

## Breeze Insurance Dashboard — Aug 15, 2026
- [x] Audit the current Breeze route, dashboard data, insurance funnel, live-date behavior, and visible campaign claims.
- [x] Redesign Breeze as a focused lead-generation and form-completion dashboard, prioritizing Meta, Google, LinkedIn, and email over CTV.
- [x] Test and deploy the Breeze refinements to Railway after user review of the proposed adjustment plan.
- [ ] Transform Breeze from a proposal dashboard into a live lead-generation operating portal with funnel, form-status, website-engagement, and representative journey layers.
- [ ] Add a privacy-conscious spreadsheet intake and column-mapping workflow for the user’s real lead uploads.
- [ ] Configure a secure Google Sheets synchronization option that refreshes authorized lead data without exposing unnecessary personal data.
- [ ] Inspect and map the provided Breeze Google Sheet (ID: 14E8eR5vIKd-_rYc1XBtAfkGosz2SKXau5qOTrOjZI4I) into the portal’s authorized lead-data model after the valid-tab header is added.
- [x] Limit all Breeze portal ingestion and views to the sheet’s approved valid and valid-gold tabs; exclude spam-risk, invalid, unsubscribe, unknown, and rejected tabs.
- [x] Show aggregate funnel reporting on the normal Breeze route and restrict individual approved-lead workflow access to signed-in staff.
- [x] Require Breeze sign-in for all portal data and define viewer, staff, and administrator visibility levels for approved lead information and source controls.
- [x] Use the current approved-sheet read-only feed for the Breeze demo while deferring the private Google service-account connection.
- [x] Remove the Breeze sign-in interruption for the complete aggregate demo while keeping source controls protected.
- [ ] Add a lightweight access-code-protected Breeze view for approved individual names, stages, and operating statistics without exposing them on the public demo route.
- [ ] Temporarily display approved lead names and operating statistics directly in Breeze for the owner’s review, then restore access controls on approval.
- [ ] Require the valid tab to receive the validated-gold header schema before automatic production synchronization.
- [ ] Implement live website-engagement and form-status ingestion so the Breeze funnel shows actual visited, started, and completed counts.
- [ ] Add a spreadsheet source-selection and column-mapping workflow instead of relying only on the currently configured Google Sheet.
- [x] Replace inflated Breeze performance claims with conservative, clearly labeled operating metrics.
- [x] Show May–July traffic as Income Protection Calculator activity and route the current campaign to the supplied affiliate quote destination.
- [x] Remove pitch-oriented Breeze copy and non-results sections; replace them with factual operating status, recorded counts, and data-source provenance.
- [x] Add separate daily traffic sections for the historical Income Protection Calculator and the current affiliate quote destination, with non-overlapping illustrative demo months.
- [x] Present the approved spreadsheet names beneath the traffic sections as an owner-review roster without adding disallowed tab records.
- [x] Label every illustrative Breeze traffic figure as demo data rather than sourced campaign performance.
- [x] Replace generic tier labels in the Breeze owner-review roster with useful approved-spreadsheet profile information and current operating status.
- [ ] Map the verified approved-sheet age-range field into Breeze lead detail; do not substitute an age estimate.
- [x] Replace long likelihood horizons with two ad-seen engagement windows only: likely in 7 days and likely in 30 days.
- [x] Add clearly labeled illustrative Google, Meta, and YouTube pre-roll exposure sequences of one through six views with later website engagement.
- [x] Adapt the PolicyGenius-style unique contact and staged form-fill workflow for Breeze without provisioning or submitting externally until approved.
- [x] Inspect the existing PolicyGenius dashboard code for reusable unique contact, verification, question, and checkbox workflow components.
- [x] Prioritize completion of the Breeze two-destination, ad-engagement, and lead-detail experience before resuming other client dashboards.
- [x] Replace the Breeze home-page owner-review/results hero with the BREEZE name and “Intent prospects based on behavioral activity.”
- [x] Build an actual staged Breeze form-fill workflow UI with questions, consent checkboxes, unique-contact placeholders, and step states without external submission.
- [x] Add focused test coverage proving the staged Breeze form-fill workflow renders and advances through its demo steps.
- [ ] Keep Breeze as the sole active dashboard priority until the user explicitly redirects work.
- [ ] Show approved lead name, verified age range when available, income status, city/state, email, phone status, ad-seen engagement score, and customer journey in Breeze lead detail.
- [x] Add the supplied Breeze logo to the home hero with a subtle animated orange gradient edge treatment.
- [x] Add a Lamborghini-style daily traffic-source chart beginning August 10 for Google Ads, Meta Ads, and Email, labeled as demo data until live sources are connected.
- [x] Align the Breeze customer-journey and 7-day/30-day likelihood views with the Google Ads, Meta Ads, and Email traffic-source context.
- [x] Research and display an attributable third-party estimate of meetbreeze.com main-site traffic in a clearly labeled trend view; do not present estimates as first-party analytics.
- [x] Add a Breeze pixel and tracking management panel with a spreadsheet-upload import path, schema validation, pixel status, and supported event labels.
- [x] Replace all Breeze dashboard backgrounds and chart colors with black surfaces and gold, orange, and teal accents only.
- [x] Remove the dashboard-visible pixel spreadsheet-upload controls; populate the presentation-only pixel management display from files the user uploads in chat.
- [ ] Identify any public third-party landing-page traffic estimate available for Breeze and label its limitations clearly.
- [ ] Add verified-result fields for Google Ads clicks, Meta Ads clicks, and landing-page visits that remain blank until first-party source data is supplied or connected.
- [ ] Populate Google Ads clicks, Meta Ads clicks, and landing-page visits only from user-uploaded spreadsheets; do not connect GA4 or ad-platform accounts.
- [x] Import reporting sheet 1AydQ20lsvFBgO7sdFf8c0ZddWgnYyi-anMedOJBuky0 and display 112 Google Ads results with the remaining 238 verified records assigned to Meta Ads.
- [x] Aggregate the attached LTDI_UNDER65_100KPLUS_PART_03 Exact Audience CSV into source-record storage and add it as the Email Outreach source.
- [x] Clearly label the Breeze Email Outreach source as originating from Exact Audience alongside Google Ads and Meta Ads.
- [x] Add Google Ads, Meta Ads, and Exact Audience Data buttons that open each source in a polished, dashboard-style record view rather than a raw spreadsheet.
- [x] Remove backgrounds from the supplied Google, Meta, and Exact Audience logos and render the logo marks in white on black source buttons.
- [x] Build an Exact Audience — Behavior Based Data funnel header above the Google Ads and Meta Ads engagement layers.
- [x] Add a Website Visitors layer with the user-supplied SiteID field schema as visually marked placeholders until its CSV is provided.
- [x] Show customer journeys as progression from Exact Audience data through ad engagement to website visits and affiliate destination activity.
- [x] Reorder Breeze as Exact Audience list → ads served → Google/Meta responders → SiteID website visitors → Breeze affiliate quote link.
- [x] Remove the Income Protection Calculator from Breeze and do not show or infer affiliate-page conversions.
- [x] Update individual Breeze lead journeys to show Exact Audience source → Google/Meta response → SiteID website-visitor status → Breeze affiliate destination.
- [x] Remove remaining calculator destination branches and calculator-specific copy from Breeze page logic, not only the visible home card.

## Charlie Hatcher General Election — Aug 15, 2026
- [x] Verify the 2026 TN-5 primary result, Hatcher–Molder November matchup, district context, and public race facts from reliable sources.
- [x] Replace primary-focused Charlie Hatcher dashboard content with a current November 3 general-election framework against Chaz Molder.
- [x] Develop a documented, lower-spend media-buy alternative that states assumptions, tradeoffs, and conditions rather than promising an outcome.
- [x] Validate and deploy the Hatcher general-election dashboard update to Railway.
- [x] Simplify the Charlie Hatcher dashboard to a concise race brief, granular targeting capability, paid-ad execution view, and decision-ready media plan.
- [x] Remove or consolidate primary-era tabs and nonessential detail while retaining source-based opponent context and current election timing.
- [x] Make every visible Charlie date label roll forward after midnight and add focused rollover test coverage.
- [x] Verify the simplified `/charlie-hatcher` page in the browser and on Railway after deployment.
- [x] Add a concise TN-5-only interactive district schematic, informed by the supplied county-map reference, with click-to-open county intelligence.
- [x] Verify the new TN-5 county list and build source-backed county context and research-status details for the map.
- [x] Add the interactive map to the simplified Charlie Hatcher dashboard, test it, deploy it, and verify it on Railway.
- [x] Replace the statewide map presentation with a TN-5-only interactive district map containing no irrelevant counties.
- [x] Add a component test proving a TN-5 county click changes the visible intelligence panel.
- [ ] Deploy the accessible map controls and re-verify a live Railway county selection interaction.
