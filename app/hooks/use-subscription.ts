"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { PlanType } from "@/convex/lib/plans";

export function useSubscription() {
  // Use combined query that fetches user and subscription in one go
  const userWithSubscription = useQuery(api.auth.currentUserWithSubscription);

  const subscription = userWithSubscription?.subscription;
  const planType: PlanType = subscription?.planType || "FREE";
  const isActive =
    subscription?.status === "active" || subscription?.status === "trialing";

  return {
    planType: isActive ? planType : "FREE",
    subscription,
    isLoading: userWithSubscription === undefined,
    canUseFeature: (requiredPlan: PlanType) => {
      const plans: PlanType[] = ["FREE", "PROFESSIONAL", "BUSINESS"];
      const currentIndex = plans.indexOf(isActive ? planType : "FREE");
      const requiredIndex = plans.indexOf(requiredPlan);
      return currentIndex >= requiredIndex;
    },
  };
}
