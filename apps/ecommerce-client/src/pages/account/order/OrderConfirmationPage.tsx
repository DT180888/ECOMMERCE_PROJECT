import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useOrderDetail } from "@hooks/useOrder";
import { Button } from "@my-project/ui";
import { useCountdown } from "@hooks/useCountdown";
import { getOrderStatusConfig } from "@my-project/shared-utils";
import VietQRPaymentWidget from "@components/order/VietQRPaymentWidget";

const formatVND = (minor?: number | null) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    (minor ?? 0)
  );

const formatDateTime = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleString("vi-VN") : "-";

export default function OrderConfirmationPage() {
  const { id } = useParams();
  const orderId = Number(id);

  const { data: order, isLoading, isError, refetch } = useOrderDetail(orderId, {
    enabled: !!orderId,
  });

  const countdown = useCountdown(order?.expiresAt ?? null);

  useEffect(() => {
    if (countdown?.expired) {
       const timer = setTimeout(() => {
           refetch();
       }, 500);
       return () => clearTimeout(timer);
    }
  }, [countdown?.expired, refetch]);

  const isPendingPayment = order?.status === 1; // AwaitingPayment
  const isCancelled = order?.status === 6;      // Cancelled
  const isPaid = order?.status === 2 || order?.status === 3 || order?.status === 4 || order?.status === 5;

  const statusConfig = order ? getOrderStatusConfig(order.status) : null;

  if (!orderId) return <div className="p-6 text-error font-bold">Thiếu mã đơn hàng.</div>;
  if (isLoading) return <div className="p-6 text-muted animate-pulse">Đang tải đơn hàng…</div>;
  if (isError || !order || !statusConfig) return <div className="p-6 text-error font-bold">Không tìm thấy đơn hàng.</div>;

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link
        to="/account"
        className="inline-flex items-center gap-2 text-[10px] font-bold text-muted uppercase tracking-wider bg-background px-3.5 py-2 rounded-button shadow-neo-sm hover:shadow-neo hover:text-foreground hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-neo-inset-sm transition-all w-fit"
      >
        ← Quay lại bảng điều khiển
      </Link>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-muted/10">
        <div className="space-y-2">
          <h1 className="text-xl font-bold font-display text-foreground">
            Đơn hàng #{order.orderNumber}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-neo-inset-sm ${statusConfig.colorClass}`}>
              <span>{statusConfig.icon}</span>
              <span>{statusConfig.label}</span>
            </span>
            <span className="hidden md:inline">•</span>
            <span>Ngày tạo: {formatDateTime(order.createdAt)}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link to="/account/orders">
            <Button variant="outline" size="sm" className="font-bold text-xs uppercase tracking-wider">
              Lịch sử đơn hàng
            </Button>
          </Link>
          <Link to="/catalog">
            <Button variant="outline" size="sm" className="font-bold text-xs uppercase tracking-wider">
              Tiếp tục mua sắm
            </Button>
          </Link>
        </div>
      </div>

      <div className="space-y-6">
        {/* --- CÁC KHỐI TRẠNG THÁI --- */}
        
        {/* 1. Đang chờ thanh toán & Còn hạn */}
        {isPendingPayment && !countdown?.expired && (
          <div className="bg-background rounded-card shadow-neo-inset-sm p-6 text-foreground">
            <div className="flex items-center gap-4">
              <div className="text-2xl p-3 bg-background rounded-button shadow-neo text-amber-500 animate-pulse">⏳</div>
              <div>
                <div className="font-bold text-base">Vui lòng thanh toán ngay</div>
                <div className="flex items-baseline gap-2 mt-1 text-sm text-muted">
                  <span>Thời gian giữ hàng còn lại:</span>
                  <span className="text-lg font-mono font-bold text-primary">
                    {countdown ? `${countdown.minutes.toString().padStart(2, '0')}:${countdown.seconds.toString().padStart(2, '0')}` : "--:--"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. Đã Hủy */}
        {isCancelled && (
          <div className="bg-background rounded-card shadow-neo-inset-sm p-6 text-foreground">
            <div className="flex items-start gap-4">
              <div className="text-2xl p-3 bg-background rounded-button shadow-neo text-error">🚫</div>
              <div>
                <div className="font-bold text-base mb-1">Đơn hàng đã bị hủy</div>
                <p className="text-sm text-muted leading-relaxed">
                  Đơn hàng này đã bị hủy do quá hạn thanh toán hoặc do bạn yêu cầu hủy bỏ.
                </p>
                <Link to="/catalog" className="inline-block mt-3 text-xs font-bold text-primary uppercase tracking-wider hover:underline">
                  Đặt lại đơn hàng mới
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* 3. Đã Thanh Toán / Hoàn Thành */}
        {isPaid && (
          <div className="bg-background rounded-card shadow-neo-inset-sm p-6 text-foreground">
            <div className="flex items-center gap-4">
              <div className="text-2xl p-3 bg-background rounded-button shadow-neo text-success">🎉</div>
              <div>
                <div className="font-bold text-base mb-1">Cảm ơn bạn đã đặt hàng!</div>
                <div className="text-sm text-muted">
                  Thanh toán thành công. Chúng tôi đang xử lý đơn hàng của bạn.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CỘT TRÁI */}
        <section className="lg:col-span-2 bg-background rounded-card p-6 shadow-neo-inset transition-all duration-300 space-y-6">
          {/* Địa chỉ */}
          <section className="bg-background rounded-card shadow-neo-sm p-6 space-y-4">
            <h2 className="font-bold text-sm uppercase tracking-wider text-foreground pb-2 border-b border-muted/10 flex items-center gap-2">
              <span>📍</span> Thông tin nhận hàng
            </h2>
            <div className="text-xs space-y-2">
              <div className="text-[10px] font-bold text-muted uppercase tracking-[0.15em] mb-1">Giao tới</div>
              {order.shipTo ? (
                <div className="space-y-1">
                  <div className="font-bold text-foreground text-sm">{order.shipTo.recipientName}</div>
                  <div className="text-muted font-mono">{order.shipTo.phone}</div>
                  <div className="text-foreground">
                    {order.shipTo.line1}, {order.shipTo.city}
                  </div>
                </div>
              ) : <span className="text-muted italic">Chưa có thông tin</span>}
            </div>
          </section>

          {/* Sản phẩm */}
          <section className="bg-background rounded-card shadow-neo-sm p-6 space-y-4">
            <h2 className="font-bold text-sm uppercase tracking-wider text-foreground pb-2 border-b border-muted/10 flex items-center gap-2">
              <span>📦</span> Chi tiết sản phẩm
            </h2>
            <div className="overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-[9px] font-bold text-muted uppercase tracking-wider border-b border-muted/10">
                    <th className="py-2 text-left">Sản phẩm</th>
                    <th className="py-2 text-center">Số lượng</th>
                    <th className="py-2 text-right">Tạm tính</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-muted/10">
                  {order.items.map((it) => (
                    <tr key={it.orderItemId}>
                      <td className="py-3 pr-4">
                        <div className="font-bold text-foreground">{it.productName}</div>
                        <div className="text-[10px] text-muted font-mono mt-0.5">SKU: {it.skuName}</div>
                      </td>
                      <td className="py-3 text-center text-muted">x{it.qty}</td>
                      <td className="py-3 text-right font-bold text-foreground">{formatVND(it.lineTotalMinor)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </section>

        {/* CỘT PHẢI */}
        <aside className="space-y-6">
          <div className="bg-background rounded-card shadow-neo p-6 space-y-6">
            <h2 className="font-bold text-sm uppercase tracking-wider text-foreground pb-2 border-b border-muted/10">Tổng thanh toán</h2>
            
            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-muted">
                <span>Tạm tính</span>
                <span className="font-bold text-foreground">{formatVND(order.subtotalMinor)}</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Phí vận chuyển</span>
                <span className="font-bold text-foreground">{formatVND(order.shippingMinor)}</span>
              </div>
              <div className="pt-4 border-t border-muted/10 flex justify-between items-end">
                <span className="text-foreground font-bold">Tổng cộng</span>
                <span className="text-primary font-extrabold text-lg">{formatVND(order.totalMinor)}</span>
              </div>
            </div>

            {/* WIDGET THANH TOÁN VIETQR */}
            {isPendingPayment && !countdown?.expired && (
              <div className="pt-4 border-t border-muted/10">
                <VietQRPaymentWidget 
                  orderId={order.orderId}
                  amount={order.totalMinor} 
                />
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
