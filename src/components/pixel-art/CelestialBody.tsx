"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useSky } from "@/contexts/SkyContext";

/**
 * CelestialBody renders a sun or moon that:
 * - Starts positioned in the upper area of the hero section (viewport-relative)
 * - Smoothly detaches and moves to a fixed corner position as user scrolls
 * - Returns to the scene when scrolling back up
 */
export function CelestialBody() {
  const { isDay, palette } = useSky();
  const prefersReducedMotion = useReducedMotion();

  // Track scroll-based position (0 = in scene, 1 = fixed corner)
  const [scrollProgress, setScrollProgress] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);
  const rafRef = useRef<number | null>(null);

  // Starting position - upper right area of hero section
  const getStartPosition = () => ({
    x: viewportWidth * 0.85, // 85% from left
    y: 120, // Fixed pixels from top
  });

  // Fixed corner position (upper right, avoiding sidebar)
  const fixedPosition = {
    x: viewportWidth - 80,
    y: 60,
  };

  // Update scroll progress and viewport width
  useEffect(() => {
    const updateState = () => {
      setViewportWidth(window.innerWidth);

      // Calculate scroll progress based on how far we've scrolled past the hero
      // Start transitioning after scrolling 100px
      // Complete transition after scrolling 400px
      const scrollY = window.scrollY;
      const startThreshold = 100;
      const endThreshold = 400;

      let progress = 0;
      if (scrollY > startThreshold) {
        progress = Math.min(1, (scrollY - startThreshold) / (endThreshold - startThreshold));
      }

      setScrollProgress(progress);
    };

    const handleScroll = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = requestAnimationFrame(updateState);
    };

    // Initial calculation
    updateState();

    // Listen to scroll and resize
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateState);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateState);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const startPosition = getStartPosition();

  // Interpolate between start position and fixed position
  const currentX = startPosition.x + (fixedPosition.x - startPosition.x) * scrollProgress;
  const currentY = startPosition.y + (fixedPosition.y - startPosition.y) * scrollProgress;

  // Scale down slightly when detached
  const scale = 1 - scrollProgress * 0.15;

  // Don't render during SSR
  if (typeof window === "undefined") return null;

  return (
    <motion.div
      className="fixed pointer-events-none z-30"
      style={{
        left: currentX,
        top: currentY,
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity: palette.sunMoonOpacity,
      }}
      animate={prefersReducedMotion ? {} : {
        y: [0, -3, 0],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {isDay ? <PixelSunSprite /> : <PixelMoonSprite />}
    </motion.div>
  );
}

function PixelSunSprite() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.svg
      width={56}
      height={56}
      viewBox="0 0 16 16"
      style={{ imageRendering: "pixelated" }}
      animate={prefersReducedMotion ? {} : {
        rotate: [0, 360],
      }}
      transition={{
        duration: 60,
        repeat: Infinity,
        ease: "linear",
      }}
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
    </motion.svg>
  );
}

function PixelMoonSprite() {
  return (
    <svg
      width={48}
      height={48}
      viewBox="0 0 14 14"
      style={{ imageRendering: "pixelated" }}
    >
      {/* Moon glow */}
      <rect x="4" y="1" width="6" height="12" fill="#E8E8F0" opacity="0.2" />
      <rect x="1" y="4" width="12" height="6" fill="#E8E8F0" opacity="0.2" />
      {/* Moon body */}
      <rect x="4" y="2" width="6" height="10" fill="#F0F0F8" />
      <rect x="3" y="3" width="8" height="8" fill="#F0F0F8" />
      <rect x="2" y="4" width="10" height="6" fill="#F0F0F8" />
      {/* Shadow for crescent */}
      <rect x="7" y="3" width="3" height="8" fill="#C8C8D8" opacity="0.4" />
      <rect x="8" y="4" width="3" height="6" fill="#C8C8D8" opacity="0.5" />
      {/* Craters */}
      <rect x="4" y="5" width="2" height="2" fill="#D8D8E8" />
      <rect x="5" y="8" width="1" height="1" fill="#D8D8E8" />
      <rect x="3" y="7" width="1" height="1" fill="#D8D8E8" />
    </svg>
  );
}
