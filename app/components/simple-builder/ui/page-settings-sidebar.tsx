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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import { Settings, Globe, Search, Share2 } from "lucide-react";

interface PageSettingsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  pageTitle: string;
  domain?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  isPublished?: boolean;
  onUpdate: (settings: {
    pageTitle?: string;
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
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
  ogTitle,
  ogDescription,
  ogImage,
  isPublished = false,
  onUpdate,
}: PageSettingsSidebarProps) {
  const [formData, setFormData] = React.useState({
    pageTitle,
    seoTitle: seoTitle || "",
    seoDescription: seoDescription || "",
    seoKeywords: seoKeywords || "",
    ogTitle: ogTitle || "",
    ogDescription: ogDescription || "",
    ogImage: ogImage || "",
  });

  React.useEffect(() => {
    setFormData({
      pageTitle,
      seoTitle: seoTitle || "",
      seoDescription: seoDescription || "",
      seoKeywords: seoKeywords || "",
      ogTitle: ogTitle || "",
      ogDescription: ogDescription || "",
      ogImage: ogImage || "",
    });
  }, [
    pageTitle,
    seoTitle,
    seoDescription,
    seoKeywords,
    ogTitle,
    ogDescription,
    ogImage,
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Page Settings
          </SheetTitle>
        </SheetHeader>
        <div className="px-4">
        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
              <TabsTrigger value="social">Social</TabsTrigger>
            </TabsList>

            {/* General Tab */}
            <TabsContent value="general" className="space-y-4 mt-4">
              <div className="space-y-4">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  General Settings
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

                <div className="space-y-2">
                  <Label>Status</Label>
                  <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                    <div
                      className={`h-2 w-2 rounded-full ${isPublished ? "bg-green-500" : "bg-yellow-500"}`}
                    />
                    <span className="text-sm">
                      {isPublished ? "Published" : "Draft"}
                    </span>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* SEO Tab */}
            <TabsContent value="seo" className="space-y-4 mt-4">
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
                      setFormData({
                        ...formData,
                        seoDescription: e.target.value,
                      })
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
            </TabsContent>

            {/* Social Tab */}
            <TabsContent value="social" className="space-y-4 mt-4">
              <div className="space-y-4">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <Share2 className="h-4 w-4" />
                  Social Media Settings
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="ogTitle">Open Graph Title</Label>
                  <Input
                    id="ogTitle"
                    value={formData.ogTitle}
                    onChange={(e) =>
                      setFormData({ ...formData, ogTitle: e.target.value })
                    }
                    placeholder="Title for social media sharing"
                  />
                  <p className="text-xs text-muted-foreground">
                    Used when sharing on Facebook, LinkedIn, etc.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ogDescription">Open Graph Description</Label>
                  <Textarea
                    id="ogDescription"
                    value={formData.ogDescription}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        ogDescription: e.target.value,
                      })
                    }
                    placeholder="Description for social media sharing"
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">
                    A brief description that appears when shared
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ogImage">Open Graph Image URL</Label>
                  <Input
                    id="ogImage"
                    value={formData.ogImage}
                    onChange={(e) =>
                      setFormData({ ...formData, ogImage: e.target.value })
                    }
                    placeholder="https://example.com/image.jpg"
                  />
                  <p className="text-xs text-muted-foreground">
                    Recommended size: 1200x630px
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex gap-2 pt-6">
            <Button type="submit" className="flex-1">
              Save Settings
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
          </form>
          </div>
      </SheetContent>
    </Sheet>
  );
}
