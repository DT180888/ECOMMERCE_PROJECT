import { forwardRef, ReactNode, MouseEvent, useState } from "react";
import { Heart, Plus, ImageSquare } from "@phosphor-icons/react";
import { cn } from "../shared/utils";

// ── Pure Editorial Product Card (Fixed 3:4 Studio Edition) ──
export interface EditorialProductCardProps {
  id?: string | number;
  name: string;
  price: number | string;
  originalPrice?: number | string;
  imageUrl: string;
  alternateImageUrl?: string;
  brandName?: string;
  variantsText?: string;
  detailUrl?: string;
  badgeText?: string;
  isOutOfStock?: boolean;
  isWishlisted?: boolean;
  quickBuyLabel?: string;
  onToggleWishlist?: (e: MouseEvent<HTMLButtonElement>) => void;
  onQuickBuy?: (e: MouseEvent<HTMLButtonElement>) => void;
  onAddToCart?: (e: MouseEvent<HTMLButtonElement>) => void;
  formatPrice?: (price: number | string) => string;
  renderLink?: (props: { to: string; className?: string; children: ReactNode }) => ReactNode;
  className?: string;
}

const defaultFormatPrice = (val: number | string) => {
  if (typeof val === "string") return val;
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val);
};

export const EditorialProductCard = forwardRef<HTMLDivElement, EditorialProductCardProps>(
  (
    {
      name,
      price,
      originalPrice,
      imageUrl,
      alternateImageUrl,
      brandName,
      detailUrl = "#",
      badgeText,
      isOutOfStock = false,
      isWishlisted = false,
      quickBuyLabel,
      onToggleWishlist,
      onQuickBuy,
      onAddToCart,
      formatPrice = defaultFormatPrice,
      renderLink,
      className,
    },
    ref
  ) => {
    const [imgSrc] = useState(imageUrl);
    const [imgError, setImgError] = useState(false);

    const formattedPrice = formatPrice(price);
    const formattedOriginalPrice = originalPrice ? formatPrice(originalPrice) : null;
    const handleQuickAction = onQuickBuy || onAddToCart;

    const renderAnchorOrLink = (content: ReactNode, linkClass: string) => {
      if (renderLink && detailUrl) {
        return renderLink({ to: detailUrl, className: linkClass, children: content });
      }
      return (
        <a href={detailUrl} className={linkClass}>
          {content}
        </a>
      );
    };

    return (
      <div
        ref={ref}
        className={cn(
          "group relative w-full flex flex-col m-0 select-none font-display cursor-pointer",
          isOutOfStock && "opacity-60 contrast-90",
          className
        )}
      >
        {/* MEDIA CONTAINER (Aspect 3:4 cố định 100%, không morphing chiều cao) */}
        <div
          className={cn(
            "relative w-full aspect-[3/4] overflow-hidden bg-card shrink-0 border border-border/60 rounded-[2px]",
            isOutOfStock && "grayscale"
          )}
        >
          {renderAnchorOrLink(
            <>
              {!imgError ? (
                <img
                  src={imgSrc}
                  alt={name}
                  loading="lazy"
                  onError={() => setImgError(true)}
                  className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-surface text-muted-foreground p-4 text-center">
                  <ImageSquare className="w-8 h-8 opacity-40 mb-2" weight="light" />
                  <span className="text-[10px] uppercase tracking-widest opacity-60">Hình ảnh tuyển chọn</span>
                </div>
              )}

              {alternateImageUrl && !imgError && (
                <img
                  src={alternateImageUrl}
                  alt={`${name} lookbook 02`}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover object-center opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out"
                />
              )}
            </>,
            "absolute inset-0 w-full h-full block focus-visible:outline-none"
          )}

          {/* Badges (Top-Left) */}
          {isOutOfStock ? (
            <div className="absolute top-2.5 left-2.5 z-20 px-2 py-0.5 border border-border/60 bg-background/90 backdrop-blur-sm pointer-events-none rounded-[2px]">
              <span className="text-[9px] font-display font-medium uppercase tracking-widest text-muted-foreground">
                HẾT HÀNG
              </span>
            </div>
          ) : badgeText ? (
            <div className="absolute top-2.5 left-2.5 z-20 px-2 py-0.5 border border-border/60 bg-background/90 backdrop-blur-sm pointer-events-none rounded-[2px]">
              <span className="text-[9px] font-display font-semibold uppercase tracking-widest text-foreground">
                {badgeText}
              </span>
            </div>
          ) : null}

          {/* Floating Wishlist Button (Top-Right) */}
          {onToggleWishlist && (
            <button
              type="button"
              disabled={isOutOfStock}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleWishlist(e);
              }}
              className={cn(
                "absolute top-2.5 right-2.5 z-20 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center border transition-all duration-300 shrink-0 rounded-[2px] cursor-pointer",
                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground",
                "opacity-100 md:opacity-0 md:group-hover:opacity-100 md:-translate-y-1 md:group-hover:translate-y-0",
                isWishlisted
                  ? "bg-foreground text-background border-foreground"
                  : "border-border/60 bg-background/85 backdrop-blur-sm hover:bg-foreground hover:text-background hover:border-foreground text-foreground"
              )}
              aria-label={isWishlisted ? "Bỏ yêu thích" : "Yêu thích"}
              title={isWishlisted ? "Bỏ yêu thích" : "Yêu thích"}
            >
              <Heart
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 active:scale-90"
                weight={isWishlisted ? "fill" : "light"}
              />
            </button>
          )}

          {/* Desktop Floating Quick-Add Pill (Đáy ảnh, trượt nhẹ lên khi hover) */}
          {handleQuickAction && (
            <div className="hidden md:block absolute inset-x-2.5 bottom-2.5 z-20 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 ease-out pointer-events-none group-hover:pointer-events-auto">
              <button
                type="button"
                disabled={isOutOfStock}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleQuickAction(e);
                }}
                className={cn(
                  "w-full py-2 bg-foreground text-background text-[10px] font-display font-medium uppercase tracking-[0.2em] rounded-[2px] flex items-center justify-center gap-1.5 shadow-sm hover:opacity-90 transition-opacity cursor-pointer",
                  isOutOfStock && "opacity-40 cursor-not-allowed hover:opacity-40"
                )}
                aria-label={quickBuyLabel || "Chọn size & mua nhanh"}
              >
                <Plus className="w-3.5 h-3.5" weight="light" />
                <span>{quickBuyLabel || "CHỌN SIZE"}</span>
              </button>
            </div>
          )}

          {/* Mobile Quick-Add Micro Button (Góc dưới phải của ảnh trên mobile) */}
          {handleQuickAction && (
            <button
              type="button"
              disabled={isOutOfStock}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleQuickAction(e);
              }}
              className={cn(
                "md:hidden absolute bottom-2 right-2 z-20 w-7 h-7 flex items-center justify-center border border-border/60 bg-background/90 backdrop-blur-sm text-foreground rounded-[2px] active:scale-95 transition-transform cursor-pointer",
                isOutOfStock && "opacity-40 cursor-not-allowed"
              )}
              aria-label={quickBuyLabel || "Chọn size & mua nhanh"}
            >
              <Plus className="w-3.5 h-3.5" weight="light" />
            </button>
          )}
        </div>

        {/* INFORMATION AREA (100% Full-Width, giá tiền hiển thị cố định) */}
        <div className="w-full flex flex-col mt-2.5 min-w-0">
          {renderAnchorOrLink(
            <div className="flex flex-col w-full min-w-0">
              {brandName && (
                <span className="text-[9px] font-display uppercase tracking-widest text-muted-foreground truncate mb-0.5">
                  {brandName}
                </span>
              )}
              <h3 className="font-display font-medium text-xs sm:text-sm text-foreground tracking-tight truncate group-hover:text-muted-foreground transition-colors duration-200">
                {name}
              </h3>

              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-display text-xs sm:text-sm font-semibold text-foreground tracking-wider tabular-nums">
                  {formattedPrice}
                </span>
                {formattedOriginalPrice && (
                  <span className="font-display text-[10px] sm:text-xs text-muted-foreground line-through tabular-nums">
                    {formattedOriginalPrice}
                  </span>
                )}
              </div>
            </div>,
            "w-full min-w-0 block focus:outline-none"
          )}
        </div>
      </div>
    );
  }
);

EditorialProductCard.displayName = "EditorialProductCard";
