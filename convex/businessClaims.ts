import {
	mutation,
	query,
	internalMutation,
	internalQuery,
	action,
} from "./_generated/server";
import { v } from "convex/values";
import { Doc } from "./_generated/dataModel";
import { getUserFromAuth } from "./lib/helpers";
import { logger } from "./lib/logger";
import { internal } from "./_generated/api";
import { checkRateLimit, RATE_LIMITS } from "./lib/rateLimiting";

export const internal_createBusinessClaim = internalMutation({
	args: {
		businessId: v.id("businesses"),
		userId: v.id("users"),
	},
	handler: async (ctx, args) => {
		const existingClaim = await ctx.db
			.query("businessClaims")
			.withIndex("by_business_status", (q) =>
				q.eq("businessId", args.businessId).eq("status", "pending"),
			)
			.filter((q) => q.eq(q.field("userId"), args.userId))
			.first();

		if (existingClaim) {
			return existingClaim._id;
		}

		const claimId = await ctx.db.insert("businessClaims", {
			businessId: args.businessId,
			userId: args.userId,
			status: "pending",
			googleVerificationStatus: "pending",
			createdAt: Date.now(),
		});

		return claimId;
	},
});

export const internal_assertClaimOwnership = internalQuery({
	args: { claimId: v.id("businessClaims") },
	handler: async (ctx, args) => {
		const user = await getUserFromAuth(ctx);
		const claim = await ctx.db.get(args.claimId);
		if (!claim) throw new Error("Claim not found");
		if (claim.userId !== user._id) throw new Error("Forbidden");
		return { ok: true };
	},
});

export const internal_approveClaim = internalMutation({
	args: {
		claimId: v.id("businessClaims"),
		notes: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const claim = await ctx.db.get(args.claimId);
		if (!claim) {
			throw new Error("Claim not found");
		}

		await ctx.db.patch(args.claimId, {
			status: "approved",
			googleVerificationStatus: "verified",
			updatedAt: Date.now(),
			notes: args.notes,
		});

		const business = await ctx.db.get(claim.businessId);

		if (business?.userId && business.userId !== claim.userId) {
			throw new Error("Business already claimed by another user");
		}

		await ctx.db.patch(claim.businessId, { userId: claim.userId });

		return true;
	},
});

export const claimBusiness = mutation({
	args: {
		businessId: v.id("businesses"),
		verificationMethod: v.optional(
			v.union(v.literal("google"), v.literal("email"), v.literal("phone")),
		),
	},
	handler: async (ctx, args) => {
		const user = await getUserFromAuth(ctx);

		const rateLimit = await checkRateLimit(
			ctx.db,
			user._id,
			RATE_LIMITS.businessClaim,
		);
		if (!rateLimit.allowed) {
			throw new Error(
				`Rate limit exceeded. You can try again in ${Math.ceil((rateLimit.resetTime - Date.now()) / 1000 / 60)} minutes.`,
			);
		}

		const business = await ctx.db.get(args.businessId);
		if (!business) {
			throw new Error("Business not found");
		}

		if (business.userId === user._id) {
			throw new Error("You already own this business");
		}

		if (business.userId) {
			throw new Error("This business is already claimed by another user");
		}

		const existingClaim = await ctx.db
			.query("businessClaims")
			.withIndex("by_business_status", (q) =>
				q.eq("businessId", args.businessId).eq("status", "pending"),
			)
			.filter((q) => q.eq(q.field("userId"), user._id))
			.first();

		if (existingClaim) {
			return {
				claimId: existingClaim._id,
				message: "You already have a pending claim for this business.",
				requiresGoogleAuth: (args.verificationMethod || "google") === "google",
			};
		}

		const claimData: Omit<
			Doc<"businessClaims">,
			"_id" | "_creationTime" | "updatedAt" | "notes"
		> = {
			businessId: args.businessId,
			userId: user._id,
			status: "pending",
			createdAt: Date.now(),
		};

		if (args.verificationMethod) {
			claimData.verificationMethod = args.verificationMethod;
		}

		if (args.verificationMethod === "google") {
			claimData.googleVerificationStatus = "pending";
		}

		const claimId = await ctx.db.insert("businessClaims", claimData);

		const verificationMessage = {
			google:
				"Please complete Google Business Profile verification to claim this business.",
			email:
				"We'll send verification instructions to the business email address.",
			phone: "We'll call or text the business phone number for verification.",
		};

		return {
			claimId,
			message:
				verificationMessage[
					args.verificationMethod ||
						("google" as keyof typeof verificationMessage)
				],
			requiresGoogleAuth: args.verificationMethod === "google",
		};
	},
});

