import { describe, it, expect } from "vitest";

// Test the subdomain extraction logic
describe("subdomain routing logic", () => {
  const ROOT_DOMAIN = "locosite.io";

  function getSubdomain(hostname: string): string | null {
    const host = hostname.replace(/:\d+$/, "");
    if (host === ROOT_DOMAIN || host === `www.${ROOT_DOMAIN}` || host === "localhost") {
      return null;
    }
    const parts = host.split(".");
    if (parts.length > ROOT_DOMAIN.split(".").length) {
      return parts[0];
    }
    return null;
  }

  it("returns null for root domain", () => {
    expect(getSubdomain("locosite.io")).toBeNull();
  });

  it("returns null for www", () => {
    expect(getSubdomain("www.locosite.io")).toBeNull();
  });

  it("returns null for localhost", () => {
    expect(getSubdomain("localhost")).toBeNull();
  });

  it("extracts subdomain from business site", () => {
    expect(getSubdomain("joes-pizza.locosite.io")).toBe("joes-pizza");
  });

  it("returns null for root domain with port", () => {
    expect(getSubdomain("locosite.io:3000")).toBeNull();
  });

  it("handles nested subdomains", () => {
    expect(getSubdomain("sub.joes-pizza.locosite.io")).toBe("sub");
  });
});
