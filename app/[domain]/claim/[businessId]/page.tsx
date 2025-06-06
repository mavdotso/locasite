import { redirect } from 'next/navigation';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/app/components/ui/alert';
import { Loader, Shield, Mail, Phone, CheckCircle } from 'lucide-react';
import { fetchMutation, fetchQuery } from 'convex/nextjs';

// Server actions
async function claimBusinessAction(formData: FormData) {
  'use server'
  const businessIdStr = formData.get('businessId');
  if (typeof businessIdStr !== 'string' || !businessIdStr) {
    console.error("Invalid businessId:", businessIdStr);
    return;
  }
  
  try {
    await fetchMutation(api.businessClaims.claimBusiness, { 
      businessId: businessIdStr as Id<"businesses"> 
    });
  
    // Redirect after successful claim
    redirect(`/business/${businessIdStr}`);
  } catch (error) {
    console.error("Claim error:", error);
  }
}

interface ClaimPageProps {
  params: Promise<{
    domain: string;
    businessId: string;
  }>;
}

export default async function ClaimBusinessPage({ params }: ClaimPageProps) {
  const { domain, businessId } = await params;
  console.log(businessId)
  
  const businessIdParam = businessId as Id<"businesses">;

  if (!businessIdParam) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader />
      </div>
    );
  }
  
  // Get business details
  const business = await fetchQuery(api.businesses.getById, { id: businessIdParam });

  if (!business) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader />
      </div>
    );
  }
  
  // Check if business is claimable
  const claimableStatus = await fetchQuery(api.businessClaims.isBusinessClaimable, { businessId: businessIdParam });
  
  if (!claimableStatus) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader />
      </div>
    );
  }

  const isClaimable = claimableStatus.isClaimable;
  const alreadyClaimed = business.userId !== undefined;

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Claim Business: {business.name}</CardTitle>
        <CardDescription>
          Claiming this business will allow you to manage its information, respond to customer messages, and customize your site.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-medium text-foreground mb-2">Business Details</h3>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <span className="w-16 text-muted-foreground">Name:</span>
                <span className="font-medium">{business.name}</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="w-16 text-muted-foreground">Address:</span>
                <span>{business.address}</span>
              </p>
              {business.phone && (
                <p className="flex items-center gap-2">
                  <span className="w-16 text-muted-foreground">Phone:</span>
                  <span>{business.phone}</span>
                </p>
              )}
              {business.website && (
                <p className="flex items-center gap-2">
                  <span className="w-16 text-muted-foreground">Website:</span>
                  <span>{business.website}</span>
                </p>
              )}
            </div>
          </div>
          
          {!alreadyClaimed && isClaimable && (
            <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Verification Methods
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3 p-3 bg-background rounded border">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">Google Business Profile</p>
                    <p className="text-muted-foreground">Verify ownership through your Google Business Profile account (Recommended)</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-muted rounded border">
                  <Mail className="w-5 h-5 text-muted-foreground/50 mt-0.5" />
                  <div>
                    <p className="font-medium text-muted-foreground">Email Verification</p>
                    <p className="text-muted-foreground">Manual review process (Coming soon)</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-muted rounded border">
                  <Phone className="w-5 h-5 text-muted-foreground/50 mt-0.5" />
                  <div>
                    <p className="font-medium text-muted-foreground">Phone Verification</p>
                    <p className="text-muted-foreground">SMS or call verification (Coming soon)</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {alreadyClaimed && (
            <Alert className="bg-yellow-50 border-yellow-200">
              <AlertTitle>Already Claimed</AlertTitle>
              <AlertDescription>
                This business has already been claimed. If you believe this is an error, please contact support.
              </AlertDescription>
            </Alert>
          )}
          
          {!alreadyClaimed && !isClaimable && claimableStatus.hasPendingClaims && (
            <Alert className="bg-yellow-50 border-yellow-200">
              <AlertTitle>Pending Claims</AlertTitle>
              <AlertDescription>
                There are currently {claimableStatus.pendingClaimsCount} pending claims for this business.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
      
      <CardFooter>
      {!alreadyClaimed && isClaimable && (
        <form action={claimBusinessAction}>
          <input type="hidden" name="businessId" value={String(businessId)} />
          <Button type="submit" className="w-full">
            Claim This Business
          </Button>
        </form>
      )}
        
      {(!isClaimable) && (
        <Button 
          onClick={() => redirect(`/${domain}`)} 
          variant="outline" 
          className="w-full"
        >
          Return to Business Page
        </Button>
      )}
      </CardFooter>
    </Card>
  );
}