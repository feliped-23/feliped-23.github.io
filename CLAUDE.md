# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Felipe Diaz's personal portfolio. Static site — vanilla HTML, CSS, JS. No build step, no package manager.

**Preview:** Open `index.html` directly in a browser.

## Architecture

```
index.html              ← Single landing page
src/
  css/
    main.css            ← @imports all CSS files (edit import order here)
    variables.css       ← All design tokens (colors, motion, spacing)
    base.css            ← Reset, section padding, .alt-section, reduced-motion
    buttons.css         ← .btn, .btn--ghost, .btn--small
    header.css          ← Sticky nav
    components.css      ← Cards, portfolio grid, .reveal animation
    hero.css            ← Hero section
    research.css        ← Articles section
    footer.css          ← Footer + mobile .sticky-cta
  js/
    main.js             ← Nav highlight, typewriter, scroll reveals, magnetic buttons
```

## Sources of Truth

- **`src/css/variables.css`** — all design tokens; never hardcode colors or timings in component CSS
- **`design-system.md`** — color usage rules, layout, typography, component patterns, conversion architecture
- **`motion-design-standards.md`** — animation constraints, easing curves, device-specific rules

## Key Invariants

- `--accent` is for interactive elements only (CTAs, active nav); `--accent-2` is for decorative accents
- Animate `transform` and `opacity` only — never layout properties (`width`, `height`, `margin`, etc.)
- Alternate section backgrounds use `.alt-section` class — never set `background-color` inline
- New pages link from `footer .footer-links`, never from `#site-nav`

## Mobile Implementation Rule

Every design change that touches layout, typography, spacing, color, animation, or any visual component **must** account for the mobile viewport (≤768px).

If the mobile translation of a change is not immediately obvious **stop and ask Felipe explicitly** before implementing. Do not guess, do not skip mobile, and do not silently apply a desktop-only change.

Ask something like: "This change doesn't have a clear mobile equivalent — how should it behave on mobile?" and wait for an answer before writing any code.
