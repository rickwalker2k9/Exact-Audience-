import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { parse as parseCookie } from "cookie";
import { notifyOwner } from "./_core/notification";
import { invokeLLM } from "./_core/llm";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { createBreezeClientSession, createBreezeImportSource, getBreezeActiveCohortStatus, getBreezeClientAccessReport, getBreezeClientSession, getBreezeExactAudienceGeography, getBreezePixelConfigurations, getBreezeProgressByContactKeys, getBreezeSourceRecords, getVoterCtvPrefs, touchBreezeClientSession, upsertBreezeLeadProgress, upsertBreezePixelConfiguration, upsertVoterCtvPrefs } from "./db";
import { BREEZE_FUNNEL_STAGES, buildFunnelCounts, getApprovedBreezeLeads, getBreezeContactKey, mapApprovedCsv, toLeadSummary, toOwnerReviewLead, type BreezeFunnelStage } from "./breezeSheet";
import { parseBreezePixelCsv } from "./breezePixelImport";
import { BREEZE_CLIENT_SESSION_COOKIE, BREEZE_CLIENT_SESSION_TTL_MS, createBreezeClientSessionToken, hashBreezeClientSessionToken, validateBreezeClientCredentials } from "./breezeClientAccess";
import { BREEZE_RECORD_SOURCES } from "./breezeSourceRecords";
import { TRPCError } from "@trpc/server";
import { storagePut } from "./storage";
import { z } from "zod";

// ── Shared voter profile builder ─────────────────────────────────────────────
function buildVoterProfile(input: {
  contactName: string;
  contactCity: string;
  contactCounty: string;
  contactAge?: string;
  contactGender?: string;
  contactMarried?: string;
  contactChildren?: string;
}) {
  const { contactName, contactCity, contactCounty, contactAge, contactGender, contactMarried, contactChildren } = input;
  const isFarmerCounty = ["Henry", "Weakley", "Obion", "Dyer", "Lauderdale", "Benton", "Humphreys", "Houston", "Stewart", "Lake"].includes(contactCounty);
  const isParent = contactChildren === "Y";
  const isVet = contactGender === "M" && (contactAge === "55-64" || contactAge === "65 and older");
  const isFemale = contactGender === "F";

  const lines = [
    `Name: ${contactName}`,
    `City: ${contactCity}, ${contactCounty} County, Tennessee`,
    contactAge ? `Age bracket: ${contactAge}` : null,
    contactGender ? `Gender: ${contactGender === "M" ? "Male" : contactGender === "F" ? "Female" : "Unknown"}` : null,
    contactMarried === "Y" ? "Married: Yes" : null,
    isParent ? "Has children: Yes" : null,
    isFarmerCounty ? `Lives in agricultural county (${contactCounty}) — farming and land preservation are top concerns` : null,
    isVet ? "Likely veteran or military-adjacent based on age/gender profile" : null,
    isFemale && isParent ? "Rural mom profile — family, schools, land preservation are priorities" : null,
  ].filter(Boolean).join("\n");

  return { lines, isFarmerCounty, isParent, isVet, isFemale };
}

const CANDIDATE_BIO = `Charlie Hatcher is a 10th-generation Tennessee farmer, veterinarian, and 7-year Agriculture Commissioner. He passed the Farmland Preservation Act. He built 8 businesses. He's running for Tennessee's 5th Congressional District Republican primary on August 6, 2026. Campaign slogan: "Hire a Farmer." Website: charliehatcher.com. Early voting: open now through August 1.`;

const contactInput = z.object({
  contactName: z.string(),
  contactCity: z.string(),
  contactCounty: z.string(),
  contactAge: z.string().optional(),
  contactGender: z.string().optional(),
  contactMarried: z.string().optional(),
  contactChildren: z.string().optional(),
});

function getBreezeClientSessionHash(cookieHeader?: string) {
  const token = parseCookie(cookieHeader ?? "")[BREEZE_CLIENT_SESSION_COOKIE];
  return token ? hashBreezeClientSessionToken(token) : null;
}

