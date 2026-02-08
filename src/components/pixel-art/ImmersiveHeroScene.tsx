"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useSky } from "@/contexts/SkyContext";

// Color palette matching HeroScene
const colors = {
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

export function ImmersiveHeroScene() {
  const prefersReducedMotion = useReducedMotion();
  const { palette } = useSky();
  const showStars = palette.starsOpacity > 0;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Background buildings layer */}
      <BackgroundLayer />

      {/* Stars layer - positioned in sky area */}
      {showStars && (
        <div
          className="absolute inset-0"
          style={{ opacity: palette.starsOpacity }}
        >
          <StarsLayer prefersReducedMotion={prefersReducedMotion} />
        </div>
      )}

      {/* Foreground layer - ground, grass, character */}
      <ForegroundLayer prefersReducedMotion={prefersReducedMotion} />
    </div>
  );
}

function StarsLayer({
  prefersReducedMotion,
}: {
  prefersReducedMotion: boolean | null;
}) {
  // Star positions as viewport percentages
  const stars = [
    { left: "5%", top: "8%", size: 8 },
    { left: "15%", top: "15%", size: 6 },
    { left: "25%", top: "5%", size: 8 },
    { left: "40%", top: "12%", size: 6 },
    { left: "55%", top: "8%", size: 8 },
    { left: "65%", top: "18%", size: 6 },
    { left: "75%", top: "10%", size: 8 },
    { left: "85%", top: "5%", size: 6 },
    { left: "92%", top: "15%", size: 6 },
    { left: "20%", top: "22%", size: 6 },
    { left: "48%", top: "20%", size: 6 },
    { left: "70%", top: "25%", size: 6 },
    { left: "10%", top: "30%", size: 6 },
    { left: "35%", top: "28%", size: 6 },
  ];

  return (
    <>
      {stars.map((star, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            backgroundColor: i % 3 === 0 ? colors.starYellow : colors.starWhite,
          }}
          animate={
            prefersReducedMotion
              ? {}
              : {
                  opacity: [0.4, 1, 0.4],
                }
          }
          transition={{
            duration: 2 + (i % 3),
            repeat: Infinity,
            delay: i * 0.3,
          }}
        />
      ))}
    </>
  );
}

function BackgroundLayer() {
  return (
    <div className="absolute inset-0">
      {/* Buildings on the right side - positioned above ground */}
      <svg
        className="absolute bottom-[15%] right-0 w-full h-[45%]"
        viewBox="0 0 400 150"
        preserveAspectRatio="xMaxYMax meet"
        style={{ imageRendering: "pixelated" }}
      >
        {/* Building cluster on right side */}
        <g opacity="0.5">
          {/* Tall building - far right */}
          <rect x="340" y="30" width="50" height="120" fill={colors.buildingDark} />
          <rect x="350" y="40" width="10" height="10" fill={colors.window} opacity="0.4" />
          <rect x="370" y="40" width="10" height="10" fill={colors.window} opacity="0.6" />
          <rect x="350" y="60" width="10" height="10" fill={colors.window} opacity="0.3" />
          <rect x="370" y="60" width="10" height="10" fill={colors.window} opacity="0.5" />
          <rect x="350" y="80" width="10" height="10" fill={colors.window} opacity="0.4" />
          <rect x="370" y="80" width="10" height="10" fill={colors.window} opacity="0.3" />
          <rect x="360" y="100" width="10" height="10" fill={colors.window} opacity="0.5" />

          {/* Medium building */}
          <rect x="280" y="60" width="45" height="90" fill={colors.buildingDark} />
          <rect x="290" y="70" width="8" height="8" fill={colors.window} opacity="0.5" />
          <rect x="305" y="70" width="8" height="8" fill={colors.window} opacity="0.4" />
          <rect x="290" y="90" width="8" height="8" fill={colors.window} opacity="0.3" />
          <rect x="305" y="90" width="8" height="8" fill={colors.window} opacity="0.6" />
          <rect x="297" y="110" width="8" height="8" fill={colors.window} opacity="0.4" />

          {/* Small building */}
          <rect x="230" y="90" width="35" height="60" fill={colors.buildingDark} />
          <rect x="240" y="100" width="6" height="6" fill={colors.window} opacity="0.4" />
          <rect x="252" y="100" width="6" height="6" fill={colors.window} opacity="0.5" />
          <rect x="246" y="120" width="6" height="6" fill={colors.window} opacity="0.3" />
        </g>

        {/* Some buildings on far left for balance */}
        <g opacity="0.35">
          <rect x="10" y="100" width="30" height="50" fill={colors.buildingDark} />
          <rect x="17" y="108" width="6" height="6" fill={colors.window} opacity="0.4" />
          <rect x="27" y="108" width="6" height="6" fill={colors.window} opacity="0.5" />

          <rect x="50" y="80" width="40" height="70" fill={colors.buildingDark} />
          <rect x="58" y="88" width="8" height="8" fill={colors.window} opacity="0.5" />
          <rect x="74" y="88" width="8" height="8" fill={colors.window} opacity="0.4" />
          <rect x="66" y="108" width="8" height="8" fill={colors.window} opacity="0.3" />
        </g>
      </svg>
    </div>
  );
}

