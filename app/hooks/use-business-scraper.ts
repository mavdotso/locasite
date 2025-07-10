"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { BusinessData } from "@/convex/businesses";
import { toast } from "sonner";

export interface UseBusinessScraperResult {
  url: string;
  setUrl: (url: string) => void;
  isLoading: boolean;
  previewData: BusinessData | null;
  error: string | null;
  handleGeneratePreview: () => Promise<void>;
  handleCreateWebsite: () => Promise<void>;
  resetPreview: () => void;
}

export function useBusinessScraper(): UseBusinessScraperResult {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [previewData, setPreviewData] = useState<BusinessData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
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
      console.error("Error scraping business:", error);
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

      if (data.success && data.data) {
        const result = await createFromPending({
          businessData: data.data,
          aiContent: null,
        });

        if (result.businessId) {
          toast.success("Website created successfully!");
          router.push(`/business/${result.businessId}/edit`);
        }
      } else if (data.businessData) {
        // Fallback for different response format
        const result = await createFromPending({
          businessData: data.businessData,
          aiContent: null,
        });

        if (result.businessId) {
          toast.success("Website created successfully!");
          router.push(`/business/${result.businessId}/edit`);
        }
      }
    } catch (error) {
      console.error("Error creating website:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to create website. Please try again.";
      
      if (errorMessage.includes("Unauthorized") || errorMessage.includes("logged in")) {
        toast.error("You must be signed in to create a website. Please sign in and try again.");
        setError("You must be signed in to create a website");
      } else {
        toast.error(errorMessage);
        setError(errorMessage);
      }
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
  };
}