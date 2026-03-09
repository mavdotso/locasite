import type { MetadataRoute } from "next";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { allSeoPageSlugs } from "@/app/lib/seo-landing-data";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://locosite.io";

  // Fetch all published business slugs via paginated Convex query
  const businessEntries: { slug: string; lastModified: string }[] = [];
  let cursor: string | undefined = undefined;

  while (businessEntries.length < 50000) {
    const page = await fetchQuery(api.businesses.getPublishedSlugsPage, {
      cursor,
      pageSize: 500,
    });

    businessEntries.push(...page.entries);
    if (page.isDone) break;
    cursor = page.cursor;
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...allSeoPageSlugs.map((slug) => ({
      url: `${baseUrl}/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...businessEntries.map((entry) => ({
      url: `${baseUrl}/${entry.slug}`,
      lastModified: new Date(entry.lastModified),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    {
      url: `${baseUrl}/examples`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
