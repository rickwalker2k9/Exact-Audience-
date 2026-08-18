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
