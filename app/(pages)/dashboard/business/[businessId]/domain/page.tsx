"use client";

import { useParams } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Copy,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  ExternalLink,
  Crown,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { env } from "@/env";

export default function DomainSettingsPage() {
  const params = useParams();
  const businessId = params.businessId as Id<"businesses">;

  const [customDomain, setCustomDomain] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [dnsInstructions, setDnsInstructions] = useState<{
    domain: string;
    verificationToken: string;
    dnsRecords: Array<{
      type: string;
      name: string;
      value: string;
      ttl: number;
      priority: string;
      description: string;
    }>;
    instructions: {
      general: string[];
    };
  } | null>(null);

  // Fetch domain status
  const domainStatus = useQuery(api.customDomains.getDomainVerificationStatus, {
    businessId,
  });

  // Fetch user subscription
  const subscription = useQuery(api.subscriptions.getUserSubscription);

  // Mutations
  const addCustomDomain = useMutation(api.customDomains.addCustomDomain);
  const removeCustomDomain = useMutation(api.customDomains.removeCustomDomain);
  // Fetch DNS instructions when domain exists
  useEffect(() => {
    if (domainStatus?.domain && domainStatus?.verificationToken) {
      fetchDnsInstructions(domainStatus.domain, domainStatus.verificationToken);
    }
  }, [domainStatus?.domain, domainStatus?.verificationToken]);

  const fetchDnsInstructions = async (domain: string, token: string) => {
    try {
      const response = await fetch(
        `${env.NEXT_PUBLIC_CONVEX_URL}/domains/dns-instructions?domain=${domain}&token=${token}`,
      );
      const data = await response.json();
      setDnsInstructions(data);
    } catch (_error) {
      console.error("Failed to fetch DNS instructions:", _error);
    }
  };

  const handleAddDomain = async () => {
    if (!customDomain) {
      toast.error("Please enter a domain");
      return;
    }

    try {
      // First add to our database
      await addCustomDomain({ businessId, domain: customDomain });

      // Then add to Vercel
      const vercelResponse = await fetch(`${env.NEXT_PUBLIC_CONVEX_URL}/domains/vercel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: customDomain, businessId }),
      });

      const vercelData = await vercelResponse.json();

      if (!vercelResponse.ok) {
        toast.error(vercelData.error || "Failed to add domain to Vercel");
        // Optionally remove from our database if Vercel fails
        await removeCustomDomain({ businessId });
        return;
      }

      toast.success("Custom domain added successfully");
      setCustomDomain("");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to add domain",
      );
    }
  };

  const handleRemoveDomain = async () => {
    if (!confirm("Are you sure you want to remove this custom domain?")) {
      return;
    }

    try {
      // Remove from Vercel first
      if (domainStatus?.domain) {
        const vercelResponse = await fetch(
          `${env.NEXT_PUBLIC_CONVEX_URL}/domains/vercel?domain=${domainStatus.domain}&businessId=${businessId}`,
          {
            method: "DELETE",
          },
        );

        if (!vercelResponse.ok) {
          const vercelData = await vercelResponse.json();
          console.error("Failed to remove from Vercel:", vercelData.error);
        }
      }

      // Then remove from our database
      await removeCustomDomain({ businessId });
      toast.success("Custom domain removed successfully");
      setDnsInstructions(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to remove domain",
      );
    }
  };

  const handleVerifyDomain = async () => {
    if (!domainStatus?.domain) return;

    setIsVerifying(true);
    try {
      const response = await fetch(`${env.NEXT_PUBLIC_CONVEX_URL}/domains/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domainId: domainStatus.domainId }),
      });

      const result = await response.json();

      if (result.verified) {
        toast.success("Domain verified successfully!");
      } else {
        toast.error(result.message || "Domain verification failed");
      }
    } catch (_error) {
      toast.error("Failed to verify domain");
    } finally {
      setIsVerifying(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const getStatusBadge = () => {
    if (!domainStatus?.domain) return null;

    if (domainStatus.isVerified) {
      if (domainStatus.sslStatus === "active") {
        return <Badge className="bg-green-500">Active</Badge>;
      } else if (domainStatus.sslStatus === "pending") {
        return <Badge className="bg-yellow-500">SSL Pending</Badge>;
      } else {
        return <Badge className="bg-blue-500">Verified</Badge>;
      }
    } else {
      return <Badge variant="secondary">Pending Verification</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Domain Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your custom domain for your business website
        </p>
      </div>

      {/* Current Domain Status */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Current Domain</CardTitle>
          <CardDescription>
            Your website is currently accessible at these URLs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Subdomain</p>
              <p className="font-mono">
                {domainStatus?.domain
                  ? `${domainStatus.domain.split(".")[0]}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
                  : "Loading..."}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                window.open(`https://${domainStatus?.domain}`, "_blank")
              }
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Visit
            </Button>
          </div>

          {domainStatus?.domain && (
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Custom Domain</p>
                <p className="font-mono">{domainStatus.domain}</p>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge()}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRemoveDomain}
                >
                  Remove
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Custom Domain */}
      {!domainStatus?.domain && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Add Custom Domain</CardTitle>
            <CardDescription>
              Use your own domain name for your business website
            </CardDescription>
          </CardHeader>
          <CardContent>
            {subscription?.planType === "FREE" ? (
              <Alert>
                <Crown className="h-4 w-4" />
                <AlertTitle>Upgrade Required</AlertTitle>
                <AlertDescription>
                  Custom domains are available on Professional and Business
                  plans.
                  <Link href="/dashboard/billing" className="ml-2 underline">
                    Upgrade now
                  </Link>
                </AlertDescription>
              </Alert>
            ) : (
              <>
                <div className="flex gap-4">
                  <Input
                    placeholder="example.com"
                    value={customDomain}
                    onChange={(e) => setCustomDomain(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleAddDomain}>Add Domain</Button>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Enter your domain without http:// or https://
                </p>
                {subscription?.planType === "PROFESSIONAL" && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Professional plan includes 1 custom domain. Upgrade to
                    Business for unlimited domains.
                  </p>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Domain Verification */}
      {domainStatus?.domain && !domainStatus.isVerified && dnsInstructions && (
        <Card>
          <CardHeader>
            <CardTitle>Domain Verification</CardTitle>
            <CardDescription>
              Follow these steps to verify your domain ownership
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="instructions" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="instructions">Instructions</TabsTrigger>
                <TabsTrigger value="records">DNS Records</TabsTrigger>
              </TabsList>

              <TabsContent value="instructions" className="space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>DNS Configuration Required</AlertTitle>
                  <AlertDescription>
                    You need to add DNS records to verify domain ownership and
                    point your domain to Locasite.
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <h4 className="font-semibold">General Instructions:</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    {dnsInstructions.instructions.general.map(
                      (step: string, index: number) => (
                        <li key={index}>{step}</li>
                      ),
                    )}
                  </ol>
                </div>

                <div className="pt-4">
                  <Button
                    onClick={handleVerifyDomain}
                    disabled={isVerifying}
                    className="w-full"
                  >
                    {isVerifying ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      "Verify Domain"
                    )}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="records" className="space-y-4">
                {dnsInstructions.dnsRecords.map((record, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{record.type} Record</Badge>
                      <Badge
                        variant={
                          record.priority === "Required"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {record.priority}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <p className="text-sm font-medium">Name/Host:</p>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 p-2 bg-muted rounded text-sm">
                            {record.name}
                          </code>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(record.name)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium">Value/Points to:</p>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 p-2 bg-muted rounded text-sm break-all">
                            {record.value}
                          </code>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(record.value)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground">
                        {record.description}
                      </p>
                    </div>
                  </div>
                ))}

                {domainStatus.verificationError && (
                  <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertTitle>Verification Error</AlertTitle>
                    <AlertDescription>
                      {domainStatus.verificationError}
                    </AlertDescription>
                  </Alert>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Success State */}
      {domainStatus?.isVerified && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Domain Verified
            </CardTitle>
            <CardDescription>
              Your custom domain is active and serving your website
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>SSL Certificate Status</AlertTitle>
              <AlertDescription>
                {domainStatus.sslStatus === "active"
                  ? "Your SSL certificate is active. Your website is secure."
                  : domainStatus.sslStatus === "pending"
                    ? "SSL certificate is being provisioned. This usually takes a few minutes."
                    : "SSL certificate status unknown."}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
