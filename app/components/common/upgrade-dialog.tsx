"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PlanType } from "@/convex/lib/plans";

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
  feature: _feature,
  requiredPlan: _requiredPlan,
  currentPlan: _currentPlan = "FREE",
}: UpgradeDialogProps) {
  const router = useRouter();

  useEffect(() => {
    if (open) {
      // Redirect to billing page instead of showing dialog
      router.push("/dashboard/billing");
      onOpenChange(false);
    }
  }, [open, router, onOpenChange]);

  return null;
}
