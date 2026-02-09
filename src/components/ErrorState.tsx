"use client";

import { PixelButton } from "./PixelButton";
import { PixelCard } from "./PixelCard";
import { site } from "@/content/site";

interface ErrorStateProps {
  type: "fetch-failed" | "no-posts" | "not-found";
  onRetry?: () => void;
}

const errorContent = {
  "fetch-failed": {
    title: "Signal lost",
    body: "I couldn't reach Substack right now. Try again in a moment.",
    action: "Retry",
    actionType: "retry" as const,
  },
  "no-posts": {
    title: "No posts yet",
    body: "New writing lands on Substack first. Check back soon.",
    action: "Visit Substack",
    actionType: "external" as const,
  },
  "not-found": {
    title: "404: Empty room",
    body: "You found a door that doesn't go anywhere.",
    action: "Return home",
    actionType: "internal" as const,
  },
};

export function ErrorState({ type, onRetry }: ErrorStateProps) {
  const content = errorContent[type];

  return (
    <PixelCard hover={false} className="text-center py-12">
      <h2 className="font-[family-name:var(--font-pixelify-sans)] text-xl text-[var(--accent)] mb-2">
        {content.title}
      </h2>
      <p className="text-[var(--muted)] mb-6">{content.body}</p>

      {content.actionType === "retry" && onRetry && (
        <PixelButton onClick={onRetry} variant="primary">
          {content.action}
        </PixelButton>
      )}

      {content.actionType === "external" && (
        <PixelButton href={site.links.substack} external variant="primary">
          {content.action}
        </PixelButton>
      )}

      {content.actionType === "internal" && (
        <PixelButton href="/game" variant="primary">
          {content.action}
        </PixelButton>
      )}
    </PixelCard>
  );
}
