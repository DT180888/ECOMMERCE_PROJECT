import { useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import FullScreenFilterOverlay from "@widgets/client/CatalogFilters/FullScreenFilterOverlay";
import ActiveFilterChips from "@widgets/client/CatalogFilters/ActiveFilterChips";
import CatalogFilters from "@widgets/client/CatalogFilters/CatalogFilters";
import ProductGrid from "@widgets/client/Product/ProductGrid";
import Hero from "@widgets/client/Hero/Hero";
import { useProductList, useFilterableAttributes } from "@entities/product/hooks";
import type { ProductListParams } from "@entities/product/types";
import { Button } from "@my-project/ui";
import { useBrandBySlug, useBrandOptions } from "@entities/brand/hooks";
import { useCategoryBySlug, useCategoryOptions } from "@entities/category/hooks";
import { ChevronLeftIcon, ChevronRightIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

// Tầng 1 Smart/Orchestrator requirements: imports for cart and API logic
import { useSmartCart } from "@features/client/cart/useSmartCart";
import { useToast } from "@my-project/ui";
import { getProductById } from "@entities/product/api";
import { usePromotion } from "@entities/promotion/hooks";
import { useCollectionBySlug, useCollectionOptions } from "@entities/collection/hooks";

const parseIntOrUndef = (v: string | null) => (v ? parseInt(v, 10) : undefined);

export default function CatalogPage() {
  const [sp, setSp] = useSearchParams();
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const { data: filterData } = useFilterableAttributes();

  const page = parseInt(sp.get("page") || "1", 10);
  const size = parseInt(sp.get("size") || "24", 10);

  const params: ProductListParams = useMemo(() => {
    const standardKeys = ["keyword", "brandSlug", "categorySlug", "priceMin", "priceMax", "sort", "page", "size", "collectionSlug", "promotionId"];
    const attrFilters: string[] = [];
    for (const [key, value] of sp.entries()) {
      if (!standardKeys.includes(key) && value) {
        attrFilters.push(`${key}:${value}`);
      }
    }
    return {
      keyword: sp.get("keyword") || undefined,
      brandSlug: sp.get("brandSlug") || undefined,
      categorySlug: sp.get("categorySlug") || undefined,
      priceMin: parseIntOrUndef(sp.get("priceMin")),
      priceMax: parseIntOrUndef(sp.get("priceMax")),
      sort: sp.get("sort") || undefined,
      collectionSlug: sp.get("collectionSlug") || undefined,
      promotionId: parseIntOrUndef(sp.get("promotionId")),
      attrs: attrFilters.length > 0 ? attrFilters.join("|") : undefined,
      page,
      size,
    };
  }, [sp]);

  const { data, isLoading } = useProductList(params);
  const items = data?.items ?? [];
  const total = data?.total ?? 0;

  const promotionId = parseIntOrUndef(sp.get("promotionId"));
  const { data: promotionData } = usePromotion(promotionId);

  const collectionSlug = sp.get("collectionSlug") || undefined;
  const { data: collectionData } = useCollectionBySlug(collectionSlug);

  const categorySlug = sp.get("categorySlug") || undefined;
  const { data: categoryData } = useCategoryBySlug(categorySlug);

  const brandSlug = sp.get("brandSlug") || undefined;
  const { data: brandData } = useBrandBySlug(brandSlug);

  const totalPages = Math.max(1, Math.ceil(total / size));

  const goPage = (p: number) => {
    const next = new URLSearchParams(sp);
    next.set("page", String(p));
    setSp(next);
    // Scroll to top of the page smoothly when changing pages
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const { options: brandOptions } = useBrandOptions();
  const { options: categoryOptions } = useCategoryOptions(); 
  const { options: collectionOptions } = useCollectionOptions();

  // Smart Page Cart & Toast Management
  const { addToCart } = useSmartCart();
  const toast = useToast();

  const handleAddToCart = async (productId: number) => {
    try {
      toast.info("Đang xử lý...");
      const productDetail = await getProductById(productId);
      const activeSku = productDetail.skus?.find(sku => sku.isActive);
      if (!activeSku) {
        toast.error("Sản phẩm tạm thời hết hàng hoặc không có phân loại khả dụng.");
        return;
      }
      
      const primaryImage = productDetail.images?.find(img => img.isPrimary)?.url || productDetail.images?.[0]?.url || "";

      await addToCart({
        skuId: activeSku.skuId,
        productId: productDetail.productId,
        name: productDetail.name,
        skuCode: activeSku.skuCode,
        priceMinor: activeSku.priceMinor,
        quantity: 1,
        primaryImageUrl: primaryImage,
      });
      toast.success("Đã thêm sản phẩm vào giỏ hàng!");
    } catch (error) {
      console.error("Quick Add Error:", error);
      toast.error(error instanceof Error ? error.message : "Không thể thêm sản phẩm vào giỏ hàng.");
    }
  };

  const activeChips = useMemo(() => {
    const chips: { key: string; label: string; onClear: () => void }[] = [];

    const keyword = sp.get("keyword");
    if (keyword) {
      chips.push({
        key: "keyword",
        label: `Tìm kiếm: "${keyword}"`,
        onClear: () => {
          const next = new URLSearchParams(sp);
          next.delete("keyword");
          next.set("page", "1");
          setSp(next);
        }
      });
    }

    const brandSlugStr = sp.get("brandSlug");
    if (brandSlugStr && brandData) {
      chips.push({
        key: "brandSlug",
        label: `Thương hiệu: ${brandData.name}`,
        onClear: () => {
          const next = new URLSearchParams(sp);
          next.delete("brandSlug");
          next.set("page", "1");
          setSp(next);
        }
      });
    }

    const categorySlugStr = sp.get("categorySlug");
    if (categorySlugStr && categoryData) {
      chips.push({
        key: "categorySlug",
        label: `Danh mục: ${categoryData.name}`,
        onClear: () => {
          const next = new URLSearchParams(sp);
          next.delete("categorySlug");
          next.set("page", "1");
          setSp(next);
        }
      });
    }

    const collectionSlugStr = sp.get("collectionSlug");
    if (collectionSlugStr && collectionData) {
      chips.push({
        key: "collectionSlug",
        label: `Bộ sưu tập: ${collectionData.name}`,
        onClear: () => {
          const next = new URLSearchParams(sp);
          next.delete("collectionSlug");
          next.set("page", "1");
          setSp(next);
        }
      });
    }

    const promotionIdStr = sp.get("promotionId");
    if (promotionIdStr && promotionData) {
      chips.push({
        key: "promotionId",
        label: `Khuyến mãi: ${promotionData.name}`,
        onClear: () => {
          const next = new URLSearchParams(sp);
          next.delete("promotionId");
          next.set("page", "1");
          setSp(next);
        }
      });
    }

    const priceMin = sp.get("priceMin");
    const priceMax = sp.get("priceMax");
    if (priceMin || priceMax) {
      let label = "";
      if (priceMin && priceMax) {
        label = `Giá: ${parseInt(priceMin).toLocaleString("vi-VN")}đ - ${parseInt(priceMax).toLocaleString("vi-VN")}đ`;
      } else if (priceMin) {
        label = `Giá: từ ${parseInt(priceMin).toLocaleString("vi-VN")}đ`;
      } else if (priceMax) {
        label = `Giá: đến ${parseInt(priceMax).toLocaleString("vi-VN")}đ`;
      }
      chips.push({
        key: "price",
        label,
        onClear: () => {
          const next = new URLSearchParams(sp);
          next.delete("priceMin");
          next.delete("priceMax");
          next.set("page", "1");
          setSp(next);
        }
      });
    }

    // Dynamic Attribute Chips
    filterData?.attributes.forEach((attr) => {
      const val = sp.get(attr.slug);
      if (val) {
        chips.push({
          key: attr.slug,
          label: `${attr.name}: ${val}`,
          onClear: () => {
            const next = new URLSearchParams(sp);
            next.delete(attr.slug);
            next.set("page", "1");
            setSp(next);
          }
        });
      }
    });

    return chips;
  }, [sp, brandData, categoryData, collectionData, promotionData, filterData, setSp]);

  const clearAllFilters = () => {
    const next = new URLSearchParams(sp);
    ["brandSlug", "categorySlug", "priceMin", "priceMax", "keyword", "page", "collectionSlug", "promotionId"].forEach(k => next.delete(k));
    filterData?.attributes.forEach(attr => next.delete(attr.slug));
    setSp(next);
  };

  const pageTitle = useMemo(() => {
    const keyword = sp.get("keyword");

    if (collectionData) {
      return `Bộ sưu tập: ${collectionData.name}`;
    }
    if (promotionData) {
      return `Khuyến mãi: ${promotionData.name}`;
    }
    if (keyword) {
      return `Kết quả tìm kiếm cho: "${keyword}"`;
    }
    if (categoryData) {
      return `Danh mục: ${categoryData.name}`;
    }
    if (brandData) {
      return `Thương hiệu: ${brandData.name}`;
    }
    return "Tất cả sản phẩm";
  }, [sp, collectionData, promotionData, categoryData, brandData]);

  return (
    <div className="w-full">
      {/* HERO BANNER (FULL-BLEED) */}
      <div className="w-full aspect-[4/5] sm:aspect-[16/5] md:aspect-[32/5] relative overflow-hidden mb-6 lg:mb-12">
        <Hero variant="banner" />
      </div>

      <section className="client-page-container pb-8 lg:pb-12 flex flex-col gap-4 sm:gap-6 lg:gap-8">
        
        {/* Breadcrumbs & Title compact row */}
      <div className="flex flex-col gap-2">
        <nav className="text-xs font-bold text-muted flex flex-wrap items-center gap-x-2 gap-y-1 uppercase tracking-widest">
          <Link to="/" className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background">Home</Link>
          <ChevronRightIcon className="w-3 h-3 text-muted/60 shrink-0" />
          <span className="text-foreground truncate max-w-[150px] sm:max-w-[300px]">Shop</span>
        </nav>
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
          <h1 className="responsive-h3 tracking-tight text-foreground break-words line-clamp-2 max-w-full">
            {pageTitle}
          </h1>
          <p className="text-xs font-semibold text-muted uppercase tracking-wider shrink-0">
            {total} kết quả phù hợp
          </p>
        </div>
      </div>

      {/* Unified Action Bar (Desktop + Mobile) */}
      <div className="sticky top-16 left-50 z-40 glass-panel py-3 border-b border-muted/10 -mx-[0.75rem] px-[0.75rem] sm:-mx-[1.5rem] sm:px-[1.5rem] md:-mx-[2rem] md:px-[2rem] lg:-mx-[3rem] lg:px-[3rem]">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 w-full">
          
          {/* Mobile Filter Button */}
          <Button
            variant="outline"
            onClick={() => setShowMobileFilter(true)}
            className="lg:hidden flex items-center justify-center gap-2 text-foreground bg-background shadow-neo-sm hover:shadow-neo-hover active:shadow-neo-inset-sm active:translate-y-0.5 rounded-button h-11 px-6 shrink-0 w-full"
          >
            <AdjustmentsHorizontalIcon className="w-5 h-5 text-muted" />
            <span>Bộ lọc & Sắp xếp {activeChips.length > 0 && `(${activeChips.length})`}</span>
          </Button>

          {/* Desktop Inline Filters */}
          <div className="hidden lg:block w-full">
            <CatalogFilters brandOptions={brandOptions} categoryOptions={categoryOptions} collectionOptions={collectionOptions} layout="horizontal" />
          </div>
          
        </div>
        
        {/* Active Chips inline (Only show on mobile/tablet since desktop has inline filters) */}
        {activeChips.length > 0 && (
          <div className="lg:hidden w-full overflow-x-auto no-scrollbar pt-3">
            <ActiveFilterChips chips={activeChips} onClearAll={clearAllFilters} className="mb-0 flex-nowrap" />
          </div>
        )}
      </div>

      {/* Main Content Area (Full width Grid) */}
      <div className="w-full">
        {/* UNIVERSAL FILTERS (FULL-SCREEN OVERLAY) */}
        <FullScreenFilterOverlay
          isOpen={showMobileFilter}
          onClose={() => setShowMobileFilter(false)}
          brandOptions={brandOptions}
          categoryOptions={categoryOptions}
          collectionOptions={collectionOptions}
        />

        <ProductGrid
          list={items}
          isLoading={isLoading}
          skeletonCount={size}
          emptyText="Không tìm thấy sản phẩm nào phù hợp với bộ lọc hiện tại."
          onAddToCart={handleAddToCart}
        />

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-3 py-6">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => goPage(page - 1)}
              className="bg-background text-foreground h-11 w-11 p-0 flex items-center justify-center rounded-button shadow-neo-sm hover:shadow-neo-hover active:shadow-neo-inset-sm disabled:shadow-none disabled:opacity-40 disabled:pointer-events-none transition-all duration-300"
            >
              <ChevronLeftIcon className="w-3 h-3 md:w-4 md:h-4" />
            </Button>

            <div className="text-xs font-semibold text-foreground uppercase tracking-widest bg-background px-5 h-11 flex items-center justify-center rounded-button shadow-neo-sm">
              {page} / {totalPages}
            </div>

            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => goPage(page + 1)}
              className="bg-background text-foreground h-11 w-11 p-0 flex items-center justify-center rounded-button shadow-neo-sm hover:shadow-neo-hover active:shadow-neo-inset-sm disabled:shadow-none disabled:opacity-40 disabled:pointer-events-none transition-all duration-300"
            >
              <ChevronRightIcon className="w-3 h-3 md:w-4 md:h-4" />
            </Button>
          </div>
        )}
      </div>
      </section>
    </div>
  );
}
