import {
	mutation,
	query,
	internalMutation,
	internalQuery,
} from "./_generated/server";
import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";
import { getUserFromAuth } from "./lib/helpers";
import { partialAdvancedThemeSchemaV } from "./lib/themeSchema";
import { internal } from "./_generated/api";
import { getThemeSuggestions } from "./lib/themeSuggestions";
import { themePresets } from "./lib/themePresets";
import { api } from "./_generated/api";

interface BusinessUpdateFields {
	isPublished?: boolean;
	publishedAt?: number;
	lastEditedAt?: number;
	draftContent?: Doc<"businesses">["draftContent"];
	name?: string;
	description?: string;
	phone?: string;
	email?: string;
	website?: string;
	hours?: string[];
	photos?: string[];
	theme?: Doc<"businesses">["theme"];
	themeOverrides?: Doc<"businesses">["themeOverrides"];
	domainId?: Id<"domains">;
}

export interface BusinessData {
	name: string;
	placeId: string;
	address: string;
	phone?: string;
	website?: string;
	hours: string[];
	rating?: number;
	reviews: Array<{
		reviewer: string;
		rating: string;
		text: string;
	}>;
	photos: string[];
	description?: string;
}

async function verifyBusinessOwnership(
	ctx: {
		db: { get: (id: Id<"businesses">) => Promise<Doc<"businesses"> | null> };
	},
	businessId: Id<"businesses">,
	userId: Id<"users">,
) {
	const business = await ctx.db.get(businessId);
	if (!business) {
		throw new Error("Business not found");
	}

	if (business.userId !== userId) {
		throw new Error("Not authorized to modify this business");
	}

	return business;
}

export const internal_createBusiness = internalMutation({
	args: {
		business: v.object({
			name: v.string(),
			placeId: v.string(),
			address: v.string(),
			phone: v.optional(v.string()),
			website: v.optional(v.string()),
			hours: v.array(v.string()),
			rating: v.optional(v.number()),
			reviews: v.array(
				v.object({
					reviewer: v.string(),
					rating: v.string(),
					text: v.string(),
				}),
			),
			photos: v.array(v.string()),
			description: v.optional(v.string()),
		}),
		userId: v.id("users"),
	},
	handler: async (ctx, args) => {

		const existingBusiness = await ctx.db
			.query("businesses")
			.withIndex("by_placeId", (q) => q.eq("placeId", args.business.placeId))
			.first();

		if (existingBusiness) {

			await ctx.db.patch(existingBusiness._id, {
				...args.business,
			});
			return existingBusiness._id;
		}

		const businessId = await ctx.db.insert("businesses", {
			...args.business,
			createdAt: Date.now(),
			userId: args.userId,
		});

		return businessId;
	},
});

export const internal_updateBusiness = internalMutation({
	args: {
		id: v.id("businesses"),
		business: v.object({
			name: v.optional(v.string()),
			description: v.optional(v.string()),
			address: v.optional(v.string()),
			phone: v.optional(v.string()),
			website: v.optional(v.string()),
			hours: v.optional(v.array(v.string())),
			theme: v.optional(
				v.object({
					colorScheme: v.optional(v.string()),
					primaryColor: v.optional(v.string()),
					secondaryColor: v.optional(v.string()),
					accentColor: v.optional(v.string()),
					fontFamily: v.optional(v.string()),
					logoUrl: v.optional(v.string()),
				}),
			),
			themeId: v.optional(v.id("themes")),
		}),
	},
	handler: async (ctx, args) => {
		const updates: Partial<typeof args.business> = { ...args.business };

		Object.keys(updates).forEach((key) => {
			if (updates[key as keyof typeof updates] === undefined) {
				delete updates[key as keyof typeof updates];
			}
		});

		if ("themeId" in updates) {
			const themeId = updates.themeId as Id<"themes">;
			const theme = await ctx.db.get(themeId);
			if (!theme) {
				throw new Error("Invalid themeId: theme not found");
			}

			if (!theme.isPreset && theme.businessId !== args.id) {
				throw new Error("Theme does not belong to this business");
			}

			if ("theme" in updates) {
				delete updates.theme;
			}
		}

		return await ctx.db.patch(args.id, updates);
	},
});

