import { NextRequest, NextResponse } from "next/server";
import { api } from "@/convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";
import { Id } from "@/convex/_generated/dataModel";
import { env } from "@/env";

const convex = new ConvexHttpClient(env.NEXT_PUBLIC_CONVEX_URL);

export async function POST(request: NextRequest) {
  try {
    const { domainId } = await request.json();

    if (!domainId) {
      return NextResponse.json(
        { error: "Domain ID is required" },
        { status: 400 },
      );
    }

    // Trigger domain verification
    const result = await convex.action(api.customDomains.verifyDomain, {
      domainId: domainId as Id<"domains">,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Domain verification error:", error);
    return NextResponse.json(
      {
        error: "Failed to verify domain",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get("businessId");

    if (!businessId) {
      return NextResponse.json(
        { error: "Business ID is required" },
        { status: 400 },
      );
    }

    // Get domain verification status
    const status = await convex.query(
      api.customDomains.getDomainVerificationStatus,
      {
        businessId: businessId as Id<"businesses">,
      },
    );

    return NextResponse.json(status || { domain: null, isVerified: false });
  } catch (error) {
    console.error("Domain status error:", error);
    return NextResponse.json(
      {
        error: "Failed to get domain status",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
