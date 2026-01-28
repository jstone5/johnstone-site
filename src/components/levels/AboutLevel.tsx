"use client";

import { motion, useReducedMotion } from "framer-motion";
import { DialogBox } from "@/components/DialogBox";
import { CharacterStats } from "@/components/StatsPanel";

const interests = [
  "Payments + pricing",
  "AI product craft",
  "Building in public",
  "Writing to think",
  "Family + memory",
  "Personal finance",
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
                I&apos;m a product manager who likes messy, regulated problems: payments,
                pricing, and the last mile between intent and money moving. At Intuit, I
                work in QuickBooks Payments, where I&apos;ve led 0-to-1 and growth initiatives
                across invoicing and payments experiences.
              </p>

              <p>
                Before Intuit, I built 0-to-1 internal products at Deloitte Consulting,
                including systems used by government leaders to manage complex portfolios
                and make high-stakes decisions. I also led applied AI work, including
                model bias evaluations and computer vision prototypes.
              </p>

              <p>
                I earned my MBA at Kellogg and studied mechanical engineering at Clemson.
                I write to think, and one of my essays on AI and product craft was
                featured by Tyler Cowen&apos;s Marginal Revolution.
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
