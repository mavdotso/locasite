import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get("domain");
    const verificationToken = searchParams.get("token");

    if (!domain || !verificationToken) {
      return NextResponse.json(
        { error: "Domain and verification token are required" },
        { status: 400 },
      );
    }

    // Vercel's CNAME target
    const cnameTarget = "cname.vercel-dns.com";

    const instructions = {
      domain,
      verificationToken,
      dnsRecords: [
        {
          type: "CNAME",
          name: domain,
          value: cnameTarget,
          ttl: 3600,
          priority: "Required",
          description: "Points your domain to Locasite's servers",
        },
        {
          type: "TXT",
          name: `_locasite-verify.${domain}`,
          value: verificationToken,
          ttl: 3600,
          priority: "Required",
          description: "Verifies domain ownership",
        },
      ],
      instructions: {
        general: [
          "Log in to your domain registrar or DNS provider",
          "Navigate to DNS management or DNS settings",
          "Add the records listed above",
          "Save your changes and wait for DNS propagation (usually 5-30 minutes)",
          "Click 'Verify Domain' to check the records",
        ],
        providers: {
          godaddy: {
            name: "GoDaddy",
            steps: [
              "Sign in to your GoDaddy account",
              "Go to 'My Products' and find your domain",
              "Click 'DNS' next to your domain",
              "Add the CNAME and TXT records using the 'Add' button",
              "Save your changes",
            ],
          },
          namecheap: {
            name: "Namecheap",
            steps: [
              "Sign in to your Namecheap account",
              "Go to 'Domain List' and click 'Manage' next to your domain",
              "Click on 'Advanced DNS' tab",
              "Add new records using the 'Add New Record' button",
              "Save all changes",
            ],
          },
          cloudflare: {
            name: "Cloudflare",
            steps: [
              "Sign in to your Cloudflare account",
              "Select your domain from the dashboard",
              "Go to the 'DNS' tab",
              "Click 'Add record' and add the CNAME and TXT records",
              "Ensure proxy status is set to 'DNS only' (gray cloud)",
            ],
          },
        },
      },
      troubleshooting: [
        {
          issue: "Verification keeps failing",
          solutions: [
            "Ensure DNS records are added exactly as shown",
            "Wait at least 30 minutes for DNS propagation",
            "Check that there are no conflicting records",
            "Verify the domain name is spelled correctly",
          ],
        },
        {
          issue: "CNAME record conflicts",
          solutions: [
            "Remove any existing A or AAAA records for the root domain",
            "If using www subdomain, create a redirect from root to www",
            "Consider using A records pointing to our IP addresses instead",
          ],
        },
      ],
    };

    return NextResponse.json(instructions);
  } catch (error) {
    console.error("DNS instructions error:", error);
    return NextResponse.json(
      { error: "Failed to generate DNS instructions" },
      { status: 500 },
    );
  }
}
