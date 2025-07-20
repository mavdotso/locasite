"use client";

import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Check, X, Sparkles, Zap, Crown } from "lucide-react";
import { SUBSCRIPTION_PLANS, PlanType } from "@/convex/lib/plans";
import { toast } from "sonner";

interface UpgradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feature: string;
  requiredPlan: PlanType;
  currentPlan?: PlanType;
}

export function UpgradeDialog({
  open,
  onOpenChange,
  feature,
  requiredPlan,
  currentPlan = "FREE",
}: UpgradeDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const subscribe = useAction(api.subscriptions.subscribe);

  const handleUpgrade = async (planType: PlanType) => {
    if (planType === "FREE") return;

    setIsLoading(true);
    try {
      const url = await subscribe({
        planType: planType as "PROFESSIONAL" | "BUSINESS",
      });
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error("Error starting upgrade process:", error);
      toast.error("Failed to start upgrade process. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const plans = Object.entries(SUBSCRIPTION_PLANS).map(([key, plan]) => ({
    type: key as PlanType,
    ...plan,
  }));

  const requiredPlanIndex = plans.findIndex((p) => p.type === requiredPlan);
  const currentPlanIndex = plans.findIndex((p) => p.type === currentPlan);

  const getPlanIcon = (planType: PlanType) => {
    switch (planType) {
      case "PROFESSIONAL":
        return <Zap className="h-5 w-5" />;
      case "BUSINESS":
        return <Crown className="h-5 w-5" />;
      default:
        return <Sparkles className="h-5 w-5" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Upgrade to unlock {feature}
          </DialogTitle>
          <DialogDescription className="text-base">
            This feature requires a {SUBSCRIPTION_PLANS[requiredPlan].name} plan
            or higher. Choose a plan to continue.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-6">
          {plans.slice(1).map((plan, index) => {
            const planIndex = index + 1;
            const isCurrentPlan = plan.type === currentPlan;
            const isEligible = planIndex >= requiredPlanIndex;
            const isRecommended = planIndex === requiredPlanIndex;

            return (
              <div
                key={plan.type}
                className={`relative rounded-lg border p-6 ${
                  isEligible
                    ? isRecommended
                      ? "border-primary bg-primary/5"
                      : "border-border"
                    : "border-border opacity-60"
                }`}
              >
                {isRecommended && (
                  <Badge className="absolute -top-3 right-4" variant="default">
                    Recommended
                  </Badge>
                )}

                <div className="flex items-start justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      {getPlanIcon(plan.type)}
                      <h3 className="text-xl font-semibold">{plan.name}</h3>
                      {isCurrentPlan && (
                        <Badge variant="secondary">Current Plan</Badge>
                      )}
                    </div>

                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold">
                        ${plan.price / 100}
                      </span>
                      <span className="text-muted-foreground">/month</span>
                    </div>

                    <ul className="space-y-2">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2">
                          {isEligible ? (
                            <Check className="h-4 w-4 text-primary" />
                          ) : (
                            <X className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span
                            className={
                              isEligible ? "" : "text-muted-foreground"
                            }
                          >
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    onClick={() => handleUpgrade(plan.type)}
                    disabled={
                      !isEligible ||
                      isCurrentPlan ||
                      isLoading ||
                      planIndex < currentPlanIndex
                    }
                    variant={isRecommended ? "default" : "outline"}
                    className="ml-4"
                  >
                    {isCurrentPlan
                      ? "Current Plan"
                      : planIndex < currentPlanIndex
                        ? "Downgrade"
                        : "Upgrade"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
