"use client";

import { Preloaded, usePreloadedQuery, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id, Doc } from "@/convex/_generated/dataModel";
import { SectionRenderer } from "@/app/components/simple-builder/sections/section-renderer";
import { Button } from "@/app/components/ui/button";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles } from "lucide-react";
import { getVariationById } from "@/app/components/simple-builder/sections/section-variations";
import { getPresetByType } from "@/app/components/simple-builder/sections/business-presets";
import type {
  SimplePageData,
  SectionInstance,
} from "@/app/components/simple-builder/types/simple-builder";

interface BusinessPreviewWrapperProps {
  businessId: Id<"businesses">;
  preloadedBusiness: Preloaded<typeof api.businesses.getByIdWithDraft>;
}

// Helper function to detect business type - matches the one in business-edit-client.tsx
function detectBusinessType(business: {
  category?: string;
  description?: string;
  name?: string;
}):
  | "restaurant"
  | "salon"
  | "medical"
  | "professional"
  | "retail"
  | "automotive" {
  const category = business.category?.toLowerCase() || "";
  const description = business.description?.toLowerCase() || "";
  const name = business.name?.toLowerCase() || "";

  if (
    category.includes("restaurant") ||
    category.includes("food") ||
    category.includes("cafe") ||
    description.includes("restaurant") ||
    description.includes("dining") ||
    name.includes("restaurant") ||
    name.includes("cafe")
  ) {
    return "restaurant";
  }

  if (
    category.includes("beauty") ||
    category.includes("salon") ||
    category.includes("spa") ||
    description.includes("salon") ||
    description.includes("beauty") ||
    name.includes("salon") ||
    name.includes("spa")
  ) {
    return "salon";
  }

  if (
    category.includes("medical") ||
    category.includes("health") ||
    category.includes("clinic") ||
    description.includes("medical") ||
    description.includes("doctor") ||
    name.includes("clinic") ||
    name.includes("medical")
  ) {
    return "medical";
  }

  if (
    category.includes("retail") ||
    category.includes("store") ||
    category.includes("shop") ||
    description.includes("retail") ||
    description.includes("store") ||
    name.includes("shop") ||
    name.includes("store")
  ) {
    return "retail";
  }

  if (
    category.includes("auto") ||
    category.includes("car") ||
    category.includes("mechanic") ||
    description.includes("auto") ||
    description.includes("repair") ||
    name.includes("auto") ||
    name.includes("mechanic")
  ) {
    return "automotive";
  }

  // Default to professional for all others
  return "professional";
}

