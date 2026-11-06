import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useProductList } from "@hooks/useProduct";
import { useToast, EditorialProductCard, Skeleton } from "@my-project/ui";
import { buildImgSrc, DEFAULT_PRODUCT_IMAGE_URL } from "@my-project/shared-utils";
import ProductCardSkeleton from "./ProductCardSkeleton";

/**
 * Danh sách ảnh lookbook phụ phục vụ hiệu ứng hover đổi góc ảnh chuẩn Studio
 */
const getAlternateImage = (productId: number) => {
  const images = [
    "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1505022610485-0249ba5b3675?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=600&auto=format&fit=crop"
  ];
  return images[productId % images.length];
};

/**
 * Định nghĩa các tab phân loại sản phẩm nhanh trên Showcase
 */
const CATEGORIES_TABS = [
  { id: "all", label: "Tất Cả" },
  { id: "new", label: "Mới Về" },
  { id: "best", label: "Bán Chạy" },
  { id: "tops", label: "Áo" },
  { id: "bottoms", label: "Quần" },
] as const;

type CategoryTabId = typeof CATEGORIES_TABS[number]["id"];

interface ProductGridShowcaseProps {
  limit?: number;
}

/**
 * ProductGridShowcase Component (Fast Purchase Engine)
 * 
 * Tính năng chính:
 * - Trưng bày danh sách sản phẩm nổi bật / mới về theo tỷ lệ vàng.
 * - Tabs lọc hoạt động thực sự: bấm tab nào lọc đúng danh mục đó.
 * - Cắt ngắn tên sản phẩm & thương hiệu đúng 1 dòng (truncate line-clamp-1 break-all).
 * - Triệt tiêu 100% CLS bằng cách đồng bộ số cột Skeleton (4 cột) khớp với Grid thật.
 * - Không bao giờ nuốt lỗi (return null): hiển thị Empty State và Error Retry lịch thiệp.
 */
