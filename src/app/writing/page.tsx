import { Metadata } from "next";
import Link from "next/link";
import { getPosts } from "@/lib/substack";
import { PixelCard } from "@/components/PixelCard";
import { PixelButton } from "@/components/PixelButton";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Writing",
  description:
    "Essays about product craft, systems, AI, incentives, and the future of work.",
};

export const revalidate = 3600; // Revalidate every hour

export default async function WritingPage() {
  const posts = await getPosts();

  if (posts.length === 0) {
    return (
      <div className="min-h-screen pt-14 lg:pl-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <h1 className="font-[family-name:var(--font-pixelify-sans)] text-3xl sm:text-4xl text-[var(--text)] mb-8">
            Writing
          </h1>

          <PixelCard hover={false} className="text-center py-12">
            <h2 className="font-[family-name:var(--font-pixelify-sans)] text-xl text-[var(--accent)] mb-2">
              No posts yet
            </h2>
            <p className="text-[var(--muted)] mb-6">
              New writing lands on Substack first. Check back soon.
            </p>
            <PixelButton href={site.links.substack} external variant="primary">
              Visit Substack
            </PixelButton>
          </PixelCard>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-14 lg:pl-24 pb-16 lg:pb-0">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="mb-12">
          <h1 className="font-[family-name:var(--font-pixelify-sans)] text-3xl sm:text-4xl text-[var(--text)] mb-2">
            Writing
          </h1>
          <p className="text-[var(--muted)]">
            Essays about product craft, systems, AI, incentives, and the future
            of work.
          </p>
        </div>

        <div className="space-y-6">
          {posts.map((post) => (
            <article key={post.slug}>
              <Link href={`/writing/${post.slug}`}>
                <PixelCard>
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                    <h2 className="font-[family-name:var(--font-pixelify-sans)] text-lg text-[var(--accent)]">
                      {post.title}
                    </h2>
                    <time
                      dateTime={post.publishedAt}
                      className="text-xs text-[var(--muted)] shrink-0"
                    >
                      {formatDate(post.publishedAt)}
                    </time>
                  </div>
                  <p className="text-sm text-[var(--muted)] line-clamp-2">
                    {post.excerpt}
                  </p>
                </PixelCard>
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <PixelButton href={site.links.substack} external variant="secondary">
            Read on Substack
          </PixelButton>
        </div>
      </div>
    </div>
  );
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
