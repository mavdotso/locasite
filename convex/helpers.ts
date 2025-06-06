import { getAuthUserId } from "@convex-dev/auth/server";
import { query } from "./_generated/server";

export async function checkUserAuth(ctx: any) {
  const userId = await getAuthUserId(ctx);

  if (!userId) {
    throw new Error("Unauthorized: You must be logged in");
  }

  return userId;
}

export async function getUserFromAuth(ctx: any) {
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
