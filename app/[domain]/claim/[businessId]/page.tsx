import { redirect } from 'next/navigation';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/app/components/ui/alert';
import { Loader } from 'lucide-react';
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
          Claiming this business will allow you to manage its information and respond to reviews.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">Business Details</h3>
            <p className="text-gray-500 text-sm">{business.address}</p>
            {business.phone && <p className="text-gray-500 text-sm">{business.phone}</p>}
          </div>
          
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