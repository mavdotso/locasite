'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery, useAction } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/app/components/ui/alert';
import { Loader, CheckCircle, XCircle, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface VerifyPageProps {
  params: Promise<{
    businessId: string;
  }>;
}

export default function VerifyBusinessPage({ params }: VerifyPageProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const claimId = searchParams.get('claimId');
  const [paramsData, setParamsData] = useState<{ businessId: string } | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    params.then(p => setParamsData(p));
  }, [params]);

  const businessId = paramsData?.businessId as Id<"businesses"> | undefined;
  const business = useQuery(api.businesses.getById, businessId ? { id: businessId } : "skip");
  const claim = useQuery(api.businessClaims.getClaimById, claimId ? { claimId: claimId as Id<"businessClaims"> } : "skip");
  const verifyGoogleOwnership = useAction(api.businessClaims.verifyGoogleBusinessOwnership);

  const handleGoogleVerification = async () => {
    setVerificationStatus('verifying');
    setErrorMessage('');

    try {
      // In a real implementation, you would:
      // 1. Redirect to Google OAuth with proper scopes
      // 2. Get the access token from the OAuth callback
      // 3. Use that token to verify ownership
      
      // For now, we'll show the process
      const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
      const REDIRECT_URI = `${window.location.origin}/api/auth/google-business/callback`;
      const SCOPES = 'https://www.googleapis.com/auth/business.manage';
      
      // Store claim ID for callback
      sessionStorage.setItem('pendingClaimId', claimId || '');
      
      // Redirect to Google OAuth
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${GOOGLE_CLIENT_ID}&` +
        `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
        `response_type=code&` +
        `scope=${encodeURIComponent(SCOPES)}&` +
        `access_type=offline&` +
        `prompt=consent`;
      
      window.location.href = authUrl;
      
    } catch (error: any) {
      console.error('Verification error:', error);
      setVerificationStatus('error');
      setErrorMessage(error.message || 'Failed to verify ownership');
      toast.error('Verification failed', {
        description: error.message || 'Failed to verify ownership'
      });
    }
  };

  if (!claimId || !businessId) {
    return (
      <div className="flex justify-center items-center h-64">
        <Alert>
          <AlertTitle>Invalid Verification Link</AlertTitle>
          <AlertDescription>
            This verification link is invalid or has expired.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!business || !claim) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin" />
      </div>
    );
  }

  if (claim.status === 'approved') {
    return (
      <Card className="mx-auto w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-green-500" />
            <CardTitle>Business Claimed Successfully!</CardTitle>
          </div>
          <CardDescription>
            You have successfully claimed {business.name}. You can now manage this business listing.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={() => router.push(`/business/${businessId}/edit`)}>
            Go to Business Dashboard
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Verify Ownership of {business.name}</CardTitle>
        <CardDescription>
          To complete your claim, please verify that you have access to this business on Google Business Profile.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="p-4 bg-muted rounded-lg">
          <h3 className="font-medium text-foreground mb-2">Why verification is required?</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Ensures only legitimate business owners can manage listings</li>
            <li>• Protects businesses from unauthorized claims</li>
            <li>• Maintains trust and authenticity on the platform</li>
          </ul>
        </div>

        {verificationStatus === 'error' && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Verification Failed</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <div className="p-4 border rounded-lg">
          <h3 className="font-medium mb-3">Google Business Profile Verification</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Click the button below to connect your Google account and verify ownership. 
            You'll be redirected to Google to authorize access to your business listings.
          </p>
          
          <Alert className="mb-4">
            <AlertDescription>
              <strong>Note:</strong> This feature requires Google Business Profile API access. 
              For demonstration purposes, this will simulate the verification process.
            </AlertDescription>
          </Alert>

          <Button 
            onClick={handleGoogleVerification}
            disabled={verificationStatus === 'verifying'}
            className="w-full"
          >
            {verificationStatus === 'verifying' ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <ExternalLink className="mr-2 h-4 w-4" />
                Verify with Google Business Profile
              </>
            )}
          </Button>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={() => router.push('/dashboard/claims')}
        >
          View All Claims
        </Button>
        <Button 
          variant="ghost" 
          onClick={() => router.push(`/${business.customDomain || business.slug}`)}
        >
          Return to Business Page
        </Button>
      </CardFooter>
    </Card>
  );
}