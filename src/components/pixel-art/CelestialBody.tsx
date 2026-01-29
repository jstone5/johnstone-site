"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useSky } from "@/contexts/SkyContext";

interface CelestialBodyProps {
  // The container ref to track for positioning
  sceneRef: React.RefObject<HTMLElement | null>;
}

/**
 * CelestialBody renders a sun or moon that:
 * - Starts positioned within the hero scene
 * - Smoothly detaches and moves to a fixed corner position as user scrolls
 * - Returns to the scene when scrolling back up
 */
export function CelestialBody({ sceneRef }: CelestialBodyProps) {
  const { isDay, palette } = useSky();
  const prefersReducedMotion = useReducedMotion();

  // Track scroll-based position (0 = in scene, 1 = fixed corner)
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scenePosition, setScenePosition] = useState({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);

  // Fixed corner position (upper right, avoiding sidebar)
  const fixedPosition = {
    x: typeof window !== "undefined" ? window.innerWidth - 80 : 0,
    y: 60,
  };

  // Update scene position and scroll progress
  useEffect(() => {
    const updatePositions = () => {
      if (!sceneRef.current) return;

      const sceneRect = sceneRef.current.getBoundingClientRect();

      // Check if scene is visible (not hidden on mobile)
      if (sceneRect.width === 0 || sceneRect.height === 0) {
        // Scene is hidden (mobile) - just stay in fixed position
        setScrollProgress(1);
        return;
      }

      // Position within the scene (upper right area of the pixel art)
      // The scene is the container, so we position relative to viewport
      // Position the celestial body inside the scene's sky area
      const sceneX = sceneRect.right - 50; // 50px from right edge of scene
      const sceneY = sceneRect.top + sceneRect.height * 0.2; // 20% from top of scene

      setScenePosition({ x: sceneX, y: sceneY });

      // Calculate scroll progress
      // Start transitioning when scene top reaches 100px from viewport top
      // Complete transition when scene top is at -200px (scrolled past)
      const startThreshold = 100;
      const endThreshold = -200;
      const sceneTop = sceneRect.top;

      let progress = 0;
      if (sceneTop < startThreshold) {
        progress = Math.min(1, (startThreshold - sceneTop) / (startThreshold - endThreshold));
      }

      setScrollProgress(progress);
    };

    const handleScroll = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = requestAnimationFrame(updatePositions);
    };

    // Initial calculation
    updatePositions();

    // Listen to scroll and resize
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updatePositions);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updatePositions);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [sceneRef]);

  // Interpolate between scene position and fixed position
  const currentX = scenePosition.x + (fixedPosition.x - scenePosition.x) * scrollProgress;
  const currentY = scenePosition.y + (fixedPosition.y - scenePosition.y) * scrollProgress;

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
