import { type ElementType, type ReactNode } from "react";
import { cn } from "@my-project/ui";

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
        <div className="w-10 h-10 rounded-[2px] bg-surface border border-border flex items-center justify-center mb-1">
          <Icon className="w-5 h-5 text-muted-foreground/80 stroke-[1.25]" aria-hidden="true" />
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
