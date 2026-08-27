# Aurora Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform miCarta into a premium glassmorphic app with teal as the primary accent, an aurora gradient background, compact glass header, glass cards, pill buttons, and a multi-level animation system.

**Architecture:** Six sequential tasks: tokens first (foundation), then aurora background, then header, then cards (with surface token upgrade), then control buttons, then splash animation. Each task is independently reviewable.

**Tech Stack:** React 18, TypeScript 5 strict, Vite 5, Framer Motion 11, CSS custom properties.

**Spec:** `docs/superpowers/specs/2026-08-28-aurora-redesign.md`

## Global Constraints

- No new npm packages.
- `npm test -- --run` must pass (63 tests) after every task.
- `npm run build` must succeed (0 TypeScript errors) after every task.
- TypeScript strict mode — no `any`, no new type errors.
- `prefers-reduced-motion` must be respected: all CSS `animation` and `transition` additions need `@media (prefers-reduced-motion: reduce)` guards for non-essential motion. Framer Motion is already covered by `MotionConfig reducedMotion="user"` in App.tsx.
- Mobile-first. Responsive to all screen sizes.
- Map view is untouched visually — changes to App.css must not affect the map.
- No comments in CSS/TSX unless they explain a non-obvious constraint.

---

### Task 1: Token foundation

**Files:**
- Modify: `src/styles/tokens.css`

**Interfaces:**
- Consumes: nothing.
- Produces: all new CSS custom property values used by Tasks 2–6. Every downstream task depends on these exact token names and values.

New tokens produced:
- `--color-primary: #2EC4B6` (teal)
- `--color-primary-dim: rgba(46,196,182,0.12)`
- `--color-warm: #D4582A` (orange, renamed from primary)
- `--color-warm-dim: rgba(212,88,42,0.12)`
- `--color-bg: #080A0F`
- `--color-surface: #131620`
- `--color-surface-2: #1C1F2E`
- `--color-text: #F0EEF8`
- `--color-text-muted: #7A7D8E`
- `--color-border: #252840`
- `--header-height: 56px`
- `--aurora-1: rgba(46,196,182,0.18)`
- `--aurora-2: rgba(180,100,40,0.10)`

- [ ] **Step 1: Replace the full dark theme block in `src/styles/tokens.css`**

  The current `:root, [data-theme="dark"]` block is lines 1–18. Replace it entirely:

  ```css
  :root,
  [data-theme="dark"] {
    --color-bg:          #080A0F;
    --color-surface:     #131620;
    --color-surface-2:   #1C1F2E;
    --color-primary:     #2EC4B6;
    --color-primary-dim: rgba(46, 196, 182, 0.12);
    --color-warm:        #D4582A;
    --color-warm-dim:    rgba(212, 88, 42, 0.12);
    --color-accent:      #2EC4B6;
    --color-text:        #F0EEF8;
    --color-text-muted:  #7A7D8E;
    --color-border:      #252840;
    --color-overlay:     rgba(6, 8, 14, 0.85);
    --aurora-1:          rgba(46, 196, 182, 0.18);
    --aurora-2:          rgba(180, 100, 40, 0.10);

    --shadow-card:       0 4px 24px rgba(0, 0, 0, 0.4);
    --shadow-card-hover: 0 8px 40px rgba(46, 196, 182, 0.22);
    --shadow-modal:      0 24px 80px rgba(0, 0, 0, 0.7);
  }
  ```

- [ ] **Step 2: Update the light theme block**

  The current `[data-theme="light"]` block is lines 20–36. Replace it:

  ```css
  [data-theme="light"] {
    --color-bg:          #F4F6FB;
    --color-surface:     #FFFFFF;
    --color-surface-2:   #EEF0F7;
    --color-primary:     #1A9E92;
    --color-primary-dim: rgba(26, 158, 146, 0.1);
    --color-warm:        #C44D22;
    --color-warm-dim:    rgba(196, 77, 34, 0.1);
    --color-accent:      #1A9E92;
    --color-text:        #1A1410;
    --color-text-muted:  #6B6460;
    --color-border:      #E0E3EF;
    --color-overlay:     rgba(0, 0, 0, 0.6);
    --aurora-1:          rgba(26, 158, 146, 0.12);
    --aurora-2:          rgba(196, 77, 34, 0.07);

    --shadow-card:       0 4px 24px rgba(0, 0, 0, 0.1);
    --shadow-card-hover: 0 8px 40px rgba(26, 158, 146, 0.2);
    --shadow-modal:      0 24px 80px rgba(0, 0, 0, 0.25);
  }
  ```

