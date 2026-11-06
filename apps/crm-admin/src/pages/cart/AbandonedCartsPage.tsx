import { useState, useMemo } from "react";
import { AdminPageShell, AdminDataView } from "@shared/ui";
import {
  ShoppingCartIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";
import {
  Button,
  useToast,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  TextArea,
} from "@my-project/ui";
import { formatVND } from "@my-project/shared-utils";
import {
  DashboardDateFilter,
  calculateRange,
  type DateFilterValue,
} from "@components/dashboard/DashboardDateFilter";
import { useAbandonedCarts, useSendCartRecovery } from "@hooks/useAbandonedCarts";
import { useAbandonedCartColumns } from "@components/cart";
import type { AbandonedCartDto } from "@my-project/api";

const PAGE_SIZE = 15;

export default function AbandonedCartsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [minTotal, setMinTotal] = useState<number | undefined>(undefined);

  // Selected cart for recovery modal
  const [selectedCart, setSelectedCart] = useState<AbandonedCartDto | null>(null);

  // Date Filter
  const [dateFilter, setDateFilter] = useState<DateFilterValue>(() => {
    const resolved = calculateRange("30d");
    return { preset: "30d", from: resolved.from, to: resolved.to, displayLabel: resolved.label };
  });

  const queryParams = {
    page,
    pageSize: PAGE_SIZE,
    from: dateFilter.from,
    to: dateFilter.to,
    minTotalMinor: minTotal,
    keyword: search.trim() || undefined,
  };

  const { data, isLoading } = useAbandonedCarts(queryParams);
  const items = data?.items ?? [];
  const total = data?.total ?? 0;

  // KPI calculations with clear scope
  const stats = useMemo(() => {
    const totalPending = items.reduce((acc, c) => acc + (c.isRecovered ? 0 : c.totalMinor), 0);
    const recoveredCount = items.filter((c) => c.isRecovered).length;
    const recoveryRate = items.length > 0 ? ((recoveredCount / items.length) * 100).toFixed(1) : "0";
    return { totalPending, recoveredCount, recoveryRate };
  }, [items]);

  const columns = useAbandonedCartColumns({
    onSelectCart: setSelectedCart,
  });

  return (
    <>
      <AdminPageShell>
        <AdminPageShell.Header
          icon={ShoppingCartIcon}
          title="Giỏ hàng bỏ quên"
          subtitle={`Kỳ phân tích: ${dateFilter.displayLabel}`}
          badge={`${total}`}
          actions={<DashboardDateFilter
                      value={dateFilter}
                      onChange={(v) => {
                        setDateFilter(v);
                        setPage(1);
                      }}
                    />}
        />

        <AdminPageShell.Body>
          <div className="flex flex-col gap-4 min-h-full">
            {/* ── KPI Cards Strip (Pure Editorial Tonal Contrast - border-0) ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 select-none">
              <div className="p-4 bg-card border-0 rounded-sm shadow-none flex flex-col justify-between gap-1 hover:bg-surface-hover/80 transition-colors">
                <span className="text-xs text-muted-foreground font-medium">
                  Tổng tiền giỏ đang treo
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-lg sm:text-xl font-semibold font-mono tabular-nums text-error">
                    {formatVND(stats.totalPending)}
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground/70 font-sans">
                  Tính trên 15 giỏ trang hiện tại
                </span>
              </div>

              <div className="p-4 bg-card border-0 rounded-sm shadow-none flex flex-col justify-between gap-1 hover:bg-surface-hover/80 transition-colors">
                <span className="text-xs text-muted-foreground font-medium">
                  Số giỏ cần cứu
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-lg sm:text-xl font-semibold font-mono tabular-nums text-foreground">
                    {total}
                  </span>
                  <span className="text-xs text-muted-foreground">giỏ hàng</span>
                </div>
                <span className="text-[10px] text-muted-foreground/70 font-sans">
                  Tổng phát sinh trong kỳ
                </span>
              </div>

              <div className="p-4 bg-card border-0 rounded-sm shadow-none flex flex-col justify-between gap-1 hover:bg-surface-hover/80 transition-colors">
                <span className="text-xs text-muted-foreground font-medium">
                  Đã khôi phục
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-lg sm:text-xl font-semibold font-mono tabular-nums text-success">
                    {stats.recoveredCount}
                  </span>
                  <span className="text-xs text-muted-foreground">đơn</span>
                </div>
                <span className="text-[10px] text-muted-foreground/70 font-sans">
                  Tính trên trang hiện tại
                </span>
              </div>

              <div className="p-4 bg-card border-0 rounded-sm shadow-none flex flex-col justify-between gap-1 hover:bg-surface-hover/80 transition-colors">
                <span className="text-xs text-muted-foreground font-medium">
                  Tỷ lệ cứu giỏ (Recovery Rate)
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-lg sm:text-xl font-semibold font-mono tabular-nums text-primary">
                    {stats.recoveryRate}%
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground/70 font-sans">
                  Hiệu quả chuyển đổi
                </span>
              </div>
            </div>

            {/* ── Data Table / Responsive Card View ── */}
            <AdminDataView
              columns={columns}
              data={items}
              isLoading={isLoading}
              rowKey="cartId"
              enableCardView
              storageKey="crm_abandoned_carts_view_mode"
              search={{
                query: search,
                onChange: (val) => {
                  setSearch(val);
                  setPage(1);
                },
                placeholder: "Tìm theo tên, email, sđt...",
              }}
              filterBar={
                <div className="flex items-center gap-3 w-full">
                       <div className="max-w-1/3 flex items-center justify-end gap-2">
                    {/* <span className="text-xs whitespace-nowrap text-muted-foreground font-medium hidden md:inline">Lọc giá trị:</span> */}
                    <Select
                      value={minTotal ? String(minTotal) : "ALL"}
                      onValueChange={(val) => {
                        setMinTotal(val === "ALL" ? undefined : Number(val));
                        setPage(1);
                      }}
                    >
                      <SelectTrigger className="h-[34px] w-40 sm:w-44 bg-card text-xs rounded-sm border-border shadow-none">
                        <SelectValue placeholder="Tất cả giá trị" />
                      </SelectTrigger>
                      <SelectContent className="rounded-sm border-border bg-card shadow-md">
                        <SelectItem value="ALL">Tất cả giá trị</SelectItem>
                        <SelectItem value="500000">&gt;= 500.000 đ</SelectItem>
                        <SelectItem value="1000000">&gt;= 1.000.000 đ</SelectItem>
                        <SelectItem value="2000000">&gt;= 2.000.000 đ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {/* <div className="w-2/3">
                    <DashboardDateFilter
                      value={dateFilter}
                      onChange={(v) => {
                        setDateFilter(v);
                        setPage(1);
                      }}
                    />
                  </div> */}

             
                </div>
              }
              emptyText="Không có giỏ hàng bị bỏ quên nào phù hợp."
              pagination={{
                page,
                total,
                pageSize: PAGE_SIZE,
                onPageChange: setPage,
              }}
            />
          </div>
        </AdminPageShell.Body>
      </AdminPageShell>

      {/* Recovery Modal */}
      {selectedCart && (
        <SendRecoveryModal
          cart={selectedCart}
          onClose={() => setSelectedCart(null)}
        />
      )}
    </>
  );
}

