import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useProductList } from "@entities/product/hooks";
import { useToast } from "@my-project/ui";
import { buildImgSrc } from "@shared/lib/url";
import { DEFAULT_PRODUCT_IMAGE_URL } from "@shared/constants";
import { InViewAnimate } from "@my-project/ui";
import ProductCardSkeleton from "./ProductCardSkeleton";

// Currency Formatter
const formatVND = (minor: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(minor);

// Helper to get deterministic alternate fashion image
const getAlternateImage = (productId: number) => {
  const images = [
    "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1505022610485-0249ba5b3675?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=600&auto=format&fit=crop"
  ];
  return images[productId % images.length];
};

type Props = {
  limit?: number;
};

export default function ProductGridShowcase({ limit = 8 }: Props) {
  const { data, isLoading, isError } = useProductList({ size: limit });
  const products = data?.items || [];
  
  // State map for wishlist interaction
  const [wishlist, setWishlist] = useState<Record<number, boolean>>({});
  const toast = useToast();

  const handleToggleWishlist = (productId: number) => {
    setWishlist((prev) => {
      const updated = !prev[productId];
      if (updated) {
        toast.success("Đã thêm vào danh sách yêu thích");
      } else {
        toast.info("Đã xóa khỏi danh sách yêu thích");
      }
      return { ...prev, [productId]: updated };
    });
  };

  const scrollRef = useRef<HTMLDivElement>(null);
  const isHovered = useRef(false);

  useEffect(() => {
    let animationFrameId: number;
    
    const scroll = () => {
      if (scrollRef.current && !isHovered.current) {
        scrollRef.current.scrollLeft += 1; // Auto-scroll speed
        
        // Reset when reached halfway (since array is duplicated)
        if (scrollRef.current.scrollLeft >= scrollRef.current.scrollWidth / 2) {
          scrollRef.current.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    if (products.length > 0) {
      animationFrameId = requestAnimationFrame(scroll);
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, [products]);

  if (isLoading) {
    return (
      <div className="w-full bg-background shadow-none border-none ">
        <div className="client-page-container">
          {/* Header Skeleton */}
          <div className="text-center select-none mb-8 md:mb-16">
            <div className="h-3 w-36 bg-foreground/[0.05] rounded animate-pulse mx-auto mb-4" />
            <div className="h-10 w-80 bg-foreground/[0.05] rounded animate-pulse mx-auto mb-4" />
            <div className="h-4 w-48 bg-foreground/[0.05] rounded animate-pulse mx-auto" />
          </div>
          {/* Flex Skeleton */}
          <div className="flex overflow-hidden gap-4 md:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-[260px] md:w-[320px] shrink-0">
                <ProductCardSkeleton />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError || products.length === 0) {
    return null;
  }

  // Duplicate array for infinite scroll loop
  const displayProducts = [...products, ...products];

  return (
    <div className="w-full bg-background shadow-none border-none">
      <div className="client-page-container">
        
        {/* Symmetric Centered Header */}
        <div className="text-center space-y-4 mb-4 md:mb-8 select-none">
          <span className="text-[10px] font-mono text-muted tracking-[0.3em] uppercase block font-medium">
            02 / CATALOG / NEW ARRIVALS
          </span>
          <h2 className="responsive-h2 text-foreground uppercase font-serif tracking-[-0.03em] leading-[1.1]">
            THE <span className="italic font-light text-muted">SHOP</span> COLLECTION
          </h2>
          <div className="">
            <Link
              to="/catalog"
              className="group inline-flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.2em] text-foreground hover:text-accent transition-colors duration-300"
            >
              <span>Xem tất cả sản phẩm</span>
              <span className="w-8 h-[1px] bg-foreground group-hover:bg-accent group-hover:w-12 transition-all duration-300"></span>
            </Link>
          </div>
        </div>

        {/* Horizontal Marquee Layout */}
        <InViewAnimate>
          <div 
            ref={scrollRef}
            className="flex overflow-x-auto w-full gap-4 md:gap-6 pb-4 [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            onMouseEnter={() => (isHovered.current = true)}
            onMouseLeave={() => (isHovered.current = false)}
            onTouchStart={() => (isHovered.current = true)}
            onTouchEnd={() => (isHovered.current = false)}
          >
            {displayProducts.map((product, index) => {
              const isLiked = !!wishlist[product.productId];
              const detailUrl = `/product/${product.slug}-${product.productId}`;
              
              const mainImg = buildImgSrc(product.thumbnailUrl ?? undefined) || DEFAULT_PRODUCT_IMAGE_URL;
              const altImg = getAlternateImage(product.productId);

              return (
                <div 
                  key={`${product.productId}-${index}`} 
                  className="w-[260px] md:w-[320px] shrink-0 group/card relative flex flex-col h-full bg-transparent transition-transform duration-500"
                >
                  
                  {/* Image Container: 3:4 Aspect, flat, borderless */}
                  <div className="relative w-full aspect-[3/4] overflow-hidden rounded-gallery bg-foreground/[0.02]">
                    <Link to={detailUrl} className="w-full h-full block focus-visible:outline-none cursor-crosshair">
                      {/* Main Image */}
                      <img
                        src={mainImg}
                        alt={product.name}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] opacity-100 group-hover/card:scale-98"
                      />
                      {/* Hover Swap Alternate Image */}
                      <img
                        src={altImg}
                        alt={`${product.name} lookbook detail`}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] opacity-0 group-hover/card:opacity-100 scale-102 group-hover/card:scale-100"
                      />
                      
                      {/* Subtitle overlay on hover: Xem chi tiết (hidden on touch devices) */}
                      <div className="absolute inset-x-0 bottom-0 p-4 translate-y-2 opacity-0 group-hover/card:translate-y-0 group-hover/card:opacity-100 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hidden md:flex justify-center pointer-events-none">
                        <span className="text-[9px] font-mono tracking-[0.2em] text-foreground uppercase font-bold bg-background/50 backdrop-blur-md px-3 py-1.5 rounded-button border border-foreground/5 shadow-neo-sm">
                          Xem chi tiết
                        </span>
                      </div>
                    </Link>

                    {/* Floating Wishlist Button with Glassmorphism */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleToggleWishlist(product.productId);
                      }}
                      className={`absolute top-3 right-3 z-20 flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-accent md:opacity-0 md:-translate-y-2 md:group-hover/card:opacity-100 md:group-hover/card:translate-y-0
                        ${isLiked 
                          ? 'text-accent bg-background/80 shadow-neo-sm' 
                          : 'text-foreground bg-background/40 backdrop-blur-md border border-foreground/5 hover:bg-background/80 hover:shadow-neo-sm hover:scale-105'
                        }
                      `}
                      aria-label="Wishlist"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 transition-colors duration-300 ${
                          isLiked ? "fill-accent text-accent" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {/* Text & Sizing Info below image */}
                  <div className="pt-4 flex flex-col flex-1 select-none">
                    
                    {/* Brand & Number */}
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[9px] font-mono text-muted uppercase tracking-[0.2em]">
                        {product.brandName || "STUDIO COLLECTION"}
                      </span>
                      <span className="text-[9px] font-mono text-muted/40">
                        [{String((index % products.length) + 1).padStart(2, "0")}]
                      </span>
                    </div>

                    {/* Title & Price */}
                    <div className="flex justify-between items-baseline gap-4 w-full">
                      <Link to={detailUrl} className="hover:text-accent transition-colors duration-300 focus-visible:outline-none flex-1 min-w-0">
                        <h3 className="text-[13px] md:text-[14px] font-display font-medium text-foreground tracking-wide leading-tight truncate">
                          {product.name}
                        </h3>
                      </Link>
                      <span className="text-[12px] md:text-[13px] font-mono text-muted tracking-wider shrink-0">
                        {formatVND(product.minPriceMinor)}
                      </span>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        </InViewAnimate>

      </div>
    </div>
  );
}
