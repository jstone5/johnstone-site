"use client";

import { useRef, useState, useCallback, useEffect, useMemo, memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useSky } from "@/contexts/SkyContext";
import { useAchievements } from "@/contexts/AchievementContext";
import { useSound } from "@/contexts/SoundContext";
import { useGameLoop } from "@/hooks/useGameLoop";
import { useGameInput } from "@/hooks/useGameInput";
import { useBookCovers } from "@/hooks/useBookCovers";
import { useXP, XP_REWARDS } from "@/contexts/XPContext";
import { BOOKS_DATA } from "@/lib/game/books";
import { BOOK_COLORS } from "@/lib/game/physics";
import type { BookPlatform as BookPlatformType } from "@/lib/game/types";
import { BookModal } from "@/components/game/BookModal";
import { MobileControls, KeyboardHint } from "@/components/game/MobileControls";

// Color palette matching HeroScene
const colors = {
  ground1: "#2A9D8F",
  ground2: "#1A535C",
  groundDark: "#134E4A",
  building1: "#334155",
  building2: "#475569",
  buildingDark: "#1E293B",
  window: "#FBBF24",
  windowGlow: "#F59E0B",
  accent1: "#4ECDC4",
  accent2: "#6EE7E7",
  purple1: "#A855F7",
  purple2: "#C084FC",
  char1: "#4ECDC4",
  char2: "#6EE7E7",
  charDark: "#2A9D8F",
  starWhite: "#F8FAFC",
  starYellow: "#FBBF24",
};

// Physics
const PHYSICS = {
  GRAVITY: 0.8,
  JUMP_FORCE: -14,
  MOVE_SPEED: 6,
  MAX_FALL_SPEED: 15,
};

// Player dimensions
const PLAYER = {
  WIDTH: 64,
  HEIGHT: 80,
};

// Book dimensions (enlarged from 60x80)
const BOOK = {
  WIDTH: 70,
  HEIGHT: 90,
};

// Section templates for platform layout
// dx = offset from section start X, dy = height above ground in pixels (0 = sitting on ground)
const SECTION_TEMPLATES: Record<string, { dx: number; dy: number }[]> = {
  ground_row_3: [
    { dx: 0, dy: 0 },
    { dx: BOOK.WIDTH + 4, dy: 0 },
    { dx: (BOOK.WIDTH + 4) * 2, dy: 0 },
  ],
  ground_row_4: [
    { dx: 0, dy: 0 },
    { dx: BOOK.WIDTH + 4, dy: 0 },
    { dx: (BOOK.WIDTH + 4) * 2, dy: 0 },
    { dx: (BOOK.WIDTH + 4) * 3, dy: 0 },
  ],
  ground_row_2: [
    { dx: 0, dy: 0 },
    { dx: BOOK.WIDTH + 4, dy: 0 },
  ],
  staircase_up: [
    { dx: 0, dy: 0 },
    { dx: 90, dy: 90 },
    { dx: 180, dy: 180 },
  ],
  staircase_down: [
    { dx: 0, dy: 180 },
    { dx: 90, dy: 90 },
    { dx: 180, dy: 0 },
  ],
  pyramid: [
    { dx: 0, dy: 0 },
    { dx: BOOK.WIDTH + 4, dy: 0 },
    { dx: (BOOK.WIDTH + 4) * 2, dy: 0 },
    { dx: Math.floor((BOOK.WIDTH + 4) * 0.5), dy: BOOK.HEIGHT + 2 },
    { dx: Math.floor((BOOK.WIDTH + 4) * 1.5), dy: BOOK.HEIGHT + 2 },
  ],
  gap_jump: [
    { dx: 0, dy: 0 },
    { dx: BOOK.WIDTH + 90, dy: 0 },
    { dx: (BOOK.WIDTH + 90) * 2, dy: 0 },
  ],
  mixed_heights: [
    { dx: 0, dy: 0 },
    { dx: 90, dy: 50 },
    { dx: 180, dy: 0 },
    { dx: 270, dy: 50 },
  ],
};

