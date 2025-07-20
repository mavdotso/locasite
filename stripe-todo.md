# Stripe Payment Implementation Plan for Locasite

## Overview

Monolink implements a sophisticated Stripe integration with subscription management, webhook handling, and customer portal access. The implementation follows these key patterns:

## Phase 1: Dependencies & Environment Setup

### 1.1 Add Required Dependencies

```bash
bun add stripe
```

### 1.2 Environment Variables

Add to `.env.local`:

```env
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOKS_SECRET=whsec_...
```

## Phase 2: Database Schema Extensions

### 2.1 Update `convex/schema.ts`

Add these new tables:

```typescript
stripeCustomers: defineTable({
  userId: v.id("users"),
  stripeCustomerId: v.string(),
}).index("by_user", ["userId"]),

stripeSubscriptions: defineTable({
  customerId: v.string(),
  subscriptionId: v.optional(v.string()),
  status: v.string(),
  priceId: v.optional(v.string()),
  planType: v.optional(v.union(
    v.literal("FREE"),
    v.literal("PROFESSIONAL"),
    v.literal("BUSINESS")
  )),
  currentPeriodStart: v.optional(v.number()),
  currentPeriodEnd: v.optional(v.number()),
  cancelAtPeriodEnd: v.optional(v.boolean()),
  paymentMethod: v.optional(
    v.object({
      brand: v.optional(v.string()),
      last4: v.optional(v.string()),
    })
  ),
}).index("by_customerId", ["customerId"]),

payments: defineTable({
  userId: v.id("users"),
  amount: v.number(),
  status: v.union(
    v.literal("created"),
    v.literal("pending"),
    v.literal("completed"),
    v.literal("failed")
  ),
  stripeSessionId: v.string(),
  createdAt: v.number(),
  completedAt: v.optional(v.number()),
  stripeId: v.optional(v.string()),
})
  .index("stripeSessionId", ["stripeSessionId"])
  .index("stripeId", ["stripeId"])
  .index("by_user", ["userId"]),
```

## Phase 3: Core Stripe Infrastructure

### 3.1 Create `convex/lib/stripe.ts`

```typescript
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY environment variable is not set");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-04-30.basil",
});
```

### 3.2 Create `convex/lib/plans.ts`

```typescript
export type PlanType = "FREE" | "PROFESSIONAL" | "BUSINESS";

export interface SubscriptionPlan {
  name: string;
  price: number; // in cents
  priceId: string;
  features: string[];
}

export const SUBSCRIPTION_PLANS: Record<PlanType, SubscriptionPlan> = {
  FREE: {
    name: "Free",
    price: 0,
    priceId: "",
    features: ["1 business site", "Basic customization", "Locasite branding"],
  },
  PROFESSIONAL: {
    name: "Professional",
    price: 1900, // $19/month
    priceId: "price_professional_monthly",
    features: [
      "Unlimited business sites",
      "Advanced customization",
      "Remove branding",
      "Priority support",
    ],
  },
  BUSINESS: {
    name: "Business",
    price: 4900, // $49/month
    priceId: "price_business_monthly",
    features: [
      "Everything in Professional",
      "White-label solution",
      "API access",
      "Custom domains",
    ],
  },
};

export const PLAN_TYPES = Object.keys(SUBSCRIPTION_PLANS) as PlanType[];
```

## Phase 4: Convex Functions

### 4.1 Create `convex/stripe.ts`

Core Stripe integration with webhook handling, customer management, and data synchronization.

### 4.2 Create `convex/subscriptions.ts`

Subscription management functions including:

- `getSubscriptionPlans()` - Return available plans
- `subscribe(planType)` - Create checkout session
- `getUserSubscription()` - Get user's active subscription
- `cancelSubscription()` - Cancel at period end
- `reactivateSubscription()` - Reactivate cancelled subscription
- `createCustomerPortalSession()` - Customer portal access

### 4.3 Create `convex/payments.ts`

Payment tracking functions including:

- `create()` - Create payment record
- `fulfillBySessionId()` - Mark payment as completed
- `listByUser()` - Get user's payment history

## Phase 5: HTTP Router & Webhooks

### 5.1 Update `convex/http.ts`

Add Stripe webhook endpoint:

```typescript
http.route({
  path: "/stripe",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const signature = request.headers.get("stripe-signature");
    if (!signature) {
      return new Response(JSON.stringify({}), { status: 400 });
    }

    const result = await ctx.runAction(internal.stripe.fulfill, {
      signature,
      payload: await request.text(),
    });

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  }),
});
```

## Phase 6: Helper Functions & Types

### 6.1 Create helper directories:

- `convex/helpers/stripe/` - Stripe-specific helpers
- `convex/helpers/subscriptions/` - Subscription utilities
- `convex/helpers/common/` - Shared utilities

### 6.2 Key helper functions:

- Event validation for webhooks
- Payment method extraction
- Plan mapping utilities
- Subscription data types

## Phase 7: Frontend Integration

### 7.1 Update Pricing Section

Modify `app/components/landing/pricing-section.tsx` to:

- Connect "Get Started" buttons to Stripe checkout
- Use actual plan data from Convex
- Handle loading states during checkout

### 7.2 Update User Settings

Modify `app/components/dashboard/user-settings.tsx` to:

- Show current subscription status
- Add "Manage Subscription" button for customer portal
- Display payment history
- Handle plan upgrades/downgrades

### 7.3 Add Subscription Guards

Create middleware to enforce subscription limits:

- Business creation limits
- Feature access control
- Publishing restrictions

## Phase 8: Plan Enforcement

### 8.1 Business Limits

Add subscription checks to:

- Business creation (`convex/businesses.ts`)
- Publishing functionality (`convex/businessPublishing.ts`)
- Advanced features access

### 8.2 UI Indicators

- Show plan badges in dashboard
- Display upgrade prompts for premium features
- Add usage indicators (e.g., "2/5 businesses used")

## Phase 9: Testing & Deployment

### 9.1 Stripe Test Mode

- Set up test webhooks
- Create test price IDs
- Test complete checkout flow

### 9.2 Production Setup

- Configure production Stripe account
- Set up production webhooks
- Update environment variables

## Implementation Priority

**High Priority (Week 1):**

1. Database schema updates
2. Core Stripe infrastructure (lib files)
3. Basic subscription functions
4. Webhook handling

**Medium Priority (Week 2):** 5. Frontend pricing integration 6. User settings subscription management 7. Plan enforcement logic

**Low Priority (Week 3):** 8. Advanced features (customer portal) 9. Payment history 10. Usage analytics integration

This implementation exactly mirrors Monolink's architecture while adapting the plan structure and features to match Locasite's business model. The modular approach allows for incremental implementation and testing.
