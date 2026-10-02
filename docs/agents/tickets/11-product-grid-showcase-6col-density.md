# Ticket 11: Redesign ProductGridShowcase to High-Density 6-Column Grid

## What to build
Update `ProductGridShowcase` and `ProductCardSkeleton` to adopt a high-density 6-column grid layout on Desktop (`grid-cols-2 md:grid-cols-3 lg:grid-cols-6`), while maintaining 2-column vertical scrolling on Mobile to prevent horizontal swipe traps. Ensure product titles, brand names, and price formatting fit cleanly at narrow column widths (~195px) with 1-line truncation (`truncate line-clamp-1 break-all`).

## Acceptance criteria
- [ ] Update `ProductGridShowcase` container to `grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-4 sm:gap-x-6 gap-y-10 lg:gap-y-14`.
- [ ] Update loading skeleton grid in `ProductGridShowcase` to 6 columns (`lg:grid-cols-6`) matching the actual grid to eliminate CLS.
- [ ] Ensure functional category filter tabs (`Tất Cả`, `Mới Về`, `Bán Chạy`, `Áo`, `Quần`) work cleanly with the 6-column layout.
- [ ] Verify product titles and prices do not wrap or overflow on 195px wide cards.
- [ ] Bottom CTA link ("Khám Phá Toàn Bộ Tuyển Tập ->") remains properly centered and styled.

## Blocked by
- Ticket 10: Redesign CategoryQuickNav to Hairline Studio Icon Tiles.