function ForegroundLayer({
  prefersReducedMotion,
}: {
  prefersReducedMotion: boolean | null;
}) {
  return (
    <div className="absolute inset-0">
      {/* Ground - spans full width at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[15%]">
        <div
          className="absolute inset-0"
          style={{ backgroundColor: colors.ground1 }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-[60%]"
          style={{ backgroundColor: colors.ground2 }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-[20%]"
          style={{ backgroundColor: colors.groundDark }}
        />
      </div>

      {/* Grass tufts along ground line */}
      <GrassDetails />

      {/* Character on right side */}
      <div className="absolute bottom-[15%] right-[15%] sm:right-[20%] hidden sm:block">
        <Character prefersReducedMotion={prefersReducedMotion} />
      </div>

      {/* Floating particles */}
      {!prefersReducedMotion && <FloatingParticles />}
    </div>
  );
}

function GrassDetails() {
  // Grass tufts positioned along the ground line
  const grassTufts = [
    { left: "5%", variant: "double" },
    { left: "15%", variant: "single" },
    { left: "25%", variant: "double" },
    { left: "35%", variant: "single" },
    { left: "45%", variant: "double" },
    { left: "55%", variant: "single" },
    { left: "65%", variant: "double" },
    { left: "75%", variant: "single" },
    { left: "85%", variant: "double" },
    { left: "95%", variant: "single" },
  ];

  return (
    <>
      {grassTufts.map((tuft, i) => (
        <div
          key={i}
          className="absolute bottom-[15%]"
          style={{ left: tuft.left }}
        >
          <svg
            width="16"
            height="20"
            viewBox="0 0 8 10"
            style={{ imageRendering: "pixelated" }}
          >
            <rect x="2" y="0" width="2" height="8" fill={colors.accent1} opacity="0.6" />
            {tuft.variant === "double" && (
              <rect x="5" y="2" width="2" height="6" fill={colors.accent2} opacity="0.6" />
            )}
          </svg>
        </div>
      ))}
    </>
  );
}