export const internal_deleteBusiness = internalMutation({
	args: { id: v.id("businesses") },
	handler: async (ctx, args) => {
		await ctx.db.delete(args.id);
		return true;
	},
});

export const internal_updateBusinessPhotos = internalMutation({
	args: {
		id: v.id("businesses"),
		photos: v.array(v.string()),
	},
	handler: async (ctx, args) => {
		return await ctx.db.patch(args.id, {
			photos: args.photos,
		});
	},
});

export const internal_updateBusinessDescription = internalMutation({
	args: {
		id: v.id("businesses"),
		description: v.string(),
	},
	handler: async (ctx, args) => {
		return await ctx.db.patch(args.id, {
			description: args.description,
		});
	},
});

export const internal_getBusinessById = internalQuery({
	args: { id: v.id("businesses") },
	handler: async (ctx, args) => {
		return await ctx.db.get(args.id);
	},
});

export const create = mutation({
	args: {
		business: v.object({
			name: v.string(),
			placeId: v.string(),
			address: v.string(),
			phone: v.optional(v.string()),
			website: v.optional(v.string()),
			hours: v.array(v.string()),
			rating: v.optional(v.number()),
			reviews: v.array(
				v.object({
					reviewer: v.string(),
					rating: v.string(),
					text: v.string(),
				}),
			),
			photos: v.array(v.string()),
			description: v.optional(v.string()),
			aiGeneratedContent: v.optional(
				v.object({
					hero: v.optional(
						v.object({
							title: v.string(),
							subtitle: v.string(),
						}),
					),
					about: v.optional(
						v.object({
							content: v.string(),
						}),
					),
					services: v.optional(
						v.object({
							title: v.string(),
							items: v.array(
								v.object({
									title: v.string(),
									description: v.string(),
								}),
							),
						}),
					),
					whyChooseUs: v.optional(
						v.object({
							title: v.string(),
							points: v.array(v.string()),
						}),
					),
					callToAction: v.optional(
						v.object({
							primary: v.string(),
							secondary: v.string(),
							urgency: v.string(),
						}),
					),
					seo: v.optional(
						v.object({
							metaTitle: v.string(),
							metaDescription: v.string(),
							keywords: v.array(v.string()),
						}),
					),
					testimonials: v.optional(
						v.object({
							title: v.string(),
							items: v.array(
								v.object({
									name: v.string(),
									text: v.string(),
									rating: v.number(),
									role: v.optional(v.string()),
									location: v.optional(v.string()),
									date: v.optional(v.string()),
								}),
							),
						}),
					),
				}),
			),
		}),
	},
	handler: async (ctx, args) => {
		const user = await getUserFromAuth(ctx);

		const businessId = await ctx.db.insert("businesses", {
			...args.business,
			createdAt: Date.now(),
			userId: user._id,
			isPublished: false, // Default to unpublished
		});

		return businessId;
	},
});

export const getById = query({
	args: { id: v.id("businesses") },
	handler: async (ctx, args) => {
		const user = await getUserFromAuth(ctx);
		const business = await ctx.db.get(args.id);

		if (!business) {
			throw new Error("Business not found");
		}

		// Check if the user owns this business
		if (business.userId !== user._id) {
			throw new Error("Unauthorized: You don't have access to this business");
		}

		// Return business without sensitive fields
		const { googleBusinessAuth, ...sanitizedBusiness } = business;
		return sanitizedBusiness;
	},
});

export const getBusinessPublic = query({
	args: { businessId: v.id("businesses") },
	handler: async (ctx, args) => {
		const business = await ctx.db.get(args.businessId);
		if (!business) return null;

		const { ...publicData } = business;

		return publicData;
	},
});

export const getByPlaceId = query({
	args: { placeId: v.string() },
	handler: async (ctx, args) => {
		return await ctx.db
			.query("businesses")
			.withIndex("by_placeId", (q) => q.eq("placeId", args.placeId))
			.first();
	},
});

export const list = query({
	args: {
		limit: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		return await ctx.db
			.query("businesses")
			.withIndex("by_createdAt")
			.order("desc")
			.take(args.limit || 100);
	},
});

