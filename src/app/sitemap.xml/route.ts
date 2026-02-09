import { getPosts } from "@/lib/substack";

export async function GET() {
  const baseUrl = "https://johnstone.blog";

  const posts = await getPosts();

  const staticPages = [
    { url: "", priority: "1.0" },
    { url: "/game", priority: "0.8" },
    { url: "/writing", priority: "0.8" },
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages
    .map(
      (page) => `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <priority>${page.priority}</priority>
  </url>`
    )
    .join("")}
  ${posts
    .map(
      (post) => `
  <url>
    <loc>${baseUrl}/writing/${post.slug}</loc>
    <lastmod>${new Date(post.publishedAt).toISOString().split("T")[0]}</lastmod>
    <priority>0.7</priority>
  </url>`
    )
    .join("")}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
