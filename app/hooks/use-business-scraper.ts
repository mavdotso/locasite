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

    setIsLoading(true);
    setError(null);

    try {
      const convexUrl = env.NEXT_PUBLIC_CONVEX_URL;
      const deploymentName = convexUrl.split("//")[1]?.split(".")[0];
      const convexSiteUrl = `https://${deploymentName}.convex.site`;

      const response = await fetch(`${convexSiteUrl}/scrape`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
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
        
        // Store the businessId that was created
        if (data.businessId) {
          setCreatedBusinessId(data.businessId);
          sessionStorage.setItem("previewBusinessId", data.businessId);
        }
        
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
      // User not authenticated - redirect to sign in with the business editor URL as the redirect target
      try {
        // Build the redirect URL
        const redirectUrl = `/business/${createdBusinessId}/edit`;
        
        // Sign in with Google and specify where to redirect after auth
        await signIn("google", {
          redirectTo: redirectUrl
        });
      } catch (error) {
        console.error("Error redirecting to sign in:", error);
        toast.error("Failed to redirect to sign in. Please try again.");
      }
      return;
    }

    // User is authenticated, just redirect to editor
    router.push(`/business/${createdBusinessId}/edit`);
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
