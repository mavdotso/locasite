import { auth } from "./auth";
import router from "./router";
import { httpAction } from "./_generated/server";
import { scrapeGoogleMaps } from "./lib/scrape";
import { api, internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import { convexEnv } from "./lib/env";
import { getAuthUserId } from "@convex-dev/auth/server";

const http = router;

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
          "Access-Control-Allow-Origin": convexEnv.CLIENT_ORIGIN,
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
      const errorDescription = url.searchParams.get("error_description");
      const appUrl = convexEnv.NEXT_PUBLIC_APP_URL;
      const redirectUrl = `${appUrl}/business/verify/error?error=${encodeURIComponent(errorDescription || error)}`;
      return new Response(null, {
        status: 302,
        headers: {
          Location: redirectUrl,
        },
      });
    }

    if (!code || !state) {
      const appUrl = convexEnv.NEXT_PUBLIC_APP_URL;
      const redirectUrl = `${appUrl}/business/verify/error?error=${encodeURIComponent("Missing authorization code or state")}`;
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
      const { claimId } = stateData;
      if (!claimId) {
        throw new Error("Missing claim ID in state");
      }

      // Exchange authorization code for access token
      const tokenEndpoint = "https://oauth2.googleapis.com/token";
      const tokenParams = new URLSearchParams({
        code,
        client_id: convexEnv.GOOGLE_BUSINESS_CLIENT_ID,
        client_secret: convexEnv.GOOGLE_BUSINESS_CLIENT_SECRET,
        redirect_uri: `${convexEnv.NEXT_PUBLIC_CONVEX_URL}/google-business/callback`,
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
        throw new Error(
          "Failed to exchange authorization code for access token",
        );
      }

      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.access_token;

      // Get the claim to find the business ID
      const claim = await ctx.runQuery(
        internal.businessClaims.internal_getClaimById,
        {
          claimId: claimId as Id<"businessClaims">,
        },
      );

      if (!claim) {
        throw new Error("Claim not found");
      }

      // Verify business ownership using the access token
      const verificationResult = await ctx.runAction(
        api.businessClaims.verifyGoogleBusinessOwnership,
        {
          claimId: claimId as Id<"businessClaims">,
          googleAccessToken: accessToken,
        },
      );

      // Redirect based on verification result
      const businessId = claim.businessId;
      const appUrl = convexEnv.NEXT_PUBLIC_APP_URL;

      if (verificationResult.success) {
        const redirectUrl = `${appUrl}/business/${businessId}/verify?claimId=${claimId}&status=success`;
        return new Response(null, {
          status: 302,
          headers: {
            Location: redirectUrl,
          },
        });
      } else {
        const redirectUrl = `${appUrl}/business/${businessId}/verify?claimId=${claimId}&status=failed&message=${encodeURIComponent(verificationResult.message)}`;
        return new Response(null, {
          status: 302,
          headers: {
            Location: redirectUrl,
          },
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      const appUrl = convexEnv.NEXT_PUBLIC_APP_URL;
      if (!appUrl) {
        // Return a proper error response if env var is missing
        return new Response(
          "Server configuration error: NEXT_PUBLIC_APP_URL not set",
          {
            status: 500,
          },
        );
      }
      const redirectUrl = `${appUrl}/business/verify/error?error=${encodeURIComponent(errorMessage)}`;
      return new Response(null, {
        status: 302,
        headers: {
          Location: redirectUrl,
        },
      });
    }
  }),
});

