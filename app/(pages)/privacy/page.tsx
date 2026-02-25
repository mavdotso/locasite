import { Metadata } from "next";
import { SITE_CONFIG } from "@/app/lib/site-config";

export const metadata: Metadata = { title: "Privacy Policy — Locasite" };

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-foreground mb-2">
          Privacy Policy
        </h1>
        <p className="text-muted-foreground mb-12">
          Last updated: February 25, 2026
        </p>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-10">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Information We Collect
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              When you use Locasite, we collect information you provide directly,
              such as your name, email address, and business details. We also
              collect usage data automatically, including pages visited, features
              used, and device information. If you connect third-party services
              (such as Google Business Profile), we may receive information from
              those services as authorized by you.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              How We Use Information
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We use the information we collect to provide, maintain, and improve
              our services. This includes creating and hosting your business
              website, processing transactions, sending service-related
              communications, and personalizing your experience. We may also use
              aggregated, anonymized data for analytics and to improve our
              platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Data Storage
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Your data is stored securely using industry-standard encryption and
              security practices. We use trusted third-party infrastructure
              providers to host our services. We retain your data for as long as
              your account is active or as needed to provide you with our
              services. You may request deletion of your data at any time by
              contacting us.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Your Rights
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              You have the right to access, correct, or delete your personal
              information at any time. You may also request a copy of the data we
              hold about you, opt out of marketing communications, and withdraw
              consent for data processing where applicable. We will respond to
              your requests within a reasonable timeframe in accordance with
              applicable law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Contact
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have questions or concerns about this privacy policy or our
              data practices, please contact us at{" "}
              <a
                href={`mailto:${SITE_CONFIG.emails.privacy}`}
                className="text-primary hover:underline"
              >
                {SITE_CONFIG.emails.privacy}
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