- [ ] **Step 3: Update `--header-height` in the `:root` typography/spacing block**

  Find the line `--header-height: 72px;` and change it to:
  ```css
  --header-height: 56px;
  ```

- [ ] **Step 4: Run tests**

  ```bash
  npm test -- --run
  ```
  Expected: 63 passed. The app will look slightly different (darker bg, teal where orange was) but no functional breakage.

- [ ] **Step 5: Commit**

  ```bash
  git add src/styles/tokens.css
  git commit -m "style: new aurora token foundation — teal primary, warm orange, 56px header"
  ```

---

### Task 2: Aurora background + view transition

**Files:**
- Modify: `src/App.css`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `--aurora-1`, `--aurora-2`, `--color-bg` from Task 1.
- Produces: `.app::before` aurora layer (z-index 0); all content sits at z-index 1+.

- [ ] **Step 1: Add aurora pseudo-element and z-index stack to `src/App.css`**

  Replace the entire file content with:

  ```css
  .app {
    display: flex;
    flex-direction: column;
    height: 100dvh;
    overflow: hidden;
    background: var(--color-bg);
    transition: background-color var(--transition-theme);
    position: relative;
  }

  .app::before {
    content: '';
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    background:
      radial-gradient(ellipse 80% 60% at 85% 10%, var(--aurora-1) 0%, transparent 70%),
      radial-gradient(ellipse 60% 50% at 15% 90%, var(--aurora-2) 0%, transparent 65%),
      radial-gradient(ellipse 40% 40% at 50% 50%, rgba(46, 196, 182, 0.04) 0%, transparent 60%);
  }

  @keyframes aurora-breathe {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.72; }
  }

  @media (min-width: 768px) {
    .app::before {
      animation: aurora-breathe 28s ease-in-out infinite;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .app::before { animation: none; }
  }

  .app__main {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    position: relative;
    z-index: 1;
    overflow-y: auto;
  }

  .app__view {
    flex: 1;
    min-height: 0;
    width: 100%;
  }

  .app__view--map {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .app__view--cards {
    background-image: none;
  }
  ```

  Note: the road SVG background is removed — the aurora replaces it.

- [ ] **Step 2: Tune the view transition in `src/App.tsx`**

  The `cards` motion.div currently has `initial={{ opacity: 0, scale: 0.97 }}`. Update both view transitions for a snappier, more modern feel:

  ```tsx
  {/* cards view — find this block and update the motion.div props */}
  <motion.div
    key="cards"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.22, ease: 'easeOut' }}
    className="app__view app__view--cards"
  >

  {/* map view — update: */}
  <motion.div
    key="map"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.2 }}
    className="app__view app__view--map"
  >
  ```

- [ ] **Step 3: Run tests**

  ```bash
  npm test -- --run
  ```
  Expected: 63 passed.

- [ ] **Step 4: Run build to verify no TypeScript errors**

  ```bash
  npm run build
  ```
  Expected: success.

- [ ] **Step 5: Commit**

  ```bash
  git add src/App.css src/App.tsx
  git commit -m "style: aurora gradient background + snappy view transition"
  ```

---

### Task 3: Header glassmorphic redesign

**Files:**
- Modify: `src/components/Header/Header.css`
- Modify: `src/components/Header/Header.tsx`

**Interfaces:**
- Consumes: `--color-primary` (teal), `--header-height: 56px`, `--color-text`, `--color-border` from Task 1.
- Produces: `.header--scrolled` CSS class (toggled by scroll listener in Header.tsx).