// The order of sections for the 27 books
const SECTION_ORDER = [
  "ground_row_3",   // 3 books  (3 total)
  "staircase_up",   // 3 books  (6 total)
  "ground_row_4",   // 4 books  (10 total)
  "gap_jump",       // 3 books  (13 total)
  "pyramid",        // 5 books  (18 total)
  "staircase_down", // 3 books  (21 total)
  "mixed_heights",  // 4 books  (25 total)
  "ground_row_2",   // 2 books  (27 total)
];

interface Platform {
  id: string;
  title: string;
  author: string;
  x: number; // absolute pixel X in world space
  y: number; // height above ground in pixels (0 = on ground)
  color: string;
}

interface ImmersiveHeroSceneWithGameProps {
  onGameStart?: (progress: number) => void;
}

export function ImmersiveHeroSceneWithGame({ onGameStart }: ImmersiveHeroSceneWithGameProps) {
  const prefersReducedMotion = useReducedMotion();
  const { palette } = useSky();
  const { unlock } = useAchievements();
  const { play } = useSound();
  const { covers } = useBookCovers();
  const { addXP } = useXP();
  const showStars = palette.starsOpacity > 0;

  const containerRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 1400, height: 900 });
  const [showKeyboardHint, setShowKeyboardHint] = useState(true);
  const [selectedBook, setSelectedBook] = useState<BookPlatformType | null>(null);
  const [flagpoleReached, setFlagpoleReached] = useState(false);

  // Camera offset for scrolling (in pixels)
  const [cameraX, setCameraX] = useState(0);

  // Two-phase camera system
  const cameraLerpRef = useRef(0); // 0 = idle (player on right), 1 = game (player on left)
  const onGameStartRef = useRef(onGameStart);
  onGameStartRef.current = onGameStart;
  const lastProgressRef = useRef(0);

  // Mark client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  const groundY = dimensions.height * 0.85; // Ground at 85% down

  // Generate section-based platforms using absolute pixel coordinates
  const platforms = useMemo((): Platform[] => {
    const result: Platform[] = [];
    let bookIndex = 0;
    let sectionStartX = dimensions.width + 100; // First book just past viewport right edge

    for (const sectionType of SECTION_ORDER) {
      const template = SECTION_TEMPLATES[sectionType];
      if (!template) continue;

      for (const slot of template) {
        if (bookIndex >= BOOKS_DATA.length) break;

        const book = BOOKS_DATA[bookIndex];
        result.push({
          id: `book-${bookIndex}`,
          title: book.title,
          author: book.author,
          x: sectionStartX + slot.dx,
          y: slot.dy,
          color: BOOK_COLORS[bookIndex % BOOK_COLORS.length],
        });
        bookIndex++;
      }

      if (bookIndex >= BOOKS_DATA.length) break;

      // Calculate section width for spacing
      const maxDx = Math.max(...template.map((s) => s.dx));
      sectionStartX += maxDx + BOOK.WIDTH + 150; // 150px gap between sections
    }

    return result;
  }, [dimensions.width]);

  // Dynamic world width based on content
  const worldWidth = useMemo(() => {
    if (platforms.length === 0) return dimensions.width * 4;
    const lastPlatform = platforms[platforms.length - 1];
    return Math.max(lastPlatform.x + BOOK.WIDTH + 400, dimensions.width * 2);
  }, [platforms, dimensions.width]);

  // Flagpole just past the last book
  const flagpoleX = useMemo(() => {
    if (platforms.length === 0) return 3000;
    const lastPlatform = platforms[platforms.length - 1];
    return lastPlatform.x + BOOK.WIDTH + 200;
  }, [platforms]);

  // Sort platforms by height descending for collision priority (highest first)
  const sortedPlatforms = useMemo(() => {
    return [...platforms].sort((a, b) => b.y - a.y);
  }, [platforms]);

  // Player state
  const playerRef = useRef({
    x: dimensions.width * 0.7,
    y: groundY - PLAYER.HEIGHT,
    vx: 0,
    vy: 0,
    grounded: true,
    facingRight: true,
    walkFrame: 0,
  });
  const [playerState, setPlayerState] = useState(playerRef.current);

  // Handle resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          setDimensions({ width: rect.width, height: rect.height });
        }
      }
    };
    updateDimensions();
    requestAnimationFrame(updateDimensions);
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Initialize player position when dimensions change
  useEffect(() => {
    playerRef.current.x = dimensions.width * 0.7;
    playerRef.current.y = groundY - PLAYER.HEIGHT;
  }, [dimensions.width, groundY]);

  const handleFirstInput = useCallback(() => {
    setShowKeyboardHint(false);
  }, []);

  const { getInput, setLeft, setRight, setJump } = useGameInput(handleFirstInput);

  // Animation timer
  const walkTimer = useRef(0);

  // Game update loop
  const updateGame = useCallback(
    (deltaTime: number) => {
      if (prefersReducedMotion || selectedBook) return;

      const player = playerRef.current;
      const input = getInput();

      // Horizontal movement
      if (input.left) {
        player.vx = -PHYSICS.MOVE_SPEED;
        player.facingRight = false;
      } else if (input.right) {
        player.vx = PHYSICS.MOVE_SPEED;
        player.facingRight = true;
      } else {
        player.vx = 0;
      }

      // Jump
      if (input.jump && player.grounded) {
        player.vy = PHYSICS.JUMP_FORCE;
        player.grounded = false;
        play("menuSelect");
      }

      // Gravity
      if (!player.grounded) {
        player.vy += PHYSICS.GRAVITY;
        player.vy = Math.min(player.vy, PHYSICS.MAX_FALL_SPEED);
      }

      // --- Horizontal update + side collision ---
      player.x += player.vx;

      // Side collision with books (must jump over, can't walk through)
      for (const platform of sortedPlatforms) {
        const platScreenX = platform.x;
        const platScreenY = groundY - platform.y - BOOK.HEIGHT;
        const platRight = platScreenX + BOOK.WIDTH;
        const platBottom = platScreenY + BOOK.HEIGHT;

        const playerRight = player.x + PLAYER.WIDTH;
        const playerBottom = player.y + PLAYER.HEIGHT;

        // Skip if no vertical overlap (tolerance at top for landing)
        if (playerBottom <= platScreenY + 10 || player.y >= platBottom) continue;
        // Skip if no horizontal overlap
        if (playerRight <= platScreenX || player.x >= platRight) continue;

        // Push player out based on movement direction
        if (player.vx > 0) {
          player.x = platScreenX - PLAYER.WIDTH;
        } else if (player.vx < 0) {
          player.x = platRight;
        }
        player.vx = 0;
        break;
      }

      // World bounds (horizontal)
      player.x = Math.max(0, Math.min(player.x, worldWidth - PLAYER.WIDTH));

      // --- Vertical update + collision ---
      player.y += player.vy;
      player.grounded = false;

      // Ground collision
      const groundLevel = groundY - PLAYER.HEIGHT;
      if (player.y >= groundLevel) {
        player.y = groundLevel;
        player.vy = 0;
        player.grounded = true;
      }

      // Platform top collision -- sorted by height (highest first) for stacked books
      for (const platform of sortedPlatforms) {
        const platX = platform.x;
        const platY = groundY - platform.y - BOOK.HEIGHT;

        const playerBottom = player.y + PLAYER.HEIGHT;
        const playerRight = player.x + PLAYER.WIDTH;
        const platTop = platY;
        const platRight = platX + BOOK.WIDTH;

        // Landing on top of platform (falling down)
        if (
          player.vy >= 0 &&
          playerRight > platX &&
          player.x < platRight &&
          playerBottom >= platTop &&
          playerBottom <= platTop + 20
        ) {
          player.y = platTop - PLAYER.HEIGHT;
          player.vy = 0;
          player.grounded = true;
          break;
        }
      }

      // Flagpole check — unlock achievement + grant XP
      if (!flagpoleReached && player.x + PLAYER.WIDTH >= flagpoleX) {
        setFlagpoleReached(true);
        unlock("book_climber");
        addXP(XP_REWARDS.unlockAchievement, "book_climber");
      }

      // Walk animation
      if (Math.abs(player.vx) > 0.5 && player.grounded) {
        walkTimer.current += deltaTime;
        if (walkTimer.current > 100) {
          player.walkFrame = (player.walkFrame + 1) % 4;
          walkTimer.current = 0;
        }
      } else {
        player.walkFrame = 0;
      }

      // Two-phase camera based on player distance from start
      // Idle: player at 70% from left (right side of screen)
      // Game: player at 25% from left (Mario-style forward visibility)
      const startX = dimensions.width * 0.7;
      const distanceRight = Math.max(0, player.x - startX);
      const gameProgress = Math.min(1, distanceRight / 300);

      // Report progress for text panel animation (throttled to reduce re-renders)
      if (Math.abs(gameProgress - lastProgressRef.current) > 0.02) {
        lastProgressRef.current = gameProgress;
        onGameStartRef.current?.(gameProgress);
      }

      // Smooth camera lerp tracks progress
      cameraLerpRef.current += (gameProgress - cameraLerpRef.current) * 0.08;
      const t = cameraLerpRef.current;
      const idleCameraTarget = player.x - dimensions.width * 0.7;
      const gameCameraTarget = player.x - dimensions.width * 0.25;
      const targetCamera = idleCameraTarget + (gameCameraTarget - idleCameraTarget) * t;
      const newCameraX = Math.max(0, Math.min(targetCamera, worldWidth - dimensions.width));
      setCameraX(newCameraX);

      // Trigger re-render
      setPlayerState({ ...player });
    },
    [prefersReducedMotion, selectedBook, getInput, worldWidth, groundY, dimensions, sortedPlatforms, flagpoleX, flagpoleReached, unlock, addXP, play]
  );

  useGameLoop(updateGame, !prefersReducedMotion);

  const handleBookClick = useCallback(
    (platform: Platform) => {
      const book: BookPlatformType = {
        id: platform.id,
        title: platform.title,
        author: platform.author,
        x: 0,
        y: 0,
        width: BOOK.WIDTH,
        height: BOOK.HEIGHT,
        color: platform.color,
      };
      setSelectedBook(book);
      play("menuSelect");
    },
    [play]
  );

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-auto">
      {/* Background buildings layer */}
      <BackgroundLayer cameraX={cameraX} worldWidth={worldWidth} viewportWidth={dimensions.width} />

      {/* Stars layer */}
      {showStars && (
        <div className="absolute inset-0" style={{ opacity: palette.starsOpacity }}>
          <StarsLayer prefersReducedMotion={prefersReducedMotion} />
        </div>
      )}

      {/* Ground - full world width */}
      <div
        className="absolute bottom-0 left-0 h-[15%]"
        style={{
          width: worldWidth,
          transform: `translateX(${-cameraX}px)`,
        }}
      >
        <div className="absolute inset-0" style={{ backgroundColor: colors.ground1 }} />
        <div className="absolute bottom-0 left-0 right-0 h-[60%]" style={{ backgroundColor: colors.ground2 }} />
        <div className="absolute bottom-0 left-0 right-0 h-[20%]" style={{ backgroundColor: colors.groundDark }} />
      </div>

      {/* Grass tufts */}
      <GrassDetails cameraX={cameraX} worldWidth={worldWidth} viewportWidth={dimensions.width} />

      {/* Book platforms */}
      {platforms.map((platform) => {
        const platX = platform.x - cameraX;
        const platY = groundY - platform.y - BOOK.HEIGHT;

        // Only render if visible
        if (platX < -120 || platX > dimensions.width + 120) return null;

        return (
          <BookPlatformVisual
            key={platform.id}
            platform={platform}
            x={platX}
            y={platY}
            coverUrl={covers.get(platform.title)}
            onClick={() => handleBookClick(platform)}
          />
        );
      })}

      {/* Flagpole */}
      <Flagpole
        x={flagpoleX - cameraX}
        groundY={groundY}
        reached={flagpoleReached}
      />

      {/* Player character */}
      <Character
        x={playerState.x - cameraX}
        y={playerState.y}
        facingRight={playerState.facingRight}
        walkFrame={playerState.walkFrame}
        grounded={playerState.grounded}
        prefersReducedMotion={prefersReducedMotion}
      />

      {/* Floating particles */}
      {!prefersReducedMotion && <FloatingParticles />}

      {/* UI */}
      <KeyboardHint visible={showKeyboardHint} />

      <MobileControls
        onLeftStart={() => setLeft(true)}
        onLeftEnd={() => setLeft(false)}
        onRightStart={() => setRight(true)}
        onRightEnd={() => setRight(false)}
        onJump={() => setJump(true)}
        onJumpEnd={() => setJump(false)}
      />

      <BookModal
        book={selectedBook}
        coverUrl={selectedBook ? covers.get(selectedBook.title) : undefined}
        onClose={() => setSelectedBook(null)}
      />
    </div>
  );
}

