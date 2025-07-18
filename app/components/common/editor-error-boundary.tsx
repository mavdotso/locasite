"use client";

import React from "react";
import { AlertTriangle, Save, RotateCcw } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";

interface EditorErrorBoundaryProps {
  children: React.ReactNode;
  onSaveRecovery?: () => void;
}

export default function EditorErrorBoundary({
  children,
  onSaveRecovery,
}: EditorErrorBoundaryProps) {
  return (
    <ErrorBoundary
      fallback={(props) => (
        <EditorErrorFallback {...props} onSaveRecovery={onSaveRecovery} />
      )}
    >
      {children}
    </ErrorBoundary>
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

class ErrorBoundary extends React.Component<
  {
    children: React.ReactNode;
    fallback: React.ComponentType<{
      error: Error;
      reset: () => void;
      onSaveRecovery?: () => void;
    }>;
  },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: {
    children: React.ReactNode;
    fallback: React.ComponentType<{
      error: Error;
      reset: () => void;
      onSaveRecovery?: () => void;
    }>;
  }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Editor Error:", error, errorInfo);
    // Could send to error tracking service here
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback;
      return <FallbackComponent error={this.state.error} reset={this.reset} />;
    }

    return this.props.children;
  }
}