export const listByUser = query({
	args: { userId: v.id("users") },
	handler: async (ctx, args) => {
		const user = await getUserFromAuth(ctx);

		// Only allow users to list their own businesses
		if (user._id !== args.userId) {
			throw new Error("Unauthorized: You can only view your own businesses");
		}

		return await ctx.db
			.query("businesses")
			.withIndex("by_userId", (q) => q.eq("userId", args.userId))
			.order("desc")
			.collect();
	},
});

export const associateWithDomain = mutation({
	args: {
		businessId: v.id("businesses"),
		domainId: v.id("domains"),
	},
	handler: async (ctx, args) => {
		const user = await getUserFromAuth(ctx);

		await verifyBusinessOwnership(ctx, args.businessId, user._id);

		return await ctx.db.patch(args.businessId, {
			domainId: args.domainId,
		});
	},
});

export const remove = mutation({
	args: { id: v.id("businesses") },
	handler: async (ctx, args) => {
		const user = await getUserFromAuth(ctx);

		await verifyBusinessOwnership(ctx, args.id, user._id);

		await ctx.db.delete(args.id);
	},
});

export const listByDomain = query({
	args: { domain: v.id("domains") },
	handler: async (ctx, args) => {
		return await ctx.db
			.query("businesses")
			.withIndex("by_domainId", (q) => q.eq("domainId", args.domain))
			.collect();
	},
});

export const getByDomainId = query({
	args: { domainId: v.id("domains") },
	handler: async (ctx, args) => {
		return await ctx.db
			.query("businesses")
			.withIndex("by_domainId", (q) => q.eq("domainId", args.domainId))
			.first();
	},
});

export const updateGoogleBusinessAuth = mutation({
	args: {
		businessId: v.id("businesses"),
		googleBusinessAuth: v.object({
			accessToken: v.string(),
			refreshToken: v.string(),
			expiresAt: v.number(),
			accounts: v.array(
				v.object({
					accountId: v.string(),
					accountName: v.string(),
					type: v.string(),
					verificationState: v.optional(v.string()),
				}),
			),
		}),
	},
	handler: async (ctx, args) => {
		const user = await getUserFromAuth(ctx);

		await verifyBusinessOwnership(ctx, args.businessId, user._id);

		return await ctx.db.patch(args.businessId, {
			googleBusinessAuth: {
				...args.googleBusinessAuth,
				verificationStatus: "unverified",
			},
		});
	},
});

export const update = mutation({
	args: {
		id: v.id("businesses"),
		business: v.object({
			name: v.optional(v.string()),
			description: v.optional(v.string()),
			address: v.optional(v.string()),
			phone: v.optional(v.string()),
			website: v.optional(v.string()),
			hours: v.optional(v.array(v.string())),
			theme: v.optional(
				v.object({
					colorScheme: v.optional(v.string()),
					primaryColor: v.optional(v.string()),
					secondaryColor: v.optional(v.string()),
					accentColor: v.optional(v.string()),
					fontFamily: v.optional(v.string()),
					logoUrl: v.optional(v.string()),
				}),
			),
			themeOverrides: v.optional(partialAdvancedThemeSchemaV),
			lastEditedAt: v.optional(v.number()),
			aiGeneratedContent: v.optional(
				v.object({
					hero: v.optional(
						v.object({
							title: v.string(),
							subtitle: v.string(),
						}),
					),
					about: v.optional(
						v.object({
							content: v.string(),
						}),
					),
					services: v.optional(
						v.object({
							title: v.string(),
							items: v.array(
								v.object({
									title: v.string(),
									description: v.string(),
								}),
							),
						}),
					),
					whyChooseUs: v.optional(
						v.object({
							title: v.string(),
							points: v.array(v.string()),
						}),
					),
					callToAction: v.optional(
						v.object({
							primary: v.string(),
							secondary: v.string(),
							urgency: v.string(),
						}),
					),
					seo: v.optional(
						v.object({
							metaTitle: v.string(),
							metaDescription: v.string(),
							keywords: v.array(v.string()),
						}),
					),
					testimonials: v.optional(
						v.object({
							title: v.string(),
							items: v.array(
								v.object({
									name: v.string(),
									text: v.string(),
									rating: v.number(),
									role: v.optional(v.string()),
									location: v.optional(v.string()),
									date: v.optional(v.string()),
								}),
							),
						}),
					),
				}),
			),
		}),
	},
	handler: async (ctx, args) => {
		const user = await getUserFromAuth(ctx);

		await verifyBusinessOwnership(ctx, args.id, user._id);

		const updates = { ...args.business };
		Object.keys(updates).forEach((key) => {
			if (updates[key as keyof typeof updates] === undefined) {
				delete updates[key as keyof typeof updates];
			}
		});
		return await ctx.db.patch(args.id, updates);
	},
});

