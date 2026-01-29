"use client";

import { useEffect } from "react";
import { useSky } from "@/contexts/SkyContext";

/**
 * SkyTheme applies dynamic CSS variables based on time of day.
 * It smoothly transitions colors as the sky phase changes.
 */
export function SkyTheme() {
  const { palette, phase } = useSky();

  useEffect(() => {
    const root = document.documentElement;

    // Apply all palette colors as CSS variables
    root.style.setProperty("--bg", palette.bg);
    root.style.setProperty("--bg-gradient", palette.bgGradient);
    root.style.setProperty("--panel", palette.panel);
    root.style.setProperty("--text", palette.text);
    root.style.setProperty("--muted", palette.muted);
    root.style.setProperty("--accent", palette.accent);
    root.style.setProperty("--accent2", palette.accent2);
    root.style.setProperty("--stars-opacity", String(palette.starsOpacity));
    root.style.setProperty("--cloud-tint", palette.cloudTint);
    root.style.setProperty("--glow-color", palette.glowColor);
    root.style.setProperty("--sun-moon-opacity", String(palette.sunMoonOpacity));

    // Also update panel2 to be slightly lighter than panel
    const panelRgb = hexToRgb(palette.panel);
    if (panelRgb) {
      const panel2 = `rgb(${Math.min(255, panelRgb.r + 15)}, ${Math.min(255, panelRgb.g + 15)}, ${Math.min(255, panelRgb.b + 15)})`;
      root.style.setProperty("--panel2", panel2);
    }

    // Update border colors based on accent
    const accentRgb = hexToRgb(palette.accent);
    if (accentRgb) {
      root.style.setProperty("--border", `rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, 0.25)`);
      root.style.setProperty("--border-active", `rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, 0.45)`);
    }

    // Add phase as data attribute for potential CSS targeting
    root.setAttribute("data-sky-phase", phase);

  }, [palette, phase]);

  return null;
}

// Helper to convert hex to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}
