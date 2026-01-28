"use client";

import { motion, useReducedMotion } from "framer-motion";

const workItems = [
  {
    title: "Payments strategy at scale",
    description:
      "I lead initiatives in a large payments org focused on invoicing and getting paid faster, including payment method expansion, pricing strategy, and risk-aware rollout plans across multiple customer segments.",
    status: "active",
  },
  {
    title: "Surcharging, thoughtfully",
    description:
      "I've helped shape a practical surcharging strategy: clear customer messaging, careful experimentation, and alignment across product, legal, and compliance so the experience is both effective and trustworthy.",
    status: "completed",
  },
  {
    title: "Fixing broken funnels",
    description:
      "One of my favorite problems: a critical conversion blocker hiding in plain sight. I've led cross-functional teams to instrument the funnel, test fixes, and ship measurable improvements.",
    status: "completed",
  },
  {
    title: "Trove (founder project)",
    description:
      "I built and launched Trove, an AI-powered SMS journaling app that helps dads preserve core family memories. It's live in a small paid beta today.",
    status: "active",
  },
  {
    title: "0-to-1 products + applied AI",
    description:
      "Earlier in my career I built 0-to-1 products for large organizations, including portfolio visibility tools, dashboards, and applied AI prototypes.",
    status: "completed",
  },
];

export function WorkLevel() {
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
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" as const },
    },
  };

  return (
    <div>
      <h2 className="font-[family-name:var(--font-pixelify-sans)] text-3xl sm:text-4xl text-[var(--text)] mb-2">
        Work
      </h2>

      <p className="text-[var(--muted)] mb-8">
        Quest log. High-level by design.
      </p>

      <motion.div
        className="space-y-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {workItems.map((item, index) => (
          <motion.div key={item.title} variants={itemVariants}>
            <QuestItem
              index={index}
              title={item.title}
              description={item.description}
              status={item.status as "active" | "completed"}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

function QuestItem({
  index,
  title,
  description,
  status,
}: {
  index: number;
  title: string;
  description: string;
  status: "active" | "completed";
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className={`
        relative bg-[var(--panel)] border pixel-corners p-4 sm:p-5
        ${status === "active" ? "border-[var(--accent2)]" : "border-[var(--border)]"}
      `}
      whileHover={prefersReducedMotion ? {} : { x: 4 }}
      transition={{ duration: 0.2 }}
    >
      {/* Quest status indicator */}
      <div className="absolute top-3 right-3">
        {status === "active" ? (
          <motion.span
            className="inline-flex items-center gap-1 px-2 py-0.5 bg-[var(--accent2)]/20 border border-[var(--accent2)]/50 text-[var(--accent2)] text-xs font-[family-name:var(--font-pixelify-sans)] pixel-corners-sm"
            animate={prefersReducedMotion ? {} : { opacity: [1, 0.7, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <span className="w-1.5 h-1.5 bg-[var(--accent2)] rounded-full" />
            ACTIVE
          </motion.span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[var(--accent)]/10 border border-[var(--accent)]/30 text-[var(--accent)] text-xs font-[family-name:var(--font-pixelify-sans)] pixel-corners-sm opacity-60">
            <span>✓</span>
            DONE
          </span>
        )}
      </div>

      <div className="flex items-start gap-3 pr-20">
        {/* Quest number */}
        <span className="text-[var(--accent2)] font-[family-name:var(--font-pixelify-sans)] text-sm mt-0.5 opacity-60">
          Q{String(index + 1).padStart(2, "0")}
        </span>

        <div className="flex-1 min-w-0">
          <h3 className="font-[family-name:var(--font-pixelify-sans)] text-lg text-[var(--text)] mb-2">
            {title}
          </h3>
          <p className="text-sm text-[var(--muted)] leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {/* Corner accents for active quests */}
      {status === "active" && (
        <>
          <div className="absolute top-0 left-0 w-2 h-2 bg-[var(--accent2)] opacity-60" />
          <div className="absolute bottom-0 right-0 w-2 h-2 bg-[var(--accent2)] opacity-60" />
        </>
      )}
    </motion.div>
  );
}