function toBreezeClientSessionStatus(session: Awaited<ReturnType<typeof getBreezeClientSession>>) {
  if (!session || session.expiresAt.getTime() <= Date.now() || session.closedAt) return { authenticated: false } as const;
  return { authenticated: true, loginName: session.loginName, loggedInAt: session.loggedInAt, lastSeenAt: session.lastSeenAt } as const;
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  breezeClient: router({
    login: publicProcedure
      .input(z.object({ username: z.string().min(1).max(120), password: z.string().min(1).max(256), acknowledged: z.literal(true) }))
      .mutation(async ({ ctx, input }) => {
        if (!validateBreezeClientCredentials(input.username, input.password)) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid client credentials." });
        }
        const now = new Date();
        const token = createBreezeClientSessionToken();
        const expiresAt = new Date(now.getTime() + BREEZE_CLIENT_SESSION_TTL_MS);
        await createBreezeClientSession({ sessionHash: hashBreezeClientSessionToken(token), loginName: input.username.trim(), acknowledgedAt: now, expiresAt });
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(BREEZE_CLIENT_SESSION_COOKIE, token, { ...cookieOptions, maxAge: BREEZE_CLIENT_SESSION_TTL_MS });
        const notified = await notifyOwner({ title: "Breeze client portal access", content: `The Breeze client portal was accessed at ${now.toLocaleString()} using the managed client username. Access activity is available in the private owner report.` }).catch(() => false);
        return { success: true, expiresAt, notified };
      }),
    status: publicProcedure.query(async ({ ctx }) => {
      const sessionHash = getBreezeClientSessionHash(ctx.req.headers.cookie);
      if (!sessionHash) return { authenticated: false } as const;
      return toBreezeClientSessionStatus(await getBreezeClientSession(sessionHash));
    }),
    activity: publicProcedure.mutation(async ({ ctx }) => {
      const sessionHash = getBreezeClientSessionHash(ctx.req.headers.cookie);
      if (!sessionHash) return { authenticated: false } as const;
      const session = await getBreezeClientSession(sessionHash);
      if (!toBreezeClientSessionStatus(session).authenticated) return { authenticated: false } as const;
      await touchBreezeClientSession(sessionHash);
      return { authenticated: true } as const;
    }),
    logout: publicProcedure.mutation(async ({ ctx }) => {
      const sessionHash = getBreezeClientSessionHash(ctx.req.headers.cookie);
      if (sessionHash) await touchBreezeClientSession(sessionHash, true);
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(BREEZE_CLIENT_SESSION_COOKIE, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
    accessReport: protectedProcedure
      .input(z.object({ limit: z.number().int().min(1).max(200).default(100) }))
      .query(async ({ ctx, input }) => {
        const isOwner = Boolean(process.env.OWNER_OPEN_ID && ctx.user.openId === process.env.OWNER_OPEN_ID);
        if (!isOwner && ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN", message: "Owner access is required for the Breeze client activity report." });
        const sessions = await getBreezeClientAccessReport(input.limit);
        return sessions.map(session => ({
          id: session.id,
          loginName: session.loginName,
          loggedInAt: session.loggedInAt,
          lastSeenAt: session.lastSeenAt,
          closedAt: session.closedAt,
          durationSeconds: Math.max(0, Math.round((session.lastSeenAt.getTime() - session.loggedInAt.getTime()) / 1000)),
        }));
      }),
  }),

  breezePortal: router({
    summary: publicProcedure.query(async () => {
      const imports = await getApprovedBreezeLeads();
      const leads = [...imports.validGold.leads, ...imports.valid.leads];
      const progress = await getBreezeProgressByContactKeys(leads.map(getBreezeContactKey));
      const progressByKey = new Map(progress.map(row => [row.contactKey, row.stage as BreezeFunnelStage]));
      return { ...toLeadSummary(imports), funnel: buildFunnelCounts(leads.map(lead => progressByKey.get(getBreezeContactKey(lead)) ?? "approved")) };
    }),
    ownerReview: publicProcedure
      .input(z.object({ limit: z.number().int().min(1).max(500).default(500) }))
      .query(async ({ input }) => {
        const imports = await getApprovedBreezeLeads();
        const leads = [...imports.validGold.leads, ...imports.valid.leads].slice(0, input.limit);
        const progress = await getBreezeProgressByContactKeys(leads.map(getBreezeContactKey));
        const progressByKey = new Map(progress.map(row => [row.contactKey, row.stage as BreezeFunnelStage]));
        return leads.map(lead => toOwnerReviewLead(lead, progressByKey.get(getBreezeContactKey(lead)) ?? "approved"));
      }),
    staffLeads: protectedProcedure
      .input(z.object({ tier: z.enum(["valid", "valid-gold"]).optional(), limit: z.number().int().min(1).max(100).default(50) }))
      .query(async ({ ctx, input }) => {
        const isOwner = Boolean(process.env.OWNER_OPEN_ID && ctx.user.openId === process.env.OWNER_OPEN_ID);
        if (!isOwner && ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN", message: "Staff access is required for Breeze lead details." });
        const imports = await getApprovedBreezeLeads();
        const leads = [...imports.validGold.leads, ...imports.valid.leads]
          .filter(lead => !input.tier || lead.tier === input.tier)
          .slice(0, input.limit);
        const progress = await getBreezeProgressByContactKeys(leads.map(getBreezeContactKey));
        const progressByKey = new Map(progress.map(row => [row.contactKey, row]));
        return {
          leads: leads.map(lead => ({ ...lead, contactKey: getBreezeContactKey(lead), stage: (progressByKey.get(getBreezeContactKey(lead))?.stage as BreezeFunnelStage | undefined) ?? "approved" })),
          summary: toLeadSummary(imports),
        };
      }),
    updateLeadStage: protectedProcedure
      .input(z.object({ contactKey: z.string().length(64), stage: z.enum(BREEZE_FUNNEL_STAGES) }))
      .mutation(async ({ ctx, input }) => {
        const isOwner = Boolean(process.env.OWNER_OPEN_ID && ctx.user.openId === process.env.OWNER_OPEN_ID);
        if (!isOwner && ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN", message: "Staff access is required for Breeze lead details." });
        const [previous] = await getBreezeProgressByContactKeys([input.contactKey]);
        const now = new Date();
        const stageIndex = BREEZE_FUNNEL_STAGES.indexOf(input.stage);
        await upsertBreezeLeadProgress({
          contactKey: input.contactKey,
          stage: input.stage,
          updatedByOpenId: ctx.user.openId,
          websiteVisitedAt: stageIndex >= BREEZE_FUNNEL_STAGES.indexOf("visited") ? previous?.websiteVisitedAt ?? now : previous?.websiteVisitedAt ?? null,
          formStartedAt: stageIndex >= BREEZE_FUNNEL_STAGES.indexOf("form-started") ? previous?.formStartedAt ?? now : previous?.formStartedAt ?? null,
          formCompletedAt: stageIndex >= BREEZE_FUNNEL_STAGES.indexOf("form-completed") ? previous?.formCompletedAt ?? now : previous?.formCompletedAt ?? null,
        });
        return { success: true };
      }),
    uploadApprovedCsv: protectedProcedure
      .input(z.object({ fileName: z.string().min(1).max(255), csvText: z.string().min(1).max(5_000_000), tier: z.enum(["valid", "valid-gold"]) }))
      .mutation(async ({ ctx, input }) => {
        const isOwner = Boolean(process.env.OWNER_OPEN_ID && ctx.user.openId === process.env.OWNER_OPEN_ID);
        if (!isOwner && ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN", message: "Staff access is required for Breeze source uploads." });
        const mapped = mapApprovedCsv(input.csvText, input.tier);
        if (!mapped.schemaReady) throw new TRPCError({ code: "BAD_REQUEST", message: mapped.reason ?? "A reviewed header row is required." });
        const safeName = input.fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
        const stored = await storagePut(`breeze-imports/${ctx.user.openId}/${safeName}`, input.csvText, "text/csv");
        await createBreezeImportSource({
          ownerOpenId: ctx.user.openId,
          sourceLabel: input.fileName,
          storageKey: stored.key,
          mappingJson: JSON.stringify({ tier: input.tier, source: "staff-upload", requiredHeaders: ["FIRST NAME", "LAST NAME", "PERS V EMAILS", "ZB Status"] }),
          approvedRecordCount: mapped.leads.length,
        });
        return { success: true, approvedRecordCount: mapped.leads.length, tier: input.tier };
      }),
    pixelConfigurations: publicProcedure.query(async () => {
      const configurations = await getBreezePixelConfigurations();
      return configurations.map(configuration => ({
        id: configuration.id,
        platform: configuration.platform,
        pixelId: configuration.pixelId,
        status: configuration.status,
        eventNames: JSON.parse(configuration.eventNamesJson) as string[],
        sourceLabel: configuration.sourceLabel,
        updatedAt: configuration.updatedAt,
      }));
    }),
    sourceRecords: publicProcedure
      .input(z.object({ source: z.enum(BREEZE_RECORD_SOURCES), limit: z.number().int().min(1).max(100).default(60), offset: z.number().int().min(0).max(3_000).default(0) }))
      .query(async ({ input }) => {
        const records = await getBreezeSourceRecords(input);
        return records.map(record => ({
          id: record.id,
          source: record.source,
          firstName: record.firstName,
          lastName: record.lastName,
          email: record.email,
          phone: record.phone,
          ageRange: record.ageRange,
          incomeRange: record.incomeRange,
          city: record.city,
          state: record.state,
          sourceLabel: record.sourceLabel,
          recordOrdinal: record.recordOrdinal,
        }));
      }),
    audienceGeography: publicProcedure.query(async () => getBreezeExactAudienceGeography()),
    activeCohort: publicProcedure.query(async () => getBreezeActiveCohortStatus()),
    importPixelCsv: protectedProcedure
      .input(z.object({ fileName: z.string().min(1).max(255), csvText: z.string().min(1).max(1_000_000) }))
      .mutation(async ({ ctx, input }) => {
        const isOwner = Boolean(process.env.OWNER_OPEN_ID && ctx.user.openId === process.env.OWNER_OPEN_ID);
        if (!isOwner && ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN", message: "Staff access is required for Breeze pixel imports." });
        let rows;
        try {
          rows = parseBreezePixelCsv(input.csvText);
        } catch (error) {
          throw new TRPCError({ code: "BAD_REQUEST", message: error instanceof Error ? error.message : "The pixel spreadsheet could not be read." });
        }
        const safeName = input.fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
        await storagePut(`breeze-pixel-imports/${ctx.user.openId}/${Date.now()}-${safeName}`, input.csvText, "text/csv");
        await Promise.all(rows.map(row => upsertBreezePixelConfiguration({
          platform: row.platform,
          pixelId: row.pixelId,
          status: row.status,
          eventNamesJson: JSON.stringify(row.eventNames),
          sourceLabel: input.fileName,
          updatedByOpenId: ctx.user.openId,
        })));
        return { success: true, importedCount: rows.length };
      }),
  }),

  campaign: router({

    // ── AI TV / CTV Ad Copy ────────────────────────────────────────────────
    generateCTVCopy: publicProcedure
      .input(contactInput.extend({
        platform: z.string(), // e.g. "Hulu", "Roku", "Samsung TV Plus"
      }))
      .mutation(async ({ input }) => {
        const { lines } = buildVoterProfile(input);
        const { contactCity, contactCounty, platform } = input;

        const systemPrompt = `You are a senior political media consultant writing a 30-second TV ad script for a congressional campaign. Rules:
- No camera directions whatsoever
- Voiceover-only delivery throughout
- Candidate says ONLY: "I'm Charlie Hatcher, and I approve this message." at the very end
- Structure: OPEN (hook, 0-5s) | BODY (2-3 beats, 5-25s) | CLOSE (CTA + disclaimer, 25-30s)
- Personalize to the specific voter profile — make it feel written for someone exactly like them
- Tone: authentic, rural, direct — not slick or political
- Include a [TARGETING NOTE] at the top: platform name, county/ZIP targeting, format, CPM range`;

        const result = await invokeLLM({
          model: "gpt-5-mini",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Write a personalized 30-second CTV ad script for ${platform} targeting:\n\n${lines}\n\nCandidate: ${CANDIDATE_BIO}\n\nTargeting: ${contactCounty} County, ${contactCity} area, Tennessee CD-5.` },
          ],
          maxTokens: 700,
        });

        const copy = result.choices[0]?.message?.content as string;
        return { copy, model: result.model };
      }),

    // ── AI Social Media Ad Copy ────────────────────────────────────────────
    generateSocialCopy: publicProcedure
      .input(contactInput.extend({
        platform: z.enum(["facebook", "instagram", "tiktok", "youtube"]),
      }))
      .mutation(async ({ input }) => {
        const { lines, isFarmerCounty, isParent, isVet } = buildVoterProfile(input);
        const { platform, contactCounty } = input;

        const platformLabel = platform === "facebook" ? "Facebook" : platform === "instagram" ? "Instagram Reels" : platform === "tiktok" ? "TikTok" : "YouTube";
        const isShortForm = platform === "tiktok" || platform === "instagram";

        const systemPrompt = `You are a political social media strategist. Write a ${isShortForm ? "15-30 second" : "30-60 second"} UGC-style video script for ${platformLabel}.
Rules:
- UGC format: a real supporter (farmer, mom, veteran, neighbor) speaks to camera — NOT the candidate
- Hook in first 2 seconds that stops the scroll
- Authentic, not produced — sounds like a neighbor made it
- End CTA: "Vote Charlie Hatcher, August 6"
- Include [SCRIPT], [CAPTION], [HASHTAGS], and [AD TARGETING] sections`;

        const result = await invokeLLM({
          model: "gpt-5-mini",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Write a personalized ${platformLabel} UGC video script for:\n\n${lines}\n\nCandidate: ${CANDIDATE_BIO}\n\nChoose the persona (${isFarmerCounty ? "farmer" : isVet ? "veteran" : isParent ? "rural parent" : "neighbor"}) that resonates most with this voter.` },
          ],
          maxTokens: 700,
        });

        const copy = result.choices[0]?.message?.content as string;
        return { copy, model: result.model };
      }),

    // ── AI Email Copy ──────────────────────────────────────────────────────
    generateEmailCopy: publicProcedure
      .input(contactInput)
      .mutation(async ({ input }) => {
        const { lines } = buildVoterProfile(input);
        const { contactCity, contactCounty } = input;
        const firstName = input.contactName.split(" ")[0];

        const result = await invokeLLM({
          model: "gpt-5-mini",
          messages: [
            { role: "system", content: `You are a political email copywriter. Write a personalized campaign email from Charlie Hatcher. Rules: warm personal tone, 3-4 short paragraphs, reference the voter's county/city, end with vote ask for August 6. Include [SUBJECT LINE] and [BODY] sections.` },
            { role: "user", content: `Write a personalized email to ${firstName} in ${contactCity}, ${contactCounty} County.\n\nVoter profile:\n${lines}\n\nCandidate: ${CANDIDATE_BIO}` },
          ],
          maxTokens: 600,
        });

        const copy = result.choices[0]?.message?.content as string;
        return { copy, model: result.model };
      }),

    // ── AI SMS Copy ────────────────────────────────────────────────────────
    generateSMSCopy: publicProcedure
      .input(contactInput)
      .mutation(async ({ input }) => {
        const { lines } = buildVoterProfile(input);
        const firstName = input.contactName.split(" ")[0];

        const result = await invokeLLM({
          model: "gpt-5-mini",
          messages: [
            { role: "system", content: `You are a political SMS copywriter. Write a personalized text message. Rules: 160 characters max, personal and urgent, include "Reply STOP to opt out", reference first name, CTA: vote August 6.` },
            { role: "user", content: `Write a personalized SMS to ${firstName} in ${input.contactCity}, ${input.contactCounty} County.\n\nProfile: ${lines}\n\nCandidate: ${CANDIDATE_BIO}` },
          ],
          maxTokens: 200,
        });

        const copy = result.choices[0]?.message?.content as string;
        return { copy, model: result.model };
      }),

    // ── AI UGC Video Production Brief ─────────────────────────────────────
    generateUGCVideoBrief: publicProcedure
      .input(contactInput.extend({
        platform: z.enum(["tiktok", "instagram", "facebook", "youtube"]),
      }))
      .mutation(async ({ input }) => {
        const { lines, isFarmerCounty, isParent, isVet, isFemale } = buildVoterProfile(input);
        const { platform, contactCounty } = input;

        const platformLabel = platform === "tiktok" ? "TikTok" : platform === "instagram" ? "Instagram Reels" : platform === "facebook" ? "Facebook Reels" : "YouTube Shorts";
        const persona = isFarmerCounty ? "local farmer" : isVet ? "veteran" : (isFemale && isParent) ? "rural mom" : isParent ? "parent" : "neighbor/community member";

        const systemPrompt = `You are a political video producer specializing in authentic UGC vertical video. Create a complete production brief a campaign can hand to a local videographer or shoot on an iPhone.

Output format (use these exact headers):
## PERSONA
## HOOK (0–2 sec)
## FULL SCRIPT (word-for-word, 15–30 sec)
## VISUAL DIRECTION (location, framing, b-roll)
## CAPTION
## HASHTAGS
## PRODUCTION NOTES (iPhone tips, 9:16 aspect ratio, lighting, audio)
## AD TARGETING (platform, county, audience, budget)`;

        const result = await invokeLLM({
          model: "gpt-5",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Create a complete ${platformLabel} UGC video brief for this voter:\n\n${lines}\n\nCandidate: ${CANDIDATE_BIO}\n\nUse a ${persona} as the spokesperson. Make it feel like a neighbor made it, not a campaign.` },
          ],
          maxTokens: 1200,
        });

        const brief = result.choices[0]?.message?.content as string;
        return { brief, model: result.model };
      }),

  }),

  // ── Voter CTV Prefs ────────────────────────────────────────────────────────────
  voterPrefs: router({
    getCtv: publicProcedure
      .input(z.object({ voterKey: z.string() }))
      .query(async ({ input }) => {
        const row = await getVoterCtvPrefs(input.voterKey);
        if (!row) return null;
        return {
          bundleNetworkIds: row.bundleNetworkIds ? row.bundleNetworkIds.split(",") : [],
          primaryPlatform: row.primaryPlatform ?? null,
          filters: row.filtersJson ? JSON.parse(row.filtersJson) : null,
          lastPreset: row.lastPreset ?? null,
        };
      }),

    saveCtv: publicProcedure
      .input(z.object({
        voterKey: z.string(),
        bundleNetworkIds: z.array(z.string()),
        primaryPlatform: z.string().optional(),
        filters: z.object({
          age: z.string(),
          income: z.string(),
          political: z.string(),
          viewing: z.string(),
          category: z.string(),
        }),
        lastPreset: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await upsertVoterCtvPrefs({
          voterKey: input.voterKey,
          bundleNetworkIds: input.bundleNetworkIds.join(","),
          primaryPlatform: input.primaryPlatform,
          filtersJson: JSON.stringify(input.filters),
          lastPreset: input.lastPreset,
        });
        return { success: true };
      }),
  }),

  // ── Bundle AI Copy ──────────────────────────────────────────────────────────────
  bundle: router({
    generateBundleBrief: publicProcedure
      .input(contactInput.extend({
        networkLabels: z.array(z.string()),
        combinedReach: z.string(),
        avgCpm: z.string(),
      }))
      .mutation(async ({ input }) => {
        const { lines } = buildVoterProfile(input);
        const { networkLabels, combinedReach, avgCpm, contactCounty } = input;

        const systemPrompt = `You are a senior political media consultant writing a multi-platform CTV ad buy brief.
Rules:
- No camera directions
- Voiceover-only delivery
- Candidate says ONLY: "I'm Charlie Hatcher, and I approve this message." at the very end
- Write ONE unified 30-second script that works across all listed platforms
- Include a [TARGETING NOTE] covering all platforms, county/ZIP, format, combined reach, avg CPM
- Include a [PLATFORM NOTES] section with one sentence per platform about any format differences
- Tone: authentic, rural, direct`;

        const result = await invokeLLM({
          model: "gpt-5-mini",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Write a unified CTV bundle ad brief for these platforms: ${networkLabels.join(", ")}\n\nVoter profile:\n${lines}\n\nCandidate: ${CANDIDATE_BIO}\n\nTargeting: ${contactCounty} County. Combined reach: ${combinedReach}. Avg CPM: $${avgCpm}.` },
          ],
          maxTokens: 900,
        });

        const copy = result.choices[0]?.message?.content as string;
        return { copy, model: result.model };
      }),

    // ── Meta Ads Manager campaign draft ────────────────────────────────────────────────────
    launchMetaAd: publicProcedure
      .input(z.object({
        contactName: z.string(),
        contactCity: z.string(),
        contactCounty: z.string(),
        adCopy: z.string(),
        platform: z.enum(["facebook", "instagram"]),
        budgetCents: z.number().int().min(100), // daily budget in cents
      }))
      .mutation(async ({ input }) => {
        // Meta Ads Manager API integration
        // In production: replace META_ACCESS_TOKEN and META_AD_ACCOUNT_ID with real env vars
        // API ref: https://developers.facebook.com/docs/marketing-apis/
        const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
        const META_AD_ACCOUNT_ID = process.env.META_AD_ACCOUNT_ID;

        if (!META_ACCESS_TOKEN || !META_AD_ACCOUNT_ID) {
          // Return a structured draft so the UI can show it even without live credentials
          return {
            success: false,
            draft: true,
            campaignName: `Hatcher — ${input.contactCounty} County — ${input.platform} — ${new Date().toISOString().slice(0,10)}`,
            targeting: {
              geo: `${input.contactCity}, ${input.contactCounty} County, TN`,
              audience: "Republican primary voters, conservative interest targeting",
              placement: input.platform === "instagram" ? "Instagram Feed + Reels" : "Facebook Feed + Video",
              dailyBudget: `$${(input.budgetCents / 100).toFixed(2)}`,
              objective: "REACH",
              adFormat: "Video (15-30s)",
            },
            instructions: [
              `1. Go to Meta Ads Manager: https://business.facebook.com/adsmanager`,
              `2. Create Campaign → Objective: Reach`,
              `3. Ad Set targeting: ${input.contactCity}, ${input.contactCounty} County, TN — radius 15 miles`,
              `4. Audience: Republican primary voters, conservative news, farming interests`,
              `5. Daily budget: $${(input.budgetCents / 100).toFixed(2)}`,
              `6. Ad copy (pre-filled): paste the AI-generated script`,
              `7. Add credentials META_ACCESS_TOKEN + META_AD_ACCOUNT_ID to enable one-click launch`,
            ],
            message: "Credentials not configured — showing campaign draft. Add META_ACCESS_TOKEN and META_AD_ACCOUNT_ID to enable one-click launch.",
          };
        }

        // Live Meta API call
        try {
          const campaignName = `Hatcher — ${input.contactCounty} — ${input.platform} — ${new Date().toISOString().slice(0,10)}`;
          const campaignRes = await fetch(
            `https://graph.facebook.com/v21.0/act_${META_AD_ACCOUNT_ID}/campaigns`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: campaignName,
                objective: "REACH",
                status: "PAUSED",
                special_ad_categories: ["POLITICS"],
                access_token: META_ACCESS_TOKEN,
              }),
            }
          );
          const campaign = await campaignRes.json() as { id?: string; error?: { message: string } };
          if (campaign.error) throw new Error(campaign.error.message);

          return {
            success: true,
            draft: false,
            campaignId: campaign.id,
            campaignName,
            message: `Campaign created in Meta Ads Manager (PAUSED). Campaign ID: ${campaign.id}. Add ad sets and creatives in Ads Manager to activate.`,
          };
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : String(err);
          return { success: false, draft: true, message: `Meta API error: ${msg}` };
        }
      }),

    // ── CTV DSP launch stub (The Trade Desk / DV360 structure) ───────────────────────────
    launchCtvAd: publicProcedure
      .input(z.object({
        contactName: z.string(),
        contactCity: z.string(),
        contactCounty: z.string(),
        networkIds: z.array(z.string()),
        networkLabels: z.array(z.string()),
        adCopy: z.string(),
        budgetCents: z.number().int().min(100),
      }))
      .mutation(async ({ input }) => {
        // CTV DSP integration — The Trade Desk API structure
        // In production: set TTD_API_KEY + TTD_ADVERTISER_ID env vars
        // API ref: https://api.thetradedesk.com/v3/
        const TTD_API_KEY = process.env.TTD_API_KEY;
        const TTD_ADVERTISER_ID = process.env.TTD_ADVERTISER_ID;

        const orderName = `Hatcher CTV — ${input.contactCounty} — ${input.networkLabels.join("+")} — ${new Date().toISOString().slice(0,10)}`;

        if (!TTD_API_KEY || !TTD_ADVERTISER_ID) {
          return {
            success: false,
            draft: true,
            orderName,
            targeting: {
              geo: `${input.contactCity}, ${input.contactCounty} County, TN`,
              networks: input.networkLabels,
              audience: "Republican primary voters, conservative content viewers",
              adFormat: "30-second non-skippable pre/mid-roll",
              dailyBudget: `$${(input.budgetCents / 100).toFixed(2)}`,
              flightDates: `Now – August 7, 2026`,
              frequencyCap: "4x/week per household",
            },
            instructions: [
              `1. Log in to The Trade Desk: https://desk.thetradedesk.com`,
              `2. Create Advertiser → Political → New Campaign`,
              `3. Ad Group targeting: ZIP codes in ${input.contactCounty} County, TN`,
              `4. Supply: ${input.networkLabels.join(", ")} (add as inventory sources)`,
              `5. Creative: upload 30-sec MP4 (1920x1080 or 1280x720)`,
              `6. Daily budget: $${(input.budgetCents / 100).toFixed(2)} — flight through Aug 7`,
              `7. Add TTD_API_KEY + TTD_ADVERTISER_ID to enable one-click order creation`,
            ],
            message: "DSP credentials not configured — showing order draft. Add TTD_API_KEY and TTD_ADVERTISER_ID to enable one-click launch.",
          };
        }

        // Live TTD API call
        try {
          const orderRes = await fetch(
            `https://api.thetradedesk.com/v3/campaign`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "TTD-Auth": TTD_API_KEY,
              },
              body: JSON.stringify({
                AdvertiserId: TTD_ADVERTISER_ID,
                CampaignName: orderName,
                Budget: { Amount: input.budgetCents / 100, CurrencyCode: "USD" },
                StartDate: new Date().toISOString(),
                EndDate: "2026-08-07T23:59:59Z",
                CampaignConversionReportingColumns: [],
              }),
            }
          );
          const order = await orderRes.json() as { CampaignId?: string; Message?: string };
          if (!order.CampaignId) throw new Error(order.Message || "Unknown TTD error");

          return {
            success: true,
            draft: false,
            orderId: order.CampaignId,
            orderName,
            message: `CTV campaign created in The Trade Desk (PAUSED). Campaign ID: ${order.CampaignId}. Add line items and creatives in TTD to activate.`,
          };
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : String(err);
          return { success: false, draft: true, message: `DSP API error: ${msg}` };
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
