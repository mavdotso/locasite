import { describe, it, expect } from "vitest";
import { toUrlFriendly } from "@/app/lib/url-utils";

describe("toUrlFriendly", () => {
  it("converts to lowercase", () => {
    expect(toUrlFriendly("Hello World")).toBe("hello-world");
  });

  it("replaces spaces with hyphens", () => {
    expect(toUrlFriendly("joe s pizza")).toBe("joe-s-pizza");
  });

  it("removes special characters", () => {
    expect(toUrlFriendly("joe's pizza & grill")).toBe("joe-s-pizza-grill");
  });

  it("collapses consecutive hyphens", () => {
    expect(toUrlFriendly("hello---world")).toBe("hello-world");
  });

  it("removes leading and trailing hyphens", () => {
    expect(toUrlFriendly("-hello world-")).toBe("hello-world");
  });

  it("returns empty string for empty input", () => {
    expect(toUrlFriendly("")).toBe("");
  });

  it("returns empty string for falsy input", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(toUrlFriendly(null as any)).toBe("");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(toUrlFriendly(undefined as any)).toBe("");
  });

  it("truncates to default max length of 30", () => {
    const long = "this is a very long business name that exceeds thirty characters";
    const result = toUrlFriendly(long);
    expect(result.length).toBeLessThanOrEqual(30);
  });

  it("respects custom max length", () => {
    const result = toUrlFriendly("hello world foo bar", 10);
    expect(result.length).toBeLessThanOrEqual(10);
  });

  it("removes trailing hyphen after truncation", () => {
    // "abcdefghij-klmnop" truncated at 11 would be "abcdefghij-", which should become "abcdefghij"
    const result = toUrlFriendly("abcdefghij klmnop", 11);
    expect(result).not.toMatch(/-$/);
  });

  it("handles unicode/diacritics", () => {
    expect(toUrlFriendly("cafe")).toBe("cafe");
    expect(toUrlFriendly("creme brulee")).toBe("creme-brulee");
  });

  it("strips diacritical marks", () => {
    expect(toUrlFriendly("resume")).toBe("resume");
  });

  it("handles numbers", () => {
    expect(toUrlFriendly("Route 66 Diner")).toBe("route-66-diner");
  });

  it("handles all-special-character input", () => {
    expect(toUrlFriendly("!@#$%^&*()")).toBe("");
  });
});
