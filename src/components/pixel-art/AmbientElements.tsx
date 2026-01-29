"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useSky } from "@/contexts/SkyContext";

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

// Floating pixel cloud - uses CSS variable for dynamic tinting
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
        opacity="0.35"
      >
        <rect x="4" y="4" width="8" height="4" fill="var(--cloud-tint, white)" />
        <rect x="2" y="6" width="12" height="2" fill="var(--cloud-tint, white)" />
        <rect x="6" y="2" width="6" height="2" fill="var(--cloud-tint, white)" />
        <rect x="8" y="0" width="4" height="2" fill="var(--cloud-tint, white)" />
        <rect x="0" y="6" width="2" height="2" fill="var(--cloud-tint, white)" opacity="0.5" />
        <rect x="14" y="6" width="2" height="2" fill="var(--cloud-tint, white)" opacity="0.5" />
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

// Pixel Sun
interface CelestialProps {
  position: number; // 0-1, where 0.5 is highest point
}

export function PixelSun({ position }: CelestialProps) {
  const prefersReducedMotion = useReducedMotion();

  // Calculate vertical position - arc in the RIGHT side of the screen to avoid content
  // position: 0.25 = sunrise (right edge, low), 0.5 = noon (right-center, high), 0.75 = sunset (right edge, low)
  const normalizedPos = (position - 0.25) / 0.5; // 0 at sunrise, 1 at sunset
  // Keep sun on the RIGHT side of the screen (60% to 92%) to avoid overlapping content
  const x = 60 + normalizedPos * 32; // 60% to 92% horizontal (right side only)
  const arcHeight = Math.sin(normalizedPos * Math.PI); // 0 at edges, 1 at center
  const y = 60 - arcHeight * 45; // Lower at edges, higher at center (15% to 60%)

  // Only show during day (position 0.25 to 0.75)
  if (position < 0.2 || position > 0.8) return null;

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        opacity: "var(--sun-moon-opacity, 0.8)",
      }}
      animate={prefersReducedMotion ? {} : {
        scale: [1, 1.05, 1],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <svg
        width={48}
        height={48}
        viewBox="0 0 16 16"
        style={{ imageRendering: "pixelated" }}
      >
        {/* Sun rays */}
        <rect x="7" y="0" width="2" height="2" fill="#FFE066" opacity="0.7" />
        <rect x="7" y="14" width="2" height="2" fill="#FFE066" opacity="0.7" />
        <rect x="0" y="7" width="2" height="2" fill="#FFE066" opacity="0.7" />
        <rect x="14" y="7" width="2" height="2" fill="#FFE066" opacity="0.7" />
        <rect x="2" y="2" width="2" height="2" fill="#FFE066" opacity="0.5" />
        <rect x="12" y="2" width="2" height="2" fill="#FFE066" opacity="0.5" />
        <rect x="2" y="12" width="2" height="2" fill="#FFE066" opacity="0.5" />
        <rect x="12" y="12" width="2" height="2" fill="#FFE066" opacity="0.5" />
        {/* Sun core */}
        <rect x="5" y="4" width="6" height="8" fill="#FFDD44" />
        <rect x="4" y="5" width="8" height="6" fill="#FFDD44" />
        {/* Highlight */}
        <rect x="5" y="5" width="2" height="2" fill="#FFFFAA" />
      </svg>
    </motion.div>
  );
}

// Pixel Moon
export function PixelMoon({ position }: CelestialProps) {
  const prefersReducedMotion = useReducedMotion();

  // Moon arc - similar to sun but for night
  // position: 0.75-1 and 0-0.25 = night
  let normalizedPos: number;
  if (position >= 0.75) {
    normalizedPos = (position - 0.75) / 0.5; // 0 to 0.5
  } else {
    normalizedPos = (position + 0.25) / 0.5; // 0.5 to 1
  }

  const x = normalizedPos * 80 + 10;
  const arcHeight = Math.sin(normalizedPos * Math.PI);
  const y = 70 - arcHeight * 55;

  // Only show during night (position 0.75 to 1 and 0 to 0.25)
  if (position > 0.3 && position < 0.7) return null;

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        opacity: "var(--sun-moon-opacity, 0.9)",
      }}
      animate={prefersReducedMotion ? {} : {
        y: [-2, 2, -2],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <svg
        width={40}
        height={40}
        viewBox="0 0 12 12"
        style={{ imageRendering: "pixelated" }}
      >
        {/* Moon glow */}
        <rect x="3" y="1" width="6" height="10" fill="#E8E8F0" opacity="0.3" />
        <rect x="1" y="3" width="10" height="6" fill="#E8E8F0" opacity="0.3" />
        {/* Moon body - crescent effect */}
        <rect x="4" y="2" width="5" height="8" fill="#F0F0F8" />
        <rect x="3" y="3" width="6" height="6" fill="#F0F0F8" />
        <rect x="2" y="4" width="7" height="4" fill="#F0F0F8" />
        {/* Shadow for crescent */}
        <rect x="6" y="3" width="2" height="6" fill="#C8C8D8" opacity="0.4" />
        <rect x="7" y="4" width="2" height="4" fill="#C8C8D8" opacity="0.6" />
        {/* Craters */}
        <rect x="4" y="4" width="1" height="1" fill="#D8D8E8" />
        <rect x="5" y="7" width="1" height="1" fill="#D8D8E8" />
        <rect x="3" y="6" width="1" height="1" fill="#D8D8E8" />
      </svg>
    </motion.div>
  );
}

