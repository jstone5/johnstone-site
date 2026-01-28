import { LevelJourney } from "@/components/LevelJourney";
import { getFeaturedPosts } from "@/lib/substack";

export const revalidate = 3600; // Revalidate every hour

export default async function Home() {
  const featuredPosts = await getFeaturedPosts(4);

  return <LevelJourney featuredPosts={featuredPosts} />;
}
