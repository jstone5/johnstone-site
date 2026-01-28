"use client";

import Link from "next/link";
import { PixelButton } from "@/components/PixelButton";
import { PixelCard } from "@/components/PixelCard";
import { site } from "@/content/site";
import type { Post } from "@/lib/substack";

interface WritingLevelProps {
  featuredPosts?: Post[];
}

export function WritingLevel({ featuredPosts = [] }: WritingLevelProps) {
  return (
    <div>
      <h2 className="font-[family-name:var(--font-pixelify-sans)] text-3xl sm:text-4xl text-[var(--text)] mb-2">
        Writing
      </h2>

      <p className="text-[var(--muted)] mb-8 max-w-xl">
        I write to clarify what I think. Topics include product craft, systems,
        AI, incentives, and the future of work.
      </p>

      {featuredPosts.length > 0 && (
        <>
          <h3 className="text-sm font-[family-name:var(--font-pixelify-sans)] text-[var(--accent)] uppercase tracking-wider mb-4">
            Start here
          </h3>

          <div className="grid gap-4 sm:grid-cols-2 mb-8">
            {featuredPosts.slice(0, 4).map((post) => (
              <Link key={post.slug} href={`/writing/${post.slug}`}>
                <PixelCard className="h-full">
                  <h4 className="font-[family-name:var(--font-pixelify-sans)] text-lg text-[var(--accent)] mb-2 line-clamp-2">
                    {post.title}
                  </h4>
                  <p className="text-sm text-[var(--muted)] line-clamp-2">
                    {post.excerpt}
                  </p>
                </PixelCard>
              </Link>
            ))}
          </div>
        </>
      )}

      {featuredPosts.length === 0 && (
        <div className="mb-8">
          <PixelCard hover={false} className="text-center py-8">
            <p className="text-[var(--muted)]">
              Writing syncs from Substack. Check out the full archive.
            </p>
          </PixelCard>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <PixelButton href="/writing" variant="primary">
          All writing
        </PixelButton>
        <PixelButton href={site.links.substack} variant="secondary" external>
          Read on Substack
        </PixelButton>
      </div>
    </div>
  );
}