- [ ] **Step 1: Rewrite `src/components/Header/Header.css`**

  Replace the entire file:

  ```css
  .header {
    position: sticky;
    top: 0;
    z-index: 50;
    height: var(--header-height);
    background: rgba(8, 10, 15, 0.65);
    border-bottom: 1px solid rgba(255, 255, 255, 0.07);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    transition:
      height var(--transition-base),
      background-color var(--transition-theme);
  }

  .header--scrolled {
    height: 48px;
    background: rgba(8, 10, 15, 0.8);
  }

  .header__particles {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
  }

  .header__inner {
    position: relative;
    z-index: 1;
    max-width: 1600px;
    margin: 0 auto;
    height: 100%;
    padding: 0 var(--space-4);
    display: flex;
    align-items: center;
    gap: var(--space-4);
  }

  .header__brand {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    flex-shrink: 0;
  }

  .header__logo {
    width: 40px;
    height: 40px;
    border-radius: var(--radius-full);
    object-fit: cover;
    border: 1px solid var(--color-primary);
    box-shadow: 0 0 0 1px rgba(46, 196, 182, 0.15), 0 0 16px rgba(46, 196, 182, 0.18);
    transition: box-shadow var(--transition-base);
  }

  .header__logo:hover {
    box-shadow: 0 0 0 1px rgba(46, 196, 182, 0.4), 0 0 28px rgba(46, 196, 182, 0.45), 0 0 8px rgba(212, 88, 42, 0.2);
  }

  .header__brand-text {
    display: flex;
    flex-direction: column;
  }

  .header__title {
    font-family: var(--font-display);
    font-size: var(--text-xl);
    font-weight: var(--font-bold);
    line-height: 1.1;
  }

  .header__title-mi {
    color: var(--color-text);
  }

  .header__title-carta {
    color: var(--color-primary);
  }

  .header__subtitle {
    font-size: var(--text-xs);
    color: var(--color-text-muted);
    line-height: 1.2;
  }

  @media (max-width: 360px) {
    .header__brand-text {
      display: none;
    }
  }

  .header__controls {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    margin-left: auto;
  }

  .header__filter-btn {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: var(--radius-md);
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: var(--color-text-muted);
    cursor: pointer;
    backdrop-filter: blur(8px);
    transition:
      background-color var(--transition-fast),
      color var(--transition-fast),
      border-color var(--transition-fast);
  }

  .header__filter-btn--active,
  .header__filter-btn:hover {
    border-color: var(--color-primary);
    color: var(--color-primary);
    background: rgba(46, 196, 182, 0.08);
  }

  .header__filter-dot {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 6px;
    height: 6px;
    border-radius: var(--radius-full);
    background: var(--color-primary);
  }

  @media (min-width: 768px) {
    .header__filter-btn {
      display: none;
    }

    .header__inner {
      padding: 0 var(--space-6);
      gap: var(--space-6);
    }
  }

  @media (min-width: 1024px) {
    .header__inner {
      padding: 0 var(--space-8);
    }
  }
  ```

- [ ] **Step 2: Add scroll-shrink listener and teal particles in `src/components/Header/Header.tsx`**

  At the top of the file, add `useEffect` to the existing `useState` import:
  ```tsx
  import { useState, useEffect } from 'react'
  ```

  Inside `Header()`, after the existing `filterOpen` state, add:
  ```tsx
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  ```

  In the `particlesOptions` object, change the colour values from orange to teal:
  ```tsx
  color: { value: '#2EC4B6' },
  // ...
  links: {
    enable: true,
    distance: 100,
    color: '#2EC4B6',
    opacity: 0.06,
    width: 1,
  },
  ```
  Also update opacity range:
  ```tsx
  opacity: { value: { min: 0.04, max: 0.15 } },
  ```

  On the `<header>` JSX element, add the scrolled class:
  ```tsx
  <header className={`header${scrolled ? ' header--scrolled' : ''}`}>
  ```

  Add `whileTap={{ scale: 0.95 }}` to the filter button `motion.button` (it already has `whileTap={{ scale: 0.9 }}` — change to `0.95`).

  Also add `whileTap={{ scale: 0.95 }}` to the logo image (wrap it if not already a motion element — it is a `motion.img`; add whileTap there).

- [ ] **Step 3: Run tests**

  ```bash
  npm test -- --run
  ```
  Expected: 63 passed.

- [ ] **Step 4: Run build**

  ```bash
  npm run build
  ```
  Expected: success.

- [ ] **Step 5: Commit**

  ```bash
  git add src/components/Header/Header.css src/components/Header/Header.tsx
  git commit -m "style: glassmorphic header 56px, teal particles, scroll-shrink"
  ```

---

### Task 4: Glass cards + pill buttons + surface token upgrade

**Files:**
- Modify: `src/styles/tokens.css` (surface + border tokens → glass values)
- Modify: `src/components/RestaurantCard/RestaurantCard.css`
- Modify: `src/components/RestaurantCard/RestaurantCard.tsx`

