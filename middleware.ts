import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

export default async function middleware(req: NextRequest) {
    const url = req.nextUrl;
    const hostname = req.headers.get("host") || "";
    const path = url.pathname;

    // For localhost testing
    if (hostname.includes("localhost:3000")) {
        // Check if it's a subdomain
        if (hostname !== "localhost:3000") {
            const subdomain = hostname.split(".")[0];
            console.log(`Subdomain detected: ${subdomain}`);

            // Handle app subdomain with auth
            if (subdomain === "app") {
                const session = await getToken({ req });
                if (!session && path !== "/login") {
                    return NextResponse.redirect(new URL("/login", req.url));
                } else if (session && path === "/login") {
                    return NextResponse.redirect(new URL("/", req.url));
                }

                // Rewrite to /app directory
                return NextResponse.rewrite(new URL(`/app${path}`, req.url));
            }

            // For other subdomains, rewrite to /[subdomain]/[path]
            // This will handle nested paths like el-cero.localhost:3000/about
            return NextResponse.rewrite(new URL(`/${subdomain}${path}`, req.url));
        }
    }

    // For production
    const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN;

    // Handle subdomains in production
    if (hostname.endsWith(`.${rootDomain}`)) {
        const subdomain = hostname.replace(`.${rootDomain}`, "");

        // Handle app subdomain with auth
        if (subdomain === "app") {
            const session = await getToken({ req });
            if (!session && path !== "/login") {
                return NextResponse.redirect(new URL("/login", req.url));
            } else if (session && path === "/login") {
                return NextResponse.redirect(new URL("/", req.url));
            }

            // Rewrite to /app directory
            return NextResponse.rewrite(new URL(`/app${path}`, req.url));
        }

        // For other subdomains, rewrite to /[subdomain]/[path]
        return NextResponse.rewrite(new URL(`/${subdomain}${path}`, req.url));
    }

    // Default - continue with request
    return NextResponse.next();
}