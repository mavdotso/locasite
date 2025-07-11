import { NextRequest, NextResponse } from "next/server";
import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ domain: string }> },
) {
  try {
    const { domain: subdomain } = await params;

    // Get domain from database
    const domain = await fetchQuery(api.domains.getBySubdomain, {
      subdomain,
    });

    if (!domain) {
      // Return default favicon
      return NextResponse.redirect(new URL("/favicon.svg", request.url));
    }

    // Get the business associated with this domain
    const businesses = await fetchQuery(api.businesses.listByDomain, {
      domain: domain._id,
    });

    if (!businesses || businesses.length === 0) {
      // Return default favicon
      return NextResponse.redirect(new URL("/favicon.svg", request.url));
    }

    const business = businesses[0];

    // If business has a custom favicon, redirect to it
    if (business.favicon) {
      return NextResponse.redirect(business.favicon);
    }

    // Otherwise, return default favicon
    return NextResponse.redirect(new URL("/favicon.svg", request.url));
  } catch (error) {
    console.error("Error serving favicon:", error);
    // Return default favicon on error
    return NextResponse.redirect(new URL("/favicon.svg", request.url));
  }
}

// Cache favicons for 1 day
export const revalidate = 86400;