export const updatePhotos = mutation({
	args: {
		id: v.id("businesses"),
		photos: v.array(v.string()),
	},
	handler: async (ctx, args) => {
		const user = await getUserFromAuth(ctx);

		await verifyBusinessOwnership(ctx, args.id, user._id);

		return await ctx.db.patch(args.id, {
			photos: args.photos,
		});
	},
});

export const updateBusinessDescription = mutation({
	args: {
		businessId: v.id("businesses"),
		description: v.string(),
	},
	handler: async (ctx, args) => {
		const user = await getUserFromAuth(ctx);

		await verifyBusinessOwnership(ctx, args.businessId, user._id);

		return await ctx.db.patch(args.businessId, {
			description: args.description,
		});
	},
});

export const createBusinessWithoutAuth = internalMutation({
	args: {
		businessData: v.object({
			name: v.string(),
			placeId: v.string(),
			address: v.string(),
			phone: v.optional(v.string()),
			website: v.optional(v.string()),
			hours: v.array(v.string()),
			rating: v.optional(v.number()),
			reviews: v.array(
				v.object({
					reviewer: v.string(),
					rating: v.string(),
					text: v.string(),
				}),
			),
			photos: v.array(v.string()),
			description: v.optional(v.string()),
		}),
	},
	handler: async (ctx, args) => {

		const existingBusiness = await ctx.db
			.query("businesses")
			.withIndex("by_placeId", (q) =>
				q.eq("placeId", args.businessData.placeId),
			)
			.first();

		if (existingBusiness) {

			return {
				businessId: existingBusiness._id,
				domainId: existingBusiness.domainId,
			};
		}

		const subdomain = args.businessData.name
			.toLowerCase()
			.replace(/[^a-z0-9-]/g, "-")
			.replace(/-+/g, "-")
			.replace(/^-|-$/g, "")
			.substring(0, 63);

		const domainId = await ctx.db.insert("domains", {
			name: args.businessData.name,
			subdomain,
			createdAt: Date.now(),
		});

		const businessId = await ctx.db.insert("businesses", {
			...args.businessData,
			domainId,
			createdAt: Date.now(),

			isPublished: false,
		});

		const sections = [

			{
				id: "header-1",
				variationId: "header-section",
				order: 0,
				data: {
					id: "header",
					type: "header-section",
					content: {
						businessName: args.businessData.name,
						logo: args.businessData.name,
						logoAlt: args.businessData.name,
						menuItems: [
							{ label: "Home", link: "#hero" },
							{ label: "About", link: "#about" },
							{ label: "Services", link: "#services" },
							{ label: "Gallery", link: "#gallery" },
							{ label: "Contact", link: "#contact" },
						],
						showButton: true,
						buttonText: "Get Started",
						buttonLink: "#contact",
					},
					style: {
						backgroundColor: "#FFFFFF",
						textColor: "#000000",
						sticky: true,
					},
				},
			},

			{
				id: "hero-1",
				variationId: "hero-center-bg",
				order: 1,
				data: {
					id: "hero",
					type: "hero-section",
					content: {
						title: args.businessData.name,
						subtitle:
							args.businessData.description ||
							"Welcome to our business. We're here to serve you with excellence.",
						ctaButton: {
							label: "Contact Us",
							href: "#contact",
						},
						backgroundImage: args.businessData.photos?.[0] || "",
					},
					style: {
						backgroundColor: "#1F2937",
						overlay: true,
						overlayOpacity: 0.5,
					},
				},
			},

			{
				id: "about-1",
				variationId: "about-text-image",
				order: 2,
				data: {
					id: "about",
					type: "about-section",
					content: {
						title: `About ${args.businessData.name}`,
						description:
							args.businessData.description ||
							"We are dedicated to providing exceptional service and quality to our customers.",
						image: args.businessData.photos?.[1] || "",
						features: [
							"Professional Service",
							"Quality Guaranteed",
							"Customer Satisfaction",
						],
					},
					style: {
						backgroundColor: "#FFFFFF",
					},
				},
			},

			{
				id: "gallery-1",
				variationId: "gallery-grid",
				order: 3,
				data: {
					id: "gallery",
					type: "gallery-grid",
					content: {
						title: "Gallery",
						subtitle: "Take a look at our work",
						images:
							args.businessData.photos?.slice(0, 6).map((photo, index) => ({
								src: photo,
								alt: `${args.businessData.name} image ${index + 1}`,
							})) || [],
						columns: 3,
					},
					style: {
						backgroundColor: "#FFFFFF",
					},
				},
			},

			{
				id: "contact-1",
				variationId: "contact-form-map",
				order: 4,
				data: {
					id: "contact",
					type: "contact-form-map",
					content: {
						title: "Get in Touch",
						subtitle: "We'd love to hear from you",
						address: args.businessData.address,
						phone: args.businessData.phone,
						email: "",
						hours: args.businessData.hours,
						mapUrl: `https://maps.google.com/?q=${encodeURIComponent(args.businessData.address)}`,
						showMap: true,
						showForm: true,
					},
					style: {
						backgroundColor: "#F0F7FF",
					},
				},
			},
		];

		const pageData = {
			mode: "simple",
			title: args.businessData.name || "Welcome",
			sections,
			theme: {
				colors: {
					primary: "#3B82F6",
					secondary: "#10B981",
					accent: "#F59E0B",
					background: "#FFFFFF",
					text: "#1F2937",
					muted: "#F3F4F6",
				},
				fonts: {
					heading: "Inter",
					body: "Inter",
				},
				spacing: {
					sectionPadding: "80px",
				},
			},
		};

		await ctx.db.insert("pages", {
			domainId,
			content: JSON.stringify(pageData),
			isPublished: false,
			lastEditedAt: Date.now(),
		});

		return { businessId, domainId };
	},
});

