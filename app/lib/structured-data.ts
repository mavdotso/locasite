import { Id } from "@/convex/_generated/dataModel";
import { SCHEMA_TYPE_MAP } from "./category-constants";

interface BusinessData {
  _id: Id<"businesses">;
  name: string;
  address: string;
  phone?: string;
  email?: string;
  website?: string;
  hours?: string[];
  rating?: number;
  reviewCount?: number;
  reviews?: Array<{
    reviewer: string;
    rating: number;
    text: string;
  }>;
  photos?: string[];
  description?: string;
  placeId?: string;
  category?: string;
  categorySlug?: string;
  city?: string;
  cityDisplay?: string;
  state?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type StructuredData = Record<string, any>;

export function generateLocalBusinessStructuredData(
  business: BusinessData,
  pageUrl: string,
): StructuredData {
  // Use category-specific schema.org type when available
  const schemaType =
    (business.categorySlug && SCHEMA_TYPE_MAP[business.categorySlug]) ||
    "LocalBusiness";

  // Parse address: prefer structured city/state fields, fall back to comma-split
  const addressParts = business.address?.split(",") || [];
  const streetAddress = addressParts[0]?.trim();
  const addressLocality =
    business.cityDisplay || addressParts[1]?.trim();
  const addressRegion =
    business.state || addressParts[2]?.trim()?.split(" ")[0];
  // Try last part first, then state+zip part for addresses ending with ", USA"
  const postalCode =
    addressParts[addressParts.length - 1]?.trim()?.match(/\d{5}(-\d{4})?$/)?.[0] ||
    addressParts[2]?.trim()?.match(/\d{5}(-\d{4})?$/)?.[0];

  const structuredData: StructuredData = {
    "@context": "https://schema.org",
    "@type": schemaType,
    name: business.name,
    description: business.description,
    url: pageUrl,
    telephone: business.phone,
    email: business.email,
    address: {
      "@type": "PostalAddress",
      streetAddress,
      addressLocality,
      addressRegion,
      ...(postalCode && { postalCode }),
      addressCountry: "US",
    },
  };

  // Google Maps link via placeId
  if (business.placeId) {
    structuredData.hasMap = `https://www.google.com/maps/place/?q=place_id:${business.placeId}`;
  }

  // Add images
  if (business.photos && business.photos.length > 0) {
    structuredData.image = business.photos;
  }

  // Add opening hours
  if (business.hours && business.hours.length > 0) {
    structuredData.openingHours = business.hours;
  }

  // Add aggregate rating if available
  const reviewCount =
    business.reviewCount || (business.reviews ? business.reviews.length : 0);
  if (business.rating && reviewCount > 0) {
    structuredData.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: business.rating,
      reviewCount,
    };

    // Add individual reviews if available
    if (business.reviews && business.reviews.length > 0) {
      structuredData.review = business.reviews.slice(0, 5).map((review) => ({
        "@type": "Review",
        author: {
          "@type": "Person",
          name: review.reviewer,
        },
        reviewRating: {
          "@type": "Rating",
          ratingValue: review.rating || 5,
        },
        reviewBody: review.text,
      }));
    }
  }

  return structuredData;
}

export function generateBreadcrumbStructuredData(opts: {
  rootDomain: string;
  businessName: string;
  businessSlug: string;
  citySlug?: string;
  cityDisplay?: string;
  categorySlug?: string;
  categoryDisplay?: string;
}) {
  const { rootDomain, businessName, businessSlug } = opts;
  const items: Array<{ name: string; item: string }> = [
    { name: "Home", item: `https://${rootDomain}` },
  ];

  if (opts.citySlug && opts.cityDisplay) {
    items.push({
      name: opts.cityDisplay,
      item: `https://${rootDomain}/${opts.citySlug}`,
    });
  }

  if (opts.citySlug && opts.categorySlug && opts.categoryDisplay) {
    items.push({
      name: opts.categoryDisplay,
      item: `https://${rootDomain}/${opts.citySlug}/${opts.categorySlug}`,
    });
  }

  items.push({
    name: businessName,
    item: `https://${rootDomain}/${businessSlug}`,
  });

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((entry, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: entry.name,
      item: entry.item,
    })),
  };
}

export function generateWebsiteStructuredData(rootDomain: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Locosite",
    url: `https://${rootDomain}`,
  };
}

export function generateFAQPageStructuredData(
  faqs: Array<{ question: string; answer: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function generateHowToStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Get a Free Business Website in 30 Seconds",
    description:
      "Create a free professional website from your Google Maps listing in three simple steps.",
    step: [
      {
        "@type": "HowToStep",
        name: "Paste your Google Maps link",
        text: "Copy the URL of your business from Google Maps and paste it into the Locosite form.",
      },
      {
        "@type": "HowToStep",
        name: "Preview your website",
        text: "We auto-generate a professional website using your business name, photos, hours, and reviews. Preview it instantly.",
      },
      {
        "@type": "HowToStep",
        name: "Publish for free",
        text: "Click publish to make your website live at yourname.locosite.io. No credit card required.",
      },
    ],
  };
}

export function generateProductStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Locosite Free Website",
    description:
      "A free professional website for local businesses, auto-generated from your Google Maps listing.",
    brand: {
      "@type": "Brand",
      name: "Locosite",
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
  };
}
