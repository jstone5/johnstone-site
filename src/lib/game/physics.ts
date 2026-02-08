// Physics constants and helpers for Book Platformer

export const PHYSICS = {
  GRAVITY: 0.6,
  JUMP_FORCE: -13,
  MOVE_SPEED: 5,
  MAX_FALL_SPEED: 15,
  FRICTION: 0.8,
} as const;

export const GAME_CONFIG = {
  WORLD_WIDTH: 5500,
  GAME_HEIGHT: 600,
  GROUND_Y_PERCENT: 0.85,
  PLAYER_WIDTH: 32,
  PLAYER_HEIGHT: 48,
  BOOK_WIDTH: 80,
  BOOK_HEIGHT: 100,
  BOOK_SPACING_MIN: 80,
  BOOK_SPACING_MAX: 160,
  FLAGPOLE_X_OFFSET: 200,
  CAMERA_LEAD: 300,
  CAMERA_DEAD_ZONE: 100,
} as const;

// Color palette from existing site
export const COLORS = {
  ground1: "#2A9D8F",
  ground2: "#1A535C",
  groundDark: "#134E4A",
  building1: "#334155",
  building2: "#475569",
  buildingDark: "#1E293B",
  window: "#FBBF24",
  windowGlow: "#F59E0B",
  accent1: "#4ECDC4",
  accent2: "#6EE7E7",
  purple1: "#A855F7",
  purple2: "#C084FC",
  char1: "#4ECDC4",
  char2: "#6EE7E7",
  charDark: "#2A9D8F",
  starWhite: "#F8FAFC",
  starYellow: "#FBBF24",
  // Character colors
  hair: "#5D4E37",
  hairLight: "#6B5B45",
  face: "#FFD5B8",
  eyes: "#2D3748",
  eyeHighlight: "#FFFFFF",
  blush: "#FFB6C1",
  smile: "#E8A088",
  neck: "#F5C9A8",
  belt: "#8B7355",
  beltBuckle: "#D4AF37",
  pants: "#4A5568",
  boots: "#5D4E37",
  bootsLight: "#6B5B45",
} as const;

// Book colors for fallback display
export const BOOK_COLORS = [
  "#E74C3C", // Red
  "#3498DB", // Blue
  "#2ECC71", // Green
  "#F39C12", // Orange
  "#9B59B6", // Purple
  "#1ABC9C", // Teal
  "#E91E63", // Pink
  "#00BCD4", // Cyan
  "#FF5722", // Deep Orange
  "#795548", // Brown
] as const;

export function getGroundY(gameHeight: number): number {
  return gameHeight * GAME_CONFIG.GROUND_Y_PERCENT;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}
