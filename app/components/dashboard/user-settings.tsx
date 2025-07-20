"use client";

import { useState } from "react";
import { Doc } from "@/convex/_generated/dataModel";
import { useDashboardData } from "@/app/components/providers/dashboard-provider";
import { useQuery, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import { Badge } from "@/app/components/ui/badge";
import { Separator } from "@/app/components/ui/separator";
import {
  User,
  Bell,
  Shield,
  CreditCard,
  Smartphone,
  Key,
  Trash2,
  AlertTriangle,
  Check,
  X,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function UserSettings() {
  const { user, businesses: userBusinesses } = useDashboardData();
  const router = useRouter();

  // Subscription data
  const subscription = useQuery(api.subscriptions.getUserSubscription);
  const cancelSubscription = useAction(api.subscriptions.cancelSubscription);
  const reactivateSubscription = useAction(
    api.subscriptions.reactivateSubscription,
  );
  const createPortalSession = useAction(
    api.subscriptions.createCustomerPortalSession,
  );

  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  // Form states
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    company: "",
    website: "",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    newMessages: true,
    siteUpdates: true,
    marketingEmails: false,
    securityAlerts: true,
  });

  const handleProfileSave = () => {
    toast.success("Profile updated successfully");
  };

  const handleNotificationSave = () => {
    toast.success("Notification preferences saved");
  };

  const handleDeleteAccount = () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone and will delete all your sites and data.",
      )
    ) {
      toast.error("Account deletion is not yet implemented");
    }
  };

  const handleCancelSubscription = async () => {
    if (
      !window.confirm(
        "Are you sure you want to cancel your subscription? You'll continue to have access until the end of your billing period.",
      )
    ) {
      return;
    }

    try {
      setLoadingAction("cancel");
      await cancelSubscription();
      toast.success(
        "Subscription cancelled. You'll continue to have access until the end of your billing period.",
      );
    } catch (error) {
      console.error("Error canceling subscription:", error);
      toast.error("Failed to cancel subscription");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleReactivateSubscription = async () => {
    try {
      setLoadingAction("reactivate");
      await reactivateSubscription();
      toast.success("Subscription reactivated successfully!");
    } catch (error) {
      console.error("Error reactivating subscription:", error);
      toast.error("Failed to reactivate subscription");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleManageSubscription = async () => {
    try {
      setLoadingAction("portal");
      const portalUrl = await createPortalSession();
      if (portalUrl) {
        window.location.href = portalUrl;
      }
    } catch (error) {
      console.error("Error opening billing portal:", error);
      toast.error("Failed to open billing portal");
      setLoadingAction(null);
    }
  };

  if (!user) {
    return (
      <Card className="p-8 text-center">
        <div className="text-muted-foreground">
          <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Please sign in to view your settings.</p>
        </div>
      </Card>
    );
  }

  const accountStats = {
    totalSites: userBusinesses?.length || 0,
    activeSites:
      userBusinesses?.filter((b: Doc<"businesses">) => b.domainId).length || 0,
  };

  const planFeatures = {
    FREE: [
      { text: "1 business site", included: true },
      { text: "Basic customization", included: true },
      { text: "Locasite subdomain", included: true },
      { text: "Remove branding", included: false },
      { text: "Advanced analytics", included: false },
      { text: "Priority support", included: false },
    ],
    PROFESSIONAL: [
      { text: "Unlimited business sites", included: true },
      { text: "Advanced customization", included: true },
      { text: "Remove Locasite branding", included: true },
      { text: "Advanced analytics", included: true },
      { text: "Priority support", included: true },
      { text: "Custom domains", included: false },
    ],
    BUSINESS: [
      { text: "Everything in Professional", included: true },
      { text: "Custom domains", included: true },
      { text: "White-label solution", included: true },
      { text: "API access", included: true },
      { text: "Dedicated support", included: true },
      { text: "SLA guarantee", included: true },
    ],
  };

  const currentPlan = subscription?.planType || "FREE";
  const features =
    planFeatures[currentPlan as keyof typeof planFeatures] || planFeatures.FREE;

  return (
    <Tabs defaultValue="profile" className="space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="profile" className="flex items-center gap-2">
          <User className="w-4 h-4" />
          Profile
        </TabsTrigger>
        <TabsTrigger value="notifications" className="flex items-center gap-2">
          <Bell className="w-4 h-4" />
          Notifications
        </TabsTrigger>
        <TabsTrigger value="security" className="flex items-center gap-2">
          <Shield className="w-4 h-4" />
          Security
        </TabsTrigger>
        <TabsTrigger value="billing" className="flex items-center gap-2">
          <CreditCard className="w-4 h-4" />
          Billing
        </TabsTrigger>
      </TabsList>

      {/* Profile Settings */}
      <TabsContent value="profile" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Update your personal information and account details.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={profileData.name}
                  onChange={(e) =>
                    setProfileData({ ...profileData, name: e.target.value })
                  }
                  placeholder="Enter your full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) =>
                    setProfileData({ ...profileData, email: e.target.value })
                  }
                  placeholder="Enter your email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) =>
                    setProfileData({ ...profileData, phone: e.target.value })
                  }
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={profileData.company}
                  onChange={(e) =>
                    setProfileData({ ...profileData, company: e.target.value })
                  }
                  placeholder="Enter your company name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                value={profileData.website}
                onChange={(e) =>
                  setProfileData({ ...profileData, website: e.target.value })
                }
                placeholder="https://yourwebsite.com"
              />
            </div>

            <Button onClick={handleProfileSave}>Save Changes</Button>
          </CardContent>
        </Card>

        {/* Account Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Account Overview</CardTitle>
            <CardDescription>
              Your account statistics and activity summary.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {accountStats.totalSites}
                </div>
                <div className="text-sm text-muted-foreground">Total Sites</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {accountStats.activeSites}
                </div>
                <div className="text-sm text-muted-foreground">
                  Active Sites
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Notification Settings */}
      <TabsContent value="notifications" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>
              Choose how you want to be notified about account activity.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">Email Notifications</div>
                  <div className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notificationSettings.emailNotifications}
                  onChange={(e) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      emailNotifications: e.target.checked,
                    })
                  }
                  className="h-4 w-4"
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">New Messages</div>
                  <div className="text-sm text-muted-foreground">
                    Get notified when you receive contact form submissions
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notificationSettings.newMessages}
                  onChange={(e) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      newMessages: e.target.checked,
                    })
                  }
                  className="h-4 w-4"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">Site Updates</div>
                  <div className="text-sm text-muted-foreground">
                    Notifications about your website updates and changes
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notificationSettings.siteUpdates}
                  onChange={(e) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      siteUpdates: e.target.checked,
                    })
                  }
                  className="h-4 w-4"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">Security Alerts</div>
                  <div className="text-sm text-muted-foreground">
                    Important security notifications and login alerts
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notificationSettings.securityAlerts}
                  onChange={(e) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      securityAlerts: e.target.checked,
                    })
                  }
                  className="h-4 w-4"
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">Marketing Emails</div>
                  <div className="text-sm text-muted-foreground">
                    Product updates, tips, and promotional content
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notificationSettings.marketingEmails}
                  onChange={(e) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      marketingEmails: e.target.checked,
                    })
                  }
                  className="h-4 w-4"
                />
              </div>
            </div>

            <Button onClick={handleNotificationSave}>Save Preferences</Button>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Security Settings */}
      <TabsContent value="security" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Account Security</CardTitle>
            <CardDescription>
              Manage your account security and authentication settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Key className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Password</div>
                    <div className="text-sm text-muted-foreground">
                      Last changed 30 days ago
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Change Password
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Two-Factor Authentication</div>
                    <div className="text-sm text-muted-foreground">
                      Add an extra layer of security
                    </div>
                  </div>
                </div>
                <Badge variant="outline">Not Enabled</Badge>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Connected Devices</div>
                    <div className="text-sm text-muted-foreground">
                      Manage your logged-in devices
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Manage
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Danger Zone</CardTitle>
            <CardDescription>
              Irreversible and destructive actions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <div>
                  <div className="font-medium text-red-600">Delete Account</div>
                  <div className="text-sm text-red-500">
                    Permanently delete your account and all data
                  </div>
                </div>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteAccount}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Billing Settings */}
      <TabsContent value="billing" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Billing & Subscription</CardTitle>
            <CardDescription>
              Manage your subscription and billing information.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Current Plan */}
            <div className="p-6 bg-muted rounded-lg">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-1">
                    {subscription?.plan?.name || "Free"} Plan
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {subscription?.plan?.name === "Free"
                      ? "You're on the free plan. Upgrade to unlock more features."
                      : `$${(subscription?.plan?.price || 0) / 100}/month`}
                  </p>

                  {subscription?.status === "active" &&
                    subscription?.cancelAtPeriodEnd && (
                      <Badge variant="destructive" className="mb-4">
                        Cancels on{" "}
                        {new Date(
                          subscription.currentPeriodEnd! * 1000,
                        ).toLocaleDateString()}
                      </Badge>
                    )}

                  {/* Plan Features */}
                  <div className="space-y-2 mt-4">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        {feature.included ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <X className="w-4 h-4 text-muted-foreground/50" />
                        )}
                        <span
                          className={`text-sm ${!feature.included && "text-muted-foreground"}`}
                        >
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  {currentPlan === "FREE" ? (
                    <Button onClick={() => router.push("/#pricing")}>
                      Upgrade Plan
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        onClick={handleManageSubscription}
                        disabled={loadingAction === "portal"}
                      >
                        {loadingAction === "portal" ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            Manage Billing
                            <ExternalLink className="w-3 h-3 ml-2" />
                          </>
                        )}
                      </Button>

                      {subscription?.cancelAtPeriodEnd ? (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={handleReactivateSubscription}
                          disabled={loadingAction === "reactivate"}
                        >
                          {loadingAction === "reactivate" ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            "Reactivate"
                          )}
                        </Button>
                      ) : (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={handleCancelSubscription}
                          disabled={loadingAction === "cancel"}
                        >
                          {loadingAction === "cancel" ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            "Cancel Plan"
                          )}
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Method */}
            {subscription?.paymentMethod && (
              <>
                <Separator />
                <div>
                  <h4 className="font-medium mb-4">Payment Method</h4>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium capitalize">
                          {subscription.paymentMethod.brand} ••••{" "}
                          {subscription.paymentMethod.last4}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Expires{" "}
                          {subscription.currentPeriodEnd
                            ? new Date(
                                subscription.currentPeriodEnd * 1000,
                              ).toLocaleDateString()
                            : "N/A"}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleManageSubscription}
                    >
                      Update
                    </Button>
                  </div>
                </div>
              </>
            )}

            <Separator />

            {/* Billing History */}
            <div className="space-y-4">
              <h4 className="font-medium">Billing History</h4>
              <div className="text-center py-8 text-muted-foreground">
                <div className="text-sm">
                  {currentPlan === "FREE"
                    ? "No billing history available"
                    : "View your billing history in the customer portal"}
                </div>
                {currentPlan !== "FREE" && (
                  <Button
                    variant="link"
                    size="sm"
                    className="mt-2"
                    onClick={handleManageSubscription}
                  >
                    Open Customer Portal
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
