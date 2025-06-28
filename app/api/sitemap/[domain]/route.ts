import { NextRequest, NextResponse } from "next/server";
import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ domain: string }> }
) {
  try {
    const { domain } = await params;
    
    // Get the domain info
    const domainData = await fetchQuery(api.domains.getByDomain, { 
      domain: domain.replace(/^www\./, "") 
    });
    
    if (!domainData) {
      return new NextResponse("Domain not found", { status: 404 });
    }

    // Get the business info
    const business = await fetchQuery(api.businesses.getByDomainId, { 
      domainId: domainData._id 
    });
    
    if (!business || !business.isPublished) {
      return new NextResponse("Business not found or not published", { status: 404 });
    }

    // For now, we're using a single-page app structure
    // In the future, we could fetch multiple pages here

    // Build the sitemap
    const baseUrl = `https://${domain}`;
    const currentDate = new Date().toISOString();
    
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    // Add homepage
    sitemap += `
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>`;

    // Since we have a single-page application structure, we don't add additional page URLs

    // Add anchor links for common sections (these are typically part of the single-page app)
    const sections = [
      { anchor: "about", priority: "0.8" },
      { anchor: "services", priority: "0.9" },
      { anchor: "contact", priority: "0.9" },
      { anchor: "gallery", priority: "0.7" },
      { anchor: "reviews", priority: "0.7" },
    ];

    sections.forEach(({ anchor, priority }) => {
      sitemap += `
  <url>
    <loc>${baseUrl}/#${anchor}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priority}</priority>
  </url>`;
    });

    sitemap += `
</urlset>`;

    return new NextResponse(sitemap, {
      status: 200,
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return new NextResponse("Error generating sitemap", { status: 500 });
  }
}