"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import { BusinessData } from "@/convex/businesses";

export function AuthRedirectHandler() {
  const router = useRouter();
  const user = useQuery(api.auth.currentUser);
  const claimBusiness = useMutation(api.businessClaims.claimBusiness);
  const createFromPending = useMutation(
    api.businesses.createBusinessFromPendingData,
  );

  useEffect(() => {
    // Wait for user state to be loaded (not undefined)
    if (user === undefined) return;

    // If user is null (not authenticated), don't proceed
    if (user === null) return;

    const handleClaimAndRedirect = async (businessId: Id<"businesses">) => {
      try {
        // Try to claim the business (will fail if already owned)
        try {
          await claimBusiness({ businessId });
          toast.success(
            "Business claimed successfully! You can now edit your website.",
          );
        } catch (claimError) {
          // If the error is because user already owns it, that's fine
          const errorMessage =
            claimError instanceof Error
              ? claimError.message
              : String(claimError);
          if (!errorMessage.includes("already claimed")) {
            throw claimError;
          }
        }

        // Redirect to edit page
        router.push(`/business/${businessId}/edit`);
      } catch (error) {
        console.error("Error claiming business:", error);
        toast.error("Failed to claim business. Please try again.");

        // Fallback to dashboard
        router.push("/dashboard");
      }
    };

    // Check for business to claim and redirect to editor
    const claimBusinessId = sessionStorage.getItem("claimBusinessId");
    const redirectToEditor = sessionStorage.getItem("redirectToEditor");

    if (claimBusinessId && redirectToEditor === "true") {
      // Clear the session storage
      sessionStorage.removeItem("claimBusinessId");
      sessionStorage.removeItem("redirectToEditor");

      // Claim the business and redirect to editor
      handleClaimAndRedirect(claimBusinessId as Id<"businesses">);
      return;
    }

    // Check for pending business data (from landing page)
    const pendingData = sessionStorage.getItem("pendingBusinessData");
    const pendingUrl = sessionStorage.getItem("pendingBusinessUrl");
    if (pendingData && pendingUrl) {
      sessionStorage.removeItem("pendingBusinessData");
      sessionStorage.removeItem("pendingBusinessUrl");

      // Create the website from pending data
      const createWebsiteFromPending = async () => {
        try {
          JSON.parse(pendingData) as BusinessData; // Validate the data structure

          // Fetch the full business data again
          const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "";
          const deploymentName = convexUrl.split("//")[1]?.split(".")[0];
          const convexSiteUrl = `https://${deploymentName}.convex.site`;

          const response = await fetch(`${convexSiteUrl}/scrape`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ url: pendingUrl }),
          });

          const data = await response.json();

          if (data.error) {
            throw new Error(data.error);
          }

          const scrapedData =
            data.success && data.data ? data.data : data.businessData;

          if (scrapedData) {
            // Fix the photo field name mismatch
            const businessData = { ...scrapedData } as BusinessData & {
              googlePhotoUrls?: string[];
            };
            if (
              "googlePhotoUrls" in businessData &&
              businessData.googlePhotoUrls
            ) {
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
          }
        } catch (error) {
          console.error("Error creating website from pending data:", error);
          toast.error("Failed to create website. Please try again.");
          router.push("/dashboard");
        }
      };

      createWebsiteFromPending();
      return;
    }

    // Check for general auth redirect
    const authRedirect = sessionStorage.getItem("authRedirect");
    if (authRedirect) {
      sessionStorage.removeItem("authRedirect");
      router.push(authRedirect);
      return;
    }
  }, [user, router, claimBusiness, createFromPending]);

  return null;
}