export const getClaimById = query({
	args: {
		claimId: v.id("businessClaims"),
	},
	handler: async (ctx, args) => {
		const user = await getUserFromAuth(ctx);

		const claim = await ctx.db.get(args.claimId);
		if (!claim) {
			throw new Error("Claim not found");
		}

		if (claim.userId !== user._id) {
			throw new Error("You don't have permission to view this claim");
		}

		return claim;
	},
});

export const internal_getClaimById = internalQuery({
	args: {
		claimId: v.id("businessClaims"),
	},
	handler: async (ctx, args) => {
		return await ctx.db.get(args.claimId);
	},
});

export const internal_getBusinessById = internalQuery({
	args: {
		id: v.id("businesses"),
	},
	handler: async (ctx, args) => {
		return await ctx.db.get(args.id);
	},
});

export const verifyGoogleBusinessOwnership = action({
	args: {
		claimId: v.id("businessClaims"),
		googleAccessToken: v.string(),
	},
	handler: async (ctx, args) => {
		await ctx.runQuery(internal.businessClaims.internal_assertClaimOwnership, {
			claimId: args.claimId,
		});

		const claim = await ctx.runQuery(
			internal.businessClaims.internal_getClaimById,
			{
				claimId: args.claimId,
			},
		);

		if (!claim) {
			throw new Error("Claim not found");
		}

		const business = await ctx.runQuery(
			internal.businesses.internal_getBusinessById,
			{
				id: claim.businessId,
			},
		);

		if (!business) {
			throw new Error("Business not found");
		}

		try {
			const response = await fetch(
				`https://mybusinessbusinessinformation.googleapis.com/v1/locations/${business.placeId}`,
				{
					headers: {
						Authorization: `Bearer ${args.googleAccessToken}`,
						"Content-Type": "application/json",
					},
				},
			);

			if (!response.ok) {
				await ctx.runMutation(
					internal.businessClaims.internal_updateClaimStatus,
					{
						claimId: args.claimId,
						status: "rejected",
						googleVerificationStatus: "failed",
						notes:
							"Google verification failed: User does not have access to this business",
					},
				);

				return {
					success: false,
					message:
						"Could not verify ownership with Google. You don't appear to have access to this business listing.",
				};
			}

			await ctx.runMutation(internal.businessClaims.internal_approveClaim, {
				claimId: args.claimId,
				notes:
					"Automatically approved via Google Business Profile verification",
			});

			return {
				success: true,
				message:
					"Google Business Profile ownership verified. Your claim has been approved!",
			};
		} catch (error) {
			await ctx.runMutation(
				internal.businessClaims.internal_updateClaimStatus,
				{
					claimId: args.claimId,
					status: "pending",
					googleVerificationStatus: "failed",
					notes: `Google verification error: ${error}`,
				},
			);

			return {
				success: false,
				message:
					"Error verifying ownership with Google. Please try again later.",
			};
		}
	},
});

export const internal_updateClaimStatus = internalMutation({
	args: {
		claimId: v.id("businessClaims"),
		status: v.union(
			v.literal("pending"),
			v.literal("approved"),
			v.literal("rejected"),
		),
		googleVerificationStatus: v.union(
			v.literal("pending"),
			v.literal("verified"),
			v.literal("failed"),
		),
		notes: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		await ctx.db.patch(args.claimId, {
			status: args.status,
			googleVerificationStatus: args.googleVerificationStatus,
			updatedAt: Date.now(),
			notes: args.notes,
		});

		return true;
	},
});

