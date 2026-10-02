import { Button, Input, Label } from "@my-project/ui";
import { MagnifyingGlassIcon, FunnelIcon, AdjustmentsHorizontalIcon, PlusIcon } from "@heroicons/react/24/outline";
import ReactSelect from "react-select";
import { reactSelectDarkStyles } from "@my-project/ui";
import { Link } from "react-router-dom";
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
    <div className="flex flex-col md:flex-row items-start sm:items-center gap-3 sm:gap-2 w-full">
      {/* Search Inputs */}
      <div className="flex items-center gap-2 w-full">
        <div className="w-full md:w-auto  relative group">
          <MagnifyingGlassIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground group-focus-within:text-foreground transition-colors" />
          <Input
            value={props.keyword}
            onChange={(e) => props.setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && props.apply()}
            placeholder="Tìm tên sản phẩm..."
            className="pl-8 h-8 text-xs hover:border-border focus:bg-transparent shadow-none"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-2 w-full md:w-auto shrink-0 justify-between">
        <Button
          onClick={() => props.setIsAdvancedOpen(!props.isAdvancedOpen)}
          variant="outline"
          className={`w-full sm:w-auto h-8 px-2.5 flex items-center gap-1.5 text-[11px] font-medium transition-colors shadow-none ${
            props.isAdvancedOpen || activeAdvancedCount > 0 ? "bg-accent/10 border-accent/20 text-accent hover:bg-accent/15" : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-foreground/5"
          }`}
        >
          <AdjustmentsHorizontalIcon className="w-3.5 h-3.5" /> 
          <span className="hidden sm:inline">Nâng cao</span>
          {activeAdvancedCount > 0 && (
            <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full text-[10px] font-bold text-accent-foreground ml-0.5">
              {activeAdvancedCount}
            </span>
          )}
        </Button>
        
        {(activeAdvancedCount > 0 || props.keyword) && (
          <Button
            onClick={props.clearFilters}
            variant="ghost"
            className="w-full sm:w-auto h-8 px-2.5 text-[11px] font-medium text-muted-foreground border border-muted/20 bg-foreground/10 hover:text-foreground hover:bg-foreground/5 shadow-none"
          >
            Xóa
          </Button>
        )}

        <Button
          onClick={props.apply}
          className="w-full sm:w-auto h-8 px-3 flex items-center gap-1.5 text-[11px] font-medium shadow-none"
        >
          <FunnelIcon className="w-3 h-3" /> <span className="hidden sm:inline">Áp dụng</span>
        </Button>

        <Guard permission="Permissions.Products.Edit">
          <Link to="/admin/product/new" className="block">
            <Button variant="default" className="h-8 px-3 flex items-center gap-1.5 text-[11px] font-semibold bg-accent hover:bg-accent/90 text-accent-foreground shadow-none">
              <PlusIcon className="w-3.5 h-3.5" /> Thêm sản phẩm
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
      className={`grid overflow-hidden transition-all duration-300 ease-in-out ${
        props.isAdvancedOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      }`}
    >
      <div className="min-h-0 px-2">
        <div className="p-4 bg-card rounded-br-card rounded-bl-card border border-foreground/10 border-t-0 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5 items-end">
          {/* Brand */}
          <div className="w-full space-y-1.5">
            <Label variant="default" className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Thương hiệu</Label>
            <ReactSelect
              value={selectedBrand}
              onChange={(val: any) => props.setBrandId(val?.value ? String(val.value) : "")}
              options={props.brandOptions}
              placeholder="Tất cả"
              styles={reactSelectDarkStyles}
              menuPortalTarget={document.body}
              isClearable
            />
          </div>

          {/* Category */}
          <div className="w-full space-y-1.5">
            <Label variant="default" className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Danh mục</Label>
            <ReactSelect
              value={selectedCategory}
              onChange={(val: any) => props.setCategoryId(val?.value ? String(val.value) : "")}
              options={props.categoryOptions}
              placeholder="Tất cả"
              styles={reactSelectDarkStyles}
              menuPortalTarget={document.body}
              isClearable
            />
          </div>

          {/* Sort */}
          <div className="w-full space-y-1.5">
            <Label variant="default" className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Sắp xếp</Label>
            <ReactSelect
              value={selectedSort}
              onChange={(val: any) => props.setSort(val?.value ?? "")}
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