**Interfaces:**
- Consumes: `--color-primary` (teal), `--color-warm` (orange), `--shadow-card-hover` from Task 1.
- Produces: glass card surface; pill action buttons; `.card:hover` with teal glow.

- [ ] **Step 1: Upgrade surface tokens to glass in `src/styles/tokens.css`**

  In the `:root, [data-theme="dark"]` block, update three lines:
  ```css
  --color-surface:   rgba(255, 255, 255, 0.05);
  --color-surface-2: rgba(255, 255, 255, 0.08);
  --color-border:    rgba(255, 255, 255, 0.08);
  ```

  In the `[data-theme="light"]` block, leave `--color-surface` and `--color-surface-2` as solid white values (already set in Task 1). Light theme doesn't use glass. Update `--color-border` in light:
  ```css
  --color-border: rgba(0, 0, 0, 0.1);
  ```

- [ ] **Step 2: Rewrite `src/components/RestaurantCard/RestaurantCard.css`**

  Replace the entire file:

  ```css
  .card {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(16px) saturate(160%);
    -webkit-backdrop-filter: blur(16px) saturate(160%);
    border-radius: var(--radius-lg);
    border: 1px solid rgba(255, 255, 255, 0.08);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transition:
      box-shadow var(--transition-base),
      border-color var(--transition-base),
      transform var(--transition-base);
    cursor: default;
  }

  .card:hover {
    box-shadow: 0 8px 40px rgba(46, 196, 182, 0.22), 0 0 0 1px rgba(46, 196, 182, 0.15) inset;
    border-color: rgba(46, 196, 182, 0.2);
  }

  /* Photo */
  .card__image-wrapper {
    position: relative;
    height: 200px;
    overflow: hidden;
    flex-shrink: 0;
  }

  .card__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
  }

  .card:hover .card__image {
    transform: scale(1.04);
  }

  /* Generated cover */
  .card__cover {
    width: 100%;
    height: 100%;
    background: linear-gradient(145deg,
      rgba(8, 10, 15, 0.9) 0%,
      rgba(46, 196, 182, 0.2) 60%,
      rgba(212, 88, 42, 0.12) 100%
    );
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: var(--space-4);
  }

  .card__cover-emojis {
    font-size: 2.4rem;
    line-height: 1;
    filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.5));
  }

  .card__image-gradient {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(8, 10, 15, 0.6) 0%, transparent 50%);
    pointer-events: none;
  }

  /* Warning chip */
  .card__warning-chip {
    position: absolute;
    bottom: var(--space-3);
    left: var(--space-3);
    display: flex;
    align-items: center;
    gap: var(--space-1);
    background: rgba(212, 88, 42, 0.9);
    color: #fff;
    font-size: var(--text-xs);
    font-weight: var(--font-semibold);
    padding: var(--space-1) var(--space-2);
    border-radius: var(--radius-sm);
    backdrop-filter: blur(4px);
    max-width: calc(100% - 2 * var(--space-3));
  }

  /* Body */
  .card__body {
    padding: var(--space-4);
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    flex: 1;
  }

  .card__name {
    font-family: var(--font-display);
    font-size: var(--text-xl);
    font-weight: 700;
    color: var(--color-text);
    line-height: 1.2;
  }

  .card__location {
    font-size: var(--text-sm);
    color: var(--color-text-muted);
    margin-top: var(--space-1);
  }

  /* Personal note */
  .card__note {
    font-family: var(--font-display);
    font-style: italic;
    font-size: var(--text-sm);
    color: var(--color-text-muted);
    border-left: 3px solid var(--color-primary);
    padding-left: var(--space-3);
    margin: 0;
    line-height: 1.6;
  }

  /* Tags */
  .card__tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
  }

  .card__tag {
    font-size: var(--text-xs);
    font-weight: var(--font-semibold);
    background: var(--color-primary-dim);
    color: var(--color-primary);
    padding: var(--space-1) var(--space-3);
    border-radius: var(--radius-full);
    border: 1px solid rgba(46, 196, 182, 0.25);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  /* Actions */
  .card__actions {
    display: flex;
    gap: var(--space-2);
    flex-wrap: wrap;
    margin-top: auto;
  }

  .card__action-btn {
    display: inline-flex;
    align-items: center;
    gap: var(--space-1);
    font-size: var(--text-sm);
    font-weight: var(--font-semibold);
    padding: var(--space-2) var(--space-4);
    min-height: 40px;
    border-radius: var(--radius-full);
    border: 1px solid rgba(46, 196, 182, 0.3);
    background: transparent;
    color: var(--color-primary);
    transition:
      background-color var(--transition-fast),
      border-color var(--transition-fast),
      transform var(--transition-fast),
      box-shadow var(--transition-fast);
    text-decoration: none;
  }

  .card__action-btn:hover {
    background: rgba(46, 196, 182, 0.08);
    border-color: var(--color-primary);
    transform: translateY(-1px);
  }

  .card__action-btn:active {
    transform: scale(0.97);
  }

  .card__action-btn--primary {
    background: linear-gradient(135deg, var(--color-primary) 0%, #1FA99D 100%);
    border: none;
    color: #fff;
    box-shadow: 0 2px 12px rgba(46, 196, 182, 0.3);
  }

  .card__action-btn--primary:hover {
    background: linear-gradient(135deg, var(--color-primary) 0%, #1FA99D 100%);
    box-shadow: 0 4px 20px rgba(46, 196, 182, 0.5);
    border: none;
    transform: translateY(-1px);
  }

  .card__action-btn--primary:active {
    transform: scale(0.97);
  }

  @media (prefers-reduced-motion: reduce) {
    .card,
    .card__action-btn,
    .card__action-btn--primary {
      transition: none;
    }
  }
  ```