// ── Send Recovery Email Modal ──
interface SendRecoveryModalProps {
  cart: AbandonedCartDto;
  onClose: () => void;
}

function SendRecoveryModal({ cart, onClose }: SendRecoveryModalProps) {
  const [couponCode, setCouponCode] = useState("RECOVER5");
  const [customNote, setCustomNote] = useState("");
  const recoveryMut = useSendCartRecovery();
  const toast = useToast();

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await recoveryMut.mutateAsync({
        cartId: cart.cartId,
        payload: {
          couponCode: couponCode.trim() || undefined,
          customNote: customNote.trim() || undefined,
        },
      });
      toast.success(`Đã gửi email cứu giỏ hàng thành công tới ${cart.customerEmail || cart.customerName}`);
      onClose();
    } catch {
      toast.error("Không thể gửi email nhắc nhở. Vui lòng thử lại");
    }
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md p-5 rounded-md border border-border bg-card shadow-md">
        <DialogHeader className="pb-3 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-sm bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <PaperAirplaneIcon className="w-4 h-4 stroke-[1.75]" />
            </div>
            <DialogTitle className="text-sm font-semibold text-foreground">
              Gửi Email Cứu Giỏ Hàng
            </DialogTitle>
          </div>
        </DialogHeader>

        <form onSubmit={handleSend} className="pt-3.5 flex flex-col gap-3.5 font-sans">
          <div className="p-3 bg-surface/60 border-0 rounded-sm flex flex-col gap-1 text-xs">
            <span className="text-muted-foreground font-medium">Người nhận:</span>
            <span className="font-semibold text-foreground">
              {cart.customerName} ({cart.customerEmail || cart.customerPhone || cart.userId})
            </span>
            <span className="text-muted-foreground font-medium mt-1">Giá trị giỏ hàng:</span>
            <span className="font-mono font-semibold text-error text-sm">
              {formatVND(cart.totalMinor)} ({cart.totalItemsCount} sản phẩm)
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-foreground">Mã ưu đãi đính kèm (Coupon):</label>
            <Input
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              placeholder="VD: RECOVER5, GIAM10K..."
              className="h-[34px] bg-surface/60 border-border text-xs rounded-sm text-foreground font-mono focus:ring-1 focus:ring-primary shadow-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-foreground">Lời nhắn tư vấn thêm (tùy chọn):</label>
            <TextArea
              rows={3}
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder="Nhập lời nhắn cá nhân hóa của nhân viên CSKH..."
              className="w-full bg-surface/60 border-border p-2.5 text-xs rounded-sm text-foreground resize-none focus:ring-1 focus:ring-primary shadow-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="h-[34px] px-3.5 text-xs rounded-sm font-medium shadow-none hover:bg-surface"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={recoveryMut.isPending}
              className="h-[34px] px-4 text-xs rounded-sm shadow-none font-semibold"
            >
              {recoveryMut.isPending ? "Đang gửi..." : "Gửi Email Ngay"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
