# miCarta — Aurora Redesign Spec

**Date:** 2026-08-28  
**Status:** Approved for implementation

## Goal

Transform miCarta from a flat dark UI into a premium, living app using an aurora gradient atmosphere, glassmorphic surfaces, teal as primary accent, and a three-level animation system. The result must feel modern, elegant, and alive on both mobile and desktop.

## Global Constraints

- No new npm packages beyond what is already installed (React 18, TypeScript 5 strict, Vite 5, Framer Motion 11, React Leaflet 4).
- Respect `prefers-reduced-motion`: all non-essential animations must be skipped when the OS setting is active. Framer Motion's `MotionConfig reducedMotion="user"` is already in App.tsx — it covers Framer animations. CSS animations need `@media (prefers-reduced-motion: reduce)` guards.
- 63 existing tests must continue to pass after each task.
- `npm run build` must succeed (0 TypeScript errors) after each task.
- Mobile-first, responsive to all screen sizes.
- Dark theme is the primary theme; light theme must remain functional (update light tokens consistently).
- Map view is unchanged visually — no aurora, no glass on the map itself. MapView only gets the header changes (compact + glass).

---

## 1. Colour System

### 1.1 Dark theme tokens (replace current values in `src/styles/tokens.css`)

```
--color-bg:          #080A0F        /* deep night, slight blue bias */
--color-surface:     rgba(255,255,255,0.05)   /* glass base */
--color-surface-2:   rgba(255,255,255,0.08)   /* glass elevated */
--color-primary:     #2EC4B6        /* teal — new protagonist */
--color-primary-dim: rgba(46,196,182,0.12)
--color-warm:        #D4582A        /* orange — renamed from primary, used sparingly */
--color-warm-dim:    rgba(212,88,42,0.12)
--color-accent:      #2EC4B6        /* keep --color-accent in sync with --color-primary */
--color-text:        #F0EEF8        /* near-white with cool tint */
--color-text-muted:  #7A7D8E
--color-border:      rgba(255,255,255,0.08)
--color-overlay:     rgba(6,8,14,0.85)
--shadow-card:       0 4px 24px rgba(0,0,0,0.4)
--shadow-card-hover: 0 8px 40px rgba(46,196,182,0.22)
--shadow-modal:      0 24px 80px rgba(0,0,0,0.7)
--header-height:     56px           /* reduced from 72px */
```

Add two new tokens for the aurora:
```
--aurora-1: rgba(46,196,182,0.18)   /* teal node */
--aurora-2: rgba(180,100,40,0.10)   /* warm amber node */
```

### 1.2 Light theme tokens

Keep the light theme functional. Map `--color-primary` and `--color-warm` consistently:
```
--color-primary:     #1A9E92
--color-warm:        #C44D22
--color-bg:          #F4F6FB
--color-surface:     #FFFFFF
--color-surface-2:   #EEF0F7
--color-border:      #E0E3EF
```

### 1.3 Token migration

Every existing use of `var(--color-primary)` that represents the orange accent must be updated to `var(--color-warm)` (buttons, note borders, warning chips, tag pills). Every use that represents the teal (currently `var(--color-accent)`) is now `var(--color-primary)`. This is a rename, not a colour change — the visual values stay the same for teal, but the semantic is corrected.

---

## 2. Aurora Background

### 2.1 Implementation

In `src/App.css`, add the aurora as a `::before` pseudo-element on `.app`, so it covers the full viewport and stays fixed:

```css
.app::before {
  content: '';
  position: fixed;
  inset: 0;
  z-index: 0;
  background:
    radial-gradient(ellipse 80% 60% at 85% 10%, var(--aurora-1) 0%, transparent 70%),
    radial-gradient(ellipse 60% 50% at 15% 90%, var(--aurora-2) 0%, transparent 65%),
    radial-gradient(ellipse 40% 40% at 50% 50%, rgba(46,196,182,0.04) 0%, transparent 60%),
    var(--color-bg);
  pointer-events: none;
}
```

The `z-index: 0` means all content sits above it via their own `position: relative; z-index: 1` context.

### 2.2 Breathing animation

Add a slow CSS keyframe animation to the aurora (desktop only, not mobile to save battery):

```css
@keyframes aurora-breathe {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.75; }
}

@media (min-width: 768px) {
  .app::before {
    animation: aurora-breathe 28s ease-in-out infinite;
  }
}

@media (prefers-reduced-motion: reduce) {
  .app::before { animation: none; }
}
```

### 2.3 z-index stack

All major elements need `position: relative; z-index: 1` to sit above the `::before` aurora layer. The header needs `z-index: 50` (existing). Cards already have a surface bg so they're naturally above it.

