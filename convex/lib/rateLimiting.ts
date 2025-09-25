import { DatabaseReader } from "../_generated/server";
import { Id } from "../_generated/dataModel";

interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
  key: string;
}

export async function checkRateLimit(
  db: DatabaseReader,
  userId: Id<"users">,
  config: RateLimitConfig,
): Promise<{ allowed: boolean; remainingAttempts: number; resetTime: number }> {
  const now = Date.now();
  const windowStart = now - config.windowMs;

  const recentClaims = await db
    .query("businessClaims")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .filter((q) => q.gte(q.field("createdAt"), windowStart))
    .collect();

  const attemptCount = recentClaims.length;
  const allowed = attemptCount < config.maxAttempts;
  const remainingAttempts = Math.max(0, config.maxAttempts - attemptCount);
  const resetTime = windowStart + config.windowMs;

  return {
    allowed,
    remainingAttempts,
    resetTime,
  };
}

export const RATE_LIMITS = {
  businessClaim: {
    maxAttempts: 5,
    windowMs: 60 * 60 * 1000,
    key: "business_claim",
  },
  emailVerification: {
    maxAttempts: 3,
    windowMs: 60 * 60 * 1000,
    key: "email_verification",
  },
  googleVerification: {
    maxAttempts: 10,
    windowMs: 60 * 60 * 1000,
    key: "google_verification",
  },
};
