"use client";

import { type ReactNode } from "react";
import { SoundProvider } from "@/contexts/SoundContext";
import { AchievementProvider } from "@/contexts/AchievementContext";
import { AchievementToast } from "./AchievementToast";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SoundProvider>
      <AchievementProvider>
        {children}
        <AchievementToast />
      </AchievementProvider>
    </SoundProvider>
  );
}
