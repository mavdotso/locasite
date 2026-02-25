function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const convexEnv = {
  // CORS Configuration
  CLIENT_ORIGIN: requireEnv("CLIENT_ORIGIN"),

  // Application URLs
  NEXT_PUBLIC_APP_URL:
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  NEXT_PUBLIC_CONVEX_URL: requireEnv("NEXT_PUBLIC_CONVEX_URL"),
  NEXT_PUBLIC_ROOT_DOMAIN:
    process.env.NEXT_PUBLIC_ROOT_DOMAIN || "locasite.xyz",

  // Google Services
  GOOGLE_MAPS_API_KEY: requireEnv("GOOGLE_MAPS_API_KEY"),
  GOOGLE_BUSINESS_CLIENT_ID: requireEnv("GOOGLE_BUSINESS_CLIENT_ID"),
  GOOGLE_BUSINESS_CLIENT_SECRET: requireEnv("GOOGLE_BUSINESS_CLIENT_SECRET"),

  // Stripe
  STRIPE_SECRET_KEY: requireEnv("STRIPE_SECRET_KEY"),
  STRIPE_WEBHOOKS_SECRET: requireEnv("STRIPE_WEBHOOKS_SECRET"),
  STRIPE_PRICE_PROFESSIONAL: requireEnv("STRIPE_PRICE_PROFESSIONAL"),
  STRIPE_PRICE_BUSINESS: requireEnv("STRIPE_PRICE_BUSINESS"),

  // Custom Domain
  CUSTOM_DOMAIN_CNAME:
    process.env.CUSTOM_DOMAIN_CNAME || "cname.vercel-dns.com",

  // Vercel API Configuration
  VERCEL_API_TOKEN: process.env.VERCEL_API_TOKEN,
  VERCEL_PROJECT_ID: process.env.VERCEL_PROJECT_ID,

  // Convex Auth
  CONVEX_SITE_URL: process.env.CONVEX_SITE_URL || "http://localhost:3000",

  // Resend (email verification)
  RESEND_API_KEY: requireEnv("RESEND_API_KEY"),

  // Email sender
  SENDER_EMAIL: process.env.SENDER_EMAIL || "noreply@locasite.xyz",

  // Tinybird Analytics (used in HTTP endpoints)
  NEXT_PUBLIC_TINYBIRD_API_URL:
    process.env.NEXT_PUBLIC_TINYBIRD_API_URL || "https://api.tinybird.co",
  NEXT_PUBLIC_TINYBIRD_TOKEN: requireEnv("NEXT_PUBLIC_TINYBIRD_TOKEN"),
} as const;

// Type export for better type inference
export type ConvexEnv = typeof convexEnv;
