import { describe, it, expect } from "vitest";
import {
  generatePageFromBusinessData,
  pickTopReviews,
  type BusinessDataForPage,
} from "../autoGeneratePage";

// --------------- Fixtures ---------------

function makeFullBusiness(overrides?: Partial<BusinessDataForPage>): BusinessDataForPage {
  return {
    name: "Joe's Pizza",
    address: "123 Main St, Springfield, IL 62701",
    phone: "(555) 123-4567",
    website: "https://joespizza.example.com",
    hours: [
      "Monday: 11:00 AM - 10:00 PM",
      "Tuesday: 11:00 AM - 10:00 PM",
      "Wednesday: 11:00 AM - 10:00 PM",
    ],
    rating: 4.5,
    reviews: [
      { reviewer: "Alice", rating: 5, text: "Amazing pizza! Best in town." },
      { reviewer: "Bob", rating: 4, text: "Good stuff." },
      { reviewer: "Carol", rating: 5, text: "We come here every week. The crust is perfect and toppings are always fresh." },
      { reviewer: "Dave", rating: 3, text: "OK." },
    ],
    photos: [
      "https://photos.example.com/1.jpg",
      "https://photos.example.com/2.jpg",
      "https://photos.example.com/3.jpg",
      "https://photos.example.com/4.jpg",
    ],
    description: "Family-owned pizzeria since 1995.",
    category: "restaurant",
    ...overrides,
  };
}

function makeMinimalBusiness(): BusinessDataForPage {
  return {
    name: "Quick Fix Plumbing",
    address: "456 Oak Ave",
    hours: [],
    reviews: [],
    photos: [],
  };
}

// --------------- Tests ---------------

