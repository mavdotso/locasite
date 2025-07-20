import { NextRequest, NextResponse } from "next/server";
import { api } from "@/convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";
import { Id } from "@/convex/_generated/dataModel";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: NextRequest) {
  try {
    const { domainId } = await request.json();

    if (!domainId) {
      return NextResponse.json(
        { error: "Domain ID is required" },
        { status: 400 },
      );
    }

    // In production, this would:
    // 1. Check with Vercel API for domain SSL status
    // 2. Update the domain record with SSL status
    // 3. Return the current status

    // For now, we'll simulate SSL provisioning
    // In a real implementation, you would call:
    // - Vercel API: https://vercel.com/docs/rest-api/endpoints#check-domain
    // - Or your hosting provider's API

    const mockSslStatus = await checkSslStatus(domainId);

    // Update domain SSL status in database
    await convex.mutation(api.customDomains.updateSslStatus, {
      domainId: domainId as Id<"domains">,
      sslStatus: mockSslStatus.status,
      sslProvider: "vercel",
    });

    return NextResponse.json({
      status: mockSslStatus.status,
      provider: "vercel",
      message: mockSslStatus.message,
    });
  } catch (error) {
    console.error("SSL status check error:", error);
    return NextResponse.json(
      {
        error: "Failed to check SSL status",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

// Real SSL status checker using Vercel API
async function checkSslStatus(domainId: string): Promise<{
  status: "pending" | "active" | "failed";
  message: string;
}> {
  try {
    // Get domain info from database
    const domain = await convex.query(api.customDomains.getDomainById, {
      domainId: domainId as Id<"domains">,
    });

    if (!domain || !domain.customDomain) {
      return {
        status: "failed",
        message: "Domain not found",
      };
    }

    // Check if we have Vercel API token
    const vercelToken = process.env.VERCEL_API_TOKEN;
    const projectId = process.env.VERCEL_PROJECT_ID;

    if (!vercelToken || !projectId) {
      // Fallback to checking if the domain resolves with HTTPS
      try {
        const response = await fetch(`https://${domain.customDomain}`, {
          method: "HEAD",
          redirect: "manual",
        });

        if (response.ok || response.status === 301 || response.status === 302) {
          return {
            status: "active",
            message: "SSL certificate is active",
          };
        }
      } catch (_error) {
        // Domain doesn't resolve with HTTPS yet
      }

      return {
        status: "pending",
        message: "SSL certificate is being provisioned",
      };
    }

    // Use Vercel API to check domain status
    const vercelResponse = await fetch(
      `https://api.vercel.com/v9/projects/${projectId}/domains/${domain.customDomain}`,
      {
        headers: {
          Authorization: `Bearer ${vercelToken}`,
        },
      },
    );

    if (!vercelResponse.ok) {
      return {
        status: "failed",
        message: "Failed to check domain status",
      };
    }

    const vercelData = await vercelResponse.json();

    // Check SSL status from Vercel response
    if (vercelData.verified && vercelData.ssl) {
      return {
        status: "active",
        message: "SSL certificate is active and serving",
      };
    } else if (vercelData.verified && !vercelData.ssl) {
      return {
        status: "pending",
        message: "Domain verified, SSL certificate is being provisioned",
      };
    } else {
      return {
        status: "failed",
        message: vercelData.error?.message || "Domain verification failed",
      };
    }
  } catch (error) {
    console.error("SSL status check error:", error);
    return {
      status: "failed",
      message: "Failed to check SSL status",
    };
  }
}
