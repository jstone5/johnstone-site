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
// Key principle: --bg is the SKY color (can be bright during day).
// --panel is always a dark surface for UI elements with light text.
// Accent colors harmonize with the sky mood.
const SKY_PALETTES: Record<SkyPhase, SkyPalette> = {
  night: {
    bg: "#080C14",
    bgGradient: "#0E1428",
    panel: "#0C1220",
    text: "#E6EDF3",
    muted: "#7A90A8",
    accent: "#6EE7FF",
    accent2: "#FDE047",
    starsOpacity: 1,
    sunMoonOpacity: 0.9,
    cloudTint: "#1a2744",
    glowColor: "rgba(110, 231, 255, 0.15)",
  },
  dawn: {
    bg: "#1A1035",
    bgGradient: "#2E1850",
    panel: "#140E28",
    text: "#E8E0F2",
    muted: "#A090B8",
    accent: "#E895B0",
    accent2: "#FFB060",
    starsOpacity: 0.25,
    sunMoonOpacity: 0.6,
    cloudTint: "#5a4070",
    glowColor: "rgba(232, 149, 176, 0.15)",
  },
  sunrise: {
    bg: "#3A2045",
    bgGradient: "#5A3058",
    panel: "#1E1430",
    text: "#F8F0E8",
    muted: "#C0A8B0",
    accent: "#FFB366",
    accent2: "#FF7A7A",
    starsOpacity: 0,
    sunMoonOpacity: 0.9,
    cloudTint: "#ffb088",
    glowColor: "rgba(255, 179, 102, 0.2)",
  },
  morning: {
    bg: "#1870A8",
    bgGradient: "#124A70",
    panel: "#0E2E42",
    text: "#E8F0F5",
    muted: "#88B0C8",
    accent: "#4CC9F0",
    accent2: "#FFD93D",
    starsOpacity: 0,
    sunMoonOpacity: 0.85,
    cloudTint: "#e0f0f8",
    glowColor: "rgba(76, 201, 240, 0.15)",
  },
  midday: {
    bg: "#1880B8",
    bgGradient: "#145878",
    panel: "#0C3048",
    text: "#EAF2F8",
    muted: "#90C0D8",
    accent: "#4DD4FF",
    accent2: "#FFD700",
    starsOpacity: 0,
    sunMoonOpacity: 0.8,
    cloudTint: "#ffffff",
    glowColor: "rgba(77, 212, 255, 0.15)",
  },
  afternoon: {
    bg: "#186898",
    bgGradient: "#124060",
    panel: "#0E2838",
    text: "#E8F0F0",
    muted: "#88B0C0",
    accent: "#3ABFE0",
    accent2: "#FFB833",
    starsOpacity: 0,
    sunMoonOpacity: 0.85,
    cloudTint: "#fff8f0",
    glowColor: "rgba(58, 191, 224, 0.15)",
  },
  sunset: {
    bg: "#3A1830",
    bgGradient: "#582540",
    panel: "#1A1018",
    text: "#F8F0E8",
    muted: "#C8A898",
    accent: "#FF7744",
    accent2: "#FFB84D",
    starsOpacity: 0.15,
    sunMoonOpacity: 1,
    cloudTint: "#ff9977",
    glowColor: "rgba(255, 119, 68, 0.2)",
  },
  dusk: {
    bg: "#141028",
    bgGradient: "#201540",
    panel: "#0E0C1E",
    text: "#E6E0F0",
    muted: "#A898C0",
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
