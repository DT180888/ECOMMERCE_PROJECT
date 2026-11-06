import { useEffect, useRef } from "react";
import type { ProductCard as ProductCardType } from "@my-project/api"; 
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";
import { PackageOpen, CheckCircle2, Loader2 } from "lucide-react";
import { InViewAnimate, Button } from "@my-project/ui";

export type ViewMode = "2" | "4" | "6";

type Props = {
  list: ProductCardType[];
  isLoading?: boolean;
  isLoadingMore?: boolean;
  hasMore?: boolean;
  viewMode?: ViewMode;
  className?: string;
  skeletonCount?: number; 
  emptyText?: string;
  onAddToCart?: (productId: number) => void;
  onLoadMore?: () => void;
};

/**
 * ProductGrid Component (Dynamic Studio Edition)
 * 
 * Tính năng chính:
 * - Hỗ trợ chuyển đổi chế độ xem linh hoạt (View Mode `"2"` | `"4"` | `"6"` cột).
 * - Tự động tải thêm sản phẩm khi cuộn tới cuối trang (Infinite Scroll Sentinel).
 * - Triệt tiêu 100% Neumorphism và Font-Mono thô cũ, tuân thủ DESIGN.md.
 */
export default function ProductGrid({ 
  list, 
  isLoading = false, 
  isLoadingMore = false,
  hasMore = false,
  viewMode = "4",
  className = "",
  skeletonCount = 12, 
  emptyText = "Chưa có sản phẩm nào phù hợp với bộ lọc hiện tại.",
  onAddToCart,
  onLoadMore,
}: Props) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // IntersectionObserver cho Infinite Scroll
  useEffect(() => {
    if (!sentinelRef.current || !onLoadMore || !hasMore || isLoading || isLoadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore();
        }
      },
      { rootMargin: "300px" }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [onLoadMore, hasMore, isLoading, isLoadingMore]);

  // Class lưới động dựa vào ViewMode
  const getGridClass = () => {
    if (viewMode === "2") {
      return "grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-8 sm:gap-y-10";
    }
    if (viewMode === "6") {
      return "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-3 sm:gap-x-4 lg:gap-x-5 gap-y-6 sm:gap-y-8 lg:gap-y-10";
    }
    // Mặc định View Mode 4 Cột
    return "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 sm:gap-x-5 lg:gap-x-6 gap-y-6 sm:gap-y-8 lg:gap-y-10";
  };

  // Trạng thái Loading trang đầu
  if (isLoading) {
    return (
      <div className={`${getGridClass()} ${className}`}>
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Trạng thái Empty (Pure Editorial Edition)
  if (!list || list.length === 0) {
    return (
      <div className="w-full py-20 sm:py-28 flex flex-col items-center justify-center text-center">
        <div className="w-10 h-10 rounded-[2px] bg-surface flex items-center justify-center mb-4 text-muted-foreground/80">
          <PackageOpen className="w-5 h-5 stroke-[1.25]" />
        </div>
        <h3 className="text-sm font-display font-medium tracking-tight text-foreground uppercase px-6 max-w-md">
          {emptyText}
        </h3>
        <p className="text-[11px] font-display text-muted-foreground/70 uppercase tracking-[0.15em] mt-2">
          Vui lòng điều chỉnh hoặc xóa bớt bộ lọc để tìm thêm sản phẩm
        </p>
      </div>
    );
  }

  return (
    <div className="w-full select-none">
      {/* Lưới sản phẩm chính */}
      <div className={`${getGridClass()} ${className}`}>
        {list.map((item, index) => (
          <InViewAnimate key={`${item.productId}-${index}`} delay={(index % 4) * 60}>
            <ProductCard 
              item={item} 
              onAddToCart={onAddToCart} 
            />
          </InViewAnimate>
        ))}
      </div>

      {/* Sentinel Trigger cho Infinite Scroll */}
      <div ref={sentinelRef} className="w-full h-10 pointer-events-none" />

      {/* Indicator Trạng Thái Cuộn Tải Thêm */}
      <div className="flex flex-col items-center justify-center py-8 gap-3 border-t border-border/40 mt-8 sm:mt-12">
        {isLoadingMore ? (
          <div className="flex items-center gap-2 text-xs font-display uppercase tracking-widest text-muted-foreground animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin stroke-[1.5]" />
            <span>Đang tải thêm sản phẩm...</span>
          </div>
        ) : hasMore ? (
          <Button
            type="button"
            variant="outline"
            onClick={onLoadMore}
            className="px-6 py-2.5 text-xs font-display uppercase tracking-widest font-medium rounded-[2px]"
          >
            Tải Thêm Sản Phẩm
          </Button>
        ) : (
          <div className="flex items-center gap-2.5 text-[11px] font-display uppercase tracking-[0.2em] text-muted-foreground">
            <CheckCircle2 className="w-4 h-4 stroke-[1.25] text-foreground" />
            <span>Bạn đã xem toàn bộ {list.length} sản phẩm phù hợp</span>
          </div>
        )}
      </div>
    </div>
  );
}
