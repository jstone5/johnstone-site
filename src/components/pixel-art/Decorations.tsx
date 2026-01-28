"use client";

import { motion, useReducedMotion } from "framer-motion";
import { type ReactNode } from "react";

// Color palette
const colors = {
  cyan1: "#4ECDC4",
  cyan2: "#6EE7E7",
  purple1: "#A855F7",
  purple2: "#C084FC",
  gold1: "#F59E0B",
  gold2: "#FBBF24",
  white: "#F8FAFC",
  gray1: "#CBD5E1",
  gray2: "#94A3B8",
  gray3: "#64748B",
  dark: "#1E293B",
};

type CornerPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";

interface CornerAccentProps {
  position: CornerPosition;
  color?: string;
  size?: number;
  animated?: boolean;
}

// Pixel corner accent
export function CornerAccent({
  position,
  color = colors.cyan1,
  size = 12,
  animated = false,
}: CornerAccentProps) {
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = animated && !prefersReducedMotion;

  const positionClasses: Record<CornerPosition, string> = {
    "top-left": "top-0 left-0",
    "top-right": "top-0 right-0",
    "bottom-left": "bottom-0 left-0",
    "bottom-right": "bottom-0 right-0",
  };

  const rotations: Record<CornerPosition, number> = {
    "top-left": 0,
    "top-right": 90,
    "bottom-left": 270,
    "bottom-right": 180,
  };

  const CornerSvg = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 6 6"
      style={{
        imageRendering: "pixelated",
        transform: `rotate(${rotations[position]}deg)`,
      }}
    >
      <rect x="0" y="0" width="6" height="2" fill={color} />
      <rect x="0" y="0" width="2" height="6" fill={color} />
      <rect x="2" y="2" width="2" height="2" fill={color} opacity="0.5" />
    </svg>
  );

  if (shouldAnimate) {
    return (
      <motion.div
        className={`absolute ${positionClasses[position]} pointer-events-none`}
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {CornerSvg}
      </motion.div>
    );
  }

  return (
    <div className={`absolute ${positionClasses[position]} pointer-events-none`}>
      {CornerSvg}
    </div>
  );
}

// All four corners
interface CornerSetProps {
  color?: string;
  size?: number;
  animated?: boolean;
}

export function CornerSet({ color, size, animated }: CornerSetProps) {
  return (
    <>
      <CornerAccent position="top-left" color={color} size={size} animated={animated} />
      <CornerAccent position="top-right" color={color} size={size} animated={animated} />
      <CornerAccent position="bottom-left" color={color} size={size} animated={animated} />
      <CornerAccent position="bottom-right" color={color} size={size} animated={animated} />
    </>
  );
}

// Pixel border frame
interface PixelFrameProps {
  children: ReactNode;
  className?: string;
  color?: string;
  glowColor?: string;
  animated?: boolean;
}

export function PixelFrame({
  children,
  className = "",
  color = colors.cyan1,
  glowColor,
  animated = false,
}: PixelFrameProps) {
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = animated && !prefersReducedMotion;

  return (
    <div
      className={`relative ${className}`}
      style={{
        boxShadow: glowColor ? `0 0 20px ${glowColor}40` : undefined,
      }}
    >
      {/* Border - top */}
      <div
        className="absolute top-0 left-3 right-3 h-1"
        style={{ backgroundColor: color }}
      />
      {/* Border - bottom */}
      <div
        className="absolute bottom-0 left-3 right-3 h-1"
        style={{ backgroundColor: color }}
      />
      {/* Border - left */}
      <div
        className="absolute top-3 bottom-3 left-0 w-1"
        style={{ backgroundColor: color }}
      />
      {/* Border - right */}
      <div
        className="absolute top-3 bottom-3 right-0 w-1"
        style={{ backgroundColor: color }}
      />

      {/* Corners */}
      <CornerSet color={color} size={12} animated={shouldAnimate} />

      {/* Content */}
      <div className="relative p-4">{children}</div>
    </div>
  );
}

// Horizontal pixel divider
interface DividerProps {
  color?: string;
  className?: string;
  variant?: "simple" | "decorated" | "gem";
}

