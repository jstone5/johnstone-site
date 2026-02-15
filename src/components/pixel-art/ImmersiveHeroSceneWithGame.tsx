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
    { dx: 150, dy: 85 },
    { dx: 300, dy: 170 },
  ],
  staircase_down: [
    { dx: 0, dy: 170 },
    { dx: 150, dy: 85 },
    { dx: 300, dy: 0 },
  ],
  pyramid: [
    { dx: 0, dy: 0 },
    { dx: BOOK.WIDTH + 70, dy: 0 },
    { dx: (BOOK.WIDTH + 70) * 2, dy: 0 },
    { dx: Math.floor((BOOK.WIDTH + 70) * 0.5), dy: 85 },
    { dx: Math.floor((BOOK.WIDTH + 70) * 1.5), dy: 85 },
  ],
  gap_jump: [
    { dx: 0, dy: 0 },
    { dx: BOOK.WIDTH + 90, dy: 0 },
    { dx: (BOOK.WIDTH + 90) * 2, dy: 0 },
  ],
  mixed_heights: [
    { dx: 0, dy: 0 },
    { dx: 150, dy: 85 },
    { dx: 300, dy: 0 },
    { dx: 450, dy: 85 },
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

// Coin data — positioned relative to specific book sections for discoverable placement
const COIN_SIZE = 24;
interface Coin {
  id: string;
  x: number; // world X
  y: number; // height above ground in pixels
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
  const [dimensions, setDimensions] = useState({ width: 1400, height: 900 });
  const [showKeyboardHint, setShowKeyboardHint] = useState(true);
  const [selectedBook, setSelectedBook] = useState<BookPlatformType | null>(null);
  const [flagpoleReached, setFlagpoleReached] = useState(false);
  const [collectedCoins, setCollectedCoins] = useState<Set<string>>(new Set());

  // Direct DOM refs for per-frame updates (no React state needed)
  const worldContainerRef = useRef<HTMLDivElement>(null);
  const playerElementRef = useRef<HTMLDivElement>(null);
  const bgParallaxRef = useRef<HTMLDivElement>(null);
  const cameraXRef = useRef(0);

  // Two-phase camera system
  const cameraLerpRef = useRef(0);
  const onGameStartRef = useRef(onGameStart);
  onGameStartRef.current = onGameStart;
  const lastProgressRef = useRef(0);

  // Player visual state — only updates when walk frame, facing, or grounded changes (~10fps)
  const prevVisualsRef = useRef({ facingRight: true, walkFrame: 0, grounded: true, isMoving: false });
  const [playerVisuals, setPlayerVisuals] = useState({ facingRight: true, walkFrame: 0, grounded: true, isMoving: false });

  const groundY = dimensions.height * 0.85;

  // Generate section-based platforms using absolute pixel coordinates
  const platforms = useMemo((): Platform[] => {
    const result: Platform[] = [];
    let bookIndex = 0;
    let sectionStartX = dimensions.width + 100;

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
          color: book.spineColor,
        });
        bookIndex++;
      }

      if (bookIndex >= BOOKS_DATA.length) break;
      const maxDx = Math.max(...template.map((s) => s.dx));
      sectionStartX += maxDx + BOOK.WIDTH + 150;
    }

    return result;
  }, [dimensions.width]);

  // Generate coins placed at interesting spots in the world
  const coins = useMemo((): Coin[] => {
    if (platforms.length < 10) return [];
    return [
      // Coin 1: Floating above the gap between ground_row_3 and staircase_up
      { id: "coin-0", x: (platforms[2].x + platforms[3].x) / 2, y: 130 },
      // Coin 2: At the peak of the staircase (above the highest step)
      { id: "coin-1", x: platforms[5].x + BOOK.WIDTH / 2 - COIN_SIZE / 2, y: 260 },
      // Coin 3: Above the middle gap_jump book
      { id: "coin-2", x: platforms[11].x + BOOK.WIDTH / 2 - COIN_SIZE / 2, y: 140 },
      // Coin 4: Above the pyramid peak
      { id: "coin-3", x: (platforms[16].x + platforms[17].x) / 2, y: 220 },
    ];
  }, [platforms]);

  // Pre-compute screen Y for each platform (stable when groundY is stable)
  const platformScreenYs = useMemo(() => {
    return platforms.map((p) => groundY - p.y - BOOK.HEIGHT);
  }, [platforms, groundY]);

  const worldWidth = useMemo(() => {
    if (platforms.length === 0) return dimensions.width * 4;
    const lastPlatform = platforms[platforms.length - 1];
    return Math.max(lastPlatform.x + BOOK.WIDTH + 400, dimensions.width * 2);
  }, [platforms, dimensions.width]);

  const flagpoleX = useMemo(() => {
    if (platforms.length === 0) return 3000;
    const lastPlatform = platforms[platforms.length - 1];
    return lastPlatform.x + BOOK.WIDTH + 200;
  }, [platforms]);

  // Signpost position — just before the first book
  const signpostX = useMemo(() => {
    if (platforms.length === 0) return dimensions.width + 50;
    return platforms[0].x - 100;
  }, [platforms, dimensions.width]);

  const sortedPlatforms = useMemo(() => {
    return [...platforms].sort((a, b) => b.y - a.y);
  }, [platforms]);

  // Player physics state (ref, not React state — updated 60fps)
  const playerRef = useRef({
    x: dimensions.width * 0.7,
    y: groundY - PLAYER.HEIGHT,
    vx: 0,
    vy: 0,
    grounded: true,
    facingRight: true,
    walkFrame: 0,
    isMoving: false,
  });

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

  const walkTimer = useRef(0);

  // Game update loop — uses direct DOM manipulation instead of React state
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

      for (const platform of sortedPlatforms) {
        const platScreenX = platform.x;
        const platScreenY = groundY - platform.y - BOOK.HEIGHT;
        const platRight = platScreenX + BOOK.WIDTH;
        const platBottom = platScreenY + BOOK.HEIGHT;

        const playerRight = player.x + PLAYER.WIDTH;
        const playerBottom = player.y + PLAYER.HEIGHT;

        if (playerBottom <= platScreenY + 25 || player.y >= platBottom - 15) continue;
        if (playerRight <= platScreenX || player.x >= platRight) continue;

        if (player.vx > 0) {
          player.x = platScreenX - PLAYER.WIDTH;
        } else if (player.vx < 0) {
          player.x = platRight;
        }
        player.vx = 0;
        break;
      }

      player.x = Math.max(0, Math.min(player.x, worldWidth - PLAYER.WIDTH));

      // --- Vertical update + collision ---
      player.y += player.vy;
      player.grounded = false;

      const groundLevel = groundY - PLAYER.HEIGHT;
      if (player.y >= groundLevel) {
        player.y = groundLevel;
        player.vy = 0;
        player.grounded = true;
      }

      for (const platform of sortedPlatforms) {
        const platX = platform.x;
        const platY = groundY - platform.y - BOOK.HEIGHT;
        const playerBottom = player.y + PLAYER.HEIGHT;
        const playerRight = player.x + PLAYER.WIDTH;

        if (
          player.vy >= 0 &&
          playerRight > platX &&
          player.x < platX + BOOK.WIDTH &&
          playerBottom >= platY &&
          playerBottom <= platY + 20
        ) {
          player.y = platY - PLAYER.HEIGHT;
          player.vy = 0;
          player.grounded = true;
          break;
        }
      }

      // Head bonk — player hits underside of a platform
      if (player.vy < 0) {
        for (const platform of sortedPlatforms) {
          const platX = platform.x;
          const platBottom = groundY - platform.y; // screen Y of bottom edge of book
          const playerRight = player.x + PLAYER.WIDTH;

          if (
            playerRight > platX + 4 &&
            player.x < platX + BOOK.WIDTH - 4 &&
            player.y <= platBottom &&
            player.y >= platBottom - 15
          ) {
            player.y = platBottom;
            player.vy = 0;
            break;
          }
        }
      }

      // Coin collection
      for (const coin of coins) {
        if (collectedCoins.has(coin.id)) continue;
        const coinScreenY = groundY - coin.y - COIN_SIZE;
        const playerRight = player.x + PLAYER.WIDTH;
        const playerBottom = player.y + PLAYER.HEIGHT;
        if (
          playerRight > coin.x &&
          player.x < coin.x + COIN_SIZE &&
          playerBottom > coinScreenY &&
          player.y < coinScreenY + COIN_SIZE
        ) {
          setCollectedCoins((prev) => new Set([...prev, coin.id]));
          play("coinCollect");
          addXP(XP_REWARDS.collectCoin, "Collected a coin!");
          break;
        }
      }

      // Flagpole
      if (!flagpoleReached && player.x + PLAYER.WIDTH >= flagpoleX) {
        setFlagpoleReached(true);
        unlock("book_climber");
        addXP(XP_REWARDS.unlockAchievement, "book_climber");
      }

      // Walk animation
      const moving = Math.abs(player.vx) > 0.5 && player.grounded;
      player.isMoving = moving;
      if (moving) {
        walkTimer.current += deltaTime;
        if (walkTimer.current > 100) {
          player.walkFrame = (player.walkFrame + 1) % 4;
          walkTimer.current = 0;
        }
      } else {
        player.walkFrame = 0;
      }

      // Camera
      const startX = dimensions.width * 0.7;
      const distanceRight = Math.max(0, player.x - startX);
      const gameProgress = Math.min(1, distanceRight / 300);

      if (Math.abs(gameProgress - lastProgressRef.current) > 0.02) {
        lastProgressRef.current = gameProgress;
        onGameStartRef.current?.(gameProgress);
      }

      cameraLerpRef.current += (gameProgress - cameraLerpRef.current) * 0.08;
      const t = cameraLerpRef.current;
      const idleCam = player.x - dimensions.width * 0.7;
      const gameCam = player.x - dimensions.width * 0.25;
      const targetCam = idleCam + (gameCam - idleCam) * t;
      const newCameraX = Math.max(0, Math.min(targetCam, worldWidth - dimensions.width));
      cameraXRef.current = newCameraX;

      // ---- DIRECT DOM UPDATES (bypass React reconciliation) ----

      // World container (ground, grass, platforms, flagpole all scroll together)
      if (worldContainerRef.current) {
        worldContainerRef.current.style.transform = `translateX(${-newCameraX}px)`;
      }

      // Background parallax
      if (bgParallaxRef.current) {
        bgParallaxRef.current.style.transform = `translateX(${-newCameraX * 0.03}px)`;
      }

      // Player position + scale
      if (playerElementRef.current) {
        const sx = player.grounded ? 1 : 0.95;
        const sy = player.grounded ? 1 : 1.05;
        playerElementRef.current.style.left = `${player.x - newCameraX}px`;
        playerElementRef.current.style.top = `${player.y}px`;
        playerElementRef.current.style.transform = `scaleX(${player.facingRight ? sx : -sx}) scaleY(${sy})`;
      }

      // Only trigger React re-render when visual state actually changes
      const pv = prevVisualsRef.current;
      if (player.walkFrame !== pv.walkFrame || player.facingRight !== pv.facingRight || player.grounded !== pv.grounded || player.isMoving !== pv.isMoving) {
        prevVisualsRef.current = { walkFrame: player.walkFrame, facingRight: player.facingRight, grounded: player.grounded, isMoving: player.isMoving };
        setPlayerVisuals({ ...prevVisualsRef.current });
      }
    },
    [prefersReducedMotion, selectedBook, getInput, worldWidth, groundY, dimensions, sortedPlatforms, flagpoleX, flagpoleReached, unlock, addXP, play, coins, collectedCoins]
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
      {/* Background buildings — parallax via ref */}
      <div ref={bgParallaxRef} className="absolute inset-0" style={{ willChange: "transform" }}>
        <BackgroundLayer />
      </div>

      {/* Stars — CSS animations only (no Framer Motion) */}
      {showStars && (
        <div className="absolute inset-0" style={{ opacity: palette.starsOpacity }}>
          <StarsLayer prefersReducedMotion={prefersReducedMotion} />
        </div>
      )}

      {/* World container — scrolled via ref, all children in world-space */}
      <div ref={worldContainerRef} className="absolute inset-0" style={{ willChange: "transform" }}>
        {/* Ground */}
        <div className="absolute bottom-0 left-0 h-[15%]" style={{ width: worldWidth }}>
          <div className="absolute inset-0" style={{ backgroundColor: colors.ground1 }} />
          <div className="absolute bottom-0 left-0 right-0 h-[60%]" style={{ backgroundColor: colors.ground2 }} />
          <div className="absolute bottom-0 left-0 right-0 h-[20%]" style={{ backgroundColor: colors.groundDark }} />
        </div>

        {/* Grass — world-space positions, no cameraX needed */}
        <GrassDetails worldWidth={worldWidth} />

        {/* Book platforms — world-space positions, never re-render during gameplay */}
        {platforms.map((platform, i) => (
          <BookPlatformVisual
            key={platform.id}
            platform={platform}
            x={platform.x}
            y={platformScreenYs[i]}
            coverUrl={covers.get(platform.title)}
            onBookClick={handleBookClick}
          />
        ))}

        {/* Signpost — just before the books */}
        <Signpost x={signpostX} groundY={groundY} />

        {/* Floating coins */}
        {coins.map((coin) => (
          !collectedCoins.has(coin.id) && (
            <CoinVisual key={coin.id} x={coin.x} y={groundY - coin.y - COIN_SIZE} />
          )
        ))}

        {/* Flagpole — world-space position */}
        <Flagpole x={flagpoleX} groundY={groundY} reached={flagpoleReached} />
      </div>

      {/* Player — positioned via ref, outside world container */}
      <div
        ref={playerElementRef}
        className="absolute"
        style={{
          width: PLAYER.WIDTH,
          height: PLAYER.HEIGHT,
          transformOrigin: "center bottom",
          willChange: "transform, left, top",
        }}
      >
        <CharacterSprite
          walkFrame={playerVisuals.walkFrame}
          facingRight={playerVisuals.facingRight}
          isMoving={playerVisuals.isMoving}
        />
      </div>

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

