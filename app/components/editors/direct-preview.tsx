"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id, Doc } from "@/convex/_generated/dataModel";
import BusinessPageContent from "@/components/business/business-page-content";

interface DirectPreviewProps {
  businessId: Id<"businesses">;
}

export function DirectPreview({ businessId }: DirectPreviewProps) {
  const business = useQuery(api.businesses.getByIdWithDraft, { id: businessId });

  if (!business) {
    return <div>Loading...</div>;
  }

  // Create default page content structure
  const defaultContent = {
    sections: [
      {
        type: "hero" as const,
        title: business.name,
        subtitle: business.description,
        image: business.photos?.[0]
      },
      {
        type: "info" as const,
        address: business.address,
        phone: business.phone,
        email: business.email,
        website: business.website,
        hours: business.hours
      },
      {
        type: "about" as const,
        content: business.description || ""
      },
      {
        type: "gallery" as const,
        images: business.photos || []
      },
      {
        type: "reviews" as const,
        reviews: business.reviews || []
      },
      {
        type: "contact" as const
      }
    ]
  };

  return (
    <BusinessPageContent
      initialBusiness={business as Doc<"businesses">}
      content={defaultContent}
    />
  );
}