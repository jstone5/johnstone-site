"use client";

import { motion, useReducedMotion } from "framer-motion";

// Color palette
const colors = {
  // Sky
  skyTop: "#0F172A",
  skyBottom: "#1E293B",

  // Ground
  ground1: "#2A9D8F",
  ground2: "#1A535C",
  groundDark: "#134E4A",

  // Building
  building1: "#334155",
  building2: "#475569",
  buildingDark: "#1E293B",
  window: "#FBBF24",
  windowGlow: "#F59E0B",

  // Accent
  accent1: "#4ECDC4",
  accent2: "#6EE7E7",
  purple1: "#A855F7",
  purple2: "#C084FC",

  // Character
  char1: "#4ECDC4",
  char2: "#6EE7E7",
  charDark: "#2A9D8F",

  // Stars
  starWhite: "#F8FAFC",
  starYellow: "#FBBF24",
};

export function HeroScene({ className = "" }: { className?: string }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox="0 0 160 100"
        className="w-full h-auto"
        style={{ imageRendering: "pixelated" }}
      >
        {/* Sky gradient */}
        <defs>
          <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colors.skyTop} />
            <stop offset="100%" stopColor={colors.skyBottom} />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="160" height="100" fill="url(#skyGradient)" />

        {/* Stars */}
        <Stars prefersReducedMotion={prefersReducedMotion} />

        {/* Moon */}
        <Moon prefersReducedMotion={prefersReducedMotion} />

        {/* Background buildings (silhouettes) */}
        <BackgroundBuildings />

        {/* Ground */}
        <rect x="0" y="80" width="160" height="20" fill={colors.ground1} />
        <rect x="0" y="85" width="160" height="15" fill={colors.ground2} />
        <rect x="0" y="95" width="160" height="5" fill={colors.groundDark} />

        {/* Ground details */}
        <GroundDetails />

        {/* Main building/tower */}
        <MainTower prefersReducedMotion={prefersReducedMotion} />

        {/* Character */}
        <Character prefersReducedMotion={prefersReducedMotion} />

        {/* Floating particles */}
        {!prefersReducedMotion && <FloatingParticles />}
      </svg>
    </div>
  );
}

function Stars({ prefersReducedMotion }: { prefersReducedMotion: boolean | null }) {
  const starPositions = [
    { x: 10, y: 8, size: 2 },
    { x: 25, y: 15, size: 1 },
    { x: 45, y: 5, size: 2 },
    { x: 70, y: 12, size: 1 },
    { x: 90, y: 8, size: 2 },
    { x: 110, y: 18, size: 1 },
    { x: 130, y: 10, size: 2 },
    { x: 145, y: 5, size: 1 },
    { x: 35, y: 22, size: 1 },
    { x: 85, y: 20, size: 1 },
    { x: 120, y: 25, size: 1 },
    { x: 15, y: 30, size: 1 },
    { x: 55, y: 28, size: 1 },
  ];

  return (
    <g>
      {starPositions.map((star, i) => (
        <motion.rect
          key={i}
          x={star.x}
          y={star.y}
          width={star.size}
          height={star.size}
          fill={i % 3 === 0 ? colors.starYellow : colors.starWhite}
          animate={prefersReducedMotion ? {} : {
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            duration: 2 + (i % 3),
            repeat: Infinity,
            delay: i * 0.3,
          }}
        />
      ))}
    </g>
  );
}

function Moon({ prefersReducedMotion }: { prefersReducedMotion: boolean | null }) {
  return (
    <motion.g
      animate={prefersReducedMotion ? {} : {
        y: [0, -2, 0],
      }}
      transition={{ duration: 4, repeat: Infinity }}
    >
      {/* Moon body */}
      <rect x="135" y="15" width="16" height="16" fill={colors.starWhite} />
      <rect x="137" y="13" width="12" height="2" fill={colors.starWhite} />
      <rect x="137" y="31" width="12" height="2" fill={colors.starWhite} />
      <rect x="133" y="17" width="2" height="12" fill={colors.starWhite} />
      <rect x="151" y="17" width="2" height="12" fill={colors.starWhite} />
      {/* Craters */}
      <rect x="138" y="18" width="3" height="3" fill={colors.building1} opacity="0.3" />
      <rect x="145" y="23" width="4" height="4" fill={colors.building1} opacity="0.3" />
      <rect x="140" y="26" width="2" height="2" fill={colors.building1} opacity="0.3" />
    </motion.g>
  );
}

function BackgroundBuildings() {
  return (
    <g opacity="0.4">
      {/* Building 1 */}
      <rect x="5" y="55" width="15" height="25" fill={colors.buildingDark} />
      <rect x="8" y="58" width="3" height="3" fill={colors.window} opacity="0.5" />
      <rect x="8" y="65" width="3" height="3" fill={colors.window} opacity="0.3" />

      {/* Building 2 */}
      <rect x="22" y="50" width="18" height="30" fill={colors.buildingDark} />
      <rect x="25" y="53" width="3" height="3" fill={colors.window} opacity="0.4" />
      <rect x="33" y="53" width="3" height="3" fill={colors.window} opacity="0.6" />
      <rect x="25" y="60" width="3" height="3" fill={colors.window} opacity="0.3" />

      {/* Building 3 */}
      <rect x="42" y="60" width="12" height="20" fill={colors.buildingDark} />
      <rect x="45" y="63" width="3" height="3" fill={colors.window} opacity="0.5" />

      {/* Building 4 - far right */}
      <rect x="130" y="58" width="20" height="22" fill={colors.buildingDark} />
      <rect x="135" y="62" width="3" height="3" fill={colors.window} opacity="0.4" />
      <rect x="142" y="62" width="3" height="3" fill={colors.window} opacity="0.5" />
    </g>
  );
}

