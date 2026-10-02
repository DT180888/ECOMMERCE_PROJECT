# Spec: Category Icon Nav & 6-Column Product Showcase Redesign

## Problem Statement
The current `CategoryQuickNav` component relies on large 3:4 photographic imagery which takes up significant vertical space right under the Hero section. Meanwhile, the `ProductGridShowcase` component uses a standard 4-column layout on Desktop, which limits the number of featured products displayed above-the-fold and lacks the high-density editorial feel prescribed in `DESIGN.md`.

## Solution
1. Transform `CategoryQuickNav` from image cards into a minimalist Studio Icon Matrix with 100% hairline Lucide outline icons (`stroke-[1.25]`), 1:1 / 4:3 Studio Tiles, and subtle tracking meta tags.
2. Redesign `ProductGridShowcase` to adopt a high-density 6-column layout on Desktop (`grid-cols-2 md:grid-cols-3 lg:grid-cols-6`), while maintaining 2-column vertical scrolling on Mobile to preserve UX and prevent horizontal swipe traps.
3. Synchronize `ProductCardSkeleton` to 6 columns on Desktop to eliminate CLS during loading states.

## User Stories
1. As a fast-purchasing customer, I want to see a compact, icon-based category navigation right below the Hero, so that I can quickly jump to specific product categories without excessive vertical scrolling.
2. As a fashion customer, I want to browse a high-density grid of 6 product cards per row on Desktop, so that I can view more items at a single glance.
3. As a mobile user, I want the product showcase to scroll vertically in a clean 2-column layout, so that my finger doesn't get trapped in horizontal sliders.
4. As a user with slow network speed, I want skeleton loaders that match the exact 6-column grid structure, so that the UI doesn't jump or shift when data finishes loading.

## Implementation Decisions
- **CategoryQuickNav Component**:
  - Replace photographic backgrounds with minimalist Studio Icon Tiles (`aspect-[4/3]` or `aspect-[1/1]`).
  - Map categories to Lucide icons: `Shirt` (Áo & Sơ Mi), `Scissors` (Quần & Váy), `Footprints` (Giày & Dép), `Crown` (Mũ & Nón), `ShoppingBag` (Túi & Phụ Kiện), `Sparkles` (Đồ May Đo).
  - Use `stroke-[1.25]` hairline icons inside subtle surface containers (`bg-surface`, `border border-border/60`).
  - Maintain 1-line truncation (`truncate`) for titles and meta labels (`X MẪU`).
- **ProductGridShowcase Component**:
  - Update grid layout classes to `grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-4 sm:gap-x-6 gap-y-10 lg:gap-y-14`.
  - Display 6 items (1 row) or 12 items (2 rows) cleanly on Desktop.
  - Preserve functional tabs filtering (`Tất Cả`, `Mới Về`, `Bán Chạy`, `Áo`, `Quần`).
  - Keep 1-line truncation (`truncate line-clamp-1 break-all`) on brand names and product titles to prevent layout overflow at 195px card width.
- **ProductCardSkeleton Component**:
  - Update grid skeleton wrapper in `ProductGridShowcase` loading state to `grid-cols-2 md:grid-cols-3 lg:grid-cols-6` to guarantee 0 CLS.

## Testing Decisions
- Verify single-typeface discipline (`Plus Jakarta Sans`) and color token enforcement (zero `#FFF` / `#000`).
- Test interactive filtering across all tabs (`Tất Cả`, `Mới Về`, `Bán Chạy`, `Áo`, `Quần`).
- Run `npm run build` (`turbo build`) to ensure TypeScript compilation without errors.

## Out of Scope
- Backend API contract modifications (reusing existing `@hooks/useProduct`).
- Creating new catalog pages or lookbook routes.