export function PixelDivider({
  color = colors.cyan1,
  className = "",
  variant = "simple",
}: DividerProps) {
  if (variant === "simple") {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="flex-1 h-0.5" style={{ backgroundColor: color }} />
        <div className="w-2 h-2" style={{ backgroundColor: color }} />
        <div className="flex-1 h-0.5" style={{ backgroundColor: color }} />
      </div>
    );
  }

  if (variant === "decorated") {
    return (
      <div className={`flex items-center justify-center gap-1 ${className}`}>
        <div className="w-8 h-0.5" style={{ backgroundColor: color }} />
        <div className="w-1 h-1" style={{ backgroundColor: color }} />
        <div className="w-12 h-0.5" style={{ backgroundColor: color }} />
        <svg width="16" height="16" viewBox="0 0 8 8" style={{ imageRendering: "pixelated" }}>
          <rect x="3" y="0" width="2" height="2" fill={color} />
          <rect x="0" y="3" width="2" height="2" fill={color} />
          <rect x="6" y="3" width="2" height="2" fill={color} />
          <rect x="3" y="6" width="2" height="2" fill={color} />
          <rect x="3" y="3" width="2" height="2" fill={colors.gold1} />
        </svg>
        <div className="w-12 h-0.5" style={{ backgroundColor: color }} />
        <div className="w-1 h-1" style={{ backgroundColor: color }} />
        <div className="w-8 h-0.5" style={{ backgroundColor: color }} />
      </div>
    );
  }

  // Gem variant
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <div className="flex-1 max-w-24 h-0.5" style={{ backgroundColor: color }} />
      <svg width="24" height="16" viewBox="0 0 12 8" style={{ imageRendering: "pixelated" }}>
        {/* Gem shape */}
        <rect x="4" y="0" width="4" height="2" fill={colors.purple2} />
        <rect x="2" y="2" width="8" height="2" fill={colors.purple1} />
        <rect x="3" y="4" width="6" height="2" fill={colors.purple1} />
        <rect x="4" y="6" width="4" height="2" fill={colors.purple2} opacity="0.8" />
        {/* Highlight */}
        <rect x="4" y="2" width="2" height="2" fill={colors.white} opacity="0.4" />
      </svg>
      <div className="flex-1 max-w-24 h-0.5" style={{ backgroundColor: color }} />
    </div>
  );
}

// Pixel art badge/label
interface PixelBadgeProps {
  children: ReactNode;
  color?: string;
  textColor?: string;
  size?: "sm" | "md" | "lg";
  animated?: boolean;
}

export function PixelBadge({
  children,
  color = colors.purple1,
  textColor = colors.white,
  size = "md",
  animated = false,
}: PixelBadgeProps) {
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = animated && !prefersReducedMotion;

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-base",
  };

  const Badge = (
    <span
      className={`inline-flex items-center font-[family-name:var(--font-pixelify-sans)] ${sizeClasses[size]}`}
      style={{
        backgroundColor: color,
        color: textColor,
        clipPath: `polygon(
          4px 0,
          calc(100% - 4px) 0,
          100% 4px,
          100% calc(100% - 4px),
          calc(100% - 4px) 100%,
          4px 100%,
          0 calc(100% - 4px),
          0 4px
        )`,
      }}
    >
      {children}
    </span>
  );

  if (shouldAnimate) {
    return (
      <motion.div
        className="inline-block"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {Badge}
      </motion.div>
    );
  }

  return Badge;
}

// Pixel heart icon
interface HeartProps {
  size?: number;
  color?: string;
  filled?: boolean;
  animated?: boolean;
}

export function PixelHeart({ size = 16, color = colors.cyan1, filled = true, animated = false }: HeartProps) {
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = animated && !prefersReducedMotion;

  const Heart = (
    <svg width={size} height={size} viewBox="0 0 8 8" style={{ imageRendering: "pixelated" }}>
      {filled ? (
        <>
          <rect x="1" y="1" width="2" height="2" fill={color} />
          <rect x="5" y="1" width="2" height="2" fill={color} />
          <rect x="0" y="2" width="8" height="2" fill={color} />
          <rect x="1" y="4" width="6" height="2" fill={color} />
          <rect x="2" y="6" width="4" height="1" fill={color} />
          <rect x="3" y="7" width="2" height="1" fill={color} />
          {/* Highlight */}
          <rect x="1" y="2" width="1" height="1" fill={colors.white} opacity="0.5" />
        </>
      ) : (
        <>
          <rect x="1" y="1" width="2" height="1" fill={color} />
          <rect x="5" y="1" width="2" height="1" fill={color} />
          <rect x="0" y="2" width="1" height="2" fill={color} />
          <rect x="3" y="2" width="2" height="1" fill={color} />
          <rect x="7" y="2" width="1" height="2" fill={color} />
          <rect x="0" y="4" width="1" height="1" fill={color} />
          <rect x="7" y="4" width="1" height="1" fill={color} />
          <rect x="1" y="5" width="1" height="1" fill={color} />
          <rect x="6" y="5" width="1" height="1" fill={color} />
          <rect x="2" y="6" width="1" height="1" fill={color} />
          <rect x="5" y="6" width="1" height="1" fill={color} />
          <rect x="3" y="7" width="2" height="1" fill={color} />
        </>
      )}
    </svg>
  );

  if (shouldAnimate) {
    return (
      <motion.div
        className="inline-block"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 0.8, repeat: Infinity }}
      >
        {Heart}
      </motion.div>
    );
  }

  return Heart;
}

