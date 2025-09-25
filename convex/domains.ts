import { v } from "convex/values";
import { query, mutation, internalMutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { getUserFromAuth } from "./lib/helpers";
import { convexEnv } from "./lib/env";
import { validateSubdomain } from "./lib/subdomainUtils";

// URL-friendly string converter (same logic as frontend)
function toUrlFriendly(input: string, maxLength: number = 30): string {
	if (!input) return "";

	return input
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/--+/g, "-")
		.replace(/^-|-$/g, "")
		.substring(0, maxLength)
		.replace(/-$/, "");
}

// Get domain by businessId
export const getByBusinessId = query({
	args: { businessId: v.id("businesses") },
	handler: async (ctx, args) => {
		const business = await ctx.db.get(args.businessId);
		if (!business?.domainId) return null;
		return await ctx.db.get(business.domainId);
	},
});

// Internal mutation to create a domain
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

// Generate a subdomain from business name
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

		// Verify business ownership
		if (business.userId !== user._id) {
			throw new Error("Not authorized to create domain for this business");
		}

		// Use custom subdomain if provided, otherwise generate from business name
		let baseSubdomain: string;
		if (args.customSubdomain) {
			// Make sure custom subdomain is URL-friendly
			baseSubdomain = toUrlFriendly(args.customSubdomain);

			// Validate the custom subdomain
			const validation = validateSubdomain(baseSubdomain);
			if (!validation.valid) {
				throw new Error(validation.error || "Invalid subdomain format");
			}
		} else {
			// Generate subdomain from business name
			baseSubdomain = toUrlFriendly(business.name);

			// Ensure it's not too short
			if (!baseSubdomain || baseSubdomain.length < 3) {
				baseSubdomain = `business-${Math.floor(Math.random() * 10000)}`;
			}
		}

		// Use reservation-based approach for atomic subdomain allocation
		const {
			generateAndReserveUniqueSubdomain,
			confirmReservation,
			releaseReservation,
		} = await import("./lib/subdomainReservation");

		// Try to reserve a subdomain
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
			// Create the domain - this is now safe because we have the reservation
			domainId = await ctx.db.insert("domains", {
				name: business.name,
				subdomain: reservation.subdomain,
				createdAt: Date.now(),
			});

			// Confirm the reservation by linking it to the domain
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

		// Associate the domain with the business
		await ctx.db.patch(args.businessId, {
			domainId,
		});

		return { domainId, subdomain };
	},
});

// Check subdomain availability
export const checkAvailability = query({
	args: { subdomain: v.string() },
	handler: async (ctx, args) => {
		const subdomain = toUrlFriendly(args.subdomain);

		// Validate format
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

		// Check availability using reservation system
		const { isSubdomainAvailable } = await import("./lib/subdomainReservation");
		const available = await isSubdomainAvailable(ctx, subdomain);

		if (available) {
			return {
				available: true,
				subdomain, // The subdomain that was checked and is available
				suggestedSubdomain: subdomain, // Same as subdomain since it's available
				suggestions: [], // No alternatives needed since it's available
			};
		}

		// Generate suggestions if not available
		const { checkSubdomainAvailability } = await import("./lib/subdomainUtils");
		const result = await checkSubdomainAvailability(ctx, subdomain);

		return {
			available: false,
			subdomain: subdomain, // The original subdomain that was checked
			suggestedSubdomain:
				result.suggestions?.[0] || `${subdomain}-${Date.now()}`, // The recommended alternative
			suggestions: result.suggestions || [], // All available alternatives
		};
	},
});

// Get domain by ID
export const getById = query({
	args: { id: v.id("domains") },
	handler: async (ctx, args) => {
		return await ctx.db.get(args.id);
	},
});

// Get domain by subdomain
export const getBySubdomain = query({
	args: { subdomain: v.string() },
	handler: async (ctx, args) => {
		return await ctx.db
			.query("domains")
			.withIndex("by_subdomain", (q) => q.eq("subdomain", args.subdomain))
			.first();
	},
});

// Get domain by domain name (handles both subdomains and custom domains)
export const getByDomain = query({
	args: { domain: v.string() },
	handler: async (ctx, args) => {
		const domain = args.domain.toLowerCase();

		// First check if it's a custom domain
		const customDomain = await ctx.db
			.query("domains")
			.withIndex("by_custom_domain", (q) => q.eq("customDomain", domain))
			.first();

		if (customDomain) {
			return customDomain;
		}

		// Check if it's a subdomain (extract subdomain from full domain)
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
