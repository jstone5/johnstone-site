export const site = {
  name: "John Stone",
  tagline: "A portfolio of thoughts",
  description:
    "A pixel-modern personal site featuring a scroll-driven Level Journey, selected work, and writing synced from Substack.",
  substackFeedUrl: "https://johnstone.substack.com/feed",
  links: {
    linkedin: "https://www.linkedin.com/in/johnbstone/",
    substack: "https://johnstone.substack.com",
    x: "https://x.com/JohnStoneBlog",
    trove: "https://www.trove.dad",
    email: "", // Not publishing
  },
  featuredPostSlugs: [
    // Will be populated from Substack feed
  ],
  linksSection: [
    {
      category: "Thinking + agency",
      items: [
        {
          title: "How to Be More Agentic",
          url: "https://usefulfictions.substack.com/p/how-to-be-more-agentic",
        },
      ],
    },
    {
      category: "Product + craft",
      items: [
        {
          title: "Good Strategy Bad Strategy (book)",
          url: "https://www.goodreads.com/book/show/11721966-good-strategy-bad-strategy",
        },
        {
          title: "The Pragmatic Engineer (newsletter)",
          url: "https://newsletter.pragmaticengineer.com/",
        },
      ],
    },
    {
      category: "AI + systems",
      items: [
        {
          title: "The Black Swan (book)",
          url: "https://www.goodreads.com/book/show/242472.The_Black_Swan",
        },
        {
          title: "The Collapse of Complex Societies (book)",
          url: "https://www.goodreads.com/book/show/560912.The_Collapse_of_Complex_Societies",
        },
      ],
    },
    {
      category: "Personal finance",
      items: [
        {
          title: "Bogleheads wiki",
          url: "https://www.bogleheads.org/wiki/Main_Page",
        },
        {
          title: "Monarch Money",
          url: "https://www.monarchmoney.com/",
        },
      ],
    },
  ],
};

export const levels = [
  { id: "spawn", label: "Start" },
  { id: "about", label: "About" },
  { id: "writing", label: "Writing" },
  { id: "links", label: "Links" },
  { id: "subscribe", label: "Subscribe" },
] as const;

export type LevelId = (typeof levels)[number]["id"];
