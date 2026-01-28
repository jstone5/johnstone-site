export async function GET() {
  const robotsTxt = `User-agent: *
Allow: /

Sitemap: https://johnstone.blog/sitemap.xml
`;

  return new Response(robotsTxt, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
