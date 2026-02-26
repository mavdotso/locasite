import Link from "next/link";
import Logo from "@/app/components/ui/logo";
import PasteLinkForm from "@/app/components/landing/paste-link-form";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="px-6 py-6">
        <Logo width={28} height={28} />
      </header>

      {/* Hero + Form */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-16">
        <div className="w-full max-w-xl text-center space-y-8">
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
              Your business deserves a website.
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground">
              Get one in 2 minutes.
            </p>
          </div>

          <PasteLinkForm />

          <p className="text-sm text-muted-foreground">
            Don&apos;t have your link?{" "}
            <Link
              href="/dashboard/new"
              className="underline underline-offset-4 hover:text-foreground transition-colors"
            >
              Search for your business instead
            </Link>
          </p>
        </div>
      </main>

      {/* How it works */}
      <section className="border-t border-border/50 px-6 py-16">
        <div className="max-w-xl mx-auto">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-8">
            How it works
          </h2>
          <ol className="space-y-4 text-base text-foreground">
            <li className="flex gap-4">
              <span className="text-muted-foreground font-medium">1.</span>
              Paste your Google Maps link
            </li>
            <li className="flex gap-4">
              <span className="text-muted-foreground font-medium">2.</span>
              We build your site instantly
            </li>
            <li className="flex gap-4">
              <span className="text-muted-foreground font-medium">3.</span>
              Go live in one click
            </li>
          </ol>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 px-6 py-6">
        <div className="max-w-xl mx-auto flex items-center justify-between text-sm text-muted-foreground">
          <span>&copy; {new Date().getFullYear()} Locasite</span>
          <div className="flex gap-4">
            <Link
              href="/privacy"
              className="hover:text-foreground transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="hover:text-foreground transition-colors"
            >
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
