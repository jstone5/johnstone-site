"use client";

import { useEffect, useRef } from "react";
import { useAchievements } from "@/contexts/AchievementContext";
import { useXP, XP_REWARDS } from "@/contexts/XPContext";

interface PostTrackerProps {
  slug: string;
  title: string;
}

export function PostTracker({ slug, title }: PostTrackerProps) {
  const { visitPost, visitedPosts } = useAchievements();
  const { addXP } = useXP();
  const hasTracked = useRef(false);

  useEffect(() => {
    // Only track once per page load, and only if not already visited
    if (hasTracked.current) return;
    hasTracked.current = true;

    // Small delay to ensure page is actually being read
    const timeout = setTimeout(() => {
      const wasAlreadyVisited = visitedPosts.has(slug);
      visitPost(slug);

      // Grant XP only for first-time reads
      if (!wasAlreadyVisited) {
        addXP(XP_REWARDS.readPost, `Read "${title}"`);
      }
    }, 2000); // 2 second delay to count as "reading"

    return () => clearTimeout(timeout);
  }, [slug, title, visitPost, visitedPosts, addXP]);

  return null;
}