---

## 3. Header

### 3.1 Layout changes

- Height: `56px` (down from `72px`)
- Background: `rgba(8,10,15,0.6)` (semi-transparent dark) with `backdrop-filter: blur(20px) saturate(180%)`
- Remove solid bg — the aurora shows through
- Border-bottom: `1px solid rgba(255,255,255,0.07)`

### 3.2 Logo ring

- Border: `1px solid var(--color-primary)` (teal, thinner)
- Box-shadow: `0 0 0 1px rgba(46,196,182,0.15), 0 0 20px rgba(46,196,182,0.2)`
- Hover: glow intensifies, small warm shimmer: `0 0 28px rgba(46,196,182,0.5), 0 0 8px rgba(212,88,42,0.2)`
- Transition: 300ms

### 3.3 Brand text

Unchanged from current: `mi` (cream) + `Carta` (teal). With the header now glass, the text is more readable and the brand is more present.

### 3.4 Particles

Update `particlesOptions` in `Header.tsx`: change colour from `#D4582A` to `#2EC4B6` with opacity range `0.04–0.15`. This makes the particle field feel like floating teal dust rather than orange sparks.

### 3.5 Scroll-shrink behaviour

Add a scroll listener in `Header.tsx` (`window.scroll` event, passive). When scrollY > 30, add class `.header--scrolled` which reduces padding and opacity slightly. On scroll back to top, remove the class. Use Framer Motion `motion.header` with `animate` prop so the size change is smooth (200ms spring).

This is a progressive enhancement — if JavaScript is disabled it stays at full size.

---

## 4. Cards — Glassmorphic Redesign

### 4.1 Card surface

Replace opaque surface with glass:
```css
.card {
  background: rgba(255,255,255,0.05);
  backdrop-filter: blur(16px) saturate(160%);
  -webkit-backdrop-filter: blur(16px) saturate(160%);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: var(--radius-lg);
}
```

### 4.2 Card hover

Teal glow instead of orange:
```css
.card:hover {
  box-shadow: 0 8px 40px rgba(46,196,182,0.22), 0 2px 0 rgba(46,196,182,0.15) inset;
  border-color: rgba(46,196,182,0.2);
  transform: translateY(-4px);
}
```

### 4.3 Cover gradient

Update the hardcoded gradient in `RestaurantCard.css` to use the new colour values:
```css
.card__cover {
  background: linear-gradient(145deg,
    rgba(8,10,15,0.9) 0%,
    rgba(46,196,182,0.2) 60%,
    rgba(212,88,42,0.12) 100%
  );
}
```

### 4.4 Note border

Change `border-left` from `var(--color-primary)` (was orange) to `var(--color-primary)` (now teal — automatic via token rename).

### 4.5 Tags

Tags become teal pills: `--color-primary-dim` bg, `--color-primary` text, teal border. This happens automatically via token rename.

### 4.6 Warning chip

Keep orange (`--color-warm`) — it's a warning, semantic colour is correct.

---

## 5. Buttons

### 5.1 Primary action button (Google/Maps)

Pill shape, teal gradient:
```css
.card__action-btn--primary {
  background: linear-gradient(135deg, var(--color-primary) 0%, #1FA99D 100%);
  border: none;
  border-radius: var(--radius-full);
  color: #fff;
  font-weight: var(--font-semibold);
  padding: var(--space-2) var(--space-4);
  box-shadow: 0 2px 12px rgba(46,196,182,0.3);
  transition: box-shadow 200ms, transform 150ms;
}

.card__action-btn--primary:hover {
  box-shadow: 0 4px 20px rgba(46,196,182,0.5);
  transform: translateY(-1px);
}

.card__action-btn--primary:active {
  transform: scale(0.97);
}
```

### 5.2 Secondary action button (Web)

Ghost style, teal border:
```css
.card__action-btn {
  background: transparent;
  border: 1px solid rgba(46,196,182,0.3);
  border-radius: var(--radius-full);
  color: var(--color-primary);
  padding: var(--space-2) var(--space-4);
  transition: background 200ms, border-color 200ms, transform 150ms;
}

.card__action-btn:hover {
  background: rgba(46,196,182,0.08);
  border-color: var(--color-primary);
  transform: translateY(-1px);
}

.card__action-btn:active {
  transform: scale(0.97);
}
```

### 5.3 Filter, ViewToggle, ThemeToggle buttons

