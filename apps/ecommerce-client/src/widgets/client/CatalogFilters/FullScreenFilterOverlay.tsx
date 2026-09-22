import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@my-project/ui";
import { useFilterableAttributes } from "@entities/product/hooks";

interface Option {
  label: string;
  value: string | number;
  slug?: string;
}

interface FullScreenFilterOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  brandOptions: Option[];
  categoryOptions: Option[];
  collectionOptions?: Option[];
}

export default function FullScreenFilterOverlay({ isOpen, onClose, brandOptions, categoryOptions, collectionOptions = [] }: FullScreenFilterOverlayProps) {
  const [sp, setSp] = useSearchParams();
  const { data: filterData } = useFilterableAttributes();

  const currentCategory = sp.get("categorySlug") || "";
  const currentBrand = sp.get("brandSlug") || "";
  const currentCollection = sp.get("collectionSlug") || "";
  const currentSort = sp.get("sort") || "";

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(sp);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    next.set("page", "1");
    setSp(next);
  };

  const clearAll = () => {
    const next = new URLSearchParams(sp);
    ["brandSlug", "categorySlug", "priceMin", "priceMax", "keyword", "sort", "page", "collectionSlug", "promotionId"].forEach((k) =>
      next.delete(k)
    );
    filterData?.attributes.forEach((attr) => next.delete(attr.slug));
    setSp(next);
  };

  if (!isOpen) return null;

  const sortOptions = [
    { label: "Mới nhất", value: "created_desc" },
    { label: "Giá tăng dần", value: "price_asc" },
    { label: "Giá giảm dần", value: "price_desc" },
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-background flex flex-col animate-in fade-in zoom-in-95 duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-6 sm:p-10 border-b border-muted/10 shrink-0">
        <h2 className="text-2xl sm:text-4xl font-bold text-foreground tracking-tighter uppercase">Bộ lọc</h2>
        <button
          onClick={onClose}
          className="text-foreground w-12 h-12 rounded-full bg-background shadow-neo-sm hover:shadow-neo-inset-sm flex items-center justify-center p-0 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <span className="text-xl">✕</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-10 sm:py-16 lg:px-24 flex justify-center">
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 md:gap-20">
          
          {/* Category */}
          {categoryOptions && categoryOptions.length > 0 && (
            <div className="space-y-8">
              <h3 className="text-[10px] md:text-xs font-semibold text-muted uppercase tracking-[0.3em] pb-4 border-b border-muted/10">Danh mục</h3>
              <div className="flex flex-col items-start gap-5">
                <button
                  onClick={() => updateParam("categorySlug", "")}
                  className={`text-3xl md:text-xl lg:text-2xl font-bold tracking-tight uppercase transition-all duration-300 hover:translate-x-2 hover:text-primary ${currentCategory === "" ? "text-foreground" : "text-muted/40"}`}
                >
                  Tất cả
                </button>
                {categoryOptions.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => updateParam("categorySlug", String(opt.slug))}
                    className={`text-3xl md:text-xl lg:text-2xl font-bold tracking-tight uppercase transition-all duration-300 hover:translate-x-2 hover:text-primary text-left ${currentCategory === String(opt.slug) ? "text-foreground" : "text-muted/40"}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Brand */}
          {brandOptions && brandOptions.length > 0 && (
            <div className="space-y-8">
              <h3 className="text-[10px] md:text-xs font-semibold text-muted uppercase tracking-[0.3em] pb-4 border-b border-muted/10">Thương hiệu</h3>
              <div className="flex flex-col items-start gap-5">
                <button
                  onClick={() => updateParam("brandSlug", "")}
                  className={`text-3xl md:text-xl lg:text-2xl font-bold tracking-tight uppercase transition-all duration-300 hover:translate-x-2 hover:text-primary ${currentBrand === "" ? "text-foreground" : "text-muted/40"}`}
                >
                  Tất cả
                </button>
                {brandOptions.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => updateParam("brandSlug", String(opt.slug))}
                    className={`text-3xl md:text-xl lg:text-2xl font-bold tracking-tight uppercase transition-all duration-300 hover:translate-x-2 hover:text-primary text-left ${currentBrand === String(opt.slug) ? "text-foreground" : "text-muted/40"}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Collection */}
          {collectionOptions && collectionOptions.length > 0 && (
            <div className="space-y-8">
              <h3 className="text-[10px] md:text-xs font-semibold text-muted uppercase tracking-[0.3em] pb-4 border-b border-muted/10">Bộ sưu tập</h3>
              <div className="flex flex-col items-start gap-5">
                <button
                  onClick={() => updateParam("collectionSlug", "")}
                  className={`text-3xl md:text-xl lg:text-2xl font-bold tracking-tight uppercase transition-all duration-300 hover:translate-x-2 hover:text-primary ${currentCollection === "" ? "text-foreground" : "text-muted/40"}`}
                >
                  Tất cả
                </button>
                {collectionOptions.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => updateParam("collectionSlug", String(opt.value))}
                    className={`text-3xl md:text-xl lg:text-2xl font-bold tracking-tight uppercase transition-all duration-300 hover:translate-x-2 hover:text-primary text-left ${currentCollection === String(opt.value) ? "text-foreground" : "text-muted/40"}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Dynamic Attributes */}
          {filterData?.attributes?.filter(attr => attr.values && attr.values.length > 0).map((attr) => {
            const selectedVal = sp.get(attr.slug) ?? "";
            return (
              <div key={attr.attributeId} className="space-y-8">
                <h3 className="text-[10px] md:text-xs font-semibold text-muted uppercase tracking-[0.3em] pb-4 border-b border-muted/10">
                  {attr.name} {attr.unit ? `(${attr.unit})` : ""}
                </h3>
                <div className="flex flex-col items-start gap-5">
                  <button
                    onClick={() => updateParam(attr.slug, "")}
                    className={`text-2xl md:text-lg lg:text-xl font-bold tracking-tight uppercase transition-all duration-300 hover:translate-x-2 hover:text-primary ${selectedVal === "" ? "text-foreground" : "text-muted/40"}`}
                  >
                    Tất cả
                  </button>
                  {attr.values.map(val => (
                    <button
                      key={val}
                      onClick={() => updateParam(attr.slug, val)}
                      className={`text-2xl md:text-lg lg:text-xl font-bold tracking-tight uppercase transition-all duration-300 hover:translate-x-2 hover:text-primary text-left ${selectedVal === val ? "text-foreground" : "text-muted/40"}`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Sort */}
          <div className="space-y-8">
            <h3 className="text-[10px] md:text-xs font-semibold text-muted uppercase tracking-[0.3em] pb-4 border-b border-muted/10">Sắp xếp</h3>
            <div className="flex flex-col items-start gap-5">
              <button
                onClick={() => updateParam("sort", "")}
                className={`text-2xl md:text-lg lg:text-xl font-bold tracking-tight uppercase transition-all duration-300 hover:translate-x-2 hover:text-primary ${currentSort === "" ? "text-foreground" : "text-muted/40"}`}
              >
                Phổ biến
              </button>
              {sortOptions.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => updateParam("sort", opt.value)}
                  className={`text-2xl md:text-lg lg:text-xl font-bold tracking-tight uppercase transition-all duration-300 hover:translate-x-2 hover:text-primary text-left ${currentSort === opt.value ? "text-foreground" : "text-muted/40"}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          
        </div>
      </div>

      {/* Footer CTA */}
      <div className="p-6 sm:p-10 border-t border-muted/10 shrink-0 bg-background/95 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-6">
        <button
          onClick={clearAll}
          className="text-sm font-semibold text-muted hover:text-foreground transition-colors uppercase tracking-widest underline underline-offset-4"
        >
          Xóa tất cả bộ lọc
        </button>
        <Button
          onClick={onClose}
          className="w-full sm:w-auto text-sm font-bold uppercase tracking-widest h-16 px-12 bg-foreground text-background hover:bg-foreground/90 rounded-none shadow-neo-sm"
        >
          Xem kết quả
        </Button>
      </div>
    </div>
  );
}
