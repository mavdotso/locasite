import { NextRequest, NextResponse } from "next/server";
import { api } from "@/convex/_generated/api";
import { fetchAction } from "convex/nextjs";
import { Id } from "@/convex/_generated/dataModel";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { businessId, claimId } = body;

    if (!businessId || !claimId) {
      return NextResponse.json(
        { error: "Missing businessId or claimId" },
        { status: 400 },
      );
    }

    // Send verification email
    const result = await fetchAction(
      api.emailVerification.sendVerificationEmail,
      {
        businessId: businessId as Id<"businesses">,
        claimId: claimId as Id<"businessClaims">,
      },
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error sending verification email:", error);
    return NextResponse.json(
      {
        error: "Failed to send verification email",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
