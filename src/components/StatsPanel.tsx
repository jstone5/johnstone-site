"use client";

import { motion, useReducedMotion } from "framer-motion";

interface Stat {
  name: string;
  value: number; // 0-100
  color?: "accent" | "accent2" | "danger";
}

interface StatsPanelProps {
  stats: Stat[];
  title?: string;
  className?: string;
}

export function StatsPanel({ stats, title, className = "" }: StatsPanelProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      className={`bg-[var(--panel)] border border-[var(--border)] pixel-corners p-4 ${className}`}
    >
      {title && (
        <h4 className="font-[family-name:var(--font-pixelify-sans)] text-sm text-[var(--accent)] mb-3 uppercase tracking-wider">
          {title}
        </h4>
      )}

      <div className="space-y-3">
        {stats.map((stat, index) => (
          <StatBar
            key={stat.name}
            stat={stat}
            delay={prefersReducedMotion ? 0 : index * 0.1}
          />
        ))}
      </div>
    </div>
  );
}

function StatBar({ stat, delay }: { stat: Stat; delay: number }) {
  const prefersReducedMotion = useReducedMotion();

  const colorClasses = {
    accent: "bg-[var(--accent)]",
    accent2: "bg-[var(--accent2)]",
    danger: "bg-[var(--danger)]",
  };

  const glowClasses = {
    accent: "shadow-[0_0_8px_var(--accent)]",
    accent2: "shadow-[0_0_8px_var(--accent2)]",
    danger: "shadow-[0_0_8px_var(--danger)]",
  };

  const color = stat.color || "accent";

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-[var(--muted)] font-medium">{stat.name}</span>
        <span className="text-[var(--text)] font-[family-name:var(--font-pixelify-sans)]">
          {stat.value}
        </span>
      </div>

      {/* Stat bar container */}
      <div className="h-2 bg-[var(--panel)] rounded-sm overflow-hidden">
        <motion.div
          className={`h-full ${colorClasses[color]} ${glowClasses[color]}`}
          initial={{ width: 0 }}
          animate={{ width: `${stat.value}%` }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : {
                  duration: 0.8,
                  delay,
                  ease: "easeOut",
                }
          }
        />
      </div>
    </div>
  );
}

// Character stat block variant (more compact)
export function CharacterStats({
  className = "",
}: {
  className?: string;
}) {
  const stats: Stat[] = [
    { name: "PAYMENTS", value: 90, color: "accent" },
    { name: "PRODUCT", value: 85, color: "accent" },
    { name: "AI/ML", value: 75, color: "accent2" },
    { name: "WRITING", value: 80, color: "accent" },
    { name: "BUILDING", value: 88, color: "accent2" },
  ];

  return (
    <StatsPanel
      stats={stats}
      title="Skills"
      className={className}
    />
  );
}

// Experience/level indicator
export function ExperienceBar({
  level,
  currentXP,
  maxXP,
  className = "",
}: {
  level: number;
  currentXP: number;
  maxXP: number;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();
  const percentage = (currentXP / maxXP) * 100;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex items-center gap-1">
        <span className="text-[var(--accent2)] font-[family-name:var(--font-pixelify-sans)] text-sm">
          LV
        </span>
        <span className="text-[var(--text)] font-[family-name:var(--font-pixelify-sans)] text-lg">
          {level}
        </span>
      </div>

      <div className="flex-1 h-3 bg-[var(--panel)] border border-[var(--border)] rounded-sm overflow-hidden">
        <motion.div
          className="h-full bg-[var(--accent2)] shadow-[0_0_8px_var(--accent2)]"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { duration: 1, ease: "easeOut" }
          }
        />
      </div>

      <span className="text-xs text-[var(--muted)] font-[family-name:var(--font-pixelify-sans)]">
        {currentXP}/{maxXP}
      </span>
    </div>
  );
}
