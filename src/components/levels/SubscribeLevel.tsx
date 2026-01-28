"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { PixelButton } from "@/components/PixelButton";
import { site } from "@/content/site";

const socialLinks = [
  { label: "LinkedIn", href: site.links.linkedin },
  { label: "X / Twitter", href: site.links.x },
  { label: "Trove", href: site.links.trove },
].filter((link) => link.href);

export function SubscribeLevel() {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.15,
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
      className="text-center max-w-xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      <motion.h2
        className="font-[family-name:var(--font-pixelify-sans)] text-3xl sm:text-4xl text-[var(--text)] mb-2"
        variants={itemVariants}
      >
        Subscribe
      </motion.h2>

      <motion.p
        className="text-[var(--muted)] mb-8 text-lg leading-relaxed"
        variants={itemVariants}
      >
        If you like essays about product, AI, and the future of work, subscribe on
        Substack. New posts show up there first, and this site stays in sync
        automatically.
      </motion.p>

      <motion.div
        className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
        variants={itemVariants}
      >
        <PixelButton href={site.links.substack} variant="primary" external glow>
          Subscribe on Substack
        </PixelButton>
        <PixelButton href="/writing" variant="secondary">
          Or read the archive
        </PixelButton>
      </motion.div>

      {/* Social links */}
      {socialLinks.length > 0 && (
        <motion.div variants={itemVariants}>
          <p className="text-sm text-[var(--muted)] mb-4">
            Find me elsewhere
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {socialLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group text-sm text-[var(--accent)] hover:text-[var(--accent2)] transition-colors inline-flex items-center gap-1"
              >
                {link.label}
                <span className="inline-block transition-transform group-hover:translate-x-1 opacity-0 group-hover:opacity-100">
                  &rarr;
                </span>
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
