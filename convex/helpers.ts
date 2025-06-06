import { Auth, GenericQueryCtx, UserIdentity } from "convex/server";
import { DataModel } from "./_generated/dataModel";
import { query } from "./_generated/server";

export async function checkUserAuth(ctx: { auth: Auth }) {
  const identity = await ctx.auth.getUserIdentity();

  console.log("IDENTITY", identity)

  if (!identity) {
    throw new Error("Unauthorized: You must be logged in");
  }

  return identity;
}

export async function getUserFromIdentity(ctx: GenericQueryCtx<DataModel>, identity: UserIdentity) {
  // Find user by email (the main identifier in our schema)
  const user = await ctx.db
    .query("users")
    .filter(q => q.eq(q.field("email"), identity.email))
    .first();

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

export const getCurrentUser = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }
    return {
      userId: identity.subject,
      name: identity.name,
      email: identity.email,
      pictureUrl: identity.pictureUrl,
    };
  },
});
