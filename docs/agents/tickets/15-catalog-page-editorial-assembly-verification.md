# Ticket 15: CatalogPage Assembly, Sticky Bar & Production Build Verification

## What to build
Rebuild `CatalogPage.tsx` with a Minimalist Editorial Header, Breadcrumbs, Sticky Filter Bar (`sticky top-16`), View Mode Switcher (`2` | `4` | `6`), Sort Dropdown, and Slide-over Drawer trigger. Run production build (`turbo build`) to ensure 0 errors.

## Acceptance criteria
- [ ] Remove legacy top `Hero` banner from `CatalogPage.tsx`.
- [ ] Implement Editorial Header with breadcrumbs (`HOME / SHOP`), dynamic category/search title, and tabular-nums result counter.
- [ ] Implement Sticky Filter Bar with glass backdrop blur (`bg-background/85 backdrop-blur-md border-b border-border/60`).
- [ ] Add View Mode switcher buttons (`2 CỘT`, `4 CỘT`, `6 CỘT`) controlling `ProductGrid` density.
- [ ] Connect `CatalogFilterDrawer` slide-over panel and `ActiveFilterChips` row.
- [ ] Verify Infinite Scroll state management (appending items or increasing page size on scroll).
- [ ] Run `npm run build` (`turbo build`) and confirm Exit Code 0.

## Blocked by
- Ticket 13: Redesign Catalog Filter Drawer & Active Filter Chips.
- Ticket 14: Dynamic ViewMode Grid & Infinite Scroll in ProductGrid.
