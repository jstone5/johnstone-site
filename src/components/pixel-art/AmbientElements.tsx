"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";

// Seeded random for consistent positions
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
}

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
};

interface StarProps {
  x: number;
  y: number;
  size?: number;
  color?: string;
  delay?: number;
}

// Single pixel star with twinkle
export function PixelStar({ x, y, size = 2, color = colors.white, delay = 0 }: StarProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className="absolute"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        backgroundColor: color,
      }}
      animate={prefersReducedMotion ? {} : {
        opacity: [0.3, 1, 0.3],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: 2 + delay,
        repeat: Infinity,
        delay: delay,
        ease: "easeInOut",
      }}
    />
  );
}

// Four-point pixel star
export function PixelStarBurst({ x, y, size = 8, color = colors.cyan1, delay = 0 }: StarProps) {
  const prefersReducedMotion = useReducedMotion();
  const pixelSize = size / 4;

  return (
    <motion.div
      className="absolute"
      style={{
        left: `${x}%`,
        top: `${y}%`,
      }}
      animate={prefersReducedMotion ? {} : {
        opacity: [0.5, 1, 0.5],
        rotate: [0, 45, 0],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    >
      <svg width={size} height={size} viewBox="0 0 4 4" style={{ imageRendering: "pixelated" }}>
        <rect x="1" y="0" width="2" height="1" fill={color} />
        <rect x="0" y="1" width="1" height="2" fill={color} />
        <rect x="3" y="1" width="1" height="2" fill={color} />
        <rect x="1" y="3" width="2" height="1" fill={color} />
        <rect x="1" y="1" width="2" height="2" fill={color} opacity="0.8" />
      </svg>
    </motion.div>
  );
}

// Floating pixel cloud
interface CloudProps {
  x: number;
  y: number;
  size?: number;
  speed?: number;
}

export function PixelCloud({ x, y, size = 48, speed = 60 }: CloudProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
      }}
      animate={prefersReducedMotion ? {} : {
        x: ["0%", "100vw"],
      }}
      transition={{
        duration: speed,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      <svg
        width={size}
        height={size * 0.5}
        viewBox="0 0 16 8"
        style={{ imageRendering: "pixelated" }}
        opacity="0.25"
      >
        <rect x="4" y="4" width="8" height="4" fill={colors.white} />
        <rect x="2" y="6" width="12" height="2" fill={colors.white} />
        <rect x="6" y="2" width="6" height="2" fill={colors.white} />
        <rect x="8" y="0" width="4" height="2" fill={colors.white} />
        <rect x="0" y="6" width="2" height="2" fill={colors.white} opacity="0.5" />
        <rect x="14" y="6" width="2" height="2" fill={colors.white} opacity="0.5" />
      </svg>
    </motion.div>
  );
}

// Rising sparkle/particle
interface SparkleProps {
  x: number;
  startY: number;
  color?: string;
  size?: number;
  duration?: number;
  delay?: number;
}

export function RisingSparkle({
  x,
  startY,
  color = colors.cyan1,
  size = 4,
  duration = 4,
  delay = 0,
}: SparkleProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <div
        className="absolute"
        style={{
          left: `${x}%`,
          top: `${startY}%`,
          width: size,
          height: size,
          backgroundColor: color,
          opacity: 0.3,
        }}
      />
    );
  }

  return (
    <motion.div
      className="absolute"
      style={{
        left: `${x}%`,
        width: size,
        height: size,
        backgroundColor: color,
      }}
      initial={{ top: `${startY}%`, opacity: 0 }}
      animate={{
        top: [`${startY}%`, `${startY - 30}%`],
        opacity: [0, 1, 0],
        scale: [0.5, 1, 0.5],
      }}
      transition={{
        duration,
        repeat: Infinity,
        delay,
        ease: "easeOut",
      }}
    />
  );
}

// Floating orb with glow
interface OrbProps {
  x: number;
  y: number;
  color?: string;
  size?: number;
}

