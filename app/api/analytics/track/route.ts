import { NextRequest, NextResponse } from "next/server";
import { getTinybirdClient } from "@/app/lib/tinybird";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    const tinybird = getTinybirdClient();

    switch (type) {
      case "pageview":
        await tinybird.trackPageView(data);
        break;
      case "event":
        await tinybird.trackEvent(data);
        break;
      case "session":
        await tinybird.updateSession(data);
        break;
      default:
        return NextResponse.json(
          { error: "Invalid event type" },
          { status: 400 },
        );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Analytics tracking error:", error);
    return NextResponse.json(
      { error: "Failed to track event" },
      { status: 500 },
    );
  }
}
