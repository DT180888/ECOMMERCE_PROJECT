import React, { ReactNode } from "react";
import { cn, Checkbox } from "@my-project/ui";
import type { AdminTableColumn } from "./types";

export interface AdminHorizontalCardProps<T> {
  item: T;
  index: number;
  columns: AdminTableColumn<T>[];
  hasSelection?: boolean;
  isSelected?: boolean;
  isActive?: boolean;
  onSelect?: (checked: boolean) => void;
  onClick?: () => void;
  isDesktop?: boolean;
  className?: string;
}

export function AdminHorizontalCard<T>({
  item,
  index,
  columns,
  hasSelection = false,
  isSelected = false,
  isActive = false,
  onSelect,
  onClick,
  className,
}: AdminHorizontalCardProps<T>) {
  const isClickable = Boolean(onClick);

  // 1:1 Table-to-Card Column Categorization
  const mediaCol = columns.find(
    (c) => c.isMedia || c.key === "image" || c.key === "avatar" || c.key === "thumbnail"
  );
  const actionCol = columns.find((c) => c.isAction || c.key === "actions");
  const mainCol =
    columns.find((c) => c.isMain && c !== mediaCol && c !== actionCol) ||
    columns.find((c) => c !== mediaCol && c !== actionCol) ||
    columns[0];
  const subCols = columns.filter(
    (c) => c.isSub && c !== mainCol && c !== mediaCol && c !== actionCol
  );
  const footerCols = columns.filter(
    (c) => c.isFooter && c !== mainCol && c !== mediaCol && c !== actionCol
  );
  const specCols = columns.filter(
    (c) =>
      c !== mainCol &&
      c !== mediaCol &&
      c !== actionCol &&
      !c.isSub &&
      !c.isFooter
  );

  const renderCell = (col?: AdminTableColumn<T>): ReactNode => {
    if (!col) return null;
    if (col.render) return col.render(item, index);
    if (col.accessor) return String((item as any)[col.accessor] ?? "");
    return null;
  };

  const hasMedia = Boolean(mediaCol);

  // Page-level aspect ratio mapping
  const getMediaAspectClasses = (aspect?: string) => {
    switch (aspect) {
      case "portrait":
        return "aspect-[3/4] w-24 sm:w-28";
      case "video":
        return "aspect-video w-32 sm:w-40";
      case "wide":
        return "aspect-[2/1] w-36 sm:w-44";
      case "square":
      default:
        return "aspect-square w-24 sm:w-28";
    }
  };

  return (
    <div
      onClick={isClickable ? onClick : undefined}
      className={cn(
        "group relative flex transition-all border border-border  duration-200 select-none h-full w-full min-w-0 overflow-hidden font-sans",
        hasMedia ? "flex-row gap-3 md:gap-4" : "flex-col justify-between",
        "p-4 rounded-sm bg-card hover:bg-surface-hover/80 transition-colors shadow-none ",
        isActive
          ? "ring-1 ring-primary bg-primary/5"
          : isSelected
          ? "ring-1 ring-primary/50 bg-primary/5"
          : "",
        isClickable && "cursor-pointer",
        className
      )}
    >
      {/* ── Left Column: Media Stage ── */}
      {hasMedia && mediaCol && (
        <div
          className={cn(
            "relative shrink-0 overflow-hidden rounded-sm bg-surface flex items-center justify-center self-start border-0",
            getMediaAspectClasses(mediaCol.mediaAspect),
            "[&>div]:w-full [&>div]:h-full [&>div]:rounded-none [&>div]:border-0 [&>div]:bg-transparent [&>div]:flex [&>div]:items-center [&>div]:justify-center",
            "[&_img]:w-full [&_img]:h-full [&_img]:object-cover",
            "[&_svg]:w-6 [&_svg]:h-6 [&_svg]:text-muted-foreground/40"
          )}
        >
          {renderCell(mediaCol)}

          {/* Floating Checkbox over media on top-left */}
          {hasSelection && onSelect && (
            <div
              className={cn(
                "absolute top-2 left-2 z-10 p-1 rounded-sm transition-all duration-150 shadow-none",
                isSelected
                  ? "bg-card text-foreground opacity-100"
                  : "bg-card/90 backdrop-blur-sm border border-border-subtle opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <Checkbox
                checked={isSelected}
                onChange={(e) => onSelect(e.target.checked)}
                aria-label={`Chọn mục ${index + 1}`}
              />
            </div>
          )}
        </div>
      )}

      {/* ── Content Column ── */}
      <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
        <div>
          {/* Top Header Row */}
          <div className="flex items-start justify-between gap-2 w-full min-w-0 mb-2">
            <div className="flex items-start gap-2 min-w-0 flex-1">
              {!hasMedia && hasSelection && onSelect && (
                <div
                  className="shrink-0 pt-0.5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Checkbox
                    checked={isSelected}
                    onChange={(e) => onSelect(e.target.checked)}
                    aria-label={`Chọn mục ${index + 1}`}
                  />
                </div>
              )}

              <div className="min-w-0 flex-1 flex flex-col gap-0.5">
                <div className="text-xs sm:text-sm font-semibold text-foreground leading-snug truncate">
                  {renderCell(mainCol)}
                </div>

                {subCols.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap text-xs text-muted-foreground truncate font-sans">
                    {subCols.map((c) => (
                      <span key={c.key} className="truncate">
                        {renderCell(c)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Top-Right Actions Dock */}
            {actionCol && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="shrink-0 ml-auto flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100 transition-opacity duration-150"
              >
                {renderCell(actionCol)}
              </div>
            )}
          </div>

          {/* Specs Box */}
          {specCols.length > 0 && (
            <div className="p-3 rounded-sm bg-surface/50 border-0 space-y-2 font-sans text-xs my-2">
              {specCols.map((col) => {
                const rendered = renderCell(col);
                if (rendered === null || rendered === undefined || rendered === "")
                  return null;

                return (
                  <div
                    key={col.key}
                    className="flex items-center justify-between text-xs gap-3 min-w-0"
                  >
                    <span className="text-xs text-muted-foreground truncate shrink-0">
                      {col.label}
                    </span>
                    <span className="text-xs font-medium text-foreground truncate tabular-nums text-right">
                      {rendered}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Bottom Dock Metrics */}
        {footerCols.length > 0 && (
          <div className="flex items-center justify-between gap-2 mt-auto pt-3 border-t border-border-subtle">
            <div className="flex items-center gap-3 flex-wrap min-w-0">
              {footerCols.map((col) => {
                const rendered = renderCell(col);
                if (rendered === null || rendered === undefined || rendered === "")
                  return null;

                return (
                  <div key={col.key} className="flex items-baseline gap-1.5 min-w-0">
                    {col.label && (
                      <span className="text-xs text-muted-foreground">
                        {col.label}:
                      </span>
                    )}
                    <span className="text-xs font-semibold text-foreground tabular-nums truncate">
                      {rendered}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
