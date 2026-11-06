# Ticket 14: Dynamic ViewMode Grid & Infinite Scroll in ProductGrid

## What to build
Upgrade `ProductGrid.tsx` to support dynamic column layouts (`2 CỘT`, `4 CỘT`, `6 CỘT`), replace heroicons with Lucide hairline outline icons, and implement an `IntersectionObserver` sentinel element for automatic Infinite Scroll loading.

## Acceptance criteria
- [ ] Add `viewMode` prop (`"2" | "4" | "6"`) to `ProductGrid.tsx`.
- [ ] Render dynamic grid classes based on `viewMode` (`grid-cols-1 sm:grid-cols-2`, `grid-cols-2 md:grid-cols-3 lg:grid-cols-4`, `grid-cols-2 md:grid-cols-3 lg:grid-cols-6`).
- [ ] Implement `IntersectionObserver` sentinel div at bottom of `ProductGrid` that triggers `onLoadMore` callback when visible.
- [ ] Replace heroicons with Lucide icons (`Layers`, `CheckCircle2`, `Loader2`).
- [ ] Display clean end-of-catalog status when all items are loaded (`BẠN ĐÃ XEM HẾT X SẢN PHẨM`).

## Blocked by
- Ticket 13: Redesign Catalog Filter Drawer & Active Filter Chips.
