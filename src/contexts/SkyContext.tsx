"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import SunCalc from "suncalc";

// Sky phases with their characteristics
export type SkyPhase =
  | "night"
  | "dawn"
  | "sunrise"
  | "morning"
  | "midday"
  | "afternoon"
  | "sunset"
  | "dusk";

// Color palette for each phase
export interface SkyPalette {
  bg: string;           // Main background (sky) color
  bgGradient: string;   // Secondary gradient color
  panel: string;        // Panel backgrounds
  text: string;         // Main text
  muted: string;        // Muted text
  accent: string;       // Primary accent
  accent2: string;      // Secondary accent (gold)
  starsOpacity: number; // How visible stars are (0-1)
  sunMoonOpacity: number; // Sun/moon visibility
  cloudTint: string;    // Cloud color tint
  glowColor: string;    // Glow effect color
}

// Phase-specific palettes - carefully crafted for each time of day
// Key principle: Keep dark panels with light text for readability,
// but vary the sky background and accent colors by time
const SKY_PALETTES: Record<SkyPhase, SkyPalette> = {
  night: {
    bg: "#070A0F",
    bgGradient: "#0C1220",
    panel: "#0C1220",
    text: "#E6EDF3",
    muted: "#9FB0C3",
    accent: "#6EE7FF",
    accent2: "#FDE047",
    starsOpacity: 1,
    sunMoonOpacity: 0.9,
    cloudTint: "#1a2744",
    glowColor: "rgba(110, 231, 255, 0.15)",
  },
  dawn: {
    bg: "#1a1a2e",
    bgGradient: "#3d2a4a",
    panel: "#16213e",
    text: "#E6EDF3",
    muted: "#B8A9C9",
    accent: "#FF9F9F",
    accent2: "#FFB347",
    starsOpacity: 0.3,
    sunMoonOpacity: 0.6,
    cloudTint: "#5a4a65",
    glowColor: "rgba(255, 159, 159, 0.15)",
  },
  sunrise: {
    bg: "#1f2a44",
    bgGradient: "#4a3a5a",
    panel: "#162035",
    text: "#F8F0E3",
    muted: "#C9B8D0",
    accent: "#FFB366",
    accent2: "#FF7A7A",
    starsOpacity: 0,
    sunMoonOpacity: 0.9,
    cloudTint: "#ffb088",
    glowColor: "rgba(255, 179, 102, 0.2)",
  },
  morning: {
    bg: "#1a3a4a",
    bgGradient: "#2a5a6a",
    panel: "#0f2a3a",
    text: "#E6EDF3",
    muted: "#9FC0D3",
    accent: "#5BC0DE",
    accent2: "#FFD93D",
    starsOpacity: 0,
    sunMoonOpacity: 0.85,
    cloudTint: "#e8f4f8",
    glowColor: "rgba(91, 192, 222, 0.15)",
  },
  midday: {
    bg: "#1a4a5a",
    bgGradient: "#2a6a7a",
    panel: "#0f3545",
    text: "#E6EDF3",
    muted: "#A0C8D8",
    accent: "#4DD4FF",
    accent2: "#FFD700",
    starsOpacity: 0,
    sunMoonOpacity: 0.8,
    cloudTint: "#ffffff",
    glowColor: "rgba(77, 212, 255, 0.15)",
  },
  afternoon: {
    bg: "#1a4555",
    bgGradient: "#2a5565",
    panel: "#0f3040",
    text: "#E6EDF3",
    muted: "#A8C4D0",
    accent: "#5AC8E8",
    accent2: "#FFAA33",
    starsOpacity: 0,
    sunMoonOpacity: 0.85,
    cloudTint: "#fff8f0",
    glowColor: "rgba(90, 200, 232, 0.15)",
  },
  sunset: {
    bg: "#1f2035",
    bgGradient: "#3a2a4a",
    panel: "#161828",
    text: "#F8F0E3",
    muted: "#D0B8A8",
    accent: "#FF8866",
    accent2: "#FFB84D",
    starsOpacity: 0.15,
    sunMoonOpacity: 1,
    cloudTint: "#ff9977",
    glowColor: "rgba(255, 136, 102, 0.2)",
  },
  dusk: {
    bg: "#141428",
    bgGradient: "#251a35",
    panel: "#10101f",
    text: "#E6EDF3",
    muted: "#B8A9C9",
    accent: "#A78BFA",
    accent2: "#F687B3",
    starsOpacity: 0.6,
    sunMoonOpacity: 0.7,
    cloudTint: "#4a3a5a",
    glowColor: "rgba(167, 139, 250, 0.15)",
  },
};

