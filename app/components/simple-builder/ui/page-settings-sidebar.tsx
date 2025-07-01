"use client";

import React from "react";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Button } from "@/app/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/app/components/ui/sheet";
import { Settings, Globe, Search } from "lucide-react";

interface PageSettingsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  pageTitle: string;
  domain?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  onUpdate: (settings: {
    pageTitle?: string;
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string;
  }) => void;
}

export function PageSettingsSidebar({
  isOpen,
  onClose,
  pageTitle,
  domain,
  seoTitle,
  seoDescription,
  seoKeywords,
  onUpdate,
}: PageSettingsSidebarProps) {
  const [formData, setFormData] = React.useState({
    pageTitle,
    seoTitle: seoTitle || "",
    seoDescription: seoDescription || "",
    seoKeywords: seoKeywords || "",
  });

  React.useEffect(() => {
    setFormData({
      pageTitle,
      seoTitle: seoTitle || "",
      seoDescription: seoDescription || "",
      seoKeywords: seoKeywords || "",
    });
  }, [pageTitle, seoTitle, seoDescription, seoKeywords]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Page Settings
          </SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* General Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <Globe className="h-4 w-4" />
              General
            </h3>

            <div className="space-y-2">
              <Label htmlFor="pageTitle">Page Title</Label>
              <Input
                id="pageTitle"
                value={formData.pageTitle}
                onChange={(e) =>
                  setFormData({ ...formData, pageTitle: e.target.value })
                }
                placeholder="Enter page title"
              />
            </div>

            {domain && (
              <div className="space-y-2">
                <Label>Domain</Label>
                <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{domain}</span>
                </div>
              </div>
            )}
          </div>

          {/* SEO Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <Search className="h-4 w-4" />
              SEO Settings
            </h3>

            <div className="space-y-2">
              <Label htmlFor="seoTitle">SEO Title</Label>
              <Input
                id="seoTitle"
                value={formData.seoTitle}
                onChange={(e) =>
                  setFormData({ ...formData, seoTitle: e.target.value })
                }
                placeholder="Title for search engines"
                maxLength={60}
              />
              <p className="text-xs text-muted-foreground">
                {formData.seoTitle.length}/60 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="seoDescription">Meta Description</Label>
              <Textarea
                id="seoDescription"
                value={formData.seoDescription}
                onChange={(e) =>
                  setFormData({ ...formData, seoDescription: e.target.value })
                }
                placeholder="Description for search engines"
                rows={3}
                maxLength={160}
              />
              <p className="text-xs text-muted-foreground">
                {formData.seoDescription.length}/160 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="seoKeywords">Keywords</Label>
              <Input
                id="seoKeywords"
                value={formData.seoKeywords}
                onChange={(e) =>
                  setFormData({ ...formData, seoKeywords: e.target.value })
                }
                placeholder="Comma-separated keywords"
              />
              <p className="text-xs text-muted-foreground">
                Separate keywords with commas
              </p>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              Save Settings
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
