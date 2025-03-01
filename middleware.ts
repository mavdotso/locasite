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
    const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN;

    // Get hostname of request (e.g. demo.locasite.xyz, demo.localhost:3000)
    let hostname = req.headers
        .get("host")!
        .replace(".localhost:3000", `.${rootDomain}`);

    // Special case for Vercel preview deployment URLs
    if (
        hostname.includes("---") &&
        hostname.endsWith(`.${process.env.NEXT_PUBLIC_VERCEL_DEPLOYMENT_SUFFIX}`)
    ) {
        hostname = `${hostname.split("---")[0]}.${rootDomain}`;
    }

    const searchParams = req.nextUrl.searchParams.toString();
    // Get the pathname of the request (e.g. /, /about, /blog/first-post)
    const path = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ""
        }`;

    // Rewrite for app pages
    if (hostname == `app.${rootDomain}`) {
        const session = await getToken({ req });
        if (!session && path !== "/login") {
            return NextResponse.redirect(new URL("/login", req.url));
        } else if (session && path == "/login") {
            return NextResponse.redirect(new URL("/", req.url));
        }
        return NextResponse.rewrite(
            new URL(`/app${path === "/" ? "" : path}`, req.url),
        );
    }

    // Rewrite root application to `/home` folder
    if (
        hostname === "localhost:3000" ||
        hostname === rootDomain
    ) {
        console.log("Rewriting to /home path");
        return NextResponse.rewrite(
            new URL(`/home${path === "/" ? "" : path}`, req.url),
        );
    }

    // Rewrite everything else to `/[domain]/[slug] dynamic route
    return NextResponse.rewrite(new URL(`/${hostname}${path}`, req.url));
}