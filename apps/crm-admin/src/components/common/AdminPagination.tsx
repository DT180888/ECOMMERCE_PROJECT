import { ReactNode } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  cn,
} from "@my-project/ui";

export interface AdminPaginationProps {
  page: number;
  totalPages: number;
  total?: number;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  viewSwitcher?: ReactNode;
  className?: string;
}

const pad = (n: number) => String(n);

/**
 * AdminPagination
 * Pure Editorial Minimalist Data Dock:
 * - Flat 100% (zero drop shadows, 1px hairline border)
 * - Standardized 40px (h-10) footer height
 * - High-contrast ink typography with tabular-nums
 * - Responsive Stepper on mobile (< md) and flat controls on desktop (>= md)
 */
export function AdminPagination({
  page,
  totalPages,
  total,
  pageSize,
  pageSizeOptions = [10, 20, 50],
  onPageChange,
  onPageSizeChange,
  viewSwitcher,
  className,
}: AdminPaginationProps) {
  if (totalPages <= 0 && !viewSwitcher) return null;

  const from = total && pageSize ? Math.min((page - 1) * pageSize + 1, total) : null;
  const to = total && pageSize ? Math.min(page * pageSize, total) : null;

  // Compute pages to display (up to 5 items)
  let pages: number[] = [];
  if (totalPages <= 5) {
    pages = Array.from({ length: Math.max(0, totalPages) }, (_, i) => i + 1);
  } else if (page <= 3) {
    pages = [1, 2, 3, 4, 5];
  } else if (page >= totalPages - 2) {
    pages = [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  } else {
    pages = [page - 2, page - 1, page, page + 1, page + 2];
  }

  return (
    <>
      {/* ── Mobile View (<768px): Compact Stepper with Quick Jump Dropdown ── */}
      <div
        className={cn(
          "md:hidden flex items-center justify-between w-full h-10 px-3 shrink-0 bg-card border border-border rounded-sm select-none text-xs font-sans",
          className
        )}
      >
        {/* Previous Button */}
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(Math.max(1, page - 1))}
          className="h-7 w-7 min-w-[28px] rounded-sm bg-surface border border-border text-foreground hover:bg-surface-hover disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center transition-colors shrink-0 cursor-pointer"
          title="Trang trước"
          aria-label="Trang trước"
        >
          <ChevronLeftIcon className="h-3.5 w-3.5 stroke-[1.5]" />
        </button>

        {/* Center: Quick Page Jump Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="h-7 px-2.5 rounded-sm bg-surface border border-border text-foreground hover:bg-surface-hover flex items-center gap-1.5 transition-colors text-xs font-medium cursor-pointer"
              title="Bấm để nhảy đến trang nhanh"
            >
              <span className="font-mono tabular-nums">
                {pad(page)} <span className="text-muted-foreground font-normal">/</span> {pad(Math.max(1, totalPages))}
              </span>
              {total !== undefined && (
                <span className="text-[11px] text-muted-foreground font-mono tabular-nums">
                  ({total})
                </span>
              )}
              <ChevronDownIcon className="w-3 h-3 stroke-[1.5] text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            side="top"
            align="center"
            sideOffset={6}
            className="max-h-56 w-36 overflow-y-auto rounded-sm border-border bg-card shadow-md"
          >
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <DropdownMenuItem
                key={p}
                onClick={() => onPageChange(p)}
                className={cn(
                  "flex items-center justify-between py-1.5 px-2.5 rounded-[2px] text-xs cursor-pointer font-mono tabular-nums",
                  p === page && "bg-surface font-semibold text-foreground"
                )}
              >
                <span>Trang {pad(p)}</span>
                {p === page && <span className="w-1.5 h-1.5 bg-foreground rounded-full" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Next Button */}
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          className="h-7 w-7 min-w-[28px] rounded-sm bg-surface border border-border text-foreground hover:bg-surface-hover disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center transition-colors shrink-0 cursor-pointer"
          title="Trang sau"
          aria-label="Trang sau"
        >
          <ChevronRightIcon className="h-3.5 w-3.5 stroke-[1.5]" />
        </button>
      </div>

      {/* ── Desktop View (>=768px): Flat Hairline Editorial Dock ── */}
      <div
        className={cn(
          "hidden md:flex items-center justify-between gap-3 h-10 px-4 shrink-0 bg-card select-none text-xs font-sans",
          className
        )}
      >
        {/* Left: Counter, Page Size Selector & View Switcher */}
        <div className="flex items-center gap-3">
          {/* Index Counter */}
          <span className="text-xs text-muted-foreground">
            {from && to && total ? (
              <>
                Hiển thị <span className="font-mono font-medium text-foreground tabular-nums">{from}–{to}</span> trên <span className="font-mono font-medium text-foreground tabular-nums">{total}</span> kết quả
              </>
            ) : (
              <>
                Trang <span className="font-mono font-medium text-foreground tabular-nums">{page}</span> / <span className="font-mono font-medium text-foreground tabular-nums">{Math.max(1, totalPages)}</span>
              </>
            )}
          </span>

          {/* Divider */}
          {onPageSizeChange && pageSize && (
            <span className="w-px h-3.5 bg-border shrink-0" />
          )}

          {/* Page Size Selector */}
          {onPageSizeChange && pageSize && (
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-muted-foreground">
                Số hàng:
              </span>
              <div className="inline-flex items-center gap-0.5 p-0.5 bg-background border border-border rounded-sm select-none">
                {pageSizeOptions.map((opt) => {
                  const isCurrent = opt === pageSize;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => onPageSizeChange(opt)}
                      className={cn(
                        "h-[22px] px-1.5 text-[11px] font-mono tabular-nums rounded-[2px] transition-colors cursor-pointer",
                        isCurrent
                          ? "bg-surface text-foreground font-semibold border border-border"
                          : "text-muted-foreground hover:text-foreground hover:bg-surface-hover/70"
                      )}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Divider */}
          {viewSwitcher && (
            <span className="w-px h-3.5 bg-border shrink-0" />
          )}

          {/* View Switcher */}
          {viewSwitcher && (
            <div className="flex items-center">
              {viewSwitcher}
            </div>
          )}
        </div>

        {/* Right: Controls & Page Buttons */}
        {totalPages > 0 && (
          <div className="flex items-center gap-1.5">
            {/* Previous Button */}
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => onPageChange(Math.max(1, page - 1))}
              className="h-[28px] px-2 text-xs font-medium rounded-sm border border-border bg-card text-foreground hover:bg-surface-hover disabled:opacity-30 disabled:pointer-events-none transition-colors inline-flex items-center gap-1 cursor-pointer"
              aria-label="Trang trước"
            >
              <ChevronLeftIcon className="h-3.5 w-3.5 stroke-[1.5]" />
              <span className="hidden lg:inline text-[11px]">Trước</span>
            </button>

            {/* Page Number Buttons */}
            <div className="flex items-center gap-1">
              {pages.map((p) => {
                const isCurrent = p === page;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => onPageChange(p)}
                    className={cn(
                      "h-[28px] min-w-[28px] px-2 text-xs font-mono tabular-nums rounded-[2px] transition-colors flex items-center justify-center cursor-pointer",
                      isCurrent
                        ? "bg-foreground text-background font-semibold"
                        : "border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-surface-hover"
                    )}
                    aria-current={isCurrent ? "page" : undefined}
                  >
                    <span>{pad(p)}</span>
                  </button>
                );
              })}
            </div>

            {/* Next Button */}
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => onPageChange(Math.min(totalPages, page + 1))}
              className="h-[28px] px-2 text-xs font-medium rounded-sm border border-border bg-card text-foreground hover:bg-surface-hover disabled:opacity-30 disabled:pointer-events-none transition-colors inline-flex items-center gap-1 cursor-pointer"
              aria-label="Trang sau"
            >
              <span className="hidden lg:inline text-[11px]">Sau</span>
              <ChevronRightIcon className="h-3.5 w-3.5 stroke-[1.5]" />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