// Pure CSS twinkle — no Framer Motion overhead
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
      <style>{`@keyframes twinkle{0%,100%{opacity:.4}50%{opacity:1}}`}</style>
      {stars.map((star, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            backgroundColor: i % 3 === 0 ? colors.starYellow : colors.starWhite,
            animation: prefersReducedMotion ? "none" : `twinkle ${2 + (i % 3)}s ease-in-out ${i * 0.3}s infinite`,
          }}
        />
      ))}
    </>
  );
}

// Static background — no per-frame props
function BackgroundLayer() {
  return (
    <div className="absolute inset-0">
      <svg
        className="absolute bottom-[15%] right-0 w-full h-[45%]"
        viewBox="0 0 400 150"
        preserveAspectRatio="xMaxYMax meet"
        style={{ imageRendering: "pixelated" }}
      >
        <g opacity="0.5">
          <rect x="340" y="30" width="50" height="120" fill={colors.buildingDark} />
          <rect x="350" y="40" width="10" height="10" fill={colors.window} opacity="0.4" />
          <rect x="370" y="40" width="10" height="10" fill={colors.window} opacity="0.6" />
          <rect x="350" y="60" width="10" height="10" fill={colors.window} opacity="0.3" />
          <rect x="370" y="60" width="10" height="10" fill={colors.window} opacity="0.5" />
          <rect x="350" y="80" width="10" height="10" fill={colors.window} opacity="0.4" />
          <rect x="370" y="80" width="10" height="10" fill={colors.window} opacity="0.3" />
          <rect x="280" y="60" width="45" height="90" fill={colors.buildingDark} />
          <rect x="290" y="70" width="8" height="8" fill={colors.window} opacity="0.5" />
          <rect x="305" y="70" width="8" height="8" fill={colors.window} opacity="0.4" />
          <rect x="290" y="90" width="8" height="8" fill={colors.window} opacity="0.3" />
          <rect x="230" y="90" width="35" height="60" fill={colors.buildingDark} />
          <rect x="240" y="100" width="6" height="6" fill={colors.window} opacity="0.4" />
        </g>
        <g opacity="0.35">
          <rect x="10" y="100" width="30" height="50" fill={colors.buildingDark} />
          <rect x="17" y="108" width="6" height="6" fill={colors.window} opacity="0.4" />
          <rect x="50" y="80" width="40" height="70" fill={colors.buildingDark} />
          <rect x="58" y="88" width="8" height="8" fill={colors.window} opacity="0.5" />
        </g>
      </svg>
    </div>
  );
}

