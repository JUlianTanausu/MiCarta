# Nocturnal Road Theme — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rediseño visual "carretera nocturna" — fondo carbón profundo, patrón SVG de carretera serpenteante en vista cards, paleta naranja+turquesa, logo header con "mi" crema y "Carta" turquesa.

**Architecture:** Pure CSS/SVG changes plus one TSX tweak for the split brand text. No new components, no new dependencies.

**Tech Stack:** CSS custom properties, inline SVG as `background-image` data URL, Framer Motion (existing), React 18 + TypeScript.

**Spec:** Conversation — user approved concept 2026-08-27.

## Global Constraints

- No new npm packages.
- Keep all existing CSS custom property names; only update their values.
- Dark theme is the primary (default) theme; light theme adjustments should follow the same character.
- `npm test -- --run` must pass (63 tests) after every task.
- TypeScript strict mode — no new `any`, no new lint errors.
- No comments added to CSS/TSX unless they explain a non-obvious constraint.

---

### Task 1: Deeper carbon background + teal splash glow

**Files:**
- Modify: `src/styles/tokens.css`
- Modify: `src/components/SplashScreen/SplashScreen.css`

**Interfaces:**
- Consumes: nothing from other tasks.
- Produces: `--color-bg: #0A0806` (used by Tasks 2 and 3).

**Steps:**

- [ ] **Step 1: Update tokens.css dark background**

  In `src/styles/tokens.css`, change the dark theme `--color-bg` value:

  ```css
  /* FROM: */
  --color-bg: #14110D;
  /* TO: */
  --color-bg: #0A0806;
  ```

  Also update the surface colours slightly for consistency:
  ```css
  /* FROM: */
  --color-surface:   #1F1B16;
  --color-surface-2: #2A2520;
  /* TO: */
  --color-surface:   #1A1612;
  --color-surface-2: #252018;
  ```

  `--color-accent: #2E9B9B` already exists — leave it as-is.

- [ ] **Step 2: Update splash background colour**

  In `src/components/SplashScreen/SplashScreen.css`, replace hardcoded `#14110D` with the new value:

  ```css
  /* FROM: */
  .splash { background: #14110D; ... }
  /* TO: */
  .splash { background: #0A0806; ... }
  ```

- [ ] **Step 3: Add teal phase to splash glow animation**

  Replace `@keyframes splash-glow` so the logo glow passes through orange, then teal, then settles on orange:

  ```css
  @keyframes splash-glow {
    0%   { filter: drop-shadow(0 0 8px rgba(212, 88, 42, 0.2)); }
    35%  { filter: drop-shadow(0 0 56px rgba(212, 88, 42, 0.9)) drop-shadow(0 0 96px rgba(212, 88, 42, 0.4)); }
    65%  { filter: drop-shadow(0 0 48px rgba(46, 155, 155, 0.85)) drop-shadow(0 0 80px rgba(46, 155, 155, 0.35)); }
    100% { filter: drop-shadow(0 0 24px rgba(212, 88, 42, 0.45)); }
  }
  ```

  Extend animation duration to `2.2s` to give time for both colour phases:
  ```css
  .splash__logo {
    animation: splash-glow 2.2s ease-out 0.4s both;
  }
  ```

- [ ] **Step 4: Add teal accent to splash tagline**

  In `SplashScreen.css`, add a teal underline decoration to `.splash__tagline`:

  ```css
  .splash__tagline {
    /* existing properties stay */
    border-bottom: 1px solid rgba(46, 155, 155, 0.4);
    padding-bottom: 2px;
  }
  ```

- [ ] **Step 5: Run tests**

  ```bash
  npm test -- --run
  ```
  Expected: 63 passed.

- [ ] **Step 6: Commit**

  ```bash
  git add src/styles/tokens.css src/components/SplashScreen/SplashScreen.css
  git commit -m "style: deeper carbon bg, teal phase in splash glow"
  ```

---

### Task 2: Winding road SVG background in cards view

**Files:**
- Modify: `src/App.css`

**Interfaces:**
- Consumes: `--color-bg: #0A0806` from Task 1 (road colours reference the bg).
- Produces: `.app__view--cards` class with road background (used visually only).

**Steps:**

- [ ] **Step 1: Design the road SVG**

  The road is a winding path viewed from above: a wide stroke bezier curve (the tarmac) plus a dashed centre line, all very low opacity so cards sit comfortably on top.

  SVG spec:
  - ViewBox: `0 0 1200 900`
  - Tarmac: a cubic bezier from bottom-left to top-right with an S-curve, `stroke="#2A2520"`, `stroke-width="70"`, `fill="none"`, `stroke-linecap="round"`
  - Road edges (shoulder lines): same path, `stroke="#332E28"`, `stroke-width="72"`, rendered BEHIND tarmac
  - Centre dashes: same path, `stroke="#3A3530"`, `stroke-width="1.5"`, `stroke-dasharray="32 22"`
  - Overall `opacity="0.7"` on the group so the whole thing stays subtle

  Path data (S-curve from bottom-left to top-right):
  ```
  M -60 820 C 150 820 200 600 420 520 S 700 260 900 180 S 1100 80 1320 60
  ```

