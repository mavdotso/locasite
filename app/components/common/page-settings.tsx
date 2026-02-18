"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Button } from "@/app/components/ui/button";
import { Alert, AlertDescription } from "@/app/components/ui/alert";
import { Dialog, DialogContent } from "@/app/components/ui/dialog";
import { Progress } from "@/app/components/ui/progress";
import { Separator } from "@/app/components/ui/separator";
import {
  Globe,
  AlertCircle,
  Info,
  Check,
  Loader2,
  Lock,
  Image as ImageIcon,
  Upload,
  X,
  Search,
  FileText,
  Share2,
} from "lucide-react";
import { cn } from "@/app/lib/utils";
import { Id } from "@/convex/_generated/dataModel";
import { Doc } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import dynamic from "next/dynamic";

const MediaLibrary = dynamic(
  () => import("@/app/components/visual-editor/library/media-library"),
  {
    loading: () => (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    ),
  },
);
import { toUrlFriendly } from "@/app/lib/url-utils";

export interface PageSettingsData {
  // General
  pageTitle: string;

  // Domain
  subdomain?: string;

  // SEO
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;

  // Social
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  favicon?: string;
  faviconStorageId?: Id<"_storage"> | null;

  // Publishing
  isPublished?: boolean;
}

interface PageSettingsProps {
  businessId: Id<"businesses">;
  business?: Doc<"businesses">;
  initialData?: Partial<PageSettingsData>;
  onSave?: (data: PageSettingsData) => void;
  onPublish?: () => void;
  showDomainSettings?: boolean;
  showPublishButton?: boolean;
  className?: string;
}

