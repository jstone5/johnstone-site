"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useIsClient } from "@/lib/hooks";

interface TransitionOverlayProps {
  isActive: boolean;
}

export function TransitionOverlay({ isActive }: TransitionOverlayProps) {
  const isClient = useIsClient();
  const [showOverlay, setShowOverlay] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!isClient || prefersReducedMotion) return;

    if (isActive) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowOverlay(true);
      const timer = setTimeout(() => {
        setShowOverlay(false);
      }, 240);
      return () => clearTimeout(timer);
    }
  }, [isActive, isClient, prefersReducedMotion]);

  // Don't render on mobile or if reduced motion
  if (!isClient || prefersReducedMotion) return null;

  return (
    <AnimatePresence>
      {showOverlay && (
        <motion.div
          className="fixed inset-0 z-[9990] pointer-events-none hidden lg:block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.08 }}
        >
          {/* Scanline flash effect */}
          <div className="absolute inset-0 bg-[var(--accent)]/5 crt-flicker" />

          {/* Horizontal line sweep */}
          <motion.div
            className="absolute left-0 right-0 h-[2px] bg-[var(--accent)]/40"
            initial={{ top: "0%" }}
            animate={{ top: "100%" }}
            transition={{ duration: 0.24, ease: "linear" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
