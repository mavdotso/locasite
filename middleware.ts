import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const hostname = request.headers.get('host') || '';
    const subdomain = hostname.split('.')[0];

    if (request.nextUrl.pathname.startsWith('/_next') ||
        request.nextUrl.pathname.startsWith('/api')) {
        return NextResponse.next();
    }

    if (hostname === 'localhost:3000') {
        return NextResponse.next();
    }

    return NextResponse.rewrite(new URL(`/${subdomain}`, request.url));
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};