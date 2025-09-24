"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";

export function AuthRedirectHandler() {
  const router = useRouter();
  const userWithSub = useQuery(api.auth.currentUserWithSubscription);
  const user = userWithSub?.user;
  const claimBusiness = useMutation(api.businessClaims.claimBusiness);

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
          console.error("Error claiming business:", claimError);
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

    // The pending business is now handled in HomePage to avoid seeing the landing page
    // This handler only needs to handle other redirect cases

    const authRedirect = sessionStorage.getItem("authRedirect");
    if (authRedirect) {
      sessionStorage.removeItem("authRedirect");
      router.push(authRedirect);
      return;
    }
  }, [user, router, claimBusiness]);

  return null;
}
