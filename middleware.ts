import { type NextRequest, NextResponse, NextFetchEvent } from "next/server";
import { convexAuthNextjsMiddleware } from "@convex-dev/auth/nextjs/server";

const authMiddleware = convexAuthNextjsMiddleware();

function extractSubdomain(request: NextRequest): string | null {
    const url = request.url;
    const host = request.headers.get("host") || "";
    const hostname = host.split(":")[0];
    const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "locasite.xyz";

    console.log("Middleware Debug:", {
        url,
        host,
        hostname,
        isLocalhost: url.includes("localhost") || url.includes("127.0.0.1")
    });

    // Local development environment
    if (url.includes("localhost") || url.includes("127.0.0.1")) {
        // Try to extract subdomain from the full URL
        const fullUrlMatch = url.match(/http:\/\/([^.]+)\.localhost/);
        if (fullUrlMatch && fullUrlMatch[1]) {
            console.log("Extracted subdomain from URL:", fullUrlMatch[1]);
            return fullUrlMatch[1];
        }

        // Fallback to host header approach
        if (hostname.includes(".localhost")) {
            const subdomain = hostname.split(".")[0];
            console.log("Extracted subdomain from hostname:", subdomain);
            return subdomain;
        }

        console.log("No subdomain found in localhost");
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
    console.log("=== MIDDLEWARE START ===");
    console.log("URL:", request.url);
    console.log("Host header:", request.headers.get("host"));
    console.log("Pathname:", request.nextUrl.pathname);
    
    const { pathname } = request.nextUrl;
    const subdomain = extractSubdomain(request);

    console.log("Middleware processing:", {
        pathname,
        subdomain,
        hasSubdomain: !!subdomain
    });

    // Handle subdomain routing BEFORE auth middleware
    if (subdomain) {
        // Special handling for 'app' subdomain
        if (subdomain === "app") {
            console.log("Rewriting to app subdomain:", `/app${pathname}`);
            // For app subdomain, rewrite first then apply auth
            const rewrittenRequest = NextResponse.rewrite(new URL(`/app${pathname}`, request.url));
            
            // Apply auth middleware to the rewritten request
            const authResponse = await authMiddleware(request, event);
            if (authResponse && authResponse.status !== 200) {
                return authResponse;
            }
            
            return rewrittenRequest;
        }

        // Block access to dashboard from business subdomains
        if (pathname.startsWith("/dashboard") || pathname.startsWith("/app")) {
            console.log("Blocking dashboard access from subdomain");
            return NextResponse.redirect(new URL("/", request.url));
        }

        // For any path on a business subdomain, rewrite to /[subdomain]/...
        // This handles both root path and any subpaths
        const rewritePath = `/${subdomain}${pathname}`;
        console.log("Rewriting business subdomain to:", rewritePath);
        
        // Create a new request with the rewritten URL
        const newUrl = new URL(rewritePath, request.url);
        const rewrittenResponse = NextResponse.rewrite(newUrl);
        
        // Copy headers from original request
        request.headers.forEach((value, key) => {
            if (key !== 'host') {
                rewrittenResponse.headers.set(key, value);
            }
        });
        
        return rewrittenResponse;
    }

    // For non-subdomain requests, run auth middleware normally
    const authResponse = await authMiddleware(request, event);
    if (authResponse) {
        console.log("Auth middleware returned response");
        return authResponse;
    }

    // On the root domain, allow normal access
    console.log("No subdomain, allowing normal access");
    return NextResponse.next();
}
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};