# Spec: Catalog Page Collapsible Left Sidebar & Studio Redesign

## Problem Statement
While the Slide-Over Drawer provided clean filtering on demand, power users and fashion shoppers browsing on Desktop benefit from seeing active filters directly alongside products (SSENSE / Farfetch style). A fixed drawer requires extra clicks to toggle filters, whereas an always-accessible, collapsible left sidebar provides instant filtering capability while allowing users to hide the sidebar and expand the product grid to full width whenever desired.

## Solution
Upgrade the Catalog Page architecture to feature a **Collapsible Left Sidebar (SSENSE-Style Hairline Sidebar)**:
1. **Desktop Layout (`>=1024px`)**:
   - Left Column: `CatalogFilterSidebar.tsx` (`w-64 sm:w-72`), sticky at `top-32`, smooth transition (`transition-all duration-300 ease-out`).
   - Filter Bar Trigger: Toggle button (`ẨN BỘ LỌC` / `HIỆN BỘ LỌC`) with Lucide `PanelLeft` / `SlidersHorizontal` icon to smoothly collapse or reveal the left sidebar.
   - Right Column: Dynamic `ProductGrid` expanding to fill 100% available width when sidebar is collapsed.
2. **Mobile & Tablet Layout (`<1024px`)**:
   - Left Sidebar automatically hides; filter button opens the `CatalogFilterDrawer` slide-over panel.
3. Enforce 100% single-typeface discipline (`Plus Jakarta Sans`), hairline 1px borders (`border-border/60`), zero neumorphic shadows (`shadow-none`), and HSL semantic tokens.

## User Stories
1. As a desktop shopper, I want to see a clean, hairline filter sidebar on the left side of the catalog, so that I can immediately filter products without opening extra drawers.
2. As a user who wants maximum visual space, I want a button to hide the left sidebar, so that the product grid expands across the entire screen width.
3. As a user, I want the left sidebar to stay sticky as I scroll through products, so that I don't lose access to filter options when scrolling deep into the list.
4. As a mobile shopper, I want a seamless slide-over drawer when tapping the filter button, so that filtering remains effortless on small screens.

## Implementation Decisions
- **CatalogFilterSidebar Component (`apps/ecommerce-client/src/components/catalog/CatalogFilterSidebar.tsx`)**:
  - Render SSENSE-style hairline filter sections: Category options, Brand options, Collection options, Price range inputs & quick presets (`< 500k`, `500k-1tr`, `1-2tr`, `> 2tr`), and Attribute options.
  - Hairline borders `border-r border-border/60`, sticky positioning at `sticky top-32 max-h-[calc(100vh-140px)] overflow-y-auto scrollbar-none`.
- **CatalogPage Component (`apps/ecommerce-client/src/pages/catalog/CatalogPage.tsx`)**:
  - Add `isSidebarOpen` boolean state (default `true` on Desktop).
  - Add Toggle button on Sticky Filter Bar: `isSidebarOpen ? "ẨN BỘ LỌC" : "HIỆN BỘ LỌC"`.
  - 2-Column Desktop layout:
    `<div className="flex gap-8">`
      `<div className={isSidebarOpen ? "w-64 sm:w-72 opacity-100 transition-all duration-300" : "w-0 opacity-0 overflow-hidden pointer-events-none transition-all duration-300"}>`
        `<CatalogFilterSidebar ... />`
      `</div>`
      `<div className="flex-1 transition-all duration-300">`
        `<ProductGrid ... />`
      `</div>`
    `</div>`

## Testing Decisions
- Test sidebar collapse/expand toggle animation on Desktop.
- Test View Mode Switcher (`2`, `4`, `6` columns) when sidebar is open vs collapsed.
- Test responsive fallback to Slide-over Drawer on Mobile (`<1024px`).
- Run `npm run build` (`turbo build`) to guarantee 0 TypeScript/bundling errors.

## Out of Scope
- Backend schema or API contract modifications.