function GroundDetails() {
  return (
    <g>
      {/* Grass tufts */}
      <rect x="20" y="79" width="2" height="3" fill={colors.accent2} opacity="0.6" />
      <rect x="22" y="78" width="2" height="4" fill={colors.accent1} opacity="0.6" />

      <rect x="60" y="79" width="2" height="3" fill={colors.accent2} opacity="0.6" />

      <rect x="100" y="78" width="2" height="4" fill={colors.accent1} opacity="0.6" />
      <rect x="102" y="79" width="2" height="3" fill={colors.accent2} opacity="0.6" />

      <rect x="140" y="79" width="2" height="3" fill={colors.accent2} opacity="0.6" />

      {/* Path/road */}
      <rect x="70" y="82" width="30" height="2" fill={colors.groundDark} />
      <rect x="65" y="84" width="40" height="2" fill={colors.groundDark} />
      <rect x="60" y="86" width="50" height="6" fill={colors.groundDark} />
    </g>
  );
}

function MainTower({ prefersReducedMotion }: { prefersReducedMotion: boolean | null }) {
  return (
    <g>
      {/* Tower base */}
      <rect x="70" y="45" width="30" height="35" fill={colors.building2} />
      <rect x="70" y="45" width="30" height="4" fill={colors.building1} />

      {/* Tower top */}
      <polygon points="85,30 65,45 105,45" fill={colors.purple1} />
      <polygon points="85,30 65,45 85,45" fill={colors.purple2} />

      {/* Flag pole */}
      <rect x="84" y="22" width="2" height="10" fill={colors.building1} />
      {/* Flag */}
      <motion.polygon
        points="86,22 86,28 94,25"
        fill={colors.accent1}
        animate={prefersReducedMotion ? {} : {
          x: [0, 1, 0, -1, 0],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Windows */}
      <rect x="75" y="52" width="6" height="6" fill={colors.window} />
      <rect x="89" y="52" width="6" height="6" fill={colors.window} />
      <rect x="82" y="60" width="6" height="6" fill={colors.window} />

      {/* Window glow */}
      <motion.rect
        x="75" y="52" width="6" height="6"
        fill={colors.windowGlow}
        animate={prefersReducedMotion ? {} : {
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />

      {/* Door */}
      <rect x="80" y="70" width="10" height="10" fill={colors.buildingDark} />
      <rect x="80" y="70" width="10" height="2" fill={colors.building1} />

      {/* Tower details */}
      <rect x="68" y="44" width="34" height="2" fill={colors.building1} />
      <rect x="70" y="68" width="30" height="2" fill={colors.building1} />
    </g>
  );
}

function Character({ prefersReducedMotion }: { prefersReducedMotion: boolean | null }) {
  return (
    <motion.g
      animate={prefersReducedMotion ? {} : {
        y: [0, -1, 0],
      }}
      transition={{ duration: 1, repeat: Infinity }}
    >
      {/* Character - small pixel person */}
      {/* Head */}
      <rect x="53" y="72" width="6" height="6" fill={colors.char2} />
      <rect x="53" y="72" width="2" height="2" fill={colors.starWhite} opacity="0.5" />

      {/* Body */}
      <rect x="52" y="78" width="8" height="6" fill={colors.char1} />

      {/* Legs */}
      <rect x="52" y="84" width="3" height="4" fill={colors.charDark} />
      <rect x="57" y="84" width="3" height="4" fill={colors.charDark} />

      {/* Eyes */}
      <rect x="54" y="74" width="1" height="1" fill={colors.buildingDark} />
      <rect x="57" y="74" width="1" height="1" fill={colors.buildingDark} />

      {/* Shadow */}
      <ellipse cx="56" cy="88" rx="5" ry="1" fill={colors.groundDark} opacity="0.5" />
    </motion.g>
  );
}

function FloatingParticles() {
  const particles = [
    { x: 30, y: 70, delay: 0 },
    { x: 50, y: 65, delay: 1 },
    { x: 110, y: 68, delay: 0.5 },
    { x: 125, y: 72, delay: 1.5 },
  ];

  return (
    <g>
      {particles.map((p, i) => (
        <motion.rect
          key={i}
          x={p.x}
          y={p.y}
          width="2"
          height="2"
          fill={i % 2 === 0 ? colors.accent1 : colors.purple1}
          animate={{
            y: [p.y, p.y - 15, p.y],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: p.delay,
          }}
        />
      ))}
    </g>
  );
}

// Smaller inline pixel scene for use in cards
export function MiniScene({ variant = "tower" }: { variant?: "tower" | "books" | "chest" }) {
  const prefersReducedMotion = useReducedMotion();

  if (variant === "tower") {
    return (
      <svg
        viewBox="0 0 32 32"
        className="w-full h-full"
        style={{ imageRendering: "pixelated" }}
      >
        <rect x="0" y="0" width="32" height="32" fill={colors.skyBottom} />
        <rect x="10" y="12" width="12" height="16" fill={colors.building2} />
        <polygon points="16,6 8,12 24,12" fill={colors.purple1} />
        <rect x="13" y="16" width="6" height="6" fill={colors.window} />
        <motion.rect
          x="13" y="16" width="6" height="6"
          fill={colors.windowGlow}
          animate={prefersReducedMotion ? {} : { opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <rect x="0" y="28" width="32" height="4" fill={colors.ground1} />
      </svg>
    );
  }

  return null;
}
