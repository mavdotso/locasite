"use client";

import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  PlanType,
  SUBSCRIPTION_PLANS,
  PLAN_DISPLAY_NAMES,
} from "@/convex/lib/plans";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import * as Sentry from "@sentry/nextjs";

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
  const [loading, setLoading] = useState(false);
  const subscribe = useAction(api.subscriptions.subscribe);

  if (requiredPlan === "FREE") return null;

  const plan = SUBSCRIPTION_PLANS[requiredPlan];
  const planName = PLAN_DISPLAY_NAMES[requiredPlan];
  const currentPlanName = PLAN_DISPLAY_NAMES[currentPlan];

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const url = await subscribe({
        planType: requiredPlan as "PROFESSIONAL" | "BUSINESS",
      });
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      Sentry.captureException(error);
      toast.error("Failed to start checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upgrade to {planName}</DialogTitle>
          <DialogDescription>
            {feature} requires the {planName} plan.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold">${plan.price / 100}</span>
            <span className="text-muted-foreground">/month</span>
          </div>

          <ul className="space-y-2">
            {plan.features.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button onClick={handleUpgrade} disabled={loading} className="w-full">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Upgrade to {planName} — ${plan.price / 100}/mo
          </Button>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="w-full"
          >
            Stay on {currentPlanName}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
