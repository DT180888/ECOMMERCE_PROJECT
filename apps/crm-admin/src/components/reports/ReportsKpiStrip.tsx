import React from "react";
import { cn } from "@my-project/ui";

export interface KpiItem {
  label: string;
  value: string;
  sublabel?: string;
  highlightColor?: string;
}

export interface ReportsKpiStripProps {
  items: KpiItem[];
  className?: string;
}

export function ReportsKpiStrip({ items, className }: ReportsKpiStripProps) {
  if (!items || items.length === 0) return null;

  return (
    <div
      className={cn(
        "grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-border select-none bg-surface/20",
        className
      )}
    >
      {items.map((item, idx) => (
        <div
          key={idx}
          className="p-4 sm:p-5 flex flex-col justify-between gap-1 transition-colors hover:bg-surface/40"
        >
          <span className="text-[11px] uppercase tracking-wider font-medium text-muted-foreground truncate">
            {item.label}
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span
              className={cn(
                "text-lg sm:text-2xl font-mono font-semibold tracking-tight tabular-nums truncate",
                item.highlightColor ?? "text-foreground"
              )}
            >
              {item.value}
            </span>
          </div>
          {item.sublabel && (
            <span className="text-[11px] text-muted-foreground/80 font-sans truncate">
              {item.sublabel}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

export default ReportsKpiStrip;

