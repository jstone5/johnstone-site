"use client";

import { type ReactNode } from "react";
import { SoundProvider } from "@/contexts/SoundContext";
import { AchievementProvider } from "@/contexts/AchievementContext";
import { XPProvider } from "@/contexts/XPContext";
import { SkyProvider } from "@/contexts/SkyContext";
import { AchievementToast } from "./AchievementToast";
import { LevelUpOverlay } from "./LevelUpOverlay";
import { EasterEggs } from "./EasterEggs";
import { XPBar } from "./XPBar";
import { SkyTheme } from "./SkyTheme";
import { SkyDebug } from "./SkyDebug";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SkyProvider>
      <SkyTheme />
      <SkyDebug />
      <SoundProvider>
        <AchievementProvider>
          <XPProvider>
            {children}
            <AchievementToast />
            <LevelUpOverlay />
            <EasterEggs />
            <XPBar />
          </XPProvider>
        </AchievementProvider>
      </SoundProvider>
    </SkyProvider>
  );
}
