import { GenericQueryCtx, UserIdentity } from "convex/server";
import { DataModel } from "./_generated/dataModel";

export async function checkUserAuth(ctx: GenericQueryCtx<DataModel>) {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) {
    throw new Error("Unauthorized: You must be logged in");
  }

  return identity;
}

export async function getUserFromIdentity(ctx: GenericQueryCtx<DataModel>, identity: UserIdentity) {
  const user = await ctx.db
    .query("users")
    .filter(q => q.eq(q.field("email"), identity.email))
    .first();

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}