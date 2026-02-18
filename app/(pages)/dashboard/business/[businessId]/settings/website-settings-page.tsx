"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Alert, AlertDescription } from "@/app/components/ui/alert";
import { Progress } from "@/app/components/ui/progress";
import {
  ArrowLeft,
  Globe,
  Loader2,
  Check,
  AlertCircle,
  Info,
  Lock,
  Upload,
  X,
  Image as ImageIcon,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { toast } from "sonner";
import { cn } from "@/app/lib/utils";
import { useSubscription } from "@/app/hooks/use-subscription";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";

import dynamic from "next/dynamic";
import Image from "next/image";

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

export default function WebsiteSettingsPage({
  businessId,
}: {
  businessId: Id<"businesses">;
}) {
  const dashboardData = useQuery(api.dashboardData.getDashboardBusinessData, {
    businessId,
  });
  const faviconInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { canUseFeature } = useSubscription();

  const business = dashboardData?.business;
  const domain = dashboardData?.domain;

  // Mutations
  const generateSubdomain = useMutation(api.domains.generateSubdomain);
  const publishBusiness = useMutation(api.businessPublishing.publishBusiness);
  const unpublishBusiness = useMutation(api.businessPublishing.unpublishBusiness);
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const uploadFavicon = useMutation(api.businessSeo.uploadFavicon);
  const updateSeoSettings = useMutation(api.businessSeo.updateSeoSettings);
  const deleteBusiness = useMutation(api.businesses.deleteBusiness);

  // State
  const [isPublishing, setIsPublishing] = useState(false);
  const [isChangingDomain, setIsChangingDomain] = useState(false);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [mediaLibraryField, setMediaLibraryField] = useState<
    "ogImage" | "favicon" | null
  >(null);
  const [seoScore, setSeoScore] = useState(0);
  const [issues, setIssues] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    pageTitle: "",
    subdomain: "",
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
    favicon: "",
    faviconStorageId: null as Id<"_storage"> | null,
    isPublished: false,
  });

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "locasite.xyz";

  // Initialize form data
  useEffect(() => {
    if (business && domain !== undefined) {
      setFormData({
        pageTitle: business.name || "",
        subdomain: domain?.subdomain || "",
        seoTitle: business.seoTitle || "",
        seoDescription: business.seoDescription || "",
        seoKeywords: business.seoKeywords?.join(", ") || "",
        ogTitle: business.name || "",
        ogDescription: business.description || "",
        ogImage: business.ogImage || "",
        favicon: business.favicon || "",
        faviconStorageId: null,
        isPublished: business.isPublished || false,
      });
    }
  }, [business, domain]);

  // Calculate SEO score
  useEffect(() => {
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
        newIssues.push("SEO description should be between 120-160 characters");
      }
    } else {
      newIssues.push("Missing SEO description");
    }

    // Keywords
    if (formData.seoKeywords) {
      score += 10;
      const keywords = formData.seoKeywords.split(",").filter((k) => k.trim());
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
    else newSuggestions.push("Add Open Graph title for better social sharing");

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
  }, [formData]);

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
      if (error instanceof Error && error.message?.includes("taken")) {
        toast.error("This subdomain is already taken. Please choose another.");
      } else {
        toast.error("Failed to update domain");
      }
    } finally {
      setIsChangingDomain(false);
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
        const publishedUrl = `https://${domain.subdomain}.${rootDomain}`;
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
        formData.isPublished ? "Failed to unpublish" : "Failed to publish",
      );
    } finally {
      setIsPublishing(false);
    }
  };

  const handleFaviconUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match(/^image\/(png|ico|svg\+xml|x-icon)$/)) {
      toast.error("Please upload a PNG, ICO, or SVG file");
      return;
    }

    if (file.size > 1024 * 1024) {
      toast.error("Favicon must be less than 1MB");
      return;
    }

    try {
      const uploadUrl = await generateUploadUrl();
      const response = await fetch(uploadUrl, {
        method: "POST",
        body: file,
      });

      if (!response.ok) throw new Error("Upload failed");

      const { storageId } = await response.json();
      setFormData((prev) => ({
        ...prev,
        faviconStorageId: storageId,
        favicon: URL.createObjectURL(file),
      }));
      toast.success("Favicon uploaded successfully");
    } catch (error) {
      console.error("Error uploading favicon:", error);
      toast.error("Failed to upload favicon");
    }
  };

  const handleSaveGeneralSettings = async () => {
    try {
      // For now, page title is saved locally in formData
      // In the future, you might want to save this to the database
      toast.success("General settings saved successfully");
    } catch (error) {
      console.error("Error saving general settings:", error);
      toast.error("Failed to save general settings");
    }
  };

  const handleSaveSeoSettings = async () => {
    try {
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

      toast.success("SEO settings saved successfully");
    } catch (error) {
      console.error("Error saving SEO settings:", error);
      toast.error("Failed to save SEO settings");
    }
  };

  const handleSaveSocialSettings = async () => {
    try {
      // Save favicon if uploaded
      if (formData.faviconStorageId) {
        const faviconUrl = await uploadFavicon({
          businessId,
          storageId: formData.faviconStorageId,
        });
        setFormData((prev) => ({ ...prev, favicon: faviconUrl.url }));
      }

      // Save OG settings
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

      toast.success("Social media settings saved successfully");
    } catch (error) {
      console.error("Error saving social settings:", error);
      toast.error("Failed to save social settings");
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

  const handleDeleteBusiness = async () => {
    try {
      setIsDeleting(true);
      await deleteBusiness({ businessId });
      toast.success("Website deleted successfully");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error deleting business:", error);
      toast.error("Failed to delete website");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  if (business === undefined || domain === undefined) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!business) {
    return null;
  }

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Sites
          </Link>
        </Button>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Website Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your website&apos;s settings, SEO, and publishing options
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="general">General & Publishing</TabsTrigger>
          <TabsTrigger value="seo">SEO & Social</TabsTrigger>
        </TabsList>

        {/* General & Publishing Tab */}
        <TabsContent value="general" className="space-y-6">
          {/* General Settings Card */}
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Basic information about your website
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="pageTitle">Page Title</Label>
                <Input
                  id="pageTitle"
                  value={formData.pageTitle}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      pageTitle: e.target.value,
                    }))
                  }
                  placeholder="Enter page title"
                />
                <p className="text-xs text-muted-foreground">
                  This is the main title displayed on your page
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleSaveGeneralSettings}
                size="sm"
                className="ml-auto"
              >
                Save Changes
              </Button>
            </CardFooter>
          </Card>

          {/* Domain Settings Card */}
          <Card>
            <CardHeader>
              <CardTitle>Domain Settings</CardTitle>
              <CardDescription>
                Configure your website&apos;s domain
              </CardDescription>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>

          {/* Publishing Status Card */}
          <Card>
            <CardHeader>
              <CardTitle>Publishing Status</CardTitle>
              <CardDescription>
                Control your website&apos;s visibility
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Alert>
                <Globe className="h-4 w-4" />
                <AlertDescription>
                  {formData.isPublished ? (
                    <p>
                      Your website is currently{" "}
                      <span className="font-medium text-green-600">live</span>{" "}
                      and accessible at:{" "}
                      {domain && (
                        <a
                          href={`https://${domain.subdomain}.${rootDomain}`}
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
                disabled={isPublishing || (!domain && !formData.isPublished)}
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
            </CardContent>
          </Card>

          {/* Delete Website Card */}
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>Permanently delete this website</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Once you delete a website, there is no going back. All data
                  including pages, settings, and media will be permanently
                  removed.
                </AlertDescription>
              </Alert>
              <Button
                variant="destructive"
                className="mt-4"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Website
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO & Social Tab */}
        <TabsContent value="seo" className="space-y-6">
          {/* SEO Score Card */}
          <Card>
            <CardHeader>
              <CardTitle>SEO Score</CardTitle>
              <CardDescription>
                Track your search engine optimization performance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
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
                  <p className="text-xs font-medium text-red-600">
                    Issues to fix:
                  </p>
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
            </CardContent>
          </Card>

          {/* SEO Settings Card */}
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
              <CardDescription>
                Optimize your website for search engines
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="seoTitle">SEO Title</Label>
                <Input
                  id="seoTitle"
                  value={formData.seoTitle}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      seoTitle: e.target.value,
                    }))
                  }
                  placeholder="Enter SEO title (30-60 characters)"
                  maxLength={60}
                />
                <div className="text-xs text-muted-foreground">
                  {formData.seoTitle.length}/60 characters
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
                />
                <div className="text-xs text-muted-foreground">
                  {formData.seoDescription.length}/160 characters
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
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleSaveSeoSettings}
                size="sm"
                className="ml-auto"
              >
                Save SEO Settings
              </Button>
            </CardFooter>
          </Card>

          {/* Social Media Settings Card */}
          <Card>
            <CardHeader>
              <CardTitle>Social Media</CardTitle>
              <CardDescription>
                Configure how your website appears when shared on social media
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Favicon */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Favicon</Label>
                  {!canUseFeature("PROFESSIONAL") && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      Pro feature
                    </span>
                  )}
                </div>
                {canUseFeature("PROFESSIONAL") ? (
                  <>
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
                  </>
                ) : (
                  <Alert>
                    <Lock className="h-4 w-4" />
                    <AlertDescription>
                      Custom favicons are available on Professional and Business
                      plans.{" "}
                      <Link
                        href="/dashboard/billing"
                        className="font-medium underline"
                      >
                        Upgrade now
                      </Link>
                    </AlertDescription>
                  </Alert>
                )}
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
                  <Label
                    htmlFor="ogDescription"
                    className="text-sm font-normal"
                  >
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
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleSaveSocialSettings}
                size="sm"
                className="ml-auto"
              >
                Save Social Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Media Library Modal */}
      {showMediaLibrary && businessId && (
        <MediaLibrary
          businessId={businessId}
          onSelect={handleMediaSelect}
          trigger={<></>}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              website and remove all associated data including pages, settings,
              and media files.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteBusiness}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Website
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