- [ ] **Step 3: Update hover and tap animations in `src/components/RestaurantCard/RestaurantCard.tsx`**

  Find the `motion.article` and update `whileHover` and `transition`:
  ```tsx
  <motion.article
    className="card"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -6, scale: 1.015 }}
    transition={{ type: 'spring', stiffness: 320, damping: 22 }}
  >
  ```

  Find the Google Maps `<a>` tag and the website `<a>` tag. Wrap each in a `motion.a` (change `<a` to `<motion.a` and `</a>` to `</motion.a>`) and add `whileTap={{ scale: 0.95 }}`:
  ```tsx
  <motion.a
    href={googleMapsUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="card__action-btn card__action-btn--primary"
    aria-label="Ver en Google Maps"
    whileTap={{ scale: 0.95 }}
  >
  ```
  ```tsx
  {websiteUrl && (
    <motion.a
      href={websiteUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="card__action-btn"
      aria-label="Visitar web del restaurante"
      whileTap={{ scale: 0.95 }}
    >
  ```

  Remember to close `</motion.a>` instead of `</a>` for both.

- [ ] **Step 4: Run tests**

  ```bash
  npm test -- --run
  ```
  Expected: 63 passed.

- [ ] **Step 5: Run build**

  ```bash
  npm run build
  ```
  Expected: success.

- [ ] **Step 6: Commit**

  ```bash
  git add src/styles/tokens.css src/components/RestaurantCard/RestaurantCard.css src/components/RestaurantCard/RestaurantCard.tsx
  git commit -m "style: glass cards, teal pill buttons, surface tokens → rgba"
  ```

---

### Task 5: Glass control buttons (ViewToggle, ThemeToggle, FilterBar)

**Files:**
- Modify: `src/components/ViewToggle/ViewToggle.css`
- Modify: `src/components/ThemeToggle/ThemeToggle.css`
- Modify: `src/components/FilterBar/FilterBar.css`

**Interfaces:**
- Consumes: `--color-primary` (teal), `--color-border` (rgba glass), `--color-surface-2` (rgba glass) from Tasks 1+4.
- Produces: glass-style controls throughout the app.

- [ ] **Step 1: Rewrite `src/components/ViewToggle/ViewToggle.css`**

  ```css
  .view-toggle {
    display: flex;
    gap: var(--space-1);
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: var(--radius-md);
    padding: var(--space-1);
    backdrop-filter: blur(8px);
  }

  .view-toggle__btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: var(--radius-sm);
    color: var(--color-text-muted);
    transition:
      background-color var(--transition-fast),
      color var(--transition-fast);
  }

  .view-toggle__btn:hover {
    color: var(--color-text);
    background: rgba(255, 255, 255, 0.08);
  }

  .view-toggle__btn--active {
    background: var(--color-primary);
    color: #fff;
  }

  .view-toggle__btn--active:hover {
    background: var(--color-primary);
    color: #fff;
  }

  @media (prefers-reduced-motion: reduce) {
    .view-toggle__btn { transition: none; }
  }
  ```

