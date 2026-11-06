import { useMemo, useState, useRef, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { 
  ChevronRight, 
  SlidersHorizontal, 
  ArrowUpDown,
  Grid2x2,
  LayoutGrid,
  Grid3x3,
  Check
} from "lucide-react";
import CatalogFilterDrawer from "@components/catalog/CatalogFilterDrawer";
import CatalogFilterSidebar from "@components/catalog/CatalogFilterSidebar";
import ProductGrid, { ViewMode } from "@components/product/ProductGrid";
import { useProductList, useFilterableAttributes } from "@hooks/useProduct";
import type { ProductListParams } from "@my-project/api";
import { useBrandBySlug, useBrandOptions } from "@hooks/useBrand";
import { useCategoryBySlug, useCategoryOptions } from "@hooks/useCategory";
import { useSmartCart } from "@hooks/useSmartCart";
import { useToast, FilterDropdown, FilterDropdownOption, Button } from "@my-project/ui";
import { getProductById } from "@my-project/api";
import { usePromotion } from "@hooks/usePromotion";
import { useCollectionBySlug, useCollectionOptions } from "@hooks/useCollection";
import ActiveFilterChips from "@components/catalog/ActiveFilterChips";

const parseIntOrUndef = (v: string | null) => (v ? parseInt(v, 10) : undefined);

const sortOptions: FilterDropdownOption[] = [
  { value: "", label: "Mới Nhất" },
  { value: "price_asc", label: "Giá: Thấp → Cao" },
  { value: "price_desc", label: "Giá: Cao → Thấp" },
];



/**
 * CatalogPage Component (Editorial Haute Couture Studio Edition)
 * 
 * Cấu trúc Layout:
 * 1. Top Section: Pure Breadcrumb (Chỉ chứa đường dẫn phân cấp thuần túy, khoảng thở rộng, KHÔNG chứa viền hairline).
 * 2. Topbar Section: Tích hợp Tiêu đề trang + Con số thống kê (vd: 100 sản phẩm) + Chế độ hiển thị (2|4|6 cột) + Sắp xếp + Active Chips.
 * 3. Main Content: 2 cột Spacing chuẩn (Cột trái Accordion Filter Sidebar + Cột phải Lưới sản phẩm).
 */
export default function CatalogPage() {
  const [sp, setSp] = useSearchParams();
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("4");

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
      page: 1, // Luôn nạp từ page 1 với size tích lũy cho Infinite Scroll
      size,
    };
  }, [sp, size]);

  const { data, isLoading, isFetching } = useProductList(params);
  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const hasMore = items.length < total;

  const promotionId = parseIntOrUndef(sp.get("promotionId"));
  const { data: promotionData } = usePromotion(promotionId);

  const collectionSlug = sp.get("collectionSlug") || undefined;
  const { data: collectionData } = useCollectionBySlug(collectionSlug);

  const categorySlug = sp.get("categorySlug") || undefined;
  const { data: categoryData } = useCategoryBySlug(categorySlug);

  const brandSlug = sp.get("brandSlug") || undefined;
  const { data: brandData } = useBrandBySlug(brandSlug);

  const { options: brandOptions } = useBrandOptions();
  const { options: categoryOptions } = useCategoryOptions(); 
  const { options: collectionOptions } = useCollectionOptions();

  const { addToCart } = useSmartCart();
  const toast = useToast();

  const handleLoadMore = () => {
    if (isFetching || !hasMore) return;
    const nextSize = size + 24;
    const next = new URLSearchParams(sp);
    next.set("size", String(nextSize));
    setSp(next, { replace: true });
  };

  const handleAddToCart = async (productId: number) => {
    try {
      toast.info("Đang xử lý...");
      const productDetail = await getProductById(productId);
      const activeSku = productDetail.skus?.find((sku) => sku.isActive);
      if (!activeSku) {
        toast.error("Sản phẩm tạm thời hết hàng hoặc không có phân loại khả dụng.");
        return;
      }
      
      const primaryImage = productDetail.images?.find((img) => img.isPrimary)?.url || productDetail.images?.[0]?.url || "";

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
          setSp(next);
        }
      });
    }

    const priceMin = sp.get("priceMin");
    const priceMax = sp.get("priceMax");
    if (priceMin || priceMax) {
      let label = "";
      if (priceMin && priceMax) {
        label = `Giá: ${parseInt(priceMin).toLocaleString("vi-VN")}₫ - ${parseInt(priceMax).toLocaleString("vi-VN")}₫`;
      } else if (priceMin) {
        label = `Giá từ ${parseInt(priceMin).toLocaleString("vi-VN")}₫`;
      } else if (priceMax) {
        label = `Giá đến ${parseInt(priceMax).toLocaleString("vi-VN")}₫`;
      }
      chips.push({
        key: "price",
        label,
        onClear: () => {
          const next = new URLSearchParams(sp);
          next.delete("priceMin");
          next.delete("priceMax");
          setSp(next);
        }
      });
    }

    filterData?.attributes.forEach((attr) => {
      const val = sp.get(attr.slug);
      if (val) {
        chips.push({
          key: attr.slug,
          label: `${attr.name}: ${val}`,
          onClear: () => {
            const next = new URLSearchParams(sp);
            next.delete(attr.slug);
            setSp(next);
          }
        });
      }
    });

    return chips;
  }, [sp, brandData, categoryData, collectionData, promotionData, filterData, setSp]);

  const clearAllFilters = () => {
    const next = new URLSearchParams(sp);
    ["brandSlug", "categorySlug", "priceMin", "priceMax", "keyword", "page", "collectionSlug", "promotionId"].forEach((k) => next.delete(k));
    filterData?.attributes.forEach((attr) => next.delete(attr.slug));
    setSp(next);
  };

  const handleSortChange = (newSort: string) => {
    const next = new URLSearchParams(sp);
    if (newSort) {
      next.set("sort", newSort);
    } else {
      next.delete("sort");
    }
    setSp(next);
  };

  const pageTitle = useMemo(() => {
    const keyword = sp.get("keyword");

    if (collectionData) {
      return collectionData.name;
    }
    if (promotionData) {
      return promotionData.name;
    }
    if (keyword) {
      return `Kết quả: "${keyword}"`;
    }
    if (categoryData) {
      return categoryData.name;
    }
    if (brandData) {
      return brandData.name;
    }
    return "Tất Cả Sản Phẩm";
  }, [sp, collectionData, promotionData, categoryData, brandData]);

  const currentSort = sp.get("sort") || "";

  return (
    <div className="w-full bg-background min-h-screen">
      
      {/* Mobile Compact Trigger (<1024px) */}
      <div className="lg:hidden sticky top-16 mt-5 z-30 w-full bg-background/90 backdrop-blur-md px-4 sm:px-6 py-3 flex items-center justify-between gap-3 select-none">
        <Button
          type="button"
          onClick={() => setShowFilterDrawer(true)}
          className="gap-2 h-8 px-3.5 text-xs font-display font-medium uppercase tracking-widest rounded-[2px]"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 stroke-[1.5]" />
          <span>Bộ Lọc {activeChips.length > 0 && `(${activeChips.length})`}</span>
        </Button>

        <FilterDropdown
          options={sortOptions}
          value={currentSort}
          onSelect={handleSortChange}
          icon={<ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground stroke-[1.25] shrink-0" />}
        />
      </div>

      {/* Mobile Drawer */}
      <CatalogFilterDrawer
        isOpen={showFilterDrawer}
        onClose={() => setShowFilterDrawer(false)}
        brandOptions={brandOptions}
        categoryOptions={categoryOptions}
        collectionOptions={collectionOptions}
      />

      {/* Main Container với Spacing Chuẩn */}
      <div className="w-full px-4 sm:px-6 lg:px-10 2xl:px-12 py-4 sm:py-6 space-y-1 sm:space-y-3">
        
        {/* =========================================================
            1. PURE BREADCRUMB SECTION (CHỈ CHỨA BREADCRUMB THUẦN TÚY)
           ========================================================= */}
        <nav aria-label="Đường dẫn trang" className="flex items-center gap-2 text-xs font-display text-muted-foreground uppercase tracking-widest">
          <Link to="/" className="hover:text-foreground transition-colors">
            Trang Chủ
          </Link>
          <ChevronRight className="w-3.5 h-3.5 stroke-[1.25] text-muted-foreground/50 shrink-0" />
          <Link to="/catalog" className="hover:text-foreground transition-colors">
            Tuyển Tập
          </Link>
          {pageTitle !== "Tất Cả Sản Phẩm" && (
            <>
              <ChevronRight className="w-3.5 h-3.5 stroke-[1.25] text-muted-foreground/50 shrink-0" />
              <span className="text-foreground font-medium truncate max-w-[200px]">
                {pageTitle}
              </span>
            </>
          )}
        </nav>


        {/* =========================================================
            3. MAIN 2-COLUMN LAYOUT (ACCORDION SIDEBAR + PRODUCT GRID)
           ========================================================= */}
        <div className="flex flex-col gap-4 lg:gap-5 items-start">
          <div className="hidden lg:flex items-center w-full sticky gap-6 lg:gap-8 top-16 z-10 bg-background py-3">
            {/* Cột Trái: Cố định w-64 shrink-0 trùng khớp 100% với Sidebar bên dưới */}
            <div className="flex items-center justify-between w-64 shrink-0">
              <h1 className="text-sm sm:text-lg lg:text-xl font-display font-medium text-foreground uppercase">
                {pageTitle}
              </h1>
              <span className="text-[10px] sm:text-[11px] font-display font-medium text-muted-foreground uppercase tracking-[0.15em] shrink-0 ml-2">
                ({total})
              </span>
            </div>

            {/* Cột Phải: flex-1 min-w-0 chiếm toàn bộ phần còn lại trên đầu Lưới sản phẩm */}
            <div className="flex-1 min-w-0 flex items-center justify-between gap-4">
              {/* Active Filter Chips */}
              {activeChips.length > 0 ? (
                <div className="flex-1 min-w-0 overflow-hidden">
                  <ActiveFilterChips chips={activeChips} onClearAll={clearAllFilters} />
                </div>
              ) : (
                <div />
              )}

              {/* Controls (View Mode Switcher & Sort Selector) */}
              <div className="flex items-center gap-4 shrink-0 ml-auto">
                
                {/* View Mode Switcher */}
                <div className="hidden sm:flex items-center gap-1">
                  <span className="text-[10px] font-display uppercase tracking-widest text-muted-foreground font-medium mr-1.5">
                    Hiển Thị:
                  </span>
                  <Button
                    type="button"
                    variant={viewMode === "2" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("2")}
                    title="Chế độ 2 cột"
                    className={`h-9 w-9 p-0 rounded-[2px] ${viewMode !== "2" ? "bg-surface/70 text-muted-foreground hover:text-foreground" : ""}`}
                  >
                    <Grid2x2 className="w-3.5 h-3.5 stroke-[1.5]" />
                  </Button>
                  <Button
                    type="button"
                    variant={viewMode === "4" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("4")}
                    title="Chế độ 4 cột (Chuẩn)"
                    className={`h-9 w-9 p-0 rounded-[2px] ${viewMode !== "4" ? "bg-surface/70 text-muted-foreground hover:text-foreground" : ""}`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5 stroke-[1.5]" />
                  </Button>
                  <Button
                    type="button"
                    variant={viewMode === "6" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("6")}
                    title="Chế độ 6 cột (Mật độ cao)"
                    className={`h-9 w-9 p-0 rounded-[2px] ${viewMode !== "6" ? "bg-surface/70 text-muted-foreground hover:text-foreground" : ""}`}
                  >
                    <Grid3x3 className="w-3.5 h-3.5 stroke-[1.5]" />
                  </Button>
                </div>

                {/* Sort Selector */}
                <FilterDropdown
                  options={sortOptions}
                  value={currentSort}
                  onSelect={handleSortChange}
                  placeholder="Sắp Xếp:"
                  icon={<ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground stroke-[1.25] shrink-0" />}
                />

              </div>
            </div>

          </div>
          {/* Title and Product Count */}
          <div className="w-full flex gap-6 lg:gap-8 items-start">

          {/* Left Accordion Sidebar (Dính ngay dưới Sticky Topbar tại top-[112px]) */}
          <div className="hidden lg:block w-64 shrink-0 sticky top-[112px] max-h-[calc(100vh-128px)] overflow-y-auto scrollbar-none">
            <CatalogFilterSidebar
              brandOptions={brandOptions}
              categoryOptions={categoryOptions}
              collectionOptions={collectionOptions}
              activeChips={activeChips}
              onClearAllFilters={clearAllFilters}
            />
          </div>

          {/* Right Product Grid */}
          <div className="flex-1 min-w-0">

            {/* Lưới sản phẩm */}
            <ProductGrid
              list={items}
              isLoading={isLoading}
              isLoadingMore={isFetching && items.length > 0}
              hasMore={hasMore}
              viewMode={viewMode}
              skeletonCount={size}
              emptyText="Không tìm thấy sản phẩm nào phù hợp với bộ lọc hiện tại."
              onAddToCart={handleAddToCart}
              onLoadMore={handleLoadMore}
            />
          </div>
          </div>
          

        </div>

      </div>

    </div>
  );
}
