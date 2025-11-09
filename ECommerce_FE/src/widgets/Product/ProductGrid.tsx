
import type { ProductCard as ProductCardType } from "@entities/product/types";
import ProductCard from "./ProductCard";

type Props = {
  items?: ProductCardType[];
  isLoading?: boolean;
  onAddToCart?: (productId: number) => void;
  emptyText?: string;
};

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-xl border border-gray-100 bg-white">
      <div className="aspect-[4/3] rounded-xl-2xl bg-gray-100" />
      <div className="p-3 space-y-2">
        <div className="h-4 w-3/4 bg-gray-100 rounded" />
        <div className="h-4 w-1/2 bg-gray-100 rounded" />
        <div className="h-9 w-full bg-gray-100 rounded-xl" />
      </div>
    </div>
  );
}

export default function ProductGrid({
  items = [],
  isLoading,
  onAddToCart,
  emptyText = "Không có sản phẩm phù hợp",
}: Props) {
  if (!isLoading && items.length === 0) {
    return <div className="text-center text-gray-500 py-10">{emptyText}</div>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
      {isLoading
        ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
        : items.map((p) => (
            <ProductCard key={p.productId} item={p} onAddToCart={onAddToCart} />
          ))}
    </div>
  );
}
