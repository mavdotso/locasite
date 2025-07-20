"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { BusinessData } from "@/convex/businesses";
import { toast } from "sonner";
import { useAuthActions } from "@convex-dev/auth/react";

export interface UseBusinessScraperResult {
  url: string;
  setUrl: (url: string) => void;
  isLoading: boolean;
  previewData: BusinessData | null;
  error: string | null;
  handleGeneratePreview: () => Promise<void>;
  handleCreateWebsite: () => Promise<void>;
  resetPreview: () => void;
  isUserLoading: boolean;
}

export function useBusinessScraper(): UseBusinessScraperResult {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [previewData, setPreviewData] = useState<BusinessData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { signIn } = useAuthActions();
  const user = useQuery(api.auth.currentUser);
  const createFromPending = useMutation(
    api.businesses.createBusinessFromPendingData,
  );

  const validateUrl = (url: string): boolean => {
    return (
      url.includes("google.com/maps") ||
      url.includes("maps.google.com") ||
      url.includes("goo.gl/maps") ||
      url.includes("maps.app.goo.gl")
    );
  };

  const handleGeneratePreview = async () => {
    if (!url.trim()) {
      toast.error("Please enter a Google Maps URL");
      setError("Please enter a Google Maps URL");
      return;
    }

    if (!validateUrl(url)) {
      toast.error(
        "Please enter a valid Google Maps URL. Example: https://maps.app.goo.gl/...",
      );
      setError("Please enter a valid Google Maps URL");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "";

      if (!convexUrl) {
        throw new Error("Convex URL not configured");
      }

      const deploymentName = convexUrl.split("//")[1]?.split(".")[0];
      const convexSiteUrl = `https://${deploymentName}.convex.site`;

      const response = await fetch(`${convexSiteUrl}/scrape`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url, preview: true }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.success && data.data) {
        setPreviewData(data.data);
        toast.success("Preview generated successfully!");
      } else if (data.businessData) {
        // Fallback for different response format
        setPreviewData(data.businessData);
        toast.success("Preview generated successfully!");
      } else {
        throw new Error("No business data returned");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      toast.error(`Failed to generate preview: ${errorMessage}`);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateWebsite = async () => {
    if (!previewData) return;

    if (user === undefined) {
      // Still loading user state
      return;
    }

    if (user === null) {
      // User is definitely not authenticated
      // Store the preview data and URL in session storage
      sessionStorage.setItem("pendingBusinessUrl", url);
      sessionStorage.setItem(
        "pendingBusinessData",
        JSON.stringify(previewData),
      );

      // Redirect to sign in
      toast.info("Please sign in to create your website");
      try {
        await signIn("google");
      } catch (error) {
        console.error("Error redirecting to sign in:", error);
        toast.error("Failed to redirect to sign in. Please try again.");
      }
      return;
    }

    setIsLoading(true);
    try {
      // For the preview, we need to fetch the full business data again
      const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "";
      const deploymentName = convexUrl.split("//")[1]?.split(".")[0];
      const convexSiteUrl = `https://${deploymentName}.convex.site`;

      const response = await fetch(`${convexSiteUrl}/scrape`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Extract the business data from the response
      let scrapedBusinessData = null;
      if (data.success && data.data) {
        scrapedBusinessData = data.data;
      } else if (data.businessData) {
        scrapedBusinessData = data.businessData;
      } else if (data.business) {
        scrapedBusinessData = data.business;
      } else {
        // If the response IS the business data directly
        if (data.name && data.placeId) {
          scrapedBusinessData = data;
        }
      }

      if (!scrapedBusinessData) {
        throw new Error("No business data found in response");
      }

      try {
        // Fix the photo field name mismatch
        const businessData = { ...scrapedBusinessData } as BusinessData & {
          googlePhotoUrls?: string[];
        };
        if ("googlePhotoUrls" in businessData && businessData.googlePhotoUrls) {
          businessData.photos = businessData.googlePhotoUrls;
          delete businessData.googlePhotoUrls;
        }

        const result = await createFromPending({
          businessData,
          aiContent: null,
        });

        if (result.businessId) {
          toast.success("Website created successfully!");
          router.push(`/business/${result.businessId}/edit`);
        }
      } catch (mutationError) {
        throw mutationError;
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to create website. Please try again.";

      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const resetPreview = () => {
    setPreviewData(null);
    setError(null);
  };

  return {
    url,
    setUrl,
    isLoading,
    previewData,
    error,
    handleGeneratePreview,
    handleCreateWebsite,
    resetPreview,
    isUserLoading: user === undefined,
  };
}
