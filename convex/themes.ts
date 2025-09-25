import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";
import { getUserFromAuth } from "./lib/helpers";
import { themePresets } from "./lib/themePresets";
import {
	advancedThemeSchemaV,
	partialAdvancedThemeSchemaV,
} from "./lib/themeSchema";
import { getAuthUserId } from "@convex-dev/auth/server";

// Initialize preset themes (run once)
export const initializePresetThemes = mutation({
	handler: async (ctx) => {
		// Check if presets already exist
		const existingPresets = await ctx.db
			.query("themes")
			.withIndex("by_preset", (q) => q.eq("isPreset", true))
			.collect();

		if (existingPresets.length > 0) {
			return { message: "Preset themes already initialized" };
		}

		// Insert all preset themes
		const insertedIds = [];
		for (const preset of themePresets) {
			const id = await ctx.db.insert("themes", {
				name: preset.name,
				description: preset.description,
				isPreset: true,
				presetId: preset.id,
				config: preset.theme as Doc<"themes">["config"], // Type assertion needed due to Convex/TS differences
				userId: undefined,
				businessId: undefined,
				createdAt: Date.now(),
				updatedAt: Date.now(),
				isPublic: true,
				tags: preset.tags,
				industry: preset.industry,
			});
			insertedIds.push(id);
		}

		return { message: "Preset themes initialized", count: insertedIds.length };
	},
});

// Reinitialize preset themes (clears existing and adds all)
export const reinitializePresetThemes = mutation({
	handler: async (ctx) => {
		// Delete existing preset themes
		const existingPresets = await ctx.db
			.query("themes")
			.withIndex("by_preset", (q) => q.eq("isPreset", true))
			.collect();

		for (const preset of existingPresets) {
			await ctx.db.delete(preset._id);
		}

		// Insert all preset themes
		const insertedIds = [];
		for (const preset of themePresets) {
			const id = await ctx.db.insert("themes", {
				name: preset.name,
				description: preset.description,
				isPreset: true,
				presetId: preset.id,
				config: preset.theme as Doc<"themes">["config"], // Type assertion needed due to Convex/TS differences
				userId: undefined,
				businessId: undefined,
				createdAt: Date.now(),
				updatedAt: Date.now(),
				isPublic: true,
				tags: preset.tags,
				industry: preset.industry,
			});
			insertedIds.push(id);
		}

		return {
			message: "Preset themes reinitialized",
			count: insertedIds.length,
			deleted: existingPresets.length,
		};
	},
});

// Get all preset themes
export const getPresetThemes = query({
	handler: async (ctx) => {
		return await ctx.db
			.query("themes")
			.withIndex("by_preset", (q) => q.eq("isPreset", true))
			.collect();
	},
});

export const getPresetById = query({
	args: {
		presetId: v.string(),
	},
	handler: async (ctx, args) => {
		const theme = await ctx.db
			.query("themes")
			.withIndex("by_preset_presetId", (q) =>
				q.eq("isPreset", true).eq("presetId", args.presetId),
			)
			.first();

		return theme || null;
	},
});

// Get all public themes (presets + user-shared)
export const getPublicThemes = query({
	handler: async (ctx) => {
		return await ctx.db
			.query("themes")
			.withIndex("by_public", (q) => q.eq("isPublic", true))
			.collect();
	},
});

// Get user's custom themes
export const getUserThemes = query({
	handler: async (ctx) => {
		const userId = await getAuthUserId(ctx);
		if (!userId) return [];

		return await ctx.db
			.query("themes")
			.withIndex("by_user", (q) => q.eq("userId", userId))
			.collect();
	},
});

// Get a single theme by ID
export const getTheme = query({
	args: { themeId: v.id("themes") },
	handler: async (ctx, args) => {
		return await ctx.db.get(args.themeId);
	},
});

// Alias for getTheme for consistency with other queries
export const getById = query({
	args: { themeId: v.id("themes") },
	handler: async (ctx, args) => {
		return await ctx.db.get(args.themeId);
	},
});

// Get themes by business
export const getBusinessThemes = query({
	args: { businessId: v.id("businesses") },
	handler: async (ctx, args) => {
		return await ctx.db
			.query("themes")
			.withIndex("by_business", (q) => q.eq("businessId", args.businessId))
			.collect();
	},
});

