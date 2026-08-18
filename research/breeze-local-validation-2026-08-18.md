# Breeze Local Validation — August 18, 2026

The local `/breeze-insurance` route was reviewed after the current operating-portal refinement.

## Confirmed presentation

- The hero renders the supplied Breeze logo only, with the requested orange-edge treatment and no added wordmark fallback.
- The main Similarweb traffic chart renders on black and its visible values count up after viewport entry.
- The rolling Google Ads, Meta Ads, and Email chart uses black, orange, gold, and teal only; channel metrics complete their in-view count-up.
- The Exact Audience source control shows 2,696 records and the activity table opens at 30 records with progressive loading.
- Google Ads and Meta Ads retain their confirmed 112 and 238 engagement-record counts.
- The funnel stages render as Data, Engagement, Outreach, SiteID, and Destination. SiteID remains visibly pending and does not show visitor events.
- The revised quote section renders as an animated ad-to-quote path, and the former Affiliate Destination, Pixel Management, and Data Status bottom panels are absent.
- Client-facing traffic, source-allocation, form-fill, and funnel copy no longer uses the terms demo, illustrative, uploaded, spreadsheet, worksheet, or intake.

## Validation commands

- Vitest: 47 tests passed.
- TypeScript: `npx tsc --noEmit` passed.
- Production build: `pnpm build` passed.

## Public deployment status

Two initial checks of the Railway `/breeze-insurance` route immediately after the `e7acefe` GitHub push still returned the preceding build. A cache-bypassed check at `/breeze-insurance?release=e7acefe` subsequently confirmed the deployed revision: the old client-facing terminology and the removed lower panels were absent; the new channel-monitoring, engagement-allocation, Data/Engagement/Outreach/SiteID/Destination funnel language, and revised quote flow were present. The public route continued to render the Breeze logo-only hero, 2,696 Exact Audience records, 112 Google engagement records, 238 Meta engagement records, and SiteID Pending Installation.

## Selected-record journey validation

The local Exact Audience activity table now exposes a **View journey** control for each displayed source record. Selecting Megan Henggeler rendered only source-record fields that were present (age range, income range, and email); no phone number was invented. The selected journey showed the corresponding Google, Meta, and Email Outreach states, its engagement windows, and a three-step 30-day comparison path (Northwestern Mutual, The Standard, and PolicyGenius). It explicitly kept that context separate from SiteID, and no SiteID visitor event appeared in the individual journey.

The first two public cache-bypassed checks after the `5d4e662` GitHub push still returned the preceding table implementation without the **View journey** control. A subsequent cache-bypassed public check confirmed the automatic Railway deployment completed. The route exposed the **View journey** control for the Exact Audience table; selecting Megan Henggeler rendered the verified source-record fields, Google/Meta/Email engagement states, the 30-day comparison path, and the statement that no SiteID visitor event appears until installation.

## Source-backed prospect distribution map

The decorative field-coverage visual was replaced locally with an interactive U.S. state-grid map powered by the Exact Audience source-record geography aggregation. The loaded data produced 2,668 records with valid city/state coverage across 16 states; the remainder of the 2,696-record Exact Audience population did not carry a usable two-letter state and was not assigned to a map location. The map surfaced source-backed state counts, including Florida (385), Illinois (292), Pennsylvania (273), Massachusetts (212), Michigan (210), North Carolina (206), New Jersey (200), and Georgia (198). The selected Florida state panel displayed its top source cities: Miami (33), Orlando (24), Tampa (24), and Naples (12).

Selecting Michigan in the local state grid updated the panel to **MI · 210 records**, with the mapped source cities Detroit (14), Grand Rapids (9), Ypsilanti (6), and Grosse Pointe (5). The map control is keyboard-addressable and does not display individual contact data.

The public Railway route was verified after commit `c45c3be` deployed. After its initial loading state, it rendered the source-backed map with the same 2,668-record / 16-state summary and selected Florida detail. The public view also retained the Exact Audience activity table, selectable lead journeys, SiteID Pending Installation layer, and Breeze affiliate quote flow.

## Motion audit

The retained Similarweb area chart now enters from a zero baseline with its supporting metrics counting up on entry. The rolling eight-day Google, Meta, and Email line chart now follows the same viewport-triggered baseline reveal, with staggered channel traces. The engagement-allocation totals count up when that section enters the viewport. Reduced-motion preference bypasses the nonessential chart animation while keeping final values visible.

