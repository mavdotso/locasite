"use client";

import { useState } from "react";
import { useQuery, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { SUBSCRIPTION_PLANS, PlanType } from "@/convex/lib/plans";
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
      console.error("Error starting subscription:", error);
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
      console.error("Error cancelling subscription:", error);
      toast.error("Failed to cancel subscription");
    }
  };

  const handleReactivateSubscription = async () => {
    try {
      await reactivateSubscription();
      toast.success("Subscription reactivated successfully!");
    } catch (error) {
      console.error("Error reactivating subscription:", error);
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
      console.error("Error creating portal session:", error);
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
                  {SUBSCRIPTION_PLANS[currentPlan].name}
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
                  <CardTitle>{plan.name}</CardTitle>
                </div>
                <div className="mt-4">
                  <span className="text-3xl font-bold">
                    ${plan.price / 100}
                  </span>
                  <span className="text-muted-foreground">/month</span>
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
                      Business sites:{" "}
                      {plan.limits.businesses === -1
                        ? "Unlimited"
                        : plan.limits.businesses}
                    </li>
                    <li>
                      Custom domains:{" "}
                      {plan.limits.customDomains === -1
                        ? "Unlimited"
                        : plan.limits.customDomains || "Not included"}
                    </li>
                    {plan.limits.analytics && <li>✓ Advanced analytics</li>}
                    {plan.limits.removeWatermark && <li>✓ Remove watermark</li>}
                    {plan.limits.prioritySupport && <li>✓ Priority support</li>}
                    {plan.limits.apiAccess && <li>✓ API access</li>}
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
            <AccordionTrigger>Can I cancel anytime?</AccordionTrigger>
            <AccordionContent>
              Yes, you can cancel your subscription at any time. You&apos;ll
              continue to have access to your plan features until the end of
              your billing period.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="downgrade">
            <AccordionTrigger>
              What happens to my sites if I downgrade?
            </AccordionTrigger>
            <AccordionContent>
              If you exceed the limits of your new plan, you&apos;ll need to
              choose which sites to keep active. The others will be paused but
              not deleted.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="refunds">
            <AccordionTrigger>Do you offer refunds?</AccordionTrigger>
            <AccordionContent>
              We offer a 14-day money-back guarantee for new subscriptions.
              Contact support if you&apos;re not satisfied.
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
            <AccordionTrigger>Can I change plans at any time?</AccordionTrigger>
            <AccordionContent>
              Yes, you can upgrade your plan at any time. When you upgrade,
              you&apos;ll be charged a prorated amount for the remainder of your
              billing cycle. Downgrades take effect at the end of your current
              billing period.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
