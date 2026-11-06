# Ticket 13: Redesign Catalog Filter Drawer & Active Filter Chips

## What to build
Create `CatalogFilterDrawer.tsx` to replace `FullScreenFilterOverlay.tsx` with a high-end slide-over drawer panel from the right. Refactor `ActiveFilterChips.tsx` to use hairline studio pill tokens (`border border-border/60 rounded-[2px]`).

## Acceptance criteria
- [ ] Create `CatalogFilterDrawer.tsx` as a right-side slide-over panel (`fixed inset-y-0 right-0 w-full max-w-md bg-background border-l border-border/60 z-50`).
- [ ] Render filter accordion sections for Category options, Brand options, Collection options, Price range min/max inputs, and attribute filters.
- [ ] Include sticky bottom action bar with `Xóa tất cả` and `Áp dụng (N)` buttons.
- [ ] Refactor `ActiveFilterChips.tsx` to use 100% Tailwind semantic tokens, 100% `Plus Jakarta Sans`, hairline borders `border-border/60`, and Lucide `X` icon.
- [ ] Remove all legacy neumorphism classes (`shadow-neo-sm`).

## Blocked by
- None (can start immediately).
