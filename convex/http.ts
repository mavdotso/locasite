import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { auth } from "./auth";
import { scrapeGoogleMaps } from "./lib/scrape";

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

export default http;
