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
      // Header section
      {
        id: "header-1",
        variationId: "header-section",
        order: 0,
        data: {
          id: "header-1",
          type: "header-section",
          content: {
            logo: businessData.name,
            logoAlt: businessData.name,
            menuItems: [
              { label: "Home", link: "#hero" },
              { label: "About", link: "#about" },
              { label: "Gallery", link: "#gallery" },
              { label: "Reviews", link: "#reviews" },
              { label: "Contact", link: "#contact" },
            ],
            showButton: true,
            buttonText: "Get in Touch",
            buttonLink: "#contact",
          },
        },
      },
      // Hero section with better styling
      {
        id: "hero-1",
        variationId: "hero-section",
        order: 1,
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
            overlayOpacity: 40,
            height: "large",
          },
        },
      },
      // About section
      {
        id: "about-1",
        variationId: "about-section",
        order: 2,
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
      // Reviews section
      {
        id: "reviews-1",
        variationId: "reviews-section",
        order: 3,
        data: {
          id: "reviews-1",
          type: "reviews-section",
          content: {
            title: "What Our Customers Say",
            subtitle: businessData.rating
              ? `${businessData.rating} ★ Rating`
              : "Customer Reviews",
            reviews: businessData.reviews?.slice(0, 3).map((review, index) => ({
              id: `review-${index}`,
              author: review.reviewer || `Customer ${index + 1}`,
              rating: parseInt(review.rating) || 5,
              content: review.text || "Great experience!",
              date: "Recently",
            })) || [
              {
                id: "review-1",
                author: "John Doe",
                rating: 5,
                content: "Excellent service and great experience!",
                date: "Last week",
              },
              {
                id: "review-2",
                author: "Jane Smith",
                rating: 5,
                content: "Highly recommend! Professional and friendly staff.",
                date: "2 weeks ago",
              },
            ],
          },
        },
      },
      // Gallery section
      {
        id: "gallery-1",
        variationId: "gallery-grid",
        order: 4,
        data: {
          id: "gallery-1",
          type: "gallery-grid",
          content: {
            title: "Gallery",
            subtitle: "Take a look at our work",
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
      // Contact section
      {
        id: "contact-1",
        variationId: "contact-form-map",
        order: 5,
        data: {
          id: "contact-1",
          type: "contact-form-map",
          content: {
            title: "Get in Touch",
            subtitle: "We'd love to hear from you",
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
      spacing: {
        sectionPadding: "80px",
      },
    },
  };

  const displayBusiness = business || mockBusiness;
  const pageContent = page?.content || JSON.stringify(defaultPageContent);

  return (
    <div className="w-full bg-background">
      <BusinessPageRenderer
        business={displayBusiness}
        pageContent={pageContent}
        mode="simple"
      />
    </div>
  );
}
