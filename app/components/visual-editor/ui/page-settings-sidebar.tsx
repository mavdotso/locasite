"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Label } from "@/app/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Badge } from "@/app/components/ui/badge";
import { Progress } from "@/app/components/ui/progress";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Alert, AlertDescription } from "@/app/components/ui/alert";
import { Separator } from "@/app/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/app/components/ui/sheet";
import {
  Globe,
  Share2,
  AlertCircle,
  Info,
  Check,
  Loader2,
  Lock,
  Settings,
} from "lucide-react";
import { cn } from "@/app/lib/utils";
import { Id } from "@/convex/_generated/dataModel";
import { Doc } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  robots?: string;
  author?: string;
  structuredData?: Record<string, unknown>;
}

interface PageSettingsSidebarProps {
  businessId: Id<"businesses">;
  business: Doc<"businesses">;
  pageId: Id<"pages">;
  metadata: SEOMetadata;
  isOpen: boolean;
  onMetadataChange: (metadata: SEOMetadata) => void;
  onClose: () => void;
}

export default function PageSettingsSidebar({
  businessId,
  business,
  pageId: _pageId,
  metadata,
  isOpen,
  onMetadataChange,
  onClose,
}: PageSettingsSidebarProps) {
  const [localMetadata, setLocalMetadata] = useState<SEOMetadata>(metadata);
  const [seoScore, setSeoScore] = useState(0);
  const [issues, setIssues] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [subdomainInput, setSubdomainInput] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [isChangingDomain, setIsChangingDomain] = useState(false);

  const domain = useQuery(api.domains.getByBusinessId, { businessId });
  const generateSubdomain = useMutation(api.domains.generateSubdomain);
  const publishBusiness = useMutation(api.businesses.publish);
  const unpublishBusiness = useMutation(api.businesses.unpublish);

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "locasite.xyz";

  // Initialize subdomain input
  useEffect(() => {
    if (domain?.subdomain && !subdomainInput) {
      setSubdomainInput(domain.subdomain);
    }
  }, [domain, subdomainInput]);

  // Calculate SEO score
  useEffect(() => {
    const calculateSEOScore = () => {
      let score = 0;
      const newIssues: string[] = [];
      const newSuggestions: string[] = [];

      // Title checks
      if (localMetadata.title) {
        score += 10;
        if (
          localMetadata.title.length >= 30 &&
          localMetadata.title.length <= 60
        ) {
          score += 10;
        } else {
          newIssues.push("Title should be between 30-60 characters");
        }
      } else {
        newIssues.push("Missing page title");
      }

      // Description checks
      if (localMetadata.description) {
        score += 10;
        if (
          localMetadata.description.length >= 120 &&
          localMetadata.description.length <= 160
        ) {
          score += 10;
        } else {
          newIssues.push("Description should be between 120-160 characters");
        }
      } else {
        newIssues.push("Missing meta description");
      }

      // Keywords
      if (localMetadata.keywords && localMetadata.keywords.length > 0) {
        score += 10;
        if (
          localMetadata.keywords.length >= 3 &&
          localMetadata.keywords.length <= 10
        ) {
          score += 5;
        } else {
          newSuggestions.push("Aim for 3-10 relevant keywords");
        }
      } else {
        newIssues.push("No keywords specified");
      }

      // Open Graph
      if (localMetadata.ogTitle) score += 10;
      else
        newSuggestions.push("Add Open Graph title for better social sharing");

      if (localMetadata.ogDescription) score += 10;
      else newSuggestions.push("Add Open Graph description for social media");

      if (localMetadata.ogImage) score += 10;
      else newIssues.push("Missing Open Graph image for social sharing");

      // Twitter Card
      if (localMetadata.twitterCard) score += 5;
      if (localMetadata.twitterTitle || localMetadata.ogTitle) score += 5;
      if (localMetadata.twitterDescription || localMetadata.ogDescription)
        score += 5;

      // Structured Data
      if (
        localMetadata.structuredData &&
        Object.keys(localMetadata.structuredData).length > 0
      ) {
        score += 10;
      } else {
        newSuggestions.push("Add structured data for rich snippets");
      }

      setSeoScore(Math.min(score, 100));
      setIssues(newIssues);
      setSuggestions(newSuggestions);
    };

    calculateSEOScore();
  }, [localMetadata]);

  function handleMetadataUpdate(updates: Partial<SEOMetadata>) {
    const newMetadata = { ...localMetadata, ...updates };
    setLocalMetadata(newMetadata);
    onMetadataChange(newMetadata);
  }

  function handleKeywordAdd(keyword: string) {
    if (keyword && !localMetadata.keywords.includes(keyword)) {
      handleMetadataUpdate({
        keywords: [...localMetadata.keywords, keyword],
      });
    }
  }

  function handleKeywordRemove(keyword: string) {
    handleMetadataUpdate({
      keywords: localMetadata.keywords.filter((k) => k !== keyword),
    });
  }

  async function handleDomainChange() {
    if (!subdomainInput || subdomainInput.length < 3) {
      toast.error("Subdomain must be at least 3 characters");
      return;
    }

    setIsChangingDomain(true);

    try {
      await generateSubdomain({
        businessId,
        customSubdomain: subdomainInput,
      });

      toast.success("Domain updated successfully!");
    } catch (error) {
      if (
        error instanceof Error &&
        error.message?.includes("subdomain") &&
        error.message?.includes("taken")
      ) {
        toast.error("This subdomain is already taken. Please choose another.");
      } else {
        toast.error("Failed to update domain");
      }
    } finally {
      setIsChangingDomain(false);
    }
  }

  async function handlePublishToggle() {
    try {
      setIsPublishing(true);

      if (business.isPublished) {
        await unpublishBusiness({ businessId });
        toast.success("Website unpublished successfully");
      } else {
        // Check if domain exists
        if (!domain) {
          toast.error("Please set a domain before publishing");
          return;
        }

        await publishBusiness({ businessId });

        const isDevelopment = process.env.NODE_ENV === "development";
        const publishedUrl = isDevelopment
          ? `http://${domain.subdomain}.localhost:3000`
          : `https://${domain.subdomain}.${rootDomain}`;

        toast.success(
          <div className="flex flex-col gap-1">
            <span>Your website is now live at:</span>
            <a
              href={publishedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline"
            >
              {publishedUrl}
            </a>
          </div>,
          { duration: 10000 },
        );
      }
    } catch {
      toast.error(
        business.isPublished ? "Failed to unpublish" : "Failed to publish",
      );
    } finally {
      setIsPublishing(false);
    }
  }

  function generateStructuredData() {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: business.name,
      description: business.description || localMetadata.description,
      address: business.address
        ? {
            "@type": "PostalAddress",
            streetAddress: business.address,
          }
        : undefined,
      telephone: business.phone,
      email: business.email,
      url: business.website,
    };

    handleMetadataUpdate({ structuredData });
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Page Settings
          </SheetTitle>
        </SheetHeader>
        <div className="px-4">
        <Tabs defaultValue="domain" className="w-full px-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="domain">Domain</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
          </TabsList>

            {/* Domain Tab */}
            <TabsContent value="domain" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-3">Website Address</h4>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Input
                          placeholder="Add keyword"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleKeywordAdd(
                                (e.target as HTMLInputElement).value,
                              );
                              (e.target as HTMLInputElement).value = "";
                            }
                          }}
                        />
                        {subdomainInput.length >= 3 &&
                          subdomainInput === domain?.subdomain && (
                            <Check className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-green-600" />
                          )}
                      </div>
                      <span className="flex items-center px-3 text-sm text-muted-foreground bg-muted rounded-md">
                        .{rootDomain}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Letters, numbers, and hyphens only. At least 3 characters.
                    </p>

                    {subdomainInput !== domain?.subdomain && (
                      <Button
                        onClick={handleDomainChange}
                        disabled={isChangingDomain || subdomainInput.length < 3}
                        size="sm"
                        className="w-full"
                      >
                        {isChangingDomain ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Update Domain"
                        )}
                      </Button>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Publish/Unpublish Section */}
                <div>
                  <h4 className="text-sm font-medium mb-3">
                    Website Visibility
                  </h4>
                  <Alert>
                    <Globe className="h-4 w-4" />
                    <AlertDescription>
                      {business.isPublished ? (
                        <p>
                          Your website is currently{" "}
                          <span className="font-medium text-green-600">
                            live
                          </span>{" "}
                          and accessible at:{" "}
                          {domain && (
                            <a
                              href={
                                process.env.NODE_ENV === "development"
                                  ? `http://${domain.subdomain}.localhost:3000`
                                  : `https://${domain.subdomain}.${rootDomain}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium underline"
                            >
                              {domain.subdomain}.{rootDomain}
                            </a>
                          )}
                        </p>
                      ) : (
                        <p>
                          Your website is currently{" "}
                          <span className="font-medium text-muted-foreground">
                            unpublished
                          </span>{" "}
                          and not accessible to the public.
                        </p>
                      )}
                    </AlertDescription>
                  </Alert>

                  <Button
                    onClick={handlePublishToggle}
                    disabled={
                      isPublishing || (!domain && !business.isPublished)
                    }
                    variant={business.isPublished ? "destructive" : "default"}
                    className="w-full mt-3"
                  >
                    {isPublishing ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : business.isPublished ? (
                      <>
                        <Lock className="h-4 w-4 mr-2" />
                        Unpublish Website
                      </>
                    ) : (
                      <>
                        <Globe className="h-4 w-4 mr-2" />
                        Publish Website
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* SEO Tab */}
            <TabsContent value="seo" className="space-y-4 mt-4">
              {/* SEO Score */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">SEO Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4">
                      <Progress value={seoScore} className="flex-1" />
                      <span
                        className={cn(
                          "text-sm font-medium",
                          seoScore >= 80
                            ? "text-green-600"
                            : seoScore >= 60
                              ? "text-yellow-600"
                              : "text-red-600",
                        )}
                      >
                        {seoScore}%
                      </span>
                    </div>

                    {issues.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-red-600">
                          Issues to fix:
                        </p>
                        {issues.map((issue, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-2 text-xs"
                          >
                            <AlertCircle className="h-3 w-3 text-red-500 mt-0.5" />
                            <span>{issue}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {suggestions.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-yellow-600">
                          Suggestions:
                        </p>
                        {suggestions.map((suggestion, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-2 text-xs"
                          >
                            <Info className="h-3 w-3 text-yellow-500 mt-0.5" />
                            <span>{suggestion}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Basic SEO */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Page Title</Label>
                  <Input
                    id="title"
                    value={localMetadata.title}
                    onChange={(e) =>
                      handleMetadataUpdate({ title: e.target.value })
                    }
                    placeholder="Enter page title (30-60 characters)"
                    maxLength={60}
                  />
                  <p className="text-xs text-muted-foreground">
                    {localMetadata.title.length}/60 characters
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Meta Description</Label>
                  <Textarea
                    id="description"
                    value={localMetadata.description}
                    onChange={(e) =>
                      handleMetadataUpdate({ description: e.target.value })
                    }
                    placeholder="Enter meta description (120-160 characters)"
                    maxLength={160}
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">
                    {localMetadata.description.length}/160 characters
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Keywords</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add keyword"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleKeywordAdd(
                            (e.target as HTMLInputElement).value,
                          );
                          (e.target as HTMLInputElement).value = "";
                        }
                      }}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {localMetadata.keywords.map((keyword, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="cursor-pointer text-xs"
                        onClick={() => handleKeywordRemove(keyword)}
                      >
                        {keyword} ×
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="robots">Search Engine Visibility</Label>
                  <Select
                    value={localMetadata.robots || "index,follow"}
                    onValueChange={(value) =>
                      handleMetadataUpdate({ robots: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="index,follow">
                        Index, Follow (Default)
                      </SelectItem>
                      <SelectItem value="noindex,follow">
                        No Index, Follow
                      </SelectItem>
                      <SelectItem value="index,nofollow">
                        Index, No Follow
                      </SelectItem>
                      <SelectItem value="noindex,nofollow">
                        No Index, No Follow
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            {/* Social Tab */}
            <TabsContent value="social" className="space-y-4 mt-4">
              {/* Open Graph */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Open Graph (Facebook, LinkedIn)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="ogTitle" className="text-xs">
                      OG Title
                    </Label>
                    <Input
                      id="ogTitle"
                      value={localMetadata.ogTitle || ""}
                      onChange={(e) =>
                        handleMetadataUpdate({ ogTitle: e.target.value })
                      }
                      placeholder="Title for social sharing"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ogDescription" className="text-xs">
                      OG Description
                    </Label>
                    <Textarea
                      id="ogDescription"
                      value={localMetadata.ogDescription || ""}
                      onChange={(e) =>
                        handleMetadataUpdate({ ogDescription: e.target.value })
                      }
                      placeholder="Description for social sharing"
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ogImage" className="text-xs">
                      OG Image URL
                    </Label>
                    <Input
                      id="ogImage"
                      value={localMetadata.ogImage || ""}
                      onChange={(e) =>
                        handleMetadataUpdate({ ogImage: e.target.value })
                      }
                      placeholder="https://example.com/image.jpg"
                    />
                    <p className="text-xs text-muted-foreground">
                      Recommended: 1200x630px
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Twitter Card */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Share2 className="h-4 w-4" />
                    Twitter Card
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="twitterCard" className="text-xs">
                      Card Type
                    </Label>
                    <Select
                      value={localMetadata.twitterCard || "summary"}
                      onValueChange={(value) =>
                        handleMetadataUpdate({ twitterCard: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="summary">Summary</SelectItem>
                        <SelectItem value="summary_large_image">
                          Summary Large Image
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Structured Data */}
              <div className="space-y-2">
                <Label className="text-xs">Structured Data</Label>
                <Button
                  variant="outline"
                  onClick={generateStructuredData}
                  className="w-full text-xs"
                  size="sm"
                >
                  Generate from Business Data
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}
