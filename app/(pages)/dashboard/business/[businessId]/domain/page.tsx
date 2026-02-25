"use client";

import { useParams } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Copy,
  CheckCircle,
  XCircle,
  Loader2,
  ExternalLink,
  Crown,
  ArrowLeft,
  Globe,
  Link2,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { env } from "@/env";
import { DnsWizard } from "@/components/domain/dns-wizard";

function getDomainStatusDisplay(
  domainStatus: {
    domain?: string;
    isVerified?: boolean;
    sslStatus?: string;
  } | null | undefined,
) {
  if (!domainStatus?.domain) return null;

  if (domainStatus.isVerified && domainStatus.sslStatus === "active") {
    return {
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      text: `${domainStatus.domain} is live and secure`,
      className: "text-green-700 bg-green-50 border-green-200",
    };
  }
  if (domainStatus.isVerified) {
    return {
      icon: <Loader2 className="h-5 w-5 animate-spin text-blue-500" />,
      text: "Almost ready! Setting up security...",
      className: "text-blue-700 bg-blue-50 border-blue-200",
    };
  }
  return {
    icon: <Loader2 className="h-5 w-5 animate-spin text-yellow-500" />,
    text: `Connecting ${domainStatus.domain}... This can take up to 48 hours.`,
    className: "text-yellow-700 bg-yellow-50 border-yellow-200",
  };
}

