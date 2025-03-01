import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

import { ConvexAdapter } from "@/app/convex-adapter";
import { SignJWT, importPKCS8 } from "jose";

const CONVEX_SITE_URL = process.env.NEXT_PUBLIC_CONVEX_URL!.replace(
    /.cloud$/,
    ".site",
);

export const { handlers, auth, signIn, signOut } = NextAuth({
    debug: false,
    providers: [Google],
    adapter: ConvexAdapter,
    callbacks: {
        async jwt({ token, account }) {
            if (account) {
                token.account = account;
            }
            return token;
        },
        async session({ session, token }) {
            const privateKey = await importPKCS8(
                process.env.CONVEX_AUTH_PRIVATE_KEY!,
                "RS256",
            );
            const convexToken = await new SignJWT({
                sub: session.userId,
            })
                .setProtectedHeader({ alg: "RS256" })
                .setIssuedAt()
                .setIssuer(CONVEX_SITE_URL)
                .setAudience("convex")
                .setExpirationTime("1h")
                .sign(privateKey);

            // For Google OAuth, token contains the access token
            if (token.account) {
                session.googleAccessToken = (token.account as { access_token?: string }).access_token;
            }

            return { ...session, convexToken };
        },
    }
})


declare module "next-auth" {
    interface Session {
        convexToken: string;
        googleAccessToken?: string;
    }

    interface JWT {
        account?: {
            access_token?: string;
            token_type?: string;
            expires_at?: number;
            refresh_token?: string;
        }
    }
}