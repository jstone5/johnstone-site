"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useXP } from "@/contexts/XPContext";

export function XPBar() {
  const { level, totalXP, xpInCurrentLevel, xpToNextLevel, isMaxLevel, getProgressPercent, recentGains } = useXP();
  const [showGain, setShowGain] = useState<{ amount: number; reason: string } | null>(null);
  const lastProcessedTimestamp = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prefersReducedMotion = useReducedMotion();

  // Stable function to hide the toast
  const hideToast = useCallback(() => {
    setShowGain(null);
    timeoutRef.current = null;
  }, []);

  // Show XP gain popup with proper cleanup
  useEffect(() => {
    // Check if there's a new gain we haven't processed
    if (recentGains.length > 0) {
      const latestGain = recentGains[0];

      if (latestGain.timestamp > lastProcessedTimestamp.current) {
        // New gain detected - update our tracking ref
        lastProcessedTimestamp.current = latestGain.timestamp;

        // Clear any existing timeout first
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }

        // Show the toast
        setShowGain({ amount: latestGain.amount, reason: latestGain.reason });

        // Set timeout to hide after 3 seconds
        timeoutRef.current = setTimeout(hideToast, 3000);
      }
    }
  }, [recentGains, hideToast]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const progressPercent = getProgressPercent();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:left-48 pointer-events-none">
      {/* XP Gain popup */}
      <AnimatePresence>
        {showGain && (
          <motion.div
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute bottom-16 left-1/2 -translate-x-1/2 pointer-events-none"
          >
            <div className="px-4 py-2 bg-[var(--accent)]/20 border border-[var(--accent)] pixel-corners text-center">
              <span className="text-[var(--accent)] font-[family-name:var(--font-pixelify-sans)] text-lg">
                +{showGain.amount} XP
              </span>
              <span className="block text-xs text-[var(--muted)]">{showGain.reason}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main XP Bar */}
      <div className="bg-[var(--bg)]/90 backdrop-blur-sm border-t border-[var(--border)] px-4 py-2 pointer-events-auto">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          {/* Level badge */}
          <div className="flex items-center gap-2">
            <motion.div
              className="w-10 h-10 bg-[var(--panel)] border-2 border-[var(--accent)] pixel-corners flex items-center justify-center"
              whileHover={prefersReducedMotion ? {} : { scale: 1.1 }}
            >
              <span className="font-[family-name:var(--font-pixelify-sans)] text-[var(--accent)] text-lg">
                {level}
              </span>
            </motion.div>
            <div className="hidden sm:block">
              <p className="text-xs text-[var(--muted)]">Level</p>
              <p className="text-sm font-[family-name:var(--font-pixelify-sans)] text-[var(--text)]">
                {getLevelTitle(level)}
              </p>
            </div>
          </div>

          {/* XP Progress bar */}
          <div className="flex-1">
            <div className="flex justify-between text-xs text-[var(--muted)] mb-1">
              <span>XP</span>
              <span>
                {isMaxLevel ? (
                  "MAX LEVEL"
                ) : (
                  `${xpInCurrentLevel} / ${xpToNextLevel}`
                )}
              </span>
            </div>
            <div className="h-3 bg-[var(--panel)] border border-[var(--border)] pixel-corners-sm overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent2)]"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
              />
            </div>
          </div>

          {/* Total XP */}
          <div className="text-right hidden sm:block">
            <p className="text-xs text-[var(--muted)]">Total</p>
            <p className="font-[family-name:var(--font-pixelify-sans)] text-[var(--accent2)]">
              {totalXP.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function getLevelTitle(level: number): string {
  const titles = [
    "Visitor",           // 1
    "Explorer",          // 2
    "Reader",            // 3
    "Curious Mind",      // 4
    "Knowledge Seeker",  // 5
    "Dedicated Fan",     // 6
    "Site Veteran",      // 7
    "Power User",        // 8
    "Completionist",     // 9
    "Legend",            // 10
  ];
  return titles[level - 1] || "Unknown";
}
