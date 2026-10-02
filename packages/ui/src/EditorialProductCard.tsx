import { forwardRef, ReactNode, MouseEvent, useState } from "react";
import { cn } from "./utils";

// ── 9/16 to 3/4 Morphing High-Fashion Editorial Product Card (Direction 3) ──
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
  onAddToCart?: (e: MouseEvent<HTMLButtonElement>) => void; // Backwards-compatible alias
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
    const [imgSrc, setImgSrc] = useState(imageUrl);
    const [imgError, setImgError] = useState(false);

    const formattedPrice = formatPrice(price);
    const formattedOriginalPrice = originalPrice ? formatPrice(originalPrice) : null;
    const handleQuickAction = onQuickBuy || onAddToCart;

    // Helper for rendering link or fallback <a>
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
          "group relative max-w-[300px] overflow-hidden select-none m-0 font-display",
          "md:aspect-[9/16] flex flex-col justify-around cursor-pointer",
          isOutOfStock && "opacity-60 contrast-90",
          className
        )}
      >
        {/* 1. MEDIA CONTAINER (ẢNH):
            - Mobile: aspect-[3/4]
            - Desktop at Rest: Chiếm h-[calc(100%-48px)] để Ảnh + Tên sản phẩm (48px) = đúng 9/16
            - Desktop on Hover: Co ngắn lại thành h-[75%] (chuẩn tỷ lệ 3/4) mượt mà 500ms không giật CLS */}
        <div
          className={cn(
            "relative w-full aspect-[3/4] md:aspect-auto md:h-[calc(100%-48px)] md:group-hover:h-[75%]",
            "transition-[height] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden bg-card shrink-0",
            isOutOfStock && "grayscale"
          )}
        >
          {/* Main Clickable Image Layer */}
          {renderAnchorOrLink(
            <>
              {!imgError ? (
                <img
                  src={imgSrc}
                  alt={name}
                  loading="lazy"
                  onError={() => {
                    setImgError(true);
                  }}
                  className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-surface text-muted-foreground p-4 text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8 opacity-40 mb-2 stroke-[1]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="0" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  <span className="text-[10px] uppercase tracking-widest opacity-60">Hình ảnh tuyển chọn</span>
                </div>
              )}

              {/* Alternate Image on Hover (Cross-fade) */}
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
            <div className="absolute top-3 left-3 z-20 px-2.5 py-1 border border-border/80 bg-background/90 backdrop-blur-sm pointer-events-none">
              <span className="text-[9px] font-display font-medium uppercase tracking-[0.2em] text-muted-foreground">
                HẾT HÀNG
              </span>
            </div>
          ) : badgeText ? (
            <div className="absolute top-3 left-3 z-20 px-2 py-0.5 border border-border/60 bg-background/90 backdrop-blur-sm pointer-events-none">
              <span className="text-[9px] font-display font-semibold uppercase tracking-widest text-foreground">
                {badgeText}
              </span>
            </div>
          ) : null}

          {/* Floating Wishlist Button (Top-Right, Direction 3 High-Fashion) */}
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
                "absolute top-3 right-3 z-20 w-8 h-8 flex items-center justify-center border transition-all duration-300 shrink-0 rounded-none",
                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground",
                "opacity-100 md:opacity-0 md:group-hover:opacity-100 md:-translate-y-1 md:group-hover:translate-y-0",
                isWishlisted
                  ? "bg-foreground text-background border-foreground"
                  : "border-border/70 bg-background/85 backdrop-blur-sm hover:bg-foreground hover:text-background hover:border-foreground text-foreground"
              )}
              aria-label={isWishlisted ? "Bỏ yêu thích" : "Yêu thích"}
              title={isWishlisted ? "Bỏ yêu thích" : "Yêu thích"}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill={isWishlisted ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="1.25"
                className="w-3.5 h-3.5 transition-transform duration-200 active:scale-90"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </svg>
            </button>
          )}
        </div>

        {/* 2. INFORMATION AREA (Direction 3: Tên sản phẩm, Giá & Quick Buy ở chân thẻ):
            - Desktop at Rest: 48px cố định ở đáy thẻ
            - Desktop on Hover: Mở rộng thành 25% chiều cao, hiển thị thương hiệu, tên, giá và Quick Buy
            - Mobile: Luôn hiển thị đầy đủ bên dưới ảnh */}
        <div className="w-full bg-background flex items-start mt-3 md:h-[48px] justify-between gap-3 md:group-hover:h-[25%] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden shrink-0 z-10">
          {/* Information Column (Left) */}
          {renderAnchorOrLink(
            <div className="flex flex-col min-w-0 pr-1 justify-center h-full">
              {brandName && (
                <span className="text-[9px] font-display uppercase tracking-widest text-muted-foreground truncate hidden md:group-hover:inline mb-0.5">
                  {brandName}
                </span>
              )}
              <h3 className="font-display font-medium text-xs sm:text-sm text-foreground tracking-tight line-clamp-1 group-hover:text-muted-foreground transition-colors duration-200">
                {name}
              </h3>

              {/* Price:
                  - Mobile: always visible
                  - Desktop: revealed smoothly on hover */}
              <div className="flex items-baseline gap-2 mt-1 md:hidden md:group-hover:flex transition-opacity duration-300">
                <span className="font-display text-xs sm:text-sm font-semibold text-foreground">
                  {formattedPrice}
                </span>
                {formattedOriginalPrice && (
                  <span className="font-display text-[10px] sm:text-xs text-muted-foreground line-through">
                    {formattedOriginalPrice}
                  </span>
                )}
              </div>
            </div>,
            "flex-1 min-w-0 block focus:outline-none"
          )}

          {/* Action Buttons: Quick Buy Plus / Option A SKU Select Trigger (Right) */}
          <div className="flex items-center gap-1.5 md:hidden md:group-hover:flex transition-opacity duration-300 shrink-0">
            {handleQuickAction ? (
              <button
                type="button"
                disabled={isOutOfStock}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleQuickAction(e);
                }}
                className={cn(
                  "h-8 px-2.5 flex items-center gap-1.5 border border-border/70 bg-background/90 backdrop-blur-sm",
                  "hover:bg-foreground hover:text-background hover:border-foreground transition-all duration-200 shrink-0 text-foreground group/btn",
                  "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground rounded-none",
                  isOutOfStock && "opacity-40 cursor-not-allowed hover:bg-background hover:text-foreground hover:border-border/70"
                )}
                aria-label={quickBuyLabel || "Chọn biến thể và mua nhanh"}
                title={isOutOfStock ? "Sản phẩm tạm hết hàng" : (quickBuyLabel || "Chọn size & mua nhanh")}
              >
                <span className="text-[10px] font-display uppercase tracking-wider font-medium hidden sm:inline">
                  {quickBuyLabel || "CHỌN SIZE"}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:rotate-90"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </button>
            ) : (
              renderAnchorOrLink(
                <span className="h-8 px-2.5 border border-border/70 bg-background/90 backdrop-blur-sm hover:bg-foreground hover:text-background hover:border-foreground flex items-center gap-1.5 transition-all duration-200 shrink-0 text-foreground group/btn focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground rounded-none">
                  <span className="text-[10px] font-display uppercase tracking-wider font-medium hidden sm:inline">
                    XEM NGAY
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-0.5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </span>,
                "shrink-0 block focus:outline-none"
              )
            )}
          </div>
        </div>
      </div>
    );
  }
);

EditorialProductCard.displayName = "EditorialProductCard";
