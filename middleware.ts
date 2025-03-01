import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export const config = {
    matcher: [
        /*
         * Match all paths except for:
         * 1. /api routes
         * 2. /_next (Next.js internals)
         * 3. /_static (inside /public)
         * 4. all root files inside /public (e.g. /favicon.ico)
         */
        "/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
    ],
};

export default async function middleware(req: NextRequest) {
    const url = req.nextUrl;
    const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "";

    console.log("🔍 Middleware processing request:", req.url);
    console.log("🌐 Root domain from env:", rootDomain);

    // Get hostname of request (e.g. demo.locasite.xyz, demo.localhost:3000)
    let hostname = req.headers.get("host")!;
    console.log("🏠 Original hostname:", hostname);

    // Extract subdomain for both localhost and production
    let subdomain: string | null = null;

    // Check if we're on localhost
    if (hostname.includes("localhost:3000")) {
        console.log("🖥️ Detected localhost environment");
        // For localhost, format is: subdomain.localhost:3000
        const parts = hostname.split(".localhost:3000");

        if (parts.length > 1 && parts[0]) {
            // We have a subdomain on localhost
            subdomain = parts[0];
            console.log("🔹 Extracted localhost subdomain:", subdomain);
        } else {
            // Just localhost:3000 without subdomain
            hostname = "localhost:3000";
            console.log("🔹 No subdomain on localhost");
        }
    } else if (hostname.includes(rootDomain)) {
        console.log("🌎 Detected production environment");
        // For production
        // Check if this is a subdomain of the root domain
        const domainParts = hostname.split(".");
        console.log("🔍 Domain parts:", domainParts);

        if (domainParts.length > 2) {
            // This is a subdomain
            subdomain = domainParts[0];
            console.log("🔹 Extracted production subdomain:", subdomain);
        } else {
            console.log("🔹 No subdomain detected in production");
        }

        // Special case for Vercel preview deployment URLs
        if (
            hostname.includes("---") &&
            hostname.endsWith(`.${process.env.NEXT_PUBLIC_VERCEL_DEPLOYMENT_SUFFIX}`)
        ) {
            subdomain = hostname.split("---")[0];
            console.log("🔹 Extracted Vercel preview subdomain:", subdomain);
        }
    } else {
        console.log("⚠️ Unknown hostname format:", hostname);
    }

    const searchParams = req.nextUrl.searchParams.toString();
    // Get the pathname of the request (e.g. /, /about, /blog/first-post)
    const path = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ""
        }`;
    console.log("🛣️ Request path:", path);

    // Rewrite for app pages
    if (subdomain === "app") {
        console.log("📱 Handling app subdomain");
        const session = await getToken({ req });
        console.log("🔑 Session exists:", !!session);

        if (!session && path !== "/login") {
            console.log("🔄 Redirecting to login");
            return NextResponse.redirect(new URL("/login", req.url));
        } else if (session && path == "/login") {
            console.log("🔄 Redirecting to home");
            return NextResponse.redirect(new URL("/", req.url));
        }

        const rewriteUrl = new URL(`/app${path === "/" ? "" : path}`, req.url);
        console.log("✅ Rewriting to app directory:", rewriteUrl.pathname);
        return NextResponse.rewrite(rewriteUrl);
    }

    // Rewrite root application to `/home` folder
    if (
        hostname === "localhost:3000" ||
        hostname === rootDomain
    ) {
        const rewriteUrl = new URL(`/home${path === "/" ? "" : path}`, req.url);
        console.log("✅ Rewriting to home directory:", rewriteUrl.pathname);
        return NextResponse.rewrite(rewriteUrl);
    }

    // If we have a subdomain, rewrite to the [domain]/[...slug] route
    if (subdomain) {
        const rewriteUrl = new URL(`/${subdomain}${path}`, req.url);
        console.log("✅ Rewriting subdomain to:", rewriteUrl.pathname);
        return NextResponse.rewrite(rewriteUrl);
    }

    console.log("⚠️ No rewrite rule matched, continuing with request");
    return NextResponse.next();
}