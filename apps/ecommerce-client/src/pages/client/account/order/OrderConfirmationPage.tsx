import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useOrderDetail } from "@entities/order/hooks";
import { Button } from "@my-project/ui";
import { useCountdown } from "@shared/hooks/useCountdown";
import { getOrderStatusConfig } from "@my-project/shared-utils";
import PayButton from "@features/client/payment/ui/PayButton";

const formatVND = (minor?: number | null) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    (minor ?? 0)
  );

const formatDateTime = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleString("vi-VN") : "-";


export default function OrderConfirmationPage() {
  const { id } = useParams();
  const orderId = Number(id);

  // Láº¥y hÃ m refetch Ä‘á»ƒ reload dá»¯ liá»‡u
  const { data: order, isLoading, isError, refetch } = useOrderDetail(orderId, {
    enabled: !!orderId,
  });

  const countdown = useCountdown(order?.expiresAt ?? null);

  useEffect(() => {
    if (countdown?.expired) {
       // ThÃªm timeout nhá» (500ms) Ä‘á»ƒ cháº¯c cháº¯n server time Ä‘Ã£ qua má»‘c ExpiresAt
       const timer = setTimeout(() => {
           refetch();
       }, 500);
       return () => clearTimeout(timer);
    }
  }, [countdown?.expired, refetch]);

  // --- DERIVED STATE ---
  const isPendingPayment = order?.status === 1; // AwaitingPayment
  const isCancelled = order?.status === 6;      // Cancelled
  const isPaid = order?.status === 2 || order?.status === 3 || order?.status === 4 || order?.status === 5;

  const statusConfig = order ? getOrderStatusConfig(order.status) : null;

  // --- EARLY RETURNS ---
  if (!orderId) return <div className="p-6 text-error font-bold">Thiáº¿u mÃ£ Ä‘Æ¡n hÃ ng.</div>;
  if (isLoading) return <div className="p-6 text-muted animate-pulse">Äang táº£i Ä‘Æ¡n hÃ ngâ€¦</div>;
  if (isError || !order || !statusConfig) return <div className="p-6 text-error font-bold">KhÃ´ng tÃ¬m tháº¥y Ä‘Æ¡n hÃ ng.</div>;

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link
        to="/account"
        className="inline-flex items-center gap-2 text-[10px] font-bold text-muted uppercase tracking-wider bg-background px-3.5 py-2 rounded-button shadow-neo-sm hover:shadow-neo hover:text-foreground hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-neo-inset-sm transition-all w-fit"
      >
        â† Quay láº¡i báº£ng Ä‘iá»u khiá»ƒn
      </Link>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-muted/10">
        <div className="space-y-2">
          <h1 className="text-xl font-bold font-display text-foreground">
            ÄÆ¡n hÃ ng #{order.orderNumber}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-neo-inset-sm ${statusConfig.colorClass}`}>
              <span>{statusConfig.icon}</span>
              <span>{statusConfig.label}</span>
            </span>
            <span className="hidden md:inline">â€¢</span>
            <span>NgÃ y táº¡o: {formatDateTime(order.createdAt)}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link to="/account/orders">
            <Button variant="outline" size="sm" className="font-bold text-xs uppercase tracking-wider">
              Lá»‹ch sá»­ Ä‘Æ¡n hÃ ng
            </Button>
          </Link>
          <Link to="/catalog">
            <Button variant="outline" size="sm" className="font-bold text-xs uppercase tracking-wider">
              Tiáº¿p tá»¥c mua sáº¯m
            </Button>
          </Link>
        </div>
      </div>

      <div className="space-y-6">
        {/* --- CÃC KHá»I TRáº NG THÃI (Chá»‰ hiá»ƒn thá»‹ 1 trong cÃ¡c khá»‘i nÃ y) --- */}
        
        {/* 1. Äang chá» thanh toÃ¡n & CÃ²n háº¡n */}
        {isPendingPayment && !countdown?.expired && (
          <div className="bg-background rounded-card shadow-neo-inset-sm p-6 text-foreground">
            <div className="flex items-center gap-4">
              <div className="text-2xl p-3 bg-background rounded-button shadow-neo text-amber-500 animate-pulse">â³</div>
              <div>
                <div className="font-bold text-base">Vui lÃ²ng thanh toÃ¡n ngay</div>
                <div className="flex items-baseline gap-2 mt-1 text-sm text-muted">
                  <span>Thá»i gian giá»¯ hÃ ng cÃ²n láº¡i:</span>
                  <span className="text-lg font-mono font-bold text-primary">
                    {countdown ? `${countdown.minutes.toString().padStart(2, '0')}:${countdown.seconds.toString().padStart(2, '0')}` : "--:--"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. ÄÃ£ Há»§y (Do háº¿t háº¡n hoáº·c tá»± há»§y) */}
        {isCancelled && (
          <div className="bg-background rounded-card shadow-neo-inset-sm p-6 text-foreground">
            <div className="flex items-start gap-4">
              <div className="text-2xl p-3 bg-background rounded-button shadow-neo text-error">ðŸš«</div>
              <div>
                <div className="font-bold text-base mb-1">ÄÆ¡n hÃ ng Ä‘Ã£ bá»‹ há»§y</div>
                <p className="text-sm text-muted leading-relaxed">
                  ÄÆ¡n hÃ ng nÃ y Ä‘Ã£ bá»‹ há»§y do quÃ¡ háº¡n thanh toÃ¡n hoáº·c do báº¡n yÃªu cáº§u há»§y bá».
                </p>
                <Link to="/catalog" className="inline-block mt-3 text-xs font-bold text-primary uppercase tracking-wider hover:underline">
                  Äáº·t láº¡i Ä‘Æ¡n hÃ ng má»›i
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* 3. ÄÃ£ Thanh ToÃ¡n / HoÃ n ThÃ nh */}
        {isPaid && (
          <div className="bg-background rounded-card shadow-neo-inset-sm p-6 text-foreground">
            <div className="flex items-center gap-4">
              <div className="text-2xl p-3 bg-background rounded-button shadow-neo text-success">ðŸŽ‰</div>
              <div>
                <div className="font-bold text-base mb-1">Cáº£m Æ¡n báº¡n Ä‘Ã£ Ä‘áº·t hÃ ng!</div>
                <div className="text-sm text-muted">
                  Thanh toÃ¡n thÃ nh cÃ´ng. ChÃºng tÃ´i Ä‘ang xá»­ lÃ½ Ä‘Æ¡n hÃ ng cá»§a báº¡n.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cá»˜T TRÃI: ThÃ´ng tin chi tiáº¿t (Sunken Tray) */}
        <section className="lg:col-span-2 bg-background rounded-card p-6 shadow-neo-inset transition-all duration-300 space-y-6">
          {/* Äá»‹a chá»‰ */}
          <section className="bg-background rounded-card shadow-neo-sm p-6 space-y-4">
            <h2 className="font-bold text-sm uppercase tracking-wider text-foreground pb-2 border-b border-muted/10 flex items-center gap-2">
              <span>ðŸ“</span> ThÃ´ng tin nháº­n hÃ ng
            </h2>
            <div className="text-xs space-y-2">
              <div className="text-[10px] font-bold text-muted uppercase tracking-[0.15em] mb-1">Giao tá»›i</div>
              {order.shipTo ? (
                <div className="space-y-1">
                  <div className="font-bold text-foreground text-sm">{order.shipTo.recipientName}</div>
                  <div className="text-muted font-mono">{order.shipTo.phone}</div>
                  <div className="text-foreground">
                    {order.shipTo.line1}, {order.shipTo.city}
                  </div>
                </div>
              ) : <span className="text-muted italic">ChÆ°a cÃ³ thÃ´ng tin</span>}
            </div>
          </section>

          {/* Sáº£n pháº©m */}
          <section className="bg-background rounded-card shadow-neo-sm p-6 space-y-4">
            <h2 className="font-bold text-sm uppercase tracking-wider text-foreground pb-2 border-b border-muted/10 flex items-center gap-2">
              <span>ðŸ“¦</span> Chi tiáº¿t sáº£n pháº©m
            </h2>
            <div className="overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-[9px] font-bold text-muted uppercase tracking-wider border-b border-muted/10">
                    <th className="py-2 text-left">Sáº£n pháº©m</th>
                    <th className="py-2 text-center">Sá»‘ lÆ°á»£ng</th>
                    <th className="py-2 text-right">Táº¡m tÃ­nh</th>
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

        {/* Cá»˜T PHáº¢I: Tá»•ng tiá»n & NÃºt Thanh ToÃ¡n */}
        <aside className="space-y-6">
          <div className="bg-background rounded-card shadow-neo p-6 space-y-6">
            <h2 className="font-bold text-sm uppercase tracking-wider text-foreground pb-2 border-b border-muted/10">Tá»•ng thanh toÃ¡n</h2>
            
            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-muted">
                <span>Táº¡m tÃ­nh</span>
                <span className="font-bold text-foreground">{formatVND(order.subtotalMinor)}</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>PhÃ­ váº­n chuyá»ƒn</span>
                <span className="font-bold text-foreground">{formatVND(order.shippingMinor)}</span>
              </div>
              <div className="pt-4 border-t border-muted/10 flex justify-between items-end">
                <span className="text-foreground font-bold">Tá»•ng cá»™ng</span>
                <span className="text-primary font-extrabold text-lg">{formatVND(order.totalMinor)}</span>
              </div>
            </div>

            {/* BUTTON THANH TOÃN - Chá»‰ hiá»‡n khi Ä‘Ãºng Ä‘iá»u kiá»‡n */}
            {isPendingPayment && !countdown?.expired && (
              <div className="space-y-3 pt-2">
                <PayButton 
                  orderId={order.orderId} 
                  className="w-full rounded-button py-3 shadow-neo hover:shadow-neo-hover active:shadow-neo-inset-sm font-bold text-xs uppercase tracking-widest bg-primary text-primary-foreground duration-300 transition-all hover:-translate-y-0.5 active:translate-y-0.5"
                >
                  Thanh toÃ¡n ngay
                </PayButton>
                <p className="text-[9px] font-bold text-center text-muted uppercase tracking-[0.1em]">Báº£o máº­t qua cá»•ng VNPAY</p>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

