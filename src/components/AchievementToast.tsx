"use client";

import { useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useAchievements } from "@/contexts/AchievementContext";

export function AchievementToast() {
  const { recentUnlock, dismissRecent } = useAchievements();
  const prefersReducedMotion = useReducedMotion();

  // Auto-dismiss after 4 seconds
  useEffect(() => {
    if (recentUnlock) {
      const timer = setTimeout(dismissRecent, 4000);
      return () => clearTimeout(timer);
    }
  }, [recentUnlock, dismissRecent]);

  return (
    <AnimatePresence>
      {recentUnlock && (
        <motion.div
          className="fixed top-20 left-1/2 z-[100] -translate-x-1/2"
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <div className="relative bg-[var(--panel)] border-2 border-[var(--accent)] pixel-corners px-6 py-4 shadow-[0_0_30px_rgba(110,231,255,0.3)]">
            {/* Corner decorations */}
            <div className="absolute top-0 left-0 w-2 h-2 bg-[var(--accent2)]" />
            <div className="absolute top-0 right-0 w-2 h-2 bg-[var(--accent2)]" />
            <div className="absolute bottom-0 left-0 w-2 h-2 bg-[var(--accent2)]" />
            <div className="absolute bottom-0 right-0 w-2 h-2 bg-[var(--accent2)]" />

            {/* Achievement unlocked header */}
            <motion.div
              className="text-center mb-2"
              animate={prefersReducedMotion ? {} : { scale: [1, 1.05, 1] }}
              transition={{ duration: 0.5, repeat: 2 }}
            >
              <span className="text-xs font-[family-name:var(--font-pixelify-sans)] text-[var(--accent2)] tracking-wider">
                ACHIEVEMENT UNLOCKED
              </span>
            </motion.div>

            {/* Achievement content */}
            <div className="flex items-center gap-4">
              <motion.span
                className="text-3xl"
                animate={prefersReducedMotion ? {} : { rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {recentUnlock.icon}
              </motion.span>
              <div>
                <h3 className="font-[family-name:var(--font-pixelify-sans)] text-lg text-[var(--text)]">
                  {recentUnlock.title}
                </h3>
                <p className="text-sm text-[var(--muted)]">
                  {recentUnlock.description}
                </p>
              </div>
            </div>

            {/* Dismiss button */}
            <button
              onClick={dismissRecent}
              className="absolute top-2 right-2 text-[var(--muted)] hover:text-[var(--text)] transition-colors"
              aria-label="Dismiss"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 2L10 10M10 2L2 10" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
