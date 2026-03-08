import { describe, it, expect } from "vitest";
import { sanitizePhotos } from "../helpers";

describe("sanitizePhotos", () => {
  it("returns empty array for empty input", () => {
    expect(sanitizePhotos([])).toEqual([]);
  });

  it("passes through Convex storage URLs unchanged", () => {
    const urls = [
      "https://convex.cloud/api/storage/abc123",
      "https://convex.cloud/api/storage/def456",
    ];
    expect(sanitizePhotos(urls)).toEqual(urls);
  });

  it("passes through regular URLs unchanged", () => {
    const urls = [
      "https://example.com/photo.jpg",
      "https://cdn.example.com/images/pic.png?w=400&h=300",
    ];
    expect(sanitizePhotos(urls)).toEqual(urls);
  });

  it("strips &key=... from Google Maps photo URLs", () => {
    const input = [
      "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&key=AIzaSySecretKey123",
    ];
    const result = sanitizePhotos(input);
    expect(result).toEqual([
      "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400",
    ]);
  });

  it("handles URLs where key is the last parameter", () => {
    const input = [
      "https://maps.googleapis.com/maps/api/place/photo?photoreference=abc&maxwidth=400&key=SECRET",
    ];
    const result = sanitizePhotos(input);
    expect(result[0]).not.toContain("key=");
    expect(result[0]).toContain("photoreference=abc");
    expect(result[0]).toContain("maxwidth=400");
  });

  it("handles URLs where key is in the middle of params", () => {
    const input = [
      "https://maps.googleapis.com/maps/api/place/photo?photoreference=abc&key=SECRET&maxwidth=400",
    ];
    const result = sanitizePhotos(input);
    expect(result[0]).not.toContain("key=");
    expect(result[0]).toContain("photoreference=abc");
    expect(result[0]).toContain("maxwidth=400");
  });

  it("handles mixed array of Google Maps and non-Google URLs", () => {
    const input = [
      "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&key=SECRET",
      "https://example.com/photo.jpg",
      "https://maps.googleapis.com/maps/api/place/photo?ref=xyz&key=ANOTHER_SECRET&w=200",
      "https://convex.cloud/api/storage/abc123",
    ];
    const result = sanitizePhotos(input);

    // Google URLs should have key stripped
    expect(result[0]).not.toContain("key=");
    expect(result[2]).not.toContain("key=");

    // Non-Google URLs should be untouched
    expect(result[1]).toBe("https://example.com/photo.jpg");
    expect(result[3]).toBe("https://convex.cloud/api/storage/abc123");
  });

  it("does not strip other query parameters from Google URLs", () => {
    const input = [
      "https://maps.googleapis.com/maps/api/place/photo?photoreference=abc123&maxwidth=400&key=SECRET&maxheight=300",
    ];
    const result = sanitizePhotos(input);

    expect(result[0]).toContain("photoreference=abc123");
    expect(result[0]).toContain("maxwidth=400");
    expect(result[0]).toContain("maxheight=300");
    expect(result[0]).not.toContain("key=");
  });
});
