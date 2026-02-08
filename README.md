# johnstone-site

A personal portfolio site built as an interactive retro video game. Visitors scroll through a level-based journey, earn XP, unlock achievements, and explore a 2D Mario-style book platformer embedded in the hero section.

**Stack:** Next.js 16 / React 19 / TypeScript / Tailwind 4 / Framer Motion

## Quick Start

```bash
npm install
npm run dev        # http://localhost:3000
```

## Architecture Overview

The site is structured as a **scroll-driven "Level Journey"** where each major section (spawn, about, writing, links, subscribe) is a full-screen level. An XP system, achievement system, and real-time sky theming give the experience a persistent RPG feel.

### Key Systems

| System | Files | What it does |
|--------|-------|--------------|
| [Level Journey](#level-journey) | `LevelJourney.tsx` | Scroll-driven navigation between sections |
| [Book Platformer](#book-platformer-game) | `ImmersiveHeroSceneWithGame.tsx` | 2D side-scroller game in the hero section |
| [XP & Leveling](#xp--leveling) | `XPContext.tsx` | Points for actions, 10-level progression |
| [Achievements](#achievements) | `AchievementContext.tsx`, `achievements.ts` | 9 unlockable badges with toast notifications |
| [Sky Theming](#sky-theming) | `SkyContext.tsx`, `SkyTheme.tsx` | Real-time sky colors based on sun position |
| [Sound](#sound-system) | `SoundContext.tsx`, `sounds.ts` | Programmatic 8-bit sound effects via Web Audio |
| [Content](#content) | `substack.ts`, `site.ts` | Substack RSS integration + site config |

---

## Directory Structure

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout, providers, fonts
│   ├── page.tsx                  # Home (fetches Substack, renders LevelJourney)
│   ├── globals.css               # CSS variables, animations, Tailwind config
│   ├── writing/                  # Blog pages (archive + [slug])
│   ├── robots.txt/route.ts       # Dynamic robots.txt
│   └── sitemap.xml/route.ts      # Dynamic sitemap
│
├── components/
│   ├── pixel-art/                # Visual components for the hero scene
│   │   ├── ImmersiveHeroSceneWithGame.tsx   # THE MAIN GAME COMPONENT
│   │   ├── CelestialBody.tsx     # Scroll-detaching sun/moon
│   │   ├── Companion.tsx         # Floating companion character
│   │   └── ...
│   ├── game/                     # Shared game UI components
│   │   ├── BookModal.tsx         # Book detail popup on click
│   │   ├── MobileControls.tsx    # Touch controls + keyboard hint
│   │   ├── BookPlatformer.tsx    # Legacy SVG-based game (not active)
│   │   └── ...
│   ├── levels/                   # Level section components
│   │   ├── SpawnLevel.tsx        # Hero section (hosts the game)
│   │   ├── AboutLevel.tsx
│   │   ├── WritingLevel.tsx      # Blog posts from Substack
│   │   ├── LinksLevel.tsx
│   │   └── SubscribeLevel.tsx
│   ├── LevelJourney.tsx          # Main orchestrator (scroll, keyboard, transitions)
│   ├── WorldMap.tsx              # Side navigation sidebar
│   ├── StartOverlay.tsx          # Full-screen overlay on first visit
│   ├── XPBar.tsx                 # XP progress bar
│   ├── AchievementToast.tsx      # Achievement notification popup
│   ├── LevelUpOverlay.tsx        # Level-up celebration screen
│   ├── SkyTheme.tsx              # Applies sky colors to CSS variables
│   ├── EasterEggs.tsx            # Konami code + hidden features
│   └── ...
│
├── contexts/                     # React Context providers
│   ├── XPContext.tsx             # XP points, level, rewards
│   ├── AchievementContext.tsx    # Achievement tracking + unlocking
│   ├── SkyContext.tsx            # Sky phase, palette, sun position
│   └── SoundContext.tsx          # 8-bit sound manager
│
├── hooks/
│   ├── useGameInput.ts           # Keyboard + touch input for game
│   ├── useGameLoop.ts            # 60fps requestAnimationFrame loop
│   └── useBookCovers.ts          # Book cover URLs from ISBNs
│
├── lib/
│   ├── game/
│   │   ├── physics.ts            # Constants: gravity, jump force, speeds
│   │   ├── types.ts              # TypeScript interfaces for game entities
│   │   ├── collision.ts          # AABB collision detection
│   │   └── books.ts              # 27 books with ISBNs + platform generation
│   ├── achievements.ts           # Achievement definitions + localStorage helpers
│   ├── sounds.ts                 # SoundManager class (Web Audio API)
│   ├── substack.ts               # RSS feed parser + Zod validation
│   └── sanitize.ts               # HTML sanitization config
│
└── content/
    └── site.ts                   # Site metadata, social links, level definitions
```

---

## Book Platformer Game

The flagship feature: a 2D side-scrolling platformer where the player walks across 27 books from a personal reading list, rendered as platforms.

### Files

- **`src/components/pixel-art/ImmersiveHeroSceneWithGame.tsx`** — All game logic, rendering, and physics (~770 lines)
- **`src/components/levels/SpawnLevel.tsx`** — Hosts the game, manages text panel sliding
- **`src/hooks/useGameInput.ts`** — Unified keyboard/touch input
- **`src/hooks/useGameLoop.ts`** — 60fps `requestAnimationFrame` loop
- **`src/hooks/useBookCovers.ts`** — Builds Open Library cover URLs from ISBNs
- **`src/lib/game/books.ts`** — Book data (titles, authors, ISBNs)

### Physics Constants

```
GRAVITY:        0.8        (applied per frame when airborne)
JUMP_FORCE:    -14         (initial vertical velocity on jump)
MOVE_SPEED:     6          (horizontal pixels per frame)
MAX_FALL_SPEED: 15         (terminal velocity)
Max jump height: ~122px    (derived from GRAVITY and JUMP_FORCE)
```

### Dimensions

```
Player:     64 x 80 px
Books:      70 x 90 px
Ground:     bottom 15% of viewport
```

### Section-Based Platform Layout

The 27 books are arranged across 8 sections. Each section follows a template that defines relative positions (`dx`, `dy` from section start):

| # | Section | Books | Description |
|---|---------|-------|-------------|
| 1 | `ground_row_3` | 3 | Three side-by-side on ground (intro) |
| 2 | `staircase_up` | 3 | Ascending steps, 70px per step |
| 3 | `ground_row_4` | 4 | Four in a row (breather) |
| 4 | `gap_jump` | 3 | Gaps requiring jumps |
| 5 | `pyramid` | 5 | 3 ground + 2 stacked |
| 6 | `staircase_down` | 3 | Descending back to ground |
| 7 | `mixed_heights` | 4 | Alternating ground and elevated |
| 8 | `ground_row_2` | 2 | Final pair before flagpole |

The first book is placed at `viewport_width + 100px` to keep books offscreen on initial load.

### Two-Phase Camera System

1. **Idle (no input):** Player positioned at 70% from left. Text panel is visible.
2. **Game mode (walking right):** Camera lerps so player moves to 25% from left (Mario-style forward visibility). Text panel slides offscreen.

The transition is driven by `gameProgress` (0 to 1), computed from the player's distance right of their start position. The text panel in `SpawnLevel.tsx` uses this to translate X by `-600px * progress` and fade opacity.

### Collision System

Uses split X/Y resolution for proper side collision:

1. **Horizontal pass:** Move player X, check for side collisions against all platforms. If overlapping, push player out of the book's side. A 25px top tolerance allows landing from the side without blocking.
2. **Vertical pass:** Move player Y, check for landing on top of platforms. Player lands when falling and their bottom is within 20px of a platform's top surface.

Platforms are sorted by height (highest first) so the player lands on the top book of a stack.

### Performance Architecture

The game runs at 60fps without causing React re-renders every frame:

- **`worldContainerRef`** — A single `<div>` containing all world-space objects (ground, grass, platforms, flagpole). Scrolled via `transform: translateX()` on the ref.
- **`playerElementRef`** — Player positioned via direct `style.left`/`style.top` updates.
- **`bgParallaxRef`** — Background buildings parallax at 3% of camera offset.
- **`cameraXRef`** — Camera position stored as a ref, never as React state.
- **`playerVisuals` state** — Only triggers React re-render when `walkFrame`, `facingRight`, or `grounded` changes (~10fps vs 60fps).

Sub-components use `React.memo`:
- **`CharacterSprite`** — Pure SVG pixel art sprite, re-renders only on walk frame change.
- **`BookPlatformVisual`** — Static once placed; `memo` prevents re-render during gameplay.
- **`StarsLayer`** — Uses CSS `@keyframes twinkle` instead of Framer Motion.
- **`BackgroundLayer`** — Fully static, renders once.

### Book Covers

Covers are loaded from the Open Library Covers API using ISBNs:
```
https://covers.openlibrary.org/b/isbn/{isbn}-M.jpg
```

Each book has its ISBN stored in `src/lib/game/books.ts`. The `useBookCovers` hook builds a `Map<title, url>` at mount time with no API calls needed (the URL pattern is deterministic). Images load lazily and fall back to colored rectangles with title text if the image fails.

### Flagpole & Achievement

A flagpole is placed 200px past the last book. When the player reaches it:
1. `book_climber` achievement unlocks
2. 75 XP is awarded (deduped by reason string)
3. The flag animates from bottom to top of the pole
4. Achievement toast notification appears

---

## Level Journey

**File:** `src/components/LevelJourney.tsx`

The scroll-driven navigation system that ties the site together.

### How it works

1. Each level is a full-screen `<section>` with an IntersectionObserver (threshold: 0.5)
2. When a section becomes 50%+ visible, it becomes the "active" level
3. Keyboard shortcuts: Arrow keys, j/k (vim), Page Up/Down, Home/End, 1-5 for direct jump
4. Level transitions trigger a brief CRT-style overlay (`TransitionOverlay`)
5. The `WorldMap` sidebar shows all levels with the active one highlighted

### Levels

| Level | Component | Content |
|-------|-----------|---------|
| spawn | `SpawnLevel` | Hero + book platformer game |
| about | `AboutLevel` | Bio, work history, skills |
| writing | `WritingLevel` | Blog posts from Substack RSS |
| links | `LinksLevel` | Recommended resources |
| subscribe | `SubscribeLevel` | Newsletter signup |

---

## XP & Leveling

**File:** `src/contexts/XPContext.tsx`

### Rewards

| Action | XP |
|--------|----|
| Visit a level | 15 |
| First visit to site | 25 |
| Read a blog post | 50 |
| Unlock achievement | 75 |
| Find a secret | 150 |
| Enter Konami code | 300 |

### Levels

10 levels with thresholds: 0, 100, 250, 500, 1000, 2000, 3500, 5500, 8000, 12000

### Deduplication

Each XP grant has a `reason` string. Reasons are stored in localStorage and checked before awarding — the same action never grants XP twice.

---

## Achievements

**Files:** `src/lib/achievements.ts`, `src/contexts/AchievementContext.tsx`

| ID | Title | How to unlock | Secret? |
|----|-------|---------------|---------|
| `first_steps` | First Steps | Scroll past spawn | No |
| `explorer` | Explorer | Visit all 5 levels | No |
| `reader` | Reader | Visit writing archive | No |
| `deep_dive` | Deep Dive | Read a full post | No |
| `completionist` | Completionist | Visit all posts | No |
| `secret_keys` | Secret Keys | Use keyboard navigation | Yes |
| `sound_on` | Sound On | Enable sound effects | Yes |
| `night_owl` | Night Owl | Visit between 12am-5am | Yes |
| `book_climber` | Book Climber | Reach flagpole in platformer | No |

Persisted in localStorage. Each unlock triggers a toast notification and 75 XP.

---

## Sky Theming

**Files:** `src/contexts/SkyContext.tsx`, `src/components/SkyTheme.tsx`

The site's color palette changes in real-time based on the actual sun position at the user's location.

### How it works

1. `SkyProvider` uses the [SunCalc](https://github.com/mourner/suncalc) library
2. Estimates coordinates from the browser's timezone offset
3. Calculates which sky phase the current time falls in
4. Provides a color palette to all components via context
5. `SkyTheme` writes palette values to CSS custom properties
6. Components use `var(--bg)`, `var(--text)`, `var(--accent)`, etc.
7. Palette updates every 60 seconds with 1s CSS transitions

### Sky Phases

`night` > `dawn` > `sunrise` > `morning` > `midday` > `afternoon` > `sunset` > `dusk`

### Testing

Add URL params to force a phase:
- `?sky=sunrise` — force a specific phase
- `?sky=14:30` — force a specific time of day

---

## Sound System

**Files:** `src/contexts/SoundContext.tsx`, `src/lib/sounds.ts`

Programmatic 8-bit sounds generated via the Web Audio API — no audio files.

| Sound | When it plays |
|-------|---------------|
| `menuMove` | Hover over interactive elements |
| `menuSelect` | Click/select, player jump |
| `levelEnter` | Navigate to a new level |
| `achievement` | Unlock an achievement (4-note fanfare) |
| `typing` | Typewriter text effect |
| `xpGain` | XP awarded |

Disabled by default. User enables via `SoundToggle`. Cooldowns prevent rapid stacking.

---

## Content Integration

### Substack RSS

**File:** `src/lib/substack.ts`

- Fetches from `https://johnstone.substack.com/feed`
- Parses with `rss-parser`, validates with Zod
- ISR revalidation: 1 hour
- Posts rendered with sanitized HTML (`sanitize-html`)

### Book Data

**File:** `src/lib/game/books.ts`

27 books with title, author, and ISBN. Used to generate both game platforms and cover image URLs. See the file for the full list.

---

## Styling

### Tailwind 4

CSS-first configuration in `globals.css` — no `tailwind.config.ts`. Custom tokens are mapped from CSS variables set by the sky theming system.

### Fonts

- **Space Grotesk** — Body text
- **Pixelify Sans** — Headings and pixel UI elements

### Pixel Art Effects

- `image-rendering: pixelated` on pixel art SVGs
- CRT scanlines and film grain pseudo-elements
- Stair-step corner clip paths (`pixel-corners` class)

### Animations

Key custom keyframes in `globals.css`:
- `twinkle` — Star opacity pulsing (CSS, not Framer Motion)
- `crt-flicker` — CRT screen effect
- `pixel-wipe` — Level transition effect
- `glow-pulse` — UI glow animation
- `card-shine` — Card hover shimmer

All animations respect `prefers-reduced-motion`.

---

## localStorage Keys

| Key | Value |
|-----|-------|
| `johnstone-xp` | `{totalXP: number}` |
| `johnstone-xp-grants` | `string[]` (dedup reasons) |
| `johnstone_achievements` | `string[]` (unlocked IDs) |
| `johnstone_visited_levels` | `string[]` (level IDs) |
| `johnstone_visited_posts` | `string[]` (post slugs) |
| `johnstone_intro_seen` | `"1"` |
| `johnstone_sound_enabled` | `"true"` / `"false"` |

---

## Easter Eggs

- **Konami Code** (↑↑↓↓←→←→BA) — Grants 300 XP
- **Night Owl** — Visit between midnight and 5am
- **Secret Keys** — Use keyboard shortcuts (j/k, 1-5) to navigate

---

## Deployment

Deployed on Vercel. The `page.tsx` server component fetches Substack RSS at build time with ISR (revalidate: 3600s).

```bash
npm run build     # Production build
npm run start     # Start production server
npm run lint      # ESLint
npx tsc --noEmit  # Type check
```