// Analytics tracking endpoint
http.route({
  path: "/analytics/track",
  method: "POST",
  handler: httpAction(async (_, request) => {
    try {
      const body = await request.json();
      const { type, data } = body;

      // Initialize Tinybird client
      const apiUrl = convexEnv.NEXT_PUBLIC_TINYBIRD_API_URL;
      const token = convexEnv.NEXT_PUBLIC_TINYBIRD_TOKEN;

      if (!token) {
        return new Response(
          JSON.stringify({ error: "Tinybird token not configured" }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      // Send events to Tinybird
      let datasource: string;
      let event: unknown;

      switch (type) {
        case "pageview":
          datasource = "page_views";
          event = data;
          break;
        case "event":
          datasource = "events";
          // Convert metadata to JSON string for storage
          event = {
            ...data,
            metadata: data.metadata ? JSON.stringify(data.metadata) : undefined,
          };
          break;
        case "session":
          datasource = "sessions";
          event = data;
          break;
        default:
          return new Response(JSON.stringify({ error: "Invalid event type" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
      }

      const url = `${apiUrl}/v0/events?name=${datasource}`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      });

      if (!response.ok) {
        const error = await response.text();
        return new Response(
          JSON.stringify({ error: "Failed to track event" }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": convexEnv.CLIENT_ORIGIN,
        },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: "Failed to track event" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }),
});

// CORS preflight for analytics endpoint
http.route({
  path: "/analytics/track",
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
          "Access-Control-Allow-Origin": convexEnv.CLIENT_ORIGIN,
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Max-Age": "86400",
        }),
      });
    } else {
      return new Response();
    }
  }),
});

// Email verification endpoints
http.route({
  path: "/verification/send-email",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      const { businessId, claimId } = body;

      if (!businessId || !claimId) {
        return new Response(
          JSON.stringify({ error: "Missing businessId or claimId" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      // Send verification email
      const result = await ctx.runAction(
        api.emailVerification.sendVerificationEmail,
        {
          businessId: businessId as Id<"businesses">,
          claimId: claimId as Id<"businessClaims">,
        },
      );

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": convexEnv.CLIENT_ORIGIN,
        },
      });
    } catch (error) {
      return new Response(
        JSON.stringify({
          error: "Failed to send verification email",
          details: error instanceof Error ? error.message : "Unknown error",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  }),
});

http.route({
  path: "/verification/verify-token",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      const { token, businessId } = body;

      if (!token || !businessId) {
        return new Response(
          JSON.stringify({ error: "Missing token or businessId" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      // Verify the token
      const result = await ctx.runMutation(
        api.emailVerification.verifyEmailToken,
        {
          token,
          businessId: businessId as Id<"businesses">,
        },
      );

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": convexEnv.CLIENT_ORIGIN,
        },
      });
    } catch (error) {
      return new Response(
        JSON.stringify({
          error: "Failed to verify email token",
          details: error instanceof Error ? error.message : "Unknown error",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  }),
});

// CORS preflight for verification endpoints
http.route({
  path: "/verification/send-email",
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
          "Access-Control-Allow-Origin": convexEnv.CLIENT_ORIGIN,
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Max-Age": "86400",
        }),
      });
    } else {
      return new Response();
    }
  }),
});

http.route({
  path: "/verification/verify-token",
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
          "Access-Control-Allow-Origin": convexEnv.CLIENT_ORIGIN,
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Max-Age": "86400",
        }),
      });
    } else {
      return new Response();
    }
  }),
});

// Favicon endpoint with path parameter
http.route({
  pathPrefix: "/favicon/",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    try {
      const url = new URL(request.url);
      const pathParts = url.pathname.split("/");
      const subdomain = pathParts[pathParts.length - 1];

      if (!subdomain) {
        // Return default favicon
        return new Response(null, {
          status: 302,
          headers: {
            Location: "/favicon.svg",
            "Cache-Control": "public, max-age=86400",
          },
        });
      }

      // Get domain from database
      const domain = await ctx.runQuery(api.domains.getBySubdomain, {
        subdomain,
      });

      if (!domain) {
        // Return default favicon
        return new Response(null, {
          status: 302,
          headers: {
            Location: "/favicon.svg",
            "Cache-Control": "public, max-age=86400",
          },
        });
      }

      // Get the business associated with this domain
      const businesses = await ctx.runQuery(api.businesses.listByDomain, {
        domain: domain._id,
      });

      if (!businesses || businesses.length === 0) {
        // Return default favicon
        return new Response(null, {
          status: 302,
          headers: {
            Location: "/favicon.svg",
            "Cache-Control": "public, max-age=86400",
          },
        });
      }

      const business = businesses[0];

      // If business has a custom favicon, redirect to it
      if (business.favicon) {
        return new Response(null, {
          status: 302,
          headers: {
            Location: business.favicon,
            "Cache-Control": "public, max-age=86400",
          },
        });
      }

      // Otherwise, return default favicon
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/favicon.svg",
          "Cache-Control": "public, max-age=86400",
        },
      });
    } catch (error) {
      // Return default favicon on error
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/favicon.svg",
          "Cache-Control": "public, max-age=86400",
        },
      });
    }
  }),
});

