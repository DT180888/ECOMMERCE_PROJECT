import { Button, Input, Label, reactSelectDarkStyles } from "@my-project/ui";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  AdjustmentsHorizontalIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import ReactSelect from "react-select";
import { SplitPaneInspector } from "@shared/ui";

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
  const activeAdvancedCount = [
    props.minPrice,
    props.maxPrice,
    props.minStock,
    props.maxStock,
    props.isActive,
    props.sort,
  ].filter(Boolean).length;

  return (
    <div className="flex items-center gap-2 flex-wrap md:flex-nowrap">
      {/* Search Inputs */}
      <div className="relative w-full md:w-44 group">
        <MagnifyingGlassIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground group-focus-within:text-foreground transition-colors pointer-events-none" />
        <Input
          value={props.skuCode}
          onChange={(e) => props.setSkuCode(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && props.apply()}
          placeholder="Mã SKU..."
          className="pl-8 text-xs bg-background border-border rounded-[2px] w-full focus:bg-surface shadow-none"
        />
      </div>

      <div className="relative w-full md:w-56 group">
        <MagnifyingGlassIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground group-focus-within:text-foreground transition-colors pointer-events-none" />
        <Input
          value={props.productName}
          onChange={(e) => props.setProductName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && props.apply()}
          placeholder="Tên sản phẩm..."
          className="pl-8 text-xs bg-background border-border rounded-[2px] w-full focus:bg-surface shadow-none"
        />
      </div>

      {/* Filter Drawer Trigger */}
      <Button
        type="button"
        onClick={() => props.setIsAdvancedOpen(!props.isAdvancedOpen)}
        variant="outline"
        size="default"
        icon={<AdjustmentsHorizontalIcon className="w-3.5 h-3.5" />}
        className={`px-2.5 flex items-center gap-1 text-xs font-medium rounded-[2px] transition-colors shadow-none ${
          props.isAdvancedOpen || activeAdvancedCount > 0
            ? "bg-foreground/10 border-foreground/30 text-foreground"
            : "bg-surface border-border text-muted-foreground hover:text-foreground"
        }`}
      >
        <span className="hidden md:inline">Bộ lọc</span>
        {activeAdvancedCount > 0 && (
          <span className="flex h-4 min-w-[16px] px-1 items-center justify-center rounded-[2px] text-[10px] font-semibold bg-foreground text-background tabular-nums">
            {activeAdvancedCount}
          </span>
        )}
      </Button>

      {/* Quick low stock filter */}
      <Button
        type="button"
        onClick={props.handleLowStockWarning}
        variant="ghost"
        size="default"
        icon={<ExclamationTriangleIcon className="w-3.5 h-3.5" />}
        className="px-2.5 flex items-center gap-1 text-xs font-medium rounded-[2px] bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 shadow-none shrink-0"
        title="Lọc nhanh SKU sắp hết hàng (< 10)"
      >
        <span className="hidden xl:inline">Sắp hết</span>
      </Button>

      {/* Clear active filters button */}
      {(activeAdvancedCount > 0 || props.skuCode || props.productName) && (
        <Button
          type="button"
          onClick={props.clearFilters}
          variant="ghost"
          size="default"
          icon={<ArrowPathIcon className="w-3.5 h-3.5" />}
          className="px-2 text-xs font-normal text-muted-foreground hover:text-foreground rounded-[2px]"
          title="Xóa tất cả bộ lọc"
        >
        </Button>
      )}

      {/* Apply Search Button */}
      <Button
        type="button"
        onClick={props.apply}
        variant="default"
        size="default"
        icon={<FunnelIcon className="w-3.5 h-3.5" />}
        className="px-3 flex items-center gap-1 text-xs font-medium rounded-[2px] shadow-none shrink-0"
      >
        <span>Lọc</span>
      </Button>
    </div>
  );
}

