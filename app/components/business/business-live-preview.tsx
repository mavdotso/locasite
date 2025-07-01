"use client";

import { BusinessData } from "@/convex/businesses";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import BusinessPageRenderer from "./business-page-renderer";

interface BusinessLivePreviewProps {
  businessData: BusinessData;
  businessId?: Id<"businesses">;
}

export default function BusinessLivePreview({
  businessData,
  businessId,
}: BusinessLivePreviewProps) {
  // If we have a businessId, fetch the actual page content
  const business = useQuery(
    api.businesses.getById,
    businessId ? { id: businessId } : "skip",
  );
  const domain = useQuery(
    api.domains.getByBusinessId,
    businessId ? { businessId } : "skip",
  );
  const page = useQuery(
    api.pages.getHomepageByDomain,
    domain ? { domainId: domain._id } : "skip",
  );

  // Create a mock business object for preview if no businessId
  const mockBusiness = {
    _id: "preview" as Id<"businesses">,
    _creationTime: Date.now(),
    name: businessData.name,
    address: businessData.address,
    phone: businessData.phone,
    email: "",
    website: businessData.website,
    hours: businessData.hours,
    description: businessData.description,
    rating: businessData.rating,
    reviews: businessData.reviews,
    photos: businessData.photos,
    domainId: "preview" as Id<"domains">,
    theme: {
      colorScheme: "modern",
      primaryColor: "#3B82F6",
      secondaryColor: "#10B981",
      accentColor: "#F59E0B",
      fontFamily: "Inter",
    },
    isPublished: false,
    placeId: businessData.placeId,
    createdAt: Date.now(),
  };

  // Create default page content for preview
  const defaultPageContent = {
    mode: "simple",
    sections: [
      {
        id: "hero-1",
        variationId: "hero-section",
        order: 0,
        data: {
          id: "hero-1",
          type: "hero-section",
          content: {
            title: businessData.name,
            subtitle: businessData.description || "Welcome to our business",
            backgroundImage: businessData.photos?.[0] || undefined,
            ctaText: "Contact Us",
            ctaLink: "#contact",
            overlay: true,
            overlayOpacity: 50,
          },
        },
      },
      {
        id: "about-1",
        variationId: "about-section",
        order: 1,
        data: {
          id: "about-1",
          type: "about-section",
          content: {
            title: "About Us",
            content:
              businessData.description ||
              `Welcome to ${businessData.name}. We are dedicated to providing excellent service to our customers.`,
            image: businessData.photos?.[1] || undefined,
            imagePosition: "right",
            features: [],
          },
        },
      },
      {
        id: "gallery-1",
        variationId: "gallery-grid",
        order: 2,
        data: {
          id: "gallery-1",
          type: "gallery-grid",
          content: {
            title: "Gallery",
            images:
              businessData.photos
                ?.filter((photo) => photo && photo.trim() !== "")
                .slice(0, 6)
                .map((photo, index) => ({
                  src: photo,
                  alt: `${businessData.name} image ${index + 1}`,
                })) || [],
            columns: 3,
          },
        },
      },
      {
        id: "contact-1",
        variationId: "contact-form-map",
        order: 3,
        data: {
          id: "contact-1",
          type: "contact-form-map",
          content: {
            title: "Contact Us",
            address: businessData.address,
            phone: businessData.phone,
            email: "",
            hours: businessData.hours,
            mapUrl: `https://maps.google.com/?q=${encodeURIComponent(businessData.address)}`,
            showMap: true,
            showForm: true,
          },
        },
      },
    ],
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
    },
  };

  const displayBusiness = business || mockBusiness;
  const pageContent = page?.content || JSON.stringify(defaultPageContent);

  return (
    <div className="w-full bg-background">
      <div className="border border-border rounded-lg overflow-hidden shadow-lg">
        {/* Browser mockup header */}
        <div className="bg-muted border-b border-border px-4 py-2 flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="bg-background border border-border rounded px-3 py-1 text-xs text-muted-foreground">
              {businessData.name.toLowerCase().replace(/\s+/g, "-")}
              .locasite.com
            </div>
          </div>
        </div>

        {/* Page content */}
        <div className="bg-background max-h-[600px] overflow-y-auto">
          <BusinessPageRenderer
            business={displayBusiness}
            pageContent={pageContent}
            mode="simple"
          />
        </div>
      </div>
    </div>
  );
}
