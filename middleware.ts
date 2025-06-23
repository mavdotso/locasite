import { type NextRequest, NextResponse, NextFetchEvent } from "next/server";
import { convexAuthNextjsMiddleware } from "@convex-dev/auth/nextjs/server";

const authMiddleware = convexAuthNextjsMiddleware();

function extractSubdomain(request: NextRequest): string | null {
    const url = request.url;
    const host = request.headers.get("host") || "";
    const hostname = host.split(":")[0];
    const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "locasite.xyz";

    // Local development environment
    if (url.includes("localhost") || url.includes("127.0.0.1")) {
        // Try to extract subdomain from the full URL
        const fullUrlMatch = url.match(/http:\/\/([^.]+)\.localhost/);
        if (fullUrlMatch && fullUrlMatch[1]) {
            return fullUrlMatch[1];
        }

        // Fallback to host header approach
        if (hostname.includes(".localhost")) {
            return hostname.split(".")[0];
        }

        return null;
    }

    // Production environment
    const rootDomainFormatted = rootDomain.split(":")[0];

    // Handle preview deployment URLs if using Vercel
    if (hostname.includes("---") && hostname.endsWith(".vercel.app")) {
        const parts = hostname.split("---");
        return parts.length > 0 ? parts[0] : null;
    }

    // Regular subdomain detection
    const isSubdomain =
        hostname !== rootDomainFormatted &&
        hostname !== `www.${rootDomainFormatted}` &&
        hostname.endsWith(`.${rootDomainFormatted}`);

    return isSubdomain ? hostname.replace(`.${rootDomainFormatted}`, "") : null;
}

export default async function middleware(request: NextRequest, event: NextFetchEvent) {
    // Run auth middleware first
    const authResponse = await authMiddleware(request, event);
    if (authResponse) {
        return authResponse;
    }

    const { pathname } = request.nextUrl;
    const subdomain = extractSubdomain(request);

    if (subdomain) {
        // Special handling for 'app' subdomain
        if (subdomain === "app") {
            return NextResponse.rewrite(new URL(`/app${pathname}`, request.url));
        }

        // Block access to dashboard from business subdomains
        if (pathname.startsWith("/dashboard") || pathname.startsWith("/app")) {
            return NextResponse.redirect(new URL("/", request.url));
        }

        // For any path on a business subdomain, rewrite to /[subdomain]/...
        // This handles both root path and any subpaths
        return NextResponse.rewrite(new URL(`/${subdomain}${pathname}`, request.url));
    }

    // On the root domain, allow normal access
    return NextResponse.next();
}
export const config = {
    matcher: [
        /*
         * Match all paths except for:
         * 1. /api routes
         * 2. /_next (Next.js internals)
         * 3. all root files inside /public (e.g. /favicon.ico)
         */
        "/((?!api|_next|[\\w-]+\\.\\w+).*)"
    ]
};