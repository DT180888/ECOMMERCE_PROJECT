# Ticket 17: Integrate Collapsible Sidebar & Toggle Button into CatalogPage

## What to build
Integrate `CatalogFilterSidebar` into `CatalogPage.tsx` with a 2-column Desktop layout, add `isSidebarOpen` toggle button (`ẨN BỘ LỌC` / `HIỆN BỘ LỌC`) on the Sticky Filter Bar, implement smooth width transition, and maintain mobile fallback to Slide-over Drawer.

## Acceptance criteria
- [ ] Add `isSidebarOpen` boolean state to `CatalogPage.tsx`.
- [ ] Add Sidebar Toggle button on Sticky Filter Bar: `isSidebarOpen ? "Ẩn Bộ Lọc" : "Hiện Bộ Lọc"` with `PanelLeft` / `SlidersHorizontal` Lucide icons.
- [ ] Render 2-column layout on Desktop (`>=1024px`) with smooth width transition (`transition-all duration-300`).
- [ ] ProductGrid smoothly expands to 100% width when sidebar is collapsed.
- [ ] Fall back to Slide-over Drawer on Mobile (`<1024px`).
- [ ] Run `npm run build` (`turbo build`) and confirm Exit Code 0.

## Blocked by
- Ticket 16: Create SSENSE-Style CatalogFilterSidebar Component.
