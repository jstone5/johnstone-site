"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { site } from "@/content/site";

export function LinksLevel() {
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

  const linkVariants = {
    hidden: { opacity: 0, x: prefersReducedMotion ? 0 : -10 },
    visible: {
      opacity: 1,
      x: 0,
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
        className="font-[family-name:var(--font-pixelify-sans)] text-3xl sm:text-4xl text-[var(--text)] mb-2"
        variants={itemVariants}
      >
        Links
      </motion.h2>

      <motion.p className="text-[var(--muted)] mb-8" variants={itemVariants}>
        A small set of inputs I come back to. I&apos;ll keep this list intentionally
        short.
      </motion.p>

      <div className="grid gap-6 sm:grid-cols-2">
        {site.linksSection.map((category, categoryIndex) => (
          <motion.div
            key={category.category}
            variants={itemVariants}
            custom={categoryIndex}
          >
            <h3 className="text-sm font-[family-name:var(--font-pixelify-sans)] text-[var(--accent)] uppercase tracking-wider mb-3">
              {category.category}
            </h3>
            <motion.ul
              className="space-y-2"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {category.items.map((item) => (
                <motion.li key={item.title} variants={linkVariants}>
                  <Link
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group text-[var(--muted)] hover:text-[var(--text)] transition-colors text-sm inline-flex items-center gap-1"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">
                      {item.title}
                    </span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[var(--accent)]">
                      &rarr;
                    </span>
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
