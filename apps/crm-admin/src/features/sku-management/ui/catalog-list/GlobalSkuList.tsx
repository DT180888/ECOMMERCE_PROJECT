import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  useAdminSkuList,
  useBulkUpdateSkuPrice,
  useBulkUpdateSkuStock,
  useBulkUpdateSkuStatus,
} from "@entities/product/hooks";
import type { AdminSkuListParams, AdminSkuItem } from "@entities/product/types";
import { Button, Input, useToast, Dialog, DialogContent, DialogTitle, Tabs, TabsList, TabsTrigger, Label } from "@my-project/ui";
import {
  InboxStackIcon,
  ArchiveBoxXMarkIcon,
  CurrencyDollarIcon,
  CircleStackIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  AdminPageShell,
  AdminTable,
  AdminPagination,
  Guard,
} from "@shared/ui";
import { useSkuColumns, SkuSearchActions, SkuAdvancedPanel } from "@features/sku-management";
const STATUS_OPTIONS = [
  { value: "", label: "Tất cả trạng thái" },
  { value: "true", label: "Hoạt động (Active)" },
  { value: "false", label: "Vô hiệu (Inactive)" },
];

const SORT_OPTIONS = [
  { value: "", label: "Mặc định" },
  { value: "price_asc", label: "Giá tăng dần" },
  { value: "price_desc", label: "Giá giảm dần" },
  { value: "stock_asc", label: "Tồn kho tăng dần" },
  { value: "stock_desc", label: "Tồn kho giảm dần" },
  { value: "code_asc", label: "Mã SKU (A-Z)" },
  { value: "code_desc", label: "Mã SKU (Z-A)" },
];

