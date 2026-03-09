import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { allSeoPageSlugs } from "@/app/lib/seo-landing-data";

const BASE_URL = "https://locosite.io";

function escapeXml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function urlEntry(
  loc: string,
  lastmod: string,
  changefreq: string,
  priority: string,
): string {
  return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

export async function GET() {
  try {
    const now = new Date().toISOString();

    // Fetch all published business slugs
    const businessEntries: { slug: string; lastModified: string }[] = [];
    let cursor: string | undefined = undefined;
    while (businessEntries.length < 50000) {
      const page: {
        entries: { slug: string; lastModified: string }[];
        cursor: string;
        isDone: boolean;
      } = await fetchQuery(api.businesses.getPublishedSlugsPage, {
        cursor,
        pageSize: 1000,
      });
      businessEntries.push(...page.entries);
      if (page.isDone) break;
      cursor = page.cursor;
    }

    // Fetch city/category combos
    const cityCategoryCombos: { city: string; categorySlug: string }[] = [];
    const comboSet = new Set<string>();
    let categoryCursor: string | undefined = undefined;
    while (cityCategoryCombos.length < 50000) {
      const page: {
        entries: { city: string; categorySlug: string }[];
        cursor: string;
        isDone: boolean;
      } = await fetchQuery(api.categoryPages.getCityCategorySlugsPage, {
        cursor: categoryCursor,
        pageSize: 1000,
      });
      for (const entry of page.entries) {
        const key = `${entry.city}|${entry.categorySlug}`;
        if (!comboSet.has(key)) {
          comboSet.add(key);
          cityCategoryCombos.push(entry);
        }
      }
      if (page.isDone) break;
      categoryCursor = page.cursor;
    }

    const cities = [...new Set(cityCategoryCombos.map((c) => c.city))];

    // Build XML
    const entries: string[] = [];

    // Static pages
    entries.push(urlEntry(BASE_URL, now, "weekly", "1.0"));
    entries.push(urlEntry(`${BASE_URL}/examples`, now, "monthly", "0.6"));
    entries.push(urlEntry(`${BASE_URL}/privacy`, now, "yearly", "0.3"));
    entries.push(urlEntry(`${BASE_URL}/terms`, now, "yearly", "0.3"));

    // SEO landing pages
    for (const slug of allSeoPageSlugs) {
      entries.push(urlEntry(`${BASE_URL}/${slug}`, now, "monthly", "0.8"));
    }

    // City landing pages
    for (const city of cities) {
      entries.push(urlEntry(`${BASE_URL}/${city}`, now, "weekly", "0.8"));
    }

    // Category pages
    for (const combo of cityCategoryCombos) {
      entries.push(
        urlEntry(
          `${BASE_URL}/${combo.city}/${combo.categorySlug}`,
          now,
          "weekly",
          "0.8",
        ),
      );
    }

    // Business pages
    for (const entry of businessEntries) {
      entries.push(
        urlEntry(
          `${BASE_URL}/${entry.slug}`,
          entry.lastModified,
          "weekly",
          "0.7",
        ),
      );
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join("\n")}
</urlset>`;

    return new Response(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600",
      },
    });
  } catch {
    // Return a minimal valid sitemap on error so crawlers don't see 404/500
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE_URL}</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;

    return new Response(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
      },
    });
  }
}
