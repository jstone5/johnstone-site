"use client";

import { memo, useMemo } from 'react';
import { COLORS, GAME_CONFIG } from '@/lib/game/physics';

interface GamePlayerProps {
  x: number;
  y: number;
  facingRight: boolean;
  animationFrame: number;
  isJumping: boolean;
  isGrounded: boolean;
}

// Pixel scale for the character
const PIXEL = 2;
const WIDTH = GAME_CONFIG.PLAYER_WIDTH;
const HEIGHT = GAME_CONFIG.PLAYER_HEIGHT;

export const GamePlayer = memo(function GamePlayer({
  x,
  y,
  facingRight,
  animationFrame,
  isJumping,
}: GamePlayerProps) {
  // Calculate leg positions based on animation frame
  const legOffset = useMemo(() => {
    if (isJumping) return { left: -2, right: 2 }; // Spread legs when jumping

    // Walking animation: 4 frames
    switch (animationFrame) {
      case 0: return { left: 0, right: 0 };      // Idle
      case 1: return { left: -3, right: 2 };     // Left leg forward
      case 2: return { left: -1, right: 1 };     // Passing
      case 3: return { left: 2, right: -3 };     // Right leg forward
      default: return { left: 0, right: 0 };
    }
  }, [animationFrame, isJumping]);

  // Squash/stretch for jump
  const scaleY = isJumping ? 1.1 : 1;
  const scaleX = isJumping ? 0.9 : 1;

  return (
    <g
      transform={`translate(${x}, ${y}) scale(${facingRight ? 1 : -1}, 1) scale(${scaleX}, ${scaleY})`}
      style={{ transformOrigin: `${WIDTH / 2}px ${HEIGHT}px` }}
    >
      {/* Transform group for flipping */}
      <g transform={facingRight ? '' : `translate(${-WIDTH}, 0) scale(-1, 1)`}>
        {/* Hair */}
        <rect x={8} y={0} width={16} height={4} fill={COLORS.hair} />
        <rect x={6} y={4} width={20} height={4} fill={COLORS.hair} />
        <rect x={4} y={8} width={6} height={4} fill={COLORS.hair} />
        <rect x={22} y={8} width={6} height={4} fill={COLORS.hair} />

        {/* Face */}
        <rect x={6} y={8} width={20} height={12} fill={COLORS.face} />

        {/* Eyes */}
        <rect x={10} y={12} width={4} height={4} fill={COLORS.eyes} />
        <rect x={18} y={12} width={4} height={4} fill={COLORS.eyes} />
        {/* Eye highlights */}
        <rect x={11} y={13} width={2} height={2} fill={COLORS.eyeHighlight} />
        <rect x={19} y={13} width={2} height={2} fill={COLORS.eyeHighlight} />

        {/* Blush */}
        <rect x={6} y={16} width={4} height={2} fill={COLORS.blush} opacity={0.6} />
        <rect x={22} y={16} width={4} height={2} fill={COLORS.blush} opacity={0.6} />

        {/* Smile */}
        <rect x={12} y={18} width={8} height={2} fill={COLORS.smile} />

        {/* Neck */}
        <rect x={12} y={20} width={8} height={4} fill={COLORS.neck} />

        {/* Shirt (teal) */}
        <rect x={6} y={24} width={20} height={12} fill={COLORS.char1} />
        {/* Shirt trim */}
        <rect x={6} y={24} width={20} height={2} fill={COLORS.char2} />

        {/* Belt */}
        <rect x={6} y={34} width={20} height={4} fill={COLORS.belt} />
        {/* Belt buckle */}
        <rect x={13} y={35} width={6} height={2} fill={COLORS.beltBuckle} />

        {/* Pants */}
        <rect x={6} y={38} width={8} height={6} fill={COLORS.pants} />
        <rect x={18} y={38} width={8} height={6} fill={COLORS.pants} />

        {/* Legs with animation */}
        <g transform={`translate(${legOffset.left}, 0)`}>
          <rect x={8} y={44} width={6} height={4} fill={COLORS.pants} />
        </g>
        <g transform={`translate(${legOffset.right}, 0)`}>
          <rect x={18} y={44} width={6} height={4} fill={COLORS.pants} />
        </g>

        {/* Boots with animation */}
        <g transform={`translate(${legOffset.left}, 0)`}>
          <rect x={6} y={44} width={8} height={4} fill={COLORS.boots} />
        </g>
        <g transform={`translate(${legOffset.right}, 0)`}>
          <rect x={18} y={44} width={8} height={4} fill={COLORS.boots} />
        </g>
      </g>
    </g>
  );
});