- [ ] **Step 2: Encode SVG as data URL and add to App.css**

  Add `.app__view--cards` rule to `src/App.css`:

  ```css
  .app__view--cards {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 900'%3E%3Cg opacity='0.7'%3E%3Cpath d='M -60 820 C 150 820 200 600 420 520 S 700 260 900 180 S 1100 80 1320 60' stroke='%23332E28' stroke-width='72' fill='none' stroke-linecap='round'/%3E%3Cpath d='M -60 820 C 150 820 200 600 420 520 S 700 260 900 180 S 1100 80 1320 60' stroke='%232A2520' stroke-width='70' fill='none' stroke-linecap='round'/%3E%3Cpath d='M -60 820 C 150 820 200 600 420 520 S 700 260 900 180 S 1100 80 1320 60' stroke='%233A3530' stroke-width='1.5' fill='none' stroke-dasharray='32 22' stroke-linecap='round'/%3E%3C/g%3E%3C/svg%3E");
    background-size: cover;
    background-position: center bottom;
    background-repeat: no-repeat;
  }
  ```

  Add corresponding class to `.app__view--map` to ensure it has no road background:
  ```css
  .app__view--map {
    background-image: none;
  }
  ```

- [ ] **Step 3: Apply the class in App.tsx**

  Read `src/App.tsx` to find where `.app__view` is used, then ensure the class `app__view--cards` is applied when `view === 'cards'`.

  The existing pattern likely uses:
  ```tsx
  className={`app__view${view === 'map' ? ' app__view--map' : ''}`}
  ```

  Change to:
  ```tsx
  className={`app__view app__view--${view}`}
  ```

  This applies `app__view--cards` for cards view and `app__view--map` for map view automatically.

- [ ] **Step 4: Run tests**

  ```bash
  npm test -- --run
  ```
  Expected: 63 passed.

- [ ] **Step 5: Commit**

  ```bash
  git add src/App.css src/App.tsx
  git commit -m "style: winding road SVG background on cards view"
  ```

---

### Task 3: Header brand "mi" + "Carta" split identity

**Files:**
- Modify: `src/components/Header/Header.tsx`
- Modify: `src/components/Header/Header.css`

**Interfaces:**
- Consumes: `--color-accent: #2E9B9B` from tokens (already in tokens.css).
- Produces: `.header__title-mi` (cream) and `.header__title-carta` (teal) classes.

**Steps:**

- [ ] **Step 1: Split brand text in Header.tsx**

  Locate the line:
  ```tsx
  <span className="header__title">miCarta</span>
  ```

  Replace with:
  ```tsx
  <span className="header__title">
    <span className="header__title-mi">mi</span>
    <span className="header__title-carta">Carta</span>
  </span>
  ```

  The visually-hidden `<h1 className="visually-hidden">miCarta</h1>` stays unchanged — it keeps the accessible name complete.

  Also remove the stray `onCuisineChange` and `availableCuisines` destructured params that are in the component body but not in `HeaderProps` interface — they are unused remnants from before the cuisine filter was removed:

  Change:
  ```tsx
  export function Header({
    view, onViewChange, theme, onThemeToggle, filters,
    onCityChange, onCuisineChange, onClearFilters,
    availableCities, availableCuisines, totalCount, filteredCount,
  }: HeaderProps) {
  ```
  To:
  ```tsx
  export function Header({
    view, onViewChange, theme, onThemeToggle, filters,
    onCityChange, onClearFilters,
    availableCities, totalCount, filteredCount,
  }: HeaderProps) {
  ```

- [ ] **Step 2: Style the split text in Header.css**

  Remove the existing `.header__title` color rule and replace with explicit per-span rules:

  ```css
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
    color: var(--color-accent);
  }
  ```

- [ ] **Step 3: Enhance logo ring with dual-colour glow**

  Update `.header__logo` to use both accent colours as a gradient border:

  ```css
  .header__logo {
    width: 48px;
    height: 48px;
    border-radius: var(--radius-full);
    object-fit: cover;
    border: 2px solid var(--color-primary);
    box-shadow: 0 0 0 1px var(--color-accent), 0 0 16px rgba(46, 155, 155, 0.2);
    transition: box-shadow var(--transition-base);
  }

  .header__logo:hover {
    box-shadow: 0 0 0 1px var(--color-accent), 0 0 28px rgba(46, 155, 155, 0.45), 0 0 8px rgba(212, 88, 42, 0.3);
  }
  ```

- [ ] **Step 4: Run tests**

  ```bash
  npm test -- --run
  ```
  Expected: 63 passed.

- [ ] **Step 5: Commit**

  ```bash
  git add src/components/Header/Header.tsx src/components/Header/Header.css
  git commit -m "style: split mi/Carta header brand with teal accent, dual-colour logo ring"
  ```
