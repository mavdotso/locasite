"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Switch } from "@/app/components/ui/switch";
import { Label } from "@/app/components/ui/label";
import { Badge } from "@/app/components/ui/badge";
import { Globe, Lock } from "lucide-react";
import { toast } from "sonner";

interface PublishControlsProps {
  businessId: Id<"businesses">;
  isPublished: boolean;
  publishedAt?: number;
}

export function PublishControls({ businessId, isPublished, publishedAt }: PublishControlsProps) {
  const [loading, setLoading] = useState(false);
  const publishDraft = useMutation(api.businesses.publishDraft);
  const unpublish = useMutation(api.businesses.unpublish);

  const handleToggle = async () => {
    setLoading(true);
    try {
      if (isPublished) {
        await unpublish({ businessId });
        toast.success("Website unpublished successfully");
      } else {
        await publishDraft({ businessId });
        toast.success("Website published successfully!");
      }
    } catch (error) {
      toast.error("Failed to update publishing status");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
        <div className="flex items-center space-x-3">
          {isPublished ? (
            <Globe className="h-5 w-5 text-green-600" />
          ) : (
            <Lock className="h-5 w-5 text-muted-foreground" />
          )}
          <div>
            <Label htmlFor="publish-toggle" className="text-base font-medium">
              Website Publishing
            </Label>
            <p className="text-sm text-muted-foreground">
              {isPublished
                ? "Your website is live and accessible to everyone"
                : "Your website is private and only visible to you"}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant={isPublished ? "default" : "secondary"}>
            {isPublished ? "Published" : "Draft"}
          </Badge>
          <Switch
            id="publish-toggle"
            checked={isPublished}
            onCheckedChange={handleToggle}
            disabled={loading}
          />
        </div>
      </div>

      {publishedAt && isPublished && (
        <p className="text-xs text-muted-foreground">
          Published on {new Date(publishedAt).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}