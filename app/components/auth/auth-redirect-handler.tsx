"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";

export function AuthRedirectHandler() {
  const router = useRouter();
  const user = useQuery(api.auth.currentUser);
  const claimBusiness = useMutation(api.businessClaims.claimBusiness);

  useEffect(() => {
    if (!user) return;

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
        router.push("/dashboard/sites");
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
    if (pendingData) {
      sessionStorage.removeItem("pendingBusinessData");
      // This is handled by the existing flow
      return;
    }

    // Check for general auth redirect
    const authRedirect = sessionStorage.getItem("authRedirect");
    if (authRedirect) {
      sessionStorage.removeItem("authRedirect");
      router.push(authRedirect);
      return;
    }
  }, [user, router, claimBusiness]);

  return null;
}
