# Game Upgrade Spec: RPG + Arcade Experience

## Overview
Transform the site from "website with pixel styling" to "RPG game you can explore."

## Priority Features

### 1. Animated Avatar in LevelTracker (HIGH IMPACT)
- Small pixel character that lives in the left rail (desktop) / bottom bar (mobile)
- **Idle animation**: subtle bounce or breathing when stationary
- **Walk animation**: character walks up/down as user scrolls between levels
- Position syncs with active level node
- Uses existing avatar.png with CSS animation frames

### 2. Dialog Box System (HIGH IMPACT)
- RPG-style content containers replacing plain cards
- Pixel border with corner decorations
- Optional "speaker" label at top
- "Press ENTER to continue" or ">" prompt styling
- Apply to: section intros, work items, post cards

### 3. Sound Effects with Toggle (HIGH IMPACT)
- **Sounds needed:**
  - `menu-move.mp3` - navigating between levels (soft blip)
  - `menu-select.mp3` - clicking/selecting (confirmation sound)
  - `level-enter.mp3` - entering a new section (short jingle)
  - `achievement.mp3` - unlocking something (fanfare)
  - `typing.mp3` - optional typing sound for TypingEffect
- **Sound toggle**: icon in Nav, persisted to localStorage
- **Implementation**: Web Audio API with preloaded buffers
- Use royalty-free 8-bit sounds or generate with jsfxr

### 4. Floating Particles Background (MEDIUM IMPACT)
- Subtle floating pixels/stars in the background
- Parallax effect on scroll
- Performance: use CSS animations, limit particle count
- Colors: use accent colors at low opacity

### 5. Enhanced Screen Transitions (MEDIUM IMPACT)
- Upgrade TransitionOverlay with pixel-wipe effect
- Optional: brief "ENTERING [LEVEL NAME]" flash
- CRT flicker on level change

### 6. Achievement System (MEDIUM IMPACT)
- **Achievements:**
  - "First Steps" - scroll past spawn level
  - "Explorer" - visit all 6 levels
  - "Reader" - visit the writing archive
  - "Deep Dive" - read a full post
  - "Completionist" - visit all posts
  - "Secret" - use keyboard navigation (1-6 keys)
- **Storage**: localStorage
- **Display**: toast notification on unlock, badge collection somewhere

### 7. Stats Panel for About (LOW IMPACT)
- Gamify interests as RPG stats with bars
- Example: "PAYMENTS ████████░░ 80"
- Fun but quick to implement

### 8. Arcade Polish (THROUGHOUT)
- Blinking "PRESS START" text
- Enhanced CRT scanlines option
- Subtle screen curvature effect (CSS)
- "PAUSED" state if tab loses focus (optional)

---

## Technical Approach

### Sound System
```typescript
// src/lib/sounds.ts
- SoundManager class with Web Audio API
- Preload all sounds on first interaction
- Global mute state in React context
- Hook: useSounds() returns play functions
```

### Avatar Animation
```typescript
// CSS sprite animation or framer-motion
- 4-frame idle animation (bounce)
- Walking state triggered by scroll direction
- Position interpolates between level nodes
```

### Dialog Box Component
```typescript
// src/components/DialogBox.tsx
- Pixel border using box-shadow layers or SVG
- Speaker label prop
- Optional portrait prop
- Animate-in with typewriter or fade
```

### Particle System
```typescript
// src/components/ParticleField.tsx
- Fixed position, pointer-events: none
- ~30-50 particles with CSS animations
- Random positions, sizes, speeds
- Parallax: transform based on scroll position
```

### Achievement System
```typescript
// src/lib/achievements.ts
- Achievement definitions with conditions
- useAchievements() hook
- AchievementToast component
- AchievementBadges display component
```

---

## File Structure (new files)
```
src/
  components/
    DialogBox.tsx          # RPG dialog container
    ParticleField.tsx      # Background particles
    AchievementToast.tsx   # Unlock notification
    AchievementBadges.tsx  # Badge collection display
    SoundToggle.tsx        # Mute/unmute button
    GameAvatar.tsx         # Animated character sprite
  lib/
    sounds.ts              # Sound manager
    achievements.ts        # Achievement system
  contexts/
    SoundContext.tsx       # Sound state provider
    AchievementContext.tsx # Achievement state provider
public/
  sounds/
    menu-move.mp3
    menu-select.mp3
    level-enter.mp3
    achievement.mp3
```

---

## Implementation Order
1. Sound system + toggle (foundation for feedback)
2. Dialog box component (visual transformation)
3. Animated avatar (the "wow" feature)
4. Particle field (ambiance)
5. Achievement system (engagement)
6. Screen transitions (polish)
7. Stats panel (quick win)
8. Final arcade polish pass

---

## Sound Assets
Will generate 8-bit sounds using jsfxr or use CC0 sounds from freesound.org.
Fallback: create placeholder sounds that can be swapped later.
