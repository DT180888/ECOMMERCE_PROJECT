---
target: src/widgets/Product
total_score: 24
p0_count: 1
p1_count: 2
timestamp: 2026-05-21T09-41-23Z
slug: src-widgets-product
---
# Design Critique: src/widgets/Product

This report evaluates the UX/UI and code quality of the product widget components, including `ProductCard`, `ProductCardSkeleton`, `ProductGrid`, and `SkuSelector`.

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2/4 | Skeleton loader uses dark-theme styles, making it invisible/broken in light mode; mismatch in skeleton layout compared to actual card. |
| 2 | Match System / Real World | 3/4 | Plain English/Vietnamese terminology; clear attribute choices. |
| 3 | User Control and Freedom | 3/4 | Quick Add is easily accessible on desktop; selector allows resetting choices by clicking. |
| 4 | Consistency and Standards | 1/4 | Border-radius values (`24px`, `32px`, `12px`) contradict the design tokens (`8px`, `4px`). Hardcoded colors override project variables. Compiled `.js` files reside in `src/`. |
| 5 | Error Prevention | 3/4 | Stock validation correctly disables unavailable combinations, though styling has low contrast. |
| 6 | Recognition Rather Than Recall | 3/4 | Traditional card grid; however, mobile users cannot see the hover-only Quick Add button. |
| 7 | Flexibility and Efficiency | 2/4 | Hover-dependent overlay forces mobile users to visit details page to add to cart. |
| 8 | Aesthetic and Minimalist Design | 2/4 | Heavy, non-standard card drop-shadows and slow `0.6s` animation curves violate the clean, responsive aesthetic. |
| 9 | Error Recovery | 3/4 | Image fallback handles broken image URLs gracefully. |
| 10 | Help and Documentation | 2/4 | Basic "Vui lòng chọn đầy đủ tùy chọn" text; lacks inline guides for sizing or attributes. |
| **Total** | | **24/40** | **Mediocre / Needs Improvement** |

## Anti-Patterns Verdict

### LLM Assessment
At first glance, the interface has styling choices that feel outdated or mismatched:
- **Mismatched Rounded Corners**: The card uses a `24px` border-radius and the skeleton uses `32px`, giving it a bubbly, inconsistent appearance when the design system defines `rounded-card` as `8px`.
- **Heavy Shadow & Slow Motion**: The huge box-shadow and slow `0.6s` transition curve on hover feel cartoonish and laggy.
- **Palette Deviations**: The card uses hardcoded `#11120D` and `#565449` and `rgb(235, 235, 235)` (a flat, cold gray background), violating the warm-sand theme specified in the project's design system.
- **Mobile Usability**: Relying on hover triggers for the "Quick Add" button hides a core functionality from mobile viewports.

### Deterministic Scan
- **CLI detector**: `deterministic scan unavailable` (detector tool crashed/missing in this repository).
- **Visual overlays**: `browser visualization unavailable` (browser automation tool is not available in this session).

## Overall Impression
The core layout and product logic are solid, but the implementation deviates heavily from the project's defined design tokens (colors, border-radius, transition times). Aligning the components with the system tokens and fixing mobile accessibility for the Quick Add feature will immediately elevate the design.

## What's Working
1. **Fallback Image Handling**: The image onError fallback safely avoids broken layout states by rendering the default product image placeholder.
2. **SKU Availability Logic**: `SkuSelector` actively checks stock availability and disables combinations that are out of stock, preventing invalid purchases.

## Priority Issues

### [P0] Inconsistent Styling & Hardcoded Design Tokens
- **Why it matters**: Violates the project's design system, leading to visual fragmentation. The card's gray background (`rgb(235, 235, 235)`) clashes with the warm sand theme. Mismatched roundness (`24px` card vs `12px` buttons vs `8px` token) looks unpolished.
- **Fix**: Replace all hardcoded colors, borders, shadows, and radii in `ProductCard.module.css` and `SkuSelector.tsx` with CSS tokens (e.g., `var(--card)`, `var(--foreground)`, `var(--border)`, `shadow-soft`).
- **Suggested command**: `/impeccable polish src/widgets/Product`

### [P1] Broken Light-Mode Card Skeleton & Layout Mismatch
- **Why it matters**: The skeleton is hardcoded to dark-theme white-opacity classes (`bg-white/[0.02] border-white/5`), rendering it invisible or broken in light mode. Its layout also has a bottom row with price and button, which doesn't match the actual card's layout, causing a jarring layout shift upon load.
- **Fix**: Rewrite `ProductCardSkeleton.tsx` to use the same layout as `ProductCard` and style it using the standard `var(--muted)` and `var(--card)` colors.
- **Suggested command**: `/impeccable polish src/widgets/Product`

### [P1] Mobile Touch Inaccessibility for Quick Add Overlay
- **Why it matters**: Quick Add is hover-dependent, rendering it invisible to mobile users who represent a massive portion of eCommerce traffic.
- **Fix**: Position the Quick Add button statically below the card info on mobile viewports (e.g., using `lg:absolute lg:opacity-0 lg:group-hover:opacity-1` transitions) so mobile users can interact with it.
- **Suggested command**: `/impeccable adapt src/widgets/Product`

### [P2] Low-Contrast Disabled Options in SkuSelector
- **Why it matters**: Out-of-stock attributes use `#565449/30` on a light background, yielding a contrast ratio of ~1.5:1. This is unreadable for visually impaired users.
- **Fix**: Use a higher-contrast text styling for disabled options, such as `var(--muted-foreground)` with a diagonal strike-through or reduced opacity that maintains readability.
- **Suggested command**: `/impeccable polish src/widgets/Product`

### [P3] Codebase Pollution with Compiled JS Files
- **Why it matters**: Compiled `.js` files (like `ProductCard.js`, `ProductCardSkeleton.js`) are checked into the `src/` folder next to their `.tsx` sources. This triggers build-check warnings, complicates git history, and risks out-of-sync edits.
- **Fix**: Add `"noEmit": true` to `tsconfig.json` and delete the generated `.js` files.
- **Suggested command**: `/impeccable polish`

## Persona Red Flags

- **Alex (Power User)**:
  - Red Flag: Slow hover transition (`0.6s`) makes browsing lists feel sluggish and non-responsive.
  - Red Flag: Sku selection requires multiple mouse clicks without keyboard shortcuts or focus outline support.
- **Jordan (First-Timer)**:
  - Red Flag: The skeleton loader is invisible/broken in light mode, making Jordan think the page is empty or broken during loading.
  - Red Flag: The hover-only Quick Add button is invisible on Jordan's phone, forcing them to open the detail page for every single item.

## Minor Observations
- The SKU selector auto-selects the first SKU on mount, which helps speed up selection but could lead to accidental purchases of the wrong size/color if the user doesn't pay attention.
- The editorial "End of List" separator uses a thin line that can get lost on large screens.

## Questions to Consider
- What if the Quick Add button was integrated directly as a clean icon button next to the price (visible on touch) rather than a full-hover overlay?
- Can we safely remove the compiled `.js` files to clean up the workspace and let Vite handle TSX transpilation natively?