// Create a custom theme
export const createTheme = mutation({
	args: {
		name: v.string(),
		description: v.optional(v.string()),
		config: advancedThemeSchemaV,
		businessId: v.optional(v.id("businesses")),
		isPublic: v.optional(v.boolean()),
		tags: v.optional(v.array(v.string())),
		presetId: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const user = await getUserFromAuth(ctx);

		// If businessId provided, verify ownership
		if (args.businessId) {
			const business = await ctx.db.get(args.businessId);
			if (!business || business.userId !== user._id) {
				throw new Error("Unauthorized");
			}
		}

		const themeId = await ctx.db.insert("themes", {
			name: args.name,
			description: args.description,
			isPreset: false,
			presetId: args.presetId,
			config: args.config,
			userId: user._id,
			businessId: args.businessId,
			createdAt: Date.now(),
			updatedAt: Date.now(),
			isPublic: args.isPublic ?? false,
			tags: args.tags ?? [],
			industry: undefined,
		});

		return themeId;
	},
});

// Update a theme
export const updateTheme = mutation({
	args: {
		themeId: v.id("themes"),
		name: v.optional(v.string()),
		description: v.optional(v.string()),
		config: v.optional(advancedThemeSchemaV),
		isPublic: v.optional(v.boolean()),
		tags: v.optional(v.array(v.string())),
	},
	handler: async (ctx, args) => {
		const user = await getUserFromAuth(ctx);

		const theme = await ctx.db.get(args.themeId);
		if (!theme) throw new Error("Theme not found");

		// Check ownership
		if (theme.userId !== user._id) {
			throw new Error("Unauthorized");
		}

		// Don't allow editing preset themes
		if (theme.isPreset) {
			throw new Error("Cannot edit preset themes");
		}

		const updates: Partial<Doc<"themes">> = {
			updatedAt: Date.now(),
		};

		if (args.name !== undefined) updates.name = args.name;
		if (args.description !== undefined) updates.description = args.description;
		if (args.config !== undefined) updates.config = args.config;
		if (args.isPublic !== undefined) updates.isPublic = args.isPublic;
		if (args.tags !== undefined) updates.tags = args.tags;

		await ctx.db.patch(args.themeId, updates);

		return { success: true };
	},
});

// Delete a custom theme
export const deleteTheme = mutation({
	args: { themeId: v.id("themes") },
	handler: async (ctx, args) => {
		const user = await getUserFromAuth(ctx);

		const theme = await ctx.db.get(args.themeId);
		if (!theme) throw new Error("Theme not found");

		// Check ownership
		if (theme.userId !== user._id) {
			throw new Error("Unauthorized");
		}

		// Don't allow deleting preset themes
		if (theme.isPreset) {
			throw new Error("Cannot delete preset themes");
		}

		// Check if any businesses are using this theme
		const businessesUsingTheme = await ctx.db
			.query("businesses")
			.withIndex("by_themeId", (q) => q.eq("themeId", args.themeId))
			.collect();

		if (businessesUsingTheme.length > 0) {
			throw new Error("Cannot delete theme that is in use by businesses");
		}

		await ctx.db.delete(args.themeId);

		return { success: true };
	},
});

// Apply a theme to a business
export const applyThemeToBusiness = mutation({
	args: {
		businessId: v.id("businesses"),
		themeId: v.id("themes"),
		themeOverrides: v.optional(partialAdvancedThemeSchemaV),
	},
	handler: async (ctx, args) => {
		const user = await getUserFromAuth(ctx);

		const business = await ctx.db.get(args.businessId);
		if (!business || business.userId !== user._id) {
			throw new Error("Unauthorized");
		}

		// Verify theme exists and is accessible
		const theme = await ctx.db.get(args.themeId);
		if (!theme) throw new Error("Theme not found");

		// Check if user has access to this theme
		const hasAccess =
			theme.isPublic ||
			theme.userId === user._id ||
			theme.businessId === args.businessId;

		if (!hasAccess) {
			throw new Error("No access to this theme");
		}

		if (args.businessId) {
			const targetBusiness = await ctx.db.get(args.businessId);
			if (!targetBusiness || targetBusiness.userId !== user._id) {
				throw new Error("Unauthorized");
			}
		}

		await ctx.db.patch(args.businessId, {
			themeId: args.themeId,
			themeOverrides: args.themeOverrides,
			lastEditedAt: Date.now(),
		});

		return { success: true };
	},
});

