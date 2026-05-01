# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website for Felipe Diaz (felipediazv.com), hosted on GitHub Pages. Pure static site — no build system, no npm, no framework. Vanilla HTML5, CSS3, and ES6+ JavaScript modules.

## Running Locally

No build step required. Serve files with any HTTP server:

```bash
python -m http.server 8000
# or
npx http-server
```

Visit `http://localhost:8000`. Do not open HTML files directly via `file://` — JS modules require HTTP.

## Deployment

Push to `main` branch. GitHub Pages auto-deploys. Custom domain configured via `CNAME` (felipediazv.com).

## Architecture

### Pages
- `index.html` — Home/hero
- `resume.html` — Portfolio with category view (default) and chronological timeline view switcher
- `blog.html` — Research posts with tag filtering
- `about_me.html` — Personal background with interactive life timeline
- `contact.html` — Contact form + social links
- `fusion-energy-future.html` — Featured research article

Each page loads `src/css/main.css` and `src/js/main.js` as its only dependencies.

### CSS (`src/css/`)
`main.css` is a barrel file that imports all modules in order. `variables.css` holds all CSS custom properties (colors, spacing, breakpoints). Add new styles by creating a file in `src/css/` and adding an `@import` to `main.css`.

### JavaScript (`src/js/`)
`main.js` imports and initializes all feature modules. Each module is self-contained and checks whether its target elements exist before running (so all modules can load on every page). Add new features by creating a module in `src/js/`, importing it in `main.js`, and calling its init function inside the `onReady()` callback.

### Assets
Images and documents live in `assets/`, organized by section (`assets/aboutme/`, `assets/resume/`, `assets/books/`).

## Common Patterns

**Adding a new page**: Create an HTML file, include `<link rel="stylesheet" href="src/css/main.css">` and `<script type="module" src="src/js/main.js"></script>`.

**Adding a page-specific style**: If the style is reusable, create `src/css/myfeature.css` and import it in `main.css`. Page-specific overrides can go in `src/css/pages.css`.

**Adding interactivity**: Create `src/js/myfeature.js` with an exported `init()` function, import it in `main.js`, and call `init()` inside the `onReady()` block.

**CSS variables**: All theme tokens (colors, fonts, spacing) are in `src/css/variables.css`. Always use variables rather than hardcoded values.

## File & Asset Naming

All file and folder names must be **kebab-case, all lowercase, no spaces, no special characters** (e.g. `helmet-hud/`, `final-report.pdf`, `map-lived-visited.png`). This is the web-safe standard and required for consistent URL handling.

## Page-Specific Files (Not in Barrels)

`src/css/blog-post.css` and `src/js/blog-post.js` are intentionally **not** imported into `main.css` or `main.js`. They are page-specific and load only on blog post pages via explicit `<link>` and `<script>` tags in the post's HTML. When creating new blog posts, copy `fusion-energy-future.html` as a template and include these links manually.

## Timeline Event Positioning

Life timeline events in `about_me.html` use `data-year="YYYY.X"` attributes (e.g. `data-year="2009.5"`) to drive positioning. The `life-timeline.js` module reads `eventElement.dataset.year`. Do **not** use CSS class names like `event-year-2009\.5` — these require backslash escaping and are fragile.

## Modal System

All modal open/close logic is handled by `src/js/modals.js`. Never reimplement modal toggling inline.

- **Triggering a modal**: Add `data-modal-target="#modal-id"` to any button or element. For whole-card clicks, add `class="is-clickable"` and `data-modal-target` to the `.tl-card` — the delegated listener in `modals.js` covers both original and cloned cards automatically.
- **Closing**: The global `[data-close-modal]` attribute handler covers all close buttons automatically.
- **URL deep linking**: Opening a modal updates the URL hash (e.g. `resume.html#exp-miru-modal`). Navigating directly to that URL opens the modal on arrival. Browser back/forward works correctly. This is built into `modals.js` — no extra work needed when adding new modals.
- **Adding a new modal**: Give it a unique `id`, add the `.modal` class, and include a `[data-close-modal]` close button. The hash-based deep link is automatic.

## Portfolio Page (resume.html)

The portfolio page has two views driven by `src/js/portfolio.js`:

- **Category view** (`#view-type`) — default, shows experiences grouped by type (work, education, projects, certs).
- **Timeline view** (`#view-chrono`) — chronological order; hidden by default.

**To change the default view**: add/remove the `hidden` attribute on `#view-chrono` and `#view-type` in `resume.html`. No JS change needed — `portfolio.js` reads the initial state from the DOM.

**Adding a new experience**:
1. Add a `.tl-item[data-cat="work|education|projects|certs"]` to the `<ol class="timeline">` in `#view-chrono`. Include a `.tl-card[data-modal-target="#your-modal-id"]` with `class="is-clickable"` if it has a modal.
2. Add the corresponding modal at the bottom of `resume.html`.
3. The category view is populated automatically by `buildTypeView()` in `portfolio.js` — no manual duplication needed.

## CSS Variables

Never hardcode colors, z-index values, or spacing. Always use the tokens in `src/css/variables.css`. Key tokens: `--accent`, `--accent-rgb`, `--z-modal`, `--text`, `--muted`, `--bg`, `--card`, `--border`, `--shadow`.

## Design System

All visual and UX decisions must conform to [`.claude/design-system.md`](.claude/design-system.md).
Read it before touching any HTML structure, nav links, hero copy, CTA text, section layout, padding, or color usage.
