import { notFound } from "next/navigation";
import { convex } from "@/app/lib/convex";
import { api } from "@/convex/_generated/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import MessageList from "@/app/components/messages/message-list";
import AuthGuard from "@/app/components/auth/auth-guard";
import { Id } from "@/convex/_generated/dataModel";

interface BusinessEditPageProps {
  params: Promise<{
    businessId: string;
  }>;
}

export default async function BusinessEditPage({ params }: BusinessEditPageProps) {
  const { businessId } = await params;

  try {
    // Get business from database
    const business = await convex.query(api.businesses.getById, {
      id: businessId as Id<"businesses">,
    });

    if (!business) {
      notFound();
    }

    // Get domain if it exists
    const domain = business.domainId 
      ? await convex.query(api.domains.getById, { id: business.domainId })
      : null;


    // Fetch contact messages
    const messages = await convex.query(api.contactMessages.getByBusiness, {
      businessId: business._id,
    });
    
    // Get unread count
    const unreadCount = await convex.query(api.contactMessages.getUnreadCount, {
      businessId: business._id,
    });

    return (
      <AuthGuard businessUserId={business.userId} requireOwnership={true}>
        <div className="container p-8 mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Edit {business.name}</CardTitle>
                  <CardDescription>
                    {domain 
                      ? "Customize your published business website" 
                      : "Edit your business information before publishing"
                    }
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button asChild>
                    <a href={`/business/${business._id}/edit`}>
                      Visual Editor
                    </a>
                  </Button>
                  {domain && (
                    <Button variant="outline" asChild>
                      <a href={`/${domain.subdomain}`} target="_blank" rel="noopener noreferrer">
                        View Site
                      </a>
                    </Button>
                  )}
                  {!domain && (
                    <Button variant="outline" disabled>
                      Publish to enable live preview
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>

          <Tabs defaultValue="messages">
            <TabsList className="mb-8">
              <TabsTrigger value="messages">
                Messages
                {unreadCount > 0 && (
                  <span className="ml-2 px-2 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
                    {unreadCount}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="info">Business Info</TabsTrigger>
            </TabsList>

            <TabsContent value="messages">
              <Card className="mb-4">
                <CardHeader>
                  <CardTitle>Contact Form Submissions</CardTitle>
                  <CardDescription>
                    Messages from visitors who filled out your contact form
                    {!domain && " (Available after publishing)"}
                  </CardDescription>
                </CardHeader>
              </Card>
              <MessageList initialMessages={messages} />
            </TabsContent>

            <TabsContent value="info">
              <Card>
                <CardHeader>
                  <CardTitle>Business Information</CardTitle>
                  <CardDescription>
                    Use the Visual Editor to update your business information and website content.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground">Name</h4>
                      <p>{business.name}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground">Address</h4>
                      <p>{business.address}</p>
                    </div>
                    {business.phone && (
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground">Phone</h4>
                        <p>{business.phone}</p>
                      </div>
                    )}
                    {business.email && (
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground">Email</h4>
                        <p>{business.email}</p>
                      </div>
                    )}
                    <div className="pt-4">
                      <Button asChild>
                        <a href={`/business/${business._id}/edit`}>
                          Edit in Visual Editor
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </AuthGuard>
    );
  } catch (error) {
    console.error("Error loading business edit page:", error);
    return (
      <div className="container p-8 mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>
              There was an error loading the editor.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Please try again later.</p>
          </CardContent>
        </Card>
      </div>
    );
  }
}