// Pixel sword icon
export function PixelSword({ size = 24, color = colors.gray1 }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" style={{ imageRendering: "pixelated" }}>
      {/* Blade */}
      <rect x="9" y="0" width="2" height="2" fill={color} />
      <rect x="8" y="1" width="2" height="2" fill={color} />
      <rect x="7" y="2" width="2" height="2" fill={color} />
      <rect x="6" y="3" width="2" height="2" fill={color} />
      <rect x="5" y="4" width="2" height="2" fill={color} />
      <rect x="4" y="5" width="2" height="2" fill={color} />
      {/* Highlight */}
      <rect x="9" y="0" width="1" height="1" fill={colors.white} opacity="0.5" />
      <rect x="8" y="1" width="1" height="1" fill={colors.white} opacity="0.3" />
      {/* Guard */}
      <rect x="2" y="6" width="4" height="2" fill={colors.gold1} />
      {/* Handle */}
      <rect x="2" y="8" width="2" height="3" fill={colors.gold2} />
      <rect x="1" y="10" width="4" height="2" fill={colors.gold1} />
    </svg>
  );
}

// Pixel shield icon
export function PixelShield({ size = 24, color = colors.cyan1 }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 12" style={{ imageRendering: "pixelated" }}>
      {/* Shield shape */}
      <rect x="1" y="0" width="8" height="2" fill={color} />
      <rect x="0" y="2" width="10" height="6" fill={color} />
      <rect x="1" y="8" width="8" height="2" fill={color} />
      <rect x="2" y="10" width="6" height="1" fill={color} />
      <rect x="3" y="11" width="4" height="1" fill={color} />
      {/* Border */}
      <rect x="1" y="0" width="1" height="2" fill={colors.gold1} />
      <rect x="8" y="0" width="1" height="2" fill={colors.gold1} />
      <rect x="0" y="2" width="1" height="6" fill={colors.gold1} />
      <rect x="9" y="2" width="1" height="6" fill={colors.gold1} />
      {/* Emblem */}
      <rect x="4" y="3" width="2" height="2" fill={colors.white} />
      <rect x="3" y="5" width="4" height="2" fill={colors.white} />
      <rect x="4" y="7" width="2" height="1" fill={colors.white} />
    </svg>
  );
}

// Pixel potion icon
export function PixelPotion({ size = 20, color = colors.purple1 }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 12" style={{ imageRendering: "pixelated" }}>
      {/* Cork */}
      <rect x="3" y="0" width="4" height="2" fill={colors.gold2} />
      {/* Neck */}
      <rect x="4" y="2" width="2" height="2" fill={colors.gray1} />
      {/* Body */}
      <rect x="2" y="4" width="6" height="2" fill={colors.gray1} />
      <rect x="1" y="6" width="8" height="4" fill={colors.gray1} />
      <rect x="2" y="10" width="6" height="2" fill={colors.gray1} />
      {/* Liquid */}
      <rect x="2" y="6" width="6" height="4" fill={color} />
      <rect x="2" y="10" width="6" height="1" fill={color} />
      {/* Highlight */}
      <rect x="2" y="6" width="1" height="2" fill={colors.white} opacity="0.4" />
      {/* Bubbles */}
      <rect x="5" y="7" width="1" height="1" fill={colors.white} opacity="0.5" />
      <rect x="3" y="9" width="1" height="1" fill={colors.white} opacity="0.5" />
    </svg>
  );
}

// Pixel coin icon
export function PixelCoin({ size = 16, animated = false }: { size?: number; animated?: boolean }) {
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = animated && !prefersReducedMotion;

  const Coin = (
    <svg width={size} height={size} viewBox="0 0 8 8" style={{ imageRendering: "pixelated" }}>
      <rect x="2" y="0" width="4" height="1" fill={colors.gold1} />
      <rect x="1" y="1" width="6" height="1" fill={colors.gold2} />
      <rect x="0" y="2" width="8" height="4" fill={colors.gold2} />
      <rect x="1" y="6" width="6" height="1" fill={colors.gold1} />
      <rect x="2" y="7" width="4" height="1" fill={colors.gold1} />
      {/* $ symbol */}
      <rect x="3" y="2" width="2" height="1" fill={colors.gold1} />
      <rect x="2" y="3" width="1" height="1" fill={colors.gold1} />
      <rect x="3" y="3" width="2" height="1" fill={colors.gold1} />
      <rect x="5" y="4" width="1" height="1" fill={colors.gold1} />
      <rect x="3" y="5" width="2" height="1" fill={colors.gold1} />
      {/* Highlight */}
      <rect x="1" y="2" width="1" height="2" fill={colors.white} opacity="0.4" />
    </svg>
  );

  if (shouldAnimate) {
    return (
      <motion.div
        className="inline-block"
        animate={{ rotateY: [0, 180, 360] }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        {Coin}
      </motion.div>
    );
  }

  return Coin;
}
