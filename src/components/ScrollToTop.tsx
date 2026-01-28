"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when scrolled past 400px
      setIsVisible(window.scrollY > 400);
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }, [prefersReducedMotion]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          transition={{ duration: 0.2, ease: "easeOut" as const }}
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-[var(--panel)] border border-[var(--border)] pixel-corners flex items-center justify-center text-[var(--accent)] hover:text-[var(--accent2)] hover:border-[var(--accent)] hover:shadow-[0_0_15px_rgba(110,231,255,0.2)] transition-all lg:bottom-8 lg:right-8"
          aria-label="Scroll to top"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="transform -translate-y-px"
          >
            <path
              d="M10 4L10 16M10 4L5 9M10 4L15 9"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="square"
            />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
