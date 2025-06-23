'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/app/components/ui/alert';
import { Button } from '@/app/components/ui/button';
import { XCircle } from 'lucide-react';

export default function VerifyErrorPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const error = searchParams.get('error') || 'An unknown error occurred';

  return (
    <div className="container mx-auto py-8">
      <Card className="mx-auto w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <XCircle className="w-6 h-6 text-red-500" />
            <CardTitle>Verification Error</CardTitle>
          </div>
          <CardDescription>
            There was a problem verifying your business ownership
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Error Details</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => router.push('/dashboard/claims')}
          >
            View All Claims
          </Button>
          <Button 
            onClick={() => router.back()}
          >
            Try Again
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}