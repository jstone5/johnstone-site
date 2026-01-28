"use client";

import { useState, useEffect } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";

// Color palette
const colors = {
  // Companion colors - a cute cyan/teal creature
  body1: "#4ECDC4",
  body2: "#6EE7E7",
  bodyDark: "#2A9D8F",
  bodyShadow: "#1A535C",

  // Accents
  eyes: "#1E293B",
  eyeShine: "#FFFFFF",
  cheeks: "#F472B6",
  sparkle: "#FBBF24",

  // Alt colors for variations
  purple1: "#A855F7",
  purple2: "#C084FC",
  purpleDark: "#7C3AED",
};

interface CompanionProps {
  size?: number;
  mood?: "idle" | "happy" | "curious" | "sleepy";
  position?: { x: number; y: number };
  showSpeechBubble?: boolean;
  speechText?: string;
  onClick?: () => void;
}

// Main companion - a cute pixel slime/blob creature
export function PixelCompanion({
  size = 48,
  mood = "idle",
  position,
  showSpeechBubble = false,
  speechText = "",
  onClick,
}: CompanionProps) {
  const prefersReducedMotion = useReducedMotion();
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Animation frames
  useEffect(() => {
    if (prefersReducedMotion) return;

    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % 4);
    }, 500);

    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  // Bounce animation based on frame
  const bounceOffset = [0, -2, 0, -1][currentFrame];
  const squashScale = [1, 0.95, 1, 0.98][currentFrame];

  const positionStyle = position
    ? { position: "fixed" as const, left: position.x, top: position.y }
    : {};

  return (
    <motion.div
      className={`inline-block ${onClick ? "cursor-pointer" : ""}`}
      style={positionStyle}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={prefersReducedMotion ? {} : {
        y: bounceOffset,
        scaleX: isHovered ? 1.1 : squashScale,
        scaleY: isHovered ? 0.9 : 1,
      }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      whileTap={prefersReducedMotion ? {} : { scale: 0.9 }}
    >
      {/* Speech bubble */}
      <AnimatePresence>
        {showSpeechBubble && speechText && (
          <motion.div
            className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-slate-800 px-3 py-1 rounded text-xs whitespace-nowrap font-[family-name:var(--font-pixelify-sans)]"
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.9 }}
            style={{
              clipPath: `polygon(
                0 0,
                100% 0,
                100% calc(100% - 6px),
                calc(50% + 6px) calc(100% - 6px),
                50% 100%,
                calc(50% - 6px) calc(100% - 6px),
                0 calc(100% - 6px)
              )`,
            }}
          >
            {speechText}
          </motion.div>
        )}
      </AnimatePresence>

      <svg
        width={size}
        height={size}
        viewBox="0 0 16 16"
        style={{ imageRendering: "pixelated" }}
      >
        {/* Shadow */}
        <ellipse cx="8" cy="15" rx="5" ry="1" fill={colors.bodyShadow} opacity="0.3" />

        {/* Body */}
        <CompanionBody mood={mood} isHovered={isHovered} />

        {/* Face */}
        <CompanionFace mood={mood} prefersReducedMotion={prefersReducedMotion} />

        {/* Sparkle when hovered */}
        {isHovered && !prefersReducedMotion && (
          <motion.g
            animate={{ opacity: [0, 1, 0], scale: [0.8, 1, 0.8] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            <rect x="2" y="2" width="2" height="2" fill={colors.sparkle} />
            <rect x="12" y="4" width="2" height="2" fill={colors.sparkle} />
          </motion.g>
        )}
      </svg>
    </motion.div>
  );
}

function CompanionBody({ mood, isHovered }: { mood: string; isHovered: boolean }) {
  // Slightly different shape when happy
  const isHappy = mood === "happy" || isHovered;

  return (
    <g>
      {/* Main body shape */}
      <rect x="4" y="4" width="8" height="2" fill={colors.body2} />
      <rect x="3" y="6" width="10" height="2" fill={colors.body1} />
      <rect x="2" y="8" width="12" height="4" fill={colors.body1} />
      <rect x="3" y="12" width="10" height="2" fill={colors.bodyDark} />
      <rect x="5" y="14" width="6" height="1" fill={colors.bodyDark} />

      {/* Highlight */}
      <rect x="4" y="4" width="2" height="2" fill={colors.body2} />
      <rect x="3" y="6" width="2" height="2" fill={colors.body2} />

      {/* Top bump for happy mood */}
      {isHappy && (
        <rect x="6" y="3" width="4" height="1" fill={colors.body2} />
      )}

      {/* Side bumps (ears/antennae) */}
      <rect x="1" y="7" width="2" height="2" fill={colors.body1} />
      <rect x="13" y="7" width="2" height="2" fill={colors.body1} />
    </g>
  );
}

