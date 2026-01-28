"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useXP } from "@/contexts/XPContext";

export function XPBar() {
  const { level, totalXP, xpInCurrentLevel, xpToNextLevel, isMaxLevel, getProgressPercent, recentGains } = useXP();
  const [showGain, setShowGain] = useState<{ amount: number; reason: string } | null>(null);
  const [lastGainTimestamp, setLastGainTimestamp] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  // Show XP gain popup
  useEffect(() => {
    if (recentGains.length > 0 && recentGains[0].timestamp > lastGainTimestamp) {
      const gain = recentGains[0];
      setLastGainTimestamp(gain.timestamp);
      setShowGain({ amount: gain.amount, reason: gain.reason });

      const timeout = setTimeout(() => setShowGain(null), 2000);
      return () => clearTimeout(timeout);
    }
  }, [recentGains, lastGainTimestamp]);

  const progressPercent = getProgressPercent();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:left-24 pointer-events-none">
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
