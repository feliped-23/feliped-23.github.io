# Design System — High-Converting Portfolio

Prescriptive rules for every UI change on this site. All rules are binding. Read this before editing any HTML, CSS, or copy.

---

## Section 1 — Global Layout

**Nav (Hick's Law):** The `<ul>` inside `#site-nav` across all HTML files must contain exactly **3 `<li>` items**. The current nav has 5 (Home, Portfolio, Research, About, Contact) — this violates the rule. Canonical 3: **Portfolio, Research, About**. The `Contact` link styled as `.btn.btn--small` is a standalone CTA slot outside the 3 items and may be retained. Never add a 4th or 5th nav link — new pages belong in `footer .footer-links`, not `#site-nav`.

**Vertical padding (White Canvas):** Every `<section>` must have `padding-top: 120px; padding-bottom: 120px` on desktop, and `80px` on mobile (`max-width: 768px`). The current `.hero` in `src/css/hero.css` uses `padding: clamp(1rem, 3vw, 2rem) 0 2.2rem` — non-compliant; update it. The `.panels` container in `src/css/components.css` is also non-compliant; update it.

**Accent color (Von Restorff Effect):** `--accent` (`#b47149` light / `#d59a77` dark, defined in `src/css/variables.css`) is reserved **exclusively** for:
- Primary CTA buttons (`.btn` in `src/css/buttons.css`)
- Active nav-link state indicators

Do not apply `--accent` to any decorative element. Use `--accent-2` (`#8fa27b` sage) for all non-CTA accent needs. Do not change the hex values in `src/css/variables.css` — change where `--accent` is applied in `src/css/buttons.css`, `src/css/components.css`, and `src/css/pages.css`.

---

## Section 2 — Hero Section (`index.html`)

**H1:** Must follow `[Role] specializing in [Domain]` or `[Role] who [Action + Benefit]`. The current value "Felipe Diaz / Integrated Engineer & Futurist" is a title, not a value proposition — non-compliant. The `<span class="accent">` wrapper for visual emphasis is correct; retain it. Never start an H1 with "Hello", "Hi", "Welcome", or a bare name alone.

**`.lead` paragraph:** Must lead with what the visitor gains (Action + Benefit formula). Rewrite away from describing the person toward describing the outcome for the reader.

**Hero CTA (`.hero__cta`):** Exactly two buttons. The primary `.btn` must use benefit-driven copy ("View My Impact", "See My Process", "Explore My Work" — never "Learn More", never a bare section title like "Professional Portfolio"). The secondary `.btn.btn--ghost` is the ghost/secondary variant. Never add a third CTA in `.hero__cta`.

---

## Section 3 — Case Study Grid (`resume.html`)

**Maximum 4 projects** in the primary portfolio grid. Place the most data-rich, highest-impact project first to exploit primacy bias (Serial Position Effect).

**Each card summary** must follow this strict 3-line structure, total text under 80 words:
- Line 1: Role & Company
- Line 2: The specific user/business problem
- Line 3: Quantifiable impact ("Increased conversion by X%", "Reduced onboarding time from A to B")

**Card links** (`.card-link` in `src/css/components.css`) must use open-loop Zeigarnik language — "Read the case →", "See how I approached this →" — not closed statements like "View project" or "See more".

---

## Section 4 — New Sections (create when asked)

**AI Stack module:** Add a new `<section>` on `index.html` listing human-AI collaboration tools. Approved tools: Claude (Anthropic), Moonchild AI. Style each tool name with the `.pill` component from `src/css/components.css`. Do not add tools beyond this list without explicit user confirmation.

**Playground / Explorations:** A masonry grid section visually segregated from case studies — not a tab inside the existing portfolio view. Create `src/css/playground.css` and add `@import 'playground.css'` to `src/css/main.css`. Use CSS Grid masonry: `grid-template-rows: masonry` with `grid-auto-rows` as fallback. Never use a JS masonry library.

**Digital Garden:** A text-only notes index demonstrating continuous learning. Can be a second tab in `blog.html` or a new `garden.html`. Use the `.lede` class from `src/css/base.css` for descriptions. Minimal styling — no cards, no images.

---

## Section 5 — Conversion Architecture

**Mobile sticky CTA (viewport ≤ 767px):** Add a `.sticky-cta` block to `src/css/footer.css` inside a `@media (max-width: 767px)` block: `position: fixed; bottom: 0; width: 100%; z-index: 100`. Minimum block height: 60px. The button inside must have `min-height: 44px; min-width: 44px`.

**End-of-page CTA:** Every page must end with `<section class="cta-block">` immediately before `</main>`. This section contains one heading and one primary `.btn`. Currently missing on all pages — add it whenever editing any page.

**44px tap targets:** All `<a>` and `<button>` elements on mobile must satisfy `min-height: 44px; min-width: 44px`. The existing `.btn` padding likely satisfies this at default font sizes, but `.btn--small` (`0.55rem 0.85rem` in `src/css/buttons.css`) may not — add explicit `min-height: 44px` to `.btn--small` if needed.

---

## Section 6 — Hard Prohibitions

- Never add a 4th or 5th item to `#site-nav`. New pages go in the footer.
- Never apply `--accent` to a non-CTA decorative element.
- Never write an H1 that starts with "Hello", "Hi", "Welcome", or is a bare name without a value proposition.
- Never show more than 4 projects in the primary case study grid on `resume.html`.
- Never use a JS masonry library — CSS Grid masonry only.
- Never remove `--accent-2` from use — it is the designated color for all non-CTA accent needs.
