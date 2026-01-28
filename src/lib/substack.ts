import Parser from "rss-parser";
import { z } from "zod/v4";
import { site } from "@/content/site";

const parser = new Parser({
  customFields: {
    item: ["content:encoded", "dc:creator"],
  },
});

// Schema for a single post
const PostSchema = z.object({
  title: z.string(),
  slug: z.string(),
  url: z.string().url(),
  publishedAt: z.string(),
  excerpt: z.string(),
  content: z.string().optional(),
  author: z.string().optional(),
});

export type Post = z.infer<typeof PostSchema>;

// Extract slug from Substack URL
// Example: https://johnstone.substack.com/p/some-post-title -> some-post-title
export function slugFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split("/");
    const pIndex = pathParts.indexOf("p");
    if (pIndex !== -1 && pathParts[pIndex + 1]) {
      return pathParts[pIndex + 1];
    }
    // Fallback: use last path segment
    return pathParts.filter(Boolean).pop() || "untitled";
  } catch {
    return "untitled";
  }
}

// Create excerpt from content
function createExcerpt(content: string, maxLength = 160): string {
  // Strip HTML tags
  const text = content.replace(/<[^>]*>/g, "");
  // Normalize whitespace
  const normalized = text.replace(/\s+/g, " ").trim();
  // Truncate
  if (normalized.length <= maxLength) return normalized;
  return normalized.slice(0, maxLength).trim() + "...";
}

// Fetch all posts from Substack RSS
export async function getPosts(): Promise<Post[]> {
  try {
    const feed = await parser.parseURL(site.substackFeedUrl);

    const posts: Post[] = [];

    for (const item of feed.items) {
      if (!item.title || !item.link) continue;

      const slug = slugFromUrl(item.link);
      const itemAny = item as unknown as Record<string, unknown>;
      const content = itemAny["content:encoded"] as string | undefined;
      const excerpt = item.contentSnippet
        ? createExcerpt(item.contentSnippet)
        : content
          ? createExcerpt(content)
          : "";

      const post: Post = {
        title: item.title,
        slug,
        url: item.link,
        publishedAt: item.pubDate || item.isoDate || new Date().toISOString(),
        excerpt,
        content: content || undefined,
        author: itemAny["dc:creator"] as string | undefined,
      };

      // Validate with Zod
      const result = PostSchema.safeParse(post);
      if (result.success) {
        posts.push(result.data);
      }
    }

    // Sort by date, newest first
    return posts.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  } catch (error) {
    console.error("Failed to fetch Substack feed:", error);
    return [];
  }
}

// Get a single post by slug
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const posts = await getPosts();
  return posts.find((post) => post.slug === slug) || null;
}

// Get featured posts (first N posts or by specific slugs)
export async function getFeaturedPosts(count = 4): Promise<Post[]> {
  const posts = await getPosts();

  // If we have specific featured slugs in config, use those
  if (site.featuredPostSlugs && site.featuredPostSlugs.length > 0) {
    const featured = site.featuredPostSlugs
      .map((slug) => posts.find((p) => p.slug === slug))
      .filter((p): p is Post => p !== undefined);

    if (featured.length > 0) {
      return featured.slice(0, count);
    }
  }

  // Otherwise return most recent posts
  return posts.slice(0, count);
}
