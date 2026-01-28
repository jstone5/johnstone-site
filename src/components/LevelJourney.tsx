"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useReducedMotion } from "framer-motion";
import { levels, type LevelId } from "@/content/site";
import { LevelSection } from "./LevelSection";
import { LevelTracker } from "./LevelTracker";
import { StartOverlay } from "./StartOverlay";
import { TransitionOverlay } from "./TransitionOverlay";
import { SpawnLevel } from "./levels/SpawnLevel";
import { AboutLevel } from "./levels/AboutLevel";
import { WorkLevel } from "./levels/WorkLevel";
import { WritingLevel } from "./levels/WritingLevel";
import { LinksLevel } from "./levels/LinksLevel";
import { SubscribeLevel } from "./levels/SubscribeLevel";
import { useAchievements } from "@/contexts/AchievementContext";
import type { Post } from "@/lib/substack";

interface LevelJourneyProps {
  featuredPosts?: Post[];
}

export function LevelJourney({ featuredPosts = [] }: LevelJourneyProps) {
  const [activeLevel, setActiveLevel] = useState<LevelId>("spawn");
  const [transitionActive, setTransitionActive] = useState(false);
  const sectionRefs = useRef<Map<LevelId, HTMLElement>>(new Map());
  const prefersReducedMotion = useReducedMotion();
  const { visitLevel, unlock } = useAchievements();
  const hasUsedKeyboard = useRef(false);

  const handleLevelClick = useCallback(
    (levelId: LevelId) => {
      const section = sectionRefs.current.get(levelId);
      if (section) {
        section.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
          block: "start",
        });
      }
    },
    [prefersReducedMotion]
  );

  const setSectionRef = useCallback(
    (levelId: LevelId) => (el: HTMLElement | null) => {
      if (el) {
        sectionRefs.current.set(levelId, el);
      }
    },
    []
  );

  // Intersection Observer for active section detection
  useEffect(() => {
    const sections = Array.from(sectionRefs.current.entries());

    const observer = new IntersectionObserver(
      (entries) => {
        let maxRatio = 0;
        let activeSection: LevelId | null = null;

        entries.forEach((entry) => {
          if (entry.intersectionRatio >= 0.55 && entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            activeSection = entry.target.getAttribute("data-level") as LevelId;
          }
        });

        if (!activeSection) {
          entries.forEach((entry) => {
            if (entry.intersectionRatio >= 0.25 && entry.intersectionRatio > maxRatio) {
              maxRatio = entry.intersectionRatio;
              activeSection = entry.target.getAttribute("data-level") as LevelId;
            }
          });
        }

        if (activeSection) {
          setTransitionActive(true);
          setActiveLevel(activeSection);
          visitLevel(activeSection); // Track for achievements
          if (typeof window !== "undefined") {
            history.replaceState(null, "", `#${activeSection}`);
          }
          setTimeout(() => setTransitionActive(false), 50);
        }
      },
      {
        threshold: [0.0, 0.25, 0.55, 0.8],
        rootMargin: "-64px 0px 0px 0px",
      }
    );

    sections.forEach(([, element]) => {
      observer.observe(element);
    });

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle initial hash on mount
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      const hash = window.location.hash.slice(1) as LevelId;
      if (levels.some((l) => l.id === hash)) {
        setActiveLevel(hash);
        setTimeout(() => handleLevelClick(hash), 100);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keyboard navigation (arrow keys and j/k for vim-style)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't interfere with input elements
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      const levelIds = levels.map((l) => l.id);
      const currentIndex = levelIds.indexOf(activeLevel);

      let nextIndex: number | null = null;

      // Navigate to next level (down arrow, j, or PageDown)
      if (e.key === "ArrowDown" || e.key === "j" || e.key === "PageDown") {
        if (currentIndex < levelIds.length - 1) {
          nextIndex = currentIndex + 1;
        }
      }
      // Navigate to previous level (up arrow, k, or PageUp)
      else if (e.key === "ArrowUp" || e.key === "k" || e.key === "PageUp") {
        if (currentIndex > 0) {
          nextIndex = currentIndex - 1;
        }
      }
      // Go to first level (Home)
      else if (e.key === "Home") {
        nextIndex = 0;
      }
      // Go to last level (End)
      else if (e.key === "End") {
        nextIndex = levelIds.length - 1;
      }
      // Number keys 1-6 for direct navigation
      else if (e.key >= "1" && e.key <= "6") {
        const levelIndex = parseInt(e.key) - 1;
        if (levelIndex < levelIds.length) {
          nextIndex = levelIndex;
        }
      }

      if (nextIndex !== null && nextIndex !== currentIndex) {
        e.preventDefault();
        handleLevelClick(levelIds[nextIndex]);

        // Unlock secret_keys achievement on first keyboard navigation
        if (!hasUsedKeyboard.current) {
          hasUsedKeyboard.current = true;
          unlock("secret_keys");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeLevel, handleLevelClick, unlock]);

  return (
    <>
      <StartOverlay />
      <TransitionOverlay isActive={transitionActive} />
      <LevelTracker activeLevel={activeLevel} onLevelClick={handleLevelClick} />

      <div className="pt-14 lg:pl-24 pb-16 lg:pb-0">
        <LevelSection
          ref={setSectionRef("spawn")}
          id="spawn"
          isActive={activeLevel === "spawn"}
        >
          <SpawnLevel />
        </LevelSection>

        <LevelSection
          ref={setSectionRef("about")}
          id="about"
          isActive={activeLevel === "about"}
          className="bg-[var(--panel)]/30"
        >
          <AboutLevel />
        </LevelSection>

        <LevelSection
          ref={setSectionRef("work")}
          id="work"
          isActive={activeLevel === "work"}
        >
          <WorkLevel />
        </LevelSection>

        <LevelSection
          ref={setSectionRef("writing")}
          id="writing"
          isActive={activeLevel === "writing"}
          className="bg-[var(--panel)]/30"
        >
          <WritingLevel featuredPosts={featuredPosts} />
        </LevelSection>

        <LevelSection
          ref={setSectionRef("links")}
          id="links"
          isActive={activeLevel === "links"}
        >
          <LinksLevel />
        </LevelSection>

        <LevelSection
          ref={setSectionRef("subscribe")}
          id="subscribe"
          isActive={activeLevel === "subscribe"}
          className="bg-[var(--panel)]/30"
        >
          <SubscribeLevel />
        </LevelSection>
      </div>
    </>
  );
}
