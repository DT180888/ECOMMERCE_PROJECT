import { Link } from "react-router-dom";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { useRecentOrders } from "@hooks/useStats";
import { formatVND, formatDateTime } from "@my-project/shared-utils";
import { OrderStatusBadge, Skeleton } from "@my-project/ui";

function RowSkeleton() {
  return (
    <div className="flex items-center justify-between py-3 px-4">
      <div className="space-y-1.5">
        <Skeleton className="h-4 w-24 rounded" />
        <Skeleton className="h-3 w-36 rounded" />
      </div>
      <div className="flex flex-col items-end gap-1.5">
        <Skeleton className="h-4 w-20 rounded" />
        <Skeleton className="h-5 w-16 rounded-sm" />
      </div>
    </div>
  );
}

export function RecentOrdersWidget() {
  const { data, isLoading } = useRecentOrders(6);

  return (
    <div className="bg-card border border-border rounded-sm h-auto xl:h-full flex flex-col justify-between overflow-hidden shadow-none font-sans">
      {/* Header (Aligned to h-11 / 44px baseline) */}
      <div className="px-4 h-11 flex items-center justify-between border-b border-border bg-surface shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-success shrink-0" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
            Đơn hàng gần đây
          </h3>
        </div>
        <Link
          to="/admin/orders"
          className="text-xs text-primary hover:text-primary-hover inline-flex items-center gap-1 transition-colors font-medium group"
        >
          <span>Xem tất cả</span>
          <ArrowRightIcon className="w-3.5 h-3.5 stroke-[1.5] transition-transform duration-150 group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Content Feed */}
      <div className="flex-1 xl:overflow-y-auto custom-scrollbar p-1.5">
        {isLoading ? (
          <div className="divide-y divide-border">
            {[...Array(5)].map((_, i) => <RowSkeleton key={i} />)}
          </div>
        ) : !data || data.length === 0 ? (
          <div className="h-full flex items-center justify-center p-8">
            <p className="text-xs text-muted-foreground font-sans">
              Chưa có đơn hàng nào phát sinh
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-border-subtle">
            {data.map((order) => (
              <li key={order.orderId}>
                <Link
                  to={`/admin/orders/${order.orderId}`}
                  className="group relative px-3 py-2.5 flex items-center justify-between gap-3 rounded-md transition-colors duration-150 hover:bg-surface-hover"
                >
                  {/* Order Information */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold text-foreground group-hover:text-primary transition-colors">
                        #{order.orderNumber}
                      </span>
                      <span className="text-xs text-muted-foreground truncate">
                        • {formatDateTime(order.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-0.5" title={order.customerName || undefined}>
                      {order.customerName || "Khách lẻ tại cửa hàng"}
                    </p>
                  </div>

                  {/* Amount + Status */}
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className="text-[13px] font-semibold text-foreground whitespace-nowrap">
                      {formatVND(order.totalMinor)}
                    </span>
                    <OrderStatusBadge status={order.status} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
