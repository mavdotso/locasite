import { NextRequest, NextResponse } from "next/server";
import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import { Id } from "@/convex/_generated/dataModel";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const businessId = searchParams.get("businessId");

  if (!businessId) {
    return NextResponse.json({ error: "Missing businessId" }, { status: 400 });
  }

  try {
    // Check publishing status
    const publishingStatus = await fetchQuery(
      api.businessPublishing.getPublishingStatus,
      {
        businessId: businessId as Id<"businesses">,
      },
    );

    // Check if business is claimable
    const claimableStatus = await fetchQuery(
      api.businessClaims.isBusinessClaimable,
      {
        businessId: businessId as Id<"businesses">,
      },
    );

    return NextResponse.json({
      publishingStatus,
      claimableStatus,
    });
  } catch (error) {
    console.error("Error checking status:", error);
    return NextResponse.json(
      {
        error: "Failed to check status",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
