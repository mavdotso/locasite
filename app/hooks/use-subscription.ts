"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { PlanType } from "@/convex/lib/plans";

export function useSubscription() {
  const currentUser = useQuery(api.auth.currentUser);
  const subscription = useQuery(
    api.subscriptions.getUserSubscription,
    currentUser ? {} : "skip",
  );

  const planType: PlanType = subscription?.planType || "FREE";
  const isActive =
    subscription?.status === "active" || subscription?.status === "trialing";

  return {
    planType: isActive ? planType : "FREE",
    subscription,
    isLoading:
      currentUser === undefined || (currentUser && subscription === undefined),
    canUseFeature: (requiredPlan: PlanType) => {
      const plans: PlanType[] = ["FREE", "PROFESSIONAL", "BUSINESS"];
      const currentIndex = plans.indexOf(isActive ? planType : "FREE");
      const requiredIndex = plans.indexOf(requiredPlan);
      return currentIndex >= requiredIndex;
    },
  };
}
