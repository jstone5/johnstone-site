"use client";

import { motion, useReducedMotion } from "framer-motion";

interface IconProps {
  size?: number;
  className?: string;
  animated?: boolean;
}

// Color palette - 16-bit inspired
const colors = {
  // Cyans/Teals (primary accent)
  cyan1: "#4ECDC4",
  cyan2: "#6EE7E7",
  cyan3: "#2A9D8F",
  cyanDark: "#1A535C",

  // Purples/Magentas (secondary accent)
  purple1: "#A855F7",
  purple2: "#C084FC",
  purple3: "#7C3AED",
  purpleDark: "#4C1D95",

  // Golds/Yellows
  gold1: "#F59E0B",
  gold2: "#FBBF24",
  gold3: "#D97706",
  goldDark: "#92400E",

  // Warm tones
  orange1: "#FB923C",
  red1: "#EF4444",
  pink1: "#EC4899",

  // Neutrals
  white: "#F8FAFC",
  gray1: "#CBD5E1",
  gray2: "#94A3B8",
  gray3: "#64748B",
  dark1: "#334155",
  dark2: "#1E293B",
  dark3: "#0F172A",
  black: "#020617",
};

// Spawn Point - Cozy pixel house with chimney smoke
export function SpawnIcon({ size = 32, className = "", animated = true }: IconProps) {
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = animated && !prefersReducedMotion;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      className={`${className}`}
      style={{ imageRendering: "pixelated" }}
    >
      {/* Chimney smoke */}
      {shouldAnimate ? (
        <>
          <motion.rect
            x="22" y="4" width="2" height="2"
            fill={colors.gray2}
            animate={{ y: [4, 2, 4], opacity: [0.8, 0.4, 0.8] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.rect
            x="24" y="2" width="2" height="2"
            fill={colors.gray2}
            animate={{ y: [2, 0, 2], opacity: [0.6, 0.2, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />
        </>
      ) : (
        <>
          <rect x="22" y="4" width="2" height="2" fill={colors.gray2} opacity="0.6" />
          <rect x="24" y="2" width="2" height="2" fill={colors.gray2} opacity="0.4" />
        </>
      )}

      {/* Chimney */}
      <rect x="21" y="8" width="4" height="6" fill={colors.dark1} />
      <rect x="21" y="8" width="4" height="2" fill={colors.dark2} />

      {/* Roof */}
      <polygon points="16,6 4,14 28,14" fill={colors.purple3} />
      <polygon points="16,6 4,14 16,14" fill={colors.purple1} />
      <rect x="4" y="14" width="24" height="2" fill={colors.purpleDark} />

      {/* House body */}
      <rect x="6" y="16" width="20" height="14" fill={colors.cyan2} />
      <rect x="6" y="16" width="20" height="2" fill={colors.cyan1} />
      <rect x="6" y="28" width="20" height="2" fill={colors.cyanDark} />

      {/* Door */}
      <rect x="13" y="20" width="6" height="10" fill={colors.gold3} />
      <rect x="13" y="20" width="6" height="2" fill={colors.gold1} />
      <rect x="17" y="24" width="1" height="2" fill={colors.goldDark} />

      {/* Window left */}
      <rect x="7" y="20" width="4" height="4" fill={colors.gold2} />
      <rect x="7" y="20" width="4" height="1" fill={colors.white} opacity="0.5" />
      <rect x="9" y="20" width="1" height="4" fill={colors.dark2} />
      <rect x="7" y="22" width="4" height="1" fill={colors.dark2} />

      {/* Window right */}
      <rect x="21" y="20" width="4" height="4" fill={colors.gold2} />
      <rect x="21" y="20" width="4" height="1" fill={colors.white} opacity="0.5" />
      <rect x="23" y="20" width="1" height="4" fill={colors.dark2} />
      <rect x="21" y="22" width="4" height="1" fill={colors.dark2} />

      {/* Ground */}
      <rect x="2" y="30" width="28" height="2" fill={colors.cyanDark} />
    </svg>
  );
}

// Knowledge Tower - Medieval tower with glowing window
export function KnowledgeIcon({ size = 32, className = "", animated = true }: IconProps) {
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = animated && !prefersReducedMotion;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      className={className}
      style={{ imageRendering: "pixelated" }}
    >
      {/* Tower flag */}
      {shouldAnimate ? (
        <motion.g
          animate={{ x: [0, 1, 0, -1, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <rect x="15" y="2" width="2" height="6" fill={colors.dark2} />
          <polygon points="17,2 17,6 23,4" fill={colors.purple1} />
        </motion.g>
      ) : (
        <g>
          <rect x="15" y="2" width="2" height="6" fill={colors.dark2} />
          <polygon points="17,2 17,6 23,4" fill={colors.purple1} />
        </g>
      )}

      {/* Tower top/roof */}
      <polygon points="16,6 8,12 24,12" fill={colors.purple2} />
      <polygon points="16,6 8,12 16,12" fill={colors.purple1} />

      {/* Tower body upper */}
      <rect x="10" y="12" width="12" height="8" fill={colors.gray1} />
      <rect x="10" y="12" width="12" height="2" fill={colors.white} />

      {/* Upper window with glow */}
      <rect x="14" y="14" width="4" height="4" fill={colors.gold2} />
      {shouldAnimate && (
        <motion.rect
          x="14" y="14" width="4" height="4"
          fill={colors.gold1}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
      <rect x="14" y="14" width="4" height="1" fill={colors.white} opacity="0.5" />

      {/* Tower body lower */}
      <rect x="8" y="20" width="16" height="10" fill={colors.gray2} />
      <rect x="8" y="20" width="16" height="2" fill={colors.gray1} />

      {/* Lower windows */}
      <rect x="10" y="22" width="3" height="4" fill={colors.cyan2} />
      <rect x="19" y="22" width="3" height="4" fill={colors.cyan2} />

      {/* Door */}
      <rect x="14" y="26" width="4" height="4" fill={colors.dark2} />
      <rect x="14" y="26" width="4" height="1" fill={colors.dark1} />

      {/* Stone details */}
      <rect x="8" y="24" width="2" height="1" fill={colors.gray3} />
      <rect x="22" y="26" width="2" height="1" fill={colors.gray3} />
      <rect x="12" y="28" width="1" height="1" fill={colors.gray3} />

      {/* Ground */}
      <rect x="4" y="30" width="24" height="2" fill={colors.cyanDark} />
    </svg>
  );
}

// Quest Board - Wooden board with pinned papers
export function QuestIcon({ size = 32, className = "", animated = true }: IconProps) {
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = animated && !prefersReducedMotion;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      className={className}
      style={{ imageRendering: "pixelated" }}
    >
      {/* Posts */}
      <rect x="6" y="6" width="3" height="24" fill={colors.gold3} />
      <rect x="6" y="6" width="1" height="24" fill={colors.gold1} />
      <rect x="23" y="6" width="3" height="24" fill={colors.gold3} />
      <rect x="23" y="6" width="1" height="24" fill={colors.gold1} />

      {/* Board */}
      <rect x="4" y="8" width="24" height="18" fill={colors.goldDark} />
      <rect x="5" y="9" width="22" height="16" fill={colors.gold3} />
      <rect x="5" y="9" width="22" height="2" fill={colors.gold1} />

      {/* Paper 1 - main quest */}
      {shouldAnimate ? (
        <motion.g
          animate={{ rotate: [-1, 1, -1] }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{ transformOrigin: "12px 11px" }}
        >
          <rect x="7" y="11" width="8" height="10" fill={colors.white} />
          <rect x="7" y="11" width="8" height="1" fill={colors.gray1} />
          <rect x="8" y="13" width="6" height="1" fill={colors.gray2} />
          <rect x="8" y="15" width="4" height="1" fill={colors.gray2} />
          <rect x="8" y="17" width="5" height="1" fill={colors.gray2} />
          <rect x="10" y="10" width="2" height="2" fill={colors.red1} />
        </motion.g>
      ) : (
        <g>
          <rect x="7" y="11" width="8" height="10" fill={colors.white} />
          <rect x="8" y="13" width="6" height="1" fill={colors.gray2} />
          <rect x="8" y="15" width="4" height="1" fill={colors.gray2} />
          <rect x="8" y="17" width="5" height="1" fill={colors.gray2} />
          <rect x="10" y="10" width="2" height="2" fill={colors.red1} />
        </g>
      )}

      {/* Paper 2 */}
      <rect x="17" y="12" width="7" height="8" fill={colors.gray1} />
      <rect x="18" y="14" width="5" height="1" fill={colors.gray3} />
      <rect x="18" y="16" width="3" height="1" fill={colors.gray3} />
      <rect x="20" y="11" width="2" height="2" fill={colors.cyan1} />

      {/* Paper 3 - completed */}
      <rect x="9" y="18" width="6" height="5" fill={colors.cyan2} />
      <rect x="11" y="17" width="2" height="2" fill={colors.purple1} />

      {/* Star decoration */}
      {shouldAnimate && (
        <motion.g
          animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 1, repeat: Infinity }}
          style={{ transformOrigin: "22px 20px" }}
        >
          <rect x="21" y="19" width="2" height="2" fill={colors.gold2} />
        </motion.g>
      )}

      {/* Ground */}
      <rect x="4" y="30" width="24" height="2" fill={colors.cyanDark} />
    </svg>
  );
}

// Archive Library - Stack of books with magical glow
export function ArchiveIcon({ size = 32, className = "", animated = true }: IconProps) {
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = animated && !prefersReducedMotion;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      className={className}
      style={{ imageRendering: "pixelated" }}
    >
      {/* Magical particles */}
      {shouldAnimate && (
        <>
          <motion.rect
            x="6" y="8" width="2" height="2"
            fill={colors.cyan1}
            animate={{ y: [8, 4, 8], opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.rect
            x="24" y="12" width="2" height="2"
            fill={colors.purple1}
            animate={{ y: [12, 8, 12], opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.7 }}
          />
          <motion.rect
            x="14" y="6" width="2" height="2"
            fill={colors.gold2}
            animate={{ y: [6, 2, 6], opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1.4 }}
          />
        </>
      )}

      {/* Book stack base/shelf */}
      <rect x="4" y="28" width="24" height="2" fill={colors.gold3} />
      <rect x="4" y="28" width="24" height="1" fill={colors.gold1} />

      {/* Large book 1 - bottom */}
      <rect x="6" y="22" width="20" height="6" fill={colors.purple3} />
      <rect x="6" y="22" width="20" height="1" fill={colors.purple1} />
      <rect x="7" y="27" width="18" height="1" fill={colors.purpleDark} />
      <rect x="8" y="24" width="14" height="2" fill={colors.gold2} />

      {/* Medium book 2 */}
      <rect x="8" y="17" width="16" height="5" fill={colors.cyan3} />
      <rect x="8" y="17" width="16" height="1" fill={colors.cyan1} />
      <rect x="9" y="21" width="14" height="1" fill={colors.cyanDark} />
      <rect x="10" y="19" width="10" height="1" fill={colors.gold2} />

      {/* Small book 3 */}
      <rect x="10" y="13" width="12" height="4" fill={colors.red1} />
      <rect x="10" y="13" width="12" height="1" fill={colors.orange1} />
      <rect x="12" y="15" width="6" height="1" fill={colors.gold2} />

      {/* Open book on top */}
      <rect x="9" y="10" width="14" height="3" fill={colors.white} />
      <rect x="9" y="10" width="7" height="3" fill={colors.gray1} />
      <rect x="15" y="10" width="2" height="3" fill={colors.gold3} />

      {/* Book page lines */}
      <rect x="10" y="11" width="4" height="1" fill={colors.gray2} />
      <rect x="18" y="11" width="4" height="1" fill={colors.gray2} />

      {/* Magical glow from open book */}
      {shouldAnimate && (
        <motion.rect
          x="13" y="8" width="6" height="2"
          fill={colors.cyan2}
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
    </svg>
  );
}

// Treasure Vault - Gem-filled chest
export function TreasureIcon({ size = 32, className = "", animated = true }: IconProps) {
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = animated && !prefersReducedMotion;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      className={className}
      style={{ imageRendering: "pixelated" }}
    >
      {/* Sparkles */}
      {shouldAnimate && (
        <>
          <motion.rect
            x="8" y="6" width="2" height="2"
            fill={colors.gold2}
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <motion.rect
            x="22" y="8" width="2" height="2"
            fill={colors.cyan1}
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
          />
          <motion.rect
            x="14" y="4" width="2" height="2"
            fill={colors.purple1}
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.6 }}
          />
        </>
      )}

      {/* Chest lid - open */}
      <rect x="6" y="10" width="20" height="6" fill={colors.gold3} />
      <rect x="6" y="10" width="20" height="2" fill={colors.gold1} />
      <rect x="8" y="10" width="16" height="1" fill={colors.gold2} />

      {/* Lid inner */}
      <rect x="8" y="12" width="16" height="3" fill={colors.goldDark} />

      {/* Chest body */}
      <rect x="4" y="16" width="24" height="12" fill={colors.gold3} />
      <rect x="4" y="16" width="24" height="2" fill={colors.gold1} />
      <rect x="4" y="26" width="24" height="2" fill={colors.goldDark} />

      {/* Chest lock plate */}
      <rect x="13" y="18" width="6" height="6" fill={colors.dark2} />
      <rect x="14" y="19" width="4" height="4" fill={colors.dark1} />
      <rect x="15" y="20" width="2" height="2" fill={colors.gold2} />

      {/* Metal bands */}
      <rect x="4" y="20" width="24" height="2" fill={colors.dark1} />
      <rect x="4" y="20" width="24" height="1" fill={colors.gray3} />

      {/* Gems peeking out */}
      <rect x="8" y="14" width="3" height="3" fill={colors.cyan1} />
      <rect x="8" y="14" width="3" height="1" fill={colors.cyan2} />

      <rect x="13" y="13" width="3" height="3" fill={colors.purple1} />
      <rect x="13" y="13" width="3" height="1" fill={colors.purple2} />

      <rect x="18" y="14" width="3" height="3" fill={colors.red1} />
      <rect x="18" y="14" width="3" height="1" fill={colors.orange1} />

      {/* Coins */}
      <rect x="22" y="15" width="2" height="2" fill={colors.gold2} />
      <rect x="6" y="15" width="2" height="2" fill={colors.gold2} />

      {/* Ground */}
      <rect x="2" y="28" width="28" height="2" fill={colors.cyanDark} />
    </svg>
  );
}

// Message Tower - Communication tower with signal waves
export function MessageIcon({ size = 32, className = "", animated = true }: IconProps) {
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = animated && !prefersReducedMotion;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      className={className}
      style={{ imageRendering: "pixelated" }}
    >
      {/* Signal waves */}
      {shouldAnimate ? (
        <>
          <motion.path
            d="M 20 6 Q 24 6 24 10"
            stroke={colors.cyan1}
            strokeWidth="2"
            fill="none"
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <motion.path
            d="M 22 4 Q 28 4 28 10"
            stroke={colors.cyan2}
            strokeWidth="2"
            fill="none"
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
          />
          <motion.path
            d="M 24 2 Q 30 2 30 8"
            stroke={colors.purple1}
            strokeWidth="2"
            fill="none"
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
          />
        </>
      ) : (
        <path
          d="M 22 4 Q 28 4 28 10"
          stroke={colors.cyan1}
          strokeWidth="2"
          fill="none"
          opacity="0.5"
        />
      )}

      {/* Tower antenna */}
      <rect x="15" y="4" width="2" height="8" fill={colors.gray2} />
      <rect x="14" y="8" width="4" height="2" fill={colors.gray3} />
      <rect x="15" y="4" width="2" height="2" fill={colors.cyan1} />

      {/* Tower top */}
      <polygon points="16,10 8,16 24,16" fill={colors.purple2} />
      <polygon points="16,10 8,16 16,16" fill={colors.purple1} />

      {/* Tower body */}
      <rect x="10" y="16" width="12" height="12" fill={colors.gray1} />
      <rect x="10" y="16" width="12" height="2" fill={colors.white} />

      {/* Window with glow */}
      <rect x="13" y="18" width="6" height="4" fill={colors.cyan2} />
      {shouldAnimate && (
        <motion.rect
          x="13" y="18" width="6" height="4"
          fill={colors.cyan1}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}
      <rect x="13" y="18" width="6" height="1" fill={colors.white} opacity="0.5" />
      <rect x="16" y="18" width="1" height="4" fill={colors.dark2} />

      {/* Door */}
      <rect x="13" y="24" width="6" height="4" fill={colors.dark2} />
      <rect x="13" y="24" width="6" height="1" fill={colors.dark1} />

      {/* Decorative elements */}
      <rect x="10" y="22" width="2" height="2" fill={colors.purple3} />
      <rect x="20" y="22" width="2" height="2" fill={colors.purple3} />

      {/* Ground */}
      <rect x="4" y="28" width="24" height="2" fill={colors.cyanDark} />
    </svg>
  );
}

// Export all icons
export const LocationIcons = {
  spawn: SpawnIcon,
  about: KnowledgeIcon,
  work: QuestIcon,
  writing: ArchiveIcon,
  links: TreasureIcon,
  subscribe: MessageIcon,
};
