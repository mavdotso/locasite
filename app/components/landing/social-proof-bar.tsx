import { Zap, Shield, Clock } from "lucide-react";

export default function SocialProofBar() {
  return (
    <section className="border-y bg-muted/30"  id="reviews">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center gap-8 md:flex-row md:gap-12">
          {/* Fast Setup */}
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-blue-100 p-2">
              <Zap className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-lg font-bold">60 Second Setup</p>
              <p className="text-sm text-muted-foreground">From URL to Live Site</p>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden h-12 w-px bg-border md:block" />

          {/* No Credit Card */}
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-green-100 p-2">
              <Shield className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-lg font-bold">Free Forever Plan</p>
              <p className="text-sm text-muted-foreground">No Credit Card Required</p>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden h-12 w-px bg-border md:block" />

          {/* Always Available */}
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-purple-100 p-2">
              <Clock className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-lg font-bold">99.9% Uptime</p>
              <p className="text-sm text-muted-foreground">Your Site Always Online</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
