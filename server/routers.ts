import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { invokeLLM } from "./_core/llm";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
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
});

export type AppRouter = typeof appRouter;
