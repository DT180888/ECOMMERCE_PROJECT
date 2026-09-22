import { type ElementType, type ReactNode } from "react";
import { cn } from "../lib/utils";

interface AdminEmptyStateProps {
  icon?: ElementType;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

/**
 * AdminEmptyState
 * Consistent empty state for all admin tables and lists.
 * Teaches the interface rather than just saying "nothing here".
 */
export function AdminEmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: AdminEmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-20 px-6 text-center select-none",
        className
      )}
    >
      {Icon && (
        <div className="w-12 h-12 rounded-full bg-foreground/[0.03] flex items-center justify-center mb-2">
          <Icon className="w-6 h-6 text-muted-foreground/80" aria-hidden="true" />
        </div>
      )}
      <p className="text-sm font-medium text-foreground">{title}</p>
      {description && (
        <p className="text-xs text-muted-foreground max-w-[260px]">{description}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