// Robots.txt endpoint with path parameter
http.route({
  pathPrefix: "/robots/",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    try {
      const url = new URL(request.url);
      const pathParts = url.pathname.split("/");
      const subdomain = pathParts[pathParts.length - 1];

      if (!subdomain) {
        return new Response("User-agent: *\nDisallow: /", {
          status: 200,
          headers: {
            "Content-Type": "text/plain",
            "Cache-Control": "public, max-age=86400",
          },
        });
      }

      // Get domain from database
      const domain = await ctx.runQuery(api.domains.getBySubdomain, {
        subdomain,
      });

      if (!domain) {
        return new Response("User-agent: *\nDisallow: /", {
          status: 200,
          headers: {
            "Content-Type": "text/plain",
            "Cache-Control": "public, max-age=86400",
          },
        });
      }

      // Get the business associated with this domain
      const businesses = await ctx.runQuery(api.businesses.listByDomain, {
        domain: domain._id,
      });

      if (!businesses || businesses.length === 0) {
        return new Response("User-agent: *\nDisallow: /", {
          status: 200,
          headers: {
            "Content-Type": "text/plain",
            "Cache-Control": "public, max-age=86400",
          },
        });
      }

      const business = businesses[0];

      // Generate robots.txt content
      let robotsContent = "User-agent: *\n";

      // If business is published and can publish, allow indexing
      if (business.isPublished && business.canPublish) {
        robotsContent += "Allow: /\n\n";
        robotsContent += `Sitemap: https://${subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/sitemap.xml`;
      } else {
        // Otherwise, disallow all
        robotsContent += "Disallow: /";
      }

      return new Response(robotsContent, {
        status: 200,
        headers: {
          "Content-Type": "text/plain",
          "Cache-Control": "public, max-age=86400",
        },
      });
    } catch (error) {
      return new Response("User-agent: *\nDisallow: /", {
        status: 200,
        headers: {
          "Content-Type": "text/plain",
          "Cache-Control": "public, max-age=86400",
        },
      });
    }
  }),
});

