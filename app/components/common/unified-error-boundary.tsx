"use client";

import React from "react";
import {
  AlertTriangle,
  AlertCircle,
  RefreshCw,
  Home,
  Save,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import Link from "next/link";

export type ErrorBoundaryVariant = "default" | "dashboard" | "editor";

interface UnifiedErrorBoundaryProps {
  children: React.ReactNode;
  variant?: ErrorBoundaryVariant;
  onSaveRecovery?: () => void;
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default function UnifiedErrorBoundary({
  children,
  variant = "default",
  onSaveRecovery,
  fallback,
}: UnifiedErrorBoundaryProps) {
  return (
    <ErrorBoundaryClass
      variant={variant}
      onSaveRecovery={onSaveRecovery}
      fallback={fallback}
    >
      {children}
    </ErrorBoundaryClass>
  );
}

class ErrorBoundaryClass extends React.Component<
  UnifiedErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: UnifiedErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch() {
    // Error logging could be added here if needed
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return (
          <FallbackComponent error={this.state.error} reset={this.reset} />
        );
      }

      switch (this.props.variant) {
        case "dashboard":
          return (
            <DashboardErrorFallback
              error={this.state.error}
              reset={this.reset}
            />
          );
        case "editor":
          return (
            <EditorErrorFallback
              error={this.state.error}
              reset={this.reset}
              onSaveRecovery={this.props.onSaveRecovery}
            />
          );
        default:
          return (
            <DefaultErrorFallback error={this.state.error} reset={this.reset} />
          );
      }
    }

    return this.props.children;
  }
}

function DefaultErrorFallback({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <CardTitle>Something went wrong</CardTitle>
          </div>
          <CardDescription>
            An unexpected error occurred. Please try again.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
            <code>{error.message}</code>
          </div>
          <Button onClick={reset} className="w-full">
            Try Again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function DashboardErrorFallback({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Dashboard Error
          </h1>
          <p className="text-muted-foreground">
            We encountered an error while loading your dashboard. This might be
            a temporary issue.
          </p>
        </div>

        <div className="bg-muted rounded-lg p-4">
          <p className="text-sm font-mono text-muted-foreground break-all">
            {error.message}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset} variant="default">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          <Button asChild variant="outline">
            <Link href="/dashboard">
              <Home className="mr-2 h-4 w-4" />
              Go to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function EditorErrorFallback({
  error,
  reset,
  onSaveRecovery,
}: {
  error: Error;
  reset: () => void;
  onSaveRecovery?: () => void;
}) {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="max-w-lg w-full space-y-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Editor Error</AlertTitle>
          <AlertDescription>
            The editor encountered an error. Your changes may not have been
            saved.
          </AlertDescription>
        </Alert>

        <div className="bg-muted rounded-lg p-4">
          <p className="text-sm font-mono text-muted-foreground">
            {error.message}
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Try refreshing the editor. If you had unsaved changes, you can
            attempt to recover them.
          </p>

          <div className="flex gap-3">
            <Button onClick={reset} className="flex-1">
              <RotateCcw className="mr-2 h-4 w-4" />
              Refresh Editor
            </Button>
            {onSaveRecovery && (
              <Button
                onClick={onSaveRecovery}
                variant="outline"
                className="flex-1"
              >
                <Save className="mr-2 h-4 w-4" />
                Attempt Recovery
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
