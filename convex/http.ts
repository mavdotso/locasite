import { auth } from "./auth";
import router from "./router";
import { httpAction } from "./_generated/server";
import { scrapeGoogleMaps } from "./lib/scrape";
import { api, internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import { convexEnv } from "./lib/env";

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
        redirect_uri: `${process.env.CONVEX_SITE_URL}/google-business/callback`,
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
        `${process.env.CONVEX_SITE_URL}/google-business/callback`,
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

export default http;