// Sitemap endpoint with path parameter
http.route({
  pathPrefix: "/sitemap/",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    try {
      const url = new URL(request.url);
      const pathParts = url.pathname.split("/");
      const subdomain = pathParts[pathParts.length - 1];

      if (!subdomain) {
        return new Response("Sitemap not found", {
          status: 404,
        });
      }

      // Get domain from database
      const domain = await ctx.runQuery(api.domains.getBySubdomain, {
        subdomain,
      });

      if (!domain) {
        return new Response("Sitemap not found", {
          status: 404,
        });
      }

      // Get the business associated with this domain
      const businesses = await ctx.runQuery(api.businesses.listByDomain, {
        domain: domain._id,
      });

      if (!businesses || businesses.length === 0) {
        return new Response("Sitemap not found", {
          status: 404,
        });
      }

      const business = businesses[0];

      // Only generate sitemap for published businesses
      if (!business.isPublished || !business.canPublish) {
        return new Response("Sitemap not found", {
          status: 404,
        });
      }

      // Generate sitemap XML
      const baseUrl = `https://${subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;
      const lastModified = new Date(business._creationTime).toISOString();

      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${lastModified}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;

      return new Response(sitemap, {
        status: 200,
        headers: {
          "Content-Type": "application/xml",
          "Cache-Control": "public, max-age=86400",
        },
      });
    } catch (error) {
      return new Response("Sitemap generation failed", {
        status: 500,
      });
    }
  }),
});

// Google Business auth endpoints
http.route({
  path: "/auth/google-business",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    try {
      const url = new URL(request.url);
      const claimId = url.searchParams.get("claimId");

      if (!claimId) {
        return new Response(
          JSON.stringify({ error: "Missing claimId parameter" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      // Get the claim to verify it exists
      const claim = await ctx.runQuery(
        internal.businessClaims.internal_getClaimById,
        {
          claimId: claimId as Id<"businessClaims">,
        },
      );

      if (!claim) {
        return new Response(JSON.stringify({ error: "Invalid claim ID" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Generate OAuth URL
      const state = Buffer.from(JSON.stringify({ claimId })).toString("base64");
      const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
      authUrl.searchParams.set(
        "client_id",
        convexEnv.GOOGLE_BUSINESS_CLIENT_ID,
      );
      authUrl.searchParams.set(
        "redirect_uri",
        `${convexEnv.NEXT_PUBLIC_CONVEX_URL}/google-business/callback`,
      );
      authUrl.searchParams.set("response_type", "code");
      authUrl.searchParams.set(
        "scope",
        "https://www.googleapis.com/auth/business.manage",
      );
      authUrl.searchParams.set("state", state);
      authUrl.searchParams.set("access_type", "offline");
      authUrl.searchParams.set("prompt", "consent");

      // Redirect to Google OAuth
      return new Response(null, {
        status: 302,
        headers: {
          Location: authUrl.toString(),
        },
      });
    } catch (error) {
      return new Response(
        JSON.stringify({
          error: "Failed to initiate authentication",
          details: error instanceof Error ? error.message : "Unknown error",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  }),
});

http.route({
  path: "/auth/google-business/check-status",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    try {
      const url = new URL(request.url);
      const claimId = url.searchParams.get("claimId");

      if (!claimId) {
        return new Response(
          JSON.stringify({ error: "Missing claimId parameter" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      // Get the claim status
      const claim = await ctx.runQuery(api.businessClaims.getClaimById, {
        claimId: claimId as Id<"businessClaims">,
      });

      if (!claim) {
        return new Response(JSON.stringify({ error: "Claim not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }

      return new Response(
        JSON.stringify({
          status: claim.status,
          verificationMethod: claim.verificationMethod,
          googleVerificationStatus: claim.googleVerificationStatus,
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": convexEnv.CLIENT_ORIGIN,
          },
        },
      );
    } catch (error) {
      return new Response(
        JSON.stringify({
          error: "Failed to check verification status",
          details: error instanceof Error ? error.message : "Unknown error",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  }),
});

http.route({
  path: "/auth/google-business/verify-ownership",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      const { claimId, accessToken } = body;

      if (!claimId || !accessToken) {
        return new Response(
          JSON.stringify({ error: "Missing claimId or accessToken" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      // Verify ownership
      const result = await ctx.runAction(
        api.businessClaims.verifyGoogleBusinessOwnership,
        {
          claimId: claimId as Id<"businessClaims">,
          googleAccessToken: accessToken,
        },
      );

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": convexEnv.CLIENT_ORIGIN,
        },
      });
    } catch (error) {
      return new Response(
        JSON.stringify({
          error: "Failed to verify ownership",
          details: error instanceof Error ? error.message : "Unknown error",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  }),
});

// CORS preflight for Google Business auth endpoints
http.route({
  path: "/auth/google-business/check-status",
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
          "Access-Control-Allow-Origin": convexEnv.CLIENT_ORIGIN,
          "Access-Control-Allow-Methods": "GET",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Max-Age": "86400",
        }),
      });
    } else {
      return new Response();
    }
  }),
});

http.route({
  path: "/auth/google-business/verify-ownership",
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
          "Access-Control-Allow-Origin": convexEnv.CLIENT_ORIGIN,
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Max-Age": "86400",
        }),
      });
    } else {
      return new Response();
    }
  }),
});

// Domain management endpoints
http.route({
  path: "/domains/dns-instructions",
  method: "GET",
  handler: httpAction(async (_, request) => {
    try {
      const url = new URL(request.url);
      const domain = url.searchParams.get("domain");
      const verificationToken = url.searchParams.get("token");

      if (!domain || !verificationToken) {
        return new Response(
          JSON.stringify({ error: "Domain and verification token are required" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      // Vercel's CNAME target
      const cnameTarget = "cname.vercel-dns.com";

      const instructions = {
        domain,
        verificationToken,
        dnsRecords: [
          {
            type: "CNAME",
            name: domain,
            value: cnameTarget,
            ttl: 3600,
            priority: "Required",
            description: "Points your domain to Locasite's servers",
          },
          {
            type: "TXT",
            name: `_locasite-verify.${domain}`,
            value: verificationToken,
            ttl: 3600,
            priority: "Required",
            description: "Verifies domain ownership",
          },
        ],
        instructions: {
          general: [
            "Log in to your domain registrar or DNS provider",
            "Navigate to DNS management or DNS settings",
            "Add the records listed above",
            "Save your changes and wait for DNS propagation (usually 5-30 minutes)",
            "Click 'Verify Domain' to check the records",
          ],
          providers: {
            godaddy: {
              name: "GoDaddy",
              steps: [
                "Sign in to your GoDaddy account",
                "Go to 'My Products' and find your domain",
                "Click 'DNS' next to your domain",
                "Add the CNAME and TXT records using the 'Add' button",
                "Save your changes",
              ],
            },
            namecheap: {
              name: "Namecheap",
              steps: [
                "Sign in to your Namecheap account",
                "Go to 'Domain List' and click 'Manage' next to your domain",
                "Click on 'Advanced DNS' tab",
                "Add new records using the 'Add New Record' button",
                "Save all changes",
              ],
            },
            cloudflare: {
              name: "Cloudflare",
              steps: [
                "Sign in to your Cloudflare account",
                "Select your domain from the dashboard",
                "Go to the 'DNS' tab",
                "Click 'Add record' and add the CNAME and TXT records",
                "Ensure proxy status is set to 'DNS only' (gray cloud)",
              ],
            },
          },
        },
        troubleshooting: [
          {
            issue: "Verification keeps failing",
            solutions: [
              "Ensure DNS records are added exactly as shown",
              "Wait at least 30 minutes for DNS propagation",
              "Check that there are no conflicting records",
              "Verify the domain name is spelled correctly",
            ],
          },
          {
            issue: "CNAME record conflicts",
            solutions: [
              "Remove any existing A or AAAA records for the root domain",
              "If using www subdomain, create a redirect from root to www",
              "Consider using A records pointing to our IP addresses instead",
            ],
          },
        ],
      };

      return new Response(JSON.stringify(instructions), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": convexEnv.CLIENT_ORIGIN,
        },
      });
    } catch (error) {
      console.error("DNS instructions error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to generate DNS instructions" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  }),
});

// Domain SSL status endpoint
http.route({
  path: "/domains/ssl-status",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const { domainId } = await request.json();

      if (!domainId) {
        return new Response(
          JSON.stringify({ error: "Domain ID is required" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      // Get domain info from database
      const domain = await ctx.runQuery(api.customDomains.getDomainById, {
        domainId: domainId as Id<"domains">,
      });

      if (!domain || !domain.customDomain) {
        return new Response(
          JSON.stringify({
            status: "failed",
            message: "Domain not found",
          }),
          {
            status: 404,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      // Check if we have Vercel API token
      const vercelToken = convexEnv.VERCEL_API_TOKEN;
      const projectId = convexEnv.VERCEL_PROJECT_ID;
      let sslStatus: { status: "pending" | "active" | "failed"; message: string };

      if (!vercelToken || !projectId) {
        // Fallback to checking if the domain resolves with HTTPS
        try {
          const response = await fetch(`https://${domain.customDomain}`, {
            method: "HEAD",
            redirect: "manual",
          });

          if (response.ok || response.status === 301 || response.status === 302) {
            sslStatus = {
              status: "active",
              message: "SSL certificate is active",
            };
          } else {
            sslStatus = {
              status: "pending",
              message: "SSL certificate is being provisioned",
            };
          }
        } catch (_error) {
          // Domain doesn't resolve with HTTPS yet
          sslStatus = {
            status: "pending",
            message: "SSL certificate is being provisioned",
          };
        }
      } else {
        // Use Vercel API to check domain status
        const vercelResponse = await fetch(
          `https://api.vercel.com/v9/projects/${projectId}/domains/${domain.customDomain}`,
          {
            headers: {
              Authorization: `Bearer ${vercelToken}`,
            },
          },
        );

        if (!vercelResponse.ok) {
          sslStatus = {
            status: "failed",
            message: "Failed to check domain status",
          };
        } else {
          const vercelData = await vercelResponse.json();

          // Check SSL status from Vercel response
          if (vercelData.verified && vercelData.ssl) {
            sslStatus = {
              status: "active",
              message: "SSL certificate is active and serving",
            };
          } else if (vercelData.verified && !vercelData.ssl) {
            sslStatus = {
              status: "pending",
              message: "Domain verified, SSL certificate is being provisioned",
            };
          } else {
            sslStatus = {
              status: "failed",
              message: vercelData.error?.message || "Domain verification failed",
            };
          }
        }
      }

      // Update domain SSL status in database
      await ctx.runMutation(internal.customDomains.internal_updateSslStatus, {
        domainId: domainId as Id<"domains">,
        sslStatus: sslStatus.status,
        sslProvider: "vercel",
      });

      return new Response(
        JSON.stringify({
          status: sslStatus.status,
          provider: "vercel",
          message: sslStatus.message,
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": convexEnv.CLIENT_ORIGIN,
          },
        },
      );
    } catch (error) {
      console.error("SSL status check error:", error);
      return new Response(
        JSON.stringify({
          error: "Failed to check SSL status",
          details: error instanceof Error ? error.message : "Unknown error",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  }),
});