// Duplicate a theme
export const duplicateTheme = mutation({
	args: {
		themeId: v.id("themes"),
		name: v.string(),
		businessId: v.optional(v.id("businesses")),
	},
	handler: async (ctx, args) => {
		const user = await getUserFromAuth(ctx);

		const sourceTheme = await ctx.db.get(args.themeId);
		if (!sourceTheme) throw new Error("Theme not found");

		// Check if user has access to duplicate this theme
		const hasAccess = sourceTheme.isPublic || sourceTheme.userId === user._id;

		if (!hasAccess) {
			throw new Error("No access to duplicate this theme");
		}

		// Create new theme based on source
		const newThemeId = await ctx.db.insert("themes", {
			name: args.name,
			description: sourceTheme.description
				? `Copy of ${sourceTheme.description}`
				: undefined,
			isPreset: false,
			presetId: sourceTheme.presetId || sourceTheme._id,
			config: sourceTheme.config,
			userId: user._id,
			businessId: args.businessId,
			createdAt: Date.now(),
			updatedAt: Date.now(),
			isPublic: false, // New copies are private by default
			tags: sourceTheme.tags,
			industry: sourceTheme.industry,
		});

		return newThemeId;
	},
});

// Convert legacy theme to new format
export const convertLegacyTheme = mutation({
	args: { businessId: v.id("businesses") },
	handler: async (ctx, args) => {
		const user = await getUserFromAuth(ctx);

		const business = await ctx.db.get(args.businessId);
		if (!business || business.userId !== user._id) {
			throw new Error("Unauthorized");
		}

		if (!business.theme) {
			throw new Error("No legacy theme to convert");
		}

		// Find best matching preset or create custom theme
		let themeId: Id<"themes"> | undefined;

		// Try to match with a preset based on color scheme
		if (business.theme.colorScheme) {
			const presets = await ctx.db
				.query("themes")
				.withIndex("by_preset", (q) => q.eq("isPreset", true))
				.collect();

			const matchingPreset = presets.find(
				(p) => p.presetId === business.theme?.colorScheme?.toLowerCase(),
			);

			if (matchingPreset) {
				themeId = matchingPreset._id;
			}
		}

		// If no matching preset, use the modern-minimal as base
		if (!themeId) {
			const modernMinimal = await ctx.db
				.query("themes")
				.withIndex("by_preset_presetId", (q) =>
					q.eq("isPreset", true).eq("presetId", "modern-minimal"),
				)
				.first();

			if (modernMinimal) {
				themeId = modernMinimal._id;
			}
		}

		// Create theme overrides from legacy settings
		interface ThemeOverrides {
			colors?: {
				light?: {
					primary?: string;
					secondary?: string;
					accent?: string;
				};
			};
			typography?: {
				fontFamilyBase?: string;
				fontFamilyHeading?: string;
			};
		}

		const themeOverrides: ThemeOverrides = {};

		if (business.theme.primaryColor) {
			themeOverrides.colors = {
				light: {
					primary: business.theme.primaryColor,
				},
			};
		}

		if (business.theme.secondaryColor) {
			themeOverrides.colors = themeOverrides.colors || { light: {} };
			themeOverrides.colors.light = themeOverrides.colors.light || {};
			themeOverrides.colors.light.secondary = business.theme.secondaryColor;
		}

		if (business.theme.accentColor) {
			themeOverrides.colors = themeOverrides.colors || { light: {} };
			themeOverrides.colors.light = themeOverrides.colors.light || {};
			themeOverrides.colors.light.accent = business.theme.accentColor;
		}

		if (business.theme.fontFamily) {
			themeOverrides.typography = {
				fontFamilyBase: business.theme.fontFamily,
				fontFamilyHeading: business.theme.fontFamily,
			};
		}

		// Update business
		await ctx.db.patch(args.businessId, {
			themeId,
			themeOverrides:
				Object.keys(themeOverrides).length > 0 ? themeOverrides : undefined,
			lastEditedAt: Date.now(),
		});

		return { success: true, themeId };
	},
});
