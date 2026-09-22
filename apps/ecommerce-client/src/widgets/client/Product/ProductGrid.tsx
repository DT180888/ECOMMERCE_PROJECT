import type { ProductCard as ProductCardType } from "@entities/product/types"; 
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";
import { RectangleStackIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { InViewAnimate } from "@my-project/ui";

type Props = {
  list: ProductCardType[];
  isLoading?: boolean;
  className?: string;
  skeletonCount?: number; 
  emptyText?: string;
  onAddToCart?: (productId: number) => void;
};

export default function ProductGrid({ 
  list, 
  isLoading = false, 
  className = "",
  skeletonCount = 10, 
  emptyText = "Chưa có sản phẩm nào.",
  onAddToCart
}: Props) {
  
  if (isLoading) {
    return (
      <div className={`responsive-product-grid ${className}`}>
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!list || list.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-transparent animate-in fade-in duration-700 mx-auto max-w-md w-full">
         <div className="w-16 h-16 rounded-full bg-transparent border border-muted/20 flex items-center justify-center mb-6 text-muted">
            <RectangleStackIcon className="w-8 h-8" />
         </div>
         <h3 className="text-lg font-semibold text-foreground px-8 text-center tracking-wide">{emptyText}</h3>
         <p className="text-xs text-muted mt-2 font-medium uppercase tracking-wider">Vui lòng thử lại sau.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
        <div 
          className={`
            responsive-product-grid 
            ${className}
          `}
        >
          {list.map((item, index) => (
            <InViewAnimate key={item.productId} delay={(index % 4) * 100}>
              <ProductCard 
                item={item} 
                onAddToCart={onAddToCart} 
              />
            </InViewAnimate>
          ))}
        </div>

        {/* Editorial "End of List" Indicator */}
        <div className="flex flex-col items-center gap-6 py-12">
            <div className="h-[1px] w-24 bg-muted/20" />
            <div className="flex items-center gap-4 text-muted font-mono text-[10px] uppercase tracking-[0.4em]">
                <CheckCircleIcon className="w-3 h-3 md:w-4 md:h-4" />
                Bạn đã xem hết danh sách
            </div>
            <div className="h-[1px] w-24 bg-muted/20" />
        </div>
    </div>
  );
}
