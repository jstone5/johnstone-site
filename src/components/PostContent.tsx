"use client";

import { useMemo } from "react";
import parse, { HTMLReactParserOptions, Element } from "html-react-parser";
import { Tweet } from "react-tweet";
import { sanitizeContent } from "@/lib/sanitize";
import { isTweetUrl } from "@/lib/tweets";

interface PostContentProps {
  html: string;
}

export function PostContent({ html }: PostContentProps) {
  const content = useMemo(() => {
    const sanitized = sanitizeContent(html);

    const options: HTMLReactParserOptions = {
      replace: (domNode) => {
        if (domNode instanceof Element && domNode.name === "a") {
          const href = domNode.attribs.href;
          const tweetId = isTweetUrl(href);

          if (tweetId) {
            return (
              <div className="my-6 flex justify-center">
                <Tweet id={tweetId} />
              </div>
            );
          }

          // Check if the link contains only the URL as text (likely a standalone tweet link)
          const children = domNode.children;
          if (children.length === 1) {
            const child = children[0];
            if (
              child.type === "text" &&
              "data" in child &&
              typeof child.data === "string"
            ) {
              const textTweetId = isTweetUrl(child.data);
              if (textTweetId) {
                return (
                  <div className="my-6 flex justify-center">
                    <Tweet id={textTweetId} />
                  </div>
                );
              }
            }
          }
        }

        // Handle images with responsive styling
        if (domNode instanceof Element && domNode.name === "img") {
          const { src, alt, title } = domNode.attribs;
          return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt={alt || ""}
              title={title}
              className="max-w-full h-auto rounded my-6"
              loading="lazy"
            />
          );
        }

        return undefined;
      },
    };

    return parse(sanitized, options);
  }, [html]);

  return <div className="post-content">{content}</div>;
}
