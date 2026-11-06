import React from "react";
import { cn } from "@my-project/ui";

export type AdminStatusVariant = "success" | "error" | "warning" | "info" | "neutral";

export interface AdminStatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: AdminStatusVariant;
  children: React.ReactNode;
  showDot?: boolean;
  className?: string;
}

const variantStyles: Record<AdminStatusVariant, string> = {
  success: "bg-success/10 text-success border border-success/20",
  error: "bg-error/10 text-error border border-error/20",
  warning: "bg-warning/10 text-warning border border-warning/20",
  info: "bg-info/10 text-info border border-info/20",
  neutral: "bg-surface-tertiary text-muted-foreground border border-border",
};

/**
 * AdminStatusBadge
 * Fluent Blue Operational status badge component.
 * Radius sm (4px), 12px typography, with a 6px status signal dot.
 */
export function AdminStatusBadge({
  variant = "neutral",
  children,
  showDot = true,
  className,
  ...props
}: AdminStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-sm text-xs font-sans font-medium select-none shrink-0 transition-colors",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {showDot && (
        <span
          className="w-1.5 h-1.5 rounded-full bg-current shrink-0"
          aria-hidden="true"
        />
      )}
      <span className="truncate">{children}</span>
    </span>
  );
}

export default AdminStatusBadge;
