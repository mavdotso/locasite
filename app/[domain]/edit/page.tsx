import { notFound } from "next/navigation";
import { convex } from "@/app/lib/convex";
import { api } from "@/convex/_generated/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import PageEditor from "@/app/components/editors/page-editor";
import BusinessEditor from "@/app/components/editors/business-editor";
import GalleryEditor from "@/app/components/editors/gallery-editor";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { auth } from "@/app/auth";
import ThemeEditor from "@/app/components/editors/theme-editor";

interface EditPageProps {
  params: Promise<{
    domain: string;
  }>;
}

export default async function EditPage({ params }: EditPageProps) {
  const { domain: businessDomain } = await params;
  const session = await auth();
  console.log(session)

  // TODO: Check if user is authenticated
  // if (!session?.user) {
  //   return (
  //     <div className="mx-auto p-8 container">
  //       <Card>
  //         <CardHeader>
  //           <CardTitle>Authentication Required</CardTitle>
  //           <CardDescription>
  //             You need to be logged in to edit this business site.
  //           </CardDescription>
  //         </CardHeader>
  //         <CardContent>
  //           <p>Please log in to continue.</p>
  //         </CardContent>
  //       </Card>
  //     </div>
  //   );
  // }

  try {
    // Get domain from database
    const domain = await convex.query(api.domains.getBySubdomain, {
      subdomain: businessDomain,
    });

    if (!domain) {
      notFound();
    }

    // Get the business associated with this domain
    const businesses = await convex.query(api.businesses.listByDomain, {
      domain: domain._id,
    });

    if (!businesses || !businesses.length) {
      notFound();
    }

    const business = businesses[0];

    // TODO: Check if user owns this business
    // if (business.userId !== session.user.id) {
    //   return (
    //     <div className="mx-auto p-8 container">
    //       <Card>
    //         <CardHeader>
    //           <CardTitle>Access Denied</CardTitle>
    //           <CardDescription>
    //             You don&apos;t have permission to edit this business site.
    //           </CardDescription>
    //         </CardHeader>
    //         <CardContent>
    //           <p>Only the owner of this business can edit its content.</p>
    //         </CardContent>
    //       </Card>
    //     </div>
    //   );
    // }

    // Fetch all pages for the domain
    const pages = await convex.query(api.pages.listByDomain, {
      domainId: domain._id,
    });

    return (
      <div className="mx-auto p-8 container">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Edit {domain.name}</CardTitle>
            <CardDescription>
              Customize your business website content and information
            </CardDescription>
          </CardHeader>
        </Card>

        <Tabs defaultValue="business">
          <TabsList className="mb-8">
            <TabsTrigger value="business">Business Information</TabsTrigger>
            <TabsTrigger value="gallery">Photo Gallery</TabsTrigger>
            <TabsTrigger value="pages">Pages</TabsTrigger>
            <TabsTrigger value="theme">Theme & Design</TabsTrigger>
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

          <TabsContent value="pages">
            <div className="space-y-8">
              {pages.map((page) => (
                <div key={page._id}>
                  <h3 className="mb-2 font-medium text-lg capitalize">
                    {page.slug} Page
                  </h3>
                  <PageEditor page={page} />
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
  } catch (error) {
    console.error("Error loading edit page:", error);
    return (
      <div className="mx-auto p-8 container">
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