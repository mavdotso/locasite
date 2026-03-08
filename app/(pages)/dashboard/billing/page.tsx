"use client";

import * as Sentry from "@sentry/nextjs";
import { useState } from "react";
import { useQuery, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  PlanType,
  SUBSCRIPTION_PLANS,
  PLAN_DISPLAY_NAMES,
} from "@/convex/lib/plans";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  Loader2,
  Sparkles,
  Zap,
  Building2,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/app/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function BillingPage() {
  const [loadingPlan, setLoadingPlan] = useState<PlanType | null>(null);

  const subscription = useQuery(api.subscriptions.getUserSubscription);
  const subscribe = useAction(api.subscriptions.subscribe);
  const cancelSubscription = useAction(api.subscriptions.cancelSubscription);
  const reactivateSubscription = useAction(
    api.subscriptions.reactivateSubscription,
  );
  const createPortalSession = useAction(
    api.subscriptions.createCustomerPortalSession,
  );

  const currentPlan = subscription?.planType || "FREE";

  const handleSubscribe = async (planType: PlanType) => {
    if (planType === "FREE") return;

    setLoadingPlan(planType);
    try {
      const url = await subscribe({
        planType: planType as "PROFESSIONAL" | "BUSINESS",
      });
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      Sentry.captureException(error);
      toast.error("Failed to start subscription. Please try again.");
    } finally {
      setLoadingPlan(null);
    }
  };

  const handleCancelSubscription = async () => {
    if (
      !confirm(
        "Are you sure you want to cancel your subscription? You'll continue to have access until the end of your billing period.",
      )
    ) {
      return;
    }

    try {
      await cancelSubscription();
      toast.success(
        "Subscription cancelled. You'll continue to have access until the end of your billing period.",
      );
    } catch (error) {
      Sentry.captureException(error);
      toast.error("Failed to cancel subscription");
    }
  };

  const handleReactivateSubscription = async () => {
    try {
      await reactivateSubscription();
      toast.success("Subscription reactivated successfully!");
    } catch (error) {
      Sentry.captureException(error);
      toast.error("Failed to reactivate subscription");
    }
  };

  const handleManageSubscription = async () => {
    try {
      const url = await createPortalSession();
      if (url) {
        window.location.href = url;
      } else {
        toast.error("Unable to open billing portal. Please try again.");
      }
    } catch (error) {
      Sentry.captureException(error);
      toast.error("Failed to open billing portal");
    }
  };

  const getPlanIcon = (planType: PlanType) => {
    switch (planType) {
      case "FREE":
        return <Sparkles className="h-5 w-5" />;
      case "PROFESSIONAL":
        return <Zap className="h-5 w-5" />;
      case "BUSINESS":
        return <Building2 className="h-5 w-5" />;
    }
  };

  const plans = Object.entries(SUBSCRIPTION_PLANS).map(([key, plan]) => ({
    type: key as PlanType,
    ...plan,
  }));

  return (
    <div className="container max-w-6xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Billing & Subscription</h1>
        <p className="text-muted-foreground mt-2">
          Manage your subscription and billing information
        </p>
      </div>

      {/* Current Plan Status */}
      {subscription && currentPlan !== "FREE" && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Current Subscription</CardTitle>
            <CardDescription>
              Your active plan and billing details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Plan</p>
                <p className="text-muted-foreground">
                  {PLAN_DISPLAY_NAMES[currentPlan]}
                </p>
              </div>
              <Badge
                variant={
                  subscription.status === "active" ? "default" : "secondary"
                }
              >
                {subscription.status}
              </Badge>
            </div>

            {subscription.currentPeriodEnd && (
              <div>
                <p className="font-medium">Next billing date</p>
                <p className="text-muted-foreground">
                  {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                </p>
              </div>
            )}

            {subscription.cancelAtPeriodEnd && (
              <div className="rounded-lg bg-destructive/10 p-4">
                <p className="text-sm text-destructive">
                  Your subscription will end on{" "}
                  {new Date(
                    subscription.currentPeriodEnd!,
                  ).toLocaleDateString()}
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex gap-2">
            {subscription.cancelAtPeriodEnd ? (
              <Button onClick={handleReactivateSubscription}>
                Reactivate Subscription
              </Button>
            ) : (
              <Button variant="destructive" onClick={handleCancelSubscription}>
                Cancel Subscription
              </Button>
            )}
            <Button variant="outline" onClick={handleManageSubscription}>
              <ExternalLink className="w-4 h-4 mr-2" />
              Manage Subscription
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Plans Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => {
          const isCurrentPlan = plan.type === currentPlan;
          const isDowngrade =
            plans.findIndex((p) => p.type === plan.type) <
            plans.findIndex((p) => p.type === currentPlan);

          return (
            <Card
              key={plan.type}
              className={cn(
                "relative flex flex-col h-full",
                isCurrentPlan &&
                  "border-primary ring-2 ring-primary ring-offset-2",
              )}
            >
              {isCurrentPlan && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                  Current Plan
                </Badge>
              )}

              <CardHeader>
                <div className="flex items-center gap-2">
                  {getPlanIcon(plan.type)}
                  <CardTitle>{PLAN_DISPLAY_NAMES[plan.type]}</CardTitle>
                </div>
                <div className="mt-4">
                  <span className="text-3xl font-bold">
                    ${plan.price / 100}
                  </span>
                  <span className="text-muted-foreground">
                    {plan.type === "FREE" ? "/forever" : "/mo"}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="flex-1">
                <ul className="space-y-2">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 space-y-2 border-t pt-4">
                  <h4 className="font-medium text-sm">Limits</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>
                      Themes:{" "}
                      {plan.limits.themeCount === -1
                        ? "Unlimited"
                        : plan.limits.themeCount}
                    </li>
                    <li>
                      Monthly visitors:{" "}
                      {plan.limits.monthlyVisitsSoftCap === -1
                        ? "Unlimited"
                        : plan.limits.monthlyVisitsSoftCap.toLocaleString()}
                    </li>
                    {plan.limits.contentEditing && <li>✓ Content editing</li>}
                    {plan.limits.visualEditor && <li>✓ Full visual editor</li>}
                    {plan.limits.seoEditor && <li>✓ SEO meta editor</li>}
                    {plan.limits.googleReviews && (
                      <li>✓ Google Reviews widget</li>
                    )}
                    {plan.limits.photoGallery && <li>✓ Photo gallery</li>}
                    {plan.limits.menuManagement && <li>✓ Menu management</li>}
                    {plan.limits.customDomains !== 0 && (
                      <li>✓ Custom domain</li>
                    )}
                    {plan.limits.removeWatermark && (
                      <li>✓ Remove Locosite branding</li>
                    )}
                    {plan.limits.prioritySupport && <li>✓ Priority support</li>}
                  </ul>
                </div>
              </CardContent>

              <CardFooter className="mt-auto">
                <Button
                  className="w-full"
                  variant={isCurrentPlan ? "outline" : "default"}
                  disabled={
                    isCurrentPlan ||
                    isDowngrade ||
                    plan.type === "FREE" ||
                    loadingPlan !== null
                  }
                  onClick={() => handleSubscribe(plan.type)}
                >
                  {loadingPlan === plan.type && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isCurrentPlan
                    ? "Current Plan"
                    : isDowngrade
                      ? "Downgrade"
                      : plan.type === "FREE"
                        ? "Free"
                        : "Upgrade"}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* FAQ Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">
          Frequently Asked Questions
        </h2>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="cancel">
            <AccordionTrigger>Can I cancel?</AccordionTrigger>
            <AccordionContent>
              Yes, anytime. Your site stays live on the free tier.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="downgrade">
            <AccordionTrigger>Can I downgrade?</AccordionTrigger>
            <AccordionContent>
              Yes. Downgrading moves you to the free tier. Your site stays live
              but editing and branding removal are locked.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="payment-methods">
            <AccordionTrigger>
              What payment methods do you accept?
            </AccordionTrigger>
            <AccordionContent>
              We accept all major credit and debit cards including Visa,
              Mastercard, American Express, and Discover. All payments are
              processed securely through Stripe.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="change-plans">
            <AccordionTrigger>Can I switch plans?</AccordionTrigger>
            <AccordionContent>
              Yes, upgrade or downgrade anytime. Changes are prorated.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
