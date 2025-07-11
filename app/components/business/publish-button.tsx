"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Alert, AlertDescription } from "@/app/components/ui/alert";
import { Globe, Lock, AlertCircle, CheckCircle, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface PublishButtonProps {
  businessId: Id<"businesses">;
  isPublished?: boolean;
  variant?:
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function PublishButton({
  businessId,
  isPublished = false,
  variant = "default",
  size = "default",
  className,
}: PublishButtonProps) {
  const router = useRouter();
  const [showDialog, setShowDialog] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const canPublish = useQuery(api.businessPublishing.canPublishBusiness, {
    businessId,
  });
  const publishBusiness = useMutation(api.businessPublishing.publishBusiness);
  const unpublishBusiness = useMutation(
    api.businessPublishing.unpublishBusiness,
  );

  const handlePublishClick = () => {
    if (!canPublish?.canPublish) {
      if (canPublish?.requiresVerification) {
        router.push(`/claim/${businessId}`);
      } else {
        toast.error(canPublish?.reason || "Cannot publish at this time");
      }
      return;
    }

    setShowDialog(true);
  };

  const handleConfirmPublish = async () => {
    setPublishing(true);
    try {
      if (isPublished) {
        await unpublishBusiness({ businessId });
        toast.success("Your business site has been unpublished");
      } else {
        await publishBusiness({ businessId });
        toast.success("Your business site is now live!");
      }
      setShowDialog(false);
    } catch (error) {
      console.error("Error publishing/unpublishing:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update publishing status",
      );
    } finally {
      setPublishing(false);
    }
  };

  const getButtonContent = () => {
    if (!canPublish) {
      return (
        <>
          <Loader className="mr-2 h-4 w-4 animate-spin" />
          Loading...
        </>
      );
    }

    if (isPublished) {
      return (
        <>
          <Globe className="mr-2 h-4 w-4" />
          Unpublish Site
        </>
      );
    }

    if (!canPublish.canPublish) {
      return (
        <>
          <Lock className="mr-2 h-4 w-4" />
          {canPublish.requiresVerification
            ? "Verify to Publish"
            : "Cannot Publish"}
        </>
      );
    }

    return (
      <>
        <Globe className="mr-2 h-4 w-4" />
        Publish Site
      </>
    );
  };

  return (
    <>
      <Button
        onClick={handlePublishClick}
        variant={variant}
        size={size}
        className={className}
        disabled={!canPublish || publishing}
      >
        {getButtonContent()}
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isPublished ? "Unpublish Your Site?" : "Publish Your Site?"}
            </DialogTitle>
            <DialogDescription>
              {isPublished
                ? "Your site will no longer be accessible to visitors."
                : "Your business site will be live and accessible to everyone."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {!isPublished && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Your site will be available at:</strong>
                  <br />
                  <span className="text-primary">
                    {typeof window !== "undefined"
                      ? window.location.origin
                      : ""}
                    /your-business
                  </span>
                </AlertDescription>
              </Alert>
            )}

            {isPublished && (
              <Alert className="bg-yellow-50 border-yellow-200">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-700">
                  Visitors will see a &quot;Coming Soon&quot; message until you
                  publish again.
                </AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDialog(false)}
              disabled={publishing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmPublish}
              disabled={publishing}
              variant={isPublished ? "destructive" : "default"}
            >
              {publishing ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  {isPublished ? "Unpublishing..." : "Publishing..."}
                </>
              ) : (
                <>{isPublished ? "Unpublish" : "Publish"}</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