The public Railway route was rechecked after commit `b35e80f` deployed. The Similarweb card completed at 20,300 visits, 24.19% month-over-month, and 47.24% bounce rate; the rolling traffic metrics completed at 477 Google, 350 Meta, and 108 Email. The source-backed prospect map, selected-record journey controls, and SiteID Pending Installation layer remained available.

## Engagement allocation visual

The local engagement-allocation section now presents the confirmed 350 Google and Meta engagement records as a single source-backed allocation visual. Before viewport entry it remains at a zero baseline, consistent with the motion audit; the component labels the 112 Google records as 32% and the 238 Meta records as 68%, with no click, delivery, or landing-page-visit total inferred.

## Protected Breeze client portal

The local `/breeze-client` route is isolated from campaign navigation and presents a security notice before its login form. The visitor must click **Continue** to acknowledge that access activity may be logged for security and operational purposes; only then do the username and password fields become visible. The route shows the required Exact Audience AI / Imagine Agency LLC copyright line and no control for changing client credentials.

The managed Breeze client credentials were validated against the local protected login endpoint. After the required acknowledgment and successful server-side credential check, the browser received an isolated HTTP-only client session and rendered the Breeze portal at `/breeze-client` without any campaign-directory navigation.

The public Railway route `https://ea-dashboard-production.up.railway.app/breeze-client` was verified after commit `ff1e185` deployed. It renders the client acknowledgment screen and does not expose campaign navigation. Production credential validation remains pending until the active Railway service receives its server-side `BREEZE_CLIENT_USERNAME` and `BREEZE_CLIENT_PASSWORD` variables.

Production credential verification completed after the Railway service variables were attached and commit `fc6a52c` deployed. The live `/breeze-client` route accepted the managed Breeze credentials after the required acknowledgment, created a protected session, and rendered only the isolated Breeze portal without campaign navigation.

## Active 927-contact cohort and daily release

The Breeze source view was updated to start with the first 927 approved Exact Audience records. The public Railway route was cache-bypassed after commit `301bd8e` deployed and showed the 927 active-record count in the source control, funnel stage, and Exact Audience panel. It showed **60% Opened** and **21% Clicked** for the active Email Outreach cohort, rendered the first 30 active records, and retained the progressive load control through the 927-record active roster.

The source-backed map was filtered to the active cohort rather than the full approved population, presenting 919 valid-location records across 16 states. The deterministic release model adds 30 approved records at 12:01 AM MST and places newly active records first on the next dashboard read; it does not create records beyond the approved source pool.

## Authorized August profile source and journey-sheet access

The user-provided August Google Sheet at `https://docs.google.com/spreadsheets/d/1nLtk8hlQSEycemcEsg1yY8q5nZ9-tfEH9TauGX2Bi_M/export?format=csv` is publicly accessible. Its CSV contains 2,696 rows with the fields `FIRST NAME`, `LAST NAME`, `ADDRESS`, `CITY`, `ST`, `MOBILE`, `V EMAILS`, `AGE RANGE`, `GENDER`, `CHILDREN`, `HOMEOWNER`, and `INCOME RANGE`, providing an authorized profile-field source for deterministic match review.

The user-provided journey activity sheet at `https://docs.google.com/spreadsheets/d/1ffr7pNRmd6eNASrsKszNtxG3ROymAC9ZlBhEsa3WEG8/export?format=csv` currently returns a Google sign-in page. Its per-person `Activities` counts must not be inferred or used until the sheet is shared or exported for authorized access.

## Authorized journey activity source match result

After the journey sheet was shared, its CSV was successfully retrieved with 345 activity rows. A deterministic comparison against the active 927-record Exact Audience cohort found **zero exact matches** on normalized phone, email, or first-name/last-name/city/state. Because no match key aligns to an active Breeze source record, no `Activity` total from this sheet will be displayed in the Breeze customer journeys. This avoids assigning activity counts to unrelated people.

## Separate prior-period engagement cohort

The 345 authorized journey rows are now treated as a distinct prior-period Google/Meta ad-engagement cohort rather than as Exact Audience records. Local portal verification showed the separate cohort panel loading the source-provided name, city/state, email/phone where supplied, and exact `Activity` total for each record, while the active Exact Audience table remains a separate 927-record view with richer source fields.

The hidden SiteID visitor-event language was removed from the Breeze quote-flow accessibility content. The visible funnel retains only the SiteID Pending Installation stage and future visitor field categories; it does not present a SiteID visitor event in an individual customer journey.

Public Railway verification confirmed the 345-record prior-period Google/Meta engagement panel loads after the active 927-record Exact Audience cohort. The public panel preserves the source separation, shows only the supplied contact fields and exact activity total, and retains SiteID as Pending Installation rather than reporting visitor activity.