describe("generatePageFromBusinessData", () => {
  it("returns simple mode page data with a title", () => {
    const biz = makeFullBusiness();
    const page = generatePageFromBusinessData(biz);

    expect(page.mode).toBe("simple");
    expect(page.title).toBe("Joe's Pizza");
  });

  it("always includes header, hero, about, and contact sections", () => {
    const biz = makeMinimalBusiness();
    const page = generatePageFromBusinessData(biz);
    const types = page.sections.map((s) => s.data.id);

    expect(types).toContain("header");
    expect(types).toContain("hero");
    expect(types).toContain("about");
    expect(types).toContain("contact");
  });

  it("includes services section when category is provided", () => {
    const biz = makeFullBusiness({ category: "restaurant" });
    const page = generatePageFromBusinessData(biz);
    const hasServices = page.sections.some((s) => s.data.id === "services");

    expect(hasServices).toBe(true);
  });

  it("omits services section when category is missing", () => {
    const biz = makeFullBusiness({ category: undefined });
    const page = generatePageFromBusinessData(biz);
    const hasServices = page.sections.some((s) => s.data.id === "services");

    expect(hasServices).toBe(false);
  });

  it("includes gallery section when 3+ photos are available", () => {
    const biz = makeFullBusiness({
      photos: ["a.jpg", "b.jpg", "c.jpg"],
    });
    const page = generatePageFromBusinessData(biz);
    const hasGallery = page.sections.some((s) => s.data.id === "gallery");

    expect(hasGallery).toBe(true);
  });

  it("omits gallery section when fewer than 3 photos", () => {
    const biz = makeFullBusiness({
      photos: ["a.jpg", "b.jpg"],
    });
    const page = generatePageFromBusinessData(biz);
    const hasGallery = page.sections.some((s) => s.data.id === "gallery");

    expect(hasGallery).toBe(false);
  });

  it("omits gallery when photos are empty strings", () => {
    const biz = makeFullBusiness({
      photos: ["a.jpg", "", "  ", "b.jpg"],
    });
    const page = generatePageFromBusinessData(biz);
    const hasGallery = page.sections.some((s) => s.data.id === "gallery");

    // Only 2 valid photos after filtering empty strings
    expect(hasGallery).toBe(false);
  });

  it("includes reviews section when reviews exist", () => {
    const biz = makeFullBusiness();
    const page = generatePageFromBusinessData(biz);
    const hasReviews = page.sections.some((s) => s.data.id === "reviews");

    expect(hasReviews).toBe(true);
  });

  it("omits reviews section when no reviews", () => {
    const biz = makeFullBusiness({ reviews: [] });
    const page = generatePageFromBusinessData(biz);
    const hasReviews = page.sections.some((s) => s.data.id === "reviews");

    expect(hasReviews).toBe(false);
  });

  it("reviews section contains top 3 reviews sorted by rating", () => {
    const biz = makeFullBusiness();
    const page = generatePageFromBusinessData(biz);
    const reviewSection = page.sections.find((s) => s.data.id === "reviews");
    const reviews = (reviewSection?.data.content as { reviews: Array<{ author: string; rating: number }> }).reviews;

    expect(reviews).toHaveLength(3);
    // Top 3 by rating: Alice (5), Carol (5), Bob (4)
    expect(reviews[0].rating).toBe(5);
    expect(reviews[1].rating).toBe(5);
    expect(reviews[2].rating).toBe(4);
  });

  it("section orders are sequential with no gaps", () => {
    const biz = makeFullBusiness();
    const page = generatePageFromBusinessData(biz);
    const orders = page.sections.map((s) => s.order);

    for (let i = 0; i < orders.length; i++) {
      expect(orders[i]).toBe(i);
    }
  });

  it("hero uses first photo as background image", () => {
    const biz = makeFullBusiness();
    const page = generatePageFromBusinessData(biz);
    const hero = page.sections.find((s) => s.data.id === "hero");
    const content = hero?.data.content as { backgroundImage: string };

    expect(content.backgroundImage).toBe("https://photos.example.com/1.jpg");
  });

  it("about uses second photo as side image", () => {
    const biz = makeFullBusiness();
    const page = generatePageFromBusinessData(biz);
    const about = page.sections.find((s) => s.data.id === "about");
    const content = about?.data.content as { image: string };

    expect(content.image).toBe("https://photos.example.com/2.jpg");
  });

  it("contact section includes address, phone, and hours", () => {
    const biz = makeFullBusiness();
    const page = generatePageFromBusinessData(biz);
    const contact = page.sections.find((s) => s.data.id === "contact");
    const content = contact?.data.content as {
      address: string;
      phone: string;
      hours: string;
    };

    expect(content.address).toBe("123 Main St, Springfield, IL 62701");
    expect(content.phone).toBe("(555) 123-4567");
    // hours is now a comma-separated string to match ContactSection's expected prop type
    expect(content.hours).toContain("Monday");
    expect(content.hours).toContain("Tuesday");
    expect(content.hours).toContain("Wednesday");
  });

  it("uses description for hero subtitle when available", () => {
    const biz = makeFullBusiness({ description: "Custom description here." });
    const page = generatePageFromBusinessData(biz);
    const hero = page.sections.find((s) => s.data.id === "hero");
    const content = hero?.data.content as { subtitle: string };

    expect(content.subtitle).toBe("Custom description here.");
  });

  it("uses generated tagline for hero when no description", () => {
    const biz = makeFullBusiness({ description: undefined, category: "restaurant" });
    const page = generatePageFromBusinessData(biz);
    const hero = page.sections.find((s) => s.data.id === "hero");
    const content = hero?.data.content as { subtitle: string };

    expect(content.subtitle).toBe("Delicious Food, Memorable Moments");
  });

  it("uses generated description for about when no description", () => {
    const biz = makeFullBusiness({ description: undefined, category: "restaurant" });
    const page = generatePageFromBusinessData(biz);
    const about = page.sections.find((s) => s.data.id === "about");
    const content = about?.data.content as { content: string };

    // The about section uses "content" prop (matching AboutSection component interface)
    expect(content.content).toContain("Joe's Pizza");
    expect(content.content).toContain("restaurant");
  });

  it("header menu items match generated sections", () => {
    const biz = makeFullBusiness();
    const page = generatePageFromBusinessData(biz);
    const header = page.sections.find((s) => s.data.id === "header");
    const menuItems = (header?.data.content as { menuItems: Array<{ label: string; link: string }> }).menuItems;
    const menuLabels = menuItems.map((m) => m.label);

    // Full business has category, 4 photos, and 4 reviews
    expect(menuLabels).toEqual(["Home", "About", "Services", "Gallery", "Reviews", "Contact"]);
  });

  it("header menu excludes sections that are not generated", () => {
    const biz = makeMinimalBusiness();
    const page = generatePageFromBusinessData(biz);
    const header = page.sections.find((s) => s.data.id === "header");
    const menuItems = (header?.data.content as { menuItems: Array<{ label: string }> }).menuItems;
    const menuLabels = menuItems.map((m) => m.label);

    // Minimal: no category, no photos, no reviews
    expect(menuLabels).toEqual(["Home", "About", "Contact"]);
  });

  it("gallery limits to 6 images", () => {
    const photos = Array.from({ length: 10 }, (_, i) => `photo-${i}.jpg`);
    const biz = makeFullBusiness({ photos });
    const page = generatePageFromBusinessData(biz);
    const gallery = page.sections.find((s) => s.data.id === "gallery");
    const images = (gallery?.data.content as { images: unknown[] }).images;

    expect(images).toHaveLength(6);
  });

  it("all sections have valid variationIds", () => {
    const validVariationIds = [
      "header-section",
      "hero-center-bg",
      "about-text-image",
      "services-3-column",
      "gallery-grid",
      "reviews-section",
      "contact-form-map",
    ];

    const biz = makeFullBusiness();
    const page = generatePageFromBusinessData(biz);

    for (const section of page.sections) {
      expect(validVariationIds).toContain(section.variationId);
    }
  });

  it("page data is JSON serializable", () => {
    const biz = makeFullBusiness();
    const page = generatePageFromBusinessData(biz);
    const json = JSON.stringify(page);
    const parsed = JSON.parse(json);

    expect(parsed.mode).toBe("simple");
    expect(parsed.sections).toHaveLength(page.sections.length);
  });

  it("includes a default theme", () => {
    const biz = makeFullBusiness();
    const page = generatePageFromBusinessData(biz);

    expect(page.theme.colors.primary).toBeDefined();
    expect(page.theme.fonts.heading).toBe("Inter");
    expect(page.theme.fonts.body).toBe("Inter");
  });
});

