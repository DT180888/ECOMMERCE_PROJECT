import { useSearchParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { 
  ChevronRight,
  ChevronLeft,
  Check,
  Search,
  X
} from "lucide-react";
import { useFilterableAttributes } from "@hooks/useProduct";
import { useCategoryTree } from "@hooks/useCategory";
import type { CategoryNode } from "@my-project/api";
import type { CatalogFilterOption } from "./CatalogFilterDrawer";
import type { FilterChip } from "./ActiveFilterChips";

export interface CatalogFilterSidebarProps {
  brandOptions: CatalogFilterOption[];
  categoryOptions: CatalogFilterOption[];
  collectionOptions?: CatalogFilterOption[];
  activeChips?: FilterChip[];
  onClearAllFilters?: () => void;
}

interface FilterSectionProps {
  title: string;
  selectedValue?: string;
  headerAction?: React.ReactNode;
  searchable?: boolean;
  searchPlaceholder?: string;
  children: (searchTerm: string) => React.ReactNode;
}

/**
 * Static FilterSection Component (Always open, header title + selected value + header action)
 */
function FilterSection({ 
  title, 
  selectedValue,
  headerAction,
  searchable = false, 
  searchPlaceholder = "Tìm kiếm...", 
  children 
}: FilterSectionProps) {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-2.5">
      {/* Section Header Row */}
      <div className="flex items-center justify-between gap-2 select-none min-h-[22px]">
        <div className="flex items-baseline gap-1.5 min-w-0">
          <h3 className="text-xs font-display font-semibold uppercase tracking-[0.18em] text-foreground shrink-0">
            {title}
          </h3>
          {selectedValue && (
            <span className="text-[11px] font-display font-medium text-muted-foreground uppercase tracking-wider truncate">
              : {selectedValue}
            </span>
          )}
        </div>

        {headerAction && (
          <div className="shrink-0">
            {headerAction}
          </div>
        )}
      </div>

      <div className="space-y-2 p-1">
        {/* Micro Search Input (nếu searchable = true) */}
        {searchable && (
          <div className="relative flex items-center w-full">
            <Search className="w-3 h-3 text-muted-foreground absolute left-2.5 pointer-events-none stroke-[1.5]" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-7 pr-7 py-1 bg-surface text-xs font-display text-foreground placeholder:text-muted-foreground rounded-[2px] outline-none focus:outline-none focus:ring-1 focus:ring-foreground ring-0 border-0 transition-colors"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-2 text-muted-foreground hover:text-foreground p-0.5 cursor-pointer"
              >
                <X className="w-3 h-3 stroke-[1.5]" />
              </button>
            )}
          </div>
        )}

        {/* Scrollable Items Container (max-h-56) */}
        <div className="max-h-56 overflow-y-auto scrollbar-thin scrollbar-thumb-surface-variant space-y-1 p-1">
          {children(searchTerm.trim().toLowerCase())}
        </div>
      </div>
    </div>
  );
}

/**
 * CategoryTreeSection Component (Tree Drill-Down Navigation)
 * 
 * - Click vào danh mục bất kỳ có con sẽ đồng thời chọn và mở danh mục con.
 */
