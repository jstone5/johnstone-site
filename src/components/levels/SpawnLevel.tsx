"use client";

import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { PixelButton } from "@/components/PixelButton";
import { TypingEffect } from "@/components/TypingEffect";
import { HeroScene, CelestialBody } from "@/components/pixel-art";
import { site } from "@/content/site";

export function SpawnLevel() {
  const prefersReducedMotion = useReducedMotion();
  const heroSceneRef = useRef<HTMLDivElement>(null);

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
    <motion.div
      className="grid lg:grid-cols-2 gap-8 items-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hero pixel art scene - hidden on mobile, shown on desktop */}
      <motion.div
        className="hidden lg:block order-2"
        variants={itemVariants}
      >
        <div className="relative">
          <HeroScene
            ref={heroSceneRef}
            className="rounded-lg overflow-hidden border-2 border-[var(--border)] shadow-[0_0_30px_rgba(78,205,196,0.15)]"
          />
          {/* Decorative corners */}
          <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-[var(--accent)]" />
          <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-[var(--accent)]" />
          <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-[var(--accent)]" />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-[var(--accent)]" />
        </div>
      </motion.div>

      {/* Sun/Moon that detaches from scene and follows scroll */}
      <CelestialBody sceneRef={heroSceneRef} />

      {/* Text content */}
      <div className="text-center lg:text-left order-1">
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
        className="text-[var(--muted)] text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0 mb-8"
        variants={itemVariants}
      >
        I build products that help small businesses move money with less friction.
        I&apos;m a Staff Product Manager at Intuit (QuickBooks Payments), I&apos;m building
        Trove on the side, and I write about product craft, AI, and the systems we
        live inside.
      </motion.p>

      <motion.div
        className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8"
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
        Based in the Bay Area. I&apos;m always happy to meet thoughtful builders.
      </motion.p>
      </div>
    </motion.div>
  );
}