export function FloatingOrb({ x, y, color = colors.purple1, size = 12 }: OrbProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className="absolute"
      style={{
        left: `${x}%`,
        top: `${y}%`,
      }}
      animate={prefersReducedMotion ? {} : {
        y: [-5, 5, -5],
        opacity: [0.6, 0.9, 0.6],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 6 6"
        style={{ imageRendering: "pixelated" }}
      >
        {/* Outer glow */}
        <rect x="1" y="0" width="4" height="1" fill={color} opacity="0.3" />
        <rect x="0" y="1" width="1" height="4" fill={color} opacity="0.3" />
        <rect x="5" y="1" width="1" height="4" fill={color} opacity="0.3" />
        <rect x="1" y="5" width="4" height="1" fill={color} opacity="0.3" />
        {/* Core */}
        <rect x="1" y="1" width="4" height="4" fill={color} opacity="0.7" />
        <rect x="2" y="2" width="2" height="2" fill={color} />
        {/* Highlight */}
        <rect x="2" y="2" width="1" height="1" fill={colors.white} opacity="0.5" />
      </svg>
    </motion.div>
  );
}

// Full ambient background layer with all elements
interface AmbientBackgroundProps {
  variant?: "stars" | "magical" | "full";
  density?: "low" | "medium" | "high";
}

export function AmbientBackground({ variant = "full", density = "medium" }: AmbientBackgroundProps) {
  const prefersReducedMotion = useReducedMotion();

  const densityMultiplier = density === "low" ? 0.5 : density === "high" ? 1.5 : 1;

  // Generate stars with seeded random
  const stars = useMemo(() => {
    const count = Math.floor(30 * densityMultiplier);
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: seededRandom(i * 100) * 100,
      y: seededRandom(i * 101) * 100,
      size: seededRandom(i * 102) > 0.7 ? 3 : 2,
      delay: seededRandom(i * 103) * 3,
      color: seededRandom(i * 104) > 0.8 ? colors.cyan2 :
             seededRandom(i * 105) > 0.9 ? colors.purple2 : colors.white,
    }));
  }, [densityMultiplier]);

  // Generate star bursts
  const starBursts = useMemo(() => {
    if (variant === "stars") return [];
    const count = Math.floor(8 * densityMultiplier);
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: seededRandom(i * 200) * 100,
      y: seededRandom(i * 201) * 100,
      delay: seededRandom(i * 202) * 4,
      color: seededRandom(i * 203) > 0.5 ? colors.cyan1 : colors.purple1,
    }));
  }, [variant, densityMultiplier]);

  // Generate sparkles
  const sparkles = useMemo(() => {
    if (variant === "stars") return [];
    const count = Math.floor(12 * densityMultiplier);
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: seededRandom(i * 300) * 100,
      startY: 70 + seededRandom(i * 301) * 25,
      delay: seededRandom(i * 302) * 5,
      duration: 3 + seededRandom(i * 303) * 3,
      color: seededRandom(i * 304) > 0.5 ? colors.cyan1 :
             seededRandom(i * 305) > 0.5 ? colors.purple1 : colors.gold1,
    }));
  }, [variant, densityMultiplier]);

  // Generate orbs
  const orbs = useMemo(() => {
    if (variant !== "full") return [];
    const count = Math.floor(5 * densityMultiplier);
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: seededRandom(i * 400) * 100,
      y: seededRandom(i * 401) * 80 + 10,
      color: seededRandom(i * 402) > 0.5 ? colors.cyan1 : colors.purple1,
    }));
  }, [variant, densityMultiplier]);

  // Generate clouds - larger sizes for visibility
  const clouds = useMemo(() => {
    if (variant === "stars" || prefersReducedMotion) return [];
    const count = Math.floor(3 * densityMultiplier);
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: seededRandom(i * 500) * -50 - 20,
      y: 5 + seededRandom(i * 501) * 20,
      size: 80 + seededRandom(i * 502) * 80, // Increased from 32-64 to 80-160
      speed: 100 + seededRandom(i * 503) * 80, // Slightly slower for larger clouds
    }));
  }, [variant, densityMultiplier, prefersReducedMotion]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Stars */}
      {stars.map((star) => (
        <PixelStar
          key={`star-${star.id}`}
          x={star.x}
          y={star.y}
          size={star.size}
          delay={star.delay}
          color={star.color}
        />
      ))}

      {/* Star bursts */}
      {starBursts.map((burst) => (
        <PixelStarBurst
          key={`burst-${burst.id}`}
          x={burst.x}
          y={burst.y}
          delay={burst.delay}
          color={burst.color}
        />
      ))}

      {/* Rising sparkles */}
      {sparkles.map((sparkle) => (
        <RisingSparkle
          key={`sparkle-${sparkle.id}`}
          x={sparkle.x}
          startY={sparkle.startY}
          delay={sparkle.delay}
          duration={sparkle.duration}
          color={sparkle.color}
        />
      ))}

      {/* Floating orbs */}
      {orbs.map((orb) => (
        <FloatingOrb
          key={`orb-${orb.id}`}
          x={orb.x}
          y={orb.y}
          color={orb.color}
        />
      ))}

      {/* Clouds */}
      {clouds.map((cloud) => (
        <PixelCloud
          key={`cloud-${cloud.id}`}
          x={cloud.x}
          y={cloud.y}
          size={cloud.size}
          speed={cloud.speed}
        />
      ))}
    </div>
  );
}
