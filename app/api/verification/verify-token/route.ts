import { NextRequest, NextResponse } from "next/server";
import { api } from "@/convex/_generated/api";
import { fetchMutation } from "convex/nextjs";
import { Id } from "@/convex/_generated/dataModel";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, businessId } = body;

    if (!token || !businessId) {
      return NextResponse.json(
        { error: "Missing token or businessId" },
        { status: 400 },
      );
    }

    // Verify email token
    const result = await fetchMutation(api.emailVerification.verifyEmailToken, {
      token,
      businessId: businessId as Id<"businesses">,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error verifying token:", error);
    return NextResponse.json(
      {
        error: "Failed to verify token",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
