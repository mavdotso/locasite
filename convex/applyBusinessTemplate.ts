import { action } from "./_generated/server";
import { v } from "convex/values";

export const applyBusinessTemplate = action({
  args: { businessId: v.id("businesses"), templateId: v.string() },
  handler: async () => {
    throw new Error("Business templates are not yet implemented");
  },
});
