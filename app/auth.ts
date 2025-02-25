import NextAuth from "next-auth"
import { ConvexAdapter } from "@/app/convex-adapter";

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [],
    adapter: ConvexAdapter,
})