// Shooting star for night sky
export function ShootingStar({ delay = 0 }: { delay?: number }) {
  const prefersReducedMotion = useReducedMotion();

  // Random starting position
  const startX = 10 + Math.random() * 60;
  const startY = 5 + Math.random() * 30;

  if (prefersReducedMotion) return null;

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: `${startX}%`,
        top: `${startY}%`,
      }}
      initial={{ opacity: 0, x: 0, y: 0 }}
      animate={{
        opacity: [0, 1, 1, 0],
        x: [0, 150],
        y: [0, 100],
      }}
      transition={{
        duration: 1,
        delay: delay,
        repeat: Infinity,
        repeatDelay: 30 + Math.random() * 60, // Random 30-90 seconds between
        ease: "easeOut",
      }}
    >
      <svg
        width={24}
        height={24}
        viewBox="0 0 12 12"
        style={{ imageRendering: "pixelated" }}
      >
        {/* Trail */}
        <rect x="0" y="6" width="2" height="1" fill="#FFFFFF" opacity="0.3" />
        <rect x="2" y="5" width="2" height="1" fill="#FFFFFF" opacity="0.5" />
        <rect x="4" y="4" width="2" height="1" fill="#FFFFFF" opacity="0.7" />
        <rect x="6" y="3" width="2" height="1" fill="#FFFFFF" opacity="0.9" />
        {/* Star head */}
        <rect x="8" y="2" width="2" height="2" fill="#FFFFFF" />
        <rect x="9" y="1" width="1" height="1" fill="#FFFFFF" opacity="0.8" />
        <rect x="10" y="2" width="1" height="1" fill="#FFFFFF" opacity="0.8" />
      </svg>
    </motion.div>
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
  const { sunPosition, palette, phase } = useSky();

  const densityMultiplier = density === "low" ? 0.5 : density === "high" ? 1.5 : 1;
  const showStars = palette.starsOpacity > 0;
  const isNight = phase === "night" || phase === "dusk" || phase === "dawn";

  // Generate stars with seeded random
  const stars = useMemo(() => {
    const count = Math.floor(40 * densityMultiplier); // Increased star count
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: seededRandom(i * 100) * 100,
      y: seededRandom(i * 101) * 70, // Keep stars in upper portion
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
      y: seededRandom(i * 201) * 60,
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

  // Generate orbs - only show at night/dusk
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
    const count = Math.floor(4 * densityMultiplier); // Slightly more clouds
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: seededRandom(i * 500) * -50 - 20,
      y: 5 + seededRandom(i * 501) * 25,
      size: 80 + seededRandom(i * 502) * 80,
      speed: 100 + seededRandom(i * 503) * 80,
    }));
  }, [variant, densityMultiplier, prefersReducedMotion]);

  // Generate shooting stars (only at night)
  const shootingStars = useMemo(() => {
    if (!isNight || prefersReducedMotion) return [];
    return Array.from({ length: 3 }, (_, i) => ({
      id: i,
      delay: i * 25 + seededRandom(i * 600) * 20, // Stagger them
    }));
  }, [isNight, prefersReducedMotion]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Sun/Moon now handled by CelestialBody component in HeroScene */}

      {/* Stars - with dynamic opacity */}
      {showStars && (
        <div style={{ opacity: palette.starsOpacity, transition: "opacity 2s ease-out" }}>
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
        </div>
      )}

      {/* Shooting stars - only at night */}
      {shootingStars.map((star) => (
        <ShootingStar key={`shooting-${star.id}`} delay={star.delay} />
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

      {/* Floating orbs - more visible at night */}
      <div style={{ opacity: isNight ? 1 : 0.3, transition: "opacity 2s ease-out" }}>
        {orbs.map((orb) => (
          <FloatingOrb
            key={`orb-${orb.id}`}
            x={orb.x}
            y={orb.y}
            color={orb.color}
          />
        ))}
      </div>

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
