"use client";

import { useState, useEffect, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface DialogBoxProps {
  children: ReactNode;
  speaker?: string;
  className?: string;
  showContinue?: boolean;
  variant?: "default" | "system" | "npc";
}

export function DialogBox({
  children,
  speaker,
  className = "",
  showContinue = false,
  variant = "default",
}: DialogBoxProps) {
  const prefersReducedMotion = useReducedMotion();

  const variantStyles = {
    default: "border-[var(--border)]",
    system: "border-[var(--accent)]/50",
    npc: "border-[var(--accent2)]/50",
  };

  const speakerColors = {
    default: "text-[var(--text)]",
    system: "text-[var(--accent)]",
    npc: "text-[var(--accent2)]",
  };

  return (
    <motion.div
      className={`relative ${className}`}
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" as const }}
    >
      {/* Main dialog box */}
      <div
        className={`
          relative bg-[var(--panel)] border-2 ${variantStyles[variant]}
          pixel-corners p-4 sm:p-6
        `}
      >
        {/* Corner decorations - pixel art style */}
        <div className="absolute top-0 left-0 w-2 h-2 bg-[var(--accent)] opacity-60" />
        <div className="absolute top-0 right-0 w-2 h-2 bg-[var(--accent)] opacity-60" />
        <div className="absolute bottom-0 left-0 w-2 h-2 bg-[var(--accent)] opacity-60" />
        <div className="absolute bottom-0 right-0 w-2 h-2 bg-[var(--accent)] opacity-60" />

        {/* Speaker label */}
        {speaker && (
          <div className="absolute -top-3 left-4 px-2 bg-[var(--panel)]">
            <span className={`font-[family-name:var(--font-pixelify-sans)] text-sm ${speakerColors[variant]}`}>
              {speaker}
            </span>
          </div>
        )}

        {/* Content */}
        <div className="text-[var(--muted)]">
          {children}
        </div>

        {/* Continue prompt */}
        {showContinue && (
          <motion.div
            className="absolute bottom-2 right-4 text-[var(--accent)] text-sm font-[family-name:var(--font-pixelify-sans)]"
            animate={prefersReducedMotion ? {} : { opacity: [1, 0.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <span className="mr-1">▼</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// Simplified dialog for inline content
export function InlineDialog({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`
        relative bg-[var(--panel)]/80 border border-[var(--border)]
        pixel-corners-sm px-3 py-2
        ${className}
      `}
    >
      {children}
    </div>
  );
}

// Dialog with typing animation
export function TypedDialog({
  text,
  speaker,
  className = "",
  onComplete,
}: {
  text: string;
  speaker?: string;
  className?: string;
  onComplete?: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <DialogBox speaker={speaker} className={className} showContinue>
      <TypedText text={text} onComplete={onComplete} skip={!!prefersReducedMotion} />
    </DialogBox>
  );
}

// Internal typing component
function TypedText({
  text,
  onComplete,
  skip = false,
}: {
  text: string;
  onComplete?: () => void;
  skip?: boolean;
}) {
  const [displayedText, setDisplayedText] = useState(skip ? text : "");
  const [isComplete, setIsComplete] = useState(skip);

  useEffect(() => {
    if (skip) {
      setDisplayedText(text);
      setIsComplete(true);
      onComplete?.();
      return;
    }

    let index = 0;
    const interval = setInterval(() => {
      if (index <= text.length) {
        setDisplayedText(text.slice(0, index));
        index++;
      } else {
        setIsComplete(true);
        onComplete?.();
        clearInterval(interval);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [text, skip, onComplete]);

  return (
    <span className="leading-relaxed">
      {displayedText}
      {!isComplete && (
        <motion.span
          className="inline-block w-2 h-4 bg-[var(--accent)] ml-1"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.4, repeat: Infinity }}
        />
      )}
    </span>
  );
}