export function SkuFilterDrawer(props: SkuToolbarProps) {
  const selectedIsActive = props.STATUS_OPTIONS.find((o) => o.value === props.isActive) || null;
  const selectedSort = props.SORT_OPTIONS.find((o) => o.value === props.sort) || null;
  const activeCount = [
    props.minPrice,
    props.maxPrice,
    props.minStock,
    props.maxStock,
    props.isActive,
    props.sort,
  ].filter(Boolean).length;

  return (
    <SplitPaneInspector
      open={props.isAdvancedOpen}
      onClose={() => props.setIsAdvancedOpen(false)}
      title="Bộ lọc SKU nâng cao"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button
            type="button"
            variant="ghost"
            size="default"
            onClick={props.clearFilters}
            className="h-8 px-3 text-xs text-muted-foreground hover:text-foreground rounded-[2px]"
          >
            Đặt lại ({activeCount})
          </Button>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="default"
              onClick={() => props.setIsAdvancedOpen(false)}
              className="h-8 px-3 text-xs rounded-[2px]"
            >
              Đóng
            </Button>
            <Button
              type="button"
              variant="default"
              size="default"
              onClick={props.apply}
              className="h-8 px-4 text-xs font-medium rounded-[2px]"
            >
              Áp dụng bộ lọc
            </Button>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        {/* Quick Alert Card */}
        <div className="p-3 bg-surface border border-border rounded-[2px] flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-foreground">Cảnh báo tồn kho thấp</div>
            <div className="text-[11px] text-muted-foreground">Lọc ngay các SKU có tồn &lt; 10</div>
          </div>
          <Button
            type="button"
            size="default"
            variant="outline"
            onClick={props.handleLowStockWarning}
            className="h-7 text-xs px-2.5 rounded-[2px] bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400"
          >
            Lọc &lt; 10
          </Button>
        </div>

        {/* Status */}
        <div className="flex flex-col gap-1">
          <Label className="text-xs font-medium text-foreground">Trạng thái SKU</Label>
          <ReactSelect
            value={selectedIsActive}
            onChange={(val: any) => props.setIsActive(val?.value ?? "")}
            options={props.STATUS_OPTIONS}
            placeholder="Tất cả trạng thái"
            styles={reactSelectDarkStyles}
            menuPortalTarget={document.body}
            isClearable
          />
        </div>

        {/* Sort */}
        <div className="flex flex-col gap-1">
          <Label className="text-xs font-medium text-foreground">Thứ tự sắp xếp</Label>
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
        <div className="flex flex-col gap-1">
          <Label className="text-xs font-medium text-foreground">Khoảng giá bán (VND)</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Input
                type="number"
                value={props.minPrice}
                onChange={(e) => props.setMinPrice(e.target.value)}
                placeholder="Tối thiểu"
                className="h-8 text-xs bg-surface border-border rounded-[2px] w-full"
              />
            </div>
            <div>
              <Input
                type="number"
                value={props.maxPrice}
                onChange={(e) => props.setMaxPrice(e.target.value)}
                placeholder="Tối đa"
                className="h-8 text-xs bg-surface border-border rounded-[2px] w-full"
              />
            </div>
          </div>
        </div>

        {/* Stock Range */}
        <div className="flex flex-col gap-1">
          <Label className="text-xs font-medium text-foreground">Khoảng tồn kho</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Input
                type="number"
                value={props.minStock}
                onChange={(e) => props.setMinStock(e.target.value)}
                placeholder="Tối thiểu"
                className="h-8 text-xs bg-surface border-border rounded-[2px] w-full"
              />
            </div>
            <div>
              <Input
                type="number"
                value={props.maxStock}
                onChange={(e) => props.setMaxStock(e.target.value)}
                placeholder="Tối đa"
                className="h-8 text-xs bg-surface border-border rounded-[2px] w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </SplitPaneInspector>
  );
}

// Backward compatibility export
export const SkuAdvancedPanel = SkuFilterDrawer;