// Vercel domain management endpoints
http.route({
  path: "/domains/vercel",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const { domain, businessId } = await request.json();

      if (!domain || !businessId) {
        return new Response(
          JSON.stringify({ error: "Domain and business ID are required" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      const vercelToken = convexEnv.VERCEL_API_TOKEN;
      const projectId = convexEnv.VERCEL_PROJECT_ID;

      if (!vercelToken || !projectId) {
        return new Response(
          JSON.stringify({ error: "Vercel API configuration missing" }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      // Add domain to Vercel project
      const vercelUrl = `https://api.vercel.com/v10/projects/${projectId}/domains`;
      const vercelResponse = await fetch(vercelUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${vercelToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: domain,
        }),
      });

      const vercelData = await vercelResponse.json();

      if (!vercelResponse.ok) {
        // Handle specific Vercel errors
        if (vercelData.error?.code === "domain_already_in_use") {
          return new Response(
            JSON.stringify({ error: "This domain is already in use by another Vercel project" }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" },
            },
          );
        }

        return new Response(
          JSON.stringify({
            error: vercelData.error?.message || "Failed to add domain to Vercel",
          }),
          {
            status: vercelResponse.status,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      // Update domain configuration in our database
      await ctx.runMutation(api.customDomains.updateDomainConfiguration, {
        businessId: businessId as Id<"businesses">,
        vercelDomainId: vercelData.id,
        apexName: vercelData.apexName,
      });

      return new Response(
        JSON.stringify({
          success: true,
          domain: vercelData.name,
          apexName: vercelData.apexName,
          verified: vercelData.verified,
          verification: vercelData.verification,
          configuredBy: vercelData.configuredBy,
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": convexEnv.CLIENT_ORIGIN,
          },
        },
      );
    } catch (error) {
      console.error("Vercel domain add error:", error);
      return new Response(
        JSON.stringify({
          error: "Failed to add domain",
          details: error instanceof Error ? error.message : "Unknown error",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  }),
});

http.route({
  path: "/domains/vercel",
  method: "DELETE",
  handler: httpAction(async (ctx, request) => {
    try {
      // Authenticate the caller
      const userId = await getAuthUserId(ctx);
      if (!userId) {
        return new Response(
          JSON.stringify({ error: "Authentication required" }),
          { status: 401, headers: { "Content-Type": "application/json" } },
        );
      }

      const url = new URL(request.url);
      const domain = url.searchParams.get("domain");

      if (!domain) {
        return new Response(
          JSON.stringify({ error: "Domain is required" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      // Validate businessId ownership
      const businessId = url.searchParams.get("businessId");
      if (!businessId) {
        return new Response(
          JSON.stringify({ error: "businessId is required" }),
          { status: 400, headers: { "Content-Type": "application/json" } },
        );
      }

      // Verify the domain belongs to this business
      const business = await ctx.runQuery(
        internal.businesses.internal_getBusinessById,
        { id: businessId as Id<"businesses"> },
      );
      if (!business || !business.domainId) {
        return new Response(
          JSON.stringify({ error: "Business not found" }),
          { status: 404, headers: { "Content-Type": "application/json" } },
        );
      }

      // Verify the authenticated user owns this business
      if (business.userId !== userId) {
        return new Response(
          JSON.stringify({ error: "You do not own this business" }),
          { status: 403, headers: { "Content-Type": "application/json" } },
        );
      }

      const domainRecord = await ctx.runQuery(
        internal.domains.internal_getDomainById,
        { id: business.domainId },
      );
      if (
        !domainRecord ||
        (domainRecord.customDomain !== domain &&
          domainRecord.subdomain !== domain)
      ) {
        return new Response(
          JSON.stringify({ error: "Domain does not belong to this business" }),
          { status: 403, headers: { "Content-Type": "application/json" } },
        );
      }

      const vercelToken = convexEnv.VERCEL_API_TOKEN;
      const projectId = convexEnv.VERCEL_PROJECT_ID;

      if (!vercelToken || !projectId) {
        return new Response(
          JSON.stringify({ error: "Vercel API configuration missing" }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      // Remove domain from Vercel project
      const vercelUrl = `https://api.vercel.com/v9/projects/${projectId}/domains/${domain}`;
      const vercelResponse = await fetch(vercelUrl, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${vercelToken}`,
        },
      });

      if (!vercelResponse.ok && vercelResponse.status !== 404) {
        const vercelData = await vercelResponse.json();
        return new Response(
          JSON.stringify({
            error:
              vercelData.error?.message || "Failed to remove domain from Vercel",
          }),
          {
            status: vercelResponse.status,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: "Domain removed successfully",
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": convexEnv.CLIENT_ORIGIN,
          },
        },
      );
    } catch (error) {
      console.error("Vercel domain remove error:", error);
      return new Response(
        JSON.stringify({
          error: "Failed to remove domain",
          details: error instanceof Error ? error.message : "Unknown error",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  }),
});

// Domain verification endpoints
http.route({
  path: "/domains/verify",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const { domainId } = await request.json();

      if (!domainId) {
        return new Response(
          JSON.stringify({ error: "Domain ID is required" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      // Trigger domain verification
      const result = await ctx.runAction(api.customDomains.verifyDomain, {
        domainId: domainId as Id<"domains">,
      });

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": convexEnv.CLIENT_ORIGIN,
        },
      });
    } catch (error) {
      console.error("Domain verification error:", error);
      return new Response(
        JSON.stringify({
          error: "Failed to verify domain",
          details: error instanceof Error ? error.message : "Unknown error",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  }),
});

http.route({
  path: "/domains/verify",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    try {
      const url = new URL(request.url);
      const businessId = url.searchParams.get("businessId");

      if (!businessId) {
        return new Response(
          JSON.stringify({ error: "Business ID is required" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      // Get domain verification status
      const status = await ctx.runQuery(
        api.customDomains.getDomainVerificationStatus,
        {
          businessId: businessId as Id<"businesses">,
        },
      );

      return new Response(
        JSON.stringify(status || { domain: null, isVerified: false }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": convexEnv.CLIENT_ORIGIN,
          },
        },
      );
    } catch (error) {
      console.error("Domain status error:", error);
      return new Response(
        JSON.stringify({
          error: "Failed to get domain status",
          details: error instanceof Error ? error.message : "Unknown error",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  }),
});

// CORS preflight for domain endpoints
http.route({
  path: "/domains/dns-instructions",
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
          "Access-Control-Allow-Origin": convexEnv.CLIENT_ORIGIN,
          "Access-Control-Allow-Methods": "GET",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Max-Age": "86400",
        }),
      });
    } else {
      return new Response();
    }
  }),
});

http.route({
  path: "/domains/ssl-status",
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
          "Access-Control-Allow-Origin": convexEnv.CLIENT_ORIGIN,
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Max-Age": "86400",
        }),
      });
    } else {
      return new Response();
    }
  }),
});

http.route({
  path: "/domains/vercel",
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
          "Access-Control-Allow-Origin": convexEnv.CLIENT_ORIGIN,
          "Access-Control-Allow-Methods": "POST, DELETE",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Max-Age": "86400",
        }),
      });
    } else {
      return new Response();
    }
  }),
});

http.route({
  path: "/domains/verify",
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
          "Access-Control-Allow-Origin": convexEnv.CLIENT_ORIGIN,
          "Access-Control-Allow-Methods": "GET, POST",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Max-Age": "86400",
        }),
      });
    } else {
      return new Response();
    }
  }),
});

export default http;
