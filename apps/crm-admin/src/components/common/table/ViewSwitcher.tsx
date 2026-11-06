import React from "react";
import { TableCellsIcon, Squares2X2Icon } from "@heroicons/react/24/outline";
import { cn } from "@my-project/ui";

export interface ViewSwitcherProps {
  viewMode: "table" | "grid";
  onViewModeChange: (mode: "table" | "grid") => void;
  /** Display micro text labels next to icons */
  showLabels?: boolean;
  className?: string;
}

/**
 * ViewSwitcher
 * Pure Editorial Tab-Visual Mimic Segmented Controller:
 * - 100% Flat & Hairline (1px border-border, zero drop shadows)
 * - 34px standard workstation height matching toolbar inputs and CTA buttons
 * - Studio-Grade contrast (Active: bg-surface text-foreground, Inactive: text-muted-foreground)
 * - W3C WAI-ARIA compliant toggle group
 */
export function ViewSwitcher({
  viewMode,
  onViewModeChange,
  showLabels = false,
  className,
}: ViewSwitcherProps) {
  return (
    <div
      role="group"
      aria-label="Chế độ hiển thị"
      className={cn(
        "inline-flex items-center gap-0.5 h-7 p-0.5 bg-card/70 border border-border rounded-sm select-none shrink-0",
        className
      )}
    >
      <button
        type="button"
        title="Dạng bảng (Table View)"
        aria-label="Dạng bảng"
        aria-pressed={viewMode === "table"}
        onClick={() => onViewModeChange("table")}
        className={cn(
          "inline-flex items-center justify-center gap-1.5 h-6 w-6 px-2 rounded-[2px] transition-all duration-150 cursor-pointer text-xs font-sans",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/20",
          viewMode === "table"
            ? "bg-primary/20 text-foreground font-semibold border border-primary/50"
            : "text-muted-foreground hover:text-foreground hover:bg-surface-hover/70 border border-transparent"
        )}
      >
        <TableCellsIcon className="w-3.5 h-3.5 stroke-[1.75] shrink-0" aria-hidden="true" />
        {showLabels && <span className="text-[11px] leading-none">Bảng</span>}
      </button>

      <button
        type="button"
        title="Dạng thẻ lưới (Grid View)"
        aria-label="Dạng thẻ lưới"
        aria-pressed={viewMode === "grid"}
        onClick={() => onViewModeChange("grid")}
        className={cn(
          "inline-flex items-center justify-center gap-1.5 h-6 w-6 px-2 rounded-[2px] transition-all duration-150 cursor-pointer text-xs font-sans",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/20",
          viewMode === "grid"
            ? "bg-primary/20 text-foreground font-semibold border border-primary/50"
            : "text-muted-foreground hover:text-foreground hover:bg-surface-hover/70 border border-transparent"
        )}
      >
        <Squares2X2Icon className="w-3.5 h-3.5 stroke-[1.75] shrink-0" aria-hidden="true" />
        {showLabels && <span className="text-[11px] leading-none">Lưới</span>}
      </button>
    </div>
  );
}

export default ViewSwitcher;
