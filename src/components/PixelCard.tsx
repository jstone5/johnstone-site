"use client";

import { motion, useReducedMotion } from "framer-motion";

interface PixelCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}

export function PixelCard({
  children,
  className = "",
  hover = true,
  glow = false,
}: PixelCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const baseStyles =
    "bg-[var(--panel)] border border-[var(--border)] pixel-corners p-6 card-shine";
  const glowStyles = glow ? "glow-accent" : "";

  if (!hover) {
    return <div className={`${baseStyles} ${glowStyles} ${className}`}>{children}</div>;
  }

  return (
    <motion.div
      className={`${baseStyles} ${glowStyles} ${className}`}
      whileHover={prefersReducedMotion ? {} : {
        y: -2,
        borderColor: "var(--border-active)",
        boxShadow: "0 0 20px rgba(110, 231, 255, 0.2), 0 0 40px rgba(110, 231, 255, 0.1)",
      }}
      transition={{ type: "spring" as const, stiffness: 400, damping: 17 }}
    >
      {children}
    </motion.div>
  );
}
