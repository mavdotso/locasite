// Environment variable helpers for Convex functions
// Only includes environment variables that are actually used in Convex

export const convexEnv = {
  // CORS Configuration
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || "*",
  
  // Application URLs
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL!,
  NEXT_PUBLIC_ROOT_DOMAIN: process.env.NEXT_PUBLIC_ROOT_DOMAIN || "locasite.xyz",
  
  // Google Services
  GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY!,
  GOOGLE_BUSINESS_CLIENT_ID: process.env.GOOGLE_BUSINESS_CLIENT_ID!,
  GOOGLE_BUSINESS_CLIENT_SECRET: process.env.GOOGLE_BUSINESS_CLIENT_SECRET!,
  
  // Stripe
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY!,
  STRIPE_WEBHOOKS_SECRET: process.env.STRIPE_WEBHOOKS_SECRET!,
  STRIPE_PRICE_PROFESSIONAL: process.env.STRIPE_PRICE_PROFESSIONAL,
  STRIPE_PRICE_BUSINESS: process.env.STRIPE_PRICE_BUSINESS,
  
  // Custom Domain
  CUSTOM_DOMAIN_CNAME: process.env.CUSTOM_DOMAIN_CNAME || "cname.vercel-dns.com",
  
  // Vercel API Configuration
  VERCEL_API_TOKEN: process.env.VERCEL_API_TOKEN,
  VERCEL_PROJECT_ID: process.env.VERCEL_PROJECT_ID,
  VERCEL_TEAM_ID: process.env.VERCEL_TEAM_ID,
  
  // Convex Auth
  CONVEX_SITE_URL: process.env.CONVEX_SITE_URL || "http://localhost:3000",
  
  // Tinybird Analytics (used in HTTP endpoints)
  NEXT_PUBLIC_TINYBIRD_API_URL: process.env.NEXT_PUBLIC_TINYBIRD_API_URL || "https://api.tinybird.co",
  NEXT_PUBLIC_TINYBIRD_TOKEN: process.env.NEXT_PUBLIC_TINYBIRD_TOKEN!,
} as const;

// Type export for better type inference
export type ConvexEnv = typeof convexEnv;