import { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useRevenueChart } from "@hooks/useStats";
import { formatVND } from "@my-project/shared-utils";
import type { DateRangeParams } from "@my-project/api";
import { ChartBarIcon } from "@heroicons/react/24/outline";
import { Skeleton } from "@my-project/ui";

interface RevenueChartProps {
  dateRange?: DateRangeParams;
  displayLabel?: string;
}

/** Bar skeleton while loading */
function ChartSkeleton() {
  const bars = [35, 60, 45, 80, 50, 85, 65];
  return (
    <div className="w-full h-full flex items-end gap-3 px-4 pb-6">
      {bars.map((h, i) => (
        <Skeleton
          key={i}
          className="flex-1 rounded-t-md"
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  );
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;
  const value = payload[0].value;
  return (
    <div className="bg-card border border-border px-3 py-2 rounded-sm shadow-sm text-xs select-none font-sans">
      <p className="text-xs text-muted-foreground font-medium mb-1">
        {label}
      </p>
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-primary" />
        <span className="text-foreground font-semibold text-xs">
          {formatVND(value)}
        </span>
      </div>
    </div>
  );
}

export function RevenueChart({ dateRange, displayLabel }: RevenueChartProps) {
  const { data, isLoading } = useRevenueChart({
    from: dateRange?.from,
    to: dateRange?.to,
    interval: "auto",
  });

  const totalPeriodRevenue = useMemo(() => {
    if (!data || !data.length) return 0;
    return data.reduce((acc, curr) => acc + (curr.revenue || 0), 0);
  }, [data]);

  return (
    <div className="bg-card border border-border rounded-sm h-full flex flex-col justify-between overflow-hidden shadow-none font-sans">
      {/* Header (Aligned to h-11 / 44px baseline) */}
      <div className="px-4 h-11 flex items-center justify-between border-b border-border bg-surface shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <ChartBarIcon className="w-4 h-4 text-primary stroke-[1.75] shrink-0" aria-hidden="true" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground truncate">
            Dòng tiền Doanh thu
          </h3>
          {displayLabel && (
            <span className="hidden sm:inline-block text-[11px] font-medium text-muted-foreground px-2 py-0.5 rounded-sm bg-surface-tertiary border border-border shrink-0">
              {displayLabel}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-xs shrink-0">
          <span className="hidden sm:inline-block text-xs text-muted-foreground">Tổng kỳ:</span>
          <span className="font-bold text-foreground text-xs">
            {formatVND(totalPeriodRevenue)}
          </span>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="flex-1 min-h-[190px] sm:min-h-[220px] w-full p-2 sm:p-4 pt-3">
        {isLoading ? (
          <ChartSkeleton />
        ) : !data || data.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center border border-dashed border-border rounded-lg p-8">
            <p className="text-xs text-muted-foreground font-sans">
              Không có dữ liệu giao dịch trong kỳ đã chọn
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="fluentRevenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                vertical={false}
              />

              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                tickLine={false}
                axisLine={false}
                dy={6}
                interval="preserveStartEnd"
                tickFormatter={(val: string) => {
                  if (!val) return "";
                  const parts = val.split("-");
                  if (parts.length === 3) {
                    return `${parts[2]}/${parts[1]}`;
                  }
                  return val;
                }}
              />

              <YAxis
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                tickFormatter={(v: number) => {
                  if (v >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(1)}B`;
                  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(0)}M`;
                  if (v >= 1_000) return `${(v / 1_000).toFixed(0)}k`;
                  return String(v);
                }}
                tickLine={false}
                axisLine={false}
                width={38}
              />

              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: "hsl(var(--primary))", strokeWidth: 1, strokeDasharray: "3 3" }}
              />

              <Area
                type="monotone"
                dataKey="revenue"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#fluentRevenueGrad)"
                activeDot={{ r: 4, strokeWidth: 2, stroke: "hsl(var(--card))", fill: "hsl(var(--primary))" }}
                animationDuration={300}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
export default RevenueChart;
