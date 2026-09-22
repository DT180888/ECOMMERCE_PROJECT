import { type ReactNode, type ElementType } from "react";
import { cn } from "../lib/utils";

interface AdminPageShellProps {
  /** Icon component (from @heroicons/react/24/outline) */
  icon?: ElementType;
  title: string;
  subtitle?: string;
  /** Short count badge text, e.g. "42 sản phẩm" */
  badge?: ReactNode;
  /** Right-side action buttons */
  actions?: ReactNode;
  /** Filter bar below the header */
  filterBar?: ReactNode;
  /** Main content (table etc.) */
  children: ReactNode;
  className?: string;
  noCard?: boolean;
  /** Enable sticky header with glassmorphism when scrolling */
  stickyHeader?: boolean;
  /** Hide main header and render nested sub-controls bar when embedded in settings tabs */
  isNested?: boolean;
  /** Custom class name for the children container */
  contentClassName?: string;
}

/**
 * AdminPageShell
 * Standard layout shell for all admin list/overview pages.
 */
export function AdminPageShell({
  icon: Icon,
  title,
  badge,
  actions,
  filterBar,
  children,
  className,
  noCard = false,
  stickyHeader = true,
  isNested = false,
  contentClassName,
}: AdminPageShellProps) {
  return (
    <div className={cn("flex flex-col w-full h-full", className)}>
      {/* ── Header & Filter Bar (Standalone only) ── */}
      {!isNested && (
        <div
          className={cn(
            "flex flex-col shrink-0 transition-all duration-200",
            stickyHeader && "sticky top-0 z-20"
          )}
        >
          <div className="flex flex-col gap-3 py-3 px-4 md:py-3.5 admin-surface backdrop-blur-md border-b border-neo-bevel">
            <div className="flex justify-between items-center flex-wrap xl:justify-between items-start xl:items-center gap-3 md:gap-4 w-full">
              <div className="flex items-start sm:items-center gap-3">
                {Icon && (
                  <div className="p-1 md:p-2 rounded-card bg-background dark:bg-white/[0.03] text-foreground shrink-0 border border-neo-bevel shadow-none mt-0.5 sm:mt-0">
                    <Icon className="w-3 h-3 md:w-4 md:h-4 animate-float" strokeWidth={1.5} aria-hidden="true" />
                  </div>
                )}
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h1 className="text-sm sm:text-sm md:text-base font-bold font-display text-foreground tracking-tight leading-tight">
                      {title}
                    </h1>
                    {badge && (
                      <span className="px-2.5 py-0.5 rounded-full bg-accent/10 text-accent text-[10px] font-bold tracking-wide uppercase border border-accent/20">
                        {badge}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {actions && (
                <div className="flex flex-wrap items-center gap-2 shrink-0 w-full md:w-auto justify-between sm:justify-end">
                  {actions}
                </div>
              )}
            </div>
          </div>
          
          {filterBar && (
            <div className="shrink-0 w-full">
              {filterBar}
            </div>
          )}
        </div>
      )}

      {/* ── Nested Controls Bar (Nested only) ── */}
      {isNested && (actions || filterBar) && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shrink-0 w-full bg-card p-3 rounded-card border-neo-bevel shadow-none">
          <div className="flex items-center gap-2.5">
            {Icon && (
              <Icon className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} aria-hidden="true" />
            )}
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-muted-foreground">
              {title}
            </span>
            {badge && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase badge-blue shadow-none border border-border/50">
                {badge}
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-start sm:justify-end">
            {actions}
          </div>
        </div>
      )}

      {/* ── Filter Bar (Nested only) ── */}
      {isNested && filterBar && (
        <div className="shrink-0 w-full">
          {filterBar}
        </div>
      )}

      <div className={cn(
        "flex-1 flex flex-col min-h-0 relative",
        !isNested && "pt-3 md:pt-4",
        !noCard && " shadow-none rounded-card lg:overflow-hidden",
        contentClassName
      )}>
        {children}
      </div>
    </div>
  );
}