export const internal_updateClaimForResend = internalMutation({
	args: {
		claimId: v.id("businessClaims"),
		token: v.string(),
		expiry: v.number(),
	},
	handler: async (ctx, args) => {
		const claim = await ctx.db.get(args.claimId);
		if (!claim) throw new Error("Claim not found");
		const newAttempts = (claim.verificationAttempts ?? 0) + 1;
		await ctx.db.patch(args.claimId, {
			emailVerificationToken: args.token,
			emailVerificationExpiry: args.expiry,
			verificationAttempts: newAttempts,
			magicLinkSent: false,
			updatedAt: Date.now(),
		});
		return { attempts: newAttempts };
	},
});

export const getClaimsByUser = query({
	args: {},
	handler: async (ctx) => {
		const user = await getUserFromAuth(ctx);

		const claims = await ctx.db
			.query("businessClaims")
			.withIndex("by_user", (q) => q.eq("userId", user._id))
			.collect();

		const claimsWithBusiness = await Promise.all(
			claims.map(async (claim) => {
				const business = await ctx.db.get(claim.businessId);
				return {
					...claim,
					business,
				};
			}),
		);

		return claimsWithBusiness;
	},
});

export const isBusinessClaimable = query({
	args: {
		businessId: v.id("businesses"),
	},
	handler: async (ctx, args) => {
		const business = await ctx.db.get(args.businessId);
		if (!business) {
			throw new Error("Business not found");
		}

		const isClaimable = !business.userId;

		const pendingClaims = await ctx.db
			.query("businessClaims")
			.withIndex("by_business_status", (q) =>
				q.eq("businessId", args.businessId).eq("status", "pending"),
			)
			.collect();

		let userHasPendingClaim = false;
		try {
			const user = await getUserFromAuth(ctx);
			if (user) {
				const userClaim = pendingClaims.find(
					(claim) => claim.userId === user._id,
				);
				userHasPendingClaim = !!userClaim;
			}
		} catch (error) {
			logger.error("Error checking user claims", error);
		}

		return {
			isClaimable,
			hasPendingClaims: pendingClaims.length > 0,
			pendingClaimsCount: pendingClaims.length,
			userHasPendingClaim,
		};
	},
});

export const cancelClaim = mutation({
	args: {
		claimId: v.id("businessClaims"),
	},
	handler: async (ctx, args) => {
		const user = await getUserFromAuth(ctx);

		const claim = await ctx.db.get(args.claimId);
		if (!claim) {
			throw new Error("Claim not found");
		}

		if (claim.userId !== user._id) {
			throw new Error("You can only cancel your own claims");
		}

		if (claim.status !== "pending") {
			throw new Error("Can only cancel pending claims");
		}

		await ctx.db.patch(args.claimId, {
			status: "rejected",
			updatedAt: Date.now(),
			notes: "Cancelled by user",
		});

		return true;
	},
});

export const isGoogleBusinessOwner = query({
	args: {
		businessId: v.id("businesses"),
	},
	handler: async (ctx, args) => {
		try {
			const user = await getUserFromAuth(ctx);

			const approvedClaim = await ctx.db
				.query("businessClaims")
				.withIndex("by_business_status_user", (q) =>
					q
						.eq("businessId", args.businessId)
						.eq("status", "approved")
						.eq("userId", user._id),
				)
				.filter((q) =>
					q.and(
						q.eq(q.field("verificationMethod"), "google"),
						q.eq(q.field("googleVerificationStatus"), "verified"),
					),
				)
				.first();

			return {
				isOwner: !!approvedClaim,
				hasGoogleVerification: !!approvedClaim,
				claimId: approvedClaim?._id,
			};
		} catch (error) {
			logger.error("Error checking Google business owner", error, {
				metadata: { businessId: args.businessId },
			});
			return {
				isOwner: false,
				hasGoogleVerification: false,
				claimId: undefined,
			};
		}
	},
});
