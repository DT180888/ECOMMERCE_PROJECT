import { useTopSellingProducts } from "@entities/stats/hooks";
import { formatVND } from "@my-project/shared-utils";
import { FireIcon } from "@heroicons/react/24/outline";

function RowSkeleton() {
  return (
    <div className="flex items-center gap-3 py-3 px-3.5 border-b border-neo-bevel last:border-0 animate-pulse">
      <div className="flex-1 space-y-1.5">
        <div className="h-3 w-32 bg-muted/30 rounded" />
        <div className="h-2.5 w-20 bg-muted/30 rounded" />
      </div>
      <div className="h-3 w-16 bg-muted/30 rounded" />
    </div>
  );
}

export function TopSellingProductsWidget() {
  const { data, isLoading } = useTopSellingProducts(5);

  return (
    <div className="bg-card border border-neo-bevel shadow-none rounded-card h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 flex items-center gap-2 border-b border-neo-bevel shrink-0">
        <FireIcon className="w-4 h-4 text-orange-500" />
        <h3 className="text-sm font-semibold text-foreground font-display">Sản phẩm bán chạy</h3>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6 px-5 pb-3">
        {isLoading ? (
          <div className="space-y-3 py-3">
            {[...Array(5)].map((_, i) => <RowSkeleton key={i} />)}
          </div>
        ) : !data || data.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-sm text-muted-foreground">Chưa có dữ liệu</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {data.map((item) => (
              <li key={item.skuId} className="py-3 px-3.5 flex items-start gap-3 group border-b border-neo-bevel last:border-0 hover:bg-foreground/[0.015] hover:shadow-neo-hover transition-all duration-300 ease-out rounded-card relative z-0 hover:z-10">
                {/* Product info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate" title={item.productName}>
                    {item.productName}
                  </p>
                  {item.skuName && (
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Phân loại: {item.skuName}
                    </p>
                  )}
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Đã bán: <span className="font-semibold text-foreground">{item.totalQuantitySold}</span>
                  </p>
                </div>

                {/* Revenue */}
                <div className="flex flex-col items-end shrink-0">
                  <span className="text-sm font-semibold text-emerald-500 tabular-nums whitespace-nowrap">
                    {formatVND(item.totalRevenueMinor)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

