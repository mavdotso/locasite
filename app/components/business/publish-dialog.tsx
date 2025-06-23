"use client";

import { useState, useEffect } from "react";
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
import { Button } from "@/app/components/ui/button";
import { Alert, AlertDescription } from "@/app/components/ui/alert";
import { Globe, Loader2, Check, ArrowRight } from "lucide-react";
import { toast } from "sonner";

interface PublishDialogProps {
  businessId: Id<"businesses">;
  businessName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPublishComplete?: () => void;
}

export function PublishDialog({ 
  businessId, 
  businessName,
  open, 
  onOpenChange,
  onPublishComplete 
}: PublishDialogProps) {
  const [subdomainInput, setSubdomainInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"domain" | "publishing">("domain");
  
  // All hooks must be called before any conditional logic
  const domain = useQuery(api.domains.getByBusinessId, { businessId });
  const generateSubdomain = useMutation(api.domains.generateSubdomain);
  const publishBusiness = useMutation(api.businesses.publish);
  
  // Set default subdomain input if domain exists
  useEffect(() => {
    if (domain?.subdomain && !subdomainInput) {
      setSubdomainInput(domain.subdomain);
    }
  }, [domain, subdomainInput]);
  
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "locasite.xyz";
  
  // Generate initial subdomain suggestion from business name
  useEffect(() => {
    if (businessName && !domain && !subdomainInput) {
      const suggested = businessName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/--+/g, "-")
        .replace(/^-|-$/g, "")
        .substring(0, 30);
      setSubdomainInput(suggested);
    }
  }, [businessName, domain, subdomainInput]);
  
  const handlePublish = async () => {
    if (!subdomainInput || subdomainInput.length < 3) {
      toast.error("Subdomain must be at least 3 characters");
      return;
    }
    
    setIsLoading(true);
    setStep("publishing");
    
    try {
      // First, create the subdomain
      const result = await generateSubdomain({
        businessId,
        customSubdomain: subdomainInput
      });
      
      // Then publish the business
      await publishBusiness({ businessId });
      
      // Show the published URL
      const isDevelopment = process.env.NODE_ENV === 'development';
      const publishedUrl = isDevelopment 
        ? `http://${result.subdomain}.localhost:3000`
        : `https://${result.subdomain}.${rootDomain}`;
      
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
        { duration: 10000 }
      );
      
      onPublishComplete?.();
      onOpenChange(false);
    } catch (error) {
      if (error instanceof Error && error.message?.includes("subdomain") && error.message?.includes("taken")) {
        toast.error("This subdomain is already taken. Please choose another.");
        setStep("domain");
      } else {
        toast.error("Failed to publish website");
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  
  // Always use the actual step - let user choose domain even if one exists
  const displayStep = step;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {displayStep === "domain" ? "Choose Your Website Address" : "Publishing Your Website"}
          </DialogTitle>
          <DialogDescription>
            {displayStep === "domain" 
              ? "Select a subdomain for your website. This will be your public web address."
              : "Setting up your website..."}
          </DialogDescription>
        </DialogHeader>
        
        {displayStep === "domain" ? (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="subdomain">Website Address</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    id="subdomain"
                    value={subdomainInput}
                    onChange={(e) => setSubdomainInput(
                      e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')
                    )}
                    placeholder="your-business"
                    disabled={isLoading}
                    className="pr-8"
                  />
                  {subdomainInput.length >= 3 && (
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
            </div>
            
            {subdomainInput && (
              <Alert>
                <Globe className="h-4 w-4" />
                <AlertDescription>
                  Your website will be available at:{" "}
                  <span className="font-medium">
                    {process.env.NODE_ENV === 'development' 
                      ? `http://${subdomainInput}.localhost:3000`
                      : `https://${subdomainInput}.${rootDomain}`}
                  </span>
                </AlertDescription>
              </Alert>
            )}
          </div>
        ) : (
          <div className="py-8 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              Creating your website...
            </p>
          </div>
        )}
        
        {displayStep === "domain" && (
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePublish}
              disabled={isLoading || subdomainInput.length < 3}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Publish Website
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}