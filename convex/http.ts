import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { scrapeGoogleMaps } from "./scrape";

const http = httpRouter();

http.route({
    path: "/.well-known/openid-configuration",
    method: "GET",
    handler: httpAction(async () => {
        return new Response(
            JSON.stringify({
                issuer: process.env.CONVEX_SITE_URL,
                jwks_uri: process.env.CONVEX_SITE_URL + "/.well-known/jwks.json",
                authorization_endpoint:
                    process.env.CONVEX_SITE_URL + "/oauth/authorize",
            }),
            {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                    "Cache-Control":
                        "public, max-age=15, stale-while-revalidate=15, stale-if-error=86400",
                },
            },
        );
    }),
});

http.route({
    path: "/.well-known/jwks.json",
    method: "GET",
    handler: httpAction(async () => {
        if (process.env.JWKS === undefined) {
            throw new Error("Missing JWKS Convex environment variable");
        }
        return new Response(process.env.JWKS, {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                "Cache-Control":
                    "public, max-age=15, stale-while-revalidate=15, stale-if-error=86400",
            },
        });
    }),
});

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

export default http;