function StarsLayer({ prefersReducedMotion }: { prefersReducedMotion: boolean | null }) {
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
          animate={prefersReducedMotion ? {} : { opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2 + (i % 3), repeat: Infinity, delay: i * 0.3 }}
        />
      ))}
    </>
  );
}

function BackgroundLayer({
  cameraX,
  worldWidth,
  viewportWidth,
}: {
  cameraX: number;
  worldWidth: number;
  viewportWidth: number;
}) {
  // Parallax: buildings move at 30% of camera speed
  const parallaxOffset = cameraX * 0.3;

  return (
    <div className="absolute inset-0">
      <svg
        className="absolute bottom-[15%] right-0 w-full h-[45%]"
        viewBox="0 0 400 150"
        preserveAspectRatio="xMaxYMax meet"
        style={{ imageRendering: "pixelated" }}
      >
        {/* Building cluster on right side */}
        <g opacity="0.5" transform={`translate(${-parallaxOffset * 0.1}, 0)`}>
          {/* Tall building - far right */}
          <rect x="340" y="30" width="50" height="120" fill={colors.buildingDark} />
          <rect x="350" y="40" width="10" height="10" fill={colors.window} opacity="0.4" />
          <rect x="370" y="40" width="10" height="10" fill={colors.window} opacity="0.6" />
          <rect x="350" y="60" width="10" height="10" fill={colors.window} opacity="0.3" />
          <rect x="370" y="60" width="10" height="10" fill={colors.window} opacity="0.5" />
          <rect x="350" y="80" width="10" height="10" fill={colors.window} opacity="0.4" />
          <rect x="370" y="80" width="10" height="10" fill={colors.window} opacity="0.3" />

          {/* Medium building */}
          <rect x="280" y="60" width="45" height="90" fill={colors.buildingDark} />
          <rect x="290" y="70" width="8" height="8" fill={colors.window} opacity="0.5" />
          <rect x="305" y="70" width="8" height="8" fill={colors.window} opacity="0.4" />
          <rect x="290" y="90" width="8" height="8" fill={colors.window} opacity="0.3" />

          {/* Small building */}
          <rect x="230" y="90" width="35" height="60" fill={colors.buildingDark} />
          <rect x="240" y="100" width="6" height="6" fill={colors.window} opacity="0.4" />
        </g>

        {/* Buildings on far left for balance */}
        <g opacity="0.35" transform={`translate(${-parallaxOffset * 0.1}, 0)`}>
          <rect x="10" y="100" width="30" height="50" fill={colors.buildingDark} />
          <rect x="17" y="108" width="6" height="6" fill={colors.window} opacity="0.4" />

          <rect x="50" y="80" width="40" height="70" fill={colors.buildingDark} />
          <rect x="58" y="88" width="8" height="8" fill={colors.window} opacity="0.5" />
        </g>
      </svg>
    </div>
  );
}

