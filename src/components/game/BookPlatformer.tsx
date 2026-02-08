"use client";

import { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useAchievements } from '@/contexts/AchievementContext';
import { useSound } from '@/contexts/SoundContext';
import { useGameLoop } from '@/hooks/useGameLoop';
import { useGameInput } from '@/hooks/useGameInput';
import { useBookCovers } from '@/hooks/useBookCovers';
import { PHYSICS, GAME_CONFIG, getGroundY, clamp } from '@/lib/game/physics';
import { generatePlatforms } from '@/lib/game/books';
import {
  checkPlatformCollision,
  resolvePlatformCollision,
  checkGroundCollision,
  resolveGroundCollision,
  checkFlagpoleCollision,
} from '@/lib/game/collision';
import type { GameState, BookPlatform as BookPlatformType, Player } from '@/lib/game/types';
import { GameCanvas } from './GameCanvas';
import { BookModal } from './BookModal';
import { MobileControls, KeyboardHint } from './MobileControls';

interface BookPlatformerProps {
  className?: string;
}

export function BookPlatformer({ className = '' }: BookPlatformerProps) {
  const prefersReducedMotion = useReducedMotion();
  const { unlock } = useAchievements();
  const { play } = useSound();
  const { covers } = useBookCovers();

  // Container ref for sizing
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });

  // Game state using refs for performance
  const gameStateRef = useRef<GameState | null>(null);
  const [, forceUpdate] = useState(0);
  const [selectedBook, setSelectedBook] = useState<BookPlatformType | null>(null);
  const [showKeyboardHint, setShowKeyboardHint] = useState(true);
  const [flagpoleReached, setFlagpoleReached] = useState(false);

  // Calculate derived values
  const groundY = useMemo(() => getGroundY(dimensions.height), [dimensions.height]);
  const platforms = useMemo(() => generatePlatforms(400, groundY), [groundY]);
  const worldWidth = useMemo(() => {
    const lastPlatform = platforms[platforms.length - 1];
    return lastPlatform ? lastPlatform.x + lastPlatform.width + GAME_CONFIG.FLAGPOLE_X_OFFSET : GAME_CONFIG.WORLD_WIDTH;
  }, [platforms]);
  const flagpoleX = worldWidth - GAME_CONFIG.FLAGPOLE_X_OFFSET;

  // Initialize game state
  const initializeGameState = useCallback((): GameState => {
    const groundYValue = getGroundY(dimensions.height);
    return {
      player: {
        position: { x: 100, y: groundYValue - GAME_CONFIG.PLAYER_HEIGHT },
        velocity: { x: 0, y: 0 },
        isGrounded: true,
        facingRight: true,
        animationFrame: 0,
        isJumping: false,
      },
      camera: {
        x: 0,
        minX: 0,
        maxX: worldWidth - dimensions.width,
      },
      platforms: platforms,
      flagpoleReached: false,
      gameStarted: false,
      showKeyboardHint: true,
    };
  }, [dimensions.height, dimensions.width, worldWidth, platforms]);

  // Initialize on mount
  useEffect(() => {
    if (!gameStateRef.current) {
      gameStateRef.current = initializeGameState();
    }
  }, [initializeGameState]);

  // Handle first input
  const handleFirstInput = useCallback(() => {
    setShowKeyboardHint(false);
    if (gameStateRef.current) {
      gameStateRef.current.showKeyboardHint = false;
      gameStateRef.current.gameStarted = true;
    }
  }, []);

  const { getInput, setLeft, setRight, setJump } = useGameInput(handleFirstInput);

  // Animation frame counter
  const animationTimer = useRef(0);

  // Game update function
  const updateGame = useCallback((deltaTime: number) => {
    if (!gameStateRef.current || prefersReducedMotion) return;

    const state = gameStateRef.current;
    const input = getInput();
    const player = state.player;
    const previousY = player.position.y;

    // Skip if modal is open
    if (selectedBook) return;

    // Apply horizontal movement
    let newVelX = 0;
    if (input.left) {
      newVelX = -PHYSICS.MOVE_SPEED;
      player.facingRight = false;
    }
    if (input.right) {
      newVelX = PHYSICS.MOVE_SPEED;
      player.facingRight = true;
    }

    // Apply friction
    player.velocity.x = newVelX * PHYSICS.FRICTION + player.velocity.x * (1 - PHYSICS.FRICTION);

    // Jump
    if (input.jump && player.isGrounded && !player.isJumping) {
      player.velocity.y = PHYSICS.JUMP_FORCE;
      player.isGrounded = false;
      player.isJumping = true;
      play('menuSelect');
    }

    // Apply gravity
    if (!player.isGrounded) {
      player.velocity.y += PHYSICS.GRAVITY;
      player.velocity.y = Math.min(player.velocity.y, PHYSICS.MAX_FALL_SPEED);
    }

    // Update position
    player.position.x += player.velocity.x;
    player.position.y += player.velocity.y;

    // Clamp to world bounds
    player.position.x = clamp(player.position.x, 0, worldWidth - GAME_CONFIG.PLAYER_WIDTH);

    // Check platform collisions
    player.isGrounded = false;
    for (const platform of platforms) {
      if (checkPlatformCollision(player, platform, previousY)) {
        const resolved = resolvePlatformCollision(player, platform);
        Object.assign(player, resolved);
        break;
      }
    }

    // Check ground collision
    if (checkGroundCollision(player, groundY)) {
      const resolved = resolveGroundCollision(player, groundY);
      Object.assign(player, resolved);
    }

    // Check flagpole collision
    if (!state.flagpoleReached && checkFlagpoleCollision(player, flagpoleX)) {
      state.flagpoleReached = true;
      setFlagpoleReached(true);
      unlock('book_climber');
      play('achievement');
    }

    // Update animation frame
    if (Math.abs(player.velocity.x) > 0.5 && player.isGrounded) {
      animationTimer.current += deltaTime;
      if (animationTimer.current > 100) {
        player.animationFrame = (player.animationFrame + 1) % 4;
        animationTimer.current = 0;
      }
    } else if (player.isGrounded) {
      player.animationFrame = 0;
    }

    // Update camera
    const targetCameraX = player.position.x - GAME_CONFIG.CAMERA_LEAD;
    state.camera.x = clamp(
      targetCameraX,
      state.camera.minX,
      state.camera.maxX
    );

    // Force re-render
    forceUpdate(n => n + 1);
  }, [getInput, groundY, platforms, worldWidth, flagpoleX, selectedBook, unlock, play, prefersReducedMotion]);

  // Start game loop
  useGameLoop(updateGame, !prefersReducedMotion);

  // Handle resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: rect.width,
          height: Math.min(rect.width * 0.5, 400),
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Reset game state when dimensions change
  useEffect(() => {
    gameStateRef.current = initializeGameState();
  }, [initializeGameState]);

  const handleBookClick = useCallback((book: BookPlatformType) => {
    setSelectedBook(book);
    play('menuSelect');
  }, [play]);

  const handleCloseModal = useCallback(() => {
    setSelectedBook(null);
  }, []);

  const state = gameStateRef.current;

  if (!state) return null;

  return (
    <div ref={containerRef} className={`relative w-full overflow-hidden ${className}`}>
      <div
        className="relative rounded-lg border border-[var(--border)]/30 overflow-hidden"
        style={{ height: dimensions.height }}
      >
        <GameCanvas
          width={dimensions.width}
          height={dimensions.height}
          worldWidth={worldWidth}
          cameraX={state.camera.x}
          groundY={groundY}
          player={state.player}
          platforms={platforms}
          covers={covers}
          flagpoleX={flagpoleX}
          flagpoleReached={flagpoleReached}
          onBookClick={handleBookClick}
        />

        <KeyboardHint visible={showKeyboardHint} />
      </div>

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
        onClose={handleCloseModal}
      />
    </div>
  );
}
