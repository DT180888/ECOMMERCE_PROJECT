# Spec: CRM Admin Scandinavian Monolith & High-Density UI/UX Redesign

## Problem Statement
The current `crm-admin` application suffers from severe visual fragmentation and outdated UI debt:
1. Pervasive Neumorphic artifacts (`shadow-neo*`, `border-neo-bevel`, `rounded-card`, `rounded-button`, `rounded-inner`).
2. Heavy rounded containers and multi-layered border nesting that create visual clutter, reducing data density.
3. Ad-hoc mobile drawer implementation in `AdminLayout.tsx` that lacks smoothness, accessibility, and consistency with `@my-project/ui`.
4. Inconsistent typography, badges, and colors deviating from `DESIGN.md` and the pure editorial aesthetic established in `ecommerce-client`.

## Solution
Redesign `crm-admin` using **Direction 1: Pure Scandinavian Monolith** (united with High-Density Data Grid efficiency):
1. **Zero Pure White / Zero Pure Black**: Standardize on Light Mode (`#FAF9F6` Milk White / `#161616` Charcoal Ink) and Dark Mode (`#121212` Obsidian / `#F3F3F0` Cream).
2. **100% Flat & Hairline Precision**: Eliminate all shadows (`shadow-none`) and bevel borders. Use 1px hairline dividers (`border-border/60`).
3. **Micro Geometry**: `rounded-none` for structural containers, micro `rounded-[2px]` for interactive inputs, buttons, and badges.
4. **Unified Component System**: Leverage `@my-project/ui` primitives (`Sheet` for mobile navigation, `Button`, `Input`, `Badge`, `Toast`, `ThemeToggle`).
5. **High-Density Data & Typography**: Single-typeface `Plus Jakarta Sans`, uppercase micro-headers (`text-[10px] tracking-[0.15em]`), and `tabular-nums` for all metrics and prices.

## User Stories
1. As an admin operator, I want a clean, distraction-free monolithic workspace, so that I can focus entirely on operational data and commerce management.
2. As a mobile admin user, I want a smooth, accessible slide-over navigation sheet, so that managing the store on tablet/phone feels seamless and responsive.
3. As a store manager, I want high-density data tables and uncluttered dashboards, so that I can scan order volumes, inventory alerts, and revenue trends with zero cognitive overload.
4. As a merchant switching between Client and Admin, I want an identical aesthetic language, so that the brand experience feels cohesive and studio-grade across all touchpoints.

## Implementation Decisions
- **Ticket 21: Admin Shell & Navigation (`AdminLayout`, `Sidebar`, `AdminPageShell`)**:
  - Refactor `AdminLayout.tsx` to replace the manual mobile drawer with Radix `Sheet` from `@my-project/ui`.
  - Redesign `Sidebar.tsx` into a sleek Monolithic sidebar with hairline dividers, micro-status tags, and subtle hover disclosure.
  - Upgrade `AdminPageShell.tsx` to eliminate nested container borders and enforce editorial title hierarchy.
- **Ticket 22: Data Table & Control Primitives (`table/`, `AdminPagination`, Badges)**:
  - Overhaul `AdminTable.tsx`, `SortIcon.tsx`, `ActionCell.tsx`, and `AdminTableMobileCard.tsx`.
  - Replace pill badges with micro-status indicators (6px dot + clean label).
  - Standardize pagination on flat hairline button controls.
- **Ticket 23: Dashboard Overhaul (`Dashboard`, `StatsGrid`, `RevenueChart`, Widgets)**:
  - Flatten all KPI cards and widgets. Remove `hover:shadow-neo-hover` and `border-neo-bevel`.
  - Align revenue chart and top-selling widgets with clean hairline container boundaries and `tabular-nums`.
- **Ticket 24: Commerce & Catalog Operations (`Orders`, `Products`, `SKUs`)**:
  - Clean up order lists, order details, product forms, and SKU modals to eradicate all Neumorphism remnants.
- **Ticket 25: Marketing & Security RBAC (`Promotions`, `Slides`, `Security`)**:
  - Redesign permission matrix and coupon management with flat hairline checkboxes, tabs, and form controls.

## Testing Decisions
- Verify responsive navigation on Desktop (`>=768px`) and Mobile (`<768px` via Radix Sheet).
- Verify Dark Mode and Light Mode token compliance across all overhauled components.
- Run `npm run build` (`turbo build`) and lint checks to ensure 0 TypeScript or compile regressions.

## Out of Scope
- Backend API endpoints or database schema changes.
