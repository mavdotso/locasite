import { Id } from "@/convex/_generated/dataModel";

interface BusinessData {
  _id: Id<"businesses">;
  name: string;
  address: string;
  phone?: string;
  email?: string;
  website?: string;
  hours?: string[];
  rating?: number;
  reviews?: Array<{
    reviewer: string;
    rating: string;
    text: string;
  }>;
  photos?: string[];
  description?: string;
}

interface StructuredData {
  "@context": string;
  "@type": string;
  name: string;
  description?: string;
  url: string;
  telephone?: string;
  email?: string;
  address?: {
    "@type": string;
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    addressCountry?: string;
  };
  image?: string[];
  openingHours?: string[];
  aggregateRating?: {
    "@type": string;
    ratingValue: number;
    reviewCount: number;
  };
  review?: Array<{
    "@type": string;
    author: {
      "@type": string;
      name: string;
    };
    reviewRating: {
      "@type": string;
      ratingValue: number;
    };
    reviewBody: string;
  }>;
}

export function generateLocalBusinessStructuredData(
  business: BusinessData,
  domain: string,
): StructuredData {
  const structuredData: StructuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: business.name,
    description: business.description,
    url: `https://${domain}`,
    telephone: business.phone,
    email: business.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: business.address?.split(",")[0]?.trim(),
      addressLocality: business.address?.split(",")[1]?.trim(),
      addressRegion: business.address?.split(",")[2]?.trim(),
      addressCountry: business.address?.split(",")[3]?.trim() || "US",
    },
  };

  // Add images
  if (business.photos && business.photos.length > 0) {
    structuredData.image = business.photos;
  }

  // Add opening hours
  if (business.hours && business.hours.length > 0) {
    structuredData.openingHours = business.hours;
  }

  // Add aggregate rating if available
  if (business.rating && business.reviews && business.reviews.length > 0) {
    structuredData.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: business.rating,
      reviewCount: business.reviews.length,
    };

    // Add reviews
    structuredData.review = business.reviews.slice(0, 5).map((review) => ({
      "@type": "Review",
      author: {
        "@type": "Person",
        name: review.reviewer,
      },
      reviewRating: {
        "@type": "Rating",
        ratingValue: parseFloat(review.rating) || 5,
      },
      reviewBody: review.text,
    }));
  }

  // Add price range if available (you might want to add this to your schema)
  // structuredData.priceRange = business.priceRange || "$$";

  return structuredData;
}

export function generateBreadcrumbStructuredData(
  businessName: string,
  domain: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `https://${domain}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: businessName,
        item: `https://${domain}`,
      },
    ],
  };
}

export function generateWebsiteStructuredData(
  businessName: string,
  domain: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: businessName,
    url: `https://${domain}`,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `https://${domain}?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}