interface SkyContextValue {
  phase: SkyPhase;
  palette: SkyPalette;
  sunPosition: number; // 0-1, where 0.5 is noon
  isDay: boolean;
  phaseProgress: number; // 0-1 progress through current phase
  phaseName: string; // Human readable name
}

const SkyContext = createContext<SkyContextValue | null>(null);

// Estimate coordinates from timezone
function getEstimatedCoordinates(): { lat: number; lng: number } {
  try {
    // Get timezone offset in hours
    const offsetMinutes = new Date().getTimezoneOffset();
    const offsetHours = -offsetMinutes / 60; // Convert to hours, flip sign

    // Estimate longitude from timezone (15° per hour)
    const lng = offsetHours * 15;

    // Default latitude to ~40°N (covers most populated areas)
    // Could be refined based on locale if needed
    const lat = 40;

    return { lat, lng };
  } catch {
    // Fallback to UTC/Greenwich
    return { lat: 51.5, lng: 0 };
  }
}

// Determine sky phase from sun times
function getSkyPhase(
  now: Date,
  times: SunCalc.GetTimesResult
): { phase: SkyPhase; progress: number } {
  const time = now.getTime();

  // Helper to check if time is between two dates
  const isBetween = (start: Date, end: Date) =>
    time >= start.getTime() && time < end.getTime();

  // Calculate progress within a range (0-1)
  const getProgress = (start: Date, end: Date) => {
    const total = end.getTime() - start.getTime();
    const elapsed = time - start.getTime();
    return Math.max(0, Math.min(1, elapsed / total));
  };

  // Night (before dawn)
  if (time < times.nightEnd.getTime()) {
    return { phase: "night", progress: 0.5 };
  }

  // Dawn (nautical dawn to sunrise)
  if (isBetween(times.nightEnd, times.sunrise)) {
    return { phase: "dawn", progress: getProgress(times.nightEnd, times.sunrise) };
  }

  // Sunrise (sunrise to golden hour end)
  if (isBetween(times.sunrise, times.goldenHourEnd)) {
    return { phase: "sunrise", progress: getProgress(times.sunrise, times.goldenHourEnd) };
  }

  // Morning (golden hour end to solar noon)
  if (isBetween(times.goldenHourEnd, times.solarNoon)) {
    return { phase: "morning", progress: getProgress(times.goldenHourEnd, times.solarNoon) };
  }

  // Calculate afternoon boundary (2 hours after solar noon)
  const afternoonStart = new Date(times.solarNoon.getTime() + 2 * 60 * 60 * 1000);

  // Midday (solar noon to afternoon)
  if (isBetween(times.solarNoon, afternoonStart)) {
    return { phase: "midday", progress: getProgress(times.solarNoon, afternoonStart) };
  }

  // Afternoon (after midday to golden hour)
  if (isBetween(afternoonStart, times.goldenHour)) {
    return { phase: "afternoon", progress: getProgress(afternoonStart, times.goldenHour) };
  }

  // Sunset (golden hour to sunset)
  if (isBetween(times.goldenHour, times.sunset)) {
    return { phase: "sunset", progress: getProgress(times.goldenHour, times.sunset) };
  }

  // Dusk (sunset to night)
  if (isBetween(times.sunset, times.night)) {
    return { phase: "dusk", progress: getProgress(times.sunset, times.night) };
  }

  // Night (after dusk)
  return { phase: "night", progress: 0.5 };
}

