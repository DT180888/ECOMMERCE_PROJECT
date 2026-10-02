# Ticket 10: Redesign CategoryQuickNav to Hairline Studio Icon Tiles

## What to build
Transform `CategoryQuickNav` from image-based cards to a compact Studio Icon Matrix using Lucide outline icons (`stroke-[1.25]`). The component should feature 1:1 / 4:3 hairline border tiles (`border-border/60`), micro labels tracking `0.2em`, item count badges, and smooth hover elevation, while maintaining mobile snap-scroll and desktop 6-column distribution.

## Acceptance criteria
- [ ] Replace Unsplash image backgrounds in `CategoryQuickNav` with Hairline Lucide icons (`Shirt`, `Scissors`, `Footprints`, `Crown`, `ShoppingBag`, `Sparkles`).
- [ ] Use `stroke-[1.25]` stroke weight for icons inside `bg-surface` containers with `border border-border/60` and `rounded-[2px]`.
- [ ] Preserve category title, subtitle, and item count badge (`X MẪU`) with 1-line truncation.
- [ ] Mobile view uses smooth horizontal snap scroll (`overflow-x-auto snap-x snap-mandatory`); Desktop uses 6-column grid (`lg:grid-cols-6`).
- [ ] No hardcoded hex colors; strictly use Tailwind semantic tokens (`bg-background`, `bg-surface`, `text-foreground`, `text-muted-foreground`, `border-border/60`).

## Blocked by
- None (can start immediately).