export function PageSettings({
  businessId,
  business,
  initialData,
  onSave,
  onPublish,
  showDomainSettings = true,
  showPublishButton = true,
  className,
}: PageSettingsProps) {
  const [isPublishing, setIsPublishing] = useState(false);
  const [isChangingDomain, setIsChangingDomain] = useState(false);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [mediaLibraryField, setMediaLibraryField] = useState<
    "ogImage" | "favicon" | null
  >(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  // Form data state
  const [formData, setFormData] = useState<PageSettingsData>({
    pageTitle: initialData?.pageTitle || business?.name || "",
    subdomain: initialData?.subdomain || "",
    seoTitle: initialData?.seoTitle || "",
    seoDescription: initialData?.seoDescription || "",
    seoKeywords: initialData?.seoKeywords || "",
    ogTitle: initialData?.ogTitle || "",
    ogDescription: initialData?.ogDescription || "",
    ogImage: initialData?.ogImage || "",
    favicon: initialData?.favicon || "",
    faviconStorageId: initialData?.faviconStorageId || null,
    isPublished: initialData?.isPublished || false,
  });

  // Validation state
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [seoScore, setSeoScore] = useState(0);
  const [issues, setIssues] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Convex queries and mutations
  const domain = useQuery(api.domains.getByBusinessId, { businessId });
  const generateSubdomain = useMutation(api.domains.generateSubdomain);
  const publishBusiness = useMutation(api.businessPublishing.publishBusiness);
  const unpublishBusiness = useMutation(api.businessPublishing.unpublishBusiness);
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const uploadFavicon = useMutation(api.businessSeo.uploadFavicon);
  const updateSeoSettings = useMutation(api.businessSeo.updateSeoSettings);

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "locasite.xyz";

  // Initialize form data from business
  useEffect(() => {
    if (business) {
      setFormData((prev) => ({
        ...prev,
        pageTitle: initialData?.pageTitle || business.name || prev.pageTitle,
        favicon: business.favicon || prev.favicon,
        seoTitle: business.seoTitle || initialData?.seoTitle || prev.seoTitle,
        seoDescription:
          business.seoDescription ||
          initialData?.seoDescription ||
          prev.seoDescription,
        seoKeywords:
          business.seoKeywords?.join(", ") ||
          initialData?.seoKeywords ||
          prev.seoKeywords,
        ogTitle: initialData?.ogTitle || prev.ogTitle,
        ogDescription: initialData?.ogDescription || prev.ogDescription,
        ogImage: business.ogImage || initialData?.ogImage || prev.ogImage,
        isPublished: business.isPublished || prev.isPublished,
      }));
    }
  }, [business, initialData]);

  // Initialize subdomain
  useEffect(() => {
    if (domain?.subdomain && !formData.subdomain) {
      setFormData((prev) => ({ ...prev, subdomain: domain.subdomain }));
    } else if (!domain && business?.name && !formData.subdomain) {
      const suggested = toUrlFriendly(business.name);
      setFormData((prev) => ({ ...prev, subdomain: suggested }));
    }
  }, [domain, business?.name, formData.subdomain]);

  // Update SEO defaults
  useEffect(() => {
    if (!formData.seoTitle && formData.pageTitle) {
      setFormData((prev) => ({
        ...prev,
        seoTitle: `${prev.pageTitle} | ${business?.name || ""}`,
      }));
    }
    if (!formData.ogTitle && formData.pageTitle) {
      setFormData((prev) => ({
        ...prev,
        ogTitle: formData.pageTitle,
      }));
    }
    if (!formData.ogDescription && formData.seoDescription) {
      setFormData((prev) => ({
        ...prev,
        ogDescription: formData.seoDescription,
      }));
    }
  }, [
    formData.pageTitle,
    formData.seoTitle,
    formData.seoDescription,
    business?.name,
    formData.ogTitle,
    formData.ogDescription,
  ]);

  // Calculate SEO score
  useEffect(() => {
    const calculateSEOScore = () => {
      let score = 0;
      const newIssues: string[] = [];
      const newSuggestions: string[] = [];

      // Title checks
      if (formData.seoTitle) {
        score += 10;
        if (formData.seoTitle.length >= 30 && formData.seoTitle.length <= 60) {
          score += 10;
        } else {
          newIssues.push("SEO title should be between 30-60 characters");
        }
      } else {
        newIssues.push("Missing SEO title");
      }

      // Description checks
      if (formData.seoDescription) {
        score += 10;
        if (
          formData.seoDescription.length >= 120 &&
          formData.seoDescription.length <= 160
        ) {
          score += 10;
        } else {
          newIssues.push(
            "SEO description should be between 120-160 characters",
          );
        }
      } else {
        newIssues.push("Missing SEO description");
      }

      // Keywords
      if (formData.seoKeywords && formData.seoKeywords.length > 0) {
        score += 10;
        const keywords = formData.seoKeywords
          .split(",")
          .filter((k) => k.trim());
        if (keywords.length >= 3 && keywords.length <= 10) {
          score += 5;
        } else {
          newSuggestions.push("Aim for 3-10 relevant keywords");
        }
      } else {
        newIssues.push("No keywords specified");
      }

      // Open Graph
      if (formData.ogTitle) score += 10;
      else
        newSuggestions.push("Add Open Graph title for better social sharing");

      if (formData.ogDescription) score += 10;
      else newSuggestions.push("Add Open Graph description for social media");

      if (formData.ogImage) score += 10;
      else newIssues.push("Missing Open Graph image for social sharing");

      // Favicon
      if (formData.favicon) score += 10;
      else newSuggestions.push("Add a favicon for better branding");

      setSeoScore(Math.min(score, 100));
      setIssues(newIssues);
      setSuggestions(newSuggestions);
    };

    calculateSEOScore();
  }, [formData]);

  // Validation
  const validateSettings = () => {
    const errors: Record<string, string> = {};

    // Domain validation
    if (
      showDomainSettings &&
      (!formData.subdomain || formData.subdomain.length < 3)
    ) {
      errors.domain = "Subdomain must be at least 3 characters";
    }

    // General validation
    if (!formData.pageTitle) {
      errors.pageTitle = "Page title is required";
    }

    // SEO validation
    if (!formData.seoTitle) {
      errors.seoTitle = "SEO title is required";
    }
    if (formData.seoTitle && formData.seoTitle.length > 60) {
      errors.seoTitle = "SEO title should be under 60 characters";
    }
    if (formData.seoDescription && formData.seoDescription.length > 160) {
      errors.seoDescription = "SEO description should be under 160 characters";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleDomainChange = async () => {
    if (!formData.subdomain || formData.subdomain.length < 3) {
      toast.error("Subdomain must be at least 3 characters");
      return;
    }

    setIsChangingDomain(true);

    try {
      await generateSubdomain({
        businessId,
        customSubdomain: formData.subdomain,
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
  };

  const handleFaviconUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match(/^image\/(png|ico|svg\+xml|x-icon)$/)) {
      toast.error("Please upload a PNG, ICO, or SVG file");
      return;
    }

    // Validate file size (max 1MB for favicon)
    if (file.size > 1024 * 1024) {
      toast.error("Favicon must be less than 1MB");
      return;
    }

    try {
      const uploadUrl = await generateUploadUrl();

      // Upload file
      const response = await fetch(uploadUrl, {
        method: "POST",
        body: file,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const { storageId } = await response.json();

      setFormData((prev) => ({
        ...prev,
        faviconStorageId: storageId,
        favicon: URL.createObjectURL(file), // Preview URL
      }));

      toast.success("Favicon uploaded successfully");
    } catch (error) {
      console.error("Error uploading favicon:", error);
      toast.error("Failed to upload favicon");
    }
  };

  const handlePublishToggle = async () => {
    try {
      setIsPublishing(true);

      if (formData.isPublished) {
        await unpublishBusiness({ businessId });
        setFormData((prev) => ({ ...prev, isPublished: false }));
        toast.success("Website unpublished successfully");
      } else {
        if (!domain) {
          toast.error("Please set a domain before publishing");
          return;
        }

        await publishBusiness({ businessId });
        setFormData((prev) => ({ ...prev, isPublished: true }));

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

        if (onPublish) {
          onPublish();
        }
      }
    } catch {
      toast.error(
        formData.isPublished ? "Failed to unpublish" : "Failed to publish",
      );
    } finally {
      setIsPublishing(false);
    }
  };

  const handleSave = async () => {
    if (!validateSettings()) {
      toast.error("Please fix all errors before saving");
      return;
    }

    try {
      // Save favicon if uploaded
      if (formData.faviconStorageId) {
        const faviconUrl = await uploadFavicon({
          businessId,
          storageId: formData.faviconStorageId,
        });
        setFormData((prev) => ({ ...prev, favicon: faviconUrl.url }));
      }

      // Save SEO settings
      await updateSeoSettings({
        businessId,
        seoTitle: formData.seoTitle,
        seoDescription: formData.seoDescription,
        seoKeywords: formData.seoKeywords
          .split(",")
          .map((k) => k.trim())
          .filter(Boolean),
        ogImage: formData.ogImage,
      });

      // Call onSave callback if provided
      if (onSave) {
        onSave(formData);
      }

      toast.success("Settings saved successfully");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    }
  };

  const handleMediaSelect = (url: string) => {
    if (mediaLibraryField === "ogImage") {
      setFormData((prev) => ({ ...prev, ogImage: url }));
    } else if (mediaLibraryField === "favicon") {
      setFormData((prev) => ({ ...prev, favicon: url }));
    }
    setShowMediaLibrary(false);
    setMediaLibraryField(null);
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* General Settings */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold">General Settings</h3>
        </div>

        <div className="space-y-2">
          <Label htmlFor="pageTitle">Page Title</Label>
          <Input
            id="pageTitle"
            value={formData.pageTitle}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, pageTitle: e.target.value }))
            }
            placeholder="Enter page title"
            className={validationErrors.pageTitle ? "border-red-500" : ""}
          />
          {validationErrors.pageTitle && (
            <p className="text-xs text-red-500">{validationErrors.pageTitle}</p>
          )}
          <p className="text-xs text-muted-foreground">
            This is the main title displayed on your page
          </p>
        </div>
      </div>

      <Separator />

      {/* Domain Settings */}
      {showDomainSettings && (
        <>
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-lg font-semibold">Domain & Publishing</h3>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Website Address</Label>
                <div className="flex gap-2 mt-2">
                  <div className="relative flex-1">
                    <Input
                      value={formData.subdomain}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          subdomain: e.target.value,
                        }))
                      }
                      placeholder="your-business"
                      className={
                        validationErrors.domain ? "border-red-500" : ""
                      }
                    />
                    {formData.subdomain &&
                      formData.subdomain.length >= 3 &&
                      formData.subdomain === domain?.subdomain && (
                        <Check className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-green-600" />
                      )}
                  </div>
                  <span className="flex items-center px-3 text-sm text-muted-foreground bg-muted rounded-md">
                    .{rootDomain}
                  </span>
                </div>
                {validationErrors.domain && (
                  <p className="text-xs text-red-500 mt-1">
                    {validationErrors.domain}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Letters, numbers, and hyphens only. At least 3 characters.
                </p>

                {formData.subdomain !== domain?.subdomain && (
                  <Button
                    onClick={handleDomainChange}
                    disabled={
                      isChangingDomain ||
                      !formData.subdomain ||
                      formData.subdomain.length < 3
                    }
                    size="sm"
                    className="mt-3"
                  >
                    {isChangingDomain ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Update Domain"
                    )}
                  </Button>
                )}
              </div>

              {showPublishButton && (
                <div className="space-y-3">
                  <Label>Website Status</Label>
                  <Alert>
                    <Globe className="h-4 w-4" />
                    <AlertDescription>
                      {formData.isPublished ? (
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
                      isPublishing || (!domain && !formData.isPublished)
                    }
                    variant={formData.isPublished ? "destructive" : "default"}
                    className="w-full"
                  >
                    {isPublishing ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : formData.isPublished ? (
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
              )}
            </div>
          </div>

          <Separator />
        </>
      )}

      {/* SEO Settings */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Search className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold">SEO Settings</h3>
        </div>

        {/* SEO Score */}
        <div className="bg-muted/50 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">SEO Score</span>
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
          <Progress value={seoScore} className="h-2" />

          {issues.length > 0 && (
            <div className="space-y-1 mt-3">
              <p className="text-xs font-medium text-red-600">Issues to fix:</p>
              {issues.map((issue, index) => (
                <div key={index} className="flex items-start gap-2 text-xs">
                  <AlertCircle className="h-3 w-3 text-red-500 mt-0.5" />
                  <span>{issue}</span>
                </div>
              ))}
            </div>
          )}

          {suggestions.length > 0 && (
            <div className="space-y-1 mt-3">
              <p className="text-xs font-medium text-yellow-600">
                Suggestions:
              </p>
              {suggestions.map((suggestion, index) => (
                <div key={index} className="flex items-start gap-2 text-xs">
                  <Info className="h-3 w-3 text-yellow-500 mt-0.5" />
                  <span>{suggestion}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SEO Fields */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="seoTitle">SEO Title</Label>
            <Input
              id="seoTitle"
              value={formData.seoTitle}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, seoTitle: e.target.value }))
              }
              placeholder="Enter SEO title (30-60 characters)"
              maxLength={60}
              className={validationErrors.seoTitle ? "border-red-500" : ""}
            />
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">
                {formData.seoTitle.length}/60 characters
              </span>
              {validationErrors.seoTitle && (
                <span className="text-red-500">
                  {validationErrors.seoTitle}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="seoDescription">Meta Description</Label>
            <Textarea
              id="seoDescription"
              value={formData.seoDescription}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  seoDescription: e.target.value,
                }))
              }
              placeholder="Enter meta description (120-160 characters)"
              maxLength={160}
              rows={3}
              className={
                validationErrors.seoDescription ? "border-red-500" : ""
              }
            />
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">
                {formData.seoDescription.length}/160 characters
              </span>
              {validationErrors.seoDescription && (
                <span className="text-red-500">
                  {validationErrors.seoDescription}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Keywords</Label>
            <Input
              value={formData.seoKeywords}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  seoKeywords: e.target.value,
                }))
              }
              placeholder="Enter keywords separated by commas"
            />
            <p className="text-xs text-muted-foreground">
              Separate keywords with commas (e.g., restaurant, italian food,
              pizza)
            </p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Social Media Settings */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Share2 className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold">Social Media</h3>
        </div>

        {/* Favicon */}
        <div className="space-y-3">
          <Label>Favicon</Label>
          <div className="flex items-center gap-4">
            {formData.favicon && (
              <div className="relative">
                <Image
                  src={formData.favicon}
                  alt="Favicon"
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-lg border bg-muted object-contain"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full bg-background border"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      favicon: "",
                      faviconStorageId: null,
                    }))
                  }
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}

            <div className="flex-1 space-y-2">
              <input
                ref={faviconInputRef}
                type="file"
                accept="image/png,image/x-icon,image/svg+xml"
                onChange={handleFaviconUpload}
                className="hidden"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => faviconInputRef.current?.click()}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Favicon
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setMediaLibraryField("favicon");
                  setShowMediaLibrary(true);
                }}
                className="w-full"
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                Choose from Library
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Recommended: 32x32px or 16x16px PNG, ICO, or SVG file
          </p>
        </div>

        {/* Open Graph */}
        <div className="space-y-4">
          <Label>Open Graph (Facebook, LinkedIn)</Label>

          <div className="space-y-2">
            <Label htmlFor="ogTitle" className="text-sm font-normal">
              OG Title
            </Label>
            <Input
              id="ogTitle"
              value={formData.ogTitle}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  ogTitle: e.target.value,
                }))
              }
              placeholder="Title for social sharing"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ogDescription" className="text-sm font-normal">
              OG Description
            </Label>
            <Textarea
              id="ogDescription"
              value={formData.ogDescription}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  ogDescription: e.target.value,
                }))
              }
              placeholder="Description for social sharing"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ogImage" className="text-sm font-normal">
              OG Image
            </Label>
            <div className="flex gap-2">
              <Input
                id="ogImage"
                value={formData.ogImage}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    ogImage: e.target.value,
                  }))
                }
                placeholder="https://example.com/image.jpg"
                className="flex-1"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setMediaLibraryField("ogImage");
                  setShowMediaLibrary(true);
                }}
              >
                <ImageIcon className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Recommended: 1200x630px
            </p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4">
        <Button onClick={handleSave} className="min-w-[120px]">
          Save Settings
        </Button>
      </div>

      {/* Media Library Modal */}
      {showMediaLibrary && businessId && (
        <Dialog
          open={showMediaLibrary}
          onOpenChange={(open) => {
            if (!open) {
              setShowMediaLibrary(false);
              setMediaLibraryField(null);
            }
          }}
        >
          <DialogContent className="max-w-4xl">
            <MediaLibrary
              businessId={businessId}
              onSelect={handleMediaSelect}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
