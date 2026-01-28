"use client";

import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface TypingEffectProps {
  text: string;
  className?: string;
  delay?: number;
  speed?: number;
}

export function TypingEffect({
  text,
  className = "",
  delay = 500,
  speed = 50,
}: TypingEffectProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayedText(text);
      setIsComplete(true);
      return;
    }

    const timer = setTimeout(() => {
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayedText(text.slice(0, currentIndex));
          currentIndex++;
        } else {
          setIsComplete(true);
          clearInterval(interval);
        }
      }, speed);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timer);
  }, [text, delay, speed, prefersReducedMotion]);

  return (
    <span className={className}>
      {displayedText}
      {!isComplete && (
        <motion.span
          className="inline-block w-[3px] h-[1em] bg-[var(--accent)] ml-1 align-middle"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        />
      )}
    </span>
  );
}
