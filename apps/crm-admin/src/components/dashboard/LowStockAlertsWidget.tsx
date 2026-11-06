import { Link } from "react-router-dom";
import { useLowStockAlerts } from "@hooks/useStats";
import { ExclamationTriangleIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { Skeleton, cn } from "@my-project/ui";

function RowSkeleton() {
  return (
    <div className="flex items-center justify-between py-3 px-4">
      <div className="space-y-1">
        <Skeleton className="h-3.5 w-32 rounded-[2px]" />
        <Skeleton className="h-3 w-28 rounded-[2px]" />
      </div>
      <Skeleton className="h-6 w-16 rounded-[2px]" />
    </div>
  );
}

export function LowStockAlertsWidget() {
  const { data, isLoading } = useLowStockAlerts(5);

  return (
    <div className="bg-card border border-border rounded-sm h-auto xl:h-full flex flex-col justify-between overflow-hidden shadow-none font-sans">
      {/* Header (Aligned to h-10 / 40px baseline) */}
      <div className="px-3 sm:px-4 h-10 flex items-center justify-between border-b border-border bg-surface shrink-0">
        <div className="flex items-center gap-2">
          <ExclamationTriangleIcon className="w-3.5 h-3.5 text-warning stroke-[1.25]" />
          <h3 className="text-xs font-medium uppercase tracking-wider text-foreground">
            Cảnh báo Tồn kho Khẩn cấp
          </h3>
        </div>
        <Link
          to="/admin/skus"
          className="text-[11px] text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors font-medium tracking-wide group"
        >
          <span>Quản lý biến thể</span>
          <ArrowRightIcon className="w-3 h-3 stroke-[1.25] transition-transform duration-150 group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Content (Natural flow on mobile/tablet, scrollable on xl desktop) */}
      <div className="flex-1 xl:overflow-y-auto custom-scrollbar p-1">
        {isLoading ? (
          <div className="divide-y divide-border">
            {[...Array(5)].map((_, i) => <RowSkeleton key={i} />)}
          </div>
        ) : !data || data.length === 0 ? (
          <div className="h-full flex items-center justify-center p-8">
            <p className="text-xs text-muted-foreground tracking-wide font-mono">
              Trạng thái kho hàng đang ở mức an toàn
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {data.map((item) => {
              const isCriticallyLow = item.quantityOnHand <= 0;
              return (
                <li key={item.skuId}>
                  <Link
                    to={`/admin/skus?search=${encodeURIComponent(item.skuCode)}`}
                    className="group relative px-2.5 sm:px-3 py-2 flex items-center justify-between gap-2 sm:gap-3 rounded-[2px] transition-colors duration-150 hover:bg-surface active:bg-surface/80"
                  >
                    {/* Product & SKU info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-normal text-foreground truncate group-hover:underline" title={item.productName}>
                        {item.productName}
                      </p>
                      <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5 text-[10.5px] sm:text-[11px] text-muted-foreground font-mono">
                        <span>SKU: <strong className="font-normal text-foreground tabular-nums tracking-wide">{item.skuCode}</strong></span>
                        <span>•</span>
                        <span>Ngưỡng: <strong className="font-normal tabular-nums">{item.reorderPoint}</strong></span>
                      </div>
                    </div>

                    {/* Stock count badge + Action */}
                    <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                      <span
                        className={cn(
                          "text-[9.5px] sm:text-[10px] font-mono font-medium tabular-nums whitespace-nowrap px-1.5 py-0.5 rounded-[2px] border",
                          isCriticallyLow
                            ? "bg-error/10 text-error border-error/30"
                            : "bg-warning/10 text-warning border-warning/30"
                        )}
                      >
                        {item.quantityOnHand <= 0 ? "Hết hàng" : `Còn ${item.quantityOnHand}`}
                      </span>
                      <span
                        className="text-[10px] text-muted-foreground group-hover:text-foreground transition-colors font-mono"
                        title="Kiểm tra tồn kho"
                      >
                        →
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}



