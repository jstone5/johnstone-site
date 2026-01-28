"use client";

import { useState, useEffect, useRef, type ComponentType } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { levels, type LevelId } from "@/content/site";
import { useIsClient } from "@/lib/hooks";
import { useSound } from "@/contexts/SoundContext";
import { useXP, XP_REWARDS } from "@/contexts/XPContext";
import {
  SpawnIcon,
  KnowledgeIcon,
  QuestIcon,
  ArchiveIcon,
  TreasureIcon,
  MessageIcon,
} from "@/components/pixel-art";

// Icon component type
type IconComponent = ComponentType<{ size?: number; className?: string; animated?: boolean }>;

// World map location metadata
const LOCATIONS: Record<LevelId, { name: string; Icon: IconComponent; description: string }> = {
  spawn: {
    name: "Spawn Point",
    Icon: SpawnIcon,
    description: "Where every journey begins",
  },
  about: {
    name: "Knowledge Tower",
    Icon: KnowledgeIcon,
    description: "Learn about the adventurer",
  },
  work: {
    name: "Quest Board",
    Icon: QuestIcon,
    description: "View completed quests",
  },
  writing: {
    name: "Archive Library",
    Icon: ArchiveIcon,
    description: "Collected writings and thoughts",
  },
  links: {
    name: "Treasure Vault",
    Icon: TreasureIcon,
    description: "Curated resources",
  },
  subscribe: {
    name: "Message Tower",
    Icon: MessageIcon,
    description: "Stay connected",
  },
};

// LocalStorage key for persisting granted XP
const XP_GRANTED_KEY = "johnstone-xp-granted-levels";

interface WorldMapProps {
  activeLevel: LevelId;
  onLevelClick: (levelId: LevelId) => void;
  visitedLevels: Set<LevelId>;
}

export function WorldMap({ activeLevel, onLevelClick, visitedLevels }: WorldMapProps) {
  const isClient = useIsClient();
  const prefersReducedMotion = useReducedMotion();
  const [prevLevel, setPrevLevel] = useState<LevelId>(activeLevel);
  const [isMoving, setIsMoving] = useState(false);
  const { play, init } = useSound();
  const { addXP } = useXP();
  const isFirstRender = useRef(true);
  const grantedXP = useRef<Set<LevelId>>(new Set());
  const lastLevelChangeTime = useRef(0);

  // Load persisted XP grants from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem(XP_GRANTED_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as LevelId[];
        grantedXP.current = new Set(parsed);
      } catch {
        // Invalid data, start fresh
      }
    }
  }, []);

  // Track level changes (scroll-based detection should be silent)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (activeLevel !== prevLevel) {
      const now = Date.now();
      // Throttle level changes - minimum 800ms between level transitions
      if (now - lastLevelChangeTime.current < 800) {
        return;
      }
      lastLevelChangeTime.current = now;
      setPrevLevel(activeLevel);

      setIsMoving(true);
      // NOTE: Don't play sounds here - scroll-triggered level changes should be silent
      // The menuSelect sound plays on intentional clicks via handleLocationClick

      // Grant XP for visiting new levels (persisted)
      if (!grantedXP.current.has(activeLevel)) {
        grantedXP.current.add(activeLevel);
        if (typeof window !== "undefined") {
          localStorage.setItem(XP_GRANTED_KEY, JSON.stringify([...grantedXP.current]));
        }
        addXP(XP_REWARDS.visitLevel, `Visited ${LOCATIONS[activeLevel].name}`);
      }

      const timeout = setTimeout(() => setIsMoving(false), 500);
      return () => clearTimeout(timeout);
    }
  }, [activeLevel, prevLevel, addXP]);

  const handleLocationClick = (levelId: LevelId) => {
    init();
    play("menuSelect");
    onLevelClick(levelId);
  };

  const handleHover = () => {
    play("menuMove");
  };

  if (!isClient) return null;

  return (
    <>
      {/* Desktop World Map */}
      <DesktopWorldMap
        activeLevel={activeLevel}
        visitedLevels={visitedLevels}
        onLocationClick={handleLocationClick}
        onHover={handleHover}
        isMoving={isMoving}
        prefersReducedMotion={prefersReducedMotion}
      />

      {/* Mobile World Map */}
      <MobileWorldMap
        activeLevel={activeLevel}
        visitedLevels={visitedLevels}
        onLocationClick={handleLocationClick}
        onHover={handleHover}
        prefersReducedMotion={prefersReducedMotion}
      />
    </>
  );
}