export function GlobalSkuList() {
  const [sp, setSp] = useSearchParams();
  const toast = useToast();

  const [skuCode, setSkuCode] = useState(sp.get("skuCode") ?? "");
  const [productName, setProductName] = useState(sp.get("productName") ?? "");
  const [minPrice, setMinPrice] = useState(sp.get("minPrice") ?? "");
  const [maxPrice, setMaxPrice] = useState(sp.get("maxPrice") ?? "");
  const [minStock, setMinStock] = useState(sp.get("minStock") ?? "");
  const [maxStock, setMaxStock] = useState(sp.get("maxStock") ?? "");
  const [isActive, setIsActive] = useState(sp.get("isActive") ?? "");
  const [sort, setSort] = useState(sp.get("sort") ?? "");

  // Modal open states
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);

  // Bulk operation type states
  const [priceUpdateType, setPriceUpdateType] = useState<"Set" | "AdjustAmount" | "AdjustPercentage">("Set");
  const [priceUpdateValue, setPriceUpdateValue] = useState<number>(0);

  const [stockUpdateType, setStockUpdateType] = useState<"Set" | "Adjust">("Set");
  const [stockUpdateValue, setStockUpdateValue] = useState<number>(0);

  // Selection
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const page = Number(sp.get("page") ?? "1");
  const size = Number(sp.get("size") ?? "12");

  const params: AdminSkuListParams = useMemo(
    () => ({
      skuCode: sp.get("skuCode") || undefined,
      productName: sp.get("productName") || undefined,
      minPrice: sp.get("minPrice") ? Number(sp.get("minPrice")) : undefined,
      maxPrice: sp.get("maxPrice") ? Number(sp.get("maxPrice")) : undefined,
      minStock: sp.get("minStock") ? Number(sp.get("minStock")) : undefined,
      maxStock: sp.get("maxStock") ? Number(sp.get("maxStock")) : undefined,
      isActive: sp.get("isActive") === "true" ? true : sp.get("isActive") === "false" ? false : undefined,
      sortBy: sp.get("sort") || undefined,
      page,
      size,
    }),
    [sp, page, size]
  );

  const { data, isLoading, refetch } = useAdminSkuList(params);

  // Mutations
  const updatePriceMutation = useBulkUpdateSkuPrice();
  const updateStockMutation = useBulkUpdateSkuStock();
  const updateStatusMutation = useBulkUpdateSkuStatus();

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / size));

  const apply = () => {
    const next = new URLSearchParams(sp);
    const patch = (k: string, v?: string) => (v ? next.set(k, v) : next.delete(k));
    patch("skuCode", skuCode || undefined);
    patch("productName", productName || undefined);
    patch("minPrice", minPrice || undefined);
    patch("maxPrice", maxPrice || undefined);
    patch("minStock", minStock || undefined);
    patch("maxStock", maxStock || undefined);
    patch("isActive", isActive || undefined);
    patch("sort", sort || undefined);
    next.set("page", "1");
    setSp(next);
    setSelectedIds(new Set()); // Reset selection when filters change
  };

  const clearFilters = () => {
    setSkuCode("");
    setProductName("");
    setMinPrice("");
    setMaxPrice("");
    setMinStock("");
    setMaxStock("");
    setIsActive("");
    setSort("");
    const next = new URLSearchParams();
    next.set("page", "1");
    next.set("size", String(size));
    setSp(next);
    setSelectedIds(new Set());
  };

  const handleLowStockWarning = () => {
    setMinStock("");
    setMaxStock("9");
    const next = new URLSearchParams(sp);
    next.delete("minStock");
    next.set("maxStock", "9");
    next.set("page", "1");
    setSp(next);
    setSelectedIds(new Set());
  };

  const goPage = (p: number) => {
    const next = new URLSearchParams(sp);
    next.set("page", String(p));
    next.set("size", String(size));
    setSp(next);
  };

  // Selection callbacks
  const handleSelect = (id: number, checked: boolean) => {
    const next = new Set(selectedIds);
    if (checked) {
      next.add(id);
    } else {
      next.delete(id);
    }
    setSelectedIds(next);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const next = new Set(selectedIds);
      items.forEach((item) => next.add(item.skuId));
      setSelectedIds(next);
    } else {
      const next = new Set(selectedIds);
      items.forEach((item) => next.delete(item.skuId));
      setSelectedIds(next);
    }
  };

  // Bulk Actions submissions
  const handleBulkPriceUpdate = async () => {
    if (selectedIds.size === 0) return;
    try {
      await updatePriceMutation.mutateAsync({
        skuIds: Array.from(selectedIds),
        updateType: priceUpdateType,
        value: priceUpdateValue,
      });
      toast.success("Cập nhật giá hàng loạt thành công!");
      setIsPriceModalOpen(false);
      setSelectedIds(new Set());
      refetch();
    } catch (error: any) {
            toast.error(error?.message || "Lỗi khi cập nhật giá hàng loạt.");
          }
  };

  const handleBulkStockUpdate = async () => {
    if (selectedIds.size === 0) return;
    try {
      await updateStockMutation.mutateAsync({
        skuIds: Array.from(selectedIds),
        updateType: stockUpdateType,
        quantity: stockUpdateValue,
      });
      toast.success("Cập nhật tồn kho hàng loạt thành công!");
      setIsStockModalOpen(false);
      setSelectedIds(new Set());
      refetch();
    } catch (error: any) {
            toast.error(error?.message || "Lỗi khi cập nhật tồn kho hàng loạt.");
          }
  };

  const handleBulkStatusUpdate = async (active: boolean) => {
    if (selectedIds.size === 0) return;
    try {
      await updateStatusMutation.mutateAsync({
        skuIds: Array.from(selectedIds),
        isActive: active,
      });
      toast.success(`Đã chuyển trạng thái sang ${active ? "Hoạt động" : "Vô hiệu"} thành công!`);
      setSelectedIds(new Set());
      refetch();
    } catch (error: any) {
            toast.error(error?.message || "Lỗi khi cập nhật trạng thái hàng loạt.");
          }
  };

  const columns = useSkuColumns();

  const bulkActionsBar = (
    <Guard permission="Permissions.Products.Edit">
      <Button
        onClick={() => setIsPriceModalOpen(true)}
        variant="outline"
        size="sm"
        className="h-8 text-xs font-semibold"
      >
        <CurrencyDollarIcon className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" /> Cập nhật Giá
      </Button>
      <Button
        onClick={() => setIsStockModalOpen(true)}
        variant="outline"
        size="sm"
        className="h-8 text-xs font-semibold"
      >
        <CircleStackIcon className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" /> Cập nhật Tồn kho
      </Button>
      <Button
        onClick={() => handleBulkStatusUpdate(true)}
        variant="outline"
        size="sm"
        className="h-8 text-xs font-semibold"
      >
        <CheckIcon className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" /> Bật hoạt động
      </Button>
      <Button
        onClick={() => handleBulkStatusUpdate(false)}
        variant="outline"
        size="sm"
        className="h-8 text-xs font-semibold hover:bg-error/5 hover:text-error hover:border-error/20"
      >
        <XMarkIcon className="w-3.5 h-3.5 mr-1.5" /> Tắt hoạt động
      </Button>
    </Guard>
  );

  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const toolbarProps = {
    skuCode, setSkuCode,
    productName, setProductName,
    minPrice, setMinPrice,
    maxPrice, setMaxPrice,
    minStock, setMinStock,
    maxStock, setMaxStock,
    isActive, setIsActive,
    sort, setSort,
    STATUS_OPTIONS, SORT_OPTIONS,
    apply, clearFilters, handleLowStockWarning,
    isAdvancedOpen, setIsAdvancedOpen
  };

  return (
    <AdminPageShell
      icon={InboxStackIcon}
      title="Danh sách SKU"
      badge={`${total} SKU`}
      noCard
      actions={<SkuSearchActions {...toolbarProps} />}
      filterBar={<SkuAdvancedPanel {...toolbarProps} />}
    >
      <div className="flex flex-col flex-1 min-h-0 bg-card shadow-none rounded-card overflow-hidden">
        <AdminTable<AdminSkuItem>
          columns={columns}
          data={items}
          isLoading={isLoading}
          skeletonRows={size}
          emptyIcon={ArchiveBoxXMarkIcon}
          emptyTitle="Không tìm thấy SKU phù hợp"
          emptyDescription="Thử chỉnh lại bộ lọc hoặc điều chỉnh khoảng giá/số lượng tồn."
          className="border-0 shadow-none rounded-none bg-transparent flex-1"
          selection={{
            selected: selectedIds,
            onSelect: handleSelect,
            onSelectAll: handleSelectAll,
            getRowKey: (sku: any) => sku.skuId,
          }}
          bulkActions={bulkActionsBar}
          footer={
            <AdminPagination
              page={page}
              totalPages={totalPages}
              total={total}
              pageSize={size}
              onPageChange={goPage}
            />
          }
        />
      </div>

      {/* --- BULK PRICE UPDATE DIALOG --- */}
      {isPriceModalOpen && (
        <Dialog open={true} onOpenChange={(open) => !open && setIsPriceModalOpen(false)}>
          <DialogContent noClose className="w-[95vw] sm:w-full sm:max-w-md p-0 overflow-hidden flex flex-col bg-card rounded-card border-border/40 shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 bg-foreground/[0.015] border-b border-border/40 shrink-0">
              <div>
                <DialogTitle className="text-base font-bold font-display text-foreground tracking-tight normal-case">Cập nhật Giá hàng loạt</DialogTitle>
                <p className="text-[11px] text-muted-foreground mt-0.5">Áp dụng giá mới cho {selectedIds.size} SKU đã chọn</p>
              </div>
              <Button variant="ghost" onClick={() => setIsPriceModalOpen(false)} size="icon" className="text-muted-foreground hover:text-foreground hover:bg-foreground/[0.04] rounded-full w-8 h-8 p-0">
                <XMarkIcon className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <Label variant="default">Hình thức cập nhật</Label>
                <Tabs value={priceUpdateType} onValueChange={(v) => setPriceUpdateType(v as any)} className="w-full">
                  <TabsList className="w-full grid grid-cols-3">
                    <TabsTrigger value="Set">Thiết lập trực tiếp</TabsTrigger>
                    <TabsTrigger value="AdjustAmount">Tăng/Giảm tiền</TabsTrigger>
                    <TabsTrigger value="AdjustPercentage">Tăng/Giảm %</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="space-y-2">
                <Label variant="default">
                  {priceUpdateType === "Set"
                    ? "Giá trị thiết lập (VND)"
                    : priceUpdateType === "AdjustAmount"
                    ? "Số tiền điều chỉnh (VND, dùng số âm để giảm)"
                    : "Tỉ lệ điều chỉnh (%, dùng số âm để giảm)"}
                </Label>
                <Input
                  type="number"
                  value={priceUpdateValue}
                  onChange={(e) => setPriceUpdateValue(Number(e.target.value))}
                  className="font-bold font-mono text-right text-lg"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3 border-t border-border/40">
                <Button type="button" variant="outline" onClick={() => setIsPriceModalOpen(false)} className="h-10 text-xs font-medium rounded-button px-4">
                  Hủy
                </Button>
                <Button
                  onClick={handleBulkPriceUpdate}
                  variant="default"
                  className="h-10 px-6 font-semibold rounded-button text-xs"
                >
                  Xác nhận cập nhật
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* --- BULK STOCK UPDATE DIALOG --- */}
      {isStockModalOpen && (
        <Dialog open={true} onOpenChange={(open) => !open && setIsStockModalOpen(false)}>
          <DialogContent noClose className="w-[95vw] sm:w-full sm:max-w-md p-0 overflow-hidden flex flex-col bg-card rounded-card border-border/40 shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 bg-foreground/[0.015] border-b border-border/40 shrink-0">
              <div>
                <DialogTitle className="text-base font-bold font-display text-foreground tracking-tight normal-case">Cập nhật Tồn kho hàng loạt</DialogTitle>
                <p className="text-[11px] text-muted-foreground mt-0.5">Áp dụng số lượng tồn mới cho {selectedIds.size} SKU đã chọn</p>
              </div>
              <Button variant="ghost" onClick={() => setIsStockModalOpen(false)} size="icon" className="text-muted-foreground hover:text-foreground hover:bg-foreground/[0.04] rounded-full w-8 h-8 p-0">
                <XMarkIcon className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <Label variant="default">Hình thức cập nhật</Label>
                <Tabs value={stockUpdateType} onValueChange={(v) => setStockUpdateType(v as any)} className="w-full">
                  <TabsList className="w-full grid grid-cols-2">
                    <TabsTrigger value="Set">Thiết lập trực tiếp</TabsTrigger>
                    <TabsTrigger value="Adjust">Tăng/Giảm số lượng</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="space-y-2">
                <Label variant="default">
                  {stockUpdateType === "Set" ? "Số lượng tồn kho thiết lập" : "Số lượng tồn kho điều chỉnh (dùng số âm để giảm)"}
                </Label>
                <Input
                  type="number"
                  value={stockUpdateValue}
                  onChange={(e) => setStockUpdateValue(Number(e.target.value))}
                  className="font-bold font-mono text-right text-lg"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3 border-t border-border/40">
                <Button type="button" variant="outline" onClick={() => setIsStockModalOpen(false)} className="h-10 text-xs font-medium rounded-button px-4">
                  Hủy
                </Button>
                <Button
                  onClick={handleBulkStockUpdate}
                  variant="default"
                  className="h-10 px-6 font-semibold rounded-button text-xs"
                >
                  Xác nhận cập nhật
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </AdminPageShell>
  );
}