function GrassDetails({ cameraX, worldWidth, viewportWidth }: { cameraX: number; worldWidth: number; viewportWidth: number }) {
  const tufts = useMemo(() => {
    const result = [];
    for (let x = 0; x < worldWidth; x += 100 + Math.random() * 50) {
      result.push({ x, variant: Math.random() > 0.5 ? "double" : "single" });
    }
    return result;
  }, [worldWidth]);

  return (
    <>
      {tufts.map((tuft, i) => {
        const visualX = tuft.x - cameraX;
        if (visualX < -20 || visualX > viewportWidth + 20) return null;

        return (
          <div key={i} className="absolute bottom-[15%]" style={{ left: visualX }}>
            <svg width="16" height="20" viewBox="0 0 8 10" style={{ imageRendering: "pixelated" }}>
              <rect x="2" y="0" width="2" height="8" fill={colors.accent1} opacity="0.6" />
              {tuft.variant === "double" && (
                <rect x="5" y="2" width="2" height="6" fill={colors.accent2} opacity="0.6" />
              )}
            </svg>
          </div>
        );
      })}
    </>
  );
}

interface CharacterProps {
  x: number;
  y: number;
  facingRight: boolean;
  walkFrame: number;
  grounded: boolean;
  prefersReducedMotion: boolean | null;
}

