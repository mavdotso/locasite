import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here.
   * This way you can ensure the app isn't built with invalid env vars.
   */
  server: {
    // Vercel API Configuration
    VERCEL_API_TOKEN: z.string().optional(),
    VERCEL_PROJECT_ID: z.string().optional(),
    VERCEL_TEAM_ID: z.string().optional(),

    // Google Site Verification
    GOOGLE_SITE_VERIFICATION: z.string().optional(),

    // Tinybird Analytics (server-side write token)
    TINYBIRD_WRITE_TOKEN: z.string().optional(),

    // Node Environment
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
  },

  /**
   * Specify your client-side environment variables schema here.
   * This way you can ensure the app isn't built with invalid env vars.
   * To expose them to the client, prefix them with `NEXT_PUBLIC_`.
   */
  client: {
    // Convex
    NEXT_PUBLIC_CONVEX_URL: z.string().url(),

    // Application Configuration
    NEXT_PUBLIC_ROOT_DOMAIN: z.string().default("locasite.xyz"),
    NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
    NEXT_PUBLIC_VERCEL_DEPLOYMENT_SUFFIX: z.string().default("vercel.app"),

    // Google Services (Client)
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: z.string().optional(),
    NEXT_PUBLIC_GOOGLE_BUSINESS_CLIENT_ID: z.string(),

    // Tinybird Analytics
    NEXT_PUBLIC_TINYBIRD_API_URL: z
      .string()
      .url()
      .default("https://api.tinybird.co"),
    NEXT_PUBLIC_TINYBIRD_TOKEN: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    // Server
    VERCEL_API_TOKEN: process.env.VERCEL_API_TOKEN,
    VERCEL_PROJECT_ID: process.env.VERCEL_PROJECT_ID,
    VERCEL_TEAM_ID: process.env.VERCEL_TEAM_ID,
    GOOGLE_SITE_VERIFICATION: process.env.GOOGLE_SITE_VERIFICATION,
    TINYBIRD_WRITE_TOKEN: process.env.TINYBIRD_WRITE_TOKEN,
    NODE_ENV: process.env.NODE_ENV,

    // Client
    NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
    NEXT_PUBLIC_ROOT_DOMAIN: process.env.NEXT_PUBLIC_ROOT_DOMAIN,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_VERCEL_DEPLOYMENT_SUFFIX:
      process.env.NEXT_PUBLIC_VERCEL_DEPLOYMENT_SUFFIX,
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY:
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    NEXT_PUBLIC_GOOGLE_BUSINESS_CLIENT_ID:
      process.env.NEXT_PUBLIC_GOOGLE_BUSINESS_CLIENT_ID,
    NEXT_PUBLIC_TINYBIRD_API_URL: process.env.NEXT_PUBLIC_TINYBIRD_API_URL,
    NEXT_PUBLIC_TINYBIRD_TOKEN: process.env.NEXT_PUBLIC_TINYBIRD_TOKEN,
  },

  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
   * This is especially useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,

  /**
   * Makes it so that empty strings are treated as undefined.
   * `SOME_VAR: z.string()` and `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
