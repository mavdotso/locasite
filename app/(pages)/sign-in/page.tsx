"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "@/app/components/ui/logo";

interface PendingBusinessData {
  name?: string;
  [key: string]: unknown;
}

export default function SignInPage() {
  const { signIn } = useAuthActions();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const [pendingBusiness, setPendingBusiness] = useState<PendingBusinessData | null>(null);

  useEffect(() => {
    const pending = sessionStorage.getItem("pendingBusinessData");
    if (pending) {
      try {
        const businessData = JSON.parse(pending) as PendingBusinessData;
        setPendingBusiness(businessData);
      } catch (error) {
        console.error("Error parsing pending business:", error);
        sessionStorage.removeItem("pendingBusinessData");
      }
    }
  }, []);

  const handleSignIn = async () => {
    try {
      // Store redirect URL in sessionStorage before signing in
      if (redirect) {
        sessionStorage.setItem("authRedirect", redirect);
      }
      await signIn("google");
    } catch (error) {
      console.error("Sign in error:", error);
    }
  };

  return (
    <div className="flex justify-center items-center bg-secondary px-4 py-12 h-screen">
      <Card className="shadow-lg border-none w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <Logo width={32} height={32} showText={false} />
          </div>
          <CardTitle className="font-bold text-2xl">
            Welcome to Locasite
          </CardTitle>
          <CardDescription>
            {pendingBusiness
              ? `Sign in to publish your ${pendingBusiness.name} website`
              : redirect?.includes("/claim/")
                ? "Sign in to claim this business"
                : "Sign in to manage your business sites"}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col items-center space-y-6 pt-6">
          <div className="flex justify-center items-center bg-primary/10 rounded-full w-16 h-16">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>

          <div className="w-full">
            <Button
              onClick={handleSignIn}
              variant="default"
              className="flex justify-center items-center w-full h-11 text-base"
            >
              <svg
                className="mr-2 w-4 h-4"
                aria-hidden="true"
                focusable="false"
                data-prefix="fab"
                data-icon="google"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 488 512"
              >
                <path
                  fill="currentColor"
                  d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                ></path>
              </svg>
              Sign in with Google
            </Button>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col text-center">
          <p className="px-6 text-muted-foreground text-xs">
            We use Google for authentication to provide a secure and seamless
            experience. By signing in, you agree to our Terms of Service and
            Privacy Policy.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
