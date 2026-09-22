---
target: src/pages/client/product/ProductDetailPage.tsx
total_score: 31
p0_count: 1
p1_count: 2
timestamp: 2026-05-23T10-13-43Z
slug: src-pages-client-product-productdetailpage-tsx
---
# Design Critique: Product Detail Page

This document evaluates the design quality, consistency, and accessibility of the client-side Product Detail Page component.

---

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3/4 | Active/hover states exist but focus indicators are missing on breadcrumbs and thumbnail gallery buttons. |
| 2 | Match System / Real World | 4/4 | Neumorphic elements (gallery buttons, detail container) respect light-source physics. |
| 3 | User Control and Freedom | 4/4 | Easy navigation, breadcrumbs, and SKU switching. |
| 4 | Consistency and Standards | 2/4 | Core token violations: hardcoded warm/brownish hex colors used instead of CSS design system variables, and incorrect button corner radii. |
| 5 | Error Prevention | 3/4 | Invalid URL IDs are intercepted; image loading errors fallback gracefully. |
| 6 | Recognition Rather Than Recall | 3/4 | Standard split layout (left gallery, right details) follows e-commerce norms. |
| 7 | Flexibility and Efficiency | 3/4 | Quick buy and add-to-cart buttons are prominent, but hover states flatten out. |
| 8 | Aesthetic and Minimalist Design | 3/4 | Beautiful Neumorphic foundation, but tarnished by placeholder skeleton contrast issues and flat hover states. |
| 9 | Error Recovery | 3/4 | Invalidation and empty state fallbacks are clear. |
| 10 | Help and Documentation | 3/4 | Clear pricing starting tags and descriptions. |
| **Total** | | **31/40** | **Good (26-30+)** |

---

## Anti-Patterns Verdict

- **LLM Assessment**: The page possesses a strong Neumorphic structural design but violates critical token rules. First, it uses hardcoded hex colors (`#565449`, `#11120D`) which introduce warm/brownish tones that clash with the strict cool-grey monochromatic palette (`#E0E5EC`). Second, it overrides standard buttons to use `hover:shadow-none`, which flattens out Neumorphic depth on hover (a core system anti-pattern). Finally, the skeleton loading state uses a semi-opaque white (`bg-white/5`), which is barely visible on the light cool-clay background.
- **Deterministic Scan**: Deterministic scan was unavailable (bundled detector not found).
- **Visual Overlays**: No live browser overlay was injected.

---

## Overall Impression

The Product Detail Page has a beautiful layout with excellent spatial proportions. However, it violates design tokens through hardcoded hexes, flat-hover button overrides, and low-contrast skeletons. These elements need to be refactored to align with the core tokens of `DESIGN.md`.

---

## What's Working

1. **Breadcrumbs and Layout Proportions**: The split layout (7/12 gallery, 5/12 info grid) creates a balanced visual weight. The breadcrumb path provides clear spatial navigation context.
2. **Interactive Gallery**: Thumbnail previews shift between extruded (`shadow-neo-sm`) and pressed (`shadow-neo-inset-sm`) states upon selection, providing a highly tactile response.
3. **Structured Specifications Grid**: Specifications are organized in a clean list utilizing alternating neumorphic depth, avoiding cluttered table borders.

---

## Priority Issues

### [P0] Hardcoded Hex Colors & Tone Discrepancies
- **Why it matters**: The code uses hardcoded text color hex values like `text-[#11120D]` and `text-[#565449]`. This directly violates `RULE[rule.md]` (no inline hexes) and introduces warm brown tones that clash with the brand's cool-monochromatic gray palette (`#E0E5EC`, `#3D4852`).
- **Fix**: Replace all instances of `text-[#11120D]` with `text-foreground` and `text-[#565449]` with `text-muted`.
- **Suggested command**: `/harden`

### [P1] Low-Contrast Skeleton Placeholder Loading State
- **Why it matters**: The loading skeleton uses `bg-white/5` for content blocks. On a light `#E0E5EC` background, white with 5% opacity is practically invisible, failing accessibility contrast guidelines and providing poor user feedback while loading.
- **Fix**: Replace `bg-white/5` placeholders in the loading skeleton with `bg-muted` or the unified `skeleton-pulse` utility class from `index.css`.
- **Suggested command**: `/polish`

### [P1] Flat Button Hover State Overrides
- **Why it matters**: The "Add to Cart" and "Buy Now" buttons override the default Neumorphic button class with `hover:shadow-none`. Removing shadows on hover flattens the element, directly violating the Neumorphism core principle (no flat designs).
- **Fix**: Remove `hover:shadow-none` and let the default `hover:shadow-neo-hover` and `active:shadow-neo-inset-sm` handle the depth transition. Also replace `rounded-xl` with `rounded-button` (16px) for token consistency.
- **Suggested command**: `/layout`

### [P2] Missing Focus Indicators for Interactive Elements
- **Why it matters**: Breadcrumbs, gallery thumbnail buttons, and navigation links lack visible focus rings (`focus-visible:ring-2`), blocking keyboard-only accessibility.
- **Fix**: Apply focus ring utility classes (`focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background`) to all links and interactive thumbnail buttons.
- **Suggested command**: `/harden`

---

## Persona Red Flags

- **Alex (Power User)**: Alex navigates the product detail tab using keyboard shortcuts. The thumbnail gallery buttons have no focus outlines, leaving Alex blind to which image is currently selected.
- **Jordan (First-Timer)**: While waiting for the page to load on a mobile network, Jordan sees a completely blank-looking screen due to the `bg-white/5` skeleton blocks being virtually invisible on the light gray background, making them think the website is broken.

---

## Minor Observations

- The specifications grid is hidden on mobile and replaced with a simplified list, which correctly prioritizes cognitive load.
- Breadcrumbs are fully uppercase, adding to the display font's geometric look.

---

## Questions to Consider

- *Should we implement a magnifier or zoom effect on the main image hover to further enhance the interactive feel of the gallery?*
- *Would a sticky bottom mobile action bar (always visible Buy Now / Add to Cart) improve purchase conversions over the current scroll-bound layout?*
