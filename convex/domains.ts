import { v } from "convex/values";
import { query, mutation, internalMutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { getUserFromAuth } from "./lib/helpers";
import { convexEnv } from "./lib/env";
import { validateSubdomain } from "./lib/subdomainUtils";

function toUrlFriendly(input: string, maxLength: number = 30): string {
	if (!input) return "";

	return input
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[^a-z0-9]/g, "-")
		.replace(/--/g, "-")
		.replace(/^-|-$/g, "")
		.substring(0, maxLength)
		.replace(/-$/, "");
}

export const getByBusinessId = query({
	args: { businessId: v.id("businesses") },
	handler: async (ctx, args) => {
		const business = await ctx.db.get(args.businessId);
		if (!business?.domainId) return null;
		return await ctx.db.get(business.domainId);
	},
});

export const internal_createDomain = internalMutation({
	args: {
		name: v.string(),
		subdomain: v.string(),
	},
	handler: async (ctx, args) => {
		return await ctx.db.insert("domains", {
			name: args.name,
			subdomain: args.subdomain,
			createdAt: Date.now(),
		});
	},
});

export const generateSubdomain = mutation({
	args: {
		businessId: v.id("businesses"),
		customSubdomain: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const user = await getUserFromAuth(ctx);

		const business = await ctx.db.get(args.businessId);
		if (!business) {
			throw new Error("Business not found");
		}

		if (business.userId !== user._id) {
			throw new Error("Not authorized to create domain for this business");
		}

		let baseSubdomain: string;
		if (args.customSubdomain) {
			baseSubdomain = toUrlFriendly(args.customSubdomain);

			const validation = validateSubdomain(baseSubdomain);
			if (!validation.valid) {
				throw new Error(validation.error || "Invalid subdomain format");
			}
		} else {
			baseSubdomain = toUrlFriendly(business.name);

			if (!baseSubdomain || baseSubdomain.length < 3) {
				baseSubdomain = `business-${Math.floor(Math.random() * 10000)}`;
			}
		}

		const {
			generateAndReserveUniqueSubdomain,
			confirmReservation,
			releaseReservation,
		} = await import("./lib/subdomainReservation");

		const reservation = await generateAndReserveUniqueSubdomain(
			ctx,
			baseSubdomain,
		);

		if (!reservation) {
			throw new Error(
				"Failed to reserve a unique subdomain. Please try again.",
			);
		}

		let domainId: Id<"domains"> | null = null;

		try {
			domainId = await ctx.db.insert("domains", {
				name: business.name,
				subdomain: reservation.subdomain,
				createdAt: Date.now(),
			});

			await confirmReservation(ctx, reservation.reservationId, domainId);
		} catch {
			if (domainId) {
				await ctx.db.delete(domainId);
				domainId = null;
			}
			await releaseReservation(ctx, reservation.reservationId);
			throw new Error("Failed to create domain. Please try again.");
		}

		const subdomain = reservation.subdomain;

		await ctx.db.patch(args.businessId, {
			domainId,
		});

		return { domainId, subdomain };
	},
});

export const checkAvailability = query({
	args: { subdomain: v.string() },
	handler: async (ctx, args) => {
		const subdomain = toUrlFriendly(args.subdomain);

		const validation = validateSubdomain(subdomain);
		if (!validation.valid) {
			return {
				available: false,
				subdomain, // The original subdomain that was checked
				suggestedSubdomain: undefined, // No suggestion for invalid format
				error: validation.error,
				suggestions: [],
			};
		}

		// 1) Check if a domain already exists with this subdomain
		const existingDomain = await ctx.db
			.query("domains")
			.withIndex("by_subdomain", (q) => q.eq("subdomain", subdomain))
			.first();
		if (existingDomain) {
			const { checkSubdomainAvailability } = await import(
				"./lib/subdomainUtils"
			);
			const result = await checkSubdomainAvailability(ctx, subdomain);
			return {
				available: false,
				subdomain,
				suggestedSubdomain:
					result.suggestions?.[0] || `${subdomain}-${Date.now()}`,
				suggestions: result.suggestions || [],
			};
		}

		// 2) Check active/valid reservations
		const { isSubdomainAvailable } = await import("./lib/subdomainReservation");
		const available = await isSubdomainAvailable(ctx, subdomain);
		if (available) {
			return {
				available: true,
				subdomain,
				suggestedSubdomain: subdomain,
				suggestions: [],
			};
		}

		// 3) Provide alternatives when reserved
		const { checkSubdomainAvailability } = await import("./lib/subdomainUtils");
		const result = await checkSubdomainAvailability(ctx, subdomain);
		return {
			available: false,
			subdomain,
			suggestedSubdomain:
				result.suggestions?.[0] || `${subdomain}-${Date.now()}`,
			suggestions: result.suggestions || [],
		};
	},
});

export const getById = query({
	args: { id: v.id("domains") },
	handler: async (ctx, args) => {
		return await ctx.db.get(args.id);
	},
});

export const getBySubdomain = query({
	args: { subdomain: v.string() },
	handler: async (ctx, args) => {
		return await ctx.db
			.query("domains")
			.withIndex("by_subdomain", (q) => q.eq("subdomain", args.subdomain))
			.first();
	},
});

export const getByDomain = query({
	args: { domain: v.string() },
	handler: async (ctx, args) => {
		const domain = args.domain.toLowerCase();

		const customDomain = await ctx.db
			.query("domains")
			.withIndex("by_custom_domain", (q) => q.eq("customDomain", domain))
			.first();

		if (customDomain) {
			return customDomain;
		}

		const rootDomain = convexEnv.NEXT_PUBLIC_ROOT_DOMAIN;
		if (domain.endsWith(`.${rootDomain}`)) {
			const subdomain = domain.replace(`.${rootDomain}`, "");
			return await ctx.db
				.query("domains")
				.withIndex("by_subdomain", (q) => q.eq("subdomain", subdomain))
				.first();
		}

		return null;
	},
});

export const list = query({
	handler: async (ctx) => {
		return await ctx.db.query("domains").collect();
	},
});
