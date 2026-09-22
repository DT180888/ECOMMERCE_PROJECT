import { useState } from "react";
import { Link } from "react-router-dom";
import { useMyOrders } from "@entities/order/hooks";
import { Button } from "@my-project/ui";
// 1. Import cáº¥u hÃ¬nh tráº¡ng thÃ¡i chung
import { getOrderStatusConfig } from "@my-project/shared-utils";
import { EyeIcon, ShoppingBagIcon } from "@heroicons/react/24/outline"; // ThÃªm icon cho sinh Ä‘á»™ng

const formatVND = (minor: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    (minor ?? 0)
  );

const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString("vi-VN", {
     year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
  });

export default function OrderHistoryPage() {
  const [page, setPage] = useState(1);
  const size = 10;

  const { data, isLoading } = useMyOrders({ page, size });

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / size));

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link
        to="/account"
        className="inline-flex items-center gap-2 text-[10px] font-bold text-muted uppercase tracking-wider bg-background px-3.5 py-2 rounded-button shadow-neo-sm hover:shadow-neo hover:text-foreground hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-neo-inset-sm transition-all w-fit"
      >
        â† Quay láº¡i báº£ng Ä‘iá»u khiá»ƒn
      </Link>

      {/* Header Page */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-muted/10">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-button bg-background shadow-neo-inset-sm text-primary">
            <ShoppingBagIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-display text-foreground">
              ÄÆ¡n hÃ ng cá»§a tÃ´i
            </h1>
            <p className="text-xs text-muted mt-0.5">Theo dÃµi lá»‹ch sá»­ mua sáº¯m cá»§a báº¡n</p>
          </div>
        </div>
        <Link to="/catalog">
          <Button variant="outline" size="sm" className="font-bold text-xs uppercase tracking-wider">
            Tiáº¿p tá»¥c mua sáº¯m
          </Button>
        </Link>
      </div>

      {/* Orders List / Table Container (Sunken Tray) */}
      <section className="bg-background rounded-card p-6 shadow-neo-inset transition-all duration-300">
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-y-3">
            <thead>
              <tr className="text-[10px] font-bold text-muted uppercase tracking-[0.2em]">
                <th className="px-6 py-3 text-left">MÃ£ Ä‘Æ¡n</th>
                <th className="px-6 py-3 text-left hidden md:table-cell">NgÃ y Ä‘áº·t</th>
                <th className="px-6 py-3 text-left">Sáº£n pháº©m</th>
                <th className="px-6 py-3 text-right">Tá»•ng tiá»n</th>
                <th className="px-6 py-3 text-center">Tráº¡ng thÃ¡i</th>
                <th className="px-6 py-3 text-center">Chi tiáº¿t</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-6 py-4">
                      <div className="h-16 bg-muted/10 rounded-button shadow-neo-inset-sm w-full"></div>
                    </td>
                  </tr>
                ))
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted">
                    <div className="flex flex-col items-center gap-4 py-8">
                      <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center shadow-neo-inset">
                        <ShoppingBagIcon className="w-8 h-8 text-muted" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-foreground">Báº¡n chÆ°a cÃ³ Ä‘Æ¡n hÃ ng nÃ o</p>
                        <p className="text-xs text-muted">Báº¯t Ä‘áº§u Ä‘áº·t hÃ ng Ä‘á»ƒ xem danh sÃ¡ch táº¡i Ä‘Ã¢y.</p>
                      </div>
                      <Link to="/catalog">
                        <Button variant="default" size="sm" className="mt-2 font-bold uppercase tracking-wider text-xs">
                          KhÃ¡m phÃ¡ sáº£n pháº©m ngay
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                items.map((o) => {
                  const statusConfig = getOrderStatusConfig(o.status);

                  return (
                    <tr
                      key={o.orderId}
                      className="bg-background rounded-button shadow-neo-sm hover:shadow-neo hover:-translate-y-0.5 transition-all duration-300 group"
                    >
                      <td className="px-6 py-4 rounded-l-button font-mono font-bold text-primary text-sm">
                        #{o.orderNumber}
                      </td>
                      <td className="px-6 py-4 text-xs font-mono text-muted hidden md:table-cell">
                        {formatDateTime(o.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-xs font-bold text-foreground">
                        {o.itemCount} sáº£n pháº©m
                      </td>
                      <td className="px-6 py-4 text-sm font-extrabold text-foreground text-right">
                        {formatVND(o.totalMinor)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-neo-inset-sm ${statusConfig.colorClass}`}>
                          <span className="text-xs">{statusConfig.icon}</span>
                          <span>{statusConfig.label}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center rounded-r-button">
                        <Link to={`${o.orderId}`}>
                          <Button variant="outline" size="sm" className="h-8 w-8 rounded-full p-0 flex items-center justify-center">
                            <EyeIcon className="w-3 h-3 md:w-4 md:h-4 text-muted group-hover:text-foreground transition-colors" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-6 border-t border-muted/10">
          <span className="text-xs text-muted font-medium">
            Trang <span className="font-bold text-foreground">{page}</span> / <span className="font-bold text-foreground">{totalPages}</span>
          </span>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="text-xs font-bold uppercase tracking-wider"
            >
              TrÆ°á»›c
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="text-xs font-bold uppercase tracking-wider"
            >
              Tiáº¿p theo
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

