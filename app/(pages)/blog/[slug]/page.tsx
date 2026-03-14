import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { getBlogPost, getAllBlogSlugs } from "@/app/lib/blog";
import NavBar from "@/app/components/landing/nav-bar";
import FooterSection from "@/app/components/landing/footer-section";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.metaDescription,
    alternates: { canonical: `https://locosite.io/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.metaDescription,
      url: `https://locosite.io/blog/${post.slug}`,
      type: "article",
      publishedTime: post.publishedAt,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  return (
    <>
      <NavBar />
      <main className="max-w-2xl mx-auto px-6 py-20">
        <div className="mb-10">
          <Link
            href="/blog"
            className="text-xs font-semibold uppercase tracking-widest text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            ← Blog
          </Link>
        </div>

        <article>
          <header className="mb-12">
            <div className="flex items-center gap-3 mb-4">
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
            <h1 className="font-display text-4xl font-extrabold text-neutral-900 leading-tight">
              {post.title}
            </h1>
          </header>

          <div className="prose prose-neutral max-w-none prose-headings:font-display prose-headings:font-bold prose-headings:text-neutral-900 prose-p:text-neutral-600 prose-p:leading-relaxed prose-li:text-neutral-600 prose-strong:text-neutral-800 prose-a:text-neutral-900 prose-a:underline prose-a:underline-offset-4 prose-a:decoration-neutral-300 hover:prose-a:decoration-neutral-600">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
        </article>
      </main>
      <FooterSection />
    </>
  );
}
