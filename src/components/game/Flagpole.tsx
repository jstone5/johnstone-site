"use client";

import { memo } from 'react';
import { COLORS } from '@/lib/game/physics';

interface FlagpoleProps {
  x: number;
  groundY: number;
  reached: boolean;
}

export const Flagpole = memo(function Flagpole({
  x,
  groundY,
  reached,
}: FlagpoleProps) {
  const poleHeight = 200;
  const poleWidth = 6;
  const flagWidth = 60;
  const flagHeight = 40;
  const poleTop = groundY - poleHeight;

  // Flag animates up when reached
  const flagY = reached ? poleTop + 10 : poleTop + poleHeight - flagHeight - 20;

  return (
    <g>
      {/* Pole */}
      <rect
        x={x}
        y={poleTop}
        width={poleWidth}
        height={poleHeight}
        fill={COLORS.building1}
      />

      {/* Pole top ball */}
      <circle
        cx={x + poleWidth / 2}
        cy={poleTop}
        r={8}
        fill={COLORS.beltBuckle}
      />

      {/* Flag */}
      <g style={{
        transition: reached ? 'transform 0.8s ease-out' : 'none',
        transform: `translateY(${reached ? 0 : poleHeight - flagHeight - 30}px)`,
      }}>
        <polygon
          points={`
            ${x + poleWidth},${poleTop + 10}
            ${x + poleWidth + flagWidth},${poleTop + 10 + flagHeight / 2}
            ${x + poleWidth},${poleTop + 10 + flagHeight}
          `}
          fill={COLORS.accent1}
        />
        {/* Flag decoration - star */}
        <text
          x={x + poleWidth + flagWidth / 2 - 5}
          y={poleTop + 10 + flagHeight / 2 + 5}
          fontSize={20}
          fill={COLORS.beltBuckle}
        >
          ★
        </text>
      </g>

      {/* Base platform */}
      <rect
        x={x - 15}
        y={groundY - 10}
        width={poleWidth + 30}
        height={10}
        fill={COLORS.building2}
      />

      {/* Celebration effect when reached */}
      {reached && (
        <>
          {[...Array(8)].map((_, i) => (
            <circle
              key={i}
              cx={x + poleWidth / 2}
              cy={poleTop + 50}
              r={4}
              fill={i % 2 === 0 ? COLORS.beltBuckle : COLORS.accent1}
              style={{
                animation: `confetti-${i} 1s ease-out forwards`,
                opacity: 0,
              }}
            />
          ))}
        </>
      )}

      <style>{`
        @keyframes confetti-0 { 0% { opacity: 1; transform: translate(0, 0); } 100% { opacity: 0; transform: translate(-30px, -60px); } }
        @keyframes confetti-1 { 0% { opacity: 1; transform: translate(0, 0); } 100% { opacity: 0; transform: translate(30px, -70px); } }
        @keyframes confetti-2 { 0% { opacity: 1; transform: translate(0, 0); } 100% { opacity: 0; transform: translate(-20px, -80px); } }
        @keyframes confetti-3 { 0% { opacity: 1; transform: translate(0, 0); } 100% { opacity: 0; transform: translate(40px, -50px); } }
        @keyframes confetti-4 { 0% { opacity: 1; transform: translate(0, 0); } 100% { opacity: 0; transform: translate(-40px, -40px); } }
        @keyframes confetti-5 { 0% { opacity: 1; transform: translate(0, 0); } 100% { opacity: 0; transform: translate(20px, -90px); } }
        @keyframes confetti-6 { 0% { opacity: 1; transform: translate(0, 0); } 100% { opacity: 0; transform: translate(-10px, -70px); } }
        @keyframes confetti-7 { 0% { opacity: 1; transform: translate(0, 0); } 100% { opacity: 0; transform: translate(50px, -60px); } }
      `}</style>
    </g>
  );
});
