import { Link } from "react-router-dom";
import { useTopSellingProducts } from "@hooks/useStats";
import { formatVND } from "@my-project/shared-utils";
import type { DateRangeParams } from "@my-project/api";
import { ArrowRightIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { Skeleton } from "@my-project/ui";

interface TopSellingProductsWidgetProps {
  dateRange?: DateRangeParams;
}

function RowSkeleton() {
  return (
    <div className="flex items-center justify-between py-3 px-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-4 w-5 rounded-[2px]" />
        <div className="space-y-1">
          <Skeleton className="h-3.5 w-36 rounded-[2px]" />
          <Skeleton className="h-3 w-24 rounded-[2px]" />
        </div>
      </div>
      <Skeleton className="h-3.5 w-20 rounded-[2px]" />
    </div>
  );
}

export function TopSellingProductsWidget({ dateRange }: TopSellingProductsWidgetProps) {
  const { data, isLoading } = useTopSellingProducts({ ...dateRange, limit: 5 });

  return (
    <div className="bg-card border border-border rounded-sm h-auto xl:h-full flex flex-col justify-between overflow-hidden shadow-none font-sans">
      {/* Header (Aligned to h-10 / 40px baseline) */}
      <div className="px-3 sm:px-4 h-10 flex items-center justify-between border-b border-border bg-surface shrink-0">
        <div className="flex items-center gap-2">
          <SparklesIcon className="w-3.5 h-3.5 text-foreground stroke-[1.25]" />
          <h3 className="text-xs font-medium uppercase tracking-wider text-foreground">
            Sản phẩm Dẫn đầu Doanh số
          </h3>
        </div>
        <Link
          to="/admin/product"
          className="text-[11px] text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors font-medium tracking-wide group"
        >
          <span>Xem kho hàng</span>
          <ArrowRightIcon className="w-3 h-3 stroke-[1.25] transition-transform duration-150 group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Content Ranking List (Natural flow on mobile/tablet, scrollable on xl desktop) */}
      <div className="flex-1 xl:overflow-y-auto custom-scrollbar p-1">
        {isLoading ? (
          <div className="divide-y divide-border">
            {[...Array(5)].map((_, i) => <RowSkeleton key={i} />)}
          </div>
        ) : !data || data.length === 0 ? (
          <div className="h-full flex items-center justify-center p-8">
            <p className="text-xs text-muted-foreground tracking-wide font-mono">
              Chưa có dữ liệu giao dịch sản phẩm trong kỳ này
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {data.map((item, idx) => (
              <li key={item.skuId}>
                <Link
                  to={`/admin/product?search=${encodeURIComponent(item.productName)}`}
                  className="group relative px-2.5 sm:px-3 py-2 flex items-center justify-between gap-2 sm:gap-3 rounded-[2px] transition-colors duration-150 hover:bg-surface active:bg-surface/80"
                >
                  {/* Ranking Index + Product Info */}
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <span className="text-[10px] sm:text-[10.5px] font-mono font-medium text-muted-foreground/80 tabular-nums w-4 text-right shrink-0">
                      {String(idx + 1).padStart(2, "0")}
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-normal text-foreground truncate group-hover:underline" title={item.productName}>
                        {item.productName}
                      </p>
                      <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5 text-[10.5px] sm:text-[11px] text-muted-foreground font-mono">
                        {item.skuName && (
                          <span className="truncate max-w-[90px] sm:max-w-[140px]">
                            {item.skuName}
                          </span>
                        )}
                        {item.skuName && <span>•</span>}
                        <span>
                          Đã bán: <strong className="font-medium text-foreground tabular-nums">{item.totalQuantitySold}</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Revenue */}
                  <div className="flex flex-col items-end shrink-0 pl-1 sm:pl-2">
                    <span className="text-xs font-mono font-medium text-foreground tabular-nums whitespace-nowrap">
                      {formatVND(item.totalRevenueMinor)}
                    </span>
                    <span className="text-[9.5px] sm:text-[10px] text-muted-foreground tracking-wide mt-0.5 font-mono">
                      Doanh thu
                    </span>
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
export default TopSellingProductsWidget;
