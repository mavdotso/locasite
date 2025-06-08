'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Loader, Building2, Clock, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

export default function ClaimsPage() {
  const claims = useQuery(api.businessClaims.getClaimsByUser);
  const searchParams = useSearchParams();
  
  // Handle success/error messages from OAuth callback
  useEffect(() => {
    const success = searchParams.get('success');
    const error = searchParams.get('error');
    const message = searchParams.get('message');
    
    if (success === 'verification_complete') {
      toast.success('Verification Successful!', {
        description: message || 'Your business ownership has been verified.',
      });
    } else if (error) {
      const errorMessages: Record<string, string> = {
        auth_failed: 'Authentication failed. Please try again.',
        no_code: 'No authorization code received. Please try again.',
        invalid_state: 'Invalid request state. Please start the verification process again.',
        verification_failed: message || 'Verification failed. Please ensure you have access to this business on Google.',
      };
      
      toast.error('Verification Error', {
        description: errorMessages[error] || 'An unexpected error occurred.',
      });
    }
  }, [searchParams]);

  if (!claims) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin" />
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    }
  };

  const getVerificationBadge = (method?: string) => {
    switch (method) {
      case 'google':
        return <Badge variant="outline">Google Verification</Badge>;
      case 'email':
        return <Badge variant="outline">Email Verification</Badge>;
      case 'phone':
        return <Badge variant="outline">Phone Verification</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Business Claims</h1>
        <p className="text-muted-foreground">
          View and manage your business ownership claims
        </p>
      </div>

      {claims.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No claims yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              You haven&rsquo;t claimed any businesses yet. Find a business to claim and verify your ownership.
            </p>
            <Link href="/dashboard/sites">
              <Button>Browse Businesses</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {claims.map((claim) => (
            <Card key={claim._id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      {getStatusIcon(claim.status)}
                      {claim.business?.name || 'Unknown Business'}
                    </CardTitle>
                    <CardDescription>
                      {claim.business?.address}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {getStatusBadge(claim.status)}
                    {getVerificationBadge(claim.verificationMethod)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Submitted</p>
                    <p className="font-medium">
                      {format(new Date(claim.createdAt), 'MMM d, yyyy')}
                    </p>
                  </div>
                  {claim.updatedAt && (
                    <div>
                      <p className="text-muted-foreground">Last Updated</p>
                      <p className="font-medium">
                        {format(new Date(claim.updatedAt), 'MMM d, yyyy')}
                      </p>
                    </div>
                  )}
                  {claim.googleVerificationStatus && (
                    <div>
                      <p className="text-muted-foreground">Google Verification</p>
                      <p className="font-medium capitalize">
                        {claim.googleVerificationStatus}
                      </p>
                    </div>
                  )}
                  {claim.notes && (
                    <div className="col-span-2">
                      <p className="text-muted-foreground">Notes</p>
                      <p className="font-medium">{claim.notes}</p>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2 mt-4">
                  {claim.status === 'pending' && claim.verificationMethod === 'google' && (
                    <Link href={`/business/${claim.businessId}/verify?claimId=${claim._id}`}>
                      <Button size="sm">Complete Verification</Button>
                    </Link>
                  )}
                  {claim.status === 'approved' && (
                    <Link href={`/business/${claim.businessId}/edit`}>
                      <Button size="sm">Manage Business</Button>
                    </Link>
                  )}
                  {claim.business && (
                    <Link href={`/business/${claim.business._id}`}>
                      <Button size="sm" variant="outline">View Business Page</Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}