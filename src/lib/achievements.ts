// Achievement System
export type AchievementId =
  | "first_steps"
  | "explorer"
  | "reader"
  | "deep_dive"
  | "completionist"
  | "secret_keys"
  | "sound_on"
  | "night_owl"
  | "book_climber";

export interface Achievement {
  id: AchievementId;
  title: string;
  description: string;
  icon: string; // Emoji for simplicity
  secret?: boolean;
}

export const achievements: Achievement[] = [
  {
    id: "first_steps",
    title: "First Steps",
    description: "Scroll past the spawn level",
    icon: "👟",
  },
  {
    id: "explorer",
    title: "Explorer",
    description: "Visit all 6 levels",
    icon: "🗺️",
  },
  {
    id: "reader",
    title: "Reader",
    description: "Visit the writing archive",
    icon: "📚",
  },
  {
    id: "deep_dive",
    title: "Deep Dive",
    description: "Read a full post",
    icon: "🤿",
  },
  {
    id: "completionist",
    title: "Completionist",
    description: "Visit all writing posts",
    icon: "🏆",
  },
  {
    id: "secret_keys",
    title: "Secret Keys",
    description: "Use keyboard navigation",
    icon: "⌨️",
    secret: true,
  },
  {
    id: "sound_on",
    title: "Sound On",
    description: "Enable sound effects",
    icon: "🔊",
    secret: true,
  },
  {
    id: "night_owl",
    title: "Night Owl",
    description: "Visit between midnight and 5am",
    icon: "🦉",
    secret: true,
  },
  {
    id: "book_climber",
    title: "Book Climber",
    description: "Complete the reading journey",
    icon: "📚",
  },
];

export function getAchievement(id: AchievementId): Achievement | undefined {
  return achievements.find((a) => a.id === id);
}

// Storage key
const STORAGE_KEY = "johnstone_achievements";

export function loadAchievements(): Set<AchievementId> {
  if (typeof window === "undefined") return new Set();

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return new Set(JSON.parse(stored) as AchievementId[]);
    }
  } catch {
    // Ignore parse errors
  }
  return new Set();
}

export function saveAchievements(unlocked: Set<AchievementId>): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(unlocked)));
  } catch {
    // Ignore storage errors
  }
}

// Track visited levels
const VISITED_LEVELS_KEY = "johnstone_visited_levels";

export function loadVisitedLevels(): Set<string> {
  if (typeof window === "undefined") return new Set();

  try {
    const stored = localStorage.getItem(VISITED_LEVELS_KEY);
    if (stored) {
      return new Set(JSON.parse(stored) as string[]);
    }
  } catch {
    // Ignore parse errors
  }
  return new Set();
}

export function saveVisitedLevels(visited: Set<string>): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(VISITED_LEVELS_KEY, JSON.stringify(Array.from(visited)));
  } catch {
    // Ignore storage errors
  }
}

// Track visited posts
const VISITED_POSTS_KEY = "johnstone_visited_posts";

export function loadVisitedPosts(): Set<string> {
  if (typeof window === "undefined") return new Set();

  try {
    const stored = localStorage.getItem(VISITED_POSTS_KEY);
    if (stored) {
      return new Set(JSON.parse(stored) as string[]);
    }
  } catch {
    // Ignore parse errors
  }
  return new Set();
}

export function saveVisitedPosts(visited: Set<string>): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(VISITED_POSTS_KEY, JSON.stringify(Array.from(visited)));
  } catch {
    // Ignore storage errors
  }
}