describe("pickTopReviews", () => {
  it("returns top N reviews sorted by rating descending", () => {
    const reviews = [
      { reviewer: "A", rating: 3, text: "ok" },
      { reviewer: "B", rating: 5, text: "great" },
      { reviewer: "C", rating: 4, text: "good" },
      { reviewer: "D", rating: 5, text: "awesome and long review text here" },
    ];

    const top = pickTopReviews(reviews, 2);
    expect(top).toHaveLength(2);
    expect(top[0].rating).toBe(5);
    expect(top[1].rating).toBe(5);
  });

  it("breaks ties by text length (longer first)", () => {
    const reviews = [
      { reviewer: "A", rating: 5, text: "short" },
      { reviewer: "B", rating: 5, text: "this is a much longer review" },
    ];

    const top = pickTopReviews(reviews, 2);
    expect(top[0].reviewer).toBe("B");
    expect(top[1].reviewer).toBe("A");
  });

  it("returns fewer than N if not enough reviews", () => {
    const reviews = [
      { reviewer: "A", rating: 5, text: "great" },
    ];

    const top = pickTopReviews(reviews, 3);
    expect(top).toHaveLength(1);
  });

  it("does not mutate the original array", () => {
    const reviews = [
      { reviewer: "A", rating: 3, text: "ok" },
      { reviewer: "B", rating: 5, text: "great" },
    ];
    const copy = [...reviews];

    pickTopReviews(reviews, 1);
    expect(reviews).toEqual(copy);
  });
});

// --------------- Edge case tests ---------------

describe("generatePageFromBusinessData — edge cases", () => {
  it("handles business with empty photos array", () => {
    const biz: BusinessDataForPage = {
      name: "No Photos Biz",
      address: "789 Elm St",
      hours: ["Monday: 9-5"],
      reviews: [
        { reviewer: "Alice", rating: 5, text: "Great service!" },
      ],
      photos: [],
      category: "plumber",
    };
    const page = generatePageFromBusinessData(biz);

    // Hero should still exist with empty background image
    const hero = page.sections.find((s) => s.data.id === "hero");
    expect(hero).toBeDefined();
    expect((hero?.data.content as { backgroundImage: string }).backgroundImage).toBe("");

    // About should still exist with empty image
    const about = page.sections.find((s) => s.data.id === "about");
    expect(about).toBeDefined();
    expect((about?.data.content as { image: string }).image).toBe("");

    // Gallery should be omitted (< 3 photos)
    const hasGallery = page.sections.some((s) => s.data.id === "gallery");
    expect(hasGallery).toBe(false);
  });

  it("handles business with empty reviews array", () => {
    const biz: BusinessDataForPage = {
      name: "No Reviews Biz",
      address: "321 Pine Rd",
      hours: ["Monday: 10-6"],
      reviews: [],
      photos: ["a.jpg", "b.jpg", "c.jpg"],
      category: "salon",
    };
    const page = generatePageFromBusinessData(biz);

    // Reviews section should be omitted
    const hasReviews = page.sections.some((s) => s.data.id === "reviews");
    expect(hasReviews).toBe(false);

    // Header menu should not include Reviews link
    const header = page.sections.find((s) => s.data.id === "header");
    const menuLabels = (header?.data.content as { menuItems: Array<{ label: string }> }).menuItems.map((m) => m.label);
    expect(menuLabels).not.toContain("Reviews");
  });

  it("handles business with no optional fields (minimal data)", () => {
    const biz: BusinessDataForPage = {
      name: "Bare Bones LLC",
      address: "1 Simple Way",
      hours: [],
      reviews: [],
      photos: [],
    };
    const page = generatePageFromBusinessData(biz);

    // Should still produce a valid page with required sections
    expect(page.mode).toBe("simple");
    expect(page.title).toBe("Bare Bones LLC");

    const sectionIds = page.sections.map((s) => s.data.id);
    expect(sectionIds).toContain("header");
    expect(sectionIds).toContain("hero");
    expect(sectionIds).toContain("about");
    expect(sectionIds).toContain("contact");

    // Optional sections should all be omitted
    expect(sectionIds).not.toContain("services");
    expect(sectionIds).not.toContain("gallery");
    expect(sectionIds).not.toContain("reviews");

    // Contact section should handle missing phone/email gracefully
    const contact = page.sections.find((s) => s.data.id === "contact");
    const contactContent = contact?.data.content as { phone: string; email: string; hours: string };
    expect(contactContent.phone).toBe("");
    expect(contactContent.email).toBe("");
    expect(contactContent.hours).toBe("");

    // Section orders should still be sequential
    const orders = page.sections.map((s) => s.order);
    for (let i = 0; i < orders.length; i++) {
      expect(orders[i]).toBe(i);
    }
  });
});
