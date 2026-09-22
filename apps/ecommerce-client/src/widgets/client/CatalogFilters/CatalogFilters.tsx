import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Filter, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@my-project/ui";
import { Input } from "@my-project/ui";

// 1. Import ReactSelect và Styles chuẩn
import ReactSelect, { SingleValue } from "react-select";
import { reactSelectLightStyles, reactSelectDarkStyles } from "@my-project/ui";
import { Label } from "@my-project/ui";
import { useFilterableAttributes } from "@entities/product/hooks";

type Option = { label: string; value: string | number; slug?: string };

function useDebounce<T>(value: T, delay = 400) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setV(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return v;
}

type Props = {
  brandOptions?: Option[];
  categoryOptions?: Option[];
  collectionOptions?: Option[];
  layout?: "horizontal" | "vertical";
};

export default function CatalogFilters({ 
  brandOptions = [], 
  categoryOptions = [], 
  collectionOptions = [],
  layout = "horizontal" 
}: Props) {
  const [sp, setSp] = useSearchParams();
  const { data: filterData } = useFilterableAttributes();

  const [q, setQ] = useState(sp.get("keyword") ?? "");
  const [brandSlug, setBrandSlug] = useState(sp.get("brandSlug") ?? "");
  const [categorySlug, setCategorySlug] = useState(sp.get("categorySlug") ?? "");
  const [collectionSlug, setCollectionSlug] = useState(sp.get("collectionSlug") ?? "");
  const [priceMin, setPriceMin] = useState(sp.get("priceMin") ?? "");
  const [priceMax, setPriceMax] = useState(sp.get("priceMax") ?? "");
  const [sort, setSort] = useState(sp.get("sort") ?? "");

  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const [isDark, setIsDark] = useState(() => 
    typeof window !== 'undefined' && document.documentElement.classList.contains('dark')
  );

  const isPriceInvalid = useMemo(() => {
    if (priceMin === "" || priceMax === "") return false;
    return parseInt(priceMin, 10) > parseInt(priceMax, 10);
  }, [priceMin, priceMax]);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const selectStyles = isDark ? reactSelectDarkStyles : reactSelectLightStyles;
  const debouncedQ = useDebounce(q);
  const debouncedPriceMin = useDebounce(priceMin, 500);
  const debouncedPriceMax = useDebounce(priceMax, 500);

  // Sync keyword with URL
  useEffect(() => {
    const next = new URLSearchParams(sp);
    if (debouncedQ !== (sp.get("keyword") ?? "")) {
         if (debouncedQ) next.set("keyword", debouncedQ);
         else next.delete("keyword");
         next.set("page", "1"); 
         setSp(next, { replace: true });
    }
  }, [debouncedQ, sp, setSp]);

  // Sync price range with URL (only when valid)
  useEffect(() => {
    if (isPriceInvalid) return;

    const next = new URLSearchParams(sp);
    const minVal = debouncedPriceMin;
    const maxVal = debouncedPriceMax;

    let changed = false;
    if (minVal !== (sp.get("priceMin") ?? "")) {
      if (minVal) next.set("priceMin", minVal);
      else next.delete("priceMin");
      changed = true;
    }
    if (maxVal !== (sp.get("priceMax") ?? "")) {
      if (maxVal) next.set("priceMax", maxVal);
      else next.delete("priceMax");
      changed = true;
    }

    if (changed) {
      next.set("page", "1");
      setSp(next, { replace: true });
    }
  }, [debouncedPriceMin, debouncedPriceMax, isPriceInvalid, sp, setSp]);

  // Sync local states if search params change externally (e.g. from chips or back button)
  useEffect(() => {
    setQ(sp.get("keyword") ?? "");
    setBrandSlug(sp.get("brandSlug") ?? "");
    setCategorySlug(sp.get("categorySlug") ?? "");
    setCollectionSlug(sp.get("collectionSlug") ?? "");
    setPriceMin(sp.get("priceMin") ?? "");
    setPriceMax(sp.get("priceMax") ?? "");
    setSort(sp.get("sort") ?? "");
  }, [sp]);

  const updateQueryParam = (key: string, value: string) => {
    const next = new URLSearchParams(sp);
    if (value && value !== "") {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    next.set("page", "1");
    setSp(next);
  };

  const onClear = () => {
    const next = new URLSearchParams(sp);
    ["brandSlug", "categorySlug", "priceMin", "priceMax", "keyword", "sort", "page", "collectionSlug", "promotionId"].forEach((k) =>
      next.delete(k)
    );
    filterData?.attributes.forEach((attr) => next.delete(attr.slug));
    setQ("");
    setBrandSlug("");
    setCategorySlug("");
    setCollectionSlug("");
    setPriceMin("");
    setPriceMax("");
    setSort("");
    setSp(next);
  };

  const sortOptions = useMemo(
    () => [
      { label: "Phổ biến", value: "" },
      { label: "Giá tăng dần", value: "price_asc" },
      { label: "Giá giảm dần", value: "price_desc" },
      { label: "Mới nhất", value: "created_desc" },
      { label: "Cũ hơn", value: "created_asc" },
    ],
    []
  );

  // Helper chuyển đổi Option cho ReactSelect
  const toReactSelectOptions = (options: Option[]) =>
    options.map(opt => ({ label: opt.label, value: String(opt.slug || opt.value) }));

  const findSelectedOption = (options: Option[], value: string) => {
    if (!value) return null;
    return toReactSelectOptions(options).find(opt => opt.value === value) || null;
  };

  const isVertical = layout === "vertical";

  return (
    <div className={`flex flex-col gap-4 ${isVertical ? "space-y-2" : "w-full"}`}>
      {/* BASIC VIEW: Always visible */}
      <div className={isVertical ? "space-y-4" : "flex flex-col lg:flex-row lg:items-end flex-wrap gap-4 bg-transparent"}>
        
        {/* Từ khóa */}
        <div className={`space-y-2 ${isVertical ? "" : "w-full lg:flex-1 min-w-[200px]"}`}>
          <label className="text-xs font-semibold text-muted   tracking-wider ml-1">Từ khóa</label>
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm sản phẩm..."
          />
        </div>

        {/* Sắp xếp */}
        <div className={`space-y-2 ${isVertical ? "" : "w-full lg:w-56"}`}>
          <label className="text-xs font-semibold text-muted   tracking-wider ml-1">Sắp xếp</label>
          <ReactSelect
            value={findSelectedOption(sortOptions, sort)}
            onChange={(val: SingleValue<{ label: string; value: string }>) => {
              const nextVal = String(val?.value ?? '');
              setSort(nextVal);
              updateQueryParam("sort", nextVal);
            }}
            placeholder="Mặc định"
            options={toReactSelectOptions(sortOptions)}
            styles={selectStyles}
            menuPortalTarget={document.body}
            isClearable
          />
        </div>

        {/* Advanced Search Button */}
        <div className={isVertical ? "pt-2" : "w-full lg:w-auto lg:self-end"}>
          <Button 
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)} 
            variant="outline"
            className={`w-full lg:w-auto hover:bg-accent/50 hover:border-accent font-semibold   tracking-wider h-8 px-5 gap-2 ${
              isAdvancedOpen 
                ? "bg-accent/50 border-accent" 
                : ""
            }`}
          >
            <Filter className="w-4 h-4" />
            Tìm kiếm nâng cao
            {isAdvancedOpen ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
          </Button>
        </div>
      </div>

      {/* ADVANCED VIEW: Toggleable */}
      {isAdvancedOpen && (
        <div className={`flex flex-col gap-4 pt-4 border-t border-border animate-in fade-in slide-in-from-top-2 duration-300 ${isVertical ? "" : "lg:flex-row lg:items-end flex-wrap"}`}>
          
          {/* Thương hiệu */}
          {brandOptions && brandOptions.length > 0 && (
            <div className={`space-y-2 ${isVertical ? "" : "w-full lg:w-48"}`}>
              <Label className="text-xs font-semibold text-muted   tracking-wider ml-1">Thương hiệu</Label>
              <ReactSelect 
                value={findSelectedOption(brandOptions, brandSlug)}
                onChange={(val: SingleValue<{ label: string; value: string }>) => {
                  const nextVal = String(val?.value ?? '');
                  setBrandSlug(nextVal);
                  updateQueryParam("brandSlug", nextVal);
                }}
                placeholder="Tất cả thương hiệu"
                options={toReactSelectOptions(brandOptions)}
                styles={selectStyles}
                menuPortalTarget={document.body}
                isClearable
              />
            </div>
          )}

          {/* Danh mục */}
          {categoryOptions && categoryOptions.length > 0 && (
            <div className={`space-y-2 ${isVertical ? "" : "w-full lg:w-48"}`}>
              <Label className="text-xs font-semibold text-muted   tracking-wider ml-1">Danh mục</Label>
              <ReactSelect
                value={findSelectedOption(categoryOptions, categorySlug)}
                onChange={(val: SingleValue<{ label: string; value: string }>) => {
                  const nextVal = String(val?.value ?? '');
                  setCategorySlug(nextVal);
                  updateQueryParam("categorySlug", nextVal);
                }}
                placeholder="Tất cả danh mục"
                options={toReactSelectOptions(categoryOptions)}
                styles={selectStyles}
                menuPortalTarget={document.body}
                isClearable
              />
            </div>
          )}

          {/* Bộ sưu tập */}
          {collectionOptions && collectionOptions.length > 0 && (
            <div className={`space-y-2 ${isVertical ? "" : "w-full lg:w-48"}`}>
              <Label className="text-xs font-semibold text-muted tracking-wider ml-1">Bộ sưu tập</Label>
              <ReactSelect
                value={findSelectedOption(collectionOptions, collectionSlug)}
                onChange={(val: SingleValue<{ label: string; value: string }>) => {
                  const nextVal = String(val?.value ?? '');
                  setCollectionSlug(nextVal);
                  updateQueryParam("collectionSlug", nextVal);
                }}
                placeholder="Tất cả bộ sưu tập"
                options={toReactSelectOptions(collectionOptions)}
                styles={selectStyles}
                menuPortalTarget={document.body}
                isClearable
              />
            </div>
          )}

          {/* Khoảng giá */}
          <div className={`space-y-2 ${isVertical ? "" : "w-full lg:w-52"}`}>
            <label className="text-xs font-semibold text-muted   tracking-wider ml-1">Khoảng giá (VNĐ)</label>
            <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  min={0}
                  error={isPriceInvalid}
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  placeholder="Từ"
                />
                <Input
                  type="number"
                  min={0}
                  error={isPriceInvalid}
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  placeholder="Đến"
                />
            </div>
            {isPriceInvalid && (
              <p className="text-[11px] font-semibold text-error mt-1 animate-in fade-in duration-300">
                Giá tối thiểu không được lớn hơn giá tối đa
              </p>
            )}
          </div>

          {/* Dynamic Attributes */}
          {filterData?.attributes?.filter(attr => attr.values && attr.values.length > 0).map((attr) => {
            const selectedValue = sp.get(attr.slug) ?? "";
            const options = attr.values.map((v) => ({ label: v, value: v }));
            return (
              <div key={attr.attributeId} className={`space-y-2 ${isVertical ? "" : "w-full lg:w-44"}`}>
                <Label className="text-xs font-semibold text-muted   tracking-wider ml-1">
                  {attr.name} {attr.unit ? `(${attr.unit})` : ""}
                </Label>
                <ReactSelect
                  value={selectedValue ? { label: selectedValue, value: selectedValue } : null}
                  onChange={(val: SingleValue<{ label: string; value: string }>) => {
                    const nextVal = String(val?.value ?? '');
                    updateQueryParam(attr.slug, nextVal);
                  }}
                  placeholder={`Tất cả ${attr.name}`}
                  options={options}
                  styles={selectStyles}
                  menuPortalTarget={document.body}
                  isClearable
                />
              </div>
            );
          })}

          {/* Action Buttons */}
          <div className={`pt-2 ${isVertical ? "w-full" : "w-full lg:w-auto lg:self-end lg:ml-auto"}`}>
            <Button 
              onClick={onClear} 
              variant="outline" 
              className="w-full lg:w-auto text-xs font-semibold   tracking-wider h-8 px-6"
            >
              Xóa lọc
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}