import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { convexAuthNextjsMiddleware } from "@convex-dev/auth/nextjs/server";

const authMiddleware = convexAuthNextjsMiddleware();

export default async function middleware(request: NextRequest, event: NextFetchEvent) {
    const authResponse = await authMiddleware(request, event);

    if (authResponse) {
        console.log('Auth middleware returned response:', {
            status: authResponse.status,
            headers: Object.fromEntries(authResponse.headers.entries()),
            url: authResponse.url
        });
        return authResponse;
    }

    const url = request.nextUrl;
    const hostname = request.headers.get("host") || "";
    const path = url.pathname;

    if (hostname.includes("localhost:3000")) {
        if (hostname !== "localhost:3000") {
            const subdomain = hostname.split(".")[0];

            if (subdomain === "app") {
                if (path === "/sign-in") {
                    return NextResponse.rewrite(new URL(`/app${path}`, request.url));
                }
                return NextResponse.rewrite(new URL(`/app${path}`, request.url));
            }

            return NextResponse.rewrite(new URL(`/${subdomain}${path}`, request.url));
        }
    }

    // Production subdomain handling
    const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN;

    if (rootDomain && hostname.endsWith(`.${rootDomain}`)) {
        const subdomain = hostname.replace(`.${rootDomain}`, "");

        if (subdomain === "app") {
            if (path === "/sign-in") {
                return NextResponse.rewrite(new URL(`/app${path}`, request.url));
            }
            return NextResponse.rewrite(new URL(`/app${path}`, request.url));
        }

        return NextResponse.rewrite(new URL(`/${subdomain}${path}`, request.url));
    }

    return NextResponse.next();
}
export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};