- [ ] **Step 2: Rewrite `src/components/ThemeToggle/ThemeToggle.css`**

  ```css
  .theme-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: var(--radius-full);
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: var(--color-text-muted);
    backdrop-filter: blur(8px);
    transition:
      background-color var(--transition-base),
      border-color var(--transition-base),
      color var(--transition-base);
  }

  .theme-toggle:hover {
    background: rgba(46, 196, 182, 0.1);
    border-color: var(--color-primary);
    color: var(--color-primary);
  }

  .theme-toggle__icon {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @media (prefers-reduced-motion: reduce) {
    .theme-toggle { transition: none; }
  }
  ```

- [ ] **Step 3: Update `src/components/FilterBar/FilterBar.css`**

  Replace the entire file:

  ```css
  .filter-bar--desktop {
    display: none;
    align-items: center;
    gap: var(--space-3);
  }

  @media (min-width: 768px) {
    .filter-bar--desktop {
      display: flex;
    }
  }

  .filter-bar__overlay {
    position: fixed;
    inset: 0;
    background: var(--color-overlay);
    z-index: 100;
    backdrop-filter: blur(4px);
  }

  .filter-bar--sheet {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(8, 10, 15, 0.88);
    backdrop-filter: blur(24px) saturate(160%);
    -webkit-backdrop-filter: blur(24px) saturate(160%);
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: var(--radius-xl) var(--radius-xl) 0 0;
    padding: var(--space-4) var(--space-6) calc(var(--space-6) + env(safe-area-inset-bottom));
    z-index: 101;
    display: flex;
    flex-direction: column;
    gap: var(--space-5);
  }

  .filter-bar__handle {
    width: 36px;
    height: 4px;
    background: rgba(255, 255, 255, 0.15);
    border-radius: var(--radius-full);
    margin: 0 auto var(--space-2);
  }

  .filter-bar__title {
    font-family: var(--font-display);
    font-size: var(--text-xl);
    color: var(--color-text);
  }

  .filter-bar__selects {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  @media (min-width: 768px) {
    .filter-bar__selects {
      flex-direction: row;
    }
  }

  .filter-bar__group {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .filter-bar__label {
    font-size: var(--text-xs);
    font-weight: var(--font-medium);
    color: var(--color-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .filter-bar__select {
    appearance: none;
    background: rgba(255, 255, 255, 0.06);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: var(--radius-full);
    color: var(--color-text);
    font-family: var(--font-body);
    font-size: var(--text-sm);
    padding: var(--space-2) var(--space-8) var(--space-2) var(--space-4);
    cursor: pointer;
    min-height: 40px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%237A7D8E' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right var(--space-3) center;
    transition: border-color var(--transition-fast);
  }

  .filter-bar__select:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px rgba(46, 196, 182, 0.15);
  }

  .filter-bar__clear {
    font-size: var(--text-sm);
    color: var(--color-text-muted);
    padding: var(--space-2) var(--space-3);
    border-radius: var(--radius-sm);
    min-height: 40px;
    transition: color var(--transition-fast);
    text-decoration: underline;
    text-underline-offset: 2px;
  }

  .filter-bar__clear:hover {
    color: var(--color-primary);
  }

  .filter-bar__actions {
    display: flex;
    gap: var(--space-3);
  }

  .filter-bar__apply {
    flex: 1;
    background: linear-gradient(135deg, var(--color-primary) 0%, #1FA99D 100%);
    color: #fff;
    font-size: var(--text-base);
    font-weight: var(--font-semibold);
    padding: var(--space-3) var(--space-6);
    border-radius: var(--radius-full);
    min-height: 48px;
    box-shadow: 0 2px 12px rgba(46, 196, 182, 0.3);
    transition: box-shadow var(--transition-fast), transform var(--transition-fast);
  }

  .filter-bar__apply:hover {
    box-shadow: 0 4px 20px rgba(46, 196, 182, 0.5);
    transform: translateY(-1px);
  }

  .filter-bar__apply:active {
    transform: scale(0.97);
  }

  @media (prefers-reduced-motion: reduce) {
    .filter-bar__select,
    .filter-bar__apply { transition: none; }
  }
  ```

- [ ] **Step 4: Run tests**

  ```bash
  npm test -- --run
  ```
  Expected: 63 passed.

