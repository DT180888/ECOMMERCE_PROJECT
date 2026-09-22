import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useRevenueChart } from "@entities/stats/hooks";
import { formatVND } from "@my-project/shared-utils";
import { ChartBarIcon } from "@heroicons/react/24/outline";
import { cn } from "@shared/lib/utils";

const RANGE_OPTIONS = [7, 14, 30] as const;

/** Bar skeleton while loading */
function ChartSkeleton() {
  const bars = [40, 65, 50, 80, 55, 90, 70];
  return (
    <div className="w-full h-full flex items-end gap-3 px-4 pb-6 animate-pulse">
      {bars.map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-t-sm bg-muted/30"
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  );
}

export function RevenueChart() {
  const [days, setDays] = useState<7 | 14 | 30>(7);
  const { data, isLoading } = useRevenueChart(days);

  return (
    <div className="bg-card border border-neo-bevel shadow-none rounded-card p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-5 gap-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <ChartBarIcon className="w-3 h-3 md:w-4 md:h-4 text-muted-foreground" aria-hidden="true" />
            Doanh thu theo ngÃ y
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            DÃ²ng tiá»n {days} ngÃ y gáº§n nháº¥t
          </p>
        </div>

        {/* Range selector */}
        <div className="flex bg-foreground/[0.02] border border-neo-bevel p-1 rounded-button gap-1">
          {RANGE_OPTIONS.map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={cn(
                "px-3 py-1.5 text-xs font-semibold rounded-button transition-all duration-300 ease-out",
                days === d
                  ? "bg-card text-foreground shadow-neo-sm border border-neo-bevel"
                  : "text-muted hover:text-foreground hover:bg-foreground/[0.02]"
              )}
            >
              {d}N
            </button>
          ))}
        </div>
      </div>

      {/* Chart area */}
      <div className="flex-1 min-h-[200px] w-full">
        {isLoading ? (
          <ChartSkeleton />
        ) : !data || data.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center border border-dashed border-border/50 rounded-button">
            <p className="text-sm text-muted-foreground">
              ChÆ°a cÃ³ dá»¯ liá»‡u trong khoáº£ng thá»i gian nÃ y
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border) / 0.4)"
                vertical={false}
              />

              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                tickLine={false}
                axisLine={false}
                dy={8}
              />

              <YAxis
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                tickFormatter={(v: number) => {
                  if (v >= 1_000_000) return `${v / 1_000_000}M`;
                  if (v >= 1_000) return `${v / 1_000}k`;
                  return String(v);
                }}
                tickLine={false}
                axisLine={false}
                width={44}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  borderColor: "hsl(var(--foreground) / 0.06)",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "hsl(var(--foreground))",
                  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.08)",
                  padding: "10px 14px",
                  border: "1px solid hsl(var(--foreground) / 0.06)",
                }}
                formatter={(value: number) => [formatVND(value), "Doanh thu"]}
                labelStyle={{ color: "hsl(var(--muted-foreground))", marginBottom: 4 }}
                cursor={{ stroke: "hsl(var(--border))", strokeWidth: 1, strokeDasharray: "4 4" }}
              />

              <Area
                type="monotone"
                dataKey="revenue"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#revenueGrad)"
                activeDot={{ r: 5, strokeWidth: 0, fill: "hsl(var(--primary))" }}
                animationDuration={800}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}