function Character({
  prefersReducedMotion,
}: {
  prefersReducedMotion: boolean | null;
}) {
  return (
    <motion.div
      animate={
        prefersReducedMotion
          ? {}
          : {
              y: [0, -3, 0],
            }
      }
      transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg
        width="64"
        height="80"
        viewBox="0 0 16 20"
        style={{ imageRendering: "pixelated" }}
      >
        {/* Shadow on ground */}
        <ellipse cx="8" cy="19" rx="5" ry="1.5" fill={colors.groundDark} opacity="0.4" />

        {/* Hair - messy/spiky style */}
        <rect x="4" y="0" width="8" height="2" fill="#5D4E37" />
        <rect x="3" y="1" width="2" height="2" fill="#5D4E37" />
        <rect x="11" y="1" width="2" height="2" fill="#5D4E37" />
        <rect x="5" y="0" width="2" height="1" fill="#6B5B45" />
        <rect x="9" y="0" width="2" height="1" fill="#6B5B45" />

        {/* Head/Face - skin tone */}
        <rect x="4" y="2" width="8" height="7" fill="#FFD5B8" />
        <rect x="3" y="3" width="1" height="5" fill="#FFD5B8" />
        <rect x="12" y="3" width="1" height="5" fill="#FFD5B8" />

        {/* Hair bangs over forehead */}
        <rect x="4" y="2" width="3" height="2" fill="#5D4E37" />
        <rect x="9" y="2" width="3" height="2" fill="#5D4E37" />
        <rect x="6" y="2" width="4" height="1" fill="#5D4E37" />

        {/* Eyes - cute style with highlights */}
        <rect x="5" y="5" width="2" height="2" fill="#2D3748" />
        <rect x="9" y="5" width="2" height="2" fill="#2D3748" />
        <rect x="5" y="5" width="1" height="1" fill="#FFFFFF" />
        <rect x="9" y="5" width="1" height="1" fill="#FFFFFF" />

        {/* Blush marks */}
        <rect x="4" y="6" width="1" height="1" fill="#FFB6C1" opacity="0.6" />
        <rect x="11" y="6" width="1" height="1" fill="#FFB6C1" opacity="0.6" />

        {/* Small smile */}
        <rect x="7" y="7" width="2" height="1" fill="#E8A088" />

        {/* Neck */}
        <rect x="6" y="9" width="4" height="1" fill="#F5C9A8" />

        {/* Body/Shirt - adventure tunic style */}
        <rect x="4" y="10" width="8" height="5" fill={colors.char1} />
        <rect x="3" y="10" width="1" height="4" fill={colors.char1} />
        <rect x="12" y="10" width="1" height="4" fill={colors.char1} />

        {/* Shirt collar/detail */}
        <rect x="6" y="10" width="4" height="1" fill={colors.char2} />

        {/* Belt */}
        <rect x="4" y="14" width="8" height="1" fill="#8B7355" />
        <rect x="7" y="14" width="2" height="1" fill="#D4AF37" />

        {/* Arms */}
        <rect x="2" y="10" width="2" height="4" fill={colors.char1} />
        <rect x="12" y="10" width="2" height="4" fill={colors.char1} />
        {/* Hands - skin */}
        <rect x="2" y="13" width="2" height="2" fill="#FFD5B8" />
        <rect x="12" y="13" width="2" height="2" fill="#FFD5B8" />

        {/* Legs/Pants */}
        <rect x="5" y="15" width="3" height="4" fill="#4A5568" />
        <rect x="8" y="15" width="3" height="4" fill="#4A5568" />

        {/* Boots */}
        <rect x="4" y="18" width="4" height="2" fill="#5D4E37" />
        <rect x="8" y="18" width="4" height="2" fill="#5D4E37" />
        <rect x="4" y="18" width="4" height="1" fill="#6B5B45" />
        <rect x="8" y="18" width="4" height="1" fill="#6B5B45" />
      </svg>
    </motion.div>
  );
}

function FloatingParticles() {
  const particles = [
    { left: "20%", bottom: "25%", delay: 0 },
    { left: "30%", bottom: "30%", delay: 1 },
    { left: "70%", bottom: "28%", delay: 0.5 },
    { left: "80%", bottom: "22%", delay: 1.5 },
  ];

  return (
    <>
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2"
          style={{
            left: p.left,
            bottom: p.bottom,
            backgroundColor: i % 2 === 0 ? colors.accent1 : colors.purple1,
          }}
          animate={{
            y: [0, -60, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: p.delay,
          }}
        />
      ))}
    </>
  );
}
