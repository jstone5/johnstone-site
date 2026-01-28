"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { useSound } from "./SoundContext";

// XP thresholds for each level
const LEVEL_THRESHOLDS = [
  0,      // Level 1: 0 XP
  50,     // Level 2: 50 XP
  150,    // Level 3: 150 XP
  300,    // Level 4: 300 XP
  500,    // Level 5: 500 XP
  750,    // Level 6: 750 XP
  1000,   // Level 7: 1000 XP
  1500,   // Level 8: 1500 XP
  2000,   // Level 9: 2000 XP
  3000,   // Level 10: 3000 XP (Max)
];

// XP rewards for different actions
export const XP_REWARDS = {
  visitLevel: 10,
  readPost: 25,
  unlockAchievement: 50,
  findSecret: 100,
  konamiCode: 200,
  firstVisit: 15,
} as const;

interface XPState {
  totalXP: number;
  level: number;
  xpToNextLevel: number;
  xpInCurrentLevel: number;
  isMaxLevel: boolean;
  recentGains: Array<{ amount: number; reason: string; timestamp: number }>;
}

interface XPContextValue extends XPState {
  addXP: (amount: number, reason: string) => void;
  getProgressPercent: () => number;
}

const XPContext = createContext<XPContextValue | null>(null);

function calculateLevel(xp: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      return i + 1;
    }
  }
  return 1;
}

function getXPForLevel(level: number): number {
  return LEVEL_THRESHOLDS[level - 1] || 0;
}

function getXPToNextLevel(level: number): number {
  if (level >= LEVEL_THRESHOLDS.length) return 0;
  return LEVEL_THRESHOLDS[level] - LEVEL_THRESHOLDS[level - 1];
}

export function XPProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<XPState>({
    totalXP: 0,
    level: 1,
    xpToNextLevel: LEVEL_THRESHOLDS[1],
    xpInCurrentLevel: 0,
    isMaxLevel: false,
    recentGains: [],
  });
  const [isInitialized, setIsInitialized] = useState(false);
  const [pendingLevelUp, setPendingLevelUp] = useState<number | null>(null);
  const { play } = useSound();

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const saved = localStorage.getItem("johnstone-xp");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const level = calculateLevel(parsed.totalXP);
        const xpForCurrentLevel = getXPForLevel(level);
        const xpToNext = getXPToNextLevel(level);

        setState({
          totalXP: parsed.totalXP,
          level,
          xpToNextLevel: xpToNext,
          xpInCurrentLevel: parsed.totalXP - xpForCurrentLevel,
          isMaxLevel: level >= LEVEL_THRESHOLDS.length,
          recentGains: [],
        });
      } catch {
        // Invalid data, start fresh
      }
    }
    setIsInitialized(true);
  }, []);

  // Save to localStorage when XP changes
  useEffect(() => {
    if (!isInitialized || typeof window === "undefined") return;
    localStorage.setItem("johnstone-xp", JSON.stringify({ totalXP: state.totalXP }));
  }, [state.totalXP, isInitialized]);

  // Handle level up effects
  useEffect(() => {
    if (pendingLevelUp !== null) {
      play("achievement"); // Use achievement sound for level up
      // Dispatch custom event for level up overlay
      window.dispatchEvent(new CustomEvent("levelup", { detail: { level: pendingLevelUp } }));
      setPendingLevelUp(null);
    }
  }, [pendingLevelUp, play]);

  const addXP = useCallback((amount: number, reason: string) => {
    play("xpGain"); // Play XP gain sound

    setState((prev) => {
      const newTotalXP = prev.totalXP + amount;
      const newLevel = calculateLevel(newTotalXP);
      const xpForCurrentLevel = getXPForLevel(newLevel);
      const xpToNext = getXPToNextLevel(newLevel);

      // Check for level up
      if (newLevel > prev.level) {
        setPendingLevelUp(newLevel);
      }

      // Add to recent gains (keep last 5)
      const newGains = [
        { amount, reason, timestamp: Date.now() },
        ...prev.recentGains,
      ].slice(0, 5);

      return {
        totalXP: newTotalXP,
        level: newLevel,
        xpToNextLevel: xpToNext,
        xpInCurrentLevel: newTotalXP - xpForCurrentLevel,
        isMaxLevel: newLevel >= LEVEL_THRESHOLDS.length,
        recentGains: newGains,
      };
    });
  }, [play]);

  const getProgressPercent = useCallback(() => {
    if (state.isMaxLevel) return 100;
    if (state.xpToNextLevel === 0) return 0;
    return Math.min(100, (state.xpInCurrentLevel / state.xpToNextLevel) * 100);
  }, [state.isMaxLevel, state.xpInCurrentLevel, state.xpToNextLevel]);

  return (
    <XPContext.Provider value={{ ...state, addXP, getProgressPercent }}>
      {children}
    </XPContext.Provider>
  );
}

export function useXP() {
  const context = useContext(XPContext);
  if (!context) {
    throw new Error("useXP must be used within XPProvider");
  }
  return context;
}
