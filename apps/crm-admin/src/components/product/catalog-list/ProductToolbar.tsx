import { Link } from "react-router-dom";
import { Button, Input, Label } from "@my-project/ui";
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon, PlusIcon } from "@heroicons/react/24/outline";
import ReactSelect from "react-select";
import { reactSelectDarkStyles } from "@my-project/ui";
import { Guard } from "@shared/ui";

export interface ProductToolbarProps {
  keyword: string;
  setKeyword: (v: string) => void;
  brandId: string;
  setBrandId: (v: string) => void;
  categoryId: string;
  setCategoryId: (v: string) => void;
  sort: string;
  setSort: (v: string) => void;
  brandOptions: any[];
  categoryOptions: any[];
  SORT_OPTIONS: any[];
  apply: () => void;
  clearFilters: () => void;
  isAdvancedOpen: boolean;
  setIsAdvancedOpen: (v: boolean) => void;
}

export function ProductSearchActions(props: ProductToolbarProps) {
  const activeAdvancedCount = [props.brandId, props.categoryId, props.sort].filter(Boolean).length;

  return (
    <div className="flex items-center gap-2.5 w-full justify-end">
      {/* Search Input */}
      <div className="relative w-full md:w-64">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <Input
          value={props.keyword}
          onChange={(e) => props.setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && props.apply()}
          placeholder="Tìm tên sản phẩm..."
          className="pl-9 h-[34px] text-[13px] bg-card border-border rounded-md w-full focus:border-primary shadow-sm"
        />
      </div>
      <div className="flex items-center gap-2">
        {/* Advanced Toggle */}
        <Button
          onClick={() => props.setIsAdvancedOpen(!props.isAdvancedOpen)}
          variant="outline"
          size="default"
          icon={<AdjustmentsHorizontalIcon className="w-4 h-4 stroke-[2]" />}
          className={`relative h-[34px] sm:h-7 px-3 flex items-center gap-1.5 text-xs font-medium rounded-md border-border transition-all shrink-0 ${
            props.isAdvancedOpen || activeAdvancedCount > 0
              ? "bg-primary/10 text-primary border-primary/30"
              : "text-muted-foreground hover:text-foreground hover:bg-surface-hover"
          }`}
          title="Bộ lọc nâng cao"
        >
          <span className="hidden md:inline">Lọc</span>
          {activeAdvancedCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full text-[10px] font-semibold tabular-nums bg-primary text-primary-foreground">
              {activeAdvancedCount}
            </span>
          )}
        </Button>

        {/* Clear Filters CTA */}
        {(activeAdvancedCount > 0 || props.keyword) && (
          <Button
            onClick={props.clearFilters}
            variant="ghost"
            size="sm"
            className="h-[34px] sm:h-7 px-3 text-xs text-muted-foreground hover:text-foreground hover:bg-surface-hover rounded-md shrink-0"
          >
            Xóa lọc
          </Button>
        )}

        {/* Add Product CTA */}
        <Guard permission="Permissions.Products.Edit">
          <Link to="/admin/product/new" className="block shrink-0">
            <Button
              variant="default"
              size="sm"
              icon={<PlusIcon className="w-4 h-4 stroke-[2]" />}
              className="h-[34px] sm:h-7 px-3.5 flex items-center gap-1.5 text-xs font-semibold rounded-md shadow-sm"
            >
              <span className="hidden md:inline">Thêm sản phẩm</span>
              <span className="md:hidden">Thêm</span>
            </Button>
          </Link>
        </Guard>
      </div>
    </div>
  );
}

export function ProductAdvancedPanel(props: ProductToolbarProps) {
  const selectedBrand = props.brandOptions.find((o) => String(o.value) === props.brandId) || null;
  const selectedCategory = props.categoryOptions.find((o) => String(o.value) === props.categoryId) || null;
  const selectedSort = props.SORT_OPTIONS.find((o) => o.value === props.sort) || null;

  return (
    <div
      className={`grid overflow-hidden transition-all duration-200 ease-in-out w-full ${
        props.isAdvancedOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      }`}
    >
      <div className="min-h-0 w-full">
        <div className="p-4 bg-surface border border-border rounded-lg shadow-sm grid grid-cols-1 md:grid-cols-3 gap-3.5 items-end mt-2">
          {/* Brand */}
          <div className="w-full flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground font-medium">
              Thương hiệu
            </Label>
            <ReactSelect
              value={selectedBrand}
              onChange={(val: any) => {
                props.setBrandId(val?.value ? String(val.value) : "");
                props.apply();
              }}
              options={props.brandOptions}
              placeholder="Tất cả thương hiệu"
              styles={reactSelectDarkStyles}
              menuPortalTarget={document.body}
              isClearable
            />
          </div>

          {/* Category */}
          <div className="w-full flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground font-medium">
              Danh mục
            </Label>
            <ReactSelect
              value={selectedCategory}
              onChange={(val: any) => {
                props.setCategoryId(val?.value ? String(val.value) : "");
                props.apply();
              }}
              options={props.categoryOptions}
              placeholder="Tất cả danh mục"
              styles={reactSelectDarkStyles}
              menuPortalTarget={document.body}
              isClearable
            />
          </div>

          {/* Sort */}
          <div className="w-full flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground font-medium">
              Sắp xếp
            </Label>
            <ReactSelect
              value={selectedSort}
              onChange={(val: any) => {
                props.setSort(val?.value ?? "");
                props.apply();
              }}
              options={props.SORT_OPTIONS}
              placeholder="Mặc định"
              styles={reactSelectDarkStyles}
              menuPortalTarget={document.body}
              isClearable
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductSearchActions;
