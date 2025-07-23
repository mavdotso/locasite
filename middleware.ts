import { type NextRequest, NextResponse, NextFetchEvent } from "next/server";
import { convexAuthNextjsMiddleware } from "@convex-dev/auth/nextjs/server";
import { env } from "./env";

const authMiddleware = convexAuthNextjsMiddleware();

function extractSubdomain(request: NextRequest): string | null {
  const url = request.url;
  const host = request.headers.get("host") || "";
  const hostname = host.split(":")[0];
  const rootDomain = env.NEXT_PUBLIC_ROOT_DOMAIN;

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

export default async function middleware(
  request: NextRequest,
  event: NextFetchEvent,
) {
  const { pathname } = request.nextUrl;
  const subdomain = extractSubdomain(request);
  const host = request.headers.get("host") || "";
  const hostname = host.split(":")[0];
  const rootDomain = env.NEXT_PUBLIC_ROOT_DOMAIN;

  // Handle custom domains (not subdomains of root domain)
  const isCustomDomain =
    !subdomain &&
    hostname !== rootDomain &&
    hostname !== `www.${rootDomain}` &&
    !hostname.includes("localhost") &&
    !hostname.includes("127.0.0.1");

  if (isCustomDomain) {
    // Block access to dashboard and admin routes from custom domains
    if (
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/app") ||
      pathname.startsWith("/sign-in") ||
      pathname.startsWith("/api/") ||
      pathname.startsWith("/business/")
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Handle special files
    if (pathname === "/sitemap.xml") {
      return NextResponse.rewrite(
        new URL(
          `${env.NEXT_PUBLIC_CONVEX_URL}/sitemap/${hostname}`,
          request.url,
        ),
      );
    }
    if (pathname === "/robots.txt") {
      return NextResponse.rewrite(
        new URL(
          `${env.NEXT_PUBLIC_CONVEX_URL}/robots/${hostname}`,
          request.url,
        ),
      );
    }
    if (pathname === "/favicon.ico" || pathname === "/favicon.svg") {
      return NextResponse.rewrite(
        new URL(
          `${env.NEXT_PUBLIC_CONVEX_URL}/favicon/${hostname}`,
          request.url,
        ),
      );
    }

    // Rewrite custom domain requests to /[domain] route
    // The [domain] page will handle looking up the business by custom domain
    const rewritePath = `/custom-domain/${hostname}${pathname}`;
    return NextResponse.rewrite(new URL(rewritePath, request.url));
  }

  // Handle subdomain routing BEFORE auth middleware
  if (subdomain) {
    // Special handling for 'app' subdomain
    if (subdomain === "app") {
      // For app subdomain, rewrite first then apply auth
      const rewrittenRequest = NextResponse.rewrite(
        new URL(`/app${pathname}`, request.url),
      );

      // Apply auth middleware to the rewritten request
      const authResponse = await authMiddleware(request, event);
      if (authResponse && authResponse.status !== 200) {
        return authResponse;
      }

      return rewrittenRequest;
    }

    // Block access to dashboard from business subdomains
    if (pathname.startsWith("/dashboard") || pathname.startsWith("/app")) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Allow business edit pages to pass through to auth middleware
    if (pathname.startsWith("/business/")) {
      const authResponse = await authMiddleware(request, event);
      if (authResponse) {
        return authResponse;
      }
      return NextResponse.next();
    }

    // Handle sitemap.xml and robots.txt specially
    if (pathname === "/sitemap.xml") {
      return NextResponse.rewrite(
        new URL(
          `${env.NEXT_PUBLIC_CONVEX_URL}/sitemap/${subdomain}`,
          request.url,
        ),
      );
    }
    if (pathname === "/robots.txt") {
      return NextResponse.rewrite(
        new URL(
          `${env.NEXT_PUBLIC_CONVEX_URL}/robots/${subdomain}`,
          request.url,
        ),
      );
    }
    // Handle favicon requests
    if (pathname === "/favicon.ico" || pathname === "/favicon.svg") {
      return NextResponse.rewrite(
        new URL(
          `${env.NEXT_PUBLIC_CONVEX_URL}/favicon/${subdomain}`,
          request.url,
        ),
      );
    }

    // For any other path on a business subdomain, rewrite to /[subdomain]/...
    const rewritePath = `/${subdomain}${pathname}`;
    return NextResponse.rewrite(new URL(rewritePath, request.url));
  }

  // For non-subdomain requests, run auth middleware normally
  const authResponse = await authMiddleware(request, event);
  if (authResponse) {
    return authResponse;
  }

  // On the root domain, allow normal access
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     *
     * NOTE: We DO want to match /api/auth routes for Convex auth
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
