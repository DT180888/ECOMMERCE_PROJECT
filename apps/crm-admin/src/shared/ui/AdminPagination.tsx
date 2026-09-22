import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { Button } from "@my-project/ui";
import { cn } from "../lib/utils";

interface AdminPaginationProps {
  page: number;
  totalPages: number;
  total?: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  className?: string;
}

/**
 * AdminPagination
 * Standardised pagination footer for all admin list pages.
 * Shows "Hiển thị X–Y / Z" info + Prev/Next buttons.
 */
export function AdminPagination({
  page,
  totalPages,
  total,
  pageSize,
  onPageChange,
  className,
}: AdminPaginationProps) {
  if (totalPages <= 0) return null;

  const from = total && pageSize ? Math.min((page - 1) * pageSize + 1, total) : null;
  const to   = total && pageSize ? Math.min(page * pageSize, total) : null;

  return (
    <div
      className={cn(
        "flex flex-row items-center justify-between gap-3 sm:gap-0 px-3 py-1.5 md:px-6 md:py-3 shrink-0",
        className
      )}
    >
      {/* Info */}
      <span className="text-xs text-muted-foreground tabular-nums">
        {from && to && total ? (
          <>
            Hiển thị{" "}
            <span className="font-medium text-foreground">{from}</span>
            {" – "}
            <span className="font-medium text-foreground">{to}</span>
            {" / "}
            <span className="font-medium text-foreground">{total}</span>
          </>
        ) : (
          <>
            Trang{" "}
            <span className="font-medium text-foreground">{page}</span>
            {" / "}
            <span className="font-medium text-foreground">{totalPages}</span>
          </>
        )}
      </span>

      {/* Controls */}
      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(Math.max(1, page - 1))}
          className="h-4 w-4 md:h-8 md:w-8 p-0 rounded-inner bg-background text-muted-foreground hover:text-foreground active:scale-[0.98] transition-all disabled:opacity-30 disabled:shadow-none disabled:scale-100"
          aria-label="Trang trước"
        >
          <ChevronLeftIcon className="h-3.5 w-3.5" />
        </Button>

        {/* Page number pills — show up to 5 */}
        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
          let p: number;
          if (totalPages <= 5) {
            p = i + 1;
          } else if (page <= 3) {
            p = i + 1;
          } else if (page >= totalPages - 2) {
            p = totalPages - 4 + i;
          } else {
            p = page - 2 + i;
          }
          const isCurrent = p === page;
          return (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={cn(
                "h-6 md:h-8 w-6 md:w-8 px-2 rounded-inner text-xs font-semibold transition-all duration-200 tabular-nums focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98]",
                isCurrent
                  ? "bg-primary text-primary-foreground border border-primary shadow-none"
                  : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-foreground/[0.03] border border-transparent shadow-none"
              )}
              aria-current={isCurrent ? "page" : undefined}
            >
              {p}
            </button>
          );
        })}

        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          className="h-6 md:h-8 w-6 md:w-8 rounded-inner bg-background text-muted-foreground hover:text-foreground active:scale-[0.98] transition-all disabled:opacity-30 disabled:shadow-none disabled:scale-100"
          aria-label="Trang sau"
        >
          <ChevronRightIcon className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
