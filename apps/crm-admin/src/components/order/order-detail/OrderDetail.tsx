import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  useAdminOrderDetail,
  useUpdateAdminOrderStatus,
  useUpdateShipmentTracking,
} from "@hooks/useOrder";
import { ArrowLeftIcon, ShoppingBagIcon } from "@heroicons/react/24/outline";
import { useToast, Button } from "@my-project/ui";
import { AdminPageShell } from "@shared/ui";

import { OrderLifecycleBar } from "./OrderLifecycleBar";
import { OrderItemsCard } from "./OrderItemsCard";
import { OrderShipmentCard } from "./OrderShipmentCard";
import { OrderSummaryCard } from "./OrderSummaryCard";
import { OrderCustomerCard } from "./OrderCustomerCard";
import { OrderPaymentHistoryCard } from "./OrderPaymentHistoryCard";

const formatDateTime = (iso?: string | null) =>
  iso
    ? new Date(iso).toLocaleString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

export function OrderDetail() {
  const { id } = useParams();
  const orderId = Number(id);
  const toast = useToast();

  const { data: order, isLoading, isError, refetch } = useAdminOrderDetail(orderId, {
    enabled: !!orderId,
  });
  const updateStatus = useUpdateAdminOrderStatus();
  const updateShipmentTracking = useUpdateShipmentTracking();

  const [nextStatus, setNextStatus] = useState<number | null>(null);
  const [trackingDraft, setTrackingDraft] = useState<Record<number, string>>({});

  useEffect(() => {
    if (order && nextStatus === null) {
      setNextStatus(order.status);
    }
  }, [order, nextStatus]);

  if (!orderId) {
    return (
      <AdminPageShell>
        <AdminPageShell.Body>
          <div className="p-8 text-center text-error font-mono text-xs">
            Thiếu ID đơn hàng.
          </div>
        </AdminPageShell.Body>
      </AdminPageShell>
    );
  }

  if (isLoading) {
    return (
      <AdminPageShell>
        <AdminPageShell.Body>
          <div className="p-12 text-center text-muted-foreground animate-pulse font-mono text-xs">
            Đang tải dữ liệu chi tiết đơn hàng #{orderId}...
          </div>
        </AdminPageShell.Body>
      </AdminPageShell>
    );
  }

  if (isError || !order) {
    return (
      <AdminPageShell>
        <AdminPageShell.Body>
          <div className="p-8 text-center text-error font-mono text-xs">
            Không tìm thấy thông tin cho đơn hàng #{orderId}.
          </div>
        </AdminPageShell.Body>
      </AdminPageShell>
    );
  }

  const handleChangeStatus = () => {
    if (nextStatus == null || nextStatus === order.status) {
      toast.info("Vui lòng chọn trạng thái mới khác trạng thái hiện tại.");
      return;
    }
    toast.confirm(
      "Bạn có chắc muốn cập nhật trạng thái đơn hàng?",
      async () => {
        try {
          await updateStatus.mutateAsync({ orderId, status: nextStatus });
          toast.success("Cập nhật trạng thái đơn hàng thành công!");
        } catch (error) {
          const err = error as { response?: { data?: { error?: string } }; message?: string };
          toast.error(err?.message || "Lỗi cập nhật trạng thái.");
          await refetch();
        }
      },
      "Cập nhật"
    );
  };

  const handleSaveTracking = (shipmentId: number) => {
    const value = trackingDraft[shipmentId] ?? "";
    const trackingNumber = value.trim();
    if (!trackingNumber) {
      toast.error("Vui lòng nhập mã vận đơn trước khi lưu.");
      return;
    }
    const currentTracking =
      order.shipments?.find((s) => s.shipmentId === shipmentId)?.trackingNumber ?? "";
    if (trackingNumber === currentTracking) {
      toast.info("Mã vận đơn không thay đổi.");
      return;
    }
    toast.confirm(
      "Xác nhận cập nhật mã vận đơn này?",
      async () => {
        try {
          await updateShipmentTracking.mutateAsync({ shipmentId, trackingNumber } as any);
          toast.success("Cập nhật mã vận đơn thành công!");
          setTrackingDraft((prev) => {
            const d = { ...prev };
            delete d[shipmentId];
            return d;
          });
          await refetch();
        } catch (error: any) {
          toast.error(error?.message || "Lỗi cập nhật mã vận đơn.");
        }
      },
      "Lưu mã"
    );
  };

  return (
    <AdminPageShell>
      {/* ── Studio Horizon Strip Header (Locked to h-11 baseline) ── */}
      <AdminPageShell.Header
        icon={ShoppingBagIcon}
        title={`Đơn hàng #${order.orderNumber}`}
        badge={`ID: #${order.orderId}`}
        subtitle={`Tạo lúc ${formatDateTime(order.createdAt)} • Tiền tệ: ${order.currency}`}
        actions={
          <div className="flex items-center gap-2 shrink-0">
            <Link to="/admin/orders">
              <Button
                variant="outline"
                size="default"
                className="h-8 px-3 text-xs rounded-[2px] border-border/70 text-muted-foreground hover:text-foreground shadow-none"
              >
                <ArrowLeftIcon className="w-3.5 h-3.5 stroke-[1.25] mr-1" />
                <span className="hidden md:inline">Quay lại danh sách</span>
                <span className="md:hidden">Quay lại</span>
              </Button>
            </Link>
          </div>
        }
      />

      <AdminPageShell.Body className="pb-12">
        {/* ── Order Lifecycle Progression & Quick Actions ── */}
        <OrderLifecycleBar
          currentStatus={order.status}
          statusText={order.statusText}
          notes={order.notes}
          nextStatus={nextStatus}
          onNextStatusChange={setNextStatus}
          onChangeStatus={handleChangeStatus}
          isUpdating={updateStatus.isPending}
        />

        {/* ── Main Two-Column Studio Canvas ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 items-start">
          {/* LEFT COLUMN: Items & Shipments (md:col-span-7 or xl:col-span-8) */}
          <div className="md:col-span-7 xl:col-span-8 flex flex-col gap-4 md:gap-6 min-w-0">
            <OrderItemsCard items={order.items || []} />

            <OrderShipmentCard
              shipments={order.shipments || []}
              trackingDraft={trackingDraft}
              onDraftChange={(id, val) =>
                setTrackingDraft((prev) => ({ ...prev, [id]: val }))
              }
              onSaveTracking={handleSaveTracking}
              isUpdating={updateShipmentTracking.isPending}
            />
          </div>

          {/* RIGHT COLUMN: Summary, Customer, Payments (md:col-span-5 or xl:col-span-4) */}
          <div className="md:col-span-5 xl:col-span-4 flex flex-col gap-4 md:gap-6 min-w-0">
            <OrderSummaryCard
              subtotalMinor={order.subtotalMinor || 0}
              shippingMinor={order.shippingMinor || 0}
              discountMinor={order.discountMinor || 0}
              taxMinor={order.taxMinor || 0}
              totalMinor={order.totalMinor || 0}
              currency={order.currency}
            />

            <OrderCustomerCard
              email={order.email}
              shipTo={order.shipToAddress || order.shipTo}
              notes={order.notes}
            />

            <OrderPaymentHistoryCard payments={order.payments || []} />
          </div>
        </div>
      </AdminPageShell.Body>
    </AdminPageShell>
  );
}

export const AdminOrderDetail = OrderDetail;
export default OrderDetail;
