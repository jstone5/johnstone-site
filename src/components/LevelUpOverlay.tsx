"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const LEVEL_TITLES = [
  "Visitor",
  "Explorer",
  "Reader",
  "Curious Mind",
  "Knowledge Seeker",
  "Dedicated Fan",
  "Site Veteran",
  "Power User",
  "Completionist",
  "Legend",
];

export function LevelUpOverlay() {
  const [levelUpData, setLevelUpData] = useState<{ level: number } | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const handleLevelUp = useCallback((event: CustomEvent<{ level: number }>) => {
    setLevelUpData(event.detail);
    setIsVisible(true);
  }, []);

  useEffect(() => {
    window.addEventListener("levelup", handleLevelUp as EventListener);
    return () => window.removeEventListener("levelup", handleLevelUp as EventListener);
  }, [handleLevelUp]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => setLevelUpData(null), 500);
  };

  // Auto-dismiss after 4 seconds
  useEffect(() => {
    if (isVisible) {
      const timeout = setTimeout(handleDismiss, 4000);
      return () => clearTimeout(timeout);
    }
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && levelUpData && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Background flash */}
          <motion.div
            className="absolute inset-0 bg-[var(--accent)]/20"
            initial={{ opacity: 0 }}
            animate={prefersReducedMotion ? { opacity: 0.2 } : { opacity: [0, 0.4, 0.2, 0.3, 0.1] }}
            transition={{ duration: 0.6 }}
          />

          {/* Particle burst effect */}
          {!prefersReducedMotion && (
            <div className="absolute inset-0 overflow-hidden">
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-[var(--accent)]"
                  style={{
                    left: "50%",
                    top: "50%",
                  }}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{
                    x: Math.cos((i / 20) * Math.PI * 2) * 300,
                    y: Math.sin((i / 20) * Math.PI * 2) * 300,
                    opacity: 0,
                    scale: 0,
                  }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              ))}
            </div>
          )}

          {/* Main content */}
          <motion.div
            className="relative text-center pointer-events-auto"
            initial={prefersReducedMotion ? { opacity: 0 } : { scale: 0.5, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { scale: 0.8, opacity: 0, y: -50 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            onClick={handleDismiss}
          >
            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 bg-[var(--accent)] blur-3xl opacity-30"
              animate={prefersReducedMotion ? {} : { scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            {/* Content box */}
            <div className="relative bg-[var(--panel)] border-4 border-[var(--accent)] pixel-corners px-12 py-8">
              {/* Corner decorations */}
              <div className="absolute -top-1 -left-1 w-4 h-4 border-t-4 border-l-4 border-[var(--accent2)]" />
              <div className="absolute -top-1 -right-1 w-4 h-4 border-t-4 border-r-4 border-[var(--accent2)]" />
              <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-4 border-l-4 border-[var(--accent2)]" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-4 border-r-4 border-[var(--accent2)]" />

              <motion.p
                className="text-[var(--accent2)] font-[family-name:var(--font-pixelify-sans)] text-sm tracking-widest mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                ★ LEVEL UP! ★
              </motion.p>

              <motion.div
                className="text-[var(--accent)] font-[family-name:var(--font-pixelify-sans)] text-6xl sm:text-7xl mb-2"
                initial={prefersReducedMotion ? {} : { scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 10, delay: 0.3 }}
              >
                {levelUpData.level}
              </motion.div>

              <motion.p
                className="text-[var(--text)] font-[family-name:var(--font-pixelify-sans)] text-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {LEVEL_TITLES[levelUpData.level - 1]}
              </motion.p>

              <motion.p
                className="text-[var(--muted)] text-sm mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                Click to continue
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
