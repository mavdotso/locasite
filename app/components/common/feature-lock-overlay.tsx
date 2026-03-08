"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { PlanType, PLAN_DISPLAY_NAMES, SUBSCRIPTION_PLANS } from "@/convex/lib/plans";
import { UpgradeDialog } from "./upgrade-dialog";
import { useSubscription } from "@/app/hooks/use-subscription";

interface FeatureLockOverlayProps {
  feature: string;
  requiredPlan: PlanType;
  className?: string;
}

export function FeatureLockOverlay({
  feature,
  requiredPlan,
  className = "",
}: FeatureLockOverlayProps) {
  const [showUpgrade, setShowUpgrade] = useState(false);
  const { planType } = useSubscription();
  const planName = PLAN_DISPLAY_NAMES[requiredPlan];
  const price = SUBSCRIPTION_PLANS[requiredPlan].price;
  const priceDisplay = price > 0 ? `$${price / 100}/mo` : "Free";

  return (
    <>
      <div
        className={`flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-muted-foreground/25 bg-muted/30 p-8 text-center ${className}`}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Lock className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">
            {feature}
          </p>
          <p className="text-xs text-muted-foreground">
            Available on the {planName} plan ({priceDisplay})
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => setShowUpgrade(true)}
        >
          Upgrade to {planName}
        </Button>
      </div>

      <UpgradeDialog
        open={showUpgrade}
        onOpenChange={setShowUpgrade}
        feature={feature}
        requiredPlan={requiredPlan}
        currentPlan={planType}
      />
    </>
  );
}
