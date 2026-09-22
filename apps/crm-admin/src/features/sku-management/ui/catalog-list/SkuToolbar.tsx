import { Button, Input, Label } from "@my-project/ui";
import { MagnifyingGlassIcon, FunnelIcon, AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";
import ReactSelect from "react-select";
import { reactSelectDarkStyles } from "@my-project/ui";

export interface SkuToolbarProps {
  skuCode: string;
  setSkuCode: (v: string) => void;
  productName: string;
  setProductName: (v: string) => void;
  minPrice: string;
  setMinPrice: (v: string) => void;
  maxPrice: string;
  setMaxPrice: (v: string) => void;
  minStock: string;
  setMinStock: (v: string) => void;
  maxStock: string;
  setMaxStock: (v: string) => void;
  isActive: string;
  setIsActive: (v: string) => void;
  sort: string;
  setSort: (v: string) => void;
  STATUS_OPTIONS: any[];
  SORT_OPTIONS: any[];
  apply: () => void;
  clearFilters: () => void;
  handleLowStockWarning: () => void;
  isAdvancedOpen: boolean;
  setIsAdvancedOpen: (v: boolean) => void;
}

export function SkuSearchActions(props: SkuToolbarProps) {
  const activeAdvancedCount = [props.minPrice, props.maxPrice, props.minStock, props.maxStock, props.isActive, props.sort].filter(Boolean).length;

  return (
    <div className="flex flex-wrap items-start sm:items-center gap-3 sm:gap-2 w-full">
      {/* Search Inputs */}
      <div className="flex flex items-center gap-2 w-full sm:w-auto">
        <div className="w-full sm:w-40 md:w-44 lg:w-48 relative group">
          <MagnifyingGlassIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground group-focus-within:text-foreground transition-colors" />
          <Input
            value={props.skuCode}
            onChange={(e) => props.setSkuCode(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && props.apply()}
            placeholder="Mã SKU..."
            className="pl-8 h-8 text-xs hover:border-border focus:bg-transparent shadow-none"
          />
        </div>

        <div className="w-full sm:w-48 md:w-52 lg:w-56 relative group">
          <MagnifyingGlassIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground group-focus-within:text-foreground transition-colors" />
          <Input
            value={props.productName}
            onChange={(e) => props.setProductName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && props.apply()}
            placeholder="Tên sản phẩm..."
            className="pl-8 h-8 text-xs hover:border-border focus:bg-transparent shadow-none"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-1.5 w-full w-full sm:w-auto shrink-0 justify-end">
        <Button
          onClick={() => props.setIsAdvancedOpen(!props.isAdvancedOpen)}
          variant="outline"
          className={`w-full h-8 px-2.5 flex items-center gap-1.5 text-[11px] font-medium transition-colors shadow-none ${
            props.isAdvancedOpen || activeAdvancedCount > 0 ? "bg-accent/10 border-accent/20 text-accent hover:bg-accent/15" : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-foreground/5"
          }`}
        >
          <AdjustmentsHorizontalIcon className="w-3.5 h-3.5" /> 
          <span className="hidden lg:inline">Nâng cao</span>
          {activeAdvancedCount > 0 && (
            <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full text-[10px] font-bold text-accent-foreground ml-0.5">
              {activeAdvancedCount}
            </span>
          )}
        </Button>
        
        <Button
          onClick={props.handleLowStockWarning}
          variant="ghost"
          className="w-full h-8 px-2 flex items-center gap-1.5 text-[11px] font-medium bg-amber-500/10 border border-amber-500/20 text-amber-500 hover:text-amber-600 hover:bg-amber-500/10 shadow-none"
          title="Cảnh báo sắp hết hàng (< 10)"
        >
          ⚠️ <span className="hidden xl:inline">Sắp hết hàng</span>
        </Button>

        {(activeAdvancedCount > 0 || props.skuCode || props.productName) && (
          <Button
            onClick={props.clearFilters}
            variant="ghost"
            className="w-full h-8 px-2.5 text-[11px] font-medium text-muted-foreground border border-muted/20 bg-foreground/10 hover:text-foreground hover:bg-foreground/5 shadow-none"
          >
            Xóa
          </Button>
        )}

        <Button
          onClick={props.apply}
          className="w-full h-8 px-3 flex items-center gap-1.5 text-[11px] font-medium shadow-none"
        >
          <FunnelIcon className="w-3 h-3" /> <span className="hidden sm:inline">Áp dụng</span>
        </Button>
      </div>
    </div>
  );
}

export function SkuAdvancedPanel(props: SkuToolbarProps) {
  const selectedIsActive = props.STATUS_OPTIONS.find((o) => o.value === props.isActive) || null;
  const selectedSort = props.SORT_OPTIONS.find((o) => o.value === props.sort) || null;

  return (
    <div 
      className={`grid overflow-hidden transition-all duration-300 ease-in-out ${
        props.isAdvancedOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      }`}
    >
      <div className="min-h-0 px-2">
        <div className="p-4 bg-card rounded-br-card rounded-bl-card  border border-foreground/10 border-t-0 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 items-end">
          {/* Status */}
          <div className="w-full space-y-1.5">
            <Label variant="default" className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Trạng thái</Label>
            <ReactSelect
              value={selectedIsActive}
              onChange={(val: any) => props.setIsActive(val?.value ?? "")}
              options={props.STATUS_OPTIONS}
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

          {/* Price Range */}
          <div className="w-full space-y-1.5">
            <Label variant="default" className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Khoảng giá</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={props.minPrice}
                onChange={(e) => props.setMinPrice(e.target.value)}
                placeholder="Từ..."
                className="h-8 text-xs shadow-none"
              />
              <span className="text-muted-foreground text-xs">-</span>
              <Input
                type="number"
                value={props.maxPrice}
                onChange={(e) => props.setMaxPrice(e.target.value)}
                placeholder="Đến..."
                className="h-8 text-xs shadow-none"
              />
            </div>
          </div>

          {/* Stock Range */}
          <div className="w-full space-y-1.5">
            <Label variant="default" className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Số lượng tồn</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={props.minStock}
                onChange={(e) => props.setMinStock(e.target.value)}
                placeholder="Từ..."
                className="h-8 text-xs shadow-none"
              />
              <span className="text-muted-foreground text-xs">-</span>
              <Input
                type="number"
                value={props.maxStock}
                onChange={(e) => props.setMaxStock(e.target.value)}
                placeholder="Đến..."
                className="h-8 text-xs shadow-none"
              />
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
