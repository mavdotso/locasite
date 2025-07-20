import { redirect } from "next/navigation";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import MessageList from "@/app/components/messages/message-list";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface MessagesPageProps {
  params: Promise<{
    businessId: string;
  }>;
}

export default async function BusinessMessagesPage({
  params,
}: MessagesPageProps) {
  const { businessId } = await params;
  const businessIdTyped = businessId as Id<"businesses">;

  const user = await fetchQuery(api.auth.currentUser, {});

  const business = await fetchQuery(api.businesses.getById, {
    id: businessIdTyped,
  });

  if (!business) {
    redirect("/dashboard");
  }

  if (business.userId && user && business.userId !== user._id) {
    redirect("/dashboard");
  }

  const domain = await fetchQuery(api.domains.getByBusinessId, {
    businessId: businessIdTyped,
  });

  // Fetch contact messages
  const messages = await fetchQuery(api.contactMessages.getByBusiness, {
    businessId: business._id,
  });

  const unreadCount = await fetchQuery(api.contactMessages.getUnreadCount, {
    businessId: business._id,
  });

  return (
    <div className="container p-8 mx-auto">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Sites
          </Link>
        </Button>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">{business.name} - Messages</h1>
        <p className="text-muted-foreground mt-2">
          Contact form submissions from your website visitors
          {unreadCount > 0 && ` (${unreadCount} unread)`}
        </p>
      </div>

      {!domain && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Website Not Published</CardTitle>
            <CardDescription>
              Contact forms will be available once you publish your website.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href={`/dashboard/business/${businessId}/domain`}>
                Publish Website
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Contact Form Submissions</CardTitle>
          <CardDescription>
            All messages from visitors who filled out your contact form
          </CardDescription>
        </CardHeader>
      </Card>

      <MessageList initialMessages={messages} />
    </div>
  );
}