function CategoryTreeSection({
  currentCategorySlug,
  onSelectCategory,
}: {
  currentCategorySlug: string;
  onSelectCategory: (slug: string) => void;
}) {
  const { data: tree = [] } = useCategoryTree();
  const [parentStack, setParentStack] = useState<CategoryNode[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const currentParent = parentStack.length > 0 ? parentStack[parentStack.length - 1] : null;

  // Flatten toàn bộ tree phục vụ tìm kiếm phẳng khi có searchTerm
  const flattenedNodes = useMemo(() => {
    const list: { node: CategoryNode; path: string }[] = [];
    const walk = (nodes: CategoryNode[], pathPrefix = "") => {
      for (const n of nodes) {
        const fullPath = pathPrefix ? `${pathPrefix} > ${n.name}` : n.name;
        list.push({ node: n, path: fullPath });
        if (n.children?.length) {
          walk(n.children, fullPath);
        }
      }
    };
    walk(tree);
    return list;
  }, [tree]);

  const filteredSearchList = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const term = searchTerm.trim().toLowerCase();
    return flattenedNodes.filter((item) =>
      item.node.name.toLowerCase().includes(term) || item.path.toLowerCase().includes(term)
    );
  }, [searchTerm, flattenedNodes]);

  const activeNodes = currentParent ? currentParent.children ?? [] : tree;

  const handleCategoryClick = (node: CategoryNode) => {
    onSelectCategory(currentCategorySlug === node.slug ? "" : node.slug);
    if (node.children && node.children.length > 0) {
      setParentStack((prev) => [...prev, node]);
    }
  };

  return (
    <div className="space-y-2 p-1">
      {/* Micro Search Bar cho Danh Mục */}
      <div className="relative flex items-center w-full">
        <Search className="w-3 h-3 text-muted-foreground absolute left-2.5 pointer-events-none stroke-[1.5]" />
        <input
          type="text"
          placeholder="Tìm danh mục..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-7 pr-7 py-1 bg-surface text-xs font-display text-foreground placeholder:text-muted-foreground rounded-[2px] outline-none focus:outline-none focus:ring-1 focus:ring-foreground ring-0 border-0 transition-colors"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm("")}
            className="absolute right-2 text-muted-foreground hover:text-foreground p-0.5 cursor-pointer"
          >
            <X className="w-3 h-3 stroke-[1.5]" />
          </button>
        )}
      </div>

      {/* Nội dung danh mục cuộn (max-h-56) */}
      <div className="max-h-56 overflow-y-auto scrollbar-thin scrollbar-thumb-surface-variant space-y-1">
        {searchTerm.trim() !== "" ? (
          filteredSearchList.length === 0 ? (
            <p className="text-[11px] text-muted-foreground py-1 px-2 italic">
              Không tìm thấy danh mục
            </p>
          ) : (
            filteredSearchList.map(({ node, path }) => {
              const isSelected = currentCategorySlug === node.slug;
              return (
                <button
                  key={node.categoryId}
                  type="button"
                  onClick={() => onSelectCategory(isSelected ? "" : node.slug)}
                  className={`w-full flex flex-col items-start py-1.5 px-2 rounded-[2px] transition-colors cursor-pointer text-left ${
                    isSelected ? "font-semibold text-foreground bg-surface" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-display">{node.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[1.5] shrink-0" />}
                  </div>
                  <span className="text-[10px] text-muted-foreground tracking-wider truncate max-w-full">
                    {path}
                  </span>
                </button>
              );
            })
          )
        ) : (
          <div className="space-y-1 text-xs font-display">
            {/* Nút Quay lại khi đang ở danh mục con */}
            {currentParent && (
              <button
                type="button"
                onClick={() => setParentStack((prev) => prev.slice(0, -1))}
                className="w-full flex items-center gap-1.5 py-1 px-1.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer text-left font-medium border-b border-border/30 pb-1.5 mb-1.5"
              >
                <ChevronLeft className="w-3.5 h-3.5 stroke-[1.5]" />
                <span className="truncate">Quay lại ({parentStack.length > 1 ? parentStack[parentStack.length - 2].name : "Tất Cả"})</span>
              </button>
            )}

            {/* Mục "Tất Cả [Tên Danh Mục Cha]" */}
            <button
              type="button"
              onClick={() => onSelectCategory(currentParent ? currentParent.slug : "")}
              className={`w-full flex items-center justify-between py-1 px-2 rounded-[2px] transition-colors cursor-pointer text-left ${
                (!currentCategorySlug && !currentParent) || (currentParent && currentCategorySlug === currentParent.slug)
                  ? "font-semibold text-foreground bg-surface"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>{currentParent ? `Tất Cả ${currentParent.name}` : "Tất Cả Danh Mục"}</span>
              {((!currentCategorySlug && !currentParent) || (currentParent && currentCategorySlug === currentParent.slug)) && (
                <Check className="w-3.5 h-3.5 stroke-[1.5]" />
              )}
            </button>

            {/* Các danh mục ở level hiện tại */}
            {activeNodes.map((node) => {
              const isSelected = currentCategorySlug === node.slug;
              const hasChildren = node.children && node.children.length > 0;

              return (
                <button
                  key={node.categoryId}
                  type="button"
                  onClick={() => handleCategoryClick(node)}
                  className={`w-full flex items-center justify-between py-1 px-2 rounded-[2px] transition-colors cursor-pointer text-left ${
                    isSelected ? "font-semibold text-foreground bg-surface" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className="truncate pr-1">{node.name}</span>
                  <div className="flex items-center gap-1 shrink-0">
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[1.5]" />}
                    {hasChildren && <ChevronRight className="w-3.5 h-3.5 stroke-[1.5] text-muted-foreground" />}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * CatalogFilterSidebar Component (Editorial Flat Studio Edition)
 * 
 * - Hiển thị Tên mục đang chọn (: SelectedName) ở bên phải tiêu đề Danh Mục & Thương Hiệu.
 * - Chuyển nút "LỌC" Khoảng Giá lên bên phải hàng tiêu đề Khoảng Giá.
 */
export default function CatalogFilterSidebar({
  brandOptions,
  categoryOptions,
  collectionOptions = [],
  activeChips = [],
  onClearAllFilters,
}: CatalogFilterSidebarProps) {
  const [sp, setSp] = useSearchParams();
  const { data: filterData } = useFilterableAttributes();

  const [priceMinInput, setPriceMinInput] = useState(sp.get("priceMin") || "");
  const [priceMaxInput, setPriceMaxInput] = useState(sp.get("priceMax") || "");

  useEffect(() => {
    setPriceMinInput(sp.get("priceMin") || "");
    setPriceMaxInput(sp.get("priceMax") || "");
  }, [sp]);

  const currentCategory = sp.get("categorySlug") || "";
  const currentBrand = sp.get("brandSlug") || "";
  const currentCollection = sp.get("collectionSlug") || "";

  // Tra cứu nhãn tên của mục đang chọn
  const selectedCategoryLabel = useMemo(() => {
    if (!currentCategory) return undefined;
    const found = categoryOptions.find((opt) => String(opt.slug || opt.value) === currentCategory);
    return found?.label;
  }, [currentCategory, categoryOptions]);

  const selectedBrandLabel = useMemo(() => {
    if (!currentBrand) return undefined;
    const found = brandOptions.find((opt) => String(opt.slug || opt.value) === currentBrand);
    return found?.label;
  }, [currentBrand, brandOptions]);

  const selectedCollectionLabel = useMemo(() => {
    if (!currentCollection) return undefined;
    const found = collectionOptions.find((opt) => String(opt.value) === currentCollection);
    return found?.label;
  }, [currentCollection, collectionOptions]);

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

  const handleQuickPricePresetSelect = (minStr: string, maxStr: string) => {
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

  const pricePresets = [
    { label: "< 500k", min: "", max: "500000" },
    { label: "500k – 1M", min: "500000", max: "1000000" },
    { label: "1M – 2M", min: "1000000", max: "2000000" },
    { label: "> 2M", min: "2000000", max: "" },
  ];

  return (
    <aside className="w-full select-none space-y-6 pb-12">
      
      {/* 1. DANH MỤC SẢN PHẨM (DRILL-DOWN TREE NAVIGATION WITH SELECTED VALUE IN HEADER) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between gap-2 select-none min-h-[22px]">
          <div className="flex items-baseline gap-1.5 min-w-0">
            <h3 className="text-xs font-display font-semibold uppercase tracking-[0.18em] text-foreground shrink-0">
              Danh Mục
            </h3>
            {selectedCategoryLabel && (
              <span className="text-[11px] font-display font-medium text-muted-foreground uppercase tracking-wider truncate">
                : {selectedCategoryLabel}
              </span>
            )}
          </div>
        </div>
        <CategoryTreeSection
          currentCategorySlug={currentCategory}
          onSelectCategory={(slug) => updateParam("categorySlug", slug)}
        />
      </div>

      {/* 2. THƯƠNG HIỆU (VỚI TÊN THƯƠNG HIỆU ĐANG CHỌN Ở TIÊU ĐỀ) */}
      {brandOptions && brandOptions.length > 0 && (
        <FilterSection 
          title="Thương Hiệu" 
          selectedValue={selectedBrandLabel}
          searchable={true}
          searchPlaceholder="Tìm thương hiệu..."
        >
          {(searchTerm) => {
            const filtered = brandOptions.filter((opt) =>
              opt.label.toLowerCase().includes(searchTerm)
            );

            return (
              <div className="space-y-1 text-xs font-display">
                {!searchTerm && (
                  <button
                    type="button"
                    onClick={() => updateParam("brandSlug", "")}
                    className={`w-full flex items-center justify-between py-1 px-2 rounded-[2px] transition-colors cursor-pointer text-left ${
                      !currentBrand ? "font-semibold text-foreground bg-surface" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span>Tất Cả Thương Hiệu</span>
                    {!currentBrand && <Check className="w-3.5 h-3.5 stroke-[1.5]" />}
                  </button>
                )}

                {filtered.length === 0 ? (
                  <p className="text-[11px] text-muted-foreground py-1 px-2 italic">
                    Không tìm thấy thương hiệu
                  </p>
                ) : (
                  filtered.map((opt) => {
                    const optVal = String(opt.slug || opt.value);
                    const isSelected = currentBrand === optVal;
                    return (
                      <button
                        key={optVal}
                        type="button"
                        onClick={() => updateParam("brandSlug", isSelected ? "" : optVal)}
                        className={`w-full flex items-center justify-between py-1 px-2 rounded-[2px] transition-colors cursor-pointer text-left ${
                          isSelected ? "font-semibold text-foreground bg-surface" : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <span className="truncate pr-2">{opt.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[1.5] shrink-0" />}
                      </button>
                    );
                  })
                )}
              </div>
            );
          }}
        </FilterSection>
      )}

      {/* 3. BỘ SƯU TẬP */}
      {collectionOptions.length > 0 && (
        <FilterSection 
          title="Bộ Sưu Tập" 
          selectedValue={selectedCollectionLabel}
          searchable={collectionOptions.length > 5}
          searchPlaceholder="Tìm bộ sưu tập..."
        >
          {(searchTerm) => {
            const filtered = collectionOptions.filter((opt) =>
              opt.label.toLowerCase().includes(searchTerm)
            );

            return (
              <div className="space-y-1 text-xs font-display">
                {!searchTerm && (
                  <button
                    type="button"
                    onClick={() => updateParam("collectionSlug", "")}
                    className={`w-full flex items-center justify-between py-1 px-2 rounded-[2px] transition-colors cursor-pointer text-left ${
                      !currentCollection ? "font-semibold text-foreground bg-surface" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span>Tất Cả Bộ Sưu Tập</span>
                    {!currentCollection && <Check className="w-3.5 h-3.5 stroke-[1.5]" />}
                  </button>
                )}

                {filtered.length === 0 ? (
                  <p className="text-[11px] text-muted-foreground py-1 px-2 italic">
                    Không tìm thấy bộ sưu tập
                  </p>
                ) : (
                  filtered.map((opt) => {
                    const optVal = String(opt.value);
                    const isSelected = currentCollection === optVal;
                    return (
                      <button
                        key={optVal}
                        type="button"
                        onClick={() => updateParam("collectionSlug", isSelected ? "" : optVal)}
                        className={`w-full flex items-center justify-between py-1 px-2 rounded-[2px] transition-colors cursor-pointer text-left ${
                          isSelected ? "font-semibold text-foreground bg-surface" : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <span className="truncate pr-2">{opt.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[1.5] shrink-0" />}
                      </button>
                    );
                  })
                )}
              </div>
            );
          }}
        </FilterSection>
      )}

      {/* 4. KHOẢNG GIÁ (NÚT LỌC Ở TIÊU ĐỀ NẰM BÊN PHẢI CHỮ KHOẢNG GIÁ) */}
      <FilterSection 
        title="Khoảng Giá" 
        searchable={false}
        headerAction={
          <button
            type="button"
            onClick={handleApplyPrice}
            className="px-2.5 py-0.5 bg-foreground text-background text-[10px] font-display uppercase font-semibold rounded-[2px] hover:opacity-90 transition-opacity shrink-0 cursor-pointer"
          >
            LỌC
          </button>
        }
      >
        {() => (
          <div className="space-y-2 text-xs font-display">
            {/* Inline Price Input (Từ - Đến) */}
            <div className="flex items-center gap-1.5 ">
              <input
                type="number"
                placeholder="Từ..."
                value={priceMinInput}
                onChange={(e) => setPriceMinInput(e.target.value)}
                className="w-full px-2 py-1 bg-surface text-xs font-display rounded-[2px] text-foreground placeholder:text-muted-foreground outline-none focus:outline-none focus:ring-1 focus:ring-foreground ring-0 border-0 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              {/* <span className="text-muted-foreground text-xs font-light">&ndash;</span> */}
              <input
                type="number"
                placeholder="Đến..."
                value={priceMaxInput}
                onChange={(e) => setPriceMaxInput(e.target.value)}
                className="w-full px-2 py-1 bg-surface text-xs font-display rounded-[2px] text-foreground placeholder:text-muted-foreground outline-none focus:outline-none focus:ring-1 focus:ring-foreground ring-0 border-0 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
            {/* Compact Price Presets (2x2 Grid) */}
            <div className="grid grid-cols-2 gap-1.5">
              {pricePresets.map((preset, idx) => {
                const curMin = sp.get("priceMin") || "";
                const curMax = sp.get("priceMax") || "";
                const isSelected = curMin === preset.min && curMax === preset.max;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        handleQuickPricePresetSelect("", "");
                      } else {
                        handleQuickPricePresetSelect(preset.min, preset.max);
                      }
                    }}
                    className={`py-1 px-2 rounded-[2px] text-[11px] font-medium transition-colors cursor-pointer text-center truncate ${
                      isSelected ? "bg-foreground text-background font-semibold" : "bg-surface/60 hover:bg-surface text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>


          </div>
        )}
      </FilterSection>

      {/* 5. THUỘC TÍNH ĐỘNG (MÀU SẮC, KÍCH THƯỚC,...) */}
      {filterData?.attributes.map((attr) => {
        const currentVal = sp.get(attr.slug) || "";
        return (
          <FilterSection 
            key={attr.slug} 
            title={attr.name} 
            selectedValue={currentVal || undefined}
            searchable={attr.values.length > 5}
            searchPlaceholder={`Tìm ${attr.name.toLowerCase()}...`}
          >
            {(searchTerm) => {
              const filtered = attr.values.filter((val) =>
                val.toLowerCase().includes(searchTerm)
              );

              return (
                <div className="space-y-1 text-xs font-display">
                  {!searchTerm && (
                    <button
                      type="button"
                      onClick={() => updateParam(attr.slug, "")}
                      className={`w-full flex items-center justify-between py-1 px-2 rounded-[2px] transition-colors cursor-pointer text-left ${
                        !currentVal ? "font-semibold text-foreground bg-surface" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <span>Tất Cả {attr.name}</span>
                      {!currentVal && <Check className="w-3.5 h-3.5 stroke-[1.5]" />}
                    </button>
                  )}

                  {filtered.length === 0 ? (
                    <p className="text-[11px] text-muted-foreground py-1 px-2 italic">
                      Không tìm thấy {attr.name.toLowerCase()}
                    </p>
                  ) : (
                    filtered.map((val) => {
                      const isSelected = currentVal === val;
                      return (
                        <button
                          key={val}
                          type="button"
                          onClick={() => updateParam(attr.slug, isSelected ? "" : val)}
                          className={`w-full flex items-center justify-between py-1 px-2 rounded-[2px] transition-colors cursor-pointer text-left ${
                            isSelected ? "font-semibold text-foreground bg-surface" : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <span className="truncate pr-2">{val}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[1.5] shrink-0" />}
                        </button>
                      );
                    })
                  )}
                </div>
              );
            }}
          </FilterSection>
        );
      })}

    </aside>
  );
}
