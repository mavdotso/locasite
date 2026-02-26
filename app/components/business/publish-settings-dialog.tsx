"use client";

import * as Sentry from "@sentry/nextjs";
import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface PublishSettingsDialogProps {
  businessId: Id<"businesses">;
  businessName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPublishComplete?: () => void;
}

export function PublishSettingsDialog({
  businessId,
  businessName,
  open,
  onOpenChange,
  onPublishComplete,
}: PublishSettingsDialogProps) {
  const [isPublishing, setIsPublishing] = useState(false);

  const business = useQuery(api.businesses.getById, { id: businessId });
  const domain = useQuery(api.domains.getByBusinessId, { businessId });
  const publishBusiness = useMutation(api.businesses.publish);

  const isPublished = business?.isPublished === true;
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "locasite.xyz";
  const isDevelopment = process.env.NODE_ENV === "development";
  const siteUrl = domain?.subdomain
    ? isDevelopment
      ? `http://${domain.subdomain}.localhost:3000`
      : `https://${domain.subdomain}.${rootDomain}`
    : null;

  const handlePublish = async () => {
    setIsPublishing(true);

    try {
      await publishBusiness({ businessId });

      toast.success(
        <div className="flex flex-col gap-1">
          <span>
            {isPublished
              ? "Your site has been updated!"
              : "Your website is now live!"}
          </span>
          {siteUrl && (
            <a
              href={siteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline"
            >
              {siteUrl}
            </a>
          )}
        </div>,
        { duration: 10000 },
      );

      if (onPublishComplete) {
        onPublishComplete();
      }

      onOpenChange(false);
    } catch (error) {
      Sentry.captureException(error);
      toast.error("Failed to publish website");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isPublished ? "Update Site" : "Go Live"}</DialogTitle>
          <DialogDescription>
            {isPublished ? (
              <>
                Your changes will be published to{" "}
                {siteUrl ? (
                  <a
                    href={siteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium underline"
                  >
                    {domain?.subdomain}.{rootDomain}
                  </a>
                ) : (
                  `${domain?.subdomain || businessName}.${rootDomain}`
                )}
              </>
            ) : (
              <>
                Your website will be available at:{" "}
                <span className="font-medium">
                  {domain?.subdomain || businessName}.{rootDomain}
                </span>
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPublishing}
          >
            Cancel
          </Button>
          <Button onClick={handlePublish} disabled={isPublishing}>
            {isPublishing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isPublished ? "Updating..." : "Publishing..."}
              </>
            ) : isPublished ? (
              "Update Site"
            ) : (
              "Go Live"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
