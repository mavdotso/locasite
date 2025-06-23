import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  return await convexAuthNextjsToken(req, {
    afterSignIn: async (_user) => {
      // Optional: Add any custom logic after sign in
    },
  });
}

export async function POST(req: NextRequest) {
  return await convexAuthNextjsToken(req, {
    afterSignIn: async (_user) => {
      // Optional: Add any custom logic after sign in
    },
  });
}