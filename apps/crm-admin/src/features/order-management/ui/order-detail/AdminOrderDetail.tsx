import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAdminOrderDetail, useUpdateAdminOrderStatus } from "@entities/order/admin";
import { useUpdateShipmentTracking } from "@entities/shipment/admin";
import { CreditCardIcon, CubeIcon, TagIcon, MapPinIcon, UserIcon, PhoneIcon } from "@heroicons/react/24/outline";
import { useToast } from "@my-project/ui";
import { AdminTable } from "@shared/ui/table";

import { OrderDetailHeader } from "./OrderDetailHeader";
import { OrderShipmentCard } from "./OrderShipmentCard";

const formatVND = (minor: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(minor ?? 0);

const formatDateTime = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleString("vi-VN", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }) : "—";

const DetailCardHeader = ({ title, icon: Icon }: { title: string; icon: React.ElementType }) => (
  <div className="flex items-center gap-2 pb-3 mb-4">
    <Icon className="w-5 h-5 text-primary" />
    <h3 className="font-bold text-foreground text-sm uppercase tracking-wide">{title}</h3>
  </div>
);

export function AdminOrderDetail() {
  const { id } = useParams();
  const orderId = Number(id);
  const toast = useToast();

  const { data: order, isLoading, isError, refetch } = useAdminOrderDetail(orderId, { enabled: !!orderId });
  const updateStatus = useUpdateAdminOrderStatus();
  const updateShipmentTracking = useUpdateShipmentTracking();

  const [nextStatus, setNextStatus] = useState<number | null>(null);
  const [trackingDraft, setTrackingDraft] = useState<Record<number, string>>({});

  useEffect(() => {
    if (order && nextStatus === null) {
      setNextStatus(order.status);
    }
  }, [order, nextStatus]);

  if (!orderId) return <div className="p-8 text-center text-destructive">Thiếu ID đơn hàng.</div>;
  if (isLoading) return <div className="p-8 text-center text-muted-foreground animate-pulse">Đang tải chi tiết đơn hàng...</div>;
  if (isError || !order) return <div className="p-8 text-center text-destructive">Không tìm thấy đơn hàng.</div>;

  const handleChangeStatus = () => {
    if (nextStatus == null || nextStatus === order.status) {
      toast.info("Vui lòng chọn trạng thái mới khác trạng thái hiện tại.");
      return;
    }
    toast.confirm("Bạn có chắc muốn cập nhật trạng thái đơn hàng?", async () => {
      try {
        await updateStatus.mutateAsync({ orderId, status: nextStatus });
        toast.success("Cập nhật trạng thái thành công!");
      } catch (error) {
        const err = error as { response?: { data?: { error?: string } }; message?: string };
        toast.error(err?.message || "Lỗi cập nhật trạng thái.");
        await refetch();
      }
    }, "Cập nhật");
  };

  const handleSaveTracking = (shipmentId: number) => {
    const value = trackingDraft[shipmentId] ?? "";
    const trackingNumber = value.trim();
    if (!trackingNumber) { toast.error("Vui lòng nhập mã vận đơn trước khi lưu."); return; }
    const isSame = trackingNumber === (order.shipments.find((s: any) => s.shipmentId === shipmentId)?.trackingNumber ?? "");
    if (isSame) { toast.info("Mã vận đơn không thay đổi."); return; }
    toast.confirm("Xác nhận cập nhật mã vận đơn này?", async () => {
      try {
        await updateShipmentTracking.mutateAsync({ shipmentId, trackingNumber });
        toast.success("Cập nhật mã vận đơn thành công!");
        setTrackingDraft((prev) => { const d = { ...prev }; delete d[shipmentId]; return d; });
      } catch (error: any) {
        toast.error(error?.message || "Lỗi cập nhật mã vận đơn.");
      }
    }, "Lưu mã");
  };

  return (
    <div className="flex flex-col min-h-screen responsive-gap w-full pb-8 font-sans">
      <OrderDetailHeader
        order={order}
        nextStatus={nextStatus}
        onNextStatusChange={setNextStatus}
        onChangeStatus={handleChangeStatus}
        isUpdating={updateStatus.isPending}
      />

      <div className="flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-3 responsive-gap">
          {/* LEFT COLUMN: Product List & Shipments */}
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-card rounded-card overflow-hidden border border-foreground/[0.04] dark:border-white/[0.05] shadow-neo-sm">
              <div className="p-6">
                <DetailCardHeader title="Danh sách sản phẩm" icon={TagIcon} />
                <AdminTable
                  columns={[
                    {
                      key: "product", label: "Sản phẩm", isMain: true,
                      render: (it: any) => (
                        <div className="flex items-start gap-3">
                          <div className="h-10 w-10 rounded-inner bg-muted/20 border border-foreground/[0.04] dark:border-white/[0.05] flex items-center justify-center text-muted-foreground shrink-0">
                            <CubeIcon className="w-5 h-5 opacity-40" />
                          </div>
                          <div>
                            <div className="font-medium text-foreground text-sm leading-tight">{it.productName}</div>
                            <div className="text-[10px] text-accent/90 mt-1 font-mono bg-accent/10 px-1.5 py-0.5 rounded-[4px] inline-block">{it.skuName}</div>
                          </div>
                        </div>
                      )
                    },
                    { key: "qty", label: "Số lượng", align: "center", minWidth: "100px", render: (it: any) => <span className="bg-muted/20 text-foreground px-2.5 py-1 rounded-inner font-mono font-bold text-xs">{it.qty}</span> },
                    { key: "price", label: "Đơn giá", align: "right", minWidth: "130px", render: (it: any) => <span className="text-muted-foreground font-mono text-xs">{formatVND(it.unitPriceMinor)}</span> },
                    { key: "total", label: "Thành tiền", align: "right", minWidth: "130px", render: (it: any) => <span className="font-bold text-foreground font-mono text-sm">{formatVND(it.lineTotalMinor || 0)}</span> }
                  ]}
                  data={order.items}
                />
              </div>
            </section>

            <OrderShipmentCard
              shipments={order.shipments}
              trackingDraft={trackingDraft}
              onDraftChange={(id, val) => setTrackingDraft((prev) => ({ ...prev, [id]: val }))}
              onSaveTracking={handleSaveTracking}
              isUpdating={updateShipmentTracking.isPending}
            />
          </div>

          {/* RIGHT COLUMN: Summary & Address */}
          <div className="space-y-6">
            <section className="bg-card rounded-card p-6 border border-foreground/[0.04] dark:border-white/[0.05] shadow-neo-sm">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-foreground/[0.04] dark:border-white/[0.05]">
                <h3 className="font-bold font-display text-foreground text-sm uppercase tracking-wider">Tổng giá trị</h3>
                <CreditCardIcon className="w-5 h-5 text-accent" />
              </div>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-muted-foreground"><span>Tạm tính</span><span className="font-mono text-foreground">{formatVND(order.subtotalMinor)}</span></div>
                <div className="flex justify-between text-muted-foreground"><span>Phí vận chuyển</span><span className="font-mono text-foreground">{formatVND(order.shippingMinor)}</span></div>
                <div className="flex justify-between text-red-600 dark:text-red-400 font-medium"><span>Giảm giá</span><span className="font-mono">-{formatVND(order.discountMinor)}</span></div>
                <div className="flex justify-between text-muted-foreground"><span>Thuế</span><span className="font-mono text-foreground">{formatVND(order.taxMinor)}</span></div>
                <div className="border-t border-foreground/[0.04] dark:border-white/[0.05] pt-3 mt-2 flex justify-between items-baseline">
                  <span className="text-foreground font-bold">Tổng thanh toán</span>
                  <span className="text-xl font-bold text-foreground font-mono tracking-tight">{formatVND(order.totalMinor)}</span>
                </div>
              </div>
            </section>

            <section className="bg-card rounded-card p-6 border border-foreground/[0.04] dark:border-white/[0.05] shadow-neo-sm">
              <DetailCardHeader title="Lịch sử thanh toán" icon={CreditCardIcon} />
              <div className="space-y-3">
                {order.payments.length > 0 ? order.payments.map((p: any) => (
                  <div key={p.paymentId} className="bg-muted/10 border border-foreground/[0.04] dark:border-white/[0.05] p-3 rounded-card transition-colors hover:bg-muted/20">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-foreground text-xs">{p.provider}</span>
                      <span className="font-mono text-foreground text-xs font-bold">{formatVND(p.amountMinor)}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-muted-foreground">{formatDateTime(p.paidAt || p.createdAt)}</span>
                      <span className={`px-2 py-0.5 rounded-inner uppercase font-semibold tracking-wider text-[9px] ${p.status === 2 ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-amber-500/10 text-amber-600 dark:text-amber-400"}`}>{p.statusText}</span>
                    </div>
                  </div>
                )) : <div className="text-center py-4 text-muted-foreground text-xs italic">Chưa có thông tin thanh toán.</div>}
              </div>
            </section>

            <section className="bg-card rounded-card p-6 border border-foreground/[0.04] dark:border-white/[0.05] shadow-neo-sm">
              <DetailCardHeader title="Địa chỉ giao hàng" icon={MapPinIcon} />
              {order.shipTo ? (
                <div className="space-y-4 text-xs">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 text-accent"><UserIcon className="w-3 h-3 md:w-4 md:h-4" /></div>
                    <div><div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-0.5">Người nhận</div><div className="text-foreground font-medium">{order.shipTo.recipientName}</div></div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center shrink-0 text-indigo-500 dark:text-indigo-400"><PhoneIcon className="w-3 h-3 md:w-4 md:h-4" /></div>
                    <div><div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-0.5">Số điện thoại</div><div className="text-foreground font-mono">{order.shipTo.phone}</div></div>
                  </div>
                  <div className="pt-3 border-t border-foreground/[0.04] dark:border-white/[0.05]">
                    <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-2">Địa chỉ chi tiết</div>
                    <div className="text-muted-foreground text-xs leading-relaxed bg-muted/10 border border-foreground/[0.04] dark:border-white/[0.05] p-3 rounded-button">
                      {order.shipTo.line1}{order.shipTo.line2 && <><br />{order.shipTo.line2}</>}<br />
                      <span className="text-foreground font-medium">{order.shipTo.city}, {order.shipTo.state}</span><br />{order.shipTo.country}
                    </div>
                  </div>
                </div>
              ) : <div className="text-center py-4 text-muted-foreground text-xs italic">Không có thông tin địa chỉ.</div>}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
