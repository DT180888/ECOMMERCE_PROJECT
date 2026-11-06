# 0004. Universal Full-Width Header and 3-Column Split-Pane Workspace Architecture

Date: 2026-10-08

## Status
Accepted

## Context
In previous iterations, the CRM Admin layout had multiple overlapping header components:
1. `AdminWorkspaceTopbar` (an in-canvas bar on top of the content outlet).
2. `AdminHorizontalNavbar` (a full-width topbar used only in horizontal navigation mode).
3. `Sidebar` header containing redundant logo signatures.
4. `AdminPageShell` containing duplicate titles and badges.

This caused:
- Layout shift when switching between Sidebar Mode and Topbar Mode (Logo jumped positions).
- UI clutter (Brand name/title repeated 3 times across Topbar, PageShell, and ActionDock).
- Vertical canvas wastage (up to 44px lost to redundant titles).

## Decision
We unified the administrative layout into a **Universal Full-Width Header + 3-Column Split-Pane Workspace** architecture:

1. **Universal App Header (`AdminHeader.tsx`, 100vw, Height: 56px / `h-14`)**:
   - **Left:** Brand Atelier Logo (`MINIMALISM. CRM ATELIER`) anchored permanently at top-left.
   - **Center Context Zone:**
     - In **Sidebar Mode**: Displays dynamic hierarchical breadcrumbs (`AdminBreadcrumb.tsx`).
     - In **Topbar Mode**: Displays top-level horizontal dropdown menus (Dashboard, Business, Products, System).
   - **Right:** Permanent `SystemIsland` capsule (User Avatar + Name/Email in flex-col, Dark/Light Theme, Layout Switcher, Logout).

2. **3-Column Workspace Body (`AdminLayout.tsx`, below header)**:
   - **Column 1 (Sidebar - Left):** Clean collapsible navigation dock under the header, toggled between `w-64` and `w-[68px]`. Only active in Sidebar mode.
   - **Column 2 (Content Canvas - Center):** `flex-1 min-w-0`, houses `TableActionDock` and `AdminTable`, scrolling independently.
   - **Column 3 (Inspector Drawer - Right):** Split-pane drawer without dark backdrops for non-blocking editing and side-by-side data auditing.

## Consequences
- **Positive:**
  - Zero layout shift when toggling between Sidebar and Topbar navigation modes.
  - Logo and System Island remain permanently anchored at top-left and top-right.
  - Maximized vertical space for data tables and inspector forms.
  - Eliminated duplicate profile dock at the bottom of the sidebar.
- **Negative:**
  - Requires maintaining horizontal menu items and sidebar links in sync (both reference centralized permission checks).
