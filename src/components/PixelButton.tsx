"use client";

import { forwardRef } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

interface PixelButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  external?: boolean;
  className?: string;
  type?: "button" | "submit";
  glow?: boolean;
}

export const PixelButton = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  PixelButtonProps
>(function PixelButton(
  {
    children,
    href,
    onClick,
    variant = "primary",
    external = false,
    className = "",
    type = "button",
    glow = false,
  },
  ref
) {
  const prefersReducedMotion = useReducedMotion();

  const baseStyles =
    "inline-flex items-center justify-center px-6 py-3 text-sm font-medium transition-all pixel-corners cursor-pointer";

  const variantStyles = {
    primary:
      "bg-[var(--accent)] text-[var(--bg)] hover:bg-[var(--accent2)] active:translate-y-[2px] hover:shadow-[0_0_20px_rgba(110,231,255,0.3)]",
    secondary:
      "bg-transparent text-[var(--text)] border-2 border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)] active:translate-y-[2px] hover:shadow-[0_0_15px_rgba(110,231,255,0.15)]",
  };

  const glowStyles = glow && variant === "primary" ? "glow-pulse" : "";

  const combinedStyles = `${baseStyles} ${variantStyles[variant]} ${glowStyles} ${className}`;

  const motionProps = {
    whileHover: prefersReducedMotion ? {} : { scale: 1.02 },
    whileTap: prefersReducedMotion ? {} : { scale: 0.98, y: 2 },
    transition: { type: "spring" as const, stiffness: 400, damping: 17 },
  };

  if (href) {
    if (external) {
      return (
        <motion.a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={combinedStyles}
          {...motionProps}
        >
          {children}
        </motion.a>
      );
    }

    // Use Next.js Link as a wrapper for internal links
    return (
      <Link href={href} className={combinedStyles}>
        <motion.span
          className="inline-flex items-center justify-center w-full h-full"
          {...motionProps}
        >
          {children}
        </motion.span>
      </Link>
    );
  }

  return (
    <motion.button
      ref={ref as React.Ref<HTMLButtonElement>}
      type={type}
      onClick={onClick}
      className={combinedStyles}
      {...motionProps}
    >
      {children}
    </motion.button>
  );
});
