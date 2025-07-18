"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { Loader, CheckCircle, XCircle } from "lucide-react";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [verifying, setVerifying] = useState(true);
  const [status, setStatus] = useState<"success" | "error" | null>(null);
  const [message, setMessage] = useState("");

  const token = searchParams.get("token");
  const businessId = searchParams.get("businessId");

  useEffect(() => {
    if (!token || !businessId) {
      setStatus("error");
      setMessage("Invalid verification link");
      setVerifying(false);
      return;
    }

    // Verify the token
    const verifyToken = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_CONVEX_URL}/verification/verify-token`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token, businessId }),
          },
        );

        const result = await response.json();

        if (response.ok && result.success) {
          setStatus("success");
          setMessage(result.message || "Email verification successful!");
        } else {
          setStatus("error");
          setMessage(result.error || result.message || "Verification failed");
        }
      } catch {
        setStatus("error");
        setMessage("An error occurred during verification");
      } finally {
        setVerifying(false);
      }
    };

    verifyToken();
  }, [token, businessId]);

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Email Verification</CardTitle>
          <CardDescription>Verifying your business ownership</CardDescription>
        </CardHeader>
        <CardContent>
          {verifying && (
            <div className="flex flex-col items-center space-y-4">
              <Loader className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Verifying your email...</p>
            </div>
          )}

          {!verifying && status === "success" && (
            <div className="space-y-4">
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">Success!</AlertTitle>
                <AlertDescription className="text-green-700">
                  {message}
                </AlertDescription>
              </Alert>
              <Button
                onClick={() => router.push("/dashboard")}
                className="w-full"
              >
                Go to Dashboard
              </Button>
            </div>
          )}

          {!verifying && status === "error" && (
            <div className="space-y-4">
              <Alert className="bg-red-50 border-red-200">
                <XCircle className="h-4 w-4 text-red-600" />
                <AlertTitle className="text-red-800">
                  Verification Failed
                </AlertTitle>
                <AlertDescription className="text-red-700">
                  {message}
                </AlertDescription>
              </Alert>
              <Button
                onClick={() => router.push("/dashboard/claims")}
                variant="outline"
                className="w-full"
              >
                View Your Claims
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
