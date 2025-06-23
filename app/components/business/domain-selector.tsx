"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Globe, ExternalLink, AlertCircle, Check, Copy } from "lucide-react";
import { toast } from "sonner";

interface DomainSelectorProps {
  businessId: Id<"businesses">;
  currentDomain?: {
    subdomain: string;
    customDomain?: string;
    domainType?: "subdomain" | "custom";
    isVerified?: boolean;
  };
}

export function DomainSelector({ businessId, currentDomain }: DomainSelectorProps) {
  const [subdomainInput, setSubdomainInput] = useState(currentDomain?.subdomain || "");
  const [customDomainInput, setCustomDomainInput] = useState(currentDomain?.customDomain || "");
  const [isLoading, setIsLoading] = useState(false);
  
  const generateSubdomain = useMutation(api.domains.generateSubdomain);
  
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "locasite.xyz";
  
  const handleSubdomainUpdate = async () => {
    if (!subdomainInput || subdomainInput.length < 3) {
      toast.error("Subdomain must be at least 3 characters");
      return;
    }
    
    setIsLoading(true);
    try {
      await generateSubdomain({
        businessId,
        customSubdomain: subdomainInput
      });
      toast.success("Subdomain updated successfully!");
    } catch {
      toast.error("Failed to update subdomain");
    } finally {
      setIsLoading(false);
    }
  };
  
  const copyDNSInstructions = () => {
    const instructions = `Type: CNAME\nName: ${customDomainInput}\nValue: ${currentDomain?.subdomain}.${rootDomain}`;
    navigator.clipboard.writeText(instructions);
    toast.success("DNS instructions copied!");
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Domain Settings</CardTitle>
          <CardDescription>
            Choose how visitors will access your website
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="subdomain" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="subdomain">Subdomain</TabsTrigger>
              <TabsTrigger value="custom">Custom Domain</TabsTrigger>
            </TabsList>
            
            <TabsContent value="subdomain" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subdomain">Your Subdomain</Label>
                <div className="flex gap-2">
                  <Input
                    id="subdomain"
                    value={subdomainInput}
                    onChange={(e) => setSubdomainInput(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    placeholder="your-business"
                    className="flex-1"
                  />
                  <span className="flex items-center px-3 text-sm text-muted-foreground bg-muted rounded-md">
                    .{rootDomain}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Letters, numbers, and hyphens only. No spaces.
                </p>
              </div>
              
              {currentDomain && (
                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={`https://${currentDomain.subdomain}.${rootDomain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline flex items-center gap-1"
                  >
                    {currentDomain.subdomain}.{rootDomain}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  <Badge variant="outline" className="ml-auto">Active</Badge>
                </div>
              )}
              
              <Button 
                onClick={handleSubdomainUpdate}
                disabled={isLoading || subdomainInput === currentDomain?.subdomain}
                className="w-full"
              >
                {currentDomain ? "Update Subdomain" : "Create Subdomain"}
              </Button>
            </TabsContent>
            
            <TabsContent value="custom" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="custom-domain">Custom Domain</Label>
                <Input
                  id="custom-domain"
                  value={customDomainInput}
                  onChange={(e) => setCustomDomainInput(e.target.value.toLowerCase())}
                  placeholder="yourdomain.com"
                  disabled
                />
                <p className="text-xs text-muted-foreground">
                  Enter your own domain name (e.g., yourbusiness.com)
                </p>
              </div>
              
              <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
                  <div className="space-y-1 text-sm">
                    <p className="font-medium">DNS Configuration Required</p>
                    <p className="text-muted-foreground">
                      Add the following CNAME record to your domain&apos;s DNS settings:
                    </p>
                  </div>
                </div>
                
                <div className="bg-background rounded p-3 font-mono text-xs space-y-1">
                  <div>Type: CNAME</div>
                  <div>Name: {customDomainInput || "yourdomain.com"}</div>
                  <div>Value: {currentDomain?.subdomain || "your-subdomain"}.{rootDomain}</div>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyDNSInstructions}
                  className="w-full"
                  disabled
                >
                  <Copy className="h-3 h-3 mr-2" />
                  Coming Soon
                </Button>
              </div>
              
              {currentDomain?.customDomain && (
                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{currentDomain.customDomain}</span>
                  {currentDomain.isVerified ? (
                    <Badge variant="outline" className="ml-auto">
                      <Check className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="ml-auto">Pending</Badge>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}