export const claimBusinessAfterAuth = mutation({
	args: {
		businessId: v.id("businesses"),
	},
	handler: async (ctx, args) => {
		const user = await getUserFromAuth(ctx);

		const business = await ctx.db.get(args.businessId);
		if (!business) {
			throw new Error("Business not found");
		}

		if (business.userId && business.userId !== user._id) {
			throw new Error("Business already claimed by another user");
		}

		if (business.userId === user._id) {
			return { businessId: args.businessId, alreadyClaimed: true };
		}

		await ctx.db.patch(args.businessId, {
			userId: user._id,
		});

		await ctx.scheduler.runAfter(
			0,
			internal.storeBusinessImages.internalStoreBusinessImages,
			{
				businessId: args.businessId,
			},
		);

		return { businessId: args.businessId, alreadyClaimed: false };
	},
});

export const createFromPreview = mutation({
	args: {
		businessData: v.object({
			name: v.string(),
			placeId: v.string(),
			address: v.string(),
			phone: v.optional(v.string()),
			website: v.optional(v.string()),
			hours: v.array(v.string()),
			rating: v.optional(v.number()),
			reviews: v.array(
				v.object({
					reviewer: v.string(),
					rating: v.string(),
					text: v.string(),
				}),
			),
			photos: v.array(v.string()),
			description: v.optional(v.string()),
		}),
	},
	handler: async (ctx, args) => {
		const user = await getUserFromAuth(ctx);

		const existingBusiness = await ctx.db
			.query("businesses")
			.withIndex("by_placeId_userId", (q) =>
				q.eq("placeId", args.businessData.placeId).eq("userId", user._id),
			)
			.first();

		if (existingBusiness) {

			return { businessId: existingBusiness._id };
		}

		const businessId = await ctx.db.insert("businesses", {
			...args.businessData,
			createdAt: Date.now(),
			userId: user._id,
			isPublished: false, // Start as unpublished
		});

		await ctx.scheduler.runAfter(
			0,
			internal.storeBusinessImages.internalStoreBusinessImages,
			{
				businessId,
			},
		);

		return { businessId };
	},
});

