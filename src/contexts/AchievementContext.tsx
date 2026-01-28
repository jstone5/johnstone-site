"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import {
  type AchievementId,
  type Achievement,
  getAchievement,
  loadAchievements,
  saveAchievements,
  loadVisitedLevels,
  saveVisitedLevels,
  loadVisitedPosts,
  saveVisitedPosts,
} from "@/lib/achievements";
import { useSound } from "./SoundContext";

interface AchievementContextType {
  unlockedAchievements: Set<AchievementId>;
  visitedLevels: Set<string>;
  visitedPosts: Set<string>;
  unlock: (id: AchievementId) => void;
  visitLevel: (levelId: string) => void;
  visitPost: (postSlug: string) => void;
  isUnlocked: (id: AchievementId) => boolean;
  recentUnlock: Achievement | null;
  dismissRecent: () => void;
  totalPosts: number;
  setTotalPosts: (count: number) => void;
}

const AchievementContext = createContext<AchievementContextType | null>(null);

export function AchievementProvider({ children }: { children: ReactNode }) {
  const [unlockedAchievements, setUnlockedAchievements] = useState<Set<AchievementId>>(
    new Set()
  );
  const [visitedLevels, setVisitedLevels] = useState<Set<string>>(new Set());
  const [visitedPosts, setVisitedPosts] = useState<Set<string>>(new Set());
  const [recentUnlock, setRecentUnlock] = useState<Achievement | null>(null);
  const [totalPosts, setTotalPosts] = useState(0);
  const { play } = useSound();

  // Load from localStorage on mount
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUnlockedAchievements(loadAchievements());
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisitedLevels(loadVisitedLevels());
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisitedPosts(loadVisitedPosts());

    // Check for night owl achievement
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 5) {
      const stored = loadAchievements();
      if (!stored.has("night_owl")) {
        // Will unlock via the unlock function
        setTimeout(() => {
          setUnlockedAchievements((prev) => {
            if (!prev.has("night_owl")) {
              const next = new Set(prev);
              next.add("night_owl");
              saveAchievements(next);
              const achievement = getAchievement("night_owl");
              if (achievement) {
                setRecentUnlock(achievement);
                play("achievement");
              }
              return next;
            }
            return prev;
          });
        }, 2000);
      }
    }
  }, [play]);

  const unlock = useCallback(
    (id: AchievementId) => {
      setUnlockedAchievements((prev) => {
        if (prev.has(id)) return prev;

        const next = new Set(prev);
        next.add(id);
        saveAchievements(next);

        const achievement = getAchievement(id);
        if (achievement) {
          setRecentUnlock(achievement);
          play("achievement");
        }

        return next;
      });
    },
    [play]
  );

  const visitLevel = useCallback(
    (levelId: string) => {
      setVisitedLevels((prev) => {
        const next = new Set(prev);
        next.add(levelId);
        saveVisitedLevels(next);

        // Check for first_steps (anything other than spawn)
        if (levelId !== "spawn" && !unlockedAchievements.has("first_steps")) {
          unlock("first_steps");
        }

        // Check for explorer (all 6 levels)
        if (next.size >= 6 && !unlockedAchievements.has("explorer")) {
          unlock("explorer");
        }

        return next;
      });
    },
    [unlock, unlockedAchievements]
  );

  const visitPost = useCallback(
    (postSlug: string) => {
      setVisitedPosts((prev) => {
        const next = new Set(prev);
        next.add(postSlug);
        saveVisitedPosts(next);

        // Check for deep_dive
        if (!unlockedAchievements.has("deep_dive")) {
          unlock("deep_dive");
        }

        // Check for completionist
        if (totalPosts > 0 && next.size >= totalPosts && !unlockedAchievements.has("completionist")) {
          unlock("completionist");
        }

        return next;
      });
    },
    [unlock, unlockedAchievements, totalPosts]
  );

  const isUnlocked = useCallback(
    (id: AchievementId) => unlockedAchievements.has(id),
    [unlockedAchievements]
  );

  const dismissRecent = useCallback(() => {
    setRecentUnlock(null);
  }, []);

  return (
    <AchievementContext.Provider
      value={{
        unlockedAchievements,
        visitedLevels,
        visitedPosts,
        unlock,
        visitLevel,
        visitPost,
        isUnlocked,
        recentUnlock,
        dismissRecent,
        totalPosts,
        setTotalPosts,
      }}
    >
      {children}
    </AchievementContext.Provider>
  );
}

export function useAchievements() {
  const context = useContext(AchievementContext);
  if (!context) {
    throw new Error("useAchievements must be used within an AchievementProvider");
  }
  return context;
}
