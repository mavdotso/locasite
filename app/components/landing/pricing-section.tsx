"use client";

import { Check, X, Sparkles } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { useState } from "react";
import { useAction, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function PricingSection() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">(
    "monthly",
  );
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  const userWithSubscription = useQuery(api.auth.currentUserWithSubscription);
  const user = userWithSubscription?.user;
  const subscription = userWithSubscription?.subscription;
  const subscribe = useAction(api.subscriptions.subscribe);

  const plans = [
    {
      id: "FREE",
      name: "Free Forever",
      price: "$0",
      period: "no credit card",
      description: "Perfect for getting started",
      features: [
        { text: "1 business website", included: true },
        { text: "Google Maps auto-import", included: true },
        { text: "Locasite.com subdomain", included: true },
        { text: "SSL security included", included: true },
        { text: "Mobile responsive", included: true },
        { text: "Basic analytics", included: true },
        { text: "Contact form", included: true },
        { text: "Custom domain", included: false },
        { text: "Remove branding", included: false },
        { text: "Priority support", included: false },
      ],
      cta: "Start Free - No Credit Card",
      highlighted: false,
    },
    {
      id: "PROFESSIONAL",
      name: "Professional",
      price: "$19",
      period: "/month",
      description: "Everything to grow your business",
      features: [
        { text: "Everything in Free", included: true },
        { text: "Custom domain included", included: true },
        { text: "Remove Locasite branding", included: true },
        { text: "Advanced customization", included: true },
        { text: "SEO optimization tools", included: true },
        { text: "Detailed analytics", included: true },
        { text: "Unlimited contacts", included: true },
        { text: "Priority support", included: true },
        { text: "Auto-sync from Google", included: true },
        { text: "Multiple pages", included: true },
      ],
      cta: "Try Free for 14 Days",
      highlighted: true,
      badge: "Most Popular",
    },
    {
      id: "BUSINESS",
      name: "Business",
      price: "$49",
      period: "/month",
      description: "For multi-location businesses",
      features: [
        { text: "Everything in Professional", included: true },
        { text: "Unlimited websites", included: true },
        { text: "White-label solution", included: true },
        { text: "Multi-location support", included: true },
        { text: "API access", included: true },
        { text: "Dedicated support", included: true },
        { text: "Custom integrations", included: true },
        { text: "99.9% uptime SLA", included: true },
        { text: "Onboarding session", included: true },
        { text: "Bulk import tools", included: true },
      ],
      cta: "Contact Us",
      highlighted: false,
    },
  ];

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      router.push("/sign-in");
      return;
    }

    if (planId === "FREE") {
      router.push("/dashboard");
      return;
    }

    if (planId === "BUSINESS") {
      // For Business plan, redirect to contact form
      window.location.href = "#contact";
      return;
    }

    try {
      setLoading(planId);
      const checkoutUrl = await subscribe({
        planType: planId as "PROFESSIONAL" | "BUSINESS",
      });

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      }
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error("Failed to start subscription. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  const getCurrentPlanId = () => {
    return subscription?.planType || "FREE";
  };

  const currentPlanId = getCurrentPlanId();

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-green-100 border border-green-200 px-4 py-1.5 text-sm font-medium text-green-700 mb-4">
            14-Day Free Trial on All Paid Plans
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Simple Pricing That
            <span className="text-primary"> Scales With You</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Start free forever. Upgrade when you're ready. Cancel anytime.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 p-1 bg-muted rounded-lg">
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                billingPeriod === "monthly"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod("yearly")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                billingPeriod === "yearly"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground"
              }`}
            >
              Yearly
              <span className="ml-2 text-xs text-green-600 font-semibold">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan) => {
            const isCurrentPlan = currentPlanId === plan.id;
            const isDowngrade =
              plans.findIndex((p) => p.id === currentPlanId) >
              plans.findIndex((p) => p.id === plan.id);

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl border ${
                  plan.highlighted
                    ? "border-primary shadow-lg scale-105"
                    : "border-border"
                } bg-card p-8 transition-all duration-300 hover:shadow-lg`}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                      <Sparkles className="h-3 w-3" />
                      {plan.badge}
                    </div>
                  </div>
                )}

                {/* Current Plan Badge */}
                {isCurrentPlan && (
                  <div className="absolute -top-4 right-4">
                    <div className="inline-flex items-center gap-1 rounded-full bg-green-100 border border-green-200 px-3 py-1 text-xs font-semibold text-green-700">
                      Current Plan
                    </div>
                  </div>
                )}

                {/* Plan Header */}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-3">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold">
                        {billingPeriod === "yearly" && plan.price !== "$0"
                          ? `$${Math.floor(parseInt(plan.price.replace("$", "")) * 0.8)}`
                          : plan.price}
                      </span>
                      <span className="text-muted-foreground">{plan.period}</span>
                    </div>
                    {billingPeriod === "yearly" && plan.price !== "$0" && (
                      <p className="text-sm text-green-600 font-medium mt-1">
                        Save ${Math.floor(parseInt(plan.price.replace("$", "")) * 2.4)} per year
                      </p>
                    )}
                  </div>
                  <p className="text-muted-foreground">{plan.description}</p>
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      {feature.included ? (
                        <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="h-5 w-5 text-muted-foreground/50 flex-shrink-0 mt-0.5" />
                      )}
                      <span
                        className={
                          feature.included
                            ? ""
                            : "text-muted-foreground line-through"
                        }
                      >
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button
                  className="w-full"
                  variant={plan.highlighted ? "default" : "outline"}
                  size="lg"
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={loading !== null || isCurrentPlan || isDowngrade}
                >
                  {loading === plan.id
                    ? "Processing..."
                    : isCurrentPlan
                      ? "Current Plan"
                      : isDowngrade
                        ? "Downgrade"
                        : plan.cta}
                </Button>
              </div>
            );
          })}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16">
          <div className="max-w-3xl mx-auto bg-muted/50 rounded-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <Check className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <p className="font-medium">No Setup Fees</p>
                <p className="text-sm text-muted-foreground">Ever</p>
              </div>
              <div>
                <Check className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <p className="font-medium">Cancel Anytime</p>
                <p className="text-sm text-muted-foreground">No contracts</p>
              </div>
              <div>
                <Check className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <p className="font-medium">Instant Access</p>
                <p className="text-sm text-muted-foreground">Start building now</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
