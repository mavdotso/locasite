import { NextRequest, NextResponse } from "next/server";
import { api } from "@/convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";
import { Id } from "@/convex/_generated/dataModel";
import { env } from "@/env";

const convex = new ConvexHttpClient(env.NEXT_PUBLIC_CONVEX_URL);

// Add domain to Vercel project
export async function POST(request: NextRequest) {
  try {
    const { domain, businessId } = await request.json();

    if (!domain || !businessId) {
      return NextResponse.json(
        { error: "Domain and business ID are required" },
        { status: 400 },
      );
    }

    const vercelToken = env.VERCEL_API_TOKEN;
    const projectId = env.VERCEL_PROJECT_ID;
    const teamId = env.VERCEL_TEAM_ID; // Optional, if using team account

    if (!vercelToken || !projectId) {
      return NextResponse.json(
        { error: "Vercel API configuration missing" },
        { status: 500 },
      );
    }

    // Add domain to Vercel project
    const vercelUrl = `https://api.vercel.com/v10/projects/${projectId}/domains`;
    const vercelResponse = await fetch(vercelUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${vercelToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: domain,
        ...(teamId && { teamId }),
      }),
    });

    const vercelData = await vercelResponse.json();

    if (!vercelResponse.ok) {
      // Handle specific Vercel errors
      if (vercelData.error?.code === "domain_already_in_use") {
        return NextResponse.json(
          { error: "This domain is already in use by another Vercel project" },
          { status: 400 },
        );
      }

      return NextResponse.json(
        {
          error: vercelData.error?.message || "Failed to add domain to Vercel",
        },
        { status: vercelResponse.status },
      );
    }

    // Update domain configuration in our database
    await convex.mutation(api.customDomains.updateDomainConfiguration, {
      businessId: businessId as Id<"businesses">,
      vercelDomainId: vercelData.id,
      apexName: vercelData.apexName,
    });

    return NextResponse.json({
      success: true,
      domain: vercelData.name,
      apexName: vercelData.apexName,
      verified: vercelData.verified,
      verification: vercelData.verification,
      configuredBy: vercelData.configuredBy,
    });
  } catch (error) {
    console.error("Vercel domain add error:", error);
    return NextResponse.json(
      {
        error: "Failed to add domain",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

// Remove domain from Vercel project
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get("domain");

    if (!domain) {
      return NextResponse.json(
        { error: "Domain is required" },
        { status: 400 },
      );
    }

    const vercelToken = env.VERCEL_API_TOKEN;
    const projectId = env.VERCEL_PROJECT_ID;
    const teamId = env.VERCEL_TEAM_ID;

    if (!vercelToken || !projectId) {
      return NextResponse.json(
        { error: "Vercel API configuration missing" },
        { status: 500 },
      );
    }

    // Remove domain from Vercel project
    const vercelUrl = `https://api.vercel.com/v9/projects/${projectId}/domains/${domain}`;
    const vercelResponse = await fetch(vercelUrl, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${vercelToken}`,
        ...(teamId && { "Vercel-Team-Id": teamId }),
      },
    });

    if (!vercelResponse.ok && vercelResponse.status !== 404) {
      const vercelData = await vercelResponse.json();
      return NextResponse.json(
        {
          error:
            vercelData.error?.message || "Failed to remove domain from Vercel",
        },
        { status: vercelResponse.status },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Domain removed successfully",
    });
  } catch (error) {
    console.error("Vercel domain remove error:", error);
    return NextResponse.json(
      {
        error: "Failed to remove domain",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
