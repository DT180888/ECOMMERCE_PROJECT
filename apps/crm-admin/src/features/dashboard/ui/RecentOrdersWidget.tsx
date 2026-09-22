import { Link } from "react-router-dom";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { useRecentOrders } from "@entities/stats/hooks";
import { formatVND, formatDateTime } from "@my-project/shared-utils";
import { OrderStatusBadge } from "@my-project/ui";

function RowSkeleton() {
  return (
    <div className="flex items-center gap-3 py-3 px-3.5 border-b border-neo-bevel last:border-0 animate-pulse">
      <div className="flex-1 space-y-1.5">
        <div className="h-3 w-20 bg-muted/30 rounded" />
        <div className="h-2.5 w-32 bg-muted/30 rounded" />
      </div>
      <div className="h-3 w-16 bg-muted/30 rounded" />
      <div className="h-5 w-16 bg-muted/30 rounded-full" />
    </div>
  );
}

export function RecentOrdersWidget() {
  const { data, isLoading } = useRecentOrders(5);

  return (
    <div className="bg-card border border-neo-bevel shadow-none rounded-card h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between border-b border-neo-bevel shrink-0">
        <h3 className="text-sm font-semibold text-foreground font-display">ÄÆ¡n hÃ ng gáº§n Ä‘Ã¢y</h3>
        <Link
          to="/admin/orders"
          className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 transition-colors font-semibold"
        >
          Xem táº¥t cáº£ <ArrowRightIcon className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6 px-5 pb-3">
        {isLoading ? (
          <div className="space-y-3 py-3">
            {[...Array(5)].map((_, i) => <RowSkeleton key={i} />)}
          </div>
        ) : !data || data.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-sm text-muted-foreground">ChÆ°a cÃ³ Ä‘Æ¡n hÃ ng nÃ o</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {data.map((order) => (
              <li key={order.orderId} className="py-3 px-3.5 flex items-start gap-3 group border-b border-neo-bevel last:border-0 hover:bg-foreground/[0.015] hover:shadow-neo-hover transition-all duration-300 ease-out rounded-card relative z-0 hover:z-10">
                {/* Order info */}
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/admin/orders/${order.orderId}`}
                    className="text-xs font-mono text-primary group-hover:text-primary/80 transition-colors font-semibold"
                  >
                    #{order.orderNumber}
                  </Link>
                  <p className="text-sm font-medium text-foreground truncate mt-0.5" title={order.customerName}>
                    {order.customerName || "KhÃ¡ch láº»"}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {formatDateTime(order.createdAt)}
                  </p>
                </div>

                {/* Amount + status */}
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span className="text-sm font-semibold text-emerald-500 tabular-nums whitespace-nowrap">
                    {formatVND(order.totalMinor)}
                  </span>
                  <OrderStatusBadge status={order.status} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}