// Grass in world-space — no per-frame cameraX
function GrassDetails({ worldWidth }: { worldWidth: number }) {
  const tufts = useMemo(() => {
    const result = [];
    for (let x = 0; x < worldWidth; x += 100 + Math.random() * 50) {
      result.push({ x, variant: Math.random() > 0.5 ? "double" : "single" });
    }
    return result;
  }, [worldWidth]);

  return (
    <>
      {tufts.map((tuft, i) => (
        <div key={i} className="absolute bottom-[15%]" style={{ left: tuft.x }}>
          <svg width="16" height="20" viewBox="0 0 8 10" style={{ imageRendering: "pixelated" }}>
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

// Character SVG sprite — RPG adventurer with pointed cap + cape
// Front-facing when idle, side-profile when walking
const CharacterSprite = memo(function CharacterSprite({ walkFrame, facingRight, isMoving }: { walkFrame: number; facingRight: boolean; isMoving: boolean }) {
  const isWalking = isMoving;

  if (isWalking) {
    // Side-profile walking sprite (drawn facing right; parent scaleX flips for left)
    const legOffsets = [
      { front: 0, back: 0 },
      { front: 1, back: -1 },
      { front: 0, back: 0 },
      { front: -1, back: 1 },
    ];
    const offset = legOffsets[walkFrame] || legOffsets[0];
    // Cape flutter tied to walk frame
    const capeFlutter = walkFrame % 2 === 0 ? 0 : -1;

    return (
      <svg width="64" height="80" viewBox="0 0 16 20" style={{ imageRendering: "pixelated", display: "block" }}>
        {/* Shadow */}
        <ellipse cx="8" cy="19" rx="5" ry="1.5" fill={colors.groundDark} opacity="0.4" />
        {/* Cape flowing behind */}
        <rect x={3 + capeFlutter} y="5" width="3" height="8" fill="#2A9D8F" />
        <rect x={2 + capeFlutter} y="7" width="2" height="7" fill="#22857A" />
        {/* Pointed cap */}
        <rect x="7" y="0" width="3" height="1" fill={colors.char1} />
        <rect x="6" y="1" width="5" height="1" fill={colors.char1} />
        <rect x="5" y="2" width="6" height="1" fill={colors.charDark} />
        {/* Cap tail */}
        <rect x="4" y="1" width="2" height="1" fill={colors.char2} />
        <rect x="3" y="2" width="2" height="1" fill={colors.char2} />
        {/* Head (profile facing right) */}
        <rect x="6" y="3" width="4" height="5" fill="#FFD5B8" />
        <rect x="10" y="3" width="1" height="4" fill="#FFD5B8" />
        {/* Hair at back */}
        <rect x="5" y="3" width="1" height="3" fill="#8B4513" />
        {/* Eye */}
        <rect x="9" y="4" width="2" height="2" fill="#2D3748" />
        <rect x="9" y="4" width="1" height="1" fill="#FFFFFF" />
        {/* Nose */}
        <rect x="11" y="5" width="1" height="1" fill="#E8A088" />
        {/* Mouth */}
        <rect x="9" y="7" width="2" height="1" fill="#E8A088" />
        {/* Ear */}
        <rect x="5" y="5" width="1" height="2" fill="#F5C9A8" />
        {/* Tunic body */}
        <rect x="5" y="8" width="5" height="6" fill={colors.char1} />
        <rect x="6" y="8" width="4" height="1" fill={colors.char2} />
        {/* Arm (front, swings with walk) */}
        <rect x={10 + offset.front} y="9" width="2" height="4" fill={colors.char1} />
        <rect x={10 + offset.front} y="12" width="2" height="1" fill="#FFD5B8" />
        {/* Belt */}
        <rect x="5" y="13" width="5" height="1" fill="#8B7355" />
        <rect x="7" y="13" width="2" height="1" fill="#D4AF37" />
        {/* Legs */}
        <g transform={`translate(${offset.front}, 0)`}>
          <rect x="8" y="14" width="3" height="4" fill="#4A5568" />
          <rect x="8" y="17" width="3" height="2" fill="#6B3A1F" />
          <rect x="8" y="17" width="3" height="1" fill="#8B4F2E" />
        </g>
        <g transform={`translate(${offset.back}, 0)`}>
          <rect x="5" y="14" width="3" height="4" fill="#4A5568" />
          <rect x="5" y="17" width="3" height="2" fill="#6B3A1F" />
          <rect x="5" y="17" width="3" height="1" fill="#8B4F2E" />
        </g>
      </svg>
    );
  }

  // Front-facing idle sprite — RPG adventurer
  return (
    <svg width="64" height="80" viewBox="0 0 16 20" style={{ imageRendering: "pixelated", display: "block" }}>
      {/* Shadow */}
      <ellipse cx="8" cy="19" rx="5" ry="1.5" fill={colors.groundDark} opacity="0.4" />
      {/* Cape behind (visible at sides) */}
      <rect x="2" y="9" width="1" height="6" fill="#2A9D8F" />
      <rect x="13" y="9" width="1" height="6" fill="#2A9D8F" />
      {/* Pointed cap */}
      <rect x="6" y="0" width="4" height="1" fill={colors.char1} />
      <rect x="5" y="1" width="6" height="1" fill={colors.char1} />
      <rect x="7" y="0" width="2" height="1" fill={colors.char2} />
      <rect x="4" y="2" width="8" height="1" fill={colors.charDark} />
      {/* Hair peeking under cap */}
      <rect x="3" y="2" width="2" height="2" fill="#8B4513" />
      <rect x="11" y="2" width="2" height="2" fill="#8B4513" />
      {/* Face */}
      <rect x="4" y="3" width="8" height="6" fill="#FFD5B8" />
      <rect x="3" y="4" width="1" height="4" fill="#FFD5B8" />
      <rect x="12" y="4" width="1" height="4" fill="#FFD5B8" />
      {/* Eyes */}
      <rect x="5" y="5" width="2" height="2" fill="#2D3748" />
      <rect x="9" y="5" width="2" height="2" fill="#2D3748" />
      <rect x="5" y="5" width="1" height="1" fill="#FFFFFF" />
      <rect x="9" y="5" width="1" height="1" fill="#FFFFFF" />
      {/* Blush */}
      <rect x="4" y="6" width="1" height="1" fill="#FFB6C1" opacity="0.5" />
      <rect x="11" y="6" width="1" height="1" fill="#FFB6C1" opacity="0.5" />
      {/* Nose + mouth */}
      <rect x="7" y="7" width="2" height="1" fill="#E8A088" />
      <rect x="6" y="8" width="4" height="1" fill="#F5C9A8" />
      {/* Tunic body */}
      <rect x="4" y="9" width="8" height="5" fill={colors.char1} />
      <rect x="3" y="9" width="1" height="4" fill={colors.char1} />
      <rect x="12" y="9" width="1" height="4" fill={colors.char1} />
      <rect x="6" y="9" width="4" height="1" fill={colors.char2} />
      {/* Arms */}
      <rect x="2" y="9" width="2" height="4" fill={colors.char1} />
      <rect x="12" y="9" width="2" height="4" fill={colors.char1} />
      <rect x="2" y="12" width="2" height="2" fill="#FFD5B8" />
      <rect x="12" y="12" width="2" height="2" fill="#FFD5B8" />
      {/* Belt */}
      <rect x="4" y="13" width="8" height="1" fill="#8B7355" />
      <rect x="7" y="13" width="2" height="1" fill="#D4AF37" />
      {/* Legs */}
      <rect x="5" y="14" width="3" height="4" fill="#4A5568" />
      <rect x="8" y="14" width="3" height="4" fill="#4A5568" />
      {/* Boots */}
      <rect x="4" y="17" width="4" height="2" fill="#6B3A1F" />
      <rect x="8" y="17" width="4" height="2" fill="#6B3A1F" />
      <rect x="4" y="17" width="4" height="1" fill="#8B4F2E" />
      <rect x="8" y="17" width="4" height="1" fill="#8B4F2E" />
    </svg>
  );
});

interface BookPlatformVisualProps {
  platform: Platform;
  x: number;
  y: number;
  coverUrl?: string;
  onBookClick: (platform: Platform) => void;
}

const BookPlatformVisual = memo(function BookPlatformVisual({ platform, x, y, coverUrl, onBookClick }: BookPlatformVisualProps) {
  return (
    <div
      className="absolute cursor-pointer hover:brightness-110 transition-[filter]"
      style={{ left: x, top: y, width: BOOK.WIDTH, height: BOOK.HEIGHT }}
      onClick={() => onBookClick(platform)}
      role="button"
      tabIndex={0}
      aria-label={`${platform.title} by ${platform.author}`}
    >
      {/* Thin black outline around entire book */}
      <div className="relative w-full h-full" style={{ border: "1.5px solid #111" }}>
        {/* Spine - theme-matched color */}
        <div
          className="absolute left-0 top-0 w-2 h-full"
          style={{ backgroundColor: platform.color }}
        />
        {/* Cover area */}
        <div
          className="absolute left-2 top-0 h-full overflow-hidden"
          style={{ width: BOOK.WIDTH - 8 - 1, backgroundColor: platform.color }}
        >
          {/* Fallback text (visible when no cover loads) */}
          <div className="w-full h-full flex items-center justify-center p-1">
            <span className="text-white text-[9px] text-center font-bold leading-tight drop-shadow">
              {platform.title.length > 18 ? platform.title.slice(0, 18) + "..." : platform.title}
            </span>
          </div>
          {coverUrl && (
            <img
              src={coverUrl}
              alt={platform.title}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          )}
        </div>
      </div>
    </div>
  );
});

// Floating coin with CSS bob animation
const CoinVisual = memo(function CoinVisual({ x, y }: { x: number; y: number }) {
  return (
    <div
      className="absolute coin-bob"
      style={{ left: x, top: y, width: COIN_SIZE, height: COIN_SIZE }}
    >
      <svg width={COIN_SIZE} height={COIN_SIZE} viewBox="0 0 24 24" style={{ imageRendering: "pixelated" }}>
        {/* Outer ring */}
        <circle cx="12" cy="12" r="11" fill="#D4AF37" />
        <circle cx="12" cy="12" r="9" fill="#F5D442" />
        {/* Inner highlight */}
        <circle cx="10" cy="10" r="5" fill="#FBEAA0" opacity="0.5" />
        {/* Dollar/star mark */}
        <text x="12" y="16" textAnchor="middle" fill="#D4AF37" fontSize="11" fontWeight="bold" fontFamily="sans-serif">$</text>
      </svg>
    </div>
  );
});

// Wooden signpost before the bookshelf
function Signpost({ x, groundY }: { x: number; groundY: number }) {
  const postHeight = 90;
  const postTop = groundY - postHeight;

  return (
    <div className="absolute" style={{ left: x, top: postTop, width: 80 }}>
      {/* Post */}
      <div className="absolute left-[36px] top-[40px] w-[8px]" style={{ height: postHeight - 40, backgroundColor: "#8B6914" }}>
        <div className="absolute left-[2px] top-0 w-[2px] h-full" style={{ backgroundColor: "#A0822A" }} />
      </div>
      {/* Sign board */}
      <div
        className="absolute left-0 top-0 w-[80px] h-[44px] flex items-center justify-center px-1"
        style={{
          backgroundColor: "#6B5B3E",
          border: "2px solid #5D4E37",
          borderRadius: "2px",
        }}
      >
        <div className="absolute inset-0 opacity-20" style={{ backgroundColor: "#8B7355", clipPath: "polygon(0 0, 100% 0, 95% 100%, 5% 100%)" }} />
        <span
          className="relative text-[7px] text-center leading-tight font-bold"
          style={{ color: "#F5E6C8", textShadow: "0 1px 0 #3A2E1E" }}
        >
          Books that shaped my thinking
        </span>
      </div>
    </div>
  );
}

interface FlagpoleProps {
  x: number;
  groundY: number;
  reached: boolean;
}

function Flagpole({ x, groundY, reached }: FlagpoleProps) {
  const poleHeight = 200;
  const poleTop = groundY - poleHeight;

  return (
    <div className="absolute" style={{ left: x, top: poleTop }}>
      <div className="absolute left-1 top-0 w-1.5" style={{ height: poleHeight, backgroundColor: "#94A3B8" }} />
      <div className="absolute left-1.5 top-0 w-0.5" style={{ height: poleHeight, backgroundColor: "#CBD5E1" }} />
      <div className="absolute -left-0.5 -top-3 w-5 h-5 rounded-full" style={{ backgroundColor: "#D4AF37", boxShadow: "0 0 8px #D4AF37" }} />
      <motion.div
        className="absolute left-3"
        initial={{ top: poleHeight - 60 }}
        animate={{ top: reached ? 10 : poleHeight - 60 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="relative">
          <div
            className="w-16 h-10"
            style={{ backgroundColor: colors.accent1, clipPath: "polygon(0 0, 100% 50%, 0 100%)" }}
          />
          <span className="absolute inset-0 flex items-center justify-center text-yellow-300 text-base font-bold" style={{ paddingRight: 8 }}>★</span>
        </div>
      </motion.div>
      <div
        className="absolute -left-4 w-12 h-3 rounded"
        style={{ top: poleHeight - 3, backgroundColor: colors.building2 }}
      />
      <div
        className="absolute -left-3 w-10 h-1.5 rounded"
        style={{ top: poleHeight - 5, backgroundColor: "#94A3B8" }}
      />
    </div>
  );
}
