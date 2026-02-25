import { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Service — Locasite" };

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-foreground mb-2">
          Terms of Service
        </h1>
        <p className="text-muted-foreground mb-12">
          Last updated: February 25, 2026
        </p>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-10">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Acceptance of Terms
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing or using Locasite, you agree to be bound by these
              Terms of Service. If you do not agree to these terms, you may not
              use our services. We reserve the right to update these terms at any
              time, and your continued use of the platform constitutes acceptance
              of any changes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Service Description
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Locasite provides a platform for creating and hosting professional
              business websites. Our services include website generation from
              Google Maps data, AI-powered content creation, custom domain
              support, analytics, and contact form management. Features may vary
              based on your subscription plan.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              User Responsibilities
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              You are responsible for maintaining the security of your account
              and for all activities that occur under your account. You agree to
              provide accurate information when creating your account and
              business listings. You must not use the service to publish
              misleading, harmful, or illegal content. You are responsible for
              ensuring that any business information you publish is accurate and
              that you have the right to represent the business.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Intellectual Property
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              You retain ownership of the content you create and upload to
              Locasite. By using our services, you grant us a limited license to
              host, display, and distribute your content as necessary to provide
              the service. The Locasite platform, including its design, code, and
              branding, is owned by Locasite and protected by intellectual
              property laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Limitation of Liability
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Locasite is provided &ldquo;as is&rdquo; without warranties of any
              kind, either express or implied. We do not guarantee uninterrupted
              or error-free service. To the maximum extent permitted by law,
              Locasite shall not be liable for any indirect, incidental, special,
              or consequential damages arising from your use of the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Termination
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We may suspend or terminate your access to Locasite at any time for
              violations of these terms or for any other reason at our
              discretion. You may also close your account at any time. Upon
              termination, your right to use the service ceases immediately, and
              we may delete your data after a reasonable retention period.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Contact
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have questions about these Terms of Service, please contact
              us at{" "}
              <a
                href="mailto:legal@locasite.com"
                className="text-primary hover:underline"
              >
                legal@locasite.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
