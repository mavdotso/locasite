"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  PlanType,
  SUBSCRIPTION_PLANS,
  PLAN_DISPLAY_NAMES,
} from "@/convex/lib/plans";

export function useSubscription() {
  const currentUser = useQuery(api.auth.currentUser);
  const subscription = useQuery(
    api.subscriptions.getUserSubscription,
    currentUser ? {} : "skip",
  );

  const planType: PlanType = subscription?.planType || "FREE";
  const isActive =
    subscription?.status === "active" || subscription?.status === "trialing";

  const effectivePlan = isActive ? planType : "FREE";
  const limits = SUBSCRIPTION_PLANS[effectivePlan].limits;

  return {
    planType: effectivePlan,
    planDisplayName: PLAN_DISPLAY_NAMES[effectivePlan],
    subscription,
    isLoading:
      currentUser === undefined || (currentUser && subscription === undefined),

    // Granular feature access
    canEditContent: limits.contentEditing,
    canAccessAnalytics: limits.analytics,
    canUseCustomDomain: limits.customDomains !== 0,
    canUseSeoEditor: limits.seoEditor,
    canRemoveWatermark: limits.removeWatermark,
    canUseVisualEditor: limits.visualEditor,
    canUseGoogleReviews: limits.googleReviews,
    canUsePhotoGallery: limits.photoGallery,
    canUseMenuManagement: limits.menuManagement,
    themeLimit: limits.themeCount,
    monthlyVisitsSoftCap: limits.monthlyVisitsSoftCap,

    // Legacy helper
    canUseFeature: (requiredPlan: PlanType) => {
      const plans: PlanType[] = ["FREE", "PROFESSIONAL", "BUSINESS"];
      const currentIndex = plans.indexOf(effectivePlan);
      const requiredIndex = plans.indexOf(requiredPlan);
      return currentIndex >= requiredIndex;
    },
  };
}
