---
target: src/widgets/client/Product/ProductCard.tsx
total_score: 33
p0_count: 0
p1_count: 2
timestamp: 2026-05-23T10-08-25Z
slug: src-widgets-client-product-productcard-tsx
---
# Design Critique: Product Card Component

This document evaluates the design quality, consistency, and accessibility of the primary client-side product card component.

---

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3/4 | Active/hover states are present but focus indicators are missing. |
| 2 | Match System / Real World | 4/4 | Neumorphic physics (opposing shadows) perfectly match physical extrusion. |
| 3 | User Control and Freedom | 4/4 | Clean, direct links and a functional quick-add utility. |
| 4 | Consistency and Standards | 3/4 | Image container rounded corner mismatch between card (`12px`) and skeleton (`6px`). |
| 5 | Error Prevention | 3/4 | Image loading errors fallback gracefully to default asset. |
| 6 | Recognition Rather Than Recall | 3/4 | Standard retail product card format makes layout instantly recognizable. |
| 7 | Flexibility and Efficiency | 3/4 | Hiding the Quick Add button behind hover on desktop obscures content and limits efficiency. |
| 8 | Aesthetic and Minimalist Design | 4/4 | Clean, soft Neumorphic palette with a restrained visual hierarchy. |
| 9 | Error Recovery | 3/4 | Graceful image fallback logic prevents broken UI states. |
| 10 | Help and Documentation | 3/4 | Clear pricing and collection label provides helpful context. |
| **Total** | | **33/40** | **Excellent (30-35)** |

---

## Anti-Patterns Verdict

- **LLM Assessment**: The card design is a strong showcase of the Neumorphism design system, using soft dual opposing shadows (`shadow-neo`) and an inset well (`shadow-neo-inset-deep`) for the product image. It completely avoids flat colors, hard hex shadows, side-stripe borders, or text gradients, successfully passing the AI slop test.
- **Deterministic Scan**: Deterministic scan was unavailable (bundled detector not found).
- **Visual Overlays**: No live browser overlay was injected.

---

## Overall Impression

The product card is visually stunning, clean, and leverages Neumorphism's tactile qualities exceptionally well. However, it suffers from minor UX overlaps on hover and critical keyboard accessibility gaps (missing focus rings).

---

## What's Working

1. **Nested Depth Play**: The contrast between the extruded card body (`shadow-neo`) and the inset image container (`shadow-neo-inset-deep`) creates a beautiful, tactile 3D effect that feels carved from a single piece of clay.
2. **Restrained Typography**: The hierarchy is clear—using DM Sans with tracking-widest on the brand uppercase label, a clean title, and bold price, ensuring excellent readability.
3. **Smooth Hover Elevation**: The dual shadow transition (`shadow-neo` to `shadow-neo-hover` with a subtle translate-y lift) feels smooth and natural.

---

## Priority Issues

### [P1] Obscuring Content on Desktop Hover
- **Why it matters**: Hiding the "Quick Add" button behind hover is a visual pattern that causes the button to overlay the lower portion of the card when active. This covers up the brand name, product title, and price, hiding the information the user is trying to read.
- **Fix**: Re-adjust the layout so the button slides up from the bottom of the card inline, or position it as a floating icon button overlaying the image well instead.
- **Suggested command**: `/layout`

### [P1] Missing Interactive Focus States
- **Why it matters**: Interactive elements (the card wrapper `<Link>` and the "Quick Add" `<button>`) do not have any focus indicators (`focus:ring-...`). Keyboard users tab-navigating the grid cannot see which card they are currently focusing on.
- **Fix**: Add a visible focus ring: `focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background` on the link and button.
- **Suggested command**: `/harden`

### [P2] Inadequate Mobile Touch Target Size
- **Why it matters**: On mobile, the "Quick Add" button is rendered inline below the card with `py-2`, which produces a button height of ~36px. This is below the minimum 44px touch target required by WCAG 2.1 AA guidelines, causing mis-clicks.
- **Fix**: Increase the button's mobile height to a minimum of `h-11` (44px) or `h-12` (48px) with `py-3` or `min-h-[44px]`.
- **Suggested command**: `/adapt`

### [P3] Skeleton Corner Radius Inconsistency
- **Why it matters**: The real card uses `rounded-inner` (12px) for the image container, but `ProductCardSkeleton` uses `rounded-[6px]`. This mismatch creates a jarring visual pop-in when the image loads.
- **Fix**: Update the skeleton's image container rounded class to `rounded-inner`.
- **Suggested command**: `/polish`

---

## Persona Red Flags

- **Alex (Power User)**: No keyboard focus rings on the card links or buttons. Alex cannot navigate the product grid using only their keyboard without losing track of their current position. Hiding the "Quick Add" button behind desktop hover also prevents immediate action via keyboard triggers.
- **Jordan (First-Timer)**: Navigating the store on a mobile device, Jordan tries to quickly add items to their cart, but the tiny 36px touch target of the Quick Add button makes them repeatedly tap the product card by accident, leading to unwanted page redirects.

---

## Minor Observations

- The formatting of VND minor currency uses standard Intl utility which looks clean and localized.
- The use of `object-contain` on the image inside the inset container prevents image distortion across various product aspect ratios.

---

## Questions to Consider

- *Would a floating, minimal shopping cart icon button positioned inside the corner of the inset image container be cleaner than a text button that obscures product text?*
- *Should we make the "Quick Add" button visible on desktop as well, rather than hiding it behind a hover action?*
- *Can we unify the mobile and desktop card sizes to maintain a uniform gap and grid alignment?*
