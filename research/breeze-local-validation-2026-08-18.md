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
