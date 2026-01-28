"use client";

import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion";

export function ScrollProgress() {
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[var(--accent)] to-[var(--accent2)] origin-left z-[9999]"
      style={{
        scaleX: prefersReducedMotion ? scrollYProgress : scaleX,
        opacity: 0.9,
      }}
    />
  );
}
