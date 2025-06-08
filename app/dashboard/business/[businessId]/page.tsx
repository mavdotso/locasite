import { notFound } from "next/navigation";
import { convex } from "@/app/lib/convex";
import { api } from "@/convex/_generated/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Button } from "@/app/components/ui/button";
import PageEditor from "@/app/components/editors/page-editor";
import BusinessEditor from "@/app/components/editors/business-editor";
import GalleryEditor from "@/app/components/editors/gallery-editor";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import ThemeEditor from "@/app/components/editors/theme-editor";
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

    // Fetch pages if domain exists
    const pages = domain 
      ? await convex.query(api.pages.listByDomain, { domainId: domain._id })
      : [];

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
                  {domain && (
                    <>
                      <Button variant="outline" asChild>
                        <a href={`/${domain.subdomain}/home/edit`} target="_blank" rel="noopener noreferrer">
                          Live Editor
                        </a>
                      </Button>
                      <Button variant="outline" asChild>
                        <a href={`/${domain.subdomain}`} target="_blank" rel="noopener noreferrer">
                          View Site
                        </a>
                      </Button>
                    </>
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

          <Tabs defaultValue="business">
            <TabsList className="mb-8">
              <TabsTrigger value="business">Business Information</TabsTrigger>
              <TabsTrigger value="gallery">Photo Gallery</TabsTrigger>
              {pages.length > 0 && (
                <TabsTrigger value="pages">Pages</TabsTrigger>
              )}
              <TabsTrigger value="theme">Theme & Design</TabsTrigger>
              <TabsTrigger value="messages">
                Messages
                {unreadCount > 0 && (
                  <span className="ml-2 px-2 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
                    {unreadCount}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="business">
              <BusinessEditor business={business} />
            </TabsContent>

            <TabsContent value="gallery">
              <GalleryEditor business={business} />
            </TabsContent>

            <TabsContent value="theme">
              <ThemeEditor business={business} />
            </TabsContent>

            {pages.length > 0 && (
              <TabsContent value="pages">
                <div className="space-y-8">
                  {pages.map((page) => (
                    <div key={page._id}>
                      <h3 className="mb-2 text-lg font-medium capitalize">
                        {page.slug} Page
                      </h3>
                      <PageEditor page={page} />
                    </div>
                  ))}
                </div>
              </TabsContent>
            )}

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