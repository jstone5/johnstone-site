"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { soundManager } from "@/lib/sounds";

type SoundType = 'menuMove' | 'menuSelect' | 'levelEnter' | 'achievement' | 'typing' | 'xpGain';

interface SoundContextType {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
  toggle: () => void;
  play: (sound: SoundType) => void;
  init: () => void;
}

const SoundContext = createContext<SoundContextType | null>(null);

export function SoundProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabledState] = useState(true);

  // Sync with localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('johnstone_sound_enabled');
    if (saved !== null) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEnabledState(saved !== 'false');
    }
  }, []);

  const setEnabled = useCallback((value: boolean) => {
    setEnabledState(value);
    soundManager.setEnabled(value);
  }, []);

  const toggle = useCallback(() => {
    setEnabled(!enabled);
  }, [enabled, setEnabled]);

  const play = useCallback((sound: SoundType) => {
    soundManager.play(sound);
  }, []);

  const init = useCallback(() => {
    soundManager.init();
  }, []);

  return (
    <SoundContext.Provider value={{ enabled, setEnabled, toggle, play, init }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error("useSound must be used within a SoundProvider");
  }
  return context;
}