function CompanionFace({ mood, prefersReducedMotion }: { mood: string; prefersReducedMotion: boolean | null }) {
  // Eye animation
  const [blinking, setBlinking] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const blinkInterval = setInterval(() => {
      setBlinking(true);
      setTimeout(() => setBlinking(false), 150);
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(blinkInterval);
  }, [prefersReducedMotion]);

  const eyeHeight = blinking || mood === "sleepy" ? 1 : 2;

  return (
    <g>
      {/* Eyes */}
      <rect x="5" y="8" width="2" height={eyeHeight} fill={colors.eyes} />
      <rect x="9" y="8" width="2" height={eyeHeight} fill={colors.eyes} />

      {/* Eye shine */}
      {!blinking && mood !== "sleepy" && (
        <>
          <rect x="5" y="8" width="1" height="1" fill={colors.eyeShine} />
          <rect x="9" y="8" width="1" height="1" fill={colors.eyeShine} />
        </>
      )}

      {/* Cheeks */}
      <rect x="3" y="10" width="2" height="1" fill={colors.cheeks} opacity="0.5" />
      <rect x="11" y="10" width="2" height="1" fill={colors.cheeks} opacity="0.5" />

      {/* Mouth varies by mood */}
      {mood === "happy" && (
        <>
          <rect x="6" y="11" width="4" height="1" fill={colors.eyes} />
          <rect x="5" y="10" width="1" height="1" fill={colors.eyes} />
          <rect x="10" y="10" width="1" height="1" fill={colors.eyes} />
        </>
      )}
      {mood === "idle" && (
        <rect x="7" y="11" width="2" height="1" fill={colors.eyes} />
      )}
      {mood === "curious" && (
        <>
          <rect x="7" y="10" width="3" height="2" fill={colors.eyes} />
          <rect x="8" y="10" width="1" height="1" fill={colors.bodyDark} />
        </>
      )}
      {mood === "sleepy" && (
        <rect x="7" y="11" width="2" height="1" fill={colors.eyes} opacity="0.5" />
      )}
    </g>
  );
}

// Floating companion that follows scroll position
export function FloatingCompanion() {
  const prefersReducedMotion = useReducedMotion();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [mood, setMood] = useState<"idle" | "happy" | "curious">("idle");
  const [showBubble, setShowBubble] = useState(false);
  const [speechText, setSpeechText] = useState("");

  const speeches = [
    "Welcome!",
    "Keep exploring!",
    "Nice to meet you!",
    "Try the Konami code!",
    "Click me!",
  ];

  useEffect(() => {
    // Position in bottom right
    const updatePosition = () => {
      setPosition({
        x: window.innerWidth - 80,
        y: window.innerHeight - 100,
      });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    return () => window.removeEventListener("resize", updatePosition);
  }, []);

  // Random mood changes
  useEffect(() => {
    if (prefersReducedMotion) return;

    const moodInterval = setInterval(() => {
      const moods: Array<"idle" | "happy" | "curious"> = ["idle", "happy", "curious"];
      setMood(moods[Math.floor(Math.random() * moods.length)]);
    }, 5000);

    return () => clearInterval(moodInterval);
  }, [prefersReducedMotion]);

  const handleClick = () => {
    setMood("happy");
    setSpeechText(speeches[Math.floor(Math.random() * speeches.length)]);
    setShowBubble(true);
    setTimeout(() => setShowBubble(false), 2000);
  };

  if (prefersReducedMotion) return null;

  return (
    <div className="fixed z-50 pointer-events-auto" style={{ left: position.x, top: position.y }}>
      <PixelCompanion
        size={48}
        mood={mood}
        showSpeechBubble={showBubble}
        speechText={speechText}
        onClick={handleClick}
      />
    </div>
  );
}

// Mini companion for inline use
export function MiniCompanion({ size = 24 }: { size?: number }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.span
      className="inline-block align-middle"
      animate={prefersReducedMotion ? {} : { y: [0, -2, 0] }}
      transition={{ duration: 1, repeat: Infinity }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 8 8"
        style={{ imageRendering: "pixelated" }}
      >
        {/* Simplified body */}
        <rect x="1" y="2" width="6" height="1" fill={colors.body2} />
        <rect x="0" y="3" width="8" height="3" fill={colors.body1} />
        <rect x="1" y="6" width="6" height="1" fill={colors.bodyDark} />

        {/* Eyes */}
        <rect x="2" y="4" width="1" height="1" fill={colors.eyes} />
        <rect x="5" y="4" width="1" height="1" fill={colors.eyes} />
      </svg>
    </motion.span>
  );
}
