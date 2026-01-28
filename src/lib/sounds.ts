// 8-bit Sound Generator using Web Audio API
// Generates authentic retro game sounds programmatically

type SoundType = 'menuMove' | 'menuSelect' | 'levelEnter' | 'achievement' | 'typing' | 'xpGain';

interface SoundConfig {
  frequency: number;
  duration: number;
  type: OscillatorType;
  volume: number;
  decay?: number;
  frequencyEnd?: number;
  delay?: number;
}

// Sound definitions - these create authentic 8-bit sounds
const soundConfigs: Record<SoundType, SoundConfig[]> = {
  menuMove: [
    { frequency: 440, duration: 0.05, type: 'square', volume: 0.15 },
  ],
  menuSelect: [
    { frequency: 520, duration: 0.08, type: 'square', volume: 0.2 },
    { frequency: 660, duration: 0.1, type: 'square', volume: 0.2, delay: 0.08 },
  ],
  levelEnter: [
    { frequency: 330, duration: 0.1, type: 'square', volume: 0.15 },
    { frequency: 440, duration: 0.1, type: 'square', volume: 0.15, delay: 0.1 },
    { frequency: 550, duration: 0.15, type: 'square', volume: 0.15, delay: 0.2 },
  ],
  achievement: [
    { frequency: 523, duration: 0.1, type: 'square', volume: 0.2 },
    { frequency: 659, duration: 0.1, type: 'square', volume: 0.2, delay: 0.1 },
    { frequency: 784, duration: 0.1, type: 'square', volume: 0.2, delay: 0.2 },
    { frequency: 1047, duration: 0.2, type: 'square', volume: 0.25, delay: 0.3 },
  ],
  typing: [
    { frequency: 800, duration: 0.02, type: 'square', volume: 0.08 },
  ],
  xpGain: [
    { frequency: 880, duration: 0.06, type: 'square', volume: 0.12 },
    { frequency: 1100, duration: 0.08, type: 'square', volume: 0.1, delay: 0.05 },
  ],
};

// Cooldown times for different sounds (in milliseconds)
// These prevent sounds from stacking/rapid-firing during scroll events
const SOUND_COOLDOWNS: Record<SoundType, number> = {
  menuMove: 100,      // Limit hover sounds
  menuSelect: 300,    // Prevent double-clicks from double-playing
  levelEnter: 1000,   // Significant cooldown - level transitions shouldn't rapid-fire
  achievement: 2000,  // Only one achievement sound every 2 seconds
  typing: 50,         // Allow rapid typing sounds
  xpGain: 500,        // Prevent XP sounds from stacking
};

class SoundManager {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;
  private initialized: boolean = false;
  private lastPlayTime: Record<SoundType, number> = {
    menuMove: 0,
    menuSelect: 0,
    levelEnter: 0,
    achievement: 0,
    typing: 0,
    xpGain: 0,
  };
  private lastAnySoundTime: number = 0; // Global cooldown for any sound
  private static readonly GLOBAL_COOLDOWN = 150; // Minimum ms between ANY sounds

  constructor() {
    // Check localStorage for saved preference
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('johnstone_sound_enabled');
      this.enabled = saved !== 'false';
    }
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;

    if (!this.audioContext) {
      try {
        this.audioContext = new (window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext)();
      } catch {
        console.warn('Web Audio API not supported');
        return null;
      }
    }
    return this.audioContext;
  }

  async init(): Promise<void> {
    if (this.initialized) return;

    const ctx = this.getContext();
    if (ctx && ctx.state === 'suspended') {
      await ctx.resume();
    }
    this.initialized = true;
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem('johnstone_sound_enabled', String(enabled));
    }
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  private playTone(config: SoundConfig): void {
    const ctx = this.getContext();
    if (!ctx || !this.enabled) return;

    const startTime = ctx.currentTime + (config.delay || 0);

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = config.type;
    oscillator.frequency.setValueAtTime(config.frequency, startTime);

    if (config.frequencyEnd) {
      oscillator.frequency.linearRampToValueAtTime(config.frequencyEnd, startTime + config.duration);
    }

    gainNode.gain.setValueAtTime(config.volume, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + config.duration);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(startTime);
    oscillator.stop(startTime + config.duration + 0.01);
  }

  play(sound: SoundType): void {
    if (!this.enabled) return;

    const now = Date.now();

    // Global cooldown - prevent ANY sounds from playing too rapidly
    if (now - this.lastAnySoundTime < SoundManager.GLOBAL_COOLDOWN) {
      return;
    }

    // Per-sound cooldown - prevent rapid-fire of same sound type
    const cooldown = SOUND_COOLDOWNS[sound];
    if (now - this.lastPlayTime[sound] < cooldown) {
      return;
    }

    // Update both timestamps
    this.lastPlayTime[sound] = now;
    this.lastAnySoundTime = now;

    // Ensure context is initialized
    this.init();

    const configs = soundConfigs[sound];
    if (!configs) return;

    configs.forEach(config => this.playTone(config));
  }

  // Convenience methods
  menuMove(): void { this.play('menuMove'); }
  menuSelect(): void { this.play('menuSelect'); }
  levelEnter(): void { this.play('levelEnter'); }
  achievement(): void { this.play('achievement'); }
  typing(): void { this.play('typing'); }
}

// Singleton instance
export const soundManager = new SoundManager();

// React hook for sound access
export function useSounds() {
  return {
    play: (sound: SoundType) => soundManager.play(sound),
    menuMove: () => soundManager.menuMove(),
    menuSelect: () => soundManager.menuSelect(),
    levelEnter: () => soundManager.levelEnter(),
    achievement: () => soundManager.achievement(),
    typing: () => soundManager.typing(),
    setEnabled: (enabled: boolean) => soundManager.setEnabled(enabled),
    isEnabled: () => soundManager.isEnabled(),
    init: () => soundManager.init(),
  };
}
