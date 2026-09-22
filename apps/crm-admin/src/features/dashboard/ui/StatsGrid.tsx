import {
  BanknotesIcon,
  ShoppingCartIcon,
  UsersIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from "@heroicons/react/24/outline";
import { useAdminKpis } from "@entities/stats/hooks";
import { formatVND } from "@my-project/shared-utils";
import { type ElementType } from "react";

interface MetricItem {
  label: string;
  value: string | number;
  icon: ElementType;
  change: number | null;
  /** Tailwind utility classes for the icon tint */
  iconClass: string;
}

function MetricTrend({ change }: { change: number }) {
  const positive = change >= 0;
  const Icon = positive ? ArrowTrendingUpIcon : ArrowTrendingDownIcon;
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-[11px] font-semibold tabular-nums ${
        positive ? "text-emerald-500" : "text-red-400"
      }`}
    >
      <Icon className="w-3 h-3" />
      {Math.abs(change)}%
    </span>
  );
}

/** Skeleton for a single metric slot */
function MetricSkeleton() {
  return (
    <div className="flex flex-col gap-2 flex-1 min-w-0 animate-pulse p-4 bg-card border border-neo-bevel shadow-none rounded-card">
      <div className="h-3 w-20 bg-muted/30 rounded" />
      <div className="h-7 w-28 bg-muted/30 rounded" />
      <div className="h-3 w-16 bg-muted/30 rounded" />
    </div>
  );
}

/**
 * StatsGrid
 * KPI strip: 4 metrics in a single horizontal row separated by dividers.
 * No card boxes â€” breaks the hero-metric template anti-pattern.
 */
export function StatsGrid() {
  const { data, isLoading } = useAdminKpis();

  if (isLoading || !data) {
    return (
      <div className="">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 responsive-gap">
          {[...Array(4)].map((_, i) => (
            <MetricSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  const metrics: MetricItem[] = [
    {
      label: "Doanh thu",
      value: formatVND(data.revenue),
      icon: BanknotesIcon,
      change: data.revenueGrowth,
      iconClass: "text-emerald-500",
    },
    {
      label: "ÄÆ¡n hÃ ng",
      value: data.ordersCount,
      icon: ShoppingCartIcon,
      change: data.ordersGrowth,
      iconClass: "text-primary",
    },
    {
      label: "KhÃ¡ch hÃ ng",
      value: data.customersCount,
      icon: UsersIcon,
      change: null,
      iconClass: "text-violet-400",
    },
    {
      label: "Sáº¯p háº¿t hÃ ng",
      value: data.lowStockCount,
      icon: ExclamationTriangleIcon,
      change: null,
      iconClass: "text-amber-400",
    },
  ];

  return (
    <div className="">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 responsive-gap">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div
              key={m.label}
              className="flex items-start gap-3.5 p-4 rounded-card bg-card border border-neo-bevel shadow-none hover:shadow-neo-hover transition-all duration-300 ease-out"
            >
              {/* Icon */}
              <div className="mt-0.5 p-2 rounded-card bg-foreground/[0.02] border border-neo-bevel shrink-0">
                <Icon className={`w-3 h-3 md:w-4 md:h-4 ${m.iconClass}`} aria-hidden="true" />
              </div>

              {/* Text */}
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground font-medium tracking-wide">
                  {m.label}
                </p>
                <p className="text-2xl font-semibold text-foreground tracking-tight tabular-nums leading-tight mt-0.5 truncate">
                  {m.value}
                </p>
                <div className="mt-1 h-4 flex items-center">
                  {m.change !== null ? (
                    <>
                      <MetricTrend change={m.change} />
                      <span className="text-[11px] text-muted-foreground ml-1.5">
                        vs tháng trước
                      </span>
                    </>
                  ) : (
                    <span className="text-[11px] text-muted-foreground">
                      Thời gian thực
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


