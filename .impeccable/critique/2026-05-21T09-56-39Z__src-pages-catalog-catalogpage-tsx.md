---
target: src/pages/catalog/catalogPage.tsx & src/widgets/CatalogFilters/CatalogFilters.tsx
total_score: 24
p0_count: 0
p1_count: 3
timestamp: 2026-05-21T09-56-39Z
slug: src-pages-catalog-catalogpage-tsx
---

### Design Health Score

| #         | Heuristic                       | Score     | Key Issue                                                                                                                                         |
| --------- | ------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1         | Visibility of System Status     | 3/4       | Skeletons work well, but filtering lacks a transition/pending state indicator.                                                                    |
| 2         | Match System / Real World       | 3/4       | Labels are in clear Vietnamese, but internal sort keys map directly to query parameters.                                                          |
| 3         | User Control and Freedom        | 4/4       | Clear filter option resets all params; mobile filter has a direct close button.                                                                   |
| 4         | Consistency and Standards       | 1/4       | Bypasses project-specific CSS design tokens. Custom glass background, non-standard radius (`rounded-[32px]`), hardcoded light-only select styles. |
| 5         | Error Prevention                | 2/4       | No validation to ensure minimum price is lower than or equal to maximum price.                                                                    |
| 6         | Recognition Rather Than Recall  | 3/4       | All filter inputs are visible, but mobile close button and chevrons lack explicit text labels.                                                    |
| 7         | Flexibility and Efficiency      | 2/4       | Debounce is keyword-only. Dropdowns/price fields require clicking "Áp dụng". Hitting Enter on inputs doesn't submit.                              |
| 8         | Aesthetic and Minimalist Design | 2/4       | Glassmorphism cards violate guidelines. Typography uses excessive `font-black` (shouting) and tiny `text-[10px]` labels.                          |
| 9         | Error Recovery                  | 2/4       | No custom error state for invalid input range or API failures.                                                                                    |
| 10        | Help and Documentation          | 2/4       | No inline contextual helper text or price format examples.                                                                                        |
| **Total** |                                 | **24/40** | **Acceptable**                                                                                                                                    |

### Anti-Patterns Verdict

- **LLM assessment**:
  - The UI relies on visual glass container styles (`glass bg-white/40 border-white/40 shadow-neu-soft backdrop-blur-3xl`) for its primary structural layout panels, which directly violates `DESIGN.md` guidelines restricting glass effects to headers, overlays, or floating badges.
  - The border-radius of `rounded-[32px]` is non-standard. Project design tokens specify `rounded-2xl` (12px) as the maximum container radius.
  - Neutrals are hardcoded with custom opacity values (`bg-white/40`, `border-black/5`) instead of utilizing the project's semantic theme color tokens.
  - Typographic visual hierarchy is shouting due to the heavy usage of `font-black` for standard page title elements, competing with tiny `text-[10px]` uppercase labels.
- **Deterministic scan**:
  - Deterministic scan was unavailable (bundled detector not found).
- **Visual overlays**:
  - Overlays are unavailable because no live server/injection was executed.

### Overall Impression

The catalog page layout is structurally sound and responsive. However, its visual styling bypasses the project's standard CSS tokens and theme principles, utilizing custom glass cards and non-standard spacing/radius values which degrade contrast and break dark mode support.

### What's Working

- **Bookmarkable Filters**: Storing search filters inside URL SearchParams ensures user state can be shared, bookmarked, or refreshed without losing selected filters.
- **Loading UX**: Standardizing on skeleton loaders inside the `ProductGrid` component prevents layout shifts and gives visual feedback during product queries.

### Priority Issues

- **[P1] Glassmorphism Violation**: The filter panel aside and the product grid wrapper use glassmorphism with hardcoded colors (`bg-white/40 border-white/40`).
  - _Why it matters_: Lowers text contrast, clutters layout, and makes the panels incompatible with dark mode.
  - _Fix_: Replace the glass classes with standard token backgrounds: `bg-card  shadow-soft`.
  - _Suggested command_: `layout`
- **[P1] Dark Mode Incompatibility in Select Inputs**: Dropdowns are styled statically using `reactSelectLightStyles`.
  - _Why it matters_: Selecting dark mode will render light dropdown menus with poor text contrast.
  - _Fix_: Dynamically toggle `reactSelectLightStyles` vs `reactSelectDarkStyles` based on a dark mode detector hook or HTML element class state.
  - _Suggested command_: `colorize`
- **[P1] Non-standard Border Radius and Spacing**: Container classes use custom `rounded-[32px]` and custom padding.
  - _Why it matters_: Bypasses design tokens, creating a disjointed layout compared to standard components.
  - _Fix_: Standardize radii to `rounded-2xl` (12px) or `rounded-card` (8px).
  - _Suggested command_: `layout`
- **[P2] Price Range Constraint Gaps**: Minimum price input is not validated against the maximum price input.
  - _Why it matters_: Users can enter a minimum price higher than the maximum price, producing empty results or broken queries.
  - _Fix_: Validate input range on apply; swap minimum/maximum values or show a warning if minimum is greater than maximum.
  - _Suggested command_: `harden`
- **[P2] Typographic Shouting**: Heavy font weights (`font-black`) are overused, combined with extremely small, hard-to-read labels (`text-[10px]`).
  - _Why it matters_: Overwhelms the reader; label text visibility is low.
  - _Fix_: Use standard weights like `font-semibold` or `font-medium` for secondary headers, and adjust filter label sizes to `text-xs` or `text-sm` with standard casing or softer tracking.
  - _Suggested command_: `typeset`

### Persona Red Flags

- **Alex (Power User)**:
  - Filter applying is inconsistent: keyword search debounces automatically, whereas dropdown filters (Brand, Category, Sort) and price fields require mouse navigation to a separate manual "Áp dụng" button. Alex cannot hit "Enter" inside text fields to trigger the filter submission.
- **Jordan (First-Timer)**:
  - Icon-only pagination controls (`ChevronLeftIcon` / `ChevronRightIcon`) lack text indicators. On mobile, closing filters requires hitting a floating, generic "✕" close button without supporting copy.
- **Cô Lan (Project-Specific: Mid-aged Shopper)**:
  - Filter labels use a very small font size (`text-[10px]`) and medium grey `text-muted` on a semi-transparent white backdrop. This lack of color and size contrast makes the filters highly inaccessible to older shoppers.

### Minor Observations

- Custom scrollbar styling matches modern custom layouts, but uses hardcoded colors.
- Page query defaults to `page=1` which is clean, but clearing filters deletes page query which behaves correctly.

### Questions to Consider

- Should we automatically apply brand/category dropdown changes upon selection instead of grouping them under the manual "Apply" button?
- Can we transition the pagination to show page number buttons instead of a single page/totalPages label between chevrons to let users navigate directly to specific pages?
