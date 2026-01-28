"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { levels, type LevelId } from "@/content/site";
import { useIsClient } from "@/lib/hooks";
import { GameAvatar } from "./GameAvatar";
import { useSound } from "@/contexts/SoundContext";

interface LevelTrackerProps {
  activeLevel: LevelId;
  onLevelClick: (levelId: LevelId) => void;
}

export function LevelTracker({ activeLevel, onLevelClick }: LevelTrackerProps) {
  const isClient = useIsClient();
  const prefersReducedMotion = useReducedMotion();
  const [prevLevel, setPrevLevel] = useState<LevelId>(activeLevel);
  const [isMoving, setIsMoving] = useState(false);
  const [direction, setDirection] = useState<"up" | "down" | "idle">("idle");
  const { play, init } = useSound();
  const isFirstRender = useRef(true);

  // Track level changes for avatar animation
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (activeLevel !== prevLevel) {
      // Determine direction
      const prevIndex = levels.findIndex((l) => l.id === prevLevel);
      const newIndex = levels.findIndex((l) => l.id === activeLevel);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDirection(newIndex > prevIndex ? "down" : "up");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsMoving(true);

      // Play level enter sound
      play("levelEnter");

      // Stop moving after transition
      const timeout = setTimeout(() => {
        setIsMoving(false);
        setDirection("idle");
      }, 500);

      setPrevLevel(activeLevel);
      return () => clearTimeout(timeout);
    }
  }, [activeLevel, prevLevel, play]);

  const handleLevelClick = (levelId: LevelId) => {
    init(); // Initialize audio on first interaction
    play("menuSelect");
    onLevelClick(levelId);
  };

  const handleHover = () => {
    play("menuMove");
  };

  if (!isClient) return null;

  return (
    <>
      {/* Desktop tracker - left rail */}
      <DesktopTracker
        activeLevel={activeLevel}
        onLevelClick={handleLevelClick}
        onHover={handleHover}
        prefersReducedMotion={prefersReducedMotion}
        isMoving={isMoving}
        direction={direction}
      />

      {/* Mobile tracker - bottom bar */}
      <MobileTracker
        activeLevel={activeLevel}
        onLevelClick={handleLevelClick}
        onHover={handleHover}
        prefersReducedMotion={prefersReducedMotion}
      />
    </>
  );
}

interface TrackerProps {
  activeLevel: LevelId;
  onLevelClick: (levelId: LevelId) => void;
  onHover: () => void;
  prefersReducedMotion: boolean | null;
  isMoving?: boolean;
  direction?: "up" | "down" | "idle";
}

function DesktopTracker({
  activeLevel,
  onLevelClick,
  onHover,
  prefersReducedMotion,
  isMoving = false,
  direction = "idle",
}: TrackerProps) {
  const activeIndex = levels.findIndex((l) => l.id === activeLevel);

  return (
    <div className="hidden lg:flex fixed left-4 top-1/2 -translate-y-1/2 z-40 w-[88px] flex-col items-center">
      {/* Connecting line between nodes */}
      <div className="absolute left-1/2 -translate-x-1/2 top-4 bottom-4 w-0.5 bg-[var(--border)]" />

      {/* Progress fill on the line */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 top-4 w-0.5 bg-[var(--accent)]/50"
        animate={{
          height: `${(activeIndex / (levels.length - 1)) * 100}%`,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 30 }}
      />

      {/* Animated Avatar */}
      <motion.div
        className="absolute left-1/2 z-10"
        style={{ marginLeft: "-24px" }} // Half of avatar width to center
        animate={
          prefersReducedMotion
            ? {}
            : {
                top: `${activeIndex * 48 + 4}px`,
              }
        }
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
      >
        <GameAvatar
          isMoving={isMoving}
          direction={direction}
        />
      </motion.div>

      {/* Nodes */}
      <div className="flex flex-col gap-6 relative z-20">
        {levels.map((level, index) => (
          <button
            key={level.id}
            onClick={() => onLevelClick(level.id)}
            onMouseEnter={onHover}
            className="group relative flex items-center justify-center w-8 h-8"
            title={level.label}
          >
            <LevelNode
              levelId={level.id}
              isActive={activeLevel === level.id}
              isVisited={index <= activeIndex}
            />

            {/* Tooltip */}
            <span className="absolute left-full ml-3 px-2 py-1 bg-[var(--panel)] border border-[var(--border)] text-xs text-[var(--muted)] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pixel-corners-sm pointer-events-none">
              {level.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function MobileTracker({
  activeLevel,
  onLevelClick,
  onHover,
}: TrackerProps) {
  const activeLabel = levels.find((l) => l.id === activeLevel)?.label || "";
  const activeIndex = levels.findIndex((l) => l.id === activeLevel);

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--panel)]/95 backdrop-blur-sm border-t border-[var(--border)]">
      {/* Active label with avatar */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full py-1">
        <motion.div
          className="flex items-center gap-2 px-3 py-1 bg-[var(--panel)] border border-[var(--border)] pixel-corners-sm"
          layout
        >
          <Image
            src="/pixel/avatar.png"
            alt="Avatar"
            width={16}
            height={16}
            className="pixel-render"
          />
          <span className="text-xs text-[var(--accent)] font-[family-name:var(--font-pixelify-sans)]">
            {activeLabel}
          </span>
        </motion.div>
      </div>

      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-[var(--border)]">
        <motion.div
          className="h-full bg-[var(--accent)]"
          animate={{
            width: `${((activeIndex + 1) / levels.length) * 100}%`,
          }}
          transition={{ type: "spring", stiffness: 200, damping: 30 }}
        />
      </div>

      {/* Nodes */}
      <div className="flex items-center justify-center gap-4 h-14 px-4">
        {levels.map((level, index) => (
          <button
            key={level.id}
            onClick={() => onLevelClick(level.id)}
            onTouchStart={onHover}
            className="flex items-center justify-center w-8 h-8"
            aria-label={level.label}
          >
            <LevelNode
              levelId={level.id}
              isActive={activeLevel === level.id}
              isVisited={index <= activeIndex}
              size="small"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

function LevelNode({
  levelId,
  isActive,
  isVisited,
  size = "default",
}: {
  levelId: LevelId;
  isActive: boolean;
  isVisited: boolean;
  size?: "default" | "small";
}) {
  const [hasImage, setHasImage] = useState(true);
  const iconSize = size === "small" ? 14 : 16;

  if (!hasImage) {
    return (
      <motion.div
        className={`rounded-full transition-colors ${
          size === "small" ? "w-3 h-3" : "w-4 h-4"
        } ${
          isActive
            ? "bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]"
            : isVisited
            ? "bg-[var(--accent)]/50"
            : "bg-[var(--muted)]/30"
        }`}
        whileHover={{ scale: 1.2 }}
      />
    );
  }

  return (
    <motion.div
      className="relative"
      whileHover={{ scale: 1.15 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Image
        src={`/pixel/icon-${levelId}.png`}
        alt={levelId}
        width={iconSize}
        height={iconSize}
        className={`pixel-render transition-all ${
          isActive
            ? "opacity-100 brightness-125"
            : isVisited
            ? "opacity-80"
            : "opacity-40 grayscale"
        }`}
        onError={() => setHasImage(false)}
      />
      {isActive && (
        <motion.div
          className="absolute inset-0 bg-[var(--accent)] blur-md -z-10"
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
}
