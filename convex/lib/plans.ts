import { convexEnv } from "./env";

export type PlanType = "FREE" | "PROFESSIONAL" | "BUSINESS";

export interface SubscriptionPlan {
  name: string;
  price: number; // in cents
  priceId: string;
  features: string[];
  limits: {
    businesses: number;
    customDomains: number;
    analytics: boolean;
    removeWatermark: boolean;
    prioritySupport: boolean;
    apiAccess: boolean;
    contentEditing: boolean;
    seoEditor: boolean;
    visualEditor: boolean;
    googleReviews: boolean;
    photoGallery: boolean;
    menuManagement: boolean;
    themeCount: number; // -1 = unlimited
    monthlyVisitsSoftCap: number; // -1 = unlimited
  };
}

export const PLAN_DISPLAY_NAMES: Record<PlanType, string> = {
  FREE: "Free",
  PROFESSIONAL: "Starter",
  BUSINESS: "Pro",
};

export const SUBSCRIPTION_PLANS: Record<PlanType, SubscriptionPlan> = {
  FREE: {
    name: "Free",
    price: 0,
    priceId: "",
    features: [
      "1 business site",
      "Locosite subdomain",
      "Content editing",
      "Photo gallery",
      "Google Reviews",
      "Contact form",
      "Powered by Locosite badge",
    ],
    limits: {
      businesses: 1,
      customDomains: 0,
      analytics: false,
      removeWatermark: false,
      prioritySupport: false,
      apiAccess: false,
      contentEditing: true,
      seoEditor: false,
      visualEditor: false,
      googleReviews: true,
      photoGallery: true,
      menuManagement: false,
      themeCount: 1,
      monthlyVisitsSoftCap: -1, // unlimited
    },
  },
  PROFESSIONAL: {
    name: "Starter",
    price: 900, // $9/month
    priceId:
      convexEnv.STRIPE_PRICE_PROFESSIONAL || "price_starter_monthly",
    features: [
      "Content editing",
      "Unlimited visitors",
      "Basic analytics",
      "5 themes",
      "Remove Locosite branding",
      "Contact form",
      "Locosite subdomain",
    ],
    limits: {
      businesses: 1,
      customDomains: 0,
      analytics: true,
      removeWatermark: true,
      prioritySupport: false,
      apiAccess: false,
      contentEditing: true,
      seoEditor: false,
      visualEditor: false,
      googleReviews: false,
      photoGallery: false,
      menuManagement: false,
      themeCount: 5,
      monthlyVisitsSoftCap: -1, // unlimited
    },
  },
  BUSINESS: {
    name: "Pro",
    price: 2900, // $29/month
    priceId: convexEnv.STRIPE_PRICE_BUSINESS || "price_pro_monthly",
    features: [
      "Everything in Starter",
      "Custom domain",
      "Full visual editor",
      "Google Reviews widget",
      "Photo gallery",
      "Menu management",
      "SEO meta editor",
      "Priority support",
    ],
    limits: {
      businesses: -1, // unlimited
      customDomains: -1, // unlimited
      analytics: true,
      removeWatermark: true,
      prioritySupport: true,
      apiAccess: false,
      contentEditing: true,
      seoEditor: true,
      visualEditor: true,
      googleReviews: true,
      photoGallery: true,
      menuManagement: true,
      themeCount: -1, // unlimited
      monthlyVisitsSoftCap: -1, // unlimited
    },
  },
};

export const PLAN_TYPES = Object.keys(SUBSCRIPTION_PLANS) as PlanType[];

export function getPlanByPriceId(priceId: string): PlanType | null {
  for (const [planType, plan] of Object.entries(SUBSCRIPTION_PLANS)) {
    if (plan.priceId === priceId) {
      return planType as PlanType;
    }
  }
  return null;
}

export function canCreateBusiness(
  planType: PlanType,
  currentBusinessCount: number,
): boolean {
  const plan = SUBSCRIPTION_PLANS[planType];
  if (plan.limits.businesses === -1) return true; // unlimited
  return currentBusinessCount < plan.limits.businesses;
}

export function canUseCustomDomain(planType: PlanType): boolean {
  return SUBSCRIPTION_PLANS[planType].limits.customDomains !== 0;
}

export function canRemoveWatermark(planType: PlanType): boolean {
  return SUBSCRIPTION_PLANS[planType].limits.removeWatermark;
}

export function canAccessAnalytics(planType: PlanType): boolean {
  return SUBSCRIPTION_PLANS[planType].limits.analytics;
}

export function canAccessAPI(planType: PlanType): boolean {
  return SUBSCRIPTION_PLANS[planType].limits.apiAccess;
}

export function canEditContent(planType: PlanType): boolean {
  return SUBSCRIPTION_PLANS[planType].limits.contentEditing;
}

export function canUseSeoEditor(planType: PlanType): boolean {
  return SUBSCRIPTION_PLANS[planType].limits.seoEditor;
}

export function canUseVisualEditor(planType: PlanType): boolean {
  return SUBSCRIPTION_PLANS[planType].limits.visualEditor;
}

export function canUseGoogleReviews(planType: PlanType): boolean {
  return SUBSCRIPTION_PLANS[planType].limits.googleReviews;
}

export function canUsePhotoGallery(planType: PlanType): boolean {
  return SUBSCRIPTION_PLANS[planType].limits.photoGallery;
}

export function canUseMenuManagement(planType: PlanType): boolean {
  return SUBSCRIPTION_PLANS[planType].limits.menuManagement;
}

export function getThemeLimit(planType: PlanType): number {
  return SUBSCRIPTION_PLANS[planType].limits.themeCount;
}

export function getVisitSoftCap(planType: PlanType): number {
  return SUBSCRIPTION_PLANS[planType].limits.monthlyVisitsSoftCap;
}