const Character = memo(function Character({ x, y, facingRight, walkFrame, grounded, prefersReducedMotion }: CharacterProps) {
  // Leg animation offsets
  const legOffsets = [
    { left: 0, right: 0 },
    { left: -1, right: 1 },
    { left: 0, right: 0 },
    { left: 1, right: -1 },
  ];
  const offset = legOffsets[walkFrame] || legOffsets[0];

  // Jump effect
  const scaleX = grounded ? 1 : 0.95;
  const scaleY = grounded ? 1 : 1.05;

  return (
    <motion.div
      className="absolute"
      style={{
        left: x,
        top: y,
        width: PLAYER.WIDTH,
        height: PLAYER.HEIGHT,
        transform: `scaleX(${facingRight ? scaleX : -scaleX}) scaleY(${scaleY})`,
        transformOrigin: "center bottom",
        willChange: "transform, left, top",
      }}
      animate={grounded && walkFrame === 0 && !prefersReducedMotion ? { y: [0, -3, 0] } : {}}
      transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg width="64" height="80" viewBox="0 0 16 20" style={{ imageRendering: "pixelated" }}>
        {/* Shadow */}
        <ellipse cx="8" cy="19" rx="5" ry="1.5" fill={colors.groundDark} opacity="0.4" />

        {/* Hair */}
        <rect x="4" y="0" width="8" height="2" fill="#5D4E37" />
        <rect x="3" y="1" width="2" height="2" fill="#5D4E37" />
        <rect x="11" y="1" width="2" height="2" fill="#5D4E37" />
        <rect x="5" y="0" width="2" height="1" fill="#6B5B45" />
        <rect x="9" y="0" width="2" height="1" fill="#6B5B45" />

        {/* Head/Face */}
        <rect x="4" y="2" width="8" height="7" fill="#FFD5B8" />
        <rect x="3" y="3" width="1" height="5" fill="#FFD5B8" />
        <rect x="12" y="3" width="1" height="5" fill="#FFD5B8" />

        {/* Hair bangs */}
        <rect x="4" y="2" width="3" height="2" fill="#5D4E37" />
        <rect x="9" y="2" width="3" height="2" fill="#5D4E37" />
        <rect x="6" y="2" width="4" height="1" fill="#5D4E37" />

        {/* Eyes */}
        <rect x="5" y="5" width="2" height="2" fill="#2D3748" />
        <rect x="9" y="5" width="2" height="2" fill="#2D3748" />
        <rect x="5" y="5" width="1" height="1" fill="#FFFFFF" />
        <rect x="9" y="5" width="1" height="1" fill="#FFFFFF" />

        {/* Blush */}
        <rect x="4" y="6" width="1" height="1" fill="#FFB6C1" opacity="0.6" />
        <rect x="11" y="6" width="1" height="1" fill="#FFB6C1" opacity="0.6" />

        {/* Smile */}
        <rect x="7" y="7" width="2" height="1" fill="#E8A088" />

        {/* Neck */}
        <rect x="6" y="9" width="4" height="1" fill="#F5C9A8" />

        {/* Body/Shirt */}
        <rect x="4" y="10" width="8" height="5" fill={colors.char1} />
        <rect x="3" y="10" width="1" height="4" fill={colors.char1} />
        <rect x="12" y="10" width="1" height="4" fill={colors.char1} />
        <rect x="6" y="10" width="4" height="1" fill={colors.char2} />

        {/* Belt */}
        <rect x="4" y="14" width="8" height="1" fill="#8B7355" />
        <rect x="7" y="14" width="2" height="1" fill="#D4AF37" />

        {/* Arms */}
        <rect x="2" y="10" width="2" height="4" fill={colors.char1} />
        <rect x="12" y="10" width="2" height="4" fill={colors.char1} />
        <rect x="2" y="13" width="2" height="2" fill="#FFD5B8" />
        <rect x="12" y="13" width="2" height="2" fill="#FFD5B8" />

        {/* Legs with animation */}
        <g transform={`translate(${offset.left}, 0)`}>
          <rect x="5" y="15" width="3" height="4" fill="#4A5568" />
          <rect x="4" y="18" width="4" height="2" fill="#5D4E37" />
          <rect x="4" y="18" width="4" height="1" fill="#6B5B45" />
        </g>
        <g transform={`translate(${offset.right}, 0)`}>
          <rect x="8" y="15" width="3" height="4" fill="#4A5568" />
          <rect x="8" y="18" width="4" height="2" fill="#5D4E37" />
          <rect x="8" y="18" width="4" height="1" fill="#6B5B45" />
        </g>
      </svg>
    </motion.div>
  );
});

