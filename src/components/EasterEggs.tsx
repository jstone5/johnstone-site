"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useSound } from "@/contexts/SoundContext";
import { useXP, XP_REWARDS } from "@/contexts/XPContext";
import { useAchievements } from "@/contexts/AchievementContext";

// Konami code sequence
const KONAMI_CODE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

interface Secret {
  id: string;
  name: string;
  description: string;
  xp: number;
}

const SECRETS: Secret[] = [
  { id: "konami", name: "Konami Code", description: "You know the code!", xp: XP_REWARDS.konamiCode },
  { id: "click_logo", name: "Logo Clicker", description: "Clicked the logo 10 times", xp: XP_REWARDS.findSecret },
  { id: "night_visitor", name: "Night Owl", description: "Visited after midnight", xp: XP_REWARDS.findSecret },
  { id: "speed_reader", name: "Speed Reader", description: "Scrolled through all sections in under 30 seconds", xp: XP_REWARDS.findSecret },
];

export function EasterEggs() {
  const [konamiProgress, setKonamiProgress] = useState(0);
  const [konamiActivated, setKonamiActivated] = useState(false);
  const [secretUnlocked, setSecretUnlocked] = useState<Secret | null>(null);
  const [unlockedSecrets, setUnlockedSecrets] = useState<Set<string>>(new Set());
  const { play, init } = useSound();
  const { addXP } = useXP();
  const { unlock } = useAchievements();
  const prefersReducedMotion = useReducedMotion();

  // Load unlocked secrets from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("johnstone-secrets");
    if (saved) {
      try {
        setUnlockedSecrets(new Set(JSON.parse(saved)));
      } catch {
        // Invalid data
      }
    }

    // Check for night visitor secret
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 5) {
      unlockSecret("night_visitor");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveSecret = useCallback((secretId: string) => {
    setUnlockedSecrets((prev) => {
      const next = new Set(prev);
      next.add(secretId);
      if (typeof window !== "undefined") {
        localStorage.setItem("johnstone-secrets", JSON.stringify([...next]));
      }
      return next;
    });
  }, []);

  const unlockSecret = useCallback((secretId: string) => {
    if (unlockedSecrets.has(secretId)) return;

    const secret = SECRETS.find((s) => s.id === secretId);
    if (!secret) return;

    init();
    play("achievement");
    addXP(secret.xp, secret.name);
    saveSecret(secretId);
    setSecretUnlocked(secret);

    // Also unlock the explorer achievement for finding secrets
    unlock("explorer");

    setTimeout(() => setSecretUnlocked(null), 3000);
  }, [unlockedSecrets, init, play, addXP, saveSecret, unlock]);

  // Konami code listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const expectedKey = KONAMI_CODE[konamiProgress];

      if (e.key === expectedKey || e.key.toLowerCase() === expectedKey) {
        const newProgress = konamiProgress + 1;
        setKonamiProgress(newProgress);

        if (newProgress === KONAMI_CODE.length) {
          // Konami code completed!
          setKonamiActivated(true);
          unlockSecret("konami");
          setKonamiProgress(0);

          // Reset after animation
          setTimeout(() => setKonamiActivated(false), 3000);
        }
      } else {
        setKonamiProgress(0);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [konamiProgress, unlockSecret]);

  return (
    <>
      {/* Logo click tracker */}
      <LogoClickTracker onSecret={() => unlockSecret("click_logo")} unlockedSecrets={unlockedSecrets} />

      {/* Speed reader tracker */}
      <SpeedReaderTracker onSecret={() => unlockSecret("speed_reader")} unlockedSecrets={unlockedSecrets} />

      {/* Konami code visual feedback */}
      <AnimatePresence>
        {konamiProgress > 0 && konamiProgress < KONAMI_CODE.length && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-20 right-4 z-50 bg-[var(--panel)] border border-[var(--border)] pixel-corners-sm px-3 py-1"
          >
            <div className="flex gap-1">
              {KONAMI_CODE.map((key, index) => (
                <span
                  key={index}
                  className={`text-xs ${
                    index < konamiProgress
                      ? "text-[var(--accent)]"
                      : "text-[var(--muted)]/30"
                  }`}
                >
                  {key === "ArrowUp"
                    ? "↑"
                    : key === "ArrowDown"
                    ? "↓"
                    : key === "ArrowLeft"
                    ? "←"
                    : key === "ArrowRight"
                    ? "→"
                    : key.toUpperCase()}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Konami code activated effect */}
      <AnimatePresence>
        {konamiActivated && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] pointer-events-none"
          >
            {/* Rainbow border effect */}
            <motion.div
              className="absolute inset-0 border-8"
              animate={prefersReducedMotion ? {} : {
                borderColor: [
                  "#ff0000",
                  "#ff8800",
                  "#ffff00",
                  "#00ff00",
                  "#0088ff",
                  "#8800ff",
                  "#ff0000",
                ],
              }}
              transition={{ duration: 1, repeat: 2 }}
            />

            {/* Center text */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-[var(--panel)] border-4 border-[var(--accent)] pixel-corners px-8 py-4 text-center">
                <p className="font-[family-name:var(--font-pixelify-sans)] text-2xl text-[var(--accent)]">
                  ↑↑↓↓←→←→BA
                </p>
                <p className="text-[var(--accent2)] mt-2">SECRET UNLOCKED!</p>
              </div>
            </motion.div>

            {/* Confetti particles */}
            {!prefersReducedMotion && (
              <div className="absolute inset-0 overflow-hidden">
                {Array.from({ length: 50 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-3 h-3"
                    style={{
                      left: `${(i * 17) % 100}%`,
                      backgroundColor: `hsl(${(i * 37) % 360}, 80%, 60%)`,
                    }}
                    initial={{ top: "-10%", rotate: 0 }}
                    animate={{
                      top: "110%",
                      rotate: 360 * (i % 2 === 0 ? 1 : -1),
                      x: Math.sin(i) * 100,
                    }}
                    transition={{
                      duration: 2 + (i % 10) * 0.1,
                      ease: "easeIn",
                    }}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Secret unlocked notification */}
      <AnimatePresence>
        {secretUnlocked && !konamiActivated && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="bg-[var(--panel)] border-2 border-[var(--accent2)] pixel-corners px-6 py-3 text-center">
              <p className="text-[var(--accent2)] font-[family-name:var(--font-pixelify-sans)] text-sm">
                ★ SECRET FOUND ★
              </p>
              <p className="text-[var(--text)] font-[family-name:var(--font-pixelify-sans)] mt-1">
                {secretUnlocked.name}
              </p>
              <p className="text-xs text-[var(--muted)] mt-1">
                +{secretUnlocked.xp} XP
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Track logo clicks
function LogoClickTracker({
  onSecret,
  unlockedSecrets,
}: {
  onSecret: () => void;
  unlockedSecrets: Set<string>;
}) {
  const clickCount = useRef(0);
  const lastClickTime = useRef(0);

  useEffect(() => {
    if (unlockedSecrets.has("click_logo")) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check if clicked on nav logo (the site name link)
      if (target.closest('nav a[href="/"]')) {
        const now = Date.now();
        // Reset if more than 2 seconds since last click
        if (now - lastClickTime.current > 2000) {
          clickCount.current = 0;
        }
        clickCount.current++;
        lastClickTime.current = now;

        if (clickCount.current >= 10) {
          onSecret();
          clickCount.current = 0;
        }
      }
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [onSecret, unlockedSecrets]);

  return null;
}

// Track speed reading
function SpeedReaderTracker({
  onSecret,
  unlockedSecrets,
}: {
  onSecret: () => void;
  unlockedSecrets: Set<string>;
}) {
  const startTime = useRef<number | null>(null);
  const sectionsVisited = useRef(new Set<string>());

  useEffect(() => {
    if (unlockedSecrets.has("speed_reader")) return;

    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (!hash) return;

      // Start timer on first section visit
      if (startTime.current === null) {
        startTime.current = Date.now();
      }

      sectionsVisited.current.add(hash);

      // Check if all 6 sections visited in under 30 seconds
      if (sectionsVisited.current.size >= 6) {
        const elapsed = Date.now() - startTime.current;
        if (elapsed < 30000) {
          onSecret();
        }
      }
    };

    // Also listen to custom level change events
    const handleLevelChange = (e: CustomEvent) => {
      if (startTime.current === null) {
        startTime.current = Date.now();
      }
      sectionsVisited.current.add(e.detail.level);

      if (sectionsVisited.current.size >= 6) {
        const elapsed = Date.now() - startTime.current;
        if (elapsed < 30000) {
          onSecret();
        }
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    window.addEventListener("levelchange", handleLevelChange as EventListener);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("levelchange", handleLevelChange as EventListener);
    };
  }, [onSecret, unlockedSecrets]);

  return null;
}
