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
  };
}

export const SUBSCRIPTION_PLANS: Record<PlanType, SubscriptionPlan> = {
  FREE: {
    name: "Free",
    price: 0,
    priceId: "",
    features: [
      "1 business site",
      "Basic customization",
      "Locasite subdomain",
      "Basic analytics (Coming soon)",
    ],
    limits: {
      businesses: 1,
      customDomains: 0,
      analytics: false,
      removeWatermark: false,
      prioritySupport: false,
      apiAccess: false,
    },
  },
  PROFESSIONAL: {
    name: "Professional",
    price: 1900, // $19/month
    priceId:
      convexEnv.STRIPE_PRICE_PROFESSIONAL || "price_professional_monthly",
    features: [
      "Unlimited business sites",
      "Advanced customization",
      "Remove Locasite branding",
      "Priority support",
      "Advanced analytics (Coming soon)",
      "Custom favicon",
    ],
    limits: {
      businesses: -1, // unlimited
      customDomains: 0,
      analytics: true,
      removeWatermark: true,
      prioritySupport: true,
      apiAccess: false,
    },
  },
  BUSINESS: {
    name: "Business",
    price: 4900, // $49/month
    priceId: convexEnv.STRIPE_PRICE_BUSINESS || "price_business_monthly",
    features: [
      "Everything in Professional",
      "White-label solution",
      "API access",
      "Custom domains",
      "Advanced SEO tools",
      "Dedicated support",
    ],
    limits: {
      businesses: -1, // unlimited
      customDomains: -1, // unlimited
      analytics: true,
      removeWatermark: true,
      prioritySupport: true,
      apiAccess: true,
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