export const saveDraft = mutation({
	args: {
		businessId: v.id("businesses"),
		draftContent: v.object({
			name: v.optional(v.string()),
			description: v.optional(v.string()),
			phone: v.optional(v.string()),
			email: v.optional(v.string()),
			website: v.optional(v.string()),
			hours: v.optional(v.array(v.string())),
			theme: v.optional(
				v.object({
					colorScheme: v.optional(v.string()),
					primaryColor: v.optional(v.string()),
					secondaryColor: v.optional(v.string()),
					accentColor: v.optional(v.string()),
					fontFamily: v.optional(v.string()),
					logoUrl: v.optional(v.string()),
				}),
			),
		}),
	},
	handler: async (ctx, args) => {
		const user = await getUserFromAuth(ctx);

		await verifyBusinessOwnership(ctx, args.businessId, user._id);

		return await ctx.db.patch(args.businessId, {
			draftContent: args.draftContent,
			lastEditedAt: Date.now(),
		});
	},
});

export const publishDraft = mutation({
	args: {
		businessId: v.id("businesses"),
	},
	handler: async (ctx, args) => {
		const user = await getUserFromAuth(ctx);

		const business = await verifyBusinessOwnership(
			ctx,
			args.businessId,
			user._id,
		);

		if (!business.draftContent) {
			throw new Error("No draft content to publish");
		}

		const updates: BusinessUpdateFields = {
			isPublished: true,
			publishedAt: Date.now(),
			lastEditedAt: Date.now(),
			draftContent: undefined, // Clear draft after publishing
		};

		if (business.draftContent.name) updates.name = business.draftContent.name;
		if (business.draftContent.description)
			updates.description = business.draftContent.description;
		if (business.draftContent.phone)
			updates.phone = business.draftContent.phone;
		if (business.draftContent.email)
			updates.email = business.draftContent.email;
		if (business.draftContent.website)
			updates.website = business.draftContent.website;
		if (business.draftContent.hours)
			updates.hours = business.draftContent.hours;
		if (business.draftContent.theme)
			updates.theme = business.draftContent.theme;

		return await ctx.db.patch(args.businessId, updates);
	},
});

export const discardDraft = mutation({
	args: {
		businessId: v.id("businesses"),
	},
	handler: async (ctx, args) => {
		const user = await getUserFromAuth(ctx);

		await verifyBusinessOwnership(ctx, args.businessId, user._id);

		return await ctx.db.patch(args.businessId, {
			draftContent: undefined,
		});
	},
});

export const getByIdWithDraft = query({
	args: { id: v.id("businesses") },
	handler: async (ctx, args) => {
		const business = await ctx.db.get(args.id);
		if (!business) return null;

		if (business.draftContent) {
			return {
				...business,

				name: business.draftContent.name || business.name,
				description: business.draftContent.description || business.description,
				phone:
					business.draftContent.phone !== undefined
						? business.draftContent.phone
						: business.phone,
				email:
					business.draftContent.email !== undefined
						? business.draftContent.email
						: business.email,
				website:
					business.draftContent.website !== undefined
						? business.draftContent.website
						: business.website,
				hours: business.draftContent.hours || business.hours,
				theme: business.draftContent.theme || business.theme,
				hasDraft: true,
			};
		}

		return { ...business, hasDraft: false };
	},
});

