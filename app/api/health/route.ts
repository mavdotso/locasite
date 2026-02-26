import { NextResponse } from "next/server";
import { env } from "@/env";

export async function GET() {
  const checks: Record<string, "ok" | "degraded" | "error"> = {};

  // Check Convex connectivity
  try {
    const convexUrl = env.NEXT_PUBLIC_CONVEX_URL;
    if (convexUrl) {
      const res = await fetch(convexUrl, {
        method: "HEAD",
        signal: AbortSignal.timeout(3000),
      });
      checks.convex = res.ok || res.status === 405 ? "ok" : "degraded";
    } else {
      checks.convex = "error";
    }
  } catch {
    checks.convex = "error";
  }

  // Check environment configuration
  checks.env = env.NEXT_PUBLIC_CONVEX_URL ? "ok" : "error";

  const overallStatus = Object.values(checks).every((s) => s === "ok")
    ? "ok"
    : Object.values(checks).some((s) => s === "error")
      ? "error"
      : "degraded";

  return NextResponse.json(
    {
      status: overallStatus,
      checks,
      timestamp: new Date().toISOString(),
    },
    { status: overallStatus === "error" ? 503 : 200 },
  );
}
