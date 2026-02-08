"use client";

import { memo, forwardRef } from 'react';
import { COLORS, GAME_CONFIG } from '@/lib/game/physics';
import type { BookPlatform as BookPlatformType, Player } from '@/lib/game/types';
import { GamePlayer } from './GamePlayer';
import { BookPlatform, BookHighlightDef } from './BookPlatform';
import { Flagpole } from './Flagpole';

interface GameCanvasProps {
  width: number;
  height: number;
  worldWidth: number;
  cameraX: number;
  groundY: number;
  player: Player;
  platforms: BookPlatformType[];
  covers: Map<string, string>;
  flagpoleX: number;
  flagpoleReached: boolean;
  onBookClick: (book: BookPlatformType) => void;
}

export const GameCanvas = memo(forwardRef<SVGSVGElement, GameCanvasProps>(
  function GameCanvas(
    {
      width,
      height,
      worldWidth,
      cameraX,
      groundY,
      player,
      platforms,
      covers,
      flagpoleX,
      flagpoleReached,
      onBookClick,
    },
    ref
  ) {
    return (
      <svg
        ref={ref}
        width={width}
        height={height}
        viewBox={`${cameraX} 0 ${width} ${height}`}
        className="block"
        style={{ backgroundColor: 'transparent' }}
      >
        <BookHighlightDef />

        {/* Ground layer */}
        <rect
          x={0}
          y={groundY}
          width={worldWidth + GAME_CONFIG.FLAGPOLE_X_OFFSET + 100}
          height={height - groundY}
          fill={COLORS.ground1}
        />
        {/* Ground texture stripes */}
        <rect
          x={0}
          y={groundY + 5}
          width={worldWidth + GAME_CONFIG.FLAGPOLE_X_OFFSET + 100}
          height={8}
          fill={COLORS.ground2}
        />
        <rect
          x={0}
          y={groundY + 18}
          width={worldWidth + GAME_CONFIG.FLAGPOLE_X_OFFSET + 100}
          height={height - groundY - 18}
          fill={COLORS.groundDark}
        />

        {/* Parallax background buildings */}
        <g opacity={0.3}>
          {[...Array(Math.ceil(worldWidth / 200) + 2)].map((_, i) => {
            const bx = i * 200 + (cameraX * 0.3);
            const bh = 80 + (i % 3) * 40;
            return (
              <rect
                key={`bg-${i}`}
                x={bx}
                y={groundY - bh}
                width={80}
                height={bh}
                fill={COLORS.buildingDark}
              />
            );
          })}
        </g>

        {/* Book platforms */}
        {platforms.map((platform) => (
          <BookPlatform
            key={platform.id}
            platform={platform}
            coverUrl={covers.get(platform.title)}
            onClick={onBookClick}
          />
        ))}

        {/* Flagpole */}
        <Flagpole
          x={flagpoleX}
          groundY={groundY}
          reached={flagpoleReached}
        />

        {/* Player */}
        <GamePlayer
          x={player.position.x}
          y={player.position.y}
          facingRight={player.facingRight}
          animationFrame={player.animationFrame}
          isJumping={player.isJumping}
          isGrounded={player.isGrounded}
        />
      </svg>
    );
  }
));
