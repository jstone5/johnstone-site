"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { PixelButton } from "./PixelButton";
import { useIsClient } from "@/lib/hooks";
import { useSound } from "@/contexts/SoundContext";
import { useXP, XP_REWARDS } from "@/contexts/XPContext";

// Seeded random for consistent positions
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
}

const STORAGE_KEY = "johnstone_intro_seen";
const SCROLL_THRESHOLD = 40;

export function StartOverlay() {
  const isClient = useIsClient();
  const [isVisible, setIsVisible] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const { play, init } = useSound();
  const { addXP } = useXP();

  const dismiss = useCallback(() => {
    init();
    play("menuSelect");
    setIsVisible(false);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, "1");
      document.body.style.overflow = "";
      // Grant XP for first visit
      addXP(XP_REWARDS.firstVisit, "Started the journey!");
    }
  }, [init, play, addXP]);

  // Initialize and set up event listeners
  useEffect(() => {
    if (!isClient) return;

    // Check if user has already seen intro
    const hasSeen = localStorage.getItem(STORAGE_KEY) === "1";
    if (hasSeen) {
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsVisible(true);
    document.body.style.overflow = "hidden";

    // Track if already dismissed to prevent multiple calls
    let dismissed = false;

    // Handle scroll dismiss
    let scrollAccumulator = 0;
    const handleWheel = (e: WheelEvent) => {
      if (dismissed) return;
      scrollAccumulator += Math.abs(e.deltaY);
      if (scrollAccumulator >= SCROLL_THRESHOLD) {
        dismissed = true;
        dismiss();
      }
    };

    // Handle touch scroll dismiss
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (dismissed) return;
      const deltaY = touchStartY - e.touches[0].clientY;
      if (deltaY >= SCROLL_THRESHOLD) {
        dismissed = true;
        dismiss();
      }
    };

    // Handle Enter key dismiss
    const handleKeyDown = (e: KeyboardEvent) => {
      if (dismissed) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        dismissed = true;
        dismiss();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isClient, dismiss]);

  if (!isClient) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[var(--bg)]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Scanlines effect for game feel */}
          <div className="absolute inset-0 pointer-events-none bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.3)_2px,rgba(0,0,0,0.3)_4px)] opacity-20" />

          {/* Floating particles in background */}
          <StartParticles prefersReducedMotion={prefersReducedMotion} />

          {/* Main content */}
          <motion.div
            className="relative bg-[var(--panel)] border-2 border-[var(--accent)] pixel-corners p-8 sm:p-12 max-w-md mx-4 text-center shadow-[0_0_60px_rgba(110,231,255,0.2)]"
            initial={prefersReducedMotion ? {} : { scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={prefersReducedMotion ? {} : { scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* Corner decorations */}
            <div className="absolute top-0 left-0 w-3 h-3 bg-[var(--accent2)]" />
            <div className="absolute top-0 right-0 w-3 h-3 bg-[var(--accent2)]" />
            <div className="absolute bottom-0 left-0 w-3 h-3 bg-[var(--accent2)]" />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-[var(--accent2)]" />

            {/* Press Start Badge */}
            <PressStartBadge />

            {/* Title */}
            <motion.h1
              className="font-[family-name:var(--font-pixelify-sans)] text-2xl sm:text-3xl text-[var(--text)] mb-2"
              initial={prefersReducedMotion ? {} : { y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              JohnStone.blog
            </motion.h1>

            <motion.p
              className="text-[var(--accent)] font-medium mb-6 text-sm"
              initial={prefersReducedMotion ? {} : { y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              A journey through product, AI, and craft
            </motion.p>

            <motion.p
              className="text-[var(--muted)] mb-8 text-sm"
              initial={prefersReducedMotion ? {} : { y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Navigate through levels to explore my story, work, and writing.
              Use keyboard arrows or scroll to move.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-3 justify-center"
              initial={prefersReducedMotion ? {} : { y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <PixelButton onClick={dismiss} variant="primary" glow>
                Start Game
              </PixelButton>
              <PixelButton onClick={dismiss} variant="secondary">
                Skip
              </PixelButton>
            </motion.div>

            {/* Blinking prompt */}
            <motion.p
              className="text-xs text-[var(--accent)] mt-6 font-[family-name:var(--font-pixelify-sans)]"
              animate={prefersReducedMotion ? {} : { opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              PRESS ENTER OR SPACE TO START
            </motion.p>
          </motion.div>

          {/* Version indicator */}
          <motion.div
            className="absolute bottom-4 right-4 text-xs text-[var(--muted)]/50 font-[family-name:var(--font-pixelify-sans)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            v1.0
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function PressStartBadge() {
  const [hasImage, setHasImage] = useState(true);
  const prefersReducedMotion = useReducedMotion();

  if (!hasImage) {
    return (
      <motion.div
        className="inline-block px-4 py-2 mb-6 bg-[var(--accent2)] text-[var(--bg)] font-[family-name:var(--font-pixelify-sans)] text-sm pixel-corners-sm"
        animate={prefersReducedMotion ? {} : { scale: [1, 1.02, 1] }}
        transition={{ duration: 0.8, repeat: Infinity }}
      >
        PRESS START
      </motion.div>
    );
  }

  return (
    <motion.div
      className="mb-6"
      animate={prefersReducedMotion ? {} : { scale: [1, 1.02, 1] }}
      transition={{ duration: 0.8, repeat: Infinity }}
    >
      <Image
        src="/pixel/badge-press-start.png"
        alt="Press Start"
        width={120}
        height={30}
        className="pixel-render mx-auto"
        onError={() => setHasImage(false)}
      />
    </motion.div>
  );
}

function StartParticles({ prefersReducedMotion }: { prefersReducedMotion: boolean | null }) {
  const particles = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: seededRandom(i * 100) * 100,
      y: seededRandom(i * 101) * 100,
      duration: 3 + seededRandom(i * 102) * 2,
      delay: seededRandom(i * 103) * 2,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 bg-[var(--accent)] rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={
            prefersReducedMotion
              ? { opacity: 0.3 }
              : {
                  y: [0, -30, 0],
                  opacity: [0.2, 0.5, 0.2],
                }
          }
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
          }}
        />
      ))}
    </div>
  );
}
