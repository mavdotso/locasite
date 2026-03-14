import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "@/app/lib/blog";
import NavBar from "@/app/components/landing/nav-bar";
import FooterSection from "@/app/components/landing/footer-section";

export const metadata: Metadata = {
  title: "Blog — Free Websites for Local Businesses",
  description:
    "Guides and tips for local business owners on getting found online, building a website, and growing with Google.",
  alternates: { canonical: "https://locosite.io/blog" },
};

export default function BlogPage() {
  const sorted = [...blogPosts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

  return (
    <>
      <NavBar />
      <main className="max-w-3xl mx-auto px-6 py-20">
        <header className="mb-16">
          <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-3">
            Blog
          </p>
          <h1 className="font-display text-5xl font-extrabold text-neutral-900 leading-tight">
            Get your business found online.
          </h1>
          <p className="mt-4 text-lg text-neutral-500 max-w-xl">
            Practical guides for local business owners who want to show up on
            Google and get more customers.
          </p>
        </header>

        <ol className="space-y-0 divide-y divide-neutral-100">
          {sorted.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="group flex flex-col gap-1 py-8 hover:opacity-80 transition-opacity"
              >
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
                    {post.category}
                  </span>
                  <span className="text-xs text-neutral-300">·</span>
                  <time
                    dateTime={post.publishedAt}
                    className="text-xs text-neutral-400"
                  >
                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </time>
                </div>
                <h2 className="font-display text-xl font-bold text-neutral-900 group-hover:text-neutral-700 transition-colors leading-snug">
                  {post.title}
                </h2>
                <p className="text-neutral-500 text-sm leading-relaxed mt-1">
                  {post.excerpt}
                </p>
                <span className="text-sm font-medium text-neutral-900 mt-2 underline underline-offset-4 decoration-neutral-300">
                  Read more
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </main>
      <FooterSection />
    </>
  );
}
