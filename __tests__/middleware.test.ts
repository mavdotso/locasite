import { describe, it, expect } from "vitest";

// Test the subdomain extraction logic
describe("subdomain routing logic", () => {
  const ROOT_DOMAIN = "locasite.xyz";

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
    expect(getSubdomain("locasite.xyz")).toBeNull();
  });

  it("returns null for www", () => {
    expect(getSubdomain("www.locasite.xyz")).toBeNull();
  });

  it("returns null for localhost", () => {
    expect(getSubdomain("localhost")).toBeNull();
  });

  it("extracts subdomain from business site", () => {
    expect(getSubdomain("joes-pizza.locasite.xyz")).toBe("joes-pizza");
  });

  it("returns null for root domain with port", () => {
    expect(getSubdomain("locasite.xyz:3000")).toBeNull();
  });

  it("handles nested subdomains", () => {
    expect(getSubdomain("sub.joes-pizza.locasite.xyz")).toBe("sub");
  });
});
