"use client";

import { forwardRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { LevelId } from "@/content/site";

interface LevelSectionProps {
  id: LevelId;
  children: React.ReactNode;
  className?: string;
  isActive?: boolean;
  immersive?: boolean;
}

export const LevelSection = forwardRef<HTMLElement, LevelSectionProps>(
  function LevelSection({ id, children, className = "", isActive, immersive }, ref) {
    const prefersReducedMotion = useReducedMotion();

    // Immersive mode: full screen, no padding, no max-width constraints
    if (immersive) {
      return (
        <section
          ref={ref}
          id={id}
          data-level={id}
          className={`level-section min-h-screen relative ${className}`}
        >
          {children}
        </section>
      );
    }

    // Standard section layout
    return (
      <section
        ref={ref}
        id={id}
        data-level={id}
        className={`level-section flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-16 sm:py-24 ${className}`}
      >
        <motion.div
          className="max-w-4xl mx-auto w-full"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 8 }}
          animate={
            isActive
              ? { opacity: 1, y: 0 }
              : prefersReducedMotion
                ? {}
                : { opacity: 0.7, y: 0 }
          }
          transition={{ duration: 0.24, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </section>
    );
  }
);
