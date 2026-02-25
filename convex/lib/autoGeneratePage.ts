/**
 * Auto-generates a complete page data structure from scraped Google business data.
 *
 * This is a pure function (no database access) that takes business data and returns
 * a JSON-serializable page content object in the "simple" mode format understood by
 * the SectionRenderer.
 *
 * The generated page includes: Header, Hero, About, Services (if categories available),
 * Gallery (if 3+ photos), Reviews (top 3 by rating), and Contact sections.
 */

import { generateDefaultDescription, generateDefaultTagline } from "./businessDescriptions";

// ---------- Input type ----------

export interface BusinessDataForPage {
  name: string;
  address: string;
  phone?: string;
  email?: string;
  website?: string;
  hours: string[];
  rating?: number;
  reviews: Array<{
    reviewer: string;
    rating: number;
    text: string;
  }>;
  photos: string[];
  description?: string;
  category?: string;
}

// ---------- Output types (matches simple-builder SectionInstance shape) ----------

interface SimpleComponentData {
  id: string;
  type: string;
  content: Record<string, unknown>;
  style?: Record<string, unknown>;
  children?: SimpleComponentData[];
}

interface SectionInstance {
  id: string;
  variationId: string;
  order: number;
  data: SimpleComponentData;
}

interface SimplePageTheme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    muted: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  spacing: {
    section: string;
    element: string;
  };
}

export interface GeneratedPageData {
  mode: "simple";
  title: string;
  sections: SectionInstance[];
  theme: SimplePageTheme;
}

// ---------- Helpers ----------

/** Deterministic ID generator based on section order. */
function generateSectionId(prefix: string, order: number): string {
  return `${prefix}-${order}`;
}

/** Pick the top N reviews sorted by rating descending, then by text length descending. */
export function pickTopReviews(
  reviews: BusinessDataForPage["reviews"],
  count: number,
): BusinessDataForPage["reviews"] {
  return [...reviews]
    .sort((a, b) => {
      if (b.rating !== a.rating) return b.rating - a.rating;
      return b.text.length - a.text.length;
    })
    .slice(0, count);
}

// ---------- Section builders ----------

function buildHeaderSection(biz: BusinessDataForPage, order: number): SectionInstance {
  const menuItems = [
    { label: "Home", link: "#hero" },
    { label: "About", link: "#about" },
  ];

  // Only add menu links for sections that will actually appear
  if (biz.category) {
    menuItems.push({ label: "Services", link: "#services" });
  }
  if (biz.photos.length >= 3) {
    menuItems.push({ label: "Gallery", link: "#gallery" });
  }
  if (biz.reviews.length > 0) {
    menuItems.push({ label: "Reviews", link: "#reviews" });
  }
  menuItems.push({ label: "Contact", link: "#contact" });

  return {
    id: generateSectionId("header", order),
    variationId: "header-section",
    order,
    data: {
      id: "header",
      type: "header-section",
      content: {
        businessName: biz.name,
        logo: biz.name,
        logoAlt: biz.name,
        menuItems,
        showButton: true,
        buttonText: "Get Started",
        buttonLink: "#contact",
      },
      style: {
        backgroundColor: "#FFFFFF",
        textColor: "#000000",
        sticky: true,
      },
    },
  };
}

function buildHeroSection(biz: BusinessDataForPage, order: number): SectionInstance {
  const tagline = generateDefaultTagline(biz.name, biz.category);
  const subtitle =
    biz.description || tagline;

  return {
    id: generateSectionId("hero", order),
    variationId: "hero-center-bg",
    order,
    data: {
      id: "hero",
      type: "hero-section",
      content: {
        title: biz.name,
        subtitle,
        ctaText: "Contact Us",
        ctaLink: "#contact",
        secondaryCtaText: "Learn More",
        secondaryCtaLink: "#about",
        backgroundImage: biz.photos[0] || "",
        overlay: true,
        overlayOpacity: 0.5,
      },
      style: {
        backgroundColor: "#1F2937",
      },
    },
  };
}

function buildAboutSection(biz: BusinessDataForPage, order: number): SectionInstance {
  const aboutText =
    biz.description ||
    generateDefaultDescription(biz.name, biz.category);

  return {
    id: generateSectionId("about", order),
    variationId: "about-text-image",
    order,
    data: {
      id: "about",
      type: "about-section",
      content: {
        title: `About ${biz.name}`,
        content: aboutText,
        image: biz.photos[1] || "",
        imagePosition: "right",
        stats: [
          { value: "10+", label: "Years Experience" },
          { value: "500+", label: "Happy Clients" },
          { value: "24/7", label: "Support" },
        ],
      },
      style: {
        backgroundColor: "#FFFFFF",
      },
    },
  };
}

