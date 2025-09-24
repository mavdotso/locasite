"use client";

import { notFound, useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { SimpleEditorResponsive } from "@/app/components/simple-builder/core/simple-editor-responsive";
import type {
  SimplePageData,
  SectionInstance,
} from "@/app/components/simple-builder/types/simple-builder";
import { getVariationById } from "@/app/components/simple-builder/sections/section-variations";
import { getPresetByType } from "@/app/components/simple-builder/sections/business-presets";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";

export default function BusinessEdit({
  businessId,
}: {
  businessId: Id<"businesses">;
}) {
  const router = useRouter();
  const claimAttemptedRef = useRef(false);
  const syncAttemptedRef = useRef(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [initMessage, setInitMessage] = useState("Loading...");

  // All hooks must be called before any conditional returns
  const user = useQuery(api.auth.currentUser);

  // Use compound query to fetch all related data in one call
  const editData = useQuery(api.businessEditData.getBusinessEditData, {
    businessId,
  });

  const business = editData?.business;
  const domain = editData?.domain;
  const pages = editData?.pages;
  const syncStatus = editData?.syncStatus;

  // Mutations
  const updatePage = useMutation(api.pages.updatePage);
  const createDefaultPages = useMutation(
    api.pagesSimple.createDefaultPagesSimple,
  );
  const createPageWithContent = useMutation(
    api.pagesSimple.createPageWithContent,
  );
  const syncBusinessDomain = useMutation(
    api.businessDomainSync.syncBusinessDomain,
  );
  const claimBusinessAfterAuth = useMutation(
    api.businesses.claimBusinessAfterAuth,
  );

  // Combined initialization effect for claiming and syncing
  useEffect(() => {
    async function initializeBusiness() {
      if (!business || !user) return;

      let needsInitialization = false;

      // Step 1: Claim business if unclaimed
      if (!business.userId && !claimAttemptedRef.current) {
        claimAttemptedRef.current = true;
        needsInitialization = true;
        setIsInitializing(true);
        setInitMessage("Setting up your business...");

        try {
          const claimResult = await claimBusinessAfterAuth({ businessId: business._id });
          if (!claimResult.alreadyClaimed) {
            // Business was newly claimed
          }
        } catch (error) {
          console.error("Failed to claim business:", error);
          const errorMessage = error instanceof Error ? error.message : "Unknown error";
          if (errorMessage.includes("already claimed by another user")) {
            toast.error("This business has already been claimed by another user");
            router.push("/dashboard");
            return;
          } else {
            toast.error("Unable to claim this business. Please try again.");
            setIsInitializing(false);
            return;
          }
        }
      }

      // Step 2: Sync domain if needed (without page reload)
      if (syncStatus && !syncStatus.synced && !syncAttemptedRef.current && !pages) {
        syncAttemptedRef.current = true;
        if (!needsInitialization) {
          needsInitialization = true;
          setIsInitializing(true);
          setInitMessage("Finalizing setup...");
        }

        try {
          await syncBusinessDomain({ businessId: business._id });
          // Don't reload - the data will update reactively
        } catch (error) {
          console.error("Failed to sync domain:", error);
          // Don't show error toast for sync issues - they're not critical
        }
      }

      // Step 3: Complete initialization if we did anything
      if (needsInitialization) {
        // Small delay to ensure data updates have propagated
        setTimeout(() => {
          toast.success("Your business is ready!");
          setIsInitializing(false);
        }, 500);
      }
    }

    initializeBusiness();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [business?._id, business?.userId, user, syncStatus, pages]);

  // Loading state while fetching business or initializing
  if (editData === undefined || isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-sm w-full">
          <div className="flex flex-col items-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <h2 className="text-lg font-semibold mb-2">
              {isInitializing ? "Setting Up Your Business" : "Loading"}
            </h2>
            <p className="text-muted-foreground text-center">
              {initMessage}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Business not found
  if (editData === null || !business) {
    return notFound();
  }

  // Note: user is guaranteed to be defined if we reach this point (auth guard should handle null case)
  if (business.userId && user && business.userId !== user._id) {
    router.push(`/dashboard`);
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-sm w-full">
          <div className="flex flex-col items-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <h2 className="text-lg font-semibold mb-2">Redirecting</h2>
            <p className="text-muted-foreground text-center">
              Taking you to your dashboard...
            </p>
          </div>
        </div>
      </div>
    );
  }

  const page = pages?.[0];

  // Generate unique ID
  const generateId = () => Math.random().toString(36).substring(2, 9);

  let initialData: SimplePageData = {
    title: business?.name || "Welcome",
    sections: [],
    theme: {
      colors: {
        primary: "#000000",
        secondary: "#666666",
        accent: "#0066cc",
        background: "#ffffff",
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

  // Try to parse existing page content
  if (page?.content) {
    try {
      const parsed = JSON.parse(page.content);

      if (parsed.mode === "simple" && parsed.sections) {
        // Use the sections AS IS from the database - they were created correctly
        initialData = {
          title: parsed.title || business.name || "Welcome",
          sections: parsed.sections,
          theme: parsed.theme || initialData.theme,
        };
      } else {
        // If no content or it's in Pro mode, create default sections based on business type
        const businessType = detectBusinessType(business);
        const preset = getPresetByType(businessType);

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
      }
    } catch (e) {
      console.error("Failed to parse page content", e);
    }
  }

  const handleSave = async (data: SimplePageData) => {
    try {
      // Add mode to the data
      const pageData = {
        mode: "simple" as const,
        title: data.title,
        sections: data.sections,
        theme: data.theme,
      };

      if (page) {
        await updatePage({
          pageId: page._id,
          content: JSON.stringify(pageData),
        });
        toast.success("Page saved successfully");
      } else if (domain) {
        await createDefaultPages({
          domainId: domain._id,
          businessId: businessId,
        });
        toast.info(
          "Default pages created. Please refresh to continue editing.",
        );
      }
    } catch (error) {
      console.error("Error saving page:", error);
      toast.error("Failed to save page");
    }
  };

  const handlePublish = async (data: SimplePageData) => {
    try {
      const pageData = {
        mode: "simple" as const,
        title: data.title,
        sections: data.sections,
        theme: data.theme,
      };

      if (page) {
        // Just save the content, don't publish here
        // The PublishSettingsDialog will handle the actual publishing
        await updatePage({
          pageId: page._id,
          content: JSON.stringify(pageData),
        });
      } else if (domain) {
        await createPageWithContent({
          domainId: domain._id,
          businessId: businessId,
          content: JSON.stringify(pageData),
        });
      }
    } catch (error) {
      console.error("Error publishing page:", error);
      toast.error("Failed to save page content");
      throw error; // Re-throw to prevent the dialog from closing
    }
  };

  if (!domain || !pages) {
    if (syncStatus && !syncStatus.synced) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Setting up your website...</p>
            {business && (
              <p className="text-sm text-muted-foreground mt-2">
                {business.name}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-4">
              This may take a few moments...
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your website...</p>
          {business && (
            <p className="text-sm text-muted-foreground mt-2">
              {business.name}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Prepare business data for template variables
  const businessData = {
    businessName: business.name,
    businessAddress: business.address,
    businessPhone: business.phone || "",
    businessEmail: business.email || "",
    businessDescription: business.description || "",
    businessHours: business.hours.join(", "),
    businessWebsite: business.website || "",
  };

  return (
    <SimpleEditorResponsive
      initialData={initialData}
      businessData={businessData}
      businessId={businessId}
      business={business}
      isPublished={business.isPublished}
      onSaveAction={handleSave}
      onPublishAction={handlePublish}
    />
  );
}

// Helper function to detect business type from business data
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
    category.includes("salon") ||
    category.includes("beauty") ||
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
    category.includes("doctor") ||
    description.includes("medical") ||
    description.includes("clinic") ||
    name.includes("clinic") ||
    name.includes("medical")
  ) {
    return "medical";
  }

  if (
    category.includes("auto") ||
    category.includes("car") ||
    category.includes("mechanic") ||
    description.includes("auto") ||
    description.includes("car repair") ||
    name.includes("auto") ||
    name.includes("garage")
  ) {
    return "automotive";
  }

  if (
    category.includes("shop") ||
    category.includes("store") ||
    category.includes("retail") ||
    description.includes("shop") ||
    description.includes("store") ||
    name.includes("shop") ||
    name.includes("store")
  ) {
    return "retail";
  }

  // Default to professional services
  return "professional";
}
