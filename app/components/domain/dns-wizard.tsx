"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Copy, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { dnsProviders, type DnsProvider } from "./provider-instructions";

interface DnsWizardProps {
  domain: string;
  cnameHost: string;
  cnameValue: string;
  txtHost: string;
  txtValue: string;
  onVerify: () => void;
  isVerifying: boolean;
}

function CopyableValue({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(value);
    toast.success("Copied!");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [value]);

  return (
    <span className="inline-flex items-center gap-1.5">
      {label && <span className="text-muted-foreground">{label}</span>}
      <code className="bg-muted px-2 py-0.5 rounded text-sm font-mono">
        {value}
      </code>
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex items-center justify-center h-6 w-6 rounded hover:bg-muted transition-colors"
        aria-label={`Copy ${value}`}
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-green-500" />
        ) : (
          <Copy className="h-3.5 w-3.5 text-muted-foreground" />
        )}
      </button>
    </span>
  );
}

function interpolateStep(
  step: string,
  values: Record<string, string>,
): React.ReactNode {
  const placeholderRegex = /\{(cnameHost|cnameValue|txtHost|txtValue)\}/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = placeholderRegex.exec(step)) !== null) {
    // Add text before the placeholder
    if (match.index > lastIndex) {
      parts.push(step.slice(lastIndex, match.index));
    }

    const key = match[1] as keyof typeof values;
    parts.push(
      <CopyableValue key={match.index} label="" value={values[key]} />,
    );

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < step.length) {
    parts.push(step.slice(lastIndex));
  }

  return parts;
}

function ProviderSteps({
  provider,
  values,
  onBack,
  onVerify,
  isVerifying,
}: {
  provider: DnsProvider;
  values: Record<string, string>;
  onBack: () => void;
  onVerify: () => void;
  isVerifying: boolean;
}) {
  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Choose a different provider
      </button>

      <h3 className="font-semibold text-lg">
        Setup instructions for {provider.name}
      </h3>

      <ol className="space-y-3 list-none">
        {provider.steps.map((step, index) => (
          <li key={index} className="flex gap-3">
            <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-sm font-medium">
              {index + 1}
            </span>
            <span className="pt-0.5 leading-relaxed">
              {interpolateStep(step, values)}
            </span>
          </li>
        ))}
      </ol>

      <div className="pt-4 space-y-3">
        <Button onClick={onVerify} disabled={isVerifying}>
          {isVerifying ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Checking...
            </>
          ) : (
            "Check Connection"
          )}
        </Button>
        <p className="text-sm text-muted-foreground">
          DNS changes can take up to 48 hours. We'll keep checking
          automatically.
        </p>
      </div>
    </div>
  );
}

function GenericInstructions({
  values,
  onBack,
  onVerify,
  isVerifying,
}: {
  values: Record<string, string>;
  onBack: () => void;
  onVerify: () => void;
  isVerifying: boolean;
}) {
  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Choose a different provider
      </button>

      <h3 className="font-semibold text-lg">DNS Setup Instructions</h3>
      <p className="text-muted-foreground">
        Add these two records to your domain's DNS settings:
      </p>

      <div className="space-y-4">
        <div className="rounded-lg border p-4 space-y-2">
          <p className="font-medium text-sm">Record 1: CNAME</p>
          <div className="flex flex-col gap-1.5 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground w-16">Type:</span>
              <code className="bg-muted px-2 py-0.5 rounded font-mono">
                CNAME
              </code>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground w-16">Host:</span>
              <CopyableValue label="" value={values.cnameHost} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground w-16">Value:</span>
              <CopyableValue label="" value={values.cnameValue} />
            </div>
          </div>
        </div>

        <div className="rounded-lg border p-4 space-y-2">
          <p className="font-medium text-sm">Record 2: TXT</p>
          <div className="flex flex-col gap-1.5 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground w-16">Type:</span>
              <code className="bg-muted px-2 py-0.5 rounded font-mono">
                TXT
              </code>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground w-16">Host:</span>
              <CopyableValue label="" value={values.txtHost} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground w-16">Value:</span>
              <CopyableValue label="" value={values.txtValue} />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 space-y-3">
        <Button onClick={onVerify} disabled={isVerifying}>
          {isVerifying ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Checking...
            </>
          ) : (
            "Check Connection"
          )}
        </Button>
        <p className="text-sm text-muted-foreground">
          DNS changes can take up to 48 hours. We'll keep checking
          automatically.
        </p>
      </div>
    </div>
  );
}

export function DnsWizard({
  cnameHost,
  cnameValue,
  txtHost,
  txtValue,
  onVerify,
  isVerifying,
}: DnsWizardProps) {
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);

  const values = { cnameHost, cnameValue, txtHost, txtValue };

  const provider = selectedProvider
    ? dnsProviders.find((p) => p.id === selectedProvider)
    : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Set Up Your Domain</CardTitle>
      </CardHeader>
      <CardContent>
        {selectedProvider === null ? (
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Where did you buy your domain?
            </p>
            <div className="grid grid-cols-2 gap-3">
              {dnsProviders.map((p) => (
                <Button
                  key={p.id}
                  variant="outline"
                  className="h-14 text-base"
                  onClick={() => setSelectedProvider(p.id)}
                >
                  {p.name}
                </Button>
              ))}
              <Button
                variant="outline"
                className="h-14 text-base col-span-2"
                onClick={() => setSelectedProvider("other")}
              >
                Other provider
              </Button>
            </div>
          </div>
        ) : selectedProvider === "other" || !provider ? (
          <GenericInstructions
            values={values}
            onBack={() => setSelectedProvider(null)}
            onVerify={onVerify}
            isVerifying={isVerifying}
          />
        ) : (
          <ProviderSteps
            provider={provider}
            values={values}
            onBack={() => setSelectedProvider(null)}
            onVerify={onVerify}
            isVerifying={isVerifying}
          />
        )}
      </CardContent>
    </Card>
  );
}
