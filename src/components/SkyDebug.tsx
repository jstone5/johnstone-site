"use client";

import { useState, useEffect } from "react";
import { useSky, type SkyPhase } from "@/contexts/SkyContext";

const PHASES: SkyPhase[] = ["night", "dawn", "sunrise", "morning", "midday", "afternoon", "sunset", "dusk"];

/**
 * Debug component to show current sky state.
 * Only visible in development mode.
 * Press Ctrl+D to toggle visibility.
 *
 * Test different phases by adding ?sky=sunrise (or any phase name) to URL.
 * Or use ?sky=14:30 to test a specific time.
 */
export function SkyDebug() {
  const [isVisible, setIsVisible] = useState(false);
  const { phase, phaseName, sunPosition, isDay, palette } = useSky();

  // Toggle with keyboard - must be called unconditionally
  useEffect(() => {
    // Only enable in development
    if (process.env.NODE_ENV !== "development") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "d" && e.ctrlKey) {
        e.preventDefault();
        setIsVisible((v) => !v);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Only render in development
  if (process.env.NODE_ENV !== "development") return null;

  // Navigate to different phase
  const goToPhase = (newPhase: SkyPhase) => {
    const url = new URL(window.location.href);
    url.searchParams.set("sky", newPhase);
    window.location.href = url.toString();
  };

  if (!isVisible) return null;

  const currentIndex = PHASES.indexOf(phase);

  return (
    <div
      className="fixed bottom-20 right-4 z-[9999] bg-black/90 text-white text-xs p-3 rounded-lg font-mono border border-white/20"
      style={{ maxWidth: 220 }}
    >
      <div className="font-bold mb-2 text-[var(--accent)]">☀️ Sky Debug</div>
      <div className="text-gray-500 text-[10px] mb-2">Ctrl+D to toggle</div>

      <div className="space-y-1">
        <div><span className="text-gray-400">Phase:</span> {phaseName}</div>
        <div><span className="text-gray-400">Sun:</span> {(sunPosition * 100).toFixed(1)}%</div>
        <div><span className="text-gray-400">Day:</span> {isDay ? "☀️ Yes" : "🌙 No"}</div>
        <div><span className="text-gray-400">Stars:</span> {(palette.starsOpacity * 100).toFixed(0)}%</div>
      </div>

      {/* Color swatches */}
      <div className="mt-2 flex gap-1">
        <div className="w-5 h-5 rounded border border-white/20" style={{ background: palette.bg }} title="bg" />
        <div className="w-5 h-5 rounded border border-white/20" style={{ background: palette.bgGradient }} title="gradient" />
        <div className="w-5 h-5 rounded border border-white/20" style={{ background: palette.accent }} title="accent" />
        <div className="w-5 h-5 rounded border border-white/20" style={{ background: palette.cloudTint }} title="clouds" />
      </div>

      {/* Phase navigation */}
      <div className="mt-3 pt-2 border-t border-white/20">
        <div className="text-gray-400 mb-1">Test phases:</div>
        <div className="flex gap-1">
          <button
            onClick={() => goToPhase(PHASES[(currentIndex - 1 + PHASES.length) % PHASES.length])}
            className="px-2 py-1 bg-white/10 rounded hover:bg-white/20"
          >
            ◀
          </button>
          <button
            onClick={() => goToPhase(PHASES[(currentIndex + 1) % PHASES.length])}
            className="px-2 py-1 bg-white/10 rounded hover:bg-white/20"
          >
            ▶
          </button>
          <button
            onClick={() => {
              const url = new URL(window.location.href);
              url.searchParams.delete("sky");
              window.location.href = url.toString();
            }}
            className="px-2 py-1 bg-white/10 rounded hover:bg-white/20 ml-auto"
            title="Reset to real time"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
