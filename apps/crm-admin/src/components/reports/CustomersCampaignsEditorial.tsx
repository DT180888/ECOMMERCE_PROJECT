import React from "react";
import { formatVND } from "@my-project/shared-utils";
import { Skeleton, cn, Badge } from "@my-project/ui";
import { UserGroupIcon, SparklesIcon, ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import type { CustomerReportItem, PromotionRoiItem } from "@my-project/api";

interface CustomersCampaignsEditorialProps {
  customers: CustomerReportItem[];
  promotions: PromotionRoiItem[];
  isLoadingCustomer: boolean;
  isLoadingPromo: boolean;
  onOpenCustomer360?: (userId: string) => void;
}

function CustomerTierBadge({ tier }: { tier: string }) {
  const isDiamond = tier.includes("Diamond");
  const isGold = tier.includes("Gold");
  const isSilver = tier.includes("Silver");

  const badgeClass = isDiamond
    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
    : isGold
    ? "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/30"
    : isSilver
    ? "bg-slate-500/10 text-slate-600 dark:text-slate-300 border-slate-500/30"
    : "bg-surface text-muted-foreground border-border";

  return (
    <span
      className={cn(
        "inline-flex items-center px-1.5 py-0.5 rounded-[2px] text-[10px] font-medium border select-none",
        badgeClass
      )}
    >
      {tier}
    </span>
  );
}

export function CustomersCampaignsEditorial({
  customers,
  promotions,
  isLoadingCustomer,
  isLoadingPromo,
  onOpenCustomer360,
}: CustomersCampaignsEditorialProps) {
  // Sort promotions by revenue multiplier or driven revenue desc
  const sortedPromos = [...promotions].sort((a, b) => b.drivenRevenueMinor - a.drivenRevenueMinor);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border font-sans">
      {/* ── CỘT 1: HỒ SƠ TOP KHÁCH HÀNG LTV ── */}
      <div className="p-5 sm:p-7 lg:p-8 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3.5 border-b border-border">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-sm bg-surface text-foreground border border-border flex items-center justify-center">
                <UserGroupIcon className="w-3.5 h-3.5 stroke-[1.75]" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-semibold text-foreground tracking-tight">
                  Top Khách hàng Thân thiết (LTV)
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  Khách hàng chi tiêu cao nhất &amp; giá trị vòng đời
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-medium text-muted-foreground bg-surface px-2 py-0.5 rounded-sm border border-border">
              {customers.length} khách hàng
            </span>
          </div>

          {isLoadingCustomer ? (
            <div className="py-6 space-y-3">
              <Skeleton className="h-14 w-full rounded" />
              <Skeleton className="h-14 w-full rounded" />
              <Skeleton className="h-14 w-full rounded" />
              <Skeleton className="h-14 w-full rounded" />
            </div>
          ) : customers.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted-foreground">
              Không tìm thấy dữ liệu chi tiêu khách hàng trong kỳ này.
            </div>
          ) : (
            <div className="divide-y divide-border/60 pt-2">
              {customers.map((c, index) => {
                const isTop1 = index === 0;
                return (
                  <div
                    key={c.userId}
                    className="py-3.5 flex items-center justify-between gap-3 group hover:bg-surface/30 px-1.5 rounded transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono font-bold shrink-0 border",
                          isTop1
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                            : "bg-surface text-muted-foreground border-border"
                        )}
                      >
                        {index + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <button
                            type="button"
                            onClick={() => onOpenCustomer360?.(c.userId)}
                            className="text-xs sm:text-[13px] font-semibold text-foreground hover:text-primary transition-colors hover:underline text-left inline-flex items-center gap-1 truncate max-w-[170px]"
                            title="Bấm để xem hồ sơ Customer 360°"
                          >
                            <span>{c.fullName || "Khách vãng lai"}</span>
                            <ArrowTopRightOnSquareIcon className="w-3 h-3 text-muted-foreground group-hover:text-primary shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                          <CustomerTierBadge tier={c.customerTier} />
                        </div>
                        <p className="text-[11px] text-muted-foreground font-mono truncate max-w-[200px]">
                          {c.email || c.phone || c.userId}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-xs sm:text-[13px] font-mono font-semibold text-foreground tabular-nums">
                        {formatVND(c.periodSpendMinor)}
                      </p>
                      <span className="text-[11px] text-muted-foreground font-mono tabular-nums">
                        {c.periodOrdersCount} đơn • AOV {formatVND(c.averageOrderValueMinor)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── CỘT 2: BẢNG XẾP HẠNG ĐÒN BẨY ROI KHUYẾN MÃI ── */}
      <div className="p-5 sm:p-7 lg:p-8 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3.5 border-b border-border">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-sm bg-surface text-foreground border border-border flex items-center justify-center">
                <SparklesIcon className="w-3.5 h-3.5 stroke-[1.75]" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-semibold text-foreground tracking-tight">
                  Hiệu quả Chiến dịch Khuyến mãi (ROI)
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  Đòn bẩy doanh thu mang lại so với ngân sách chiết khấu
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-medium text-muted-foreground bg-surface px-2 py-0.5 rounded-sm border border-border">
              {promotions.length} chiến dịch
            </span>
          </div>

          {isLoadingPromo ? (
            <div className="py-6 space-y-3">
              <Skeleton className="h-14 w-full rounded" />
              <Skeleton className="h-14 w-full rounded" />
              <Skeleton className="h-14 w-full rounded" />
              <Skeleton className="h-14 w-full rounded" />
            </div>
          ) : sortedPromos.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted-foreground">
              Không có chiến dịch khuyến mãi nào phát sinh trong kỳ này.
            </div>
          ) : (
            <div className="divide-y divide-border/60 pt-2">
              {sortedPromos.map((p, index) => {
                const isHighRoi = p.revenueMultiplier >= 4;
                return (
                  <div
                    key={p.promotionId}
                    className="py-3.5 flex items-center justify-between gap-3 group hover:bg-surface/30 px-1.5 rounded transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-6 h-6 rounded-full bg-surface border border-border flex items-center justify-center text-[10px] font-mono text-muted-foreground shrink-0 font-bold">
                        {index + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-xs sm:text-[13px] font-medium text-foreground truncate max-w-[180px]">
                            {p.promotionName}
                          </p>
                          <span className="font-mono text-[10px] bg-surface px-1.5 py-0.5 rounded border border-border text-muted-foreground uppercase font-medium">
                            {p.promotionCode}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground font-mono">
                          {p.redemptionsCount.toLocaleString()} lượt dùng • Chiết khấu:{" "}
                          <span className="text-error font-medium">-{formatVND(p.totalDiscountMinor)}</span>
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="flex items-center justify-end gap-1.5">
                        <span
                          className={cn(
                            "font-mono text-xs font-semibold px-2 py-0.5 rounded border tabular-nums",
                            isHighRoi
                              ? "bg-success/10 text-success border-success/30"
                              : "bg-surface text-foreground border-border"
                          )}
                          title="Đòn bẩy doanh thu / chiết khấu"
                        >
                          {p.revenueMultiplier}x ROI
                        </span>
                      </div>
                      <p className="text-[11px] font-mono font-medium text-foreground mt-0.5 tabular-nums">
                        Thu về: {formatVND(p.drivenRevenueMinor)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CustomersCampaignsEditorial;

