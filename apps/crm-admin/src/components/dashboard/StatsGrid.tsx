import {
  BanknotesIcon,
  ShoppingCartIcon,
  UsersIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from "@heroicons/react/24/outline";
import { useAdminKpis } from "@hooks/useStats";
import { formatVND } from "@my-project/shared-utils";
import type { DateRangeParams } from "@my-project/api";
import { type ElementType } from "react";
import { Skeleton, cn } from "@my-project/ui";

interface StatsGridProps {
  dateRange?: DateRangeParams;
}

interface MetricItem {
  label: string;
  value: string | number;
  icon: ElementType;
  change: number | null;
  iconColor: string;
  iconBg: string;
}

function MetricTrend({ change }: { change: number }) {
  const positive = change >= 0;
  const Icon = positive ? ArrowTrendingUpIcon : ArrowTrendingDownIcon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-xs font-sans font-medium px-1.5 py-0.5 rounded-sm",
        positive
          ? "bg-success/10 text-success"
          : "bg-error/10 text-error"
      )}
    >
      <Icon className="w-3 h-3 stroke-[2]" />
      {Math.abs(change)}%
    </span>
  );
}

/** Skeleton for a single metric slot in monolith strip */
function MetricSkeleton() {
  return (
    <div className="flex flex-col justify-between p-4 sm:p-5 min-w-0 bg-card border-0 rounded-sm shadow-none">
      <div className="flex items-center justify-between gap-2">
        <Skeleton className="h-3 w-16 sm:w-20 rounded-sm" />
        <Skeleton className="h-8 w-8 rounded-sm" />
      </div>
      <div className="mt-3 mb-2">
        <Skeleton className="h-7 sm:h-8 w-24 sm:w-32 rounded-sm" />
      </div>
      <Skeleton className="h-3 w-20 sm:w-24 rounded-sm" />
    </div>
  );
}

/**
 * StatsGrid
 * Linear Modern Editorial StatisticCard Grid.
 * Rounded-sm (4px), Flat 100% (border-0 on canvas), WCAG AAA trend badges.
 */
export function StatsGrid({ dateRange }: StatsGridProps) {
  const { data, isLoading } = useAdminKpis(dateRange);

  if (isLoading || !data) {
    return (
      <div className="w-full overflow-hidden grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 select-none">
        {[...Array(4)].map((_, i) => (
          <MetricSkeleton key={i} />
        ))}
      </div>
    );
  }

  const metrics: MetricItem[] = [
    {
      label: "Doanh thu",
      value: formatVND(data.revenue),
      icon: BanknotesIcon,
      change: data.revenueGrowth,
      iconColor: "text-primary",
      iconBg: "bg-primary/10",
    },
    {
      label: "Đơn hàng",
      value: data.ordersCount,
      icon: ShoppingCartIcon,
      change: data.ordersGrowth,
      iconColor: "text-brand-blue-600 dark:text-brand-blue-400",
      iconBg: "bg-brand-blue-50 dark:bg-brand-blue-900/40",
    },
    {
      label: "Khách hàng",
      value: data.customersCount,
      icon: UsersIcon,
      change: data.customersGrowth,
      iconColor: "text-success",
      iconBg: "bg-success/10",
    },
    {
      label: "Sắp hết hàng",
      value: data.lowStockCount,
      icon: ExclamationTriangleIcon,
      change: null,
      iconColor: "text-warning",
      iconBg: "bg-warning/10",
    },
  ];

  return (
    <div className="w-full overflow-hidden gap-4 grid grid-cols-2 lg:grid-cols-4 select-none">
      {metrics.map((m) => {
        const Icon = m.icon;
        return (
          <div
            key={m.label}
            className={cn(
              "flex flex-col justify-between p-4 sm:p-5 border border-border transition-colors duration-150 bg-card hover:bg-surface-hover/80 rounded-sm shadow-none group min-w-0 relative font-sans"
            )}
          >
            {/* Top row: Label + Icon */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-muted-foreground truncate">
                {m.label}
              </span>
              <div className={cn("p-2 rounded-sm shrink-0 transition-transform group-hover:scale-105", m.iconBg, m.iconColor)}>
                <Icon className="w-4 h-4 stroke-[2]" aria-hidden="true" />
              </div>
            </div>

            {/* Numerical Display */}
            <div className="mt-2.5 sm:mt-3 mb-1.5 sm:mb-2 min-w-0">
              <p
                className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-sans leading-tight truncate"
                title={String(m.value)}
              >
                {m.value}
              </p>
            </div>

            {/* Bottom Caption / Trend */}
            <div className="flex items-center text-xs text-muted-foreground font-normal min-w-0">
              {m.change !== null ? (
                <div className="flex items-center gap-1.5 min-w-0 truncate">
                  <MetricTrend change={m.change} />
                  <span className="truncate hidden sm:inline-block">
                    so với kỳ trước
                  </span>
                </div>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-muted-foreground truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-warning shrink-0" />
                  <span className="truncate">Cần chú ý nhập hàng</span>
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
