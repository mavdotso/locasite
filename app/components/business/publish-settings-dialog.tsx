"use client";

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
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Alert, AlertDescription } from "@/app/components/ui/alert";
import { Loader2, CheckCircle, Info, Globe, Search, Share2, ImageIcon, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/app/lib/utils";
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

type Step = "general" | "seo" | "social";

interface StepConfig {
  id: Step;
  title: string;
  description: string;
  icon: React.ElementType;
  optional?: boolean;
}

const steps: StepConfig[] = [
  {
    id: "general",
    title: "General Settings",
    description: "Configure your website name and domain",
    icon: Globe,
  },
  {
    id: "seo",
    title: "SEO Settings",
    description: "Optimize for search engines",
    icon: Search,
    optional: true,
  },
  {
    id: "social",
    title: "Social Media",
    description: "Customize social media appearance",
    icon: Share2,
    optional: true,
  },
];

export function PublishSettingsDialog({
  businessId,
  businessName,
  open,
  onOpenChange,
  onPublishComplete,
  pageData,
  onUpdatePageData,
}: PublishSettingsDialogProps) {
  const [currentStep, setCurrentStep] = useState<Step>("general");
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    // General
    pageTitle: pageData?.pageTitle || businessName,
    subdomain: "",

    // SEO
    seoTitle: pageData?.seoTitle || "",
    seoDescription: pageData?.seoDescription || "",
    seoKeywords: pageData?.seoKeywords || "",

    // Social
    ogTitle: pageData?.ogTitle || "",
    ogDescription: pageData?.ogDescription || "",
    ogImage: pageData?.ogImage || "",
  });

  const business = useQuery(api.businesses.getById, { id: businessId });
  const domain = useQuery(api.domains.getByBusinessId, { businessId });
  const publishBusiness = useMutation(api.businesses.publish);
  const updateSeoSettings = useMutation(api.businessSeo.updateSeoSettings);

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "locasite.xyz";
  const isDevelopment = process.env.NODE_ENV === "development";

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);
  const isLastStep = currentStepIndex === steps.length - 1;
  const isFirstStep = currentStepIndex === 0;

  const handleNext = () => {
    if (!isLastStep) {
      setCurrentStep(steps[currentStepIndex + 1].id);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(steps[currentStepIndex - 1].id);
    }
  };

  const handleSkip = () => {
    if (currentStep === "seo") {
      setCurrentStep("social");
    } else if (currentStep === "social") {
      handlePublish();
    }
  };

  const handleSaveAndExit = async () => {
    setIsSaving(true);
    try {
      // Save SEO settings
      await updateSeoSettings({
        businessId,
        seoTitle: formData.seoTitle || formData.pageTitle,
        seoDescription: formData.seoDescription,
        seoKeywords: formData.seoKeywords.split(",").map(k => k.trim()).filter(Boolean),
        ogTitle: formData.ogTitle || formData.seoTitle || formData.pageTitle,
        ogDescription: formData.ogDescription || formData.seoDescription,
        ogImage: formData.ogImage,
      });

      if (onUpdatePageData) {
        onUpdatePageData(formData);
      }

      toast.success("Settings saved");
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);

    try {
      // Save settings
      await updateSeoSettings({
        businessId,
        seoTitle: formData.seoTitle || formData.pageTitle,
        seoDescription: formData.seoDescription,
        seoKeywords: formData.seoKeywords.split(",").map(k => k.trim()).filter(Boolean),
        ogTitle: formData.ogTitle || formData.seoTitle || formData.pageTitle,
        ogDescription: formData.ogDescription || formData.seoDescription,
        ogImage: formData.ogImage,
      });

      if (onUpdatePageData) {
        onUpdatePageData(formData);
      }

      // Publish the business
      await publishBusiness({ businessId });

      const publishedUrl = isDevelopment
        ? `http://${domain?.subdomain}.localhost:3000`
        : `https://${domain?.subdomain}.${rootDomain}`;

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

      if (onPublishComplete) {
        onPublishComplete();
      }

      onOpenChange(false);
    } catch (error) {
      console.error("Error publishing website:", error);
      toast.error("Failed to publish website");
    } finally {
      setIsPublishing(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "general":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="pageTitle">Website Name</Label>
              <Input
                id="pageTitle"
                value={formData.pageTitle}
                onChange={(e) => setFormData({ ...formData, pageTitle: e.target.value })}
                placeholder="Enter your website name"
                className="mt-1"
              />
              <p className="text-sm text-muted-foreground mt-1">
                This will be displayed as your website title
              </p>
            </div>

            {domain && (
              <div>
                <Label>Domain</Label>
                <div className="mt-1 p-3 bg-muted rounded-lg">
                  <p className="text-sm font-medium">
                    {isDevelopment
                      ? `${domain.subdomain}.localhost:3000`
                      : `${domain.subdomain}.${rootDomain}`}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Your website will be accessible at this URL
                </p>
              </div>
            )}

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                You can update these settings anytime after publishing
              </AlertDescription>
            </Alert>
          </div>
        );

      case "seo":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="seoTitle">SEO Title</Label>
              <Input
                id="seoTitle"
                value={formData.seoTitle}
                onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                placeholder={`${formData.pageTitle} - Professional Services`}
                className="mt-1"
                maxLength={60}
              />
              <p className="text-sm text-muted-foreground mt-1">
                {formData.seoTitle.length}/60 characters
              </p>
            </div>

            <div>
              <Label htmlFor="seoDescription">SEO Description</Label>
              <Textarea
                id="seoDescription"
                value={formData.seoDescription}
                onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                placeholder="Describe your business in 155 characters for search results"
                className="mt-1"
                rows={3}
                maxLength={155}
              />
              <p className="text-sm text-muted-foreground mt-1">
                {formData.seoDescription.length}/155 characters
              </p>
            </div>

            <div>
              <Label htmlFor="seoKeywords">Keywords</Label>
              <Input
                id="seoKeywords"
                value={formData.seoKeywords}
                onChange={(e) => setFormData({ ...formData, seoKeywords: e.target.value })}
                placeholder="business, services, location (comma-separated)"
                className="mt-1"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Separate keywords with commas
              </p>
            </div>
          </div>
        );

      case "social":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="ogTitle">Social Media Title</Label>
              <Input
                id="ogTitle"
                value={formData.ogTitle}
                onChange={(e) => setFormData({ ...formData, ogTitle: e.target.value })}
                placeholder={formData.seoTitle || formData.pageTitle}
                className="mt-1"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Title shown when shared on social media
              </p>
            </div>

            <div>
              <Label htmlFor="ogDescription">Social Media Description</Label>
              <Textarea
                id="ogDescription"
                value={formData.ogDescription}
                onChange={(e) => setFormData({ ...formData, ogDescription: e.target.value })}
                placeholder={formData.seoDescription || "Describe your business for social media shares"}
                className="mt-1"
                rows={3}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Description shown when shared on social media
              </p>
            </div>

            <div>
              <Label htmlFor="ogImage">Social Media Image</Label>
              <div className="mt-1 space-y-2">
                {formData.ogImage ? (
                  <div className="relative">
                    <img
                      src={formData.ogImage}
                      alt="Social media preview"
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8 bg-white/80 hover:bg-white"
                      onClick={() => setFormData({ ...formData, ogImage: "" })}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div
                    onClick={() => setShowMediaLibrary(true)}
                    className="h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
                  >
                    <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">Click to select image</span>
                  </div>
                )}
                <p className="text-sm text-muted-foreground">
                  Image shown when your site is shared (1200x630px recommended)
                </p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Publish Your Website</DialogTitle>
          <DialogDescription>
            Configure your website settings before publishing
          </DialogDescription>
        </DialogHeader>

        {/* Step indicators */}
        <div className="flex items-center justify-center mb-6">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = step.id === currentStep;
            const isCompleted = steps.findIndex(s => s.id === currentStep) > index;

            return (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground border-primary"
                        : isCompleted
                        ? "bg-primary/10 text-primary border-primary"
                        : "bg-background text-muted-foreground border-muted"
                    )}
                  >
                    {isCompleted && !isActive ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <StepIcon className="h-5 w-5" />
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-xs mt-1 text-center whitespace-nowrap",
                      isActive ? "text-foreground font-medium" : "text-muted-foreground"
                    )}
                  >
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className="w-16 mx-2">
                    <div className={cn(
                      "h-0.5",
                      isCompleted ? "bg-primary" : "bg-muted"
                    )} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Step content */}
        <div className="flex-1 overflow-y-auto min-h-0 py-4">
          {renderStepContent()}
        </div>

        <DialogFooter className="gap-2">
          <div className="flex justify-between w-full">
            <Button
              variant="outline"
              onClick={handleSaveAndExit}
              disabled={isPublishing || isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save and Exit"
              )}
            </Button>

            <div className="flex gap-2">
              {!isFirstStep && (
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={isPublishing}
                >
                  Previous
                </Button>
              )}

              {isLastStep ? (
                <Button
                  onClick={handlePublish}
                  disabled={isPublishing || !formData.pageTitle}
                >
                  {isPublishing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    "Publish Website"
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={isPublishing || (currentStep === "general" && !formData.pageTitle)}
                >
                  Next
                </Button>
              )}
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    {/* Media Library Dialog */}
    {showMediaLibrary && (
      <MediaLibrary
        onSelect={(url) => {
          setFormData({ ...formData, ogImage: url });
          setShowMediaLibrary(false);
        }}
        businessId={businessId}
        trigger={<></>}
      />
    )}
    </>
  );
}