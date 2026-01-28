"use client";

import { motion } from "framer-motion";
import { useSound } from "@/contexts/SoundContext";

export function SoundToggle() {
  const { enabled, toggle, init } = useSound();

  const handleClick = () => {
    init(); // Initialize audio context on first interaction
    toggle();
  };

  return (
    <motion.button
      onClick={handleClick}
      className="relative w-8 h-8 flex items-center justify-center text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label={enabled ? "Mute sounds" : "Unmute sounds"}
      title={enabled ? "Sound ON" : "Sound OFF"}
    >
      {enabled ? (
        // Speaker with waves (sound on)
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M3 7H6L10 3V17L6 13H3V7Z"
            fill="currentColor"
          />
          <path
            d="M13 7C13.5 7.5 14 8.5 14 10C14 11.5 13.5 12.5 13 13"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="square"
          />
          <path
            d="M15 5C16 6 17 8 17 10C17 12 16 14 15 15"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="square"
          />
        </svg>
      ) : (
        // Speaker with X (sound off)
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M3 7H6L10 3V17L6 13H3V7Z"
            fill="currentColor"
            opacity="0.5"
          />
          <path
            d="M13 8L17 12M17 8L13 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="square"
          />
        </svg>
      )}
    </motion.button>
  );
}
