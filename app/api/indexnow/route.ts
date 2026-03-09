import { NextResponse } from "next/server";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

const INDEXNOW_KEY = "87de1fd8f748ce5888c2bf4b1108db23";
const BASE_URL = "https://locosite.io";
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${INDEXNOW_KEY}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Collect all business slugs
  const urls: string[] = [`${BASE_URL}/`];
  let cursor: string | undefined = undefined;

  while (urls.length < 10000) {
    const page: {
      entries: { slug: string; lastModified: string }[];
      cursor: string;
      isDone: boolean;
    } = await fetchQuery(api.businesses.getPublishedSlugsPage, {
      cursor,
      pageSize: 500,
    });

    for (const entry of page.entries) {
      urls.push(`${BASE_URL}/${entry.slug}`);
    }
    if (page.isDone) break;
    cursor = page.cursor;
  }

  // IndexNow accepts up to 10,000 URLs per batch
  const response = await fetch(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      host: "locosite.io",
      key: INDEXNOW_KEY,
      keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
      urlList: urls,
    }),
  });

  return NextResponse.json({
    submitted: urls.length,
    status: response.status,
    statusText: response.statusText,
  });
}