function buildServicesSection(
  biz: BusinessDataForPage,
  order: number,
): SectionInstance | null {
  // Only generate a services section when we have a category to derive from
  if (!biz.category) return null;

  // Build placeholder services from the category
  const categoryLabel = biz.category.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const services = [
    {
      title: `Professional ${categoryLabel}`,
      description: `Expert ${categoryLabel.toLowerCase()} services delivered with care and attention to detail.`,
      icon: "star",
    },
    {
      title: "Quality Solutions",
      description: "Tailored solutions designed to meet your specific needs and exceed expectations.",
      icon: "check-circle",
    },
    {
      title: "Reliable Support",
      description: "Dependable assistance and support whenever you need it.",
      icon: "shield",
    },
  ];

  return {
    id: generateSectionId("services", order),
    variationId: "services-3-column",
    order,
    data: {
      id: "services",
      type: "services-grid",
      content: {
        title: "Our Services",
        subtitle: "What we offer",
        services,
      },
      style: {
        backgroundColor: "#F0F7FF",
      },
    },
  };
}

function buildGallerySection(
  biz: BusinessDataForPage,
  order: number,
): SectionInstance | null {
  const validPhotos = biz.photos.filter((p) => p && p.trim() !== "");
  if (validPhotos.length < 3) return null;

  return {
    id: generateSectionId("gallery", order),
    variationId: "gallery-grid",
    order,
    data: {
      id: "gallery",
      type: "gallery-grid",
      content: {
        title: "Gallery",
        subtitle: "Take a look at our work",
        images: validPhotos.slice(0, 6).map((src, i) => ({
          src,
          alt: `${biz.name} image ${i + 1}`,
        })),
        columns: 3,
      },
      style: {
        backgroundColor: "#FFFFFF",
      },
    },
  };
}

function buildReviewsSection(
  biz: BusinessDataForPage,
  order: number,
): SectionInstance | null {
  if (biz.reviews.length === 0) return null;

  const topReviews = pickTopReviews(biz.reviews, 3);

  return {
    id: generateSectionId("reviews", order),
    variationId: "reviews-section",
    order,
    data: {
      id: "reviews",
      type: "reviews-section",
      content: {
        title: "What Our Customers Say",
        subtitle: "See what people are saying about us",
        reviews: topReviews.map((r, i) => ({
          id: `review-${i}`,
          author: r.reviewer,
          rating: r.rating,
          content: r.text,
          date: "",
        })),
      },
      style: {
        padding: "4rem 2rem",
        backgroundColor: "",
      },
    },
  };
}

function buildContactSection(biz: BusinessDataForPage, order: number): SectionInstance {
  return {
    id: generateSectionId("contact", order),
    variationId: "contact-form-map",
    order,
    data: {
      id: "contact",
      type: "contact-form-map",
      content: {
        title: "Get in Touch",
        subtitle: "We'd love to hear from you",
        address: biz.address,
        phone: biz.phone || "",
        email: biz.email || "",
        hours: biz.hours.join(", "),
        showInfo: true,
        showMap: true,
        showForm: true,
      },
      style: {
        backgroundColor: "#F0F7FF",
      },
    },
  };
}

// ---------- Main function ----------

/**
 * Generate a full page data structure from scraped business data.
 *
 * The returned object can be JSON.stringify'd and stored in the `pages.content` field.
 */
export function generatePageFromBusinessData(biz: BusinessDataForPage): GeneratedPageData {
  const sections: SectionInstance[] = [];
  let order = 0;

  // Always include: header, hero, about, contact
  sections.push(buildHeaderSection(biz, order++));
  sections.push(buildHeroSection(biz, order++));
  sections.push(buildAboutSection(biz, order++));

  // Conditionally include services (needs category)
  const services = buildServicesSection(biz, order);
  if (services) {
    sections.push(services);
    order++;
  }

  // Conditionally include gallery (needs 3+ photos)
  const gallery = buildGallerySection(biz, order);
  if (gallery) {
    sections.push(gallery);
    order++;
  }

  // Conditionally include reviews (needs at least 1 review)
  const reviews = buildReviewsSection(biz, order);
  if (reviews) {
    sections.push(reviews);
    order++;
  }

  // Always include contact
  sections.push(buildContactSection(biz, order));

  return {
    mode: "simple",
    title: biz.name,
    sections,
    theme: {
      colors: {
        primary: "#3B82F6",
        secondary: "#10B981",
        accent: "#F59E0B",
        background: "#FFFFFF",
        text: "#1F2937",
        muted: "#F3F4F6",
      },
      fonts: {
        heading: "Inter",
        body: "Inter",
      },
      spacing: {
        section: "80px",
        element: "16px",
      },
    },
  };
}
