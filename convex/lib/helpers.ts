import { getAuthUserId } from "@convex-dev/auth/server";
import { query, QueryCtx } from "../_generated/server";

export async function checkUserAuth(ctx: QueryCtx) {
  const userId = await getAuthUserId(ctx);

  if (!userId) {
    throw new Error("Unauthorized: You must be logged in");
  }

  return userId;
}

export async function getUserFromAuth(ctx: QueryCtx) {
  const userId = await getAuthUserId(ctx);

  if (!userId) {
    throw new Error("Unauthorized: You must be logged in");
  }

  const user = await ctx.db.get(userId);

  if (!user) {
    throw new Error("User not found. Please try signing in again.");
  }

  return user;
}

// Strip API keys from Google Places photo URLs before sending to clients.
// Photos are stored with API-key URLs temporarily until the upload action
// replaces them with Convex storage URLs. This ensures keys never leak.
export function sanitizePhotos(photos: string[]): string[] {
  return photos.map((url) => {
    if (url.includes("maps.googleapis.com") && url.includes("key=")) {
      return url.replace(/&key=[^&]+/, "");
    }
    return url;
  });
}

// Query to get current user info for frontend components
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      return null;
    }

    const user = await ctx.db.get(userId);

    if (!user) {
      return null;
    }

    return {
      userId: user._id,
      name: user.name,
      email: user.email
    };
  }
});