export function BusinessPreviewWrapper({
  businessId,
  preloadedBusiness,
}: BusinessPreviewWrapperProps) {
  const business = usePreloadedQuery(preloadedBusiness);
  const { signIn } = useAuthActions();
  const router = useRouter();
  const user = useQuery(api.auth.currentUser);

  const domain = useQuery(
    api.domains.getByBusinessId,
    business ? { businessId } : "skip",
  );

  const page = useQuery(
    api.pages.getByDomainId,
    domain ? { domainId: domain._id } : "skip",
  );

  if (!business) {
    return <div>Business not found</div>;
  }

  if (!domain) {
    return (
      <div className="space-y-4">
        <div className="h-16 w-full bg-muted animate-pulse rounded" />
        <div className="h-96 w-full bg-muted animate-pulse rounded" />
        <div className="h-64 w-full bg-muted animate-pulse rounded" />
        <div className="h-32 w-full bg-muted animate-pulse rounded" />
      </div>
    );
  }

  const handleCreateWebsite = async () => {
    if (!user) {
      // Store the business ID to claim after sign-in
      sessionStorage.setItem("claimBusinessId", businessId);
      sessionStorage.setItem("redirectToEditor", "true");
      await signIn("google");
    } else {
      // User is logged in, redirect to edit page
      router.push(`/business/${businessId}/edit`);
    }
  };

  // Generate unique ID
  const generateId = () => Math.random().toString(36).substring(2, 9);

  let pageContent: string = "";
  let useExistingContent = false;

  if (page?.content) {
    // Parse existing content and ensure it's in simple mode
    try {
      const parsed = JSON.parse(page.content);
      if (parsed.mode === "simple" && parsed.sections) {
        // Use existing simple mode content
        pageContent = page.content;
        useExistingContent = true;
      }
    } catch {
      // Invalid JSON, will create default content
    }
  }

  if (!useExistingContent) {
    const businessType = detectBusinessType(business);
    const preset = getPresetByType(businessType);

    const initialData: SimplePageData = {
      title: business.name || "Welcome",
      sections: [],
      theme: {
        colors: {
          primary: "#000000",
          secondary: "#666666",
          accent: "#0066cc",
          background: "#ffffff", // Default white background for preview
          text: "#333333",
          muted: "#f5f5f5",
        },
        fonts: {
          heading: "Inter",
          body: "Inter",
        },
        spacing: {
          section: "80px",
          element: "40px",
        },
      },
    };

    if (preset) {
      // Apply preset sections
      initialData.sections = preset.sections
        .map((sectionConfig, index) => {
          const variation = getVariationById(sectionConfig.variationId);
          if (!variation) return null;

          return {
            id: generateId(),
            variationId: sectionConfig.variationId,
            order: index,
            data: JSON.parse(JSON.stringify(variation.template)), // Deep clone
          } as SectionInstance;
        })
        .filter(Boolean) as SectionInstance[];

      initialData.theme = preset.theme;
    } else {
      // Default sections if no preset matches
      initialData.sections = [
        {
          id: generateId(),
          variationId: "hero-center-bg",
          order: 0,
          data: getVariationById("hero-center-bg")!.template,
        },
        {
          id: generateId(),
          variationId: "about-text-image",
          order: 1,
          data: getVariationById("about-text-image")!.template,
        },
        {
          id: generateId(),
          variationId: "services-3-column",
          order: 2,
          data: getVariationById("services-3-column")!.template,
        },
        {
          id: generateId(),
          variationId: "contact-form-map",
          order: 3,
          data: getVariationById("contact-form-map")!.template,
        },
      ];
    }

    // Add mode to the data
    const pageData = {
      mode: "simple" as const,
      title: initialData.title,
      sections: initialData.sections,
      theme: initialData.theme,
    };

    pageContent = JSON.stringify(pageData);
  }

  // Render the business preview content
  const renderBusinessPreview = (
    business: Doc<"businesses">,
    pageContent: string,
  ) => {
    // Parse the page content
    let parsedContent: {
      mode?: "simple" | "pro";
      sections?: SectionInstance[];
      theme?: SimplePageData["theme"];
    };

    try {
      parsedContent = JSON.parse(pageContent);
    } catch (e) {
      console.error("Failed to parse page content", e);
      return <main className="flex-grow"></main>;
    }

    // Prepare business data for template variable replacement
    const businessData = {
      businessName: business.name,
      businessAddress: business.address,
      businessPhone: business.phone,
      businessEmail: business.email,
      businessDescription: business.description,
      businessHours: business.hours,
      businessWebsite: business.website,
      businessPhotos: business.photos,
      businessMainPhoto: business.photos?.[0],
    };

    // Only render simple mode sections
    if (parsedContent.sections) {
      return (
        <main className="flex-grow">
          {/* Apply theme if available */}
          {parsedContent.theme && (
            <style jsx global>{`
              :root {
                --simple-primary: ${parsedContent.theme.colors.primary};
                --simple-secondary: ${parsedContent.theme.colors.secondary};
                --simple-accent: ${parsedContent.theme.colors.accent};
                --simple-background: ${parsedContent.theme.colors.background};
                --simple-text: ${parsedContent.theme.colors.text};
                --simple-muted: ${parsedContent.theme.colors.muted};
                --simple-font-heading: ${parsedContent.theme.fonts.heading};
                --simple-font-body: ${parsedContent.theme.fonts.body};
              }
              .simple-section {
                font-family: var(--simple-font-body);
              }
              .simple-section h1,
              .simple-section h2,
              .simple-section h3,
              .simple-section h4,
              .simple-section h5,
              .simple-section h6 {
                font-family: var(--simple-font-heading);
              }
            `}</style>
          )}

          {/* Render sections */}
          {parsedContent.sections
            .sort((a, b) => a.order - b.order)
            .map((section) => (
              <SectionRenderer
                key={section.id}
                data={section.data}
                businessData={businessData}
                businessId={business._id}
                editMode={false}
              />
            ))}
        </main>
      );
    }

    // No content to render
    return <main className="flex-grow"></main>;
  };

  return (
    <div className="relative">
      {/* Sticky CTA Bar */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold">
                {business.name} - Preview
              </h1>
              <p className="text-sm text-muted-foreground">
                This is how your website will look
              </p>
            </div>
            <Button size="lg" onClick={handleCreateWebsite} className="gap-2">
              <Sparkles className="w-4 h-4" />
              Create this website
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Business Page Content - Preview only renders simple mode */}
      {renderBusinessPreview(business, pageContent)}
    </div>
  );
}
