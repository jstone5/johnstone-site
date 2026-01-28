"use client";

import { useMemo } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useIsClient } from "@/lib/hooks";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  drift: number;
  color: "accent" | "accent2" | "muted";
}

// Seeded random for consistent particle positions
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
}

function generateParticles(count: number): Particle[] {
  const colors: Array<"accent" | "accent2" | "muted"> = ["accent", "accent2", "muted"];
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: seededRandom(i * 1) * 100,
    y: seededRandom(i * 2) * 100,
    size: seededRandom(i * 3) * 3 + 1,
    opacity: seededRandom(i * 4) * 0.4 + 0.1,
    speed: seededRandom(i * 5) * 20 + 10,
    drift: (seededRandom(i * 6) - 0.5) * 10,
    color: colors[Math.floor(seededRandom(i * 7) * 3)],
  }));
}

export function ParticleField() {
  const prefersReducedMotion = useReducedMotion();
  const isClient = useIsClient();
  const { scrollYProgress } = useScroll();

  // Parallax offset based on scroll
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -100]);

  // Generate particles deterministically
  const particles = useMemo(() => {
    return generateParticles(prefersReducedMotion ? 15 : 40);
  }, [prefersReducedMotion]);

  if (!isClient) return null;

  if (prefersReducedMotion) {
    // Static particles for reduced motion
    return (
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {particles.slice(0, 15).map((particle) => (
          <div
            key={particle.id}
            className={`absolute rounded-full ${
              particle.color === "accent"
                ? "bg-[var(--accent)]"
                : particle.color === "accent2"
                ? "bg-[var(--accent2)]"
                : "bg-[var(--muted)]"
            }`}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
              opacity: particle.opacity * 0.5,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{ y: parallaxY }}
    >
      {particles.map((particle) => (
        <FloatingParticle key={particle.id} particle={particle} />
      ))}
    </motion.div>
  );
}

function FloatingParticle({ particle }: { particle: Particle }) {
  const colorClasses = {
    accent: "bg-[var(--accent)]",
    accent2: "bg-[var(--accent2)]",
    muted: "bg-[var(--muted)]",
  };

  return (
    <motion.div
      className={`absolute rounded-full ${colorClasses[particle.color]}`}
      style={{
        left: `${particle.x}%`,
        width: particle.size,
        height: particle.size,
      }}
      initial={{
        y: `${particle.y}vh`,
        opacity: 0,
      }}
      animate={{
        y: [`${particle.y}vh`, `${particle.y - 30}vh`, `${particle.y}vh`],
        x: [0, particle.drift, 0],
        opacity: [particle.opacity, particle.opacity * 1.5, particle.opacity],
      }}
      transition={{
        duration: particle.speed,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

// Simplified star field variant
export function StarField() {
  const prefersReducedMotion = useReducedMotion();
  const isClient = useIsClient();

  const stars = useMemo(() => {
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: seededRandom(i * 10) * 100,
      y: seededRandom(i * 11) * 100,
      size: seededRandom(i * 12) * 2 + 1,
      twinkleSpeed: seededRandom(i * 13) * 3 + 2,
      delay: seededRandom(i * 14) * 2,
    }));
  }, []);

  if (!isClient) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute bg-[var(--accent)] rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
          }}
          animate={
            prefersReducedMotion
              ? { opacity: 0.3 }
              : {
                  opacity: [0.2, 0.6, 0.2],
                  scale: [1, 1.2, 1],
                }
          }
          transition={{
            duration: star.twinkleSpeed,
            repeat: Infinity,
            delay: star.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
