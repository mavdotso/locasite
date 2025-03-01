import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

import { ConvexAdapter } from "@/app/convex-adapter";
import { SignJWT, importPKCS8 } from "jose";

const CONVEX_SITE_URL = process.env.NEXT_PUBLIC_CONVEX_URL!.replace(
    /.cloud$/,
    ".site",
);

if (process.env.CONVEX_AUTH_PRIVATE_KEY === undefined) {
    throw new Error('Missing CONVEX_AUTH_PRIVATE_KEY Next.js environment variable');
}

export const { handlers, auth, signIn, signOut } = NextAuth({
    debug: false,
    providers: [Google],
    adapter: ConvexAdapter,
    callbacks: {
        async session({ session }) {
            const privateKey = await importPKCS8(process.env.CONVEX_AUTH_PRIVATE_KEY!, 'RS256');
            const convexToken = await new SignJWT({
                sub: session.userId,
            })
                .setProtectedHeader({ alg: 'RS256' })
                .setIssuedAt()
                .setIssuer(CONVEX_SITE_URL)
                .setAudience('convex')
                .setExpirationTime('1h')
                .sign(privateKey);
            return { ...session, convexToken };
        },
    },
})


declare module 'next-auth' {
    interface Session {
        convexToken: string;
    }
}
