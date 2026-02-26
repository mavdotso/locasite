import * as Sentry from "@sentry/nextjs";
import { NextRequest, NextResponse } from "next/server";

const TINYBIRD_WRITE_TOKEN = process.env.TINYBIRD_WRITE_TOKEN;
const TINYBIRD_API_URL =
  process.env.NEXT_PUBLIC_TINYBIRD_API_URL || "https://api.tinybird.co";

export async function POST(request: NextRequest) {
  if (!TINYBIRD_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Analytics not configured" },
      { status: 500 },
    );
  }

  try {
    const body = await request.json();
    const { datasource, events } = body;

    if (!datasource || !events || !Array.isArray(events)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const allowedDatasources = ["page_views", "events", "sessions"];
    if (!allowedDatasources.includes(datasource)) {
      return NextResponse.json(
        { error: "Invalid datasource" },
        { status: 400 },
      );
    }

    const url = `${TINYBIRD_API_URL}/v0/events?name=${datasource}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TINYBIRD_WRITE_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: events.map((event: unknown) => JSON.stringify(event)).join("\n"),
    });

    if (!response.ok) {
      Sentry.captureMessage(`Tinybird write failed: ${response.status}`, "error");
      return NextResponse.json(
        { error: "Analytics write failed" },
        { status: 502 },
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