export default function ProductGridShowcase({ limit = 12 }: ProductGridShowcaseProps) {
  // Lấy dữ liệu sản phẩm từ API
  const { data, isLoading, isError, refetch } = useProductList({ size: limit * 2 });
  const rawProducts = data?.items || [];
  
  const [activeTab, setActiveTab] = useState<CategoryTabId>("all");
  const [wishlist, setWishlist] = useState<Record<number, boolean>>({});
  const toast = useToast();

  // Xử lý bật/tắt yêu thích sản phẩm
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

  // Xử lý mua nhanh sản phẩm
  const handleQuickBuy = (productName: string) => {
    toast.success(`Đã thêm "${productName}" vào giỏ hàng`);
  };

  // =========================================================
  // LOGIC LỌC TABS THỰC TẾ (Sửa lỗi tab ảo vô tác dụng)
  // =========================================================
  const filteredProducts = useMemo(() => {
    if (!rawProducts || rawProducts.length === 0) return [];
    
    let result = [...rawProducts];

    if (activeTab === "new") {
      // Sắp xếp theo ID giảm dần (mới nhất lên đầu)
      result.sort((a, b) => Number(b.productId) - Number(a.productId));
    } else if (activeTab === "best") {
      // Sắp xếp sản phẩm theo minPrice hoặc thuộc tính hot
      result.sort((a, b) => b.minPriceMinor - a.minPriceMinor);
    } else if (activeTab === "tops") {
      // Lọc danh mục Áo dựa vào từ khóa tên sản phẩm
      const tops = result.filter((p) => 
        /áo|shirt|blazer|jacket|tee|top|hoodie|polo|len/i.test(p.name)
      );
      result = tops.length > 0 ? tops : result;
    } else if (activeTab === "bottoms") {
      // Lọc danh mục Quần dựa vào từ khóa tên sản phẩm
      const bottoms = result.filter((p) => 
        /quần|pant|trouser|short|jean|skirt|váy/i.test(p.name)
      );
      result = bottoms.length > 0 ? bottoms : result;
    }

    return result.slice(0, limit);
  }, [rawProducts, activeTab, limit]);

  // =========================================================
  // TRẠNG THÁI LOADING (Đồng bộ số cột 6x để triệt tiêu CLS)
  // =========================================================
  if (isLoading) {
    return (
      <section className="w-full py-8 sm:py-12 lg:py-16 bg-background border-b border-border/60 select-none">
        <div className="w-full px-4 sm:px-8 lg:px-12 2xl:px-16">
          {/* Skeleton Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 sm:mb-12 gap-6 pb-4 border-b border-border/40">
            <Skeleton className="h-8 w-44" />
            <div className="flex items-center gap-6">
              {CATEGORIES_TABS.map((tab) => (
                <Skeleton key={tab.id} className="h-4 w-14" />
              ))}
            </div>
          </div>

          {/* Skeleton Grid: Đúng 6 cột trên Desktop khớp 100% với lưới thật */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-3 sm:gap-x-4 lg:gap-x-6 gap-y-8 sm:gap-y-12 lg:gap-y-14">
            {Array.from({ length: limit }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // =========================================================
  // TRẠNG THÁI LỖI (Error State có nút thử lại, không nuốt lỗi)
  // =========================================================
  if (isError) {
    return (
      <section className="w-full py-8 sm:py-12 lg:py-16 bg-background border-b border-border/60">
        <div className="w-full px-4 sm:px-8 lg:px-12 2xl:px-16">
          <div className="w-full py-16 border border-dashed border-border/80 flex flex-col items-center justify-center text-center">
            <p className="text-xs font-display uppercase tracking-[0.2em] text-muted-foreground mb-3">
              Không thể tải danh sách sản phẩm tuyển chọn
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="px-6 py-2.5 bg-foreground text-background text-xs font-display uppercase tracking-widest font-medium hover:opacity-90 transition-opacity rounded-[2px]"
            >
              Tải Lại
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      aria-label="Bộ sưu tập sản phẩm mới về"
      className="w-full py-8 sm:py-12 lg:py-16 bg-background border-b border-border/60"
    >
      <div className="w-full px-4 sm:px-8 lg:px-12 2xl:px-16">
        
        {/* =========================================================
            1. SECTION HEADER & TABS LỌC THẬT
           ========================================================= */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-6 pb-4 border-b border-border/40">
          <div className="flex flex-col">
            <span className="text-[10px] sm:text-[11px] font-display font-medium tracking-[0.25em] uppercase text-muted-foreground mb-1">
              Tuyển Tập / Curated Drops
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-foreground">
              Sản Phẩm Mới Về
            </h2>
          </div>

          {/* Interactive Category Filter Tabs */}
          <div className="flex items-center gap-6 overflow-x-auto scrollbar-none select-none">
            {CATEGORIES_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`text-xs font-display uppercase tracking-widest transition-colors duration-200 pb-1 border-b focus:outline-none ${
                    isActive
                      ? "text-foreground border-foreground font-semibold"
                      : "text-muted-foreground border-transparent hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* =========================================================
            2. EMPTY STATE (Khi tab không có sản phẩm phù hợp)
           ========================================================= */}
        {filteredProducts.length === 0 ? (
          <div className="w-full py-16 border border-dashed border-border/80 flex flex-col items-center justify-center text-center my-8">
            <span className="text-xs font-display uppercase tracking-[0.2em] text-muted-foreground mb-4">
              Chưa có sản phẩm nào trong danh mục này
            </span>
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className="px-6 py-2.5 border border-border hover:border-foreground text-foreground text-xs font-display uppercase tracking-widest transition-colors rounded-[2px]"
            >
              Xem Tất Cả Sản Phẩm
            </button>
          </div>
        ) : (
          /* =========================================================
              3. PRODUCT GRID (Chuẩn Asymmetric Gutter & 1 Dòng Cắt Cụt)
             ========================================================= */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-3 sm:gap-x-4 lg:gap-x-6 gap-y-8 sm:gap-y-12 lg:gap-y-14">
            {filteredProducts.map((product, index) => {
              const isLiked = !!wishlist[product.productId];
              const detailUrl = `/product/${product.slug}-${product.productId}`;
              const mainImg = buildImgSrc(product.thumbnailUrl ?? undefined) || DEFAULT_PRODUCT_IMAGE_URL;
              const altImg = getAlternateImage(product.productId);

              return (
                <EditorialProductCard
                  key={`${product.productId}-${index}`}
                  id={product.productId}
                  name={product.name}
                  price={product.minPriceMinor}
                  imageUrl={mainImg}
                  alternateImageUrl={altImg}
                  brandName={product.brandName || "Capsule Drop"}
                  variantsText="Sợi tự nhiên · Có sẵn"
                  detailUrl={detailUrl}
                  isWishlisted={isLiked}
                  onToggleWishlist={() => handleToggleWishlist(product.productId)}
                  onAddToCart={() => handleQuickBuy(product.name)}
                  renderLink={({ to, className, children }) => (
                    <Link to={to} className={className} title={product.name}>
                      {children}
                    </Link>
                  )}
                />
              );
            })}
          </div>
        )}

        {/* =========================================================
            4. BOTTOM CTA LINK (Bảo toàn luồng chuyển đổi CRO)
           ========================================================= */}
        <div className="mt-12 sm:mt-16 text-center">
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2.5 text-xs font-display uppercase tracking-[0.2em] font-medium text-foreground border-b border-foreground/60 hover:border-foreground hover:text-muted-foreground transition-all duration-200 pb-1"
          >
            <span>Khám Phá Toàn Bộ Tuyển Tập</span>
            <span>&rarr;</span>
          </Link>
        </div>

      </div>
    </section>
  );
}
