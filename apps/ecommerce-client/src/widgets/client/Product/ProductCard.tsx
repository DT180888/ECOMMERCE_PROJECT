import { Link } from "react-router-dom";
import { ProductCard as ProductCardType } from "@entities/product/types";
import { buildImgSrc } from "@shared/lib/url";
import { DEFAULT_PRODUCT_IMAGE_URL } from "@shared/constants";
import { Plus } from "lucide-react";

type Props = {
  item: ProductCardType;
  onAddToCart?: (productId: number) => void;
};

const formatVND = (minor: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(minor);

export default function ProductCard({ item, onAddToCart }: Props) {
  const to = `/product/${item.slug}-${item.productId}`;
  const serverImg = buildImgSrc(item.thumbnailUrl ?? undefined);
  const finalSrc = serverImg || DEFAULT_PRODUCT_IMAGE_URL;

  return (
    <div className="relative group bg-transparent overflow-hidden flex flex-col h-full shadow-none border-none">
      {/* 1. Image Container (with nested link) */}
      <div className="relative w-full aspect-[3/4] bg-transparent overflow-hidden flex items-center justify-center rounded-gallery shadow-none">
        <Link
          to={to}
          className="w-full h-full block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <div className="w-full h-full overflow-hidden rounded-gallery bg-background/50 flex items-center justify-center shadow-none">
            <img
              src={finalSrc}
              alt={item.name}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-[800ms] ease-out group-hover:scale-102"
              onError={(e) => {
                const target = e.currentTarget;
                if (target.src !== DEFAULT_PRODUCT_IMAGE_URL) {
                  target.src = DEFAULT_PRODUCT_IMAGE_URL;
                }
              }}
            />
          </div>
        </Link>

        {/* Floating Quick Add Button (Tactile 15% depth) */}
        {onAddToCart && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onAddToCart(item.productId);
            }}
            className="absolute bottom-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-background/80 backdrop-blur-md text-foreground border border-foreground/5 shadow-neo-sm hover:shadow-neo-hover hover:-translate-y-[1px] active:shadow-neo-inset-sm active:translate-y-[0.5px] transition-all duration-300 ease-out group/btn focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-label="Thêm nhanh"
          >
            <Plus className="w-3 h-3 md:w-4 md:h-4 transition-colors duration-300 group-hover/btn:text-accent" />
          </button>
        )}
      </div>

      {/* 2. Text Info (with nested link) */}
      <Link
        to={to}
        className="py-3.5 px-0.5 flex flex-col gap-1.5 flex-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <div className="flex flex-col">
          <span className="text-[10px] font-mono text-muted uppercase tracking-[0.2em] mb-1 select-none">
            {item.brandName || "Luxury Collection"}
          </span>
          <h3 className="text-sm font-medium text-foreground tracking-wide line-clamp-2 leading-snug group-hover:text-accent transition-colors duration-300" title={item.name}>
            {item.name}
          </h3>
        </div>

        <div className="flex items-center justify-between mt-auto pt-1 select-none">
          <span className="text-sm font-bold text-foreground/80 tracking-wider">
            {formatVND(item.minPriceMinor)}
          </span>
        </div>
      </Link>
    </div>
  );
}