export const createBusinessFromPendingData = mutation({
	args: {
		businessData: v.object({
			name: v.string(),
			placeId: v.string(),
			address: v.string(),
			phone: v.optional(v.string()),
			website: v.optional(v.string()),
			hours: v.array(v.string()),
			rating: v.optional(v.number()),
			reviews: v.array(
				v.object({
					reviewer: v.string(),
					rating: v.string(),
					text: v.string(),
				}),
			),
			photos: v.array(v.string()),
			description: v.optional(v.string()),
			category: v.optional(v.string()),
		}),
		aiContent: v.optional(
			v.union(
				v.null(),
				v.object({
					hero: v.optional(
						v.object({
							title: v.string(),
							subtitle: v.string(),
						}),
					),
					about: v.optional(
						v.object({
							content: v.string(),
						}),
					),
					services: v.optional(
						v.object({
							title: v.string(),
							items: v.array(
								v.object({
									title: v.string(),
									description: v.string(),
								}),
							),
						}),
					),
					whyChooseUs: v.optional(
						v.object({
							title: v.string(),
							points: v.array(v.string()),
						}),
					),
					callToAction: v.optional(
						v.object({
							primary: v.string(),
							secondary: v.string(),
							urgency: v.string(),
						}),
					),
					seo: v.optional(
						v.object({
							metaTitle: v.string(),
							metaDescription: v.string(),
							keywords: v.array(v.string()),
						}),
					),
				}),
			),
		),
		generateAIContent: v.optional(v.boolean()),
		applyTemplate: v.optional(v.boolean()),
	},
	handler: async (
		ctx,
		args,
	): Promise<{ businessId: Id<"businesses">; domainId: Id<"domains"> }> => {
		const user = await getUserFromAuth(ctx);

		const { category, ...businessDataWithoutCategory } = args.businessData;

		const businessId = await ctx.db.insert("businesses", {
			...businessDataWithoutCategory,
			...(args.aiContent &&
				args.aiContent !== null && { aiGeneratedContent: args.aiContent }),
			createdAt: Date.now(),
			userId: user._id,
			domainId: undefined, // Will be set when domain is created
			isPublished: false, // Keep as draft until user publishes
			publishedAt: undefined,
		});

		const { domainId } = await ctx.runMutation(api.domains.generateSubdomain, {
			businessId,
		});

		const businessWithDomain = await ctx.db.get(businessId);
		if (!businessWithDomain?.domainId) {
			await ctx.db.patch(businessId, { domainId });
		}

		const themeSuggestions = getThemeSuggestions(category, 1);
		const selectedThemeId = themeSuggestions[0] || "modern-minimal";

		const themePreset = themePresets.find(
			(preset) => preset.id === selectedThemeId,
		);
		if (themePreset) {
			const themeId = await ctx.db.insert("themes", {
				name: `${args.businessData.name} Theme`,
				description: `Theme for ${args.businessData.name}`,
				isPreset: false,
				presetId: selectedThemeId,
				config: themePreset.theme,
				userId: user._id,
				businessId,
				createdAt: Date.now(),
				updatedAt: Date.now(),
				isPublic: false,
				tags: themePreset.tags || [],
				industry: category || themePreset.industry,
			});

			await ctx.db.patch(businessId, {
				themeId,
			});
		}

		if (args.businessData.photos && args.businessData.photos.length > 0) {
			await ctx.scheduler.runAfter(
				0,
				api.uploadBusinessImages.uploadGoogleMapsImages,
				{
					businessId,
					imageUrls: args.businessData.photos,
				},
			);
		}

		return { businessId, domainId };
	},
});

export const deleteBusiness = mutation({
	args: {
		businessId: v.id("businesses"),
	},
	handler: async (ctx, args) => {
		const user = await getUserFromAuth(ctx);

		const business = await verifyBusinessOwnership(
			ctx,
			args.businessId,
			user._id,
		);

		if (business.domainId) {
			await ctx.db.delete(business.domainId);
		}

		if (business.themeId) {
			const theme = await ctx.db.get(business.themeId);
			if (theme && !theme.isPreset) {
				await ctx.db.delete(business.themeId);
			}
		}

		const pages = await ctx.db
			.query("pages")
			.withIndex("by_domain", (q) => q.eq("domainId", business.domainId!))
			.collect();

		for (const page of pages) {
			await ctx.db.delete(page._id);
		}

		const messages = await ctx.db
			.query("contactMessages")
			.withIndex("by_business", (q) => q.eq("businessId", args.businessId))
			.collect();

		for (const message of messages) {
			await ctx.db.delete(message._id);
		}

		const mediaItems = await ctx.db
			.query("mediaLibrary")
			.withIndex("by_business", (q) => q.eq("businessId", args.businessId))
			.collect();
		for (const item of mediaItems) {

			if (item.storageId) {
				await ctx.storage.delete(item.storageId);
			}
			await ctx.db.delete(item._id);
		}

		if (business.faviconStorageId) {
			await ctx.storage.delete(business.faviconStorageId);
		}

		if (business.ogImageStorageId) {
			await ctx.storage.delete(business.ogImageStorageId);
		}

		await ctx.db.delete(args.businessId);

		return { success: true };
	},
});