- [ ] **Step 5: Run build**

  ```bash
  npm run build
  ```
  Expected: success.

- [ ] **Step 6: Commit**

  ```bash
  git add src/components/ViewToggle/ViewToggle.css src/components/ThemeToggle/ThemeToggle.css src/components/FilterBar/FilterBar.css
  git commit -m "style: glass control buttons — ViewToggle, ThemeToggle, FilterBar"
  ```

---

### Task 6: Splash letter-by-letter animation + final alignment

**Files:**
- Modify: `src/components/SplashScreen/SplashScreen.tsx`
- Modify: `src/components/SplashScreen/SplashScreen.css`

**Interfaces:**
- Consumes: `--color-primary` (teal), `--color-bg` from Task 1.
- Produces: no new interfaces; standalone visual change.

- [ ] **Step 1: Rewrite letter animation in `src/components/SplashScreen/SplashScreen.tsx`**

  Replace the `motion.h1` block (currently lines 27–34 in the component JSX). The title splits "miCarta" into 7 individual characters, each a `motion.span` with a staggered delay:

  ```tsx
  {/* Replace the existing <motion.h1 className="splash__title"> block with: */}
  <motion.h1
    className="splash__title"
    initial="hidden"
    animate="visible"
    variants={{
      hidden: {},
      visible: { transition: { staggerChildren: 0.04, delayChildren: 0.55 } },
    }}
  >
    {'miCarta'.split('').map((char, i) => (
      <motion.span
        key={i}
        className={i < 2 ? 'splash__title-mi' : 'splash__title-carta'}
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 20 } },
        }}
      >
        {char}
      </motion.span>
    ))}
  </motion.h1>
  ```

  Remove the now-unused `initial`, `animate`, `transition` props that were on the old `motion.h1` (they're replaced by `initial="hidden" animate="visible" variants={...}` above).

- [ ] **Step 2: Update `src/components/SplashScreen/SplashScreen.css`**

  Replace the entire file:

  ```css
  .splash {
    position: fixed;
    inset: 0;
    z-index: 9999;
    background: var(--color-bg);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
    cursor: pointer;
    user-select: none;
  }

  .splash__logo {
    width: 160px;
    height: 160px;
    object-fit: contain;
    border-radius: 50%;
    animation: splash-glow 2.2s ease-out 0.4s both;
  }

  @keyframes splash-glow {
    0%   { filter: drop-shadow(0 0 8px rgba(212, 88, 42, 0.2)); }
    35%  { filter: drop-shadow(0 0 56px rgba(212, 88, 42, 0.9)) drop-shadow(0 0 96px rgba(212, 88, 42, 0.4)); }
    65%  { filter: drop-shadow(0 0 48px rgba(46, 196, 182, 0.85)) drop-shadow(0 0 80px rgba(46, 196, 182, 0.35)); }
    100% { filter: drop-shadow(0 0 24px rgba(212, 88, 42, 0.45)); }
  }

  @media (prefers-reduced-motion: reduce) {
    .splash__logo { animation: none; }
  }

  .splash__title {
    font-family: var(--font-display);
    font-size: clamp(2.5rem, 8vw, 4rem);
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1;
    margin: 0;
    display: inline-block;
  }

  .splash__title-mi {
    color: var(--color-text);
  }

  .splash__title-carta {
    color: var(--color-primary);
  }

  .splash__tagline {
    font-size: 0.75rem;
    color: var(--color-text-muted);
    letter-spacing: 0.2em;
    text-transform: uppercase;
    font-family: var(--font-body);
    margin: 0;
    border-bottom: 1px solid rgba(46, 196, 182, 0.35);
    padding-bottom: 2px;
  }
  ```

- [ ] **Step 3: Run tests**

  ```bash
  npm test -- --run
  ```
  Expected: 63 passed. Note: the smoke test uses `getAllByRole('heading', { name: /miCarta/i })` which still works because the `h1` element still exists with its text content intact — it now just contains individual `span` children.

- [ ] **Step 4: Run build**

  ```bash
  npm run build
  ```
  Expected: success.

- [ ] **Step 5: Commit**

  ```bash
  git add src/components/SplashScreen/SplashScreen.tsx src/components/SplashScreen/SplashScreen.css
  git commit -m "style: splash letter-by-letter animation, mi/Carta teal split, glass tagline"
  ```
