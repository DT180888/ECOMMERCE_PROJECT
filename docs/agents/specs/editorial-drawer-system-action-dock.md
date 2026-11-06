# Spec: Editorial Slide-over Drawer, System Dock & Morphing Action Dock

## Problem Statement
Currently in `apps/crm-admin`:
1. Low-complexity entity forms (Brand with only `name` and `slug`, Category, and Collection) navigate away to dedicated pages (`/admin/brand/new`, `/admin/brand/:id`, `/admin/category/*`), causing total loss of list context, active filters, and pagination position.
2. In `sidebar` layout mode, maintaining both a persistent vertical Sidebar and a 60px horizontal `AdminTopBar` wastes valuable vertical viewport real estate merely to display theme/layout toggles and user profile info.
3. Table controls and batch actions are scattered across static toolbars with no progressive disclosure or dynamic dock morphing when multiple rows are selected.

## Solution
Implement **Direction 1: Editorial Split-Pane & Unified Slide-over Drawer Architecture**:
1. **Unified Slide-over Drawer with Deep-linking**:
   - Utilize `@my-project/ui` `Sheet` (`side="right"`, 480px width, `border-l border-border/60`, flat `bg-card`).
   - Synchronize open state and entity ID with URL Query Params (`?action=create`, `?edit=:id`).
   - Provide seamless instant in-place CRUD for `Brand`, `Collection`, and `Category` without full-page navigation.
2. **Sidebar System Dock**:
   - In `sidebar` mode, completely remove `AdminTopBar`, giving 100% viewport height to the main canvas.
   - Embed a sleek, flat hairline `System Dock` at the bottom of `Sidebar.tsx` hosting Layout Toggle (`sidebar` $\leftrightarrow$ `topbar`), Theme Toggle (`dark` $\leftrightarrow$ `light`), User profile, and Logout.
3. **Morphing Table Action Dock**:
   - Create a reusable `TableActionDock` component (`bg-card/95 backdrop-blur-md border border-border/60 rounded-[2px]`).
   - Default state: Search input, total count indicator, and `+ Thêm mới` button.
   - Batch selection state: Smoothly morphs into a batch actions bar (selected counter, batch status toggle, batch delete, deselect all).

## Implementation Decisions
- **Sub-task 1: Sidebar System Dock & TopBar Removal in Sidebar Mode**:
  - Update `AdminLayout.tsx` to conditionally hide `AdminTopBar` when `layoutMode === "sidebar"`.
  - Add `SidebarSystemDock.tsx` component inside `Sidebar.tsx` pinned to the bottom.
  - Maintain mobile header / drawer trigger cleanly on small screens.
- **Sub-task 2: Unified Slide-over Drawer with URL State**:
  - Implement `useDrawerSearchParams` hook to bind URL query params (`?action=create`, `?edit=<id>`) to Drawer open/close states.
  - Refactor `BrandList.tsx` and `BrandForm` to render inside `Sheet` drawer.
  - Refactor `CategoryList.tsx` and category editor into `Sheet` drawer.
  - Refactor `AdminCollections.tsx` and collection form/product assignment into `Sheet` drawer.
- **Sub-task 3: Morphing Table Action Dock**:
  - Build `TableActionDock.tsx` in `shared/ui` with idle and batch-selected morphing states.
  - Integrate into `BrandList.tsx`, `AdminCollections.tsx`, and `CategoryList.tsx`.

## Testing Decisions
- Test URL bookmarking: Navigating directly to `/admin/brand?action=create` or `/admin/brand?edit=1` opens the corresponding drawer on initial load.
- Test closing the drawer resets the URL parameters cleanly via `history.replaceState` or React Router `setSearchParams`.
- Verify full layout switching: Sidebar mode has no TopBar and includes the System Dock at the bottom; Topbar mode retains `AdminHorizontalNavbar`.
- Verify Turbo build and TypeScript typecheck pass 100%.
