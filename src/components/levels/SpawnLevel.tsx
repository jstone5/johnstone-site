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

      {/* Text content panel -- slides off when game starts */}
      <motion.div
        className="relative z-10 flex items-center justify-start min-h-screen px-4 sm:px-6 lg:px-8 py-16 pointer-events-none"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div
          className="w-full max-w-2xl lg:ml-8 xl:ml-16"
          style={{
            transform: `translateX(${gameProgress * -600}px)`,
            opacity: 1 - gameProgress,
            pointerEvents: gameProgress > 0.5 ? "none" : "auto",
          }}
        >
          {/* Semi-transparent panel for text readability */}
          <div className="bg-[var(--bg)]/85 backdrop-blur-sm rounded-lg p-6 sm:p-8 border border-[var(--border)]/50 shadow-lg">
            <motion.h1
              className="font-[family-name:var(--font-pixelify-sans)] text-4xl sm:text-5xl lg:text-6xl text-[var(--text)] mb-4"
              variants={itemVariants}
            >
              {site.name}
            </motion.h1>

            <motion.p
              className="text-xl sm:text-2xl text-[var(--accent)] mb-8 font-medium min-h-[2em]"
              variants={itemVariants}
            >
              <TypingEffect text={site.tagline} delay={800} speed={40} />
            </motion.p>

            <motion.p
              className="text-[var(--muted)] text-lg leading-relaxed mb-8"
              variants={itemVariants}
            >
              &ldquo;Claude, rebuild my personal site into a video game.&rdquo;
              <br /><br />
              While the look has evolved, the goal remains: just as an artist builds a portfolio of works, this site is an attempt to build a portfolio of my thinking.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 mb-8"
              variants={itemVariants}
            >
              <PixelButton href="#writing" variant="primary" glow>
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
              className="text-sm text-[var(--muted)]/70"
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
