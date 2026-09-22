---
timestamp: 2026-05-25T10-43-41Z
slug: src-widgets-client-categorygrid-categoryhero-tsx
---
# Design Critique - CategoryHero

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Auto-slide interval doesn't pause on hover; progress bar resets abruptly on manual click. |
| 2 | Match System / Real World | 3 | Vietnamese copy is natural, but lacks localization fallback. |
| 3 | User Control and Freedom | 1 | No gesture navigation (swipe) on touch/mobile screens; no play/pause toggle. |
| 4 | Consistency and Standards | 2 | `hidden lg:flex flex` conflicts, making navigation render awkwardly. Uses glass-panel on desktop navigation without clear necessity. |
| 5 | Error Prevention | 3 | Recovers gracefully by returning null on empty categories list. |
| 6 | Recognition Rather Than Recall | 2 | Navigation buttons have extremely small text (`text-[9px]`) which is hard to read. |
| 7 | Flexibility and Efficiency | 1 | Lacks keyboard shortcut controls (e.g. arrow keys to switch slides). |
| 8 | Aesthetic and Minimalist Design | 2 | Header name splitting logic (`split(' ')[0]`) breaks visually for single-word categories. Image transitions feel dry. |
| 9 | Error Recovery | 4 | N/A |
| 10 | Help and Documentation | 4 | N/A |
| **Total** | | **24/40** | **Acceptable** |

## Anti-Patterns Verdict

- **LLM Assessment**: The component uses a standard two-column layout which feels functional but relatively generic for a hero. The neumorphic styling is applied, but it lacks the dynamic tactile interactions or interactive visual depth (like parallax or layered physics) that would elevate it beyond a standard layout.
- **Deterministic Scan**: Scan unavailable (bundled detector not found).
- **Visual Overlays**: No reliable user-visible overlay is available (scan skipped).

## Overall Impression
The CategoryHero does a reasonable job presenting category options, but is severely limited in interactivity. It suffers from a buggy navigation container overlay on mobile due to conflicting class names, has zero swipe or keyboard controls, and uses a fragile name-splitting mechanic that fails on single-word titles.

## What's Working
1. **Bombay Palette Shadows**: The use of `shadow-neo-inset-deep` inside the image container creates a nice, recessed tray effect for the product images.
2. **Graceful Loading and Errors**: The loading skeleton is neat, and returning `null` when no data is available prevents breaking the page layout.

## Priority Issues

- **[P1] Fragile Title Splitting**: The code splits titles using `activeCat.name.split(' ')[0]` and italicizes the rest. For single-word titles (like "Shoes"), the italicized portion is empty, leaving a blank line and making the text look misaligned.
  - *Fix*: Check if the title contains spaces first, or support a structured subtitle/display name in the API, or style single-word titles gracefully.
  - *Suggested command*: `impeccable typeset`
- **[P1] Missing Mobile Controls & Gestures**: On touch screens, there is no way to manually change slides because the navigation bar is hidden and swipe gestures are not implemented.
  - *Fix*: Add swipe gesture listeners (touch start/end) to transition slides on mobile.
  - *Suggested command*: `impeccable adapt`
- **[P2] Conflicting Navigation Display Classes**: The navigation bar uses `hidden lg:flex flex`. The trailing `flex` overrides the mobile `hidden` class in standard Tailwind compilation, causing layout bugs on smaller viewports.
  - *Fix*: Remove the redundant `flex` class and only use `hidden lg:flex`.
  - *Suggested command*: `impeccable layout`
- **[P2] Hardcoded Vietnamese & Lack of Pause-on-Hover**: The auto-slide transitions every 6 seconds even if the user hovers over the content or is trying to click a link.
  - *Fix*: Implement event listeners to pause the auto-slide on hover (`onMouseEnter`/`onMouseLeave`).
  - *Suggested command*: `impeccable animate`

## Persona Red Flags

- **Casey (Distracted Mobile User)**: Casey is browsing on a mobile phone using one hand. The category hero automatically rotates, but Casey cannot swipe to see the previous slide or click any pagination dot because they are hidden. This causes frustration when a category of interest slides away before Casey can click it.
- **Sam (Accessibility-Dependent User)**: Sam tabs through the page using a keyboard. The vertical navigation buttons do not have custom focus indicators or ARIA properties showing they control a tabbed slideshow. Tabbing through goes through all hidden images linearly because they remain in the DOM, which causes a highly confusing reading order.
- **Jordan (First-Timer)**: Jordan finds the text sizes inside the navigation buttons (`text-[9px]`) extremely small and difficult to read.
