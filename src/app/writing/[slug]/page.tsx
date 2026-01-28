import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getPosts, getPostBySlug } from "@/lib/substack";
import { PostContent } from "@/components/PostContent";
import { PixelButton } from "@/components/PixelButton";
import { PostTracker } from "@/components/PostTracker";
import { site } from "@/content/site";

export const revalidate = 3600; // Revalidate every hour

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post not found",
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
    },
    alternates: {
      canonical: post.url,
    },
  };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const hasFullContent = post.content && post.content.length > 200;

  return (
    <div className="min-h-screen pt-14 lg:pl-48 pb-32 lg:pb-16">
      <PostTracker slug={slug} title={post.title} />
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Back link */}
        <Link
          href="/writing"
          className="inline-flex items-center text-sm text-[var(--muted)] hover:text-[var(--accent)] transition-colors mb-8"
        >
          &larr; All writing
        </Link>

        {/* Header */}
        <header className="mb-12">
          <h1 className="font-[family-name:var(--font-pixelify-sans)] text-2xl sm:text-3xl lg:text-4xl text-[var(--text)] mb-4">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--muted)]">
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            <span>&middot;</span>
            <Link
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent)] hover:text-[var(--accent2)] transition-colors"
            >
              Read on Substack &rarr;
            </Link>
          </div>
        </header>

        {/* Content */}
        {hasFullContent ? (
          <PostContent html={post.content!} />
        ) : (
          <div className="bg-[var(--panel)] border border-[var(--border)] pixel-corners p-8 text-center">
            <p className="text-[var(--muted)] mb-2">{post.excerpt}</p>
            <p className="text-sm text-[var(--muted)]/70 mb-6">
              Full content available on Substack.
            </p>
            <PixelButton href={post.url} external variant="primary">
              Read on Substack
            </PixelButton>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-[var(--border)]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <Link
              href="/writing"
              className="text-sm text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
            >
              &larr; All writing
            </Link>
            <PixelButton href={site.links.substack} external variant="secondary">
              Subscribe on Substack
            </PixelButton>
          </div>
        </footer>
      </article>
    </div>
  );
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