interface BookPlatformVisualProps {
  platform: Platform;
  x: number;
  y: number;
  coverUrl?: string;
  onClick: () => void;
}

const BookPlatformVisual = memo(function BookPlatformVisual({ platform, x, y, coverUrl, onClick }: BookPlatformVisualProps) {
  return (
    <div
      className="absolute cursor-pointer hover:brightness-110 transition-all"
      style={{ left: x, top: y, width: BOOK.WIDTH, height: BOOK.HEIGHT, willChange: "left" }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`${platform.title} by ${platform.author}`}
    >
      {/* 3D Book effect */}
      <div className="relative w-full h-full">
        {/* Spine */}
        <div
          className="absolute left-0 top-0 w-2 h-full"
          style={{ backgroundColor: platform.color, filter: "brightness(0.7)" }}
        />
        {/* Cover */}
        <div
          className="absolute left-2 top-0 h-full overflow-hidden rounded-r"
          style={{ width: BOOK.WIDTH - 8, backgroundColor: platform.color }}
        >
          {coverUrl ? (
            <img src={coverUrl} alt={platform.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center p-1">
              <span className="text-white text-[9px] text-center font-bold leading-tight drop-shadow">
                {platform.title.length > 18 ? platform.title.slice(0, 18) + "..." : platform.title}
              </span>
            </div>
          )}
        </div>
        {/* Top edge highlight */}
        <div
          className="absolute left-0 top-0 w-full h-1"
          style={{ backgroundColor: platform.color, filter: "brightness(1.2)" }}
        />
      </div>
    </div>
  );
});

interface FlagpoleProps {
  x: number;
  groundY: number;
  reached: boolean;
}

function Flagpole({ x, groundY, reached }: FlagpoleProps) {
  if (x < -100 || x > 1500) return null;

  const poleHeight = 150;
  const poleTop = groundY - poleHeight;

  return (
    <div className="absolute" style={{ left: x, top: poleTop }}>
      {/* Pole */}
      <div className="absolute left-0 top-0 w-2" style={{ height: poleHeight, backgroundColor: colors.building1 }} />
      {/* Top ball */}
      <div className="absolute -left-1 -top-2 w-4 h-4 rounded-full" style={{ backgroundColor: "#D4AF37" }} />
      {/* Flag */}
      <motion.div
        className="absolute left-2"
        initial={{ top: poleHeight - 60 }}
        animate={{ top: reached ? 8 : poleHeight - 60 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div
          className="w-12 h-8 flex items-center justify-center"
          style={{ backgroundColor: colors.accent1, clipPath: "polygon(0 0, 100% 50%, 0 100%)" }}
        >
          <span className="text-yellow-400 text-sm ml-1">★</span>
        </div>
      </motion.div>
      {/* Base */}
      <div
        className="absolute -left-3 w-8 h-2 rounded"
        style={{ top: poleHeight - 2, backgroundColor: colors.building2 }}
      />
    </div>
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
          style={{ left: p.left, bottom: p.bottom, backgroundColor: i % 2 === 0 ? colors.accent1 : colors.purple1 }}
          animate={{ y: [0, -60, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: p.delay }}
        />
      ))}
    </>
  );
}
