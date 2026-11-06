import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Faders, ArrowCounterClockwise } from "@phosphor-icons/react";
import { useFilterableAttributes } from "@hooks/useProduct";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  Button,
  Input,
} from "@my-project/ui";

export interface CatalogFilterOption {
  label: string;
  value: string | number;
  slug?: string;
}

export interface CatalogFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  brandOptions: CatalogFilterOption[];
  categoryOptions: CatalogFilterOption[];
  collectionOptions?: CatalogFilterOption[];
}

/**
 * CatalogFilterDrawer Component (Radix Sheet Haute Couture Studio Edition)
 * 
 * Bảng lọc trượt từ lề phải (Slide-Over Drawer) chuẩn Studio Minimalist:
 * - Chuẩn hóa 100% bằng component Sheet trên nền Radix Dialog Primitives.
 * - Tự động quản lý scroll-lock, trap focus, phím ESC và chuyển động mượt mà.
 * - Tái sử dụng Button và Input từ @my-project/ui, triệt tiêu thẻ HTML thô.
 */
export default function CatalogFilterDrawer({
  isOpen,
  onClose,
  brandOptions,
  categoryOptions,
  collectionOptions = [],
}: CatalogFilterDrawerProps) {
  const [sp, setSp] = useSearchParams();
  const { data: filterData } = useFilterableAttributes();

  // Local state cho khoảng giá trước khi bấm Áp dụng
  const [priceMinInput, setPriceMinInput] = useState(sp.get("priceMin") || "");
  const [priceMaxInput, setPriceMaxInput] = useState(sp.get("priceMax") || "");

  // Đồng bộ local price state khi URL params thay đổi
  useEffect(() => {
    setPriceMinInput(sp.get("priceMin") || "");
    setPriceMaxInput(sp.get("priceMax") || "");
  }, [sp]);

  const currentCategory = sp.get("categorySlug") || "";
  const currentBrand = sp.get("brandSlug") || "";
  const currentCollection = sp.get("collectionSlug") || "";

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

  const handleApplyPrice = () => {
    const next = new URLSearchParams(sp);
    if (priceMinInput) next.set("priceMin", priceMinInput);
    else next.delete("priceMin");

    if (priceMaxInput) next.set("priceMax", priceMaxInput);
    else next.delete("priceMax");

    next.set("page", "1");
    setSp(next);
  };

  const handleQuickPricePreset = (min?: number, max?: number) => {
    const minStr = min !== undefined ? String(min) : "";
    const maxStr = max !== undefined ? String(max) : "";
    setPriceMinInput(minStr);
    setPriceMaxInput(maxStr);

    const next = new URLSearchParams(sp);
    if (minStr) next.set("priceMin", minStr);
    else next.delete("priceMin");
    if (maxStr) next.set("priceMax", maxStr);
    else next.delete("priceMax");
    next.set("page", "1");
    setSp(next);
  };

  const clearAllFilters = () => {
    setPriceMinInput("");
    setPriceMaxInput("");
    const next = new URLSearchParams(sp);
    ["brandSlug", "categorySlug", "priceMin", "priceMax", "keyword", "sort", "page", "collectionSlug", "promotionId"].forEach(
      (k) => next.delete(k)
    );
    filterData?.attributes.forEach((attr) => next.delete(attr.slug));
    setSp(next);
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full max-w-md p-0 flex flex-col justify-between">
        
        {/* Header Drawer */}
        <SheetHeader className="px-6 py-5 border-b border-border/60 bg-background/95 backdrop-blur-md sticky top-0 z-10">
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-display uppercase tracking-[0.2em] text-muted-foreground">
              Bộ Lọc Chi Tiết / Studio Filters
            </span>
            <SheetTitle className="text-sm font-medium tracking-tight text-foreground flex items-center gap-2 mt-0.5">
              <Faders className="w-4 h-4 stroke-[1.25]" weight="light" />
              <span>Tùy Chọn Lọc</span>
            </SheetTitle>
            <SheetDescription className="text-xs text-muted-foreground mt-0.5">
              Tùy chỉnh tiêu chí để tìm kiếm sản phẩm phù hợp.
            </SheetDescription>
          </div>
        </SheetHeader>

        {/* Nội dung danh sách bộ lọc cuộn dọc */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-none">

          {/* 1. DANH MỤC SẢN PHẨM */}
          {categoryOptions.length > 0 && (
            <div className="space-y-3 pb-6 border-b border-border/40">
              <span className="text-[11px] font-display uppercase tracking-[0.15em] text-muted-foreground font-medium">
                Danh Mục Thời Trang
              </span>
              <div className="flex flex-wrap gap-2 pt-1">
                <Button
                  type="button"
                  variant={currentCategory === "" ? "default" : "secondary"}
                  size="sm"
                  onClick={() => updateParam("categorySlug", "")}
                  className="rounded-[2px] tracking-wider"
                >
                  Tất Cả
                </Button>
                {categoryOptions.map((opt) => {
                  const slugStr = String(opt.slug || opt.value);
                  const isActive = currentCategory === slugStr;
                  return (
                    <Button
                      key={opt.value}
                      type="button"
                      variant={isActive ? "default" : "secondary"}
                      size="sm"
                      onClick={() => updateParam("categorySlug", slugStr)}
                      className="rounded-[2px] tracking-wider"
                    >
                      {opt.label}
                    </Button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. THƯƠNG HIỆU */}
          {brandOptions.length > 0 && (
            <div className="space-y-3 pb-6 border-b border-border/40">
              <span className="text-[11px] font-display uppercase tracking-[0.15em] text-muted-foreground font-medium">
                Thương Hiệu
              </span>
              <div className="flex flex-wrap gap-2 pt-1">
                <Button
                  type="button"
                  variant={currentBrand === "" ? "default" : "secondary"}
                  size="sm"
                  onClick={() => updateParam("brandSlug", "")}
                  className="rounded-[2px] tracking-wider"
                >
                  Tất Cả
                </Button>
                {brandOptions.map((opt) => {
                  const slugStr = String(opt.slug || opt.value);
                  const isActive = currentBrand === slugStr;
                  return (
                    <Button
                      key={opt.value}
                      type="button"
                      variant={isActive ? "default" : "secondary"}
                      size="sm"
                      onClick={() => updateParam("brandSlug", slugStr)}
                      className="rounded-[2px] tracking-wider"
                    >
                      {opt.label}
                    </Button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. BỘ SƯU TẬP */}
          {collectionOptions.length > 0 && (
            <div className="space-y-3 pb-6 border-b border-border/40">
              <span className="text-[11px] font-display uppercase tracking-[0.15em] text-muted-foreground font-medium">
                Bộ Sưu Tập (Capsule Drop)
              </span>
              <div className="flex flex-wrap gap-2 pt-1">
                <Button
                  type="button"
                  variant={currentCollection === "" ? "default" : "secondary"}
                  size="sm"
                  onClick={() => updateParam("collectionSlug", "")}
                  className="rounded-[2px] tracking-wider"
                >
                  Tất Cả
                </Button>
                {collectionOptions.map((opt) => {
                  const valStr = String(opt.value);
                  const isActive = currentCollection === valStr;
                  return (
                    <Button
                      key={opt.value}
                      type="button"
                      variant={isActive ? "default" : "secondary"}
                      size="sm"
                      onClick={() => updateParam("collectionSlug", valStr)}
                      className="rounded-[2px] tracking-wider"
                    >
                      {opt.label}
                    </Button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 4. KHOẢNG GIÁ (PRICE RANGE) */}
          <div className="space-y-4 pb-6 border-b border-border/40">
            <span className="text-[11px] font-display uppercase tracking-[0.15em] text-muted-foreground font-medium">
              Khoảng Giá (VNĐ)
            </span>

            {/* Quick Presets */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => handleQuickPricePreset(undefined, 500000)}
                className="text-[10px] tracking-wider h-8"
              >
                Dưới 500.000₫
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => handleQuickPricePreset(500000, 1000000)}
                className="text-[10px] tracking-wider h-8"
              >
                500k – 1 Triệu
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => handleQuickPricePreset(1000000, 2000000)}
                className="text-[10px] tracking-wider h-8"
              >
                1 – 2 Triệu
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => handleQuickPricePreset(2000000, undefined)}
                className="text-[10px] tracking-wider h-8"
              >
                Trên 2 Triệu
              </Button>
            </div>

            {/* Manual Inputs using Input Component */}
            <div className="flex items-center gap-3 pt-2">
              <Input
                type="number"
                placeholder="Từ..."
                value={priceMinInput}
                onChange={(e) => setPriceMinInput(e.target.value)}
                className="w-1/2"
              />
              <span className="text-muted-foreground text-xs">&ndash;</span>
              <Input
                type="number"
                placeholder="Đến..."
                value={priceMaxInput}
                onChange={(e) => setPriceMaxInput(e.target.value)}
                className="w-1/2"
              />
            </div>
          </div>

          {/* 5. THUỘC TÍNH ĐỘNG */}
          {filterData?.attributes.map((attr) => {
            const currentVal = sp.get(attr.slug) || "";
            return (
              <div key={attr.slug} className="space-y-3 pb-6 border-b border-border/40">
                <span className="text-[11px] font-display uppercase tracking-[0.15em] text-muted-foreground font-medium">
                  {attr.name}
                </span>
                <div className="flex flex-wrap gap-2 pt-1">
                  <Button
                    type="button"
                    variant={currentVal === "" ? "default" : "secondary"}
                    size="sm"
                    onClick={() => updateParam(attr.slug, "")}
                    className="rounded-[2px] tracking-wider"
                  >
                    Tất Cả
                  </Button>
                  {attr.values.map((val) => {
                    const isActive = currentVal === val;
                    return (
                      <Button
                        key={val}
                        type="button"
                        variant={isActive ? "default" : "secondary"}
                        size="sm"
                        onClick={() => updateParam(attr.slug, val)}
                        className="rounded-[2px] tracking-wider"
                      >
                        {val}
                      </Button>
                    );
                  })}
                </div>
              </div>
            );
          })}

        </div>

        {/* Footer Action Bar */}
        <SheetFooter className="border-t border-border/60 bg-background/95 backdrop-blur-md p-4 flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={clearAllFilters}
            className="w-1/3 gap-1.5"
          >
            <ArrowCounterClockwise className="w-3.5 h-3.5 stroke-[1.25]" weight="light" />
            <span>Xóa Lọc</span>
          </Button>

          <Button
            type="button"
            variant="default"
            onClick={() => {
              handleApplyPrice();
              onClose();
            }}
            className="flex-1"
          >
            Áp Dụng Bộ Lọc
          </Button>
        </SheetFooter>

      </SheetContent>
    </Sheet>
  );
}
