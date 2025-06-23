import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { auth } from "./auth";
import { scrapeGoogleMaps } from "./lib/scrape";
import { api, internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";

const http = httpRouter();

auth.addHttpRoutes(http);

http.route({
    path: "/scrape",
    method: "POST",
    handler: scrapeGoogleMaps,
});

// Add CORS preflight for the scrape endpoint
http.route({
    path: "/scrape",
    method: "OPTIONS",
    handler: httpAction(async (_, request) => {
        const headers = request.headers;
        if (
            headers.get("Origin") !== null &&
            headers.get("Access-Control-Request-Method") !== null &&
            headers.get("Access-Control-Request-Headers") !== null
        ) {
            return new Response(null, {
                headers: new Headers({
                    "Access-Control-Allow-Origin": process.env.CLIENT_ORIGIN || "*",
                    "Access-Control-Allow-Methods": "POST",
                    "Access-Control-Allow-Headers": "Content-Type, Authorization",
                    "Access-Control-Max-Age": "86400",
                }),
            });
        } else {
            return new Response();
        }
    }),
});

// Google Business OAuth callback handler
http.route({
    path: "/google-business/callback",
    method: "GET",
    handler: httpAction(async (ctx, request) => {
        const url = new URL(request.url);
        const code = url.searchParams.get("code");
        const state = url.searchParams.get("state");
        const error = url.searchParams.get("error");

        // Handle OAuth errors
        if (error) {
            console.error("OAuth error:", error);
            const errorDescription = url.searchParams.get("error_description");
            const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/business/verify/error?error=${encodeURIComponent(errorDescription || error)}`;
            return new Response(null, {
                status: 302,
                headers: {
                    Location: redirectUrl,
                },
            });
        }

        if (!code || !state) {
            const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/business/verify/error?error=${encodeURIComponent("Missing authorization code or state")}`;
            return new Response(null, {
                status: 302,
                headers: {
                    Location: redirectUrl,
                },
            });
        }

        try {
            // Decode the state parameter
            const stateData = JSON.parse(Buffer.from(state, "base64").toString());
            const { claimId, csrfToken } = stateData;

            if (!claimId) {
                throw new Error("Missing claim ID in state");
            }

            // Exchange authorization code for access token
            const tokenEndpoint = "https://oauth2.googleapis.com/token";
            const tokenParams = new URLSearchParams({
                code,
                client_id: process.env.GOOGLE_BUSINESS_CLIENT_ID!,
                client_secret: process.env.GOOGLE_BUSINESS_CLIENT_SECRET!,
                redirect_uri: `${process.env.NEXT_PUBLIC_CONVEX_URL}/google-business/callback`,
                grant_type: "authorization_code",
            });

            const tokenResponse = await fetch(tokenEndpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: tokenParams,
            });

            if (!tokenResponse.ok) {
                const errorData = await tokenResponse.text();
                console.error("Token exchange failed:", errorData);
                throw new Error("Failed to exchange authorization code for access token");
            }

            const tokenData = await tokenResponse.json();
            const accessToken = tokenData.access_token;

            // Get the claim to find the business ID
            const claim = await ctx.runQuery(internal.businessClaims.internal_getClaimById, {
                claimId: claimId as Id<"businessClaims">,
            });

            if (!claim) {
                throw new Error("Claim not found");
            }

            // Verify business ownership using the access token
            const verificationResult = await ctx.runAction(api.businessClaims.verifyGoogleBusinessOwnership, {
                claimId: claimId as Id<"businessClaims">,
                googleAccessToken: accessToken,
            });

            // Redirect based on verification result
            const businessId = claim.businessId;
            if (verificationResult.success) {
                const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/business/${businessId}/verify?claimId=${claimId}&status=success`;
                return new Response(null, {
                    status: 302,
                    headers: {
                        Location: redirectUrl,
                    },
                });
            } else {
                const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/business/${businessId}/verify?claimId=${claimId}&status=failed&message=${encodeURIComponent(verificationResult.message)}`;
                return new Response(null, {
                    status: 302,
                    headers: {
                        Location: redirectUrl,
                    },
                });
            }
        } catch (error) {
            console.error("OAuth callback error:", error);
            const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
            const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/business/verify/error?error=${encodeURIComponent(errorMessage)}`;
            return new Response(null, {
                status: 302,
                headers: {
                    Location: redirectUrl,
                },
            });
        }
    }),
});

export default http;
