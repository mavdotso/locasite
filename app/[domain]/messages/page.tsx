import { notFound } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import MessageList from "@/app/components/messages/message-list";

interface PageProps {
  params: Promise<{
    domain: string;
  }>;
}

export default async function MessagesPage({ params }: PageProps) {
  const { domain: businessDomain } = await params;

  try {
    // Get domain from database
    const domain = await fetchQuery(api.domains.getBySubdomain, {
      subdomain: businessDomain,
    });

    if (!domain) {
      notFound();
    }

    // Get the business associated with this domain
    const business = await fetchQuery(api.businesses.listByDomain, {
      domain: domain._id,
    });

    if (!business || !business.length) {
      notFound();
    }

    const businessData = business[0];

    // Get contact messages for this business
    const messages = await fetchQuery(api.contactMessages.getByBusiness, {
      businessId: businessData._id,
    });

    return (
      <div className="min-h-screen bg-muted">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Contact Messages</h1>
            <div className="text-sm text-muted-foreground">
              Business: {businessData.name}
            </div>
          </div>
          
          <MessageList initialMessages={messages} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading messages:", error);
    notFound();
  }
}