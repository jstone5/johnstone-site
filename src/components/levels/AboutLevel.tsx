"use client";

import { motion, useReducedMotion } from "framer-motion";
import { DialogBox } from "@/components/DialogBox";
import { CharacterStats } from "@/components/StatsPanel";

const interests = [
  "Product craft",
  "FinTech + payments",
  "AI as a building tool",
  "Writing to think",
  "Building in public",
  "Family + memory",
];

export function AboutLevel() {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" as const },
    },
  };

  const tagVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" as const },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      <motion.h2
        className="font-[family-name:var(--font-pixelify-sans)] text-3xl sm:text-4xl text-[var(--text)] mb-8"
        variants={itemVariants}
      >
        About
      </motion.h2>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main bio in dialog box style */}
        <motion.div className="lg:col-span-2" variants={itemVariants}>
          <DialogBox speaker="Bio" variant="npc">
            <div className="space-y-4 text-[var(--muted)] leading-relaxed">
              <p>
                I love building products users love. As an experienced product leader,
                I&apos;ve delivered $XXM impact across B2B and B2C contexts and in highly
                regulated spaces like Payments. In my role at Intuit, I empower small
                businesses by helping them bill and get paid by their customers.
              </p>

              <p>
                Outside of work, I like building with and exploring AI. As a new dad, I
                was surprised there were no digital baby books targeting fathers, so I
                built one. <em>Trove</em> texts dads a prompt on fatherhood 2x per week;
                they reply via SMS with a photo and reflection about a recent cherished
                moment with their kids.
              </p>

              <p>
                As a writer, I pen essays about product, AI, and peering into the future.
                Much like an artist builds a portfolio of works, I write to build a
                portfolio of my thinking.
              </p>
            </div>
          </DialogBox>
        </motion.div>

        {/* Stats panel */}
        <motion.div variants={itemVariants}>
          <CharacterStats />
        </motion.div>
      </div>

      {/* Interests as inventory items */}
      <motion.div className="mt-8" variants={itemVariants}>
        <h3 className="text-sm font-[family-name:var(--font-pixelify-sans)] text-[var(--accent)] uppercase tracking-wider mb-4">
          Equipped Interests
        </h3>
        <motion.div
          className="flex flex-wrap gap-2"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {interests.map((interest, index) => (
            <motion.span
              key={interest}
              variants={tagVariants}
              whileHover={prefersReducedMotion ? {} : { scale: 1.05, y: -2 }}
              className="group px-3 py-1.5 bg-[var(--panel)] border border-[var(--border)] text-sm text-[var(--muted)] pixel-corners-sm cursor-default transition-colors hover:text-[var(--accent)] hover:border-[var(--accent)]"
            >
              <span className="text-[var(--accent2)] mr-1 opacity-60 group-hover:opacity-100">
                [{index + 1}]
              </span>
              {interest}
            </motion.span>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