All control buttons (filter trigger, view toggle, theme toggle):
- Background: `rgba(255,255,255,0.06)` with `backdrop-filter: blur(8px)`
- Border: `1px solid rgba(255,255,255,0.1)`
- Hover: border becomes teal, bg slightly brighter
- Active/selected state: teal fill (instead of orange)

---

## 6. Filter Bar

### 6.1 Desktop inline

The FilterBar on desktop sits inside the header. Style the select element:
```css
.filter-bar__select {
  background: rgba(255,255,255,0.06);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: var(--radius-full);
  color: var(--color-text);
  padding: 6px 32px 6px 14px;
  font-size: var(--text-sm);
  transition: border-color 200ms;
}
.filter-bar__select:focus {
  border-color: var(--color-primary);
  outline: none;
}
```

### 6.2 Mobile bottom sheet

Keep the bottom sheet pattern. Update styles:
- Background: `rgba(8,10,15,0.85)` + `backdrop-filter: blur(24px)`
- Border-top: `1px solid rgba(255,255,255,0.08)`
- Apply button: teal gradient (same as primary action btn)

---

## 7. Animation System

### 7.1 Stagger card entrance (Framer Motion)

In `CardGrid.tsx`, the container variants add a stagger delay per card of `0.06s`. Each card enters with `opacity: 0, y: 32` → `opacity: 1, y: 0` with a spring (`stiffness: 200, damping: 20`). This already partially exists — verify and tune.

### 7.2 Card hover spring (Framer Motion)

In `RestaurantCard.tsx`, update `whileHover`:
```tsx
whileHover={{ y: -6, scale: 1.015 }}
transition={{ type: 'spring', stiffness: 320, damping: 22 }}
```

### 7.3 Page transition (Framer Motion)

In `App.tsx`, wrap the view switch in `AnimatePresence mode="wait"`. Each view animates:
- Exit: `opacity: 0, y: -8`, duration 150ms
- Enter: `opacity: 0, y: 8` → `opacity: 1, y: 0`, duration 250ms, ease out

### 7.4 Splash title — letter-by-letter entrance

In `SplashScreen.tsx`, instead of animating the whole title as one block, split "miCarta" into individual characters using a `motion.span` per letter with staggered delays (0.04s apart). Each letter: `opacity: 0, y: 20` → `opacity: 1, y: 0`. Start delay: 0.55s (same as current title start).

### 7.5 Button press feedback

All interactive elements get Framer Motion `whileTap={{ scale: 0.95 }}`. This is a global change across Header controls, card action buttons, and filter button.

### 7.6 Aurora breathing

Handled in CSS (section 2.2). Desktop only, 28s cycle.

### 7.7 prefers-reduced-motion

- CSS animations: guarded with `@media (prefers-reduced-motion: reduce) { animation: none; transition: none; }`
- Framer Motion: already handled by `MotionConfig reducedMotion="user"` in App.tsx

---

## 8. Splash Screen

Minor update to align with new palette:
- Background: `var(--color-bg)` → `#080A0F` (matches new token)
- Title: `mi` in `var(--color-text)`, `Carta` in `var(--color-primary)` (teal) — split same as header
- Letter-by-letter animation (section 7.4)
- Glow animation: keep the orange→teal→orange cycle (already good)
- Tagline border: `var(--color-primary)` (teal)

---

## 9. Files Modified

| File | Change |
|------|--------|
| `src/styles/tokens.css` | New colour values, new tokens |
| `src/App.css` | Aurora `::before`, z-index stack, page transition |
| `src/App.tsx` | `AnimatePresence` view wrapper |
| `src/components/Header/Header.css` | Glass bg, 56px height, logo ring |
| `src/components/Header/Header.tsx` | Teal particles, scroll-shrink, `whileTap` on controls |
| `src/components/FilterBar/FilterBar.css` | Glass select, teal focus, mobile sheet update |
| `src/components/RestaurantCard/RestaurantCard.css` | Glass surface, teal hover, new cover gradient, pill buttons |
| `src/components/RestaurantCard/RestaurantCard.tsx` | `whileHover` tune, `whileTap` on action buttons |
| `src/components/CardGrid/CardGrid.tsx` | Stagger variant tune |
| `src/components/SplashScreen/SplashScreen.tsx` | Letter-by-letter title |
| `src/components/SplashScreen/SplashScreen.css` | New bg token, teal tagline border |
| `src/components/ThemeToggle/ThemeToggle.css` | Glass button, teal active |
| `src/components/ViewToggle/ViewToggle.css` | Glass button, teal active |

---

## 10. Out of Scope

- Map tile style or marker redesign (separate task if desired)
- Adding new restaurants or changing data
- Light theme visual redesign beyond token consistency
- Any new npm packages
