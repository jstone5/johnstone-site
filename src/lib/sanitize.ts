import sanitizeHtml from "sanitize-html";

const allowedTags = [
  "p",
  "br",
  "hr",
  "h1",
  "h2",
  "h3",
  "h4",
  "ul",
  "ol",
  "li",
  "blockquote",
  "strong",
  "em",
  "code",
  "pre",
  "a",
  "img",
];

const allowedAttributes: Record<string, string[]> = {
  a: ["href", "title"],
  img: ["src", "alt", "title", "width", "height"],
};

export function sanitizeContent(html: string): string {
  return sanitizeHtml(html, {
    allowedTags,
    allowedAttributes,
    transformTags: {
      a: (tagName, attribs) => {
        // Add target and rel to external links
        const href = attribs.href || "";
        const isExternal =
          href.startsWith("http://") || href.startsWith("https://");

        return {
          tagName,
          attribs: {
            ...attribs,
            ...(isExternal
              ? {
                  target: "_blank",
                  rel: "noopener noreferrer",
                }
              : {}),
          },
        };
      },
    },
  });
}
