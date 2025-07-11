"use client";

import { useState, useEffect, useRef } from "react";
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
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Button } from "@/app/components/ui/button";
import { Alert, AlertDescription } from "@/app/components/ui/alert";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import {
  Globe,
  Loader2,
  Check,
  ArrowRight,
  Search,
  Share2,
  Image as ImageIcon,
  X,
  AlertCircle,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import MediaLibrary from "@/app/components/visual-editor/library/media-library";
import { toUrlFriendly } from "@/app/lib/url-utils";

interface PublishSettingsDialogProps {
  businessId: Id<"businesses">;
  businessName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPublishComplete?: () => void;
  pageData?: {
    pageTitle?: string;
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
  };
  onUpdatePageData?: (data: {
    pageTitle?: string;
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
  }) => void;
}

export function PublishSettingsDialog({
  businessId,
  businessName,
  open,
  onOpenChange,
  onPublishComplete,
  pageData,
  onUpdatePageData,
}: PublishSettingsDialogProps) {
  const [activeTab, setActiveTab] = useState("domain");
  const [subdomainInput, setSubdomainInput] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);

  // SEO Settings
  const [seoSettings, setSeoSettings] = useState({
    pageTitle: pageData?.pageTitle || businessName,
    seoTitle: pageData?.seoTitle || "",
    seoDescription: pageData?.seoDescription || "",
    seoKeywords: pageData?.seoKeywords || "",
  });

  // Social Media Settings
  const [socialSettings, setSocialSettings] = useState({
    ogTitle: pageData?.ogTitle || "",
    ogDescription: pageData?.ogDescription || "",
    ogImage: pageData?.ogImage || "",
  });

  // Favicon state
  const [favicon, setFavicon] = useState("");
  const [faviconStorageId, setFaviconStorageId] =
    useState<Id<"_storage"> | null>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  // Validation states
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  // Convex queries and mutations
  const domain = useQuery(api.domains.getByBusinessId, { businessId });
  const generateSubdomain = useMutation(api.domains.generateSubdomain);
  const publishBusiness = useMutation(api.businesses.publish);
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const uploadFavicon = useMutation(api.businessSeo.uploadFavicon);
  const business = useQuery(api.businesses.getById, { id: businessId });

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "locasite.xyz";

  // Initialize favicon from business data
  useEffect(() => {
    if (business?.favicon) {
      setFavicon(business.favicon);
    }
  }, [business]);

  // Handle favicon upload
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
      // Get upload URL
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

      // Update state
      setFaviconStorageId(storageId);

      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      setFavicon(previewUrl);

      toast.success("Favicon uploaded successfully");
    } catch (error) {
      console.error("Error uploading favicon:", error);
      toast.error("Failed to upload favicon");
    }
  };

  // Set default subdomain input if domain exists
  useEffect(() => {
    if (domain?.subdomain && !subdomainInput) {
      setSubdomainInput(domain.subdomain);
    }
  }, [domain, subdomainInput]);

  // Generate initial subdomain suggestion from business name
  useEffect(() => {
    if (businessName && !domain && !subdomainInput) {
      const suggested = toUrlFriendly(businessName);
      setSubdomainInput(suggested);
    }
  }, [businessName, domain, subdomainInput]);

  // Update SEO defaults
  useEffect(() => {
    if (!seoSettings.seoTitle && seoSettings.pageTitle) {
      setSeoSettings((prev) => ({
        ...prev,
        seoTitle: `${prev.pageTitle} | ${businessName}`,
      }));
    }
    if (!socialSettings.ogTitle && seoSettings.pageTitle) {
      setSocialSettings((prev) => ({
        ...prev,
        ogTitle: seoSettings.pageTitle,
      }));
    }
    if (!socialSettings.ogDescription && seoSettings.seoDescription) {
      setSocialSettings((prev) => ({
        ...prev,
        ogDescription: seoSettings.seoDescription,
      }));
    }
  }, [
    seoSettings.pageTitle,
    seoSettings.seoTitle,
    seoSettings.seoDescription,
    businessName,
    socialSettings.ogTitle,
    socialSettings.ogDescription,
  ]);

  const validateSettings = () => {
    const errors: Record<string, string> = {};

    // Domain validation
    if (!subdomainInput || subdomainInput.length < 3) {
      errors.domain = "Subdomain must be at least 3 characters";
    }

    // SEO validation
    if (!seoSettings.pageTitle) {
      errors.pageTitle = "Page title is required";
    }
    if (!seoSettings.seoTitle) {
      errors.seoTitle = "SEO title is required";
    }
    if (seoSettings.seoTitle && seoSettings.seoTitle.length > 60) {
      errors.seoTitle = "SEO title should be under 60 characters";
    }
    if (seoSettings.seoDescription && seoSettings.seoDescription.length > 160) {
      errors.seoDescription = "SEO description should be under 160 characters";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePublish = async () => {
    if (!validateSettings()) {
      // Find the first tab with an error
      if (validationErrors.domain) {
        setActiveTab("domain");
      } else if (
        validationErrors.pageTitle ||
        validationErrors.seoTitle ||
        validationErrors.seoDescription
      ) {
        setActiveTab("seo");
      }
      toast.error("Please fix all errors before publishing");
      return;
    }

    setIsPublishing(true);

    try {
      // Update page data with SEO and social settings
      if (onUpdatePageData) {
        onUpdatePageData({
          pageTitle: seoSettings.pageTitle,
          seoTitle: seoSettings.seoTitle,
          seoDescription: seoSettings.seoDescription,
          seoKeywords: seoSettings.seoKeywords,
          ogTitle: socialSettings.ogTitle,
          ogDescription: socialSettings.ogDescription,
          ogImage: socialSettings.ogImage,
        });
      }

      // Only generate subdomain if it's different from current
      let subdomain = subdomainInput;

      // Check if we need to create/update subdomain
      if (!domain || domain.subdomain !== subdomainInput) {
        const result = await generateSubdomain({
          businessId,
          customSubdomain: subdomainInput,
        });
        subdomain = result.subdomain;
      }

      // Upload favicon if we have a new one
      if (faviconStorageId) {
        await uploadFavicon({ businessId, storageId: faviconStorageId });
      }

      // Publish the business
      await publishBusiness({ businessId });

      // Show success message
      const isDevelopment = process.env.NODE_ENV === "development";
      const publishedUrl = isDevelopment
        ? `http://${subdomain}.localhost:3000`
        : `https://${subdomain}.${rootDomain}`;

      toast.success(
        <div className="flex flex-col gap-1">
          <span>Your website is now live!</span>
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

      onPublishComplete?.();
      onOpenChange(false);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message?.includes("subdomain") &&
        error.message?.includes("taken")
      ) {
        toast.error("This subdomain is already taken. Please choose another.");
        setActiveTab("domain");
      } else {
        toast.error("Failed to publish website");
      }
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Publish Website Settings</DialogTitle>
          <DialogDescription>
            Configure your website&apos;s domain, SEO, and social media settings
            before publishing.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="domain" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Domain
              {validationErrors.domain && (
                <AlertCircle className="h-3 w-3 text-destructive" />
              )}
            </TabsTrigger>
            <TabsTrigger value="seo" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              SEO
              {(validationErrors.pageTitle ||
                validationErrors.seoTitle ||
                validationErrors.seoDescription) && (
                <AlertCircle className="h-3 w-3 text-destructive" />
              )}
            </TabsTrigger>
            <TabsTrigger value="social" className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              Social
            </TabsTrigger>
          </TabsList>

          <TabsContent value="domain" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="subdomain">Website Address</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    id="subdomain"
                    value={subdomainInput}
                    onChange={(e) => {
                      // Allow user to type, we'll make it URL-friendly on blur
                      setSubdomainInput(e.target.value);
                      setValidationErrors((prev) => ({ ...prev, domain: "" }));
                    }}
                    onBlur={(e) => {
                      // Make URL-friendly on blur
                      const urlFriendly = toUrlFriendly(e.target.value);
                      setSubdomainInput(urlFriendly);
                    }}
                    placeholder="your-business"
                    disabled={isPublishing}
                    className={cn(
                      "pr-8",
                      validationErrors.domain && "border-destructive",
                    )}
                  />
                  {subdomainInput.length >= 3 && !validationErrors.domain && (
                    <Check className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-green-600" />
                  )}
                </div>
                <span className="flex items-center px-3 text-sm text-muted-foreground bg-muted rounded-md">
                  .{rootDomain}
                </span>
              </div>
              {validationErrors.domain && (
                <p className="text-xs text-destructive">
                  {validationErrors.domain}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Letters, numbers, and hyphens only. At least 3 characters.
              </p>
            </div>

            {subdomainInput && !validationErrors.domain && (
              <Alert>
                <Globe className="h-4 w-4" />
                <AlertDescription>
                  Your website will be available at:{" "}
                  <span className="font-medium">
                    {process.env.NODE_ENV === "development"
                      ? `http://${subdomainInput}.localhost:3000`
                      : `https://${subdomainInput}.${rootDomain}`}
                  </span>
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>

          <TabsContent value="seo" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="pageTitle">Page Title</Label>
              <Input
                id="pageTitle"
                value={seoSettings.pageTitle}
                onChange={(e) => {
                  setSeoSettings((prev) => ({
                    ...prev,
                    pageTitle: e.target.value,
                  }));
                  setValidationErrors((prev) => ({ ...prev, pageTitle: "" }));
                }}
                placeholder="My Business"
                disabled={isPublishing}
                className={
                  validationErrors.pageTitle ? "border-destructive" : ""
                }
              />
              {validationErrors.pageTitle && (
                <p className="text-xs text-destructive">
                  {validationErrors.pageTitle}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="seoTitle">SEO Title</Label>
              <div className="relative">
                <Input
                  id="seoTitle"
                  value={seoSettings.seoTitle}
                  onChange={(e) => {
                    setSeoSettings((prev) => ({
                      ...prev,
                      seoTitle: e.target.value,
                    }));
                    setValidationErrors((prev) => ({ ...prev, seoTitle: "" }));
                  }}
                  placeholder="My Business | Best Service in Town"
                  disabled={isPublishing}
                  className={
                    validationErrors.seoTitle ? "border-destructive" : ""
                  }
                />
                <span
                  className={cn(
                    "absolute right-2 top-1/2 -translate-y-1/2 text-xs",
                    seoSettings.seoTitle.length > 60
                      ? "text-destructive"
                      : "text-muted-foreground",
                  )}
                >
                  {seoSettings.seoTitle.length}/60
                </span>
              </div>
              {validationErrors.seoTitle && (
                <p className="text-xs text-destructive">
                  {validationErrors.seoTitle}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Appears in search results and browser tabs
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="seoDescription">SEO Description</Label>
              <div className="relative">
                <Textarea
                  id="seoDescription"
                  value={seoSettings.seoDescription}
                  onChange={(e) => {
                    setSeoSettings((prev) => ({
                      ...prev,
                      seoDescription: e.target.value,
                    }));
                    setValidationErrors((prev) => ({
                      ...prev,
                      seoDescription: "",
                    }));
                  }}
                  placeholder="We provide the best service in town..."
                  rows={3}
                  disabled={isPublishing}
                  className={
                    validationErrors.seoDescription ? "border-destructive" : ""
                  }
                />
                <span
                  className={cn(
                    "absolute right-2 bottom-2 text-xs",
                    seoSettings.seoDescription.length > 160
                      ? "text-destructive"
                      : "text-muted-foreground",
                  )}
                >
                  {seoSettings.seoDescription.length}/160
                </span>
              </div>
              {validationErrors.seoDescription && (
                <p className="text-xs text-destructive">
                  {validationErrors.seoDescription}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Appears in search results below the title
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="seoKeywords">Keywords</Label>
              <Input
                id="seoKeywords"
                value={seoSettings.seoKeywords}
                onChange={(e) =>
                  setSeoSettings((prev) => ({
                    ...prev,
                    seoKeywords: e.target.value,
                  }))
                }
                placeholder="restaurant, food, dining, local"
                disabled={isPublishing}
              />
              <p className="text-xs text-muted-foreground">
                Comma-separated keywords (optional)
              </p>
            </div>
          </TabsContent>

          <TabsContent value="social" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Favicon</Label>
              <div className="flex items-center gap-4">
                {favicon && (
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={favicon}
                      alt="Favicon preview"
                      className="w-8 h-8 rounded border"
                    />
                  </div>
                )}
                <input
                  ref={faviconInputRef}
                  type="file"
                  accept="image/png,image/x-icon,image/svg+xml,.ico"
                  onChange={handleFaviconUpload}
                  className="hidden"
                  disabled={isPublishing}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => faviconInputRef.current?.click()}
                  disabled={isPublishing}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {favicon ? "Change Favicon" : "Upload Favicon"}
                </Button>
                {favicon && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFavicon("");
                      setFaviconStorageId(null);
                    }}
                    disabled={isPublishing}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Recommended: 32x32px PNG, ICO, or SVG. This icon appears in
                browser tabs.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ogTitle">Social Media Title</Label>
              <Input
                id="ogTitle"
                value={socialSettings.ogTitle}
                onChange={(e) =>
                  setSocialSettings((prev) => ({
                    ...prev,
                    ogTitle: e.target.value,
                  }))
                }
                placeholder="My Business"
                disabled={isPublishing}
              />
              <p className="text-xs text-muted-foreground">
                Title when shared on Facebook, Twitter, etc.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ogDescription">Social Media Description</Label>
              <Textarea
                id="ogDescription"
                value={socialSettings.ogDescription}
                onChange={(e) =>
                  setSocialSettings((prev) => ({
                    ...prev,
                    ogDescription: e.target.value,
                  }))
                }
                placeholder="Check out our amazing services..."
                rows={3}
                disabled={isPublishing}
              />
              <p className="text-xs text-muted-foreground">
                Description when shared on social media
              </p>
            </div>

            <div className="space-y-2">
              <Label>Social Media Image</Label>
              {socialSettings.ogImage && (
                <div className="relative aspect-video rounded-lg overflow-hidden border bg-muted mb-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={socialSettings.ogImage}
                    alt="Social media preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <MediaLibrary
                businessId={businessId}
                onSelect={(url) => {
                  setSocialSettings((prev) => ({ ...prev, ogImage: url }));
                }}
                trigger={
                  <Button
                    variant="outline"
                    className="w-full"
                    disabled={isPublishing}
                  >
                    <ImageIcon className="h-4 w-4 mr-2" />
                    {socialSettings.ogImage ? "Change Image" : "Select Image"}
                  </Button>
                }
                fileTypes={["image/*"]}
              />
              {socialSettings.ogImage && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setSocialSettings((prev) => ({ ...prev, ogImage: "" }))
                  }
                  className="w-full"
                  disabled={isPublishing}
                >
                  <X className="h-4 w-4 mr-2" />
                  Remove Image
                </Button>
              )}
              <p className="text-xs text-muted-foreground">
                Recommended size: 1200x630px. Appears when shared on social
                media.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6">
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
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                Publish Website
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Helper function
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
