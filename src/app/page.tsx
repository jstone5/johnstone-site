import { getPosts } from "@/lib/substack";
import { LandingContent } from "@/components/landing/LandingContent";

export const revalidate = 3600;

export default async function LandingPage() {
  const posts = await getPosts();
  const recentPosts = posts.slice(0, 5);

  return <LandingContent posts={recentPosts} />;
}