interface MapProps {
  activeLevel: LevelId;
  visitedLevels: Set<LevelId>;
  onLocationClick: (levelId: LevelId) => void;
  onHover: () => void;
  isMoving?: boolean;
  prefersReducedMotion: boolean | null;
}

function DesktopWorldMap({
  activeLevel,
  visitedLevels,
  onLocationClick,
  onHover,
  isMoving,
  prefersReducedMotion,
}: MapProps) {
  const [hoveredLevel, setHoveredLevel] = useState<LevelId | null>(null);

  return (
    <div className="hidden lg:block fixed left-0 top-0 bottom-0 w-48 z-40 bg-[var(--panel)]/80 backdrop-blur-sm border-r border-[var(--border)]">
      {/* Map header */}
      <div className="p-4 border-b border-[var(--border)]">
        <h2 className="font-[family-name:var(--font-pixelify-sans)] text-[var(--accent)] text-sm tracking-wider">
          WORLD MAP
        </h2>
        <p className="text-xs text-[var(--muted)] mt-1">
          {visitedLevels.size} / {levels.length} discovered
        </p>
      </div>

      {/* Map content */}
      <div className="relative p-4 h-[calc(100%-80px)] flex flex-col justify-center">
        {/* Locations */}
        <div className="relative flex flex-col gap-8">
          {levels.map((level, index) => {
            const location = LOCATIONS[level.id];
            const isActive = activeLevel === level.id;
            const isVisited = visitedLevels.has(level.id);

            return (
              <motion.button
                key={level.id}
                onClick={() => onLocationClick(level.id)}
                onMouseEnter={() => {
                  setHoveredLevel(level.id);
                  onHover();
                }}
                onMouseLeave={() => setHoveredLevel(null)}
                className={`
                  relative flex items-center gap-3 p-2 rounded transition-colors text-left
                  ${isActive ? "bg-[var(--accent)]/10" : "hover:bg-[var(--panel)]"}
                `}
                whileHover={prefersReducedMotion ? {} : { x: 4 }}
                animate={isActive && isMoving ? { scale: [1, 1.05, 1] } : {}}
              >
                {/* Location icon */}
                <motion.div
                  className={`
                    relative w-12 h-12 flex items-center justify-center rounded-lg border-2
                    ${isActive
                      ? "border-[var(--accent)] bg-[var(--accent)]/10"
                      : isVisited
                      ? "border-[var(--accent)]/50 bg-[var(--panel)]"
                      : "border-[var(--border)] bg-[var(--panel)] grayscale opacity-50"
                    }
                  `}
                  animate={isActive && !prefersReducedMotion ? {
                    boxShadow: ["0 0 0 0 var(--accent)", "0 0 20px 4px var(--accent)", "0 0 0 0 var(--accent)"],
                  } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <location.Icon size={32} animated={isActive} />

                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      className="absolute -top-1 -right-1 w-3 h-3 bg-[var(--accent2)] rounded-full"
                      animate={prefersReducedMotion ? {} : { scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  )}
                </motion.div>

                {/* Location info */}
                <div className="flex-1 min-w-0">
                  <p className={`
                    font-[family-name:var(--font-pixelify-sans)] text-sm truncate
                    ${isActive ? "text-[var(--accent)]" : isVisited ? "text-[var(--text)]" : "text-[var(--muted)]"}
                  `}>
                    {location.name}
                  </p>
                  <p className="text-xs text-[var(--muted)] truncate">
                    {isVisited ? location.description : "???"}
                  </p>
                </div>

                {/* Progress indicator */}
                <span className="text-xs text-[var(--muted)] opacity-60">
                  {index + 1}/{levels.length}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Tooltip for hovered location */}
        <AnimatePresence>
          {hoveredLevel && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="fixed left-52 top-1/2 -translate-y-1/2 bg-[var(--panel)] border border-[var(--border)] pixel-corners p-3 pointer-events-none z-50"
            >
              <p className="font-[family-name:var(--font-pixelify-sans)] text-[var(--accent)]">
                {LOCATIONS[hoveredLevel].name}
              </p>
              <p className="text-sm text-[var(--muted)]">
                {visitedLevels.has(hoveredLevel)
                  ? LOCATIONS[hoveredLevel].description
                  : "Not yet discovered..."}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function MobileWorldMap({
  activeLevel,
  visitedLevels,
  onLocationClick,
  onHover,
  prefersReducedMotion,
}: MapProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const activeLocation = LOCATIONS[activeLevel];
  const activeIndex = levels.findIndex((l) => l.id === activeLevel);

  return (
    <div className="lg:hidden fixed bottom-12 left-0 right-0 z-40">
      {/* Expanded map overlay */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-full left-0 right-0 mb-2 mx-4 bg-[var(--panel)]/95 backdrop-blur-sm border border-[var(--border)] pixel-corners p-4"
          >
            <div className="grid grid-cols-3 gap-3">
              {levels.map((level) => {
                const location = LOCATIONS[level.id];
                const isActive = activeLevel === level.id;
                const isVisited = visitedLevels.has(level.id);

                return (
                  <button
                    key={level.id}
                    onClick={() => {
                      onLocationClick(level.id);
                      setIsExpanded(false);
                    }}
                    onTouchStart={onHover}
                    className={`
                      p-3 rounded-lg border text-center transition-colors
                      ${isActive
                        ? "border-[var(--accent)] bg-[var(--accent)]/10"
                        : isVisited
                        ? "border-[var(--border)] bg-[var(--panel)]"
                        : "border-[var(--border)] bg-[var(--panel)] opacity-50"
                      }
                    `}
                  >
                    <div className="flex justify-center">
                      <location.Icon size={28} animated={isActive} />
                    </div>
                    <p className={`
                      text-xs mt-1 font-[family-name:var(--font-pixelify-sans)]
                      ${isActive ? "text-[var(--accent)]" : "text-[var(--muted)]"}
                    `}>
                      {isVisited ? location.name.split(" ")[0] : "???"}
                    </p>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsed bar */}
      <div className="mx-4 bg-[var(--panel)]/95 backdrop-blur-sm border border-[var(--border)] pixel-corners">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center gap-3 p-3"
        >
          <motion.div
            className="w-12 h-12 flex items-center justify-center bg-[var(--accent)]/10 border border-[var(--accent)] rounded-lg"
            animate={prefersReducedMotion ? {} : { scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <activeLocation.Icon size={32} animated />
          </motion.div>

          <div className="flex-1 text-left">
            <p className="font-[family-name:var(--font-pixelify-sans)] text-[var(--accent)] text-sm">
              {activeLocation.name}
            </p>
            <p className="text-xs text-[var(--muted)]">
              {visitedLevels.size}/{levels.length} discovered
            </p>
          </div>

          {/* Progress dots */}
          <div className="flex gap-1">
            {levels.map((level, index) => (
              <motion.div
                key={level.id}
                className={`w-2 h-2 rounded-full ${
                  index <= activeIndex
                    ? "bg-[var(--accent)]"
                    : "bg-[var(--border)]"
                }`}
                animate={level.id === activeLevel && !prefersReducedMotion ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 1, repeat: Infinity }}
              />
            ))}
          </div>

          {/* Expand indicator */}
          <motion.span
            className="text-[var(--muted)]"
            animate={{ rotate: isExpanded ? 180 : 0 }}
          >
            ▲
          </motion.span>
        </button>
      </div>
    </div>
  );
}

