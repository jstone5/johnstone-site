"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";

interface GameAvatarProps {
  isMoving: boolean;
  direction: "up" | "down" | "idle";
  className?: string;
}

export function GameAvatar({
  isMoving,
  direction,
  className = "",
}: GameAvatarProps) {
  const prefersReducedMotion = useReducedMotion();
  const [frame, setFrame] = useState(0);

  // Animation frames for idle bounce
  useEffect(() => {
    if (prefersReducedMotion) return;

    const interval = setInterval(() => {
      setFrame((prev) => (prev + 1) % 4);
    }, isMoving ? 100 : 400);

    return () => clearInterval(interval);
  }, [isMoving, prefersReducedMotion]);

  // Calculate bounce offset based on frame
  const bounceOffset = prefersReducedMotion
    ? 0
    : isMoving
    ? [0, -2, 0, -2][frame]
    : [0, -1, -2, -1][frame];

  // Walking "lean" based on direction
  const walkLean =
    direction === "up" ? -3 : direction === "down" ? 3 : 0;

  return (
    <motion.div
      className={`relative ${className}`}
      animate={{
        y: bounceOffset,
        rotate: prefersReducedMotion ? 0 : walkLean,
      }}
      transition={{
        y: { duration: 0.1 },
        rotate: { duration: 0.15 },
      }}
    >
      {/* Avatar image */}
      <div className="relative w-10 h-10 lg:w-12 lg:h-12">
        <Image
          src="/pixel/avatar.png"
          alt="Player avatar"
          fill
          className="pixel-render object-contain"
          priority
        />

        {/* Walking dust particles when moving */}
        {isMoving && !prefersReducedMotion && (
          <WalkingParticles direction={direction} />
        )}
      </div>

      {/* Shadow underneath */}
      <motion.div
        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-2 bg-black/30 rounded-full blur-sm"
        animate={{
          scale: isMoving ? [1, 0.8, 1] : 1,
          opacity: isMoving ? [0.3, 0.2, 0.3] : 0.3,
        }}
        transition={{ duration: 0.2 }}
      />
    </motion.div>
  );
}

// Small dust particles that appear when walking
function WalkingParticles({ direction }: { direction: "up" | "down" | "idle" }) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setParticles((prev) => {
        const newParticle = {
          id: Date.now(),
          x: Math.random() * 8 - 4,
          y: direction === "up" ? 8 : -8,
        };
        // Keep only last 3 particles
        return [...prev.slice(-2), newParticle];
      });
    }, 150);

    return () => clearInterval(interval);
  }, [direction]);

  // Clean up old particles
  useEffect(() => {
    const cleanup = setInterval(() => {
      setParticles((prev) => prev.filter((p) => Date.now() - p.id < 300));
    }, 100);

    return () => clearInterval(cleanup);
  }, []);

  return (
    <>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 bg-[var(--muted)] rounded-full"
          style={{ left: `calc(50% + ${particle.x}px)` }}
          initial={{
            y: direction === "up" ? 0 : 10,
            opacity: 0.6,
            scale: 1,
          }}
          animate={{
            y: particle.y,
            opacity: 0,
            scale: 0.5,
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      ))}
    </>
  );
}

// Simplified avatar for static display
export function StaticAvatar({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <div className="relative w-10 h-10 lg:w-12 lg:h-12">
        <Image
          src="/pixel/avatar.png"
          alt="Player avatar"
          fill
          className="pixel-render object-contain"
          priority
        />
      </div>
    </div>
  );
}
