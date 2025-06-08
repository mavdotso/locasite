import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";
import { getUserFromAuth } from "./helpers";

// Export a theme to JSON format
export const exportTheme = query({
  args: { themeId: v.id("themes") },
  handler: async (ctx, args) => {
    const theme = await ctx.db.get(args.themeId);
    if (!theme) throw new Error("Theme not found");
    
    // Create export object without internal IDs
    const exportData = {
      name: theme.name,
      description: theme.description,
      config: theme.config,
      tags: theme.tags,
      industry: theme.industry,
      exportedAt: new Date().toISOString(),
      version: "1.0.0",
    };
    
    return exportData;
  },
});

// Import a theme from JSON
export const importTheme = mutation({
  args: {
    themeData: v.string(), // JSON string
    businessId: v.optional(v.id("businesses")),
  },
  handler: async (ctx, args) => {
    const user = await getUserFromAuth(ctx);
    
    try {
      const importData = JSON.parse(args.themeData);
      
      // Validate the imported data has required fields
      if (!importData.name || !importData.config) {
        throw new Error("Invalid theme data: missing required fields");
      }
      
      // Create new theme from imported data
      const themeId = await ctx.db.insert("themes", {
        name: `${importData.name} (Imported)`,
        description: importData.description || `Imported on ${new Date().toLocaleDateString()}`,
        isPreset: false,
        presetId: undefined,
        config: importData.config,
        userId: user._id,
        businessId: args.businessId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        isPublic: false,
        tags: importData.tags || [],
        industry: importData.industry,
      });
      
      return { success: true, themeId };
    } catch (error) {
      throw new Error(`Failed to import theme: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
});

// Clone a theme with modifications
export const cloneTheme = mutation({
  args: {
    sourceThemeId: v.id("themes"),
    name: v.string(),
    modifications: v.optional(v.any()),
    businessId: v.optional(v.id("businesses")),
  },
  handler: async (ctx, args) => {
    const user = await getUserFromAuth(ctx);
    
    const sourceTheme = await ctx.db.get(args.sourceThemeId);
    if (!sourceTheme) throw new Error("Source theme not found");
    
    // Check access to source theme
    const hasAccess = sourceTheme.isPublic || 
                     sourceTheme.userId === user._id ||
                     (args.businessId && sourceTheme.businessId === args.businessId);
    
    if (!hasAccess) {
      throw new Error("No access to clone this theme");
    }
    
    // Merge modifications with source config
    let finalConfig = sourceTheme.config;
    if (args.modifications) {
      finalConfig = deepMerge(sourceTheme.config as any, args.modifications);
    }
    
    const themeId = await ctx.db.insert("themes", {
      name: args.name,
      description: `Cloned from ${sourceTheme.name}`,
      isPreset: false,
      presetId: sourceTheme.presetId || sourceTheme._id,
      config: finalConfig,
      userId: user._id,
      businessId: args.businessId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isPublic: false,
      tags: sourceTheme.tags,
      industry: sourceTheme.industry,
    });
    
    return themeId;
  },
});

// Helper function for deep merging objects
function deepMerge(target: any, source: any): any {
  const result = { ...target };
  
  for (const key in source) {
    if (source[key] !== undefined) {
      if (
        typeof source[key] === "object" &&
        source[key] !== null &&
        !Array.isArray(source[key])
      ) {
        result[key] = deepMerge(result[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
  }
  
  return result;
}