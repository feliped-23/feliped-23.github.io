# Interactive Life Timeline — Functional Spec

A horizontally-scrolling, chronological timeline component that groups life events by *location* (a place lived, with a start/end year range) and plots individual *events* within that location proportionally to when they happened. Written to be implementation-agnostic — rebuild it with any styling, framework, or DOM structure; only the data shape and behavior matter.

## Data Model

```
Timeline
  └── Location[]              // ordered chronologically
        - name                 // e.g. "Vietnam"
        - flagOrIcon           // any visual identifier for the location
        - ageRangeLabel        // display text, e.g. "Age 13-16"
        - startYear            // number, e.g. 2015
        - endYear              // number, or "present" for the open-ended last entry
        - events: Event[]      // unordered w.r.t. top/bottom, ordered by year
              - year            // float allowed (e.g. 2018.8) — decimal disambiguates
                                 //   ordering/position for events within the same year
              - title
              - description     // optional, may be empty/placeholder ("coming soon")
              - image            // optional
              - lane             // "top" | "bottom" — which row of the two-row
                                 //   alternating layout this event renders in
```

Locations are rendered left-to-right in chronological order. Within a location, events are split into two lanes (top/bottom) purely for visual alternation so cards don't overlap when several events land close together in time — lane assignment has no semantic meaning beyond layout.

## Positioning Algorithm

Each event's horizontal offset within its location is computed, not hand-placed:

```
pixelsPerYear = responsive constant (see below)
relativeYear  = event.year - location.startYear
rawPosition   = relativeYear * pixelsPerYear
maxPosition   = (location.endYear - location.startYear) * pixelsPerYear
position      = clamp(rawPosition, 0, maxPosition)
```

- `pixelsPerYear` is responsive: **300px** desktop, **150px** at ≤768px viewport width, **120px** at ≤480px. Recompute and re-apply this formula to every event whenever the viewport is resized (debounce ~100ms to avoid thrashing).
- Clamping keeps an event visually inside its location's span even if a year value slightly overshoots the location's boundary.
- Locations themselves are laid out end-to-end; each location's total width is `(endYear - startYear) * pixelsPerYear`, so the whole timeline's scrollable width is the sum of all location widths.

## Container & Navigation

- The event track lives in one horizontally-scrollable container (native scroll, not JS-simulated).
- Prev/Next buttons scroll the container by **80% of its visible width** per click, smooth-scrolled.
- Buttons disable/dim themselves at the scroll extremes (start/end), re-evaluated on every scroll event.
- Keyboard: `ArrowLeft`/`ArrowRight` scroll prev/next by the same 80%-width increment; `Home`/`End` jump to the very start/end of the scrollable content.
- Touch: detect horizontal-dominant swipes (compare accumulated X vs Y movement early in the gesture) so the component captures horizontal drags without blocking normal vertical page scrolling.
- Clicking a location's marker/flag brings that location to the center of the viewport (smooth scroll, offset computed from the location's bounding box relative to the container) and applies a brief pulse/highlight animation (~1-2s) so the user notices which one was targeted.

## Event Cards (Flip Interaction)

Each event renders as a two-sided card:
- **Front face**: just the event's image (or a placeholder image if none exists yet).
- **Back face**: year, title, and description — revealed on interaction rather than shown by default, keeping the collapsed timeline visually clean.

Clicking/tapping an event card additionally opens a modal overlay showing a larger version of the image plus the full year/title/description text — useful on mobile where the flip affordance is harder to discover. The modal should support: closing via an explicit close button, clicking outside the modal content (backdrop), and the `Escape` key; and should trap/move focus to the close button on open for accessibility.

Hover (desktop only) can apply a subtle lift/scale to the card for affordance; skip this on touch devices since there's no true hover state.

## Scroll-in Animations

Use an `IntersectionObserver` (threshold ~0.1, rootMargin ~50px) watching each location and event element; when an element enters the viewport, add a "revealed" state/class that CSS can key off of for a fade/slide-in transition. This decouples "is it visible" from "is it positioned" — positioning always happens on load/resize regardless of visibility.

## Rebuild Checklist

1. Model your data as `locations[]` each holding `events[]` with a numeric (decimal-capable) year.
2. Compute event positions from year deltas × a responsive pixels-per-year constant; clamp to the location's span; recompute on resize.
3. Wire a native horizontally-scrollable container with prev/next buttons, keyboard, and touch-swipe support, each scrolling ~80% of viewport width.
4. Give each event a collapsed (image-only) and expanded (year/title/description) state — via flip, accordion, tooltip, or modal, whichever fits the new visual style.
5. Add an intersection-observer-driven reveal animation as an optional polish layer, independent of the positioning logic.
