# Design System

Principles and patterns for this portfolio. Read this before editing HTML or CSS. Rules exist for a reason — the rationale is included so edge cases can be judged without asking.

---

## Aesthetic Identity

Earthy, organic, premium. The palette is warm creams and near-blacks with olive mid-tones and toffee brown accents — no bright accent colors. Visual rhythm comes from alternating `--bg-color` (Ivory) and `--bg-color-alt` (Floral White) sections, not from dark/light contrast. Motion and typography carry the premium signal.

---

## Color System

All values live in `src/css/variables.css`. Never hardcode a hex value in component CSS.

| Token | Value | Purpose |
|---|---|---|
| `--bg-color` | #FFFFF0 Ivory | Primary section background |
| `--bg-color-alt` | #FDF6ED Floral White | Alternate sections (add `.alt-section`) |
| `--text-color` | #161811 Carbon Black | Body text, headings |
| `--text-color-muted` | #7B7B65 Dusty Olive | Metadata, captions, secondary copy |
| `--accent` | #8B6541 Toffee Brown | CTAs and active nav state **only** |
| `--accent-2` | #7B7B65 Dusty Olive | Category labels, tags, decorative type |
| `--surface-color` | #ECE1D5 Almond Cream | Card backgrounds |
| `--surface-border` | #D5BCA5 Pale Oak | Borders, dividers |

**Color rules:**
- `--accent` is reserved for interactive elements (buttons, active nav link). Using it decoratively dilutes the CTA signal (Von Restorff Effect).
- `--accent-2` handles all other color accents — role labels, category chips, link hover tints.

---

## Layout

- **Section padding:** `--section-pad-desktop` (120px) / `--section-pad-mobile` (80px) applied globally via `base.css`. Do not override per-section unless there's a structural reason.
- **Max content width:** 1200px, centered.
- **Grids:** 2 columns on desktop, 1 column on mobile (≤768px). This applies to the portfolio card grid and the article grid.
- **Alternate backgrounds:** Add class `.alt-section` to a `<section>` to shift its background to Antique White. Never set `background-color` inline.
- **Mobile ambiguity:** If a design change has no obvious mobile equivalent, ask Felipe before implementing. See `CLAUDE.md` → "Mobile Implementation Rule".

---

## Typography

- **H1 rule:** Must communicate a value proposition — what the visitor gains, not who the person is. Format: `[Role] + [Action/Benefit]`. Never start with "Hi", "Hello", "Welcome", or a bare name.
- **Lead paragraph:** Leads with outcome for the reader, not a description of the author.
- **Section headings (h2):** Concise label — "Selected Work", "Latest News", not full sentences.

---

## Components

### Navigation
Three items in `#site-nav` — no more. (Hick's Law: more choices increase decision time, reducing click-through.) The Contact link is a separate `.btn--small` CTA slot outside the list and doesn't count toward the three.

New pages go in `footer .footer-links`, never in `#site-nav`.

### Buttons
Two variants: `.btn` (primary, filled, uses `--accent`) and `.btn--ghost` (outlined). Copy must be benefit-driven — "View My Impact", "See My Process" — never "Learn More" or bare section titles.

On mobile, all buttons must satisfy `min-height: 44px` (touch target standard).

### Cards (Portfolio Grid)
Maximum 4 cards. Each card follows this 3-line structure, total copy under 80 words:
1. Role & Company (uses `--accent-2`)
2. The specific problem being solved
3. Quantifiable impact ("Increased X by Y%", "Reduced Z from A to B")

Card link copy uses open-loop Zeigarnik language — "Read the case →", "See how I approached this →" — not closed statements like "View project".

### Hero CTA
Exactly two buttons in `.hero__cta`: one `.btn` (primary action) and one `.btn--ghost` (secondary). Never add a third.

---

## Conversion Architecture

- **End-of-page CTA:** Every page must end with `<section class="cta-block">` immediately before `</main>`. One heading, one `.btn`.
- **Mobile sticky CTA:** `.sticky-cta` is fixed to the bottom of the viewport on mobile (≤767px) via `footer.css`. Min height 60px; button inside must meet 44px tap target.
- **Primary CTA placement:** Above the fold in the hero. Repeated at end of page. Not sprinkled throughout.

---

## Hard Constraints

| Constraint | Reason |
|---|---|
| No 4th item in `#site-nav` | Hick's Law — cognitive load |
| No `--accent` on non-interactive elements | Preserves CTA signal contrast |
| No H1 that starts with a greeting or bare name | H1 is conversion copy, not a label |
| No more than 4 cards in the portfolio grid | Primacy/recency bias — 4 is the perceptual limit |
| No JS masonry library | CSS Grid masonry only; JS libraries add weight and jank |
| No inline `background-color` on sections | Use `.alt-section` class; tokens must be the single source |
