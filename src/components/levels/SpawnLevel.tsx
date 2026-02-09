"use client";

import { useState, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { PixelButton } from "@/components/PixelButton";
import { TypingEffect } from "@/components/TypingEffect";
import { ImmersiveHeroSceneWithGame, CelestialBody } from "@/components/pixel-art";
import { site } from "@/content/site";

export function SpawnLevel() {
  const prefersReducedMotion = useReducedMotion();
  const [gameProgress, setGameProgress] = useState(0);

  const handleGameProgress = useCallback((progress: number) => {
    setGameProgress(progress);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.15,
        delayChildren: prefersReducedMotion ? 0 : 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as const },
    },
  };

  return (
    <div className="relative w-full min-h-screen">
      {/* Immersive background scene with integrated platformer game */}
      <ImmersiveHeroSceneWithGame onGameStart={handleGameProgress} />

      {/* Sun/Moon that detaches from scene and follows scroll */}
      <CelestialBody />

      {/* Nudge arrow + keyboard hint - encourages player to move right (desktop only) */}
      {gameProgress === 0 && (
        <div
          className="absolute z-20 pointer-events-none hidden sm:flex flex-col items-center gap-2"
          style={{ left: "76%", bottom: "14%" }}
        >
          {/* Keyboard hint */}
          <div className="flex items-center gap-1.5 bg-[var(--panel)]/80 backdrop-blur-sm rounded px-2.5 py-1.5 border border-[var(--border)]/50">
            <kbd className="inline-flex items-center justify-center w-6 h-6 bg-[var(--panel)] rounded border border-[var(--border)] font-[family-name:var(--font-pixelify-sans)] text-[var(--accent)] text-xs">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M3 1.5L7.5 5L3 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </kbd>
            <span className="font-[family-name:var(--font-pixelify-sans)] text-[var(--muted)] text-xs">
              to explore
            </span>
          </div>
          {/* Animated chevrons */}
          <div className="flex items-center gap-0.5">
            <svg width="14" height="20" viewBox="0 0 14 20" className="nudge-arrow" aria-hidden="true">
              <path d="M2 3L10 10L2 17" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="square" fill="none" />
            </svg>
            <svg width="14" height="20" viewBox="0 0 14 20" className="nudge-arrow-delayed" aria-hidden="true">
              <path d="M2 3L10 10L2 17" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="square" fill="none" />
            </svg>
            <svg width="14" height="20" viewBox="0 0 14 20" className="nudge-arrow-delayed-2" aria-hidden="true">
              <path d="M2 3L10 10L2 17" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="square" fill="none" />
            </svg>
          </div>
        </div>
      )}

      {/* Text content panel -- slides off when game starts */}
      <motion.div
        className="relative z-10 flex items-start sm:items-center justify-start min-h-screen px-3 sm:px-6 lg:px-8 pt-18 sm:py-16 pointer-events-none"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div
          className="w-full max-w-[300px] sm:max-w-lg lg:max-w-2xl lg:ml-8 xl:ml-16"
          style={{
            transform: `translateX(${gameProgress * -600}px)`,
            opacity: 1 - gameProgress,
            pointerEvents: gameProgress > 0.5 ? "none" : "auto",
          }}
        >
          {/* Semi-transparent panel for text readability */}
          <div className="bg-[var(--panel)]/90 backdrop-blur-sm rounded-lg p-4 sm:p-6 lg:p-8 border border-[var(--border)]/50 shadow-lg">
            <motion.h1
              className="font-[family-name:var(--font-pixelify-sans)] text-2xl sm:text-5xl lg:text-6xl text-[var(--text)] mb-2 sm:mb-4"
              variants={itemVariants}
            >
              {site.name}
            </motion.h1>

            <motion.p
              className="text-base sm:text-2xl text-[var(--accent)] mb-4 sm:mb-8 font-medium min-h-[1.5em] sm:min-h-[2em]"
              variants={itemVariants}
            >
              <TypingEffect text={site.tagline} delay={800} speed={40} />
            </motion.p>

            <motion.p
              className="hidden sm:block text-[var(--muted)] text-lg leading-relaxed mb-8"
              variants={itemVariants}
            >
              &ldquo;Claude, rebuild my personal site into a video game.&rdquo;
              <br /><br />
              While the look has evolved, the goal remains: just as an artist builds a portfolio of works, this site is an attempt to build a portfolio of my thinking.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4 sm:mb-8"
              variants={itemVariants}
            >
              <PixelButton href="/game#writing" variant="primary" glow>
                Read writing
              </PixelButton>
              <PixelButton
                href={site.links.substack}
                variant="secondary"
                external
              >
                Subscribe on Substack
              </PixelButton>
            </motion.div>

            <motion.p
              className="text-xs sm:text-sm text-[var(--muted)]/70"
              variants={itemVariants}
            >
              Builder. Writer. Product Leader. Based in the SF Bay Area.
            </motion.p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
