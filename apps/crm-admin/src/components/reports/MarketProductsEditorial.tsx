import React, { useMemo } from "react";
import { formatVND } from "@my-project/shared-utils";
import { Skeleton, cn } from "@my-project/ui";
import { FolderIcon, TagIcon, SparklesIcon } from "@heroicons/react/24/outline";
import type { CategorySalesItem, BrandSalesItem } from "@my-project/api";

const PALETTE = [
  "bg-blue-600 dark:bg-blue-500",
  "bg-emerald-600 dark:bg-emerald-500",
  "bg-purple-600 dark:bg-purple-500",
  "bg-amber-600 dark:bg-amber-500",
  "bg-rose-600 dark:bg-rose-500",
  "bg-slate-400 dark:bg-slate-600",
];

interface MarketProductsEditorialProps {
  categories: CategorySalesItem[];
  brands: BrandSalesItem[];
  isLoadingCategory: boolean;
  isLoadingBrand: boolean;
}

export function MarketProductsEditorial({
  categories,
  brands,
  isLoadingCategory,
  isLoadingBrand,
}: MarketProductsEditorialProps) {
  // Sort categories by revenue desc
  const sortedCategories = useMemo(
    () => [...categories].sort((a, b) => b.totalRevenueMinor - a.totalRevenueMinor),
    [categories]
  );

  // Sort brands by revenue desc
  const sortedBrands = useMemo(
    () => [...brands].sort((a, b) => b.totalRevenueMinor - a.totalRevenueMinor),
    [brands]
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border font-sans">
      {/* ── CỘT 1: THỊ PHẦN DANH MỤC ── */}
      <div className="p-5 sm:p-7 lg:p-8 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3.5 border-b border-border">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-sm bg-surface text-foreground border border-border flex items-center justify-center">
                <FolderIcon className="w-3.5 h-3.5 stroke-[1.75]" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-semibold text-foreground tracking-tight">
                  Thị phần theo Danh mục
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  Phân bổ doanh thu và số lượng tiêu thụ
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-medium text-muted-foreground bg-surface px-2 py-0.5 rounded-sm border border-border">
              {categories.length} danh mục
            </span>
          </div>

          {isLoadingCategory ? (
            <div className="py-6 space-y-3">
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-12 w-full rounded" />
              <Skeleton className="h-12 w-full rounded" />
              <Skeleton className="h-12 w-full rounded" />
            </div>
          ) : sortedCategories.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted-foreground">
              Không có dữ liệu danh mục trong kỳ này.
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              {/* Visual Multi-Segment Bar */}
              <div className="space-y-1.5">
                <div className="h-2.5 w-full bg-surface rounded-full overflow-hidden flex border border-border/40">
                  {sortedCategories.slice(0, 5).map((cat, i) => (
                    <div
                      key={cat.categoryId}
                      style={{ width: `${Math.max(2, cat.contributionPercentage)}%` }}
                      className={cn("h-full transition-all duration-300", PALETTE[i % PALETTE.length])}
                      title={`${cat.categoryName}: ${cat.contributionPercentage}%`}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground flex-wrap gap-2 pt-0.5">
                  {sortedCategories.slice(0, 4).map((cat, i) => (
                    <span key={cat.categoryId} className="inline-flex items-center gap-1.5 truncate">
                      <span className={cn("w-2 h-2 rounded-full shrink-0", PALETTE[i % PALETTE.length])} />
                      <span className="truncate max-w-[120px]">{cat.categoryName}</span>
                      <strong className="font-mono text-foreground font-semibold">
                        {cat.contributionPercentage}%
                      </strong>
                    </span>
                  ))}
                </div>
              </div>

              {/* Top Performer List */}
              <div className="divide-y divide-border/60 pt-2">
                {sortedCategories.map((cat, index) => {
                  const isTop = index === 0;
                  return (
                    <div
                      key={cat.categoryId}
                      className="py-3 flex items-center justify-between gap-3 group hover:bg-surface/30 px-1 rounded transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className={cn(
                            "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold shrink-0 border",
                            isTop
                              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                              : "bg-surface text-muted-foreground border-border"
                          )}
                        >
                          {index + 1}
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-[13px] font-medium text-foreground truncate group-hover:text-primary transition-colors">
                            {cat.categoryName}
                          </p>
                          <span className="text-[11px] text-muted-foreground font-mono">
                            {cat.totalQuantitySold.toLocaleString()} sp • {cat.totalOrdersCount} đơn
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="text-xs sm:text-[13px] font-mono font-semibold text-foreground tabular-nums">
                          {formatVND(cat.totalRevenueMinor)}
                        </p>
                        <span className="text-[10px] font-mono font-medium px-1.5 py-0.2 rounded bg-surface border border-border text-muted-foreground">
                          {cat.contributionPercentage}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── CỘT 2: HIỆU SUẤT THƯƠNG HIỆU ── */}
      <div className="p-5 sm:p-7 lg:p-8 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3.5 border-b border-border">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-sm bg-surface text-foreground border border-border flex items-center justify-center">
                <TagIcon className="w-3.5 h-3.5 stroke-[1.75]" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-semibold text-foreground tracking-tight">
                  Hiệu suất theo Thương hiệu
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  Độ nhận diện và sức mạnh nhãn hàng đối tác
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-medium text-muted-foreground bg-surface px-2 py-0.5 rounded-sm border border-border">
              {brands.length} nhãn hàng
            </span>
          </div>

          {isLoadingBrand ? (
            <div className="py-6 space-y-3">
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-12 w-full rounded" />
              <Skeleton className="h-12 w-full rounded" />
              <Skeleton className="h-12 w-full rounded" />
            </div>
          ) : sortedBrands.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted-foreground">
              Không có dữ liệu thương hiệu trong kỳ này.
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              {/* Visual Multi-Segment Bar */}
              <div className="space-y-1.5">
                <div className="h-2.5 w-full bg-surface rounded-full overflow-hidden flex border border-border/40">
                  {sortedBrands.slice(0, 5).map((b, i) => (
                    <div
                      key={b.brandId ?? b.brandName}
                      style={{ width: `${Math.max(2, b.contributionPercentage)}%` }}
                      className={cn("h-full transition-all duration-300", PALETTE[(i + 2) % PALETTE.length])}
                      title={`${b.brandName}: ${b.contributionPercentage}%`}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground flex-wrap gap-2 pt-0.5">
                  {sortedBrands.slice(0, 4).map((b, i) => (
                    <span key={b.brandId ?? b.brandName} className="inline-flex items-center gap-1.5 truncate">
                      <span className={cn("w-2 h-2 rounded-full shrink-0", PALETTE[(i + 2) % PALETTE.length])} />
                      <span className="truncate max-w-[120px]">{b.brandName}</span>
                      <strong className="font-mono text-foreground font-semibold">
                        {b.contributionPercentage}%
                      </strong>
                    </span>
                  ))}
                </div>
              </div>

              {/* Top Performer List */}
              <div className="divide-y divide-border/60 pt-2">
                {sortedBrands.map((b, index) => {
                  const isTop = index === 0;
                  return (
                    <div
                      key={b.brandId ?? b.brandName}
                      className="py-3 flex items-center justify-between gap-3 group hover:bg-surface/30 px-1 rounded transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className={cn(
                            "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold shrink-0 border",
                            isTop
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                              : "bg-surface text-muted-foreground border-border"
                          )}
                        >
                          {index + 1}
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-[13px] font-medium text-foreground truncate group-hover:text-primary transition-colors">
                            {b.brandName}
                          </p>
                          <span className="text-[11px] text-muted-foreground font-mono">
                            {b.totalQuantitySold.toLocaleString()} sp • {b.totalOrdersCount} đơn
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="text-xs sm:text-[13px] font-mono font-semibold text-foreground tabular-nums">
                          {formatVND(b.totalRevenueMinor)}
                        </p>
                        <span className="text-[10px] font-mono font-medium px-1.5 py-0.2 rounded bg-surface border border-border text-muted-foreground">
                          {b.contributionPercentage}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MarketProductsEditorial;

