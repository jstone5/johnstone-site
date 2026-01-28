"use client";

import { motion, useReducedMotion } from "framer-motion";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "card" | "avatar" | "button";
}

export function Skeleton({ className = "", variant = "text" }: SkeletonProps) {
  const prefersReducedMotion = useReducedMotion();

  const baseStyles = "bg-[var(--panel2)] rounded";

  const variantStyles = {
    text: "h-4 w-full",
    card: "h-32 w-full pixel-corners",
    avatar: "h-12 w-12 rounded-full",
    button: "h-12 w-32 pixel-corners",
  };

  return (
    <motion.div
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      animate={
        prefersReducedMotion
          ? {}
          : {
              opacity: [0.5, 0.8, 0.5],
            }
      }
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut" as const,
      }}
    />
  );
}

export function PostCardSkeleton() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="bg-[var(--panel)] border border-[var(--border)] pixel-corners p-6">
      <motion.div
        className="space-y-3"
        animate={prefersReducedMotion ? {} : { opacity: [0.5, 0.8, 0.5] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut" as const,
        }}
      >
        <div className="h-5 bg-[var(--panel2)] rounded w-3/4" />
        <div className="h-4 bg-[var(--panel2)] rounded w-full" />
        <div className="h-4 bg-[var(--panel2)] rounded w-5/6" />
      </motion.div>
    </div>
  );
}

export function WritingGridSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <PostCardSkeleton />
      <PostCardSkeleton />
      <PostCardSkeleton />
      <PostCardSkeleton />
    </div>
  );
}
