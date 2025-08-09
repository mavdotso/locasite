"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { BusinessData } from "@/convex/businesses";
import { toast } from "sonner";
import { useAuthActions } from "@convex-dev/auth/react";
import { env } from "@/env";

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
  const [createdBusinessId, setCreatedBusinessId] = useState<string | null>(null);
  const router = useRouter();
  const { signIn } = useAuthActions();
  const user = useQuery(api.auth.currentUser);

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

    // Clear previous business ID when starting a new preview
    setCreatedBusinessId(null);
    setIsLoading(true);
    setError(null);

    try {
      const convexUrl = env.NEXT_PUBLIC_CONVEX_URL;
      if (!convexUrl) {
        toast.error("Convex URL not configured");
        throw new Error("Convex URL not configured");
      }
      
      // Use URL API for robust parsing
      let deploymentName: string;
      try {
        const url = new URL(convexUrl);
        const hostname = url.hostname;
        deploymentName = hostname.split(".")[0];
        if (!deploymentName) {
          throw new Error("Missing deployment name");
        }
      } catch (urlError) {
        console.error("Invalid Convex URL:", urlError);
        toast.error("Invalid Convex URL configuration");
        throw new Error("Invalid Convex URL format");
      }
      
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
        
        // Enforce that preview always creates a business ID
        if (typeof data.businessId !== "string" || !data.businessId) {
          throw new Error("Preview did not return a valid businessId");
        }
        
        setCreatedBusinessId(data.businessId);
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
    if (!createdBusinessId) {
      toast.error("No business to publish. Please generate a preview first.");
      return;
    }

    if (user === undefined) {
      // Still loading user state
      return;
    }

    if (user === null) {
      // User not authenticated - redirect to sign in with direct post-auth redirect to the editor
      try {
        const redirectPath = `/business/${encodeURIComponent(createdBusinessId)}/edit`;
        await signIn("google", { redirectTo: redirectPath });
      } catch (error) {
        console.error("Error redirecting to sign in:", error);
        toast.error("Failed to redirect to sign in. Please try again.");
      }
      return;
    }

    // User is authenticated, just redirect to editor
    // Using replace to prevent back button confusion
    router.replace(`/business/${createdBusinessId}/edit`);
  };

  const resetPreview = () => {
    setPreviewData(null);
    setError(null);
    setCreatedBusinessId(null);
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
