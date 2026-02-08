"use client";

import { memo } from 'react';
import type { BookPlatform as BookPlatformType } from '@/lib/game/types';

interface BookPlatformProps {
  platform: BookPlatformType;
  coverUrl?: string;
  onClick?: (platform: BookPlatformType) => void;
}

export const BookPlatform = memo(function BookPlatform({
  platform,
  coverUrl,
  onClick,
}: BookPlatformProps) {
  const { x, y, width, height, color, title } = platform;

  // 3D book effect depths
  const sideDepth = 12;
  const topDepth = 6;

  // Darken color for sides
  const darkenColor = (hex: string, amount: number): string => {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.max(0, (num >> 16) - amount);
    const g = Math.max(0, ((num >> 8) & 0x00FF) - amount);
    const b = Math.max(0, (num & 0x0000FF) - amount);
    return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
  };

  const sideColor = darkenColor(color, 40);
  const topColor = darkenColor(color, 20);

  const handleClick = () => {
    if (onClick) {
      onClick(platform);
    }
  };

  return (
    <g
      onClick={handleClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      role="button"
      tabIndex={0}
      aria-label={`${title} by ${platform.author}`}
    >
      {/* Book spine (left side - 3D effect) */}
      <polygon
        points={`
          ${x},${y}
          ${x - sideDepth},${y + topDepth}
          ${x - sideDepth},${y + height + topDepth}
          ${x},${y + height}
        `}
        fill={sideColor}
      />

      {/* Book top (3D effect) */}
      <polygon
        points={`
          ${x},${y}
          ${x + width},${y}
          ${x + width - sideDepth},${y + topDepth}
          ${x - sideDepth},${y + topDepth}
        `}
        fill={topColor}
      />

      {/* Book front cover */}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={color}
        stroke={sideColor}
        strokeWidth={1}
      />

      {/* Cover image or title */}
      {coverUrl ? (
        <image
          href={coverUrl}
          x={x + 4}
          y={y + 4}
          width={width - 8}
          height={height - 8}
          preserveAspectRatio="xMidYMid slice"
          clipPath={`inset(0 round 2px)`}
        />
      ) : (
        <>
          {/* Fallback: Title text on spine */}
          <text
            x={x + width / 2}
            y={y + height / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#FFFFFF"
            fontSize={10}
            fontFamily="var(--font-pixelify-sans)"
            style={{
              textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
              pointerEvents: 'none',
            }}
          >
            {title.length > 12 ? title.slice(0, 12) + '...' : title}
          </text>
        </>
      )}

      {/* Subtle highlight on cover */}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill="url(#bookHighlight)"
        style={{ pointerEvents: 'none' }}
      />
    </g>
  );
});

// Gradient definition for book highlight effect
export function BookHighlightDef() {
  return (
    <defs>
      <linearGradient id="bookHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.15} />
        <stop offset="50%" stopColor="#FFFFFF" stopOpacity={0} />
        <stop offset="100%" stopColor="#000000" stopOpacity={0.1} />
      </linearGradient>
    </defs>
  );
}