export default function DomainSettingsPage() {
  const params = useParams();
  const businessId = params.businessId as Id<"businesses">;

  const [customDomain, setCustomDomain] = useState("");
  const [isChecking, setIsChecking] = useState(false);

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "locasite.xyz";

  // Fetch domain (subdomain) for this business
  const domain = useQuery(api.domains.getByBusinessId, { businessId });

  // Fetch business to check published status
  const business = useQuery(api.businesses.getById, { id: businessId });

  // Fetch custom domain status
  const domainStatus = useQuery(api.customDomains.getDomainVerificationStatus, {
    businessId,
  });

  // Fetch user subscription
  const subscription = useQuery(api.subscriptions.getUserSubscription);

  // Mutations
  const addCustomDomain = useMutation(api.customDomains.addCustomDomain);
  const removeCustomDomain = useMutation(api.customDomains.removeCustomDomain);

  const isPublished = business?.isPublished === true;
  const subdomain = domain?.subdomain;
  const subdomainUrl = subdomain ? `https://${subdomain}.${rootDomain}` : null;
  const isPaidPlan =
    subscription?.planType === "PROFESSIONAL" ||
    subscription?.planType === "BUSINESS";

  const handleAddDomain = async () => {
    if (!customDomain) {
      toast.error("Please enter a domain");
      return;
    }

    try {
      await addCustomDomain({ businessId, domain: customDomain });

      const vercelResponse = await fetch(
        `${env.NEXT_PUBLIC_CONVEX_URL}/domains/vercel`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ domain: customDomain, businessId }),
        },
      );

      const vercelData = await vercelResponse.json();

      if (!vercelResponse.ok) {
        toast.error(vercelData.error || "Failed to add domain");
        await removeCustomDomain({ businessId });
        return;
      }

      toast.success("Domain added! Connection will begin shortly.");
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

      await removeCustomDomain({ businessId });
      toast.success("Custom domain removed");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to remove domain",
      );
    }
  };

  const handleCheckConnection = async () => {
    if (!domainStatus?.domain) return;

    setIsChecking(true);
    try {
      const response = await fetch(
        `${env.NEXT_PUBLIC_CONVEX_URL}/domains/verify`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ domainId: domainStatus.domainId }),
        },
      );

      const result = await response.json();

      if (result.verified) {
        toast.success("Domain connected successfully!");
      } else {
        toast.error(
          "Not connected yet. Make sure your domain settings are correct and try again later.",
        );
      }
    } catch (_error) {
      toast.error("Could not check connection. Please try again.");
    } finally {
      setIsChecking(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const customDomainDisplay = getDomainStatusDisplay(domainStatus);

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link
          href={`/dashboard/business/${businessId}`}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to dashboard
        </Link>
        <h1 className="text-3xl font-bold">Web Address</h1>
        <p className="text-muted-foreground mt-2">
          Manage how customers find your website
        </p>
      </div>

      {/* Section A: Your Free Web Address */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Your Free Web Address
          </CardTitle>
          <CardDescription>
            This is where your website lives on the internet
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isPublished && subdomain ? (
            <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                <div>
                  <p className="font-mono font-medium">
                    {subdomain}.{rootDomain}
                  </p>
                  <p className="text-sm text-green-700">Live and working</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(subdomainUrl!)}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Link
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(subdomainUrl!, "_blank")}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Visit Site
                </Button>
              </div>
            </div>
          ) : subdomain ? (
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <p className="font-mono text-muted-foreground">
                  {subdomain}.{rootDomain}
                </p>
                <p className="text-sm text-muted-foreground">
                  Publish your site to make this address active
                </p>
              </div>
              <Link href={`/dashboard/business/${businessId}`}>
                <Button variant="outline" size="sm">
                  Go to Editor
                </Button>
              </Link>
            </div>
          ) : (
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-muted-foreground">
                Publish your site first to get your web address.
              </p>
              <Link
                href={`/dashboard/business/${businessId}`}
                className="text-sm text-primary hover:underline mt-1 inline-block"
              >
                Go to the editor to publish
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section B: Use Your Own Domain */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            Use Your Own Domain
          </CardTitle>
          <CardDescription>
            Connect a custom domain like yourbusiness.com
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* FREE plan: upgrade prompt */}
          {subscription?.planType === "FREE" && (
            <div className="p-6 bg-muted/50 border border-dashed rounded-lg text-center">
              <Crown className="h-8 w-8 mx-auto mb-3 text-yellow-500" />
              <p className="font-medium mb-1">
                Custom domains are available on Professional and Business plans
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Upgrade to connect your own domain like yourbusiness.com
              </p>
              <Link href="/dashboard/billing">
                <Button>
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade Plan
                </Button>
              </Link>
            </div>
          )}

          {/* Paid plan, no custom domain: input form */}
          {isPaidPlan && !domainStatus?.domain && (
            <div className="space-y-4">
              <div className="flex gap-3">
                <Input
                  placeholder="yourbusiness.com"
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value)}
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddDomain();
                  }}
                />
                <Button onClick={handleAddDomain}>Connect Domain</Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Enter your domain without http:// or https://
              </p>
              {subscription?.planType === "PROFESSIONAL" && (
                <p className="text-sm text-muted-foreground">
                  Professional plan includes 1 custom domain. Upgrade to
                  Business for unlimited domains.
                </p>
              )}
            </div>
          )}

          {/* Custom domain exists but not verified: connecting state */}
          {domainStatus?.domain &&
            !domainStatus.isVerified &&
            customDomainDisplay && (
              <div className="space-y-4">
                <div
                  className={`flex items-center gap-3 p-4 border rounded-lg ${customDomainDisplay.className}`}
                >
                  {customDomainDisplay.icon}
                  <p className="font-medium">{customDomainDisplay.text}</p>
                </div>

                {domainStatus.verificationError && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                    <XCircle className="h-4 w-4 shrink-0" />
                    <p>
                      Connection issue detected. Make sure your domain settings
                      are correct and try again.
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleCheckConnection}
                    disabled={isChecking}
                  >
                    {isChecking ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Checking...
                      </>
                    ) : (
                      "Check Connection"
                    )}
                  </Button>
                  <Button variant="ghost" onClick={handleRemoveDomain}>
                    Remove
                  </Button>
                </div>
              </div>
            )}

          {/* Custom domain verified and active */}
          {domainStatus?.domain &&
            domainStatus.isVerified &&
            customDomainDisplay && (
              <div className="space-y-4">
                <div
                  className={`flex items-center gap-3 p-4 border rounded-lg ${customDomainDisplay.className}`}
                >
                  {customDomainDisplay.icon}
                  <p className="font-medium">{customDomainDisplay.text}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      window.open(
                        `https://${domainStatus.domain}`,
                        "_blank",
                      )
                    }
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Visit Site
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveDomain}
                  >
                    Remove Domain
                  </Button>
                </div>
              </div>
            )}

          {/* Loading state when subscription is still loading */}
          {subscription === undefined && (
            <div className="flex items-center justify-center p-6">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* DNS Setup Wizard - show when domain exists but not verified */}
      {domainStatus?.domain && !domainStatus.isVerified && (
        <div className="mt-8">
          <DnsWizard
            domain={domainStatus.domain}
            cnameHost="@"
            cnameValue="cname.vercel-dns.com"
            txtHost="_locasite-verify"
            txtValue={domainStatus.verificationToken || ""}
            onVerify={handleCheckConnection}
            isVerifying={isChecking}
          />
        </div>
      )}
    </div>
  );
}