// Calculate sun position (0 = midnight, 0.5 = noon, 1 = midnight)
function getSunPosition(now: Date, times: SunCalc.GetTimesResult): number {
  const sunrise = times.sunrise.getTime();
  const sunset = times.sunset.getTime();
  const time = now.getTime();

  if (time < sunrise) {
    // Before sunrise - calculate position in pre-dawn
    const midnight = new Date(now);
    midnight.setHours(0, 0, 0, 0);
    const progress = (time - midnight.getTime()) / (sunrise - midnight.getTime());
    return progress * 0.25; // 0 to 0.25
  }

  if (time <= sunset) {
    // During day - 0.25 to 0.75
    const dayProgress = (time - sunrise) / (sunset - sunrise);
    return 0.25 + dayProgress * 0.5;
  }

  // After sunset
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  const progress = (time - sunset) / (midnight.getTime() - sunset);
  return 0.75 + progress * 0.25;
}

const PHASE_NAMES: Record<SkyPhase, string> = {
  night: "Night",
  dawn: "Dawn",
  sunrise: "Sunrise",
  morning: "Morning",
  midday: "Midday",
  afternoon: "Afternoon",
  sunset: "Sunset",
  dusk: "Dusk",
};

// Parse time override from URL for testing (?sky=sunrise, ?sky=14:30, etc.)
function getTimeOverride(): Date | null {
  if (typeof window === "undefined") return null;

  const params = new URLSearchParams(window.location.search);
  const skyParam = params.get("sky");

  if (!skyParam) return null;

  const now = new Date();

  // Check if it's a phase name
  const phaseHours: Record<string, number> = {
    night: 2,
    dawn: 6,
    sunrise: 7,
    morning: 9,
    midday: 12,
    afternoon: 15,
    sunset: 18,
    dusk: 20,
  };

  if (phaseHours[skyParam.toLowerCase()]) {
    now.setHours(phaseHours[skyParam.toLowerCase()], 0, 0, 0);
    return now;
  }

  // Check if it's a time (HH:MM)
  const timeMatch = skyParam.match(/^(\d{1,2}):(\d{2})$/);
  if (timeMatch) {
    now.setHours(parseInt(timeMatch[1]), parseInt(timeMatch[2]), 0, 0);
    return now;
  }

  return null;
}

export function SkyProvider({ children }: { children: ReactNode }) {
  const [currentTime, setCurrentTime] = useState(() => getTimeOverride() || new Date());
  const [hasOverride] = useState(() => getTimeOverride() !== null);

  // Get estimated coordinates based on timezone
  const coords = useMemo(() => getEstimatedCoordinates(), []);

  // Calculate sun times for today
  const sunTimes = useMemo(() => {
    return SunCalc.getTimes(currentTime, coords.lat, coords.lng);
  }, [currentTime, coords]);

  // Determine current phase and progress
  const { phase, progress: phaseProgress } = useMemo(() => {
    return getSkyPhase(currentTime, sunTimes);
  }, [currentTime, sunTimes]);

  // Get sun position for sun/moon placement
  const sunPosition = useMemo(() => {
    return getSunPosition(currentTime, sunTimes);
  }, [currentTime, sunTimes]);

  // Update time every minute for smooth transitions (unless overridden)
  useEffect(() => {
    if (hasOverride) return; // Don't update if testing with override

    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [hasOverride]);

  const value = useMemo((): SkyContextValue => ({
    phase,
    palette: SKY_PALETTES[phase],
    sunPosition,
    isDay: phase === "morning" || phase === "midday" || phase === "afternoon",
    phaseProgress,
    phaseName: PHASE_NAMES[phase],
  }), [phase, sunPosition, phaseProgress]);

  return (
    <SkyContext.Provider value={value}>
      {children}
    </SkyContext.Provider>
  );
}

export function useSky() {
  const context = useContext(SkyContext);
  if (!context) {
    throw new Error("useSky must be used within SkyProvider");
  }
  return context;
}

// Export palettes for use in other components
export { SKY_PALETTES };
